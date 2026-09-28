import {addDays, validDate, dayNumber, TOGETHER_QUESTIONS} from './together.js';
import {DAILY_CONNECTION_PROMPTS} from './togetherConnectionContent.js';

export function weekOf(date) {
  return addDays(date,-((new Date(date+'T12:00:00Z').getUTCDay()+6)%7));
}
export const FOLLOW_THROUGH = [
  {id:'tried',cs:'Zkusili jsme to',en:'We tried it'},
  {id:'partly',cs:'Zčásti',en:'Partly'},
  {id:'not-yet',cs:'Zatím ne',en:'Not yet'},
  {id:'changed',cs:'Dohodu jsme změnili',en:'We changed the agreement'},
];
export function cleanReflection(value,forWeek) {
  if(!value || typeof value!=='object' || Array.isArray(value)) throw new Error('invalid-reflection');
  const text=v=>typeof v==='string'?v.trim().slice(0,400):'';
  const result=Object.fromEntries(['appreciation','need','next'].map(key=>[key,text(value[key])]));
  const follow=value.followThrough;
  // Optional extension leaves all legacy documents and withdrawal payloads unchanged.
  if(follow&&typeof follow==='object'&&!Array.isArray(follow)&&validDate(follow.week)&&follow.week===weekOf(follow.week)&&(!forWeek||follow.week<forWeek)&&FOLLOW_THROUGH.some(s=>s.id===follow.status)&&text(follow.step)){
    result.followThrough={week:follow.week,step:text(follow.step),status:follow.status,note:text(follow.note)};
  }
  return result;
}
export function hasReflection(value) {return ['appreciation','need','next'].some(key=>!!value?.[key])||!!value?.followThrough?.status;}
export function previousReflection(rows,week,side='mine') {
  return rows.filter(row=>row.side===side&&validDate(row.week)&&row.week<week&&row.doc?.next?.trim()).toSorted((a,b)=>b.week.localeCompare(a.week))[0]||null;
}
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
