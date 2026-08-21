// ======================================================================
// SESSION ENGINE · every operation a running session needs
// ----------------------------------------------------------------------
// Pure functions over a session object. Each returns a NEW session; none
// mutates. That is what makes a set-by-set log testable without a browser
// and what makes undo possible without a second history system.
// ======================================================================

import { WORKING_SET_TYPES, SET_TYPES, GROUP_MODES } from "./types.js";
import { normalizeActual, normalizePlanned, hasActual, compareSets, measurementOf } from "./measurements.js";
import { makeSet, blocksOf, setsOf, isWorkingSet } from "./sessionModel.js";

const mapBlocks = (session, fn) => ({ ...session, blocks: blocksOf(session).map(fn) });
const withBlock = (session, blockId, fn) =>
  mapBlocks(session, (b) => (b.id === blockId ? fn(b) : b));
const withSet = (session, blockId, setId, fn) =>
  withBlock(session, blockId, (b) => ({ ...b, sets: setsOf(b).map((s) => (s.id === setId ? fn(s, b) : s)) }));

export const findBlock = (session, blockId) => blocksOf(session).find((b) => b.id === blockId) || null;
export const findSet = (session, blockId, setId) => {
  const b = findBlock(session, blockId);
  return b ? setsOf(b).find((s) => s.id === setId) || null : null;
};

// ---- adding and removing sets ----------------------------------------
// A new set copies the previous one's PLAN, never its result. Repeating a
// prescription is a decision; repeating a result is a lie waiting to be
// written down.
export function addSet(session, blockId, opts) {
  return withBlock(session, blockId, (b) => {
    const last = setsOf(b).filter((s) => (opts && opts.type ? s.type === opts.type : s.type === "work")).slice(-1)[0]
      || setsOf(b).slice(-1)[0];
    const s = makeSet(b.measurementType, {
      type: (opts && opts.type) || (last ? last.type : "work"),
      planned: (opts && opts.planned) || (last ? last.planned : {}),
      restSec: opts && opts.restSec != null ? opts.restSec : null,
      side: (opts && opts.side) || (last ? last.side : null),
      id: opts && opts.id,
    });
    return { ...b, sets: [...setsOf(b), s] };
  });
}

export function removeSet(session, blockId, setId) {
  return withBlock(session, blockId, (b) => ({ ...b, sets: setsOf(b).filter((s) => s.id !== setId) }));
}

export function moveSet(session, blockId, setId, delta) {
  return withBlock(session, blockId, (b) => {
    const list = setsOf(b).slice();
    const i = list.findIndex((s) => s.id === setId);
    if (i < 0) return b;
    const j = Math.max(0, Math.min(list.length - 1, i + delta));
    if (i === j) return b;
    const [x] = list.splice(i, 1);
    list.splice(j, 0, x);
    return { ...b, sets: list };
  });
}

export function setSetType(session, blockId, setId, type) {
  if (!SET_TYPES.includes(type)) return session;
  return withSet(session, blockId, setId, (s) => ({ ...s, type }));
}

export function setSetNote(session, blockId, setId, note) {
  return withSet(session, blockId, setId, (s) => ({ ...s, note: String(note || "") }));
}

// ---- writing values --------------------------------------------------
export function setActual(session, blockId, setId, patch) {
  return withSet(session, blockId, setId, (s, b) => ({
    ...s,
    actual: normalizeActual(b.measurementType, { ...s.actual, ...patch }),
  }));
}

export function setPlanned(session, blockId, setId, patch) {
  return withSet(session, blockId, setId, (s, b) => ({
    ...s,
    planned: normalizePlanned(b.measurementType, { ...s.planned, ...patch }),
  }));
}

export function setRir(session, blockId, setId, rir) {
  const v = rir == null || rir === "" ? null : Math.max(0, Math.min(5, Number(rir) || 0));
  return withSet(session, blockId, setId, (s) => ({ ...s, rir: v }));
}

export function setRpe(session, blockId, setId, rpe) {
  const v = rpe == null || rpe === "" ? null : Math.max(1, Math.min(10, Number(rpe) || 0));
  return withSet(session, blockId, setId, (s) => ({ ...s, rpe: v }));
}

// ---- completing ------------------------------------------------------
// Completing a set with nothing written in it falls back to the plan, so
// "I did exactly what it said" is one tap and is still recorded as real
// numbers rather than as an empty tick.
export function completeSet(session, blockId, setId, now) {
  return withSet(session, blockId, setId, (s, b) => {
    const actual = hasActual(b.measurementType, s.actual)
      ? s.actual
      : normalizeActual(b.measurementType, plannedToActual(b.measurementType, s.planned));
    return { ...s, actual, completed: true, completedAt: now || Date.now() };
  });
}

export function reopenSet(session, blockId, setId) {
  return withSet(session, blockId, setId, (s) => ({ ...s, completed: false, completedAt: null }));
}

