import React,{useEffect,useId,useRef,useState} from 'react';
import {cycleChoice} from '../product/togetherCycleChoices.js';
import {cyclePersonalText} from '../product/togetherCycleDepth.js';
import {TmIcon} from './icons.jsx';

export function CycleChoices({phase,topic,date,lang='cs',wording='neutral',role='client',onPlan}){
  const [offset,setOffset]=useState(0),[layer,setLayer]=useState('main'),[step,setStep]=useState(-1);
  const {item,index,total}=cycleChoice(phase,topic,date,offset),contentId=useId();
  const L=v=>lang==='en'?v[1]:cyclePersonalText(v[0],wording);
  const practiceRef=useRef(null),returnRef=useRef(null),reflectionRef=useRef(null),previousStep=useRef(-1);
  useEffect(()=>{
    if(step>=0)practiceRef.current?.focus();
    else if(previousStep.current>=0)(layer==='why'?reflectionRef:returnRef).current?.focus();
    previousStep.current=step;
  },[step,layer]);
  if(!item)return null;
  const food=topic==='food',ritual=topic==='ritual',steps=item.steps||[];
  const heading=L(food?['Jídlo a péče','Food and care']:ritual?['Malý rituál','A small ritual']:['Příběhy této fáze','Stories for this phase']);
  const move=delta=>{setOffset(v=>v+delta);setLayer('main');setStep(-1);};
  return <section className="tg-cycle-choices" aria-label={heading}>
    <style>{choiceStyles}</style>
    <div className="tg-choice-heading"><h3>{heading}</h3><div className="tg-choice-nav" role="group" aria-label={L(['Procházet možnosti','Browse suggestions'])}>
      <button type="button" onClick={()=>move(-1)} aria-controls={contentId} aria-label={L(['Předchozí možnost','Previous suggestion'])}><TmIcon id="back" size={15}/></button>
      <span aria-live="polite" aria-atomic="true">{index+1} / {total}</span>
      <button type="button" onClick={()=>move(1)} aria-controls={contentId} aria-label={L(['Další možnost','Next suggestion'])}><TmIcon id="forward" size={15}/></button>
    </div></div>
    <div id={contentId} key={item.id} className="tg-choice-leaf">
      <h4>{L(item.title)}</h4>
      {topic==='story'&&item.tradition&&<p className="tg-choice-duration">{L(item.tradition)}</p>}
      {ritual&&item.durationMinutes&&<p className="tg-choice-duration">{item.durationMinutes} {L(['min pro sebe','min for yourself'])}</p>}
      {step<0?<>
        <p className="tg-choice-core">{L(food?(role==='coach'?item.partnerWhy:item.why):item.text)}</p>
        <div className="tg-choice-tools">
          <button ref={reflectionRef} type="button" aria-expanded={layer==='why'} onClick={()=>setLayer(v=>v==='why'?'main':'why')}>{L(food?['Jak připravit','How to prepare']:['Co si z toho vzít','What to take with you'])}<TmIcon id={layer==='why'?'back':'forward'} size={13}/></button>
          {ritual&&steps.length>0&&<button ref={returnRef} type="button" onClick={()=>setStep(0)}>{L(['Projít krok za krokem','Walk through the steps'])}<TmIcon id="forward" size={13}/></button>}
        </div>
        {layer==='why'&&<div className="tg-choice-depth"><p>{L(food?item.text:item.why)}</p>{!food&&item.question&&<p className="tg-cycle-question">{L(item.question)}</p>}</div>}
      </>:<div className="tg-choice-practice">
        <div className="tg-choice-progress"><span>{L(['Krok','Step'])} {step+1} / {steps.length}</span><button type="button" onClick={()=>setStep(-1)}>{L(['Zpět k rituálu','Back to the ritual'])}</button></div>
        <p ref={practiceRef} tabIndex={-1} key={step} className="tg-choice-step" aria-live="polite">{L(steps[step])}</p>
        <div className="tg-choice-tools"><button type="button" disabled={step===0} onClick={()=>setStep(v=>v-1)}><TmIcon id="back" size={13}/>{L(['Zpět','Back'])}</button>{step<steps.length-1?<button type="button" onClick={()=>setStep(v=>v+1)}>{L(['Další krok','Next step'])}<TmIcon id="forward" size={13}/></button>:<button type="button" onClick={()=>{setStep(-1);setLayer('why');}}>{L(['Co si odnáším','What I am taking with me'])}<TmIcon id="forward" size={13}/></button>}</div>
      </div>}
      {onPlan&&food&&step<0&&<button className="tg-choice-plan" type="button" onClick={()=>onPlan(L(item.title))}>{L(['Navrhnout do plánů','Propose in Plans'])}<TmIcon id="forward" size={13}/></button>}
    </div>
  </section>;
}

