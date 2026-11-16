import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { makeD1 } from './helpers/env.js';
import { seedBooking, givePackage, at, FIXED_NOW } from './helpers/seed.js';
import { createBooking, rescheduleBooking, transitionBooking, creditSummary, availability } from '../worker/booking/engine.js';
import { groupSlots } from '../worker/booking/managedBookings.js';
import { handleCoach, handleClient } from '../worker/booking/api.js';
import { ensureBookingSchema,forgetSchema } from '../worker/booking/schema.js';
import { seedPublicOffer } from '../worker/booking/publicOffer.js';
beforeEach(t=>t.mock.timers.enable({apis:['Date'],now:FIXED_NOW}));
const DAY='2025-08-18',start=at(DAY,'10:00'),now=FIXED_NOW;
async function setup({group=false,credits=5}={}) {
  const db=makeD1();await seedBooking(db);await givePackage(db,'cl_a',credits,{id:'pkg_a'});await givePackage(db,'cl_b',credits,{id:'pkg_b'});
  await db.prepare('UPDATE booking_services SET buffer_before_min=0,buffer_after_min=0,capacity=?,price_minor=? WHERE id=?').bind(group?2:1,group?60000:0,'svc_pt').run();
  if(group)for(const pkg of ['pkg_a','pkg_b'])await db.prepare('INSERT INTO client_package_services VALUES (?,?)').bind(pkg,'svc_pt').run();
  return db;
}
const input=(extra={})=>({clientId:'cl_a',serviceId:'svc_pt',locationId:'loc_studio',startsAt:start,now,actor:'COACH',...extra});
async function route(db,who,path,body,method='POST') {const u=new URL('https://example.test'+path);const req=new Request(u,{method,...(body===undefined?{}:{headers:{'content-type':'application/json'},body:JSON.stringify(body)})});return who==='coach'?handleCoach(req,{KLIENT_DB:db},u,{}):handleClient(req,{DB:db},u,who,{});}
const rejects=(p,code)=>assert.rejects(p,e=>e.code===code);

