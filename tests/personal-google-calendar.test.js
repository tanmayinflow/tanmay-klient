import {test} from "node:test";
import assert from "node:assert/strict";
import {createGoogleCalendar} from "../src/shared/product/googleCalendar.js";

const date="2026-10-10", L=cs=>cs;
function fixture(options={}) {
  let owner="account-a", callback, heldResponse,online=true, today=date;
  const callbacks=[];
  const calls=[], writes=[], values=new Map();
  globalThis.localStorage={getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)};
  globalThis.window={google:{accounts:{oauth2:{initTokenClient(settings){
    callback=settings.callback;callbacks.push(callback);
    return {requestAccessToken(){if(!options.holdAuth)callback({access_token:"mock-token",expires_in:3600,scope:settings.scope});}};
  }}}}};
  let days={[date]:{sched:{"9:00":{text:"My practice",span:2,note:"PRIVATE"}},free:"PRIVATE",journal:"PRIVATE"}};
  const cfg={clientId:"my-client-id",calId:"my-calendar",rozvrh:true,horizon:1,klienti:true,trenink:true,motiv:true};
  const st={coll:{klProfiles:[{name:"PRIVATE"}],klSessions:[{id:"coach",date,note:"PRIVATE"}],calShadow:{"kl|coach":{gid:"coach-private",h:"old"}},calendarAllDay:[{id:"day",title:"My all-day",start:date,end:"2026-10-11",rev:1}]},
    calCfg:()=>cfg,setCalCfg:patch=>{writes.push(["cfg",patch]);Object.assign(cfg,patch);},
    setCalState:patch=>{writes.push(["state",patch]);st.coll.calShadow=patch.shadow;st.coll.calTomb=patch.tomb;},
    setCalendarAllDay:fn=>{writes.push(["allDay"]);st.coll.calendarAllDay=fn(st.coll.calendarAllDay);},
    getDay:d=>days[d]||{},getCalendarDay:d=>days[d]||{},
    updateCalendarDays:async fn=>{const next=fn(days);const changed=next!==days;days=next;return changed;},
    updateDay:(d,fn)=>{days[d]={...days[d],...fn(days[d]||{})};}};
  const events=new Map();
  const fetcher=async(url,init)=>{
    calls.push({url,...init,body:init.body?JSON.parse(init.body):null});
    if(options.holdRequest && !heldResponse) return new Promise(resolve=>{heldResponse=()=>resolve(new Response(JSON.stringify({id:"my-calendar"}),{status:200}));});
    const path=new URL(url).pathname,body=init.body?JSON.parse(init.body):null;
    if(path.endsWith("/events") && init.method==="POST"){events.set(body.id,{...body,etag:"v1"});return Response.json(events.get(body.id));}
    if(path.endsWith("/events"))return Response.json({items:[...events.values()]});
    if(path.endsWith("my-calendar"))return Response.json({id:"my-calendar"});
    const id=path.split("/").at(-1);
    if(events.has(id))return Response.json(events.get(id));
    return new Response(JSON.stringify({error:{}}),{status:404});
  };
  const connection=options.connection?.({fetcher}) || {configured:()=>false,status:()=>({configured:false,connected:false}),prepare:async()=>({configured:false,connected:false})};
  const engine=createGoogleCalendar({role:"client",L,todayISO:()=>today,BRAND:{copper:"#a00",linen:"#fff"},getAccount:()=>owner,canRequest:()=>online,fetcher,connection,
    extraEvents:()=>{throw new Error("Client must never read Main sources");}});
  return {engine,st,cfg,calls,writes,events,values,callbacks,connection,setToday:value=>{today=value;},setOwner:v=>{owner=v;},setOnline:v=>{online=v;},authorize:()=>callback({access_token:"late-token",scope:"",expires_in:3600}),release:()=>heldResponse()};
}

test("Client whitelist ignores imported Main flags, event sources and private notes",async()=>{
  const f=fixture();
  assert.deepEqual(f.engine.CAL_KINDS.map(k=>k.k),["trenink","rozvrh"]);
  assert.deepEqual(f.engine.tmCalDesired(f.st,f.cfg).map(e=>e.kind),["rozvrh"]);
  assert.doesNotMatch(f.engine.tmCalIcs(f.st),/PRIVATE|coach/);
  const result=await f.engine.tmCalSync(f.st,{interactive:true});
  assert.equal(result.chyby,0);
  const posts=f.calls.filter(c=>c.method==="POST");
  assert.equal(posts.length,2);
  assert.deepEqual(posts.map(c=>c.body.summary).sort(),["My all-day","My practice"]);
  assert.equal(posts.find(c=>c.body.summary==="My all-day").body.end.date,"2026-10-11");
  assert.doesNotMatch(JSON.stringify(f.calls),/PRIVATE|coach-private/);
  assert.equal(f.calls.some(c=>c.method==="DELETE"),false);
  assert.deepEqual(Object.keys(f.st.coll.calShadow),["rz|2026-10-10|9:00"]);
});

