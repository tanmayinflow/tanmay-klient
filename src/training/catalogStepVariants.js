// Original bilingual coaching. Sources and selection rationale:
// Reviews/step-refinement-2026-10-22/. Loads are total external kg per repetition.
import {exerciseEquipment,EXERCISE_EQUIPMENT} from './exerciseEquipment.js';
import {STEP_GUARDS} from './catalogStepAuditData.js';
const platform=['step_platform','schody','lavice'];
const base={pat:'drep',mp:['qua','glu'],ms:['ham','cal'],S:2,C:2,J:{kol:1,kot:1},pop:2,mode:'reps',load:'ext',measurementType:'WEIGHT_REPS',sideMode:'perSide',tier:'extended',genRule:'explicit',sessionRole:'strength',goalRole:'strength',family:'step_up',ez:'stepup',hd:null,defaultRestSec:90};
const tax=(equipment,supports=['chair_bench'])=>({regions:['thighs','hips'],secondaryRegions:['lower_legs'],movements:['step'],focus:['strength'],positions:['standing'],supports,priority:1,equipmentRequirements:[platform,...equipment.map(x=>[x])]});
const execution=['Přenes váhu na celé horní chodidlo, vystup a druhou nohu přilož na schod. Potom druhou nohou sestup na zem, zatímco horní noha návrat kontroluje. Výstup a návrat jsou jedno opakování; dokonči stranu a potom nohy vyměň.','Shift weight onto the whole elevated foot, step up and bring the other foot onto the step. Lower the other foot to the floor while the elevated leg controls the return. One ascent and return count as one repetition; finish one side, then switch legs.'];
const caution=['Vyhni se prudkému odrazu spodní nohou a dopadu dolů. Koleno veď přibližně se směrem chodidla; mírný náklon trupu vpřed je přirozený. Pokud ztrácíš kontrolu, sniž zátěž nebo výšku.','Avoid a forceful push from the lower leg and dropping to the floor. Let the knee generally follow the foot; a slight forward trunk lean is natural. Reduce load or step height if control is lost.'];
const progression=['Lehčí: nižší schod, menší zátěž nebo výstup bez zátěže. Postupně měň počet opakování, tempo nebo zátěž, vždy jednu podmínku. Vyšší schod není povinná progrese.','Easier: a lower step, less weight or an unloaded step-up. Adjust repetitions, tempo or load one condition at a time. A taller step is not a mandatory progression.'];
const source={author:'Catalyst Athletics',document:'Step-up',url:'https://www.catalystathletics.com/exercise/560/Step-up/',scope:'Reference for load positions and controlled step-up. Original bilingual instructions and equipment choices; not an official programme or universal dose.'};
export const STEP_VARIANTS=[
 {...base,id:'st26_db_supported',variantKey:'st26_db_supported',cz:'Výstup s jednoručkou a oporou ruky',en:'Supported Single-Dumbbell Step-Up',eq:['dumbbell','step_platform','fixed_support'],
  aliases:['výstup s jednou činkou','supported dumbbell step up'],
  pos:['Před nízkým pevným schodem drž jednu jednoručku podél těla na opačné straně než vystupující noha. Druhou rukou se přidrž pevného madla. Celé chodidlo vystupující nohy polož na schod. Opora musí být stabilní a mimo dráhu činky.','Facing a low stable step, hold one dumbbell at your side on the opposite side to the leading leg. Hold a fixed rail with the other hand. Place the whole leading foot on the step. The support must be stable and clear of the dumbbell.'],
  exe:execution,wat:[caution[0]+' Pomoc ruky používej podle potřeby. Před výměnou strany činku bezpečně odlož.',caution[1]+' Use hand assistance as needed. Set the dumbbell down safely before switching sides.'],pro:progression,
  foc:['Zapiš hmotnost jedné činky, opakování na každou stranu, výšku schodu a míru pomoci ruky. Opora dovoluje dávkovat zátěž bez nutnosti současně omezovat přidržení.','Record the single dumbbell weight, repetitions per side, step height and hand assistance. Support allows load to be adjusted without requiring less hand assistance at the same time.'],
  taxonomy:tax(['dumbbell','fixed_support'],['chair_bench','hand_support']),source:{...source,scope:source.scope+' Supported opposite-side dumbbell variation is our explicit practical adaptation; hand support is required for this card.'}},
 {...base,id:'st26_db_pair',variantKey:'st26_db_pair',cz:'Výstup se dvěma jednoručkami',en:'Two-Dumbbell Step-Up',eq:['dumbbell_pair','step_platform'],aliases:['výstup s činkami','dumbbell step up','DB step up'],
  pos:['Stůj před nízkým pevným schodem nebo bednou. V každé ruce drž stejně těžkou jednoručku podél těla. Celé chodidlo jedné nohy polož nahoru; výšku a váhu zvol tak, abys zvládl i kontrolovaný návrat bez opory ruky.','Stand facing a low stable step or box. Hold equally weighted dumbbells at your sides, one in each hand. Place one whole foot on top; choose a height and load that allow a controlled return without hand support.'],
  exe:execution,wat:[caution[0]+' Nehoupej činkami a neotáčej se s nimi na schodu. Pokud potřebuješ oporu ruky, zvol variantu s jednou činkou a madlem.',caution[1]+' Do not swing the dumbbells or turn while on the step. If hand support is needed, use the single-dumbbell supported variation.'],pro:progression,
  foc:['Do váhy zapisuj součet obou činek: 2 × 6 kg znamená 12 kg. Opakování platí na každou stranu zvlášť; poznamenej výšku schodu.','Record the combined weight of both dumbbells: 2 × 6 kg means 12 kg. Repetitions are per side; note the step height.'],taxonomy:tax(['dumbbell_pair']),source},
 {...base,id:'st26_barbell',variantKey:'st26_barbell',cz:'Výstup s velkou činkou na zádech',en:'Back-Rack Barbell Step-Up',eq:['cinka','step_platform','squat_rack'],S:3,C:3,defaultRestSec:120,aliases:['barbell step up','výstup s osou'],
  pos:['Tuto variantu zvol, až zvládáš stabilní výstup i sestup se zátěží. Připrav nízkou pevnou platformu a stojan s bezpečnostními dorazy, který umožňuje celý pohyb bez nárazu osy. Činku vezmi ze stojanu na svaly horní části zad, ne na krk. Oběma rukama drž osu; celé chodidlo jedné nohy polož na platformu.','Choose this variation once loaded ascent and descent are stable. Prepare a low firm platform and a rack with safety stops, arranged to allow the entire movement without the bar hitting anything. Unrack the bar onto the upper-back muscles, not the neck. Hold the bar with both hands and place one whole foot on the platform.'],
  exe:execution,wat:[caution[0]+' Bez vhodného prostoru pro osu, bezpečného odebrání a odložení zátěže tuto variantu nevol. Neotáčej se na platformě. Pokud potřebuješ oporu ruky, použij jinou variantu.',caution[1]+' Do not use this variation without bar clearance and safe unracking and reracking. Do not turn on the platform. Choose another variation if hand support is needed.'],pro:progression,
  foc:['Zapisuj celkovou hmotnost osy a kotoučů, opakování na každou stranu a výšku platformy. Velká činka je možnost zatížení, nikoli povinný cíl pro každého.','Record total bar and plate weight, repetitions per side and platform height. A barbell is a loading option, not a required goal for everyone.'],taxonomy:tax(['cinka','squat_rack']),source},
];

export function seedStepVariants(collection){
 if(!collection||collection.loadedSteps20261022)return collection;
 const rows=Array.isArray(collection.tEx)?collection.tEx:[],ids=new Set(rows.map(r=>r?.id));
 const additions=STEP_VARIANTS.filter(r=>!ids.has(r.id)).map(r=>({...JSON.parse(JSON.stringify(r)),ez:ids.has(r.ez)?r.ez:null}));
 return {...collection,tEx:additions.length?[...rows,...additions]:rows,loadedSteps20261022:true};
}

// Detail badges use the same OR/AND requirements as the library filter.
export function stepEquipmentLabels(row,language='cs'){
 if(!row||!(row.id in STEP_GUARDS||row.id==='st26_stair_walk'||STEP_VARIANTS.some(x=>x.id===row.id)))return null;
 const field=language==='en'?'en':'cz';
 return exerciseEquipment(row).requirements.map(group=>group.map(id=>EXERCISE_EQUIPMENT.find(x=>x.id===id)?.[field]||id).join(language==='en'?' or ':' nebo '));
}
