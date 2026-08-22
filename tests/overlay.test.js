// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/repo-tests/overlay.test.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
//
// VRSTVENÍ · Escape, zámek stránky, ohrada pro focus, tlačítko zpět.
//
// Tenhle soubor běží v obou aplikacích a ptá se na tutéž implementaci. Každý
// případ je chyba, kterou vrstvení opravdu umí udělat: Escape, který zavře dvě
// patra naráz; zámek stránky, který po zavření zůstane; focus, který skončí na
// začátku dokumentu; tlačítko zpět, které odejde z aplikace místo z listu.
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";

// ---- nejmenší možný DOM ---------------------------------------------------
// Ne napodobenina prohlížeče. Jen tolik, kolik se modul opravdu ptá.
function makeEl(tag) {
  const el = {
    tagName: (tag || "div").toUpperCase(),
    children: [], parentNode: null, isConnected: true,
    attrs: {}, style: {}, _focus: 0, _listeners: {},
    setAttribute(k, v) { this.attrs[k] = String(v); },
    getAttribute(k) { return Object.prototype.hasOwnProperty.call(this.attrs, k) ? this.attrs[k] : null; },
    hasAttribute(k) { return Object.prototype.hasOwnProperty.call(this.attrs, k); },
    addEventListener(t, fn) { (this._listeners[t] = this._listeners[t] || []).push(fn); },
    removeEventListener(t, fn) { const a = this._listeners[t] || []; const i = a.indexOf(fn); if (i >= 0) a.splice(i, 1); },
    dispatch(t, e) { for (const fn of (this._listeners[t] || []).slice()) fn(e); },
    focus() { this._focus++; global.document.activeElement = this; },
    getBoundingClientRect() { return { width: 10, height: 10 }; },
    contains(x) { if (x === this) return true; for (const c of this.children) if (c.contains && c.contains(x)) return true; return false; },
    append(c) { c.parentNode = this; this.children.push(c); return c; },
    querySelectorAll(sel) {
      // Stačí "je to tlačítko nebo prvek s tabindex" — přesný selektor
      // prohlížeče tu nesimulujeme, jen jeho výsledek.
      const out = [];
      const walk = (n) => {
        for (const c of n.children) {
          if (c.tagName === "BUTTON" || c.hasAttribute("tabindex")) out.push(c);
          walk(c);
        }
      };
      walk(this);
      return out;
    },
    querySelector() { return null; },
  };
  return el;
}

let esc, zamek, focus, hist;

beforeEach(async () => {
  const body = makeEl("body");
  global.document = {
    body,
    activeElement: body,
    querySelector: () => null,
    createElement: makeEl,
  };
  const w = {
    scrollY: 0, pageYOffset: 0,
    _listeners: {},
    addEventListener(t, fn) { (this._listeners[t] = this._listeners[t] || []).push(fn); },
    removeEventListener(t, fn) { const a = this._listeners[t] || []; const i = a.indexOf(fn); if (i >= 0) a.splice(i, 1); },
    dispatch(t, e) { for (const fn of (this._listeners[t] || []).slice()) fn(e); },
    scrollTo(x, y) { this.scrollY = y; },
    history: {
      _stack: [{ state: null }],
      state: null,
      pushState(st) { this._stack.push({ state: st }); this.state = st; },
      back() {
        this._stack.pop();
        const top = this._stack[this._stack.length - 1];
        this.state = top ? top.state : null;
        w.dispatch("popstate", { state: this.state });
      },
    },
  };
  global.window = w;
});

const load = async () => {
  // Čerstvý modul pro každý případ · zásobník je záměrně modulový stav.
  const m = await import("../src/shared/ui/overlay.js?" + Math.random());
  return m;
};

// ======================================================================
// ESCAPE
// ======================================================================

test("Escape dostane jen nejvýš položená vrstva", async () => {
  const m = await load();
  const poradi = [];
  const off1 = m.tmEscVrstva(() => poradi.push("spodni"));
  const off2 = m.tmEscVrstva(() => poradi.push("horni"));
  window.dispatch("keydown", { key: "Escape" });
  assert.deepEqual(poradi, ["horni"], "dvě patra naráz se zavřít nesmí");
  off2();
  window.dispatch("keydown", { key: "Escape" });
  assert.deepEqual(poradi, ["horni", "spodni"]);
  off1();
});

test("jiná klávesa nezavírá nic", async () => {
  const m = await load();
  let n = 0;
  const off = m.tmEscVrstva(() => { n++; });
  window.dispatch("keydown", { key: "a" });
  window.dispatch("keydown", { key: "Enter" });
  assert.equal(n, 0);
  off();
});

test("stránka pod překryvem ví, že Escape nepatří jí", async () => {
  const m = await load();
  assert.equal(m.tmEscVolno(), true);
  const off = m.tmEscVrstva(() => {});
  assert.equal(m.tmEscVolno(), false);
  off();
  assert.equal(m.tmEscVolno(), true);
});

test("vrstva odhlášená mimo pořadí nerozbije zásobník", async () => {
  const m = await load();
  const poradi = [];
  const a = m.tmEscVrstva(() => poradi.push("a"));
  const b = m.tmEscVrstva(() => poradi.push("b"));
  const c = m.tmEscVrstva(() => poradi.push("c"));
  b();                                   // prostřední odejde první
  window.dispatch("keydown", { key: "Escape" });
  assert.deepEqual(poradi, ["c"]);
  c();
  window.dispatch("keydown", { key: "Escape" });
  assert.deepEqual(poradi, ["c", "a"]);
  a();
  assert.equal(m.tmVrstevPocet(), 0);
});

