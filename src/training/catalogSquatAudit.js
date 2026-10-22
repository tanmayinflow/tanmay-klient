import { applyCatalogCorrections } from './catalogCorrections.js';
import { SQUAT_CORRECTIONS, SQUAT_TAXONOMY, SQUAT_GUARDS } from './catalogSquatAuditData.js';

const flag = 'squatContentAudit20261022';
const copy = value => JSON.parse(JSON.stringify(value));
const equal = (a,b) => JSON.stringify(a) === JSON.stringify(b);
const foundation = { pat:'drep', mp:['qua','glu'], ms:['abs'], S:1, C:1, J:{kol:1,kyc:1}, pop:3,
  mode:'reps', load:'none', measurementType:'BODYWEIGHT_REPS', sideMode:'none', tier:'core',
  sessionRole:'strength', goalRole:'strength', genRule:'generic', family:'squat_bilateral', defaultRestSec:60,
  ez:null, hd:null, source:{author:'NHS',document:'Strength exercises',url:'https://www.nhs.uk/live-well/exercise/strength-exercises/',scope:'Sit-to-stand and supported mini-squat tasks. Original bilingual coaching with adjustable seat height, range and assistance; not a clinical prescription.'} };

export const SQUAT_EXERCISES = [
  { ...foundation, id:'sq26_sit_to_stand', variantKey:'sq26_sit_to_stand', cz:'Vstávání ze židle', en:'Sit-to-Stand', eq:['chair'],
    aliases:['vstávání ze sedu','sed a vstávání','chair stand','sit to stand'],
    pos:['Sedni si na pevnou židli nebo lavici, která se neposouvá. Chodidla opři celou plochou o zem. Výšku sedáku zvol tak, abys dokázal vstát s přiměřenou pomocí nebo bez ní.','Sit on a stable chair or bench that cannot slide. Place both feet flat on the floor. Choose a seat height that allows you to stand with suitable assistance or independently.'],
    exe:['Nakloň trup dopředu nad chodidla a tlakem nohama se postav. Potom pokrč kyčle a kolena a pomalu se vrať do sedu. Jeden vztyk a návrat jsou jedno opakování.','Lean your trunk forward over your feet and push through your legs to stand. Bend at the hips and knees to sit down slowly. One rise and return count as one repetition.'],
    wat:['Na sedák nedopadej. Před začátkem ověř stabilitu židle. Pokud se nedaří plynule vstát, použij vyšší pevný sedák nebo si pomoz rukama o stabilní oporu.','Do not drop onto the seat. Check that the chair is stable before starting. If standing is difficult, use a higher firm seat or help with your hands on a stable support.'],
    pro:['Lehčí: vyšší sedák a větší pomoc rukou. Náročnost měň menší pomocí, počtem kontrolovaných opakování nebo výškou sedáku. Měň jednu podmínku a zaznamenej ji.','Easier: a higher seat and more hand assistance. Adjust assistance, controlled repetitions or seat height one at a time, and record the change.'],
    foc:['Plynule vstaň a kontrolovaně dosedni. Poznamenej výšku sedáku a případnou pomoc rukou.','Stand smoothly and sit with control. Note seat height and any hand assistance.'],
    taxonomy:{regions:['thighs','hips'],secondaryRegions:['trunk'],movements:['squat'],focus:['strength'],positions:['seated'],supports:['chair_bench'],priority:0,equipmentRequirements:[['chair','lavice']]},
  },
  { ...foundation, id:'sq26_supported', variantKey:'sq26_supported', cz:'Dřep s pevnou oporou rukou', en:'Squat with Fixed Hand Support', eq:['fixed_support'],
    aliases:['dřep s oporou','asistovaný dřep','supported squat'],
    pos:['Postav se před pevnou oporu, která se při přidržení nepohne. Lehce se přidrž oběma rukama. Chodidla nastav do pohodlného postoje a nech je celou plochou na zemi.','Stand facing a fixed support that will not move when held. Hold lightly with both hands. Choose a comfortable stance with both feet grounded.'],
    exe:['Pokrč kyčle a kolena a klesni do hloubky, kterou ovládáš. S potřebnou pomocí rukou se plynule postav. Kolena nech směřovat přibližně s chodidly.','Bend at the hips and knees and lower through a range you control. Stand smoothly with as much hand assistance as needed. Let knees generally follow the feet.'],
    wat:['Nevěš se na lehkou židli nebo předmět, který můžeš převrátit. Nesnaž se získat větší hloubku ztrátou rovnováhy. Trup se může přirozeně naklonit.','Do not hang from a lightweight chair or an object that can tip. Avoid chasing depth at the cost of balance. Allow a natural trunk lean.'],
    pro:['Začni menší hloubkou a potřebnou pomocí rukou. Podle cíle postupně měň hloubku, pomoc nebo počet opakování; není nutné měnit vše současně.','Begin with less depth and suitable hand assistance. Adjust depth, assistance or repetitions gradually according to the goal, one demand at a time.'],
    foc:['Pevná opora pomáhá tolik, kolik potřebuješ. Zaznamenej rozsah a míru dopomoci.','Use as much fixed support as needed. Note range and amount of assistance.'],
    taxonomy:{regions:['thighs','hips'],secondaryRegions:['trunk'],movements:['squat'],focus:['strength'],positions:['standing'],supports:['hand_support','assisted'],priority:0,equipmentRequirements:[['fixed_support']]},
  },
];
export const SQUAT_META=Object.fromEntries(SQUAT_EXERCISES.map(row=>[row.id,{t:'core',s:'active',g:'generic',r:'strength',b:'strength',tr:1,f:row.family,src:'tanmay',ev:'medium'}]));

