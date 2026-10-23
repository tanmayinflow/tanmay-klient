import {MOVEMENT_AUDIT_ENTRIES} from './catalogMovementAuditData.js';
import {movementEntryFor,movementDisplayEligible,movementMetadataEligible,sameMovementField} from './catalogMovementAuditGuards.js';
import {exerciseEquipment,EXERCISE_EQUIPMENT} from './exerciseEquipment.js';
import {auditedAllowsEstimatedMax} from './catalogTrunkAuditView.js';
export function movementMuscleDisplay(row,meta,context){
 const entry=MOVEMENT_AUDIT_ENTRIES[row?.id];
 if(row?.movementMuscleDisplayOptOut===true||!entry?.display||context?.version!==1||!['main','client'].includes(context.role))return null;
 return movementDisplayEligible(row,meta)&&movementMetadataEligible(row,context,{[row.id]:meta})?entry.display:null;
}
export function movementAllowsEstimatedMax(row){
 const entry=MOVEMENT_AUDIT_ENTRIES[row?.id];return entry?.noEstimate&&movementDisplayEligible(row)?false:undefined;
}
export function libraryAuditedAllowsEstimatedMax(row){return movementAllowsEstimatedMax(row)??auditedAllowsEstimatedMax(row);}
export function movementArtworkFor(row,context){
 const entry=movementEntryFor(row,context);if(!entry?.art)return null;
 // Normalized delivered records may contain only these illustrated mechanics.
 // Notes remain independent; altered names/setup retain existing media choice.
 return [entry.before,{...entry.before,...entry.edits}].some(p=>['cz','en','pos','exe','eq'].every(k=>sameMovementField(row,p,k)))?entry.art:null;
}
export function movementEquipmentLabels(row,language='cs'){
 if(!MOVEMENT_AUDIT_ENTRIES[row?.id])return null;
 const en=language==='en';return exerciseEquipment(row).requirements.map(group=>group.map(id=>EXERCISE_EQUIPMENT.find(x=>x.id===id)?.[en?'en':'cz']||id).join(en?' or ':' nebo '));
}
