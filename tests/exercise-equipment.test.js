import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
const training = existsSync(new URL('../src/training/exerciseEquipment.js',import.meta.url)) ? '../src/training/' : '../training/';
const { exerciseEquipment, matchesAvailableEquipment, EXERCISE_EQUIPMENT, EXERCISE_EQUIPMENT_GROUPS } = await import(training+'exerciseEquipment.js');
const { EXPANSION_EXERCISES } = await import(training+'catalogExpansion.js');
const { KETTLEBELL_EXERCISES } = await import(training+'catalogKettlebell.js');
const actual = id => {const row=[...EXPANSION_EXERCISES,...KETTLEBELL_EXERCISES].find(row=>row.id===id);assert.ok(row,id);return row;};

test('real kettlebell and dumbbell variations require the identified tool, preserving other equipment',()=>{
  const kb=exerciseEquipment(actual('kb26_supported_row'));
  assert.ok(kb.items.includes('kettlebell'));assert.ok(kb.items.includes('lavice'));assert.ok(!kb.items.includes('zavazi'));
  assert.equal(matchesAvailableEquipment(kb,['dumbbell','lavice']),false);
  assert.equal(matchesAvailableEquipment(kb,['kettlebell']),false);
  assert.equal(matchesAvailableEquipment(kb,['kettlebell','lavice']),true);
  const db=exerciseEquipment(actual('ex26_db_thruster'));
  assert.deepEqual(db.items,['dumbbell']);
  assert.equal(matchesAvailableEquipment(db,['kettlebell']),false);
  assert.equal(matchesAvailableEquipment(db,['dumbbell']),true);
});

test('explicit alternatives are OR, all separate requirements remain AND',()=>{
  const goblet=exerciseEquipment({id:'goblet',eq:['zavazi'],cz:'Goblet dřep',en:'Goblet Squat',pos:['Činka nebo kettlebell obouruč u hrudníku.','Dumbbell or kettlebell held at the chest.']});
  assert.deepEqual(new Set(goblet.requirements[0]),new Set(['dumbbell','kettlebell']));
  assert.equal(matchesAvailableEquipment(goblet,['kettlebell']),true);
  assert.equal(matchesAvailableEquipment(goblet,['dumbbell']),true);
  assert.equal(matchesAvailableEquipment(goblet,[]),false);
  const row=exerciseEquipment(actual('ex26_suitcase_deadlift'));
  assert.ok(row.requirements.some(group=>group.includes('dumbbell')&&group.includes('kettlebell')));
  const vest=exerciseEquipment({eq:['zavazi'],pos:['Kotouč nebo vesta mezi lopatkami.','A plate or vest between the shoulder blades.']});
  assert.deepEqual(new Set(vest.items),new Set(['plate','weight_vest']));
  assert.deepEqual(new Set(exerciseEquipment({eq:['zavazi'],en:'Dumbbell or Kettlebell Squat'}).items),new Set(['dumbbell','kettlebell']));
  assert.deepEqual(new Set(exerciseEquipment({eq:['zavazi'],pos:['Hold a dumbbell or a kettlebell.']}).items),new Set(['dumbbell','kettlebell']));
});

test('or must directly connect equipment names, never a stance or an unrelated clause',()=>{
  for(const text of ['Standing or seated, hold a dumbbell and a kettlebell.','Stoj nebo sed, drž jednoručku a kettlebell.','Dumbbell and Kettlebell Standing or Seated Press']) {
    for(const field of ['en','pos','exe']) {
      const result=exerciseEquipment({eq:['zavazi'],[field]:field==='en'?text:[text]});
      assert.deepEqual(result.items,['zavazi'],field+': '+text);
      assert.equal(matchesAvailableEquipment(result,['dumbbell']),false);
      assert.equal(matchesAvailableEquipment(result,['kettlebell']),false);
    }
  }
});

