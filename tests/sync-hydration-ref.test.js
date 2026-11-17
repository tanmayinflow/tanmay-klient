import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {createDocumentSyncQueue} from '../src/shared/product/documentSyncQueue.js';
import {bootstrapSyncDecision} from '../src/shared/product/bootstrapSync.js';

const source=readFileSync(new URL('../src/App.tsx',import.meta.url),'utf8');
const main=source.includes('const _handshake = React.useCallback');
const serialize=(coll,edits)=>JSON.stringify({coll,edits});
function setup(remote){
  const queuedRenders=[],writes=[],timers=[],localEdits={local:{note:'preserve if omitted'}};
  const noop=()=>{};
  const ctx={
    React:{useCallback:fn=>fn},_documentSyncQueue:{current:createDocumentSyncQueue()},
    _collRef:{current:{}},_editsRef:{current:localEdits},_syncReady:{current:false},_dirty:{current:false},
    _lastSynced:{current:serialize({},localEdits)},_rev:{current:0},_ver:{current:0},_druhSelhani:{current:null},
    _serializeDoc:serialize,_acknowledgeRemote:()=>false,syncMarkLoad:()=>null,tmDocSig:s=>s,
    bootstrapSyncDecision,syncMarkSave:noop,
    // Deliberately leave React setters uncommitted while the handshake and
    // immediate save callbacks finish, as a background/mobile render can do.
    setColl:value=>queuedRenders.push(['coll',value]),setEdits:value=>queuedRenders.push(['edits',value]),
    saveColl:noop,saveEdits:noop,setConflict:noop,setSyncErr:noop,setSyncPending:noop,setSyncOdlozeno:noop,
    setDocBytes:noop,setStateHydrated:noop,clientAccount:{isCurrent:()=>true},ownerId:'owner',
    TM_LOCAL_WRITER:{isPaused:()=>false},_readDoc:async()=>({doc:remote}),
    syncFetch:async(_url,options)=>{assert.equal(options,undefined,'hydration must not write directly');return {druh:'ok',telo:{doc:remote,version:8}};},
    SYNC_OK:'ok',oznamSelhani:()=>assert.fail('unexpected sync failure'),dead:false,reading:false,gc:null,
    setTimeout:(fn,delay)=>{if(delay===0)timers.push(fn);return 1;},
  };
  const write=()=>writes.push(serialize(ctx._collRef.current,ctx._editsRef.current));
  ctx._retrySyncRef={current:write};ctx._pushRef={current:write};
  return {ctx,queuedRenders,writes,timers,localEdits};
}

test('remote hydration publishes the complete document before autosave, even before React renders',async()=>{
  const remote={coll:{profile:{name:'Existing owner'},journal:[{id:'kept',text:'Existing private text'}]},edits:{'2026-11-16':{wb:{sleep:8}}},rev:7};
  const {ctx,queuedRenders,writes,timers}=setup(remote);
  let code;
  if(main){const start=source.indexOf('  const _handshake = React.useCallback');code=source.slice(start,source.indexOf('  // A local decision',start))+'; _handshake';}
  else {const start=source.indexOf('    const syncOnce = async () => {');code=source.slice(start,source.indexOf('    syncOnce();',start))+'; syncOnce';}
  const hydrate=vm.runInNewContext(code,ctx);
  await hydrate();
  for(const timer of timers)await timer();
  assert.equal(ctx._collRef.current,remote.coll,'autosave must see the adopted collection immediately');
  assert.equal(ctx._editsRef.current,remote.edits,'autosave must see the adopted daily records immediately');
  assert.equal(ctx._syncReady.current,true);
  assert.equal(ctx._lastSynced.current,serialize(remote.coll,remote.edits));
  assert.equal(queuedRenders.length,2,'React has not committed either state setter yet');
  assert.deepEqual(writes,[],'no empty or redundant startup write may precede the first render');
});

test('Client refresh/adoption updates autosave refs and preserves omitted daily records',{skip:main},()=>{
  for(const includeEdits of [true,false]){
    const remote={coll:{journal:[{id:'retained',text:'Remote record'}]},...(includeEdits?{edits:{day:{note:'server'}}}:{})};
    const {ctx,queuedRenders,localEdits}=setup(remote);
    const start=source.indexOf('  const adoptServer = '),end=source.indexOf('  // Jedno odeslání.',start);
    const adopt=vm.runInNewContext(source.slice(start,end)+'; adoptServer',ctx);
    adopt(remote,9);
    assert.equal(ctx._collRef.current,remote.coll);
    assert.equal(ctx._editsRef.current,includeEdits?remote.edits:localEdits);
    assert.equal(ctx._lastSynced.current,serialize(remote.coll,includeEdits?remote.edits:localEdits));
    assert.equal(queuedRenders.length,2);
  }
});
