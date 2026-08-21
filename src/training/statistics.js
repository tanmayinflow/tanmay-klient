// ======================================================================
// TRAINING STATISTICS · counts, not a verdict on a person
// ----------------------------------------------------------------------
// There is deliberately no single score here, no readiness number and no
// acute-to-chronic ratio. Those compress many different things into one
// number that then gets treated as a fact about somebody's body.
//
// Two words are used carefully and mean different things:
//   Pracovní série   a working set for the PRIMARY muscles of the exercise
//   Vedlejší zatížení  everything the exercise also loaded, counted apart
//
// A secondary muscle is NOT half a set. It is exposure, it is reported as
// exposure, and it is never added into the working-set count.
// ======================================================================

import { measurementOf, setVolume } from "./measurements.js";
import { blocksOf, setsOf, isWorkingSet, sessionTiming, countSets } from "./sessionModel.js";

const inRange = (iso, from, to) => (!from || iso >= from) && (!to || iso <= to);

// Every completed working set in the window, flattened once so each
// statistic below is a pass over one array rather than a nested walk.
export function collectSets(sessions, opts) {
  const o = opts || {};
  const who = o.who || "";
  const out = [];
  for (const ses of sessions || []) {
    if ((ses.who || "") !== who) continue;
    if (ses.state !== "done") continue;
    if (!inRange(ses.date || "", o.from, o.to)) continue;
    for (const b of blocksOf(ses)) {
      for (const s of setsOf(b)) {
        if (!s.completed) continue;
        out.push({ session: ses, block: b, set: s, working: isWorkingSet(s) });
      }
    }
  }
  return out;
}

export function summary(sessions, opts) {
  const o = opts || {};
  const done = (sessions || []).filter((s) => (s.who || "") === (o.who || "") && s.state === "done" && inRange(s.date || "", o.from, o.to));
  const rows = collectSets(sessions, opts);
  let plannedSets = 0, completedSets = 0, workingSets = 0, timeSec = 0, workSec = 0, restSec = 0;
  for (const s of done) {
    const c = countSets(s);
    plannedSets += (s.prescription && s.prescription.blocks ? s.prescription.blocks.reduce((a, b) => a + (b.sets || []).length, 0) : c.planned);
    completedSets += c.completed;
    const t = sessionTiming(s);
    timeSec += t.totalSec; workSec += t.workSec; restSec += t.restSec;
  }
  workingSets = rows.filter((r) => r.working).length;
  const efforts = done.map((s) => s.effort).filter((v) => v != null);
  return {
    sessions: done.length,
    plannedSets,
    completedSets,
    workingSets,
    skippedSets: Math.max(0, plannedSets - completedSets),
    // How much of what was prescribed actually happened. Never above 100:
    // doing extra is not adherence, it is extra.
    adherence: plannedSets ? Math.min(1, completedSets / plannedSets) : null,
    totalTimeSec: timeSec,
    workTimeSec: workSec,
    restTimeSec: restSec,
    avgEffort: efforts.length ? Math.round(efforts.reduce((a, b) => a + b, 0) / efforts.length) : null,
  };
}

// Weekly training time, keyed by ISO week start (Monday).
export function weeklyTime(sessions, opts) {
  const out = {};
  const o = opts || {};
  for (const s of sessions || []) {
    if ((s.who || "") !== (o.who || "") || s.state !== "done" || !s.date) continue;
    if (!inRange(s.date, o.from, o.to)) continue;
    const key = weekStart(s.date);
    const t = sessionTiming(s);
    out[key] = (out[key] || 0) + t.totalSec;
  }
  return out;
}

export function weekStart(iso) {
  const [y, m, d] = String(iso).split("-").map(Number);
  const dt = new Date(Date.UTC(y, (m || 1) - 1, d || 1));
  const dow = (dt.getUTCDay() + 6) % 7; // Monday = 0
  dt.setUTCDate(dt.getUTCDate() - dow);
  return dt.toISOString().slice(0, 10);
}

// How often each exercise was actually trained.
export function exerciseFrequency(sessions, opts) {
  const out = {};
  for (const r of collectSets(sessions, opts)) {
    if (!r.working) continue;
    const id = r.block.exId;
    if (!out[id]) out[id] = { exId: id, sessions: new Set(), sets: 0 };
    out[id].sessions.add(r.session.id);
    out[id].sets += 1;
  }
  return Object.values(out).map((x) => ({ exId: x.exId, sessions: x.sessions.size, sets: x.sets })).sort((a, b) => b.sets - a.sets);
}

