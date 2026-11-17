import test from 'node:test';
import assert from 'node:assert/strict';
import {exerciseResponse} from '../src/shared/product/exerciseClientRequest.js';
import {readFileSync} from 'node:fs';
const client = JSON.parse(readFileSync(new URL('../package.json', import.meta.url))).name !== 'tanmay-web';
const createClientSession = client ? (await import('../src/clientSession.js')).createClientSession : null;

test('stale exercise UI cannot issue even a read request', async () => {
  let requests = 0;
  await assert.rejects(exerciseResponse(async () => { requests++; }, {current:()=>false}, '/api/custom-exercises'), /account-changed/);
  assert.equal(requests, 0);
});

test('account change during fetch discards response without reading or storing another account', async () => {
  let current=true, reads=0, writes=0;
  await assert.rejects(async () => {
    const result=await exerciseResponse(async () => {current=false;return {json:async()=>{reads++;return {exercises:[{id:'other'}]};}};}, {current:()=>current}, '/api/custom-exercises');
    if(result)writes++;
  }, /account-changed/);
  assert.equal(reads,0);assert.equal(writes,0);
});

test('account change during JSON decode also prevents local exercise writes', async () => {
  let current=true,writes=0;
  await assert.rejects(async () => {
    await exerciseResponse(async()=>({json:async()=>{current=false;return {ok:true};}}), {current:()=>current}, '/api/custom-exercises');
    writes++;
  }, /account-changed/);
  assert.equal(writes,0);
});

test('real client requester supplies owner and stops stale custom PUT on server account-switch 409', {skip:!client}, async () => {
  const owner='1111111111111111';
  let calls=0,writes=0,header;
  const session=createClientSession(async(url,init)=>{
    if(url==='/api/me')return Response.json({owner,member:true});
    calls++;header=new Headers(init.headers).get('X-Tanmay-Owner');
    return Response.json({ok:false,code:'account-changed'},{status:409});
  });
  session.initializeWith(async()=>{});await session.verify();
  const scope={current:()=>session.isCurrent(owner)};
  await assert.rejects(async()=>{
    await exerciseResponse((url,init)=>session.request(url,init),scope,'/api/custom-exercises',{method:'PUT',body:JSON.stringify({exercise:{id:'custom_ex_test',custom:true}})});
    writes++;
  }, error=>error.code==='changed'&&error.status===409);
  assert.equal(header,owner);assert.equal(calls,1);assert.equal(writes,0);
  assert.equal(session.getSnapshot().status,'changed');
  await assert.rejects(exerciseResponse((url,init)=>session.request(url,init),scope,'/api/custom-exercises'),/account-changed/);
  assert.equal(calls,1);
});

test('cookie identity changed before a custom request cannot send its old payload', {skip:!client}, async () => {
  let owner='1111111111111111',writes=0;
  const session=createClientSession(async url=>{
    if(url==='/api/me')return Response.json({owner,member:true});
    writes++;return Response.json({ok:true});
  });
  session.initializeWith(async()=>{});await session.verify();
  const original=session.getSnapshot().owner,scope={current:()=>session.isCurrent(original)};
  owner='2222222222222222';
  await assert.rejects(exerciseResponse((url,init)=>session.request(url,init),scope,'/api/custom-exercises',{method:'PUT'}),/changed/);
  assert.equal(writes,0);
});
