// Separate worker keeps MP3 encoding off the interface thread.
import { Mp3Encoder } from '@breezystack/lamejs';

export function encodeMp3(pcm, sampleRate, kbps, maxBytes=15_000_000, progress=()=>{}) {
  if (!(pcm instanceof Float32Array) || !pcm.length || ![8000,12000,16000,22050,44100].includes(sampleRate) || ![32,48,64,96,128].includes(kbps))throw new Error('audio-input-invalid');
  const encoder=new Mp3Encoder(1,sampleRate,kbps), chunks=[];
  let total=0;
  const append=part=>{
    if(!part.length)return;
    total+=part.length;if(total>maxBytes)throw new Error('audio-output-too-large');
    chunks.push(new Uint8Array(part));
  };
  for(let offset=0;offset<pcm.length;offset+=1152){
    const count=Math.min(1152,pcm.length-offset),samples=new Int16Array(count);
    for(let i=0;i<count;i++){
      const sample=Number.isFinite(pcm[offset+i])?Math.max(-1,Math.min(1,pcm[offset+i])):0;
      samples[i]=Math.round(sample*(sample<0?32768:32767));
    }
    append(encoder.encodeBuffer(samples));
    if(offset%(1152*64)===0)progress(offset/pcm.length);
  }
  append(encoder.flush());progress(1);
  return new Blob(chunks,{type:'audio/mpeg'});
}

if(typeof self!=='undefined' && typeof WorkerGlobalScope!=='undefined' && self instanceof WorkerGlobalScope){
  self.onmessage=event=>{
    try {
      const {pcm,sampleRate,kbps,maxBytes}=event.data;
      const blob=encodeMp3(new Float32Array(pcm),sampleRate,kbps,maxBytes,progress=>self.postMessage({type:'progress',progress}));
      self.postMessage({type:'done',blob});
    } catch(failure){self.postMessage({type:'error',code:failure?.message||'audio-conversion-failed'});}
  };
}
