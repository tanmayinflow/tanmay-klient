// Booking · the status machine.
//
// A booking does not have a status field that anything may write. It has a
// state, and every move out of that state has a name, an actor allowed to
// make it, and an effect on the held credit. Nothing else is permitted, so
// "cancel and complete at the same moment" resolves instead of racing.

import { BOOKING_STATUS, ACTOR, LEDGER_KIND } from "./types.js";

const S = BOOKING_STATUS;

/**
 * from → { transition: { to, who[], credit } }
 *
 * `credit` says what happens to the hold this booking is carrying:
 *   RELEASE   the hold goes back, balance rises
 *   CONSUME   the hold ends and the credit is spent (RELEASE + CONSUME pair)
 *   KEEP      nothing moves
 *   POLICY    the service decides; the caller resolves it before writing
 */
export const TRANSITIONS = Object.freeze({
  [S.REQUESTED]: {
    confirm: { to: S.CONFIRMED, who: [ACTOR.COACH], credit: "KEEP" },
    reject: { to: S.CANCELLED_COACH, who: [ACTOR.COACH], credit: "RELEASE" },
    cancel: { to: S.CANCELLED_CLIENT, who: [ACTOR.CLIENT, ACTOR.COACH], credit: "POLICY" },
    reschedule: { to: S.REQUESTED, who: [ACTOR.CLIENT, ACTOR.COACH], credit: "KEEP" },
  },
  [S.CONFIRMED]: {
    complete: { to: S.COMPLETED, who: [ACTOR.COACH], credit: "CONSUME" },
    noShow: { to: S.NO_SHOW, who: [ACTOR.COACH], credit: "POLICY" },
    cancel: { to: S.CANCELLED_CLIENT, who: [ACTOR.CLIENT, ACTOR.COACH], credit: "POLICY" },
    cancelCoach: { to: S.CANCELLED_COACH, who: [ACTOR.COACH], credit: "RELEASE" },
    lateCancel: { to: S.LATE_CANCEL, who: [ACTOR.CLIENT, ACTOR.COACH], credit: "POLICY" },
    reschedule: { to: S.CONFIRMED, who: [ACTOR.CLIENT, ACTOR.COACH], credit: "KEEP" },
  },
  // Everything below is over. A finished booking stays in the history exactly
  // as it ended; the coach corrects a mistake with a new entry, never by
  // rewriting what was recorded.
  [S.COMPLETED]: {},
  [S.CANCELLED_CLIENT]: {},
  [S.CANCELLED_COACH]: {},
  [S.LATE_CANCEL]: {},
  [S.NO_SHOW]: {},
});

/** Can `actor` make this move from this state? Returns the rule or null. */
export function transitionFor(fromStatus, name, actor) {
  const table = TRANSITIONS[fromStatus];
  if (!table) return null;
  const rule = table[name];
  if (!rule) return null;
  if (actor && rule.who.indexOf(actor) < 0) return null;
  return rule;
}

export function canTransition(fromStatus, name, actor) {
  return !!transitionFor(fromStatus, name, actor);
}

/** The moves available from a state, for an interface that offers buttons. */
export function transitionsFrom(fromStatus, actor) {
  const table = TRANSITIONS[fromStatus] || {};
  return Object.keys(table).filter((k) => !actor || table[k].who.indexOf(actor) >= 0);
}

/**
 * The ledger entries a credit outcome produces.
 * RELEASE gives the hold back. CONSUME closes the hold and spends it, which
 * is two rows on purpose: the balance stays where the hold left it and the
 * history shows both facts.
 */
export function ledgerForOutcome(outcome, ctx) {
  const units = Math.max(0, Number(ctx.units) || 0);
  if (!units) return [];
  const base = {
    client_id: ctx.client_id,
    client_package_id: ctx.client_package_id || null,
    booking_id: ctx.booking_id,
    created_by: ctx.created_by || ACTOR.SYSTEM,
    created_at: ctx.created_at || Date.now(),
  };
  if (outcome === "RELEASE") {
    return [{ ...base, kind: LEDGER_KIND.RELEASE, units, reason: ctx.reason || "",
      idempotency_key: ctx.booking_id + ":release:" + ctx.version }];
  }
  if (outcome === "CONSUME") {
    return [
      { ...base, kind: LEDGER_KIND.RELEASE, units, reason: ctx.reason || "",
        idempotency_key: ctx.booking_id + ":release:" + ctx.version },
      { ...base, kind: LEDGER_KIND.CONSUME, units, reason: ctx.reason || "",
        idempotency_key: ctx.booking_id + ":consume:" + ctx.version },
    ];
  }
  return [];
}

/** Does this state still occupy its slot and hold its credit? */
export const holdsSlot = (status) => status === S.REQUESTED || status === S.CONFIRMED;
