// Separate app-created calendar. OAuth tokens are deliberately absent from persisted state.
export const TOGETHER_CALENDAR_SCOPE='https://www.googleapis.com/auth/calendar.app.created';
export const emptyTogetherCalendar=()=>({clientId:'',calendarId:'',calendarName:'tanmay · Spolu',timeZone:'Europe/Prague',linkId:'',syncToken:'',events:{},conflicts:[],lastSync:0});
const string=(value,max=500)=>typeof value==='string'?value.slice(0,max):'';
export function cleanTogetherCalendar(value){
  if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('invalid-calendar');
  const config=emptyTogetherCalendar();
  for(const key of ['clientId','calendarId','calendarName','timeZone','linkId','syncToken'])config[key]=string(value[key],key==='syncToken'?3000:500);
  if(config.clientId&&!/^[a-zA-Z0-9._-]+\.apps\.googleusercontent\.com$/.test(config.clientId))throw new Error('invalid-client-id');
  try{new Intl.DateTimeFormat('en',{timeZone:config.timeZone}).format();}catch{throw new Error('invalid-time-zone');}
  const entries=Object.entries(value.events||{});if(entries.length>4000)throw new Error('calendar-too-large');
  for(const [id,item] of entries){if(!/^[a-zA-Z0-9_-]{1,1024}$/.test(id)||!item||typeof item!=='object')throw new Error('invalid-calendar-event');config.events[id]={planId:string(item.planId,40),etag:string(item.etag),planRevision:Number.isInteger(item.planRevision)?item.planRevision:-1,hash:string(item.hash,2500),deleted:!!item.deleted};}
  config.conflicts=(Array.isArray(value.conflicts)?value.conflicts:[]).slice(0,100).map(item=>({eventId:string(item.eventId,1024),planId:string(item.planId,40),reason:string(item.reason,50),title:string(item.title,120),appWhen:string(item.appWhen,40),googleTitle:string(item.googleTitle,120),googleWhen:string(item.googleWhen,40),googleCancelled:!!item.googleCancelled}));
  config.lastSync=Number.isFinite(value.lastSync)?value.lastSync:0;return config;
}
export const planCalendarHash=plan=>JSON.stringify([plan.title,plan.date,plan.time,plan.minutes,plan.note||'',plan.status==='cancelled']);
export function zonedDateParts(value,timeZone){
  const parts=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date(value)).map(part=>[part.type,part.value]));
  return {date:`${parts.year}-${parts.month}-${parts.day}`,time:`${parts.hour}:${parts.minute}`};
}
export function localPlanInstant(date,time,timeZone){
  const target=Date.parse(`${date}T${time}:00Z`);let result=target;
  for(let i=0;i<4;i++){const parts=zonedDateParts(result,timeZone);const represented=Date.parse(`${parts.date}T${parts.time}:00Z`);result+=target-represented;}
  const check=zonedDateParts(result,timeZone);if(check.date!==date||check.time!==time)throw new Error('nonexistent-local-time');return result;
}
export function planToGoogleEvent(plan,timeZone,linkId){
  const start=localPlanInstant(plan.date,plan.time,timeZone);
  return {summary:plan.title,description:plan.note||'',start:{dateTime:new Date(start).toISOString(),timeZone},end:{dateTime:new Date(start+plan.minutes*60000).toISOString(),timeZone},extendedProperties:{private:{tanmayTogether:'v1',tanmayPlan:plan.id,tanmayLink:linkId}}};
}
export function googleEventToPlan(event,timeZone){
  if(event.status==='cancelled')return {cancelled:true};
  if(!event.start?.dateTime||!event.end?.dateTime||event.recurrence||event.recurringEventId)return null;
  const minutes=Math.round((Date.parse(event.end.dateTime)-Date.parse(event.start.dateTime))/60000);
  if(!Number.isFinite(minutes)||minutes<10||minutes>1440||!event.summary?.trim())return null;
  return {title:event.summary.trim().slice(0,120),...zonedDateParts(event.start.dateTime,timeZone),minutes,note:string(event.description,600)};
}
export function calendarSyncDecision(plan,event,mapping,timeZone){
  if(!mapping)return event?'import':plan?.status==='planned'&&plan.approved?.owner&&plan.approved?.partner?'create':'wait';
  if(!plan)return 'orphan';
  const remote=event?googleEventToPlan(event,timeZone):null;
  const localChanged=plan.revision!==mapping.planRevision&&planCalendarHash(plan)!==mapping.hash;
  const remoteChanged=!!event&&event.etag!==mapping.etag&&(event.status==='cancelled'||remote&&planCalendarHash({...remote,status:'planned'})!==mapping.hash);
  if(localChanged&&remoteChanged)return 'conflict';
  if(remoteChanged)return remote?'import':'unsupported';
  if(plan.status==='cancelled'&&!mapping.deleted)return 'delete';
  if(localChanged&&plan.status==='planned'&&plan.approved?.owner&&plan.approved?.partner)return 'update';
  return 'wait';
}
export async function googleCalendarRequest(token,path,{method='GET',body,etag,fetcher=fetch}={}){
  const response=await fetcher(`https://www.googleapis.com/calendar/v3${path}`,{method,headers:{Authorization:`Bearer ${token}`,...(body?{'Content-Type':'application/json'}:{}),...(etag?{'If-Match':etag}:{})},...(body?{body:JSON.stringify(body)}:{})});
  if(!response.ok){const error=new Error(response.status===401?'google-sign-in-required':response.status===412?'google-conflict':response.status===410?'google-full-sync-required':'google-request-failed');error.status=response.status;throw error;}
  return response.status===204?{}:response.json();
}
export async function listGoogleChanges(token,config,request=googleCalendarRequest){
  const base=`/calendars/${encodeURIComponent(config.calendarId)}/events`;
  let syncToken=config.syncToken,reset=false;
  for(let attempt=0;attempt<2;attempt++){
    const items=[];let pageToken='',nextSyncToken='';
    try{do{const params=new URLSearchParams({maxResults:'2500',showDeleted:'true'});if(syncToken)params.set('syncToken',syncToken);if(pageToken)params.set('pageToken',pageToken);const result=await request(token,`${base}?${params}`);items.push(...(result.items||[]));pageToken=result.nextPageToken||'';nextSyncToken=result.nextSyncToken||nextSyncToken;}while(pageToken);return {items,syncToken:nextSyncToken,reset};}
    catch(error){if(error.status!==410||!syncToken)throw error;syncToken='';reset=true;}
  }
  throw new Error('google-request-failed');
}
export async function importedPlanId(calendarId,eventId){const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(`${calendarId}:${eventId}`));const hex=Array.from(new Uint8Array(digest)).map(n=>n.toString(16).padStart(2,'0')).join('').slice(0,32);return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;}
