import {proposal as push} from './catalogVerticalPushAuditData.js';
import {proposal as pull} from './catalogVerticalPullAuditData.js';
import {VERTICAL_AUDIT_ART} from './catalogVerticalAuditArt.js';
import {exerciseEquipment,EXERCISE_EQUIPMENT} from './exerciseEquipment.js';
const proposals=[push,pull],cards=proposals.flatMap(p=>p.additions);
export function verticalAuditArtworkFor(row){
 const art=VERTICAL_AUDIT_ART[row?.id];if(!art)return null;
 const seed=cards.find(r=>r.id===row.id),guard=seed||push.guards[row.id];
 return guard&&['cz','en','pos','exe','eq'].every(k=>JSON.stringify(row[k])===JSON.stringify(guard[k]))?art:null;
}
export function verticalAuditEquipmentLabels(row,language='cs'){
 if(!row||!proposals.some(p=>p.guards[row.id]||p.additions.some(r=>r.id===row.id)))return null;
 const field=language==='en'?'en':'cz';
 return exerciseEquipment(row).requirements.map(group=>group.map(id=>EXERCISE_EQUIPMENT.find(x=>x.id===id)?.[field]||id).join(language==='en'?' or ':' nebo '));
}
