// Booking · where a free slot actually comes from.
//
// A slot is not a row anywhere. It is what survives an intersection:
//
//     weekly rules ∩ date overrides ∩ (not vacation) ∩ (not blocks)
//     ∩ service window ∩ location window ∩ buffers ∩ travel buffer
//     ∩ minimum notice ∩ booking horizon ∩ daily and weekly limits
//     ∩ (not confirmed bookings) ∩ (not pending bookings) ∩ (not Google busy)
//
// This module is pure: instants and plain objects in, instants out. It never
// touches a database, a clock or a network, so a test can hand it a fixed
// `now` and get the same answer forever. The Worker gathers the inputs; this
// decides what is free.

import { MS_PER_MIN, SLOT_GRID_MIN } from "./types.js";
import {
  zonedToUtc, localDateISO, shiftDateISO, weekdayOfDateISO,
  startOfLocalDay, endOfLocalDay, localDayLengthMin, startOfISOWeek, daysBetweenISO,
} from "./time.js";

const num = (v, dflt) => (Number.isFinite(Number(v)) ? Number(v) : dflt);
const roundUpTo = (v, step) => Math.ceil(v / step) * step;

// ---- Interval algebra -----------------------------------------------------
// Half-open [s, e). Kept deliberately small: sort, merge, subtract. Every
// availability question in the product is one of these three.

export function mergeIntervals(list) {
  const xs = (list || []).filter((i) => i && i.e > i.s).slice().sort((a, b) => a.s - b.s);
  const out = [];
  for (const i of xs) {
    const last = out[out.length - 1];
    if (last && i.s <= last.e) last.e = Math.max(last.e, i.e);
    else out.push({ s: i.s, e: i.e });
  }
  return out;
}

export function subtractIntervals(base, holes) {
  let out = mergeIntervals(base);
  for (const h of mergeIntervals(holes)) {
    const next = [];
    for (const i of out) {
      if (h.e <= i.s || h.s >= i.e) { next.push(i); continue; }
      if (h.s > i.s) next.push({ s: i.s, e: h.s });
      if (h.e < i.e) next.push({ s: h.e, e: i.e });
    }
    out = next;
  }
  return out;
}

export function intersectIntervals(a, b) {
  const A = mergeIntervals(a), B = mergeIntervals(b);
  const out = [];
  let i = 0, j = 0;
  while (i < A.length && j < B.length) {
    const s = Math.max(A[i].s, B[j].s), e = Math.min(A[i].e, B[j].e);
    if (e > s) out.push({ s, e });
    if (A[i].e < B[j].e) i++; else j++;
  }
  return out;
}

// ---- The protected interval ----------------------------------------------
// What a booking really occupies: the meeting plus the space around it. The
// coach's buffer and the location's buffer do not add up — the larger one
// wins, because they describe the same need (time to arrive, time to leave)
// from two directions. Travel buffer is the location's own, and applies to
// anything that is not online.

export function bufferMinutes(service, location) {
  const sBefore = Math.max(0, num(service && service.buffer_before_min, 0));
  const sAfter = Math.max(0, num(service && service.buffer_after_min, 0));
  const lBefore = Math.max(0, num(location && location.buffer_before_min, 0));
  const lAfter = Math.max(0, num(location && location.buffer_after_min, 0));
  return { before: Math.max(sBefore, lBefore), after: Math.max(sAfter, lAfter) };
}

/**
 * The half-open instant range a booking blocks, buffers included.
 * This is what becomes lock rows, and what other bookings are tested against.
 */
export function protectedInterval(startMs, endMs, service, location) {
  const b = bufferMinutes(service, location);
  return { s: startMs - b.before * MS_PER_MIN, e: endMs + b.after * MS_PER_MIN };
}

// ---- Availability for one local day ---------------------------------------
/**
 * The open windows on one local date, before anything is booked.
 *
 * `rules`      weekly rules: { weekday, start_minute, end_minute, service_id, location_id, valid_from, valid_until, active }
 * `overrides`  date overrides: { date_local, start_minute, end_minute, kind, service_id, location_id }
 *
 * A VACATION override clears the day outright. A CLOSED override removes its
 * window (or the whole day when it has none). An OPEN override adds one, even
 * on a weekday with no weekly rule at all.
 */
