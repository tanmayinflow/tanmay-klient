import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLibrary } from "../scripts/lib/exercise-library.mjs";
import * as TV from "../src/training/index.js";
import { reviewLibraryCollection } from "../src/training/libraryReview.js";
import { PLAIN_COPY, PLAIN_COPY_FIELDS, applyPlainCopy, applyPlainCopyCollection, plainCopyCoverage, plainCopyHash } from "../src/training/plainCopy.js";
import { TRUNK_AUDIT_CONTEXT } from "../src/data/trunkAuditContext.js";
import { MOVEMENT_AUDIT_CONTEXT } from "../src/data/movementAuditContext.js";
import { BALANCE_AUDIT_CONTEXT } from "../src/data/balanceAuditContext.js";
import { LOCOMOTION_AUDIT_CONTEXT } from "../src/data/locomotionAuditContext.js";
import { LOWER_LEG_AUDIT_CONTEXT } from "../src/data/lowerLegAuditContext.js";
import { HIP_AUDIT_CONTEXT } from "../src/data/hipAuditContext.js";
import { SHOULDER_AUDIT_CONTEXT } from "../src/data/shoulderAuditContext.js";
import { ELBOW_HAND_AUDIT_CONTEXT } from "../src/data/elbowHandAuditContext.js";
import { LANDING_AUDIT_CONTEXT } from "../src/data/landingAuditContext.js";
import { COMPLEX_TASK_AUDIT_CONTEXT } from "../src/data/complexTaskAuditContext.js";
import { THROW_AUDIT_CONTEXT } from "../src/data/throwAuditContext.js";
import { BREATHING_AUDIT_CONTEXT } from "../src/data/breathingAuditContext.js";
import { POSITION_HOLD_AUDIT_CONTEXT } from "../src/data/positionHoldAuditContext.js";

// Lidová vrstva textů knihovny cviků. Zdroj a pravidla:
// Work/web-application/Reviews/copy-plain-2026-11-24/STYLE.md

const role = HIP_AUDIT_CONTEXT.role;
const { all, meta } = loadLibrary();
const options = {
  trunkAuditContext: TRUNK_AUDIT_CONTEXT, movementAuditContext: MOVEMENT_AUDIT_CONTEXT, balanceAuditContext: BALANCE_AUDIT_CONTEXT,
  locomotionAuditContext: LOCOMOTION_AUDIT_CONTEXT, lowerLegAuditContext: LOWER_LEG_AUDIT_CONTEXT, hipAuditContext: HIP_AUDIT_CONTEXT,
  shoulderAuditContext: SHOULDER_AUDIT_CONTEXT, elbowHandAuditContext: ELBOW_HAND_AUDIT_CONTEXT, landingAuditContext: LANDING_AUDIT_CONTEXT,
  complexTaskAuditContext: COMPLEX_TASK_AUDIT_CONTEXT, throwAuditContext: THROW_AUDIT_CONTEXT, breathingAuditContext: BREATHING_AUDIT_CONTEXT,
  positionHoldAuditContext: POSITION_HOLD_AUDIT_CONTEXT, auditMetadata: meta,
  ...(role === "client" ? { includeLungeFoundations: true, includeClientVerticalPushFoundations: true, includeClientVerticalPullFoundations: true } : {}),
};
const seeds = all.map(({ seed, ...row }) => row);
const audited = TV.seedCompleteExerciseLibrary(role, { tEx: seeds }, role === "client" ? TV.TRAINING_V2_EXERCISES : undefined, options);
const reviewed = reviewLibraryCollection(audited);
const before = new Map(audited.tEx.map(row => [row.id, row]));
const after = new Map(reviewed.tEx.map(row => [row.id, row]));
const ids = Object.keys(PLAIN_COPY);
const words = text => text.trim().split(/\s+/).length;

