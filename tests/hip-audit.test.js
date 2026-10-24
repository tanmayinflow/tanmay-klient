// Regression coverage for audited default content, role privacy and user overrides.
import test from 'node:test';
import assert from 'node:assert/strict';
import * as TV from '../src/training/index.js';
import {HIP_AUDIT_ENTRIES as publicEntries} from '../src/training/catalogHipAuditData.js';
import {HIP_AUDIT_CONTEXT as context} from '../src/data/hipAuditContext.js';
import {TRUNK_AUDIT_CONTEXT} from '../src/data/trunkAuditContext.js';
import {MOVEMENT_AUDIT_CONTEXT} from '../src/data/movementAuditContext.js';
import {BALANCE_AUDIT_CONTEXT} from '../src/data/balanceAuditContext.js';
import {LOCOMOTION_AUDIT_CONTEXT} from '../src/data/locomotionAuditContext.js';
import {LOWER_LEG_AUDIT_CONTEXT} from '../src/data/lowerLegAuditContext.js';
import {EXERCISE_MOTION} from '../src/shared/product/exerciseMotion.js';
import {loadLibrary} from '../scripts/lib/exercise-library.mjs';

const lib=loadLibrary(),meta=lib.meta;
const before=TV.seedExerciseExpansion(structuredClone({tEx:lib.all}),undefined,{
 ...(context.role==='client'?{includeLungeFoundations:true,includeClientVerticalPushFoundations:true,includeClientVerticalPullFoundations:true}:{}),
 trunkAuditContext:TRUNK_AUDIT_CONTEXT,movementAuditContext:MOVEMENT_AUDIT_CONTEXT,balanceAuditContext:BALANCE_AUDIT_CONTEXT,
 locomotionAuditContext:LOCOMOTION_AUDIT_CONTEXT,lowerLegAuditContext:LOWER_LEG_AUDIT_CONTEXT,auditMetadata:meta
});
const options={hipAuditContext:context,auditMetadata:meta},after=TV.applyHipAudit(before,options);
const row=id=>after.tEx.find(r=>r.id===id);
const resolve=id=>TV.resolveExercise(row(id),meta[id],undefined,LOCOMOTION_AUDIT_CONTEXT,LOWER_LEG_AUDIT_CONTEXT,context);
const policy=id=>TV.hipPolicyFor(row(id),meta[id],context);
const block=id=>({id:'b',exId:id,measurementType:resolve(id).measurementType,sets:[]});
const bundle=(id,blocks)=>JSON.parse(JSON.stringify(TV.clientBundle([{id:'p',sessions:[{templateId:'t'}]}],[{id:'t',blocks}],()=>resolve(id),{pro:true,now:1})));

test('hip exact eligibility preserves personal source/art and own undefined; missing rows stay absent',()=>{
 assert.ok(policy('pancake'));
 for(const override of [{source:undefined},{source:null},{art:{mine:true}},{imageUrl:'private.png'},{manualProgression:false}]){
  const custom={...row('pancake'),...override};
  assert.equal(TV.hipPolicyFor(custom,meta.pancake,context),null);
  assert.equal(TV.hipArtworkFor(custom,meta.pancake,context),null);
  assert.equal(TV.applyHipAudit({tEx:[custom]},options).tEx[0],custom);
 }
 const notes={personal:undefined},annotated={...row('pancake'),notes};
 assert.ok(TV.hipPolicyFor(annotated,meta.pancake,context));
 assert.equal(TV.applyHipAudit({tEx:[annotated]},options).tEx[0].notes,notes);
 assert.deepEqual(TV.applyHipAudit({tEx:[]},options).tEx,[]);
 assert.equal(TV.applyHipAudit(after,options),after);
});

test('precise machine equipment preserves kilograms; cable setup honors both AND and OR',()=>{
 for(const [id,gear] of [['hipabduction','hip_abduction_machine'],['hipadduction','hip_adduction_machine']]){
  const rec=resolve(id);assert.equal(rec.measurementType,'WEIGHT_REPS');assert.equal(rec.loadMode,'ext');
  assert.equal(TV.selectableFor(rec,{equipment:[gear],explicitTarget:true}).ok,true);
  assert.equal(TV.selectableFor(rec,{equipment:['stroj'],explicitTarget:true}).ok,false);
 }
 const rec=resolve('ex26_cable_abduction'),gear=['adjustable_cable_pair','cable_ankle_cuff','fixed_support'];
 assert.equal(TV.selectableFor(rec,{equipment:gear,explicitTarget:true}).ok,true);
 assert.equal(TV.selectableFor(rec,{equipment:['low_cable',...gear.slice(1)],explicitTarget:true}).ok,true);
 for(let i=0;i<gear.length;i++)assert.equal(TV.selectableFor(rec,{equipment:gear.filter((_,n)=>n!==i),explicitTarget:true}).ok,false);
 assert.equal(TV.selectableFor(rec,{equipment:gear}).ok,false);
});

