import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createPersonalCalendarConnection} from '../src/shared/product/personalCalendarConnection.js';
import {handlePersonalCalendar,PERSONAL_CALENDAR_SCOPES as S} from '../src/shared/product/personalCalendarServer.js';
import {makeD1} from './helpers/env.js';

const BASIC=[S.created,S.read].sort(),ORIGIN='https://app.example.test';
const clone=value=>JSON.parse(JSON.stringify(value));
const waitFor=async predicate=>{for(let i=0;i<80&&!predicate();i++)await new Promise(resolve=>setImmediate(resolve));assert.ok(predicate(),'operation did not reach its expected boundary');};
function fixture() {
  const state={owner:'account-a',canRequest:true,verified:true,time:1900000000000,gesture:false,loads:0,popups:[],calls:[],verifyCalls:[],failStatus:false,configured:true};
  const records=new Map(),nonces=new Map();let serial=0,hook=null;
  const record=owner=>{if(!records.has(owner))records.set(owner,{ok:true,configured:true,connected:false,scopes:[],generation:'initial-'+owner,accountKey:'key-'+owner,status:'DISCONNECTED'});return records.get(owner);};
  const library={initCodeClient(options){return {requestCode(){state.popups.push({options,gesture:state.gesture});}};}};
  const fetcher=async(path,init)=>{
    const action=path.split('/').at(-1),body=init.body?JSON.parse(init.body):null,owner=state.owner;
    state.calls.push({action,body,init,owner});
    if(hook){const result=hook(action,body,owner);if(result!==undefined)return result;}
    const current=record(owner);
    if(action==='status'){
      if(state.failStatus)throw new Error('offline');
      return Response.json({...clone(current),configured:state.configured});
    }
    assert.equal(init.headers['X-Tanmay-Account-Key'],current.accountKey);
    assert.equal(init.headers['X-Requested-With'],'XmlHttpRequest');assert.equal(init.headers['Content-Type'],'application/json');
    assert.equal(init.credentials,'same-origin');assert.equal(init.cache,'no-store');assert.equal(init.redirect,'error');
    if(action==='start'){
      const nonce='nonce-'+(++serial),scopes=[...body.scopes].sort();nonces.set(nonce,{owner,scopes});
      return Response.json({ok:true,nonce,clientId:'synthetic.apps.googleusercontent.com',scopes,expiresAt:state.time+600000});
    }
    if(action==='connect'){
      const nonce=nonces.get(body.nonce);assert.ok(nonce);assert.equal(nonce.owner,owner);nonces.delete(body.nonce);
      Object.assign(current,{connected:true,generation:'connected-'+(++serial),scopes:nonce.scopes,status:'CONNECTED'});return Response.json(clone(current));
    }
    if(action==='request'){
      assert.equal(body.generation,current.generation);return Response.json({items:[],id:'event1'});
    }
    if(action==='disconnect'){
      assert.deepEqual(body,{});Object.assign(current,{connected:false,generation:'disconnected-'+(++serial),scopes:[],status:'DISCONNECTED'});return Response.json(clone(current));
    }
    assert.fail('unexpected endpoint '+action);
  };
  const dependencies={getAccount:()=>state.owner,canRequest:()=>state.canRequest,verifyAccount:async owner=>{state.verifyCalls.push(owner);return state.verified;},fetcher,
    loadGoogle:async()=>{state.loads++;return library;},now:()=>state.time};
  const adapter=createPersonalCalendarConnection(dependencies);
  async function connected() {
    await adapter.prepare(BASIC,{authorize:true});state.gesture=true;const promise=adapter.connect(BASIC);state.gesture=false;
    state.popups.at(-1).options.callback({code:'synthetic-code',state:state.popups.at(-1).options.state});return promise;
  }
  return {adapter,state,record,connected,newAdapter:()=>createPersonalCalendarConnection(dependencies),hook:fn=>{hook=fn;}};
}

