// A delivered prescription is immutable. Dates and actual sessions belong to
// the client and are joined here without changing the delivered plan.
export function clientSchedule({plans=[],templates=[],schedule={},sessions=[]}={}) {
  const rows=[]; const seen=new Set();
  for(const plan of plans)for(const planned of plan.sessions||[]) {
    const template=templates.find(t=>t.id===planned.templateId);
    const record=sessions.find(s=>s.planId===plan.id&&s.planSessionId===planned.id);
    // A started session is a dated snapshot. Moving the current prescription
    // must never move an already recorded workout to a different calendar day.
    const date=record?.date || (schedule[plan.id]?.[planned.id]??planned.date??"");
    if(record)seen.add(record.id);
    rows.push({id:`${plan.id}:${planned.id}`,date,plan,planned,template,record});
  }
  // Old results remain visible even after a coach withdraws or replaces a plan.
  for(const record of sessions)if(!seen.has(record.id))rows.push({id:record.id,date:record.date,record});
  return rows;
}

export function calendarDays(month) {
  if(typeof month!=="string"||!/^\d{4}-(0[1-9]|1[0-2])$/.test(month))return [];
  // Civil dates use UTC arithmetic, so a viewer's timezone or DST never moves
  // the first day to another weekday or changes the final date of the month.
  const first=new Date(`${month}-01T12:00:00Z`),last=new Date(first);
  const offset=(first.getUTCDay()+6)%7;
  last.setUTCMonth(first.getUTCMonth()+1,0);
  const count=last.getUTCDate();
  return [...Array(offset).fill(null),...Array.from({length:count},(_,i)=>`${month}-${String(i+1).padStart(2,"0")}`)];
}
