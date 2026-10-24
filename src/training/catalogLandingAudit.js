// Review-only proposal; root owns installation with role-specific exact contexts.
import {matchesAvailableEquipment,EXERCISE_EQUIPMENT} from './exerciseEquipment.js';
import {LANDING_AUDIT_ENTRIES,LANDING_BLOCK_POLICY_FIELDS} from './catalogLandingAuditData.js';
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o||{},k);
export function landingSame(a,b){if(Object.is(a,b))return true;if(!a||!b||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)!==Array.isArray(b))return false;if(Array.isArray(a)&&a.length!==b.length)return false;const keys=Object.keys(a);return keys.length===Object.keys(b).length&&keys.every(k=>own(b,k)&&landingSame(a[k],b[k]));}
export const landingSameField=(a,b,k)=>own(a,k)===own(b,k)&&landingSame(a?.[k],b?.[k]);
export const landingEmptyVariant=v=>v==null||v===''||Array.isArray(v)&&v.length===0;
export function landingEntryFor(row,meta,context){
 if(!row||context?.version!==1||!['main','client'].includes(context.role))return null;
 const local=context.entries?.[row.id],e=LANDING_AUDIT_ENTRIES[row.id]||(context.role==='main'?local?.data:null);
 if(!e||!local||!landingSame(meta,local.metadata))return null;
 if(own(row,'taxonomy')&&(!row.taxonomy||typeof row.taxonomy!=='object'||Array.isArray(row.taxonomy)))return null;
 if(own(row.taxonomy,'aliases')&&!Array.isArray(row.taxonomy.aliases))return null;
 for(const before of local.profiles){
  const after={...before,...e.edits},stage=[['after',after],['before',before]].find(([,p])=>local.fieldKeys.every(k=>landingSameField(row,p,k)))?.[0];if(!stage)continue;
  const bt=before.taxonomy||{},at={...bt,...e.taxonomy},keys=[...new Set([...Object.keys(row.taxonomy||{}),...Object.keys(bt),...Object.keys(at)])].filter(k=>!['aliases','note'].includes(k));
  if(keys.some(k=>!landingSameField(row.taxonomy,bt,k)&&!landingSameField(row.taxonomy,at,k)))continue;
  return {...e,before,stage};
 }return null;
}
export const LANDING_AUDIT_FLAG='landingAudit20261024',LANDING_AUDIT_VERSION=1;
export function applyLandingAudit(collection,{landingAuditContext:context,auditMetadata}={}){
 if(!collection||!Array.isArray(collection.tEx)||collection[LANDING_AUDIT_FLAG]===LANDING_AUDIT_VERSION||context?.version!==1||!auditMetadata)return collection;
 let changed=false;const tEx=collection.tEx.map(row=>{
  if(!own(auditMetadata,row.id))return row;const e=landingEntryFor(row,auditMetadata[row.id],context);if(!e)return row;
  let next=row;for(const[k,v]of Object.entries(e.edits))if(landingSameField(row,e.before,k)&&!landingSameField(row,e.edits,k)){if(next===row)next={...row};next[k]=structuredClone(v);}
  const taxonomy={...next.taxonomy};for(const[k,v]of Object.entries(e.taxonomy)){if(k==='aliases'){taxonomy.aliases=[...new Set([...(taxonomy.aliases||[]),...v])];continue;}if(!own(taxonomy,k)||own(e.before.taxonomy,k)&&landingSame(taxonomy[k],e.before.taxonomy[k]))taxonomy[k]=structuredClone(v);}
  if(row.cz!==next.cz||row.en!==next.en)taxonomy.aliases=[...new Set([...(taxonomy.aliases||[]),...[row.cz,row.en].filter(x=>typeof x==='string')])];if(!landingSame(taxonomy,next.taxonomy))next={...next,taxonomy};changed ||= next!==row;return next;
 });return {...collection,...(changed?{tEx}:{}),[LANDING_AUDIT_FLAG]:LANDING_AUDIT_VERSION};
}
export function landingPolicyFor(row,meta,context){const e=landingEntryFor(row,meta,context);return e?{...e.policy,stage:e.stage,auditKind:'landing'}:null;}
export function landingBlockCompatible(policy,block){if(!policy||policy.auditKind!=='landing'||block?.exId!==policy.id||block.measurementType!==policy.measurementType||!landingEmptyVariant(block.variant))return false;return LANDING_BLOCK_POLICY_FIELDS.every(k=>!own(block,k)||own(policy,k)&&landingSame(block[k],policy[k]));}
export function landingPolicyForBlock(row,meta,context,block){const p=landingPolicyFor(row,meta,context);return landingBlockCompatible(p,block)?p:null;}
export function landingSelectionRefusal(p,ctx){
 if(!p)return null;const c=ctx||{};
 if(p.unknown)return{ok:false,why:'reviewed-setup-unspecified'};
 if(p.explicitTarget&&c.explicitTarget!==true)return{ok:false,why:'reviewed-explicit-target'};
 if(p.requiresCoach&&c.coachPresent!==true)return{ok:false,why:'requires-coach'};
 if(!Array.isArray(c.equipment)||!matchesAvailableEquipment({requirements:p.requirements},c.equipment))return{ok:false,why:'reviewed-equipment'};
 return null;
}
export const landingSelectionAllowed=(p,ctx)=>!landingSelectionRefusal(p,ctx);
export function landingEquipmentDecision(row,meta,context,equipment,explicitTarget){const p=landingPolicyFor(row,meta,context);return p?(!p.unknown&&(!p.explicitTarget||explicitTarget===true)&&Array.isArray(equipment)&&matchesAvailableEquipment({requirements:p.requirements},equipment)):undefined;}
const resolvedPolicies=new WeakMap();
export function attachLandingPolicy(record,row,meta,context){
 const p=landingPolicyFor(row,meta,context);if(!p){resolvedPolicies.delete(record);return record;}
 // Preserve measurement/load/side/rest/roles. A direction is not a single-leg task.
 if(record.measurementType!==p.measurementType||record.loadMode!==p.loadMode||record.sideMode!==p.sideMode)return record;
 if(p.unilateralOverride===false)record.unilateral=false;
 if(typeof p.familyOverride==='string')record.familyId=p.familyOverride;
 resolvedPolicies.set(record,p);return record;
}
export const resolvedLandingPolicy=record=>record&&resolvedPolicies.get(record)||null;
export const landingResolvedRefusal=(record,ctx)=>landingSelectionRefusal(resolvedLandingPolicy(record),ctx);
export const landingArtworkFor=(row,meta,context)=>landingEntryFor(row,meta,context)?.art||null;
export function landingEquipmentLabels(row,meta,context,language='cs'){const e=landingEntryFor(row,meta,context);if(!e)return null;if(e.equipmentLabels)return [e.equipmentLabels[language==='en'?1:0]];return e.policy.requirements.map(group=>group.map(id=>EXERCISE_EQUIPMENT.find(x=>x.id===id)?.[language==='en'?'en':'cz']||id).join(language==='en'?' or ':' nebo '));}
export const landingLibraryOrderFor=(row,meta,context)=>landingEntryFor(row,meta,context)?.libraryOrders||null;
export const landingMotionAllowed=(row,meta,context,motion)=>{const p=landingPolicyFor(row,meta,context);return !p||!motion||!(p.blockedMotionSources||[]).includes(motion.src);};
const deliveryOverrideFields=LANDING_BLOCK_POLICY_FIELDS.filter(k=>!['eq','pat','landingAudit'].includes(k));
function deliveredProfile(payload){
 const stamp=payload?.landingAudit,e=LANDING_AUDIT_ENTRIES[payload?.id],profile=stamp?.v===1&&e?.deliveryProfiles?.[stamp.profile];
 if(!stamp||Object.keys(stamp).length!==2||typeof stamp.profile!=='string')return null;
 if(!profile||!Object.keys(profile.fields).every(k=>landingSameField(payload,profile.fields,k))||!(payload.progression===null||landingSame(payload.progression,profile.progression)))return null;
 if(own(payload,'variant')&&!landingEmptyVariant(payload.variant))return null;
 if(payload.art!=null&&!([e.art,...(e.deliveryArtworkProfiles||[])].some(art=>landingSame(payload.art,art))))return null;
 if(deliveryOverrideFields.some(k=>own(payload,k)&&(!own(profile.fields,k)||!landingSame(payload[k],profile.fields[k]))))return null;
 return e;
}
export function landingDeliveryStamp(record,payload){const p=resolvedLandingPolicy(record),e=p&&LANDING_AUDIT_ENTRIES[p.id];if(!e||p.stage!=='after')return undefined;for(const key of Object.keys(e.deliveryProfiles||{})){const stamp={v:1,profile:key};if(deliveredProfile({...payload,landingAudit:stamp}))return stamp;}return undefined;}
export function landingDeliveredPolicy(payload){const e=deliveredProfile(payload);return e?{...e.policy,stage:'after',auditKind:'landing'}:null;}
export const landingDeliveredArtworkFor=payload=>deliveredProfile(payload)?.art||null;
