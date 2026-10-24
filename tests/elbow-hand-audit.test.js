// Mirror into both products' tests/: use actual role sources and actual consumers.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import * as TV from '../src/training/index.js';
import {completeGuidedSet} from '../src/training/guide.js';
import {ELBOW_HAND_AUDIT_ENTRIES as publicEntries} from '../src/training/catalogElbowHandAuditData.js';
import {ELBOW_HAND_AUDIT_CONTEXT as context} from '../src/data/elbowHandAuditContext.js';
import {SHOULDER_AUDIT_CONTEXT} from '../src/data/shoulderAuditContext.js';
import {HIP_AUDIT_CONTEXT} from '../src/data/hipAuditContext.js';
import {LOWER_LEG_AUDIT_CONTEXT} from '../src/data/lowerLegAuditContext.js';
import {LOCOMOTION_AUDIT_CONTEXT} from '../src/data/locomotionAuditContext.js';
import {BALANCE_AUDIT_CONTEXT} from '../src/data/balanceAuditContext.js';
import {MOVEMENT_AUDIT_CONTEXT} from '../src/data/movementAuditContext.js';
import {TRUNK_AUDIT_CONTEXT} from '../src/data/trunkAuditContext.js';
import {EXERCISE_MOTION,exerciseMotionFor} from '../src/shared/product/exerciseMotion.js';
import {loadLibrary,loadEngine} from '../scripts/lib/exercise-library.mjs';

const library=loadLibrary(),meta=library.meta,engine=loadEngine();
const previousContexts=[LOCOMOTION_AUDIT_CONTEXT,LOWER_LEG_AUDIT_CONTEXT,HIP_AUDIT_CONTEXT,SHOULDER_AUDIT_CONTEXT];
const before=TV.seedExerciseExpansion(structuredClone({tEx:library.all}),undefined,{
 ...(context.role==='client'?{includeLungeFoundations:true,includeClientVerticalPushFoundations:true,includeClientVerticalPullFoundations:true}:{}),
 trunkAuditContext:TRUNK_AUDIT_CONTEXT,movementAuditContext:MOVEMENT_AUDIT_CONTEXT,balanceAuditContext:BALANCE_AUDIT_CONTEXT,
 locomotionAuditContext:LOCOMOTION_AUDIT_CONTEXT,lowerLegAuditContext:LOWER_LEG_AUDIT_CONTEXT,hipAuditContext:HIP_AUDIT_CONTEXT,shoulderAuditContext:SHOULDER_AUDIT_CONTEXT,auditMetadata:meta
});
const options={elbowHandAuditContext:context,auditMetadata:meta},after=TV.applyElbowHandAudit(before,options);
const row=id=>after.tEx.find(r=>r.id===id),policy=id=>TV.elbowHandPolicyFor(row(id),meta[id],context);
const resolve=id=>TV.resolveExercise(row(id),meta[id],undefined,...previousContexts,context);
const block=id=>({id:'b',exId:id,measurementType:resolve(id).measurementType,sets:[]});
const bundle=(id,blocks)=>JSON.parse(JSON.stringify(TV.clientBundle([{id:'p',sessions:[{templateId:'t'}]}],[{id:'t',blocks}],()=>resolve(id),{pro:true,now:1})));
const ownValue=(o,k,v)=>{assert.ok(Object.hasOwn(o,k));assert.ok(Object.is(o[k],v));};
const dataFor=id=>publicEntries[id]||context.entries[id]?.data;
const body=(file,start,end)=>{const source=readFileSync(new URL(file,import.meta.url),'utf8'),a=source.indexOf(start),b=source.indexOf(end,a+start.length);assert.ok(a>=0&&b>a,'Consumer moved: update extraction to actual location');return source.slice(a,b);};

