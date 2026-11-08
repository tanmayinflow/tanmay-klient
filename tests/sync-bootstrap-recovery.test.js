import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { createDocumentSyncQueue } from '../src/shared/product/documentSyncQueue.js';
import { bootstrapSyncDecision } from '../src/shared/product/bootstrapSync.js';

const source = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
const main = source.includes('const _handshake = React.useCallback');
test('Main keeps an unacknowledged startup draft pending and retries it', { skip: !main }, async () => {
  const coll = { draft: 'offline work' }, edits = {};
  const serialize = (coll, edits) => JSON.stringify({ coll, edits });
  const baseline = serialize({ draft: 'old acknowledged work' }, edits);
  let writes = 0, mark = null;
  const noop = () => {};
  const context = {
    React: { useCallback: fn => fn }, _documentSyncQueue: { current: createDocumentSyncQueue() },
    _readDoc: async () => ({ doc: { coll: { draft: 'old acknowledged work' }, edits, rev: 4 } }),
    TM_LOCAL_WRITER: { isPaused: () => false },
    _syncReady: { current: false }, _dirty: { current: false },
    _collRef: { current: coll }, _editsRef: { current: edits },
    _rev: { current: 4 }, _lastSynced: { current: baseline }, _druhSelhani: { current: 'prihlaseni' },
    _serializeDoc: serialize, syncMarkLoad: () => ({ rev: 4, sig: baseline }), tmDocSig: s => s,
    bootstrapSyncDecision, setColl: noop, saveColl: noop, setEdits: noop, saveEdits: noop,
    _acknowledgeRemote: () => false,
    setSyncErr: noop, setSyncOdlozeno: noop, setConflict: () => assert.fail('same remote revision is not a conflict'),
    _odesli: async (c, e, rev) => { if (++writes === 1) return false; context._rev.current = rev; context._lastSynced.current = serialize(c, e); mark = { rev, sig: serialize(c, e) }; return true; }, syncMarkSave: (rev, sig) => { mark = { rev, sig }; },
  };
  const start = source.indexOf('  const _handshake = React.useCallback');
  const end = source.indexOf('  // A local decision', start);
  const handshake = vm.runInNewContext(source.slice(start, end) + '; _handshake', context);
  assert.equal(await handshake(), false);
  assert.equal(context._syncReady.current, false);
  assert.equal(context._lastSynced.current, baseline);
  assert.equal(mark, null, 'failed PUT must not receive an acknowledged signature');
  assert.equal(await handshake(), true);
  assert.equal(writes, 2);
  assert.equal(context._lastSynced.current, serialize(coll, edits));
  assert.deepEqual(mark, { rev: 5, sig: serialize(coll, edits) });
});
