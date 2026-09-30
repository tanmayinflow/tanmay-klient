import test from 'node:test';
import assert from 'node:assert/strict';
import {emptyTogetherCalendar,cleanTogetherCalendar,planCalendarHash,calendarSyncDecision,planToGoogleEvent,googleEventToPlan,listGoogleChanges} from '../src/shared/product/togetherCalendarSync.js';
import {syncTogetherCalendar} from '../src/shared/product/togetherCalendarRun.js';

const plan={id:'00000000-0000-0000-0000-000000000001',revision:1,title:'Čaj',date:'2026-09-30',time:'18:00',minutes:30,note:'',status:'planned',approved:{owner:true,partner:true}};
const eventId=`tm${plan.id.replaceAll('-','')}`;
const event={...planToGoogleEvent(plan,'Europe/Prague','pair'),id:eventId,etag:'one'};
const mapping={planId:plan.id,planRevision:1,hash:planCalendarHash(plan),etag:'one'};
test('calendar persistence excludes tokens and private fields; time zones and nonexistent times are handled',()=>{
  const clean=cleanTogetherCalendar({...emptyTogetherCalendar(),access_token:'secret',cycle:{private:'yes'},events:{[eventId]:{...mapping,token:'secret'}}});
  assert.equal(JSON.stringify(clean).includes('secret'),false);assert.equal(clean.cycle,undefined);
  assert.equal(event.start.dateTime,'2026-09-30T16:00:00.000Z');
  assert.deepEqual(googleEventToPlan(event,'Europe/Prague'),{title:'Čaj',date:plan.date,time:plan.time,minutes:30,note:''});
  assert.throws(()=>planToGoogleEvent({...plan,date:'2026-03-29',time:'02:30'},'Europe/Prague','pair'),/nonexistent/);
  assert.equal(googleEventToPlan({...event,start:{date:'2026-09-30'}},'Europe/Prague'),null);
  assert.equal(googleEventToPlan({...event,recurringEventId:'recurrence'},'Europe/Prague'),null);
});
test('only agreed plans export, both-side edits conflict, remote deletion imports',()=>{
  assert.equal(calendarSyncDecision({...plan,approved:{owner:true}},null,null,'Europe/Prague'),'wait');
  assert.equal(calendarSyncDecision(plan,null,null,'Europe/Prague'),'create');
  assert.equal(calendarSyncDecision({...plan,revision:2,title:'New'},{...event,etag:'two',summary:'Other'},mapping,'Europe/Prague'),'conflict');
  assert.equal(calendarSyncDecision(plan,{id:eventId,etag:'two',status:'cancelled'},mapping,'Europe/Prague'),'import');
});
test('incremental pagination preserves cursor; expired cursor restarts without deleting mappings',async()=>{
  const calls=[];const request=async(_token,path)=>{calls.push(path);if(path.includes('syncToken=expired')){const error=new Error();error.status=410;throw error;}if(!path.includes('pageToken='))return {items:[{id:'a'}],nextPageToken:'page'};return {items:[{id:'b'}],nextSyncToken:'fresh'};};
  const result=await listGoogleChanges('token',{calendarId:'cal',syncToken:'expired'},request);
  assert.equal(result.reset,true);assert.deepEqual(result.items.map(item=>item.id),['a','b']);assert.equal(result.syncToken,'fresh');assert.equal(calls.length,3);
});
test('Google changes become a partner-confirmed proposal and stay imported on the next incremental run',async()=>{
  let saved={...plan};const checkpoints=[];let puts=0;
  const config={...emptyTogetherCalendar(),calendarId:'cal',linkId:'pair',events:{[eventId]:mapping}};
  const api=async(path,method,body)=>{if(!path)return {link:{id:'pair',status:'active'},plans:[saved]};assert.equal(path,'/plan');puts++;saved={...saved,...body,revision:saved.revision+1,approved:{owner:true,partner:false}};return {ok:true,id:saved.id};};
  const request=async(_token,path)=>{assert.ok(path.includes('/events?'));return {items:[{...event,etag:'two',summary:'Čaj v zahradě'}],nextSyncToken:'cursor'};};
  const result=await syncTogetherCalendar({token:'never-persist',config,api,checkpoint:async value=>checkpoints.push(structuredClone(value)),request});
  assert.equal(puts,1);assert.equal(saved.title,'Čaj v zahradě');assert.equal(saved.approved.partner,false);assert.equal(result.imported,1);
  assert.equal(JSON.stringify(checkpoints).includes('never-persist'),false);
  const second=await syncTogetherCalendar({token:'token',config:result.config,api,checkpoint:async()=>{},request:async()=>({items:[],nextSyncToken:'cursor2'})});
  assert.equal(second.exported,0);assert.equal(puts,1);
});
test('unresolved conflicts survive incremental cursor advancement and are re-read',async()=>{
  const changed={...plan,title:'Local',revision:2},remote={...event,summary:'Remote',etag:'two'};
  const config={...emptyTogetherCalendar(),calendarId:'cal',linkId:'pair',syncToken:'old',events:{[eventId]:mapping},conflicts:[{eventId,planId:plan.id,reason:'both-changed'}]};
  const result=await syncTogetherCalendar({token:'token',config,api:async()=>({link:{id:'pair',status:'active'},plans:[changed]}),checkpoint:async()=>{},request:async(_token,path)=>path.includes('/events?')?{items:[],nextSyncToken:'new'}:remote});
  assert.equal(result.conflicts,1);assert.equal(result.config.conflicts[0].eventId,eventId);assert.equal(result.config.events[eventId].etag,'one');
});
test('sync aborts on revoked or replaced pair before touching Google',async()=>{
  await assert.rejects(syncTogetherCalendar({token:'token',config:{...emptyTogetherCalendar(),linkId:'old'},api:async()=>({link:{id:'new',status:'active'}}),checkpoint:async()=>{},request:async()=>assert.fail('Google must not be called')}),/not-connected/);
});