test('Elbow/hand role scope and every captured before/after profile remain guarded',()=>{
 assert.equal(Object.keys(context.entries).length,context.role==='main'?73:37);
 assert.equal(Object.keys(publicEntries).length,37);
 assert.equal(Object.keys(context.entries).filter(id=>dataFor(id).policy.viewOnly).length,3);
 for(const[id,local]of Object.entries(context.entries)){
  assert.ok(row(id),id);assert.ok(TV.elbowHandEntryFor(row(id),meta[id],context),id);
  for(const profile of local.profiles){
   const original=structuredClone(profile),metadata=local.metadataAbsent?undefined:local.metadata;
   assert.ok(TV.elbowHandEntryFor(original,metadata,context),id+' before');
   const changed=TV.applyElbowHandAudit({tEx:[original]},{elbowHandAuditContext:context,auditMetadata:{[id]:metadata}}).tEx[0];
   assert.ok(TV.elbowHandEntryFor(changed,metadata,context),id+' after');
   assert.deepEqual(original,profile); // Inspection/adoption may not mutate the input.
   for(const stage of[original,changed])for(const note of[null,undefined]){
    const annotated={...stage,taxonomy:{...stage.taxonomy,note}},adopted=TV.applyElbowHandAudit({tEx:[annotated]},{elbowHandAuditContext:context,auditMetadata:{[id]:metadata}}).tEx[0];
    assert.ok(TV.elbowHandEntryFor(adopted,metadata,context));ownValue(adopted.taxonomy,'note',note);
   }
   for(const value of[null,undefined])assert.equal(TV.elbowHandEntryFor({...changed,source:value},metadata,context),null,id+' own source');
   assert.equal(TV.elbowHandEntryFor(changed,{...metadata,customOverride:undefined},context),null,id+' metadata');
  }
 }
});

test('migration preserves deletions, history, own overrides and free taxonomy notes',()=>{
 const id='dbcurl',history=[{actual:{weight:7,addedWeight:null},side:null}],notes={mine:undefined};
 for(const original of[before.tEx.find(r=>r.id===id),row(id)]){
  for(const note of['My note','',null,undefined]){
   const annotated={...original,notes,taxonomy:{...original.taxonomy,note,aliases:[...(original.taxonomy?.aliases||[]),'my alias']}};
   const next=TV.applyElbowHandAudit({tEx:[annotated],history},options);
   ownValue(next.tEx[0].taxonomy,'note',note);assert.equal(next.tEx[0].notes,notes);assert.equal(next.history,history);
   assert.ok(next.tEx[0].taxonomy.aliases.includes('my alias'));assert.ok(TV.elbowHandEntryFor(next.tEx[0],meta[id],context));
  }
  for(const override of[{source:undefined},{source:null},{art:undefined},{exe:['Mine','Mine']},{taxonomy:undefined},{taxonomy:null},{taxonomy:{...original.taxonomy,note:'mine',regions:['mine']}},{taxonomy:{...original.taxonomy,aliases:undefined}},{taxonomy:{...original.taxonomy,customFacet:undefined}}]){
   const custom={...original,...override};assert.equal(TV.elbowHandEntryFor(custom,meta[id],context),null);assert.equal(TV.applyElbowHandAudit({tEx:[custom]},options).tEx[0],custom);
  }
 }
 assert.deepEqual(TV.applyElbowHandAudit({tEx:[],deleted:[id],history},options).tEx,[]);
 assert.equal(TV.applyElbowHandAudit(after,options),after);
 const migrated=TV.applyElbowHandAudit({...before,elbowHandAudit20261024:true},options);assert.equal(migrated.elbowHandAudit20261024,1);
});

test('public delivery never includes private cards or private profile metadata',()=>{
 const privateIds=Object.keys(context.entries).filter(id=>!publicEntries[id]);assert.equal(privateIds.length,context.role==='main'?36:0);
 assert.ok(Object.values(publicEntries).every(e=>!Object.hasOwn(e,'metadata')&&!Object.hasOwn(e,'profiles')));
 for(const id of privateIds){assert.equal(bundle(id,[block(id)]).exercises[0].elbowHandAudit,undefined);assert.equal(TV.elbowHandViewPolicyFor(row(id),meta[id],{...context,role:'client'}),null);}
 if(context.role==='client'){for(const id of['an_hammer','an_inclcurl','kr_mob_048','gm_palm_pulse']){assert.equal(context.entries[id],undefined);assert.equal(row(id),undefined);}}
 const d=bundle('dbcurl',[block('dbcurl')]).exercises[0];assert.ok(TV.elbowHandDeliveredPolicy(d));assert.equal(Object.hasOwn(d,'taxonomy'),false);assert.equal(Object.hasOwn(d,'notes'),false);
});

