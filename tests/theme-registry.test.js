// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/repo-tests/theme-registry.test.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// REJSTŘÍK VZHLEDŮ · devět položek, jeden resolver, jedna migrace.
//
// Tenhle soubor hlídá TVAR systému, ne barvy: že vzhledů je devět a v daném
// pořadí, že jediná z nich poslouchá systém, že každá vyřešená paleta má
// všechny role, že náhled ukazuje kus rozhraní a ne dva čtverce, a že se
// uložená volba převede ze všech tří generací a podruhé už se nehne.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  APPEARANCE_PRESETS, APPEARANCE_PRESET_IDS, FIXED_PRESETS, FIXED_PRESET_IDS,
  DEFAULT_PRESET, RECOMMENDED_PRESET, PRESET_FIELDS,
  BRAND, FUNCTIONAL, CHART, CHART_PATTERNS, DOCUMENT_THEME, STATUS_CARRIERS, TONE_ROLES,
  appearancePreset, resolvePresetId, resolveAppearancePreset, resolveTheme, presetPolarity,
  isSystemAware, previewTokens, pwaThemeColor, documentThemeAttrs, statusPalette, chartPalette,
  presetFromFamily, migrateLegacyAppearance, normalizeAppearance, signatureAppearance,
  toneStyle, APPEARANCE_VERSION,
} from "../src/shared/ui/themeRegistry.js";
import { makeThemeFor, makeTagsFor, TAG_ALIAS } from "../src/shared/ui/theme.js";

const ORDER = ["signature-auto", "signature-day", "signature-night", "river-night",
  "teal-night", "mulberry-paper", "slate-clay", "sand-earth", "smoke-spice"];

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
];

test("devět vzhledů, v daném pořadí, osm z nich pevných", () => {
  assert.deepEqual([...APPEARANCE_PRESET_IDS], ORDER);
  assert.equal(APPEARANCE_PRESETS.length, 9);
  assert.equal(FIXED_PRESET_IDS.length, 8);
  assert.equal(FIXED_PRESET_IDS.indexOf("signature-auto"), -1);
  assert.equal(DEFAULT_PRESET, "signature-auto");
  assert.equal(RECOMMENDED_PRESET, "signature-auto");
  const cs = new Set(), en = new Set();
  for (const p of APPEARANCE_PRESETS) {
    assert.ok(p.labelCs && p.labelEn, `${p.id} nemá oba popisky`);
    assert.ok(!cs.has(p.labelCs), `český popisek ${p.labelCs} je dvakrát`);
    assert.ok(!en.has(p.labelEn), `anglický popisek ${p.labelEn} je dvakrát`);
    cs.add(p.labelCs); en.add(p.labelEn);
    assert.ok(p.kind === "auto" || p.polarity === "light" || p.polarity === "dark", `${p.id} nemá polaritu`);
  }
});

test("model rodina × režim je pryč z rejstříku", () => {
  const mod = Object.keys(FUNCTIONAL);
  assert.deepEqual(mod, ["light", "dark"], "FUNCTIONAL zůstává tabulka dvou polarit, ne výběr");
  // Staré exporty výběru už nesmí existovat — jinak by je něco mohlo číst dál.
  for (const gone of ["THEME_FAMILIES", "THEME_FAMILY_IDS", "THEME_MODES", "THEME_GROUPS",
    "DEFAULT_FAMILY", "DEFAULT_MODE", "themeFamily", "resolveFamilyId", "resolveMode", "resolveModeChoice"]) {
    assert.equal(typeof globalThis[gone], "undefined");
  }
});

test("resolver · jen automatika poslouchá systém", () => {
  assert.ok(isSystemAware("signature-auto"));
  assert.equal(resolveAppearancePreset("signature-auto", false).id, "signature-day");
  assert.equal(resolveAppearancePreset("signature-auto", true).id, "signature-night");
  for (const id of FIXED_PRESET_IDS) {
    assert.ok(!isSystemAware(id), `${id} nesmí poslouchat systém`);
    assert.equal(resolveAppearancePreset(id, false).id, id);
    assert.equal(resolveAppearancePreset(id, true).id, id, `${id} se změnil, když systém přepnul na noc`);
    assert.equal(resolveTheme(id, false), resolveTheme(id, true), `${id} vrátil jinou paletu podle systému`);
  }
});

