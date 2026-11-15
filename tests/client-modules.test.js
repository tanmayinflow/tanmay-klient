import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { makeD1, makeEnv, req } from './helpers/env.js';
import worker from '../worker/index.js';
import { applyClientModuleCommands, moduleCommandRevisions } from '../src/shared/product/clientModules.js';
import { handleClientModules } from '../src/shared/product/clientModulesServer.js';
import { stateTransportFetch } from '../src/shared/product/stateTransportClient.js';

const main = JSON.parse(readFileSync(new URL('../package.json', import.meta.url))).name === 'tanmay-web';
const email = 'module-a@example.test', otherEmail = 'module-b@example.test', ownerEmail = 'coach@example.test';
const userId = 'module-a-example-test', otherId = 'module-b-example-test';
const command = (module, revision, enabled = true) => ({ module, revision, enabled, applied: false });

test('module commands preserve private content and later client choices on every device', () => {
  const original = { modules: ['denik'], journal: ['PRIVATE'], ui: { navigation: { dockOrder: ['praxe'], rooms: { zapisnik: { hidden: true, dock: true }, denik: { sidebar: false } } } } };
  const next = applyClientModuleCommands(original, [command('zapisnik', 'r1')]);
  assert.deepEqual(next.modules, ['denik', 'zapisnik']);
  assert.equal(next.journal, original.journal);
  assert.deepEqual(next.ui.navigation.rooms.zapisnik, { hidden: false, sidebar: true, dock: true });
  assert.deepEqual(next.ui.navigation.rooms.denik, { sidebar: false });
  assert.equal(applyClientModuleCommands(next, [command('zapisnik', 'r1')]), next);
  const chosen = { ...next, modules: ['denik'], ui: original.ui };
  assert.equal(applyClientModuleCommands(chosen, [command('zapisnik', 'r1')]), chosen);
  assert.equal(applyClientModuleCommands(original, [{ ...command('zapisnik', 'r1'), applied: true }]), original, 'a stale second device must not replay a server-acknowledged command');
  const removed = applyClientModuleCommands(next, [command('zapisnik', 'r2', false)]);
  assert.deepEqual(removed.modules, ['denik']);
  assert.equal(removed.journal, original.journal);
  for (const invalid of [command('klienti', 'r3'), command('praxe', 'r3', false), command('socsite', '<private>'), { module: 'spolu', enabled: true }]) assert.equal(applyClientModuleCommands(original, [invalid]), original);
  assert.deepEqual(moduleCommandRevisions({ zapisnik: 'r1', klienti: 'PRIVATE', denik: { private: true } }), { zapisnik: 'r1' });
  assert.deepEqual(applyClientModuleCommands({ modules: ['praxe', 'prameny', 'prameny'] }, [command('zapisnik', 'r1')]).modules, ['prameny', 'zapisnik']);
  assert.deepEqual(applyClientModuleCommands({ modules: null }, [command('zapisnik', 'r1')]).modules, ['zapisnik'], 'null has no enabled optional defaults');
});

test('a delayed command response cannot overwrite a newer receipt adopted during the request', () => {
  const beforeRequest = { modules: [], moduleCommandRevisions: { zapisnik: 'r0' } };
  const baseline = moduleCommandRevisions(beforeRequest.moduleCommandRevisions);
  const adopted = { modules: [], moduleCommandRevisions: { zapisnik: 'r2' }, journal: ['NEWER PRIVATE'] };
  const result = applyClientModuleCommands(adopted, [command('zapisnik', 'r1')], baseline);
  assert.equal(result, adopted, 'old enable response must not undo a newer disable or create another local save');
  const same = applyClientModuleCommands(beforeRequest, [command('zapisnik', 'r1')], baseline);
  assert.deepEqual(same.modules, ['zapisnik'], 'unchanged receipt still permits a new command');
  const anotherModule = applyClientModuleCommands(adopted, [command('prameny', 'new-source')], baseline);
  assert.deepEqual(anotherModule.modules, ['prameny'], 'unrelated receipt changes do not block another module');
});

async function fixture() {
  if (main) {
    const db = makeD1();
    await db.exec('CREATE TABLE members(user_id TEXT PRIMARY KEY,email TEXT,modules TEXT);');
    for (const [id, address] of [[userId, email], [otherId, otherEmail]]) await db.prepare('INSERT INTO members VALUES(?,?,?)').bind(id, address, '["denik"]') .run();
    return makeEnv({ KLIENT_DB: db, OWNER_EMAIL: ownerEmail });
  }
  const env = makeEnv();
  for (const address of [email, otherEmail]) assert.equal((await worker.fetch(req('/api/join', { email: address, method: 'POST', body: { word: 'otevri se' } }), env)).status, 200);
  return env;
}
const dbOf = env => main ? env.KLIENT_DB : env.DB;
const issue = (env, module = 'zapisnik', enabled = true, id = userId) => handleClientModules(req('/', { method: 'PUT', body: { module, enabled } }), { db: dbOf(env), userId: id, coach: true });
const overview = (env, id = userId) => handleClientModules(req('/'), { db: dbOf(env), userId: id, coach: true }).then(r => r.json());

