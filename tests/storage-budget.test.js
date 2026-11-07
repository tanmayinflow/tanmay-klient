import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeD1, makeR2 } from './helpers/env.js';
import { STORAGE_LIMITS, guardedStorage, handleStorageBudget, ensureStorageBudget } from '../src/shared/product/storageBudgetServer.js';

async function setup() {
  const db=makeD1(),rawMain=makeR2(),rawClient=makeR2();
  const main=guardedStorage({db,raw:rawMain,bucket:'main'}),client=guardedStorage({db,raw:rawClient,bucket:'client'});
  await db.prepare('CREATE TABLE members(user_id TEXT PRIMARY KEY,name TEXT,email TEXT)').run();
  await db.prepare("INSERT INTO members VALUES('alice','Alice','alice@example.test')").run();
  await main.initialize(); await client.initialize();
  return {db,rawMain,rawClient,main,client};
}
const get = (files,db,role='main',userId='primary')=>handleStorageBudget(new Request('https://app.test/api/storage'),{db,files,role,userId}).then(r=>r.json());
const put = (files,db,body,role='main',userId='primary')=>handleStorageBudget(new Request('https://app.test/api/storage',{method:'PUT',body:JSON.stringify(body)}),{db,files,role,userId}).then(r=>r.json());

test('D1 trigger-inclusive change counts do not reject a successful reservation',async()=>{
 const {db,main}=await setup();
 await get(main,db);
 const inserted=await db.prepare("INSERT INTO storage_budget_reservations(bucket,key,user_id,bytes,token) VALUES('main','synthetic-counter','main:primary',0,'counter')").run();
 assert.equal(inserted.meta.changes,3);
 await db.prepare("DELETE FROM storage_budget_reservations WHERE bucket='main' AND key='synthetic-counter'").run();
 await main.put('files/primary/confirmed','1234');
 const overview=await get(main,db);assert.equal(overview.own.usedBytes,4);assert.equal(overview.own.reservedBytes,0);
});

test('both inventories required; existing files and system objects consume pooled capacity',async()=>{
 const db=makeD1(),a=makeR2(),b=makeR2();
 await a.put('files/primary/x','12345'); await b.put('content-library/snapshot','1234567');
 const main=guardedStorage({db,raw:a,bucket:'main'}),client=guardedStorage({db,raw:b,bucket:'client'});
 await main.initialize();
 await assert.rejects(main.put('files/primary/new','x'),{code:'storage-initializing'});
 await client.initialize();
 const overview=await get(main,db); assert.equal(overview.ready,true);assert.equal(overview.pool.usedBytes,12);assert.equal(overview.own.usedBytes,5);
 await main.put('files/primary/new','x');assert.equal((await get(main,db)).pool.usedBytes,13);
});
test('owner allocation, lower self limit and cross-account isolation',async()=>{
 const {db,main,client}=await setup();
 await put(main,db,{userId:'client:alice',limitBytes:10});
 await put(client,db,{personalLimitBytes:3},'client','alice');
 await client.put('files/alice/a','123');
 await assert.rejects(client.put('files/alice/b','4'),{code:'storage-user-limit'});
 const own=await get(client,db,'client','alice');assert.equal(own.own.effectiveLimitBytes,3);assert.equal(own.accounts,undefined);
 await assert.rejects(put(client,db,{userId:'main:primary',limitBytes:100},'client','alice'),{status:403});
 await assert.rejects(put(client,db,{personalLimitBytes:11},'client','alice'),{status:400});
 await put(client,db,{personalLimitBytes:null},'client','alice');await client.put('files/alice/b','4');
});
test('atomic reservations prevent concurrent uploads exceeding shared cap',async()=>{
 const {db,main,client}=await setup();
 await put(main,db,{userId:'main:primary',limitBytes:STORAGE_LIMITS.globalBytes});
 await db.prepare('UPDATE storage_budget_pool SET used=? WHERE id=1').bind(STORAGE_LIMITS.globalBytes-5).run();
 const attempts=await Promise.allSettled([main.put('files/primary/a','1234'),client.put('files/alice/b','5678')]);
 assert.equal(attempts.filter(row=>row.status==='fulfilled').length,1);
 const snapshot=await get(main,db);assert.equal(snapshot.pool.usedBytes,STORAGE_LIMITS.globalBytes-1);assert.equal(snapshot.pool.reservedBytes,0);
});
test('unconfirmed R2 commit retains bytes and same-key lock; failures never claim success',async()=>{
 const {db,rawMain}=await setup();
 const original=rawMain.put; rawMain.put=async(...args)=>{await original(...args);throw new Error('lost reply');};
 const main=guardedStorage({db,raw:rawMain,bucket:'main'});
 await assert.rejects(main.put('files/primary/a','1234'));
 assert.equal((await get(main,db)).pool.reservedBytes,4);
 await assert.rejects(main.delete('files/primary/a'),{code:'storage-pending'});
 await assert.rejects(main.put('files/primary/a','12'),{code:'storage-pending'});
});
test('overwrite and confirmed delete maintain exact byte counters; Standard forced',async()=>{
 const {db,main,rawMain}=await setup();
 await main.put('files/primary/a','12345',{storageClass:'InfrequentAccess'});
 assert.equal(rawMain._store.get('files/primary/a').opts.storageClass,'Standard');
 await main.put('files/primary/a','12');assert.equal((await get(main,db)).pool.usedBytes,2);
 await main.delete('files/primary/a');const result=await get(main,db);assert.equal(result.pool.usedBytes,0);assert.equal(result.pool.reservedBytes,0);
});
test('replacement reserves only growth and can shrink a file at its exact allowance',async()=>{
 const {db,main}=await setup();
 await put(main,db,{userId:'main:primary',limitBytes:5});
 await main.put('files/primary/a','12345');
 await main.put('files/primary/a','12345');
 await main.put('files/primary/a','123');
 assert.equal((await get(main,db)).own.usedBytes,3);
 await main.put('files/primary/a','12345');
 await assert.rejects(main.put('files/primary/a','123456'),{code:'storage-user-limit'});
});
test('daily operation caps are atomic and fail before contacting R2',async()=>{
 const {db,main,rawMain}=await setup();const date=new Date().toISOString().slice(0,10);
 await db.prepare('UPDATE storage_budget_ops SET a=?,b=? WHERE day=?').bind(STORAGE_LIMITS.dailyA,STORAGE_LIMITS.dailyB,date).run();
 let calls=0;rawMain.get=async()=>{calls++;};rawMain.list=async()=>{calls++;};rawMain.put=async()=>{calls++;};
 for(const operation of [()=>main.get('x'),()=>main.head('x'),()=>main.list({}),()=>main.put('files/primary/a','x')]) await assert.rejects(operation(),{code:'storage-operations'});
 assert.equal(calls,0);
});
test('missing ledger fails closed and 32 UTC days stay under monthly free operation caps',async()=>{
 await assert.rejects(ensureStorageBudget(null),{code:'storage-unavailable'});
 assert.ok(STORAGE_LIMITS.dailyA*32<1_000_000);assert.ok(STORAGE_LIMITS.dailyB*32<10_000_000);
});
