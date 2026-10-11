import test from 'node:test';
import assert from 'node:assert/strict';
import { createClientStartupNavigation, clientHabitDefinitions } from '../src/clientPreferences.js';
import { HABIT_DEFAULTS } from '../src/shared/product/practice.js';
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
test('fresh clients receive the same product habit defaults, even after other day entries', () => {
  const legacy = [{ slot: 0, name: 'Legacy habit' }];
  assert.deepEqual(clientHabitDefinitions({}, {}, legacy), legacy);
  assert.deepEqual(clientHabitDefinitions({}, { '2026-10-02': { h: [0, 0], note: 'Personal day' } }, legacy), legacy);
});
test('existing habit slot history and explicitly chosen definitions remain intact', () => {
  const legacy = [{ slot: 0, name: 'Legacy habit' }], days = { '2026-10-01': { h: [1, 0] } };
  assert.equal(clientHabitDefinitions({}, days, legacy), legacy);
  const own = [{ slot: 4, name: 'My habit' }];
  assert.equal(clientHabitDefinitions({ habitDefs: own }, days, legacy), own);
  assert.deepEqual(clientHabitDefinitions({ habitDefs: [] }, days, legacy), []);
});

// Exact historical fixtures, not inferred synonyms. See git show <ref>:src/App.tsx.
const originalEnglish = ['Reflect and prepare','Business movement','Artist journey','Physical training','Strictly limit screen time','Study meaningfully','Yoga / Stretching','Meditate curiously','Healthy nutrition']; // f53b811
const firstCzech = ['Ztišení a příprava','Rozvoj značky','Tvorba','Trénink těla','Limit obrazovek','Hluboké studium','Jóga a protažení','Meditace','Poctivá strava']; // 6828e46
const firstEnglish = ['Reflect and prepare','Growing the brand','Making art','Training the body','Screen time limit','Deep study','Yoga and stretch','Meditation','Honest food']; // 6828e46

for (const [label,names] of [['original English',originalEnglish],['first Czech',firstCzech],['first English',firstEnglish]]) {
  test(`${label}: materialized defaults resolve to current bilingual labels without rewriting stored data`, () => {
    const rows = names.map((name,slot)=>Object.freeze({slot,name,icon:HABIT_DEFAULTS[slot].icon}));
    const coll = Object.freeze({habitDefs:Object.freeze(rows)});
    const result = clientHabitDefinitions(coll, {}, HABIT_DEFAULTS);
    assert.deepEqual(result.map(row=>row.cz),HABIT_DEFAULTS.map(row=>row.cz));
    assert.deepEqual(result.map(row=>row.en),HABIT_DEFAULTS.map(row=>row.en));
    assert.ok(result.every(row=>!Object.hasOwn(row,'name')));
    assert.deepEqual(coll.habitDefs.map(row=>row.name),names);
  });
}

test('one old edit freezes the whole list; only untouched defaults are unfrozen', () => {
  // This mirrors HabitInlineEditor: resolve every row, then persist one edit.
  const previous = firstCzech.map((cz,slot)=>({slot,cz,en:firstEnglish[slot],icon:HABIT_DEFAULTS[slot].icon}));
  const materialized = previous.map(row=>({...row,name:row.cz}));
  const custom = {...materialized[1],name:'Moje vlastní podnikání',icon:'custom-compass'};
  const rows = [custom,{...materialized[8],archived:true,icon:'custom-bowl'},materialized[0],materialized[4]];
  const days = Object.freeze({'2026-10-01':Object.freeze({h:Object.freeze([1,2,0,1,2,0,1,0,2]),note:'History stays intact'})});
  const before = JSON.stringify({rows,days});
  const result = clientHabitDefinitions({habitDefs:rows},days,HABIT_DEFAULTS);
  assert.equal(result[0],custom);
  assert.deepEqual(result.map(row=>row.slot),[1,8,0,4]);
  assert.equal(result[1].archived,true);
  assert.equal(result[1].icon,'custom-bowl');
  assert.equal(result[1].cz,HABIT_DEFAULTS[8].cz);
  assert.equal(result[1].en,HABIT_DEFAULTS[8].en);
  assert.equal(result.length,4,'deleted slots are never recreated');
  assert.equal(JSON.stringify({rows,days}),before);
});

test('unmaterialized old bilingual defaults and current materialized labels stay language-aware', () => {
  for (const rows of [
    firstCzech.map((cz,slot)=>({slot,cz,en:firstEnglish[slot]})),
    HABIT_DEFAULTS.map(row=>({...row,name:row.cz})),
    HABIT_DEFAULTS.map(row=>({...row,name:row.en})),
  ]) {
    const result = clientHabitDefinitions({habitDefs:rows},{},HABIT_DEFAULTS);
    assert.deepEqual(result.map(row=>row.name||row.cz),HABIT_DEFAULTS.map(row=>row.cz));
    assert.deepEqual(result.map(row=>row.name||row.en),HABIT_DEFAULTS.map(row=>row.en));
    assert.equal(clientHabitDefinitions({habitDefs:result},{},HABIT_DEFAULTS),result,'projection is idempotent');
  }
});

test('custom names, unrelated historical meanings, unknown slots and empty lists remain untouched', () => {
  // 5b7ea52 has different slot meanings; these must never become brand work,
  // creation, training, mobility, meditation or nutrition by matching the index.
  const distinct = ['Ranní praxe','Pohyb','Meditace','Čas venku',null,'Čtení','Jídlo s pozorností','Večerní reflexe','Spánek před půlnocí'];
  const rows = distinct.flatMap((name,slot)=>name?[{slot,name}]:[]);
  rows.push({slot:4,name:'limit obrazovek'},{slot:12,name:'Physical training'},{slot:1,name:'Brand work — moje'},{slot:0,cz:'Můj český návyk',en:'My own habit'});
  assert.equal(clientHabitDefinitions({habitDefs:rows},{},HABIT_DEFAULTS),rows);
  const empty=[];
  assert.equal(clientHabitDefinitions({habitDefs:empty},{'2026-10-01':{h:[1,1,1]}},HABIT_DEFAULTS),empty);
});
