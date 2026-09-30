import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {handlePersonalProfile} from '../src/shared/product/personalProfile.js';
import {handleTogether} from '../src/shared/product/togetherApi.js';
import {emptyTogether} from '../src/shared/product/together.js';

function fixture({beforeRun}={}){
  const sql=new DatabaseSync(':memory:');
  const db={prepare(query){const stmt=args=>({bind:(...a)=>stmt(a),run:async()=>{await beforeRun?.(query,args);return {meta:sql.prepare(query).run(...args)};},first:async()=>sql.prepare(query).get(...args)||null,all:async()=>({results:sql.prepare(query).all(...args)})});return stmt([]);}};
  const call=async(actor,body,options={})=>{const response=await handlePersonalProfile(new Request('https://test.local/api/personal-profile',{method:body?'PUT':'GET',headers:body?{'Content-Type':'application/json','Origin':options.origin||'https://test.local'}:{},...(body?{body:JSON.stringify(body)}:{})}),db,actor,{legacyOwner:actor?.startsWith('client:')});return {status:response.status,...await response.json()};};
  const together=async(actor,path='',body)=>{const response=await handleTogether(new Request(`https://test.local/api/together${path}`,{method:body?['/invite','/claim','/disconnect'].includes(path)?'POST':'PUT':'GET',headers:body?{'Content-Type':'application/json'}:{},...(body?{body:JSON.stringify(body)}:{})}),db,actor,{owner:actor.startsWith('client:'),now:Date.parse('2026-09-30T12:00:00Z')});return {status:response.status,...await response.json()};};
  return {call,together,sql};
}
test('profile is actor-isolated, revision guarded and cannot set privileges',async()=>{
  const {call}=fixture(),main=await call('coach:tanmay');
  assert.equal(main.profile.ownCycle,false);assert.equal(main.profile.wording,'neutral');
  const result=await call('coach:tanmay',{revision:0,profile:{name:'A',wording:'female',ownCycle:true,role:'admin',partnerScopes:['cycle']}});
  assert.deepEqual(result.profile,{name:'A',wording:'female',ownCycle:true});
  assert.equal((await call('coach:tanmay',{revision:0,profile:result.profile})).status,409);
  const other=await call('client:b');assert.equal(other.profile.name,'');assert.notEqual(other.accountKey,main.accountKey);
  assert.equal((await call('coach:tanmay',{revision:1,profile:result.profile},{origin:'https://elsewhere.test'})).status,403);
  assert.equal((await call(null)).status,401);
  assert.equal((await call('coach:tanmay',{revision:1,profile:result.profile,accountKey:other.accountKey})).error,'account-changed');
});
test('calendar configuration stays per account and cannot export through a missing or replaced pairing',async()=>{
  const {together,sql}=fixture();
  const empty=await together('coach:tanmay','/calendar');assert.equal(empty.config.calendarId,'');
  const config={...empty.config,clientId:'test.apps.googleusercontent.com',calendarId:'calendar',linkId:'pair',access_token:'never-store'};
  assert.equal((await together('coach:tanmay','/calendar',{revision:0,config})).status,403);
  sql.prepare("INSERT INTO together_links (id,owner,partner,expires,status,scopes) VALUES ('pair','client:a','coach:tanmay',0,'active','[]')").run();
  assert.equal((await together('coach:tanmay','/calendar',{revision:0,config})).status,200);
  assert.equal((await together('coach:tanmay','/calendar',{revision:0,config})).status,409);
  assert.equal(JSON.stringify((await together('coach:tanmay','/calendar')).config).includes('never-store'),false);
  assert.equal((await together('client:a','/calendar')).config.calendarId,'');
  sql.prepare("UPDATE together_links SET status='revoked' WHERE id='pair'").run();
  assert.equal((await together('coach:tanmay','/calendar',{revision:1,config})).status,403);
  assert.equal((await together('coach:tanmay','/calendar',{revision:1,config:{...empty.config,clientId:config.clientId}})).status,200);
});
test('own cycle works in Main; switching off preserves prior data and permits ordinary diary edits',async()=>{
  const {call,together}=fixture();
  const doc={...emptyTogether(),periods:[{start:'2026-09-01',end:'2026-09-04'}]};
  assert.equal((await together('coach:tanmay','/self',{doc,revision:0})).status,403);
  await call('coach:tanmay',{revision:0,profile:{name:'A',wording:'male',ownCycle:true}});
  assert.equal((await together('coach:tanmay','/self',{doc,revision:0})).status,200);
  await call('coach:tanmay',{revision:1,profile:{name:'A',wording:'male',ownCycle:false}});
  const loaded=await together('coach:tanmay');assert.equal(loaded.canTrack,false);assert.equal(loaded.self.doc.periods.length,1);
  doc.days['2026-09-30']={note:'Private observation'};
  assert.equal((await together('coach:tanmay','/self',{doc,revision:1})).status,200);
  assert.equal((await together('coach:tanmay','/self',{doc:{...doc,periods:[]},revision:2})).status,403);
  assert.equal((await together('client:other')).self.doc.periods.length,0);
});

