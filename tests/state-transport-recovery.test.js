import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { stateTransportFetch, STATE_TRANSFER_REQUEST_TIMEOUT, STATE_TRANSFER_RETRY_DELAYS } from '../src/shared/product/stateTransportClient.js';

const response = (body, status = 200, headers = {}) => Response.json(body, { status, headers });
const doc = { rev: 6, coll: { journal: [{ id: 'local', text: 'Příliš žluťoučký 🧘🏽' }] }, edits: {} };
const text = JSON.stringify(doc), size = Buffer.byteLength(text);
const hash = createHash('sha256').update(text).digest('hex');
const options = { method: 'PUT', body: JSON.stringify({ doc, baseVersion: 5 }) };
const flush = () => new Promise(resolve => setImmediate(resolve));
async function advance(t, ms) { t.mock.timers.tick(ms); await flush(); }
async function reached(check) {
  for (let turn = 0; turn < 10000 && !check(); turn++) await flush();
  assert.ok(check(), 'The request must reach the intended stage before advancing mocked time');
  await flush();
}
function timers(t) { t.mock.timers.enable({ apis: ['setTimeout'] }); }

function wire(intercept) {
  const calls = [], counts = new Map();
  let committed = 0;
  const fetcher = async (path, init = {}) => {
    const url = new URL(path, 'https://test.invalid');
    const action = url.searchParams.get('action') || 'meta';
    const attempt = (counts.get(action) || 0) + 1;
    counts.set(action, attempt);
    const body = init.body ? JSON.parse(init.body) : null;
    const call = { action, path, init, body, attempt }; calls.push(call);
    const normal = () => {
      if (action === 'meta') return response({ ok: true, version: 5 });
      if (action === 'manifest') return response({ ok: true, transport: 'chunks', version: 5, bytes: size, sha256: hash, empty: false, chunks: [{ part: 0, offset: 1, length: Array.from(text).length }] });
      if (action === 'read') return response({ ok: true, version: 5, part: 0, offset: 1, data: text });
      if (action === 'start') return response({ ok: true, uploadId: 'same-upload' });
      if (action === 'part') return response({ ok: true, part: body.part });
      if (action === 'commit') { committed = 1; return response({ ok: true, version: 6, bytes: size }); }
      throw new Error(`Unexpected action: ${action}`);
    };
    return await intercept?.({ ...call, normal }) || normal();
  };
  return { fetcher, calls, counts, get committed() { return committed; } };
}

for (const action of ['manifest', 'read', 'start', 'part', 'commit']) {
  test(`recovers a lost ${action} response using the same request, without a second logical save`, async t => {
    timers(t);
    const s = wire(({ action: current, attempt, normal }) => {
      if (current === action && attempt === 1) { normal(); throw new TypeError('Response was lost'); }
    });
    const saving = stateTransportFetch('/api/state', ['manifest', 'read'].includes(action) ? {} : options, s.fetcher);
    await reached(() => s.counts.has(action));
    assert.equal(s.counts.get(action), 1);
    await advance(t, STATE_TRANSFER_RETRY_DELAYS[0]);
    const result = await saving;
    assert.equal(result.status, 200);
    assert.equal(s.counts.get(action), 2);
    const attempts = s.calls.filter(call => call.action === action);
    assert.equal(attempts[0].path, attempts[1].path);
    assert.equal(attempts[0].init.method, attempts[1].init.method);
    assert.equal(attempts[0].init.body, attempts[1].init.body);
    if (['manifest', 'read'].includes(action)) assert.deepEqual((await result.json()).doc, doc);
    else {
      assert.equal((await result.json()).version, 6); assert.equal(s.committed, 1);
      for (const mutation of ['start', 'part', 'commit']) assert.equal(s.counts.get(mutation), mutation === action ? 2 : 1);
    }
  });
}

test('retries a failing response body before acknowledging the atomic commit', async t => {
  timers(t);
  const s = wire(({ action, attempt, normal }) => {
    if (action !== 'commit' || attempt !== 1) return;
    normal();
    return new Response(new ReadableStream({ start(controller) { controller.error(new TypeError('Body disconnected')); } }), { headers: { 'Content-Type': 'application/json' } });
  });
  const saving = stateTransportFetch('/api/state', options, s.fetcher);
  await reached(() => s.counts.has('commit')); await advance(t, STATE_TRANSFER_RETRY_DELAYS[0]);
  const result = await saving;
  assert.equal(result.status, 200); assert.equal((await result.json()).version, 6);
  assert.equal(s.counts.get('commit'), 2); assert.equal(s.committed, 1);
});

