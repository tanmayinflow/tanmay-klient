import {TRUNK_AUDIT_ENTRIES} from './catalogTrunkAuditData.js';
import {trunkDisplayEligible,trunkEntryFor,sameTrunkValue,sameTrunkField} from './catalogTrunkAuditGuards.js';
import {exerciseEquipment,EXERCISE_EQUIPMENT} from './exerciseEquipment.js';
import {carryAllowsEstimatedMax} from './carryProgressPolicy.js';
export function trunkMuscleDisplay(row,meta){
 const entry=TRUNK_AUDIT_ENTRIES[row?.id];
 return entry?.display&&trunkDisplayEligible(row,meta)?entry.display:null;
}
const noEstimate=new Set(['ex26_hss_quad_drag','abwheel','pallof','ex26_halfkneel_pallof','ex26_kneeling_chop','ex26_kb_eight']);
export function trunkAllowsEstimatedMax(row){
 return noEstimate.has(row?.id)&&trunkDisplayEligible(row)?false:undefined;
}
export function auditedAllowsEstimatedMax(row){return trunkAllowsEstimatedMax(row)??carryAllowsEstimatedMax(row);}
export function trunkArtworkFor(row,context){
 const entry=trunkEntryFor(row,context);if(!entry?.art)return null;
 return [entry.before,{...entry.before,...entry.edits}].some(profile=>['cz','en','pos','exe','eq'].every(k=>sameTrunkField(row,profile,k)))?entry.art:null;
}
export function trunkEquipmentLabels(row,language='cs'){
 const entry=TRUNK_AUDIT_ENTRIES[row?.id];if(!entry)return null;
 const profile=exerciseEquipment(row),en=language==='en';
 // The CNF requirements encode two complete alternative setups. Present the
 // same meaning directly, rather than four repetitive implementation clauses.
 if(row.id==='pallof'&&sameTrunkValue(profile.requirements,entry.taxonomy.equipmentRequirements))return en?['Resistance band with a fixed anchor, or adjustable cable pulley with a single handle']:['Odporová guma s pevnou kotvou, nebo nastavitelná kladka s jednoručním madlem'];
 return profile.requirements.map(group=>group.map(id=>EXERCISE_EQUIPMENT.find(x=>x.id===id)?.[en?'en':'cz']||id).join(en?' or ':' nebo '));
}
