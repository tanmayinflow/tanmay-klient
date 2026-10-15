import test from "node:test";
import assert from "node:assert/strict";
import { tmStartLockedViewport } from "../src/shared/ui/overlayViewport.js";

function events(extra = {}) {
  const listeners = new Map();
  return Object.assign(extra, {
    addEventListener(name, fn) { if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name).add(fn); },
    removeEventListener(name, fn) { listeners.get(name)?.delete(fn); },
    emit(name) { for (const fn of listeners.get(name) || []) fn(); },
    listenerCount() { return [...listeners.values()].reduce((n, set) => n + set.size, 0); },
  });
}
function harness({ visualViewport = true, standalone = false } = {}) {
  const values = new Map(), priorities = new Map(), frames = new Map();
  let id = 0;
  const style = {
    getPropertyValue: (name) => values.get(name) || "",
    getPropertyPriority: (name) => priorities.get(name) || "",
    setProperty(name, value, priority = "") { values.set(name, value); priorities.set(name, priority); },
    removeProperty(name) { values.delete(name); priorities.delete(name); },
  };
  const vv = events({ height: 844, width: 390, offsetTop: 0, offsetLeft: 0 });
  const win = events({ innerHeight: 844, innerWidth: 390, navigator: { standalone }, visualViewport: visualViewport ? vv : undefined,
    resets: 0, scrollTo() { this.resets++; },
    requestAnimationFrame(fn) { frames.set(++id, fn); return id; }, cancelAnimationFrame(key) { frames.delete(key); },
  });
  const root = { clientHeight: 844, clientWidth: 390, style, scrollTop: 0 };
  const doc = events({ documentElement: root, visibilityState: "visible" });
  const flush = () => { for (let n = 0; frames.size && n < 10; n++) { const batch = [...frames.values()]; frames.clear(); batch.forEach((fn) => fn()); } };
  return { win, doc, root, vv, style, flush, values };
}

test("locked root retains its pre-lock extent even when the fixed body leaves normal flow", () => {
  const h = harness(), stop = tmStartLockedViewport(h.win, h.doc);
  assert.equal(h.style.getPropertyValue("height"), "844px");
  // Model the short-layout report that triggered the installed-app failure.
  h.win.innerHeight = 766; h.root.clientHeight = 766;
  h.vv.emit("resize"); h.flush();
  assert.equal(h.style.getPropertyValue("min-height"), "844px");
  assert.equal(h.style.getPropertyValue("--tm-overlay-height"), "844px");
  stop();
});

test("surface follows a visible viewport larger than layout without inventing screen dimensions", () => {
  const h = harness(); h.win.innerHeight = 744; h.root.clientHeight = 744;
  const stop = tmStartLockedViewport(h.win, h.doc);
  assert.equal(h.style.getPropertyValue("--tm-overlay-height"), "844px");
  h.vv.height = 880; h.vv.offsetTop = 12; h.vv.emit("scroll"); h.flush();
  assert.equal(h.style.getPropertyValue("--tm-overlay-top"), "12px");
  assert.equal(h.style.getPropertyValue("--tm-overlay-height"), "880px");
  assert.equal(h.style.getPropertyValue("height"), "892px");
  stop();
});

test("installed app keeps paper full-height when locking removes safe areas from reported viewport", () => {
  const h = harness({ standalone: true }), stop = tmStartLockedViewport(h.win, h.doc); h.flush();
  h.win.innerHeight = 751; h.root.clientHeight = 751; h.vv.height = 751;
  h.vv.emit("resize"); h.flush();
  assert.equal(h.style.getPropertyValue("--tm-overlay-height"), "844px");
  h.vv.height = 390; h.vv.emit("resize"); h.flush();
  assert.equal(h.style.getPropertyValue("--tm-overlay-height"), "390px");
  for (let height = 420; height < 751; height += 40) { h.vv.height = height; h.vv.emit("resize"); h.flush(); }
  h.vv.height = 751; h.vv.emit("resize"); h.flush();
  assert.equal(h.style.getPropertyValue("--tm-overlay-height"), "844px");
  stop();
});

