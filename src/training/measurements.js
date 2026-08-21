// ======================================================================
// MEASUREMENT MODEL · how one exercise is counted
// ----------------------------------------------------------------------
// Every exercise has exactly ONE primary measurement type. It decides the
// input fields, the shape of a set row, what "previous" means, which
// records are possible, what the chart plots and what the client app
// shows. Nothing else in the system is allowed to decide those.
//
// The rule that made this necessary: a seated leg curl and a lying leg
// curl are not the same history, an assisted pull-up gets BETTER as the
// number goes DOWN, and a prescribed submaximal hold is not a personal
// best just because it lasted longer.
// ======================================================================

export const MEASUREMENT_TYPES = [
  "WEIGHT_REPS",
  "BODYWEIGHT_REPS",
  "ADDED_WEIGHT_REPS",
  "ASSISTED_REPS",
  "REPS_ONLY",
  "DURATION",
  "WEIGHT_DURATION",
  "DISTANCE_DURATION",
  "DISTANCE",
  "ROUNDS",
  "HEIGHT_REPS",
];

// `fields` is the actual-value shape, in the order a row shows them.
// `planned` is what a prescription may carry. `better` says which way is
// an improvement for the leading field. `e1rm` says whether an estimated
// one-rep max is a meaningful thing to show at all.
export const MEASUREMENT = {
  WEIGHT_REPS: {
    k: "WEIGHT_REPS",
    cz: "Váha × opakování", en: "Weight × reps",
    fields: ["weight", "reps"], lead: "weight", better: "up",
    planned: ["targetWeight", "targetReps", "targetRepsMin", "targetRepsMax", "targetRir"],
    e1rm: true, volume: "weightReps",
  },
  BODYWEIGHT_REPS: {
    k: "BODYWEIGHT_REPS",
    cz: "Opakování vlastní vahou", en: "Bodyweight reps",
    fields: ["reps"], lead: "reps", better: "up",
    planned: ["targetReps", "targetRepsMin", "targetRepsMax", "targetRir"],
    // A belt or a plate is standard practice on a pull-up, not a stunt.
    // The added weight is a SECONDARY metric: the record engine keeps
    // loaded and unloaded sets in separate buckets so neither flatters
    // the other.
    secondary: "addedWeight", e1rm: false, volume: "reps",
  },
  ADDED_WEIGHT_REPS: {
    k: "ADDED_WEIGHT_REPS",
    cz: "Přidaná váha × opakování", en: "Added weight × reps",
    fields: ["weight", "reps"], lead: "weight", better: "up",
    planned: ["targetWeight", "targetReps", "targetRepsMin", "targetRepsMax", "targetRir"],
    // Only an estimate, and only when a bodyweight is on file — the bar
    // is not the whole load.
    e1rm: "estimate", volume: "reps",
  },
  ASSISTED_REPS: {
    k: "ASSISTED_REPS",
    cz: "Opakování s dopomocí", en: "Assisted reps",
    fields: ["assistance", "reps"], lead: "assistance", better: "down",
    planned: ["targetAssistance", "targetReps", "targetRepsMin", "targetRepsMax", "targetRir"],
    e1rm: false, volume: "reps",
  },
  REPS_ONLY: {
    k: "REPS_ONLY",
    cz: "Jen opakování", en: "Reps only",
    fields: ["reps"], lead: "reps", better: "up",
    planned: ["targetReps", "targetRepsMin", "targetRepsMax"],
    e1rm: false, volume: "reps",
  },
  DURATION: {
    k: "DURATION",
    cz: "Výdrž", en: "Hold",
    fields: ["durationSec"], lead: "durationSec", better: "up",
    planned: ["targetDurationSec", "targetRir"],
    e1rm: false, volume: "time",
  },
  WEIGHT_DURATION: {
    k: "WEIGHT_DURATION",
    cz: "Váha × čas", en: "Weight × time",
    fields: ["weight", "durationSec"], lead: "weight", better: "up",
    planned: ["targetWeight", "targetDurationSec", "targetDistanceM"],
    e1rm: false, volume: "time",
  },
  DISTANCE_DURATION: {
    k: "DISTANCE_DURATION",
    cz: "Vzdálenost a čas", en: "Distance and time",
    fields: ["distanceM", "durationSec"], lead: "distanceM", better: "up",
    planned: ["targetDistanceM", "targetDurationSec"],
    e1rm: false, volume: "distance",
  },
  DISTANCE: {
    k: "DISTANCE",
    cz: "Vzdálenost", en: "Distance",
    fields: ["distanceM"], lead: "distanceM", better: "up",
    planned: ["targetDistanceM"],
    e1rm: false, volume: "distance",
  },
  ROUNDS: {
    k: "ROUNDS",
    cz: "Kola", en: "Rounds",
    fields: ["rounds"], lead: "rounds", better: "up",
    planned: ["targetDurationSec", "targetRounds"],
    e1rm: false, volume: "rounds",
  },
  HEIGHT_REPS: {
    k: "HEIGHT_REPS",
    cz: "Výška × opakování", en: "Height × reps",
    fields: ["height", "reps"], lead: "height", better: "up",
    planned: ["targetHeight", "targetReps"],
    e1rm: false, volume: "reps",
  },
};

