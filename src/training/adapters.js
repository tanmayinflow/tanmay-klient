// ======================================================================
// ADAPTERS · the old shape, read once, on the way in
// ----------------------------------------------------------------------
// The content packs — Anatoly's method, Submax, Cali Move, Vital Institut,
// the asana planner and the plan generator — all describe a workout in
// the shape the app used before V2: a flat row with `sets`, `reps` and a
// `unit`. Rewriting six generators to emit set records would have been six
// chances to change what they prescribe.
//
// So the generators keep speaking their own language and this module
// translates, ONCE, at the point where something is stored. Nothing here
// runs at render time and nothing reads it back the other way: after the
// translation the V2 record is the only truth.
// ======================================================================

import { makeTemplate, makeBlock, makeSet, makePlan, makePlanSession } from "./sessionModel.js";
import { normalizePlanned } from "./measurements.js";

const num = (v) => (v == null || v === "" ? null : Number(v));
const pair = (v) => (Array.isArray(v) ? [v[0] || "", v[1] || ""] : typeof v === "string" && v ? [v, v] : ["", ""]);

// One legacy row → the planned values for one set, in the vocabulary of
// whatever measurement type the exercise actually has.
export function plannedFromLegacyRow(row, measurementType) {
  const r = row || {};
  const reps = num(r.reps);
  const kg = num(r.kg);
  const out = {};
  switch (measurementType) {
    case "DURATION":
    case "WEIGHT_DURATION":
      out.targetDurationSec = r.unit === "m" ? (reps || 0) * 60 : reps || 30;
      if (kg) out.targetWeight = kg;
      break;
    case "DISTANCE_DURATION":
    case "DISTANCE":
      // A legacy row never carried a distance. Seconds are what it knew,
      // and inventing a distance here would be inventing data.
      out.targetDurationSec = r.unit === "m" ? (reps || 0) * 60 : reps || 600;
      break;
    case "ROUNDS":
      out.targetRounds = reps || 3;
      break;
    case "HEIGHT_REPS":
      out.targetReps = reps || 5;
      break;
    case "ASSISTED_REPS":
      out.targetReps = reps || 8;
      if (kg) out.targetAssistance = kg;
      break;
    case "ADDED_WEIGHT_REPS":
    case "WEIGHT_REPS":
      out.targetReps = reps || 8;
      if (kg) out.targetWeight = kg;
      break;
    default:
      out.targetReps = reps || 8;
      break;
  }
  if (r.rir != null) out.targetRir = Number(r.rir);
  return normalizePlanned(measurementType, out);
}

export function templateFromLegacyWorkout(wo, resolve, opts) {
  const o = opts || {};
  const blocks = [];
  for (const row of (wo && wo.rows) || []) {
    const rec = resolve ? resolve(row.ex) : null;
    if (!rec) continue;
    const mt = rec.measurementType;
    const planned = plannedFromLegacyRow(row, mt);
    const count = Math.max(1, Math.min(20, Number(row.sets) || 1));
    const sets = [];
    for (let i = 0; i < count; i++) sets.push(makeSet(mt, { type: "work", planned }));
    blocks.push(makeBlock({
      exId: row.ex,
      name: [rec.displayCz, rec.displayEn],
      measurementType: mt,
      restSec: row.rest == null ? rec.defaultRestSec : Number(row.rest) || 0,
      coachNote: pair(row.note),
      focus: rec.focus,
      // A legacy row asked for RIR only where it said so.
      rirEnabled: row.rir != null,
      sets,
    }));
  }
  return makeTemplate({
    id: o.id,
    cz: (wo && wo.cz) || "",
    en: (wo && wo.en) || "",
    intro: pair(wo && wo.int),
    aims: (wo && wo.aims) || [],
    shelf: (wo && wo.ser) || o.shelf || "",
    blocks,
  });
}

// The plan keeps its sessions; only the pointer changes, from a workout id
// to a template id.
export function planFromLegacyPlan(pl, widToTemplateId, opts) {
  const o = opts || {};
  const map = widToTemplateId || {};
  return makePlan({
    id: o.id,
    cz: (pl && pl.cz) || "",
    en: (pl && pl.en) || "",
    intro: pair(pl && pl.int),
    goals: (pl && pl.goals) || [],
    client: (pl && pl.client) || "",
    clientName: (pl && pl.clientName) || "",
    weeks: pl && pl.weeks,
    why: (pl && pl.why) || null,
    coachReview: (pl && pl.coachReview) || null,
    sessions: ((pl && pl.sessions) || []).map((s) => makePlanSession({
      w: s.w,
      templateId: map[s.wid] || s.wid || "",
      date: s.date || "",
      effortTarget: s.eff === "" || s.eff == null ? 100 : Number(s.eff) || 100,
      done: !!s.done,
    })),
  });
}

