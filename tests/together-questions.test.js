import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {handleTogether} from '../src/shared/product/togetherApi.js';
import {dailyQuestion,legacyQuestion} from '../src/shared/product/togetherJournal.js';

const day='2026-09-28',now=Date.parse(`${day}T12:00:00Z`);
function fixture(){
  const sql=new DatabaseSync(':memory:');
  const db={prepare(query){const stmt=args=>({bind:(...a)=>stmt(a),run:async()=>({meta:sql.prepare(query).run(...args)}),first:async()=>sql.prepare(query).get(...args)||null,all:async()=>({results:sql.prepare(query).all(...args)})});return stmt([]);}};
  const call=async(actor,path='',body,options={})=>{
    const method=body===undefined?'GET':['invite','claim','disconnect'].includes(path)?'POST':'PUT';
    const response=await handleTogether(new Request(`https://test.local/api/together${path?'/'+path:''}`,{method,headers:body===undefined?{}:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)}),db,actor,{owner:actor.startsWith('client:'),now,...options});
    return {status:response.status,...await response.json()};
  };
  const pair=async()=>{
    const invite=await call('client:a','invite',{});
    assert.equal((await call('coach:tanmay','claim',{code:invite.code})).status,200);
    const state=await call('client:a');
    assert.equal((await call('client:a','sharing',{scopes:[],revision:state.link.revision})).status,200);
    return call('client:a');
  };
  const answer=(state,text)=>({answer:text,questionId:state.question.id,questionDay:state.today,linkId:state.link.id,linkRevision:state.link.revision});
  return {sql,call,pair,answer};
}

test('new pairs snapshot one daily prompt, preserve its wording, and keep the mutual reveal gate',async()=>{
  const {sql,call,pair,answer}=fixture();const state=await pair();
  assert.deepEqual(state.question,dailyQuestion(day));
  assert.equal(sql.prepare('SELECT count(*) AS n FROM together_questions').get().n,0);
  assert.equal((await call('client:a','answer',answer(state,'My perspective'))).status,200);
  let other=await call('coach:tanmay');assert.equal(other.answer.partner,'');
  assert.deepEqual(other.question,state.question);
  assert.equal((await call('coach:tanmay','answer',answer(other,'Another perspective'))).status,200);
  other=await call('coach:tanmay');assert.equal(other.answer.partner,'My perspective');
  const saved=sql.prepare('SELECT * FROM together_questions').get();
  assert.deepEqual(JSON.parse(saved.doc),state.question.text);
  assert.equal(sql.prepare('SELECT count(*) AS n FROM together_questions').get().n,1);
  const tomorrow=await call('client:a','',undefined,{now:now+86400000});
  assert.deepEqual(tomorrow.history[0].question,state.question);
  // Rendering reads the persisted words, rather than looking up a mutable catalogue by ID.
  const frozen=['Původní znění otázky','Original wording of the question'];
  sql.prepare('UPDATE together_questions SET doc = ?').run(JSON.stringify(frozen));
  assert.deepEqual((await call('client:a')).question.text,frozen);
  assert.deepEqual((await call('client:a','',undefined,{now:now+86400000})).history[0].question.text,frozen);
});

test('pre-upgrade answer rows including withdrawn rows keep the legacy question with no date cutover',async()=>{
  const {sql,call,pair,answer}=fixture();const initial=await pair();
  sql.prepare('INSERT INTO together_answers (link_id,day,actor,answer) VALUES (?,?,?,?)').run(initial.link.id,day,'client:a','Existing answer');
  const state=await call('coach:tanmay');assert.deepEqual(state.question,legacyQuestion(day));
  assert.equal((await call('coach:tanmay','answer',answer(state,'A new answer to the old prompt'))).status,200);
  assert.deepEqual((await call('client:a')).history[0].question,legacyQuestion(day));
  assert.equal((await call('client:a','answer',{answer:''})).status,200);
  assert.equal((await call('coach:tanmay','answer',{answer:''})).status,200);
  assert.deepEqual((await call('client:a')).question,legacyQuestion(day));
  assert.equal((await call('client:a')).history.length,0);
});

