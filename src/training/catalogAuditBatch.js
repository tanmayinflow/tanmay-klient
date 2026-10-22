import {proposal as bridge} from './catalogBridgeAuditData.js';
import {proposal as press} from './catalogHorizontalPressAuditData.js';
import {proposal as pull} from './catalogHorizontalPullAuditData.js';
import {AUDIT_BATCH_ART} from './catalogAuditBatchArt.js';
import {exerciseEquipment,EXERCISE_EQUIPMENT} from './exerciseEquipment.js';
const proposals=[bridge,press,pull],cards=proposals.flatMap(p=>p.additions);
export const AUDIT_BATCH_FOUNDATIONS={hip_extension:bridge.foundationOrder,push_horizontal:press.foundationOrder,pull_horizontal:pull.foundationOrder};
export function auditBatchArtworkFor(row){
 const art=AUDIT_BATCH_ART[row?.id],seed=cards.find(r=>r.id===row?.id);if(!art||!seed)return null;
 return ['cz','en','pos','exe','eq'].every(k=>JSON.stringify(row[k])===JSON.stringify(seed[k]))?art:null;
}
export function auditBatchEquipmentLabels(row,language='cs'){
 if(!row||!proposals.some(p=>p.guards[row.id]||p.additions.some(r=>r.id===row.id)))return null;
 const field=language==='en'?'en':'cz';
 return exerciseEquipment(row).requirements.map(group=>group.map(id=>EXERCISE_EQUIPMENT.find(x=>x.id===id)?.[field]||id).join(language==='en'?' or ':' nebo '));
}
