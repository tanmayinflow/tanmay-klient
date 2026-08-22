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

/* SIGNATURE JE ZMRAZENÁ. Nápověda v poli je v ní od Brand V2 pod 4,5:1 a
   opravit ji znamená změnit odstín, který dnes lidé vidí — což tahle vlna
   výslovně nesmí. Je to nález, ne povolená výjimka pro nové rodiny: čísla
   jsou zapsaná, takže se nemůžou tiše zhoršit, a THEME-CONTRAST-REPORT.md
   nese návrh opravy, který čeká na samostatné rozhodnutí. */
const SIGNATURE_FROZEN_PLACEHOLDER = { light: "#7D7F78", dark: "#8E8B84" };

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

test("nápověda v poli · nová rodina drží 4,5:1, Signature je zmrazená a změřená", () => {
  const failures = [];
  for (const f of THEME_FAMILIES) for (const mode of MODES) {
    const t = f[mode];
    if (f.id === "signature") {
      assert.equal(t.placeholder, SIGNATURE_FROZEN_PLACEHOLDER[mode],
        "Signature nesmí změnit odstín nápovědy · viz THEME-CONTRAST-REPORT.md");
      continue;
    }
    for (const [n, bg] of [["documentSurface", t.documentSurface], ["card", t.card], ["background", t.background]]) {
      for (const tok of ["placeholder", "placeholderStrong"]) {
        const r = ratio(t[tok], bg, bg);
        if (r < AA.text) failures.push(`${f.id}/${mode} ${tok}/${n}: ${r}`);
      }
    }
  }
  assert.deepEqual(failures, [], failures.join("\n"));
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
