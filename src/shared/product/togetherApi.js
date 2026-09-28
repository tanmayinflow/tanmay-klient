import { cleanTogether, emptyTogether, togetherProjection, TOGETHER_SCOPES, validDate, dateKey, dayNumber } from "./together.js";
import {cleanPartnerPages,PARTNER_ROOMS} from "./togetherPages.js";
import {cycleViewForDate} from "./togetherGuidance.js";

import {cleanReflection, reflectionWeek, conversationHistory, dailyQuestion, legacyQuestion, readQuestionSnapshot} from "./togetherJournal.js";

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
  // Additive migration: old answer rows remain intact and retain their original date-based prompt.
  await db.prepare("CREATE TABLE IF NOT EXISTS together_questions (link_id TEXT NOT NULL, day TEXT NOT NULL, question_id TEXT NOT NULL, doc TEXT NOT NULL, PRIMARY KEY(link_id,day))").run();
  await db.prepare("CREATE TABLE IF NOT EXISTS together_reflections (link_id TEXT NOT NULL, week TEXT NOT NULL, actor TEXT NOT NULL, doc TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 0, PRIMARY KEY(link_id,week,actor))").run();
  await db.prepare("CREATE TABLE IF NOT EXISTS together_pages (link_id TEXT PRIMARY KEY, rooms TEXT NOT NULL DEFAULT '[]', doc TEXT NOT NULL DEFAULT '{}', revision INTEGER NOT NULL DEFAULT 0, updated INTEGER NOT NULL DEFAULT 0)").run();
}
const linkFor=(db,actor)=>db.prepare("SELECT * FROM together_links WHERE (owner = ? OR partner = ?) AND status != 'revoked'").bind(actor,actor).first();
async function pagesFor(db,link){
  const row=link?.status==="active"?await db.prepare("SELECT * FROM together_pages WHERE link_id = ?").bind(link.id).first():null;
  const rooms=decode(row?.rooms,[]).filter(id=>PARTNER_ROOMS.some(r=>r.id===id));
  return {rooms,pages:cleanPartnerPages(decode(row?.doc,{}),rooms),revision:row?.revision||0,updated:row?.updated||0};
}
async function person(db,actor) {
  const row=await db.prepare("SELECT * FROM together_people WHERE actor = ?").bind(actor).first();
  return {doc:decode(row?.doc,null)||emptyTogether(),revision:row?.revision||0};
}
function publicLink(link,actor) {
  return link?{id:link.id,status:link.status,owner:link.owner===actor,scopes:decode(link.scopes,[]),revision:link.revision,expires:link.expires}:null;
}
async function questionForPair(db,link,day,{legacyClient=false}={}) {
  if(!link||link.status!=="active")return dailyQuestion(day);
  const stored=await db.prepare("SELECT question_id,doc FROM together_questions WHERE link_id = ? AND day = ?").bind(link.id,day).first();
  if(stored)return readQuestionSnapshot(stored.question_id,stored.doc,day);
  const old=await db.prepare("SELECT actor FROM together_answers WHERE link_id = ? AND day = ? LIMIT 1").bind(link.id,day).first();
  return old||legacyClient?legacyQuestion(day):dailyQuestion(day);
}
// Authenticated actor comes from the Worker, never the URL/body. Main may publish only its reduced page projections.
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
    const requestedView=url.searchParams.get("viewDate");
    const viewDate=validDate(requestedView)&&Math.abs(dayNumber(requestedView)-dayNumber(localToday))<=3660?requestedView:localToday;
    const cycleScopes=["cycle","phase","cycle-note","pain","flow"];
    const cycleViewDoc=owner?self.doc:otherDoc;
    const grantedCycleScopes=owner?cycleScopes:decode(link?.scopes,[]).filter(s=>cycleScopes.includes(s));
    const cycleView=cycleViewDoc?{date:viewDate,...togetherProjection(cycleViewDoc,grantedCycleScopes.filter(s=>s!=="cycle"&&s!=="phase"),viewDate)}:null;
    if(cycleView){
      const view=cycleViewForDate(cycleViewDoc,viewDate,localToday);
      if(grantedCycleScopes.includes("phase"))cycleView.phase=view.phase;
      if(grantedCycleScopes.includes("cycle")){
        const {day,next,reason,cycles,projected}=view.cycle;
        cycleView.cycle={day,next,reason,cycles,...(projected?{projected:true}:{})};
      }
    }
    const plans=active?(await db.prepare("SELECT id,doc,revision FROM together_plans WHERE link_id = ?").bind(link.id).all()).results.map(p=>({...decode(p.doc,{}),id:p.id,revision:p.revision})):[];
    const answers=active?(await db.prepare("SELECT actor,answer FROM together_answers WHERE link_id = ? AND day = ?").bind(link.id,localToday).all()).results:[];
    const historyRows=active?(await db.prepare("SELECT a.day,a.actor,a.answer,q.question_id,q.doc AS question_doc FROM together_answers a LEFT JOIN together_questions q ON q.link_id = a.link_id AND q.day = a.day WHERE a.link_id = ? AND a.day <= ? ORDER BY a.day DESC").bind(link.id,localToday).all()).results:[];
    const reflections=active?(await db.prepare("SELECT week,actor,doc,revision FROM together_reflections WHERE link_id = ? AND week <= ? ORDER BY week DESC").bind(link.id,localToday).all()).results.map(r=>({week:r.week,side:r.actor===actor?"mine":"partner",doc:cleanReflection(decode(r.doc,{})),revision:r.revision})):[];
    const history=conversationHistory(historyRows,actor,other);
    const question=await questionForPair(db,link,localToday);
    const myAnswer=answers.find(a=>a.actor===actor)?.answer||"";
    const pages=await pagesFor(db,link);
    const latest=await linkFor(db,actor);
    if(latest?.id!==link?.id||latest?.revision!==link?.revision)return fail("conflict",409);
    if((await pagesFor(db,latest)).revision!==pages.revision)return fail("conflict",409);
    return reply({ok:true,self,link:publicLink(link,actor),partner,cycleView,plans,reflections,history,question,sharedPages:pages,answer:{mine:myAnswer,partner:myAnswer?(answers.find(a=>a.actor===other)?.answer||""):"",waiting:!!answers.find(a=>a.actor===other)},canTrack:owner,today:localToday});
  }
  if(action==="/pages"&&method==="GET") {
    if(!link||link.status!=="active")return fail("not-connected",403);
    const pages=await pagesFor(db,link),latest=await linkFor(db,actor);
    if(latest?.id!==link.id||latest?.revision!==link.revision||(await pagesFor(db,latest)).revision!==pages.revision)return fail("conflict",409);
    return reply({ok:true,...pages,linkId:link.id,linkRevision:link.revision});
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
  if((action==="/pages-sharing"||action==="/pages")&&method==="PUT") {
    if(owner||actor!==link.partner||actor!=="coach:tanmay")return fail("read-only",403);
    if(body.linkId!==link.id||body.linkRevision!==link.revision)return fail("conflict",409);
    const current=await pagesFor(db,link);
    const rooms=action==="/pages-sharing"?body.rooms:current.rooms;
    if(!Array.isArray(rooms)||rooms.some(id=>!PARTNER_ROOMS.some(r=>r.id===id)))return fail("invalid-rooms");
    let pages;try{pages=cleanPartnerPages(body.pages,[...new Set(rooms)]);}catch(e){return fail(e.message);}
    if(!Number.isInteger(body.revision)||body.revision!==current.revision)return fail("conflict",409);
    await db.prepare("INSERT OR IGNORE INTO together_pages (link_id) VALUES (?)").bind(link.id).run();
    const result=await db.prepare("UPDATE together_pages SET rooms = ?, doc = ?, revision = revision + 1, updated = ? WHERE link_id = ? AND revision = ? AND EXISTS (SELECT 1 FROM together_links WHERE id = ? AND status = 'active' AND revision = ? AND partner = ?)").bind(JSON.stringify([...new Set(rooms)]),JSON.stringify(pages),now,link.id,body.revision,link.id,link.revision,actor).run();
    return changeCount(result)?reply({ok:true}):fail("conflict",409);
  }
  if(action==="/reflection"&&method==="PUT") {
    if(body.linkId!==link.id||body.linkRevision!==link.revision)return fail("conflict",409);
    if(!reflectionWeek(body.week,localToday)||!Number.isInteger(body.revision)||body.revision<0)return fail("invalid-reflection");
    let doc;try{doc=cleanReflection(body.doc,body.week);}catch{return fail("invalid-reflection");}
    const existing=await db.prepare("SELECT revision FROM together_reflections WHERE link_id = ? AND week = ? AND actor = ?").bind(link.id,body.week,actor).first();
    if((existing?.revision||0)!==body.revision)return fail("conflict",409);
    let r;
    if(existing){
      r=await db.prepare("UPDATE together_reflections SET doc = ?, revision = revision + 1 WHERE link_id = ? AND week = ? AND actor = ? AND revision = ? AND EXISTS (SELECT 1 FROM together_links WHERE id = ? AND status = 'active' AND revision = ?)").bind(JSON.stringify(doc),link.id,body.week,actor,body.revision,link.id,link.revision).run();
    }else{
      r=await db.prepare("INSERT OR IGNORE INTO together_reflections (link_id,week,actor,doc,revision) SELECT ?, ?, ?, ?, 1 WHERE EXISTS (SELECT 1 FROM together_links WHERE id = ? AND status = 'active' AND revision = ?)").bind(link.id,body.week,actor,JSON.stringify(doc),link.id,link.revision).run();
    }
    return changeCount(r)?reply({ok:true,revision:body.revision+1}):fail("conflict",409);
  }
  if(action==="/answer"&&method==="PUT") {
    const answer=typeof body.answer==="string"?body.answer.trim().slice(0,1500):"";
    if(body.questionId!==undefined&&(typeof body.questionId!=="string"||body.questionId.length>160))return fail("invalid-question");
    const legacyClient=body.questionId===undefined;
    if(!legacyClient&&(body.linkId!==link.id||body.linkRevision!==link.revision))return fail("conflict",409);
    if(!legacyClient&&body.questionDay!==localToday)return fail("question-changed",409);
    const candidate=await questionForPair(db,link,localToday,{legacyClient});
    const matches=question=>legacyClient?question.id===legacyQuestion(localToday).id:body.questionId===question.id;
    if(!matches(candidate))return fail("question-changed",409);
    // Concurrent first answers agree on one immutable prompt. Stored wording survives catalogue changes.
    await db.prepare("INSERT OR IGNORE INTO together_questions (link_id,day,question_id,doc) SELECT ?, ?, ?, ? WHERE EXISTS (SELECT 1 FROM together_links WHERE id = ? AND status = 'active' AND revision = ?)").bind(link.id,localToday,candidate.id,JSON.stringify(candidate.text),link.id,link.revision).run();
    const fixed=await questionForPair(db,link,localToday);
    if(!matches(fixed))return fail("question-changed",409);
    const written=await db.prepare("INSERT INTO together_answers (link_id,day,actor,answer) SELECT ?, ?, ?, ? WHERE EXISTS (SELECT 1 FROM together_links WHERE id = ? AND status = 'active' AND revision = ?) AND EXISTS (SELECT 1 FROM together_questions WHERE link_id = ? AND day = ? AND question_id = ?) ON CONFLICT(link_id,day,actor) DO UPDATE SET answer=excluded.answer").bind(link.id,localToday,actor,answer,link.id,link.revision,link.id,localToday,fixed.id).run();
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
