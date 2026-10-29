import {test} from 'node:test';
import assert from 'node:assert/strict';
import {handlePersonalCalendar,PERSONAL_CALENDAR_SCOPES as S} from '../src/shared/product/personalCalendarServer.js';
import {createPersonalCalendarConnection} from '../src/shared/product/personalCalendarConnection.js';
import {personalProfileAccountKey} from '../src/shared/product/personalProfile.js';
import {makeD1} from './helpers/env.js';

const ORIGIN='https://app.example.test',SCOPES=[S.created,S.read].sort();
async function fixture(){
  const db=makeD1(),env={GOOGLE_CALENDAR_CLIENT_ID:'test.apps.googleusercontent.com',GOOGLE_CALENDAR_CLIENT_SECRET:'test-secret',GOOGLE_CALENDAR_TOKEN_ENCRYPTION_KEY:Buffer.alloc(32,8).toString('base64')};
  let owner='client:a',time=1900000000000,gesture=false,deny=false;
  const exchanges=[],navigations=[];
  const options={now:()=>time,fetchImpl:async(url,init)=>{
    assert.equal(url,'https://oauth2.googleapis.com/token');exchanges.push(new URLSearchParams(init.body));
    if(deny)return Response.json({error:deny,error_description:'private provider detail'},{status:400});
    return Response.json({access_token:'synthetic-access',refresh_token:'synthetic-refresh',expires_in:3600,scope:SCOPES.join(' ')});
  }};
  const request=async(action,body,actor=owner,origin=ORIGIN)=>handlePersonalCalendar(new Request(origin+'/api/calendar/'+action,body===undefined?{}:{method:'POST',headers:{Origin:origin,'Content-Type':'application/json','X-Requested-With':'XmlHttpRequest','X-Tanmay-Account-Key':await personalProfileAccountKey(actor)},body:JSON.stringify(body)}),db,actor,env,options);
  const adapter=createPersonalCalendarConnection({getAccount:()=>owner,now:()=>time,useRedirect:()=>true,
    navigate:url=>navigations.push({url,gesture}),loadGoogle:()=>assert.fail('Redirect must not load the popup library'),
    fetcher:async(path,init)=>request(path.split('/').at(-1),init.body?JSON.parse(init.body):undefined)});
  return {adapter,request,exchanges,navigations,setOwner:value=>{owner=value;},advance:ms=>{time+=ms;},gesture:value=>{gesture=value;},deny:(value='invalid_client')=>{deny=value;}};
}
const callback=(nonce,code='synthetic-code')=>'callback?'+new URLSearchParams({state:nonce,code});

test('prepared browser connection navigates to Google in the tap without loading GIS or opening a popup',async()=>{
  const f=await fixture();await f.adapter.prepare(SCOPES,{authorize:true});
  assert.equal(f.navigations.length,0);assert.equal(f.adapter.authorizationReady(SCOPES),true);
  f.gesture(true);const pending=f.adapter.connect(SCOPES);f.gesture(false);
  assert.equal(f.navigations.length,1);assert.equal(f.navigations[0].gesture,true);
  const url=new URL(f.navigations[0].url);
  assert.equal(url.origin,'https://accounts.google.com');assert.equal(url.pathname,'/o/oauth2/v2/auth');
  assert.equal(url.searchParams.get('redirect_uri'),ORIGIN+'/api/calendar/callback');
  assert.equal(url.searchParams.get('access_type'),'offline');assert.equal(url.searchParams.get('prompt'),'consent');
  assert.equal(url.searchParams.get('scope'),SCOPES.join(' '));
  const rejection=assert.rejects(pending,/calendar-account-changed/);f.adapter.reset();await rejection;
});

