// ======================================================================
// ATLAS RESOLVER · read-only, and separate from everything else
// ----------------------------------------------------------------------
// This module answers exactly one question: which illustration belongs to
// this exercise. It is deliberately NOT the same code that decides tier,
// role or generator eligibility — those decide what the product may do,
// this decides what a card looks like, and mixing them is how a picture
// ends up deciding whether somebody sees an exercise.
//
// The Movement Atlas is read here and never written. The generated
// manifest is an input. A new exercise that has no plate gets `null` and
// the procedural figure covers it — never a similar exercise's picture,
// because a plausible wrong illustration is worse than an honest generic
// one.
// ======================================================================

import { ATLAS_STATUS } from "./types.js";

export function makeAtlasResolver(manifest, opts) {
  const o = opts || {};
  const entries = (manifest && manifest.entries) || manifest || {};
  const originalIds = new Set(Object.keys(entries));

  return {
    // Every id the manifest knows, in manifest order. The order matters:
    // the Atlas production list is keyed to it.
    ids: () => Object.keys(entries),
    count: () => Object.keys(entries).length,
    has: (exId) => Object.prototype.hasOwnProperty.call(entries, exId),
    // The plate for this exercise, or null. There is no fuzzy match, no
    // family fallback and no "close enough".
    artFor: (exId) => (Object.prototype.hasOwnProperty.call(entries, exId) ? entries[exId] : null),
    statusFor: (exId) => (originalIds.has(exId) ? ATLAS_STATUS.ORIGINAL : ATLAS_STATUS.PENDING),
    isOriginalMaster: (exId) => originalIds.has(exId),
    // What the card should actually render, said in one word so the UI
    // has nothing to decide.
    renderKindFor: (exId) => {
      if (originalIds.has(exId)) return "atlas";
      return o.proceduralFor && o.proceduralFor(exId) ? "procedural" : "pattern";
    },
    originalIds,
  };
}

// The queue for a future, separate Atlas task. Produced here, consumed
// nowhere: writing it changes nothing about the Movement Atlas.
export function extensionCandidates(records, resolver, opts) {
  const o = opts || {};
  const out = [];
  for (const rec of records || []) {
    if (!rec) continue;
    if (resolver && resolver.isOriginalMaster(rec.id)) continue;
    out.push({
      exerciseId: rec.id,
      cz: rec.displayCz,
      en: rec.displayEn,
      family: rec.familyId,
      variant: rec.variantKey,
      equipment: rec.equipment,
      measurementType: rec.measurementType,
      // The view an illustrator would need, from the movement itself.
      suggestedView: suggestView(rec),
      visualBrief: (o.briefFor && o.briefFor(rec.id)) || briefFor(rec),
      priority: priorityFor(rec),
      // An exact reuse is only proposed when the STANCE and the VIEW are
      // genuinely identical. Anything less is NONE, on purpose.
      exactReuseCandidate: (o.reuseFor && o.reuseFor(rec.id)) || "NONE",
      status: "NOT YET IN MOVEMENT ATLAS",
    });
  }
  return out.sort((a, b) => a.priority - b.priority || (a.exerciseId < b.exerciseId ? -1 : 1));
}

function suggestView(rec) {
  const eq = rec.equipment || [];
  const pat = (rec.movementPatterns || [])[0];
  if (rec.unilateral) return "bok";
  if (pat === "tlak" || pat === "tah") return eq.includes("stroj") ? "bok" : "predek";
  if (pat === "drep" || pat === "ohyb") return "bok";
  if (pat === "prenos") return "bok";
  if (pat === "stred") return "bok";
  return "bok";
}

function briefFor(rec) {
  const bits = [];
  bits.push(rec.displayEn || rec.displayCz);
  if (rec.equipment && rec.equipment.length) bits.push("equipment: " + rec.equipment.join(", "));
  bits.push("measured as " + rec.measurementType);
  if (rec.unilateral) bits.push("one side at a time");
  return bits.join(" · ");
}

function priorityFor(rec) {
  // What people will actually meet first: core before extended, a
  // bilateral staple before a machine variant.
  if (rec.role === "CORE") return 1;
  if (rec.role === "ACTIVITY") return 2;
  if (rec.role === "EXTENDED") return 3;
  return 4;
}

export { ATLAS_STATUS };
