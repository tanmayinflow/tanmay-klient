import { validCalendarWindows } from "./calendar.js";

export const WEEKDAYS = [1, 2, 3, 4, 5, 6, 0];
export const isWeeklyWindow = r => !r.service_id && !r.location_id && !r.valid_from && !r.valid_until
  && r.active !== false && Number(r.active ?? 1) !== 0;

// Scoped, dated and disabled rules are intentionally outside this weekly editor.
export function weeklyDraft(rules = []) {
  return rules.filter(isWeeklyWindow).map((r, i) => ({
    key: String(r.id || `loaded-${i}`), weekday: Number(r.weekday),
    start_minute: Number(r.start_minute), end_minute: Number(r.end_minute),
  }));
}
export function validWeek(windows) {
  return Array.isArray(windows) && windows.every(w => WEEKDAYS.includes(w.weekday))
    && new Set(windows.map(w => w.key)).size === windows.length
    && WEEKDAYS.every(day => validCalendarWindows(windows.filter(w => w.weekday === day)));
}
export function weeklyPayload(original, windows) {
  if (!validWeek(windows)) throw new Error("INVALID_WEEK");
  const rules = [
    ...original.filter(r => !isWeeklyWindow(r)).map(r => ({ ...r })),
    ...windows.map(({ weekday, start_minute, end_minute }) => ({ weekday, start_minute, end_minute, active: 1 })),
  ];
  if (rules.length > 200) throw new Error("TOO_MANY_WINDOWS");
  return { rules, expectedRuleIds: original.map(r => r.id) };
}
export function weekSignature(windows) {
  return JSON.stringify(windows.map(({ weekday, start_minute, end_minute }) => ({ weekday, start_minute, end_minute }))
    .sort((a, b) => a.weekday - b.weekday || a.start_minute - b.start_minute || a.end_minute - b.end_minute));
}
export function replaceWeeklyWindow(windows, window) {
  const next = [...windows.filter(w => w.key !== window.key), window];
  return validWeek(next) ? next : null;
}
export function copyWeeklyDay(windows, from, targets, key) {
  const days = [...new Set(targets)].filter(day => WEEKDAYS.includes(day) && day !== from);
  const source = windows.filter(w => w.weekday === from);
  const next = [...windows.filter(w => !days.includes(w.weekday)),
    ...days.flatMap(weekday => source.map(w => ({ ...w, key: key(), weekday })))];
  return validWeek(next) ? next : null;
}
export function snapMinute(minute, step = 15) {
  return Math.max(0, Math.min(1440, Math.round(minute / step) * step));
}
export function shiftWeeklyWindow(window, delta, mode = "move", weekday = window.weekday) {
  const minutes = Math.round(delta / 5) * 5;
  if (mode === "start") return { ...window, start_minute: Math.max(0, Math.min(window.end_minute - 5, window.start_minute + minutes)) };
  if (mode === "end") return { ...window, end_minute: Math.min(1440, Math.max(window.start_minute + 5, window.end_minute + minutes)) };
  const duration = window.end_minute - window.start_minute;
  const start_minute = Math.max(0, Math.min(1440 - duration, window.start_minute + minutes));
  return { ...window, weekday, start_minute, end_minute: start_minute + duration };
}
export function nextWeeklyGap(windows, weekday, preferred = 540) {
  const sorted = windows.filter(w => w.weekday === weekday).slice().sort((a, b) => a.start_minute - b.start_minute);
  let cursor = 0;
  const gaps = [];
  for (const w of sorted) { if (w.start_minute > cursor) gaps.push([cursor, w.start_minute]); cursor = Math.max(cursor, w.end_minute); }
  if (cursor < 1440) gaps.push([cursor, 1440]);
  const gap = gaps.find(([a, b]) => preferred >= a && preferred < b) || gaps.find(([a, b]) => a >= preferred && b - a >= 5) || gaps[0];
  if (!gap) return null;
  const start_minute = preferred >= gap[0] && preferred < gap[1] ? preferred : gap[0];
  return { weekday, start_minute, end_minute: Math.min(start_minute + 60, gap[1]) };
}
