import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {INSTAGRAM_CONTINUATION_EXERCISES as rows,INSTAGRAM_CONTINUATION_META as meta,seedInstagramContinuation} from '../src/training/catalogInstagramContinuation.js';
import {INSTAGRAM_CONTINUATION_ART as art} from '../src/training/instagramContinuationArt.js';
import {seedExerciseExpansion} from '../src/training/catalogExpansion.js';
import {extensionFor} from '../src/training/catalogV2.js';
import {resolveExercise} from '../src/training/catalog.js';

test('continuation adds only the next batch to a previously migrated profile and preserves edits, logs and deletions',()=>{
 const edited={...rows[0],cz:'Můj upravený název',ez:'my_card'};
 const original={loadedSteps20261022:true, stepContentAudit20261022:true,squatContentAudit20261022:true,exerciseExpansion20261011:true,exerciseAudit20261013:true,kettlebellExpansion20261015:true,instagramExpansion20261015:true,practicalExerciseAudit20261015:true,instagramClientNext20261016:true,instagramDeepReview20261016:true,tEx:[edited,{id:'my_card'}],tPl:[{id:'plan'}],tWo:[{id:'workout'}],tLog:[{exId:edited.id,reps:3}]};
 const before=structuredClone(original),result=seedExerciseExpansion(original);
 assert.equal(result.tEx.length,rows.length+1);
 assert.equal(result.tEx[0],edited);
 assert.ok(result.tEx.every(x=>x.id.startsWith('ig27_')||x.id==='my_card'),'Previous intentionally removed exercise batches stay removed');
 for(const key of ['tPl','tWo','tLog'])assert.equal(result[key],original[key]);
 assert.deepEqual(original,before);
 assert.equal(result.instagramContinuation20261015,true);
 assert.equal(seedExerciseExpansion(result),result);
 const deleted={...result,tEx:result.tEx.filter(x=>x.id!==edited.id)};
 assert.equal(seedExerciseExpansion(deleted),deleted);
});

test('continuation resolves only available targets on new rows and does not rewrite personal links',()=>{
 const personal={id:'mine',ez:'personal_unavailable'};
 const result=seedInstagramContinuation({tEx:[personal]},[
  {id:'ig27_first',ez:'removed_old_card',hd:'ig27_second'},
  {id:'ig27_second',ez:'ig27_first',hd:null},
  {id:'ig27_second',cz:'Duplicate'},
  {id:'ig26_old_deleted'},
 ]);
 assert.equal(result.tEx.length,3);
 assert.equal(result.tEx[0],personal);
 assert.equal(result.tEx[1].ez,null);
 assert.equal(result.tEx[1].hd,'ig27_second');
 assert.equal(result.tEx[2].ez,'ig27_first');
 assert.equal(seedInstagramContinuation(null),null);
 assert.equal(seedInstagramContinuation(undefined),undefined);
});

test('client continuation is available for explicit selection with local links and correct measurement',()=>{
 const seed=extensionFor(['drep','plank']),result=seedInstagramContinuation({tEx:[]},seed);
 const ids=new Set(result.tEx.map(x=>x.id));
 assert.equal(result.tEx.length,rows.length);
 for(const row of result.tEx){
  assert.ok(row.id.startsWith('ig27_'));
  for(const key of ['ez','hd'])assert.ok(!row[key]||ids.has(row[key]),row.id+':'+key);
  const resolved=resolveExercise(row,meta);
  assert.equal(resolved.clientVisible,true);
  assert.equal(resolved.generatorEligible,false);
 }
 const measurement={ig27_split_squat_hold:'DURATION',ig27_barbell_cossack:'WEIGHT_REPS',ig27_seated_band_hip_ir:'REPS_ONLY',ig27_crab_toe_touch:'BODYWEIGHT_REPS'};
 for(const [id,type]of Object.entries(measurement))assert.equal(resolveExercise(rows.find(x=>x.id===id),meta).measurementType,type,id);
});

test('each continuation card retains bilingual teaching and publicly attributable demonstration evidence',()=>{
 assert.equal(new Set(rows.map(x=>x.id)).size,rows.length);
 for(const row of rows){
  for(const field of ['pos','exe','wat','pro','foc']){
   assert.equal(row[field].length,2,row.id+':'+field);
   assert.ok(row[field].every(x=>typeof x==='string'&&x.length>10),row.id+':'+field);
  }
  assert.match(row.source.url,/^https:\/\//);
  assert.ok(row.source.instagramUrls.length>0,row.id);
  assert.ok(row.source.instagramUrls.every(x=>/^https:\/\/www.instagram.com\/[^/]+\/(?:reel|p)\/[^/]+\/$/.test(x)),row.id);
  assert.ok(row.source.scope.length>20,row.id);
  assert.equal(row.genRule,'explicit');
 }
});

test('every new card has a distinct original illustration and all six rendered assets',()=>{
 assert.deepEqual(new Set(Object.keys(art)),new Set(rows.map(x=>x.id)));
 const hashes=new Set();
 for(const [id,item]of Object.entries(art)){
  assert.equal(item.appId,id);
  assert.match(item.sourceSha256,/^[a-f0-9]{64}$/);
  hashes.add(item.sourceSha256);
  for(const key of ['thumb','detail','inkThumb','inkDetail','fillThumb','fillDetail'])assert.ok(existsSync(new URL('../public'+item.primary[key],import.meta.url)),id+':'+key);
 }
 assert.equal(hashes.size,rows.length);
});
