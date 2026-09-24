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

import { THEME_TANMAY, makeTheme } from "../src/shared/ui/theme.js";
import { resolveTheme, DEFAULT_PRESET, BRAND } from "../src/shared/ui/themeRegistry.js";


test("Signature · den je zmrazený produkční Linen", () => {
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







test("starší volání pořád ukazuje na Signature", () => {
  assert.equal(makeTheme("light"), THEME_TANMAY.light);
  assert.equal(makeTheme("dark"), THEME_TANMAY.dark);
  assert.equal(THEME_TANMAY.light, resolveTheme("signature-day", false));
  assert.equal(THEME_TANMAY.dark, resolveTheme("landscape-night", false));
  assert.equal(DEFAULT_PRESET, "landscape-day");
});
