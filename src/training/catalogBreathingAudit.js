// Review proposal. Root installs this module together with its role-owned contexts.
import {matchesAvailableEquipment} from './exerciseEquipment.js';
import {BREATHING_AUDIT_ENTRIES} from './catalogBreathingAuditData.js';
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o||{},k);
export function breathingSame(a,b){if(Object.is(a,b))return true;if(!a||!b||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)!==Array.isArray(b))return false;if(Array.isArray(a)&&a.length!==b.length)return false;const keys=Object.keys(a);return keys.length===Object.keys(b).length&&keys.every(k=>own(b,k)&&breathingSame(a[k],b[k]));}
export const breathingSameField=(a,b,k)=>own(a,k)===own(b,k)&&breathingSame(a?.[k],b?.[k]);
export const breathingEmptyVariant=v=>v==null||v===''||Array.isArray(v)&&v.length===0;
export function breathingEntryFor(row,metadata,context){
 if(!row||context?.version!==1||!['main','client'].includes(context.role))return null;
 const local=context.entries?.[row.id],e=BREATHING_AUDIT_ENTRIES[row.id]||(context.role==='main'?local?.data:null);
 if(!e||!local||!breathingSame(metadata,local.metadata))return null;
 if(own(row,'taxonomy')&&(!row.taxonomy||typeof row.taxonomy!=='object'||Array.isArray(row.taxonomy)))return null;
 if(own(row.taxonomy,'aliases')&&!Array.isArray(row.taxonomy.aliases))return null;
 for(const before of local.profiles){
  const after={...before,...e.edits},stage=[['after',after],['before',before]].find(([,profile])=>local.fieldKeys.every(k=>breathingSameField(row,profile,k)))?.[0];if(!stage)continue;
  const beforeTax=before.taxonomy||{},afterTax={...beforeTax,...e.taxonomy},keys=[...new Set([...Object.keys(row.taxonomy||{}),...Object.keys(beforeTax),...Object.keys(afterTax)])].filter(k=>!['aliases','note'].includes(k));
  if(keys.some(k=>!breathingSameField(row.taxonomy,beforeTax,k)&&!breathingSameField(row.taxonomy,afterTax,k)))continue;
  return {...e,before,stage};
 }return null;
}
export const BREATHING_AUDIT_FLAG='breathingAudit20261024',BREATHING_AUDIT_VERSION=1;
export function applyBreathingAudit(collection,{breathingAuditContext:context,auditMetadata}={}){
 if(!collection||!Array.isArray(collection.tEx)||collection[BREATHING_AUDIT_FLAG]===BREATHING_AUDIT_VERSION||context?.version!==1||!auditMetadata)return collection;
 let changed=false;const tEx=collection.tEx.map(row=>{
  if(!own(auditMetadata,row.id))return row;const e=breathingEntryFor(row,auditMetadata[row.id],context);if(!e)return row;
  let next=row;for(const[k,v]of Object.entries(e.edits))if(breathingSameField(row,e.before,k)&&!breathingSameField(row,e.edits,k)){if(next===row)next={...row};next[k]=structuredClone(v);}
  const taxonomy={...next.taxonomy};for(const[k,v]of Object.entries(e.taxonomy)){if(k==='aliases'){taxonomy.aliases=[...new Set([...(taxonomy.aliases||[]),...v])];continue;}if(!own(taxonomy,k)||own(e.before.taxonomy,k)&&breathingSame(taxonomy[k],e.before.taxonomy[k]))taxonomy[k]=structuredClone(v);}
  if(row.cz!==next.cz||row.en!==next.en)taxonomy.aliases=[...new Set([...(taxonomy.aliases||[]),...[row.cz,row.en].filter(x=>typeof x==='string')])];if(!breathingSame(taxonomy,next.taxonomy))next={...next,taxonomy};changed ||= next!==row;return next;
 });return {...collection,...(changed?{tEx}:{}),[BREATHING_AUDIT_FLAG]:BREATHING_AUDIT_VERSION};
}
export function breathingPolicyFor(row,meta,context){const e=breathingEntryFor(row,meta,context);return e?{...e.policy,stage:e.stage,auditKind:'breathing'}:null;}
const blockPolicyFields=['eq','pat','mode','load','jg','tier','sessionRole','sessionBlock','goalRole','genRule','precautions','pc','source','foc','pos','exe','wat','pro','equipmentDetail','loadMode','sideMode','allowEstimatedMax','allowAddedWeightRecord','allowComparableRecords','allowAutomaticProgression','manualProgression','manualWarmup','warmupPolicy','noAddedWeight','recordingPolicy','progressionPolicy','selectionPolicy','equipmentRequirements','equipment','requiresCoach','requiresEquipmentCheck','allowCopyCompletedAcrossSides','preserveSide','breathingAuditPolicy','breathingPrescription','positionHoldAuditPolicy','positionHoldPrescription','contextOverride','familyOverride','allowMotion','blockedMotionSources'];
export function breathingBlockCompatible(p,block){if(!p)return false;if(p.auditKind!=='breathing')return true;if(block?.exId!==p.id||block.measurementType!==p.measurementType||!breathingEmptyVariant(block.variant))return false;return blockPolicyFields.every(k=>!own(block,k)||own(p,k)&&breathingSame(block[k],p[k]));}
export function breathingPolicyForBlock(row,meta,context,block){const p=breathingPolicyFor(row,meta,context);return breathingBlockCompatible(p,block)?p:null;}
export function breathingSelectionRefusal(p,ctx){
 if(!p)return null;const c=ctx||{};if(p.unknown)return{ok:false,why:'reviewed-setup-unspecified'};
 if(c.allowBreath!==true)return{ok:false,why:'breath-opt-in'};
 if(p.explicitTarget&&c.explicitTarget!==true)return{ok:false,why:'reviewed-explicit-target'};
 if(p.requiresCoach&&c.coachPresent!==true)return{ok:false,why:'requires-coach'};
 if(!Array.isArray(c.equipment)||!matchesAvailableEquipment({requirements:p.requirements},c.equipment))return{ok:false,why:'reviewed-equipment'};
 return null;
}
export const breathingSelectionAllowed=(p,ctx)=>!breathingSelectionRefusal(p,ctx);
// This equipment-only path does not confer breath opt-in or supervised selection.
export function breathingEquipmentDecision(row,meta,context,equipment,explicitTarget){const p=breathingPolicyFor(row,meta,context);return p?(!p.unknown&&(!p.explicitTarget||explicitTarget===true)&&Array.isArray(equipment)&&matchesAvailableEquipment({requirements:p.requirements},equipment)):undefined;}
const resolvedPolicies=new WeakMap();
export function attachBreathingPolicy(record,row,meta,context){
 const p=breathingPolicyFor(row,meta,context);if(!p){resolvedPolicies.delete(record);return record;}
 // Trusted profile, never a deserialised row marker. Keep normal resolver status/alias gates.
 Object.assign(record,{role:'BREATH',sessionRole:'breath',measurementType:'DURATION',loadMode:'none',sideMode:'none',unilateral:false,tempoSupport:false,generatorEligible:false,requiresCoach:p.requiresCoach,defaultRestSec:0,warmupPolicy:'none'});
 resolvedPolicies.set(record,p);return record;
}
export const resolvedBreathingPolicy=record=>record&&resolvedPolicies.get(record)||null;
export const breathingResolvedRefusal=(record,ctx)=>breathingSelectionRefusal(resolvedBreathingPolicy(record),ctx);
export const breathingArtworkFor=(row,meta,context)=>breathingEntryFor(row,meta,context)?.art||null;
export const breathingEquipmentLabels=(row,meta,context,language='cs')=>{const e=breathingEntryFor(row,meta,context);return e?.equipmentLabels?[e.equipmentLabels[language==='en'?1:0]]:null;};
export const breathingLibraryOrderFor=(row,meta,context)=>{const e=breathingEntryFor(row,meta,context);return Number.isInteger(e?.libraryOrder)?e.libraryOrder:null;};
export const breathingMotionAllowed=(row,meta,context,motion)=>{const p=breathingPolicyFor(row,meta,context);return !p||!motion||!(p.blockedMotionSources||[]).includes(motion.src);};
// The whole practice is timed; no fixed phase visual, breath-count conversion or retention countdown.
export const breathingTimerMeaning=(row,meta,context)=>breathingPolicyFor(row,meta,context)?.recordingPolicy||null;
export const breathingGazeLabelAllowed=(row,meta,context)=>!(row?.id==='jg_simhasana'&&breathingEntryFor(row,meta,context));
const deliveryOverrideFields=blockPolicyFields.filter(k=>!['eq','pat'].includes(k));
function deliveredProfile(payload){
 const stamp=payload?.breathingAudit,e=BREATHING_AUDIT_ENTRIES[payload?.id],profile=stamp?.v===1&&e?.deliveryProfiles?.[stamp.profile];
 if(!profile||!Object.keys(profile.fields).every(k=>breathingSameField(payload,profile.fields,k))||!(payload.progression===null||breathingSame(payload.progression,profile.progression)))return null;
 if(payload.art!=null&&!breathingSame(payload.art,e.art))return null;
 if(deliveryOverrideFields.some(k=>own(payload,k)&&(!own(profile.fields,k)||!breathingSame(payload[k],profile.fields[k]))))return null;
 return e;
}
export function breathingDeliveryStamp(record,payload){
 const p=resolvedBreathingPolicy(record),e=p&&BREATHING_AUDIT_ENTRIES[p.id];if(!e||p.stage!=='after')return undefined;
 for(const key of Object.keys(e.deliveryProfiles||{})){const stamp={v:1,profile:key};if(deliveredProfile({...payload,breathingAudit:stamp}))return stamp;}return undefined;
}
export function breathingDeliveredPolicy(payload){const e=deliveredProfile(payload);return e?{...e.policy,stage:'after',auditKind:'breathing'}:null;}
export const breathingDeliveredArtworkFor=payload=>deliveredProfile(payload)?.art||null;
