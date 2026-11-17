import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import worker from '../worker/index.js';
import {makeD1,makeEnv,req} from './helpers/env.js';
import {ensureClientIdentities,clientIdentityConflict,registerClientIdentity} from '../src/shared/product/clientIdentityServer.js';
import {removeClientCalendarMembership} from '../src/shared/product/personalCalendarServer.js';
import {handleExercisePolicy} from '../src/shared/product/exercisePolicyServer.js';

const main=JSON.parse(readFileSync(new URL('../package.json',import.meta.url))).name==='tanmay-web';
const first='a.b@example.test',collision='a+b@example.test',uid='a-b-example-test';
const join=(env,email)=>worker.fetch(req('/api/join',{email,method:'POST',body:{word:'enter'}}),env,{});
async function legacyDB(){
  const db=makeD1();
  await db.prepare('CREATE TABLE members(user_id TEXT PRIMARY KEY,email TEXT NOT NULL,joined_at INTEGER,name TEXT)').run();
  return db;
}

test('legacy member binding survives removal and older-worker delete/insert paths',async()=>{
  const db=await legacyDB();
  await db.prepare('INSERT INTO members(user_id,email,joined_at) VALUES(?,?,1)').bind(uid,'  A.B@EXAMPLE.TEST  ').run();
  await ensureClientIdentities(db);
  assert.equal(await clientIdentityConflict(db,uid,first),false);
  await removeClientCalendarMembership(db,uid);
  assert.equal(await clientIdentityConflict(db,uid,collision),true);
  assert.equal(await registerClientIdentity(db,uid,collision),false);
  assert.equal(await db.prepare('SELECT * FROM members WHERE user_id=?').bind(uid).first(),null);
  await assert.rejects(db.prepare('INSERT INTO members(user_id,email,joined_at) VALUES(?,?,1)').bind(uid,collision).run(),/client_identity_conflict/);
  assert.equal(await registerClientIdentity(db,uid,first),true);
  await db.prepare('DELETE FROM members WHERE user_id=?').bind(uid).run();
  assert.equal(await clientIdentityConflict(db,uid,collision),true);
  assert.equal(await registerClientIdentity(db,uid,first),true);
  await assert.rejects(db.prepare('UPDATE members SET email=? WHERE user_id=?').bind(collision,uid).run(),/client_identity_conflict/);
  await db.prepare("UPDATE members SET name='A safe display-name edit' WHERE user_id=?").bind(uid).run();
  assert.equal((await db.prepare('SELECT email FROM members WHERE user_id=?').bind(uid).first()).email,first);
});

test('legacy first joins fail closed without a verified binding, including after orphan rejection',async()=>{
  for(const orphan of [false,true]){
    const db=await legacyDB();
    if(orphan){
      await db.prepare('CREATE TABLE state(user_id TEXT PRIMARY KEY,doc TEXT)').run();
      await db.prepare('INSERT INTO state VALUES(?,?)').bind(uid,'HISTORICAL PRIVATE').run();
    }
    await ensureClientIdentities(db);
    const legacy=()=>db.prepare('INSERT INTO members(user_id,email,joined_at) VALUES(?,?,1) ON CONFLICT(user_id) DO NOTHING').bind(uid,collision).run();
    await assert.rejects(legacy(),/client_identity_conflict/);
    assert.equal(await registerClientIdentity(db,uid,collision),!orphan);
    if(orphan){
      await assert.rejects(legacy(),/client_identity_conflict/);
      assert.equal(await registerClientIdentity(db,uid,collision),false);
      assert.equal(await db.prepare('SELECT email FROM client_identity_bindings WHERE user_id=?').bind(uid).first(),null);
    }
  }
});

