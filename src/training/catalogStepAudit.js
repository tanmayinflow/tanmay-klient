import {applyCatalogCorrections} from './catalogCorrections.js';
import {STEP_CORRECTIONS,STEP_TAXONOMY,STEP_GUARDS} from './catalogStepAuditData.js';
const flag='stepContentAudit20261022';
const copy=value=>JSON.parse(JSON.stringify(value));
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);

export const STEP_EXERCISES=[{
 id:'st26_stair_walk',variantKey:'st26_stair_walk',cz:'Chůze po schodech',en:'Stair Walking',
 pat:'prenos',eq:['schody','fixed_support'],mp:['qua','glu'],ms:['cal','ham'],S:2,C:2,J:{kol:1,kot:1},pop:2,
 mode:'sec',load:'none',measurementType:'DURATION',sideMode:'none',tier:'activity',
 sessionRole:'conditioning',goalRole:'conditioning',genRule:'cond',family:'stairs',ez:null,hd:null,defaultRestSec:60,
 aliases:['chůze do schodů','chůze ze schodů','schodiště','stair ascent','stair descent'],
 pos:['Vyber krátké dobře osvětlené schodiště s pevnými neklouzavými stupni a zábradlím. Nech si volnou ruku k přidržení. Začni u spodního schodu.','Choose a short, well-lit staircase with firm non-slip treads and a handrail. Keep a hand free for support. Start at the bottom step.'],
 exe:['Vystupuj po jednotlivých schodech. Na podestě se klidně otoč a sestup čelem ve směru chůze, s kontrolou každého kroku. Přidržuj se podle potřeby. Pokud je střídání nohou náročné, přilož druhou nohu na stejný schod.','Walk up one step at a time. Turn calmly on the landing and descend facing the direction of travel, controlling every step. Use the rail as needed. If alternating legs is difficult, bring the second foot onto the same step.'],
 wat:['Nepřeskakuj schody a nechoď po nich pozpátku. Nezrychluj sestup kvůli času. Při nejistotě zkrať úsek a použij zábradlí; nenos zátěž, která ti brání se přidržet.','Do not skip steps or walk backwards on stairs. Do not rush the descent to beat a time. Shorten the bout and use the rail if unsteady; do not carry a load that prevents hand support.'],
 pro:['Lehčí: několik nízkých schodů s oporou a odpočinkem. Postupně měň délku úseku nebo počet opakovaných úseků. Rychlost sestupu a omezení opory nejsou povinné cíle.','Easier: a few low steps with support and rests. Gradually adjust bout length or the number of bouts. Faster descent and removing hand support are not mandatory goals.'],
 foc:['Zapisuj čas pohybu bez odpočinku. Do poznámky přidej počet schodů nebo pater a zda šlo o výstup, sestup či obojí; různé trasy neporovnávej jen podle času.','Record moving time excluding rests. Note steps or flights and whether you climbed, descended or did both; do not compare different routes by time alone.'],
 source:{author:'National Ageing Research Institute',document:'Stairs',url:'https://www.nari.net.au/FAQs/qr-stairs',scope:'Stair walking with support and rest options. Original general bilingual coaching; no universal dose, clinical protocol or mandatory unsupported/loaded progression.'},
 taxonomy:{regions:['thighs','hips'],secondaryRegions:['lower_legs'],movements:['step','locomotion'],focus:['conditioning'],positions:['standing'],supports:['chair_bench','hand_support'],priority:1,equipmentRequirements:[['schody'],['fixed_support']]},
}];

/** Bounded neutral catalogue update. No account records, plans or logs copied. */
export function applyStepAudit(collection){
 if(!collection||collection[flag])return collection;
 const previous=Array.isArray(collection.tEx)?collection.tEx:[];
 const have=new Set(previous.map(r=>r?.id));
 const additions=STEP_EXERCISES.filter(r=>!have.has(r.id)).map(copy);
 const seeded=additions.length?{...collection,tEx:[...previous,...additions]}:collection;
 const corrected=applyCatalogCorrections(seeded,STEP_CORRECTIONS,flag);
 const before=new Map(previous.map(r=>[r?.id,r]));let changed=false;
 const rows=corrected.tEx.map(row=>{
  if(!row)return row;
  const guard=STEP_GUARDS[row.id],defaults=STEP_TAXONOMY[row.id],old=before.get(row.id);
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
