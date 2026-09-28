import React,{useEffect,useState,useId,useMemo} from "react";
import {CYCLE_GUIDE,CYCLE_SOURCES} from "../product/togetherGuidance.js";
import {moonToday,MOON_NAMES,ZODIAC,LUNAR_REFLECTIONS,ZODIAC_REFLECTIONS,LUNAR_SOURCES} from "../product/togetherMoon.js";

export function PhaseGuide({phase,lang,onPlan}) {
  const L=(cs,en)=>lang==="en"?en:cs;
  const [selected,setSelected]=useState("");
  const current=phase?.id||"", shown=selected||current||"menstrual",guide=CYCLE_GUIDE[shown];
  return <section className="tm-together-section">
    <h2>{L("Jak si být oporou","How to support each other")}</h2>
    <p>{L("Nejvíc napoví to, jak ti dnes je. Tady najdeš nápady na péči a společný čas. Vyber si, co ti sedí.","How you feel today comes first. Here are a few ideas for care and time together. Choose what feels right for you.")}</p>
    <p className="hint">{phase?.basis==="recorded"?L("Krvácení vychází ze záznamu.","Bleeding is based on a record."):current?L("Zobrazená fáze je jen odhad z kalendáře. Hormonální fázi ani ovulaci nepotvrzuje.","The phase shown is a calendar estimate. It does not confirm a hormonal phase or ovulation."):L("Dnešní fázi neznáme. Záznamy chybí, odhady jsou vypnuté nebo fáze není sdílená. Průvodce si můžeš prohlédnout i tak.","Today's phase is unknown. Records are missing, estimates are off or the phase is not shared. You can still explore the guide.")}</p>
    <label>{L("Prohlédnout část cyklu","Explore part of the cycle")}<select value={shown} onChange={e=>setSelected(e.target.value)}>{Object.entries(CYCLE_GUIDE).map(([id,g])=><option key={id} value={id}>{L(...g.name)}{id===current?L(" · nyní"," · now"):""}</option>)}</select></label>
    {shown!==current&&<p className="hint">{L("Tohle je obecný průvodce vybranou částí cyklu. Neříká, v jaké fázi jsi dnes.","This is a general guide to the selected part of the cycle. It does not tell you which phase you are in today.")}</p>}
    <p>{L(...guide.about)}</p>
    <details><summary>{L("Jak pečovat o sebe","Caring for yourself")}</summary><p>{L(...guide.woman)}</p></details>
    <details><summary>{L("Jak být oporou","Being there for each other")}</summary><p>{L(...guide.partner)}</p></details>
    <details><summary>{L("Co podniknout spolu","An idea for time together")}</summary><p>{L(...guide.idea)}</p><p className="hint">{L("Domluvte se podle toho, na co máte oba chuť a prostor. I změna plánu je v pořádku.","Choose what you both have the wish and space for. It is fine to change the plan.")}</p>{onPlan&&<button type="button" onClick={()=>onPlan(L(...guide.idea))}>{L("Navrhnout společný čas","Propose time together")}</button>}</details>
    <details><summary>{L("Z čeho doporučení vycházejí","Basis and sources")}</summary><p>{L("Fáze nejsou pevný rozvrh výkonu. Zdravotní informace vycházejí ze zdrojů níže; partnerské tipy jsou naše obecné návrhy. Při nepravidelném cyklu, hormonální antikoncepci, těhotenství nebo po porodu používej záznamy bez odhadů. Při silné bolesti či neobvyklém krvácení kontaktuj lékaře.","Phases are not a fixed performance schedule. Health information follows the sources below; partner tips are our general suggestions. Use records without estimates with irregular cycles, hormonal contraception, pregnancy or postpartum. Seek medical care for severe pain or unusual bleeding.")}</p>{CYCLE_SOURCES.map(([title,url])=><p key={url}><a href={url} target="_blank" rel="noreferrer">{title}</a></p>)}</details>
  </section>;
}

