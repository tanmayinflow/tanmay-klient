// A session occupies one coach interval; every participant owns a separate
// payment/credit record. All changes below commit in one guarded D1 batch.
import { ACTOR, ERR, BOOKING_STATUS as S, MS_PER_MIN, SLOT_GRID_MIN, DEFAULT_TIMEZONE, LEDGER_KIND, PAYMENT_STATUS, PAYMENT_METHOD, PACKAGE_STATUS } from "../../src/booking/types.js";
import { localDateISO, shiftDateISO, startOfISOWeek, startOfLocalDay, endOfLocalDay } from "../../src/booking/time.js";
import { protectedInterval, validateStart, slotsForDay } from "../../src/booking/slots.js";
import { allocatePackage, makeEntry, balanceOf } from "../../src/booking/credits.js";
import { transitionFor } from "../../src/booking/status.js";
import { BookingError, busyIntervals } from "./engine.js";
import * as R from "./repo.js";
const active = p => p.status === S.REQUESTED || p.status === S.CONFIRMED;
const fail = (code, detail) => { throw new BookingError(code, detail); };
const min = v => Number.isInteger(v) && v >= 1 && v <= 720;
const capacity = s => Math.max(1, Number(s.capacity) || 1);
const isSlotConflict = e => /booking_slot_locks/.test(String(e?.message));
const placeholders = a => a.map(() => '?').join(',');
const primaryFields = p => ({client_id:p.client_id, credit_cost_units:p.credit_cost_units, client_package_id:p.client_package_id,
  price_minor:p.price_minor, currency:p.currency, payment_status:p.payment_status, payment_method:p.payment_method});

async function assertClientAccess(db,input) {
  if((input.actor||ACTOR.CLIENT)!==ACTOR.CLIENT || !input.clientId)return;
  const client=await R.getClient(db,input.clientId);
  if(!client?.active)fail(ERR.NOT_AUTHORIZED,'inactive booking client');
  if(input.actorId && (client.account_user_id!==input.actorId || !await db.prepare('SELECT 1 FROM members WHERE user_id=?').bind(input.actorId).first()))fail(ERR.NOT_AUTHORIZED);
}

async function money(db, clientId, service, actor, now, previous, selectedPackage, sessionAt = now) {
  const client = await R.getClient(db, clientId);
  if (!client || !client.active) fail(ERR.NOT_FOUND, 'client');
  const units = Math.max(0, Number(service.credit_cost_units) || 0);
  const [packages, ledger] = await Promise.all([R.packagesWithServices(db, clientId), R.ledgerAll(db, clientId)]);
  const restored = previous && active(previous) && previous.credit_cost_units > 0
    ? [...ledger, {kind:LEDGER_KIND.RELEASE, units:Number(previous.credit_cost_units), client_package_id:previous.client_package_id}] : ledger;
  const prepaid = packages.filter(p=>p.package_definition_id!=='web-regular-four'||p.payment_status===PAYMENT_STATUS.PAID)
    .filter(p=>p.package_definition_id!=='web-regular-four'||((!p.valid_from||sessionAt>=p.valid_from)&&(!p.expires_at||sessionAt<p.expires_at)))
    .map(p=>p.package_definition_id==='web-regular-four'&&p.valid_from>now?{...p,valid_from:now}:p);
  const scoped = capacity(service)>1 ? prepaid.filter(p => p.eligible_service_ids?.includes(service.id)) : prepaid;
  const eligible = selectedPackage ? scoped.filter(p => p.id === selectedPackage) : scoped;
  const pkg = units > 0 ? allocatePackage(eligible, restored, {now, units, serviceId:service.id}) : null;
  if (selectedPackage && !pkg) fail(ERR.PACKAGE_EXPIRED, 'selected package is not eligible');
  if (units > 0 && !pkg && actor === ACTOR.CLIENT && !(service.price_minor > 0)) fail(balanceOf(restored).available < units ? ERR.INSUFFICIENT_CREDIT : ERR.PACKAGE_EXPIRED);
  return {client_id:clientId, credit_cost_units:pkg ? units : 0, client_package_id:pkg?.id || null,
    price_minor:pkg ? 0 : Number(service.price_minor) || 0, currency:service.currency || 'CZK',
    payment_status:pkg ? PAYMENT_STATUS.FROM_PACKAGE : PAYMENT_STATUS.OPEN,
    payment_method:pkg ? PAYMENT_METHOD.PACKAGE : PAYMENT_METHOD.NONE, client_note:previous?.client_note || '',
    previous: previous && active(previous) ? previous : null, package:pkg, service_id:service.id, sessionAt, checkAt:pkg?.package_definition_id==='web-regular-four'?sessionAt:now,
    refundAvailable: previous && packages.some(p=>p.id===previous.client_package_id && ((p.expires_at&&p.expires_at<=now)||p.status===PACKAGE_STATUS.EXPIRED)) ? 0 : Number(previous?.credit_cost_units)||0};
}

