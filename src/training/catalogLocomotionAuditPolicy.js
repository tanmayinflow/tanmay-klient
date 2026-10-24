import{LOCOMOTION_AUDIT_ENTRIES}from'./catalogLocomotionAuditData.js';
import{locomotionEntryFor,sameLocomotionField,sameLocomotionValue}from'./catalogLocomotionAuditGuards.js';
import{findBlock,findSet,setActual,completeSet,addSet}from'./sessionEngine.js';
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o||{},k);
const policyFields=['source','foc','wat','pro','equipmentDetail','precautions','pc','defaultRestSec','warmupPolicy','generatorEligible','selectionPolicy','equipmentRequirements','equipment','status','aliasOf','requiresCoach','requiresEquipmentCheck','allowEstimatedMax','allowAddedWeightRecord','progressionPolicy','recordingPolicy','locomotionPolicy','startPosition','execution','focus'];
export function locomotionPolicyFor(row,meta,context){
 const e=locomotionEntryFor(row,context);if(!e||!own(context?.metadataGuards,row.id)||!sameLocomotionValue(meta,context.metadataGuards[row.id]))return null;
 const stage=policyFields.every(k=>sameLocomotionField(row,{...e.before,...e.edits},k))?'after':policyFields.every(k=>sameLocomotionField(row,e.before,k))?'before':null;if(!stage)return null;
 return{...e.policy,profileKey:e.profileKey,stage};
}
export function locomotionPolicyForBlock(row,meta,context,block){const p=locomotionPolicyFor(row,meta,context);return p&&block?.exId===p.id&&block.measurementType===p.measurementType&&!block.variant?p:null;}
export function locomotionEquipmentDecision(row,meta,context,equipment,explicitTarget){const p=locomotionPolicyFor(row,meta,context);return p?locomotionSelectionAllowed(p,{equipment,explicitTarget}):undefined;}
export function locomotionSelectionAllowed(policy,{equipment,explicitTarget=false}={}){
 if(!policy)return true;if(policy.unknown||policy.explicitTarget&&!explicitTarget||!Array.isArray(equipment))return false;
 const have=new Set(['telo',...equipment]);return policy.requirements.every(group=>group.some(id=>have.has(id)));
}
export function locomotionRecordOptions(policy){return policy?{...(policy.allowComparableRecords===false?{allowComparableRecords:false}:{}),...(policy.noAddedWeight?{allowAddedWeightRecord:false,excludeExtraLoad:true}:{}),...(policy.allowEstimatedMax===false?{allowEstimatedMax:false}:{}),...(policy.sideMode==='perSide'?{preserveSide:true}:{})}:{};}
export function locomotionProtectedLoadKeys(policy){
 if(policy?.noAddedWeight)return ['weight','addedWeight'];
 return ['shoulder','elbowHand','positionHold','throw','complexTask','landing'].includes(policy?.auditKind)&&policy.loadMode==='ext'&&['WEIGHT_REPS','WEIGHT_DURATION'].includes(policy.measurementType)?['addedWeight']:[];
}
export function locomotionLegacyLoad(set,policy){const keys=locomotionProtectedLoadKeys(policy);return[['actual','addedWeight'],['actual','weight'],['planned','targetWeight'],['planned','addedWeight']].filter(([p,k])=>keys.includes(k==='targetWeight'?'weight':k)&&own(set?.[p],k)).map(([p,k])=>({part:p,key:k,value:set[p][k]}));}
const fits=(session,blockId,p)=>{const b=findBlock(session,blockId);return p&&b?.exId===p.id&&b.measurementType===p.measurementType;};
const replaceSet=(session,blockId,setId,fn)=>({...session,blocks:session.blocks.map(b=>b.id!==blockId?b:{...b,sets:b.sets.map(s=>s.id===setId?fn(s):s)})});
const protectedActualKeys=(p,complete=false)=>[...new Set([...locomotionProtectedLoadKeys(p),...(p?.auditKind==='landing'?[...(p.readOnlyActualKeys||[]),...(complete&&p.noAutomaticTargetHeight?['height']:[])]:[])])];
const preserveLoad=(before,after,p,complete=false)=>{const keys=protectedActualKeys(p,complete),plannedKeys=[...locomotionProtectedLoadKeys(p).map(k=>k==='weight'?'targetWeight':k),...(p?.auditKind==='landing'?p.readOnlyPlannedKeys||[]:[])];if(!keys.length&&!plannedKeys.length)return after;const result={...after,actual:{...after.actual},planned:{...after.planned}};for(const k of keys){delete result.actual[k];if(own(before.actual,k))result.actual[k]=before.actual[k];}for(const k of plannedKeys){delete result.planned[k];if(own(before.planned,k))result.planned[k]=before.planned[k];}return result;};
export function locomotionSetActual(session,blockId,setId,patch,policy){
 const keys=protectedActualKeys(policy);if(!fits(session,blockId,policy)||!keys.length)return setActual(session,blockId,setId,patch);
 const before=findSet(session,blockId,setId),safe=Object.fromEntries(Object.entries(patch).filter(([k])=>!keys.includes(k)));return replaceSet(setActual(session,blockId,setId,safe),blockId,setId,s=>preserveLoad(before,s,policy));
}
export function locomotionCompleteSet(session,blockId,setId,now,policy){const next=completeSet(session,blockId,setId,now);return fits(session,blockId,policy)&&protectedActualKeys(policy,true).length?replaceSet(next,blockId,setId,s=>preserveLoad(findSet(session,blockId,setId),s,policy,true)):next;}
export function locomotionSetSide(session,blockId,setId,side,policy){if(!fits(session,blockId,policy)||policy.sideMode!=='perSide'||!['L','R',null].includes(side))return session;return replaceSet(session,blockId,setId,s=>({...s,side}));}
export function locomotionAddSet(session,blockId,opts,policy){const next=addSet(session,blockId,opts);if(!fits(session,blockId,policy)||policy.sideMode!=='perSide')return next;const previous=new Set(findBlock(session,blockId).sets.map(s=>s.id));return{...next,blocks:next.blocks.map(b=>b.id!==blockId?b:{...b,sets:b.sets.map(s=>previous.has(s.id)?s:{...s,side:opts?.side==='L'||opts?.side==='R'?opts.side:null})})};}
export function locomotionCanCopyPrevious(prev,block,policy){return !policy||policy.sideMode!=='perSide'&&![...(prev?.sets||[]),...(block?.sets||[])].some(s=>locomotionLegacyLoad(s,policy).length);}
export function locomotionSideLabel(side,en=false){return side==='L'?(en?'Left':'Levá'):side==='R'?(en?'Right':'Pravá'):(en?'Side unspecified':'Strana neuvedena');}
// Derived capabilities are kept in memory, never accepted from a persisted marker.
const resolvedPolicies=new WeakMap();
export function attachLocomotionPolicy(record,row,meta,context){const p=locomotionPolicyFor(row,meta,context);if(!p)return record;const resolved=p.defaultRestSec===undefined?record:{...record,defaultRestSec:p.defaultRestSec};resolvedPolicies.set(resolved,p);return resolved;}
export const resolvedLocomotionPolicy=record=>record&&resolvedPolicies.get(record)||null;
export function locomotionResolvedRefusal(record,ctx){const p=resolvedLocomotionPolicy(record);return p&&!locomotionSelectionAllowed(p,ctx)?{ok:false,why:p.unknown?'reviewed-setup-unspecified':p.explicitTarget&&!ctx?.explicitTarget?'reviewed-explicit-target':'reviewed-equipment'}:null;}
export function locomotionHasResolvedEquipment(record){return !!resolvedLocomotionPolicy(record);}
const deliveryKeys=['id','cz','en','pat','eq','measurementType','defaultRestSec','unilateral','sideMode','focus','startPosition','execution','watchFor','progression'];
const nativeText=value=>Array.isArray(value)?value.map(nativeText):typeof value==='string'&&/https?:\/\//.test(value)?value.replace(/https?:\/\/[^\s<>]+/g,'').replace(/[ \t]+$/gm,'').trim():value;
function expectedDelivery(id,profileKey,stage,pro){
 const e=LOCOMOTION_AUDIT_ENTRIES[id],before=e?.profiles[profileKey],defaults=e?.publicDefaults?.[profileKey]?.[stage];if(!before||!defaults||!['before','after'].includes(stage))return null;
 const row=stage==='after'?{...before,...e.edits}:before;
 return{source:own(row,'source')?{present:true,value:row.source}:{present:false},fields:{id,cz:defaults.cz,en:defaults.en,pat:row.pat||'',eq:row.eq||[],measurementType:defaults.measurementType,defaultRestSec:defaults.defaultRestSec,unilateral:defaults.unilateral,sideMode:defaults.sideMode,focus:nativeText(row.foc||null),startPosition:nativeText(row.pos||null),execution:nativeText(row.exe||null),watchFor:nativeText(row.wat||null),progression:pro?nativeText(row.pro||null):null},policy:{...e.policy,profileKey,stage}};
}
const sameDelivery=(a,b)=>deliveryKeys.every(k=>sameLocomotionField(a,b,k));
export function locomotionDeliveryStamp(record,payload){const p=resolvedLocomotionPolicy(record);if(!p)return undefined;const expected=expectedDelivery(p.id,p.profileKey,p.stage,payload.progression!==null);return expected&&sameDelivery(payload,expected.fields)?{v:1,profileKey:p.profileKey,stage:p.stage,source:expected.source}:undefined;}
export function locomotionDeliveredPolicy(payload){const s=payload?.locomotionAudit;if(!s||s.v!==1)return null;const expected=expectedDelivery(payload.id,s.profileKey,s.stage,payload.progression!==null);return expected&&sameLocomotionValue(s.source,expected.source)&&sameDelivery(payload,expected.fields)?expected.policy:null;}
export {LOCOMOTION_AUDIT_ENTRIES};
