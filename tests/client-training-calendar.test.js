import test from 'node:test';
import assert from 'node:assert/strict';
import { calendarDays, clientSchedule } from '../src/training/clientSchedule.js';

const template = { id: 't', cz: 'Původní zadání', blocks: [] };
const plan = { id: 'p', sessions: [{ id: 's', templateId: 't', date: '2026-10-04' }] };

test('calendar uses a Monday-first civil month with no dates from adjacent months', () => {
  const october = calendarDays('2026-10');
  assert.deepEqual(october.slice(0, 4), [null, null, null, '2026-10-01']);
  assert.equal(october.at(-1), '2026-10-31');
  assert.equal(october.filter(Boolean).length, 31);
  assert.equal(calendarDays('2026-06')[0], '2026-06-01');
  assert.deepEqual(calendarDays('2026-02').slice(0, 7), [...Array(6).fill(null), '2026-02-01']);
});

test('calendar respects leap years and rejects invalid month input without crashing', () => {
  assert.equal(calendarDays('2024-02').at(-1), '2024-02-29');
  assert.equal(calendarDays('1900-02').at(-1), '1900-02-28');
  assert.equal(calendarDays('2000-02').at(-1), '2000-02-29');
  for (const month of ['', null, undefined, '2026-00', '2026-13', '2026-2', '2026-10-01']) assert.deepEqual(calendarDays(month), []);
});

test('client dates override an unstarted prescription without mutating its source', () => {
  const input = { plans: [plan], templates: [template], schedule: { p: { s: '2026-10-06' } }, sessions: [] };
  const before = JSON.stringify(input), [row] = clientSchedule(input);
  assert.equal(row.date, '2026-10-06');
  assert.equal(row.planned, plan.sessions[0]);
  assert.equal(row.template, template);
  assert.equal(JSON.stringify(input), before);
  assert.equal(clientSchedule({ plans: [plan] })[0].date, '2026-10-04');
  assert.equal(clientSchedule({ plans: [plan], schedule: { p: { s: '' } } })[0].date, '');
});

test('completed and running actuals keep their own date when the prescription moves', () => {
  for (const state of ['done', 'running']) {
    const record = { id: 'own', planId: 'p', planSessionId: 's', state, date: '2026-10-02', endedAt: 123 };
    const rows = clientSchedule({ plans: [plan], templates: [template], schedule: { p: { s: '2026-10-20' } }, sessions: [record] });
    assert.equal(rows.length, 1);
    assert.equal(rows[0].date, '2026-10-02');
    assert.equal(rows[0].record, record);
    assert.equal(rows[0].record.endedAt, 123);
  }
});

test('withdrawn prescriptions and additional actual sessions retain their complete history', () => {
  const own = { id: 'own', planId: 'p', planSessionId: 's', state: 'done', date: '2026-10-02' };
  const repeat = { ...own, id: 'repeat', date: '2026-10-08' };
  const old = { id: 'old', planId: 'withdrawn', planSessionId: 'former', state: 'done', date: '2026-09-03' };
  const rows = clientSchedule({ plans: [plan], sessions: [own, repeat, old] });
  assert.deepEqual(rows.map(row => [row.record.id, row.date]), [['own', '2026-10-02'], ['repeat', '2026-10-08'], ['old', '2026-09-03']]);
  const withdrawn = clientSchedule({ plans: [], sessions: [own, repeat, old] });
  assert.equal(withdrawn.length, 3);
  assert.equal(withdrawn[0].record, own);
});

test('missing template leaves a visible scheduled item, never a fabricated workout', () => {
  const [row] = clientSchedule({ plans: [plan] });
  assert.equal(row.date, '2026-10-04');
  assert.equal(row.template, undefined);
  assert.equal(row.record, undefined);
  assert.deepEqual(clientSchedule(), []);
});
