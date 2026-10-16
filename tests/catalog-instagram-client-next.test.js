import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,statSync} from 'node:fs';
import {INSTAGRAM_CLIENT_NEXT_EXERCISES as rows,INSTAGRAM_CLIENT_NEXT_META as meta,seedInstagramClientNext} from '../src/training/catalogInstagramClientNext.js';
import {INSTAGRAM_CLIENT_NEXT_ART as art} from '../src/training/instagramClientNextArt.js';
import {seedExerciseExpansion} from '../src/training/catalogExpansion.js';
import {extensionFor} from '../src/training/catalogV2.js';
import {resolveExercise} from '../src/training/catalog.js';

const expectedIds=[
 'ig28_crab_reach','ig28_bear_knee_extension','ig28_sissy_hold','ig28_band_split_hold',
 'ig28_reverse_plank_slide','ig28_bulgarian_ring_row','ig28_dumbbell_side_bend',
 'ig28_neck_side_lift','ig28_neck_supine_lift','ig28_neck_prone_lift',
];
const previousMigrations={exerciseExpansion20261011:true,exerciseAudit20261013:true,kettlebellExpansion20261015:true,instagramExpansion20261015:true,practicalExerciseAudit20261015:true,instagramContinuation20261015:true};

test('the client-practical release contains exactly the ten reviewed tasks, without grip-only or trick additions',()=>{
 assert.equal(rows.length,10);
 assert.deepEqual(new Set(rows.map(row=>row.id)),new Set(expectedIds));
 assert.deepEqual(new Set(Object.keys(meta)),new Set(expectedIds));
 assert.deepEqual(new Set(Object.keys(art)),new Set(expectedIds));
});

test('an existing migrated profile receives only ig28 once and retains edits, older deletions, plans and history',()=>{
 const edited={...rows[0],cz:'Moje pojmenování',ez:'my_custom',source:{url:'https://example.com/my-note'}};
 const custom={id:'my_custom',cz:'Vlastní karta',hd:'my_missing_link'};
 const original={...previousMigrations,tEx:[edited,custom],tPl:[{id:'plan',exercises:[edited.id]}],tWo:[{id:'workout'}],tLog:[{exId:edited.id,reps:6}],otherPreference:'keep'};
 const snapshot=structuredClone(original),result=seedExerciseExpansion(original);
 assert.equal(result.tEx.length,11);
 assert.equal(result.tEx[0],edited);
 assert.equal(result.tEx[1],custom);
 assert.ok(result.tEx.every(row=>row.id.startsWith('ig28_')||row.id===custom.id),'Previously removed ig26, ig27, KB and ex26 rows stay removed');
 for(const key of ['tPl','tWo','tLog'])assert.equal(result[key],original[key]);
 assert.equal(result.otherPreference,'keep');
 assert.deepEqual(original,snapshot);
 assert.equal(result.instagramClientNext20261016,true);
 assert.equal(seedExerciseExpansion(result),result);
 const reloaded=JSON.parse(JSON.stringify({...result,tEx:result.tEx.filter(row=>row.id!==edited.id)}));
 assert.equal(seedExerciseExpansion(reloaded),reloaded,'A saved deletion remains deleted after a reload');
 assert.ok(!reloaded.tEx.some(row=>row.id===edited.id));
});

test('the new seeder filters foreign releases, deduplicates input and repairs only new progression links',()=>{
 const personal={id:'my_card',ez:'personal_unavailable'};
 const existing={id:'ig28_kept',cz:'Personal name',ez:'personal_missing'};
 const original={tEx:[personal,existing]};
 const result=seedInstagramClientNext(original,[
  {id:'ig28_first',ez:'deleted_baseline',hd:'ig28_second'},
  {id:'ig28_second',ez:'ig28_first',hd:'my_card'},
  {id:'ig28_second',cz:'Duplicate input'},
  {id:'ig28_kept',cz:'Must not overwrite'},
  {id:'ig27_old_deleted'},
  {id:'ig29_future_release'},
 ]);
 assert.deepEqual(result.tEx.map(row=>row.id),['my_card','ig28_kept','ig28_first','ig28_second']);
 assert.equal(result.tEx[0],personal);assert.equal(result.tEx[1],existing);
 assert.equal(result.tEx[2].ez,null);assert.equal(result.tEx[2].hd,'ig28_second');
 assert.equal(result.tEx[3].ez,'ig28_first');assert.equal(result.tEx[3].hd,'my_card');
 assert.equal(original.instagramClientNext20261016,undefined);
 assert.equal(seedInstagramClientNext(result),result);
 assert.equal(seedInstagramClientNext(null),null);
 assert.equal(seedInstagramClientNext(undefined),undefined);
});

