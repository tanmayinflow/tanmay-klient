import test from'node:test';import assert from'node:assert/strict';
import{LOCOMOTION_AUDIT_CONTEXT as context}from'../src/data/locomotionAuditContext.js';
import{LOCOMOTION_AUDIT_ENTRIES as entries}from'../src/training/catalogLocomotionAuditData.js';
import{applyLocomotionAudit}from'../src/training/catalogLocomotionAudit.js';
import*as TV from'../src/training/index.js';
import{EXERCISE_EQUIPMENT}from'../src/training/exerciseEquipment.js';
const opts={locomotionAuditContext:context,auditMetadata:context.metadataGuards};
function original(id,key){const p=context.profiles[id].find(p=>!key||p.key===key),r=structuredClone(entries[id].profiles[p.key]),s=p.seeds[0];if(s.present)r.seed=structuredClone(s.value);return r;}
const audited=id=>applyLocomotionAudit({tEx:[original(id)]},opts).tEx[0],policy=r=>TV.locomotionPolicyFor(r,context.metadataGuards[r.id],context);
test('locomotion edits preserve personal provenance, measured values, deletions and unknown fields',()=>{
 const r=original('ex26_a_skip'),own={...r,source:{...r.source,personal:undefined}},custom={tEx:[own],plans:[{id:'p'}],history:[{side:null,actual:{weight:7}}]};assert.deepEqual(applyLocomotionAudit(custom,opts).tEx,[own]);
 const next=applyLocomotionAudit({...custom,tEx:[{...r,notes:'mine'}]},opts);assert.equal(next.plans,custom.plans);assert.equal(next.history,custom.history);assert.equal(next.tEx[0].notes,'mine');for(const k of['mode','load','measurementType','loadMode','sideMode'])assert.deepEqual(Object.getOwnPropertyDescriptor(next.tEx[0],k),Object.getOwnPropertyDescriptor(r,k));
 assert.deepEqual(applyLocomotionAudit({tEx:[]},opts).tEx,[]);assert.equal(applyLocomotionAudit(next,opts),next);
});
test('fresh Client scap link stays local and only repairs an absent target',()=>{
 const id='ex26_mob_scap_circles',p=context.profiles[id].find(p=>p.edits?.ez===null);if(context.role==='main'){assert.equal(audited(id).ez,'gm_scap_retract_quad');return;}
 const r=original(id,p.key);assert.equal(applyLocomotionAudit({tEx:[r]},opts).tEx[0].ez,null);assert.equal(applyLocomotionAudit({tEx:[r,{id:'gm_scap_retract_quad'}]},opts).tEx[0].ez,'gm_scap_retract_quad');
 const own={...r,ez:'my-exercise'};assert.deepEqual(applyLocomotionAudit({tEx:[own]},opts).tEx[0],own);
});
test('real resolved generator requires complete get-up equipment and refuses unknown umbrella setups',()=>{
 const r=audited('ex26_half_getup'),rec=TV.resolveExercise(r,context.metadataGuards[r.id],new Set(),context),ctx={explicitTarget:true,equipment:['kettlebell','prostor']};assert.equal(TV.selectableFor(rec,ctx).ok,true);assert.equal(TV.selectableFor(rec,{...ctx,equipment:['zavazi','prostor']}).ok,false);assert.equal(TV.selectableFor(rec,{...ctx,equipment:['kettlebell']}).ok,false);assert.equal(TV.selectableFor(rec,{...ctx,explicitTarget:false}).ok,false);
 for(const id of['zone2','sled','act_climb'])assert.equal(TV.locomotionSelectionAllowed(policy(audited(id)),{explicitTarget:true,equipment:EXERCISE_EQUIPMENT.map(e=>e.id)}),false);
 assert.equal(TV.locomotionPolicyFor({...r,allowEstimatedMax:undefined},context.metadataGuards[r.id],context),null);assert.equal(TV.locomotionPolicyFor({...r,source:null},context.metadataGuards[r.id],context),null);assert.equal(TV.locomotionPolicyForBlock(r,context.metadataGuards[r.id],context,{exId:r.id,measurementType:rec.measurementType,variant:'my setup'}),null);
});
test('audited no-load edits and completion retain old unknown weight without creating new weight',()=>{
 const p=policy(audited('ex26_wall_march')),block={id:'b',exId:p.id,measurementType:p.measurementType,sets:[{id:'s',type:'work',side:'L',actual:{reps:3,addedWeight:undefined,weight:null},planned:{targetReps:7,targetWeight:9}}]},session={blocks:[block]};
 const changed=TV.locomotionSetActual(session,'b','s',{reps:5,addedWeight:99},p);assert.equal(changed.blocks[0].sets[0].actual.reps,5);assert.equal(Object.hasOwn(changed.blocks[0].sets[0].actual,'addedWeight'),true);assert.equal(changed.blocks[0].sets[0].actual.addedWeight,undefined);assert.equal(changed.blocks[0].sets[0].actual.weight,null);assert.equal(session.blocks[0].sets[0].actual.reps,3);
 const empty={blocks:[{...block,sets:[{...block.sets[0],actual:{}}]}]},done=TV.locomotionCompleteSet(empty,'b','s',123,p);assert.equal(done.blocks[0].sets[0].actual.reps,7);assert.equal(Object.hasOwn(done.blocks[0].sets[0].actual,'weight'),false);assert.equal(done.blocks[0].sets[0].planned.targetWeight,9);
 const added=TV.locomotionAddSet(session,'b',{},p);assert.equal(added.blocks[0].sets.at(-1).side,null);assert.equal(TV.locomotionSetSide(session,'b','s','R',p).blocks[0].sets[0].side,'R');assert.equal(TV.locomotionCanCopyPrevious({sets:[]},block,p),false);
});
test('records compare each stated side and keep legacy weighted attempts out of unloaded records',()=>{
 const p=policy(audited('ex26_wall_march')),hist=[{side:'L',sessionId:'l',actual:{reps:4},measurementType:p.measurementType},{side:'R',sessionId:'r',actual:{reps:8},measurementType:p.measurementType},{sessionId:'u',actual:{reps:99,addedWeight:10},measurementType:p.measurementType},{sessionId:'unknown',actual:{reps:100,addedWeight:null},measurementType:p.measurementType}];
 const o=TV.locomotionRecordOptions(p);assert.equal(TV.recordsFor(p.measurementType,hist,{...o,sideFilter:'L'}).bestReps.value,4);assert.equal(TV.recordsFor(p.measurementType,hist,{...o,sideFilter:'R'}).bestReps.value,8);assert.deepEqual(TV.recordsFor(p.measurementType,hist,{...o,sideFilter:'unspecified'}),{});assert.equal(hist[3].actual.addedWeight,null);
 const getup=policy(audited('ex26_half_getup'));assert.equal(TV.recordsFor(getup.measurementType,[{actual:{weight:12,reps:5},sessionId:'g'}],TV.locomotionRecordOptions(getup)).e1rm,undefined);
});
test('new public deliveries prove exact content without role metadata; stale and changed payloads remain unclassified',()=>{
 for(const id of['ex26_wall_march','ex26_half_getup']){const r=audited(id),rec=TV.resolveExercise(r,context.metadataGuards[id],new Set(),context),d=TV.clientBundle([{id:'p',sessions:[{templateId:'t'}]}],[{id:'t',blocks:[{id:'b',exId:id,measurementType:rec.measurementType,sets:[]}]}],()=>rec,{pro:true,now:1}).exercises[0];assert.ok(d.locomotionAudit);assert.equal(TV.locomotionDeliveredPolicy(d).id,id);assert.equal(Object.hasOwn(d.locomotionAudit,'metadata'),false);assert.equal(TV.locomotionDeliveredPolicy({...d,startPosition:['Own','Own']}),null);const old={...d};delete old.locomotionAudit;assert.equal(TV.locomotionDeliveredPolicy(old),null);}
});
test('manual progression retains pain, technique and incomplete-set precedence',()=>{
 const b={id:'b',exId:'ex26_half_getup',measurementType:'WEIGHT_REPS',sets:[{id:'s',type:'work',completed:true,actual:{reps:8,weight:8},planned:{targetReps:5,targetWeight:8},rir:4}]};assert.equal(TV.evaluateBlock(b,{manualProgression:true}).k,'practice');assert.equal(TV.evaluateBlock(b,{manualProgression:true,painNow:true}).k,'hold');assert.equal(TV.evaluateBlock({...b,sets:[...b.sets,{...b.sets[0],id:'other',completed:false}]},{manualProgression:true}).k,'hold');
});
test('client return preserves an explicit variation without inventing one for old sessions',()=>{
 for(const variant of ['custom support',['dumbbell','seated'],null,undefined]){
  const block={id:'b',exId:'ex26_half_getup',measurementType:'WEIGHT_REPS',variant,sets:[{id:'s',type:'work',completed:true,side:'R',planned:{targetReps:2},actual:{weight:8,reps:2}}]},session={id:'own',state:'done',endedAt:2,blocks:[block]},result=TV.fulfilmentFrom([session],{now:3});
  assert.equal(Object.hasOwn(result.sessions[0].blocks[0],'variant'),true);assert.deepEqual(result.sessions[0].blocks[0].variant,variant);assert.equal(result.sessions[0].blocks[0].sets[0].actual,block.sets[0].actual);assert.equal(result.sessions[0].blocks[0].sets[0].side,'R');assert.deepEqual(TV.mergeFulfilment([],result,'client')[0].blocks[0].variant,variant);
 }
 const old={id:'old',state:'done',blocks:[{id:'b',exId:'tgu',measurementType:'WEIGHT_REPS',sets:[]}]};assert.equal(Object.hasOwn(TV.fulfilmentFrom([old],{now:3}).sessions[0].blocks[0],'variant'),false);assert.equal(Object.hasOwn(old.blocks[0],'variant'),false);
});

