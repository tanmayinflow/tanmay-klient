process.env.TZ = 'UTC';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {calendarEventInWindow,eventFields,listCalendarEvents,reconcileSchedule} from '../src/shared/product/calendarSchedule.js';
const key='rz|2026-09-23|9:00', path='/calendars/app/events';
const bodyFor = row => ({summary:row.title,start:{dateTime:row.date+'T'+row.time.padStart(5,'0')+':00Z'},end:{dateTime:new Date(Date.parse(row.date+'T'+row.time.padStart(5,'0')+':00Z')+row.mins*60000).toISOString()}});
const hash = body => JSON.stringify(eventFields(body));
function setup() {
  let days={'2026-09-23':{sched:{'9:00':{text:'Practice',span:1}}}};
  const initial={key,date:'2026-09-23',time:'9:00',mins:60,title:'Practice'};
  const original={id:'stable',etag:'v1',...bodyFor(initial)};
  const shadow={[key]:{gid:'stable',h:hash(original),base:eventFields(original)}};
  const tomb={};
  const options={shadow,tomb,path,bodyFor,hash,request:async()=>original,
    getDay:date=>days[date]||{},updateDays:fn=>{const next=fn(days);const changed=next!==days;days=next;return changed;},
    desired:()=>Object.entries(days).flatMap(([date,d])=>Object.entries(d.sched||{}).filter(([,r])=>r.text).map(([hour,r])=>({key:'rz|'+date+'|'+hour,date,time:r.calTime||hour,mins:r.calMinutes||r.span*60,title:r.text}))),
    slot:time=>({date:time.slice(0,10),hour:Number(time.slice(11,13))+':00'})};
  return {options,original,days:()=>days,change:fn=>{days=fn(days);}};
}
test('Google rename returns to the original schedule row without an echo write',async()=>{
  const f=setup();await reconcileSchedule({...f.options,events:[{...f.original,summary:'Changed',etag:'v2'}]});
  assert.equal(f.days()['2026-09-23'].sched['9:00'].text,'Changed');
  assert.equal(f.options.shadow[key].gid,'stable');
});
test('Google move preserves the event identity and clears only its former slot',async()=>{
  const f=setup();const changed={...f.original,...bodyFor({date:'2026-09-24',time:'11:00',mins:90,title:'Moved'})};
  await reconcileSchedule({...f.options,events:[changed]});
  assert.equal(f.days()['2026-09-23'].sched['9:00'].text,'');
  assert.equal(f.days()['2026-09-24'].sched['11:00'].text,'Moved');
  assert.equal(f.days()['2026-09-24'].sched['11:00'].calMinutes,90);
  assert.equal(f.options.shadow['rz|2026-09-24|11:00'].gid,'stable');
});
test('simultaneous edits do not overwrite either version',async()=>{
  const f=setup();f.change(d=>({...d,'2026-09-23':{sched:{'9:00':{text:'Local',span:1}}}}));
  const result=await reconcileSchedule({...f.options,events:[{...f.original,summary:'Remote'}]});
  assert.deepEqual(result.conflicts,[key]);assert.equal(f.days()['2026-09-23'].sched['9:00'].text,'Local');
});
test('a move into an occupied slot retains both original blocks',async()=>{
  const f=setup();f.change(d=>({...d,'2026-09-24':{sched:{'11:00':{text:'Do not overwrite'}}}}));
  const result=await reconcileSchedule({...f.options,events:[{...f.original,...bodyFor({date:'2026-09-24',time:'11:00',mins:60,title:'Moved'})}]});
  assert.equal(result.conflicts.length,1);assert.equal(f.days()['2026-09-23'].sched['9:00'].text,'Practice');assert.equal(f.days()['2026-09-24'].sched['11:00'].text,'Do not overwrite');
});
test('remote deletion clears the untouched local block and cannot resurrect it',async()=>{
  const f=setup();await reconcileSchedule({...f.options,events:[{id:'stable',status:'cancelled'}]});
  assert.equal(f.days()['2026-09-23'].sched['9:00'].text,'');assert.ok(f.options.tomb[key]);assert.equal(f.options.shadow[key],undefined);
});
test('failed lookup is not treated as a deletion',async()=>{
  const f=setup();await assert.rejects(reconcileSchedule({...f.options,events:[],request:async()=>{throw Error('offline')}}));
  assert.equal(f.days()['2026-09-23'].sched['9:00'].text,'Practice');
});
test('paging reads all events before importing or removing schedule rows',async()=>{
  const calls=[];const events=await listCalendarEvents(async p=>{calls.push(p);return calls.length===1?{items:[{id:'one'}],nextPageToken:'second'}:{items:[{id:'two'}]};},path,'?maxResults=2500');
  assert.equal(events.length,2);assert.ok(calls[1].endsWith('&pageToken=second'));
});
test('typing while a result is being applied keeps both slots intact',async()=>{
  const f=setup();const updated={...f.options,updateDays:fn=>{f.change(d=>({...d,'2026-09-24':{sched:{'11:00':{text:'Typed meanwhile'}}}}));f.change(fn);return false;}};
  await reconcileSchedule({...updated,events:[{...f.original,...bodyFor({date:'2026-09-24',time:'11:00',mins:60,title:'Moved'})}]});
  assert.equal(f.days()['2026-09-23'].sched['9:00'].text,'Practice');assert.equal(f.days()['2026-09-24'].sched['11:00'].text,'Typed meanwhile');
  assert.ok(f.options.shadow[key]);assert.equal(f.options.shadow['rz|2026-09-24|11:00'],undefined);
});
import {writeCalendarEvent} from '../src/shared/product/calendarSchedule.js';

