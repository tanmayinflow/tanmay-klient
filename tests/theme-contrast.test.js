// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/repo-tests/theme-contrast.test.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// KONTRASTNÍ AUDIT · 7 rodin × 2 režimy = 14 vyřešených palet.
//
// Tenhle test nečte předem napsané `pass: true`. Relativní jas se počítá
// z hexu podle WCAG 2.1 a průsvitná barva se skládá na povrch, na kterém
// opravdu leží. Když se v rejstříku pohne jediný odstín, spadne to tady.
import { test } from "node:test";
import assert from "node:assert/strict";
import { THEME_FAMILIES, chartPalette, statusPalette } from "../src/shared/ui/themeRegistry.js";
import { makeTagsFor } from "../src/shared/ui/theme.js";
import { ratio, composite, grayscale, cvdDistance, AA } from "../src/shared/ui/contrast.js";

const MODES = ["light", "dark"];
const TAG_KEYS = ["moss", "sage", "sand", "ochre", "taupe", "stone", "burgundy", "rose", "plum", "slate"];

/* ŽÁDNÁ VÝJIMKA. Nápověda v poli byla ve světlé Signature od Brand V2 na
   3,99:1 a chvíli tu stála jako zapsaný nález. Naváděcí text je významový
   a čte se — 4,5:1 pro něj platí stejně jako pro všechno ostatní, tak se to
   opravilo. `#7D7F78` je hodnota, která TU VADU MĚLA; drží se tady jako
   negativní kontrola, aby se návrat k ní nedal přehlédnout. */
const OLD_BROKEN_PLACEHOLDER = "#7D7F78";

function pairs(t) {
  const out = [];
  const on = (name, fg, bg, min) => out.push({ name, fg, bg, min });
  const fields = [["background", t.background], ["navigation", t.navigation], ["surface", t.surface],
    ["card", t.card], ["documentSurface", t.documentSurface]];
  for (const [n, bg] of fields) {
    on("text/" + n, t.text, bg, AA.text);
    on("textSecondary/" + n, t.textSecondary, bg, AA.text);
    on("textMuted/" + n, t.textMuted, bg, AA.text);
    on("link/" + n, t.link, bg, AA.text);
    on("accent/" + n, t.interactiveAccent, bg, AA.ui);
    on("focusRing/" + n, t.focusRing, bg, AA.ui);
    on("borderStrong/" + n, t.borderStrong, bg, AA.ui);
    on("textDisabled/" + n, t.textDisabled, bg, AA.ui);
    on("heading/" + n, t.heading, bg, AA.text);
  }
  on("onAccent/accent", t.interactiveOnAccent, t.interactiveAccent, AA.text);
  on("onAccent/accentHover", t.interactiveOnAccent, t.interactiveAccentHover, AA.text);
  on("onAccent/accentPressed", t.interactiveOnAccent, t.interactiveAccentPressed, AA.text);
  on("selectionText/selectionSurface", t.selectionText, t.selectionSurface, AA.text);
  for (const s of ["success", "warning", "error", "info"]) {
    on(s + "Fg/" + s + "Bg", t[s + "Fg"], t[s + "Bg"], AA.text);
    on(s + "Fg/card", t[s + "Fg"], t.card, AA.ui);
    on(s + "Fg/background", t[s + "Fg"], t.background, AA.ui);
  }
  return out;
}

test("čtrnáct palet · text, hrany, stavy a soustředění", () => {
  const failures = [];
  let checks = 0;
  for (const f of THEME_FAMILIES) for (const mode of MODES) {
    for (const p of pairs(f[mode])) {
      checks++;
      const r = ratio(p.fg, p.bg, p.bg);
      if (r < p.min) failures.push(`${f.id}/${mode} ${p.name}: ${r} < ${p.min} (${p.fg} na ${p.bg})`);
    }
  }
  assert.ok(checks >= 7 * 2 * 50, "audit musí projít všechny palety, ne vzorek · " + checks);
  assert.deepEqual(failures, [], failures.join("\n"));
});

test("nápověda v poli drží 4,5:1 ve všech čtrnácti paletách · bez výjimky", () => {
  const failures = [];
  for (const f of THEME_FAMILIES) for (const mode of MODES) {
    const t = f[mode];
    // Plochy, na kterých se naváděcí text opravdu vykresluje: pole formuláře
    // (`tmInput` staví na `sheet`, tedy documentSurface), karta (`fieldStyle`),
    // psací plocha, a pro jistotu i pole stránky a navigace.
    for (const [n, bg] of [["documentSurface", t.documentSurface], ["card", t.card],
      ["surface", t.surface], ["background", t.background], ["navigation", t.navigation]]) {
      for (const tok of ["placeholder", "placeholderStrong"]) {
        const r = ratio(t[tok], bg, bg);
        if (r < AA.text) failures.push(`${f.id}/${mode} ${tok}/${n}: ${r}`);
      }
    }
    // Zůstává tišší než napsaný text — jinak by to nebyla nápověda.
    assert.ok(ratio(t.text, t.background, t.background) > ratio(t.placeholder, t.background, t.background),
      `${f.id}/${mode}: nápověda není tišší než text`);
  }
  assert.deepEqual(failures, [], failures.join("\n"));
});

