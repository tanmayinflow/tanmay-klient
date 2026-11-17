import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {makeD1,makeEnv,req} from './helpers/env.js';
import worker from '../worker/index.js';
import {ensureExercisePolicy,handleExercisePolicy,handleCustomExercises} from '../src/shared/product/exercisePolicyServer.js';
const main=JSON.parse(readFileSync(new URL('../package.json',import.meta.url))).name==='tanmay-web';
const exercise={id:'custom_ex_one',custom:true,name:'Own row',metric:'reps',att:[]};
async function dbFixture(){const db=makeD1();await db.prepare('CREATE TABLE members(user_id TEXT PRIMARY KEY,email TEXT)').run();await db.prepare("INSERT INTO members(user_id,email) VALUES('a','a@example.test'),('b','b@example.test')").run();await ensureExercisePolicy(db);return db;}
const request=(method,body)=>new Request('https://local.test/api/custom-exercises',{method,...(body?{headers:{'content-type':'application/json'},body:JSON.stringify(body)}:{})});
test('coach capability defaults on, targets one member and never returns exercise content',async()=>{
 const db=await dbFixture();
 assert.equal((await(await handleExercisePolicy(request('GET'),{db,userId:'a'})).json()).enabled,true);
 assert.equal((await handleExercisePolicy(request('PUT',{enabled:false}),{db,userId:'a'})).status,405);
 const result=await handleExercisePolicy(request('PUT',{enabled:false}),{db,userId:'a',coach:true});
 assert.deepEqual(await result.json(),{ok:true,enabled:false});
 assert.equal((await(await handleExercisePolicy(request('GET'),{db,userId:'b'})).json()).enabled,true);
 assert.equal((await handleExercisePolicy(request('PUT',{enabled:false,userId:'b'}),{db,userId:'a',coach:true})).status,400);
});
test('disabled authoring cannot create, modify or remove; history stays readable and private',async()=>{
 const db=await dbFixture(),actor={db,userId:'a'};
 assert.equal((await handleCustomExercises(request('PUT',{exercise}),actor)).status,200);
 await handleExercisePolicy(request('PUT',{enabled:false}),{...actor,coach:true});
 assert.equal((await handleCustomExercises(request('PUT',{exercise:{...exercise,name:'changed'}}),actor)).status,403);
 assert.equal((await handleCustomExercises(request('DELETE'),{...actor,id:exercise.id})).status,403);
 assert.deepEqual((await(await handleCustomExercises(request('GET'),actor)).json()).exercises,[exercise]);
 assert.deepEqual((await(await handleCustomExercises(request('GET'),{db,userId:'b'})).json()).exercises,[]);
 await handleExercisePolicy(request('PUT',{enabled:true}),{...actor,coach:true});
 assert.equal((await handleCustomExercises(request('DELETE'),{...actor,id:exercise.id})).status,200);
 const archived=await(await handleCustomExercises(request('GET'),actor)).json();assert.deepEqual(archived.archivedIds,[exercise.id]);assert.deepEqual(archived.exercises,[]);
 assert.equal((await db.prepare('SELECT doc FROM client_custom_exercises WHERE user_id=?').bind('a').first()).doc,JSON.stringify(exercise));
 await handleCustomExercises(request('PUT',{exercise}),actor);
 assert.deepEqual((await(await handleCustomExercises(request('GET'),actor)).json()).exercises,[exercise]);
});
test('invalid IDs, missing custom flag and oversized exercise bodies are refused',async()=>{
 const db=await dbFixture();
 for(const bad of [{...exercise,id:'../other'},{...exercise,custom:false},{...exercise,note:'x'.repeat(70000)}]){
  assert.equal((await handleCustomExercises(request('PUT',{exercise:bad}),{db,userId:'a'})).status,400);
 }
});
test('real worker routes require actor membership and coach owner',async()=>{
 if(main){
  const db=await dbFixture(),env=makeEnv({KLIENT_DB:db,OWNER_EMAIL:'coach@example.test'});
  assert.equal((await worker.fetch(req('/api/klienti/a/exercise-policy',{email:'stranger@example.test'}),env,{})).status,403);
  const response=await worker.fetch(req('/api/klienti/a/exercise-policy',{email:'coach@example.test',method:'PUT',body:{enabled:false}}),env,{});
  assert.equal(response.status,200);assert.equal((await response.json()).enabled,false);
 }else{
  const env=makeEnv({INVITE_WORD:'enter'}),email='a@example.test';
  assert.equal((await worker.fetch(req('/api/custom-exercises',{email}),env,{})).status,403);
  await worker.fetch(req('/api/join',{email,method:'POST',body:{word:'enter'}}),env,{});
  assert.equal((await worker.fetch(req('/api/exercise-policy',{email}),env,{})).status,200);
  const saved=await worker.fetch(req('/api/custom-exercises',{email,method:'PUT',body:{exercise}}),env,{});assert.equal(saved.status,200,await saved.text());
 }
});

