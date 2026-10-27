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
  const state={cfg:{clientId:'app-client',calId:'own-calendar',horizon:14,zpet:'tanmay'},account:'person-a',ready:false,live:false,locked:false,authCalls:0,syncCalls:0,loadCalls:0,preparing:0,authFailure:false,restoreCalls:0,restoreReady:false,desired:[]};
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
    tmCalRestore:()=>{state.restoreCalls++;if(state.restoreDeferred)return state.restoreDeferred;if(state.restoreReady)state.ready=true;return Promise.resolve();},
    tmCalDesired:()=>state.desired,tmCalTz:()=>'',tmCalBody:x=>x,tmCalHash:x=>x,
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

test('opening and returning restores a saved connection without Google popups',async()=>{
  const f=fixture();f.state.restoreReady=true;await f.mount();
  assert.equal(f.state.restoreCalls,1);assert.equal(f.state.syncCalls,1);assert.equal(f.state.authCalls,0);
  await f.tick(60000);assert.equal(f.state.restoreCalls,2);assert.equal(f.state.syncCalls,2);
  f.state.ready=false;await f.returnToApp();assert.equal(f.state.ready,true);assert.equal(f.state.syncCalls,3);
  await f.click();assert.equal(f.state.authCalls,0);
  f.unmount();assert.equal(f.docListeners.size,0);assert.equal(f.winListeners.size,0);assert.equal(f.timers.size,0);
});

test('changed day plans sync automatically while unchanged plans wait for incoming polling',async()=>{
  const f=fixture();f.state.restoreReady=true;await f.mount();
  await f.tick();assert.equal(f.state.syncCalls,1);
  f.state.desired=[{key:'event',title:'New plan'}];await f.tick();assert.equal(f.state.syncCalls,2);
  await f.tick();assert.equal(f.state.syncCalls,2);
  await f.tick(60000);assert.equal(f.state.syncCalls,3);assert.equal(f.state.authCalls,0);f.unmount();
});

test('a failed initial configuration retries on return without a permission popup',async()=>{
  let attempts=0;
  const f=fixture({tmCalPrepare:()=>++attempts===1?Promise.reject(Error('offline')):Promise.resolve()});
  f.state.restoreReady=true;await f.mount();
  assert.equal(f.state.syncCalls,0);assert.equal(f.state.restoreCalls,0);
  await f.returnToApp();
  assert.equal(attempts,2);assert.equal(f.state.restoreCalls,1);assert.equal(f.state.syncCalls,1);
  assert.equal(f.state.authCalls,0);f.unmount();
});

test('hidden app suspends restoration and synchronization, denied grants never trigger popups',async()=>{
  const f=fixture();await f.mount();
  await f.click();await f.tick();assert.equal(f.state.authCalls,0);assert.equal(f.state.syncCalls,0);
  f.document.hidden=true;const before=f.state.restoreCalls;f.state.ready=true;
  await f.tick();await f.tick(60000);await f.click();assert.equal(f.state.restoreCalls,before);assert.equal(f.state.syncCalls,0);
  await f.returnToApp();assert.equal(f.state.syncCalls,1);f.unmount();
});

test('late restoration for an old account cannot synchronize the new one',async()=>{
  const f=fixture();let resolve;f.state.restoreDeferred=new Promise(yes=>{resolve=yes;});
  await f.mount();f.state.account='person-b';f.state.ready=true;resolve();await flush();
  assert.equal(f.state.syncCalls,0);assert.equal(f.state.authCalls,0);f.unmount();
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

test('read-only primary access does not ask for unrelated write permission',()=>{
  const f=fixture({tmCalReady:cfg=>!cfg.allDayWrite});
  f.state.cfg.zpet='vse';f.state.cfg.allDayWrite=false;
  const html=renderToStaticMarkup(React.createElement(f.ui.CalSettings,{open:true}));
  assert.match(html,/>Sync<\/button>/);assert.doesNotMatch(html,/Renew connection/);
  assert.match(html,/exact times/);
});
