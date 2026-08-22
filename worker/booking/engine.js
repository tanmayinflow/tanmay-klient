// Booking · the transaction.
//
// Everything a booking needs to be true at once is written in one D1 batch,
// and D1 says plainly what that means: "Batched statements are SQL
// transactions. If a statement in the sequence fails, then an error is
// returned for that specific statement, and it aborts or rolls back the
// entire sequence."
//
// So the booking, its credit hold, its lock rows, its audit entry and its
// calendar job either all exist or none of them do. The unique index over
// (resource_key, slot_cell) is what turns "we checked and it was free" into
// "nobody else can have taken it": two requests that want the same minute
// both try to write the same lock row, one wins, and the other's whole batch
// is rolled back and answered with 409 SLOT_TAKEN.
//
// A frontend check is not protection. Nothing in this file trusts one.

import {
  BOOKING_STATUS, CONFIRMATION_MODE, LEDGER_KIND, ACTOR, BOOKING_EVENT,
  ERR, SYNC_STATUS, OUTBOX_ACTION, PAYMENT_STATUS, PAYMENT_METHOD, MS_PER_MIN,
  SLOT_GRID_MIN, DEFAULT_TIMEZONE, PACKAGE_STATUS,
} from "../../src/booking/types.js";
import {
  localDateISO, startOfLocalDay, endOfLocalDay, shiftDateISO, startOfISOWeek,
  gridCells, zonedToUtc,
} from "../../src/booking/time.js";
import { protectedInterval, validateStart, slotsOverRange, mergeIntervals } from "../../src/booking/slots.js";
import { balanceOf, allocatePackage, makeEntry, cancellationPreview, noShowPreview } from "../../src/booking/credits.js";
import { transitionFor, ledgerForOutcome } from "../../src/booking/status.js";
import * as R from "./repo.js";

// One coach, so one resource. The column stays because a second room or a
// second pair of hands is a row, not a rewrite.
export const RESOURCE_KEY = "coach";

export class BookingError extends Error {
  constructor(code, detail) {
    super(code);
    this.name = "BookingError";
    this.code = code;
    this.detail = detail || null;
  }
}
const fail = (code, detail) => { throw new BookingError(code, detail); };

// A collision on the slot lock, and nothing else. The message names the table
// or at least the column, in every driver that reports the constraint at all.
// This used to match any constraint failure, which quietly turned a foreign
// key fault and a duplicate idempotency key into "somebody was faster" —
// so a losing cancel told the client their time had been taken and sent them
// back to search for slots over a booking that no longer existed.
const isLockConflict = (e) => {
  const m = String((e && e.message) || "").toLowerCase();
  if (!/unique|constraint/.test(m)) return false;
  return m.includes("booking_slot_locks") || m.includes("slot_cell");
};

// ---- Busy ----------------------------------------------------------------
/**
 * Everything that occupies time in a range: the protected interval of every
 * booking that still holds its slot, plus manual, recurring and mirrored
 * Google blocks. One booking may be excluded, which is how a reschedule is
 * allowed to keep its own minutes while it looks for new ones.
 */
export async function busyIntervals(db, fromMs, toMs, opts = {}) {
  const pad = 8 * 3600000; // reach past the edges so a long session outside the window still counts
  const [bookings, blocks] = await Promise.all([
    R.activeBookingsBetween(db, fromMs - pad, toMs + pad),
    R.listBlocks(db, fromMs - pad, toMs + pad),
  ]);
  const out = [];
  for (const b of bookings) {
    if (opts.excludeBookingId && b.id === opts.excludeBookingId) continue;
    out.push(protectedInterval(
      Number(b.starts_at_utc), Number(b.ends_at_utc),
      { buffer_before_min: b.s_before, buffer_after_min: b.s_after },
      { buffer_before_min: b.l_before, buffer_after_min: b.l_after }
    ));
  }
  for (const k of blocks) out.push({ s: Number(k.starts_at_utc), e: Number(k.ends_at_utc) });
  for (const g of opts.extraBusy || []) out.push({ s: Number(g.s), e: Number(g.e) });
  return mergeIntervals(out);
}