test('background sync never opens OAuth when permission or token is missing',async()=>{
  const f=fixture();await assert.rejects(f.engine.tmCalSync(f.st,{}),/calendar-permission-required/);
  assert.equal(f.callbacks.length,0);assert.equal(f.calls.length,0);
  await f.engine.tmCalAuth(f.cfg.clientId,true);
  f.cfg.zpet='vse';await assert.rejects(f.engine.tmCalSync(f.st,{}),/calendar-permission-required/);
  assert.equal(f.callbacks.length,1);assert.equal(f.calls.length,0);
});

test('explicit consent starts synchronously and two same-account gestures share one popup',async()=>{
  const f=fixture({holdAuth:true});
  const a=f.engine.tmCalAuth(f.cfg.clientId,true),b=f.engine.tmCalAuth(f.cfg.clientId,true);
  assert.equal(f.callbacks.length,1);f.authorize();assert.equal(await a,await b);
});

test('disconnect invalidates an in-flight sync and its late writes',async()=>{
  const f=fixture({holdRequest:true});const task=f.engine.tmCalSync(f.st,{interactive:true});
  for(let i=0;i<20&&!f.calls.length;i++)await Promise.resolve();
  assert.equal(f.calls.length,1);await f.engine.tmCalDisconnect(f.st,false);
  const writes=f.writes.length;f.release();await assert.rejects(task,/calendar-account-changed/);
  assert.equal(f.writes.length,writes);assert.equal(f.cfg.calId,'');assert.equal(f.calls.length,1);
});

test('disconnect stops cycle sharing and preserves its existing Google calendar',async()=>{
  const f=fixture();f.cfg.cycle=true;f.cfg.cycleCalId='own-cycle-calendar';
  await f.engine.tmCalDisconnect(f.st,false);
  assert.equal(f.cfg.cycle,false);assert.equal(f.cfg.cycleCalId,'own-cycle-calendar');
  assert.equal(f.calls.length,0);
});

test("OAuth callback cannot attach a previous account token after switching",async()=>{
  const f=fixture({holdAuth:true});
  const pending=f.engine.tmCalAuth(f.cfg.clientId,true);
  await Promise.resolve();f.setOwner("account-b");f.authorize();
  await assert.rejects(pending,/calendar-account-changed/);
  assert.equal(f.engine.tmCalLive(),false);
  assert.equal(f.calls.length,0);
  assert.equal(f.values.size,0);
});

test("in-flight Google response after account switch causes no following request or store write",async()=>{
  const f=fixture({holdRequest:true});
  const pending=f.engine.tmCalSync(f.st,{interactive:true});
  for(let i=0;i<12&&!f.calls.length;i++)await Promise.resolve();
  assert.equal(f.calls.length,1);
  f.setOwner("account-b");f.release();
  await assert.rejects(pending,/calendar-account-changed/);
  assert.equal(f.calls.length,1);
  assert.equal(f.writes.length,0);
  assert.equal(f.engine.tmCalLive(),false);
});

test("a late previous-account popup never resolves a new account's consent",async()=>{
  const f=fixture({holdAuth:true});
  const first=f.engine.tmCalAuth(f.cfg.clientId,true);
  await Promise.resolve();f.setOwner("account-b");
  const second=f.engine.tmCalAuth(f.cfg.clientId,true);
  await Promise.resolve();
  assert.equal(f.callbacks.length,2);
  f.callbacks[0]({access_token:"old-account-token",expires_in:3600});
  await assert.rejects(first,/calendar-account-changed/);
  assert.equal(f.engine.tmCalLive(),false);
  f.callbacks[1]({access_token:"new-account-token",expires_in:3600});
  assert.equal(await second,"new-account-token");
  f.callbacks[0]({access_token:"late-old-token",expires_in:3600});
  assert.equal(await f.engine.tmCalAuth(f.cfg.clientId,true),"new-account-token");
});

test("an unverified Client account cannot start consent or send private data",async()=>{
  const f=fixture();f.setOwner(null);
  await assert.rejects(f.engine.tmCalSync(f.st,{interactive:true}),/calendar-account-changed/);
  assert.equal(f.calls.length,0);assert.equal(f.writes.length,0);
});