// The plan, read as if it had been performed exactly. A range collapses
// to its lower bound: the bottom of the range is what was promised.
export function plannedToActual(measurementType, planned) {
  const p = planned || {};
  const reps = p.targetReps != null ? p.targetReps : p.targetRepsMin != null ? p.targetRepsMin : null;
  return {
    weight: p.targetWeight,
    reps,
    durationSec: p.targetDurationSec,
    distanceM: p.targetDistanceM,
    assistance: p.targetAssistance,
    height: p.targetHeight,
    rounds: p.targetRounds,
  };
}

// ---- previous values -------------------------------------------------
// "Naposledy" is the last time this exercise id was used, anywhere.
// "V tomto tréninku naposledy" is the last time it was used in THIS
// template. They are different questions and the UI must not blur them,
// so they are two functions with two names.
export function lastUseOf(sessions, exId, opts) {
  const o = opts || {};
  const who = o.who || "";
  let best = null;
  for (const ses of sessions || []) {
    if ((ses.who || "") !== who) continue;
    if (o.exceptSessionId && ses.id === o.exceptSessionId) continue;
    if (o.templateId && ses.templateId !== o.templateId) continue;
    if (ses.state !== "done" && ses.id !== o.includeRunningId) continue;
    for (const b of blocksOf(ses)) {
      if (b.exId !== exId) continue;
      const done = setsOf(b).filter((s) => s.completed && isWorkingSet(s));
      if (!done.length) continue;
      const at = ses.endedAt || ses.startedAt || 0;
      if (!best || at > best.at) best = { at, date: ses.date, sessionId: ses.id, measurementType: b.measurementType, sets: done };
    }
  }
  return best;
}

export const lastUseInTemplate = (sessions, exId, templateId, opts) =>
  lastUseOf(sessions, exId, { ...(opts || {}), templateId });

// One tap: "Použít minule". It fills the PLAN or the ACTUAL depending on
// where the person is, and it never marks anything as done — a value that
// arrived by copying still has to be confirmed by a human.
export function copyPrevious(session, blockId, previous, target) {
  if (!previous || !previous.sets || !previous.sets.length) return session;
  return withBlock(session, blockId, (b) => {
    const src = previous.sets;
    return {
      ...b,
      sets: setsOf(b).map((s, i) => {
        if (s.completed) return s;
        const from = src[Math.min(i, src.length - 1)];
        if (!from) return s;
        if (target === "planned") {
          return { ...s, planned: normalizePlanned(b.measurementType, actualToPlanned(from.actual)) };
        }
        return { ...s, actual: normalizeActual(b.measurementType, from.actual) };
      }),
    };
  });
}

export function actualToPlanned(actual) {
  const a = actual || {};
  return {
    targetWeight: a.weight,
    targetReps: a.reps,
    targetDurationSec: a.durationSec,
    targetDistanceM: a.distanceM,
    targetAssistance: a.assistance,
    targetHeight: a.height,
    targetRounds: a.rounds,
  };
}

// ---- rest ------------------------------------------------------------
// Which rest follows a set, and whether one follows at all.
//
//   work      · the block's rest, unless the set overrides it
//   warmup    · shorter, because a warm-up set is not a working set
//   drop      · NO rest while the drop cluster is still running — that
//               is the whole point of a drop set
//   last set  · the transition, taken from the NEXT block, because what
//               you are about to do decides how long you need
//
// Returns { sec, reason } so the interface can say why the clock says
// what it says.
export function restAfterSet(session, blockId, setId, opts) {
  const o = opts || {};
  const b = findBlock(session, blockId);
  if (!b) return { sec: 0, reason: "none" };
  const list = setsOf(b);
  const i = list.findIndex((s) => s.id === setId);
  if (i < 0) return { sec: 0, reason: "none" };
  const s = list[i];
  const next = list[i + 1] || null;

  // A drop set runs straight into the next drop. No clock in between.
  if (s.type === "drop" && next && next.type === "drop") return { sec: 0, reason: "drop-cluster" };
  if (s.type === "drop" && !next) {
    // The end of a drop cluster still earns the block's rest.
    return { sec: blockRest(b, s), reason: "drop-end" };
  }

  if (s.type === "warmup") {
    const base = s.restSec != null ? s.restSec : Math.round(blockRest(b, s) * 0.4);
    return { sec: Math.max(15, base), reason: "warmup" };
  }

  // Inside a superset or a circuit the clock waits for the end of the
  // round, not for the end of each exercise.
  if (b.groupId && next == null) {
    const group = blocksOf(session).filter((x) => x.groupId === b.groupId).sort((x, y) => x.groupOrder - y.groupOrder);
    const pos = group.findIndex((x) => x.id === b.id);
    if (pos >= 0 && pos < group.length - 1) return { sec: 0, reason: "group-transition" };
  }
  if (b.groupId && next != null) {
    const group = blocksOf(session).filter((x) => x.groupId === b.groupId);
    if (group.length > 1) return { sec: 0, reason: "group-transition" };
  }

  if (next) return { sec: blockRest(b, s), reason: "set" };

  // Last set of the block: the transition belongs to what comes next.
  const order = blocksOf(session);
  const bi = order.findIndex((x) => x.id === b.id);
  const following = order[bi + 1];
  if (!following) return { sec: 0, reason: "session-end" };
  if (o.transition === false) return { sec: blockRest(b, s), reason: "set" };
  return { sec: Math.max(30, Math.round(following.restSec * 0.6)), reason: "transition" };
}

