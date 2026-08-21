// ======================================================================
// SESSION MODEL · five things that are not the same thing
// ----------------------------------------------------------------------
//   WORKOUT TEMPLATE     a repeatable structure
//   PLAN                 templates or specific sessions in time
//   SESSION PRESCRIPTION what was prescribed for one particular day
//   SESSION INSTANCE     what the person actually started
//   SET LOGS             what actually happened, one record per set
//
// The reason they are separate: when the library or the template changes
// later, a session that has already run must stay true. It does, because
// starting a session takes a SNAPSHOT of the prescription and never
// reads back through the template again.
//
// Every function here is pure. Nothing mutates its argument.
// ======================================================================

import { TRAINING_SCHEMA_VERSION, SET_TYPES, GROUP_MODES, SESSION_STATES, WORKING_SET_TYPES } from "./types.js";
import { measurementOf, normalizeActual, normalizePlanned, hasActual } from "./measurements.js";

let seq = 0;
// Ids only have to be unique inside one document. A counter plus a base-36
// stamp is enough and — unlike a random id — a test can predict it.
export function nextId(prefix) {
  seq += 1;
  return (prefix || "s") + "_" + seq.toString(36) + "_" + Math.floor(Date.now() / 1000).toString(36);
}
export function resetIdSeq(v) { seq = v || 0; }

const clone = (v) => (v == null ? v : JSON.parse(JSON.stringify(v)));
const pairOf = (v) => (Array.isArray(v) ? [v[0] || "", v[1] || ""] : ["", ""]);

// ---- a set -----------------------------------------------------------
export function makeSet(measurementType, o) {
  const opt = o || {};
  const type = SET_TYPES.includes(opt.type) ? opt.type : "work";
  return {
    id: opt.id || nextId("set"),
    type,
    planned: normalizePlanned(measurementType, opt.planned),
    actual: normalizeActual(measurementType, opt.actual),
    completed: !!opt.completed,
    completedAt: opt.completedAt || null,
    // null means "use the block's rest". A number here is a deliberate
    // override for this one set.
    restSec: opt.restSec == null ? null : Math.max(0, Number(opt.restSec) || 0),
    rir: opt.rir == null ? null : Number(opt.rir),
    rpe: opt.rpe == null ? null : Number(opt.rpe),
    note: opt.note || "",
    // "L" / "R" for a per-side exercise, otherwise null.
    side: opt.side || null,
  };
}

// ---- an exercise block inside a session ------------------------------
export function makeBlock(o) {
  const opt = o || {};
  const measurementType = opt.measurementType || "REPS_ONLY";
  return {
    id: opt.id || nextId("blk"),
    exId: opt.exId || "",
    // Denormalised at snapshot time. A session must still read correctly
    // when the exercise it used has since been renamed or archived.
    name: pairOf(opt.name),
    measurementType,
    restSec: opt.restSec == null ? 90 : Math.max(0, Number(opt.restSec) || 0),
    // Supersets and circuits. `groupId` is null for an ordinary block.
    groupId: opt.groupId || null,
    groupMode: GROUP_MODES.includes(opt.groupMode) ? opt.groupMode : null,
    groupOrder: opt.groupOrder == null ? 0 : Number(opt.groupOrder) || 0,
    // What the coach wrote for THIS session. The library copy stays general.
    coachNote: pairOf(opt.coachNote),
    // Never leaves the Main App and is never exported to a client.
    privateNote: pairOf(opt.privateNote),
    // Environment or grip variant that is not a card of its own.
    variant: opt.variant || null,
    // Whether this block asks for RIR at all. A mobility drill does not.
    rirEnabled: !!opt.rirEnabled,
    sets: Array.isArray(opt.sets) ? opt.sets.map((s) => makeSet(measurementType, s)) : [],
    focus: opt.focus ? pairOf(opt.focus) : null,
    note: opt.note || "",
  };
}

// ---- a workout template ----------------------------------------------
export function makeTemplate(o) {
  const opt = o || {};
  return {
    id: opt.id || nextId("tpl"),
    v: TRAINING_SCHEMA_VERSION,
    cz: opt.cz || "",
    en: opt.en || "",
    intro: pairOf(opt.intro),
    aims: Array.isArray(opt.aims) ? opt.aims.slice() : [],
    shelf: opt.shelf || "",
    blocks: Array.isArray(opt.blocks) ? opt.blocks.map(makeBlock) : [],
    createdAt: opt.createdAt || Date.now(),
  };
}

// ---- a plan ----------------------------------------------------------
export function makePlan(o) {
  const opt = o || {};
  return {
    id: opt.id || nextId("pln"),
    v: TRAINING_SCHEMA_VERSION,
    cz: opt.cz || "",
    en: opt.en || "",
    intro: pairOf(opt.intro),
    goals: Array.isArray(opt.goals) ? opt.goals.slice() : [],
    // "" is the coach's own plan. Anything else is a client key.
    client: opt.client || "",
    clientName: opt.clientName || "",
    weeks: opt.weeks == null ? null : Number(opt.weeks) || null,
    // Which progression rule set applies. A suggestion engine, never an
    // automatic edit of somebody's plan.
    progressionRule: opt.progressionRule || "double",
    pathId: opt.pathId || null,
    why: opt.why || null,
    coachReview: opt.coachReview || null,
    sessions: Array.isArray(opt.sessions) ? opt.sessions.map(makePlanSession) : [],
    createdAt: opt.createdAt || Date.now(),
  };
}