export const isMeasurement = (k) => Object.prototype.hasOwnProperty.call(MEASUREMENT, k);
export const measurementOf = (k) => MEASUREMENT[k] || MEASUREMENT.REPS_ONLY;

// Every actual field the model knows, with its unit and how it prints.
export const FIELD = {
  reps: { cz: "opakování", en: "reps", unit: ["×", "×"], step: 1, min: 0, max: 999 },
  weight: { cz: "váha", en: "weight", unit: ["kg", "kg"], step: 2.5, min: 0, max: 999 },
  addedWeight: { cz: "přidaná váha", en: "added weight", unit: ["kg", "kg"], step: 2.5, min: 0, max: 300 },
  assistance: { cz: "dopomoc", en: "assistance", unit: ["kg", "kg"], step: 2.5, min: 0, max: 200 },
  durationSec: { cz: "čas", en: "time", unit: ["s", "s"], step: 5, min: 0, max: 36000 },
  distanceM: { cz: "vzdálenost", en: "distance", unit: ["m", "m"], step: 100, min: 0, max: 300000 },
  rounds: { cz: "kola", en: "rounds", unit: ["", ""], step: 1, min: 0, max: 999 },
  height: { cz: "výška", en: "height", unit: ["cm", "cm"], step: 5, min: 0, max: 250 },
};

const num = (v) => (v == null || v === "" ? null : Number(v));
const fin = (v) => (typeof v === "number" && isFinite(v) ? v : null);

// ---- formatting ------------------------------------------------------
// One value, printed the way this exercise is actually counted. `cz`
// picks the language; nothing here reads a global.
export function fmtDuration(sec, cz) {
  const s = Math.max(0, Math.round(Number(sec) || 0));
  if (s < 60) return s + " s";
  const m = Math.floor(s / 60), r = s % 60;
  if (m < 60) return r ? m + ":" + String(r).padStart(2, "0") : m + (cz ? " min" : " min");
  const h = Math.floor(m / 60);
  return h + ":" + String(m % 60).padStart(2, "0") + ":" + String(r).padStart(2, "0");
}

export function fmtDistance(m, cz) {
  const v = Math.max(0, Number(m) || 0);
  if (v < 1000) return Math.round(v) + " m";
  const km = v / 1000;
  const s = km >= 100 ? km.toFixed(0) : km.toFixed(km >= 10 ? 1 : 2);
  return (cz ? s.replace(".", ",") : s) + " km";
}

export function fmtWeight(kg, cz) {
  const v = Number(kg) || 0;
  const s = Math.abs(v % 1) < 0.001 ? String(Math.round(v)) : v.toFixed(1);
  return (cz ? s.replace(".", ",") : s) + " kg";
}

// A pace only means something when both halves are there, and only for
// the types that measure distance against time.
export function fmtPace(distanceM, durationSec, cz) {
  const d = Number(distanceM) || 0, t = Number(durationSec) || 0;
  if (d <= 0 || t <= 0) return "";
  const secPerKm = t / (d / 1000);
  const m = Math.floor(secPerKm / 60), s = Math.round(secPerKm % 60);
  return m + ":" + String(s).padStart(2, "0") + (cz ? " /km" : " /km");
}

