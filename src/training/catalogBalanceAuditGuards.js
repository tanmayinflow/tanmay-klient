import {BALANCE_AUDIT_ENTRIES} from './catalogBalanceAuditData.js';

export function sameBalanceValue(a,b){
 if(Object.is(a,b))return true;
 if(!a||!b||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)!==Array.isArray(b))return false;
 const keys=Object.keys(a);return keys.length===Object.keys(b).length&&keys.every(k=>Object.hasOwn(b,k)&&sameBalanceValue(a[k],b[k]));
}
export const sameBalanceField=(a,b,k)=>Object.hasOwn(a,k)===Object.hasOwn(b,k)&&sameBalanceValue(a[k],b[k]);
export function balanceEntryFor(row,context){return context?.entries?.[row?.id]||BALANCE_AUDIT_ENTRIES[row?.id]||null;}
const recordingFields=['mode','load','measurementType','loadMode','sideMode'];

export function balanceRowEligible(row,entry){
 if(!row||!entry)return false;
 const before=entry.before,after={...before,...entry.edits};
 if(![before,after].some(p=>entry.setupFields.every(k=>sameBalanceField(row,p,k))))return false;
 if(!entry.identityFields.every(k=>sameBalanceField(row,before,k)))return false;
 if(!entry.seedProfiles.some(p=>Object.hasOwn(row,'seed')===p.present&&sameBalanceValue(row.seed,p.value)))return false;
 for(const k of recordingFields){
  if(Object.hasOwn(before,k)){if(!sameBalanceField(row,before,k))return false;}
  else if(Object.hasOwn(row,k)&&(!Object.hasOwn(entry.recording,k)||!sameBalanceValue(row[k],entry.recording[k])))return false;
 }
 if(Object.hasOwn(row,'taxonomy')&&(!row.taxonomy||typeof row.taxonomy!=='object'||Array.isArray(row.taxonomy)))return false;
 if(Object.hasOwn(row.taxonomy||{},'aliases')&&!Array.isArray(row.taxonomy.aliases))return false;
 for(const k of Object.keys(entry.taxonomy)){
  if(k==='aliases'){if(Object.hasOwn(row.taxonomy||{},k)&&!Array.isArray(row.taxonomy[k]))return false;continue;}
  if(Object.hasOwn(row.taxonomy||{},k)&&!(Object.hasOwn(before.taxonomy||{},k)&&sameBalanceValue(row.taxonomy[k],before.taxonomy[k]))&&!sameBalanceValue(row.taxonomy[k],entry.taxonomy[k]))return false;
 }
 return true;
}
export function balanceMetadataEligible(row,context,metadata){
 return !!row&&Object.hasOwn(context?.metadataGuards||{},row.id)&&Object.hasOwn(metadata||{},row.id)&&sameBalanceValue(metadata[row.id],context.metadataGuards[row.id]);
}
export function balanceDisplayEligible(row,meta={}){
 const entry=balanceEntryFor(row);if(!balanceRowEligible(row,entry))return false;
 if(![entry.before,{...entry.before,...entry.edits}].some(p=>sameBalanceField(row,p,'source')))return false;
 for(const k of ['mp','ms','startPosition','execution','focus'])if(!sameBalanceField(row,entry.before,k))return false;
 for(const[k,value]of Object.entries(entry.displayMeta||{}))if(Object.hasOwn(meta||{},k)&&!sameBalanceValue(meta[k],value))return false;
 return true;
}
