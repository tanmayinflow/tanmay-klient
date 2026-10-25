import test from 'node:test';
import assert from 'node:assert/strict';
import { HABIT_DEFAULTS, resolvePracticeHabitLabels, restorePracticeHabitDefaults, makeWbZnameni, tmWbOf } from '../src/shared/product/practice.js';

const previous = { slot: 1, icon: '🌾', cz: 'Práce na značce', en: 'Brand work' };

test('Business is the new bilingual default, without changing its history slot or icon', () => {
  assert.deepEqual(HABIT_DEFAULTS[1], { slot: 1, icon: '🌾', cz: 'Podnikání', en: 'Business' });
  for (const name of [undefined, 'Práce na značce', 'Brand work']) {
    const row = Object.freeze({ ...previous, ...(name ? { name } : {}), archived: true, customField: 'keep' });
    const input = Object.freeze([row]);
    const result = resolvePracticeHabitLabels(input);
    assert.deepEqual(result, [{ slot: 1, icon: '🌾', cz: 'Podnikání', en: 'Business', archived: true, customField: 'keep' }]);
    assert.equal(input[0], row);
    assert.equal(row.cz, 'Práce na značce');
    assert.equal(resolvePracticeHabitLabels(result), result);
  }
});

test('restored defaults retain their higher historical slot and custom icon through rename', () => {
  const row = { ...previous, slot: 29, practiceDefault: 1, iconId: 'tree' };
  assert.deepEqual(resolvePracticeHabitLabels([row]), [{ ...row, cz: 'Podnikání', en: 'Business' }]);
  assert.deepEqual(resolvePracticeHabitLabels([{ slot: 1, icon: '🌾', name: 'Brand work' }]), [HABIT_DEFAULTS[1]]);
});

test('editing a peer does not freeze the renamed default in the current language', () => {
  for (const name of ['Podnikání', 'Business']) {
    const saved = [{ ...HABIT_DEFAULTS[1], name }];
    const resolved = resolvePracticeHabitLabels(saved);
    assert.deepEqual(resolved, [HABIT_DEFAULTS[1]]);
    assert.equal(resolvePracticeHabitLabels(resolved), resolved);
  }
  const custom = [{ ...HABIT_DEFAULTS[1], name: 'My own business practice' }];
  assert.equal(resolvePracticeHabitLabels(custom), custom);
});

test('custom names, unrelated slots and ambiguous incomplete labels are never renamed', () => {
  for (const patch of [{ name: 'My business practice' }, { slot: 2 }, { practiceDefault: 2 }, { cz: 'My own practice' }, { en: 'Something else' }, { slot: -1 }]) {
    const rows = [{ ...previous, ...patch }];
    assert.equal(resolvePracticeHabitLabels(rows), rows);
  }
  for (const row of [{ slot: 1, name: 'Brand work', icon: 'different' }, { slot: 1, cz: 'Práce na značce' }, null]) {
    const rows = [row];
    assert.equal(resolvePracticeHabitLabels(rows), rows);
  }
});

test('deleted definitions, explicit emptiness, ordering and day records survive unchanged', () => {
  const custom = Object.freeze({ slot: 18, name: 'My practice' });
  const rows = Object.freeze([custom, Object.freeze(previous)]);
  const days = Object.freeze({ '2026-10-25': Object.freeze({ h: Object.freeze([0, 2, 1]), wb: Object.freeze({ grat: true, bodhi: false, wild: true, well: 4 }) }) });
  const before = JSON.stringify(days);
  const result = resolvePracticeHabitLabels(rows);
  assert.equal(result[0], custom);
  assert.deepEqual(result.map(row => row.slot), [18, 1]);
  for (const empty of [[], undefined, null]) assert.equal(resolvePracticeHabitLabels(empty), empty);
  assert.equal(JSON.stringify(days), before);
});

test('explicit default restoration reuses the renamed slot rather than creating a new history', () => {
  const rows = HABIT_DEFAULTS.map(row => row.slot === 1 ? previous : row);
  const days = { '2026-10-25': { h: [0, 2, 0] } };
  const before = JSON.stringify(days);
  const result = restorePracticeHabitDefaults({ habitDefs: rows }, days);
  assert.equal(result.habitDefs.length, 9);
  assert.equal(result.habitDefs[1].slot, 1);
  assert.equal(result.habitDefs[1].cz, 'Podnikání');
  assert.equal(restorePracticeHabitDefaults(result, days), result);
  assert.equal(JSON.stringify(days), before);
});

test('Seals use the exact requested Czech meaning and the original persisted keys and icons', () => {
  const icons = { TmWbMiska() {}, TmWbDiamant() {}, TmWbKruh() {} };
  const seals = makeWbZnameni(icons);
  assert.deepEqual(seals.map(({ k, cz, pCz }) => [k, cz, pCz]), [
    ['grat', 'Přijímám', 'Dobré i těžké beru jako učitele. Kultivuji vděčnost.'],
    ['bodhi', 'Probouzím', 'Srdce, které nikoho nevynechá. Mým záměrem je soucit.'],
    ['wild', 'Konám', 'Ze záměru se dnes stal skutek. Mysl přešla v čin.'],
  ]);
  assert.deepEqual(seals.map(row => row.Ic), Object.values(icons));
  assert.deepEqual(seals.map(row => row.en), ['I accept', 'I awaken', 'I act']);
  const stored = { grat: true, bodhi: false, wild: true, mood: 2, energy: 3, well: 4, sleep: 7 };
  const data = { edits: { '2026-10-25': { wb: stored } } };
  const before = JSON.stringify(data);
  const read = tmWbOf(data, '2026-10-25', {});
  for (const [key, value] of Object.entries(stored)) assert.equal(read[key], value);
  assert.equal(JSON.stringify(data), before);
});