/** One bounded migration. No account notes, programme references or logs change. */
export function applySquatAudit(collection) {
  if (!collection) return collection;
  if (collection[flag]) return applyFoundationLabels(collection);
  const previous=Array.isArray(collection.tEx)?collection.tEx:[];
  const have=new Set(previous.map(row=>row?.id));
  const additions=SQUAT_EXERCISES.filter(row=>!have.has(row.id)).map(copy);
  const seeded=additions.length?{...collection,tEx:[...previous,...additions]}:collection;
  const corrected=applyCatalogCorrections(seeded,SQUAT_CORRECTIONS,flag);
  let changed=false;
  const rows=(corrected.tEx||[]).map(row=>{
    if (!row) return row;
    if (!row) return row;
    const defaults=SQUAT_TAXONOMY[row.id], guard=SQUAT_GUARDS[row.id];
    const old=previous.find(item=>item?.id===row.id);
    const reviewed=defaults&&guard&&Object.entries(guard).every(([key,value])=>equal(row[key],value));
    const renamed=old && (old.cz!==row.cz||old.en!==row.en);
    if(!reviewed&&!renamed)return row;
    const taxonomy={...(reviewed?copy(defaults):{}),...row.taxonomy};
    if(renamed)taxonomy.aliases=[...new Set([...(taxonomy.aliases||[]),old.cz,old.en].filter(Boolean))];
    if(equal(taxonomy,row.taxonomy))return row;
    changed=true;return {...row,taxonomy};
  });
  return applyFoundationLabels(changed?{...corrected,tEx:rows}:corrected);
}

// Repair the legacy detail badge for the first published foundation seeds.
// Apply once and only to their unchanged authored identity and instructions.
function applyFoundationLabels(collection) {
  const corrections=Object.fromEntries(SQUAT_EXERCISES.filter(seed=>{
    const row=collection.tEx?.find(row=>row?.id===seed.id);
    return row&&['cz','en','pos','exe','eq'].every(key=>equal(row[key],seed[key]));
  }).map(seed=>[seed.id,{pop:{before:1,after:3}}]));
  return applyCatalogCorrections(collection,corrections,'squatFoundationLabel20261022');
}
