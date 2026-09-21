import { test } from "node:test";
import assert from "node:assert/strict";
import { lifeDotTone, lifeGrid } from "../src/shared/product/lifeDots.js";

test("art cannot make a future day look like a lived day", () => {
  for (const ink of [0, .1, .5, .9, 1]) {
    assert.ok(lifeDotTone(800, 500, ink).alpha < lifeDotTone(100, 500, 0).alpha);
    assert.equal(lifeDotTone(800, 500, ink).radius, 1.05);
    assert.equal(lifeDotTone(100, 500, ink).radius, 1.05);
  }
});
test("today remains accented and unaffected by the illustration", () => {
  assert.deepEqual(lifeDotTone(499, 500, 0), lifeDotTone(499, 500, 1));
  assert.deepEqual(lifeDotTone(499, 500, 1), { alpha: 1, radius: 1.9, today: true });
  assert.equal(lifeDotTone(0, 0, 1).today, false);
});
test("all days fit in the responsive field with unchanged four-pixel pitch", () => {
  for (const width of [292, 362, 412, 680]) for (const total of [10958, 27759, 43830]) {
    const grid = lifeGrid(width, total);
    assert.ok(grid.cols * grid.rows >= total);
    assert.ok(grid.cols * (grid.rows - 1) < total);
    assert.ok((grid.cols - 1) * 4 + 3.9 <= grid.width);
    assert.ok((grid.rows - 1) * 4 + 3.9 <= grid.height);
  }
});
