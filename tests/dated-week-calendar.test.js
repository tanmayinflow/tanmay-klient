import test from "node:test";
import assert from "node:assert/strict";
import { calendarSlotCells, calendarWeekRange, calendarWeekLanes, calendarWallRange } from "../src/booking/calendar.js";
import { zonedToUtc } from "../src/booking/time.js";
const zone = "Europe/Prague", date = "2026-11-23";
const at = minute => zonedToUtc(date, minute, zone);

test("every offered start remains clickable without overlapping duration-sized tiles", () => {
  const slots = [540, 570, 600].map(minute => ({ startsAt: at(minute), endsAt: at(minute + 60) }));
  const cells = calendarSlotCells(date, slots, 30);
  assert.deepEqual(cells.map(c => [c.from, c.to]), [[540, 570], [570, 600], [600, 630]]);
  assert.ok(cells.every(c => c.choices[0].endsAt - c.choices[0].startsAt === 3600000));
  assert.equal(cells.length, slots.length);
});
test("weekly axis is shared across dates and expands for early bookings and overnight blocks", () => {
  const data = { rules: [{ weekday: 1, start_minute: 540, end_minute: 1020, active: 1 }],
    bookings: [{ id: "early", status: "CONFIRMED", startsAt: at(360), endsAt: at(420) }],
    blocks: [{ id: "late", startsAt: at(1380), endsAt: at(1440) + 3600000 }] };
  assert.deepEqual(calendarWeekRange([date], data), { from: 360, to: 1440 });
  assert.deepEqual(calendarWallRange(date, at(1380), at(1440) + 3600000), { from: 1380, to: 1440 });
});
test("time-off and bookings retain separate visible lanes when overlapping", () => {
  const items = [{ id: "booking", startsAt: at(540), endsAt: at(600) }, { id: "off", startsAt: at(570), endsAt: at(630) }];
  const lanes = calendarWeekLanes(date, items);
  assert.deepEqual(lanes.map(x => x.lanes), [2, 2]);
  assert.notEqual(lanes[0].lane, lanes[1].lane);
  assert.equal(lanes[0].startsAt, items[0].startsAt);
});
test("repeated autumn starts are grouped as explicit choices and never silently discarded", () => {
  const d = "2026-10-25", first = Date.parse("2026-10-25T00:00:00Z"), second = first + 3600000;
  const slots = [{ startsAt: first, endsAt: first + 1800000 }, { startsAt: second, endsAt: second + 1800000 }];
  const cells = calendarSlotCells(d, slots, 30);
  assert.equal(cells.length, 1); assert.equal(cells[0].choices.length, 2);
  const lanes = calendarWeekLanes(d, slots);
  assert.ok(lanes.every(x => x.lanes === 2 && x.visualTo > x.visualFrom));
});
