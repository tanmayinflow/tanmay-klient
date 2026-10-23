import test from 'node:test';
import assert from 'node:assert/strict';
import {BALANCE_AUDIT_CONTEXT as context} from '../src/data/balanceAuditContext.js';
import {BALANCE_AUDIT_ENTRIES as entries} from '../src/training/catalogBalanceAuditData.js';
import {applyBalanceAudit,BALANCE_AUDIT_FLAG} from '../src/training/catalogBalanceAudit.js';
import {familyOf,resolveExercise} from '../src/training/catalog.js';
import {reviewSelection} from '../src/training/generator.js';
import {exerciseEquipment,matchesAvailableEquipment} from '../src/training/exerciseEquipment.js';
const options={balanceAuditContext:context,auditMetadata:context.metadataGuards},row=id=>structuredClone(entries[id].before),run=r=>applyBalanceAudit({tEx:[r]},options).tEx[0];
test('balance audit retains identity, deleted rows, personal note and historical recording',()=>{
 const input={tEx:[{...row('ex26_single_reach'),taxonomy:{aliases:['mine','',null,undefined,false,0],note:'Own note'}}],history:{ex26_single_reach:[{reps:7,side:'left'}]},plans:[{ids:['ex26_single_reach']}]};
 const before=structuredClone(input),next=applyBalanceAudit(input,options);assert.deepEqual(input,before);assert.equal(next.tEx.length,1);assert.deepEqual(next.history,input.history);assert.deepEqual(next.plans,input.plans);
 const after=next.tEx[0];assert.equal(after.id,input.tEx[0].id);assert.equal(after.taxonomy.note,'Own note');for(const v of input.tEx[0].taxonomy.aliases)assert.ok(after.taxonomy.aliases.includes(v));
 for(const k of ['mode','load','measurementType','loadMode','sideMode']){assert.equal(Object.hasOwn(after,k),Object.hasOwn(input.tEx[0],k));assert.deepEqual(after[k],input.tEx[0][k]);}
 assert.equal(applyBalanceAudit(next,options),next);assert.equal(next[BALANCE_AUDIT_FLAG],true);
});
test('standing balance is not redundant with an inversion and crow uses bent-arm intent',()=>{
 const stance=run(row('slbalance')),hs=run(row('handstand')),crow=run(row('crow'));
 assert.equal(familyOf(stance,context.metadataGuards.slbalance),'balance_standing');assert.equal(crow.armMode,'bent');
 const recs=[stance,hs].map(ex=>resolveExercise(ex,context.metadataGuards[ex.id]));assert.ok(!reviewSelection(recs).some(x=>x.k==='family'));
 for(const [id,key]of[['slbalance','family'],['crow','armMode']])for(const value of ['personal',undefined,null]){const own={...row(id),[key]:value};assert.deepEqual(run(own),own);}
});
test('presence-aware guards preserve custom source, seed, metadata and malformed taxonomies',()=>{
 for(const taxonomy of [undefined,null,[],{positions:undefined},{aliases:null}]){const own={...row('crow'),taxonomy};assert.deepEqual(run(own),own);}
 for(const [key,value]of [['source',{personal:'keep'}],['seed',undefined],['seed',null],['pos',['Own','Own']]]){const own={...row('crow'),[key]:value};assert.deepEqual(run(own),own);}
 const input={tEx:[row('slbalance')]};assert.equal(applyBalanceAudit(input),input);assert.equal(applyBalanceAudit(input,{...options,auditMetadata:{}}),input);
 const custom={...options,auditMetadata:{...context.metadataGuards,slbalance:{...context.metadataGuards.slbalance,personal:'keep'}}};assert.deepEqual(applyBalanceAudit(input,custom).tEx,input.tEx);
});
test('archived BOSU stays excluded while exact hand supports remain distinguishable',()=>{
 const old=row('bosuoahs'),next=run(old);for(const k of ['status','tier','genRule']){assert.equal(Object.hasOwn(next,k),Object.hasOwn(old,k));assert.deepEqual(next[k],old[k]);}
 const rec=resolveExercise(next,context.metadataGuards.bosuoahs);assert.equal(rec.generatorEligible,false);
 const low=exerciseEquipment(run(row('bentarmhs')));assert.equal(matchesAvailableEquipment(low,['bradla']),false);assert.equal(matchesAvailableEquipment(low,['low_parallettes']),true);
 assert.equal(matchesAvailableEquipment(exerciseEquipment(run(row('fingerhs'))),['telo']),true);
});
