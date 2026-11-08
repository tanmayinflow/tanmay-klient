import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { stateTransportFetch, STATE_TRANSFER_LIMIT, STATE_TRANSFER_PART_BYTES } from '../src/shared/product/stateTransportClient.js';
import { syncFetch, syncDruh, SYNC_OK, SYNC_SERVER, SYNC_PRIHLASENI, SYNC_CLENSTVI } from '../src/shared/product/sync.js';

const bytes = value => Buffer.byteLength(value, 'utf8');
const sha = value => createHash('sha256').update(value).digest('hex');
const reply = (body, status = 200) => Response.json(body, { status });
const pause = () => new Promise(resolve => setImmediate(resolve));
const document = value => ({ coll: { notes: value }, edits: {}, rev: 19 });

// This fixture speaks the wire protocol without importing server internals. It
// exposes the committed value separately, so interrupted uploads cannot look saved.
function server(initial = document('original'), { legacy = false, intercept } = {}) {
  let committed = JSON.stringify(initial), version = 7, manifest, slices, upload, active = 0, peak = 0;
  const calls = [];
  const prepare = () => {
    const points = Array.from(committed); slices = []; const chunks = [];
    for (let offset = 0; offset < points.length; offset += 32768) {
      const data = points.slice(offset, offset + 32768).join('');
      chunks.push({ part: 0, offset: offset + 1, length: Math.min(32768, points.length - offset) });
      slices.push(data);
    }
    manifest = { ok: true, meta: true, transport: 'chunks', version, updated_at: 12345, rev: 19, bytes: bytes(committed), sha256: legacy ? null : sha(committed), chunks, limit: STATE_TRANSFER_LIMIT, safe: STATE_TRANSFER_LIMIT, empty: false };
  };
  prepare();
  const fetcher = async (path, options = {}) => {
    const url = new URL(path, 'https://example.test'), action = url.searchParams.get('action') || (url.searchParams.has('meta') ? 'meta' : 'unexpected');
    const body = options.body ? JSON.parse(options.body) : null;
    calls.push({ path, options, action, body });
    const custom = await intercept?.({ action, body, url, options, manifest, slices, calls });
    if (custom) return custom;
    if (action === 'meta') return reply({ ok: true, meta: true, version });
    if (action === 'manifest') return reply(manifest);
    if (action === 'read') {
      active++; peak = Math.max(peak, active); await pause(); active--;
      const offset = Number(url.searchParams.get('offset'));
      const part = Number(url.searchParams.get('part'));
      assert.equal(Number(url.searchParams.get('version')), version);
      assert.equal(part, 0);
      return reply({ ok: true, version, part, offset, data: slices[(offset - 1) / 32768] });
    }
    if (action === 'start') {
      assert.equal(body.baseVersion, version);
      upload = { ...body, chunks: [] };
      return reply({ ok: true, uploadId: 'test-upload' });
    }
    if (action === 'part') {
      assert.equal(body.uploadId, 'test-upload');
      assert.equal(body.sha256, sha(body.data));
      assert.ok(bytes(body.data) <= STATE_TRANSFER_PART_BYTES);
      upload.chunks[body.part] = body.data;
      return reply({ ok: true, part: body.part });
    }
    if (action === 'commit') {
      assert.equal(upload.chunks.length, upload.parts);
      const data = upload.chunks.join('');
      assert.equal(bytes(data), upload.bytes); assert.equal(sha(data), upload.sha256);
      JSON.parse(data); committed = data; version++; prepare();
      return reply({ ok: true, version, updated_at: 12346, bytes: bytes(committed), limit: STATE_TRANSFER_LIMIT, safe: STATE_TRANSFER_LIMIT });
    }
    throw new Error(`Unexpected request: ${path}`);
  };
  return { fetcher, calls, get value() { return JSON.parse(committed); }, get peak() { return peak; } };
}

test('a near-10 MB Unicode document uploads and reads in bounded requests without losing any characters', async () => {
  const doc = document('Příliš žluťoučký kůň 🧘🏽‍♂️\n'.repeat(204000));
  assert.ok(bytes(JSON.stringify(doc)) > 9_000_000);
  assert.ok(bytes(JSON.stringify(doc)) <= STATE_TRANSFER_LIMIT);
  const s = server();
  const saved = await stateTransportFetch('/api/state', { method: 'PUT', body: JSON.stringify({ doc, baseVersion: 7 }) }, s.fetcher);
  assert.equal(saved.status, 200); assert.equal((await saved.json()).version, 8);
  assert.deepEqual(s.value, doc);
  assert.ok(s.calls.filter(call => call.action === 'part').length > 40);
  const loaded = await stateTransportFetch('/api/state', {}, s.fetcher);
  assert.deepEqual((await loaded.json()).doc, doc);
  assert.equal(s.peak, 4);
  assert.equal(s.calls.some(call => call.action === 'unexpected'), false);
});

test('a legacy manifest still checks bytes and reconstructs multi-byte text', async () => {
  const doc = document('😀á'.repeat(40000)), s = server(doc, { legacy: true });
  const response = await stateTransportFetch('/api/state', {}, s.fetcher);
  assert.deepEqual((await response.json()).doc, doc);
});

