import test from 'node:test';
import assert from 'node:assert/strict';
import {createVoiceRecorder} from '../src/shared/product/voiceRecorder.js';

function fixture(overrides={}){
  const states=[],saved=[],errors=[];let stopped=0,calls=0,rec;
  const stream={getTracks:()=>[{stop:()=>stopped++}]};
  class Recorder{
    static isTypeSupported(type){return type==='audio/webm;codecs=opus';}
    constructor(){rec=this;this.state='inactive';this.mimeType='audio/webm';}
    start(){this.state='recording';}
    stop(){this.state='inactive';this.ondataavailable({data:new Blob(['voice'])});return this.onstop();}
  }
  const controller=createVoiceRecorder({Recorder,mediaDevices:{getUserMedia:async()=>{calls++;return stream;}},onState:v=>states.push(v),onSave:async blob=>saved.push(await blob.text()),onError:e=>errors.push(e),now:()=>123,...overrides});
  return {controller,states,saved,errors,stream,get stopped(){return stopped;},get calls(){return calls;},get rec(){return rec;}};
}
test('one microphone session, visible recording then saving, original audio saved once',async()=>{
  const f=fixture();await Promise.all([f.controller.start(),f.controller.start()]);assert.equal(f.calls,1);
  assert.deepEqual(f.states.at(-1),{phase:'recording',startedAt:123});
  f.controller.stop();await new Promise(r=>setImmediate(r));
  assert.deepEqual(f.saved,['voice']);assert.ok(f.stopped>0);assert.equal(f.states.at(-1),null);assert.ok(f.states.some(s=>s?.phase==='saving'));
});
test('cancel releases microphone without inserting audio; a later session can save',async()=>{
  const f=fixture();await f.controller.start();f.controller.cancel();assert.deepEqual(f.saved,[]);assert.ok(f.stopped>0);
  await f.controller.start();f.controller.stop();await new Promise(r=>setImmediate(r));assert.deepEqual(f.saved,['voice']);
});
test('closing editor while permission is pending releases a late stream',async()=>{
  let resolve;const f=fixture({mediaDevices:{getUserMedia:()=>new Promise(r=>resolve=r)}});
  const started=f.controller.start();f.controller.dispose();resolve(f.stream);await started;
  assert.equal(f.rec,undefined);assert.equal(f.stopped,1);assert.deepEqual(f.saved,[]);
});
test('closing an active editor discards unfinished recording and stops every track',async()=>{
  const f=fixture();await f.controller.start();f.controller.dispose();assert.ok(f.stopped>0);assert.deepEqual(f.saved,[]);
});
test('permission rejection and save failure report recovery and clear busy state',async()=>{
  const denied=fixture({mediaDevices:{getUserMedia:async()=>{throw Error('denied');}}});await denied.controller.start();assert.deepEqual(denied.errors,['permission']);assert.equal(denied.states.at(-1),null);
  const failed=fixture({onSave:async()=>{throw Error('storage');}});await failed.controller.start();failed.controller.stop();await new Promise(r=>setImmediate(r));assert.deepEqual(failed.errors,['save']);assert.equal(failed.states.at(-1),null);
});
