import React,{useEffect,useMemo,useRef,useState} from "react";
import {calendarDays,clientSchedule} from "../../training/clientSchedule.js";
import {todayISO} from "../product/practice.js";
import {TmIcon} from "./icons.jsx";
import {EmptyRoomArt} from "./states.jsx";
import {FONT_BODY,FONT_TAG} from "./type.js";

export function ClientTrainingCalendar({t,lang,plans,templates,schedule,sessions,onStart,onRun,onPlan,resetKey=0}) {
  const L=(cs,en)=>lang==="en"?en:cs;
  const [day,setDay]=useState(todayISO),[month,setMonth]=useState(()=>todayISO().slice(0,7));
  const [calendarMonth,setCalendarMonth]=useState(()=>todayISO().slice(0,7)),[calendarOpen,setCalendarOpen]=useState(false);
  const [scrollKey,setScrollKey]=useState(0),stripRef=useRef(null);
  const rows=useMemo(()=>clientSchedule({plans,templates,schedule,sessions}),[plans,templates,schedule,sessions]);
  const daily=rows.filter(r=>r.date===day);
  const today=todayISO(),locale=lang==="en"?"en-GB":"cs-CZ";
  const monthLabel=value=>new Date(`${value}-01T12:00:00`).toLocaleDateString(locale,{month:"long",year:"numeric"});
  const shiftMonth=(value,delta)=>{const d=new Date(`${value}-15T12:00:00Z`);d.setUTCMonth(d.getUTCMonth()+delta);return `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,"0")}`;};
  const selectDay=value=>{setDay(value);setMonth(value.slice(0,7));setCalendarMonth(value.slice(0,7));};
  const backToToday=()=>{selectDay(todayISO());setScrollKey(key=>key+1);};
  useEffect(()=>{const now=todayISO();setDay(now);setMonth(now.slice(0,7));setCalendarMonth(now.slice(0,7));setScrollKey(key=>key+1);},[resetKey]);
  useEffect(()=>{
    const strip=stripRef.current;if(!strip)return;
    const selected=strip.querySelector('[data-sel="1"]')||strip.querySelector('[data-today="1"]');
    strip.scrollLeft=selected?Math.max(0,selected.offsetLeft-strip.clientWidth/2+selected.offsetWidth/2):0;
  },[day,month,scrollKey]);
  const marksFor=value=>rows.filter(row=>row.date===value).slice(0,3).map(row=>({solid:row.record?.state==="done",color:row.record?.state==="done"?t.sage:t.accent}));
  const quiet={background:"transparent",border:"none",color:t.accentInk||t.accent,minWidth:44,minHeight:44,cursor:"pointer",fontFamily:FONT_BODY};
  const arrow={...quiet,color:t.textMuted,padding:"6px 10px",fontSize:12,display:"inline-flex",alignItems:"center",justifyContent:"center"};
  const calendarButton={...quiet,border:`1px solid ${t.borderSoft}`,borderRadius:14,padding:"7px 10px",fontSize:12,color:t.textMuted};
  const renderMarks=value=><span aria-hidden="true" style={{display:"flex",gap:3,justifyContent:"center",minHeight:6,marginTop:3}}>{marksFor(value).map((mark,i)=><span key={i} style={{width:5.5,height:5.5,borderRadius:"50%",background:mark.solid?mark.color:"transparent",border:`1px solid ${mark.color}`}}/>)}</span>;
  return <section style={{maxWidth:760,margin:"0 auto"}} aria-label={L("Kalendář tréninku","Training calendar")}>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,flexWrap:"wrap"}}>
      <button style={arrow} aria-label={L("Předchozí měsíc","Previous month")} onClick={()=>setMonth(shiftMonth(month,-1))}><TmIcon id="back" size={12}/></button>
      <span style={{fontFamily:"var(--tm-font-display)",fontSize:17,color:t.heading}}>{monthLabel(month)}</span>
      <button style={arrow} aria-label={L("Další měsíc","Next month")} onClick={()=>setMonth(shiftMonth(month,1))}><TmIcon id="forward" size={12}/></button>
      {day!==today||month!==today.slice(0,7)?<button style={calendarButton} onClick={backToToday}>{L("dnes","today")}</button>:null}
      <button data-guide="trenink.calendar" aria-expanded={calendarOpen} onClick={()=>{setCalendarMonth(month);setCalendarOpen(open=>!open);}} style={{...calendarButton,marginLeft:"auto",borderColor:calendarOpen?t.accent:t.borderSoft,color:calendarOpen?t.accentInk||t.accent:t.textMuted}}>{L("kalendář","calendar")}</button>
    </div>
    <div ref={stripRef} className="tm-scroll tm-wavex" data-training-day-strip="" style={{position:"relative",display:"flex",gap:6,overflowX:"auto",padding:"8px 2px",marginBottom:12}}>
      {calendarDays(month).filter(Boolean).map(value=><button key={value} type="button" className="tm-day-pill" data-sel={value===day?"1":undefined} data-today={value===today?"1":undefined} aria-pressed={value===day} aria-current={value===today?"date":undefined} aria-label={new Date(`${value}T12:00:00`).toLocaleDateString(locale,{weekday:"long",day:"numeric",month:"long"})} onClick={()=>selectDay(value)} style={{minWidth:46,minHeight:60,flexShrink:0,textAlign:"center",cursor:"pointer",background:value===day?t.activeNav:"transparent",border:`1px solid ${value===day?t.accent:t.borderSoft}`,borderRadius:10,padding:"7px 4px 6px",opacity:value>today&&value!==day?0.75:1}}>
        <span style={{display:"block",fontFamily:FONT_TAG,textTransform:"uppercase",letterSpacing:".08em",fontSize:12,color:value===today?t.accentInk||t.accent:t.textMuted}}>{new Date(`${value}T12:00:00`).toLocaleDateString(locale,{weekday:"short"})}</span>
        <span style={{display:"block",fontFamily:"var(--tm-font-display)",fontSize:17,color:value===day||value===today?t.heading:value>today?t.textMuted:t.textSec,lineHeight:1.2}}>{Number(value.slice(8))}</span>
        {renderMarks(value)}
      </button>)}
    </div>
    {calendarOpen&&<div data-training-month="" style={{background:"transparent",border:`1px solid ${t.border}`,borderRadius:12,padding:"14px 12px",marginBottom:12}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
        <button style={arrow} aria-label={L("Předchozí měsíc v kalendáři","Previous calendar month")} onClick={()=>setCalendarMonth(shiftMonth(calendarMonth,-1))}><TmIcon id="back" size={12}/></button>
        <span style={{fontFamily:"var(--tm-font-display)",fontSize:17,color:t.heading}}>{monthLabel(calendarMonth)}</span>
        <button style={arrow} aria-label={L("Další měsíc v kalendáři","Next calendar month")} onClick={()=>setCalendarMonth(shiftMonth(calendarMonth,1))}><TmIcon id="forward" size={12}/></button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,minmax(0,1fr))",gap:4}}>
        {L(["po","út","st","čt","pá","so","ne"],["mo","tu","we","th","fr","sa","su"]).map(weekday=><span key={weekday} style={{textAlign:"center",fontFamily:FONT_TAG,textTransform:"uppercase",letterSpacing:".1em",fontSize:12,color:t.sage,padding:"2px 0 6px"}}>{weekday}</span>)}
        {calendarDays(calendarMonth).map((value,i)=>value?<button key={value} type="button" aria-pressed={value===day} aria-current={value===today?"date":undefined} aria-label={new Date(`${value}T12:00:00`).toLocaleDateString(locale,{day:"numeric",month:"long"})} onClick={()=>{selectDay(value);setCalendarOpen(false);}} style={{background:"transparent",minWidth:0,minHeight:44,border:`1px solid ${value===day?t.accent:t.borderSoft}`,borderRadius:8,cursor:"pointer",padding:2,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3}}>
          <span style={{fontFamily:FONT_BODY,fontSize:12,color:value>today?t.textMuted:t.text,fontWeight:value===today?600:400}}>{Number(value.slice(8))}</span>{renderMarks(value)}
        </button>:<span key={`empty-${i}`}/>)}
      </div>
    </div>}
    <div aria-live="polite" style={{padding:"24px 0 12px"}}>
      <h3 style={{fontFamily:"var(--tm-font-display)",fontWeight:400,fontSize:24,color:t.heading,margin:"0 0 12px"}}>{new Date(`${day}T12:00:00`).toLocaleDateString(lang==="en"?"en-GB":"cs-CZ",{weekday:"long",day:"numeric",month:"long"})}</h3>
      {daily.length?daily.map(row=><div key={row.id} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 0",borderBottom:`1px solid ${t.borderSoft}`}}>
        <div style={{flex:1,minWidth:0,fontFamily:FONT_BODY,color:t.heading}}>{L(row.record?.cz||row.template?.cz,row.record?.en||row.template?.en)||L("Trénink","Workout")}<span style={{display:"block",fontSize:12,color:t.textMuted,marginTop:4}}>{row.record?.state==="done"?L("Odtrénováno","Completed"):row.record?L("Rozcvičeno, můžeš pokračovat","In progress, ready to resume"):row.template?L(`${row.template.blocks?.length||0} cviků`,`${row.template.blocks?.length||0} exercises`):L("Zadání není dostupné. Obnov plán.","Prescription unavailable. Refresh your plan.")}</span></div>
        <button disabled={!row.record&&!row.template} style={{...quiet,opacity:!row.record&&!row.template ? .45:1}} onClick={()=>row.record?onRun(row.record.id):onStart(row)}>{row.record?.state==="done"?L("Otevřít","Open"):row.record?L("Pokračovat","Resume"):L("Začít","Begin")}</button>
      </div>):<div style={{textAlign:"center",padding:"12px 0"}}><EmptyRoomArt room="trenink" size={136} color={t.sand}/><p style={{fontFamily:FONT_BODY,color:t.textSec,fontSize:14,lineHeight:1.6}}>{L("Na tento den nemáš naplánovaný trénink. Dny jednotlivých lekcí si vybereš v Mém plánu.","No training is scheduled for this day. Choose dates for your sessions in My plan.")}</p></div>}
      <button onClick={onPlan} style={{...quiet,padding:0}}>{L("Můj plán","My plan")} <TmIcon id="forward" size={12}/></button>
    </div>
  </section>;
}
