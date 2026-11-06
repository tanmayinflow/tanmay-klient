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
test('closing an active editor stops every track without inserting into an unmounted editor',async()=>{
  const f=fixture();await f.controller.start();f.controller.dispose();assert.ok(f.stopped>0);assert.deepEqual(f.saved,[]);
});
test('permission rejection and save failure report recovery and clear busy state',async()=>{
  const denied=fixture({mediaDevices:{getUserMedia:async()=>{throw Error('denied');}}});await denied.controller.start();assert.deepEqual(denied.errors,['permission']);assert.equal(denied.states.at(-1),null);
  const failed=fixture({onSave:async()=>{throw Error('storage');}});await failed.controller.start();failed.controller.stop();await new Promise(r=>setImmediate(r));assert.deepEqual(failed.errors,['save']);assert.equal(failed.states.at(-1).phase,'failed');assert.equal(await failed.controller.failedBlob().text(),'voice');
});

function journal() {
  const rows=new Map();return {rows,create:async row=>{rows.set(row.id,{...row,chunks:[]});return row;},append:async(id,index,blob)=>{assert.equal(rows.get(id).chunks.length,index);rows.get(id).chunks.push(blob);},remove:async id=>rows.delete(id)};
}
test('audio checkpoints survive editor disposal and are scoped to the original draft',async()=>{
  const drafts=journal(),f=fixture({drafts,id:()=> 'recording',metadata:{entryId:'note-a'}});
  await f.controller.start();f.rec.ondataavailable({data:new Blob(['first'])});await new Promise(r=>setImmediate(r));
  assert.equal(await drafts.rows.get('recording').chunks[0].text(),'first');
  f.controller.dispose();await new Promise(r=>setImmediate(r));
  assert.equal(drafts.rows.get('recording').entryId,'note-a');assert.equal(drafts.rows.get('recording').chunks.length,2);assert.deepEqual(f.saved,[]);
});
test('journal is removed only after successful insertion, while failed insertion can be retried',async()=>{
  const drafts=journal();let fails=true;
  const f=fixture({drafts,id:()=> 'recording',onSave:async()=>{if(fails)throw new Error('full');}});
  await f.controller.start();f.controller.stop();await new Promise(r=>setImmediate(r));assert.ok(drafts.rows.has('recording'));
  fails=false;await f.controller.retry();assert.equal(drafts.rows.size,0);assert.equal(f.states.at(-1),null);
});
test('checkpoint quota failure stops recording and preserves captured audio for download',async()=>{
  const drafts=journal();drafts.append=async()=>{throw Object.assign(new Error('full'),{name:'QuotaExceededError'});};
  const f=fixture({drafts,id:()=> 'recording',onSave:async()=>{throw new Error('offline and full');}});
  await f.controller.start();f.rec.ondataavailable({data:new Blob(['first'])});await new Promise(r=>setImmediate(r));
  assert.equal(f.rec.state,'inactive');assert.ok(f.errors.includes('checkpoint'));assert.ok(f.errors.includes('save'));
  assert.equal(await f.controller.failedBlob().text(),'firstvoice');assert.ok(drafts.rows.has('recording'));
});
test('recording does not start when its durable journal cannot be created',async()=>{
  const f=fixture({drafts:{create:async()=>{throw new Error('blocked');}}});await f.controller.start();
  assert.equal(f.rec.state,'inactive');assert.ok(f.stopped>0);assert.deepEqual(f.errors,['checkpoint']);
});
