import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker/index.js';
import {CONTENT_LIBRARY_KEY} from '../worker/contentLibrary.js';
import {makeEnv,req} from './helpers/env.js';
const A='content-a@example.test',B='content-b@example.test';
const snapshot=()=>({version:'qa-approved-v1',source:'synthetic test only',socItems:[{id:'post',title:'Sample draft'}],socHooks:[],socPillars:[],notebook:[{id:'resource',folder:'Sociální sítě/Podklady',text:'Sample resource'}],socTopics:[]});
async function join(env,email=A){await worker.fetch(req('/api/me',{email}),env);assert.equal((await worker.fetch(req('/api/join',{email,method:'POST',body:{word:'otevri se'}}),env)).status,200);}
async function publish(env,doc=snapshot()){await env.FILES.put(CONTENT_LIBRARY_KEY,JSON.stringify(doc));}
test('Content delivery requires both Access identity and joined membership',async()=>{
  const env=makeEnv();await publish(env);
  assert.equal((await worker.fetch(req('/api/content-library'),env)).status,401);
  assert.equal((await worker.fetch(req('/api/content-library',{email:A}),env)).status,403);
  await join(env);const response=await worker.fetch(req('/api/content-library',{email:A}),env);
  assert.equal(response.status,200);assert.deepEqual(await response.json(),snapshot());assert.equal(response.headers.get('cache-control'),'private, no-store');
});
test('All joined clients receive independent copies of the same approved read-only snapshot',async()=>{
  const env=makeEnv();await publish(env);await join(env,A);await join(env,B);
  for(const email of [A,B])assert.deepEqual(await (await worker.fetch(req('/api/content-library',{email}),env)).json(),snapshot());
  for(const method of ['POST','PUT','PATCH','DELETE'])assert.equal((await worker.fetch(req('/api/content-library',{email:A,method,body:{version:'replacement'}}),env)).status,405);
  assert.deepEqual(await (await worker.fetch(req('/api/content-library',{email:A}),env)).json(),snapshot());
});
test('Mounted owner and identity collision guards also protect Content delivery',async()=>{
  const env=makeEnv();await publish(env);await join(env,A);await join(env,B);
  const identity=await (await worker.fetch(req('/api/me',{email:A}),env)).json();
  assert.equal((await worker.fetch(req('/api/content-library',{email:B,headers:{'X-Tanmay-Owner':identity.owner}}),env)).status,409);
  assert.equal((await worker.fetch(req('/api/content-library',{email:'content+a@example.test'}),env)).status,409);
});
test('Absent or malformed delivery fails closed without exposing unrelated collections',async()=>{
  const env=makeEnv();await join(env);
  assert.equal((await worker.fetch(req('/api/content-library',{email:A}),env)).status,404);
  for(const doc of [{...snapshot(),journal:[{text:'DO NOT EXPOSE'}]},{...snapshot(),notebook:[{folder:'Private',text:'DO NOT EXPOSE'}]},{...snapshot(),socItems:[{id:'p',att:[{text:'DO NOT EXPOSE'}]}]},{...snapshot(),socItems:[{id:'p',url:'https://example.test/api/files/DO-NOT-EXPOSE'}]}]){
    await publish(env,doc);const r=await worker.fetch(req('/api/content-library',{email:A}),env);assert.equal(r.status,503);assert.doesNotMatch(await r.text(),/DO NOT EXPOSE|DO-NOT-EXPOSE/);
  }
});
test('Content endpoint ignores supplied paths and never lists the private publication object',async()=>{
  const env=makeEnv();await join(env);await publish(env);
  const response=await worker.fetch(req('/api/content-library?key=files/another-user/private',{email:A}),env);assert.deepEqual(await response.json(),snapshot());
  const files=await (await worker.fetch(req('/api/files',{email:A}),env)).json();assert.equal(JSON.stringify(files).includes('published'),false);
  const attempt=await worker.fetch(req('/api/files/'+encodeURIComponent(CONTENT_LIBRARY_KEY),{email:A}),env);assert.notEqual(attempt.status,200);
});
