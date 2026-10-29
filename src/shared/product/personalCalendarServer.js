// Personal Calendar authorization. Refresh tokens stay in this Worker's D1,
// encrypted with a Worker-only key. Booking's single-owner grant is separate.
import {personalProfileAccountKey} from './personalProfile.js';

const API='https://www.googleapis.com/calendar/v3';
const TOKEN='https://oauth2.googleapis.com/token';
export const PERSONAL_CALENDAR_SCOPES={
  created:'https://www.googleapis.com/auth/calendar.app.created',
  read:'https://www.googleapis.com/auth/calendar.events.readonly',
  write:'https://www.googleapis.com/auth/calendar.events',
};
const ALLOWED=new Set(Object.values(PERSONAL_CALENDAR_SCOPES));
const TTL=10*60*1000, MAX_BODY=160000;
const caches=new WeakMap(), pending=new WeakMap(), prepared=new WeakSet();
const encode=value=>new TextEncoder().encode(value);
const b64=bytes=>btoa(String.fromCharCode(...new Uint8Array(bytes)));
const unb64=text=>Uint8Array.from(atob(text),v=>v.charCodeAt(0));
const random=()=>b64(crypto.getRandomValues(new Uint8Array(32))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const hash=async value=>b64(await crypto.subtle.digest('SHA-256',encode(value)));
const json=(value,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'no-store, private','Vary':'Cookie','X-Content-Type-Options':'nosniff'}});
const failure=(code,status=400)=>json({ok:false,error:code},status);
const problem=(code,status=400)=>Object.assign(new Error(code),{code,status});
const changed=result=>Number(result?.meta?.changes??result?.changes??0)>0;
const list=value=>{try{return JSON.parse(value||'[]');}catch{return [];}};
const mapFor=(maps,db)=>{if(!maps.has(db))maps.set(db,new Map());return maps.get(db);};
const keyFor=row=>JSON.stringify([row.actor,row.origin,row.client_id,row.generation]);
const rowFor=(db,actor)=>db.prepare('SELECT * FROM personal_calendar_connections WHERE actor = ?').bind(actor).first();

