import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { dateAllowed, displayDate, monthDays, parseDateText, shiftDate, validDate } from '../src/shared/product/dateField.js';
import { deleteLongTermGoal, goalLongTermGoal, landscapeLongTermGoals } from '../src/shared/product/longTermGoals.js';

test('date entry validates real calendar days and accepts localized and ISO dates',()=>{
 assert.equal(parseDateText('29.2.2024'),'2024-02-29');
 assert.equal(parseDateText('29.2.2025'),null);
 assert.equal(parseDateText('31/04/2026'),null);
 assert.equal(parseDateText('2026-11-12'),'2026-11-12');
 assert.equal(parseDateText(''), '');
 assert.equal(displayDate('2026-11-12'),'12.11.2026');
 assert.equal(validDate('2026-2-01'),false);
 assert.equal(dateAllowed('2026-11-10','2026-11-11','2026-11-20'),false);
 assert.equal(dateAllowed('2026-11-20','2026-11-11','2026-11-20'),true);
});
test('calendar navigation handles leap years, month ends and Monday-first grids',()=>{
 assert.equal(shiftDate('2024-01-31',0,1),'2024-02-29');
 assert.equal(shiftDate('2024-02-29',0,12),'2025-02-28');
 assert.equal(shiftDate('2026-12-31',1),'2027-01-01');
 assert.equal(monthDays('2026-11')[0],'2026-10-26');
 assert.equal(new Set(monthDays('2026-11')).size,42);
});
test('long-term goal deletion and restoration preserve linked goals and unrelated records',()=>{
 const goal={id:'g',name:'Rows',area:'Body'};
 const original={areaMeta:{Body:{note:'keep',longTermGoals:[{id:'long',name:'Strength',note:'keep note',custom:'keep custom',createdAt:1}]}},goalMeta:{Rows:{longTermGoalId:'long'}},userGoals:[goal]};
 const removed=deleteLongTermGoal(original,'Body','long',true,100);
 assert.equal(landscapeLongTermGoals(removed,'Body',{includeArchived:true}).length,0);
 assert.equal(goalLongTermGoal(removed,goal),null);
 assert.equal(removed.userGoals,original.userGoals);
 assert.equal(removed.goalMeta,original.goalMeta);
 assert.equal(removed.areaMeta.Body.longTermGoals[0].custom,'keep custom');
 const restored=deleteLongTermGoal(removed,'Body','long',false,200);
 assert.equal(goalLongTermGoal(restored,goal).id,'long');
 assert.equal(original.areaMeta.Body.longTermGoals[0].deletedAt,undefined);
});
test('date fields across the app use the shared themed picker, including buffered finance dates',()=>{
 const files=[...fs.readdirSync('src').filter(f=>/\.(jsx|tsx)$/.test(f)).map(f=>path.join('src',f)),...fs.readdirSync('src/shared/ui').filter(f=>f.endsWith('.jsx')).map(f=>path.join('src/shared/ui',f))];
 const native=[];
 for(const file of files){const text=fs.readFileSync(file,'utf8'),sf=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
  function walk(n){if(ts.isJsxSelfClosingElement(n)&&n.tagName.getText(sf)==='input'&&n.attributes.properties.some(p=>ts.isJsxAttribute(p)&&p.name.text==='type'&&p.initializer&&ts.isStringLiteral(p.initializer)&&p.initializer.text==='date'))native.push(file);ts.forEachChild(n,walk);}walk(sf);
 }
 assert.deepEqual(native,[]);
 assert.match(fs.readFileSync('src/shared/ui/financeViews.jsx','utf8'),/if\(type==='date'\)return <DateField/);
 assert.doesNotMatch(fs.readFileSync('src/shared/ui/compass.jsx','utf8'),/st\.editMode && smiSmazat/);
});
