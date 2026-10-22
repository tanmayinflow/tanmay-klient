// Guarded content correction and additive foundations.

import {applyCatalogCorrections} from './catalogCorrections.js';
import {proposal} from './catalogBridgeAuditData.js';
export {proposal};
const flag='bridgeContentAudit20261022',seedFlag='bridgeFoundations20261022';
const clone=x=>JSON.parse(JSON.stringify(x));
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function applyBridgeAudit(collection){
 if(!collection||collection[flag])return collection;
 const previous=Array.isArray(collection.tEx)?collection.tEx:[],before=new Map(previous.map(r=>[r?.id,r]));
 // An equipment/setup reinterpretation must be atomic. Independent field edits
 // would otherwise leave a custom barbell setup with new dumbbell instructions.
 const corrections={...proposal.corrections},blocked=new Set();
 for(const row of previous){
  if(!row||!proposal.guards[row.id])continue;
  const originalRecording=proposal.recordingGuards[row.id];
  if(Object.entries(originalRecording).some(([k,v])=>Object.hasOwn(row,k)!==v.present||!equal(row[k],v.value))){
   blocked.add(row.id);delete corrections[row.id];continue;
  }
  if(!proposal.semanticChanges.includes(row?.id))continue;
  const unchanged=Object.entries(proposal.originalGuards[row.id]).every(([k,v])=>equal(row[k],v));
  const customMeaning=['movements','positions','supports','equipmentRequirements'].some(k=>row.taxonomy?.[k]!==undefined&&!equal(row.taxonomy[k],proposal.taxonomy[row.id][k]));
  if(!unchanged||customMeaning){blocked.add(row.id);delete corrections[row.id];}
 }
 const corrected=applyCatalogCorrections(collection,corrections,flag);let changed=false;
 const rows=(corrected.tEx||[]).map(row=>{
  if(!row||blocked.has(row.id))return row;
  const guard=proposal.guards[row.id],old=before.get(row.id);
  const reviewed=guard&&Object.entries(guard).every(([k,v])=>equal(row[k],v));
  const renamed=old&&(old.cz!==row.cz||old.en!==row.en);
  if(!reviewed&&!renamed)return row;
  const taxonomy={...(reviewed?clone(proposal.taxonomy[row.id]):{}),...row.taxonomy};
  if(renamed)taxonomy.aliases=[...new Set([...(taxonomy.aliases||[]),old.cz,old.en].filter(Boolean))];
  if(equal(taxonomy,row.taxonomy))return row;
  changed=true;return {...row,taxonomy};
 });
 return changed?{...corrected,tEx:rows}:corrected;
}
export function seedBridgeFoundations(collection){
 if(!collection||collection[seedFlag])return collection;
 const rows=Array.isArray(collection.tEx)?collection.tEx:[],ids=new Set(rows.map(r=>r?.id));
 const additions=proposal.additions.filter(r=>!ids.has(r.id)).map(r=>({...clone(r),ez:ids.has(r.ez)?r.ez:null}));
 return {...collection,tEx:additions.length?[...rows,...additions]:rows,[seedFlag]:true};
}
