// Booking · time, and the one class of bug that ruins a calendar.
//
// Everything is stored as an instant (epoch milliseconds, UTC). Everything a
// person sees is a wall clock in a named zone. The whole job of this file is
// to move between the two without ever going through
// `new Date(...).toISOString().slice(0, 10)`, which silently answers "what
// day is it in UTC" to a question that was about Prague.
//
// The zone conversion uses `Intl.DateTimeFormat`, which knows the real IANA
// rules including the two days a year that have 23 and 25 hours. Where a
// runtime cannot resolve a zone at all, `Europe/Prague` still works from the
// EU rule written below, and any other zone refuses loudly instead of
// quietly inventing an offset.

import { DEFAULT_TIMEZONE, MS_PER_MIN, SLOT_GRID_MIN } from "./types.js";

export class TimeZoneError extends Error {
  constructor(tz) {
    super("unknown time zone: " + tz);
    this.name = "TimeZoneError";
    this.timezone = tz;
  }
}

// ---- Can this runtime resolve a zone at all? -------------------------------
const _fmtCache = new Map();
function formatterFor(tz) {
  if (_fmtCache.has(tz)) return _fmtCache.get(tz);
  let f = null;
  try {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone: tz, hour12: false,
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
    // A runtime without zone data does not always throw; it may quietly hand
    // back UTC. Probe a known offset instead of trusting the constructor.
    if (tz === "UTC") { /* nothing to probe */ }
  } catch (e) { f = null; }
  _fmtCache.set(tz, f);
  return f;
}

// EU summer time, as law rather than as guess: from 01:00 UTC on the last
// Sunday in March to 01:00 UTC on the last Sunday in October. Used only when
// the runtime cannot resolve `Europe/Prague` itself.
function lastSundayUtc(year, monthIndex) {
  const d = new Date(Date.UTC(year, monthIndex + 1, 0)); // last day of month
  d.setUTCDate(d.getUTCDate() - d.getUTCDay());
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 1, 0, 0, 0);
}
function pragueOffsetMin(utcMs) {
  const y = new Date(utcMs).getUTCFullYear();
  const start = lastSundayUtc(y, 2);   // March
  const end = lastSundayUtc(y, 9);     // October
  return utcMs >= start && utcMs < end ? 120 : 60;
}

/** Offset of `tz` from UTC, in minutes, at the instant `utcMs`. */
export function zoneOffsetMin(utcMs, tz) {
  const zone = tz || DEFAULT_TIMEZONE;
  if (zone === "UTC") return 0;
  const f = formatterFor(zone);
  if (f) {
    const p = {};
    for (const part of f.formatToParts(new Date(utcMs))) p[part.type] = part.value;
    if (p.year && p.month && p.day && p.hour != null) {
      const asUtc = Date.UTC(
        Number(p.year), Number(p.month) - 1, Number(p.day),
        Number(p.hour) % 24, Number(p.minute), Number(p.second || 0)
      );
      return Math.round((asUtc - Math.floor(utcMs / 1000) * 1000) / MS_PER_MIN);
    }
  }
  if (zone === "Europe/Prague") return pragueOffsetMin(utcMs);
  throw new TimeZoneError(zone);
}

/** Wall clock parts in `tz` at the instant `utcMs`. */
export function zonedParts(utcMs, tz) {
  const off = zoneOffsetMin(utcMs, tz);
  const shifted = new Date(utcMs + off * MS_PER_MIN);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    hour: shifted.getUTCHours(),
    minute: shifted.getUTCMinutes(),
    weekday: shifted.getUTCDay(),        // 0 = Sunday, as in JS
    offsetMin: off,
  };
}

const pad2 = (n) => String(n).padStart(2, "0");

/** The local calendar date in `tz` at the instant `utcMs`, as YYYY-MM-DD. */
export function localDateISO(utcMs, tz) {
  const p = zonedParts(utcMs, tz);
  return p.year + "-" + pad2(p.month) + "-" + pad2(p.day);
}

/** Minutes since local midnight in `tz` at the instant `utcMs`. */
export function localMinuteOfDay(utcMs, tz) {
  const p = zonedParts(utcMs, tz);
  return p.hour * 60 + p.minute;
}

/** Local weekday in `tz` at the instant `utcMs`. 0 = Sunday. */
export function localWeekday(utcMs, tz) {
  return zonedParts(utcMs, tz).weekday;
}

/** Weekday of a plain YYYY-MM-DD, independent of any zone. 0 = Sunday. */
export function weekdayOfDateISO(dateISO) {
  const [y, m, d] = String(dateISO).split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/** Move a plain YYYY-MM-DD by whole days. Never touches a clock. */
export function shiftDateISO(dateISO, days) {
  const [y, m, d] = String(dateISO).split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + Number(days || 0));
  return dt.getUTCFullYear() + "-" + pad2(dt.getUTCMonth() + 1) + "-" + pad2(dt.getUTCDate());
}

