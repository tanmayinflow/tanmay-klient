import React,{useEffect,useId,useMemo,useRef,useState} from "react";
import {astrologyAt,dateForAstrology,initAstrologyEngine,astrologyEngineInfo} from "../product/togetherAstrology.js";
import {astrologyDayDetails} from "../product/togetherAstrologyCalendar.js";
import {zonedParts} from "../product/togetherAstrologyTime.js";
import {addSkyDays,dueSkyDecisions,skyDateKey} from "../product/skyJournal.js";
import {usePersonalProfile} from "./personalProfile.jsx";
import {TogetherCalendar} from "./togetherCalendar.jsx";
import {SKY_CSS,SkyDialog,SkyEmpty,SkyHelp,SkyLayer,skyTheme,useSkyJournal} from "./skyUi.jsx";
import {SkyNebe} from "./skyNebe.jsx";
import {SkyBody} from "./skyBody.jsx";
import {SkyPractice} from "./skyPractice.jsx";
import {SkySettings} from "./skySettings.jsx";
import {SkyPeriods} from "./skyPeriods.jsx";
import {SkyDetails,skyDetailTitle} from "./skyDetails.jsx";

const EXTRA_CSS=`
.tg-astrology .tg-astro-wheel{display:block;width:100%;max-width:460px;margin:18px auto;color:var(--astro-ink);overflow:visible}
.tg-astrology .astro-symbol,.tg-astrology .sky-planet-glyph{font-family:"Segoe UI Symbol","Apple Symbols","Noto Sans Symbols 2",serif;font-variant-emoji:text;font-weight:400}
.tg-astrology .tg-astro-planet{cursor:pointer;transition:transform .4s linear}.tg-astrology .tg-astro-planet circle{fill:var(--astro-bg);stroke:currentColor;stroke-width:.8}.tg-astrology .tg-astro-planet text{fill:var(--astro-ink);pointer-events:none}.tg-astrology .tg-astro-planet circle.selected{fill:var(--astro-ink);stroke-width:1.5}.tg-astrology .tg-astro-planet[aria-pressed=true] text{fill:var(--astro-on)}
.tg-astrology .sky-planet-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px 18px;margin:15px 0}.tg-astrology .sky-planet-list>button{display:flex;align-items:center;gap:8px;border:0;border-radius:0;min-width:0;text-align:left;padding:12px 0}.tg-astrology .sky-planet-list>button>span:nth-child(2){flex:1;min-width:0}.tg-astrology .sky-planet-list small{display:block;font-size:11px;color:var(--astro-muted)}.tg-astrology .sky-planet-glyph{font-size:27px;line-height:1;color:var(--astro-ink);flex:0 0 28px;text-align:center}.tg-astrology .sky-planet-list em{font-style:normal;color:var(--astro-ink)}
.tg-astrology .sky-hour-row{display:grid;grid-template-columns:80px 1fr auto;gap:12px;align-items:baseline;padding:10px 0;width:100%;font-size:13px}.tg-astrology .sky-hour-row strong{font-weight:400;font-family:var(--tm-font-display);font-size:22px}.tg-astrology .sky-hour-row[aria-current=time]{color:var(--astro-ink)}
.tg-astrology .sky-cal-picker{margin:12px 0 24px}.tg-astrology .sky-account-state{font-size:12px;color:var(--astro-muted);margin:10px 0}.tg-astrology .sky-warning{margin:12px 0;padding:12px 0;color:var(--astro-ink)}.tg-astrology .sky-loading{min-height:180px;display:grid;place-content:center;text-align:center}
@media(max-width:380px){.tg-astrology .sky-time{grid-template-columns:1fr}.tg-astrology .sky-hour-row{grid-template-columns:65px 1fr;gap:5px 10px}.tg-astrology .sky-hour-row>span:last-child{grid-column:2}.tg-astrology .sky-planet-list{column-gap:10px}.tg-astrology .sky-date .sky-date-value{font-size:22px}}
@media(prefers-reduced-motion:reduce){.tg-astrology .tg-astro-planet{transition:none}}
`;

