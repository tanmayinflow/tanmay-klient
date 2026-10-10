import test from "node:test";
import assert from "node:assert/strict";
import { practiceCalendarEvents, practiceCalendarIcs } from "../src/shared/product/practiceCalendar.js";

test("practice calendar exports timed spans and all-day dates without private day data", () => {
  const events = practiceCalendarEvents("2026-10-10", {
    "6:00": { text: "Ranní plán", span: 2, note: "private" },
    "23:00": { text: "Přes půlnoc", span: 2 },
    "8:00": { text: "" },
  }, [{ id: "trip", title: "Výlet", start: "2026-10-10", end: "2026-10-12", note: "private" }, { id: "gone", title: "Zrušeno", start: "2026-10-10", end: "2026-10-11", deleted: true }]);
  assert.equal(events.length, 3);
  assert.deepEqual(events.map(({ start, end, allDay }) => ({ start, end, allDay })), [
    { start: "20261010T060000", end: "20261010T080000", allDay: false },
    { start: "20261010T230000", end: "20261011T010000", allDay: false },
    { start: "20261010", end: "20261012", allDay: true },
  ]);
  const ics = practiceCalendarIcs(events, new Date("2026-10-10T12:00:00Z"));
  assert.match(ics, /DTSTART;VALUE=DATE:20261010\r\nDTEND;VALUE=DATE:20261012/);
  assert.doesNotMatch(ics, /private|Zrušeno|DESCRIPTION/);
});

test("precise imported times and calendar text escaping survive export", () => {
  const title = "Řádek, jedna; dvě\n" + "ž".repeat(90);
  const events = practiceCalendarEvents("2026-10-10", { "9:00": { text: title, calHour: "9:00", calTime: "09:30", calMinutes: 45 } });
  assert.equal(events[0].start, "20261010T093000");
  assert.equal(events[0].end, "20261010T101500");
  const ics = practiceCalendarIcs(events);
  assert.match(ics, /SUMMARY:Řádek\\, jedna\\; dvě\\n/);
  for (const line of ics.split("\r\n")) assert.ok(new TextEncoder().encode(line).length <= 75);
});
