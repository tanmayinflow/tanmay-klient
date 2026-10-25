import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createClientStartupNavigation, clientHabitDefinitions, prepareClientUnusedHabitAdoption } from '../src/clientPreferences.js';
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

// Exact 5b7ea52 HABIT_DEFS and HABIT_DEFAULTS.map shape. These are not aliases
// for today's slot meanings and may be replaced only before any recorded use.
const genericDefaults = () => [
  ['🌅','Ranní praxe'],['💪','Pohyb'],['🔥','Meditace'],['🌿','Čas venku'],
  ['📵','Limit obrazovek'],['📖','Čtení'],['🥗','Jídlo s pozorností'],
  ['✍️','Večerní reflexe'],['😴','Spánek před půlnocí'],
].map(([icon,name],slot)=>({slot,icon,name}));

function assertGenericMeaningsPreserved(rows, days) {
  const before = JSON.stringify({rows,days});
  const coll={habitDefs:rows};
  assert.equal(prepareClientUnusedHabitAdoption(coll,days,HABIT_DEFAULTS),coll);
  const result = clientHabitDefinitions(coll,days,HABIT_DEFAULTS);
  assert.notEqual(result,HABIT_DEFAULTS);
  assert.equal(result.length,rows.length);
  assert.deepEqual(result.map(row=>row.slot),rows.map(row=>row.slot));
  // The existing same-meaning alias for screen time remains independently
  // allowed. Every other generic meaning must keep its original name.
  for (let i=0;i<rows.length;i++) {
    if (rows[i].slot!==4) assert.deepEqual(result[i],rows[i]);
  }
  assert.equal(JSON.stringify({rows,days}),before);
}

test('an exact unused generic seed prepares a collection with supplied defaults without mutating its inputs', () => {
  const rows=Object.freeze(genericDefaults().map(Object.freeze));
  const coll=Object.freeze({habitDefs:rows,journal:[],notebook:[],custom:'preserved'}), days=Object.freeze({});
  const before=JSON.stringify(coll);
  const adopted=prepareClientUnusedHabitAdoption(coll,days,HABIT_DEFAULTS);
  assert.notEqual(adopted,coll);
  assert.deepEqual(adopted,{...coll,habitDefs:HABIT_DEFAULTS});
  assert.notEqual(adopted.habitDefs,HABIT_DEFAULTS);
  assert.ok(adopted.habitDefs.every((row,i)=>row!==HABIT_DEFAULTS[i]));
  assert.equal(adopted.journal,coll.journal);
  assert.equal(adopted.notebook,coll.notebook);
  // A future supplied template may have another length; this is synthetic,
  // not a proposal for an actual tenth product habit.
  const future=Object.freeze([...HABIT_DEFAULTS,Object.freeze({slot:9,cz:'Testovací položka',en:'Test item'})]);
  assert.deepEqual(prepareClientUnusedHabitAdoption(coll,days,future).habitDefs,future);
  assert.equal(JSON.stringify(coll),before);
  assert.equal(clientHabitDefinitions({habitDefs:future},days,future),future);
  assert.equal(prepareClientUnusedHabitAdoption(adopted,days,HABIT_DEFAULTS),adopted);
});

test('ordinary day notes and body entries with absent or zero-only habit arrays do not freeze an unused seed', () => {
  const days={
    '2026-10-01':{note:'Synthetic personal note',wb:{mood:3},tasks:[],plan:{},sched:{},s:''},
    '2026-10-02':{h:Array(9).fill(0),note:'Another synthetic note'},
    '2026-10-03':{h:[]},
    '2026-10-04':{},
  };
  const before=JSON.stringify(days);
  assert.deepEqual(prepareClientUnusedHabitAdoption({habitDefs:genericDefaults()},days,HABIT_DEFAULTS).habitDefs,HABIT_DEFAULTS);
  assert.equal(JSON.stringify(days),before);
});

test('a done or intentionally skipped record on any historical slot blocks generic seed replacement', () => {
  for(const slot of [0,1,2,3,4,5,6,7,8,17]) for(const state of [1,2]) {
    const h=Array(18).fill(0);h[slot]=state;
    assertGenericMeaningsPreserved(genericDefaults(),{
      '2020-01-01':{h},'2026-10-11':{h:Array(9).fill(0)},
    });
  }
});

test('unknown or sparse habit values and unfamiliar day containers conservatively preserve generic meanings', () => {
  for(const value of [undefined,null,'0','1',false,true,-1,3,NaN,{},[]]) {
    assertGenericMeaningsPreserved(genericDefaults(),{'2026-10-01':{h:[0,value]}});
  }
  for(const days of [undefined,null,[],0,'',new Date(),{'2026-10-01':null},
    {'2026-10-01':[]},{unknown:{h:[0]}},{h:[0]},
    {'2026-10-01':{h:null}},{'2026-10-01':{h:{0:0}}},
    {'2026-10-01':{h:Array(9)}},{'2026-10-01':{c:1}},
    {'2026-10-01':{habits:[1]}},
  ]) assertGenericMeaningsPreserved(genericDefaults(),days);
});

test('renames, icons, explicit archive state or extra metadata disqualify the whole generic seed', () => {
  for(const patch of [{name:'My own morning'},{icon:'custom-icon'},{iconId:'leaf'},
    {archived:true},{archived:false},{cz:'Ranní praxe'}, {id:'own-row'},{origin:'custom'},
  ]) {
    const rows=genericDefaults();rows[0]={...rows[0],...patch};
    assertGenericMeaningsPreserved(rows,{});
  }
});

