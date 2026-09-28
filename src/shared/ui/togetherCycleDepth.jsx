import React,{useId,useMemo,useState} from 'react';
import {CYCLE_ORDER,CYCLE_DEPTH,CYCLE_HORMONES,CYCLE_DEPTH_SOURCES,cycleHormoneSchematic,resolveCycleExploration} from '../product/togetherCycleDepth.js';

const labels={body:['V těle','In the body'],care:['Každý den','Everyday care'],symbol:['V obrazech','In images']};
const point=(angle,radius,c=150)=>[c+Math.cos(angle*Math.PI/180)*radius,c+Math.sin(angle*Math.PI/180)*radius];
const arc=(from,to,r=112)=>{const a=point(from,r),b=point(to,r);return `M${a.join(',')} A${r},${r} 0 0 1 ${b.join(',')}`;};
const spiral=Array.from({length:181},(_,i)=>{const f=i/180,a=f*Math.PI*4.2-1.6,r=6+f*69;return `${i?'L':'M'}${(150+Math.cos(a)*r).toFixed(2)},${(150+Math.sin(a)*r).toFixed(2)}`;}).join(' ');

function PhaseGlyph({phase}){
  if(phase==='menstrual')return <><path d="M0-10C-4-4-8 1-8 5a8 8 0 0 0 16 0c0-4-4-9-8-15Z"/><path d="M-4 4c-1 3 1 5 3 6"/></>;
  if(phase==='follicular')return <><path d="M0 12V0m0 4C-10 3-12-3-11-8 0-8 1-2 0 4Zm0-2C9 1 12-6 10-11 1-10-1-4 0 2Z"/></>;
  if(phase==='ovulatory')return <><circle r="6"/><path d="M0-14v4m0 20v4M-14 0h4m20 0h4M-10-10l3 3m14 14 3 3M-10 10l3-3M7-7l3-3"/></>;
  return <><path d="M-10 10C-12-4 0-12 11-10 12 4 1 13-10 10ZM-10 10 6-6M-3 3h7M0 0v-6"/></>;
}

function CycleSpiral({shown,current,layer,lang,onChoose}){
  const L=(v)=>v[lang==='en'?1:0],titleId=useId(),descriptionId=useId();
  return <div className="tg-cycle-map">
    <svg viewBox="0 0 300 300" role="group" aria-labelledby={titleId} aria-describedby={descriptionId}>
      <title id={titleId}>{L(['Čtyři části cyklu. Vyber část k prohlížení.','Four parts of the cycle. Choose one to explore.'])}</title>
      <desc id={descriptionId}>{L(['Pořadí fází kolem spirály. Velikost úseků nevyjadřuje jejich délku. Tečka označuje fázi vybraného dne, pokud ji známe.','Phase order around a spiral. Segment size does not represent duration. A dot marks the selected day’s phase when known.'])}</desc>
      <circle cx="150" cy="150" r="135" className="tg-cycle-orbit"/>
      <path d={spiral} className="tg-cycle-spiral"/>
      <circle cx="150" cy="150" r="3" fill="currentColor"/>
      {CYCLE_ORDER.map((id,index)=>{const angle=index*90-90,[x,y]=point(angle,112),[mx,my]=point(angle,135),active=id===shown;return <g key={id} className={`tg-cycle-segment${active?' is-selected':''}`} role="button" tabIndex={0} aria-pressed={active} aria-label={L(CYCLE_DEPTH[id].short)} onClick={()=>onChoose(id)} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();onChoose(id);}}}>
        <path d={arc(angle-41,angle+41)} className="tg-cycle-hit"/>
        <path d={arc(angle-41,angle+41)} className="tg-cycle-arc"/>
        <circle cx={x} cy={y} r="21" className="tg-cycle-glyph-back"/>
        <g transform={`translate(${x} ${y})`} fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><PhaseGlyph phase={id}/></g>
        {id===current&&<circle cx={mx} cy={my} r="3.5" fill="currentColor"/>}
      </g>;})}
      {layer==='symbol'&&<g className="tg-cycle-directions" aria-hidden="true"><text x="150" y="9" textAnchor="middle">{L(['S','N'])}</text><text x="294" y="154" textAnchor="middle">{L(['V','E'])}</text><text x="150" y="299" textAnchor="middle">{L(['J','S'])}</text><text x="6" y="154" textAnchor="middle">{L(['Z','W'])}</text></g>}
    </svg>
    <div className="tg-cycle-phase-buttons" role="group" aria-label={L(['Prohlížet část cyklu','Explore a part of the cycle'])}>
      {CYCLE_ORDER.map(id=><button key={id} type="button" aria-pressed={shown===id} onClick={()=>onChoose(id)}>{L(CYCLE_DEPTH[id].short)}</button>)}
    </div>
  </div>;
}