test('Main obtains a version before starting; client sharing and enabled modules remain bounded metadata', async () => {
  const doc = { coll: { modules: ['prameny', 'klienti', 'denik'], memento: { zapnuto: true } }, rev: 42 }, s = server();
  const share = { habits: true, training: false };
  const response = await stateTransportFetch('/api/state', { method: 'PUT', body: JSON.stringify({ doc, share }) }, s.fetcher);
  assert.equal(response.status, 200);
  assert.deepEqual(s.calls.map(call => call.action), ['meta', 'start', 'part', 'commit']);
  const start = s.calls[1].body;
  assert.equal(start.baseVersion, 7); assert.equal(start.rev, 42); assert.deepEqual(start.share, share);
  assert.deepEqual(start.modules, ['prameny', 'denik', 'memento']);
  assert.equal(Object.hasOwn(start, 'doc'), false);
});

test('failed or aborted part upload never commits or acknowledges the local draft', async () => {
  for (const mode of ['http', 'abort', 'network']) {
    const controller = new AbortController(), original = document('server data'), doc = document('č'.repeat(300000));
    const s = server(original, { intercept: ({ action, body }) => {
      if (action !== 'part' || body.part !== 1) return;
      if (mode === 'abort') controller.abort();
      if (mode === 'network') throw new TypeError('Network disconnected');
      return reply({ ok: false, code: 'temporary' }, 503);
    } });
    const promise = stateTransportFetch('/api/state', { method: 'PUT', signal: controller.signal, body: JSON.stringify({ doc, baseVersion: 7 }) }, s.fetcher);
    if (mode === 'http') assert.equal((await promise).status, 503);
    else await assert.rejects(promise, mode === 'abort' ? { name: 'AbortError' } : { name: 'TypeError' });
    assert.deepEqual(s.value, original);
    assert.deepEqual(doc.coll.notes, 'č'.repeat(300000));
    assert.equal(s.calls.some(call => call.action === 'commit'), false);
    assert.equal(s.calls.filter(call => call.action === 'part' && call.body.part === 0).length, 1);
    assert.equal(s.calls.filter(call => call.action === 'part' && call.body.part === 1).length, mode === 'abort' ? 1 : 3);
  }
});

test('a successful final part is not a save acknowledgement while commit is pending', async () => {
  let release, entered;
  const pending = new Promise(resolve => { entered = resolve; });
  const s = server(undefined, { intercept: async ({ action }) => {
    if (action === 'commit') { entered(); await new Promise(resolve => { release = resolve; }); }
  } });
  let settled = false;
  const saving = stateTransportFetch('/api/state', { method: 'PUT', body: JSON.stringify({ doc: document('new'), baseVersion: 7 }) }, s.fetcher).then(value => { settled = true; return value; });
  await pending; assert.equal(settled, false); assert.equal(s.value.coll.notes, 'original');
  release(); assert.equal((await saving).status, 200);
});

test('commit conflicts and invalid receipts never become a successful acknowledgement', async () => {
  for (const receipt of [reply({ ok: false, code: 'conflict', version: 8 }, 409), reply({ ok: true, version: 99, bytes: 1 })]) {
    const s = server(undefined, { intercept: ({ action }) => action === 'commit' ? receipt : undefined });
    const response = await stateTransportFetch('/api/state', { method: 'PUT', body: JSON.stringify({ doc: document('new'), baseVersion: 7 }) }, s.fetcher);
    assert.ok([409, 502].includes(response.status)); assert.equal(s.value.coll.notes, 'original');
  }
});

test('read rejects equal-length corruption and a changing committed version', async () => {
  for (const mode of ['corrupt', 'version']) {
    const s = server(document('original'), { intercept: ({ action, url, manifest, slices }) => {
      if (action !== 'read') return;
      if (mode === 'version') return reply({ ok: false, code: 'conflict', version: 8 }, 409);
      return reply({ ok: true, version: manifest.version, part: 0, offset: Number(url.searchParams.get('offset')), data: slices[0].replace('original', 'replaced') });
    } });
    const response = await stateTransportFetch('/api/state', {}, s.fetcher);
    assert.equal(response.status, mode === 'version' ? 409 : 502);
    assert.equal((await response.json()).ok, false);
  }
});

test('malformed manifest fails before any part requests', async () => {
  for (const change of [m => { m.bytes = STATE_TRANSFER_LIMIT + 1; }, m => { m.chunks[0].offset = 2; }, m => { m.chunks[0].length = 32769; }, m => { m.sha256 = 'bad'; }]) {
    const s = server(undefined, { intercept: ({ action, manifest }) => { if (action === 'manifest') { change(manifest); return reply(manifest); } } });
    assert.equal((await stateTransportFetch('/api/state', {}, s.fetcher)).status, 502);
    assert.equal(s.calls.length, 1);
  }
});

