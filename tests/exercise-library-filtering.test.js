import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
const training = existsSync(new URL('../src/training/exerciseLibrary.js', import.meta.url)) ? '../src/training/' : '../training/';
const { buildExerciseIndex, selectExerciseLibrary, createExerciseFilters, normalizeExerciseSearch } = await import(training + 'exerciseLibrary.js');
const ids = result => result.rows.map(row=>row.id);
const row = (id, taxonomy = {}, extra = {}) => ({id,cz:id,taxonomy,...extra});

test('filters combine OR within each axis and AND across axes', () => {
  const index = buildExerciseIndex([
    row('hip-squat',{regions:['hips'],movements:['squat'],focus:['strength']}),
    row('thigh-lunge',{regions:['thighs'],movements:['lunge'],focus:['strength']}),
    row('hip-mobility',{regions:['hips'],movements:['joint'],focus:['mobility']}),
    row('arm-squat',{regions:['arms'],movements:['squat'],focus:['strength']}),
  ]);
  assert.deepEqual(ids(selectExerciseLibrary(index,{regions:['hips','thighs'],movements:['squat','lunge'],focus:['strength']})),['hip-squat','thigh-lunge']);
});

test('secondary region and muscle matches are explicitly opted in', () => {
  const index = buildExerciseIndex([{id:'pushup',cz:'Klik',mp:['che','tri'],ms:['sho','abs']}]);
  for (const filter of [{regions:['shoulders']},{muscles:['abs']}]) {
    assert.deepEqual(ids(selectExerciseLibrary(index,filter)),[]);
    assert.deepEqual(ids(selectExerciseLibrary(index,{...filter,includeSecondary:true})),['pushup']);
  }
});

test('available equipment is a complete requirement check, including empty selection and unknown keys', () => {
  const index = buildExerciseIndex([
    row('body',{}, {eq:['telo']}), row('none',{equipmentRequirements:[]}, {eq:[]}), row('missing',{}, {eq:[]}),
    row('band-bench',{}, {eq:['guma','lavice']}), row('unknown',{}, {eq:['new_tool']}), row('space',{}, {eq:['prostor']}),
  ]);
  assert.deepEqual(ids(selectExerciseLibrary(index,{equipmentMode:'available',equipment:[]})),['body','none']);
  assert.deepEqual(ids(selectExerciseLibrary(index,{equipmentMode:'available',equipment:['guma']})),['body','none']);
  assert.deepEqual(ids(selectExerciseLibrary(index,{equipmentMode:'available',equipment:['guma','lavice']})),['band-bench','body','none']);
  assert.deepEqual(ids(selectExerciseLibrary(index,{equipmentMode:'uses',equipment:['guma']})),['band-bench']);
});

test('equipment browsing refines types while available matching respects alternatives and unresolved loads', () => {
  const index = buildExerciseIndex([
    row('kb',{}, {en:'Kettlebell swing',eq:['zavazi']}),
    row('db-bench',{}, {en:'Dumbbell press',eq:['zavazi','lavice']}),
    row('goblet',{}, {pos:['Hold a dumbbell or kettlebell.'],eq:['zavazi']}),
    row('generic',{}, {en:'Weighted exercise',eq:['zavazi']}),
  ]);
  assert.deepEqual(ids(selectExerciseLibrary(index,{equipment:['kettlebell']})).sort(),['goblet','kb']);
  assert.deepEqual(ids(selectExerciseLibrary(index,{equipment:['dumbbell']})).sort(),['db-bench','goblet']);
  assert.deepEqual(ids(selectExerciseLibrary(index,{equipmentMode:'available',equipment:['dumbbell']})),['goblet']);
  assert.deepEqual(ids(selectExerciseLibrary(index,{equipmentMode:'available',equipment:['dumbbell','lavice']})).sort(),['db-bench','goblet']);
  assert.deepEqual(ids(selectExerciseLibrary(index,{equipmentMode:'available',equipment:['zavazi']})),[]);
  assert.deepEqual(ids(selectExerciseLibrary(index,{equipment:['zavazi']})),['generic']);
  assert.deepEqual(index[0].row.eq,['zavazi']);
});

