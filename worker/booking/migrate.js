// Booking · bringing the existing clients across.
//
// Unlike the training reset, this data may not start again. Every card, every
// session, every package and every note that exists today has to arrive in the
// new model with its history intact — and if the migration runs twice, which
// it will, nothing may be counted twice.
//
// The source is the coach's collection document: `klProfiles`, `klSessions`,
// `klPacks`, `klNotes`, `klComms`, `klCfg`. It is posted here by the Main App,
// which is the only place that holds it, and it is written into the relational
// model in one pass.
//
// Two rules govern every decision below:
//   · a legacy id is carried on the new row (`legacy_session_id`,
//     `legacy_pack_id`, `coach_profile_id`) under a unique index, so a second
//     run recognises what it already did and skips it
//   · a payment is never invented. Where the old data does not say, the new
//     row says UNKNOWN, which is true, rather than PAID, which would be a
//     number in Tanmay's accounts that nobody put there.

import {
  BOOKING_STATUS, PAYMENT_STATUS, PAYMENT_METHOD, LEDGER_KIND, ACTOR,
  CONFIRMATION_MODE, LOCATION_TYPE, SYNC_STATUS, MS_PER_MIN,
} from "../../src/booking/types.js";
import { zonedToUtc, localDateISO, minuteOfDayFromHHMM, isDateISO } from "../../src/booking/time.js";
import { protectedInterval } from "../../src/booking/slots.js";
import { gridCells } from "../../src/booking/time.js";
import * as R from "./repo.js";
import { RESOURCE_KEY } from "./engine.js";

export const MIGRATION_NAME = "klienti->booking v1";
const TZ = "Europe/Prague";

// The three session types the coach has always used map onto three seed
// locations. The names are the ones already on screen; the addresses stay
// empty because there is no verified address in the old data and inventing
// one would put a wrong meeting point in front of a person.
const TYPE_TO_LOCATION = { venku: "loc_venku", gym: "loc_studio", online: "loc_online" };

const STATUS_MAP = {
  plan: BOOKING_STATUS.CONFIRMED,
  done: BOOKING_STATUS.COMPLETED,
  zruseno: BOOKING_STATUS.CANCELLED_COACH,
  neprisel: BOOKING_STATUS.NO_SHOW,
};
const PAY_MAP = {
  hotove: { status: PAYMENT_STATUS.PAID, method: PAYMENT_METHOD.CASH },
  prevod: { status: PAYMENT_STATUS.PAID, method: PAYMENT_METHOD.TRANSFER },
  balicek: { status: PAYMENT_STATUS.FROM_PACKAGE, method: PAYMENT_METHOD.PACKAGE },
  "": { status: PAYMENT_STATUS.OPEN, method: PAYMENT_METHOD.NONE },
};

const s = (v) => String(v == null ? "" : v);
const n = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

/** Has this already been done? */
export async function migrationState(db) {
  const row = await db.prepare("SELECT * FROM booking_data_migrations WHERE name = ?").bind(MIGRATION_NAME).first();
  if (!row) return { applied: false };
  let summary = {};
  try { summary = JSON.parse(row.summary || "{}"); } catch (e) {}
  return { applied: true, appliedAt: Number(row.applied_at), summary };
}

/**
 * Seed the shape the coach already works in: three locations, one service per
 * kind of session he actually runs. Neutral, editable, and never overwritten
 * once it exists — a second run must not undo a rename.
 */
