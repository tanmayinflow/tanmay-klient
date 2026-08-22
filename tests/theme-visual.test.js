// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/repo-tests/theme-visual.test.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// VIZUÁLNÍ PŘIJETÍ · kontrast je nutný, ale nestačí (V1.1 §10).
//
// Paleta může projít každým poměrem WCAG a přesto být na práci nepoužitelná:
// dlouhé čtení působí obarveně, hierarchie se slehne, karta splyne s polem,
// akcent je všude, noc je jeden sytý barevný blok. To jsou vizuální soudy —
// ale dají se změřit, a co se dá změřit, to se má hlídat testem, ne dojmem.
//
// Dvě míry, které tenhle soubor používá:
//
//   chroma(c)  max − min kanálu · „je ta plocha ještě neutrální?"
//   tint(c)    největší odchylka kanálu od průměru · „je to ještě inkoust,
//              nebo už barva?" Na rozdíl od chroma netrestá světlé barvy,
//              takže krémový len (0,10) projde a sytý tyrkys (0,21) ne.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { THEME_FAMILIES } from "../src/shared/ui/themeRegistry.js";
import { chroma, tint, ratio, luminance, hueDeg } from "../src/shared/ui/contrast.js";

const app = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "src/App.tsx"), "utf8");
const MODES = ["light", "dark"];
// Nejvyšší naměřený nádech běžného inkoustu je 0,106 (Tyrkys, noc). Nejnižší
// nádech rodinného akcentu je 0,064 (Řeka a mlha, den) — ten je ale záměrně
// skoro neutrální. Práh 0,12 odděluje inkoust od barvy a nechává obojí být.
const INK_TINT_MAX = 0.12;

test("běžný text zůstává neutrální ve všech čtrnácti paletách", () => {
  // V1.1 §3: dlouhý odstavec se nesází celý modře, tyrkysově, vínově ani olivově.
  const bad = [];
  for (const f of THEME_FAMILIES) for (const m of MODES) {
    const t = f[m];
    for (const k of ["text", "textSecondary", "textMuted", "placeholder", "placeholderStrong"]) {
      const v = tint(t[k]);
      if (v > INK_TINT_MAX) bad.push(`${f.id}/${m} ${k} = ${t[k]} · nádech ${v.toFixed(3)}`);
    }
  }
  assert.deepEqual(bad, [], bad.join("\n"));
});

test("nadpis smí nést rodinnou barvu · je to jediné běžné písmo, které smí", () => {
  // Kdyby nadpis přestal být rodinný, motiv by v textu nebyl vidět vůbec.
  for (const f of THEME_FAMILIES) {
    if (f.id === "signature") continue;   // Signature má vlastní zmrazený nadpis
    assert.ok(tint(f.light.heading) > tint(f.light.text),
      `${f.id}: světlý nadpis nenese rodinnou barvu`);
  }
});

test("dokumentová plocha je nejklidnější povrch rodiny", () => {
  // V1.1 §4: Deník, Zápisník, dlouhé prameny, dlouhá reflexe a dlouhé
  // poznámky leží tady. Musí to být nejtišší plocha, jakou motiv má.
  const bad = [];
  for (const f of THEME_FAMILIES) for (const m of MODES) {
    const t = f[m];
    const doc = tint(t.documentSurface);
    /* Porovnává se se ZVEDNUTÝMI povrchy — tedy s tím, na co by se dalo psát
       místo dokumentu. Pole a navigace jsou rám místnosti, ne psací plocha;
       v noci jsou dokonce záměrně nejneutrálnější věcí v celé místnosti
       (přirozený uhel), takže dokument je proti nim vždycky o nádech teplejší.
       To je v pořádku a je to celý smysl rozdílu mezi rámem a listem. */
    for (const k of ["surface", "card"]) {
      if (doc > tint(t[k]) + 0.005) bad.push(`${f.id}/${m}: documentSurface (${doc.toFixed(3)}) je barevnější než ${k} (${tint(t[k]).toFixed(3)})`);
    }
    if (doc > 0.06) bad.push(`${f.id}/${m}: documentSurface ${t.documentSurface} má nádech ${doc.toFixed(3)} · na psaní moc`);
    assert.notEqual(t.documentSurface, t.background, `${f.id}/${m}: na dlouhé psaní se nesmí použít pole stránky`);
  }
  assert.deepEqual(bad, [], bad.join("\n"));
});

test("noc je přirozený uhel, ne sytý barevný blok", () => {
  // V1.1 §1: přibližně 85 % přirozené tmavé neutrály, 10 % rodinný nádech,
  // 5 % akcent. Pole a navigace jsou těch 85 %.
  const bad = [];
  for (const f of THEME_FAMILIES) {
    const t = f.dark;
    for (const k of ["background", "navigation"]) {
      if (chroma(t[k]) > 0.06) bad.push(`${f.id}: ${k} = ${t[k]} má sytost ${chroma(t[k]).toFixed(3)}`);
      if (tint(t[k]) > 0.04) bad.push(`${f.id}: ${k} = ${t[k]} má nádech ${tint(t[k]).toFixed(3)}`);
      if (luminance(t[k]) > 0.06) bad.push(`${f.id}: ${k} = ${t[k]} není tmavé pole`);
    }
    // Rodina má být v noci PŘÍTOMNÁ, ne neviditelná: zvednuté povrchy nesou nádech.
    assert.ok(tint(t.card) >= tint(t.background), `${f.id}: karta v noci nenese rodinný nádech`);
  }
  assert.deepEqual(bad, [], bad.join("\n"));
});

