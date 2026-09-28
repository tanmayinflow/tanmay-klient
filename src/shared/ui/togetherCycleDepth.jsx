import React,{useId,useState} from 'react';
import {CYCLE_ORDER,CYCLE_DEPTH,CYCLE_HORMONES,CYCLE_DEPTH_SOURCES,CYCLE_MAP_LAYERS,cycleMapSelection,resolveCycleExploration} from '../product/togetherCycleDepth.js';
import {CycleMap,cycleMapStyles} from './togetherCycleMap.jsx';

export function CycleDepth({phase,lang='cs',onPlan,embedded=false,role='client',date=''}){
  const L=v=>v[lang==='en'?1:0],partner=role==='coach',panelId=useId();
  const [exploration,setExploration]=useState(null),[layer,setLayer]=useState('care'),[scene,setScene]=useState(null),[motion,setMotion]=useState(true);
  const [visibleHormones,setVisibleHormones]=useState(['e2','p4']),[explainedHormone,setExplainedHormone]=useState('e2');
  const {current,shown,exploring}=resolveCycleExploration(phase,date,exploration);
  const contextKey=`${date}:${current}:${shown}`,focused=Boolean(scene?.key===contextKey&&scene.focused);
  const {topics,topic}=cycleMapSelection(shown,layer,scene?.key===contextKey?scene.topic:'overview',role);
  const guide=shown?CYCLE_DEPTH[shown]:null;
  const updateScene=(changes)=>setScene({key:contextKey,focused,topic:topic?.id||'overview',...changes});
  const choose=id=>{setExploration({id,current,date});setScene({key:`${date}:${current}:${id}`,focused:true,topic:'overview'});};
  const shift=delta=>choose(CYCLE_ORDER[(CYCLE_ORDER.indexOf(shown)+delta+4)%4]);
  const changeLayer=id=>{setLayer(id);updateScene({focused:Boolean(shown),topic:'overview'});};
  const toggleHormone=id=>{setVisibleHormones(values=>values.includes(id)?values.filter(v=>v!==id):[...values,id]);setExplainedHormone(id);};
  const hormone=CYCLE_HORMONES.find(h=>h.id===explainedHormone);
  const status=exploring||(!current&&shown)?L(['Volné prohlížení','Free exploration']):phase?.basis==='recorded'?L(['Podle zápisu vybraného dne','Based on the selected day’s record']):current?L(['Odhad pro vybraný den','Estimated for the selected day']):L(['Pro vybraný den fázi neznáme','The selected day’s phase is unknown']);
  return <section className="tg-cycle-depth">
    <style>{cycleMapStyles+cycleDepthStyles}</style>
    {!embedded&&<h2>{L(['Jak si být oporou','How to support each other'])}</h2>}
    <p className="tg-cycle-opening">{partner?L(['Porozumět jejímu cyklu. A přitom nepřestat naslouchat jí.','Understand her cycle. And keep listening to her.']):L(['Porozumět tělu a nechat prostor vlastní zkušenosti.','Understand your body and leave room for your own experience.'])}</p>
    <div className="tg-cycle-atlas-heading">
      {focused&&<button type="button" onClick={()=>shift(-1)} aria-label={L(['Předchozí fáze','Previous phase'])}>‹</button>}
      <h3>{focused&&guide?L(guide.short):L(['Mapa cyklu','Cycle map'])}</h3>
      {focused&&<button type="button" onClick={()=>shift(1)} aria-label={L(['Další fáze','Next phase'])}>›</button>}
    </div>
    <div className="tg-cycle-layers" role="group" aria-label={L(['Vrstva mapy','Map layer'])}>{Object.entries(CYCLE_MAP_LAYERS).map(([id,name])=><button key={id} type="button" aria-pressed={layer===id} aria-controls={panelId} onClick={()=>changeLayer(id)}>{L(name)}</button>)}</div>
    <CycleMap shown={shown} current={current} focused={focused} layer={layer} topic={topic?.id||'overview'} topics={topics} lang={lang} onPhase={choose} onTopic={id=>updateScene({topic:id})} onFocus={()=>updateScene({focused:true,topic:'overview'})} onBack={()=>updateScene({focused:false,topic:'overview'})} motion={motion} visibleHormones={visibleHormones} explainedHormone={explainedHormone}/>
    <div className="tg-cycle-map-tools"><p>{focused?L(['Dotkni se tématu v mapě.','Touch a topic in the map.']):L(['Vyber fázi a vstup do její krajiny.','Choose a phase and enter its landscape.'])}</p><button type="button" aria-pressed={!motion} onClick={()=>setMotion(value=>!value)}>{motion?L(['Zklidnit pohyb','Still transitions']):L(['Zapnout přechody','Enable transitions'])}</button></div>
    <div className="tg-cycle-context"><span role="status">{status}</span>{(exploring||(!current&&shown))&&<button type="button" onClick={()=>{setExploration(null);setScene(null);}}>{L(['Zpět k vybranému dni','Back to the selected day'])}</button>}</div>
    {focused&&layer==='symbol'&&<p className="tg-cycle-caption">{L(['Autorská mapa pro kontemplaci. Obrazy můžeš přijmout, proměnit nebo nechat být.','An original map for contemplation. Take, reshape or leave the images.'])}</p>}
    {focused&&layer==='body'&&topic?.id==='hormones'&&<div className="tg-cycle-hormone-controls">
      <p className="tg-cycle-caption">{L(['Schematicky, bez měření. Každá křivka má vlastní relativní výšku; koncentrace hormonů mezi sebou neporovnává.','Schematic, without measurements. Each curve has its own relative height; it does not compare hormone concentrations.'])}</p>
      <div className="tg-hormone-switches" role="group" aria-label={L(['Zobrazit hormonální křivky','Show hormone curves'])}>{CYCLE_HORMONES.map(h=><button key={h.id} type="button" aria-pressed={visibleHormones.includes(h.id)} onClick={()=>toggleHormone(h.id)}><svg width="22" height="10" aria-hidden="true"><path d="M1 5H21" stroke="currentColor" strokeWidth="1.5" strokeDasharray={h.dash}/></svg>{h.short}</button>)}</div>
      {!visibleHormones.length&&<p className="tg-cycle-caption" role="status">{L(['Křivky jsou skryté. Zapni si hormon, který chceš prohlédnout.','The curves are hidden. Turn on a hormone you want to explore.'])}</p>}
      <p className="tg-hormone-description" aria-live="polite"><strong>{L(hormone.name)}</strong><br/>{L(hormone.description)}</p>
    </div>}
    <div id={panelId} className="tg-cycle-reading" aria-live="polite" aria-atomic="false">
      {focused&&topic?<article key={`${contextKey}-${layer}-${topic.id}`}>
        <h3>{L(topic.title)}</h3>
        {topic.correspondences&&<dl className="tg-cycle-correspondences">{[['season',['Roční doba','Season']],['day',['Část dne','Time of day']],['direction',['Směr','Direction']]].map(([key,label])=><div key={key}><dt>{L(label)}</dt><dd>{L(topic.correspondences[key])}</dd></div>)}</dl>}
        {topic.paragraphs.map((paragraph,i)=><p key={i}>{L(paragraph)}</p>)}
        {topic.question&&<p className="tg-cycle-question">{L(topic.question)}</p>}
        {topic.plan&&onPlan&&<button type="button" onClick={()=>onPlan(L(topic.plan))}>{L(['Navrhnout do plánů','Propose in Plans'])}</button>}
      </article>:<p className="tg-cycle-overview-note">{current?L(['Čtyři části jednoho rytmu. Tečka ukazuje fázi vybraného dne; prohlížet si můžeš kteroukoli. Každá otevírá tělo, praktickou péči i svět obrazů.','Four parts of one rhythm. The dot marks the selected day’s phase; you can explore any of them. Each opens the body, practical care and a world of images.']):L(['V kalendáři pro tento den nemáme fázi. Mapu si můžeš prohlédnout výběrem kterékoli části. Tím nezměníš svůj zápis ani odhad.','The calendar has no phase for this day. Explore the map by choosing any part. This changes neither a record nor an estimate.'])}</p>}
    </div>
    <details className="tg-cycle-method"><summary>{L(['Jak s mapou pracujeme a odkud vycházíme','How this map works and its sources'])}</summary>
      <h4>{L(['Záznam, odhad a schéma','Record, estimate and diagram'])}</h4><p>{L(['Den se počítá od zapsaného začátku menstruace. Odhad využívá pravidelné zapsané cykly nebo obvyklou délku a do budoucna sahá nejvýše 90 dní a tři cykly. Kalendář nepotvrzuje ovulaci ani hormonální hladiny a není určen k antikoncepci. Menstruaci pro přehled zobrazujeme zvlášť, i když biologicky patří do folikulární fáze. Čtyři stejně velké části spirály nejsou časové měřítko.','The day counts from a recorded period start. Estimates use regular recorded cycles or the usual length and extend no further than 90 days and three cycles. A calendar confirms neither ovulation nor hormone levels and is not contraception. Menstruation is shown separately for clarity, although biologically part of the follicular phase. The spiral’s four equal parts are not a time scale.'])}</p>
      <p>{L(['Hormonální křivky jsou vytvořené výukové tvary pro obecný ovulační cyklus, nikoli naměřený vzorek ani předpověď tvého těla. Každá je normalizována zvlášť; výšky nelze mezi hormony porovnávat. Při hormonální antikoncepci, těhotenství, po porodu nebo nepravidelném cyklu nemusí tento průběh odpovídat tělu. Používej tehdy záznamy bez odhadů.','The hormone curves are authored teaching shapes for a general ovulatory cycle, not measured samples or predictions of your body. Each is normalised separately; heights cannot be compared across hormones. Hormonal contraception, pregnancy, postpartum or irregular cycles may not follow this pattern. Use records without estimates in those circumstances.'])}</p>
      <h4>{L(['Péče bez pevného scénáře','Care without a fixed script'])}</h4><p>{L(['Výzkum nepodporuje jeden univerzální tréninkový plán podle fází. Náměty k jídlu, pohybu a vztahu vybírej podle skutečného dne. Nejde o léčbu ani hormonální dietu. Silnou či neobvyklou bolest, krvácení nebo opakované psychické potíže, které narušují život, prober s lékařem.','Research does not support one universal phase-based training plan. Choose food, movement and relationship invitations according to the actual day. This is neither treatment nor a hormone diet. Discuss severe or unusual pain, bleeding or repeated psychological symptoms that disrupt life with a clinician.'])}</p>
      <h4>{L(['Příběhy a autorství','Stories and authorship'])}</h4><p>{L(['Roční doby, části dne, směry, archetypy a božská spirála tvoří naši současnou autorskou mapu. Nejsou jednotným starověkým učením ani fyziologií. Krátké motivy Inany a Démétér odkazují na konkrétní staré texty; jejich propojení s cyklem a otázky jsou naše vlastní. Archetyp není identita, povinnost mateřství ani míra ženskosti.','The seasons, times of day, directions, archetypes and divine spiral form our contemporary original map. They are neither a single ancient teaching nor physiology. Brief Inana and Demeter motifs refer to specific old texts; their cycle associations and questions are our own. An archetype is no identity, duty of motherhood or measure of womanhood.'])}</p>
      <ul className="tg-cycle-sources">{CYCLE_DEPTH_SOURCES.map(source=><li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a></li>)}</ul>
    </details>
  </section>;
}