// ---- Availability ---------------------------------------------------------
/**
 * Days with at least one slot, and the times on each.
 *
 * `googleBusy` is passed in rather than fetched here: the availability engine
 * stays pure and testable, and the caller decides whether a cached window is
 * good enough (listing) or a live check is required (committing).
 */
export async function availability(db, input) {
  const service = await R.getService(db, input.serviceId);
  if (!service || !service.active) fail(ERR.NOT_FOUND, "service");
  const location = input.locationId ? await R.getLocation(db, input.locationId) : null;
  if (input.locationId && (!location || !location.active)) fail(ERR.NOT_FOUND, "location");
  if (!(await R.serviceAllowsLocation(db, service.id, input.locationId || null))) fail(ERR.VALIDATION_ERROR, "location");

  const tz = (location && location.timezone) || input.timezone || DEFAULT_TIMEZONE;
  const now = Number(input.now) || Date.now();
  const fromDate = input.fromDate || localDateISO(now, tz);
  const days = Math.min(Math.max(1, Number(input.days) || 14), 62); // a window, never a year
  const toDate = shiftDateISO(fromDate, days - 1);

  const fromMs = startOfLocalDay(fromDate, tz);
  const toMs = endOfLocalDay(toDate, tz);

  const [rules, overrides, busy] = await Promise.all([
    R.listRules(db),
    R.listOverrides(db, shiftDateISO(fromDate, -1), shiftDateISO(toDate, 1)),
    busyIntervals(db, fromMs, toMs, { excludeBookingId: input.excludeBookingId, extraBusy: input.googleBusy }),
  ]);

  // Per-day and per-week counts, for the limits.
  const countsByDate = {}, countsByWeek = {};
  if (service.daily_limit || service.weekly_limit) {
    for (let i = 0; i < days; i++) {
      const d = shiftDateISO(fromDate, i);
      if (service.daily_limit) countsByDate[d] = await R.countActiveOnDate(db, d, service.id);
      if (service.weekly_limit) {
        const wk = startOfISOWeek(d);
        if (countsByWeek[wk] == null) {
          countsByWeek[wk] = await R.countActiveBetween(
            db, startOfLocalDay(wk, tz), endOfLocalDay(shiftDateISO(wk, 6), tz), service.id);
        }
      }
    }
  }

  const daysOut = slotsOverRange(fromDate, days, {
    now, tz, service, location, rules, overrides, busy, countsByDate, countsByWeek,
  });
  return { timezone: tz, service, location, from: fromDate, to: toDate, days: daysOut };
}

// ---- Creating a booking ---------------------------------------------------
/**
 * The whole of it, in order:
 *
 *   1  the client is who the server says they are (the caller resolved that)
 *   2  service and location are loaded from the database, not from the body
 *   3  the booking rules are checked
 *   4  the credit or the payment route is checked
 *   5  internal conflicts are read again, now
 *   6  Google free/busy is verified again, now (the caller supplies it)
 *   7  the protected interval is computed, buffers included
 *   8  lock rows are prepared over that interval
 *   9  the booking row is prepared
 *  10  the credit hold is prepared
 *  11  the audit entry is prepared
 *  12  the calendar job is prepared
 *  13  all of it goes into one batch
 */
