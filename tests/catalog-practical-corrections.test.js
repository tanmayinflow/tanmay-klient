import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import vm from 'node:vm';
import { PRACTICAL_CORRECTIONS, applyPracticalCorrections } from '../src/training/catalogPracticalCorrections.js';
import { applyExerciseCorrections } from '../src/training/catalogCorrections.js';

const ids = ['presshs', 'copenhagen', 'hsshift', 'fingerhs'];
const flag = 'practicalExerciseAudit20261015';
const cardFrom = (id, version) => ({ id, ...Object.fromEntries(Object.entries(PRACTICAL_CORRECTIONS[id]).map(([field, change]) => [field, structuredClone(change[version])])) });
const targets = () => [{ id: 'ex26_copenhagen_short' }, { id: 'onearmhs' }];
function freezeTree(value) {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freezeTree);
    Object.freeze(value);
  }
  return value;
}

test('the four untouched original cards receive their exact corrections and retain plans and history', () => {
  assert.deepEqual(Object.keys(PRACTICAL_CORRECTIONS).sort(), [...ids].sort());
  const original = {
    exerciseAudit20261013: true, kettlebellExpansion20261015: true,
    tEx: [...ids.map(id => cardFrom(id, 'before')), ...targets()],
    tPl: [{ id: 'plan', exercises: ['presshs'] }],
    tLog: [{ exId: 'copenhagen', duration: 15 }],
    tWo: [{ id: 'workout' }],
  };
  const snapshot = structuredClone(original);
  freezeTree(original);
  const migrated = applyPracticalCorrections(original);
  for (const id of ids) {
    const row = migrated.tEx.find(ex => ex.id === id);
    for (const [field, change] of Object.entries(PRACTICAL_CORRECTIONS[id])) assert.deepEqual(row[field], change.after, id + ':' + field);
  }
  assert.equal(migrated[flag], true);
  assert.equal(migrated.exerciseAudit20261013, true);
  assert.equal(migrated.kettlebellExpansion20261015, true);
  for (const key of ['tPl', 'tLog', 'tWo']) assert.equal(migrated[key], original[key]);
  assert.deepEqual(original, snapshot);
});

test('Czech and English edits survive independently, including edited equipment and progression links', () => {
  const press = cardFrom('presshs', 'before');
  press.pos[0] = 'Moje konkrétní nastavení';
  press.exe[1] = 'My individually chosen instruction';
  press.ez = 'my_personal_regression';
  const shift = cardFrom('hsshift', 'before');
  shift.eq = ['bradla'];
  shift.hd = 'my_personal_progression';
  const result = applyPracticalCorrections({ tEx: [press, shift, ...targets()] });
  const updatedPress = result.tEx[0];
  assert.equal(updatedPress.pos[0], press.pos[0]);
  assert.equal(updatedPress.pos[1], PRACTICAL_CORRECTIONS.presshs.pos.after[1]);
  assert.equal(updatedPress.exe[0], PRACTICAL_CORRECTIONS.presshs.exe.after[0]);
  assert.equal(updatedPress.exe[1], press.exe[1]);
  assert.equal(updatedPress.ez, 'my_personal_regression');
  assert.equal(result.tEx[1].eq, shift.eq);
  assert.equal(result.tEx[1].hd, 'my_personal_progression');
});

test('deleted cards stay absent and deleted progression targets are not restored or linked', () => {
  const original = { tEx: [cardFrom('copenhagen', 'before'), cardFrom('hsshift', 'before')], tLog: [{ exId: 'presshs' }] };
  const result = applyPracticalCorrections(original);
  assert.deepEqual(result.tEx.map(row => row.id), ['copenhagen', 'hsshift']);
  assert.equal(result.tEx[0].ez, null);
  assert.equal(result.tEx[1].hd, null);
  assert.equal(result.tLog, original.tLog);
  const deletedLater = { ...result, tEx: [] };
  assert.equal(applyPracticalCorrections(deletedLater), deletedLater);
  assert.deepEqual(deletedLater.tEx, []);
});

