import test from 'node:test';
import assert from 'node:assert/strict';
import {createTogetherAccountRequest} from '../src/shared/product/togetherAccountClient.js';

const ok=data=>Response.json({ok:true,...data});
const deferred=()=>{let resolve;const promise=new Promise(r=>{resolve=r;});return {promise,resolve};};

test('Together reads and writes carry the workspace account key and prevent redirects',async()=>{
  const calls=[];
  const request=createTogetherAccountRequest({accountKey:'account-a',verified:key=>key==='account-a',refresh:async()=>{},fetcher:async(...args)=>{calls.push(args);return ok({saved:true});}});
  await request('/api/together');
  await request('/api/together/self',{method:'PUT',body:JSON.stringify({doc:{note:'mine'}}),headers:{'Content-Type':'application/json'}});
  for(const [,init] of calls){assert.equal(init.headers.get('X-Tanmay-Account-Key'),'account-a');assert.equal(init.redirect,'manual');assert.equal(init.cache,'no-store');}
  assert.match(calls[1][1].body,/mine/);
});

test('a draft cannot be sent under an account discovered during verification',async()=>{
  let active=null,calls=0;
  const request=createTogetherAccountRequest({accountKey:'account-a',verified:key=>key===active,refresh:async()=>{active='account-b';},fetcher:async()=>{calls++;return ok();}});
  await assert.rejects(request('/api/together/answer',{method:'PUT',body:'private-draft'}),/account-changed/);
  assert.equal(calls,0);
});

test('late response from the previous account never returns private content',async()=>{
  let active='account-a';const pending=deferred();
  const request=createTogetherAccountRequest({accountKey:'account-a',verified:key=>key===active,refresh:async()=>{},fetcher:()=>pending.promise});
  const result=request('/api/together');
  active='account-b';pending.resolve(ok({privateNote:'old account'}));
  await assert.rejects(result,/account-changed/);
});

test('account changes during response parsing cannot return old data or mark a save complete',async()=>{
  let active='account-a';const body=deferred();
  const request=createTogetherAccountRequest({accountKey:'account-a',verified:key=>key===active,refresh:async()=>{},fetcher:async()=>({ok:true,status:200,headers:new Headers({'Content-Type':'application/json'}),json:()=>body.promise})});
  const result=request('/api/together/self',{method:'PUT'});
  await Promise.resolve();active='account-b';body.resolve({ok:true});
  await assert.rejects(result,/account-changed/);
});

test('server-side cookie switch rejection is not retried under the new account',async()=>{
  let calls=0,refreshes=0;
  const request=createTogetherAccountRequest({accountKey:'account-a',verified:()=>true,refresh:async()=>{refreshes++;},fetcher:async()=>{calls++;return Response.json({ok:false,error:'account-changed'},{status:409});}});
  await assert.rejects(request('/api/together/invite',{method:'POST'}),/account-changed/);
  assert.equal(calls,1);assert.equal(refreshes,1);
});
