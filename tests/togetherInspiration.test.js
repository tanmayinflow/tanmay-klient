import test from 'node:test';
import assert from 'node:assert/strict';
import {inspirationBatch,filterInspirations} from '../src/shared/product/togetherInspiration.js';
import {PLAN_INSPIRATIONS} from '../src/shared/product/togetherConnectionContent.js';

test('refresh offers alternatives instead of repeating the visible inspiration batch',()=>{
  const first=inspirationBatch(PLAN_INSPIRATIONS,[],()=>.4);
  const second=inspirationBatch(PLAN_INSPIRATIONS,first.map(i=>i.id),()=>.4);
  assert.equal(first.length,3);assert.equal(second.length,3);
  assert.equal(new Set([...first,...second].map(i=>i.id)).size,6);
  const small=PLAN_INSPIRATIONS.slice(0,4);
  assert.ok(inspirationBatch(small,small.slice(0,3).map(i=>i.id),()=>.1).some(i=>i.id===small[3].id));
  assert.deepEqual(inspirationBatch([],[],()=>0),[]);
});
test('inspiration filters honour chosen time, place and energy without inventing a result',()=>{
  const filtered=filterInspirations(PLAN_INSPIRATIONS,{context:'home',minutes:15,energy:1});
  assert.ok(filtered.length>0);
  assert.ok(filtered.every(i=>['home','anywhere'].includes(i.context)&&i.minutes<=15&&i.energy===1));
  assert.deepEqual(filterInspirations(PLAN_INSPIRATIONS,{minutes:0}),[]);
  assert.ok(PLAN_INSPIRATIONS.every(i=>i.minutes>=10&&i.note.cs.length<=600&&i.note.en.length<=600));
});
