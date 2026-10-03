import React,{useEffect,useState,useId,useMemo} from "react";
import {CycleDepth} from "./togetherCycleDepth.jsx";
import {moonToday} from "../product/togetherMoon.js";
import {TogetherAstrology} from "./togetherAstrology.jsx";
import {dateForAstrology} from "../product/togetherAstrology.js";

export function PhaseGuide(props) {
  return <CycleDepth {...props}/>;
}

// Original etched Moon: changing terminator and crater strokes, with no surrounding ornaments.
export function MoonArt({phase=.5}) {
  const uid=useId().replace(/:/g,""),c=Math.cos(phase*Math.PI*2),wax=phase<.5;
  const points=[];for(let y=-40;y<=40;y+=1){const x=Math.sqrt(Math.max(0,1600-y*y));points.push(`${wax?x:-x},${y}`);}for(let y=40;y>=-40;y-=1){const x=Math.sqrt(Math.max(0,1600-y*y))*c;points.push(`${wax?x:-x},${y}`);}
  return <svg viewBox="0 0 150 180" fill="none" stroke="currentColor" strokeWidth=".9" aria-hidden="true"><defs><pattern id={uid} width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 4 4 0" stroke="currentColor" strokeWidth=".7"/></pattern><clipPath id={`${uid}-disc`}><circle r="40"/></clipPath></defs><g transform="translate(77 74)"><circle r="41"/><circle r="38" strokeDasharray=".6 3" opacity=".55"/><polygon points={points.join(" ")} fill="currentColor" fillOpacity=".15" strokeWidth=".55"/><polygon points={points.join(" ")} fill={`url(#${uid})`} opacity=".7" stroke="none"/><g clipPath={`url(#${uid}-disc)`} opacity=".6"><path d="M-26-18c-8 4-7 14 1 16 9 2 11-10 4-13m18 2c5-6 13-3 12 4s-10 9-13 3M16 10c-7 8-1 16 7 11 6-4 0-11-5-8M-17 22c-5-2-7 2-6 6m9-3 6 3M21-25l5 2M-7-29l3-3M4 27l3 4"/><circle cx="-8" cy="9" r="3"/><circle cx="20" cy="-8" r="2"/></g></g></svg>;
}

export function MoonCompanion({lang,Sheet,t,onPlan,day,cycle,ownCycle=false}) {
  const L=(cs,en)=>lang==="en"?en:cs;
  const [now,setNow]=useState(()=>new Date()),[open,setOpen]=useState(false);
  useEffect(()=>{const update=()=>setNow(new Date());const id=setInterval(update,60000);window.addEventListener("focus",update);return()=>{clearInterval(id);window.removeEventListener("focus",update);};},[]);
  const moon=useMemo(()=>moonToday(dateForAstrology(day)||now),[day,now]);
  return <>
    <button data-guide="spolu.sky" type="button" className="tg-moon" onClick={()=>setOpen(true)} aria-label={L("Otevřít astrologickou oblohu vybraného dne","Open the selected day's astrological sky")} title={L("Obloha dne","Sky of the day")}>
      <MoonArt phase={moon.phase}/>
    </button>
    {open&&Sheet&&<Sheet title={L("Obloha dne","Sky of the day")} onClose={()=>setOpen(false)}>
      <TogetherAstrology Sheet={Sheet} ownCycle={ownCycle} cycle={cycle} day={day} lang={lang} t={t} onPlan={onPlan?proposal=>{setOpen(false);onPlan(proposal);}:undefined}/>
    </Sheet>}
  </>;
}
