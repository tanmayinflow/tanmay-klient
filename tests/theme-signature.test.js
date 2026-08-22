// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/repo-tests/theme-signature.test.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// SIGNATURE SE NESMÍ POHNOUT.
//
// Theme System V1 přidává šest rodin. Kdo si žádnou nevybral — a to jsou po
// nasazení všichni —, musí vidět přesně to, co viděl včera. Tenhle test drží
// otisk celé produkční palety: kdyby kdokoli „vylepšil" jediný odstín
// Signature, spadne build, ne až oko.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { THEME_TANMAY, makeTheme } from "../src/shared/ui/theme.js";
import { resolveTheme, DEFAULT_FAMILY, DEFAULT_MODE } from "../src/shared/ui/themeRegistry.js";

const LEGACY_KEYS = ["mode", "bg", "bgSidebar", "text", "heading", "textSec", "textMuted",
  "accent", "accentInk", "onAccent", "sage", "sand", "inkSand", "danger", "info", "success",
  "warning", "border", "borderSoft", "card", "cardHover", "callout", "tableHead", "sheet",
  "sheetHover", "activeNav", "overlay", "shadow", "shadowLift", "shadowPop", "shadowSheet",
  "shadowDrag", "hero", "heroInk", "heroInkSoft", "heroLine"];

const FINGERPRINT = "dd35a6b7e152efcd954e5b253773e4e97de2395a3c0c6a23858b49b003a0397e";

test("otisk produkční palety Signature sedí", () => {
  const out = {};
  for (const m of ["light", "dark"]) {
    out[m] = {};
    for (const k of LEGACY_KEYS) out[m][k] = THEME_TANMAY[m][k];
  }
  const got = createHash("sha256").update(JSON.stringify(out)).digest("hex");
  assert.equal(got, FINGERPRINT,
    "Signature se změnila. Pokud je to záměr, patří to do DECISIONS.md a do THEME-SYSTEM-V1.md — ne do commitu s jinou zprávou.");
});

test("kotevní barvy a klíčové plochy jmenovitě", () => {
  const l = resolveTheme("signature", "light"), d = resolveTheme("signature", "dark");
  assert.equal(l.bg, "#F4F0EB");        // Linen
  assert.equal(d.bg, "#1C1C1A");        // Forest Night
  assert.equal(l.accent, "#B87333");    // Copper
  assert.equal(d.accent, "#B87333");
  assert.equal(l.card, "#FAF7F2");
  assert.equal(d.card, "#242521");
  assert.equal(l.sheet, "#FFFDF9");
  assert.equal(d.sheet, "#2C2D27");
  assert.equal(l.heading, "#2E3D35");   // Deep Moss
  assert.equal(l.focusRing, l.accent, "obtah soustředění je v Signature pořád měď");
  assert.equal(d.focusRing, d.accent);
});

test("výchozí stav je pořád Signature a den", () => {
  assert.equal(DEFAULT_FAMILY, "signature");
  assert.equal(DEFAULT_MODE, "light");
  assert.equal(makeTheme("light"), THEME_TANMAY.light);
});