export async function createBooking(db, input) {
  const now = Number(input.now) || Date.now();
  const actor = input.actor || ACTOR.CLIENT;
  const client = await R.getClient(db, input.clientId);
  if (!client) fail(ERR.NOT_FOUND, "client");

  const service = await R.getService(db, input.serviceId);
  if (!service || !service.active) fail(ERR.NOT_FOUND, "service");
  if (actor === ACTOR.CLIENT && !service.client_visible) fail(ERR.NOT_AUTHORIZED, "service");

  const location = input.locationId ? await R.getLocation(db, input.locationId) : null;
  if (input.locationId && (!location || !location.active)) fail(ERR.NOT_FOUND, "location");
  if (!(await R.serviceAllowsLocation(db, service.id, input.locationId || null))) fail(ERR.VALIDATION_ERROR, "location");

  // The availability rules carry no zone of their own, which means they are
  // the coach's — so they must be read in the coach's zone, or in the zone of
  // the place the session happens. Reading them in the CLIENT's zone made
  // "nine to five" mean nine to five in whatever city the client is in, and
  // accepted a booking at ten at night in Prague.
  const tz = (location && location.timezone) || input.timezone || DEFAULT_TIMEZONE;
  const startMs = Number(input.startsAt);
  if (!Number.isFinite(startMs)) fail(ERR.VALIDATION_ERROR, "startsAt");
  // A start off the five-minute grid was never offered by anything, and its
  // protected interval would straddle lock cells and swallow two slots that
  // were. Times come from the slot list; anything else is a malformed request.
  if (startMs % (SLOT_GRID_MIN * MS_PER_MIN) !== 0) fail(ERR.VALIDATION_ERROR, "startsAt");
  const duration = Math.max(5, Number(service.duration_min) || 60);
  const endMs = startMs + duration * MS_PER_MIN;
  const localDate = localDateISO(startMs, tz);

  // 3 · 5 · 6 — the rules, the conflicts and Google, all against `now`.
  const [rules, overrides, busy] = await Promise.all([
    R.listRules(db),
    R.listOverrides(db, shiftDateISO(localDate, -1), shiftDateISO(localDate, 1)),
    busyIntervals(db, startMs - 12 * 3600000, endMs + 12 * 3600000, { extraBusy: input.googleBusy }),
  ]);

  const dayCount = service.daily_limit ? await R.countActiveOnDate(db, localDate, service.id) : 0;
  const weekCount = service.weekly_limit
    ? await R.countActiveBetween(db, startOfLocalDay(startOfISOWeek(localDate), tz),
        endOfLocalDay(shiftDateISO(startOfISOWeek(localDate), 6), tz), service.id)
    : 0;

  // The coach may place a session by hand where the rules would refuse — a
  // person asked in the street, a swap, a favour. It is never available to a
  // client, it always needs an explicit flag, and it always leaves a reason
  // in the audit trail.
  const override = actor === ACTOR.COACH && !!input.adminOverride;
  if (!override) {
    const bad = validateStart(startMs, { now, tz, service, location, rules, overrides, busy, dayCount, weekCount });
    if (bad) fail(bad);
  } else if (!String(input.overrideReason || "").trim()) {
    fail(ERR.VALIDATION_ERROR, "overrideReason");
  }

  // 4 — credit. A client may never push the balance below zero.
  const units = Math.max(0, Number(service.credit_cost_units) || 0);
  let pkg = null;
  if (units > 0) {
    const [packages, ledger] = await Promise.all([R.packagesWithServices(db, client.id), R.ledgerAll(db, client.id)]);
    const bal = balanceOf(ledger);
    pkg = input.clientPackageId
      ? packages.find((p) => p.id === input.clientPackageId) || null
      : allocatePackage(packages, ledger, { now, units, serviceId: service.id });
    if (!pkg) {
      if (actor === ACTOR.CLIENT) fail(bal.available < units ? ERR.INSUFFICIENT_CREDIT : ERR.PACKAGE_EXPIRED);
      // The coach may still book a session that is paid another way; the
      // booking then carries no credit at all rather than a negative one.
    }
    if (pkg && actor === ACTOR.CLIENT && bal.available < units) fail(ERR.INSUFFICIENT_CREDIT);
  }
  const holdUnits = pkg ? units : 0;

  const status = service.confirmation_mode === CONFIRMATION_MODE.AUTO
    ? BOOKING_STATUS.CONFIRMED : BOOKING_STATUS.REQUESTED;

  const id = input.id || R.newId("bk");
  const prot = protectedInterval(startMs, endMs, service, location);
  const cells = gridCells(prot.s, prot.e);
  const at = now;

  const booking = {
    id, client_id: client.id, service_id: service.id, location_id: location ? location.id : null,
    starts_at_utc: startMs, ends_at_utc: endMs, timezone: tz, local_date: localDate,
    status, confirmation_mode: service.confirmation_mode,
    credit_cost_units: holdUnits, client_package_id: pkg ? pkg.id : null,
    price_minor: holdUnits ? 0 : Number(service.price_minor) || 0,
    currency: service.currency || "CZK",
    payment_status: holdUnits ? PAYMENT_STATUS.FROM_PACKAGE : PAYMENT_STATUS.OPEN,
    payment_method: holdUnits ? PAYMENT_METHOD.PACKAGE : PAYMENT_METHOD.NONE,
    client_note: String(input.clientNote || "").slice(0, 1000),
    coach_note_private: actor === ACTOR.COACH ? String(input.coachNote || "").slice(0, 4000) : "",
    meeting_url: location && location.online_url ? location.online_url : "",
    plan_id: input.planId || null,
    workout_template_id: input.workoutTemplateId || null,
    session_instance_id: null,
    sync_status: SYNC_STATUS.PENDING, version: 1,
    created_by: actor, created_at: at, updated_at: at,
  };

  // The order matters. The hold goes first, conditional on the balance as it
  // is INSIDE the transaction — a balance read before the batch is a promise
  // about a moment that has already passed. Everything after it is conditional
  // on the hold having landed, so a client with one credit cannot end up with
  // three bookings and a balance of minus two by tapping twice.
  const holdKey = id + ":hold:1";
  const stmts = [];
  if (holdUnits > 0) {
    stmts.push(R.stHoldIfBalance(db, makeEntry({
      id: R.newId("cl"), client_id: client.id, client_package_id: pkg.id, booking_id: id,
      kind: LEDGER_KIND.HOLD, units: holdUnits, reason: "", created_by: actor, created_at: at,
      idempotency_key: holdKey,
    }), holdUnits));
  }
  const heldGuard = holdUnits > 0
    ? " WHERE EXISTS (SELECT 1 FROM credit_ledger WHERE idempotency_key = ?)"
    : "";
  const heldArgs = holdUnits > 0 ? [holdKey] : [];

  stmts.push(
    db.prepare(`INSERT INTO bookings
        (id, client_id, service_id, location_id, starts_at_utc, ends_at_utc, timezone, local_date,
         status, confirmation_mode, credit_cost_units, client_package_id, price_minor, currency,
         payment_status, payment_method, client_note, coach_note_private, meeting_url,
         plan_id, workout_template_id, sync_status, version, created_by, created_at, updated_at)
        SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?` + heldGuard)
      .bind(booking.id, booking.client_id, booking.service_id, booking.location_id,
            booking.starts_at_utc, booking.ends_at_utc, booking.timezone, booking.local_date,
            booking.status, booking.confirmation_mode, booking.credit_cost_units, booking.client_package_id,
            booking.price_minor, booking.currency, booking.payment_status, booking.payment_method,
            booking.client_note, booking.coach_note_private, booking.meeting_url,
            booking.plan_id, booking.workout_template_id, booking.sync_status, booking.version,
            booking.created_by, booking.created_at, booking.updated_at, ...heldArgs));

  for (const c of cells) {
    stmts.push(db.prepare(`INSERT INTO booking_slot_locks (booking_id, resource_key, slot_cell)
                           SELECT ?, ?, ? WHERE EXISTS (SELECT 1 FROM bookings WHERE id = ?)`)
      .bind(id, RESOURCE_KEY, c, id));
  }

  stmts.push(R.stInsertEvent(db, {
    id: R.newId("ev"), booking_id: id, type: BOOKING_EVENT.CREATED,
    actor_type: actor, actor_id: input.actorId || "", created_at: at,
    payload: { status, startsAt: startMs, serviceId: service.id, locationId: booking.location_id,
      override: override || undefined, reason: override ? String(input.overrideReason).slice(0, 300) : undefined },
  }));
  if (override) {
    stmts.push(R.stInsertEvent(db, {
      id: R.newId("ev"), booking_id: id, type: BOOKING_EVENT.ADMIN_OVERRIDE,
      actor_type: actor, actor_id: input.actorId || "", created_at: at,
      payload: { reason: String(input.overrideReason).slice(0, 300) },
    }));
  }
  stmts.push(R.stOutboxIfState(db, {
    id: R.newId("ob"), booking_id: id, action: OUTBOX_ACTION.CREATE,
    // Wall time, not the domain clock. `now` is injectable so a test can
    // place a booking on a chosen Monday; the retry schedule must not move
    // with it, or a job would come due three days after it was written.
    booking_version: 1, next_attempt_at: Date.now(), created_at: at,
  }, 1, status));

  try {
    await db.batch(stmts);
  } catch (e) {
    if (isLockConflict(e)) fail(ERR.SLOT_TAKEN);
    throw e;
  }
  // The batch succeeds either way; whether the booking exists is the answer to
  // "was there still enough credit at that exact moment".
  const written = await R.getBooking(db, id);
  if (!written) fail(ERR.INSUFFICIENT_CREDIT);
  return { ...booking };
}

