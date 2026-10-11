import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {retiredPracticeCandidates,archiveRetiredPracticeNotes,prepareRetiredPracticeNotesV2} from '../src/retiredNotebook.js';

test('only unchanged historical defaults move to recoverable trash',async()=>{
 const old={id:'seed',title:'Synthetic default',text:'Synthetic text',date:''};
 const digest=createHash('sha256').update(JSON.stringify([old.title,old.text])).digest('hex');
 const own={id:'own',title:'My note',text:'My words'};
 const edited={...old,id:'edited',text:'My edited text'};
 const attached={...old,id:'attached',att:[{name:'own.png'}]};
 const starred={...old,id:'starred',star:true};
 const candidates=await retiredPracticeCandidates([old,own,edited,attached,starred],new Set([digest]));
 assert.deepEqual(candidates.map(x=>x.id),['seed']);
 const next=archiveRetiredPracticeNotes({notebook:[old,own,edited,attached,starred],trash:[]},candidates,123);
 assert.deepEqual(next.notebook,[own,edited,attached,starred]);
 assert.deepEqual(next.trash[0].data,old);
 assert.equal(next.trash[0].trashedAt,123);
 assert.equal(next.retiredPracticeNotesV1,true);
 assert.deepEqual(archiveRetiredPracticeNotes(next,candidates,456),next);
});
test('edits made while fingerprinting finishes are preserved',()=>{
 const current={id:'seed',title:'Changed title',text:'Original text'};
 const result=archiveRetiredPracticeNotes({notebook:[current]},[{id:'seed',signature:JSON.stringify(['Old title','Original text'])}]);
 assert.deepEqual(result.notebook,[current]);
 assert.deepEqual(result.trash,[]);
});

// Synthetic bodies only: the production module retains the same six hashes.
const oldPractices=()=>Array.from({length:6},(_,index)=>({id:'historical-'+index,title:'Synthetic practice '+index,text:'Synthetic body '+index,date:'',tag:'Praxe'}));
const approvedFor=entries=>new Set(entries.map(entry=>createHash('sha256').update(JSON.stringify([entry.title,entry.text])).digest('hex')));
const prepareV2=(state,entries=oldPractices())=>prepareRetiredPracticeNotesV2(state,{approved:approvedFor(entries),now:123});

test('V2 repairs all six defaults regardless of missing/false seed flag or prematurely completed V1',async()=>{
 for(const practicesSeeded of [undefined,false,true])for(const retiredPracticeNotesV1 of [undefined,true]){
  const notes=oldPractices(),before={practicesSeeded,retiredPracticeNotesV1,notebook:notes};
  const after=(await prepareV2(before))(before);
  assert.equal(after.notebook.length,0);assert.equal(after.trash.length,6);assert.equal(after.retiredPracticeNotesV2,true);
  assert.deepEqual(after.trash.map(item=>item.data).reverse(),notes);assert.equal(after.trash.every(item=>item.trashedAt===123),true);
  assert.equal(before.notebook.length,6);
 }
});
test('V2 accepts only original fields and documented practice folder/tag normalizations',async()=>{
 const notes=oldPractices(),normalized=notes.map((entry,index)=>({...entry,tag:index%2?'Practices':'Praxe',tags:[index%2?'Practices':'Praxe'],folder:'Praxe'}));
 const before={notebook:normalized},after=(await prepareV2(before))(before);
 assert.equal(after.notebook.length,0);assert.equal(after.trash.length,6);
});
test('V2 preserves own wording, folder, labels, attached media, flags and arbitrary extra fields',async()=>{
 const entry=oldPractices()[0];
 const changes=[{title:'Own title'},{text:'Own body'},{folder:'Own folder'},{tag:'Own label'},{tags:['Praxe','Own label']},{star:true},{pinned:true},{date:'2026-10-11'},{att:[{name:'own.png'}]},{attachments:[{name:'own.png'}]},{contentSource:{version:'approved-content',id:'resource'}},{custom:'own value'}];
 const notes=changes.map((change,index)=>({...entry,...change,id:'own-'+index}));
 const before={notebook:notes},after=(await prepareV2(before))(before);
 assert.deepEqual(after.notebook,notes);assert.deepEqual(after.trash,[]);
});
test('V2 preserves all 29 content resources, unrelated notebook entries and other collections',async()=>{
 const resources=Array.from({length:29},(_,index)=>({...oldPractices()[0],id:'resource-'+index,folder:'Sociální sítě/Podklady',contentSource:{version:'synthetic',id:'r'+index}}));
 const independent=Array.from({length:34},(_,index)=>({id:'own-note-'+index,title:'Own notebook '+index,text:'Own text '+index}));
 const before={notebook:[...oldPractices(),...resources,...independent],journal:[{id:'journal'}],socItems:[{id:'post'}],socHooks:[{id:'hook'}],contentImports:['synthetic'],contentPolicies:['policy'],income:[{id:'income'}]};
 const after=(await prepareV2(before))(before);
 assert.deepEqual(after.notebook,[...resources,...independent]);assert.equal(after.trash.length,6);
 for(const key of ['journal','socItems','socHooks','contentImports','contentPolicies','income'])assert.equal(after[key],before[key]);
});
test('V2 refuses to seal an older snapshot; a retry inspects all six late-arriving notes',async()=>{
 const empty={notebook:[],retiredPracticeNotesV1:true},prepared=await prepareV2(empty);
 const latest={...empty,notebook:oldPractices()};assert.equal(prepared(latest),latest);assert.equal(latest.retiredPracticeNotesV2,undefined);
 const retried=(await prepareV2(latest))(latest);assert.equal(retried.notebook.length,0);assert.equal(retried.trash.length,6);
});
test('V2 aborts when wording or metadata changes during preparation and preserves those changes on retry',async()=>{
 const before={notebook:oldPractices()},prepared=await prepareV2(before);
 const latest={...before,notebook:before.notebook.map((entry,index)=>index===0?{...entry,text:'A newer client edit'}:index===1?{...entry,folder:'My new folder'}:entry)};
 assert.equal(prepared(latest),latest);assert.equal(latest.retiredPracticeNotesV2,undefined);
 const retried=(await prepareV2(latest))(latest);assert.deepEqual(retried.notebook,latest.notebook.slice(0,2));assert.equal(retried.trash.length,4);
});
test('V2 is idempotent, keeps unrelated concurrent changes and does not remove a deliberately restored copy',async()=>{
 const before={notebook:oldPractices(),trash:[{tid:'other',entryKind:'notebook',data:{id:'other'}}]},prepared=await prepareV2(before);
 const current={...before,journal:[{id:'new-journal'}]},first=prepared(current);
 assert.equal(first.journal,current.journal);assert.equal(first.trash.at(-1),before.trash[0]);
 assert.equal((await prepareV2(first))(first),first);
 const restored={...first,notebook:[first.trash[0].data],trash:first.trash.slice(1)};
 assert.equal((await prepareV2(restored))(restored),restored);
});

