import test from 'node:test';
import assert from 'node:assert/strict';
import { createClientSession } from '../src/clientSession.js';

const A = 'aaaaaaaaaaaaaaaa', B = 'bbbbbbbbbbbbbbbb';
const response = (owner = A, member = true) => Response.json({ owner, member, name: 'Test' });
function fixture() {
  const requests = [];
  const session = createClientSession((url, init) => new Promise((resolve, reject) => requests.push({ url, init, resolve, reject })));
  session.initializeWith(async () => {});
  return { session, requests, respond: data => requests.shift().resolve(data) };
}
async function bind(session, respond) { const initial = session.verify(); respond(response()); await initial; }
test('concurrent callers share identity verification and each account request carries its owner', async () => {
  const { session, requests, respond } = fixture();
  await bind(session, respond);
  const one = session.request('/api/state'), two = session.request('/api/plan');
  assert.equal(requests.length, 1);
  respond(response()); await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(requests.map(r => r.url), ['/api/state', '/api/plan']);
  for (const request of requests) assert.equal(request.init.headers.get('X-Tanmay-Owner'), A);
  respond(Response.json({ ok: true })); respond(Response.json({ doc: null }));
  await Promise.all([one, two]);
});
test('failed startup identity is retried before any state or upload reaches the network', async () => {
  const { session, requests, respond } = fixture();
  const start = session.verify(); requests.shift().reject(new Error('offline')); await start;
  assert.equal(session.getSnapshot().owner, null);
  await assert.rejects(session.request('/api/files/test', { method: 'PUT' }), /offline/);
  assert.equal(requests.length, 0);
  await bind(session, respond);
  const upload = session.request('/api/files/test', { method: 'PUT' });
  assert.equal(requests[0].url, '/api/me');
  respond(response()); await new Promise(resolve => setImmediate(resolve));
  assert.equal(requests[0].url, '/api/files/test');
  respond(Response.json({ ok: true })); await upload;
});
test('another signed-in account locks mounted drafts without submitting them', async () => {
  const { session, requests, respond } = fixture();
  const start = session.verify(); respond(response()); await start;
  const save = session.request('/api/state', { method: 'PUT', body: 'PRIVATE A' });
  respond(response(B)); await assert.rejects(save, /changed/);
  assert.equal(session.getSnapshot().status, 'changed');
  assert.equal(requests.length, 0);
  await assert.rejects(session.request('/api/plan'), /changed/);
});
test('account guard rejection catches a switch between verification and the actual request', async () => {
  const { session, requests, respond } = fixture();
  await bind(session, respond);
  const save = session.request('/api/state', { method: 'PUT' });
  respond(response()); await new Promise(resolve => setImmediate(resolve));
  assert.equal(requests[0].init.headers.get('X-Tanmay-Owner'), A);
  respond(Response.json({ ok: false, code: 'account-changed' }, { status: 409 }));
  await assert.rejects(save, /changed/);
  assert.equal(session.getSnapshot().owner, A);
  assert.equal(session.getSnapshot().status, 'changed');
});
test('transient identity failure keeps the owner and can recover, but never permits a request meanwhile', async () => {
  const { session, requests, respond } = fixture();
  let check = session.verify(); respond(response()); await check;
  const fail = session.request('/api/state'); requests.shift().reject(new Error('offline'));
  await assert.rejects(fail, /offline/);
  assert.equal(session.getSnapshot().owner, A);
  check = session.verify(); respond(response()); assert.equal(await check, true);
});
test('storage preservation must finish successfully before any account data request', async () => {
  const { session, requests, respond } = fixture();
  session.initializeWith(async () => { throw new Error('QuotaExceededError'); });
  const initial = session.verify(); respond(response()); await initial;
  await assert.rejects(session.request('/api/state'), /storage/);
  assert.equal(session.getSnapshot().owner, null);
  assert.equal(session.getSnapshot().status, 'storage');
  assert.equal(requests.length, 0);
});
test('temporary server errors keep the bound account and recover without a new sign-in', async () => {
  for (const status of [408, 429, 503]) {
    const { session, requests, respond } = fixture();
    await bind(session, respond);
    const read = session.request('/api/state'); respond(new Response(null, { status }));
    await assert.rejects(read, /offline/);
    assert.equal(session.getSnapshot().status, 'offline');
    assert.equal(session.getSnapshot().owner, A);
    assert.equal(requests.length, 0);
    const retry = session.verify(); respond(response());
    assert.equal(await retry, true);
  }
});
test('identity changes from another local tab discard late in-flight responses', async () => {
  const { session, respond } = fixture();
  await bind(session, respond);
  const read = session.request('/api/state'); respond(response());
  await new Promise(resolve => setImmediate(resolve));
  session.localOwnerChanged(B);
  respond(Response.json({ ok: true, doc: { coll: { journal: ['OTHER'] } } }));
  await assert.rejects(read, /changed/);
});
test('nonmembers and HTML sign-in responses cannot load account state', async () => {
  for (const me of [response(A, false), new Response('<html>Sign in</html>', { headers: { 'Content-Type': 'text/html' } })]) {
    const { session, requests, respond } = fixture();
    const initial = session.verify(); respond(me);
    assert.equal(await initial, false);
    assert.equal(requests.length, 0);
  }
});
