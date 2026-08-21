// ======================================================================
// TRAINING STORAGE · one namespace, and a fence around it
// ----------------------------------------------------------------------
// The whole V2 training domain lives under a single key on the
// collection. That is what makes the reset provably bounded: everything
// the reset may touch is inside `coll.tv2` plus the named legacy keys,
// and everything else in the document is somebody else's data that this
// task has no business editing.
// ======================================================================

import { TRAINING_SCHEMA_VERSION, TRAINING_KEY, LEGACY_BACKUP_KEY, LEGACY_TRAINING_KEYS, LEGACY_DAY_SUBKEY } from "./types.js";

export function defaultPrefs() {
  return {
    // Kilograms only, for now. A unit switch that half-converts a history
    // is worse than no unit switch.
    unit: "kg",
    barWeight: 20,
    // Per side, the plates a person actually owns or finds in their gym.
    plates: [25, 20, 15, 10, 5, 2.5, 1.25],
    collars: 0,
    // RIR is off unless a template or a coach turns it on. Asking for it
    // on every mobility drill trains people to answer without thinking.
    rirDefault: false,
    autoRest: true,
    warmupSets: 3,
    // Optional, used only where an added-load estimate needs it. Never
    // required, never nagged for.
    bodyweightKg: null,
  };
}

export function emptyTraining() {
  return {
    v: TRAINING_SCHEMA_VERSION,
    templates: [],
    plans: [],
    sessions: [],
    // Custom variants a person made. New stable ids, own history, never
    // an edit to a canonical exercise and never a touch of the Atlas.
    custom: [],
    favorites: [],
    recent: [],
    prefs: defaultPrefs(),
    activePlanId: null,
    // Filled by the client app's outbox. Empty in the Main App.
    outbox: [],
  };
}

export const trainingOf = (coll) => (coll && coll[TRAINING_KEY]) || null;
export const trainingVersionOf = (coll) => {
  const t = trainingOf(coll);
  return t && Number(t.v) ? Number(t.v) : 0;
};
export const isCurrentSchema = (coll) => trainingVersionOf(coll) === TRAINING_SCHEMA_VERSION;

// A shallow merge that keeps the version and never lets a caller drop a
// collection it did not mean to touch.
export function patchTraining(coll, patch) {
  const cur = trainingOf(coll) || emptyTraining();
  return { ...coll, [TRAINING_KEY]: { ...cur, ...patch, v: TRAINING_SCHEMA_VERSION } };
}

// ---- the legacy subtree ----------------------------------------------
// Exactly the pre-V2 training data, and nothing else. This function is
// the definition of "training data" for the reset, so it is short on
// purpose and is asserted by a test.
export function legacySubtree(coll) {
  const out = {};
  for (const k of LEGACY_TRAINING_KEYS) {
    if (coll && coll[k] !== undefined) out[k] = coll[k];
  }
  // A day may carry a note that is not training. Only its items are.
  const days = (coll && coll.tDays) || null;
  if (days) {
    const items = {};
    for (const d of Object.keys(days)) {
      const it = days[d] && days[d][LEGACY_DAY_SUBKEY];
      if (Array.isArray(it) && it.length) items[d] = it;
    }
    if (Object.keys(items).length) out.tDaysItems = items;
  }
  return out;
}

// Everything that is NOT training. The guard test compares this before
// and after the reset and requires semantic equality.
export function nonTrainingSnapshot(coll) {
  const out = {};
  const skip = new Set([...LEGACY_TRAINING_KEYS, TRAINING_KEY, "tDays"]);
  for (const k of Object.keys(coll || {})) {
    if (skip.has(k)) continue;
    out[k] = coll[k];
  }
  // tDays survives the reset minus its items, so its non-training half
  // has to be compared too.
  const days = (coll && coll.tDays) || null;
  if (days) {
    const rest = {};
    for (const d of Object.keys(days)) {
      const { [LEGACY_DAY_SUBKEY]: _items, ...other } = days[d] || {};
      if (Object.keys(other).length) rest[d] = other;
    }
    if (Object.keys(rest).length) out.__tDaysWithoutItems = rest;
  }
  return out;
}

