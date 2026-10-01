import test from 'node:test';
import assert from 'node:assert/strict';
import {cycleChoice,cycleChoices} from '../src/shared/product/togetherCycleChoices.js';
import {CYCLE_FOOD_SOURCES} from '../src/shared/product/togetherCycleFood.js';
import {CYCLE_SPIRALS,CYCLE_IMAGERY_SOURCES} from '../src/shared/product/togetherCycleImagery.js';

const phases=['menstrual','follicular','ovulatory','luteal'];
const sourceIds=new Set([...CYCLE_FOOD_SOURCES,...CYCLE_IMAGERY_SOURCES].map(s=>s.id));
const bilingual=value=>Array.isArray(value)&&value.length===2&&value.every(v=>typeof v==='string'&&v.trim().length>0);

test('each phase has a complete bilingual library with traceable sources',()=>{
  const ids=[];
  for(const phase of phases){
    for(const topic of ['food','ritual','story']){
      const items=cycleChoices(phase,topic);
      assert.ok(items.length>=(topic==='food'?8:5),`${phase}/${topic}`);
      for(const item of items){
        ids.push(item.id);
        for(const key of ['title','text','why'])assert.ok(bilingual(item[key]),`${item.id}/${key}`);
        assert.ok(Array.isArray(item.sourceIds));
        assert.ok(item.sourceIds.every(id=>sourceIds.has(id)),item.id);
        if(topic==='food'){assert.ok(item.sourceIds.length>0);assert.ok(bilingual(item.partnerWhy),item.id);}
        if(topic==='ritual'){
          assert.ok(item.durationMinutes>0&&item.durationMinutes<=15);
          assert.ok(item.steps.length>=2&&item.steps.every(bilingual),item.id);
        }
        if(topic==='story'){
          assert.ok(['traditional','original'].includes(item.kind));
          if(item.kind==='traditional')assert.ok(item.sourceIds.length>0,item.id);
        }
      }
    }
    const spiral=CYCLE_SPIRALS[phase];
    for(const key of ['title','text','question'])assert.ok(bilingual(spiral[key]));
    assert.ok(spiral.sourceIds.every(id=>sourceIds.has(id)));
  }
  assert.equal(new Set(ids).size,ids.length);
  assert.equal(new Set(phases.map(p=>CYCLE_SPIRALS[p].text[0])).size,4);
});

test('daily suggestions are stable, change with the date and arrows visit the whole library',()=>{
  for(const phase of phases)for(const topic of ['food','ritual','story']){
    const date='2026-09-30',first=cycleChoice(phase,topic,date),before=JSON.stringify(cycleChoices(phase,topic));
    assert.deepEqual(cycleChoice(phase,topic,date),first);
    assert.notEqual(cycleChoice(phase,topic,'2026-10-01').item.id,first.item.id);
    const visited=Array.from({length:first.total},(_,i)=>cycleChoice(phase,topic,date,i).item.id);
    assert.equal(new Set(visited).size,first.total);
    assert.equal(cycleChoice(phase,topic,date,first.total).item.id,first.item.id);
    assert.equal(cycleChoice(phase,topic,date,-1).item.id,visited.at(-1));
    assert.equal(JSON.stringify(cycleChoices(phase,topic)),before);
  }
});

test('unknown days never invent a phase and invalid offsets cannot break a choice',()=>{
  assert.deepEqual(cycleChoice(null,'food','2026-10-01'),{item:null,index:0,total:0});
  assert.deepEqual(cycleChoices('follicular','unknown'),[]);
  assert.deepEqual(cycleChoice('luteal','food','invalid'),cycleChoice('luteal','food',''));
  for(const offset of [NaN,Infinity,1.5,'1'])assert.deepEqual(cycleChoice('luteal','food','2026-10-01',offset),cycleChoice('luteal','food','2026-10-01'));
});