test("negativní kontrola · stará hodnota nápovědy by tenhle test shodila", () => {
  // Kdyby se někdo vrátil k odvozené složenině ztlumeného písma (nebo k ní
  // dojel snížením krytí), tohle je přesně ta hodnota — a neprojde.
  const t = THEME_FAMILIES.find((f) => f.id === "signature").light;
  const r = ratio(OLD_BROKEN_PLACEHOLDER, t.documentSurface, t.documentSurface);
  assert.ok(r < AA.text, `negativní kontrola přestala platit: ${OLD_BROKEN_PLACEHOLDER} dělá ${r}`);
  assert.notEqual(t.placeholder, OLD_BROKEN_PLACEHOLDER);
  // A totéž krytím: 0,80 nad listem je přesně ta složenina.
  const via80 = composite(`rgba(92,95,88,0.8)`, t.documentSurface);
  assert.equal(via80.toUpperCase(), OLD_BROKEN_PLACEHOLDER);
  assert.ok(ratio(via80, t.documentSurface, t.documentSurface) < AA.text,
    "snížené krytí nesmí být cesta zpátky pod práh");
});

test("zakázaný stav je čitelný, ale zřetelně tišší než ztlumené písmo", () => {
  for (const f of THEME_FAMILIES) for (const mode of MODES) {
    const t = f[mode];
    const dis = ratio(t.textDisabled, t.background, t.background);
    const muted = ratio(t.textMuted, t.background, t.background);
    assert.ok(dis >= AA.ui, `${f.id}/${mode}: zakázaný stav ${dis} < 3`);
    assert.ok(dis < muted, `${f.id}/${mode}: zakázaný stav se nedá odlišit od ztlumeného písma`);
  }
});

test("štítky drží 4,5:1 na kartě každé rodiny", () => {
  const failures = [];
  for (const f of THEME_FAMILIES) for (const mode of MODES) {
    const tags = makeTagsFor(f.id, mode);
    for (const k of TAG_KEYS) {
      const tone = tags[k];
      const eff = composite(tone.bg, f[mode].card);
      const r = ratio(tone.fg, eff, eff);
      if (r < AA.text) failures.push(`${f.id}/${mode} štítek ${k}: ${r}`);
    }
  }
  assert.deepEqual(failures, [], failures.join("\n"));
});

test("Signature má tóny štítků nezměněné", () => {
  // Tóny jsou data uložených poznámek. V Signature se nesmí pohnout vůbec.
  const light = makeTagsFor("signature", "light");
  assert.equal(light.moss.fg, "#2E3D35");
  assert.equal(light.slate.fg, "#3F565E");
  assert.equal(light.green.fg, light.moss.fg, "starý klíč je alias, ne druhý systém");
  const dark = makeTagsFor("signature", "dark");
  assert.equal(dark.moss.fg, "#ABC0B1");
  assert.equal(dark.slate.fg, "#A6BFC5");
});

test("série grafu se rozliší i bez barvy", () => {
  for (const mode of MODES) {
    const series = chartPalette(mode).series;
    for (let i = 0; i < series.length - 1; i++) {
      const g = ratio(grayscale(series[i]), grayscale(series[i + 1]));
      assert.ok(g >= 1.18, `${mode}: sousední série ${i + 1} a ${i + 2} splynou v šedi (${g})`);
    }
    // žebřík jasu je monotónní, takže vzdálenější dvojice jsou vždycky dál
    for (let i = 0; i < series.length; i++) for (let j = i + 1; j < series.length; j++) {
      const g = ratio(grayscale(series[i]), grayscale(series[j]));
      assert.ok(g >= 1.18, `${mode}: série ${i + 1} a ${j + 1} splynou v šedi (${g})`);
    }
  }
});

test("série grafu drží 3:1 na plotně každého motivu", () => {
  const failures = [];
  for (const f of THEME_FAMILIES) for (const mode of MODES) {
    const t = f[mode];
    chartPalette(mode).series.forEach((c, i) => {
      const r = ratio(c, t.chartSurface, t.chartSurface);
      if (r < AA.ui) failures.push(`${f.id}/${mode} chart${i + 1}: ${r}`);
    });
    const ax = ratio(t.axis, t.chartSurface, t.chartSurface);
    if (ax < AA.ui) failures.push(`${f.id}/${mode} osa: ${ax}`);
  }
  assert.deepEqual(failures, [], failures.join("\n"));
});

test("barvoslepost · co barva neunese, unese znak a slovo", () => {
  // Zelená a červená leží v deuteranopii blízko sebe a po převodu do šedi mají
  // skoro týž jas. Tenhle test to NEMASKUJE — změří to a tím zdůvodní, proč
  // stav povinně nese ještě znak a popisek (viz theme-registry.test.js).
  for (const mode of MODES) {
    const s = statusPalette(mode);
    const d = cvdDistance(s.successFg, s.errorFg, "deuteranopia");
    assert.ok(d < 60, "kdyby to najednou stačilo barvou, je tenhle předpoklad neplatný a je třeba přepsat pravidlo");
    for (const kind of ["protanopia", "deuteranopia", "tritanopia"]) {
      const series = chartPalette(mode).series;
      for (let i = 0; i < series.length - 1; i++) {
        // hue smí splynout — jas ne, a ten je hlídaný výš
        const g = ratio(grayscale(series[i]), grayscale(series[i + 1]));
        const c = cvdDistance(series[i], series[i + 1], kind);
        assert.ok(g >= 1.18 || c >= 40, `${mode}/${kind}: série ${i + 1} a ${i + 2} nemají čím se lišit`);
      }
    }
  }
});