// Append to Shared/product-core/repo-tests/locomotion-audit.test.js.
test('stamped public artwork keeps reviewed contours and refuses altered or unstamped deliveries',()=>{
 let accepted=0;
 for(const id of Object.keys(context.profiles)){
  const row=audited(id),rec=TV.resolveExercise(row,context.metadataGuards[id],new Set(),context);
  assert.equal(TV.locomotionDeliveredArtworkFor(row),null,'local data must use the existing local guard');
  if(!TV.resolvedLocomotionPolicy(rec))continue;
  for(const pro of[false,true]){
   const payload=TV.clientBundle([{id:'p',sessions:[{templateId:'t'}]}],[{id:'t',blocks:[{id:'b',exId:id,measurementType:rec.measurementType,sets:[]}]}],()=>rec,{pro,now:1}).exercises[0],before=structuredClone(payload);
   assert.ok(payload.locomotionAudit);accepted++;
   assert.equal(TV.locomotionDeliveredArtworkFor(payload),entries[id].art||null);
   if(entries[id].art)assert.equal(TV.locomotionDeliveredArtworkFor(payload).contourOnly,true);
   assert.deepEqual(payload,before,'art lookup must not rewrite delivered content');
   const unstamped={...payload};delete unstamped.locomotionAudit;
   assert.equal(TV.locomotionDeliveredArtworkFor(unstamped),null);
   for(const key of['cz','en','pat','eq','measurementType','defaultRestSec','unilateral','sideMode','focus','startPosition','execution','watchFor','progression']){
    const changed={...payload,[key]:key==='defaultRestSec'?12345:key==='unilateral'?!payload.unilateral:['Own setup']};
    assert.equal(TV.locomotionDeliveredArtworkFor(changed),null,id+' changed '+key);
    const missing={...payload};delete missing[key];assert.equal(TV.locomotionDeliveredArtworkFor(missing),null,id+' missing '+key);
   }
   assert.equal(TV.locomotionDeliveredArtworkFor({...payload,locomotionAudit:{...payload.locomotionAudit,source:{present:true,value:'custom'}}}),null);
   assert.equal(TV.locomotionDeliveredArtworkFor({...payload,locomotionAudit:{...payload.locomotionAudit,profileKey:'unknown'}}),null);
  }
 }
 assert.ok(accepted>=80,'both pro projections of the reviewed runtime profiles must be exercised');
});