for (const status of [408, 429, 500, 503]) {
  test(`retries HTTP ${status} at most three times and preserves the final failure`, async t => {
    timers(t);
    const s = wire(({ action }) => action === 'part' ? response({ ok: false, code: 'still-unavailable' }, status) : undefined);
    const saving = stateTransportFetch('/api/state', options, s.fetcher);
    await reached(() => s.counts.has('part')); await advance(t, STATE_TRANSFER_RETRY_DELAYS[0]);
    assert.equal(s.counts.get('part'), 2);
    await advance(t, STATE_TRANSFER_RETRY_DELAYS[1]);
    const result = await saving;
    assert.equal(result.status, status); assert.equal((await result.json()).code, 'still-unavailable');
    assert.equal(s.counts.get('part'), 3); assert.equal(s.counts.has('commit'), false); assert.equal(s.committed, 0);
  });
}

for (const status of [400, 401, 403, 409, 413]) {
  test(`does not retry HTTP ${status} or continue uploading`, async () => {
    const s = wire(({ action }) => action === 'start' ? response({ ok: false, code: 'refused' }, status) : undefined);
    const result = await stateTransportFetch('/api/state', options, s.fetcher);
    assert.equal(result.status, status); assert.equal(s.counts.get('start'), 1);
    assert.equal(s.counts.has('part'), false); assert.equal(s.counts.has('commit'), false);
  });
}

test('opaque sign-in redirects remain untouched and are not retried', async () => {
  const redirect = { ok: false, status: 0, type: 'opaqueredirect', redirected: false, headers: new Headers() };
  const s = wire(() => redirect);
  assert.equal(await stateTransportFetch('/api/state', {}, s.fetcher), redirect);
  assert.equal(s.calls.length, 1);
});

test('local account and request guards reject immediately without retry or upload', async t => {
  timers(t);
  for (const detail of [{ code: 'changed' }, ...[400, 401, 403, 409, 413].map(status => ({ status }))]) {
    const refused = Object.assign(new Error('Request guard refused'), detail);
    const s = wire(() => { throw refused; });
    let settled = false;
    const stopped = assert.rejects(stateTransportFetch('/api/state', {}, s.fetcher), error => error === refused).then(() => { settled = true; });
    await flush();
    assert.equal(settled, true, JSON.stringify(detail));
    await stopped;
    await advance(t, 100000);
    assert.equal(s.calls.length, 1); assert.equal(s.counts.has('start'), false); assert.equal(s.counts.has('commit'), false);
  }
});

test('respects a bounded Retry-After and never retries earlier', async t => {
  timers(t);
  const s = wire(({ action, attempt }) => action === 'manifest' && attempt === 1 ? response({ ok: false }, 429, { 'Retry-After': '2' }) : undefined);
  const reading = stateTransportFetch('/api/state', {}, s.fetcher);
  await flush(); await advance(t, 1999);
  assert.equal(s.counts.get('manifest'), 1);
  await advance(t, 1);
  assert.equal((await reading).status, 200); assert.equal(s.counts.get('manifest'), 2);
});

test('returns a long Retry-After without violating the server delay', async () => {
  const s = wire(() => response({ ok: false }, 429, { 'Retry-After': '30' }));
  const result = await stateTransportFetch('/api/state', {}, s.fetcher);
  assert.equal(result.status, 429); assert.equal(result.headers.get('Retry-After'), '30'); assert.equal(s.calls.length, 1);
});

test('an explicit caller abort during backoff stops further requests and commit', async t => {
  timers(t);
  const controller = new AbortController();
  const s = wire(({ action }) => { if (action === 'part') throw new TypeError('Network lost'); });
  const saving = stateTransportFetch('/api/state', { ...options, signal: controller.signal }, s.fetcher);
  const stopped = assert.rejects(saving, { name: 'AbortError' });
  await reached(() => s.counts.has('part')); controller.abort(); await stopped;
  await advance(t, 100000);
  assert.equal(s.counts.get('part'), 1); assert.equal(s.counts.has('commit'), false);
});

test('an explicit caller abort interrupts an uncooperative fetch without retry', async t => {
  timers(t);
  const controller = new AbortController(), s = wire(() => new Promise(() => {}));
  const reading = stateTransportFetch('/api/state', { signal: controller.signal }, s.fetcher);
  const stopped = assert.rejects(reading, { name: 'AbortError' });
  await flush(); controller.abort(); await stopped;
  await advance(t, 100000); assert.equal(s.calls.length, 1); assert.equal(s.calls[0].init.signal.aborted, true);
});

