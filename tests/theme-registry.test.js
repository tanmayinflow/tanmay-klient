// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/repo-tests/theme-registry.test.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// Rejstřík motivů · kontrakt, bezpečný pád a migrace.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  THEME_FAMILIES, THEME_FAMILY_IDS, THEME_MODES, DEFAULT_FAMILY, DEFAULT_MODE,
  BRAND, FUNCTIONAL, CHART, CHART_PATTERNS, DOCUMENT_THEME, STATUS_CARRIERS, TONE_ROLES,
  themeFamily, resolveFamilyId, resolveMode, resolveModeChoice, resolveTheme,
  previewTokens, pwaThemeColor, documentThemeAttrs, statusPalette, chartPalette,
  migrateLegacyAppearance, normalizeAppearance, signatureAppearance, toneStyle,
} from "../src/shared/ui/themeRegistry.js";
import { makeTheme, makeThemeFor, makeTagsFor, THEME_TANMAY } from "../src/shared/ui/theme.js";
import {
  APPEARANCE_KEY, LEGACY_THEME_KEY, APPEARANCE_KEYS,
  readAppearance, writeAppearance, appearanceMode, appearanceField, applyDocumentTheme,
} from "../src/shared/ui/appearance.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const app = readFileSync(join(root, "src/App.tsx"), "utf8");
const sha = (t) => createHash("sha256").update(t).digest("hex");
// Soused stojí vedle jen v pracovním prostoru; Cloudflare i čistá místnost
// staví jeden repozitář sám o sobě, takže se tahle zkouška ptá, jestli tam je.
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const SOUSED = join(root, pkg.name === "tanmay-web" ? "../tanmay-klient" : "../tanmay-web");
const SOUSED_JE = existsSync(join(SOUSED, "src/shared/manifest.json"));

const ROLES = [
  "background", "navigation", "surface", "surfaceRaised", "surfaceMuted", "card",
  "documentSurface", "overlay", "scrim",
  "text", "textSecondary", "textMuted", "textDisabled", "placeholder", "placeholderStrong",
  "border", "borderStrong", "divider",
  "interactiveAccent", "interactiveAccentHover", "interactiveAccentPressed", "interactiveOnAccent",
  "selectionSurface", "selectionText", "focusRing", "link", "linkHover", "shadow",
  "brandCopper", "brandLinen", "brandForest", "atlasFrame", "atlasBorder",
  "successFg", "successBg", "warningFg", "warningBg", "errorFg", "errorBg", "infoFg", "infoBg",
  "chart1", "chart2", "chart3", "chart4", "chart5", "chart6", "grid", "axis",
];

test("sedm rodin, Signature první a doporučená", () => {
  assert.equal(THEME_FAMILIES.length, 7, "po V1 je maximum sedm rodin");
  assert.equal(THEME_FAMILY_IDS.length, 7);
  assert.equal(THEME_FAMILIES[0].id, DEFAULT_FAMILY);
  assert.equal(THEME_FAMILIES[0].recommended, true);
  assert.equal(THEME_FAMILIES.filter((f) => f.recommended).length, 1, "doporučená je jen jedna");
  // Pořadí je podle šířky použitelnosti (V1.1 §7), ne podle zdrojových obrázků.
  assert.deepEqual(THEME_FAMILIES.map((f) => f.id), [
    "signature", "clay-alabaster", "river-mist", "atlantic-sky",
    "olive-gold", "mulberry-paper", "teal-parchment",
  ]);
  for (const f of THEME_FAMILIES) {
    assert.ok(f.labelCs && f.labelEn, f.id + " musí mít český i anglický název");
    assert.ok(Object.keys(f.anchors).length >= 2, f.id + " musí mít kotevní barvy");
  }
});

test("každá ze čtrnácti palet má úplný kontrakt rolí", () => {
  for (const f of THEME_FAMILIES) {
    for (const mode of ["light", "dark"]) {
      const t = f[mode];
      for (const role of ROLES) {
        assert.ok(t[role], `${f.id}/${mode} nemá roli ${role}`);
        assert.equal(typeof t[role], "string");
      }
      assert.equal(t.mode, mode);
    }
  }
});