test('configuration is unknown until verified status; failure cannot become an implicit legacy fallback',async()=>{
  const f=fixture();assert.equal(f.adapter.configured(),null);f.state.failStatus=true;
  await assert.rejects(f.adapter.prepare(BASIC),/calendar-network-unavailable/);assert.equal(f.adapter.configured(),null);
  f.state.failStatus=false;await f.adapter.prepare(BASIC);assert.equal(f.adapter.configured(),true);
  f.state.failStatus=true;await assert.rejects(f.adapter.prepare(BASIC),/calendar-network-unavailable/);assert.equal(f.adapter.configured(),true);
  f.state.failStatus=false;f.state.configured=false;await f.adapter.prepare(BASIC,{authorize:true});assert.equal(f.adapter.configured(),false);
  assert.equal(f.state.loads,0);assert.equal(f.state.popups.length,0);
});

test('preparation loads nonce and GIS without a popup; explicit connect requests the code synchronously in the tap',async()=>{
  const f=fixture();await f.adapter.prepare(BASIC,{authorize:true});
  assert.equal(f.adapter.authorizationReady(BASIC),true);assert.equal(f.adapter.ready(BASIC),false);assert.equal(f.state.popups.length,0);
  const before=f.state.calls.length;f.state.gesture=true;const pending=f.adapter.connect(BASIC);f.state.gesture=false;
  assert.equal(f.state.popups.length,1);assert.equal(f.state.popups[0].gesture,true);assert.equal(f.state.calls.length,before);
  const options=f.state.popups[0].options;assert.equal(options.ux_mode,'popup');assert.equal(options.include_granted_scopes,false);assert.equal(options.scope,BASIC.join(' '));
  options.callback({code:'code',state:options.state});const value=await pending;
  assert.equal(value.connected,true);assert.equal(f.adapter.ready(BASIC),true);assert.equal(f.adapter.authorizationReady(BASIC),false);
  assert.doesNotMatch(JSON.stringify(value),/access_token|refresh_token|nonce/);
});

test('missing, mismatched or expired nonce fails before any popup or asynchronous preparation',async()=>{
  const f=fixture();await assert.rejects(f.adapter.connect(BASIC),/calendar-authorization-not-ready/);assert.equal(f.state.calls.length,0);
  await f.adapter.prepare(BASIC,{authorize:true});await assert.rejects(f.adapter.connect([...BASIC,S.write]),/calendar-authorization-not-ready/);
  const before=f.state.calls.length;f.state.time+=600001;
  await assert.rejects(f.adapter.connect(BASIC),/calendar-authorization-not-ready/);assert.equal(f.state.calls.length,before);assert.equal(f.state.popups.length,0);
});

test('two rapid taps share the same authorization, and a duplicate Google callback exchanges only once',async()=>{
  const f=fixture();await f.adapter.prepare(BASIC,{authorize:true});const a=f.adapter.connect(BASIC),b=f.adapter.connect(BASIC);
  assert.equal(a,b);assert.equal(f.state.popups.length,1);
  const options=f.state.popups[0].options;options.callback({code:'code'});options.callback({code:'code'});
  await a;assert.equal(f.state.calls.filter(call=>call.action==='connect').length,1);
});

test('reload restores a durable connection through status, without loading GIS or showing Google',async()=>{
  const f=fixture();await f.connected();const popups=f.state.popups.length,loads=f.state.loads;
  const restored=f.newAdapter();await restored.prepare(BASIC);assert.equal(restored.ready(BASIC),true);
  await restored.request('/calendars/primary/events');assert.equal(f.state.popups.length,popups);assert.equal(f.state.loads,loads);
  assert.equal(f.state.calls.at(-1).action,'request');assert.equal(f.state.calls.at(-1).init.headers.Authorization,undefined);
});

