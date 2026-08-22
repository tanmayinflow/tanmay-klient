// Booking · every query, in one place, always parameterised.
//
// Nothing above this file writes SQL, so there is exactly one place where an
// index has to match a WHERE clause and exactly one place where a value could
// be concatenated into a statement — and it never is.

import { ACTIVE_STATUSES } from "../../src/booking/types.js";

const ACTIVE_IN = ACTIVE_STATUSES.map(() => "?").join(",");

export const nowMs = () => Date.now();

export function newId(prefix) {
  const r = new Uint8Array(9);
  crypto.getRandomValues(r);
  let s = "";
  for (const b of r) s += "0123456789abcdefghijklmnopqrstuvwxyz"[b % 36];
  return (prefix ? prefix + "_" : "") + Date.now().toString(36) + s;
}

const rows = async (db, sql, args) => ((await db.prepare(sql).bind(...args).all()).results || []);
const one = (db, sql, args) => db.prepare(sql).bind(...args).first();

// ---- Services and locations ----------------------------------------------
export const listServices = (db, opts = {}) => rows(db,
  "SELECT * FROM booking_services" + (opts.activeOnly ? " WHERE active = 1" : "") + " ORDER BY sort_order, name_cs", []);
export const getService = (db, id) => one(db, "SELECT * FROM booking_services WHERE id = ?", [id]);

export const listLocations = (db, opts = {}) => rows(db,
  "SELECT * FROM booking_locations" + (opts.activeOnly ? " WHERE active = 1" : "") + " ORDER BY sort_order, name_cs", []);
export const getLocation = (db, id) => (id ? one(db, "SELECT * FROM booking_locations WHERE id = ?", [id]) : Promise.resolve(null));

export const locationsForService = (db, serviceId) => rows(db,
  `SELECT l.* FROM booking_locations l
     JOIN booking_service_locations sl ON sl.location_id = l.id
    WHERE sl.service_id = ? AND l.active = 1
    ORDER BY l.sort_order, l.name_cs`, [serviceId]);

export const serviceAllowsLocation = async (db, serviceId, locationId) => {
  if (!locationId) return true;
  const r = await one(db, "SELECT 1 AS ok FROM booking_service_locations WHERE service_id = ? AND location_id = ?", [serviceId, locationId]);
  return !!r;
};

// ---- Availability ---------------------------------------------------------
export const listRules = (db) => rows(db, "SELECT * FROM booking_availability_rules WHERE active = 1", []);
export const listOverrides = (db, fromDate, toDate) => rows(db,
  "SELECT * FROM booking_availability_overrides WHERE active = 1 AND date_local >= ? AND date_local <= ?", [fromDate, toDate]);
export const listBlocks = (db, fromMs, toMs) => rows(db,
  "SELECT * FROM booking_blocks WHERE ends_at_utc > ? AND starts_at_utc < ? ORDER BY starts_at_utc", [fromMs, toMs]);

// ---- Clients --------------------------------------------------------------
export const getClient = (db, id) => one(db, "SELECT * FROM booking_clients WHERE id = ?", [id]);
export const clientByAccount = (db, accountUserId) => one(db,
  "SELECT * FROM booking_clients WHERE account_user_id = ?", [accountUserId]);
export const clientByProfile = (db, profileId) => one(db,
  "SELECT * FROM booking_clients WHERE coach_profile_id = ?", [profileId]);
export const listClients = (db) => rows(db, "SELECT * FROM booking_clients ORDER BY name, email", []);

// ---- Bookings -------------------------------------------------------------
export const getBooking = (db, id) => one(db, "SELECT * FROM bookings WHERE id = ?", [id]);

export const activeBookingsBetween = (db, fromMs, toMs) => rows(db,
  `SELECT b.*, s.buffer_before_min AS s_before, s.buffer_after_min AS s_after,
          l.buffer_before_min AS l_before, l.buffer_after_min AS l_after
     FROM bookings b
     JOIN booking_services s ON s.id = b.service_id
     LEFT JOIN booking_locations l ON l.id = b.location_id
    WHERE b.status IN (${ACTIVE_IN}) AND b.ends_at_utc > ? AND b.starts_at_utc < ?
    ORDER BY b.starts_at_utc`, [...ACTIVE_STATUSES, fromMs, toMs]);

