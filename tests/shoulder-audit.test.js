// Mirrored into each product's tests/: exercise real role data and consumers.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import * as TV from '../src/training/index.js';
import {completeGuidedSet} from '../src/training/guide.js';
import {SHOULDER_AUDIT_ENTRIES as publicEntries} from '../src/training/catalogShoulderAuditData.js';
import {SHOULDER_AUDIT_CONTEXT as context} from '../src/data/shoulderAuditContext.js';
import {HIP_AUDIT_CONTEXT} from '../src/data/hipAuditContext.js';
import {LOWER_LEG_AUDIT_CONTEXT} from '../src/data/lowerLegAuditContext.js';
import {LOCOMOTION_AUDIT_CONTEXT} from '../src/data/locomotionAuditContext.js';
import {BALANCE_AUDIT_CONTEXT} from '../src/data/balanceAuditContext.js';
import {MOVEMENT_AUDIT_CONTEXT} from '../src/data/movementAuditContext.js';
import {TRUNK_AUDIT_CONTEXT} from '../src/data/trunkAuditContext.js';
import {EXERCISE_MOTION} from '../src/shared/product/exerciseMotion.js';
import {loadLibrary} from '../scripts/lib/exercise-library.mjs';

const lib=loadLibrary(),meta=lib.meta;
const previousContexts=[LOCOMOTION_AUDIT_CONTEXT,LOWER_LEG_AUDIT_CONTEXT,HIP_AUDIT_CONTEXT];
const before=TV.seedExerciseExpansion(structuredClone({tEx:lib.all}),undefined,{
 ...(context.role==='client'?{includeLungeFoundations:true,includeClientVerticalPushFoundations:true,includeClientVerticalPullFoundations:true}:{}),
 trunkAuditContext:TRUNK_AUDIT_CONTEXT,movementAuditContext:MOVEMENT_AUDIT_CONTEXT,balanceAuditContext:BALANCE_AUDIT_CONTEXT,
 locomotionAuditContext:LOCOMOTION_AUDIT_CONTEXT,lowerLegAuditContext:LOWER_LEG_AUDIT_CONTEXT,hipAuditContext:HIP_AUDIT_CONTEXT,auditMetadata:meta
});
const options={shoulderAuditContext:context,auditMetadata:meta},after=TV.applyShoulderAudit(before,options);
const row=id=>after.tEx.find(r=>r.id===id),policy=id=>TV.shoulderPolicyFor(row(id),meta[id],context);
const resolve=id=>TV.resolveExercise(row(id),meta[id],undefined,...previousContexts,context);
const block=id=>({id:'b',exId:id,measurementType:resolve(id).measurementType,sets:[]});
const bundle=(id,blocks)=>JSON.parse(JSON.stringify(TV.clientBundle([{id:'p',sessions:[{templateId:'t'}]}],[{id:'t',blocks}],()=>resolve(id),{pro:true,now:1})));
const ownValue=(o,k,v)=>{assert.ok(Object.hasOwn(o,k));assert.ok(Object.is(o[k],v));};

test('shoulder adoption preserves personal own overrides, notes, history and deletion',()=>{
 const id='ig27_kneeling_cuban_rotation',original=row(id);assert.ok(policy(id));
 for(const override of [{source:undefined},{source:null},{art:undefined},{recordingPolicy:null},{exe:['Mine','Mine']},{taxonomy:{...original.taxonomy,regions:['personal']}}]){
  const custom={...original,...override};assert.equal(TV.shoulderPolicyFor(custom,meta[id],context),null);
  assert.equal(TV.shoulderArtworkFor(custom,meta[id],context),null);
  assert.equal(TV.applyShoulderAudit({tEx:[custom]},options).tEx[0],custom);
 }
 assert.equal(TV.shoulderPolicyFor(original,{...meta[id],personal:undefined},context),null);
 const notes={personal:undefined},history=[{actual:{weight:3,addedWeight:null},side:null}],annotated={...original,notes};
 const next=TV.applyShoulderAudit({tEx:[annotated],history},options);assert.equal(next.tEx[0].notes,notes);assert.equal(next.history,history);
 assert.deepEqual(TV.applyShoulderAudit({tEx:[],deleted:[id]},options).tEx,[]);assert.equal(TV.applyShoulderAudit(after,options),after);
});