test('legacy clients cannot silently write to a different modern question',async()=>{
  const {call,pair,answer}=fixture();const state=await pair();
  assert.equal((await call('client:a','answer',answer(state,'Modern answer'))).status,200);
  const legacy=await call('coach:tanmay','answer',{answer:'Answer to old displayed question'});
  assert.equal(legacy.status,409);assert.equal(legacy.error,'question-changed');
  assert.equal((await call('coach:tanmay')).answer.mine,'');
});

test('an old client can pin a legacy prompt first and a stale modern form must reload',async()=>{
  const {call,pair,answer}=fixture();const stale=await pair();
  assert.equal((await call('coach:tanmay','answer',{answer:'Old client answer'})).status,200);
  const rejected=await call('client:a','answer',answer(stale,'Written to the newer prompt'));
  assert.equal(rejected.status,409);assert.equal(rejected.error,'question-changed');
  const refreshed=await call('client:a');assert.deepEqual(refreshed.question,legacyQuestion(day));
  assert.equal(refreshed.answer.mine,'');assert.equal(refreshed.answer.partner,'');
  assert.equal((await call('client:a','answer',answer(refreshed,'Written after reading the correct prompt'))).status,200);
});

test('wrong question IDs, stale pairing and outsider writes leave existing answers intact',async()=>{
  const {sql,call,pair,answer}=fixture();const state=await pair();
  assert.equal((await call('client:a','answer',{...answer(state,'Wrong'),questionId:'unknown-prompt'})).status,409);
  assert.equal(sql.prepare('SELECT count(*) AS n FROM together_questions').get().n,0);
  assert.equal((await call('client:b','answer',answer(state,'Private outsider'))).status,403);
  assert.equal((await call('client:a','answer',{...answer(state,'Stale'),linkRevision:-1})).status,409);
  assert.equal((await call('client:a','answer',answer(state,'Keep me'))).status,200);
  assert.equal((await call('client:a','answer',{...answer(state,''),questionId:'unknown-prompt'})).status,409);
  assert.equal((await call('client:a')).answer.mine,'Keep me');
  assert.equal((await call('client:a','disconnect',{revision:state.link.revision})).status,200);
  assert.deepEqual((await call('client:a')).history,[]);
  await pair();
  assert.equal((await call('client:a','answer',answer(state,'Old relationship draft'))).status,409);
  assert.deepEqual((await call('client:a')).history,[]);
});

test('simultaneous first answers keep one question identity and withdrawing an answer hides its counterpart',async()=>{
  const {sql,call,pair,answer}=fixture();const state=await pair();
  const results=await Promise.all([call('client:a','answer',answer(state,'One')),call('coach:tanmay','answer',answer(state,'Two'))]);
  assert.deepEqual(results.map(result=>result.status),[200,200]);
  assert.equal(sql.prepare('SELECT count(*) AS n FROM together_questions').get().n,1);
  assert.equal((await call('coach:tanmay')).answer.partner,'One');
  assert.equal((await call('coach:tanmay','answer',answer(state,''))).status,200);
  const after=await call('coach:tanmay');assert.equal(after.answer.partner,'');assert.equal(after.history[0].partner,'');
  assert.deepEqual(after.question,state.question);
});

test('a draft cannot cross midnight or a later recurrence of the same question',async()=>{
  const {sql,call,pair,answer}=fixture();const state=await pair();
  const afterMidnight=await call('client:a','answer',answer(state,'Yesterday’s draft'),{now:now+86400000});
  assert.equal(afterMidnight.status,409);assert.equal(afterMidnight.error,'question-changed');
  const recurrenceNow=now+28*86400000;
  const recurring=await call('client:a','',undefined,{now:recurrenceNow});
  assert.equal(recurring.question.id,state.question.id);
  assert.notEqual(recurring.today,state.today);
  const old=await call('client:a','answer',answer(state,'Old draft with a matching question ID'),{now:recurrenceNow});
  assert.equal(old.status,409);assert.equal(old.error,'question-changed');
  assert.equal(sql.prepare('SELECT count(*) AS n FROM together_answers').get().n,0);
  assert.equal(sql.prepare('SELECT count(*) AS n FROM together_questions').get().n,0);
  assert.equal((await call('client:a','answer',answer(recurring,'A fresh answer for this day'),{now:recurrenceNow})).status,200);
});
