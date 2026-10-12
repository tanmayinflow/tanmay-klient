import test from 'node:test';
import assert from 'node:assert/strict';
import {addDays,cleanTogether,emptyTogether,togetherProjection} from '../src/shared/product/together.js';
import {DatabaseSync} from 'node:sqlite';
import {handleTogether} from '../src/shared/product/togetherApi.js';
import {cycleViewForDate} from '../src/shared/product/togetherGuidance.js';
import {DEFAULT_BLEEDING_DAYS,cycleBleedingDuration,cyclePeriodDraft,cycleCalendarDay} from '../src/shared/product/togetherCycleCalendar.js';

const doc=()=>({...emptyTogether(),mode:'estimate',periods:[
  {start:'2026-07-13',end:'2026-07-17'},
  {start:'2026-08-10',end:'2026-08-14'},
  {start:'2026-09-07',end:'2026-09-11'},
]});
const reference='2026-09-28';

test('draft duration has an explicit editable fallback and never treats cycle length as bleeding length',()=>{
  assert.equal(DEFAULT_BLEEDING_DAYS,5);
  assert.deepEqual(cycleBleedingDuration({...emptyTogether(),usualLength:35},reference),{days:5,basis:'default',samples:0});
});

test('duration prefers the inclusive median of the six most recent completed personal records',()=>{
  const starts=['2026-01-05','2026-02-02','2026-03-02','2026-03-30','2026-04-27','2026-05-25','2026-06-22'];
  const lengths=[20,3,3,4,4,5,6];
  const source={...emptyTogether(),periods:starts.map((start,i)=>({start,end:addDays(start,lengths[i]-1)})).reverse()};
  source.periods.push({start:'2026-07-20',end:null},{start:'2026-10-12',end:'2026-10-16'});
  assert.deepEqual(cycleBleedingDuration(source,reference),{days:4,basis:'history',samples:6});
});

test('open, future and malformed ends cannot become personal duration evidence',()=>{
  const source={...emptyTogether(),periods:[{start:'2026-09-01',end:null},
    {start:'2026-09-27',end:'2026-10-02'},{start:'2026-02-30',end:'2026-03-03'},
    {start:'2026-08-01',end:'2026-07-31'},{start:'2026-01-01',end:'2026-04-01'}]};
  assert.deepEqual(cycleBleedingDuration(source,reference),{days:5,basis:'default',samples:0});
});

test('inclusive length and projected ends cross leap days, years and daylight-saving boundaries',()=>{
  assert.equal(cycleBleedingDuration({periods:[{start:'2024-02-28',end:'2024-03-01'}]},reference).days,3);
  assert.equal(cycleBleedingDuration({periods:[{start:'2026-03-27',end:'2026-03-31'}]},reference).days,5);
  assert.equal(cyclePeriodDraft(emptyTogether(),'2025-12-30','2026-01-01').expectedEnd,'2026-01-03');
  assert.equal(cyclePeriodDraft(emptyTogether(),'2024-02-27','2024-02-27').expectedEnd,'2024-03-02');
});

test('a selected actual start prefills a personal expected end while leaving the recorded end empty',()=>{
  const draft=cyclePeriodDraft(doc(),'2026-09-28',reference);
  assert.deepEqual(draft,{start:'2026-09-28',end:null,expectedLength:5,expectedEnd:'2026-10-02',duration:5,basis:'history',samples:3});
});

test('drafting an older start uses only duration evidence available before that start',()=>{
  const source=doc();source.periods[2].end='2026-09-17';
  const draft=cyclePeriodDraft(source,'2026-08-01',reference);
  assert.equal(draft.duration,5);assert.equal(draft.samples,1);
});

test('an existing start keeps its actual confirmed end and edit identity',()=>{
  const draft=cyclePeriodDraft(doc(),'2026-08-10',reference);
  assert.equal(draft.end,'2026-08-14');assert.equal(draft.expectedEnd,draft.end);
  assert.equal(draft.basis,'history');assert.equal(draft.originalStart,'2026-08-10');
});