export const blockRest = (b, s) => (s && s.restSec != null ? s.restSec : b.restSec || 0);

// ---- groups ----------------------------------------------------------
// Making and dissolving a superset. A group is a relationship between
// blocks; the set logs stay exactly where they are, on their own exercise.
export function groupBlocks(session, blockIds, mode, groupId) {
  if (!GROUP_MODES.includes(mode)) return session;
  const ids = (blockIds || []).filter(Boolean);
  if (ids.length < 2) return session;
  const gid = groupId || ("grp_" + ids[0]);
  let order = 0;
  return mapBlocks(session, (b) => (ids.includes(b.id) ? { ...b, groupId: gid, groupMode: mode, groupOrder: order++ } : b));
}

export function ungroupBlocks(session, groupId) {
  return mapBlocks(session, (b) => (b.groupId === groupId ? { ...b, groupId: null, groupMode: null, groupOrder: 0 } : b));
}

// A1 / A2 / B1 — readable labels for a grouped session, and a plain
// number for everything else.
export function blockLabels(session) {
  const out = {};
  const seenGroups = [];
  let plain = 0;
  for (const b of blocksOf(session)) {
    if (!b.groupId) { plain += 1; out[b.id] = String(plain); continue; }
    let gi = seenGroups.indexOf(b.groupId);
    if (gi < 0) { seenGroups.push(b.groupId); gi = seenGroups.length - 1; plain += 1; }
    const letter = String.fromCharCode(65 + gi);
    const within = blocksOf(session).filter((x) => x.groupId === b.groupId).sort((x, y) => x.groupOrder - y.groupOrder).findIndex((x) => x.id === b.id);
    out[b.id] = letter + (within + 1);
  }
  return out;
}

// The order a grouped session is actually performed in: A1, A2, A1, A2…
export function groupRunOrder(session) {
  const out = [];
  const handled = new Set();
  for (const b of blocksOf(session)) {
    if (handled.has(b.id)) continue;
    if (!b.groupId) { out.push({ blockId: b.id, setIndex: null }); handled.add(b.id); continue; }
    const group = blocksOf(session).filter((x) => x.groupId === b.groupId).sort((x, y) => x.groupOrder - y.groupOrder);
    const rounds = Math.max(...group.map((x) => setsOf(x).length), 0);
    for (let r = 0; r < rounds; r++) {
      for (const g of group) {
        if (setsOf(g)[r]) out.push({ blockId: g.id, setIndex: r });
      }
    }
    group.forEach((g) => handled.add(g.id));
  }
  return out;
}

// ---- finishing -------------------------------------------------------
export function finishSession(session, o) {
  const opt = o || {};
  return {
    ...session,
    state: "done",
    endedAt: opt.now || Date.now(),
    effort: opt.effort == null ? session.effort : Number(opt.effort) || null,
    note: opt.note == null ? session.note : String(opt.note),
    painJoints: Array.isArray(opt.painJoints) ? opt.painJoints.slice() : session.painJoints,
  };
}

export function abandonSession(session, now) {
  return { ...session, state: "abandoned", endedAt: now || Date.now() };
}

// ---- adding and removing whole blocks --------------------------------
export function addBlock(session, block, atIndex) {
  const list = blocksOf(session).slice();
  const i = atIndex == null ? list.length : Math.max(0, Math.min(list.length, atIndex));
  list.splice(i, 0, block);
  return { ...session, blocks: list };
}

export function removeBlock(session, blockId) {
  return { ...session, blocks: blocksOf(session).filter((b) => b.id !== blockId) };
}

export function moveBlock(session, blockId, delta) {
  const list = blocksOf(session).slice();
  const i = list.findIndex((b) => b.id === blockId);
  if (i < 0) return session;
  const j = Math.max(0, Math.min(list.length - 1, i + delta));
  if (i === j) return session;
  const [x] = list.splice(i, 1);
  list.splice(j, 0, x);
  return { ...session, blocks: list };
}

// ---- the best set of a block ----------------------------------------
export function bestSetOf(block) {
  let best = null;
  for (const s of setsOf(block)) {
    if (!s.completed || !isWorkingSet(s)) continue;
    if (!best || compareSets(block.measurementType, s.actual, best.actual) > 0) best = s;
  }
  return best;
}

export { WORKING_SET_TYPES, measurementOf };
