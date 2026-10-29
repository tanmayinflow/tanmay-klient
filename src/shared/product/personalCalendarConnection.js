// Browser half of the server authorization flow. Only public connection state
// and a short-lived, single-use nonce live here; nothing is saved in storage.
const CREATED='https://www.googleapis.com/auth/calendar.app.created';
const READ='https://www.googleapis.com/auth/calendar.events.readonly';
const WRITE='https://www.googleapis.com/auth/calendar.events';
const ALLOWED=new Set([CREATED,READ,WRITE]);
const blank=()=>({ok:true,configured:null,connected:false,scopes:[],generation:'',accountKey:'',status:'UNKNOWN'});
const fail=(code,status=0,body)=>Object.assign(new Error(code),{code,status,reason:code,body});
function scopesOf(input) {
  const scopes=input===undefined?[CREATED,READ]:typeof input==='string'?input.split(/\s+/).filter(Boolean):input;
  if(!Array.isArray(scopes)||!scopes.length||scopes.some(scope=>!ALLOWED.has(scope)))throw fail('calendar-invalid-scopes');
  return [...new Set(scopes)].sort();
}
const same=(a,b)=>a.length===b.length&&a.every((value,index)=>value===b[index]);
const copy=value=>({...value,scopes:[...value.scopes]});

function defaultGoogleLoader() {
  if(typeof window==='undefined'||typeof document==='undefined')return Promise.reject(fail('google-loading'));
  if(window.google?.accounts?.oauth2?.initCodeClient)return Promise.resolve(window.google.accounts.oauth2);
  return new Promise((resolve,reject)=>{
    let script=document.querySelector('script[data-tmgis="1"]');
    if(!script){script=document.createElement('script');script.src='https://accounts.google.com/gsi/client';script.async=true;script.defer=true;script.setAttribute('data-tmgis','1');document.head.appendChild(script);}
    const deadline=Date.now()+12000;
    const poll=()=>{
      if(window.google?.accounts?.oauth2?.initCodeClient)return resolve(window.google.accounts.oauth2);
      if(Date.now()>=deadline)return reject(fail('google-loading'));
      setTimeout(poll,120);
    };
    poll();
  });
}

