import React,{useEffect,useState,useRef} from 'react';
import {dateKey} from '../product/together.js';
import {weekOf,hasReflection,questionFor,activityOverview,previousReflection,FOLLOW_THROUGH} from '../product/togetherJournal.js';
import {WEEKLY_PROMPTS} from '../product/togetherConnectionContent.js';
import {TogetherText,TogetherFold} from './togetherElements.jsx';
import {TogetherArtwork} from './togetherArtwork.jsx';
import {togetherTheme} from './togetherStyles.js';

const fields=[
  ['appreciation','Za co ti chci poděkovat','Something I want to thank you for','Potěšilo mě, když…','It meant a lot when…'],
  ['need','Co potřebuje naši pozornost','What needs our attention','Chybělo mi… Potřeboval/a bych…','I missed… I would need…'],
  ['next','Co do příště konkrétně zkusíme','What we will try before next time','Kdo, co a kdy. Když přijde…, zkusím…','Who, what and when. When… happens, I will try…']
];
const empty=()=>({appreciation:'',need:'',next:''});
export function TogetherJournal({data,lang,save,busy,onPlan,view,visible,onDirty,onPractice,Sheet,t,reset=0,embedded=false,renderWeekly,unlinkedWeekly}) {
  const L=(cs,en)=>lang==='en'?en:cs,today=dateKey(),currentWeek=weekOf(today);
  const [week,setWeek]=useState(currentWeek),[draft,setDraft]=useState(empty),[revision,setRevision]=useState(0),[dirty,setDirty]=useState(false);
  const linkId=useRef(undefined),recordRef=useRef(null);
  const [step,setStep]=useState(0),[recordOpen,setRecordOpen]=useState(false);
  const [overviewOpen,setOverviewOpen]=useState(false),[overviewTab,setOverviewTab]=useState('reflections'),[overviewWeek,setOverviewWeek]=useState(''),[overviewDay,setOverviewDay]=useState('');
  const active=data?.link?.status==='active',rows=data?.reflections||[],mine=rows.find(r=>r.week===week&&r.side==='mine');
  const previous=previousReflection(rows,week),previousPartner=previousReflection(rows,week,'partner');
  const follow=draft.followThrough||(previous?{week:previous.week,step:previous.doc.next,status:'',note:''}:null);
  useEffect(()=>{if(data&&linkId.current!==data.link?.id){linkId.current=data.link?.id;setDirty(false);setDraft(empty());setWeek(currentWeek);setRevision(0);}},[data,currentWeek]);
  useEffect(()=>{setDirty(false);},[reset]);
  useEffect(()=>{onDirty?.(dirty);},[dirty,onDirty]);
  useEffect(()=>{if(data&&!dirty){setDraft(mine?.doc||empty());setRevision(mine?.revision||0);}},[data,week,dirty,mine?.doc,mine?.revision]);
  useEffect(()=>{setOverviewOpen(false);},[view,visible,data?.link?.id]);
  const date=d=>new Date(d+'T12:00:00').toLocaleDateString(lang==='en'?'en-GB':'cs-CZ',{day:'numeric',month:'long',year:'numeric'});
  const history=data?.history||[],plans=data?.plans||[],overview=activityOverview(plans,today);
  const completed=plans.filter(p=>p.status==='done').toSorted((a,b)=>b.date.localeCompare(a.date));
  const weeks=[...new Set([currentWeek,...rows.filter(r=>hasReflection(r.doc)).map(r=>r.week)])].sort().reverse();
  const share=async(doc)=>{if(await save('reflection',{week,doc,revision,linkId:data.link.id,linkRevision:data.link.revision}))setDirty(false);};
  const progressText=doc=>doc?.followThrough&&<div className="tg-followthrough"><p className="hint">{L('Návrat ke kroku z týdne od','Returning to the step from')} {date(doc.followThrough.week)}</p><p style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{doc.followThrough.step}</p><strong>{FOLLOW_THROUGH.find(s=>s.id===doc.followThrough.status)?.[lang==='en'?'en':'cs']}</strong>{doc.followThrough.note&&<p style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{doc.followThrough.note}</p>}</div>;
  const text=(doc)=><>{progressText(doc)}{fields.filter(([key])=>doc?.[key]).map(([key,cs,en])=><div key={key}><p className="hint">{L(cs,en)}</p><p style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{doc[key]}</p></div>)}</>;
  const changeFollow=(key,value)=>{setDraft(d=>({...d,followThrough:{...follow,[key]:value}}));setDirty(true);};
  const savedWeeks=weeks.filter(w=>rows.some(r=>r.week===w&&hasReflection(r.doc)));
  const selectedWeek=savedWeeks.includes(overviewWeek)?overviewWeek:savedWeeks[0],weekIndex=savedWeeks.indexOf(selectedWeek);
  const selectedHistory=history.find(item=>item.day===overviewDay)||history[0];
  // Keep both views mounted: changing tabs must not discard an unsent reflection.
  // The visible fallback preserves callers that still use the previous single-view API.
  const conversationsVisible=view===undefined?!!visible:view==='conversations';
  const plansVisible=view===undefined?!!visible:view==='plans';
  const weeklyContent=<div className="tg-weekly tg-embedded-content">
      <p>{L('Jednou týdně, třeba u čaje. Deset až patnáct minut pro vás dva. Otázky si řekněte nahlas; zapisovat nemusíte všechno.','Once a week, perhaps over tea. Ten to fifteen minutes for the two of you. Ask these questions out loud; you do not need to write everything down.')}</p>
      <div className="tg-weekly-guide">
        <p>{L('Jeden mluví, druhý zkusí vlastními slovy říct, co slyšel. Pak se vystřídejte. Radu nabídněte až na přání. Když je toho moc, domluvte si pauzu i čas návratu.','One speaks; the other reflects back what they heard in their own words. Then switch. Offer advice only if wanted. If it gets too much, agree on a pause and a time to return.')}</p>
        {[previous,previousPartner].filter(Boolean).map(r=><div className="item" key={r.side}><p className="hint">{r.side==='mine'?L('Můj krok z minula','My previous step'):L('Krok druhého z minula','My partner’s previous step')} · {date(r.week)}</p><p>{r.doc.next}</p></div>)}
        {!previous&&!previousPartner&&<div className="tg-reflection-empty"><svg viewBox="0 0 240 140" aria-hidden="true"><TogetherArtwork kind="plan" x={50} y={4} width={140} height={128}/></svg><p>{L('Váš první malý krok může vzniknout dnes.','Your first small step can begin today.')}</p></div>}
        <p className="hint">{L('Otázka','Question')} {step+1} / {WEEKLY_PROMPTS.length}</p>
        <div aria-live="polite" aria-atomic="true"><h3>{WEEKLY_PROMPTS[step].title[lang==='en'?'en':'cs']}</h3><p className="tg-personal">{WEEKLY_PROMPTS[step].question[lang==='en'?'en':'cs']}</p><TogetherFold key={step} className="tg-inline-fold" title={L('Jít o kousek hlouběji','Go a little deeper')}><p>{WEEKLY_PROMPTS[step].followup[lang==='en'?'en':'cs']}</p></TogetherFold></div>
        <div className="row" style={{marginTop:16}}><button type="button" disabled={step===0} onClick={()=>setStep(s=>s-1)}>{L('Zpět','Back')}</button>{step<WEEKLY_PROMPTS.length-1?<button type="button" onClick={()=>setStep(s=>s+1)}>{L('Další otázka','Next question')}</button>:<button type="button" onClick={()=>{setRecordOpen(true);requestAnimationFrame(()=>recordRef.current?.scrollIntoView({block:'center',behavior:'auto'}));}}>{L('Zapsat to podstatné','Save what matters')}</button>}</div>
        <p className="hint">{L('Máte jen chvilku? Poděkujte si za jednu konkrétní věc a řekněte si, co by vám teď pomohlo. K citlivému tématu se vraťte, až na něj budete mít prostor oba.','Only a moment? Appreciate one specific thing and say what would help now. Return to a sensitive topic when you both have room for it.')}</p>
      </div>
      <div ref={recordRef}><TogetherFold title={L('Zapsat týdenní ohlédnutí','Write a weekly reflection')} open={recordOpen} onToggle={e=>setRecordOpen(e.currentTarget.open)}>
        <p>{L('Zachyťte, co bylo dobré, co potřebuje péči a co opravdu zkusíte jinak. Tři krátké věty mohou stačit.','Keep what was good, what needs care and what you will actually try differently. Three short sentences can be enough.')}</p>
        <label htmlFor="tg-review-week">{L('Týden od','Week of')}</label>
        <select id="tg-review-week" value={week} disabled={busy} onChange={e=>{if(dirty&&!window.confirm(L('Přejít na jiný týden a zahodit rozepsaný text?','Switch weeks and discard your unsaved words?')))return;setDirty(false);setWeek(e.target.value);}}>{weeks.map(w=><option value={w} key={w}>{date(w)}</option>)}</select>
        {follow&&<fieldset className="tg-followthrough" style={{border:0,padding:0,margin:'22px 0'}}><legend>{L('Jak se nám dařilo s minulým krokem','How the previous step went')}</legend><p className="hint">{L('Z týdne od','From the week of')} {date(follow.week)}</p><p style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{follow.step}</p><div className="fields">{FOLLOW_THROUGH.map(option=><label className="tg-check" key={option.id}><input type="radio" name="tg-followthrough" value={option.id} checked={follow.status===option.id} disabled={busy} onChange={()=>changeFollow('status',option.id)}/>{option[lang==='en'?'en':'cs']}</label>)}</div>{follow.status&&<><label htmlFor="tg-follow-note">{L('Co pomohlo, překáželo nebo chceme upravit','What helped, got in the way or needs adjusting')}<TogetherText id="tg-follow-note" placeholder={L("Co pomohlo a co zkusíme jinak…","What helped and what we will try differently…")} rows={1} maxLength={400} value={follow.note||''} disabled={busy} onChange={e=>changeFollow('note',e.target.value)}/></label><button type="button" className="tg-text" disabled={busy} onClick={()=>{setDraft(d=>{const next={...d};delete next.followThrough;return next;});setDirty(true);}}>{L('Nechat bez hodnocení','Leave this open')}</button></>}</fieldset>}
        {fields.map(([key,cs,en,placeholderCs,placeholderEn])=><label key={key} htmlFor={'tg-review-'+key}>{L(cs,en)}<TogetherText id={'tg-review-'+key} rows={1} maxLength={400} placeholder={L(placeholderCs,placeholderEn)} disabled={busy} value={draft[key]||''} onChange={e=>{setDraft(d=>({...d,[key]:e.target.value}));setDirty(true);}}/></label>)}
        <p className="hint">{L('Vyplň jen to, co chceš. Druhý z vás text uvidí až po sdílení. Je to tvůj pohled; společnou domluvu pak můžete přidat do Plánů.','Write only what you want to. Your partner sees these words only after you share them. This is your perspective; you can add anything you both agree on to Plans.')}</p>
        <div className="row"><button className="primary" disabled={busy||!dirty||!hasReflection(draft)} onClick={()=>share(draft)}>{L('Sdílet ohlédnutí','Share reflection')}</button>{hasReflection(mine?.doc)&&<button disabled={busy} onClick={()=>{if(window.confirm(L('Odebrat své sdílené ohlédnutí tohoto týdne? Text druhého z vás zůstane.','Remove your shared reflection for this week? Your partner’s words will stay.')))share(empty());}}>{L('Odebrat moje ohlédnutí','Remove my reflection')}</button>}</div>
        {draft.next?.trim()&&<p><button type="button" disabled={busy} onClick={()=>onPlan({title:lang==='en'?'Our next small step':'Náš příští malý krok',date:today,time:'18:00',minutes:15,note:draft.next})}>{L('Přenést krok do Plánů','Bring the step into Plans')}</button></p>}
        {onPractice&&<p><button type="button" onClick={onPractice}>{L('Navázat na naši Praxi','Connect with our Practice')}</button></p>}
        {dirty&&<p role="status" className="hint">{L('Rozepsáno. Tyto změny zatím vidíš jen ty.','Draft. Only you can see these changes so far.')}</p>}
      </TogetherFold></div>

    </div>;
  const weeklyView=active?weeklyContent:(unlinkedWeekly||<p>{L('Týdenní ohlédnutí můžete projít spolu. Pro návraty k uloženým domluvám nejdřív propojte účty.','You can reflect together. Connect accounts first to keep and revisit your agreements.')}</p>);
  return <div hidden={(!renderWeekly&&!active)||(!conversationsVisible&&!plansVisible)}>
    <div hidden={!conversationsVisible}>
      {renderWeekly?renderWeekly(weeklyView):embedded?weeklyView:<TogetherFold title={L('Týdenní ohlédnutí','Our weekly reflection')} className="tg-weekly">{weeklyView}</TogetherFold>}
    </div>
    {active&&<button type="button" className="tg-overview-trigger" onClick={()=>setOverviewOpen(true)}>{L('Přehled','Overview')}</button>}
    {overviewOpen&&active&&(conversationsVisible||plansVisible)&&Sheet&&<Sheet title={L('Přehled Spolu','Together overview')} onClose={()=>setOverviewOpen(false)}>
      <div className="tm-together tg-overview-sheet" style={togetherTheme(t)}>
        <nav className="tabs tg-history-tabs" aria-label={L('Co si připomenout','What to revisit')}>{[['reflections','Ohlédnutí','Reflections'],['answers','Odpovědi','Answers'],['moments','Chvíle','Moments']].map(([id,cs,en])=><button key={id} type="button" aria-pressed={overviewTab===id} onClick={()=>setOverviewTab(id)}>{L(cs,en)}</button>)}</nav>
        <p className="tg-history-intro">{L('Co jsme si řekli. Co jsme zkusili. Co si neseme dál.','What we shared. What we tried. What we carry forward.')}</p>
        {overviewTab==='reflections'&&<section className="tg-history-page">
          {!savedWeeks.length?<div className="tg-reflection-empty"><svg viewBox="0 0 240 140" aria-hidden="true"><TogetherArtwork kind="plan" x={50} y={4} width={140} height={128}/></svg><p>{L('Tady zůstane to podstatné z vašich ohlédnutí.','What matters from your reflections will stay here.')}</p></div>:<>
            <div className="tg-history-navigation"><button type="button" disabled={weekIndex>=savedWeeks.length-1} aria-label={L('Starší týden','Earlier week')} onClick={()=>setOverviewWeek(savedWeeks[weekIndex+1])}>‹</button><label>{L('Týden od','Week of')}<select aria-label={L('Vybrat týden','Choose a week')} value={selectedWeek} onChange={e=>setOverviewWeek(e.target.value)}>{savedWeeks.map(w=><option key={w} value={w}>{date(w)}</option>)}</select></label><button type="button" disabled={weekIndex<=0} aria-label={L('Novější týden','Later week')} onClick={()=>setOverviewWeek(savedWeeks[weekIndex-1])}>›</button></div>
            <div key={selectedWeek} className="tg-history-perspectives">{['mine','partner'].map(side=>{const record=rows.find(r=>r.week===selectedWeek&&r.side===side&&hasReflection(r.doc));return <article key={side}><h3>{side==='mine'?L('Já','Me'):L('Druhý z nás','My partner')}</h3>{record?text(record.doc):<p className="hint">{L('Pro tento týden tu zatím není sdílené ohlédnutí.','No reflection has been shared for this week yet.')}</p>}</article>;})}</div>
          </>}
        </section>}
        {overviewTab==='answers'&&<section className="tg-history-page">{!history.length?<div className="tg-reflection-empty"><svg viewBox="0 0 240 140" aria-hidden="true"><TogetherArtwork kind="bond" x={50} y={4} width={140} height={128}/></svg><p>{L('První odpověď se tu objeví po sdílení.','Your first answer appears here after sharing.')}</p></div>:<><label>{L('Den rozhovoru','Conversation day')}<select value={selectedHistory.day} onChange={e=>setOverviewDay(e.target.value)}>{history.map(h=><option value={h.day} key={h.day}>{date(h.day)}</option>)}</select></label><p className="tg-personal">{L(...(selectedHistory.question?.text||questionFor(selectedHistory.day)))}</p><div className="tg-history-perspectives" key={selectedHistory.day}><article><h3>{L('Já','Me')}</h3><p>{selectedHistory.mine||L('Zatím bez odpovědi.','No answer yet.')}</p></article><article><h3>{L('Druhý z nás','My partner')}</h3><p>{selectedHistory.partner||L('Odpověď se ukáže, až odpovíte oba.','The answer appears once you both respond.')}</p></article></div></>}</section>}
        {overviewTab==='moments'&&<section className="tg-history-page"><p className="tg-history-count">{overview.completed.length} {L('společných plánů za posledních 30 dní','shared plans in the last 30 days')}</p>{completed.length?completed.map(p=><article className="tg-history-moment" key={p.id}><p className="hint">{date(p.date)} · {p.minutes} min</p><h3>{p.title}</h3>{p.note&&<p>{p.note}</p>}<button disabled={busy} onClick={()=>{setOverviewOpen(false);onPlan({title:p.title,date:today,time:p.time,minutes:p.minutes,note:''},{afterOverlay:true});}}>{L('Navrhnout znovu','Suggest this again')}</button></article>):<div className="tg-reflection-empty"><svg viewBox="0 0 240 140" aria-hidden="true"><TogetherArtwork kind="shared" x={50} y={4} width={140} height={128}/></svg><p>{L('Dokončené společné chvíle se objeví tady.','Your completed moments together will appear here.')}</p></div>}</section>}
      </div>
    </Sheet>}
  </div>;
}
