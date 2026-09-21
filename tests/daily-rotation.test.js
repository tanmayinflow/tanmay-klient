import { test } from "node:test";
import assert from "node:assert/strict";
import { dailyIndex, wrapIndex, nextMidnightDelay } from "../src/shared/product/dailyRotation.js";

test("daily selection is stable within the local day and cycles through all seven", () => {
  const indexes = Array.from({ length: 8 }, (_, day) => dailyIndex(new Date(2026, 8, 21 + day, 0, 1), 7));
  assert.equal(new Set(indexes.slice(0, 7)).size, 7);
  assert.equal(indexes[0], indexes[7]);
  assert.equal(indexes[0], dailyIndex(new Date(2026, 8, 21, 23, 59), 7));
});
test("calendar rotation crosses leap days, year boundaries and clock changes", () => {
  for (const [year, month, day] of [[2024, 1, 28], [2024, 1, 29], [2026, 11, 31], [2026, 2, 29], [2026, 9, 25]]) {
    assert.equal(dailyIndex(new Date(year, month, day + 1, 12), 7), wrapIndex(dailyIndex(new Date(year, month, day, 12), 7) + 1, 7));
  }
});
test("manual navigation wraps endlessly in both directions", () => {
  assert.equal(wrapIndex(-1, 7), 6);
  assert.equal(wrapIndex(7, 7), 0);
  assert.equal(wrapIndex(701, 7), 1);
  assert.equal(wrapIndex(-701, 7), 6);
  assert.equal(wrapIndex(1, 0), 0);
});
test("wake-up is scheduled for next local midnight", () => {
  const now = new Date(2026, 8, 21, 23, 59, 59);
  assert.equal(nextMidnightDelay(now), 1050);
  assert.equal(dailyIndex(now, 0), 0);
});
