import React,{useState} from 'react';
export function createAllDayEvents({useT,useStore,L,uid,shiftISO}){
  return function AllDayEvents({date}){
    const {t}=useT(),st=useStore(),[draft,setDraft]=useState('');
    const rows=(st.coll.calendarAllDay||[]).filter(r=>!r.deleted&&r.start<=date&&r.end>date);
    const change=(id,patch)=>st.setCalendarAllDay(old=>old.map(r=>r.id===id?{...r,...patch,rev:uid()}:r));
    const style={fontFamily:'var(--tm-font-body)',fontSize:14,color:t.text,background:'transparent',border:0,minHeight:44};
    const add=()=>{if(!draft.trim())return;st.setCalendarAllDay(old=>[...old,{id:uid(),title:draft.trim(),start:date,end:shiftISO(date,1),rev:uid()}]);setDraft('')};
    return <section aria-label={L('Celodenní události','All-day events')} style={{marginTop:18,borderTop:'1px solid '+t.borderSoft,paddingTop:12}}>
      <div style={{fontFamily:'var(--tm-font-tag)',fontSize:13,fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase'}}>{L('Celý den','All day')}</div>
      {rows.map(r=><div key={r.id} style={{borderBottom:'1px solid '+t.borderSoft}}>
        <div style={{display:'flex',gap:8,alignItems:'center'}}><input key={r.id+':'+r.title} aria-label={L('Celodenní událost','All-day event')} defaultValue={r.title} readOnly={r.readOnly} onBlur={e=>{const v=e.target.value.trim();if(v&&v!==r.title)change(r.id,{title:v})}} style={{...style,flex:1,minWidth:0}}/>
        {!r.readOnly&&<button aria-label={L('Odebrat událost','Remove event')} style={{...style,minWidth:44,cursor:'pointer'}} onClick={()=>st.ask(L('Odebrat událost i z propojeného kalendáře?','Remove the event from the connected calendar too?'),()=>change(r.id,{deleted:true}),{soft:true})}>×</button>}</div>
        {r.conflict&&<div style={{fontSize:12,paddingBottom:10}}>{L('Událost se změnila také v kalendáři.','The event also changed in your calendar.')}{!r.conflict.pending&&<><button style={style} onClick={()=>change(r.id,{...r.conflict,id:r.id,conflict:null})}>{L('Použít kalendář','Use calendar')}</button><button style={style} onClick={()=>change(r.id,{base:r.conflict.base,etag:r.conflict.etag,conflict:null})}>{L('Použít tento zápis','Use this entry')}</button></>}</div>}
      </div>)}
      <form onSubmit={e=>{e.preventDefault();add()}} style={{display:'flex',gap:8}}><input aria-label={L('Nová celodenní událost','New all-day event')} value={draft} onChange={e=>setDraft(e.target.value)} placeholder={L('Nová celodenní událost…','New all-day event…')} style={{...style,flex:1,minWidth:0}}/><button type="submit" disabled={!draft.trim()} style={{...style,minWidth:44,cursor:'pointer'}}>+</button></form>
    </section>;
  };
}
