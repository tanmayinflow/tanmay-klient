// Review proposal. Root installs this module together with its role-owned contexts.
import {matchesAvailableEquipment} from './exerciseEquipment.js';
import {THROW_AUDIT_ENTRIES} from './catalogThrowAuditData.js';
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o||{},k);
export function throwSame(a,b){if(Object.is(a,b))return true;if(!a||!b||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)!==Array.isArray(b))return false;if(Array.isArray(a)&&a.length!==b.length)return false;const keys=Object.keys(a);return keys.length===Object.keys(b).length&&keys.every(k=>own(b,k)&&throwSame(a[k],b[k]));}
export const throwSameField=(a,b,k)=>own(a,k)===own(b,k)&&throwSame(a?.[k],b?.[k]);
export const throwEmptyVariant=v=>v==null||v===''||Array.isArray(v)&&v.length===0;
export function throwEntryFor(row,metadata,context){
 if(!row||context?.version!==1||!['main','client'].includes(context.role))return null;
 const local=context.entries?.[row.id],e=THROW_AUDIT_ENTRIES[row.id]||(context.role==='main'?local?.data:null);
 if(!e||!local||!throwSame(metadata,local.metadata))return null;
 if(own(row,'taxonomy')&&(!row.taxonomy||typeof row.taxonomy!=='object'||Array.isArray(row.taxonomy)))return null;
 if(own(row.taxonomy,'aliases')&&!Array.isArray(row.taxonomy.aliases))return null;
 for(const before of local.profiles){
  const after={...before,...e.edits},stage=[['after',after],['before',before]].find(([,profile])=>local.fieldKeys.every(k=>throwSameField(row,profile,k)))?.[0];if(!stage)continue;
  const beforeTax=before.taxonomy||{},afterTax={...beforeTax,...e.taxonomy},keys=[...new Set([...Object.keys(row.taxonomy||{}),...Object.keys(beforeTax),...Object.keys(afterTax)])].filter(k=>!['aliases','note'].includes(k));
  if(keys.some(k=>!throwSameField(row.taxonomy,beforeTax,k)&&!throwSameField(row.taxonomy,afterTax,k)))continue;
  return {...e,before,stage};
 }return null;
}
export const THROW_AUDIT_FLAG='throwAudit20261024',THROW_AUDIT_VERSION=1;
export function applyThrowAudit(collection,{throwAuditContext:context,auditMetadata}={}){
 if(!collection||!Array.isArray(collection.tEx)||collection[THROW_AUDIT_FLAG]===THROW_AUDIT_VERSION||context?.version!==1||!auditMetadata)return collection;
 let changed=false;const tEx=collection.tEx.map(row=>{
  if(!own(auditMetadata,row.id))return row;const e=throwEntryFor(row,auditMetadata[row.id],context);if(!e)return row;
  let next=row;for(const[k,v]of Object.entries(e.edits))if(throwSameField(row,e.before,k)&&!throwSameField(row,e.edits,k)){if(next===row)next={...row};next[k]=structuredClone(v);}
  const taxonomy={...next.taxonomy};for(const[k,v]of Object.entries(e.taxonomy)){if(k==='aliases'){taxonomy.aliases=[...new Set([...(taxonomy.aliases||[]),...v])];continue;}if(!own(taxonomy,k)||own(e.before.taxonomy,k)&&throwSame(taxonomy[k],e.before.taxonomy[k]))taxonomy[k]=structuredClone(v);}
  if(row.cz!==next.cz||row.en!==next.en)taxonomy.aliases=[...new Set([...(taxonomy.aliases||[]),...[row.cz,row.en].filter(x=>typeof x==='string')])];if(!throwSame(taxonomy,next.taxonomy))next={...next,taxonomy};changed ||= next!==row;return next;
 });return {...collection,...(changed?{tEx}:{}),[THROW_AUDIT_FLAG]:THROW_AUDIT_VERSION};
}
export function throwPolicyFor(row,meta,context){const e=throwEntryFor(row,meta,context);return e?{...e.policy,stage:e.stage,auditKind:'throw'}:null;}
const blockPolicyFields=['sideMeaning','sideNote','eq','pat','mode','load','jg','tier','sessionRole','sessionBlock','goalRole','genRule','precautions','pc','source','foc','pos','exe','wat','pro','equipmentDetail','loadMode','sideMode','allowEstimatedMax','allowAddedWeightRecord','allowComparableRecords','allowAutomaticProgression','manualProgression','manualWarmup','warmupPolicy','noAddedWeight','recordingPolicy','progressionPolicy','selectionPolicy','equipmentRequirements','equipment','requiresCoach','requiresEquipmentCheck','allowCopyCompletedAcrossSides','preserveSide','throwAuditPolicy','throwPrescription','positionHoldAuditPolicy','positionHoldPrescription','contextOverride','familyOverride','allowMotion','blockedMotionSources'];
export function throwBlockCompatible(p,block){if(!p)return false;if(p.auditKind!=='throw')return true;if(block?.exId!==p.id||block.measurementType!==p.measurementType||!throwEmptyVariant(block.variant))return false;return blockPolicyFields.every(k=>!own(block,k)||own(p,k)&&throwSame(block[k],p[k]));}
export function throwPolicyForBlock(row,meta,context,block){const p=throwPolicyFor(row,meta,context);return throwBlockCompatible(p,block)?p:null;}
export function throwSelectionRefusal(p,ctx){
 if(!p)return null;const c=ctx||{};if(p.unknown)return{ok:false,why:'reviewed-setup-unspecified'};
 if(p.explicitTarget&&c.explicitTarget!==true)return{ok:false,why:'reviewed-explicit-target'};
 if(p.requiresCoach&&c.coachPresent!==true)return{ok:false,why:'requires-coach'};
 if(!Array.isArray(c.equipment)||!matchesAvailableEquipment({requirements:p.requirements},c.equipment))return{ok:false,why:'reviewed-equipment'};
 return null;
}
export const throwSelectionAllowed=(p,ctx)=>!throwSelectionRefusal(p,ctx);
// This equipment-only path does not confer breath opt-in or supervised selection.
export function throwEquipmentDecision(row,meta,context,equipment,explicitTarget){const p=throwPolicyFor(row,meta,context);return p?(!p.unknown&&(!p.explicitTarget||explicitTarget===true)&&Array.isArray(equipment)&&matchesAvailableEquipment({requirements:p.requirements},equipment)):undefined;}
const resolvedPolicies=new WeakMap();
export function attachThrowPolicy(record,row,meta,context){
 const p=throwPolicyFor(row,meta,context);if(!p){resolvedPolicies.delete(record);return record;}
 // Trusted profile, never a deserialised row marker. Keep normal resolver status/alias gates.
 // Preserve the existing effective role, gate, rest, load and side semantics.
 // The reviewed source edits explicitly retain WEIGHT_REPS/ext where needed.
 if(record.measurementType!==p.measurementType||record.loadMode!==p.loadMode||record.sideMode!==p.sideMode)return record;
 resolvedPolicies.set(record,p);return record;
}
export const resolvedThrowPolicy=record=>record&&resolvedPolicies.get(record)||null;
export const throwResolvedRefusal=(record,ctx)=>throwSelectionRefusal(resolvedThrowPolicy(record),ctx);
export const throwArtworkFor=(row,meta,context)=>throwEntryFor(row,meta,context)?.art||null;
export const throwEquipmentLabels=(row,meta,context,language='cs')=>{const e=throwEntryFor(row,meta,context);return e?.equipmentLabels?[e.equipmentLabels[language==='en'?1:0]]:null;};
export const throwLibraryOrderFor=(row,meta,context)=>{const e=throwEntryFor(row,meta,context);return Number.isInteger(e?.libraryOrder)?e.libraryOrder:null;};
export const throwMotionAllowed=(row,meta,context,motion)=>{const p=throwPolicyFor(row,meta,context);return !p||!motion||!(p.blockedMotionSources||[]).includes(motion.src);};
const deliveryOverrideFields=blockPolicyFields.filter(k=>!['eq','pat'].includes(k));
function deliveredProfile(payload){
 const stamp=payload?.throwAudit,e=THROW_AUDIT_ENTRIES[payload?.id],profile=stamp?.v===1&&e?.deliveryProfiles?.[stamp.profile];
 if(!profile||!Object.keys(profile.fields).every(k=>throwSameField(payload,profile.fields,k))||!(payload.progression===null||throwSame(payload.progression,profile.progression)))return null;
 if(payload.art!=null&&!throwSame(payload.art,e.art))return null;
 if(deliveryOverrideFields.some(k=>own(payload,k)&&(!own(profile.fields,k)||!throwSame(payload[k],profile.fields[k]))))return null;
 return e;
}
export function throwDeliveryStamp(record,payload){
 const p=resolvedThrowPolicy(record),e=p&&THROW_AUDIT_ENTRIES[p.id];if(!e||p.stage!=='after')return undefined;
 for(const key of Object.keys(e.deliveryProfiles||{})){const stamp={v:1,profile:key};if(deliveredProfile({...payload,throwAudit:stamp}))return stamp;}return undefined;
}
export function throwDeliveredPolicy(payload){const e=deliveredProfile(payload);return e?{...e.policy,stage:'after',auditKind:'throw'}:null;}
export const throwDeliveredArtworkFor=payload=>deliveredProfile(payload)?.art||null;
