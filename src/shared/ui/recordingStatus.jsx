import React,{useEffect,useState} from 'react';
export function RecordingStatus({state,onStop,onCancel,t,lang='cs'}){
  const [tick,setTick]=useState(Date.now());
  useEffect(()=>{if(state?.phase!=='recording')return;setTick(Date.now());const id=setInterval(()=>setTick(Date.now()),500);return()=>clearInterval(id);},[state?.phase,state?.startedAt]);
  if(!state)return null;
  const L=(cs,en)=>lang==='en'?en:cs, recording=state.phase==='recording', seconds=Math.max(0,Math.floor((tick-state.startedAt)/1000));
  const button={background:'transparent',border:`1px solid ${t.border}`,color:t.text,borderRadius:6,minHeight:44,padding:'7px 10px',font:'inherit',cursor:'pointer'};
  return <div className="tm-recording-status" style={{background:t.card,color:t.text,border:`1px solid ${t.accent}`,borderRadius:12,padding:'10px 12px',fontFamily:'var(--ff-body,sans-serif)',fontSize:13,boxShadow:t.shadowLift}}>
    <style>{`@keyframes tm-recording-breathe{50%{opacity:.35}}.tm-recording-dot{animation:tm-recording-breathe 1.2s ease-in-out infinite}@media(prefers-reduced-motion:reduce){.tm-recording-dot{animation:none}}`}</style>
    <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:recording?8:0}}>
      <span aria-hidden="true" className={recording?'tm-recording-dot':undefined} style={{width:10,height:10,borderRadius:'50%',background:t.accent,flexShrink:0}}/>
      <strong role="status">{recording?L('Nahrávám hlas','Recording your voice'):state.phase==='saving'?L('Ukládám nahrávku…','Saving recording…'):L('Čekám na mikrofon…','Waiting for microphone…')}</strong>
      {recording&&<span aria-label={L('Délka nahrávky','Recording duration')} style={{marginLeft:'auto',fontVariantNumeric:'tabular-nums'}}>{Math.floor(seconds/60)}:{String(seconds%60).padStart(2,'0')}</span>}
    </div>
    {state.phase!=='saving'&&<div style={{display:'flex',gap:8,flexWrap:'wrap'}}>{recording&&<button type="button" onClick={onStop} style={button}>{L('Zastavit a vložit','Stop and insert')}</button>}<button type="button" onClick={onCancel} style={{...button,borderColor:'transparent'}}>{L('Zrušit','Cancel')}</button></div>}
  </div>;
}
