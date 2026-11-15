import test from 'node:test';
import assert from 'node:assert/strict';
import { prepareClientAccountExit, clientLogoutUrl, navigateClientAccountExit } from '../src/clientAccountExit.js';
import { createClientSession } from '../src/clientSession.js';

function fixture(patch = {}) {
  const calls = [], state = { current: true, online: true, canLeave: true, pending: true, failure: null };
  const dependencies = {
    current: () => state.current, online: () => state.online, canLeave: () => state.canLeave,
    saveLocal: () => calls.push('save'),
    writer: { settled: async () => calls.push('settled'), currentFailure: () => state.failure },
    pending: () => state.pending,
    sync: async () => { calls.push('sync'); state.pending = false; }, ...patch,
  };
  return { state, calls, run: () => prepareClientAccountExit(dependencies) };
}

test('exit waits for local persistence and confirmed sync before becoming ready', async () => {
  const f = fixture();
  assert.equal(await f.run(), 'ready');
  assert.deepEqual(f.calls, ['save', 'settled', 'sync', 'save', 'settled']);
});

for (const [key, value, expected] of [['failure', { kind: 'quota' }, 'local-error'], ['online', false, 'offline'], ['current', false, 'changed'], ['canLeave', false, 'recording']]) {
  test(`exit keeps the app mounted for ${expected}`, async () => {
    const f = fixture(); f.state[key] = value;
    assert.equal(await f.run(), expected);
    assert.equal(f.calls.includes('sync'), false);
  });
}

test('a resolved sync request is insufficient while documents or local media remain pending', async () => {
  const f = fixture({ sync: async () => true });
  assert.equal(await f.run(), 'pending');
});

test('network failure preserves pending data and blocks account navigation', async () => {
  const f = fixture({ sync: async () => { throw new Error('offline'); } });
  assert.equal(await f.run(), 'pending');
});

test('account switch during sync never persists the previous account again', async () => {
  const f = fixture({ sync: async () => { f.state.current = false; } });
  assert.equal(await f.run(), 'changed');
  assert.deepEqual(f.calls, ['save', 'settled']);
});

test('failed local save after sync blocks navigation', async () => {
  const f = fixture({ sync: async () => { f.state.pending = false; f.state.failure = { kind: 'quota' }; } });
  assert.equal(await f.run(), 'local-error');
});

test('logout and account switch use Access logout with a fixed same-origin return', () => {
  assert.equal(clientLogoutUrl('https://client.example'), 'https://client.example/cdn-cgi/access/logout');
  const url = new URL(clientLogoutUrl('https://client.example', true));
  assert.equal(url.pathname, '/cdn-cgi/access/logout');
  assert.equal(url.searchParams.get('returnTo'), 'https://client.example/');
});

test('cancelled navigation keeps the session; actual pagehide freezes it once', () => {
  const win = new EventTarget(), calls = [];
  win.location = { origin: 'https://client.example', assign: url => calls.push(url) };
  win.addEventListener('tm-sign-out', () => calls.push('profile-ended'));
  navigateClientAccountExit({ win, session: { beginSignOut: () => calls.push('ended') } });
  assert.deepEqual(calls, ['https://client.example/cdn-cgi/access/logout']);
  win.dispatchEvent(new Event('pagehide'));
  win.dispatchEvent(new Event('pagehide'));
  assert.deepEqual(calls.slice(1), ['ended', 'profile-ended']);
});

test('failed navigation removes its session-ending hook', () => {
  const win = new EventTarget(); let ended = false;
  win.location = { origin: 'https://client.example', assign: () => { throw new Error('blocked'); } };
  assert.throws(() => navigateClientAccountExit({ win, session: { beginSignOut: () => { ended = true; } } }), /blocked/);
  win.dispatchEvent(new Event('pagehide'));
  assert.equal(ended, false);
});

test('only verified identity supplies the displayed email and sign-out cannot be revived by a late response', async () => {
  const pending = [], session = createClientSession(() => new Promise(resolve => pending.push(resolve)));
  session.initializeWith(async () => {});
  let check = session.verify();
  pending.shift()(Response.json({ owner: 'aaaaaaaaaaaaaaaa', member: true, email: 'verified@example.test' }));
  await check;
  assert.equal(session.getSnapshot().email, 'verified@example.test');
  check = session.verify();
  session.beginSignOut();
  pending.shift()(Response.json({ owner: 'aaaaaaaaaaaaaaaa', member: true, email: 'late@example.test' }));
  assert.equal(await check, false);
  assert.equal(session.getSnapshot().email, '');
  assert.equal(session.getSnapshot().status, 'signed-out');
  assert.equal(session.isCurrent('aaaaaaaaaaaaaaaa'), false);
  assert.equal(await session.verify(), false);
  await assert.rejects(session.request('/api/state'), /signed-out/);
  assert.equal(pending.length, 0);
});

test('a different verified owner never replaces the original displayed email', async () => {
  let owner = 'aaaaaaaaaaaaaaaa', email = 'first@example.test';
  const session = createClientSession(async () => Response.json({ owner, member: true, email }));
  session.initializeWith(async () => {});
  await session.verify();
  owner = 'bbbbbbbbbbbbbbbb'; email = 'second@example.test';
  assert.equal(await session.verify(), false);
  assert.equal(session.getSnapshot().status, 'changed');
  assert.equal(session.getSnapshot().email, 'first@example.test');
});
