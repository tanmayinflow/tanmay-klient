import {exerciseEquipment,EXERCISE_EQUIPMENT,matchesAvailableEquipment} from './exerciseEquipment.js';
import {SHOULDER_AUDIT_ENTRIES} from './catalogShoulderAuditData.js';
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o||{},k);
export function shoulderSame(a,b){if(Object.is(a,b))return true;if(!a||!b||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)!==Array.isArray(b))return false;if(Array.isArray(a)&&a.length!==b.length)return false;const keys=Object.keys(a);return keys.length===Object.keys(b).length&&keys.every(k=>own(b,k)&&shoulderSame(a[k],b[k]));}
export const shoulderSameField=(a,b,k)=>own(a,k)===own(b,k)&&shoulderSame(a?.[k],b?.[k]);
export const shoulderEmptyVariant=v=>v==null||v===''||Array.isArray(v)&&v.length===0;
export function shoulderEntryFor(row,metadata,context){
 if(!row||context?.version!==1||!['main','client'].includes(context.role))return null;
 const local=context.entries?.[row.id],e=SHOULDER_AUDIT_ENTRIES[row.id]||(context.role==='main'?local?.data:null);
 if(!e||!local||!(local.metadataAbsent?metadata==null:shoulderSame(metadata,local.metadata)))return null;
 if(own(row,'taxonomy')&&(!row.taxonomy||typeof row.taxonomy!=='object'||Array.isArray(row.taxonomy)))return null;
 if(own(row.taxonomy,'aliases')&&!Array.isArray(row.taxonomy.aliases))return null;
 for(const before of local.profiles){
  const after={...before,...e.edits};
  const stage=[['after',after],['before',before]].find(([,p])=>local.fieldKeys.every(k=>shoulderSameField(row,p,k)))?.[0];
  if(!stage)continue;
  const beforeTax=before.taxonomy||{},afterTax={...beforeTax,...e.taxonomy};const taxKeys=[...new Set([...Object.keys(row.taxonomy||{}),...Object.keys(beforeTax),...Object.keys(afterTax)])].filter(k=>k!=='aliases'&&k!=='note');
  if(taxKeys.some(k=>!shoulderSameField(row.taxonomy,beforeTax,k)&&!shoulderSameField(row.taxonomy,afterTax,k)))continue;
  return {...e,before,stage};
 }
 return null;
}
export const SHOULDER_AUDIT_FLAG='shoulderAudit20261024';
export const SHOULDER_AUDIT_VERSION=1;
export function applyShoulderAudit(collection,{shoulderAuditContext:context,auditMetadata}={}){
 if(!collection||!Array.isArray(collection.tEx)||collection[SHOULDER_AUDIT_FLAG]===SHOULDER_AUDIT_VERSION||context?.version!==1||!auditMetadata)return collection;
 let changed=false;
 const tEx=collection.tEx.map(row=>{
  if(!own(auditMetadata,row.id))return row;
  const e=shoulderEntryFor(row,auditMetadata[row.id],context);if(!e||e.policy.viewOnly)return row;
  let next=row;
  for(const[k,v]of Object.entries(e.edits))if(shoulderSameField(row,e.before,k)&&!shoulderSameField(row,e.edits,k)){if(next===row)next={...row};next[k]=structuredClone(v);}
  const taxonomy={...next.taxonomy};
  for(const[k,v]of Object.entries(e.taxonomy)){
   if(k==='aliases'){taxonomy.aliases=[...new Set([...(taxonomy.aliases||[]),...v])];continue;}
   if(!own(taxonomy,k)||own(e.before.taxonomy,k)&&shoulderSame(taxonomy[k],e.before.taxonomy[k]))taxonomy[k]=structuredClone(v);
  }
  if(row.cz!==next.cz||row.en!==next.en)taxonomy.aliases=[...new Set([...(taxonomy.aliases||[]),...[row.cz,row.en].filter(x=>typeof x==='string')])];
  if(!shoulderSame(taxonomy,next.taxonomy))next={...next,taxonomy};
  changed ||= next!==row;return next;
 });
 return {...collection,...(changed?{tEx}:{}),[SHOULDER_AUDIT_FLAG]:SHOULDER_AUDIT_VERSION};
}
export function shoulderPolicyFor(row,meta,context){const e=shoulderEntryFor(row,meta,context);return e&&!e.policy.viewOnly?{...e.policy,stage:e.stage,auditKind:'shoulder'}:null;}
export function shoulderPolicyForBlock(row,meta,context,block){
 const p=shoulderPolicyFor(row,meta,context);if(!shoulderBlockCompatible(p,block))return null;
 return p;
}
export function shoulderSelectionAllowed(p,{equipment,explicitTarget=false}={}){if(!p)return true;if(p.unknown||p.explicitTarget&&!explicitTarget||!Array.isArray(equipment))return false;return matchesAvailableEquipment({requirements:p.requirements},equipment);}
export function shoulderEquipmentDecision(row,meta,context,equipment,explicitTarget){const p=shoulderPolicyFor(row,meta,context);return p?shoulderSelectionAllowed(p,{equipment,explicitTarget}):undefined;}
const resolvedPolicies=new WeakMap(),resolvedViews=new WeakMap();
export function attachShoulderPolicy(record,row,meta,context){const e=shoulderEntryFor(row,meta,context);if(!e){resolvedPolicies.delete(record);resolvedViews.delete(record);return record;}const view={...e.policy,stage:e.stage,auditKind:"shoulder"},out=view.familyOverride?Object.assign(record,{familyId:view.familyOverride}):record;resolvedViews.set(out,view);if(!view.viewOnly)resolvedPolicies.set(out,view);else resolvedPolicies.delete(out);return out;}
export const resolvedShoulderPolicy=record=>record&&resolvedPolicies.get(record)||null;
export function shoulderResolvedRefusal(record,ctx){const p=resolvedShoulderPolicy(record);return p&&!shoulderSelectionAllowed(p,ctx)?{ok:false,why:p.unknown?'reviewed-setup-unspecified':p.explicitTarget&&!ctx?.explicitTarget?'reviewed-explicit-target':'reviewed-equipment'}:null;}
export function shoulderArtworkFor(row,meta,context){return shoulderEntryFor(row,meta,context)?.art||null;}

