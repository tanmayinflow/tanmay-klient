import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

// Execute the actual component effect with a native-dialog stand-in. The
// shared lock stays real, so a missing or excess unlock is observable.
const require=createRequire(path.resolve('package.json'));
const ts=require('typescript');
const canonicalRoot=fileURLToPath(new URL('../',import.meta.url));
const sourceRoot=fs.existsSync(path.join(canonicalRoot,'ui/skyUi.jsx'))?canonicalRoot:'src/shared';
function harness(){
  const cache=new Map(),effects=[],attrs=new Map(),focusCalls=[];
  const body={style:{}},root={style:{},getAttribute:key=>attrs.get(key)??null,setAttribute:(key,value)=>attrs.set(key,String(value)),removeAttribute:key=>attrs.delete(key)};
  const prior={isConnected:true,focus:options=>focusCalls.push(options)};
  globalThis.document={body,documentElement:root,activeElement:prior};
  globalThis.window={scrollY:517,pageYOffset:517,scrollTo(_x,y){this.scrollY=y;}};
  const react={
    createElement:(type,props,...children)=>({type,props:{...props,children}}),
    useEffect:fn=>effects.push(fn),useRef:current=>({current}),useId:()=>':sky-dialog-test:',
  };
  function load(file){
    const full=path.resolve(file);if(cache.has(full))return cache.get(full);
    const code=ts.transpileModule(fs.readFileSync(full,'utf8'),{compilerOptions:{jsx:ts.JsxEmit.React,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
    const module={exports:{}};cache.set(full,module.exports);
    new vm.Script(`(function(require,module,exports){${code}\n})`,{filename:full}).runInThisContext()(id=>id==='react'?react:id==='react-dom'?{createPortal:child=>child}:id.startsWith('.')?load(path.resolve(path.dirname(full),id)):require(id),module,module.exports);
    return module.exports;
  }
  const {SkyDialog}=load(path.join(sourceRoot,'ui/skyUi.jsx'));
  const locks=load(path.join(sourceRoot,'ui/overlay.js'));
  function open({suspended=false,fail=false}={}){
    effects.length=0;
    const element=SkyDialog({title:'Detail dne',onClose:()=>{},children:'Day detail',t:{},suspended});
    const node={opened:0,closed:0,showModal(){if(fail)throw new Error('dialog unavailable');this.opened++;},close(){this.closed++;}};
    element.props.ref.current=node;
    return {node,start:()=>effects[0]()};
  }
  return {open,locks,body,root,prior,focusCalls};
}

test('native Sky detail locks the mobile canvas and restores scroll and focus on close',()=>{
  const h=harness(),dialog=h.open(),close=dialog.start();
  assert.equal(dialog.node.opened,1);
  assert.equal(h.locks.tmZamekPocet(),1);
  assert.equal(h.body.style.position,'fixed');assert.equal(h.body.style.top,'-517px');
  assert.equal(h.root.getAttribute('data-tm-scroll-locked'),'true');
  window.scrollY=0;close();
  assert.equal(dialog.node.closed,1);assert.equal(h.locks.tmZamekPocet(),0);
  assert.equal(h.body.style.position,'');assert.equal(window.scrollY,517);
  assert.equal(h.root.getAttribute('data-tm-scroll-locked'),null);
  assert.deepEqual(h.focusCalls,[{preventScroll:true}]);
});

test('closing Sky detail over a sheet keeps the underlying sheet and canvas locked',()=>{
  const h=harness();h.locks.tmZamkniStranku();
  const close=h.open().start();assert.equal(h.locks.tmZamekPocet(),2);
  close();assert.equal(h.locks.tmZamekPocet(),1);
  assert.equal(h.body.style.position,'fixed');assert.equal(h.body.style.overflow,'hidden');
  assert.equal(h.root.getAttribute('data-tm-scroll-locked'),'true');
  h.locks.tmOdemkniStranku();assert.equal(h.body.style.position,'');
});

test('a nested shared layer keeps its lock if its Sky parent closes first',()=>{
  const h=harness(),close=h.open().start();h.locks.tmZamkniStranku();
  close();assert.equal(h.locks.tmZamekPocet(),1);assert.equal(h.body.style.position,'fixed');
  h.locks.tmOdemkniStranku();assert.equal(h.root.getAttribute('data-tm-scroll-locked'),null);
});

test('suspending and resuming Sky detail balances locks without opening a hidden dialog',()=>{
  const h=harness(),close=h.open().start();close();
  const suspended=h.open({suspended:true});assert.equal(suspended.start(),undefined);
  assert.equal(suspended.node.opened,0);assert.equal(h.locks.tmZamekPocet(),0);
  const resumed=h.open(),closeResumed=resumed.start();
  assert.equal(resumed.node.opened,1);assert.equal(h.locks.tmZamekPocet(),1);
  closeResumed();assert.equal(h.locks.tmZamekPocet(),0);
});

test('native showModal failure releases only the failed dialog lock',()=>{
  const h=harness();h.locks.tmZamkniStranku();
  assert.throws(()=>h.open({fail:true}).start(),/dialog unavailable/);
  assert.equal(h.locks.tmZamekPocet(),1);assert.equal(h.body.style.position,'fixed');
  h.locks.tmOdemkniStranku();assert.equal(h.locks.tmZamekPocet(),0);
});

test('closing the detail releases its lock even if the native close throws',()=>{
  const h=harness(),dialog=h.open(),close=dialog.start();
  dialog.node.close=()=>{throw new Error('native close failed');};
  assert.throws(close,/native close failed/);
  assert.equal(h.locks.tmZamekPocet(),0);assert.equal(h.body.style.position,'');
});
