// Guarded carry corrections. Preserve personal rows, recording and deletions.
import {applyCatalogCorrections} from './catalogCorrections.js';
import {proposal} from './catalogCarryAuditData.js';
export const auditFlag='carryAudit20261023';
const clone=x=>JSON.parse(JSON.stringify(x));
function equal(a,b){
 if(Object.is(a,b))return true;
 if(!a||!b||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)!==Array.isArray(b))return false;
 const keys=Object.keys(a);
 return keys.length===Object.keys(b).length&&keys.every(k=>Object.hasOwn(b,k)&&equal(a[k],b[k]));
}
export function applyCarryAudit(collection){
 if(!collection||typeof collection!=='object'||collection[auditFlag])return collection;
 const rows=Array.isArray(collection.tEx)?collection.tEx:[],before=new Map(rows.filter(Boolean).map(r=>[r.id,r]));
 const corrections={...proposal.corrections},blocked=new Set();
 for(const row of rows){
  if(!row||!proposal.guards[row.id])continue;
  const metricChanged=Object.entries(proposal.recordingGuards[row.id]).some(([k,v])=>Object.hasOwn(row,k)!==v.present||!equal(row[k],v.value));
  const setupChanged=Object.entries(proposal.originalGuards[row.id]).some(([k,v])=>!equal(row[k],v));
  const taxonomy=row.taxonomy,oldTaxonomy=proposal.originalTaxonomy[row.id]||{},nextTaxonomy=proposal.taxonomy[row.id]||{};
  const customTaxonomy=(Object.hasOwn(row,'taxonomy')&&(!taxonomy||typeof taxonomy!=='object'||Array.isArray(taxonomy)))
   ||(Object.hasOwn(taxonomy||{},'aliases')&&!Array.isArray(taxonomy.aliases))
   ||Object.keys(nextTaxonomy).filter(k=>k!=='aliases').some(k=>Object.hasOwn(taxonomy||{},k)&&!(Object.hasOwn(oldTaxonomy,k)&&equal(taxonomy[k],oldTaxonomy[k]))&&!equal(taxonomy[k],nextTaxonomy[k]));
  if(metricChanged||setupChanged||customTaxonomy){blocked.add(row.id);delete corrections[row.id];}
 }
 const corrected=applyCatalogCorrections(collection,corrections,auditFlag);let changed=false;
 const next=(corrected.tEx||[]).map(row=>{
  if(!row||blocked.has(row.id)||!proposal.guards[row.id])return row;
  const old=before.get(row.id),reviewed=Object.entries(proposal.guards[row.id]).every(([k,v])=>equal(row[k],v));
  if(!reviewed)return row;
  const taxonomy={...row.taxonomy};
  for(const [key,value]of Object.entries(proposal.taxonomy[row.id])){
   if(key==='aliases'){taxonomy.aliases=[...new Set([...(taxonomy.aliases||[]),...value])];continue;}
   if(taxonomy[key]===undefined||equal(taxonomy[key],proposal.originalTaxonomy[row.id]?.[key]))taxonomy[key]=clone(value);
  }
  if(old&&(old.cz!==row.cz||old.en!==row.en))taxonomy.aliases=[...new Set([...(taxonomy.aliases||[]),...[old.cz,old.en].filter(Boolean)])];
  if(equal(taxonomy,row.taxonomy))return row;changed=true;return {...row,taxonomy};
 });
 return changed?{...corrected,tEx:next}:corrected;
}