export function makePlanSession(o) {
  const opt = o || {};
  return {
    id: opt.id || nextId("psn"),
    w: opt.w == null ? null : Number(opt.w) || null,
    templateId: opt.templateId || opt.wid || "",
    date: opt.date || "",
    effortTarget: opt.effortTarget == null ? 100 : Number(opt.effortTarget) || 100,
    done: !!opt.done,
    // Filled when a session instance is created from this row, so a plan row
    // and the record it produced point at each other exactly once.
    sessionId: opt.sessionId || null,
  };
}

// ---- the prescription snapshot ---------------------------------------
// Taken once, when a session starts. From that moment the session no
// longer reads the template: the template may be edited, the exercise may
// be archived, the library may be re-audited, and the session still says
// what it said on the day.
export function prescriptionFrom(template, plan, planSession) {
  return {
    at: Date.now(),
    templateId: template ? template.id : null,
    templateName: template ? [template.cz || "", template.en || ""] : ["", ""],
    planId: plan ? plan.id : null,
    planSessionId: planSession ? planSession.id : null,
    effortTarget: planSession ? planSession.effortTarget : null,
    blocks: template ? clone(template.blocks) : [],
  };
}

// ---- a session instance ----------------------------------------------
export function makeSession(o) {
  const opt = o || {};
  const state = SESSION_STATES.includes(opt.state) ? opt.state : "planned";
  return {
    id: opt.id || nextId("ses"),
    v: TRAINING_SCHEMA_VERSION,
    date: opt.date || "",
    // What kind of day this is, in the language the log already speaks:
    // a workout, a mobility session, or a rest day somebody wrote down.
    kind: opt.kind || "trenink",
    // Where this sits among the other sessions of the same day. Days can hold
    // more than one thing, and the order is the person's, not the clock's.
    ord: opt.ord == null ? 0 : Number(opt.ord) || 0,
    state,
    startedAt: opt.startedAt || null,
    endedAt: opt.endedAt || null,
    planId: opt.planId || null,
    planSessionId: opt.planSessionId || null,
    templateId: opt.templateId || null,
    cz: opt.cz || "",
    en: opt.en || "",
    prescription: opt.prescription || null,
    blocks: Array.isArray(opt.blocks) ? opt.blocks.map(makeBlock) : [],
    effort: opt.effort == null ? null : Number(opt.effort) || null,
    note: opt.note || "",
    painJoints: Array.isArray(opt.painJoints) ? opt.painJoints.slice() : [],
    // Whose record this is. "" is the owner; a client id namespaces it.
    who: opt.who || "",
    // Set by the client app's outbox once the server has acknowledged it.
    syncedAt: opt.syncedAt || null,
  };
}

// Start a session FROM a template. The blocks are copied out of the
// snapshot, so editing the template afterwards cannot reach back in.
export function startSession(template, opts) {
  const o = opts || {};
  const rx = prescriptionFrom(template, o.plan, o.planSession);
  return makeSession({
    id: o.id,
    date: o.date || "",
    kind: o.kind || "trenink",
    state: o.state || "running",
    startedAt: o.now || Date.now(),
    planId: o.plan ? o.plan.id : null,
    planSessionId: o.planSession ? o.planSession.id : null,
    templateId: template ? template.id : null,
    cz: template ? template.cz : "",
    en: template ? template.en : "",
    prescription: rx,
    who: o.who || "",
    blocks: clone(rx.blocks).map((b) => makeBlock({
      ...b,
      id: undefined,
      // Planned values stay; actual values start empty, uncompleted.
      sets: (b.sets || []).map((s) => ({ ...s, id: undefined, actual: {}, completed: false, completedAt: null })),
    })),
  });
}

// ---- reading a session -----------------------------------------------
export const blocksOf = (session) => (session && Array.isArray(session.blocks) ? session.blocks : []);
export const setsOf = (block) => (block && Array.isArray(block.sets) ? block.sets : []);
export const isWorkingSet = (s) => !!s && WORKING_SET_TYPES.includes(s.type);

export function countSets(session) {
  let planned = 0, completed = 0, working = 0, workingDone = 0;
  for (const b of blocksOf(session)) {
    for (const s of setsOf(b)) {
      planned += 1;
      if (s.completed) completed += 1;
      if (isWorkingSet(s)) {
        working += 1;
        if (s.completed) workingDone += 1;
      }
    }
  }
  return { planned, completed, working, workingDone, skipped: planned - completed };
}

// A session is finishable when something real is in it. A tick with no
// numbers behind it is not a session.
export function sessionHasContent(session) {
  for (const b of blocksOf(session)) {
    for (const s of setsOf(b)) {
      if (s.completed && hasActual(b.measurementType, s.actual)) return true;
    }
  }
  return false;
}

// Total time and working time, in seconds. Rest is what is left.
export function sessionTiming(session) {
  const start = session && session.startedAt, end = session && session.endedAt;
  const total = start && end ? Math.max(0, Math.round((end - start) / 1000)) : 0;
  let rest = 0, work = 0;
  for (const b of blocksOf(session)) {
    for (const s of setsOf(b)) {
      if (!s.completed) continue;
      rest += s.restSec == null ? b.restSec : s.restSec;
      const m = measurementOf(b.measurementType);
      if (m.volume === "time" || m.volume === "distance") work += Number(s.actual.durationSec) || 0;
      else work += Math.max(20, (Number(s.actual.reps) || 8) * 3);
    }
  }
  return { totalSec: total, workSec: Math.round(work), restSec: Math.round(rest) };
}

export { TRAINING_SCHEMA_VERSION };
