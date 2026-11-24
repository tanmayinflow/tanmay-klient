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

// Reuse the plan's weekly rhythm. Other booked days, including running
// workouts and sessions from other plans, remain occupied.
export function suggestPlanDates({plans, schedule, sessions, planId, start, replace = false}) {
  const plan = plans.find(item => item.id === planId);
  if (!plan?.sessions?.length) return [];
  const rows = clientSchedule({plans, schedule, sessions});
  const eligible = row => row.plan?.id === planId && !row.record && (replace || !row.date);
  const occupied = new Set(rows.filter(row => !eligible(row)).map(row => row.date).filter(Boolean));
  const firstWeek = plan.sessions[0].w || 1;
  const frequency = Math.min(7, plan.sessions.filter(s => (s.w || 1) === firstWeek).length);
  const offsets = [[], [0], [0,3], [0,2,4], [0,1,3,4], [0,1,2,4,5], [0,1,2,3,4,5], [0,1,2,3,4,5,6]][frequency];
  const first = Date.parse(start + 'T12:00:00Z');
  if (!Number.isFinite(first)) return [];
  const changes = [];
  let slot = 0;
  for (const row of rows.filter(eligible)) {
    let next;
    do {
      const offset = Math.floor(slot / frequency) * 7 + offsets[slot % frequency];
      next = new Date(first + offset * 86400000).toISOString().slice(0, 10);
      slot++;
    } while (occupied.has(next));
    occupied.add(next);
    if (row.date !== next) changes.push({id: row.planned.id, before: row.date, override: schedule?.[planId]?.[row.planned.id], after: next});
  }
  return changes;
}

// Compare the preview with live records before committing it. A stale
// preview cannot move a newly started session or overwrite a newer edit.
export function applyPlanDates(input, proposal, undo = false) {
  const {planId, changes} = proposal;
  const rows = clientSchedule(input);
  const targets = new Map(changes.map(change => [change.id, change]));
  const forPlan = {...input.schedule?.[planId]};
  const matched = new Set();
  for (const row of rows) {
    const change = row.plan?.id === planId && targets.get(row.planned.id);
    if (!change) continue;
    if (row.record || row.date !== (undo ? change.after : change.before)) return null;
    if (undo && change.override === undefined) delete forPlan[change.id];
    else forPlan[change.id] = undo ? change.override : change.after;
    matched.add(change.id);
  }
  if (matched.size !== changes.length) return null;
  if (!undo) {
    const occupied = new Set(rows.filter(row => row.plan?.id !== planId || !targets.has(row.planned.id)).map(row => row.date));
    if (changes.some(change => occupied.has(change.after))) return null;
  }
  return {...input.schedule, [planId]: forPlan};
}
