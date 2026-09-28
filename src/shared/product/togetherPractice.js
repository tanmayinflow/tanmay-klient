import {PARTNER_ROOMS} from './togetherPages.js';

const roomIds=new Set(PARTNER_ROOMS.map(room=>room.id));
const cleanTitle=value=>typeof value==='string'?value.trim().slice(0,120):'';

// Consume the existing reduced projection only. This bridge never receives journals or the full app store.
export function togetherPracticeItems(pages,rooms) {
  if(!pages||typeof pages!=='object')return [];
  return [...new Set(rooms||[])].filter(room=>roomIds.has(room)).flatMap(room=>{
    const rows=Array.isArray(pages[room])?pages[room]:[];
    if(room==='praxe'){
      const latest=rows.filter(row=>/^\d{4}-\d{2}-\d{2}$/.test(row?.title||'')).toSorted((a,b)=>b.title.localeCompare(a.title))[0];
      if(!latest)return [];
      const habits=(Array.isArray(latest.lines)?latest.lines:[]).flatMap((line,index)=>{
        const match=typeof line==='string'?line.match(/^(.*): (splněno|odpočinek|nezapsáno|done|rest|not recorded)$/):null;
        const title=cleanTitle(match?.[1]);
        return title?[{id:`praxe-${index}`,room,title,detail:match[2],date:latest.title}]:[];
      });
      return habits.filter((item,index)=>habits.findIndex(other=>other.title===item.title)===index);
    }
    return rows.slice(0,200).flatMap((row,index)=>{
      const title=cleanTitle(row?.title);
      // Training log dates are history, not an activity to propose.
      if(!title||/^\d{4}-\d{2}-\d{2}$/.test(title))return [];
      return [{id:`${room}-${index}`,room,title,detail:typeof row.detail==='string'?row.detail.slice(0,500):'',date:null}];
    });
  });
}

export function togetherPracticePlan(item,date,lang='cs') {
  const room=PARTNER_ROOMS.find(candidate=>candidate.id===item?.room);
  if(!room||!cleanTitle(item?.title))return null;
  const en=lang==='en',title=cleanTitle(item.title);
  return {title,date,time:'18:00',minutes:20,note:`${en?'From':'Navazujeme na'}: ${room.name[en?1:0]} · ${title}`};
}