// The whole set, on one line. Used by the log, the summary, the history
// and the client app, so there is exactly one way a set reads.
export function fmtActual(type, a, cz) {
  if (!a) return "";
  const m = measurementOf(type);
  const w = fin(num(a.weight)), r = fin(num(a.reps)), d = fin(num(a.durationSec));
  const dist = fin(num(a.distanceM)), as = fin(num(a.assistance)), h = fin(num(a.height));
  const rounds = fin(num(a.rounds)), add = fin(num(a.addedWeight));
  switch (m.k) {
    case "WEIGHT_REPS":
      if (w == null && r == null) return "";
      return (w != null ? fmtWeight(w, cz) : "—") + (r != null ? " × " + r : "");
    case "ADDED_WEIGHT_REPS":
      if (w == null && r == null) return "";
      return "+" + fmtWeight(w || 0, cz) + (r != null ? " × " + r : "");
    case "ASSISTED_REPS":
      if (as == null && r == null) return "";
      return (cz ? "−" : "−") + fmtWeight(as || 0, cz) + (r != null ? " × " + r : "");
    case "BODYWEIGHT_REPS":
      if (r == null) return "";
      return r + "×" + (add ? " · +" + fmtWeight(add, cz) : "");
    case "REPS_ONLY":
      return r == null ? "" : r + "×";
    case "DURATION":
      return d == null ? "" : fmtDuration(d, cz);
    case "WEIGHT_DURATION": {
      const load = w != null ? fmtWeight(w, cz) : "";
      const span = d != null ? fmtDuration(d, cz) : dist != null ? fmtDistance(dist, cz) : "";
      return [load, span].filter(Boolean).join(" · ");
    }
    case "DISTANCE_DURATION": {
      if (dist == null && d == null) return "";
      const p = fmtPace(dist, d, cz);
      return [dist != null ? fmtDistance(dist, cz) : "", d != null ? fmtDuration(d, cz) : "", p].filter(Boolean).join(" · ");
    }
    case "DISTANCE":
      return dist == null ? "" : fmtDistance(dist, cz);
    case "ROUNDS":
      return rounds == null ? "" : rounds + (cz ? " kol" : " rounds");
    case "HEIGHT_REPS":
      if (h == null && r == null) return "";
      return (h != null ? h + " cm" : "—") + (r != null ? " × " + r : "");
    default:
      return "";
  }
}

// The prescription, printed the same way. A range prints as a range —
// "8–12" is a different instruction from "10" and must not be flattened.
export function fmtPlanned(type, p, cz) {
  if (!p) return "";
  const m = measurementOf(type);
  const reps = p.targetRepsMin != null && p.targetRepsMax != null && p.targetRepsMin !== p.targetRepsMax
    ? p.targetRepsMin + "–" + p.targetRepsMax
    : p.targetReps != null ? String(p.targetReps) : p.targetRepsMin != null ? String(p.targetRepsMin) : "";
  const w = fin(num(p.targetWeight));
  switch (m.k) {
    case "WEIGHT_REPS":
      return [w != null ? fmtWeight(w, cz) : "", reps ? "× " + reps : ""].filter(Boolean).join(" ");
    case "ADDED_WEIGHT_REPS":
      return [w != null ? "+" + fmtWeight(w, cz) : "", reps ? "× " + reps : ""].filter(Boolean).join(" ");
    case "ASSISTED_REPS":
      return [p.targetAssistance != null ? "−" + fmtWeight(p.targetAssistance, cz) : "", reps ? "× " + reps : ""].filter(Boolean).join(" ");
    case "BODYWEIGHT_REPS":
    case "REPS_ONLY":
      return reps ? reps + "×" : "";
    case "DURATION":
      return p.targetDurationSec != null ? fmtDuration(p.targetDurationSec, cz) : "";
    case "WEIGHT_DURATION":
      return [w != null ? fmtWeight(w, cz) : "", p.targetDurationSec != null ? fmtDuration(p.targetDurationSec, cz) : p.targetDistanceM != null ? fmtDistance(p.targetDistanceM, cz) : ""].filter(Boolean).join(" · ");
    case "DISTANCE_DURATION":
      return [p.targetDistanceM != null ? fmtDistance(p.targetDistanceM, cz) : "", p.targetDurationSec != null ? fmtDuration(p.targetDurationSec, cz) : ""].filter(Boolean).join(" · ");
    case "DISTANCE":
      return p.targetDistanceM != null ? fmtDistance(p.targetDistanceM, cz) : "";
    case "ROUNDS":
      return p.targetDurationSec != null ? fmtDuration(p.targetDurationSec, cz) : p.targetRounds != null ? p.targetRounds + (cz ? " kol" : " rounds") : "";
    case "HEIGHT_REPS":
      return [p.targetHeight != null ? p.targetHeight + " cm" : "", reps ? "× " + reps : ""].filter(Boolean).join(" ");
    default:
      return "";
  }
}

