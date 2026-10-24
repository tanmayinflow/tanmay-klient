// Review proposal. Root installs this module together with its role-owned contexts.
import {matchesAvailableEquipment} from './exerciseEquipment.js';
import {COMPLEX_TASK_AUDIT_ENTRIES} from './catalogComplexTaskAuditData.js';
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o||{},k);
export function complexTaskSame(a,b){if(Object.is(a,b))return true;if(!a||!b||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)!==Array.isArray(b))return false;if(Array.isArray(a)&&a.length!==b.length)return false;const keys=Object.keys(a);return keys.length===Object.keys(b).length&&keys.every(k=>own(b,k)&&complexTaskSame(a[k],b[k]));}
export const complexTaskSameField=(a,b,k)=>own(a,k)===own(b,k)&&complexTaskSame(a?.[k],b?.[k]);
export const complexTaskEmptyVariant=v=>v==null||v===''||Array.isArray(v)&&v.length===0;
export function complexTaskEntryFor(row,metadata,context){
 if(!row||context?.version!==1||!['main','client'].includes(context.role))return null;
 const local=context.entries?.[row.id],e=COMPLEX_TASK_AUDIT_ENTRIES[row.id]||(context.role==='main'?local?.data:null);
 if(!e||!local||!complexTaskSame(metadata,local.metadata))return null;
 if(own(row,'taxonomy')&&(!row.taxonomy||typeof row.taxonomy!=='object'||Array.isArray(row.taxonomy)))return null;
 if(own(row.taxonomy,'aliases')&&!Array.isArray(row.taxonomy.aliases))return null;
 for(const before of local.profiles){
  const after={...before,...e.edits},stage=[['after',after],['before',before]].find(([,profile])=>local.fieldKeys.every(k=>complexTaskSameField(row,profile,k)))?.[0];if(!stage)continue;
  const beforeTax=before.taxonomy||{},afterTax={...beforeTax,...e.taxonomy},keys=[...new Set([...Object.keys(row.taxonomy||{}),...Object.keys(beforeTax),...Object.keys(afterTax)])].filter(k=>!['aliases','note'].includes(k));
  if(keys.some(k=>!complexTaskSameField(row.taxonomy,beforeTax,k)&&!complexTaskSameField(row.taxonomy,afterTax,k)))continue;
  return {...e,before,stage};
 }return null;
}
export const COMPLEX_TASK_AUDIT_FLAG='complexTaskAudit20261024',COMPLEX_TASK_AUDIT_VERSION=1;
export function applyComplexTaskAudit(collection,{complexTaskAuditContext:context,auditMetadata}={}){
 if(!collection||!Array.isArray(collection.tEx)||collection[COMPLEX_TASK_AUDIT_FLAG]===COMPLEX_TASK_AUDIT_VERSION||context?.version!==1||!auditMetadata)return collection;
 let changed=false;const tEx=collection.tEx.map(row=>{
  if(!own(auditMetadata,row.id))return row;const e=complexTaskEntryFor(row,auditMetadata[row.id],context);if(!e)return row;
  let next=row;for(const[k,v]of Object.entries(e.edits))if(complexTaskSameField(row,e.before,k)&&!complexTaskSameField(row,e.edits,k)){if(next===row)next={...row};next[k]=structuredClone(v);}
  const taxonomy={...next.taxonomy};for(const[k,v]of Object.entries(e.taxonomy)){if(k==='aliases'){taxonomy.aliases=[...new Set([...(taxonomy.aliases||[]),...v])];continue;}if(!own(taxonomy,k)||own(e.before.taxonomy,k)&&complexTaskSame(taxonomy[k],e.before.taxonomy[k]))taxonomy[k]=structuredClone(v);}
  if(row.cz!==next.cz||row.en!==next.en)taxonomy.aliases=[...new Set([...(taxonomy.aliases||[]),...[row.cz,row.en].filter(x=>typeof x==='string')])];if(!complexTaskSame(taxonomy,next.taxonomy))next={...next,taxonomy};changed ||= next!==row;return next;
 });return {...collection,...(changed?{tEx}:{}),[COMPLEX_TASK_AUDIT_FLAG]:COMPLEX_TASK_AUDIT_VERSION};
}
export function complexTaskPolicyFor(row,meta,context){const e=complexTaskEntryFor(row,meta,context);return e?{...e.policy,stage:e.stage,auditKind:'complexTask'}:null;}
const blockPolicyFields=["secondaryLoad","load","complexTaskAuditPolicy","complexTaskPrescription",'sideMeaning','sideNote','eq','pat','mode','load','jg','tier','sessionRole','sessionBlock','goalRole','genRule','precautions','pc','source','foc','pos','exe','wat','pro','equipmentDetail','loadMode','sideMode','allowEstimatedMax','allowAddedWeightRecord','allowComparableRecords','allowAutomaticProgression','manualProgression','manualWarmup','warmupPolicy','noAddedWeight','recordingPolicy','progressionPolicy','selectionPolicy','equipmentRequirements','equipment','requiresCoach','requiresEquipmentCheck','allowCopyCompletedAcrossSides','preserveSide','complexTaskAuditPolicy','complexTaskPrescription','positionHoldAuditPolicy','positionHoldPrescription','contextOverride','familyOverride','allowMotion','blockedMotionSources'];
export function complexTaskBlockCompatible(p,block){if(!p)return false;if(p.auditKind!=='complexTask')return true;if(block?.exId!==p.id||block.measurementType!==p.measurementType||!complexTaskEmptyVariant(block.variant))return false;return blockPolicyFields.every(k=>!own(block,k)||own(p,k)&&complexTaskSame(block[k],p[k]));}
export function complexTaskPolicyForBlock(row,meta,context,block){const p=complexTaskPolicyFor(row,meta,context);return complexTaskBlockCompatible(p,block)?p:null;}
export function complexTaskSelectionRefusal(p,ctx){
 if(!p)return null;const c=ctx||{};if(p.unknown)return{ok:false,why:'reviewed-setup-unspecified'};
 if(p.explicitTarget&&c.explicitTarget!==true)return{ok:false,why:'reviewed-explicit-target'};
 if(p.requiresCoach&&c.coachPresent!==true)return{ok:false,why:'requires-coach'};
 if(!Array.isArray(c.equipment)||!matchesAvailableEquipment({requirements:p.requirements},c.equipment))return{ok:false,why:'reviewed-equipment'};
 return null;
}
export const complexTaskSelectionAllowed=(p,ctx)=>!complexTaskSelectionRefusal(p,ctx);
// The equipment-only path does not confer explicit intent or supervised selection.
export function complexTaskEquipmentDecision(row,meta,context,equipment,explicitTarget){const p=complexTaskPolicyFor(row,meta,context);return p?(!p.unknown&&(!p.explicitTarget||explicitTarget===true)&&Array.isArray(equipment)&&matchesAvailableEquipment({requirements:p.requirements},equipment)):undefined;}
const resolvedPolicies=new WeakMap();
export function attachComplexTaskPolicy(record,row,meta,context){
 const p=complexTaskPolicyFor(row,meta,context);if(!p){resolvedPolicies.delete(record);return record;}
 // Trusted profile, never a deserialised row marker. Keep normal resolver status/alias gates.
 // Preserve the existing effective role, gate, rest, load and side semantics.
 // The reviewed source edits explicitly retain WEIGHT_REPS/ext where needed.
 if(record.measurementType!==p.measurementType||record.loadMode!==p.loadMode||record.sideMode!==p.sideMode)return record;
 resolvedPolicies.set(record,p);return record;
}
export const resolvedComplexTaskPolicy=record=>record&&resolvedPolicies.get(record)||null;
export const complexTaskResolvedRefusal=(record,ctx)=>complexTaskSelectionRefusal(resolvedComplexTaskPolicy(record),ctx);
export const complexTaskArtworkFor=(row,meta,context)=>complexTaskEntryFor(row,meta,context)?.art||null;
export const complexTaskEquipmentLabels=(row,meta,context,language='cs')=>{const e=complexTaskEntryFor(row,meta,context);return e?.equipmentLabels?[e.equipmentLabels[language==='en'?1:0]]:null;};
export const complexTaskLibraryOrderFor=(row,meta,context)=>complexTaskEntryFor(row,meta,context)?.libraryOrders||null;
export const complexTaskMotionAllowed=(row,meta,context,motion)=>{const p=complexTaskPolicyFor(row,meta,context);return !p||!motion||!(p.blockedMotionSources||[]).includes(motion.src);};
const deliveryOverrideFields=blockPolicyFields.filter(k=>!['eq','pat'].includes(k));
function deliveredProfile(payload){
 const stamp=payload?.complexTaskAudit,e=COMPLEX_TASK_AUDIT_ENTRIES[payload?.id],profile=stamp?.v===1&&e?.deliveryProfiles?.[stamp.profile];
 if(!profile||!Object.keys(profile.fields).every(k=>complexTaskSameField(payload,profile.fields,k))||!(payload.progression===null||complexTaskSame(payload.progression,profile.progression)))return null;
 if(payload.art!=null&&!complexTaskSame(payload.art,e.art))return null;
 if(deliveryOverrideFields.some(k=>own(payload,k)&&(!own(profile.fields,k)||!complexTaskSame(payload[k],profile.fields[k]))))return null;
 return e;
}
export function complexTaskDeliveryStamp(record,payload){
 const p=resolvedComplexTaskPolicy(record),e=p&&COMPLEX_TASK_AUDIT_ENTRIES[p.id];if(!e||p.stage!=='after')return undefined;
 for(const key of Object.keys(e.deliveryProfiles||{})){const stamp={v:1,profile:key};if(deliveredProfile({...payload,complexTaskAudit:stamp}))return stamp;}return undefined;
}
export function complexTaskDeliveredPolicy(payload){const e=deliveredProfile(payload);return e?{...e.policy,stage:'after',auditKind:'complexTask'}:null;}
export const complexTaskDeliveredArtworkFor=payload=>deliveredProfile(payload)?.art||null;
