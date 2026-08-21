// ======================================================================
// PROGRESS · records that mean what they say
// ----------------------------------------------------------------------
// A record is only a record inside its own measurement type. Comparing a
// seated leg curl to a lying one, or a set with 20 kg of assistance to a
// set with none, is arithmetic on two different things.
//
// Three rules this module exists to enforce:
//   · lower assistance is a better result, not a worse one
//   · a longer hold is not automatically a record when the prescription
//     asked for a submaximal hold
//   · an estimated one-rep max is an estimate, is labelled as one, and is
//     never shown for a skill, a hold, assisted work or mobility
// ======================================================================

import { measurementOf, compareSets, e1rm, e1rmIsEstimateOnly, setVolume, fmtActual, fmtDuration, fmtWeight, fmtDistance, fmtPace } from "./measurements.js";
import { blocksOf, setsOf, isWorkingSet } from "./sessionModel.js";

const n = (v) => (v == null || v === "" ? null : Number(v));

// One flat, sortable history of every completed working set for one
// exercise. Everything else in this module reads this shape.
export function historyOf(sessions, exId, opts) {
  const o = opts || {};
  const who = o.who || "";
  const out = [];
  for (const ses of sessions || []) {
    if ((ses.who || "") !== who) continue;
    if (o.stateFilter !== false && ses.state !== "done") continue;
    for (const b of blocksOf(ses)) {
      if (b.exId !== exId) continue;
      for (const s of setsOf(b)) {
        if (!s.completed || !isWorkingSet(s)) continue;
        out.push({
          sessionId: ses.id,
          date: ses.date || "",
          at: ses.endedAt || ses.startedAt || 0,
          measurementType: b.measurementType,
          type: s.type,
          actual: s.actual || {},
          planned: s.planned || {},
          rir: s.rir,
          // A prescription that says "hold, do not push" is remembered,
          // so a longer hold on that day cannot be sold as a breakthrough.
          submax: !!(s.planned && s.planned.targetRir != null && s.planned.targetRir >= 2) || !!b.submax,
        });
      }
    }
  }
  return out.sort((a, b2) => a.at - b2.at);
}

// Every entry of one session, grouped per exercise. Used by the summary.
export function sessionEntries(session) {
  const out = [];
  for (const b of blocksOf(session)) {
    const done = setsOf(b).filter((s) => s.completed && isWorkingSet(s));
    if (!done.length) continue;
    out.push({
      blockId: b.id, exId: b.exId, name: b.name, measurementType: b.measurementType,
      sets: done.map((s) => ({ actual: s.actual || {}, planned: s.planned || {}, rir: s.rir, type: s.type, submax: !!(s.planned && s.planned.targetRir >= 2) })),
    });
  }
  return out;
}

// ---- record kinds ----------------------------------------------------
// Which records this measurement type can honestly produce.
export function recordKindsFor(measurementType) {
  switch (measurementOf(measurementType).k) {
    case "WEIGHT_REPS": return ["heaviest", "e1rm", "repsAtWeight", "volume"];
    case "BODYWEIGHT_REPS": return ["bestReps", "totalReps", "bestAdded"];
    case "ADDED_WEIGHT_REPS": return ["bestAdded", "systemLoad", "e1rm"];
    case "ASSISTED_REPS": return ["lowestAssistance", "repsAtAssistance"];
    case "REPS_ONLY": return ["bestReps", "totalReps"];
    case "DURATION": return ["bestHold"];
    case "WEIGHT_DURATION": return ["heaviest", "bestHold"];
    case "DISTANCE_DURATION": return ["longestDistance", "fastestPace", "bestDuration"];
    case "DISTANCE": return ["longestDistance"];
    case "ROUNDS": return ["bestRounds"];
    case "HEIGHT_REPS": return ["highest", "repsAtHeight"];
    default: return [];
  }
}

