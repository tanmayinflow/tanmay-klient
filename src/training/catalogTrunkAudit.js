import {trunkEntryFor,trunkRowEligible,trunkMetadataEligible,sameTrunkField,sameTrunkValue} from './catalogTrunkAuditGuards.js';
export const TRUNK_AUDIT_FLAG='trunkAudit20261023';
const copy=value=>JSON.parse(JSON.stringify(value));

// Correct only existing, still-recognizable catalogue defaults. Do not restore
// deleted cards, normalize measurements, copy role metadata or touch history.
export function applyTrunkAudit(collection,{trunkAuditContext,auditMetadata}={}){
 if(!collection||typeof collection!=='object'||collection[TRUNK_AUDIT_FLAG])return collection;
 // Generic catalogue consumers do not own a role's private guard evidence.
 // Leave the migration pending until that evidence is supplied by the app.
 if(trunkAuditContext?.version!==1||!['main','client'].includes(trunkAuditContext.role)||!auditMetadata)return collection;
 const previous=collection.tEx;
 if(Array.isArray(previous)&&previous.some(row=>{
  const entry=trunkEntryFor(row,trunkAuditContext);
  return entry?.metadataFields.length&&(!Object.hasOwn(trunkAuditContext.metadataGuards||{},row.id)||!Object.hasOwn(auditMetadata,row.id)||!auditMetadata[row.id]);
 }))return collection;
 let changed=false;
 const rows=Array.isArray(previous)?previous.map(row=>{
  const entry=trunkEntryFor(row,trunkAuditContext);
  if(!entry||!trunkRowEligible(row,entry,auditMetadata?.[row.id])||!trunkMetadataEligible(row,entry,trunkAuditContext,auditMetadata))return row;
  let next=row;
  for(const[k,value]of Object.entries(entry.edits)){
   if(!sameTrunkField(row,entry.before,k)||sameTrunkValue(row[k],value))continue;
   if(next===row)next={...row};next[k]=copy(value);
  }
  const taxonomy={...next.taxonomy};
  for(const[k,value]of Object.entries(entry.taxonomy)){
   if(k==='aliases'){taxonomy.aliases=[...new Set([...(taxonomy.aliases||[]),...value])];continue;}
   if(taxonomy[k]===undefined||sameTrunkValue(taxonomy[k],entry.before.taxonomy?.[k]))taxonomy[k]=copy(value);
  }
  if(row.cz!==next.cz||row.en!==next.en)taxonomy.aliases=[...new Set([...(taxonomy.aliases||[]),row.cz,row.en].filter(Boolean))];
  if(!sameTrunkValue(taxonomy,next.taxonomy))next={...next,taxonomy};
  if(next!==row)changed=true;
  return next;
 }):previous;
 return {...collection,...(changed?{tEx:rows}:{}),[TRUNK_AUDIT_FLAG]:true};
}