test("keyboard shrinks content but not the document canvas, and typing does not reset native scroll", () => {
  const h = harness(), stop = tmStartLockedViewport(h.win, h.doc); h.flush();
  const resets = h.win.resets;
  h.vv.height = 390; h.vv.offsetTop = 90; h.vv.emit("resize"); h.flush();
  assert.equal(h.style.getPropertyValue("height"), "844px");
  assert.equal(h.style.getPropertyValue("--tm-overlay-height"), "390px");
  assert.equal(h.style.getPropertyValue("--tm-overlay-top"), "90px");
  assert.equal(h.win.resets, resets);
  h.vv.offsetTop = 110; h.vv.emit("scroll"); h.flush();
  assert.equal(h.win.resets, resets);
  for (let height = 420; height < 844; height += 40) {
    h.vv.height = height; h.vv.offsetTop = 0; h.vv.emit("resize"); h.flush();
  }
  h.vv.height = 844; h.vv.emit("resize"); h.flush();
  assert.equal(h.win.resets, resets + 1);
  assert.equal(h.style.getPropertyValue("--tm-overlay-height"), "844px");
  stop();
});

test("rotation discards the old portrait extent and supports fractional reading scale", () => {
  const h = harness(), stop = tmStartLockedViewport(h.win, h.doc); h.flush();
  h.win.innerWidth = 844; h.win.innerHeight = 390; h.vv.width = 659.375; h.vv.height = 304.6875;
  h.win.emit("resize"); h.flush();
  assert.equal(h.style.getPropertyValue("height"), "390px");
  assert.equal(h.style.getPropertyValue("--tm-overlay-width"), "659.375px");
  assert.equal(h.style.getPropertyValue("--tm-overlay-height"), "304.688px");
  stop();
});

test("resume refreshes geometry and final cleanup restores exact styles and cancels pending recovery", () => {
  const h = harness(); h.style.setProperty("height", "100%", "important"); h.style.setProperty("overflow", "clip");
  const stop = tmStartLockedViewport(h.win, h.doc); h.flush();
  const resets = h.win.resets;
  h.doc.emit("visibilitychange"); h.flush(); assert.equal(h.win.resets, resets + 1);
  h.win.emit("pageshow"); stop(); h.flush();
  assert.equal(h.win.resets, resets + 1);
  assert.equal(h.style.getPropertyValue("height"), "100%");
  assert.equal(h.style.getPropertyPriority("height"), "important");
  assert.equal(h.style.getPropertyValue("overflow"), "clip");
  assert.equal(h.style.getPropertyValue("--tm-overlay-height"), "");
  assert.equal(h.win.listenerCount() + h.doc.listenerCount() + h.vv.listenerCount(), 0);
});

test("older browsers fall back to inner viewport and refresh on resize", () => {
  const h = harness({ visualViewport: false }), stop = tmStartLockedViewport(h.win, h.doc);
  assert.equal(h.style.getPropertyValue("--tm-overlay-height"), "844px");
  h.win.innerHeight = 780; h.win.emit("resize"); h.flush();
  assert.equal(h.style.getPropertyValue("--tm-overlay-height"), "780px");
  assert.equal(h.style.getPropertyValue("height"), "844px");
  stop();
});

test("nested layers preserve the first healthy extent and restore scroll only after the last close", async () => {
  const h = harness({ standalone: true }), attrs = new Map();
  Object.assign(h.root, { getAttribute: (key) => attrs.get(key) ?? null, setAttribute: (key, value) => attrs.set(key, value), removeAttribute: (key) => attrs.delete(key) });
  h.doc.body = { style: {} }; h.win.scrollY = 517;
  h.win.scrollTo = function (_x, y) { this.scrollY = y; };
  const priorWindow = globalThis.window, priorDocument = globalThis.document;
  globalThis.window = h.win; globalThis.document = h.doc;
  try {
    const lock = await import(`../src/shared/ui/overlay.js?nested-viewport=${Date.now()}`);
    lock.tmZamkniStranku(); h.flush();
    h.win.innerHeight = 751; h.root.clientHeight = 751; h.vv.height = 751;
    lock.tmZamkniStranku(); h.vv.emit("resize"); h.flush();
    lock.tmOdemkniStranku();
    assert.equal(h.style.getPropertyValue("--tm-overlay-height"), "844px");
    assert.equal(h.doc.body.style.top, "-517px");
    assert.equal(h.win.scrollY, 0);
    lock.tmOdemkniStranku(); h.flush();
    assert.equal(h.style.getPropertyValue("height"), "");
    assert.equal(h.doc.body.style.position, "");
    assert.equal(h.win.scrollY, 517);
    assert.equal(h.win.listenerCount() + h.doc.listenerCount() + h.vv.listenerCount(), 0);
  } finally { globalThis.window = priorWindow; globalThis.document = priorDocument; }
});