export const RECORD_LABEL = {
  heaviest: ["Nejtěžší série", "Heaviest set"],
  e1rm: ["Odhad maxima", "Estimated max"],
  repsAtWeight: ["Nejvíc opakování na váze", "Best reps at a weight"],
  volume: ["Nejvyšší objem série", "Biggest set"],
  bestReps: ["Nejvíc opakování", "Best reps"],
  totalReps: ["Nejvíc opakování za trénink", "Best session total"],
  bestAdded: ["Nejvyšší přidaná váha", "Best added weight"],
  systemLoad: ["Celková zátěž", "Total system load"],
  lowestAssistance: ["Nejmenší dopomoc", "Lowest assistance"],
  repsAtAssistance: ["Nejvíc opakování s dopomocí", "Best reps at an assistance"],
  bestHold: ["Nejdelší výdrž", "Longest hold"],
  longestDistance: ["Nejdelší vzdálenost", "Longest distance"],
  fastestPace: ["Nejrychlejší tempo", "Fastest pace"],
  bestDuration: ["Nejdelší čas", "Longest time"],
  bestRounds: ["Nejvíc kol", "Most rounds"],
  highest: ["Nejvyšší výška", "Highest"],
  repsAtHeight: ["Nejvíc opakování ve výšce", "Best reps at a height"],
};

// ---- computing the records -------------------------------------------
// `bodyweightKg` is optional and only used where it is honest to use it.
export function recordsFor(measurementType, history, opts) {
  const o = opts || {};
  const m = measurementOf(measurementType);
  const kinds = recordKindsFor(measurementType);
  const out = {};
  const put = (k, value, entry, extra) => {
    if (value == null || !isFinite(value)) return;
    const prev = out[k];
    const better = k === "lowestAssistance" || k === "fastestPace" ? value < (prev ? prev.value : Infinity) : value > (prev ? prev.value : -Infinity);
    if (!prev || better) out[k] = { k, value, at: entry.at, date: entry.date, sessionId: entry.sessionId, actual: entry.actual, ...(extra || {}) };
  };

  // Session totals need a pass of their own.
  const bySession = new Map();
  for (const e of history) {
    if (!bySession.has(e.sessionId)) bySession.set(e.sessionId, []);
    bySession.get(e.sessionId).push(e);
  }

  for (const e of history) {
    const a = e.actual || {};
    if (kinds.includes("heaviest")) put("heaviest", n(a.weight), e, { reps: n(a.reps) });
    if (kinds.includes("e1rm") && m.e1rm) {
      // Added-weight work only earns an estimate when a bodyweight is on
      // file — the plate is not the whole load.
      if (!e1rmIsEstimateOnly(measurementType) || o.bodyweightKg) {
        const base = e1rmIsEstimateOnly(measurementType)
          ? e1rm("WEIGHT_REPS", { weight: (n(a.weight) || 0) + (o.bodyweightKg || 0), reps: n(a.reps) })
          : e1rm(measurementType, a);
        put("e1rm", base, e, { estimate: true, reps: n(a.reps), weight: n(a.weight) });
      }
    }
    if (kinds.includes("repsAtWeight") && n(a.weight)) {
      const key = "repsAtWeight";
      const prev = out[key];
      const w = n(a.weight), r = n(a.reps) || 0;
      if (!prev || w > prev.weight || (w === prev.weight && r > prev.value)) {
        out[key] = { k: key, value: r, weight: w, at: e.at, date: e.date, sessionId: e.sessionId, actual: a };
      }
    }
    if (kinds.includes("volume")) { const v = setVolume(measurementType, a); put("volume", v.value, e, { unit: v.kind }); }
    if (kinds.includes("bestReps")) put("bestReps", n(a.reps), e, { added: n(a.addedWeight) || 0 });
    if (kinds.includes("bestAdded")) {
      const added = n(a.addedWeight) != null ? n(a.addedWeight) : n(a.weight);
      if (added && added > 0) put("bestAdded", added, e, { reps: n(a.reps) });
    }
    if (kinds.includes("systemLoad") && o.bodyweightKg) put("systemLoad", (n(a.weight) || 0) + o.bodyweightKg, e, { estimate: true, reps: n(a.reps) });
    if (kinds.includes("lowestAssistance") && n(a.reps)) put("lowestAssistance", n(a.assistance), e, { reps: n(a.reps) });
    if (kinds.includes("repsAtAssistance") && n(a.assistance) != null) {
      const key = "repsAtAssistance";
      const prev = out[key];
      const as = n(a.assistance), r = n(a.reps) || 0;
      if (!prev || as < prev.assistance || (as === prev.assistance && r > prev.value)) {
        out[key] = { k: key, value: r, assistance: as, at: e.at, date: e.date, sessionId: e.sessionId, actual: a };
      }
    }
    if (kinds.includes("bestHold")) {
      // A prescribed submaximal hold does not become a record by lasting
      // longer. The template said "hold, do not push", and honouring that
      // is the achievement.
      if (!e.submax) put("bestHold", n(a.durationSec), e, {});
    }
    if (kinds.includes("longestDistance")) put("longestDistance", n(a.distanceM), e, { durationSec: n(a.durationSec) });
    if (kinds.includes("bestDuration")) put("bestDuration", n(a.durationSec), e, { distanceM: n(a.distanceM) });
    if (kinds.includes("fastestPace") && n(a.distanceM) && n(a.durationSec)) {
      // Only over a distance worth calling a distance — a twenty-metre
      // sprint would take the pace record off every honest run.
      if (n(a.distanceM) >= (o.minPaceDistanceM == null ? 400 : o.minPaceDistanceM)) {
        put("fastestPace", n(a.durationSec) / (n(a.distanceM) / 1000), e, { distanceM: n(a.distanceM), durationSec: n(a.durationSec) });
      }
    }
    if (kinds.includes("bestRounds")) put("bestRounds", n(a.rounds), e, {});
    if (kinds.includes("highest")) put("highest", n(a.height), e, { reps: n(a.reps) });
    if (kinds.includes("repsAtHeight") && n(a.height) != null) {
      const key = "repsAtHeight", prev = out[key];
      const h = n(a.height), r = n(a.reps) || 0;
      if (!prev || h > prev.height || (h === prev.height && r > prev.value)) {
        out[key] = { k: key, value: r, height: h, at: e.at, date: e.date, sessionId: e.sessionId, actual: a };
      }
    }
  }

  if (kinds.includes("totalReps")) {
    for (const [sid, list] of bySession) {
      const total = list.reduce((sum, e) => sum + (n(e.actual.reps) || 0), 0);
      const first = list[0];
      const prev = out.totalReps;
      if (total > 0 && (!prev || total > prev.value)) out.totalReps = { k: "totalReps", value: total, at: first.at, date: first.date, sessionId: sid };
    }
  }

  return out;
}