test('manual recording preserves historical extra kilograms and unknown side without comparative claims',()=>{
 const p=policy('clamshell'),b={...block('clamshell'),restSec:0,sets:[{id:'s',type:'work',planned:{targetReps:5,targetWeight:9},actual:{reps:4,weight:12,addedWeight:undefined},side:null}]};
 const session={id:'history',blocks:[b]},saved=structuredClone(session);
 const done=TV.locomotionCompleteSet(TV.locomotionSetActual(session,'b','s',{reps:7,weight:50},p),'b','s',1,p),set=done.blocks[0].sets[0];
 assert.deepEqual(session,saved);assert.equal(set.actual.reps,7);assert.equal(set.actual.weight,12);
 assert.ok(Object.hasOwn(set.actual,'addedWeight'));assert.equal(set.actual.addedWeight,undefined);
 assert.equal(set.planned.targetWeight,9);assert.equal(set.side,null);assert.equal(done.blocks[0].restSec,0);
 const history=TV.historyOf([{...done,state:'done',endedAt:1}],'clamshell',{preserveSide:true});
 assert.deepEqual(TV.recordsFor(p.measurementType,history,TV.locomotionRecordOptions(p)),{});
 assert.equal(TV.evaluateBlock(done.blocks[0],{manualProgression:p.manualProgression}).k,'practice');
});

test('public delivery opts the whole identity out before JSON loses own block overrides',()=>{
 const id='frog',b=block(id),valid=bundle(id,[b]);assert.ok(TV.hipDeliveredPolicy(valid.exercises[0]));
 for(const override of [{variant:false},{variant:0},{recordingPolicy:undefined},{sideMode:undefined},{equipment:['private']}]){
  const result=bundle(id,[b,{...b,...override}]),payload=result.exercises[0];
  assert.equal(payload.hipAudit,undefined);assert.equal(TV.hipDeliveredPolicy(payload),null);
  if(Object.hasOwn(override,'variant'))assert.equal(result.templates[0].blocks[1].variant,override.variant);
 }
 const payload=valid.exercises[0];assert.equal(TV.hipDeliveredPolicy({...payload,execution:['Own','Own']}),null);
 assert.equal(TV.hipDeliveredPolicy({...payload,progression:['Own','Own']}),null);
});

test('public metadata has no private profiles; thirteen private Main entries never get a public stamp',()=>{
 assert.equal(Object.keys(publicEntries).length,52);
 assert.ok(Object.values(publicEntries).every(e=>!Object.hasOwn(e,'profiles')&&!Object.hasOwn(e,'metadata')));
 const privateIds=Object.keys(context.entries).filter(id=>!publicEntries[id]);
 assert.equal(privateIds.length,context.role==='main'?13:0);
 for(const id of privateIds){assert.equal(bundle(id,[block(id)]).exercises[0].hipAudit,undefined);assert.equal(TV.hipPolicyFor(row(id),meta[id],{...context,role:'client'}),null);}
});

test('retained views preserve exact rows, metrics and training policy while fixing standing-fold family',()=>{
 for(const id of ['revhyper','ex26_ball_reverseext','pikefold']){
  const old=before.tEx.find(r=>r.id===id);assert.equal(row(id),old);
  const rec=resolve(id),plain=TV.resolveExercise(old,meta[id]);
  assert.equal(TV.resolvedHipPolicy(rec),null);assert.equal(TV.hipEquipmentDecision(row(id),meta[id],context,[],false),undefined);
  assert.equal(rec.measurementType,plain.measurementType);assert.equal(rec.sideMode,plain.sideMode);assert.equal(rec.loadMode,plain.loadMode);
  assert.equal(rec.familyId,id==='pikefold'?'hip_flexion_mobility':plain.familyId);
  const payload=bundle(id,[block(id)]).exercises[0];assert.equal(TV.hipDeliveredPolicy(payload),null);
  assert.equal(TV.hipDeliveredViewPolicy(payload).viewOnly,true);assert.equal(TV.hipDeliveredArtworkFor(payload).contourOnly,true);
  assert.equal(bundle(id,[{...block(id),recordingPolicy:undefined}]).exercises[0].hipAudit,undefined);
 }
});

test('only the known reviewed motion source is suppressed; a replacement URL remains eligible',()=>{
 const id='ex26_cable_abduction',old=EXERCISE_MOTION[id];assert.ok(old?.src);
 assert.equal(TV.hipMotionAllowed(row(id),meta[id],context,old),false);
 assert.equal(TV.hipMotionAllowed(row(id),meta[id],context,{...old,src:'/exercise-motion/local-regression-repaired.webm'}),true);
 assert.equal(TV.hipMotionAllowed({...row(id),source:'private'},meta[id],context,old),true);
});

