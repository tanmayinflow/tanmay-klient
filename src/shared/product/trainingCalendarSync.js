import { clientSchedule } from "../../training/clientSchedule.js";
import { trainingOf, patchTraining, sessionsOf } from "../../training/storage.js";
import { listCalendarEvents } from "./calendarSchedule.js";

const object = value => value && typeof value === "object" && !Array.isArray(value) ? value : {};
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const civilDate = value => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(value + "T12:00:00Z");
  return Number.isFinite(+parsed) && parsed.toISOString().slice(0, 10) === value;
};
const nextDate = value => new Date(Date.parse(value + "T12:00:00Z") + 86400000).toISOString().slice(0, 10);
const rowKey = row => JSON.stringify([row.plan.id, row.planned.id]);
const rowsOf = snapshot => clientSchedule(snapshot).filter(row => row.plan?.id && row.planned?.id);
const rowStamp = row => row ? JSON.stringify({ date: row.date, plan: row.plan, planned: row.planned, record: row.record || null }) : "";
const mappingOf = (snapshot, calendarId, key) => object(object(snapshot.sync)[calendarId])[key];
const owned = (event, key) => event?.extendedProperties?.private?.tmApp === "1" && event.extendedProperties.private.tmKind === "clientTraining" && event.extendedProperties.private.tmKey === key;
const eventDate = event => event?.status === "cancelled" ? "" : civilDate(event?.start?.date) && event.end?.date === nextDate(event.start.date) && !event.start.dateTime && !event.end.dateTime ? event.start.date : null;

export function clientTrainingCalendarSnapshot(coll) {
  const training = trainingOf(coll) || {}, delivered = training.delivered || {};
  return { plans: delivered.plans || [], templates: delivered.templates || [], schedule: training.sched || {},
    sessions: sessionsOf(coll), sync: object(coll?.cal?.clientTrainingSync) };
}

// Only the client's date overrides and calendar receipts are writable here.
// A returned snapshot can never replace the delivered prescription or a result.
export function applyClientTrainingCalendarSnapshot(coll, next) {
  return { ...patchTraining(coll, { sched: object(next.schedule) }),
    cal: { ...object(coll?.cal), clientTrainingSync: object(next.sync) } };
}

export async function clientTrainingEventId(planId, sessionId) {
  const bytes = new TextEncoder().encode(JSON.stringify([planId, sessionId]));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return "tmct" + [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, "0")).join("");
}

function eventBody(row, key, L) {
  const label = row.planned.title || row.planned.name || row.template?.name ||
    L(row.template?.cz, row.template?.en) || row.plan.name || L(row.plan.cz, row.plan.en) || L("Trénink", "Training");
  return { summary: typeof label === "string" ? label : L("Trénink", "Training"),
    start: { date: row.date }, end: { date: nextDate(row.date) }, status: "confirmed", transparency: "transparent",
    extendedProperties: { private: { tmApp: "1", tmKind: "clientTraining", tmKey: key } } };
}

