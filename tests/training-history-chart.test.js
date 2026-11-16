import test from 'node:test';
import assert from 'node:assert/strict';
import { historyChartPoints } from '../src/training/historyChart.js';

test('history chart preserves actual dates and uneven gaps, sorted by date',()=>{
 const points=historyChartPoints([{date:'2026-11-11',value:30,raw:30},{date:'2026-11-01',value:20,raw:20},{date:'2026-11-02',value:24,raw:24}]);
 assert.deepEqual(points.map(p=>p.date),['2026-11-01','2026-11-02','2026-11-11']);
 assert.equal(points[1].x-points[0].x,(points[2].x-points[0].x)/10);
 assert.ok(points[0].y>points[2].y);
});
test('chart never manufactures a zero for a missing value or time',()=>{
 assert.deepEqual(historyChartPoints([{date:'bad',raw:20,value:20},{date:'2026-11-01',raw:null,value:0},{date:'2026-11-01',raw:20,value:NaN}]),[]);
 const [p]=historyChartPoints([{date:'2026-11-01',raw:0,value:0}]);
 assert.equal(p.raw,0);assert.equal(p.x,160);assert.equal(p.y,56);
});
test('assistance keeps raw positive labels while improvement rises; equal-date points do not spread',()=>{
 const [a,b]=historyChartPoints([{date:'2026-11-01',raw:30,value:-30},{date:'2026-11-01',raw:20,value:-20}]);
 assert.equal(a.x,b.x);assert.ok(b.y<a.y);assert.equal(b.raw,20);
});
