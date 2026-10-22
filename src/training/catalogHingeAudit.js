import {applyCatalogCorrections} from './catalogCorrections.js';
import {HINGE_CORRECTIONS,HINGE_TAXONOMY,HINGE_GUARDS} from './catalogHingeAuditData.js';
import {exerciseEquipment,EXERCISE_EQUIPMENT} from './exerciseEquipment.js';
const flag='hingeContentAudit20261022';
const copy=value=>JSON.parse(JSON.stringify(value));
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);

/** Correct untouched catalogue fields once. Preserve custom taxonomy, identity,
 * deleted exercises, original recording semantics, programmes and history. */
export function applyHingeAudit(collection){
 if(!collection||collection[flag])return collection;
 const previous=Array.isArray(collection.tEx)?collection.tEx:[];
 const corrected=applyCatalogCorrections(collection,HINGE_CORRECTIONS,flag);
 const before=new Map(previous.map(r=>[r?.id,r]));let changed=false;
 const rows=(corrected.tEx||[]).map(row=>{
  if(!row)return row;
  const guard=HINGE_GUARDS[row.id],defaults=HINGE_TAXONOMY[row.id],old=before.get(row.id);
  const reviewed=guard&&Object.entries(guard).every(([k,v])=>equal(row[k],v));
  const renamed=old&&(old.cz!==row.cz||old.en!==row.en);
  if(!reviewed&&!renamed)return row;
  const taxonomy={...(reviewed?copy(defaults):{}),...row.taxonomy};
  if(renamed)taxonomy.aliases=[...new Set([...(taxonomy.aliases||[]),old.cz,old.en].filter(Boolean))];
  if(equal(taxonomy,row.taxonomy))return row;
  changed=true;return {...row,taxonomy};
 });
 return changed?{...corrected,tEx:rows}:corrected;
}

export function hingeEquipmentLabels(row,language='cs'){
 if(!row||!(row.id in HINGE_GUARDS))return null;
 const field=language==='en'?'en':'cz';
 return exerciseEquipment(row).requirements.map(group=>group.map(id=>EXERCISE_EQUIPMENT.find(x=>x.id===id)?.[field]||id).join(language==='en'?' or ':' nebo '));
}
