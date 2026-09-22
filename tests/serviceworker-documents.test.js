import {test} from 'node:test';import assert from 'node:assert/strict';import vm from 'node:vm';import fs from 'node:fs';
test('standalone pages never replace the offline app shell',async()=>{
 const entries=new Map();let offline=false;
 const context={self:{addEventListener(){}},URL,caches:{open:async()=>({put:async(k,v)=>entries.set(k,v),match:async k=>entries.get(k)})},fetch:async req=>{if(offline)throw Error('offline');return new Response(req.url,{headers:{'content-type':'text/html'}})}};
 vm.runInNewContext(fs.readFileSync(new URL('../public/sw.js',import.meta.url),'utf8')+'\nthis.doc=networkFirstDoc;',context);
 await context.doc(new Request('https://app.test/'));
 await context.doc(new Request('https://app.test/market-chart.html?symbol=NASDAQ:AAPL'));
 offline=true;
 assert.equal(await (await context.doc(new Request('https://app.test/'))).text(),'https://app.test/');
 assert.equal(await (await context.doc(new Request('https://app.test/market-chart.html?symbol=NASDAQ:AAPL'))).text(),'https://app.test/market-chart.html?symbol=NASDAQ:AAPL');
});