// st.getClientTrainingCalendar() must read the freshest collection. Its updater
// receives the latest snapshot atomically and returns Promise<boolean>.
// Google may move/cancel a whole-day date, but cannot create a prescription,
// change exercises, write results or move a started/completed session.
export async function syncClientTrainingCalendar({ st, cfg, calId, request, from, to, L = (cs, en) => en || cs }) {
  const result = { changes: 0, imported: 0, exported: 0, errors: 0, conflicts: [], ignored: 0, firstError: "" };
  if (cfg?.trenink === false || !calId || !st.getClientTrainingCalendar || !st.updateClientTrainingCalendar) return result;
  if (!civilDate(from) || !civilDate(to) || to <= from) return { ...result, errors: 1, firstError: "invalid-calendar-range" };
  const conflict = key => { if (!result.conflicts.includes(key)) result.conflicts.push(key); };
  const failure = error => { result.errors++; if (!result.firstError) result.firstError = error.reason || error.message || "calendar-sync-failed"; };
  const path = "/calendars/" + encodeURIComponent(calId) + "/events";
  const snapshot = st.getClientTrainingCalendar();
  const initial = new Map(rowsOf(snapshot).map(row => [rowKey(row), row]));
  const mappings = object(object(snapshot.sync)[calId]);
  let events;
  try {
    events = await listCalendarEvents(request, path, "?singleEvents=true&showDeleted=true&maxResults=2500&privateExtendedProperty=tmKind%3DclientTraining&timeMin=" + encodeURIComponent(from + "T00:00:00Z") + "&timeMax=" + encodeURIComponent(to + "T00:00:00Z"));
  } catch (error) { failure(error); return result; }
  const remote = new Map(events.map(event => [event.id, event]));
  const keys = new Set([...Object.keys(mappings), ...[...initial].filter(([, row]) => !row.record && civilDate(row.date) && row.date >= from && row.date < to).map(([key]) => key)]);

  for (const key of keys) {
    const row = initial.get(key), previous = mappings[key];
    // A withdrawn plan and actual workout records are not an editable date.
    if (!row || row.record) { result.ignored++; continue; }
    if (row.date && !civilDate(row.date)) { conflict(key); continue; }
    const expectedStamp = rowStamp(row), expectedMapping = previous;
    const freshEnough = () => {
      const latest = st.getClientTrainingCalendar();
      return rowStamp(rowsOf(latest).find(item => rowKey(item) === key)) === expectedStamp && same(mappingOf(latest, calId, key), expectedMapping);
    };
    if (!freshEnough()) { conflict(key); continue; }
    const gid = previous?.eventId || await clientTrainingEventId(row.plan.id, row.planned.id);
    let event = remote.get(gid);
    try {
      if (!event && previous) {
        try { event = await request(path + "/" + encodeURIComponent(gid)); }
        catch (error) {
          if (error.status === 404 || error.status === 410) event = { id: gid, status: "cancelled" };
          else throw error;
        }
      }
      // Missing markers on a deletion are normal. Live foreign events never
      // become workouts, even when their ID accidentally matches a receipt.
      if (event && event.status !== "cancelled" && !owned(event, key)) { conflict(key); continue; }
      const theirs = event ? eventDate(event) : null;
      if (event && theirs === null) { conflict(key); continue; }
      const baseline = previous?.date;
      const localChanged = previous && row.date !== baseline;
      const remoteChanged = event && previous && theirs !== baseline;
      if (localChanged && remoteChanged && row.date !== theirs) { conflict(key); continue; }
      if (!previous && event && theirs !== row.date) { conflict(key); continue; }

      const checkpoint = async (date, saved, importDate = false) => {
        let blocked = false;
        const receipt = { eventId: gid, date, etag: saved?.etag || "", deleted: !date };
        await st.updateClientTrainingCalendar(current => {
          if (!same(mappingOf(current, calId, key), expectedMapping)) { blocked = true; return current; }
          const latest = rowsOf(current).find(item => rowKey(item) === key);
          if (importDate && rowStamp(latest) !== expectedStamp) { blocked = true; return current; }
          const schedule = importDate ? { ...current.schedule, [row.plan.id]: { ...object(current.schedule[row.plan.id]), [row.planned.id]: date } } : current.schedule;
          const sync = { ...current.sync, [calId]: { ...object(current.sync[calId]), [key]: receipt } };
          if (same(schedule, current.schedule) && same(sync, current.sync)) return current;
          return { ...current, schedule, sync };
        });
        if (blocked) { conflict(key); return false; }
        return true;
      };

      if (event && previous && remoteChanged && !localChanged) {
        // Empty string explicitly overrides a default date in a delivered plan.
        if (await checkpoint(theirs, event, true)) { result.imported++; result.changes++; }
        continue;
      }
      if (event && theirs === row.date) { await checkpoint(row.date, event); continue; }
      if (!row.date && !previous) continue;
      if (!freshEnough()) { conflict(key); continue; }
      let saved;
      if (event) {
        if (!event.etag) { conflict(key); continue; }
        // Keep calendar-only labels/notes. The only editable overlap with the
        // delivered plan is its scheduled civil date.
        const body = row.date ? { start: { date: row.date }, end: { date: nextDate(row.date) }, status: "confirmed" } : { status: "cancelled" };
        saved = await request(path + "/" + encodeURIComponent(gid), { method: "PATCH", headers: { "If-Match": event.etag }, body });
      } else {
        if (!row.date) continue;
        const body = { ...eventBody(row, key, L), id: gid };
        try { saved = await request(path, { method: "POST", body }); }
        catch (error) {
          if (error.status !== 409) throw error;
          saved = await request(path + "/" + encodeURIComponent(gid));
          if (!owned(saved, key) || eventDate(saved) !== row.date) { conflict(key); continue; }
        }
      }
      if (await checkpoint(row.date, saved)) { result.exported++; result.changes++; }
    } catch (error) { if (error.status === 412 || error.status === 409) conflict(key); else failure(error); }
  }
  return result;
}
