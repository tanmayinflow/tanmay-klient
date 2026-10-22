import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';

// Run unchanged in the canonical source and in either generated app mirror.
const training = existsSync(new URL('../src/training/exerciseTaxonomy.js', import.meta.url)) ? '../src/training/' : '../training/';
const { exerciseTaxonomy, EXERCISE_REGIONS, EXERCISE_MOVEMENTS, EXERCISE_FOCUS, EXERCISE_POSITIONS, EXERCISE_SUPPORTS } = await import(training + 'exerciseTaxonomy.js');
const { EXPANSION_EXERCISES } = await import(training + 'catalogExpansion.js');
const { KETTLEBELL_EXERCISES } = await import(training + 'catalogKettlebell.js');
const { INSTAGRAM_EXERCISES } = await import(training + 'catalogInstagram.js');
const { INSTAGRAM_CONTINUATION_EXERCISES } = await import(training + 'catalogInstagramContinuation.js');
const { INSTAGRAM_CLIENT_NEXT_EXERCISES } = await import(training + 'catalogInstagramClientNext.js');
const { INSTAGRAM_DEEP_REVIEW_EXERCISES } = await import(training + 'catalogInstagramDeepReview.js');
const allRows = [...EXPANSION_EXERCISES, ...KETTLEBELL_EXERCISES, ...INSTAGRAM_EXERCISES, ...INSTAGRAM_CONTINUATION_EXERCISES, ...INSTAGRAM_CLIENT_NEXT_EXERCISES, ...INSTAGRAM_DEEP_REVIEW_EXERCISES];
const actual = id => { const row = allRows.find(x => x.id === id); assert.ok(row, id); return row; };

test('legacy squat bucket separates calf, knee and hip isolation from squat/lunge/step', () => {
  const cases = [
    [{id:'drep',cz:'Dřep',pat:'drep',mp:['qua','glu'],ms:['ham']},{f:'squat_bilateral'},'squat'],
    [{id:'lunge',cz:'Výpad',pat:'drep'},{f:'squat_unilateral'},'lunge'],
    [{id:'latlunge',cz:'Boční výpad',pat:'drep'},{f:'squat_unilateral'},'lunge'],
    [{id:'an_revlunge',cz:'Zpětný výpad',pat:'drep'},{f:'squat_unilateral'},'lunge'],
    [{id:'bulgsplit',pat:'drep'},{f:'squat_unilateral'},'lunge'],
    [{id:'stepup',pat:'drep'},{f:'squat_unilateral'},'step'],
    [{id:'tibraise',pat:'drep',mp:['cal'],ms:[]},{},'joint'],
    [{id:'calfraise',pat:'drep'},{f:'calf'},'joint'],
    [actual('ex26_band_legext'),{},'joint'],
    [actual('ex26_cable_adduction'),{},'joint'],
    [actual('ex26_cable_abduction'),{},'joint'],
    [actual('ex26_lateral_stepup'),{},'step'],
  ];
  for (const [row,meta,movement] of cases) assert.deepEqual(exerciseTaxonomy(row,meta).movements,[movement],row.id);
});

test('reviewed metadata distinguishes knee flexion, hip hinge, throwing and landing', () => {
  assert.deepEqual(exerciseTaxonomy({id:'nordic',pat:'ohyb'},{f:'hinge'}).movements,['joint']);
  assert.deepEqual(exerciseTaxonomy(actual('kb26_deadlift')).movements,['hinge']);
  assert.deepEqual(exerciseTaxonomy(actual('ex26_mb_chestpass')).movements,['throw']);
  assert.deepEqual(exerciseTaxonomy(actual('ex26_snapdown')).movements,['landing']);
  assert.deepEqual(exerciseTaxonomy(actual('ex26_drop_landing')).movements,['landing']);
  assert.ok(exerciseTaxonomy(actual('ex26_band_legext')).regions.includes('knees'));
  assert.ok(exerciseTaxonomy(actual('ex26_towel_curl')).regions.includes('feet'));
  assert.ok(exerciseTaxonomy(actual('ex26_band_inversion')).regions.includes('lower_legs'));
});

test('existing catalogue correction wins over an incorrect legacy family', () => {
  const pallof = exerciseTaxonomy({id:'pallof',pat:'tlak',mp:['abs'],ms:['sho']},{f:'press_horizontal',r:'strength'});
  assert.deepEqual(pallof.movements,['trunk_stability']);
  assert.deepEqual(exerciseTaxonomy({id:'legcurl',pat:'ohyb'},{f:'curl_biceps'}).movements,['joint']);
  assert.deepEqual(exerciseTaxonomy({id:'custom_press',family:'press_vertical'}).movements,['push_vertical']);
  assert.deepEqual(exerciseTaxonomy({id:'custom_row',family:'pull_horizontal'}).movements,['pull_horizontal']);
});

