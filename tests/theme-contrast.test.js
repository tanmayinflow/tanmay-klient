// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/repo-tests/theme-contrast.test.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// KONTRAST SE POČÍTÁ NA SLOŽENÝCH BARVÁCH.
//
// V3 palety staví hierarchii z průhlednosti přesných kotev — a průsvitná
// barva sama o sobě žádný kontrast nemá. Měří se proto to, co prohlížeč
// opravdu namaluje: nádech se nejdřív složí na svůj podklad a teprve
// složenina se poměřuje s inkoustem.
//
// Navigace se měří VLASTNÍMI inkousty (nav-tokeny): čtyři palety mají tmavý
// panel nad světlým polem a globální inkoust na něj nikdy nepatří.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  FIXED_PRESET_IDS, OPTIONAL_PRESET_IDS, resolveTheme, statusPalette, chartPalette, appearancePreset,
} from "../src/shared/ui/themeRegistry.js";
import { makeTagsFor } from "../src/shared/ui/theme.js";
import { ratio, grayscale, cvdDistance, composite, contrast, AA } from "../src/shared/ui/contrast.js";

const hx = (h) => h.replace("#", "");
const mixTo = (a, b, k) => {
  const p = (x, i) => parseInt(hx(x).substr(i, 2), 16);
  let o = "#";
  for (const i of [0, 2, 4]) o += Math.round(p(a, i) * k + p(b, i) * (1 - k)).toString(16).padStart(2, "0");
  return o;
};
const paint = (tok, base) => (typeof tok === "string" && tok.charAt(0) === "#" && tok.length === 7 ? tok : composite(tok, base));

let measured = 0;
const m = (fg, bg, min) => { measured++; return contrast(fg, bg, bg) >= min; };

test("běžné písmo drží 4,5:1 na každé namalované obsahové ploše", () => {
  const fails = [];
  for (const id of FIXED_PRESET_IDS) {
    const t = resolveTheme(id, false);
    const P = {
      bg: t.background, surf: paint(t.surface, t.background), card: paint(t.card, t.background),
      doc: paint(t.documentSurface, t.background), elev: paint(t.elevatedSurface, t.card),
      cardHover: paint(t.cardHover, t.card), tableHead: paint(t.tableHead, t.background),
      callout: paint(t.callout, t.background), sheetHover: paint(t.sheetHover, t.documentSurface),
    };
    for (const ink of ["text", "textSecondary", "textMuted", "placeholder", "heading", "link"]) {
      for (const [sk, sv] of Object.entries(P)) {
        if (!m(t[ink], sv, AA.text)) fails.push(`${id}: ${ink}/${sk} = ${contrast(t[ink], sv, sv).toFixed(2)}`);
      }
    }
    const hero = paint(t.hero, t.background);
    if (!m(t.heroInk, hero, AA.text)) fails.push(`${id}: heroInk/hero`);
    const selection = paint(t.selectionSurface, t.background);
    if (!m(t.selectionText, selection, AA.text)) fails.push(`${id}: výběr textu`);
    const act = paint(t.activeNav, t.background);
    if (!m(t.text, act, AA.text)) fails.push(`${id}: text na aktivním nádechu`);
  }
  assert.deepEqual(fails, [], fails.join("\n"));
});

test("zakázaný stav a ohnisko drží 3:1, silná hrana na poli a listu", () => {
  const fails = [];
  for (const id of FIXED_PRESET_IDS) {
    const t = resolveTheme(id, false);
    const P = { bg: t.background, surf: paint(t.surface, t.background), card: paint(t.card, t.background), doc: paint(t.documentSurface, t.background) };
    for (const ink of ["textDisabled", "focusRing"]) {
      for (const [sk, sv] of Object.entries(P)) {
        if (!m(t[ink], sv, AA.ui)) fails.push(`${id}: ${ink}/${sk} = ${contrast(t[ink], sv, sv).toFixed(2)}`);
      }
    }
    /* Silná hrana kreslí významové oddělení na poli a na listu; na střední
       ploše smí být tišší (dekorativní vlásečnice je border/borderSoft). */
    for (const sk of ["bg", "doc"]) {
      if (!m(t.borderStrong, P[sk], AA.ui)) fails.push(`${id}: borderStrong/${sk}`);
    }
    if (!m(t.atlasBorder, t.atlasFrame, AA.ui)) fails.push(`${id}: rám plátu na lnu`);
  }
  assert.deepEqual(fails, [], fails.join("\n"));
});