test("neznámé id nikdy nespadne", () => {
  assert.equal(resolvePresetId("nic"), DEFAULT_PRESET);
  assert.equal(resolvePresetId(undefined), DEFAULT_PRESET);
  assert.equal(appearancePreset("nic").id, DEFAULT_PRESET);
  assert.equal(resolveAppearancePreset("nic", true).id, "signature-night");
  assert.equal(resolveTheme(null, false).bg, resolveTheme("signature-day", false).bg);
});

test("každá vyřešená paleta má všechny role a je zmrazená", () => {
  for (const id of FIXED_PRESET_IDS) {
    const t = resolveTheme(id, false);
    assert.ok(Object.isFrozen(t), `${id} není zmrazená`);
    for (const r of ROLES) assert.ok(t[r] !== undefined, `${id} nemá roli ${r}`);
    assert.equal(t.brandCopper, BRAND.copper, `${id} přebarvil značku`);
    assert.equal(t.brandLinen, BRAND.linen);
    assert.equal(t.brandForest, BRAND.forest);
    assert.equal(t.atlasFrame, BRAND.linen, `${id} tónuje plát Movement Atlasu`);
    assert.equal(t.polarity, t.mode);
    assert.equal(t.mode, appearancePreset(id).polarity);
  }
});

test("náhled ukazuje kus rozhraní, ne dva čtverce", () => {
  const need = ["background", "navigation", "surface", "card", "documentSurface",
    "text", "textMuted", "heading", "border", "accent", "onAccent", "success", "error"];
  for (const id of FIXED_PRESET_IDS) {
    const pv = previewTokens(id);
    for (const k of need) assert.ok(pv[k], `${id}: náhled nemá ${k}`);
  }
  const auto = previewTokens("signature-auto");
  assert.ok(auto.light && auto.dark, "automatika má náhled rozdělený na den a noc");
  assert.equal(auto.light.background, resolveTheme("signature-day", false).background);
  assert.equal(auto.dark.background, resolveTheme("signature-night", false).background);
});

test("barva prohlížeče, atributy dokumentu a mapa polí sedí na paletu", () => {
  for (const id of FIXED_PRESET_IDS) {
    assert.equal(pwaThemeColor(id, false), resolveTheme(id, false).background, `${id}: theme-color není pole`);
    assert.equal(PRESET_FIELDS[id], resolveTheme(id, false).background, `${id}: mapa polí se rozešla`);
    assert.deepEqual(documentThemeAttrs(id, false), { "data-appearance": id, "data-color-mode": appearancePreset(id).polarity });
  }
  assert.deepEqual(documentThemeAttrs("signature-auto", true), { "data-appearance": "signature-night", "data-color-mode": "dark" });
  assert.equal(Object.keys(PRESET_FIELDS).length, 8, "mapa polí zná jiný počet vzhledů než rejstřík");
  assert.equal(presetPolarity("signature-auto", true), "dark");
  assert.equal(presetPolarity("mulberry-paper", true), "light");
});

test("stav není nikdy jen barva", () => {
  for (const role of ["success", "warning", "error", "info", "neutral"]) {
    assert.ok(STATUS_CARRIERS[role].glyph, role + " nemá znak");
    assert.ok(STATUS_CARRIERS[role].shape, role + " nemá tvar");
  }
  for (const tone of Object.keys(TONE_ROLES)) {
    const st = toneStyle(tone, "slate-clay");
    assert.ok(st.carrier && st.carrier.glyph, tone + " nenese znak");
  }
  assert.equal(toneStyle("neznámý", "signature-day").role, "neutral");
  // statusPalette bere id vzhledu i holou polaritu (starší volání)
  assert.equal(statusPalette("light").successFg, FUNCTIONAL.light.successFg);
  assert.equal(statusPalette("mulberry-paper").successFg, FUNCTIONAL.light.successFg);
  assert.notEqual(statusPalette("slate-clay").successFg, statusPalette("signature-day").successFg,
    "vzhled, který si stavy ladí, je musí opravdu mít vlastní");
});

test("datová paleta má šest sérií a nebarevný nosič", () => {
  for (const id of FIXED_PRESET_IDS) {
    const cp = chartPalette(id);
    assert.equal(cp.series.length, 6, `${id}: jiný počet sérií`);
    assert.equal(cp.patterns.length, 6);
    assert.equal(new Set(cp.series).size, 6, `${id}: dvě série mají stejnou barvu`);
    for (const p of cp.patterns) assert.ok(p.dash && p.marker);
  }
  assert.deepEqual([...chartPalette("light").series], [...CHART.light.series]);
  assert.equal(CHART_PATTERNS.length, 6);
});

