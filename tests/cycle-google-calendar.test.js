import test from 'node:test';
import assert from 'node:assert/strict';
import {syncOwnCycleCalendar,cycleCalendarEvent,cycleExportTitle} from '../src/shared/product/cycleGoogleCalendar.js';
import {calendarPublicConfig} from '../src/shared/product/calendarPublicConfig.js';
function fixture(){
  const doc={periods:[{start:'2026-10-02',end:'2026-10-06'}],mode:'estimate',usualLength:28,modeChosen:false,days:{'2026-10-02':{note:'PRIVATE JOURNAL',cycleNote:'PRIVATE SYMPTOMS',mood:'PRIVATE'}}};
  const events=new Map(),calls=[],apiCalls=[];let revision=1,tracking=true;
  const api=async(path,method='GET',body,key)=>{
    apiCalls.push({path,method,body:structuredClone(body),key});
    if(path==='/api/personal-profile')return {profile:{ownCycle:tracking},accountKey:'own'};
    assert.equal(key,'own');
    if(method==='PUT'){assert.equal(body.revision,revision);Object.assign(doc,body.doc);revision++;return {ok:true,revision};}
    return {canTrack:tracking,self:{doc:structuredClone(doc),revision},partner:{periods:[{start:'2000-01-01'}],note:'PARTNER PRIVATE'}};
  };
  const request=async(path,opts={})=>{calls.push({path,...opts});
    if(path.includes('?'))return {items:structuredClone([...events.values()])};
    if(path==='/calendars')return {id:'cycle'};
    if(opts.method==='POST'){const e={...opts.body,etag:'v1'};if(events.has(e.id))throw Object.assign(Error('exists'),{status:409});events.set(e.id,e);return structuredClone(e);}
    const id=path.split('/').at(-1),old=events.get(id);
    if(!old)throw Object.assign(Error('missing'),{status:404});
    if(opts.method==='PATCH'){assert.ok(opts.headers['If-Match']);if(opts.headers['If-Match']!==old.etag)throw Object.assign(Error('conflict'),{status:412});const e={...old,...opts.body,etag:old.etag+'v'};events.set(id,e);return structuredClone(e);}
    return structuredClone(old);
  };
  const input={cfg:{cycle:true,cycleCalId:'cycle'},request,api,saveConfig:()=>{},makeId:s=>s.replace(/[^a-z0-9]/g,''),today:'2026-10-27'};
  return {doc,events,calls,apiCalls,input,disableTracking:()=>tracking=false};
}
test('cycle export requires explicit consent and own tracking, never reads partner data',async()=>{
  const f=fixture();await syncOwnCycleCalendar({...f.input,cfg:{}});assert.equal(f.calls.length,0);
  f.disableTracking();await syncOwnCycleCalendar(f.input);assert.equal(f.calls.length,0);
});
test('recorded dates and marked estimate export once without notes or symptoms',async()=>{
  const f=fixture();assert.equal((await syncOwnCycleCalendar(f.input)).errors,0);
  assert.equal(f.events.size,2);assert.doesNotMatch(JSON.stringify(f.calls),/PRIVATE|2000-01-01/);
  assert.ok([...f.events.values()].every(e=>e.visibility==='private'));
  f.calls.length=0;await syncOwnCycleCalendar(f.input);assert.equal(f.calls.filter(c=>c.method==='POST').length,0);
});
test('Google date move updates own record, preserves notes and refreshes estimates',async()=>{
  const f=fixture();await syncOwnCycleCalendar(f.input);
  const e=[...f.events.values()].find(e=>e.extendedProperties.private.tmKind==='cycleRecorded');
  Object.assign(e,{start:{date:'2026-10-04'},end:{date:'2026-10-09'},etag:'remote'});
  const result=await syncOwnCycleCalendar(f.input);assert.equal(result.errors,0);
  assert.deepEqual(f.doc.periods,[{start:'2026-10-04',end:'2026-10-08'}]);assert.equal(f.doc.days['2026-10-02'].note,'PRIVATE JOURNAL');
});
test('conflicting changes and Google deletion preserve actual history',async()=>{
  const f=fixture();await syncOwnCycleCalendar(f.input);
  const e=[...f.events.values()].find(e=>e.extendedProperties.private.tmKind==='cycleRecorded');
  f.doc.periods[0].end='2026-10-07';e.end={date:'2026-10-09'};
  assert.ok((await syncOwnCycleCalendar(f.input)).errors>0);assert.equal(f.doc.periods[0].end,'2026-10-07');
  e.status='cancelled';assert.ok((await syncOwnCycleCalendar(f.input)).errors>0);assert.equal(f.doc.periods.length,1);
});
test('future or overlapping Google dates cannot become actual recorded periods',async()=>{
  const f=fixture();f.events.set('future',{id:'future',summary:'Menstruace',start:{date:'2026-11-04'},end:{date:'2026-11-08'}});
  f.events.set('overlap',{id:'overlap',summary:'Menstruace',start:{date:'2026-10-03'},end:{date:'2026-10-05'}});
  assert.equal((await syncOwnCycleCalendar(f.input)).errors,2);assert.equal(f.doc.periods.length,1);
});
test('public calendar config exposes only configured public ID',()=>{
  assert.deepEqual(calendarPublicConfig({GOOGLE_CLIENT_SECRET:'PRIVATE',GOOGLE_CLIENT_ID:'login.apps.googleusercontent.com'}),{ok:true,configured:false,clientId:''});
  assert.deepEqual(calendarPublicConfig({GOOGLE_CALENDAR_CLIENT_ID:'calendar.apps.googleusercontent.com',GOOGLE_CLIENT_SECRET:'PRIVATE'}),{ok:true,configured:true,clientId:'calendar.apps.googleusercontent.com'});
  assert.equal(cycleCalendarEvent({start:'2026-10-01',end:null}).end.date,'2026-10-02');
});
const recorded=f=>[...f.events.values()].find(e=>e.extendedProperties?.private?.tmKind==='cycleRecorded');
const estimate=f=>[...f.events.values()].find(e=>e.extendedProperties?.private?.tmKind==='cycleEstimate'&&e.status!=='cancelled');
const manual=(id,start,end,extra={})=>({id,etag:'manual',summary:'Menstruace',start:{date:start},end:{date:end},...extra});

