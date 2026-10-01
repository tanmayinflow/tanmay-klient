import React,{useId,useRef,useState} from "react";
import {TmIcon} from "./icons.jsx";

const sections=[
  {id:"planets",icon:"reflection",label:["Planety","Planets"],title:["Planety, polohy a vrstvy kola","Planets, positions and wheel layers"],intro:["Vyber planetu a prozkoumej její polohu. Vrstvy kola můžeš upravit níže.","Choose a planet to explore its position. Adjust the wheel layers below."]},
  {id:"changes",icon:"hourglass",label:["Proměny","Changes"],title:["Co se mění dál","What changes next"],intro:["Prohlédni si nejbližší přechody. Ke každému můžeš posunout vybraný čas.","Explore the next transitions. You can move the selected time to each one."]},
  {id:"times",icon:"morning",label:["Časy dne","Day times"],title:["Časy a údaje dne","Times and facts of the day"],intro:["Slunce, Luna a planetární hodiny na jednom místě.","The Sun, Moon and planetary hours in one place."]},
  {id:"reading",icon:"book",label:["Výklad","Reading"],title:["Celý výklad a souvislosti","Full reading and context"],intro:["Spoj jednotlivé polohy do obrazu dne a jeho delšího pozadí.","Bring the individual positions into a picture of the day and its longer background."]}
];

// Decorative instruments identify a reading, not an additional calculated chart.
// Their ink, line weight and small navigation symbols follow the native icon set.
function AtlasPlate({kind}){
  return <svg className="sky-day-atlas-plate" viewBox="0 0 120 108" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {kind==="planets"?<>
      <path d="M43 97Q60 93 77 97L81 101H39ZM59 78V94M63 78V94"/>
      <circle cx="61" cy="44" r="33"/><ellipse cx="61" cy="44" rx="15" ry="33" transform="rotate(-28 61 44)"/>
      <ellipse cx="61" cy="44" rx="33" ry="11" transform="rotate(-28 61 44)"/>
      <path d="M42 13 80 78M47 16l-2 4M39 21l-2 4M32 30l-2 4M79 66l-2 4M87 57l-2 4" opacity=".55"/>
      <circle cx="61" cy="44" r="4"/><path d="m51 36 4 4m12 8 4 4M52 49l4-2m10-5 5-2"/>
      <path d="M44 99h30M59 81h4M59 86h4M59 91h4" opacity=".5"/>
    </>:kind==="changes"?<>
      <path d="M31 12Q60 8 89 12L88 17Q60 14 32 17ZM31 91Q60 88 89 91L89 97Q60 94 31 97Z"/>
      <path d="M35 17v73M40 17v73M80 17v73M85 17v73M45 17C45 38 52 40 58 52C59 55 59 56 56 60C50 66 45 73 45 90M75 17C75 38 68 40 62 52C61 55 61 56 64 60C70 66 75 73 75 90"/>
      <path d="M48 27h24M51 33h18M54 39h12M49 85q11-17 22 0Z" opacity=".55"/>
      <path d="M59 62h2M60 67v2M55 82h10M52 86h16M33 94h54" opacity=".55"/>
    </>:kind==="times"?<>
      <ellipse cx="60" cy="72" rx="42" ry="19"/><path d="M18 73v7c0 10 19 19 42 19s42-9 42-19v-7"/>
      <path d="m43 78 24-41 7 40Z"/><path d="m67 37-3 42M43 78l21 1" opacity=".55"/>
      <path d="m26 72 8 1m1-9 6 3m45-3-6 3m15 6-8 1m-3 9-7-2m-42 2 8-2M59 87v5"/>
      <circle cx="31" cy="27" r="8"/><path d="M31 12v4M31 38v4M16 27h4M42 27h4M20 16l3 3M39 35l3 3M42 16l-3 3M23 35l-3 3"/>
      <path d="M24 82q13 10 30 11M77 91l7-3m4-2 7-4" opacity=".5"/>
    </>:<>
      <path d="M60 29C48 18 30 18 16 22L20 82C35 78 49 82 61 91C72 81 88 77 102 81L106 21C91 17 74 20 60 29ZM60 29l1 62M16 25l-4 2 4 60c18-3 33 1 45 8 14-8 29-11 45-9l4-60-4-2"/>
      <path d="M25 31q15-2 27 6M26 40q14-2 26 6M27 49q14-1 25 6M28 59q13-1 24 6M29 68q12 0 23 6M70 37q12-8 27-6M70 46q12-8 26-6M70 55q11-7 25-6M71 65q11-7 24-6M71 74q10-6 23-6" opacity=".5"/>
      <path d="m77 25-2 38 5-4 4 2 2-39"/>
    </>}
  </svg>;
}