export function personalCalendarConfigured(env={}) {
  if(!/^[a-zA-Z0-9._-]+\.apps\.googleusercontent\.com$/.test(String(env.GOOGLE_CALENDAR_CLIENT_ID||'')))return false;
  if(!String(env.GOOGLE_CALENDAR_CLIENT_SECRET||'').trim())return false;
  try{return unb64(String(env.GOOGLE_CALENDAR_TOKEN_ENCRYPTION_KEY||'')).length===32;}catch{return false;}
}
async function schema(db) {
  if(prepared.has(db))return;
  await db.prepare(`CREATE TABLE IF NOT EXISTS personal_calendar_connections (
    actor TEXT PRIMARY KEY, origin TEXT NOT NULL, client_id TEXT NOT NULL,
    generation TEXT NOT NULL, token_ciphertext TEXT NOT NULL DEFAULT '', token_iv TEXT NOT NULL DEFAULT '',
    token_version INTEGER NOT NULL DEFAULT 1, scopes_json TEXT NOT NULL DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'DISCONNECTED', created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
  ) STRICT`).run();
  await db.prepare(`CREATE TABLE IF NOT EXISTS personal_calendar_nonces (
    nonce_hash TEXT PRIMARY KEY, actor TEXT NOT NULL, origin TEXT NOT NULL, client_id TEXT NOT NULL,
    generation TEXT NOT NULL, scopes_json TEXT NOT NULL, expires_at INTEGER NOT NULL
  ) STRICT`).run();
  await db.prepare('CREATE INDEX IF NOT EXISTS personal_calendar_nonce_expiry ON personal_calendar_nonces(expires_at)').run();
  prepared.add(db);
}
async function cipherKey(env) {
  return crypto.subtle.importKey('raw',unb64(env.GOOGLE_CALENDAR_TOKEN_ENCRYPTION_KEY),{name:'AES-GCM'},false,['encrypt','decrypt']);
}
async function seal(env,value,row) {
  const iv=crypto.getRandomValues(new Uint8Array(12));
  const ciphertext=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:encode(keyFor(row))},await cipherKey(env),encode(value));
  return {ciphertext:b64(ciphertext),iv:b64(iv)};
}
async function unseal(env,row) {
  if(row.token_version!==1)throw problem('calendar-credentials-unavailable',503);
  try {
    const value=await crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(row.token_iv),additionalData:encode(keyFor(row))},await cipherKey(env),unb64(row.token_ciphertext));
    return new TextDecoder().decode(value);
  } catch {throw problem('calendar-credentials-unavailable',503);}
}
function publicStatus(row,env,origin,accountKey) {
  const matches=row?.origin===origin&&row?.client_id===env.GOOGLE_CALENDAR_CLIENT_ID;
  return {ok:true,configured:personalCalendarConfigured(env),connected:!!(matches&&row.status==='CONNECTED'),
    scopes:matches?list(row.scopes_json):[],generation:row?.generation||'',accountKey,
    status:matches?row.status:'DISCONNECTED'};
}
function forget(db,actor) {
  for(const collection of [caches,pending])for(const [key] of mapFor(collection,db))if(JSON.parse(key)[0]===actor)mapFor(collection,db).delete(key);
}
// Membership uses a legacy email-derived id. Keep its Calendar tombstone when
// access is removed so neither a late OAuth response nor a later joining
// address with the same id can reuse the previous member's Google grant.
export async function removeClientCalendarMembership(db,userId,{now=Date.now}={}) {
  const actor=`client:${userId}`;
  await schema(db);
  await db.batch([
    db.prepare("UPDATE personal_calendar_connections SET generation = ?, token_ciphertext = '', token_iv = '', scopes_json = '[]', status = 'DISCONNECTED', updated_at = ? WHERE actor = ?")
      .bind(random(),now(),actor),
    db.prepare('DELETE FROM personal_calendar_nonces WHERE actor = ?').bind(actor),
    db.prepare('DELETE FROM members WHERE user_id = ?').bind(userId),
  ]);
  forget(db,actor);
}
async function live(db,expected) {
  const row=await rowFor(db,expected.actor);
  if(!row||row.status!=='CONNECTED'||keyFor(row)!==keyFor(expected))throw problem('calendar-account-changed',409);
  return row;
}
async function tokenCall(env,body,fetchImpl) {
  let response;
  // Workers supports manual/follow only. Reject redirects ourselves so the
  // client secret and bearer tokens can never follow an unexpected Location.
  try {response=await fetchImpl(TOKEN,{method:'POST',redirect:'manual',headers:{'Content-Type':'application/x-www-form-urlencoded'},
    body:new URLSearchParams({client_id:env.GOOGLE_CALENDAR_CLIENT_ID,client_secret:env.GOOGLE_CALENDAR_CLIENT_SECRET,...body}).toString()});}
  catch {throw problem('calendar-temporarily-unavailable',503);}
  if(response.status>=300&&response.status<400)throw problem('calendar-temporarily-unavailable',503);
  let value;try{value=await response.json();}catch{throw problem('calendar-temporarily-unavailable',503);}
  if(!response.ok){
    if(value?.error==='invalid_grant')throw problem('calendar-reconnect-required',401);
    if(value?.error==='invalid_client')throw problem('calendar-client-configuration',503);
    throw problem('calendar-temporarily-unavailable',503);
  }
  if(!value?.access_token||!Number.isFinite(Number(value.expires_in))||Number(value.expires_in)<=0)throw problem('calendar-temporarily-unavailable',503);
  return value;
}
function granted(value) {
  // Scope authority comes only from the token endpoint, never browser input.
  return typeof value==='string'?[...new Set(value.split(/\s+/).filter(scope=>ALLOWED.has(scope)))]:[];
}
async function access(db,env,row,{fetchImpl,now},force=false) {
  await live(db,row);
  const key=keyFor(row),cache=mapFor(caches,db),tasks=mapFor(pending,db);
  const hit=cache.get(key);
  if(!force&&hit&&hit.expiresAt>now()+60000)return hit;
  if(tasks.has(key))return tasks.get(key);
  const task=(async()=>{
    const current=await live(db,row),refresh=await unseal(env,current);
    await live(db,row);
    let result;
    try {result=await tokenCall(env,{grant_type:'refresh_token',refresh_token:refresh},fetchImpl);}
    catch(error){
      if(error.code==='calendar-reconnect-required'){
        const revoked=await db.prepare("UPDATE personal_calendar_connections SET status = 'RECONNECT_REQUIRED', token_ciphertext = '', token_iv = '', updated_at = ? WHERE actor = ? AND generation = ? AND token_ciphertext = ?")
          .bind(now(),row.actor,row.generation,current.token_ciphertext).run();
        cache.delete(key);
        if(!changed(revoked)){await live(db,row);throw problem('calendar-temporarily-unavailable',503);}
      }
      throw error;
    }
    await live(db,row);
    const scopes=result.scope===undefined?list(current.scopes_json):granted(result.scope);
    const sealed=result.refresh_token?await seal(env,result.refresh_token,row):null;
    const updated=await db.prepare(`UPDATE personal_calendar_connections SET scopes_json = ?, token_ciphertext = ?, token_iv = ?, updated_at = ?
      WHERE actor = ? AND generation = ? AND status = 'CONNECTED' AND token_ciphertext = ?`)
      .bind(JSON.stringify(scopes),sealed?.ciphertext||current.token_ciphertext,sealed?.iv||current.token_iv,now(),row.actor,row.generation,current.token_ciphertext).run();
    if(!changed(updated)){await live(db,row);throw problem('calendar-temporarily-unavailable',503);}
    const value={token:result.access_token,expiresAt:now()+Number(result.expires_in)*1000,scopes};
    await live(db,row);cache.set(key,value);return value;
  })();
  tasks.set(key,task);
  try{return await task;}finally{if(tasks.get(key)===task)tasks.delete(key);}
}
function cleanScopes(value) {
  const scopes=value===undefined?[PERSONAL_CALENDAR_SCOPES.created,PERSONAL_CALENDAR_SCOPES.read]:value;
  if(!Array.isArray(scopes)||!scopes.length||scopes.some(scope=>typeof scope!=='string'||!ALLOWED.has(scope))||!scopes.includes(PERSONAL_CALENDAR_SCOPES.created))throw problem('calendar-invalid-scopes');
  return [...new Set(scopes)].sort();
}
async function start(db,env,actor,origin,body,now) {
  const scopes=cleanScopes(body.scopes);
  await db.prepare(`INSERT INTO personal_calendar_connections (actor,origin,client_id,generation,created_at,updated_at)
    VALUES (?,?,?,?,?,?) ON CONFLICT(actor) DO NOTHING`).bind(actor,origin,env.GOOGLE_CALENDAR_CLIENT_ID,random(),now(),now()).run();
  const current=await rowFor(db,actor),nonce=(body.mode==='redirect'?'r.':'')+random(),expiresAt=now()+TTL;
  await db.prepare('DELETE FROM personal_calendar_nonces WHERE expires_at < ?').bind(now()).run();
  await db.prepare(`INSERT INTO personal_calendar_nonces (nonce_hash,actor,origin,client_id,generation,scopes_json,expires_at) VALUES (?,?,?,?,?,?,?)`)
    .bind(await hash(nonce),actor,origin,env.GOOGLE_CALENDAR_CLIENT_ID,current.generation,JSON.stringify(scopes),expiresAt).run();
  const authorization=new URL('https://accounts.google.com/o/oauth2/v2/auth');
  if(body.mode==='redirect'){
    authorization.search=new URLSearchParams({client_id:env.GOOGLE_CALENDAR_CLIENT_ID,redirect_uri:origin+'/api/calendar/callback',
      response_type:'code',scope:scopes.join(' '),state:nonce,access_type:'offline',prompt:'consent',include_granted_scopes:'false'}).toString();
  }
  return json({ok:true,nonce,clientId:env.GOOGLE_CALENDAR_CLIENT_ID,scopes,expiresAt,...(body.mode==='redirect'?{authorizationUrl:authorization.href}:{})});
}
async function connect(db,env,actor,origin,body,accountKey,options) {
  if(typeof body.nonce!=='string'||body.nonce.length>100||typeof body.code!=='string'||!body.code||body.code.length>4096)throw problem('calendar-invalid-code');
  const nonceHash=await hash(body.nonce);
  const nonce=await db.prepare('SELECT * FROM personal_calendar_nonces WHERE nonce_hash = ? AND actor = ? AND origin = ? AND client_id = ?')
    .bind(nonceHash,actor,origin,env.GOOGLE_CALENDAR_CLIENT_ID).first();
  if(!nonce||nonce.expires_at<options.now())throw problem('calendar-invalid-nonce');
  const used=await db.prepare('DELETE FROM personal_calendar_nonces WHERE nonce_hash = ? AND actor = ? AND origin = ?').bind(nonceHash,actor,origin).run();
  if(!changed(used))throw problem('calendar-invalid-nonce');
  const current=await rowFor(db,actor);
  if(current?.generation!==nonce.generation)throw problem('calendar-account-changed',409);
  const result=await tokenCall(env,{code:body.code,grant_type:'authorization_code',redirect_uri:body.nonce.startsWith('r.')?origin+'/api/calendar/callback':origin},options.fetchImpl);
  const scopes=granted(result.scope);
  if(!list(nonce.scopes_json).every(scope=>scopes.includes(scope)))throw problem('calendar-permission-required',403);
  // Never combine a new Google account's access token with an older account's refresh token.
  if(typeof result.refresh_token!=='string'||!result.refresh_token)throw problem('calendar-refresh-consent-required',409);
  const row={actor,origin,client_id:env.GOOGLE_CALENDAR_CLIENT_ID,generation:random()};
  const sealed=await seal(env,result.refresh_token,row);
  const saved=await db.prepare(`UPDATE personal_calendar_connections SET origin = ?, client_id = ?, generation = ?, token_ciphertext = ?, token_iv = ?,
    token_version = 1, scopes_json = ?, status = 'CONNECTED', updated_at = ? WHERE actor = ? AND generation = ?`)
    .bind(origin,row.client_id,row.generation,sealed.ciphertext,sealed.iv,JSON.stringify(scopes),options.now(),actor,nonce.generation).run();
  if(!changed(saved))throw problem('calendar-account-changed',409);
  forget(db,actor);
  await live(db,row);
  mapFor(caches,db).set(keyFor(row),{token:result.access_token,expiresAt:options.now()+Number(result.expires_in)*1000,scopes});
  return json(publicStatus(await live(db,row),env,origin,accountKey));
}

