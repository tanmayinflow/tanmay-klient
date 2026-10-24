import test from 'node:test';import assert from 'node:assert/strict';
import * as TV from '../src/training/index.js';
import {LOWER_LEG_AUDIT_CONTEXT as context} from '../src/data/lowerLegAuditContext.js';
import {FLOOR_CALF_ROW} from '../src/training/catalogLowerLegFoundation.js';
const floor=()=>structuredClone(FLOOR_CALF_ROW);
const policy=row=>TV.lowerLegPolicyFor(row,null,context);
test('supported floor calf seeds once, retains existing customized identity and later deletion',()=>{
 const custom={...floor(),exe:['Own','Own']},history=[{id:'past'}],plans=[{id:'plan'}];
 const first=TV.seedLowerLegFoundation({tEx:[custom],history,plans});assert.equal(first.tEx[0],custom);assert.equal(first.history,history);assert.equal(first.plans,plans);
 const deleted={...first,tEx:[]};assert.equal(TV.seedLowerLegFoundation(deleted),deleted);
 const added=TV.seedLowerLegFoundation({tEx:[],history,plans});assert.equal(added.tEx.length,1);assert.equal(added.tEx[0].id,FLOOR_CALF_ROW.id);assert.equal(TV.seedLowerLegFoundation(added),added);
});
test('lower-leg policy respects provenance and explicit behavior overrides including own undefined',()=>{
 assert.ok(policy(floor()));assert.ok(policy({...floor(),notes:'Personal note'}));
 for(const k of ['source','allowMotion','allowAddedWeightRecord','warmupPolicy','selectionPolicy','recordingPolicy'])for(const v of [null,undefined,false,'custom'])assert.equal(policy({...floor(),[k]:v}),null,k);
 assert.equal(TV.lowerLegPolicyFor(floor(),{},context),null);assert.equal(TV.lowerLegSame([],new Array(1)),false);
});
test('floor equipment permits a wall as a complete alternative and never a missing support',()=>{
 const p=policy(floor());assert.ok(TV.lowerLegSelectionAllowed(p,{equipment:['zed']}));assert.ok(TV.lowerLegSelectionAllowed(p,{equipment:['fixed_support']}));assert.equal(TV.lowerLegSelectionAllowed(p,{equipment:['telo']}),false);
});
test('lower-leg block recognition rejects falsy nonempty variants and recording overrides',()=>{
 const p=policy(floor()),b={exId:p.id,measurementType:p.measurementType};assert.ok(TV.lowerLegBlockCompatible(p,b));
 for(const variant of [false,0,{},[false],['']])assert.equal(TV.lowerLegBlockCompatible(p,{...b,variant}),false);
 for(const variant of [null,undefined,'',[]])assert.ok(TV.lowerLegBlockCompatible(p,{...b,variant}));
 assert.equal(TV.lowerLegBlockCompatible(p,{...b,sideMode:'perSide'}),false);assert.equal(TV.lowerLegBlockCompatible(p,{...b,recordingPolicy:null}),false);
});
test('disabled comparative claims retain raw history but produce neither records nor series',()=>{
 const h=[{actual:{reps:12},planned:{},measurementType:'REPS_ONLY',sessionId:'s',at:1}];const snapshot=structuredClone(h);
 assert.deepEqual(TV.recordsFor('REPS_ONLY',h,{allowComparableRecords:false}),{});assert.deepEqual(TV.seriesFor('REPS_ONLY',h,{allowComparableRecords:false}),[]);assert.deepEqual(h,snapshot);
});
test('unweighted records exclude actual and prescribed extra load without changing saved fields',()=>{
 const clean={actual:{reps:5},planned:{},measurementType:'BODYWEIGHT_REPS',sessionId:'s',at:1},loaded={...clean,actual:{reps:20,addedWeight:null}},prescribed={...clean,planned:{targetWeight:10},actual:{reps:30}};
 const history=[clean,loaded,prescribed],snapshot=structuredClone(history);const records=TV.recordsFor('BODYWEIGHT_REPS',history,TV.locomotionRecordOptions(policy(floor())));assert.equal(records.bestReps.value,5);assert.deepEqual(history,snapshot);
});
test('new floor default resolves with manual warmup and exact public delivery',()=>{
 const row=floor(),r=TV.resolveExercise(row,null,undefined,undefined,context);assert.ok(TV.resolvedLowerLegPolicy(r));assert.deepEqual(TV.warmupFor({exercise:r,workingWeight:20}),[]);
 const plan={id:'p',sessions:[{id:'day',templateId:'t'}]},template={id:'t',blocks:[{id:'b',exId:r.id,sets:[]}]};
 const d=TV.clientBundle([plan],[template],()=>r,{pro:true}).exercises[0];assert.ok(TV.lowerLegDeliveredPolicy(d));assert.equal(TV.lowerLegDeliveredPolicy({...d,execution:['Personal','Personal']}),null);assert.equal(TV.lowerLegDeliveredPolicy({...d,lowerLegAudit:undefined}),null);
 const carrier={id:row.id};TV.attachLowerLegPolicy(carrier,row,null,context);assert.ok(TV.resolvedLowerLegPolicy(carrier));TV.attachLowerLegPolicy(carrier,{...row,source:null},null,context);assert.equal(TV.resolvedLowerLegPolicy(carrier),null);
});