// Both the account and selected package balances are checked in the write
// transaction. A stale preflight may never overdraw a shared package.
function moneyGuards(plans,input) {
  const sql=[], args=[];
  if((input.actor||ACTOR.CLIENT)===ACTOR.CLIENT && input.clientId){
    sql.push('EXISTS(SELECT 1 FROM booking_clients WHERE id=? AND active=1'+(input.actorId?' AND account_user_id=?':'')+')');
    args.push(input.clientId);if(input.actorId)args.push(input.actorId);
    if(input.actorId){sql.push('EXISTS(SELECT 1 FROM members WHERE user_id=?)');args.push(input.actorId);}
  }
  for (const p of plans) {
    if (!p.credit_cost_units || p.retain) continue;
    const old=p.previous, refund=p.refundAvailable ?? (Number(old?.credit_cost_units)||0);
    sql.push('(SELECT COALESCE(SUM(units),0) FROM credit_ledger WHERE client_id=?) + ? >= ?');
    args.push(p.client_id,refund,p.credit_cost_units);
    sql.push('(SELECT COALESCE(SUM(units),0) FROM credit_ledger WHERE client_id=? AND client_package_id=?) + ? >= ?');
    args.push(p.client_id,p.client_package_id,old?.client_package_id===p.client_package_id ? refund : 0,p.credit_cost_units);
    sql.push("EXISTS(SELECT 1 FROM client_packages cp WHERE cp.id=? AND cp.client_id=? AND cp.status='ACTIVE' AND (cp.package_definition_id!='web-regular-four' OR cp.package_definition_id IS NULL OR cp.payment_status='PAID') AND (cp.valid_from IS NULL OR cp.valid_from<=?) AND (cp.expires_at IS NULL OR cp.expires_at>?))");
    args.push(p.client_package_id,p.client_id,p.checkAt,p.checkAt);
  }
  return {sql:sql.length ? ' AND '+sql.join(' AND ') : '',args};
}
const guard = 'EXISTS (SELECT 1 FROM bookings WHERE id=? AND version=? AND updated_at=? AND mutation_token=?)';
function ledgerStmt(db, b, p, kind, units, suffix, actor, at) {
  const entry=makeEntry({id:R.newId('cl'),client_id:p.client_id,client_package_id:p.client_package_id,booking_id:b.id,
    kind,units,created_by:actor,created_at:at,reason:suffix==='hold'?'':'Úprava rezervace',
    idempotency_key:b.id+':'+suffix+':'+b.version+':'+p.client_id});
  return db.prepare(`INSERT INTO credit_ledger
    (id,client_id,client_package_id,booking_id,kind,units,reason,created_by,created_at,idempotency_key)
    SELECT ?,?,?,?,?,?,?,?,?,? WHERE ${guard} ON CONFLICT(idempotency_key) DO NOTHING`)
    .bind(entry.id,entry.client_id,entry.client_package_id,entry.booking_id,entry.kind,entry.units,entry.reason,entry.created_by,entry.created_at,entry.idempotency_key,b.id,b.version,b.updated_at,b.mutation_token);
}
function participantStmt(db,b,p) {
  return db.prepare(`INSERT INTO booking_participants
    (booking_id,client_id,status,credit_cost_units,client_package_id,price_minor,currency,payment_status,payment_method,client_note,updated_at)
    SELECT ?,?,?,?,?,?,?,?,?,?,? WHERE ${guard}
    ON CONFLICT(booking_id,client_id) DO UPDATE SET status=excluded.status,credit_cost_units=excluded.credit_cost_units,
      client_package_id=excluded.client_package_id,price_minor=excluded.price_minor,currency=excluded.currency,
      payment_status=excluded.payment_status,payment_method=excluded.payment_method,client_note=excluded.client_note,updated_at=excluded.updated_at`)
    .bind(b.id,p.client_id,p.status||b.status,p.credit_cost_units,p.client_package_id,p.price_minor,p.currency,p.payment_status,p.payment_method,p.client_note||'',b.updated_at,b.id,b.version,b.updated_at,b.mutation_token);
}
async function changesAfter(db,b,plans,old,actor) {
  const stmts=[];
  for (const p of old.filter(active)) {
    if (p.credit_cost_units>0 && !plans.some(n=>n.client_id===p.client_id&&n.retain)) {
      stmts.push(ledgerStmt(db,b,p,LEDGER_KIND.RELEASE,p.credit_cost_units,'edit-release',actor,b.updated_at));
      const pkg = p.client_package_id ? await db.prepare('SELECT status,expires_at FROM client_packages WHERE id=?').bind(p.client_package_id).first() : null;
      if (pkg && ((pkg.expires_at && pkg.expires_at<=b.updated_at) || pkg.status===PACKAGE_STATUS.EXPIRED)) stmts.push(ledgerStmt(db,b,p,LEDGER_KIND.EXPIRY,p.credit_cost_units,'edit-expiry',actor,b.updated_at));
    }
    if (!plans.some(n=>n.client_id===p.client_id)) stmts.push(participantStmt(db,b,{...p,status:S.CANCELLED_COACH}));
  }
  for(const p of plans) {
    stmts.push(participantStmt(db,b,{...p,status:b.status}));
    if(p.credit_cost_units>0 && !p.retain) stmts.push(ledgerStmt(db,b,p,LEDGER_KIND.HOLD,p.credit_cost_units,'hold',actor,b.updated_at));
  }
  stmts.push(R.stInsertEventIfState(db,{id:R.newId('ev'),booking_id:b.id,type:old.length?'RESCHEDULED':'CREATED',actor_type:actor,created_at:b.updated_at,
    payload:{startsAt:b.starts_at_utc,endsAt:b.ends_at_utc,serviceId:b.service_id,clientIds:plans.map(p=>p.client_id)}},b.version,b.status,b.mutation_token));
  stmts.push(R.stOutboxIfState(db,{id:R.newId('ob'),booking_id:b.id,action:old.length?'UPDATE':'CREATE',booking_version:b.version,next_attempt_at:Date.now(),created_at:b.updated_at},b.version,b.status,b.mutation_token));
  return stmts;
}
async function spec(db,input,previous=null) {
  const actor=input.actor||ACTOR.CLIENT, now=Number(input.now)||Date.now();
  if(actor!==ACTOR.COACH && (input.durationMin!==undefined || input.clientIds!==undefined || input.adminOverride || (previous && input.serviceId && input.serviceId!==previous.service_id))) fail(ERR.NOT_AUTHORIZED);
  const service=await R.getService(db,input.serviceId || previous?.service_id);
  if(!service || !service.active) fail(ERR.NOT_FOUND,'service');
  if(actor===ACTOR.CLIENT && !service.client_visible) fail(ERR.NOT_AUTHORIZED,'service');
  const locationId=input.locationId!==undefined ? input.locationId : previous?.location_id || null;
  const location=locationId ? await R.getLocation(db,locationId) : null;
  if(locationId && (!location || !location.active)) fail(ERR.NOT_FOUND,'location');
  if(!await R.serviceAllowsLocation(db,service.id,locationId)) fail(ERR.VALIDATION_ERROR,'location');
  const startsAt=Number(input.startsAt), stored=previous ? (previous.ends_at_utc-previous.starts_at_utc)/MS_PER_MIN : service.duration_min;
  const duration=input.durationMin===undefined ? stored : input.durationMin;
  if(!Number.isFinite(startsAt)||startsAt % MS_PER_MIN || !min(duration)) fail(ERR.VALIDATION_ERROR,'time or durationMin');
  if(actor!==ACTOR.COACH && startsAt % (SLOT_GRID_MIN*MS_PER_MIN)) fail(ERR.VALIDATION_ERROR,'startsAt');
  const override=actor===ACTOR.COACH && !!input.adminOverride;
  if(override && !String(input.overrideReason||'').trim()) fail(ERR.VALIDATION_ERROR,'overrideReason');
  const endsAt=startsAt+duration*MS_PER_MIN,tz=location?.timezone||previous?.timezone||input.timezone||DEFAULT_TIMEZONE, date=localDateISO(startsAt,tz);
  return {actor,now,service,location,locationId,startsAt,endsAt,duration,tz,date,override};
}
async function checkTime(db,x,input,previous=null) {
  const {actor,service,startsAt,endsAt,tz,date,now,location,duration,override}=x;
  const [rules,overrides,busy]=await Promise.all([R.listRules(db),R.listOverrides(db,shiftDateISO(date,-1),shiftDateISO(date,1)),busyIntervals(db,startsAt-12*3600000,endsAt+12*3600000,{excludeBookingId:previous?.id,extraBusy:input.googleBusy})]);
  const prot=protectedInterval(startsAt,endsAt,service,location);
  // Explicit coach placement bypasses offered-hour rules, never another
  // person's booking, time off or an externally occupied calendar interval.
  if(override && busy.some(w=>w.e>prot.s && w.s<prot.e)) fail(ERR.SLOT_TAKEN);
  if(!override) {
    const week=startOfISOWeek(date);
    const dayCount=service.daily_limit ? Math.max(0,await R.countActiveOnDate(db,date,service.id)-(previous?.local_date===date && previous.service_id===service.id?1:0)):0;
    const weekCount=service.weekly_limit ? Math.max(0,await R.countActiveBetween(db,startOfLocalDay(week,tz),endOfLocalDay(shiftDateISO(week,6),tz),service.id)-(previous&&previous.service_id===service.id&&startOfISOWeek(previous.local_date)===week?1:0)):0;
    const bad=validateStart(startsAt,{now,tz,service:{...service,duration_min:duration},location,rules,overrides,busy,dayCount,weekCount});
    if(bad) fail(bad);
    if(actor===ACTOR.CLIENT && !slotsForDay(date,{now,tz,service:{...service,duration_min:duration},location,rules,overrides,busy,dayCount,weekCount}).some(slot=>slot.start===startsAt)) fail(ERR.OUTSIDE_AVAILABILITY);
  }
  if(actor===ACTOR.CLIENT && previous && !input.joinGroup && now>previous.starts_at_utc-service.cancel_before_min*MS_PER_MIN) fail(ERR.CANCELLATION_CLOSED);
  return prot;
}
function idsFor(input,previous) {
  if(input.clientIds!==undefined && (!Array.isArray(input.clientIds) || !input.clientIds.length || input.clientIds.some(id=>typeof id!=='string'||!id))) fail(ERR.VALIDATION_ERROR,'clientIds');
  const ids=input.clientIds || (previous ? previous.filter(active).map(p=>p.client_id) : [input.clientId]);
  if(!ids.length || new Set(ids).size!==ids.length) fail(ERR.VALIDATION_ERROR,'clientIds');
  return ids;
}