// Original etched SVG: accurate changing terminator, crater strokes, imperfect orbital arcs.
export function MoonArt({phase=.5}) {
  const uid=useId().replace(/:/g,""),c=Math.cos(phase*Math.PI*2),wax=phase<.5;
  const points=[];for(let y=-40;y<=40;y+=1){const x=Math.sqrt(Math.max(0,1600-y*y));points.push(`${wax?x:-x},${y}`);}for(let y=40;y>=-40;y-=1){const x=Math.sqrt(Math.max(0,1600-y*y))*c;points.push(`${wax?x:-x},${y}`);}
  return <svg viewBox="0 0 150 180" fill="none" stroke="currentColor" strokeWidth=".9" aria-hidden="true"><defs><pattern id={uid} width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 4 4 0" stroke="currentColor" strokeWidth=".7"/></pattern><clipPath id={`${uid}-disc`}><circle r="40"/></clipPath></defs><g transform="translate(77 74)"><circle r="41"/><circle r="38" strokeDasharray=".6 3" opacity=".55"/><polygon points={points.join(" ")} fill="currentColor" fillOpacity=".15" strokeWidth=".55"/><polygon points={points.join(" ")} fill={`url(#${uid})`} opacity=".7" stroke="none"/><g clipPath={`url(#${uid}-disc)`} opacity=".6"><path d="M-26-18c-8 4-7 14 1 16 9 2 11-10 4-13m18 2c5-6 13-3 12 4s-10 9-13 3M16 10c-7 8-1 16 7 11 6-4 0-11-5-8M-17 22c-5-2-7 2-6 6m9-3 6 3M21-25l5 2M-7-29l3-3M4 27l3 4"/><circle cx="-8" cy="9" r="3"/><circle cx="20" cy="-8" r="2"/></g><path d="M-51 23C-67-14-39-64 4-58M34-50C63-30 68 8 49 38M-41 43C-17 64 17 63 38 47" opacity=".6"/><path d="M-55-8C-62 28-37 58-7 62M15-59c22 5 38 20 44 39" strokeDasharray="1 5"/></g><path d="M75 7v13m-6-6h12M77 132v10"/><circle cx="77" cy="124" r="2"/><path d="m23 38 2-5 2 5 5 2-5 2-2 5-2-5-5-2ZM121 118v8m-4-4h8"/></svg>;
}

