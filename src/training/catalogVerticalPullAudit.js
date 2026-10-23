// Guarded corrections and additive foundations; preserve custom rows and recording.

import {applyCatalogCorrections} from './catalogCorrections.js';
import {proposal} from './catalogVerticalPullAuditData.js';
export {proposal};
const flag='verticalPullAudit20261023',commonSeedFlag='verticalPullCommonFoundations20261023',clientSeedFlag='verticalPullClientFoundations20261023';
const clone=x=>JSON.parse(JSON.stringify(x)),equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function applyVerticalPullAudit(collection){
 if(!collection||collection[flag])return collection;
 const previous=Array.isArray(collection.tEx)?collection.tEx:[],before=new Map(previous.map(r=>[r?.id,r]));
 const corrections={...proposal.corrections},blocked=new Set();
 for(const row of previous){
  if(!row||!proposal.guards[row.id])continue;
  const changedRecording=Object.entries(proposal.recordingGuards[row.id]).some(([k,v])=>Object.hasOwn(row,k)!==v.present||!equal(row[k],v.value));
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
   if(k==='aliases'){taxonomy.aliases=[...new Set([...(taxonomy.aliases||[]),...value])];continue;}
   if(taxonomy[k]===undefined||equal(taxonomy[k],proposal.originalTaxonomy[row.id]?.[k]))taxonomy[k]=clone(value);
  }
  if(renamed)taxonomy.aliases=[...new Set([...(taxonomy.aliases||[]),old.cz,old.en].filter(Boolean))];
  if(equal(taxonomy,row.taxonomy))return row;
  changed=true;return {...row,taxonomy};
 });
 return changed?{...corrected,tEx:rows}:corrected;
}
export function seedVerticalPullFoundations(collection,{includeClientVerticalPullFoundations=false}={}){
 if(!collection)return collection;
 let next=collection;
 for(const [flag,ids,enabled]of [[commonSeedFlag,proposal.additionRoles.main,true],[clientSeedFlag,['vpul26_foot_assisted_chin'],includeClientVerticalPullFoundations]]){
  if(!enabled||next[flag])continue;
  const rows=Array.isArray(next.tEx)?next.tEx:[],present=new Set(rows.map(r=>r?.id));
  const additions=proposal.additions.filter(r=>ids.includes(r.id)&&!present.has(r.id)).map(clone);
  next={...next,tEx:additions.length?[...rows,...additions]:rows,[flag]:true};
 }
 return next;
}