test('exact equipment keeps AND supports, OR alternatives and new capabilities distinct',()=>{
 const allow=(id,equipment)=>TV.elbowHandSelectionAllowed(policy(id),{equipment,explicitTarget:true});
 for(const[id,yes,no]of[
  ['ex26_preacher_curl',['ez_bar','preacher_bench'],['ez_bar','flat_bench']],
  ['ex26_plate_curl',['grip_plate'],['plate']],
  ['ex26_band_hammer_curl',['long_resistance_band'],['miniband']],
  ['ex26_machine_triceps',['triceps_extension_machine'],['stroj']],
  ['ex26_mob_wrist_dartthrower',['stable_table','chair'],['stable_table']],
  ['pelican',['kruhy','suspension_anchor'],['kruhy']]
 ]){assert.equal(allow(id,yes),true,id);assert.equal(allow(id,no),false,id);}
 const rec=resolve('ex26_preacher_curl');assert.equal(TV.selectableFor(rec,{equipment:['ez_bar','preacher_bench'],explicitTarget:true}).ok,true);assert.equal(TV.selectableFor(rec,{equipment:['ez_bar'],explicitTarget:true}).ok,false);
 for(const cable of['high_cable','adjustable_cable'])for(const handle of['cable_bar','cable_rope'])assert.equal(allow('pushdown',[cable,handle]),true);
 assert.equal(allow('pushdown',['high_cable']),false);assert.equal(allow('pushdown',['cable_rope']),false);
 assert.equal(allow('ex26_mob_tendon_glides',[]),true);assert.deepEqual(policy('ex26_mob_tendon_glides').requirements,[]);
 assert.equal(TV.elbowHandSelectionAllowed(policy('dbcurl'),{equipment:['dumbbell_pair']}),false);
 assert.equal(allow('vi_biceps',['unknown_equipment']),false);
});

test('primary kilograms work while historical own secondary load survives editing and completion',()=>{
 const id='dbcurl',p=policy(id);assert.equal(p.auditKind,'elbowHand');assert.equal(resolve(id).measurementType,'WEIGHT_REPS');assert.equal(resolve(id).loadMode,'ext');assert.equal(p.noAddedWeight,false);
 assert.deepEqual(TV.locomotionProtectedLoadKeys(p),['addedWeight']);assert.equal(TV.locomotionRecordOptions(p).excludeExtraLoad,undefined);
 for(const value of[null,undefined]){
  const session={blocks:[{...block(id),sets:[{id:'s',planned:{targetWeight:4,targetReps:8,addedWeight:value},actual:{addedWeight:value},side:null,note:'keep'}]}]},saved=structuredClone(session);
  const edited=TV.locomotionSetActual(session,'b','s',{weight:6,reps:9,addedWeight:99},p).blocks[0].sets[0];assert.equal(edited.actual.weight,6);ownValue(edited.actual,'addedWeight',value);ownValue(edited.planned,'addedWeight',value);
  const done=TV.locomotionCompleteSet(session,'b','s',1,p).blocks[0].sets[0];assert.equal(done.actual.weight,4);ownValue(done.actual,'addedWeight',value);assert.equal(done.side,null);assert.equal(done.note,'keep');assert.deepEqual(session,saved);
  assert.equal(TV.locomotionCanCopyPrevious({sets:[edited]},session.blocks[0],p),false);
 }
 assert.deepEqual(TV.locomotionProtectedLoadKeys(policy('wristcars')),['weight','addedWeight']);
 assert.deepEqual(TV.locomotionProtectedLoadKeys({auditKind:'custom',measurementType:'WEIGHT_REPS',loadMode:'ext'}),[]);
 assert.deepEqual(TV.warmupFor({exercise:resolve(id),workingWeight:10}),[]);
});

test('actual App planned editor and shared guide keep own secondary null and undefined',()=>{
 const planned=vm.runInNewContext(body('../src/App.tsx','function tvLocoPlanned(','function TvLocoHistory')+'\ntvLocoPlanned',{TV});
 const guide=body('../src/shared/ui/trainingGuide.jsx','    const applyComplete = (s) => {','    const restInfo =');
 const id='dbcurl',p=policy(id);
 for(const value of[null,undefined]){
  const plan={targetWeight:4,targetReps:8,addedWeight:value};const changed=planned('WEIGHT_REPS',plan,{targetWeight:6,addedWeight:99},p);assert.equal(changed.targetWeight,6);ownValue(changed,'addedWeight',value);
  const session={blocks:[{...block(id),sets:[{id:'s',type:'work',planned:plan,actual:{addedWeight:value},side:null}]}]};
  const complete=vm.runInNewContext(guide+'\napplyComplete',{TV,policy:p,block:{id:'b'},set:{id:'s'},prevSet:{actual:{weight:9,addedWeight:99,reps:8}},extra:{},Date:{now:()=>1},completeGuidedSet});
  const done=complete(session).blocks[0].sets[0];assert.equal(done.actual.weight,4);ownValue(done.actual,'addedWeight',value);ownValue(done.planned,'addedWeight',value);
 }
});

