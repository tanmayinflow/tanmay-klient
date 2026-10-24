import test from 'node:test';
import assert from 'node:assert/strict';
import * as TV from '../src/training/index.js';
import {LANDING_AUDIT_CONTEXT as context} from '../src/data/landingAuditContext.js';
import {declareNewSideMeaning} from '../src/training/landingSideMeaningIntent.js';
const metadata=Object.fromEntries(Object.entries(context.entries).map(([id,e])=>[id,e.metadata]));
const rows=TV.applyLandingAudit({tEx:Object.values(context.entries).map(e=>structuredClone(e.profiles[0]))},{landingAuditContext:context,auditMetadata:metadata}).tEx;
const resolve=TV.makeResolver(metadata,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,context);

test('Completing an explicit zero preserves it; missing and invalid values retain the existing planned fallback',()=>{
 for(const type of ['BODYWEIGHT_REPS','WEIGHT_REPS','DURATION','DISTANCE_DURATION','HEIGHT_REPS','ROUNDS']){
  const key={DURATION:'durationSec',DISTANCE_DURATION:'distanceM',HEIGHT_REPS:'height',ROUNDS:'rounds'}[type]||'reps';
  for(const actual of [{},{[key]:null},{[key]:undefined},{[key]:NaN},{[key]:Infinity},{[key]:0},{[key]:2}]){
   const block=TV.makeBlock({id:'b',exId:'generic',measurementType:type,sets:[{id:'s',planned:{targetReps:4,targetWeight:7,targetDurationSec:20,targetDistanceM:30,targetHeight:50,targetRounds:3},actual}]}),session={id:'zero',blocks:[block]},before=structuredClone(session),done=TV.completeSet(session,'b','s',123);
   if(typeof actual[key]==='number'&&Number.isFinite(actual[key]))assert.equal(done.blocks[0].sets[0].actual[key],actual[key]);
   else assert.deepEqual(done.blocks[0].sets[0].actual,TV.normalizeActual(type,TV.plannedToActual(type,block.sets[0].planned)));
   assert.deepEqual(session,before);assert.equal(done.blocks[0].sets[0].completed,true);
  }
 }
});

test('A typed recording setup never becomes legacy permission after a semantic override is normalized',()=>{
 const id='ex26_py_single_quarter',actual=rows.find(r=>r.id===id),policy=TV.landingPolicyFor(actual,metadata[id],context),rec=resolve(actual),runtime=TV.createLandingRecordingRuntime({policyFor:()=>policy,resolve:()=>rec,blockCompatible:(_r,_c,b)=>!!TV.landingPolicyForBlock(actual,metadata[id],context,b)}),spec=TV.landingRecordingSpecs()[id];
 assert.ok(spec);const ctx={role:'client'},block=TV.makeBlock({exId:id,measurementType:rec.measurementType,recordingConvention:spec.convention,sets:[{side:'L',executionChoice:{v:1,id:spec.convention.id,turnDirection:'left'}}]});
 assert.equal(runtime.status(actual,ctx,block,block.sets[0]).ready,true);
 for(const field of ['secondaryLoad','readOnlyActualKeys']){
  const changed=TV.makeBlock({...block,[field]:undefined});assert.deepEqual(changed.recordingConvention,{v:0,invalid:true});assert.equal(runtime.status(actual,ctx,changed,changed.sets[0]).ready,false);
 }
});

test('Hand-travel direction is explicit on a new R2 block and never inferred for an old L/R record',()=>{
 const id='ex26_py_knee_lateral_push',row=rows.find(r=>r.id===id),p=TV.landingPolicyFor(row,metadata[id],context),rec=resolve(row),old=TV.makeBlock({exId:id,measurementType:rec.measurementType,sets:[{side:'R',actual:{reps:6,addedWeight:2.5}}]}),draft=TV.makeBlock({exId:id,measurementType:rec.measurementType,sets:[{side:'R'}]}),fresh=declareNewSideMeaning(draft,p,{newBlock:true});
 assert.equal(declareNewSideMeaning(old,p,{newBlock:true}),old);assert.equal(Object.hasOwn(old,'sideMeaningIntent'),false);assert.equal(fresh.sideMeaningIntent.meaning,'hand-travel-direction');assert.deepEqual(fresh.sets,draft.sets);assert.deepEqual(TV.makeBlock(fresh).sideMeaningIntent,fresh.sideMeaningIntent);
 const invalid=TV.makeBlock({...fresh,secondaryLoad:'own'});assert.deepEqual(invalid.sideMeaningIntent,{v:0,invalid:true});
});