test("dokument pro tisk a PDF nikdy nesleduje volbu", () => {
  assert.equal(DOCUMENT_THEME, resolveTheme("signature-day", false));
  assert.equal(DOCUMENT_THEME.bg, BRAND.linen);
});

test("migrace · všechny tři generace uložené volby", () => {
  const v3 = (preset) => JSON.stringify({ version: 3, preset });
  const v2 = (family, mode) => JSON.stringify({ version: 2, family, mode });
  assert.equal(migrateLegacyAppearance(v3("smoke-spice"), null).preset, "smoke-spice");
  assert.equal(migrateLegacyAppearance(v2("signature", "system"), null).preset, "signature-auto");
  assert.equal(migrateLegacyAppearance(v2("signature", "light"), null).preset, "signature-day");
  assert.equal(migrateLegacyAppearance(v2("signature", "dark"), null).preset, "signature-night");
  assert.equal(migrateLegacyAppearance(v2("river-mist", "light"), null).preset, "river-night");
  assert.equal(migrateLegacyAppearance(v2("river-mist", "dark"), null).preset, "river-night");
  assert.equal(migrateLegacyAppearance(v2("teal-parchment", "light"), null).preset, "teal-night");
  assert.equal(migrateLegacyAppearance(v2("mulberry-paper", "dark"), null).preset, "mulberry-paper");
  assert.equal(migrateLegacyAppearance(v2("atlantic-sky", "dark"), null).preset, "slate-clay");
  assert.equal(migrateLegacyAppearance(v2("clay-alabaster", "light"), null).preset, "sand-earth");
  assert.equal(migrateLegacyAppearance(v2("olive-gold", "dark"), null).preset, "sand-earth");
  assert.equal(migrateLegacyAppearance(null, "light").preset, "signature-day");
  assert.equal(migrateLegacyAppearance(null, "dark").preset, "signature-night");
  assert.equal(migrateLegacyAppearance(null, "system").preset, "signature-auto");
  // nesmysl a prázdno končí na automatice, ne na výjimce
  assert.equal(migrateLegacyAppearance("{rozbité", null).preset, DEFAULT_PRESET);
  assert.equal(migrateLegacyAppearance(v2("neznámá", "dark"), null).preset, DEFAULT_PRESET);
  assert.equal(migrateLegacyAppearance(null, null).preset, DEFAULT_PRESET);
  assert.equal(migrateLegacyAppearance(v3("neexistuje"), null).preset, DEFAULT_PRESET);
});

test("migrace je idempotentní a verzovaná", () => {
  for (const id of ORDER) {
    const once = migrateLegacyAppearance(JSON.stringify({ version: 2, family: "olive-gold", mode: "light" }), null);
    const twice = migrateLegacyAppearance(JSON.stringify(once), null);
    const thrice = normalizeAppearance(twice);
    assert.equal(once.preset, twice.preset);
    assert.equal(twice.preset, thrice.preset);
    assert.equal(thrice.version, APPEARANCE_VERSION);
    const direct = normalizeAppearance({ preset: id });
    assert.equal(normalizeAppearance(direct).preset, direct.preset);
  }
  assert.equal(APPEARANCE_VERSION, 3);
  assert.equal(signatureAppearance().preset, DEFAULT_PRESET);
  assert.equal(presetFromFamily("signature", "dark"), "signature-night");
  assert.equal(presetFromFamily("nic", "dark"), DEFAULT_PRESET);
});

test("štítky drží význam ve všech vzhledech", () => {
  for (const id of FIXED_PRESET_IDS) {
    const tg = makeTagsFor(id, false);
    assert.ok(tg.moss && tg.slate && tg.burgundy, `${id}: chybí tón`);
    for (const [alias, tone] of Object.entries(TAG_ALIAS)) {
      assert.equal(tg[alias].fg, tg[tone] ? tg[tone].fg : tg[alias].fg, `${id}: starý klíč ${alias} přestal být alias`);
    }
  }
  assert.equal(makeThemeFor("signature-auto", true), resolveTheme("signature-night", false));
  assert.equal(makeTagsFor("signature-auto", true), makeTagsFor("signature-night", false));
});