test('exact minute coach times and adjacent unequal durations; one-minute overlap rejects atomically',async()=>{
 const db=await setup();const b=await createBooking(db,input({startsAt:at(DAY,'10:03'),durationMin:44,adminOverride:true,overrideReason:'Domluveno'}));
 assert.equal(b.ends_at_utc,at(DAY,'10:47'));
 await createBooking(db,input({clientId:'cl_b',startsAt:at(DAY,'10:47'),durationMin:32,adminOverride:true,overrideReason:'Domluveno'}));
 await rejects(createBooking(db,input({startsAt:at(DAY,'11:18'),durationMin:7,adminOverride:true,overrideReason:'Domluveno'})),'SLOT_TAKEN');
 assert.equal((await creditSummary(db,'cl_a')).balance.reserved,1);
});
test('client cannot choose arbitrary time, duration, coach override or participants',async()=>{
 const db=await setup();await rejects(createBooking(db,input({actor:'CLIENT',startsAt:at(DAY,'10:03')})),'VALIDATION_ERROR');
 for(const override of [{durationMin:5},{adminOverride:true,overrideReason:'fake'},{clientIds:['cl_a','cl_b']}])await rejects(createBooking(db,input({actor:'CLIENT',...override})),'NOT_AUTHORIZED');
 await rejects(createBooking(db,input({actor:'CLIENT',startsAt:at(DAY,'10:15')})),'OUTSIDE_AVAILABILITY');
});
test('manual coach placement bypasses working hours, never time-off or another booking',async()=>{
 const db=await setup();await db.prepare("INSERT INTO booking_blocks(id,starts_at_utc,ends_at_utc,source,created_at,updated_at) VALUES('off',?,?,'MANUAL',?,?)").bind(at(DAY,'18:00'),at(DAY,'19:00'),now,now).run();
 await rejects(createBooking(db,input({startsAt:at(DAY,'18:03'),durationMin:20,adminOverride:true,overrideReason:'Test'})),'SLOT_TAKEN');
 await createBooking(db,input({startsAt:at(DAY,'19:03'),durationMin:20,adminOverride:true,overrideReason:'Test'}));
});
test('two-member booking holds each own package, completion consumes exactly once per person',async()=>{
 const db=await setup({group:true});const b=await createBooking(db,input({clientIds:['cl_a','cl_b']}));
 for(const c of ['cl_a','cl_b'])assert.equal((await creditSummary(db,c)).balance.reserved,1);
 await Promise.allSettled([transitionBooking(db,b.id,'complete',{actor:'COACH',now}),transitionBooking(db,b.id,'complete',{actor:'COACH',now})]);
 for(const c of ['cl_a','cl_b'])assert.deepEqual([(await creditSummary(db,c)).balance.reserved,(await creditSummary(db,c)).balance.consumed],[0,1]);
});
test('same-service move retains payment and original reserved package after expiry',async()=>{
 const db=await setup();const b=await createBooking(db,input());await db.prepare("UPDATE client_packages SET status='EXPIRED' WHERE id='pkg_a'").run();
 const moved=await rescheduleBooking(db,b.id,{actor:'COACH',startsAt:at(DAY,'11:03'),durationMin:37,adminOverride:true,overrideReason:'Test',now});
 assert.equal(moved.client_package_id,'pkg_a');assert.equal(moved.credit_cost_units,1);assert.equal((await creditSummary(db,'cl_a')).balance.reserved,1);
});
test('service change releases individual credit, never spends it on group unless explicitly eligible',async()=>{
 const db=await setup();await seedPublicOffer(db,now);const b=await createBooking(db,input());
 const changed=await rescheduleBooking(db,b.id,{actor:'COACH',startsAt:start,serviceId:'web-pair',locationId:null,clientIds:['cl_a','cl_b'],durationMin:60,now});
 assert.equal(changed.credit_cost_units,0);assert.equal(changed.price_minor,60000);
 assert.equal((await creditSummary(db,'cl_a')).balance.reserved,0);
 assert.equal((await creditSummary(db,'cl_b')).balance.reserved,0);
});
test('adding and removing participants adjusts only their own holds; stale edit has no side effect',async()=>{
 const db=await setup({group:true});const b=await createBooking(db,input());
 const two=await rescheduleBooking(db,b.id,{actor:'COACH',startsAt:start,clientIds:['cl_a','cl_b'],expectedVersion:b.version,now});
 await rejects(rescheduleBooking(db,b.id,{actor:'COACH',startsAt:start,clientIds:['cl_b'],expectedVersion:b.version,now}),'BOOKING_CHANGED');
 await rescheduleBooking(db,b.id,{actor:'COACH',startsAt:start,clientIds:['cl_b'],expectedVersion:two.version,now});
 assert.equal((await creditSummary(db,'cl_a')).balance.reserved,0);assert.equal((await creditSummary(db,'cl_b')).balance.reserved,1);
});
test('client cancels only own group place; other participant keeps time and credit',async()=>{
 const db=await setup({group:true});const b=await createBooking(db,input({clientIds:['cl_a','cl_b']}));
 const res=await route(db,'b-example-test','/api/client/bookings/'+b.id+'/cancel',{});assert.equal(res.status,200,JSON.stringify(await res.clone().json()));
 assert.equal((await res.json()).booking.status,'CANCELLED_CLIENT');assert.equal((await creditSummary(db,'cl_b')).balance.reserved,0);
 assert.equal((await creditSummary(db,'cl_a')).balance.reserved,1);assert.equal((await db.prepare('SELECT status FROM bookings WHERE id=?').bind(b.id).first()).status,'CONFIRMED');
 await rejects(createBooking(db,input({clientId:'cl_b'})),'SLOT_TAKEN');
});
test('client group view and list expose only own price and note, never other identity',async()=>{
 const db=await setup({group:true});const b=await createBooking(db,input({clientIds:['cl_a','cl_b'],clientNote:'A private note',coachNote:'SECRET'}));
 for(const path of ['/api/client/bookings/'+b.id,'/api/client/bookings']){
 const res=await route(db,'b-example-test',path,undefined,'GET');assert.equal(res.status,200);const text=JSON.stringify(await res.json());assert.ok(!text.includes('SECRET'));assert.ok(!text.includes('A private note'));assert.ok(!text.includes('a@example.test'));assert.ok(!text.includes('Klient A'));assert.ok(!text.includes('participants'));
 }
 const stranger=await route(db,'unknown-example-test','/api/client/bookings/'+b.id,undefined,'GET');assert.equal(stranger.status,403);
});
test('joinable group slots have no identities; concurrent join cannot exceed capacity',async()=>{
 const db=await setup({group:true});const b=await createBooking(db,input());
 await db.prepare("INSERT INTO booking_clients(id,name,active,created_at,updated_at) VALUES('cl_c','Third',1,?,?)").bind(now,now).run();
 const av=await availability(db,{serviceId:'svc_pt',locationId:'loc_studio',now,fromDate:DAY,days:1});
 await groupSlots(db,{serviceId:'svc_pt',locationId:'loc_studio',now,clientId:'cl_b'},av);assert.equal(av.days[0].slots.find(s=>s.start===start).groupBookingId,b.id);
 const results=await Promise.allSettled(['cl_b','cl_c'].map(clientId=>createBooking(db,input({clientId,actor:'CLIENT',groupBookingId:b.id}))));assert.equal(results.filter(x=>x.status==='fulfilled').length,1);
 assert.equal((await db.prepare("SELECT COUNT(*) n FROM booking_participants WHERE booking_id=? AND status IN ('REQUESTED','CONFIRMED')").bind(b.id).first()).n,2);
});
test('client cannot move shared group time',async()=>{const db=await setup({group:true});const b=await createBooking(db,input());await rejects(rescheduleBooking(db,b.id,{actor:'CLIENT',startsAt:at(DAY,'12:00'),now}),'NOT_AUTHORIZED');});
test('group balance guards cannot overdraft even with simultaneous disjoint bookings',async()=>{
 const db=await setup({group:true,credits:1});const results=await Promise.allSettled([start,start+3*3600000].map(startsAt=>createBooking(db,input({startsAt,clientIds:['cl_a','cl_b']}))));
 // Coach can book unpaid when preflight already knows a package is depleted;
 // this race has both preflights see the final credit, so only one commits.
 assert.equal(results.filter(x=>x.status==='fulfilled').length,1);
 for(const id of ['cl_a','cl_b'])assert.deepEqual([(await creditSummary(db,id)).balance.available,(await creditSummary(db,id)).balance.reserved],[0,1]);
});
test('minimum participants enforced before coach confirmation',async()=>{const db=await setup({group:true});await db.prepare("UPDATE booking_services SET min_participants=2,confirmation_mode='REQUEST' WHERE id='svc_pt'").run();const b=await createBooking(db,input());await rejects(transitionBooking(db,b.id,'confirm',{actor:'COACH',now}),'VALIDATION_ERROR');});
test('schema additive rerun preserves history and coach offer import never overwrites price',async()=>{
 const db=await setup();const b=await createBooking(db,input());forgetSchema(db);await ensureBookingSchema(db);assert.ok(await db.prepare('SELECT id FROM bookings WHERE id=?').bind(b.id).first());
 await seedPublicOffer(db,now);await db.prepare("UPDATE booking_services SET price_minor=12345 WHERE id='web-pair'").run();await seedPublicOffer(db,now);assert.equal((await db.prepare("SELECT price_minor FROM booking_services WHERE id='web-pair'").first()).price_minor,12345);
});