test('either role initiates a pair and each partner controls only their own revocable cycle grants',async()=>{
  const {call,together,sql}=fixture();
  const invite=await together('coach:tanmay','/invite',{});assert.equal(invite.status,200);
  assert.equal((await together('client:a','/claim',{code:invite.code})).status,200);
  let main=await together('coach:tanmay');
  assert.equal((await together('client:a','/sharing',{scopes:['cycle'],revision:main.link.revision})).status,403);
  assert.equal((await together('coach:tanmay','/sharing',{scopes:[],revision:main.link.revision})).status,200);
  const profile={name:'A',wording:'female',ownCycle:true};await call('coach:tanmay',{revision:0,profile});
  const doc={...emptyTogether(),mode:'estimate',periods:[{start:'2026-09-01',end:'2026-09-04'}]};
  await together('coach:tanmay','/self',{doc,revision:0});await together('client:a','/self',{doc,revision:0});
  main=await together('coach:tanmay');await together('coach:tanmay','/sharing',{scopes:['phase'],revision:main.link.revision});
  let client=await together('client:a');await together('client:a','/sharing',{scopes:['cycle'],revision:client.link.revision});
  main=await together('coach:tanmay');client=await together('client:a');
  assert.deepEqual(main.link.myScopes,['phase']);assert.deepEqual(main.link.receivedScopes,['cycle']);
  assert.ok(main.partner.cycle);assert.equal(main.partner.phase,undefined);assert.ok(client.partner.phase);assert.equal(client.partner.cycle,undefined);
  assert.equal((await together('coach:tanmay','/pages-sharing',{rooms:[],pages:{},revision:0,linkId:main.link.id,linkRevision:main.link.revision})).status,200);
  assert.equal((await together('client:outsider','/sharing',{scopes:['cycle'],revision:main.link.revision})).status,403);
  await call('coach:tanmay',{revision:1,profile:{...profile,ownCycle:false}});
  client=await together('client:a');assert.equal(client.partner.phase,undefined);assert.deepEqual(client.link.receivedScopes,['phase']);
  await call('coach:tanmay',{revision:2,profile});assert.ok((await together('client:a')).partner.phase);
  await together('client:a','/sharing',{scopes:[],revision:client.link.revision});
  assert.equal((await together('coach:tanmay','/sharing',{scopes:[],revision:client.link.revision})).status,409);
  main=await together('coach:tanmay');assert.deepEqual(main.link.myScopes,['phase']);assert.deepEqual(main.link.receivedScopes,[]);assert.equal(main.partner.cycle,undefined);
  await together('coach:tanmay','/disconnect',{revision:main.link.revision});
  const row=sql.prepare('SELECT scopes,partner_scopes FROM together_links').get();assert.deepEqual({...row},{scopes:'[]',partner_scopes:'[]'});
});

test('existing pair schema gains a separate empty recipient grant without changing accepted owner consent',async()=>{
  const {sql,together}=fixture();
  sql.exec("CREATE TABLE together_links (id TEXT PRIMARY KEY, owner TEXT NOT NULL UNIQUE, partner TEXT UNIQUE, token_hash TEXT, expires INTEGER NOT NULL, status TEXT NOT NULL, scopes TEXT NOT NULL DEFAULT '[]', revision INTEGER NOT NULL DEFAULT 0)");
  sql.prepare("INSERT INTO together_links (id,owner,partner,expires,status,scopes) VALUES ('legacy','client:a','coach:tanmay',0,'active','[\"cycle\"]')").run();
  const main=await together('coach:tanmay');assert.deepEqual(main.link.receivedScopes,['cycle']);assert.deepEqual(main.link.myScopes,[]);
  assert.equal(sql.prepare("SELECT partner_scopes FROM together_links WHERE id='legacy'").get().partner_scopes,'[]');
});

