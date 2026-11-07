import {test} from 'node:test';import assert from 'node:assert/strict';
import {syncAllDay,mergeAllDaySync,googleAllDay} from '../src/shared/product/calendarAllDay.js';
const ev=(patch={})=>({id:'event1',etag:'v1',summary:'Retreat',start:{date:'2026-09-22'},end:{date:'2026-09-25'},...patch});
const opts={calendars:['cal'],defaultCalendar:'cal',from:'2026-09-22',to:'2026-10-01',makeId:s=>'stable-'+s};
test('imports multiday events once, retains exclusive end, ignores generated summaries',async()=>{
 const r=await syncAllDay({...opts,rows:[],request:async()=>({items:[ev(),ev({id:'generated',extendedProperties:{private:{tmApp:'1',tmKind:'trenink'}}})]})});
 assert.equal(r.rows.length,1);assert.equal(r.rows[0].end,'2026-09-25');assert.equal(r.rows[0].start,'2026-09-22');
});
test('failed reads preserve imported events and pending offline changes',async()=>{
 const rows=[{...googleAllDay(ev(),'cal'),rev:2,syncRev:1,title:'Offline edit'}];
 const r=await syncAllDay({...opts,rows,request:async()=>{throw Error('offline')}});assert.deepEqual(r.rows,rows);assert.equal(r.errors,1);
});

test('all-day query covers source-calendar timezones while keeping the requested nominal date window',async()=>{
 const calls=[];
 const r=await syncAllDay({...opts,rows:[],request:async(path)=>{calls.push(path);return {items:[
   ev({id:'before',start:{date:'2026-09-21'},end:{date:'2026-09-22'}}),
   ev({id:'first',start:{date:'2026-09-22'},end:{date:'2026-09-23'}}),
   ev({id:'last',start:{date:'2026-09-30'},end:{date:'2026-10-01'}}),
   ev({id:'after',start:{date:'2026-10-01'},end:{date:'2026-10-02'}}),
 ]};}});
 const query=new URL(calls[0],'https://calendar.test').searchParams;
 assert.equal(query.get('timeMin'),'2026-09-21T00:00:00.000Z');assert.equal(query.get('timeMax'),'2026-10-02T00:00:00.000Z');
 assert.deepEqual(r.rows.map(row=>row.gid),['first','last']);
});

test('an incomplete multi-page all-day read never applies a partial calendar or pending writes',async()=>{
 const rows=[{...googleAllDay(ev(),'cal'),rev:2,syncRev:1,title:'Keep local edit'}];let requests=0;
 const r=await syncAllDay({...opts,rows,request:async(path,options)=>{
   requests++;assert.equal(options,undefined);
   if(path.includes('pageToken'))throw Error('offline');return {items:[ev({summary:'Remote change'})],nextPageToken:'next /+'};
 }});
 assert.equal(requests,2);assert.equal(r.errors,1);assert.deepEqual(r.rows,rows);
});
test('local change patches the same event with an etag and no attendee/description replacement',async()=>{
 const calls=[],rows=[{...googleAllDay(ev(),'cal'),rev:2,syncRev:1,title:'New title'}];
 const r=await syncAllDay({...opts,rows,request:async(path,o)=>{calls.push([path,o]);return o?ev({etag:'v2'}):{items:[ev()]}}});
 assert.equal(calls[1][1].method,'PATCH');assert.equal(calls[1][1].headers['If-Match'],'v1');assert.equal(calls[1][1].body.summary,'New title');assert.equal(calls[1][1].body.attendees,undefined);assert.equal(r.rows[0].syncRev,2);
});
test('remote rename and move are imported without an echo write',async()=>{
 const rows=[{...googleAllDay(ev(),'cal'),rev:1,syncRev:1}];let writes=0;
 const r=await syncAllDay({...opts,rows,request:async(p,o)=>{if(o)writes++;return {items:[ev({summary:'Moved',start:{date:'2026-09-23'},etag:'v2'})]}}});
 assert.equal(writes,0);assert.equal(r.rows[0].title,'Moved');assert.equal(r.rows[0].start,'2026-09-23');
});
test('concurrent edits are retained as an explicit conflict, not overwritten',async()=>{
 const rows=[{...googleAllDay(ev(),'cal'),rev:2,syncRev:1,title:'Local'}];
 const r=await syncAllDay({...opts,rows,request:async(p,o)=>{assert.equal(o,undefined);return {items:[ev({summary:'Remote',etag:'v2'})]}}});
 assert.equal(r.rows[0].title,'Local');assert.equal(r.rows[0].conflict.title,'Remote');
});
test('remote deletion does not resurrect an event; local deletion cancels it',async()=>{
 const rows=[{...googleAllDay(ev(),'cal'),rev:2,syncRev:1}];
 const remote=await syncAllDay({...opts,rows,request:async()=>({items:[ev({status:'cancelled'})]})});assert.equal(remote.rows[0].deleted,true);
 const local=await syncAllDay({...opts,rows:rows.map(r=>({...r,deleted:true})),request:async(p,o)=>{if(o){assert.deepEqual(o.body,{status:'cancelled'});return ev({status:'cancelled'})}return {items:[ev()]}}});assert.equal(local.rows[0].syncRev,2);
});
test('pagination is complete and retry after a lost insert response cannot duplicate',async()=>{
 const row={id:'local',title:'Retreat',start:'2026-09-22',end:'2026-09-25',rev:1};
 const remote=ev({id:'stable-allDay|local',extendedProperties:{private:{tmApp:'1',tmKind:'allDay',tmLocal:'local'}}});
 const r=await syncAllDay({...opts,rows:[row],request:async(p,o)=>{if(o)throw Object.assign(Error('exists'),{status:409});if(p.includes('pageToken'))return {items:[remote]};if(p.includes('?'))return {items:[],nextPageToken:'two'};return remote;}});
 assert.equal(r.rows.length,1);assert.equal(r.rows[0].gid,remote.id);
});
test('an edit during a request survives the result and stays pending',()=>{
 const before=[{id:'a',title:'Old',rev:1}],current=[{id:'a',title:'New',rev:2}],after=[{id:'a',title:'Old',rev:1,syncRev:1,gid:'google',base:{title:'Old'}}];
 const r=mergeAllDaySync(current,before,after);assert.equal(r[0].title,'New');assert.equal(r[0].gid,'google');assert.notEqual(r[0].rev,r[0].syncRev);
});
