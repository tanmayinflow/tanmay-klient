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
export function strictCalendarInstant(date, minute) {
  if (!isDateISO(date) || !Number.isInteger(minute) || minute < 0 || minute > 1440 || minute % 5 !== 0) return null;
  if (minute === 1440) return endOfLocalDay(date, COACH_CALENDAR_ZONE);
  const at = zonedToUtc(date, minute, COACH_CALENDAR_ZONE);
  // Never silently save a nonexistent spring-forward wall time.
  return localDateISO(at, COACH_CALENDAR_ZONE) === date && localMinuteOfDay(at, COACH_CALENDAR_ZONE) === minute ? at : null;
}

export function calendarWallInstants(date, minute) {
  const at = strictCalendarInstant(date, minute);
  if (at == null) return [];
  if (minute === 1440) return [at];
  // This calendar is fixed to Prague. Its repeated hour is exactly one hour.
  return [at - 3600000, at, at + 3600000].filter(value => localDateISO(value, COACH_CALENDAR_ZONE) === date && localMinuteOfDay(value, COACH_CALENDAR_ZONE) === minute);
}
export function calendarSelectionInstant(date, minute, selected) {
  const choices = calendarWallInstants(date, minute);
  if (Number.isFinite(selected) && choices.includes(selected)) return selected;
  return choices.length === 1 ? choices[0] : null;
}
