import test from 'node:test';
import assert from 'node:assert/strict';
import {loadLibrary} from '../scripts/lib/exercise-library.mjs';
import {seedExerciseExpansion,EXPANSION_META} from '../src/training/catalogExpansion.js';
import {applyHingeAudit,hingeEquipmentLabels} from '../src/training/catalogHingeAudit.js';
import {HINGE_CORRECTIONS,HINGE_GUARDS,HINGE_FOUNDATIONS} from '../src/training/catalogHingeAuditData.js';
import {exerciseEquipment,matchesAvailableEquipment,EXERCISE_EQUIPMENT} from '../src/training/exerciseEquipment.js';
import {exerciseTaxonomy} from '../src/training/exerciseTaxonomy.js';
import {buildExerciseIndex,selectExerciseLibrary} from '../src/training/exerciseLibrary.js';
const clone=x=>structuredClone(x);
const before=id=>({...clone(HINGE_GUARDS[id]),id,...Object.fromEntries(Object.entries(HINGE_CORRECTIONS[id]).map(([k,v])=>[k,clone(v.before)]))});
const fixture=()=>({tEx:Object.keys(HINGE_GUARDS).map(before),plans:[{id:'plan',exercise:'dbrdl'}],logs:[{id:'log',exercise:'deadlift',kg:40}],custom:'keep'});
const lib=loadLibrary(),seed=seedExerciseExpansion({tEx:lib.all}),byId=new Map(seed.tEx.map(r=>[r.id,r]));
const available=(id,eq)=>matchesAvailableEquipment(exerciseEquipment(byId.get(id)),eq);

