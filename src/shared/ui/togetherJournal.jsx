import React,{useEffect,useState,useRef} from 'react';
import {dateKey,addDays} from '../product/together.js';
import {weekOf,hasReflection,questionFor,activityOverview} from '../product/togetherJournal.js';

const fields=[['appreciation','Za co ti děkuji','Something I appreciate'],['need','Co teď potřebuji','What I need right now'],['next','Malý návrh na příští týden','One small idea for next week']];
const empty=()=>({appreciation:'',need:'',next:''});
export function TogetherJournal({data,lang,save,busy,onPlan,visible,onDirty,reset=0}) {
  const L=(cs,en)=>lang==='en'?en:cs,today=dateKey(),currentWeek=weekOf(today);
  const [week,setWeek]=useState(currentWeek),[draft,setDraft]=useState(empty),[revision,setRevision]=useState(0),[dirty,setDirty]=useState(false);
  const linkId=useRef(undefined);
  const active=data?.link?.status==='active',rows=data?.reflections||[],mine=rows.find(r=>r.week===week&&r.side==='mine');
  useEffect(()=>{if(data&&linkId.current!==data.link?.id){linkId.current=data.link?.id;setDirty(false);setDraft(empty());setWeek(currentWeek);setRevision(0);}},[data]);
  useEffect(()=>{setDirty(false);},[reset]);
  useEffect(()=>{onDirty?.(dirty);},[dirty,onDirty]);
  useEffect(()=>{if(data&&!dirty){setDraft(mine?.doc||empty());setRevision(mine?.revision||0);}},[data,week,dirty]);
  const date=d=>new Date(d+'T12:00:00').toLocaleDateString(lang==='en'?'en-GB':'cs-CZ',{day:'numeric',month:'long',year:'numeric'});
  const history=data?.history||[],plans=data?.plans||[],overview=activityOverview(plans,today);
  const completed=plans.filter(p=>p.status==='done').toSorted((a,b)=>b.date.localeCompare(a.date));
  const weeks=[...new Set([currentWeek,...rows.filter(r=>hasReflection(r.doc)).map(r=>r.week)])].sort().reverse();
  const share=async(doc)=>{if(await save('reflection',{week,doc,revision,linkId:data.link.id,linkRevision:data.link.revision}))setDirty(false);};
  const text=(doc)=>fields.filter(([key])=>doc?.[key]).map(([key,cs,en])=><div key={key}><p className="hint">{L(cs,en)}</p><p style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{doc[key]}</p></div>);
  return <div hidden={!visible||!active}>
    <section className="tm-together-section">
      <h2>{L('Co si neseme dál','What we carry forward')}</h2>
      <p>{L('Posledních 30 dní','Last 30 days')}<br/>{L('Společné aktivity','Activities together')}: {overview.completed.length} · {L('Rozhovory s odpovědí obou','Conversations answered by both')}: {history.filter(h=>h.shared&&h.day>=addDays(today,-29)).length}</p>
      <p className="hint">{L('Přehled roste z vašich plánů a sdílení. Nemusíte nic zapisovat každý den.','The overview grows from your plans and sharing. You do not need to record anything every day.')}</p>
      <details><summary>{L('Chvíle pro nás · týdenní ohlédnutí','A moment for us · weekly reflection')}</summary>
        <p>{L('Jednou za týden si dejte pár minut bez telefonů. Každý řekněte jednu věc, které si vážíte, a jednu aktuální potřebu. Nejdřív si naslouchejte, potom zkuste domluvit jeden malý krok. Do aplikace stačí věta, ke které se chcete vrátit.','Once a week, take a few phone-free minutes. Each name something you appreciate and one current need. Listen first, then try agreeing on one small step. Save only a sentence you want to return to.')}</p>
        <label htmlFor="tg-review-week">{L('Týden od','Week of')}</label>
        <select id="tg-review-week" value={week} disabled={busy} onChange={e=>{if(dirty&&!window.confirm(L('Zahodit rozepsané ohlédnutí?','Discard this unsaved reflection?')))return;setDirty(false);setWeek(e.target.value);}}>{weeks.map(w=><option value={w} key={w}>{date(w)}</option>)}</select>
        {fields.map(([key,cs,en])=><label key={key} htmlFor={'tg-review-'+key}>{L(cs,en)}<textarea id={'tg-review-'+key} rows={2} maxLength={400} disabled={busy} value={draft[key]||''} onChange={e=>{setDraft(d=>({...d,[key]:e.target.value}));setDirty(true);}}/></label>)}
        <p className="hint">{L('Všechna pole jsou volitelná. Po sdílení text uvidí propojený partner. Je to tvůj pohled, ne společně schválená dohoda.','Every field is optional. Your connected partner sees this after you share it. It is your perspective, not a mutually agreed commitment.')}</p>
        <div className="row"><button className="primary" disabled={busy||!dirty||!hasReflection(draft)} onClick={()=>share(draft)}>{L('Sdílet ohlédnutí','Share reflection')}</button>{hasReflection(mine?.doc)&&<button disabled={busy} onClick={()=>{if(window.confirm(L('Odebrat své sdílené ohlédnutí tohoto týdne?','Remove your shared reflection for this week?')))share(empty());}}>{L('Odebrat mé ohlédnutí','Remove my reflection')}</button>}</div>
        {dirty&&<p role="status" className="hint">{L('Rozepsáno, ještě nesdíleno.','Draft, not shared yet.')}</p>}
      </details>
      <details><summary>{L('Naše společné zážitky','Our shared experiences')} · {completed.length}</summary>
        {completed.length?completed.map(p=><div className="item" key={p.id}><strong>{p.title}</strong><p className="hint">{date(p.date)} · {p.minutes} min</p>{p.note&&<p>{p.note}</p>}<button disabled={busy} onClick={()=>onPlan({title:p.title,date:today,time:p.time,minutes:p.minutes,note:''})}>{L('Zopakovat někdy znovu','Do this again')}</button></div>):<p>{L('Až společný plán označíte jako „Proběhlo“, zůstane tady.','When you mark a shared plan as completed, it stays here.')}</p>}
      </details>
      <details><summary>{L('K čemu se chceme vracet','Words to return to')}</summary>
        {!rows.some(r=>hasReflection(r.doc))&&!history.length&&<p>{L('Tady najdete sdílená ohlédnutí a odpovědi z rozhovorů.','Shared reflections and conversation answers will appear here.')}</p>}
        {weeks.filter(w=>rows.some(r=>r.week===w&&hasReflection(r.doc))).map(w=><details key={w}><summary>{L('Týden od','Week of')} {date(w)}</summary>{rows.filter(r=>r.week===w&&hasReflection(r.doc)).map(r=><div className="item" key={r.side}><strong>{r.side==='mine'?L('Já','Me'):L('Druhý z nás','My partner')}</strong>{text(r.doc)}</div>)}</details>)}
        {history.map(h=><details key={h.day}><summary>{date(h.day)} · {L(...questionFor(h.day))}</summary>{h.mine&&<p style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}><strong>{L('Já','Me')}: </strong>{h.mine}</p>}{h.partner?<p style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}><strong>{L('Druhý z nás','My partner')}: </strong>{h.partner}</p>:<p className="hint">{L('Odpověď druhého se ukáže, až odpovíte oba.','Your partner’s answer appears once you have both answered.')}</p>}</details>)}
      </details>
      <details><summary>{L('Proč právě tyto drobnosti','Why these small things')}</summary>
        <p>{L('Konkrétní ocenění, naslouchání potřebám a občasný nový společný zážitek jsou podněty k blízkosti. Krátké ohlédnutí je naše jednoduchá úprava těchto principů, nikoli ověřený terapeutický program nebo měření kvality vztahu.','Specific appreciation, listening to needs and an occasional new shared experience are prompts for connection. This short reflection is our simple adaptation, not a validated therapy programme or a measure of relationship quality.')}</p>
        <p><a href="https://www.gottman.com/blog/how-to-have-a-state-of-the-union-meeting/" target="_blank" rel="noreferrer">Gottman Institute · State of the Union</a><br/><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5085264/" target="_blank" rel="noreferrer">Algoe &amp; Zhaoyang · Gratitude and responsiveness</a><br/><a href="https://pubmed.ncbi.nlm.nih.gov/10707334/" target="_blank" rel="noreferrer">Aron et al. · Shared novel activities</a></p>
      </details>
    </section>
  </div>;
}
