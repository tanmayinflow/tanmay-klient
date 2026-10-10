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