test('former participant cannot move replacement participant appointment or exclude its busy slot',async()=>{
 const db=await setup();const b=await createBooking(db,input());await rescheduleBooking(db,b.id,{actor:'COACH',startsAt:start,clientIds:['cl_b'],now});
 const res=await route(db,'a-example-test','/api/client/bookings/'+b.id+'/reschedule',{startsAt:at(DAY,'13:00')});assert.equal(res.status,403);
 const slots=await route(db,'a-example-test','/api/client/booking/slots?serviceId=svc_pt&locationId=loc_studio&from='+DAY+'&days=1&reschedule='+b.id,undefined,'GET');
 assert.ok(!(await slots.json()).days[0].slots.some(s=>s.startsAt===start));
});
test('AUTO group reaching minimum confirms its participants and queues calendar update',async()=>{
 const db=await setup({group:true});await db.prepare("UPDATE booking_services SET min_participants=2 WHERE id='svc_pt'").run();const b=await createBooking(db,input());assert.equal(b.status,'REQUESTED');
 const joined=await createBooking(db,input({clientId:'cl_b',actor:'CLIENT',groupBookingId:b.id}));assert.equal(joined.status,'CONFIRMED');
 assert.deepEqual((await db.prepare('SELECT DISTINCT status FROM booking_participants WHERE booking_id=?').bind(b.id).all()).results.map(p=>p.status),['CONFIRMED']);
 assert.equal((await db.prepare("SELECT COUNT(*) n FROM calendar_outbox WHERE booking_id=? AND action='UPDATE'").bind(b.id).first()).n,1);
});
test('coach payment and note update syncs only chosen group member',async()=>{
 const db=await setup({group:true,credits:0});const b=await createBooking(db,input({clientIds:['cl_a','cl_b']}));
 const res=await route(db,'coach','/api/booking/bookings/'+b.id,{participantClientId:'cl_b',paymentStatus:'PAID',paymentMethod:'CASH',clientNote:'B note'},'PATCH');assert.equal(res.status,200);
 const own=await route(db,'b-example-test','/api/client/bookings/'+b.id,undefined,'GET');const view=(await own.json()).booking;assert.equal(view.paymentStatus,'PAID');assert.equal(view.clientNote,'B note');
 const other=await route(db,'a-example-test','/api/client/bookings/'+b.id,undefined,'GET');assert.notEqual((await other.json()).booking.clientNote,'B note');
});
test('paid regular package is scoped to individual sessions and calendar month from first session',async()=>{
 const db=await setup({credits:0});await seedPublicOffer(db,now);
 const missing=await route(db,'coach','/api/booking/clients/cl_a/packages',{packageDefinitionId:'web-regular-four',units:4,priceMinor:320000,paymentStatus:'PAID'});assert.equal(missing.status,400);
 const res=await route(db,'coach','/api/booking/clients/cl_a/packages',{packageDefinitionId:'web-regular-four',name:'Regular',units:4,priceMinor:320000,paymentStatus:'PAID',validityMonths:1,firstSessionAt:start,serviceIds:['svc_pt']});assert.equal(res.status,200);
 const pkg=(await res.json()).packages.find(p=>p.package_definition_id==='web-regular-four');assert.equal(pkg.valid_from,start);assert.equal(pkg.expires_at,at('2025-09-18','10:00'));assert.deepEqual(pkg.eligible_service_ids,['web-individual']);
 const b=await createBooking(db,input({actor:'CLIENT',serviceId:'web-individual',locationId:null}));assert.equal(b.client_package_id,pkg.id);assert.equal(b.credit_cost_units,1);
 await rejects(rescheduleBooking(db,b.id,{actor:'CLIENT',clientId:'cl_a',startsAt:at('2025-09-19','10:00'),now}),'PACKAGE_EXPIRED');
 const before=await createBooking(db,input({serviceId:'web-individual',locationId:null,startsAt:at('2025-08-15','10:00')}));assert.equal(before.credit_cost_units,0);
 const later=await createBooking(db,input({serviceId:'web-individual',locationId:null,startsAt:at('2025-09-19','10:00')}));assert.equal(later.credit_cost_units,0);
});
test('unpaid regular package does not authorize prepaid rate; month rollover clamps and preserves Prague time',async()=>{
 const {calendarMonthExpiry}=await import('../worker/booking/packageValidity.js');assert.equal(calendarMonthExpiry(at('2026-01-31','10:30')),at('2026-02-28','10:30'));assert.equal(calendarMonthExpiry(at('2026-03-15','10:30')),at('2026-04-15','10:30'));assert.equal(calendarMonthExpiry(at('2028-01-31','10:30')),at('2028-02-29','10:30'));
 const db=await setup({credits:0});await seedPublicOffer(db,now);const res=await route(db,'coach','/api/booking/clients/cl_a/packages',{packageDefinitionId:'web-regular-four',units:4,priceMinor:320000,paymentStatus:'OPEN',firstSessionAt:start});assert.equal(res.status,200);
 const b=await createBooking(db,input({actor:'CLIENT',serviceId:'web-individual',locationId:null}));assert.equal(b.credit_cost_units,0);assert.equal(b.price_minor,100000);
});