export function dayWindows(dateISO, tz, rules, overrides, opts) {
  const o = opts || {};
  const serviceId = o.serviceId || null;
  const locationId = o.locationId || null;
  const weekday = weekdayOfDateISO(dateISO);
  const dayStart = startOfLocalDay(dateISO, tz);
  const dayEnd = endOfLocalDay(dateISO, tz);
  const dayLen = localDayLengthMin(dateISO, tz);

  const applies = (r) => {
    if (r.active === 0 || r.active === false) return false;
    if (r.service_id && serviceId && r.service_id !== serviceId) return false;
    if (r.service_id && !serviceId) return false;
    if (r.location_id && locationId && r.location_id !== locationId) return false;
    if (r.location_id && !locationId) return false;
    if (r.valid_from && dateISO < r.valid_from) return false;
    if (r.valid_until && dateISO > r.valid_until) return false;
    return true;
  };

  // Minutes-from-local-midnight to an instant. On a 23-hour day a rule that
  // says "until 18:00" still means 18:00 on the clock, not 17:00.
  const at = (minute) => (minute >= dayLen ? dayEnd : zonedToUtc(dateISO, minute, tz));

  let windows = (rules || [])
    .filter((r) => Number(r.weekday) === weekday && applies(r))
    .map((r) => ({ s: at(Math.max(0, num(r.start_minute, 0))), e: at(Math.min(dayLen, num(r.end_minute, 0))) }));

  const todays = (overrides || []).filter((v) => v.date_local === dateISO && applies(v));

  if (todays.some((v) => v.kind === "VACATION")) return [];

  for (const v of todays.filter((x) => x.kind === "OPEN")) {
    windows.push({ s: at(Math.max(0, num(v.start_minute, 0))), e: at(Math.min(dayLen, num(v.end_minute, dayLen))) });
  }
  windows = mergeIntervals(windows);

  const closed = todays.filter((x) => x.kind === "CLOSED").map((v) => (
    v.start_minute == null && v.end_minute == null
      ? { s: dayStart, e: dayEnd }
      : { s: at(Math.max(0, num(v.start_minute, 0))), e: at(Math.min(dayLen, num(v.end_minute, dayLen))) }
  ));

  return subtractIntervals(windows, closed);
}

// ---- The generator --------------------------------------------------------
/**
 * Candidate start instants for one service on one local date.
 *
 * Only offers a start where the buffer before, the whole meeting and the
 * buffer after all fit inside one open window with nothing in the way. The
 * client is never told why a time is missing — an absent slot says enough.
 *
 * ctx:
 *   now            instant the request is being made at (tests pass a fixed one)
 *   tz             the zone the windows are written in (coach or location)
 *   service        row
 *   location       row or null
 *   rules          weekly availability
 *   overrides      date overrides
 *   busy           [{ s, e }] everything already taken: bookings (protected),
 *                  manual blocks, vacation runs and Google busy windows
 *   dayCount       bookings already on this local date (for daily_limit)
 *   weekCount      bookings already in this ISO week (for weekly_limit)
 */
