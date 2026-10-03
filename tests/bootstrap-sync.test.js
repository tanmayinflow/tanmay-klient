import test from 'node:test';
import assert from 'node:assert/strict';
import { bootstrapSyncDecision } from '../src/shared/product/bootstrapSync.js';

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
