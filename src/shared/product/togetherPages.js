// Only these explicit, reduced page projections may cross the partner boundary.
export const PARTNER_ROOMS=[
  {id:"praxe",name:["Praxe","Practice"],detail:["Návyky a jejich plnění za posledních 7 dní. Bez poznámek a rozvrhu.","Habits and completion over the last 7 days. No notes or schedule."]},
  {id:"trenink",name:["Trénink","Training"],detail:["Vlastní aktivní plán, jeho tréninky a poslední záznamy. Bez klientských plánů a soukromých poznámek.","Your active plan, its workouts and recent logs. No client plans or private notes."]},
  {id:"prameny",name:["Prameny","Sources"],detail:["Názvy, autoři, stav a hodnocení titulů. Bez poznámek a příloh.","Titles, authors, status and ratings. No notes or attachments."]},
  {id:"kompas",name:["Kompas","Compass"],detail:["Názvy krajin a cílů, jejich stav a termín. Bez osobních zápisů.","Landscape and goal names, status and due date. No personal notes."]}
];
export function cleanPartnerPages(pages,rooms) {
  if(!pages||typeof pages!=="object"||Array.isArray(pages)) throw new Error("invalid-pages");
  const out={};
  const str=(s,n)=>typeof s==="string"?s.slice(0,n):"";
  for(const id of rooms) {
    if(!PARTNER_ROOMS.some(r=>r.id===id)) throw new Error("invalid-rooms");
    if(!Array.isArray(pages[id])||pages[id].length>200)throw new Error("invalid-pages");
    out[id]=pages[id].map(row=>{
      if(!row||typeof row!=="object"||typeof row.title!=="string")throw new Error("invalid-pages");
      return {title:str(row.title,180),detail:str(row.detail,500),lines:Array.isArray(row.lines)?row.lines.slice(0,50).map(s=>str(s,240)):[]};
    });
  }
  if(JSON.stringify(out).length>150000)throw new Error("too-large");
  return out;
}
