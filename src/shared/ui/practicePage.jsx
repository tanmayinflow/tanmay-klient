import React, { useState } from "react";
import {useGuideAction} from "./guideNavigation.jsx";
import { tmPrahKlic } from "../product/practice.js";
import { FONT_TAG } from "./type.js";

export function createPracticePage({useT,L,PageTitle,TmIcPraxe,TmPasPrahu,DayView,PraxeOverview,CenterSheet,pProse,SourceMorning=null,practiceArtKey}) {
  return function PagePractice({go}) {
    const {t}=useT();
    const [prah,setPrah]=useState(tmPrahKlic),[calOpen,setCalOpen]=useState(false),[ovOpen,setOvOpen]=useState(false);
    useGuideAction("praxe",action=>{setOvOpen(false);setPrah(action==="praxe.evening"?"vecer":action==="praxe.habits"?"den":"rano");});
    return <>
      <PageTitle pageKey="praxe" artKey={practiceArtKey} icon={<span style={{color:t.sand,display:"inline-flex"}}><TmIcPraxe size={42}/></span>} kicker={L("Drž svou praxi","Hold the practice")}>{L("Praxe","Practice")}</PageTitle>
      <p className="tm-prose" style={pProse(t)}>{L("Ráno záměr. Přes den praxe. Večer ohlédnutí.","Intention in the morning. Practice through the day. Review at night.")}</p>
      <div style={{height:6}}/>
      <div className="tm-practice-day" style={{width:"100%",minWidth:0}}>
        <TmPasPrahu prah={prah} onPrah={setPrah}/>
        <DayView go={go} prah={prah} calOpen={calOpen} onCal={()=>setCalOpen(o=>!o)}/>
      </div>
      <button data-pv="prehled" onClick={()=>setOvOpen(true)} className="tm-tap-c" style={{display:"block",marginLeft:"auto",marginTop:16,background:"transparent",border:"none",boxShadow:"none",padding:"8px 0",minHeight:34,cursor:"pointer",fontFamily:FONT_TAG,textTransform:"uppercase",letterSpacing:".22em",fontSize:12,color:t.accent}}>{L("Přehled","Overview")}</button>
      {prah==="rano"&&SourceMorning&&<SourceMorning/>}
      {ovOpen&&<CenterSheet title={L("Přehled","Overview")} onClose={()=>setOvOpen(false)}><PraxeOverview go={go}/></CenterSheet>}
    </>;
  };
}
