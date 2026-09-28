import test from 'node:test';
import assert from 'node:assert/strict';
import {inspirationBatch,filterInspirations,filteredInspirationBatch} from '../src/shared/product/togetherInspiration.js';
import {PLAN_INSPIRATIONS,PLAN_THEMES} from '../src/shared/product/togetherConnectionContent.js';

test('refresh offers alternatives instead of repeating the visible inspiration batch',()=>{
  const first=inspirationBatch(PLAN_INSPIRATIONS,[],()=>.4);
  const second=inspirationBatch(PLAN_INSPIRATIONS,first.map(i=>i.id),()=>.4);
  assert.equal(first.length,3);assert.equal(second.length,3);
  assert.equal(new Set([...first,...second].map(i=>i.id)).size,6);
  const small=PLAN_INSPIRATIONS.slice(0,4);
  assert.ok(inspirationBatch(small,small.slice(0,3).map(i=>i.id),()=>.1).some(i=>i.id===small[3].id));
  assert.deepEqual(inspirationBatch([],[],()=>0),[]);
});
test('theme filters combine selected interests while preserving practical constraints',()=>{
  const themes=['nature','rest'];
  const selected=filterInspirations(PLAN_INSPIRATIONS,{themes,minutes:30,energy:1});
  assert.ok(selected.length>0);assert.ok(selected.every(item=>item.minutes<=30&&item.energy<=1&&themes.some(theme=>item.themes.includes(theme))));
  assert.deepEqual(filterInspirations(PLAN_INSPIRATIONS,{themes:['unknown']}),[]);
  assert.equal(new Set(PLAN_INSPIRATIONS.map(item=>item.id)).size,PLAN_INSPIRATIONS.length);
  assert.ok(PLAN_INSPIRATIONS.every(item=>item.themes.length&&item.themes.every(theme=>PLAN_THEMES.some(t=>t.id===theme))));
});
test('rotation prefers unseen ideas and only repeats the current batch if the pool requires it',()=>{
  const items=PLAN_INSPIRATIONS.slice(0,9),seen=items.slice(0,6).map(item=>item.id),current=items.slice(3,6).map(item=>item.id);
  const next=inspirationBatch(items,current,()=>.4,3,seen);
  assert.deepEqual(new Set(next.map(item=>item.id)),new Set(items.slice(6).map(item=>item.id)));
  const almostAll=inspirationBatch(items,current,()=>.4,3,items.slice(0,8).map(item=>item.id));
  assert.ok(almostAll.some(item=>item.id===items[8].id));assert.ok(almostAll.every(item=>!current.includes(item.id)));
  assert.equal(new Set(almostAll.map(item=>item.id)).size,3);
});
test('inspiration filters honour chosen time, place and energy without inventing a result',()=>{
  const filtered=filterInspirations(PLAN_INSPIRATIONS,{context:'home',minutes:15,energy:1});
  assert.ok(filtered.length>0);
  assert.ok(filtered.every(i=>['home','anywhere'].includes(i.context)&&i.minutes<=15&&i.energy===1));
  assert.deepEqual(filterInspirations(PLAN_INSPIRATIONS,{minutes:0}),[]);
  assert.ok(PLAN_INSPIRATIONS.every(i=>i.minutes>=10&&i.note.cs.length<=600&&i.note.en.length<=600));
});
test('multiple places form a union, including portable ideas without leaking other locations',()=>{
  const both=filterInspirations(PLAN_INSPIRATIONS,{contexts:['home','outside'],minutes:480});
  assert.ok(both.some(item=>item.context==='home'));
  assert.ok(both.some(item=>item.context==='outside'));
  assert.ok(both.some(item=>item.context==='anywhere'));
  assert.ok(both.every(item=>['home','outside','anywhere'].includes(item.context)));
  for(const context of ['home','outside','distance'])assert.deepEqual(filterInspirations(PLAN_INSPIRATIONS,{context}),filterInspirations(PLAN_INSPIRATIONS,{contexts:[context]}));
  assert.deepEqual(filterInspirations(PLAN_INSPIRATIONS,{contexts:[]}),filterInspirations(PLAN_INSPIRATIONS,{context:'all'}));
  assert.deepEqual(filterInspirations(PLAN_INSPIRATIONS,{context:'home',contexts:[]}),filterInspirations(PLAN_INSPIRATIONS,{context:'all'}));
});
test('half-day and full-day choices include genuinely longer ideas while all constraints still hold',()=>{
  const ordinary=filterInspirations(PLAN_INSPIRATIONS),half=filterInspirations(PLAN_INSPIRATIONS,{minutes:240}),full=filterInspirations(PLAN_INSPIRATIONS,{minutes:480});
  assert.ok(ordinary.every(item=>item.minutes<=120));
  assert.ok(half.some(item=>item.minutes===240));assert.ok(half.every(item=>item.minutes<=240));
  assert.ok(full.some(item=>item.minutes===480));assert.ok(full.some(item=>item.minutes>240&&item.minutes<480));
  const quietHome=filterInspirations(PLAN_INSPIRATIONS,{contexts:['home'],minutes:480,energy:1,themes:['rest']});
  assert.ok(quietHome.some(item=>item.minutes>240));
  assert.ok(quietHome.every(item=>['home','anywhere'].includes(item.context)&&item.energy<=1&&item.themes.includes('rest')));
  assert.deepEqual(filterInspirations(PLAN_INSPIRATIONS,{contexts:['distance'],minutes:480,themes:['nature']}),[]);
});
test('longer windows surface a long idea and refresh keeps it within the eligible unseen alternatives',()=>{
  for(const minutes of [240,480])for(const random of [()=>.1,()=>.6,()=>.99]){
    const filters={contexts:['home','outside'],minutes},lower=minutes===240?120:240;
    const first=filteredInspirationBatch(PLAN_INSPIRATIONS,filters,[],random);
    assert.ok(first.some(item=>item.minutes>lower));assert.equal(new Set(first.map(item=>item.id)).size,3);
    const second=filteredInspirationBatch(PLAN_INSPIRATIONS,filters,first.map(item=>item.id),random,3,first.map(item=>item.id));
    assert.ok(second.some(item=>item.minutes>lower));assert.equal(new Set([...first,...second].map(item=>item.id)).size,6);
    assert.ok(second.every(item=>item.minutes<=minutes&&['home','outside','anywhere'].includes(item.context)));
  }
  const narrow={contexts:['distance'],minutes:480,energy:1};
  const distance=filteredInspirationBatch(PLAN_INSPIRATIONS,narrow,[],()=>.1);
  assert.ok(distance.every(item=>['distance','anywhere'].includes(item.context)));
  const oneLong=[{id:'long',minutes:480,context:'home',energy:1},...Array.from({length:6},(_,i)=>({id:`short-${i}`,minutes:15,context:'home',energy:1}))];
  const current=['long','short-0','short-1'];
  const refreshed=filteredInspirationBatch(oneLong,{minutes:480},current,()=>.3,3,current);
  assert.ok(refreshed.every(item=>!current.includes(item.id)), 'do not repeat the only long card when it is already visible');
});
