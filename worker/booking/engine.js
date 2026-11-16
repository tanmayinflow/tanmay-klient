// Booking · the transaction.
//
// Everything a booking needs to be true at once is written in one D1 batch,
// and D1 says plainly what that means: "Batched statements are SQL
// transactions. If a statement in the sequence fails, then an error is
// returned for that specific statement, and it aborts or rolls back the
// entire sequence."
//
// Booking, participant credit holds, audit and calendar jobs commit together.
// Exact protected-interval triggers arbitrate conflicting coach time inside
// SQLite; no preflight result is trusted as a concurrency guarantee.
//
// A frontend check is not protection. Nothing in this file trusts one.

import {
  BOOKING_STATUS, LEDGER_KIND, ACTOR, BOOKING_EVENT,
  ERR, SYNC_STATUS, OUTBOX_ACTION, MS_PER_MIN,
  DEFAULT_TIMEZONE, PACKAGE_STATUS,
} from "../../src/booking/types.js";
import {
  localDateISO, startOfLocalDay, endOfLocalDay, shiftDateISO, startOfISOWeek,
} from "../../src/booking/time.js";
import { protectedInterval, slotsOverRange, mergeIntervals } from "../../src/booking/slots.js";
import { balanceOf, makeEntry, cancellationPreview, noShowPreview } from "../../src/booking/credits.js";
import { transitionFor, ledgerForOutcome } from "../../src/booking/status.js";
import * as R from "./repo.js";
import { createManagedBooking, rescheduleManagedBooking, cancelParticipation } from "./managedBookings.js";

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
  let service = await R.getService(db, input.serviceId);
  if (!service || !service.active) fail(ERR.NOT_FOUND, "service");
  const excluded = input.excludeBookingId ? await R.getBooking(db, input.excludeBookingId) : null;
  const moving = excluded && excluded.service_id === service.id &&
    [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.REQUESTED].includes(excluded.status) ? excluded : null;
  if (moving) {
    const duration = (Number(moving.ends_at_utc) - Number(moving.starts_at_utc)) / MS_PER_MIN;
    if (Number.isFinite(duration) && duration > 0) service = { ...service, duration_min: duration };
  }
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
    busyIntervals(db, fromMs, toMs, { excludeBookingId: moving?.id, extraBusy: input.googleBusy }),
  ]);

  // Per-day and per-week counts, for the limits.
  const countsByDate = {}, countsByWeek = {};
  if (service.daily_limit || service.weekly_limit) {
    for (let i = 0; i < days; i++) {
      const d = shiftDateISO(fromDate, i);
      if (service.daily_limit) countsByDate[d] = Math.max(0, await R.countActiveOnDate(db, d, service.id) - (moving?.local_date === d ? 1 : 0));
      if (service.weekly_limit) {
        const wk = startOfISOWeek(d);
        if (countsByWeek[wk] == null) {
          countsByWeek[wk] = Math.max(0, await R.countActiveBetween(
            db, startOfLocalDay(wk, tz), endOfLocalDay(shiftDateISO(wk, 6), tz), service.id) -
            (moving && localDateISO(Number(moving.starts_at_utc), tz) >= wk && localDateISO(Number(moving.starts_at_utc), tz) <= shiftDateISO(wk, 6) ? 1 : 0));
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
  return createManagedBooking(db, input);
}

export async function rescheduleBooking(db, id, input) {
  return rescheduleManagedBooking(db, id, input);
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

  const participants = await R.participantsForBooking(db, b);
  if (actor === ACTOR.CLIENT && name === "cancel" && participants.length > 1) return cancelParticipation(db, b, input);
  const service = await R.getService(db, b.service_id);
  if (name === "confirm" && participants.filter(p => [BOOKING_STATUS.REQUESTED, BOOKING_STATUS.CONFIRMED].includes(p.status)).length < (Number(service?.min_participants)||1)) fail(ERR.VALIDATION_ERROR,"min_participants");
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
  const isCancel = to === BOOKING_STATUS.CANCELLED_CLIENT || to === BOOKING_STATUS.CANCELLED_COACH
    || to === BOOKING_STATUS.LATE_CANCEL;
  const stillHolds = to === BOOKING_STATUS.CONFIRMED || to === BOOKING_STATUS.REQUESTED;

  const stmts = [
    db.prepare(`UPDATE bookings SET status = ?, version = version + 1, updated_at = ?,
                  cancelled_at = ?, cancel_reason = ?, sync_status = ?, mutation_token = ?
                WHERE id = ? AND status = ? AND version = ?`)
      .bind(to, at,
            isCancel ? at : (b.cancelled_at ?? null),
            isCancel ? String(input.reason || "").slice(0, 300) : (b.cancel_reason ?? null),
            stillHolds || isCancel || to === BOOKING_STATUS.COMPLETED || to === BOOKING_STATUS.NO_SHOW
              ? SYNC_STATUS.PENDING : b.sync_status, R.newId("mutation"),
            id, b.status, b.version),
  ];

  // Everything after the guarded UPDATE is itself guarded on the version that
  // UPDATE was trying to create. If two requests arrive together, the loser's
  // UPDATE matches no row — and then it must not delete the winner's locks and
  // must not write a credit movement either. Without this the "cancel and
  // complete in the same instant" case would free a slot that is still taken
  // and hand back a credit that was just spent.
  if (!stillHolds) stmts.push(R.stDeleteLocksIfState(db, id, nextVersion, to));

  for (const participant of participants.filter(p => [BOOKING_STATUS.REQUESTED, BOOKING_STATUS.CONFIRMED].includes(p.status))) {
    const units = Number(participant.credit_cost_units) || 0;
  if (units > 0 && (outcome === "RELEASE" || outcome === "CONSUME")) {
    for (const raw of ledgerForOutcome(outcome, {
      units, client_id: participant.client_id, client_package_id: participant.client_package_id,
      booking_id: id, created_by: actor, created_at: at, version: nextVersion,
      reason: input.reason || "",
    })) {
      stmts.push(R.stInsertLedgerIfState(db, makeEntry({ id: R.newId("cl"), ...raw, idempotency_key: raw.idempotency_key + ":" + participant.client_id }), id, nextVersion, to));
    }
    // A credit handed back onto a package whose validity has already ended is
    // not spendable — allocation skips expired packages. Leaving it in the
    // balance would show a number the booking path then refuses to honour, so
    // it expires in the same breath, with a reason the client can read.
    if (outcome === "RELEASE" && participant.client_package_id) {
      const pkgNow = await db.prepare("SELECT expires_at, status FROM client_packages WHERE id = ?")
        .bind(participant.client_package_id).first();
      const skoncil = pkgNow && ((pkgNow.expires_at && Number(pkgNow.expires_at) <= at) || pkgNow.status === PACKAGE_STATUS.EXPIRED);
      if (skoncil) {
        stmts.push(R.stInsertLedgerIfState(db, makeEntry({
          id: R.newId("cl"), client_id: participant.client_id, client_package_id: participant.client_package_id,
          booking_id: id, kind: LEDGER_KIND.EXPIRY, units, reason: "Platnost balíčku skončila",
          created_by: ACTOR.SYSTEM, created_at: at,
          idempotency_key: id + ":expiry:" + nextVersion + ":" + participant.client_id,
        }), id, nextVersion, to));
      }
    }
  }

  }
  stmts.push(db.prepare(`UPDATE booking_participants SET status=?,updated_at=? WHERE booking_id=? AND status IN ('REQUESTED','CONFIRMED')
    AND EXISTS(SELECT 1 FROM bookings WHERE id=? AND version=? AND status=?)`).bind(to,at,id,id,nextVersion,to));

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

async function financialPreview(db,id,opts,kind) {
  const b=await R.getBooking(db,id); if(!b)fail(ERR.NOT_FOUND,'booking');
  const service=await R.getService(db,b.service_id);
  const members=(await R.participantsForBooking(db,b)).filter(p=>opts.clientId ? p.client_id===opts.clientId : [BOOKING_STATUS.CONFIRMED,BOOKING_STATUS.REQUESTED].includes(p.status));
  if(opts.clientId && !members.length)fail(ERR.NOT_AUTHORIZED);
  const previews=[];
  for(const p of members) {
    const ledger=await R.ledgerAll(db,p.client_id), balanceNow=balanceOf(ledger).available;
    const preview=kind==='cancel' ? cancellationPreview({...b,...p},service,{now:opts.now||Date.now(),byCoach:!!opts.byCoach,balanceNow}) : noShowPreview({...b,...p},service,{balanceNow});
    previews.push({clientId:p.client_id,...preview});
  }
  if(opts.clientId || previews.length<=1){const {clientId,...preview}=previews[0]||{}; return preview;}
  const result={participants:previews,balanceAfter:null};
  for(const key of ['unitsReturned','unitsKept','unitsConsumed']) if(previews.some(p=>key in p))result[key]=previews.reduce((n,p)=>n+(p[key]||0),0);
  return result;
}
export async function cancelPreview(db,id,opts={}) {return financialPreview(db,id,opts,'cancel');}
export async function noShowPreviewFor(db,id,opts={}) {return financialPreview(db,id,opts,'noShow');}

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
