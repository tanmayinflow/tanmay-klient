// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/repo-tests/theme-signature.test.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// SIGNATURE · DEN JE ZMRAZENÝ, NOC SE ZMĚKČILA.
//
// V1 přidal šest rodin a Signature nechal být. V1.1 opravil noc, která táhla
// do mechu, na Ink Night — teplý uhel, len, měď. Byl to správný odstín, ale
// příliš tvrdý žebřík: pole `#0F100E`, navigace `#0B0C0A`. Na displeji to
// nebyl večerní pokoj, ale OLED, a jednotlivé vrstvy šly poznat jen podle
// hrany.
//
// V2 nechává DEN beze změny a NOC zvedá a rozestupuje podle specifikace:
// šest rozlišitelných vrstev, měkký uhel, žádná zeleň, modř ani fialový cast.
//
// Den drží otisk z V1 — a je to týž řetězec, jaký tu stál před V2. Noc má
// vlastní otisk, aby se od téhle chvíle taky nemohla hnout bez rozhodnutí,
// plus měřené podmínky ze zadání §8.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { THEME_TANMAY, makeTheme } from "../src/shared/ui/theme.js";
import { resolveTheme, DEFAULT_PRESET, BRAND } from "../src/shared/ui/themeRegistry.js";
import { chroma, hueDeg, readsGreen, ratio, luminance, contrast } from "../src/shared/ui/contrast.js";

const LEGACY_KEYS = ["mode", "bg", "bgSidebar", "text", "heading", "textSec", "textMuted",
  "accent", "accentInk", "onAccent", "sage", "sand", "inkSand", "danger", "info", "success",
  "warning", "border", "borderSoft", "card", "cardHover", "callout", "tableHead", "sheet",
  "sheetHover", "activeNav", "overlay", "shadow", "shadowLift", "shadowPop", "shadowSheet",
  "shadowDrag", "hero", "heroInk", "heroInkSoft", "heroLine"];

const FINGERPRINT = {
  // NEZMĚNĚNO OD V1. Kdyby se tenhle řetězec pohnul, den se hnul taky.
  light: "d704eea59764f56382760a22111f860c3dc346c88382836693a017a5d4c6f4fc",
  // Nový otisk V2 · předchozí (near-black Ink Night V1.1) byl
  // 46ad87a39d04e902c98aca1f7a796a422bccdc09c3ddf8ff39580cbb344fc2f0
  dark: "3fc22b849f026bc998335cd28c9bd8bc7f3cbc4aa226765586461525dcc89dbc",
};

/** Pole a navigace, které nosila V1.1. Slouží jen k porovnání „je noc měkčí". */
const V11_NIGHT = Object.freeze({ background: "#0F100E", navigation: "#0B0C0A", surface: "#181916", card: "#21221E" });

const print = (mode) => {
  const o = {};
  for (const k of LEGACY_KEYS) o[k] = THEME_TANMAY[mode][k];
  return createHash("sha256").update(JSON.stringify(o)).digest("hex");
};

test("Signature · den je zmrazený produkční Linen", () => {
  assert.equal(print("light"), FINGERPRINT.light,
    "Světlá Signature se změnila. Tahle vlna to má zakázané — pokud je to záměr, patří to do DECISIONS.md.");
  const l = resolveTheme("signature-day", false);
  assert.equal(l.bg, "#F4F0EB");        // Linen
  assert.equal(l.card, "#FAF7F2");
  assert.equal(l.sheet, "#FFFDF9");
  assert.equal(l.text, "#1C1C1A");
  assert.equal(l.heading, "#2E3D35");   // Deep Moss · zmrazený inkoust nadpisu
  assert.equal(l.accent, BRAND.copper);
  assert.equal(l.focusRing, l.accent, "obtah soustředění je ve dne pořád měď");
  assert.equal(l.placeholder, "#6B655E", "nápověda z uzávěrky V1.1 zůstává");
});