export async function seedDefaults(db, opts = {}) {
  const at = Number(opts.now) || Date.now();
  const locations = [
    { id: "loc_studio", type: LOCATION_TYPE.STUDIO, cs: "Studio", en: "Studio", sort: 0 },
    { id: "loc_venku", type: LOCATION_TYPE.OUTDOORS, cs: "Venku", en: "Outdoors", sort: 1 },
    { id: "loc_online", type: LOCATION_TYPE.ONLINE, cs: "Online", en: "Online", sort: 2, online: "MANUAL_LINK" },
  ];
  for (const l of locations) {
    await db.prepare(`INSERT INTO booking_locations
        (id, type, name_cs, name_en, address, map_url, instructions_cs, instructions_en, timezone,
         travel_group, buffer_before_min, buffer_after_min, online_mode, online_url, active, sort_order, created_at, updated_at)
        VALUES (?,?,?,?,'','','','',?,'',0,0,?,'',1,?,?,?)
        ON CONFLICT(id) DO NOTHING`)
      .bind(l.id, l.type, l.cs, l.en, TZ, l.online || "", l.sort, at, at).run();
  }

  const defaultPrice = Math.round(n(opts.defaultPrice) * 100);
  const services = [
    { id: "svc_osobni", cs: "Osobní trénink", en: "Personal training", dur: 60, sort: 0 },
    { id: "svc_online", cs: "Online setkání", en: "Online session", dur: 60, sort: 1 },
    { id: "svc_vstupni", cs: "Vstupní setkání", en: "Initial session", dur: 90, sort: 2 },
    { id: "svc_revize", cs: "Revize plánu", en: "Plan review", dur: 45, sort: 3 },
  ];
  for (const v of services) {
    await db.prepare(`INSERT INTO booking_services
        (id, name_cs, name_en, description_cs, description_en, duration_min, credit_cost_units, price_minor, currency,
         min_notice_min, booking_horizon_days, cancel_before_min, buffer_before_min, buffer_after_min, slot_interval_min,
         confirmation_mode, daily_limit, weekly_limit, late_cancel_refunds, no_show_refunds, client_visible, active, sort_order, created_at, updated_at)
        VALUES (?,?,?,'','',?,1,?,'CZK',720,60,1440,0,0,30,?,0,0,0,0,1,1,?,?,?)
        ON CONFLICT(id) DO NOTHING`)
      .bind(v.id, v.cs, v.en, v.dur, defaultPrice, CONFIRMATION_MODE.REQUEST, v.sort, at, at).run();
    for (const l of (v.id === "svc_online" ? ["loc_online"] : ["loc_studio", "loc_venku", "loc_online"])) {
      await db.prepare("INSERT INTO booking_service_locations (service_id, location_id) VALUES (?, ?) ON CONFLICT DO NOTHING")
        .bind(v.id, l).run();
    }
  }
  return { locations: locations.length, services: services.length };
}

const serviceForType = (type) => (type === "online" ? "svc_online" : "svc_osobni");

/**
 * Run it.
 *
 * `coll` is the coach's collection subtree. `accounts` is the list from the
 * client application, so a card that already has an account is linked rather
 * than duplicated.
 */
