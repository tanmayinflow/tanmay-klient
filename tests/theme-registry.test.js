// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/repo-tests/theme-registry.test.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// REJSTŘÍK VZHLEDŮ V3 · Signature trojice + osm palet, jeden resolver,
// jedna volba se zapamatovanou Signature, jedna řeč rámů na paletu.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  APPEARANCE_PRESETS, APPEARANCE_PRESET_IDS, FIXED_PRESETS, FIXED_PRESET_IDS,
  SIGNATURE_PRESET_IDS, OPTIONAL_PRESET_IDS, OPTIONAL_PRESETS,
  DEFAULT_PRESET, RECOMMENDED_PRESET, PRESET_FIELDS, PRESET_THEME_COLORS, PRESET_GRAMMARS,
  BRAND, UTILITY, FUNCTIONAL, CHART, CHART_PATTERNS, DOCUMENT_THEME, STATUS_CARRIERS, TONE_ROLES,
  appearancePreset, resolvePresetId, resolveAppearancePreset, resolveTheme, presetPolarity,
  isSystemAware, isSignaturePreset, frameChrome, previewTokens, pwaThemeColor, documentThemeAttrs,
  statusPalette, chartPalette, presetFromFamily, migrateLegacyAppearance, normalizeAppearance,
  signatureAppearance, selectAppearance, returnToSignature, toneStyle, APPEARANCE_VERSION,
} from "../src/shared/ui/themeRegistry.js";
import { makeThemeFor, makeTagsFor } from "../src/shared/ui/theme.js";

const ORDER = ["signature-auto", "signature-day", "signature-night",
  "slate-clay-pantone", "monument-clay", "sand-burnt-earth", "garnet-slate",
  "shikon-fossil", "volcanic-grey", "americano-chai", "quiet-ledger-night"];

const GRAMMARS = {
  "signature-day": "none", "signature-night": "none",
  "slate-clay-pantone": "architectural-double",
  "monument-clay": "monument-inset",
  "sand-burnt-earth": "strata-rails",
  "garnet-slate": "corner-brackets",
  "shikon-fossil": "nested-fossil",
  "volcanic-grey": "basalt-steps",
  "americano-chai": "woven-rails",
  "quiet-ledger-night": "quiet-ledger",
};

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

test("jedenáct vzhledů, v daném pořadí: Signature trojice a osm palet", () => {
  assert.deepEqual([...APPEARANCE_PRESET_IDS], ORDER);
  assert.equal(APPEARANCE_PRESETS.length, 11);
  assert.deepEqual([...SIGNATURE_PRESET_IDS], ORDER.slice(0, 3));
  assert.deepEqual([...OPTIONAL_PRESET_IDS], ORDER.slice(3));
  assert.equal(OPTIONAL_PRESETS.length, 8);
  assert.equal(DEFAULT_PRESET, "signature-auto");
  assert.equal(RECOMMENDED_PRESET, "signature-auto");
  const cs = new Set(), en = new Set();
  for (const p of APPEARANCE_PRESETS) {
    assert.ok(p.labelCs && p.labelEn, `${p.id} nemá oba popisky`);
    assert.ok(!cs.has(p.labelCs) && !en.has(p.labelEn), `${p.id}: popisek je dvakrát`);
    cs.add(p.labelCs); en.add(p.labelEn);
  }
});

test("řeč rámů: každá paleta má svou, Signature žádnou, žádné dvě stejné", () => {
  const seen = new Set();
  for (const id of FIXED_PRESET_IDS) {
    const g = frameChrome(id, false).frameGrammar;
    assert.equal(g, GRAMMARS[id], id);
    if (g !== "none") {
      assert.ok(!seen.has(g), `gramatika ${g} je dvakrát — palety by splynuly`);
      seen.add(g);
    }
  }
  assert.equal(seen.size, 8);
  assert.equal(frameChrome("signature-auto", true).frameGrammar, "none");
  assert.deepEqual(PRESET_GRAMMARS["garnet-slate"], "corner-brackets");
  for (const id of OPTIONAL_PRESET_IDS) {
    const ch = frameChrome(id, false);
    assert.equal(ch.density, "restrained", id);
    assert.ok(ch.frameTargets.length >= 2 && ch.frameTargets.length <= 4, `${id}: rozpočet cílů`);
    for (const tgt of ch.frameTargets) {
      assert.ok(["room", "panel", "selected", "document", "sheet", "dock"].indexOf(tgt) !== -1, tgt);
    }
  }
});

test("resolver · jen automatika poslouchá systém, palety jsou pevné", () => {
  assert.ok(isSystemAware("signature-auto"));
  assert.equal(resolveAppearancePreset("signature-auto", false).id, "signature-day");
  assert.equal(resolveAppearancePreset("signature-auto", true).id, "signature-night");
  for (const id of FIXED_PRESET_IDS) {
    assert.ok(!isSystemAware(id), id);
    assert.equal(resolveAppearancePreset(id, true).id, id, `${id} se hnul se systémem`);
    assert.equal(resolveTheme(id, false), resolveTheme(id, true), id);
  }
  assert.equal(resolvePresetId("nic"), DEFAULT_PRESET);
  assert.equal(appearancePreset("nic").id, DEFAULT_PRESET);
});

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
  const auto = previewTokens("signature-auto");
  assert.ok(auto.light && auto.dark);
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
    "data-appearance": "garnet-slate", "data-color-mode": "light", "data-frame-grammar": "corner-brackets",
  });
  assert.deepEqual(documentThemeAttrs("signature-auto", true), {
    "data-appearance": "signature-night", "data-color-mode": "dark", "data-frame-grammar": "none",
  });
});

