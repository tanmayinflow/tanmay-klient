import {exerciseEquipment,EXERCISE_EQUIPMENT,matchesAvailableEquipment} from './exerciseEquipment.js';
import {POSITION_HOLD_AUDIT_ENTRIES} from './catalogPositionHoldAuditData.js';
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o||{},k);
export function positionHoldSame(a,b){if(Object.is(a,b))return true;if(!a||!b||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)!==Array.isArray(b))return false;if(Array.isArray(a)&&a.length!==b.length)return false;const keys=Object.keys(a);return keys.length===Object.keys(b).length&&keys.every(k=>own(b,k)&&positionHoldSame(a[k],b[k]));}
export const positionHoldSameField=(a,b,k)=>own(a,k)===own(b,k)&&positionHoldSame(a?.[k],b?.[k]);
export const positionHoldEmptyVariant=v=>v==null||v===''||Array.isArray(v)&&v.length===0;
export function positionHoldEntryFor(row,metadata,context){
 if(!row||context?.version!==1||!['main','client'].includes(context.role))return null;
 const local=context.entries?.[row.id],e=POSITION_HOLD_AUDIT_ENTRIES[row.id]||(context.role==='main'?local?.data:null);
 if(!e||!local||!(local.metadataAbsent?metadata==null:positionHoldSame(metadata,local.metadata)))return null;
 if(own(row,'taxonomy')&&(!row.taxonomy||typeof row.taxonomy!=='object'||Array.isArray(row.taxonomy)))return null;
 if(own(row.taxonomy,'aliases')&&!Array.isArray(row.taxonomy.aliases))return null;
 for(const before of local.profiles){
  const after={...before,...e.edits};
  const stage=[['after',after],['before',before]].find(([,p])=>local.fieldKeys.every(k=>positionHoldSameField(row,p,k)))?.[0];
  if(!stage)continue;
  const beforeTax=before.taxonomy||{},afterTax={...beforeTax,...e.taxonomy};const taxKeys=[...new Set([...Object.keys(row.taxonomy||{}),...Object.keys(beforeTax),...Object.keys(afterTax)])].filter(k=>k!=='aliases'&&k!=='note');
  if(taxKeys.some(k=>!positionHoldSameField(row.taxonomy,beforeTax,k)&&!positionHoldSameField(row.taxonomy,afterTax,k)))continue;
  return {...e,before,stage};
 }
 return null;
}
export const POSITION_HOLD_AUDIT_FLAG='positionHoldAudit20261024';
export const POSITION_HOLD_AUDIT_VERSION=1;
export function applyPositionHoldAudit(collection,{positionHoldAuditContext:context,auditMetadata}={}){
 if(!collection||!Array.isArray(collection.tEx)||collection[POSITION_HOLD_AUDIT_FLAG]===POSITION_HOLD_AUDIT_VERSION||context?.version!==1||!auditMetadata)return collection;
 let changed=false;
 const tEx=collection.tEx.map(row=>{
  if(!own(auditMetadata,row.id))return row;
  const e=positionHoldEntryFor(row,auditMetadata[row.id],context);if(!e||e.policy.viewOnly)return row;
  let next=row;
  for(const[k,v]of Object.entries(e.edits))if(positionHoldSameField(row,e.before,k)&&!positionHoldSameField(row,e.edits,k)){if(next===row)next={...row};next[k]=structuredClone(v);}
  const taxonomy={...next.taxonomy};
  for(const[k,v]of Object.entries(e.taxonomy)){
   if(k==='aliases'){taxonomy.aliases=[...new Set([...(taxonomy.aliases||[]),...v])];continue;}
   if(!own(taxonomy,k)||own(e.before.taxonomy,k)&&positionHoldSame(taxonomy[k],e.before.taxonomy[k]))taxonomy[k]=structuredClone(v);
  }
  if(row.cz!==next.cz||row.en!==next.en)taxonomy.aliases=[...new Set([...(taxonomy.aliases||[]),...[row.cz,row.en].filter(x=>typeof x==='string')])];
  if(!positionHoldSame(taxonomy,next.taxonomy))next={...next,taxonomy};
  changed ||= next!==row;return next;
 });
 return {...collection,...(changed?{tEx}:{}),[POSITION_HOLD_AUDIT_FLAG]:POSITION_HOLD_AUDIT_VERSION};
}
export function positionHoldPolicyFor(row,meta,context){const e=positionHoldEntryFor(row,meta,context);return e&&!e.policy.viewOnly?{...e.policy,stage:e.stage,auditKind:'positionHold'}:null;}
export function positionHoldPolicyForBlock(row,meta,context,block){
 const p=positionHoldPolicyFor(row,meta,context);if(!positionHoldBlockCompatible(p,block))return null;
 return p;
}
export function positionHoldSelectionAllowed(p,{equipment,explicitTarget=false}={}){if(!p)return true;if(p.unknown||p.explicitTarget&&!explicitTarget||!Array.isArray(equipment))return false;return matchesAvailableEquipment({requirements:p.requirements},equipment);}
export function positionHoldEquipmentDecision(row,meta,context,equipment,explicitTarget){const p=positionHoldPolicyFor(row,meta,context);return p?positionHoldSelectionAllowed(p,{equipment,explicitTarget}):undefined;}
const resolvedPolicies=new WeakMap(),resolvedViews=new WeakMap();
export function attachPositionHoldPolicy(record,row,meta,context){const e=positionHoldEntryFor(row,meta,context);if(!e){resolvedPolicies.delete(record);resolvedViews.delete(record);return record;}const view={...e.policy,stage:e.stage,auditKind:"positionHold"},out=view.familyOverride?Object.assign(record,{familyId:view.familyOverride}):record;resolvedViews.set(out,view);if(!view.viewOnly)resolvedPolicies.set(out,view);else resolvedPolicies.delete(out);return out;}
export const resolvedPositionHoldPolicy=record=>record&&resolvedPolicies.get(record)||null;
export function positionHoldResolvedRefusal(record,ctx){const p=resolvedPositionHoldPolicy(record);return p&&!positionHoldSelectionAllowed(p,ctx)?{ok:false,why:p.unknown?'reviewed-setup-unspecified':p.explicitTarget&&!ctx?.explicitTarget?'reviewed-explicit-target':'reviewed-equipment'}:null;}
export function positionHoldArtworkFor(row,meta,context){return positionHoldEntryFor(row,meta,context)?.art||null;}

