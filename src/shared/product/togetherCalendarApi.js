import {cleanTogetherCalendar,emptyTogetherCalendar} from './togetherCalendarSync.js';
const response=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store, private','Vary':'Cookie'}});
export async function handleTogetherCalendar(request,db,actor,body,link){
  await db.prepare('CREATE TABLE IF NOT EXISTS together_calendars (actor TEXT PRIMARY KEY, doc TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 0)').run();
  const row=await db.prepare('SELECT doc,revision FROM together_calendars WHERE actor = ?').bind(actor).first();
  let config=emptyTogetherCalendar();try{if(row)config=cleanTogetherCalendar(JSON.parse(row.doc));}catch{/* Invalid old data is not used as an export instruction. */}
  if(request.method==='GET')return response({ok:true,config,revision:row?.revision||0});
  if(request.method!=='PUT')return response({ok:false,error:'method'},405);
  let next;try{next=cleanTogetherCalendar(body.config);}catch(error){return response({ok:false,error:error.message},400);}
  if(next.calendarId&&(!link||link.status!=='active'||next.linkId!==link.id))return response({ok:false,error:'not-connected'},403);
  if(body.revision!==(row?.revision||0))return response({ok:false,error:'conflict'},409);
  await db.prepare('INSERT OR IGNORE INTO together_calendars (actor,doc,revision) VALUES (?, ?, 0)').bind(actor,JSON.stringify(emptyTogetherCalendar())).run();
  const result=await db.prepare('UPDATE together_calendars SET doc = ?, revision = revision + 1 WHERE actor = ? AND revision = ?').bind(JSON.stringify(next),actor,body.revision).run();
  return (result.meta?.changes??result.changes)?response({ok:true,config:next,revision:body.revision+1}):response({ok:false,error:'conflict'},409);
}
