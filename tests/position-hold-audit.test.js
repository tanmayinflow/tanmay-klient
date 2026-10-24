// Run against each role's actual modules, migration, App consumers and delivery.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import * as TV from '../src/training/index.js';
import {POSITION_HOLD_AUDIT_CONTEXT as context} from '../src/data/positionHoldAuditContext.js';
import {POSITION_HOLD_AUDIT_ENTRIES as publicEntries} from '../src/training/catalogPositionHoldAuditData.js';
import {ELBOW_HAND_AUDIT_CONTEXT} from '../src/data/elbowHandAuditContext.js';
import {SHOULDER_AUDIT_CONTEXT} from '../src/data/shoulderAuditContext.js';
import {HIP_AUDIT_CONTEXT} from '../src/data/hipAuditContext.js';
import {LOWER_LEG_AUDIT_CONTEXT} from '../src/data/lowerLegAuditContext.js';
import {LOCOMOTION_AUDIT_CONTEXT} from '../src/data/locomotionAuditContext.js';
import {BALANCE_AUDIT_CONTEXT} from '../src/data/balanceAuditContext.js';
import {MOVEMENT_AUDIT_CONTEXT} from '../src/data/movementAuditContext.js';
import {TRUNK_AUDIT_CONTEXT} from '../src/data/trunkAuditContext.js';
import {loadLibrary,loadEngine} from '../scripts/lib/exercise-library.mjs';

const library=loadLibrary(),meta=library.meta,engine=loadEngine();
const prior=[LOCOMOTION_AUDIT_CONTEXT,LOWER_LEG_AUDIT_CONTEXT,HIP_AUDIT_CONTEXT,SHOULDER_AUDIT_CONTEXT,ELBOW_HAND_AUDIT_CONTEXT];
const seedOptions={...(context.role==='client'?{includeLungeFoundations:true,includeClientVerticalPushFoundations:true,includeClientVerticalPullFoundations:true}:{}),trunkAuditContext:TRUNK_AUDIT_CONTEXT,movementAuditContext:MOVEMENT_AUDIT_CONTEXT,balanceAuditContext:BALANCE_AUDIT_CONTEXT,locomotionAuditContext:LOCOMOTION_AUDIT_CONTEXT,lowerLegAuditContext:LOWER_LEG_AUDIT_CONTEXT,hipAuditContext:HIP_AUDIT_CONTEXT,shoulderAuditContext:SHOULDER_AUDIT_CONTEXT,elbowHandAuditContext:ELBOW_HAND_AUDIT_CONTEXT,auditMetadata:meta};
const before=TV.seedExerciseExpansion(structuredClone({tEx:library.all}),undefined,seedOptions),options={positionHoldAuditContext:context,auditMetadata:meta},after=TV.applyPositionHoldAudit(before,options);
const row=id=>after.tEx.find(r=>r.id===id),policy=id=>TV.positionHoldPolicyFor(row(id),meta[id],context),resolve=id=>TV.resolveExercise(row(id),meta[id],undefined,...prior,context);
const block=id=>({id:'b',exId:id,measurementType:resolve(id).measurementType,sets:[]});
const bundle=(id,blocks)=>JSON.parse(JSON.stringify(TV.clientBundle([{id:'p',sessions:[{templateId:'t'}]}],[{id:'t',blocks}],()=>resolve(id),{pro:true,now:1})));
const ownValue=(o,k,v)=>{assert.ok(Object.hasOwn(o,k));assert.ok(Object.is(o[k],v));};
const body=(start,end)=>{const s=readFileSync(new URL('../src/App.tsx',import.meta.url),'utf8'),a=s.indexOf(start),b=s.indexOf(end,a+start.length);assert.ok(a>=0&&b>a,'Actual App consumer boundary');return s.slice(a,b);};

