// ======================================================================
// PROGRESSION · a transparent rule, and a suggestion
// ----------------------------------------------------------------------
// No model decides this. It is a small set of readable rules, it always
// says WHY, and it is a SUGGESTION — it never edits a client's plan by
// itself. A coach accepts it or does not.
// ======================================================================

import { measurementOf, compareSets } from "./measurements.js";
import { blocksOf, setsOf, isWorkingSet } from "./sessionModel.js";

export const VERDICTS = ["advance", "repeat", "hold", "reduce", "practice", "measure"];

export const VERDICT_LABEL = {
  advance: ["Jdeme dál", "Move up"],
  repeat: ["Ještě jednou", "Once more"],
  hold: ["Zůstáváme", "We stay"],
  reduce: ["Ubereme", "Take it down"],
  practice: ["Praxe, ne progrese", "Practice, not progression"],
  measure: ["Změříme se", "Let us measure"],
};

const n = (v) => (v == null || v === "" ? null : Number(v));

// The rep range a block was actually prescribed. A single target is a
// range of one, so the rule reads the same either way.
export function rangeOf(planned) {
  const p = planned || {};
  if (p.targetRepsMin != null && p.targetRepsMax != null) return [p.targetRepsMin, p.targetRepsMax];
  if (p.targetReps != null) return [p.targetReps, p.targetReps];
  if (p.targetRepsMin != null) return [p.targetRepsMin, p.targetRepsMin];
  return null;
}

// ---- double progression ----------------------------------------------
// If every working set reached the TOP of the range, and the effort
// reported says there was room, and nothing about the technique was
// flagged — then add a little weight and start again at the bottom of
// the range. That is the whole rule, and it is the one people can hold
// in their head.
export function evaluateBlock(block, opts) {
  const o = opts || {};
  const m = measurementOf(block.measurementType);
  const working = setsOf(block).filter((s) => s.completed && isWorkingSet(s));
  if (!working.length) return null;

  const why = [];
  const rirTarget = o.rirTarget == null ? 1 : o.rirTarget;

  // Pain reported on a joint this exercise loads outranks everything.
  if (o.painNow) return mk("hold", block, ["Bolest je čerstvá. Dneska se nic nepřidává.", "The pain is recent. Nothing goes up today."], null);

  // A coordination skill's numbers swing from day to day. That is what
  // practice looks like; it is not a plateau and it is not fatigue.
  if (o.skillClass === "coordination") {
    return mk("practice", block, ["Dovednost roste praxí, ne přidáváním. Drž frekvenci.", "A skill grows by practice, not by loading. Keep the frequency."], null);
  }

  // Mobility moves on tolerance, control and range — never on willpower
  // through pain.
  if (o.role === "mobility" || o.role === "breath") {
    return mk("practice", block, ["Postup je rozsah a kontrola, ne víc síly.", "Progress here is range and control, not more force."], null);
  }

  const range = rangeOf(working[0].planned);
  const usesReps = ["WEIGHT_REPS", "BODYWEIGHT_REPS", "ADDED_WEIGHT_REPS", "ASSISTED_REPS", "REPS_ONLY"].includes(m.k);

  if (!usesReps) {
    // Holds and distances have their own rule: reached the prescription
    // twice in a row, so ask for a little more.
    const target = n(working[0].planned.targetDurationSec) || n(working[0].planned.targetDistanceM);
    const got = m.k === "DURATION" || m.k === "WEIGHT_DURATION" ? n(working[working.length - 1].actual.durationSec) : n(working[working.length - 1].actual.distanceM);
    if (target && got != null && got >= target && (o.streakAtPrescription || 0) >= 1) {
      return mk("advance", block, ["Předpis sedí už podruhé. Příště o kousek víc.", "The prescription has held twice. A little more next time."], suggestFor(block, m, +1));
    }
    return mk("repeat", block, ["Zůstaň u téhle dávky, dokud nesedí v klidu.", "Stay with this dose until it sits calmly."], null);
  }

  if (!range) return mk("measure", block, ["Bez předepsaného rozsahu se nedá říct, jestli je čas přidat.", "Without a prescribed range there is nothing to judge against."], null);

  const [lo, hi] = range;
  const reps = working.map((s) => n(s.actual.reps) || 0);
  const allTop = reps.every((r) => r >= hi);
  const anyBelow = reps.some((r) => r < lo);
  const rirs = working.map((s) => s.rir).filter((v) => v != null);
  const lastRir = rirs.length ? rirs[rirs.length - 1] : null;
  const avgRir = rirs.length ? rirs.reduce((a, b) => a + b, 0) / rirs.length : null;
  const rirOk = rirs.length === 0 ? true : (avgRir != null && avgRir >= rirTarget) || (lastRir != null && lastRir >= rirTarget);

  if (o.techniqueFlagged) return mk("hold", block, ["Technika byla označená. Nejdřív tvar, potom váha.", "The technique was flagged. Shape first, then load."], null);

  if (allTop && rirOk) {
    why.push(o.assisted
      ? ["Horní hranice rozsahu u všech sérií. Uber dopomoc o nejmenší krok.", "Top of the range on every set. Take the assistance down by the smallest step."]
      : ["Horní hranice rozsahu u všech sérií a v zásobě zbylo. Přidej málo.", "Top of the range on every set, with something left. Add a little."]);
    return mk("advance", block, why[0], suggestFor(block, m, +1, o));
  }
  if (allTop && !rirOk) {
    return mk("repeat", block, ["Rozsah je splněný, ale nic nezbylo. Ještě jednou stejně.", "The range is met but nothing was left over. The same again."], null);
  }
  if (anyBelow && (o.belowStreak || 0) >= 1) {
    return mk("reduce", block, ["Pod dolní hranicí už podruhé. Uber váhu nebo vrať lehčí variantu.", "Below the bottom of the range a second time. Take weight off, or go back a rung."], suggestFor(block, m, -1, o));
  }
  if (anyBelow) return mk("repeat", block, ["Pod dolní hranicí. Zopakuj stejnou dávku.", "Below the bottom of the range. Repeat the same dose."], null);
  return mk("repeat", block, ["V rozsahu. Zůstaň u téhle váhy, dokud nedosáhneš horní hranice.", "Inside the range. Stay at this weight until you reach the top of it."], null);
}

