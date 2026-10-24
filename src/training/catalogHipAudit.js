import {exerciseEquipment,EXERCISE_EQUIPMENT,matchesAvailableEquipment} from './exerciseEquipment.js';
import {HIP_AUDIT_ENTRIES} from './catalogHipAuditData.js';
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o||{},k);
export function hipSame(a,b){if(Object.is(a,b))return true;if(!a||!b||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)!==Array.isArray(b))return false;if(Array.isArray(a)&&a.length!==b.length)return false;const keys=Object.keys(a);return keys.length===Object.keys(b).length&&keys.every(k=>own(b,k)&&hipSame(a[k],b[k]));}
export const hipSameField=(a,b,k)=>own(a,k)===own(b,k)&&hipSame(a?.[k],b?.[k]);
export const hipEmptyVariant=v=>v==null||v===''||Array.isArray(v)&&v.length===0;
export function hipEntryFor(row,metadata,context){
 if(!row||context?.version!==1||!['main','client'].includes(context.role))return null;
 const local=context.entries?.[row.id],e=HIP_AUDIT_ENTRIES[row.id]||(context.role==='main'?local?.data:null);
 if(!e||!local||!(local.metadataAbsent?metadata==null:hipSame(metadata,local.metadata)))return null;
 if(own(row,'taxonomy')&&(!row.taxonomy||typeof row.taxonomy!=='object'||Array.isArray(row.taxonomy)))return null;
 if(own(row.taxonomy,'aliases')&&!Array.isArray(row.taxonomy.aliases))return null;
 for(const before of local.profiles){
  const after={...before,...e.edits};
  const stage=[['after',after],['before',before]].find(([,p])=>local.fieldKeys.every(k=>hipSameField(row,p,k)))?.[0];
  if(!stage)continue;
  if(Object.entries(e.taxonomy).some(([k,v])=>k!=='aliases'&&own(row.taxonomy,k)&&!hipSame(row.taxonomy[k],v)&&!(own(before.taxonomy,k)&&hipSame(row.taxonomy[k],before.taxonomy[k]))))continue;
  return {...e,before,stage};
 }
 return null;
}
export const HIP_AUDIT_FLAG='hipAudit20261024';
export const HIP_AUDIT_VERSION=2;
export function applyHipAudit(collection,{hipAuditContext:context,auditMetadata}={}){
 if(!collection||!Array.isArray(collection.tEx)||collection[HIP_AUDIT_FLAG]===HIP_AUDIT_VERSION||context?.version!==1||!auditMetadata)return collection;
 let changed=false;
 const tEx=collection.tEx.map(row=>{
  if(!own(auditMetadata,row.id))return row;
  const e=hipEntryFor(row,auditMetadata[row.id],context);if(!e||e.policy.viewOnly)return row;
  let next=row;
  for(const[k,v]of Object.entries(e.edits))if(hipSameField(row,e.before,k)&&!hipSameField(row,e.edits,k)){if(next===row)next={...row};next[k]=structuredClone(v);}
  const taxonomy={...next.taxonomy};
  for(const[k,v]of Object.entries(e.taxonomy)){
   if(k==='aliases'){taxonomy.aliases=[...new Set([...(taxonomy.aliases||[]),...v])];continue;}
   if(!own(taxonomy,k)||own(e.before.taxonomy,k)&&hipSame(taxonomy[k],e.before.taxonomy[k]))taxonomy[k]=structuredClone(v);
  }
  if(row.cz!==next.cz||row.en!==next.en)taxonomy.aliases=[...new Set([...(taxonomy.aliases||[]),...[row.cz,row.en].filter(x=>typeof x==='string')])];
  if(!hipSame(taxonomy,next.taxonomy))next={...next,taxonomy};
  changed ||= next!==row;return next;
 });
 return {...collection,...(changed?{tEx}:{}),[HIP_AUDIT_FLAG]:HIP_AUDIT_VERSION};
}
export function hipPolicyFor(row,meta,context){const e=hipEntryFor(row,meta,context);return e&&!e.policy.viewOnly?{...e.policy,stage:e.stage,auditKind:'hip'}:null;}
export function hipPolicyForBlock(row,meta,context,block){
 const p=hipPolicyFor(row,meta,context);if(!hipBlockCompatible(p,block))return null;
 return p;
}
export function hipSelectionAllowed(p,{equipment,explicitTarget=false}={}){if(!p)return true;if(p.unknown||p.explicitTarget&&!explicitTarget||!Array.isArray(equipment))return false;return matchesAvailableEquipment({requirements:p.requirements},equipment);}
export function hipEquipmentDecision(row,meta,context,equipment,explicitTarget){const p=hipPolicyFor(row,meta,context);return p?hipSelectionAllowed(p,{equipment,explicitTarget}):undefined;}
const resolvedPolicies=new WeakMap(),resolvedViews=new WeakMap();
export function attachHipPolicy(record,row,meta,context){const e=hipEntryFor(row,meta,context);if(!e){resolvedPolicies.delete(record);resolvedViews.delete(record);return record;}const view={...e.policy,stage:e.stage,auditKind:"hip"},out=view.familyOverride?{...record,familyId:view.familyOverride}:record;resolvedViews.set(out,view);if(!view.viewOnly)resolvedPolicies.set(out,view);else resolvedPolicies.delete(out);return out;}
export const resolvedHipPolicy=record=>record&&resolvedPolicies.get(record)||null;
export function hipResolvedRefusal(record,ctx){const p=resolvedHipPolicy(record);return p&&!hipSelectionAllowed(p,ctx)?{ok:false,why:p.unknown?'reviewed-setup-unspecified':p.explicitTarget&&!ctx?.explicitTarget?'reviewed-explicit-target':'reviewed-equipment'}:null;}
export function hipArtworkFor(row,meta,context){return hipEntryFor(row,meta,context)?.art||null;}

