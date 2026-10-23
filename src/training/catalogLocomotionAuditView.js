import{LOCOMOTION_AUDIT_ENTRIES}from'./catalogLocomotionAuditData.js';
import{locomotionDeliveredPolicy}from'./catalogLocomotionAuditPolicy.js';
export function locomotionDeliveredArtworkFor(payload){
 const policy=locomotionDeliveredPolicy(payload);
 return policy?LOCOMOTION_AUDIT_ENTRIES[policy.id]?.art||null:null;
}

import{sameLocomotionField}from'./catalogLocomotionAuditGuards.js';
import{exerciseEquipment,EXERCISE_EQUIPMENT}from'./exerciseEquipment.js';
export function locomotionArtworkFor(row){
 const e=LOCOMOTION_AUDIT_ENTRIES[row?.id];if(!e?.art)return null;
 return Object.values(e.profiles).some(before=>[before,{...before,...e.edits}].some(p=>['cz','en','pos','exe','eq'].every(k=>sameLocomotionField(row,p,k))))?e.art:null;
}
export function locomotionEquipmentLabels(row,language='cs'){
 if(!LOCOMOTION_AUDIT_ENTRIES[row?.id])return null;const en=language==='en';return exerciseEquipment(row).requirements.map(g=>g.map(id=>EXERCISE_EQUIPMENT.find(x=>x.id===id)?.[en?'en':'cz']||id).join(en?' or ':' nebo '));
}
