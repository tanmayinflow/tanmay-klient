import {LOCOMOTION_AUDIT_ENTRIES} from './catalogLocomotionAuditData.js';
export function sameLocomotionValue(a,b){if(Object.is(a,b))return true;if(!a||!b||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)!==Array.isArray(b))return false;const ks=Object.keys(a);return ks.length===Object.keys(b).length&&ks.every(k=>Object.hasOwn(b,k)&&sameLocomotionValue(a[k],b[k]));}
export const sameLocomotionField=(a,b,k)=>Object.hasOwn(a,k)===Object.hasOwn(b,k)&&sameLocomotionValue(a[k],b[k]);
const recordingFields=['mode','load','measurementType','loadMode','sideMode'];
export function locomotionRowEligible(row,e){
 if(!row||!e)return false;const before=e.before,after={...before,...e.edits};
 if(![before,after].some(p=>e.setupFields.every(k=>sameLocomotionField(row,p,k))))return false;
 if(!e.identityFields.every(k=>sameLocomotionField(row,before,k)))return false;
 if(!e.seedProfiles.some(p=>Object.hasOwn(row,'seed')===p.present&&sameLocomotionValue(row.seed,p.value)))return false;
 for(const k of recordingFields){if(Object.hasOwn(before,k)){if(!sameLocomotionField(row,before,k))return false;}else if(Object.hasOwn(row,k)&&(!Object.hasOwn(e.recording,k)||!sameLocomotionValue(row[k],e.recording[k])))return false;}
 if(Object.hasOwn(row,'taxonomy')&&(!row.taxonomy||typeof row.taxonomy!=='object'||Array.isArray(row.taxonomy)))return false;
 if(Object.hasOwn(row.taxonomy||{},'aliases')&&!Array.isArray(row.taxonomy.aliases))return false;
 for(const k of Object.keys(e.taxonomy)){if(k==='aliases')continue;if(Object.hasOwn(row.taxonomy||{},k)&&!(Object.hasOwn(before.taxonomy||{},k)&&sameLocomotionValue(row.taxonomy[k],before.taxonomy[k]))&&!sameLocomotionValue(row.taxonomy[k],e.taxonomy[k]))return false;}
 return true;
}
export function locomotionEntryFor(row,context){
 const e=LOCOMOTION_AUDIT_ENTRIES[row?.id];if(!e||context?.version!==1)return null;
 const local=context.profiles?.[row.id]||[],distinguishing=[...new Set(local.flatMap(p=>Object.keys(p.edits||{})))];
 for(const p of local){const before=e.profiles[p.key];if(!before)continue;const edits={...e.edits,...p.edits},candidate={...e,profileKey:p.key,before,edits,seedProfiles:p.seeds,setupFields:[...e.setupFields,...distinguishing]};if(locomotionRowEligible(row,candidate))return candidate;}
 return null;
}
export function locomotionMetadataEligible(row,context,metadata){return !!row&&Object.hasOwn(context?.metadataGuards||{},row.id)&&Object.hasOwn(metadata||{},row.id)&&sameLocomotionValue(metadata[row.id],context.metadataGuards[row.id]);}

