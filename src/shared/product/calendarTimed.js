import { listCalendarEvents } from './calendarSchedule.js';

const dayKey = date => date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
const clock = date => String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0');
const nextDay = date => { const next = new Date(date + 'T12:00:00'); next.setDate(next.getDate() + 1); return dayKey(next); };
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// Google events remain separate records. An hourly text field cannot represent
// two meetings at 09:10 and 09:45, or an overlap with the person's own plan.
export function timedCalendarSegments(event, calendarId, from, to, untitled = '(untitled)') {
  if (!event?.id || event.status === 'cancelled' || !event.start?.dateTime || !event.end?.dateTime) return [];
  if (event.extendedProperties?.private?.tmApp === '1') return [];
  if (event.attendees?.some(person => person.self && person.responseStatus === 'declined')) return [];
  const start = new Date(event.start.dateTime), end = new Date(event.end.dateTime);
  if (!Number.isFinite(+start) || !Number.isFinite(+end) || end <= start) return [];
  const rows = [], first = dayKey(start) < from ? from : dayKey(start);
  for (let date = first; date < to; date = nextDay(date)) {
    const dayStart = new Date(date + 'T00:00:00'), dayEnd = new Date(nextDay(date) + 'T00:00:00');
    if (dayStart >= end) break;
    const segmentStart = new Date(Math.max(+start, +dayStart)), segmentEnd = new Date(Math.min(+end, +dayEnd));
    if (segmentEnd <= segmentStart) continue;
    rows.push({ date, row: {
      id: calendarId + '|' + event.id, calendarId, gid: event.id,
      title: String(event.summary || '').trim() || untitled,
      start: start.toISOString(), end: end.toISOString(),
      time: clock(segmentStart), endTime: +segmentEnd === +dayEnd ? '24:00' : clock(segmentEnd),
      minutes: (+segmentEnd - +segmentStart) / 60000,
      continuesBefore: start < dayStart, continuesAfter: end > dayEnd,
    } });
  }
  return rows;
}

// A successful calendar read replaces only that calendar's projection. A failed
// read preserves its cached rows and must never look like a mass deletion.
export async function syncTimedCalendar({ calendars, from, to, request, getDay, updateDays, L = (_cs, en) => en }) {
  const successful = new Set(), byDay = new Map(), legacyByDay = new Map();
  let errors = 0, inserted = 0, removed = 0;
  const before = new Map();
  for (let date = from; date < to; date = nextDay(date)) before.set(date, getDay(date).calendarTimed || []);
  const query = '?singleEvents=true&showDeleted=false&orderBy=startTime&maxResults=2500&timeMin='
    + encodeURIComponent(new Date(from + 'T00:00:00').toISOString()) + '&timeMax='
    + encodeURIComponent(new Date(to + 'T00:00:00').toISOString());
  for (const calendarId of [...new Set(calendars.filter(Boolean))]) {
    let events;
    try { events = await listCalendarEvents(request, '/calendars/' + encodeURIComponent(calendarId) + '/events', query); }
    catch (error) {
      if (error.code === 'calendar-account-changed' || error.message === 'calendar-account-changed') throw error;
      errors++; continue;
    }
    successful.add(calendarId);
    for (const event of events) {
      for (const { date, row } of timedCalendarSegments(event, calendarId, from, to, L('(bez názvu)', '(untitled)'))) {
        if (!byDay.has(date)) byDay.set(date, new Map());
        byDay.get(date).set(row.id, row);
        // Retire only an unchanged legacy hourly import. A person may have
        // edited that old field; preserve their text if its origin is uncertain.
        if (!row.continuesBefore) {
          const hour = Number(row.time.slice(0, 2)) + ':00', key = date + '|' + hour;
          if (!legacyByDay.has(key)) legacyByDay.set(key, []);
          if (!legacyByDay.get(key).some(item => item.gid === row.gid)) legacyByDay.get(key).push(row);
        }
      }
    }
  }
  if (!successful.size) return { inserted, removed, errors };
  await updateDays(current => {
    let addedCount = 0, removedCount = 0;
    let next = current;
    for (let date = from; date < to; date = nextDay(date)) {
      const day = current[date] || {}, previous = day.calendarTimed || [];
      // Another tab may have delivered a newer projection during this read.
      if (!same(previous, before.get(date))) continue;
      const rows = [...previous.filter(row => !successful.has(row.calendarId)), ...(byDay.get(date)?.values() || [])]
        .sort((a, b) => a.time.localeCompare(b.time) || a.start.localeCompare(b.start) || a.id.localeCompare(b.id));
      let sched = day.sched;
      for (const [hour, row] of Object.entries(day.sched || {})) {
        if (row.src !== 'gcal') continue;
        const projected = legacyByDay.get(date + '|' + hour) || [];
        if (!projected.length || row.gid !== projected.map(item => item.gid).join(',') || String(row.text || '').trim() !== projected.map(item => item.title).join(' · ')) continue;
        sched = { ...sched };
        const retained = { ...row, text: '' };
        for (const key of ['src', 'gid', 'span', 'calTime', 'calHour', 'calMinutes']) delete retained[key];
        sched[hour] = retained;
      }
      if (same(previous, rows) && sched === day.sched) continue;
      const oldIds = new Set(previous.map(row => row.id)), newIds = new Set(rows.map(row => row.id));
      addedCount += rows.filter(row => !oldIds.has(row.id) || !same(row, previous.find(old => old.id === row.id))).length;
      removedCount += previous.filter(row => !newIds.has(row.id)).length;
      if (next === current) next = { ...current };
      next[date] = { ...day, calendarTimed: rows, ...(sched !== day.sched ? { sched } : {}) };
    }
    inserted = addedCount; removed = removedCount;
    return next;
  });
  return { inserted, removed, errors };
}
