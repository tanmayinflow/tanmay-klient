import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { INSTAGRAM_EXERCISES, INSTAGRAM_META, seedInstagramExpansion } from '../src/training/catalogInstagram.js';
import { seedExerciseExpansion } from '../src/training/catalogExpansion.js';
import { extensionFor } from '../src/training/catalogV2.js';
import { resolveExercise } from '../src/training/catalog.js';
import { INSTAGRAM_ART } from '../src/training/instagramArt.js';

test('an already migrated library receives 16 practical cards once, preserving personal rows, plans and later deletions', () => {
  const edited = { ...INSTAGRAM_EXERCISES[0], cz: 'Moje varianta', ez: 'my_exercise' };
  const custom = { id: 'my_exercise', cz: 'Vlastní cvik' };
  const original = {
    bridgeContentAudit20261022:true,bridgeFoundations20261022:true,horizontalPressFoundations20261022:true,horizontalPullFoundations20261022:true,loadedSteps20261022:true, stepContentAudit20261022: true, squatContentAudit20261022: true, exerciseExpansion20261011: true, exerciseAudit20261013: true, kettlebellExpansion20261015: true, instagramContinuation20261015: true, instagramClientNext20261016: true,instagramDeepReview20261016:true,
    tEx: [edited, custom], tPl: [{ id: 'plan' }], tWo: [{ id: 'workout' }], tLog: [{ exId: edited.id, seconds: 12 }],
  };
  const snapshot = structuredClone(original);
  const result = seedExerciseExpansion(original);
  assert.equal(result.tEx.length, INSTAGRAM_EXERCISES.length + 1);
  assert.equal(result.tEx[0], edited);
  assert.equal(result.tEx[1], custom);
  for (const key of ['tPl', 'tWo', 'tLog']) assert.equal(result[key], original[key]);
  assert.deepEqual(original, snapshot);
  assert.equal(result.instagramExpansion20261015, true);
  assert.equal(result.practicalExerciseAudit20261015, true);
  assert.ok(result.tEx.every(row => row.id.startsWith('ig26_') || row.id === custom.id));
  assert.equal(seedExerciseExpansion(result), result);
  const deleted = { ...result, tEx: result.tEx.filter(row => row.id !== edited.id) };
  assert.equal(seedExerciseExpansion(deleted), deleted);
});

test('new progression links resolve locally without recreating targets that a user removed', () => {
  const edited = { id: 'ig26_user_edit', ez: 'personal_missing_link' };
  const result = seedInstagramExpansion({ tEx: [edited] }, [
    { id: 'ig26_new', ez: 'removed_baseline', hd: 'ig26_next' },
    { id: 'ig26_next', ez: 'ig26_new', hd: null },
    { id: 'ig26_next', cz: 'Duplicate input' },
    { id: 'kb26_not_this_migration' },
  ]);
  assert.equal(result.tEx.length, 3);
  assert.equal(result.tEx[0], edited);
  assert.equal(result.tEx[1].ez, null);
  assert.equal(result.tEx[1].hd, 'ig26_next');
  assert.equal(result.tEx[2].ez, 'ig26_new');
  assert.equal(seedInstagramExpansion(result), result);
  assert.equal(seedInstagramExpansion(null), null);
  assert.equal(seedInstagramExpansion(undefined), undefined);
});

test('client-filtered practical cards retain only links in that client catalogue', () => {
  const available = ['drep', 'plank'];
  const seed = extensionFor(available);
  const ids = new Set([...available, ...seed.map(row => row.id)]);
  const result = seedInstagramExpansion({ tEx: [] }, seed);
  assert.equal(result.tEx.length, 16);
  for (const row of result.tEx) {
    assert.ok(row.id.startsWith('ig26_'));
    for (const key of ['ez', 'hd']) assert.ok(!row[key] || ids.has(row[key]), row.id + ':' + key);
  }
});

test('practical content has bilingual instructions, public sources, suitable measurement and explicit coaching selection', () => {
  assert.equal(INSTAGRAM_EXERCISES.length, 16);
  assert.equal(new Set(INSTAGRAM_EXERCISES.map(row => row.id)).size, 16);
  const expected = {
    ig26_longlever_bridge: 'DURATION', ig26_horse_stance: 'DURATION', ig26_wall_elbow_lat: 'DURATION',
    ig26_band_tke: 'REPS_ONLY', ig26_seated_jump: 'BODYWEIGHT_REPS', ig26_slider_pike: 'BODYWEIGHT_REPS',
  };
  for (const row of INSTAGRAM_EXERCISES) {
    for (const field of ['pos', 'exe', 'wat', 'pro', 'foc']) {
      assert.equal(row[field].length, 2, row.id + ':' + field);
      assert.ok(row[field].every(value => typeof value === 'string' && value.length > 10), row.id + ':' + field);
    }
    assert.match(row.source.url, /^https:\/\//);
    assert.ok(row.source.instagramUrls.length > 0);
    assert.ok(row.source.instagramUrls.every(url => /^https:\/\/www.instagram.com\/[^/]+\/reel\/[^/]+\/$/.test(url)));
    assert.equal(row.genRule, 'explicit');
    const resolved = resolveExercise(row, INSTAGRAM_META[row.id]);
    assert.equal(resolved.clientVisible, true);
    assert.equal(resolved.generatorEligible, false);
    assert.ok(resolved.searchAliases.length > 0);
    if (expected[row.id]) assert.equal(resolved.measurementType, expected[row.id], row.id);
  }
});

test('each practical card has a separate reviewed illustration and all six local render assets', () => {
  assert.deepEqual(new Set(Object.keys(INSTAGRAM_ART)), new Set(INSTAGRAM_EXERCISES.map(row => row.id)));
  const hashes = new Set();
  for (const [id, art] of Object.entries(INSTAGRAM_ART)) {
    assert.equal(art.appId, id);
    const hash = art.primary.sourceSha256 || art.sourceSha256;
    assert.match(hash, /^[a-f0-9]{64}$/);
    hashes.add(hash);
    for (const key of ['thumb', 'detail', 'inkThumb', 'inkDetail', 'fillThumb', 'fillDetail']) {
      assert.ok(existsSync(new URL('../public' + art.primary[key], import.meta.url)), id + ':' + key);
    }
  }
  assert.equal(hashes.size, INSTAGRAM_EXERCISES.length);
});
