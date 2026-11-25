import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import worker from '../worker/index.js';

test('market embed policy applies only to the standalone chart document', async()=>{
  const env={OWNER_EMAIL:'owner@example.test',ASSETS:{fetch:async()=>new Response('<!doctype html><title>Asset</title>',{headers:{'Content-Type':'text/html'}})}};
  const request = path => new Request('https://app.example.test'+path,{headers:{'cf-access-authenticated-user-email':env.OWNER_EMAIL}});
  const page=await worker.fetch(request('/market-chart.html'),env,{});
  assert.equal(page.status,200);
  assert.equal(page.headers.get('x-frame-options'),'SAMEORIGIN');
  const policy=page.headers.get('content-security-policy');
  assert.match(policy,/frame-ancestors 'self'/);
  assert.match(policy,/script-src 'self' https:\/\/s3\.tradingview\.com/);
  assert.match(policy,/connect-src 'self'/);
  assert.doesNotMatch(policy, /unsafe-eval|script-src[^;]*unsafe-inline/);
  for(const path of ['/', '/market-chart.html/extra','/market-chart.js']){
    const response=await worker.fetch(request(path),env,{});
    assert.equal(response.headers.get('x-frame-options'),'DENY',path);
    assert.match(response.headers.get('content-security-policy'),/frame-ancestors 'none'/,path);
    assert.doesNotMatch(response.headers.get('content-security-policy'),/tradingview/,path);
  }
});

test('asset-first HTML permits its real bootstrap; chart routes own their embed policy', () => {
  const file = name => readFileSync(new URL('../'+name, import.meta.url),'utf8');
  const policy=file('public/_headers');
  assert.match(policy,/^https:\/\/app\.tanmaypractice\.com\/assets\/\*\s+Cache-Control:\s*private, no-store$/m);
  const document=file('index.html').replace(/\r\n/g,'\n');
  const scripts=[...document.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter(match => !/\bsrc\s*=/.test(match[1]));
  assert.ok(scripts.length);
  for(const [, , source] of scripts){
    const hash=createHash('sha256').update(source).digest('base64');
    assert.ok(policy.includes("'sha256-"+hash+"'"));
  }
  assert.match(policy,/frame-ancestors 'self'/);
  assert.doesNotMatch(policy,/script-src[^;]*(?:'unsafe-inline'|'unsafe-eval'|tradingview)/);
  const routing=JSON.parse(file('wrangler.jsonc')).assets.run_worker_first;
  assert.ok(routing===true || ['/market-chart.html','/market-chart'].every(path=>routing.includes(path)));
});
