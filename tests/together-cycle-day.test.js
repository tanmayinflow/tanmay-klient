import test from 'node:test';
import assert from 'node:assert/strict';
import {emptyTogether} from '../src/shared/product/together.js';
import {cycleViewForDate,cyclePhaseForDate} from '../src/shared/product/togetherGuidance.js';

const doc=()=>({...emptyTogether(),mode:'estimate',periods:[
  {start:'2026-07-13',end:'2026-07-17'},
  {start:'2026-08-10',end:'2026-08-14'},
  {start:'2026-09-07',end:'2026-09-11'}
]});
const today='2026-09-28';

test('selected cycle day reads historical records instead of the current phase',()=>{
  const source=doc();
  assert.deepEqual(cyclePhaseForDate(source,'2026-09-09',today),{id:'menstrual',basis:'recorded'});
  assert.equal(cycleViewForDate(source,'2026-09-15',today).cycle.day,9);
  assert.deepEqual(cyclePhaseForDate(source,'2026-09-15',today),{id:'follicular',basis:'estimated'});
  assert.deepEqual(cyclePhaseForDate(source,'2026-09-20',today),{id:'ovulatory',basis:'estimated'});
  assert.deepEqual(cyclePhaseForDate(source,today,today),{id:'luteal',basis:'estimated'});
  assert.deepEqual(cyclePhaseForDate(source,'2026-07-01',today),{id:'luteal',basis:'estimated'});
  assert.equal(cyclePhaseForDate(source,'2026-06-14',today).id,null);
});

test('an actual start last week supports one preceding estimated cycle with all four phases',()=>{
  const source={...emptyTogether(),mode:'estimate',periods:[{start:'2026-10-07',end:'2026-10-11'}]};
  const before=structuredClone(source);
  for(const [date,id,day] of [['2026-09-09','menstrual',1],['2026-09-16','follicular',8],
    ['2026-09-23','ovulatory',15],['2026-10-02','luteal',24]]) {
    const view=cycleViewForDate(source,date,'2026-10-14');
    assert.deepEqual(view.phase,{id,basis:'estimated'});
    assert.equal(view.cycle.day,day);assert.equal(view.cycle.lastStart,'2026-09-09');
    assert.equal(view.cycle.retrospective,true);assert.equal(view.cycle.projected,true);
    assert.equal(view.cycle.observedBleeding,false);
  }
  assert.equal(cyclePhaseForDate(source,'2026-09-08','2026-10-14').id,null);
  assert.deepEqual(cyclePhaseForDate(source,'2026-10-07','2026-10-14'),{id:'menstrual',basis:'recorded'});
  assert.equal(cycleViewForDate(source,'2026-10-07','2026-10-14').cycle.retrospective,undefined);
  assert.deepEqual(source,before);
});

test('retrospective phases respect explicit flow, disabled estimates and the existing eligibility limits',()=>{
  const source={...emptyTogether(),mode:'estimate',periods:[{start:'2026-10-07',end:null}],days:{'2026-09-20':{flow:'heavy'}}};
  assert.deepEqual(cyclePhaseForDate(source,'2026-09-20','2026-10-14'),{id:'menstrual',basis:'recorded'});
  for(const mode of ['observe','paused']) {
    assert.equal(cyclePhaseForDate({...source,mode},'2026-09-23','2026-10-14').id,null);
  }
  assert.equal(cyclePhaseForDate({...source,usualLength:40},'2026-09-23','2026-10-14').id,null);
  assert.equal(cyclePhaseForDate(source,'2026-09-23','2026-11-20').id,null);
  const variable=doc();variable.periods[0]={start:'2026-06-15',end:'2026-06-20'};
  assert.equal(cyclePhaseForDate(variable,'2026-06-01',today).id,null);
});

