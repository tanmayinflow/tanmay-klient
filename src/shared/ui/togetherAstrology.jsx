import React,{useEffect,useId,useMemo,useState} from "react";
import {astrologyAt,astrologyDay,dateForAstrology,shiftAstrologyDay,CLASSICAL_BODIES,angleDistance} from "../product/togetherAstrology.js";
import {ASTRO_PLANETS,ASTRO_SIGNS,ASTRO_ELEMENTS,ASTRO_MODES,ASTRO_ASPECTS,ASTRO_DIGNITIES,ASTRO_LENSES,ASTRO_SOURCES,JYOTISH_READINGS} from "../product/togetherAstrologyEditorial.js";
import {ZODIAC,MOON_NAMES} from "../product/togetherMoon.js";
import {LUNAR_PHASE_PRACTICES} from "../product/togetherMoonEditorial.js";
import {TogetherCalendar} from "./togetherCalendar.jsx";
import {togetherTheme} from "./togetherStyles.js";

const point=(angle,radius)=>({x:190-Math.cos(angle*Math.PI/180)*radius,y:190+Math.sin(angle*Math.PI/180)*radius});
const textSymbol=symbol=>`${symbol}\uFE0E`;
const positionLabel=(planet,L)=>`${Math.floor(planet.degree)}° ${String(Math.floor((planet.degree%1)*60)).padStart(2,"0")}′ ${L(...ZODIAC[planet.sign])}`;
function chartPoints(planets){
  const placed=[];
  for(const planet of [...planets].sort((a,b)=>a.longitude-b.longitude)){
    const choices=[0,14,-14,28,-28,42,-42].flatMap(offset=>[121,80,41].map(radius=>({...point(planet.longitude+offset,radius),radius})));
    const next=choices.find(p=>placed.every(q=>Math.hypot(p.x-q.x,p.y-q.y)>=37))||choices.reduce((a,b)=>{
      const clearance=p=>Math.min(...placed.map(q=>Math.hypot(p.x-q.x,p.y-q.y)));
      return clearance(a)>clearance(b)?a:b;
    });
    placed.push({...planet,...next});
  }
  return placed;
}
function SkyChart({planets,aspects,selected,onSelect,nakshatra=false,L}){
  const uid=useId(),places=chartPoints(planets),byId=Object.fromEntries(places.map(p=>[p.id,p]));
  return <svg className="tg-astro-wheel" viewBox="0 0 380 380" role="group" aria-labelledby={`${uid}-title`} aria-describedby={`${uid}-desc`}>
    <title id={`${uid}-title`}>{L("Interaktivní kruh planet","Interactive planetary wheel")}</title>
    <desc id={`${uid}-desc`}>{L("Znamení začínají Beranem vlevo. Kliknutím na symbol vybereš planetu. Přesné polohy i všechny ovladače jsou také v seznamu pod grafem.","Signs begin with Aries on the left. Select a planet by its symbol. Exact positions and all controls are also listed below the chart.")}</desc>
    <g fill="none" stroke="currentColor" aria-hidden="true">
      <circle cx="190" cy="190" r="178" opacity=".6"/><circle cx="190" cy="190" r="149" opacity=".4"/>
      <circle cx="190" cy="190" r="144" strokeDasharray="1 5" opacity=".25"/>
      {Array.from({length:72},(_,i)=>{const a=point(i*5,178),b=point(i*5,i%6===0?149:174);return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} opacity={i%6===0?.6:.3}/>;})}
      {nakshatra&&Array.from({length:27},(_,i)=>{const a=point(i*360/27,141),b=point(i*360/27,135);return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} opacity=".5"/>;})}
      {aspects.map(aspect=>{const a=byId[aspect.a],b=byId[aspect.b];if(!a||!b)return null;return <line className="tg-astro-aspect" key={`${a.id}-${b.id}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} strokeWidth={a.id===selected||b.id===selected?1.2:.6} opacity={a.id===selected||b.id===selected?.65:.14} strokeDasharray={aspect.id==="square"||aspect.id==="opposition"?"3 4":undefined}/>;})}
      <circle cx="190" cy="190" r="3" opacity=".5"/>
    </g>
    {ASTRO_SIGNS.map((sign,i)=>{const p=point(i*30+15,163);return <text className="astro-symbol" key={i} x={p.x} y={p.y+6} textAnchor="middle" fontSize="21" fill="currentColor" aria-hidden="true">{textSymbol(sign.symbol)}</text>;})}
    {places.map(planet=>{const edge=point(planet.longitude,148),isSelected=planet.id===selected,name=L(...ASTRO_PLANETS[planet.id].name);return <g key={planet.id}>
      <line x1={edge.x} y1={edge.y} x2={planet.x} y2={planet.y} stroke="currentColor" opacity=".24" aria-hidden="true"/>
      <circle cx={edge.x} cy={edge.y} r="2" fill="currentColor" aria-hidden="true"/>
      <g className="tg-astro-planet" style={{transform:`translate(${planet.x}px,${planet.y}px)`}} role="button" tabIndex={0} aria-pressed={isSelected} aria-label={`${name}, ${positionLabel(planet,L)}${planet.retrograde?L(", retrográdní",", retrograde"):""}`} onClick={()=>onSelect(planet.id)} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();onSelect(planet.id);}}}>
        <circle r="20" className={isSelected?"selected":""}/><text className="astro-symbol" textAnchor="middle" y="8" fontSize="27" aria-hidden="true">{textSymbol(ASTRO_PLANETS[planet.id].symbol)}</text>
      </g>
    </g>;})}
  </svg>;
}

export function TogetherAstrology({day,lang="cs",t,onPlan}){
  const L=(cs,en)=>lang==="en"?en:cs,locale=lang==="en"?"en-GB":"cs-CZ";
  const initialDay=dateForAstrology(day)?day:astrologyDay();
  const [skyDay,setSkyDay]=useState(initialDay),[hour,setHour]=useState(12),[lens,setLens]=useState("western"),[selected,setSelected]=useState("Moon");
  const [playing,setPlaying]=useState(false),[calendar,setCalendar]=useState(false),[planetFilter,setPlanetFilter]=useState("all"),[aspectFilter,setAspectFilter]=useState("all"),[showAspects,setShowAspects]=useState(true);
  const [showMansions,setShowMansions]=useState(true);
  const timeId=useId(),calendarId=useId(),detailId=useId();
  useEffect(()=>{if(dateForAstrology(day)){setSkyDay(day);setHour(12);setPlaying(false);}},[day]);
  useEffect(()=>{
    if(!playing)return;
    const id=setInterval(()=>setHour(value=>{let next=value+.5;while(next<24&&!dateForAstrology(skyDay,next))next+=.5;return Math.min(23.5,next);}),450);
    return()=>clearInterval(id);
  },[playing,skyDay]);
  useEffect(()=>{if(hour>=23.5)setPlaying(false);},[hour]);
  useEffect(()=>{const stop=()=>{if(document.hidden)setPlaying(false);};document.addEventListener("visibilitychange",stop);return()=>document.removeEventListener("visibilitychange",stop);},[]);
  const date=useMemo(()=>dateForAstrology(skyDay,hour),[skyDay,hour]);
  const sky=useMemo(()=>astrologyAt(date,lens),[date,lens]);
  const planets=sky.planets.filter(p=>lens!=="western"?CLASSICAL_BODIES.includes(p.id):planetFilter==="lights"?["Sun","Moon"].includes(p.id):planetFilter==="classical"?CLASSICAL_BODIES.includes(p.id):true);
  const active=planets.find(p=>p.id===selected)||planets.find(p=>p.id==="Moon")||planets[0],entry=ASTRO_PLANETS[active.id];
  const possibleAspects=lens==="hellenistic"?sky.signAspects:sky.aspects;
  const aspects=possibleAspects.filter(a=>planets.some(p=>p.id===a.a)&&planets.some(p=>p.id===a.b)&&(aspectFilter==="all"||a.id===aspectFilter));
  const focusedAspects=aspects.filter(a=>a.a===active.id||a.b===active.id);
  const moonText=LUNAR_PHASE_PRACTICES[sky.moon.index],ruler=sky.planets.find(p=>p.id===active.ruler),dignity=ASTRO_DIGNITIES[active.dignity];
  const nextDate=new Date(sky.moon.next),fmtTime=d=>new Date(d).toLocaleString(locale,{day:"numeric",month:"long",hour:"2-digit",minute:"2-digit"});
  const formattedHour=`${String(Math.floor(hour)).padStart(2,"0")}:${hour%1?"30":"00"}`;
  const setDay=value=>{if(!dateForAstrology(value))return;setPlaying(false);if(!dateForAstrology(value,hour))setHour(12);setSkyDay(value);};
  const setTime=value=>{setPlaying(false);let next=value;while(next<24&&!dateForAstrology(skyDay,next))next+=.5;setHour(Math.min(23.5,next));};
  const selectLens=value=>{setLens(value);setPlaying(false);};
  const plan=()=>onPlan?.({title:L("Chvíle pod oblohou","A moment under the sky"),date:skyDay,minutes:10,note:L("Na chvíli vyjdeme ven bez telefonu. Pak každý pojmenujeme jeden obraz z dnešní oblohy, který v nás zůstal. Necháme ho být obrazem, nemusíme se na jeho významu shodnout.","Step outside without a phone for a while. Afterwards, each name one image from this sky that stayed with you. Let it remain an image; its meaning does not need agreement.")});
  return <div className="tg-astrology" style={{"--astro-ink":t.accentInk||t.accent,"--astro-text":t.text,"--astro-muted":t.textSec||t.textMuted||t.text,"--astro-line":t.borderSoft,"--astro-bg":t.card||t.bg,"--astro-on":t.onAccent||t.bg,color:t.text}}>
    <style>{`
      .tg-astrology{font:15px/1.65 var(--tm-font-body);max-width:680px;margin:0 auto;overflow-wrap:anywhere}
      .tg-astrology *{box-sizing:border-box}.tg-astrology p{margin:12px 0 18px;max-width:66ch}
      .tg-astrology h2,.tg-astrology h3,.tg-astrology h4{font-family:var(--tm-font-display);font-weight:400;line-height:1.25;color:var(--astro-text);letter-spacing:normal;text-transform:none}
      .tg-astrology h2{font-size:30px;margin:8px 0 12px}.tg-astrology h3{font-size:24px;margin:24px 0 10px}.tg-astrology h4{font-size:20px;margin:22px 0 8px}
      .tg-astrology .astro-label{font:12px/1.5 var(--tm-font-tag);letter-spacing:.14em;text-transform:uppercase;color:var(--astro-ink)}
      .tg-astrology .astro-small{font-size:12px;line-height:1.6;color:var(--astro-muted)}
      .tg-astrology button,.tg-astrology select{font:14px/1.3 var(--tm-font-body);min-height:44px;color:var(--astro-text);border:1px solid var(--astro-line);border-radius:7px;padding:10px 12px;background:transparent;cursor:pointer;max-width:100%}
      .tg-astrology button:disabled{opacity:.45;cursor:default}.tg-astrology button:hover:not(:disabled){border-color:var(--astro-ink)}
      .tg-astrology :is(button,input,select,summary,a,[role=button]):focus-visible{outline:2px solid var(--astro-ink);outline-offset:3px}
      .tg-astrology button[aria-pressed=true]{border-color:var(--astro-ink);color:var(--astro-ink)}
      .tg-astrology .astro-date{display:flex;align-items:center;gap:3px}.tg-astrology .astro-date .date-value{font:24px/1.2 var(--tm-font-display);border:0;flex:1;min-width:0;padding:8px 4px;text-align:center}
      .tg-astrology .astro-date>button:not(.date-value){border:0;flex:0 0 44px;font-size:20px}
      .tg-astrology .astro-date .astro-today{font:12px/1.4 var(--tm-font-tag);letter-spacing:.08em;text-transform:uppercase;flex:0 0 auto;min-width:44px;padding-inline:6px;white-space:nowrap;overflow-wrap:normal}
      .tg-astrology .astro-lenses{display:flex;border-bottom:1px solid var(--astro-line);margin:22px 0 12px;gap:4px}
      .tg-astrology .astro-lenses>button{flex:1;border:0;border-radius:0;border-bottom:2px solid transparent;font:12px/1.5 var(--tm-font-tag);letter-spacing:.1em;text-transform:uppercase;padding:12px 4px}
      .tg-astrology .astro-lenses>button[aria-pressed=true]{border-bottom-color:var(--astro-ink)}
      .tg-astrology .astro-lenses>button[aria-pressed=true]::before{content:'•';margin-right:5px}
      .tg-astrology .astro-time{display:grid;grid-template-columns:1fr auto;align-items:center;gap:8px;margin:12px 0}
      .tg-astrology .astro-time label{font:14px/1.5 var(--tm-font-body);display:block}.tg-astrology input[type=range]{width:100%;height:32px;accent-color:var(--astro-ink);display:block;cursor:pointer}
      .tg-astrology details{border:0;border-top:1px solid var(--astro-line);margin-top:20px;padding-top:0}
      .tg-astrology summary{font:12px/1.5 var(--tm-font-tag);letter-spacing:.13em;text-transform:uppercase;color:var(--astro-ink);min-height:44px;padding:12px 0;cursor:pointer;list-style:none}
      .tg-astrology summary::-webkit-details-marker{display:none}.tg-astrology summary::after{content:'›';display:inline-block;font:18px/1 var(--tm-font-body);margin-left:10px}.tg-astrology details[open]>summary::after{transform:rotate(90deg)}
      .tg-astrology .astro-filters{display:grid;grid-template-columns:1fr 1fr;gap:12px}.tg-astrology .astro-filters label{font-size:13px;min-width:0}.tg-astrology .astro-filters select{display:block;width:100%;margin-top:6px;background:var(--astro-bg)}
      .tg-astrology .astro-check{display:flex;align-items:center;gap:10px;min-height:44px;font-size:14px}.tg-astrology input[type=checkbox]{width:18px;height:18px;accent-color:var(--astro-ink)}
      .tg-astro-wheel{display:block;width:100%;max-width:460px;margin:18px auto 0;color:var(--astro-ink);overflow:visible}
      .tg-astrology .astro-symbol{font-family:"Segoe UI Symbol","Apple Symbols","Noto Sans Symbols 2","Noto Sans Symbols",serif;font-variant-emoji:text;font-weight:400}
      .tg-astro-planet{cursor:pointer;transition:transform .4s linear}.tg-astro-planet circle{fill:var(--astro-bg);stroke:currentColor;stroke-width:.7}.tg-astro-planet circle.selected{fill:var(--astro-ink);stroke-width:1.5}.tg-astro-planet text{fill:var(--astro-ink);pointer-events:none}.tg-astro-planet[aria-pressed=true] text{fill:var(--astro-on)}
      .tg-astro-aspect{transition:opacity .2s ease}.tg-astrology .astro-positions{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin:20px 0}
      .tg-astrology .astro-positions button{text-align:left;display:flex;align-items:center;gap:8px;padding:8px;min-height:55px;min-width:0}
      .tg-astrology .astro-positions .glyph{font-size:25px;width:28px;text-align:center;flex-shrink:0;color:var(--astro-ink)}
      .tg-astrology .astro-positions strong{display:block;font-size:13px;font-weight:500;line-height:1.4}.tg-astrology .astro-positions small{display:block;font-size:11px;line-height:1.5;color:var(--astro-muted)}
      .tg-astrology .astro-reading{border-top:1px solid var(--astro-line);padding-top:20px;margin-top:28px;scroll-margin-top:80px}
      .tg-astrology .astro-reading h3{margin-top:8px;font-size:28px}.tg-astrology .astro-position{font-variant-numeric:tabular-nums;color:var(--astro-ink)}
      .tg-astrology .astro-metrics{display:flex;flex-wrap:wrap;gap:8px 20px;padding:14px 0;border-block:1px solid var(--astro-line);font-size:13px}
      .tg-astrology .astro-connection{padding:14px 0;border-bottom:1px solid var(--astro-line)}.tg-astrology .astro-connection h4{margin:0 0 6px}.tg-astrology .astro-connection p{margin:8px 0}
      .tg-astrology a{color:var(--astro-ink);text-underline-offset:4px}.tg-astrology ul{padding-left:20px}.tg-astrology li{margin:8px 0}
      @media(prefers-reduced-motion:reduce){.tg-astro-planet,.tg-astro-aspect{transition:none}}
      @media(min-width:560px){.tg-astrology .astro-positions{grid-template-columns:repeat(3,minmax(0,1fr))}}
    `}</style>
    <div className="astro-label">{L("Obloha dne","Sky of the day")}</div>
    <div className="astro-date">
      <button type="button" aria-label={L("Předchozí den oblohy","Previous sky day")} disabled={skyDay==="1900-01-01"} onClick={()=>setDay(shiftAstrologyDay(skyDay,-1))}>‹</button>
      <button type="button" className="date-value" onClick={()=>setCalendar(v=>!v)} aria-expanded={calendar} aria-controls={calendarId}>{date.toLocaleDateString(locale,{day:"numeric",month:"long",year:"numeric"})}</button>
      <button type="button" aria-label={L("Další den oblohy","Next sky day")} disabled={skyDay==="2100-12-31"} onClick={()=>setDay(shiftAstrologyDay(skyDay,1))}>›</button>
      <button type="button" className="astro-today" onClick={()=>{setDay(astrologyDay());setHour(12);}}>{L("Dnes","Today")}</button>
    </div>
    <div id={calendarId} hidden={!calendar} className="tm-together" style={{...togetherTheme(t),padding:0}}><TogetherCalendar t={t} lang={lang} showCycle={false} showDetails={false} selectedDate={skyDay} onDateChange={setDay}/></div>
    <div className="astro-time">
      <div><label htmlFor={timeId}>{L("Čas","Time")} <strong>{formattedHour}</strong> <span className="astro-small">{Intl.DateTimeFormat().resolvedOptions().timeZone}</span></label><input id={timeId} type="range" min="0" max="23.5" step=".5" value={hour} onChange={e=>setTime(Number(e.target.value))} aria-valuetext={formattedHour}/></div>
      <button type="button" aria-pressed={playing} onClick={()=>{if(!playing)setHour(0);setPlaying(v=>!v);}}>{playing?L("Zastavit","Pause"):L("Přehrát den","Play day")}</button>
    </div>
    <div className="astro-lenses" role="group" aria-label={L("Astrologická tradice","Astrological tradition")}>{Object.entries(ASTRO_LENSES).map(([key,value])=><button type="button" key={key} onClick={()=>selectLens(key)} aria-pressed={lens===key}>{L(...value.name)}</button>)}</div>
    <p className="astro-small">{L(...ASTRO_LENSES[lens].subtitle)}{lens==="jyotish"?` · ${L("ajanámša","ayanamsa")} ${sky.ayanamsa.toFixed(2)}°`:""}</p>
    <SkyChart planets={planets} aspects={showAspects&&lens!=="jyotish"?aspects:[]} selected={active.id} onSelect={setSelected} nakshatra={lens==="jyotish"&&showMansions} L={L}/>
    <p className="astro-small" style={{textAlign:"center",marginTop:0}}>{L("Dotkni se planety a otevři její význam.","Select a planet to open its meaning.")}</p>
    <details>
      <summary>{L("Vrstvy a filtry grafu","Chart layers and filters")}</summary>
      <div className="astro-filters">
        {lens==="western"&&<label>{L("Planety","Planets")}<select value={planetFilter} onChange={e=>setPlanetFilter(e.target.value)}><option value="all">{L("Všech deset","All ten")}</option><option value="classical">{L("Sedm tradičních","Seven traditional")}</option><option value="lights">{L("Slunce a Měsíc","Sun and Moon")}</option></select></label>}
        {lens!=="jyotish"&&<label>{L("Vazby","Connections")}<select value={aspectFilter} onChange={e=>setAspectFilter(e.target.value)}><option value="all">{L("Všechny hlavní","All major aspects")}</option>{Object.entries(ASTRO_ASPECTS).map(([key,value])=><option value={key} key={key}>{L(...value.name)}</option>)}</select></label>}
      </div>
      {lens!=="jyotish"?<label className="astro-check"><input type="checkbox" checked={showAspects} onChange={e=>setShowAspects(e.target.checked)}/>{L("Spojnice aspektů","Aspect lines")}</label>:<label className="astro-check"><input type="checkbox" checked={showMansions} onChange={e=>setShowMansions(e.target.checked)}/>{L("27 lunárních stanic v kruhu","27 lunar mansions on the wheel")}</label>}
      <p className="astro-small">{lens==="jyotish"?L("Sedm tradičních těles. Kruh ukazuje znamení a nakšatry; západní aspekty tu nepřenášíme do systému dršti.","Seven traditional bodies. The wheel shows signs and nakshatras; Western aspects are not presented as drishti here."):lens==="hellenistic"?L("Spojnice zde znamenají vztah celých znamení. Nepoužívají čtyřstupňový orb západního pohledu.","Connections here relate whole signs, without the four-degree orb used in the Western view."):L("Zobrazujeme pět hlavních aspektů s orbem do 4°. Filtr omezuje graf i vazby vybrané planety níže.","Five major aspects within a four-degree orb. Filters apply to the chart and the selected planet's connections below.")}</p>
    </details>
    <div className="astro-positions" role="group" aria-label={L("Vybrat planetu","Select a planet")}>{planets.map(p=><button type="button" key={p.id} aria-pressed={p.id===active.id} aria-controls={detailId} onClick={()=>setSelected(p.id)}><span className="glyph astro-symbol" aria-hidden="true">{textSymbol(ASTRO_PLANETS[p.id].symbol)}</span><span><strong>{lens==="jyotish"?ASTRO_PLANETS[p.id].vedic:L(...ASTRO_PLANETS[p.id].name)}{p.retrograde?" ℞":""}</strong><small>{positionLabel(p,L)}</small></span></button>)}</div>
    <section className="astro-reading" id={detailId} aria-label={L("Výklad vybrané planety","Selected planet reading")}>
      <div className="astro-label">{lens==="jyotish"?`${entry.vedic} · ${L(...entry.name)}`:L(...entry.name)} · {positionLabel(active,L)}</div>
      <h3>{L(...entry.theme)}</h3>
      <div className="astro-metrics"><span>{L(...ASTRO_ELEMENTS[active.sign%4])} · {L(...ASTRO_MODES[ASTRO_SIGNS[active.sign].mode])}</span><span>{active.retrograde?L("℞ Zdánlivě zpětný pohyb","℞ Apparent retrograde motion"):L("Přímý pohyb","Direct motion")} · {Math.abs(active.speed).toFixed(2)}°/{L("den","day")}</span></div>
      <p>{lens==="jyotish"?L(...JYOTISH_READINGS[active.id]):L(...entry.text)}</p>
      <h4><span className="astro-symbol" aria-hidden="true">{textSymbol(ASTRO_SIGNS[active.sign].symbol)}</span> {L(...ZODIAC[active.sign])}</h4>
      <p>{L(...ASTRO_SIGNS[active.sign].text)}</p>
      {lens!=="western"&&<><h4>{L(...dignity.name)}</h4><p>{L(...dignity.text)}</p><p className="astro-position">{L("Vládce znamení","Sign ruler")}: {L(...ASTRO_PLANETS[active.ruler].name)} · {positionLabel(ruler,L)}</p><p className="astro-small">{L("Domicil a povýšení jsou jedna vrstva tradičního čtení; nejsou celkovým skóre síly planety.","Domicile and exaltation are one layer of traditional reading, not a total strength score.")}</p></>}
      {active.retrograde&&<><h4>{L("Zpětný pohyb jako obraz","Retrograde motion as an image")}</h4><p>{L("Ze Země se tato planeta právě jeví, jako by se po zvěrokruhu vracela. Obrácený pohyb používáme jako obraz přezkoumání: vrátit se k významu dřív, než přidáme další krok. Není to pokyn odkládat rozhodnutí ani vysvětlení událostí.","From Earth this planet currently appears to move backwards through the zodiac. We use reversal as an image of reconsideration: returning to meaning before adding another step, not a direction to postpone decisions or an explanation of events.")}</p></>}
      <details><summary>{L("Dar a jeho stín","The gift and its shadow")}</summary><p>{L(...entry.shadow)}</p><p className="astro-small">{L("Současné kontemplativní čtení tanmay. Obraz patří zkoumání vlastní zkušenosti, ne určování povahy druhého.","A contemporary tanmay contemplative reading: an image for exploring experience, not defining another person's character.")}</p></details>
      {lens!=="jyotish"&&<details open key={`${lens}-${active.id}`}><summary>{L("Vazby této planety","This planet's connections")} · {focusedAspects.length}</summary>{focusedAspects.length?focusedAspects.map(a=>{const other=a.a===active.id?a.b:a.a,meaning=ASTRO_ASPECTS[a.id];return <article className="astro-connection" key={other}><h4>{L(...ASTRO_PLANETS[other].name)} · {L(...meaning.name)}</h4><div className="astro-small">{lens==="hellenistic"?L("Vztah celých znamení","Whole-sign relationship"):`${a.angle}° · ${L("orb","orb")} ${a.orb.toFixed(2)}° · ${a.applying?L("sbíhavý","applying"):L("rozbíhavý","separating")}`}</div><p>{L(...meaning.text)}</p><p className="astro-small">{L(...entry.theme)} + {L(...ASTRO_PLANETS[other].theme)}</p><button type="button" onClick={()=>setSelected(other)}>{L("Prozkoumat","Explore")} {L(...ASTRO_PLANETS[other].name)}</button></article>;}):<p>{L("V tomto filtru není žádná vazba. Zkus jiné vrstvy grafu.","No connections match this filter. Try another chart layer.")}</p>}</details>}
    </section>
    {lens==="jyotish"&&<section className="astro-reading">
      <div className="astro-label">{L("Lunární čas","Lunar time")}</div><h3>{sky.jyotish.name} · {L("páda","pada")} {sky.jyotish.pada}</h3>
      <p>{L("Měsíc prochází","The Moon occupies")} {sky.jyotish.nakshatra+1}. {L("z 27 lunárních stanic. Každá má 13° 20′, páda 3° 20′. Tato jemnější vrstva vede pozornost od velkého tématu znamení k místu uvnitř něj. Při posunu času můžeš pozorovat přechod mezi stanicemi.","of 27 lunar mansions. Each spans 13° 20′; a pada spans 3° 20′. This finer layer moves attention from the broad sign to a place within it. Change the time to observe a mansion crossing.")}</p>
      <h4>{sky.jyotish.waxing?"Šukla pakša":"Krišna pakša"} · {sky.jyotish.tithiName}</h4>
      <p>{sky.jyotish.fortnightDay}. {L("tithi","tithi")} · {L("Úhlová vzdálenost Měsíce od Slunce","Moon's elongation from the Sun")} {sky.moon.elongation.toFixed(1)}°</p>
      <p>{L("Tithi není běžný den od půlnoci do půlnoci. Je to část vztahu obou světel, dvanáct stupňů jejich vzájemného pohybu. Pakša rozlišuje světlou a tmavou polovinu kruhu. To přináší jiný obraz času: nikoli seznam termínů, ale vztah, který postupně mění podobu.","A tithi is not a midnight-to-midnight day but twelve degrees in the relationship of the two lights. Paksha distinguishes the bright and dark halves. Time becomes a gradually changing relationship rather than simply a list of appointments.")}</p>
      <p className="astro-small">{L("Stav pro vybraný okamžik. Náboženský den a úplný paňčáng se určují také podle místního východu Slunce; ten zde nepočítáme.","Values at the selected instant. Religious observances and a full panchanga also use local sunrise, which is not calculated here.")}</p>
    </section>}
    <section className="astro-reading">
      <div className="astro-label">{L("Dva časy jedné oblohy","Two timescales of one sky")}</div>
      <h3>{L(...MOON_NAMES[sky.moon.index])} · {sky.moon.light} %</h3>
      <p>{L(...moonText.text)}</p><p className="astro-small">{L("Další hlavní fáze","Next principal phase")}: {L(...MOON_NAMES[sky.moon.nextIndex])} · {fmtTime(nextDate)}</p>
      <p>{L("Měsíc mění obraz nejrychleji. Pomalé planety nesou dlouhé pozadí; jejich znamení se mezi dvěma dny většinou nezmění. Když čteš oblohu pro konkrétní den, rozlišuj krátký rytmus od dlouhého tématu.","The Moon changes the image most quickly. Slow planets carry long background themes; their signs usually remain the same from one day to the next. Distinguish a short rhythm from a long theme when reading one day's sky.")}</p>
      {lens==="hellenistic"&&<p>{angleDistance(active.longitude,sky.planets[0].longitude)<15&&active.id!=="Sun"?L("Vybraná planeta je nyní blízko Slunce v ekliptikální délce. Starší tradice věnovaly velkou pozornost jejímu vztahu ke slunečním paprskům. Samotná úhlová blízkost ale ještě neurčuje skutečnou viditelnost na vašem místě.","The selected planet is currently close to the Sun in ecliptic longitude. Earlier traditions paid close attention to a planet's relationship with the solar rays. Angular proximity alone does not determine visibility at your location."):L("Helénistické čtení sleduje nejen planetu, ale i prostředí jejího hostitele a vazby mezi znameními. Výklad proto vzniká ze vztahů, ne z jediné izolované značky.","Hellenistic reading considers a planet together with its host and relationships between signs. Meaning arises from relationships rather than an isolated symbol.")}</p>}
      {onPlan&&<details><summary>{L("Vzít obraz ven","Take the image outside")}</summary><p>{L("Na chvíli odložte výklad i telefon. Podívejte se na skutečnou oblohu. Obraz, který ve vás zůstal, můžete později přinést do rozhovoru jako vlastní zkušenost.","Put the interpretation and phone aside for a moment. Look at the actual sky. Later you can bring an image that stayed with you into a conversation as your own experience.")}</p><button type="button" onClick={plan}>{L("Navrhnout chvíli venku","Propose time outside")}</button></details>}
    </section>
    <details><summary>{L("Klíč k této tradici","A key to this tradition")}</summary><p>{L(...ASTRO_LENSES[lens].text)}</p><p>{L("Přepínání tradice mění souřadný rámec nebo způsob výkladu, nikoli fyzické uspořádání oblohy. Znamení jsou stejně velké části kruhu, nejsou totožná s nerovně velkými astronomickými souhvězdími.","Switching traditions changes the coordinate frame or interpretive method, not the physical sky. Signs are equal sectors, distinct from unequal astronomical constellations.")}</p></details>
    <details><summary>{L("Výpočet, tradice a zdroje","Calculation, traditions and sources")}</summary>
      <p>{L("Polohy počítá místně Astronomy Engine, geocentricky pro zvolený čas zařízení. Zobrazení je obloha daného okamžiku, bez osobních domů a horoskopu narození. Rychlost odvozujeme ze změny délky v okolní hodině. Sbíhavost vychází ze směru okamžité změny odchylky od přesného aspektu.","Astronomy Engine calculates geocentric positions locally for the chosen device time. This is the sky at an instant, without natal houses or a birth chart. Speed is estimated from the surrounding hour. Application follows the instantaneous direction of change of the distance from the exact aspect.")}</p>
      <p>{L("Siderická Čitrá zde používá polohu Spicy, její vlastní pohyb a precesi. Nejde o implementaci Swiss Ephemeris ani o tabulkovou Lahiri. Jemné rozdíly výpočtů mohou u hranic znamení či nakšatry změnit zařazení. Hvězdný rámec je orientační na úrovni úhlové minuty; sekundy neuvádíme.","The Chitra frame uses Spica's position, proper motion and precession. It is not Swiss Ephemeris or tabulated Lahiri. Small numerical differences can change boundary classifications. The stellar frame is intended at arcminute scale; arcseconds are not displayed.")}</p>
      <p>{L("Tradiční pojmy opíráme o uvedené prameny. Kontemplativní texty jsou původní současnou tvorbou pro tanmay, nikoli překladem starých výroků nebo předpovědí. Astrologická symbolika není vědecky potvrzený vliv na zdraví, vztah či události.","Traditional terminology follows the sources below. Contemplative writing is original contemporary tanmay editorial, not a translation of ancient claims or a prediction. Astrological symbolism is not an established causal influence on health, relationships or events.")}</p>
      <p>{L("Tato část obsahuje tři konkrétní pohledy. Nepředstírá osobní tranzity, kompatibilitu, daši, volební astrologii ani úplný paňčáng; k těm jsou potřeba další údaje a samostatné metody.","This space contains three specific lenses. It does not simulate personal transits, compatibility, dashas, electional astrology or a full panchanga; those need additional inputs and methods.")}</p>
      <ul>{ASTRO_SOURCES.map(([name,url])=><li key={url}><a href={url} target="_blank" rel="noreferrer">{name}</a></li>)}</ul>
    </details>
  </div>;
}
