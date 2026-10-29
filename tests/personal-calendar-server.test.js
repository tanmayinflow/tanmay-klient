import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {handlePersonalCalendar,removeClientCalendarMembership,PERSONAL_CALENDAR_SCOPES as S} from '../src/shared/product/personalCalendarServer.js';
import {personalProfileAccountKey} from '../src/shared/product/personalProfile.js';
import {makeD1,makeEnv,req} from './helpers/env.js';
import worker from '../worker/index.js';

const ORIGIN='https://app.example.test', A='client:a', B='client:b';
const SCOPES=[S.created,S.read];
const config={GOOGLE_CALENDAR_CLIENT_ID:'synthetic.apps.googleusercontent.com',GOOGLE_CALENDAR_CLIENT_SECRET:'synthetic-client-secret',GOOGLE_CALENDAR_TOKEN_ENCRYPTION_KEY:Buffer.alloc(32,7).toString('base64')};
async function fixture() {
  const db=makeD1(),env={...config};let time=1900000000000;
  const calls=[];let tokenHook=null,apiHook=null;
  const fetchImpl=async(url,init)=>{
    assert.equal(init.redirect,'manual','Cloudflare supports manual/follow, not error; credentials must not follow redirects');
    calls.push({url,init});
    if(url==='https://oauth2.googleapis.com/token'){
      const body=new URLSearchParams(init.body);
      if(tokenHook)return tokenHook(body);
      return Response.json({access_token:'synthetic-access-token',refresh_token:body.has('code')?'synthetic-refresh-token':undefined,expires_in:3600,scope:SCOPES.join(' ')});
    }
    if(apiHook)return apiHook(url,init);
    return Response.json({items:[],id:'synthetic-calendar'});
  };
  async function request(action,body,actor=A,overrides={}) {
    const method=body===undefined?'GET':'POST';
    const headers={'Origin':ORIGIN,'Content-Type':'application/json','X-Requested-With':'XmlHttpRequest','X-Tanmay-Account-Key':await personalProfileAccountKey(actor),...overrides.headers};
    for(const key of Object.keys(headers))if(headers[key]===null)delete headers[key];
    return (overrides.handler||handlePersonalCalendar)(new Request((overrides.origin||ORIGIN)+'/api/calendar/'+action,{method,headers,...(body===undefined?{}:{body:JSON.stringify(body)})}),db,actor,env,{fetchImpl,now:()=>time});
  }
  const begin=async(actor=A,scopes)=>{
    const res=await request('start',scopes?{scopes}:{},actor);assert.equal(res.status,200);return res.json();
  };
  const connect=async(actor=A,scopes)=>{
    const start=await begin(actor,scopes);
    const response=await request('connect',{nonce:start.nonce,code:'synthetic-code'},actor);
    assert.equal(response.status,200,await response.clone().text());return response.json();
  };
  return {db,env,calls,request,begin,connect,advance:ms=>{time+=ms;},token:hook=>{tokenHook=hook;},api:hook=>{apiHook=hook;}};
}
const row=(f,actor=A)=>f.db.prepare('SELECT * FROM personal_calendar_connections WHERE actor = ?').bind(actor).first();
const apiBody=connection=>({generation:connection.generation,path:'/calendars/primary/events?maxResults=2500'});