test('an empty filtered release records its marker without replacing existing arrays or later refilling them',()=>{
 const original={tEx:[{id:'my_card'}],tLog:[]};
 const result=seedInstagramClientNext(original,[]);
 assert.equal(result.instagramClientNext20261016,true);
 assert.equal(result.tEx,original.tEx);assert.equal(result.tLog,original.tLog);
 assert.equal(seedInstagramClientNext(result),result);
});

test('client filtering keeps all ten explicit choices and only progression targets present in the saved library',()=>{
 const seed=extensionFor(['drep','plank']),result=seedInstagramClientNext({tEx:[]},seed);
 const ids=new Set(result.tEx.map(row=>row.id));
 assert.deepEqual(ids,new Set(expectedIds));
 for(const row of result.tEx){
  for(const key of ['ez','hd'])assert.ok(!row[key]||ids.has(row[key]),row.id+':'+key);
  const resolved=resolveExercise(row,meta[row.id]);
  assert.equal(resolved.clientVisible,true,row.id);
  assert.equal(resolved.generatorEligible,false,row.id);
  assert.equal(row.genRule,'explicit',row.id);
  assert.equal(meta[row.id].g,'explicit',row.id);
 }
});

test('tracking distinguishes timed holds, side-specific tasks and the externally loaded side bend',()=>{
 const expected={
  ig28_crab_reach:['BODYWEIGHT_REPS','perSide'],
  ig28_bear_knee_extension:['BODYWEIGHT_REPS','none'],
  ig28_sissy_hold:['DURATION','none'],
  ig28_band_split_hold:['DURATION','perSide'],
  ig28_reverse_plank_slide:['BODYWEIGHT_REPS','none'],
  ig28_bulgarian_ring_row:['BODYWEIGHT_REPS','none'],
  ig28_dumbbell_side_bend:['WEIGHT_REPS','perSide'],
  ig28_neck_side_lift:['BODYWEIGHT_REPS','perSide'],
  ig28_neck_supine_lift:['BODYWEIGHT_REPS','none'],
  ig28_neck_prone_lift:['BODYWEIGHT_REPS','none'],
 };
 for(const row of rows){
  const resolved=resolveExercise(row,meta[row.id]);
  assert.equal(resolved.measurementType,expected[row.id][0],row.id);
  assert.equal(resolved.sideMode,expected[row.id][1],row.id);
  if(row.id.startsWith('ig28_neck_')){assert.equal(row.pat,'krk');assert.equal(row.load,'none');}
 }
 assert.equal(rows.find(row=>row.id==='ig28_dumbbell_side_bend').load,'ext');
});

test('each card retains bilingual coaching and scoped public source evidence without local review paths',()=>{
 for(const row of rows){
  for(const field of ['pos','exe','wat','pro','foc']){
   assert.equal(row[field].length,2,row.id+':'+field);
   assert.ok(row[field].every(value=>typeof value==='string'&&value.length>10),row.id+':'+field);
  }
  assert.match(row.source.url,/^https:\/\//);
  assert.ok(row.source.scope.length>20,row.id);
  assert.ok(row.source.instagramUrls.length>0,row.id);
  assert.ok(row.source.instagramUrls.every(url=>/^https:\/\/www.instagram.com\/[^/]+\/(?:reel|p)\/[^/]+\/$/.test(url)),row.id);
  assert.doesNotMatch(JSON.stringify(row.source),/C:[/\\]|Reviews[/\\]|frames[/\\]|times-native/i,row.id);
 }
});

test('every reviewed task has a distinct master and all six nonempty local illustration derivatives',()=>{
 const hashes=new Set();
 for(const [id,item]of Object.entries(art)){
  assert.equal(item.appId,id);
  assert.match(item.sourceSha256,/^[a-f0-9]{64}$/);hashes.add(item.sourceSha256);
  for(const key of ['thumb','detail','inkThumb','inkDetail','fillThumb','fillDetail']){
   const path=new URL('../public'+item.primary[key],import.meta.url);
   assert.ok(existsSync(path),id+':'+key);
   assert.ok(statSync(path).size>100,id+':'+key+' empty image');
  }
 }
 assert.equal(hashes.size,expectedIds.length);
});