test("offline pauses consent and calendar traffic without discarding the same account's token",async()=>{
  const f=fixture();
  await f.engine.tmCalAuth(f.cfg.clientId,true);
  f.setOnline(false);
  assert.equal(f.engine.tmCalLive(),true);
  assert.equal(f.engine.tmCalAvailable(),false);
  await assert.rejects(f.engine.tmCalAuth(f.cfg.clientId,false),/calendar-account-unavailable/);
  await assert.rejects(f.engine.tmCalSync(f.st,{}),/calendar-account-unavailable/);
  assert.equal(f.calls.length,0);assert.equal(f.callbacks.length,1);
  f.setOnline(true);
  assert.equal(await f.engine.tmCalAuth(f.cfg.clientId,false),"mock-token");
  assert.equal(f.callbacks.length,1);
});

const ownScope='https://www.googleapis.com/auth/calendar.app.created';
const readScope='https://www.googleapis.com/auth/calendar.events.readonly';
const writeScope='https://www.googleapis.com/auth/calendar.events';
function durableFixture({connected=true,configured=true}={}) {
  const status={configured,connected,scopes:[ownScope,readScope],generation:'same-connection'};
  const requests=[],consents=[],preparations=[];let disconnected=0;
  const f=fixture({connection:({fetcher})=>({
    configured:()=>status.configured,status:()=>({...status}),
    ready:scopes=>status.connected && String(scopes||'').split(' ').every(scope=>status.scopes.includes(scope)),
    prepare:async(scopes,options)=>{preparations.push({scopes,...options});return {...status};},
    connect:scopes=>{consents.push(scopes);status.connected=true;status.scopes=scopes.split(' ');return Promise.resolve({...status});},
    request:async(path,options={})=>{
      requests.push({path,...options});
      if(path.startsWith('/calendars/primary/events'))return {items:[]};
      const response=await fetcher('https://www.googleapis.com/calendar/v3'+path,{...options,method:options.method||'GET',body:options.body?JSON.stringify(options.body):undefined});
      if(!response.ok)throw Object.assign(Error('remote-error'),{status:response.status});
      return response.json();
    },
    disconnect:async()=>{disconnected++;status.connected=false;},
  })});
  Object.assign(f.cfg,{durableSetup:true,zpet:'vse',allDayWrite:false});
  return {...f,status,requests,consents,preparations,disconnects:()=>disconnected};
}

test('new defaults enable day schedule and app-calendar import without overriding saved choices',()=>{
  const f=fixture();assert.equal(f.engine.config({}).rozvrh,true);assert.equal(f.engine.config({}).zpet,'tanmay');
  assert.equal(f.engine.config({rozvrh:false}).rozvrh,false);assert.equal(f.engine.config({zpet:''}).zpet,'');
});

test('a restored durable connection syncs new app rows without OAuth or a browser access token',async()=>{
  const f=durableFixture();await f.engine.tmCalRestore();
  assert.equal(f.engine.tmCalLive(),true);assert.equal(f.engine.tmCalReady(f.cfg),true);
  const result=await f.engine.tmCalSync(f.st,{});
  assert.equal(result.chyby,0);assert.equal(f.callbacks.length,0);assert.equal(f.consents.length,0);
  assert.ok(f.requests.some(request=>request.method==='POST'&&request.body.summary==='My practice'));
  assert.ok(f.calls.every(call=>!call.headers?.Authorization));
  assert.ok(f.preparations.every(preparation=>preparation.authorize===false));
});

test('automatic durable sync brings a newly created Google appointment into the exact day time without replacing a local plan',async()=>{
  const f=durableFixture();const start=new Date(date+'T09:37:00').toISOString(),end=new Date(date+'T10:22:00').toISOString();
  f.events.set('native',{id:'native',summary:'New appointment',start:{dateTime:start},end:{dateTime:end}});
  await f.engine.tmCalSync(f.st,{});
  const day=f.st.getCalendarDay(date);
  assert.equal(day.sched['9:00'].text,'My practice');
  assert.deepEqual(day.calendarTimed.map(row=>[row.title,row.time,row.endTime]),[['New appointment','09:37','10:22']]);
  assert.equal(f.requests.some(request=>request.path.endsWith('/native')&&request.method==='PATCH'),false);
});

test('the first synchronization imports from the newly created calendar instead of its stale empty config snapshot',async()=>{
  const f=durableFixture();f.cfg.calId='';
  const request=f.connection.request;
  f.connection.request=async(path,options)=>path==='/calendars'&&options?.method==='POST'
    ? {id:'new-calendar'} : request(path.replace('new-calendar','my-calendar'),options);
  f.events.set('native',{id:'native',summary:'First meeting',start:{dateTime:new Date(date+'T09:37:00').toISOString()},end:{dateTime:new Date(date+'T10:00:00').toISOString()}});
  await f.engine.tmCalSync(f.st,{});
  assert.equal(f.cfg.calId,'new-calendar');
  assert.equal(f.st.getCalendarDay(date).calendarTimed[0].title,'First meeting');
});

