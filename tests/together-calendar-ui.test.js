import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';

const inApp=fs.existsSync(new URL('../src/shared/ui/togetherCalendarSync.jsx',import.meta.url));
const require=createRequire(inApp?import.meta.url:new URL('../../../Source/tanmay-web/package.json',import.meta.url));
const React=require('react'),ts=require('typescript');
const base=inApp?'../src/shared/':'../';
const {emptyTogetherCalendar,TOGETHER_CALENDAR_SCOPE}=await import(new URL(base+'product/togetherCalendarSync.js',import.meta.url));
const source=fs.readFileSync(new URL(base+'ui/togetherCalendarSync.jsx',import.meta.url),'utf8');
const code=ts.transpileModule(source,{compilerOptions:{jsx:ts.JsxEmit.React,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;

function elements(node){
  if(Array.isArray(node))return node.flatMap(elements);
  return React.isValidElement(node)?[node,...elements(node.props.children)]:[];
}

// Exercise the component's real click/effect callbacks, with a held OAuth
// response and invalidatable account. Geometry is covered by browser checks.
function fixture({googleLoaded=true}={}){
  const state={account:'person-a',verified:true,gesture:false,auth:[],api:[],google:[],sessions:[],syncs:0,refreshes:0,time:0};
  const slots=[],effects=[],timers=[];let cursor=0,dirty=true,tree,callback;
  const react={...React,
    useState(initial){const i=cursor++;if(!(i in slots))slots[i]=typeof initial==='function'?initial():initial;return [slots[i],next=>{const value=typeof next==='function'?next(slots[i]):next;if(!Object.is(value,slots[i])){slots[i]=value;dirty=true;}}];},
    useRef(initial){const i=cursor++;return slots[i]||={current:initial};},
    useMemo(fn,deps){const i=cursor++;if(!slots[i]||deps.some((d,n)=>!Object.is(d,slots[i].deps[n])))slots[i]={deps,value:fn()};return slots[i].value;},
    useEffect(fn,deps){const i=cursor++;if(!slots[i]||deps.some((d,n)=>!Object.is(d,slots[i].deps[n]))){const old=slots[i];slots[i]={deps};effects.push(()=>{old?.cleanup?.();slots[i].cleanup=fn();});}},
  };
  const window={addEventListener(){},removeEventListener(){},dispatchEvent(){}};
  const installGoogle=()=>{window.google={accounts:{oauth2:{
    initTokenClient(options){callback=options.callback;return {requestAccessToken(request){state.auth.push({gesture:state.gesture,options,request});}};},
    hasGrantedAllScopes:response=>response.scope===TOGETHER_CALENDAR_SCOPE,
  }}};};
  if(googleLoaded)installGoogle();
  const checked=account=>state.verified&&account===state.account;
  const assertVerified=()=>assert.equal(checked('person-a'),true,'Calendar access must follow verification');
  let config=emptyTogetherCalendar();
  const module={exports:{}};
  vm.runInNewContext(code,{module,exports:module.exports,window,
    document:{querySelector:()=>null,createElement:()=>({dataset:{}}),head:{append(){}}},
    Date:class extends Date{static now(){return state.time;}},
    Event:class{},setTimeout:fn=>timers.push(fn),
    fetch:async(path,options={})=>{assertVerified();state.api.push({path,options});let data;
      if(path==='/api/calendar/config')data={ok:true,configured:true,clientId:'public-client.apps.googleusercontent.com'};
      else if(path==='/api/together/calendar'){if(options.method==='PUT')config=JSON.parse(options.body).config;data={ok:true,config,revision:0};}
      else if(path==='/api/together')data={ok:true,link:{id:'pair',status:'active'}};
      else assert.fail('Unexpected API '+path);
      return {ok:true,json:async()=>data};
    },
    require:id=>{
      if(id==='react')return react;
      if(id==='./personalProfile.jsx')return {usePersonalProfile:()=>({accountKey:state.account,status:'ready'}),isPersonalProfileVerified:checked,refreshPersonalProfile:async()=>{state.refreshes++;}};
      if(id==='../product/togetherCalendarSync.js')return {emptyTogetherCalendar,TOGETHER_CALENDAR_SCOPE,googleCalendarRequest:async(_token,path)=>{assertVerified();state.google.push(path);return {id:'created-calendar'};}};
      if(id==='../product/togetherCalendarRun.js')return {syncTogetherCalendar:async()=>{assertVerified();state.syncs++;return {imported:0,exported:0};}};
      if(id==='../product/togetherCalendarSession.js')return {calendarSession:()=>null,setCalendarSession:value=>state.sessions.push(value),clearOtherCalendarSession(){},beginCalendarSync:()=>true,endCalendarSync(){}};
      throw Error('Unexpected import '+id);
    }});
  function render(){cursor=0;dirty=false;tree=module.exports.TogetherCalendarSettings({lang:'en'});for(const effect of effects.splice(0))effect();return tree;}
  async function settle(){for(let i=0;i<40;i++){if(dirty)render();await Promise.resolve();}if(dirty)render();}
  const connectButton=()=>elements(tree).find(node=>node.type==='div'&&node.props.className==='tm-personal-actions').props.children[0];
  return {state,installGoogle,settle,connectButton,
    async mount(){render();await settle();},
    click(){const button=connectButton();assert.equal(button.props.disabled,false);state.gesture=true;const promise=button.props.onClick();state.gesture=false;return promise;},
    respond(scope=TOGETHER_CALENDAR_SCOPE){callback({access_token:'test-token',expires_in:3600,scope});},
    async expireLoad(){state.time=12001;for(const timer of timers.splice(0))timer();await settle();},
    text(){return elements(tree).filter(node=>node.type==='p').map(node=>node.props.children).join(' ');},
  };
}

test('Spolu opens OAuth synchronously in the tap, then verifies before calendar access',async()=>{
  const f=fixture();await f.mount();
  const apiBefore=f.state.api.length;
  const pending=f.click();
  assert.equal(f.state.auth.length,1,'The popup must open before the first awaited boundary');
  assert.equal(f.state.auth[0].gesture,true);
  assert.equal(f.state.auth[0].options.include_granted_scopes,false);
  assert.equal(f.state.api.length,apiBefore);assert.equal(f.state.google.length,0);
  f.respond();await pending;await f.settle();
  assert.deepEqual(f.state.google,['/calendars']);assert.equal(f.state.sessions.length,1);assert.equal(f.state.syncs,1);
});

test('Spolu refuses stale-account authorization before any app or Google calendar request',async()=>{
  const f=fixture();await f.mount();const pending=f.click(),apiBefore=f.state.api.length;
  f.state.account='person-b';f.respond();await pending;
  assert.equal(f.state.refreshes,1);assert.equal(f.state.api.length,apiBefore);
  assert.equal(f.state.google.length,0);assert.equal(f.state.sessions.length,0);assert.equal(f.state.syncs,0);
});

test('Spolu library loading and retry never authorize after a delayed load',async()=>{
  const f=fixture({googleLoaded:false});await f.mount();
  assert.equal(f.connectButton().props.disabled,true);assert.equal(f.connectButton().props.children,'Loading Google…');
  await f.expireLoad();assert.equal(f.connectButton().props.disabled,false);assert.equal(f.connectButton().props.children,'Retry loading Google');
  f.installGoogle();await f.click();await f.settle();
  assert.equal(f.state.auth.length,0,'Loading completion must not open a popup');
  assert.equal(f.connectButton().props.children,'Connect Google');
  const pending=f.click();assert.equal(f.state.auth.length,1);assert.equal(f.state.auth[0].gesture,true);
  f.respond();await pending;
});

test('Spolu requires its granted scope and a currently verified account',async()=>{
  const f=fixture();await f.mount();f.state.verified=false;
  await f.click();assert.equal(f.state.auth.length,0);
  f.state.verified=true;const pending=f.click(),apiBefore=f.state.api.length;
  f.respond('openid email');await pending;await f.settle();
  assert.equal(f.state.api.length,apiBefore);assert.equal(f.state.google.length,0);assert.equal(f.state.sessions.length,0);
  assert.match(f.text(),/Google did not grant access/);
});