test('future and invalid starts cannot produce an actual period draft',()=>{
  for(const date of ['2026-09-29','2026-02-30','no-date','2026-13-01']) assert.equal(cyclePeriodDraft(doc(),date,reference),null);
  assert.equal(cyclePeriodDraft(doc(),'2026-09-01','invalid'),null);
});

test('confirmed intervals are recorded inclusively and the following day is not',()=>{
  for(const date of ['2026-09-07','2026-09-08','2026-09-09','2026-09-10','2026-09-11']) {
    const day=cycleCalendarDay(doc(),date,reference);
    assert.equal(day.recorded,true);assert.equal(day.continuation,false);assert.equal(day.expectedPeriod,false);
    assert.deepEqual(day.phase,{id:'menstrual',basis:'recorded'});
    assert.equal(day.recordedPeriod.start,'2026-09-07');
  }
  assert.equal(cycleCalendarDay(doc(),'2026-09-12',reference).recorded,false);
});

test('an open start records just its first day and distinguishes its expected continuation',()=>{
  const source=doc();source.periods[2].end=null;
  assert.equal(cycleCalendarDay(source,'2026-09-07','2026-09-08').recorded,true);
  for(const date of ['2026-09-08','2026-09-09','2026-09-10','2026-09-11']) {
    const day=cycleCalendarDay(source,date,'2026-09-08');
    assert.equal(day.recorded,false);assert.equal(day.continuation,true);assert.equal(day.expectedPeriod,false);
    assert.deepEqual(day.phase,{id:'menstrual',basis:'estimated'});
  }
  assert.equal(cycleCalendarDay(source,'2026-09-12','2026-09-08').continuation,false);
});

test('an unrecorded next menstruation spans its expected duration, not the entire uncertainty window',()=>{
  const before=JSON.stringify(doc());
  for(const date of ['2026-10-05','2026-10-06','2026-10-07','2026-10-08','2026-10-09']) {
    const day=cycleCalendarDay(doc(),date,reference);
    assert.equal(day.expectedPeriod,true);assert.equal(day.recorded,false);assert.equal(day.continuation,false);
    assert.deepEqual(day.phase,{id:'menstrual',basis:'estimated'});
    assert.deepEqual(day.nextPeriod,{start:'2026-10-05',end:'2026-10-09',duration:5,basis:'history',samples:3,
      startWindow:{from:'2026-10-02',to:'2026-10-08'}});
  }
  assert.equal(cycleCalendarDay(doc(),'2026-10-02',reference).expectedPeriod,false);
  assert.equal(cycleCalendarDay(doc(),'2026-10-10',reference).expectedPeriod,false);
  assert.equal(JSON.stringify(doc()),before);
});

test('every future phase remains a daily estimate based on the existing bounded cycle model',()=>{
  for(const [date,id] of [['2026-10-14','follicular'],['2026-10-18','ovulatory'],['2026-10-27','luteal']]) {
    const day=cycleCalendarDay(doc(),date,reference);
    assert.deepEqual(day.phase,{id,basis:'estimated'});assert.equal(day.recorded,false);
  }
});

test('observe and paused modes retain actual records and suppress every estimated calendar mark',()=>{
  for(const mode of ['observe','paused']) {
    const source={...doc(),mode};source.periods[2].end=null;
    assert.equal(cycleCalendarDay(source,'2026-09-07',reference).recorded,true);
    for(const date of ['2026-09-08','2026-10-05','2026-10-18']) {
      const day=cycleCalendarDay(source,date,reference);
      assert.equal(day.continuation,false);assert.equal(day.expectedPeriod,false);assert.equal(day.nextPeriod,null);
      assert.deepEqual(day.phase,{id:null,basis:'unknown'});
    }
  }
});

test('variable, stale and out-of-horizon estimates are not presented as new periods or phases',()=>{
  const variable=doc();variable.periods[0]={start:'2026-06-15',end:'2026-06-20'};
  for(const [source,date,today] of [[variable,'2026-10-06',reference],[doc(),'2026-10-22','2026-10-20'],
    [doc(),'2027-01-01',reference]]) {
    const day=cycleCalendarDay(source,date,today);
    assert.equal(day.recorded,false);assert.equal(day.continuation,false);assert.equal(day.expectedPeriod,false);
    assert.equal(day.phase.id,null);
  }
});

