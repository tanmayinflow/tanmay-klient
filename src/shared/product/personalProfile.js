// Personal choices are not authorization. The authenticated Worker supplies actor.
export function cleanPersonalProfile(value, defaults={}) {
  if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('invalid-profile');
  return {name:typeof value.name==='string'?value.name.trim().slice(0,80):'',wording:['male','female','neutral'].includes(value.wording)?value.wording:'neutral',ownCycle:typeof value.ownCycle==='boolean'?value.ownCycle:!!defaults.ownCycle};
}
export const defaultPersonalProfile=(legacyOwner=false)=>({name:'',wording:'neutral',ownCycle:legacyOwner});
export async function ensurePersonalProfiles(db){await db.prepare("CREATE TABLE IF NOT EXISTS personal_profiles (actor TEXT PRIMARY KEY, doc TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 0)").run();}
export async function readPersonalProfile(db,actor,legacyOwner=false){
  await ensurePersonalProfiles(db);
  const row=await db.prepare('SELECT doc,revision FROM personal_profiles WHERE actor = ?').bind(actor).first();
  let value;try{value=JSON.parse(row?.doc);}catch{/* Existing cycle records retain access until explicitly switched off. */}
  return {profile:value?cleanPersonalProfile(value):defaultPersonalProfile(legacyOwner),revision:row?.revision||0};
}
const response=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store, private','Vary':'Cookie'}});
export async function personalProfileAccountKey(actor){
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('tanmay-personal-v1:'+actor));
  return Array.from(new Uint8Array(digest)).map(n=>n.toString(16).padStart(2,'0')).join('');
}
export async function handlePersonalProfile(request,db,actor,{legacyOwner=false}={}){
  if(!actor)return response({ok:false,error:'unauthorized'},401);
  if(!db)return response({ok:false,error:'unavailable'},503);
  const current=await readPersonalProfile(db,actor,legacyOwner);
  // An opaque account key is enough for browser-local namespaces; no email is returned.
  const accountKey=await personalProfileAccountKey(actor);
  if(request.method==='GET')return response({ok:true,...current,accountKey});
  if(request.method!=='PUT')return response({ok:false,error:'method'},405);
  if(request.headers.get('Origin')&&request.headers.get('Origin')!==new URL(request.url).origin)return response({ok:false,error:'origin'},403);
  if(!request.headers.get('Content-Type')?.startsWith('application/json'))return response({ok:false,error:'content-type'},415);
  const raw=await request.text();if(raw.length>3000)return response({ok:false,error:'too-large'},413);
  let body,profile;try{body=JSON.parse(raw);profile=cleanPersonalProfile(body.profile);}catch{return response({ok:false,error:'invalid-profile'},400);}
  if(body.accountKey&&body.accountKey!==accountKey)return response({ok:false,error:'account-changed'},409);
  if(body.revision!==current.revision)return response({ok:false,error:'conflict'},409);
  await db.prepare('INSERT OR IGNORE INTO personal_profiles (actor,doc,revision) VALUES (?, ?, 0)').bind(actor,JSON.stringify(defaultPersonalProfile(legacyOwner))).run();
  const result=await db.prepare('UPDATE personal_profiles SET doc = ?, revision = revision + 1 WHERE actor = ? AND revision = ?').bind(JSON.stringify(profile),actor,body.revision).run();
  return (result.meta?.changes??result.changes)?response({ok:true,profile,revision:body.revision+1,accountKey}):response({ok:false,error:'conflict'},409);
}