test('token exchange, refresh and Calendar API reject redirects without forwarding credentials or provider content',async()=>{
  for(const status of [301,302,303,307,308]){
    const redirect=()=>new Response('private-provider-body',{status,headers:{Location:'https://untrusted.example/collect'}});
    const f=await fixture(),start=await f.begin();f.token(redirect);
    const rejected=await f.request('connect',{nonce:start.nonce,code:'synthetic-code'});
    assert.equal(rejected.status,503);assert.equal(f.calls.length,1);
    assert.doesNotMatch(await rejected.text(),/private-provider|untrusted|synthetic/);
    assert.equal((await row(f)).token_ciphertext,'');
    f.token(null);const connected=await f.connect();f.api(redirect);
    const before=f.calls.length,api=await f.request('request',apiBody(connected));
    assert.equal(api.status,503);assert.equal(f.calls.length,before+1);
    assert.equal(api.headers.get('Location'),null);
    assert.doesNotMatch(await api.text(),/private-provider|untrusted|synthetic/);
    f.advance(3600001);f.token(redirect);
    const beforeRefresh=f.calls.length,refresh=await f.request('request',apiBody(connected));
    assert.equal(refresh.status,503);assert.equal(f.calls.length,beforeRefresh+1);
    assert.equal((await row(f)).status,'CONNECTED');
    assert.doesNotMatch(await refresh.text(),/private-provider|untrusted|synthetic/);
  }
});
function heldTokenResponse() {
  let arrive,release;
  const arrived=new Promise(resolve=>{arrive=resolve;});
  const response=new Promise(resolve=>{release=resolve;});
  return {
    hold:()=>{arrive();return response;},release,
    waitForRequest:pending=>Promise.race([arrived,pending.then(result=>{
      throw new Error('Request completed before reaching the held token endpoint: '+result.status);
    })]),
  };
}

test('persistent Calendar stores only authenticated ciphertext; status and responses expose no token or secret',async()=>{
  const f=await fixture(),connected=await f.connect(),stored=await row(f);
  assert.equal(connected.connected,true);assert.deepEqual(connected.scopes.sort(),SCOPES.sort());
  assert.ok(stored.token_ciphertext);assert.equal(Buffer.from(stored.token_iv,'base64').length,12);
  assert.doesNotMatch(JSON.stringify(stored),/synthetic-refresh-token|synthetic-access-token|synthetic-client-secret/);
  const status=await f.request('status');assert.match(status.headers.get('Cache-Control'),/no-store/);
  assert.doesNotMatch(JSON.stringify(connected)+await status.text(),/synthetic-refresh-token|synthetic-access-token|synthetic-client-secret|token_ciphertext/);
  const exchange=new URLSearchParams(f.calls[0].init.body);
  assert.equal(exchange.get('redirect_uri'),ORIGIN);assert.equal(exchange.get('grant_type'),'authorization_code');
});

test('mutations require exact origin, custom CSRF header and current account key before D1 or Google access',async()=>{
  const f=await fixture();
  for(const [headers,expected] of [[{Origin:'https://other.test'},403],[{Origin:null},403],[{'X-Requested-With':null},403],[{'X-Tanmay-Account-Key':null},409],[{'X-Tanmay-Account-Key':await personalProfileAccountKey(B)},409],[{'Content-Type':'text/plain'},415]]){
    assert.equal((await f.request('start',{},A,{headers})).status,expected);
  }
  assert.equal(f.calls.length,0);
  assert.equal(f.db._raw.prepare("SELECT COUNT(*) AS n FROM sqlite_master WHERE name = 'personal_calendar_connections'").get().n,0);
});

test('nonce is actor-bound, origin-bound, expires, and is single use',async()=>{
  const f=await fixture(),start=await f.begin();
  assert.equal((await f.request('connect',{nonce:start.nonce,code:'code'},B)).status,400);
  assert.equal((await f.request('connect',{nonce:start.nonce,code:'code'},A,{origin:'https://other.test',headers:{Origin:'https://other.test'}})).status,400);
  assert.equal((await f.request('connect',{nonce:start.nonce,code:'code'})).status,200);
  assert.equal((await f.request('connect',{nonce:start.nonce,code:'code'})).status,400);
  const stale=await f.begin();f.advance(600001);
  assert.equal((await f.request('connect',{nonce:stale.nonce,code:'code'})).status,400);
  assert.equal(f.calls.length,1);
});

test('an authorization response arriving after disconnect cannot restore credentials',async()=>{
  const f=await fixture(),start=await f.begin(),held=heldTokenResponse();
  f.token(held.hold);
  const result=f.request('connect',{nonce:start.nonce,code:'code'});await held.waitForRequest(result);
  assert.equal((await f.request('disconnect',{})).status,200);
  held.release(Response.json({access_token:'late-access',refresh_token:'late-refresh',expires_in:3600,scope:SCOPES.join(' ')}));
  assert.equal((await result).status,409);assert.equal((await row(f)).status,'DISCONNECTED');assert.equal((await row(f)).token_ciphertext,'');
});

