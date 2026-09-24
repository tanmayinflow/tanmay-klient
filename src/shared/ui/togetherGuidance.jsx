import React,{useEffect,useState,useId,useMemo} from "react";
import {CYCLE_GUIDE,CYCLE_SOURCES} from "../product/togetherGuidance.js";
import {moonToday,MOON_NAMES,ZODIAC,LUNAR_REFLECTIONS,LUNAR_SOURCES} from "../product/togetherMoon.js";

export function PhaseGuide({phase,lang,onPlan}) {
  const L=(cs,en)=>lang==="en"?en:cs;
  const [selected,setSelected]=useState("");
  const current=phase?.id||"", shown=selected||current||"menstrual",guide=CYCLE_GUIDE[shown];
  return <section className="tm-together-section">
    <h2>{current?L(...CYCLE_GUIDE[current].name):L("Fázi teď nelze určit","Phase is currently unknown")}</h2>
    <p className="hint">{phase?.basis==="recorded"?L("Podle zaznamenaného krvácení.","Based on recorded bleeding."):current?L("Orientační kalendářní odhad. Hormonální fázi ani ovulaci nepotvrzuje.","Approximate calendar estimate. It does not confirm a hormonal phase or ovulation."):L("Chybí vhodné záznamy, odhady jsou vypnuté nebo fáze není sdílená. Průvodce si můžeš prohlédnout i bez odhadu.","Records are insufficient, estimates are off or the phase is not shared. You can still explore the guide.")}</p>
    <label>{L("Prohlédnout doporučení pro fázi","Explore a phase")}<select value={shown} onChange={e=>setSelected(e.target.value)}>{Object.entries(CYCLE_GUIDE).map(([id,g])=><option key={id} value={id}>{L(...g.name)}{id===current?L(" · nyní"," · now"):""}</option>)}</select></label>
    {shown!==current&&<p className="hint">{L("Prohlížíš obecného průvodce, ne určení dnešní fáze.","You are browsing a general guide, not identifying today's phase.")}</p>}
    <p>{L(...guide.about)}</p>
    <details><summary>{L("Pro ženu · pohyb a péče","For her · movement and care")}</summary><p>{L(...guide.woman)}</p></details>
    <details><summary>{L("Pro partnera · jak podpořit","For a partner · how to support")}</summary><p>{L(...guide.partner)}</p></details>
    <details><summary>{L("Co podniknout spolu","An idea for time together")}</summary><p>{L(...guide.idea)}</p><p className="hint">{L("Vyberte podle skutečné energie, přání a souhlasu vás obou.","Choose according to your actual energy, wishes and mutual consent.")}</p>{onPlan&&<button onClick={()=>onPlan(L(...guide.idea))}>{L("Navrhnout do plánů","Propose a plan")}</button>}</details>
    <details><summary>{L("Z čeho doporučení vycházejí","Basis and sources")}</summary><p>{L("Fáze nejsou pevný rozvrh výkonu. Zdravotní informace vycházejí ze zdrojů níže; partnerské tipy jsou naše obecné návrhy. Při nepravidelném cyklu, hormonální antikoncepci, těhotenství nebo po porodu používej záznamy bez odhadů. Při silné bolesti či neobvyklém krvácení kontaktuj lékaře.","Phases are not a fixed performance schedule. Health information follows the sources below; partner tips are our general suggestions. Use records without estimates with irregular cycles, hormonal contraception, pregnancy or postpartum. Seek medical care for severe pain or unusual bleeding.")}</p>{CYCLE_SOURCES.map(([title,url])=><p key={url}><a href={url} target="_blank" rel="noreferrer">{title}</a></p>)}</details>
  </section>;
}

// Original etched SVG: accurate changing terminator, crater strokes, imperfect orbital arcs.
export function MoonArt({phase=.5}) {
  const uid=useId().replace(/:/g,""),c=Math.cos(phase*Math.PI*2),wax=phase<.5;
  const points=[];for(let y=-40;y<=40;y+=1){const x=Math.sqrt(Math.max(0,1600-y*y));points.push(`${wax?x:-x},${y}`);}for(let y=40;y>=-40;y-=1){const x=Math.sqrt(Math.max(0,1600-y*y))*c;points.push(`${wax?x:-x},${y}`);}
  return <svg viewBox="0 0 150 180" fill="none" stroke="currentColor" strokeWidth=".9" aria-hidden="true"><defs><pattern id={uid} width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 4 4 0" stroke="currentColor" strokeWidth=".7"/></pattern><clipPath id={`${uid}-disc`}><circle r="40"/></clipPath></defs><g transform="translate(77 74)"><circle r="41"/><circle r="38" strokeDasharray=".6 3" opacity=".55"/><polygon points={points.join(" ")} fill="currentColor" fillOpacity=".15" strokeWidth=".55"/><polygon points={points.join(" ")} fill={`url(#${uid})`} opacity=".7" stroke="none"/><g clipPath={`url(#${uid}-disc)`} opacity=".6"><path d="M-26-18c-8 4-7 14 1 16 9 2 11-10 4-13m18 2c5-6 13-3 12 4s-10 9-13 3M16 10c-7 8-1 16 7 11 6-4 0-11-5-8M-17 22c-5-2-7 2-6 6m9-3 6 3M21-25l5 2M-7-29l3-3M4 27l3 4"/><circle cx="-8" cy="9" r="3"/><circle cx="20" cy="-8" r="2"/></g><path d="M-51 23C-67-14-39-64 4-58M34-50C63-30 68 8 49 38M-41 43C-17 64 17 63 38 47" opacity=".6"/><path d="M-55-8C-62 28-37 58-7 62M15-59c22 5 38 20 44 39" strokeDasharray="1 5"/></g><path d="M75 7v13m-6-6h12M32 151c14-8 26-3 44 3s31 9 47-2M31 157c19-8 35 8 61 5M77 132v10"/><circle cx="77" cy="124" r="2"/><path d="m23 38 2-5 2 5 5 2-5 2-2 5-2-5-5-2ZM121 118v8m-4-4h8"/></svg>;
}

