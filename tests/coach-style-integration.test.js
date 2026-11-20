import test from 'node:test';
import assert from 'node:assert/strict';
import {loadLibrary} from '../scripts/lib/exercise-library.mjs';
import * as TV from '../src/training/index.js';
import {seedCoachStyleExercises} from '../src/training/catalogCoachStyles.js';
import {HIP_AUDIT_CONTEXT} from '../src/data/hipAuditContext.js';
import {SHOULDER_AUDIT_CONTEXT} from '../src/data/shoulderAuditContext.js';

const {all,meta} = loadLibrary();
const options = {auditMetadata:meta, hipAuditContext:HIP_AUDIT_CONTEXT, shoulderAuditContext:SHOULDER_AUDIT_CONTEXT};
const rows = TV.seedCompleteExerciseLibrary(HIP_AUDIT_CONTEXT.role,{tEx:all},undefined,options).tEx;
const byId = new Map(rows.map(r => [r.id,r]));
const resolve = id => TV.resolveExercise(byId.get(id),meta[id],undefined,undefined,undefined,HIP_AUDIT_CONTEXT,SHOULDER_AUDIT_CONTEXT);
const expected = {
  BODYWEIGHT_REPS: ['ringfly','ringrtopush','ringfacepull','ringrevfly','pikeelev','bodyrowelev','pancakegm'],
  DURATION: ['ringrtosupport','elevbridge','fullbridge'],
  ADDED_WEIGHT_REPS: ['wchinup']
};

test('coach-style exercises resolve for both roles and delivery uses the live names without mutating old blocks', () => {
  const blocks = [];
  for (const [measurement, ids] of Object.entries(expected)) for (const id of ids) {
    const record = resolve(id);
    assert.equal(record.measurementType, measurement, id);
    assert.equal(record.clientVisible, true, id);
    assert.equal(record.requiresCoach, false, id);
    blocks.push({id,exId:id,name:['Původní název','Old name'],measurementType:measurement,sets:[]});
  }
  const snapshot = structuredClone(blocks);
  const sent = TV.clientBundle([{id:'p',sessions:[{templateId:'t'}]}],[{id:'t',blocks}],resolve);
  for (const block of sent.templates[0].blocks) {
    const record = resolve(block.exId);
    assert.deepEqual(block.name,[record.displayCz,record.displayEn]);
    const card = sent.exercises.find(row => row.id === block.exId);
    assert.deepEqual(card.eq,record.equipment);
    assert.equal(card.sideMode,record.sideMode);
  }
  assert.deepEqual(blocks,snapshot);
});

test('catalogue migration preserves coach edits, session snapshots and later deletions', () => {
  const own = {id:'ringfly',cz:'Osobní rozpažování',custom:true};
  const dip = {id:'dips',cz:'Kliky na bradlech'};
  const edited = {id:'ringdips',cz:'Moje dipy'};
  const sessions = [{blocks:[{exId:'dips',name:[dip.cz,'Dip']}]}];
  const next = seedCoachStyleExercises({tEx:[own,dip,edited],sessions});
  assert.equal(next.tEx.find(r => r.id === own.id),own);
  assert.equal(next.tEx.find(r => r.id === edited.id),edited);
  assert.equal(next.tEx.find(r => r.id === dip.id).cz,'Dipy');
  assert.equal(dip.cz,'Kliky na bradlech');
  assert.equal(next.sessions,sessions);
  const deleted = {...next,tEx:next.tEx.filter(r => r.id !== 'wchinup')};
  assert.equal(seedCoachStyleExercises(deleted),deleted);
});

test('stretch prescriptions preserve the recording convention of earlier deliveries', () => {
  assert.equal(resolve('lizard').sideMode,'perSide');
  assert.equal(resolve('wgs').sideMode,'perSide');
  for (const [id,kind,side] of [['pigeon','hip','perSide'],['hip9090','hip','alternating'],['threadneedle','shoulder','alternating']]) {
    const record = resolve(id);
    assert.equal(record.sideMode,side,id);
    const block = {id:'b',exId:id,measurementType:record.measurementType,sets:[]};
    const sent = TV.clientBundle([{id:'p',sessions:[{templateId:'t'}]}],[{id:'t',blocks:[block]}],resolve).exercises[0];
    const stamp = kind+'Audit';
    const policyOf = kind === 'hip' ? TV.hipDeliveredPolicy : TV.shoulderDeliveredPolicy;
    assert.equal(policyOf(sent)?.sideMode,side,id);
    const entry = (kind === 'hip' ? TV.HIP_AUDIT_ENTRIES : TV.SHOULDER_AUDIT_ENTRIES)[id];
    const [oldId, old] = Object.entries(entry.deliveryProfiles).find(([,p]) => p.fields.sideMode === 'none');
    const previous = {...old.fields,progression:old.progression,[stamp]:{v:1,profile:oldId}};
    assert.equal(policyOf(previous)?.sideMode,'none',id);
    assert.equal(policyOf({...sent,sideMode:'none'}),null,id);
  }
});