test('accent-insensitive aliases are searchable and an exact alias outranks partial names', () => {
  const index = buildExerciseIndex([
    row('partial',{}, {cz:'Výpad vzad s činkou',pop:3}),
    row('exact',{aliases:['Výpad vzad']},{cz:'Zpětný výpad',pop:1}),
    row('different',{}, {cz:'Výpad vpřed'}),
  ]);
  assert.equal(normalizeExerciseSearch('  VÝPAD__VZAD  '),'vypad vzad');
  assert.deepEqual(ids(selectExerciseLibrary(index,{q:'vypad vzad'})),['exact','partial']);
  assert.deepEqual(ids(selectExerciseLibrary(index,{q:'vzad vypad'})).sort(),['exact','partial']);
});

test('custom order preserves the saved order and input arrays are never sorted in place', () => {
  const rows = Object.freeze([row('z',{priority:2}),row('a',{priority:0}),row('m',{priority:1})]);
  const index = Object.freeze(buildExerciseIndex(rows));
  assert.deepEqual(ids(selectExerciseLibrary(index,{}, {sort:'custom'})),['z','a','m']);
  assert.deepEqual(ids(selectExerciseLibrary(index)),['a','m','z']);
  assert.deepEqual(rows.map(x=>x.id),['z','a','m']);
  assert.deepEqual(index.map(x=>x.row.id),['z','a','m']);
});

test('hidden count applies exactly the same search, equipment and region filters', () => {
  const index = buildExerciseIndex([
    row('visible',{regions:['hips']},{cz:'Dřep',eq:['telo']}),
    row('archived-match',{regions:['hips']},{cz:'Dřep starý',eq:['telo'],tier:'archived'}),
    row('archived-other-region',{regions:['arms']},{cz:'Dřep jiný',eq:['telo'],tier:'archived'}),
    row('archived-other-equipment',{regions:['hips']},{cz:'Dřep s činkou',eq:['cinka'],tier:'archived'}),
    row('archived-other-name',{regions:['hips']},{cz:'Výpad',eq:['telo'],tier:'archived'}),
  ]);
  const filters={q:'drep',regions:['hips'],equipmentMode:'available',equipment:[]};
  const result=selectExerciseLibrary(index,filters);
  assert.deepEqual(ids(result),['visible']);
  assert.equal(result.hiddenCount,1);
  const all=selectExerciseLibrary(index,{...filters,includeArchived:true});
  assert.deepEqual(ids(all).sort(),['archived-match','visible']);
  assert.equal(all.hiddenCount,0);
});

test('specialists and programme rows remain accessible; archives, aliases and blocked rows require opt-in', () => {
  const index = buildExerciseIndex([
    row('specialist',{}, {tier:'specialist'}),row('programme',{}, {tier:'program_only'}),row('catalogue',{}, {tier:'catalog'}),
    row('archive',{}, {tier:'archived'}),row('alias',{}, {status:'alias'}),row('blocked',{}, {status:'blocked',tier:'extended'}),
  ]);
  assert.deepEqual(ids(selectExerciseLibrary(index)).sort(),['catalogue','programme','specialist']);
  assert.equal(selectExerciseLibrary(index).hiddenCount,3);
  assert.equal(selectExerciseLibrary(index,{includeArchived:true}).rows.length,6);
});

test('recent selection uses supplied history only and does not manufacture usage from pop or names', () => {
  const index=buildExerciseIndex([row('a',{priority:1},{pop:3}),row('z',{priority:1},{pop:1}),row('m',{priority:1})]);
  assert.deepEqual(ids(selectExerciseLibrary(index,{}, {sort:'recent',recentIds:['z','m']})),['z','m','a']);
  assert.deepEqual(ids(selectExerciseLibrary(index,{}, {sort:'recent',recentIds:['deleted']})),['a','m','z']);
  assert.deepEqual(ids(selectExerciseLibrary(index,{}, {sort:'recent'})),['a','m','z']);
  assert.deepEqual(createExerciseFilters().equipment,[]);
});