export const bookingsForClient = (db, clientId, opts = {}) => rows(db,
  `SELECT * FROM bookings WHERE client_id = ?` +
  (opts.fromMs != null ? " AND starts_at_utc >= ?" : "") +
  ` ORDER BY starts_at_utc ${opts.desc ? "DESC" : "ASC"} LIMIT ?`,
  opts.fromMs != null ? [clientId, opts.fromMs, opts.limit || 200] : [clientId, opts.limit || 200]);

export const bookingsBetween = (db, fromMs, toMs) => rows(db,
  `SELECT * FROM bookings WHERE ends_at_utc > ? AND starts_at_utc < ? ORDER BY starts_at_utc`, [fromMs, toMs]);

export const bookingsOnLocalDate = (db, dateISO) => rows(db,
  "SELECT * FROM bookings WHERE local_date = ? ORDER BY starts_at_utc", [dateISO]);

export const countActiveOnDate = async (db, dateISO, serviceId) => {
  const r = await one(db,
    `SELECT COUNT(*) AS n FROM bookings WHERE local_date = ? AND service_id = ? AND status IN (${ACTIVE_IN})`,
    [dateISO, serviceId, ...ACTIVE_STATUSES]);
  return (r && Number(r.n)) || 0;
};
export const countActiveBetween = async (db, fromMs, toMs, serviceId) => {
  const r = await one(db,
    `SELECT COUNT(*) AS n FROM bookings WHERE starts_at_utc >= ? AND starts_at_utc < ? AND service_id = ? AND status IN (${ACTIVE_IN})`,
    [fromMs, toMs, serviceId, ...ACTIVE_STATUSES]);
  return (r && Number(r.n)) || 0;
};

export const pendingBookings = (db) => rows(db,
  "SELECT * FROM bookings WHERE status = 'REQUESTED' ORDER BY starts_at_utc", []);
export const syncErrorBookings = (db) => rows(db,
  "SELECT * FROM bookings WHERE sync_status = 'ERROR' ORDER BY starts_at_utc DESC LIMIT 50", []);
export const unpaidBookings = (db, beforeMs) => rows(db,
  `SELECT * FROM bookings
    WHERE payment_status IN ('OPEN','UNKNOWN') AND price_minor > 0
      AND status IN ('COMPLETED','NO_SHOW','LATE_CANCEL') AND starts_at_utc < ?
    ORDER BY starts_at_utc DESC LIMIT 100`, [beforeMs]);

// ---- Packages and ledger --------------------------------------------------
export const listPackageDefinitions = (db, opts = {}) => rows(db,
  "SELECT * FROM package_definitions" + (opts.activeOnly ? " WHERE active = 1" : "") + " ORDER BY sort_order", []);

export const packagesOfClient = (db, clientId) => rows(db,
  "SELECT * FROM client_packages WHERE client_id = ? ORDER BY purchased_at DESC", [clientId]);

export const packageServiceIds = async (db, clientPackageId) =>
  (await rows(db, "SELECT service_id FROM client_package_services WHERE client_package_id = ?", [clientPackageId]))
    .map((r) => r.service_id);

export async function packagesWithServices(db, clientId) {
  const list = await packagesOfClient(db, clientId);
  const links = await rows(db,
    `SELECT cps.client_package_id AS pid, cps.service_id
       FROM client_package_services cps
       JOIN client_packages cp ON cp.id = cps.client_package_id
      WHERE cp.client_id = ?`, [clientId]);
  const by = {};
  for (const l of links) (by[l.pid] = by[l.pid] || []).push(l.service_id);
  return list.map((p) => ({ ...p, eligible_service_ids: by[p.id] || [] }));
}