// The earlier availability read gives a useful message, but another session
// can claim the last daily/weekly opening before this write reaches D1.
function serviceQuota(db,session,excludeId) {
  if(session.override)return {guard:'',args:[],reason:async()=>null};
  const week=startOfISOWeek(session.date);
  const sql=`SELECT CASE
    WHEN s.daily_limit>0 AND (SELECT COUNT(*) FROM bookings b WHERE b.service_id=s.id AND b.id<>?
      AND b.status IN ('REQUESTED','CONFIRMED') AND b.local_date=?)>=s.daily_limit THEN 'DAILY_LIMIT'
    WHEN s.weekly_limit>0 AND (SELECT COUNT(*) FROM bookings b WHERE b.service_id=s.id AND b.id<>?
      AND b.status IN ('REQUESTED','CONFIRMED') AND b.starts_at_utc>=? AND b.starts_at_utc<?)>=s.weekly_limit THEN 'WEEKLY_LIMIT'
    ELSE '' END AS reason FROM booking_services s WHERE s.id=?`;
  const args=[excludeId,session.date,excludeId,startOfLocalDay(week,session.tz),startOfLocalDay(shiftDateISO(week,7),session.tz),session.service.id];
  return {guard:` AND (${sql})=''`,args,reason:async()=> (await db.prepare(sql).bind(...args).first())?.reason};
}
export async function createManagedBooking(db,input) {
  await assertClientAccess(db,input);
  if(input.groupBookingId) return joinGroup(db,input);
  const x=await spec(db,input),ids=idsFor(input);
  if(ids.length>capacity(x.service)) fail(ERR.VALIDATION_ERROR,'capacity');
  const prot=await checkTime(db,x,input), plans=[];
  for(const id of ids) plans.push(await money(db,id,x.service,x.actor,x.now,null,id===input.clientId ? input.clientPackageId : null,x.startsAt));
  const p=plans[0],at=x.now;
  p.client_note=String(input.clientNote||'').slice(0,1000);
  const b={id:input.id||R.newId('bk'),...primaryFields(p),service_id:x.service.id,location_id:x.locationId,
    starts_at_utc:x.startsAt,ends_at_utc:x.endsAt,timezone:x.tz,local_date:x.date,
    status:x.service.confirmation_mode==='AUTO'&&ids.length>=(Number(x.service.min_participants)||1)?S.CONFIRMED:S.REQUESTED,confirmation_mode:x.service.confirmation_mode,
    client_note:p.client_note,coach_note_private:x.actor===ACTOR.COACH?String(input.coachNote||'').slice(0,4000):'',meeting_url:x.location?.online_url||'',
    plan_id:input.planId||null,workout_template_id:input.workoutTemplateId||null,sync_status:'PENDING',version:1,mutation_token:R.newId('mutation'),created_by:x.actor,created_at:at,updated_at:at};
  const g=moneyGuards(plans,input),quota=serviceQuota(db,x,b.id),keys=Object.keys(b);
  const stmts=[db.prepare(`INSERT INTO bookings (${keys.join(',')}) SELECT ${placeholders(keys)} WHERE NOT EXISTS
    (SELECT 1 FROM booking_blocks WHERE ends_at_utc>? AND starts_at_utc<?)${g.sql}${quota.guard}`).bind(...keys.map(k=>b[k]),prot.s,prot.e,...g.args,...quota.args),...await changesAfter(db,b,plans,[],x.actor)];
  if(x.override) stmts.push(R.stInsertEventIfState(db,{id:R.newId('ev'),booking_id:b.id,type:'ADMIN_OVERRIDE',actor_type:x.actor,actor_id:input.actorId||'',created_at:at,payload:{reason:String(input.overrideReason).slice(0,300)}},b.version,b.status,b.mutation_token));
  let result;try {stmts.splice(1,0,db.prepare("SELECT changes() AS changed"),db.prepare("SELECT EXISTS(SELECT 1 FROM booking_blocks WHERE ends_at_utc>? AND starts_at_utc<?) AS blocked").bind(prot.s,prot.e)); result=await db.batch(stmts);} catch(e){if(isSlotConflict(e)) fail(ERR.SLOT_TAKEN);throw e;}
  if(!result[1]?.results?.[0]?.changed){await assertClientAccess(db,input);fail(result[2]?.results?.[0]?.blocked ? ERR.SLOT_TAKEN : await quota.reason() || ERR.INSUFFICIENT_CREDIT);}
  return R.getBooking(db,b.id);
}
export async function rescheduleManagedBooking(db,id,input) {
  await assertClientAccess(db,input);
  const old=await R.getBooking(db,id);if(!old)fail(ERR.NOT_FOUND);
  for(const [f,col] of [['expectedVersion','version'],['expectedStartsAt','starts_at_utc'],['expectedUpdatedAt','updated_at']]) if(input[f]!==undefined){if(!Number.isFinite(input[f]))fail(ERR.VALIDATION_ERROR,f);if(input[f]!==Number(old[col]))fail(ERR.BOOKING_CHANGED);}
  const actor=input.actor||ACTOR.CLIENT, participants=await R.participantsForBooking(db,old);
  if(!transitionFor(old.status,'reschedule',actor))fail(ERR.INVALID_TRANSITION);
  if(actor===ACTOR.CLIENT && input.clientId && !participants.some(p=>p.client_id===input.clientId&&active(p)))fail(ERR.NOT_AUTHORIZED);
  if(actor===ACTOR.CLIENT && (participants.filter(active).length>1 || capacity(await R.getService(db,old.service_id))>1))fail(ERR.NOT_AUTHORIZED,'group time is managed by coach');
  const x=await spec(db,input,old),ids=idsFor(input,participants);
  if(ids.length>capacity(x.service))fail(ERR.VALIDATION_ERROR,'capacity');
  if(old.status===S.CONFIRMED && ids.length<(Number(x.service.min_participants)||1))fail(ERR.VALIDATION_ERROR,'min_participants');
  const prot=await checkTime(db,x,input,old),plans=[];
  for(const clientId of ids) {
    const previous=participants.find(p=>p.client_id===clientId&&active(p));
    let retain=previous&&old.service_id===x.service.id;
    if(retain && previous.client_package_id) {
      const pkg=await db.prepare('SELECT * FROM client_packages WHERE id=?').bind(previous.client_package_id).first();
      if(pkg?.package_definition_id==='web-regular-four' && (pkg.payment_status!==PAYMENT_STATUS.PAID || x.startsAt<pkg.valid_from || x.startsAt>=pkg.expires_at)) {
        if(actor===ACTOR.CLIENT)fail(ERR.PACKAGE_EXPIRED,'outside prepaid month');
        retain=false;
      }
    }
    plans.push(retain ? {...previous,previous,retain:true} : await money(db,clientId,x.service,actor,x.now,previous,undefined,x.startsAt));
  }
  const b={...old,mutation_token:R.newId('mutation'),...primaryFields(plans[0]),service_id:x.service.id,location_id:x.locationId,starts_at_utc:x.startsAt,ends_at_utc:x.endsAt,
    client_note:plans[0].client_note||'',local_date:x.date,timezone:x.tz,meeting_url:x.location?.online_url||old.meeting_url,sync_status:'PENDING',version:Number(old.version)+1,updated_at:Math.max(x.now,Number(old.updated_at)+1)};
  const keys=['client_id','credit_cost_units','client_package_id','price_minor','currency','payment_status','payment_method','service_id','location_id','starts_at_utc','ends_at_utc','client_note','local_date','timezone','meeting_url','sync_status','version','updated_at','mutation_token'];
  const g=moneyGuards(plans,input),quota=serviceQuota(db,x,id),stmts=[db.prepare(`UPDATE bookings SET ${keys.map(k=>k+'=?').join(',')} WHERE id=? AND version=? AND updated_at=? AND status=?
    AND NOT EXISTS(SELECT 1 FROM booking_blocks WHERE ends_at_utc>? AND starts_at_utc<?)${g.sql}${quota.guard}`).bind(...keys.map(k=>b[k]),id,old.version,old.updated_at,old.status,prot.s,prot.e,...g.args,...quota.args),
    db.prepare(`DELETE FROM booking_slot_locks WHERE booking_id=? AND ${guard}`).bind(id,id,b.version,b.updated_at,b.mutation_token),...await changesAfter(db,b,plans,participants,actor)];
  if(x.override)stmts.push(R.stInsertEventIfState(db,{id:R.newId('ev'),booking_id:id,type:'ADMIN_OVERRIDE',actor_type:actor,created_at:b.updated_at,payload:{reason:String(input.overrideReason).slice(0,300)}},b.version,b.status,b.mutation_token));
  let result;try{stmts.splice(1,0,db.prepare("SELECT changes() AS changed"),db.prepare("SELECT EXISTS(SELECT 1 FROM booking_blocks WHERE ends_at_utc>? AND starts_at_utc<?) AS blocked").bind(prot.s,prot.e)); result=await db.batch(stmts);}catch(e){if(isSlotConflict(e))fail(ERR.SLOT_TAKEN);throw e;}
  if(!result[1]?.results?.[0]?.changed){await assertClientAccess(db,input);const current=await R.getBooking(db,id);if(current.version!==old.version||current.updated_at!==old.updated_at)fail(ERR.BOOKING_CHANGED);fail(result[2]?.results?.[0]?.blocked ? ERR.SLOT_TAKEN : await quota.reason() || ERR.INSUFFICIENT_CREDIT);}
  return R.getBooking(db,id);
}

