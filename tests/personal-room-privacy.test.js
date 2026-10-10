import test from "node:test";
import assert from "node:assert/strict";
import worker from "../worker/index.js";
import {makeEnv, req} from "./helpers/env.js";
import {coachClientRow, validateShareSnapshot} from "../src/shared/product/visibility.js";

test("personal money and drafts roundtrip only in their owner's state, never the coaching projection",async()=>{
  const env=makeEnv(),email="personal-a@example.test",other="personal-b@example.test";
  const call=(path,opts={})=>worker.fetch(req(path,{email,...opts}),env);
  for(const address of [email,other]){
    await call("/api/me",{email:address});
    assert.equal((await call("/api/join",{email:address,method:"POST",body:{word:"otevri se"}})).status,200);
  }
  const coll={modules:["hospodareni","socsite","denik"],income:[{id:"i",date:"2026-10-10",source:"Private salary",amount:12345}],expenses:[{id:"e",date:"2026-10-10",item:"Private expense",amount:98}],socItems:[{id:"s",title:"Unpublished draft",script:"Private draft text"}],journal:[{id:"j",date:"2026-10-10",text:"Private daily entry"}]};
  const saved=await call("/api/state",{method:"PUT",body:{doc:{coll},baseVersion:0}});
  assert.equal(saved.status,200);
  assert.deepEqual((await (await call("/api/state")).json()).doc.coll,coll);
  const otherDoc=await (await call("/api/state",{email:other})).json();
  assert.ok(!JSON.stringify(otherDoc).includes("Private salary"));
  assert.ok(!JSON.stringify(otherDoc).includes("Unpublished draft"));
  const projection=coachClientRow({user_id:"a",email,modules:coll.modules,...coll,doc:{coll}});
  for(const marker of ["Private salary","Private expense","Unpublished draft","Private daily entry"]){
    assert.ok(!JSON.stringify(projection).includes(marker));
  }
  for(const key of ["income","expenses","socItems","journal"]){
    assert.equal(validateShareSnapshot({[key]:coll[key]}).ok,false);
    const denied=await call("/api/state",{method:"PUT",body:{doc:{coll},share:{[key]:coll[key]}}});
    assert.equal(denied.status,400);
  }
});