test('real coach removal preserves address binding and retained private data',{skip:!main},async()=>{
  const db=await legacyDB(),owner='coach@example.test';
  await db.prepare('INSERT INTO members(user_id,email,joined_at) VALUES(?,?,1)').bind(uid,first).run();
  await db.prepare('CREATE TABLE state(user_id TEXT PRIMARY KEY,doc TEXT)').run();
  await db.prepare('INSERT INTO state VALUES(?,?)').bind(uid,'PRIVATE ORIGINAL').run();
  const env=makeEnv({KLIENT_DB:db,OWNER_EMAIL:owner});
  const response=await worker.fetch(req(`/api/klienti/${uid}`,{email:owner,method:'DELETE'}),env,{});
  assert.equal(response.status,200,await response.text());
  assert.equal(await db.prepare('SELECT * FROM members WHERE user_id=?').bind(uid).first(),null);
  assert.equal((await db.prepare('SELECT email FROM client_identity_bindings WHERE user_id=?').bind(uid).first()).email,first);
  assert.equal((await db.prepare('SELECT doc FROM state WHERE user_id=?').bind(uid).first()).doc,'PRIVATE ORIGINAL');
  assert.equal(await registerClientIdentity(db,uid,collision),false);
  assert.equal(await registerClientIdentity(db,uid,first),true);
});

test('real client cannot inherit removed-account state, exercises, files or backup; original email can rejoin',{skip:main},async()=>{
  const env=makeEnv({INVITE_WORD:'enter'});
  assert.equal((await join(env,first)).status,200);
  const doc={coll:{journal:[{id:'private-note',text:'ORIGINAL PRIVATE JOURNAL'}]},edits:{}};
  assert.equal((await worker.fetch(req('/api/state',{email:first,method:'PUT',body:{doc}}),env,{})).status,200);
  const exercise={id:'custom_ex_secret',custom:true,name:'ORIGINAL PRIVATE EXERCISE',metric:'reps',att:[]};
  assert.equal((await worker.fetch(req('/api/custom-exercises',{email:first,method:'PUT',body:{exercise}}),env,{})).status,200);
  await env.FILES.put(`files/${uid}/original-file`,'ORIGINAL PRIVATE FILE');
  await handleExercisePolicy(new Request('https://local.test/api/policy',{method:'PUT',body:JSON.stringify({enabled:false})}),{db:env.DB,userId:uid,coach:true});
  await removeClientCalendarMembership(env.DB,uid);
  for(const path of ['/api/me','/api/state','/api/custom-exercises','/api/exercise-policy','/api/files/original-file','/api/backup']){
    const denied=await worker.fetch(req(path,{email:collision}),env,{});
    assert.equal(denied.status,409,path);assert.doesNotMatch(await denied.text(),/ORIGINAL PRIVATE/);
  }
  assert.equal((await join(env,collision)).status,409);
  assert.equal((await(await worker.fetch(req('/api/me',{email:first}),env,{})).json()).member,false);
  assert.equal((await worker.fetch(req('/api/backup',{email:first}),env,{})).status,403);
  assert.equal((await join(env,' A.B@EXAMPLE.TEST ')).status,200);
  assert.deepEqual((await(await worker.fetch(req('/api/state',{email:first}),env,{})).json()).doc,doc);
  assert.deepEqual((await(await worker.fetch(req('/api/custom-exercises',{email:first}),env,{})).json()).exercises,[exercise]);
  assert.equal((await(await worker.fetch(req('/api/exercise-policy',{email:first}),env,{})).json()).enabled,false);
  assert.equal(await new Response((await env.FILES.get(`files/${uid}/original-file`)).body).text(),'ORIGINAL PRIVATE FILE');
  assert.equal((await join(env,'unrelated@example.test')).status,200);
  const backup=await worker.fetch(req('/api/backup',{email:first}),env,{});
  assert.equal(backup.status,200);const result=await backup.json();
  assert.match(JSON.stringify(result),/ORIGINAL PRIVATE EXERCISE/);
  assert.doesNotMatch(JSON.stringify(result),/unrelated@example.test|client_identity_bindings/);
  assert.equal((await worker.fetch(req('/api/backup',{email:collision}),env,{})).status,409);
});

