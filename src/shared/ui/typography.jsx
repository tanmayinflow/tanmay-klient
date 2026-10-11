import React, {useRef} from 'react';
import {TmIcon} from './icons.jsx';
import {TYPOGRAPHY_PRESETS,normalizeTypography,typographyPreset} from './typography.js';

export function TypographyChoice({value,onChange,t,lang='cs'}){
  const selected=normalizeTypography(value),refs=useRef([]),L=(cs,en)=>lang==='en'?en:cs;
  const current=TYPOGRAPHY_PRESETS.findIndex(p=>p.id===selected);
  function move(event){
    let next;
    if(['ArrowRight','ArrowDown'].includes(event.key))next=(current+1)%TYPOGRAPHY_PRESETS.length;
    else if(['ArrowLeft','ArrowUp'].includes(event.key))next=(current+TYPOGRAPHY_PRESETS.length-1)%TYPOGRAPHY_PRESETS.length;
    else if(event.key==='Home')next=0;
    else if(event.key==='End')next=TYPOGRAPHY_PRESETS.length-1;
    else return;
    event.preventDefault();onChange(TYPOGRAPHY_PRESETS[next].id);refs.current[next]?.focus();
  }
  return <div className="tm-typography-choice" style={{padding:'8px 8px 22px'}}>
    <h3 style={{fontFamily:'var(--tm-font-body)',fontSize:16,fontWeight:500,margin:'0 0 7px',color:t.text}}>{L('Písmo','Typography')}</h3>
    <p style={{fontFamily:'var(--tm-font-body)',fontSize:13,lineHeight:1.55,margin:'0 0 16px',color:t.textSec}}>{L('Vyber sestavu pro nadpisy, ovládání a poznámky. Ukládá se k tvému účtu.','Choose a set for headings, controls and notes. It is saved with your account.')}</p>
    <div role="radiogroup" aria-label={L('Sestava písma','Typography set')} onKeyDown={move} style={{display:'grid',gap:12}}>
      {TYPOGRAPHY_PRESETS.map((item,index)=>{
        const p=typographyPreset(item.id,lang),on=item.id===selected,name=L(p.labelCs,p.labelEn);
        return <button type="button" role="radio" aria-checked={on} aria-label={name} key={p.id} data-typography={p.id} tabIndex={on?0:-1} ref={el=>{refs.current[index]=el;}} onClick={()=>onChange(p.id)}
          style={{textAlign:'left',width:'100%',minWidth:0,cursor:'pointer',padding:'15px 16px',borderRadius:14,border:`1px solid ${on?t.accentInk||t.accent:t.borderSoft}`,background:'transparent',color:t.text,boxSizing:'border-box'}}>
          <span style={{display:'flex',alignItems:'center',gap:8,marginBottom:9,fontFamily:'var(--tm-font-body)',fontSize:13,lineHeight:1.4}}>
            <span style={{fontWeight:500}}>{name}</span>{p.id==='original'&&<span style={{fontSize:12,color:t.textMuted}}>{L('výchozí','default')}</span>}
            <span style={{marginLeft:'auto',width:18,height:18,flexShrink:0,color:t.accentInk||t.accent}}>{on&&<TmIcon id="check" size={18}/>}</span>
          </span>
          <span className="tm-type-preview" style={{display:'block',fontFamily:p.display,fontSize:27,lineHeight:1.18,fontWeight:400,marginBottom:7,textWrap:'balance'}}>{L('Prostor pro tvoje slova','Room for your words')}</span>
          <span className="tm-type-preview" style={{display:'block',fontFamily:p.reading,fontSize:16,lineHeight:1.55}}>{L('Dnešní řádky, myšlenky a drobné příběhy.','Today’s notes, thoughts and small stories.')}</span>
          <span style={{display:'block',fontFamily:p.body,fontSize:12,lineHeight:1.5,marginTop:10,color:t.textSec}}>{L(p.descriptionCs,p.descriptionEn)}</span>
          <span style={{display:'block',fontFamily:'var(--tm-font-body)',fontSize:11,lineHeight:1.5,marginTop:3,color:t.textMuted}}>{L(p.creditCs,p.creditEn)}</span>
        </button>;
      })}
    </div>
  </div>;
}
