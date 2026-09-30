import React,{useEffect,useId,useMemo,useState} from "react";
import {dateForAstrology,astrologyAt,majorAspects,CLASSICAL_BODIES} from "../product/togetherAstrology.js";
import {panchangaAt,solarDay,natalAt} from "../product/togetherAstrologyCalendar.js";
import {astrologyPeriodBounds} from "../product/togetherAstrologyOverview.js";
import {astrologyEventTitle} from "../product/togetherAstrologyOverviewEditorial.js";
import {ASTRO_PLANETS,ASTRO_SIGNS,ASTRO_ASPECTS} from "../product/togetherAstrologyEditorial.js";
import {ZODIAC,MOON_NAMES} from "../product/togetherMoon.js";
import {addSkyDays,skyDateKey} from "../product/skyJournal.js";
import {SkyLayer,SkyHeading,SkyEmpty,SkyHelp,skyTime} from "./skyUi.jsx";
import {useSkyPeriod} from "./skyPeriodData.js";
import {TogetherAstrologyOverview} from "./togetherAstrologyOverview.jsx";

const WEEK_PLANETS=["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"];
const SEASONS={"march-equinox":["Březnová rovnodennost","March equinox"],"june-solstice":["Červnový slunovrat","June solstice"],"september-equinox":["Zářijová rovnodennost","September equinox"],"december-solstice":["Prosincový slunovrat","December solstice"]};
const supported=day=>day>="1900-01-01"&&day<="2100-12-31";
const civilDate=(day,lang,options={})=>new Date(`${day}T12:00:00Z`).toLocaleDateString(lang==="en"?"en-GB":"cs-CZ",{timeZone:"UTC",day:"numeric",month:"long",...options});
const planetName=(id,L)=>ASTRO_PLANETS[id]?L(...ASTRO_PLANETS[id].name):id||"—";
const Arrow=({next=false})=><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d={next?"m9 5 7 7-7 7":"m15 5-7 7 7 7"}/></svg>;
function MoonDisc({angle,size=22}){
  const uid=useId(),waxing=angle<180,light=(1-Math.cos(angle*Math.PI/180))/2,rx=Math.abs(1-2*light)*10;
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"><defs><clipPath id={uid}><circle cx="12" cy="12" r="10"/></clipPath></defs><circle cx="12" cy="12" r="10" fill="currentColor" opacity=".12"/><g clipPath={`url(#${uid})`} opacity=".8"><path d={waxing?"M12 2a10 10 0 0 1 0 20Z":"M12 2a10 10 0 0 0 0 20Z"} fill="currentColor"/><ellipse cx="12" cy="12" rx={rx} ry="10" fill={light>=.5?"currentColor":"var(--astro-bg)"}/></g><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth=".7"/></svg>;
}
function periodDates(bounds){const out=[];for(let d=bounds.firstDay;d<bounds.lastDay;d=addSkyDays(d,1))out.push(d);return out;}
function sampleDay(day,zone,location,lens){
  if(!supported(day))return {day};
  try{
    const date=dateForAstrology(day,12,zone);if(!date)return {day};
    const solar=location?solarDay(day,location):null,weekday=new Date(`${day}T12:00:00Z`).getUTCDay(),planet=solar?.status==="ok"?WEEK_PLANETS[(weekday+(date<Date.parse(solar.sunrise)?6:0))%7]:null;
    const {moon}=astrologyAt(date,lens,{skipNextPhase:true});
    return {day,planet,angle:moon.elongation,moon,...(lens==="jyotish"?panchangaAt(date):{})};
  }catch{return {day};}
}
function PeriodEvents({events,lens,lang,zone,onOpen}){
  const L=(cs,en)=>lang==="en"?en:cs;
  return events.length?<div>{events.map((event,i)=>{const eclipse=event.type==="eclipse",season=event.type==="season",label=eclipse?L(event.kind==="solar"?"Zatmění Slunce":"Zatmění Měsíce",event.kind==="solar"?"Solar eclipse":"Lunar eclipse"):season?L(...SEASONS[event.seasonId]):astrologyEventTitle(event,lang);return <article className="sky-period-event" key={event.id||`${event.type}:${i}`}><button type="button" onClick={()=>onOpen({kind:"event",event,lens})}><time className="sky-small">{skyTime(event.time,lang,zone,true)}</time><h4>{label}</h4>{eclipse&&<span className="sky-small">{event.visible===true?L("Viditelné z vybraného místa","Visible from the selected place"):event.visible===false?L("Z vybraného místa není viditelné","Not visible from the selected place"):L("Celosvětová událost · místní viditelnost neurčena","Global event · local visibility not determined")}</span>}</button></article>;})}</div>:<p className="sky-small">{L("V tomto období žádná taková událost.","No such event in this period.")}</p>;
}
function RetrogradeBands({period,lens,lang,zone,onOpen}){
  const L=(cs,en)=>lang==="en"?en:cs,[selected,setSelected]=useState(null);
  const bands=useMemo(()=>{
    if(!period)return [];
    const sky=astrologyAt(new Date(period.start),lens,{skipNextPhase:true}),result=[];
    for(const planet of sky.planets.filter(p=>!["Sun","Moon"].includes(p.id)&&(lens==="western"||CLASSICAL_BODIES.includes(p.id)))){
      const turns=period.events.filter(e=>e.type==="station"&&e.body===planet.id).sort((a,b)=>a.time-b.time),intervals=[];
      let start=planet.retrograde?period.start:null,startEvent=null;
      for(const turn of turns){if(turn.direction==="retrograde"){start=turn.time;startEvent=turn;}else if(start!=null){intervals.push({start,end:turn.time,startEvent,endEvent:turn});start=null;startEvent=null;}}
      if(start!=null)intervals.push({start,end:period.end,startEvent,endEvent:null});
      if(intervals.length)result.push({id:planet.id,intervals});
    }
    return result;
  },[period,lens]);
  if(!period||!bands.length)return null;
  const span=period.end-period.start,active=bands.flatMap(b=>b.intervals.map(i=>({...i,body:b.id}))).find(i=>`${i.body}:${i.start}`===selected);
  const stamp=value=>new Date(value).toLocaleDateString(lang==="en"?"en-GB":"cs-CZ",{timeZone:zone,day:"numeric",month:"short"});
  return <div className="sky-retrogrades"><div className="sky-retro-months" aria-hidden="true">{Array.from({length:12},(_,i)=><span key={i}>{i+1}</span>)}</div>{bands.map(b=><div className="sky-retro-row" key={b.id}><span>{planetName(b.id,L)}</span><div>{b.intervals.map(i=><button type="button" key={i.start} aria-pressed={selected===`${b.id}:${i.start}`} aria-label={`${planetName(b.id,L)} · ${L("retrográdní","retrograde")} · ${stamp(i.start)} – ${stamp(i.end-1)}`} style={{left:`${(i.start-period.start)/span*100}%`,width:`${(i.end-i.start)/span*100}%`}} onClick={()=>setSelected(`${b.id}:${i.start}`)}><span/></button>)}</div></div>)}<p className="sky-small">{L("Úseky zpětného pohybu v průběhu roku. Čísla nahoře jsou měsíce.","Retrograde intervals through the year. Numbers above are months.")}</p>{active&&<div className="sky-record"><h4>{planetName(active.body,L)} · {L("návrat","return")}</h4><p>{stamp(active.start)} – {stamp(active.end-1)}{!active.startEvent?` · ${L("začátek před tímto rokem","began before this year")}`:""}{!active.endEvent?` · ${L("pokračuje za hranici roku","continues beyond this year")}`:""}</p><div className="sky-links">{active.startEvent&&<button type="button" onClick={()=>onOpen({kind:"event",event:active.startEvent,lens})}>{L("Začátek návratu","Start of reversal")}</button>}{active.endEvent&&<button type="button" onClick={()=>onOpen({kind:"event",event:active.endEvent,lens})}>{L("Obrat vpřed","Return to direct motion")}</button>}</div></div>}</div>;
}
function PersonalYear({natal,birth,day,lang,onOpen}){
  const L=(cs,en)=>lang==="en"?en:cs,p=natal?.profection;
  if(!p)return <SkyEmpty text={L("Pro osobní rok potřebujeme známý čas a místo narození.","A personal year needs a known birth time and place.")}><button type="button" onClick={()=>onOpen({kind:"settings"})}>{L("Údaje narození","Birth details")}</button></SkyEmpty>;
  const [year,month,date]=birth.date.split("-").map(Number),start=new Date(Date.UTC(year+p.age,month-1,date)).toISOString().slice(0,10),end=new Date(Date.UTC(year+p.age+1,month-1,date)).toISOString().slice(0,10);
  return <><p className="sky-small">{L("Osobní rok k datu","Personal year at")} {civilDate(day,lang,{year:"numeric"})}</p><p className="sky-lead">{planetName(p.ruler,L)} · {L(...ZODIAC[p.sign])}</p><p>{p.house}. {L("dům profekce","profection house")} · {civilDate(start,lang,{year:"numeric"})} – {civilDate(end,lang,{year:"numeric"})}</p><p className="sky-small">{L("Hranicí jsou narozeniny. Výpočet vychází z tropického ascendentu.","The boundary is your birthday. This calculation uses the tropical ascendant.")}</p></>;
}
function YearWheel({sun,events,lang,onDay}){
  const L=(cs,en)=>lang==="en"?en:cs,[selected,setSelected]=useState(sun?.sign??0),chosen=events.find(e=>e.type==="ingress"&&e.body==="Sun"&&e.to===selected);
  return <><svg className="sky-year-wheel" viewBox="0 0 320 320" fill="none" stroke="currentColor" role="group" aria-label={L("Dvanáct slunečních znamení","Twelve solar signs")}><circle cx="160" cy="160" r="130" opacity=".4"/><circle cx="160" cy="160" r="83" opacity=".35"/>{ASTRO_SIGNS.map((sign,i)=>{const a=(i-3)*Math.PI/6,b=a+Math.PI/6,m=(a+b)/2;return <g key={i} role="button" tabIndex={0} aria-label={L(...ZODIAC[i])} aria-pressed={selected===i} onClick={()=>setSelected(i)} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();setSelected(i);}}} className="sky-year-sign"><path d={`M${160+83*Math.cos(a)} ${160+83*Math.sin(a)}L${160+130*Math.cos(a)} ${160+130*Math.sin(a)}A130 130 0 0 1 ${160+130*Math.cos(b)} ${160+130*Math.sin(b)}L${160+83*Math.cos(b)} ${160+83*Math.sin(b)}A83 83 0 0 0 ${160+83*Math.cos(a)} ${160+83*Math.sin(a)}Z`} strokeWidth=".6" fill="currentColor" fillOpacity={selected===i?".13":"0"}/><text className="astro-symbol" x={160+108*Math.cos(m)} y={168+108*Math.sin(m)} textAnchor="middle" fill="currentColor" stroke="none" fontSize="26">{`${sign.symbol}\uFE0E`}</text></g>;})}<circle cx="160" cy="160" r="22"/><path d="M160 124v8m0 56v8m-36-36h8m56 0h8m-61-25 6 6m38 38 6 6m0-50-6 6m-38 38-6 6"/></svg><div className="sky-period-focus"><h4>{L(...ZODIAC[selected])}</h4>{chosen?<button className="sky-quiet" type="button" onClick={()=>onDay(chosen.time)}>{L("Slunce vstupuje","Sun enters")} · {civilDate(chosen.day,lang)}</button>:<span className="sky-small">{L("Vstup Slunce bude dostupný po výpočtu roku.","The Sun's entry appears after the annual calculation.")}</span>}</div></>;
}
function Intention({storageKey,title,journal,update,ready,lang,draft,onDraft}){
  const L=(cs,en)=>lang==="en"?en:cs,saved=journal.intentions[storageKey],initial=typeof saved==="string"?saved:saved?.text||"",value=draft??initial,[message,setMessage]=useState(""),id=useId(),dirty=value!==initial;
  useEffect(()=>setMessage(""),[storageKey]);
  return <div className="sky-intention"><label htmlFor={id}>{title}</label><textarea id={id} value={value} maxLength={2000} rows={3} onChange={e=>{onDraft(e.target.value);setMessage("");}} placeholder={L("Čemu chci dát prostor…","What I want to make room for…")}/><button type="button" disabled={!ready||!dirty} onClick={()=>{const text=value.trim();if(update(doc=>({...doc,intentions:{...doc.intentions,[storageKey]:{text,time:Date.now()}}}))){onDraft(text);setMessage(L("Záměr uložený.","Intention saved."));}else setMessage(L("Záměr se nepodařilo uložit. Text zůstává otevřený.","The intention could not be saved. Your text remains here."));}}>{L("Uložit záměr","Save intention")}</button>{dirty&&<span className="sky-small"> {L("Neuložený zápis","Unsaved draft")}</span>}<p role="status" className="sky-status">{message}</p></div>;
}
function NatalMissing({natal,lang,onOpen}){
  const L=(cs,en)=>lang==="en"?en:cs;
  const reasons={
    "before-birth":L("Vybrané datum je před narozením.","The selected date is before birth."),
    "ambiguous-birth-time":L("Čas narození připadá na opakovanou hodinu při změně času. Osobní výpočet zatím nelze jednoznačně určit.","The birth time falls in a repeated clock hour. A unique personal calculation is not yet available."),
    "invalid-birth-time":L("Čas narození v daném pásmu není platný. Zkontroluj uložené údaje.","The birth time is not valid in that time zone. Check the saved details."),
    "undefined-polar-ascendant":L("Přesně na zeměpisném pólu nelze jednoznačně určit ascendent.","An ascendant cannot be uniquely determined at an exact geographical pole."),
  };
  return <SkyEmpty text={reasons[natal?.status]||L("Osobní přehled potřebuje známé datum, čas a místo narození.","A personal overview needs a known birth date, time and place.")}><SkyHelp id="L05" onOpen={onOpen} lang={lang}/><button type="button" onClick={()=>onOpen({kind:"settings"})}>{L("Údaje narození","Birth details")}</button></SkyEmpty>;
}
function DashaPeriods({natal,birth,day,lang,onOpen,compact=false}){
  const L=(cs,en)=>lang==="en"?en:cs,[selected,setSelected]=useState(null),dasha=natal?.dasha,current=dasha?.current,active=dasha?.periods?.find(p=>p.start===selected)||current;
  if(!current)return <SkyEmpty text={L("Pro vybrané datum není dostupné období daši.","No dasha period is available for the selected date.")}/>;
  const name=id=>planetName(id,L),birthTime=Date.parse(natal.date),limit=birthTime+120*365.2425*86400000,periods=dasha.periods.filter(p=>Date.parse(p.end)>birthTime&&(Date.parse(p.start)<limit||p.start===current.start)),stamp=value=>new Date(value).toLocaleDateString(lang==="en"?"en-GB":"cs-CZ",{timeZone:birth.timeZone,month:"short",year:"numeric"});
  const timeline=<><div className="sky-dasha-timeline" aria-label={L("Planetární období života","Planetary life periods")}>{periods.map(p=><button type="button" key={p.start} aria-pressed={active?.start===p.start} onClick={()=>setSelected(p.start)} style={{flexGrow:p.years}}><span className="sky-label">{name(p.lord)}</span><span>{stamp(p.start)} – {stamp(p.end)}</span>{current.start===p.start&&<small>{L("Vybrané datum je zde","Selected date is here")}</small>}</button>)}</div>{active&&<div className="sky-record"><h4>{name(active.lord)} · {L("téma období","period theme")}</h4>{ASTRO_PLANETS[active.lord]&&<p>{L(...ASTRO_PLANETS[active.lord].theme)}</p>}<p className="sky-small">{stamp(active.start)} – {stamp(active.end)}{Date.parse(active.start)<birthTime?` · ${L("část období předchází narození","part of the period precedes birth")}`:""}</p></div>}</>;
  return <><SkyHeading id="J03" onOpen={onOpen} lang={lang}>{L("Vimšóttarí daša","Vimshottari dasha")}</SkyHeading><p className="sky-small">{L("K datu","At")} {civilDate(day,lang,{year:"numeric"})}</p><p className="sky-lead">{name(current.lord)}{dasha.subperiod?` · ${name(dasha.subperiod.lord)}`:""}</p><p>{L("Hlavní planetární období a jeho dílčí úsek v džjótiše.","The major planetary period and its subperiod in Jyotisha.")}</p><p className="sky-small">{L("Hlavní období do","Major period until")} {stamp(current.end)}{dasha.subperiod?<><br/>{L("Dílčí období do","Subperiod until")} {stamp(dasha.subperiod.end)}</>:null}</p>{compact?<details><summary>{L("Prohlédnout životní období","Browse life periods")}</summary>{timeline}</details>:timeline}</>;
}
function WesternPersonal({natal,sky,day,lang,onOpen}){
  const L=(cs,en)=>lang==="en"?en:cs,planets=natal.tropicalPlanets||[],transits=useMemo(()=>{
    const result=[];
    for(const moving of sky.planets)for(const target of planets){
      for(const aspect of majorAspects([{...moving,id:`transit:${moving.id}`},{...target,id:`natal:${target.id}`,speed:0}],3))result.push({...aspect,planet:moving.id,natalPlanet:target.id});
    }
    return result.sort((a,b)=>a.orb-b.orb);
  },[sky.planets,planets]);
  return <><SkyHeading id="D03" onOpen={onOpen} lang={lang}>{L("Tranzity k natálním planetám","Transits to natal planets")}</SkyHeading><p className="sky-small">{L("K datu","At")} {civilDate(day,lang,{year:"numeric"})} · {L("tropický zvěrokruh","tropical zodiac")}</p><p>{L("Porovnání současných poloh planet s jejich polohami při narození. Přehled zachycuje vybraný okamžik.","A comparison of current planetary positions with their positions at birth. This overview shows the selected instant.")}</p>{transits.length?<div className="sky-personal-transits">{transits.map(p=><article className="sky-record" key={`${p.planet}:${p.natalPlanet}:${p.id}`}><h4>{planetName(p.planet,L)} → {L("natální","natal")} {planetName(p.natalPlanet,L)}</h4><p>{L(...ASTRO_ASPECTS[p.id].name)} · {p.angle}°</p><p className="sky-small">{L("Odchylka od přesného aspektu","Distance from exact aspect")} {p.orb.toFixed(2)}°</p></article>)}</div>:<SkyEmpty text={L("V tomto okamžiku nejsou hlavní aspekty do 3° od přesnosti.","No major aspects are within 3° of exact at this instant.")}/>}<p className="sky-small">{L("Sledujeme konjunkci, sextil, kvadraturu, trigon a opozici s odchylkou nejvýše 3°.","Conjunction, sextile, square, trine and opposition are shown within a 3° orb.")}</p><details><summary>{L("Natální polohy planet","Natal planetary positions")}</summary>{planets.map(p=><div className="sky-record" key={p.id}><strong>{planetName(p.id,L)}</strong> · {L(...ZODIAC[p.sign])} {p.degree.toFixed(1)}°</div>)}</details></>;
}
function PersonalPeriods({natal,birth,sky,day,lens,lang,onOpen,compact=false}){
  const L=(cs,en)=>lang==="en"?en:cs;
  if(natal?.status!=="ok")return <NatalMissing natal={natal} lang={lang} onOpen={onOpen}/>;
  if(lens==="jyotish")return <DashaPeriods natal={natal} birth={birth} day={day} lang={lang} onOpen={onOpen} compact={compact}/>;
  if(lens==="hellenistic")return <><SkyHeading id="H03" onOpen={onOpen} lang={lang}>{L("Roční profekce","Annual profection")}</SkyHeading><PersonalYear natal={natal} birth={birth} day={day} lang={lang} onOpen={onOpen}/></>;
  return <WesternPersonal natal={natal} sky={sky} day={day} lang={lang} onOpen={onOpen}/>;
}