test('a stale account header and another actor cannot use the first actor connection',async()=>{
  const f=await fixture(),connection=await f.connect();
  assert.equal((await f.request('request',apiBody(connection),B,{headers:{'X-Tanmay-Account-Key':connection.accountKey}})).status,409);
  assert.equal((await f.request('request',apiBody(connection),B)).status,401);
  assert.equal(f.calls.length,1);
});

test('expiry silently refreshes once for concurrent calls and keeps refresh credentials off the wire to the browser',async()=>{
  const f=await fixture(),connection=await f.connect();f.advance(3600000);
  const held=heldTokenResponse();let refreshCount=0;
  f.token(body=>{assert.equal(body.get('refresh_token'),'synthetic-refresh-token');refreshCount++;return held.hold();});
  const a=f.request('request',apiBody(connection)),b=f.request('request',apiBody(connection));
  await held.waitForRequest(a);held.release(Response.json({access_token:'renewed-access',expires_in:3600,scope:SCOPES.join(' ')}));
  assert.equal((await a).status,200);assert.equal((await b).status,200);assert.equal(refreshCount,1);
  assert.equal(f.calls.filter(call=>call.url.includes('/calendar/v3')).length,2);
  assert.equal(f.calls.at(-1).init.headers.Authorization,'Bearer renewed-access');
});

test('refresh rotation is encrypted and used for the following renewal',async()=>{
  const f=await fixture(),connection=await f.connect();f.advance(3600000);
  f.token(()=>Response.json({access_token:'renewed',refresh_token:'rotated-refresh',expires_in:3600}));
  assert.equal((await f.request('request',apiBody(connection))).status,200);
  assert.doesNotMatch(JSON.stringify(await row(f)),/rotated-refresh/);f.advance(3600000);
  let used;f.token(body=>{used=body.get('refresh_token');return Response.json({access_token:'renewed-again',expires_in:3600});});
  assert.equal((await f.request('request',apiBody(connection))).status,200);assert.equal(used,'rotated-refresh');
});

test('disconnect during refresh wins, and the late token cannot issue a Calendar call',async()=>{
  const f=await fixture(),connection=await f.connect(),held=heldTokenResponse();f.advance(3600000);
  f.token(held.hold);
  const pending=f.request('request',apiBody(connection));await held.waitForRequest(pending);
  await f.request('disconnect',{generation:connection.generation});
  held.release(Response.json({access_token:'late-access',refresh_token:'late-refresh',expires_in:3600}));
  assert.equal((await pending).status,409);assert.equal((await row(f)).status,'DISCONNECTED');assert.equal((await row(f)).token_ciphertext,'');
  assert.equal(f.calls.filter(call=>call.url.includes('/calendar/v3')).length,0);
});

test('a disconnect in another isolate invalidates even a still-live cached access token',async()=>{
  const f=await fixture(),connection=await f.connect();
  await f.db.prepare("UPDATE personal_calendar_connections SET status = 'DISCONNECTED', generation = 'changed', token_ciphertext = '' WHERE actor = ?").bind(A).run();
  assert.equal((await f.request('request',apiBody(connection))).status,401);assert.equal(f.calls.length,1);
});

test('a late renewal in another isolate cannot overwrite a rotated token or mark its replacement revoked',async()=>{
  for(const denied of [false,true]){
    const second=await import('../src/shared/product/personalCalendarServer.js?isolate='+String(denied));
    const f=await fixture(),connection=await f.connect();f.advance(3600000);
    const replies=[heldTokenResponse(),heldTokenResponse()];let nextReply=0;
    f.token(()=>replies[nextReply++].hold());
    const first=f.request('request',apiBody(connection));
    await replies[0].waitForRequest(first);
    const late=f.request('request',apiBody(connection),A,{handler:second.handlePersonalCalendar});
    await replies[1].waitForRequest(late);
    replies[0].release(Response.json({access_token:'first',refresh_token:'rotated-first',expires_in:3600}));
    assert.equal((await first).status,200);const encrypted=(await row(f)).token_ciphertext;
    replies[1].release(denied?Response.json({error:'invalid_grant'},{status:400}):Response.json({access_token:'late',refresh_token:'rotated-late',expires_in:3600}));
    assert.equal((await late).status,503);assert.equal((await row(f)).status,'CONNECTED');assert.equal((await row(f)).token_ciphertext,encrypted);
  }
});