test('server proxy success needs no client refresh or retry, and retains exact event fields and conditional headers',async()=>{
  const f=fixture();await f.connected();const before=f.state.calls.length,popups=f.state.popups.length;
  const body={summary:'A real time',start:{dateTime:'2026-10-28T09:35:00+01:00'},end:{dateTime:'2026-10-28T10:20:00+01:00'}};
  await f.adapter.request('/calendars/primary/events/event1',{method:'PATCH',body,headers:{'If-Match':'"v2"'}});
  assert.equal(f.state.calls.length,before+1);assert.equal(f.state.popups.length,popups);assert.deepEqual(f.state.calls.at(-1).body.body,body);
  assert.equal(f.state.calls.at(-1).body.headers['If-Match'],'"v2"');
});

test('Google HTTP status, reason and body survive the adapter for reconciliation and retry decisions',async()=>{
  const f=fixture();await f.connected();
  for(const status of [404,410,412,429,500]){
    f.hook(action=>action==='request'?Response.json({error:{errors:[{reason:'syntheticReason'}]}},{status}):undefined);
    await assert.rejects(f.adapter.request('/calendars/my/events/event1'),error=>error.status===status&&error.reason==='syntheticReason'&&error.body.error.errors[0].reason==='syntheticReason');
  }
  assert.equal(f.adapter.ready(BASIC),true);assert.equal(f.state.popups.length,1);
});

test('revoked server authorization stops readiness and never opens Google automatically',async()=>{
  const f=fixture();await f.connected();const before=f.state.popups.length;
  f.hook(action=>action==='request'?Response.json({ok:false,error:'calendar-reconnect-required'},{status:401}):undefined);
  await assert.rejects(f.adapter.request('/calendars/primary/events'),error=>error.status===401&&error.code==='calendar-reconnect-required');
  assert.equal(f.adapter.ready(BASIC),false);assert.equal(f.adapter.status().status,'RECONNECT_REQUIRED');assert.equal(f.state.popups.length,before);
});

test('a changed account callback is rejected before sending its code to an app endpoint',async()=>{
  const f=fixture();await f.adapter.prepare(BASIC,{authorize:true});const pending=f.adapter.connect(BASIC);const rejection=assert.rejects(pending,/calendar-account-changed/);
  const before=f.state.calls.length;f.state.owner='account-b';f.state.popups[0].options.callback({code:'stale-code'});
  await rejection;assert.equal(f.state.calls.length,before);assert.equal(f.adapter.configured(),null);assert.equal(f.adapter.status().connected,false);
});

test('verification refusal after the Google popup leaves the code unexchanged',async()=>{
  const f=fixture();await f.adapter.prepare(BASIC,{authorize:true});const pending=f.adapter.connect(BASIC);f.state.verified=false;
  f.state.popups[0].options.callback({code:'code'});await assert.rejects(pending,/calendar-account-changed/);
  assert.equal(f.state.calls.filter(call=>call.action==='connect').length,0);
});

test('a mismatched returned state is rejected before any code exchange',async()=>{
  const f=fixture();await f.adapter.prepare(BASIC,{authorize:true});const pending=f.adapter.connect(BASIC);
  f.state.popups[0].options.callback({code:'code',state:'other-nonce'});await assert.rejects(pending,/calendar-invalid-response/);
  assert.equal(f.state.calls.filter(call=>call.action==='connect').length,0);
});

test('reset immediately cancels an unfinished popup and ignores its eventual callback',async()=>{
  const f=fixture();await f.adapter.prepare(BASIC,{authorize:true});const pending=f.adapter.connect(BASIC);const rejection=assert.rejects(pending,/calendar-account-changed/);
  f.adapter.reset();await rejection;const count=f.state.calls.length;f.state.popups[0].options.callback({code:'late'});
  await Promise.resolve();assert.equal(f.state.calls.length,count);assert.equal(f.adapter.configured(),null);
});

