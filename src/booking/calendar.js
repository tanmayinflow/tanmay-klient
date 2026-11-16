// The coach calendar uses the same windows and instants as the booking engine.
// Display density is deliberately independent of appointment duration/start interval.
import { dayWindows } from "./slots.js";
import { startOfLocalDay, endOfLocalDay, localDateISO, localMinuteOfDay, zonedToUtc, isDateISO } from "./time.js";

export const COACH_CALENDAR_ZONE = "Europe/Prague";
export const ACTIVE_CALENDAR_STATUSES = new Set(["REQUESTED", "CONFIRMED"]);
export function calendarServiceLocations(service, locations = []) {
  // No service/location links means a location-free service, not all places.
  return locations.filter(location => location.active && service?.locationIds?.includes(location.id));
}
export function calendarTime(minute) {
  return minute === 1440 ? "24:00" : `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`;
}
export function parseCalendarTime(value) {
  if (value === "24:00") return 1440;
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(String(value))) return null;
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
}
export function validCalendarWindows(windows) {
  if (!Array.isArray(windows) || windows.length > 16) return false;
  const list = windows.slice().sort((a, b) => a.start_minute - b.start_minute);
  return list.every((w, i) => Number.isInteger(w.start_minute) && Number.isInteger(w.end_minute)
    && w.start_minute >= 0 && w.end_minute <= 1440 && w.end_minute > w.start_minute
    && w.start_minute % 5 === 0 && w.end_minute % 5 === 0
    && (!i || list[i - 1].end_minute <= w.start_minute));
}
export function genericDayOverrides(overrides, date) {
  return (overrides || []).filter(o => o.date_local === date && !o.service_id && !o.location_id);
}
export function replacementDayOverrides(windows) {
  if (!validCalendarWindows(windows)) throw new Error("invalid calendar windows");
  if (!windows.length) return [{ kind: "VACATION", start_minute: null, end_minute: null }];
  const sorted = windows.slice().sort((a, b) => a.start_minute - b.start_minute);
  const result = sorted.map(w => ({ kind: "OPEN", start_minute: w.start_minute, end_minute: w.end_minute }));
  let cursor = 0;
  for (const w of sorted) {
    if (w.start_minute > cursor) result.push({ kind: "CLOSED", start_minute: cursor, end_minute: w.start_minute });
    cursor = w.end_minute;
  }
  if (cursor < 1440) result.push({ kind: "CLOSED", start_minute: cursor, end_minute: 1440 });
  return result;
}
export function calendarDayWindows(date, data, serviceId = null, locationId = null) {
  return dayWindows(date, COACH_CALENDAR_ZONE, data?.rules || [], data?.overrides || [], { serviceId, locationId });
}
export function editableDayWindows(date, data) {
  const end = endOfLocalDay(date, COACH_CALENDAR_ZONE);
  return calendarDayWindows(date, data).map(w => ({
    start_minute: localMinuteOfDay(w.s, COACH_CALENDAR_ZONE),
    end_minute: w.e === end ? 1440 : localMinuteOfDay(w.e, COACH_CALENDAR_ZONE),
  }));
}
export function calendarDayItems(date, data) {
  const start = startOfLocalDay(date, COACH_CALENDAR_ZONE), end = endOfLocalDay(date, COACH_CALENDAR_ZONE);
  const overlap = w => Number(w.startsAt) < end && Number(w.endsAt) > start;
  return [
    ...(data?.bookings || []).filter(b => ACTIVE_CALENDAR_STATUSES.has(b.status)).map(b => ({ ...b, kind: "booking" })),
    ...(data?.blocks || []).map(b => ({ ...b, kind: "block" })),
    ...(data?.googleBusy || []).map((b, i) => ({ ...b, id: `google-${i}`, kind: "google" })),
  ].filter(overlap).sort((a, b) => a.startsAt - b.startsAt || a.endsAt - b.endsAt);
}
// Put overlapping appointments/blocks beside each other instead of hiding either.
export function calendarEventLanes(items) {
  const list = items.map(item => ({ ...item })).sort((a, b) => a.startsAt - b.startsAt || a.endsAt - b.endsAt);
  let group = [], groupEnd = -Infinity;
  const flush = () => {
    const ends = [];
    for (const item of group) {
      let lane = ends.findIndex(end => end <= item.startsAt);
      if (lane === -1) lane = ends.length;
      ends[lane] = item.endsAt; item.lane = lane;
    }
    group.forEach(item => { item.lanes = ends.length; });
  };
  for (const item of list) {
    if (item.startsAt >= groupEnd) { flush(); group = []; groupEnd = -Infinity; }
    group.push(item); groupEnd = Math.max(groupEnd, item.endsAt);
  }
  flush(); return list;
}
export function strictCalendarInstant(date, minute, zone = COACH_CALENDAR_ZONE) {
  if (!isDateISO(date) || !Number.isInteger(minute) || minute < 0 || minute > 1440) return null;
  if (minute === 1440) return endOfLocalDay(date, zone);
  const at = zonedToUtc(date, minute, zone);
  // Never silently save a nonexistent spring-forward wall time.
  return localDateISO(at, zone) === date && localMinuteOfDay(at, zone) === minute ? at : null;
}