const cycleDepthStyles=`
.tm-together .tg-cycle-depth{padding:4px 0 0;max-width:100%;color:var(--tg-text)}
.tm-together .tg-cycle-depth .tg-cycle-opening{font-family:var(--tm-font-display);font-size:23px;line-height:1.35;color:var(--tg-heading);margin:4px 0 24px;max-width:30ch}
.tm-together .tg-cycle-atlas-heading{display:flex;justify-content:center;align-items:center;gap:12px;margin:0 0 10px}
.tm-together .tg-cycle-atlas-heading h3{font-family:var(--tm-font-display);font-size:27px;font-weight:400;line-height:1.1;color:var(--tg-heading);margin:0;text-align:center}
.tm-together .tg-cycle-atlas-heading>button{font-family:var(--tm-font-display);font-size:25px;border:0;background:transparent;padding:6px;min-height:44px;min-width:44px;color:var(--tg-accent)}
.tm-together .tg-cycle-layers{display:flex;gap:8px;justify-content:center;margin:0 0 12px}
.tm-together .tg-cycle-layers button{flex:1;max-width:150px;min-width:0;min-height:44px;border:0;border-radius:0;border-bottom:2px solid transparent;font-family:var(--tm-font-tag);font-size:13px;text-transform:uppercase;letter-spacing:.06em;padding:10px 2px;white-space:nowrap}
.tm-together .tg-cycle-layers button[aria-pressed=true]{color:var(--tg-accent);border-bottom-color:var(--tg-accent)}
.tm-together .tg-cycle-map-tools{display:flex;justify-content:space-between;align-items:center;gap:12px;margin:18px 0 8px}
.tm-together .tg-cycle-map-tools p{font-size:12px;line-height:1.4;margin:0;color:var(--tg-muted)}
.tm-together .tg-cycle-map-tools button{font-family:var(--tm-font-tag);font-size:12px;line-height:1.3;padding:8px 0;border:0;background:transparent;color:var(--tg-accent);min-height:36px}
.tm-together .tg-cycle-context{font-family:var(--tm-font-body);font-size:12px;line-height:1.5;color:var(--tg-muted);display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin:4px 0 16px}
.tm-together .tg-cycle-context button{font-size:12px;padding:5px 0;border:0;text-decoration:underline;text-underline-offset:4px}
.tm-together .tg-cycle-depth .tg-cycle-caption{font-family:var(--tm-font-body);font-size:12px;line-height:1.6;color:var(--tg-muted);margin:10px 0}
.tm-together .tg-cycle-reading{border-top:1px solid var(--tg-soft);padding:22px 0 4px;min-height:160px}
.tm-together .tg-cycle-reading h3{font-family:var(--tm-font-display);font-size:27px;font-weight:400;line-height:1.2;color:var(--tg-heading);margin:0 0 14px;text-transform:none;letter-spacing:normal}
.tm-together .tg-cycle-reading p{line-height:1.7;margin:12px 0}
.tm-together .tg-cycle-reading .tg-cycle-overview-note{font-size:14px;color:var(--tg-muted);margin-top:0}
.tm-together .tg-cycle-depth h4{font-family:var(--tm-font-display);font-weight:400;font-size:21px;line-height:1.3;color:var(--tg-accent);margin:22px 0 8px}
.tm-together .tg-hormone-switches{display:grid;grid-template-columns:repeat(4,1fr);gap:5px;margin:12px 0}
.tm-together .tg-hormone-switches button{border-radius:4px;min-width:0;padding:8px 3px;font-size:12px;display:flex;align-items:center;justify-content:center;gap:4px;min-height:44px}
.tm-together .tg-hormone-switches button[aria-pressed=true]{color:var(--tg-accent);border-color:var(--tg-accent);background:var(--tg-card)}
.tm-together .tg-hormone-description{min-height:5em;font-size:13px;line-height:1.6}
.tm-together .tg-cycle-correspondences{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:18px 0 22px;padding-bottom:18px;border-bottom:1px solid var(--tg-soft)}
.tg-cycle-correspondences dt{font-family:var(--tm-font-tag);font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--tg-muted)}
.tg-cycle-correspondences dd{font-family:var(--tm-font-display);font-size:22px;line-height:1.25;color:var(--tg-heading);margin:5px 0 0}
.tm-together .tg-cycle-depth .tg-cycle-question{font-family:var(--tm-font-display);font-size:25px;line-height:1.3;color:var(--tg-heading);margin:24px 0}
.tm-together .tg-cycle-depth .tg-cycle-method{margin-top:24px}.tm-together .tg-cycle-method>summary{font-family:var(--tm-font-tag);font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--tg-accent)}
.tm-together .tg-cycle-sources{padding-left:18px}.tm-together .tg-cycle-sources li{font-size:12px}
.tm-together .tg-cycle-depth button:focus-visible{outline:2px solid var(--tg-accent);outline-offset:3px}
@media(max-width:360px){.tm-together .tg-cycle-atlas-heading h3{font-size:24px}.tm-together .tg-cycle-map-tools{gap:8px}.tm-together .tg-cycle-world-button.phase-choice{font-size:16px;width:112px}}
`;