// A whole generator result — workouts plus the plan that points at them —
// translated in one call so the ids line up.
export function adoptLegacyDraft(draft, resolve, opts) {
  const o = opts || {};
  const templates = [];
  const map = {};
  for (const wo of (draft && draft.workouts) || []) {
    const t = templateFromLegacyWorkout(wo, resolve, { shelf: o.shelf });
    map[wo.id] = t.id;
    templates.push(t);
  }
  const plan = draft && draft.plan ? planFromLegacyPlan(draft.plan, map, o) : null;
  return { templates, plan, map };
}

// ---- the client bundle ------------------------------------------------
// What a client actually receives. Self-contained on purpose: the client
// has no library of its own to look anything up in, and it must never
// need one. Private coach notes are removed here, not filtered later.
export function clientBundle(plans, templates, resolve, opts) {
  const o = opts || {};
  const usedTemplates = new Map();
  const usedExercises = new Map();
  const outPlans = [];
  for (const p of plans || []) {
    outPlans.push({
      id: p.id, cz: p.cz, en: p.en, goals: p.goals || [], intro: p.intro || null,
      progressionRule: p.progressionRule || null,
      sessions: (p.sessions || []).map((s) => ({
        id: s.id, w: s.w, templateId: s.templateId, effortTarget: s.effortTarget,
        // What the client has done comes back the other way. Sending it
        // out again would let a stale copy overwrite their own record.
        date: s.date || "",
      })),
    });
    for (const s of p.sessions || []) {
      const t = (templates || []).find((x) => x.id === s.templateId);
      if (t) usedTemplates.set(t.id, t);
    }
  }
  const outTemplates = [];
  for (const t of usedTemplates.values()) {
    outTemplates.push({
      id: t.id, cz: t.cz, en: t.en, intro: t.intro || null, aims: t.aims || [],
      blocks: (t.blocks || []).map((b) => {
        const rec = resolve ? resolve(b.exId) : null;
        if (rec) usedExercises.set(b.exId, rec);
        return {
          id: b.id, exId: b.exId, name: b.name, measurementType: b.measurementType,
          restSec: b.restSec, groupId: b.groupId, groupMode: b.groupMode, groupOrder: b.groupOrder,
          rirEnabled: b.rirEnabled, variant: b.variant || null,
          // The coach note travels. The private note never does.
          coachNote: b.coachNote || ["", ""],
          sets: (b.sets || []).map((s) => ({ id: s.id, type: s.type, planned: s.planned, restSec: s.restSec, side: s.side })),
        };
      }),
    });
  }
  const outExercises = [];
  for (const rec of usedExercises.values()) {
    outExercises.push({
      id: rec.id, cz: rec.displayCz, en: rec.displayEn,
      pat: (rec.movementPatterns || [])[0] || "", eq: rec.equipment,
      measurementType: rec.measurementType, defaultRestSec: rec.defaultRestSec,
      unilateral: rec.unilateral, sideMode: rec.sideMode,
      focus: rec.focus, startPosition: rec.startPosition, execution: rec.execution, watchFor: rec.watchFor,
      // The progression copy is the coach's teaching material and only
      // travels when the coach says so.
      progression: o.pro ? rec.progression : null,
      art: (o.artFor && o.artFor(rec.id)) || null,
    });
  }
  return { at: o.now || Date.now(), v: 2, plans: outPlans, templates: outTemplates, exercises: outExercises };
}

// ---- the return channel ----------------------------------------------
// What the client sends back: their own session records, namespaced to
// them, and nothing else. Idempotent by session id, so a retry after a
// dropped connection cannot produce a second record of the same session.
export function fulfilmentFrom(sessions, opts) {
  const o = opts || {};
  return {
    v: 2,
    at: o.now || Date.now(),
    sessions: (sessions || [])
      .filter((s) => s.state === "done")
      .map((s) => ({
        id: s.id, date: s.date, planId: s.planId, planSessionId: s.planSessionId, templateId: s.templateId,
        startedAt: s.startedAt, endedAt: s.endedAt, effort: s.effort, note: s.note,
        blocks: (s.blocks || []).map((b) => ({
          id: b.id, exId: b.exId, measurementType: b.measurementType,
          sets: (b.sets || []).map((x) => ({ id: x.id, type: x.type, planned: x.planned, actual: x.actual, completed: x.completed, completedAt: x.completedAt, rir: x.rir, note: x.note, side: x.side })),
        })),
      })),
  };
}

// Merge a fulfilment into a coach-side session list. Same id wins by
// being newer, never by arriving twice.
export function mergeFulfilment(existing, fulfilment, who) {
  const byId = new Map((existing || []).map((s) => [s.id, s]));
  for (const s of (fulfilment && fulfilment.sessions) || []) {
    const cur = byId.get(s.id);
    const next = { ...s, who: who || "", state: "done", v: 2 };
    if (!cur || (next.endedAt || 0) >= (cur.endedAt || 0)) byId.set(s.id, next);
  }
  return [...byId.values()];
}