export const ledgerOfClient = (db, clientId, limit) => rows(db,
  "SELECT * FROM credit_ledger WHERE client_id = ? ORDER BY created_at DESC, id DESC LIMIT ?", [clientId, limit || 500]);
export const ledgerAll = (db, clientId) => rows(db,
  "SELECT * FROM credit_ledger WHERE client_id = ?", [clientId]);
export const ledgerForBooking = (db, bookingId) => rows(db,
  "SELECT * FROM credit_ledger WHERE booking_id = ? ORDER BY created_at", [bookingId]);

// ---- Events ---------------------------------------------------------------
export const eventsOfBooking = (db, bookingId) => rows(db,
  "SELECT * FROM booking_events WHERE booking_id = ? ORDER BY created_at, id", [bookingId]);

// ---- Statement builders (used inside batches) -----------------------------
// Everything that writes returns a prepared statement rather than running, so
// the caller can put the whole intent into one D1 batch and get one
// transaction out of it.

export const stInsertLock = (db, bookingId, resourceKey, cell) =>
  db.prepare("INSERT INTO booking_slot_locks (booking_id, resource_key, slot_cell) VALUES (?, ?, ?)")
    .bind(bookingId, resourceKey, cell);

export const stDeleteLocks = (db, bookingId) =>
  db.prepare("DELETE FROM booking_slot_locks WHERE booking_id = ?").bind(bookingId);

// ---- Statements that only fire if the guarded UPDATE actually landed -------
// Inside a batch, the status UPDATE runs first and carries the state we read
// in its WHERE clause. If somebody else got there first it matches no rows —
// and then every statement after it must do nothing at all. Without this, a
// cancellation that lost the race would still delete the winner's lock rows
// and still write a credit release.
//
// The guard is the whole post-state, not only the version: two requests that
// arrive together are both trying to create version N, so the version alone
// cannot tell the winner from the loser. What differs is what they were
// trying to make true — a status for a transition, a start time for a
// reschedule — and that is what each statement checks.

const guardSql = (col) => `(SELECT ${col} FROM bookings WHERE id = ? AND version = ?) = ?`;

export const stDeleteLocksIfState = (db, bookingId, version, status) =>
  db.prepare(`DELETE FROM booking_slot_locks WHERE booking_id = ? AND ${guardSql("status")}`)
    .bind(bookingId, bookingId, version, status);

export const stInsertLockIfState = (db, bookingId, resourceKey, cell, version, startsAt) =>
  db.prepare(`INSERT INTO booking_slot_locks (booking_id, resource_key, slot_cell)
              SELECT ?, ?, ? WHERE ${guardSql("starts_at_utc")}`)
    .bind(bookingId, resourceKey, cell, bookingId, version, startsAt);

export const stDeleteLocksIfMoved = (db, bookingId, version, startsAt) =>
  db.prepare(`DELETE FROM booking_slot_locks WHERE booking_id = ? AND ${guardSql("starts_at_utc")}`)
    .bind(bookingId, bookingId, version, startsAt);

export const stInsertLedgerIfState = (db, l, bookingId, version, status) =>
  db.prepare(`INSERT INTO credit_ledger
                (id, client_id, client_package_id, booking_id, kind, units, reason, created_by, created_at, idempotency_key)
              SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
               WHERE ${guardSql("status")}
              ON CONFLICT(idempotency_key) DO NOTHING`)
    .bind(l.id, l.client_id, l.client_package_id || null, l.booking_id || null, l.kind, l.units,
          l.reason || "", l.created_by || "SYSTEM", l.created_at, l.idempotency_key, bookingId, version, status);

