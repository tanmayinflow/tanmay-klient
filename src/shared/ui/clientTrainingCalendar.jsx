import React,{useMemo,useState} from "react";
import {calendarDays,clientSchedule} from "../../training/clientSchedule.js";
import {todayISO} from "../product/practice.js";
import {TmIcon} from "./icons.jsx";
import {FONT_BODY,FONT_TAG} from "./type.js";

export function ClientTrainingCalendar({t,lang,plans,templates,schedule,sessions,onStart,onRun,onPlan}) {
  const L=(cs,en)=>lang==="en"?en:cs;
  const [day,setDay]=useState(todayISO),[month,setMonth]=useState(()=>todayISO().slice(0,7));
  const rows=useMemo(()=>clientSchedule({plans,templates,schedule,sessions}),[plans,templates,schedule,sessions]);
  const daily=rows.filter(r=>r.date===day);
  const move=delta=>{const d=new Date(`${month}-15T12:00:00`);d.setMonth(d.getMonth()+delta);setMonth(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`);};
  const quiet={background:"transparent",border:"none",color:t.accentInk||t.accent,minWidth:44,minHeight:44,cursor:"pointer",fontFamily:FONT_BODY};
  return <section aria-label={L("Kalendář tréninku","Training calendar")}>
    <div data-guide="trenink.calendar" style={{display:"flex",alignItems:"center",gap:8,margin:"6px 0 12px"}}>
      <h2 style={{fontFamily:"var(--tm-font-display)",fontWeight:400,fontSize:25,color:t.heading,margin:0,flex:1}}>{new Date(`${month}-01T12:00:00`).toLocaleDateString(lang==="en"?"en-GB":"cs-CZ",{month:"long",year:"numeric"})}</h2>
      <button style={quiet} aria-label={L("Předchozí měsíc","Previous month")} onClick={()=>move(-1)}><TmIcon id="back" size={16}/></button>
      <button style={quiet} aria-label={L("Další měsíc","Next month")} onClick={()=>move(1)}><TmIcon id="forward" size={16}/></button>
      <button style={{...quiet,fontFamily:FONT_TAG,textTransform:"uppercase",letterSpacing:".12em"}} onClick={()=>{setDay(todayISO());setMonth(todayISO().slice(0,7));}}>{L("Dnes","Today")}</button>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(7,minmax(0,1fr))",gap:3}}>
      {L(["Po","Út","St","Čt","Pá","So","Ne"],["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]).map(w=><span key={w} style={{textAlign:"center",fontFamily:FONT_TAG,fontSize:11,color:t.textMuted,padding:"6px 0"}}>{w}</span>)}
      {calendarDays(month).map((d,i)=>{
        if(!d)return <span key={`empty-${i}`}/>;
        const items=rows.filter(r=>r.date===d),done=items.length&&items.every(r=>r.record?.state==="done");
        return <button key={d} onClick={()=>setDay(d)} aria-pressed={d===day} aria-current={d===todayISO()?"date":undefined} aria-label={new Date(`${d}T12:00:00`).toLocaleDateString(lang==="en"?"en-GB":"cs-CZ",{day:"numeric",month:"long"})+(items.length?L(` · ${items.length} tréninků`, ` · ${items.length} sessions`):"")} style={{...quiet,position:"relative",minWidth:0,minHeight:48,color:d===day?t.accentInk||t.accent:t.text,border:`1px solid ${d===day?t.accent:t.borderSoft}`,borderRadius:8,fontVariantNumeric:"tabular-nums",fontWeight:d===todayISO()?600:400}}>{Number(d.slice(8))}{items.length>0&&<span aria-hidden="true" style={{display:"block",position:"absolute",bottom:5,left:"calc(50% - 3px)",width:6,height:6,borderRadius:"50%",background:done?t.sage:t.accent}}/>}</button>;
      })}
    </div>
    <div aria-live="polite" style={{padding:"24px 0 12px"}}>
      <h3 style={{fontFamily:"var(--tm-font-display)",fontWeight:400,fontSize:24,color:t.heading,margin:"0 0 12px"}}>{new Date(`${day}T12:00:00`).toLocaleDateString(lang==="en"?"en-GB":"cs-CZ",{weekday:"long",day:"numeric",month:"long"})}</h3>
      {daily.length?daily.map(row=><div key={row.id} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 0",borderBottom:`1px solid ${t.borderSoft}`}}>
        <div style={{flex:1,minWidth:0,fontFamily:FONT_BODY,color:t.heading}}>{L(row.record?.cz||row.template?.cz,row.record?.en||row.template?.en)||L("Trénink","Workout")}<span style={{display:"block",fontSize:12,color:t.textMuted,marginTop:4}}>{row.record?.state==="done"?L("Odtrénováno","Completed"):row.record?L("Rozcvičeno, můžeš pokračovat","In progress, ready to resume"):row.template?L(`${row.template.blocks?.length||0} cviků`,`${row.template.blocks?.length||0} exercises`):L("Zadání není dostupné. Obnov plán.","Prescription unavailable. Refresh your plan.")}</span></div>
        <button disabled={!row.record&&!row.template} style={{...quiet,opacity:!row.record&&!row.template ? .45:1}} onClick={()=>row.record?onRun(row.record.id):onStart(row)}>{row.record?.state==="done"?L("Otevřít","Open"):row.record?L("Pokračovat","Resume"):L("Začít","Begin")}</button>
      </div>):<p style={{fontFamily:FONT_BODY,color:t.textSec,fontSize:14,lineHeight:1.6}}>{L("Na tento den nemáš naplánovaný trénink. Dny jednotlivých lekcí si vybereš v Mém plánu.","No training is scheduled for this day. Choose dates for your sessions in My plan.")}</p>}
      <button onClick={onPlan} style={{...quiet,padding:0}}>{L("Můj plán","My plan")} <TmIcon id="forward" size={12}/></button>
    </div>
  </section>;
}
