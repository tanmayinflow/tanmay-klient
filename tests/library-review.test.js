import { test } from "node:test";
import assert from "node:assert/strict";
import { applyLibraryReview, reviewLibraryCollection, LIBRARY_REVIEW_CORRECTIONS } from "../src/training/libraryReview.js";

const clone = value => structuredClone(value);
const ruleFor = (id, field) => LIBRARY_REVIEW_CORRECTIONS.find(rule => rule.id === id && Object.hasOwn(rule.before, field));
function frozen(value) {
  if (value && typeof value === "object") {
    Object.values(value).forEach(frozen);
    Object.freeze(value);
  }
  return value;
}

test("each reviewed original is corrected immutably without losing unlisted exercise fields", () => {
  for (const rule of LIBRARY_REVIEW_CORRECTIONS) {
    const source = frozen({ id: rule.id, ...clone(rule.before), userNote: "unchanged", customData: { owner: true } });
    const result = applyLibraryReview(source);
    assert.notEqual(result, source, rule.id);
    for (const [field, value] of Object.entries(rule.after)) assert.deepEqual(result[field], value, rule.id + "." + field);
    for (const [field, value] of Object.entries(rule.before)) assert.deepEqual(source[field], value, rule.id + " source mutated");
    assert.equal(result.id, source.id);
    assert.equal(result.userNote, source.userNote);
    assert.equal(result.customData, source.customData);
  }
});

test("one customized language protects the whole bilingual field while independent exact fields still update", () => {
  const position = ruleFor("kr_mob_028", "pos");
  const execution = ruleFor("kr_mob_028", "exe");
  const equipment = ruleFor("kr_mob_028", "eq");
  const customPosition = [position.before.pos[0], "My own English cue"];
  const source = frozen({ id: "kr_mob_028", pos: customPosition, ...clone(execution.before), ...clone(equipment.before) });
  const result = applyLibraryReview(source);
  assert.equal(result.pos, source.pos);
  assert.deepEqual(result.pos, customPosition);
  assert.deepEqual(result.exe, execution.after.exe);
  assert.deepEqual(result.eq, ["telo", "zed"]);
});

test("Rouland title correction preserves the real English focus and only updates untouched derived focus", () => {
  const title = ruleFor("kr_mob_045", "cz");
  const focus = ruleFor("kr_mob_045", "foc");
  assert.equal(focus.before.foc[1], "Backward-Facing Wrist Stretch. Easy breathing, comfortable range.");
  const source = frozen({ id: "kr_mob_045", ...clone(title.before), ...clone(focus.before) });
  const result = applyLibraryReview(source);
  assert.equal(result.cz, "Zápěstí v kleku s prsty ke kolenům");
  assert.equal(result.foc[0], "Zápěstí v kleku s prsty ke kolenům. Klidný dech, pohodlný rozsah.");
  assert.equal(result.foc[1], focus.before.foc[1]);
  const custom = { ...source, foc: ["My own focus", source.foc[1]] };
  const reviewed = applyLibraryReview(custom);
  assert.equal(reviewed.cz, title.after.cz);
  assert.equal(reviewed.foc, custom.foc);
});

test("slrdl corrects both movement directions together and leaves deliberate wording intact", () => {
  const rule = ruleFor("slrdl", "exe");
  const result = applyLibraryReview({ id: "slrdl", ...clone(rule.before) });
  assert.match(result.exe[0], /zadní noha se zvedá/);
  assert.match(result.exe[1], /rear leg rises/);
  const custom = { id: "slrdl", exe: [rule.before.exe[0], "Custom execution"] };
  assert.equal(applyLibraryReview(custom), custom);
});

test("bridge demand and regression are coupled and refuse every partially customized signature", () => {
  const original = { id: "bridge", S: 1, C: 1, ez: "glutebridge", hd: null };
  assert.deepEqual(applyLibraryReview(original), { id: "bridge", S: 4, C: 2, ez: null, hd: null });
  for (const changes of [{ S: 2 }, { C: 2 }, { ez: "my-bridge-prep" }, { S: 4, C: 1 }, { ez: null }]) {
    const custom = frozen({ ...original, ...changes });
    assert.equal(applyLibraryReview(custom), custom);
  }
});