export function TogetherAstrology({day,lang="cs",t,onPlan,cycle,ownCycle=false}){
  const account=usePersonalProfile();
  // Changing identity unmounts all private drafts as well as the stored journal.
  return <SkyWorkspace key={account.accountKey||"unverified"} day={day} lang={lang} t={t} onPlan={onPlan} cycle={cycle} ownCycle={ownCycle} account={account}/>;
}

function SkyWorkspace({day,lang,t,onPlan,cycle,ownCycle,account}){
  const L=(cs,en)=>lang==="en"?en:cs,locale=lang==="en"?"en-GB":"cs-CZ";
  const {journal,ready:journalReady,error:journalError,update,reload}=useSkyJournal(account.accountKey);
  const ready=journalReady&&account.status==="ready",suspended=Boolean(account.accountKey&&account.status!=="ready");
  const settings=journal.settings,zone=settings.location.timeZone;
  const [skyDay,setSkyDay]=useState(()=>dateForAstrology(day,12,zone)?day:skyDateKey(Date.now(),zone));
  const [hour,setHour]=useState(12),[tab,setTab]=useState("day"),[range,setRange]=useState("week");
  const [playing,setPlaying]=useState(false),[calendar,setCalendar]=useState(false),[detail,setDetail]=useState(null),[notice,setNotice]=useState("");
  const [zodiacOverride,setZodiacOverride]=useState(null),[engine,setEngine]=useState(()=>astrologyEngineInfo().ready?"ready":"loading"),[attempt,setAttempt]=useState(0),[clock,setClock]=useState(Date.now());
  const ids=useId(),notified=useRef(new Set()),today=skyDateKey(clock,zone);
  const actualZodiac=zodiacOverride||settings.zodiac,lens=actualZodiac==="sidereal"?"jyotish":"western";
  const visibleJournal=useMemo(()=>zodiacOverride?{...journal,settings:{...settings,zodiac:zodiacOverride}}:journal,[journal,settings,zodiacOverride]);
  const slots=useMemo(()=>Array.from({length:48},(_,i)=>i/2).filter(value=>dateForAstrology(skyDay,value,zone)),[skyDay,zone]);
  const date=useMemo(()=>dateForAstrology(skyDay,hour,zone),[skyDay,hour,zone]);

  useEffect(()=>{
    let cancelled=false;
    if(astrologyEngineInfo().ready){setEngine("ready");return;}
    setEngine("loading");
    initAstrologyEngine().then(()=>{if(!cancelled)setEngine("ready");}).catch(()=>{if(!cancelled)setEngine("error");});
    return()=>{cancelled=true;};
  },[attempt]);
  useEffect(()=>{if(dateForAstrology(day,12,zone)){setSkyDay(day);setHour(12);setPlaying(false);}},[day]);
  useEffect(()=>{setPlaying(false);setZodiacOverride(null);},[zone,settings.zodiac]);
  useEffect(()=>{
    if(date||!slots.length)return;
    setHour(slots.find(value=>value>=hour)??slots.at(-1));
  },[date,hour,slots]);
  useEffect(()=>{
    if(!playing)return;
    const timer=setInterval(()=>setHour(value=>slots.find(next=>next>value)??value),650);
    return()=>clearInterval(timer);
  },[playing,slots]);
  useEffect(()=>{if(hour>=slots.at(-1))setPlaying(false);},[hour,slots]);
  useEffect(()=>{
    const visibility=()=>{setClock(Date.now());if(document.hidden)setPlaying(false);};
    const settingsOpened=()=>{setDetail(null);setPlaying(false);};
    const timer=setInterval(()=>setClock(Date.now()),60000);
    document.addEventListener("visibilitychange",visibility);window.addEventListener("tm-open-personal-settings",settingsOpened);
    return()=>{clearInterval(timer);document.removeEventListener("visibilitychange",visibility);window.removeEventListener("tm-open-personal-settings",settingsOpened);};
  },[]);
  useEffect(()=>{
    if(!ready||!settings.notifications||document.hidden||!("Notification" in window)||Notification.permission!=="granted")return;
    const due=dueSkyDecisions(journal,clock).filter(row=>!row.notifiedAt&&!notified.current.has(row.id));
    if(!due.length)return;
    const idsToMark=new Set(due.map(row=>row.id)),time=Date.now();
    if(!update(current=>({...current,decisions:current.decisions.map(row=>idsToMark.has(row.id)?{...row,notifiedAt:time}:row)})))return;
    due.forEach(row=>notified.current.add(row.id));
    try{new Notification(L("Čas na ohlédnutí","Time to reflect"),{body:L("V Obloze čeká ohlédnutí za tvým rozhodnutím.","A decision review is waiting in Sky."),tag:`tm-sky-review:${account.accountKey}`});}catch{/* Reviews remain available inside the app when system notifications are unavailable. */}
  },[ready,settings.notifications,journal.decisions,clock,lang,account.accountKey]);

  const calculation=useMemo(()=>{
    if(engine!=="ready"||!date)return {sky:null,details:null,error:null};
    try{
      const options={nodeMode:settings.nodes,ayanamsa:"lahiri"};
      return {sky:astrologyAt(date,lens,options),details:astrologyDayDetails(date,{...options,location:settings.location,birth:{...settings.birth,precision:settings.birth.timeKnown?"exact":"unknown"}}),error:null};
    }catch(error){return {sky:null,details:null,error};}
  },[engine,date,lens,settings.nodes,settings.location,settings.birth,attempt]);
  const {sky,details}=calculation;
  const selectTab=value=>{setTab(value);setPlaying(false);setCalendar(false);setDetail(null);setNotice("");};
  const openSettings=()=>selectTab("settings");
  const open=value=>{
    setPlaying(false);
    if(value.kind==="settings"){openSettings();return;}
    if(value.kind==="life"){setRange("life");selectTab("period");return;}
    setDetail(value);
  };
  const chooseDay=(value,{keepTab=false}={})=>{
    let nextDay=value,nextHour=hour;
    if(!/^\d{4}-\d{2}-\d{2}$/.test(String(value))){
      const time=new Date(value).getTime();if(!Number.isFinite(time))return false;
      // The clock displays whole minutes; choose the first minute after an
      // event, never the previous classification. Rounding precedes zone conversion.
      const instant=new Date(Math.ceil(time/60000)*60000);
      const p=zonedParts(instant,zone);nextDay=skyDateKey(instant.getTime(),zone);nextHour=p.hour+p.minute/60;
    }
    if(!dateForAstrology(nextDay,nextHour,zone)){
      const available=Array.from({length:48},(_,i)=>i/2).filter(h=>dateForAstrology(nextDay,h,zone));
      if(!available.length){setNotice(L("Tento den není v daném pásmu nebo podporovaném rozsahu dostupný. Vyber jiný den.","This day is unavailable in this time zone or supported range. Choose another day."));return false;}
      nextHour=available.find(h=>h>=nextHour)??available.at(-1);
    }
    setPlaying(false);setCalendar(false);setDetail(null);setNotice("");setSkyDay(nextDay);setHour(nextHour);if(!keepTab)setTab("day");return true;
  };
  const adjacentDay=direction=>{
    let next=skyDay;
    for(let i=0;i<4;i++){next=addSkyDays(next,direction);if(!next||next<"1900-01-01"||next>"2100-12-31")return null;if(dateForAstrology(next,12,zone))return next;}
    return null;
  };
  const previous=adjacentDay(-1),next=adjacentDay(1);
  const setTime=value=>{setPlaying(false);const chosen=slots.find(h=>h>=value)??slots.at(-1);if(chosen!=null)setHour(chosen);};
  const setZodiac=value=>{setPlaying(false);if(ready){if(update(doc=>({...doc,settings:{...doc.settings,zodiac:value}})))setZodiacOverride(null);}else setZodiacOverride(value);};
  const selectedCycle=ownCycle&&account.profile.ownCycle&&cycle?.date===skyDay?cycle:null;
  const menstruation=Boolean(ownCycle&&account.profile.ownCycle&&selectedCycle?.phase?.id==="menstrual"&&selectedCycle.phase.basis==="recorded");
  const minutes=Math.round(hour*60),timeLabel=`${String(Math.floor(minutes/60)).padStart(2,"0")}:${String(minutes%60).padStart(2,"0")}`;
  const dateLabel=new Date(`${skyDay}T12:00:00Z`).toLocaleDateString(locale,{timeZone:"UTC",day:"numeric",month:"long",year:"numeric"});
  const loading=engine==="loading",failed=engine==="error"||Boolean(calculation.error);

  return <div className="tg-astrology" style={skyTheme(t)}>
    <style>{SKY_CSS+EXTRA_CSS}</style>
    <header hidden={suspended}>
      <div className="sky-date">
        <button type="button" aria-label={L("Předchozí den","Previous day")} disabled={!previous} onClick={()=>chooseDay(previous,{keepTab:true})}>‹</button>
        <button type="button" className="sky-date-value" aria-expanded={calendar} aria-controls={`${ids}-calendar`} onClick={()=>{setCalendar(value=>!value);setPlaying(false);}}>{dateLabel}</button>
        <button type="button" aria-label={L("Další den","Next day")} disabled={!next} onClick={()=>chooseDay(next,{keepTab:true})}>›</button>
        <button type="button" className="sky-today" onClick={()=>chooseDay(today,{keepTab:true})}>{L("Dnes","Today")}</button>
      </div>
      {calendar&&<div className="sky-cal-picker" id={`${ids}-calendar`}><TogetherCalendar picker selectedDate={skyDay} todayDate={today} onDateChange={value=>chooseDay(value,{keepTab:true})} showDetails={false} showCycle={false} lang={lang} t={t}/></div>}
      <div className="sky-time"><div><label htmlFor={`${ids}-time`}>{L("Čas","Time")} <strong className="sky-data">{timeLabel}</strong> <span className="sky-small">{zone}</span></label><input id={`${ids}-time`} type="range" min="0" max="23.5" step="0.5" value={hour} disabled={!slots.length} onChange={event=>setTime(Number(event.target.value))} aria-valuetext={`${timeLabel} ${zone}`}/></div><button type="button" disabled={engine!=="ready"||!date||!slots.length} aria-pressed={playing} onClick={()=>{if(!playing&&hour>=slots.at(-1))setHour(slots[0]);setPlaying(value=>!value);}}>{playing?L("Zastavit","Pause"):L("Přehrát den","Play the day")}</button></div>
      <button type="button" className="sky-place" onClick={openSettings}>{settings.location.name||L("Místo pozorování","Observing location")} · {zone}</button>
      <div className="sky-tabs" role="tablist" aria-label={L("Pohled na oblohu","Sky view")}>{[["day","Den","Day"],["period","Období","Periods"],["settings","Nastavení","Settings"]].map(([id,cs,en])=><button key={id} type="button" role="tab" id={`${ids}-tab-${id}`} aria-selected={tab===id} aria-controls={`${ids}-panel-${id}`} onClick={()=>selectTab(id)}>{L(cs,en)}</button>)}</div>
      <SkyHelp id="G02" onOpen={open} lang={lang}/>
    </header>
    {!suspended&&notice&&<p className="sky-warning" role="status">{notice}</p>}
    {!suspended&&journalError&&<div className="sky-warning" role="alert"><p>{journalError==="journal-conflict"?L("Zápisy se změnily v jiné kartě. Načti jejich aktuální podobu.","Records changed in another tab. Load their current version."):L("Soukromé zápisy teď nejdou načíst nebo uložit. Dosavadní data zůstala zachována.","Private records cannot be loaded or saved right now. Existing data has been preserved.")}</p><button type="button" onClick={reload}>{L("Načíst znovu","Reload")}</button></div>}
    {(!account.accountKey||suspended)&&<p className="sky-account-state" role="status">{["loading","checking"].includes(account.status)?L("Ověřuji účet pro tvoje soukromé zápisy…","Verifying your account for private records…"):suspended?L("Účet se zatím nepodařilo ověřit. Rozepsané zápisy čekají na opětovné ověření.","Your account could not be verified yet. Drafts are waiting for verification."):L("Oblohu můžeš prohlížet. Pro vlastní zápisy nejdřív přihlas svůj účet.","You can explore the sky. Sign in to keep personal records.")}{!["loading","checking"].includes(account.status)&&<button type="button" className="sky-quiet" onClick={account.refresh}>{L("Ověřit účet","Verify account")}</button>}</p>}
    <div hidden={suspended} id={`${ids}-panel-${tab}`} role="tabpanel" aria-labelledby={`${ids}-tab-${tab}`}>
      {tab==="settings"?(journalReady?<SkySettings journal={journal} update={update} ready={ready} lang={lang} onOpen={open}/>:<SkyEmpty text={L("Nastavení se otevře po načtení tvého účtu a soukromých zápisů.","Settings open after your account and private records are loaded.")}/>):loading?<div className="sky-loading" role="status">{L("Načítám oblohu…","Loading the sky…")}</div>:failed?<SkyEmpty text={L("Oblohu se nepodařilo spočítat. Zkus výpočet znovu nebo zkontroluj místo a čas.","The sky could not be calculated. Retry or check the place and time.")}><div className="sky-actions"><button type="button" onClick={()=>setAttempt(value=>value+1)}>{L("Zkusit znovu","Try again")}</button><button type="button" onClick={openSettings}>{L("Otevřít nastavení","Open settings")}</button></div></SkyEmpty>:!date?<SkyEmpty text={L("Tento místní čas neexistuje. Vyber jiný čas nebo den.","This local time does not exist. Choose another time or day.")}/>:sky&&details?tab==="period"?<SkyPeriods sky={sky} details={details} day={skyDay} journal={visibleJournal} update={update} ready={ready} lang={lang} t={t} range={range} setRange={setRange} onOpen={open} onDay={chooseDay} cycle={selectedCycle}/>:<>
        <SkyLayer name={L("Nebe","Sky")} subtitle={L("Vnější","Outer")} lang={lang} onOpen={open}><SkyNebe sky={sky} details={details} day={skyDay} journal={visibleJournal} lang={lang} onOpen={open} onWeek={()=>{setRange("week");selectTab("period");}} onZodiac={setZodiac}/></SkyLayer>
        <SkyLayer name={L("Tělo","Body")} subtitle={L("Vnitřní","Inner")} lang={lang} onOpen={open}><SkyBody sky={sky} details={details} day={skyDay} journal={visibleJournal} update={update} ready={ready} lang={lang} onOpen={open} onSettings={openSettings} cycle={selectedCycle}/></SkyLayer>
        <SkyLayer name={L("Praxe","Practice")} subtitle={L("Jiná","Alternative")} lang={lang} onOpen={open}><SkyPractice sky={sky} details={details} day={skyDay} journal={visibleJournal} update={update} ready={ready} lang={lang} onOpen={open} onPlan={onPlan} menstruation={menstruation}/></SkyLayer>
        <div className="sky-links"><button type="button" onClick={()=>open({kind:"tradition"})}>{L("Klíč k tradicím","A key to traditions")}</button><SkyHelp id="G08" onOpen={open} lang={lang}/></div>
      </>:null}
    </div>
    {detail&&sky&&details&&<SkyDialog suspended={suspended} key={`${detail.kind}:${detail.id||detail.type||detail.record?.id||detail.event?.id||"detail"}`} title={skyDetailTitle(detail,lang)} onClose={()=>setDetail(null)} t={t} lang={lang}><SkyDetails detail={detail} sky={sky} details={details} journal={visibleJournal} update={update} ready={ready} lang={lang} onOpen={open} onSettings={openSettings} onDay={chooseDay}/></SkyDialog>}
  </div>;
}
