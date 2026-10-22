import {applyCatalogCorrections} from './catalogCorrections.js';
import {LUNGE_CORRECTIONS,LUNGE_TAXONOMY,LUNGE_GUARDS,LUNGE_FOUNDATIONS} from './catalogLungeAuditData.js';

const flag='lungeContentAudit20261022';
const copy=value=>JSON.parse(JSON.stringify(value));
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const clientMissingLinks={kb26_goblet_split:'an_splitsquat',kb26_rack_reverse_lunge:'an_revlunge'};

/** Main already owns these identities; never resurrect its removed cards.
 * Client explicitly opts into two newly authored neutral foundations once.
 * Neither application copies an account record, programme or history. */
export function applyLungeAudit(collection,{includeLungeFoundations=false}={}) {
  if(!collection||collection[flag])return collection;
  const previous=Array.isArray(collection.tEx)?collection.tEx:[];
  const have=new Set(previous.map(row=>row?.id));
  const additions=includeLungeFoundations?LUNGE_FOUNDATIONS.filter(row=>!have.has(row.id)).map(copy):[];
  const seeded=additions.length?{...collection,tEx:[...previous,...additions]}:collection;
  const corrected=applyCatalogCorrections(seeded,LUNGE_CORRECTIONS,flag);
  const beforeById=new Map(previous.map(row=>[row?.id,row]));
  const existingIds=new Set((corrected.tEx||[]).map(row=>row?.id));
  let changed=false;
  const rows=(corrected.tEx||[]).map(row=>{
    if(!row)return row;
    const guard=LUNGE_GUARDS[row.id],defaults=LUNGE_TAXONOMY[row.id];
    const reviewed=guard&&Object.entries(guard).every(([key,value])=>equal(row[key],value));
    const old=beforeById.get(row.id),renamed=old&&(old.cz!==row.cz||old.en!==row.en);
    if(!reviewed&&!renamed)return row;
    const taxonomy={...(reviewed?copy(defaults):{}),...row.taxonomy};
    if(renamed)taxonomy.aliases=[...new Set([...(taxonomy.aliases||[]),old.cz,old.en].filter(Boolean))];
    // Client historically removed these links because their targets were absent.
    // Restore only the known null default on the reviewed, unchanged card.
    const target=clientMissingLinks[row.id];
    const restoreLink=includeLungeFoundations&&reviewed&&old?.ez===null&&target&&existingIds.has(target);
    if(equal(taxonomy,row.taxonomy)&&!restoreLink)return row;
    changed=true;return {...row,taxonomy,...(restoreLink?{ez:target}:{})};
  });
  return changed?{...corrected,tEx:rows}:corrected;
}
