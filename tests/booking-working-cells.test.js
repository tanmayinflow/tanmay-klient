import test from "node:test";
import assert from "node:assert/strict";
import { calendarWorkingCells } from "../src/booking/calendar.js";

test("working cells exist independently of client offer timing and stop at each working window", () => {
  const morning = Date.parse("2026-11-16T08:00:00Z");
  const cells = calendarWorkingCells([
    { s: morning, e: morning + 75 * 60000 },
    { s: morning + 120 * 60000, e: morning + 180 * 60000 },
  ], 30);
  assert.deepEqual(cells.map(c => [(c.startsAt - morning) / 60000, (c.endsAt - morning) / 60000]),
    [[0, 30], [30, 60], [60, 75], [120, 150], [150, 180]]);
  assert.equal(calendarWorkingCells([]).length, 0);
});

test("working cells retain both autumn hours as distinct instants", () => {
  const start = Date.parse("2026-10-25T00:00:00Z"), end = Date.parse("2026-10-25T02:00:00Z");
  const cells = calendarWorkingCells([{ s: start, e: end }], 30);
  assert.equal(cells.length, 4);
  assert.equal(new Set(cells.map(c => c.startsAt)).size, 4);
  assert.ok(cells.every(c => c.endsAt - c.startsAt === 1800000));
});
