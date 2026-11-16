import { zonedParts, zonedToUtc } from '../../src/booking/time.js';

// A calendar month, preserving Prague wall time and clamping short months.
export function calendarMonthExpiry(firstSessionAt, months = 1) {
  if (!Number.isSafeInteger(firstSessionAt) || firstSessionAt <= 0 || firstSessionAt > 253370761200000 || months !== 1) return null;
  const p = zonedParts(firstSessionAt, 'Europe/Prague');
  const target = new Date(Date.UTC(p.year, p.month - 1 + months, 1));
  const year = target.getUTCFullYear(), month = target.getUTCMonth() + 1;
  const day = Math.min(p.day, new Date(Date.UTC(year, month, 0)).getUTCDate());
  const date = [year, String(month).padStart(2, '0'), String(day).padStart(2, '0')].join('-');
  return zonedToUtc(date, p.hour * 60 + p.minute, 'Europe/Prague');
}
