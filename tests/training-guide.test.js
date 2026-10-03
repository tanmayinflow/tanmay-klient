import test from 'node:test';
import assert from 'node:assert/strict';
import { guideSteps, setSeconds, completeGuidedSet } from '../src/training/guide.js';
import { makeBlock } from '../src/training/sessionModel.js';
import { restAfterSet } from '../src/training/sessionEngine.js';

function block(id, patch = {}) {
  return makeBlock({ id, exId: id, measurementType: 'WEIGHT_REPS', restSec: 90,
    sets: [0, 1].map(i => ({ id: `${id}${i}`, planned: { targetRepsMin: 8, targetRepsMax: 12, targetWeight: 20 } })), ...patch });
}

test('guided supersets and circuits follow rounds and group order, including unequal set counts', () => {
  const session = { blocks: [block('solo'), block('b', { groupId: 'g', groupOrder: 2 }), block('a', { groupId: 'g', groupOrder: 1, sets: [{ id: 'a0' }] }), block('tail', { sets: [] })] };
  const steps = guideSteps(session);
  assert.deepEqual(steps.map(step => step.set.id), ['solo0', 'solo1', 'a0', 'b0', 'b1']);
  assert.deepEqual(steps.map(step => step.setIndex), [0, 1, 0, 0, 1]);
  assert.deepEqual(guideSteps(null), []);
});

test('confirming guided set preserves prescription and already entered actuals', () => {
  const b = block('a'); b.sets[0].actual = { reps: 9, weight: null };
  const session = { blocks: [b], prescriptionId: 'coach-owned', state: 'running' };
  const before = JSON.stringify(session);
  const done = completeGuidedSet(session, 'a', 'a0', { previousActual: { weight: 99, reps: 40 }, now: 123 });
  assert.equal(JSON.stringify(session), before);
  assert.deepEqual(done.blocks[0].sets[0].planned, b.sets[0].planned);
  assert.equal(done.blocks[0].sets[0].actual.reps, 9);
  assert.equal(done.blocks[0].sets[0].actual.weight, 20);
  assert.equal(done.blocks[0].sets[0].completedAt, 123);
  assert.equal(done.blocks[0].sets[1], b.sets[1]);
  assert.equal(done.prescriptionId, session.prescriptionId);
});

test('empty repetitions confirm lower bound; only absent prescription fields use last actuals', () => {
  const session = { blocks: [block('a', { sets: [{ id: 's', planned: { targetRepsMin: 8, targetRepsMax: 12 } }] })] };
  const done = completeGuidedSet(session, 'a', 's', { previousActual: { reps: 15, weight: 17.5 }, now: 123 });
  assert.equal(done.blocks[0].sets[0].actual.reps, 8);
  assert.equal(done.blocks[0].sets[0].actual.weight, 17.5);
});

test('early timer completion records elapsed time, never the full prescribed hold', () => {
  const session = { blocks: [block('hold', { measurementType: 'DURATION', sets: [{ id: 'h', planned: { targetDurationSec: 60 } }] })] };
  const done = completeGuidedSet(session, 'hold', 'h', { extra: { durationSec: 18 }, now: 100 });
  assert.equal(done.blocks[0].sets[0].actual.durationSec, 18);
  assert.equal(done.blocks[0].sets[0].planned.targetDurationSec, 60);
  assert.equal(setSeconds(session.blocks[0], session.blocks[0].sets[0]), 60);
  assert.equal(setSeconds({ measurementType: 'REPS_ONLY' }, { planned: { targetDurationSec: 60 } }), 0);
  const stopped = completeGuidedSet(session, 'hold', 'h', { extra: { durationSec: 0 }, now: 101 });
  assert.equal(stopped.blocks[0].sets[0].actual.durationSec, 0);
  assert.equal(stopped.blocks[0].sets[0].completed, true);
});

test('duplicate completion and vanished set are no-ops rather than overwritten workout history', () => {
  const session = { blocks: [block('a')] };
  const done = completeGuidedSet(session, 'a', 'a0', { now: 123 });
  assert.equal(completeGuidedSet(done, 'a', 'a0', { extra: { weight: 100 }, now: 999 }), done);
  assert.equal(completeGuidedSet(done, 'a', 'missing'), done);
  assert.equal(completeGuidedSet(done, 'missing', 'a0'), done);
});

test('explicit zero and secondary added load survive guided completion', () => {
  const b = block('bw', { measurementType: 'BODYWEIGHT_REPS', sets: [{ id: 's', planned: { targetReps: 8 }, actual: { reps: 0, addedWeight: 5 } }] });
  const done = completeGuidedSet({ blocks: [b] }, 'bw', 's', { previousActual: { reps: 20, addedWeight: 15 } });
  assert.equal(done.blocks[0].sets[0].actual.reps, 0);
  assert.equal(done.blocks[0].sets[0].actual.addedWeight, 5);
});

test('guided completion keeps group rest rules and skipping a step creates no false result', () => {
  const a = block('a', { groupId: 'pair', groupOrder: 0, groupMode: 'superset' });
  const b = block('b', { groupId: 'pair', groupOrder: 1, groupMode: 'superset' });
  const session = { blocks: [a, b] };
  const done = completeGuidedSet(session, 'a', 'a0');
  assert.equal(restAfterSet(done, 'a', 'a0').sec, 0);
  // Merely advancing through the sequence does not confirm or copy any values.
  const steps = guideSteps(session);
  assert.equal(steps[1].set.completed, false);
  assert.equal(steps[1].set.actual.reps, undefined);
});
