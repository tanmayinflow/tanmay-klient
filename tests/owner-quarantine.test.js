import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { createLocalDocumentWriter } from '../src/shared/product/localPersistence.js';
const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
const source = app.slice(app.indexOf('async function ownerQuarantine'), app.indexOf('const clientAccount'));
test('repeated account switches keep each unrecovered document and pinned-media archive', async () => {
  const values = new Map(), stores = new Map();
  const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
  const caches = {
    keys: async () => [...stores.keys()], delete: async key => stores.delete(key),
    open: async key => { if (!stores.has(key)) stores.set(key, new Map()); const data = stores.get(key); return { keys: async () => [...data.keys()], match: async request => data.get(request), put: async (request, response) => data.set(request, response) }; },
  };
  const writer = createLocalDocumentWriter({ getStorage: () => storage });
  const quarantine = vm.runInNewContext(`${source};ownerQuarantine`, { window: { localStorage: storage }, caches, LS_COLL: 'coll', LS_KEY: 'edits', LS_SYNCED: 'synced', APPEARANCE_KEYS: [], TM_LOCAL_WRITER: writer });
  values.set('coll', 'first unsynced draft'); stores.set('pinned', new Map([['/api/files/first', 'first voice']]));
  await quarantine('account-a');
  values.set('coll', 'later draft'); stores.set('pinned', new Map([['/api/files/second', 'second voice']]));
  await quarantine('account-a');
  assert.deepEqual([...values.entries()].filter(([key]) => key.startsWith('coll__owner_account-a')).map(([, value]) => value).sort(), ['first unsynced draft', 'later draft']);
  const archivedFiles = [...stores.entries()].filter(([key]) => key.startsWith('pinned__owner_account-a')).flatMap(([, data]) => [...data.values()]);
  assert.deepEqual(archivedFiles.sort(), ['first voice', 'second voice']);
  assert.equal(values.has('coll'), false);
  assert.equal(stores.has('pinned'), false);
});

test('account switch waits while a newer local document has failed to save', async () => {
  const values = new Map([['coll', 'saved original']]);
  const storage = { getItem: key => values.get(key) ?? null, setItem() { throw new DOMException('quota', 'QuotaExceededError'); }, removeItem: key => values.delete(key) };
  const writer = createLocalDocumentWriter({ getStorage: () => storage });
  writer.write('coll', { draft: 'unsaved newer edit' }, 'coll');
  const quarantine = vm.runInNewContext(`${source};ownerQuarantine`, { window: { localStorage: storage }, LS_COLL: 'coll', LS_KEY: 'edits', LS_SYNCED: 'synced', APPEARANCE_KEYS: [], TM_LOCAL_WRITER: writer });
  await assert.rejects(quarantine('account-a'), /UnsavedLocalChanges/);
  assert.equal(values.get('coll'), 'saved original');
  assert.equal(writer.currentFailure().kind, 'quota');
});
