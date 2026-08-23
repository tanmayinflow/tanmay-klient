// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/repo-tests/theme-visual.test.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// VIZUÁLNÍ PŘIJETÍ · kontrast je nutný, ale nestačí (V2 §31).
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
import { FIXED_PRESETS, FIXED_PRESET_IDS, resolveTheme, appearancePreset } from "../src/shared/ui/themeRegistry.js";
import { chroma, tint, ratio, luminance, hueDeg, readsGreen } from "../src/shared/ui/contrast.js";

const app = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "src/App.tsx"), "utf8");
const LIGHT = FIXED_PRESETS.filter((p) => p.polarity === "light");
const DARK = FIXED_PRESETS.filter((p) => p.polarity === "dark");
/* Nejvyšší naměřený nádech běžného inkoustu je 0,106 (Tyrkys, noc). Nejnižší
   nádech akcentu je 0,064 (Řeka, den) — ten je ale záměrně skoro neutrální.
   Práh 0,12 odděluje inkoust od barvy a nechává obojí být. */
const INK_TINT_MAX = 0.12;
/** Tmavé vzhledy, které navrhla V2. Zbylé dva jsou zachované z V1.1. */
const V2_DARK = ["signature-night", "smoke-spice"];

test("běžný text zůstává neutrální ve všech osmi vzhledech", () => {
  // §14: dlouhý odstavec se nesází celý modře, tyrkysově, vínově ani olivově.
  const bad = [];
  for (const p of FIXED_PRESETS) {
    const t = p.palette;
    for (const k of ["text", "textSecondary", "textMuted", "placeholder", "placeholderStrong"]) {
      const v = tint(t[k]);
      if (v > INK_TINT_MAX) bad.push(`${p.id} ${k} = ${t[k]} · nádech ${v.toFixed(3)}`);
    }
  }
  assert.deepEqual(bad, [], bad.join("\n"));
});

test("žádné běžné písmo není akcent", () => {
  /* §14 doslova: „ordinary body selectors must not use interactiveAccent".
     Tabulka Kouře a koření dávala sekundárnímu písmu i nápovědě přesně
     hodnotu akcentu — proto se jim nechal jas a ubrala polovina sytosti. */
  for (const p of FIXED_PRESETS) {
    const t = p.palette;
    for (const k of ["text", "textSecondary", "textMuted", "placeholder", "placeholderText", "placeholderStrong"]) {
      assert.notEqual(t[k], t.interactiveAccent, `${p.id}: ${k} je doslova akcent`);
      assert.ok(chroma(t[k]) <= chroma(t.interactiveAccent) * 0.65 + 0.02,
        `${p.id}: ${k} nese skoro tolik barvy jako akcent`);
    }
  }
});

test("v textové vrstvě je vzhled vidět · nadpisem nebo odkazem, nikdy odstavcem", () => {
  /* Kdyby v písmu nebyla po vzhledu ani stopa, byl by to jen jiný papír.
     Nese ji NADPIS — s jedinou výjimkou, kterou specifikace určuje výslovně:
     u Písku a země drží stavbu (tělo, nadpis, navigační text) tmavá modř
     a barvu nese akce. Pravidlo proto zní: nadpis nikdy nenese MÉNĚ barvy
     než tělo, a aspoň jedno z dvojice nadpis/odkaz nese víc. */
  for (const p of LIGHT) {
    const t = p.palette;
    assert.ok(tint(t.heading) >= tint(t.text), `${p.id}: nadpis nese míň barvy než tělo textu`);
    assert.ok(tint(t.heading) > tint(t.text) || tint(t.link) > tint(t.text),
      `${p.id}: vzhled není v textové vrstvě vidět vůbec`);
  }
});

test("dokumentová plocha je nejklidnější povrch vzhledu", () => {
  /* §15: Deník, Zápisník, dlouhé prameny, dlouhá reflexe a dlouhé poznámky
     leží tady. Musí to být nejtišší plocha, jakou vzhled má. Porovnává se se
     ZVEDNUTÝMI povrchy — s tím, na co by se dalo psát místo dokumentu. Pole
     a navigace jsou rám místnosti, ne psací plocha. */
  const bad = [];
  for (const p of FIXED_PRESETS) {
    const t = p.palette;
    const doc = tint(t.documentSurface);
    /* Porovnává se s tím, na co by se dalo psát MÍSTO dokumentu: povrch
       a karta. Vyvýšená plocha je modal a popover — u světlých vzhledů je to
       skoro čistá bílá, takže by pravidlo vyhrála vždycky a neznamenalo by nic. */
    for (const k of ["surface", "card"]) {
      if (doc > tint(t[k]) + 0.005) bad.push(`${p.id}: documentSurface (${doc.toFixed(3)}) je barevnější než ${k} (${tint(t[k]).toFixed(3)})`);
    }
    if (doc > 0.06) bad.push(`${p.id}: documentSurface ${t.documentSurface} má nádech ${doc.toFixed(3)} · na psaní moc`);
    assert.notEqual(t.documentSurface, t.background, `${p.id}: na dlouhé psaní se nesmí použít pole stránky`);
    // Nesmí ani svítit jako bílý modal na tmavém vzhledu.
    if (p.polarity === "dark" && luminance(t.documentSurface) > luminance(t.card)) {
      bad.push(`${p.id}: dokument svítí víc než karta`);
    }
  }
  assert.deepEqual(bad, [], bad.join("\n"));
});

