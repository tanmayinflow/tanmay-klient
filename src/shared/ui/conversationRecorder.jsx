import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRecordingDraftStore } from '../product/recordingDrafts.js';
import { createVoiceRecorder } from '../product/voiceRecorder.js';
import { createConversationTranscriber, transcriptText } from '../product/conversationTranscript.js';
import { createScreenWakeController } from './screenWake.js';

const secondsLabel = seconds => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2,'0')}`;
function download(blob, name) {
  const url = URL.createObjectURL(blob), anchor = document.createElement('a');
  anchor.href = url; anchor.download = name; anchor.click(); setTimeout(()=>URL.revokeObjectURL(url),60000);
}
export function ConversationRecorder({ accountKey, isCurrent, lang='cs', visible=true, canStart=true }) {
  const L=(cs,en)=>lang==='en'?en:cs;
  const [state,setState]=useState(null),[records,setRecords]=useState([]),[error,setError]=useState('');
  const [withTranscript,setWithTranscript]=useState(true),[speech,setSpeech]=useState('idle'),[segments,setSegments]=useState([]),[elapsed,setElapsed]=useState(0);
  const [selected,setSelected]=useState(null),[audioUrl,setAudioUrl]=useState(''),[loading,setLoading]=useState(false);
  const [expanded,setExpanded]=useState(false),[failedExported,setFailedExported]=useState(false);
  const language=useRef(lang);language.current=lang;
  const controller=useRef(null),transcriber=useRef(null),draft=useRef(null),segmentsRef=useRef([]),writing=useRef(Promise.resolve()),current=useRef(isCurrent),started=useRef(0),wanted=useRef(false),mounted=useRef(true);
  current.current=isCurrent;
  const store=useMemo(()=>createRecordingDraftStore({namespace:`conversation_${accountKey}`,current:()=>current.current(accountKey)}),[accountKey]);
  const refresh=()=>store.list().then(rows=>{if(mounted.current)setRecords(rows.sort((a,b)=>b.createdAt-a.createdAt));}).catch(()=>{if(mounted.current)setError('storage');});
  const checkpoint=()=>{
    const id=draft.current?.id,copy=segmentsRef.current.slice(); if(!id)return;
    writing.current=writing.current.catch(()=>{}).then(()=>store.update(id,{transcript:copy})).catch(()=>{if(mounted.current)setError('storage');});
  };
  useEffect(()=>{
    mounted.current=true; refresh();
    const speechController=createConversationTranscriber({Recognition:globalThis.SpeechRecognition||globalThis.webkitSpeechRecognition,lang:()=>language.current==='en'?'en-GB':'cs-CZ',
      onStatus:value=>{if(mounted.current)setSpeech(value);},
      onSegment:row=>{segmentsRef.current=[...segmentsRef.current,row];if(mounted.current)setSegments(segmentsRef.current);checkpoint();}});
    transcriber.current=speechController;
    const journal={...store,create:async metadata=>{draft.current=await store.create(metadata);return draft.current;}};
    const recorder=createVoiceRecorder({mediaDevices:navigator.mediaDevices,Recorder:globalThis.MediaRecorder,drafts:journal,
      audioBitsPerSecond:32000,stopBytes:Infinity,retainDraft:true,metadata:{kind:'conversation',title:language.current==='en'?'Conversation':'Rozhovor'},
      onState:value=>{if(!mounted.current)return;setState(value);if(value?.phase==='recording'){started.current=value.startedAt;if(wanted.current)speechController.start();}else if(!value||['saving','failed'].includes(value.phase))speechController.stop();},
      onSave:async(blob,meta)=>{await writing.current;const saved=await store.read(meta.id);if(saved?.blob.size!==blob.size)throw new Error('incomplete-audio');await store.update(meta.id,{completedAt:Date.now(),transcript:segmentsRef.current});await refresh();},
      onError:reason=>{if(mounted.current)setError(reason);}});
    controller.current=recorder;
    return()=>{mounted.current=false;speechController.dispose();checkpoint();recorder.dispose();};
  },[store]);
  useEffect(()=>{const wake=createScreenWakeController();wake.setActive(state?.phase==='recording');return()=>wake.dispose();},[state?.phase]);
  useEffect(()=>{if(state?.phase!=='recording')return;const tick=()=>setElapsed(Math.max(0,Math.floor((Date.now()-started.current)/1000)));tick();const timer=setInterval(tick,1000);return()=>clearInterval(timer);},[state?.phase]);
  useEffect(()=>{if(!selected?.blob){setAudioUrl('');return;}const url=URL.createObjectURL(selected.blob);setAudioUrl(url);return()=>URL.revokeObjectURL(url);},[selected?.blob]);
  const start=()=>{setError('');setFailedExported(false);setSpeech('idle');setSelected(null);segmentsRef.current=[];setSegments([]);setElapsed(0);wanted.current=withTranscript;controller.current.start();};
  const open=async id=>{setLoading(true);try{const row=await store.read(id);if(mounted.current)setSelected(row);}catch{setError('storage');}finally{if(mounted.current)setLoading(false);}};
  const busy=!!state&&state.phase!=='failed';
  const transcript=transcriptText(selected?.transcript,{title:selected?.title,startedAt:selected?.createdAt});
  return <details className="tg-recorder" hidden={!visible&&!busy} open={expanded||busy} onToggle={event=>setExpanded(event.currentTarget.open)}>
    <summary>{L('Záznamník rozhovoru','Conversation recorder')}</summary>
    <p className="hint">{L('Nahrávka zůstává v tomto zařízení u tvého účtu. Po rozhovoru stáhni zvuk i přepis.','The recording stays on this device under your account. Download the audio and transcript after your conversation.')}</p>
    {!busy&&<label className="row"><input type="checkbox" checked={withTranscript} onChange={e=>setWithTranscript(e.target.checked)}/>{L('Průběžný automatický přepis','Live automatic transcript')}</label>}
    {withTranscript&&!busy&&<p className="hint">{L('Přepis zajišťuje prohlížeč a může využít svou online službu. Nahrávejte, když s tím oba souhlasíte.','Transcription is provided by your browser and may use its online service. Record when you both agree.')}</p>}
    <div className="row" style={{flexWrap:'wrap'}}>
      {!busy&&<button type="button" onClick={start} disabled={!canStart||state?.phase==='failed'}>{L('Nahrát rozhovor','Record conversation')}</button>}
      {state?.phase==='recording'&&<><span role="status">{L('Nahrávám','Recording')} · {secondsLabel(elapsed)}</span><button type="button" onClick={()=>controller.current.stop()}>{L('Zastavit a uložit','Stop and save')}</button></>}
      {state?.phase==='requesting'&&<span role="status">{L('Čekám na mikrofon…','Waiting for microphone…')}</span>}
      {state?.phase==='saving'&&<span role="status">{L('Ukládám zvuk…','Saving audio…')}</span>}
    </div>
    {state?.phase==='failed'&&<div className="row" style={{flexWrap:'wrap'}}><button onClick={()=>controller.current.retry()}>{L('Znovu uložit','Retry saving')}</button><button onClick={()=>{const blob=controller.current.failedBlob();if(blob){download(blob,'rozhovor.'+(blob.type.includes('mp4')?'m4a':'webm'));setFailedExported(true);}}}>{L('Stáhnout zachycený zvuk','Download captured audio')}</button>{failedExported&&<button onClick={()=>{controller.current.cancel();setError('');refresh();}}>{L('Dokončit po stažení','Finish after download')}</button>}</div>}
    {['interrupted','unavailable'].includes(speech)&&<p role="status">{L('Automatický přepis je přerušený nebo zde není podporovaný. Zvuk se nahrává dál; přepis může být neúplný.','Automatic transcription is interrupted or unsupported here. Audio recording continues; the transcript may be incomplete.')}</p>}
    {speech==='interrupted'&&state?.phase==='recording'&&<button type="button" onClick={()=>transcriber.current.start(started.current)}>{L('Obnovit přepis','Resume transcription')}</button>}
    {segments.length>0&&busy&&<p style={{whiteSpace:'pre-wrap'}}>{segments.slice(-2).map(s=>s.text).join(' ')}</p>}
    {error&&<p role="alert">{error==='permission'?L('Povol mikrofon v prohlížeči a zkus to znovu.','Allow microphone access and retry.'):error==='unsupported'?L('Tento prohlížeč nahrávání nepodporuje.','This browser does not support recording.'):L('Záznam nelze celý uložit. Zkontroluj volné místo; zachycený zvuk můžeš stáhnout.','The recording could not be fully saved. Check free space; you can download the captured audio.')}</p>}
    {records.map(row=><button key={row.id} type="button" disabled={busy||loading} onClick={()=>open(row.id)} style={{display:'block',width:'100%',textAlign:'left',marginTop:8}}>{new Date(row.createdAt).toLocaleString(lang==='en'?'en-GB':'cs-CZ')} · {row.completedAt?L('uloženo','saved'):L('obnovený záznam','recovered recording')} · {(row.bytes/1000000).toFixed(1)} MB</button>)}
    {selected&&<div style={{marginTop:16}}>
      {audioUrl&&<audio controls src={audioUrl} style={{width:'100%'}}/>}
      <div className="row" style={{flexWrap:'wrap',marginTop:10}}>
        <button onClick={()=>download(selected.blob,`rozhovor-${selected.id}.${selected.type?.includes('mp4')?'m4a':selected.type?.includes('ogg')?'ogg':'webm'}`)}>{L('Stáhnout zvuk','Download audio')}</button>
        <button disabled={!selected.transcript?.length} onClick={()=>download(new Blob([transcript],{type:'text/plain;charset=utf-8'}),`prepis-${selected.id}.txt`)}>{L('Stáhnout přepis','Download transcript')}</button>
      </div>
      {selected.transcript?.length?<><p className="hint">{L('Automatický přepis. Před analýzou zkontroluj jména a vynechaná místa.','Automatic transcript. Check names and missing sections before analysis.')}</p><textarea aria-label={L('Přepis rozhovoru','Conversation transcript')} readOnly value={transcript} rows={8} style={{width:'100%',boxSizing:'border-box'}}/></>:<p className="hint">{L('Tento záznam nemá automatický přepis. Stáhni zvuk a předej jej nástroji pro přepis.','This recording has no automatic transcript. Download the audio and pass it to a transcription tool.')}</p>}
    </div>}
  </details>;
}
