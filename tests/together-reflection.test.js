import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {cleanReflection,hasReflection,previousReflection} from '../src/shared/product/togetherJournal.js';
import {handleTogether} from '../src/shared/product/togetherApi.js';

test('reflection follow-through is optional, bounded, and leaves legacy shape unchanged',()=>{
  assert.deepEqual(cleanReflection({appreciation:' Thanks ',need:'Rest',next:'Tea',secret:'discard'}),{appreciation:'Thanks',need:'Rest',next:'Tea'});
  assert.deepEqual(cleanReflection({}),{appreciation:'',need:'',next:''});
  const follow={week:'2026-09-14',step:' One small step ',status:'partly',note:'a'.repeat(500),secret:'discard'};
  const doc=cleanReflection({followThrough:follow},'2026-09-21');
  assert.equal(doc.followThrough.note.length,400);assert.equal(doc.followThrough.step,'One small step');assert.equal(doc.followThrough.secret,undefined);assert.equal(hasReflection(doc),true);
  for(const invalid of [{...follow,status:'bad'},{...follow,week:'2026-09-15'},{...follow,week:'2026-09-21'},{...follow,week:'2026-09-28'},{...follow,step:''}])assert.equal(cleanReflection({followThrough:invalid},'2026-09-21').followThrough,undefined);
  assert.equal(hasReflection(cleanReflection({})),false);
});

test('previous commitment belongs to the same person and precedes the week being edited',()=>{
  const rows=[{side:'mine',week:'2026-09-07',doc:{next:'Older'}},{side:'partner',week:'2026-09-21',doc:{next:'Partner'}},{side:'mine',week:'2026-09-14',doc:{next:'Use this'}},{side:'mine',week:'2026-09-21',doc:{next:''}},{side:'mine',week:'2026-09-28',doc:{next:'Current'}}];
  assert.equal(previousReflection(rows,'2026-09-28').doc.next,'Use this');
  assert.equal(previousReflection(rows,'2026-09-28','partner').doc.next,'Partner');
  assert.equal(previousReflection(rows,'2026-09-14').doc.next,'Older');
  assert.equal(previousReflection(rows,'2026-09-07'),null);
});

test('weekly follow-through survives API save and reload, stays separate per partner, and can be withdrawn',async()=>{
  const sql=new DatabaseSync(':memory:');
  const db={prepare(query){const stmt=args=>({bind:(...a)=>stmt(a),run:async()=>({meta:sql.prepare(query).run(...args)}),first:async()=>sql.prepare(query).get(...args)||null,all:async()=>({results:sql.prepare(query).all(...args)})});return stmt([]);}};
  const call=async(actor,path='',body)=>{const method=body===undefined?'GET':['invite','claim','disconnect'].includes(path)?'POST':'PUT';const response=await handleTogether(new Request(`https://test.local/api/together${path?'/'+path:''}`,{method,headers:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)}),db,actor,{owner:actor.startsWith('client:'),now:Date.parse('2026-09-28T12:00:00Z')});return {status:response.status,...await response.json()};};
  try{
    const invite=await call('client:a','invite',{});await call('coach:tanmay','claim',{code:invite.code});const pending=await call('client:a');await call('client:a','sharing',{scopes:[],revision:pending.link.revision});const state=await call('client:a');
    const followThrough={week:'2026-09-21',step:'After dinner, ten minutes together',status:'partly',note:'Two evenings helped'};
    const payload={week:'2026-09-28',doc:{appreciation:'Thank you',need:'More listening',next:'Try again on Tuesday',followThrough},revision:0,linkId:state.link.id,linkRevision:state.link.revision};
    assert.equal((await call('client:a','reflection',payload)).status,200);
    assert.deepEqual((await call('coach:tanmay')).reflections.find(row=>row.side==='partner').doc.followThrough,followThrough);
    assert.equal((await call('client:a','reflection',payload)).status,409);
    assert.equal((await call('coach:tanmay','reflection',{...payload,doc:{next:'My different perspective'}})).status,200);
    assert.equal((await call('client:a','reflection',{...payload,revision:1,doc:{}})).status,200);
    const after=await call('coach:tanmay');assert.equal(hasReflection(after.reflections.find(row=>row.side==='partner').doc),false);assert.equal(after.reflections.find(row=>row.side==='mine').doc.next,'My different perspective');
  }finally{sql.close();}
});