test('mixed custom prescriptions opt the whole delivered exercise out before JSON erases undefined',()=>{
 const id='dbcurl',b=block(id),good=bundle(id,[b]).exercises[0];assert.ok(TV.elbowHandDeliveredViewPolicy(good));
 for(const override of[{variant:0},{variant:false},{sideMode:undefined},{recordingPolicy:undefined},{equipment:['mine']},{measurementType:'DURATION'}]){
  const d=bundle(id,[b,{...b,id:'other',...override}]).exercises[0];assert.equal(d.elbowHandAudit,undefined);assert.equal(TV.elbowHandDeliveredViewPolicy(d),null);
 }
 assert.equal(TV.elbowHandDeliveredViewPolicy({...good,execution:['Mine','Mine']}),null);
 assert.equal(TV.elbowHandPolicyForBlock(row(id),meta[id],context,{...b,sideMode:undefined}),null);
});

test('retained views preserve all earlier recording capabilities and WeakMaps',()=>{
 const getters=[TV.resolvedLocomotionPolicy,TV.resolvedLowerLegPolicy,TV.resolvedHipPolicy,TV.resolvedHipDeliveryPolicy,TV.resolvedShoulderPolicy,TV.resolvedShoulderDeliveryPolicy];
 for(const id of['sphinx','hang','towelhang']){
  const old=before.tEx.find(r=>r.id===id),plain=TV.resolveExercise(old,meta[id],undefined,...previousContexts),rec=resolve(id);
  assert.equal(row(id),old);assert.equal(policy(id),null);assert.equal(TV.elbowHandEquipmentDecision(row(id),meta[id],context,[],false),undefined);
  for(const key of['measurementType','loadMode','sideMode','warmupPolicy','generatorEligible'])assert.deepEqual(rec[key],plain[key]);
  for(const get of getters)assert.deepEqual(get(rec),get(plain));
  const d=bundle(id,[block(id)]).exercises[0];assert.equal(TV.elbowHandDeliveredPolicy(d),null);assert.equal(TV.elbowHandDeliveredViewPolicy(d).viewOnly,true);assert.ok(TV.elbowHandDeliveredArtworkFor(d));
  const mixed=bundle(id,[block(id),{...block(id),id:'custom',sideMode:undefined}]).exercises[0];assert.equal(TV.elbowHandDeliveredViewPolicy(mixed),null);
 }
 assert.equal(resolve('pelican').familyId,'elbow_flexion');assert.equal(engine.tFamilyOf(row('pelican')),'elbow_flexion');
 if(context.role==='main')for(const id of['gm_w_forearm_circle','gm_w_wrist_open','gm_w_wrist_circle'])assert.deepEqual(Array.from(engine.tPrepJointsOf(row(id))),policy(id).prepJoints);
});

test('side meanings are bilingual tuples; no side is invented for old records',()=>{
 for(const id of Object.keys(context.entries)){const p=policy(id);if(p?.sideMeaning){assert.equal(p.sideMeaning.length,2);assert.ok(p.sideMeaning.every(s=>typeof s==='string'&&s.length));}}
 const id='ex26_wrist_pronation',p=policy(id);assert.equal(p.sideMode,'perSide');
 const session={blocks:[{...block(id),sets:[{id:'s',planned:{targetWeight:1,targetReps:8},actual:{},side:null}]}]};
 const next=TV.locomotionCompleteSet(session,'b','s',1,p);assert.equal(next.blocks[0].sets[0].side,null);assert.equal(session.blocks[0].sets[0].side,null);
 assert.equal(TV.locomotionCanCopyPrevious({sets:[{actual:{weight:1,reps:8},side:'L'}]},session.blocks[0],p),false);
});

test('motion suppression is source-exact, personal source and future repairs stay outside it',()=>{
 const id='dbcurl',motion=EXERCISE_MOTION[id];assert.ok(motion?.src);assert.equal(TV.elbowHandMotionAllowed(row(id),meta[id],context,motion),false);
 assert.equal(TV.elbowHandMotionAllowed(row(id),meta[id],context,{...motion,src:'/exercise-motion/repaired-regression.mp4'}),true);
 assert.equal(TV.elbowHandMotionAllowed({...row(id),source:'mine'},meta[id],context,motion),true);
 assert.equal(TV.elbowHandArtworkFor({...row(id),art:undefined},meta[id],context),null);
});

