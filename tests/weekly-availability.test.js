import { test } from "node:test";
import assert from "node:assert/strict";
import { weeklyDraft, weeklyPayload, validWeek, replaceWeeklyWindow, copyWeeklyDay,
  shiftWeeklyWindow, nextWeeklyGap, weekSignature } from "../src/booking/weeklyAvailability.js";

const block = (key, weekday, start_minute, end_minute) => ({ key, weekday, start_minute, end_minute });
test("weekly save preserves service, location, date bounds and inactive rules, and carries the complete revision", () => {
  const rules = [
    { id: "main", weekday: 1, start_minute: 540, end_minute: 1020, active: 1 },
    { id: "service", weekday: 1, start_minute: 480, end_minute: 540, service_id: "session", active: 1 },
    { id: "location", weekday: 2, start_minute: 600, end_minute: 720, location_id: "room", active: 1 },
    { id: "dated", weekday: 3, start_minute: 600, end_minute: 720, valid_from: "2027-01-01", valid_until: "2027-02-01", active: 1 },
    { id: "inactive", weekday: 4, start_minute: 600, end_minute: 720, active: 0 },
  ];
  const draft = weeklyDraft(rules);
  assert.deepEqual(draft, [block("main", 1, 540, 1020)]);
  const payload = weeklyPayload(rules, [block("main", 1, 600, 900)]);
  assert.deepEqual(payload.rules.slice(0, 4), rules.slice(1));
  assert.deepEqual(payload.expectedRuleIds, rules.map(r => r.id));
  assert.deepEqual(payload.rules[4], { weekday: 1, start_minute: 600, end_minute: 900, active: 1 });
  assert.equal(weeklyPayload(rules, []).rules.length, 4);
});
test("overlaps, reversed windows, duplicate keys and off-grid minutes are rejected; adjacent blocks and midnight are valid", () => {
  const windows = [block("a", 1, 540, 600)];
  assert.equal(replaceWeeklyWindow(windows, block("b", 1, 595, 660)), null);
  assert.equal(validWeek([block("a", 1, 600, 540)]), false);
  assert.equal(validWeek([block("a", 1, 541, 600)]), false);
  assert.equal(validWeek([block("a", 1, null, 600)]), false);
  assert.equal(validWeek([block("a", 8, 540, 600)]), false);
  assert.equal(validWeek([block("a", 1, 540, 600), block("a", 2, 540, 600)]), false);
  assert.ok(replaceWeeklyWindow(windows, block("b", 1, 600, 660)));
  assert.ok(validWeek([block("a", 0, 0, 1440)]));
  assert.throws(() => weeklyPayload([], [block("bad", 1, 590, 580)]), /INVALID_WEEK/);
});
test("dragging preserves duration within a day and resizing cannot cross the other edge or midnight", () => {
  const w = block("a", 1, 540, 600);
  assert.deepEqual(shiftWeeklyWindow(w, 30, "move", 2), block("a", 2, 570, 630));
  assert.deepEqual(shiftWeeklyWindow(w, -900), block("a", 1, 0, 60));
  assert.deepEqual(shiftWeeklyWindow(w, 2000), block("a", 1, 1380, 1440));
  assert.equal(shiftWeeklyWindow(w, 900, "start").start_minute, 595);
  assert.equal(shiftWeeklyWindow(w, -900, "end").end_minute, 545);
  assert.equal(shiftWeeklyWindow(w, 2000, "end").end_minute, 1440);
});
test("copy changes only selected days, with unique ids, including copying an empty day", () => {
  let n = 0; const key = () => `new-${++n}`;
  const windows = [block("a", 1, 540, 720), block("b", 1, 780, 960), block("c", 2, 500, 600), block("d", 0, 600, 700)];
  const copied = copyWeeklyDay(windows, 1, [1, 2, 2, 3], key);
  assert.equal(copied.length, 7);
  assert.deepEqual(copied.filter(w => w.weekday === 0), [windows[3]]);
  assert.deepEqual(copied.filter(w => w.weekday === 2).map(w => [w.start_minute, w.end_minute]), [[540, 720], [780, 960]]);
  assert.equal(new Set(copied.map(w => w.key)).size, copied.length);
  assert.deepEqual(copyWeeklyDay(windows, 6, [2], key), windows.filter(w => w.weekday !== 2));
  assert.deepEqual(windows[2], block("c", 2, 500, 600));
});
test("adding finds a real free gap, permits a short gap and reports a fully occupied day", () => {
  assert.deepEqual(nextWeeklyGap([block("a", 1, 540, 720)], 1), { weekday: 1, start_minute: 720, end_minute: 780 });
  assert.deepEqual(nextWeeklyGap([block("a", 1, 550, 720)], 1), { weekday: 1, start_minute: 540, end_minute: 550 });
  assert.equal(nextWeeklyGap([block("a", 1, 0, 1440)], 1), null);
});
test("signature ignores order and server ids while preserving the effective week", () => {
  const a = block("a", 1, 540, 720), b = block("b", 2, 600, 780);
  assert.equal(weekSignature([a, b]), weekSignature([{ ...b, key: "new-b" }, { ...a, key: "new-a" }]));
  assert.notEqual(weekSignature([a, b]), weekSignature([a, { ...b, start_minute: 605 }]));
});