test('position/hold current scope adopts actual defaults and guards every captured source profile',()=>{
 assert.equal(Object.keys(context.entries).length,context.role==='main'?221:46);assert.equal(Object.keys(publicEntries).length,46);
 for(const[id,local]of Object.entries(context.entries)){
  assert.ok(row(id),id);assert.ok(policy(id),id+' actual seeded trust');
  for(const original of local.profiles){
   const saved=structuredClone(original),opts={positionHoldAuditContext:context,auditMetadata:{[id]:local.metadata}};
   const adopted=TV.applyPositionHoldAudit({tEx:[original]},opts).tEx[0];
   assert.deepEqual(original,saved);assert.ok(TV.positionHoldEntryFor(adopted,local.metadata,context),id);
   for(const current of[original,adopted]){
    for(const v of[null,undefined]){
     assert.equal(TV.positionHoldEntryFor({...current,art:v},local.metadata,context),null,id+' own art');
     assert.equal(TV.positionHoldEntryFor({...current,contextOverride:v},local.metadata,context),null,id+' own context');
    }
    assert.equal(TV.positionHoldEntryFor(current,{...local.metadata,personalOverride:undefined},context),null,id+' metadata');
   }
   const previous=TV.resolveExercise(original,local.metadata,undefined,...prior),next=TV.resolveExercise(adopted,local.metadata,undefined,...prior,context);
   for(const k of['measurementType','loadMode','sideMode'])assert.equal(next[k],previous[k],id+'/'+k);
  }
 }
});

test('adoption preserves personal notes, aliases, deletions, history and custom nullable fields',()=>{
 const id='hold90',original=before.tEx.find(r=>r.id===id),history=[{side:null,actual:{addedWeight:undefined}}],notes={mine:null};
 for(const note of['moje poznámka','',null,undefined]){
  const annotated={...original,notes,taxonomy:{...original.taxonomy,note,aliases:[...(original.taxonomy?.aliases||[]),'můj název']}};
  const next=TV.applyPositionHoldAudit({tEx:[annotated],history},options);
  assert.equal(next.history,history);assert.equal(next.tEx[0].notes,notes);ownValue(next.tEx[0].taxonomy,'note',note);assert.ok(next.tEx[0].taxonomy.aliases.includes('můj název'));assert.ok(TV.positionHoldEntryFor(next.tEx[0],meta[id],context));
 }
 for(const override of[{exe:['vlastní','custom']},{source:undefined},{source:null},{taxonomy:null},{taxonomy:undefined},{taxonomy:{...original.taxonomy,aliases:undefined}},{taxonomy:{...original.taxonomy,customFacet:undefined}}]){
  const custom={...original,...override};assert.equal(TV.applyPositionHoldAudit({tEx:[custom]},options).tEx[0],custom);
 }
 assert.deepEqual(TV.applyPositionHoldAudit({tEx:[],deleted:[id],history},options).tEx,[]);assert.equal(TV.applyPositionHoldAudit(after,options),after);
});

test('equipment and explicit skill selection pass through the actual shared selector',()=>{
 const selection=(id,gear,explicitTarget=true)=>TV.positionHoldSelectionAllowed(policy(id),{equipment:gear,explicitTarget});
 for(const id of['frontlever','tuckback','maltese']){assert.equal(selection(id,['kruhy']),false);assert.equal(selection(id,['kruhy','suspension_anchor']),true);}
 assert.equal(selection('frontlever',['hrazda']),true);assert.equal(selection('ringsupport',['bradla']),false);
 assert.equal(selection('ig28_reverse_plank_slide',['hand_support_blocks_pair','sliders','sliding_surface']),true);assert.equal(selection('ig28_reverse_plank_slide',['hand_support_blocks_pair','sliders']),false);
 assert.equal(selection('maltpress',['dumbbell','flat_bench']),true);assert.equal(selection('maltpress',['dumbbell']),false);
 assert.equal(selection('planche',['telo'],false),false);assert.equal(selection('planchenneg',['telo']),false);assert.equal(selection('childpose',['telo'],false),true);
 assert.equal(TV.selectableFor(resolve('frontlever'),{equipment:['hrazda'],explicitTarget:false,coachPresent:true}).ok,false);
 assert.equal(TV.selectableFor(resolve('frontlever'),{equipment:['kruhy'],explicitTarget:true,coachPresent:true}).ok,false);
 assert.equal(TV.selectableFor(resolve('frontlever'),{equipment:['hrazda'],explicitTarget:true,coachPresent:true}).ok,true);
 assert.deepEqual(TV.warmupFor({exercise:resolve('maltpress'),workingWeight:8}),[]);
});

