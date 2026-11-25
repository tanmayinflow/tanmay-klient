import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import worker from '../worker/index.js';
import { makeEnv, req } from './helpers/env.js';
import { createDocumentSyncQueue } from '../src/shared/product/documentSyncQueue.js';
import { acknowledgedServerSnapshot, bootstrapSyncDecision } from '../src/shared/product/bootstrapSync.js';
import { createLocalDocumentWriter } from '../src/shared/product/localPersistence.js';

const source = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
const client = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).name === 'tanmay-klient';
const noop = () => {};

async function fixture() {
  const email = 'cross-tab@example.test', env = makeEnv({ OWNER_EMAIL: email });
  const api = async (path, method = 'GET', body) => {
    const response = await worker.fetch(req(path, { email, method, body }), env);
    return { stav: response.status, telo: await response.json(), druh: response.ok ? 'ok' : 'error' };
  };
  if (client) await api('/api/join', 'POST', { word: 'otevri se' });
  const baseline = { coll: { draft: 'confirmed baseline' }, edits: {}, rev: 1 };
  assert.equal((await api('/api/state', 'PUT', { doc: baseline, baseVersion: 0 })).stav, 200);
  const serialize = (coll, edits) => JSON.stringify({ coll, edits });
  const storage = new Map([['coll', JSON.stringify(baseline.coll)], ['edits', '{}']]);
  const coll = { current: baseline.coll }, edits = { current: {} }, writes = [], effects = [], timers = [];
  let conflict = null, offline = false, mark = null, currentOwner = true;
  const writer = createLocalDocumentWriter({ getStorage: () => ({ setItem: noop }) });
  const ctx = {
    React: { useRef: current => ({ current }), useCallback: fn => fn, useEffect: fn => effects.push(fn) },
    createDocumentSyncQueue, acknowledgedServerSnapshot, bootstrapSyncDecision,
    TM_LOCAL_WRITER: writer, TM_W: {}, mainDocuments: { getItem: key => storage.get(key), refresh: async () => {} },
    _localStorageDecision: { current: false }, _syncReady: { current: true },
    _collRef: coll, _editsRef: edits, coll: coll.current, edits: edits.current,
    _serializeDoc: serialize, _lastSynced: { current: serialize(baseline.coll, {}) }, _dirty: { current: false },
    _ver: { current: 1 }, _rev: { current: 1 }, _druhSelhani: { current: null },
    clientAccount: { isCurrent: () => currentOwner }, ownerId: 'owner', ownerLoad: () => 'owner',
    LS_COLL: 'coll', LS_KEY: 'edits', window: { localStorage: { getItem: key => storage.get(key) } },
    conflict: null, syncErr: null, SYNC_OK: 'ok', JSON, Math,
    setColl: value => { coll.current = value; }, setEdits: value => { edits.current = value; },
    setConflict: value => { conflict = value; }, setSyncPending: noop, setSyncErr: noop, setSyncOdlozeno: noop,
    setDocBytes: noop, setDocLimit: noop, saveColl: noop, saveEdits: noop, oznamSelhani: noop, tmSaveFailed: noop,
    _shareOf: () => null, syncMarkSave: (version, sig) => { mark = { version, sig }; }, tmDocSig: value => value,
    setTimeout: fn => { timers.push(fn); return timers.length; }, clearTimeout: noop,
    syncFetch: async (path, init = {}) => {
      if (offline) return { stav: 0, telo: null, druh: 'error' };
      if (init.method === 'PUT') writes.push(JSON.parse(init.body));
      return api(path, init.method, init.body ? JSON.parse(init.body) : undefined);
    },
  };
  ctx._readVer = async () => { const result = await ctx.syncFetch('/api/state?meta=1'); return result.druh === 'ok' ? { ver: result.telo.version } : null; };
  ctx._readServer = async () => { const result = await ctx.syncFetch('/api/state'); return result.druh === 'ok' ? { doc: result.telo.doc, ver: result.telo.version } : null; };
  const start = source.indexOf('  const _documentSyncQueue =');
  const end = source.indexOf(client ? '  const _pushRef' : '  // DVĚ OTEVŘENÉ KARTY', start);
  const actions = vm.runInNewContext(source.slice(start, end) + (client ? ';({run:_push})' : ';({run:zkusOdeslat,_resumeLocalWrites})'), ctx);
  Object.assign(ctx, actions);
  const listenerStart = source.indexOf(client ? '    const onStorage = (e) => {' : '    const onStorage = async (e) => {', end);
  const listenerEnd = source.indexOf('    window.addEventListener("storage", onStorage);', listenerStart);
  const listen = vm.runInNewContext('let closed=false, observation=0;\n' + source.slice(listenerStart, listenerEnd) + ';onStorage', ctx);
  return {
    ctx, coll, writes, api, run: actions.run, baseline: ctx._lastSynced.current,
    conflict: () => conflict, mark: () => mark, offline: value => { offline = value; },
    ownerChanged: () => { currentOwner = false; },
    local: value => { coll.current = value; ctx._dirty.current = true; },
    receive: async (draft = 'written in the other tab') => {
      storage.set('coll', JSON.stringify({ draft }));
      await listen({ type: 'storage', key: 'coll', newValue: storage.get('coll') });
    },
  };
}

