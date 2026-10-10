import { test } from "node:test";
import assert from "node:assert/strict";
import { searchClientRecords } from "../src/clientSearch.js";

test("private optional rooms route search hits to their own editors and honor visibility",()=>{
  const records={notebook:[{id:"resource",title:"Private resource",folder:"Sociální sítě"},{id:"normal",title:"Private note"}],socItems:[{id:"draft",title:"Private draft",script:"original words"}],income:[{id:"income",source:"Private income",amount:10}],expenses:[{id:"expense",item:"Private expense",amount:5}]};
  const own=searchClientRecords({query:"private",records,enabled:room=>["socsite","hospodareni"].includes(room)});
  assert.deepEqual(own.map(hit=>[hit.id,hit.room]).sort(),[["draft","socsite"],["expense","hospodareni"],["income","hospodareni"],["resource","socsite"]]);
  assert.deepEqual(searchClientRecords({query:"private",records,enabled:room=>room==="zapisnik"}).map(hit=>hit.id).sort(),["normal","resource"]);
  assert.equal(searchClientRecords({query:"original",records,enabled:room=>room==="socsite"})[0].id,"draft");
  assert.deepEqual(searchClientRecords({query:"private",records,enabled:()=>false}),[]);
});

test("legacy nested creation notes remain searchable before opt-in and after hiding Content",()=>{
  const records={notebook:[{id:"legacy",title:"Legacy manuscript",folder:"Sociální sítě/Campaign/Chapter",tag:"Original",text:"Personal notes"}]};
  const search=contentAvailable=>searchClientRecords({query:"manuscript",records,enabled:room=>room==="zapisnik"||(room==="socsite"&&contentAvailable)});
  assert.deepEqual(search(false).map(hit=>[hit.id,hit.room]),[["legacy","zapisnik"]]);
  assert.deepEqual(search(true).map(hit=>[hit.id,hit.room]),[["legacy","socsite"]]);
  assert.deepEqual(search(false).map(hit=>[hit.id,hit.room]),[["legacy","zapisnik"]]);
  assert.equal(records.notebook[0].folder,"Sociální sítě/Campaign/Chapter");
  assert.equal(records.notebook[0].tag,"Original");
});

test("search respects room opt-ins, does not inspect trash, coach-private fields or arbitrary account data", () => {
  const records = { notebook: [{ id: "private", title: "Dech" }], journal: [{ id: "journal", title: "Dech" }], trash: [{ data: { id: "trashed", title: "Dech" } }], oldAccount: { notebook: [{ id: "old", title: "Dech" }] } };
  const sources = [{ id: "source", title: "Dech", privateNotes: "secret", instruction: "Try daily" }, { id: "revoked", title: "Dech", unsharedAt: 1 }];
  const enabled = room => room === "prameny";
  const hits = searchClientRecords({ query: "dech", records, sources, enabled });
  assert.deepEqual(hits.map(hit => hit.id), ["source"]);
  assert.deepEqual(searchClientRecords({ query: "secret", records, sources, enabled }), []);
});

test("search finds Czech words without accents and returns stable deep-link targets", () => {
  const hits = searchClientRecords({ query: "ranni dech", records: { notebook: [{ id: "own", title: "Ranní dech", text: "Klid" }] }, goals: [{ id: "assigned", name: "Každý den", intent: "Ranní dech" }], enabled: () => true });
  assert.deepEqual(hits.map(({ kind, id, room }) => ({ kind, id, room })), [{ kind: "notebook", id: "own", room: "zapisnik" }, { kind: "goal", id: "Každý den", room: "kompas" }]);
  assert.equal(searchClientRecords({ query: " ", enabled: () => true }).length, 0);
});
