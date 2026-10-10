import { test } from "node:test";
import assert from "node:assert/strict";
import { areaReviewWeek, areaReviewWeekEnd, shiftAreaReviewWeek, areaReviewFor, areaReviewDraft, areaReviewWeeks, saveAreaReview } from "../src/shared/product/areaReviews.js";

test("landscape reviews use local Monday weeks across years and DST", () => {
  assert.equal(areaReviewWeek("2026-10-10"), "2026-10-05");
  assert.equal(areaReviewWeek("2026-10-11"), "2026-10-05");
  assert.equal(areaReviewWeek("2026-10-12"), "2026-10-12");
  assert.equal(areaReviewWeek("2027-01-01"), "2026-12-28");
  assert.equal(areaReviewWeekEnd("2026-12-28"), "2027-01-03");
  assert.equal(shiftAreaReviewWeek("2026-10-19", 1), "2026-10-26");
  assert.equal(areaReviewWeek("2026-10-25"), "2026-10-19");
  assert.equal(areaReviewWeek("2026-02-30"), null);
  assert.equal(areaReviewWeek("not a date"), null);
});

test("old undated ratings do not count as a reviewed week or fill this week's lived score", () => {
  const old = { dulezitost: 4, zit: 3 };
  assert.equal(areaReviewFor(old, "2026-10-10"), null);
  assert.deepEqual(areaReviewWeeks(old, "2026-10-10"), []);
  assert.deepEqual(areaReviewDraft(old, "2026-10-10"), { dulezitost: 4, zit: 0, nextStep: "" });
});

test("saving a weekly review preserves old ratings, monthly history and other personal data", () => {
  const source = { areaVlq: { Body: { dulezitost: 4, zit: 3 }, Art: { dulezitost: 5 } }, areaMonths: { Body: { X: 7 } }, journal: [{ id: "private" }] };
  const result = saveAreaReview(source, "Body", "2026-10-10", { dulezitost: 5, zit: 2, nextStep: "  Jít pěšky.  " }, 1791633600000);
  assert.deepEqual(source.areaVlq.Body, { dulezitost: 4, zit: 3 });
  assert.equal(result.areaVlq.Body.dulezitost, 4);
  assert.strictEqual(result.areaVlq.Art, source.areaVlq.Art);
  assert.strictEqual(result.areaMonths, source.areaMonths);
  assert.strictEqual(result.journal, source.journal);
  assert.equal(areaReviewFor(result.areaVlq.Body, "2026-10-11").nextStep, "Jít pěšky.");
  assert.equal(areaReviewFor(result.areaVlq.Body, "2026-10-12"), null);
  assert.equal(areaReviewDraft(result.areaVlq.Body, "2026-10-12").dulezitost, 5);
  assert.equal(areaReviewDraft(result.areaVlq.Body, "2026-10-12").zit, 0);
});

test("same-week corrections replace that review while skipped and other weeks remain accurate", () => {
  let coll = saveAreaReview({}, "Body", "2026-09-21", { dulezitost: 5, zit: 1 }, 1);
  coll = saveAreaReview(coll, "Body", "2026-10-10", { dulezitost: 4, zit: 2 }, 2);
  coll = saveAreaReview(coll, "Body", "2026-10-11", { dulezitost: 4, zit: 3 }, 3);
  assert.deepEqual(areaReviewWeeks(coll.areaVlq.Body, "2026-10-11"), ["2026-10-05", "2026-09-21"]);
  assert.equal(areaReviewFor(coll.areaVlq.Body, "2026-10-10").zit, 3);
  assert.equal(areaReviewFor(coll.areaVlq.Body, "2026-10-10").reviewedAt, 3);
  assert.equal(areaReviewFor(coll.areaVlq.Body, "2026-09-28"), null);
  assert.equal(areaReviewFor(coll.areaVlq.Body, "2026-09-21").zit, 1);
});

test("partial, invalid and imported unconfirmed ratings never mark a week reviewed", () => {
  const coll = { keep: true };
  for (const values of [{ dulezitost: 0, zit: 3 }, { dulezitost: 4, zit: 6 }, { dulezitost: 3.5, zit: 2 }, { dulezitost: 2 }]) {
    assert.strictEqual(saveAreaReview(coll, "Body", "2026-10-10", values, 1), coll);
  }
  assert.strictEqual(saveAreaReview(coll, "Body", "2026-10-10", { dulezitost: 4, zit: 2 }, NaN), coll);
  assert.equal(areaReviewFor({ weeks: { "2026-10-05": { dulezitost: 4, zit: 2 } } }, "2026-10-10"), null);
});
