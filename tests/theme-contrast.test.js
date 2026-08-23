// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/repo-tests/theme-contrast.test.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// KONTRAST SE POČÍTÁ, NEODHADUJE.
//
// Měří se SKUTEČNÉ DVOJICE, ne tokeny proti sobě: písmo na každé ploše, na
// které opravdu leží, popisek na akcentu i na jeho hoveru, nápověda v poli,
// obtah soustředění vedle sousední plochy, stavový text na stavovém pozadí,
// série grafu na plotně motivu.
//
// V2 přidal do seznamu ploch VYVÝŠENOU (`elevatedSurface`) — modal, popover,
// list nad listem. Do V1.1 se dopočítávala z karty a byla jí tak blízko, že
// se neměřila zvlášť; od V2 ji nové palety určují samy a leží o patro výš,
// takže ztlumené písmo na ní musí projít stejně jako všude jinde.
//
// Nula známých výjimek u běžného textu. Když sem někdy nějaká přibude, musí
// být napsaná tady i v THEME-CONTRAST-REPORT.md, ne mlčky odpuštěná.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  FIXED_PRESET_IDS, resolveTheme, chartPalette, statusPalette, appearancePreset,
} from "../src/shared/ui/themeRegistry.js";
import { makeTagsFor } from "../src/shared/ui/theme.js";
import { ratio, grayscale, cvdDistance, composite, contrast, AA } from "../src/shared/ui/contrast.js";

/* MĚŘÍ SE ROLE, NE KARTÉZSKÝ SOUČIN. „Nápověda na najeté kartě" není dvojice,
   která v aplikaci existuje: nápověda leží uvnitř pole formuláře, ne na kartě
   pod kurzorem. Kdyby se měřil součin všeho se vším, matice by hlásila selhání
   kombinací, které nikdo nikdy nevykreslí — a skutečná selhání by se v tom
   ztratila. Každá role má proto vlastní seznam ploch, na kterých se opravdu
   ocitne. */

/** Plochy, na kterých leží běžný text. */
const TEXT_ON = ["background", "navigation", "surface", "card", "cardHover", "documentSurface",
  "sheetHover", "elevatedSurface", "callout", "tableHead", "sheet", "hero"];
/** Plochy polí formuláře · tam a nikde jinde leží nápověda. */
const INPUT_ON = ["documentSurface", "card", "surface", "background", "navigation"];
/** Klidové plochy · hrana nebo obtah leží vedle nich. */
const REST_ON = ["background", "navigation", "surface", "card", "documentSurface", "elevatedSurface"];

const INKS = ["text", "heading", "textSecondary", "textMuted", "link"];
const PLACEHOLDERS = ["placeholder", "placeholderText", "placeholderStrong"];
const STATUS_INKS = ["successFg", "warningFg", "errorFg", "infoFg"];

let measured = 0;

test("běžný text drží 4,5:1 na každé ploše, na které leží", () => {
  const fail = [];
  for (const id of FIXED_PRESET_IDS) {
    const t = resolveTheme(id, false);
    for (const ink of [...INKS, ...STATUS_INKS]) for (const f of TEXT_ON) {
      const r = ratio(t[ink], t[f], t[f]); measured++;
      if (r < AA.text) fail.push(`${id}: ${ink} na ${f} = ${r}`);
    }
  }
  assert.deepEqual(fail, [], fail.join("\n"));
});

test("nápověda drží 4,5:1 v každém poli formuláře", () => {
  const fail = [];
  for (const id of FIXED_PRESET_IDS) {
    const t = resolveTheme(id, false);
    for (const ph of PLACEHOLDERS) for (const f of INPUT_ON) {
      const r = ratio(t[ph], t[f], t[f]); measured++;
      if (r < AA.text) fail.push(`${id}: ${ph} na ${f} = ${r}`);
    }
    // Nápověda zůstává tišší než napsaný text — je to nápověda, ne text.
    assert.ok(ratio(t.text, t.documentSurface, t.documentSurface) > ratio(t.placeholder, t.documentSurface, t.documentSurface),
      `${id}: nápověda není tišší než napsaný text`);
  }
  assert.deepEqual(fail, [], fail.join("\n"));
});

