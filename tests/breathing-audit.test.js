import test from 'node:test';
import assert from 'node:assert/strict';
import * as TV from '../src/training/index.js';
import {BREATHING_AUDIT_CONTEXT as context} from '../src/data/breathingAuditContext.js';
const resolve=(row,meta)=>TV.resolveExercise(row,meta,undefined,...Array(6).fill(undefined),context);
const adopted=(id,original=context.entries[id].profiles[0])=>TV.applyBreathingAudit({tEx:[original]},{breathingAuditContext:context,auditMetadata:{[id]:context.entries[id].metadata}}).tEx[0];

test('breathing migration preserves personal fields, deleted rows and exact role ownership',()=>{
 assert.equal(Object.keys(context.entries).length,context.role==='main'?7:6);assert.equal(Object.keys(TV.BREATHING_AUDIT_ENTRIES).length,6);
 for(const[id,entry]of Object.entries(context.entries))for(const before of entry.profiles){
  const copy=structuredClone(before),after=adopted(id,before);assert.deepEqual(before,copy);assert.ok(TV.breathingPolicyFor(after,entry.metadata,context),id);
  for(const key of ['eq','exe','warmupPolicy','requiresCoach','source'])for(const value of [null,undefined]){const own={...before,[key]:value};assert.equal(adopted(id,own),own,id+'/'+key);}
  const note={...before,notes:{mine:null},taxonomy:{...before.taxonomy,note:undefined,aliases:['my name']}};const saved=adopted(id,note);assert.equal(saved.notes,note.notes);assert.ok(Object.hasOwn(saved.taxonomy,'note'));assert.ok(saved.taxonomy.aliases.includes('my name'));
  assert.equal(TV.breathingPolicyFor(after,{...entry.metadata,personal:undefined},context),null);
 }
 const history=[{actual:{durationSec:73,addedWeight:null},side:'L'}],result=TV.applyBreathingAudit({tEx:[],history},{breathingAuditContext:context,auditMetadata:{}});assert.deepEqual(result.tEx,[]);assert.equal(result.history,history);
 assert.ok(!TV.BREATHING_AUDIT_ENTRIES.jg_simhasana);if(context.role==='client')assert.ok(!context.entries.jg_simhasana);
});

test('actual breathing selection requires opt-in, precise equipment and a separate retention decision',()=>{
 for(const[id,entry]of Object.entries(context.entries)){
  const row=adopted(id),p=TV.breathingPolicyFor(row,entry.metadata,context),rec=resolve(row,entry.metadata),equipment=p.requirements.filter(g=>!g.includes('telo')).map(g=>g[0]);
  assert.equal(rec.role,'BREATH');assert.equal(rec.measurementType,'DURATION');assert.equal(rec.sideMode,'none');assert.equal(rec.loadMode,'none');assert.equal(TV.resolvedBreathingPolicy({...rec}),null);
  for(const allowBreath of [false,true])for(const explicitTarget of [false,true])for(const coachPresent of [false,true])assert.equal(TV.selectableFor(rec,{allowBreath,explicitTarget,coachPresent,equipment}).ok,allowBreath&&(id!=='co2'||explicitTarget&&coachPresent),id);
  assert.equal(TV.selectableFor(rec,{allowBreath:true,explicitTarget:true,coachPresent:true}).ok,false);
  assert.deepEqual(TV.warmupFor({exercise:rec,policy:'ramp',workingWeight:100}),[]);
 }
 for(const [id,equipment]of [['boxbreath',['chair']],['ex26_dns_quad_feedback',['guma']]]){const rec=resolve(adopted(id),context.entries[id].metadata);assert.equal(TV.selectableFor(rec,{allowBreath:true,equipment}).ok,false);}
});

test('whole-practice recording never creates load, comparison records or automated time progress',()=>{
 for(const[id,entry]of Object.entries(context.entries)){
  const row=adopted(id),rec=resolve(row,entry.metadata),p=TV.breathingPolicyFor(row,entry.metadata,context),block=TV.makeBlock({exId:id,measurementType:'DURATION',sets:[TV.makeSet('DURATION',{planned:{targetDurationSec:73}})]});assert.ok(TV.breathingBlockCompatible(p,block));
  const template=TV.makeTemplate({cz:'Test',blocks:[block]}),session=TV.startSession(template,{});let next=TV.locomotionSetActual(session,session.blocks[0].id,session.blocks[0].sets[0].id,{durationSec:73,addedWeight:9,weight:5},p);next=TV.locomotionCompleteSet(next,next.blocks[0].id,next.blocks[0].sets[0].id,100,p);
  assert.equal(next.blocks[0].sets[0].actual.durationSec,73);assert.ok(!Object.hasOwn(next.blocks[0].sets[0].actual,'addedWeight'));assert.equal(TV.evaluateBlock(next.blocks[0],{manualProgression:p.manualProgression,role:rec.sessionRole,streakAtPrescription:8}).k,'practice');
  assert.deepEqual(TV.recordsFor('DURATION',[{measurementType:'DURATION',completed:true,actual:{durationSec:73}}],TV.locomotionRecordOptions(p)),{});
  assert.ok(!TV.breathingBlockCompatible(p,{...block,variant:['own']}));assert.ok(!TV.breathingBlockCompatible(p,{...block,requiresCoach:!p.requiresCoach}));
 }
});
