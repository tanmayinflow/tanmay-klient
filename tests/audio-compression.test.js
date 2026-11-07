import test from 'node:test';
import assert from 'node:assert/strict';
import { AUDIO_UPLOAD_BYTES, audioEncodingPlan, prepareAudio, encodeAudioWorker } from '../src/shared/product/audioCompression.js';
import { mediaKind } from '../src/shared/product/mediaLimits.js';
import { encodeMp3 } from '../src/shared/product/audioCompressionWorker.js';

test('audio at or below 15 MB keeps original bytes, name, format and identity',async()=>{
 for(const size of [1,AUDIO_UPLOAD_BYTES]){
  const file=new File([new Uint8Array(size)],'puvodni.m4a',{type:'audio/mp4'});
  const result=await prepareAudio(file,{probe:()=>{throw new Error('must not decode');}});
  assert.equal(result,file);
 }
});
test('encoding plan keeps longest automatic recording below 15 MB and bounds decode sample rate',()=>{
 const plan=audioEncodingPlan(1800);
 assert.equal(plan.kbps,64);assert.equal(plan.sampleRate,12000);assert.ok(plan.seconds*plan.kbps*125<15_000_000);
 for(const duration of [NaN,Infinity,0,-1])assert.throws(()=>audioEncodingPlan(duration),{code:'audio-duration-unavailable'});
 assert.throws(()=>audioEncodingPlan(1801),{code:'audio-conversion-too-long'});
});
test('large audio becomes bounded mono MP3 without mutating the source',async()=>{
 const file=new File([new Uint8Array(AUDIO_UPLOAD_BYTES+1)],'Souhrn knihy.wav',{type:'audio/wav'});
 const left=new Float32Array([.8,-.8,.2]),right=new Float32Array([.2,-.2,.6]);let seen;
 const result=await prepareAudio(file,{
  probe:async()=>60,
  decode:async()=>({length:3,numberOfChannels:2,sampleRate:44100,getChannelData:n=>n?right:left}),
  encode:async(pcm,plan)=>{seen={pcm,plan};return new Blob(['mp3 result'],{type:'audio/mpeg'});},
 });
 assert.equal(result.name,'Souhrn knihy.mp3');assert.equal(result.type,'audio/mpeg');assert.equal(await result.text(),'mp3 result');
 assert.deepEqual([...seen.pcm].map(v=>Math.round(v*100)),[50,-50,40]);
 assert.equal(file.size,AUDIO_UPLOAD_BYTES+1);assert.equal(file.name,'Souhrn knihy.wav');assert.equal(seen.plan.channels,1);
});
test('unsupported, oversized and long conversion sources fail before any destructive change',async()=>{
 const file=new File([new Uint8Array(AUDIO_UPLOAD_BYTES+1)],'original.aac',{type:'audio/aac'});
 await assert.rejects(prepareAudio(file,{probe:async()=>1801}),{code:'audio-conversion-too-long'});
 await assert.rejects(prepareAudio(file,{probe:async()=>120,decode:async()=>{throw Object.assign(new Error('unsupported'),{code:'audio-format-unsupported'});}}),{code:'audio-format-unsupported'});
 await assert.rejects(prepareAudio({size:100_000_001},{probe:()=>{throw new Error('must not decode');}}),{code:'audio-conversion-too-large'});
 assert.equal(file.size,AUDIO_UPLOAD_BYTES+1);
});
test('account cancellation stops before conversion and never returns a late result',async()=>{
 const abort=new AbortController();abort.abort();
 await assert.rejects(prepareAudio(new File(['x'],'voice.mp3'),{signal:abort.signal}),{code:'media-cancelled'});
 const file=new File([new Uint8Array(AUDIO_UPLOAD_BYTES+1)],'original.wav');const late=new AbortController();
 await assert.rejects(prepareAudio(file,{signal:late.signal,probe:async()=>{late.abort();return 60;}}),{code:'media-cancelled'});
});
test('real MP3 encoder emits frames at every selected sample rate and enforces byte ceiling',async()=>{
 for(const sampleRate of [12000,16000,22050,44100]){
  const pcm=Float32Array.from({length:sampleRate},(_,i)=>.25*Math.sin(2*Math.PI*440*i/sampleRate));
  const blob=encodeMp3(pcm,sampleRate,64);const bytes=new Uint8Array(await blob.arrayBuffer());
  assert.equal(blob.type,'audio/mpeg');assert.ok(blob.size>1000&&blob.size<12000);assert.equal(bytes[0],255);assert.equal(bytes[1]&224,224);
  assert.throws(()=>encodeMp3(pcm,sampleRate,64,10),/audio-output-too-large/);
 }
});
test('worker cancellation terminates encoding and rejects instead of publishing a partial file',async()=>{
 const abort=new AbortController();let terminated=0,worker;
 const waiting=encodeAudioWorker(new Float32Array(16),{sampleRate:16000,kbps:64},{signal:abort.signal,workerFactory:()=>worker={postMessage(){},terminate(){terminated++;}}});
 abort.abort();await assert.rejects(waiting,{code:'media-cancelled'});assert.equal(terminated,1);
 worker.onmessage({data:{type:'done',blob:new Blob(['late'],{type:'audio/mpeg'})}});assert.equal(terminated,1);
});
test('Opus and Ogg imports normalize MIME while preserving original bytes',async()=>{
 for(const [name,type,header,expected] of [['voice.opus','','OggS'+'.'.repeat(24)+'OpusHead','audio/ogg;codecs=opus'],['voice.ogg','application/ogg','OggS'+'.'.repeat(24)+'\x01vorbis','audio/ogg;codecs=vorbis'],['voice.oga','','OggS','audio/ogg']]){
  const source=new File([header],name,{type});
  assert.equal(mediaKind(type,name),'audio');
  const result=await prepareAudio(source);
  assert.equal(result.type,expected);assert.equal(result.name,name);assert.equal(await result.text(),header);assert.equal(source.type,type);
 }
 assert.equal(mediaKind('application/ogg'),'audio');
});