test("starší API motivu drží tvar", () => {
  // Tisíce míst v obou aplikacích čtou `t.bg`, `t.card`, `t.textMuted`.
  const legacy = ["bg", "bgSidebar", "text", "heading", "textSec", "textMuted", "accent",
    "accentInk", "onAccent", "sage", "sand", "inkSand", "danger", "info", "success", "warning",
    "border", "borderSoft", "card", "cardHover", "callout", "tableHead", "sheet", "sheetHover",
    "activeNav", "overlay", "shadow", "shadowLift", "shadowPop", "shadowSheet", "shadowDrag",
    "hero", "heroInk", "heroInkSoft", "heroLine"];
  for (const f of THEME_FAMILIES) for (const mode of ["light", "dark"]) {
    for (const k of legacy) assert.ok(f[mode][k], `${f.id}/${mode} ztratilo starší klíč ${k}`);
  }
  assert.equal(makeTheme("light"), THEME_TANMAY.light);
  assert.equal(makeTheme("dark"), THEME_TANMAY.dark);
  assert.equal(makeThemeFor("signature", "light"), THEME_TANMAY.light);
});

test("neznámá rodina ani rozbitá volba nezavře nikoho v rozbitém motivu", () => {
  assert.equal(resolveFamilyId("neexistuje"), DEFAULT_FAMILY);
  assert.equal(resolveFamilyId(undefined), DEFAULT_FAMILY);
  assert.equal(resolveFamilyId(null), DEFAULT_FAMILY);
  assert.equal(themeFamily("budoucí-rodina").id, DEFAULT_FAMILY);
  assert.equal(resolveModeChoice("zítra"), DEFAULT_MODE);
  assert.equal(resolveTheme("nic", "dark"), THEME_TANMAY.dark);
  assert.equal(makeTagsFor("nic", "dark"), makeTagsFor("signature", "dark"));
});

test("režim: system se řeší podle systému, light a dark ne", () => {
  assert.deepEqual([...THEME_MODES], ["system", "light", "dark"]);
  assert.equal(resolveMode("system", true), "dark");
  assert.equal(resolveMode("system", false), "light");
  assert.equal(resolveMode("light", true), "light");
  assert.equal(resolveMode("dark", false), "dark");
  assert.equal(resolveMode("nesmysl", true), DEFAULT_MODE);
});

test("migrace ze starého klíče nezmění nikomu paletu", () => {
  assert.deepEqual(migrateLegacyAppearance(null, "light"), { version: 2, family: "signature", mode: "light" });
  assert.deepEqual(migrateLegacyAppearance(null, "dark"), { version: 2, family: "signature", mode: "dark" });
  assert.deepEqual(migrateLegacyAppearance(null, "system"), { version: 2, family: "signature", mode: "system" });
  // chybějící volba → současný výchozí stav, tedy den
  assert.deepEqual(migrateLegacyAppearance(null, null), { version: 2, family: "signature", mode: DEFAULT_MODE });
  // Rozbitý JSON není důvod probudit člověka do jiné poloviny dne: nová volba
  // se zahodí, ale starý klíč, který na tomtéž zařízení pořád leží, se přečte.
  assert.deepEqual(migrateLegacyAppearance("{tohle není json", "dark"), { version: 2, family: "signature", mode: "dark" });
  // Rozbitý JSON a žádný starý klíč → výchozí stav.
  assert.deepEqual(migrateLegacyAppearance("{tohle není json", null), { version: 2, family: "signature", mode: DEFAULT_MODE });
  assert.deepEqual(migrateLegacyAppearance("[]", null), { version: 2, family: "signature", mode: DEFAULT_MODE });
  assert.deepEqual(migrateLegacyAppearance('{"version":2,"family":"neznámá","mode":"dark"}', null), { version: 2, family: "signature", mode: "dark" });
  assert.deepEqual(migrateLegacyAppearance('{"version":2,"family":"teal-parchment","mode":"zítra"}', null), { version: 2, family: "teal-parchment", mode: DEFAULT_MODE });
  // budoucí verze se čte tolerantně, ne pádem
  assert.deepEqual(migrateLegacyAppearance('{"version":9,"family":"river-mist","mode":"dark"}', null), { version: 2, family: "river-mist", mode: "dark" });
  assert.deepEqual(normalizeAppearance({}), { version: 2, family: "signature", mode: DEFAULT_MODE });
  assert.deepEqual(signatureAppearance(), { version: 2, family: "signature", mode: DEFAULT_MODE });
});

