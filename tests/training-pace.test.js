import test from 'node:test';
import assert from 'node:assert/strict';
import {fmtPace,fmtActual} from '../src/training/measurements.js';

test('pace carries rounded seconds into the next minute',()=>{
  assert.equal(fmtPace(5001,1800,true),'6:00 /km');
  assert.equal(fmtPace(10001,600,false),'1:00 /km');
  assert.equal(fmtPace(1000,359.49,true),'5:59 /km');
  assert.equal(fmtPace(1000,359.5,true),'6:00 /km');
});
test('distance-time summaries use the same valid pace and incomplete data has no pace',()=>{
  assert.match(fmtActual('DISTANCE_DURATION',{distanceM:5001,durationSec:1800},true),/6:00 \/km$/);
  assert.equal(fmtPace(0,1800,true),'');assert.equal(fmtPace(5001,0,true),'');
  assert.equal(fmtPace(null,1800,true),'');assert.equal(fmtPace(5001,undefined,true),'');
});