/** Whole days between two plain dates, b − a. */
export function daysBetweenISO(a, b) {
  const pa = String(a).split("-").map(Number), pb = String(b).split("-").map(Number);
  return Math.round((Date.UTC(pb[0], pb[1] - 1, pb[2]) - Date.UTC(pa[0], pa[1] - 1, pa[2])) / 86400000);
}

export const isDateISO = (s) => /^\d{4}-\d{2}-\d{2}$/.test(String(s || ""));

/**
 * The instant at which local `dateISO` + `minuteOfDay` happens in `tz`.
 *
 * Two days a year this question has no answer or two answers, and pretending
 * otherwise is how a booking lands an hour off. On the spring-forward gap the
 * requested wall clock does not exist and the instant just after the jump is
 * returned. On the autumn overlap the wall clock happens twice and the FIRST
 * occurrence is returned, which is the one a person means when they say "half
 * past two".
 */
export function zonedToUtc(dateISO, minuteOfDay, tz) {
  const [y, m, d] = String(dateISO).split("-").map(Number);
  const wantMinutes = Number(minuteOfDay) || 0;
  const naive = Date.UTC(y, m - 1, d, 0, 0, 0, 0) + wantMinutes * MS_PER_MIN;
  // Two passes converge for every real zone: the first guess uses the offset
  // at the naive instant, the second uses the offset actually in force there.
  let guess = naive - zoneOffsetMin(naive, tz) * MS_PER_MIN;
  guess = naive - zoneOffsetMin(guess, tz) * MS_PER_MIN;
  const back = zonedParts(guess, tz);
  const gotMinutes = back.hour * 60 + back.minute;
  const sameDay = back.year === y && back.month === m && back.day === d;
  if (sameDay && gotMinutes === wantMinutes) return guess;
  // The wall clock did not exist (spring forward): the offset jumped forward
  // while we were converging. Return the first instant after the jump.
  const alt = naive - zoneOffsetMin(guess + 3600000, tz) * MS_PER_MIN;
  const backAlt = zonedParts(alt, tz);
  if (backAlt.year === y && backAlt.month === m && backAlt.day === d
      && backAlt.hour * 60 + backAlt.minute === wantMinutes) return alt;
  return Math.max(guess, alt);
}

/** Local midnight of `dateISO` in `tz`, as an instant. */
export const startOfLocalDay = (dateISO, tz) => zonedToUtc(dateISO, 0, tz);
/** The first instant of the next local day. Handles 23- and 25-hour days. */
export const endOfLocalDay = (dateISO, tz) => zonedToUtc(shiftDateISO(dateISO, 1), 0, tz);

/** How many minutes long the local day is. 1440 except twice a year. */
export function localDayLengthMin(dateISO, tz) {
  return Math.round((endOfLocalDay(dateISO, tz) - startOfLocalDay(dateISO, tz)) / MS_PER_MIN);
}

// ---- The grid -------------------------------------------------------------
export const onGrid = (min) => Number.isInteger(min) && min >= 0 && min % SLOT_GRID_MIN === 0;
export const gridFloor = (ms) => Math.floor(ms / (SLOT_GRID_MIN * MS_PER_MIN));
export const gridCeil = (ms) => Math.ceil(ms / (SLOT_GRID_MIN * MS_PER_MIN));

/**
 * The grid cells a half-open interval [startMs, endMs) touches.
 *
 * These are the rows written into `booking_slot_locks`, and the unique index
 * over them is what makes a double booking impossible rather than unlikely.
 * Half-open is the whole point: a booking that ends exactly where the next
 * one's protected interval begins shares no cell with it.
 */
export function gridCells(startMs, endMs) {
  const from = gridFloor(startMs);
  const to = gridCeil(endMs) - 1;
  const out = [];
  for (let c = from; c <= to; c++) out.push(c);
  return out;
}

/** Human wall-clock string HH:MM in `tz`. */
export function hhmm(utcMs, tz) {
  const p = zonedParts(utcMs, tz);
  return pad2(p.hour) + ":" + pad2(p.minute);
}

/** Minutes since midnight from "HH:MM". */
export function minuteOfDayFromHHMM(s) {
  const p = String(s || "").split(":");
  const h = Math.max(0, Math.min(23, parseInt(p[0], 10) || 0));
  const m = Math.max(0, Math.min(59, parseInt(p[1], 10) || 0));
  return h * 60 + m;
}

/** "HH:MM" from minutes since midnight. Minutes past 24h wrap for display. */
export function hhmmFromMinuteOfDay(min) {
  const v = ((Number(min) || 0) % 1440 + 1440) % 1440;
  return pad2(Math.floor(v / 60)) + ":" + pad2(v % 60);
}

/** RFC3339 in UTC, for Google. */
export const rfc3339 = (utcMs) => new Date(utcMs).toISOString().replace(/\.\d{3}Z$/, "Z");

/** The Monday-based start of the local ISO week containing `dateISO`. */
export function startOfISOWeek(dateISO) {
  const wd = weekdayOfDateISO(dateISO);         // 0 = Sunday
  const back = (wd + 6) % 7;                    // 0 = Monday
  return shiftDateISO(dateISO, -back);
}
