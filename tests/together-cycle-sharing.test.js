import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {handleTogether} from '../src/shared/product/togetherApi.js';
import {emptyTogether} from '../src/shared/product/together.js';

function fixture(){
  const sql=new DatabaseSync(':memory:');
  const db={prepare(query){const stmt=args=>({bind:(...a)=>stmt(a),run:async()=>({meta:sql.prepare(query).run(...args)}),first:async()=>sql.prepare(query).get(...args)||null,all:async()=>({results:sql.prepare(query).all(...args)})});return stmt([]);}};
  const call=async(actor,path='',body,viewDate='2026-09-28')=>{
    const method=body===undefined?'GET':['invite','claim','disconnect'].includes(path)?'POST':'PUT';
    const r=await handleTogether(new Request(`https://test.local/api/together${path?'/'+path:''}?date=2026-09-28&viewDate=${viewDate}`,{method,headers:body===undefined?{}:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)}),db,actor,{owner:actor.startsWith('client:'),now:Date.parse('2026-09-28T12:00:00Z')});
    return {status:r.status,...await r.json()};
  };
  const pair=async scopes=>{const invite=await call('client:a','invite',{});await call('coach:tanmay','claim',{code:invite.code});const state=await call('client:a');await call('client:a','sharing',{scopes,revision:state.link.revision});};
  const doc={...emptyTogether(),mode:'estimate',periods:[{start:'2026-09-07',end:'2026-09-11'}],days:{'2026-09-08':{note:'LEGACY PRIVATE',cycleNote:'Warmth helped',flow:'medium',pain:'mild',mood:'PRIVATE HISTORIC MOOD'}}};
  return {call,pair,doc};
}

test('selected-day cycle details require independent grants and never expose old private notes',async()=>{
  const {call,pair,doc}=fixture();await call('client:a','self',{revision:0,doc});await pair(['cycle','phase','wellbeing']);
  let state=await call('coach:tanmay','',undefined,'2026-09-08');
  assert.equal(state.cycleView.date,'2026-09-08');assert.equal(state.cycleView.phase.id,'menstrual');
  assert.equal(state.cycleView.cycleNote,undefined);assert.equal(state.cycleView.pain,undefined);assert.equal(state.cycleView.flow,undefined);
  assert.equal(state.cycleView.wellbeing,undefined);assert.equal(JSON.stringify(state).includes('LEGACY PRIVATE'),false);
  let owner=await call('client:a');await call('client:a','sharing',{revision:owner.link.revision,scopes:['cycle-note','pain','flow']});
  state=await call('coach:tanmay','',undefined,'2026-09-08');
  assert.equal(state.cycleView.cycleNote.text,'Warmth helped');assert.equal(state.cycleView.pain.value,'mild');assert.equal(state.cycleView.flow.value,'medium');
  assert.equal(state.cycleView.phase,undefined);assert.equal(state.cycleView.cycle,undefined);assert.equal(JSON.stringify(state).includes('LEGACY PRIVATE'),false);
  assert.equal(JSON.stringify(state).includes('PRIVATE HISTORIC MOOD'),false);
  owner=await call('client:a');await call('client:a','sharing',{revision:owner.link.revision,scopes:[]});
  assert.deepEqual((await call('coach:tanmay','',undefined,'2026-09-08')).cycleView,{date:'2026-09-08'});
  assert.equal((await call('client:b','',undefined,'2026-09-08')).partner,null);
});

test('browsing a cycle date cannot change the daily answer context or disclose future private history',async()=>{
  const {call,pair,doc}=fixture();await call('client:a','self',{revision:0,doc});await pair(['cycle','phase']);
  const current=await call('coach:tanmay'),future=await call('coach:tanmay','',undefined,'2026-10-06');
  assert.equal(future.today,'2026-09-28');assert.deepEqual(future.question,current.question);assert.deepEqual(future.answer,current.answer);
  assert.equal(future.cycleView.date,'2026-10-06');assert.equal(future.cycleView.periods,undefined);
  assert.equal((await call('coach:tanmay','',undefined,'9999-12-31')).cycleView.date,'2026-09-28');
});

test('clearing own cycle or entries uses revision checks and cannot alter the other account',async()=>{
  const {call,pair,doc}=fixture();await call('client:a','self',{revision:0,doc});await pair(['cycle','phase']);
  const own=await call('client:a');
  const reset={...own.self.doc,periods:[],mode:'observe',days:{}};
  assert.equal((await call('client:a','self',{revision:0,doc:reset})).status,409);
  assert.equal((await call('client:a','self',{revision:own.self.revision,doc:reset})).status,200);
  assert.deepEqual((await call('client:a')).self.doc.periods,[]);
  assert.equal((await call('coach:tanmay')).cycleView.phase.id,null);
  assert.equal((await call('coach:tanmay','self',{revision:0,doc})).status,403);
  const cleared=await call('client:a');
  assert.equal((await call('client:a','self',{revision:cleared.self.revision,doc:own.self.doc})).status,200);
  assert.equal((await call('client:a')).self.doc.days['2026-09-08'].note,'LEGACY PRIVATE');
});