test('corrected and fully customized rows retain identity; the migration is one-time and does not fill omitted fields', () => {
  const corrected = cardFrom('presshs', 'after');
  const custom = { id: 'fingerhs', foc: ['Vlastní CZ', 'Custom EN'] };
  const original = { tEx: [corrected, custom] };
  const result = applyPracticalCorrections(original);
  assert.equal(result.tEx, original.tEx);
  assert.equal(result.tEx[0], corrected);
  assert.equal(result.tEx[1], custom);
  assert.equal(Object.hasOwn(result.tEx[1], 'ez'), false);
  assert.equal(Object.hasOwn(result.tEx[1], 'pro'), false);
  assert.equal(applyPracticalCorrections(result), result);
  assert.equal(applyPracticalCorrections(null), null);
  assert.equal(applyPracticalCorrections(undefined), undefined);
  assert.deepEqual(applyPracticalCorrections({}), { [flag]: true });
});

test('the old expansion audit and new original-card audit keep independent markers', () => {
  const old = { exerciseAudit20261013: true, tEx: [cardFrom('fingerhs', 'before')] };
  const result = applyPracticalCorrections(old);
  assert.equal(result[flag], true);
  assert.equal(result.exerciseAudit20261013, true);
  assert.equal(applyExerciseCorrections(result), result);
  const newFirst = applyPracticalCorrections({ tEx: [cardFrom('fingerhs', 'before')] });
  assert.equal(newFirst.exerciseAudit20261013, undefined);
  const both = applyExerciseCorrections(newFirst);
  assert.equal(both[flag], true);
  assert.equal(both.exerciseAudit20261013, true);
  assert.equal(both.tEx, newFirst.tEx);
});

test('saved corrected arrays never share mutable references with the correction authority', () => {
  const result = applyPracticalCorrections({ tEx: [cardFrom('hsshift', 'before'), ...targets()] });
  result.tEx[0].eq.push('guma');
  result.tEx[0].pro[0] = 'Upraveno po migraci';
  assert.deepEqual(PRACTICAL_CORRECTIONS.hsshift.eq.after, ['telo']);
  assert.notEqual(PRACTICAL_CORRECTIONS.hsshift.pro.after[0], result.tEx[0].pro[0]);
});

// These four baseline rows remain original literals in each app shell. Read the
// actual shipped source so a fresh install cannot silently retain obsolete copy.
function originalSeedRow(id) {
  const source = readFileSync(resolve('src/App.tsx'), 'utf8');
  const start = source.indexOf('{ id: "' + id + '"');
  assert.notEqual(start, -1, id + ' original literal must exist');
  let depth = 0, quoted = false, escaped = false;
  for (let i = start; i < source.length; i++) {
    const c = source[i];
    if (quoted) {
      if (escaped) escaped = false;
      else if (c === '\\') escaped = true;
      else if (c === '"') quoted = false;
      continue;
    }
    if (c === '"') { quoted = true; continue; }
    if (c === '{') depth++;
    if (c === '}' && --depth === 0) return JSON.parse(JSON.stringify(vm.runInNewContext('(' + source.slice(start, i + 1) + ')')));
  }
  throw new Error('Unclosed original literal: ' + id);
}

test('fresh-install original seed rows already contain the four approved corrections', () => {
  for (const [id, patches] of Object.entries(PRACTICAL_CORRECTIONS)) {
    const row = originalSeedRow(id);
    for (const [field, change] of Object.entries(patches)) assert.deepEqual(row[field], change.after, id + ':' + field);
  }
  assert.equal(originalSeedRow('presshs').ez, null);
  assert.equal(originalSeedRow('copenhagen').ez, 'ex26_copenhagen_short');
  assert.equal(originalSeedRow('hsshift').hd, 'onearmhs');
  assert.equal(originalSeedRow('fingerhs').ez, null);
  assert.equal(originalSeedRow('fingerhs').hd, null);
});