test("popisek osy drží 3:1 na plotně, hrany a obtah na klidových plochách", () => {
  /* HRANA SE MĚŘÍ PROTI PLOŠE, KTEROU OHRANIČUJE. `borderStrong` dnes nečte
     žádná komponenta — vydává se jen jako `--tm-border-strong` a rejstřík z něj
     dělá rám plátu Movement Atlasu, který leží na lnu. Kdyby ho někdy začala
     kreslit komponenta na najetou kartu, patří sem i plochy hoveru; do té doby
     by to bylo měření dvojice, která neexistuje. Zapsáno v
     THEME-CONTRAST-REPORT.md i s naměřenými čísly. */
  const fail = [];
  for (const id of FIXED_PRESET_IDS) {
    const t = resolveTheme(id, false);
    for (const u of ["borderStrong", "focusRing"]) for (const f of REST_ON) {
      const r = ratio(t[u], t[f], t[f]); measured++;
      if (r < AA.ui) fail.push(`${id}: ${u} na ${f} = ${r}`);
    }
    const ax = ratio(t.axis, t.chartSurface, t.chartSurface); measured++;
    if (ax < AA.ui) fail.push(`${id}: osa na plotně = ${ax}`);
    // Rám plátu leží na lněném plátu, nikde jinde.
    const fr = ratio(t.atlasBorder, t.atlasFrame, t.atlasFrame); measured++;
    if (fr < AA.ui) fail.push(`${id}: rám plátu na lnu = ${fr}`);
  }
  assert.deepEqual(fail, [], fail.join("\n"));
});

test("zakázaný prvek zůstává čitelný v klidu · WCAG ho nepožaduje, dům ano", () => {
  /* SC 1.4.3 neklade na neaktivní prvek žádný požadavek. Tenhle dům si klade
     vlastní: 3:1 na klidových plochách, aby zakázané tlačítko šlo přečíst,
     i když je zřetelně tišší než živé. */
  const fail = [];
  for (const id of FIXED_PRESET_IDS) {
    const t = resolveTheme(id, false);
    for (const f of REST_ON) {
      const r = ratio(t.textDisabled, t[f], t[f]); measured++;
      if (r < AA.ui) fail.push(`${id}: zakázaný na ${f} = ${r}`);
    }
    assert.ok(ratio(t.textMuted, t.card, t.card) > ratio(t.textDisabled, t.card, t.card),
      `${id}: zakázaný prvek není tišší než ztlumené písmo`);
  }
  assert.deepEqual(fail, [], fail.join("\n"));
});

test("popisek na akcentu drží i při najetí a stisku", () => {
  const fail = [];
  for (const id of FIXED_PRESET_IDS) {
    const t = resolveTheme(id, false);
    for (const a of ["interactiveAccent", "interactiveAccentHover", "interactiveAccentPressed"]) {
      const r = ratio(t.interactiveOnAccent, t[a], t[a]); measured++;
      if (r < AA.text) fail.push(`${id}: popisek na ${a} = ${r}`);
    }
    // Akcent musí být vidět i jako plocha vedle pole a karty.
    for (const f of ["background", "card"]) {
      const r = ratio(t.interactiveAccent, t[f], t[f]); measured++;
      if (r < AA.ui) fail.push(`${id}: akcent vedle ${f} = ${r}`);
    }
  }
  assert.deepEqual(fail, [], fail.join("\n"));
});

test("výběr textu a označený řádek zůstávají čitelné", () => {
  const fail = [];
  for (const id of FIXED_PRESET_IDS) {
    const t = resolveTheme(id, false);
    const r = ratio(t.selectionText, t.selectionSurface, t.selectionSurface); measured++;
    if (r < AA.text) fail.push(`${id}: text na výběru = ${r}`);
    const nav = composite(t.activeNav, t.navigation);
    const r2 = ratio(t.text, nav, nav); measured++;
    if (r2 < AA.text) fail.push(`${id}: text na aktivní navigaci = ${r2}`);
  }
  assert.deepEqual(fail, [], fail.join("\n"));
});

