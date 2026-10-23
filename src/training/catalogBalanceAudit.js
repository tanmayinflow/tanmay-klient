import {balanceEntryFor,balanceRowEligible,balanceMetadataEligible,sameBalanceField,sameBalanceValue} from './catalogBalanceAuditGuards.js';
export const BALANCE_AUDIT_FLAG='balanceAudit20261023';
const copy=value=>JSON.parse(JSON.stringify(value));

// Only existing exact defaults are eligible. The app owns its own metadata;
// a missing context leaves the migration pending rather than marking success.
export function applyBalanceAudit(collection,{balanceAuditContext,auditMetadata}={}){
 if(!collection||typeof collection!=='object'||collection[BALANCE_AUDIT_FLAG])return collection;
 if(balanceAuditContext?.version!==1||!['main','client'].includes(balanceAuditContext.role)||!auditMetadata)return collection;
 const previous=collection.tEx;
 if(!Array.isArray(previous))return collection;
 if(Array.isArray(previous)&&previous.some(row=>balanceEntryFor(row,balanceAuditContext)&&(!Object.hasOwn(balanceAuditContext.metadataGuards||{},row.id)||!Object.hasOwn(auditMetadata,row.id)||!auditMetadata[row.id])))return collection;
 let changed=false;
 const rows=Array.isArray(previous)?previous.map(row=>{
  const entry=balanceEntryFor(row,balanceAuditContext);
  if(!balanceRowEligible(row,entry)||!balanceMetadataEligible(row,balanceAuditContext,auditMetadata))return row;
  let next=row;
  for(const[k,v]of Object.entries(entry.edits)){
   if(!sameBalanceField(row,entry.before,k)||sameBalanceValue(row[k],v))continue;
   if(next===row)next={...row};next[k]=copy(v);
  }
  const taxonomy={...next.taxonomy};
  for(const[k,v]of Object.entries(entry.taxonomy)){
   if(k==='aliases'){taxonomy.aliases=[...new Set([...(taxonomy.aliases||[]),...v])];continue;}
   if(!Object.hasOwn(taxonomy,k)||(Object.hasOwn(entry.before.taxonomy||{},k)&&sameBalanceValue(taxonomy[k],entry.before.taxonomy[k])))taxonomy[k]=copy(v);
  }
  if(row.cz!==next.cz||row.en!==next.en)taxonomy.aliases=[...new Set([...(taxonomy.aliases||[]),...[row.cz,row.en].filter(Boolean)])];
  if(!sameBalanceValue(taxonomy,next.taxonomy))next={...next,taxonomy};
  if(next!==row)changed=true;return next;
 }):previous;
 return {...collection,...(changed?{tEx:rows}:{}),[BALANCE_AUDIT_FLAG]:true};
}
