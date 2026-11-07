const MONTH_CHOICES = [1, 3, 6, 12];
const shiftDays = (iso, amount) => {
  const date = new Date(iso + 'T12:00:00Z');
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
};

// Calendar months retain the day when possible and clamp to the last day of
// shorter months. UTC date arithmetic keeps daylight-saving changes out of it.
export function shiftCalendarMonths(iso, amount) {
  const date = new Date(iso + 'T12:00:00Z'), day = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + amount);
  const end = new Date(date);
  end.setUTCMonth(end.getUTCMonth() + 1, 0);
  date.setUTCDate(Math.min(day, end.getUTCDate()));
  return date.toISOString().slice(0, 10);
}

// The past is read-only: extending read history must never replay old app
// schedules, cancel their completed blocks, or expand calendar permissions.
export function calendarWindow(cfg = {}, today) {
  const horizonMonths = MONTH_CHOICES.includes(Number(cfg.horizonMonths)) ? Number(cfg.horizonMonths) : 0;
  const readPastMonths = MONTH_CHOICES.includes(Number(cfg.readPastMonths)) ? Number(cfg.readPastMonths) : 0;
  const value = Number(cfg.horizon);
  const legacyDays = Number.isFinite(value) && value > 0 ? Math.min(366, Math.max(1, Math.trunc(value))) : 14;
  const last = horizonMonths ? shiftCalendarMonths(today, horizonMonths) : shiftDays(today, legacyDays);
  const horizonDays = Math.round((Date.parse(last + 'T12:00:00Z') - Date.parse(today + 'T12:00:00Z')) / 86400000);
  return { from: today, to: shiftDays(last, 1), readFrom: shiftCalendarMonths(today, -readPastMonths),
    last, horizonDays, horizonMonths, readPastMonths };
}
