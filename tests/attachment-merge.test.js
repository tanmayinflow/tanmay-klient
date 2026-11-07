import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const app=readFileSync(new URL('../src/App.tsx',import.meta.url),'utf8');
function writer(name,initial){
  let state=initial;
  const source=app.split('\n').find(line=>line.trim().startsWith(`const ${name} =`));assert.ok(source);
  const update=vm.runInNewContext(source+`;${name};`,{persistColl:fn=>{state=fn(state);}});
  return {update,read:()=>JSON.parse(JSON.stringify(state))};
}
test('real entry writer merges completed uploads into current attachments and preserves unrelated edits',()=>{
  const {update,read}=writer('updateEntry',{content:[{id:'s',title:'Before',att:[{id:'removed'}]}]});
  update('content','s',{title:'After',att:[]});
  for(const id of ['fast','slow'])update('content','s',current=>({att:[...(current.att||[]),{id}]}));
  assert.deepEqual(read().content,[{id:'s',title:'After',att:[{id:'fast'},{id:'slow'}]}]);
  update('content','missing',()=>assert.fail('an upload cannot recreate a deleted entry'));
  assert.equal(read().content.length,1);
});
for(const [name,key] of [['setGoalMeta','goalMeta'],['setAreaMeta','areaMeta']])test(`${name} preserves files added while another upload is pending`,()=>{
  const {update,read}=writer(name,{[key]:{one:{text:'Original',att:[]}}});
  update('one',{text:'Edited'});
  update('one',current=>({att:[...(current.att||[]),{id:'fast'}]}));
  update('one',current=>({att:[...(current.att||[]),{id:'slow'}]}));
  assert.deepEqual(read()[key].one,{text:'Edited',att:[{id:'fast'},{id:'slow'}]});
});
