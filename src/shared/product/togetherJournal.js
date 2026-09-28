import {addDays, validDate, dayNumber, TOGETHER_QUESTIONS} from './together.js';

export function weekOf(date) {
  return addDays(date,-((new Date(date+'T12:00:00Z').getUTCDay()+6)%7));
}
export function cleanReflection(value) {
  if(!value || typeof value!=='object' || Array.isArray(value)) throw new Error('invalid-reflection');
  return Object.fromEntries(['appreciation','need','next'].map(key=>[key,typeof value[key]==='string'?value[key].trim().slice(0,400):'']));
}
export function hasReflection(value) {return ['appreciation','need','next'].some(key=>!!value?.[key]);}
export function reflectionWeek(value,today) {return validDate(value)&&value===weekOf(value)&&value<=weekOf(today);}
// Preserve the existing double-answer reveal rule when browsing past conversations.
export function conversationHistory(rows,actor,other) {
  const days=[...new Set(rows.map(row=>row.day))].sort().reverse();
  return days.flatMap(day=>{
    const mine=rows.find(row=>row.day===day&&row.actor===actor)?.answer||'';
    const partner=rows.find(row=>row.day===day&&row.actor===other)?.answer||'';
    return mine||partner?[{day,mine,partner:mine?partner:'',shared:!!(mine&&partner)}]:[];
  });
}
export function questionFor(date) {return TOGETHER_QUESTIONS[(dayNumber(date)%TOGETHER_QUESTIONS.length+TOGETHER_QUESTIONS.length)%TOGETHER_QUESTIONS.length];}
export function activityOverview(plans,today) {
  const since=addDays(today,-29);
  return {completed:plans.filter(p=>p.status==='done'&&p.date>=since&&p.date<=today),upcoming:plans.filter(p=>p.status==='planned').toSorted((a,b)=>(a.date+a.time).localeCompare(b.date+b.time))};
}