// ---- the reset -------------------------------------------------------
// One-shot, idempotent, versioned, and limited to the keys above.
//
// The safety net: before the first reset the raw legacy subtree is written
// to its own local key. It is never read at render time, never restored
// automatically, does not block the new model, and contains nothing from
// outside the training domain. Writing it is best effort — a full disk
// must not stop somebody from using the app, and a backup that already
// exists is never overwritten, because the FIRST one is the real one.
export function resetTrainingDomain(coll, opts) {
  const o = opts || {};
  if (isCurrentSchema(coll)) return { coll, changed: false, backup: null, reason: "already-v2" };

  const backup = {
    at: o.now || Date.now(),
    from: trainingVersionOf(coll) || 1,
    to: TRAINING_SCHEMA_VERSION,
    data: legacySubtree(coll),
  };

  const next = { ...coll };
  for (const k of LEGACY_TRAINING_KEYS) delete next[k];
  if (next.tDays) {
    const days = {};
    for (const d of Object.keys(next.tDays)) {
      const { [LEGACY_DAY_SUBKEY]: _items, ...other } = next.tDays[d] || {};
      if (Object.keys(other).length) days[d] = other;
    }
    next.tDays = days;
  }
  next[TRAINING_KEY] = { ...emptyTraining(), ...(o.seed || {}), v: TRAINING_SCHEMA_VERSION };
  return { coll: next, changed: true, backup, reason: "reset" };
}

// Write the backup through whatever storage the caller has. Returns true
// when something was written, false when a backup already existed or the
// write failed. Never throws.
export function writeLegacyBackup(storage, backup) {
  if (!storage || !backup) return false;
  try {
    if (storage.getItem(LEGACY_BACKUP_KEY)) return false;
    storage.setItem(LEGACY_BACKUP_KEY, JSON.stringify(backup));
    return true;
  } catch (e) {
    return false;
  }
}

export function readLegacyBackup(storage) {
  try {
    const raw = storage && storage.getItem(LEGACY_BACKUP_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function clearLegacyBackup(storage) {
  try { storage && storage.removeItem(LEGACY_BACKUP_KEY); return true; } catch (e) { return false; }
}

// ---- collection accessors --------------------------------------------
const list = (coll, key) => {
  const t = trainingOf(coll);
  return t && Array.isArray(t[key]) ? t[key] : [];
};
export const templatesOf = (coll) => list(coll, "templates");
export const plansOf = (coll) => list(coll, "plans");
export const sessionsOf = (coll) => list(coll, "sessions");
export const customOf = (coll) => list(coll, "custom");
export const favoritesOf = (coll) => list(coll, "favorites");
export const recentOf = (coll) => list(coll, "recent");
export const outboxOf = (coll) => list(coll, "outbox");
export const prefsOf = (coll) => ({ ...defaultPrefs(), ...((trainingOf(coll) || {}).prefs || {}) });
export const activePlanIdOf = (coll) => (trainingOf(coll) || {}).activePlanId || null;

export const upsert = (arr, item) => {
  const i = (arr || []).findIndex((x) => x.id === item.id);
  if (i < 0) return [...(arr || []), item];
  const out = (arr || []).slice();
  out[i] = item;
  return out;
};

export function putSession(coll, session) {
  return patchTraining(coll, { sessions: upsert(sessionsOf(coll), session) });
}
export function putTemplate(coll, template) {
  return patchTraining(coll, { templates: upsert(templatesOf(coll), template) });
}
export function putPlan(coll, plan) {
  return patchTraining(coll, { plans: upsert(plansOf(coll), plan) });
}
export function dropSession(coll, id) {
  return patchTraining(coll, { sessions: sessionsOf(coll).filter((s) => s.id !== id) });
}
export function dropTemplate(coll, id) {
  return patchTraining(coll, { templates: templatesOf(coll).filter((t) => t.id !== id) });
}
export function dropPlan(coll, id) {
  const t = trainingOf(coll) || {};
  return patchTraining(coll, {
    plans: plansOf(coll).filter((p) => p.id !== id),
    activePlanId: t.activePlanId === id ? null : t.activePlanId,
  });
}

// Most recently used exercises, newest first, capped. Used by the picker
// so the thing you did on Tuesday is not on page four on Thursday.
export function noteRecent(coll, exId, cap) {
  if (!exId) return coll;
  const cur = recentOf(coll).filter((x) => x !== exId);
  return patchTraining(coll, { recent: [exId, ...cur].slice(0, cap || 24) });
}

export function toggleFavorite(coll, exId) {
  const cur = favoritesOf(coll);
  return patchTraining(coll, { favorites: cur.includes(exId) ? cur.filter((x) => x !== exId) : [...cur, exId] });
}

export { TRAINING_KEY, LEGACY_BACKUP_KEY, TRAINING_SCHEMA_VERSION, LEGACY_TRAINING_KEYS };
