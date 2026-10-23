import{LOCOMOTION_AUDIT_ENTRIES}from'./catalogLocomotionAuditData.js';
import{locomotionEntryFor,locomotionMetadataEligible,sameLocomotionField,sameLocomotionValue}from'./catalogLocomotionAuditGuards.js';
export const LOCOMOTION_AUDIT_FLAG='locomotionAudit20261024';
const copy=x=>JSON.parse(JSON.stringify(x));
export function applyLocomotionAudit(collection,{locomotionAuditContext:context,auditMetadata}={}){
 if(!collection||typeof collection!=='object'||collection[LOCOMOTION_AUDIT_FLAG]||!Array.isArray(collection.tEx))return collection;
 if(context?.version!==1||!['main','client'].includes(context.role)||!auditMetadata)return collection;
 if(collection.tEx.some(row=>LOCOMOTION_AUDIT_ENTRIES[row.id]&&(!Object.hasOwn(context.metadataGuards||{},row.id)||!Object.hasOwn(auditMetadata,row.id)||!auditMetadata[row.id])))return collection;
 let changed=false;const tEx=collection.tEx.map(row=>{
  const e=locomotionEntryFor(row,context);if(!e||!locomotionMetadataEligible(row,context,auditMetadata))return row;
  // The one inherited Client dangling link is changed only while its target is absent.
  const keepLink=context.role==='client'&&row.id==='ex26_mob_scap_circles'&&collection.tEx.some(x=>x.id==='gm_scap_retract_quad');
  let next=row;for(const[k,v]of Object.entries(e.edits)){if((k==='ez'&&keepLink)||!sameLocomotionField(row,e.before,k)||sameLocomotionValue(row[k],v))continue;if(next===row)next={...row};next[k]=copy(v);}
  const taxonomy={...next.taxonomy};for(const[k,v]of Object.entries(e.taxonomy)){if(k==='aliases'){taxonomy.aliases=[...new Set([...(taxonomy.aliases||[]),...v])];continue;}if(!Object.hasOwn(taxonomy,k)||(Object.hasOwn(e.before.taxonomy||{},k)&&sameLocomotionValue(taxonomy[k],e.before.taxonomy[k])))taxonomy[k]=copy(v);}
  if(row.cz!==next.cz||row.en!==next.en)taxonomy.aliases=[...new Set([...(taxonomy.aliases||[]),...[row.cz,row.en].filter(Boolean)])];
  if(!sameLocomotionValue(taxonomy,next.taxonomy))next={...next,taxonomy};if(next!==row)changed=true;return next;
 });return{...collection,...(changed?{tEx}:{}),[LOCOMOTION_AUDIT_FLAG]:true};
}

