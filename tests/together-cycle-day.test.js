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
  assert.equal(cyclePhaseForDate(source,'2026-07-01',today).id,null);
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

test('expected bleeding duration comes from completed personal records',()=>{
  const source={...emptyTogether(),mode:'estimate',periods:[{start:'2026-09-07',end:null}]};
  assert.equal(cyclePhaseForDate(source,'2026-10-05',today).id,'menstrual');
  assert.equal(cyclePhaseForDate(source,'2026-10-06',today).id,'follicular');
  source.periods[0].end='2026-09-09';
  assert.equal(cyclePhaseForDate(source,'2026-10-07',today).id,'menstrual');
  assert.equal(cyclePhaseForDate(source,'2026-10-08',today).id,'follicular');
});
