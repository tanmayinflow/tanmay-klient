process.env.TZ = 'Europe/Prague';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { syncTimedCalendar, timedCalendarSegments } from '../src/shared/product/calendarTimed.js';

const from = '2026-10-27', to = '2026-10-30';
const event = (id, time, end, rest = {}) => ({ id, summary: id, start: { dateTime: time }, end: { dateTime: end }, ...rest });
const meeting = event('meeting', from + 'T09:37:00+01:00', from + 'T10:22:00+01:00');
function fixture(days = {}, calendars = { app: [meeting] }) {
  const calls = [];
  return { calls, days: () => days,
    options: { calendars: Object.keys(calendars), from, to, getDay: date => days[date] || {},
      updateDays: async change => { const next = change(days); const changed = next !== days; days = next; return changed; },
      request: async path => { calls.push(path); const key = decodeURIComponent(path.split('/')[2]); if (calendars[key] instanceof Error) throw calendars[key]; return { items: calendars[key] }; } },
    setDays: change => { days = change(days); }, calendars,
  };
}

test('new Google events keep exact minutes and separate simultaneous appointments alongside the own plan', async () => {
  const f = fixture({ [from]: { sched: { '9:00': { text: 'My plan' } }, journal: 'PRIVATE' } }, {
    app: [meeting, event('another', from + 'T09:45:00+01:00', from + 'T10:00:00+01:00')],
  });
  const result = await syncTimedCalendar(f.options);
  assert.equal(result.inserted, 2);
  assert.deepEqual(f.days()[from].calendarTimed.map(row => [row.title, row.time, row.endTime, row.minutes]), [
    ['meeting', '09:37', '10:22', 45], ['another', '09:45', '10:00', 15],
  ]);
  assert.deepEqual(f.days()[from].sched, { '9:00': { text: 'My plan' } });
  assert.equal(f.days()[from].journal, 'PRIVATE');
  assert.doesNotMatch(JSON.stringify(f.days()[from].calendarTimed), /PRIVATE/);
  assert.ok(f.calls.every(path => !/POST|PATCH|DELETE/.test(path)));
});

test('early and overnight Google events appear on each affected day with exact segment boundaries', async () => {
  const f = fixture({}, { app: [
    event('early', from + 'T03:15:00+01:00', from + 'T03:45:00+01:00'),
    event('overnight', from + 'T23:30:00+01:00', '2026-10-28T00:45:00+01:00'),
  ] });
  await syncTimedCalendar(f.options);
  assert.deepEqual(f.days()[from].calendarTimed.map(row => [row.time, row.endTime]), [['03:15', '03:45'], ['23:30', '24:00']]);
  assert.equal(f.days()[from].calendarTimed[1].continuesAfter, true);
  assert.deepEqual(f.days()['2026-10-28'].calendarTimed.map(row => [row.time, row.endTime, row.continuesBefore]), [['00:00', '00:45', true]]);
});

test('an event ending at midnight is not also displayed in the next day', () => {
  const rows = timedCalendarSegments(event('midnight', from + 'T23:30:00+01:00', '2026-10-28T00:00:00+01:00'), 'app', from, to);
  assert.equal(rows.length, 1); assert.equal(rows[0].row.endTime, '24:00');
});

test('timezone offsets and DST are converted to the actual local time, not the raw Google hour', () => {
  const rows = timedCalendarSegments(event('zone', '2026-10-25T01:15:00Z', '2026-10-25T02:00:00Z'), 'app', '2026-10-25', '2026-10-26');
  assert.equal(rows[0].row.time, '02:15'); assert.equal(rows[0].row.endTime, '03:00'); assert.equal(rows[0].row.minutes, 45);
});

test('failed calendar reads keep previous events while successful calendars update and remove their own', async () => {
  const keep = timedCalendarSegments(meeting, 'primary', from, to)[0].row;
  const remove = { ...keep, id: 'app|gone', calendarId: 'app', gid: 'gone' };
  const f = fixture({ [from]: { calendarTimed: [keep, remove] } }, { app: [], primary: Error('offline') });
  const result = await syncTimedCalendar(f.options);
  assert.equal(result.errors, 1); assert.equal(result.removed, 1);
  assert.deepEqual(f.days()[from].calendarTimed, [keep]);
});

