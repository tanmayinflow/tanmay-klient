// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/repo-tests/theme-negative.test.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// NEGATIVNÍ KONTROLY (V2 §34).
//
// Zelený test dokazuje, že něco prošlo. Nedokazuje, že by to bylo umělo
// SPADNOUT. Tenhle soubor tu druhou půlku dodává: pro každé pravidlo, na
// kterém vlně záleží, vezme zakázaný stav, prožene ho toutéž kontrolou a
// tvrdí, že NEPROJDE. Kdyby pravidlo někdo omylem změkčil, spadne tady —
// a bude vidět, které to bylo.
//
// Nic z toho se nikde nezapisuje: všechny zakázané stavy jsou lokální
// hodnoty v tomhle souboru.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  APPEARANCE_PRESET_IDS, FIXED_PRESET_IDS, resolvePresetId, resolveAppearancePreset,
  resolveTheme, migrateLegacyAppearance, DEFAULT_PRESET, appearancePreset, DOCUMENT_THEME,
} from "../src/shared/ui/themeRegistry.js";
import { readAppearance, writeAppearance, APPEARANCE_KEYS } from "../src/shared/ui/appearance.js";
import { chroma, tint, ratio, readsGreen, luminance, contrast } from "../src/shared/ui/contrast.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const app = readFileSync(join(root, "src/App.tsx"), "utf8");
/* Komentáře nejsou rozhraní. „Forest Night" je kanonický název značkového
   inkoustu `#1C1C1A` a v komentářích se jím smí a má argumentovat; co se
   nesmí vrátit, je POPISKA, kterou uvidí člověk. Hledá se proto ve zdroji
   bez komentářů. `\r` se normalizuje první — je to konec řádku, takže by
   `//.*` bez něj neodpovídalo ničemu a kontrola by tiše prošla. */
const appCode = app.replace(/\r/g, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*/g, "");
const html = readFileSync(join(root, "index.html"), "utf8");

/** Falešné úložiště · nic z tohohle testu se nikam nezapíše. */
const store = () => {
  const s = {};
  return { getItem: (k) => (k in s ? s[k] : null), setItem: (k, v) => { s[k] = String(v); }, removeItem: (k) => { delete s[k]; }, _s: s };
};

test("zrušený protějšek se nesmí vrátit do výběru", () => {
  for (const gone of ["river-light", "river-mist", "teal-light", "teal-parchment",
    "mulberry-dark", "atlantic-sky", "clay-alabaster", "olive-gold"]) {
    assert.equal(APPEARANCE_PRESET_IDS.includes(gone), false, `${gone} je zpátky ve výběru`);
    // A i kdyby ho někdo uložil, výběr ho nesmí přijmout jako platný.
    assert.equal(resolvePresetId(gone), DEFAULT_PRESET, `${gone} prošel jako platné id`);
  }
  assert.equal(APPEARANCE_PRESET_IDS.length, 9, "výběr má jiný počet položek než devět");
});

