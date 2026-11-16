import { test } from "node:test";
import assert from "node:assert/strict";
import { advancePomoRun, appendPomoBlocks, createPomoStorage, pomoAccountScope, pomoDurationMinutes } from "../src/shared/product/pomodoro.js";
import { pomodoroPalette } from "../src/shared/ui/pomodoroPalette.js";
import { makeThemeFor } from "../src/shared/ui/theme.js";
import { FIXED_PRESET_IDS } from "../src/shared/ui/themeRegistry.js";
import { contrast, composite } from "../src/shared/ui/contrast.js";

const minute = 60000;
const started = new Date(2026, 10, 16, 9).getTime();
const focusRun = (patch = {}) => ({ mode: "focus", running: true, cycle: 0, startAt: started, endAt: started + 25 * minute, cat: "studium", note: "Read", cfg: { focus: 25, short: 5, long: 15, every: 4 }, ...patch });

test("focus, break and next focus start automatically at their original deadlines", () => {
  const first = advancePomoRun(focusRun(), started + 25 * minute);
  assert.equal(first.run.mode, "short");
  assert.equal(first.run.running, true);
  assert.equal(first.run.endAt, started + 30 * minute);
  assert.equal(first.blocks.length, 1);
  assert.deepEqual(first.blocks[0], { id: "pomo:focus@" + (started + 25 * minute), d: "2026-11-16", ts: started + 25 * minute, min: 25, cat: "studium", note: "Read" });
  const second = advancePomoRun(first.run, started + 30 * minute);
  assert.equal(second.run.mode, "focus");
  assert.equal(second.run.running, true);
  assert.equal(second.run.endAt, started + 55 * minute);
  assert.equal(second.run.cycle, 1);
  assert.equal(second.blocks.length, 0);
  assert.equal(second.boundary.zacatek, "focus");
});

test("return after suspension catches up through multiple cycles and a long break without drift", () => {
  const result = advancePomoRun(focusRun(), started + 137 * minute);
  assert.equal(result.run.mode, "focus");
  assert.equal(result.run.running, true);
  assert.equal(result.run.cycle, 4);
  assert.equal(result.run.startAt, started + 130 * minute);
  assert.equal(result.run.endAt, started + 155 * minute);
  assert.equal(result.blocks.length, 4);
  assert.deepEqual(result.blocks.map(x => (x.ts - started) / minute), [25, 55, 85, 115]);
  assert.deepEqual(result.boundary, { bid: "long@" + (started + 130 * minute), konec: "long", zacatek: "focus", kdy: started + 130 * minute });
  const restored = JSON.parse(JSON.stringify(result.run));
  const again = advancePomoRun(restored, started + 137 * minute);
  assert.strictEqual(again.run, restored);
  assert.equal(again.count, 0);
  assert.deepEqual(again.blocks, []);
});

test("custom blocks retain their chosen duration after a break", () => {
  const run = focusRun({ mode: "custom", endAt: started + 45 * minute, cfg: { focus: 25, custom: 45, short: 5, long: 15, every: 4 } });
  const result = advancePomoRun(run, started + 51 * minute);
  assert.equal(result.run.mode, "custom");
  assert.equal(result.run.endAt, started + 95 * minute);
  assert.equal(result.blocks[0].min, 45);
});

test("bounded catch-up keeps every completed block and reaches the same clock", () => {
  const now = started + 137 * minute;
  const expected = advancePomoRun(focusRun(), now);
  const first = advancePomoRun(focusRun(), now, 3);
  assert.equal(first.catchingUp, true);
  const last = advancePomoRun(first.run, now);
  assert.equal(last.catchingUp, false);
  assert.deepEqual(last.run, expected.run);
  assert.deepEqual([...first.blocks, ...last.blocks], expected.blocks);
});

test("paused clocks stay paused and invalid durations cannot create an endless catch-up", () => {
  const run = focusRun({ running: false, remaining: 400 });
  assert.strictEqual(advancePomoRun(run, started + 300 * minute).run, run);
  assert.equal(pomoDurationMinutes("short", { short: 0 }), 5);
  assert.equal(pomoDurationMinutes("long", { long: -1 }), 15);
  assert.equal(pomoDurationMinutes("focus", { focus: Infinity }), 25);
  const result = advancePomoRun(focusRun({ cfg: { focus: 0, short: -5, every: 0 } }), started + 31 * minute);
  assert.equal(result.run.mode, "focus");
  assert.equal(result.run.endAt, started + 55 * minute);
  assert.equal(result.catchingUp, false);
});

test("overnight catch-up assigns each block to its actual local completion date", () => {
  const evening = new Date(2026, 10, 16, 23, 20).getTime();
  const result = advancePomoRun(focusRun({ startAt: evening, endAt: evening + 25 * minute }), evening + 160 * minute);
  assert.deepEqual(result.blocks.map(block => block.d), ["2026-11-16", "2026-11-17", "2026-11-17", "2026-11-17", "2026-11-17"]);
  assert.equal(result.run.cycle, 5);
  assert.equal(result.run.mode, "focus");
  assert.equal(result.run.endAt, evening + 185 * minute);
});

test("resuming a saved pause uses its remaining time and starts the following break from that deadline", () => {
  const paused = focusRun({ running: false, endAt: null, remaining: 10 * 60 });
  const resumedAt = started + 100 * minute;
  assert.equal(advancePomoRun(paused, resumedAt).count, 0);
  const resumed = { ...JSON.parse(JSON.stringify(paused)), running: true, startAt: resumedAt, endAt: resumedAt + paused.remaining * 1000 };
  assert.equal(advancePomoRun(resumed, resumedAt + 9 * minute).count, 0);
  const result = advancePomoRun(resumed, resumedAt + 10 * minute);
  assert.equal(result.blocks.length, 1);
  assert.equal(result.run.mode, "short");
  assert.equal(result.run.endAt, resumedAt + 15 * minute);
});

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