test('per-request timeout includes a hanging body and retries the same commit', async t => {
  timers(t);
  const s = wire(({ action, attempt, normal }) => {
    if (action !== 'commit' || attempt !== 1) return;
    normal();
    return new Response(new ReadableStream({ start() {} }), { headers: { 'Content-Type': 'application/json' } });
  });
  const saving = stateTransportFetch('/api/state', options, s.fetcher);
  await reached(() => s.counts.has('commit')); await advance(t, STATE_TRANSFER_REQUEST_TIMEOUT - 1);
  assert.equal(s.counts.get('commit'), 1);
  await advance(t, 1); await advance(t, STATE_TRANSFER_RETRY_DELAYS[0]);
  assert.equal((await saving).status, 200); assert.equal(s.counts.get('commit'), 2);
  assert.equal(s.calls.find(call => call.action === 'commit').init.signal.aborted, true);
});

test('three timed-out uncooperative fetches terminate without an acknowledgement', async t => {
  timers(t);
  const s = wire(() => new Promise(() => {}));
  const reading = stateTransportFetch('/api/state', {}, s.fetcher);
  const stopped = assert.rejects(reading);
  await flush();
  for (let attempt = 0; attempt < 3; attempt++) {
    await advance(t, STATE_TRANSFER_REQUEST_TIMEOUT);
    if (attempt < 2) await advance(t, STATE_TRANSFER_RETRY_DELAYS[attempt]);
  }
  await stopped;
  assert.equal(s.calls.length, 3); assert.ok(s.calls.every(call => call.init.signal.aborted));
});

test('explicit metadata reads use the same bounded network retry without changing the route', async t => {
  timers(t);
  const s = wire(({ attempt }) => { if (attempt === 1) throw new TypeError('Metadata response lost'); });
  const reading = stateTransportFetch('/api/state?meta=1', {}, s.fetcher);
  await flush(); await advance(t, STATE_TRANSFER_RETRY_DELAYS[0]);
  const result = await reading;
  assert.equal(result.status, 200); assert.equal((await result.json()).version, 5);
  assert.equal(s.calls.length, 2); assert.ok(s.calls.every(call => call.path === '/api/state?meta=1'));
});

test('metadata timeout releases a stuck pre-save request and allows recovery', async t => {
  timers(t);
  const s = wire(({ attempt }) => attempt === 1 ? new Promise(() => {}) : undefined);
  const reading = stateTransportFetch('/api/state?meta=1', {}, s.fetcher);
  await flush(); await advance(t, STATE_TRANSFER_REQUEST_TIMEOUT); await advance(t, STATE_TRANSFER_RETRY_DELAYS[0]);
  const result = await reading;
  assert.equal(result.status, 200); assert.equal((await result.json()).version, 5);
  assert.equal(s.calls.length, 2); assert.equal(s.calls[0].init.signal.aborted, true);
});

test('final server error body cannot strand the caller outside the request timeout', async t => {
  timers(t);
  const s = wire(() => new Response(new ReadableStream({ start() {} }), { status: 503, headers: { 'Content-Type': 'application/json' } }));
  const reading = stateTransportFetch('/api/state', {}, s.fetcher).then(async result => ({ status: result.status, body: await result.json() }));
  await flush();
  for (let attempt = 0; attempt < 3; attempt++) {
    await advance(t, STATE_TRANSFER_REQUEST_TIMEOUT);
    if (attempt < 2) await advance(t, STATE_TRANSFER_RETRY_DELAYS[attempt]);
  }
  const result = await reading;
  assert.equal(result.status, 503); assert.equal(result.body.ok, false); assert.equal(s.calls.length, 3);
});

test('a hanging sign-in error body remains bounded without retrying unauthorized requests', async t => {
  timers(t);
  const s = wire(() => new Response(new ReadableStream({ start() {} }), { status: 401, headers: { 'Content-Type': 'application/json' } }));
  const reading = stateTransportFetch('/api/state', {}, s.fetcher).then(async result => ({ status: result.status, body: await result.json() }));
  await flush(); await advance(t, STATE_TRANSFER_REQUEST_TIMEOUT);
  const result = await reading;
  assert.equal(result.status, 401); assert.equal(result.body.ok, false); assert.equal(s.calls.length, 1);
});