test('parallel reads retry only the failed piece and settle before returning', async () => {
  let completed = 0;
  const s = server(document('x'.repeat(400000)), { intercept: async ({ action, url }) => {
    if (action !== 'read') return;
    if (url.searchParams.get('offset') === '1') throw new TypeError('Offline');
    await pause(); completed++;
  } });
  await assert.rejects(stateTransportFetch('/api/state', {}, s.fetcher), { name: 'TypeError' });
  const count = s.calls.length; await pause();
  assert.equal(s.calls.length, count);
  const reads = s.calls.filter(call => call.action === 'read');
  const failed = reads.filter(call => new URL(call.path, 'https://example.test').searchParams.get('offset') === '1');
  assert.equal(failed.length, 3);
  assert.equal(completed, reads.length - failed.length);
  assert.equal(new Set(reads.map(call => call.path)).size, reads.length - 2, 'successful pieces are never downloaded twice');
});

test('all transfer requests preserve account headers, credentials, redirect and abort signal', async () => {
  const controller = new AbortController(), s = server(document('x'.repeat(100000)));
  const options = { headers: { 'X-Tanmay-Owner': 'isolated-owner', 'X-Custom': 'keep' }, credentials: 'include', redirect: 'manual', signal: controller.signal };
  await stateTransportFetch('https://example.test/api/state', options, s.fetcher);
  await stateTransportFetch('https://example.test/api/state', { ...options, method: 'PUT', body: JSON.stringify({ doc: document('new') }) }, s.fetcher);
  for (const call of s.calls) {
    const headers = new Headers(call.options.headers);
    assert.equal(headers.get('X-Tanmay-Owner'), 'isolated-owner'); assert.equal(headers.get('X-Custom'), 'keep');
    assert.equal(call.options.credentials, 'include'); assert.equal(call.options.redirect, 'manual');
    assert.ok(call.options.signal instanceof AbortSignal); assert.equal(call.options.signal.aborted, false); assert.ok(call.path.startsWith('https://example.test/'));
  }
});

test('authentication, membership, proxy failure and opaque redirects remain classified by existing callers', async () => {
  const cases = [
    [reply({ ok: false }, 401), SYNC_PRIHLASENI],
    [reply({ ok: false, error: 'not a member' }, 403), SYNC_CLENSTVI],
    [new Response('<html>1102</html>', { status: 503, headers: { 'Content-Type': 'text/html' } }), SYNC_SERVER],
    [{ ok: false, status: 0, type: 'opaqueredirect', headers: new Headers() }, SYNC_PRIHLASENI],
  ];
  for (const [expected, kind] of cases) {
    const response = await stateTransportFetch('/api/state', {}, async () => expected);
    assert.equal(response.status, expected.status);
    const body = response.headers.get('Content-Type')?.includes('application/json') ? await response.json() : null;
    assert.equal(syncDruh(response, body, null), kind);
  }
});

test('unrelated requests keep their original input and options', async () => {
  for (const path of ['/api/files', '/api/state?transport=chunks&action=manifest']) {
    const options = { headers: { 'X-Test': 'yes' } }, expected = reply({ ok: true });
    const response = await stateTransportFetch(path, options, async (input, init) => { assert.equal(input, path); assert.equal(init, options); return expected; });
    assert.equal(response, expected);
  }
});

test('oversize documents and already aborted requests make no network requests', async () => {
  let calls = 0; const fetcher = async () => { calls++; throw new Error('Must not fetch'); };
  const response = await stateTransportFetch('/api/state', { method: 'PUT', body: JSON.stringify({ doc: document('x'.repeat(STATE_TRANSFER_LIMIT)) }) }, fetcher);
  assert.equal(response.status, 413);
  const controller = new AbortController(); controller.abort();
  await assert.rejects(stateTransportFetch('/api/state', { signal: controller.signal }, fetcher), { name: 'AbortError' });
  assert.equal(calls, 0);
});

test('shared syncFetch reads through the bounded transport', async t => {
  const doc = document('saved'), s = server(doc);
  t.mock.method(globalThis, 'fetch', s.fetcher);
  const result = await syncFetch('/api/state');
  assert.equal(result.druh, SYNC_OK); assert.deepEqual(result.telo.doc, doc);
  assert.equal(s.calls[0].action, 'manifest');
});

test('Client wrapper pins the owner for the entire transfer and stops after a session change', async t => {
  const source = await readFile(new URL('../src/App.tsx', import.meta.url), 'utf8');
  const match = source.match(/async function syncFetch\(path, init\) \{[\s\S]*?\n\}/);
  if (!match) { t.skip('Main imports the shared wrapper'); return; }
  let current = 'first';
  const clientAccount = { getSnapshot: () => ({ owner: current }), isCurrent: owner => current === owner };
  const s = server(undefined, { intercept: ({ action }) => { if (action === 'part') current = 'second'; } });
  const context = vm.createContext({ clientAccount, clientFetch: s.fetcher, stateTransportFetch, syncDruh, SYNC_PRIHLASENI });
  const wrapper = vm.runInContext(`(${match[0]})`, context);
  const result = await wrapper('/api/state', { method: 'PUT', body: JSON.stringify({ doc: document('new'), baseVersion: 7 }) });
  assert.equal(result.druh, SYNC_PRIHLASENI); assert.equal(result.stav, 401);
  assert.equal(s.calls.some(call => call.action === 'commit'), false);
});