test("the layer has copy and every entry is complete in both languages", () => {
  assert.ok(ids.length > 0);
  for (const id of ids) {
    const entry = PLAIN_COPY[id];
    assert.ok(after.has(id), id + " is not a library card");
    for (const field of PLAIN_COPY_FIELDS) {
      assert.ok(entry[field], id + "." + field + " missing");
      const [guards, cz, en] = entry[field];
      assert.ok(Array.isArray(guards) && guards.length > 0, id + "." + field + " has no guard");
      assert.ok(cz && en && /[.!?]$/.test(cz) && /[.!?]$/.test(en), id + "." + field + " needs both languages");
      assert.ok(!guards.includes(plainCopyHash([cz, en])), id + "." + field + " guards its own text");
    }
    if (entry.n) assert.ok(entry.n[1] && entry.n[2], id + " name needs both languages");
  }
});

test("copy stays short and free of record-keeping, citations and banned claims", () => {
  const banned = /zapisuj|zapiš |individuáln|fitk|klik[yů]? na bradlech|prevenc|léčí|Rouland|jedin[áé] poctiv[áé] cesta|nejtěžší ásana/i;
  const bannedEn = /\bheals?\b|direct prevention|the hardest asana|the honest road to/i;
  for (const id of ids) {
    let total = 0;
    for (const field of PLAIN_COPY_FIELDS) {
      const [, cz, en] = PLAIN_COPY[id][field];
      assert.ok(!banned.test(cz), id + "." + field + ": " + cz);
      assert.ok(!bannedEn.test(en), id + "." + field + ": " + en);
      total += words(cz);
    }
    assert.ok(total <= 75, id + " has " + total + " Czech words");
  }
});

test("the audited library receives the plain copy through the collection review", () => {
  for (const id of ids) {
    const row = after.get(id);
    const entry = PLAIN_COPY[id];
    for (const field of PLAIN_COPY_FIELDS) assert.deepEqual(row[field], [entry[field][1], entry[field][2]], id + "." + field);
    assert.equal(row.cz, before.get(id).cz, id + " keeps its Atlas name");
    assert.equal(row.en, before.get(id).en, id + " keeps its Atlas name");
    if (entry.n) {
      assert.equal(row.displayCz, entry.n[1]);
      assert.equal(row.displayEn, entry.n[2]);
      const record = TV.resolveExercise(row, meta[id], undefined, undefined, undefined, HIP_AUDIT_CONTEXT, SHOULDER_AUDIT_CONTEXT);
      assert.equal(record.displayCz, entry.n[1], id + " resolves the display name");
    }
  }
  const coverage = plainCopyCoverage(reviewed);
  assert.equal(coverage.plain, ids.length);
  assert.equal(coverage.waiting, 0);
});

test("the layer is idempotent and immutable", () => {
  assert.equal(applyPlainCopyCollection(reviewed), reviewed);
  assert.equal(reviewLibraryCollection(reviewed), reviewed);
  const id = ids[0];
  const source = Object.freeze({ ...before.get(id) });
  const result = applyPlainCopy(source);
  assert.notEqual(result, source);
  assert.deepEqual(source, before.get(id));
  assert.equal(applyPlainCopy(result), result);
});

test("a person's own edit, a custom card and an unknown card stay untouched", () => {
  const id = ids[0];
  const original = before.get(id);
  const edited = { ...original, exe: [original.exe[0], "My own English cue"], cz: "Můj název" };
  const result = applyPlainCopy(edited);
  assert.equal(result.exe, edited.exe);
  assert.equal(result.displayCz, undefined);
  assert.deepEqual(result.foc, [PLAIN_COPY[id].foc[1], PLAIN_COPY[id].foc[2]]);
  const custom = { ...original, custom: true };
  assert.equal(applyPlainCopy(custom), custom);
  const unknown = { id: "moje_vlastni_karta", foc: original.foc };
  assert.equal(applyPlainCopy(unknown), unknown);
  assert.equal(applyPlainCopy(null), null);
});
