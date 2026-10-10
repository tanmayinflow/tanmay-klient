// Separate from generated training/motif events: these records belong to both calendars.
export const allDayFields = row => ({ title: row.title || '', start: row.start, end: row.end });
const same = (a,b) => JSON.stringify(a) === JSON.stringify(b);
export function googleAllDay(event, calendarId) {
  return {id: calendarId+'|'+event.id, gid:event.id, calendarId, title:event.summary||'', start:event.start?.date,
    end:event.end?.date, etag:event.etag, deleted:event.status==='cancelled',
    readOnly:event.eventType && event.eventType!=='default', base:{title:event.summary||'',start:event.start?.date,end:event.end?.date}};
}
export function mergeAllDaySync(current, before, after) {
  const old=new Map(before.map(r=>[r.id,r])), next=new Map(after.map(r=>[r.id,r]));
  return [...current.map(r=>{
    const result=next.get(r.id); next.delete(r.id);
    if(!result)return r;
    // An edit made while a request was in flight keeps its content and remains dirty.
    if(r.rev!==old.get(r.id)?.rev)return {...result,...r,gid:result.gid,calendarId:result.calendarId,etag:result.etag,base:result.base,syncRev:result.syncRev};
    return result;
  }),...next.values()];
}
export async function syncAllDay({rows,calendars,defaultCalendar,from,to,request,makeId,readOnlyCalendars=[]}) {
  const result=rows.map(r=>({...r})), byRemote=new Map(result.filter(r=>r.gid).map(r=>[r.calendarId+'|'+r.gid,r]));
  let errors=0;
  for(const calendarId of calendars){
    const path='/calendars/'+encodeURIComponent(calendarId)+'/events';
    const events=new Map(); let page='';
    try {
      do {const data=await request(path+'?singleEvents=true&showDeleted=true&maxResults=2500&timeMin='+encodeURIComponent(from+'T00:00:00Z')+'&timeMax='+encodeURIComponent(to+'T00:00:00Z')+(page?'&pageToken='+encodeURIComponent(page):''));
        for(const ev of data.items||[])events.set(ev.id,ev);page=data.nextPageToken||'';
      }while(page);
    } catch {errors++;continue;} // A failed read never means an empty calendar.
    for(const row of result.filter(r=>(r.calendarId||defaultCalendar)===calendarId)){
      let remote=row.gid?events.get(row.gid):null;
      if(row.gid&&!remote){
        try{remote=await request(path+'/'+encodeURIComponent(row.gid));}
        catch(e){if(e.status===404||e.status===410)remote={id:row.gid,status:'cancelled'};else{errors++;continue;}}
      }
      if(remote)events.delete(remote.id);
      const dirty=row.rev!==row.syncRev;
      if(remote?.status==='cancelled'){Object.assign(row,{deleted:true,syncRev:row.rev,conflict:null});continue;}
      const theirs=remote&&googleAllDay(remote,calendarId);
      if(theirs&&readOnlyCalendars.includes(calendarId))theirs.readOnly=true;
      if(theirs && !dirty){Object.assign(row,theirs,{id:row.id,rev:row.rev,syncRev:row.rev,conflict:null});continue;}
      if(theirs && row.base && !same(row.base,allDayFields(theirs))){row.conflict=theirs;continue;}
      if(!dirty||row.readOnly||readOnlyCalendars.includes(calendarId))continue;
      if(row.deleted&&!row.gid){row.syncRev=row.rev;continue;}
      if(!row.deleted&&(!row.title.trim()||!/^\d{4}-\d{2}-\d{2}$/.test(row.start)||!(row.end>row.start))){errors++;continue;}
      try{
        let saved;
        if(row.gid){
          saved=await request(path+'/'+encodeURIComponent(row.gid),{method:'PATCH',headers:{'If-Match':remote.etag},body:row.deleted?{status:'cancelled'}:{summary:row.title,start:{date:row.start},end:{date:row.end}}});
        }else{
          const gid=makeId('allDay|'+row.id),body={id:gid,summary:row.title,start:{date:row.start},end:{date:row.end},extendedProperties:{private:{tmApp:'1',tmKind:'allDay',tmLocal:row.id}}};
          try{saved=await request(path,{method:'POST',body});}
          catch(e){if(e.status!==409)throw e;saved=await request(path+'/'+gid);if(saved.extendedProperties?.private?.tmLocal!==row.id)throw e;}
        }
        Object.assign(row,{gid:saved.id||row.gid,calendarId,etag:saved.etag,base:allDayFields(row),syncRev:row.rev,conflict:null});
        events.delete(row.gid);byRemote.set(calendarId+'|'+row.gid,row);
      }catch(e){errors++;if(e.status===412)row.conflict={pending:true};}
    }
    for(const event of events.values()){
      const own=event.extendedProperties?.private;
      if(!event.start?.date||event.status==='cancelled'||(own?.tmApp==='1'&&own.tmKind!=='allDay')||event.attendees?.some(a=>a.self&&a.responseStatus==='declined'))continue;
      const key=calendarId+'|'+event.id;if(byRemote.has(key))continue;
      const row=googleAllDay(event,calendarId);if(readOnlyCalendars.includes(calendarId))row.readOnly=true;row.rev=0;row.syncRev=0;result.push(row);byRemote.set(key,row);
    }
  }
  return {rows:result,errors};
}
