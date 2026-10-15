import { EXPANSION_CORRECTIONS } from './catalogCorrectionData.js';

const AUDIT_FLAG = 'exerciseAudit20261013';
const BILINGUAL_FIELDS = new Set(['pos', 'exe', 'wat', 'pro', 'foc']);
const owns = (value, key) => Object.prototype.hasOwnProperty.call(value, key);

// Catalogue values are JSON data. Object key order is not a user edit.
function equalValue(a, b) {
  if (Object.is(a, b)) return true;
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a) && a.length !== b.length) return false;
  const keys = Object.keys(a);
  return keys.length === Object.keys(b).length
    && keys.every(key => owns(b, key) && equalValue(a[key], b[key]));
}

function copyValue(value) {
  if (Array.isArray(value)) return value.map(copyValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, copyValue(item)]));
  }
  return value;
}

function correctedValue(field, current, before, after) {
  // CZ and EN are independently editable. A custom Czech cue must not prevent
  // an untouched English cue from receiving its correction, or vice versa.
  if (BILINGUAL_FIELDS.has(field) && Array.isArray(current)
      && Array.isArray(before) && Array.isArray(after)
      && before.length === 2 && after.length === 2) {
    let next = current;
    for (let language = 0; language < 2; language++) {
      if (owns(current, language) && equalValue(current[language], before[language])
          && !equalValue(current[language], after[language])) {
        if (next === current) next = [...current];
        next[language] = copyValue(after[language]);
      }
    }
    return next;
  }
  return equalValue(current, before) && !equalValue(current, after)
    ? copyValue(after) : current;
}

/**
 * Correct only untouched fields of existing cards once. Never restore deleted
 * cards or alter programmes/logs. The optional data argument supports focused
 * migration tests; production defaults to the audited before/after snapshot.
 */
export function applyExerciseCorrections(collection, corrections = EXPANSION_CORRECTIONS) {
  return applyCatalogCorrections(collection, corrections, AUDIT_FLAG);
}

/** Shared guarded editor; each release supplies its own one-time marker. */
export function applyCatalogCorrections(collection, corrections, auditFlag) {
  if (!collection || typeof collection !== 'object' || collection[auditFlag]) return collection;
  const previous = collection.tEx;
  let nextRows = previous;
  if (Array.isArray(previous)) {
    const existingIds = new Set(previous.map(row => row?.id));
    previous.forEach((row, index) => {
      if (!row || !owns(corrections, row.id)) return;
      let next = row;
      for (const [field, change] of Object.entries(corrections[row.id])) {
        // Stable identities are never migrated by editorial corrections.
        if (field === 'id') continue;
        let value = correctedValue(field, row[field], change.before, change.after);
        // Only an untouched link is eligible. Its new target may have been
        // deleted by the user or omitted by this application's catalogue.
        if ((field === 'ez' || field === 'hd') && equalValue(row[field], change.before)
            && value != null && !existingIds.has(value)) value = null;
        if (!Object.is(value, row[field])) {
          if (next === row) next = { ...row };
          next[field] = value;
        }
      }
      if (next !== row) {
        if (nextRows === previous) nextRows = [...previous];
        nextRows[index] = next;
      }
    });
  }
  return nextRows === previous
    ? { ...collection, [auditFlag]: true }
    : { ...collection, [auditFlag]: true, tEx: nextRows };
}
