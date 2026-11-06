import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { exportAccountRecords } from '../src/shared/product/accountBackup.js';
import { ensureTogether } from '../src/shared/product/togetherApi.js';
import { ensurePersonalProfiles } from '../src/shared/product/personalProfile.js';
import { makeD1, makeEnv, req } from './helpers/env.js';
import worker from '../worker/index.js';
import { ensureBookingSchema } from '../worker/booking/schema.js';

const main = JSON.parse(readFileSync(new URL('../package.json', import.meta.url))).name === 'tanmay-web';
test('account backup exports only own private data and owned deliveries; no credentials or foreign state', async () => {
  const db = makeD1(); await ensureTogether(db); await ensurePersonalProfiles(db);
  await db.exec("CREATE TABLE state(user_id TEXT,doc TEXT); CREATE TABLE plans(user_id TEXT,doc TEXT); CREATE TABLE google_connections(refresh_token TEXT);");
  for (const actor of ['client:a', 'client:b', 'coach:tanmay']) {
    await db.prepare('INSERT INTO personal_profiles(actor,doc) VALUES (?,?)').bind(actor, JSON.stringify({ name: actor })).run();
    await db.prepare('INSERT INTO together_people(actor,doc) VALUES (?,?)').bind(actor, JSON.stringify({ secret: actor })).run();
  }
  await db.prepare('INSERT INTO state VALUES (?,?)').bind('b', 'FOREIGN PRIVATE JOURNAL').run();
  await db.prepare('INSERT INTO google_connections VALUES (?)').bind('TOKEN NEVER EXPORTED').run();
  await db.prepare('INSERT INTO plans VALUES (?,?)').bind('a', 'DELIVERED A').run();
  await db.prepare('INSERT INTO plans VALUES (?,?)').bind('b', 'DELIVERED B').run();
  const client = await exportAccountRecords({ db, actor: 'client:a', userId: 'a', role: 'client' });
  const text = JSON.stringify(client);
  assert.match(text, /DELIVERED A/); assert.doesNotMatch(text, /DELIVERED B|FOREIGN PRIVATE|TOKEN NEVER|secret.*client:b/);
  assert.equal(client.sections.personal_profiles.length, 1); assert.equal(client.sections.together_people.length, 1);
  const coach = await exportAccountRecords({ db, actor: 'coach:tanmay', userId: 'primary', role: 'main' });
  assert.equal(coach.sections.plans.length, 2);
  assert.doesNotMatch(JSON.stringify(coach), /FOREIGN PRIVATE|TOKEN NEVER|secret.*client:a|secret.*client:b/);
});
test('failed account query rejects the whole backup rather than producing an empty section', async () => {
  const db = makeD1(); await ensurePersonalProfiles(db);
  db.batch = async () => { throw new Error('database unavailable'); };
  await assert.rejects(exportAccountRecords({ db, actor: 'client:a', userId: 'a', role: 'client' }));
});
test('actual backup endpoint obeys the existing authentication and mounted-account boundary', async () => {
  const email = 'backup-a@example.test', other = 'backup-b@example.test';
  const env = makeEnv(main ? { OWNER_EMAIL: email } : {});
  assert.equal((await worker.fetch(req('/api/backup'), env)).status, 401);
  if (main) {
    assert.equal((await worker.fetch(req('/api/backup', { email: other }), env)).status, 403);
    const response = await worker.fetch(req('/api/backup', { email }), env);
    assert.equal(response.status, 200); assert.equal((await response.json()).account.role, 'main');
    assert.match(response.headers.get('Cache-Control'), /no-store/);
  } else {
    assert.equal((await worker.fetch(req('/api/backup', { email }), env)).status, 403);
    for (const address of [email, other]) {
      const joined = await worker.fetch(req('/api/join', { email: address, method: 'POST', body: { word: 'otevri se' } }), env);
      assert.equal(joined.status, 200);
    }
    const identity = await (await worker.fetch(req('/api/me', { email }), env)).json();
    const switched = await worker.fetch(req('/api/backup', { email: other, headers: { 'X-Tanmay-Owner': identity.owner } }), env);
    assert.equal(switched.status, 409);
    const own = await worker.fetch(req('/api/backup', { email, headers: { 'X-Tanmay-Owner': identity.owner } }), env);
    assert.equal(own.status, 200); const body = await own.json();
    assert.equal(body.account.role, 'client'); assert.equal(body.account.sections.members.length, 1);
    assert.equal(body.account.sections.members[0].email, email);
  }
});
test('actual media response carries the authenticated file identity used by backup and offline pin', async () => {
  const email = 'backup-a@example.test', env = makeEnv(main ? { OWNER_EMAIL: email } : {});
  if (!main) await worker.fetch(req('/api/join', { email, method: 'POST', body: { word: 'otevri se' } }), env);
  const put = await worker.fetch(req('/api/files/voice', { email, method: 'PUT', body: 'VOICE', headers: { 'Content-Type': 'audio/webm' } }), env);
  assert.equal(put.status, 200); assert.deepEqual(await put.json(), { ok: true, id: 'voice' });
  const get = await worker.fetch(req('/api/files/voice', { email }), env);
  assert.equal(get.headers.get('X-Tanmay-File'), 'voice'); assert.equal(await get.text(), 'VOICE');
});
test('booking backup uses the real schema and never exports a coach private note or another client', async () => {
  const db = makeD1(); await ensureBookingSchema(db);
  for (const id of ['a','b']) {
    await db.prepare('INSERT INTO booking_clients(id,account_user_id,name,created_at,updated_at) VALUES (?,?,?,1,1)').bind(id,id,'Client '+id).run();
  }
  await db.prepare("INSERT INTO booking_services(id,name_cs,created_at,updated_at) VALUES ('service','Session',1,1)").run();
  for (const id of ['a','b']) await db.prepare("INSERT INTO bookings(id,client_id,service_id,starts_at_utc,ends_at_utc,local_date,status,client_note,coach_note_private,created_at,updated_at) VALUES (?,?,'service',1,2,'2026-11-06','CONFIRMED',?,?,1,1)").bind('booking-'+id,id,'OWN '+id,'PRIVATE COACH '+id).run();
  const own = await exportAccountRecords({db,actor:'client:a',userId:'a',role:'client'});
  assert.equal(own.sections.bookings.length,1); assert.equal(own.sections.bookings[0].id,'booking-a');
  assert.doesNotMatch(JSON.stringify(own),/PRIVATE COACH|booking-b|Client b/);
  const coach = await exportAccountRecords({db,actor:'coach:tanmay',userId:'primary',role:'main'});
  assert.equal(coach.sections.bookings.length,2); assert.match(JSON.stringify(coach),/PRIVATE COACH a/);
});
