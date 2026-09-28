import {addDays,cycleSummary,dateKey,dayNumber,validDate} from "./together.js";

// Educational suggestions, not phase-based exercise prescriptions.
export const CYCLE_GUIDE = {
  menstrual: {name:["Menstruační fáze","Menstrual phase"],about:["Menstruace otevírá nový cyklus. Je zároveň začátkem folikulární fáze; pro přehled ji ukazujeme samostatně.","Menstruation opens a new cycle. It is also the start of the follicular phase; it is shown separately here."],woman:["Pokud je ti příjemně, běžný pohyb může pokračovat. Při křečích zkus teplo, procházku nebo jemné protažení. Intenzitu sniž podle potíží, ne automaticky podle kalendáře.","Continue normal movement if comfortable. For cramps, try warmth, a walk or gentle stretching. Adjust intensity to symptoms, not automatically to the calendar."],partner:["Zeptej se, zda pomůže teplo, jídlo, převzetí úkolu nebo prostor. Nabídni klidnější variantu společného plánu a respektuj odpověď.","Ask whether warmth, food, taking over a task or some space would help. Offer a quieter plan and respect the answer."],idea:["Procházka nebo čaj bez spěchu","An unhurried walk or tea"]},
  follicular: {name:["Folikulární fáze","Follicular phase"],about:["Před ovulací dozrávají folikuly. Délka této části cyklu se může měnit; více energie není pravidlem pro každou ženu.","Follicles develop before ovulation. The length of this phase can vary; increased energy is not universal."],woman:["Jestli se cítíš dobře, drž svůj obvyklý silový či vytrvalostní plán. Novou dovednost nebo náročnější výlet vybírej podle chuti a zotavení.","If you feel well, follow your usual strength or endurance plan. Choose a new skill or a longer outing according to interest and recovery."],partner:["Nabídni něco nového, ale nepředpokládej, že musí mít více energie. Domluvte si délku aktivity i možnost změnit plán.","Offer something new without assuming extra energy. Agree on the duration and an option to change plans."],idea:["Vyzkoušet společně něco nového","Try something new together"]},
  ovulatory: {name:["Možné ovulační období","Possible ovulatory phase"],about:["Ovulace je uvolnění vajíčka. Tady prohlížíš širší období, do kterého by podle délky cyklu mohla spadat.","Ovulation is the release of an egg. Here you are exploring the broader part of the cycle in which it may occur."],woman:["Pohyb, setkání i intimitu vybírej podle vlastního pocitu. Kalendář není důvod přidávat zátěž ani podstupovat osobní rekord.","Choose movement, social time and intimacy according to how you feel. A calendar is no reason to increase load or attempt a personal best."],partner:["Ptej se na přání a souhlas. Vyšší chuť na kontakt nebo sex není povinnost ani spolehlivý znak fáze.","Ask about wishes and consent. Greater interest in company or sex is neither an obligation nor a reliable sign of a phase."],idea:["Rande podle společné chuti","A date you both feel like"]},
  luteal: {name:["Luteální fáze","Luteal phase"],about:["Po ovulaci následuje luteální fáze. U některých žen se před menstruací objevují potíže PMS; jejich přítomnost i intenzita jsou individuální.","The luteal phase follows ovulation. Some people experience premenstrual symptoms; their presence and intensity vary."],woman:["Udržuj pravidelný spánek, jídlo a pohyb. Při únavě nebo potížích uprav délku a náročnost tréninku. Zapisuj vlastní zkušenost, ať vidíš svůj vzorec.","Keep sleep, meals and movement regular. Adjust session length and effort when tired or symptomatic. Track your own experience to notice patterns."],partner:["Naslouchej bez vysvětlování pocitů hormony. Nabídni konkrétní pomoc a plán s menším časovým tlakem, pokud o něj stojí.","Listen without explaining feelings away as hormones. Offer practical help and a less time-pressured plan if wanted."],idea:["Společná večeře a volný večer","Dinner together and an unhurried evening"]}
};
export function cyclePhase(doc, summary, today) {
  if(!summary?.day || doc.mode === "paused") return {id:null,basis:"unknown"};
  if(summary.observedBleeding || ["light","medium","heavy"].includes(doc.days?.[today]?.flow)) return {id:"menstrual",basis:"recorded"};
  if(summary.reason!=="estimate" || !summary.next || summary.day>summary.median) return {id:null,basis:"unknown"};
  const approx=summary.median-14;
  return {id:summary.day<approx-2?"follicular":summary.day<=approx+2?"ovulatory":"luteal",basis:"estimated"};
}
// The selected-day view is calculated on the owner's document, never from a
// recipient reconstructing raw dates. The API must still allowlist each grant.
// Only explicitly future dates may roll into an unrecorded cycle. Today and
// historical days keep their recorded cycle day, even when a period is late.
export function cycleViewForDate(doc, date, referenceDate=dateKey()) {
  const unknown={id:null,basis:"unknown"};
  if(!validDate(date)||!validDate(referenceDate)) return {date,cycle:{day:null,next:null,reason:"empty",cycles:0},phase:unknown};
  const safeDoc={...doc,periods:(doc?.periods||[]).filter(p=>p.start<=referenceDate)};
  const cycle=cycleSummary(safeDoc,date);
  if(date<=referenceDate) return {date,cycle,phase:cyclePhase(safeDoc,cycle,date)};
  const current=cycleSummary(safeDoc,referenceDate);
  if(current.reason!=="estimate"||!current.next||dayNumber(date)-dayNumber(referenceDate)>90) {
    return {date,cycle:{day:null,next:null,reason:current.reason==="estimate"?"horizon":current.reason,cycles:current.cycles},phase:unknown};
  }
  const elapsed=dayNumber(date)-dayNumber(current.lastStart);
  const projectedCycles=Math.floor(elapsed/current.median);
  if(projectedCycles>3) return {date,cycle:{day:null,next:null,reason:"horizon",cycles:current.cycles},phase:unknown};
  const day=elapsed%current.median+1;
  const durations=safeDoc.periods.filter(p=>p.end&&p.end<=referenceDate).slice(-6).map(p=>dayNumber(p.end)-dayNumber(p.start)+1).filter(n=>n>=2&&n<=7).sort((a,b)=>a-b);
  const duration=durations.length?durations[Math.floor(durations.length/2)]:null;
  const shifted={...current,day,observedBleeding:false,projected:true,next:{...current.next,from:addDays(current.next.from,projectedCycles*current.median),to:addDays(current.next.to,projectedCycles*current.median)}};
  // Estimated bleeding length is personal recorded history, not a fixed five
  // days. Without completed records only the expected start can be named.
  const phase=day<=(duration||1)
    ? {id:"menstrual",basis:"estimated"}
    : cyclePhase({...safeDoc,days:{}},shifted,date);
  return {date,cycle:shifted,phase};
}
export function cyclePhaseForDate(doc,date,referenceDate=dateKey()) {
  return cycleViewForDate(doc,date,referenceDate).phase;
}
export const CYCLE_SOURCES=[
  ["NHS · průběh a proměnlivost cyklu","https://www.nhs.uk/conditions/periods/fertility-in-the-menstrual-cycle/"],
  ["Office on Women's Health · cyklus","https://womenshealth.gov/menstrual-cycle/your-menstrual-cycle"],
  ["NHS · bolest při menstruaci","https://www.nhs.uk/conditions/period-pain/"],
  ["NHS · PMS","https://www.nhs.uk/conditions/pre-menstrual-syndrome/"]
];
