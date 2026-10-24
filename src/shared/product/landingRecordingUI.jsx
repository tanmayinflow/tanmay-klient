import {AXIS_COPY,VALUE_COPY,SIDE_COPY,sideOptions,countCopy,projectParameters} from './landingRecordingUiBridge.js';

// Narrow native UI extension; fonts, colors and numeric input come from the app.
export function createLandingRecordingUI({React,useT,L,TL,FONT_BODY,TvNumInput,tvQuiet,bridge,client=false}){
 const text=(pair)=>TL(pair);
 const shape=s=>JSON.stringify([s?.side??null,s?.executionChoice??null]);
 function Fields({spec,parameters,onChange,disabled=false}){
  const {t}=useT(),control={background:t.inputBg||'transparent',color:t.text,fontFamily:FONT_BODY,fontSize:16,minHeight:44,maxWidth:'100%',border:`1px solid ${t.borderSoft}`,borderRadius:8,padding:'8px 10px'};
  const select=(name,label,options,value,change)=><label key={name} style={{display:'flex',flexDirection:'column',gap:4,minWidth:0,maxWidth:'100%',fontFamily:FONT_BODY,fontSize:13,color:t.textSec}}>{text(label)}<select aria-label={text(label)} value={value??''} disabled={disabled} onChange={e=>change(e.target.value)} style={control}><option value="">{L('Vyber','Choose')}</option>{options.map(([value,label])=><option key={value} value={value}>{text(label)}</option>)}</select></label>;
  return <div style={{display:'flex',flexWrap:'wrap',gap:10,alignItems:'flex-end',width:'100%',minWidth:0}}>
   {spec.sideMode==='perSide'?select('side',SIDE_COPY[spec.convention.sideMeaning],Object.entries(sideOptions(spec)),parameters.side,side=>onChange({...parameters,side:side||null})):null}
   {Object.entries(spec.axes).map(([key,values])=>select(key,AXIS_COPY[key],values.map(value=>[value,VALUE_COPY[value]]),parameters.fields[key],value=>onChange({...parameters,fields:{...parameters.fields,[key]:value}})))}
   {Object.entries(spec.numbers).map(([key,rule])=><label key={key} style={{display:'flex',flexDirection:'column',gap:4,fontFamily:FONT_BODY,fontSize:13,color:t.textSec}}>{text(AXIS_COPY[key])}<TvNumInput aria-label={text(AXIS_COPY[key])} value={parameters.fields[key]??null} disabled={disabled} onChange={value=>onChange({...parameters,fields:{...parameters.fields,[key]:value}})} style={{...control,width:130}}/>{rule.integer?<span style={{fontSize:12}}>{L('Celý počet, nejméně 2.','Whole number, at least 2.')}</span>:null}</label>)}
  </div>;
 }
 function Notice({st,block,policy}){
  const {t}=useT(),v=bridge.view(st,block,block?.sets?.[0]);let pair;
  if(v.kind==='invalid')pair=client?['Způsob zápisu tohoto cviku není rozpoznán. Požádej trenéra o nový předpis. Dosavadní výsledky zůstávají uložené.','This recording setup is not recognized. Ask your coach for a new prescription. Existing results remain saved.']:['Způsob zápisu tohoto cviku není rozpoznán. Přidej novou položku v šabloně. Dosavadní výsledky zůstávají uložené.','This recording setup is not recognized. Add a new exercise block in the template. Existing results remain saved.'];
  else if(v.kind==='declared')pair=countCopy(v.spec);
  else if(v.kind==='legacy')pair=['Původní zápis. Počty a označení L/P zůstávají v původním významu.','Original record. Counts and L/R labels retain their original meaning.'];
  else if(policy?.noAutomaticTargetHeight)pair=['Výšku zapisuj jen podle skutečného měření. Cílová výška se nevyplňuje jako výsledek.','Record height only from an actual measurement. Target height is not entered as a result.'];
  if(!pair)return null;
  return <p role={v.kind==='invalid'?'status':undefined} style={{margin:0,fontFamily:FONT_BODY,fontSize:13,lineHeight:1.5,color:t.textSec,overflowWrap:'anywhere'}}>{text(pair)}</p>;
 }
 function SetParameters({st,block,set,onChange,disabled=false}){
  const {t}=useT(),v=bridge.view(st,block,set),spec=v.spec;
  const [draft,setDraft]=React.useState(()=>spec?bridge.parameters(spec,set):null),last=React.useRef(shape(set)),pending=React.useRef(null);
  const current=shape(set);
  React.useEffect(()=>{if(current!==last.current){last.current=current;if(current!==pending.current)setDraft(spec?bridge.parameters(spec,set):null);pending.current=null;}},[current,spec]);
  if(v.kind!=='declared'||!spec)return null;
  const p=draft||bridge.parameters(spec,set),hasFields=spec.sideMode==='perSide'||Object.keys(spec.axes).length||Object.keys(spec.numbers).length;
  if(!hasFields)return null;
  const change=next=>{setDraft(next);pending.current=shape(projectParameters(spec,next));onChange(next);};
  const labels=[];if(spec.sideMode==='perSide'&&p.side)labels.push(text(SIDE_COPY[spec.convention.sideMeaning])+': '+text(sideOptions(spec)[p.side]));
  for(const key of Object.keys(spec.axes))if(VALUE_COPY[p.fields[key]])labels.push(text(AXIS_COPY[key])+': '+text(VALUE_COPY[p.fields[key]]));
  for(const key of Object.keys(spec.numbers))if(p.fields[key]!=null)labels.push(text(AXIS_COPY[key])+': '+p.fields[key]);
  if(disabled||!v.mutable)return <span style={{fontFamily:FONT_BODY,fontSize:12,lineHeight:1.5,color:t.textSec,overflowWrap:'anywhere'}}>{labels.join(' · ')||L('Provedení není určené.','Execution is unspecified.')}</span>;
  return <details open={!v.ready||undefined} style={{width:'100%',minWidth:0,fontFamily:FONT_BODY,fontSize:13,color:t.textSec}}><summary style={{cursor:'pointer',minHeight:32,lineHeight:1.5}}>{v.ready?labels.join(' · '):L('Doplň provedení série','Choose the set execution')}</summary><div style={{paddingTop:6}}><Fields spec={spec} parameters={p} onChange={change}/></div></details>;
 }
 function NewBlock({st,block,onAccept,onCancel}){
  const {t}=useT(),spec=bridge.newSpec(st,block),[p,setP]=React.useState(()=>spec?bridge.parameters(spec,null):null);
  if(!spec)return null;
  const ready=!!bridge.confirm(st,block,p);
  const submit=()=>{const accepted=bridge.confirm(st,block,p);if(accepted)onAccept(accepted);};
  return <div style={{display:'flex',flexDirection:'column',gap:10,padding:'14px 0',borderTop:`1px solid ${t.borderSoft}`,fontFamily:FONT_BODY,color:t.text,minWidth:0}}>
   <strong style={{fontSize:15,fontWeight:500}}>{text(block.name)}</strong>
   <p style={{margin:0,fontSize:13,lineHeight:1.5,color:t.textSec}}>{text(countCopy(spec))}</p>
   <Fields spec={spec} parameters={p} onChange={setP}/>
   {(spec.sideMode==='perSide'||Object.keys(spec.axes).length||Object.keys(spec.numbers).length)&&block.sets.length>1?<p style={{margin:0,fontSize:12,lineHeight:1.5,color:t.textSec}}>{L('Volba platí pro všechny nové série. Každou můžeš následně upravit.','This choice applies to every new set. You can then adjust each one.')}</p>:null}
   <div style={{display:'flex',gap:8,flexWrap:'wrap'}}><button type="button" onClick={submit} disabled={!ready} style={{...tvQuiet(t),minHeight:44,opacity:ready?1:0.5}}>{L('Přidat cvik','Add exercise')}</button><button type="button" onClick={onCancel} style={{...tvQuiet(t),minHeight:44}}>{L('Zrušit','Cancel')}</button></div>
  </div>;
 }
 return {TvLandingNotice:Notice,TvLandingSet:SetParameters,TvLandingNewBlock:NewBlock};
}