test('a late current day never wraps into an invented next recorded or estimated period',()=>{
  const day=cycleCalendarDay(doc(),'2026-10-06','2026-10-06');
  assert.equal(day.cycle.day,30);assert.equal(day.recorded,false);assert.equal(day.expectedPeriod,false);
  assert.equal(day.phase.id,null);
});

test('explicit recorded flow stays distinct from spotting and future untrusted flow values',()=>{
  const source={...emptyTogether(),days:{'2026-09-28':{flow:'medium'},'2026-09-27':{flow:'spotting'},'2026-09-29':{flow:'heavy'}}};
  assert.deepEqual(cycleCalendarDay(source,reference,reference).phase,{id:'menstrual',basis:'recorded'});
  assert.equal(cycleCalendarDay(source,'2026-09-27',reference).recorded,false);
  assert.equal(cycleCalendarDay(source,'2026-09-29',reference).recorded,false);
});

test('a confirmed early end is not overwritten by the usual duration in future calendar days',()=>{
  const source=doc();source.periods[2].end='2026-09-08';
  const day=cycleCalendarDay(source,'2026-09-10','2026-09-09');
  assert.equal(day.recorded,false);assert.equal(day.continuation,false);
  assert.deepEqual(day.phase,{id:'follicular',basis:'estimated'});
});

test('invalid dates and future records do not produce false confirmed calendar marks',()=>{
  const source=doc();source.periods.push({start:'2026-10-05',end:'2026-10-09'});
  assert.equal(cycleCalendarDay(source,'2026-10-06',reference).recorded,false);
  assert.equal(cycleCalendarDay(source,'2026-10-06',reference).expectedPeriod,true);
  for(const date of ['2026-02-30','invalid']) {
    const day=cycleCalendarDay(source,date,reference);
    assert.equal(day.recorded,false);assert.equal(day.phase.id,null);
  }
});

test('backend preserves only the optional expected length, discards draft metadata and rejects future confirmed ends',()=>{
  const draft=cyclePeriodDraft(doc(),reference,reference);
  const cleaned=cleanTogether({...doc(),periods:[draft]},reference);
  assert.deepEqual(cleaned.periods,[{start:reference,end:null,expectedLength:5}]);
  assert.throws(()=>cleanTogether({...doc(),periods:[{start:reference,end:draft.expectedEnd}]},reference),/invalid period dates/);
});

test('old period shapes remain unchanged and expected length accepts only integers from one to fourteen',()=>{
  assert.deepEqual(cleanTogether(doc(),reference).periods,doc().periods);
  for(const expectedLength of [1,5,14]) {
    const source={...emptyTogether(),periods:[{start:reference,end:null,expectedLength}]};
    assert.equal(cleanTogether(source,reference).periods[0].expectedLength,expectedLength);
  }
  for(const expectedLength of [undefined,null,0,15,-1,2.5,'5',NaN,Infinity,true,{},[]]) {
    assert.throws(()=>cleanTogether({...emptyTogether(),periods:[{start:reference,expectedLength}]},reference),/invalid expected period length/);
  }
});

test('a saved expected length survives reload, controls open continuation and remains only an estimate',()=>{
  const source=doc();source.periods[2]={start:'2026-09-07',end:null,expectedLength:7};
  const reloaded=cleanTogether(JSON.parse(JSON.stringify(source)),'2026-09-08');
  const draft=cyclePeriodDraft(reloaded,'2026-09-07','2026-09-08');
  assert.equal(draft.expectedLength,7);assert.equal(draft.basis,'saved');assert.equal(draft.expectedEnd,'2026-09-13');
  assert.equal(draft.end,null);
  const lastExpected=cycleCalendarDay(reloaded,'2026-09-13','2026-09-08');
  assert.equal(lastExpected.recorded,false);assert.equal(lastExpected.continuation,true);
  assert.equal(cycleCalendarDay(reloaded,'2026-09-14','2026-09-08').continuation,false);
  reloaded.periods[2].end='2026-09-09';
  assert.equal(cyclePeriodDraft(reloaded,'2026-09-07','2026-09-10').expectedEnd,'2026-09-09');
  assert.equal(cycleCalendarDay(reloaded,'2026-09-10','2026-09-10').continuation,false);
});

