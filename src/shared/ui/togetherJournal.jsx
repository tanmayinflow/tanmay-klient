import React,{useEffect,useState,useRef} from 'react';
import {dateKey,addDays} from '../product/together.js';
import {weekOf,hasReflection,questionFor,activityOverview} from '../product/togetherJournal.js';

const fields=[
  ['appreciation','Za co ti chci poděkovat','Something I want to thank you for','Potěšilo mě, když…','It meant a lot when…'],
  ['need','Co by mi teď udělalo dobře','What would feel good right now','Pomohlo by mi…','It would help me to…'],
  ['next','Na co si uděláme chvíli','Something to make time for','Co třeba příští týden…','How about next week…']
];
const empty=()=>({appreciation:'',need:'',next:''});
export function TogetherJournal({data,lang,save,busy,onPlan,view,visible,onDirty,reset=0}) {
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
  // Keep both views mounted: changing tabs must not discard an unsent reflection.
  // The visible fallback preserves callers that still use the previous single-view API.
  const conversationsVisible=view===undefined?!!visible:view==='conversations';
  const plansVisible=view===undefined?!!visible:view==='plans';
  return <div hidden={!active||(!conversationsVisible&&!plansVisible)}>
    <section className="tm-together-section" hidden={!conversationsVisible}>
      <h2>{L('Chvíle jen pro nás','A little time for us')}</h2>
      <p>{L('Třeba jednou za týden se na chvíli zastavte. Co vás potěšilo, co potřebujete a na co si chcete udělat čas? Stačí jedna věta.','Perhaps once a week, pause together. What felt good, what do you need, and what would you like to make time for? One sentence is enough.')}</p>
      <details><summary>{L('Napsat týdenní ohlédnutí','Write a weekly reflection')}</summary>
        <p>{L('Nejdřív si dejte prostor mluvit a naslouchat. Řešení může počkat. Sem si uložte jen to, k čemu se chcete vrátit.','Give each other room to speak and listen first. Solutions can wait. Save only what you would like to return to.')}</p>
        <label htmlFor="tg-review-week">{L('Týden od','Week of')}</label>
        <select id="tg-review-week" value={week} disabled={busy} onChange={e=>{if(dirty&&!window.confirm(L('Přejít na jiný týden a zahodit rozepsaný text?','Switch weeks and discard your unsaved words?')))return;setDirty(false);setWeek(e.target.value);}}>{weeks.map(w=><option value={w} key={w}>{date(w)}</option>)}</select>
        {fields.map(([key,cs,en,placeholderCs,placeholderEn])=><label key={key} htmlFor={'tg-review-'+key}>{L(cs,en)}<textarea id={'tg-review-'+key} rows={2} maxLength={400} placeholder={L(placeholderCs,placeholderEn)} disabled={busy} value={draft[key]||''} onChange={e=>{setDraft(d=>({...d,[key]:e.target.value}));setDirty(true);}}/></label>)}
        <p className="hint">{L('Vyplň jen to, co chceš. Druhý z vás text uvidí až po sdílení. Je to tvůj pohled; společnou domluvu pak můžete přidat do Plánů.','Write only what you want to. Your partner sees these words only after you share them. This is your perspective; you can add anything you both agree on to Plans.')}</p>
        <div className="row"><button className="primary" disabled={busy||!dirty||!hasReflection(draft)} onClick={()=>share(draft)}>{L('Sdílet ohlédnutí','Share reflection')}</button>{hasReflection(mine?.doc)&&<button disabled={busy} onClick={()=>{if(window.confirm(L('Odebrat své sdílené ohlédnutí tohoto týdne? Text druhého z vás zůstane.','Remove your shared reflection for this week? Your partner’s words will stay.')))share(empty());}}>{L('Odebrat moje ohlédnutí','Remove my reflection')}</button>}</div>
        {dirty&&<p role="status" className="hint">{L('Rozepsáno. Tyto změny zatím vidíš jen ty.','Draft. Only you can see these changes so far.')}</p>}
      </details>
      <details><summary>{L('Naše slova v čase','Our words over time')}</summary>
        {!rows.some(r=>hasReflection(r.doc))&&!history.length&&<p>{L('Až si něco napíšete, najdete to i tady. Pro chvíle, kdy se k tomu budete chtít vrátit.','When you share a few words, they will stay here for whenever you want to return to them.')}</p>}
        {weeks.filter(w=>rows.some(r=>r.week===w&&hasReflection(r.doc))).map(w=><details key={w}><summary>{L('Týden od','Week of')} {date(w)}</summary>{rows.filter(r=>r.week===w&&hasReflection(r.doc)).map(r=><div className="item" key={r.side}><strong>{r.side==='mine'?L('Já','Me'):L('Druhý z nás','My partner')}</strong>{text(r.doc)}</div>)}</details>)}
        {history.map(h=><details key={h.day}><summary>{date(h.day)} · {L(...questionFor(h.day))}</summary>{h.mine&&<p style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}><strong>{L('Já','Me')}: </strong>{h.mine}</p>}{h.partner?<p style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}><strong>{L('Druhý z nás','My partner')}: </strong>{h.partner}</p>:<p className="hint">{L('Odpověď druhého se ukáže, až odpovíte oba.','Your partner’s answer appears once you have both answered.')}</p>}</details>)}
      </details>
      <details><summary>{L('Odkud bereme inspiraci','Where the inspiration comes from')}</summary>
        <p>{L('Poděkovat za něco konkrétního, naslouchat potřebám a občas spolu zažít něco nového. Tyto drobnosti čerpají ze zdrojů níže. Naše krátké ohlédnutí je volná úprava jejich principů, ne ověřený terapeutický program ani měření vašeho vztahu.','Thanking each other for something specific, listening to needs and occasionally trying something new together. These small invitations draw on the sources below. Our short reflection adapts their principles; it is not a validated therapy programme or a measure of your relationship.')}</p>
        <p><a href="https://www.gottman.com/blog/how-to-have-a-state-of-the-union-meeting/" target="_blank" rel="noreferrer">Gottman Institute · State of the Union</a><br/><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5085264/" target="_blank" rel="noreferrer">Algoe &amp; Zhaoyang · Gratitude and responsiveness</a><br/><a href="https://pubmed.ncbi.nlm.nih.gov/10707334/" target="_blank" rel="noreferrer">Aron et al. · Shared novel activities</a></p>
      </details>
    </section>
    <section className="tm-together-section" hidden={!plansVisible}>
      <h2>{L('Co jsme spolu prožili','Time we have shared')}</h2>
      <p>{L('Některé chvíle stojí za zopakování. Tady zůstávají vaše dokončené plány.','Some moments are worth making time for again. Your completed plans stay here.')}</p>
      <details><summary>{L('Vrátit se ke společným zážitkům','Revisit shared experiences')}</summary>
        {completed.length?completed.map(p=><div className="item" key={p.id}><strong>{p.title}</strong><p className="hint">{date(p.date)} · {p.minutes} min</p>{p.note&&<p>{p.note}</p>}<button disabled={busy} onClick={()=>onPlan({title:p.title,date:today,time:p.time,minutes:p.minutes,note:''})}>{L('Navrhnout znovu','Suggest this again')}</button></div>):<p>{L('Po společném plánu stačí zvolit „Proběhlo“. Nemusíte psát nic navíc.','After a shared plan, simply choose “Completed”. There is nothing else to write.')}</p>}
      </details>
      <details><summary>{L('Ohlédnutí za posledními 30 dny','A look at the last 30 days')}</summary>
        <p>{L('Dokončené společné plány','Completed plans together')}: {overview.completed.length}<br/>{L('Rozhovory, ve kterých jste odpověděli oba','Conversations you both answered')}: {history.filter(h=>h.shared&&h.day>=addDays(today,-29)).length}</p>
        <p className="hint">{L('Jen přehled toho, co jste tady zachytili. Váš společný život se do počtu zápisů nevejde.','This only shows what you recorded here. Your life together is bigger than a count of entries.')}</p>
      </details>
    </section>
  </div>;
}
