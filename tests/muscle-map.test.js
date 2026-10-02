import { test } from "node:test";
import assert from "node:assert/strict";
import { MUSCLE_GROUPS, resolveMuscleMap, muscleMapEdit } from "../src/training/muscleMap.js";
import { MUSCLE_REGIONS } from "../src/shared/ui/muscleRegions.js";

test("every labelled muscle has closed front or back regions within the actual illustration canvas", () => {
  assert.deepEqual(Object.keys(MUSCLE_REGIONS).sort(), MUSCLE_GROUPS.map(x => x.k).sort());
  for (const [key, regions] of Object.entries(MUSCLE_REGIONS)) {
    assert.ok(regions.length > 0, key);
    for (const region of regions) {
      assert.ok(["front", "back"].includes(region.side));
      assert.match(region.d, /^M.*Z$/);
      const values = region.d.match(/-?\d+(?:\.\d+)?/g).map(Number);
      assert.equal(values.length % 2, 0);
      values.forEach((value, index) => assert.ok(value >= 0 && value <= (index % 2 ? 1536 : 1024), key));
    }
  }
  assert.ok(MUSCLE_REGIONS.tib.every(x => x.side === "front"));
  assert.ok(MUSCLE_REGIONS.cal.every(x => x.side === "back"));
  for (const key of ["sho", "fore", "neck", "rcuff"]) assert.equal(new Set(MUSCLE_REGIONS[key].map(x => x.side)).size, 2);
});

test("muscle dictionary separates the front shin and latissimus from calves and upper back", () => {
  const keys = MUSCLE_GROUPS.map(x => x.k);
  assert.equal(new Set(keys).size, keys.length);
  for (const k of ["tib", "lat", "cal", "upb"]) assert.ok(keys.includes(k));
  for (const group of MUSCLE_GROUPS) {
    assert.ok(group.cz && group.en && group.anatomy && group.region.cz && group.region.en);
  }
  const legacyBack = MUSCLE_GROUPS.find(x => x.k === "upb");
  assert.equal(legacyBack.cz, "horní záda");
  assert.match(legacyBack.anatomy, /latissimus dorsi/);
  assert.match(legacyBack.note.en, /not one isolated muscle/);
});

test("legacy rows and front levers keep the broad back group unless their mapping was reviewed", () => {
  const frontLever = resolveMuscleMap({ id: "frontlever", mp: ["upb", "abs"], ms: ["fore", "glu", "low"] });
  assert.deepEqual(frontLever.primary, ["upb", "abs"]);
  assert.equal(frontLever.corrected, false);
  assert.equal(frontLever.mode, "strength");
  const row = resolveMuscleMap({ id: "ringrow", mp: ["upb", "bic"], ms: ["fore", "tra"] });
  assert.deepEqual(row.primary, ["upb", "bic"]);
  assert.equal(row.corrected, false);
});

test("known tibialis and vertical-pull defaults point to their own anatomical regions", () => {
  const tib = resolveMuscleMap({ id: "tibraise", mp: ["cal"], ms: [] });
  assert.deepEqual(tib.primary, ["tib"]);
  assert.equal(tib.corrected, true);
  const pull = resolveMuscleMap({ id: "pullup", mp: ["upb", "bic"], ms: ["fore", "abs"] });
  assert.deepEqual(pull.primary, ["lat", "bic"]);
  assert.deepEqual(pull.secondary, ["fore", "abs"]);
  // A horizontal row must not be swept into the vertical-pull correction.
  assert.deepEqual(resolveMuscleMap({ id: "bodyrow", mp: ["upb", "bic"], ms: ["fore", "abs"] }).primary, ["upb", "bic"]);
});

test("warm-up maps distinguish wrists, lower-body movement and spinal rotation", () => {
  const gm = id => resolveMuscleMap({ id, mp: ["sho", "low"], ms: [], sessionRole: "prep" });
  assert.deepEqual(gm("gm_w_wrist_circle").primary, ["fore"]);
  assert.deepEqual(gm("gm_w_wrist_open").primary, ["fore"]);
  assert.deepEqual(gm("gm_w_half_cossack").primary, ["qua", "glu", "add"]);
  assert.deepEqual(gm("gm_w_twist").primary, ["obl"]);
  assert.equal(gm("gm_w_wrist_circle").mode, "mobility");
  assert.equal(gm("gm_w_unreviewed").corrected, false);
});