const choiceStyles=`
.tm-together .tg-cycle-reading .tg-choice-duration{font:12px/1.5 var(--tm-font-body);color:var(--tg-muted);margin:-5px 0 12px}
.tm-together .tg-choice-heading{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:20px}
.tm-together .tg-choice-heading h3{margin:0;font-size:23px;line-height:1.2}
.tm-together .tg-choice-nav{display:flex;align-items:center;gap:0;flex-shrink:0;color:var(--tg-accent)}
.tm-together .tg-choice-nav button{border:0;background:transparent;padding:10px;min-height:44px;min-width:44px;display:grid;place-items:center;color:inherit}
.tm-together .tg-choice-nav span{font:12px var(--tm-font-body);font-variant-numeric:tabular-nums;min-width:34px;text-align:center;color:var(--tg-muted)}
.tm-together .tg-cycle-reading .tg-choice-leaf h4{font:28px/1.2 var(--tm-font-display);margin:0 0 15px;color:var(--tg-heading);text-wrap:balance}
.tm-together .tg-choice-leaf{animation:cycle-page-ink 240ms cubic-bezier(.16,1,.3,1)}
.tm-together .tg-choice-tools{display:flex;flex-wrap:wrap;gap:4px 22px;margin:16px 0 8px}
.tm-together .tg-choice-tools button,.tm-together .tg-choice-plan{display:inline-flex;align-items:center;gap:9px;border:0;background:transparent;padding:10px 0;min-height:44px;color:var(--tg-accent);font:14px/1.4 var(--tm-font-body);text-align:left}
.tm-together .tg-choice-tools button[aria-expanded=true]{text-decoration:underline;text-underline-offset:5px}
.tm-together .tg-choice-tools button:disabled{opacity:.45;cursor:default}
.tm-together .tg-choice-depth{padding:4px 0 8px;animation:cycle-page-ink 200ms ease}
.tm-together .tg-choice-progress{display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:12px;color:var(--tg-muted)}
.tm-together .tg-choice-progress button{background:none;border:0;min-height:44px;padding:6px 0;text-decoration:underline;text-underline-offset:4px;font-size:12px}
.tm-together .tg-cycle-reading .tg-choice-step{font:26px/1.4 var(--tm-font-display);min-height:4.2em;color:var(--tg-heading);animation:cycle-page-ink 200ms ease}
.tm-together .tg-choice-plan{margin-top:12px;font-family:var(--tm-font-tag);letter-spacing:.05em;text-transform:uppercase;font-size:12px}
@keyframes cycle-page-ink{from{opacity:.55;clip-path:inset(0 5% 0 0)}to{opacity:1;clip-path:inset(0)}}
@media(prefers-reduced-motion:reduce){.tm-together .tg-choice-leaf,.tm-together .tg-choice-depth,.tm-together .tg-choice-step{animation:none}}
@media(max-width:360px){.tm-together .tg-choice-heading{gap:4px}.tm-together .tg-choice-heading h3{font-size:21px}.tm-together .tg-choice-nav button{min-width:34px;padding:7px}}
`;
