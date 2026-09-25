import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { handleTogether } from '../src/shared/product/togetherApi.js';
import { cleanTogether,emptyTogether,cycleSummary,addDays,validDate,togetherProjection } from '../src/shared/product/together.js';
import { navigationRooms,updatePlacement,MAIN_ROOMS,CLIENT_ROOMS } from '../src/shared/product/navigation.js';
import worker from '../worker/index.js';
import {cyclePhase} from '../src/shared/product/togetherGuidance.js';
import {moonToday} from '../src/shared/product/togetherMoon.js';
import {cleanPartnerPages} from '../src/shared/product/togetherPages.js';

const now=Date.parse('2026-09-24T12:00:00Z');
function fixture(){
  const sql=new DatabaseSync(':memory:');
  const db={prepare(query){const stmt=args=>({bind:(...a)=>stmt(a),run:async()=>({meta:sql.prepare(query).run(...args)}),first:async()=>sql.prepare(query).get(...args)||null,all:async()=>({results:sql.prepare(query).all(...args)})});return stmt([]);}};
  const call=async(actor,path='',body,options={})=>{
    const method=body===undefined?'GET':['invite','claim','disconnect'].includes(path)?'POST':'PUT';
    const r=await handleTogether(new Request('https://test.local/api/together'+(path?'/'+path:''),{method,headers:body===undefined?{}:{'Content-Type':'application/json','Origin':'https://test.local'},body:body===undefined?undefined:JSON.stringify(body)}),db,actor,{owner:actor.startsWith('client:'),now,...options});
    return {status:r.status,headers:r.headers,...await r.json()};
  };
  const pair=async(scopes=[])=>{const invite=await call('client:a','invite',{});assert.equal(invite.status,200);assert.equal((await call('coach:tanmay','claim',{code:invite.code})).status,200);const d=await call('client:a');assert.equal((await call('client:a','sharing',{scopes,revision:d.link.revision})).status,200);return invite;};
  return {sql,db,call,pair};
}
test('phases distinguish recorded bleeding, optional estimates and unknown states',()=>{
  const doc={...emptyTogether(),mode:'estimate',periods:[{start:'2026-09-01',end:'2026-09-05'}]};
  const phase=date=>cyclePhase(doc,cycleSummary(doc,date),date);
  assert.deepEqual(phase('2026-09-03'),{id:'menstrual',basis:'recorded'});
  assert.equal(phase('2026-09-08').id,'follicular');assert.equal(phase('2026-09-14').id,'ovulatory');assert.equal(phase('2026-09-22').id,'luteal');
  assert.equal(phase('2026-10-10').id,null);doc.mode='observe';assert.equal(phase('2026-09-14').id,null);doc.mode='paused';assert.equal(phase('2026-09-03').id,null);
  doc.mode='estimate';doc.usualLength=80;assert.equal(phase('2026-09-14').id,null);
  assert.equal(togetherProjection(doc,['cycle'],'2026-09-03').phase,undefined);
  assert.equal(togetherProjection(doc,['phase'],'2026-09-03').phase.id,'menstrual');
  assert.equal(togetherProjection(doc,['phase'],'2026-09-03').cycle,undefined);
});
test('astronomical lunar model follows known new/full moons and advances dates',()=>{
  const eclipse=moonToday(new Date('2024-04-08T18:21:00Z'));
  assert.ok(eclipse.phase<.002||eclipse.phase>.998);assert.equal(eclipse.light,0);
  const full=moonToday(new Date('2024-03-25T07:00:00Z'));
  assert.ok(Math.abs(full.phase-.5)<.002);assert.equal(full.light,100);assert.equal(full.index,4);
  assert.ok(new Date(full.next)>new Date('2024-03-25T07:00:00Z'));
  assert.notEqual(moonToday(new Date('2026-09-24T12:00:00Z')).index,moonToday(new Date('2026-10-05T12:00:00Z')).index);
});
test('page access is explicitly granted, read only, scoped to a pair and revocable',async()=>{
  const {call,pair}=fixture();await pair();
  let coach=await call('coach:tanmay');assert.deepEqual(coach.sharedPages.rooms,[]);
  const payload={rooms:['praxe'],pages:{praxe:[{title:'Walk',detail:'done',note:'SECRET',lines:['7 days']}],journal:[{title:'SECRET'}]},revision:0,linkId:coach.link.id,linkRevision:coach.link.revision};
  assert.equal((await call('client:a','pages-sharing',payload)).status,403);
  assert.equal((await call('coach:tanmay','pages-sharing',payload)).status,200);
  let partner=await call('client:a');assert.deepEqual(partner.sharedPages.rooms,['praxe']);assert.equal(JSON.stringify(partner.sharedPages).includes('SECRET'),false);
  assert.equal((await call('client:b','pages')).status,403);assert.deepEqual((await call('client:b')).sharedPages.rooms,[]);
  assert.equal((await call('client:a','pages',{...payload,revision:1})).status,403);
  assert.equal((await call('coach:tanmay','pages-sharing',payload)).status,409);
  const old={...payload,revision:1};
  assert.equal((await call('coach:tanmay','pages-sharing',{...old,rooms:[],pages:{}})).status,200);
  assert.deepEqual((await call('client:a')).sharedPages.pages,{});
  assert.equal((await call('coach:tanmay','pages',old)).status,409);
  assert.equal((await call('coach:tanmay','pages-sharing',{...payload,revision:2,rooms:['journal']})).status,400);
  assert.equal((await call('client:a','disconnect',{revision:partner.link.revision})).status,200);
  assert.equal((await call('coach:tanmay','pages',old)).status,403);
  await pair();assert.deepEqual((await call('client:a')).sharedPages.rooms,[]);
  assert.equal((await call('coach:tanmay','pages-sharing',old)).status,409);
  assert.throws(()=>cleanPartnerPages({praxe:'bad'},['praxe']));
});
test('actual dates, leap days and cycle variability have explicit limits',()=>{
  assert.equal(validDate('2026-02-29'),false);assert.equal(addDays('2024-02-28',1),'2024-02-29');assert.equal(addDays('2026-03-28',2),'2026-03-30');
  const d=emptyTogether();d.periods=[{start:'2026-08-01',end:'2026-08-05'},{start:'2026-08-29',end:'2026-09-02'}];
  assert.equal(cycleSummary(d,'2026-09-24').next,null);d.mode='estimate';
  assert.deepEqual(cycleSummary(d,'2026-09-24').next,{from:'2026-09-22',to:'2026-09-30',basedOn:'history'});
  assert.equal(cycleSummary(d,'2026-10-02').reason,'outdated');d.periods.push({start:'2026-10-09'});assert.equal(cycleSummary(d,'2026-10-10').reason,'variable');
  assert.throws(()=>cleanTogether({...d,periods:[{start:'2027-01-01'}]},'2026-09-24'));
  assert.throws(()=>cleanTogether({...d,periods:[{start:'2026-08-01',end:'2026-08-05'},{start:'2026-08-04'}]}));
  assert.throws(()=>cleanTogether({...d,days:[]}));assert.throws(()=>cleanTogether({...d,periods:[null]}));
});
test('projection is an allowlist and private symptoms/history never escape',()=>{
  const d={...emptyTogether(),days:{'2026-09-24':{energy:2,mood:'tired',support:'tea',pain:'strong',flow:'heavy',note:'SECRET'}}};
  assert.deepEqual(togetherProjection(d,[],'2026-09-24'),{});
  const projected=togetherProjection(d,['cycle','wellbeing','support'],'2026-09-24');assert.equal(JSON.stringify(projected).includes('SECRET'),false);assert.equal(projected.wellbeing.energy,2);assert.equal(projected.support.text,'tea');assert.equal(projected.pain,undefined);
});
test('pairing requires owner confirmation, scopes, isolated identities and hashed one-use code',async()=>{
  const {call,sql}=fixture();const doc={...emptyTogether(),periods:[{start:'2026-09-04',end:'2026-09-08'}],days:{'2026-09-24':{energy:2,mood:'tired',note:'PRIVATE',support:'tea'}}};
  assert.equal((await call('client:a','self',{doc,revision:0})).status,200);
  assert.equal((await call('coach:tanmay','self',{doc,revision:0})).status,403);
  assert.equal((await call('coach:tanmay','invite',{})).status,403);
  const invite=await call('client:a','invite',{});assert.match(invite.code,/^[a-f0-9]{40}$/);assert.notEqual(sql.prepare('SELECT token_hash FROM together_links').get().token_hash,invite.code);
  assert.equal((await call('coach:tanmay','claim',{code:invite.code})).status,200);
  assert.equal((await call('coach:other','claim',{code:invite.code})).ok,false);
  let v=await call('coach:tanmay');assert.equal(v.link.status,'pending');assert.equal(v.partner,null);
  const own=await call('client:a');assert.equal((await call('coach:tanmay','sharing',{scopes:['cycle'],revision:own.link.revision})).status,403);
  assert.equal((await call('client:a','sharing',{scopes:['cycle','support'],revision:own.link.revision})).status,200);
  v=await call('coach:tanmay');assert.equal(v.partner.cycle.day,21);assert.equal(v.partner.support.text,'tea');assert.equal(v.partner.wellbeing,undefined);assert.equal(JSON.stringify(v).includes('PRIVATE'),false);assert.match(v.headers.get('Cache-Control'),/no-store/);
  const outsider=await call('client:b');assert.equal(outsider.partner,null);assert.equal(outsider.link,null);assert.equal(JSON.stringify(outsider).includes('PRIVATE'),false);
});
test('expired invitations, stale writes and cross-site mutations fail',async()=>{
  const {call,db}=fixture();const invite=await call('client:a','invite',{});assert.equal((await call('coach:tanmay','claim',{code:invite.code},{now:now+86400001})).status,404);
  const d=emptyTogether();assert.equal((await call('client:a','self',{doc:d,revision:0})).status,200);assert.equal((await call('client:a','self',{doc:d,revision:0})).status,409);
  const r=await handleTogether(new Request('https://test.local/api/together/invite',{method:'POST',headers:{Origin:'https://evil.test','Content-Type':'application/json'},body:'{}'}),db,'client:a',{owner:true});assert.equal(r.status,403);
});
test('scope revocation and disconnect immediately change subsequent reads',async()=>{
  const {call,pair}=fixture();await pair(['cycle']);let owner=await call('client:a');assert.ok((await call('coach:tanmay')).partner.cycle);
  await call('client:a','sharing',{scopes:[],revision:owner.link.revision});assert.deepEqual((await call('coach:tanmay')).partner,{});
  owner=await call('client:a');await call('client:a','disconnect',{revision:owner.link.revision});const v=await call('coach:tanmay');assert.equal(v.partner,null);assert.equal(v.link,null);assert.deepEqual(v.plans,[]);
  assert.equal((await call('coach:tanmay','answer',{answer:'cannot send'})).status,403);
  await pair([]);assert.equal((await call('coach:tanmay')).link.status,'active');
});
test('two answers reveal only after both respond',async()=>{
  const {call,pair}=fixture();await pair();await call('client:a','answer',{answer:'one'});assert.equal((await call('coach:tanmay')).answer.partner,'');
  await call('coach:tanmay','answer',{answer:'two'});assert.equal((await call('client:a')).answer.partner,'two');assert.equal((await call('coach:tanmay')).answer.partner,'one');
});
test('plans need both confirmations; editing resets consent; another client cannot edit',async()=>{
  const {call,pair}=fixture();await pair();const made=await call('client:a','plan',{title:'Walk',date:'2026-09-28',time:'18:00',minutes:25});assert.equal(made.status,200);
  assert.equal((await call('client:b','plan',{id:made.id,revision:0,action:'confirm'})).status,403);
  assert.equal((await call('coach:tanmay','plan',{id:made.id,revision:0,action:'done'})).status,409);
  assert.equal((await call('coach:tanmay','plan',{id:made.id,revision:0,action:'confirm'})).status,200);
  let p=(await call('client:a')).plans[0];assert.ok(p.approved.owner&&p.approved.partner);
  await call('client:a','plan',{...p,time:'19:00'});p=(await call('coach:tanmay')).plans[0];assert.equal(p.approved.partner,false);
  assert.equal((await call('coach:tanmay','plan',{id:p.id,revision:0,action:'confirm'})).status,409);
  await call('coach:tanmay','plan',{id:p.id,revision:p.revision,action:'confirm'});p=(await call('client:a')).plans[0];assert.equal((await call('client:a','plan',{id:p.id,revision:p.revision,action:'done'})).status,200);
});
test('navigation allows an empty dock and every available room, with preserved preferences',()=>{
  const defaults={sidebar:MAIN_ROOMS,dock:['praxe','kompas']};let c={};
  c=updatePlacement(c,'spolu',{hidden:false,sidebar:false,dock:true},MAIN_ROOMS,defaults);assert.ok(navigationRooms(c,MAIN_ROOMS,defaults,'dock').includes('spolu'));
  c=updatePlacement(c,'praxe',{hidden:true},MAIN_ROOMS,defaults);assert.equal(navigationRooms(c,MAIN_ROOMS,defaults,'dock').includes('praxe'),false);
  for(const key of MAIN_ROOMS)c=updatePlacement(c,key,{dock:false},MAIN_ROOMS,defaults);assert.deepEqual(navigationRooms(c,MAIN_ROOMS,defaults,'dock'),[]);
  assert.equal(navigationRooms({order:['klienti'],rooms:{klienti:{dock:true}}},CLIENT_ROOMS,defaults,'dock').includes('klienti'),false);
});
test('real Worker route requires authenticated membership/owner before pairing',async()=>{
  const {db}=fixture();const request=email=>new Request('https://test.local/api/together',{headers:email?{'cf-access-authenticated-user-email':email}:{}});
  const env={DB:db,KLIENT_DB:db,OWNER_EMAIL:'owner@example.test'};
  assert.equal((await worker.fetch(request(),env,{})).status,401);
  assert.equal((await worker.fetch(request('unknown@example.test'),env,{})).status,403);
  // Main requires OWNER_EMAIL; Client requires membership. Neither accepts a guessed actor.
  const noConfig=await worker.fetch(request(),{DB:db,KLIENT_DB:db},{});assert.ok([401,503].includes(noConfig.status));
});
import {readTogetherResponse} from "../src/shared/product/togetherResponse.js";
test("Together distinguishes missing owner configuration from an expired session or HTML fallback",async()=>{
  await assert.rejects(readTogetherResponse(Response.json({ok:false,error:"owner-not-configured"},{status:503})),/owner-not-configured/);
  await assert.rejects(readTogetherResponse(new Response("sign in",{status:401})),/sign-in-required/);
  await assert.rejects(readTogetherResponse(new Response("<html>app</html>",{headers:{"content-type":"text/html"}})),/invalid-server-response/);
  assert.deepEqual(await readTogetherResponse(Response.json({ok:true,revision:3})),{ok:true,revision:3});
});