test('Cuban and fly setups retain primary kilograms and require their complete equipment',()=>{
 const cases=[['ig27_kneeling_cuban_rotation',['dumbbell_pair']],['cablefly',['adjustable_cable_pair','cable_handle_pair']]];
 if(context.role==='main')cases.push(['an_inclfly',['dumbbell_pair','incline_bench']]);
 for(const[id,gear]of cases){const rec=resolve(id),p=policy(id);assert.equal(rec.measurementType,'WEIGHT_REPS');assert.equal(rec.loadMode,'ext');
  assert.equal(p.measurementType,rec.measurementType);assert.equal(p.noAddedWeight,false);
  assert.equal(TV.shoulderSelectionAllowed(p,{equipment:gear,explicitTarget:true}),true);
  for(let i=0;i<gear.length;i++)assert.equal(TV.shoulderSelectionAllowed(p,{equipment:gear.filter((_,n)=>n!==i),explicitTarget:true}),false);
  assert.deepEqual(TV.warmupFor({exercise:rec,workingWeight:20}),[]);
  assert.equal(TV.locomotionRecordOptions(p).excludeExtraLoad,undefined);assert.equal(p.allowEstimatedMax,false);
 }
});

test('external shoulder editing and completion preserve own secondary load while primary kilograms remain editable',()=>{
 const id='ig27_kneeling_cuban_rotation',p=policy(id);
 for(const value of[null,undefined]){const session={id:'s',blocks:[{...block(id),sets:[{id:'set',type:'work',planned:{targetWeight:2,targetReps:8,addedWeight:value},actual:{addedWeight:value},side:null,note:'keep'}]}]},saved=structuredClone(session);
  const edited=TV.locomotionSetActual(session,'b','set',{weight:4,reps:9,addedWeight:99},p),e=edited.blocks[0].sets[0];
  assert.equal(e.actual.weight,4);ownValue(e.actual,'addedWeight',value);ownValue(e.planned,'addedWeight',value);
  const done=TV.locomotionCompleteSet(session,'b','set',1,p).blocks[0].sets[0];assert.equal(done.actual.weight,2);ownValue(done.actual,'addedWeight',value);
  assert.equal(done.side,null);assert.equal(done.note,'keep');assert.deepEqual(session,saved);
  assert.ok(TV.locomotionLegacyLoad(e,p).every(x=>x.key==='addedWeight'));assert.equal(TV.locomotionCanCopyPrevious({sets:[e]},session.blocks[0],p),false);
 }
 assert.equal(TV.locomotionCanCopyPrevious({sets:[{actual:{weight:2,reps:8}}]},{sets:[]},p),true);
 assert.deepEqual(TV.locomotionProtectedLoadKeys(policy('extrot')),['weight','addedWeight']);
 assert.deepEqual(TV.locomotionProtectedLoadKeys({auditKind:'hip',measurementType:'WEIGHT_REPS',loadMode:'ext'}),[]);
});

