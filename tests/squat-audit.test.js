import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { loadLibrary } from '../scripts/lib/exercise-library.mjs';
import { seedExerciseExpansion } from '../src/training/catalogExpansion.js';
import { applySquatAudit, SQUAT_EXERCISES } from '../src/training/catalogSquatAudit.js';
import { SQUAT_CORRECTIONS } from '../src/training/catalogSquatAuditData.js';
import { exerciseTaxonomy } from '../src/training/exerciseTaxonomy.js';
import { exerciseEquipment, matchesAvailableEquipment } from '../src/training/exerciseEquipment.js';
import { buildExerciseIndex, selectExerciseLibrary } from '../src/training/exerciseLibrary.js';
import { SQUAT_ART } from '../src/training/squatArt.js';
const library=loadLibrary();
const rows=seedExerciseExpansion({tEx:library.all}).tEx;
const actual=id=>{const row=rows.find(row=>row.id===id);assert.ok(row,id);return row;};

test('squat audit adds both useful entry cards, without duplicate identities or broken new links',()=>{
  assert.equal(rows.length,new Set(rows.map(row=>row.id)).size);
  for(const seed of SQUAT_EXERCISES){const row=actual(seed.id);assert.equal(row.measurementType,'BODYWEIGHT_REPS');assert.equal(row.sideMode,'none');assert.deepEqual(exerciseTaxonomy(row).movements,['squat']);for(const language of [0,1])for(const field of ['pos','exe','wat','pro','foc'])assert.ok(row[field][language]);}
  for(const row of rows) if(row.id in SQUAT_CORRECTIONS)for(const field of ['ez','hd'])assert.ok(!row[field]||rows.some(r=>r.id===row[field]),`${row.id}:${field}`);
});
test('migration is immutable, once-only, retains deletion and never changes plans or histories',()=>{
  const row={...library.all.find(row=>row.id==='drep')};
  const coll={tEx:[row],tPl:[{exId:'drep'}],tLog:[{exId:'drep',reps:7}],notes:{private:'unchanged'}};
  const original=JSON.stringify(coll);const next=applySquatAudit(coll);
  assert.equal(JSON.stringify(coll),original);for(const key of ['tPl','tLog','notes'])assert.equal(next[key],coll[key]);
  assert.equal(applySquatAudit(next),next);
  const deleted={...next,tEx:next.tEx.filter(row=>row.id!=='sq26_supported')};assert.equal(applySquatAudit(deleted),deleted);
  const noOld=applySquatAudit({tEx:[]});assert.ok(!noOld.tEx.some(row=>row.id==='drep'));
});
test('a custom Czech cue survives while its untouched English counterpart is corrected',()=>{
  const original=structuredClone(library.all.find(row=>row.id==='drep'));original.exe[0]='Můj vlastní český pokyn';
  const next=applySquatAudit({tEx:[original]}).tEx.find(row=>row.id==='drep');
  assert.equal(next.exe[0],original.exe[0]);assert.equal(next.exe[1],SQUAT_CORRECTIONS.drep.exe.after[1]);
  assert.equal(next.taxonomy,undefined,'custom descriptions must not receive unverified classification defaults');
});
test('personal classification, empty equipment override, audit note and names are preserved',()=>{
  const row=structuredClone(library.all.find(row=>row.id==='goblet'));row.taxonomy={priority:2,regions:['trunk'],note:'Moje poznámka',aliases:['Můj goblet'],equipmentRequirements:[]};
  const next=applySquatAudit({tEx:[row]}).tEx.find(row=>row.id==='goblet');
  for(const [key,value] of Object.entries(row.taxonomy))assert.deepEqual(next.taxonomy[key],value,key);
  const renamed={...row,cz:'Můj vlastní název'};assert.equal(applySquatAudit({tEx:[renamed]}).tEx.find(r=>r.id==='goblet').cz,renamed.cz);
});
test('known squat descriptions have reviewed positions/supports; programme template stays explicitly unresolved',()=>{
  for(const row of rows.filter(r=>r.id in SQUAT_CORRECTIONS||r.id==='ex26_ball_wallsquat')){
    if(row.id==='vi_squat')continue;
    const tax=exerciseTaxonomy(row,library.meta?.[row.id]);assert.ok(tax.positions.length,row.id);assert.ok(tax.supports.length,row.id);
  }
  assert.ok(exerciseTaxonomy(actual('wallsit')).movements.includes('position'));
  assert.ok(exerciseTaxonomy(actual('legpress')).supports.includes('machine'));
  assert.equal(matchesAvailableEquipment(exerciseEquipment(actual('vi_squat')),['cinka','stroj','kettlebell']),false);
});
test('available equipment checks the whole setup and pairs imply singles only in one direction',()=>{
  const checks=[['ig27_barbell_hack',['cinka'],['cinka','heel_wedge']],['bbsquat',['cinka'],['cinka','squat_rack']],['ig26_spanish_squat',['guma'],['guma','fixed_anchor']],['ex26_kb_double_squat',['kettlebell'],['kettlebell_pair']],['ex26_db_thruster',['dumbbell'],['dumbbell_pair']],['sq26_supported',[],['fixed_support']]];
  for(const [id,missing,complete] of checks){const p=exerciseEquipment(actual(id));assert.equal(matchesAvailableEquipment(p,missing),false,id);assert.equal(matchesAvailableEquipment(p,complete),true,id);}
  assert.equal(matchesAvailableEquipment(exerciseEquipment(actual('goblet')),['kettlebell_pair']),true);
  assert.ok(exerciseEquipment(actual('ex26_kb_double_squat')).items.includes('kettlebell'));
  assert.equal(matchesAvailableEquipment(exerciseEquipment(actual('sumo')),[]),true);
});
test('squat foundations have deliberate navigation order while explicit name sorting still works',()=>{
  const index=buildExerciseIndex(rows,{metaOf:row=>library.meta?.[row.id]});
  const first=selectExerciseLibrary(index,{movements:['squat']}).rows.slice(0,6).map(r=>r.id);
  assert.deepEqual(first,['sq26_sit_to_stand','sq26_supported','drep','goblet','kb26_goblet_box','legpress']);
  const named=selectExerciseLibrary(index,{movements:['squat']},{sort:'name'}).rows;
  assert.notEqual(named[0].id,'sq26_sit_to_stand');
  const custom=selectExerciseLibrary(index,{movements:['squat']},{sort:'custom'}).rows;
  assert.deepEqual(custom.map(r=>r.id),index.filter(e=>!e.archived&&e.tax.movements.includes('squat')).map(e=>e.row.id));
});
test('renamed legacy cards remain searchable through their old names',()=>{
  const row=actual('wallsit');assert.ok(row.taxonomy.aliases.includes('Dřep u zdi'));
  assert.ok(selectExerciseLibrary(buildExerciseIndex(rows),{q:'Dřep u zdi'}).rows.some(r=>r.id==='wallsit'));
});
test('new illustrations have exact IDs and every original and mask export exists',()=>{
  for(const {id} of SQUAT_EXERCISES){const art=SQUAT_ART[id];assert.equal(art.appId,id);assert.equal(art.unified,true);for(const key of ['thumb','detail','inkThumb','inkDetail','fillThumb','fillDetail'])assert.ok(existsSync(new URL('../public'+art.primary[key],import.meta.url)),id+':'+key);}
});

 test('a chair supports sit-to-stand but never proves a weight bench available',()=>{
 const profile=exerciseEquipment(actual('sq26_sit_to_stand'));
 assert.ok(matchesAvailableEquipment(profile,['chair']));assert.ok(matchesAvailableEquipment(profile,['lavice']));
 assert.equal(matchesAvailableEquipment({requirements:[['lavice']]},['chair']),false);
 });