test('same estimate start refreshes its changed end and generated language without a duplicate',async()=>{
  const f=fixture();await syncOwnCycleCalendar(f.input);
  const old=structuredClone(estimate(f));
  f.doc.periods.unshift({start:'2026-08-09',end:'2026-08-13'},{start:'2026-09-05',end:'2026-09-09'});
  f.calls.length=0;
  assert.equal((await syncOwnCycleCalendar({...f.input,lang:'en'})).errors,0);
  const next=estimate(f);
  assert.equal(next.id,old.id);assert.equal(next.start.date,old.start.date);
  assert.equal(next.end.date,'2026-11-02');assert.notEqual(next.end.date,old.end.date);
  assert.equal(next.summary,cycleExportTitle('en',true));
  assert.match(next.description,/Approximate start window/);
  assert.equal(recorded(f).summary,cycleExportTitle('en'));
  assert.ok(f.calls.some(c=>c.method==='PATCH'&&c.path.endsWith(old.id)));
  f.calls.length=0;await syncOwnCycleCalendar({...f.input,lang:'en'});
  assert.equal(f.calls.filter(c=>c.method).length,0);
});
test('custom Google labels, descriptions, unrelated properties and private app writing are preserved',async()=>{
  const f=fixture();await syncOwnCycleCalendar(f.input);
  const rec=recorded(f),est=estimate(f);
  rec.summary='My label';rec.description='My Google note';rec.extendedProperties.private.custom='KEEP';
  est.summary='My estimate';est.description='My estimate note';
  const days=structuredClone(f.doc.days);
  rec.start={date:'2026-10-03'};rec.end={date:'2026-10-08'};rec.etag='changed';
  f.calls.length=0;assert.equal((await syncOwnCycleCalendar({...f.input,lang:'en'})).errors,0);
  const saved=f.events.get(rec.id);
  assert.equal(saved.summary,'My label');assert.equal(saved.description,'My Google note');
  assert.equal(saved.extendedProperties.private.custom,'KEEP');assert.deepEqual(f.doc.days,days);
  assert.doesNotMatch(JSON.stringify(f.calls),/PRIVATE JOURNAL|PRIVATE SYMPTOMS|PARTNER PRIVATE/);
  assert.equal(f.events.get(est.id).description,'My estimate note');
});
test('only exact unmarked menstruace or period imports and retains manual Google notes',async()=>{
  const f=fixture();
  f.events.set('manual',manual('manual','2026-09-01','2026-09-06',{summary:' period ',description:'Keep this'}));
  f.events.set('alias',manual('alias','2026-08-01','2026-08-06',{summary:'Cycle · recorded period'}));
  f.events.set('foreign',manual('foreign','2026-07-01','2026-07-06',{extendedProperties:{private:{tmApp:'other',tmKind:'cycleRecorded'}}}));
  f.events.set('foreignEstimate',manual('foreignEstimate','2026-08-01','2026-08-06',{extendedProperties:{private:{tmApp:'other',tmKind:'cycleEstimate'}}}));
  assert.equal((await syncOwnCycleCalendar(f.input)).errors,0);
  assert.deepEqual(f.doc.periods.map(p=>p.start).sort(),['2026-09-01','2026-10-02']);
  assert.equal(f.events.get('manual').extendedProperties.private.tmApp,'1');
  assert.equal(f.events.get('manual').summary,' period ');assert.equal(f.events.get('manual').description,'Keep this');
  assert.ok(!f.calls.some(c=>c.method==='PATCH'&&/alias|foreign/.test(c.path)));
});
test('matching manual record is adopted instead of creating a duplicate',async()=>{
  const f=fixture();f.events.set('manual',manual('manual','2026-10-02','2026-10-07'));
  assert.equal((await syncOwnCycleCalendar(f.input)).errors,0);
  assert.equal(f.doc.periods.length,1);assert.equal(recorded(f).id,'manual');
  assert.equal(f.events.size,2);assert.equal(f.apiCalls.filter(c=>c.method==='PUT').length,0);
});
test('timed, recurring, missing-etag and malformed base records never change own history',async()=>{
  const f=fixture();await syncOwnCycleCalendar(f.input);const rec=recorded(f);
  rec.extendedProperties.private.tmBase=JSON.stringify({start:'2026-10-02',end:'invalid'});
  f.events.set('timed',manual('timed','2026-09-01','2026-09-06',{start:{date:'2026-09-01',dateTime:'2026-09-01T10:00:00Z'}}));
  f.events.set('recurring',manual('recurring','2026-08-01','2026-08-06',{recurrence:['RRULE:FREQ=MONTHLY']}));
  f.events.set('noetag',manual('noetag','2026-07-01','2026-07-06',{etag:undefined}));
  assert.equal((await syncOwnCycleCalendar(f.input)).errors,4);
  assert.deepEqual(f.doc.periods,[{start:'2026-10-02',end:'2026-10-06'}]);
});
test('missing etags and concurrent Google edits cannot cause unconditional writes',async()=>{
  const f=fixture();await syncOwnCycleCalendar(f.input);
  const rec=recorded(f);delete rec.etag;f.doc.periods[0].end='2026-10-07';f.calls.length=0;
  assert.equal((await syncOwnCycleCalendar(f.input)).errors,1);
  assert.ok(!f.calls.some(c=>c.method==='PATCH'&&c.path.endsWith(rec.id)));
  rec.etag='listed';const request=f.input.request;
  f.input.request=async(path,opts)=>{if(opts?.method==='PATCH'&&path.endsWith(rec.id)){rec.etag='raced';rec.end={date:'2026-10-10'};}return request(path,opts);};
  assert.equal((await syncOwnCycleCalendar(f.input)).errors,1);
  assert.equal(rec.end.date,'2026-10-10');assert.equal(f.doc.periods[0].end,'2026-10-07');
});
test('convergent and interrupted Google moves checkpoint without duplicate history or events',async()=>{
  const f=fixture();await syncOwnCycleCalendar(f.input);const rec=recorded(f);
  rec.start={date:'2026-10-04'};rec.end={date:'2026-10-09'};rec.etag='remote';
  const request=f.input.request;
  f.input.request=(path,opts)=>opts?.method==='PATCH'&&path.endsWith(rec.id)?Promise.reject(Object.assign(Error('offline'),{status:503})):request(path,opts);
  assert.ok((await syncOwnCycleCalendar(f.input)).errors>0);
  assert.deepEqual(f.doc.periods,[{start:'2026-10-04',end:'2026-10-08'}]);
  f.input.request=request;f.calls.length=0;
  assert.equal((await syncOwnCycleCalendar(f.input)).errors,0);
  assert.equal([...f.events.values()].filter(e=>e.extendedProperties?.private?.tmKind==='cycleRecorded').length,1);
  assert.equal(f.events.get(rec.id).extendedProperties.private.tmPeriod,'2026-10-04');
  assert.equal(f.calls.filter(c=>c.method==='POST').length,0);
});
test('local revision conflict aborts before remote acknowledgements or estimate changes',async()=>{
  const f=fixture();await syncOwnCycleCalendar(f.input);recorded(f).end={date:'2026-10-09'};
  const api=f.input.api;f.input.api=(...args)=>args[1]==='PUT'?Promise.reject(Object.assign(Error('conflict'),{status:409})):api(...args);
  f.calls.length=0;await assert.rejects(syncOwnCycleCalendar(f.input),/conflict/);
  assert.equal(f.calls.filter(c=>c.method).length,0);assert.equal(f.doc.periods[0].end,'2026-10-06');
});
test('changed estimate is a conflict and never becomes recorded history',async()=>{
  const f=fixture();await syncOwnCycleCalendar(f.input);const est=estimate(f);
  est.end={date:'2026-11-10'};est.etag='edited';
  assert.equal((await syncOwnCycleCalendar(f.input)).errors,1);
  assert.equal(f.events.get(est.id).end.date,'2026-11-10');assert.equal(f.doc.periods.length,1);
  f.doc.mode='observe';f.doc.modeChosen=true;
  assert.equal((await syncOwnCycleCalendar(f.input)).errors,1);assert.notEqual(f.events.get(est.id).status,'cancelled');
});
test('a 409 ID collision is recovered only for a matching owned event',async()=>{
  const f=fixture();await syncOwnCycleCalendar(f.input);
  const request=f.input.request;f.input.request=(path,opts)=>path.includes('?')?Promise.resolve({items:[]}):request(path,opts);
  assert.equal((await syncOwnCycleCalendar(f.input)).errors,0);
  recorded(f).extendedProperties.private.tmApp='other';estimate(f).extendedProperties.private.tmApp='other';
  f.calls.length=0;assert.equal((await syncOwnCycleCalendar(f.input)).errors,2);
  assert.equal(f.calls.filter(c=>c.method==='PATCH').length,0);
});
test('account changes around profile, data, calendar creation, save and mutations stop every later request',async()=>{
  for(const stage of ['before','profile','self','create','save','list','record','estimate','estimatePatch','cancel','put']){
    const f=fixture();
    if(['estimatePatch','cancel','put'].includes(stage))await syncOwnCycleCalendar(f.input);
    if(stage==='estimatePatch')f.input.lang='en';
    if(stage==='cancel'){f.doc.mode='observe';f.doc.modeChosen=true;}
    if(stage==='put')recorded(f).end={date:'2026-10-09'};
    let current=stage!=='before',switched=false,afterSwitch=0;
    const change=()=>{current=false;switched=true;};
    const api=f.input.api,request=f.input.request;
    f.input.guard=()=>{if(!current)throw Object.assign(Error('calendar-account-changed'),{code:'calendar-account-changed'});};
    f.input.api=async(...args)=>{
      if(!current)afterSwitch++;
      const result=await api(...args);
      if((stage==='profile'&&args[0]==='/api/personal-profile')||(stage==='self'&&args[0]==='/api/together')||(stage==='put'&&args[1]==='PUT'))change();
      return result;
    };
    f.input.request=async(path,opts)=>{
      if(!current)afterSwitch++;
      const result=await request(path,opts),kind=opts?.body?.extendedProperties?.private?.tmKind;
      if((stage==='create'&&path==='/calendars')||(stage==='list'&&path.includes('?'))||(stage==='record'&&kind==='cycleRecorded')||(stage==='estimate'&&kind==='cycleEstimate')||(stage==='estimatePatch'&&kind==='cycleEstimate'&&opts.method==='PATCH')||(stage==='cancel'&&opts?.body?.status==='cancelled'))change();
      return result;
    };
    if(['create','save'].includes(stage))f.input.cfg.cycleCalId='';
    f.input.saveConfig=()=>{if(!current)afterSwitch++;if(stage==='save')change();};
    await assert.rejects(syncOwnCycleCalendar(f.input),/calendar-account-changed/,stage);
    assert.ok(switched||stage==='before',stage);assert.equal(afterSwitch,0,stage);
  }
});
test('an account change during a failed mutation is not swallowed as a sync error',async()=>{
  const f=fixture();let current=true;const request=f.input.request;
  f.input.guard=()=>{if(!current)throw Error('calendar-account-changed');};
  f.input.request=async(path,opts)=>{if(opts?.method==='POST'){current=false;throw Error('offline');}return request(path,opts);};
  await assert.rejects(syncOwnCycleCalendar(f.input),/calendar-account-changed/);
  assert.equal(f.calls.length,1);
});
test('re-enabling estimates restores only a window retired by this adapter',async()=>{
  const f=fixture();await syncOwnCycleCalendar(f.input);const id=estimate(f).id;
  f.doc.mode='observe';f.doc.modeChosen=true;
  assert.equal((await syncOwnCycleCalendar(f.input)).errors,0);
  assert.equal(f.events.get(id).status,'cancelled');assert.equal(f.events.get(id).extendedProperties.private.tmRetired,'1');
  f.doc.mode='estimate';assert.equal((await syncOwnCycleCalendar(f.input)).errors,0);
  assert.equal(f.events.get(id).status,'confirmed');assert.equal(f.events.get(id).extendedProperties.private.tmRetired,'0');
  f.events.get(id).status='cancelled';
  assert.equal((await syncOwnCycleCalendar(f.input)).errors,1);assert.equal(f.events.get(id).status,'cancelled');
});
test('date imports preserve expected duration and private writing byte for byte',async()=>{
  const f=fixture();f.doc.periods[0].expectedLength=5;
  f.doc.days['2026-10-02'].note='  PRIVATE JOURNAL\n\n ';const before=structuredClone(f.doc.days);
  await syncOwnCycleCalendar(f.input);const rec=recorded(f);rec.end={date:'2026-10-08'};
  assert.equal((await syncOwnCycleCalendar(f.input)).errors,0);
  assert.equal(f.doc.periods[0].expectedLength,5);assert.deepEqual(f.doc.days,before);
  const saved=f.apiCalls.find(c=>c.method==='PUT');assert.deepEqual(saved.body.doc.days,before);
});
test('duplicate marked records conflict without rewriting history',async()=>{
  const f=fixture();await syncOwnCycleCalendar(f.input);const rec=recorded(f);
  f.events.set('duplicate',{...structuredClone(rec),id:'duplicate',end:{date:'2026-10-09'}});
  f.calls.length=0;assert.equal((await syncOwnCycleCalendar(f.input)).errors,2);
  assert.equal(f.doc.periods[0].end,'2026-10-06');assert.equal(f.calls.filter(c=>c.method).length,0);
});
