import test from 'node:test';
import assert from 'node:assert/strict';
import {seedExerciseExpansion} from '../src/training/catalogExpansion.js';
import {applyCarryAudit} from '../src/training/catalogCarryAudit.js';
import {proposal} from '../src/training/catalogCarryAuditData.js';
import {carryEquipmentLabels,carryArtworkFor} from '../src/training/catalogCarryAuditView.js';
import {exerciseEquipment,matchesAvailableEquipment} from '../src/training/exerciseEquipment.js';
import {carryAllowsEstimatedMax,historyOf,recordsFor} from '../src/training/progress.js';
import {resolveExercise} from '../src/training/catalog.js';
import {selectableFor} from '../src/training/generator.js';
import {ROPE_CLIMB_SOURCE_SIGNATURE,ROPE_CLIMB_META_SIGNATURES,ROPE_CLIMB_TAXONOMY_SIGNATURE} from '../src/training/catalogCarryPolicy.js';
const materialize=s=>Object.fromEntries(Object.entries(s).filter(([,v])=>v.present).map(([k,v])=>[k,structuredClone(v.value)]));
test('carry migration guards personal task and recording, retains notes and deletions',()=>{
 for(const id of Object.keys(proposal.guards)){
  const row={id,...structuredClone(proposal.originalGuards[id]),taxonomy:structuredClone(proposal.originalTaxonomy[id])};
  for(const[k,v]of Object.entries(proposal.recordingGuards[id]))if(v.present)row[k]=structuredClone(v.value);
  for(const change of [{exe:['Own','Own']},{foc:['Own','Own']},{measurementType:'ADDED_WEIGHT_REPS'},{taxonomy:{movements:['breath'],note:'Own'}}]){
   const custom={...row,...change};assert.deepEqual(applyCarryAudit({tEx:[custom]}).tEx,[custom],id);
  }
  const personal={...row,taxonomy:{...row.taxonomy,note:'Keep this',priority:91,aliases:['MY TERM']}};
  const saved={tEx:[personal],logs:[{id:'original'}],plans:[{id:'plan'}]},next=applyCarryAudit(saved);
  assert.equal(next.logs,saved.logs);assert.equal(next.plans,saved.plans);assert.equal(next.tEx[0].taxonomy.note,'Keep this');assert.equal(next.tEx[0].taxonomy.priority,91);
  assert.ok(next.tEx[0].taxonomy.aliases.includes('MY TERM'));assert.equal(applyCarryAudit(next),next);
 }
 assert.deepEqual(applyCarryAudit({tEx:[]}).tEx,[]);
});
test('cross carry requires two real weights; bear-hug also needs pickup support',()=>{
 const cross={id:'ex26_cross_carry',taxonomy:proposal.taxonomy.ex26_cross_carry},equip=exerciseEquipment(cross);
 for(const available of [['dumbbell'],['kettlebell'],['zavazi']])assert.equal(matchesAvailableEquipment(equip,available),false);
 for(const available of [['dumbbell_pair'],['kettlebell_pair'],['dumbbell','kettlebell']])assert.equal(matchesAvailableEquipment(equip,available),true);
 const bear=exerciseEquipment({id:'ex26_bearhug_carry',taxonomy:proposal.taxonomy.ex26_bearhug_carry});
 assert.equal(matchesAvailableEquipment(bear,['sandbag']),false);assert.equal(matchesAvailableEquipment(bear,['sandbag','lavice']),true);
 assert.equal(matchesAvailableEquipment(bear,['sandbag','box_support']),false);
 assert.deepEqual(carryEquipmentLabels({...cross,taxonomy:{equipmentRequirements:[['sandbag']]}},'en'),['Sandbag']);
});
test('hollow contour rendering applies only to the reviewed setup and retains original masks',()=>{
 for(const[id,guard]of Object.entries(proposal.guards)){
  const row={id,...guard},art=carryArtworkFor(row);
  assert.equal(art.contourOnly,true);assert.ok(art.primary.inkDetail);assert.ok(art.primary.inkThumb);
  for(const key of ['cz','en','pos','exe','eq'])assert.equal(carryArtworkFor({...row,[key]:'My setup'}),null);
  assert.equal(carryArtworkFor({...row,taxonomy:{note:'Keep note'}}),art);
 }
 assert.equal(carryArtworkFor({id:'unknown'}),null);
});
test('a held-load march has no lifting maximum, personally redefined same identity keeps its default',()=>{
 const coll=seedExerciseExpansion({tEx:[]});
 for(const id of ['ex26_hss_rack_march','kb26_suitcase_march']){
  const row=coll.tEx.find(r=>r.id===id);assert.ok(row);assert.equal(carryAllowsEstimatedMax(row),false);
  const session={id:'fixture',state:'done',date:'2026-10-23',endedAt:1,blocks:[{id:'b',exId:id,measurementType:'WEIGHT_REPS',sets:[{completed:true,type:'work',actual:{weight:16,reps:10}}]}]};
  const input=structuredClone(session),hist=historyOf([session],id),old=recordsFor('WEIGHT_REPS',hist,{});
  assert.ok(old.e1rm);const next=recordsFor('WEIGHT_REPS',hist,{allowEstimatedMax:carryAllowsEstimatedMax(row)});
  assert.ok(!next.e1rm);assert.deepEqual(next,Object.fromEntries(Object.entries(old).filter(([k])=>k!=='e1rm')));assert.deepEqual(session,input);
  for(const custom of [{...row,measurementType:'ADDED_WEIGHT_REPS'},{...row,exe:['Weighted lift','Weighted lift']},{...row,foc:['Count complete lifts','Count complete lifts']}]){
   assert.equal(carryAllowsEstimatedMax(custom),undefined);assert.ok(recordsFor('WEIGHT_REPS',hist,{allowEstimatedMax:carryAllowsEstimatedMax(custom)}).e1rm);
  }
  assert.equal(carryAllowsEstimatedMax({...row,taxonomy:{...row.taxonomy,note:'Keep note',priority:91}}),false);
  assert.equal(carryAllowsEstimatedMax({id,measurementType:'WEIGHT_REPS',execution:row.exe}),undefined);
  for(const unknown of [undefined,null,'','CUSTOM_SEED'])assert.equal(carryAllowsEstimatedMax({...row,seed:unknown}),undefined);
 }
});
test('rope selection requires explicit target and the actual station, without changing personal coaching choice',()=>{
 const row={...materialize(ROPE_CLIMB_SOURCE_SIGNATURE),taxonomy:structuredClone(ROPE_CLIMB_TAXONOMY_SIGNATURE)};
 for(const sig of ROPE_CLIMB_META_SIGNATURES){
  const meta=materialize(sig.fields),rec=resolveExercise(row,meta),equipment=['climbing_rope_station','protective_landing_mat'];
  assert.deepEqual(rec.equipment,equipment);assert.equal(rec.generatorEligible,false);assert.equal(rec.requiresCoach,true);
  for(const ctx of [{},{coachPresent:true,equipment},{explicitTarget:true,coachPresent:true,equipment:['hrazda']},{explicitTarget:true,coachPresent:true}])assert.equal(selectableFor(rec,ctx).ok,false);
  assert.equal(selectableFor(rec,{explicitTarget:true,coachPresent:true,equipment}).ok,true);
  const personal=resolveExercise({...row,requiresCoach:false},meta);assert.equal(personal.requiresCoach,false);assert.equal(selectableFor(personal,{explicitTarget:true,equipment}).ok,true);
  const changed=resolveExercise({...row,exe:['My variant','My variant']},meta);assert.equal(changed.selectionPolicy,undefined);
  assert.equal(selectableFor({...rec,status:'blocked'},{explicitTarget:true,coachPresent:true,equipment}).ok,false);
 }
});
