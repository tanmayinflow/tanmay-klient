import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import worker from '../worker/index.js';
import { makeEnv, req } from './helpers/env.js';
import { createDocumentSyncQueue } from '../src/shared/product/documentSyncQueue.js';
import { bootstrapSyncDecision, acknowledgedServerSnapshot } from '../src/shared/product/bootstrapSync.js';
import { createLocalDocumentWriter } from '../src/shared/product/localPersistence.js';

const source = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
const client = source.includes('const clientAccount = createClientSession()');
const email = 'sync-review@example.test';
const noop = () => {};
async function harness({ metaFailure = false, fullReadFailure = false, lostAcknowledgement = false } = {}) {
  const env = makeEnv({ OWNER_EMAIL: email });
  const api = async (path, method = 'GET', body) => {
    const response = await worker.fetch(req(path, { email, method, body }), env);
    return { status: response.status, body: await response.json() };
  };
  if (client) await api('/api/join', 'POST', { word: 'otevri se' });
  assert.equal((await api('/api/state', 'PUT', { doc: { coll: { draft: 'baseline' }, edits: {}, rev: 1 }, baseVersion: 0 })).status, 200);
  let release, started, metadataReads = 0, conflict = null, readHook = null, adopted = 0;
  let loseNextAcknowledgement = lostAcknowledgement;
  let mark = { rev: 1, v: 1, sig: JSON.stringify({ coll: { draft: 'baseline' }, edits: {} }) };
  const gate = new Promise(resolve => { release = resolve; });
  const firstRead = new Promise(resolve => { started = resolve; });
  const effects = [], timers = [], writes = [];
  const coll = { current: { draft: 'older draft' } }, edits = { current: {} };
  const localWriter = createLocalDocumentWriter({ getStorage: () => ({ getItem: () => null, setItem: noop }) });
  const ctx = {
    React: { useRef: current => ({ current }), useCallback: fn => fn, useEffect: fn => effects.push(fn) },
    createDocumentSyncQueue, bootstrapSyncDecision, acknowledgedServerSnapshot,
    TM_LOCAL_WRITER: localWriter, _localStorageDecision: { current: false },
    _syncReady: { current: true }, clientAccount: { isCurrent: () => true }, ownerId: 'verified',
    _collRef: coll, _editsRef: edits, coll: coll.current, edits: edits.current,
    _serializeDoc: (c, e) => JSON.stringify({ coll: c, edits: e }),
    _lastSynced: { current: JSON.stringify({ coll: { draft: 'baseline' }, edits: {} }) },
    _ver: { current: 1 }, _rev: { current: 1 }, _dirty: { current: true }, _druhSelhani: { current: null },
    SYNC_OK: 'ok', conflict: null, syncErr: null, JSON, Math,
    _shareOf: () => null, syncMarkSave: (version, sig) => { mark = { rev: version, v: version, sig }; }, syncMarkLoad: () => mark, tmDocSig: s => s,
    setConflict: value => { conflict = value; }, setColl: value => { adopted++; coll.current = value; }, saveColl: noop, setEdits: value => { edits.current = value; }, saveEdits: noop,
    oznamSelhani: noop, setDocBytes: noop, setDocLimit: noop, setSyncErr: noop, setSyncPending: noop, setSyncOdlozeno: noop,
    setStateHydrated: noop, COLL_EMPTY: () => ({}),
    setTimeout: (fn, delay) => { if (delay < 8000) timers.push(fn); return timers.length; }, clearTimeout: noop,
    syncFetch: async (path, init = {}) => {
      const response = await api(path, init.method, init.body ? JSON.parse(init.body) : undefined);
      if (path.includes('?meta=1')) {
        metadataReads++;
        if (metadataReads === 1) { started(); await gate; }
        if (metaFailure) return { stav: 503, druh: 'error', telo: null };
      }
      if (path === '/api/state' && (!init.method || init.method === 'GET') && readHook) { const hook = readHook; readHook = null; await hook(); }
      if (path === '/api/state' && (!init.method || init.method === 'GET') && fullReadFailure) return { stav: 503, druh: 'error', telo: null };
      if (init.method === 'PUT') {
        writes.push(response.status);
        if (response.status === 200 && loseNextAcknowledgement) { loseNextAcknowledgement = false; return { stav: 0, druh: 'error', telo: null }; }
      }
      return { stav: response.status, telo: response.body, druh: response.status === 200 ? 'ok' : 'error' };
    },
  };
  ctx._readVer = async () => { const r = await ctx.syncFetch('/api/state?meta=1'); return r.druh === 'ok' ? { ver: r.telo.version } : null; };
  ctx._readServer = async () => { const r = await ctx.syncFetch('/api/state'); return r.druh === 'ok' ? { doc: r.telo.doc, ver: r.telo.version } : null; };
  let run, retry, bootstrap, pendingSnapshot;
  if (client) {
    const start = source.indexOf('  const _documentSyncQueue ='), end = source.indexOf('  const _pushRef', start);
    const actions = vm.runInNewContext(source.slice(start, end) + ';({push:_push,_acknowledgeRemote,_confirmSyncedSnapshot,_pendingSyncSnapshot})', ctx);
    const push = actions.push; Object.assign(ctx, actions); pendingSnapshot = actions._pendingSyncSnapshot;
    run = () => push(); retry = () => push({ force: true });
    ctx._pushRef = { current: push };
    const bootStart = source.indexOf('    const syncOnce = async () => {', end), bootEnd = source.indexOf('    syncOnce();', bootStart);
    bootstrap = vm.runInNewContext('let dead=false, reading=false, gc=null;\n' + source.slice(bootStart, bootEnd) + ';syncOnce', ctx);
  } else {
    const start = source.indexOf('  const _documentSyncQueue ='), end = source.indexOf('  // DVĚ OTEVŘENÉ KARTY', start);
    const actions = vm.runInNewContext(source.slice(start, end) + ';({zkusOdeslat,_handshake,_pendingSyncSnapshot,_acknowledgeRemote,_readDoc,_readMeta,adoptServer})', ctx);
    Object.assign(ctx, actions); pendingSnapshot = actions._pendingSyncSnapshot;
    run = () => { effects[1](); return timers.pop()(); };
    retry = actions.zkusOdeslat;
    bootstrap = actions._handshake;
  }
  const foregroundStart = source.indexOf('    const onVis = async () => {', source.indexOf('  // návrat k záložce · jiné zařízení'));
  const foregroundEnd = source.indexOf('    document.addEventListener("visibilitychange", onVis);', foregroundStart);
  ctx.document = { visibilityState: 'visible' };
  const foreground = vm.runInNewContext(source.slice(foregroundStart, foregroundEnd) + ';onVis', ctx);
  return { run, retry, coll, release, firstRead, writes, localWriter, reads: () => metadataReads, conflict: () => conflict, api,
    recover: () => client ? ctx._pushRef.current({ retry: true }) : retry(),
    foreground, beforeRead: hook => { readHook = hook; }, mark: () => mark, dirty: () => ctx._dirty.current, adopted: () => adopted,
    flushFollowups: async () => { for (let i = 0; timers.length && i < 8; i++) await timers.shift()(); assert.equal(timers.length, 0); },
    bootstrap: async () => { pendingSnapshot.current = null; ctx._syncReady.current = false; ctx._dirty.current = false; await bootstrap(); return ctx._syncReady.current; },
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

test(`${client ? 'Client' : 'Main'}: an unreadable document behind a newer generation cannot trigger a PUT`, async () => {
  const h = await harness({ fullReadFailure: true });
  assert.equal((await h.api('/api/state', 'PUT', { doc: { coll: { draft: 'another device' }, edits: {}, rev: 2 }, baseVersion: 1 })).status, 200);
  const pending = h.run(); await h.firstRead; h.release(); await pending;
  assert.deepEqual(h.writes, []);
  assert.equal((await h.api('/api/state')).body.doc.coll.draft, 'another device');
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

for (const recovery of ['recover', 'foreground', 'bootstrap']) test(`${client ? 'Client' : 'Main'}: ${recovery} recognizes a committed document whose acknowledgement was lost`, async () => {
  const h = await harness({ lostAcknowledgement: true });
  const first = h.run(); await h.firstRead; h.release(); await first;
  const saved = (await h.api('/api/state')).body;
  assert.equal(saved.doc.coll.draft, 'older draft');
  assert.equal(h.mark().v, 1, 'an unconfirmed response does not advance the durable marker');
  await h[recovery]();
  assert.equal(h.conflict(), null);
  assert.equal(h.adopted(), 0, 'acknowledgement must not replace the live document');
  assert.equal(h.mark().v, saved.version);
  assert.equal(h.mark().sig, JSON.stringify({ coll: saved.doc.coll, edits: saved.doc.edits }));
  assert.equal((await h.api('/api/state')).body.version, saved.version, 'acknowledgement alone makes no new commit');
  assert.deepEqual(h.writes, [200]);
});

for (const recovery of ['recover', 'foreground', 'bootstrap']) test(`${client ? 'Client' : 'Main'}: ${recovery} preserves edits made while confirmation is being read`, async () => {
  const h = await harness({ lostAcknowledgement: true });
  const first = h.run(); await h.firstRead; h.release(); await first;
  h.beforeRead(() => { h.coll.current = { draft: 'typed during confirmation' }; });
  await h[recovery]();
  assert.equal(h.conflict(), null);
  assert.equal(h.adopted(), 0);
  assert.equal(h.coll.current.draft, 'typed during confirmation');
  assert.equal(h.dirty(), true);
  assert.equal(JSON.parse(h.mark().sig).coll.draft, 'older draft', 'only the confirmed snapshot is acknowledged');
  await h.flushFollowups();
  assert.equal((await h.api('/api/state')).body.doc.coll.draft, 'typed during confirmation');
  assert.equal(h.dirty(), false);
});

test(`${client ? 'Client' : 'Main'}: a later retry recognizes an earlier own commit while a newer draft is pending`, async () => {
  const h = await harness({ lostAcknowledgement: true });
  const first = h.run(); await h.firstRead; h.release(); await first;
  h.coll.current = { draft: 'newer after network failure' };
  await h.recover();
  assert.equal(h.conflict(), null);
  assert.equal(h.coll.current.draft, 'newer after network failure');
  assert.equal(h.dirty(), true);
  await h.flushFollowups();
  assert.equal((await h.api('/api/state')).body.doc.coll.draft, 'newer after network failure');
});

test(`${client ? 'Client' : 'Main'}: a genuinely different server document after lost acknowledgement remains a conflict`, async () => {
  const h = await harness({ lostAcknowledgement: true });
  const first = h.run(); await h.firstRead; h.release(); await first;
  assert.equal((await h.api('/api/state', 'PUT', { doc: { coll: { draft: 'another device after commit' }, edits: {}, rev: 3 }, baseVersion: 2 })).status, 200);
  await h.recover();
  assert.ok(h.conflict());
  assert.equal(h.coll.current.draft, 'older draft');
  assert.equal((await h.api('/api/state')).body.doc.coll.draft, 'another device after commit');
  assert.deepEqual(h.writes, [200]);
});

if (!client) test('Main: a local document decision blocks a cloud write already waiting for metadata', async () => {
  const h = await harness();
  const pending = h.run(); await h.firstRead;
  h.localWriter.pause(); h.release(); await pending;
  assert.deepEqual(h.writes, []);
  assert.equal((await h.api('/api/state')).body.doc.coll.draft, 'baseline');
  h.localWriter.resume(); await h.retry();
  assert.equal((await h.api('/api/state')).body.doc.coll.draft, 'older draft');
});

if (!client) test('Main: automatic remote adoption rechecks the draft after pending local writes settle', async () => {
  const h = await harness();
  h.coll.current = { draft: 'baseline' };
  assert.equal((await h.api('/api/state', 'PUT', { doc: { coll: { draft: 'another device' }, edits: {}, rev: 2 }, baseVersion: 1 })).status, 200);
  h.localWriter.settled = async () => { h.coll.current = { draft: 'new typing while local storage settles' }; };
  const pending = h.recover(); await h.firstRead; h.release(); await pending;
  assert.equal(h.coll.current.draft, 'new typing while local storage settles');
  assert.ok(h.conflict());
  assert.deepEqual(h.writes, []);
  assert.equal((await h.api('/api/state')).body.doc.coll.draft, 'another device');
});
