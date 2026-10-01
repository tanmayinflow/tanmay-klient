import test from "node:test";
import assert from "node:assert/strict";
import worker from "../worker/index.js";
import {makeEnv,req} from "./helpers/env.js";
const OWNER="owner@example.test",OTHER="other@example.test";
const path="/api/sky/timezone?latitude=50.087&longitude=14.421";
async function authorized(){const env=makeEnv();await worker.fetch(req("/api/me",{email:OWNER}),env);assert.equal((await worker.fetch(req("/api/join",{email:OWNER,method:"POST",body:{word:"otevri se"}}),env)).status,200);return env;}
test("timezone route keeps Client identity and membership gates",async()=>{
  const env=await authorized();
  assert.equal((await worker.fetch(req(path),env)).status,401);
  assert.equal((await worker.fetch(req(path,{email:OTHER}),env)).status,403);
});
test("timezone worker returns only the IANA zone and forwards no private headers",async t=>{
  const calls=[];t.mock.method(globalThis,"fetch",async(url,options)=>{calls.push({url,options});return Response.json({timezone:"Europe/Prague",local_time:"ignored"});});
  const env=await authorized(),response=await worker.fetch(req(path,{email:OWNER,headers:{cookie:"private-cookie"}}),env);
  assert.equal(response.status,200);assert.deepEqual(await response.json(),{timeZone:"Europe/Prague"});
  assert.equal(calls.length,1);assert.equal(calls[0].url,"https://timeapi.io/api/v1/timezone/coordinate?latitude=50.087&longitude=14.421");
  assert.deepEqual(calls[0].options.headers,{Accept:"application/json"});assert.equal(response.headers.get("Access-Control-Allow-Origin"),null);
});
test("timezone route validates data and HTTP methods before upstream fetch",async t=>{
  t.mock.method(globalThis,"fetch",async()=>{throw new Error("Unexpected upstream request");});const env=await authorized();
  assert.equal((await worker.fetch(req("/api/sky/timezone?latitude=91&longitude=14",{email:OWNER}),env)).status,400);
  assert.equal((await worker.fetch(req(path,{email:OWNER,method:"POST",body:{}}),env)).status,405);
});
test("production CSP allows Photon while the timezone service remains server-only",async()=>{
  const env=await authorized(),response=await worker.fetch(req("/",{email:OWNER}),env),csp=response.headers.get("Content-Security-Policy");
  assert.match(csp,/connect-src[^;]*https:\/\/photon\.komoot\.io/);assert.doesNotMatch(csp,/https:\/\/timeapi\.io/);assert.doesNotMatch(csp,/wasm-unsafe-eval/);
});
