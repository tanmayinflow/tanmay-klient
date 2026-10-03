import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8');
const origin = 'https://client.example.test';
const owner = '0123456789abcdef';
function worker(fetcher, entries = new Map()) {
  const events = {}, deleted = [];
  let reads = 0;
  const cache = { match: async request => { reads++; return entries.get(typeof request === 'string' ? request : request.url)?.clone(); } };
  vm.runInNewContext(source, {
    self: { addEventListener: (type, callback) => { events[type] = callback; }, clients: { claim: async () => {} } },
    location: { origin }, URL, Request, Response, Headers, fetch: fetcher,
    caches: { open: async () => cache, keys: async () => ['shell-tanmay-v3', 'pinned', `pinned__owner_${owner}`, 'assets-tanmay-v4'], delete: async key => deleted.push(key) },
  });
  return {
    async get(path, headers = {}) { let result; events.fetch({ request: new Request(origin + path, { headers }), respondWith: promise => { result = promise; } }); return result; },
    async activate() { let result; events.activate({ waitUntil: promise => { result = promise; } }); await result; },
    reads: () => reads, deleted,
  };
}
test('private pinned media is network-first and carries its owner to the Worker', async () => {
  const path = `/api/files/voice?owner=${owner}`;
  const w = worker(async request => { assert.equal(request.headers.get('X-Tanmay-Owner'), owner); assert.equal(request.redirect, 'manual'); return new Response('current'); }, new Map([[origin + path, new Response('cached')]]));
  assert.equal(await (await w.get(path)).text(), 'current');
  assert.equal(w.reads(), 0);
});
test('denied access, account changes and redirects never expose a cached file', async () => {
  const path = `/api/files/voice?owner=${owner}`;
  for (const status of [401, 403, 409, 302]) {
    const w = worker(async () => new Response('', { status }), new Map([[origin + path, new Response('private')]]));
    assert.equal((await w.get(path)).status, status);
    assert.equal(w.reads(), 0);
  }
});
test('only the exact owner pin is available during a transport failure', async () => {
  const path = `/api/files/voice?owner=${owner}`;
  const w = worker(async () => { throw new TypeError('offline'); }, new Map([[origin + path, new Response('mine')], [origin + '/api/files/legacy', new Response('unscoped')]]));
  assert.equal(await (await w.get(path)).text(), 'mine');
  await assert.rejects(w.get('/api/files/voice?owner=fedcba9876543210'));
  await assert.rejects(w.get('/api/files/legacy'));
});
test('a mismatched request owner is rejected before network or cache', async () => {
  const w = worker(async () => { throw new Error('network should not be used'); });
  assert.equal((await w.get(`/api/files/voice?owner=${owner}`, { 'X-Tanmay-Owner': 'fedcba9876543210' })).status, 409);
  assert.equal(w.reads(), 0);
});
test('service worker updates preserve current and archived private media', async () => {
  const w = worker(async () => new Response(''));
  await w.activate();
  assert.deepEqual(w.deleted, ['shell-tanmay-v3']);
});