test("noc je přirozený uhel, ne sytý barevný blok", () => {
  // §8 a §12: pole a navigace nesou nejvýš nádech, ne barvu.
  const bad = [];
  for (const p of DARK) {
    const t = p.palette;
    for (const k of ["background", "navigation"]) {
      if (chroma(t[k]) > 0.06) bad.push(`${p.id}: ${k} = ${t[k]} má sytost ${chroma(t[k]).toFixed(3)}`);
      if (tint(t[k]) > 0.04) bad.push(`${p.id}: ${k} = ${t[k]} má nádech ${tint(t[k]).toFixed(3)}`);
      if (luminance(t[k]) > 0.06) bad.push(`${p.id}: ${k} = ${t[k]} není tmavé pole`);
    }
    if (tint(t.card) < tint(t.background)) bad.push(`${p.id}: karta v noci nenese vlastní nádech`);
  }
  assert.deepEqual(bad, [], bad.join("\n"));
});

test("noc má čitelné vrstvy, ne jednu tmu", () => {
  // §8: navigace pod polem, pak dokument, povrch, karta a vyvýšená plocha.
  const bad = [];
  for (const p of DARK) {
    const t = p.palette;
    if (luminance(t.navigation) >= luminance(t.background)) bad.push(`${p.id}: navigace není hlouběji než pole`);
    const ladder = ["background", "surface", "card"].map((k) => luminance(t[k]));
    for (let i = 1; i < ladder.length; i++) {
      if (ladder[i] <= ladder[i - 1]) bad.push(`${p.id}: vrstva ${i + 1} není nad vrstvou ${i}`);
    }
    const cardVsField = (luminance(t.card) + 0.05) / (luminance(t.background) + 0.05);
    if (cardVsField < 1.2) bad.push(`${p.id}: karta a pole splývají (${cardVsField.toFixed(3)})`);
    /* ŽÁDNÝ OLED — u vzhledů, které navrhla V2. Řeka v noci a Tyrkys v noci
       mají near-black pole od V1.1 (0,0063 a 0,0060) a §9 zakazuje je měnit;
       jsou to zachované palety, ne nové rozhodnutí. Zapsáno v
       THEME-CONTRAST-REPORT.md jako přenesený nález. */
    if (V2_DARK.includes(p.id) && luminance(t.background) < 0.008) {
      bad.push(`${p.id}: pole je prakticky černé`);
    }
  }
  assert.deepEqual(bad, [], bad.join("\n"));
});

test("den smí mít barevný papír, ale psací plocha je skoro bílá", () => {
  for (const p of LIGHT) {
    const t = p.palette;
    assert.ok(luminance(t.documentSurface) >= 0.75,
      `${p.id}: světlá dokumentová plocha ${t.documentSurface} není dost blízko papíru`);
    assert.ok(luminance(t.documentSurface) >= luminance(t.background),
      `${p.id}: dokumentová plocha musí být světlejší než pole`);
  }
});

test("karta nesplyne s polem a hierarchie se neslehne", () => {
  const bad = [];
  for (const p of FIXED_PRESETS) {
    const t = p.palette;
    const r = ratio(t.card, t.background, t.background);
    if (r < 1.05) bad.push(`${p.id}: karta a pole se liší jen ${r.toFixed(3)}:1`);
    if (luminance(t.navigation) > luminance(t.background)) bad.push(`${p.id}: navigace se od pole neodděluje`);
  }
  assert.deepEqual(bad, [], bad.join("\n"));
});

test("akcent je akcent · nikdy plocha, nikdy stav", () => {
  for (const p of FIXED_PRESETS) {
    const t = p.palette;
    for (const k of ["background", "navigation", "surface", "card", "documentSurface", "elevatedSurface"]) {
      assert.notEqual(t.interactiveAccent, t[k], `${p.id}: akcent se používá jako ${k}`);
    }
    for (const s of ["successFg", "warningFg", "errorFg", "infoFg"]) {
      assert.notEqual(t.interactiveAccent, t[s], `${p.id}: akcent splývá se stavem ${s}`);
    }
  }
});

test("povrchy jsou čtyři, ne dva", () => {
  for (const p of FIXED_PRESETS) {
    const t = p.palette;
    const set = new Set([t.background, t.navigation, t.surface, t.card, t.documentSurface]);
    assert.ok(set.size >= 4, `${p.id}: jen ${set.size} různých ploch`);
  }
});

