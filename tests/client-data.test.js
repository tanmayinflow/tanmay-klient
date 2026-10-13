import test from 'node:test';
import assert from 'node:assert/strict';
import { buildClientBackup, changeClientPractice, readPracticeRecovery, clientDataAccess, clientSyncStatus } from '../src/clientData.js';

const OWNER='aaaaaaaaaaaaaaaa';
const coll={notebook:[{id:'note',title:'Vlastní poznámka',text:'jen moje'}],journal:[{id:'diary',text:'private'}],training:{sessions:[{id:'done'}]},praxeStart:'2026-01-01',modules:['praxe']};
const edits={'2026-10-01':{h:[1,2],note:'review',schedule:[{text:'walk'}]}};
function fixture(){
  const values=new Map([['tm_owner_v1',OWNER],['tanmay_coll_v1',JSON.stringify(coll)],['tanmay_edits_v1',JSON.stringify(edits)]]);
  return {values,getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};
}
const args=storage=>({storage,owner:OWNER,isCurrent:owner=>owner===storage.getItem('tm_owner_v1'),coll:structuredClone(coll),edits:structuredClone(edits),date:'2026-10-13',now:12});

test('export includes exactly supplied unsent document, readable duplicate-safe notes and scoped recovery',()=>{
  const source={...coll,notebook:[...coll.notebook,{id:'second',title:'Vlastní poznámka',folder:'../../escape',text:'second'}]};
  const files=buildClientBackup(source,edits,{date:'2026-10-13',safeName:s=>String(s).replace(/[\\/]/g,'-'),bodyOut:s=>String(s||'')});
  assert.deepEqual(JSON.parse(files.find(f=>f.path==='_data/coll.json').text),source);
  assert.deepEqual(JSON.parse(files.find(f=>f.path==='_data/edits.json').text),edits);
  assert.equal(new Set(files.map(f=>f.path)).size,files.length);
  assert.ok(files.every(f=>!f.path.split('/').includes('..')));
  assert.ok(files.some(f=>f.path.endsWith('Vlastní poznámka.md')&&f.text.includes('jen moje')));
  assert.match(files.find(f=>f.path==='README.md').text,/samostatná|Samostatná/);
  const circular={};circular.self=circular;
  assert.throws(()=>buildClientBackup(circular,{},{}));
});

test('reset saves recoverable history first and leaves notes, diary, training and definitions unchanged',()=>{
  const storage=fixture(),next=changeClientPractice(args(storage));
  assert.deepEqual(next.edits,{});
  assert.deepEqual(next.coll,{...coll,praxeStart:'2026-10-13'});
  assert.deepEqual(readPracticeRecovery(storage,OWNER)[0].edits,edits);
  assert.deepEqual(JSON.parse(storage.getItem('tanmay_edits_v1')),{});
  assert.deepEqual(coll.notebook,[{id:'note',title:'Vlastní poznámka',text:'jen moje'}]);
});

test('restoring history keeps newly recorded days and current non-practice data',()=>{
  const storage=fixture(),reset=changeClientPractice(args(storage));
  const freshEdits={'2026-10-01':{h:[2,2],note:'newer'},'2026-10-14':{note:'after reset'}};
  const freshColl={...reset.coll,notebook:[...reset.coll.notebook,{id:'new'}]};
  storage.setItem('tanmay_coll_v1',JSON.stringify(freshColl));storage.setItem('tanmay_edits_v1',JSON.stringify(freshEdits));
  const restored=changeClientPractice({...args(storage),coll:freshColl,edits:freshEdits,restore:true,now:14});
  assert.deepEqual(restored.edits,freshEdits);
  assert.deepEqual(restored.coll.notebook,freshColl.notebook);
  assert.equal(restored.coll.praxeStart,'2026-01-01');
  assert.equal(readPracticeRecovery(storage,OWNER)[0].restoredAt,14);
  assert.deepEqual(readPracticeRecovery(storage,OWNER)[0].edits,edits);
  assert.throws(()=>changeClientPractice({...args(storage),coll:restored.coll,edits:restored.edits,restore:true}),/no-recovery/);
});

test('recovery includes days not rewritten after reset and restores absent start field',()=>{
  const storage=fixture(),base={...coll};delete base.praxeStart;storage.setItem('tanmay_coll_v1',JSON.stringify(base));
  const reset=changeClientPractice({...args(storage),coll:base});
  const restored=changeClientPractice({...args(storage),coll:reset.coll,edits:reset.edits,restore:true});
  assert.deepEqual(restored.edits,edits);assert.ok(!Object.hasOwn(restored.coll,'praxeStart'));
});

test('account changes and stale documents cannot reset or read another account recovery',()=>{
  const storage=fixture();changeClientPractice(args(storage));
  storage.setItem('tm_owner_v1','bbbbbbbbbbbbbbbb');
  assert.deepEqual(readPracticeRecovery(storage,OWNER),[]);
  assert.throws(()=>changeClientPractice(args(storage)),/account-changed/);
  storage.setItem('tm_owner_v1',OWNER);
  assert.throws(()=>changeClientPractice(args(storage)),/document-changed/);
});

for(const failedKey of ['recovery','tanmay_coll_v1','tanmay_edits_v1'])test(`failed ${failedKey} write preserves original active document`,()=>{
  const storage=fixture(),originalSet=storage.setItem;let failed=false;
  storage.setItem=(key,value)=>{if(!failed&&key.includes(failedKey)){failed=true;throw Error('QuotaExceededError');}originalSet(key,value);};
  assert.throws(()=>changeClientPractice(args(storage)),/Quota/);
  assert.deepEqual(JSON.parse(storage.getItem('tanmay_coll_v1')),coll);
  assert.deepEqual(JSON.parse(storage.getItem('tanmay_edits_v1')),edits);
});

test('corrupt recovery is not replaced by a new reset',()=>{
  const storage=fixture(),key='tanmay_practice_recovery_v1__owner_'+OWNER;
  storage.setItem(key,'broken');assert.throws(()=>changeClientPractice(args(storage)));
  assert.equal(storage.getItem(key),'broken');
});

test('export and reset guards distinguish unsent backup from safe destructive action',()=>{
  const ready={owner:OWNER,storedOwner:OWNER,current:true,hydrated:true,member:true,status:'ready'};
  assert.deepEqual(clientDataAccess(ready),{canExport:true,canReset:true});
  for(const patch of [{hydrated:false},{conflict:{}},{storedOwner:'other'},{current:false},{member:false}])assert.deepEqual(clientDataAccess({...ready,...patch}),{canExport:false,canReset:false});
  for(const patch of [{pending:true},{error:{}},{status:'offline'},{status:'checking'}])assert.deepEqual(clientDataAccess({...ready,...patch}),{canExport:true,canReset:false});
});

test('sync never claims saved while unhydrated, offline, conflicted or waiting',()=>{
  assert.equal(clientSyncStatus({hydrated:false}),'loading');
  assert.equal(clientSyncStatus({hydrated:true,pending:true}),'pending');
  assert.equal(clientSyncStatus({hydrated:true,status:'offline'}),'offline');
  assert.equal(clientSyncStatus({hydrated:true,conflict:{},busy:true}),'conflict');
  assert.equal(clientSyncStatus({hydrated:true,status:'changed'}),'changed');
  assert.equal(clientSyncStatus({hydrated:true,status:'ready'}),'saved');
});
