import {exerciseEquipment,EXERCISE_EQUIPMENT,matchesAvailableEquipment} from './exerciseEquipment.js';
import {ELBOW_HAND_AUDIT_ENTRIES} from './catalogElbowHandAuditData.js';
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o||{},k);
export function elbowHandSame(a,b){if(Object.is(a,b))return true;if(!a||!b||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)!==Array.isArray(b))return false;if(Array.isArray(a)&&a.length!==b.length)return false;const keys=Object.keys(a);return keys.length===Object.keys(b).length&&keys.every(k=>own(b,k)&&elbowHandSame(a[k],b[k]));}
export const elbowHandSameField=(a,b,k)=>own(a,k)===own(b,k)&&elbowHandSame(a?.[k],b?.[k]);
export const elbowHandEmptyVariant=v=>v==null||v===''||Array.isArray(v)&&v.length===0;
export function elbowHandEntryFor(row,metadata,context){
 if(!row||context?.version!==1||!['main','client'].includes(context.role))return null;
 const local=context.entries?.[row.id],e=ELBOW_HAND_AUDIT_ENTRIES[row.id]||(context.role==='main'?local?.data:null);
 if(!e||!local||!(local.metadataAbsent?metadata==null:elbowHandSame(metadata,local.metadata)))return null;
 if(own(row,'taxonomy')&&(!row.taxonomy||typeof row.taxonomy!=='object'||Array.isArray(row.taxonomy)))return null;
 if(own(row.taxonomy,'aliases')&&!Array.isArray(row.taxonomy.aliases))return null;
 for(const before of local.profiles){
  const after={...before,...e.edits};
  const stage=[['after',after],['before',before]].find(([,p])=>local.fieldKeys.every(k=>elbowHandSameField(row,p,k)))?.[0];
  if(!stage)continue;
  const beforeTax=before.taxonomy||{},afterTax={...beforeTax,...e.taxonomy};const taxKeys=[...new Set([...Object.keys(row.taxonomy||{}),...Object.keys(beforeTax),...Object.keys(afterTax)])].filter(k=>k!=='aliases'&&k!=='note');
  if(taxKeys.some(k=>!elbowHandSameField(row.taxonomy,beforeTax,k)&&!elbowHandSameField(row.taxonomy,afterTax,k)))continue;
  return {...e,before,stage};
 }
 return null;
}
export const ELBOW_HAND_AUDIT_FLAG='elbowHandAudit20261024';
export const ELBOW_HAND_AUDIT_VERSION=1;
export function applyElbowHandAudit(collection,{elbowHandAuditContext:context,auditMetadata}={}){
 if(!collection||!Array.isArray(collection.tEx)||collection[ELBOW_HAND_AUDIT_FLAG]===ELBOW_HAND_AUDIT_VERSION||context?.version!==1||!auditMetadata)return collection;
 let changed=false;
 const tEx=collection.tEx.map(row=>{
  if(!own(auditMetadata,row.id))return row;
  const e=elbowHandEntryFor(row,auditMetadata[row.id],context);if(!e||e.policy.viewOnly)return row;
  let next=row;
  for(const[k,v]of Object.entries(e.edits))if(elbowHandSameField(row,e.before,k)&&!elbowHandSameField(row,e.edits,k)){if(next===row)next={...row};next[k]=structuredClone(v);}
  const taxonomy={...next.taxonomy};
  for(const[k,v]of Object.entries(e.taxonomy)){
   if(k==='aliases'){taxonomy.aliases=[...new Set([...(taxonomy.aliases||[]),...v])];continue;}
   if(!own(taxonomy,k)||own(e.before.taxonomy,k)&&elbowHandSame(taxonomy[k],e.before.taxonomy[k]))taxonomy[k]=structuredClone(v);
  }
  if(row.cz!==next.cz||row.en!==next.en)taxonomy.aliases=[...new Set([...(taxonomy.aliases||[]),...[row.cz,row.en].filter(x=>typeof x==='string')])];
  if(!elbowHandSame(taxonomy,next.taxonomy))next={...next,taxonomy};
  changed ||= next!==row;return next;
 });
 return {...collection,...(changed?{tEx}:{}),[ELBOW_HAND_AUDIT_FLAG]:ELBOW_HAND_AUDIT_VERSION};
}
export function elbowHandPolicyFor(row,meta,context){const e=elbowHandEntryFor(row,meta,context);return e&&!e.policy.viewOnly?{...e.policy,stage:e.stage,auditKind:'elbowHand'}:null;}
export function elbowHandPolicyForBlock(row,meta,context,block){
 const p=elbowHandPolicyFor(row,meta,context);if(!elbowHandBlockCompatible(p,block))return null;
 return p;
}
export function elbowHandSelectionAllowed(p,{equipment,explicitTarget=false}={}){if(!p)return true;if(p.unknown||p.explicitTarget&&!explicitTarget||!Array.isArray(equipment))return false;return matchesAvailableEquipment({requirements:p.requirements},equipment);}
export function elbowHandEquipmentDecision(row,meta,context,equipment,explicitTarget){const p=elbowHandPolicyFor(row,meta,context);return p?elbowHandSelectionAllowed(p,{equipment,explicitTarget}):undefined;}
const resolvedPolicies=new WeakMap(),resolvedViews=new WeakMap();
export function attachElbowHandPolicy(record,row,meta,context){const e=elbowHandEntryFor(row,meta,context);if(!e){resolvedPolicies.delete(record);resolvedViews.delete(record);return record;}const view={...e.policy,stage:e.stage,auditKind:"elbowHand"},out=view.familyOverride?Object.assign(record,{familyId:view.familyOverride}):record;resolvedViews.set(out,view);if(!view.viewOnly)resolvedPolicies.set(out,view);else resolvedPolicies.delete(out);return out;}
export const resolvedElbowHandPolicy=record=>record&&resolvedPolicies.get(record)||null;
export function elbowHandResolvedRefusal(record,ctx){const p=resolvedElbowHandPolicy(record);return p&&!elbowHandSelectionAllowed(p,ctx)?{ok:false,why:p.unknown?'reviewed-setup-unspecified':p.explicitTarget&&!ctx?.explicitTarget?'reviewed-explicit-target':'reviewed-equipment'}:null;}
export function elbowHandArtworkFor(row,meta,context){return elbowHandEntryFor(row,meta,context)?.art||null;}