// Review-only addition to the existing hip-audit.test.js: uses its TV/context/options bindings.
// Expected to run after root installs HIP_AUDIT_VERSION=2 with the existing flag key.
test('hip revision two adopts L3 from a legacy true marker without changing history or personal rows',()=>{
 const ids=['ex26_mob_straddle_compression','ex26_mob_knee_hug_release','ex26_mob_halfkneel_groin'];
 const defaults=ids.map(id=>structuredClone(context.entries[id].profiles[0]));
 const history={scalar:9,blocks:[{exId:ids[1],measurementType:'BODYWEIGHT_REPS',variant:false,sets:[{side:null,actual:{reps:3,addedWeight:7,weight:undefined},planned:{targetReps:5,targetWeight:11}}]}]};
 const notes={personal:undefined};
 const legacy={tEx:defaults,hipAudit20261024:true,history,notes,deleted:['missing-id']},saved=structuredClone(legacy);
 const upgraded=TV.applyHipAudit(legacy,options);
 assert.deepEqual(legacy,saved);assert.equal(upgraded.hipAudit20261024,2);
 assert.equal(upgraded.history,history);assert.equal(upgraded.notes,notes);assert.equal(upgraded.deleted,legacy.deleted);
 for(const id of ids){const old=defaults.find(r=>r.id===id),next=upgraded.tEx.find(r=>r.id===id),p=TV.hipPolicyFor(next,meta[id],context);
  assert.equal(p.stage,'after');assert.equal(p.measurementType,'BODYWEIGHT_REPS');assert.equal(p.sideMode,'perSide');
  assert.equal(next.family,old.family);assert.equal(next.defaultRestSec,old.defaultRestSec);
 }
 assert.equal(TV.applyHipAudit(upgraded,options),upgraded);
 const custom={...defaults[0],source:undefined,notes:{own:undefined}},partiallyOwned={...defaults[1],exe:['Moje','Mine']};
 const personalized=TV.applyHipAudit({tEx:[custom,partiallyOwned],hipAudit20261024:true,history},options);
 assert.equal(personalized.tEx.length,2);assert.equal(personalized.tEx[0],custom);assert.equal(personalized.tEx[1],partiallyOwned);assert.equal(personalized.history,history);
 assert.equal(TV.hipPolicyFor(custom,meta[custom.id],context),null);assert.equal(TV.hipPolicyFor(partiallyOwned,meta[partiallyOwned.id],context),null);
 const empty=TV.applyHipAudit({tEx:[],hipAudit20261024:true,deleted:ids},options);assert.deepEqual(empty.tEx,[]);assert.deepEqual(empty.deleted,ids);
});

// Review-only addition to existing hip-audit.test.js, using TV/context/options/meta.
test('hip 90/90 accepts only the two exact historic CM shinbox-link profiles in either operation order',()=>{
 const profiles=context.entries.hip9090.profiles,originals=profiles.filter(p=>p.hd===null),linked=profiles.filter(p=>p.hd==='shinbox');
 assert.equal(originals.length,2);assert.equal(linked.length,2);
 for(const p of originals)assert.ok(linked.some(q=>TV.hipSame(q,{...p,hd:'shinbox'})));
 // This is the documented historical CM null-to-shinbox transform. The separate
 // independent review executes the actual App block extracted via TypeScript AST.
 const cm=coll=>({...coll,tEx:coll.tEx.map(r=>r.id==='hip9090'&&r.hd===null?{...r,hd:'shinbox'}:r)});
 for(const before of originals){const notes={mine:undefined},history={seconds:47,addedWeight:8,side:null},c={tEx:[structuredClone(before)],notes,history};
  for(const next of[TV.applyHipAudit(cm(c),options),cm(TV.applyHipAudit(c,options))]){
   assert.equal(next.tEx[0].hd,'shinbox');assert.equal(TV.hipPolicyFor(next.tEx[0],meta.hip9090,context).stage,'after');
   assert.equal(next.tEx[0].mode,before.mode);assert.equal(next.notes,notes);assert.equal(next.history,history);
   assert.equal(TV.applyHipAudit(next,options),next);
  }
 }
 for(const override of[{hd:'personal'},{hd:undefined},{exe:['Own','Own']},{source:null}]){const own={...linked[0],...override};assert.equal(TV.applyHipAudit({tEx:[own]},options).tEx[0],own);assert.equal(TV.hipPolicyFor(own,meta.hip9090,context),null);}
 assert.equal(TV.hipPolicyFor(linked[0],{...meta.hip9090,custom:undefined},context),null);
});