test("popisek na akcentu drží 4,5:1 · najetí a stisk odstín nemění", () => {
  const fails = [];
  for (const id of FIXED_PRESET_IDS) {
    const t = resolveTheme(id, false);
    for (const a of ["interactiveAccent", "interactiveAccentHover", "interactiveAccentPressed"]) {
      if (!m(t.interactiveOnAccent, t[a], AA.text)) fails.push(`${id}: popisek na ${a}`);
    }
    if (OPTIONAL_PRESET_IDS.indexOf(id) !== -1) {
      assert.equal(t.interactiveAccentHover, t.interactiveAccent,
        `${id}: najetí by vyžadovalo odvozenou barvu — pravidlo přesných kotev`);
    }
  }
  assert.deepEqual(fails, [], fails.join("\n"));
});

test("navigace se měří vlastními inkousty", () => {
  const fails = [];
  for (const id of FIXED_PRESET_IDS) {
    const t = resolveTheme(id, false);
    const nav = t.navigation;
    for (const [ink, min] of [["navText", AA.text], ["navTextSec", AA.text], ["navHeading", AA.text]]) {
      if (!m(t[ink], nav, min)) fails.push(`${id}: ${ink}/nav = ${contrast(t[ink], nav, nav).toFixed(2)}`);
    }
    for (const ink of ["navKicker", "navMuted", "navIcon"]) {
      if (!m(t[ink], nav, AA.ui)) fails.push(`${id}: ${ink}/nav`);
    }
    const act = paint(t.navActiveBg, nav);
    if (!m(t.navHeading, act, AA.text)) fails.push(`${id}: navHeading na vybraném`);
    /* Vybraný POPISEK nese navHeading (prošel výš). `navAccent` nese v
       Signature měděnou ikonu a fajfku — zmrazená produkce, kterou tahle
       vlna nesmí „vylepšit"; u volitelných palet ale akcentní inkoust nese
       i text, a tak musí projít celý. */
    const optional = OPTIONAL_PRESET_IDS.indexOf(id) !== -1;
    if (optional && !m(t.navAccent, act, AA.text)) fails.push(`${id}: navAccent na vybraném = ${contrast(t.navAccent, act, act).toFixed(2)}`);
    // dok · talíř je dockBg na 90 % nad polem
    const dock = mixTo(t.dockBg, t.background, 0.9);
    if (optional && !m(t.navAccent, dock, AA.text)) fails.push(`${id}: navAccent na doku`);
    if (!m(t.navMuted, dock, AA.ui)) fails.push(`${id}: navMuted na doku`);
  }
  assert.deepEqual(fails, [], fails.join("\n"));
});

test("stavový text drží na stavovém pozadí v každé paletě", () => {
  const fails = [];
  for (const id of FIXED_PRESET_IDS) {
    const s = statusPalette(id);
    for (const role of ["success", "warning", "error", "info"]) {
      if (!m(s[role + "Fg"], s[role + "Bg"], AA.text)) fails.push(`${id}: ${role}`);
    }
  }
  assert.deepEqual(fails, [], fails.join("\n"));
});

test("štítky drží 4,5:1 na obsahových plochách každé palety", () => {
  const fails = [];
  for (const id of FIXED_PRESET_IDS) {
    const t = resolveTheme(id, false);
    const tg = makeTagsFor(id, false);
    for (const k of Object.keys(tg)) {
      for (const base of [t.background, paint(t.card, t.background), paint(t.documentSurface, t.background)]) {
        const eff = composite(tg[k].bg, base);
        measured++;
        if (contrast(tg[k].fg, eff, eff) < AA.text) fails.push(`${id}: štítek ${k}`);
      }
    }
  }
  assert.deepEqual(fails, [], fails.join("\n"));
});

test("sousední řady grafu se od sebe poznají v šedi nebo v barvosleposti", () => {
  const fails = [];
  for (const id of FIXED_PRESET_IDS) {
    const series = chartPalette(id).series;
    for (let i = 0; i < 5; i++) {
      const a = series[i], b = series[i + 1];
      if (a === b) continue; // šestice cykluje kotvy — vzor a legenda nesou zbytek
      const g = ratio(grayscale(a), grayscale(b));
      const cv = Math.min(...["protanopia", "deuteranopia", "tritanopia"].map((k) => cvdDistance(a, b, k)));
      measured++;
      if (g < 1.18 && cv < 40) fails.push(`${id}: řady ${i + 1}/${i + 2} splynou (šeď ${g.toFixed(2)}, cvd ${cv.toFixed(0)})`);
    }
  }
  assert.deepEqual(fails, [], fails.join("\n"));
});

test("dost měření, aby to něco znamenalo", () => {
  assert.ok(measured > 900, `měření je jen ${measured}`);
  assert.equal(FIXED_PRESET_IDS.length, 18);
  for (const id of OPTIONAL_PRESET_IDS) assert.equal(appearancePreset(id).kind, "optional");
});
