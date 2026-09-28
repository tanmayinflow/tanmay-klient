import React,{useEffect,useState,useId,useMemo,useRef} from "react";
import {CYCLE_GUIDE,CYCLE_SOURCES} from "../product/togetherGuidance.js";
import {moonToday,MOON_NAMES,ZODIAC,ZODIAC_REFLECTIONS,LUNAR_SOURCES} from "../product/togetherMoon.js";
import {LUNAR_PHASE_PRACTICES,LUNAR_ELEMENTS,LUNAR_ARCHETYPES} from "../product/togetherMoonEditorial.js";

export function PhaseGuide({phase,lang,onPlan,embedded=false}) {
  const L=(cs,en)=>lang==="en"?en:cs;
  const [selected,setSelected]=useState("");
  const current=phase?.id||"", shown=selected||current||"menstrual",guide=CYCLE_GUIDE[shown];
  return <section className="tm-together-section">
    {!embedded&&<h2>{L("Jak si být oporou","How to support each other")}</h2>}
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

export function MoonCompanion({lang,Sheet,t,onPlan}) {
  const L=(cs,en)=>lang==="en"?en:cs;
  const [now,setNow]=useState(()=>new Date()),[open,setOpen]=useState(false),[offset,setOffset]=useState(0),[selectedPhase,setSelectedPhase]=useState(null);
  const [showAction,setShowAction]=useState(false);
  const [phaseFocus,setPhaseFocus]=useState(false),reflectionHeading=useRef(null);
  const actionId=useId();
  useEffect(()=>{const update=()=>setNow(new Date());const id=setInterval(update,60000);window.addEventListener("focus",update);return()=>{clearInterval(id);window.removeEventListener("focus",update);};},[]);
  const moon=useMemo(()=>moonToday(now),[now]);
  const phaseIndex=selectedPhase??moon.index,reflection=LUNAR_PHASE_PRACTICES[phaseIndex];
  const prompt=reflection.prompts[offset%reflection.prompts.length];
  const zodiac=ZODIAC_REFLECTIONS[moon.sign],element=LUNAR_ELEMENTS[moon.sign%4],archetype=LUNAR_ARCHETYPES[moon.sign],label=L(...MOON_NAMES[moon.index]);
  const fmt=d=>new Date(d).toLocaleString(lang==="en"?"en-GB":"cs-CZ",{day:"numeric",month:"long",hour:"2-digit",minute:"2-digit"});
  const begin=()=>{setNow(new Date());setOffset(0);setSelectedPhase(null);setShowAction(false);setOpen(true);};
  const another=()=>setOffset(value=>(value+1)%reflection.prompts.length);
  const choosePhase=value=>{setSelectedPhase(value==="today"?null:Number(value));setOffset(0);setShowAction(false);setPhaseFocus(true);};
  useEffect(()=>{if(!phaseFocus||!open)return;const id=requestAnimationFrame(()=>{reflectionHeading.current?.focus({preventScroll:true});reflectionHeading.current?.scrollIntoView({block:"start",behavior:"auto"});setPhaseFocus(false);});return()=>cancelAnimationFrame(id);},[phaseFocus,open,phaseIndex]);
  const planRitual=()=>{setOpen(false);onPlan?.({title:L(...reflection.ritual),minutes:10,note:reflection.steps.map((step,index)=>`${index+1}. ${L(...step)}`).join("\n")});};
  const sectionStyle={borderTop:`1px solid ${t.borderSoft}`,paddingTop:12,marginTop:20};
  const linkStyle={color:t.accentInk,textUnderlineOffset:4};
  const summaryStyle={cursor:"pointer",minHeight:44,alignContent:"center",padding:"4px 0",fontFamily:"var(--tm-font-tag)",fontSize:12,textTransform:"uppercase",letterSpacing:".14em",lineHeight:1.5,color:t.accentInk};
  const smallHeadingStyle={fontFamily:"var(--tm-font-display)",fontSize:19,fontWeight:400,lineHeight:1.3,margin:"22px 0 8px",color:t.accentInk};
  const buttonStyle={minHeight:44,padding:"10px 14px",border:`1px solid ${t.borderSoft}`,borderRadius:6,background:"transparent",color:t.text,font:"inherit",cursor:"pointer"};
  return <>
    <button type="button" className="tg-moon" onClick={begin} aria-label={`${L("Měsíc a chvíle pro vás","The Moon and a moment together")} · ${label}`} title={L("Otevřít Měsíc a chvíli pro vás","Open the Moon and a moment together")}>
      <MoonArt phase={moon.phase}/><span>{label}</span>
    </button>
    {open&&Sheet&&<Sheet title={L("Měsíc a chvíle pro vás","The Moon and a moment together")} onClose={()=>setOpen(false)}>
      <div className="tg-moon-sheet" style={{color:t.text,fontFamily:"var(--tm-font-body)",lineHeight:1.65,maxWidth:680,margin:"0 auto",overflowWrap:"anywhere"}}>
        <style>{`.tg-moon-sheet :is(button,select,summary,a):focus-visible{outline:2px solid ${t.accentInk};outline-offset:4px}.tg-moon-sheet button:hover{background:${t.borderSoft}}.tg-moon-sheet ::selection{background:${t.accentInk};color:${t.bg}}.tg-moon-sheet p{max-width:65ch}`}</style>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <div style={{width:88,flexShrink:0,color:t.accentInk}}><MoonArt phase={moon.phase}/></div>
          <div style={{minWidth:0}}>
            <h2 style={{fontFamily:"var(--tm-font-display)",fontWeight:400,fontSize:"clamp(25px, 5vw, 32px)",lineHeight:1.2,margin:0,color:t.heading}}>{label}</h2>
            <p style={{fontSize:14,margin:"8px 0 0",fontVariantNumeric:"tabular-nums"}}>{fmt(now)}<br/>{L("Osvětleno","Illuminated")} {moon.light} %</p>
          </div>
        </div>
        {moon.next&&<p style={{fontSize:14,margin:"8px 0 0"}}>{L("Příště","Coming next")}: {L(...MOON_NAMES[moon.nextIndex])} · {fmt(moon.next)}</p>}
        <section style={sectionStyle} aria-label={L("Otázka pro vás","A question for you both")}>
          <div aria-live="polite" aria-atomic="true">
            <h3 ref={reflectionHeading} tabIndex={-1} style={{fontFamily:"var(--tm-font-display)",fontSize:26,fontWeight:400,lineHeight:1.25,margin:"0 0 12px",scrollMarginTop:80,color:t.heading}}>{L(...reflection.title)}</h3>
            <p style={{margin:"0 0 16px"}}>{L(...reflection.text)}</p>
            <p style={{fontSize:13,margin:"0 0 16px",color:t.accentInk}}>{selectedPhase!==null&&selectedPhase!==moon.index?`${L("Prohlížíš jinou fázi","Exploring another phase")}: ${L(...MOON_NAMES[phaseIndex])}`:L("Dnešní lunární obraz · vezměte si z něj to, co s vámi souzní.","Today's lunar image · take what resonates with you.")}</p>
            <p style={{fontFamily:"var(--tm-font-display)",fontSize:24,lineHeight:1.4,margin:"0 0 20px",color:t.heading}}>{L(...prompt)}</p>
          </div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <button type="button" onClick={()=>setShowAction(value=>!value)} aria-expanded={showAction} aria-controls={actionId} style={{...buttonStyle,borderColor:t.accentInk,color:t.accentInk}}>
              {showAction?L("Skrýt rituál","Hide the ritual"):L("Malý rituál · 10 minut","A small ritual · 10 minutes")}
            </button>
            <button type="button" onClick={another} style={buttonStyle}>{L("Jiná otázka","Another question")}</button>
          </div>
          <div id={actionId} hidden={!showAction}>
            <h4 style={smallHeadingStyle}>{L(...reflection.ritual)}</h4>
            <ol style={{paddingLeft:22,margin:"12px 0 20px"}}>{reflection.steps.map((step,index)=><li key={index} style={{paddingLeft:4,marginBottom:12}}>{L(...step)}</li>)}</ol>
            <p style={{fontSize:13,margin:"0 0 16px"}}>{L("Stačí přečíst podnět a odložit telefon. Můžete skončit i dřív; nic se samo nezapisuje ani nesdílí.","Read the invitation and put your phone aside. You can finish sooner; nothing is automatically recorded or shared.")}</p>
            {onPlan&&<button type="button" onClick={planRitual} style={buttonStyle}>{L("Naplánovat spolu","Plan together")}</button>}
          </div>
        </section>

        <details style={sectionStyle}>
          <summary style={summaryStyle}>{L("Jít pod povrch","Go beneath the surface")}</summary>
          <h4 style={smallHeadingStyle}>{L("Záměr","Intention")}</h4>
          <p style={{margin:"0 0 12px"}}>{L(...reflection.intention)}</p>
          <h4 style={smallHeadingStyle}>{L("Stín, kterému lze naslouchat","A shadow to listen to")}</h4>
          <p style={{margin:"0 0 12px"}}>{L(...reflection.shadow)}</p>
          <h4 style={smallHeadingStyle}>{L("Přenést do života","Bring it into life")}</h4>
          <p style={{margin:"0 0 8px"}}>{L(...reflection.integration)}</p>
          <p style={{fontSize:13}}>{L("Každý mluví o sobě. Stín tu znamená přehlíženou potřebu nebo naučenou reakci; není to nálepka pro partnera.","Each person speaks about themselves. Shadow here means an overlooked need or a learned reaction; it is not a label for your partner.")}</p>
        </details>

        <details style={sectionStyle}>
          <summary style={summaryStyle}>{L("Dnešní znamení", "Today's sign")} · {L(...ZODIAC[moon.sign])}</summary>
          <h4 style={smallHeadingStyle}>{L(...archetype.name)}</h4>
          <p style={{margin:"0 0 12px"}}>{L(...archetype.balance)}</p>
          <h4 style={smallHeadingStyle}>{L(...zodiac.motif)}</h4>
          <p>{L(...zodiac.prompt)}</p>
          <h4 style={smallHeadingStyle}>{L("Živel", "Element")} · {L(...element.name)}</h4>
          <p><strong>{L("Dar", "Gift")}:</strong> {L(...element.gift)}<br/><strong>{L("Jeho druhá strana", "Its other side")}:</strong> {L(...element.shadow)}</p>
          <p>{L(...element.practice)}</p>
          <p style={{fontSize:13}}>{L("Jde o dnešní polohu Měsíce v tropickém zvěrokruhu, nikoli vaše osobní znamení. Archetyp je obraz k zamyšlení, který můžete přijmout nebo nechat být.","This is today's Moon position in the tropical zodiac, not your personal sign. The archetype is an image for reflection that you can take or leave.")}</p>
        </details>

        <details style={sectionStyle}>
          <summary style={summaryStyle}>{L("Prohlédnout celý lunární kruh","Explore the lunar cycle")}</summary>
          <p>{L("Někdy s námi souzní jiná část kruhu. Vyberte si její otázky a rituál; dnešní obloha nahoře zůstává stejná.","Sometimes a different part of the cycle resonates. Choose its questions and ritual; today's sky above stays the same.")}</p>
          <label style={{display:"block",fontSize:14,color:t.accentInk}}>{L("Fáze pro zamyšlení","A phase to reflect on")}
            <select value={selectedPhase===null?"today":String(selectedPhase)} onChange={event=>choosePhase(event.target.value)} style={{...buttonStyle,display:"block",width:"100%",maxWidth:"100%",marginTop:8,background:t.bg,color:t.text}}>
              <option value="today">{L("Dnešní fáze","Today's phase")} · {label}</option>
              {MOON_NAMES.map((name,index)=><option key={index} value={index}>{L(...name)}</option>)}
            </select>
          </label>
          <p style={{fontSize:13}} role="status">{L("Otázka, rituál a zamyšlení výše nyní patří k fázi", "The question, ritual and reflection above now belong to")} <strong>{L(...MOON_NAMES[phaseIndex])}</strong>.</p>
        </details>

        <details style={{...sectionStyle,paddingTop:16,marginTop:16}}>
          <summary style={{...summaryStyle,fontSize:12}}>{L("O tomto průvodci","About this guide")}</summary>
          <h3 style={{fontSize:18,margin:"20px 0 8px",color:t.heading}}>{L("Co vidíme na obloze","What we see in the sky")}</h3>
          <p>{L("Polohu Měsíce, osvětlení a další hlavní fázi počítá aplikace místně pomocí Astronomy Engine. Časy odpovídají časovému pásmu zařízení. Názvy osmi fází označují části cyklu kolem hlavních fází, ne jen jejich přesný okamžik. S menstruačním cyklem výpočty nejsou propojené.","The app calculates the Moon's position, illumination and next main phase locally using Astronomy Engine. Times follow your device's time zone. The eight phase names describe parts of the cycle around its principal phases, not just their exact moments. These calculations are independent of the menstrual cycle.")}</p>
          <p><a style={linkStyle} href={LUNAR_SOURCES.nasa} target="_blank" rel="noreferrer">NASA · Moon phases</a><br/><a style={linkStyle} href={LUNAR_SOURCES.calculation} target="_blank" rel="noreferrer">Astronomy Engine · {L("výpočet", "calculation")}</a></p>
          <h3 style={{fontSize:18,margin:"24px 0 8px",color:t.heading}}>{L("Odkud přichází inspirace","Where the inspiration comes from")}</h3>
          <p>{L("Náměty, záměry, obrazy a rituály jsme napsali pro tanmay. Pracují s motivy současné západní lunární astrologie: začátkem, zráním, plností a uvolněním. Jsou pozváním k vlastní zkušenosti, ne předpovědí ani osobním horoskopem. Astrologické souvislosti nejsou vědecky potvrzeným vlivem na vztah nebo zdraví.","We wrote these prompts, intentions, images and rituals for tanmay. They work with motifs from contemporary Western lunar astrology: beginning, ripening, fullness and release. They invite your own experience rather than predicting it or providing a personal horoscope. Astrological associations are not an established influence on relationships or health.")}</p>
          <p>{L("Podobně jako Moonly nabízíme více vrstev k objevování. Moonly však pracuje s védskou astrologií; zde používáme tropická znamení, dvanáct stejných úseků od jarního bodu. Nejde o totožný výpočet ani astronomická souhvězdí. Bez údajů narození nevytváříme partnerskou kompatibilitu, domy ani osobní tranzity.","Like Moonly, we offer several layers to explore. Moonly uses Vedic astrology; here we use tropical signs, twelve equal sectors measured from the vernal point. These are different systems, and tropical signs are not astronomical constellations. Without birth data we do not create compatibility readings, houses or personal transits.")}</p>
          <ul style={{paddingLeft:20,lineHeight:1.8}}>
            <li><a style={linkStyle} href={LUNAR_SOURCES.chani} target="_blank" rel="noreferrer">CHANI · {L("Lunární fáze a práce s nimi", "Moon phases and working with them")}</a></li>
            <li><a style={linkStyle} href={LUNAR_SOURCES.gerhardt} target="_blank" rel="noreferrer">Dana Gerhardt · The Moon Watching Series</a></li>
            <li><a style={linkStyle} href={LUNAR_SOURCES.greene} target="_blank" rel="noreferrer">Liz Greene · Astrology is an Art</a></li>
            <li><a style={linkStyle} href={LUNAR_SOURCES.zodiac} target="_blank" rel="noreferrer">Dana Gerhardt · {L("Přehled lunární a astrologické symboliky", "Lunar and astrological symbolism")}</a></li>
            <li><a style={linkStyle} href={LUNAR_SOURCES.elements} target="_blank" rel="noreferrer">Astrodienst · {L("Čtyři živly a znamení", "The four elements and signs")}</a></li>
            <li><a style={linkStyle} href={LUNAR_SOURCES.moonly} target="_blank" rel="noreferrer">Moonly · {L("Lunární kalendář", "Lunar calendar")}</a></li>
          </ul>
          <h3 style={{fontSize:18,margin:"24px 0 8px",color:t.heading}}>{L("Starší tradice", "Earlier traditions")}</h3>
          <p>{L("Ptolemaios v Tetrabiblos I.8 popisuje čtyři části lunárního cyklu jazykem vláhy, tepla, sucha a chladu. Jde o historický astrologický výklad. Dnešní otázky jsou naše vlastní a nejsou překladem tohoto textu.","In Tetrabiblos I.8, Ptolemy describes four parts of the lunar cycle through moisture, warmth, dryness and coolness. This is a historical astrological interpretation. Today's questions are our own, not a translation of that text.")} <a style={linkStyle} href={LUNAR_SOURCES.ptolemy} target="_blank" rel="noreferrer">Tetrabiblos I.8</a></p>
          <p>{L("Buddhistická upósatha je v théravádové tradici časem obnovy praxe, meditace a etických závazků. Patří k jiné tradici než astrologie. Její kalendář se může lišit od astronomických okamžiků; tato aplikace neurčuje dnešní náboženský svátek.","In the Theravada tradition, Uposatha is a time to renew practice, meditation and ethical commitments. It is a different tradition from astrology. Its calendar can differ from astronomical moments; this app does not determine today's religious observance.")} <a style={linkStyle} href={LUNAR_SOURCES.uposatha} target="_blank" rel="noreferrer">Access to Insight · Uposatha</a></p>
        </details>
      </div>
    </Sheet>}
  </>;
}