test('late status cannot overwrite a connection established while that status request was in flight',async()=>{
  const f=fixture();await f.adapter.prepare(BASIC,{authorize:true});const pending=f.adapter.connect(BASIC);let release;
  const old=clone(f.record(f.state.owner));f.hook(action=>action==='status'?new Promise(resolve=>{release=()=>resolve(Response.json(old));}):undefined);
  const refreshing=f.adapter.prepare(BASIC);await waitFor(()=>release);
  f.state.popups[0].options.callback({code:'code'});await pending;release();await refreshing;
  assert.equal(f.adapter.ready(BASIC),true);assert.match(f.adapter.status().generation,/connected-/);
});

test('disconnect invalidates a pending callback and clears the durable connection using account identity',async()=>{
  const f=fixture();await f.connected();await f.adapter.prepare([...BASIC,S.write],{authorize:true});const pending=f.adapter.connect([...BASIC,S.write]);
  const rejection=assert.rejects(pending,/calendar-account-changed/);await f.adapter.disconnect();await rejection;
  f.state.popups.at(-1).options.callback({code:'late'});await Promise.resolve();assert.equal(f.adapter.ready(BASIC),false);assert.equal(f.record(f.state.owner).connected,false);
  assert.deepEqual(f.state.calls.findLast(call=>call.action==='disconnect').body,{});
});

test('late proxy response after reset cannot be applied to the next account',async()=>{
  const f=fixture();await f.connected();let release;
  f.hook(action=>action==='request'?new Promise(resolve=>{release=()=>resolve(Response.json({items:[{summary:'old account'}]}));}):undefined);
  const pending=f.adapter.request('/calendars/primary/events');await waitFor(()=>release);
  f.state.owner='account-b';f.adapter.reset();release();await assert.rejects(pending,/calendar-account-changed/);assert.equal(f.adapter.status().connected,false);
});

test('adapter and real Worker authorization survive reload and expired access without any further popup',async()=>{
  const db=makeD1(),env={GOOGLE_CALENDAR_CLIENT_ID:'synthetic.apps.googleusercontent.com',GOOGLE_CALENDAR_CLIENT_SECRET:'synthetic-secret',GOOGLE_CALENDAR_TOKEN_ENCRYPTION_KEY:Buffer.alloc(32,9).toString('base64')};
  let time=1900000000000,popup,requests=0,refreshes=0,popups=0;
  const upstream=async(url,init)=>{
    if(url==='https://oauth2.googleapis.com/token'){
      const grant=new URLSearchParams(init.body);if(grant.get('grant_type')==='refresh_token'){refreshes++;assert.equal(grant.get('refresh_token'),'synthetic-refresh');}
      return Response.json({access_token:'synthetic-access',refresh_token:grant.has('code')?'synthetic-refresh':undefined,expires_in:3600,scope:BASIC.join(' ')});
    }
    requests++;return Response.json({items:[{id:'event1',summary:'A timed event',start:{dateTime:'2026-10-28T09:35:00+01:00'}}]});
  };
  const dependencies={getAccount:()=> 'main',verifyAccount:()=>true,now:()=>time,loadGoogle:async()=>({initCodeClient:options=>({requestCode(){popup=options;popups++;}})}),
    fetcher:async(path,init)=>handlePersonalCalendar(new Request(ORIGIN+path,{...init,headers:{...init.headers,Origin:ORIGIN}}),db,'coach:tanmay',env,{now:()=>time,fetchImpl:upstream})};
  const first=createPersonalCalendarConnection(dependencies);await first.prepare(BASIC,{authorize:true});const connecting=first.connect(BASIC);popup.callback({code:'code',state:popup.state});await connecting;
  const reloaded=createPersonalCalendarConnection(dependencies);await reloaded.prepare(BASIC);time+=3600000;
  const events=await reloaded.request('/calendars/primary/events');assert.equal(events.items[0].start.dateTime,'2026-10-28T09:35:00+01:00');
  assert.equal(popups,1);assert.equal(refreshes,1);assert.equal(requests,1);assert.equal(reloaded.ready(BASIC),true);
});
