import {addDays, validDate, dayNumber, TOGETHER_QUESTIONS} from './together.js';
import {DAILY_CONNECTION_PROMPTS} from './togetherConnectionContent.js';

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
    const saved=rows.find(row=>row.day===day&&row.question_id);
    const question=saved?readQuestionSnapshot(saved.question_id,saved.question_doc,day):legacyQuestion(day);
    return mine||partner?[{day,question,mine,partner:mine?partner:'',shared:!!(mine&&partner)}]:[];
  });
}
export function questionFor(date) {return TOGETHER_QUESTIONS[(dayNumber(date)%TOGETHER_QUESTIONS.length+TOGETHER_QUESTIONS.length)%TOGETHER_QUESTIONS.length];}
// The original seven prompts are a permanent contract for answer rows written before snapshots.
export function legacyQuestion(date) {
  const index=(dayNumber(date)%TOGETHER_QUESTIONS.length+TOGETHER_QUESTIONS.length)%TOGETHER_QUESTIONS.length;
  return {id:`legacy-${index}`,text:[...TOGETHER_QUESTIONS[index]]};
}
export function dailyQuestion(date) {
  const index=(dayNumber(date)%DAILY_CONNECTION_PROMPTS.length+DAILY_CONNECTION_PROMPTS.length)%DAILY_CONNECTION_PROMPTS.length;
  const prompt=DAILY_CONNECTION_PROMPTS[index];
  return {id:`connection-v1-${prompt.id}`,text:[prompt.question.cs,prompt.question.en]};
}
export function readQuestionSnapshot(id,doc,date) {
  let text;try{text=JSON.parse(doc);}catch{/* Legacy rows have no snapshot. */}
  if(typeof id==='string'&&Array.isArray(text)&&text.length===2&&text.every(value=>typeof value==='string'&&value.length>0))return {id,text};
  return legacyQuestion(date);
}
export function activityOverview(plans,today) {
  const since=addDays(today,-29);
  return {completed:plans.filter(p=>p.status==='done'&&p.date>=since&&p.date<=today),upcoming:plans.filter(p=>p.status==='planned').toSorted((a,b)=>(a.date+a.time).localeCompare(b.date+b.time))};
}