test('first durable consent starts synchronously and enables reading primary without exporting cycle or requesting primary writes',async()=>{
  const f=durableFixture({connected:false});delete f.cfg.durableSetup;f.cfg.rozvrh=false;f.cfg.zpet='';f.cfg.cycle=true;
  await f.engine.tmCalPrepareAuth(f.cfg);
  assert.equal(f.preparations.at(-1).authorize,true);assert.equal(f.preparations.at(-1).scopes,ownScope+' '+readScope);
  const pending=f.engine.tmCalSync(f.st,{interactive:true});
  assert.deepEqual(f.consents,[ownScope+' '+readScope]);assert.equal(f.callbacks.length,0);
  await pending;
  assert.equal(f.cfg.durableSetup,true);assert.equal(f.cfg.rozvrh,true);assert.equal(f.cfg.zpet,'vse');
  assert.equal(f.cfg.cycle,false);assert.equal(f.cfg.allDayWrite,false);
  assert.ok(f.requests.every(request=>!request.path.includes('/primary/')||!request.method||request.method==='GET'));
});

test('durable reconnection preserves explicit choices made after setup',async()=>{
  const f=durableFixture({connected:false});Object.assign(f.cfg,{rozvrh:false,zpet:'',cycle:false});
  await f.engine.tmCalSync(f.st,{interactive:true});
  assert.equal(f.cfg.rozvrh,false);assert.equal(f.cfg.zpet,'');assert.equal(f.consents[0],ownScope);
});

test('durable disconnect stops auto sync while preserving event identity for reconnect and never revokes the Google sign-in grant',async()=>{
  const f=durableFixture();await f.engine.tmCalSync(f.st,{});const originalShadow=structuredClone(f.st.coll.calShadow);
  let revoked=0;globalThis.window.google.accounts.oauth2.revoke=()=>revoked++;
  await f.engine.tmCalDisconnect(f.st,false);
  assert.equal(f.disconnects(),1);assert.equal(revoked,0);assert.equal(f.cfg.calDisconnected,true);assert.equal(f.cfg.calId,'my-calendar');
  assert.deepEqual(f.st.coll.calShadow,originalShadow);
  await assert.rejects(f.engine.tmCalSync(f.st,{}),/calendar-permission-required/);
  await f.engine.tmCalSync(f.st,{interactive:true});
  assert.equal(f.cfg.calDisconnected,false);
  assert.deepEqual(f.st.coll.calShadow,originalShadow);
});

test('unknown durable configuration fails closed instead of falling back to legacy popup',async()=>{
  const f=durableFixture({connected:false,configured:null});
  await assert.rejects(f.engine.tmCalAuth(f.cfg.clientId,true),/calendar-connection-loading/);
  assert.equal(f.callbacks.length,0);assert.equal(f.consents.length,0);
});

test('a saved calendar unavailable in the chosen Google account is not recreated or filled silently',async()=>{
  const f=durableFixture();f.connection.request=async()=>{throw Object.assign(Error('not-found'),{status:404});};
  await assert.rejects(f.engine.tmCalSync(f.st,{}),/calendar-target-unavailable/);
  assert.equal(f.cfg.calId,'my-calendar');assert.equal(f.requests.length,0);assert.equal(f.calls.length,0);
});

test('refreshing tomorrow preserves yesterday\'s Google events instead of cancelling them',async()=>{
  const f=durableFixture();await f.engine.tmCalSync(f.st,{});
  const original=f.st.coll.calShadow['rz|'+date+'|9:00'];assert.ok(original);
  const count=f.requests.length;f.setToday('2026-10-11');
  await f.engine.tmCalSync(f.st,{});
  assert.equal(f.requests.slice(count).some(request=>request.method==='PATCH'&&request.body.status==='cancelled'),false);
  assert.equal(f.st.coll.calShadow['rz|'+date+'|9:00'].gid,original.gid);
});

test('prior broader grant does not enable writes to primary unless the saved choice also allows them',async()=>{
  const f=durableFixture();f.status.scopes.push(writeScope);
  f.st.coll.calendarAllDay=[{id:'primary-new',calendarId:'primary',title:'Keep local',start:date,end:'2026-10-11',rev:1}];
  await f.engine.tmCalSync(f.st,{interactive:true});
  assert.equal(f.cfg.allDayWrite,false);
  assert.ok(f.requests.every(request=>!request.path.includes('/primary/')||!request.method||request.method==='GET'));
});