test('another tab closing before its debounce does not leave a falsely acknowledged local draft', async () => {
  const h = await fixture();
  await h.receive();
  assert.equal(h.coll.current.draft, 'written in the other tab');
  assert.equal(h.ctx._lastSynced.current, h.baseline, 'a local event is not a server receipt');
  assert.equal(h.ctx._dirty.current, true);
  await h.run();
  assert.equal((await h.api('/api/state')).telo.doc.coll.draft, 'written in the other tab');
  assert.equal(h.writes.length, 1);
  assert.equal(h.ctx._dirty.current, false);
});

test('an adopted local draft survives offline sync and is sent after reconnection', async () => {
  const h = await fixture();
  await h.receive(); h.offline(true);
  await h.run();
  assert.equal(h.writes.length, 0);
  assert.equal(h.ctx._dirty.current, true);
  assert.equal(h.ctx._lastSynced.current, h.baseline);
  h.offline(false); await h.run();
  assert.equal((await h.api('/api/state')).telo.doc.coll.draft, 'written in the other tab');
});

test('the other tab already committing the same draft is acknowledged without a duplicate write or conflict', async () => {
  const h = await fixture();
  await h.receive();
  assert.equal((await h.api('/api/state', 'PUT', { doc: { coll: h.coll.current, edits: {}, rev: 2 }, baseVersion: 1 })).stav, 200);
  await h.run();
  assert.equal(h.writes.length, 0);
  assert.equal(h.conflict(), null);
  assert.equal(h.ctx._dirty.current, false);
  assert.equal(h.mark().version, 2);
});

test('a genuine unsent draft in both tabs remains a conflict and neither local version is silently overwritten', async () => {
  const h = await fixture();
  h.local({ draft: 'this tab has unsent work' });
  await h.receive();
  assert.equal(h.coll.current.draft, 'this tab has unsent work');
  assert.equal(h.conflict().doc.coll.draft, 'written in the other tab');
  assert.equal(h.conflict().karta, true);
  assert.equal(h.ctx._lastSynced.current, h.baseline);
  assert.equal(h.writes.length, 0);
});

test('a genuinely different newer server document remains a conflict after local adoption', async () => {
  const h = await fixture();
  await h.receive();
  assert.equal((await h.api('/api/state', 'PUT', { doc: { coll: { draft: 'another device' }, edits: {}, rev: 2 }, baseVersion: 1 })).stav, 200);
  await h.run();
  assert.equal(h.conflict().doc.coll.draft, 'another device');
  assert.equal(h.writes.length, 0);
  assert.equal(h.coll.current.draft, 'written in the other tab');
});