test('common ungrouped legacy exercises remain findable by their actual movement', () => {
  assert.deepEqual(exerciseTaxonomy({id:'crunch',pat:'stred'}).movements,['trunk_movement']);
  assert.deepEqual(exerciseTaxonomy({id:'clamshell',pat:'ohyb'}).movements,['joint']);
  assert.deepEqual(exerciseTaxonomy({id:'bearcrawl',pat:'prenos'}).movements,['locomotion']);
  assert.deepEqual(exerciseTaxonomy({id:'abwheel',pat:'stred'}).movements,['trunk_stability']);
  assert.deepEqual(exerciseTaxonomy({id:'faq_chin_negative',family:'faq_chin_negative'}).movements,['pull_vertical']);
});

test('inspected legacy squat family cannot override bounds, lunges, splits or step-downs', () => {
  const cases = [
    ['skater',['jump','landing']], ['jumplunge',['lunge','jump','landing']],
    ['vi_lunge',['lunge']], ['ex26_stepdown',['step']],
    ['frontsplit',['position']], ['middlesplit',['position']], ['lizard',['lunge','position']],
  ];
  for (const [id,expected] of cases) {
    const row=Object.freeze({id,pat:'drep',family:'squat_unilateral'});
    assert.deepEqual(exerciseTaxonomy(row,{f:'squat_unilateral'}).movements,expected,id);
    assert.equal(row.family,'squat_unilateral');
    assert.equal(row.pat,'drep');
  }
  assert.deepEqual(exerciseTaxonomy(actual('ex26_stepdown')).movements,['step']);
  // Similar names cannot turn an actual controlled skater squat into a jump.
  assert.deepEqual(exerciseTaxonomy(actual('ig26_skater_squat')).movements,['squat']);
  assert.deepEqual(exerciseTaxonomy({id:'vi_lunge',taxonomy:{movements:['other']}}).movements,['other']);
});

test('inspected compound squat sequences retain both performed movement components', () => {
  assert.deepEqual(exerciseTaxonomy(actual('ex26_squat_row')).movements,['squat','pull_horizontal']);
  assert.deepEqual(exerciseTaxonomy({id:'faq_hinge_squat',family:'faq_hinge_squat'}).movements,['hinge','squat']);
});

test('primary and secondary areas stay distinct and respect the anatomy resolver', () => {
  const squat = exerciseTaxonomy({id:'drep',mp:['qua','glu'],ms:['ham','abs']});
  assert.deepEqual(squat.regions,['thighs','hips']);
  assert.deepEqual(squat.secondaryRegions,['trunk']);
  const tib = exerciseTaxonomy({id:'tibraise',mp:['cal'],ms:[]});
  assert.deepEqual(tib.regions,['lower_legs']);
  const unknown = exerciseTaxonomy({id:'mine',mp:['undocumented_muscle']});
  assert.deepEqual(unknown.regions,['unknown']);
});

test('custom movement overrides are field-specific and no record or equipment is rewritten', () => {
  const row = Object.freeze({id:'mine',pat:'drep',eq:Object.freeze(['lavice','new_tool','lavice']),
    taxonomy:Object.freeze({movements:Object.freeze(['joint']),regions:Object.freeze(['feet']),positions:Object.freeze([]),priority:0,
      requiredEquipment:[],aliases:Object.freeze(['Můj název'])})});
  const meta = Object.freeze({taxonomy:Object.freeze({positions:['standing'],supports:['assisted'],movements:['squat']})});
  const result = exerciseTaxonomy(row,meta);
  assert.deepEqual(result.movements,['joint']);
  assert.deepEqual(result.regions,['feet']);
  assert.deepEqual(result.positions,[]);
  assert.deepEqual(result.supports,['assisted']);
  assert.deepEqual(result.requiredEquipment,['lavice','new_tool','lavice']);
  result.requiredEquipment.push('new');
  assert.equal(row.eq.length,3);
  assert.equal(row.pat,'drep');
  assert.equal(result.priority,0);
  assert.ok(result.aliases.includes('Můj název'));
});

test('unknown position, support, movement and focus do not become confident guesses', () => {
  const row = {id:'mine',cz:'Můj cvik',pat:'drep',eq:['zed'],pos:['Začni podle domluvy','Start as agreed'],pro:['Lehčí: dřep u zdi','Easier: wall squat']};
  const result = exerciseTaxonomy(row);
  assert.deepEqual(result.movements,['other']);
  assert.deepEqual(result.focus,['other']);
  assert.deepEqual(result.positions,[]);
  assert.deepEqual(result.supports,[]); // owning a wall does not establish support
  assert.deepEqual(exerciseTaxonomy({id:'mine',en:'Calf Raise',pat:'drep'}).movements,['joint']);
});

