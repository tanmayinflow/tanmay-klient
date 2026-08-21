// ======================================================================
// GENERATOR RULES · what may be chosen, and what may never be
// ----------------------------------------------------------------------
// The plan generator itself lives with the rest of the coaching doctrine.
// What lives HERE is the gate: the predicates that decide what a generated
// plan is allowed to contain. They are pure, they are named after what
// they refuse, and every one of them is asserted by a test — because the
// cost of getting this wrong is that somebody is handed an archived
// exercise, a catalogue entry, or a movement that needs a coach in the
// room.
// ======================================================================

import { GENERIC_ROLES } from "./types.js";
import { measurementOf } from "./measurements.js";

// ---- the gate --------------------------------------------------------
// Read this as a list of refusals. A generic plan may draw from CORE and
// EXTENDED and nothing else without being told to.
export function selectableFor(rec, ctx) {
  const c = ctx || {};
  if (!rec) return { ok: false, why: "no-record" };
  if (rec.status !== "active") return { ok: false, why: "not-active" };

  switch (rec.role) {
    case "CORE":
    case "EXTENDED":
      break;
    case "SPECIALIST":
      // Only on an explicit skill target, at a matching level, with the
      // equipment, and honouring requiresCoach.
      if (!c.explicitTarget) return { ok: false, why: "specialist-needs-target" };
      if (c.level != null && rec.strengthDemand > (c.levelCeiling || 5)) return { ok: false, why: "specialist-above-level" };
      break;
    case "PROGRAM_ONLY":
      // Inside its own programme, never on the general shelf.
      if (!c.programId || !(rec.sourcePrograms || []).includes(c.programId)) return { ok: false, why: "program-only" };
      break;
    case "ACTIVITY":
      // Only when conditioning or a named activity was actually asked for.
      if (!c.allowActivity) return { ok: false, why: "activity-not-requested" };
      break;
    case "YOGA":
      if (!c.allowYoga) return { ok: false, why: "yoga-planner-owns-it" };
      break;
    case "BREATH":
      if (!c.allowBreath) return { ok: false, why: "breath-opt-in" };
      break;
    case "CATALOG":
      return { ok: false, why: "catalog-never" };
    case "ARCHIVE":
      return { ok: false, why: "archive-never" };
    case "ALIAS":
      return { ok: false, why: "alias-never" };
    default:
      return { ok: false, why: "unknown-role" };
  }

  if (rec.requiresCoach && !c.coachPresent) return { ok: false, why: "requires-coach" };
  if (c.equipment && rec.equipment.length && !rec.equipment.every((k) => c.equipment.includes(k))) return { ok: false, why: "equipment" };
  if (c.sessionRole && rec.sessionRole !== c.sessionRole) return { ok: false, why: "session-role" };
  if (c.measurementTypes && !c.measurementTypes.includes(rec.measurementType)) return { ok: false, why: "measurement-type" };
  if (c.excludeIds && c.excludeIds.includes(rec.id)) return { ok: false, why: "already-chosen" };
  // Two rows out of one family give the same stimulus in one session.
  // Three curls are not variety.
  if (c.excludeFamilies && c.excludeFamilies.includes(rec.familyId)) return { ok: false, why: "family-redundant" };
  if (c.excludeCanon && c.excludeCanon.includes(rec.aliasOf || rec.id)) return { ok: false, why: "same-canonical" };
  return { ok: true, why: "ok" };
}

export const isSelectable = (rec, ctx) => selectableFor(rec, ctx).ok;

// Filter a list once and keep the reasons, so a "why not" answer never
// has to be guessed afterwards.
export function partition(records, ctx) {
  const ok = [], rejected = [];
  for (const r of records || []) {
    const v = selectableFor(r, ctx);
    if (v.ok) ok.push(r); else rejected.push({ id: r ? r.id : null, why: v.why });
  }
  return { ok, rejected };
}

// ---- balance ---------------------------------------------------------
// After selection, a few things a plan should not do. Each returns a
// list of complaints rather than throwing, so a caller can decide.
export function reviewSelection(records, opts) {
  const o = opts || {};
  const out = [];
  const byFamily = {};
  for (const r of records || []) {
    byFamily[r.familyId] = (byFamily[r.familyId] || 0) + 1;
  }
  for (const f of Object.keys(byFamily)) {
    if (byFamily[f] > (o.maxPerFamily || 1)) out.push({ k: "family", family: f, count: byFamily[f] });
  }
  // A session made of nothing but one-sided work doubles its own length
  // without saying so.
  const uni = (records || []).filter((r) => r.unilateral).length;
  if (records && records.length && uni === records.length && records.length > 2) out.push({ k: "all-unilateral", count: uni });

  // Straight-arm load is what the connective tissue pays for, and it
  // accumulates faster than the muscles suggest.
  const straight = (records || []).filter((r) => o.isStraightArm && o.isStraightArm(r.id)).length;
  if (straight > (o.maxStraightArm || 2)) out.push({ k: "straight-arm", count: straight });

  // Skills are practised fresh or not at all.
  const skills = (records || []).filter((r) => r.skillType && r.skillType !== "none").length;
  if (skills > (o.maxSkills || 2)) out.push({ k: "skill-fatigue", count: skills });
  return out;
}

// ---- time ------------------------------------------------------------
// What a set actually costs, from its measurement type. A hold costs its
// own seconds; a set of reps costs roughly three seconds a rep.
export function setCostSec(measurementType, planned, restSec) {
  const m = measurementOf(measurementType);
  const p = planned || {};
  let work = 0;
  if (m.volume === "time") work = Number(p.targetDurationSec) || 30;
  else if (m.volume === "distance") work = Number(p.targetDurationSec) || Math.max(60, (Number(p.targetDistanceM) || 1000) / 2.5);
  else {
    const reps = p.targetReps != null ? p.targetReps : p.targetRepsMax != null ? p.targetRepsMax : p.targetRepsMin != null ? p.targetRepsMin : 8;
    work = (Number(reps) || 8) * 3;
  }
  return Math.round(work + (Number(restSec) || 0));
}

export function templateMinutes(template, opts) {
  const o = opts || {};
  let sec = 0;
  for (const b of (template && template.blocks) || []) {
    for (const s of b.sets || []) {
      sec += setCostSec(b.measurementType, s.planned, s.restSec == null ? b.restSec : s.restSec);
    }
  }
  return Math.max(5, Math.round(sec / 60) + (o.overheadMin || 0));
}

// ---- the pain boundary ------------------------------------------------
// A constraint on the dose, and nothing more. The generator may shorten,
// lighten, narrow the range or offer another variant, and it may suggest
// speaking to somebody. It may not diagnose, treat, or promise safety.
export const PAIN_ACTIONS = ["narrow-range", "reduce-load", "shorten-volume", "offer-variant", "suggest-consultation"];

export function easeForPain(block, opts) {
  const o = opts || {};
  const sets = (block.sets || []);
  const keep = Math.max(2, Math.round(sets.length * 0.6));
  return {
    ...block,
    restSec: Math.round(block.restSec * 1.2),
    sets: sets.slice(0, keep).map((s) => ({
      ...s,
      planned: { ...s.planned, targetWeight: s.planned.targetWeight != null ? Math.round(s.planned.targetWeight * 0.6 * 10) / 10 : undefined, targetRir: 3 },
    })),
    rirEnabled: true,
    coachNote: o.note || ["Dneska menší dávka a větší zásoba. Rozsah jen tam, kde je klid.", "A smaller dose today with more left in reserve. Range only where it stays quiet."],
  };
}

export { GENERIC_ROLES };
