import React,{useMemo} from "react";
import {useSkyPeriod} from "./skyPeriodData.js";
import {SkyHelp} from "./skyUi.jsx";
import {astrologyOverviewReading,astrologyEventTitle,astrologyEventReading} from "../product/togetherAstrologyOverviewEditorial.js";
import {ASTRO_PLANETS} from "../product/togetherAstrologyEditorial.js";
import {ZODIAC} from "../product/togetherMoon.js";

export function TogetherAstrologyOverview({sky,day,lens,lang="cs",period:suppliedPeriod,timeZone="Europe/Prague",onOpen=()=>{},onWeek}){
  const L=(cs,en)=>lang==="en"?en:cs,locale=lang==="en"?"en-GB":"cs-CZ";
  const scan=useSkyPeriod(day,lens,"day",{timeZone},!suppliedPeriod),period=suppliedPeriod||scan.period;
  const reading=useMemo(()=>period?astrologyOverviewReading(sky,period,lang):null,[sky,period,lang]);
  if(!period)return <p className="sky-small" role="status">{scan.error?L("Přehled období se nepodařilo načíst.","The period overview could not be loaded."):L("Skládám souvislosti oblohy…","Reading the sky's connections…")}</p>;
  const range=period.range||"day";
  const dateLabel=ms=>new Date(ms).toLocaleDateString(locale,{timeZone,day:"numeric",month:"short"});
  const instant=ms=>new Date(ms).toLocaleString(locale,{timeZone,day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"});
  const keyEvents=[...period.significant].sort((a,b)=>a.time-b.time),otherEvents=period.events.filter(e=>!keyEvents.some(k=>k.id===e.id));
  const interval=range==="day"?dateLabel(period.start):`${dateLabel(period.start)} – ${dateLabel(period.end-1)}`;
  const eventRow=event=><details className="astro-event" key={event.id}>
    <summary><time dateTime={new Date(event.time).toISOString()}>{instant(event.time)}</time><span>{astrologyEventTitle(event,lang)}</span></summary>
    <p>{astrologyEventReading(event,lens,lang)}</p>
  </details>;
  return <section className="astro-overview" aria-label={L("Celkový výklad oblohy","Overall sky reading")}>
    <style>{`
      .tg-astrology .astro-overview{margin:24px 0 12px;padding-bottom:14px}
      .tg-astrology .astro-overview-head{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
      .tg-astrology .astro-range{display:flex;gap:3px}
      .tg-astrology .astro-range button{font:12px/1.3 var(--tm-font-tag);letter-spacing:.1em;text-transform:uppercase;border:0;border-radius:0;border-bottom:2px solid transparent;padding:10px 12px}
      .tg-astrology .astro-range button[aria-pressed=true]{border-bottom-color:var(--astro-ink)}
      .tg-astrology .astro-overview h3{margin:10px 0;font-size:26px}
      .tg-astrology .astro-overview .astro-period-label{margin:3px 0 15px}
      .tg-astrology .astro-overview .astro-overview-summary{margin-bottom:16px}
      .tg-astrology .astro-overview>details{margin-top:0}
      .tg-astrology .astro-overview-layer{padding:10px 0 20px}
      .tg-astrology .astro-overview-layer+article{margin-top:10px}
      .tg-astrology .astro-overview-layer h4{margin:4px 0 8px;font-size:22px}
      .tg-astrology .astro-overview-layer p:last-child{margin-bottom:0}
      .tg-astrology .astro-fact{font-size:13px;line-height:1.6;color:var(--astro-ink)}
      .tg-astrology .astro-route{padding:10px 0;font-family:var(--tm-font-display);font-size:21px;line-height:1.5}
      .tg-astrology .astro-event{margin:0 0 4px}
      .tg-astrology .astro-event summary{font:15px/1.5 var(--tm-font-body);letter-spacing:normal;text-transform:none;padding:12px 0}
      .tg-astrology .astro-event summary time{display:block;font:12px/1.5 var(--tm-font-tag);letter-spacing:.07em;margin-bottom:5px;color:var(--astro-muted)}
      .tg-astrology .astro-event p{font-size:14px}
      .tg-astrology .astro-slow{margin:15px 0}
      .tg-astrology .astro-slow div{display:flex;justify-content:space-between;gap:12px;padding:8px 0;font-size:13px}
      .tg-astrology .astro-slow dt{color:var(--astro-ink)}.tg-astrology .astro-slow dd{margin:0;text-align:right}
    `}</style>
    <div className="astro-overview-head"><div className="astro-label">{L("Celek oblohy","The sky as a whole")}</div><SkyHelp id="N09" onOpen={onOpen} lang={lang}/>{onWeek&&<button type="button" className="sky-quiet" onClick={onWeek}>{L("Týden","Week")} →</button>}</div>
    <p className="astro-small astro-period-label">{interval}{range==="week"?period.clipped?L(" · do konce podporovaného rozsahu"," · to the end of the supported range"):L(" · kalendářní týden"," · calendar week"):""} · {L("symbolické čtení","symbolic reading")}</p>
    <h3>{reading.title}</h3>
    <p className="astro-overview-summary">{reading.summary}</p>
    <p className="astro-small">{reading.context}</p>
    <details key={`${lens}-layers`}>
      <summary>{L("Jak do sebe jednotlivé vrstvy zapadají","How the layers fit together")} <SkyHelp id="N19" onOpen={onOpen} lang={lang}/></summary>
      <p className="astro-small">{L("Polohy a vazby pro","Positions and connections at")} {instant(sky.date)}. {L("Časové předěly patří celému vybranému období.","Changes cover the full selected period.")}</p>
      <p>{reading.connection}</p>
      {reading.layers.map(layer=><article className="astro-overview-layer" key={layer.key}>
        <h4>{layer.title}</h4><div className="astro-fact">{layer.event&&<time dateTime={new Date(layer.event.time).toISOString()}>{instant(layer.event.time)} · </time>}{layer.fact}</div>
        <p>{layer.text}</p>{layer.route&&<div className="astro-route" aria-label={L("Řetězec vládců znamení","Chain of sign rulers")}>{layer.route.join(" → ")}</div>}{layer.tail&&<p>{layer.tail}</p>}
      </article>)}
      {reading.resources.length>0&&lens!=="western"&&<><h4>{L("Kde má princip vlastní oporu","Where a principle has its own support")}</h4><ul>{reading.resources.map(resource=><li key={resource} className="astro-fact">{resource}</li>)}</ul><p className="astro-small">{L("Domicil a povýšení jsou konkrétní tradiční kategorie. Samy o sobě nehodnotí příznivost dne.","Domicile and exaltation are specific traditional categories, not ratings of the day.")}</p></>}
    </details>
    <details key={`${lens}-${range}-${day}-events`}>
      <summary>{L("Co se v období mění","What changes in this period")} · {keyEvents.length} <SkyHelp id="N18" onOpen={onOpen} lang={lang}/></summary>
      <p className="astro-small">{L("Výběr výrazných předělů; čas je místní. Rozbalením otevřeš jejich význam.","Selected notable changes, in local time. Expand one to read its meaning.")}</p>
      {keyEvents.length?keyEvents.map(eventRow):<p>{L("Ve sledovaných kategoriích v tomto období nevychází žádný přesný předěl. Výklad proto stojí na přítomných vztazích a jejich pomalé proměně.","No exact transitions occur in the categories tracked here during this period. The reading rests on existing relationships and their gradual change.")}</p>}
      {otherEvents.length>0&&<details><summary>{L("Další vypočtené přechody","Other calculated transitions")} · {otherEvents.length}</summary>{otherEvents.map(eventRow)}</details>}
    </details>
    <details key={`${lens}-background`}>
      <summary>{L("Delší pozadí tohoto období","The period's longer background")} <SkyHelp id="N17" onOpen={onOpen} lang={lang}/></summary>
      <p>{reading.backgroundText}</p>
      {reading.background.map(layer=><article className="astro-overview-layer" key={layer.key}><h4>{layer.title}</h4><div className="astro-fact">{layer.fact}</div><p>{layer.text}</p></article>)}
      <dl className="astro-slow">{reading.slow.map(planet=><div key={planet.id}><dt>{lens==="jyotish"?ASTRO_PLANETS[planet.id].vedic:L(...ASTRO_PLANETS[planet.id].name)}</dt><dd>{L(...ZODIAC[planet.sign])} · {planet.degree.toFixed(1)}°{planet.retrograde?" ℞":""}</dd></div>)}</dl>
      <p className="astro-small">{L("Polohy pro vybraný okamžik. Přesné změny směru a znamení v období najdeš výše.","Positions at the selected instant. Exact direction and sign changes within the period are listed above.")}</p>
    </details>
  </section>;
}
