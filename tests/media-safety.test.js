import test from 'node:test';
import assert from 'node:assert/strict';
import { uploadMedia, storeAttachment, pinMedia, verifyPinnedMedia, createMediaRecovery } from '../src/shared/product/mediaSafety.js';

const file = () => new File(['original voice'], 'hlas.webm', { type: 'audio/webm' });
test('server quota rejection retains the original and its specific reason locally', async () => {
  const local = new Map();
  const result = await storeAttachment({ file: file(), id: 'voice', putLocal: async (id, blob) => local.set(id, blob),
    upload: (id, blob) => uploadMedia({ id, blob, fetcher: async () => Response.json({ code: 'storage-user-limit' }, { status: 409 }) }) });
  assert.equal(result.cloudBlock, 'storage-user-limit'); assert.equal(result.idb, true); assert.equal(result.r2, undefined);
  assert.equal(await local.get('voice').text(), 'original voice');
});
test('unknown server error strings never become stored attachment metadata', async () => {
  await assert.rejects(uploadMedia({ id: 'voice', blob: file(), fetcher: async () => Response.json({ code: 'untrusted content' }, { status: 500 }) }), { code: 'upload-rejected' });
});
const media = (id, text = 'original voice') => new Response(text, { headers: { 'X-Tanmay-File': id, 'Content-Length': String(new TextEncoder().encode(text).length) } });
for (const [label, reply] of [
  ['HTML 200', () => new Response('<html>Access</html>')], ['negative JSON', () => Response.json({ ok: false, id: 'voice' })],
  ['wrong id', () => Response.json({ ok: true, id: 'different' })], ['missing receipt', () => Response.json({})],
  ['malformed JSON', () => new Response('{', { headers: { 'content-type': 'application/json' } })],
  ['server failure', () => new Response('failed', { status: 503 })],
]) test(`media upload rejects ${label} and retains the local copy`, async () => {
  const blobs = new Map();
  const result = await storeAttachment({ file: file(), id: 'voice', putLocal: async (id, blob) => blobs.set(id, blob),
    upload: (id, blob, name) => uploadMedia({ id, blob, name, fetcher: async () => reply() }) });
  assert.equal(result.idb, true); assert.equal(result.r2, undefined); assert.equal(await blobs.get('voice').text(), 'original voice');
});
test('only a matching JSON receipt confirms cloud media; full disk still permits confirmed cloud upload', async () => {
  const result = await storeAttachment({ file: file(), id: 'voice', putLocal: async () => { throw new Error('quota'); },
    upload: (id, blob, name) => uploadMedia({ id, blob, name, fetcher: async (url, init) => {
      assert.equal(init.redirect, 'manual'); assert.equal(await init.body.text(), 'original voice'); return Response.json({ ok: true, id: 'voice' });
    } }) });
  assert.equal(result.r2, true);
});
test('failure of both stores rejects instead of losing the caller recording', async () => {
  await assert.rejects(storeAttachment({ file: file(), id: 'voice', putLocal: async () => { throw new Error('quota'); }, upload: async () => { throw new Error('offline'); } }), { code: 'media-not-saved' });
});
test('account change during local save cannot upload into the next account', async () => {
  let owner = true, uploads = 0;
  await assert.rejects(storeAttachment({ file: file(), id: 'voice', current: () => owner, putLocal: async () => { owner = false; }, upload: async () => uploads++ }), { code: 'account-changed' });
  assert.equal(uploads, 0);
});
function pinFixture(reply, put = async () => {}) {
  let registry = { entry: ['stale'] }; const cached = new Map();
  return { get registry() { return registry; }, run: () => pinMedia({ entryId: 'entry', ids: ['one', 'two'],
    cache: { put: async (url, response) => { await put(); cached.set(url, response); }, match: async url => cached.get(url)?.clone() },
    fetcher: async url => reply(url.slice(1)), urlFor: id => '/' + id,
    readRegistry: () => registry, saveRegistry: value => { registry = value; } }) };
}
for (const [label, reply, put] of [
  ['network failure', id => { if (id === 'two') throw new Error('network'); return media(id); }],
  ['HTTP 503', () => new Response('failed', { status: 503 })],
  ['HTML fallback', () => new Response('<html>sign in</html>')],
  ['cache quota', id => media(id), async () => { throw new Error('quota'); }],
  ['truncated bytes', id => new Response('x', { headers: { 'X-Tanmay-File': id, 'Content-Length': '20' } })],
]) test(`offline pin never marks success after ${label}`, async () => {
  const fixture = pinFixture(reply, put); await assert.rejects(fixture.run()); assert.equal(fixture.registry.entry, undefined);
});
test('offline pin verifies every file before storing its marker', async () => {
  const fixture = pinFixture(id => media(id)); assert.equal(await fixture.run(), 2); assert.deepEqual(fixture.registry.entry, ['one', 'two']);
});
test('pin can use an unsent local recording without internet', async () => {
  const cache = new Map(); let registry = {};
  await pinMedia({ entryId: 'entry', ids: ['voice'], getLocalFile: async () => file(),
    fetcher: async () => { throw new Error('must not fetch'); }, urlFor: id => '/' + id,
    cache: { put: async (key, value) => cache.set(key, value), match: async key => cache.get(key).clone() },
    readRegistry: () => registry, saveRegistry: value => { registry = value; } });
  assert.deepEqual(registry.entry, ['voice']);
});
test('media retry survives success and resumes new attachments, without overlapping runs', async () => {
  const win = new EventTarget(), doc = new EventTarget(); doc.visibilityState = 'visible';
  const timers = new Map(); let key = 0, calls = 0, pending, online = true;
  const stop = createMediaRecovery({ win, doc, online: () => online,
    schedule: (run, delay) => { timers.set(++key, { run, delay }); return key; }, cancel: id => timers.delete(id),
    retry: async () => { calls++; if (calls === 2) await new Promise(resolve => { pending = resolve; }); return { cekalo: 1, nahrano: 1 }; } });
  const first = [...timers.values()][0]; timers.clear(); await first.run(); await new Promise(resolve => setImmediate(resolve));
  assert.equal(calls, 1); win.dispatchEvent(new Event('tm-media-pending'));
  assert.equal(calls, 1); assert.equal([...timers.values()][0].delay, 1500);
  win.dispatchEvent(new Event('focus')); win.dispatchEvent(new Event('tm-media-pending')); assert.equal(calls, 2);
  pending(); await new Promise(resolve => setImmediate(resolve)); assert.equal(calls, 2); assert.equal(timers.size, 1);
  online = false; win.dispatchEvent(new Event('online')); assert.equal(calls, 2);
  stop(); online = true; win.dispatchEvent(new Event('focus')); assert.equal(calls, 2); assert.equal(timers.size, 0);
});
test('an evicted or truncated offline copy clears its verified status', async () => {
  let reply = media('voice');
  const options = { ids: ['voice'], cache: { match: async () => reply?.clone() }, urlFor: id => '/' + id };
  assert.equal(await verifyPinnedMedia(options), true);
  reply = undefined; assert.equal(await verifyPinnedMedia(options), false);
  reply = new Response('x', { headers: { 'X-Tanmay-File': 'voice', 'Content-Length': '200' } });
  assert.equal(await verifyPinnedMedia(options), false);
  assert.equal(await verifyPinnedMedia({ ...options, current: () => false }), false);
});