test("corrections preserve custom primary and secondary edits and never mutate inputs", () => {
  const original = Object.freeze({ id: "tibraise", mp: Object.freeze(["cal"]), ms: Object.freeze([]) });
  const resolved = resolveMuscleMap(original);
  resolved.primary.push("fore");
  assert.deepEqual(original.mp, ["cal"]);
  assert.deepEqual(resolveMuscleMap(original).primary, ["tib"]);
  for (const row of [
    { id: "tibraise", mp: ["tib"], ms: [] },
    { id: "tibraise", mp: ["cal"], ms: ["fore"] },
    { id: "gm_w_wrist_circle", mp: ["sho"], ms: [] },
    { id: "pullup", mp: ["bic", "upb"], ms: ["fore", "abs"] },
  ]) {
    const result = resolveMuscleMap(row);
    assert.equal(result.corrected, false);
    assert.deepEqual(result.primary, row.mp);
    assert.deepEqual(result.secondary, row.ms);
  }
});

test("only absent maps of named programme targets are supplemented", () => {
  for (const [id, key] of [["vi_press", "che"], ["vi_biceps", "bic"], ["vi_triceps", "tri"], ["vi_calf", "cal"]]) {
    const result = resolveMuscleMap({ id });
    assert.deepEqual(result.primary, [key]);
    assert.deepEqual(result.secondary, []);
    assert.equal(result.corrected, true);
    assert.ok(result.note.cz);
  }
  const empty = resolveMuscleMap({ id: "vi_calf", mp: [], ms: [] });
  assert.deepEqual(empty.primary, []);
  assert.equal(empty.corrected, false);
  const variant = resolveMuscleMap({ id: "vi_row" });
  assert.equal(variant.mode, "unspecified");
  assert.deepEqual(variant.primary, []);
  assert.ok(variant.note.en);
});

test("ambiguous ankle defaults identify the mobility area without falsely highlighting calf", () => {
  for (const id of ["kr_mob_098", "kr_mob_099", "kr_mob_100"]) {
    const result = resolveMuscleMap({ id, mp: ["cal"], ms: [], pat: "mobilita" });
    assert.equal(result.mode, "mobility");
    assert.deepEqual(result.primary, []);
    assert.ok(result.note.cz);
  }
  const custom = resolveMuscleMap({ id: "kr_mob_098", mp: ["tib"], ms: [] });
  assert.deepEqual(custom.primary, ["tib"]);
  assert.equal(custom.corrected, false);
});

test("mobility, rest and absent catalogue data have distinct honest states", () => {
  assert.equal(resolveMuscleMap({ id: "kr_mob_063", mp: ["upb"], ms: [] }).mode, "mobility");
  assert.deepEqual(resolveMuscleMap({ id: "kr_mob_068", mp: ["upb"], ms: [] }).primary, ["tra"]);
  assert.equal(resolveMuscleMap({ id: "jg_savasana", mp: [], ms: [] }).mode, "none");
  assert.equal(resolveMuscleMap({ id: "co2", pat: "dech", mp: [], ms: [] }).mode, "none");
  const catalogue = resolveMuscleMap({ id: "jg_parsva_bakasana", pat: "tlak", mp: [], ms: [], jg: { katalog: true } });
  assert.equal(catalogue.mode, "unspecified");
  assert.deepEqual(catalogue.primary, []);
  assert.deepEqual(resolveMuscleMap({ id: "custom_pullup", en: "Pull-up", pat: "tah" }).primary, []);
});

test("unknown keys remain visible to the caller and primary wins over secondary", () => {
  const result = resolveMuscleMap({ mp: ["qua", "qua", "unknown", null], ms: ["qua", "ham", "unknown", "other"] });
  assert.deepEqual(result.primary, ["qua"]);
  assert.deepEqual(result.secondary, ["ham"]);
  assert.deepEqual(result.unknown, ["unknown", "other"]);
  assert.equal(resolveMuscleMap(null).mode, "unspecified");
  assert.equal(resolveMuscleMap({ mp: ["unknown"] }).mode, "unspecified");
});