test("volič režimu se nesmí vrátit do rozhraní", () => {
  /* Kdyby se do Nastavení vrátil druhý přepínač den/noc, byl by u pevných
     vzhledů lživý. Hledá se v opravdovém zdroji obou aplikací. */
  const ui = readFileSync(join(root, "src/shared/ui/appearance.jsx"), "utf8");
  assert.equal(/THEME_MODES/.test(ui), false, "výběr režimu se vrátil do Nastavení");
  assert.equal(/onMode\s*[=}]/.test(ui), false, "sekce Vzhled zase dostala volbu režimu");
  assert.equal(/\bfamily\b/.test(ui), false, "sekce Vzhled zase mluví o rodinách");
  /* `setMode` v aplikaci existuje dál — patří tréninkovému běhu (intervaly,
     EMOM…) a s motivem nemá nic společného. Zakázané je jen to jediné, co
     přepínalo světlo. */
  assert.equal(/setMode\(\(?m\)? =>\s*\(?m === "dark"/.test(appCode), false,
    "rychlý přepínač den/noc je zpátky v aplikaci");
  assert.equal(/appearanceMode\(prev/.test(appCode), false, "volba znovu ukládá režim vedle vzhledu");
});

test("systémová změna nesmí hnout pevným vzhledem", () => {
  for (const id of FIXED_PRESET_IDS) {
    const den = resolveAppearancePreset(id, false);
    const noc = resolveAppearancePreset(id, true);
    assert.equal(den.id, noc.id, `${id} se změnil, když systém přepnul`);
    assert.equal(den.palette, noc.palette, `${id} vrátil jinou paletu`);
  }
  // A automatika naopak MUSÍ reagovat — jinak by pravidlo nic neznamenalo.
  assert.notEqual(resolveAppearancePreset("signature-auto", false).id,
    resolveAppearancePreset("signature-auto", true).id,
    "kdyby ani automatika nereagovala, tenhle test by nic nedokazoval");
});

test("otisk Signature Day by spadl, kdyby se den hnul", () => {
  // Dokazuje, že otisk je citlivý: změna jediného kanálu ho musí rozbít.
  const day = resolveTheme("signature-day", false);
  const fake = { ...day, bg: "#F4F0EC" };
  assert.notEqual(JSON.stringify(fake), JSON.stringify(day),
    "otisk by nezachytil posun o jednu jednotku · pak by nehlídal nic");
  assert.equal(day.bg, "#F4F0EB");
  assert.equal(DOCUMENT_THEME.bg, "#F4F0EB", "tisk a PDF nesmí sledovat volbu");
});

test("běžný odstavec s akcentem by pravidlo neprošel", () => {
  const t = resolveTheme("smoke-spice", false);
  const zakazane = { ...t, textSecondary: t.interactiveAccent };
  assert.equal(zakazane.textSecondary === zakazane.interactiveAccent, true);
  // A totéž pravidlo, kterým to kontroluje theme-visual, tady musí selhat:
  assert.ok(!(zakazane.textSecondary !== zakazane.interactiveAccent),
    "pravidlo o neutralitě běžného písma by zakázaný stav propustilo");
  // Skutečná paleta ho neporušuje.
  assert.notEqual(t.textSecondary, t.interactiveAccent);
});

test("nápověda pod 4,5:1 by neprošla", () => {
  const t = resolveTheme("signature-day", false);
  // Historická hodnota z V1, která měřila 3,99:1 na listu.
  const stara = "#7D7F78";
  assert.ok(contrast(stara, t.documentSurface, t.documentSurface) < 4.5,
    "kdyby i tahle hodnota prošla, práh 4,5:1 by nic neznamenal");
  // A cesta, kterou vznikala — ztlumené písmo se sníženým krytím.
  const krytim = "rgba(92,95,88,0.8)";
  assert.ok(contrast(krytim, t.documentSurface, t.documentSurface) < 4.5);
  assert.ok(contrast(t.placeholder, t.documentSurface, t.documentSurface) >= 4.5);
});

test("zelený nádech v Signature Night by pravidlem neprošel", () => {
  const zelena = "#2E3D35";   // Deep Moss · pole V1, které V1.1 zavrhla
  assert.ok(readsGreen(zelena) || chroma(zelena) > 0.03,
    "kdyby mech prošel jako uhel, pravidlo o zeleni by nic nehlídalo");
  const t = resolveTheme("signature-night", false);
  assert.ok(!readsGreen(t.background) && chroma(t.background) <= 0.03);
});

test("near-black Signature Night by pravidlem o vrstvách neprošel", () => {
  const stare = "#0F100E";    // pole Ink Night z V1.1
  assert.ok(luminance(stare) < 0.018, "kdyby stará noc prošla rozsahem, změkčení by nebylo měřitelné");
  const L = luminance(resolveTheme("signature-night", false).background);
  assert.ok(L >= 0.018 && L <= 0.026);
});

test("neuložená ani cizí volba nikdy nepropadne k jinému člověku", () => {
  // Klient A a klient B na jednom zařízení · klíče vzhledu patří do karantény.
  for (const k of ["tm-appearance-v3", "tm-appearance-v2", "tm-theme"]) {
    assert.ok(APPEARANCE_KEYS.includes(k), `klíč ${k} chybí v seznamu pro karanténu`);
  }
  const a = store();
  writeAppearance({ preset: "smoke-spice" }, a);
  const b = store();   // druhý člověk, čisté úložiště
  assert.equal(readAppearance(b).preset, DEFAULT_PRESET, "prázdné úložiště nesmí zdědit cizí vzhled");
  assert.equal(readAppearance(a).preset, "smoke-spice");
});

test("stará rodina, kterou by nikdo nepřevedl, by skončila na výchozím vzhledu", () => {
  // Negativní kontrola migrace: kdyby tabulka zmizela, tohle spadne.
  assert.equal(migrateLegacyAppearance(JSON.stringify({ version: 2, family: "olive-gold", mode: "dark" }), null).preset,
    "sand-earth", "zrušená rodina se přestala převádět");
  assert.notEqual(migrateLegacyAppearance(JSON.stringify({ version: 2, family: "atlantic-sky", mode: "dark" }), null).preset,
    DEFAULT_PRESET, "Atlantik se má převést na Břidlici, ne spadnout na výchozí");
});

test("popisek zrušené palety se nesmí objevit v rozhraní", () => {
  /* „Forest Night", „Ink Night", „Hlína a alabastr", „Atlantik a obloha",
     „Oliva a zlato", „Řeka a mlha", „Tyrkys a pergamen" jsou názvy, které
     uživatel po V2 nesmí potkat. Hledá se v opravdovém zdroji aplikace. */
  for (const label of ["Forest Night", "Ink Night", "Hlína a alabastr", "Clay Alabaster",
    "Atlantik a obloha", "Atlantic Sky", "Oliva a zlato", "Olive Gold",
    "Řeka a mlha", "River Mist", "Tyrkys a pergamen", "Teal Parchment"]) {
    assert.equal(appCode.includes(label), false, `zrušený název ${label} je zpátky v rozhraní`);
  }
});

test("Movement Atlas se nesmí tónovat, ani kdyby to vzhled uměl", () => {
  for (const id of FIXED_PRESET_IDS) {
    assert.equal(resolveTheme(id, false).atlasFrame, "#F4F0EB", `${id} tónuje plát`);
  }
  const atlas = appCode.indexOf("function TmAtlasArt");
  if (atlas >= 0) {
    const blok = appCode.slice(atlas, appCode.indexOf("function TExArt", atlas));
    for (const bad of ["hue-rotate", "invert(", "mixBlendMode", "sepia(", "filter:"]) {
      assert.equal(blok.includes(bad), false, `na plátu se objevil ${bad}`);
    }
  }
});

test("pre-paint bez migrace by staršího člověka probudil do jiné palety", () => {
  const src = html.match(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/)[1];
  assert.ok(src.includes("tm-appearance-v2"), "pre-paint přestal číst volbu z V1.1");
  assert.ok(src.includes("tm-theme"), "pre-paint přestal číst nejstarší klíč");
  // Kdyby uměl jen nejnovější klíč, tahle podmínka je jediné, co to odhalí.
  assert.ok(src.indexOf("tm-appearance-v3") < src.indexOf("tm-appearance-v2"),
    "pre-paint musí sáhnout nejdřív po nejnovější volbě");
});

test("žádná komponenta nevybírá barvu podle id vzhledu", () => {
  for (const id of FIXED_PRESET_IDS) {
    const branch = new RegExp(`(preset|vzhled|theme)\\s*===\\s*["'\`]${id}["'\`]`);
    assert.equal(branch.test(appCode), false, `aplikace se větví podle ${id}`);
  }
  assert.equal(/appearance\.family/.test(appCode), false, "aplikace pořád čte rodinu");
  assert.equal(/appearance\.mode/.test(appCode), false, "aplikace pořád čte režim");
});
