import test from 'node:test';
import assert from 'node:assert/strict';
import {seedExerciseExpansion} from '../src/training/catalogExpansion.js';
import {applyVerticalPushAudit,proposal as push} from '../src/training/catalogVerticalPushAudit.js';
import {applyVerticalPullAudit,proposal as pull} from '../src/training/catalogVerticalPullAudit.js';
import {verticalAuditArtworkFor} from '../src/training/catalogVerticalAudit.js';
import {buildExerciseIndex,selectExerciseLibrary} from '../src/training/exerciseLibrary.js';
import {resolveMuscleMap,muscleMapEdit} from '../src/training/muscleMap.js';
const options={includeClientVerticalPushFoundations:true,includeClientVerticalPullFoundations:true};
test('vertical foundations respect role opt-in, existing identity and later deletion',()=>{
 const personal={id:'vpul26_neutral_pullup',cz:'My variation',note:'Private'};
 const input={tEx:[personal],tLog:[{id:'old'}],tPl:[{id:'plan'}]};
 const main=seedExerciseExpansion(input,[]),client=seedExerciseExpansion(input,[],options);
 assert.equal(main.tEx.find(r=>r.id===personal.id),personal);
 for(const id of ['vp26_seated_db_press','vp26_foot_assisted_dip','vpul26_foot_assisted_chin']){assert.ok(!main.tEx.some(r=>r.id===id));assert.ok(client.tEx.some(r=>r.id===id));}
 assert.equal(client.tLog,input.tLog);assert.equal(client.tPl,input.tPl);
 const deleted={...client,tEx:[]};assert.equal(seedExerciseExpansion(deleted,[],options).tEx.length,0);
});
test('vertical guarded corrections leave personally redefined setups and metrics intact',()=>{
 for(const [proposal,apply] of [[push,applyVerticalPushAudit],[pull,applyVerticalPullAudit]])for(const id of Object.keys(proposal.guards)){
  const row={id,...proposal.originalGuards[id],taxonomy:proposal.originalTaxonomy[id],...proposal.metadataGuards?.[id]};
  for(const [k,g]of Object.entries(proposal.recordingGuards[id]))if(g.present)row[k]=g.value;
  for(const change of [{cz:'Personal'},{pos:['Personal','Personal']},{measurementType:'MY_METRIC'},{taxonomy:{movements:['breath'],note:'Private'}}]){
   const own={...row,...change};assert.deepEqual(apply({tEx:[own]}).tEx,[own],id);
  }
 }
});
test('new and replacement art applies only to the complete reviewed setup',()=>{
 for(const row of [...push.additions,...pull.additions,{id:'ex26_seated_bb_press',...push.guards.ex26_seated_bb_press}]){
  assert.equal(verticalAuditArtworkFor(row)?.transparentBody,true,row.id);
  for(const field of ['cz','en','pos','exe','eq'])assert.equal(verticalAuditArtworkFor({...row,[field]:'Personal'}),null,row.id+'.'+field);
 }
});
test('programme-only scapular placeholder has no invented muscle map in index or editor',()=>{
 const row={id:'vi_scap',...pull.originalGuards.vi_scap,mp:['sho']};
 const meta={t:'program_only'};
 const direct=resolveMuscleMap(row,meta);
 assert.deepEqual(direct.primary,[]);assert.deepEqual(direct.secondary,[]);assert.equal(direct.mode,'unspecified');
 const index=buildExerciseIndex([row],{metaOf:()=>meta,musclesOf:resolveMuscleMap});
 assert.deepEqual(index[0].muscles,direct);
 const edited=muscleMapEdit(row,'primary',['lat'],meta);
 assert.deepEqual(resolveMuscleMap({...row,...edited},meta).primary,['lat']);
 assert.equal(selectExerciseLibrary(index,{muscles:['lat']}).rows.length,0);
});