test("nápověda v poli se nikde nekreslí sníženým krytím", () => {
  const rules = app.split("\n").filter((l) => /::placeholder|::-webkit-input-placeholder/.test(l));
  assert.ok(rules.length >= 1, "aplikace musí mít pravidlo pro nápovědu v poli");
  for (const r of rules) {
    assert.match(r, /var\(--tm-placeholder|t\.placeholder/, "nápověda musí brát vlastní token: " + r.trim().slice(0, 90));
    const op = r.match(/opacity:\s*([\d.]+)/);
    if (op) assert.equal(Number(op[1]), 1, "krytí nápovědy musí být 1: " + r.trim().slice(0, 90));
  }
});

test("korekce z uzávěrky V1.1 drží svoje hodnoty i po V2", () => {
  const sig = resolveTheme("signature-day", false);
  assert.equal(sig.placeholder, "#6B655E",
    "světlá Signature má nápovědu ze specifikace · teplý inkoust, ne odvozený zelenošedý tón");
});

test("Břidlice a hlína · chladné pole, teplé přerušení, žádná korporátní navy", () => {
  const t = resolveTheme("slate-clay", false);
  // Tělo textu je břidlicová modř, ne hlína.
  assert.equal(t.text, "#243746");
  assert.ok(hueDeg(t.text) > 180 && hueDeg(t.text) < 250, "tělo textu ztratilo břidlicový odstín");
  // Hlína je akcent, ne plocha.
  for (const k of ["background", "navigation", "surface", "card", "documentSurface", "elevatedSurface"]) {
    assert.ok(chroma(t[k]) <= 0.06, `${k} nese příliš barvy na chladné redakční pole`);
  }
  assert.ok(hueDeg(t.interactiveAccent) < 60, "akcent přestal být hliněný");
  // Navigace je tišší než pole, ne modrý panel.
  assert.ok(luminance(t.navigation) < luminance(t.background));
  assert.ok(chroma(t.navigation) <= 0.04, "navigace křičí barvou");
  // Dokument je skoro neutrální teplá bílá.
  assert.ok(luminance(t.documentSurface) >= 0.9 && chroma(t.documentSurface) <= 0.03);
});

test("Písek a země · modř drží stavbu, zem je akce, oliva jen podpírá", () => {
  const t = resolveTheme("sand-earth", false);
  assert.equal(t.text, "#28374A", "tělo textu je tmavá modř");
  assert.equal(t.heading, "#28374A", "nadpis nese modř, ne pálenou zem");
  assert.ok(hueDeg(t.interactiveAccent) < 40, "akcent přestal být pálená zem");
  assert.notEqual(t.interactiveAccent, t.errorFg, "pálená zem není chyba");
  // Oliva podpírá ohnisko a graf, nikdy plochu.
  for (const k of ["background", "navigation", "surface", "card", "documentSurface", "elevatedSurface"]) {
    assert.ok(!readsGreen(t[k]), `${k} je zelená plocha`);
  }
  const h = hueDeg(t.focusRing);
  assert.ok(h >= 45 && h <= 110, `ohnisko ztratilo tlumenou olivu · hue ${h.toFixed(0)}`);
  assert.ok(chroma(t.focusRing) <= 0.14, "ohnisko je sytější, než tlumená oliva unese");
  assert.notEqual(t.focusRing, t.interactiveAccent, "ohnisko a akce musí zůstat dvě věci");
});

test("Kouř a koření · teplý materiál, bledě neutrální text, žádný luxus", () => {
  const t = resolveTheme("smoke-spice", false);
  // Tan nese akcent, ne odstavec.
  assert.notEqual(t.textSecondary, t.interactiveAccent);
  assert.ok(chroma(t.text) <= 0.14, "tělo textu není bledě neutrální");
  // Karta se pozná od povrchu.
  assert.ok(luminance(t.card) > luminance(t.surface), "karta musí být nad povrchem");
  assert.ok(ratio(t.card, t.surface, t.surface) >= 1.02, "karta splývá s povrchem");
  // Žádný lesk, přechod ani kovová měď: stín je stín, akcent je plocha.
  assert.ok(!/gradient|glow|metallic/i.test(JSON.stringify(t)), "vzhled nese lesk nebo přechod");
  assert.equal(t.brandCopper, "#B87333", "Copper zůstává značkou, ne dekorací vzhledu");
});

test("žádný vzhled si nepřepsal značku ani plát Atlasu", () => {
  for (const id of FIXED_PRESET_IDS) {
    const t = resolveTheme(id, false);
    assert.equal(t.brandCopper, "#B87333", `${id} přebarvil Copper`);
    assert.equal(t.atlasFrame, "#F4F0EB", `${id} tónuje plát Movement Atlasu`);
    assert.equal(appearancePreset(id).kind, "fixed");
  }
});
