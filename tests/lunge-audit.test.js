import test from 'node:test';
import assert from 'node:assert/strict';
import {loadLibrary} from '../scripts/lib/exercise-library.mjs';
import {seedExerciseExpansion} from '../src/training/catalogExpansion.js';
import {applyLungeAudit} from '../src/training/catalogLungeAudit.js';
import {LUNGE_CORRECTIONS,LUNGE_TAXONOMY,LUNGE_GUARDS,LUNGE_FOUNDATIONS} from '../src/training/catalogLungeAuditData.js';
import {exerciseTaxonomy} from '../src/training/exerciseTaxonomy.js';
import {exerciseEquipment,matchesAvailableEquipment} from '../src/training/exerciseEquipment.js';
import {buildExerciseIndex,selectExerciseLibrary} from '../src/training/exerciseLibrary.js';
import {lungeArtworkFor} from '../src/training/lungeArtwork.js';
import {existsSync} from 'node:fs';
const library=loadLibrary();
const rows=seedExerciseExpansion({tEx:library.all},undefined,{includeLungeFoundations:true}).tEx;
const actual=id=>{const r=rows.find(r=>r.id===id);assert.ok(r,id);return r;};

test('lunge migration is immutable, preserves history and does not resurrect deleted Main identities',()=>{
 const original={tEx:[],tPl:[{id:'plan',exId:'an_splitsquat'}],tLog:[{id:'log',exId:'lunge',reps:8}],notes:{mine:true}};
 const next=applyLungeAudit(original);assert.equal(next.tEx,original.tEx);
 for(const key of ['tPl','tLog','notes'])assert.equal(next[key],original[key]);
 assert.equal(applyLungeAudit(next),next);assert.equal(original.lungeContentAudit20261022,undefined);
});
test('Client explicitly adds exactly two neutral foundation identities once',()=>{
 const next=applyLungeAudit({tEx:[]},{includeLungeFoundations:true});
 assert.deepEqual(next.tEx.map(r=>r.id),['an_splitsquat','an_revlunge']);
 const deleted={...next,tEx:[]};assert.equal(applyLungeAudit(deleted,{includeLungeFoundations:true}),deleted);
 const custom={id:'an_splitsquat',cz:'Vlastní karta'};
 assert.equal(applyLungeAudit({tEx:[custom]},{includeLungeFoundations:true}).tEx[0],custom);
 for(const r of LUNGE_FOUNDATIONS){assert.equal(r.pop,3);assert.equal(r.measurementType,'BODYWEIGHT_REPS');for(const f of ['pos','exe','wat','pro','foc'])assert.equal(r[f].length,2);}
});
test('Client restores only known missing links on unchanged reviewed cards',()=>{
 for(const [id,target]of [['kb26_goblet_split','an_splitsquat'],['kb26_rack_reverse_lunge','an_revlunge']]){
  const row={id,...structuredClone(LUNGE_GUARDS[id]),ez:null};
  assert.equal(applyLungeAudit({tEx:[row]},{includeLungeFoundations:true}).tEx[0].ez,target);
  const custom={...row,exe:['Vlastní provedení',row.exe[1]]};
  assert.equal(applyLungeAudit({tEx:[custom]},{includeLungeFoundations:true}).tEx[0].ez,null);
 }
});
test('custom language, classification, equipment override and note survive the exact-field migration',()=>{
 const old=structuredClone(library.all.find(r=>r.id==='lunge'));
 old.exe[0]='Můj osobní pokyn';old.taxonomy={priority:2,movements:['other'],equipmentRequirements:[],note:'Moje poznámka',aliases:['moje']};
 const next=applyLungeAudit({tEx:[old]}).tEx[0];
 assert.equal(next.exe[0],old.exe[0]);assert.equal(next.exe[1],LUNGE_CORRECTIONS.lunge.exe.after[1]);
 for(const [k,v]of Object.entries(old.taxonomy))if(k!=='aliases')assert.deepEqual(next.taxonomy[k],v);
 assert.ok(next.taxonomy.aliases.includes('moje'));
 assert.equal(next.taxonomy.positions,undefined,'modified coaching does not receive unverified defaults');
});
test('every unchanged reviewed physical task gets a position/support; programme placeholder remains unresolved',()=>{
 for(const r of rows.filter(r=>r.id in LUNGE_TAXONOMY)){
   const tax=exerciseTaxonomy(r,library.meta[r.id]);
   if(r.id==='vi_lunge'){assert.deepEqual(tax.positions,[]);assert.deepEqual(tax.supports,[]);continue;}
   assert.ok(tax.positions.length,r.id);assert.ok(tax.supports.length,r.id);
 }
 assert.equal(matchesAvailableEquipment(exerciseEquipment(actual('vi_lunge')),['cinka','lavice','telo']),false);
});
test('available-equipment matching requires the exact pair, rack, anchor and entry support',()=>{
 for(const [id,missing,complete] of [
 ['kb26_double_reverse_lunge',['kettlebell'],['kettlebell_pair']],
 ['ex26_db_forward_lunge',['dumbbell'],['dumbbell_pair']],
 ['ex26_transverse_lunge',['dumbbell_pair'],['dumbbell_pair','prostor']],
 ['ex26_bb_lunge',['cinka','prostor'],['cinka','squat_rack','prostor']],
 ['ig27_barbell_cossack',['cinka'],['cinka','squat_rack']],
 ['ig28_band_split_hold',['guma'],['guma','fixed_anchor']],
 ['ex26_trx_lunge',['zaves'],['zaves','fixed_support']],
 ['ex26_rope_lunge',['lano','prostor'],['lano','prostor','rope_anchor']],
 ['ex26_mb_lunge_pass',['medicinbal','prostor'],['medicinbal','prostor','partner']],
 ]){const e=exerciseEquipment(actual(id));assert.equal(matchesAvailableEquipment(e,missing),false,id);assert.equal(matchesAvailableEquipment(e,complete),true,id);}
 assert.equal(matchesAvailableEquipment(exerciseEquipment(actual('ex26_mb_lunge_pass')),['medicinbal','prostor','rebound_wall']),true);
 for(const id of ['an_splitsquat','an_revlunge','atgsplit'])assert.equal(matchesAvailableEquipment(exerciseEquipment(actual(id)),[]),true,id);
});
test('combined lunges are discoverable under both meaningful movement axes',()=>{
 for(const [id,axes]of [['ex26_lunge_row',['lunge','pull_horizontal','balance']],['ex26_mb_lunge_pass',['lunge','throw']],['ex26_antirotation_lunge',['lunge','trunk_stability']],['wgs',['lunge','trunk_movement']],['jumplunge',['lunge','jump','landing']]])assert.deepEqual(exerciseTaxonomy(actual(id)).movements,axes);
 assert.ok(exerciseTaxonomy(actual('jumplunge')).focus.includes('power'));
 assert.ok(!exerciseTaxonomy(actual('jumplunge')).focus.includes('strength'));
});
test('foundation order is practical navigation and does not override custom/name sorts',()=>{
 const index=buildExerciseIndex(rows,{metaOf:r=>library.meta[r.id]});
 assert.deepEqual(selectExerciseLibrary(index,{movements:['lunge']}).rows.slice(0,7).map(r=>r.id),['an_splitsquat','an_revlunge','lunge','latlunge','kb26_goblet_split','ig27_split_squat_hold','bulgsplit']);
 const custom=selectExerciseLibrary(index,{movements:['lunge']},{sort:'custom'}).rows;
 assert.deepEqual(custom.map(r=>r.id),index.filter(e=>!e.archived&&e.tax.movements.includes('lunge')).map(e=>e.row.id));
 assert.notEqual(selectExerciseLibrary(index,{movements:['lunge']},{sort:'name'}).rows[0].id,'an_splitsquat');
});
test('all audited progression links resolve and do not impose jumping or a single-leg skill ladder',()=>{
 for(const r of rows.filter(r=>r.id in LUNGE_CORRECTIONS))for(const k of ['ez','hd'])assert.ok(!r[k]||rows.some(x=>x.id===r[k]),r.id+':'+k);
 for(const id of ['lunge','bulgsplit','cossack','archersq','jumplunge','lizard'])assert.equal(actual(id).hd,null,id);
 const old={...LUNGE_GUARDS.lunge,id:'lunge',ez:LUNGE_CORRECTIONS.lunge.ez.before};
 assert.equal(applyLungeAudit({tEx:[old]}).tEx[0].ez,null,'a deleted regression target is not restored');
});
test('legacy names still find corrected records and all identities remain unique',()=>{
 assert.equal(rows.length,new Set(rows.map(r=>r.id)).size);
 const index=buildExerciseIndex(rows);
 assert.ok(selectExerciseLibrary(index,{q:'Výpad'}).rows.some(r=>r.id==='lunge'));
 if(library.all.some(r=>r.id==='an_revlunge'))assert.ok(selectExerciseLibrary(index,{q:'Zpětný výpad'}).rows.some(r=>r.id==='an_revlunge'));
});
test('unloaded split squat artwork is exact, available, and does not replace a custom loaded variation',()=>{
 const row=actual('an_splitsquat'),art=lungeArtworkFor(row);assert.ok(art);
 assert.equal(lungeArtworkFor({...row,eq:['dumbbell_pair']}),null);
 assert.equal(lungeArtworkFor({...row,exe:['Vlastní cvik',row.exe[1]]}),null);
 assert.equal(lungeArtworkFor({...row,id:'bulgsplit'}),null);
 for(const key of ['detail','thumb','inkDetail','fillDetail','inkThumb','fillThumb'])assert.ok(existsSync(new URL('../public'+art.primary[key],import.meta.url)),key);
});