// Execute the actual small non-JSX consumer bodies; do not maintain a second implementation.
function consumerBody(file,start,end){const source=readFileSync(new URL(file,import.meta.url),'utf8'),a=source.indexOf(start),b=source.indexOf(end,a+start.length);assert.ok(a>=0&&b>a,'Consumer moved: update this extraction to the actual new location');return source.slice(a,b);}
test('the actual App planned editor and guide completion keep historical secondary fields',()=>{
 const planned=vm.runInNewContext(consumerBody('../src/App.tsx','function tvLocoPlanned(','function TvLocoHistory')+'\ntvLocoPlanned',{TV});
 const guideBody=consumerBody('../src/shared/ui/trainingGuide.jsx','    const applyComplete = (s) => {','    const restInfo =');
 const id='ig27_kneeling_cuban_rotation',p=policy(id);
 for(const value of[null,undefined]){const plan={targetWeight:2,targetReps:8,addedWeight:value},changed=planned('WEIGHT_REPS',plan,{targetWeight:4,addedWeight:99},p);assert.equal(changed.targetWeight,4);ownValue(changed,'addedWeight',value);
  const session={blocks:[{...block(id),sets:[{id:'set',type:'work',planned:plan,actual:{addedWeight:value},side:null}]}]};
  const complete=vm.runInNewContext(guideBody+'\napplyComplete',{TV,policy:p,block:{id:'b'},set:{id:'set'},prevSet:{actual:{weight:7,addedWeight:99,reps:8}},extra:{},Date:{now:()=>1},completeGuidedSet});
  const done=complete(session).blocks[0].sets[0];assert.equal(done.actual.weight,2);ownValue(done.actual,'addedWeight',value);ownValue(done.planned,'addedWeight',value);
 }
});

test('one custom block prevents a shared delivery stamp before JSON erases own undefined',()=>{
 const id='cablefly',b=block(id),valid=bundle(id,[b]);assert.ok(TV.shoulderDeliveredPolicy(valid.exercises[0]));
 for(const override of[{variant:false},{variant:0},{sideMode:undefined},{recordingPolicy:undefined},{equipment:['mine']}]){
  const payload=bundle(id,[b,{...b,id:'custom-block',...override}]).exercises[0];assert.equal(payload.shoulderAudit,undefined);assert.equal(TV.shoulderDeliveredPolicy(payload),null);
 }
 const d=valid.exercises[0];assert.equal(TV.shoulderDeliveredViewPolicy({...d,execution:['Mine','Mine']}),null);
 assert.equal(TV.shoulderDeliveredViewPolicy({...d,shoulderAudit:undefined}),null);
});

test('public shoulder package excludes all53 private Main entries and their stamps',()=>{
 assert.equal(Object.keys(publicEntries).length,68);
 assert.ok(Object.values(publicEntries).every(e=>!Object.hasOwn(e,'metadata')&&!Object.hasOwn(e,'profiles')));
 const privateIds=Object.keys(context.entries).filter(id=>!publicEntries[id]);assert.equal(privateIds.length,context.role==='main'?53:0);
 for(const id of privateIds){assert.ok(row(id));assert.equal(bundle(id,[block(id)]).exercises[0].shoulderAudit,undefined);assert.equal(TV.shoulderViewPolicyFor(row(id),meta[id],{...context,role:'client'}),null);}
 if(context.role==='client'){assert.equal(context.entries.an_inclfly,undefined);assert.equal(row('an_inclfly'),undefined);}
});

test('retained Shoulder views keep earlier recording capabilities and only correct the reviewed family',()=>{
 for(const id of['scapush','ig27_prone_pulldown','ex26_kneel_reversefly']){
  const old=before.tEx.find(r=>r.id===id),plain=TV.resolveExercise(old,meta[id],undefined,...previousContexts),rec=resolve(id);
  assert.equal(row(id),old);assert.equal(policy(id),null);assert.equal(TV.shoulderEquipmentDecision(row(id),meta[id],context,[],false),undefined);
  for(const k of['measurementType','loadMode','sideMode','warmupPolicy','generatorEligible'])assert.deepEqual(rec[k],plain[k]);
  for(const getter of[TV.resolvedLocomotionPolicy,TV.resolvedLowerLegPolicy,TV.resolvedHipPolicy,TV.resolvedHipDeliveryPolicy])assert.deepEqual(getter(rec),getter(plain));
  assert.equal(rec.familyId,id==='ex26_kneel_reversefly'?'kneeling_cable_reverse_fly':plain.familyId);
  const d=bundle(id,[block(id)]).exercises[0];assert.equal(TV.shoulderDeliveredPolicy(d),null);assert.equal(TV.shoulderDeliveredViewPolicy(d).viewOnly,true);assert.equal(TV.shoulderDeliveredArtworkFor(d).contourOnly,true);
 }
});