test("den smí mít barevný papír, ale psací plocha je skoro bílá", () => {
  for (const f of THEME_FAMILIES) {
    const t = f.light;
    assert.ok(luminance(t.documentSurface) >= 0.85,
      `${f.id}: světlá dokumentová plocha ${t.documentSurface} není skoro bílá`);
    assert.ok(luminance(t.documentSurface) >= luminance(t.background),
      `${f.id}: dokumentová plocha musí být světlejší než pole`);
  }
});

test("karta nesplyne s polem a hierarchie se neslehne", () => {
  const bad = [];
  for (const f of THEME_FAMILIES) for (const m of MODES) {
    const t = f[m];
    const r = ratio(t.card, t.background, t.background);
    if (r < 1.05) bad.push(`${f.id}/${m}: karta a pole se liší jen ${r.toFixed(3)}:1`);
    // Navigace je vždycky hlouběji než pole · panel se nesmí ztratit.
    const nav = m === "light" ? luminance(t.navigation) <= luminance(t.background)
                              : luminance(t.navigation) <= luminance(t.background);
    if (!nav) bad.push(`${f.id}/${m}: navigace se od pole neodděluje`);
  }
  assert.deepEqual(bad, [], bad.join("\n"));
});

test("akcent je akcent · nikdy plocha, nikdy stav", () => {
  for (const f of THEME_FAMILIES) for (const m of MODES) {
    const t = f[m];
    for (const k of ["background", "navigation", "surface", "card", "documentSurface"]) {
      assert.notEqual(t.interactiveAccent, t[k], `${f.id}/${m}: akcent se používá jako ${k}`);
    }
    for (const s of ["successFg", "warningFg", "errorFg", "infoFg"]) {
      assert.notEqual(t.interactiveAccent, t[s], `${f.id}/${m}: akcent splývá se stavem ${s}`);
    }
  }
});

test("čtyři povrchy jsou čtyři, ne dva", () => {
  // Pole, povrch, karta a dokument se musí od sebe lišit — jinak je motiv
  // plakát se dvěma barvami a ne pracovní prostor.
  for (const f of THEME_FAMILIES) for (const m of MODES) {
    const t = f[m];
    const set = new Set([t.background, t.navigation, t.surface, t.card, t.documentSurface]);
    assert.ok(set.size >= 4, `${f.id}/${m}: jen ${set.size} různých ploch`);
  }
});


test("nápověda v poli se nikde nekreslí sníženým krytím", () => {
  // Vlastní token vydrží jen tak dlouho, dokud ho někdo nezmírní `opacity`.
  // Tohle je jediné místo, kde se to dá uhlídat: ve zdroji pravidla.
  const rules = app.split("\n").filter((l) => /::placeholder|::-webkit-input-placeholder/.test(l));
  assert.ok(rules.length >= 1, "aplikace musí mít pravidlo pro nápovědu v poli");
  for (const r of rules) {
    assert.match(r, /var\(--tm-placeholder|t\.placeholder/, "nápověda musí brát vlastní token: " + r.trim().slice(0, 90));
    const op = r.match(/opacity:\s*([\d.]+)/);
    if (op) assert.equal(Number(op[1]), 1, "krytí nápovědy musí být 1: " + r.trim().slice(0, 90));
  }
});

test("dvě finální korekce V1.1 drží svoje hodnoty", () => {
  const sig = THEME_FAMILIES.find((f) => f.id === "signature").light;
  assert.equal(sig.placeholder, "#6B655E",
    "světlá Signature má nápovědu ze specifikace · teplý inkoust, ne odvozený zelenošedý tón");
  const olive = THEME_FAMILIES.find((f) => f.id === "olive-gold").light;
  assert.equal(olive.navigation, "#E3D7A1",
    "navigace Olivy a zlata byla ztišená z #E8D779 · celoplošný Royal Yellow tam nepatří");
  assert.notEqual(olive.navigation, "#FFD85F", "Royal Yellow je akcent, ne navigační plocha");
  // Pořád to musí být oliva a zlato, ne béžová: odstín zůstává v žluté rodině
  // a plocha se od pole odlišuje.
  const h = hueDeg(olive.navigation);
  assert.ok(h >= 40 && h <= 65, `navigace ztratila olivově zlatý odstín · hue ${Math.round(h)}`);
  assert.ok(ratio(olive.navigation, olive.background, olive.background) >= 1.1,
    "navigace se od pole musí odlišit");
});