export function createPersonalCalendarConnection({getAccount=()=>null,verifyAccount=()=>true,canRequest=()=>true,
  fetcher=(...args)=>fetch(...args),loadGoogle=defaultGoogleLoader,now=Date.now,
  useRedirect=()=>typeof window!=='undefined'&&typeof window.location?.assign==='function',
  navigate=url=>window.location.assign(url)}={}) {
  let owner=null,epoch=0,revision=0,snapshot=blank(),nonce=null,oauth=null,statusTask=null,authorizationTask=null,activeConnect=null;
  function clear(nextOwner) {
    epoch++;revision++;owner=nextOwner;snapshot=blank();nonce=null;oauth=null;statusTask=null;authorizationTask=null;
    const pending=activeConnect;activeConnect=null;pending?.cancel();
  }
  function context() {
    const account=getAccount();if(account!==owner)clear(account);
    if(!account||!canRequest())throw fail('calendar-account-unavailable',409);
    return {owner:account,epoch};
  }
  function guard(captured) {
    if(captured.epoch!==epoch||captured.owner!==owner||captured.owner!==getAccount())throw fail('calendar-account-changed',409);
    if(!canRequest())throw fail('calendar-account-unavailable',409);
  }
  async function verify(captured) {
    guard(captured);const result=await verifyAccount(captured.owner);guard(captured);
    if(result===false)throw fail('calendar-account-changed',409);
  }
  function status() {
    const account=getAccount();if(account!==owner)clear(account);
    return copy(snapshot);
  }
  const configured=()=>status().configured;
  function ready(input) {
    const value=status();let scopes;try{scopes=scopesOf(input);}catch{return false;}
    return !!(getAccount()&&canRequest()&&value.configured&&value.connected&&value.generation&&scopes.every(scope=>value.scopes.includes(scope)));
  }
  function authorizationReady(input) {
    let scopes;try{scopes=scopesOf(input);}catch{return false;}
    status();
    return !!(getAccount()&&canRequest()&&snapshot.configured&&nonce&&nonce.epoch===epoch&&nonce.owner===owner&&nonce.expiresAt>now()+1000&&same(nonce.scopes,scopes)&&(nonce.authorizationUrl||oauth?.initCodeClient));
  }
  function validateStatus(value,expectedKey='') {
    if(!value||value.ok!==true||typeof value.configured!=='boolean'||typeof value.connected!=='boolean'||!Array.isArray(value.scopes)||value.scopes.some(scope=>!ALLOWED.has(scope))||typeof value.accountKey!=='string'||!value.accountKey||typeof value.generation!=='string'||(value.connected&&!value.generation))throw fail('calendar-invalid-response',502);
    if(expectedKey&&value.accountKey!==expectedKey)throw fail('calendar-account-changed',409);
    return {ok:true,configured:value.configured,connected:value.connected,scopes:[...value.scopes],generation:value.generation,accountKey:value.accountKey,
      status:['DISCONNECTED','CONNECTED','RECONNECT_REQUIRED'].includes(value.status)?value.status:value.connected?'CONNECTED':'DISCONNECTED'};
  }
  async function api(action,captured,body,accountKey) {
    guard(captured);let response;
    try {response=await fetcher('/api/calendar/'+action,{method:body===undefined?'GET':'POST',credentials:'same-origin',cache:'no-store',redirect:'error',
      headers:{...(accountKey?{'X-Tanmay-Account-Key':accountKey}:{}),...(body===undefined?{}:{'Content-Type':'application/json','X-Requested-With':'XmlHttpRequest'})},
      ...(body===undefined?{}:{body:JSON.stringify(body)})});}
    catch {guard(captured);throw fail('calendar-network-unavailable');}
    guard(captured);
    if(response.status===204)return {};
    let value;try{value=await response.json();}catch{guard(captured);throw fail('calendar-invalid-response',response.status||502);}
    guard(captured);
    if(!response.ok){
      const reason=typeof value?.error==='string'?value.error:value?.error?.errors?.[0]?.reason||'calendar-request-failed';
      const error=fail(reason,response.status,value);error.reason=reason;throw error;
    }
    return value;
  }
  async function readStatus(captured) {
    const existing=statusTask;if(existing?.epoch===captured.epoch)return existing.promise;
    const before=revision,expectedKey=snapshot.accountKey;
    const task={epoch:captured.epoch};
    task.promise=(async()=>{
      await verify(captured);
      const value=validateStatus(await api('status',captured,undefined,expectedKey),expectedKey);
      guard(captured);
      if(before===revision){
        if(snapshot.generation!==value.generation)nonce=null;
        snapshot=value;
      }
      return copy(snapshot);
    })();
    statusTask=task;
    try{return await task.promise;}finally{if(statusTask===task)statusTask=null;}
  }
  async function prepare(input,{authorize=false}={}) {
    const scopes=scopesOf(input),captured=context();
    const value=await readStatus(captured);guard(captured);
    if(!authorize||!value.configured)return value;
    if(authorizationReady(scopes))return status();
    const key=JSON.stringify([captured.owner,captured.epoch,scopes]);
    if(authorizationTask?.key===key)return authorizationTask.promise;
    const task={key};
    task.promise=(async()=>{
      const expectedKey=snapshot.accountKey,before=revision;
      await verify(captured);
      const redirect=useRedirect();
      const [prepared,library]=await Promise.all([api('start',captured,{scopes,...(redirect?{mode:'redirect'}:{})},expectedKey),redirect?null:loadGoogle()]);
      guard(captured);
      if(before!==revision)throw fail('calendar-account-changed',409);
      if(!prepared||prepared.ok!==true||typeof prepared.nonce!=='string'||!prepared.nonce||!Number.isFinite(prepared.expiresAt)||prepared.expiresAt<=now()+1000||
        typeof prepared.clientId!=='string'||!/^[a-zA-Z0-9._-]+\.apps\.googleusercontent\.com$/.test(prepared.clientId)||!same(scopesOf(prepared.scopes),scopes)||(!redirect&&!library?.initCodeClient))throw fail('calendar-authorization-not-ready');
      let authorizationUrl;
      if(redirect){
        const target=new URL(prepared.authorizationUrl);
        if(target.origin!=='https://accounts.google.com'||target.pathname!=='/o/oauth2/v2/auth'||target.searchParams.get('state')!==prepared.nonce||
          target.searchParams.get('client_id')!==prepared.clientId||target.searchParams.get('response_type')!=='code'||
          !same(scopesOf(target.searchParams.get('scope')),scopes))throw fail('calendar-invalid-response');
        authorizationUrl=target.href;
      }
      oauth=library;nonce={...captured,nonce:prepared.nonce,expiresAt:prepared.expiresAt,clientId:prepared.clientId,scopes,accountKey:expectedKey,authorizationUrl};
      return status();
    })();
    authorizationTask=task;
    try{return await task.promise;}finally{if(authorizationTask===task)authorizationTask=null;}
  }
  // Intentionally not async: requestCode runs inside the original user tap.
  function connect(input) {
    let captured,scopes;
    try{scopes=scopesOf(input);captured=context();}catch(error){return Promise.reject(error);}
    if(ready(scopes))return Promise.resolve(status());
    const key=JSON.stringify([captured.owner,captured.epoch,scopes]);
    if(activeConnect?.key===key)return activeConnect.promise;
    if(!authorizationReady(scopes))return Promise.reject(fail('calendar-authorization-not-ready'));
    const prepared=nonce;nonce=null;revision++;
    const task={key,promise:null,cancel:null};let resolveTask,rejectTask,timer,finished=false,responding=false;
    task.promise=new Promise((resolve,reject)=>{resolveTask=resolve;rejectTask=reject;});
    const finish=(error,value)=>{
      if(finished)return;finished=true;clearTimeout(timer);if(activeConnect===task)activeConnect=null;
      if(error)rejectTask(error);else resolveTask(value);
    };
    task.cancel=()=>finish(fail('calendar-account-changed',409));
    activeConnect=task;
    timer=setTimeout(()=>finish(fail('calendar-authorization-timeout')),180000);
    const accept=async result=>{
      if(finished||responding)return;responding=true;
      try{
        guard(captured);
        if(result?.error)throw fail(result.error==='access_denied'?'calendar-consent-denied':'calendar-authorization-failed');
        if(!result?.code||typeof result.code!=='string'||result.state&&result.state!==prepared.nonce)throw fail('calendar-invalid-response',400);
        await verify(captured);
        if(finished)return;
        const connected=validateStatus(await api('connect',captured,{nonce:prepared.nonce,code:result.code},prepared.accountKey),prepared.accountKey);
        guard(captured);
        if(finished)return;
        if(!connected.connected||!scopes.every(scope=>connected.scopes.includes(scope)))throw fail('calendar-permission-required',403);
        revision++;snapshot=connected;finish(null,status());
      }catch(error){finish(error);}
    };
    try{
      // Top-level navigation also works in an installed iPhone app where the
      // popup may never open. The server receives and exchanges the code.
      if(prepared.authorizationUrl){guard(captured);navigate(prepared.authorizationUrl);return task.promise;}
      const client=oauth.initCodeClient({client_id:prepared.clientId,scope:scopes.join(' '),ux_mode:'popup',include_granted_scopes:false,state:prepared.nonce,
        callback:accept,error_callback:error=>{if(!responding)finish(fail(error?.type==='popup_closed'?'calendar-popup-closed':'calendar-popup-blocked'));}});
      guard(captured);client.requestCode();
    }catch(error){finish(error?.code?error:fail('calendar-popup-blocked'));}
    return task.promise;
  }
  async function request(path,opts={}) {
    const captured=context(),connection=status();
    if(!connection.configured||!connection.connected||!connection.generation)throw fail('calendar-reconnect-required',401);
    await verify(captured);
    try{
      const result=await api('request',captured,{path,method:opts.method||'GET',generation:connection.generation,
        ...(opts.body===undefined?{}:{body:opts.body}),...(opts.headers?{headers:opts.headers}:{})},connection.accountKey);
      guard(captured);
      if(snapshot.generation!==connection.generation)throw fail('calendar-account-changed',409);
      return result;
    }catch(error){
      guard(captured);
      if(snapshot.generation===connection.generation&&(error.status===401||error.code==='calendar-account-changed')){
        revision++;nonce=null;snapshot={...snapshot,connected:false,status:'RECONNECT_REQUIRED'};
      }
      throw error;
    }
  }
  async function disconnect() {
    let captured=context();
    if(!snapshot.accountKey)await readStatus(captured);
    guard(captured);
    const connection=copy(snapshot);
    // Invalidate local pending work before the first awaited disconnect action.
    epoch++;revision++;nonce=null;authorizationTask=null;statusTask=null;
    const pending=activeConnect;activeConnect=null;pending?.cancel();
    snapshot={...snapshot,connected:false,status:'DISCONNECTED'};captured={owner,epoch};
    await verify(captured);
    // Disconnect the current authenticated account even if an already-issued
    // code exchange completed just before this request reached the server.
    const value=validateStatus(await api('disconnect',captured,{},connection.accountKey),connection.accountKey);
    guard(captured);revision++;snapshot=value;return status();
  }
  return {status,prepare,ready,authorizationReady,configured,connect,request,disconnect,reset:()=>clear(getAccount())};
}
