import test from 'node:test';
import assert from 'node:assert/strict';
import * as TV from '../src/training/index.js';
import { THROW_AUDIT_CONTEXT as context } from '../src/data/throwAuditContext.js';

const metadata=Object.fromEntries(Object.entries(context.entries).map(([id,e])=>[id,e.metadata]));
const rows=Object.values(context.entries).map(e=>structuredClone(e.profiles[0]));
const options={throwAuditContext:context,auditMetadata:metadata};
const reviewed=TV.applyThrowAudit({tEx:rows},options).tEx;
const resolve=TV.makeResolver(metadata,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,context);

test('Medicine-ball refinement keeps real mass and guards exact role/source semantics',()=>{
 assert.equal(reviewed.length,7);
 for(const row of reviewed){
  const rec=resolve(row),p=TV.throwPolicyFor(row,metadata[row.id],context);
  assert.equal(rec.measurementType,'WEIGHT_REPS');assert.equal(rec.loadMode,'ext');assert.equal(TV.resolvedThrowPolicy(rec).id,row.id);
  assert.equal(TV.selectableFor(rec,{explicitTarget:true,coachPresent:true,equipment:p.requirements.map(g=>g[0])}).ok,true);
  assert.equal(TV.selectableFor(rec,{explicitTarget:true,coachPresent:true,equipment:[]}).ok,false);
  const mine={...row,eq:null};assert.equal(TV.throwPolicyFor(mine,metadata[row.id],context),null);assert.equal(TV.applyThrowAudit({tEx:[mine]},options).tEx[0],mine);
 }
});

test('Editing ball weight preserves old auxiliary null/undefined/number and the other side',()=>{
 for(const row of reviewed){const rec=resolve(row),p=TV.throwPolicyFor(row,metadata[row.id],context);
  const block=TV.makeBlock({exId:row.id,measurementType:rec.measurementType,sets:[TV.makeSet('WEIGHT_REPS',{side:p.sideMode==='perSide'?'L':null,planned:{targetWeight:4,targetReps:7}}),TV.makeSet('WEIGHT_REPS',{side:p.sideMode==='perSide'?'R':null,planned:{targetWeight:3,targetReps:5}})]});
  for(const previous of[null,undefined,2.5]){const session=TV.startSession(TV.makeTemplate({cz:'Test',blocks:[block]}),{}),first=session.blocks[0].sets[0];first.actual.addedWeight=previous;first.planned.addedWeight=previous;const snapshot=structuredClone(session),other=structuredClone(session.blocks[0].sets[1]);
   let changed=TV.locomotionSetActual(session,session.blocks[0].id,first.id,{weight:6,reps:9,addedWeight:99},p);changed=TV.locomotionCompleteSet(changed,session.blocks[0].id,first.id,123,p);const actual=changed.blocks[0].sets[0];assert.equal(actual.actual.weight,6);assert.equal(actual.actual.reps,9);assert.ok(Object.hasOwn(actual.actual,'addedWeight'));assert.equal(actual.actual.addedWeight,previous);assert.ok(Object.hasOwn(actual.planned,'addedWeight'));assert.equal(actual.planned.addedWeight,previous);assert.equal(actual.planned.targetWeight,4);assert.equal(actual.planned.targetReps,7);assert.deepEqual(changed.blocks[0].sets[1],other);assert.deepEqual(session,snapshot);
  }
 }
});

test('Only exact public delivery and compatible blocks carry reviewed throwing semantics',()=>{
 const row=reviewed.find(r=>r.id==='ex26_mb_lunge_pass'),rec=resolve(row),p=TV.throwPolicyFor(row,metadata[row.id],context),block=TV.makeBlock({exId:row.id,measurementType:rec.measurementType,sets:[TV.makeSet('WEIGHT_REPS',{side:'L',planned:{targetWeight:4,targetReps:7}})]}),template=TV.makeTemplate({cz:'Test',blocks:[block]}),plan=TV.makePlan({cz:'Test',sessions:[TV.makePlanSession({templateId:template.id})]}),bundle=TV.clientBundle([plan],[template],()=>rec,{pro:true,now:1}),payload=bundle.exercises[0];
 assert.equal(TV.throwDeliveredPolicy(payload)?.id,row.id);assert.equal(TV.throwDeliveredPolicy({...payload,execution:['Moje','Mine']}),null);assert.equal(TV.throwBlockCompatible(p,{...block,variant:['own']}),false);assert.deepEqual(TV.warmupFor({exercise:rec,workingWeight:100,policy:'ramp'}),[]);assert.deepEqual(TV.recordsFor('WEIGHT_REPS',[{completed:true,actual:{weight:6,reps:9}}],TV.locomotionRecordOptions(p)),{});
});