test('invalid_grant requests reconnection once but transient refresh errors retain credentials',async()=>{
  const f=await fixture(),connection=await f.connect();f.advance(3600000);
  f.token(()=>Response.json({error:'temporarily_unavailable',error_description:'private upstream detail'},{status:503}));
  assert.equal((await f.request('request',apiBody(connection))).status,503);assert.equal((await row(f)).status,'CONNECTED');assert.ok((await row(f)).token_ciphertext);
  f.token(()=>Response.json({error:'invalid_grant',error_description:'private upstream detail'},{status:400}));
  const revoked=await f.request('request',apiBody(connection));assert.equal(revoked.status,401);assert.doesNotMatch(await revoked.text(),/private upstream/);
  assert.equal((await row(f)).status,'RECONNECT_REQUIRED');assert.equal((await row(f)).token_ciphertext,'');
  const count=f.calls.length;assert.equal((await f.request('request',apiBody(connection))).status,401);assert.equal(f.calls.length,count);
});

test('a copied encrypted token cannot be decrypted under another actor',async()=>{
  const f=await fixture(),a=await f.connect(),b=await f.connect(B),source=await row(f);
  await f.db.prepare('UPDATE personal_calendar_connections SET token_ciphertext = ?, token_iv = ?, generation = ? WHERE actor = ?').bind(source.token_ciphertext,source.token_iv,a.generation,B).run();
  f.advance(3600000);const before=f.calls.length;
  assert.equal((await f.request('request',apiBody({...b,generation:a.generation}),B)).status,503);
  assert.equal(f.calls.length,before);
});

test('scope requests are exact and denied scopes or missing refresh token preserve the working connection',async()=>{
  const f=await fixture();assert.equal((await f.request('start',{scopes:['https://www.googleapis.com/auth/calendar']})).status,400);
  const connection=await f.connect(),before=await row(f),start=await f.begin();
  f.token(()=>Response.json({access_token:'denied',refresh_token:'denied-refresh',expires_in:3600,scope:S.created}));
  assert.equal((await f.request('connect',{nonce:start.nonce,code:'code'})).status,403);assert.equal((await row(f)).generation,connection.generation);
  const second=await f.begin();f.token(()=>Response.json({access_token:'no-refresh',expires_in:3600,scope:SCOPES.join(' ')}));
  assert.equal((await f.request('connect',{nonce:second.nonce,code:'code'})).status,409);assert.equal((await row(f)).token_ciphertext,before.token_ciphertext);
});

test('proxy rejects arbitrary URLs, unsafe headers, calendar deletion and event invitations',async()=>{
  const f=await fixture(),connection=await f.connect(),base=apiBody(connection);
  for(const body of [{path:'https://evil.test/'},{path:'//evil.test/'},{path:'/calendars/%2e%2e/events'},{path:'/calendars/primary/events?sendUpdates=all'},
    {path:'/calendars/primary',method:'DELETE'},{path:'/calendars/other/events/event1',method:'PUT',body:{summary:'Replace'}},{headers:{Authorization:'own-token'}},{path:'/users/me/calendarList/%2e%2e%2fother',method:'PATCH',body:{backgroundColor:'#000000'}},
    {path:'/calendars/other/events',method:'POST',body:{attendees:[{email:'someone@example.test'}]}}]){
    assert.equal((await f.request('request',{...base,...body})).status,400,JSON.stringify(body));
  }
  assert.equal(f.calls.length,1);
});

test('read-only scope cannot write primary, but explicitly granted events scope may edit',async()=>{
  const f=await fixture(),connection=await f.connect(),write={generation:connection.generation,path:'/calendars/primary/events/event1',method:'PATCH',body:{summary:'Changed'},headers:{'If-Match':'"version1"'}};
  assert.equal((await f.request('request',write)).status,403);assert.equal(f.calls.length,1);
  f.token(()=>Response.json({access_token:'write-access',refresh_token:'write-refresh',expires_in:3600,scope:[...SCOPES,S.write].join(' ')}));
  const writable=await f.connect(A,[...SCOPES,S.write]);write.generation=writable.generation;
  assert.equal((await f.request('request',write)).status,200);assert.equal(f.calls.at(-1).init.headers['If-Match'],'"version1"');
});

