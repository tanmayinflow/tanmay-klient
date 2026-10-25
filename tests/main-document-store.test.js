import test from 'node:test';
import assert from 'node:assert/strict';
import { createMainDocumentStore, MAIN_DOCUMENT_KEYS as K } from '../src/shared/product/mainDocumentStore.js';
function memory(initial = {}) { const data = new Map(Object.entries(initial)); return { limit: Infinity, getItem: key => data.get(key) ?? null, setItem(key, value) { const next = new Map(data); next.set(key, String(value)); if ([...next.values()].reduce((a, b) => a + b.length, 0) > this.limit) throw new DOMException('full', 'QuotaExceededError'); data.set(key, String(value)); }, removeItem: key => data.delete(key) }; }
function durable(initial = null) { let raw = initial; const archives = []; return { archives, read: async () => raw, async commit(expected, next, archive) { if (raw !== expected) return false; if (archive) archives.push(structuredClone(archive)); raw = next; return true; } }; }
const initial = () => ({ [K.coll]: '{"journal":[{"text":"synthetic prior"}]}', [K.edits]: '{"2026-10-25":{"done":true}}' });
const store = (storage, backend, onChange) => createMainDocumentStore({ getStorage: () => storage, backend, onChange });

test('inactive cache reads current legacy values and no API permits ordinary startup', async () => {
  const storage = memory(initial()), docs = createMainDocumentStore({ getStorage: () => storage, getDatabase: () => undefined });
  await docs.initialize(); storage.setItem(K.edits, '{"later":true}');
  assert.equal(docs.getItem(K.edits), '{"later":true}'); assert.equal(docs.isActive(), false);
  await assert.rejects(docs.save({ coll: '{"new":true}' }), { name: 'DocumentStorageUnavailable' });
});
test('denied IDB discovery fails closed before any fresh app can render', async () => {
  const storage = memory(initial()), docs = createMainDocumentStore({ getStorage: () => storage, getDatabase() { throw new DOMException('denied', 'SecurityError'); } });
  await assert.rejects(docs.initialize(), { name: 'SecurityError' });
  assert.throws(() => docs.getItem(K.coll), { name: 'DocumentStorageNotReady' });
});
test('oversize pair migrates atomically, keeps legacy exact and survives recreation', async () => {
  const storage = memory(initial()), backend = durable(), docs = store(storage, backend), original = initial();
  await docs.initialize(); storage.limit = 100;
  const large = JSON.stringify({ synthetic: 'x'.repeat(3_100_000) });
  await docs.save([[K.coll, large]]);
  assert.equal(docs.isActive(), true); assert.equal(docs.getItem(K.coll), large);
  assert.equal(storage.getItem(K.coll), original[K.coll]); assert.equal(storage.getItem(K.edits), original[K.edits]);
  const reopened = store(storage, backend); await reopened.initialize();
  assert.equal(reopened.getItem(K.coll), large); assert.equal(reopened.getItem(K.edits), original[K.edits]);
});
test('sequential queued writes merge the complete pair and latest value wins', async () => {
  const storage = memory(initial()), backend = durable(), docs = store(storage, backend); await docs.initialize();
  await Promise.all([docs.save({ coll: '{"v":1}' }), docs.save({ edits: '{"newDay":true}' }), docs.save({ coll: '{"v":2}' })]);
  assert.equal(docs.getItem(K.coll), '{"v":2}'); assert.equal(docs.getItem(K.edits), '{"newDay":true}');
  assert.equal(JSON.parse(await backend.read()).revision, 3);
});
test('another new tab cannot overwrite a revision it has not loaded', async () => {
  const storage = memory(initial()), backend = durable(), one = store(storage, backend), events = [], two = store(storage, backend, event => events.push(event));
  await one.initialize(); await one.save({ coll: '{"v":1}' }); await two.initialize(); await one.save({ coll: '{"v":2}' });
  await assert.rejects(two.save({ coll: '{"stale":true}' }), { name: 'DocumentRevisionConflict' });
  assert.equal(JSON.parse(await backend.read()).pair.coll, '{"v":2}'); assert.equal(two.getItem(K.coll), '{"v":1}');
  assert.equal(events.at(-1).type, 'conflict'); await two.refresh(); assert.equal(two.getItem(K.coll), '{"v":2}');
});
test('old-tab branch blocks boot and preserves both pairs before durable choice', async () => {
  const storage = memory(initial()), backend = durable(), docs = store(storage, backend); await docs.initialize(); await docs.save({ coll: '{"newBundle":true}' });
  storage.setItem(K.coll, '{"oldBundle":true}'); const reopened = store(storage, backend);
  await assert.rejects(reopened.initialize(), error => error.name === 'DocumentBranchConflict' && error.durable.coll === '{"newBundle":true}' && error.legacy.coll === '{"oldBundle":true}');
  await reopened.resolveBranch('durable');
  assert.equal(reopened.getItem(K.coll), '{"newBundle":true}'); assert.equal(storage.getItem(K.coll), '{"oldBundle":true}');
  assert.equal(backend.archives.length, 1); assert.equal(backend.archives[0].durable.coll, '{"newBundle":true}'); assert.equal(backend.archives[0].legacy.coll, '{"oldBundle":true}');
  const third = store(storage, backend); await third.initialize(); assert.equal(third.getItem(K.coll), '{"newBundle":true}');
});
test('legacy branch choice preserves durable data in archive and becomes reloadable', async () => {
  const storage = memory(initial()), backend = durable(), docs = store(storage, backend); await docs.initialize(); await docs.save({ coll: '{"durable":true}' });
  storage.setItem(K.coll, '{"legacy":true}'); await assert.rejects(docs.refresh(), { name: 'DocumentBranchConflict' }); await docs.resolveBranch('legacy');
  assert.equal(docs.getItem(K.coll), '{"legacy":true}'); assert.equal(backend.archives[0].durable.coll, '{"durable":true}');
});
test('a changed branch after presenting choice is rejected before storing an unseen choice', async () => {
  const storage = memory(initial()), backend = durable(), docs = store(storage, backend); await docs.initialize(); await docs.save({ coll: '{"durable":true}' });
  storage.setItem(K.coll, '{"legacy":1}'); await assert.rejects(docs.refresh(), { name: 'DocumentBranchConflict' }); const before = await backend.read();
  storage.setItem(K.coll, '{"legacy":2}'); await assert.rejects(docs.resolveBranch('legacy'), { name: 'DocumentBranchConflict' });
  assert.equal(await backend.read(), before); assert.equal(backend.archives.length, 0);
});
test('late old-tab write after first IDB commit keeps candidate and old branch without advancing cache', async () => {
  const storage = memory(initial()), backend = durable(), read = backend.read, docs = store(storage, backend); await docs.initialize(); let calls = 0;
  backend.read = async () => { if (++calls === 1) storage.setItem(K.coll, '{"lateOld":true}'); return read(); };
  await assert.rejects(docs.save({ coll: '{"candidate":true}' }), { name: 'DocumentBranchConflict' });
  assert.equal(JSON.parse(await read()).pair.coll, '{"candidate":true}'); assert.equal(storage.getItem(K.coll), '{"lateOld":true}');
  await docs.resolveBranch('durable'); assert.equal(docs.getItem(K.coll), '{"candidate":true}');
});
test('a failed readback never advances the acknowledged cache', async () => {
  const storage = memory(initial()), backend = durable(), docs = store(storage, backend); await docs.initialize(); const old = docs.getItem(K.coll);
  backend.read = async () => { throw new DOMException('denied', 'SecurityError'); };
  await assert.rejects(docs.save({ coll: '{"candidate":true}' }), { name: 'SecurityError' });
  assert.equal(docs.getItem(K.coll), old); assert.equal(storage.getItem(K.coll), old);
});
test('failed commit leaves both legacy documents and cache intact', async () => {
  const storage = memory(initial()), backend = durable(), docs = store(storage, backend); await docs.initialize(); backend.commit = async () => { throw new DOMException('full', 'QuotaExceededError'); };
  await assert.rejects(docs.save({ coll: '{"candidate":true}' }), { name: 'QuotaExceededError' });
  assert.equal(docs.getItem(K.coll), initial()[K.coll]); assert.equal(await backend.read(), null);
});
test('restorePair changes both durable documents together and survives reload', async () => {
  const storage = memory(initial()), backend = durable(), docs = store(storage, backend); await docs.initialize(); await docs.save({ coll: '{"current":true}' });
  await docs.restorePair({ coll: '{"restored":true}', edits: '{"restoredDay":true}' });
  const fresh = store(storage, backend); await fresh.initialize(); assert.equal(fresh.getItem(K.coll), '{"restored":true}'); assert.equal(fresh.getItem(K.edits), '{"restoredDay":true}');
});
test('malformed stored durable record is not treated as missing or replaced', async () => {
  const storage = memory(initial()), backend = durable('{"format":"future"}'), docs = store(storage, backend);
  await assert.rejects(docs.initialize(), { name: 'InvalidDocumentStorage' }); assert.equal(await backend.read(), '{"format":"future"}');
});
test('malformed attempted document is rejected before commit', async () => {
  const storage = memory(initial()), backend = durable(), docs = store(storage, backend); await docs.initialize();
  for (const coll of ['null', '[]', '{']) await assert.rejects(docs.save({ coll }));
  assert.equal(await backend.read(), null);
});

