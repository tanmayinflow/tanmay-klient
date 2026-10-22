import { STEP_VARIANTS } from '../src/training/catalogStepVariants.js';
import { STEP_EXERCISES } from '../src/training/catalogStepAudit.js';
import { STEP_TAXONOMY } from '../src/training/catalogStepAuditData.js';
import { HINGE_TAXONOMY } from '../src/training/catalogHingeAuditData.js';
import { LUNGE_TAXONOMY } from '../src/training/catalogLungeAuditData.js';
import { SQUAT_TAXONOMY } from '../src/training/catalogSquatAuditData.js';
import { SQUAT_EXERCISES } from '../src/training/catalogSquatAudit.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import { applyExerciseCorrections } from '../src/training/catalogCorrections.js';
import { EXPANSION_CORRECTIONS } from '../src/training/catalogCorrectionData.js';
import { EXPANSION_EXERCISES, seedExerciseExpansion } from '../src/training/catalogExpansion.js';
import { KETTLEBELL_EXERCISES } from '../src/training/catalogKettlebell.js';
import { INSTAGRAM_EXERCISES } from '../src/training/catalogInstagram.js';
import { INSTAGRAM_CONTINUATION_EXERCISES } from '../src/training/catalogInstagramContinuation.js';
import { INSTAGRAM_CLIENT_NEXT_EXERCISES } from '../src/training/catalogInstagramClientNext.js';
import { INSTAGRAM_DEEP_REVIEW_EXERCISES } from '../src/training/catalogInstagramDeepReview.js';
import { proposal as BRIDGE_AUDIT } from '../src/training/catalogBridgeAuditData.js';
import { proposal as HORIZONTAL_PRESS_AUDIT } from '../src/training/catalogHorizontalPressAuditData.js';
import { proposal as HORIZONTAL_PULL_AUDIT } from '../src/training/catalogHorizontalPullAuditData.js';

const OCT22_CONTENT_AUDITS = [BRIDGE_AUDIT, HORIZONTAL_PRESS_AUDIT, HORIZONTAL_PULL_AUDIT];
const OCT22_FOUNDATION_COUNT = OCT22_CONTENT_AUDITS.reduce((count, audit) => count + audit.additions.length, 0);

const corrections = {
  ex26_sample: {
    cz: { before: 'Původní název', after: 'Přesnější název' },
    pos: { before: ['Původní CZ', 'Original EN'], after: ['Opravené CZ', 'Corrected EN'] },
    pro: { before: ['Původní progrese', 'Original progression'], after: ['Smysluplná progrese', 'Useful progression'] },
    ez: { before: 'too_difficult', after: 'easier' },
    eq: { before: ['telo', 'lavice'], after: ['telo'] },
    source: { before: { author: 'Autor', url: '/old' }, after: { author: 'Autor', url: '/corrected' } },
  },
  ex26_deleted: { cz: { before: 'Deleted old', after: 'Deleted new' } },
};
const oldCard = () => ({ id: 'ex26_sample', ...Object.fromEntries(Object.entries(corrections.ex26_sample).map(([field, change]) => [field, structuredClone(change.before)])) });
function freezeTree(value) {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freezeTree);
    Object.freeze(value);
  }
  return value;
}

test('existing cards receive matching editorial corrections without changing programmes, logs or other cards', () => {
  const old = oldCard();
  // Equivalent JSON objects can have a different insertion order after sync.
  old.source = { url: '/old', author: 'Autor' };
  const custom = { id: 'my_exercise', cz: 'Moje vlastní karta' };
  const original = { loadedSteps20261022:true, stepContentAudit20261022: true, squatContentAudit20261022: true, exerciseExpansion20261011: true, tEx: [old, custom, { id: 'easier' }], tWo: [{ id: 'w' }], tPl: [{ id: 'p' }], tLog: [{ exId: old.id, reps: 8 }] };
  const snapshot = structuredClone(original);
  freezeTree(original);
  const result = applyExerciseCorrections(original, freezeTree(structuredClone(corrections)));
  for (const [field, change] of Object.entries(corrections.ex26_sample)) assert.deepEqual(result.tEx[0][field], change.after, field);
  assert.equal(result.exerciseAudit20261013, true);
  assert.equal(result.tEx[0].id, old.id);
  assert.equal(result.tEx[1], custom);
  for (const key of ['tWo', 'tPl', 'tLog']) assert.equal(result[key], original[key], key);
  assert.deepEqual(original, snapshot);
  assert.equal(original.exerciseAudit20261013, undefined);
});

