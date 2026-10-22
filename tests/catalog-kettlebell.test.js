import test from 'node:test';
import assert from 'node:assert/strict';
import {KETTLEBELL_EXERCISES, KETTLEBELL_META, seedKettlebellExpansion} from '../src/training/catalogKettlebell.js';
import {seedExerciseExpansion} from '../src/training/catalogExpansion.js';
import {extensionFor} from '../src/training/catalogV2.js';
import {resolveExercise} from '../src/training/catalog.js';
import {KETTLEBELL_ART} from '../src/training/kettlebellArt.js';
import {INSTAGRAM_EXERCISES} from '../src/training/catalogInstagram.js';
import {existsSync} from 'node:fs';

test('already migrated libraries receive kettlebells without restoring old deletions or overwriting edits',()=>{
 const edited={...KETTLEBELL_EXERCISES[0],cz:'Moje upravená karta'},custom={id:'user_kb'};
 // This test isolates kettlebell seeding; later content audits have their own migration tests.
 const original={hingeContentAudit20261022:true,loadedSteps20261022:true, stepContentAudit20261022:true,squatContentAudit20261022:true,exerciseExpansion20261011:true,exerciseAudit20261013:true,instagramContinuation20261015:true,instagramClientNext20261016:true,instagramDeepReview20261016:true,tEx:[edited,custom],tPl:[{id:'plan'}],tWo:[{id:'workout'}],tLog:[{exId:edited.id,reps:8}]};
 const result=seedExerciseExpansion(original);
 assert.equal(result.tEx.length,31+INSTAGRAM_EXERCISES.length);
 assert.equal(result.tEx[0],edited);assert.equal(result.tEx[1],custom);
 assert.ok(result.tEx.every(x=>!x.id.startsWith('ex26_')),'Do not restore deleted older expansion');
 for(const key of ['tPl','tWo','tLog'])assert.equal(result[key],original[key]);
 assert.equal(original.kettlebellExpansion20261015,undefined);
 assert.equal(seedExerciseExpansion(result),result);
 const deleted={...result,tEx:result.tEx.filter(x=>x.id!==edited.id)};
 assert.equal(seedExerciseExpansion(deleted),deleted);
 assert.equal(seedKettlebellExpansion(null),null);
});

test('client-filtered kettlebell links remain local and never add another family of cards',()=>{
 const seed=extensionFor(['drep','plank']),available=new Set(['drep','plank',...seed.map(x=>x.id)]);
 const result=seedKettlebellExpansion({tEx:[]},seed);
 assert.equal(result.tEx.length,30);
 for(const r of result.tEx){assert.ok(r.id.startsWith('kb26_'));for(const k of ['ez','hd'])assert.ok(!r[k]||available.has(r[k]),r.id+':'+k);}
});

test('kettlebell measurement and automatic selection reflect the actual task',()=>{
 const expected={kb26_deadlift:'WEIGHT_REPS',kb26_rack_hold:'WEIGHT_DURATION',kb26_rack_carry:'WEIGHT_DURATION',kb26_armbar:'WEIGHT_DURATION'};
 for(const [id,type]of Object.entries(expected))assert.equal(resolveExercise(KETTLEBELL_EXERCISES.find(x=>x.id===id),KETTLEBELL_META).measurementType,type);
 for(const r of KETTLEBELL_EXERCISES){assert.equal(r.genRule,'explicit');assert.equal(KETTLEBELL_META[r.id].g,'explicit');}
});

test('every new kettlebell card has its own reviewed master and all six local render assets',()=>{
 assert.deepEqual(new Set(Object.keys(KETTLEBELL_ART)),new Set(KETTLEBELL_EXERCISES.map(x=>x.id)));
 const hashes=new Set();
 for(const [id,a]of Object.entries(KETTLEBELL_ART)){
  assert.equal(a.appId,id);assert.match(a.sourceSha256,/^[a-f0-9]{64}$/);hashes.add(a.sourceSha256);
  for(const k of ['thumb','detail','inkThumb','inkDetail','fillThumb','fillDetail'])assert.ok(existsSync(new URL('../public'+a.primary[k],import.meta.url)),id+':'+k);
 }
 assert.equal(hashes.size,30);
});