for(const first of ['invite','claim'])test(`concurrent invite and claim cannot join two pairs when ${first} writes first`,async()=>{
  let gated=false,arrived=0,allArrived;
  const blocked=new Promise(resolve=>{allArrived=resolve;}),release={};
  const {together,sql}=fixture({beforeRun:async query=>{
    const action=query.startsWith('INSERT INTO together_links')?'invite':query.startsWith('UPDATE together_links SET partner =')?'claim':null;
    if(!gated||!action)return;
    await new Promise(resolve=>{release[action]=resolve;if(++arrived===2)allArrived();});
  }});
  const other=await together('client:b','/invite',{});
  assert.equal(other.status,200);gated=true;
  const pending={invite:together('coach:tanmay','/invite',{}),claim:together('coach:tanmay','/claim',{code:other.code})};
  await blocked;release[first]();assert.equal((await pending[first]).status,200);
  const second=first==='invite'?'claim':'invite';release[second]();assert.equal((await pending[second]).status,409);
  const rows=sql.prepare("SELECT owner,partner,status FROM together_links WHERE status != 'revoked' AND (owner = ? OR partner = ?)").all('coach:tanmay','coach:tanmay');
  assert.equal(rows.length,1);assert.equal(rows[0].status,first==='invite'?'invited':'pending');
  assert.equal(rows[0].owner,first==='invite'?'coach:tanmay':'client:b');
});

test('calendar operations reject credentials that changed after the client verified its account',async()=>{
  const {call,sql}=fixture(),account=await call('coach:tanmay');
  const db={prepare(query){const stmt=args=>({bind:(...a)=>stmt(a),run:async()=>({meta:sql.prepare(query).run(...args)}),first:async()=>sql.prepare(query).get(...args)||null,all:async()=>({results:sql.prepare(query).all(...args)})});return stmt([]);}};
  const request=new Request('https://test.local/api/together/calendar',{method:'PUT',headers:{'Content-Type':'application/json','X-Tanmay-Account-Key':account.accountKey},body:JSON.stringify({revision:0,config:{}})});
  const response=await handleTogether(request,db,'client:different');
  assert.equal(response.status,409);assert.equal((await response.json()).error,'account-changed');
  assert.equal(sql.prepare("SELECT count(*) AS n FROM sqlite_master WHERE type='table' AND name='together_calendars'").get().n,0,'account mismatch stops before any calendar configuration access');
});

test('all partner projections require independent revocable consent regardless of who initiated the pair',async()=>{
  const all=['cycle','phase','wellbeing','support','cycle-note','pain','flow'];
  for(const initiator of ['coach:tanmay','client:a']){
    const {call,together}=fixture(),recipient=initiator==='coach:tanmay'?'client:a':'coach:tanmay';
    await call('coach:tanmay',{revision:0,profile:{name:'A',wording:'neutral',ownCycle:true}});
    const doc={...emptyTogether(),periods:[{start:'2026-09-28',end:'2026-09-30'}],days:{'2026-09-30':{energy:3,mood:'private mood',support:'private support',cycleNote:'private cycle note',pain:'mild',flow:'light',note:'never shared'}}};
    await together(initiator,'/self',{revision:0,doc});await together(recipient,'/self',{revision:0,doc});
    const invite=await together(initiator,'/invite',{});await together(recipient,'/claim',{code:invite.code});
    let first=await together(initiator);await together(initiator,'/sharing',{revision:first.link.revision,scopes:[]});
    first=await together(initiator);let second=await together(recipient);
    assert.deepEqual(first.partner,{},`${initiator}: no implicit grants from recipient`);
    assert.deepEqual(second.partner,{},`${recipient}: no implicit grants from initiator`);
    await together(initiator,'/sharing',{revision:first.link.revision,scopes:all});
    second=await together(recipient);await together(recipient,'/sharing',{revision:second.link.revision,scopes:all});
    first=await together(initiator);second=await together(recipient);
    for(const snapshot of [first,second]){
      assert.deepEqual(Object.keys(snapshot.partner).sort(),['cycle','phase','wellbeing','support','cycleNote','pain','flow'].sort());
      assert.equal(snapshot.partner.note,undefined);assert.equal(snapshot.partner.support.text,'private support');
    }
    await together(initiator,'/sharing',{revision:first.link.revision,scopes:[]});
    second=await together(recipient);assert.deepEqual(second.partner,{});assert.deepEqual(second.link.myScopes,all);
    await together(recipient,'/sharing',{revision:second.link.revision,scopes:[]});
    first=await together(initiator);assert.deepEqual(first.partner,{});assert.deepEqual(first.link.receivedScopes,[]);
    assert.equal(first.self.doc.days['2026-09-30'].support,'private support','revocation preserves the owner’s record');
  }
});