export function shoulderDeliveryStamp(record,payload){const p=resolvedViews.get(record),e=p&&SHOULDER_AUDIT_ENTRIES[p.id];if(!e||p.stage!=='after')return undefined;const pair=Object.entries(e.deliveryProfiles||{}).find(([,v])=>Object.keys(v.fields).every(k=>shoulderSameField(payload,v.fields,k))&&(payload.progression===null||shoulderSame(payload.progression,v.progression)));return pair?{v:1,profile:pair[0]}:undefined;}
export function shoulderDeliveredViewPolicy(payload){const stamp=payload?.shoulderAudit,e=SHOULDER_AUDIT_ENTRIES[payload?.id],profile=stamp?.v===1&&e?.deliveryProfiles?.[stamp.profile];return profile&&Object.keys(profile.fields).every(k=>shoulderSameField(payload,profile.fields,k))&&(payload.progression===null||shoulderSame(payload.progression,profile.progression))?{...e.policy,stage:'after',auditKind:'shoulder'}:null;}
export const shoulderDeliveredArtworkFor=payload=>shoulderDeliveredViewPolicy(payload)?SHOULDER_AUDIT_ENTRIES[payload.id].art:null;


// Exercise overrides in a prescription opt out. Notes and dosing remain editable.
export function shoulderBlockCompatible(p,block){
 if(!p)return false;if(p.auditKind!=='shoulder')return true;
 if(block?.exId!==p.id||block.measurementType!==p.measurementType||!shoulderEmptyVariant(block.variant))return false;
 for(const k of ['loadMode','sideMode','allowEstimatedMax','allowAddedWeightRecord','allowComparableRecords','allowAutomaticProgression','manualProgression','manualWarmup','noAddedWeight','recordingPolicy','progressionPolicy','selectionPolicy','equipmentRequirements','equipment','requiresCoach','requiresEquipmentCheck','allowCopyCompletedAcrossSides','preserveSide','shoulderAuditPolicy','shoulderPrescription','hipAuditPolicy','hipPrescription','lowerLegAuditPolicy','lowerLegPrescription','familyOverride','allowMotion','blockedMotionSources'])if(own(block,k)&&(!own(p,k)||!shoulderSame(block[k],p[k])))return false;
 return true;
}
export function shoulderEquipmentLabels(row,meta,context,language='cs'){
 if(!shoulderEntryFor(row,meta,context))return null;const en=language==='en';return exerciseEquipment(row).requirements.map(g=>g.map(id=>EXERCISE_EQUIPMENT.find(x=>x.id===id)?.[en?'en':'cz']||id).join(en?' or ':' nebo '));
}

export const resolvedShoulderDeliveryPolicy=record=>record&&resolvedViews.get(record)||null;
export function shoulderDeliveredPolicy(payload){const p=shoulderDeliveredViewPolicy(payload);return p&&!p.viewOnly?p:null;}

export function shoulderMotionAllowed(row,meta,context,motion){const p=shoulderEntryFor(row,meta,context)?.policy;return !p||!motion||!(p.blockedMotionSources||[]).includes(motion.src);}

export function shoulderViewPolicyFor(row,meta,context){const e=shoulderEntryFor(row,meta,context);return e?{...e.policy,stage:e.stage,auditKind:'shoulder'}:null;}

export function shoulderLibraryOrderFor(row,meta,context){const e=shoulderEntryFor(row,meta,context);return Number.isInteger(e?.libraryOrder)?e.libraryOrder:null;}
