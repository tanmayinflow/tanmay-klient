import React, { useState } from "react";
import {useGuideAction} from "./guideNavigation.jsx";
import { tmPrahKlic, todayISO } from "../product/practice.js";
import { FONT_BODY, FONT_TAG } from "./type.js";

// Both roles use the same day composition. Personal morning material is an
// explicit coach slot; the daily source always comes from the current account.
export function createPracticePage({useT,useStore,L,PageTitle,BufferedInput,TmIcPraxe,TmIcPrameny,TmPasPrahu,DayView,PraxeOverview,CenterSheet,pProse,SourceMorning=null,practiceArtKey}) {
  function DailySource({go}) {
    const {t}=useT(); const st=useStore();
    const list=(st.allSources?st.allSources():st.coll.content||[]).filter(e=>!e.archive&&(e.carry||"").trim());
    if(!list.length)return null;
    const date=st.selDate||todayISO();
    const seed=date.split("-").reduce((a,x)=>a+parseInt(x,10),0);
    const entry=list[seed%list.length];
    return <button onClick={()=>go("prameny")} className="tm-lift" data-tm-surface="card" style={{display:"block",width:"100%",textAlign:"left",background:t.card,border:`1px solid ${t.borderSoft}`,borderRadius:12,boxShadow:t.shadow,padding:"16px 18px 13px",margin:"14px 0 0",cursor:"pointer"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,fontFamily:FONT_TAG,textTransform:"uppercase",letterSpacing:".2em",fontSize:12,color:t.accentInk||t.accent,marginBottom:9}}><TmIcPrameny size={13}/>{L("Dnešní pramen","Today's spring")}</div>
      <div style={{fontFamily:"var(--tm-font-display)",fontStyle:"italic",fontSize:17,lineHeight:1.45,color:t.text}}>{entry.carry}</div>
      <div style={{fontFamily:FONT_BODY,fontSize:12,color:t.textMuted,marginTop:8}}>{entry.title}{entry.author?" · "+entry.author:""}</div>
    </button>;
  }
  return function PagePractice({go}) {
    const {t}=useT(); const st=useStore();
    const [prah,setPrah]=useState(tmPrahKlic),[calOpen,setCalOpen]=useState(false),[ovOpen,setOvOpen]=useState(false);
    useGuideAction("praxe",action=>{setOvOpen(false);setPrah(action==="praxe.evening"?"vecer":action==="praxe.habits"?"den":"rano");});
    return <>
      <PageTitle pageKey="praxe" artKey={practiceArtKey} icon={<span style={{color:t.sand,display:"inline-flex"}}><TmIcPraxe size={42}/></span>} kicker={L("Drž svou praxi","Hold the practice")}>{L("Praxe","Practice")}</PageTitle>
      <p className="tm-prose" style={pProse(t)}>{L("Ráno záměr. Přes den praxe. Večer ohlédnutí.","Intention in the morning. Practice through the day. Review at night.")}</p>
      <div style={{height:6}}/>
      <div className="tm-practice-day" style={{width:"100%",minWidth:0}}>
        <TmPasPrahu prah={prah} onPrah={setPrah}/>
        <DayView go={go} prah={prah} calOpen={calOpen} onCal={()=>setCalOpen(o=>!o)}/>
        {prah==="rano"&&<DailySource go={go}/>}
      </div>
      <button data-pv="prehled" onClick={()=>setOvOpen(true)} className="tm-tap-c" style={{display:"block",marginLeft:"auto",marginTop:16,background:"transparent",border:"none",boxShadow:"none",padding:"8px 0",minHeight:34,cursor:"pointer",fontFamily:FONT_TAG,textTransform:"uppercase",letterSpacing:".22em",fontSize:12,color:t.accent}}>{L("Přehled","Overview")}</button>
      {prah==="rano"&&SourceMorning&&<SourceMorning/>}
      {ovOpen&&<CenterSheet title={L("Přehled","Overview")} onClose={()=>setOvOpen(false)}><PraxeOverview go={go}/></CenterSheet>}
    </>;
  };
}
