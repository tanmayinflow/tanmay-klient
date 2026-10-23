import {CARRY_AUDIT_ART} from './catalogCarryAuditArt.js';
import {proposal} from './catalogCarryAuditData.js';
import {exerciseEquipment,EXERCISE_EQUIPMENT} from './exerciseEquipment.js';
export const CARRY_FOUNDATIONS=proposal.foundationOrder;
export function carryEquipmentLabels(row,language='cs'){
 if(!row||!proposal.guards[row.id])return null;
 const field=language==='en'?'en':'cz';
 const requirements=exerciseEquipment(row).requirements;
 if(row.id==='ex26_cross_carry'&&JSON.stringify(requirements)===JSON.stringify(proposal.taxonomy.ex26_cross_carry.equipmentRequirements)){
  return language==='en'?['2 weights: dumbbells, kettlebells or one of each','Other load: specify equipment']:['2 zátěže: jednoručky, kettlebelly nebo jejich kombinace','Jiné závaží: upřesnit vybavení'];
 }
 return requirements.map(group=>group.map(id=>EXERCISE_EQUIPMENT.find(x=>x.id===id)?.[field]||id).join(language==='en'?' or ':' nebo '));
}

export function carryArtworkFor(row){
 const guard=proposal.guards[row?.id],art=CARRY_AUDIT_ART[row?.id];
 return guard&&art&&['cz','en','pos','exe','eq'].every(k=>JSON.stringify(row[k])===JSON.stringify(guard[k]))?art:null;
}