test('Maltese press keeps primary kilograms and historical own secondary loads without guessing sides',()=>{
 const p=policy('maltpress');assert.equal(p.loadMode,'ext');assert.equal(p.measurementType,'WEIGHT_REPS');assert.deepEqual(TV.locomotionProtectedLoadKeys(p),['addedWeight']);
 const edit=vm.runInNewContext(body('function tvLocoPlanned(','function TvLocoHistory')+'\ntvLocoPlanned',{TV});
 for(const v of[undefined,null,0,7]){
  const planned={targetWeight:4,targetReps:6,addedWeight:v},next=edit('WEIGHT_REPS',planned,{targetWeight:5,addedWeight:99},p);assert.equal(next.targetWeight,5);ownValue(next,'addedWeight',v);
  const session={blocks:[{...block('maltpress'),sets:[{id:'s',planned,actual:{addedWeight:v},side:null}]}]},done=TV.locomotionCompleteSet(session,'b','s',1,p).blocks[0].sets[0];assert.equal(done.actual.weight,4);ownValue(done.actual,'addedWeight',v);ownValue(done.planned,'addedWeight',v);assert.equal(done.side,null);
 }
 const history={blocks:[{...block('frontsplit'),sets:[{id:'s',side:'L',planned:{targetDurationSec:32},actual:{}}]}]},done=TV.locomotionCompleteSet(history,'b','s',1,policy('frontsplit')).blocks[0].sets[0];assert.equal(done.side,'L');assert.equal(done.actual.durationSec,32);
 assert.equal(TV.locomotionCanCopyPrevious({sets:[{actual:{durationSec:5},side:'L'}]},{sets:[{actual:{},side:'R'}]},policy('onelegfl')),false);
});

test('actual legacy App reads a reviewed own-null context without restoring old metadata',()=>{
 for(const id of['hold90','elbowlever']){assert.equal(engine.tCtxOf(row(id)),null);assert.equal(engine.tCtxOf({...row(id),source:'personal'}),meta[id].ctx||null);}
 assert.equal(resolve('elbowlever').familyId,'elbow_balance');assert.equal(engine.tFamilyOf(row('elbowlever')),'elbow_balance');
});

test('public delivery is content-bound and rejects mixed custom prescriptions and private cards',()=>{
 const privateIds=Object.keys(context.entries).filter(id=>!publicEntries[id]);assert.equal(privateIds.length,context.role==='main'?175:0);
 for(const id of privateIds){assert.equal(bundle(id,[block(id)]).exercises[0].positionHoldAudit,undefined);assert.equal(TV.positionHoldViewPolicyFor(row(id),meta[id],{...context,role:'client'}),null);}
 for(const id of Object.keys(publicEntries)){
  const delivered=bundle(id,[block(id)]).exercises[0];assert.ok(TV.positionHoldDeliveredPolicy(delivered),id);assert.equal(Object.hasOwn(delivered,'notes'),false);assert.equal(Object.hasOwn(delivered,'taxonomy'),false);
  for(const override of[{variant:false},{sideMode:undefined},{contextOverride:undefined},{measurementType:'DISTANCE'}]){
   const mixed=bundle(id,[block(id),{...block(id),id:'other',...override}]).exercises[0];assert.equal(mixed.positionHoldAudit,undefined,id);assert.equal(TV.positionHoldDeliveredViewPolicy(mixed),null);
  }
  assert.equal(TV.positionHoldDeliveredViewPolicy({...delivered,execution:['vlastní','mine']}),null);
 }
});

