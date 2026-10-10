import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {retiredPracticeCandidates,archiveRetiredPracticeNotes} from '../src/retiredNotebook.js';

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