export function calendarWallInstants(date, minute, zone = COACH_CALENDAR_ZONE) {
  const at = strictCalendarInstant(date, minute, zone);
  if (at == null) return [];
  if (minute === 1440) return [at];
  // Prague is the default; legacy entry points may supply their browser zone.
  return [-4,-3,-2,-1,0,1,2,3,4].map(n => at + n * 1800000).filter(value => localDateISO(value, zone) === date && localMinuteOfDay(value, zone) === minute);
}
export function calendarSelectionInstant(date, minute, selected, zone = COACH_CALENDAR_ZONE) {
  const choices = calendarWallInstants(date, minute, zone);
  if (Number.isFinite(selected) && choices.includes(selected)) return selected;
  return choices.length === 1 ? choices[0] : null;
}

// Week overview shares a wall-clock axis. Exact DST occurrences stay available
// in the day view and editor; repeated wall times must never hide one another.
export function calendarWallRange(date, startsAt, endsAt) {
  const start = startOfLocalDay(date, COACH_CALENDAR_ZONE), end = endOfLocalDay(date, COACH_CALENDAR_ZONE);
  const from = startsAt <= start ? 0 : localMinuteOfDay(startsAt, COACH_CALENDAR_ZONE);
  let to = endsAt >= end ? 1440 : localMinuteOfDay(endsAt, COACH_CALENDAR_ZONE);
  if (to <= from) to = Math.min(1440, from + (Math.min(end, endsAt) - Math.max(start, startsAt)) / 60000);
  return { from, to };
}
export function calendarWeekRange(days, data, serviceId = null, locationId = null) {
  let from = 480, to = 1080;
  for (const date of days) {
    const items = [...calendarDayItems(date, data), ...calendarDayWindows(date, data, serviceId, locationId).map(w => ({ startsAt: w.s, endsAt: w.e }))];
    for (const item of items) {
      const range = calendarWallRange(date, item.startsAt, item.endsAt);
      from = Math.min(from, Math.floor(range.from / 60) * 60);
      to = Math.max(to, Math.ceil(range.to / 60) * 60);
    }
  }
  return { from, to };
}
export function calendarWeekLanes(date, items) {
  const visual = items.map(item => { const range = calendarWallRange(date, item.startsAt, item.endsAt); return { item, startsAt: range.from, endsAt: range.to }; });
  return calendarEventLanes(visual).map(v => ({ ...v.item, lane: v.lane, lanes: v.lanes, visualFrom: v.startsAt, visualTo: v.endsAt }));
}
// A free tile represents one start, so 60-minute sessions offered every 30
// minutes have distinct 30-minute click targets rather than overlapping tiles.
// The reservation keeps the complete startsAt/endsAt pair from the server.
export function calendarSlotCells(date, slots = [], step = 30) {
  const groups = new Map();
  for (const slot of slots) {
    const range = calendarWallRange(date, slot.startsAt, slot.endsAt);
    const key = range.from;
    if (!groups.has(key)) groups.set(key, { from: range.from, to: Math.min(range.to, range.from + Math.max(5, Number(step) || 30)), choices: [] });
    groups.get(key).choices.push(slot);
  }
  return [...groups.values()].sort((a, b) => a.from - b.from);
}
