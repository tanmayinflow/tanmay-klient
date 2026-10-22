// Guarded content correction and additive foundations.

import {applyCatalogCorrections} from './catalogCorrections.js';
import {proposal} from './catalogHorizontalPressAuditData.js';
export {proposal};
const flag='horizontalPressAudit20261022',seedFlag='horizontalPressFoundations20261022';
const clone=x=>JSON.parse(JSON.stringify(x));
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function applyHorizontalPressAudit(collection){
 if(!collection||collection[flag])return collection;
 const previous=Array.isArray(collection.tEx)?collection.tEx:[],before=new Map(previous.map(r=>[r?.id,r]));
 const corrections={...proposal.corrections},blocked=new Set();
 for(const row of previous){
  if(!row||!proposal.guards[row.id])continue;
  const recording=proposal.recordingGuards[row.id];
  const changedRecording=Object.entries(recording).some(([k,v])=>Object.hasOwn(row,k)!==v.present||!equal(row[k],v.value));
  // Setup, naming and equipment changes must stay coherent. Notes, aliases and
  // personal editorial priority do not trigger this semantic safeguard.
  const changedSetup=Object.entries(proposal.originalGuards[row.id]).some(([k,v])=>!equal(row[k],v));
  const changedTaxonomy=['movements','positions','supports','equipmentRequirements'].some(k=>row.taxonomy?.[k]!==undefined&&!equal(row.taxonomy[k],proposal.originalTaxonomy[row.id]?.[k])&&!equal(row.taxonomy[k],proposal.taxonomy[row.id]?.[k]));
  if(changedRecording||changedSetup||changedTaxonomy){blocked.add(row.id);delete corrections[row.id];}
 }
 const corrected=applyCatalogCorrections(collection,corrections,flag);let changed=false;
 const rows=(corrected.tEx||[]).map(row=>{
  if(!row||blocked.has(row.id)||!proposal.guards[row.id])return row;
  const old=before.get(row.id),reviewed=Object.entries(proposal.guards[row.id]).every(([k,v])=>equal(row[k],v));
  const renamed=old&&(old.cz!==row.cz||old.en!==row.en);
  if(!reviewed&&!renamed)return row;
  const taxonomy={...row.taxonomy};
  if(reviewed)for(const [k,value]of Object.entries(proposal.taxonomy[row.id]||{})){
   if(taxonomy[k]===undefined||equal(taxonomy[k],proposal.originalTaxonomy[row.id]?.[k]))taxonomy[k]=clone(value);
  }
  if(renamed)taxonomy.aliases=[...new Set([...(taxonomy.aliases||[]),old.cz,old.en].filter(Boolean))];
  if(equal(taxonomy,row.taxonomy))return row;
  changed=true;return {...row,taxonomy};
 });
 return changed?{...corrected,tEx:rows}:corrected;
}
export function seedHorizontalPressFoundations(collection){
 if(!collection||collection[seedFlag])return collection;
 const rows=Array.isArray(collection.tEx)?collection.tEx:[],ids=new Set(rows.map(r=>r?.id));
 const additions=proposal.additions.filter(r=>!ids.has(r.id)).map(r=>clone(r));
 return {...collection,tEx:additions.length?[...rows,...additions]:rows,[seedFlag]:true};
}
