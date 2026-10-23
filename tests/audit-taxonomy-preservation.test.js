import test from 'node:test';import assert from 'node:assert/strict';
import {applyCarryAudit} from '../src/training/catalogCarryAudit.js';
import {proposal} from '../src/training/catalogCarryAuditData.js';
import {applyTrunkAudit} from '../src/training/catalogTrunkAudit.js';
import {TRUNK_AUDIT_ENTRIES as entries} from '../src/training/catalogTrunkAuditData.js';
test('carry and trunk audits preserve explicit malformed or custom classification fields',()=>{
 const options={trunkAuditContext:{version:1,role:'client',entries:{},metadataGuards:{}},auditMetadata:{}};
 for(const [base,run,facets] of [[{id:'farmer',...proposal.originalGuards.farmer},applyCarryAudit,Object.keys(proposal.taxonomy.farmer)],[entries.plank.before,c=>applyTrunkAudit(c,options),Object.keys(entries.plank.taxonomy)]]){
  for(const taxonomy of [null,undefined,[],false,'custom',{aliases:null},{aliases:undefined},{aliases:'custom'},...facets.filter(k=>k!=='aliases').map(k=>({[k]:undefined}))]){
   const row={...structuredClone(base),taxonomy},collection={tEx:[row],notes:['Preserve'],history:[{reps:10,weight:12}]},out=run(collection);
   assert.equal(out.tEx[0],row);assert.deepEqual(out.notes,collection.notes);assert.deepEqual(out.history,collection.history);
  }
 }
});

test('renaming a default preserves existing falsy aliases alongside added old names',()=>{
 const aliases=['PRIVATE_ALIAS','',null,undefined,false,0],options={trunkAuditContext:{version:1,role:'client',entries:{},metadataGuards:{}},auditMetadata:{}};
 const carry={id:'ropeclimb',...proposal.originalGuards.ropeclimb,taxonomy:{aliases:[...aliases]}},trunk={...structuredClone(entries.plank.before),taxonomy:{aliases:[...aliases]}};
 for(const result of [applyCarryAudit({tEx:[carry]}),applyTrunkAudit({tEx:[trunk]},options)])for(const alias of aliases)assert.ok(result.tEx[0].taxonomy.aliases.includes(alias),String(alias));
});