// The one-line form of a record, in the language asked for.
export function fmtRecord(measurementType, rec, cz) {
  if (!rec) return "";
  switch (rec.k) {
    case "heaviest": return fmtWeight(rec.value, cz) + (rec.reps ? " × " + rec.reps : "");
    case "e1rm": return fmtWeight(rec.value, cz) + (cz ? " · odhad" : " · estimate");
    case "repsAtWeight": return rec.value + "× " + (cz ? "na " : "at ") + fmtWeight(rec.weight, cz);
    case "volume": return Math.round(rec.value) + (rec.unit === "weightReps" ? " kg×" : "×");
    case "bestReps": return rec.value + "×" + (rec.added ? " · +" + fmtWeight(rec.added, cz) : "");
    case "totalReps": return rec.value + "×";
    case "bestAdded": return "+" + fmtWeight(rec.value, cz) + (rec.reps ? " × " + rec.reps : "");
    case "systemLoad": return fmtWeight(rec.value, cz) + (cz ? " · odhad" : " · estimate");
    case "lowestAssistance": return "−" + fmtWeight(rec.value, cz) + (rec.reps ? " × " + rec.reps : "");
    case "repsAtAssistance": return rec.value + "× " + (cz ? "s " : "with ") + "−" + fmtWeight(rec.assistance, cz);
    case "bestHold": return fmtDuration(rec.value, cz);
    case "longestDistance": return fmtDistance(rec.value, cz);
    case "bestDuration": return fmtDuration(rec.value, cz);
    case "fastestPace": {
      const mm = Math.floor(rec.value / 60), ss = Math.round(rec.value % 60);
      return mm + ":" + String(ss).padStart(2, "0") + " /km";
    }
    case "bestRounds": return rec.value + (cz ? " kol" : " rounds");
    case "highest": return rec.value + " cm" + (rec.reps ? " × " + rec.reps : "");
    case "repsAtHeight": return rec.value + "× " + (cz ? "na " : "at ") + rec.height + " cm";
    default: return String(rec.value);
  }
}

