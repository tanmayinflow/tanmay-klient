import test from "node:test";
import assert from "node:assert/strict";
import {monthlyLedger, personalAmount, validPersonalDate, shiftPersonalMonth, personalNotebookRoom, creationResourcePatch} from "../src/shared/product/personalRooms.js";
import {deriveCapabilities, roomVisible, migrateClientModules} from "../src/shared/product/roles.js";
import {CLIENT_ROOMS, navigationRooms, updatePlacement} from "../src/shared/product/navigation.js";

test("existing creation notes and folder paths stay in Notebook until Content is available",()=>{
  const notes=[{id:"root",folder:"Sociální sítě"},{id:"nested",folder:"Sociální sítě/Kampaně/Jaro"},{id:"ordinary",folder:"Sociální sítě a vztahy"},{id:"loose"}];
  const snapshot=JSON.stringify(notes);
  const inNotebook=available=>notes.filter(note=>personalNotebookRoom(note,available)==="zapisnik").map(note=>note.id);
  assert.deepEqual(inNotebook(false),["root","nested","ordinary","loose"]);
  assert.deepEqual(inNotebook(true),["ordinary","loose"]);
  assert.deepEqual(inNotebook(false),["root","nested","ordinary","loose"]);
  for(const folder of ["Sociální sítě","Sociální sítě/Kampaně","Sociální sítě/Kampaně/Jaro"]){
    assert.equal(personalNotebookRoom({folder},false),"zapisnik");
    assert.equal(personalNotebookRoom({folder},true),"socsite");
  }
  assert.equal(JSON.stringify(notes),snapshot);
});

test("editing a creation resource preserves its nested folder, tag and unrelated metadata",()=>{
  const existing={id:"legacy",folder:"Sociální sítě/Kampaně/Jaro",tag:"Vlastní štítek",title:"Old",text:"Old text",star:true,date:"2025-04-03",files:[{name:"reference.pdf"}]};
  const original=structuredClone(existing);
  const patch=creationResourcePatch(existing,"  Updated  ","New text","Poznámka");
  const stored={...existing,...patch};
  assert.deepEqual(stored,{...original,title:"Updated",text:"New text"});
  assert.deepEqual(existing,original);
  assert.equal(Object.hasOwn(patch,"folder"),false);
  assert.equal(Object.hasOwn(patch,"tag"),false);
  assert.deepEqual(creationResourcePatch(null,"  ","First note","Poznámka"),{title:"Poznámka",text:"First note",folder:"Sociální sítě",tag:"Tvorba obsahu"});
  assert.deepEqual(creationResourcePatch({id:"untagged"},"Name","Text","Poznámka"),{title:"Name",text:"Text"});
});

test("new personal rooms are closed until explicitly enabled and never grant coach administration",()=>{
  const closed=deriveCapabilities({role:"client",member:true,modules:[]});
  for(const key of ["prameny","hospodareni","socsite","denik"])assert.equal(roomVisible(closed,key),false);
  const opened=deriveCapabilities({role:"client",member:true,modules:["prameny","hospodareni","socsite","denik","klienti"]});
  for(const key of ["prameny","hospodareni","socsite","denik"])assert.equal(roomVisible(opened,key),true);
  for(const key of ["manageClients","manageAvailability","managePackages","editTrainingPrescription"])assert.equal(opened[key],false);
  const denied=deriveCapabilities({role:"client",member:false,modules:["hospodareni","socsite","denik"]});
  assert.ok(Object.values(denied).every(value=>!value));
});
test("personal room preferences preserve an explicit selection across serialization and hide without erasing data",()=>{
  const coll={modules:["prameny","hospodareni","socsite"],income:[{id:"mine",amount:123,date:"2026-10-10"}],socItems:[{id:"draft",title:"My work"}]};
  const restored=JSON.parse(JSON.stringify(coll));
  assert.deepEqual(migrateClientModules(restored.modules),coll.modules);
  const defaults={sidebar:CLIENT_ROOMS,dock:[]};
  const hidden=updatePlacement({},"hospodareni",{hidden:true},CLIENT_ROOMS,defaults);
  assert.ok(!navigationRooms(hidden,CLIENT_ROOMS,defaults,"sidebar").includes("hospodareni"));
  const visible=updatePlacement(hidden,"hospodareni",{hidden:false,dock:true},CLIENT_ROOMS,defaults);
  assert.ok(navigationRooms(visible,CLIENT_ROOMS,defaults,"dock").includes("hospodareni"));
  assert.deepEqual(restored,coll);
});
test("an empty ledger contains no seeded money or personal records",()=>{
  assert.deepEqual(monthlyLedger({},"2026-10"),{income:[],expenses:[],received:0,spent:0,balance:0});
});
test("ledger totals use cents, isolate months, skip invalid dates and retain refunds",()=>{
  const coll={income:[{date:"2026-10-01",amount:0.1},{date:"2026-10-01",amount:0.2},{date:"2026-11-01",amount:500}],expenses:[{date:"2026-10-03",amount:0.1},{date:"2026-10-03",amount:-0.05},{date:"2026-10-99",amount:999}]};
  const totals=monthlyLedger(coll,"2026-10");
  assert.equal(totals.received,.3);assert.equal(totals.spent,.05);assert.equal(totals.balance,.25);
  assert.equal(totals.income.length,2);assert.equal(totals.expenses.length,2);
});
test("amount inputs accept Czech decimal commas and reject ambiguous or unsafe values",()=>{
  assert.equal(personalAmount("1 234,56"),1234.56);
  assert.equal(personalAmount("0.10"),.1);
  for(const value of ["",null,"-1","0","1.005","1e3","1,2,3","Infinity","9007199254740992"])assert.equal(personalAmount(value),null,String(value));
});
test("date and month handling survives leap days and year boundaries",()=>{
  assert.equal(validPersonalDate("2024-02-29"),true);
  for(const value of ["2026-02-29","2026-13-01","2026-1-01",""])assert.equal(validPersonalDate(value),false);
  assert.equal(shiftPersonalMonth("2026-12",1),"2027-01");
  assert.equal(shiftPersonalMonth("2026-01",-1),"2025-12");
});