test('callback exchanges once using its exact registered redirect and restores on a fresh app load',async()=>{
  const f=await fixture(),start=await (await f.request('start',{scopes:SCOPES,mode:'redirect'})).json();
  const response=await f.request(callback(start.nonce));
  assert.equal(response.status,303);assert.equal(response.headers.get('Location'),ORIGIN+'/?calendar=connected');
  assert.equal(response.headers.get('Referrer-Policy'),'no-referrer');assert.match(response.headers.get('Cache-Control'),/no-store/);
  assert.equal(f.exchanges[0].get('redirect_uri'),ORIGIN+'/api/calendar/callback');
  assert.equal((await f.request(callback(start.nonce))).headers.get('Location'),ORIGIN+'/?calendar=failed&calendarReason=expired');
  assert.equal(f.exchanges.length,1);
  await f.adapter.prepare(SCOPES);assert.equal(f.adapter.ready(SCOPES),true);assert.equal(f.navigations.length,0);
});

test('redirect state remains bound to the authenticated app account and origin',async()=>{
  const f=await fixture(),start=await (await f.request('start',{mode:'redirect'})).json();
  for(const [owner,origin] of [['client:b',ORIGIN],['client:a','https://other.example.test']]){
    const response=await f.request(callback(start.nonce),undefined,owner,origin);
    assert.equal(response.headers.get('Location'),origin+'/?calendar=failed&calendarReason=expired');
  }
  assert.equal(f.exchanges.length,0);
  assert.equal((await f.request(callback(start.nonce))).headers.get('Location'),ORIGIN+'/?calendar=connected');
});

test('popup nonces, expired states, disconnected states and unauthenticated callbacks cannot establish redirect grants',async()=>{
  const f=await fixture(),popup=await (await f.request('start',{})).json();
  assert.equal((await f.request(callback(popup.nonce))).headers.get('Location'),ORIGIN+'/?calendar=failed&calendarReason=expired');
  const expired=await (await f.request('start',{mode:'redirect'})).json();f.advance(600001);
  assert.equal((await f.request(callback(expired.nonce))).headers.get('Location'),ORIGIN+'/?calendar=failed&calendarReason=expired');
  const disconnected=await (await f.request('start',{mode:'redirect'})).json();await f.request('disconnect',{});
  assert.equal((await f.request(callback(disconnected.nonce))).headers.get('Location'),ORIGIN+'/?calendar=failed&calendarReason=expired');
  assert.equal((await f.request(callback(disconnected.nonce),undefined,'')).status,401);
  assert.equal(f.exchanges.length,0);
});

test('denial and token exchange errors return only a safe failure marker, with no credentials or provider text',async()=>{
  const f=await fixture(),start=await (await f.request('start',{mode:'redirect'})).json();
  const denial=await f.request('callback?'+new URLSearchParams({state:start.nonce,error:'access_denied',error_description:'untrusted private detail'}));
  assert.equal(denial.headers.get('Location'),ORIGIN+'/?calendar=failed&calendarReason=denied');assert.equal(await denial.text(),'');assert.equal(f.exchanges.length,0);
  f.deny();const response=await f.request(callback(start.nonce));
  assert.equal(response.headers.get('Location'),ORIGIN+'/?calendar=failed&calendarReason=configuration');assert.equal(await response.text(),'');
  assert.equal(f.adapter.ready(SCOPES),false);
});

test('expired preparation recovers with a fresh state and still waits for an explicit tap',async()=>{
  const f=await fixture();await f.adapter.prepare(SCOPES,{authorize:true});f.advance(600001);
  await assert.rejects(f.adapter.connect(SCOPES),/calendar-authorization-not-ready/);
  await f.adapter.prepare(SCOPES,{authorize:true});assert.equal(f.navigations.length,0);
  f.gesture(true);const pending=f.adapter.connect(SCOPES);f.gesture(false);
  assert.equal(f.navigations.length,1);const rejection=assert.rejects(pending,/calendar-account-changed/);f.adapter.reset();await rejection;
});

test('callback diagnostics never reflect unknown provider errors or callback parameters',async()=>{
  const f=await fixture(),start=await (await f.request('start',{mode:'redirect'})).json();
  f.deny('untrusted-private-error&access_token=secret');
  const response=await f.request(callback(start.nonce,'private-code'));
  assert.equal(response.headers.get('Location'),ORIGIN+'/?calendar=failed&calendarReason=provider-unavailable');
  assert.equal(await response.text(),'');
  assert.equal((await (await f.request('status')).json()).connected,false);
});
