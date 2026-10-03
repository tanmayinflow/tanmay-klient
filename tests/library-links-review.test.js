import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLibrary, loadEngine } from "../scripts/lib/exercise-library.mjs";
import { resolveExercise } from "../src/training/catalog.js";
import { templateFromLegacyWorkout, fulfilmentFrom, mergeFulfilment } from "../src/training/adapters.js";
import { makeSession } from "../src/training/sessionModel.js";
import { summary, volumeByExercise } from "../src/training/statistics.js";

test("word collisions and one-leg loading resolve to their actual exercise families", () => {
  const jefferson = { id: "jefferson", pat: "mobilita", mode: "reps", eq: ["telo", "zavazi"] };
  assert.equal(resolveExercise(jefferson, { f: "curl_biceps" }).familyId, "id:jefferson");
  const archer = { id: "archersq", pat: "drep", S: 2, C: 2, mode: "reps", eq: ["telo"] };
  const resolved = resolveExercise(archer, { f: "squat_bilateral" });
  assert.equal(resolved.id, "archersq");
  assert.equal(resolved.familyId, "squat_unilateral");
  assert.equal(resolved.sideMode, "perSide");
  assert.equal(resolved.strengthDemand, 2);
  assert.equal(resolved.coordinationDemand, 2);
  assert.equal(resolveExercise({ ...archer, family: "my_deliberate_family" }).familyId, "my_deliberate_family");
});

test("explicit unilateral instructions expose per-side recording without overriding a user's choice", () => {
  for (const id of [
    "archersq", "oap", "oapush", "onearmhs", "slbalance", "onelegfl", "oafl", "dragonsquat",
    "anklemob", "couch", "openbook", "hipcars", "jg_vasisthasana", "jg_triang_mukhaikapada",
    "jg_utthita_trikonasana", "jg_natarajasana", "jg_parighasana", "jg_dandayamana_janusirasana",
    "jg_dandayamana_dhanurasana", "jg_supta_matsyendrasana",
  ]) {
    const row = Object.freeze({ id, mode: "sec" });
    assert.equal(resolveExercise(row).sideMode, "perSide", id);
    assert.equal(resolveExercise(row).unilateral, true, id);
    assert.equal(resolveExercise({ ...row, sideMode: "none" }).sideMode, "none", id);
    assert.equal(resolveExercise({ ...row, sideMode: "alternating" }).sideMode, "alternating", id);
  }
  assert.equal(resolveExercise({ id: "lunge" }).sideMode, "alternating");
  assert.equal(resolveExercise({ id: "gm_w_half_cossack" }).sideMode, "none");
});

test("the shipped full bridge stays explicitly available and is excluded from both generic generators", () => {
  const library = loadLibrary();
  const row = library.byId.bridge;
  const resolved = resolveExercise(row, library.meta.bridge);
  assert.equal(resolved.id, "bridge");
  assert.equal(resolved.strengthDemand, 4);
  assert.equal(resolved.coordinationDemand, 2);
  assert.equal(resolved.role, "SPECIALIST");
  assert.equal(resolved.familyId, "full_backbend");
  assert.equal(resolved.status, "active");
  assert.equal(resolved.clientVisible, true);
  assert.equal(resolved.generatorEligible, false);
  assert.equal(resolved.requiresCoach, true);
  assert.equal(resolved.easierId, null);
  assert.equal(loadEngine().tGenericEligible(row), false);
});

test("per-side metadata does not double an imported legacy prescription", () => {
  const rec = resolveExercise({ id: "oapush", mode: "reps", eq: ["telo"] });
  const template = templateFromLegacyWorkout({
    cz: "Fixture", en: "Fixture", rows: [{ ex: "oapush", sets: 2, reps: 5, unit: "×" }],
  }, () => rec);
  assert.equal(rec.sideMode, "perSide");
  assert.equal(template.blocks.length, 1);
  assert.equal(template.blocks[0].sets.length, 2);
  for (const set of template.blocks[0].sets) {
    assert.equal(set.planned.targetReps, 5);
    assert.equal(set.side, null);
  }
});

test("an explicit custom coaching choice wins while absent values inherit reviewed metadata", () => {
  const lib = loadLibrary();
  const bridge = lib.byId.bridge;
  assert.equal(resolveExercise(bridge, lib.meta.bridge).requiresCoach, true);
  assert.equal(resolveExercise({ ...bridge, requiresCoach: false }, lib.meta.bridge).requiresCoach, false);
  assert.equal(resolveExercise({ ...bridge, requiresCoach: true }, { co: false }).requiresCoach, true);
  assert.equal(loadEngine().tRequiresCoach({ ...bridge, requiresCoach: false }), false);
  assert.equal(loadEngine().tRequiresCoach(bridge), true);
});

test("stored side labels and completed results survive fulfilment without reinterpreting old sets", () => {
  const session = makeSession({
    id: "fixture-history", date: "2026-10-01", state: "done", endedAt: 100,
    blocks: [{ id: "fixture-block", exId: "oapush", measurementType: "BODYWEIGHT_REPS",
      sets: [null, "L", "R"].map((side, i) => ({
        id: "fixture-set-" + i, side, type: "work", completed: true,
        planned: { targetReps: 5 }, actual: { reps: [5, 4, 3][i] },
      })),
    }],
  });
  const before = structuredClone(session);
  assert.equal(resolveExercise({ id: "oapush" }).sideMode, "perSide");
  const imported = mergeFulfilment([], fulfilmentFrom([session], { now: 200 }), "fixture-client");
  assert.deepEqual(session, before);
  const sets = imported[0].blocks[0].sets;
  assert.equal(sets.length, 3);
  assert.deepEqual(sets.map(s => s.side), [null, "L", "R"]);
  assert.deepEqual(sets.map(s => s.actual.reps), [5, 4, 3]);
  assert.deepEqual(sets.map(s => s.id), before.blocks[0].sets.map(s => s.id));
  assert.equal(summary(imported, { who: "fixture-client" }).workingSets, 3);
  assert.equal(volumeByExercise(imported, { who: "fixture-client" })[0].byUnit.reps, 12);
});