export async function groupSlots(db,input,regular) {
  const service=await R.getService(db,input.serviceId);
  if(capacity(service)<=1 || input.excludeBookingId)return regular;
  const from=startOfLocalDay(regular.from,regular.timezone),to=endOfLocalDay(regular.to,regular.timezone);
  for(const b of await R.bookingsBetween(db,from,to)) {
    if(!active(b)||b.service_id!==service.id||(b.location_id||null)!==(input.locationId||null))continue;
    const members=await R.participantsForBooking(db,b);
    if(members.filter(active).length>=capacity(service)||members.some(p=>p.client_id===input.clientId&&p.status!==S.CANCELLED_CLIENT))continue;
    // Joining is still limited to currently offered slots, notice and rules.
    const x=await spec(db,{...input,startsAt:b.starts_at_utc,actor:ACTOR.CLIENT},null);
    if(x.endsAt!==b.ends_at_utc)continue;
    try{await checkTime(db,x,{...input,joinGroup:true},b);}catch{continue;}
    const day=regular.days.find(d=>d.date===b.local_date);
    if(day)day.slots.push({start:b.starts_at_utc,end:b.ends_at_utc,groupBookingId:b.id,remainingCapacity:capacity(service)-members.filter(active).length});
  }
  for(const d of regular.days)d.slots.sort((a,b)=>a.start-b.start);
  return regular;
}
async function joinGroup(db,input) {
  if((input.actor||ACTOR.CLIENT)!==ACTOR.CLIENT)fail(ERR.NOT_AUTHORIZED);
  const b=await R.getBooking(db,input.groupBookingId);
  if(!b||!active(b)||b.service_id!==input.serviceId||(b.location_id||null)!==(input.locationId||null)||b.starts_at_utc!==Number(input.startsAt))fail(ERR.SLOT_TAKEN);
  const members=await R.participantsForBooking(db,b),x=await spec(db,input);
  if(capacity(x.service)<=1||x.endsAt!==b.ends_at_utc||members.some(p=>p.client_id===input.clientId&&p.status!==S.CANCELLED_CLIENT))fail(ERR.SLOT_TAKEN);
  const prot=await checkTime(db,x,{...input,joinGroup:true},b),p=await money(db,input.clientId,x.service,ACTOR.CLIENT,x.now,undefined,undefined,x.startsAt);
  p.client_note=String(input.clientNote||'').slice(0,1000);
  const next={...b,mutation_token:R.newId('mutation'),version:b.version+1,updated_at:Math.max(x.now,b.updated_at+1),status:x.service.confirmation_mode==='AUTO'&&members.filter(active).length+1>=(Number(x.service.min_participants)||1)?S.CONFIRMED:b.status},g=moneyGuards([p],input);
  const stmts=[db.prepare(`UPDATE bookings SET version=?,updated_at=?,mutation_token=?,status=?,sync_status='PENDING' WHERE id=? AND version=? AND status=?
    AND (SELECT COUNT(*) FROM booking_participants WHERE booking_id=? AND status IN ('REQUESTED','CONFIRMED')) < (SELECT capacity FROM booking_services WHERE id=?)
    AND NOT EXISTS(SELECT 1 FROM booking_participants WHERE booking_id=? AND client_id=? AND status<>'CANCELLED_CLIENT')
    AND NOT EXISTS(SELECT 1 FROM booking_blocks WHERE ends_at_utc>? AND starts_at_utc<?)${g.sql}`)
    .bind(next.version,next.updated_at,next.mutation_token,next.status,b.id,b.version,b.status,b.id,x.service.id,b.id,input.clientId,prot.s,prot.e,...g.args),participantStmt(db,next,p)];
  if(p.credit_cost_units>0)stmts.push(ledgerStmt(db,next,p,LEDGER_KIND.HOLD,p.credit_cost_units,'hold',ACTOR.CLIENT,next.updated_at));
  stmts.push(R.stInsertEventIfState(db,{id:R.newId('ev'),booking_id:b.id,type:'PARTICIPANT_ADDED',actor_type:ACTOR.CLIENT,actor_id:input.actorId||'',created_at:next.updated_at,payload:{clientId:input.clientId}},next.version,next.status,next.mutation_token));
  stmts.push(db.prepare(`UPDATE booking_participants SET status=?,updated_at=? WHERE booking_id=? AND status='REQUESTED' AND ${guard}`).bind(next.status,next.updated_at,b.id,b.id,next.version,next.updated_at,next.mutation_token));
  stmts.push(R.stOutboxIfState(db,{id:R.newId('ob'),booking_id:b.id,action:'UPDATE',booking_version:next.version,next_attempt_at:Date.now(),created_at:next.updated_at},next.version,next.status,next.mutation_token));
  stmts.splice(1,0,db.prepare("SELECT changes() AS changed")); const result=await db.batch(stmts);if(!result[1]?.results?.[0]?.changed){await assertClientAccess(db,input);fail(ERR.SLOT_TAKEN);}
  return R.getBooking(db,b.id);
}

