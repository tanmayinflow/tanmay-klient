import test from 'node:test';
import assert from 'node:assert/strict';
import {MOVEMENT_AUDIT_CONTEXT as context} from '../src/data/movementAuditContext.js';
import {MOVEMENT_AUDIT_ENTRIES as entries} from '../src/training/catalogMovementAuditData.js';
import {applyMovementAudit,MOVEMENT_AUDIT_FLAG} from '../src/training/catalogMovementAudit.js';
import {resolveMuscleMap,muscleMapEdit} from '../src/training/muscleMap.js';
import {exerciseEquipment,matchesAvailableEquipment} from '../src/training/exerciseEquipment.js';
import {libraryAuditedAllowsEstimatedMax} from '../src/training/catalogMovementAuditView.js';
import {recordsFor} from '../src/training/progress.js';
const clone=structuredClone,options={movementAuditContext:context,auditMetadata:context.metadataGuards};
const row=id=>clone(entries[id].before),run=r=>applyMovementAudit({tEx:[r]},options).tEx[0];

test('incomplete collections or metadata remain pending, complete input is idempotent',()=>{
 for(const input of [{},{tEx:null},{tEx:{}},{tEx:'pending'}])assert.equal(applyMovementAudit(input,options),input);
 const input={tEx:[row('crunch')]};
 assert.equal(applyMovementAudit(input),input);
 assert.equal(applyMovementAudit(input,{...options,auditMetadata:{}}),input);
 const result=applyMovementAudit(input,options);assert.equal(result[MOVEMENT_AUDIT_FLAG],true);assert.equal(applyMovementAudit(result,options),result);
 assert.notDeepEqual(result.tEx[0].exe,input.tEx[0].exe);
});
test('explicitly present undefined and personal metadata are not treated as absent defaults',()=>{
 for(const taxonomy of [undefined,null,{movements:undefined},{positions:['standing']},{aliases:undefined}]){
  const own={...row('crunch'),taxonomy};assert.deepEqual(run(own),own);
 }
 const own=row('crunch'),custom={...options,auditMetadata:{...options.auditMetadata,crunch:{...options.auditMetadata.crunch,personalSource:'keep'}}};
 assert.deepEqual(applyMovementAudit({tEx:[own]},custom).tEx[0],own);
});
test('rename retains personal aliases, notes, recording and stable identity',()=>{
 const original=row('ex26_machine_crunch'),input={...original,taxonomy:{...original.taxonomy,aliases:['My label','',null,undefined],note:'Personal note'}};
 const next=run(input);assert.equal(next.id,input.id);assert.equal(next.taxonomy.note,'Personal note');
 for(const alias of input.taxonomy.aliases)assert.ok(next.taxonomy.aliases.includes(alias));
 for(const field of ['mode','load','measurementType','loadMode','sideMode','mp','ms']){assert.equal(Object.hasOwn(next,field),Object.hasOwn(input,field));assert.deepEqual(next[field],input[field]);}
});
test('intentional removal of the displayed hip flexor survives normalization and reload',()=>{
 const id='ex26_hss_sideplank_march',ex=run(row(id)),meta=options.auditMetadata[id];
 const map=resolveMuscleMap(ex,meta,context);assert.ok(map.secondary.includes('hipflex'));assert.ok(!ex.ms.includes('hipflex'));
 assert.ok(!resolveMuscleMap(ex,{},context).secondary.includes('hipflex'));
 assert.ok(!resolveMuscleMap(ex,{...meta,personalSource:'mine'},context).secondary.includes('hipflex'));
 assert.ok(!resolveMuscleMap(ex,meta).secondary.includes('hipflex'));
 const patch=muscleMapEdit(ex,'secondary',map.secondary.filter(x=>x!=='hipflex'),meta,context),saved=JSON.parse(JSON.stringify({...ex,...patch}));
 assert.equal(saved.movementMuscleDisplayOptOut,true);assert.ok(!resolveMuscleMap(saved,meta,context).secondary.includes('hipflex'));
 const accepted=muscleMapEdit(ex,'primary',map.primary,meta,context);assert.ok(accepted.ms.includes('hipflex'));assert.equal(accepted.movementMuscleDisplayOptOut,true);
});
test('equipment uses complete setups and one-way chair capability',()=>{
 const cable=exerciseEquipment(run(row('ex26_cable_crunch')));
 for(const pulley of ['high_cable','adjustable_cable']){assert.equal(matchesAvailableEquipment(cable,[pulley]),false);assert.equal(matchesAvailableEquipment(cable,[pulley,'cable_rope']),true);}
 assert.equal(matchesAvailableEquipment(cable,['cable_rope']),false);
 assert.equal(matchesAvailableEquipment(exerciseEquipment(run(row('ex26_mob_seated_rotation'))),['thoracic_extension_chair']),true);
 assert.equal(matchesAvailableEquipment(exerciseEquipment(run(row('ex26_mob_chair_extension'))),['chair']),false);
 assert.equal(matchesAvailableEquipment(exerciseEquipment(run(row('ex26_machine_crunch'))),['stroj']),false);
});
test('seven specific trunk tasks hide only the derived max while raw set history remains intact',()=>{
 for(const id of ['ex26_cable_crunch','ex26_machine_crunch','woodchop','ex26_cable_rotation','ex26_singleleg_rotation','ex26_rotational_cable_press','ig28_dumbbell_side_bend']){
  const ex=run(row(id)),history=[{at:'2026-10-23T00:00:00Z',actual:{weight:12,reps:10}}],saved=clone(history),before=recordsFor('WEIGHT_REPS',history),after=recordsFor('WEIGHT_REPS',history,{allowEstimatedMax:libraryAuditedAllowsEstimatedMax(ex)});
  assert.ok(before.e1rm,id);assert.equal(after.e1rm,undefined,id);delete before.e1rm;assert.deepEqual(after,before);assert.deepEqual(history,saved);
  assert.equal(libraryAuditedAllowsEstimatedMax({...ex,exe:['Own','Own']}),undefined,id);
 }
});