test('actual legacy generator permits only seven exact requested foundations and keeps existing gates',()=>{
 const opts=(prefMus=[],prefJ=[],equip=['telo','dumbbell_pair','dumbbell','long_resistance_band','high_cable','cable_rope','chair'])=>({level:4,equip,injuries:[],prefMus,prefJ,block:'accessory',exclude:[],excludeFamilies:[],elbowHandAccessoryFocus:true});
 for(const[id,mus,joints,gear]of[['dbcurl',['bic'],[],['dumbbell_pair']],['ex26_band_hammer_curl',['bic'],[],['long_resistance_band']],['pushdown',['tri'],[],['high_cable','cable_rope']],['dbtriext',['tri'],[],['dumbbell']],['ex26_wrist_pronation',['fore'],[],['dumbbell','chair']],['wristcars',[],['zap'],['telo']],['elbowcars',[],['lok'],['telo']]])assert.equal(engine.tpRank(after.tEx,opts(mus,joints,gear))[0]?.id,id);
 const db=row('dbcurl'),request=opts(['bic']);
 for(const patch of[{prefMus:['tri']},{equip:[]},{roles:['mobility']},{exclude:['dbcurl']},{excludeFamilies:['elbow_flexion']},{pat:'drep'}])assert.equal(engine.tpRank([db],{...request,...patch}).length,0);
 for(const patch of[{elbowHandAccessoryFocus:false},{target:true},{block:'prep'},{block:'strength'},{block:['accessory']}])assert.equal(engine.tpAccessoryFocus.policy(db,{...request,...patch}),null);
 for(const source of[null,undefined])assert.equal(engine.tpRank([{...db,source}],request).length,0);
 const permissions=new Set(['dbcurl','ex26_band_hammer_curl','pushdown','dbtriext','ex26_wrist_pronation','wristcars','elbowcars']);
 for(const x of after.tEx)if(engine.tpAccessoryFocus.policy(x,opts(['bic','tri','fore'],['zap','lok'])))assert.ok(permissions.has(x.id));
 const plan=engine.tpGenerate({goals:['sila'],level:4,days:2,weeks:4,minutes:120,equip:['dumbbell','high_cable','cable_rope'],injuries:[],musFocus:['tri'],mobFocus:[]},after.tEx,[]);
 assert.ok(plan.workouts.flatMap(w=>w.rows).some(x=>['pushdown','dbtriext'].includes(x.ex)));
});

test('Client delivered cards cannot borrow local art/motion trust by matching only the ID',{skip:context.role!=='client'},()=>{
 const id='dbcurl',motion=EXERCISE_MOTION[id],valid=bundle(id,[block(id)]).exercises[0];
 const art=vm.runInNewContext(body('../src/App.tsx','function tvElbowHandDeliveredArt(','function tvShoulderDeliveredArt(')+'\ntvElbowHandDeliveredArt',{TV});
 assert.ok(art(valid,true));assert.equal(art({...valid,elbowHandAudit:undefined},true).suppress,true);
 const allow=vm.runInNewContext(body('../src/App.tsx','function tvElbowHandClientMotionAllowed(','function tvShoulderClientMotionAllowed(')+'\ntvElbowHandClientMotionAllowed',{TV,hipCurrentMotionFor:exerciseMotionFor,ELBOW_HAND_AUDIT_CONTEXT:context,tMetaOf:x=>meta[x.id]});
 assert.equal(allow({tvExerciseOf:()=>({...valid,elbowHandAudit:undefined})},id,row(id)),false);
 assert.equal(allow({tvExerciseOf:()=>valid},id,row(id)),false);
 assert.equal(allow({tvExerciseOf:()=>null},id,{...row(id),source:'mine'}),true);
 assert.ok(motion.src);
});