test('each language is corrected independently while user edits and customized scalar/array fields survive', () => {
  const czEdited = { ...oldCard(), cz: 'Moje jméno', pos: ['Moje CZ', 'Original EN'], pro: ['Původní progrese', 'My progression'], ez: 'my_choice', eq: ['telo', 'guma'] };
  const result = applyExerciseCorrections({ tEx: [czEdited] }, corrections).tEx[0];
  assert.equal(result.cz, czEdited.cz);
  assert.deepEqual(result.pos, ['Moje CZ', 'Corrected EN']);
  assert.deepEqual(result.pro, ['Smysluplná progrese', 'My progression']);
  assert.equal(result.ez, 'my_choice');
  assert.equal(result.eq, czEdited.eq);
  assert.deepEqual(czEdited.pos, ['Moje CZ', 'Original EN']);
  assert.deepEqual(czEdited.pro, ['Původní progrese', 'My progression']);
});

test('deleted cards remain absent and the second pass preserves the entire collection by reference', () => {
  const original = { loadedSteps20261022:true, stepContentAudit20261022: true, squatContentAudit20261022: true, exerciseExpansion20261011: true, tEx: [oldCard()] };
  const result = applyExerciseCorrections(original, corrections);
  assert.deepEqual(result.tEx.map(row => row.id), ['ex26_sample']);
  assert.equal(applyExerciseCorrections(result, corrections), result);
  const deletedLater = { ...result, tEx: [] };
  assert.equal(applyExerciseCorrections(deletedLater, corrections), deletedLater);
  assert.deepEqual(deletedLater.tEx, []);
});

test('new progression links resolve only to existing cards while manually edited links are preserved', () => {
  const linkPatches = {
    ex26_present: { ez: { before: 'old_easy', after: 'present_target' }, hd: { before: 'old_hard', after: 'deleted_target' } },
    ex26_deleted_target: { ez: { before: 'old_easy', after: 'deleted_target' } },
    ex26_custom: { ez: { before: 'old_easy', after: 'deleted_target' }, hd: { before: 'old_hard', after: 'deleted_target' } },
  };
  const custom = { id: 'ex26_custom', ez: 'my_easy', hd: 'my_hard' };
  const original = { tEx: [{ id: 'ex26_present', ez: 'old_easy', hd: 'old_hard' }, { id: 'ex26_deleted_target', ez: 'old_easy' }, custom, { id: 'present_target' }] };
  const result = applyExerciseCorrections(original, linkPatches);
  assert.equal(result.tEx[0].ez, 'present_target');
  assert.equal(result.tEx[0].hd, null);
  assert.equal(result.tEx[1].ez, null);
  assert.equal(result.tEx[2], custom);
  assert.equal(result.tEx[2].ez, 'my_easy');
  assert.equal(result.tEx[2].hd, 'my_hard');
  assert.deepEqual(result.tEx.map(row => row.id), original.tEx.map(row => row.id));
});

test('a no-op audit adds only its marker while keeping unchanged arrays, rows and values by reference', () => {
  const card = { id: 'ex26_sample', cz: 'Entirely custom', pos: ['Custom CZ', 'Custom EN'] };
  const original = { tEx: [card], tPl: [] };
  const result = applyExerciseCorrections(original, corrections);
  assert.notEqual(result, original);
  assert.equal(result.tEx, original.tEx);
  assert.equal(result.tEx[0], card);
  assert.equal(result.tEx[0].pos, card.pos);
  assert.equal(result.tPl, original.tPl);
  const empty = { tEx: [] };
  assert.equal(applyExerciseCorrections(empty, corrections).tEx, empty.tEx);
  const missing = applyExerciseCorrections({}, corrections);
  assert.equal(Object.hasOwn(missing, 'tEx'), false);
});

test('new stored values do not share mutable arrays or objects with the correction baseline', () => {
  const patches = structuredClone(corrections);
  const result = applyExerciseCorrections({ tEx: [oldCard()] }, patches);
  result.tEx[0].eq.push('custom equipment');
  result.tEx[0].source.url = '/personal';
  assert.deepEqual(patches, corrections);
});