test('coach group cancellation previews sum individual credits and cannot forge package payment',async()=>{
 const db=await setup({group:true});const b=await createBooking(db,input({clientIds:['cl_a','cl_b']}));
 const res=await route(db,'coach','/api/booking/bookings/'+b.id+'/cancel-preview',undefined,'GET');const preview=(await res.json()).preview;assert.equal(preview.unitsReturned,2);assert.equal(preview.balanceAfter,null);assert.equal(preview.participants.length,2);
 const forged=await route(db,'coach','/api/booking/bookings/'+b.id,{participantClientId:'cl_b',paymentStatus:'PAID'},'PATCH');assert.equal(forged.status,400);
});
test('group Google event never exposes individual identities or note to shared guests',async()=>{
 const {eventBodyFor}=await import('../worker/booking/google.js');const event=eventBodyFor({id:'group',version:1,status:'CONFIRMED',starts_at_utc:start,ends_at_utc:start+3600000,client_note:'Private note'}, {group:true,inviteClient:true,clientEmail:'a@example.test',clientName:'Klient A'});
 assert.deepEqual(event.attendees,[]);assert.ok(!JSON.stringify(event).includes('Private'));assert.ok(!JSON.stringify(event).includes('Klient A'));
});

test('rolling old Client individual writes keep projection consistent and old group mutations cannot strand credits',async()=>{
 const db=await setup();const b=await createBooking(db,input());
 await db.prepare("UPDATE bookings SET starts_at_utc=?,ends_at_utc=?,version=version+1,updated_at=updated_at+1 WHERE id=?").bind(at(DAY,'12:00'),at(DAY,'13:00'),b.id).run();
 await db.prepare("UPDATE bookings SET status='CANCELLED_CLIENT',version=version+1 WHERE id=?").bind(b.id).run();
 assert.equal((await db.prepare('SELECT status FROM booking_participants WHERE booking_id=?').bind(b.id).first()).status,'CANCELLED_CLIENT');
 await db.prepare("UPDATE booking_services SET capacity=2 WHERE id='svc_pt'").run();
 const group=await createBooking(db,input({clientIds:['cl_a','cl_b']}));
 await assert.rejects(()=>db.prepare("UPDATE bookings SET status='CANCELLED_CLIENT',version=version+1 WHERE id=?").bind(group.id).run(),/current client version/);
 await assert.rejects(()=>db.prepare("UPDATE bookings SET starts_at_utc=?,ends_at_utc=?,version=version+1 WHERE id=?").bind(at(DAY,'13:00'),at(DAY,'14:00'),group.id).run(),/current client version/);
 assert.equal((await db.prepare('SELECT status FROM bookings WHERE id=?').bind(group.id).first()).status,'CONFIRMED');
 await transitionBooking(db,group.id,'cancel',{actor:'COACH',now});
 assert.equal((await db.prepare('SELECT status FROM bookings WHERE id=?').bind(group.id).first()).status,'CANCELLED_COACH');
});
test('rolling old Client inserted booking receives a participant even after migration already ran',async()=>{
 const db=await setup();await db.prepare("INSERT INTO bookings(id,client_id,service_id,location_id,starts_at_utc,ends_at_utc,local_date,status,created_at,updated_at) VALUES('legacy','cl_a','svc_pt','loc_studio',?,?,'2025-08-18','CONFIRMED',?,?)").bind(start,start+3600000,now,now).run();
 assert.equal((await db.prepare("SELECT client_id FROM booking_participants WHERE booking_id='legacy'").first()).client_id,'cl_a');
});