function HormoneChart({shown,lang}){
  const L=v=>v[lang==='en'?1:0],titleId=useId(),descId=useId();
  const data=useMemo(()=>cycleHormoneSchematic(),[]);
  const [visible,setVisible]=useState(['e2','p4']),[explained,setExplained]=useState('e2');
  const selected=CYCLE_HORMONES.find(h=>h.id===explained);
  const bands={menstrual:[0,.18],follicular:[.18,.45],ovulatory:[.45,.54],luteal:[.54,1]};
  const band=bands[shown];
  const toggle=id=>{setVisible(values=>values.includes(id)?values.filter(v=>v!==id):[...values,id]);setExplained(id);};
  return <div className="tg-cycle-hormones">
    <h3>{L(['Čtyři propojené signály','Four connected signals'])}</h3>
    <p className="tg-cycle-caption">{L(['Schematicky, bez měření. Každá křivka má vlastní relativní výšku; koncentrace hormonů mezi sebou neporovnává.','Schematic, without measurements. Each curve has its own relative height; it does not compare hormone concentrations.'])}</p>
    <svg viewBox="0 0 340 190" role="img" aria-labelledby={titleId} aria-describedby={descId}>
      <title id={titleId}>{L(['Schematický průběh hormonálních změn','Schematic pattern of hormonal changes'])}</title>
      <desc id={descId}>{L(['Estradiol stoupá před vlnou LH, progesteron hlavně po ovulaci. FSH podporuje růst folikulů. Graf neobsahuje naměřené hodnoty ani osobní den cyklu.','Estradiol rises before the LH surge, progesterone mainly after ovulation. FSH supports follicle growth. There are no measured values or personal cycle day in this chart.'])}</desc>
      {band&&<rect x={20+band[0]*300} y="12" width={(band[1]-band[0])*300} height="148" className="tg-cycle-band"/>}
      <path d="M20 12V160H320M20 86H320" className="tg-cycle-axis"/>
      {CYCLE_HORMONES.filter(h=>visible.includes(h.id)).map(h=><path key={h.id} d={data.map((row,i)=>`${i?'L':'M'}${20+row.x*300},${153-row[h.id]*130}`).join(' ')} fill="none" stroke="currentColor" strokeWidth={h.id===explained?2.3:1.35} strokeDasharray={h.dash} className={`tg-hormone-line tg-hormone-${h.id}`}/>)}
      <text x="20" y="180">{L(['Začátek cyklu','Cycle start'])}</text><text x="320" y="180" textAnchor="end">{L(['Další začátek','Next start'])}</text>
    </svg>
    <div className="tg-hormone-switches" role="group" aria-label={L(['Zobrazit hormonální křivky','Show hormone curves'])}>{CYCLE_HORMONES.map(h=><button key={h.id} type="button" aria-pressed={visible.includes(h.id)} onClick={()=>toggle(h.id)}><svg width="26" height="10" aria-hidden="true"><path d="M1 5H25" stroke="currentColor" strokeWidth="1.5" strokeDasharray={h.dash}/></svg>{h.short}</button>)}</div>
    {!visible.length&&<p className="tg-cycle-caption" role="status">{L(['Křivky jsou skryté. Zapni si hormon, který chceš prohlédnout.','The curves are hidden. Turn on a hormone you want to explore.'])}</p>}
    <p className="tg-hormone-description" aria-live="polite"><strong>{L(selected.name)}</strong><br/>{L(selected.description)}</p>
  </div>;
}

