// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/repo-tests/theme-negative.test.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// NEGATIVNÍ KONTROLY (V3 §29).
//
// Zelený test dokazuje, že něco prošlo. Nedokazuje, že by to bylo umělo
// SPADNOUT. Tenhle soubor bere zakázané stavy — orámovanou Signature, hlínu
// v odstavci, granátové písmo na břidlici, gradient v rámu, cizí volbu
// v cizím úložišti — a tvrdí o každém, že neprojde.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  APPEARANCE_PRESET_IDS, FIXED_PRESET_IDS, OPTIONAL_PRESET_IDS, SIGNATURE_PRESET_IDS,
  resolvePresetId, resolveAppearancePreset, resolveTheme, frameChrome,
  migrateLegacyAppearance, DEFAULT_PRESET, DOCUMENT_THEME, appearancePreset,
} from "../src/shared/ui/themeRegistry.js";
import { readAppearance, writeAppearance, APPEARANCE_KEYS, selectAppearance } from "../src/shared/ui/appearance.js";
import { frameGrammarCss } from "../src/shared/ui/tokens.js";
import { contrast, readsGreen, chroma } from "../src/shared/ui/contrast.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const app = readFileSync(join(root, "src/App.tsx"), "utf8");
const appCode = app.replace(/\r/g, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*/g, "");
const ui = readFileSync(join(root, "src/shared/ui/appearance.jsx"), "utf8");

const store = () => {
  const s = {};
  return { getItem: (k) => (k in s ? s[k] : null), setItem: (k, v) => { s[k] = String(v); }, _s: s };
};

