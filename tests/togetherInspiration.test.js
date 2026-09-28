import test from 'node:test';
import assert from 'node:assert/strict';
import {inspirationBatch,filterInspirations} from '../src/shared/product/togetherInspiration.js';
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