export function SkyDayAtlas({lang="cs",planets,changes,times,reading,initial="planets"}){
  const uid=useId(),tabs=useRef([]),[view,setView]=useState(initial);
  const L=pair=>pair[lang==="en"?1:0],active=sections.some(section=>section.id===view)?view:sections[0].id;
  const content={planets,changes,times,reading};
  const navigate=(event,index)=>{
    let next;
    if(event.key==="ArrowRight")next=(index+1)%sections.length;
    else if(event.key==="ArrowLeft")next=(index+sections.length-1)%sections.length;
    else if(event.key==="Home")next=0;
    else if(event.key==="End")next=sections.length-1;
    else return;
    event.preventDefault();setView(sections[next].id);tabs.current[next]?.focus();
  };
  return <div className="sky-day-atlas">
    <style>{atlasStyles}</style>
    <div role="tablist" className="sky-day-atlas-tabs" aria-label={L(["Podrobnosti vybraného dne","Selected day details"])}>
      {sections.map((section,index)=><button type="button" role="tab" key={section.id} ref={node=>{tabs.current[index]=node;}} id={`${uid}-tab-${section.id}`} aria-selected={active===section.id} aria-controls={`${uid}-panel-${section.id}`} tabIndex={active===section.id?0:-1} onClick={()=>setView(section.id)} onKeyDown={event=>navigate(event,index)}><TmIcon id={section.icon} size={27}/><span>{L(section.label)}</span></button>)}
    </div>
    {sections.map(section=><section role="tabpanel" key={section.id} id={`${uid}-panel-${section.id}`} aria-labelledby={`${uid}-tab-${section.id}`} tabIndex={0} hidden={active!==section.id} className="sky-day-atlas-panel">
      <div className="sky-day-atlas-intro"><AtlasPlate kind={section.id}/><div><h3>{L(section.title)}</h3><p>{L(section.intro)}</p></div></div>
      {content[section.id]}
    </section>)}
  </div>;
}

const atlasStyles=`
.tg-astrology .sky-day-atlas{margin:30px 0 20px;min-width:0}
.tg-astrology .sky-day-atlas-tabs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px;margin:0 0 24px}
.tg-astrology .sky-day-atlas-tabs>button{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px;min-width:0;min-height:80px;padding:9px 2px 12px;border:0;border-radius:0;background:transparent;color:var(--astro-muted);position:relative;font:500 13px/1.35 var(--tm-font-tag);letter-spacing:.06em;text-transform:uppercase}
.tg-astrology .sky-day-atlas-tabs>button::after{content:"";position:absolute;bottom:0;left:50%;width:4px;height:4px;border-radius:50%;background:currentColor;opacity:0;transform:translateX(-50%)}
.tg-astrology .sky-day-atlas-tabs>button[aria-selected=true]{color:var(--astro-ink)}
.tg-astrology .sky-day-atlas-tabs>button[aria-selected=true]::after{opacity:1}
.tg-astrology .sky-day-atlas-tabs>button[aria-selected=true]>span{text-decoration:underline;text-underline-offset:5px;text-decoration-thickness:1px}
.tg-astrology .sky-day-atlas-tabs>button:hover>span{text-decoration:underline;text-underline-offset:5px}
.tg-astrology .sky-day-atlas-panel[hidden]{display:none}
.tg-astrology .sky-day-atlas-panel:focus-visible{outline:2px solid var(--astro-ink);outline-offset:5px}
.tg-astrology .sky-day-atlas-intro{display:grid;grid-template-columns:88px minmax(0,1fr);align-items:center;gap:17px;margin:0 0 26px}
.tg-astrology .sky-day-atlas-plate{display:block;width:88px;height:auto;color:var(--astro-ink)}
.tg-astrology .sky-day-atlas-intro h3{margin:0 0 8px;font:26px/1.15 var(--tm-font-display);text-wrap:balance;color:var(--astro-text)}
.tg-astrology .sky-day-atlas-intro p{font:13px/1.6 var(--tm-font-body);color:var(--astro-muted);margin:0}
.tg-astrology .sky-day-atlas-panel:not([hidden])>.sky-day-atlas-intro{animation:sky-atlas-reveal .28s cubic-bezier(.16,1,.3,1)}
@keyframes sky-atlas-reveal{from{opacity:.65;clip-path:inset(0 6% 0 0)}to{opacity:1;clip-path:inset(0)}}
@media(min-width:600px){.tg-astrology .sky-day-atlas-intro{grid-template-columns:110px minmax(0,1fr);gap:24px;max-width:580px}.tg-astrology .sky-day-atlas-plate{width:110px}.tg-astrology .sky-day-atlas-tabs{max-width:560px}}
@media(max-width:350px){.tg-astrology .sky-day-atlas-intro{grid-template-columns:70px minmax(0,1fr);gap:12px}.tg-astrology .sky-day-atlas-plate{width:70px}.tg-astrology .sky-day-atlas-intro h3{font-size:24px}}
@media(prefers-reduced-motion:reduce){.tg-astrology .sky-day-atlas-panel:not([hidden])>.sky-day-atlas-intro{animation:none}}
`;