// ---- Rescheduling ---------------------------------------------------------
/**
 * The booking keeps its identity and its credit; only its minutes change.
 *
 * The old lock is not released before the new one is taken — both happen in
 * the same batch, so there is never an instant where the time is free to
 * somebody else and also not held by anyone.
 */
export async function rescheduleBooking(db, id, input) {
  const now = Number(input.now) || Date.now();
  const actor = input.actor || ACTOR.CLIENT;
  const b = await R.getBooking(db, id);
  if (!b) fail(ERR.NOT_FOUND, "booking");

  const rule = transitionFor(b.status, "reschedule", actor);
  if (!rule) fail(ERR.INVALID_TRANSITION);

  const service = await R.getService(db, b.service_id);
  if (!service) fail(ERR.NOT_FOUND, "service");

  // A client may move a booking only while the cancellation window is open.
  if (actor === ACTOR.CLIENT) {
    const deadline = Number(b.starts_at_utc) - Math.max(0, Number(service.cancel_before_min) || 0) * MS_PER_MIN;
    if (now > deadline) fail(ERR.CANCELLATION_CLOSED);
  }

  const locationId = input.locationId !== undefined ? input.locationId : b.location_id;
  const location = locationId ? await R.getLocation(db, locationId) : null;
  if (locationId && (!location || !location.active)) fail(ERR.NOT_FOUND, "location");
  if (!(await R.serviceAllowsLocation(db, service.id, locationId || null))) fail(ERR.VALIDATION_ERROR, "location");

  const tz = (location && location.timezone) || input.timezone || b.timezone || DEFAULT_TIMEZONE;
  const startMs = Number(input.startsAt);
  if (!Number.isFinite(startMs)) fail(ERR.VALIDATION_ERROR, "startsAt");
  if (startMs % (SLOT_GRID_MIN * MS_PER_MIN) !== 0) fail(ERR.VALIDATION_ERROR, "startsAt");
  const endMs = startMs + Math.max(5, Number(service.duration_min) || 60) * MS_PER_MIN;
  const localDate = localDateISO(startMs, tz);

  const [rules, overrides, busy] = await Promise.all([
    R.listRules(db),
    R.listOverrides(db, shiftDateISO(localDate, -1), shiftDateISO(localDate, 1)),
    busyIntervals(db, startMs - 12 * 3600000, endMs + 12 * 3600000,
      { excludeBookingId: id, extraBusy: input.googleBusy }),
  ]);

  const override = actor === ACTOR.COACH && !!input.adminOverride;
  if (!override) {
    // The daily and weekly limits are rules about the calendar, not about how
    // a booking arrived there. Passing zero here let a client sidestep a full
    // day by booking the next one and moving it back.
    const movingWithinDay = localDateISO(Number(b.starts_at_utc), tz) === localDate;
    const dayCount = service.daily_limit
      ? Math.max(0, await R.countActiveOnDate(db, localDate, service.id) - (movingWithinDay ? 1 : 0)) : 0;
    const weekStart = startOfISOWeek(localDate);
    const movingWithinWeek = startOfISOWeek(localDateISO(Number(b.starts_at_utc), tz)) === weekStart;
    const weekCount = service.weekly_limit
      ? Math.max(0, await R.countActiveBetween(db, startOfLocalDay(weekStart, tz),
          endOfLocalDay(shiftDateISO(weekStart, 6), tz), service.id) - (movingWithinWeek ? 1 : 0)) : 0;
    const bad = validateStart(startMs, { now, tz, service, location, rules, overrides, busy, dayCount, weekCount });
    if (bad) fail(bad);
  }

  const prot = protectedInterval(startMs, endMs, service, location);
  const cells = gridCells(prot.s, prot.e);
  const at = now;
  const nextVersion = Number(b.version) + 1;

  const stmts = [
    // Guarded by the version we read: if anything else moved this booking
    // between the read and the batch, no row matches and the reschedule is
    // rejected instead of silently applied to a booking that changed.
    db.prepare(`UPDATE bookings SET starts_at_utc = ?, ends_at_utc = ?, local_date = ?, timezone = ?,
                  location_id = ?, meeting_url = ?, sync_status = 'PENDING', version = version + 1, updated_at = ?
                WHERE id = ? AND version = ? AND status = ?`)
      .bind(startMs, endMs, localDate, tz, locationId || null,
            location && location.online_url ? location.online_url : b.meeting_url,
            at, id, b.version, b.status),
    // Both guarded on the version the UPDATE above is creating: if it matched
    // nothing, the old lock survives and no new one is taken, so a failed
    // reschedule leaves the booking exactly where it was.
    R.stDeleteLocksIfMoved(db, id, nextVersion, startMs),
  ];
  for (const c of cells) stmts.push(R.stInsertLockIfState(db, id, RESOURCE_KEY, c, nextVersion, startMs));
  stmts.push(R.stInsertEventIfMoved(db, {
    id: "ev_" + id + "_" + nextVersion + "_move", booking_id: id, type: BOOKING_EVENT.RESCHEDULED,
    actor_type: actor, actor_id: input.actorId || "", created_at: at,
    payload: { from: Number(b.starts_at_utc), to: startMs, fromLocation: b.location_id, toLocation: locationId || null },
  }, nextVersion, startMs));
  stmts.push(R.stOutboxIfMoved(db, {
    id: R.newId("ob"), booking_id: id, action: OUTBOX_ACTION.UPDATE,
    booking_version: nextVersion, next_attempt_at: Date.now(), created_at: at,
  }, nextVersion, startMs));

  try {
    await db.batch(stmts);
  } catch (e) {
    if (isLockConflict(e)) fail(ERR.SLOT_TAKEN);
    throw e;
  }
  const after = await R.getBooking(db, id);
  if (!after || Number(after.version) !== nextVersion || Number(after.starts_at_utc) !== startMs) {
    fail(ERR.INVALID_TRANSITION);
  }
  return after;
}