test("volba nese zapamatovanou Signature a návrat ji obnoví", () => {
  let pref = signatureAppearance();
  assert.equal(pref.version, APPEARANCE_VERSION);
  pref = selectAppearance(pref, "signature-night");
  assert.deepEqual([pref.preset, pref.signature], ["signature-night", "signature-night"]);
  pref = selectAppearance(pref, "shikon-fossil");
  assert.deepEqual([pref.preset, pref.signature], ["shikon-fossil", "signature-night"]);
  pref = selectAppearance(pref, "volcanic-grey");
  assert.equal(pref.signature, "signature-night", "odbočka mezi paletami Signature volbu nepřepisuje");
  pref = returnToSignature(pref);
  assert.deepEqual([pref.preset, pref.signature], ["signature-night", "signature-night"]);
  assert.ok(isSignaturePreset("signature-day") && !isSignaturePreset("garnet-slate"));
});

test("migrace · všechny generace uložené volby", () => {
  const v = (o) => JSON.stringify(o);
  // V2 → V3 (zrušené palety)
  assert.equal(migrateLegacyAppearance(v({ version: 3, preset: "smoke-spice" }), null).preset, "shikon-fossil");
  assert.equal(migrateLegacyAppearance(v({ version: 3, preset: "river-night" }), null).preset, "volcanic-grey");
  assert.equal(migrateLegacyAppearance(v({ version: 3, preset: "mulberry-paper" }), null).preset, "garnet-slate");
  assert.equal(migrateLegacyAppearance(v({ version: 3, preset: "slate-clay" }), null).preset, "slate-clay-pantone");
  assert.equal(migrateLegacyAppearance(v({ version: 3, preset: "sand-earth" }), null).preset, "sand-burnt-earth");
  assert.equal(migrateLegacyAppearance(v({ version: 3, preset: "teal-night" }), null).preset, "signature-night");
  // V3 tvar projde beze změny
  const p = migrateLegacyAppearance(v({ version: 4, preset: "americano-chai", signature: "signature-day" }), null);
  assert.deepEqual([p.preset, p.signature], ["americano-chai", "signature-day"]);
  // V1/V1.1 rodiny
  assert.equal(presetFromFamily("signature", "dark"), "signature-night");
  assert.equal(migrateLegacyAppearance(v({ version: 2, family: "atlantic-sky", mode: "dark" }), null).preset, "slate-clay-pantone");
  assert.equal(migrateLegacyAppearance(v({ version: 2, family: "olive-gold", mode: "light" }), null).preset, "sand-burnt-earth");
  assert.equal(migrateLegacyAppearance(v({ version: 2, family: "river-mist", mode: "light" }), null).preset, "volcanic-grey");
  assert.equal(migrateLegacyAppearance(v({ version: 2, family: "teal-parchment", mode: "dark" }), null).preset, "signature-night");
  // v0
  assert.equal(migrateLegacyAppearance(null, "dark").preset, "signature-night");
  assert.equal(migrateLegacyAppearance(null, "light").preset, "signature-day");
  // nesmysl → automatika
  assert.equal(migrateLegacyAppearance("{rozbité", null).preset, DEFAULT_PRESET);
  assert.equal(migrateLegacyAppearance(v({ version: 3, preset: "neexistuje" }), null).preset, DEFAULT_PRESET);
  assert.equal(migrateLegacyAppearance(null, null).preset, DEFAULT_PRESET);
  // idempotence
  const once = migrateLegacyAppearance(v({ version: 3, preset: "smoke-spice" }), null);
  const twice = normalizeAppearance(once);
  assert.deepEqual([once.preset, once.signature], [twice.preset, twice.signature]);
});

test("stav není nikdy jen barva a stavové role zůstávají sdílené", () => {
  for (const role of ["success", "warning", "error", "info", "neutral"]) {
    assert.ok(STATUS_CARRIERS[role].glyph && STATUS_CARRIERS[role].shape, role);
  }
  assert.equal(toneStyle("neznámý", "signature-day").role, "neutral");
  // Volitelná paleta stavy NEladí — Granát se nesmí stát chybou.
  // Výjimka daná specem: Tichý zápis nese vlastní čtyřbarevný signální jazyk.
  for (const id of OPTIONAL_PRESET_IDS) {
    if (id === "quiet-ledger-night") continue;
    const s = statusPalette(id);
    const mode = appearancePreset(id).polarity;
    assert.equal(s.errorFg, FUNCTIONAL[mode].errorFg, `${id}: stavová červeň se pohnula`);
    assert.equal(s.successFg, FUNCTIONAL[mode].successFg, id);
  }
  // Tichý zápis: Azul informuje, Verde potvrzuje, Areia varuje, Terra chybuje.
  const ql = statusPalette("quiet-ledger-night");
  assert.deepEqual(
    [ql.infoBg, ql.infoFg, ql.successBg, ql.successFg, ql.warningBg, ql.warningFg, ql.errorBg, ql.errorFg],
    ["#28374A", "#D3C7AD", "#6B6751", "#F0EFED", "#D3C7AD", "#28374A", "#754437", "#D3C7AD"],
  );
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

test("makeThemeFor a štítky jedou přes resolver", () => {
  assert.equal(makeThemeFor("signature-auto", true), resolveTheme("signature-night", false));
  assert.equal(makeThemeFor("americano-chai", true), resolveTheme("americano-chai", false));
  assert.equal(makeTagsFor("signature-auto", false), makeTagsFor("signature-day", false));
  assert.ok(makeTagsFor("volcanic-grey", false).moss.fg);
});