export function SkyPeriods({day,range="week",setRange,onDay,sky,details,journal,update,ready,lang="cs",onOpen}){
  const L=(cs,en)=>lang==="en"?en:cs,settings=journal.settings,zone=settings.location.timeZone,lens=sky.lens||"western",sidereal=lens==="jyotish";
  const [anchor,setAnchor]=useState(day),[selectedDay,setSelectedDay]=useState(day),[drafts,setDrafts]=useState({});
  useEffect(()=>{setAnchor(day);setSelectedDay(day);},[day]);
  const bounds=useMemo(()=>{try{return astrologyPeriodBounds(anchor,range==="life"?"year":range,{timeZone:zone});}catch{return null;}},[anchor,range,zone]);
  const {period,error}=useSkyPeriod(anchor,lens,range,{timeZone:zone,nodeMode:settings.nodes,location:settings.location},range!=="life");
  const dates=useMemo(()=>bounds?periodDates(bounds):[],[bounds]),calendarDates=useMemo(()=>{if(!bounds||range!=="month")return dates;const weekday=new Date(`${bounds.firstDay}T12:00:00Z`).getUTCDay(),start=addSkyDays(bounds.firstDay,-((weekday+6)%7)),last=addSkyDays(bounds.lastDay,-1),length=Math.ceil(((Date.parse(last)-Date.parse(start))/86400000+1)/7)*7;return Array.from({length},(_,i)=>addSkyDays(start,i));},[bounds,dates,range]);
  const samples=useMemo(()=>range==="week"||range==="month"?calendarDates.map(d=>sampleDay(d,zone,range==="week"?settings.location:null,lens)):[],[calendarDates,range,zone,settings.location,lens]),selected=samples.find(d=>d.day===selectedDay)||samples.find(d=>d.day===anchor)||samples[0];
  const periodSky=useMemo(()=>{try{return anchor===day?sky:astrologyAt(dateForAstrology(anchor,12,zone),lens,{skipNextPhase:true,nodeMode:settings.nodes});}catch{return sky;}},[anchor,day,sky,zone,lens,settings.nodes]);
  const personalNatal=useMemo(()=>{
    if(range!=="year"||anchor===day)return details?.natal;
    try{const date=dateForAstrology(anchor,12,zone);return date?natalAt(date,{...settings.birth,precision:settings.birth.timeKnown?"exact":"unknown"},{nodeMode:settings.nodes,ayanamsa:"lahiri"}):{status:"invalid-civil-day"};}catch{return {status:"unavailable"};}
  },[range,anchor,day,zone,settings.birth,settings.nodes,details?.natal]);
  const extraEvents=[...(period?.eclipses||[]).map(e=>({...e,type:"eclipse",eclipseType:e.type,id:`eclipse:${e.kind}:${e.time}`})),...(period?.seasons||[]).map(e=>({...e,type:"season",seasonId:e.id,id:`season:${e.id}`}))],importantEvents=[...(period?.events||[]).filter(e=>e.type==="station"||e.type==="phase"),...extraEvents].sort((a,b)=>new Date(a.time)-new Date(b.time));
  const sunEvents=(period?.events||[]).filter(e=>e.type==="ingress"&&e.body==="Sun").map(e=>({...e,day:skyDateKey(e.time,zone)}));
  // Retain saved intention keys across this presentation change.
  const intentionKey=range==="life"?`life:${details?.natal?.dasha?.current?.start||"open"}`:`${range}:${bounds?.firstDay||anchor}`;
  const navigate=direction=>{let next;if(range==="week")next=addSkyDays(anchor,direction*7);else{const d=new Date(`${anchor.slice(0,range==="year"?4:7)}${range==="year"?"-01-01":"-01"}T12:00:00Z`);if(range==="year")d.setUTCFullYear(d.getUTCFullYear()+direction);else d.setUTCMonth(d.getUTCMonth()+direction);next=d.toISOString().slice(0,10);}if(supported(next)){setAnchor(next);setSelectedDay(next);}};
  const rangeLabel=range==="week"&&bounds?`${civilDate(bounds.firstDay,lang,{month:"short"})} – ${civilDate(addSkyDays(bounds.lastDay,-1),lang,{month:"short",year:"numeric"})}`:range==="month"?civilDate(anchor,lang,{day:undefined,year:"numeric"}):anchor.slice(0,4);
  const chooseDay=d=>{setSelectedDay(d);if(d.slice(0,7)!==anchor.slice(0,7)&&range==="month")setAnchor(d);};
  const moonLabel=sample=>sample.moon?L(...MOON_NAMES[sample.moon.index]):L("Výpočet není dostupný","Calculation unavailable");
  return <div className="sky-periods"><style>{PERIOD_CSS}</style><div style={{display:"flex",alignItems:"center",gap:4}}><nav style={{flex:1,minWidth:0}} className="sky-tabs" aria-label={L("Délka období","Period length")}>{[["week","Týden","Week"],["month","Měsíc","Month"],["year","Rok","Year"],["life","Život","Life"]].map(([id,cs,en])=><button type="button" key={id} aria-pressed={range===id} onClick={()=>setRange(id)}>{L(cs,en)}</button>)}</nav><SkyHelp id="O01" onOpen={onOpen} lang={lang}/></div>
    {range!=="life"&&<div className="sky-period-navigation"><button type="button" aria-label={L("Předchozí období","Previous period")} disabled={bounds?.firstDay<="1900-01-01"} onClick={()=>navigate(-1)}><Arrow/></button><h3>{rangeLabel}</h3><button type="button" aria-label={L("Další období","Next period")} disabled={bounds?.lastDay>="2101-01-01"} onClick={()=>navigate(1)}><Arrow next/></button></div>}
    <SkyLayer name={L(range==="life"?"Osobní období":"Obloha v období",range==="life"?"Personal periods":"Sky through the period")} subtitle={L(sidereal?"Džjótiša":lens==="hellenistic"?"Helénistická astrologie":"Západní astrologie",sidereal?"Jyotisha":lens==="hellenistic"?"Hellenistic astrology":"Western astrology")}>
      {range==="life"?<PersonalPeriods natal={details?.natal} birth={settings.birth} sky={sky} day={day} lens={lens} lang={lang} onOpen={onOpen}/>:<>
        <SkyHeading id={range==="week"?"W01":range==="month"?(sidereal?"M01":"N03"):"Y01"} onOpen={onOpen} lang={lang}>{L(range==="week"?"Sedm dnů oblohy":range==="month"?"Proměny Luny":"Slunce během roku",range==="week"?"Seven days of sky":range==="month"?"The changing Moon":"The Sun through the year")}</SkyHeading>
        {range==="week"&&<div className="sky-period-strip" aria-label={L("Dny týdne","Days of the week")}>{samples.map(s=><button key={s.day} type="button" aria-pressed={selected?.day===s.day} aria-label={`${civilDate(s.day,lang)}, ${moonLabel(s)}${sidereal&&s.tithi?`, ${s.tithi}. tithi`:""}`} onClick={()=>chooseDay(s.day)}><span className="sky-small">{civilDate(s.day,lang,{day:undefined,month:undefined,weekday:"short"})}</span><strong>{Number(s.day.slice(-2))}</strong>{s.angle!=null&&<MoonDisc angle={s.angle}/>}<span className="sky-small">{planetName(s.planet,L)}</span>{sidereal&&s.tithi?<small>{s.tithi}. tithi</small>:s.moon&&<small>{s.moon.light}%</small>}</button>)}</div>}
        {range==="month"&&<div className="sky-month-grid" aria-label={L("Kalendář měsíce","Month calendar")}>{Array.from({length:7},(_,i)=><span key={i}>{civilDate(addSkyDays("2026-09-28",i),lang,{day:undefined,month:undefined,weekday:"short"})}</span>)}{samples.map(s=><button type="button" key={s.day} disabled={!supported(s.day)} className={s.day.slice(0,7)!==anchor.slice(0,7)?"outside":""} aria-pressed={selected?.day===s.day} aria-label={`${civilDate(s.day,lang)}, ${moonLabel(s)}${sidereal&&s.tithi?`, ${s.tithi}. tithi`:""}`} onClick={()=>chooseDay(s.day)}><span>{Number(s.day.slice(-2))}</span>{s.angle!=null&&<MoonDisc angle={s.angle} size={18}/>}<small>{sidereal?s.tithi||"—":s.moon?`${s.moon.light}%`:"—"}</small></button>)}</div>}
        {(range==="week"||range==="month")&&<p className="sky-small">{sidereal?L("Luna a tithi v místní poledne.","Moon and tithi at local noon."):L("Osvětlená část Luny v procentech v místní poledne.","The Moon's illuminated fraction at local noon, in percent.")}</p>}
        {(range==="week"||range==="month")&&selected&&<div className="sky-period-selection"><div><h4>{civilDate(selected.day,lang,{weekday:"long"})}</h4>{selected.moon?<><p>{moonLabel(selected)} · {selected.moon.light}%</p>{sidereal&&selected.tithi&&<p>{selected.tithi}. tithi · {selected.tithiName}<br/><span className="sky-small">{selected.nakshatraName}</span></p>}<span className="sky-small">{selected.angle<180?L("Luna dorůstá","Waxing Moon"):L("Luna ubývá","Waning Moon")} · {L("ve 12:00","at 12:00")}</span></>:<p className="sky-small">{L("Pro tento den není výpočet dostupný.","The calculation is unavailable for this day.")}</p>}</div><button type="button" onClick={()=>onDay(selected.day)}>{L("Otevřít den","Open day")} <Arrow next/></button></div>}
        {range==="year"&&<><YearWheel sun={periodSky.planets.find(p=>p.id==="Sun")} events={sunEvents} lang={lang} onDay={onDay}/><p className="sky-small">{sidereal?L("Siderická znamení · Lahiri","Sidereal signs · Lahiri"):L("Tropická znamení","Tropical signs")}</p><PeriodEvents events={extraEvents.filter(e=>e.type==="season")} lens={lens} lang={lang} zone={zone} onOpen={onOpen}/><details><summary>{L("Dvanáct vstupů Slunce","Twelve solar ingresses")}</summary><PeriodEvents events={sunEvents} lens={lens} lang={lang} zone={zone} onOpen={onOpen}/></details></>}
        {!period&&<p role="status" className="sky-status">{error?L("Události období se nepodařilo načíst. Změň období a zkus to znovu.","Period events could not load. Change the period and try again."):L("Skládám pohyby oblohy…","Gathering the sky's movements…")}</p>}
        {period&&range==="week"&&<><SkyHeading id="W02" onOpen={onOpen} lang={lang}>{L("Souvislosti týdne","The week's wider picture")}</SkyHeading><TogetherAstrologyOverview sky={periodSky} day={anchor} lens={lens} lang={lang} period={period} timeZone={zone} onOpen={onOpen} onDay={onDay}/>{extraEvents.some(e=>e.type==="eclipse")&&<PeriodEvents events={extraEvents.filter(e=>e.type==="eclipse")} lens={lens} lang={lang} zone={zone} onOpen={onOpen}/>}</>}
        {period&&range!=="week"&&<><SkyHeading id={range==="year"?"Y02":sidereal?"M01":"N18"} onOpen={onOpen} lang={lang}>{L(range==="year"?"Retrogrády a zatmění":"Události měsíce",range==="year"?"Retrogrades and eclipses":"Events of the month")}</SkyHeading>{range==="year"&&<RetrogradeBands period={period} lens={lens} lang={lang} zone={zone} onOpen={onOpen}/>}<PeriodEvents events={range==="year"?importantEvents.filter(e=>e.type==="eclipse"):importantEvents} lens={lens} lang={lang} zone={zone} onOpen={onOpen}/></>}
        {range==="year"&&<PersonalPeriods natal={personalNatal} birth={settings.birth} sky={periodSky} day={anchor} lens={lens} lang={lang} onOpen={onOpen} compact/>}
      </>}
    </SkyLayer>
    <SkyLayer name={L("Vlastní záměr","Your intention")} subtitle={L("Prostor pro tvoji volbu","Room for your choice")}>
      <Intention storageKey={intentionKey} title={L(range==="life"?"Jeden krok pro toto období":"Můj záměr pro toto období",range==="life"?"One step for this period":"My intention for this period")} journal={journal} update={update} ready={ready} lang={lang} draft={drafts[intentionKey]} onDraft={text=>setDrafts(d=>({...d,[intentionKey]:text}))}/>
    </SkyLayer>
  </div>;
}