test('Main canonical fresh templates retain old doses, own copies and hidden routines',{skip:context.role!=='main'},async()=>{
 const {MOBILITY_TEMPLATES,MOBILITY_SOURCE_POSITIONS}=await import('../src/library/mobility.js');
 const {creatorTemplates}=await import('../src/library/creator-programs.js');
 const {makeShoulderFreshTemplateAdapter}=await import('../src/library/shoulderFreshTemplates.js');
 const {makeElbowHandFreshTemplateAdapter}=await import('../src/library/elbowHandFreshTemplates.js');
 const creators=creatorTemplates(id=>TV.resolveExercise(library.byId[id],meta[id],undefined,...previousContexts,context));
 const shoulder=makeShoulderFreshTemplateAdapter(MOBILITY_TEMPLATES,MOBILITY_SOURCE_POSITIONS),adapter=makeElbowHandFreshTemplateAdapter(MOBILITY_TEMPLATES,MOBILITY_SOURCE_POSITIONS,creators,shoulder);
 const ctx={...context,shoulderAuditContext:SHOULDER_AUDIT_CONTEXT},result=adapter(MOBILITY_TEMPLATES,creators,after.tEx,meta,ctx),previous=shoulder(MOBILITY_TEMPLATES,after.tEx,meta,SHOULDER_AUDIT_CONTEXT);
 const blocks=ts=>new Map(ts.flatMap(t=>t.blocks.map(b=>[t.id+'/'+b.id,b]))),old=blocks([...previous,...creators]),next=blocks([...result.mobility,...result.creator]);
 let changed=0;for(const[key,b]of next){const original=old.get(key);assert.ok(original);if(TV.elbowHandSame(original,b))continue;changed++;
  const strip=({name,coachNote,...rest})=>rest;assert.deepEqual(strip(b),strip(original));assert.equal(b.sets,original.sets);
 }
 assert.equal(changed,54);
 for(const[key,b]of blocks(previous)){if(!TV.elbowHandSame(b,blocks(MOBILITY_TEMPLATES).get(key)))assert.deepEqual(next.get(key),b);}
 const own=structuredClone(creators);own[0].blocks[0].coachNote=['Personal','Personal'];assert.equal(adapter(MOBILITY_TEMPLATES,own,after.tEx,meta,ctx).creator,own);
 const missing=adapter(MOBILITY_TEMPLATES,creators,after.tEx.filter(r=>r.id!=='wristcars'),meta,ctx);for(const t of missing.creator)for(const b of t.blocks)if(b.exId==='wristcars')assert.equal(b,blocks(creators).get(t.id+'/'+b.id));
 // Real App projection/merge/edit functions, with the same canonical factories.
 const canon=TV.separateWarmupTemplates([...MOBILITY_TEMPLATES,...creators]);
 const env={TV,makeShoulderFreshTemplateAdapter,makeElbowHandFreshTemplateAdapter,MOBILITY_TEMPLATES,MOBILITY_SOURCE_POSITIONS,CREATOR_TEMPLATES:creators,ELBOW_HAND_AUDIT_CONTEXT:context,SHOULDER_AUDIT_CONTEXT,TEX_META:meta,LIB_TEMPLATES:canon,WeakMap};
 const project=vm.runInNewContext(body('../src/App.tsx','const tvShoulderFresh=','const LIB_PLANS_V2 =')+'\ntvElbowHandFreshLibrary',env);
 const collection={...after},projected=project(collection);assert.notEqual(projected,canon);assert.equal(project(collection),projected);
 const template=projected.find(t=>t.blocks.some(b=>b.exId==='wristcars'));assert.ok(template);
 const custom={...template,coachNote:'personal',blocks:template.blocks.map(b=>({...b,note:'personal'}))};
 const coll=TV.patchTraining(collection,{templates:[custom],hiddenLib:[projected.find(t=>t.id!==template.id).id]});
 const list=vm.runInNewContext(body('../src/App.tsx','  const tvTemplates =','  const tvPlans =')+'\ntvTemplates',{TV,coll,tvElbowHandFreshLibrary:project,tvHiddenLib:()=>TV.trainingOf(coll).hiddenLib});
 const visible=list();assert.deepEqual(visible.find(t=>t.id===custom.id),custom);assert.ok(!visible.some(t=>t.id===TV.trainingOf(coll).hiddenLib[0]));
 let saved;const edit=vm.runInNewContext(body('../src/App.tsx','  const tvEditTemplate =','  const tvEditPlan =')+'\ntvEditTemplate',{TV,tvElbowHandFreshLibrary:project,persistColl:fn=>(saved=fn(collection)),libStrip:t=>{const{lib,...rest}=t;return rest;}});
 edit(template.id,t=>({...t,name:['Mine','Mine']}));const stored=TV.templatesOf(saved).find(t=>t.id===template.id);assert.deepEqual(stored.blocks,template.blocks);assert.deepEqual(stored.name,['Mine','Mine']);
});