// ---- validation ------------------------------------------------------
// Returns a cleaned actual object with only the fields this measurement
// type owns, every value a finite number in range, and nothing else
// carried along. A stray field on a set is a bug that surfaces months
// later in a statistic.
export function normalizeActual(type, a) {
  const m = measurementOf(type);
  const keep = m.fields.concat(m.secondary ? [m.secondary] : []);
  const out = {};
  for (const f of keep) {
    const spec = FIELD[f];
    let v = num(a ? a[f] : null);
    if (v == null || !isFinite(v)) continue;
    v = Math.min(spec.max, Math.max(spec.min, v));
    out[f] = f === "weight" || f === "assistance" || f === "addedWeight" ? Math.round(v * 100) / 100 : Math.round(v);
  }
  return out;
}

export function normalizePlanned(type, p) {
  const m = measurementOf(type);
  const out = {};
  for (const f of m.planned) {
    const v = num(p ? p[f] : null);
    if (v == null || !isFinite(v)) continue;
    out[f] = f === "targetWeight" || f === "targetAssistance" ? Math.round(v * 100) / 100 : Math.round(v);
  }
  if (out.targetRepsMin != null && out.targetRepsMax != null && out.targetRepsMin > out.targetRepsMax) {
    const t = out.targetRepsMin; out.targetRepsMin = out.targetRepsMax; out.targetRepsMax = t;
  }
  return out;
}

// Has the person actually written something, or is the row still empty?
// A completed set with no values is a tick with nothing behind it.
export function hasActual(type, a) {
  const m = measurementOf(type);
  return m.fields.some((f) => {
    const v = num(a ? a[f] : null);
    return v != null && isFinite(v) && v > 0;
  });
}

// ---- comparison ------------------------------------------------------
// Which of two sets is the better one, for THIS measurement type. Returns
// 1 when a is better, -1 when b is, 0 when they are level. Assistance
// counts down; everything else counts up.
export function compareSets(type, a, b) {
  const m = measurementOf(type);
  const dir = m.better === "down" ? -1 : 1;
  const av = num(a && a[m.lead]), bv = num(b && b[m.lead]);
  if (av == null && bv == null) return 0;
  if (av == null) return -1;
  if (bv == null) return 1;
  if (av !== bv) return av > bv ? dir : -dir;
  // Level on the leading field: the tie-break is the second field, and
  // it always counts up (more reps at the same weight is more work; more
  // reps at the same assistance is more work too).
  const second = m.fields[1];
  if (!second) return 0;
  const a2 = num(a && a[second]) || 0, b2 = num(b && b[second]) || 0;
  return a2 === b2 ? 0 : a2 > b2 ? 1 : -1;
}

// The single number a growth line plots. Not a score of the person —
// just the leading field, so the axis can be labelled honestly.
export function scoreOf(type, a) {
  const m = measurementOf(type);
  const v = num(a && a[m.lead]);
  if (v == null) return 0;
  // A lower assistance is a better result, so the line has to rise as
  // the number falls or the chart lies about the direction of travel.
  return m.better === "down" ? -v : v;
}

export function scoreLabel(type, cz) {
  const m = measurementOf(type);
  const f = FIELD[m.lead];
  return cz ? f.cz : f.en;
}

// ---- estimated one-rep max -------------------------------------------
// ONE formula everywhere, Epley, and it is always labelled an estimate.
// Never shown for a skill, an assisted rep, a hold or a mobility drill —
// the number would be arithmetic on something that is not a max.
export function e1rm(type, a) {
  const m = measurementOf(type);
  if (!m.e1rm) return null;
  const w = num(a && a.weight), r = num(a && a.reps);
  if (w == null || r == null || w <= 0 || r <= 0) return null;
  if (r > 12) return null; // past twelve reps the formula is a guess about endurance
  return Math.round(w * (1 + r / 30) * 10) / 10;
}

export const e1rmIsEstimateOnly = (type) => measurementOf(type).e1rm === "estimate";

// ---- volume ----------------------------------------------------------
// What one completed set contributes, in the unit this type can honestly
// add up. `weightReps` is kilogram-reps; `reps` is reps; `time` is
// seconds; `distance` is metres. They are never summed together.
export function setVolume(type, a) {
  const m = measurementOf(type);
  const n = (k) => num(a && a[k]) || 0;
  switch (m.volume) {
    case "weightReps": return { kind: "weightReps", value: n("weight") * n("reps") };
    case "reps": return { kind: "reps", value: n("reps") };
    case "time": return { kind: "time", value: n("durationSec") };
    case "distance": return { kind: "distance", value: n("distanceM") };
    case "rounds": return { kind: "rounds", value: n("rounds") };
    default: return { kind: "reps", value: 0 };
  }
}
