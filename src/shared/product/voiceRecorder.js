// One microphone session. Disposal and cancellation never save partial audio.
export function createVoiceRecorder({mediaDevices, Recorder, onState, onSave, onError, now=Date.now}) {
  let active=null, pending=false, disposed=false, generation=0;
  const tracks=stream=>stream?.getTracks().forEach(track=>track.stop());
  const emit=value=>{if(!disposed)onState(value);};
  async function start(){
    if(disposed||pending||active)return;
    const attempt=++generation;pending=true;emit({phase:'requesting'});
    let stream;
    try{
      if(!Recorder||!mediaDevices?.getUserMedia)throw Error('unsupported');
      stream=await mediaDevices.getUserMedia({audio:true});
      if(disposed||attempt!==generation){tracks(stream);return;}
      const mimeType=['audio/webm;codecs=opus','audio/ogg;codecs=opus','audio/mp4'].find(type=>Recorder.isTypeSupported?.(type));
      let rec;try{rec=new Recorder(stream,{audioBitsPerSecond:64000,...(mimeType?{mimeType}:{})});}catch{rec=new Recorder(stream);}
      const session={rec,stream,cancelled:false,chunks:[]};active=session;
      rec.ondataavailable=e=>{if(e.data?.size)session.chunks.push(e.data);};
      rec.onerror=()=>{session.cancelled=true;tracks(stream);active=null;pending=false;emit(null);if(!disposed)onError('record');};
      rec.onstop=async()=>{
        tracks(stream);
        if(active===session)active=null;
        if(session.cancelled||disposed)return;
        pending=true;emit({phase:'saving'});
        try{if(session.chunks.length)await onSave(new Blob(session.chunks,{type:rec.mimeType||'audio/webm'}));}
        catch{if(!disposed)onError('save');}
        finally{pending=false;emit(null);}
      };
      rec.start();pending=false;emit({phase:'recording',startedAt:now()});
    }catch(error){tracks(stream);if(disposed||attempt!==generation)return;active=null;pending=false;emit(null);onError(error.message==='unsupported'?'unsupported':'permission');}
  }
  function stop(){if(active?.rec.state==='recording'){emit({phase:'saving'});active.rec.stop();}}
  function cancel(){generation++;pending=false;if(active){active.cancelled=true;tracks(active.stream);if(active.rec.state!=='inactive')active.rec.stop();active=null;}emit(null);}
  return {start,stop,cancel,dispose(){disposed=true;cancel();}};
}
