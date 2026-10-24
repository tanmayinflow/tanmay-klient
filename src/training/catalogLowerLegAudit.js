import {exerciseEquipment,EXERCISE_EQUIPMENT} from './exerciseEquipment.js';
import {FLOOR_CALF_ROW} from './catalogLowerLegFoundation.js';
import {LOWER_LEG_AUDIT_ENTRIES} from './catalogLowerLegAuditData.js';
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o||{},k);
export function lowerLegSame(a,b){if(Object.is(a,b))return true;if(!a||!b||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)!==Array.isArray(b))return false;if(Array.isArray(a)&&a.length!==b.length)return false;const keys=Object.keys(a);return keys.length===Object.keys(b).length&&keys.every(k=>own(b,k)&&lowerLegSame(a[k],b[k]));}
export const lowerLegSameField=(a,b,k)=>own(a,k)===own(b,k)&&lowerLegSame(a?.[k],b?.[k]);
export const lowerLegEmptyVariant=v=>v==null||v===''||Array.isArray(v)&&v.length===0;
export function lowerLegEntryFor(row,metadata,context){
 if(!row||context?.version!==1||!['main','client'].includes(context.role))return null;
 const local=context.entries?.[row.id],e=LOWER_LEG_AUDIT_ENTRIES[row.id]||(context.role==='main'?local?.data:null);
 if(!e||!local||!(local.metadataAbsent?metadata==null:lowerLegSame(metadata,local.metadata)))return null;
 if(own(row,'taxonomy')&&(!row.taxonomy||typeof row.taxonomy!=='object'||Array.isArray(row.taxonomy)))return null;
 if(own(row.taxonomy,'aliases')&&!Array.isArray(row.taxonomy.aliases))return null;
 for(const before of local.profiles){
  const after={...before,...e.edits};
  const stage=[['after',after],['before',before]].find(([,p])=>local.fieldKeys.every(k=>lowerLegSameField(row,p,k)))?.[0];
  if(!stage)continue;
  if(Object.entries(e.taxonomy).some(([k,v])=>k!=='aliases'&&own(row.taxonomy,k)&&!lowerLegSame(row.taxonomy[k],v)&&!(own(before.taxonomy,k)&&lowerLegSame(row.taxonomy[k],before.taxonomy[k]))))continue;
  return {...e,before,stage};
 }
 return null;
}
export const LOWER_LEG_AUDIT_FLAG='lowerLegAudit20261024';
export function applyLowerLegAudit(collection,{lowerLegAuditContext:context,auditMetadata}={}){
 if(!collection||!Array.isArray(collection.tEx)||collection[LOWER_LEG_AUDIT_FLAG]||context?.version!==1||!auditMetadata)return collection;
 let changed=false;
 const tEx=collection.tEx.map(row=>{
  if(!own(auditMetadata,row.id))return row;
  const e=lowerLegEntryFor(row,auditMetadata[row.id],context);if(!e)return row;
  let next=row;
  for(const[k,v]of Object.entries(e.edits))if(lowerLegSameField(row,e.before,k)&&!lowerLegSameField(row,e.edits,k)){if(next===row)next={...row};next[k]=structuredClone(v);}
  const taxonomy={...next.taxonomy};
  for(const[k,v]of Object.entries(e.taxonomy)){
   if(k==='aliases'){taxonomy.aliases=[...new Set([...(taxonomy.aliases||[]),...v])];continue;}
   if(!own(taxonomy,k)||own(e.before.taxonomy,k)&&lowerLegSame(taxonomy[k],e.before.taxonomy[k]))taxonomy[k]=structuredClone(v);
  }
  if(row.cz!==next.cz||row.en!==next.en)taxonomy.aliases=[...new Set([...(taxonomy.aliases||[]),...[row.cz,row.en].filter(x=>typeof x==='string')])];
  if(!lowerLegSame(taxonomy,next.taxonomy))next={...next,taxonomy};
  changed ||= next!==row;return next;
 });
 return {...collection,...(changed?{tEx}:{}),[LOWER_LEG_AUDIT_FLAG]:true};
}
export function lowerLegPolicyFor(row,meta,context){const e=lowerLegEntryFor(row,meta,context);return e?{...e.policy,stage:e.stage,auditKind:'lowerLeg'}:null;}
export function lowerLegPolicyForBlock(row,meta,context,block){
 const p=lowerLegPolicyFor(row,meta,context);if(!lowerLegBlockCompatible(p,block))return null;
 return p;
}
export function lowerLegSelectionAllowed(p,{equipment,explicitTarget=false}={}){if(!p)return true;if(p.unknown||p.explicitTarget&&!explicitTarget||!Array.isArray(equipment))return false;const have=new Set(['telo',...equipment]);return p.requirements.every(group=>group.some(id=>have.has(id)));}
export function lowerLegEquipmentDecision(row,meta,context,equipment,explicitTarget){const p=lowerLegPolicyFor(row,meta,context);return p?lowerLegSelectionAllowed(p,{equipment,explicitTarget}):undefined;}
const resolvedPolicies=new WeakMap();
export function attachLowerLegPolicy(record,row,meta,context){const p=lowerLegPolicyFor(row,meta,context);if(!p){resolvedPolicies.delete(record);return record;}const out=p.familyOverride?{...record,familyId:p.familyOverride}:record;resolvedPolicies.set(out,p);return out;}
export const resolvedLowerLegPolicy=record=>record&&resolvedPolicies.get(record)||null;
export function lowerLegResolvedRefusal(record,ctx){const p=resolvedLowerLegPolicy(record);return p&&!lowerLegSelectionAllowed(p,ctx)?{ok:false,why:p.unknown?'reviewed-setup-unspecified':p.explicitTarget&&!ctx?.explicitTarget?'reviewed-explicit-target':'reviewed-equipment'}:null;}
export function lowerLegArtworkFor(row,meta,context){return lowerLegEntryFor(row,meta,context)?.art||null;}

