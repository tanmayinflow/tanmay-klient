import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker/index.js';
import { makeEnv, req } from './helpers/env.js';

const EMAIL = 'audit@example.test';

test('malformed percent encoding and UTF-8 in file paths return 400 without touching R2', async () => {
  const env = makeEnv();
  await worker.fetch(req('/api/join', { email: EMAIL, method: 'POST', body: { word: 'otevri se' } }), env);
  for (const id of ['%', '%A', '%GG', '%C0%AF', '%ED%A0%80', '%00', '%2Fother', '%5Cother']) {
    for (const method of ['GET', 'PUT', 'DELETE']) {
      const r = await worker.fetch(req('/api/files/' + id, { email: EMAIL, method, ...(method === 'PUT' ? { body: 'fixture' } : {}) }), env);
      assert.equal(r.status, 400, method + ' ' + id);
      assert.equal((await r.json()).ok, false);
    }
  }
  assert.equal(env.FILES._store.size, 0);
});

test('anonymous health never queries storage or initializes schemas', async () => {
  let calls = 0;
  const unexpected = () => { calls++; throw new Error('must not query'); };
  const env = makeEnv({ DB: { prepare: unexpected }, FILES: { head: unexpected } });
  const r = await worker.fetch(req('/api/health'), env);
  assert.equal(r.status, 401);
  assert.equal(calls, 0);
});

test('health reports dependency failure without leaking internal details', async () => {
  const failure = () => { throw new Error('SQLITE secret /private/db other@example.test'); };
  const env = makeEnv({ DB: { prepare: failure }, FILES: { head: failure } });
  const r = await worker.fetch(req('/api/health', { email: EMAIL }), env);
  assert.equal(r.status, 200);
  assert.equal(r.headers.get('cache-control'), 'no-store');
  assert.deepEqual(await r.json(), { db: 'error', files: 'error', identity: 'audit-example-test', schema: { error: 'unavailable' } });
});

test('authenticated health preserves the existing schema readiness contract', async () => {
  const r = await worker.fetch(req('/api/health', { email: EMAIL }), makeEnv());
  assert.equal(r.status, 200);
  const body = await r.json();
  assert.equal(body.db, 'ok');
  assert.equal(body.files, 'ok');
  assert.equal(body.schema.ready, true);
  assert.deepEqual(body.schema.missing, []);
});