const EVENT_FIELDS=new Set(['id','summary','description','start','end','status','transparency','visibility','reminders','extendedProperties','location']);
function route(body) {
  if(typeof body.path!=='string'||body.path.length>6000||!body.path.startsWith('/')||body.path.includes('\\')||body.path.includes('#'))throw problem('calendar-invalid-path');
  const [path,query='']=body.path.split('?');
  if(body.path.split('?').length>2)throw problem('calendar-invalid-path');
  const method=body.method||'GET';
  if(!['GET','POST','PATCH','DELETE'].includes(method))throw problem('calendar-invalid-method');
  const parts=path.split('/').slice(1);
  let calendarId='';
  if(parts[0]==='calendars'&&parts.length>=2){
    try{calendarId=decodeURIComponent(parts[1]);}catch{throw problem('calendar-invalid-path');}
    if(!calendarId||calendarId.includes('/')||calendarId.includes('\\')||[...calendarId].some(char=>char.charCodeAt(0)<32)||calendarId==='.'||calendarId==='..')throw problem('calendar-invalid-path');
  }
  const event=parts[0]==='calendars'&&parts[2]==='events'&&parts.length>=3&&parts.length<=4;
  const palette=parts.length===4&&parts.slice(0,3).join('/')==='users/me/calendarList'&&method==='PATCH';
  const create=path==='/calendars'&&method==='POST';
  const meta=parts[0]==='calendars'&&parts.length===2&&method==='GET';
  if(!(create||meta||palette||event))throw problem('calendar-invalid-path');
  if(event&&!(parts.length===3?['GET','POST']:['GET','PATCH','DELETE']).includes(method))throw problem('calendar-invalid-method');
  if(event&&parts.length===4&&!/^[a-zA-Z0-9_-]+$/.test(parts[3]))throw problem('calendar-invalid-path');
  if(palette&&!/^[a-zA-Z0-9@._%+-]+$/.test(parts[3]))throw problem('calendar-invalid-path');
  if(palette){
    let id;try{id=decodeURIComponent(parts[3]);}catch{throw problem('calendar-invalid-path');}
    if(!id||id.includes('/')||id.includes('\\')||id==='.'||id==='..'||[...id].some(char=>char.charCodeAt(0)<32))throw problem('calendar-invalid-path');
  }
  const params=new URLSearchParams(query);
  const allowedQuery=palette?new Set(['colorRgbFormat']):new Set(['timeMin','timeMax','singleEvents','showDeleted','maxResults','pageToken','privateExtendedProperty','orderBy','timeZone','fields']);
  if([...params.keys()].some(key=>!allowedQuery.has(key))||(method!=='GET'&&!palette&&query))throw problem('calendar-invalid-query');
  if(params.has('maxResults')&&(!/^\d+$/.test(params.get('maxResults'))||Number(params.get('maxResults'))>2500))throw problem('calendar-invalid-query');
  const headers={};
  if(body.headers!==undefined){
    if(!body.headers||typeof body.headers!=='object'||Array.isArray(body.headers)||Object.keys(body.headers).some(k=>k.toLowerCase()!=='if-match'))throw problem('calendar-invalid-headers');
    for(const value of Object.values(body.headers)){
      if(typeof value!=='string'||value.length>300||/[\r\n]/.test(value))throw problem('calendar-invalid-headers');headers['If-Match']=value;
    }
  }
  if(method!=='GET'&&method!=='DELETE'){
    const allowed=create?new Set(['summary','description','timeZone']):palette?new Set(['backgroundColor','foregroundColor','selected']):EVENT_FIELDS;
    if(!body.body||typeof body.body!=='object'||Array.isArray(body.body)||Object.keys(body.body).some(k=>!allowed.has(k)))throw problem('calendar-invalid-body');
  } else if(body.body!==undefined)throw problem('calendar-invalid-body');
  return {path:body.path,method,headers,body:body.body,calendarId,create,palette,meta};
}
function requireGrant(target,scopes) {
  const grantedScopes=new Set(scopes),s=PERSONAL_CALENDAR_SCOPES;
  if(target.create||target.palette||target.meta){if(!grantedScopes.has(s.created))throw problem('calendar-permission-required',403);return;}
  const external=target.calendarId==='primary';
  if(target.method==='GET'){
    if(!grantedScopes.has(s.read)&&!grantedScopes.has(s.write)&&!(grantedScopes.has(s.created)&&!external))throw problem('calendar-permission-required',403);
  } else if(!grantedScopes.has(s.write)&&!(grantedScopes.has(s.created)&&!external))throw problem('calendar-permission-required',403);
  // Google's app.created grant additionally rejects access to non-app-created calendars.
}
async function proxy(db,env,actor,origin,body,options) {
  const target=route(body),row=await rowFor(db,actor);
  if(!row||row.origin!==origin||row.client_id!==env.GOOGLE_CALENDAR_CLIENT_ID||row.status!=='CONNECTED')throw problem('calendar-reconnect-required',401);
  if(!body.generation||body.generation!==row.generation)throw problem('calendar-account-changed',409);
  requireGrant(target,list(row.scopes_json));
  for(let attempt=0;attempt<2;attempt++){
    const credential=await access(db,env,row,options,attempt>0);
    requireGrant(target,credential.scopes);await live(db,row);
    let response;
    try {response=await options.fetchImpl(API+target.path,{method:target.method,redirect:'manual',headers:{Authorization:'Bearer '+credential.token,...target.headers,...(target.body?{'Content-Type':'application/json'}:{})},body:target.body?JSON.stringify(target.body):undefined});}
    catch{throw problem('calendar-temporarily-unavailable',503);}
    await live(db,row);
    if(response.status>=300&&response.status<400)throw problem('calendar-temporarily-unavailable',503);
    if(response.status===401&&attempt===0){mapFor(caches,db).delete(keyFor(row));continue;}
    if(response.status===204)return new Response(null,{status:204,headers:{'Cache-Control':'no-store, private'}});
    const text=await response.text();
    await live(db,row);
    if(text.length>6000000)throw problem('calendar-response-too-large',502);
    let result;try{result=JSON.parse(text||'{}');}catch{throw problem('calendar-temporarily-unavailable',502);}
    if(!response.ok){
      const reason=result?.error?.errors?.[0]?.reason;
      return json({error:{errors:[{reason:typeof reason==='string'&&/^[a-zA-Z0-9_-]{1,80}$/.test(reason)?reason:'calendar-request-failed'}]}},response.status);
    }
    return json(result,response.status);
  }
  throw problem('calendar-reconnect-required',401);
}

