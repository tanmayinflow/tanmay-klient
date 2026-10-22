import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {STEP_VARIANTS,seedStepVariants,stepEquipmentLabels} from '../src/training/catalogStepVariants.js';
import {exerciseEquipment,matchesAvailableEquipment} from '../src/training/exerciseEquipment.js';
import {sideModeOf,measurementTypeOf} from '../src/training/catalog.js';
import {stepArtworkFor} from '../src/training/stepArtwork.js';

test('loaded step variants seed once without replacing custom cards or restoring later deletions',()=>{
 const custom={id:'st26_db_pair',cz:'Moje varianta',taxonomy:{note:'Moje poznámka'}},plans=[],logs=[];
 const input={tEx:[custom],tPl:plans,tLog:logs,stepContentAudit20261022:true};
 const next=seedStepVariants(input);
 assert.equal(next.tEx.length,3);assert.equal(next.tEx[0],custom);
 assert.equal(next.tPl,plans);assert.equal(next.tLog,logs);assert.equal(input.tEx.length,1);
 assert.ok(next.tEx.slice(1).every(row=>row.ez===null),'deleted baseline is not a broken progression link');
 assert.ok(seedStepVariants({tEx:[{id:'stepup'}]}).tEx.slice(1).every(row=>row.ez==='stepup'));
 assert.equal(seedStepVariants(next),next);
 const deleted={...next,tEx:[]};assert.equal(seedStepVariants(deleted),deleted);
 next.tEx[1].pos[0]='Vlastní pokyn';assert.notEqual(STEP_VARIANTS[0].pos[0],'Vlastní pokyn');
});

test('loaded step equipment distinguishes one dumbbell, pair, support and safe barbell setup',()=>{
 const [supported,pair,barbell]=STEP_VARIANTS.map(exerciseEquipment);
 assert.equal(matchesAvailableEquipment(pair,['step_platform','dumbbell']),false);
 assert.equal(matchesAvailableEquipment(pair,['step_platform','dumbbell_pair']),true);
 assert.equal(matchesAvailableEquipment(supported,['step_platform','dumbbell']),false);
 assert.equal(matchesAvailableEquipment(supported,['step_platform','dumbbell','fixed_support']),true);
 assert.equal(matchesAvailableEquipment(barbell,['step_platform','cinka']),false);
 assert.equal(matchesAvailableEquipment(barbell,['step_platform','cinka','squat_rack']),true);
 assert.equal(matchesAvailableEquipment(pair,['chair','dumbbell_pair']),false);
 for(const e of [supported,pair,barbell])assert.deepEqual(e.unresolved,[]);
});

test('loaded step variants retain weight-and-repetitions per-side semantics and bilingual instructions',()=>{
 for(const row of STEP_VARIANTS){
  assert.equal(measurementTypeOf(row),'WEIGHT_REPS');assert.equal(sideModeOf(row),'perSide');
  for(const key of ['pos','exe','wat','pro','foc'])assert.ok(row[key].length===2&&row[key].every(x=>x.length>20));
 }
 assert.ok(STEP_VARIANTS[1].foc.every(x=>x.includes('12 kg')));
 assert.ok(STEP_VARIANTS[0].pos[0].includes('na opačné straně'));
});

test('step detail equipment labels expose every requirement and localize alternatives',()=>{
 assert.equal(stepEquipmentLabels({id:'unrelated'}),null);
 for(const row of STEP_VARIANTS){
  const cz=stepEquipmentLabels(row),en=stepEquipmentLabels(row,'en');
  assert.equal(cz.length,row.taxonomy.equipmentRequirements.length);
  assert.ok(cz[0].includes(' nebo '));assert.ok(en[0].includes(' or '));
  assert.notDeepEqual(cz,en);
 }
});

test('all new loaded step illustrations exist and custom identity does not inherit a misleading illustration',()=>{
 for(const row of STEP_VARIANTS){
  const art=stepArtworkFor(row);assert.ok(art?.transparentBody,row.id);
  for(const key of ['detail','thumb'])assert.ok(existsSync(new URL('../public'+art.primary[key],import.meta.url)));
  assert.equal(stepArtworkFor({...row,pos:['Vlastní provedení',row.pos[1]]}),null);
  assert.equal(stepArtworkFor({...row,eq:['kettlebell']}),null);
 }
});