export function CycleDepth({phase,lang='cs',onPlan,embedded=false,role='client',date=''}){
  const L=v=>v[lang==='en'?1:0],partner=role==='coach',panelId=useId();
  const [exploration,setExploration]=useState(null),[layer,setLayer]=useState('care');
  const {current,shown,exploring}=resolveCycleExploration(phase,date,exploration);
  const guide=shown?CYCLE_DEPTH[shown]:null;
  const choose=id=>setExploration({id,current,date});
  const returnToDate=()=>setExploration(null);
  const status=exploring||(!current&&shown)?L(['Volné prohlížení','Free exploration']):phase?.basis==='recorded'?L(['Podle zápisu vybraného dne','Based on the selected day’s record']):current?L(['Odhad pro vybraný den','Estimated for the selected day']):L(['Pro vybraný den fázi neznáme','The selected day’s phase is unknown']);
  return <section className="tg-cycle-depth">
    <style>{cycleDepthStyles}</style>
    {!embedded&&<h2>{L(['Jak si být oporou','How to support each other'])}</h2>}
    <p className="tg-cycle-opening">{partner?L(['Porozumět jejímu cyklu. A přitom nepřestat naslouchat jí.','Understand her cycle. And keep listening to her.']):L(['Porozumět tělu a nechat prostor vlastní zkušenosti.','Understand your body and leave room for your own experience.'])}</p>
    <CycleSpiral shown={shown} current={current} layer={layer} lang={lang} onChoose={choose}/>
    <div className="tg-cycle-context"><span role="status">{status}</span>{(exploring||(!current&&shown))&&<button type="button" onClick={returnToDate}>{L(['Zpět k vybranému dni','Back to the selected day'])}</button>}</div>
    <div className="tg-cycle-layers" role="group" aria-label={L(['Vrstva průvodce','Guide layer'])}>{Object.entries(labels).map(([id,name])=><button key={id} type="button" aria-pressed={layer===id} aria-controls={panelId} onClick={()=>setLayer(id)}>{L(name)}</button>)}</div>
    <div id={panelId} className="tg-cycle-layer-content">
      {guide?<>
        <h3 className="tg-cycle-title">{L(guide.title)}</h3>
        {layer==='body'&&<>
          <p>{L(guide.hormones)}</p>
          <h4>{L(['Co se děje v děloze','What happens in the uterus'])}</h4><p>{L(guide.uterus)}</p>
          <HormoneChart shown={shown} lang={lang}/>
          <details><summary>{L(['Tělo, nálada a vlastní vzorec','Body, mood and your own pattern'])}</summary><p>{L(['Hormony a nervový systém spolu souvisejí, ale stejná fáze nemusí přinášet stejný prožitek. U PMS a PMDD může hrát roli citlivost na běžné hormonální změny. Zkus sledovat spánek, potíže, náladu a to, co opravdu pomohlo, alespoň přes dva cykly. Dnešní pocit si nemusíš vysvětlit jedinou příčinou.','Hormones and the nervous system interact, but the same phase need not bring the same experience. Sensitivity to ordinary hormonal changes can play a role in PMS and PMDD. Track sleep, symptoms, mood and what actually helped across at least two cycles. You need not explain today’s feeling by a single cause.'])}</p></details>
        </>}
        {layer==='care'&&<>
          <p>{L(partner?guide.partner:guide.woman)}</p>
          {guide.care.map(item=><details key={`${shown}-${item.id}`}><summary>{L(item.name)}</summary><p>{L(partner?item.partner:item.woman)}</p></details>)}
          <div className="tg-cycle-shared"><h4>{L(['Jedna chvíle spolu','One moment together'])}</h4><p>{L(guide.shared)}</p>{onPlan&&<button type="button" onClick={()=>onPlan(L(guide.shared))}>{L(['Navrhnout do plánů','Propose in Plans'])}</button>}</div>
        </>}
        {layer==='symbol'&&<>
          <p className="tg-cycle-caption">{L(['Autorská mapa pro kontemplaci. Obrazy můžeš přijmout, proměnit nebo nechat být.','An original map for contemplation. Take, reshape or leave the images.'])}</p>
          <dl className="tg-cycle-correspondences"><div><dt>{L(['Roční doba','Season'])}</dt><dd>{L(guide.symbol.season)}</dd></div><div><dt>{L(['Část dne','Time of day'])}</dt><dd>{L(guide.symbol.day)}</dd></div><div><dt>{L(['Směr','Direction'])}</dt><dd>{L(guide.symbol.direction)}</dd></div></dl>
          <h4>{L(guide.symbol.archetype)}</h4><p>{L(guide.symbol.text)}</p>
          <p className="tg-cycle-question">{L(guide.symbol.question)}</p>
          <details><summary>{L(['Co se může skrývat pod obrazem','What may hide beneath the image'])}</summary><p>{L(guide.symbol.shadow)}</p><p>{partner?L(['Zkus tento obraz vztáhnout nejprve k sobě. Potom se zeptej, co v něm nachází ona. Není to návod, jak ji pojmenovat.','Apply the image to yourself first. Then ask what she finds in it. It is not a way to label her.']):L(['Která část obrazu je mi blízká a která mi nesedí? Obojí je užitečná odpověď.','Which part of this image feels close, and which does not fit? Both are useful answers.'])}</p></details>
          <details><summary>{L(guide.symbol.storyTitle)}</summary><p>{L(guide.symbol.story)}</p></details>
          <details><summary>{L(['Přenést obraz do dne','Bring the image into your day'])}</summary><p>{L(guide.symbol.ritual)}</p></details>
          <details><summary>{L(['Božská spirála','The divine spiral'])}</summary><p>{L(['Spirála je tady obraz návratu s novou zkušeností. Stejná potřeba se může objevit znovu, ale už ji nemusím přehlédnout stejným způsobem. „Božská“ může znamenat úctu k životu, ne tvrzení o biologickém zákonu. Vyber si jeden drobný poznatek, který si chceš vzít do dalšího obratu.','The spiral is an image of returning with new experience. The same need may return, but I need not overlook it in the same way. “Divine” can mean reverence for life, not a biological law. Choose one small understanding to carry into the next turn.'])}</p></details>
        </>}
      </>:<div className="tg-cycle-empty"><p>{L(['V kalendáři pro tento den nemáme fázi. Mapu si můžeš prohlédnout výběrem kterékoli části nahoře. Tím nezměníš svůj zápis ani odhad.','The calendar has no phase for this day. Explore the map by choosing any part above. This changes neither a record nor an estimate.'])}</p></div>}
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
.tm-together .tg-cycle-depth .tg-cycle-opening{font-family:var(--tm-font-display);font-size:23px;line-height:1.35;color:var(--tg-heading);margin:4px 0 18px;max-width:30ch}
.tm-together .tg-cycle-map{max-width:430px;margin:0 auto 16px}
.tm-together .tg-cycle-map>svg{display:block;width:min(100%,300px);margin:0 auto 14px;overflow:visible;color:var(--tg-accent)}
.tg-cycle-orbit,.tg-cycle-spiral,.tg-cycle-arc{fill:none;stroke:currentColor;stroke-width:1}
.tg-cycle-orbit{opacity:.4;stroke-dasharray:1 5}.tg-cycle-spiral{opacity:.45}.tg-cycle-arc{opacity:.45;transition:opacity .2s ease,stroke-width .2s ease}
.tg-cycle-glyph-back{fill:var(--tg-bg);stroke:currentColor;stroke-width:.7}
.tg-cycle-hit{stroke:transparent;stroke-width:42;fill:none;pointer-events:stroke}
.tg-cycle-segment{cursor:pointer}.tg-cycle-segment.is-selected .tg-cycle-arc{opacity:1;stroke-width:2.5}.tg-cycle-segment.is-selected .tg-cycle-glyph-back{fill:var(--tg-card);stroke-width:1.7}
.tg-cycle-segment:focus{outline:none}.tg-cycle-segment:focus-visible .tg-cycle-arc{stroke-width:4;opacity:1}.tg-cycle-segment:hover .tg-cycle-arc{opacity:1}
.tg-cycle-directions{font-family:var(--tm-font-tag);font-size:10px;fill:currentColor}
.tm-together .tg-cycle-phase-buttons{display:grid;grid-template-columns:1fr 1fr;gap:4px 12px}
.tm-together .tg-cycle-phase-buttons button{border:0;border-bottom:1px solid var(--tg-soft);border-radius:0;padding:10px 2px;text-align:left;display:flex;gap:8px;align-items:center;font-size:14px}
.tm-together .tg-cycle-phase-buttons button::before{content:'';width:5px;height:5px;border-radius:50%;border:1px solid currentColor;flex-shrink:0}
.tm-together .tg-cycle-phase-buttons button[aria-pressed=true]{color:var(--tg-accent);border-color:var(--tg-accent)}.tm-together .tg-cycle-phase-buttons button[aria-pressed=true]::before{background:currentColor}
.tm-together .tg-cycle-context{font-family:var(--tm-font-body);font-size:12px;line-height:1.5;color:var(--tg-muted);display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin:8px 0 14px}
.tm-together .tg-cycle-context button{font-size:12px;padding:4px 0;border:0;text-decoration:underline;text-underline-offset:4px}
.tm-together .tg-cycle-layers{display:flex;gap:8px;border-bottom:1px solid var(--tg-soft);margin-bottom:20px}
.tm-together .tg-cycle-layers button{flex:1;min-width:0;border:0;border-radius:0;border-bottom:2px solid transparent;font-family:var(--tm-font-tag);font-size:13px;text-transform:uppercase;letter-spacing:.08em;padding:10px 2px;white-space:nowrap}
.tm-together .tg-cycle-layers button[aria-pressed=true]{color:var(--tg-accent);border-bottom-color:var(--tg-accent)}
.tm-together .tg-cycle-depth h3.tg-cycle-title{font-family:var(--tm-font-display);font-size:26px;font-weight:400;line-height:1.2;color:var(--tg-heading);margin:0 0 14px;text-transform:none;letter-spacing:normal}
.tm-together .tg-cycle-depth h4{font-family:var(--tm-font-display);font-weight:400;font-size:21px;line-height:1.3;color:var(--tg-accent);margin:22px 0 8px}
.tm-together .tg-cycle-depth .tg-cycle-caption{font-family:var(--tm-font-body);font-size:12px;line-height:1.6;color:var(--tg-muted)}
.tm-together .tg-cycle-shared{margin:20px 0}.tm-together .tg-cycle-shared h4{margin-bottom:4px}
.tm-together .tg-cycle-hormones{margin:24px 0}.tm-together .tg-cycle-hormones>svg{display:block;width:100%;height:auto;color:var(--tg-accent)}
.tg-cycle-hormones svg text{font-family:var(--tm-font-tag);font-size:11px;fill:var(--tg-muted)}
.tg-cycle-band{fill:var(--tg-accent);opacity:.07}.tg-cycle-axis{fill:none;stroke:var(--tg-soft);stroke-width:1}.tg-hormone-p4{color:var(--tg-text)}.tg-hormone-lh{color:var(--tg-text)}
.tm-together .tg-hormone-switches{display:grid;grid-template-columns:repeat(4,1fr);gap:5px;margin:12px 0}
.tm-together .tg-hormone-switches button{border-radius:4px;min-width:0;padding:8px 3px;font-size:12px;display:flex;align-items:center;justify-content:center;gap:4px}
.tm-together .tg-hormone-switches button[aria-pressed=true]{color:var(--tg-accent);border-color:var(--tg-accent);background:var(--tg-card)}
.tm-together .tg-hormone-description{min-height:5em;font-size:13px}
.tm-together .tg-cycle-correspondences{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:20px 0 26px;padding-bottom:18px;border-bottom:1px solid var(--tg-soft)}
.tg-cycle-correspondences dt{font-family:var(--tm-font-tag);font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--tg-muted)}
.tg-cycle-correspondences dd{font-family:var(--tm-font-display);font-size:22px;line-height:1.25;color:var(--tg-heading);margin:5px 0 0}
.tm-together .tg-cycle-depth .tg-cycle-question{font-family:var(--tm-font-display);font-size:25px;line-height:1.3;color:var(--tg-heading);margin:24px 0}
.tm-together .tg-cycle-depth .tg-cycle-method{margin-top:30px}.tm-together .tg-cycle-method>summary{font-family:var(--tm-font-tag);font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--tg-accent)}
.tm-together .tg-cycle-sources{padding-left:18px}.tm-together .tg-cycle-sources li{font-size:12px}
@media(prefers-reduced-motion:reduce){.tg-cycle-arc{transition:none}}
`;