test("block deadlift changes progression direction atomically and never overwrites a custom link", () => {
  const original = { id: "an_boxdeadlift", ez: "deadlift", hd: null };
  assert.deepEqual(applyLibraryReview(original), { id: "an_boxdeadlift", ez: null, hd: "deadlift" });
  for (const changes of [{ ez: "my-prep" }, { hd: "my-goal" }, { ez: null }]) {
    const custom = { ...original, ...changes };
    assert.equal(applyLibraryReview(custom), custom);
  }
});

test("equipment correction requires the original exact list and preserves custom additions and order", () => {
  for (const eq of [["telo", "lavice", "guma"], ["lavice", "telo"], ["telo"], undefined]) {
    const source = { id: "kr_mob_020", eq };
    assert.equal(applyLibraryReview(source), source);
  }
  assert.deepEqual(applyLibraryReview({ id: "kr_mob_020", eq: ["telo", "lavice"] }).eq, ["telo", "zed"]);
});

test("unknown or missing fields and unknown IDs are retained by reference", () => {
  const values = [null, undefined, "entry", [], { id: "user_ex", exe: ["custom", "custom"] }, { id: "slrdl" }, { id: "bridge", S: 1, C: 1 }];
  for (const value of values) assert.equal(applyLibraryReview(value), value);
});

test("repeated review is idempotent and returns the already reviewed reference", () => {
  const original = { id: "headstand", ...clone(ruleFor("headstand", "exe").before), ...clone(ruleFor("headstand", "wat").before) };
  const once = applyLibraryReview(original);
  assert.notEqual(once, original);
  assert.equal(applyLibraryReview(once), once);
});

test("replacement pairs and arrays are fresh and cannot contaminate future corrections or exported data", () => {
  const rule = ruleFor("slrdl", "exe");
  const source = { id: "slrdl", ...clone(rule.before) };
  const first = applyLibraryReview(source);
  first.exe[0] = "Later user edit";
  const second = applyLibraryReview(source);
  assert.deepEqual(second.exe, rule.after.exe);
  assert.notEqual(first.exe, second.exe);
  assert.notEqual(second.exe, rule.after.exe);
  assert.ok(Object.isFrozen(rule.after.exe));
});

test("collection review changes only existing tEx entries and preserves IDs, order, user rows and all history references", () => {
  const custom = { id: "user_custom", cz: "Můj cvik", exe: ["Moje", "Mine"] };
  const history = [{ exId: "bridge", actual: { reps: 5 } }];
  const plans = { selected: "owner-plan", rows: [{ ex: "bridge" }] };
  const source = frozen({ tEx: [custom, { id: "bridge", S: 1, C: 1, ez: "glutebridge" }, null], history, plans, arbitraryFlag: 9 });
  const result = reviewLibraryCollection(source);
  assert.notEqual(result, source);
  assert.notEqual(result.tEx, source.tEx);
  assert.equal(result.tEx.length, source.tEx.length);
  assert.deepEqual(result.tEx.map(x => x?.id), source.tEx.map(x => x?.id));
  assert.equal(result.tEx[0], custom);
  assert.equal(result.tEx[2], null);
  assert.equal(result.history, history);
  assert.equal(result.plans, plans);
  assert.equal(result.arbitraryFlag, 9);
  assert.deepEqual(Object.keys(result), Object.keys(source));
  assert.equal(reviewLibraryCollection(result), result);
});

test("collection without a matching old exercise is unchanged and does not seed missing entries", () => {
  const values = [null, undefined, {}, { tEx: null }, { tEx: [] }, { tEx: [{ id: "user_custom" }] }, { tEx: [{ id: "bridge", S: 4, C: 2, ez: null }] }];
  for (const value of values) assert.equal(reviewLibraryCollection(value), value);
});