test("stavový text drží na stavovém pozadí i na plochách pod ním", () => {
  const fail = [];
  for (const id of FIXED_PRESET_IDS) {
    const t = resolveTheme(id, false);
    const s = statusPalette(id);
    for (const role of ["success", "warning", "error", "info"]) {
      const r = ratio(s[role + "Fg"], s[role + "Bg"], s[role + "Bg"]); measured++;
      if (r < AA.text) fail.push(`${id}: ${role} na vlastním pozadí = ${r}`);
      // Chip musí být vidět i jako plocha na kartě.
      const r2 = ratio(s[role + "Bg"], t.card, t.card); measured++;
      if (r2 < 1.12) fail.push(`${id}: ${role} chip splývá s kartou = ${r2}`);
    }
  }
  assert.deepEqual(fail, [], fail.join("\n"));
});

test("štítky drží 4,5:1 na každé ploše, na které mohou ležet", () => {
  const fail = [];
  for (const id of FIXED_PRESET_IDS) {
    const t = resolveTheme(id, false);
    const tg = makeTagsFor(id, false);
    for (const k of Object.keys(tg)) for (const f of TEXT_ON) {
      const eff = composite(tg[k].bg, t[f]);
      const r = ratio(tg[k].fg, eff, eff); measured++;
      if (r < AA.text) fail.push(`${id}: štítek ${k} na ${f} = ${r}`);
    }
  }
  assert.deepEqual(fail, [], fail.join("\n"));
});

test("série grafu drží 3:1 na plotně svého vzhledu", () => {
  const fail = [];
  for (const id of FIXED_PRESET_IDS) {
    const t = resolveTheme(id, false);
    chartPalette(id).series.forEach((c, i) => {
      const r = ratio(c, t.chartSurface, t.chartSurface); measured++;
      if (r < AA.ui) fail.push(`${id} chart${i + 1}: ${r}`);
    });
    const ax = ratio(t.axis, t.chartSurface, t.chartSurface); measured++;
    if (ax < AA.ui) fail.push(`${id} osa: ${ax}`);
  }
  assert.deepEqual(fail, [], fail.join("\n"));
});

test("série grafu se rozliší i bez barvy", () => {
  /* ŽEBŘÍK NEBO ODSTÍN, NE NIC. Kurátorská řada V2 nese odstíny, které dům
     opravdu má — a dvě z nich (hlína a měď) leží v jasu skoro na sobě.
     Pravidlo proto zní: dvě série se musí lišit v ŠEDI, nebo si musí zachovat
     odstup ve všech třech simulacích barvosleposti. Vzor a legenda jsou třetí
     vrstva, ne omluva. */
  const fail = [];
  for (const id of FIXED_PRESET_IDS) {
    const series = chartPalette(id).series;
    for (let i = 0; i < series.length; i++) for (let j = i + 1; j < series.length; j++) {
      const g = ratio(grayscale(series[i]), grayscale(series[j]));
      const cv = Math.min(...["protanopia", "deuteranopia", "tritanopia"].map((k) => cvdDistance(series[i], series[j], k)));
      measured++;
      if (g < 1.18 && cv < 40) fail.push(`${id}: série ${i + 1} a ${j + 1} splynou (šeď ${g}, barvoslepost ${cv})`);
    }
  }
  assert.deepEqual(fail, [], fail.join("\n"));
});

test("stav se nepozná jen barvou · to je předpoklad, ne nedostatek", () => {
  for (const id of FIXED_PRESET_IDS) {
    const s = statusPalette(id);
    const d = cvdDistance(s.successFg, s.errorFg, "deuteranopia");
    assert.ok(d < 60, `${id}: kdyby to najednou stačilo barvou, je předpoklad neplatný a pravidlo se má přepsat`);
  }
});

test("vybraný a nevybraný stav se pozná i v šedi", () => {
  for (const id of FIXED_PRESET_IDS) {
    const t = resolveTheme(id, false);
    const on = composite(t.activeNav, t.navigation);
    const g = ratio(grayscale(on), grayscale(t.navigation));
    assert.ok(g >= 1.03, `${id}: vybraná položka navigace je v šedi k nerozeznání (${g})`);
  }
});

test("žádná známá výjimka a dost měření, aby to něco znamenalo", () => {
  assert.ok(measured > 1400, `měření je jen ${measured} — matice se scvrkla`);
  assert.equal(FIXED_PRESET_IDS.length, 8);
  for (const id of FIXED_PRESET_IDS) assert.ok(appearancePreset(id).kind === "fixed");
});