// The audit entry and the calendar job belong to the request that actually
// won. A loser writing them meant a cancellation that changed nothing still
// queued a CANCEL against the winner's version — and because the outbox
// de-duplicates on (booking, action, version), that job was live. The
// confirmed session then vanished from the calendar it had just appeared in.
export const stInsertEventIfState = (db, e, version, status) =>
  db.prepare(`INSERT INTO booking_events (id, booking_id, type, actor_type, actor_id, payload_json, created_at)
              SELECT ?, ?, ?, ?, ?, ?, ? WHERE ${guardSql("status")}
              ON CONFLICT(id) DO NOTHING`)
    .bind(e.id, e.booking_id, e.type, e.actor_type, e.actor_id || "", JSON.stringify(e.payload || {}), e.created_at,
          e.booking_id, version, status);

export const stOutboxIfState = (db, o, version, status) =>
  db.prepare(`INSERT INTO calendar_outbox
                (id, booking_id, action, booking_version, payload_hash, attempts, next_attempt_at, status, last_error, created_at, updated_at)
              SELECT ?, ?, ?, ?, '', 0, ?, 'PENDING', '', ?, ?
               WHERE ${guardSql("status")}
              ON CONFLICT(booking_id, action, booking_version) DO NOTHING`)
    .bind(o.id, o.booking_id, o.action, o.booking_version, o.next_attempt_at, o.created_at, o.created_at,
          o.booking_id, version, status);

// The credit hold decides whether the booking exists at all. Reading the
// balance before the batch is not enough: two requests a millisecond apart
// both read the same balance and both hold against it, and a client with one
// credit walks away with three bookings and a balance of minus two. So the
// hold is written first, conditional on the balance inside the transaction,
// and everything else is conditional on the hold.
export const stHoldIfBalance = (db, l, needUnits) =>
  db.prepare(`INSERT INTO credit_ledger
                (id, client_id, client_package_id, booking_id, kind, units, reason, created_by, created_at, idempotency_key)
              SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
               WHERE (SELECT COALESCE(SUM(units), 0) FROM credit_ledger WHERE client_id = ?) >= ?`)
    .bind(l.id, l.client_id, l.client_package_id || null, l.booking_id || null, l.kind, l.units,
          l.reason || "", l.created_by || "SYSTEM", l.created_at, l.idempotency_key,
          l.client_id, needUnits);

export const stInsertEventIfMoved = (db, e, version, startsAt) =>
  db.prepare(`INSERT INTO booking_events (id, booking_id, type, actor_type, actor_id, payload_json, created_at)
              SELECT ?, ?, ?, ?, ?, ?, ? WHERE ${guardSql("starts_at_utc")}
              ON CONFLICT(id) DO NOTHING`)
    .bind(e.id, e.booking_id, e.type, e.actor_type, e.actor_id || "", JSON.stringify(e.payload || {}), e.created_at,
          e.booking_id, version, startsAt);

export const stOutboxIfMoved = (db, o, version, startsAt) =>
  db.prepare(`INSERT INTO calendar_outbox
                (id, booking_id, action, booking_version, payload_hash, attempts, next_attempt_at, status, last_error, created_at, updated_at)
              SELECT ?, ?, ?, ?, '', 0, ?, 'PENDING', '', ?, ?
               WHERE ${guardSql("starts_at_utc")}
              ON CONFLICT(booking_id, action, booking_version) DO NOTHING`)
    .bind(o.id, o.booking_id, o.action, o.booking_version, o.next_attempt_at, o.created_at, o.created_at,
          o.booking_id, version, startsAt);

export const stInsertEvent = (db, e) =>
  db.prepare(`INSERT INTO booking_events (id, booking_id, type, actor_type, actor_id, payload_json, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?)`)
    .bind(e.id, e.booking_id, e.type, e.actor_type, e.actor_id || "", JSON.stringify(e.payload || {}), e.created_at);

