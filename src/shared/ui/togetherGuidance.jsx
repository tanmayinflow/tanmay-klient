import React,{useEffect,useState,useId,useMemo} from "react";
import {CYCLE_GUIDE,CYCLE_SOURCES} from "../product/togetherGuidance.js";
import {moonToday} from "../product/togetherMoon.js";
import {TogetherAstrology} from "./togetherAstrology.jsx";
import {dateForAstrology} from "../product/togetherAstrology.js";

export function PhaseGuide({phase,lang,onPlan,embedded=false,role="client",date=""}) {
  const L=(cs,en)=>lang==="en"?en:cs;
  const [exploration,setExploration]=useState(null);
  const current=phase?.id||"";
  const selected=exploration?.date===date&&exploration?.current===current?exploration.id:"";
  const shown=selected||current,guide=CYCLE_GUIDE[shown],partner=role==="coach";
  const request={
    menstrual:L("Pomohlo by mi teplo, něco dobrého k jídlu nebo chvíle, kdy nic nemusím. Co z toho spolu můžeme zařídit?","Warmth, something nourishing or some time with nothing to do might help. Which could we arrange?"),
    follicular:L("Na co mám teď chuť a kolik prostoru tomu chci dát? Řeknu ti i to, kdy už potřebuji skončit.","What do I feel like doing, and how much space would I like to give it? I will also tell you when I need to stop."),
    ovulatory:L("Jaká blízkost by mi dnes byla příjemná? Můžu si říct o dotek, rozhovor i vlastní prostor.","What kind of closeness would feel good today? I can ask for touch, a conversation or my own space."),
    luteal:L("Co mi teď bere nejvíc sil a s čím bych ocenila pomoc? Zkusím pojmenovat jednu konkrétní věc.","What is taking the most out of me, and where would help be welcome? I will try to name one concrete thing.")
  };
  return <section className="tm-together-section">
    {!embedded&&<h2>{L("Jak si být oporou","How to support each other")}</h2>}
    <p>{partner?L("Zeptej se jí, jak jí je. Podle vybraného dne tu najdeš konkrétní možnosti, jak být oporou.","Ask how she feels. Here are concrete ways to support her for the selected day."):L("Vezmi v úvahu svůj pocit i vybraný den. Vyber si péči, která ti teď sedí.","Consider how you feel and the selected day. Choose the care that feels right for you.")}</p>
    <label>{L("Část cyklu","Part of the cycle")}<select value={shown} onChange={e=>setExploration({date,current,id:e.target.value})}>{!current&&<option value="">{L("Pro tento den bez odhadu","No estimate for this day")}</option>}{Object.entries(CYCLE_GUIDE).map(([id,g])=><option key={id} value={id}>{L(...g.name)}{id===current?phase?.basis==="recorded"?L(" · záznam"," · recorded"):L(" · odhad pro vybraný den"," · estimated for selected day"):""}</option>)}</select></label>
    {shown&&shown!==current&&<p className="hint">{L("Prohlížíš obecného průvodce touto částí cyklu.","You are exploring general guidance for this part of the cycle.")}</p>}
    {guide?<>
      <p>{shown==="menstrual"&&phase?.basis!=="recorded"?L("Období kolem očekávané menstruace. Všímej si skutečného pocitu a záznamů.","The time around an expected period. Notice actual feelings and records."):L(...guide.about)}</p>
      <details open><summary>{partner?L("Co pro ni můžu udělat","What I can do for her"):L("Jak pečovat o sebe","Caring for yourself")}</summary><p>{L(...(partner?guide.partner:guide.woman))}</p></details>
      <details><summary>{partner?L("Na co se jí zeptat","What to ask her"):L("O co si můžu říct","What I can ask for")}</summary><p>{partner?L("Co by ti v tenhle den udělalo dobře? Přeješ si, abych něco převzal, byl s tebou, nebo ti nechal prostor?","What would feel good on this day? Would you like me to take something on, be with you or give you space?"):request[shown]}</p></details>
      <details><summary>{L("Co podniknout spolu","An idea for time together")}</summary><p>{L(...guide.idea)}</p>{onPlan&&<button type="button" onClick={()=>onPlan(L(...guide.idea))}>{L("Navrhnout společný čas","Propose time together")}</button>}</details>
    </>:<p className="hint">{L("Pro vybraný den tu fáze není. Můžeš si prohlédnout některou část cyklu nebo vycházet z toho, co si řeknete.","There is no phase for the selected day. You can explore a part of the cycle or follow what you tell each other.")}</p>}
    <details><summary>{L("Jak vzniká odhad a doporučení","About the estimate and guidance")}</summary><p>{L("Den cyklu počítáme od zapsaného začátku menstruace. Odhad používá poslední pravidelné cykly, nebo zadanou obvyklou délku. V budoucích dnech může pokračovat nejvýše tři předpokládané cykly a 90 dní dopředu; další začátky nejsou záznam. Kalendář nepotvrzuje ovulaci, neurčuje plodné ani bezpečné dny a není antikoncepce. Fáze nejsou rozvrh nálady, výkonu ani chuti na blízkost.","Cycle days count from the recorded period start. Estimates use recent regular cycles or the entered usual length. Future dates may continue for at most three estimated cycles and 90 days; those starts are not records. A calendar does not confirm ovulation, identify fertile or safe days or provide contraception. Phases do not prescribe mood, performance or desire for closeness.")}</p><p>{L("Při nepravidelném cyklu, hormonální antikoncepci, těhotenství nebo po porodu zvol záznamy bez odhadů. Silnou bolest či neobvyklé krvácení řeš s lékařem. Partnerské podněty jsou naše obecné návrhy, zdravotní souvislosti vycházejí z těchto zdrojů:","Use records without estimates with irregular cycles, hormonal contraception, pregnancy or postpartum. Discuss severe pain or unusual bleeding with a clinician. Partner prompts are our general suggestions; the health context follows these sources:")}</p>{CYCLE_SOURCES.map(([title,url])=><p key={url}><a href={url} target="_blank" rel="noreferrer">{title}</a></p>)}</details>
  </section>;
}