test('actual series and history render stored split sides read-only without assigning an absent side',()=>{
 const p=policy('frontsplit'),source=body('function TvLocoSide(','function TvLocoLegacy(');
 const code=ts.transpileModule(source,{compilerOptions:{jsx:ts.JsxEmit.React}}).outputText;
 const text=s=>s.side==='L'?'Levá':s.side==='R'?'Pravá':'Neurčeno';
 const env={React,TV,useT:()=>({t:{textSec:'#444',text:'#111',borderSoft:'#ccc'}}),FONT_BODY:'sans-serif',L:(a)=>a,TL:a=>a[0],tvLocoSideText:text,tvLocoSideOf:s=>s.side||'unspecified'};
 const Comp=vm.runInNewContext(code+';TvLocoSide;',env);
 for(const side of['L','R']){const set={side},before=structuredClone(set),html=renderToStaticMarkup(React.createElement(Comp,{set,policy:p}));assert.ok(html.includes('Uložená strana'));assert.ok(html.includes(text(set)));assert.ok(!html.includes('<select'));assert.deepEqual(set,before);}
 for(const set of[{}, {side:null}, {side:undefined},{side:'unknown'}])assert.equal(renderToStaticMarkup(React.createElement(Comp,{set,policy:p})), '');
 assert.equal(renderToStaticMarkup(React.createElement(Comp,{set:{side:'L'},policy:null})), '');
 assert.equal(TV.positionHoldStoredSide(policy('middlesplit'),{side:'L'}),null);
 assert.ok(renderToStaticMarkup(React.createElement(Comp,{set:{side:'L'},policy:policy('onelegfl')})).includes('<select'));
 const appSource=readFileSync(new URL('../src/App.tsx',import.meta.url),'utf8'),ast=ts.createSourceFile('App.tsx',appSource,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX),node=ast.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text==='TvLocoHistory');assert.ok(node);
 const histSource=node.getText(ast),histCode=ts.transpileModule(histSource,{compilerOptions:{jsx:ts.JsxEmit.React}}).outputText;
 const History=vm.runInNewContext(histCode+';TvLocoHistory;',{...env,useState:()=>['unspecified',()=>{}],LANG:'cs',tvLocoVariant:()=>false,TvLocoLegacy:()=>null});
 const history=[{side:'L',at:1,sessionId:'synthetic',date:'2026-10-24',measurementType:'DURATION',actual:{durationSec:32}}];
 const html=renderToStaticMarkup(React.createElement(History,{policy:p,history,type:'DURATION'}));assert.ok(html.includes('Levá'));assert.ok(html.includes('32'));assert.ok(!html.includes('<select'));assert.equal(history[0].side,'L');
});

// A floor-rest variation must not inherit the raised-shoulderstand context.
test('private floor-rest and Rabbit retain their distinct actual support and coach decisions',{skip:context.role!=='main'},()=>{
 const id='jg_viparita_karani',r=row(id);assert.equal(engine.tCtxOf(r),null);assert.equal(resolve(id).sessionRole,'mobility');assert.deepEqual(r.precautions,[]);assert.equal(r.goalRole,'support');
 assert.equal(TV.selectableFor(resolve(id),{allowYoga:true,equipment:['zed'],coachPresent:false}).ok,true);
 assert.equal(TV.selectableFor(resolve(id),{allowYoga:true,equipment:['telo'],coachPresent:false}).ok,false);
 for(const override of[{precautions:null},{precautions:undefined},{goalRole:'personal'},{sessionRole:null}])assert.equal(TV.positionHoldPolicyFor({...r,...override},meta[id],context),null);
 const rabbit=resolve('jg_sasangasana');assert.equal(rabbit.requiresCoach,true);assert.equal(TV.selectableFor(rabbit,{allowYoga:true,equipment:['telo'],explicitTarget:true,coachPresent:false}).ok,false);assert.equal(TV.selectableFor(rabbit,{allowYoga:true,equipment:['telo'],explicitTarget:true,coachPresent:true}).ok,true);
});
