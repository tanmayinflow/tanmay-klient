// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/repo-tests/theme-registry.test.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// REJSTŘÍK VZHLEDŮ V3 · Signature trojice + osm palet, jeden resolver,
// jedna volba se zapamatovanou Signature, jedna řeč rámů na paletu.
import { test } from "node:test";
import assert from "node:assert/strict";
import { FIXED_PRESET_IDS, DEFAULT_PRESET, PRESET_FIELDS, PRESET_THEME_COLORS, BRAND, UTILITY, CHART, CHART_PATTERNS, DOCUMENT_THEME, resolveTheme, previewTokens, pwaThemeColor, documentThemeAttrs, chartPalette } from "../src/shared/ui/themeRegistry.js";


const ROLES = [
  "mode", "polarity",
  "background", "navigation", "surface", "surfaceRaised", "elevatedSurface", "surfaceMuted",
  "card", "documentSurface", "overlay",
  "text", "heading", "textSecondary", "textMuted", "textDisabled", "placeholder", "placeholderText", "placeholderStrong",
  "border", "borderStrong", "borderSoft",
  "interactiveAccent", "interactiveAccentHover", "interactiveAccentPressed", "interactiveOnAccent",
  "selectionSurface", "selectionText", "focusRing", "link", "linkHover",
  "brandCopper", "brandLinen", "brandForest", "atlasFrame", "atlasBorder",
  "successFg", "successBg", "warningFg", "warningBg", "errorFg", "errorBg", "infoFg", "infoBg",
  "chart1", "chart2", "chart3", "chart4", "chart5", "chart6", "chartSurface", "grid", "axis",
  "bg", "bgSidebar", "textSec", "accent", "accentInk", "onAccent", "sage", "sand", "inkSand",
  "danger", "info", "success", "warning", "cardHover", "callout", "tableHead", "sheet", "sheetHover",
  "activeNav", "hero", "heroInk", "heroInkSoft", "heroLine",
  "shadow", "shadowLift", "shadowPop", "shadowSheet", "shadowDrag", "divider", "scrim",
  "navText", "navHeading", "navTextSec", "navKicker", "navIcon", "navMuted",
  "navAccent", "navAccentInk", "navActiveBg", "navHairline", "navBorder", "dockBg",
  "frameOuter", "frameInner", "frameRail", "frameHighlight",
];







test("každá vyřešená paleta má úplný kontrakt včetně nav a rámových rolí", () => {
  for (const id of FIXED_PRESET_IDS) {
    const t = resolveTheme(id, false);
    assert.ok(Object.isFrozen(t), id);
    for (const r of ROLES) assert.ok(t[r] !== undefined, `${id} nemá roli ${r}`);
    assert.equal(t.brandCopper, BRAND.copper, id);
    assert.equal(t.atlasFrame, BRAND.linen, `${id} tónuje plát Movement Atlasu`);
    assert.equal(t.polarity, t.mode);
  }
  assert.equal(UTILITY.ink, BRAND.forest);
  assert.equal(UTILITY.linen, BRAND.linen);
});

test("náhled ukazuje kus rozhraní včetně rámu, ne ploché vzorky", () => {
  const need = ["background", "navigation", "card", "documentSurface",
    "text", "textMuted", "heading", "accent", "onAccent", "success", "error",
    "frameOuter", "frameInner", "frameRail"];
  for (const id of FIXED_PRESET_IDS) {
    const pv = previewTokens(id);
    for (const k of need) assert.ok(pv[k], `${id}: náhled nemá ${k}`);
  }
  assert.equal(previewTokens("signature-auto"), previewTokens(DEFAULT_PRESET));
});

test("barva prohlížeče: pole, u Monumentu tmavý plášť navigace", () => {
  for (const id of FIXED_PRESET_IDS) {
    const t = resolveTheme(id, false);
    const tc = pwaThemeColor(id, false);
    assert.ok(tc === t.background || tc === t.navigation, `${id}: theme-color není pole ani navigace`);
    assert.equal(PRESET_FIELDS[id], t.background, id);
    assert.equal(PRESET_THEME_COLORS[id], tc, id);
  }
  assert.equal(pwaThemeColor("monument-clay", false), "#26303B");
  assert.deepEqual(documentThemeAttrs("garnet-slate", true), {
    "data-appearance": "garnet-slate", "data-color-mode": "light", "data-frame-grammar": "landscape",
  });
  assert.deepEqual(documentThemeAttrs("signature-auto", true), {
    "data-appearance": "landscape-day", "data-color-mode": "light", "data-frame-grammar": "landscape",
  });
});







test("datová paleta má šest pozic a nebarevný nosič", () => {
  for (const id of FIXED_PRESET_IDS) {
    const cp = chartPalette(id);
    assert.equal(cp.series.length, 6, id);
    assert.equal(cp.patterns.length, 6);
  }
  assert.equal(CHART_PATTERNS.length, 6);
  assert.deepEqual([...chartPalette("light").series], [...CHART.light.series]);
});

test("dokument pro tisk a PDF nikdy nesleduje volbu", () => {
  assert.equal(DOCUMENT_THEME, resolveTheme("signature-day", false));
  assert.equal(DOCUMENT_THEME.bg, BRAND.linen);
});