test('view-only suppression blocks only the exact reviewed motion source',()=>{
 const id='scapush',motion=EXERCISE_MOTION[id];assert.ok(motion?.src);assert.equal(policy(id),null);
 assert.equal(TV.shoulderMotionAllowed(row(id),meta[id],context,motion),false);
 assert.equal(TV.shoulderMotionAllowed(row(id),meta[id],context,{...motion,src:'/exercise-motion/repaired-regression.webm'}),true);
 assert.equal(TV.shoulderMotionAllowed({...row(id),source:'mine'},meta[id],context,motion),true);
});

// REVIEW ONLY: append this test to the existing tests/shoulder-audit.test.js.
// It deliberately uses that file's real role context, before/after catalogues and imports.
test('exercise audit taxonomy.note preserves defaults while other own taxonomy and metadata still opt out',()=>{
 const ids=['ig27_kneeling_cuban_rotation','kb26_armbar','scapush'];
 if(context.role==='main')ids.push('kr_mob_011');
 for(const id of ids){
  assert.ok(context.entries[id],`mandatory role target ${id}`);
  for(const original of [before.tEx.find(r=>r.id===id),row(id)]){
   assert.ok(original);assert.ok(TV.shoulderEntryFor(original,meta[id],context));
   for(const note of ['My audit note','',null,undefined]){
    const notes={personal:undefined},annotated={...original,notes,taxonomy:{...original.taxonomy,note,aliases:[...(original.taxonomy?.aliases||[]),'My search alias']}},saved=structuredClone(annotated);
    assert.ok(TV.shoulderEntryFor(annotated,meta[id],context));assert.ok(TV.shoulderArtworkFor(annotated,meta[id],context));assert.equal(TV.shoulderLibraryOrderFor(annotated,meta[id],context),TV.shoulderLibraryOrderFor(original,meta[id],context));
    const next=TV.applyShoulderAudit({tEx:[annotated]},options).tEx[0];ownValue(next.taxonomy,'note',note);assert.equal(next.notes,notes);assert.ok(next.taxonomy.aliases.includes('My search alias'));assert.deepEqual(annotated,saved);
    const expected=TV.applyShoulderAudit({tEx:[original]},options).tEx[0];for(const k of Object.keys(expected).filter(k=>!['taxonomy','notes'].includes(k)))assert.deepEqual(next[k],expected[k]);
    const resolved=TV.resolveExercise(next,meta[id],undefined,...previousContexts,context);assert.ok(TV.resolvedShoulderDeliveryPolicy(resolved));
    if(publicEntries[id]){const transferred=JSON.parse(JSON.stringify(TV.clientBundle([{id:'note-plan',sessions:[{templateId:'note-template'}]}],[{id:'note-template',blocks:[{id:'note-block',exId:id,measurementType:resolved.measurementType,sets:[]}]}],()=>resolved,{pro:true,now:1}))).exercises[0];assert.ok(TV.shoulderDeliveredViewPolicy(transferred));assert.equal(Object.hasOwn(transferred,'taxonomy'),false);assert.equal(Object.hasOwn(transferred,'notes'),false);}
   }
   for(const taxonomy of [null,undefined,{...original.taxonomy,note:'mine',regions:['personal']},{...original.taxonomy,note:'mine',priority:987},{...original.taxonomy,note:'mine',customFacet:['mine']},{...original.taxonomy,note:'mine',aliases:null},{...original.taxonomy,note:'mine',aliases:undefined}]){
    const custom={...original,taxonomy};assert.equal(TV.shoulderEntryFor(custom,meta[id],context),null);assert.equal(TV.applyShoulderAudit({tEx:[custom]},options).tEx[0],custom);
   }
   for(const metadata of [null,undefined,{...meta[id],note:'mine'},{...meta[id],custom:undefined}])assert.equal(TV.shoulderEntryFor({...original,taxonomy:{...original.taxonomy,note:'mine'}},metadata,context),null);
  }
 }
});
