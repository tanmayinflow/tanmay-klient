// Compression runs locally. No source audio is sent to a conversion service.
// Safari/Chromium codec support still determines which inputs can be decoded.
import { AUDIO_UPLOAD_BYTES } from './mediaLimits.js';
export { AUDIO_UPLOAD_BYTES } from './mediaLimits.js';
export const AUDIO_CONVERSION_MAX_SOURCE_BYTES = 100_000_000;
export const AUDIO_CONVERSION_MAX_SECONDS = 30 * 60;
const MAX_DECODED_BYTES = 200_000_000;
const error = code => Object.assign(new Error(code), { code });
const check = signal => { if (signal?.aborted) throw error('media-cancelled'); };

// Ogg is the container used by .opus voice messages. A generic MIME type can
// otherwise make a valid attachment render as a download instead of audio.
export async function normalizeAudioFile(file,{signal}={}) {
  check(signal);
  const originalType=(file.type||'').toLowerCase();
  const ambiguous=!originalType || ['application/octet-stream','application/ogg','audio/opus'].includes(originalType);
  const oggName=/\.(opus|ogg|oga)$/i.test(file.name||'');
  if(!ambiguous&&!oggName)return file;
  const header=new Uint8Array(await file.slice(0,128).arrayBuffer());check(signal);
  const text=String.fromCharCode(...header);
  let type=originalType;
  if(text.startsWith('OggS'))type=text.includes('OpusHead')?'audio/ogg;codecs=opus':text.includes('vorbis')?'audio/ogg;codecs=vorbis':'audio/ogg';
  else if(ambiguous){
    const extension=/\.([^.]+)$/.exec(file.name||'')?.[1]?.toLowerCase();
    type=({opus:'audio/ogg;codecs=opus',ogg:'audio/ogg',oga:'audio/ogg',mp3:'audio/mpeg',m4a:'audio/mp4',aac:'audio/aac',wav:'audio/wav',webm:'audio/webm',flac:'audio/flac'})[extension]||(originalType==='application/ogg'?'audio/ogg':originalType);
  }
  if(!type||type===originalType)return file;
  return new File([file],file.name||'nahravka',{type,lastModified:file.lastModified||Date.now()});
}

export function audioEncodingPlan(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) throw error('audio-duration-unavailable');
  if (seconds > AUDIO_CONVERSION_MAX_SECONDS) throw error('audio-conversion-too-long');
  const kbps = [128, 96, 64, 48, 32].find(rate => seconds * rate * 1000 / 8 <= 14_500_000);
  if (!kbps) throw error('audio-conversion-too-long');
  // Downsample long spoken recordings before decoding, limiting PCM memory.
  const sampleRate = seconds <= 300 ? 44100 : seconds <= 600 ? 22050 : seconds <= 1200 ? 16000 : 12000;
  return { seconds, kbps, sampleRate, channels: 1 };
}

export function readAudioDuration(file, { signal } = {}) {
  check(signal);
  if (!globalThis.document || !globalThis.URL?.createObjectURL) return Promise.reject(error('audio-conversion-unavailable'));
  return new Promise((resolve,reject) => {
    const audio = document.createElement('audio'), url = URL.createObjectURL(file);
    let sought = false, settled = false;
    const cleanup = () => {
      clearTimeout(timer); signal?.removeEventListener('abort', aborted);
      audio.onloadedmetadata = audio.ondurationchange = audio.ontimeupdate = audio.onerror = null;
      audio.removeAttribute('src'); audio.load(); URL.revokeObjectURL(url);
    };
    const finish = (value, failure) => { if (settled) return; settled=true; cleanup(); failure ? reject(failure) : resolve(value); };
    const aborted = () => finish(null,error('media-cancelled'));
    const inspect = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) finish(audio.duration);
      // MediaRecorder WebM can omit duration. Seeking to its end asks the
      // browser to inspect the container without playing sound.
      else if (audio.duration === Infinity && !sought) { sought=true; try { audio.currentTime=1e12; } catch { finish(null,error('audio-duration-unavailable')); } }
    };
    const timer=setTimeout(()=>finish(null,error('audio-duration-unavailable')),20_000);
    signal?.addEventListener('abort',aborted,{once:true});
    audio.preload='metadata'; audio.onloadedmetadata=inspect; audio.ondurationchange=inspect; audio.ontimeupdate=inspect;
    audio.onerror=()=>finish(null,error('audio-format-unsupported')); audio.src=url;
  });
}

