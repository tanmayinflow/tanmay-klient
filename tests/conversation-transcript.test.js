import test from 'node:test';
import assert from 'node:assert/strict';
import {createConversationTranscriber,transcriptText} from '../src/shared/product/conversationTranscript.js';
test('only final recognized text is exported with elapsed time, without invented speakers',()=>{
  let instance,clock=1000;const rows=[],status=[];
  class Recognition{constructor(){instance=this;}start(){this.onstart();}stop(){}abort(){}}
  const t=createConversationTranscriber({Recognition,now:()=>clock,onSegment:r=>rows.push(r),onStatus:s=>status.push(s)});
  t.start();clock=62500;
  const interim=[{transcript:'unfinished'}],final=[{transcript:'Dobrý den'}];final.isFinal=true;
  instance.onresult({resultIndex:0,results:[interim,final]});
  assert.deepEqual(rows,[{seconds:61.5,text:'Dobrý den'}]);assert.equal(transcriptText(rows),'[1:01] Dobrý den');
  assert.deepEqual(status,['listening']);t.dispose();instance.onresult({resultIndex:0,results:[final]});assert.equal(rows.length,1);
});
test('service interruptions remain explicit and permission failure does not loop',()=>{
  let instance,restarts=0;const status=[];
  class Recognition{constructor(){instance=this;}start(){}stop(){}abort(){}}
  const t=createConversationTranscriber({Recognition,onSegment:()=>{},onStatus:s=>status.push(s),delay:()=>restarts++});
  t.start();instance.onerror({error:'not-allowed'});instance.onend();
  assert.deepEqual(status,['interrupted']);assert.equal(restarts,0);t.dispose();
});
test('unsupported recognizer reports unavailable and stops cleanly',()=>{
  const status=[];const t=createConversationTranscriber({onStatus:s=>status.push(s),onSegment:()=>{}});
  t.start();t.stop();t.dispose();assert.deepEqual(status,['unavailable']);
});
test('language changes apply to next recording and late old results cannot leak into it',()=>{
  const instances=[],rows=[];let language='cs-CZ';
  class Recognition{constructor(){instances.push(this);}start(){}stop(){}abort(){}}
  const t=createConversationTranscriber({Recognition,lang:()=>language,onSegment:r=>rows.push(r),onStatus:()=>{}});
  t.start();assert.equal(instances[0].lang,'cs-CZ');language='en-GB';
  t.stop();t.start();assert.equal(instances[1].lang,'en-GB');
  const result=[{transcript:'late'}];result.isFinal=true;
  instances[0].onresult({resultIndex:0,results:[result]});assert.equal(rows.length,0);t.dispose();
});