export const stInsertLedger = (db, l) =>
  db.prepare(`INSERT INTO credit_ledger
                (id, client_id, client_package_id, booking_id, kind, units, reason, created_by, created_at, idempotency_key)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(l.id, l.client_id, l.client_package_id || null, l.booking_id || null, l.kind, l.units,
          l.reason || "", l.created_by || "SYSTEM", l.created_at, l.idempotency_key);

export const stOutbox = (db, o) =>
  db.prepare(`INSERT INTO calendar_outbox
                (id, booking_id, action, booking_version, payload_hash, attempts, next_attempt_at, status, last_error, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, 0, ?, 'PENDING', '', ?, ?)
              ON CONFLICT(booking_id, action, booking_version) DO NOTHING`)
    .bind(o.id, o.booking_id, o.action, o.booking_version, o.payload_hash || "", o.next_attempt_at, o.created_at, o.created_at);

export const stStatus = (db, id, status, at, extra = {}) =>
  db.prepare(`UPDATE bookings SET status = ?, updated_at = ?, version = version + 1,
                cancelled_at = COALESCE(?, cancelled_at), cancel_reason = COALESCE(?, cancel_reason),
                sync_status = COALESCE(?, sync_status)
              WHERE id = ? AND status = ?`)
    .bind(status, at, extra.cancelled_at ?? null, extra.cancel_reason ?? null, extra.sync_status ?? null, id, extra.expectStatus);

// Asking for a job that has already run. `stOutbox` deliberately does nothing
// on a duplicate — that is what keeps a retry from queueing twice — but a
// deliberate re-request needs the opposite: wake the finished job up again.
// Without this, both the recreated-calendar path and `reconcile` looked like
// they had queued something and had in fact queued nothing at all.
export const stOutboxAgain = (db, o) =>
  db.prepare(`INSERT INTO calendar_outbox
                (id, booking_id, action, booking_version, payload_hash, attempts, next_attempt_at, status, last_error, created_at, updated_at)
              VALUES (?, ?, ?, ?, '', 0, ?, 'PENDING', '', ?, ?)
              ON CONFLICT(booking_id, action, booking_version) DO UPDATE SET
                status = 'PENDING', attempts = 0, next_attempt_at = excluded.next_attempt_at,
                last_error = '', updated_at = excluded.updated_at`)
    .bind(o.id, o.booking_id, o.action, o.booking_version, o.next_attempt_at, o.created_at, o.created_at);

export const dueOutbox = (db, atMs, limit) => rows(db,
  "SELECT * FROM calendar_outbox WHERE status = 'PENDING' AND next_attempt_at <= ? ORDER BY next_attempt_at LIMIT ?", [atMs, limit || 10]);

// ---- Idempotency and rate ------------------------------------------------
export async function rememberIdempotent(db, key, scope, result) {
  if (!key) return;
  await db.prepare("INSERT INTO booking_idempotency (key, scope, result_json, created_at) VALUES (?, ?, ?, ?) ON CONFLICT(key) DO NOTHING")
    .bind(key, scope, JSON.stringify(result || {}), Date.now()).run();
}
export async function recallIdempotent(db, key, scope) {
  if (!key) return null;
  const r = await one(db, "SELECT result_json FROM booking_idempotency WHERE key = ? AND scope = ?", [key, scope]);
  if (!r) return null;
  try { return JSON.parse(r.result_json); } catch (e) { return null; }
}

/**
 * A window that counts. Not a defence against a determined attacker — every
 * caller is already behind Cloudflare Access — but enough that a stuck
 * retry loop cannot walk the whole calendar or hammer Google.
 */
export async function rateLimit(db, bucket, limit, windowMs) {
  const now = Date.now();
  const row = await one(db, "SELECT count, window_at FROM booking_rate WHERE bucket = ?", [bucket]);
  if (!row || now - Number(row.window_at) > windowMs) {
    await db.prepare("INSERT INTO booking_rate (bucket, count, window_at) VALUES (?, 1, ?) ON CONFLICT(bucket) DO UPDATE SET count = 1, window_at = excluded.window_at")
      .bind(bucket, now).run();
    return { ok: true, remaining: limit - 1 };
  }
  const n = Number(row.count) + 1;
  await db.prepare("UPDATE booking_rate SET count = ? WHERE bucket = ?").bind(n, bucket).run();
  return { ok: n <= limit, remaining: Math.max(0, limit - n) };
}