test('null input and already-audited data are unchanged; fresh correct values are never reset to the baseline', () => {
  assert.equal(applyExerciseCorrections(null, corrections), null);
  assert.equal(applyExerciseCorrections(undefined, corrections), undefined);
  const correct = { id: 'ex26_sample', ...Object.fromEntries(Object.entries(corrections.ex26_sample).map(([field, change]) => [field, structuredClone(change.after)])) };
  const original = { tEx: [correct] };
  const result = applyExerciseCorrections(original, corrections);
  assert.equal(result.tEx, original.tEx);
  assert.equal(result.tEx[0], correct);
  assert.equal(applyExerciseCorrections(result, corrections), result);
});

test('the deployed expansion seed runs the audit on existing libraries without reseeding a deleted card', () => {
  const entry = Object.entries(EXPANSION_CORRECTIONS).find(([id]) => EXPANSION_EXERCISES.some(row => row.id === id));
  assert.ok(entry, 'The release includes at least one real correction.');
  const [id, patches] = entry;
  const originalCard = { id, ...Object.fromEntries(Object.entries(patches).map(([field, change]) => [field, structuredClone(change.before)])) };
  const original = {bridgeFoundations20261022:true,horizontalPressFoundations20261022:true,horizontalPullFoundations20261022:true, loadedSteps20261022:true, stepContentAudit20261022: true, squatContentAudit20261022: true, exerciseExpansion20261011: true, kettlebellExpansion20261015: true, instagramExpansion20261015: true, instagramContinuation20261015: true, instagramClientNext20261016: true, instagramDeepReview20261016: true, tEx: [originalCard], tLog: [{ exId: id }] };
  const result = seedExerciseExpansion(original);
  assert.equal(result.tEx.length, 1);
  for (const [field, change] of Object.entries(patches)) {
    const expected = (field === 'ez' || field === 'hd') && change.after != null && change.after !== id ? null : change.after;
    assert.deepEqual(result.tEx[0][field], expected, field);
  }
  assert.equal(result.tLog, original.tLog);
  assert.equal(result.exerciseAudit20261013, true);
  const deleted = seedExerciseExpansion({bridgeFoundations20261022:true,horizontalPressFoundations20261022:true,horizontalPullFoundations20261022:true, loadedSteps20261022:true, stepContentAudit20261022: true, squatContentAudit20261022: true, exerciseExpansion20261011: true, kettlebellExpansion20261015: true, instagramExpansion20261015: true, instagramContinuation20261015: true, instagramClientNext20261016: true, instagramDeepReview20261016: true, tEx: [] });
  assert.deepEqual(deleted.tEx, []);
  assert.equal(seedExerciseExpansion(deleted), deleted);
});

test('a fresh expansion is already correct and future seed calls keep its data and audit marker', () => {
  const fresh = seedExerciseExpansion({ tEx: [] });
  assert.equal(fresh.exerciseExpansion20261011, true);
  assert.equal(fresh.exerciseAudit20261013, true);
  assert.equal(fresh.tEx.length, EXPANSION_EXERCISES.length + KETTLEBELL_EXERCISES.length + INSTAGRAM_EXERCISES.length + INSTAGRAM_CONTINUATION_EXERCISES.length + INSTAGRAM_CLIENT_NEXT_EXERCISES.length + INSTAGRAM_DEEP_REVIEW_EXERCISES.length + SQUAT_EXERCISES.length + STEP_EXERCISES.length + STEP_VARIANTS.length + OCT22_FOUNDATION_COUNT);
  for (const [index, card] of EXPANSION_EXERCISES.entries()) {
    if (card.id in SQUAT_TAXONOMY || card.id in LUNGE_TAXONOMY || card.id in STEP_TAXONOMY || card.id in HINGE_TAXONOMY) continue;
    const audit = OCT22_CONTENT_AUDITS.find(review => Object.hasOwn(review.taxonomy, card.id));
    if (!audit) {
      assert.equal(fresh.tEx[index], card, card.id);
      continue;
    }
    // Audited rows may change only to the explicit reviewed fields and taxonomy.
    const expected = {
      ...card,
      ...Object.fromEntries(Object.entries(audit.corrections[card.id] || {}).map(([field, change]) => [field, structuredClone(change.after)])),
      taxonomy: structuredClone(audit.taxonomy[card.id]),
    };
    if (expected.cz !== card.cz || expected.en !== card.en) {
      expected.taxonomy.aliases = [...new Set([...(expected.taxonomy.aliases || []), card.cz, card.en].filter(Boolean))];
    }
    assert.deepEqual(fresh.tEx[index], expected, card.id);
  }
  assert.equal(seedExerciseExpansion(fresh), fresh);
});
