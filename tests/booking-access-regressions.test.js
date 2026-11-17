import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {makeEnv,makeD1,req} from './helpers/env.js';
import {seedBooking,givePackage,at,FIXED_NOW} from './helpers/seed.js';
import {createBooking,rescheduleBooking,transitionBooking,creditSummary,availability} from '../worker/booking/engine.js';
import {groupSlots} from '../worker/booking/managedBookings.js';
import worker from '../worker/index.js';
const main=JSON.parse(readFileSync(new URL('../package.json',import.meta.url))).name==='tanmay-web';
const day='2025-08-18',start=at(day,'10:00'),now=FIXED_NOW;
async function setup(){
 const db=makeD1();await seedBooking(db);
 await db.prepare('CREATE TABLE members(user_id TEXT PRIMARY KEY,email TEXT)').run();
 await db.prepare("INSERT INTO members VALUES('a-example-test','a@example.test'),('b-example-test','b@example.test')").run();
 for(const id of ['cl_a','cl_b'])await givePackage(db,id,5,{id:'pkg_'+id});
 await db.prepare("UPDATE booking_services SET buffer_before_min=0,buffer_after_min=0 WHERE id='svc_pt'").run();
 return db;
}
const input=(extra={})=>({clientId:'cl_a',serviceId:'svc_pt',locationId:'loc_studio',startsAt:start,now,actor:'COACH',...extra});
const snapshot=async db=>{const out={};for(const table of ['bookings','booking_participants','credit_ledger','booking_events','calendar_outbox'])out[table]=(await db.prepare(`SELECT * FROM ${table} ORDER BY rowid`).all()).results;return out;};

test('editing a confirmed appointment below the new service minimum preserves booking and credits',async()=>{
 const db=await setup(),old=await createBooking(db,input()),before=await snapshot(db);
 await db.prepare("UPDATE booking_services SET capacity=2,min_participants=2 WHERE id='svc_req'").run();
 await assert.rejects(rescheduleBooking(db,old.id,input({serviceId:'svc_req',clientIds:['cl_a']})),e=>e.code==='VALIDATION_ERROR'&&e.detail==='min_participants');
 assert.deepEqual(await snapshot(db),before);
 const changed=await rescheduleBooking(db,old.id,input({serviceId:'svc_req',clientIds:['cl_a','cl_b']}));
 assert.equal(changed.status,'CONFIRMED');assert.equal(changed.service_id,'svc_req');
});

test('pending group may be moved before it reaches its minimum',async()=>{
 const db=await setup();await db.prepare("UPDATE booking_services SET capacity=2,min_participants=2 WHERE id='svc_pt'").run();
 const old=await createBooking(db,input());assert.equal(old.status,'REQUESTED');
 const moved=await rescheduleBooking(db,old.id,input({startsAt:at(day,'12:00')}));assert.equal(moved.status,'REQUESTED');
});

test('deactivation or membership removal at commit blocks create, group join and retained-credit move atomically',async()=>{
 for(const revoke of ['inactive','membership'])for(const action of ['create','move','join']){
  const db=await setup();let old;
  if(action==='join'){
   await db.prepare("UPDATE booking_services SET capacity=2 WHERE id='svc_pt'").run();
   for(const id of ['cl_a','cl_b'])await db.prepare('INSERT INTO client_package_services VALUES(?,?)').bind('pkg_'+id,'svc_pt').run();
   old=await createBooking(db,input({clientId:'cl_b'}));
  }else if(action==='move')old=await createBooking(db,input());
  const before=await snapshot(db),batch=db.batch.bind(db);let raced=false;
  db.batch=async statements=>{
   if(!raced&&/^INSERT INTO bookings|^UPDATE bookings SET/.test(statements[0]?._sql||'')){
    raced=true;
    await db.prepare(revoke==='inactive'?"UPDATE booking_clients SET active=0 WHERE id='cl_a'":"DELETE FROM members WHERE user_id='a-example-test'").run();
   }
   return batch(statements);
  };
  const args=input({actor:'CLIENT',actorId:'a-example-test',...(action==='join'?{groupBookingId:old.id}:{})});
  await assert.rejects(action==='move'?rescheduleBooking(db,old.id,{...args,startsAt:at(day,'12:00')}):createBooking(db,args),e=>e.code==='NOT_AUTHORIZED',`${revoke}/${action}`);
  assert.equal(raced,true);assert.deepEqual(await snapshot(db),before,`${revoke}/${action}`);
 }
});

