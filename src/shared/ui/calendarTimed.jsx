import React from 'react';

// Imported events retain their own rows, including overlaps and times before 06:00.
export function CalendarTimedRow({event,t,L}) {
  return <div data-calendar-event={event.id} style={{display:'flex',alignItems:'baseline',gap:10,padding:'7px 0',borderBottom:`1px solid ${t.borderSoft}`,fontFamily:'var(--tm-font-body)',fontSize:13,color:t.text}}>
    <span aria-hidden="true" style={{width:25,flexShrink:0,color:t.textMuted,fontSize:10}}>○</span>
    <span style={{width:84,flexShrink:0,fontFamily:'var(--tm-font-tag)',fontSize:13,letterSpacing:'0.05em',color:t.sage,whiteSpace:'nowrap'}}>{event.time}–{event.endTime}</span>
    <span style={{flex:1,minWidth:0,overflowWrap:'anywhere'}}>{event.title}
      <span style={{display:'block',color:t.textMuted,fontSize:10,marginTop:2}}>{L('Google kalendář','Google Calendar')}{event.continuesBefore?L(' · pokračuje z předchozího dne',' · continues from the previous day'):''}{event.continuesAfter?L(' · pokračuje další den',' · continues the next day'):''}</span>
    </span>
  </div>;
}

export function calendarScheduleRows(hours,sched,events,fromHour,toHour) {
  const minute = time => {const [h,m]=String(time||'00:00').split(':').map(Number);return h*60+(m||0);};
  const rows=hours.filter(h=>parseInt(h,10)>=fromHour&&parseInt(h,10)<=toHour).map(hour=>{
    const row=sched[hour]||{};
    const precise=row.calHour===hour&&row.calTime&&Math.ceil(row.calMinutes/60)===Math.max(1,Number(row.span)||1);
    return {hour,at:minute(precise?row.calTime:hour)};
  });
  for(const event of events||[]){const at=minute(event.time);if(at>=fromHour*60&&at<(toHour+1)*60)rows.push({event,at});}
  return rows.sort((a,b)=>a.at-b.at||Number(!!a.event)-Number(!!b.event));
}
