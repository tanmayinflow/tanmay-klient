import test from 'node:test';
import assert from 'node:assert/strict';
import {financeTaxParameters,financeTaxEstimate,financeObligations,finDayInMonth,finOccurrences,financePaymentOccurrences} from '../src/shared/product/financeAdvanced.js';
import {financeSignedValue} from '../src/shared/product/financeViewsModel.js';
test('a new account has no assumed finance values, tax rates or statutory minimums',()=>{
 assert.deepEqual(financeTaxEstimate({}),{rok:0,dan:0,zp:0,sp:0,pausal:0});
 assert.deepEqual(financeTaxParameters({}).flatBands,[0,0,0]);
 const view=financeObligations({},'2026-10-11');assert.equal(view.zavazky,0);assert.equal(view.dnu,null);
 assert.equal(financeTaxEstimate({taxProfit:1000000}).rok,0);
});
test('user-entered tax inputs, credits and band amounts drive the estimate',()=>{
 const taxParameters={taxRate:10,higherRate:20,threshold:1000,credit:50,healthBase:50,healthRate:10,socialBase:100,socialRate:5,healthAdvance:1,socialAdvance:2,flatBands:[300,500,700]};
 assert.deepEqual(financeTaxEstimate({taxProfit:2000,taxParameters}),{rok:450,dan:250,zp:100,sp:100,pausal:0});
 assert.deepEqual(financeTaxEstimate({taxMode:'pausal',taxPausalBand:2,taxParameters}),{rok:6000,dan:0,zp:0,sp:0,pausal:500});
});
test('an explicit zero overrides an injected or older stored default',()=>{
 const defaults={healthAdvance:100,socialAdvance:200,taxRate:30,flatBands:[300,400,500]};
 const p=financeTaxParameters({zpZaloha:0,spZaloha:0,taxParameters:{taxRate:0,flatBands:[0,0,0]}},defaults);
 assert.equal(p.healthAdvance,0);assert.equal(p.socialAdvance,0);assert.equal(p.taxRate,0);assert.deepEqual(p.flatBands,[0,0,0]);
});
test('coverage keeps lending separate and does not count a business advance twice',()=>{
 const coll={finCfg:{liquid:2000,taxParameters:{healthAdvance:100}},bills:[{freq:'month',amount:300},{freq:'month',sys:'osvc',amount:100},{freq:'year',amount:900}],debts:[{monthly:50},{monthly:1000,dir:'owed'},{monthly:1000,settled:true}]};
 const o=financeObligations(coll,'2026-12-01');assert.equal(o.rezerva,100);assert.equal(o.zavazky,450);assert.equal(o.dnu,135);assert.equal(o.zbyva,1);
});
test('own business payments remain included when no tax reserve has been configured',()=>{
 const coll={finCfg:{},bills:[{freq:'month',sys:'osvc',amount:200}]};
 assert.equal(financeObligations(coll,'2026-10-11').zavazky,200);
 coll.finCfg.taxParameters={healthAdvance:50};assert.equal(financeObligations(coll,'2026-10-11').zavazky,200);
 coll.finCfg.taxParameters.healthAdvance=300;assert.equal(financeObligations(coll,'2026-10-11').zavazky,300);
});
test('calendar directions handle refunds and income reversals without a double minus',()=>{
 assert.equal(financeSignedValue('-23,45','expense'),23.45);
 assert.equal(financeSignedValue('1 200,50','expense'),-1200.5);
 assert.equal(financeSignedValue(-100,'income'),-100);
 assert.equal(financeSignedValue('not a number','expense'),0);
});
test('monthly and yearly deadlines clamp short months and never precede the record',()=>{
 assert.equal(finDayInMonth(2024,2,31),'2024-02-29');assert.equal(finDayInMonth(2025,2,'last'),'2025-02-28');
 assert.deepEqual(finOccurrences({freq:'month',day:31,since:'2026-02-01'},'2026-01-01','2026-03-31'),['2026-02-28','2026-03-31']);
 assert.deepEqual(finOccurrences({freq:'year',month:2,day:29},'2025-01-01','2026-12-31'),['2025-02-28','2026-02-28']);
 assert.deepEqual(finOccurrences({freq:'once',date:'2026-02-31'},'2026-01-01','2026-12-31'),[]);
});
test('a moved occurrence enters the visible window even if its source date is outside',()=>{
 const bills=[{id:'b',freq:'once',date:'2026-01-01',amount:100}],log=[{id:'move',billId:'b',due:'2026-01-01',to:'2026-10-15',state:'moved'}];
 const rows=financePaymentOccurrences(bills,log,'2026-10-01','2026-11-01');assert.equal(rows.length,1);assert.equal(rows[0].due,'2026-10-15');assert.equal(rows[0].movedFrom,'2026-01-01');
});
test('newest move and payment win without mutating the original logs',()=>{
 const bills=[{id:'b',freq:'once',date:'2026-10-01'}],log=[{id:'paid-new',billId:'b',due:'2026-10-20',amount:200,state:'paid'},{id:'paid-old',billId:'b',due:'2026-10-20',amount:100,state:'paid'},{billId:'b',due:'2026-10-01',to:'2026-10-20',state:'moved'},{billId:'b',due:'2026-10-01',to:'2026-10-10',state:'moved'}],original=structuredClone(log);
 const rows=financePaymentOccurrences(bills,log,'2026-10-01','2026-10-31');assert.equal(rows.length,1);assert.equal(rows[0].due,'2026-10-20');assert.equal(rows[0].log.id,'paid-new');assert.deepEqual(log,original);
});
