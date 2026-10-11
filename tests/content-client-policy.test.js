import test from 'node:test';
import assert from 'node:assert/strict';
import {newContentItem,contentSnapshotCopies,mergeContentSnapshot,projectClientContentLibrary,validateContentSnapshot,exportContentSnapshot} from '../src/shared/product/contentWorkshop.js';
import {CLIENT_CONTENT_TOPICS,prepareContentClientMigration,contentFingerprint} from '../src/shared/product/contentClientPolicy.js';
import {migrateNotebookArtCategory} from '../src/shared/product/notebookCategories.js';
import {setLang,LV} from '../src/shared/lang/lang.js';

const snapshot=()=>({version:'editorial-test-v1',source:'Synthetic only',socItems:[{...newContentItem('Greetings!','hello'),createdAt:0},{...newContentItem('Retired example','old'),createdAt:0},{...newContentItem('Edited example','edit'),createdAt:0}],socHooks:[{id:'h',text:'A sample opening'}],socPillars:[{id:'p',cz:'A sample pillar',en:'A sample pillar'}],notebook:[{id:'n',folder:'Sociální sítě/Podklady',text:'A sample resource'}],socTopics:[{cz:'Original sample group',en:'Original sample group',body:[['Original sample topic','Original sample topic']]}]});

test('Client projection keeps only Greetings and generic topics while retaining resources, hooks and pillars',async()=>{
  const original=snapshot(),before=JSON.stringify(original),projected=await projectClientContentLibrary(original);
  assert.deepEqual(projected.socItems.map(row=>row.title),['Greetings!']);assert.deepEqual(projected.socTopics,CLIENT_CONTENT_TOPICS);
  for(const key of ['notebook','socHooks','socPillars'])assert.deepEqual(projected[key],original[key]);
  assert.equal(projected.version,original.version);assert.equal(validateContentSnapshot(projected),true);
  assert.equal(projected.clientPolicy.retiredCopies.length,2);assert.doesNotMatch(JSON.stringify(projected),/Retired example|Edited example|Original sample/);
  assert.equal(JSON.stringify(original),before);
});

test('Projection is deterministic and does not invent Greetings when the approved export lacks it',async()=>{
  assert.deepEqual(await projectClientContentLibrary(snapshot()),await projectClientContentLibrary(snapshot()));
  const source=snapshot();source.socItems=[];assert.deepEqual((await projectClientContentLibrary(source)).socItems,[]);
});

test('Client policy rejects unknown metadata, malformed digests and duplicate retired IDs',async()=>{
  const projected=await projectClientContentLibrary(snapshot());
  for(const policy of [{...projected.clientPolicy,privateText:'not allowed'},{...projected.clientPolicy,topicsSha256:'not-a-hash'},{...projected.clientPolicy,retiredCopies:[...projected.clientPolicy.retiredCopies,projected.clientPolicy.retiredCopies[0]]}])assert.throws(()=>validateContentSnapshot({...projected,clientPolicy:policy}));
});

test('Legacy client migration trashes only unchanged imported copies and archives only the unchanged topic map',async()=>{
  const original=snapshot(),imported=mergeContentSnapshot({},original),projected=await projectClientContentLibrary(original);
  const own={id:'my-own',title:'My own post'},edited={...imported.socItems[2],script:'My changed text'};
  const before={...imported,socItems:[imported.socItems[0],imported.socItems[1],edited,own],journal:[{id:'private-day'}],income:[{id:'private-income'}]};
  const migrate=await prepareContentClientMigration(before,projected,{now:10});
  const next=mergeContentSnapshot(migrate(before),projected);
  assert.deepEqual(next.socItems.map(row=>row.id),[imported.socItems[0].id,edited.id,own.id]);
  assert.equal(next.socItems[1],edited);assert.equal(next.socItems[2],own);
  const removed=next.trash.find(row=>row.entryKind==='socItems');assert.equal(removed.data,imported.socItems[1]);assert.equal(removed.trashedAt,10);
  const topics=next.trash.find(row=>row.entryKind==='notebook');assert.deepEqual(topics.data.contentTopicsArchive,original.socTopics);
  assert.deepEqual(next.socTopics,CLIENT_CONTENT_TOPICS);assert.equal(next.notebook.length,1);assert.equal(next.socHooks.length,1);assert.equal(next.socPillars.length,1);
  assert.equal(next.journal,before.journal);assert.equal(next.income,before.income);assert.equal(before.socItems.length,4);
});

