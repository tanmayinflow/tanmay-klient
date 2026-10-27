import {cleanTogether,readTogether} from './together.js';
import {addDays,validDate,dayNumber,cycleSummary} from './togetherCycleData.js';

const marker='cycleRecorded', estimateMarker='cycleEstimate';
const periodFields=p=>({start:p.start,end:p.end||null});
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const range=p=>({start:{date:p.start},end:{date:addDays(p.end||p.start,1)}});
const properties=event=>event.extendedProperties?.private||{};
const owned=(event,kind)=>properties(event).tmApp==='1'&&properties(event).tmKind===kind;
const allDayRange=event=>!event.start?.dateTime&&!event.end?.dateTime&&!event.recurrence&&!event.recurringEventId&&validDate(event.start?.date)&&validDate(event.end?.date)&&event.end.date>event.start.date;
const matchesRange=(event,period)=>allDayRange(event)&&event.start.date===period.start&&event.end.date===addDays(period.end||period.start,1);
const eventPeriod=(event,today)=>{
  if(!allDayRange(event)||event.start.date>today||event.end.date>addDays(today,1)||dayNumber(event.end.date)-dayNumber(event.start.date)>61)return null;
  return {start:event.start.date,end:addDays(event.end.date,-1)};
};
export const cycleExportTitle=(lang,estimate=false)=>estimate?(lang==='en'?'Cycle · estimated window':'Cyklus · odhadované období'):(lang==='en'?'Cycle · recorded period':'Cyklus · zapsaná menstruace');
const estimateDescription=lang=>lang==='en'?'Approximate start window, not a confirmed period.':'Orientační rozmezí začátku, nikoli potvrzená menstruace.';
export function cycleCalendarEvent(period,lang='cs') {
  return {summary:cycleExportTitle(lang),...range(period),visibility:'private',transparency:'transparent',
    extendedProperties:{private:{tmApp:'1',tmKind:marker,tmPeriod:period.start,tmBase:JSON.stringify(periodFields(period))}}};
}
function basePeriod(event){
  try {
    const base=JSON.parse(properties(event).tmBase||'null');
    return validDate(base?.start)&&(base.end===null||(validDate(base?.end)&&base.end>=base.start&&dayNumber(base.end)-dayNumber(base.start)<=60))?periodFields(base):null;
  }catch{return null;}
}
function managedBody(previous,body,estimate=false){
  if(!previous)return body;
  // A person's Google title, description and unrelated private properties are
  // not app text. Only refresh our own bilingual labels when the language changes.
  const summary=[cycleExportTitle('cs',estimate),cycleExportTitle('en',estimate)].includes(previous.summary)?body.summary:previous.summary;
  const next={...body,summary,extendedProperties:{...previous.extendedProperties,private:{...properties(previous),...body.extendedProperties.private}}};
  if(estimate&&!['',undefined,estimateDescription('cs'),estimateDescription('en')].includes(previous.description))delete next.description;
  return next;
}
const needsPatch=(previous,body)=>Object.entries(body).some(([key,value])=>!same(previous[key],value));

