import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,statSync} from 'node:fs';
import {INSTAGRAM_DEEP_REVIEW_EXERCISES as rows,INSTAGRAM_DEEP_REVIEW_META as meta,seedInstagramDeepReview} from '../src/training/catalogInstagramDeepReview.js';
import {INSTAGRAM_DEEP_REVIEW_ART as art} from '../src/training/instagramDeepReviewArt.js';
import {seedExerciseExpansion} from '../src/training/catalogExpansion.js';
import {extensionFor} from '../src/training/catalogV2.js';
import {resolveExercise} from '../src/training/catalog.js';

const expectedIds=[
  "ig29_upper_arm_band_scap_retraction",
  "ig29_standing_straight_leg_raise",
  "ig29_standing_leg_abduction_hold",
  "ig29_buttock_walk",
  "ig29_prone_w_to_forearm_plank",
  "ig29_cross_squat_getup"
];
const previousMigrations={verticalPullCommonFoundations20261023:true,bridgeFoundations20261022:true,horizontalPressFoundations20261022:true,horizontalPullFoundations20261022:true,loadedSteps20261022:true, stepContentAudit20261022:true,squatContentAudit20261022:true,exerciseExpansion20261011:true,exerciseAudit20261013:true,kettlebellExpansion20261015:true,instagramExpansion20261015:true,practicalExerciseAudit20261015:true,instagramContinuation20261015:true,instagramClientNext20261016:true};

test('deep-review release contains precisely the approved cards, metadata and illustrations',()=>{
 assert.equal(rows.length,expectedIds.length);
 for(const ids of [rows.map(row=>row.id),Object.keys(meta),Object.keys(art)])assert.deepEqual(new Set(ids),new Set(expectedIds));
});

test('existing profile receives ig29 once while preserving edited rows, older deletions, plans and history',()=>{
 const edited={...rows[0],cz:'Moje pojmenování',ez:'my_custom',source:{url:'https://example.com/my-note'}};
 const custom={id:'my_custom',cz:'Vlastní karta',hd:'personal_missing_link'};
 const original={...previousMigrations,tEx:[edited,custom],tPl:[{id:'plan'}],tWo:[{id:'workout'}],tLog:[{exId:edited.id,reps:6}],preference:'keep'};
 const snapshot=structuredClone(original),result=seedExerciseExpansion(original);
 assert.equal(result.tEx.length,expectedIds.length+1);
 assert.equal(result.tEx[0],edited);assert.equal(result.tEx[1],custom);
 assert.ok(result.tEx.every(row=>row.id.startsWith('ig29_')||row.id===custom.id),'Deleted ig26/ig27/ig28 and older releases remain absent');
 for(const key of ['tPl','tWo','tLog'])assert.equal(result[key],original[key]);
 assert.equal(result.preference,'keep');assert.deepEqual(original,snapshot);
 assert.equal(result.instagramDeepReview20261016,true);
 assert.equal(seedExerciseExpansion(result),result);
 const reloaded=JSON.parse(JSON.stringify({...result,tEx:result.tEx.filter(row=>row.id!==edited.id)}));
 assert.equal(seedExerciseExpansion(reloaded),reloaded);
 assert.ok(!reloaded.tEx.some(row=>row.id===edited.id),'Saved ig29 deletion remains absent after reload');
});

test('ig29 seeder rejects other releases, deduplicates input and cleans links only on newly added rows',()=>{
 const personal={id:'my_card',ez:'personal_missing'},existing={id:'ig29_kept',cz:'Personal',ez:'edited_missing'};
 const original={tEx:[personal,existing]};
 const result=seedInstagramDeepReview(original,[
  {id:'ig29_first',ez:'deleted_baseline',hd:'ig29_second'},
  {id:'ig29_second',ez:'ig29_first',hd:'my_card'},
  {id:'ig29_second',cz:'Duplicate'},
  {id:'ig29_kept',cz:'Do not overwrite'},
  {id:'ig28_deleted'},{id:'ig30_future'},
 ]);
 assert.deepEqual(result.tEx.map(row=>row.id),['my_card','ig29_kept','ig29_first','ig29_second']);
 assert.equal(result.tEx[0],personal);assert.equal(result.tEx[1],existing);
 assert.equal(result.tEx[2].ez,null);assert.equal(result.tEx[2].hd,'ig29_second');
 assert.equal(result.tEx[3].ez,'ig29_first');assert.equal(result.tEx[3].hd,'my_card');
 assert.equal(original.instagramDeepReview20261016,undefined);
 assert.equal(seedInstagramDeepReview(result),result);
 assert.equal(seedInstagramDeepReview(null),null);assert.equal(seedInstagramDeepReview(undefined),undefined);
});

test('empty filtered migration records its flag without replacing arrays or later refilling deleted choices',()=>{
 const original={tEx:[{id:'my_card'}],tLog:[]};
 const result=seedInstagramDeepReview(original,[]);
 assert.equal(result.instagramDeepReview20261016,true);
 assert.equal(result.tEx,original.tEx);assert.equal(result.tLog,original.tLog);
 assert.equal(seedInstagramDeepReview(result),result);
});

test('client extension includes the approved explicit choices and only locally available progression links',()=>{
 const seed=extensionFor(['drep','plank']),result=seedInstagramDeepReview({tEx:[]},seed);
 const ids=new Set(result.tEx.map(row=>row.id));assert.deepEqual(ids,new Set(expectedIds));
 for(const row of result.tEx){
  for(const key of ['ez','hd'])assert.ok(!row[key]||ids.has(row[key]),row.id+':'+key);
  const resolved=resolveExercise(row,meta[row.id]);
  assert.equal(resolved.clientVisible,true,row.id);assert.equal(resolved.generatorEligible,false,row.id);
  assert.equal(row.genRule,'explicit');assert.equal(meta[row.id].g,'explicit');
 }
});

test('public cards retain bilingual guidance and scoped sources without private review material',()=>{
 for(const row of rows){
  for(const key of ['pos','exe','wat','pro','foc']){assert.equal(row[key].length,2);assert.ok(row[key].every(value=>typeof value==='string'&&value.length>10));}
  assert.match(row.source.url,/^https:\/\//);assert.ok(row.source.scope.length>20);
  assert.ok(row.source.instagramUrls.length>0);
  assert.ok(row.source.instagramUrls.every(url=>/^https:\/\/www.instagram.com\/(?:[^/?#]+\/)?(?:reel|p)\/[A-Za-z0-9_-]+\/$/.test(url)));
  assert.doesNotMatch(JSON.stringify(row),/C:[/\\]|Reviews[/\\]|frames[/\\]|times-native|file:\/\/|127\.0\.0\.1|\/saved\/|\/collections\//i);
  assert.equal(row.artPose,undefined);assert.equal(row.sourcePost,undefined);
 }
});

test('each approved card has a distinct master and all six nonempty illustration derivatives',()=>{
 const hashes=new Set();
 for(const [id,item]of Object.entries(art)){
  assert.equal(item.appId,id);assert.match(item.sourceSha256,/^[a-f0-9]{64}$/);hashes.add(item.sourceSha256);
  for(const key of ['thumb','detail','inkThumb','inkDetail','fillThumb','fillDetail']){
   const file=new URL('../public'+item.primary[key],import.meta.url);
   assert.ok(existsSync(file),id+':'+key);assert.ok(statSync(file).size>100,id+':'+key);
  }
 }
 assert.equal(hashes.size,expectedIds.length);
});
