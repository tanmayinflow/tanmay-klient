// ======================================================================
// CATALOG · one resolver, one effective exercise record
// ----------------------------------------------------------------------
// Three layers, read in this order and no other:
//
//     the row itself  →  the audit table  →  the training overlay  →  a derived default
//
// The row is the user's own copy and always wins. The audit table is the
// 485-row library audit. The overlay adds what V2 needs and the audit did
// not carry: how the exercise is measured, how long it rests, whether it
// is one side at a time. Everything else is DERIVED, because a table with
// 485 hand-written rows in it is a table that goes stale.
//
// There is deliberately no second catalogue. `resolveExercise` is the one
// function that answers "what is this exercise, for the product".
// ======================================================================

import { MEASUREMENT, measurementOf } from "./measurements.js";
import { TIER_TO_ROLE, GENERIC_ROLES, ATLAS_STATUS } from "./types.js";
import { OVERLAY, UNILATERAL, ALTERNATING, ORIGINAL_MASTER_COUNT } from "./catalogOverlay.js";

const arr = (v) => (Array.isArray(v) ? v : []);
const pick = (v, allowed, fallback) => (allowed.includes(v) ? v : fallback);

// ---- load mode -------------------------------------------------------
// Kept byte-compatible with the app's existing `tLoadOf`, because the
// library rows and the Movement Atlas both already speak it.
const LOAD_EQ_EXT = ["cinka", "kladka", "stroj"];
export function loadModeOf(row, meta) {
  if (!row) return "none";
  if (row.load) return row.load;
  const o = OVERLAY[row.id];
  if (o && o.load) return o.load;
  const eq = arr(row.eq);
  if (eq.some((k) => LOAD_EQ_EXT.includes(k))) return "ext";
  if (eq.includes("zavazi")) return (eq.includes("telo") ? "add" : "ext");
  return (meta && meta.addable) || (o && o.addable) ? "add" : "none";
}

// ---- measurement -----------------------------------------------------
// Derived from what the library already records, with the overlay naming
// only the exceptions. A row that says nothing still gets exactly one
// primary type — never none, never two.
export function measurementTypeOf(row, meta) {
  if (!row) return "REPS_ONLY";
  if (row.measurementType && MEASUREMENT[row.measurementType]) return row.measurementType;
  const o = OVERLAY[row.id];
  if (o && o.m && MEASUREMENT[o.m]) return o.m;
  if (row.pat === "dech") return "DURATION";
  const load = loadModeOf(row, meta);
  const role = (meta && meta.r) || "";
  if (row.mode === "sec") return load === "ext" ? "WEIGHT_DURATION" : "DURATION";
  if (load === "ext") return "WEIGHT_REPS";
  if (load === "add") return "BODYWEIGHT_REPS";
  if (row.pat === "mobilita" || role === "mobility" || role === "support" || role === "breath") return "REPS_ONLY";
  return "BODYWEIGHT_REPS";
}

// ---- rest ------------------------------------------------------------
// Default only. A workout row may override it, and a single set may
// override that. The number matters most where it is longest: a heavy
// compound recovers on the clock, a mobility drill does not.
export function defaultRestOf(row, meta) {
  const o = OVERLAY[row && row.id];
  if (o && o.rest != null) return o.rest;
  if (row && row.defaultRestSec != null) return Number(row.defaultRestSec) || 0;
  const m = meta || {};
  const role = m.r || "";
  const block = m.b || "";
  if (role === "breath" || role === "mobility") return 15;
  if (block === "prep") return 20;
  if (role === "coordination_skill") return 90;
  if (role === "strength_skill") return 150;
  if (role === "conditioning") return 60;
  if (block === "accessory") return 60;
  const s = Number(row && row.S) || 2;
  if (s >= 5) return 210;
  if (s === 4) return 165;
  if (s === 3) return 120;
  if (s === 2) return 90;
  return 60;
}

// ---- warm-up policy --------------------------------------------------
// `ramp` earns percentage warm-up sets. `light` is one easy set, because
// four ramp sets on a lateral raise is arithmetic pretending to be care.
// `specific` means the progression itself is the preparation — a skill
// warms up by doing an easier rung, not by doing 40 % of a handstand.
export function warmupPolicyOf(row, meta) {
  const o = OVERLAY[row && row.id];
  if (o && o.warmup) return o.warmup;
  const m = meta || {};
  const role = m.r || "";
  if (role === "breath" || role === "mobility" || (m.b === "prep")) return "none";
  if (role === "coordination_skill" || role === "strength_skill") return "specific";
  const load = loadModeOf(row, meta);
  const s = Number(row && row.S) || 2;
  if (load === "ext" && s >= 3) return "ramp";
  if (load === "ext") return "light";
  if (load === "add" && s >= 3) return "specific";
  return "none";
}

