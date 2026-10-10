// Reconcile the app's own schedule blocks before any outgoing calendar writes.
// Training summaries and booked client sessions keep their domain-specific owners.
export const eventFields = event => ({
  title: event.summary || '',
  start: event.start?.dateTime ? new Date(event.start.dateTime).toISOString() : event.start?.date || '',
  end: event.end?.dateTime ? new Date(event.end.dateTime).toISOString() : event.end?.date || '',
});
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export async function listCalendarEvents(request, path, query) {
  const items = []; let page = '';
  do {
    const result = await request(path + query + (page ? '&pageToken=' + encodeURIComponent(page) : ''));
    items.push(...(result.items || [])); page = result.nextPageToken || '';
  } while (page);
  return items;
}

export async function reconcileSchedule({ shadow, tomb, desired, events, request, path, bodyFor, hash, getDay, updateDays, slot }) {
  const remote = new Map(events.map(event => [event.id, event]));
  const blocked = new Set(), conflicts = [];
  for (const [key, previous] of Object.entries(shadow)) {
    if (!key.startsWith('rz|')) continue;
    let event = remote.get(previous.gid);
    if (!event) {
      try { event = await request(path + '/' + encodeURIComponent(previous.gid)); }
      catch (error) {
        if (error.status === 404 || error.status === 410) event = { status: 'cancelled' };
        else throw error;
      }
    }
    const local = desired().find(row => row.key === key), body = local && bodyFor(local);
    const [, date, hour] = key.split('|');
    const row = getDay(date).sched?.[hour] || {};
    const localChanged = !body || hash(body) !== previous.h;
    const base = previous.base || (!localChanged && body ? eventFields(body) : null);
    const cancelled = event.status === 'cancelled';
    if (!cancelled && body && same(eventFields(body), eventFields(event))) {
      Object.assign(previous, { h: hash(body), base: eventFields(event), etag: event.etag }); continue;
    }
    const changed = cancelled || !base || !same(base, eventFields(event));
    if (!changed) { previous.etag = event.etag; previous.base = base; continue; }
    blocked.add(key);
    if (localChanged) { conflicts.push(key); continue; }
    const target = !cancelled && event.start?.dateTime && slot(event.start.dateTime);
    const isSameSlot = target && target.date === date && target.hour === hour;
    const targetSchedule = target && (getDay(target.date).sched || {});
    const startMinute = target && new Date(event.start.dateTime).getHours()*60 + new Date(event.start.dateTime).getMinutes();
    const duration = target && (new Date(event.end?.dateTime) - new Date(event.start.dateTime))/60000;
    const occupied = target && Object.entries(targetSchedule).some(([h,r]) => {
      if (!String(r.text || '').trim() || (target.date === date && h === hour)) return false;
      const from = r.calHour === h && r.calTime ? Number(r.calTime.split(':')[0])*60+Number(r.calTime.split(':')[1]) : parseInt(h,10)*60;
      const length = r.calHour === h && r.calMinutes ? r.calMinutes : (Number(r.span)||1)*60;
      return from < startMinute+duration && from+length > startMinute;
    });
    const unsupported = target && (!Number.isFinite(duration) || duration<=0 || startMinute+duration>1440);
    if (!cancelled && (!target || occupied || unsupported)) { conflicts.push(key); continue; }
    // Functional updates retain edits made while the Google request was in flight.
    const clear = current => ({ ...current, sched: { ...(current.sched || {}), [hour]: { ...row, text: '', done: false, span: 1, calTime: undefined, calHour: undefined, calMinutes: undefined } } });
    if (cancelled) {
      const applied = await updateDays(current => same(current[date]?.sched?.[hour] || {}, row) ? {...current, [date]:clear(current[date] || {})} : current);
      if (!applied) { conflicts.push(key); continue; }
      tomb[key] = { gid:previous.gid }; delete shadow[key]; continue;
    }
    const minutes = Math.max(1, (new Date(event.end.dateTime) - new Date(event.start.dateTime)) / 60000);
    const startDate = new Date(event.start.dateTime);
    const time = String(startDate.getHours()).padStart(2,'0') + ':' + String(startDate.getMinutes()).padStart(2,'0');
    const next = { ...row, text: event.summary === base.title ? row.text : event.summary || '', span: Math.max(1, Math.ceil(minutes / 60)), calHour:target.hour, calTime:time, calMinutes:minutes };
    const nextKey = 'rz|' + target.date + '|' + target.hour;
    // Keep the Google ID even when a block moves; no delete-and-recreate cycle.
    const nextBody = bodyFor({ ...local, key:nextKey, date: target.date, time, mins:minutes, title: event.summary || '' });
    const applied = await updateDays(current => {
      if (!same(current[date]?.sched?.[hour] || {}, row) || !same(current[target.date]?.sched || {}, targetSchedule)) return current;
      const nextDays = {...current, [date]:clear(current[date] || {})};
      nextDays[target.date] = {...(nextDays[target.date] || {}), sched:{...(nextDays[target.date]?.sched || {}), [target.hour]:next}};
      return nextDays;
    });
    if (!applied) { conflicts.push(key); continue; }
    if (!isSameSlot) {
      tomb[key] = { gid:previous.gid }; delete shadow[key];
    }
    shadow[nextKey] = { gid: previous.gid, h: hash(nextBody), base: eventFields(event), etag: event.etag };
    blocked.add(nextKey);
  }
  return { blocked, conflicts };
}

// Never overwrite an event that changed after our read, or an unknown ID collision.
export async function writeCalendarEvent({request, path, gid, body, previous}) {
  const create = async () => {
    try { return await request(path, {method:'POST', body:{...body,id:gid}}); }
    catch (error) {
      if (error.status !== 409) throw error;
      const existing = await request(path + '/' + gid);
      if (existing.status !== 'cancelled' && same(eventFields(existing), eventFields(body))) return existing;
      throw error;
    }
  };
  if (!previous) return create();
  try { return await request(path + '/' + gid, {method:'PATCH',body,headers:previous.etag ? {'If-Match':previous.etag} : {}}); }
  catch (error) { if (error.status === 404) return create(); throw error; }
}
