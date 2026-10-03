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

test("reviewed front levers name latissimus while rows retain scapular regions too", () => {
  const frontLever = resolveMuscleMap({ id: "frontlever", mp: ["upb", "abs"], ms: ["fore", "glu", "low"] });
  assert.deepEqual(frontLever.primary, ["lat", "abs"]);
  assert.equal(frontLever.corrected, true);
  assert.equal(frontLever.mode, "strength");
  const row = resolveMuscleMap({ id: "ringrow", mp: ["upb", "bic"], ms: ["fore", "tra"] });
  assert.deepEqual(row.primary, ["upb", "lat", "bic"]);
  assert.equal(row.corrected, true);
  const unreviewed = resolveMuscleMap({ id: "act_swim", mp: ["upb", "sho"], ms: ["abs", "glu", "qua"] });
  assert.deepEqual(unreviewed.primary, ["upb", "sho"]);
  assert.equal(unreviewed.corrected, false);
});

test("known tibialis and vertical-pull defaults point to their own anatomical regions", () => {
  const tib = resolveMuscleMap({ id: "tibraise", mp: ["cal"], ms: [] });
  assert.deepEqual(tib.primary, ["tib"]);
  assert.equal(tib.corrected, true);
  const pull = resolveMuscleMap({ id: "pullup", mp: ["upb", "bic"], ms: ["fore", "abs"] });
  assert.deepEqual(pull.primary, ["lat", "bic"]);
  assert.deepEqual(pull.secondary, ["fore", "abs"]);
  // A horizontal row keeps its scapular region in addition to latissimus.
  assert.deepEqual(resolveMuscleMap({ id: "bodyrow", mp: ["upb", "bic"], ms: ["fore", "abs"] }).primary, ["upb", "lat", "bic"]);
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
    { id: "frontlever", mp: ["upb", "abs"], ms: ["fore", "glu", "low", "sho"] },
    { id: "ringrow", mp: ["upb", "bic"], ms: ["fore"] },
    { id: "jg_baddha_konasana", mp: ["glu"], ms: ["low", "add"] },
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
  assert.deepEqual(resolveMuscleMap({ id: "vi_squat", mp: ["glu"] }).primary, ["qua", "glu"]);
  assert.deepEqual(resolveMuscleMap({ id: "vi_lunge", mp: ["glu"] }).primary, ["qua", "glu"]);
  // Explicit secondary arrays differ from the inspected programme defaults.
  assert.equal(resolveMuscleMap({ id: "vi_squat", mp: ["glu"], ms: [] }).corrected, false);
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

test("hip flexion is represented separately from abdominal bracing and knee extension", () => {
  const vup = resolveMuscleMap({ id: "vup", mp: ["abs"], ms: ["obl", "qua"] });
  assert.deepEqual(vup.primary, ["abs", "hipflex"]);
  assert.deepEqual(vup.secondary, ["obl", "qua"]);
  const boat = resolveMuscleMap({ id: "jg_paripurna_navasana", mp: ["abs"], ms: ["qua", "low"] });
  assert.ok(boat.primary.includes("hipflex"));
  assert.equal(boat.mode, "strength");
  const crunch = resolveMuscleMap({ id: "crunch", mp: ["abs"], ms: [] });
  assert.deepEqual(crunch.primary, ["abs"]);
  assert.equal(crunch.corrected, false);
});

test("reviewed hip stretches label adductors and hip flexors without strength claims", () => {
  const bound = resolveMuscleMap({ id: "jg_baddha_konasana", mp: ["glu"], ms: ["low"] });
  assert.deepEqual(bound.primary, ["add"]);
  assert.equal(bound.mode, "mobility");
  const straddle = resolveMuscleMap({ id: "pancake", mp: ["ham", "glu"], ms: ["low"] });
  assert.deepEqual(straddle.primary, ["ham", "add"]);
  assert.deepEqual(straddle.secondary, ["glu", "low"]);
  const couch = resolveMuscleMap({ id: "couch", mp: ["qua"], ms: ["glu"] });
  assert.deepEqual(couch.primary, ["qua", "hipflex"]);
  assert.equal(couch.mode, "mobility");
  const lunge = resolveMuscleMap({ id: "jg_anjaneyasana", mp: ["qua", "glu"], ms: ["low", "sho"] });
  assert.ok(lunge.primary.includes("hipflex"));
});

test("native rest and meditation defaults do not advertise targeted back or shoulder strength", () => {
  for (const id of ["jg_sukhasana", "jg_padmasana", "jg_siddhasana", "jg_makarasana", "jg_viparita_karani"]) {
    const result = resolveMuscleMap({ id, mp: ["low"], ms: [] });
    assert.deepEqual(result.primary, []);
    assert.equal(result.mode, "none");
    assert.ok(result.note.cz);
  }
  assert.equal(resolveMuscleMap({ id: "jg_pranamasana", mp: ["sho"], ms: [] }).mode, "none");
  assert.equal(resolveMuscleMap({ id: "jg_simhasana", mp: ["neck"], ms: ["che"] }).mode, "none");
  // The instruction to perform a strength variation is a meaningful custom edit.
  const custom = resolveMuscleMap({ id: "jg_makarasana", mp: ["low"], ms: [], sessionRole: "strength" });
  assert.deepEqual(custom.primary, ["low"]);
  assert.equal(custom.mode, "strength");
  assert.equal(custom.corrected, false);
  assert.deepEqual(resolveMuscleMap({ id: "jg_makarasana", mp: ["low"], ms: ["glu"] }).primary, ["low"]);
});

test("named passive poses and a native scapular warm-up remain movement areas", () => {
  assert.equal(resolveMuscleMap({ id: "jg_sphinx", mp: ["low"], ms: ["che"] }).mode, "mobility");
  assert.equal(resolveMuscleMap({ id: "jg_virasana", mp: ["qua"], ms: ["cal"] }).mode, "mobility");
  const scapula = resolveMuscleMap({ id: "gm_scap_retract_quad", mp: ["upb"], ms: [], sessionRole: "prep" });
  assert.deepEqual(scapula.primary, ["upb", "serr"]);
  assert.equal(scapula.mode, "mobility");
  for (const id of ["kr_mob_016", "kr_mob_017", "kr_mob_018", "kr_mob_019"]) {
    const rotation = resolveMuscleMap({ id, mp: ["sho"], ms: [] });
    assert.deepEqual(rotation.primary, ["rcuff"]);
    assert.deepEqual(rotation.secondary, ["sho"]);
    assert.equal(rotation.mode, "mobility");
  }
});

test("catalogue names alone never invent a missing muscle assignment", () => {
  for (const id of ["jg_samasthiti", "jg_urdhva_hastasana", "jg_parsva_bakasana", "jg_ardha_navasana", "jg_hanumanasana"]) {
    const result = resolveMuscleMap({ id, mp: [], ms: [], jg: { katalog: true } });
    assert.deepEqual(result.primary, []);
    assert.deepEqual(result.secondary, []);
    assert.equal(result.mode, "unspecified");
    assert.equal(result.corrected, false);
  }
});

test("breathing and unspecified endurance do not borrow a misleading superficial muscle map", () => {
  const breath = resolveMuscleMap({ id: "diaphragm", pat: "dech", mp: [], ms: ["abs"] });
  assert.equal(breath.mode, "none");
  assert.deepEqual(breath.secondary, []);
  assert.ok(breath.note.en.includes("diaphragm"));
  const endurance = resolveMuscleMap({ id: "zone2", mp: [], ms: ["qua", "cal", "ham"] });
  assert.equal(endurance.mode, "unspecified");
  assert.deepEqual(endurance.secondary, []);
  assert.ok(endurance.note.cz);
  const custom = resolveMuscleMap({ id: "zone2", mp: ["qua"], ms: ["cal"] });
  assert.deepEqual(custom.primary, ["qua"]);
  assert.equal(custom.corrected, false);
});