test("úložiště: čtení, zápis a nedostupné úložiště", () => {
  const mem = () => { const d = {}; return { d, getItem: (k) => (k in d ? d[k] : null), setItem: (k, v) => { d[k] = v; } }; };
  const s = mem();
  s.d[LEGACY_THEME_KEY] = "dark";
  assert.deepEqual(readAppearance(s), { version: 2, family: "signature", mode: "dark" });
  writeAppearance({ family: "olive-gold", mode: "system" }, "dark", s);
  assert.equal(JSON.parse(s.d[APPEARANCE_KEY]).family, "olive-gold");
  assert.equal(s.d[LEGACY_THEME_KEY], "dark", "starý klíč drží vyřešený režim pro starší build");
  assert.deepEqual(readAppearance(s), { version: 2, family: "olive-gold", mode: "system" });

  const brokenSet = { getItem: () => { throw new Error("private mode"); }, setItem: () => { throw new Error("quota"); } };
  assert.deepEqual(readAppearance(brokenSet), { version: 2, family: "signature", mode: DEFAULT_MODE });
  assert.doesNotThrow(() => writeAppearance({ family: "river-mist", mode: "dark" }, "dark", brokenSet));
  assert.deepEqual(readAppearance(null), { version: 2, family: "signature", mode: DEFAULT_MODE });
  assert.ok(APPEARANCE_KEYS.includes(APPEARANCE_KEY) && APPEARANCE_KEYS.includes(LEGACY_THEME_KEY));
});

test("vyřešený režim a pole pro pre-paint", () => {
  assert.equal(appearanceMode({ mode: "system" }, true), "dark");
  assert.equal(appearanceMode({ mode: "system" }, false), "light");
  assert.equal(appearanceMode({ mode: "dark" }, false), "dark");
  for (const f of THEME_FAMILIES) for (const m of ["light", "dark"]) {
    assert.equal(appearanceField(f.id, m), f[m].background);
    assert.equal(pwaThemeColor(f.id, m), f[m].background);
  }
  assert.deepEqual(documentThemeAttrs("olive-gold", "dark"), { "data-theme-family": "olive-gold", "data-color-mode": "dark" });
  assert.deepEqual(documentThemeAttrs("nic", "nic"), { "data-theme-family": "signature", "data-color-mode": "light" });
  assert.doesNotThrow(() => applyDocumentTheme("signature", "dark", null));
});

test("náhled je kus rozhraní, ne dva čtverce", () => {
  for (const f of THEME_FAMILIES) for (const m of ["light", "dark"]) {
    const p = previewTokens(f.id, m);
    for (const k of ["background", "surface", "card", "documentSurface", "text", "textMuted", "heading", "border", "accent", "onAccent"]) {
      assert.ok(p[k], `${f.id}/${m} náhled nemá ${k}`);
    }
    assert.equal(p.background, f[m].background);
  }
});

test("značka a interakční barva jsou dvě různé věci", () => {
  assert.equal(BRAND.copper, "#B87333");
  for (const f of THEME_FAMILIES) for (const m of ["light", "dark"]) {
    assert.equal(f[m].brandCopper, "#B87333", "Copper je vždycky Copper");
    assert.equal(f[m].brandLinen, "#F4F0EB");
    assert.equal(f[m].brandForest, "#1C1C1A");
    assert.equal(f[m].atlasFrame, "#F4F0EB", "plát Atlasu leží na lněném poli v každém motivu");
    if (f.id !== "signature") {
      assert.notEqual(f[m].interactiveAccent, BRAND.copper,
        f.id + ": měď nesmí být zároveň interakční barva jiné rodiny");
    }
  }
});

test("funkční barvy se neodvozují z kotev rodiny", () => {
  for (const m of ["light", "dark"]) {
    const pal = statusPalette(m);
    for (const f of THEME_FAMILIES) {
      for (const role of ["success", "warning", "error", "info"]) {
        assert.equal(f[m][role + "Fg"], pal[role + "Fg"], `${f.id}/${m}: ${role} musí znamenat totéž ve všech motivech`);
        assert.equal(f[m][role + "Bg"], pal[role + "Bg"]);
      }
    }
    assert.equal(FUNCTIONAL[m].errorFg, pal.errorFg);
  }
});

