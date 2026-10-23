import {movementEntryFor,movementRowEligible,movementMetadataEligible,sameMovementField,sameMovementValue} from './catalogMovementAuditGuards.js';
export const MOVEMENT_AUDIT_FLAG='movementAudit20261023';
const copy=value=>JSON.parse(JSON.stringify(value));

// Only existing exact defaults are eligible. The app owns its own metadata;
// a missing context leaves the migration pending rather than marking success.
export function applyMovementAudit(collection,{movementAuditContext,auditMetadata}={}){
 if(!collection||typeof collection!=='object'||collection[MOVEMENT_AUDIT_FLAG])return collection;
 if(movementAuditContext?.version!==1||!['main','client'].includes(movementAuditContext.role)||!auditMetadata)return collection;
 const previous=collection.tEx;
 if(!Array.isArray(previous))return collection;
 if(Array.isArray(previous)&&previous.some(row=>movementEntryFor(row,movementAuditContext)&&(!Object.hasOwn(movementAuditContext.metadataGuards||{},row.id)||!Object.hasOwn(auditMetadata,row.id)||!auditMetadata[row.id])))return collection;
 let changed=false;
 const rows=Array.isArray(previous)?previous.map(row=>{
  const entry=movementEntryFor(row,movementAuditContext);
  if(!movementRowEligible(row,entry)||!movementMetadataEligible(row,movementAuditContext,auditMetadata))return row;
  let next=row;
  for(const[k,v]of Object.entries(entry.edits)){
   if(!sameMovementField(row,entry.before,k)||sameMovementValue(row[k],v))continue;
   if(next===row)next={...row};next[k]=copy(v);
  }
  const taxonomy={...next.taxonomy};
  for(const[k,v]of Object.entries(entry.taxonomy)){
   if(k==='aliases'){taxonomy.aliases=[...new Set([...(taxonomy.aliases||[]),...v])];continue;}
   if(!Object.hasOwn(taxonomy,k)||(Object.hasOwn(entry.before.taxonomy||{},k)&&sameMovementValue(taxonomy[k],entry.before.taxonomy[k])))taxonomy[k]=copy(v);
  }
  if(row.cz!==next.cz||row.en!==next.en)taxonomy.aliases=[...new Set([...(taxonomy.aliases||[]),...[row.cz,row.en].filter(Boolean)])];
  if(!sameMovementValue(taxonomy,next.taxonomy))next={...next,taxonomy};
  if(next!==row)changed=true;return next;
 }):previous;
 return {...collection,...(changed?{tEx:rows}:{}),[MOVEMENT_AUDIT_FLAG]:true};
}
