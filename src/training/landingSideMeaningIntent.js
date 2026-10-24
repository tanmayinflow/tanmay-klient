// Storage shape is not profile trust. Consumers must supply the actual guarded block policy.
import {LANDING_AUDIT_ENTRIES,LANDING_BLOCK_POLICY_FIELDS} from './catalogLandingAuditData.js';
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o||{},k),invalid=()=>({v:0,invalid:true});
const supported=p=>p?.sideMeaningKey==='hand-travel-direction'&&p.sideMode==='perSide'&&p.requiresRecordingConfirmation===false;
export function sideMeaningIntentOf(block){
 const value=block?.sideMeaningIntent,entry=LANDING_AUDIT_ENTRIES[block?.exId],p=entry?.policy;
 if(!supported(p)||!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).length!==4||value.v!==1||value.meaning!==p.sideMeaningKey||value.exerciseId!==block.exId||value.measurementType!==block.measurementType||p.measurementType!==block.measurementType)return null;
 if(block.variant!=null&&block.variant!==''&&!(Array.isArray(block.variant)&&!block.variant.length))return null;
 if(LANDING_BLOCK_POLICY_FIELDS.some(k=>own(block,k)))return null;
 return {v:1,meaning:value.meaning,exerciseId:entry.id,measurementType:p.measurementType};
}
export function publicLandingSideMeaning(block){return own(block,'sideMeaningIntent')?{sideMeaningIntent:sideMeaningIntentOf(block)||invalid()}:{};}
export function preserveLandingSideMeaning(input,output){return {...output,...publicLandingSideMeaning(input)};}
export function sideMeaningState(block,policy){
 if(!own(block,'sideMeaningIntent'))return 'absent';
 const value=sideMeaningIntentOf(block);
 return value&&supported(policy)&&policy.id===block.exId&&policy.measurementType===block.measurementType?'declared':'invalid';
}
export function declareNewSideMeaning(block,policy,{newBlock=false}={}){
 if(newBlock!==true||!supported(policy)||policy.id!==block?.exId||policy.measurementType!==block.measurementType||own(block,'sideMeaningIntent')||own(block,'recordingConvention')||!block.sets?.length||block.sets.some(s=>s.completed||s.completedAt||Object.values(s.actual||{}).some(v=>v!=null)))return block;
 const draft={...block,sideMeaningIntent:{v:1,meaning:policy.sideMeaningKey,exerciseId:block.exId,measurementType:block.measurementType}};
 return sideMeaningState(draft,policy)==='declared'?draft:block;
}
export function isDirectionalSidePolicy(policy){return supported(policy);}
