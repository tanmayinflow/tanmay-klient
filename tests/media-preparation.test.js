import test from 'node:test';
import assert from 'node:assert/strict';
import { prepareNewAttachment } from '../src/shared/product/mediaPreparation.js';
import { storeAttachment } from '../src/shared/product/mediaSafety.js';

test('converted attachment is the only file persisted locally and online, with its own metadata', async () => {
  const original = new File(['original'], 'voice.opus', {type:'application/octet-stream'});
  const converted = new File(['converted MP3'], 'voice.mp3', {type:'audio/mpeg'});
  const writes = [];
  const file = await prepareNewAttachment(original, {audio: async input => { assert.equal(input,original); return converted; }});
  const attachment = await storeAttachment({file,id:'draft-id',putLocal:async(id,blob)=>writes.push(['local',id,blob]),upload:async(id,blob,name)=>writes.push(['cloud',id,blob,name])});
  assert.equal(attachment.type,'audio/mpeg'); assert.equal(attachment.name,'voice.mp3'); assert.equal(attachment.size,converted.size); assert.equal(attachment.id,'draft-id'); assert.equal(attachment.r2,true);
  assert.deepEqual(writes,[['local','draft-id',converted],['cloud','draft-id',converted,'voice.mp3']]);
  assert.equal(await original.text(),'original');
});

test('an account change during conversion prevents every storage write and aborts audio work', async () => {
  let active = true, signal, writes = 0;
  const file = new File(['audio'], 'recording.wav', {type:'audio/wav'});
  await assert.rejects(async () => {
    const prepared = await prepareNewAttachment(file, {current:()=>active,audio:async(_file, options)=>{signal=options.signal;active=false;options.onProgress({phase:'encoding',progress:.1});return file;}});
    await storeAttachment({file:prepared,id:'a',putLocal:async()=>writes++,upload:async()=>writes++,current:()=>active});
  }, {code:'account-changed'});
  assert.equal(signal.aborted,true); assert.equal(writes,0);
});

test('failed conversion keeps original untouched and never falls back to storing oversized original', async () => {
  const original = new File(['unreadable'], 'broken.jpg', {type:'image/jpeg'}); let writes = 0;
  await assert.rejects(async()=>{
    const file = await prepareNewAttachment(original,{photo:async()=>{throw Object.assign(new Error('image-decode'),{code:'image-decode'});}});
    await storeAttachment({file,id:'a',putLocal:async()=>writes++,upload:async()=>writes++});
  },{code:'image-decode'});
  assert.equal(writes,0); assert.equal(await original.text(),'unreadable');
});

test('photos receive preferences once and unsupported documents retain their original metadata', async () => {
  const preferences={photoSide:1600}, original=new File(['image'],'picture.png',{type:'image/png'}), prepared=new File(['small'],'picture.webp',{type:'image/webp'});let count=0;
  assert.equal(await prepareNewAttachment(original,{preferences,photo:async(file,prefs)=>{assert.equal(file,original);assert.equal(prefs,preferences);count++;return prepared;}}),prepared);
  const pdf=new File(['pdf'],'document.pdf',{type:'application/pdf'});assert.equal(await prepareNewAttachment(pdf,{audio:()=>assert.fail(),photo:()=>assert.fail()}),pdf);assert.equal(count,1);
});
