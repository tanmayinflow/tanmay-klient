import React,{useRef,useState} from 'react';
import {togetherTheme} from './togetherStyles.js';
import {TogetherArtwork} from './togetherArtwork.jsx';
import {TogetherFold} from './togetherElements.jsx';
import {dateKey} from '../product/together.js';
import {PLAN_INSPIRATIONS,PLAN_THEMES,DAILY_CONNECTION_PROMPTS} from '../product/togetherConnectionContent.js';
import {inspirationBatch,filterInspirations,filteredInspirationBatch} from '../product/togetherInspiration.js';

export function TogetherInspiration({lang,onPlan,Sheet,t}){
  const L=(cs,en)=>lang==='en'?en:cs,local=value=>value[lang==='en'?'en':'cs'];
  const [opened,setOpened]=useState(null);
  const [filters,setFilters]=useState({contexts:[],minutes:120,energy:3,themes:[]});
  const [batch,setBatch]=useState(()=>filteredInspirationBatch(PLAN_INSPIRATIONS,filters));
  const seen=useRef(batch.map(item=>item.id));
  const change=(key,value)=>{const next={...filters,[key]:value};setFilters(next);const nextBatch=filteredInspirationBatch(PLAN_INSPIRATIONS,next);seen.current=nextBatch.map(item=>item.id);setBatch(nextBatch);};
  const refresh=()=>{const current=batch.map(item=>item.id),remaining=pool.some(item=>!seen.current.includes(item.id));if(!remaining)seen.current=current;const next=filteredInspirationBatch(PLAN_INSPIRATIONS,filters,current,Math.random,3,seen.current);seen.current=[...new Set([...seen.current,...next.map(item=>item.id)])];setBatch(next);};
  const pool=filterInspirations(PLAN_INSPIRATIONS,filters);
  return <TogetherFold title={L('Co spolu zkusit','Something to try together')}><p>{L('Vyberte si podle dnešního času a chuti. Každý námět můžete upravit po svém.','Choose for the time and energy you have today. Make any idea your own.')}</p>
    <details className="tg-optional"><summary>{L('Vybrat podle nás','Choose what fits us')}</summary><fieldset style={{border:0,padding:0,margin:'18px 0'}}><legend>{L('Na co máme chuť','What we feel like')}</legend><p className="hint">{L('Můžete vybrat víc možností. Nápadům stačí odpovídat jedné z nich.','Choose more than one if you like. Ideas can match any selected theme.')}</p><div className="fields">{PLAN_THEMES.map(theme=><label className="tg-check" key={theme.id}><input type="checkbox" checked={filters.themes.includes(theme.id)} onChange={e=>change('themes',e.target.checked?[...filters.themes,theme.id]:filters.themes.filter(id=>id!==theme.id))}/>{theme[lang==='en'?'en':'cs']}</label>)}</div></fieldset>
    <fieldset style={{border:0,padding:0,margin:'18px 0'}}><legend>{L('Kde','Where')}</legend><div className="fields">{[['home','Doma','At home'],['outside','Venku','Outside'],['distance','Na dálku','Apart']].map(([value,cs,en])=><label className="tg-check" key={value}><input type="checkbox" checked={filters.contexts.includes(value)} onChange={e=>change('contexts',e.target.checked?[...filters.contexts,value]:filters.contexts.filter(place=>place!==value))}/>{L(cs,en)}</label>)}</div><p className="hint">{L('Vyberte klidně víc míst. Bez výběru hledáme kdekoli.','Choose more than one place if you like. With none selected, we look anywhere.')}</p></fieldset>
    <label>{L('Kolik času','Time available')}<select value={filters.minutes} onChange={e=>change('minutes',Number(e.target.value))}>{[15,30,60,120,240,480].map(n=><option key={n} value={n}>{n===240?L('Půlden · do 4 hodin','Half a day · up to 4 hours'):n===480?L('Celý den · do 8 hodin','A full day · up to 8 hours'):`${L('Do','Up to')} ${n} min`}</option>)}</select></label>
    <label>{L('Naše tempo','Our pace')}<select value={filters.energy} onChange={e=>change('energy',Number(e.target.value))}><option value={1}>{L('Jemně, jsme unavení','Gentle, we are tired')}</option><option value={2}>{L('Máme chuť něco podniknout','We feel like doing something')}</option><option value={3}>{L('Jsme otevření všemu','Open to anything')}</option></select></label>
    </details>
    <div className="tg-idea-windows" aria-live="polite" aria-atomic="true">{batch.length?batch.map((item,index)=><button type="button" className="tg-idea-window" key={item.id} onClick={()=>setOpened(item)} aria-haspopup="dialog"><svg viewBox="0 0 140 100" aria-hidden="true"><TogetherArtwork kind={['shared','shadow','ritual'][index%3]} x={20} y={6} width={100} height={86}/></svg><span>{local(item.title)}</span><small>{item.minutes<120?`${item.minutes} min`:`${Math.floor(item.minutes/60)} ${L('hod','hr')}${item.minutes%60?` ${item.minutes%60} min`:''}`}</small></button>):<p>{L('Pro tento výběr tu zatím nic není. Zkuste jiný čas nebo místo.','There are no ideas for this combination yet. Try another time or place.')}</p>}</div>
    {opened&&Sheet&&<Sheet title={local(opened.title)} onClose={()=>setOpened(null)}><div className="tm-together tg-idea-reading" style={togetherTheme(t)}><svg viewBox="0 0 280 180" aria-hidden="true"><TogetherArtwork kind="shared" x={60} y={8} width={160} height={160}/></svg><p className="hint">{opened.minutes} min</p><p>{local(opened.note)}</p><button type="button" className="primary" onClick={()=>{setOpened(null);onPlan({title:local(opened.title),date:dateKey(),time:opened.minutes>120?'10:00':'18:00',minutes:opened.minutes,note:local(opened.note)},{afterOverlay:true});}}>{L('Domluvit si to','Make a plan')}</button></div></Sheet>}

    <p className="hint">{L('Nápadů v tomto výběru','Ideas in this selection')}: {pool.length}</p>
    <button type="button" style={{marginTop:18}} disabled={pool.length<=batch.length} onClick={refresh}>{L('Zkusit jiné nápady','Show different ideas')}</button>
  </TogetherFold>;
}

