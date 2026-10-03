import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import worker from '../worker/index.js';
import { makeEnv, req } from './helpers/env.js';
import { createDocumentSyncQueue } from '../src/shared/product/documentSyncQueue.js';
import { bootstrapSyncDecision } from '../src/shared/product/bootstrapSync.js';

const source = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
const client = source.includes('const clientAccount = createClientSession()');
const email = 'sync-review@example.test';
const noop = () => {};
async function harness({ metaFailure = false } = {}) {
  const env = makeEnv({ OWNER_EMAIL: email });
  const api = async (path, method = 'GET', body) => {
    const response = await worker.fetch(req(path, { email, method, body }), env);
    return { status: response.status, body: await response.json() };
  };
  if (client) await api('/api/join', 'POST', { word: 'otevri se' });
  assert.equal((await api('/api/state', 'PUT', { doc: { coll: { draft: 'baseline' }, edits: {}, rev: 1 }, baseVersion: 0 })).status, 200);
  let release, started, metadataReads = 0, conflict = null;
  const gate = new Promise(resolve => { release = resolve; });
  const firstRead = new Promise(resolve => { started = resolve; });
  const effects = [], timers = [], writes = [];
  const coll = { current: { draft: 'older draft' } }, edits = { current: {} };
  const ctx = {
    React: { useRef: current => ({ current }), useCallback: fn => fn, useEffect: fn => effects.push(fn) },
    createDocumentSyncQueue, bootstrapSyncDecision,
    _syncReady: { current: true }, clientAccount: { isCurrent: () => true }, ownerId: 'verified',
    _collRef: coll, _editsRef: edits, coll: coll.current, edits: edits.current,
    _serializeDoc: (c, e) => JSON.stringify({ coll: c, edits: e }),
    _lastSynced: { current: JSON.stringify({ coll: { draft: 'baseline' }, edits: {} }) },
    _ver: { current: 1 }, _rev: { current: 1 }, _dirty: { current: true }, _druhSelhani: { current: null },
    SYNC_OK: 'ok', conflict: null, syncErr: null, JSON, Math,
    _shareOf: () => null, syncMarkSave: noop, syncMarkLoad: () => null, tmDocSig: s => s,
    setConflict: value => { conflict = value; }, setColl: noop, saveColl: noop, setEdits: noop, saveEdits: noop,
    oznamSelhani: noop, setDocBytes: noop, setDocLimit: noop, setSyncErr: noop, setSyncPending: noop, setSyncOdlozeno: noop,
    setTimeout: fn => { timers.push(fn); return timers.length; }, clearTimeout: noop,
    syncFetch: async (path, init = {}) => {
      const response = await api(path, init.method, init.body ? JSON.parse(init.body) : undefined);
      if (path.includes('?meta=1')) {
        metadataReads++;
        if (metadataReads === 1) { started(); await gate; }
        if (metaFailure) return { stav: 503, druh: 'error', telo: null };
      }
      if (init.method === 'PUT') writes.push(response.status);
      return { stav: response.status, telo: response.body, druh: response.status === 200 ? 'ok' : 'error' };
    },
  };
  ctx._readVer = async () => { const r = await ctx.syncFetch('/api/state?meta=1'); return r.druh === 'ok' ? { ver: r.telo.version } : null; };
  ctx._readServer = async () => { const r = await api('/api/state'); return { doc: r.body.doc, ver: r.body.version }; };
  let run, retry;
  if (client) {
    const start = source.indexOf('  const _documentSyncQueue ='), end = source.indexOf('  const _pushRef', start);
    const push = vm.runInNewContext(source.slice(start, end) + ';_push', ctx);
    run = () => push(); retry = () => push({ force: true });
  } else {
    const start = source.indexOf('  const _documentSyncQueue ='), end = source.indexOf('  // DVĚ OTEVŘENÉ KARTY', start);
    const actions = vm.runInNewContext(source.slice(start, end) + ';({zkusOdeslat})', ctx);
    run = () => { effects[1](); return timers.pop()(); };
    retry = actions.zkusOdeslat;
  }
  return { run, retry, coll, release, firstRead, writes, reads: () => metadataReads, conflict: () => conflict, api,
    adoptedRevision: value => { ctx._rev.current = value; ctx._ver.current = value; } };
}

for (const next of ['run', 'retry']) test(`${client ? 'Client' : 'Main'}: delayed metadata cannot let an older write replace a newer ${next}`, async () => {
  const h = await harness();
  const first = h.run(); await h.firstRead;
  h.coll.current = { draft: 'newer draft' };
  const second = h[next]();
  await new Promise(resolve => setImmediate(resolve));
  const readsWhileWaiting = h.reads();
  h.release(); await Promise.all([first, second]);
  assert.equal(readsWhileWaiting, 1, 'one document commit runs at a time');
  assert.equal((await h.api('/api/state')).body.doc.coll.draft, 'newer draft');
  assert.deepEqual(h.writes, [200, 200], 'own concurrent work does not create a false conflict');
});

test(`${client ? 'Client' : 'Main'}: a real other-device write remains a conflict`, async () => {
  const h = await harness();
  const pending = h.run(); await h.firstRead;
  assert.equal((await h.api('/api/state', 'PUT', { doc: { coll: { draft: 'another device' }, edits: {}, rev: 2 }, baseVersion: 1 })).status, 200);
  h.release(); await pending;
  assert.equal((await h.api('/api/state')).body.doc.coll.draft, 'another device');
  assert.ok(h.conflict(), 'both versions must be offered instead of silently overwriting');
  assert.deepEqual(h.writes, [409]);
});

test(`${client ? 'Client' : 'Main'}: an unreadable generation cannot trigger a PUT`, async () => {
  const h = await harness({ metaFailure: true });
  const pending = h.run(); await h.firstRead; h.release(); await pending;
  assert.deepEqual(h.writes, []);
  assert.equal((await h.api('/api/state')).body.doc.coll.draft, 'baseline');
});

test(`${client ? 'Client' : 'Main'}: delayed metadata cannot borrow a newer adopted server revision`, async () => {
  const h = await harness();
  const pending = h.run(); await h.firstRead;
  assert.equal((await h.api('/api/state', 'PUT', { doc: { coll: { draft: 'adopted remote' }, edits: {}, rev: 2 }, baseVersion: 1 })).status, 200);
  h.adoptedRevision(2);
  h.release(); await pending;
  assert.equal((await h.api('/api/state')).body.doc.coll.draft, 'adopted remote');
  assert.deepEqual(h.writes, [409]);
});

test('a failed job does not permanently lock later document sync', async () => {
  const run = createDocumentSyncQueue();
  await assert.rejects(run(async () => { throw new Error('offline'); }), /offline/);
  assert.equal(await run(async () => 'recovered'), 'recovered');
});
