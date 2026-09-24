import { cleanTogether, emptyTogether, togetherProjection, TOGETHER_SCOPES, validDate, dateKey, dayNumber } from "./together.js";

const reply=(data,status=200)=>Response.json(data,{status,headers:{"Cache-Control":"no-store, private","X-Content-Type-Options":"nosniff","Vary":"Cookie"}});
const fail=(error,status=400)=>reply({ok:false,error},status);
const decode=(text,fallback)=>{try{return JSON.parse(text);}catch{return fallback;}};
const changeCount=r=>r?.meta?.changes??r?.changes??0;
const hash=async value=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value)))).map(v=>v.toString(16).padStart(2,"0")).join("");
export async function ensureTogether(db) {
  await db.prepare("CREATE TABLE IF NOT EXISTS together_people (actor TEXT PRIMARY KEY, doc TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 0)").run();
  await db.prepare("CREATE TABLE IF NOT EXISTS together_links (id TEXT PRIMARY KEY, owner TEXT NOT NULL UNIQUE, partner TEXT UNIQUE, token_hash TEXT, expires INTEGER NOT NULL, status TEXT NOT NULL, scopes TEXT NOT NULL DEFAULT '[]', revision INTEGER NOT NULL DEFAULT 0)").run();
  await db.prepare("CREATE TABLE IF NOT EXISTS together_plans (id TEXT PRIMARY KEY, link_id TEXT NOT NULL, doc TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 0)").run();
  await db.prepare("CREATE TABLE IF NOT EXISTS together_answers (link_id TEXT NOT NULL, day TEXT NOT NULL, actor TEXT NOT NULL, answer TEXT NOT NULL, PRIMARY KEY(link_id,day,actor))").run();
}
const linkFor=(db,actor)=>db.prepare("SELECT * FROM together_links WHERE (owner = ? OR partner = ?) AND status != 'revoked'").bind(actor,actor).first();
async function person(db,actor) {
  const row=await db.prepare("SELECT * FROM together_people WHERE actor = ?").bind(actor).first();
  return {doc:decode(row?.doc,null)||emptyTogether(),revision:row?.revision||0};
}
function publicLink(link,actor) {
  return link?{id:link.id,status:link.status,owner:link.owner===actor,scopes:decode(link.scopes,[]),revision:link.revision,expires:link.expires}:null;
}
// Authenticated actor comes from the Worker, never the URL/body. Main is only a recipient.
export async function handleTogether(request,db,actor,{owner=false,now=Date.now()}={}) {
  if(!db)return fail("unavailable",503);
  if(!actor)return fail("unauthorized",401);
  const url=new URL(request.url), action=url.pathname.slice("/api/together".length)||"/";
  const method=request.method;
  if(method!=="GET") {
    const origin=request.headers.get("Origin");
    if(origin&&origin!==url.origin)return fail("origin",403);
    if(!request.headers.get("Content-Type")?.startsWith("application/json"))return fail("content-type",415);
  }
  await ensureTogether(db);
  const today=dateKey(new Date(now));
  const requestedDate=url.searchParams.get("date");
  const localToday=validDate(requestedDate)&&Math.abs(dayNumber(requestedDate)-dayNumber(today))<=1?requestedDate:today;
  let body={};
  if(method!=="GET") {
    const raw=await request.text();
    if(raw.length>180000)return fail("too-large",413);
    try {body=JSON.parse(raw);}catch{return fail("invalid-json");}
    if(!body||typeof body!=="object"||Array.isArray(body))return fail("invalid-json");
  }
  const link=await linkFor(db,actor);
  if(action==="/"&&method==="GET") {
    const self=await person(db,actor);
    const active=link?.status==="active";
    const other=active?(link.owner===actor?link.partner:link.owner):null;
    // Both parties control their own check-in, while cycle permission belongs to its owner.
    const otherDoc=other?(await person(db,other)).doc:null;
    const partner=otherDoc?togetherProjection(otherDoc,link.owner===actor?["wellbeing","support"]:decode(link.scopes,[]),localToday):null;
    const plans=active?(await db.prepare("SELECT id,doc,revision FROM together_plans WHERE link_id = ?").bind(link.id).all()).results.map(p=>({...decode(p.doc,{}),id:p.id,revision:p.revision})):[];
    const answers=active?(await db.prepare("SELECT actor,answer FROM together_answers WHERE link_id = ? AND day = ?").bind(link.id,localToday).all()).results:[];
    const myAnswer=answers.find(a=>a.actor===actor)?.answer||"";
    const latest=await linkFor(db,actor);
    if(latest?.id!==link?.id||latest?.revision!==link?.revision)return fail("conflict",409);
    return reply({ok:true,self,link:publicLink(link,actor),partner,plans,answer:{mine:myAnswer,partner:myAnswer?(answers.find(a=>a.actor===other)?.answer||""):"",waiting:!!answers.find(a=>a.actor===other)},canTrack:owner,today:localToday});
  }
  if(action==="/self"&&method==="PUT") {
    let doc;
    try {doc=cleanTogether(body.doc,localToday);}catch(e){return fail(e.message);}
    if(!owner&&(doc.periods.length||doc.mode!=="observe"))return fail("cycle-owner-only",403);
    if(!Number.isInteger(body.revision)||body.revision<0)return fail("revision");
    await db.prepare("INSERT OR IGNORE INTO together_people (actor,doc,revision) VALUES (?, ?, 0)").bind(actor,JSON.stringify(emptyTogether())).run();
    const saved=await db.prepare("UPDATE together_people SET doc = ?, revision = revision + 1 WHERE actor = ? AND revision = ?").bind(JSON.stringify(doc),actor,body.revision).run();
    return changeCount(saved)?reply({ok:true,revision:body.revision+1}):fail("conflict",409);
  }
  if(action==="/invite"&&method==="POST") {
    if(!owner)return fail("cycle-owner-only",403);
    if(link&&link.status!=="invited")return fail("connection-exists",409);
    const token=crypto.randomUUID().replace(/-/g,"")+crypto.randomUUID().slice(0,8);
    const tokenHash=await hash(token), id=crypto.randomUUID(),expires=now+86400000;
    // Replace an unused invite only; an existing active/pending pairing must first be revoked.
    await db.prepare("INSERT INTO together_links (id,owner,partner,token_hash,expires,status,scopes,revision) VALUES (?, ?, NULL, ?, ?, 'invited', '[]', 0) ON CONFLICT(owner) DO UPDATE SET id=excluded.id, partner=NULL, token_hash=excluded.token_hash, expires=excluded.expires, status='invited', scopes='[]', revision=together_links.revision+1 WHERE together_links.status IN ('invited','revoked')").bind(id,actor,tokenHash,expires).run();
    const current=await linkFor(db,actor);
    if(current?.token_hash!==tokenHash)return fail("conflict",409);
    return reply({ok:true,code:token,expires});
  }
  if(action==="/claim"&&method==="POST") {
    if(owner||link)return fail("connection-exists",409);
    if(typeof body.code!=="string"||!/^[a-f0-9]{40}$/.test(body.code))return fail("invalid-invite");
    try {
      const found=await db.prepare("UPDATE together_links SET partner = ?, status = 'pending', token_hash = NULL, revision = revision + 1 WHERE token_hash = ? AND status = 'invited' AND expires > ? AND owner != ?").bind(actor,await hash(body.code),now,actor).run();
      return changeCount(found)?reply({ok:true}):fail("invalid-invite",404);
    }catch{return fail("connection-exists",409);}
  }
  if(action==="/sharing"&&method==="PUT") {
    if(!link||link.owner!==actor||!["pending","active"].includes(link.status))return fail("forbidden",403);
    if(!Array.isArray(body.scopes)||body.scopes.some(s=>!TOGETHER_SCOPES.includes(s)))return fail("invalid-scopes");
    const result=await db.prepare("UPDATE together_links SET scopes = ?, status = 'active', revision = revision + 1 WHERE id = ? AND owner = ? AND revision = ? AND status IN ('pending','active')").bind(JSON.stringify([...new Set(body.scopes)]),link.id,actor,body.revision).run();
    return changeCount(result)?reply({ok:true}):fail("conflict",409);
  }
  if(action==="/disconnect"&&method==="POST") {
    if(!link)return reply({ok:true});
    const r=await db.prepare("UPDATE together_links SET status = 'revoked', scopes = '[]', token_hash = NULL, partner = NULL, revision = revision + 1 WHERE id = ? AND revision = ? AND (owner = ? OR partner = ?)").bind(link.id,body.revision,actor,actor).run();
    return changeCount(r)?reply({ok:true}):fail("conflict",409);
  }
  if(!link||link.status!=="active")return fail("not-connected",403);
  if(action==="/answer"&&method==="PUT") {
    const answer=typeof body.answer==="string"?body.answer.trim().slice(0,1500):"";
    const written=await db.prepare("INSERT INTO together_answers (link_id,day,actor,answer) SELECT ?, ?, ?, ? WHERE EXISTS (SELECT 1 FROM together_links WHERE id = ? AND status = 'active' AND revision = ?) ON CONFLICT(link_id,day,actor) DO UPDATE SET answer=excluded.answer").bind(link.id,localToday,actor,answer,link.id,link.revision).run();
    return changeCount(written)?reply({ok:true}):fail("conflict",409);
  }
  if(action==="/plan"&&method==="PUT") {
    const id=typeof body.id==="string"&&/^[a-f0-9-]{36}$/.test(body.id)?body.id:crypto.randomUUID();
    const existing=await db.prepare("SELECT * FROM together_plans WHERE id = ? AND link_id = ?").bind(id,link.id).first();
    const side=link.owner===actor?"owner":"partner";
    const old=decode(existing?.doc,{});
    let doc;
    if(body.action==="confirm"||body.action==="done"||body.action==="cancel") {
      if(!existing)return fail("not-found",404);
      if(body.action==="done"&&(!old.approved?.owner||!old.approved?.partner))return fail("not-confirmed",409);
      if(old.status!=="planned")return fail("plan-closed",409);
      doc=body.action==="confirm"?{...old,approved:{...old.approved,[side]:true}}:{...old,status:body.action==="done"?"done":"cancelled"};
    } else {
      const title=typeof body.title==="string"?body.title.trim().slice(0,120):"";
      if(!title||!validDate(body.date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(body.time||"")||!Number.isInteger(body.minutes)||body.minutes<10||body.minutes>1440)return fail("invalid-plan");
      doc={title,date:body.date,time:body.time,minutes:body.minutes,note:typeof body.note==="string"?body.note.trim().slice(0,600):"",status:"planned",approved:{owner:side==="owner",partner:side==="partner"}};
    }
    let r;
    if(existing) {
      r=await db.prepare("UPDATE together_plans SET doc = ?, revision = revision + 1 WHERE id = ? AND link_id = ? AND revision = ? AND EXISTS (SELECT 1 FROM together_links WHERE id = ? AND status = 'active' AND revision = ?)").bind(JSON.stringify(doc),id,link.id,body.revision,link.id,link.revision).run();
    } else {
      if(body.revision!==undefined)return fail("conflict",409);
      r=await db.prepare("INSERT INTO together_plans (id,link_id,doc,revision) SELECT ?, ?, ?, 0 WHERE EXISTS (SELECT 1 FROM together_links WHERE id = ? AND status = 'active' AND revision = ?)").bind(id,link.id,JSON.stringify(doc),link.id,link.revision).run();
    }
    return changeCount(r)?reply({ok:true,id}):fail("conflict",409);
  }
  return fail("not-found",404);
}
