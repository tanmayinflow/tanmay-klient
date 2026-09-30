import test from 'node:test';
import assert from 'node:assert/strict';
import {createPersonalProfileClient} from '../src/shared/product/personalProfileClient.js';

const payload=(accountKey='account-a',revision=0)=>({ok:true,accountKey,revision,profile:{name:'Draft owner',wording:'neutral',ownCycle:false}});
function fixture(){
  const pending=[];
  const client=createPersonalProfileClient((url,options)=>new Promise((resolve,reject)=>pending.push({url,options,resolve,reject})));
  const respond=(data=payload(),status=200)=>pending.shift().resolve({ok:status<400,json:async()=>data});
  return {client,pending,respond};
}
test('same-account focus verification preserves the mounted identity and blocks all writes until ready',async()=>{
  const {client,pending,respond}=fixture();
  const first=client.refresh();respond();await first;
  assert.equal(client.verified('account-a'),true);
  const priorProfile=client.getSnapshot().profile;
  const check=client.verify();
  assert.equal(client.getSnapshot().accountKey,'account-a');
  assert.equal(client.getSnapshot().profile,priorProfile);
  assert.equal(client.getSnapshot().status,'checking');
  assert.equal(client.verified('account-a'),false);
  assert.equal(client.verify(),check,'focus and visibility share the outstanding verification');
  await assert.rejects(client.update({name:'wrong moment'}),/unauthorized/);
  assert.equal(pending.length,1,'no PUT was sent while checking');
  respond();await check;
  assert.equal(client.getSnapshot().accountKey,'account-a');
  assert.equal(client.verified('account-a'),true);
});
test('changed or unauthorized identity never keeps the previous writable account',async()=>{
  const {client,respond}=fixture();
  let task=client.refresh();respond();await task;
  task=client.verify();respond(payload('account-b'));await task;
  assert.equal(client.getSnapshot().accountKey,'account-b');
  assert.equal(client.verified('account-a'),false);
  await assert.rejects(client.update({name:'stale draft'},{accountKey:'account-a'}),/unauthorized/);
  task=client.verify();respond({ok:false,error:'unauthorized'},401);await task;
  assert.equal(client.getSnapshot().accountKey,null);
  assert.equal(client.verified('account-b'),false);
});
test('network failure preserves drafts in memory but locks them until a successful retry',async()=>{
  const {client,pending,respond}=fixture();
  let task=client.refresh();respond();await task;
  task=client.verify();pending.shift().reject(new Error('offline'));await task;
  assert.equal(client.getSnapshot().accountKey,'account-a');
  assert.equal(client.getSnapshot().status,'error');
  assert.equal(client.verified('account-a'),false);
  task=client.refresh();respond();await task;
  assert.equal(client.verified('account-a'),true);
});
test('logout and explicit account switch discard late verification responses',async()=>{
  const {client,pending,respond}=fixture();
  const old=client.refresh(),oldRequest=pending.shift();
  client.invalidate();const current=client.refresh();respond(payload('account-b'));await current;
  oldRequest.resolve({ok:true,json:async()=>payload('account-a')});await old;
  assert.equal(client.getSnapshot().accountKey,'account-b');
  client.invalidate();assert.equal(client.getSnapshot().accountKey,null);
  assert.equal(client.verified('account-b'),false);
});
test('late profile saves cannot revive an invalidated identity',async()=>{
  const {client,pending,respond}=fixture();
  let task=client.refresh();respond();await task;
  const save=client.update({name:'New name'},{accountKey:'account-a'}),savedRequest=pending.shift();
  assert.equal(JSON.parse(savedRequest.options.body).accountKey,'account-a');
  client.invalidate();task=client.refresh();respond(payload('account-b'));await task;
  savedRequest.resolve({ok:true,json:async()=>payload('account-a',1)});
  await assert.rejects(save,/account-changed/);
  assert.equal(client.getSnapshot().accountKey,'account-b');
});