export async function cancelParticipation(db,b,input) {
  const members=await R.participantsForBooking(db,b),p=members.find(p=>p.client_id===input.clientId);
  if(!p||!active(p))fail(ERR.INVALID_TRANSITION);
  const service=await R.getService(db,b.service_id),now=Number(input.now)||Date.now();
  const late=p.status===S.CONFIRMED && now>b.starts_at_utc-service.cancel_before_min*MS_PER_MIN;
  const status=late?S.LATE_CANCEL:S.CANCELLED_CLIENT,remaining=members.filter(q=>q.client_id!==p.client_id&&active(q));
  const next={...b,...(remaining.length ? primaryFields(remaining[0]) : {}),client_note:remaining[0]?.client_note||b.client_note,mutation_token:R.newId('mutation'),version:b.version+1,updated_at:Math.max(now,b.updated_at+1),status:remaining.length?b.status:status};
  const stmts=[db.prepare('UPDATE bookings SET status=?,version=?,updated_at=?,mutation_token=?,sync_status=?,client_id=?,credit_cost_units=?,client_package_id=?,price_minor=?,payment_status=?,payment_method=?,client_note=? WHERE id=? AND version=? AND status=?')
    .bind(next.status,next.version,next.updated_at,next.mutation_token,'PENDING',next.client_id,next.credit_cost_units,next.client_package_id,next.price_minor,next.payment_status,next.payment_method,next.client_note,b.id,b.version,b.status),participantStmt(db,next,{...p,status})];
  if(p.credit_cost_units>0){
    stmts.push(ledgerStmt(db,next,p,LEDGER_KIND.RELEASE,p.credit_cost_units,'cancel-release',ACTOR.CLIENT,now));
    if(late&&!service.late_cancel_refunds)stmts.push(ledgerStmt(db,next,p,LEDGER_KIND.CONSUME,p.credit_cost_units,'cancel-consume',ACTOR.CLIENT,now));
    else if(p.client_package_id){const pkg=await db.prepare('SELECT expires_at,status FROM client_packages WHERE id=?').bind(p.client_package_id).first();if(pkg&&((pkg.expires_at&&pkg.expires_at<=now)||pkg.status===PACKAGE_STATUS.EXPIRED))stmts.push(ledgerStmt(db,next,p,LEDGER_KIND.EXPIRY,p.credit_cost_units,'cancel-expiry',ACTOR.CLIENT,now));}
  }
  stmts.push(R.stInsertEventIfState(db,{id:R.newId('ev'),booking_id:b.id,type:'PARTICIPANT_CANCELLED',actor_type:ACTOR.CLIENT,actor_id:input.actorId||'',created_at:now,payload:{clientId:p.client_id,status,reason:input.reason||''}},next.version,next.status,next.mutation_token));
  stmts.push(R.stOutboxIfState(db,{id:R.newId('ob'),booking_id:b.id,action:remaining.length?'UPDATE':'CANCEL',booking_version:next.version,next_attempt_at:Date.now(),created_at:now},next.version,next.status,next.mutation_token));
  stmts.splice(1,0,db.prepare("SELECT changes() AS changed")); const result=await db.batch(stmts);if(!result[1]?.results?.[0]?.changed)fail(ERR.BOOKING_CHANGED);
  return R.getBooking(db,b.id);
}
