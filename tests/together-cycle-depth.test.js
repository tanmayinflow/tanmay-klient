import test from 'node:test';
import assert from 'node:assert/strict';
import {CYCLE_ORDER,CYCLE_DEPTH,CYCLE_HORMONES,cycleHormoneSchematic,resolveCycleExploration,cyclePersonalText} from '../src/shared/product/togetherCycleDepth.js';

test('the deep guide never guesses an unknown phase or carries exploration across dates',()=>{
  const unknown={id:null,basis:'unknown'};
  assert.deepEqual(resolveCycleExploration(unknown,'2026-09-28',null),{current:null,shown:null,exploring:false});
  const choice={id:'follicular',current:null,date:'2026-09-28'};
  assert.deepEqual(resolveCycleExploration(unknown,'2026-09-28',choice),{current:null,shown:'follicular',exploring:true});
  assert.equal(resolveCycleExploration(unknown,'2026-09-29',choice).shown,null);
  const known={id:'luteal',basis:'estimated'};
  assert.equal(resolveCycleExploration(known,'2026-09-28',choice).shown,'luteal');
  assert.equal(resolveCycleExploration({id:'not-a-phase'},'2026-09-28',null).shown,null);
});

test('manual exploration distinguishes the chosen image from the recorded or estimated day',()=>{
  const phase={id:'menstrual',basis:'recorded'};
  const other={id:'ovulatory',current:'menstrual',date:'2026-09-28'};
  assert.deepEqual(resolveCycleExploration(phase,'2026-09-28',other),{current:'menstrual',shown:'ovulatory',exploring:true});
  assert.equal(resolveCycleExploration(phase,'2026-09-28',{...other,id:'menstrual'}).exploring,false);
  assert.equal(resolveCycleExploration(phase,'2026-09-28',{...other,id:'invalid'}).shown,'menstrual');
});

test('educational hormone shapes stay bounded with independent normalization and ordered peaks',()=>{
  const rows=cycleHormoneSchematic();
  assert.equal(rows[0].x,0);assert.equal(rows.at(-1).x,1);
  for(const h of CYCLE_HORMONES){
    assert.ok(rows.every(r=>Number.isFinite(r[h.id])&&r[h.id]>=0&&r[h.id]<=1),h.id);
    assert.equal(Math.max(...rows.map(r=>r[h.id])),1,h.id);
  }
  const peak=id=>rows.reduce((best,r)=>r[id]>best[id]?r:best).x;
  assert.ok(peak('e2')<peak('lh'));
  assert.ok(peak('lh')<peak('p4'));
  assert.ok(rows.find(r=>r.x===0).p4<.1);
  assert.ok(rows.at(-1).p4<.2);
  assert.equal(cycleHormoneSchematic(-100).length,25);
  assert.equal(cycleHormoneSchematic(Infinity).length,121);
  assert.equal(cycleHormoneSchematic(1000000).length,361);
});

test('every phase has both roles, five practical topics and complete separate bilingual symbolism',()=>{
  for(const id of CYCLE_ORDER){
    const phase=CYCLE_DEPTH[id];
    for(const key of ['short','title','hormones','uterus','woman','partner','shared'])assert.ok(phase[key].every(v=>typeof v==='string'&&v.length>0),`${id}.${key}`);
    assert.notDeepEqual(phase.woman,phase.partner,id);
    assert.deepEqual(phase.care.map(item=>item.id),['move','food','mind','plan','bond']);
    for(const item of phase.care){assert.ok(item.woman.length===2&&item.partner.length===2);assert.notDeepEqual(item.woman,item.partner);}
    for(const key of ['season','day','direction','archetype','text','shadow','question','ritual','storyTitle','story'])assert.ok(phase.symbol[key].length===2&&phase.symbol[key].every(Boolean),`${id}.symbol.${key}`);
    assert.ok(phase.symbol.source===null||['inana','demeter'].includes(phase.symbol.source));
  }
});


test('personal wording changes self-address without changing the underlying cycle guidance',()=>{
  const text='Pokud jsi unavená, odpočívej. Fáze neměří hormony.';
  assert.equal(cyclePersonalText(text,'female'),text);
  assert.equal(cyclePersonalText(text,'male'),'Pokud jsi unavený, odpočívej. Fáze neměří hormony.');
  assert.equal(cyclePersonalText(text,'neutral'),'Pokud cítíš únavu, odpočívej. Fáze neměří hormony.');
  assert.equal(cyclePersonalText('Druhý člověk má vlastní zkušenost.','male'),'Druhý člověk má vlastní zkušenost.');
});
