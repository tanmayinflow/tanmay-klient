import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';

const inApp=fs.existsSync(new URL('../src/shared/ui/calendarTimed.jsx',import.meta.url));
const require=createRequire(inApp?import.meta.url:new URL('../../../Source/tanmay-web/package.json',import.meta.url));
const React=require('react'),ts=require('typescript'),{renderToStaticMarkup}=require('react-dom/server');
const code=ts.transpileModule(fs.readFileSync(new URL(inApp?'../src/shared/ui/calendarTimed.jsx':'../ui/calendarTimed.jsx',import.meta.url),'utf8'),{compilerOptions:{jsx:ts.JsxEmit.React,module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText;
const module={exports:{}};vm.runInNewContext(code,{module,exports:module.exports,require});
const {CalendarTimedRow,calendarScheduleRows}=module.exports;

test('Google times interleave with precise own blocks and keep overlaps as distinct rows',()=>{
  const events=[{id:'a',time:'09:37'},{id:'b',time:'09:37'},{id:'c',time:'08:05'}];
  const rows=calendarScheduleRows(['8:00','9:00','10:00'],{'9:00':{calHour:'9:00',calTime:'09:45',calMinutes:30,span:1}},events,6,11);
  assert.deepEqual(Array.from(rows,r=>r.event?.id||r.hour),['8:00','c','a','b','9:00','10:00']);
  assert.equal(calendarScheduleRows([],{},[{id:'night',time:'01:17'}],0,5)[0].event.id,'night');
});

test('timed row renders exact interval and overnight continuation using current theme',()=>{
  const html=renderToStaticMarkup(React.createElement(CalendarTimedRow,{event:{id:'a',title:'Late arrival',time:'23:37',endTime:'24:00',continuesAfter:true},t:{text:'#ddd',borderSoft:'#333',textMuted:'#999',sage:'#aaa'},L:(cs,en)=>en}));
  assert.match(html,/23:37–24:00/);assert.match(html,/Late arrival/);assert.match(html,/continues the next day/);
  assert.match(html,/color:#ddd/);assert.doesNotMatch(html,/<input|<button/);
});
