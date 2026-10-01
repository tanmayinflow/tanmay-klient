import {validDate} from './together.js';
import {CYCLE_FOOD} from './togetherCycleFood.js';
import {CYCLE_RITUALS,CYCLE_STORIES} from './togetherCycleImagery.js';

const shelves={food:CYCLE_FOOD,ritual:CYCLE_RITUALS,story:CYCLE_STORIES};
export function cycleChoices(phase,topic){
  return shelves[topic]?.[phase]||[];
}

// A calendar day has a stable starting suggestion. Adjacent days move by one,
// while manual browsing never changes the calendar or any personal record.
export function cycleChoice(phase,topic,date,offset=0){
  const items=cycleChoices(phase,topic),total=items.length;
  if(!total)return {item:null,index:0,total:0};
  const day=validDate(date)?Math.floor(Date.parse(`${date}T12:00:00Z`)/86400000):0;
  const seed=Array.from(`${phase}:${topic}`).reduce((n,c)=>n+c.charCodeAt(0),0);
  const shift=Number.isSafeInteger(offset)?offset:0;
  const index=((day+seed+shift)%total+total)%total;
  return {item:items[index],index,total};
}
