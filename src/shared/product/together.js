// Calendar education and optional estimates, never fertility/contraception prescriptions.
import {cyclePhase} from "./togetherGuidance.js";
export const TOGETHER_SCOPES = ["cycle", "wellbeing", "support", "phase"];
export const dateKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
export function validDate(s) { return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s)) && new Date(s+"T12:00:00Z").toISOString().slice(0,10) === s; }
export const dayNumber = s => Math.floor(Date.parse(s+"T12:00:00Z")/86400000);
export const addDays = (s,n) => new Date((dayNumber(s)+n)*86400000).toISOString().slice(0,10);
export const emptyTogether = () => ({ periods: [], mode: "observe", usualLength: 28, days: {} });
const text = (v,n) => typeof v === "string" ? v.trim().slice(0,n) : "";
export function cleanTogether(value, today = dateKey()) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("invalid document");
  if (!Array.isArray(value.periods) || value.periods.length > 120) throw new Error("invalid periods");
  const periods = value.periods.map(p => {
    if (!p || !validDate(p.start) || p.start > today || (p.end && (!validDate(p.end) || p.end < p.start || p.end > today || dayNumber(p.end)-dayNumber(p.start)>60))) throw new Error("invalid period dates");
    return {start:p.start,end:p.end||null};
  }).sort((a,b)=>a.start.localeCompare(b.start));
  for(let i=1;i<periods.length;i++) if(periods[i].start <= (periods[i-1].end||periods[i-1].start)) throw new Error("overlapping periods");
  if (!Number.isInteger(value.usualLength) || value.usualLength < 15 || value.usualLength > 90) throw new Error("invalid cycle length");
  if (!["observe","estimate","paused"].includes(value.mode)) throw new Error("invalid mode");
  const days = {};
  if (!value.days || typeof value.days !== "object" || Array.isArray(value.days)) throw new Error("invalid days");
  if (Object.keys(value.days||{}).length>800) throw new Error("too many days");
  for(const [date,d] of Object.entries(value.days||{})) {
    if (!validDate(date) || date>today || !d || typeof d!=="object") throw new Error("invalid day");
    const energy = d.energy === null || d.energy === undefined ? null : d.energy;
    if (energy!==null && (!Number.isInteger(energy)||energy<1||energy>5)) throw new Error("invalid energy");
    days[date]={energy,mood:text(d.mood,80),support:text(d.support,300),note:text(d.note,1500),pain:["none","mild","moderate","strong"].includes(d.pain)?d.pain:"none",flow:["none","spotting","light","medium","heavy"].includes(d.flow)?d.flow:"none"};
  }
  return {periods,mode:value.mode,usualLength:value.usualLength,days};
}
export function cycleSummary(doc, today = dateKey()) {
  const periods=(doc?.periods||[]).filter(p=>p.start<=today).sort((a,b)=>a.start.localeCompare(b.start));
  const last=periods.at(-1);
  if(!last) return {day:null,next:null,reason:"empty",cycles:0};
  const intervals=periods.slice(1).map((p,i)=>dayNumber(p.start)-dayNumber(periods[i].start)).slice(-6);
  const sorted=intervals.toSorted((a,b)=>a-b);
  const median=sorted.length?Math.round((sorted[Math.floor((sorted.length-1)/2)]+sorted[Math.floor(sorted.length/2)])/2):doc.usualLength;
  const day=dayNumber(today)-dayNumber(last.start)+1;
  const observedBleeding=!!(last.end&&last.end>=today) || last.start===today;
  const base={day,observedBleeding,lastStart:last.start,cycles:intervals.length,median};
  if(doc.mode!=="estimate") return {...base,next:null,reason:doc.mode==="paused"?"paused":"observe"};
  if(median<21||median>35||intervals.some(n=>n<21||n>35) || (sorted.length>1&&sorted.at(-1)-sorted[0]>7)) return {...base,next:null,reason:"variable"};
  const spread=sorted.length>1?Math.max(3,Math.ceil((sorted.at(-1)-sorted[0])/2)):4;
  const next={from:addDays(last.start,median-spread),to:addDays(last.start,median+spread),basedOn:intervals.length?"history":"manual"};
  if(today>next.to) return {...base,next:null,reason:"outdated"};
  return {...base,next,reason:"estimate"};
}
// Allowlist projections. No notes, raw bleeding/symptom history or private mode escapes.
export function togetherProjection(doc, scopes, today=dateKey()) {
  const out={}; const d=doc.days?.[today];
  if(scopes.includes("cycle")) { const {day,next,reason,cycles}=cycleSummary(doc,today); out.cycle={day,next,reason,cycles}; }
  if(scopes.includes("phase")) out.phase=cyclePhase(doc,cycleSummary(doc,today),today);
  if(scopes.includes("wellbeing")&&d) out.wellbeing={date:today,energy:d.energy,mood:d.mood};
  if(scopes.includes("support")&&d) out.support={date:today,text:d.support};
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
