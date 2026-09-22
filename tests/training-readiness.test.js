import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluateBlock, evaluateSession } from "../src/training/progression.js";

const planned = { targetWeight: 20, targetRepsMin: 8, targetRepsMax: 12, targetRir: 2 };
const block = (patch = {}) => ({ id: "b", exId: "dbpress", measurementType: "WEIGHT_REPS", sets: [0, 1, 2].map((i) => ({ id: String(i), type: "work", planned, actual: { weight: 20, reps: 12 }, rir: 2, completed: true })), ...patch });
test("incomplete and unknown effort cannot recommend more load", () => {
  const b = block(); b.sets[2].completed = false;
  assert.equal(evaluateBlock(b).k, "hold");
  b.sets[2].completed = true; b.sets[1].rir = null;
  assert.equal(evaluateBlock(b).k, "measure");
});
test("each set must meet prescribed reserve and load", () => {
  const b = block(); b.sets[1].rir = 0;
  assert.equal(evaluateBlock(b).k, "repeat");
  b.sets[1].rir = 2; b.sets[1].actual.weight = 10;
  assert.equal(evaluateBlock(b).k, "repeat");
  b.sets[1].actual.weight = 20;
  assert.equal(evaluateBlock(b).k, "advance");
});
test("pain and technique hold outrank advancement, including skipped blocks", () => {
  const painful = block({ id: "pain" }); painful.sets.forEach(s => { s.completed = false; });
  const advice = evaluateSession({ blocks: [block(), painful] }, { forBlock: b => ({ painNow: b.id === "pain" }) });
  assert.equal(advice[0].blockId, "pain");
  assert.equal(advice[0].k, "hold");
  assert.equal(evaluateBlock(block({ techniqueFlagged: true })).k, "hold");
});
test("duration progression checks every set, not just the final hold", () => {
  const b = block({ measurementType: "DURATION", sets: [10, 30].map((durationSec, i) => ({ id: String(i), type: "work", completed: true, planned: { targetDurationSec: 30 }, actual: { durationSec } })) });
  assert.equal(evaluateBlock(b, { streakAtPrescription: 1 }).k, "repeat");
});
