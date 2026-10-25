import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const inApp = fs.existsSync(new URL('../src/training/exerciseLibrary.js', import.meta.url));
const training = inApp ? '../src/training/' : '../training/';
const { buildExerciseIndex } = await import(training + 'exerciseLibrary.js');
const { EXERCISE_MOVEMENTS } = await import(training + 'exerciseTaxonomy.js');
const { movementIllustrationExercise } = await import(training + 'exerciseMovementIllustrations.js');
const row = (id, movements, priority = 1, extra = {}) => ({ id, cz: id, taxonomy: { movements, priority }, ...extra });
const validArt = { primary: { thumb: '/current.webp' } };

test('every classified movement can use an approved current representative; unclassified stays empty', () => {
  for (const {id} of EXERCISE_MOVEMENTS) {
    const exercise = row('current-' + id, [id]);
    const index = buildExerciseIndex([exercise]);
    assert.equal(movementIllustrationExercise(index, id, { artOf: () => validArt }), id === 'other' ? null : exercise);
  }
  assert.equal(movementIllustrationExercise([], 'invented', { artOf: () => validArt }), null);
});

test('representative follows the current category and foundational order, not a stale image id', () => {
  const reclassified = row('former-squat', ['hinge'], 0);
  const specialist = row('specialist', ['squat'], 2);
  const foundation = row('foundation', ['squat'], 0);
  const index = buildExerciseIndex([specialist, reclassified, foundation]);
  assert.equal(movementIllustrationExercise(index, 'squat', { artOf: () => validArt }), foundation);
  assert.equal(movementIllustrationExercise(index, 'hinge', { artOf: () => validArt }), reclassified);
});

test('missing, suppressed and unverified images cannot become decorative examples', () => {
  const rows = ['missing','suppressed','unverified','empty','current'].map(id => row(id, ['step']));
  const index = buildExerciseIndex(rows);
  const artOf = exercise => ({missing:null,suppressed:{...validArt,suppress:true},unverified:validArt,empty:{primary:{}},current:validArt})[exercise.id];
  assert.equal(movementIllustrationExercise(index, 'step', { artOf, isUnverified: exercise => exercise.id === 'unverified' }), rows[4]);
  assert.equal(movementIllustrationExercise(index, 'step'), null);
});

test('deleted, archived and alias rows do not return through the decorative projection', () => {
  const rows = [row('archive',['carry'],0,{tier:'archived'}),row('alias',['carry'],0,{aliasOf:'deleted'}),row('visible',['carry'],1)];
  const index = buildExerciseIndex(rows);
  assert.equal(movementIllustrationExercise(index, 'carry', { artOf: () => validArt }), rows[2]);
  assert.equal(movementIllustrationExercise(buildExerciseIndex(rows.slice(0,2)), 'carry', { artOf: () => validArt }), null);
});

test('multiple categories compose independently without mutating saved order, filters or personal fields', () => {
  const a = Object.freeze(row('a',['squat'],0,{notes:'own note'}));
  const b = Object.freeze(row('b',['hinge'],0));
  const rows = Object.freeze([b,a]);
  const index = Object.freeze(buildExerciseIndex(rows));
  const selected = Object.freeze(['squat','hinge']);
  assert.deepEqual(selected.map(id => movementIllustrationExercise(index,id,{artOf:()=>validArt})),[a,b]);
  assert.deepEqual(rows,[b,a]);
  assert.deepEqual(selected,['squat','hinge']);
  assert.equal(a.notes,'own note');
});

test('hollow contour image and an explicit verified replacement remain eligible', () => {
  const exercise = row('current',['breath']);
  const index = buildExerciseIndex([exercise]);
  assert.equal(movementIllustrationExercise(index,'breath',{artOf:()=>({contourOnly:true,primary:{inkThumb:'/ink.webp'}})}),exercise);
  assert.equal(movementIllustrationExercise(index,'breath',{artOf:()=>({...validArt,verifiedReplacement:true}),isUnverified:()=>true}),exercise);
});