async function decodeAudio(file, plan, signal) {
  const OfflineContext=globalThis.OfflineAudioContext || globalThis.webkitOfflineAudioContext;
  if (!OfflineContext) throw error('audio-conversion-unavailable');
  const context=new OfflineContext(1,1,plan.sampleRate);
  check(signal);
  const bytes=await file.arrayBuffer(); check(signal);
  let decoded;
  try { decoded=await context.decodeAudioData(bytes); } catch { throw error('audio-format-unsupported'); }
  check(signal);
  if (decoded.numberOfChannels < 1 || decoded.numberOfChannels > 2 || decoded.length*decoded.numberOfChannels*4 > MAX_DECODED_BYTES || decoded.duration > AUDIO_CONVERSION_MAX_SECONDS+1) throw error('audio-conversion-too-large');
  if (!Number.isFinite(decoded.duration) || decoded.duration <= 0 || Math.abs(decoded.duration-plan.seconds)>Math.max(2,plan.seconds*.02)) throw error('audio-duration-mismatch');
  return decoded;
}

export function encodeAudioWorker(pcm, plan, { signal, onProgress, workerFactory } = {}) {
  check(signal);
  return new Promise((resolve,reject) => {
    let worker, done=false;
    const finish=(value,failure)=>{
      if(done)return;done=true;clearTimeout(timeout);signal?.removeEventListener('abort',aborted);worker?.terminate();failure?reject(failure):resolve(value);
    };
    const aborted=()=>finish(null,error('media-cancelled'));
    const timeout=setTimeout(()=>finish(null,error('audio-conversion-timeout')),180_000);
    signal?.addEventListener('abort',aborted,{once:true});
    try {
      worker=workerFactory ? workerFactory() : new Worker(new URL('./audioCompressionWorker.js',import.meta.url),{type:'module'});
      worker.onmessage=event=>{
        if(done)return;
        const message=event.data;
        if(message?.type==='progress')onProgress?.({phase:'encoding',progress:message.progress});
        else if(message?.type==='done' && message.blob instanceof Blob && message.blob.size>0 && message.blob.size<=AUDIO_UPLOAD_BYTES)finish(message.blob);
        else if(message?.type==='error')finish(null,error(message.code==='audio-output-too-large'?'audio-output-too-large':'audio-conversion-failed'));
        else if(message?.type==='done')finish(null,error('audio-output-invalid'));
      };
      worker.onerror=()=>finish(null,error('audio-conversion-failed'));
      worker.postMessage({pcm:pcm.buffer,sampleRate:plan.sampleRate,kbps:plan.kbps,maxBytes:AUDIO_UPLOAD_BYTES},[pcm.buffer]);
    } catch { finish(null,error('audio-conversion-unavailable')); }
  });
}

export async function prepareAudio(file, { signal, onProgress, probe=readAudioDuration, decode=decodeAudio, encode=encodeAudioWorker, workerFactory } = {}) {
  check(signal);
  if (!file || !Number.isFinite(file.size) || file.size<1) throw error('audio-empty');
  if (file.size>AUDIO_CONVERSION_MAX_SOURCE_BYTES) throw error('audio-conversion-too-large');
  file=await normalizeAudioFile(file,{signal});check(signal);
  if (file.size<=AUDIO_UPLOAD_BYTES) return file;
  onProgress?.({phase:'reading',progress:0});
  const seconds=await probe(file,{signal});check(signal);
  const plan=audioEncodingPlan(seconds);
  let decoded=await decode(file,plan,signal);check(signal);
  if (!Number.isInteger(decoded.length) || decoded.length<1 || ![1,2].includes(decoded.numberOfChannels) || decoded.length*decoded.numberOfChannels*4>MAX_DECODED_BYTES || decoded.sampleRate!==plan.sampleRate)throw error('audio-conversion-too-large');
  const pcm=new Float32Array(decoded.length);
  let left=decoded.getChannelData(0),right=decoded.numberOfChannels===2?decoded.getChannelData(1):null;
  for(let offset=0;offset<pcm.length;offset+=65536){
    check(signal);const end=Math.min(offset+65536,pcm.length);
    for(let i=offset;i<end;i++)pcm[i]=right?(left[i]+right[i])/2:left[i];
    if(offset && offset%1048576===0)await new Promise(resolve=>setTimeout(resolve,0));
  }
  // The mono buffer is transferred, not copied, into the worker. Drop decoded
  // channels before waiting for its result so a long track can be reclaimed.
  left=null;right=null;decoded=null;
  onProgress?.({phase:'encoding',progress:0});
  const blob=await encode(pcm,plan,{signal,onProgress,workerFactory});check(signal);
  if (!(blob instanceof Blob) || !blob.size || blob.size>AUDIO_UPLOAD_BYTES || blob.type!=='audio/mpeg')throw error('audio-output-invalid');
  const name=(file.name||'nahravka').replace(/\.[^.]+$/,'')+'.mp3';
  const result=new File([blob],name,{type:'audio/mpeg',lastModified:file.lastModified||Date.now()});
  onProgress?.({phase:'done',progress:1});
  return result;
}
