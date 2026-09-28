import {test} from 'node:test';
import assert from 'node:assert/strict';
import {separateWarmupTemplates} from '../src/training/separateWarmups.js';
import {clientBundle} from '../src/training/adapters.js';
const mixed = {id:'a',cz:'Síla',en:'Strength',intro:['Návod\n\nZdroje:\nAutor','How-to\n\nSources:\nAuthor'],blocks:[{id:'b',exId:'pushup',coachNote:['Návod','How-to'],sets:[{id:'w',type:'warmup',planned:{targetRepsMin:5}},{id:'s',type:'work',planned:{targetRepsMin:8}}]}]};
test('preparation is separately addable; projection preserves original data and is idempotent',()=>{
 const before=JSON.stringify(mixed),out=separateWarmupTemplates([mixed]);
 assert.deepEqual(out.map(x=>x.id),['a','a__warmup']);
 assert.deepEqual(out[0].blocks[0].sets.map(s=>s.id),['s']);
 assert.deepEqual(out[1].blocks[0].sets.map(s=>s.id),['w']);
 assert.match(out[1].intro[0],/Zdroje:\nAutor/);
 assert.deepEqual(separateWarmupTemplates(out),out);
 assert.equal(JSON.stringify(mixed),before);
 const own={...out[1],cz:'Vlastní příprava'};
 assert.deepEqual(separateWarmupTemplates([mixed,own]).map(x=>x.cz),['Síla','Vlastní příprava']);
});
test('standalone warmup remains intact and delivery removes follow-along URLs',()=>{
 const prep={...mixed,id:'prep',blocks:[{...mixed.blocks[0],sets:[mixed.blocks[0].sets[0]]}]};
 assert.equal(separateWarmupTemplates([prep])[0],prep);
 const plan={id:'p',sessions:[{templateId:'a'}],intro:['Autor https://youtube.com/watch?v=test','Author']};
 const doc=clientBundle([plan],[mixed],()=>({id:'pushup',execution:['Plynule https://example.com/video','Smoothly']}));
 assert.equal(doc.templates[0].blocks[0].sets.length,1);
 assert.equal(doc.templates[0].blocks[0].sets[0].type,'work');
 assert.ok(!JSON.stringify(doc).includes('https://'));
 assert.deepEqual(doc.exercises[0].execution,['Plynule','Smoothly']);
});