test('public offer links actual active personal places and supports create and service conversion there',async()=>{
 const db=await setup();await db.prepare("INSERT INTO booking_locations(id,type,name_cs,active,created_at,updated_at) VALUES('outside','OUTDOORS','Outside',1,1,1),('retired','STUDIO','Retired',0,1,1)").run();
 await seedPublicOffer(db,now);
 const places=(await db.prepare("SELECT location_id FROM booking_service_locations WHERE service_id='web-pair' ORDER BY location_id").all()).results.map(x=>x.location_id);
 assert.deepEqual(places,['loc_studio','outside']);
 const initial=await createBooking(db,input());const changed=await rescheduleBooking(db,initial.id,{actor:'COACH',startsAt:start,serviceId:'web-pair',locationId:'loc_studio',clientIds:['cl_a','cl_b'],now});assert.equal(changed.location_id,'loc_studio');
 const created=await createBooking(db,input({serviceId:'web-small-group',locationId:'loc_studio',startsAt:at(DAY,'13:00'),clientIds:['cl_a','cl_b']}));assert.equal(created.location_id,'loc_studio');
 await db.prepare("DELETE FROM booking_service_locations WHERE service_id='web-pair'").run();await seedPublicOffer(db,now);assert.equal((await db.prepare("SELECT COUNT(*) n FROM booking_service_locations WHERE service_id='web-pair'").first()).n,0,'intentional empty place selection survives later imports');
});
test('repair of old offer without places preserves any already configured service places',async()=>{
 const db=await setup();await db.prepare("INSERT INTO booking_services(id,name_cs,capacity,created_at,updated_at) VALUES('web-pair','My pair',2,1,1),('web-individual','My session',1,1,1)").run();
 await db.prepare("INSERT INTO booking_service_locations(service_id,location_id) VALUES('web-individual','loc_online')").run();await seedPublicOffer(db,now);
 assert.deepEqual((await db.prepare("SELECT location_id FROM booking_service_locations WHERE service_id='web-individual'").all()).results.map(x=>x.location_id),['loc_online']);
 assert.deepEqual((await db.prepare("SELECT location_id FROM booking_service_locations WHERE service_id='web-pair'").all()).results.map(x=>x.location_id),['loc_studio']);
});
