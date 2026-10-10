import { test } from "node:test";
import assert from "node:assert/strict";
import { appendPomoBlocks, createPomoStorage, pomoAccountScope } from "../src/shared/product/pomodoro.js";
import { pomodoroPalette } from "../src/shared/ui/pomodoroPalette.js";
import { makeThemeFor } from "../src/shared/ui/theme.js";
import { FIXED_PRESET_IDS } from "../src/shared/ui/themeRegistry.js";
import { contrast, composite } from "../src/shared/ui/contrast.js";

test("completed focus blocks are atomic and duplicate queue delivery counts once", () => {
  const first = { id: "pomo:focus@1", d: "2026-10-10", min: 25, cat: "prace" };
  const second = { id: "pomo:custom@2", d: "2026-10-11", min: 45, cat: "tvorba" };
  const original = { journal: [{ id: "private" }], pomoLog: [first], pomoStats: { total: 1, days: { "2026-10-10": 1 } } };
  const result = appendPomoBlocks(original, [first, second, second, null], "2026-10-11");
  assert.deepEqual(result.pomoLog, [second, first]);
  assert.deepEqual(result.pomoStats, { total: 2, days: { "2026-10-10": 1, "2026-10-11": 1 } });
  assert.strictEqual(result.journal, original.journal);
  assert.strictEqual(appendPomoBlocks(result, [first, second], "2026-10-11"), result);
  assert.equal(original.pomoLog.length, 1);
});

test("timer notes and pending blocks stay inside their verified account", () => {
  const data = new Map();
  const storage = { getItem: key => data.get(key), setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key) };
  let scope = "client-A";
  const runtime = createPomoStorage(storage, () => scope);
  runtime.write("tmPomoRun", { note: "Private focus note", running: true });
  runtime.write("tmPomoQueue", [{ id: "A1" }]);
  scope = null;
  assert.equal(runtime.read("tmPomoRun"), null);
  assert.equal(runtime.write("tmPomoRun", { note: "wrong" }), false);
  scope = "client-B";
  assert.deepEqual(runtime.read("tmPomoQueue", []), []);
  runtime.write("tmPomoRun", { note: "B focus" });
  scope = "client-A";
  assert.equal(runtime.read("tmPomoRun").note, "Private focus note");
  assert.deepEqual(runtime.read("tmPomoQueue"), [{ id: "A1" }]);
});

test("Main timer keeps its existing runtime keys and storage errors are observable", () => {
  const data = new Map([["tmPomoRun", '{"remaining":600}']]);
  const runtime = createPomoStorage({ getItem: key => data.get(key), setItem: () => { throw new Error("full"); } });
  assert.deepEqual(runtime.read("tmPomoRun"), { remaining: 600 });
  assert.throws(() => runtime.write("tmPomoRun", {}), /full/);
});

test("verified owner can pause during checking or offline without opening another account's timer", () => {
  const data = new Map();
  const storage = { getItem: key => data.get(key), setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key) };
  let session = { status: "ready", owner: "account-A", member: true };
  let localOwner = "account-A";
  const runtime = createPomoStorage(storage, () => pomoAccountScope(session, localOwner));
  runtime.write("tmPomoRun", { running: true, note: "A focus" });
  for (const status of ["checking", "offline", "ready"]) {
    session = { ...session, status };
    assert.equal(runtime.write("tmPomoRun", { ...runtime.read("tmPomoRun"), running: false }), true, status);
    assert.equal(runtime.read("tmPomoRun").note, "A focus", status);
  }
  for (const status of ["loading", "changed", "sign-in", "membership", "storage"]) {
    session = { ...session, status };
    assert.equal(runtime.read("tmPomoRun"), null, status);
    assert.equal(runtime.write("tmPomoRun", { note: "wrong" }), false, status);
  }
  session = { status: "offline", owner: null, member: null };
  assert.equal(pomoAccountScope(session, localOwner), null, "a stored key alone cannot verify the owner");
  session = { status: "checking", owner: "account-A", member: false };
  assert.equal(pomoAccountScope(session, localOwner), null, "membership must have been verified");
  session = { status: "ready", owner: "account-A", member: true };
  localOwner = "account-B";
  assert.equal(runtime.read("tmPomoRun"), null, "cross-tab owner change is blocked immediately");
  assert.equal(runtime.write("tmPomoRun", {}), false);
  localOwner = "account-A";
  assert.deepEqual(runtime.read("tmPomoRun"), { running: false, note: "A focus" });
});

test("fullscreen timer text and controls contrast with all eight theme surfaces", () => {
  assert.equal(FIXED_PRESET_IDS.length, 8);
  for (const id of FIXED_PRESET_IDS) {
    const palette = pomodoroPalette(makeThemeFor(id, false));
    const selected = composite(palette.wash, palette.background);
    for (const ink of [palette.ink, palette.secondary]) {
      assert.ok(contrast(ink, palette.background, palette.background) >= 4.5, id);
      assert.ok(contrast(ink, selected, selected) >= 4.5, id + " selected");
    }
  }
});

test("custom photograph keeps readable foreground over the brightest image", () => {
  const palette = pomodoroPalette(makeThemeFor("signature-day", false), true);
  const brightest = composite("rgba(28,28,26,0.68)", "#ffffff");
  assert.ok(contrast(palette.ink, brightest, brightest) >= 4.5);
  assert.ok(contrast(palette.secondary, brightest, brightest) >= 4.5);
});