test('generic loads, missing equipment and unknown keys never become free or a guessed dumbbell',()=>{
  for(const row of [{eq:['zavazi'],pos:['Činka v ruce.','Hold a weight.']},{eq:['zavazi'],en:'Turkish Get-Up',pos:['Hold a bell.']},{id:'kb26_custom',eq:['zavazi']},{eq:[]},{},{eq:['unlisted_tool']}]){
    const result=exerciseEquipment(row);assert.ok(result.unresolved.length);assert.equal(result.items.includes('dumbbell'),false);
    assert.equal(matchesAvailableEquipment(result,['kettlebell','dumbbell','cinka','zavazi','unknown_equipment','unlisted_tool']),false);
  }
  assert.equal(matchesAvailableEquipment(exerciseEquipment({eq:['telo']}),[]),true);
  assert.equal(matchesAvailableEquipment(exerciseEquipment({eq:['telo','prostor']}),[]),false);
  assert.equal(matchesAvailableEquipment(exerciseEquipment({eq:['telo','prostor']}),['prostor']),true);
});

test('warnings, optional alternatives and generic bells cannot manufacture required types',()=>{
  for(const row of [
    {eq:['zavazi'],wat:['Use a dumbbell.'],pro:['Kettlebell progression.']},
    {eq:['zavazi'],pos:['If needed, use a kettlebell.']},
    {eq:['zavazi'],pos:['Without a dumbbell, hold a weight.']},
    {eq:['zavazi'],pos:['Do not use a dumbbell.']},
    {eq:['zavazi'],pos:['The dumbbell on the shelf is only for reference.']},
    {eq:['zavazi'],pos:['Případně použij jednoručku.']},
    {eq:['zavazi'],pos:['Hold a dumbbell.','Drž kettlebell.']},
    {eq:['zavazi'],pos:['A dumbbell and kettlebell are nearby.']},
  ])assert.deepEqual(exerciseEquipment(row).items,['zavazi']);
  // A plate used under the feet does not replace the recorded barbell.
  assert.deepEqual(exerciseEquipment({eq:['cinka'],pos:['Stand on a weight plate.']}).items,['cinka']);
});

test('specific bars, ab wheel and medicine balls are not interchangeable generic weights',()=>{
  assert.deepEqual(exerciseEquipment({id:'trapbardl',eq:['cinka'],en:'Trap-Bar Deadlift'}).items,['trap_bar']);
  assert.ok(exerciseEquipment(actual('ex26_preacher_curl')).items.includes('ez_bar'));
  assert.equal(matchesAvailableEquipment(exerciseEquipment(actual('ex26_preacher_curl')),['cinka','lavice']),false);
  assert.deepEqual(exerciseEquipment({eq:['zavazi'],en:'Ab Wheel from Knees'}).items,['ab_wheel']);
  assert.ok(exerciseEquipment(actual('ex26_mb_chestpass')).items.includes('medicinbal'));
  assert.ok(exerciseEquipment(actual('ex26_bearhug_carry')).items.includes('sandbag'));
});

test('explicit reviewed requirements override derived types but leave legacy storage immutable',()=>{
  const row=Object.freeze({eq:Object.freeze(['zavazi','lavice']),taxonomy:{equipmentRequirements:[['kettlebell','dumbbell'],['lavice']]}});
  const result=exerciseEquipment(row,{taxonomy:{equipmentRequirements:[['plate']]}});
  assert.deepEqual(result.requirements,[['kettlebell','dumbbell'],['lavice']]);
  assert.equal(matchesAvailableEquipment(result,['dumbbell','lavice']),true);
  result.legacy.push('new');result.requirements[0].push('new');assert.deepEqual(row.eq,['zavazi','lavice']);assert.equal(row.taxonomy.equipmentRequirements[0].length,2);
  assert.equal(matchesAvailableEquipment(exerciseEquipment({eq:['zavazi'],taxonomy:{equipmentRequirements:[]}}),[]),true);
  assert.equal(matchesAvailableEquipment(exerciseEquipment({taxonomy:{equipmentRequirements:[[]]}}),[]),false);
});

