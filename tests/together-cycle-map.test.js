import test from 'node:test';
import assert from 'node:assert/strict';
import {CYCLE_ORDER,CYCLE_DEPTH,cycleMapTopics,cycleMapSelection,resolveCycleExploration} from '../src/shared/product/togetherCycleDepth.js';

test('the map preserves all phase content through named branches for both partners',()=>{
  for(const phaseId of CYCLE_ORDER){
    const guide=CYCLE_DEPTH[phaseId];
    for(const role of ['client','coach']){
      const care=cycleMapTopics(phaseId,'care',role),body=cycleMapTopics(phaseId,'body',role),symbol=cycleMapTopics(phaseId,'symbol',role);
      for(const topics of [care,body,symbol]){
        assert.equal(topics[0].id,'overview');
        assert.equal(new Set(topics.map(t=>t.id)).size,topics.length);
        assert.ok(topics.every(t=>t.label.length===2&&t.title.length===2));
      }
      assert.deepEqual(care[0].paragraphs,[role==='coach'?guide.partner:guide.woman]);
      for(const item of guide.care)assert.deepEqual(care.find(t=>t.id===item.id).paragraphs[0],role==='coach'?item.partner:item.woman);
      assert.equal(care.find(t=>t.id==='food').paragraphs.length,1);
      assert.deepEqual(care.find(t=>t.id==='shared').plan,guide.shared);
      assert.deepEqual(body.find(t=>t.id==='hormones').paragraphs,[guide.hormones]);
      assert.deepEqual(body.find(t=>t.id==='uterus').paragraphs,[guide.uterus]);
      assert.ok(body.find(t=>t.id==='pattern').paragraphs[0].every(v=>v.length>120));
      for(const [id,key] of [['archetype','text'],['shadow','shadow'],['story','story'],['ritual','ritual']])assert.deepEqual(symbol.find(t=>t.id===id).paragraphs[0],guide.symbol[key]);
      assert.deepEqual(symbol.find(t=>t.id==='archetype').question,guide.symbol.question);
      assert.deepEqual(symbol.find(t=>t.id==='archetype').correspondences,guide.symbol);
      assert.ok(symbol.find(t=>t.id==='spiral').paragraphs[0].every(v=>v.length>120));
    }
  }
});

test('changing branches cannot carry an invalid topic or fabricate an unknown day',()=>{
  for(const phaseId of CYCLE_ORDER){
    assert.equal(cycleMapSelection(phaseId,'body','food').topic.id,'overview');
    assert.equal(cycleMapSelection(phaseId,'care','uterus').topic.id,'overview');
    assert.equal(cycleMapSelection(phaseId,'symbol','story').topic.id,'story');
  }
  assert.deepEqual(cycleMapSelection(null,'body','hormones'),{topics:[],topic:null});
  const unknown={id:null,basis:'unknown'},date='2026-09-28';
  assert.deepEqual(cycleMapTopics(resolveCycleExploration(unknown,date,null).shown),[]);
  const browsed=resolveCycleExploration(unknown,date,{id:'luteal',current:null,date});
  assert.equal(browsed.current,null);assert.equal(browsed.exploring,true);
  assert.equal(cycleMapSelection(browsed.shown,'body','hormones').topic.id,'hormones');
  assert.equal(resolveCycleExploration(unknown,'2026-09-29',{id:'luteal',current:null,date}).shown,null);
});

test('direct phase names stay separate from the authorial metaphors',()=>{
  assert.deepEqual(CYCLE_ORDER.map(id=>CYCLE_DEPTH[id].short[0]),['Menstruační fáze','Folikulární fáze','Ovulační fáze','Luteální fáze']);
  assert.ok(CYCLE_ORDER.every(id=>CYCLE_DEPTH[id].short[0]!==CYCLE_DEPTH[id].title[0]));
});
