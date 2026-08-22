// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/repo-tests/theme-signature.test.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// SIGNATURE · DEN JE ZMRAZENÝ, NOC JE PŘESTAVĚNÁ.
//
// Theme System V1 přidal šest volitelných rodin a Signature nechal být.
// V1.1 opravil jednu věc, kterou nechat být nešlo: noc táhla do mechu.
// Pole bylo Forest Night, ale povrchy, nadpis a hero šly do zeleně
// (#2E3D35, #9AAA8D), takže aplikace v noci nečetla jako papír, inkoust
// a měď, ale jako wellness. Ink Night je teplý uhel, lněný text, měď a písek.
//
// Den se nezměnil ani o odstín a drží ho otisk. Noc má svůj vlastní otisk,
// aby se od téhle chvíle taky nemohla hnout bez rozhodnutí — a navíc
// vysloveně měřenou podmínku, že žádná její plocha nečte zeleně.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { THEME_TANMAY, makeTheme } from "../src/shared/ui/theme.js";
import { resolveTheme, DEFAULT_FAMILY, DEFAULT_MODE, BRAND } from "../src/shared/ui/themeRegistry.js";
import { chroma, hueDeg, readsGreen, ratio } from "../src/shared/ui/contrast.js";

const LEGACY_KEYS = ["mode", "bg", "bgSidebar", "text", "heading", "textSec", "textMuted",
  "accent", "accentInk", "onAccent", "sage", "sand", "inkSand", "danger", "info", "success",
  "warning", "border", "borderSoft", "card", "cardHover", "callout", "tableHead", "sheet",
  "sheetHover", "activeNav", "overlay", "shadow", "shadowLift", "shadowPop", "shadowSheet",
  "shadowDrag", "hero", "heroInk", "heroInkSoft", "heroLine"];

const FINGERPRINT = {
  light: "d704eea59764f56382760a22111f860c3dc346c88382836693a017a5d4c6f4fc",
  dark: "46ad87a39d04e902c98aca1f7a796a422bccdc09c3ddf8ff39580cbb344fc2f0",
};

const print = (mode) => {
  const o = {};
  for (const k of LEGACY_KEYS) o[k] = THEME_TANMAY[mode][k];
  return createHash("sha256").update(JSON.stringify(o)).digest("hex");
};

test("Signature · den je zmrazený produkční Linen", () => {
  assert.equal(print("light"), FINGERPRINT.light,
    "Světlá Signature se změnila. Tahle vlna to má zakázané — pokud je to záměr, patří to do DECISIONS.md.");
  const l = resolveTheme("signature", "light");
  assert.equal(l.bg, "#F4F0EB");        // Linen
  assert.equal(l.card, "#FAF7F2");
  assert.equal(l.sheet, "#FFFDF9");
  assert.equal(l.text, "#1C1C1A");
  assert.equal(l.heading, "#2E3D35");   // Deep Moss · zmrazený inkoust nadpisu
  assert.equal(l.accent, BRAND.copper);
  assert.equal(l.focusRing, l.accent, "obtah soustředění je ve dne pořád měď");
});

test("Signature · noc je Ink Night a drží svůj otisk", () => {
  assert.equal(print("dark"), FINGERPRINT.dark,
    "Tmavá Signature se změnila. Je to rozhodnutí, ne úprava — zapiš ho.");
  const d = resolveTheme("signature", "dark");
  assert.equal(d.bg, "#0F100E");
  assert.equal(d.bgSidebar, "#0B0C0A");
  assert.equal(d.surface, "#181916");
  assert.equal(d.card, "#21221E");
  assert.equal(d.documentSurface, "#171815");
  assert.equal(d.text, BRAND.linen, "text v noci je len");
  assert.equal(d.accent, BRAND.copper, "měď zůstává mědí");
  assert.equal(d.sand, "#C5B49A", "Warm Sand je druhá značková stopa noci");
  assert.equal(d.focusRing, "#C5B49A");
});

test("Signature · noc nesmí číst zeleně", () => {
  // Regrese na přesně tu vadu, kterou V1.1 opravuje.
  const d = resolveTheme("signature", "dark");
  const plochy = ["background", "navigation", "surface", "surfaceRaised", "surfaceMuted",
    "card", "documentSurface", "hero", "callout", "tableHead", "sheet", "sheetHover", "cardHover"];
  for (const k of plochy) {
    assert.equal(readsGreen(d[k]), false, `${k} = ${d[k]} čte zeleně · hue ${Math.round(hueDeg(d[k]))}`);
    assert.ok(chroma(d[k]) <= 0.06, `${k} = ${d[k]} není neutrální uhel · sytost ${chroma(d[k]).toFixed(3)}`);
  }
  // Inkousty taky ne · sage byl #9AAA8D, mechová zeleň v popiscích oddílů.
  for (const k of ["text", "textSecondary", "textMuted", "heading", "sage"]) {
    assert.equal(readsGreen(d[k], 0.12), false, `${k} = ${d[k]} je mechový inkoust`);
  }
  // A pořád to má být NOC: pole tmavší než kterýkoli povrch, text jasně nad ním.
  assert.ok(ratio(d.text, d.background, d.background) >= 12, "lněný text na uhlu musí být jasný");
});

test("Signature · den a noc se od sebe liší polem, ne rodinou", () => {
  const l = resolveTheme("signature", "light"), d = resolveTheme("signature", "dark");
  assert.equal(l.brandCopper, d.brandCopper);
  assert.equal(l.brandLinen, d.brandLinen);
  assert.equal(l.brandForest, d.brandForest);
  assert.equal(d.brandForest, "#1C1C1A", "#1C1C1A zůstává značkovým tokenem, jen už není celoplošným polem");
});

test("výchozí stav je pořád Signature a den", () => {
  assert.equal(DEFAULT_FAMILY, "signature");
  assert.equal(DEFAULT_MODE, "light");
  assert.equal(makeTheme("light"), THEME_TANMAY.light);
});