test('agreed export uses a stable event ID and carries only selected shared plan fields',async()=>{
  const writes=[];
  const config={...emptyTogetherCalendar(),calendarId:'cal',linkId:'pair'};
  const state={link:{id:'pair',status:'active'},plans:[{...plan,cycle:'PRIVATE',journal:'PRIVATE'}]};
  const result=await syncTogetherCalendar({token:'token',config,api:async()=>state,checkpoint:async()=>{},request:async(_token,path,options)=>{if(!options)return {items:[],nextSyncToken:'cursor'};writes.push({path,...options});return {...options.body,etag:'saved'};}});
  assert.equal(writes.length,1);assert.equal(writes[0].method,'POST');assert.equal(writes[0].body.id,eventId);
  assert.equal(JSON.stringify(writes).includes('PRIVATE'),false);assert.equal(result.exported,1);
  assert.equal(result.config.events[eventId].planId,plan.id);
});

test('local cancellation removes only its mapped event with ETag protection',async()=>{
  const cancelled={...plan,status:'cancelled',revision:2},writes=[];
  const result=await syncTogetherCalendar({token:'token',config:{...emptyTogetherCalendar(),calendarId:'cal',linkId:'pair',events:{[eventId]:mapping}},api:async()=>({link:{id:'pair',status:'active'},plans:[cancelled]}),checkpoint:async()=>{},request:async(_token,path,options)=>{if(!options)return {items:[],nextSyncToken:'cursor'};writes.push({path,...options});return {};}});
  assert.equal(writes.length,1);assert.equal(writes[0].method,'DELETE');assert.equal(writes[0].etag,'one');assert.ok(writes[0].path.endsWith(eventId));assert.equal(result.config.events[eventId].deleted,true);
});

test('Google ETag race is retained as a conflict instead of retrying an overwrite',async()=>{
  let writes=0;
  const changed={...plan,title:'Changed here',revision:2};
  const result=await syncTogetherCalendar({token:'token',config:{...emptyTogetherCalendar(),calendarId:'cal',linkId:'pair',events:{[eventId]:mapping}},api:async()=>({link:{id:'pair',status:'active'},plans:[changed]}),checkpoint:async()=>{},request:async(_token,_path,options)=>{if(!options)return {items:[],nextSyncToken:'cursor'};writes++;const error=new Error('google-conflict');error.status=412;throw error;}});
  assert.equal(writes,1);assert.equal(result.conflicts,1);assert.equal(result.config.events[eventId].etag,'one');assert.equal(result.config.conflicts[0].title,'Changed here');
});
test('interrupted export recovery does not discard a later Google edit',async()=>{
  let writes=0;
  const remote={...event,summary:'Changed in Google',etag:'new'};
  const result=await syncTogetherCalendar({token:'token',config:{...emptyTogetherCalendar(),calendarId:'cal',linkId:'pair'},api:async()=>({link:{id:'pair',status:'active'},plans:[plan]}),checkpoint:async()=>{},request:async(_token,_path,options)=>{if(options)writes++;return {items:[remote],nextSyncToken:'cursor'};}});
  assert.equal(writes,0);assert.equal(result.conflicts,1);assert.equal(result.config.conflicts[0].googleTitle,'Changed in Google');
});