const PERIOD_CSS=`
.tg-astrology .sky-period-navigation{display:flex;align-items:center;gap:8px;margin:25px 0 10px}.tg-astrology .sky-period-navigation h3{flex:1;text-align:center;font-size:25px}.tg-astrology .sky-period-navigation button{border:0;display:grid;place-items:center;padding:8px;flex:0 0 42px}
.tg-astrology .sky-period-strip button{position:relative}.tg-astrology .sky-period-strip button>svg{display:block;margin:10px auto}.tg-astrology .sky-period-strip button[aria-pressed=true]{border-color:var(--astro-ink)}
.tg-astrology .sky-month-grid button{min-height:86px;position:relative}.tg-astrology .sky-month-grid button>svg{display:block;margin:5px auto}.tg-astrology .sky-month-grid button[aria-pressed=true]{border-color:var(--astro-ink)}.tg-astrology .sky-period-selection{display:flex;gap:16px;align-items:center;justify-content:space-between;margin:14px 0 26px}.tg-astrology .sky-period-selection h4{margin-top:0}.tg-astrology .sky-period-selection button{flex:0 0 94px;display:flex;align-items:center;gap:5px;padding:8px;border:0;text-align:left}
.tg-astrology .sky-period-focus{text-align:center;min-height:80px}.tg-astrology .sky-period-focus h4{margin:10px 0 0}.tg-astrology .sky-year-sign{cursor:pointer}.tg-astrology .sky-year-sign:focus-visible{outline:none}.tg-astrology .sky-year-sign:focus-visible path{stroke-width:2.5}.tg-astrology .sky-intention{margin:26px 0}.tg-astrology .sky-intention>label{font:24px var(--tm-font-display)}
.tg-astrology .sky-dasha-timeline{display:flex;gap:8px;overflow-x:auto;padding:10px 0 18px;scroll-snap-type:x proximity;scrollbar-width:thin;scrollbar-color:var(--astro-ink) transparent}.tg-astrology .sky-dasha-timeline button{flex-basis:160px;flex-shrink:0;border:0;border-bottom:2px solid var(--astro-line);border-radius:0;text-align:left;scroll-snap-align:start}.tg-astrology .sky-dasha-timeline button[aria-pressed=true]{border-color:var(--astro-ink)}.tg-astrology .sky-dasha-timeline button>span,.tg-astrology .sky-dasha-timeline small{display:block}.tg-astrology .sky-dasha-timeline button>span+span{font-size:12px;margin-top:7px}.tg-astrology .sky-dasha-timeline small{font-size:11px;color:var(--astro-ink);margin-top:5px}
.tg-astrology .sky-retrogrades{margin:20px 0}.tg-astrology .sky-retro-months{display:grid;grid-template-columns:repeat(12,1fr);margin-left:75px;font-size:10px;color:var(--astro-muted)}.tg-astrology .sky-retro-row{display:grid;grid-template-columns:65px 1fr;gap:10px;align-items:center;min-height:46px}.tg-astrology .sky-retro-row>span{font:18px var(--tm-font-display)}.tg-astrology .sky-retro-row>div{position:relative;height:44px}.tg-astrology .sky-retro-row>div::before{content:"";position:absolute;top:21px;left:0;right:0;height:1px;background:var(--astro-line)}.tg-astrology .sky-retro-row button{position:absolute;top:0;height:44px;padding:0;border:0;display:flex;align-items:center;background:transparent;min-width:12px}.tg-astrology .sky-retro-row button span{height:11px;width:100%;background:var(--astro-ink);opacity:.55;border-radius:2px}.tg-astrology .sky-retro-row button[aria-pressed=true] span{height:15px;opacity:1}
@media(min-width:600px){.tg-astrology .sky-period-strip button{flex:1 0 76px}.tg-astrology .sky-personal-transits{display:grid;grid-template-columns:1fr 1fr;gap:0 24px}}
`;