// Append beside the public-artguard test in locomotion-audit.test.js.
test('previous attempts expose their own stored variation without changing values, side or selection',()=>{
 const session=(id,at,variant,present=true)=>({id,state:'done',who:'',endedAt:at,date:'2026-10-24',templateId:'tpl',blocks:[{id:id+'b',exId:'ex26_wall_march',measurementType:'BODYWEIGHT_REPS',...(present?{variant}:{}),sets:[{id:id+'s',type:'work',completed:true,side:'L',actual:{reps:88,weight:null,addedWeight:undefined}}]}]});
 for(const variant of[undefined,null,'',[],['',''],['Pomalu','Slow'],['Pouze česky'],'QA altered setup',{custom:true},false]){
  const source=session('original',1,variant),before=structuredClone(source),previous=TV.lastUseOf([source],'ex26_wall_march');
  assert.equal(Object.hasOwn(previous,'variant'),true);assert.deepEqual(previous.variant,variant);assert.deepEqual(source,before);
  assert.equal(previous.sets[0],source.blocks[0].sets[0]);assert.equal(previous.sets[0].side,'L');assert.equal(Object.hasOwn(previous.sets[0].actual,'addedWeight'),true);
 }
 const absent=session('absent',1,undefined,false);assert.equal(Object.hasOwn(TV.lastUseOf([absent],'ex26_wall_march'),'variant'),false);
 for(const value of[undefined,null,'',[],['','']])assert.equal(TV.previousVariantLabel({variant:value},true),'');
 assert.equal(TV.previousVariantLabel({variant:['Pomalu','Slow']},true),'Uložená varianta: Pomalu');
 assert.equal(TV.previousVariantLabel({variant:['Pomalu','Slow']},false),'Stored variation: Slow');
 assert.equal(TV.previousVariantLabel({variant:['Pouze česky']},false),'Stored variation: Pouze česky');
 assert.equal(TV.previousVariantLabel({variant:{custom:true}},true),'Uložená varianta');
 const old=session('older',1,'Older setup'),recent=session('latest',2,'Latest setup');
 assert.equal(TV.lastUseOf([old,recent],'ex26_wall_march').sessionId,'latest');
 assert.equal(TV.lastUseOf([old,recent],'ex26_wall_march',{exceptSessionId:'latest'}).sessionId,'older');
 assert.equal(TV.lastUseInTemplate([old,recent],'ex26_wall_march','tpl').variant,'Latest setup');
 assert.equal(TV.lastUseOf([{...recent,who:'other'}],'ex26_wall_march'),null);
});
