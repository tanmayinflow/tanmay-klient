import test from 'node:test';
import assert from 'node:assert/strict';
import {togetherPracticeItems,togetherPracticePlan} from '../src/shared/product/togetherPractice.js';

test('practice bridge shows existing latest habit status once without copying private fields',()=>{
  const pages={praxe:[{title:'2026-09-27',lines:['Chůze: splněno']},{title:'2026-09-28',lines:['Chůze: nezapsáno','Dech: pomalu: odpočinek','Chůze: nezapsáno'],note:'private'}],journal:[{title:'secret'}]};
  const items=togetherPracticeItems(pages,['praxe','journal']);
  assert.deepEqual(items.map(item=>[item.title,item.detail,item.date]),[['Chůze','nezapsáno','2026-09-28'],['Dech: pomalu','odpočinek','2026-09-28']]);
  assert.equal(JSON.stringify(items).includes('private'),false);
  assert.equal(JSON.stringify(items).includes('secret'),false);
  assert.equal(pages.praxe[1].lines.length,3);
});

test('bridge respects granted rooms, removes training log dates and makes only an editable plan draft',()=>{
  const pages={praxe:[{title:'2026-09-28',lines:['Walk: done']}],trenink:[{title:'Strength',detail:'Active plan',note:'private'},{title:'2026-09-27',detail:'Log'}],prameny:[{title:'Poetry',detail:'A book'}]};
  const items=togetherPracticeItems(pages,['trenink','trenink']);
  assert.deepEqual(items.map(item=>item.title),['Strength']);
  const plan=togetherPracticePlan(items[0],'2026-09-30','en');
  assert.deepEqual(plan,{title:'Strength',date:'2026-09-30',time:'18:00',minutes:20,note:'From: Training · Strength'});
  assert.equal(plan.approved,undefined);assert.equal(plan.status,undefined);
  assert.deepEqual(togetherPracticeItems(pages,[]),[]);
  assert.equal(togetherPracticePlan({room:'journal',title:'No'},'2026-09-30'),null);
});
