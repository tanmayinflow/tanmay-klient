// Only explicit schedule titles and all-day events leave the private day.
// Journals, reflections, habits and notes are never included in the export.
const validDate = value => /^\d{4}-\d{2}-\d{2}$/.test(value || "") && Number.isFinite(Date.parse(value + "T12:00:00Z"));
const compact = date => date.replaceAll("-", "");
const escapeText = value => String(value || "").replaceAll("\\", "\\\\").replace(/\r\n|\r|\n/g, "\\n").replaceAll(";", "\\;").replaceAll(",", "\\,");
function localTime(date, minutes) {
  const day = new Date(date + "T12:00:00Z");
  day.setUTCDate(day.getUTCDate() + Math.floor(minutes / 1440));
  const time = ((minutes % 1440) + 1440) % 1440;
  return compact(day.toISOString().slice(0, 10)) + "T" + String(Math.floor(time / 60)).padStart(2, "0") + String(time % 60).padStart(2, "0") + "00";
}
function fold(line) {
  const encoder = new TextEncoder();
  const parts = []; let part = "", bytes = 0;
  for (const character of line) {
    const size = encoder.encode(character).length;
    if (bytes + size > 75) { parts.push(part); part = " "; bytes = 1; }
    part += character; bytes += size;
  }
  parts.push(part);
  return parts.join("\r\n");
}
export function practiceCalendarEvents(date, schedule = {}, allDay = []) {
  if (!validDate(date)) return [];
  const timed = Object.entries(schedule).flatMap(([hour, row]) => {
    const hourNumber = Number(hour.split(":")[0]);
    if (!row || !String(row.text || "").trim() || !/^\d{1,2}(:00)?$/.test(hour) || hourNumber > 23) return [];
    const exact = String(row.calHour) === hour && /^\d{2}:\d{2}$/.test(row.calTime || "") && +row.calTime.slice(0, 2) < 24 && +row.calTime.slice(3) < 60;
    const start = exact ? +row.calTime.slice(0, 2) * 60 + +row.calTime.slice(3) : hourNumber * 60;
    const duration = exact && Number.isFinite(+row.calMinutes) && +row.calMinutes > 0 ? +row.calMinutes : Math.max(1, Math.min(24, +row.span || 1)) * 60;
    return [{ id: "day-" + date + "-" + hour, title: row.text.trim(), start: localTime(date, start), end: localTime(date, start + duration), allDay: false }];
  });
  return [...timed, ...allDay.filter(row => row && !row.deleted && validDate(row.start) && validDate(row.end) && row.start <= date && row.end > date && String(row.title || "").trim()).map(row => ({ id: "all-day-" + (row.id || row.start), title: row.title.trim(), start: compact(row.start), end: compact(row.end), allDay: true }))];
}
export function practiceCalendarIcs(events, now = new Date()) {
  const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//tanmay//Practice//CS", "CALSCALE:GREGORIAN", ...events.flatMap(event => ["BEGIN:VEVENT", "UID:" + escapeText(event.id) + "@practice.tanmay", "DTSTAMP:" + stamp, "DTSTART" + (event.allDay ? ";VALUE=DATE" : "") + ":" + event.start, "DTEND" + (event.allDay ? ";VALUE=DATE" : "") + ":" + event.end, "SUMMARY:" + escapeText(event.title), "END:VEVENT"]), "END:VCALENDAR"].map(fold).join("\r\n") + "\r\n";
}
