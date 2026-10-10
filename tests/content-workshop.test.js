import test from 'node:test';
import assert from 'node:assert/strict';
import {isContentNote,validateContentSnapshot,contentSnapshotCopies,mergeContentSnapshot,newContentItem,exportContentSnapshot,fetchContentLibrary} from '../src/shared/product/contentWorkshop.js';
import {CONTENT_OWNER_SNAPSHOT} from '../src/shared/product/contentOwnerSnapshot.js';

const fixture=()=>({version:'test-v1',source:'Synthetic content-only test',socItems:[{...newContentItem('Draft','owner-post'),createdAt:0,pillar:'owner-pillar',script:'Draft text',zabery:[{p:'Wide shot',d:'4'}],vysl:{views:'20'}}],socHooks:[{id:'owner-hook',text:'Opening',status:'test'}],socPillars:[{id:'owner-pillar',cz:'Story',en:'Story'}],notebook:[{id:'owner-note',folder:'Sociální sítě/Podklady',title:'Resource',text:'Resource text',tags:['Podklady']}]});
test('Content ownership boundary accepts only exact room path',()=>{
  for(const folder of ['Sociální sítě','Sociální sítě/Podklady','Sociální sítě/Podklady/Nested'])assert.equal(isContentNote({folder}),true);
  for(const folder of ['Sociální sítě private','Sociální sítě2','Deník','Poznámky','',undefined])assert.equal(isContentNote({folder}),false);
});
test('Snapshot rejects every out-of-room collection and notebook note',()=>{
  for(const key of ['journal','income','expenses','clients','days','memento'])assert.throws(()=>validateContentSnapshot({...fixture(),[key]:[]}));
  assert.throws(()=>validateContentSnapshot({...fixture(),notebook:[{folder:'Private',text:'Never publish'}]}));
  assert.throws(()=>validateContentSnapshot({...fixture(),socItems:{}}));
});
test('Content snapshot uses stable independent IDs and maps pillar references',()=>{
  const a=contentSnapshotCopies(fixture()),b=contentSnapshotCopies(fixture());
  assert.deepEqual(a,b);assert.notEqual(a.socItems[0].id,'owner-post');assert.equal(a.socItems[0].pillar,a.socPillars[0].id);
  assert.deepEqual(a.socItems[0].zabery,[{p:'Wide shot',d:'4'}]);assert.equal(a.socItems[0].vysl.views,'20');
  a.notebook[0].tags.push('Own tag');assert.deepEqual(b.notebook[0].tags,['Podklady']);
});
test('Import appends without overwriting existing private client records',()=>{
  const own={id:'client',title:'My draft',script:'My words'},note={id:'private',folder:'Private',text:'Private text'},income={id:'money',amount:21};
  const before={socItems:[own],notebook:[note],income:[income],journal:[{id:'day',text:'Diary'}],nbFolders:['Private']};
  const after=mergeContentSnapshot(before,fixture());
  assert.deepEqual(after.socItems[0],own);assert.equal(after.notebook[0],note);assert.equal(after.income,before.income);assert.equal(after.journal,before.journal);
  assert.deepEqual(after.nbFolders,['Private','Sociální sítě/Podklady']);assert.equal(before.socItems.length,1);
});
test('Version flag prevents overwritten edits and reseeding trashed copies',()=>{
  const first=mergeContentSnapshot({},fixture());
  const edited={...first,socItems:[{...first.socItems[0],script:'My revision'}],notebook:[],trash:[{entryKind:'notebook',data:first.notebook[0]}]};
  assert.equal(mergeContentSnapshot(edited,fixture()),edited);
  const legacy={...edited,contentImports:[]};
  const repaired=mergeContentSnapshot(legacy,fixture());
  assert.equal(repaired.socItems.length,1);assert.equal(repaired.socItems[0].script,'My revision');assert.equal(repaired.notebook.length,0);
});
test('Import remains one-time after the user purges the copied record',()=>{
  const seeded=mergeContentSnapshot({},fixture());const removed={...seeded,socItems:[],trash:[]};assert.equal(mergeContentSnapshot(removed,fixture()),removed);
});
test('Imported resource categories remain filterable without taking private client categories',()=>{
  const own={id:'own-note',folder:'Private',tag:'Shared category',text:'Private note'};
  const snapshot=fixture();snapshot.notebook[0].tags=['Podklady','Shared category'];
  const next=mergeContentSnapshot({notebook:[own],nbTags:[['Shared category','rose'],['Poznámky','stone']]},snapshot,[['Poznámky','stone']]);
  assert.ok(next.nbTags.some(([name])=>name==='Podklady'));assert.equal(next.nbTagObor.Podklady,'soc');assert.equal(next.nbTagObor['Shared category'],undefined);assert.deepEqual(next.nbTags.find(([name])=>name==='Shared category'),['Shared category','rose']);
  const fresh=mergeContentSnapshot({},fixture(),[['Poznámky','stone'],['Vhledy','sage']]);assert.ok(fresh.nbTags.some(([name])=>name==='Vhledy'));assert.equal(fresh.nbTagObor.Podklady,'soc');
});
test('The public compatibility placeholder never contains owner content',()=>{
  assert.equal(CONTENT_OWNER_SNAPSHOT,null);
});
test('An explicit owner export is authoritative even when a collection is empty',()=>{
  const snapshot={...fixture(),socItems:[],notebook:[]};const imported=mergeContentSnapshot({},snapshot);assert.deepEqual(imported.socItems,[]);assert.deepEqual(imported.notebook,[]);
});
test('Scoped export cannot include another collection or a general notebook note',()=>{
  const content=fixture();const result=exportContentSnapshot({...content,journal:[{text:'Private diary'}],income:[{amount:123}],notebook:[...content.notebook,{folder:'Sociální sítě soukromé',title:'Private'},{folder:'Deník',text:'Secret'}]},{version:'export-test',source:'test'});
  assert.deepEqual(Object.keys(result.snapshot),['version','source','socItems','socHooks','socPillars','notebook','socTopics']);assert.equal(result.snapshot.notebook.length,1);assert.doesNotMatch(JSON.stringify(result.snapshot),/Private diary|Secret|Private/);assert.equal(validateContentSnapshot(result.snapshot),true);
});
test('Scoped export removes attachment payloads and auth references while preserving normal links',()=>{
  const c=fixture();c.notebook[0]={...c.notebook[0],att:[{r2id:'secret-file',data:'private-attachment'}],cover:{r2id:'private-cover'},text:'Body !img(secret-id|320) https://example.org/article https://app.tanmaypractice.com/api/files/private-id https://example.org/download?token=secret'};
  c.socItems[0].gdrive='https://drive.google.com/file/d/ordinary-content-link/view';c.socItems[0].accessToken='Never copy';
  const {snapshot,report}=exportContentSnapshot(c,{version:'export-test'}),serialized=JSON.stringify(snapshot);
  assert.doesNotMatch(serialized,/secret-file|private-attachment|private-cover|secret-id|private-id|token=secret|Never copy/);assert.match(serialized,/https:\/\/example.org\/article/);assert.match(serialized,/ordinary-content-link/);assert.equal(report.attachments,2);assert.equal(report.privateReferences,3);
});
test('Scoped export preserves all supported script, shot-list, workflow and results data',()=>{
  const c=fixture();c.socItems[0].kroky={0:true,1:false,private:'no'};c.socItems[0].zabery[0].r2id='not-exported';c.socItems[0].vysl.secret='not-exported';
  const {snapshot}=exportContentSnapshot(c,{version:'export-test'});assert.equal(snapshot.socItems[0].script,'Draft text');assert.deepEqual(snapshot.socItems[0].kroky,{0:true,1:false});assert.deepEqual(snapshot.socItems[0].zabery,[{p:'Wide shot',d:'4'}]);assert.deepEqual(snapshot.socItems[0].vysl,{views:'20'});
});
test('Authenticated delivery fails closed and never creates an import marker on failure',async()=>{
  for(const status of [401,403,404,503])await assert.rejects(()=>fetchContentLibrary(async()=>new Response('{}',{status})));
  await assert.rejects(()=>fetchContentLibrary(async()=>Response.json({...fixture(),journal:[]})));
  let call;
  const got=await fetchContentLibrary(async(...args)=>{call=args;return Response.json(fixture());});
  assert.equal(call[0],'/api/content-library');assert.equal(call[1].credentials,'same-origin');assert.equal(call[1].cache,'no-store');assert.deepEqual(got,fixture());
});
test('Published snapshots reject attachments and unknown nested fields',()=>{
  for(const property of ['att','cover','credentials','journal']){const c=fixture();c.socItems[0][property]=[];assert.throws(()=>validateContentSnapshot(c));}
  const c=fixture();c.socItems[0].vysl.private='secret';assert.throws(()=>validateContentSnapshot(c));
});
test('Scoped topic maps arrive through delivery without overwriting a client map',()=>{
  const map=[{cz:'Téma',en:'Topic',body:[['Myšlenka','Thought']]}],snapshot={...fixture(),socTopics:map};
  const exported=exportContentSnapshot(snapshot,{version:'topics'}).snapshot;assert.deepEqual(exported.socTopics,map);
  const state=mergeContentSnapshot({},exported);assert.deepEqual(state.socTopics,map);assert.notEqual(state.socTopics,map);
  const own=[{cz:'Vlastní',en:'Own',body:[]}];assert.equal(mergeContentSnapshot({socTopics:own},exported).socTopics,own);
  assert.throws(()=>validateContentSnapshot({...snapshot,socTopics:[{...map[0],private:[]}]}));
});