test("Signature nesmí dostat rám", () => {
  for (const id of SIGNATURE_PRESET_IDS) {
    assert.equal(frameChrome(id, false).frameGrammar, "none", id);
    assert.equal(frameChrome(id, true).frameGrammar, "none", id);
  }
  const css = frameGrammarCss();
  // Kdyby existovalo pravidlo pro „none", Signature by rám dostala.
  assert.ok(!css.includes('data-frame-grammar="none"'));
  // A kdyby existoval nestřežený selektor, dostal by ho každý.
  for (const sel of css.match(/^[^\s@/][^{]*\{/gm) || []) {
    assert.ok(sel.includes("data-frame-grammar"), "nestřežený selektor: " + sel.slice(0, 70));
  }
});

test("rám nesmí měnit geometrii ani chování", () => {
  const css = frameGrammarCss();
  for (const bad of ["padding", "margin:", "margin-", "width: 100", "min-height", "max-height", "display:", "overflow", "transform", "font-size"]) {
    assert.ok(!css.includes(bad), `rámové CSS nese ${bad}`);
  }
  // Pseudo-prvky konzol mají rozměry — smí, protože jsou absolutně
  // pozicované a pointer-events: none; nic jiného rozměry mít nesmí.
  const nonPseudo = css.split("}").filter((r) => r.includes("{") && !r.includes("::before") && !r.includes("::after"));
  for (const r of nonPseudo) {
    assert.ok(!/(^|[^-])width\s*:|(^|[^-])height\s*:/.test(r), "rozměr mimo pseudo-prvek: " + r.trim().slice(0, 70));
  }
  assert.ok(!/gradient|blur\(|url\(/i.test(css), "gradient, rozostření ani obrázek do rámu nepatří");
});

test("hlína, monument-hlína a oliva nesmí nést běžné písmo", () => {
  const t1 = resolveTheme("slate-clay-pantone", false);
  const t2 = resolveTheme("monument-clay", false);
  const t3 = resolveTheme("sand-burnt-earth", false);
  for (const role of ["text", "textSecondary", "textMuted", "placeholder"]) {
    assert.ok(!String(t1[role]).toUpperCase().startsWith("#A57051"), `slate.${role}`);
    assert.ok(!String(t2[role]).toUpperCase().startsWith("#9A694E"), `monument.${role}`);
    assert.ok(!String(t3[role]).toUpperCase().startsWith("#6B6751"), `sand.${role}`);
  }
  // A že by hlína na teplé šedi ani neprošla — proto je to pravidlo:
  assert.ok(contrast("#A57051", "#DBD6D1", "#DBD6D1") < 4.5, "kdyby hlína procházela, pravidlo by nic nehlídalo");
  assert.ok(contrast("#6B6751", "#D3C7AD", "#D3C7AD") < 4.5, "kdyby oliva procházela, pravidlo by nic nehlídalo");
});

test("granátové písmo na břidlici by neprošlo — a nikde není", () => {
  assert.ok(contrast("#6E2C29", "#364857", "#364857") < 4.5, "granát na břidlici nedává ani 4,5");
  const t = resolveTheme("garnet-slate", false);
  // Všechna písma na navigaci (břidlice) jsou krém:
  for (const role of ["navText", "navTextSec", "navHeading", "navAccent"]) {
    // krém plný, nebo krém s krytím — nikdy granát
    const v = String(t[role]).toUpperCase();
    assert.ok(v.indexOf("#F7DEC1") === 0 || v.indexOf("RGBA(247,222,193") === 0 || v.indexOf("RGBA(247, 222, 193") === 0,
      `${role} na břidlici musí být krém (${v})`);
  }
  // A na granátové akci je krém:
  assert.equal(t.interactiveOnAccent, "#F7DEC1");
});

test("americano nesmí psát hnědým písmem pod 4,5", () => {
  assert.ok(contrast("#867C70", "#303031", "#303031") < 4.5, "roast na brew nedává 4,5 — proto servisní len");
  const t = resolveTheme("americano-chai", false);
  assert.equal(t.text, "#F4F0EB");
});

test("systémová změna nesmí hnout volitelnou paletou", () => {
  for (const id of OPTIONAL_PRESET_IDS) {
    assert.equal(resolveAppearancePreset(id, false).palette, resolveAppearancePreset(id, true).palette, id);
  }
  assert.notEqual(resolveAppearancePreset("signature-auto", false).id, resolveAppearancePreset("signature-auto", true).id,
    "kdyby ani automatika nereagovala, test by nic nedokazoval");
});

test("volič režimu ani přepínač rámů se nesmí vrátit", () => {
  assert.ok(!/THEME_MODES/.test(ui), "volič režimu je zpátky v Nastavení");
  assert.ok(!/onMode\s*[=}]/.test(ui), "sekce Vzhled zase dostala volbu režimu");
  assert.ok(!/rámy?\s*(on|off|zap|vyp)/i.test(ui), "přepínač rámů nesmí existovat");
  assert.ok(!/frameToggle|framesEnabled/.test(ui + appCode), "přepínač rámů nesmí existovat");
});

test("cizí volba nikdy nepropadne k jinému člověku", () => {
  for (const k of ["tm-appearance-v3", "tm-appearance-v2", "tm-theme"]) {
    assert.ok(APPEARANCE_KEYS.includes(k), k);
  }
  const a = store();
  writeAppearance(selectAppearance(readAppearance(a), "americano-chai"), a);
  const b = store();
  assert.equal(readAppearance(b).preset, DEFAULT_PRESET, "prázdné úložiště nesmí zdědit cizí paletu");
  assert.equal(readAppearance(a).preset, "americano-chai");
});

test("tisk a PDF nesmí zdědit volitelnou paletu", () => {
  assert.equal(DOCUMENT_THEME, resolveTheme("signature-day", false));
  assert.equal(DOCUMENT_THEME.bg, "#F4F0EB");
});

test("Movement Atlas nesmí dostat filtr ani rám palety", () => {
  for (const id of FIXED_PRESET_IDS) {
    assert.equal(resolveTheme(id, false).atlasFrame, "#F4F0EB", id);
  }
  const atlas = appCode.indexOf("function TmAtlasArt");
  if (atlas >= 0) {
    const blok = appCode.slice(atlas, appCode.indexOf("function TExArt", atlas));
    for (const bad of ["hue-rotate", "invert(", "mixBlendMode", "sepia(", "filter:", "data-frame-role"]) {
      assert.ok(!blok.includes(bad), `na plátu se objevil ${bad}`);
    }
  }
  assert.ok(!frameGrammarCss().includes("atlas"), "rám se nesmí přiblížit k plátu");
});

test("žádná komponenta nevybírá barvu podle id palety", () => {
  for (const id of OPTIONAL_PRESET_IDS) {
    const branch = new RegExp(`(preset|vzhled|theme)\\s*===\\s*["'\`]${id}["'\`]`);
    assert.ok(!branch.test(appCode), `aplikace se větví podle ${id}`);
  }
  assert.ok(!/appearance\.family/.test(appCode));
});

test("zrušený název se nesmí vrátit do rozhraní", () => {
  for (const label of ["Řeka v noci", "Tyrkys v noci", "Moruše a papír", "Kouř a koření",
    "Forest Night", "Ink Night", "River Night", "Teal Night", "Smoke Spice"]) {
    assert.ok(!appCode.includes(label), `zrušený název ${label} je zpátky`);
  }
});

test("stará volba, kterou by nikdo nepřevedl, končí na Signature", () => {
  assert.equal(migrateLegacyAppearance(JSON.stringify({ version: 3, preset: "uplne-nova" }), null).preset, DEFAULT_PRESET);
  assert.equal(migrateLegacyAppearance(JSON.stringify({ version: 2, family: "neznama", mode: "dark" }), null).preset, DEFAULT_PRESET);
});
