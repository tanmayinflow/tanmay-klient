import test from 'node:test';
import assert from 'node:assert/strict';
import { createSyncRecovery } from '../src/shared/product/syncRecovery.js';

function harness(retry) {
  const win = new EventTarget(), doc = new EventTarget(), timers = new Map();
  doc.visibilityState = 'visible';
  let id = 0, clock = 0, online = true;
  const stop = createSyncRecovery({ retry, win, doc, online: () => online,
    now: () => clock, schedule: (fn, delay) => { timers.set(++id, { fn, delay }); return id; }, cancel: id => timers.delete(id) });
  return { win, doc, timers, stop, offline: value => { online = !value; },
    advance: ms => { clock += ms; },
    async tick() { const entry = timers.entries().next().value; assert.ok(entry, 'scheduled retry'); timers.delete(entry[0]); clock += entry[1].delay; await entry[1].fn(); await new Promise(resolve => setImmediate(resolve)); },
  };
}

test('transient failure recovers without a new edit or reload and stops after acknowledgement', async () => {
  let calls = 0;
  const h = harness(async () => ++calls === 2);
  await h.tick(); assert.equal(calls, 1);
  await h.tick(); assert.equal(calls, 2); assert.equal(h.timers.size, 0);
  h.win.dispatchEvent(new Event('focus')); assert.equal(calls, 2);
});

test('persistent authentication failure uses three bounded attempts, not an endless loop', async () => {
  let calls = 0;
  const h = harness(async () => { calls++; return false; });
  for (let i = 0; i < 3; i++) await h.tick();
  assert.equal(calls, 3); assert.equal(h.timers.size, 0);
  h.advance(5001); h.win.dispatchEvent(new Event('pageshow'));
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(calls, 4); h.stop();
});

test('background/offline PWA waits for foreground and coalesces simultaneous wake events', async () => {
  let calls = 0, release;
  const h = harness(() => { calls++; return new Promise(resolve => { release = resolve; }); });
  h.doc.visibilityState = 'hidden'; await h.tick(); assert.equal(calls, 0);
  h.doc.visibilityState = 'visible'; h.offline(true); h.win.dispatchEvent(new Event('focus')); assert.equal(calls, 0);
  h.offline(false); h.win.dispatchEvent(new Event('online'));
  h.win.dispatchEvent(new Event('focus')); h.doc.dispatchEvent(new Event('visibilitychange'));
  assert.equal(calls, 1); h.stop(); release(false);
  await new Promise(resolve => setImmediate(resolve)); assert.equal(h.timers.size, 0);
});

test('disposing recovery cancels pending work', () => {
  let calls = 0;
  const h = harness(async () => { calls++; return true; }); h.stop();
  h.win.dispatchEvent(new Event('online')); h.doc.dispatchEvent(new Event('visibilitychange'));
  assert.equal(calls, 0); assert.equal(h.timers.size, 0);
});
