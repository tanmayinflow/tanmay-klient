import test from 'node:test';
import assert from 'node:assert/strict';
import { HABIT_DEFAULTS, restorePracticeHabitDefaults, keepRestoredHabitTranslations } from '../src/shared/product/practice.js';

test('explicit restoration archives a single custom habit and leaves its recorded slot untouched', () => {
  const original = Object.freeze({ slot: 0, name: 'Synthetic test habit', icon: '○', iconId: 'tree' });
  const coll = Object.freeze({ habitDefs: Object.freeze([original]), unrelated: Object.freeze({ keep: true }) });
  const days = Object.freeze({ '2026-10-12': Object.freeze({ h: Object.freeze([1]), note: 'Synthetic retained note' }) });
  const before = JSON.stringify({ coll, days });
  const result = restorePracticeHabitDefaults(coll, days);
  assert.equal(result.habitDefs.filter(row => !row.archived).length, 9);
  assert.deepEqual(result.habitDefs.slice(0, 9).map(row => row.cz), HABIT_DEFAULTS.map(row => row.cz));
  assert.deepEqual(result.habitDefs.slice(0, 9).map(row => row.en), HABIT_DEFAULTS.map(row => row.en));
  assert.deepEqual(result.habitDefs.at(-1), { ...original, archived: true });
  assert.ok(result.habitDefs.slice(0, 9).every(row => row.slot > 8));
  assert.equal(result.unrelated, coll.unrelated);
  assert.equal(JSON.stringify({ coll, days }), before);
});

test('new defaults allocate beyond deleted, sparse and historical Main slots', () => {
  const sparse = []; sparse[24] = 2;
  const days = { '2026-10-01': { h: sparse }, '2026-10-02': { h: { 30: 1 } } };
  const flow = [{ d: '2020-01-01', h: Array(41).fill(0) }];
  const coll = { habitDefs: [{ slot: 47, name: 'An archived custom', archived: true }] };
  const before = JSON.stringify({ coll, days, flow });
  const restored = restorePracticeHabitDefaults(coll, days, flow);
  assert.deepEqual(restored.habitDefs.slice(0, 9).map(row => row.slot), [48,49,50,51,52,53,54,55,56]);
  assert.equal(restored.habitDefs.at(-1), coll.habitDefs[0]);
  assert.equal(JSON.stringify({ coll, days, flow }), before);
});

test('repeated restoration and save/reload are idempotent without duplicate archives', () => {
  const days = { '2026-10-12': { h: [1, 2, 0] } };
  const once = restorePracticeHabitDefaults({ habitDefs: [{ slot: 0, name: 'My own practice' }] }, days);
  assert.equal(restorePracticeHabitDefaults(once, days), once);
  const reload = JSON.parse(JSON.stringify(once));
  assert.equal(restorePracticeHabitDefaults(reload, days), reload);
  assert.equal(reload.habitDefs.length, 10);
});

test('already correct defaults are unchanged and a matching archived default keeps its own history', () => {
  for (const coll of [{}, { habitDefs: HABIT_DEFAULTS }]) assert.equal(restorePracticeHabitDefaults(coll), coll);
  const rows = HABIT_DEFAULTS.map(row => row.slot === 2 ? { ...row, archived: true } : row);
  const restored = restorePracticeHabitDefaults({ habitDefs: rows }, { '2026-10-12': { h: [0, 0, 1] } });
  assert.equal(restored.habitDefs.length, 9);
  assert.equal(restored.habitDefs[2].slot, 2);
  assert.equal(restored.habitDefs[2].archived, false);
  assert.equal(restorePracticeHabitDefaults(restored), restored);
});

test('renamed or re-illustrated restored defaults remain archived rather than overwritten', () => {
  for (const patch of [{ name: 'My own renamed practice' }, { iconId: 'tree' }, { icon: 'Custom mark' }]) {
    const first = restorePracticeHabitDefaults({ habitDefs: [] });
    const changed = { ...first.habitDefs[0], ...patch };
    const coll = { habitDefs: [changed, ...first.habitDefs.slice(1)] };
    const days = { '2026-10-12': { h: Array(changed.slot).fill(0).concat(1) } };
    const next = restorePracticeHabitDefaults(coll, days);
    assert.equal(next.habitDefs.filter(row => !row.archived).length, 9);
    assert.notEqual(next.habitDefs[0].slot, changed.slot);
    assert.deepEqual(next.habitDefs.at(-1), { ...changed, archived: true });
    assert.equal(restorePracticeHabitDefaults(next, days), next);
  }
});

test('ordinary editor operations keep restored labels language-aware and preserve explicit custom names', () => {
  const restored = restorePracticeHabitDefaults({ habitDefs: [] }).habitDefs;
  for (const lang of ['cz', 'en']) {
    const displayed = restored.map(row => ({ ...row, name: row[lang] }));
    displayed[0] = { ...displayed[0], name: 'My custom name' };
    displayed[1] = { ...displayed[1], iconId: 'tree' };
    const saved = keepRestoredHabitTranslations(displayed);
    assert.equal(saved[0].name, 'My custom name');
    assert.ok(saved.slice(1).every(row => !Object.hasOwn(row, 'name')));
    assert.equal(saved[1].iconId, 'tree', 'changing only the icon must not freeze the label');
    assert.deepEqual(saved.slice(1).map(row => row.cz), HABIT_DEFAULTS.slice(1).map(row => row.cz));
    assert.deepEqual(saved.slice(1).map(row => row.en), HABIT_DEFAULTS.slice(1).map(row => row.en));
  }
  const own = [{ slot: 1, name: 'My name', cz: 'My name', en: 'Own name' }];
  assert.equal(keepRestoredHabitTranslations(own)[0], own[0]);
});

test('restored defaults have the same vector icons regardless of their new slot numbers', () => {
  const restored = restorePracticeHabitDefaults({ habitDefs: [{ slot: 60, name: 'Own' }] });
  assert.deepEqual(restored.habitDefs.slice(0, 9).map(row => row.iconId), ['water','sprout','guitar','training','phone-rest','book','lotus','fire','food']);
  assert.deepEqual(restored.habitDefs.slice(0, 9).map(row => row.practiceDefault), [0,1,2,3,4,5,6,7,8]);
});

test('invalid or ambiguous persisted definitions are never rewritten by restoration', () => {
  for (const rows of [[null], [{ slot: -1 }], [{ slot: 0 }, { slot: 0 }], [{ slot: 100000 }]]) {
    const coll = { habitDefs: rows };
    assert.equal(restorePracticeHabitDefaults(coll), coll);
  }
});