export function MoonCompanion({lang,Sheet,t}) {
  const L=(cs,en)=>lang==="en"?en:cs;
  const [now,setNow]=useState(()=>new Date()),[open,setOpen]=useState(false),[offset,setOffset]=useState(0);
  const [showAction,setShowAction]=useState(false);
  const actionId=useId();
  useEffect(()=>{const update=()=>setNow(new Date());const id=setInterval(update,60000);window.addEventListener("focus",update);return()=>{clearInterval(id);window.removeEventListener("focus",update);};},[]);
  const moon=useMemo(()=>moonToday(now),[now]);
  const reflection=LUNAR_REFLECTIONS[(moon.quarter+offset)%LUNAR_REFLECTIONS.length];
  const zodiac=ZODIAC_REFLECTIONS[moon.sign],label=L(...MOON_NAMES[moon.index]);
  const fmt=d=>new Date(d).toLocaleString(lang==="en"?"en-GB":"cs-CZ",{day:"numeric",month:"long",hour:"2-digit",minute:"2-digit"});
  const begin=()=>{setNow(new Date());setOffset(0);setShowAction(false);setOpen(true);};
  const another=()=>{setOffset(value=>(value+1)%LUNAR_REFLECTIONS.length);setShowAction(false);};
  const sectionStyle={borderTop:`1px solid ${t.borderSoft}`,paddingTop:24,marginTop:24};
  const linkStyle={color:t.accentInk,textUnderlineOffset:4};
  return <>
    <button type="button" className="tg-moon" onClick={begin} aria-label={`${L("Měsíc a chvíle pro vás","The Moon and a moment together")} · ${label}`} title={L("Otevřít Měsíc a chvíli pro vás","Open the Moon and a moment together")}>
      <MoonArt phase={moon.phase}/><span>{label}</span>
    </button>
    {open&&Sheet&&<Sheet title={L("Měsíc a chvíle pro vás","The Moon and a moment together")} onClose={()=>setOpen(false)}>
      <div className="tg-moon-sheet" style={{color:t.text,fontFamily:"var(--tm-font-body)",lineHeight:1.65,maxWidth:680,margin:"0 auto",overflowWrap:"anywhere"}}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <div style={{width:88,flexShrink:0,color:t.accentInk}}><MoonArt phase={moon.phase}/></div>
          <div style={{minWidth:0}}>
            <h2 style={{fontFamily:"var(--tm-font-display)",fontWeight:400,fontSize:"clamp(25px, 5vw, 32px)",lineHeight:1.2,margin:0,color:t.heading}}>{label}</h2>
            <p style={{fontSize:14,margin:"8px 0 0",fontVariantNumeric:"tabular-nums"}}>{fmt(now)}<br/>{L("Osvětleno","Illuminated")} {moon.light} %</p>
          </div>
        </div>
        {moon.next&&<p style={{fontSize:14,margin:"8px 0 0"}}>{L("Příště","Coming next")}: {L(...MOON_NAMES[moon.nextIndex])} · {fmt(moon.next)}</p>}
        <p style={{fontSize:13,margin:"6px 0 0"}}>{L("Časy odpovídají časovému pásmu tvého zařízení.","Times follow your device's time zone.")}</p>

        <section style={sectionStyle} aria-label={L("Otázka pro vás","A question for you both")}>
          <div aria-live="polite" aria-atomic="true">
            <h3 style={{fontFamily:"var(--tm-font-display)",fontSize:26,fontWeight:400,lineHeight:1.25,margin:"0 0 12px",color:t.heading}}>{L(...reflection.title)}</h3>
            <p style={{margin:"0 0 16px"}}>{L(...reflection.text)}</p>
            <p style={{fontSize:13,margin:"0 0 12px"}}>{offset===0?L(...reflection.quality):L("Další námět. Můžeš si vybrat i mimo dnešní fázi.","Another idea. You can choose one beyond today's phase.")}</p>
            <p style={{fontFamily:"var(--tm-font-display)",fontSize:24,lineHeight:1.4,margin:"0 0 20px",color:t.heading}}>{L(...reflection.prompt)}</p>
          </div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <button type="button" onClick={()=>setShowAction(value=>!value)} aria-expanded={showAction} aria-controls={actionId} style={{minHeight:44,padding:"10px 14px",border:`1px solid ${t.accentInk}`,borderRadius:6,background:"transparent",color:t.accentInk,font:"inherit",cursor:"pointer"}}>
              {showAction?L("Skrýt malý krok","Hide the small step"):L("Zkusit spolu · 2 minuty","Try together · 2 minutes")}
            </button>
            <button type="button" onClick={another} style={{minHeight:44,padding:"10px 12px",border:`1px solid ${t.borderSoft}`,borderRadius:6,background:"transparent",color:t.text,font:"inherit",cursor:"pointer"}}>{L("Jiná otázka","Another question")}</button>
          </div>
          <div id={actionId} hidden={!showAction}>
            <p style={{margin:"18px 0 8px"}}>{L(...reflection.action)}</p>
            <p style={{fontSize:13,margin:"0 0 8px"}}>{L("Jen si povídejte. Nic se tu nezapisuje ani neodesílá.","Just talk. Nothing here is recorded or sent.")}</p>
          </div>
          <p style={{fontSize:13,margin:"18px 0 0"}}>{L("Otázky vycházejí z lunární symboliky. Vezmi si z nich to, co právě sedí vašemu životu.","These questions draw on lunar symbolism. Take what fits your life right now.")}</p>
        </section>

        <details style={sectionStyle}>
          <summary style={{cursor:"pointer",padding:"4px 0",color:t.heading}}>{L("Znamení jako podnět", "A sign as a reflection")} · {L(...ZODIAC[moon.sign])}</summary>
          <p><strong>{L(...zodiac.motif)}</strong></p>
          <p>{L(...zodiac.prompt)}</p>
          <p style={{fontSize:13}}>{L("Dnešní poloha Měsíce je v tropickém znamení", "Today's Moon is in the tropical sign of")} <strong>{L(...ZODIAC[moon.sign])}</strong>. {L("Znamení tady nabízí obraz k zamyšlení. Neurčuje tvou povahu ani to, co se mezi vámi stane.","The sign offers a symbolic image for reflection. It does not determine your personality or what will happen between you.")}</p>
          <p style={{fontSize:13}}>{L("Tropická znamení jsou dvanáct stejně velkých úseků zvěrokruhu. Nejde o astronomická souhvězdí ani védický výpočet.","Tropical signs are twelve equal sections of the zodiac. They are not astronomical constellations or a Vedic calculation.")}</p>
        </details>

        <details style={{...sectionStyle,paddingTop:16,marginTop:16}}>
          <summary style={{cursor:"pointer",padding:"4px 0",color:t.heading}}>{L("O symbolice a zdrojích","About the symbolism and sources")}</summary>
          <h3 style={{fontSize:18,margin:"20px 0 8px",color:t.heading}}>{L("Co vidíme na obloze","What we see in the sky")}</h3>
          <p>{L("Tvar Měsíce se mění podle toho, jakou část jeho osvětlené poloviny vidíme ze Země. Polohu, osvětlení a další hlavní fázi počítá aplikace místně pomocí Astronomy Engine. S menstruačním cyklem tyto výpočty nejsou propojené.","The Moon's shape changes with our view of its sunlit half from Earth. The app calculates its position, illumination and next main phase locally with Astronomy Engine. These calculations are independent of the menstrual cycle.")}</p>
          <p><a style={linkStyle} href={LUNAR_SOURCES.nasa} target="_blank" rel="noreferrer">NASA · Moon phases</a><br/><a style={linkStyle} href={LUNAR_SOURCES.calculation} target="_blank" rel="noreferrer">Astronomy Engine · {L("výpočet", "calculation")}</a></p>
          <h3 style={{fontSize:18,margin:"24px 0 8px",color:t.heading}}>{L("Odkud přichází inspirace","Where the inspiration comes from")}</h3>
          <p>{L("Náměty k rozhovoru jsme napsali pro tanmay. Vycházejí z obecných motivů současné západní lunární astrologie. Nejsou citátem ani osobním horoskopem. Astrologii tu používáme jako symbolický jazyk, ne jako vědecky potvrzený vliv na náladu, vztah nebo zdraví.","We wrote these conversation prompts for tanmay, drawing on common motifs in contemporary Western lunar astrology. They are not quotations or a personal horoscope. Astrology here is symbolic language, not an established influence on mood, relationships or health.")}</p>
          <ul style={{paddingLeft:20,lineHeight:1.8}}>
            <li><a style={linkStyle} href={LUNAR_SOURCES.chani} target="_blank" rel="noreferrer">CHANI · {L("Lunární fáze a práce s nimi", "Moon phases and working with them")}</a></li>
            <li><a style={linkStyle} href={LUNAR_SOURCES.gerhardt} target="_blank" rel="noreferrer">Dana Gerhardt · The Moon Watching Series</a></li>
            <li><a style={linkStyle} href={LUNAR_SOURCES.greene} target="_blank" rel="noreferrer">Liz Greene · Astrology is an Art</a></li>
            <li><a style={linkStyle} href={LUNAR_SOURCES.zodiac} target="_blank" rel="noreferrer">Dana Gerhardt · {L("Přehled lunární a astrologické symboliky", "Lunar and astrological symbolism")}</a></li>
          </ul>
          <h3 style={{fontSize:18,margin:"24px 0 8px",color:t.heading}}>{L("Starší tradice", "Earlier traditions")}</h3>
          <p>{L("Ptolemaios v Tetrabiblos I.8 popisuje čtyři části lunárního cyklu jazykem vláhy, tepla, sucha a chladu. Jde o historický astrologický výklad. Dnešní otázky jsou naše vlastní a nejsou překladem tohoto textu.","In Tetrabiblos I.8, Ptolemy describes four parts of the lunar cycle through moisture, warmth, dryness and coolness. This is a historical astrological interpretation. Today's questions are our own, not a translation of that text.")} <a style={linkStyle} href={LUNAR_SOURCES.ptolemy} target="_blank" rel="noreferrer">Tetrabiblos I.8</a></p>
          <p>{L("Buddhistická upósatha je v théravádové tradici časem obnovy praxe, meditace a etických závazků. Patří k jiné tradici než astrologie. Její kalendář se může lišit od astronomických okamžiků; tato aplikace neurčuje dnešní náboženský svátek.","In the Theravada tradition, Uposatha is a time to renew practice, meditation and ethical commitments. It is a different tradition from astrology. Its calendar can differ from astronomical moments; this app does not determine today's religious observance.")} <a style={linkStyle} href={LUNAR_SOURCES.uposatha} target="_blank" rel="noreferrer">Access to Insight · Uposatha</a></p>
        </details>
      </div>
    </Sheet>}
  </>;
}
