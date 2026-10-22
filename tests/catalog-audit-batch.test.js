import test from 'node:test';
import assert from 'node:assert/strict';
import {loadLibrary} from '../scripts/lib/exercise-library.mjs';
import {seedExerciseExpansion} from '../src/training/catalogExpansion.js';
import * as bridge from '../src/training/catalogBridgeAudit.js';
import * as press from '../src/training/catalogHorizontalPressAudit.js';
import * as pull from '../src/training/catalogHorizontalPullAudit.js';
import {auditBatchArtworkFor,auditBatchEquipmentLabels} from '../src/training/catalogAuditBatch.js';
import {exerciseEquipment,matchesAvailableEquipment} from '../src/training/exerciseEquipment.js';
import {measurementTypeOf,sideModeOf,loadModeOf} from '../src/training/catalog.js';
import {buildExerciseIndex,selectExerciseLibrary} from '../src/training/exerciseLibrary.js';
const clone=x=>structuredClone(x);
const blocks=[['Bridge',bridge],['HorizontalPress',press],['HorizontalPull',pull]];
const original=(p,id)=>({id,...clone(p.originalGuards[id]),...Object.fromEntries(Object.entries(p.corrections[id]).map(([k,v])=>[k,clone(v.before)])),...Object.fromEntries(Object.entries(p.recordingGuards[id]).filter(([,v])=>v.present).map(([k,v])=>[k,clone(v.value)])),taxonomy:clone(p.originalTaxonomy?.[id]||{})});
for(const [name,mod]of blocks){
 const p=mod.proposal,apply=mod['apply'+name+'Audit'],seed=mod['seed'+name+'Foundations'];
 test(name+' audit preserves identity, references, removed rows and one-time migration',()=>{
  const input={tEx:Object.keys(p.guards).map(id=>original(p,id)),plans:[{exercise:'keep'}],logs:[{kg:17}],note:'Private'},saved=clone(input),out=apply(input);
  assert.deepEqual(input,saved);assert.deepEqual(out.tEx.map(r=>r.id),input.tEx.map(r=>r.id));assert.equal(out.plans,input.plans);assert.equal(out.logs,input.logs);assert.equal(out.note,input.note);assert.equal(apply(out),out);
  assert.deepEqual(apply({tEx:[]}).tEx,[]);assert.equal(apply(null),null);
 });
 test(name+' preserves changed measurement meaning and semantic setup',()=>{
  for(const id of Object.keys(p.guards))for(const patch of [{measurementType:original(p,id).measurementType==='DURATION'?'BODYWEIGHT_REPS':'DURATION'},{sideMode:'custom'},{load:'custom'},{mode:'custom'}]){
   const row={...original(p,id),...patch};assert.deepEqual(apply({tEx:[row]}).tEx[0],row,id);
  }
  const ids=name==='Bridge'?p.semanticChanges:Object.keys(p.guards);
  for(const id of ids)for(const patch of [{cz:'My variant'},{eq:['own equipment']},{pos:['My setup','My setup']}]){
   const row={...original(p,id),...patch};assert.deepEqual(apply({tEx:[row]}).tEx[0],row,id);
  }
 });
 test(name+' new foundations are additive, collision-safe and deletable',()=>{
  const card=p.additions[0],custom={id:card.id,cz:'My own card'},out=seed({tEx:[custom]});assert.equal(out.tEx[0],custom);assert.equal(seed(out),out);
  const fresh=seed({tEx:[]}),deleted={...fresh,tEx:[]};assert.deepEqual(seed(deleted).tEx,[]);
 });
}
const lib=loadLibrary(),collection=seedExerciseExpansion({tEx:lib.all}),rows=new Map(collection.tEx.map(r=>[r.id,r]));
test('New foundation cards have explicit repetition metrics and exact guarded transparent art',()=>{
 for(const [,mod]of blocks)for(const card of mod.proposal.additions){
  const row=rows.get(card.id);assert.equal(measurementTypeOf(row),'BODYWEIGHT_REPS');assert.equal(sideModeOf(row),'none');assert.equal(loadModeOf(row),'none');
  assert.equal(auditBatchArtworkFor(row)?.transparentBody,true);assert.equal(auditBatchArtworkFor({...row,eq:['own']}),null);
 }
});
test('Equipment filters require actual pairs, benches, attachments and specific machines',()=>{
 const available=(id,items)=>matchesAvailableEquipment(exerciseEquipment(rows.get(id)),items);
 assert.equal(available('dbrow',['dumbbell']),false);assert.equal(available('dbrow',['dumbbell','flat_bench']),true);
 assert.equal(available('tbarrow',['cinka','landmine_pivot']),false);assert.equal(available('tbarrow',['cinka','landmine_pivot','landmine_row_handle']),true);
 assert.equal(available('ex26_db_supported_row',['dumbbell','incline_bench']),false);assert.equal(available('ex26_db_supported_row',['dumbbell_pair','incline_bench']),true);
 assert.equal(available('chestsupprow',['stroj']),false);assert.equal(available('chestsupprow',['chest_supported_row_machine']),true);
 assert.equal(available('hr26_suspension_row',['kruhy']),false);assert.equal(available('hr26_suspension_row',['zaves']),true);
 assert.ok(auditBatchEquipmentLabels(rows.get('dbrow'),'en').some(s=>s.includes('bench')));
});
test('Rows, targeted shoulder tasks and trunk support retain distinct browsing meanings',()=>{
 const index=buildExerciseIndex(collection.tEx),ids=m=>selectExerciseLibrary(index,{movements:[m]}).rows.map(r=>r.id);
 assert.ok(ids('pull_horizontal').includes('flrow'));assert.ok(!ids('pull_horizontal').includes('ytw'));assert.ok(!ids('pull_horizontal').includes('ex26_kneel_reversefly'));
 assert.ok(ids('pull_horizontal').includes('ex26_sideplank_row'));assert.ok(ids('trunk_stability').includes('ex26_sideplank_row'));
 assert.ok(ids('hip_extension').includes('br26_bodyweight_hipthrust'));assert.ok(ids('push_horizontal').includes('hp26_suspension_press'));
});
