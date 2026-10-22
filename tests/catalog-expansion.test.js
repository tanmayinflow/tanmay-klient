import test from 'node:test';
import assert from 'node:assert/strict';
import { EXPANSION_EXERCISES, EXPANSION_META, seedExerciseExpansion } from '../src/training/catalogExpansion.js';
import { extensionFor } from '../src/training/catalogV2.js';
import { resolveExercise } from '../src/training/catalog.js';
import { SQUAT_EXERCISES } from '../src/training/catalogSquatAudit.js';
import { KETTLEBELL_EXERCISES } from '../src/training/catalogKettlebell.js';
import { INSTAGRAM_EXERCISES } from '../src/training/catalogInstagram.js';
import { INSTAGRAM_CONTINUATION_EXERCISES } from '../src/training/catalogInstagramContinuation.js';
import { INSTAGRAM_CLIENT_NEXT_EXERCISES } from '../src/training/catalogInstagramClientNext.js';
import { INSTAGRAM_DEEP_REVIEW_EXERCISES } from '../src/training/catalogInstagramDeepReview.js';

test('existing library receives expansion once without changing user cards, plans or logs', () => {
  const edited = { ...EXPANSION_EXERCISES[0], cz: 'Moje vlastní pojmenování' };
  const custom = { id: 'user_custom', cz: 'Můj cvik' };
  const original = { tEx: [edited, custom], tWo: [{ id: 'workout' }], tPl: [{ id: 'plan' }], tLog: [{ exId: edited.id, reps: 7 }] };
  const migrated = seedExerciseExpansion(original);
  assert.equal(migrated.tEx.length, EXPANSION_EXERCISES.length + KETTLEBELL_EXERCISES.length + INSTAGRAM_EXERCISES.length + INSTAGRAM_CONTINUATION_EXERCISES.length + INSTAGRAM_CLIENT_NEXT_EXERCISES.length + INSTAGRAM_DEEP_REVIEW_EXERCISES.length + SQUAT_EXERCISES.length + 1);
  assert.equal(migrated.tEx[0], edited);
  assert.equal(migrated.tEx[1], custom);
  for (const key of ['tWo', 'tPl', 'tLog']) assert.equal(migrated[key], original[key]);
  assert.equal(original.exerciseExpansion20261011, undefined);
  assert.equal(seedExerciseExpansion(migrated), migrated);
  // A later user deletion must stay deleted after the one-time migration.
  const removed = { ...migrated, tEx: migrated.tEx.slice(1) };
  assert.equal(seedExerciseExpansion(removed), removed);
});

test('client expansion uses only progression links available in its own catalogue', () => {
  const available = ['drep', 'plank'];
  const clientRows = extensionFor(available);
  const ids = new Set([...available, ...clientRows.map(x => x.id)]);
  const migrated = seedExerciseExpansion({ tEx: [] }, clientRows);
  assert.equal(migrated.tEx.length, EXPANSION_EXERCISES.length + KETTLEBELL_EXERCISES.length + INSTAGRAM_EXERCISES.length + INSTAGRAM_CONTINUATION_EXERCISES.length + INSTAGRAM_CLIENT_NEXT_EXERCISES.length + INSTAGRAM_DEEP_REVIEW_EXERCISES.length + SQUAT_EXERCISES.length);
  for (const row of migrated.tEx) for (const key of ['ez', 'hd']) assert.ok(!row[key] || ids.has(row[key]), row.id + ':' + key);
});

test('exercise measurement differentiates added weight, holds, travel and ordinary lifting', () => {
  const expected = { ex26_weighted_dip: 'ADDED_WEIGHT_REPS', ex26_bear_hold: 'DURATION', ex26_a_march: 'DISTANCE', ex26_db_supported_row: 'WEIGHT_REPS' };
  for (const [id, type] of Object.entries(expected)) {
    const row = EXPANSION_EXERCISES.find(x => x.id === id);
    assert.equal(resolveExercise(row, EXPANSION_META).measurementType, type, id);
  }
});

test('mobility expansion uses preparation role and short default rest', () => {
  const mobility = EXPANSION_EXERCISES.filter(x => x.collection === 'mobility');
  assert.equal(mobility.length, 50);
  for (const row of mobility) {
    assert.equal(row.goalRole, 'mobility', row.id);
    assert.equal(row.sessionRole, 'prep', row.id);
    assert.equal(row.defaultRestSec, 15, row.id);
  }
});

test('advanced skills remain explicit choices rather than automatic generic prescriptions', () => {
  for (const row of EXPANSION_EXERCISES.filter(x => x.tier === 'specialist')) {
    assert.equal(row.genRule, 'explicit', row.id);
    assert.equal(EXPANSION_META[row.id].g, 'explicit', row.id);
  }
});