test('own timely group cancellation can be rebooked once with a fresh hold; coach removal and late cancellation stay closed',async()=>{
 for(const reason of ['own','coach','late']){
  const db=await setup();await db.prepare("UPDATE booking_services SET capacity=2,price_minor=60000 WHERE id='svc_pt'").run();
  for(const id of ['cl_a','cl_b'])await db.prepare('INSERT INTO client_package_services VALUES(?,?)').bind('pkg_'+id,'svc_pt').run();
  const old=await createBooking(db,input({clientIds:['cl_a','cl_b']}));
  if(reason==='coach')await rescheduleBooking(db,old.id,input({clientIds:['cl_b']}));
  else await transitionBooking(db,old.id,'cancel',{actor:'CLIENT',clientId:'cl_a',now:reason==='late'?start-3600000:now});
  const rejoinNow=reason==='late'?start-1800000:now;
  const before=await snapshot(db),args=input({actor:'CLIENT',actorId:'a-example-test',groupBookingId:old.id,now:rejoinNow});
  const slots=await availability(db,{serviceId:'svc_pt',locationId:'loc_studio',fromDate:day,days:1,now:rejoinNow});
  await groupSlots(db,{serviceId:'svc_pt',locationId:'loc_studio',clientId:'cl_a',now:rejoinNow},slots);
  assert.equal(slots.days[0].slots.some(slot=>slot.groupBookingId===old.id),reason==='own');
  if(reason==='own'){
   const responses=await Promise.allSettled([createBooking(db,args),createBooking(db,args)]);
   assert.equal(responses.filter(response=>response.status==='fulfilled').length,1);
   assert.equal((await creditSummary(db,'cl_a',{now})).balance.reserved,1);
   const ledger=(await db.prepare("SELECT kind FROM credit_ledger WHERE booking_id=? AND client_id='cl_a' ORDER BY rowid").bind(old.id).all()).results.map(row=>row.kind);
   assert.deepEqual(ledger,['HOLD','RELEASE','HOLD']);
   assert.equal((await db.prepare("SELECT COUNT(*) n FROM booking_events WHERE booking_id=? AND type='PARTICIPANT_CANCELLED'").bind(old.id).first()).n,1);
  }else{
   await assert.rejects(createBooking(db,args),e=>e.code==='SLOT_TAKEN');assert.deepEqual(await snapshot(db),before);
  }
 }
});

test('real Client inactive account has no offered times but retains its appointments, credit history and cancellation',{skip:main},async t=>{
 t.mock.timers.enable({apis:['Date'],now});
 const env=makeEnv(),email='a@example.test';
 assert.equal((await worker.fetch(req('/api/join',{email,method:'POST',body:{word:env.INVITE_WORD}}),env,{})).status,200);
 await seedBooking(env.DB);await givePackage(env.DB,'cl_a',5);
 await env.DB.prepare("UPDATE booking_services SET buffer_before_min=0,buffer_after_min=0 WHERE id='svc_pt'").run();
 const old=await createBooking(env.DB,input()),before=await snapshot(env.DB);
 await env.DB.prepare("UPDATE booking_clients SET active=0 WHERE id='cl_a'").run();
 const call=(path,options={})=>worker.fetch(req(path,{email,...options}),env,{});
 const context=await(await call('/api/client/booking/context')).json();
 assert.equal(context.enabled,false);assert.equal(context.reason,'INACTIVE_CLIENT');assert.deepEqual(context.services,[]);assert.equal(context.credits.reserved,1);
 assert.equal((await call(`/api/client/booking/slots?serviceId=svc_pt&locationId=loc_studio&from=${day}`)).status,403);
 assert.equal((await call('/api/client/bookings',{method:'POST',body:input({startsAt:at(day,'12:00')})})).status,403);
 assert.equal((await call(`/api/client/bookings/${old.id}/reschedule`,{method:'POST',body:{startsAt:at(day,'12:00')}})).status,403);
 assert.deepEqual(await snapshot(env.DB),before);
 assert.equal((await call('/api/client/bookings')).status,200);
 assert.equal((await call('/api/client/credits')).status,200);
 assert.equal((await call(`/api/client/bookings/${old.id}/cancel`,{method:'POST',body:{}})).status,200);
 assert.equal((await(await call('/api/client/credits')).json()).balance.reserved,0);
});
