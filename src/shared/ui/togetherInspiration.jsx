import React,{useState} from 'react';
import {dateKey} from '../product/together.js';
import {PLAN_INSPIRATIONS,DAILY_CONNECTION_PROMPTS} from '../product/togetherConnectionContent.js';
import {inspirationBatch,filterInspirations} from '../product/togetherInspiration.js';

export function TogetherInspiration({lang,onPlan}){
  const L=(cs,en)=>lang==='en'?en:cs,local=value=>value[lang==='en'?'en':'cs'];
  const [filters,setFilters]=useState({context:'all',minutes:120,energy:3});
  const [batch,setBatch]=useState(()=>inspirationBatch(PLAN_INSPIRATIONS));
  const change=(key,value)=>{const next={...filters,[key]:value};setFilters(next);setBatch(inspirationBatch(filterInspirations(PLAN_INSPIRATIONS,next)));};
  const pool=filterInspirations(PLAN_INSPIRATIONS,filters);
  return <section className="tm-together-section"><h2>{L('Co spolu zkusit','Something to try together')}</h2><p>{L('Vyberte si podle dnešního času a chuti. Každý námět můžete upravit po svém.','Choose for the time and energy you have today. Make any idea your own.')}</p>
    <div className="fields"><label>{L('Kde','Where')}<select value={filters.context} onChange={e=>change('context',e.target.value)}><option value="all">{L('Kdekoli','Anywhere')}</option><option value="home">{L('Doma','At home')}</option><option value="outside">{L('Venku','Outside')}</option><option value="distance">{L('Na dálku','Apart')}</option></select></label><label>{L('Kolik času','Time available')}<select value={filters.minutes} onChange={e=>change('minutes',Number(e.target.value))}>{[15,30,60,120].map(n=><option key={n} value={n}>{L('Do','Up to')} {n} min</option>)}</select></label></div>
    <label>{L('Naše tempo','Our pace')}<select value={filters.energy} onChange={e=>change('energy',Number(e.target.value))}><option value={1}>{L('Jemně, jsme unavení','Gentle, we are tired')}</option><option value={2}>{L('Máme chuť něco podniknout','We feel like doing something')}</option><option value={3}>{L('Jsme otevření všemu','Open to anything')}</option></select></label>
    <div aria-live="polite" aria-atomic="true">{batch.length?batch.map(item=><article className="item" key={item.id}><h3>{local(item.title)}</h3><p className="hint">{item.minutes} min</p><p>{local(item.note)}</p><button type="button" onClick={()=>onPlan({title:local(item.title),date:dateKey(),time:'18:00',minutes:item.minutes,note:local(item.note)})}>{L('Domluvit si to','Make a plan')}</button></article>):<p>{L('Pro tento výběr tu zatím nic není. Zkuste jiný čas nebo místo.','There are no ideas for this combination yet. Try another time or place.')}</p>}</div>
    <button type="button" style={{marginTop:18}} disabled={pool.length<=batch.length} onClick={()=>setBatch(inspirationBatch(pool,batch.map(i=>i.id)))}>{L('Zkusit jiné nápady','Show different ideas')}</button>
  </section>;
}

export function FaceToFacePrompts({lang}){
  const L=(cs,en)=>lang==='en'?en:cs,local=value=>value[lang==='en'?'en':'cs'];
  const [prompt,setPrompt]=useState(()=>DAILY_CONNECTION_PROMPTS[0]);
  return <details className="tg-optional"><summary>{L('Další otázky naživo','More questions face to face')}</summary><p>{L('Jen pro váš rozhovor. Nemění uloženou otázku dne. Kteroukoli otázku můžete přeskočit.','For your conversation. This does not change the saved question of the day. Skip any question you wish.')}</p><p className="tg-personal" aria-live="polite">{local(prompt.question)}</p><div className="row"><button type="button" onClick={()=>setPrompt(inspirationBatch(DAILY_CONNECTION_PROMPTS,[prompt.id],Math.random,1)[0])}>{L('Jiná otázka','Another question')}</button></div><details><summary>{L('Prohlédnout všechny otázky','Browse all questions')}</summary><ol>{DAILY_CONNECTION_PROMPTS.map(item=><li key={item.id}>{local(item.question)}</li>)}</ol></details></details>;
}
