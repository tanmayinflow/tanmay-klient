import React, { createContext, useContext, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { TmIcon } from './icons.jsx';
import { useVrstva } from './overlay.jsx';
import { makeTheme } from './theme.js';
import { L as defaultL } from '../lang/lang.js';
import { dateAllowed, displayDate, monthDays, parseDateText, shiftDate, validDate } from '../product/dateField.js';

export const DateFieldContext = createContext(null);
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
const clamp = (date, min, max) => validDate(min) && date < min ? min : validDate(max) && date > max ? max : date;

function Calendar({ anchor, value, min, max, required, choose, close, t, L, label, id }) {
  const panel = useRef(null);
  const [active, setActive] = useState(() => clamp(validDate(value) ? value : today(), min, max));
  const [month, setMonth] = useState(active.slice(0,7));
  const [position, setPosition] = useState(null);
  const locale = L('cs-CZ','en-GB');
  const monthLabel = new Intl.DateTimeFormat(locale,{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(month+'-01T12:00:00Z'));
  useVrstva({ close, ref: panel, zamek: false });
  useLayoutEffect(() => {
    const place = () => {
      const r = anchor.current.getBoundingClientRect(), vv = window.visualViewport;
      const left = vv?.offsetLeft || 0, top = vv?.offsetTop || 0;
      const w = vv?.width || window.innerWidth, h = vv?.height || window.innerHeight;
      const width = Math.min(336,w-24), height = Math.min(432,h-24);
      setPosition({left:Math.max(left+12,Math.min(r.left,left+w-width-12)),top:Math.max(top+12,Math.min(r.bottom+6,top+h-height-12)),width,maxHeight:height});
    };
    place(); window.addEventListener('resize',place); window.addEventListener('scroll',place,true);
    window.visualViewport?.addEventListener('resize',place); window.visualViewport?.addEventListener('scroll',place);
    return () => { window.removeEventListener('resize',place); window.removeEventListener('scroll',place,true); window.visualViewport?.removeEventListener('resize',place); window.visualViewport?.removeEventListener('scroll',place); };
  },[anchor]);
  const positioned = !!position;
  useEffect(() => {
    if (positioned) panel.current?.querySelector(`[data-date="${active}"]`)?.focus();
  },[active,month,positioned]);
  useEffect(() => {
    const outside = e => { if (!panel.current?.contains(e.target) && !anchor.current?.contains(e.target)) close(); };
    document.addEventListener('pointerdown',outside);
    return () => document.removeEventListener('pointerdown',outside);
  },[close,anchor]);
  function move(date) { const next = clamp(date,min,max); setActive(next); setMonth(next.slice(0,7)); }
  function keys(e) {
    const offset = (new Date(active+'T12:00:00Z').getUTCDay()+6)%7;
    const days = {ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7,Home:-offset,End:6-offset};
    if (e.key in days) { e.preventDefault(); move(shiftDate(active,days[e.key])); }
    if (e.key === 'PageUp' || e.key === 'PageDown') { e.preventDefault(); move(shiftDate(active,0,(e.key==='PageUp'?-1:1)*(e.shiftKey?12:1))); }
  }
  const button = {background:'transparent',color:t.text,border:`1px solid ${t.borderSoft}`,borderRadius:8,minHeight:40,padding:'6px 9px',cursor:'pointer',font:'inherit'};
  const prev = shiftDate(month+'-01',0,-1), next = shiftDate(month+'-01',0,1);
  const cells = monthDays(month);
  const changeYear = raw => { const year=Number(raw); if(year>=1&&year<=9999)move(shiftDate(active,0,(year-Number(active.slice(0,4)))*12)); };
  return createPortal(<div ref={panel} id={id} role="dialog" aria-modal="true" aria-label={`${L('Vybrat datum','Choose date')}: ${label}`}
    className="tm-date-panel" onClick={e=>e.stopPropagation()} style={{position:'fixed',...position,visibility:position?'visible':'hidden',zIndex:10020,boxSizing:'border-box',overflowY:'auto',overscrollBehavior:'contain',padding:12,background:t.bg,color:t.text,border:`1px solid ${t.border}`,borderRadius:12,boxShadow:t.shadowSheet,fontFamily:'var(--tm-font-body)',fontSize:14}}>
    <style>{`.tm-date-panel button:focus-visible,.tm-date-field input:focus-visible,.tm-date-field button:focus-visible{outline:2px solid ${t.accentInk||t.accent};outline-offset:2px}.tm-date-panel button:disabled{opacity:.35;cursor:default}.tm-date-panel button:not(:disabled):hover{background:${t.card}}`}</style>
    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
      <button type="button" style={button} aria-label={L('Předchozí měsíc','Previous month')} disabled={validDate(min)&&prev.slice(0,7)<min.slice(0,7)} onClick={()=>move(shiftDate(active,0,-1))}><TmIcon id="back" size={16}/></button>
      <div id={`${id}-month`} aria-live="polite" style={{flex:1,textAlign:'center',fontFamily:'var(--tm-font-display)',fontSize:20}}>{monthLabel}</div>
      <button type="button" style={button} aria-label={L('Další měsíc','Next month')} disabled={validDate(max)&&next.slice(0,7)>max.slice(0,7)} onClick={()=>move(shiftDate(active,0,1))}><TmIcon id="forward" size={16}/></button>
    </div>
    <label style={{display:'flex',justifyContent:'center',alignItems:'center',gap:8,marginBottom:8,color:t.textSec,fontSize:12}}>{L('Rok','Year')}<input type="number" aria-label={L('Rok kalendáře','Calendar year')} min={validDate(min)?+min.slice(0,4):1} max={validDate(max)?+max.slice(0,4):9999} key={month.slice(0,4)} defaultValue={+month.slice(0,4)} onBlur={e=>changeYear(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();changeYear(e.currentTarget.value);}}} style={{width:76,minHeight:36,boxSizing:'border-box',background:t.card,color:t.text,border:`1px solid ${t.border}`,borderRadius:6,padding:'4px 8px',font:'inherit'}}/></label>
    <table role="grid" aria-labelledby={`${id}-month`} style={{width:'100%',tableLayout:'fixed',borderCollapse:'collapse'}}>
      <thead><tr>{Array.from({length:7},(_,i)=>{const d=new Date(`2024-01-0${i+1}T12:00:00Z`);return <th key={i} scope="col" abbr={new Intl.DateTimeFormat(locale,{weekday:'long',timeZone:'UTC'}).format(d)} style={{fontWeight:400,color:t.textSec,fontSize:12,paddingBottom:4}}>{new Intl.DateTimeFormat(locale,{weekday:'short',timeZone:'UTC'}).format(d)}</th>;})}</tr></thead>
      <tbody>{Array.from({length:6},(_,week)=><tr key={week}>{cells.slice(week*7,week*7+7).map(date=><td key={date} aria-selected={date===value} style={{padding:1}}><button type="button" data-date={date} tabIndex={date===active?0:-1} disabled={!dateAllowed(date,min,max)} onKeyDown={keys} onFocus={()=>setActive(date)} onClick={()=>choose(date)} aria-current={date===today()?'date':undefined} aria-label={new Intl.DateTimeFormat(locale,{dateStyle:'full',timeZone:'UTC'}).format(new Date(date+'T12:00:00Z'))} style={{...button,width:'100%',padding:0,minHeight:38,borderColor:date===value?t.accent:date===today()?t.border:'transparent',background:date===value?t.card:'transparent',color:date.slice(0,7)===month?t.text:t.textMuted,fontWeight:date===value?600:400}}>{Number(date.slice(8))}</button></td>)}</tr>)}</tbody>
    </table>
    <div style={{display:'flex',justifyContent:'space-between',gap:6,marginTop:8,borderTop:`1px solid ${t.borderSoft}`,paddingTop:8}}>
      <button type="button" style={button} disabled={!dateAllowed(today(),min,max)} onClick={()=>choose(today())}>{L('Dnes','Today')}</button>
      {!required&&<button type="button" style={button} onClick={()=>choose('')}>{L('Bez data','Clear date')}</button>}
      <button type="button" style={button} onClick={close}>{L('Zavřít','Close')}</button>
    </div>
  </div>,document.body);
}

// Native text validation is retained; dates stored by callers remain ISO strings.
export function DateField({ value='', onChange, onInput, onBlur, onKeyDown, type: _type, style, className='', min, max, required, disabled, readOnly, name, id: suppliedId, ...props }) {
  const {t,L} = useContext(DateFieldContext) || {t:makeTheme('light'),L:defaultL};
  const generatedId=useId(), id=suppliedId||generatedId, anchor=useRef(null), input=useRef(null);
  const [draft,setDraft]=useState(()=>displayDate(value)), [open,setOpen]=useState(false);
  useEffect(()=>setDraft(displayDate(value)),[value]);
  const parsed=parseDateText(draft);
  const error=parsed===null?L('Zadej platné datum ve formátu DD.MM.RRRR.','Enter a valid date as DD.MM.YYYY.') : parsed && !dateAllowed(parsed,min,max)?L('Datum je mimo povolený rozsah.','Date is outside the allowed range.'):'';
  useLayoutEffect(()=>{input.current?.setCustomValidity(error);},[error]);
  const eventFor=(iso,event)=>({target:{value:iso,name},currentTarget:{value:iso,name,blur:()=>input.current?.blur()},nativeEvent:event?.nativeEvent,preventDefault:()=>event?.preventDefault(),stopPropagation:()=>event?.stopPropagation()});
  const emit=(iso,event)=>{const e=eventFor(iso,event);onInput?.(e);onChange?.(e);};
  const close=()=>{setOpen(false);input.current?.focus({preventScroll:true});};
  const choose=iso=>{setDraft(displayDate(iso));emit(iso);close();};
  const label=props['aria-label']||props.title||L('Datum','Date');
  const {onClick,...rest}=props;
  const field={background:t.card,color:t.text,border:`1px solid ${t.border}`,borderRadius:8,fontFamily:'var(--tm-font-body)',fontSize:14,minHeight:40,padding:'8px 10px',boxSizing:'border-box',...style};
  return <span ref={anchor} className={`tm-date-field ${className}`} style={{display:'inline-flex',position:'relative',alignItems:'center',maxWidth:'100%',minWidth:0,width:style?.width||'100%',...Object.fromEntries(Object.entries(style||{}).filter(([key])=>['maxWidth','minWidth','margin','marginTop','marginBottom','marginLeft','marginRight','position','inset','opacity','height','flex','flexShrink'].includes(key)))}}>
    <input {...rest} ref={input} id={id} type="text" inputMode="numeric" autoComplete="off" placeholder={L("dd.mm.rrrr","dd.mm.yyyy")} value={draft} required={required} disabled={disabled} readOnly={readOnly} aria-haspopup="dialog" aria-expanded={open} aria-controls={open?`${id}-calendar`:undefined} aria-invalid={error?true:undefined} style={{...field,width:'100%',maxWidth:'100%',margin:0,paddingRight:36}}
      onClick={e=>{onClick?.(e);if(!disabled&&!readOnly)setOpen(true);}}
      onKeyDown={e=>{if(e.key==='ArrowDown'&&!disabled&&!readOnly){e.preventDefault();setOpen(true);}else onKeyDown?.(e);}}
      onChange={e=>{setDraft(e.target.value);const iso=parseDateText(e.target.value);if(iso!==null&&(!iso||dateAllowed(iso,min,max)))emit(iso,e);}}
      onBlur={e=>{if(parsed!==null&&(!parsed||dateAllowed(parsed,min,max)))onBlur?.(eventFor(parsed,e));}}/>
    {name&&<input type="hidden" name={name} value={value} disabled={disabled}/>}
    <button type="button" aria-label={`${L('Vybrat datum','Choose date')}: ${label}`} aria-haspopup="dialog" aria-expanded={open} disabled={disabled||readOnly} onClick={()=>setOpen(x=>!x)} style={{position:'absolute',right:1,top:1,bottom:1,width:34,padding:0,display:'grid',placeItems:'center',border:0,borderRadius:7,background:'transparent',color:t.text,cursor:disabled||readOnly?'default':'pointer'}}><TmIcon id="calendar" size={17}/></button>
    {open&&!disabled&&!readOnly&&<Calendar {...{anchor,value,min,max,required,choose,close,t,L,label}} id={`${id}-calendar`}/>}
  </span>;
}