test('hinge corrections are one-time, non-mutating and preserve identities, plans, logs and removed cards',()=>{
 const source=fixture(),saved=clone(source),out=applyHingeAudit(source);
 assert.deepEqual(source,saved);assert.equal(out.plans,source.plans);assert.equal(out.logs,source.logs);
 assert.deepEqual(out.tEx.map(r=>r.id),source.tEx.map(r=>r.id));assert.equal(applyHingeAudit(out),out);
 assert.deepEqual(applyHingeAudit({tEx:[]}).tEx,[]);assert.equal(applyHingeAudit(null),null);
 assert.equal(applyHingeAudit({custom:true}).tEx,undefined);
});
test('custom bilingual cues and explicit taxonomy survive while untouched translation is corrected',()=>{
 const row=before('dbrdl');row.wat[0]='Osobní pokyn';row.taxonomy={priority:2,equipmentRequirements:[['guma']],note:'Moje poznámka'};
 const out=applyHingeAudit({tEx:[row]}).tEx[0];
 assert.equal(out.wat[0],'Osobní pokyn');assert.equal(out.wat[1],HINGE_CORRECTIONS.dbrdl.wat.after[1]);
 assert.equal(out.taxonomy.priority,2);assert.deepEqual(out.taxonomy.equipmentRequirements,[['guma']]);assert.equal(out.taxonomy.note,'Moje poznámka');
});
test('custom setup blocks inferred taxonomy and missing targets are never invented',()=>{
 const row=before('trapbardl');row.pos[0]='Jiný vlastní cvik';
 const out=applyHingeAudit({tEx:[row]}).tEx[0];assert.equal(out.taxonomy,undefined);assert.equal(out.ez,null);
});
test('real integrated catalogue has practical foundations, preserved search names and corrected category boundaries',()=>{
 const meta={...lib.meta,...EXPANSION_META},index=buildExerciseIndex(seed.tEx,{metaOf:r=>meta[r.id]});
 const selected=selectExerciseLibrary(index,{movements:['hinge']}).rows;
 assert.deepEqual(selected.slice(0,HINGE_FOUNDATIONS.length).map(r=>r.id),HINGE_FOUNDATIONS);
 for(const id of ['eccham','ex26_kb_eight','pikefold'])assert.ok(!selected.some(r=>r.id===id),id);
 assert.deepEqual(exerciseTaxonomy(byId.get('eccham')).movements,['joint']);
 assert.deepEqual(exerciseTaxonomy(byId.get('pikefold')).movements,['position']);
 assert.ok(selectExerciseLibrary(index,{q:'Nácvik hipu s tyčí'}).rows.some(r=>r.id==='hinge'));
 assert.ok(selectExerciseLibrary(index,{movements:['balance']}).rows.some(r=>r.id==='slrdl'));
 if(byId.has('an_hyperext'))assert.ok(selected.some(r=>r.id==='an_hyperext'));
});
test('available equipment distinguishes one implement, pairs, exact machines and teaching dowel',()=>{
 assert.equal(available('hinge',[]),false);assert.equal(available('hinge',['tyc']),true);assert.equal(available('goodmorning',[]),true);
 assert.equal(available('dbrdl',['dumbbell']),false);assert.equal(available('dbrdl',['dumbbell_pair']),true);
 assert.equal(available('kb26_double_deadlift',['kettlebell']),false);assert.equal(available('kb26_double_deadlift',['kettlebell_pair']),true);
 assert.equal(available('ex26_smith_rdl',['stroj']),false);assert.equal(available('ex26_smith_rdl',['smith_machine']),true);
 assert.equal(available('vi_hinge',['cinka','dumbbell_pair']),false);
});
test('attachments and supports are required together, alternatives remain alternatives',()=>{
 assert.equal(available('pullthrough',['kladka']),false);assert.equal(available('pullthrough',['kladka','lano']),false);
 assert.equal(available('pullthrough',['kladka','cable_rope']),true);
 assert.equal(available('eccham',['towel']),false);assert.equal(available('eccham',['sliders','sliding_surface']),true);assert.equal(available('eccham',['towel','sliding_surface']),true);
 assert.equal(available('ex26_rack_pull',['cinka']),false);assert.equal(available('ex26_rack_pull',['cinka','squat_rack']),true);
 assert.equal(available('ex26_suitcase_deadlift',['dumbbell']),true);assert.equal(available('ex26_suitcase_deadlift',['kettlebell']),true);
 if(byId.has('an_boxdeadlift')){assert.equal(available('an_boxdeadlift',['cinka','lavice']),false);assert.equal(available('an_boxdeadlift',['cinka','lifting_blocks']),true);}
});
test('detail badges use the same localized equipment requirements as filters',()=>{
 assert.deepEqual(hingeEquipmentLabels(byId.get('dbrdl'),'cs'),['Pár jednoruček']);
 assert.deepEqual(hingeEquipmentLabels(byId.get('hinge'),'en'),['Pole or stick']);
 assert.deepEqual(hingeEquipmentLabels(byId.get('ex26_suitcase_deadlift'),'en'),['Kettlebell or Dumbbells']);
 assert.equal(hingeEquipmentLabels({id:'unrelated'}),null);
});
test('reviewed requirements are recognized and links resolve without changing recording semantics',()=>{
 const known=new Set(EXERCISE_EQUIPMENT.map(e=>e.id)),source=fixture();
 for(const row of source.tEx)Object.assign(row,{mode:'reps',measurementType:'WEIGHT_REPS',load:'ext',sideMode:'perSide',family:'historical',eq:['historical']});
 const out=applyHingeAudit(source);
 for(let i=0;i<source.tEx.length;i++)for(const k of ['mode','measurementType','load','sideMode','family','eq'])assert.deepEqual(out.tEx[i][k],source.tEx[i][k]);
 for(const row of seed.tEx.filter(r=>r.id in HINGE_GUARDS)){
  for(const id of exerciseEquipment(row).requirements.flat())assert.ok(known.has(id),row.id+': '+id);
  for(const field of ['ez','hd'])if(row[field])assert.ok(byId.has(row[field]),row.id+'.'+field);
 }
});
