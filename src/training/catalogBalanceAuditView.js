import {BALANCE_AUDIT_ENTRIES} from './catalogBalanceAuditData.js';
import {balanceEntryFor,sameBalanceField} from './catalogBalanceAuditGuards.js';
import {exerciseEquipment,EXERCISE_EQUIPMENT} from './exerciseEquipment.js';
export function balanceArtworkFor(row,context){
 const e=balanceEntryFor(row,context);if(!e?.art)return null;
 return [e.before,{...e.before,...e.edits}].some(p=>['cz','en','pos','exe','eq'].every(k=>sameBalanceField(row,p,k)))?e.art:null;
}
export function balanceEquipmentLabels(row,language='cs'){
 if(!BALANCE_AUDIT_ENTRIES[row?.id])return null;const en=language==='en';return exerciseEquipment(row).requirements.map(group=>group.map(id=>EXERCISE_EQUIPMENT.find(x=>x.id===id)?.[en?'en':'cz']||id).join(en?' or ':' nebo '));
}
