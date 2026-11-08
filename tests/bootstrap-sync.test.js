import test from 'node:test';
import assert from 'node:assert/strict';
import { bootstrapSyncDecision, acknowledgedServerSnapshot } from '../src/shared/product/bootstrapSync.js';

test('an edit or delivery arriving during hydration cannot replace the remote document', () => {
  for (const unsynced of [false, true]) {
    assert.equal(bootstrapSyncDecision({ hasRemote: true, changedDuringRead: true, unsynced, serverAdvanced: false }), 'conflict');
  }
});
test('a new device adopts existing content and an empty account can keep its local draft', () => {
  assert.equal(bootstrapSyncDecision({ hasRemote: true, changedDuringRead: false, unsynced: false }), 'remote');
  assert.equal(bootstrapSyncDecision({ hasRemote: false, changedDuringRead: true, unsynced: true }), 'local');
});
test('offline edits resume only against their last acknowledged remote generation', () => {
  assert.equal(bootstrapSyncDecision({ hasRemote: true, changedDuringRead: false, unsynced: true, serverAdvanced: false }), 'local');
  assert.equal(bootstrapSyncDecision({ hasRemote: true, changedDuringRead: false, unsynced: true, serverAdvanced: true }), 'conflict');
});

test('lost acknowledgements compare full content and ignore only the transport revision', () => {
  const local = JSON.stringify({ coll: { draft: 'saved', archive: ['one', 'two'] }, edits: { today: 'entry' } });
  assert.equal(acknowledgedServerSnapshot({ ...JSON.parse(local), rev: 9 }, [null, local]), local);
  assert.equal(acknowledgedServerSnapshot({ ...JSON.parse(local), edits: { today: 'other device' }, rev: 9 }, [local]), null);
  assert.equal(acknowledgedServerSnapshot({ coll: JSON.parse(local).coll, rev: 9 }, [local]), null);
  assert.equal(acknowledgedServerSnapshot(null, [local]), null);
});

test('an older confirmed snapshot does not claim that a newer draft was saved', () => {
  const committed = JSON.stringify({ coll: { draft: 'saved' }, edits: {} });
  const current = JSON.stringify({ coll: { draft: 'still typing' }, edits: {} });
  assert.equal(acknowledgedServerSnapshot(JSON.parse(committed), [current, committed]), committed);
  assert.equal(acknowledgedServerSnapshot(JSON.parse(committed), [current]), null);
});