export async function handlePersonalCalendar(request,db,actor,env,options={}) {
  const url=new URL(request.url),origin=url.origin,action=url.pathname.slice('/api/calendar'.length);
  if(!actor)return failure('unauthorized',401);
  if(!db)return failure('unavailable',503);
  const accountKey=await personalProfileAccountKey(actor);
  const accountHeader=request.headers.get('X-Tanmay-Account-Key');
  if(accountHeader&&accountHeader!==accountKey)return failure('calendar-account-changed',409);
  if(request.method==='GET'&&action==='/callback'){
    // The worker has already authenticated the app account. A redirect uses
    // its one-time, actor/origin/generation-bound state instead of POST headers.
    // No code or provider message is reflected into the return URL or page.
    let result='failed',reason='';
    try{
      await schema(db);
      if(!personalCalendarConfigured(env))throw problem('calendar-not-configured',503);
      const nonce=url.searchParams.get('state');
      if(!nonce?.startsWith('r.'))throw problem('calendar-invalid-nonce');
      if(url.searchParams.get('error')==='access_denied')throw problem('calendar-consent-denied');
      await connect(db,env,actor,origin,{nonce,code:url.searchParams.get('code')},accountKey,
        {fetchImpl:options.fetchImpl||((...args)=>fetch(...args)),now:options.now||Date.now});
      result='connected';
    }catch(error){
      // Only our fixed categories may leave the server. Never reflect a raw
      // provider error, exception, account identifier, state or authorization code.
      const reasons=new Map([
        ['calendar-not-configured','configuration'],['calendar-client-configuration','configuration'],
        ['calendar-invalid-nonce','expired'],['calendar-account-changed','account-changed'],
        ['calendar-consent-denied','denied'],['calendar-invalid-code','incomplete'],
        ['calendar-permission-required','permissions'],['calendar-refresh-consent-required','refresh-consent'],
        ['calendar-reconnect-required','code-rejected'],['calendar-temporarily-unavailable','provider-unavailable'],
      ]);
      reason=reasons.get(error?.code)||'server';
    }
    return new Response(null,{status:303,headers:{Location:origin+'/?calendar='+result+(reason?'&calendarReason='+reason:''),'Cache-Control':'no-store, private','Referrer-Policy':'no-referrer'}});
  }
  if(request.method==='GET'&&action==='/status'){
    try{await schema(db);return json(publicStatus(await rowFor(db,actor),env,origin,accountKey));}
    catch{return failure('calendar-unavailable',503);}
  }
  if(request.method!=='POST'||!['/start','/connect','/request','/disconnect'].includes(action))return failure('method',405);
  if(request.headers.get('Origin')!==origin)return failure('origin',403);
  if(request.headers.get('X-Requested-With')!=='XmlHttpRequest')return failure('csrf',403);
  if(accountHeader!==accountKey)return failure('calendar-account-changed',409);
  if(!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json'))return failure('content-type',415);
  if(Number(request.headers.get('Content-Length')||0)>MAX_BODY)return failure('too-large',413);
  const raw=await request.text();if(raw.length>MAX_BODY)return failure('too-large',413);
  let body;try{body=JSON.parse(raw);}catch{return failure('invalid-json');}
  if(!body||typeof body!=='object'||Array.isArray(body))return failure('invalid-json');
  const context={fetchImpl:options.fetchImpl||((...args)=>fetch(...args)),now:options.now||Date.now};
  try {
    await schema(db);
    if(action==='/disconnect'){
      const row=await rowFor(db,actor);
      if(body.generation&&row?.generation!==body.generation)throw problem('calendar-account-changed',409);
      // Google revocation affects every OAuth client in this Cloud project.
      // Disconnect this app's credential; preserve calendars and other grants.
      await db.prepare("UPDATE personal_calendar_connections SET generation = ?, token_ciphertext = '', token_iv = '', scopes_json = '[]', status = 'DISCONNECTED', updated_at = ? WHERE actor = ?")
        .bind(random(),context.now(),actor).run();
      await db.prepare('DELETE FROM personal_calendar_nonces WHERE actor = ?').bind(actor).run();forget(db,actor);
      return json(publicStatus(await rowFor(db,actor),env,origin,accountKey));
    }
    if(!personalCalendarConfigured(env))return failure('calendar-not-configured',503);
    if(action==='/start')return await start(db,env,actor,origin,body,context.now);
    if(action==='/connect')return await connect(db,env,actor,origin,body,accountKey,context);
    return await proxy(db,env,actor,origin,body,context);
  } catch(error){return failure(error?.code||'calendar-unavailable',error?.status||503);}
}