test('two real simultaneous first joins with colliding slugs bind only the winning address',{skip:main},async()=>{
  const env=makeEnv({INVITE_WORD:'enter'});
  const responses=await Promise.all([join(env,first),join(env,collision)]);
  assert.deepEqual(responses.map(response=>response.status).sort(),[200,409]);
  const winner=[first,collision][responses.findIndex(response=>response.status===200)];
  const rows=(await env.DB.prepare('SELECT email FROM members').all()).results;
  assert.deepEqual(rows.map(row=>row.email),[winner]);
  assert.equal((await env.DB.prepare('SELECT email FROM client_identity_bindings WHERE user_id=?').bind(uid).first()).email,winner);
});

test('historical orphaned private data cannot be adopted by guessing its legacy slug',{skip:main},async()=>{
  for(const source of ['state','state_documents','client_custom_exercises','personal_profiles','together_links','files']){
    const env=makeEnv({INVITE_WORD:'enter'});
    await worker.fetch(req('/api/me',{email:first}),env,{});
    if(source==='state')await env.DB.prepare('INSERT INTO state(user_id,doc,updated_at) VALUES(?,?,1)').bind(uid,'PRIVATE HISTORICAL').run();
    else if(source==='files')await env.FILES.put(`files/${uid}/historical-file`,'PRIVATE HISTORICAL');
    else if(source==='personal_profiles'){
      await env.DB.prepare('CREATE TABLE personal_profiles(actor TEXT,doc TEXT)').run();
      await env.DB.prepare('INSERT INTO personal_profiles VALUES(?,?)').bind(`client:${uid}`,'PRIVATE HISTORICAL').run();
    }else if(source==='together_links'){
      await env.DB.prepare('CREATE TABLE together_links(owner TEXT,partner TEXT)').run();
      await env.DB.prepare('INSERT INTO together_links VALUES(?,?)').bind('coach:tanmay',`client:${uid}`).run();
    }else{
      await env.DB.prepare(`CREATE TABLE ${source}(user_id TEXT,doc TEXT)`).run();
      await env.DB.prepare(`INSERT INTO ${source} VALUES(?,?)`).bind(uid,'PRIVATE HISTORICAL').run();
    }
    for(const email of [first,collision])assert.equal((await join(env,email)).status,409,source);
    // A still-running older Worker cannot bypass the new orphan guard, even
    // when only R2 contains private data and SQLite cannot inspect that bucket.
    await assert.rejects(env.DB.prepare('INSERT INTO members(user_id,email,joined_at) VALUES(?,?,1) ON CONFLICT(user_id) DO NOTHING').bind(uid,collision).run(),/client_identity_conflict/);
    assert.equal((await join(env,collision)).status,409,source);
    assert.equal((await worker.fetch(req('/api/backup',{email:collision}),env,{})).status,403,source);
    assert.equal(await env.DB.prepare('SELECT email FROM client_identity_bindings WHERE user_id=?').bind(uid).first(),null,source);
    assert.equal(await env.DB.prepare('SELECT email FROM members WHERE user_id=?').bind(uid).first(),null,source);
  }
});

test('a request checked before a competing first join still cannot pass membership for another email',{skip:main},async()=>{
  for(const path of ['/api/state','/api/custom-exercises','/api/backup','/api/me']){
    const env=makeEnv({INVITE_WORD:'enter'});
    await worker.fetch(req('/api/me',{email:collision}),env,{});
    const prepare=env.DB.prepare.bind(env.DB);let intervened=false;
    env.DB.prepare=sql=>{
      const statement=prepare(sql);
      if(!sql.startsWith('SELECT email FROM client_identity_bindings'))return statement;
      const wrap=stmt=>({...stmt,bind:(...args)=>wrap(stmt.bind(...args)),all:async()=>{
        const before=await stmt.all();
        if(!intervened){intervened=true;assert.equal((await join(env,first)).status,200);}
        return before;
      }});
      return wrap(statement);
    };
    const response=await worker.fetch(req(path,{email:collision}),env,{});
    assert.equal(intervened,true,path);
    if(path==='/api/me'){assert.equal(response.status,200);assert.equal((await response.json()).member,false);}
    else assert.equal(response.status,403,path);
  }
});