test("neck and yoga provenance cannot turn resistance or balance work into mobility", () => {
  assert.equal(resolveMuscleMap({ id: "neckiso", pat: "krk", mp: ["neck"], ms: [] }).mode, "strength");
  assert.equal(resolveMuscleMap({ id: "neckcars", pat: "krk", mp: ["neck"], ms: [] }).mode, "mobility");
  for (const id of ["jg_phalakasana", "jg_caturanga_dandasana", "jg_bakasana", "jg_sirsasana"]) {
    assert.equal(resolveMuscleMap({ id, jg: { sa: "Yoga" }, mp: ["sho", "abs"], ms: [] }).mode, "strength");
  }
  assert.equal(resolveMuscleMap({ id: "jg_pascimottanasana", jg: {}, mp: ["ham"], ms: [] }).mode, "mobility");
  assert.equal(resolveMuscleMap({ id: "unknown_yoga", jg: {}, mp: ["sho"], ms: [] }).mode, "strength");
});

test("an explicit session role outranks movement-pattern names and known display defaults", () => {
  assert.equal(resolveMuscleMap({ id: "couch", sessionRole: "strength", pat: "mobilita", mp: ["qua"], ms: [] }).mode, "strength");
  assert.equal(resolveMuscleMap({ id: "gm_w_wrist_circle", sessionRole: "strength", mp: ["sho", "low"], ms: [] }).mode, "strength");
  assert.equal(resolveMuscleMap({ id: "custom_neck", sessionRole: "mobility", pat: "krk", mp: ["neck"], ms: [] }).mode, "mobility");
  assert.equal(resolveMuscleMap({ id: "custom_loaded", pat: "mobilita", mp: ["low"], ms: [] }).mode, "strength");
});

test("editing secondary muscles preserves the displayed primary correction on subsequent reads", () => {
  const ex = Object.freeze({ id: "pullup", mp: Object.freeze(["upb", "bic"]), ms: Object.freeze(["fore", "abs"]) });
  const values = Object.freeze(["fore", "abs", "sho"]);
  const patch = muscleMapEdit(ex, "secondary", values);
  assert.deepEqual(patch, { mp: ["lat", "bic"], ms: ["fore", "abs", "sho"] });
  assert.deepEqual(resolveMuscleMap({ ...ex, ...patch }).primary, ["lat", "bic"]);
  assert.deepEqual(ex.mp, ["upb", "bic"]);
  assert.notEqual(patch.ms, values);
});

test("editing primary muscles preserves the displayed secondary correction", () => {
  const ex = { id: "gm_w_half_cossack", mp: ["sho", "low"], ms: [], sessionRole: "prep" };
  const patch = muscleMapEdit(ex, "primary", ["qua", "glu", "add", "abs"]);
  assert.deepEqual(patch.ms, ["ham"]);
  const next = resolveMuscleMap({ ...ex, ...patch });
  assert.deepEqual(next.primary, ["qua", "glu", "add", "abs"]);
  assert.deepEqual(next.secondary, ["ham"]);
  assert.deepEqual(ex.ms, []);
});

test("muscle-map edits preserve custom assignments and unknown keys in the untouched field", () => {
  const ex = Object.freeze({ id: "pullup", mp: Object.freeze(["che", "future-primary"]), ms: Object.freeze(["sho", "future-secondary"]) });
  assert.deepEqual(muscleMapEdit(ex, "secondary", ["fore"]), { mp: ["che", "future-primary"], ms: ["fore"] });
  assert.deepEqual(muscleMapEdit(ex, "primary", ["bic"]), { mp: ["bic"], ms: ["sho", "future-secondary"] });
  assert.deepEqual(muscleMapEdit(ex, "primary", []), { mp: [], ms: ["sho", "future-secondary"] });
  assert.deepEqual(ex.mp, ["che", "future-primary"]);
  assert.deepEqual(ex.ms, ["sho", "future-secondary"]);
  assert.throws(() => muscleMapEdit(ex, "other", []), TypeError);
});