test("Signature · noc má tokeny V2 a drží svůj otisk", () => {
  assert.equal(print("dark"), FINGERPRINT.dark,
    "Tmavá Signature se změnila. Je to rozhodnutí, ne úprava — zapiš ho.");
  const d = resolveTheme("signature-night", false);
  assert.equal(d.background, "#262725");
  assert.equal(d.navigation, "#1E1F1D");
  assert.equal(d.surface, "#30312E");
  assert.equal(d.card, "#383A35");
  assert.equal(d.documentSurface, "#2B2C29");
  assert.equal(d.elevatedSurface, "#414445");
  assert.equal(d.text, BRAND.linen);
  assert.equal(d.interactiveAccent, BRAND.copper);
});

test("Signature · noc je měkčí než ta předchozí, měřeno", () => {
  const d = resolveTheme("signature-night", false);
  // Zadání §8: pole je znatelně světlejší než near-black, ne washed out.
  const L = luminance(d.background);
  assert.ok(L >= 0.018 && L <= 0.026, `jas pole ${L.toFixed(4)} je mimo předepsaný rozsah 0,018–0,026`);
  assert.ok(L > luminance(V11_NIGHT.background) * 2,
    "noc musí být vidět měkčí než near-black z V1.1, ne jen jinak zaokrouhlená");
  assert.ok(luminance(d.navigation) < L, "navigace je tmavší než pole");
  const ladder = [d.documentSurface, d.surface, d.card, d.elevatedSurface].map((c) => luminance(c));
  for (let i = 1; i < ladder.length; i++) {
    assert.ok(ladder[i] > ladder[i - 1], `vrstva ${i + 1} není světlejší než ${i}`);
  }
  // Karta se pozná od pole i bez těžké hrany.
  const cardVsField = (luminance(d.card) + 0.05) / (L + 0.05);
  assert.ok(cardVsField >= 1.25,
    `karta a pole splývají (${cardVsField.toFixed(3)}) — bez hrany by je nikdo nerozeznal`);
  assert.ok(contrast(d.text, d.background, d.background) >= 4.5);
  assert.ok(contrast(d.borderStrong, d.card, d.card) >= 3);
  assert.ok(contrast(d.interactiveOnAccent, d.interactiveAccent, d.interactiveAccent) >= 4.5);
});

test("Signature · noc nečte zeleně, modře ani fialově", () => {
  const d = resolveTheme("signature-night", false);
  /* PRÁH JE SYTOST, NE ODSTÍN. Pod třemi procenty sytosti je odstín šum
     zaokrouhlení — `#414445` má modřejší kanál o čtyři jednotky z 255 a na
     displeji je to uhel jako každý jiný. Cast začíná být vidět nad tím, a
     tam už test odstín kontroluje. */
  for (const k of ["background", "navigation", "surface", "card", "documentSurface", "elevatedSurface"]) {
    assert.ok(!readsGreen(d[k]), `${k} táhne do zeleně`);
    assert.ok(chroma(d[k]) <= 0.03, `${k} má na uhel příliš sytosti (${chroma(d[k])})`);
    if (chroma(d[k]) > 0.03) {
      const h = hueDeg(d[k]);
      assert.ok(h < 110 || h > 330, `${k} má chladný odstín ${h}°`);
    }
  }
  // Charakter nese pole a plochy pod textem: ty jsou teplé nebo bezbarvé.
  for (const k of ["background", "navigation", "surface", "card", "documentSurface"]) {
    const [r, , b] = [1, 3, 5].map((i) => parseInt(d[k].slice(i, i + 2), 16));
    assert.ok(r >= b, `${k} je chladnější než teplejší — uhel má být teplý`);
  }
});

test("starší volání pořád ukazuje na Signature", () => {
  assert.equal(makeTheme("light"), THEME_TANMAY.light);
  assert.equal(makeTheme("dark"), THEME_TANMAY.dark);
  assert.equal(THEME_TANMAY.light, resolveTheme("signature-day", false));
  assert.equal(THEME_TANMAY.dark, resolveTheme("signature-night", false));
  assert.equal(DEFAULT_PRESET, "landscape-day");
});