test('refresh branch rejection never emits another refresh-triggering conflict notification', async () => {
  const storage = memory(initial()), backend = durable(), events = [], docs = store(storage, backend, event => events.push(event));
  await docs.initialize(); await docs.save({ coll: '{"durable":true}' }); events.length = 0;
  storage.setItem(K.coll, '{"legacy":true}');
  await assert.rejects(docs.refresh(), { name: 'DocumentBranchConflict' });
  await assert.rejects(docs.refresh(), { name: 'DocumentBranchConflict' });
  assert.equal(events.length, 0);
  const bootEvents = [], fresh = store(storage, backend, event => bootEvents.push(event));
  await assert.rejects(fresh.initialize(), { name: 'DocumentBranchConflict' }); assert.equal(bootEvents.length, 0);
});

test('save conflict emits once even when its handler immediately refreshes', async () => {
  const storage = memory(initial()), backend = durable(), events = []; let refresh;
  const docs = store(storage, backend, event => { if (event.type === 'conflict') { events.push(event); refresh = docs.refresh().catch(error => error); } });
  await docs.initialize(); await docs.save({ coll: '{"durable":true}' }); storage.setItem(K.coll, '{"legacy":true}');
  await assert.rejects(docs.save({ coll: '{"pending":true}' }), { name: 'DocumentBranchConflict' });
  assert.equal((await refresh).name, 'DocumentBranchConflict'); assert.equal(events.length, 1);
});

