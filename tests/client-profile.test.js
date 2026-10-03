import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker/index.js';
import { makeEnv, req } from './helpers/env.js';

const A = 'a@example.test', B = 'b@example.test';
const call = (env, path, opts = {}) => worker.fetch(req(path, { email: A, ...opts }), env);
async function setup() {
  const env = makeEnv();
  for (const email of [A, B]) await call(env, '/api/join', { email, method: 'POST', body: { word: 'otevri se' } });
  return env;
}
test('first personal profile keeps the existing member name and never copies another account', async () => {
  const env = await setup();
  await env.DB.prepare('UPDATE members SET name = ? WHERE user_id = ?').bind('Anna', 'a-example-test').run();
  const a = await (await call(env, '/api/personal-profile')).json();
  const b = await (await call(env, '/api/personal-profile', { email: B })).json();
  assert.equal(a.profile.name, 'Anna');
  assert.equal(b.profile.name, '');
  assert.notEqual(a.accountKey, b.accountKey);
  assert.equal(a.revision, 0);
});
test('onboarding name and account profile update one name without resetting personal choices', async () => {
  const env = await setup();
  let profile = await (await call(env, '/api/personal-profile')).json();
  const put = await call(env, '/api/personal-profile', { method: 'PUT', body: {
    ...profile, profile: { name: 'Anna', wording: 'female', ownCycle: false },
  } });
  assert.equal(put.status, 200);
  const oldApp = await call(env, '/api/profile', { method: 'POST', body: { name: 'Anča' } });
  assert.equal(oldApp.status, 200);
  assert.equal((await oldApp.json()).name, 'Anča');
  profile = await (await call(env, '/api/personal-profile')).json();
  assert.deepEqual(profile.profile, { name: 'Anča', wording: 'female', ownCycle: false });
  assert.equal((await (await call(env, '/api/me')).json()).name, 'Anča');
  assert.equal((await env.DB.prepare('SELECT name FROM members WHERE user_id = ?').bind('a-example-test').first()).name, 'Anča');
});
test('stale personal profile cannot overwrite the canonical name or its member projection', async () => {
  const env = await setup();
  const old = await (await call(env, '/api/personal-profile')).json();
  await call(env, '/api/profile', { method: 'POST', body: { name: 'Latest' } });
  const stale = await call(env, '/api/personal-profile', { method: 'PUT', body: { ...old, profile: { ...old.profile, name: 'Old' } } });
  assert.equal(stale.status, 409);
  assert.equal((await (await call(env, '/api/me')).json()).name, 'Latest');
  assert.equal((await env.DB.prepare('SELECT name FROM members WHERE user_id = ?').bind('a-example-test').first()).name, 'Latest');
});
test('malformed legacy name and cross-account profile keys leave the profile intact', async () => {
  const env = await setup();
  await call(env, '/api/profile', { method: 'POST', body: { name: 'Anna' } });
  assert.equal((await call(env, '/api/profile', { method: 'POST', body: '{' })).status, 400);
  const a = await (await call(env, '/api/personal-profile')).json();
  const attempt = await call(env, '/api/personal-profile', { email: B, method: 'PUT', body: a });
  assert.equal(attempt.status, 409);
  assert.equal((await (await call(env, '/api/me')).json()).name, 'Anna');
  assert.equal((await (await call(env, '/api/me', { email: B })).json()).name, '');
});