export function elbowHandDeliveryStamp(record,payload){const p=resolvedViews.get(record),e=p&&ELBOW_HAND_AUDIT_ENTRIES[p.id];if(!e||p.stage!=='after')return undefined;const pair=Object.entries(e.deliveryProfiles||{}).find(([,v])=>Object.keys(v.fields).every(k=>elbowHandSameField(payload,v.fields,k))&&(payload.progression===null||elbowHandSame(payload.progression,v.progression)));return pair?{v:1,profile:pair[0]}:undefined;}
export function elbowHandDeliveredViewPolicy(payload){const stamp=payload?.elbowHandAudit,e=ELBOW_HAND_AUDIT_ENTRIES[payload?.id],profile=stamp?.v===1&&e?.deliveryProfiles?.[stamp.profile];return profile&&Object.keys(profile.fields).every(k=>elbowHandSameField(payload,profile.fields,k))&&(payload.progression===null||elbowHandSame(payload.progression,profile.progression))?{...e.policy,stage:'after',auditKind:'elbowHand'}:null;}
export const elbowHandDeliveredArtworkFor=payload=>elbowHandDeliveredViewPolicy(payload)?ELBOW_HAND_AUDIT_ENTRIES[payload.id].art:null;


// Exercise overrides in a prescription opt out. Notes and dosing remain editable.
export function elbowHandBlockCompatible(p,block){
 if(!p)return false;if(p.auditKind!=='elbowHand')return true;
 if(block?.exId!==p.id||block.measurementType!==p.measurementType||!elbowHandEmptyVariant(block.variant))return false;
 for(const k of ['loadMode','sideMode','allowEstimatedMax','allowAddedWeightRecord','allowComparableRecords','allowAutomaticProgression','manualProgression','manualWarmup','noAddedWeight','recordingPolicy','progressionPolicy','selectionPolicy','equipmentRequirements','equipment','requiresCoach','requiresEquipmentCheck','allowCopyCompletedAcrossSides','preserveSide','elbowHandAuditPolicy','elbowHandPrescription','shoulderAuditPolicy','shoulderPrescription','hipAuditPolicy','hipPrescription','lowerLegAuditPolicy','lowerLegPrescription','familyOverride','allowMotion','blockedMotionSources'])if(own(block,k)&&(!own(p,k)||!elbowHandSame(block[k],p[k])))return false;
 return true;
}
export function elbowHandEquipmentLabels(row,meta,context,language='cs'){
 if(!elbowHandEntryFor(row,meta,context))return null;const en=language==='en';return exerciseEquipment(row).requirements.map(g=>g.map(id=>EXERCISE_EQUIPMENT.find(x=>x.id===id)?.[en?'en':'cz']||id).join(en?' or ':' nebo '));
}

export const resolvedElbowHandDeliveryPolicy=record=>record&&resolvedViews.get(record)||null;
export function elbowHandDeliveredPolicy(payload){const p=elbowHandDeliveredViewPolicy(payload);return p&&!p.viewOnly?p:null;}

export function elbowHandMotionAllowed(row,meta,context,motion){const p=elbowHandEntryFor(row,meta,context)?.policy;return !p||!motion||!(p.blockedMotionSources||[]).includes(motion.src);}

export function elbowHandViewPolicyFor(row,meta,context){const e=elbowHandEntryFor(row,meta,context);return e?{...e.policy,stage:e.stage,auditKind:'elbowHand'}:null;}

export function elbowHandLibraryOrderFor(row,meta,context){const e=elbowHandEntryFor(row,meta,context);return Number.isInteger(e?.libraryOrder)?e.libraryOrder:null;}
