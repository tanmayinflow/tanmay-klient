import test from 'node:test';
import assert from 'node:assert/strict';
import { beginNavigationSwipe, navigationSwipeBlocked, navigationSwipeDirection, watchNavigationSelection } from '../src/shared/ui/navigationGesture.js';
import { createScreenWakeController, observeReadingScreen } from '../src/shared/ui/screenWake.js';

function events(extra = {}) {
  const listeners = new Map();
  return Object.assign(extra, {
    addEventListener(type, fn) { if (!listeners.has(type)) listeners.set(type, new Set()); listeners.get(type).add(fn); },
    removeEventListener(type, fn) { listeners.get(type)?.delete(fn); },
    emit(type) { for (const fn of listeners.get(type) || []) fn(); },
    count() { return [...listeners.values()].reduce((n, x) => n + x.size, 0); },
  });
}
function gestureDoc() {
  return events({ selected: false, enabled: true, documentElement: { getAttribute() { return this.doc.enabled ? 'on' : 'off'; } },
    getSelection() { return { isCollapsed: !this.selected, rangeCount: 1 }; }, activeElement: null });
}
function gestureEvent(x = 250, y = 200, target = { closest: () => null }, touches = 1) {
  const point = { clientX: x, clientY: y };
  return { target, touches: Array.from({ length: touches }, () => point), changedTouches: [point] };
}
function gestureHarness() { const doc = gestureDoc(); doc.documentElement.doc = doc; return doc; }

test('navigation requires deliberate long horizontal movement; no short fast flick or diagonal', () => {
  const doc = gestureHarness(), start = beginNavigationSwipe(gestureEvent(), { doc, now: 0 });
  assert.equal(navigationSwipeDirection(start, gestureEvent(90, 210), { doc, now: 180 }), 1);
  assert.equal(navigationSwipeDirection(start, gestureEvent(340, 200), { doc, now: 20 }), 0);
  assert.equal(navigationSwipeDirection(start, gestureEvent(100, 300), { doc, now: 180 }), 0);
});

test('disabled swipes, multiple fingers, controls and active editors do not start navigation', () => {
  const doc = gestureHarness(); doc.enabled = false;
  assert.equal(beginNavigationSwipe(gestureEvent(), { doc }), null);
  doc.enabled = true;
  assert.equal(beginNavigationSwipe(gestureEvent(250, 200, undefined, 2), { doc }), null);
  assert.equal(beginNavigationSwipe(gestureEvent(250, 200, { closest: () => ({}) }), { doc }), null);
  doc.activeElement = { isContentEditable: true };
  assert.equal(beginNavigationSwipe(gestureEvent(), { doc }), null);
});

test('selection before or during gesture and long press cannot turn the page even after collapse', () => {
  const doc = gestureHarness(); const stop = watchNavigationSelection(doc);
  doc.selected = true;
  assert.equal(beginNavigationSwipe(gestureEvent(), { doc }), null);
  doc.selected = false;
  const start = beginNavigationSwipe(gestureEvent(), { doc, now: 0 });
  doc.selected = true; doc.emit('selectionchange'); doc.selected = false;
  assert.equal(navigationSwipeDirection(start, gestureEvent(80), { doc, now: 250 }), 0);
  const hold = beginNavigationSwipe(gestureEvent(), { doc, now: 0 });
  assert.equal(navigationSwipeBlocked(hold, gestureEvent(80), { doc, now: 550 }), true);
  assert.equal(navigationSwipeDirection(hold, gestureEvent(70), { doc, now: 600 }), 0);
  stop(); assert.equal(doc.count(), 0);
});

test('disabling navigation during an active swipe cancels it', () => {
  const doc = gestureHarness(), start = beginNavigationSwipe(gestureEvent(), { doc, now: 0 });
  doc.enabled = false;
  assert.equal(navigationSwipeDirection(start, gestureEvent(80), { doc, now: 250 }), 0);
});

const flush = async () => { for (let i = 0; i < 8; i++) await Promise.resolve(); };
function wakeHarness() {
  const requests = [], doc = events({ visibilityState: 'visible' });
  const nav = { wakeLock: { request(type) { assert.equal(type, 'screen'); return new Promise((resolve, reject) => requests.push({ resolve, reject })); } } };
  const lock = () => events({ releases: 0, release() { this.releases++; this.emit('release'); return Promise.resolve(); } });
  return { requests, doc, nav, lock };
}