export function positionHoldDeliveryStamp(record,payload){const p=resolvedViews.get(record),e=p&&POSITION_HOLD_AUDIT_ENTRIES[p.id];if(!e||p.stage!=='after')return undefined;const pair=Object.entries(e.deliveryProfiles||{}).find(([,v])=>Object.keys(v.fields).every(k=>positionHoldSameField(payload,v.fields,k))&&(payload.progression===null||positionHoldSame(payload.progression,v.progression)));return pair?{v:1,profile:pair[0]}:undefined;}
export function positionHoldDeliveredViewPolicy(payload){const stamp=payload?.positionHoldAudit,e=POSITION_HOLD_AUDIT_ENTRIES[payload?.id],profile=stamp?.v===1&&e?.deliveryProfiles?.[stamp.profile];return profile&&Object.keys(profile.fields).every(k=>positionHoldSameField(payload,profile.fields,k))&&(payload.progression===null||positionHoldSame(payload.progression,profile.progression))?{...e.policy,stage:'after',auditKind:'positionHold'}:null;}
export const positionHoldDeliveredArtworkFor=payload=>positionHoldDeliveredViewPolicy(payload)?POSITION_HOLD_AUDIT_ENTRIES[payload.id].art:null;


// Exercise overrides in a prescription opt out. Notes and dosing remain editable.
export function positionHoldBlockCompatible(p,block){
 if(!p)return false;if(p.auditKind!=='positionHold')return true;
 if(block?.exId!==p.id||block.measurementType!==p.measurementType||!positionHoldEmptyVariant(block.variant))return false;
 for(const k of ['loadMode','sideMode','allowEstimatedMax','allowAddedWeightRecord','allowComparableRecords','allowAutomaticProgression','manualProgression','manualWarmup','noAddedWeight','recordingPolicy','progressionPolicy','selectionPolicy','equipmentRequirements','equipment','requiresCoach','requiresEquipmentCheck','allowCopyCompletedAcrossSides','preserveSide','positionHoldAuditPolicy','positionHoldPrescription','elbowHandAuditPolicy','elbowHandPrescription','shoulderAuditPolicy','shoulderPrescription','hipAuditPolicy','hipPrescription','lowerLegAuditPolicy','lowerLegPrescription','familyOverride','contextOverride','allowMotion','blockedMotionSources'])if(own(block,k)&&(!own(p,k)||!positionHoldSame(block[k],p[k])))return false;
 return true;
}
export function positionHoldEquipmentLabels(row,meta,context,language='cs'){
 if(!positionHoldEntryFor(row,meta,context))return null;const en=language==='en';return exerciseEquipment(row).requirements.map(g=>g.map(id=>EXERCISE_EQUIPMENT.find(x=>x.id===id)?.[en?'en':'cz']||id).join(en?' or ':' nebo '));
}

export const resolvedPositionHoldDeliveryPolicy=record=>record&&resolvedViews.get(record)||null;
export function positionHoldDeliveredPolicy(payload){const p=positionHoldDeliveredViewPolicy(payload);return p&&!p.viewOnly?p:null;}

export function positionHoldMotionAllowed(row,meta,context,motion){const p=positionHoldEntryFor(row,meta,context)?.policy;return !p||!motion||!(p.blockedMotionSources||[]).includes(motion.src);}

export function positionHoldViewPolicyFor(row,meta,context){const e=positionHoldEntryFor(row,meta,context);return e?{...e.policy,stage:e.stage,auditKind:'positionHold'}:null;}

export function positionHoldLibraryOrderFor(row,meta,context){const e=positionHoldEntryFor(row,meta,context);return Number.isInteger(e?.libraryOrder)?e.libraryOrder:null;}

// Read-only visibility of already stored sides. No default or side inference.
export function positionHoldStoredSide(policy,set){
 return policy?.auditKind==='positionHold'&&policy.id==='frontsplit'&&policy.sideMode==='none'&&own(set,'side')&&['L','R'].includes(set.side)?set.side:null;
}