// Own records only. API supplies the verified account; partner projections are
// never read. This dedicated calendar gets dates and neutral labels, not writing.
export async function syncOwnCycleCalendar({cfg,request,api,saveConfig,makeId,today,lang='cs',guard=()=>{}}) {
  if(cfg.cycle!==true)return {errors:0};
  // Check both sides of every await, including failed requests and the final
  // estimate write. No caught transport error may hide an account change.
  const call=async(fn,...args)=>{guard();try{return await fn(...args);}finally{guard();}};
  let errors=0,changed=false;
  const failed=error=>{guard();if(error?.code==='calendar-account-changed'||error?.message==='calendar-account-changed')throw error;errors++;};
  const patch=async(path,event,body)=>{
    if(!event.etag)throw new Error('cycle-event-missing-etag');
    return call(request,path+'/'+encodeURIComponent(event.id),{method:'PATCH',headers:{'If-Match':event.etag},body});
  };
  const profile=await call(api,'/api/personal-profile');
  if(!profile.profile?.ownCycle)return {errors:0};
  const accountKey=profile.accountKey;
  if(!accountKey)throw new Error('calendar-account-changed');
  const state=await call(api,'/api/together','GET',undefined,accountKey);
  if(!state.canTrack||!state.self?.doc)return {errors:0};
  const original=readTogether(state.self.doc);
  cleanTogether(original,today);
  const doc={...original,periods:original.periods.map(p=>({...p}))};
  let calId=cfg.cycleCalId;
  if(!calId){
    const cal=await call(request,'/calendars',{method:'POST',body:{summary:'tanmay · Cyklus',timeZone:'Europe/Prague'}});
    calId=cal.id;if(!calId)throw new Error('cycle-calendar-missing');
    await call(saveConfig,{cycleCalId:calId});
  }
  const path='/calendars/'+encodeURIComponent(calId)+'/events',events=[];let page='';
  do{
    const data=await call(request,path+'?showDeleted=true&maxResults=2500'+(page?'&pageToken='+encodeURIComponent(page):''));
    events.push(...(data.items||[]));page=data.nextPageToken||'';
  }while(page);
  const blocked=new Set(),assignments=new Map(),imports=[],counts=new Map();
  for(const event of events)if(owned(event,marker)){
    const key=properties(event).tmPeriod;
    counts.set(key,(counts.get(key)||0)+1);
  }
  for(const event of events) {
    const own=properties(event);
    if(owned(event,estimateMarker))continue;
    if(!owned(event,marker)){
      // Only an unmarked, explicitly named record in this dedicated calendar is
      // an import. Other apps' markers and generated-looking labels are ignored.
      if(!own.tmApp&&!own.tmKind&&event.status!=='cancelled'&&/^(menstruace|period)$/i.test((event.summary||'').trim())){
        const remote=eventPeriod(event,today);
        if(remote&&event.etag)imports.push({event,remote});else errors++;
      }
      continue;
    }
    const base=basePeriod(event),key=own.tmPeriod;
    if(!base||key!==base.start||counts.get(key)>1){if(key)blocked.add(key);errors++;continue;}
    let index=doc.periods.findIndex(p=>p.start===key);
    let local=index>=0?doc.periods[index]:null;
    if(event.status==='cancelled'){
      // A deleted Google copy is a conflict, never a request to erase history.
      if(local){blocked.add(key);errors++;}continue;
    }
    const remote=eventPeriod(event,today),remoteChanged=!matchesRange(event,base);
    if(!remote){blocked.add(key);errors++;continue;}
    // Recover a date move whose API save succeeded before its Google receipt
    // was updated. This also makes converging edits idempotent after a retry.
    if(!local&&remoteChanged){index=doc.periods.findIndex(p=>same(periodFields(p),remote));local=index>=0?doc.periods[index]:null;}
    const localChanged=local&&!same(periodFields(local),base);
    if(!local){if(remoteChanged){blocked.add(key);errors++;}else assignments.set(key,{event,removed:true});continue;}
    if(localChanged&&remoteChanged&&!matchesRange(event,local)){blocked.add(local.start);errors++;continue;}
    if(remoteChanged&&!matchesRange(event,local)){
      if(!event.etag){blocked.add(local.start);errors++;continue;}
      const next={...local,...remote};
      try{cleanTogether({...doc,periods:doc.periods.map((p,i)=>i===index?next:p)},today);}
      catch{blocked.add(local.start);errors++;continue;}
      doc.periods[index]=next;local=next;changed=true;
    }
    assignments.set(local.start,{event});
  }
  for(const {event,remote} of imports){
    const existing=doc.periods.find(p=>p.start===remote.start);
    if(existing){
      if(!matchesRange(event,existing)){blocked.add(existing.start);errors++;}
      else if(!blocked.has(existing.start)&&!assignments.has(existing.start))assignments.set(existing.start,{event});
      continue;
    }
    try{cleanTogether({...doc,periods:[...doc.periods,remote]},today);}catch{errors++;continue;}
    doc.periods.push(remote);changed=true;assignments.set(remote.start,{event});
  }
  if(changed){
    // Validation above checks the dates, but send the existing document without
    // normalizing or moving its private daily writing. The revision rejects a
    // concurrent edit before any Google acknowledgements or estimates are sent.
    await call(api,'/api/together/self','PUT',{doc,revision:state.self.revision},accountKey);
  }
  for(const period of doc.periods){
    if(blocked.has(period.start))continue;
    const previous=assignments.get(period.start)?.event,body=managedBody(previous,cycleCalendarEvent(period,lang));
    try{
      if(previous){if(needsPatch(previous,body))await patch(path,previous,body);}
      else{
        const id=makeId('own-cycle|'+period.start);
        try{await call(request,path,{method:'POST',body:{id,...body}});}
        catch(error){
          if(error.status!==409)throw error;
          const existing=await call(request,path+'/'+encodeURIComponent(id));
          if(!existing||existing.status==='cancelled'||!owned(existing,marker)||properties(existing).tmPeriod!==period.start||!matchesRange(existing,period)||!same(basePeriod(existing),periodFields(period)))throw error;
        }
      }
    }catch(error){failed(error);}
  }
  for(const {event,removed} of assignments.values())if(removed){
    try{await patch(path,event,{status:'cancelled'});}catch(error){failed(error);}
  }
  const next=cycleSummary(doc,today).next;
  const desired=next?{summary:cycleExportTitle(lang,true),...range({start:next.from,end:next.to}),visibility:'private',transparency:'transparent',description:estimateDescription(lang),extendedProperties:{private:{tmApp:'1',tmKind:estimateMarker,tmBase:JSON.stringify({start:next.from,end:next.to}),tmRetired:'0'}}}:null;
  const oldEstimates=events.filter(e=>owned(e,estimateMarker)&&e.status!=='cancelled');
  const desiredId=next?makeId('cycle-estimate|'+next.from):null;
  const estimateEdited=event=>basePeriod(event)&&!matchesRange(event,basePeriod(event));
  if(desired){
    try{
      let previous=oldEstimates.find(e=>e.id===desiredId);
      if(!previous){
        try{await call(request,path,{method:'POST',body:{id:desiredId,...desired}});}
        catch(error){
          if(error.status!==409)throw error;
          previous=await call(request,path+'/'+encodeURIComponent(desiredId));
          if(!previous||!owned(previous,estimateMarker)||(previous.status==='cancelled'&&properties(previous).tmRetired!=='1'))throw error;
        }
      }
      if(previous){
        if(estimateEdited(previous))throw new Error('cycle-estimate-conflict');
        const body=managedBody(previous,desired,true);
        // Only undo our own earlier retirement, never a person's Google deletion.
        if(previous.status==='cancelled')body.status='confirmed';
        if(needsPatch(previous,body))await patch(path,previous,body);
      }
    }catch(error){failed(error);}
  }
  for(const event of oldEstimates)if(event.id!==desiredId){
    try{
      if(estimateEdited(event))throw new Error('cycle-estimate-conflict');
      await patch(path,event,{status:'cancelled',extendedProperties:{...event.extendedProperties,private:{...properties(event),tmRetired:'1'}}});
    }catch(error){failed(error);}
  }
  guard();
  return {errors,changed};
}