test('only existing members and valid optional modules can receive commands; summaries never read personal documents', async () => {
  const env = await fixture(), db = dbOf(env);
  const prepare = db.prepare.bind(db);
  db.prepare = sql => { assert.doesNotMatch(sql, /\b(state|state_documents|state_chunks)\b/i, 'module administration must not query private state'); return prepare(sql); };
  for (const body of [{ module: 'klienti', enabled: true }, { module: 'praxe', enabled: false }, { module: 'denik', enabled: 1 }, { module: 'denik', enabled: true, userId: otherId }]) {
    assert.equal((await handleClientModules(req('/', { method: 'PUT', body }), { db, userId, coach: true })).status, 400);
  }
  assert.equal((await issue(env, 'denik', true, 'missing')).status, 404);
  assert.equal((await issue(env)).status, 200);
  const a = await overview(env), b = await overview(env, otherId);
  assert.equal(a.commands.length, 1); assert.equal(a.commands[0].applied, false); assert.equal(b.commands.length, 0);
  assert.equal((await handleClientModules(req('/', { method: 'PUT', body: { module: 'denik', enabled: true } }), { db, userId })).status, 405);
});

test('actual module routes retain owner, membership and account isolation', async () => {
  const env = await fixture();
  const path = main ? `/api/klienti/${userId}/modules` : '/api/modules';
  assert.equal((await worker.fetch(req(path), env)).status, 401);
  if (main) {
    assert.equal((await worker.fetch(req(path, { email, method: 'PUT', body: { module: 'denik', enabled: true } }), env)).status, 403);
    assert.equal((await worker.fetch(req(path, { email: ownerEmail, method: 'PUT', body: { module: 'denik', enabled: true } }), env)).status, 200);
    assert.equal((await (await worker.fetch(req(path, { email: ownerEmail }), env)).json()).commands.length, 1);
  } else {
    await issue(env);
    assert.equal((await worker.fetch(req(path, { email: 'not-joined@example.test' }), env)).status, 403);
    assert.equal((await worker.fetch(req(path, { email, method: 'PUT', body: { module: 'denik', enabled: true } }), env)).status, 405);
    assert.equal((await worker.fetch(req(`/api/klienti/${otherId}/modules`, { email }), env)).status, 404);
    assert.equal((await (await worker.fetch(req(path + '?userId=' + userId, { email: otherEmail }), env)).json()).commands.length, 0);
    const me = await (await worker.fetch(req('/api/me', { email }), env)).json();
    assert.equal(me.email, email);
    assert.equal((await worker.fetch(req(path, { email: otherEmail, headers: { 'X-Tanmay-Owner': me.owner } }), env)).status, 409);
  }
});

if (main) test('module administration fails closed without configured owner before any client database access', async () => {
  for (const owner of [undefined, '', '   ']) {
    const env = await fixture();
    env.OWNER_EMAIL = owner;
    env.KLIENT_DB.prepare = () => { throw new Error('unconfigured route must not access client data'); };
    for (const identity of [undefined, ownerEmail, email]) for (const method of ['GET', 'PUT']) {
      const response = await worker.fetch(req(`/api/klienti/${userId}/modules`, { email: identity, method,
        ...(method === 'PUT' ? { body: { module: 'denik', enabled: true } } : {}),
      }), env);
      assert.equal(response.status, 503);
      assert.equal((await response.json()).code, 'owner-not-configured');
    }
  }
});

if (!main) for (const transport of ['legacy', 'chunks']) test(`${transport}: command acknowledgment follows only the committed private state and cannot leak between accounts`, async () => {
  const env = await fixture();
  const send = (body, address = email) => transport === 'legacy'
    ? worker.fetch(req('/api/state', { email: address, method: 'PUT', body }), env)
    : stateTransportFetch('/api/state', { method: 'PUT', body: JSON.stringify(body) }, (path, options) => worker.fetch(req(path, { email: address, method: options.method, body: options.body, headers: options.headers }), env));
  assert.equal((await send({ doc: { coll: { modules: ['denik'], journal: ['PRIVATE'] } }, baseVersion: 0 })).status, 200);
  await issue(env);
  const delivered = (await overview(env)).commands[0];
  const coll = applyClientModuleCommands({ modules: ['denik'], journal: ['PRIVATE'] }, [delivered]);
  assert.equal((await send({ doc: { coll }, baseVersion: 0 })).status, 409);
  assert.equal((await overview(env)).commands[0].applied, false, 'conflict cannot consume a command');
  assert.equal((await send({ doc: { coll }, baseVersion: 0 }, otherEmail)).status, 200);
  assert.equal((await overview(env)).commands[0].applied, false, 'another member cannot acknowledge this command');
  assert.equal((await send({ doc: { coll }, baseVersion: 1 })).status, 200);
  const accepted = await overview(env);
  assert.equal(accepted.commands[0].applied, true);
  assert.deepEqual(accepted.active, ['denik', 'zapisnik']);
  assert.equal((await send({ doc: { coll: { ...coll, modules: ['denik'] } }, baseVersion: 2 })).status, 200);
  const changed = await overview(env);
  assert.deepEqual(changed.active, ['denik']);
  assert.equal(changed.commands[0].applied, true, 'client choice after delivery does not make command pending again');
  assert.equal(applyClientModuleCommands({ modules: ['denik'] }, changed.commands).modules.includes('zapisnik'), false);
  await issue(env, 'zapisnik', false);
  assert.equal((await overview(env)).commands[0].applied, false, 'a new explicit coach change gets a new receipt');
});