export async function migrateLegacy(db, coll, opts = {}) {
  const at = Number(opts.now) || Date.now();
  const dryRun = !!opts.dryRun;
  const profiles = Array.isArray(coll && coll.klProfiles) ? coll.klProfiles : [];
  const sessions = Array.isArray(coll && coll.klSessions) ? coll.klSessions : [];
  const packs = Array.isArray(coll && coll.klPacks) ? coll.klPacks : [];
  const cfg = (coll && coll.klCfg) || {};
  const accounts = Array.isArray(opts.accounts) ? opts.accounts : [];

  const out = {
    profiles: 0, profilesLinked: 0, clients: 0,
    packages: 0, ledgerEntries: 0,
    bookings: 0, bookingsSkipped: 0, locks: 0,
    errors: [],
  };

  if (!dryRun) await seedDefaults(db, { now: at, defaultPrice: cfg.defaultPrice });

  // ---- clients ------------------------------------------------------------
  const byUid = {}, byMail = {};
  for (const a of accounts) {
    if (a.user_id) byUid[a.user_id] = a;
    if (a.email) byMail[String(a.email).toLowerCase()] = a;
  }
  const clientIdOf = {}; // legacy profile id → booking client id

  for (const p of profiles) {
    if (!p || !p.id) continue;
    const existing = await R.clientByProfile(db, s(p.id));
    const acc = (p.uid && byUid[p.uid]) || (p.email && byMail[String(p.email).toLowerCase()]) || null;
    const accountUserId = (p.uid && s(p.uid)) || (acc && s(acc.user_id)) || null;
    if (existing) {
      clientIdOf[p.id] = existing.id;
      // Only fill what is empty; never overwrite something the coach edited
      // in the new model after the first migration ran.
      if (!dryRun) {
        await db.prepare(`UPDATE booking_clients SET
            account_user_id = COALESCE(account_user_id, ?),
            name = CASE WHEN name = '' THEN ? ELSE name END,
            email = CASE WHEN email = '' THEN ? ELSE email END,
            updated_at = ? WHERE id = ?`)
          .bind(accountUserId, s(p.name), s(p.email), at, existing.id).run();
      }
      out.profilesLinked++;
      continue;
    }
    const id = R.newId("cli");
    clientIdOf[p.id] = id;
    if (!dryRun) {
      try {
        await db.prepare(`INSERT INTO booking_clients
            (id, account_user_id, coach_profile_id, name, email, timezone, active, created_at, updated_at)
            VALUES (?,?,?,?,?,?,?,?,?)`)
          .bind(id, accountUserId, s(p.id), s(p.name), s(p.email), TZ,
                p.status === "ukonceno" || p.status === "alumni" ? 0 : 1,
                n(p.createdAt) || at, at).run();
      } catch (e) {
        // Two cards pointing at one account: keep the first, note the second,
        // and do not lose either person's sessions.
        out.errors.push({ profile: s(p.id), error: "client insert: " + String(e.message || e).slice(0, 120) });
        const fallback = accountUserId ? await R.clientByAccount(db, accountUserId) : null;
        if (fallback) clientIdOf[p.id] = fallback.id; else delete clientIdOf[p.id];
        continue;
      }
    }
    out.clients++;
  }
  out.profiles = profiles.length;

  // ---- packages -----------------------------------------------------------
  // The old model has no ledger: `klPackUsed` counts done and no-show sessions
  // that carry the pack id. So the purchase becomes a PURCHASE entry, each
  // already-used session becomes a CONSUME, and each future session from the
  // pack becomes a HOLD. The arithmetic then lands exactly where the old
  // screen showed it, but every step is now a row somebody can read.
  const packClient = {};
  for (const b of packs) {
    if (!b || !b.id) continue;
    const clientId = clientIdOf[b.cid];
    if (!clientId) { out.errors.push({ pack: s(b.id), error: "no client" }); continue; }
    packClient[b.id] = clientId;
    const existing = await db.prepare("SELECT id FROM client_packages WHERE legacy_pack_id = ?").bind(s(b.id)).first();
    if (existing) {
      // The session loop below reads this key. Setting it only on the branch
      // that CREATES a package meant a second run wrote every new session with
      // no package, no credit and an open payment — and the balance quietly
      // stopped matching the sessions it was supposed to cover.
      packClient["cp:" + b.id] = existing.id;
      continue;
    }
    const cpId = R.newId("cp");
    packClient[b.id] = clientId;
    const units = Math.max(0, Math.round(n(b.total)));
    const paid = !!b.paidAt;
    const purchasedAt = isDateISO(b.paidAt) ? zonedToUtc(b.paidAt, 12 * 60, TZ) : (n(b.createdAt) || at);
    if (!dryRun) {
      await db.prepare(`INSERT INTO client_packages
          (id, client_id, package_definition_id, name_snapshot, purchased_units, price_minor, currency,
           payment_status, payment_method, payment_provider, external_payment_id, purchased_at,
           valid_from, expires_at, status, note, created_at, updated_at, legacy_pack_id)
          VALUES (?,?,NULL,?,?,?,'CZK',?,?,'','',?,?,NULL,'ACTIVE','',?,?,?)`)
        .bind(cpId, clientId, s(b.name) || "Balíček", units, Math.round(n(b.price) * 100),
              paid ? PAYMENT_STATUS.PAID : PAYMENT_STATUS.UNKNOWN,
              paid ? PAYMENT_METHOD.NONE : PAYMENT_METHOD.NONE,
              purchasedAt, purchasedAt, at, at, s(b.id)).run();
      if (units > 0) {
        await db.prepare(`INSERT INTO credit_ledger
            (id, client_id, client_package_id, booking_id, kind, units, reason, created_by, created_at, idempotency_key)
            VALUES (?,?,?,NULL,?,?,?,?,?,?) ON CONFLICT(idempotency_key) DO NOTHING`)
          .bind(R.newId("cl"), clientId, cpId,
                paid ? LEDGER_KIND.PURCHASE : LEDGER_KIND.MANUAL_ADD, units,
                paid ? "" : "Převedeno z původní karty · platba neověřena",
                ACTOR.SYSTEM, purchasedAt, "legacy:pack:" + s(b.id)).run();
        out.ledgerEntries++;
      }
    }
    packClient[b.id] = clientId;
    out.packages++;
    if (!dryRun) {
      const row = await db.prepare("SELECT id FROM client_packages WHERE legacy_pack_id = ?").bind(s(b.id)).first();
      if (row) packClient["cp:" + b.id] = row.id;
    }
  }

  // ---- sessions -----------------------------------------------------------
  for (const x of sessions) {
    if (!x || !x.id) continue;
    if (!isDateISO(x.date)) { out.bookingsSkipped++; continue; }
    const clientId = clientIdOf[x.cid];
    if (!clientId) { out.bookingsSkipped++; out.errors.push({ session: s(x.id), error: "no client" }); continue; }
    const existing = await db.prepare("SELECT id FROM bookings WHERE legacy_session_id = ?").bind(s(x.id)).first();
    if (existing) continue;

    const startMin = x.time ? minuteOfDayFromHHMM(x.time) : 9 * 60;
    const startMs = zonedToUtc(x.date, startMin, TZ);
    const durMin = Math.max(5, Math.round(n(x.dur) || 60));
    const endMs = startMs + durMin * MS_PER_MIN;
    const status = STATUS_MAP[x.status] || BOOKING_STATUS.COMPLETED;
    const serviceId = serviceForType(x.type);
    const locationId = TYPE_TO_LOCATION[x.type] || "loc_studio";
    const fromPack = !!x.packId && !!packClient["cp:" + x.packId];
    const pay = PAY_MAP[s(x.pay)] || PAY_MAP[""];
    const id = R.newId("bk");
    const active = status === BOOKING_STATUS.CONFIRMED || status === BOOKING_STATUS.REQUESTED;
    const counted = x.status === "done" || x.status === "neprisel";

    if (!dryRun) {
      const core = [
        db.prepare(`INSERT INTO bookings
            (id, client_id, service_id, location_id, starts_at_utc, ends_at_utc, timezone, local_date,
             status, confirmation_mode, credit_cost_units, client_package_id, price_minor, currency,
             payment_status, payment_method, client_note, coach_note_private, meeting_url,
             sync_status, version, created_by, created_at, updated_at, legacy_session_id)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'',?,1,?,?,?,?)`)
          .bind(id, clientId, serviceId, locationId, startMs, endMs, TZ, s(x.date),
                status, CONFIRMATION_MODE.AUTO, fromPack ? 1 : 0,
                fromPack ? packClient["cp:" + x.packId] : null,
                Math.round(n(x.price) * 100), "CZK",
                fromPack ? PAYMENT_STATUS.FROM_PACKAGE : pay.status,
                fromPack ? PAYMENT_METHOD.PACKAGE : pay.method,
                s(x.note), "",
                SYNC_STATUS.NONE, ACTOR.COACH, at, at, s(x.id)),
        R.stInsertEvent(db, { id: R.newId("ev"), booking_id: id, type: "CREATED",
          actor_type: ACTOR.SYSTEM, created_at: at,
          payload: { migrated: true, legacyId: s(x.id), legacyStatus: s(x.status) } }),
      ];

      // Credit: what was used is used, what is still coming is held. The
      // idempotency key carries the legacy session id, so a second run of the
      // migration writes no second entry even if everything else changed.
      if (fromPack) {
        const cpId = packClient["cp:" + x.packId];
        const ledgerRow = (kind, units, when, key) => db.prepare(`INSERT INTO credit_ledger
              (id, client_id, client_package_id, booking_id, kind, units, reason, created_by, created_at, idempotency_key)
              VALUES (?,?,?,?,?,?,'',?,?,?) ON CONFLICT(idempotency_key) DO NOTHING`)
          .bind(R.newId("cl"), clientId, cpId, id, kind, units, ACTOR.SYSTEM, when, key);
        if (counted) {
          core.push(ledgerRow(LEDGER_KIND.CONSUME, -1, startMs, "legacy:consume:" + s(x.id)));
          out.ledgerEntries++;
        } else if (active) {
          core.push(ledgerRow(LEDGER_KIND.HOLD, -1, at, "legacy:hold:" + s(x.id)));
          out.ledgerEntries++;
        }
      }

      // Only a booking that still holds its time takes lock rows. A session
      // that already happened must not block a future slot, and two historical
      // sessions that overlapped in the old free-text world must not make the
      // whole migration fail.
      const locks = [];
      if (active) {
        const prot = protectedInterval(startMs, endMs, { buffer_before_min: 0, buffer_after_min: 0 }, null);
        for (const c of gridCells(prot.s, prot.e)) locks.push(R.stInsertLock(db, id, RESOURCE_KEY, c));
      }

      let wrote = false;
      try {
        await db.batch(core.concat(locks));
        wrote = true;
        if (locks.length) out.locks++;
      } catch (e) {
        // A clash between two old sessions is real history, not a fault in the
        // new model. Keep the booking, drop the lock, and say so.
        out.errors.push({ session: s(x.id), error: "kept without lock: " + String(e.message || e).slice(0, 100) });
        try { await db.batch(core); wrote = true; } catch (e2) {
          out.errors.push({ session: s(x.id), error: String(e2.message || e2).slice(0, 120) });
        }
      }
      if (!wrote) { out.bookingsSkipped++; continue; }
    }
    out.bookings++;
  }

  if (!dryRun) {
    await db.prepare(`INSERT INTO booking_data_migrations (name, applied_at, summary)
                      VALUES (?,?,?) ON CONFLICT(name) DO UPDATE SET applied_at = excluded.applied_at, summary = excluded.summary`)
      .bind(MIGRATION_NAME, at, JSON.stringify(out)).run();
  }
  return out;
}