// ---- sides -----------------------------------------------------------
export function sideModeOf(row) {
  const id = row && row.id;
  if (ALTERNATING.includes(id)) return "alternating";
  if (UNILATERAL.includes(id)) return "perSide";
  const o = OVERLAY[id];
  if (o && o.side) return o.side;
  return "none";
}
export const isUnilateral = (row) => sideModeOf(row) !== "none";

// ---- family and variant ----------------------------------------------
// A family groups movements that give the same stimulus in one session,
// so a generated plan does not hand somebody three curls and call it
// variety. The variant is what actually differs inside the family, and
// it is the reason two rows may legitimately be two cards.
export function familyOf(row, meta) {
  if (row && row.family) return row.family;
  const o = OVERLAY[row && row.id];
  if (o && o.f) return o.f;
  if (meta && meta.f) return meta.f;
  return "id:" + (row ? row.id : "");
}
export function variantKeyOf(row, _meta) {
  if (row && row.variantKey) return row.variantKey;
  const o = OVERLAY[row && row.id];
  if (o && o.vk) return o.vk;
  // Nothing declared: the row is its own variant, which is true and says
  // nothing it cannot back up.
  return row ? row.id : "";
}

// ---- provenance is not role ------------------------------------------
// The defect this fixes: an ordinary dumbbell bench press arrived with a
// programme, and the programme's name became the exercise's role, so the
// picker hid it. Where it came from is `provenance`. What the product
// may do with it is `role`. They are read from different fields and are
// never derived from one another.
export function provenanceOf(meta) { return (meta && meta.src) || "tanmay"; }
export function sourceProgramsOf(row, meta) {
  const o = OVERLAY[row && row.id];
  if (o && o.programs) return o.programs;
  const src = provenanceOf(meta);
  return src && src !== "tanmay" && src !== "user" ? [src] : [];
}

export function tierOf(row, meta) {
  const t = (row && row.tier) || (meta && meta.t);
  return pick(t, Object.keys(TIER_TO_ROLE), "extended");
}
export function statusOf(row, meta) {
  const s = (row && row.status) || (meta && meta.s);
  return pick(s, ["active", "alias", "review", "blocked"], "active");
}
export function productRoleOf(row, meta) {
  if (statusOf(row, meta) === "alias" || (meta && meta.al)) return "ALIAS";
  if (statusOf(row, meta) === "blocked") return "ARCHIVE";
  return TIER_TO_ROLE[tierOf(row, meta)] || "EXTENDED";
}

export function sessionRoleOf(row, meta) {
  if (row && row.sessionRole) return row.sessionRole;
  const o = OVERLAY[row && row.id];
  if (o && o.b) return o.b;
  return (meta && meta.b) || "strength";
}

// ---- atlas boundary --------------------------------------------------
// The original master list is finite and closed. Membership is decided by
// ONE fact — was this id in the original master — and never by a name, a
// family or a similar-looking illustration.
export function atlasFactsOf(row, meta, originalIds) {
  const id = row ? row.id : "";
  const isOriginal = originalIds ? originalIds.has(id) : !!(meta && meta.originalMaster);
  return {
    status: isOriginal ? ATLAS_STATUS.ORIGINAL : ATLAS_STATUS.PENDING,
    originalMaster: !!isOriginal,
    // An extension exercise has no plate until the Movement Atlas makes
    // one. `null` is the honest answer and the procedural figure covers it.
    artId: isOriginal ? id : null,
  };
}

// ---- eligibility -----------------------------------------------------
const GEN_GENERIC = ["generic", "goal_eq", "cond"];
export function genRuleOf(row, meta) {
  const g = (row && row.genRule) || (meta && meta.g);
  return pick(g, ["generic", "goal_eq", "cond", "explicit", "canon_target", "never", "breath_optin", "source_plan", "yoga_planner"], "never");
}
export function generatorEligibleOf(row, meta) {
  if (statusOf(row, meta) !== "active") return false;
  const role = productRoleOf(row, meta);
  if (!GENERIC_ROLES.includes(role)) return false;
  return GEN_GENERIC.includes(genRuleOf(row, meta));
}
export function requiresCoachOf(row, meta) {
  return !!((row && row.requiresCoach) || (meta && meta.co));
}
// Gym kit a person may simply not have in the room they are standing in.
const CHECK_EQ = ["stroj", "kladka", "cinka"];
export function requiresEquipmentCheckOf(row) {
  return arr(row && row.eq).some((k) => CHECK_EQ.includes(k));
}
// What a client may be shown in their own library. A client never browses
// a coach's programme shelf, a catalogue entry or an archived row.
export function clientVisibleOf(row, meta) {
  if (statusOf(row, meta) !== "active") return false;
  return ["CORE", "EXTENDED", "YOGA", "BREATH", "ACTIVITY", "SPECIALIST"].includes(productRoleOf(row, meta));
}

