import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import worker from '../worker/index.js';
import { makeEnv, req } from './helpers/env.js';
import { storedCoachShare } from '../src/shared/product/coachShare.js';
import { exportAccountRecords } from '../src/shared/product/accountBackup.js';
import { fulfilmentFrom } from '../src/training/adapters.js';
import { makeSession } from '../src/training/sessionModel.js';
import { assignedTrainingShare, isCoachAssignedSession } from '../src/training/coachShare.js';

const main = JSON.parse(readFileSync(new URL('../package.json', import.meta.url))).name === 'tanmay-web';
const delivery = {
  plans: [{ id: 'plan', sessions: [{ id: 'slot', templateId: 'template' }] }],
  templates: [{ id: 'template', blocks: [{ exId: 'squat', measurementType: 'REPS_ONLY' }] }],
};
const session = {
  id: 'result', planId: 'plan', planSessionId: 'slot', templateId: 'template', date: '2026-11-21',
  note: 'PRIVATE personal note', coachMessage: 'For my coach', painJoints: ['PRIVATE'],
  blocks: [{ id: 'block', exId: 'squat', measurementType: 'REPS_ONLY', sets: [
    { id: 'set', completed: true, actual: { reps: 8, privateValue: 'PRIVATE' }, note: 'PRIVATE' },
  ] }, { id: 'other', exId: 'PRIVATE', sets: [] }],
};
const raw = JSON.stringify({ training: { v: 2, at: 1, sessions: [
  session, { ...session, id: 'PRIVATE', planId: null }, { ...session, planSessionId: 'PRIVATE' },
], sched: { plan: { slot: '2026-11-21', personal: '2026-11-22' }, personal: { private: '2026-11-21' } } } });
const check = share => {
  assert.deepEqual(share.training.sessions.map(s => s.id), ['result']);
  assert.equal(share.training.sessions[0].coachMessage, 'For my coach');
  assert.equal(Object.hasOwn(share.training.sessions[0], 'note'), false);
  assert.deepEqual(share.training.sessions[0].blocks[0].sets[0].actual, { reps: 8 });
  assert.deepEqual(share.training.sched, { plan: { slot: '2026-11-21' } });
  assert.doesNotMatch(JSON.stringify(share), /PRIVATE|painJoints/);
};

test('old snapshots are projected against the current delivery and exact session before disclosure', () => {
  check(storedCoachShare(raw, JSON.stringify(delivery)));
  const legacy = { training: { sessions: [{ ...session, coachMessage: undefined }] } };
  const old = storedCoachShare(JSON.stringify(legacy), JSON.stringify(delivery)).training.sessions[0];
  assert.equal(Object.hasOwn(old, 'coachMessage'), false);
  assert.doesNotMatch(JSON.stringify(old), /PRIVATE/);
  assert.deepEqual(storedCoachShare(raw, null).training.sessions, []);
  assert.equal(storedCoachShare('{', null), null);
  assert.equal(storedCoachShare(null, null), null);
});

test('runner results share only explicitly composed messages; ordinary notes remain with the local recording', () => {
  const mine = makeSession({ ...session, state: 'done' });
  const unrelated = makeSession({ ...mine, id: 'other', planSessionId: null });
  assert.equal(isCoachAssignedSession(mine, delivery), true);
  assert.equal(isCoachAssignedSession(unrelated, delivery), false);
  const results = fulfilmentFrom([mine, unrelated], { now: 5 });
  const shared = assignedTrainingShare(results, delivery);
  assert.deepEqual(shared.sessions.map(s => s.coachMessage), ['For my coach']);
  assert.doesNotMatch(JSON.stringify(shared), /PRIVATE/);
  assert.equal(mine.note, 'PRIVATE personal note');
});

test(main ? 'coach list and full backup redact historical unscoped member snapshots' :
  'chunked uploads recheck the assignment at commit when a delivery changes', async () => {
  const email = 'member@example.test', id = 'member-example-test';
  const env = makeEnv({ OWNER_EMAIL: email });
  if (main) {
    const db = env.KLIENT_DB;
    await db.exec('CREATE TABLE members(user_id TEXT PRIMARY KEY,email TEXT,name TEXT,joined_at INTEGER,share TEXT,modules TEXT);CREATE TABLE state(user_id TEXT PRIMARY KEY,doc TEXT,version INTEGER,updated_at INTEGER);CREATE TABLE plans(user_id TEXT PRIMARY KEY,doc TEXT,updated_at INTEGER);');
    await db.prepare('INSERT INTO members(user_id,email,share) VALUES(?,?,?)').bind(id, email, raw).run();
    await db.prepare('INSERT INTO plans VALUES(?,?,1)').bind(id, JSON.stringify(delivery)).run();
    const read = async () => {
      const response = await worker.fetch(req('/api/klienti', { email }), env);
      assert.equal(response.status, 200);
      return (await response.json()).klienti[0].share;
    };
    check(await read());
    const backup = await exportAccountRecords({ db, actor: 'coach:tanmay', userId: 'primary', role: 'main' });
    check(JSON.parse(backup.sections.members[0].share));
    await db.prepare("UPDATE plans SET doc='null' WHERE user_id=?").bind(id).run();
    assert.deepEqual((await read()).training.sessions, []);
  } else {
    const call = (path, body) => worker.fetch(req(path, { email, method: path === '/api/join' ? 'POST' : 'PUT', body }), env);
    assert.equal((await call('/api/join', { word: 'otevri se' })).status, 200);
    await env.DB.prepare('INSERT INTO plans VALUES(?,?,1)').bind(id, JSON.stringify(delivery)).run();
    const data = JSON.stringify({ coll: {} }), sha256 = createHash('sha256').update(data).digest('hex');
    const start = await call('/api/state?transport=chunks&action=start', { bytes: data.length, parts: 1, rev: 0, sha256, share: JSON.parse(raw) });
    assert.equal(start.status, 200);
    const { uploadId } = await start.json();
    assert.equal((await call('/api/state?transport=chunks&action=part', { uploadId, part: 0, data, sha256 })).status, 200);
    // Represents metadata retained from a pre-upgrade client and an assignment withdrawn mid-upload.
    await env.DB.prepare('UPDATE state_uploads SET metadata=? WHERE user_id=?').bind(JSON.stringify({ hasShare: true, shareValue: raw, modulesValue: null }), id).run();
    await env.DB.prepare("UPDATE plans SET doc='null' WHERE user_id=?").bind(id).run();
    assert.equal((await call('/api/state?transport=chunks&action=commit', { uploadId })).status, 200);
    const row = await env.DB.prepare('SELECT share FROM members WHERE user_id=?').bind(id).first();
    assert.deepEqual(JSON.parse(row.share).training.sessions, []);
    assert.doesNotMatch(row.share, /PRIVATE/);
  }
});
