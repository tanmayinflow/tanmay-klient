import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeStoragePreferences, readStoragePreferences, writeStoragePreferences, summarizeFiles, inspectStorage, pendingAttachments, preparePhotoAttachment, recordingEstimate } from '../src/shared/product/storageOverview.js';
import { createVoiceRecorder } from '../src/shared/product/voiceRecorder.js';

test('quality preferences validate input, survive reload and remain separate for each account', () => {
  const rows = new Map(), storage = { getItem: k => rows.get(k), setItem: (k,v) => rows.set(k,v) };
  writeStoragePreferences('alice', { audioKbps: 32, photoSide: 1600, budgetGiB: 5 }, storage);
  assert.deepEqual(readStoragePreferences('alice', storage), { audioKbps: 32, photoSide: 1600, budgetGiB: 5 });
  assert.deepEqual(readStoragePreferences('bob', storage), { audioKbps: 64, photoSide: 0, budgetGiB: 0 });
  assert.deepEqual(normalizeStoragePreferences({ audioKbps: Infinity, photoSide: -1, budgetGiB: '5' }), { audioKbps: 64, photoSide: 0, budgetGiB: 0 });
  assert.throws(() => writeStoragePreferences('alice', {}, {setItem(){throw new Error('QuotaExceededError');}}), /Quota/);
});
test('blocked browser storage safely returns defaults and cannot crash settings', () => {
  const before=Object.getOwnPropertyDescriptor(globalThis,'localStorage');
  Object.defineProperty(globalThis,'localStorage',{configurable:true,get(){throw new Error('SecurityError');}});
  try { assert.deepEqual(readStoragePreferences('account'),{audioKbps:64,photoSide:0,budgetGiB:0}); }
  finally { if(before)Object.defineProperty(globalThis,'localStorage',before);else delete globalThis.localStorage; }
});
const inventory = [{id:'voice',size:60,type:'audio/webm'}, {id:'image',size:30,type:'image/jpeg'}, {id:'pdf',size:10,type:'application/pdf'}];
const fixture = overrides => ({
  getDocument:()=>({coll:{notebook:[{att:[{id:'pending',idb:true,size:7,type:'audio/webm'}]}]},edits:{}}),
  listLocalFiles:async()=>[inventory[0]], drafts:{list:async()=>[{bytes:12},{bytes:0}]},
  fetcher:async path=>Response.json(path.includes('state')?{ok:true,bytes:1000,limit:10000000}:{files:inventory}),
  browserStorage:{estimate:async()=>({usage:1000,quota:10000}),persisted:async()=>false}, ...overrides,
});
test('usage counts unique IDs and categories without adding local and server copies', async () => {
  const data = await inspectStorage(fixture());
  assert.deepEqual(data.cloud, {count:3,bytes:100,audio:60,images:30,other:10});
  assert.equal(data.local.bytes,60); assert.equal(data.pending.bytes,7);
  assert.deepEqual(data.drafts,{count:1,bytes:12}); assert.equal(data.state.limit,10000000);
  assert.equal(summarizeFiles([...inventory,inventory[0],{id:'bad',size:-1}]).bytes,100);
  assert.equal(pendingAttachments({a:{id:'x',idb:true,size:4},b:{id:'x',idb:true,size:4},c:{id:'y',idb:true,r2:true,size:5}}).bytes,4);
});
test('offline or HTML login response is unknown, not zero; local usage remains available', async () => {
  const data=await inspectStorage(fixture({fetcher:async()=>new Response('<html>login</html>',{headers:{'content-type':'text/html'}})}));
  assert.equal(data.cloud,null); assert.equal(data.state,null); assert.equal(data.local.bytes,60);
  const unavailable=await inspectStorage(fixture({listLocalFiles:async()=>{throw new Error('blocked');}, browserStorage:{}}));
  assert.equal(unavailable.local,null); assert.equal(unavailable.device,null); assert.equal(unavailable.cloud.bytes,100);
});
test('a response from a previous account or aborted inspection cannot be displayed', async () => {
  let current=true, finish; const wait=new Promise(r=>finish=r);
  const inspection=inspectStorage(fixture({current:()=>current,listLocalFiles:async()=>{await wait;return inventory;}}));
  current=false;finish();await assert.rejects(inspection,/account-changed/);
  const controller=new AbortController();controller.abort();
  await assert.rejects(inspectStorage(fixture({signal:controller.signal})),/account-changed/);
});
test('malformed server inventory or limits remain unknown rather than suggesting available space', async () => {
  for (const files of [[{id:'existing'}],[{id:'existing',size:-1}],[{size:10}],null]) {
    const data=await inspectStorage(fixture({fetcher:async path=>Response.json(path.includes('state')?{ok:true,bytes:-1,limit:0}:{files})}));
    assert.equal(data.cloud,null);assert.equal(data.state,null);
  }
});
test('abort also releases a hung local database or browser storage estimate', async () => {
  const controller=new AbortController();
  const work=inspectStorage(fixture({signal:controller.signal,listLocalFiles:()=>new Promise(()=>{})}));
  controller.abort();await assert.rejects(work,/storage-cancelled/);
});
test('photo preferences use automatic preparation without changing other attachments', async () => {
  const jpeg = new File(['original image content'], 'photo.jpg', { type: 'image/jpeg', lastModified: 100 });
  const codec = { decode: async () => ({ width: 3200, height: 1800, close() {} }), encode: async (_image, options) => { assert.equal(options.width, 1600); return new Blob(['small'], { type: 'image/jpeg' }); } };
  const result = await preparePhotoAttachment(jpeg, { photoSide: 1600 }, codec);
  assert.equal(result.name, jpeg.name); assert.equal(result.lastModified, 100); assert.equal(await result.text(), 'small');
  assert.equal(await preparePhotoAttachment(jpeg, { photoSide: 0 }, codec), jpeg);
  const pdf = new File(['pdf'], 'document.pdf', { type: 'application/pdf' });
  assert.equal(await preparePhotoAttachment(pdf, { photoSide: 1600 }, codec), pdf);
});

test('voice recorder reads the latest selected bitrate for each start', async () => {
  let rate=32000;const observed=[];
  class Recorder { static isTypeSupported(){return true;} constructor(_stream,options){this.state='inactive';this.mimeType='audio/webm';observed.push(options.audioBitsPerSecond);} start(){this.state='recording';} stop(){this.state='inactive';this.onstop();} }
  const controller=createVoiceRecorder({Recorder,mediaDevices:{getUserMedia:async()=>({getTracks:()=>[]})},audioBitsPerSecond:()=>rate,onState(){},onError(){},onSave:async()=>{},doc:null,win:null});
  await controller.start();controller.cancel();rate=128000;await controller.start();controller.cancel();controller.dispose();
  assert.deepEqual(observed,[32000,128000]);
  assert.equal(recordingEstimate(64).hourBytes,28800000);
  assert.ok(recordingEstimate(32).maxMinutes>recordingEstimate(128).maxMinutes);
});