test('vocabulary is bilingual, grouped and unique; every kettlebell catalogue row refines without mutation',()=>{
  assert.equal(new Set(EXERCISE_EQUIPMENT.map(x=>x.id)).size,EXERCISE_EQUIPMENT.length);
  for(const item of EXERCISE_EQUIPMENT){assert.ok(item.cz&&item.en);assert.ok(EXERCISE_EQUIPMENT_GROUPS.some(group=>group.id===item.group));}
  for(const row of KETTLEBELL_EXERCISES){const before=JSON.stringify(row);const result=exerciseEquipment(row);assert.ok(result.items.includes('kettlebell'),row.id);assert.equal(JSON.stringify(row),before);assert.deepEqual(result.legacy,row.eq);}
});

test('verified curl and lateral raise require dumbbells only without rewriting stored equipment',()=>{
  for(const row of reviewedBaseFixtures) {
    const before=JSON.stringify(row);
    const result=exerciseEquipment(row);
    assert.deepEqual(result.requirements,[['dumbbell']],row.id);
    assert.deepEqual(result.legacy,['zavazi','guma']);
    assert.equal(matchesAvailableEquipment(result,['dumbbell']),true);
    assert.equal(matchesAvailableEquipment(result,['guma']),false);
    assert.equal(JSON.stringify(row),before);
    assert.ok(result.evidence.some(e=>e.source==='reviewed-content-match'));
    assert.deepEqual(exerciseEquipment({...row,taxonomy:{equipmentRequirements:[['guma']]}}).items,['guma']);
  }
});

test('every protected content field and equipment change disables reviewed ID projection',()=>{
  for(const original of reviewedBaseFixtures) {
    for(const field of ['cz','en','pat','eq','pos','exe','wat','pro','foc']) {
      const row=structuredClone(original);
      if(Array.isArray(row[field]))row[field][0]+=' edited'; else row[field]+=' edited';
      const result=exerciseEquipment(row);
      assert.equal(result.evidence.some(e=>e.source==='reviewed-content-match'),false,original.id+':'+field);
      assert.ok(result.items.includes('guma'),original.id+':'+field);
      assert.equal(matchesAvailableEquipment(result,['dumbbell']),false,original.id+':'+field);
    }
    assert.equal(exerciseEquipment({id:original.id,eq:['zavazi','guma']}).evidence.some(e=>e.source==='reviewed-content-match'),false);
  }
});

// Exact base-catalogue text inspected 2026-10-22, retained as independent fixtures.
const reviewedBaseFixtures = [
  {
    "id": "dbcurl",
    "cz": "Bicepsový zdvih",
    "en": "Biceps Curl",
    "pat": "tah",
    "eq": [
      "zavazi",
      "guma"
    ],
    "pos": [
      "Stoj, činky podél těla, dlaně vpřed.",
      "Standing, dumbbells by the sides, palms forward."
    ],
    "exe": [
      "Zdvih k rameni bez pohybu lokte. Pomalu dolů do plného propnutí.",
      "Curl to the shoulder without the elbow drifting. Lower slowly to full extension."
    ],
    "wat": [
      "Žádné houpání trupem. Dole vždy propnout.",
      "No body swing. Always straighten at the bottom."
    ],
    "pro": [
      "Pomalejší negativní fáze, pak shyb podhmatem.",
      "Slower negatives, then the chin-up."
    ],
    "foc": [
      "Loket je pant přišpendlený k boku. Nic jiného se nehýbe.",
      "The elbow is a hinge pinned to the side. Nothing else moves."
    ]
  },
  {
    "id": "lateralraise",
    "cz": "Upažování",
    "en": "Lateral Raise",
    "pat": "tlak",
    "eq": [
      "zavazi",
      "guma"
    ],
    "pos": [
      "Stoj, činky podél těla, mírně pokrčené lokty.",
      "Standing, dumbbells by the sides, elbows softly bent."
    ],
    "exe": [
      "Upaž do výšky ramen, krátce, pomalu dolů.",
      "Raise to shoulder height, pause, lower slowly."
    ],
    "wat": [
      "Žádný švih trupem. Lehčí váha a čistota vyhrává.",
      "No body swing. Lighter and cleaner wins."
    ],
    "pro": [
      "Pomalejší negativní fáze, pauzy nahoře.",
      "Slower negatives, pauses at the top."
    ],
    "foc": [
      "Vede loket, ne zápěstí. Ramena zůstávají dole.",
      "The elbow leads, not the wrist. The shoulders stay down."
    ]
  }
];