test('renewal that loses a granted scope cannot call Google with reduced authority',async()=>{
  const f=await fixture(),connection=await f.connect();f.advance(3600000);
  f.token(()=>Response.json({access_token:'reduced',expires_in:3600,scope:S.created}));
  assert.equal((await f.request('request',apiBody(connection))).status,403);
  assert.equal(f.calls.filter(call=>call.url.includes('/calendar/v3')).length,0);
});

test('Google 401 refreshes only once; retries keep conditional update headers',async()=>{
  const f=await fixture(),connection=await f.connect();let attempt=0;
  f.api(()=>++attempt===1?Response.json({error:{}},{status:401}):Response.json({id:'event1'}));
  const res=await f.request('request',{generation:connection.generation,path:'/calendars/my-calendar/events/event1',method:'PATCH',headers:{'If-Match':'v1'},body:{summary:'Example',visibility:'private'}});
  assert.equal(res.status,200);assert.equal(attempt,2);assert.equal(f.calls.at(-1).init.headers['If-Match'],'v1');
  assert.equal(f.calls.filter(call=>call.url==='https://oauth2.googleapis.com/token').length,2);
});

test('disconnect clears this application without revoking other clients in the Google project',async()=>{
  const f=await fixture(),connection=await f.connect();const response=await f.request('disconnect',{generation:connection.generation});
  assert.equal((await response.json()).connected,false);assert.equal((await row(f)).token_ciphertext,'');assert.equal(f.calls.length,1);
  assert.equal((await f.request('request',apiBody(connection))).status,401);
});

async function member(f,userId='a',email='first@example.test') {
  await f.db.prepare('CREATE TABLE IF NOT EXISTS members (user_id TEXT PRIMARY KEY, email TEXT)').run();
  await f.db.prepare('INSERT INTO members (user_id,email) VALUES (?,?)').bind(userId,email).run();
}

test('membership removal clears only that member grant and pending consent; a reused actor cannot inherit it',async()=>{
  const f=await fixture(),userId='a-b-example-test',actor=`client:${userId}`;
  await member(f,userId,'a.b@example.test');
  const connection=await f.connect(actor),other=await f.connect(B),start=await f.begin(actor);
  await removeClientCalendarMembership(f.db,userId);
  const removed=await row(f,actor);
  assert.equal(removed.status,'DISCONNECTED');assert.equal(removed.token_ciphertext,'');assert.equal(removed.token_iv,'');assert.equal(removed.scopes_json,'[]');
  assert.notEqual(removed.generation,connection.generation);
  assert.equal(await f.db.prepare('SELECT * FROM members WHERE user_id = ?').bind(userId).first(),null);
  assert.equal((await f.db.prepare('SELECT COUNT(*) AS n FROM personal_calendar_nonces WHERE actor = ?').bind(actor).first()).n,0);
  assert.equal((await row(f,B)).generation,other.generation);assert.equal((await row(f,B)).status,'CONNECTED');
  // Both addresses collapse to the existing membership id. The new one must
  // still start without any retained Google authority.
  await member(f,userId,'a+b@example.test');
  assert.equal((await (await f.request('status',undefined,actor)).json()).connected,false);
  assert.equal((await f.request('connect',{nonce:start.nonce,code:'old-code'},actor)).status,400);
  assert.equal((await f.request('request',apiBody(connection),actor)).status,401);
  assert.equal(f.calls.length,2);
});

