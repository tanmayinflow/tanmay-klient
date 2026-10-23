import {TRUNK_AUDIT_ENTRIES} from './catalogTrunkAuditData.js';

export function sameTrunkValue(a,b){
 if(Object.is(a,b))return true;
 if(!a||!b||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)!==Array.isArray(b))return false;
 const keys=Object.keys(a);return keys.length===Object.keys(b).length&&keys.every(k=>Object.hasOwn(b,k)&&sameTrunkValue(a[k],b[k]));
}
export const sameTrunkField=(a,b,k)=>Object.hasOwn(a,k)===Object.hasOwn(b,k)&&sameTrunkValue(a[k],b[k]);
const semanticFacets=['movements','positions','supports','equipmentRequirements','focus'];
const recordingFields=['mode','load','measurementType','loadMode','sideMode'];
export function trunkEntryFor(row,context){return context?.entries?.[row?.id]||TRUNK_AUDIT_ENTRIES[row?.id]||null;}

// Exact reviewed setup and raw recording presence protect personally redefined
// cards. Normalization may add only the unchanged derived recording defaults.
export function trunkRowEligible(row,entry,meta){
 if(!row||!entry)return false;
 const old=entry.before,after={...old,...entry.edits};
 if(![old,after].some(profile=>entry.setupFields.every(k=>sameTrunkField(row,profile,k))))return false;
 if(!entry.identityFields.every(k=>sameTrunkField(row,old,k)))return false;
 for(const k of recordingFields){
  if(Object.hasOwn(old,k)){if(!sameTrunkField(row,old,k))return false;}
  else if(Object.hasOwn(row,k)&&(!Object.hasOwn(entry.recording,k)||!sameTrunkValue(row[k],entry.recording[k])))return false;
 }
 // Do not import catalog here: its overlay imports the seeding pipeline.
 // Exact raw fields plus the inspected metadata inputs protect the same
 // recording meaning without introducing a catalog/seed import cycle.
 if(meta&&Object.keys(meta).length&&['r','addable'].some(k=>!sameTrunkField(meta,entry.recordingMeta,k)))return false;
 if(semanticFacets.some(k=>row.taxonomy?.[k]!==undefined&&!sameTrunkValue(row.taxonomy[k],old.taxonomy?.[k])&&!sameTrunkValue(row.taxonomy[k],entry.taxonomy[k])))return false;
 return true;
}
export function trunkMetadataEligible(row,entry,context,metadata){
 if(!entry.metadataFields.length)return true;
 const expected=context?.metadataGuards?.[row.id],actual=metadata?.[row.id];
 return !!expected&&!!actual&&entry.metadataFields.every(k=>sameTrunkField(actual,expected,k));
}

// Display changes are narrower than content fixes: custom anatomy, provenance,
// roles or an unknown seed also disables this derived presentation.
export function trunkDisplayEligible(row,meta={}){
 meta=meta||{};
 const entry=trunkEntryFor(row);if(!entry||!trunkRowEligible(row,entry,meta))return false;
 const old=entry.before,after={...old,...entry.edits};
 if(!['mp','ms'].every(k=>sameTrunkField(row,old,k)))return false;
 if(![old,after].some(p=>sameTrunkField(row,p,'source')))return false;
 if(!entry.seedProfiles.some(p=>Object.hasOwn(row,'seed')===p.present&&sameTrunkValue(row.seed,p.value)))return false;
 for(const key of ['startPosition','execution','focus'])if(Object.hasOwn(row,key)&&!sameTrunkField(row,old,key))return false;
 for(const[key,value]of Object.entries(entry.displayMeta||{}))if(Object.hasOwn(meta,key)&&!sameTrunkValue(meta[key],value))return false;
 return true;
}