test('refresh followed by a previously based queued write cannot borrow the external revision', async () => {
  const storage = memory(initial()), backend = durable(), one = store(storage, backend), two = store(storage, backend);
  await one.initialize(); await one.save({ coll: '{"v":1}' }); await two.initialize(); await one.save({ coll: '{"external":2}' });
  const reading = two.refresh(), writing = two.save({ coll: '{"stale":1}' });
  await Promise.all([reading, assert.rejects(writing, { name: 'DocumentRevisionConflict' })]);
  assert.equal(JSON.parse(await backend.read()).pair.coll, '{"external":2}');
  assert.equal(two.getItem(K.coll), '{"external":2}');
  // Only after App accepts/resolves the refreshed view may it resume submissions.
  await two.save({ coll: '{"acceptedEdit":3}' }); assert.equal(two.getItem(K.coll), '{"acceptedEdit":3}');
});

test('in-flight stale commit rejects before a queued refresh adopts the other tab', async () => {
  const storage = memory(initial()), backend = durable(), one = store(storage, backend), two = store(storage, backend);
  await one.initialize(); await one.save({ coll: '{"v":1}' }); await two.initialize();
  const commit = backend.commit; let release, began; const gate = new Promise(resolve => { release = resolve; }); const started = new Promise(resolve => { began = resolve; }); let intercept = true;
  backend.commit = async (...args) => { if (intercept) { intercept = false; began(); await gate; } return commit(...args); };
  const pending = one.save({ coll: '{"stalePending":true}' }); const rejection = assert.rejects(pending, { name: 'DocumentRevisionConflict' });
  await started; const refreshing = one.refresh(); await two.save({ coll: '{"external":true}' }); release();
  await Promise.all([rejection, refreshing]); assert.equal(one.getItem(K.coll), '{"external":true}');
});

test('explicit branch-choice failure is returned without emitting a refresh loop', async () => {
  const storage = memory(initial()), backend = durable(), events = [], docs = store(storage, backend, event => events.push(event));
  await docs.initialize(); await docs.save({ coll: '{"durable":true}' }); storage.setItem(K.coll, '{"legacy":1}'); await assert.rejects(docs.refresh()); events.length = 0;
  backend.commit = async () => false;
  await assert.rejects(docs.resolveBranch('legacy'), { name: 'DocumentRevisionConflict' }); assert.equal(events.length, 0);
  storage.setItem(K.coll, '{"legacy":2}');
  await assert.rejects(docs.resolveBranch('legacy'), { name: 'DocumentBranchConflict' }); assert.equal(events.length, 0);
});

test('legacy snapshot with missing or empty edits preserves current daily records', async () => {
  const storage = memory(initial()), backend = durable(), docs = store(storage, backend); await docs.initialize(); await docs.save({ coll: '{"current":true}' });
  await docs.restorePair({ coll: '{"older":1}' }); assert.equal(docs.getItem(K.coll), '{"older":1}'); assert.equal(docs.getItem(K.edits), initial()[K.edits]);
  await docs.restorePair({ coll: '{"older":2}', edits: '' });
  const fresh = store(storage, backend); await fresh.initialize(); assert.equal(fresh.getItem(K.coll), '{"older":2}'); assert.equal(fresh.getItem(K.edits), initial()[K.edits]);
});

test('empty snapshot is a no-op and does not migrate or revise either document', async () => {
  const storage = memory(initial()), backend = durable(), docs = store(storage, backend); await docs.initialize();
  await docs.restorePair({ coll: '', edits: '' }); assert.equal(await backend.read(), null); assert.equal(docs.isActive(), false);
  await docs.save({ coll: '{"current":true}' }); const before = await backend.read();
  await docs.restorePair({}); assert.equal(await backend.read(), before); assert.equal(docs.getItem(K.coll), '{"current":true}'); assert.equal(docs.getItem(K.edits), initial()[K.edits]);
});

test('nonempty malformed partial restore is rejected before either durable field changes', async () => {
  const storage = memory(initial()), backend = durable(), docs = store(storage, backend); await docs.initialize(); await docs.save({ coll: '{"current":true}' }); const before = await backend.read();
  for (const edits of ['null', '[]', '{', 42]) await assert.rejects(docs.restorePair({ edits }));
  assert.equal(await backend.read(), before); assert.equal(docs.getItem(K.coll), '{"current":true}'); assert.equal(docs.getItem(K.edits), initial()[K.edits]);
});
