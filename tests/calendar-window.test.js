import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calendarWindow, shiftCalendarMonths } from '../src/shared/product/calendarWindow.js';

test('month ranges clamp month ends and keep leap years without overflowing into another month', () => {
  assert.equal(shiftCalendarMonths('2026-01-31', 1), '2026-02-28');
  assert.equal(shiftCalendarMonths('2028-01-31', 1), '2028-02-29');
  assert.equal(shiftCalendarMonths('2028-02-29', 12), '2029-02-28');
  assert.equal(shiftCalendarMonths('2026-05-31', -3), '2026-02-28');
  assert.deepEqual(calendarWindow({ horizonMonths: 3, readPastMonths: 6 }, '2026-08-31'), {
    from: '2026-08-31', to: '2026-12-01', readFrom: '2026-02-28', last: '2026-11-30', horizonDays: 91, horizonMonths: 3, readPastMonths: 6,
  });
});

test('month windows move with today while legacy day windows retain their original length', () => {
  assert.equal(calendarWindow({ horizon: 30 }, '2026-01-31').last, '2026-03-02');
  assert.equal(calendarWindow({ horizon: 30, horizonMonths: 1 }, '2026-01-31').last, '2026-02-28');
  assert.equal(calendarWindow({ horizon: 30, horizonMonths: 1 }, '2026-02-01').last, '2026-03-01');
  for (const zone of ['Europe/Prague', 'America/New_York', 'Pacific/Kiritimati']) {
    process.env.TZ = zone;
    assert.equal(calendarWindow({ horizonMonths: 12, readPastMonths: 12 }, '2026-10-25').horizonDays, 365);
    assert.equal(calendarWindow({ horizonMonths: 1 }, '2026-03-29').last, '2026-04-29');
  }
});