test('late wake-lock grant is released after the reading session closes', async () => {
  const h = wakeHarness(), controller = createScreenWakeController(h);
  controller.setActive(true); await flush(); controller.dispose();
  const lock = h.lock(); h.requests[0].resolve(lock); await flush();
  assert.equal(lock.releases, 1); assert.equal(h.doc.count(), 0);
});

test('wake controller has one pending request and releases on hidden page, reacquiring on visible', async () => {
  const h = wakeHarness(), controller = createScreenWakeController(h);
  controller.setActive(true); h.doc.emit('visibilitychange'); controller.setActive(true); await flush();
  assert.equal(h.requests.length, 1);
  const lock = h.lock(); h.requests[0].resolve(lock); await flush();
  h.doc.visibilityState = 'hidden'; h.doc.emit('visibilitychange'); await flush();
  assert.equal(lock.releases, 1);
  h.doc.visibilityState = 'visible'; h.doc.emit('visibilitychange'); await flush();
  assert.equal(h.requests.length, 2); controller.dispose();
  const second = h.lock(); h.requests[1].resolve(second); await flush(); assert.equal(second.releases, 1);
});

test('a pending grant across off/on cannot leak or block the new reading session', async () => {
  const h = wakeHarness(), controller = createScreenWakeController(h);
  controller.setActive(true); await flush(); controller.setActive(false); controller.setActive(true);
  const old = h.lock(); h.requests[0].resolve(old); await flush();
  assert.equal(old.releases, 1); assert.equal(h.requests.length, 2);
  const current = h.lock(); h.requests[1].resolve(current); await flush(); controller.dispose();
  assert.equal(current.releases, 1);
});

test('system release or permission refusal is respected without repeated requests', async () => {
  const h = wakeHarness(), controller = createScreenWakeController(h);
  controller.setActive(true); await flush(); const lock = h.lock(); h.requests[0].resolve(lock); await flush();
  lock.emit('release'); controller.setActive(true); await flush(); assert.equal(h.requests.length, 1);
  controller.setActive(false); controller.setActive(true); await flush();
  h.requests[1].reject(new Error('NotAllowedError')); await flush(); controller.setActive(true); await flush();
  assert.equal(h.requests.length, 2); controller.dispose();
});

test('wake status follows the current visible lock and retries only on request or return', async () => {
  const h = wakeHarness(), states = [];
  const controller = createScreenWakeController({...h, onStatus: state => states.push(state)});
  controller.setActive(true); await flush();
  assert.deepEqual(states, ['requesting']);
  h.requests[0].reject(new Error('denied')); await flush();
  controller.setActive(true); h.doc.emit('visibilitychange'); await flush();
  assert.equal(states.at(-1), 'denied'); assert.equal(h.requests.length, 1);
  controller.retry(); await flush();
  const lock = h.lock(); h.requests[1].resolve(lock); await flush();
  assert.equal(states.at(-1), 'active');
  lock.emit('release'); assert.equal(states.at(-1), 'released');
  h.doc.visibilityState = 'hidden'; h.doc.emit('visibilitychange');
  assert.equal(states.at(-1), 'hidden');
  h.doc.visibilityState = 'visible'; h.doc.emit('visibilitychange'); await flush();
  assert.equal(states.at(-1), 'requesting');
  controller.setActive(false); h.requests[2].reject(new Error('obsolete')); await flush();
  assert.equal(states.at(-1), 'idle'); controller.dispose();
});

test('unsupported browser reports unavailable; a request never implies an active lock', async () => {
  const h = wakeHarness(), states = [];
  const controller = createScreenWakeController({doc:h.doc, nav:{}, onStatus: state => states.push(state)});
  controller.setActive(true); controller.retry(); await flush();
  assert.deepEqual(states, ['unavailable']);
  controller.dispose(); assert.equal(states.at(-1), 'idle');
});

test('reading observer requests only for visible reading surfaces and releases when closed', async () => {
  const h = wakeHarness(); let elements = [], listener, disconnected = false;
  h.doc.body = {}; h.doc.querySelectorAll = () => elements;
  class Observer { constructor(fn) { listener = fn; } observe() {} disconnect() { disconnected = true; } }
  const stop = observeReadingScreen({ ...h, Observer }); await flush(); assert.equal(h.requests.length, 0);
  elements = [{ closest: () => null, getClientRects: () => [{}] }]; listener(); await flush();
  const lock = h.lock(); h.requests[0].resolve(lock); await flush();
  elements = []; listener(); await flush(); assert.equal(lock.releases, 1);
  stop(); assert.equal(disconnected, true); assert.equal(h.doc.count(), 0);
});
