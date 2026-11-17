import test from 'node:test';
import assert from 'node:assert/strict';
import {practiceReviewSummary} from '../src/shared/product/practiceReview.js';

test('body-only and reflection-only days count independently without invented zero scores',()=>{
  const result=practiceReviewSummary([
    {date:'2026-11-16',wb:{sleep:0,mood:0,energy:4,well:0,grat:true}},
    {date:'2026-11-15',plan:{uznani:' A real answer ',morning:'not an evening review'}},
    {date:'2026-11-14',wb:{sleep:8,energy:2,mood:3,well:5}},
    {date:'2026-11-13',wb:{sleep:null,energy:0,mood:'',well:0}},
  ],'2026-11-16',['uznani','odnest']);
  assert.equal(result.bodyDays,2);assert.equal(result.reflectionDays,1);
  assert.equal(result.metrics.sleep.average,4);assert.equal(result.metrics.sleep.count,2);
  assert.equal(result.metrics.energy.average,3);assert.equal(result.metrics.energy.count,2);
  assert.equal(result.metrics.mood.average,3);assert.equal(result.metrics.mood.count,1);
  assert.equal(result.reflections[0].answers[0].text,'A real answer');
  assert.equal(result.seals.grat,1);
});

test('last 30 calendar days exclude future records, preserve missing halves and deduplicate dates',()=>{
  const result=practiceReviewSummary([
    {date:'2026-10-17',wb:{energy:1}},
    {date:'2026-10-18',wb:{energy:2}},
    {date:'2026-11-17',wb:{energy:1}},
    {date:'2026-11-16',wb:{energy:2}},
    {date:'2026-11-16',wb:{energy:4}},
    {date:'invalid',wb:{energy:1}},
  ],'2026-11-16',[]);
  assert.equal(result.bodyDays,2);assert.equal(result.metrics.energy.average,3);
  assert.equal(result.metrics.energy.recent,4);assert.equal(result.metrics.energy.earlier,2);
  assert.equal(result.metrics.sleep.average,null);assert.equal(result.metrics.sleep.count,0);
});

test('out-of-range values never enter means or body counts',()=>{
  const result=practiceReviewSummary([{date:'2026-11-16',wb:{sleep:-1,energy:10,well:Infinity,mood:NaN}}],'2026-11-16',[]);
  assert.equal(result.bodyDays,0);assert.equal(result.metrics.energy.count,0);
  assert.equal(result.metrics.well.average,null);
});