test('conditional write refuses a simultaneous Google edit',async()=>{
  const f=setup();const calls=[];
  await assert.rejects(writeCalendarEvent({path,gid:'stable',body:f.original,previous:{etag:'v1'},request:async(p,o)=>{calls.push(o);throw Object.assign(Error('precondition'),{status:412});}}));
  assert.equal(calls.length,1);assert.equal(calls[0].headers['If-Match'],'v1');
});

test('an ID collision is read but never overwritten',async()=>{
  const f=setup();const calls=[];
  await assert.rejects(writeCalendarEvent({path,gid:'stable',body:f.original,request:async(p,o)=>{calls.push(o?.method||'GET');if(o)throw Object.assign(Error('collision'),{status:409});return {...f.original,summary:'Edited in Google'};}}));
  assert.deepEqual(calls,['POST','GET']);
});

test('a retried creation adopts the same event without duplicating it',async()=>{
  const f=setup();const calls=[];
  const saved=await writeCalendarEvent({path,gid:'stable',body:f.original,request:async(p,o)=>{calls.push(o?.method||'GET');if(o)throw Object.assign(Error('collision'),{status:409});return f.original;}});
  assert.equal(saved.id,'stable');assert.deepEqual(calls,['POST','GET']);
});

test('a moved slot remembers its retired identity so a new block gets another ID',async()=>{
  const f=setup();await reconcileSchedule({...f.options,events:[{...f.original,...bodyFor({date:'2026-09-24',time:'11:00',mins:60,title:'Moved'})}]});
  assert.deepEqual(f.options.tomb[key],{gid:'stable'});
});


test('a longer remote block cannot cover another scheduled activity',async()=>{
 const f=setup();f.change(d=>({...d,'2026-09-24':{sched:{'12:00':{text:'Keep visible',span:1}}}}));
 const result=await reconcileSchedule({...f.options,events:[{...f.original,...bodyFor({date:'2026-09-24',time:'11:15',mins:90,title:'Moved'})}]});
 assert.equal(result.conflicts.length,1);assert.equal(f.days()['2026-09-23'].sched['9:00'].text,'Practice');
});

test('past and distant schedule rows are not reconciled as deleted when the rolling window changes',async()=>{
  const f=setup();let lookups=0;
  const result=await reconcileSchedule({...f.options,events:[],from:'2026-09-24',to:'2026-10-01',request:async()=>{lookups++;throw Error('unexpected');}});
  assert.equal(lookups,0);assert.equal(result.conflicts.length,0);
  assert.equal(f.days()['2026-09-23'].sched['9:00'].text,'Practice');assert.ok(f.options.shadow[key]);
  assert.equal(calendarEventInWindow(key,f.options.shadow[key],'2026-09-24','2026-10-01'),false);
  assert.equal(calendarEventInWindow('rz|2026-11-01|9:00',{},'2026-09-24','2026-10-01'),false);
  assert.equal(calendarEventInWindow('rz|2026-09-24|9:00',{},'2026-09-24','2026-10-01'),true);
});

test('deletion eligibility retains unknown legacy history and recognizes all-day shadows',()=>{
  assert.equal(calendarEventInWindow('old|unknown',{},'2026-09-24','2026-10-01'),false);
  assert.equal(calendarEventInWindow('training|id',{base:{start:'2026-09-23'}},'2026-09-24','2026-10-01'),false);
  assert.equal(calendarEventInWindow('training|id',{base:{start:'2026-09-27'}},'2026-09-24','2026-10-01'),true);
});