test('Migration is idempotent, does not repeat after restore and never reseeds a discarded copy',async()=>{
  const source=snapshot(),projected=await projectClientContentLibrary(source),initial=mergeContentSnapshot({},source);
  const first=mergeContentSnapshot((await prepareContentClientMigration(initial,projected))(initial),projected);
  assert.equal((await prepareContentClientMigration(first,projected))(first),first);
  const removed=first.trash.find(row=>row.entryKind==='socItems'),restored={...first,socItems:[...first.socItems,removed.data],trash:[]};
  assert.equal((await prepareContentClientMigration(restored,projected))(restored),restored);
  const discarded={...first,socItems:[],trash:[]};assert.equal(mergeContentSnapshot((await prepareContentClientMigration(discarded,projected))(discarded),projected),discarded);
});

test('Edits made while asynchronous migration is prepared are preserved',async()=>{
  const source=snapshot(),projected=await projectClientContentLibrary(source),before=mergeContentSnapshot({},source);
  const migrate=await prepareContentClientMigration(before,projected);
  const changedItem={...before.socItems[1],note:'A newer edit'},changedTopics=[{cz:'My newer group',en:'My newer group',body:[]}];
  const latest={...before,socItems:[before.socItems[0],changedItem],socTopics:changedTopics};
  const after=migrate(latest);assert.equal(after.socItems[1],changedItem);assert.equal(after.socTopics,changedTopics);assert.equal(after.trash.length,0);
});

test('An independent client map or a same-titled own post never qualifies for automatic removal',async()=>{
  const source=snapshot(),projected=await projectClientContentLibrary(source),copied=contentSnapshotCopies(source);
  const own={...copied.socItems[1],id:'independent',contentSource:undefined};
  const map=[{cz:'My personal topic',en:'My personal topic',body:[]}];
  const state={socItems:[own],socTopics:map};const after=(await prepareContentClientMigration(state,projected))(state);
  assert.equal(after.socItems[0],own);assert.equal(after.socTopics,map);assert.equal(after.trash.length,0);
});

test('Fresh clients receive only one starter and do not export internal policy metadata',async()=>{
  const projected=await projectClientContentLibrary(snapshot()),initial={socItems:[{id:'own',title:'Own draft'}]};
  const next=mergeContentSnapshot((await prepareContentClientMigration(initial,projected))(initial),projected);
  assert.deepEqual(next.socItems.map(row=>row.title),['Own draft','Greetings!']);assert.deepEqual(next.socTopics,CLIENT_CONTENT_TOPICS);
  const exported=exportContentSnapshot(next,{version:'exported'}).snapshot;assert.equal('clientPolicy' in exported,false);assert.equal('contentPolicies' in exported,false);
});

test('Fingerprints ignore property order but distinguish every supported record change',async()=>{
  assert.equal(await contentFingerprint({a:1,b:{z:2,y:3}}),await contentFingerprint({b:{y:3,z:2},a:1}));
  assert.notEqual(await contentFingerprint({text:'A'}),await contentFingerprint({text:'B'}));
});

test('Art category migration preserves custom names, note text, folders, colors, scope and recoverable entries',()=>{
  const note={id:'art',tag:'Poezie a písně',tags:['Poezie a písně','Custom'],text:'Original body',folder:'My folder'},custom={id:'custom',tag:'Moje poezie',tags:['Moje poezie']};
  const before={notebook:[note,custom],nbTags:[['Poezie a písně','rose'],['Moje poezie','moss']],nbTagObor:{'Poezie a písně':'soc'},trash:[{entryKind:'notebook',data:note}],journal:[note]};
  const after=migrateNotebookArtCategory(before);
  assert.deepEqual(after.notebook[0],{...note,tag:'Umění',tags:['Umění','Custom']});assert.equal(after.notebook[1],custom);assert.equal(after.journal,before.journal);
  assert.deepEqual(after.nbTags,[['Umění','rose'],['Moje poezie','moss']]);assert.deepEqual(after.nbTagObor,{'Umění':'soc'});assert.equal(after.trash[0].data.tag,'Umění');
  assert.equal(migrateNotebookArtCategory(after),after);assert.equal(before.notebook[0].tag,'Poezie a písně');
});

test('Art category migration deduplicates the renamed tag and preserves an existing new-label scope',()=>{
  const after=migrateNotebookArtCategory({nbTags:[['Umění','sand'],['Poezie a písně','rose']],nbTagObor:{'Umění':'nb','Poezie a písně':'soc'},notebook:[{tags:['Umění','Poezie a písně']}]});
  assert.deepEqual(after.nbTags,[['Umění','sand']]);assert.equal(after.nbTagObor['Umění'],'nb');assert.deepEqual(after.notebook[0].tags,['Umění']);
  assert.deepEqual(migrateNotebookArtCategory({nbTags:[['Poezie a písně','rose'],['Umění','sand']]}).nbTags,[['Umění','sand']]);
  setLang('en');assert.equal(LV('Umění'),'Art');setLang('cs');assert.equal(LV('Umění'),'Umění');
});
