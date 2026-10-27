import {test} from "node:test";
import assert from "node:assert/strict";
import {createGoogleCalendar} from "../src/shared/product/googleCalendar.js";

const date="2026-10-10", L=cs=>cs;
function fixture(options={}) {
  let owner="account-a", callback, heldResponse,online=true;
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
  const engine=createGoogleCalendar({role:"client",L,todayISO:()=>date,BRAND:{copper:"#a00",linen:"#fff"},getAccount:()=>owner,canRequest:()=>online,fetcher,
    extraEvents:()=>{throw new Error("Client must never read Main sources");}});
  return {engine,st,cfg,calls,writes,events,values,callbacks,setOwner:v=>{owner=v;},setOnline:v=>{online=v;},authorize:()=>callback({access_token:"late-token",scope:"",expires_in:3600}),release:()=>heldResponse()};
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
