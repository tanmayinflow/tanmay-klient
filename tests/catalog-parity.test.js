import test from 'node:test';
import assert from 'node:assert/strict';
import {applyLibraryParity,LIBRARY_PARITY_ADDITIONS} from '../src/training/catalogParity.js';
import {LIBRARY_PARITY_CORRECTIONS} from '../src/training/catalogParityData.js';

test('catalogue completion adds unique public identities and preserves account documents',()=>{
  for(const role of ['main','client']){
    const first=LIBRARY_PARITY_ADDITIONS[role][0],custom={...first,cz:'My own edited card',privateNote:'local-only'};
    const collection={tEx:[custom],tPl:[{id:'personal-plan'}],tLog:[{id:'actual-result'}],notebook:[{id:'private-document'}]};
    const result=applyLibraryParity(collection,role);
    assert.equal(result.tEx.find(x=>x.id===first.id),custom);
    assert.equal(new Set(result.tEx.map(x=>x.id)).size,result.tEx.length);
    for(const key of ['tPl','tLog','notebook'])assert.equal(result[key],collection[key]);
    assert.equal(applyLibraryParity(result,role),result);
    const removed={...result,tEx:result.tEx.filter(x=>x.id!==first.id)};
    assert.equal(applyLibraryParity(removed,role),removed,'Do not resurrect later removals');
  }
});
test('default link corrections preserve any customized card and independently clone additions',()=>{
  const patch=LIBRARY_PARITY_CORRECTIONS.client.find(x=>x.id==='ex26_band_deadlift');
  const original={...structuredClone(patch.before),seed:'fixture'},custom={...structuredClone(patch.before),cz:'Custom name'};
  assert.equal(applyLibraryParity({tEx:[original]},'client').tEx[0].hd,patch.after.hd);
  assert.equal(applyLibraryParity({tEx:[custom]},'client').tEx[0],custom);
  const a=applyLibraryParity({tEx:[]},'client'),b=applyLibraryParity({tEx:[]},'client');
  assert.notEqual(a.tEx[0],b.tEx[0]);
  assert.throws(()=>applyLibraryParity({tEx:[]},'unknown'),/Unknown catalogue role/);
});
