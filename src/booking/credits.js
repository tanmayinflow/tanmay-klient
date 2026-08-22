// Booking · the credit book.
//
// A balance is a sum, never a stored number that something overwrites. Every
// entry is immutable, signed and carries a reason, an actor and an
// idempotency key; the numbers a person sees are all derived here so there is
// exactly one place where they can be wrong.
//
//   available  = Σ units over every entry          ← what may be booked against
//   reserved   = Σ|HOLD| − Σ RELEASE               ← held by open bookings
//   consumed   = Σ|CONSUME|
//   purchased  = Σ PURCHASE + Σ MANUAL_ADD
//
// A hold is already a debit. Completing a session therefore writes RELEASE
// and CONSUME together: the balance does not move (the credit was spent when
// it was held), but the history says plainly that the hold ended and the
// session used it. That pairing is why a credit can never be taken twice.

import { LEDGER_KIND, LEDGER_SIGN, PACKAGE_STATUS } from "./types.js";

const n = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

/** Every ledger number for one client, from the entries alone. */
export function balanceOf(entries) {
  let available = 0, held = 0, released = 0, consumed = 0, purchased = 0, expired = 0, adjusted = 0, refunded = 0;
  for (const e of entries || []) {
    const u = n(e.units);
    available += u;
    switch (e.kind) {
      case LEDGER_KIND.HOLD: held += -u; break;
      case LEDGER_KIND.RELEASE: released += u; break;
      case LEDGER_KIND.CONSUME: consumed += -u; break;
      case LEDGER_KIND.PURCHASE:
      case LEDGER_KIND.MANUAL_ADD: purchased += u; break;
      case LEDGER_KIND.EXPIRY: expired += -u; break;
      case LEDGER_KIND.REFUND: refunded += u; break;
      case LEDGER_KIND.ADJUSTMENT: adjusted += u; break;
      default: break;
    }
  }
  return {
    available, reserved: held - released, consumed, purchased, expired, refunded, adjusted,
    // What the client is told: what is free now, and what is already spoken for.
    free: available, holding: held - released,
  };
}

/** The same numbers, per package. */
export function balanceByPackage(entries) {
  const by = new Map();
  for (const e of entries || []) {
    const key = e.client_package_id || "";
    if (!by.has(key)) by.set(key, []);
    by.get(key).push(e);
  }
  const out = {};
  for (const [key, list] of by) out[key] = balanceOf(list);
  return out;
}

/**
 * Which package a booking should draw on.
 *
 * Deterministic and stated out loud, because "it took from the wrong one" is
 * the kind of thing a person only notices when a package has already expired:
 *   1. only packages that are active, valid now and still have credit
 *   2. only packages whose eligible services include this one
 *   3. the one expiring soonest, then the one bought earliest, then by id
 *
 * The coach may override the choice by hand; the client never chooses.
 */
export function allocatePackage(packages, entries, opts) {
  const o = opts || {};
  const nowMs = n(o.now) || Date.now();
  const need = Math.max(1, n(o.units) || 1);
  const serviceId = o.serviceId || null;
  const perPackage = balanceByPackage(entries);

  const eligible = (packages || []).filter((p) => {
    if (p.status && p.status !== PACKAGE_STATUS.ACTIVE) return false;
    if (p.valid_from && n(p.valid_from) > nowMs) return false;
    if (p.expires_at && n(p.expires_at) <= nowMs) return false;
    if (serviceId && p.eligible_service_ids && p.eligible_service_ids.length
        && p.eligible_service_ids.indexOf(serviceId) < 0) return false;
    const bal = perPackage[p.id];
    return !!bal && bal.available >= need;
  });

  eligible.sort((a, b) => {
    const ea = n(a.expires_at) || Infinity, eb = n(b.expires_at) || Infinity;
    if (ea !== eb) return ea - eb;
    const pa = n(a.purchased_at), pb = n(b.purchased_at);
    if (pa !== pb) return pa - pb;
    return String(a.id).localeCompare(String(b.id));
  });
  return eligible[0] || null;
}

/**
 * A ledger entry, checked before it is written.
 *
 * Sign is not a preference: HOLD arriving positive is a bug, and a bug that
 * would add credit instead of taking it. ADJUSTMENT is the only signed kind
 * and it is the only one that demands a reason in words.
 */
export function makeEntry(input) {
  const kind = String(input.kind || "");
  if (!Object.prototype.hasOwnProperty.call(LEDGER_SIGN, kind)) {
    throw new Error("unknown ledger kind: " + kind);
  }
  let units = n(input.units);
  if (!Number.isInteger(units)) throw new Error("credit units are whole numbers");
  const want = LEDGER_SIGN[kind];
  if (want === 1) units = Math.abs(units);
  else if (want === -1) units = -Math.abs(units);
  if (units === 0) throw new Error("a ledger entry of zero says nothing");
  if (kind === LEDGER_KIND.ADJUSTMENT && !String(input.reason || "").trim()) {
    throw new Error("a manual adjustment needs a reason");
  }
  if (!input.idempotency_key) throw new Error("every ledger entry needs an idempotency key");
  return {
    id: input.id,
    client_id: input.client_id,
    client_package_id: input.client_package_id || null,
    booking_id: input.booking_id || null,
    kind,
    units,
    reason: String(input.reason || "").slice(0, 300),
    created_by: input.created_by || "SYSTEM",
    created_at: n(input.created_at) || Date.now(),
    idempotency_key: String(input.idempotency_key),
  };
}

/**
 * What cancelling this booking now would do to the balance, before it is
 * done. The client sees this sentence and then decides; there is no hidden
 * penalty and no surprise afterwards.
 */
export function cancellationPreview(booking, service, opts) {
  const o = opts || {};
  const nowMs = n(o.now) || Date.now();
  const byCoach = !!o.byCoach;
  const units = Math.max(0, n(booking.credit_cost_units));
  const cancelBefore = Math.max(0, n(service && service.cancel_before_min));
  const deadline = n(booking.starts_at_utc) - cancelBefore * 60000;
  const late = !byCoach && nowMs > deadline;
  // The coach cancelling always returns the credit. Late cancellation follows
  // the service policy, and the safe default returns nothing.
  const refunded = byCoach ? units : (late ? (service && service.late_cancel_refunds ? units : 0) : units);
  return {
    late,
    deadline,
    unitsReturned: refunded,
    unitsKept: units - refunded,
    balanceAfter: n(o.balanceNow) + refunded,
  };
}

/** What marking a no-show would do. Configurable, with a safe default. */
export function noShowPreview(booking, service, opts) {
  const o = opts || {};
  const units = Math.max(0, n(booking.credit_cost_units));
  const consumes = !(service && service.no_show_refunds);
  return {
    unitsConsumed: consumes ? units : 0,
    unitsReturned: consumes ? 0 : units,
    balanceAfter: n(o.balanceNow) + (consumes ? 0 : units),
  };
}

/** Packages past their validity that still hold credit, so it can expire. */
export function expiredPackagesWithCredit(packages, entries, nowMs) {
  const at = n(nowMs) || Date.now();
  const per = balanceByPackage(entries);
  return (packages || []).filter((p) => {
    if (!p.expires_at || n(p.expires_at) > at) return false;
    if (p.status === PACKAGE_STATUS.CANCELLED) return false;
    const bal = per[p.id];
    return !!bal && bal.available > 0;
  });
}
