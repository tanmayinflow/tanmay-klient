import {test, beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import {makeD1} from './helpers/env.js';
import {seedBooking, givePackage, at} from './helpers/seed.js';
import {handleCoach, handleClient} from '../worker/booking/api.js';
import * as E from '../worker/booking/engine.js';
import * as R from '../worker/booking/repo.js';
import {hhmm} from '../src/booking/time.js';

const DATE='2026-09-07', TZ='Europe/Prague';
beforeEach(t=>t.mock.timers.enable({apis:['Date'],now:new Date('2026-09-01T08:00:00Z')}));
async function setup(){
 const db=makeD1();await seedBooking(db);await givePackage(db,'cl_a',10);
 // Direct handler tests include the membership that the real Client Worker
 // establishes before entering booking routes.
 await db.prepare('CREATE TABLE members(user_id TEXT PRIMARY KEY,email TEXT)').run();
 await db.prepare("INSERT INTO members VALUES('a-example-test','a@example.test'),('b-example-test','b@example.test')").run();
 return db;
}
async function coach(db,path,body,method='POST'){
 const url=new URL('https://example.test/api/booking'+path);
 const response=await handleCoach(new Request(url,{method,...(body===undefined?{}:{headers:{'content-type':'application/json'},body:JSON.stringify(body)})}),{KLIENT_DB:db},url,{});
 return {status:response.status,...await response.json()};
}
async function client(db,path,body,account='a-example-test',method='POST'){
 const url=new URL('https://example.test/api/client'+path);
 const response=await handleClient(new Request(url,{method,...(body===undefined?{}:{headers:{'content-type':'application/json'},body:JSON.stringify(body)})}),{DB:db},url,account,{});
 return response?{status:response.status,...await response.json()}:null;
}
const book=(db,time='10:00',extra={})=>E.createBooking(db,{clientId:'cl_a',serviceId:'svc_pt',locationId:'loc_studio',startsAt:at(DATE,time),now:Date.now(),actor:'CLIENT',...extra});
const slots=async db=>(await client(db,`/booking/slots?serviceId=svc_pt&locationId=loc_studio&from=${DATE}&days=1`,undefined,'a-example-test','GET')).days.flatMap(day=>day.slots.map(s=>hhmm(s.startsAt,TZ)));
const count=async(db,table)=>(await db.prepare(`SELECT COUNT(*) n FROM ${table}`).first()).n;

test('reschedule slots preserve booked duration and do not count the moved booking against its own limits',async()=>{
 const db=await setup(), b=await book(db);
 await db.prepare("UPDATE booking_services SET duration_min=30, daily_limit=1, weekly_limit=1 WHERE id='svc_pt'").run();
 const listed=await client(db,`/booking/slots?serviceId=svc_pt&locationId=loc_studio&from=${DATE}&days=1&reschedule=${b.id}`,undefined,'a-example-test','GET');
 assert.equal(listed.status,200);
 assert.ok(listed.days[0].slots.some(s=>s.startsAt===at(DATE,'13:00')));
 assert.ok(listed.days[0].slots.every(s=>s.endsAt-s.startsAt===3600000));
 assert.ok(!listed.days[0].slots.some(s=>s.startsAt===at(DATE,'16:30')));
 const normal=await client(db,`/booking/slots?serviceId=svc_pt&locationId=loc_studio&from=${DATE}&days=1`,undefined,'a-example-test','GET');assert.equal(normal.days.flatMap(d=>d.slots).length,0);
 const other=await client(db,`/booking/slots?serviceId=svc_pt&locationId=loc_studio&from=${DATE}&days=1&reschedule=${b.id}`,undefined,'b-example-test','GET');
 assert.equal(other.days.flatMap(d=>d.slots).length,0);
});

test('calendar reschedule accepts current revision, rejects stale drag, and keeps legacy callers compatible',async()=>{
 const db=await setup(), original=await book(db);
 const first=await coach(db,`/bookings/${original.id}/reschedule`,{startsAt:at(DATE,'13:00'),expectedVersion:original.version,expectedStartsAt:original.starts_at_utc});
 assert.equal(first.status,200);assert.equal(first.booking.version,2);
 assert.equal(first.booking.endsAt-first.booking.startsAt,60*60000);
 assert.ok(first.booking.updatedAt>original.updated_at);
 const stale=await coach(db,`/bookings/${original.id}/reschedule`,{startsAt:at(DATE,'15:00'),expectedVersion:original.version});
 assert.equal(stale.status,409);assert.equal(stale.error,'BOOKING_CHANGED');
 assert.equal((await R.getBooking(db,original.id)).starts_at_utc,at(DATE,'13:00'));
 assert.equal((await R.eventsOfBooking(db,original.id)).filter(e=>e.type==='RESCHEDULED').length,1);
 const legacy=await coach(db,`/bookings/${original.id}/reschedule`,{startsAt:at(DATE,'15:00')});
 assert.equal(legacy.status,200);assert.equal(legacy.booking.version,3);
});

test('two calendar drags from the same revision have one winner and no lost update',async()=>{
 const db=await setup(), b=await book(db);
 const results=await Promise.all(['12:00','14:00'].map(time=>coach(db,`/bookings/${b.id}/reschedule`,{startsAt:at(DATE,time),expectedVersion:b.version})));
 assert.deepEqual(results.map(r=>r.status).sort(),[200,409]);
 assert.equal(results.find(r=>r.status===409).error,'BOOKING_CHANGED');
 assert.equal((await R.getBooking(db,b.id)).starts_at_utc,results.find(r=>r.status===200).booking.startsAt);
 assert.equal((await R.eventsOfBooking(db,b.id)).filter(e=>e.type==='RESCHEDULED').length,1);
 assert.equal((await E.creditSummary(db,'cl_a')).balance.reserved,1);
});

test('changing service duration never shortens a moved booking or skips conflicts in its original duration',async()=>{
 const db=await setup(), b=await book(db);
 await db.prepare("UPDATE booking_services SET duration_min=30, slot_interval_min=15 WHERE id='svc_pt'").run();
 const moved=await coach(db,`/bookings/${b.id}/reschedule`,{startsAt:at(DATE,'13:00'),expectedVersion:b.version});
 assert.equal(moved.status,200);assert.equal(moved.booking.endsAt,at(DATE,'14:00'));
 assert.equal(moved.booking.service.durationMin,60);assert.equal(moved.booking.service.slotIntervalMin,15);
 await coach(db,'/blocks',{startsAt:at(DATE,'15:50'),endsAt:at(DATE,'16:00')});
 const blocked=await coach(db,`/bookings/${b.id}/reschedule`,{startsAt:at(DATE,'15:00'),expectedVersion:moved.booking.version});
 assert.equal(blocked.status,409);assert.equal(blocked.error,'SLOT_TAKEN');
 const tooLong=await coach(db,`/bookings/${b.id}/reschedule`,{startsAt:at(DATE,'16:30'),expectedVersion:moved.booking.version});
 assert.equal(tooLong.status,409);assert.equal(tooLong.error,'OUTSIDE_AVAILABILITY');
 assert.equal((await R.getBooking(db,b.id)).starts_at_utc,at(DATE,'13:00'));
});

test('revision and original-time guards reject malformed or changed baselines',async()=>{
 const db=await setup(), b=await book(db);
 for(const field of ['expectedVersion','expectedStartsAt','expectedUpdatedAt']){
  const invalid=await coach(db,`/bookings/${b.id}/reschedule`,{startsAt:at(DATE,'13:00'),[field]:'old'});
  assert.equal(invalid.status,400);
 }
 const stale=await coach(db,`/bookings/${b.id}/reschedule`,{startsAt:at(DATE,'13:00'),expectedStartsAt:b.starts_at_utc+60000});
 assert.equal(stale.status,409);
 await db.prepare('UPDATE bookings SET updated_at=updated_at+1 WHERE id=?').bind(b.id).run();
 const noteChanged=await coach(db,`/bookings/${b.id}/reschedule`,{startsAt:at(DATE,'13:00'),expectedUpdatedAt:b.updated_at});
 assert.equal(noteChanged.status,409);assert.equal(noteChanged.error,'BOOKING_CHANGED');
 assert.equal((await R.getBooking(db,b.id)).version,1);
});

test('client reschedule guards revisions and never exposes another client booking',async()=>{
 const db=await setup(), b=await book(db, '10:00', {coachNote:'Private coach note'});
 const stranger=await client(db,`/bookings/${b.id}/reschedule`,{startsAt:at(DATE,'13:00'),expectedVersion:b.version},'b-example-test');
 assert.equal(stranger.status,403);assert.equal(stranger.booking,undefined);
 const moved=await client(db,`/bookings/${b.id}/reschedule`,{startsAt:at(DATE,'13:00'),expectedVersion:b.version});
 assert.equal(moved.status,200);assert.equal(moved.booking.coachNote,undefined);assert.equal(moved.booking.clientEmail,undefined);
 const stale=await client(db,`/bookings/${b.id}/reschedule`,{startsAt:at(DATE,'15:00'),expectedVersion:b.version});
 assert.equal(stale.status,409);assert.equal(stale.error,'BOOKING_CHANGED');
});

test('manual time off edits keep identity and existing bookings while rejecting stale updates',async()=>{
 const db=await setup(), b=await book(db);
 const made=await coach(db,'/blocks',{startsAt:at(DATE,'09:00'),endsAt:at(DATE,'12:00'),note:'Time off'});
 assert.equal(made.status,200);
 const original=await R.getBooking(db,b.id), locks=await count(db,'booking_slot_locks');
 const first=await coach(db,`/blocks/${made.id}`,{startsAt:at(DATE,'09:30'),endsAt:at(DATE,'11:30'),note:'Updated',expectedUpdatedAt:made.block.updatedAt},'PATCH');
 assert.equal(first.status,200);assert.equal(first.block.id,made.id);assert.ok(first.block.updatedAt>made.block.updatedAt);
 const stale=await coach(db,`/blocks/${made.id}`,{note:'Stale',expectedUpdatedAt:made.block.updatedAt},'PATCH');
 assert.equal(stale.status,409);assert.equal(stale.error,'BLOCK_CHANGED');
 assert.deepEqual(await R.getBooking(db,b.id),original);assert.equal(await count(db,'booking_slot_locks'),locks);
 const calendar=await coach(db,`/calendar?from=${DATE}&days=1`,undefined,'GET');
 assert.equal(calendar.blocks[0].updatedAt,first.block.updatedAt);
 assert.equal(calendar.bookings[0].id,b.id);
});

test('two time-off edits from the same revision leave exactly one complete result',async()=>{
 const db=await setup(), made=await coach(db,'/blocks',{startsAt:at(DATE,'09:00'),endsAt:at(DATE,'10:00')});
 const results=await Promise.all(['12:00','14:00'].map(time=>coach(db,`/blocks/${made.id}`,{startsAt:at(DATE,time),endsAt:at(DATE,time)+3600000,expectedUpdatedAt:made.block.updatedAt},'PATCH')));
 assert.deepEqual(results.map(r=>r.status).sort(),[200,409]);
 const saved=await db.prepare('SELECT * FROM booking_blocks WHERE id=?').bind(made.id).first();
 assert.equal(saved.starts_at_utc,results.find(r=>r.status===200).block.startsAt);
 assert.equal(saved.ends_at_utc-saved.starts_at_utc,3600000);
});

test('removing a multi-day block restores client slots and rejects stale, missing and Google rows',async()=>{
 const db=await setup(), startsAt=at(DATE,'09:00');
 const made=await coach(db,'/blocks',{startsAt,endsAt:startsAt+48*3600000});
 const path=`/blocks/${made.id}`;
 const initial=await coach(db,`/calendar?from=${DATE}&days=2`,undefined,'GET');
 const block=initial.blocks.find(item=>item.id===made.id);
 assert.ok(!(await slots(db)).includes('10:00'));
 const edited=await coach(db,path,{note:'Edited in another window',expectedUpdatedAt:block.updatedAt},'PATCH');
 const remove=revision=>coach(db,`${path}?expectedUpdatedAt=${revision}`,undefined,'DELETE');
 assert.equal((await remove(block.updatedAt)).error,'BLOCK_CHANGED');
 assert.equal((await remove('invalid')).status,400);
 assert.equal((await remove(edited.block.updatedAt)).removed,true);
 const updated=await coach(db,`/calendar?from=${DATE}&days=2`,undefined,'GET');
 assert.equal(updated.blocks.some(item=>item.id===made.id),false);
 assert.ok((await slots(db)).includes('10:00'));
 assert.equal((await remove(edited.block.updatedAt)).status,404);
 const google=await coach(db,'/blocks',{startsAt,endsAt:startsAt+3600000});
 await db.prepare("UPDATE booking_blocks SET source='GOOGLE' WHERE id=?").bind(google.id).run();
 assert.equal((await coach(db,`/blocks/${google.id}`,undefined,'DELETE')).status,404);
 assert.ok(await db.prepare('SELECT id FROM booking_blocks WHERE id=?').bind(google.id).first());
});

test('editing time off immediately changes client slots without leaking its note',async()=>{
 const db=await setup(), made=await coach(db,'/blocks',{startsAt:at(DATE,'10:00'),endsAt:at(DATE,'11:00'),note:'Private reason'});
 let available=await slots(db);assert.ok(!available.includes('10:00'));assert.ok(available.includes('14:00'));
 const moved=await coach(db,`/blocks/${made.id}`,{startsAt:at(DATE,'14:00'),endsAt:at(DATE,'15:00'),expectedStartsAt:made.block.startsAt},'PATCH');
 assert.equal(moved.status,200);
 available=await slots(db);assert.ok(available.includes('10:00'));assert.ok(!available.includes('14:00'));
 const clientResponse=await client(db,`/booking/slots?serviceId=svc_pt&locationId=loc_studio&from=${DATE}&days=1`,undefined,'a-example-test','GET');
 assert.ok(!JSON.stringify(clientResponse).includes('Private reason'));
 const url=new URL(`https://example.test/api/booking/blocks/${made.id}`);
 assert.equal(await handleClient(new Request(url,{method:'PATCH',body:'{"note":"forged"}'}),{DB:db},url,'a-example-test',{}),null);
 assert.equal((await db.prepare('SELECT note FROM booking_blocks WHERE id=?').bind(made.id).first()).note,'Private reason');
});

test('Google blocks and invalid or oversized manual edits are rejected',async()=>{
 const db=await setup(), made=await coach(db,'/blocks',{startsAt:at(DATE,'10:00'),endsAt:at(DATE,'11:00')});
 for(const body of [{},null,[],{endsAt:at(DATE,'09:00')},{expectedUpdatedAt:'wrong',note:'x'}]){
  assert.equal((await coach(db,`/blocks/${made.id}`,body,'PATCH')).status,400);
 }
 assert.equal((await coach(db,`/blocks/${made.id}`,{note:'x'.repeat(140000)},'PATCH')).status,413);
 await db.prepare("UPDATE booking_blocks SET source='GOOGLE' WHERE id=?").bind(made.id).run();
 assert.equal((await coach(db,`/blocks/${made.id}`,{note:'Not allowed'},'PATCH')).status,404);
});

test('time off inserted after availability was read rejects booking atomically without a credit or audit orphan',async()=>{
 for(const credit of [1,0]){
  const db=await setup();await db.prepare('UPDATE booking_services SET credit_cost_units=? WHERE id=?').bind(credit,'svc_pt').run();
  const batch=db.batch.bind(db);let inserted=false;
  db.batch=async statements=>{
   if(!inserted&&statements.some(s=>/INSERT INTO bookings/.test(s._sql))){
    inserted=true;await coach(db,'/blocks',{startsAt:at(DATE,'12:45'),endsAt:at(DATE,'13:05')});
   }
   return batch(statements);
  };
  await assert.rejects(()=>book(db,'13:00'),error=>error.code==='SLOT_TAKEN');
  for(const table of ['bookings','booking_slot_locks','booking_events','calendar_outbox'])assert.equal(await count(db,table),0,table);
  assert.equal((await E.creditSummary(db,'cl_a')).balance.available,10);
  assert.equal((await E.creditSummary(db,'cl_a')).balance.reserved,0);
 }
});

test('time off winning the reschedule race leaves the old booking, locks and credits intact',async()=>{
 const db=await setup(), b=await book(db);
 const locks=await db.prepare('SELECT * FROM booking_slot_locks ORDER BY slot_cell').all();
 const batch=db.batch.bind(db);let inserted=false;
 db.batch=async statements=>{
  if(!inserted&&statements.some(s=>/UPDATE bookings SET .*starts_at_utc/.test(s._sql))){
   inserted=true;await coach(db,'/blocks',{startsAt:at(DATE,'13:00'),endsAt:at(DATE,'14:00')});
  }
  return batch(statements);
 };
 await assert.rejects(()=>E.rescheduleBooking(db,b.id,{startsAt:at(DATE,'13:00'),now:Date.now(),actor:'COACH',expectedVersion:b.version}),error=>error.code==='SLOT_TAKEN');
 assert.equal((await R.getBooking(db,b.id)).starts_at_utc,b.starts_at_utc);
 assert.equal((await R.getBooking(db,b.id)).version,1);
 assert.deepEqual(await db.prepare('SELECT * FROM booking_slot_locks ORDER BY slot_cell').all(),locks);
 assert.equal((await R.eventsOfBooking(db,b.id)).filter(e=>e.type==='RESCHEDULED').length,0);
 assert.equal((await E.creditSummary(db,'cl_a')).balance.reserved,1);
});

test('dated booking moves across Prague daylight-saving changes retain local hour and service duration',async t=>{
 for(const [from,to,now] of [['2026-03-27','2026-03-30','2026-03-20'],['2026-10-23','2026-10-26','2026-10-01']]){
  t.mock.timers.setTime(new Date(now+'T08:00:00Z').getTime());
  const db=await setup(), b=await book(db,'10:00',{startsAt:at(from,'10:00')});
  const moved=await coach(db,`/bookings/${b.id}/reschedule`,{startsAt:at(to,'10:00'),expectedVersion:b.version});
  assert.equal(moved.status,200);assert.equal(moved.booking.localDate,to);assert.equal(moved.booking.timezone,TZ);
  assert.equal(hhmm(moved.booking.startsAt,TZ),'10:00');assert.equal(hhmm(moved.booking.endsAt,TZ),'11:00');
  assert.equal(moved.booking.endsAt-moved.booking.startsAt,3600000);
 }
});
