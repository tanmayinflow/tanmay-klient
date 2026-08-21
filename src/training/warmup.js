// ======================================================================
// WARM-UP CALCULATOR · optional, and not one rigid model
// ----------------------------------------------------------------------
// Percentages belong to heavy external load. A light isolation does not
// need five ramp sets, and a skill does not warm up by doing 40 % of a
// handstand — it warms up by doing an easier rung.
// ======================================================================

import { roundToPlates } from "./plates.js";

// How many ramp sets are worth doing, from how heavy the working set is.
export function rampCountFor(workingWeight, barWeight, asked) {
  const w = Number(workingWeight) || 0;
  const bar = Number(barWeight) || 20;
  if (asked != null) return Math.max(0, Math.min(6, Math.round(asked)));
  if (w <= bar * 1.2) return 1;
  if (w < 60) return 2;
  if (w < 100) return 3;
  if (w < 140) return 4;
  return 5;
}

const RAMPS = {
  1: [0.6],
  2: [0.45, 0.7],
  3: [0.4, 0.6, 0.8],
  4: [0.4, 0.6, 0.75, 0.87],
  5: [0.35, 0.5, 0.65, 0.8, 0.9],
  6: [0.3, 0.45, 0.6, 0.72, 0.83, 0.92],
};

const RAMP_REPS = [8, 6, 5, 3, 2, 1];

// Returns a list of warm-up sets ready to be inserted as `type: "warmup"`.
// The empty bar is offered first only when the bar is a real part of the
// load — a dumbbell press has no empty bar to do.
export function warmupFor(opts) {
  const o = opts || {};
  const policy = o.policy || "ramp";
  if (policy === "none") return [];

  if (policy === "specific") {
    // Progression-specific preparation: two easy sets of the same shape
    // or of the rung below. No percentages, because there is no percentage
    // of a skill.
    return [
      { type: "warmup", planned: { targetReps: o.skillReps || 3 }, note: ["Lehčí varianta, bez únavy.", "An easier variant, no fatigue."] },
      { type: "warmup", planned: { targetReps: o.skillReps || 3 }, note: ["Stejný tvar, kratší výdrž.", "The same shape, a shorter hold."] },
    ];
  }

  const working = Number(o.workingWeight) || 0;
  const bar = Number(o.barWeight) || 20;
  const plates = o.plates;

  if (policy === "light" || working <= 0) {
    // No bar in play means no rounding to plates: a 6 kg dumbbell must
    // not come back as "the empty bar".
    const half = working ? (o.hasBar ? roundToPlates(working * 0.5, bar, plates).weight : Math.round(working * 0.5 * 2) / 2) : undefined;
    return [{ type: "warmup", planned: { targetWeight: half, targetReps: 10 }, note: ["Jedna lehká série, ať víš, kde jsi.", "One light set, to see where you are."] }];
  }

  const count = rampCountFor(working, bar, o.count);
  const steps = RAMPS[count] || RAMPS[3];
  const out = [];
  // The empty bar earns a set only when it is meaningfully lighter than
  // the first percentage step.
  if (o.hasBar && bar > 0 && bar < working * steps[0] * 0.9) {
    out.push({ type: "warmup", planned: { targetWeight: bar, targetReps: 10 }, note: ["Prázdná osa.", "The empty bar."] });
  }
  steps.forEach((pct, i) => {
    const raw = working * pct;
    const r = plates ? roundToPlates(raw, bar, plates) : { weight: Math.round(raw / 2.5) * 2.5 };
    out.push({
      type: "warmup",
      planned: { targetWeight: r.weight, targetReps: RAMP_REPS[Math.min(i, RAMP_REPS.length - 1)] },
      pct: Math.round(pct * 100),
    });
  });
  return out;
}
