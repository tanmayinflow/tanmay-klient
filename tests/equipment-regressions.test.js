import test from 'node:test';
import assert from 'node:assert/strict';
import {loadLibrary} from '../scripts/lib/exercise-library.mjs';
import {seedExerciseExpansion} from '../src/training/catalogExpansion.js';
import {applySquatAudit} from '../src/training/catalogSquatAudit.js';
import {applyAuditEquipmentFixes} from '../src/training/catalogAuditEquipmentFix.js';
import {exerciseEquipment,matchesAvailableEquipment} from '../src/training/exerciseEquipment.js';
import {measurementTypeOf,sideModeOf,loadModeOf} from '../src/training/catalog.js';

// Catalogue literals can originate in a VM realm; use ordinary JSON fixtures.
const clone=value=>JSON.parse(JSON.stringify(value));
const library=loadLibrary();
const collection=seedExerciseExpansion({tEx:library.all});
const rows=new Map(collection.tEx.map(row=>[row.id,row]));
const row=id=>{const value=rows.get(id);assert.ok(value,'Missing exercise fixture: '+id);return value;};
const available=(id,equipment)=>matchesAvailableEquipment(exerciseEquipment(row(id)),equipment);
const needs=(...ids)=>({requirements:ids.map(id=>[id])});
// Reconstruct the previously accepted squat card, before this new metadata fix.
const smithBefore=clone(applySquatAudit({tEx:library.all}).tEx.find(item=>item.id==='ex26_smith_squat'));

test('Low parallettes do not satisfy exercises requiring full parallel bars',()=>{
  for(const id of ['dips']){
    assert.equal(available(id,['low_parallettes']),false,id);
    assert.equal(available(id,['bradla']),true,id);
  }
  assert.equal(available('russiandip',['low_parallettes']),false);
  assert.equal(available('russiandip',['bradla']),false);
  assert.equal(available('russiandip',['long_parallel_bars']),true);
  assert.equal(available('dips',['long_parallel_bars']),true);
  assert.equal(available('planchepush',['low_parallettes']),true);
  assert.equal(available('planchepush',['bradla']),false);
});

test('Specific workout benches do not certify a suitable step or jump box',()=>{
  for(const bench of ['flat_bench','incline_bench','decline_bench_leg_support','backed_bench']){
    for(const id of ['stepup','boxjump'])assert.equal(available(id,[bench]),false,bench+' -> '+id);
  }
  assert.equal(available('stepup',['step_platform']),true);
  assert.equal(available('stepup',['schody']),true);
  assert.equal(available('boxjump',['lavice']),true);
  assert.equal(available('dbrow',['dumbbell','flat_bench']),true);
});

test('Floor-press safeties do not certify a rack suitable for standing barbell work',()=>{
  assert.equal(available('ig27_barbell_cossack',['cinka','floor_press_rack']),false);
  assert.equal(available('ig27_barbell_cossack',['cinka','squat_rack']),true);
  assert.equal(matchesAvailableEquipment(needs('floor_press_rack'),['squat_rack']),false);
});

test('A specific machine never proves that other generic machine exercises are available',()=>{
  const machines=['smith_machine','stair_machine','chest_press_machine','chest_supported_row_machine','rowing_ergometer','seated_cable_row_station'];
  const unrelated=['legpress','legcurl','legext','revpecdeck','machineshoulderpress','assistpullup','act_airbike'];
  for(const machine of machines){
    assert.equal(matchesAvailableEquipment(needs('stroj'),[machine]),false,machine+' -> generic machine');
    for(const id of unrelated)assert.equal(available(id,[machine]),false,machine+' -> '+id);
  }
  assert.equal(available('act_stairs',['stair_machine']),true);
  assert.equal(available('ex26_smith_squat',['smith_machine']),true);
  assert.equal(available('ex26_smith_squat',['stair_machine']),false);
  assert.equal(available('chestsupprow',['chest_supported_row_machine']),true);
  assert.equal(available('chestsupprow',['chest_press_machine']),false);
  assert.equal(available('machinechestpress',['chest_press_machine']),true);
  assert.equal(available('machinechestpress',['chest_supported_row_machine']),false);
});

test('A fixed seated-row station is not a general or height-adjustable cable pulley',()=>{
  for(const requirement of ['kladka','adjustable_cable','adjustable_cable_pair']){
    assert.equal(matchesAvailableEquipment(needs(requirement),['seated_cable_row_station']),false,requirement);
  }
  assert.equal(available('oacablerow',['seated_cable_row_station','cable_handle','flat_bench']),false);
});

test('A pair covers one implement while a single implement never implies a pair',()=>{
  for(const [single,pair] of [['dumbbell','dumbbell_pair'],['kettlebell','kettlebell_pair'],['cable_handle','cable_handle_pair']]){
    assert.equal(matchesAvailableEquipment(needs(single),[pair]),true,pair+' -> '+single);
    assert.equal(matchesAvailableEquipment(needs(pair),[single]),false,single+' -> '+pair);
  }
  assert.equal(available('dbrow',['dumbbell_pair','flat_bench']),true);
  assert.equal(available('ex26_db_supported_row',['dumbbell','incline_bench']),false);
  assert.equal(available('ex26_db_supported_row',['dumbbell_pair','incline_bench']),true);
  assert.equal(available('kb26_gorilla_row',['kettlebell']),false);
  assert.equal(available('kb26_gorilla_row',['kettlebell_pair']),true);
});

