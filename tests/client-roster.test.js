import test from 'node:test';
import assert from 'node:assert/strict';
import { hideBodybodyClients, clientAccountSummary } from '../src/shared/product/clientRoster.js';
test('Bodybody roster is hidden once without changing unrelated clients or accounts', () => {
  const a={id:'a',source:'bodybody',hidden:false},b={id:'b',source:'web',hidden:false};
  const coll={klProfiles:[a,b],journal:[{text:'private'}]};
  const next=hideBodybodyClients(coll);
  assert.equal(next.klProfiles[0].hidden,true); assert.equal(next.klProfiles[1],b);
  assert.equal(a.hidden,false); assert.equal(next.journal,coll.journal);
  const manuallyRestored={...next,klProfiles:[{...a,hidden:false},b]};
  assert.equal(hideBodybodyClients(manuallyRestored),manuallyRestored);
});
test('usage summary only counts real recent saves',()=>{
  assert.deepEqual(clientAccountSummary([{last_active:9999999999},{last_active:null}],10000000000),{total:2,recent:1});
});