test('without completed history an explicit saved length precedes the draft fallback but never masquerades as history',()=>{
  const source={...emptyTogether(),periods:[{start:'2026-09-07',end:null,expectedLength:7}]};
  assert.deepEqual(cycleBleedingDuration(source,reference),{days:7,basis:'saved',samples:0});
  source.periods.push({start:'2026-08-10',end:'2026-08-13'});
  assert.deepEqual(cycleBleedingDuration(source,reference),{days:4,basis:'history',samples:1});
});

test('optional expected length adds no raw period fields or additional partner grants',()=>{
  const source=doc();source.periods[2].expectedLength=7;
  assert.deepEqual(togetherProjection(source,[],reference),{});
  const projected=togetherProjection(source,['cycle','phase'],reference);
  assert.deepEqual(Object.keys(projected).sort(),['cycle','phase']);
  assert.equal(JSON.stringify(projected).includes('expectedLength'),false);
  assert.equal(JSON.stringify(projected).includes('periods'),false);
});

test('the authenticated API round-trips expected length with revisions and rejects future actual ends',async()=>{
  const sql=new DatabaseSync(':memory:');
  const db={prepare(query){const stmt=args=>({bind:(...a)=>stmt(a),run:async()=>({meta:sql.prepare(query).run(...args)}),
    first:async()=>sql.prepare(query).get(...args)||null,all:async()=>({results:sql.prepare(query).all(...args)})});return stmt([]);}};
  const call=async(body)=>{
    const response=await handleTogether(new Request('https://test.local/api/together'+(body?'/self':'')+'?date='+reference,
      {method:body?'PUT':'GET',headers:body?{'Content-Type':'application/json','Origin':'https://test.local'}:{},
        body:body?JSON.stringify(body):undefined}),db,'client:synthetic-cycle',{owner:true,now:Date.parse(reference+'T12:00:00Z')});
    return {status:response.status,...await response.json()};
  };
  try {
    const document={...emptyTogether(),mode:'estimate',periods:[{start:reference,end:null,expectedLength:6}]};
    assert.equal((await call({revision:0,doc:document})).status,200);
    const loaded=await call();assert.equal(loaded.self.revision,1);
    assert.deepEqual(loaded.self.doc.periods,document.periods);
    assert.equal((await call({revision:0,doc:document})).status,409);
    assert.equal((await call({revision:1,doc:{...document,periods:[{...document.periods[0],end:'2026-09-29'}]}})).status,400);
    assert.deepEqual((await call()).self.doc.periods,document.periods);
  } finally {sql.close();}
});

test('projections and drafts never mutate the original owner document',()=>{
  const source=doc(),before=JSON.stringify(source);
  source.periods.forEach(Object.freeze);Object.freeze(source.periods);Object.freeze(source.days);Object.freeze(source);
  cyclePeriodDraft(source,reference,reference);cycleBleedingDuration(source,reference);
  for(let offset=-30;offset<=90;offset++)cycleCalendarDay(source,addDays(reference,offset),reference);
  assert.equal(JSON.stringify(source),before);
});

test('calendar, selected-day atlas and current phase projection share exactly the same phase',()=>{
  for(const mode of ['estimate','observe','paused']) for(const expectedLength of [undefined,1,7,14]) {
    const source=doc();source.mode=mode;
    source.periods[2]={start:'2026-09-07',end:null,...(expectedLength?{expectedLength}:{})};
    for(const offset of [-23,-21,-19,-17,-10,0,7,11,16,20,29,40,70,91]) {
      const date=addDays(reference,offset);
      assert.deepEqual(cycleCalendarDay(source,date,reference).phase,cycleViewForDate(source,date,reference).phase);
      if(offset===0)assert.deepEqual(togetherProjection(source,['phase'],reference).phase,cycleViewForDate(source,reference,reference).phase);
    }
  }
});
