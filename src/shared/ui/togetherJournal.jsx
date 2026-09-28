import React,{useEffect,useState,useRef} from 'react';
import {dateKey,addDays} from '../product/together.js';
import {weekOf,hasReflection,questionFor,activityOverview} from '../product/togetherJournal.js';
import {WEEKLY_PROMPTS} from '../product/togetherConnectionContent.js';
import {TogetherText,TogetherFold} from './togetherElements.jsx';
import {togetherTheme} from './togetherStyles.js';

const fields=[
  ['appreciation','Za co ti chci poděkovat','Something I want to thank you for','Potěšilo mě, když…','It meant a lot when…'],
  ['need','Co by mi teď udělalo dobře','What would feel good right now','Pomohlo by mi…','It would help me to…'],
  ['next','Na co si uděláme chvíli','Something to make time for','Co třeba příští týden…','How about next week…']
];
const empty=()=>({appreciation:'',need:'',next:''});
export function TogetherJournal({data,lang,save,busy,onPlan,view,visible,onDirty,onPractice,Sheet,t,reset=0}) {
  const L=(cs,en)=>lang==='en'?en:cs,today=dateKey(),currentWeek=weekOf(today);
  const [week,setWeek]=useState(currentWeek),[draft,setDraft]=useState(empty),[revision,setRevision]=useState(0),[dirty,setDirty]=useState(false);
  const linkId=useRef(undefined),recordRef=useRef(null);
  const [step,setStep]=useState(0),[recordOpen,setRecordOpen]=useState(false);
  const [overviewOpen,setOverviewOpen]=useState(false);
  const active=data?.link?.status==='active',rows=data?.reflections||[],mine=rows.find(r=>r.week===week&&r.side==='mine');
  useEffect(()=>{if(data&&linkId.current!==data.link?.id){linkId.current=data.link?.id;setDirty(false);setDraft(empty());setWeek(currentWeek);setRevision(0);}},[data]);
  useEffect(()=>{setDirty(false);},[reset]);
  useEffect(()=>{onDirty?.(dirty);},[dirty,onDirty]);
  useEffect(()=>{if(data&&!dirty){setDraft(mine?.doc||empty());setRevision(mine?.revision||0);}},[data,week,dirty]);
  useEffect(()=>{setOverviewOpen(false);},[view,visible,data?.link?.id]);
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
    <TogetherFold title={L('Týdenní ohlédnutí','Our weekly reflection')} className="tg-weekly" hidden={!conversationsVisible}>
      <p>{L('Jednou týdně, třeba u čaje. Deset až patnáct minut pro vás dva. Otázky si řekněte nahlas; zapisovat nemusíte všechno.','Once a week, perhaps over tea. Ten to fifteen minutes for the two of you. Ask these questions out loud; you do not need to write everything down.')}</p>
      <div className="tg-weekly-guide">
        <p>{L('Jeden mluví, druhý zkusí vlastními slovy říct, co slyšel. Pak se vystřídejte. Radu nabídněte až na přání. Když je toho moc, domluvte si pauzu i čas návratu.','One speaks; the other reflects back what they heard in their own words. Then switch. Offer advice only if wanted. If it gets too much, agree on a pause and a time to return.')}</p>
        {rows.filter(r=>r.week===addDays(currentWeek,-7)&&r.doc?.next).map(r=><div className="item" key={r.side}><p className="hint">{r.side==='mine'?L('Můj námět z minula','My idea from last week'):L('Námět druhého z minula','My partner’s idea from last week')}</p><p>{r.doc.next}</p></div>)}
        <p className="hint">{L('Otázka','Question')} {step+1} / {WEEKLY_PROMPTS.length}</p>
        <div aria-live="polite" aria-atomic="true"><h3>{WEEKLY_PROMPTS[step].title[lang==='en'?'en':'cs']}</h3><p className="tg-personal">{WEEKLY_PROMPTS[step].question[lang==='en'?'en':'cs']}</p><TogetherFold key={step} title={L('Jít o kousek hlouběji','Go a little deeper')}><p>{WEEKLY_PROMPTS[step].followup[lang==='en'?'en':'cs']}</p></TogetherFold></div>
        <div className="row" style={{marginTop:16}}><button type="button" disabled={step===0} onClick={()=>setStep(s=>s-1)}>{L('Zpět','Back')}</button>{step<WEEKLY_PROMPTS.length-1?<button type="button" onClick={()=>setStep(s=>s+1)}>{L('Další otázka','Next question')}</button>:<button type="button" onClick={()=>{setRecordOpen(true);requestAnimationFrame(()=>recordRef.current?.scrollIntoView({block:'center',behavior:'auto'}));}}>{L('Zapsat to podstatné','Save what matters')}</button>}</div>
        <p className="hint">{L('Máte jen chvilku? Poděkujte si za jednu konkrétní věc a řekněte si, co by vám teď pomohlo. K citlivému tématu se vraťte, až na něj budete mít prostor oba.','Only a moment? Appreciate one specific thing and say what would help now. Return to a sensitive topic when you both have room for it.')}</p>
      </div>
      <div ref={recordRef}><TogetherFold title={L('Zapsat týdenní ohlédnutí','Write a weekly reflection')} open={recordOpen} onToggle={e=>setRecordOpen(e.currentTarget.open)}>
        <p>{L('Stačí vděčnost, potřeba a jeden malý krok. Domluvte se, kdo ho udělá a kdy se k němu vrátíte. Nemusíte přepisovat svůj rozhovor.','Keep an appreciation, a need and one small step. Agree who will take it and when to return to it. There is no need to transcribe your conversation.')}</p>
        <label htmlFor="tg-review-week">{L('Týden od','Week of')}</label>
        <select id="tg-review-week" value={week} disabled={busy} onChange={e=>{if(dirty&&!window.confirm(L('Přejít na jiný týden a zahodit rozepsaný text?','Switch weeks and discard your unsaved words?')))return;setDirty(false);setWeek(e.target.value);}}>{weeks.map(w=><option value={w} key={w}>{date(w)}</option>)}</select>
        {fields.map(([key,cs,en,placeholderCs,placeholderEn])=><label key={key} htmlFor={'tg-review-'+key}>{L(cs,en)}<TogetherText id={'tg-review-'+key} rows={1} maxLength={400} placeholder={L(placeholderCs,placeholderEn)} disabled={busy} value={draft[key]||''} onChange={e=>{setDraft(d=>({...d,[key]:e.target.value}));setDirty(true);}}/></label>)}
        <p className="hint">{L('Vyplň jen to, co chceš. Druhý z vás text uvidí až po sdílení. Je to tvůj pohled; společnou domluvu pak můžete přidat do Plánů.','Write only what you want to. Your partner sees these words only after you share them. This is your perspective; you can add anything you both agree on to Plans.')}</p>
        <div className="row"><button className="primary" disabled={busy||!dirty||!hasReflection(draft)} onClick={()=>share(draft)}>{L('Sdílet ohlédnutí','Share reflection')}</button>{hasReflection(mine?.doc)&&<button disabled={busy} onClick={()=>{if(window.confirm(L('Odebrat své sdílené ohlédnutí tohoto týdne? Text druhého z vás zůstane.','Remove your shared reflection for this week? Your partner’s words will stay.')))share(empty());}}>{L('Odebrat moje ohlédnutí','Remove my reflection')}</button>}</div>
        {draft.next?.trim()&&<p><button type="button" disabled={busy} onClick={()=>onPlan({title:lang==='en'?'Our next small step':'Náš příští malý krok',date:today,time:'18:00',minutes:15,note:draft.next})}>{L('Přenést krok do Plánů','Bring the step into Plans')}</button></p>}
        {onPractice&&<p><button type="button" onClick={onPractice}>{L('Navázat na naši Praxi','Connect with our Practice')}</button></p>}
        {dirty&&<p role="status" className="hint">{L('Rozepsáno. Tyto změny zatím vidíš jen ty.','Draft. Only you can see these changes so far.')}</p>}
      </TogetherFold></div>
      <TogetherFold title={L('Odkud bereme inspiraci','Where the inspiration comes from')} className="tg-optional">
        <p>{L('Poděkovat za něco konkrétního, naslouchat potřebám a občas spolu zažít něco nového. Tyto drobnosti čerpají ze zdrojů níže. Naše krátké ohlédnutí je volná úprava jejich principů, ne ověřený terapeutický program ani měření vašeho vztahu.','Thanking each other for something specific, listening to needs and occasionally trying something new together. These small invitations draw on the sources below. Our short reflection adapts their principles; it is not a validated therapy programme or a measure of your relationship.')}</p>
        <p><a href="https://www.gottman.com/blog/how-to-have-a-state-of-the-union-meeting/" target="_blank" rel="noreferrer">Gottman Institute · State of the Union</a><br/><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5085264/" target="_blank" rel="noreferrer">Algoe &amp; Zhaoyang · Gratitude and responsiveness</a><br/><a href="https://pubmed.ncbi.nlm.nih.gov/10707334/" target="_blank" rel="noreferrer">Aron et al. · Shared novel activities</a></p>
      </TogetherFold>
    </TogetherFold>
    <button type="button" className="tg-overview-trigger" onClick={()=>setOverviewOpen(true)}>{L('Přehled','Overview')}</button>
    {overviewOpen&&active&&(conversationsVisible||plansVisible)&&Sheet&&<Sheet title={L('Přehled Spolu','Together overview')} onClose={()=>setOverviewOpen(false)}>
      <div className="tm-together tg-overview-sheet" style={togetherTheme(t)}>
        <section className="tm-together-section">
        <h2>{L('Ohlédnutí za posledními 30 dny','A look at the last 30 days')}</h2>
        <div className="tg-overview-stats">
          <div className="tg-stat"><strong>{overview.completed.length}</strong><span>{L('Dokončené společné plány','Completed plans together')}</span></div>
          <div className="tg-stat"><strong>{history.filter(h=>h.shared&&h.day>=addDays(today,-29)).length}</strong><span>{L('Rozhovory, ve kterých jste odpověděli oba','Conversations you both answered')}</span></div>
        </div>
        <p className="hint">{L('Jen přehled toho, co jste tady zachytili. Váš společný život se do počtu zápisů nevejde.','This only shows what you recorded here. Your life together is bigger than a count of entries.')}</p>
        </section>
        <TogetherFold title={L('Naše slova v čase','Our words over time')}>
          {!rows.some(r=>hasReflection(r.doc))&&!history.length&&<p>{L('Až si něco napíšete, najdete to i tady. Pro chvíle, kdy se k tomu budete chtít vrátit.','When you share a few words, they will stay here for whenever you want to return to them.')}</p>}
          {weeks.filter(w=>rows.some(r=>r.week===w&&hasReflection(r.doc))).map(w=><TogetherFold key={w} title={`${L('Týden od','Week of')} ${date(w)}`}>{rows.filter(r=>r.week===w&&hasReflection(r.doc)).map(r=><div className="item" key={r.side}><strong>{r.side==='mine'?L('Já','Me'):L('Druhý z nás','My partner')}</strong>{text(r.doc)}</div>)}</TogetherFold>)}
          {history.map(h=><TogetherFold key={h.day} title={`${date(h.day)} · ${L(...(h.question?.text||questionFor(h.day)))}`}>{h.mine&&<p style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}><strong>{L('Já','Me')}: </strong>{h.mine}</p>}{h.partner?<p style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}><strong>{L('Druhý z nás','My partner')}: </strong>{h.partner}</p>:<p className="hint">{L('Odpověď druhého se ukáže, až odpovíte oba.','Your partner’s answer appears once you have both answered.')}</p>}</TogetherFold>)}
        </TogetherFold>
        <TogetherFold title={L('Co jsme spolu prožili','Time we have shared')}>
          <p>{L('Některé chvíle stojí za zopakování. Tady zůstávají vaše dokončené plány.','Some moments are worth making time for again. Your completed plans stay here.')}</p>
          {completed.length?completed.map(p=><div className="item" key={p.id}><strong>{p.title}</strong><p className="hint">{date(p.date)} · {p.minutes} min</p>{p.note&&<p>{p.note}</p>}<button disabled={busy} onClick={()=>{setOverviewOpen(false);onPlan({title:p.title,date:today,time:p.time,minutes:p.minutes,note:''},{afterOverlay:true});}}>{L('Navrhnout znovu','Suggest this again')}</button></div>):<p>{L('Po společném plánu stačí zvolit „Proběhlo“. Nemusíte psát nic navíc.','After a shared plan, simply choose “Completed”. There is nothing else to write.')}</p>}
        </TogetherFold>
      </div>
    </Sheet>}
  </div>;
}