export function FaceToFacePrompts({lang,embedded=false,question,onQuestionSelect,busy=false,locked=false,draftPending=false}){
  const L=(cs,en)=>lang==='en'?en:cs,local=value=>value[lang==='en'?'en':'cs'];
  const [prompt,setPrompt]=useState(()=>DAILY_CONNECTION_PROMPTS[0]);
  const selectedId=`connection-v1-${prompt.id}`;
  const choose=()=>onQuestionSelect?.(selectedId);
  const content=<><p className="tg-personal" aria-live="polite">{local(prompt.question)}</p><div className="row"><button type="button" onClick={()=>setPrompt(inspirationBatch(DAILY_CONNECTION_PROMPTS,[prompt.id],Math.random,1)[0])}>{L('Jiná otázka','Another question')}</button>{onQuestionSelect&&<button type="button" className="primary" disabled={busy||locked||draftPending||question?.id===selectedId} onClick={choose}>{question?.id===selectedId?L('Vybraná pro nás oba','Selected for both of us'):L('Použít pro nás oba','Use for both of us')}</button>}</div>
    {onQuestionSelect&&(locked||draftPending)&&<p className="hint">{draftPending?L('Nejdřív dokonči svou rozepsanou odpověď. Otázky si můžeš dál prohlížet.','Finish your draft first. You can keep browsing questions.'):L('K dnešní otázce už patří odpověď. Novou si zatím můžete vybrat jen pro rozhovor naživo.','Today’s question already has an answer. You can still choose another for a face-to-face conversation.')}</p>}
    <details className="tg-question-library"><summary>{L('Vybrat ze všech otázek','Choose from all questions')}</summary><div className="tg-question-options" role="radiogroup" aria-label={L('Otázka pro náš rozhovor','A question for our conversation')}>{DAILY_CONNECTION_PROMPTS.map(item=><label key={item.id} className="tg-check tg-question-option"><input type="radio" name="tg-live-question" checked={prompt.id===item.id} onChange={()=>setPrompt(item)}/><span>{local(item.question)}</span></label>)}</div></details></>;
  return embedded?<div className="tg-live-questions tg-embedded-content">{content}</div>:<details className="tg-optional tg-live-questions"><summary>{L('Další otázky naživo','More questions face to face')}</summary>{content}</details>;
}
