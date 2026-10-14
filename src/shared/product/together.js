// Calendar education and optional estimates, never fertility/contraception prescriptions.
import {cyclePhase,cycleViewForDate} from "./togetherGuidance.js";
import {dateKey,validDate,dayNumber,cycleSummary} from './togetherCycleData.js';
export {dateKey,validDate,dayNumber,addDays,cycleSummary} from './togetherCycleData.js';
export const TOGETHER_SCOPES = ["cycle", "wellbeing", "support", "phase", "cycle-note", "pain", "flow"];
export const emptyTogether = () => ({ periods: [], mode: "estimate", modeChosen: false, usualLength: 28, days: {} });
// Older accounts inherited records-only before estimates were the default.
// Adapt reads without rewriting history or advancing the saved revision.
// A saved checkbox from the period editor, an explicit choice, and pauses stay intact.
export function readTogether(value) {
  if (!value) return emptyTogether();
  const hasPeriodChoice = Array.isArray(value.periods) && value.periods.some(p => Number.isInteger(p?.expectedLength) && p.expectedLength >= 1 && p.expectedLength <= 14);
  if (value.mode === "observe" && value.modeChosen === undefined && !hasPeriodChoice) return {...value, mode: "estimate", modeChosen: false};
  return value;
}
const text = (v,n) => typeof v === "string" ? v.trim().slice(0,n) : "";
export function cleanTogether(value, today = dateKey()) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("invalid document");
  if (!Array.isArray(value.periods) || value.periods.length > 120) throw new Error("invalid periods");
  const periods = value.periods.map(p => {
    if (!p || !validDate(p.start) || p.start > today || (p.end && (!validDate(p.end) || p.end < p.start || p.end > today || dayNumber(p.end)-dayNumber(p.start)>60))) throw new Error("invalid period dates");
    if (Object.hasOwn(p,"expectedLength") && (!Number.isInteger(p.expectedLength) || p.expectedLength<1 || p.expectedLength>14)) throw new Error("invalid expected period length");
    return {start:p.start,end:p.end||null,...(Object.hasOwn(p,"expectedLength")?{expectedLength:p.expectedLength}:{})};
  }).sort((a,b)=>a.start.localeCompare(b.start));
  for(let i=1;i<periods.length;i++) if(periods[i].start <= (periods[i-1].end||periods[i-1].start)) throw new Error("overlapping periods");
  if (!Number.isInteger(value.usualLength) || value.usualLength < 15 || value.usualLength > 90) throw new Error("invalid cycle length");
  if (!["observe","estimate","paused"].includes(value.mode)) throw new Error("invalid mode");
  if (Object.hasOwn(value,"modeChosen") && typeof value.modeChosen !== "boolean") throw new Error("invalid mode choice");
  const days = {};
  if (!value.days || typeof value.days !== "object" || Array.isArray(value.days)) throw new Error("invalid days");
  if (Object.keys(value.days||{}).length>800) throw new Error("too many days");
  for(const [date,d] of Object.entries(value.days||{})) {
    if (!validDate(date) || date>today || !d || typeof d!=="object") throw new Error("invalid day");
    const energy = d.energy === null || d.energy === undefined ? null : d.energy;
    if (energy!==null && (!Number.isInteger(energy)||energy<1||energy>5)) throw new Error("invalid energy");
    days[date]={energy,mood:text(d.mood,80),support:text(d.support,300),note:text(d.note,1500),cycleNote:text(d.cycleNote,1500),pain:["none","mild","moderate","strong"].includes(d.pain)?d.pain:"none",flow:["none","spotting","light","medium","heavy"].includes(d.flow)?d.flow:"none"};
  }
  return {periods,mode:value.mode,...(Object.hasOwn(value,"modeChosen")?{modeChosen:value.modeChosen}:{}),usualLength:value.usualLength,days};
}
// Allowlist projections. Legacy private notes and raw history never escape.
// Additional cycle details require independent grants, never inherited from old scopes.
export function togetherProjection(doc, scopes, today=dateKey()) {
  const out={}; const d=doc.days?.[today];
  if(scopes.includes("cycle")) { const {day,next,reason,cycles}=cycleSummary(doc,today); out.cycle={day,next,reason,cycles}; }
  if(scopes.includes("phase")) {
    // Historical projection calls may select a day before a known confirmed
    // end. Keep that recorded fact; use the shared view for every estimate.
    const recorded=cyclePhase(doc,cycleSummary(doc,today),today);
    out.phase=recorded.basis==="recorded"?recorded:cycleViewForDate(doc,today,today).phase;
  }
  if(scopes.includes("wellbeing")&&d) out.wellbeing={date:today,energy:d.energy,mood:d.mood};
  if(scopes.includes("support")&&d) out.support={date:today,text:d.support};
  if(scopes.includes("cycle-note")&&d?.cycleNote) out.cycleNote={date:today,text:d.cycleNote};
  if(scopes.includes("pain")&&d) out.pain={date:today,value:d.pain||"none"};
  if(scopes.includes("flow")&&d) out.flow={date:today,value:d.flow||"none"};
  return out;
}
export const TOGETHER_QUESTIONS = [
  ["Co by nám tento týden udělalo dobře?","What would feel good for us this week?"],
  ["Kdy ses se mnou naposledy cítil/a opravdu v klidu?","When did you last feel truly at ease with me?"],
  ["Co dnes můžu převzít, aby sis odpočinul/a?","What can I take care of so you can rest today?"],
  ["Co chceš, abych o tvém dnešku věděl/a?","What would you like me to know about your day?"],
  ["Na co se spolu můžeme těšit?","What can we look forward to together?"],
  ["Co bychom mohli zkusit poprvé?","What could we try for the first time?"],
  ["Za co si dnes chceme poděkovat?","What would we like to thank each other for today?"]
];
export const ACTIVITY_IDEAS = [
  {id:"walk",cs:"Krátká procházka",en:"A short walk",minutes:25,energy:1},
  {id:"tea",cs:"Čaj a čas bez telefonů",en:"Tea and phone-free time",minutes:20,energy:1},
  {id:"cook",cs:"Uvařit si společnou večeři",en:"Cook dinner together",minutes:50,energy:2},
  {id:"nature",cs:"Výlet do přírody",en:"Time in nature",minutes:120,energy:3},
  {id:"move",cs:"Jemný společný pohyb",en:"Gentle movement together",minutes:20,energy:1},
  {id:"new",cs:"Objevit nové místo",en:"Discover a new place",minutes:90,energy:2}
];