function mk(k, block, why, suggestion) {
  return { k, exId: block.exId, blockId: block.id, measurementType: block.measurementType, why, suggestion };
}

// The size of the step. Small on purpose: the smallest change that is
// still a change is the one that keeps working for months.
export function suggestFor(block, m, dir, opts) {
  const o = opts || {};
  const first = setsOf(block)[0] || {};
  const p = first.planned || {};
  const range = rangeOf(p);
  switch (m.k) {
    case "WEIGHT_REPS":
    case "ADDED_WEIGHT_REPS": {
      const cur = n(p.targetWeight) || 0;
      const step = o.step || (cur >= 60 ? 5 : cur >= 20 ? 2.5 : 1.25);
      const next = Math.max(0, cur + dir * step);
      return { targetWeight: next, targetRepsMin: range ? range[0] : undefined, targetRepsMax: range ? range[1] : undefined, note: ["Zpátky na spodní hranici rozsahu.", "Back to the bottom of the range."] };
    }
    case "ASSISTED_REPS": {
      const cur = n(p.targetAssistance) || 0;
      const step = o.step || 5;
      // Down is forward here.
      return { targetAssistance: Math.max(0, cur - dir * step), targetRepsMin: range ? range[0] : undefined, targetRepsMax: range ? range[1] : undefined };
    }
    case "BODYWEIGHT_REPS":
    case "REPS_ONLY": {
      const hi = range ? range[1] : n(p.targetReps) || 8;
      const lo = range ? range[0] : hi;
      const bump = dir > 0 ? 2 : -2;
      return { targetRepsMin: Math.max(1, lo + bump), targetRepsMax: Math.max(1, hi + bump), harder: dir > 0 };
    }
    case "DURATION":
    case "WEIGHT_DURATION": {
      const cur = n(p.targetDurationSec) || 30;
      return { targetDurationSec: Math.max(5, cur + dir * Math.max(5, Math.round(cur * 0.1))) };
    }
    case "DISTANCE":
    case "DISTANCE_DURATION": {
      const cur = n(p.targetDistanceM) || 1000;
      return { targetDistanceM: Math.max(100, Math.round(cur * (dir > 0 ? 1.1 : 0.9))) };
    }
    default:
      return null;
  }
}

// One verdict for a whole session — the loudest one, and only one, because
// a coach does not hand you five verdicts at the door.
export function evaluateSession(session, ctx) {
  const c = ctx || {};
  const out = [];
  for (const b of blocksOf(session)) {
    const per = c.forBlock ? c.forBlock(b) : {};
    const v = evaluateBlock(b, per);
    if (v) out.push(v);
  }
  const rank = { advance: 0, reduce: 1, hold: 2, measure: 3, practice: 4, repeat: 5 };
  return out.sort((a, b) => (rank[a.k] - rank[b.k]));
}

export { compareSets };
