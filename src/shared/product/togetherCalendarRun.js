import {calendarSyncDecision,googleCalendarRequest,listGoogleChanges,googleEventToPlan,planToGoogleEvent,planCalendarHash,importedPlanId} from './togetherCalendarSync.js';

function conflictSnapshot(plan,event,eventId,reason,timeZone){const google=event?googleEventToPlan(event,timeZone):null;return {eventId,planId:plan.id,reason,title:plan.title,appWhen:`${plan.date} ${plan.time}`,googleTitle:google?.title||event?.summary||'',googleWhen:google?.date?`${google.date} ${google.time}`:'',googleCancelled:event?.status==='cancelled'};}

// api is the authenticated Together API. No personal journal/cycle object is accepted here.
export async function syncTogetherCalendar({token,config,api,checkpoint,resolve={},request=googleCalendarRequest}){
  let current={...config,events:{...config.events},conflicts:[]};
  let state=await api('');
  if(state.link?.status!=='active'||state.link.id!==config.linkId)throw new Error('not-connected');
  const changes=await listGoogleChanges(token,config,request),remote=new Map(changes.items.map(event=>[event.id,event]));
  const eventBase=`/calendars/${encodeURIComponent(config.calendarId)}/events`;
  // Conflicts survive cursor advancement and are re-read until explicitly resolved.
  for(const conflict of config.conflicts||[])if(!remote.has(conflict.eventId)){try{remote.set(conflict.eventId,await request(token,`${eventBase}/${encodeURIComponent(conflict.eventId)}`));}catch(error){if(error.status===404||error.status===410)remote.set(conflict.eventId,{id:conflict.eventId,status:'cancelled',etag:'deleted'});else throw error;}}
  const plans=new Map(state.plans.map(plan=>[plan.id,plan]));
  const stats={imported:0,exported:0,conflicts:0,ignored:0};
  // Keep mappings on 410; only the provider cursor is reset. Missing items are checked individually.
  if(changes.reset)for(const [id,mapping] of Object.entries(current.events)){if(mapping.deleted||remote.has(id))continue;try{remote.set(id,await request(token,`${eventBase}/${encodeURIComponent(id)}`));}catch(error){if(error.status===404||error.status===410)remote.set(id,{id,status:'cancelled',etag:'deleted'});else throw error;}}
  const ids=new Set([...remote.keys(),...Object.keys(current.events)]);
  for(const plan of state.plans){if(!Object.values(current.events).some(item=>item.planId===plan.id)&&plan.status==='planned'&&plan.approved?.owner&&plan.approved?.partner)ids.add(`tm${plan.id.replaceAll('-','')}`);}
  for(const eventId of ids){
    const event=remote.get(eventId);let mapping=current.events[eventId];
    let plan=mapping?plans.get(mapping.planId):event?.extendedProperties?.private?.tanmayLink===config.linkId?plans.get(event.extendedProperties.private.tanmayPlan):[...plans.values()].find(item=>`tm${item.id.replaceAll('-','')}`===eventId);
    // Recover a successful remote insertion followed by a failed checkpoint without duplicates.
    if(!mapping&&plan&&event?.extendedProperties?.private?.tanmayLink===config.linkId){
      const recovered=googleEventToPlan(event,config.timeZone),same=recovered&&!recovered.cancelled&&planCalendarHash({...recovered,status:'planned'})===planCalendarHash(plan);
      mapping={planId:plan.id,planRevision:same?plan.revision:-1,hash:same?planCalendarHash(plan):'uncheckpointed',etag:same?event.etag:'uncheckpointed',deleted:false};
      current.events[eventId]=mapping;
    }
    if(!mapping&&event&&(event.status==='cancelled'||event.extendedProperties?.private?.tanmayLink&&event.extendedProperties.private.tanmayLink!==config.linkId))continue;
    let decision=calendarSyncDecision(plan,event,mapping,config.timeZone);
    if(decision==='conflict')decision=resolve[eventId]==='app'?(plan.status==='cancelled'?'delete':plan.approved?.owner&&plan.approved?.partner?'update':'conflict'):resolve[eventId]==='google'?'import':'conflict';
    if(decision==='conflict'){current.conflicts.push(conflictSnapshot(plan,event,eventId,'both-changed',config.timeZone));stats.conflicts++;continue;}
    if(decision==='orphan'||decision==='unsupported'){stats.ignored++;continue;}
    if(decision==='wait'){if(mapping)current.events[eventId]=mapping;continue;}
    // Each write uses a fresh pair and plan revision; another device cannot be silently overwritten.
    state=await api('');if(state.link?.id!==config.linkId||state.link.status!=='active')throw new Error('not-connected');
    const fresh=plan?state.plans.find(item=>item.id===plan.id):null;
    if(plan&&(!fresh||fresh.revision!==plan.revision)){current.conflicts.push(conflictSnapshot(fresh||plan,event,eventId,'plan-changed',config.timeZone));stats.conflicts++;continue;}
    if(decision==='import'){
      const incoming=googleEventToPlan(event,config.timeZone);if(!incoming){stats.ignored++;continue;}
      if(incoming.cancelled&&!plan)continue;
      const id=plan?.id||await importedPlanId(config.calendarId,eventId);
      // Deterministic ID also recovers an import whose following checkpoint was interrupted.
      const existing=plan||state.plans.find(item=>item.id===id);
      if(!plan&&existing){current.events[eventId]={planId:id,planRevision:existing.revision,hash:planCalendarHash(existing),etag:event.etag||'',deleted:false};await checkpoint(current);continue;}
      await api('/plan','PUT',incoming.cancelled?{id,revision:plan.revision,action:'cancel'}:{...incoming,id,...(plan?{revision:plan.revision}:{})});
      const saved=(await api('')).plans.find(item=>item.id===id);if(!saved)throw new Error('plan-not-saved');
      current.events[eventId]={planId:id,planRevision:saved.revision,hash:planCalendarHash(saved),etag:event.etag||'',deleted:!!incoming.cancelled};plans.set(id,saved);stats.imported++;
    }else{
      let saved;
      try{
        if(decision==='delete'){try{await request(token,`${eventBase}/${encodeURIComponent(eventId)}`,{method:'DELETE',etag:event?.etag||mapping?.etag});}catch(error){if(error.status!==404&&error.status!==410)throw error;}saved={etag:event?.etag||mapping?.etag||''};}
        else if(decision==='create'){
          try{saved=await request(token,eventBase,{method:'POST',body:{id:eventId,...planToGoogleEvent(plan,config.timeZone,config.linkId)}});}
          catch(error){if(error.status!==409)throw error;saved=await request(token,`${eventBase}/${encodeURIComponent(eventId)}`);if(saved.extendedProperties?.private?.tanmayPlan!==plan.id||saved.extendedProperties?.private?.tanmayLink!==config.linkId)throw new Error('google-event-collision');}
        }else saved=await request(token,`${eventBase}/${encodeURIComponent(eventId)}`,{method:'PATCH',etag:event?.etag||mapping?.etag,body:planToGoogleEvent(plan,config.timeZone,config.linkId)});
      }catch(error){if(error.status===412){current.conflicts.push(conflictSnapshot(plan,event,eventId,'google-changed',config.timeZone));stats.conflicts++;continue;}throw error;}
      current.events[eventId]={planId:plan.id,planRevision:plan.revision,hash:planCalendarHash(plan),etag:saved.etag||'',deleted:decision==='delete'};stats.exported++;
    }
    // A partial run remains recoverable, including imported plan approvals and provider ETags.
    await checkpoint(current);
  }
  current={...current,syncToken:changes.syncToken,lastSync:Date.now()};await checkpoint(current);return {config:current,...stats};
}