test("datová paleta je společná a nese nebarevný nosič", () => {
  for (const m of ["light", "dark"]) {
    const cp = chartPalette(m);
    assert.equal(cp.series.length, 6);
    assert.equal(cp.patterns.length, 6);
    for (const p of CHART_PATTERNS) assert.ok(p.dash && p.marker);
    for (const f of THEME_FAMILIES) {
      CHART[m].series.forEach((c, i) => assert.equal(f[m]["chart" + (i + 1)], c,
        `${f.id}/${m}: série ${i + 1} musí znamenat totéž ve všech motivech`));
    }
  }
});

test("stav má vždycky znak a roli, ne jen barvu", () => {
  for (const role of ["success", "warning", "error", "info", "neutral"]) {
    assert.ok(STATUS_CARRIERS[role].glyph, role + " nemá znak");
    assert.ok(STATUS_CARRIERS[role].shape, role + " nemá tvar");
  }
  for (const tone of Object.keys(TONE_ROLES)) {
    const st = toneStyle(tone, "light");
    assert.ok(st.carrier && st.carrier.glyph, tone + " nemá nosič");
  }
  assert.equal(toneStyle("neznámý", "light").role, "neutral");
});

test("tisk a export mají kanonický dokumentový motiv, ne zvolený", () => {
  assert.equal(DOCUMENT_THEME, resolveTheme("signature", "light"));
  assert.equal(DOCUMENT_THEME.background, "#F4F0EB");
});

test("v aplikaci není ani jedna podmínka na jméno rodiny", () => {
  // Tohle je celý smysl rejstříku. Komponenta smí znát roli, ne motiv.
  for (const id of THEME_FAMILY_IDS) {
    if (id === "signature") continue;   // migrace a reset ho jmenují záměrně
    const inCondition = new RegExp(`(===|!==|==)\\s*["'\`]${id}["'\`]`);
    assert.equal(inCondition.test(app), false, `App.tsx se ptá na motiv ${id}`);
  }
  assert.equal(/theme\s*===\s*["']/.test(app), false, "žádné větvení podle motivu");
});


test("registr motivů je v obou aplikacích bajt po bajtu týž", { skip: SOUSED_JE ? false : "sousední repozitář tu není" }, () => {
  // `shared:check` to hlídá proti kanonickému zdroji; tohle se ptá přímo obou
  // aplikací navzájem. Kdyby se jedna z nich „opravila" ručně, tady to spadne
  // i bez pracovního prostoru.
  for (const rel of ["src/shared/ui/themeRegistry.js", "src/shared/ui/theme.js",
    "src/shared/ui/appearance.js", "src/shared/ui/appearance.jsx", "src/shared/ui/contrast.js",
    "src/shared/ui/tokens.js"]) {
    const mine = readFileSync(join(root, rel), "utf8").replace(/\r\n/g, "\n");
    const theirs = readFileSync(join(SOUSED, rel), "utf8").replace(/\r\n/g, "\n");
    assert.equal(sha(mine), sha(theirs), rel + " se mezi aplikacemi rozešel");
  }
});

test("jméno Forest Night není v uživatelském rozhraní", () => {
  // Značkově je Forest Night pořád Forest Night. V produktu se noc jmenuje
  // Noc / Night a rodina Signature — jméno rampu se v aplikaci neukazuje.
  // Komentáře ve zdroji se počítat nemají, ty o té historii mluvit smí.
  // `\r` je terminátor řádku, takže na CRLF souboru `//.*$` nechytí nic —
  // a celý test by tiše prošel na zdroji, který slovo nese. Nejdřív se
  // konce řádků srovnají, teprve pak se škrtají komentáře.
  const bezKomentaru = app.replace(/\r/g, "").replace(/\/\*[\s\S]*?\*\//g, "")
    .split("\n").map((l) => l.replace(/(^|[^:])\/\/.*$/, "$1")).join("\n");
  assert.equal(/Forest/.test(bezKomentaru), false,
    "slovo Forest zůstalo v kódu, který se vykresluje · rychlý přepínač říká Den / Noc");
  // A totéž ve sdíleném oddílu Nastavení.
  const vzhled = readFileSync(join(root, "src/shared/ui/appearance.jsx"), "utf8");
  assert.equal(/Forest/.test(vzhled), false, "oddíl Vzhled nesmí jmenovat Forest Night");
});