test('stale owner headers reject custom exercise reads, writes and deletes after an account switch',{skip:main},async()=>{
 const env=makeEnv({INVITE_WORD:'enter'}),a='first@example.test',b='second@example.test';
 for(const email of [a,b])assert.equal((await worker.fetch(req('/api/join',{email,method:'POST',body:{word:'enter'}}),env,{})).status,200);
 const ownerA=(await(await worker.fetch(req('/api/me',{email:a}),env,{})).json()).owner;
 const ownerB=(await(await worker.fetch(req('/api/me',{email:b}),env,{})).json()).owner;
 assert.notEqual(ownerA,ownerB);
 const own={...exercise,name:'Second account private exercise'};
 assert.equal((await worker.fetch(req('/api/custom-exercises',{email:b,method:'PUT',headers:{'X-Tanmay-Owner':ownerB},body:{exercise:own}}),env,{})).status,200);
 for(const [path,method,body] of [
  ['/api/exercise-policy','GET'],
  ['/api/custom-exercises','GET'],
  ['/api/custom-exercises','PUT',{exercise:{...exercise,name:'Stale first account content'}}],
  [`/api/custom-exercises/${exercise.id}`,'DELETE'],
 ]){
  const response=await worker.fetch(req(path,{email:b,method,body,headers:{'X-Tanmay-Owner':ownerA}}),env,{});
  assert.equal(response.status,409,`${method} ${path}`);
  assert.equal((await response.json()).code,'account-changed');
 }
 const first=await(await worker.fetch(req('/api/custom-exercises',{email:a,headers:{'X-Tanmay-Owner':ownerA}}),env,{})).json();
 const second=await(await worker.fetch(req('/api/custom-exercises',{email:b,headers:{'X-Tanmay-Owner':ownerB}}),env,{})).json();
 assert.deepEqual(first.exercises,[]);
 assert.deepEqual(second.exercises,[own]);assert.deepEqual(second.archivedIds,[]);
});

test('revoking authoring or membership after the preliminary read still prevents atomic exercise mutations',async()=>{
 for(const revoke of ['policy','membership'])for(const operation of ['create','update','archive']){
  const db=await dbFixture(),actor={db,userId:'a'};
  await handleExercisePolicy(request('PUT',{enabled:true}),{...actor,coach:true});
  await handleCustomExercises(request('PUT',{exercise}),actor);
  const prepare=db.prepare.bind(db);let intervened=false;
  db.prepare=sql=>{
   const statement=prepare(sql);
   if(sql!=='SELECT enabled FROM client_exercise_policy WHERE user_id=?')return statement;
   const wrap=stmt=>({...stmt,bind:(...args)=>wrap(stmt.bind(...args)),first:async(...args)=>{
    const before=await stmt.first(...args);
    if(!intervened){
     intervened=true;
     if(revoke==='policy')await prepare('UPDATE client_exercise_policy SET enabled=0 WHERE user_id=?').bind('a').run();
     else await prepare('DELETE FROM members WHERE user_id=?').bind('a').run();
    }
    return before;
   }});
   return wrap(statement);
  };
  const value={...exercise,id:operation==='create'?'custom_ex_new':exercise.id,name:'Must not be written'};
  const response=operation==='archive'
   ?await handleCustomExercises(request('DELETE'),{...actor,id:exercise.id})
   :await handleCustomExercises(request('PUT',{exercise:value}),actor);
  assert.equal(intervened,true,`${revoke}/${operation}: race executed`);
  assert.equal(response.status,operation==='archive'?409:403,`${revoke}/${operation}`);
  const rows=(await prepare('SELECT id,doc,archived FROM client_custom_exercises WHERE user_id=?').bind('a').all()).results;
  assert.equal(rows.length,1);assert.deepEqual(JSON.parse(rows[0].doc),exercise);assert.equal(rows[0].archived,0);
 }
});