// Original etched SVG: accurate changing terminator, crater strokes, imperfect orbital arcs.
export function MoonArt({phase=.5}) {
  const uid=useId().replace(/:/g,""),c=Math.cos(phase*Math.PI*2),wax=phase<.5;
  const points=[];for(let y=-40;y<=40;y+=1){const x=Math.sqrt(Math.max(0,1600-y*y));points.push(`${wax?x:-x},${y}`);}for(let y=40;y>=-40;y-=1){const x=Math.sqrt(Math.max(0,1600-y*y))*c;points.push(`${wax?x:-x},${y}`);}
  return <svg viewBox="0 0 150 180" fill="none" stroke="currentColor" strokeWidth=".9" aria-hidden="true"><defs><pattern id={uid} width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 4 4 0" stroke="currentColor" strokeWidth=".7"/></pattern><clipPath id={`${uid}-disc`}><circle r="40"/></clipPath></defs><g transform="translate(77 74)"><circle r="41"/><circle r="38" strokeDasharray=".6 3" opacity=".55"/><polygon points={points.join(" ")} fill="currentColor" fillOpacity=".15" strokeWidth=".55"/><polygon points={points.join(" ")} fill={`url(#${uid})`} opacity=".7" stroke="none"/><g clipPath={`url(#${uid}-disc)`} opacity=".6"><path d="M-26-18c-8 4-7 14 1 16 9 2 11-10 4-13m18 2c5-6 13-3 12 4s-10 9-13 3M16 10c-7 8-1 16 7 11 6-4 0-11-5-8M-17 22c-5-2-7 2-6 6m9-3 6 3M21-25l5 2M-7-29l3-3M4 27l3 4"/><circle cx="-8" cy="9" r="3"/><circle cx="20" cy="-8" r="2"/></g><path d="M-51 23C-67-14-39-64 4-58M34-50C63-30 68 8 49 38M-41 43C-17 64 17 63 38 47" opacity=".6"/><path d="M-55-8C-62 28-37 58-7 62M15-59c22 5 38 20 44 39" strokeDasharray="1 5"/></g><path d="M75 7v13m-6-6h12M77 132v10"/><circle cx="77" cy="124" r="2"/><path d="m23 38 2-5 2 5 5 2-5 2-2 5-2-5-5-2ZM121 118v8m-4-4h8"/></svg>;
}

export function MoonCompanion({lang,Sheet,t,onPlan,day}) {
  const L=(cs,en)=>lang==="en"?en:cs;
  const [now,setNow]=useState(()=>new Date()),[open,setOpen]=useState(false);
  useEffect(()=>{const update=()=>setNow(new Date());const id=setInterval(update,60000);window.addEventListener("focus",update);return()=>{clearInterval(id);window.removeEventListener("focus",update);};},[]);
  const moon=useMemo(()=>moonToday(dateForAstrology(day)||now),[day,now]);
  return <>
    <button type="button" className="tg-moon" onClick={()=>setOpen(true)} aria-label={L("Otevřít astrologickou oblohu vybraného dne","Open the selected day's astrological sky")} title={L("Obloha dne","Sky of the day")}>
      <MoonArt phase={moon.phase}/>
    </button>
    {open&&Sheet&&<Sheet title={L("Obloha dne","Sky of the day")} onClose={()=>setOpen(false)}>
      <TogetherAstrology day={day} lang={lang} t={t} onPlan={onPlan?proposal=>{setOpen(false);onPlan(proposal);}:undefined}/>
    </Sheet>}
  </>;
}