test('missing, appended, reordered and malformed generic definitions are not replaced', () => {
  const full=genericDefaults();
  for(const rows of [[],full.slice(1),[...full,{slot:9,name:'Own extra habit'}],
    [full[1],full[0],...full.slice(2)],
    full.map((row,index)=>index===0?{...row,slot:9}:row),
    full.map((row,index)=>index===0?{slot:row.slot,name:row.name}:row),
  ]) assertGenericMeaningsPreserved(rows,{});
});

test('accepted definitions keep their new meaning after the first check, save/reload and language switch', () => {
  const original={habitDefs:genericDefaults()};
  // Merely rendering the old collection does not silently reinterpret slots.
  assert.equal(clientHabitDefinitions(original,{},HABIT_DEFAULTS)[1].name,'Pohyb');
  const adopted=prepareClientUnusedHabitAdoption(original,{},HABIT_DEFAULTS);
  const days={'2026-10-11':{h:[0,1,0,0,0,0,0,0,0]}};
  const reloaded=JSON.parse(JSON.stringify({coll:adopted,days}));
  const defs=clientHabitDefinitions(reloaded.coll,reloaded.days,HABIT_DEFAULTS);
  assert.equal(defs[1].cz,'Podnikání');
  assert.equal(defs[1].en,'Business');
  assert.equal(reloaded.days['2026-10-11'].h[defs[1].slot],1);
  assert.equal(prepareClientUnusedHabitAdoption(reloaded.coll,reloaded.days,HABIT_DEFAULTS),reloaded.coll);
  assert.equal(original.habitDefs[1].name,'Pohyb');
});

// Exercise the actual App controller, including guards inside the state updater.
const appSource=readFileSync(new URL('../src/App.tsx',import.meta.url),'utf8');
const adoptionBody=appSource.match(/const adoptUnusedHabitDefaults = \(\) => \{([\s\S]*?)\n  \};/);
assert.ok(adoptionBody,'the Client adoption controller exists');
const buildAdoptionController=new Function('scope',`
  const {stateHydrated,member,conflict,clientAccount,ownerLoad,persistColl,_editsRef}=scope;
  const {prepareClientUnusedHabitAdoption,HABIT_DEFAULTS}=scope;
  return () => {${adoptionBody[1]}};
`);

function adoptionControllerFixture(options={}) {
  const initial={habitDefs:genericDefaults(),notebook:[],journal:[]};
  const state={coll:initial,owner:'A',storedOwner:'A',attempts:0,writes:0};
  const editsRef={current:{}};
  const scope={stateHydrated:true,member:true,conflict:null,
    clientAccount:{getSnapshot:()=>({owner:'A'}),isCurrent:owner=>state.owner===owner},
    ownerLoad:()=>state.storedOwner,
    persistColl:update=>{
      state.attempts++;
      options.beforeUpdater?.(state,editsRef);
      const next=update(state.coll);
      if(next!==state.coll)state.writes++;
      state.coll=next;
    },_editsRef:editsRef,prepareClientUnusedHabitAdoption,HABIT_DEFAULTS,
    ...options.scope,
  };
  return {initial,state,editsRef,run:buildAdoptionController(scope)};
}

test('the actual App adoption controller waits for hydration, membership, no conflict and a current owner', () => {
  for(const scope of [{stateHydrated:false},{member:false},{member:null},{conflict:{}},
    {clientAccount:{getSnapshot:()=>({owner:null}),isCurrent:()=>true}},
    {clientAccount:{getSnapshot:()=>({owner:'A'}),isCurrent:()=>false}},
    {ownerLoad:()=> 'B'},
  ]) {
    const fixture=adoptionControllerFixture({scope});fixture.run();
    assert.equal(fixture.state.attempts,0);
    assert.equal(fixture.state.coll,fixture.initial);
  }
});

test('the actual App adoption controller refuses an owner switch before its updater executes', () => {
  for(const beforeUpdater of [state=>{state.owner='B';},state=>{state.storedOwner='B';}]) {
    const fixture=adoptionControllerFixture({beforeUpdater});fixture.run();
    assert.equal(fixture.state.attempts,1);
    assert.equal(fixture.state.writes,0);
    assert.equal(fixture.state.coll,fixture.initial);
  }
});

test('the actual App adoption controller reads newer day history and definitions inside its updater', () => {
  for(const beforeUpdater of [
    (_,editsRef)=>{editsRef.current={'2026-10-11':{h:[0,1,0,0,0,0,0,0,0]}};},
    state=>{state.coll={...state.coll,habitDefs:state.coll.habitDefs.map((row,i)=>i===0?{...row,name:'Latest personal name'}:row)};},
  ]) {
    const fixture=adoptionControllerFixture({beforeUpdater});fixture.run();
    assert.equal(fixture.state.attempts,1);
    assert.equal(fixture.state.writes,0);
    assert.equal(fixture.state.coll.habitDefs[1].name,'Pohyb');
  }
});

test('the actual App adoption controller accepts once and keeps new semantics after the first recorded check', () => {
  const fixture=adoptionControllerFixture();fixture.run();
  assert.equal(fixture.state.writes,1);
  assert.deepEqual(fixture.state.coll.habitDefs,HABIT_DEFAULTS);
  fixture.editsRef.current={'2026-10-11':{h:[0,1,0,0,0,0,0,0,0]}};
  fixture.run();
  assert.equal(fixture.state.writes,1);
  assert.equal(clientHabitDefinitions(fixture.state.coll,fixture.editsRef.current,HABIT_DEFAULTS)[1].cz,'Podnikání');
  assert.equal(fixture.initial.habitDefs[1].name,'Pohyb');
  assert.match(appSource,/React\.useLayoutEffect\(\(\) => \{[^]*?adoptUnusedHabitDefaultsRef\.current\(\)/);
});