// ======================================================================
// ZÁMEK STRÁNKY
// ======================================================================

test("zámek se počítá · list nad listem ho nepustí dřív", async () => {
  const m = await load();
  window.scrollY = 420;
  m.tmZamkniStranku();
  assert.equal(document.body.style.position, "fixed");
  assert.equal(document.body.style.top, "-420px");
  m.tmZamkniStranku();
  m.tmOdemkniStranku();
  assert.equal(document.body.style.position, "fixed", "spodní list ještě stojí");
  m.tmOdemkniStranku();
  assert.equal(document.body.style.position, "", "po poslední vrstvě se zámek pouští");
  assert.equal(document.body.style.overflow, "");
  assert.equal(m.tmZamekPocet(), 0);
});

test("po zavření se stránka vrátí na svou polohu", async () => {
  const m = await load();
  window.scrollY = 1337;
  m.tmZamkniStranku();
  window.scrollY = 0;                    // fixed body · prohlížeč posun ztratí
  m.tmOdemkniStranku();
  assert.equal(window.scrollY, 1337, "skok na začátek stránky je chyba, ne detail");
});

test("odemknutí navíc zámek nerozhodí", async () => {
  const m = await load();
  m.tmOdemkniStranku();
  m.tmOdemkniStranku();
  assert.equal(m.tmZamekPocet(), 0);
  m.tmZamkniStranku();
  assert.equal(document.body.style.position, "fixed");
  m.tmOdemkniStranku();
  assert.equal(document.body.style.position, "");
});

// ======================================================================
// LISTOVÁNÍ
// ======================================================================

test("zámek listování je počítadlo, ne vlajka", async () => {
  const m = await load();
  assert.equal(m.tmListovaniSpi(), false);
  m.tmListovaniStuj(); m.tmListovaniStuj();
  m.tmListovaniJdi();
  assert.equal(m.tmListovaniSpi(), true, "náhled nad poznámkou drží zámek dál");
  m.tmListovaniJdi();
  assert.equal(m.tmListovaniSpi(), false);
});

// ======================================================================
// FOCUS
// ======================================================================

test("focus se vrátí tam, odkud vyšel", async () => {
  const m = await load();
  const spoust = makeEl("button");
  document.body.append(spoust);
  spoust.focus();
  const list = makeEl("div");
  const uvnitr = makeEl("button");
  list.append(uvnitr);
  document.body.append(list);
  const off = m.tmChytFocus(list);
  await new Promise((r) => setTimeout(r, 60));
  assert.equal(document.activeElement, uvnitr, "focus patří do otevřené vrstvy");
  off();
  assert.equal(document.activeElement, spoust, "po zavření se vrací, ne na začátek dokumentu");
});

test("tabulátor z otevřené vrstvy neuteče", async () => {
  const m = await load();
  const list = makeEl("div");
  const a = makeEl("button"), b = makeEl("button");
  list.append(a); list.append(b);
  document.body.append(list);
  const off = m.tmChytFocus(list);
  await new Promise((r) => setTimeout(r, 60));
  b.focus();
  let branil = false;
  list.dispatch("keydown", { key: "Tab", shiftKey: false, preventDefault: () => { branil = true; } });
  assert.equal(branil, true, "z poslední položky se má skočit na první, ne ven");
  assert.equal(document.activeElement, a);
  a.focus();
  branil = false;
  list.dispatch("keydown", { key: "Tab", shiftKey: true, preventDefault: () => { branil = true; } });
  assert.equal(branil, true);
  assert.equal(document.activeElement, b);
  off();
});

test("prázdná vrstva si focus vezme na sebe", async () => {
  const m = await load();
  const list = makeEl("div");
  document.body.append(list);
  const off = m.tmChytFocus(list);
  await new Promise((r) => setTimeout(r, 60));
  assert.equal(document.activeElement, list);
  assert.equal(list.getAttribute("tabindex"), "-1");
  off();
});

// ======================================================================
// TLAČÍTKO ZPĚT
// ======================================================================

test("gesto zpět zavře vrstvu, ne aplikaci", async () => {
  const m = await load();
  let zavreno = 0;
  const off = m.tmHistorieVrstva(() => { zavreno++; });
  assert.equal(m.tmHistoriePocet(), 1);
  window.history.back();
  assert.equal(zavreno, 1, "zpět má spotřebovat vrstva");
  assert.equal(m.tmHistoriePocet(), 0);
  off();
});

test("zavření křížkem si svůj záznam vezme zpátky", async () => {
  const m = await load();
  const hloubka = window.history._stack.length;
  const off = m.tmHistorieVrstva(() => {});
  assert.equal(window.history._stack.length, hloubka + 1);
  off();
  assert.equal(window.history._stack.length, hloubka, "jinak by zpět bylo napodruhé mrtvé");
});

test("gesto zpět zavře jen horní vrstvu", async () => {
  const m = await load();
  const poradi = [];
  const offA = m.tmHistorieVrstva(() => poradi.push("a"));
  const offB = m.tmHistorieVrstva(() => poradi.push("b"));
  window.history.back();
  assert.deepEqual(poradi, ["b"]);
  assert.equal(m.tmHistoriePocet(), 1);
  window.history.back();
  assert.deepEqual(poradi, ["b", "a"]);
  offA(); offB();
});