export function slotsForDay(dateISO, ctx) {
  const { tz, service, location, rules, overrides, busy } = ctx;
  const now = num(ctx.now, Date.now());
  const duration = Math.max(SLOT_GRID_MIN, num(service.duration_min, 60));
  const step = Math.max(SLOT_GRID_MIN, num(service.slot_interval_min, 30));
  const minNotice = Math.max(0, num(service.min_notice_min, 0));
  const horizonDays = Math.max(0, num(service.booking_horizon_days, 60));
  const b = bufferMinutes(service, location);

  const dailyLimit = Math.max(0, num(service.daily_limit, 0));
  const weeklyLimit = Math.max(0, num(service.weekly_limit, 0));
  if (dailyLimit && num(ctx.dayCount, 0) >= dailyLimit) return [];
  if (weeklyLimit && num(ctx.weekCount, 0) >= weeklyLimit) return [];

  const todayLocal = localDateISO(now, tz);
  if (dateISO < todayLocal) return [];
  if (daysBetweenISO(todayLocal, dateISO) > horizonDays) return [];

  const windows = dayWindows(dateISO, tz, rules, overrides, {
    serviceId: service.id, locationId: location ? location.id : null,
  });
  if (!windows.length) return [];

  const taken = mergeIntervals(busy || []);
  const earliest = now + minNotice * MS_PER_MIN;
  const dayStart = startOfLocalDay(dateISO, tz);
  const out = [];

  for (const w of windows) {
    // Starts sit on the service's own interval measured from local midnight,
    // so a 30-minute grid reads 9:00, 9:30, 10:00 and not 9:07.
    const firstOffset = roundUpTo(Math.max(0, Math.round((w.s - dayStart) / MS_PER_MIN)), step);
    for (let off = firstOffset; ; off += step) {
      const start = dayStart + off * MS_PER_MIN;
      const end = start + duration * MS_PER_MIN;
      if (end > w.e) break;
      if (start < w.s) continue;
      if (start < earliest) continue;
      const prot = { s: start - b.before * MS_PER_MIN, e: end + b.after * MS_PER_MIN };
      if (taken.some((t) => t.s < prot.e && prot.s < t.e)) continue;
      out.push({ start, end, durationMin: duration });
    }
  }
  return out;
}

/**
 * Days that have at least one slot, and the slots on each, over a window.
 * The client sees days first and times second; an endless month of disabled
 * cells explains nothing.
 */
export function slotsOverRange(fromDateISO, days, ctx) {
  const out = [];
  for (let i = 0; i < Math.max(0, days); i++) {
    const d = shiftDateISO(fromDateISO, i);
    const slots = slotsForDay(d, {
      ...ctx,
      dayCount: (ctx.countsByDate || {})[d] || 0,
      weekCount: (ctx.countsByWeek || {})[startOfISOWeek(d)] || 0,
    });
    if (slots.length) out.push({ date: d, slots });
  }
  return out;
}

/**
 * Is this exact start still bookable? The last question asked before the
 * transaction, and asked again inside it. Returns null when it is fine, or an
 * error code when it is not.
 */
export function validateStart(startMs, ctx) {
  const { tz, service, location } = ctx;
  const now = num(ctx.now, Date.now());
  const duration = Math.max(SLOT_GRID_MIN, num(service.duration_min, 60));
  const endMs = startMs + duration * MS_PER_MIN;
  const dateISO = localDateISO(startMs, tz);
  const todayLocal = localDateISO(now, tz);

  if (startMs < now + Math.max(0, num(service.min_notice_min, 0)) * MS_PER_MIN) return "BOOKING_TOO_SOON";
  if (daysBetweenISO(todayLocal, dateISO) > Math.max(0, num(service.booking_horizon_days, 60))) return "BOOKING_TOO_FAR";

  const dailyLimit = Math.max(0, num(service.daily_limit, 0));
  const weeklyLimit = Math.max(0, num(service.weekly_limit, 0));
  if (dailyLimit && num(ctx.dayCount, 0) >= dailyLimit) return "DAILY_LIMIT";
  if (weeklyLimit && num(ctx.weekCount, 0) >= weeklyLimit) return "WEEKLY_LIMIT";

  const windows = dayWindows(dateISO, tz, ctx.rules, ctx.overrides, {
    serviceId: service.id, locationId: location ? location.id : null,
  });
  const inside = windows.some((w) => w.s <= startMs && endMs <= w.e);
  if (!inside) return "OUTSIDE_AVAILABILITY";

  const prot = protectedInterval(startMs, endMs, service, location);
  if (mergeIntervals(ctx.busy || []).some((t) => t.s < prot.e && prot.s < t.e)) return "SLOT_TAKEN";
  return null;
}