const app=readFileSync(new URL('../src/App.tsx',import.meta.url),'utf8');
const controllerBody=app.match(/const importPractices = async \(cancelled = \(\) => false\) => \{([\s\S]*?)\n  \};/)[1];
const makeController=new Function('stateHydrated','member','conflict','clientAccount','ownerLoad','_collRef','prepareRetiredPracticeNotesV2','persistColl',`return async(cancelled=()=>false)=>{${controllerBody}}`);
test('V2 account controller waits for hydration/membership and rejects conflict or cancelled work',async()=>{
 for(const [hydrated,member,conflict,cancelled] of [[false,true,null,false],[true,false,null,false],[true,true,{},false],[true,true,null,true]]){
  let scans=0,writes=0;
  const run=makeController(hydrated,member,conflict,{getSnapshot:()=>({owner:'owner'}),isCurrent:()=>true},()=> 'owner',{current:{}},async()=>{scans++;return value=>value;},()=>writes++);
  await run(()=>cancelled);assert.equal(scans,0);assert.equal(writes,0);
 }
});
test('V2 account controller rechecks ownership after hashing and inside the state updater',async()=>{
 for(const switchAt of ['hash','write']){
  let owner='first',current={notebook:oldPractices()},writes=0;
  const account={getSnapshot:()=>({owner}),isCurrent:expected=>owner===expected};
  const run=makeController(true,true,null,account,()=>owner,{current},async state=>{const migrate=await prepareV2(state);if(switchAt==='hash')owner='second';return migrate;},update=>{writes++;if(switchAt==='write')owner='second';current=update(current);});
  await run();assert.equal(current.notebook.length,6);assert.equal(current.retiredPracticeNotesV2,undefined);assert.equal(writes,switchAt==='hash'?0:1);
 }
});
test('V2 account controller applies no result after effect cancellation while hashing',async()=>{
 let cancelled=false,current={notebook:oldPractices()},writes=0;
 const run=makeController(true,true,null,{getSnapshot:()=>({owner:'owner'}),isCurrent:()=>true},()=> 'owner',{current},async state=>{const migrate=await prepareV2(state);cancelled=true;return migrate;},update=>{writes++;current=update(current);});
 await run(()=>cancelled);assert.equal(writes,0);assert.equal(current.retiredPracticeNotesV2,undefined);
});
test('V2 trigger is independent of opening Notebook and reacts to account hydration and a newer notebook',()=>{
 assert.doesNotMatch(app,/st\.importPractices\(\)/);
 assert.match(app,/\[ownerId, accountStatus, stateHydrated, member, conflict, coll\.notebook, coll\.retiredPracticeNotesV2\]/);
 assert.equal((readFileSync(new URL('../src/retiredNotebook.js',import.meta.url),'utf8').match(/"[a-f0-9]{64}"/g)||[]).length,6);
});
