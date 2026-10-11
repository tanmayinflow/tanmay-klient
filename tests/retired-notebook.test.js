import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {retiredPracticeCandidates,archiveRetiredPracticeNotes,prepareRetiredPracticeNotesV2,prepareRetiredPracticeNotesV3} from '../src/retiredNotebook.js';

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

// Synthetic bodies only: production contains fingerprints, never personal text.
const oldPractices=()=>Array.from({length:6},(_,index)=>({id:'historical-'+index,title:'Synthetic practice '+index,text:'Synthetic body '+index,date:'',tag:'Praxe'}));
const approvedFor=entries=>new Set(entries.map(entry=>createHash('sha256').update(JSON.stringify([entry.title,entry.text])).digest('hex')));
const prepareV2=(state,entries=oldPractices())=>prepareRetiredPracticeNotesV2(state,{approved:approvedFor(entries),now:123});
const earlyPractices=()=>Array.from({length:3},(_,index)=>({id:'early-'+index,title:'Synthetic earlier practice '+index,text:'Synthetic earlier body '+index,date:'',tag:'Practices'}));
const prepareV3=state=>prepareRetiredPracticeNotesV3(state,{approved:approvedFor(earlyPractices()),legacyApproved:approvedFor(oldPractices()),now:456});

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
const makeController=new Function('stateHydrated','member','conflict','clientAccount','ownerLoad','_collRef','prepareRetiredPracticeNotesV3','persistColl',`return async(cancelled=()=>false)=>{${controllerBody}}`);
test('V3 account controller waits for hydration/membership and rejects conflict or cancelled work',async()=>{
 for(const [hydrated,member,conflict,cancelled] of [[false,true,null,false],[true,false,null,false],[true,true,{},false],[true,true,null,true]]){
  let scans=0,writes=0;
  const run=makeController(hydrated,member,conflict,{getSnapshot:()=>({owner:'owner'}),isCurrent:()=>true},()=> 'owner',{current:{}},async()=>{scans++;return value=>value;},()=>writes++);
  await run(()=>cancelled);assert.equal(scans,0);assert.equal(writes,0);
 }
});
test('V3 account controller rechecks ownership after hashing and inside the state updater',async()=>{
 for(const switchAt of ['hash','write']){
  let owner='first',current={notebook:oldPractices()},writes=0;
  const account={getSnapshot:()=>({owner}),isCurrent:expected=>owner===expected};
  const run=makeController(true,true,null,account,()=>owner,{current},async state=>{const migrate=await prepareV3(state);if(switchAt==='hash')owner='second';return migrate;},update=>{writes++;if(switchAt==='write')owner='second';current=update(current);});
  await run();assert.equal(current.notebook.length,6);assert.equal(current.retiredPracticeNotesV3,undefined);assert.equal(writes,switchAt==='hash'?0:1);
 }
});
test('V3 account controller applies no result after effect cancellation while hashing',async()=>{
 let cancelled=false,current={notebook:oldPractices()},writes=0;
 const run=makeController(true,true,null,{getSnapshot:()=>({owner:'owner'}),isCurrent:()=>true},()=> 'owner',{current},async state=>{const migrate=await prepareV3(state);cancelled=true;return migrate;},update=>{writes++;current=update(current);});
 await run(()=>cancelled);assert.equal(writes,0);assert.equal(current.retiredPracticeNotesV3,undefined);
});
test('V3 trigger is independent of opening Notebook and reacts to account hydration, prior migration and a newer notebook',()=>{
 assert.doesNotMatch(app,/st\.importPractices\(\)/);
 assert.match(app,/\[ownerId, accountStatus, stateHydrated, member, conflict, coll\.notebook, coll\.retiredPracticeNotesV2, coll\.retiredPracticeNotesV3\]/);
 assert.equal((readFileSync(new URL('../src/retiredNotebook.js',import.meta.url),'utf8').match(/"[a-f0-9]{64}"/g)||[]).length,9);
});

test('V3 repairs the three earlier defaults even after a completed V2',async()=>{
 for(const practicesSeeded of [undefined,false,true]){
  const before={notebook:earlyPractices(),retiredPracticeNotesV1:true,retiredPracticeNotesV2:true,practicesSeeded};
  const after=(await prepareV3(before))(before);
  assert.equal(after.notebook.length,0);assert.equal(after.trash.length,3);assert.equal(after.retiredPracticeNotesV3,true);
  assert.deepEqual(after.trash.map(item=>item.data).reverse(),before.notebook);
  assert.equal(after.trash.every(item=>item.trashedAt===456&&item.entryKind==='notebook'),true);
 }
});

