import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';

const inApp=fs.existsSync(new URL('../src/shared/ui/googleCalendar.jsx',import.meta.url));
const require=createRequire(inApp?import.meta.url:new URL('../../../Source/tanmay-web/package.json',import.meta.url));
const React=require('react'), ts=require('typescript');
const {renderToStaticMarkup}=require('react-dom/server');
const file=new URL(inApp?'../src/shared/ui/googleCalendar.jsx':'../ui/googleCalendar.jsx',import.meta.url);
const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{jsx:ts.JsxEmit.React,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
const flush=async()=>{for(let n=0;n<8;n++)await Promise.resolve();};

function fixture(overrides={}) {
  const docListeners=new Map(), winListeners=new Map(), timers=new Map();
  const state={cfg:{clientId:'app-client',calId:'own-calendar',horizon:14,zpet:'tanmay'},account:'person-a',ready:false,live:false,locked:false,authCalls:0,syncCalls:0,loadCalls:0,preparing:0,authFailure:false};
  const document={hidden:false,addEventListener:(n,fn)=>docListeners.set(n,fn),removeEventListener:n=>docListeners.delete(n)};
  const window={addEventListener:(n,fn)=>winListeners.set(n,fn),removeEventListener:n=>winListeners.delete(n)};
  const navigator={userActivation:{isActive:true}};
  const store={calCfg:()=>state.cfg,coll:{calendarAllDay:[]},setCalCfg:patch=>{state.cfg={...state.cfg,...patch};}};
  let effect,cleanup;
  const react={...React,useRef:value=>({current:value}),useEffect:fn=>{effect=fn;}};
  const module={exports:{}};
  const context=vm.createContext({module,exports:module.exports,document,window,navigator,Date,
    setInterval:(fn,ms)=>{timers.set(ms,fn);return ms;},setTimeout:(fn,ms)=>{timers.set(ms,fn);return ms;},
    clearInterval:id=>timers.delete(id),clearTimeout:id=>timers.delete(id),
    require:id=>{
      if(id==='react')return react;
      if(id==='./icons.jsx')return {TmIcon:()=>null};
      if(id==='./type.js')return {FONT_BODY:'sans-serif',FONT_TAG:'sans-serif'};
      throw Error('Unexpected import '+id);
    }});
  vm.runInContext(code,context);
  const engine={role:'client',config:cfg=>cfg,tmCalAccount:()=>state.account,tmCalAvailable:()=>true,
    tmCalPrepare:()=>{state.preparing++;return Promise.resolve(state.cfg);},
    tmCalLoad:()=>{state.loadCalls++;return Promise.resolve();},
    tmCalReady:()=>state.ready,tmCalLive:()=>state.live,
    tmCalDesired:()=>[],tmCalTz:()=>'',tmCalBody:x=>x,tmCalHash:x=>x,
    tmCalScopeFor:()=>state.cfg.zpet==='vse'?'own primary':'own',
    tmCalTichoZakazano:()=>state.locked,tmCalTichoZapis:ok=>{state.locked=!ok;},
    tmCalAuth:()=>{state.authCalls++;if(state.authDeferred)return state.authDeferred;if(state.authFailure)return Promise.reject(Error('popup-closed'));state.ready=true;state.live=true;state.locked=false;return Promise.resolve('token');},
    tmCalSync:()=>{state.syncCalls++;return state.syncDeferred||Promise.resolve({chyby:0});},
    CAL_KINDS:[{k:'trenink',cz:'Trénink',en:'Training'},{k:'rozvrh',cz:'Rozvrh',en:'Day schedule'}],
  };
  Object.assign(engine,overrides);
  const ui=module.exports.createCalendarUI({engine,useStore:()=>store,useT:()=>({t:{text:'#222'}}),L:(cs,en)=>en,getLang:()=>'en',fmtCZ:x=>x,
    SetSection:({children})=>React.createElement('section',null,children),
    SetSwitch:({label,on})=>React.createElement('button',{role:'switch','aria-checked':on},label),
    SetChoice:()=>null,PersonalSettingsSections:()=>null});
  return {state,document,navigator,engine,ui,docListeners,winListeners,timers,
    async mount(){ui.CalAuto();cleanup=effect();await flush();},
    async click(explicit=false){docListeners.get('click')?.({target:{closest:()=>explicit?{}:null}});await flush();},
    async tick(ms=4000){timers.get(ms)?.();await flush();},
    async returnToApp(){document.hidden=false;docListeners.get('visibilitychange')?.();await flush();},
    unmount(){cleanup();}};
}

test('calendar timers never authorize and suspend all sync while hidden',async()=>{
  const f=fixture();await f.mount();
  assert.equal(f.state.loadCalls,1);
  assert.equal(f.docListeners.has('pointerdown'),false);
  await f.tick();await f.tick(60000);await f.tick(6000);
  assert.equal(f.state.authCalls,0);assert.equal(f.state.syncCalls,0);
  f.document.hidden=true;f.state.ready=true;
  await f.tick();await f.tick(60000);await f.click();
  assert.equal(f.state.syncCalls,0);assert.equal(f.state.authCalls,0);
  await f.returnToApp();assert.equal(f.state.syncCalls,1);
  f.unmount();assert.equal(f.docListeners.size,0);assert.equal(f.winListeners.size,0);assert.equal(f.timers.size,0);
});

test('only active unrelated clicks renew; a successful expiry rearms once',async()=>{
  const f=fixture();await f.mount();
  await f.click(true);assert.equal(f.state.authCalls,0);
  f.navigator.userActivation.isActive=false;await f.click();assert.equal(f.state.authCalls,0);
  f.navigator.userActivation.isActive=true;await f.click();assert.equal(f.state.authCalls,1);assert.equal(f.state.syncCalls,1);
  await f.click();assert.equal(f.state.authCalls,1);
  f.state.ready=false;f.state.live=false;await f.tick();assert.equal(f.state.authCalls,1);
  await f.click();assert.equal(f.state.authCalls,2);
  f.unmount();
});

test('failed renewal and widened live grants wait for explicit settings action',async()=>{
  const f=fixture();await f.mount();
  f.state.live=true;f.state.ready=false;await f.click();assert.equal(f.state.authCalls,0);
  f.state.live=false;f.state.authFailure=true;
  await f.click();assert.equal(f.state.authCalls,1);assert.equal(f.state.locked,true);
  await f.click();await f.tick();await f.returnToApp();assert.equal(f.state.authCalls,1);
  f.unmount();
});

test('late authorization from an old account cannot lock or sync a new one',async()=>{
  const f=fixture();let reject;
  f.state.authDeferred=new Promise((resolve,no)=>{reject=no;});
  await f.mount();await f.click();assert.equal(f.state.authCalls,1);
  f.state.account='person-b';reject(Error('calendar-account-changed'));await flush();
  assert.equal(f.state.locked,false);assert.equal(f.state.syncCalls,0);
  f.state.authDeferred=null;await f.click();assert.equal(f.state.authCalls,2);assert.equal(f.state.syncCalls,1);
  f.unmount();
});

test('client calendar exposes Connect and separate optional cycle without administrator setup',()=>{
  const f=fixture();f.state.cfg={clientId:'app-client',calId:'',cycle:false};
  const html=renderToStaticMarkup(React.createElement(f.ui.CalSettings,{open:true,togetherEnabled:true}));
  assert.match(html,/Connect Google Calendar/);
  assert.match(html,/data-calendar-controls/);
  assert.match(html,/aria-checked="false">My menstrual cycle/);
  assert.match(html,/Training/);
  assert.doesNotMatch(html,/Advanced connection settings|OAuth client ID|unverified/);
});

test('a legacy read-only primary grant offers explicit renewal for primary edits',()=>{
  const f=fixture({tmCalReady:cfg=>!cfg.allDayWrite});
  f.state.cfg.zpet='vse';f.state.cfg.allDayWrite=false;
  let html=renderToStaticMarkup(React.createElement(f.ui.CalSettings,{open:true}));
  assert.match(html,/Renew connection/);
  assert.doesNotMatch(html,/>Sync<\/button>/);
  f.state.cfg.zpet='tanmay';
  html=renderToStaticMarkup(React.createElement(f.ui.CalSettings,{open:true}));
  assert.match(html,/>Sync<\/button>/);
});