test('editorial priority is independent of popularity and does not hide specialists', () => {
  assert.equal(exerciseTaxonomy({id:'drep',pop:1}).priority,0);
  assert.equal(exerciseTaxonomy({id:'mine',pop:3}).priority,1);
  assert.equal(exerciseTaxonomy({id:'drep',tier:'specialist',pop:3}).priority,2);
  assert.equal(exerciseTaxonomy({id:'mine'},{t:'specialist'}).priority,2);
  assert.equal(exerciseTaxonomy({id:'mine',taxonomy:{priority:999}}).priority,1);
});

test('starting positions read only explicit setup introductions in Czech or English', () => {
  const cases = [
    [['Stůj na šířku boků. Poté klekni.','Stand hip-width. Then kneel.'], ['standing']],
    [['Sedni si na zem. Později se postav.','Sit on the floor. Later stand up.'], ['seated']],
    [['Začni v lehu na zádech.','Start lying supine.'], ['supine']],
    [['Lehni si na břicho.','Lie face down.'], ['prone']],
    [['Lehni na bok.','Side-lying with knees bent.'], ['side_lying']],
    [['Klekni si na podložku.','Kneel on a mat.'], ['kneeling']],
    [['Vzpor klečmo, ruce pod rameny.','On all fours.'], ['quadruped']],
    [['Stoj na rukou u zdi.','Handstand at the wall.'], ['inverted']],
    [['Vis nadhmatem.','Hang from the bar.'], ['hanging']],
    [['Stoj nebo sed.','Standing or seated.'], ['standing','seated']],
  ];
  for (const [pos,expected] of cases) assert.deepEqual(exerciseTaxonomy({id:'mine',pos}).positions,expected,pos[0]);
  assert.deepEqual(exerciseTaxonomy({id:'mine',pos:'Lie on your back.'}).positions,['supine']);
  assert.deepEqual(exerciseTaxonomy({id:'mine',pos:['Stoj.'],context:'inversion'}).positions,['standing']);
  assert.deepEqual(exerciseTaxonomy({id:'mine',pos:['Stoj.'],taxonomy:{positions:[]}}).positions,[]);
});

test('setup inference refuses remote mentions, equipment imperatives and conflicting translations', () => {
  for (const pos of [
    ['Postav kettlebell před sebe.','Place a kettlebell in front of you.'],
    ['Podle potřeby zvol polohu. Pak si sedni.','Choose a position. Then sit down.'],
    ['Pokud stojíš, můžeš se přidržet.','If standing, you can hold a support.'],
    ['Sedák nastav podle výšky.','Set the seat height.'],
    ['Poloha pro sed-leh.','Sit-up position.'],
    ['Zavěs gumu.','Hang a band on the bar.'],
    ['Leh na lavici.','Lying on the bench.'],
    ['Na boku s loktem pod ramenem.','On your side, elbow below shoulder.'],
    ['Stoj.','Seated.'],
  ]) assert.deepEqual(exerciseTaxonomy({id:'mine',pos}).positions,[],pos[0]);
  assert.deepEqual(exerciseTaxonomy({id:'mine',context:'inversion',exe:['Lehni si na záda.'],wat:['Stand tall.']}).positions,[]);
});

test('real catalogue setups distinguish floor orientations, sitting, kneeling and standing', () => {
  for (const [id,expected] of [
    ['ex26_mb_chestpass','standing'], ['ex26_seated_bb_press','seated'],
    ['ex26_hamstring_slider','supine'], ['ex26_firehydrant','quadruped'], ['ex26_cable_crunch','kneeling'],
  ]) assert.deepEqual(exerciseTaxonomy(actual(id)).positions,[expected],id);
});

test('every current expansion yields only supported vocabulary and preserves required equipment', () => {
  const axes = {regions:EXERCISE_REGIONS,secondaryRegions:EXERCISE_REGIONS,movements:EXERCISE_MOVEMENTS,
    focus:EXERCISE_FOCUS,positions:EXERCISE_POSITIONS,supports:EXERCISE_SUPPORTS};
  for (const vocabulary of Object.values(axes)) {
    assert.equal(new Set(vocabulary.map(x=>x.id)).size,vocabulary.length);
    assert.ok(vocabulary.every(x=>x.cz && x.en));
  }
  for (const row of allRows) {
    const before = JSON.stringify(row);
    const result = exerciseTaxonomy(row);
    for (const [axis,vocabulary] of Object.entries(axes)) assert.ok(result[axis].every(id=>vocabulary.some(x=>x.id===id)),row.id+':'+axis);
    assert.deepEqual(result.requiredEquipment,row.eq || [],row.id);
    assert.equal(JSON.stringify(row),before,row.id);
    assert.ok([0,1,2].includes(result.priority));
    assert.equal(result.secondaryRegions.some(x=>result.regions.includes(x)),false,row.id);
  }
});