// Volume per exercise, in the unit that exercise can honestly add up.
// Kilogram-reps, reps, seconds and metres are never summed together.
export function volumeByExercise(sessions, opts) {
  const out = {};
  for (const r of collectSets(sessions, opts)) {
    if (!r.working) continue;
    const v = setVolume(r.block.measurementType, r.set.actual);
    const id = r.block.exId;
    if (!out[id]) out[id] = { exId: id, name: r.block.name, byUnit: {} };
    out[id].byUnit[v.kind] = (out[id].byUnit[v.kind] || 0) + v.value;
  }
  return Object.values(out);
}

// Volume by movement pattern. `patternOf` is injected so this module
// never has to know the app's taxonomy.
export function volumeByPattern(sessions, patternOf, opts) {
  const out = {};
  for (const r of collectSets(sessions, opts)) {
    if (!r.working) continue;
    const p = patternOf ? patternOf(r.block.exId) : null;
    if (!p) continue;
    const v = setVolume(r.block.measurementType, r.set.actual);
    if (!out[p]) out[p] = { pattern: p, sets: 0, byUnit: {} };
    out[p].sets += 1;
    out[p].byUnit[v.kind] = (out[p].byUnit[v.kind] || 0) + v.value;
  }
  return Object.values(out).sort((a, b) => b.sets - a.sets);
}

// Working sets per PRIMARY muscle, and secondary exposure counted
// separately. `musclesOf(exId)` returns { primary: [], secondary: [] }.
export function muscleLoad(sessions, musclesOf, opts) {
  const working = {}, exposure = {};
  for (const r of collectSets(sessions, opts)) {
    if (!r.working) continue;
    const m = musclesOf ? musclesOf(r.block.exId) : null;
    if (!m) continue;
    for (const k of m.primary || []) working[k] = (working[k] || 0) + 1;
    for (const k of m.secondary || []) exposure[k] = (exposure[k] || 0) + 1;
  }
  const keys = [...new Set([...Object.keys(working), ...Object.keys(exposure)])];
  return keys.map((k) => ({ muscle: k, workingSets: working[k] || 0, exposureSets: exposure[k] || 0 }))
    .sort((a, b) => b.workingSets - a.workingSets || b.exposureSets - a.exposureSets);
}

// How the reported effort was actually distributed. RIR is a per-set
// number; this is what the person reported, not what a model inferred.
export function rirDistribution(sessions, opts) {
  const out = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, none: 0 };
  for (const r of collectSets(sessions, opts)) {
    if (!r.working) continue;
    const v = r.set.rir;
    if (v == null) out.none += 1;
    else out[Math.max(0, Math.min(5, Math.round(v)))] += 1;
  }
  return out;
}

// Sessions by the role of the work in them, so mobility, yoga and skill
// practice are visible instead of being averaged into "training".
export function practiceFrequency(sessions, roleOf, opts) {
  const out = {};
  const o = opts || {};
  for (const s of sessions || []) {
    if ((s.who || "") !== (o.who || "") || s.state !== "done") continue;
    if (!inRange(s.date || "", o.from, o.to)) continue;
    const seen = new Set();
    for (const b of blocksOf(s)) {
      const role = roleOf ? roleOf(b.exId) : null;
      if (!role || seen.has(role)) continue;
      seen.add(role);
      out[role] = (out[role] || 0) + 1;
    }
  }
  return out;
}

// Distance and time by activity. Kept apart from strength volume on
// purpose — they answer a different question.
export function activityTotals(sessions, isActivity, opts) {
  const out = {};
  for (const r of collectSets(sessions, opts)) {
    const id = r.block.exId;
    if (isActivity && !isActivity(id)) continue;
    if (!isActivity) continue;
    const a = r.set.actual || {};
    if (!out[id]) out[id] = { exId: id, name: r.block.name, sessions: new Set(), distanceM: 0, durationSec: 0 };
    out[id].sessions.add(r.session.id);
    out[id].distanceM += Number(a.distanceM) || 0;
    out[id].durationSec += Number(a.durationSec) || 0;
  }
  return Object.values(out).map((x) => ({ ...x, sessions: x.sessions.size }));
}

// When each personal best happened. A timeline, not a projection.
export function prTimeline(records) {
  return (records || []).slice().sort((a, b) => (a.rec ? a.rec.at : 0) - (b.rec ? b.rec.at : 0));
}

// Planned versus actual, per session, for the adherence view.
export function plannedVsActual(sessions, opts) {
  const o = opts || {};
  return (sessions || [])
    .filter((s) => (s.who || "") === (o.who || "") && s.state === "done" && inRange(s.date || "", o.from, o.to))
    .map((s) => {
      const c = countSets(s);
      const planned = s.prescription && s.prescription.blocks
        ? s.prescription.blocks.reduce((a, b) => a + (b.sets || []).length, 0)
        : c.planned;
      return { sessionId: s.id, date: s.date, planned, completed: c.completed, effort: s.effort };
    })
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}

export { measurementOf };