test('membership removal wins against a late authorization exchange and a late access-token renewal',async()=>{
  for(const mode of ['connect','refresh']){
    const f=await fixture();await member(f);
    const connection=await f.connect(),start=mode==='connect'?await f.begin():null;
    if(mode==='refresh')f.advance(3600000);
    const held=heldTokenResponse();f.token(held.hold);
    const pending=mode==='connect'?f.request('connect',{nonce:start.nonce,code:'late-code'}):f.request('request',apiBody(connection));
    await held.waitForRequest(pending);await removeClientCalendarMembership(f.db,'a');
    held.release(Response.json({access_token:'late-access',refresh_token:'late-refresh',expires_in:3600,scope:SCOPES.join(' ')}));
    assert.equal((await pending).status,409,mode);assert.equal((await row(f)).status,'DISCONNECTED');assert.equal((await row(f)).token_ciphertext,'');
    assert.equal(f.calls.filter(call=>call.url.includes('/calendar/v3')).length,0);
  }
});

test('a failed membership deletion rolls back Calendar invalidation and nonce removal in the same transaction',async()=>{
  const f=await fixture();await member(f);const connection=await f.connect();await f.begin();const before=await row(f);
  await f.db.prepare("CREATE TRIGGER block_membership_delete BEFORE DELETE ON members BEGIN SELECT RAISE(ABORT, 'synthetic failure'); END").run();
  await assert.rejects(removeClientCalendarMembership(f.db,'a'),/synthetic failure/);
  assert.equal((await row(f)).generation,connection.generation);assert.equal((await row(f)).token_ciphertext,before.token_ciphertext);
  assert.equal((await row(f)).status,'CONNECTED');assert.ok(await f.db.prepare('SELECT * FROM members WHERE user_id = ?').bind('a').first());
  assert.equal((await f.db.prepare('SELECT COUNT(*) AS n FROM personal_calendar_nonces WHERE actor = ?').bind(A).first()).n,1);
});

test('actual Worker membership removal and rejoining cannot retain a prior Google connection',async()=>{
  const main=JSON.parse(readFileSync(new URL('../package.json',import.meta.url),'utf8')).name==='tanmay-web';
  const f=await fixture();
  if(main){
    await member(f);const connection=await f.connect(),env=makeEnv({...config,OWNER_EMAIL:'owner@example.test',KLIENT_DB:f.db});
    assert.equal((await worker.fetch(req('/api/klienti/a',{email:'other@example.test',method:'DELETE'}),env)).status,403);
    assert.equal((await row(f)).generation,connection.generation);
    assert.equal((await worker.fetch(req('/api/klienti/a',{email:'owner@example.test',method:'DELETE'}),env)).status,200);
    assert.equal((await row(f)).status,'DISCONNECTED');assert.equal((await row(f)).token_ciphertext,'');
  }else{
    const env=makeEnv({...config,DB:f.db}),userId='a-b-example-test',actor=`client:${userId}`;
    assert.equal((await worker.fetch(req('/api/join',{email:'a.b@example.test',method:'POST',body:{word:'otevri se'}}),env)).status,200);
    await f.connect(actor);await removeClientCalendarMembership(f.db,userId);
    assert.equal((await worker.fetch(req('/api/join',{email:'a+b@example.test',method:'POST',body:{word:'otevri se'}}),env)).status,200);
    const status=await worker.fetch(req('/api/calendar/status',{email:'a+b@example.test'}),env);
    assert.equal(status.status,200);assert.equal((await status.json()).connected,false);
  }
});

test('Worker Calendar routes retain owner and membership authorization',async()=>{
  const main=JSON.parse(readFileSync(new URL('../package.json',import.meta.url),'utf8')).name==='tanmay-web';
  const env=makeEnv({...config,OWNER_EMAIL:'owner@example.test'});
  assert.equal((await worker.fetch(req('/api/calendar/status'),env)).status,401);
  if(main){
    assert.equal((await worker.fetch(req('/api/calendar/status',{email:'other@example.test'}),env)).status,403);
    assert.equal((await worker.fetch(req('/api/calendar/status',{email:'owner@example.test'}),env)).status,200);
    assert.equal((await worker.fetch(req('/api/calendar/status',{email:'owner@example.test'}),makeEnv(config))).status,503);
  }else{
    assert.equal((await worker.fetch(req('/api/calendar/status',{email:'client@example.test'}),env)).status,403);
    await worker.fetch(req('/api/join',{email:'client@example.test',method:'POST',body:{word:'otevri se'}}),env);
    assert.equal((await worker.fetch(req('/api/calendar/status',{email:'client@example.test'}),env)).status,200);
  }
});
