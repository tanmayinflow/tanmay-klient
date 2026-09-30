import React,{useId,useState} from 'react';
import {CYCLE_ORDER,CYCLE_DEPTH,CYCLE_HORMONES,CYCLE_MAP_LAYERS,cyclePersonalText,cycleMapSelection,resolveCycleExploration} from '../product/togetherCycleDepth.js';
import {CycleMap,cycleMapStyles} from './togetherCycleMap.jsx';

export function CycleDepth({phase,lang='cs',onPlan,embedded=false,role='client',date='',wording='neutral'}){
  const L=v=>lang==='en'?v[1]:cyclePersonalText(v[0],wording),partner=role==='coach',panelId=useId();
  const [exploration,setExploration]=useState(null),[layer,setLayer]=useState('care'),[scene,setScene]=useState(null);
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
  return <section className="tg-cycle-depth">
    <style>{cycleMapStyles+cycleDepthStyles}</style>
    {!embedded&&<h2>{L(['Jak si být oporou','How to support each other'])}</h2>}
    <p className="tg-cycle-opening">{partner?L(['Porozumět sdílenému cyklu. A přitom nepřestat naslouchat.','Understand the shared cycle. And keep listening to each other.']):L(['Porozumět tělu a nechat prostor vlastní zkušenosti.','Understand your body and leave room for your own experience.'])}</p>
    <div className="tg-cycle-atlas-heading">
      {focused&&<button type="button" onClick={()=>shift(-1)} aria-label={L(['Předchozí fáze','Previous phase'])}>‹</button>}
      <h3>{focused&&guide?L(guide.short):L(['Mapa cyklu','Cycle map'])}</h3>
      {focused&&<button type="button" onClick={()=>shift(1)} aria-label={L(['Další fáze','Next phase'])}>›</button>}
    </div>
    <div className="tg-cycle-layers" role="group" aria-label={L(['Vrstva mapy','Map layer'])}>{Object.entries(CYCLE_MAP_LAYERS).map(([id,name])=><button key={id} type="button" aria-pressed={layer===id} aria-controls={panelId} onClick={()=>changeLayer(id)}>{L(name)}</button>)}</div>
    <CycleMap shown={shown} current={current} focused={focused} layer={layer} topic={topic?.id||'overview'} topics={topics} lang={lang} onPhase={choose} onTopic={id=>updateScene({topic:id})} onFocus={()=>updateScene({focused:true,topic:'overview'})} onBack={()=>updateScene({focused:false,topic:'overview'})} visibleHormones={visibleHormones} explainedHormone={explainedHormone}/>
    {(exploring||(!current&&shown))&&<div className="tg-cycle-context"><button type="button" onClick={()=>{setExploration(null);setScene(null);}}>{L(['Zpět k vybranému dni','Back to the selected day'])}</button></div>}
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
.tm-together .tg-cycle-reading{border:0;padding:22px 0 4px;min-height:160px}
.tm-together .tg-cycle-reading h3{font-family:var(--tm-font-display);font-size:27px;font-weight:400;line-height:1.2;color:var(--tg-heading);margin:0 0 14px;text-transform:none;letter-spacing:normal}
.tm-together .tg-cycle-reading p{line-height:1.7;margin:12px 0}
.tm-together .tg-cycle-reading .tg-cycle-overview-note{font-size:14px;color:var(--tg-muted);margin-top:0}
.tm-together .tg-cycle-depth h4{font-family:var(--tm-font-display);font-weight:400;font-size:21px;line-height:1.3;color:var(--tg-accent);margin:22px 0 8px}
.tm-together .tg-hormone-switches{display:grid;grid-template-columns:repeat(4,1fr);gap:5px;margin:12px 0}
.tm-together .tg-hormone-switches button{border-radius:4px;min-width:0;padding:8px 3px;font-size:12px;display:flex;align-items:center;justify-content:center;gap:4px;min-height:44px}
.tm-together .tg-hormone-switches button[aria-pressed=true]{color:var(--tg-accent);border-color:var(--tg-accent);background:var(--tg-card)}
.tm-together .tg-hormone-description{min-height:5em;font-size:13px;line-height:1.6}
.tm-together .tg-cycle-correspondences{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:18px 0 22px;padding-bottom:18px;border-bottom:0}
.tg-cycle-correspondences dt{font-family:var(--tm-font-tag);font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--tg-muted)}
.tg-cycle-correspondences dd{font-family:var(--tm-font-display);font-size:22px;line-height:1.25;color:var(--tg-heading);margin:5px 0 0}
.tm-together .tg-cycle-depth .tg-cycle-question{font-family:var(--tm-font-display);font-size:25px;line-height:1.3;color:var(--tg-heading);margin:24px 0}
.tm-together .tg-cycle-depth .tg-cycle-method{margin-top:24px}.tm-together .tg-cycle-method>summary{font-family:var(--tm-font-tag);font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--tg-accent)}
.tm-together .tg-cycle-sources{padding-left:18px}.tm-together .tg-cycle-sources li{font-size:12px}
.tm-together .tg-cycle-depth button:focus-visible{outline:2px solid var(--tg-accent);outline-offset:3px}
@media(max-width:360px){.tm-together .tg-cycle-atlas-heading h3{font-size:24px}.tm-together .tg-cycle-map-tools{gap:8px}.tm-together .tg-cycle-world-button.phase-choice{font-size:16px;width:112px}}
`;