test('future calendar uses projected cycle days without adding records or confirming bleeding',()=>{
  const source=doc(),before=JSON.stringify(source);
  const next=cycleViewForDate(source,'2026-10-06',today);
  assert.equal(next.cycle.day,2);
  assert.equal(next.cycle.projected,true);
  assert.equal(next.cycle.observedBleeding,false);
  assert.deepEqual(next.phase,{id:'menstrual',basis:'estimated'});
  assert.equal(cyclePhaseForDate(source,'2026-10-14',today).id,'follicular');
  assert.equal(cyclePhaseForDate(source,'2026-10-18',today).id,'ovulatory');
  assert.equal(cyclePhaseForDate(source,'2026-10-27',today).id,'luteal');
  assert.equal(JSON.stringify(source),before);
});

test('late current and historical cycles never wrap themselves into an invented period',()=>{
  const source=doc();
  const late=cycleViewForDate(source,'2026-10-06','2026-10-06');
  assert.equal(late.cycle.day,30);
  assert.equal(late.cycle.projected,undefined);
  assert.equal(late.phase.id,null);
  assert.equal(cycleViewForDate(source,'2026-10-06','2026-10-15').phase.id,null);
  assert.equal(cycleViewForDate(source,'2026-10-20','2026-10-15').phase.id,null);
});

test('future cycle estimates stay bounded and respect disabled or variable estimates',()=>{
  const source=doc();
  assert.equal(cycleViewForDate(source,'2027-01-01',today).cycle.reason,'horizon');
  assert.equal(cycleViewForDate(source,'2026-12-28',today).phase.id,null);
  source.mode='observe';assert.equal(cyclePhaseForDate(source,'2026-10-06',today).id,null);
  source.mode='paused';assert.equal(cyclePhaseForDate(source,'2026-09-09',today).id,null);
  source.mode='estimate';source.periods[0]={start:'2026-06-15',end:'2026-06-20'};
  assert.equal(cycleViewForDate(source,'2026-10-06',today).cycle.reason,'variable');
  assert.equal(cyclePhaseForDate(source,'2026-10-06',today).id,null);
});

test('historical estimation ignores later cycle starts and invalid dates are inert',()=>{
  const source=doc();source.periods.push({start:'2026-09-29',end:'2026-10-03'});
  assert.equal(cycleViewForDate(source,'2026-09-15','2026-10-03').phase.id,'follicular');
  // A future-start record is ignored even if an unvalidated document reaches the helper.
  assert.equal(cycleViewForDate(source,'2026-10-06',today).cycle.day,2);
  assert.equal(cyclePhaseForDate(source,'2026-02-30',today).id,null);
  assert.equal(cyclePhaseForDate(source,'invalid',today).id,null);
});

test('expected bleeding duration uses the editable default until completed personal records are available',()=>{
  const source={...emptyTogether(),mode:'estimate',periods:[{start:'2026-09-07',end:null}]};
  assert.equal(cyclePhaseForDate(source,'2026-10-05',today).id,'menstrual');
  assert.equal(cyclePhaseForDate(source,'2026-10-09',today).id,'menstrual');
  assert.equal(cyclePhaseForDate(source,'2026-10-10',today).id,'follicular');
  source.periods[0].end='2026-09-09';
  assert.equal(cyclePhaseForDate(source,'2026-10-07',today).id,'menstrual');
  assert.equal(cyclePhaseForDate(source,'2026-10-08',today).id,'follicular');
});

test('a saved expected length controls an open current period without becoming confirmed bleeding',()=>{
  const source={...emptyTogether(),mode:'estimate',periods:[{start:'2026-09-26',end:null,expectedLength:7}]};
  for(const [date,reference] of [['2026-09-28','2026-09-28'],['2026-10-02','2026-09-28']]) {
    const view=cycleViewForDate(source,date,reference);
    assert.deepEqual(view.phase,{id:'menstrual',basis:'estimated'});
    assert.equal(view.cycle.observedBleeding,false);
  }
  assert.equal(cyclePhaseForDate(source,'2026-10-03',today).id,'follicular');
  source.periods[0].end='2026-09-27';
  assert.deepEqual(cyclePhaseForDate(source,'2026-09-28',today),{id:'follicular',basis:'estimated'});
});
