import test from 'node:test';
import assert from 'node:assert/strict';
import { createClientStartupNavigation, clientHabitDefinitions } from '../src/clientPreferences.js';
const context = { ready: true, owner: 'A', preferred: 'trenink', available: ['praxe', 'trenink'] };
test('stored home waits for hydration and a verified owner', () => {
  const choose = createClientStartupNavigation();
  assert.equal(choose({ ...context, ready: false }), null);
  assert.equal(choose({ ...context, owner: null }), null);
  assert.deepEqual(choose(context), { room: 'trenink' });
});
test('later preference edits and account identities never reopen the start page', () => {
  const choose = createClientStartupNavigation();
  assert.deepEqual(choose(context), { room: 'trenink' });
  assert.equal(choose({ ...context, preferred: 'praxe' }), null);
  assert.equal(choose({ ...context, owner: 'B' }), null);
});
test('only available rooms qualify, and a valid explicit deep link takes priority', () => {
  assert.deepEqual(createClientStartupNavigation()({ ...context, preferred: 'klienti' }), { room: null });
  assert.deepEqual(createClientStartupNavigation()({ ...context, preferred: 'denik' }), { room: null });
  assert.deepEqual(createClientStartupNavigation()({ ...context, requested: 'praxe' }), { room: 'praxe' });
  assert.deepEqual(createClientStartupNavigation()({ ...context, requested: 'klienti' }), { room: 'trenink' });
});
test('switching owners or already navigating while offline preserves the current context', () => {
  for (const flag of ['changed', 'interacted']) {
    const choose = createClientStartupNavigation();
    assert.deepEqual(choose({ ...context, [flag]: true }), { room: null });
    assert.equal(choose(context), null);
  }
});
test('fresh clients do not inherit owner habits, even after other day entries', () => {
  const legacy = [{ slot: 0, name: 'Legacy habit' }];
  assert.deepEqual(clientHabitDefinitions({}, {}, legacy), []);
  assert.deepEqual(clientHabitDefinitions({}, { '2026-10-02': { h: [0, 0], note: 'Personal day' } }, legacy), []);
});
test('existing habit slot history and explicitly chosen definitions remain intact', () => {
  const legacy = [{ slot: 0, name: 'Legacy habit' }], days = { '2026-10-01': { h: [1, 0] } };
  assert.equal(clientHabitDefinitions({}, days, legacy), legacy);
  const own = [{ slot: 4, name: 'My habit' }];
  assert.equal(clientHabitDefinitions({ habitDefs: own }, days, legacy), own);
  assert.deepEqual(clientHabitDefinitions({ habitDefs: [] }, days, legacy), []);
});
