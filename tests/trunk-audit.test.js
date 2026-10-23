import test from 'node:test';import assert from 'node:assert/strict';
import {TRUNK_AUDIT_ENTRIES as entries} from '../src/training/catalogTrunkAuditData.js';
import {applyTrunkAudit,TRUNK_AUDIT_FLAG} from '../src/training/catalogTrunkAudit.js';
import {auditedAllowsEstimatedMax,trunkEquipmentLabels} from '../src/training/catalogTrunkAuditView.js';
import {exerciseEquipment,matchesAvailableEquipment} from '../src/training/exerciseEquipment.js';
import {recordsFor} from '../src/training/progress.js';
import {resolveMuscleMap} from '../src/training/muscleMap.js';
const clone=structuredClone,options={trunkAuditContext:{version:1,role:'client',entries:{},metadataGuards:{}},auditMetadata:{}};
const row=id=>clone(entries[id].before),run=r=>applyTrunkAudit({tEx:[r]},options).tEx[0];

test('incomplete role context leaves the content audit pending for a later complete attempt',()=>{
 const input={tEx:[row('deadbug')]},pending=applyTrunkAudit(input);
 assert.equal(pending,input);assert.equal(pending[TRUNK_AUDIT_FLAG],undefined);
 const ready=applyTrunkAudit(pending,options);assert.equal(ready[TRUNK_AUDIT_FLAG],true);assert.notDeepEqual(ready.tEx[0].exe,input.tEx[0].exe);assert.equal(applyTrunkAudit(ready,options),ready);
 const programme={tEx:[row('vi_hss3m')]};assert.equal(applyTrunkAudit(programme,options),programme);
 assert.equal(applyTrunkAudit(input,{trunkAuditContext:{},auditMetadata:{}}),input);
});
test('personal recording values, absent raw fields and semantic changes are not relabelled',()=>{
 const original=row('ex26_trx_pike');
 for(const patch of [{loadMode:'assist'},{mode:'sec'},{sideMode:'perSide'},{taxonomy:{supports:['wall']}},{exe:['Vlastní','Custom']}]){const own={...clone(original),...patch};assert.deepEqual(run(own),own);}
 for(const k of ['mode','load','measurementType','sideMode'])if(Object.hasOwn(original,k)){const own=clone(original);delete own[k];assert.deepEqual(run(own),own);}
 const note={...clone(original),auditNote:'Keep this',wat:['Own CZ','Own EN']},changed=run(note);assert.equal(changed.auditNote,note.auditNote);assert.deepEqual(changed.wat,note.wat);assert.deepEqual(changed.mp,note.mp);
});
test('Pallof equipment accepts complete alternative setups, not mixed incomplete ones',()=>{
 const r=run(row('pallof')),profile=exerciseEquipment(r),items=['guma','fixed_anchor','adjustable_cable','cable_handle'];
 for(let bits=0;bits<16;bits++){const available=items.filter((_,i)=>bits&(1<<i));assert.equal(matchesAvailableEquipment(profile,available),(!!(bits&1)&&!!(bits&2))||(!!(bits&4)&&!!(bits&8)),available.join(','));}
 assert.equal(trunkEquipmentLabels(r,'en').length,1);
 const half=run(row('ex26_halfkneel_pallof'));assert.equal(matchesAvailableEquipment(exerciseEquipment(half),['guma','fixed_anchor']),false);assert.equal(matchesAvailableEquipment(exerciseEquipment(half),['adjustable_cable','cable_handle']),true);assert.ok(trunkEquipmentLabels(half,'en').every(label=>!label.includes('band')));
});
test('exact implements do not gain capabilities from a broader equipment group',()=>{
 assert.equal(matchesAvailableEquipment(exerciseEquipment(run(row('ex26_captain_knee'))),['stroj']),false);
 assert.equal(matchesAvailableEquipment(exerciseEquipment(run(row('ex26_captain_knee'))),['captains_chair']),true);
 assert.equal(matchesAvailableEquipment(exerciseEquipment(run(row('ig26_slider_pike'))),['towel_pair','sliding_surface']),false);
 assert.equal(matchesAvailableEquipment(exerciseEquipment(run(row('ig26_slider_pike'))),['sliding_towel_pair','sliding_surface']),true);
 assert.equal(matchesAvailableEquipment(exerciseEquipment(run(row('ex26_trx_pike'))),['zaves']),false);
 assert.equal(matchesAvailableEquipment(exerciseEquipment(run(row('ex26_trx_pike'))),['zaves','suspension_anchor']),true);
});
test('six non-lifting tasks omit only a derived estimate and never rewrite recorded sets',()=>{
 for(const id of ['ex26_hss_quad_drag','abwheel','pallof','ex26_halfkneel_pallof','ex26_kneeling_chop','ex26_kb_eight']){
  const r=run(row(id)),history=[{at:'2026-10-23T00:00:00Z',actual:{weight:12,reps:10}}],saved=clone(history),before=recordsFor('WEIGHT_REPS',history),after=recordsFor('WEIGHT_REPS',history,{allowEstimatedMax:auditedAllowsEstimatedMax(r)});
  assert.ok(before.e1rm,id);assert.equal(after.e1rm,undefined,id);const rest={...before};delete rest.e1rm;assert.deepEqual(after,rest,id);assert.deepEqual(history,saved,id);
  assert.equal(auditedAllowsEstimatedMax({...r,exe:['Own','Own']}),undefined,id);
  assert.equal(auditedAllowsEstimatedMax({...r,loadMode:'assist'}),undefined,id);
 }
});
test('heel-supported seated lift displays strength without changing its preparation role or muscles',()=>{
 const r=run(row('ig26_seated_support_lift')),before=clone(r),map=resolveMuscleMap(r);
 assert.equal(map.mode,'strength');assert.equal(r.sessionRole,'prep');assert.deepEqual(map.primary,r.mp);assert.deepEqual(map.secondary,r.ms);assert.deepEqual(r,before);
 assert.deepEqual(resolveMuscleMap(r,null),map);
 assert.equal(resolveMuscleMap({...r,mp:['ham']}).mode,'mobility');
 assert.equal(resolveMuscleMap({...r,source:{...r.source,own:'preserve'}}).mode,'mobility');
});
