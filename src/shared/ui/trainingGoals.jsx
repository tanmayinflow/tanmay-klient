import React from 'react';
import {milestoneProgress,publicMilestones} from '../../training/delivery.js';
import {L} from '../lang/lang.js';
import {FONT_BODY} from './type.js';

export function TrainingGoals({t,plans,sessions}) {
  const items=(plans||[]).flatMap(p=>publicMilestones(p.milestones).filter(g=>g.label).map(g=>({p,g,progress:milestoneProgress(g,sessions,p.id)})));
  if(!items.length)return null;
  return <section aria-label={L('Cíle tréninku','Training goals')} style={{fontFamily:FONT_BODY,color:t.textSec,fontSize:13,lineHeight:1.65,margin:'18px 0'}}>
    <h3>{L('Kam směřujeme','Where we are heading')}</h3>
    {items.map(({p,g,progress})=>{
      const unit=g.metric==='weight'?'kg':g.metric==='durationSec'?'s':L('opakování','repetitions');
      return <div key={p.id+g.id} style={{borderBottom:`1px solid ${t.borderSoft}`,padding:'12px 0'}}>
        <strong style={{color:t.heading}}>{g.label}</strong>
        <div>{L('Výchozí','Baseline')}: {g.baseline??'—'} · {L('Naposledy','Latest')}: {progress.latest??'—'} · {L('Cíl','Target')}: {g.target??'—'} {unit}</div>
        <div>{progress.date?L('Nejlepší srovnatelná série z','Best comparable set on')+' '+progress.date:L('Čekáme na první srovnatelný záznam.','Waiting for a comparable training record.')}</div>
        {g.load!=null?<div>{L('Při stejné zátěži','At the same load')}: {g.load} kg</div>:null}
        {g.metric==='weight'?<div>{L('Alespoň','At least')} {g.minReps||1} {L('opakování','repetitions')}</div>:null}
        {g.reviewDate?<div>{L('Společná kontrola','Review together')}: {g.reviewDate}</div>:null}
        {progress.reached?<div style={{color:t.accent}}>{L('Cílová hodnota zaznamenána. Potvrďte techniku při společné kontrole.','Target value recorded. Confirm technique at the review.')}</div>:null}
      </div>;
    })}
  </section>;
}
