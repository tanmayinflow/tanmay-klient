import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {loadLibrary} from '../scripts/lib/exercise-library.mjs';
import {seedExerciseExpansion} from '../src/training/catalogExpansion.js';
import {applyStepAudit,STEP_EXERCISES} from '../src/training/catalogStepAudit.js';
import {STEP_CORRECTIONS,STEP_GUARDS} from '../src/training/catalogStepAuditData.js';
import {exerciseTaxonomy} from '../src/training/exerciseTaxonomy.js';
import {exerciseEquipment,matchesAvailableEquipment} from '../src/training/exerciseEquipment.js';
import {buildExerciseIndex,selectExerciseLibrary} from '../src/training/exerciseLibrary.js';
import {sideModeOf,measurementTypeOf} from '../src/training/catalog.js';
import {stepArtworkFor} from '../src/training/stepArtwork.js';
const lib=loadLibrary(),rows=seedExerciseExpansion({tEx:lib.all}).tEx;
const row=id=>{const value=rows.find(r=>r.id===id);assert.ok(value,id);return value;};
const old=id=>({id,...Object.fromEntries(Object.entries(STEP_CORRECTIONS[id]).map(([key,c])=>[key,structuredClone(c.before)]))});
test('step migration adds one neutral activity once and preserves deleted records, plans and history',()=>{
 const original={tEx:[],tPl:[{id:'plan',exId:'stepup'}],tLog:[{exId:'stepup',reps:8}],notes:{mine:1}};
 const next=applyStepAudit(original);assert.deepEqual(next.tEx.map(r=>r.id),['st26_stair_walk']);
 for(const key of ['tPl','tLog','notes'])assert.equal(next[key],original[key]);
 assert.equal(original.stepContentAudit20261022,undefined);assert.equal(applyStepAudit(next),next);
 const removed={...next,tEx:[]};assert.equal(applyStepAudit(removed),removed);
 const custom={id:'st26_stair_walk',cz:'Vlastní schody'};assert.equal(applyStepAudit({tEx:[custom]}).tEx[0],custom);
});
test('exact fields preserve custom languages, nulls, notes, equipment and classification',()=>{
 const input={...old('stepup'),eq:['lavice'],taxonomy:{note:'Moje poznámka',priority:2,movements:['other'],equipmentRequirements:[['chair']]}};
 input.exe[0]='Můj pokyn';input.hd='my-target';
 const next=applyStepAudit({tEx:[input]}).tEx[0];
 assert.equal(next.exe[0],input.exe[0]);assert.equal(next.exe[1],STEP_CORRECTIONS.stepup.exe.after[1]);
 assert.equal(next.hd,'my-target');for(const key of ['note','priority','movements','equipmentRequirements'])assert.deepEqual(next.taxonomy[key],input.taxonomy[key]);
 assert.equal(next.taxonomy.positions,undefined);
 const machine={...old('act_stairs'),pro:null};assert.equal(applyStepAudit({tEx:[machine]}).tEx[0].pro,null);
});
test('step support alternatives work independently; a chair alone cannot substitute',()=>{
 for(const id of ['stepup','ex26_stepdown','ex26_lateral_stepup']){
  const e=exerciseEquipment(row(id));
  for(const item of ['lavice','schody','step_platform'])assert.equal(matchesAvailableEquipment(e,[item]),true,id+item);
  for(const items of [[],['chair'],['fixed_support']])assert.equal(matchesAvailableEquipment(e,items),false,id);
 }
 const kb=exerciseEquipment(row('kb26_rack_stepup'));
 assert.equal(matchesAvailableEquipment(kb,['step_platform']),false);assert.equal(matchesAvailableEquipment(kb,['kettlebell']),false);
 assert.equal(matchesAvailableEquipment(kb,['step_platform','kettlebell']),true);
});
test('stair machine and actual stairs are distinct equipment requirements',()=>{
 const machine=exerciseEquipment(row('act_stairs')),stairs=exerciseEquipment(row('st26_stair_walk'));
 assert.ok(machine.items.includes('stroj'),'a specific machine remains discoverable among machines');
 assert.equal(matchesAvailableEquipment(machine,['stroj']),false);
 assert.equal(matchesAvailableEquipment(machine,['schody','fixed_support']),false);
 assert.equal(matchesAvailableEquipment(machine,['stair_machine']),true);
 assert.equal(matchesAvailableEquipment(stairs,['schody']),false);
 assert.equal(matchesAvailableEquipment(stairs,['schody','fixed_support']),true);
 assert.equal(matchesAvailableEquipment(stairs,['stair_machine']),false);
});
test('six step tasks are ordered without reclassifying stair jumps or overriding name/custom sorts',()=>{
 const index=buildExerciseIndex(rows,{metaOf:r=>lib.meta[r.id]});
 const expected=['stepup','ex26_stepdown','ex26_lateral_stepup','st26_stair_walk','kb26_rack_stepup','act_stairs'];
 assert.deepEqual(selectExerciseLibrary(index,{movements:['step']}).rows.map(r=>r.id),expected);
 assert.ok(exerciseTaxonomy(row('st26_stair_walk')).movements.includes('locomotion'));
 for(const id of ['ex26_py_stairs_double','ex26_py_stairs_single'])assert.ok(!exerciseTaxonomy(row(id)).movements.includes('step'));
 const custom=selectExerciseLibrary(index,{movements:['step']},{sort:'custom'}).rows;
 assert.deepEqual(custom.map(r=>r.id),index.filter(e=>!e.archived&&e.tax.movements.includes('step')).map(e=>e.row.id));
 assert.notEqual(selectExerciseLibrary(index,{movements:['step']},{sort:'name'}).rows[0].id,'stepup');
 const override=buildExerciseIndex(expected.map(id=>({...row(id),taxonomy:{...row(id).taxonomy,priority:id==='act_stairs'?0:2}})));
 assert.equal(selectExerciseLibrary(override,{movements:['step']}).rows[0].id,'act_stairs');
});
test('all reviewed tasks have explicit support/position and no forced lunge ladder',()=>{
 for(const id of [...Object.keys(STEP_GUARDS),'st26_stair_walk']){
  const tax=exerciseTaxonomy(row(id));assert.ok(tax.positions.length,id);assert.ok(tax.supports.length,id);
  assert.equal(exerciseEquipment(row(id)).unresolved.length,0,id);
 }
 assert.equal(row('stepup').hd,null);assert.equal(row('kb26_rack_stepup').ez,'stepup');
});
test('existing repetition and duration meanings remain unchanged',()=>{
 for(const id of ['stepup','ex26_stepdown','ex26_lateral_stepup','kb26_rack_stepup'])assert.equal(sideModeOf(row(id)),'perSide',id);
 for(const id of ['act_stairs','st26_stair_walk'])assert.equal(measurementTypeOf(row(id)),'DURATION',id);
 assert.equal(measurementTypeOf(row('kb26_rack_stepup')),'WEIGHT_REPS');
 assert.equal(new Set(rows.map(r=>r.id)).size,rows.length);
});
test('renamed rows are still discoverable by historical names',()=>{
 const index=buildExerciseIndex(rows);
 for(const [id,name]of [['stepup','Výstup na lavici'],['ex26_stepdown','Kontrolovaný sestup z nízké bedny'],['ex26_lateral_stepup','Výstup na bednu bokem']])assert.ok(selectExerciseLibrary(index,{q:name}).rows.some(r=>r.id===id));
});
test('new illustrations exist for both reviewed identities and do not override custom variants',()=>{
 for(const id of ['act_stairs','st26_stair_walk']){
  const r=row(id),art=stepArtworkFor(r);assert.ok(art,id);
  for(const key of ['detail','thumb','inkDetail','fillDetail','inkThumb','fillThumb'])assert.ok(existsSync(new URL('../public'+art.primary[key],import.meta.url)),id+key);
  assert.equal(stepArtworkFor({...r,eq:['other']}),null);
 }
 for(const r of STEP_EXERCISES)for(const field of ['pos','exe','wat','pro','foc'])assert.equal(r[field].length,2);
});
