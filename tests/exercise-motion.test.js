import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import { EXERCISE_MOTION, exerciseMotionFor, claimMotionPlayer, releaseMotionPlayer } from '../src/shared/product/exerciseMotion.js';

test('motion resolves exact reviewed ids, never a related or custom exercise', () => {
  assert.equal(exerciseMotionFor({ id: 'drep' }), EXERCISE_MOTION.drep);
  for (const row of [null, {}, { id: 'jumpsquat', pat: 'drep' }, { id: 'custom', cz: 'Dřep' }, 'toString', '__proto__']) {
    assert.equal(exerciseMotionFor(row), null);
  }
});
test('each motion asset is versioned, present and within the per-clip budget', () => {
  for (const entry of Object.values(EXERCISE_MOTION)) {
    assert.match(entry.src, /^\/exercise-motion\/[a-z0-9_-]+-[a-f0-9]{16}\.mp4$/);
    const bytes = fs.readFileSync(new URL(`../public${entry.src}`, import.meta.url));
    assert.equal(bytes.length, entry.bytes);
    assert.ok(bytes.length < 1024 * 1024);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), entry.sha256);
    assert.equal(bytes.subarray(4, 8).toString(), 'ftyp');
    assert.ok(fs.statSync(new URL(`../public${entry.poster}`, import.meta.url)).size > 0);
  }
});
test('starting a second motion pauses the first and closing an old player cannot release the new one', () => {
  const counts = [0, 0, 0];
  const players = counts.map((_, i) => ({ pause() { counts[i]++; } }));
  claimMotionPlayer(players[0]);
  claimMotionPlayer(players[1]);
  assert.deepEqual(counts, [1, 0, 0]);
  releaseMotionPlayer(players[0]);
  claimMotionPlayer(players[2]);
  assert.deepEqual(counts, [2, 1, 0]);
  releaseMotionPlayer(players[2]);
});
test('service worker leaves public motion and byte ranges to native HTTP without opening Cache Storage', () => {
  const listeners = {};
  let cacheCalls = 0;
  vm.runInNewContext(fs.readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8'), {
    self: { addEventListener: (name, callback) => { listeners[name] = callback; } },
    location: { origin: 'https://app.test' }, URL,
    caches: { open() { cacheCalls++; throw Error('Unexpected motion cache'); } },
  });
  for (const request of [
    new Request('https://app.test' + EXERCISE_MOTION.drep.src),
    new Request('https://app.test' + EXERCISE_MOTION.drep.src, { headers: { Range: 'bytes=0-1023' } }),
    new Request('https://app.test/other-media.mp4', { headers: { Range: 'bytes=1024-' } }),
  ]) {
    let intercepted = false;
    listeners.fetch({ request, respondWith() { intercepted = true; } });
    assert.equal(intercepted, false);
  }
  assert.equal(cacheCalls, 0);
});