// ---- names -----------------------------------------------------------
// `cz` and `en` stay exactly as the Movement Atlas master list has them —
// the Atlas keys its production documents on those, so they are not ours
// to rename. A product name is an override on top, never a second name.
export function displayCzOf(row, meta) {
  const o = OVERLAY[row && row.id];
  return (row && row.displayCz) || (o && o.dcz) || (meta && meta.dcz) || (row && row.cz) || "";
}
export function displayEnOf(row, meta) {
  const o = OVERLAY[row && row.id];
  return (row && row.displayEn) || (o && o.den) || (meta && meta.den) || (row && row.en) || "";
}
export function legacyNamesOf(row, meta) {
  const out = [];
  if (meta && (meta.dcz || meta.den)) { if (row.cz) out.push(row.cz); if (row.en) out.push(row.en); }
  const o = OVERLAY[row && row.id];
  if (o && o.legacy) out.push(...o.legacy);
  if (row && Array.isArray(row.legacyNames)) out.push(...row.legacyNames);
  return out.filter(Boolean);
}
export function searchAliasesOf(row, _meta) {
  const o = OVERLAY[row && row.id];
  const out = [];
  if (o && o.aka) out.push(...o.aka);
  if (row && Array.isArray(row.searchAliases)) out.push(...row.searchAliases);
  if (row && row.jg) { if (row.jg.sa) out.push(row.jg.sa); if (row.jg.dev) out.push(row.jg.dev); }
  return out.filter(Boolean);
}

// One string the picker searches. Both languages, the product name, the
// old name, every alias, the Sanskrit, and the id — so a person who types
// what they used to call it still finds it.
export function searchTextOf(row, meta) {
  return [row.cz, row.en, displayCzOf(row, meta), displayEnOf(row, meta), ...legacyNamesOf(row, meta), ...searchAliasesOf(row, meta), row.id]
    .filter(Boolean).join(" ");
}

// ---- the effective record --------------------------------------------
// Everything above, resolved once. Call it, keep the result, do not
// re-derive field by field in a render.
export function resolveExercise(row, meta, originalIds) {
  if (!row) return null;
  const m = meta || {};
  const measurementType = measurementTypeOf(row, m);
  const role = productRoleOf(row, m);
  return {
    id: row.id,
    displayCz: displayCzOf(row, m),
    displayEn: displayEnOf(row, m),
    legacyNames: legacyNamesOf(row, m),
    searchAliases: searchAliasesOf(row, m),
    familyId: familyOf(row, m),
    variantKey: variantKeyOf(row, m),
    provenance: provenanceOf(m),
    sourcePrograms: sourceProgramsOf(row, m),
    tier: tierOf(row, m),
    status: statusOf(row, m),
    role,
    sessionRole: sessionRoleOf(row, m),
    movementPatterns: [row.pat].filter(Boolean),
    primaryMuscles: arr(row.mp),
    secondaryMuscles: arr(row.ms),
    equipment: arr(row.eq),
    strengthDemand: Number(row.S) || 1,
    coordinationDemand: Number(row.C) || 1,
    jointLoad: row.J || {},
    measurementType,
    measurement: measurementOf(measurementType),
    loadMode: loadModeOf(row, m),
    skillType: m.sk || "none",
    defaultRestSec: defaultRestOf(row, m),
    warmupPolicy: warmupPolicyOf(row, m),
    unilateral: isUnilateral(row),
    sideMode: sideModeOf(row),
    // Tempo is a strength instruction. On a hold or a breath it is noise.
    tempoSupport: ["WEIGHT_REPS", "BODYWEIGHT_REPS", "ADDED_WEIGHT_REPS", "ASSISTED_REPS"].includes(measurementType),
    generatorEligible: generatorEligibleOf(row, m),
    clientVisible: clientVisibleOf(row, m),
    requiresCoach: requiresCoachOf(row, m),
    requiresEquipmentCheck: requiresEquipmentCheckOf(row),
    aliasOf: (row.aliasOf || m.al) || null,
    atlas: atlasFactsOf(row, m, originalIds),
    focus: row.foc || null,
    startPosition: row.pos || null,
    execution: row.exe || null,
    watchFor: row.wat || null,
    progression: row.pro || null,
    easierId: row.ez || null,
    harderId: row.hd || null,
  };
}

// A cache keyed by id, because a picker resolves five hundred rows on
// every keystroke otherwise.
export function makeResolver(metaTable, originalIds) {
  const cache = new Map();
  return (row) => {
    if (!row || !row.id) return null;
    const hit = cache.get(row.id);
    if (hit && hit.row === row) return hit.rec;
    const rec = resolveExercise(row, metaTable ? metaTable[row.id] : null, originalIds);
    cache.set(row.id, { row, rec });
    return rec;
  };
}

export { ORIGINAL_MASTER_COUNT };