test('V3 covers both historical bundles on accounts that have not completed V2',async()=>{
 const notes=[...earlyPractices(),...oldPractices()],before={notebook:notes};
 const after=(await prepareV3(before))(before);
 assert.equal(after.notebook.length,0);assert.equal(after.trash.length,9);assert.equal(after.retiredPracticeNotesV2,true);
 assert.deepEqual(after.trash.map(item=>item.data).reverse(),notes);
});

test('V3 preserves documented tag/folder normalization without relaxing ownership metadata',async()=>{
 const original=earlyPractices(),normalized=original.map(entry=>({...entry,tag:'Praxe',tags:['Praxe'],folder:'Praxe'}));
 const changes=[{title:'Own title'},{text:'Own text'},{tag:'Own label'},{tags:['Practices','Own label']},{folder:'Own folder'},{date:'2026-10-11'},{star:true},{pinned:true},{att:[{name:'own.png'}]},{attachments:[{name:'own.png'}]},{custom:'mine'},{contentSource:{id:'resource'}}];
 const protectedNotes=changes.map((change,index)=>({...original[0],...change,id:'changed-'+index}));
 const before={notebook:[...normalized,...protectedNotes],retiredPracticeNotesV2:true},after=(await prepareV3(before))(before);
 assert.equal(after.trash.length,3);assert.deepEqual(after.notebook,protectedNotes);
});

test('V3 leaves 29 content resources and all other collections intact',async()=>{
 const resources=Array.from({length:29},(_,index)=>({...earlyPractices()[0],id:'resource-'+index,folder:'Sociální sítě/Podklady',contentSource:{version:'synthetic',id:'r'+index}}));
 const own={id:'own',title:'My own note',text:'My words',tag:'Praxe'};
 const before={notebook:[...earlyPractices(),...resources,own],retiredPracticeNotesV2:true,journal:[{id:'journal'}],socItems:[{id:'post'}],socHooks:[{id:'hook'}],contentImports:['version'],contentPolicies:['policy'],income:[{id:'income'}]};
 const after=(await prepareV3(before))(before);
 assert.deepEqual(after.notebook,[...resources,own]);assert.equal(after.trash.length,3);
 for(const key of ['journal','socItems','socHooks','contentImports','contentPolicies','income'])assert.equal(after[key],before[key]);
});

test('V3 is repeat-safe and respects both prior V2 restoration and deliberate V3 restoration',async()=>{
 const restoredV2=oldPractices()[0],before={notebook:[...earlyPractices(),restoredV2],retiredPracticeNotesV2:true,trash:[{tid:'unrelated'}]};
 const first=(await prepareV3(before))(before);
 assert.deepEqual(first.notebook,[restoredV2]);assert.equal(first.trash.length,4);
 assert.equal((await prepareV3(first))(first),first);
 const restored={...first,notebook:[...first.notebook,first.trash[0].data],trash:first.trash.slice(1)};
 assert.equal((await prepareV3(restored))(restored),restored);
});

test('V3 retries late hydration and concurrent edits instead of sealing a stale snapshot',async()=>{
 const before={notebook:[],retiredPracticeNotesV2:true},prepared=await prepareV3(before);
 const late={...before,notebook:earlyPractices()};assert.equal(prepared(late),late);assert.equal(late.retiredPracticeNotesV3,undefined);
 const pending=await prepareV3(late),edited={...late,notebook:late.notebook.map((entry,index)=>index===0?{...entry,text:'My newer words'}:entry)};
 assert.equal(pending(edited),edited);
 const after=(await prepareV3(edited))(edited);assert.equal(after.trash.length,2);assert.deepEqual(after.notebook,[edited.notebook[0]]);
});

test('V3 retries if V2 completes while hashing and preserves a previously restored six-record note',async()=>{
 const before={notebook:[...earlyPractices(),oldPractices()[0]]},pending=await prepareV3(before);
 const current={...before,retiredPracticeNotesV2:true};assert.equal(pending(current),current);
 const after=(await prepareV3(current))(current);assert.equal(after.trash.length,3);assert.deepEqual(after.notebook,[oldPractices()[0]]);
});

test('a fresh Client starts with an empty Notebook and no migration adds any default notes',async()=>{
 assert.match(app,/const NOTEBOOK_FULL\s*=\s*\[\s*\]/);
 assert.doesNotMatch(app,/const PRACTICES_SEED\s*=/);
 const before={notebook:[]},after=(await prepareV3(before))(before);
 assert.deepEqual(after.notebook,[]);assert.deepEqual(after.trash,[]);assert.equal(after.retiredPracticeNotesV3,true);
});
