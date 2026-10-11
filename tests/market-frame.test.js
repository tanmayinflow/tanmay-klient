import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker/index.js';

test('market embed policy applies only to the standalone chart document', async()=>{
  const env={ASSETS:{fetch:async()=>new Response('<!doctype html><title>Asset</title>',{headers:{'Content-Type':'text/html'}})}};
  const page=await worker.fetch(new Request('https://app.example.test/market-chart.html'),env,{});
  assert.equal(page.status,200);
  assert.equal(page.headers.get('x-frame-options'),'SAMEORIGIN');
  const policy=page.headers.get('content-security-policy');
  assert.match(policy,/frame-ancestors 'self'/);
  assert.match(policy,/script-src 'self' https:\/\/s3\.tradingview\.com/);
  assert.match(policy,/connect-src 'self'/);
  assert.doesNotMatch(policy, /unsafe-eval|script-src[^;]*unsafe-inline/);
  for(const path of ['/', '/market-chart.html/extra','/market-chart.js']){
    const response=await worker.fetch(new Request('https://app.example.test'+path),env,{});
    assert.equal(response.headers.get('x-frame-options'),'DENY',path);
    assert.match(response.headers.get('content-security-policy'),/frame-ancestors 'none'/,path);
    assert.doesNotMatch(response.headers.get('content-security-policy'),/tradingview/,path);
  }
});