// ---- what is new today ------------------------------------------------
// Records set INSIDE one session, judged against everything before it.
// Returns one entry per exercise per record kind, with the previous value
// so the summary can say what it beat.
export function newRecordsIn(session, allSessions, opts) {
  const o = opts || {};
  const out = [];
  const before = (allSessions || []).filter((s) => s.id !== session.id);
  for (const entry of sessionEntries(session)) {
    const prior = historyOf(before, entry.exId, { who: session.who || "" });
    const priorRecs = recordsFor(entry.measurementType, prior, o);
    const withToday = historyOf([...before, { ...session, state: "done", endedAt: session.endedAt || Date.now() }], entry.exId, { who: session.who || "" });
    const nowRecs = recordsFor(entry.measurementType, withToday, o);
    for (const k of Object.keys(nowRecs)) {
      const now = nowRecs[k], was = priorRecs[k];
      if (now.sessionId !== session.id) continue;
      // A first-ever entry is not a personal best, it is a first entry.
      // Saying "record" to somebody's first push-up is flattery.
      if (!was) { out.push({ exId: entry.exId, name: entry.name, measurementType: entry.measurementType, k, rec: now, was: null, first: true }); continue; }
      const improved = k === "lowestAssistance" || k === "fastestPace" ? now.value < was.value : now.value > was.value;
      if (improved) out.push({ exId: entry.exId, name: entry.name, measurementType: entry.measurementType, k, rec: now, was, first: false });
    }
  }
  // One line per exercise is enough on a summary screen: the leading
  // record kind for that measurement type, and nothing else.
  const lead = { WEIGHT_REPS: "heaviest", ADDED_WEIGHT_REPS: "bestAdded", ASSISTED_REPS: "lowestAssistance", BODYWEIGHT_REPS: "bestReps", REPS_ONLY: "bestReps", DURATION: "bestHold", WEIGHT_DURATION: "heaviest", DISTANCE_DURATION: "longestDistance", DISTANCE: "longestDistance", ROUNDS: "bestRounds", HEIGHT_REPS: "highest" };
  return out.filter((r) => r.k === lead[r.measurementType] && !r.first).concat(out.filter((r) => r.k === lead[r.measurementType] && r.first));
}

// ---- the growth line -------------------------------------------------
// One point per session: the best working set of that day, scored by the
// leading field of the measurement type. No prediction, no trend line
// promising anything — a line through what happened.
export function seriesFor(measurementType, history) {
  const byDay = new Map();
  for (const e of history) {
    const key = e.date || String(e.at);
    const cur = byDay.get(key);
    if (!cur || compareSets(measurementType, e.actual, cur.actual) > 0) byDay.set(key, e);
  }
  const m = measurementOf(measurementType);
  return [...byDay.values()].sort((a, b) => a.at - b.at).map((e) => ({
    at: e.at, date: e.date,
    // Assistance counts down, so the plotted value is negated to keep the
    // line rising as the result improves. The axis label says which.
    value: m.better === "down" ? -(n(e.actual[m.lead]) || 0) : (n(e.actual[m.lead]) || 0),
    raw: n(e.actual[m.lead]),
    actual: e.actual,
  }));
}

export { fmtActual, fmtPace };