export function hipDeliveryStamp(record,payload){const p=resolvedViews.get(record),e=p&&HIP_AUDIT_ENTRIES[p.id];if(!e||p.stage!=='after')return undefined;const pair=Object.entries(e.deliveryProfiles||{}).find(([,v])=>Object.keys(v.fields).every(k=>hipSameField(payload,v.fields,k))&&(payload.progression===null||hipSame(payload.progression,v.progression)));return pair?{v:1,profile:pair[0]}:undefined;}
export function hipDeliveredViewPolicy(payload){const stamp=payload?.hipAudit,e=HIP_AUDIT_ENTRIES[payload?.id],profile=stamp?.v===1&&e?.deliveryProfiles?.[stamp.profile];return profile&&Object.keys(profile.fields).every(k=>hipSameField(payload,profile.fields,k))&&(payload.progression===null||hipSame(payload.progression,profile.progression))?{...e.policy,stage:'after',auditKind:'hip'}:null;}
export const hipDeliveredArtworkFor=payload=>hipDeliveredViewPolicy(payload)?HIP_AUDIT_ENTRIES[payload.id].art:null;


// Exercise overrides in a prescription opt out. Notes and dosing remain editable.
export function hipBlockCompatible(p,block){
 if(!p)return false;if(p.auditKind!=='hip')return true;
 if(block?.exId!==p.id||block.measurementType!==p.measurementType||!hipEmptyVariant(block.variant))return false;
 for(const k of ['loadMode','sideMode','allowEstimatedMax','allowAddedWeightRecord','allowComparableRecords','allowAutomaticProgression','manualProgression','manualWarmup','noAddedWeight','recordingPolicy','progressionPolicy','selectionPolicy','equipmentRequirements','equipment','requiresCoach','requiresEquipmentCheck','allowCopyCompletedAcrossSides','preserveSide','hipAuditPolicy','hipPrescription','lowerLegAuditPolicy','lowerLegPrescription','familyOverride','allowMotion','blockedMotionSources'])if(own(block,k)&&(!own(p,k)||!hipSame(block[k],p[k])))return false;
 return true;
}
export function hipEquipmentLabels(row,meta,context,language='cs'){
 if(!hipEntryFor(row,meta,context))return null;const en=language==='en';return exerciseEquipment(row).requirements.map(g=>g.map(id=>EXERCISE_EQUIPMENT.find(x=>x.id===id)?.[en?'en':'cz']||id).join(en?' or ':' nebo '));
}

export const resolvedHipDeliveryPolicy=record=>record&&resolvedViews.get(record)||null;
export function hipDeliveredPolicy(payload){const p=hipDeliveredViewPolicy(payload);return p&&!p.viewOnly?p:null;}

export function hipMotionAllowed(row,meta,context,motion){const p=hipPolicyFor(row,meta,context);return !p||!motion||!(p.blockedMotionSources||[]).includes(motion.src);}
