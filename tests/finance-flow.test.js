import test from "node:test";
import assert from "node:assert/strict";
import {financeAmount,financeDate,financeRows,financeSummary,financeCategories,financeHistory,filterFinanceRows} from "../src/shared/product/financeFlow.js";

test("ledger amount accepts Czech decimals and refunds with exact cents and rejects unsafe input",()=>{
  assert.equal(financeAmount("1 200,50"),1200.5);
  assert.equal(financeAmount("-25,30"),-25.3);
  for(const bad of ["0","-0.00","1.123","1e3","Infinity","",Number.MAX_VALUE])assert.equal(financeAmount(bad),null);
});

test("finance accepts current ISO and imported Czech dates without accepting impossible days",()=>{
  assert.equal(financeDate("2026-10-03"),"2026-10-03");
  assert.equal(financeDate("3. 10. 2026"),"2026-10-03");
  assert.equal(financeDate("29. 2. 2024"),"2024-02-29");
  for(const bad of ["29. 2. 2025","2026-02-31","2026-13-01","n/a",null])assert.equal(financeDate(bad),"");
});
test("monthly summary preserves cents, income, refunds and historical entries without mutating records",()=>{
  const data={income:[{id:"i",date:"2026-10-02",amount:"0.30",source:"Work"}],expenses:[{id:"e1",date:"2. 10. 2026",amount:"0.10"},{id:"e2",date:"2026-10-03",amount:"0.20"},{id:"refund",date:"2026-10-04",amount:-.05},{id:"old",date:"2026-09-01",amount:1000}]};
  const initial=structuredClone(data),archive=[{date:"2026-10-01",amount:.03,item:"Archive"}];
  const rows=financeRows(data,"2026-10",archive);
  assert.deepEqual(financeSummary(rows),{received:.3,spent:.28,balance:.02,count:5});
  assert.equal(rows.at(-1).archived,true);
  assert.equal(rows[0].entry.id,"refund");
  assert.deepEqual(data,initial);
  assert.equal(financeRows({expenses:[{date:"invalid",amount:1}]},"2026-10").length,0);
});
test("category drilldown handles legacy jars, personal categories and missing classification",()=>{
  const rows=financeRows({expenses:[{id:"a",date:"2026-10-01",amount:2,jar:"NEC",category:"Ignored"},{id:"b",date:"2026-10-01",amount:3,category:"Jídlo"},{id:"c",date:"2026-10-01",amount:1}],income:[{id:"i",date:"2026-10-01",amount:9}]},"2026-10");
  assert.deepEqual(financeCategories(rows).map(row=>[row.key,row.amount]),[["Jídlo",3],["NEC",2],["",1]]);
  assert.deepEqual(filterFinanceRows(rows,{kind:"expenses",category:""}).map(row=>row.entry.id),["c"]);
  assert.deepEqual(filterFinanceRows(rows,{kind:"expenses",category:"NEC"}).map(row=>row.entry.id),["a"]);
});
test("six month history crosses year boundaries and keeps silent months explicitly empty",()=>{
  const history=financeHistory({income:[{date:"2025-12-12",amount:123}],expenses:[{date:"2026-01-01",amount:5}]},"2026-02");
  assert.deepEqual(history.map(row=>row.month),["2025-09","2025-10","2025-11","2025-12","2026-01","2026-02"]);
  assert.equal(history[0].count,0);assert.equal(history[3].received,123);assert.equal(history[4].balance,-5);
});
test("search is accent-insensitive and filters names, notes and direction together",()=>{
  const rows=financeRows({expenses:[{id:"a",date:"2026-10-02",amount:55,item:"Oběd",note:"Příjemné setkání"}],income:[{id:"b",date:"2026-10-02",amount:200,source:"Odměna"}]},"2026-10");
  assert.deepEqual(filterFinanceRows(rows,{query:"obed"}).map(row=>row.entry.id),["a"]);
  assert.deepEqual(filterFinanceRows(rows,{query:"setkani"}).map(row=>row.entry.id),["a"]);
  assert.deepEqual(filterFinanceRows(rows,{kind:"income",query:"obed"}),[]);
  assert.equal(filterFinanceRows(rows,{query:"200"})[0].entry.id,"b");
});
test("non-finite and unsafe saved amounts do not poison the overview",()=>{
  const rows=financeRows({expenses:[Infinity,"not a number",Number.MAX_VALUE].map((amount,index)=>({id:String(index),date:"2026-10-01",amount}))},"2026-10");
  assert.deepEqual(financeSummary(rows),{received:0,spent:0,balance:0,count:3});
});