test('Cable pairs cover a single adjustable pulley without inferring missing pulleys or handles',()=>{
  for(const requirement of ['kladka','adjustable_cable']){
    assert.equal(matchesAvailableEquipment(needs(requirement),['adjustable_cable_pair']),true,requirement);
  }
  assert.equal(matchesAvailableEquipment(needs('kladka'),['adjustable_cable']),true);
  assert.equal(matchesAvailableEquipment(needs('adjustable_cable_pair'),['adjustable_cable']),false);
  assert.equal(matchesAvailableEquipment(needs('adjustable_cable'),['kladka']),false);
  assert.equal(available('oacablerow',['adjustable_cable_pair','cable_handle_pair','flat_bench']),true);
  assert.equal(available('oacablerow',['adjustable_cable_pair','flat_bench']),false);
});

test('Smith clarification changes only the missing equipment metadata',()=>{
  assert.equal(Object.hasOwn(smithBefore.taxonomy,'equipmentRequirements'),false);
  const original={...clone(smithBefore),note:'Personal note',taxonomy:{...clone(smithBefore.taxonomy),priority:9,aliases:['Personal alias'],note:'Personal audit note'}};
  const other={id:'another-exercise',note:'Keep this exact object'};
  const input={tEx:[original,other],plans:[{exercise:original.id}],history:[{exercise:original.id,kg:37}],note:'Collection note'};
  const snapshot=clone(input),out=applyAuditEquipmentFixes(input);
  assert.deepEqual(input,snapshot);
  assert.deepEqual(out.tEx[0],{...original,taxonomy:{...original.taxonomy,equipmentRequirements:[['smith_machine']]}});
  assert.equal(out.tEx[1],other);
  for(const key of ['plans','history','note'])assert.equal(out[key],input[key]);
  for(const key of ['id','eq','mode','measurementType','sideMode','load'])assert.deepEqual(out.tEx[0][key],original[key],key);
  assert.equal(measurementTypeOf(out.tEx[0]),measurementTypeOf(original));
  assert.equal(sideModeOf(out.tEx[0]),sideModeOf(original));
  assert.equal(loadModeOf(out.tEx[0]),loadModeOf(original));
  assert.equal(applyAuditEquipmentFixes(out),out);
});

test('Smith clarification respects changed or missing semantic and recording fields',()=>{
  const patches={cz:'My variant',en:'My variant',pat:'custom',eq:['cinka'],pos:['My setup','My setup'],exe:['My execution','My execution'],mode:'sec',measurementType:'DURATION',sideMode:'perSide',load:'none',family:'custom',variantKey:'custom'};
  for(const [key,value]of Object.entries(patches)){
    const changed={...clone(smithBefore),[key]:value};
    const input={tEx:[changed]};assert.equal(applyAuditEquipmentFixes(input),input,'Changed '+key);
    const missing=clone(smithBefore);delete missing[key];
    const missingInput={tEx:[missing]};assert.equal(applyAuditEquipmentFixes(missingInput),missingInput,'Missing '+key);
  }
});

test('Smith clarification preserves custom, explicitly empty and malformed equipment requirements',()=>{
  for(const value of [[['guma']],[['stroj']],[['smith_machine']],[],null,undefined]){
    const original={...clone(smithBefore),taxonomy:{...clone(smithBefore.taxonomy),equipmentRequirements:value}};
    const input={tEx:[original]};
    assert.equal(applyAuditEquipmentFixes(input),input,String(value));
    assert.equal(input.tEx[0].taxonomy.equipmentRequirements,value);
  }
  for(const key of ['positions','supports']){
    const original=clone(smithBefore);original.taxonomy[key]=['custom'];
    const input={tEx:[original]};assert.equal(applyAuditEquipmentFixes(input),input,'Custom '+key);
    delete original.taxonomy[key];assert.equal(applyAuditEquipmentFixes(input),input,'Missing '+key);
  }
});

test('Smith clarification cannot add deleted identities and remains a no-op without an eligible card',()=>{
  for(const input of [null,undefined,{}, {tEx:null},{tEx:[]},{tEx:[null,{...clone(smithBefore),id:'personal-copy'}]}]){
    assert.equal(applyAuditEquipmentFixes(input),input);
  }
  const deleted={...collection,tEx:collection.tEx.filter(item=>item.id!=='ex26_smith_squat')};
  assert.equal(applyAuditEquipmentFixes(deleted),deleted);
  assert.equal(seedExerciseExpansion(deleted).tEx.some(item=>item.id==='ex26_smith_squat'),false);
});

test('Smith equipment metadata is copied independently for later collection edits',()=>{
  const first=applyAuditEquipmentFixes({tEx:[clone(smithBefore)]});
  first.tEx[0].taxonomy.equipmentRequirements[0].push('guma');
  const second=applyAuditEquipmentFixes({tEx:[clone(smithBefore)]});
  assert.deepEqual(second.tEx[0].taxonomy.equipmentRequirements,[['smith_machine']]);
});