test('a changed-account failure is propagated instead of applying a partial projection', async () => {
  const f = fixture({}, { app: [meeting], primary: Object.assign(Error('calendar-account-changed'), { code: 'calendar-account-changed' }) });
  await assert.rejects(syncTimedCalendar(f.options), /calendar-account-changed/);
  assert.deepEqual(f.days(), {});
});

test('same event IDs in different calendars stay separate and repeated sync is idempotent', async () => {
  const f = fixture({}, { app: [meeting], primary: [{ ...meeting, summary: 'Other calendar' }] });
  await syncTimedCalendar(f.options); const before = f.days();
  const result = await syncTimedCalendar(f.options);
  assert.equal(f.days(), before); assert.equal(result.inserted, 0); assert.equal(f.days()[from].calendarTimed.length, 2);
});

test('a moved or deleted Google event updates its exact location without touching handwritten schedule fields', async () => {
  const f = fixture({ [from]: { sched: { '9:00': { text: 'Keep' } } } });
  await syncTimedCalendar(f.options);
  f.calendars.app = [event('meeting', '2026-10-28T11:15:00+01:00', '2026-10-28T11:45:00+01:00', { summary: 'Moved' })];
  await syncTimedCalendar(f.options);
  assert.deepEqual(f.days()[from].calendarTimed, []);
  assert.equal(f.days()['2026-10-28'].calendarTimed[0].time, '11:15');
  f.calendars.app = [];
  await syncTimedCalendar(f.options);
  assert.deepEqual(f.days()['2026-10-28'].calendarTimed, []);
  assert.equal(f.days()[from].sched['9:00'].text, 'Keep');
});

test('app-owned, all-day, declined, cancelled and invalid events do not enter the timed projection', () => {
  for (const candidate of [
    { ...meeting, extendedProperties: { private: { tmApp: '1' } } },
    { ...meeting, start: { date: from } },
    { ...meeting, attendees: [{ self: true, responseStatus: 'declined' }] },
    { ...meeting, status: 'cancelled' },
    { ...meeting, end: { dateTime: 'invalid' } },
  ]) assert.deepEqual(timedCalendarSegments(candidate, 'app', from, to), []);
});

test('every page is read before cached rows are removed and dates use local day boundaries', async () => {
  const f = fixture(); let calls = 0;
  f.options.request = async path => {
    calls++; assert.match(path, /timeMin=2026-10-26T23%3A00%3A00.000Z/);
    return calls === 1 ? { items: [], nextPageToken: 'more' } : { items: [meeting] };
  };
  await syncTimedCalendar(f.options);
  assert.equal(calls, 2); assert.equal(f.days()[from].calendarTimed.length, 1);
});

test('unchanged legacy hourly imports retire while edited legacy text is preserved', async () => {
  const f = fixture({ [from]: { sched: {
    '9:00': { text: 'meeting', src: 'gcal', gid: 'meeting', span: 1 },
    '10:00': { text: 'My changed note', src: 'gcal', gid: 'edited', span: 1 },
  } } }, { app: [meeting, event('edited', from + 'T10:00:00+01:00', from + 'T11:00:00+01:00')] });
  await syncTimedCalendar(f.options);
  assert.deepEqual(f.days()[from].sched['9:00'], { text: '' });
  assert.equal(f.days()[from].sched['10:00'].text, 'My changed note');
});

test('a newer projection arriving during the read is not overwritten', async () => {
  const f = fixture(); const newer = [{ id: 'newer', calendarId: 'app', time: '12:00', start: '', title: 'Newer' }];
  f.options.request = async () => { f.setDays(days => ({ ...days, [from]: { calendarTimed: newer } })); return { items: [meeting] }; };
  await syncTimedCalendar(f.options);
  assert.deepEqual(f.days()[from].calendarTimed, newer);
});