// ---- Every other move -----------------------------------------------------
/**
 * confirm · reject · cancel · lateCancel · cancelCoach · complete · noShow
 *
 * The status machine decides whether the move is legal and what happens to
 * the credit; this only writes it down. The UPDATE carries the status we read
 * in its WHERE clause, so two requests arriving together cannot both win —
 * the second one changes no rows and is answered INVALID_TRANSITION.
 */
export async function transitionBooking(db, id, name, input) {
  const now = Number(input.now) || Date.now();
  const actor = input.actor || ACTOR.COACH;
  const b = await R.getBooking(db, id);
  if (!b) fail(ERR.NOT_FOUND, "booking");

  const service = await R.getService(db, b.service_id);
  const rule = transitionFor(b.status, name, actor);
  if (!rule) fail(ERR.INVALID_TRANSITION);

  // A client cancelling past the window is not refused — it is recorded as
  // what it is, and the credit follows the service policy.
  let effectiveName = name, to = rule.to, outcome = rule.credit;
  if (name === "cancel" && actor === ACTOR.CLIENT) {
    const deadline = Number(b.starts_at_utc) - Math.max(0, Number(service && service.cancel_before_min) || 0) * MS_PER_MIN;
    // Only a booking the coach actually confirmed can be cancelled late. A
    // request he never accepted is not a session somebody failed to attend,
    // and charging for it would be charging for nothing.
    const lze = b.status === BOOKING_STATUS.CONFIRMED;
    if (lze && now > deadline) {
      effectiveName = "lateCancel";
      to = BOOKING_STATUS.LATE_CANCEL;
      // Even when the policy keeps the credit, the hold has to close: the
      // credit was spent, and a hold left open would keep showing as
      // "reserved" by a booking that no longer exists, stacking up with every
      // late cancellation. CONSUME writes RELEASE and CONSUME as a pair, so
      // the balance does not move and the history says what happened.
      outcome = service && service.late_cancel_refunds ? "RELEASE" : "CONSUME";
    } else {
      outcome = "RELEASE";
    }
  } else if (name === "cancel" && actor === ACTOR.COACH) {
    to = BOOKING_STATUS.CANCELLED_COACH;
    outcome = "RELEASE"; // the coach cancelling always gives the credit back
  } else if (name === "noShow") {
    outcome = service && service.no_show_refunds ? "RELEASE" : "CONSUME";
  } else if (outcome === "POLICY") {
    outcome = "RELEASE";
  }

  const at = now;
  const nextVersion = Number(b.version) + 1;
  const units = Math.max(0, Number(b.credit_cost_units) || 0);
  const isCancel = to === BOOKING_STATUS.CANCELLED_CLIENT || to === BOOKING_STATUS.CANCELLED_COACH
    || to === BOOKING_STATUS.LATE_CANCEL;
  const stillHolds = to === BOOKING_STATUS.CONFIRMED || to === BOOKING_STATUS.REQUESTED;

  const stmts = [
    db.prepare(`UPDATE bookings SET status = ?, version = version + 1, updated_at = ?,
                  cancelled_at = ?, cancel_reason = ?, sync_status = ?
                WHERE id = ? AND status = ? AND version = ?`)
      .bind(to, at,
            isCancel ? at : (b.cancelled_at ?? null),
            isCancel ? String(input.reason || "").slice(0, 300) : (b.cancel_reason ?? null),
            stillHolds || isCancel || to === BOOKING_STATUS.COMPLETED || to === BOOKING_STATUS.NO_SHOW
              ? SYNC_STATUS.PENDING : b.sync_status,
            id, b.status, b.version),
  ];

  // Everything after the guarded UPDATE is itself guarded on the version that
  // UPDATE was trying to create. If two requests arrive together, the loser's
  // UPDATE matches no row — and then it must not delete the winner's locks and
  // must not write a credit movement either. Without this the "cancel and
  // complete in the same instant" case would free a slot that is still taken
  // and hand back a credit that was just spent.
  if (!stillHolds) stmts.push(R.stDeleteLocksIfState(db, id, nextVersion, to));

  if (units > 0 && (outcome === "RELEASE" || outcome === "CONSUME")) {
    for (const raw of ledgerForOutcome(outcome, {
      units, client_id: b.client_id, client_package_id: b.client_package_id,
      booking_id: id, created_by: actor, created_at: at, version: nextVersion,
      reason: input.reason || "",
    })) {
      stmts.push(R.stInsertLedgerIfState(db, makeEntry({ id: R.newId("cl"), ...raw }), id, nextVersion, to));
    }
    // A credit handed back onto a package whose validity has already ended is
    // not spendable — allocation skips expired packages. Leaving it in the
    // balance would show a number the booking path then refuses to honour, so
    // it expires in the same breath, with a reason the client can read.
    if (outcome === "RELEASE" && b.client_package_id) {
      const pkgNow = await db.prepare("SELECT expires_at, status FROM client_packages WHERE id = ?")
        .bind(b.client_package_id).first();
      const skoncil = pkgNow && ((pkgNow.expires_at && Number(pkgNow.expires_at) <= at) || pkgNow.status === PACKAGE_STATUS.EXPIRED);
      if (skoncil) {
        stmts.push(R.stInsertLedgerIfState(db, makeEntry({
          id: R.newId("cl"), client_id: b.client_id, client_package_id: b.client_package_id,
          booking_id: id, kind: LEDGER_KIND.EXPIRY, units, reason: "Platnost balíčku skončila",
          created_by: ACTOR.SYSTEM, created_at: at,
          idempotency_key: id + ":expiry:" + nextVersion,
        }), id, nextVersion, to));
      }
    }
  }

  const evType = to === BOOKING_STATUS.COMPLETED ? BOOKING_EVENT.COMPLETED
    : to === BOOKING_STATUS.NO_SHOW ? BOOKING_EVENT.NO_SHOW
    : to === BOOKING_STATUS.CONFIRMED ? BOOKING_EVENT.CONFIRMED
    : effectiveName === "reject" ? BOOKING_EVENT.REJECTED
    : BOOKING_EVENT.CANCELLED;
  stmts.push(R.stInsertEventIfState(db, {
    id: "ev_" + id + "_" + nextVersion + "_" + evType, booking_id: id, type: evType,
    actor_type: actor, actor_id: input.actorId || "", created_at: at,
    payload: { from: b.status, to, credit: outcome, reason: String(input.reason || "").slice(0, 300) },
  }, nextVersion, to));
  stmts.push(R.stOutboxIfState(db, {
    id: R.newId("ob"), booking_id: id,
    action: isCancel ? OUTBOX_ACTION.CANCEL : OUTBOX_ACTION.UPDATE,
    booking_version: nextVersion, next_attempt_at: Date.now(), created_at: at,
  }, nextVersion, to));

  try {
    await db.batch(stmts);
  } catch (e) {
    if (isLockConflict(e)) fail(ERR.SLOT_TAKEN);
    throw e;
  }
  const after = await R.getBooking(db, id);
  // The guarded UPDATE is the arbiter, and the whole post-state is the proof.
  // Two requests aiming at DIFFERENT outcomes both try for the same next
  // version, so the version alone would call the loser a winner; the status is
  // what tells "I completed it" apart from "I cancelled it".
  //
  // Two requests aiming at the SAME outcome are not a race at all — they are
  // one intent sent twice, and both callers deserve the same true answer.
  // Every write above is keyed so the duplicate lands on nothing, so this
  // returns the booking rather than inventing a conflict.
  if (!after || Number(after.version) !== nextVersion || after.status !== to) fail(ERR.INVALID_TRANSITION);
  return after;
}