export function MoonCompanion({lang,Sheet,t}) {
  const L=(cs,en)=>lang==="en"?en:cs;
  const [now,setNow]=useState(()=>new Date()),[open,setOpen]=useState(false);
  useEffect(()=>{const update=()=>setNow(new Date());const id=setInterval(update,60000);window.addEventListener("focus",update);return()=>{clearInterval(id);window.removeEventListener("focus",update);};},[]);
  const moon=useMemo(()=>moonToday(now),[now]),reflection=LUNAR_REFLECTIONS[moon.quarter];
  const label=L(...MOON_NAMES[moon.index]);
  const fmt=d=>new Date(d).toLocaleString(lang==="en"?"en-GB":"cs-CZ",{day:"numeric",month:"long",hour:"2-digit",minute:"2-digit"});
  return <><button className="tg-moon" onClick={()=>{setNow(new Date());setOpen(true);}} aria-label={`${L("Měsíc dnes","Moon today")} · ${label}`} title={L("Otevřít Měsíc dneška","Open today's Moon")}><MoonArt phase={moon.phase}/><span>{label}</span></button>
    {open&&Sheet&&<Sheet title={L("Měsíc dneška","Today's Moon")} onClose={()=>setOpen(false)}><div className="tg-moon-sheet" style={{color:t.text,fontFamily:"var(--tm-font-body)",lineHeight:1.7}}>
      <div style={{display:"flex",alignItems:"center",gap:22}}><div style={{width:115,flexShrink:0,color:t.accentInk}}><MoonArt phase={moon.phase}/></div><div><h2 style={{fontFamily:"var(--tm-font-display)",fontWeight:400,fontSize:32,margin:0,color:t.heading}}>{label}</h2><p>{fmt(now)}<br/>{L("Osvětleno","Illuminated")} {moon.light} %</p></div></div>
      <p>{L("Měsíc v tropickém zvěrokruhu:","Moon in the tropical zodiac:")} <strong>{L(...ZODIAC[moon.sign])}</strong>. {L("Jde o polohu ve dvanácti astrologických znameních, ne o astronomické souhvězdí ani védický výpočet.","This is a position in the twelve astrological signs, not an astronomical constellation or a Vedic calculation.")}</p>
      {moon.next&&<p>{L("Další hlavní fáze:","Next main phase:")} {L(...MOON_NAMES[moon.nextIndex])} · {fmt(moon.next)}</p>}
      <p style={{fontSize:12,color:t.textSec}}>{L("Časy jsou v časovém pásmu tohoto zařízení. Astronomický výpočet probíhá místně; s menstruačním cyklem není propojený.","Times use this device's time zone. Astronomical calculations run locally and are independent of the menstrual cycle.")}</p>
      <hr style={{border:0,borderTop:`1px solid ${t.borderSoft}`,margin:"26px 0"}}/>
      <h3>{L("Tradiční západní astrologie","Traditional Western astrology")}</h3><p><strong>{L(...reflection.quality)}</strong></p><p>{L(...reflection.text)}</p><p><a href={LUNAR_SOURCES.ptolemy} target="_blank" rel="noreferrer">Ptolemaios · Tetrabiblos I.8</a></p>
      <h3>{L("Malá praxe pro dnešek","A small practice for today")}</h3><p>{L(...reflection.prompt)}</p><p style={{fontSize:12}}>{L("Současná inspirace podle lunární symboliky. Není to tradiční citát ani předpověď událostí či zdraví.","A contemporary reflection inspired by lunar symbolism, not a traditional quotation or a prediction of events or health.")}</p>
      <details><summary>{L("Buddhistická tradice · upósatha","Buddhist tradition · Uposatha")}</summary><p>{L("V théravádové tradici jsou lunární dny příležitostí obnovit praxi, věnovat se meditaci a etickým závazkům. Nov a úplněk mají důležitou úlohu. Tradiční kalendáře se ale mohou lišit od astronomických okamžiků; tato aplikace neurčuje dnešní náboženský svátek.","In Theravada, lunar observance days invite renewed practice, meditation and ethical commitment. New and full moons play an important role. Traditional calendars may differ from astronomical moments; this app does not determine today's religious observance.")}</p><a href={LUNAR_SOURCES.uposatha} target="_blank" rel="noreferrer">Access to Insight · Uposatha</a></details>
      <details><summary>{L("Výpočet a zdroje","Calculation and sources")}</summary><p><a href={LUNAR_SOURCES.nasa} target="_blank" rel="noreferrer">NASA · Moon phases</a><br/><a href={LUNAR_SOURCES.calculation} target="_blank" rel="noreferrer">Astronomy Engine</a></p><p>{L("Astrologie je zde kulturní a spirituální výklad, nikoli vědecky potvrzený vliv na náladu, vztah nebo tělo.","Astrology here is cultural and spiritual interpretation, not an established influence on mood, relationships or the body.")}</p></details>
    </div></Sheet>}
  </>;
}
