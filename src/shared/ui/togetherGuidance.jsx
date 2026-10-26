import React,{useEffect,useState,useMemo} from "react";
import {CycleDepth} from "./togetherCycleDepth.jsx";
import {moonToday,MOON_NAMES} from "../product/togetherMoon.js";
import {MoonArt} from "./moonEtching.jsx";
export {MoonArt} from "./moonEtching.jsx";
import {TogetherAstrology} from "./togetherAstrology.jsx";
import {dateForAstrology} from "../product/togetherAstrology.js";

export function PhaseGuide(props) {
  return <CycleDepth {...props}/>;
}

export function MoonCompanion({lang,Sheet,t,onPlan,day,cycle,ownCycle=false}) {
  const L=(cs,en)=>lang==="en"?en:cs;
  const [now,setNow]=useState(()=>new Date()),[open,setOpen]=useState(false);
  useEffect(()=>{const update=()=>setNow(new Date());const id=setInterval(update,60000);window.addEventListener("focus",update);return()=>{clearInterval(id);window.removeEventListener("focus",update);};},[]);
  const moon=useMemo(()=>moonToday(dateForAstrology(day)||now),[day,now]);
  const phaseName=MOON_NAMES[moon.index][lang==="en"?1:0];
  return <>
    <button data-guide="spolu.sky" type="button" className="tg-moon" onClick={()=>setOpen(true)} aria-label={`${phaseName}. ${L("Otevřít astrologickou oblohu vybraného dne","Open the selected day's astrological sky")}`} title={L("Obloha dne","Sky of the day")}>
      <MoonArt phase={moon.phase}/>
      <span className="tg-moon-phase">{phaseName}</span>
    </button>
    {open&&Sheet&&<Sheet title={L("Obloha dne","Sky of the day")} onClose={()=>setOpen(false)}>
      <TogetherAstrology Sheet={Sheet} ownCycle={ownCycle} cycle={cycle} day={day} lang={lang} t={t} onPlan={onPlan?proposal=>{setOpen(false);onPlan(proposal);}:undefined}/>
    </Sheet>}
  </>;
}