// ---- Reading for a person --------------------------------------------------
export async function creditSummary(db, clientId, opts = {}) {
  const [packages, ledger] = await Promise.all([
    R.packagesWithServices(db, clientId), R.ledgerAll(db, clientId),
  ]);
  const bal = balanceOf(ledger);
  const byPackage = {};
  for (const p of packages) byPackage[p.id] = balanceOf(ledger.filter((e) => e.client_package_id === p.id));
  return {
    balance: bal,
    packages: packages.map((p) => ({ ...p, balance: byPackage[p.id] || balanceOf([]) })),
    entries: opts.withEntries ? await R.ledgerOfClient(db, clientId, opts.limit || 200) : undefined,
  };
}

export async function cancelPreview(db, id, opts = {}) {
  const b = await R.getBooking(db, id);
  if (!b) fail(ERR.NOT_FOUND, "booking");
  const service = await R.getService(db, b.service_id);
  const ledger = await R.ledgerAll(db, b.client_id);
  return cancellationPreview(b, service, {
    now: opts.now || Date.now(), byCoach: !!opts.byCoach, balanceNow: balanceOf(ledger).available,
  });
}

export async function noShowPreviewFor(db, id, opts = {}) {
  const b = await R.getBooking(db, id);
  if (!b) fail(ERR.NOT_FOUND, "booking");
  const service = await R.getService(db, b.service_id);
  const ledger = await R.ledgerAll(db, b.client_id);
  return noShowPreview(b, service, { balanceNow: balanceOf(ledger).available });
}

// ---- Manual credit ---------------------------------------------------------
/** The coach grants or corrects credit. Never without a reason, never in place. */
export async function writeManualLedger(db, input) {
  const kind = input.kind === LEDGER_KIND.MANUAL_ADD ? LEDGER_KIND.MANUAL_ADD
    : input.kind === LEDGER_KIND.REFUND ? LEDGER_KIND.REFUND
    : LEDGER_KIND.ADJUSTMENT;
  const entry = makeEntry({
    id: R.newId("cl"), client_id: input.clientId, client_package_id: input.clientPackageId || null,
    booking_id: null, kind, units: input.units, reason: input.reason,
    created_by: ACTOR.COACH, created_at: Number(input.now) || Date.now(),
    idempotency_key: input.idempotencyKey || R.newId("idem"),
  });
  await db.batch([R.stInsertLedger(db, entry)]);
  return entry;
}
