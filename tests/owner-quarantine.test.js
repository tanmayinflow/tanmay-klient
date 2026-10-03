import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
const source = app.slice(app.indexOf('async function ownerQuarantine'), app.indexOf('const clientAccount'));
test('repeated account switches keep each unrecovered document and pinned-media archive', async () => {
  const values = new Map(), stores = new Map();
  const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
  const caches = {
    keys: async () => [...stores.keys()], delete: async key => stores.delete(key),
    open: async key => { if (!stores.has(key)) stores.set(key, new Map()); const data = stores.get(key); return { keys: async () => [...data.keys()], match: async request => data.get(request), put: async (request, response) => data.set(request, response) }; },
  };
  const quarantine = vm.runInNewContext(`${source};ownerQuarantine`, { window: { localStorage: storage }, caches, LS_COLL: 'coll', LS_KEY: 'edits', LS_SYNCED: 'synced', APPEARANCE_KEYS: [] });
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