export function lowerLegDeliveryStamp(record,payload){const p=resolvedLowerLegPolicy(record),e=p&&LOWER_LEG_AUDIT_ENTRIES[p.id];if(!e||p.stage!=='after')return undefined;const pair=Object.entries(e.deliveryProfiles||{}).find(([,v])=>Object.keys(v.fields).every(k=>lowerLegSameField(payload,v.fields,k))&&(payload.progression===null||lowerLegSame(payload.progression,v.progression)));return pair?{v:1,profile:pair[0]}:undefined;}
export function lowerLegDeliveredPolicy(payload){const stamp=payload?.lowerLegAudit,e=LOWER_LEG_AUDIT_ENTRIES[payload?.id],profile=stamp?.v===1&&e?.deliveryProfiles?.[stamp.profile];return profile&&Object.keys(profile.fields).every(k=>lowerLegSameField(payload,profile.fields,k))&&(payload.progression===null||lowerLegSame(payload.progression,profile.progression))?{...e.policy,stage:'after',auditKind:'lowerLeg'}:null;}
export const lowerLegDeliveredArtworkFor=payload=>lowerLegDeliveredPolicy(payload)?LOWER_LEG_AUDIT_ENTRIES[payload.id].art:null;

export function seedLowerLegFoundation(collection){if(!collection||collection.lowerLegFoundation20261024)return collection;const rows=Array.isArray(collection.tEx)?collection.tEx:[];return{...collection,tEx:rows.some(r=>r.id===FLOOR_CALF_ROW.id)?rows:[...rows,structuredClone(FLOOR_CALF_ROW)],lowerLegFoundation20261024:true};}

// Exercise overrides in a prescription opt out. Notes and dosing remain editable.
export function lowerLegBlockCompatible(p,block){
 if(!p)return false;if(p.auditKind!=='lowerLeg')return true;
 if(block?.exId!==p.id||block.measurementType!==p.measurementType||!lowerLegEmptyVariant(block.variant))return false;
 for(const k of ['loadMode','sideMode','allowEstimatedMax','allowAddedWeightRecord','allowComparableRecords','allowAutomaticProgression','manualProgression','manualWarmup','noAddedWeight','recordingPolicy','progressionPolicy','selectionPolicy','equipmentRequirements','equipment','requiresCoach','requiresEquipmentCheck','allowCopyCompletedAcrossSides','preserveSide','lowerLegAuditPolicy','lowerLegPrescription'])if(own(block,k)&&!lowerLegSame(block[k],p[k]))return false;
 return true;
}
export function lowerLegEquipmentLabels(row,meta,context,language='cs'){
 if(!lowerLegEntryFor(row,meta,context))return null;const en=language==='en';return exerciseEquipment(row).requirements.map(g=>g.map(id=>EXERCISE_EQUIPMENT.find(x=>x.id===id)?.[en?'en':'cz']||id).join(en?' or ':' nebo '));
}
