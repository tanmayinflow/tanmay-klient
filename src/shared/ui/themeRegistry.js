// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/ui/themeRegistry.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// ----------------------------------------------------------------------
// REJSTŘÍK MOTIVŮ · sedm rodin, dva režimy, jeden kontrakt
// ----------------------------------------------------------------------
// Motiv není čtrnáct nesouvisejících palet. Je to RODINA a REŽIM:
//
//     { family: "atlantic-sky", mode: "system" }
//
// Rodina drží atmosféru, režim rozhoduje o světle. Ze dvojice se pokaždé
// složí jedna z čtrnácti vyřešených palet, a ta má vždycky stejné role —
// komponenty se nikdy neptají, JAKÝ motiv je zapnutý. Ptají se na roli:
// `t.card`, `t.textMuted`, `t.focusRing`. Proto v aplikaci není a nesmí
// vzniknout `if (theme === "olive-gold")`.
//
// SIGNATURE JE NORMA. Její hodnoty jsou doslova ty, které dům nosí dnes —
// přepsané sem znak po znaku z původního ui/theme.js. Nová rodina nesmí
// změnit ani jeden odstín Signature; kontrola `theme-signature.test.js` to
// hlídá proti zapsanému otisku.
//
// ODVOZENÉ TOKENY se počítají JEDNOU při načtení modulu, ne při vykreslení.
// Rejstřík je zmrazená datová struktura; motiv se přepíná výměnou objektu a
// atributem na <html>, ne přepočtem barev.
//
// Kotevní barvy šesti volitelných rodin a jejich doporučené tokeny přicházejí
// z tanmay_theme_system_v1_palette_spec.md. Odchylky od specifikace jsou
// vypsané v Work/web-application/THEME-CONTRAST-REPORT.md i s důvodem.

import { hexA, mixHex } from "./color.js";
import { contrast, luminance } from "./contrast.js";

/** Značkové body. Copper je značka, ne interakční barva. */
export const BRAND = Object.freeze({ copper: "#B87333", linen: "#F4F0EB", forest: "#1C1C1A" });

export const THEME_MODES = Object.freeze(["system", "light", "dark"]);
export const THEME_FAMILY_IDS = Object.freeze([
  "signature", "olive-gold", "clay-alabaster", "atlantic-sky",
  "mulberry-paper", "teal-parchment", "river-mist",
]);
export const DEFAULT_FAMILY = "signature";
/* Výchozí režim zůstává „světlo", ne „automaticky". Kdo si nikdy nevybral,
   viděl dosud den — a po nasazení musí vidět zase den, i když má systém
   nastavený na noc. */
export const DEFAULT_MODE = "light";

// ----------------------------------------------------------------------
// FUNKČNÍ BARVY · význam, ne dekorace
// ----------------------------------------------------------------------
// Error, warning, success a info se neodvozují z kotevních barev rodiny.
// Mulberry pozadí není chyba a Teal není automaticky úspěch. Tyhle čtyři
// role mají v celém domě jeden význam a jednu barvu na režim.
export const FUNCTIONAL = Object.freeze({
  light: Object.freeze({
    successFg: "#2F624A", successBg: "#DDEBDF",
    warningFg: "#765116", warningBg: "#F4E8C5",
    errorFg: "#873342", errorBg: "#F0DADF",
    infoFg: "#365E6C", infoBg: "#DDE9ED",
  }),
  dark: Object.freeze({
    successFg: "#A9DDBA", successBg: "#223D2E",
    warningFg: "#F0D28A", warningBg: "#493C1F",
    errorFg: "#F2A6AF", errorBg: "#4E2730",
    infoFg: "#A8D2E0", infoBg: "#243E49",
  }),
});

// ----------------------------------------------------------------------
// DATOVÁ PALETA · šest sérií, ne sedm odstínů akcentu
// ----------------------------------------------------------------------
// Série se v jednom motivu nesmí rozlišovat jenom odstínem. Obě řady jsou
// proto postavené jako ŽEBŘÍK JASU: každý další člen je zhruba o třetinu
// světlejší než předchozí, takže se od sebe liší i po převodu do šedi a i
// pro člověka bez jednoho barevného kanálu. Význam série je napříč motivy
// stejný — theme smí tónovat mřížku a osu, ne význam.
export const CHART = Object.freeze({
  light: Object.freeze({
    series: Object.freeze(["#1B324C", "#62381F", "#3B5C26", "#8B4C9A", "#1F8581", "#AD8529"]),
  }),
  dark: Object.freeze({
    series: Object.freeze(["#5390CD", "#D9875E", "#7DBD50", "#D6B1DE", "#8FDED8", "#F0E4C0"]),
  }),
});

/** Nebarevný nosič série. Legenda a popisek jsou povinné, tohle je třetí vrstva. */
export const CHART_PATTERNS = Object.freeze([
  Object.freeze({ dash: "none", marker: "circle" }),
  Object.freeze({ dash: "6 3", marker: "square" }),
  Object.freeze({ dash: "2 3", marker: "triangle" }),
  Object.freeze({ dash: "9 3 2 3", marker: "diamond" }),
  Object.freeze({ dash: "1 4", marker: "cross" }),
  Object.freeze({ dash: "12 4", marker: "star" }),
]);

// ----------------------------------------------------------------------
// SIGNATURE · doslovný přepis současné produkční palety
// ----------------------------------------------------------------------
// Tyhle dva objekty se nesmí „vylepšit". Jsou to hodnoty, které dům nosí, a
// jediný důvod, proč tu jsou znovu, je že rejstřík je teď jejich domov.
const SIGNATURE_LIGHT = {
  bg: "#F4F0EB",
  bgSidebar: "#EBE6E0",
  text: "#1C1C1A",
  heading: "#2E3D35",
  textSec: "#454842",
  textMuted: "#5C5F58",
  accent: "#B87333",
  accentInk: "#8F5320",
  onAccent: "#1C1C1A",
  sage: "#4F5F43",
  sand: "#6E5B42",
  inkSand: "#6B5840",
  danger: "#6A3E44",
  info: "#4F646B",
  success: "#4F5F43",
  warning: "#6E5B42",
  border: "rgba(28,28,26,0.16)",
  borderSoft: "rgba(28,28,26,0.08)",
  card: "#FAF7F2",
  cardHover: "#FDFBF7",
  callout: "#EFE8DE",
  tableHead: "#EBE4DB",
  sheet: "#FFFDF9",
  sheetHover: "#FFFDFB",
  activeNav: "rgba(184,115,51,0.12)",
  overlay: "rgba(28,28,26,0.40)",
  shadow: "0 0 0 1px rgba(28,28,26,0.04), 0 1px 2px rgba(28,28,26,0.05), 0 8px 22px -12px rgba(28,28,26,0.18)",
  shadowLift: "0 0 0 1px rgba(28,28,26,0.05), 0 2px 5px rgba(28,28,26,0.06), 0 18px 40px -20px rgba(28,28,26,0.24)",
  shadowPop: "0 0 0 1px rgba(28,28,26,0.06), 0 3px 9px -4px rgba(28,28,26,0.10), 0 20px 46px -22px rgba(28,28,26,0.26)",
  shadowSheet: "0 0 0 1px rgba(28,28,26,0.07), 0 5px 14px -7px rgba(28,28,26,0.11), 0 28px 68px -30px rgba(28,28,26,0.30)",
  shadowDrag: "0 0 0 1px rgba(184,115,51,0.22), 0 8px 22px -10px rgba(28,28,26,0.16), 0 30px 58px -28px rgba(28,28,26,0.28)",
  hero: "#EDE5DB",
  heroInk: "#2E3D35",
  heroInkSoft: "rgba(46,61,53,0.78)",
  heroLine: "rgba(184,115,51,0.30)",
};
const SIGNATURE_DARK = {
  bg: "#1C1C1A",
  bgSidebar: "#161714",
  text: "#F4F0EB",
  heading: "#F4F0EB",
  textSec: "#CAC6BE",
  textMuted: "#A7A39B",
  accent: "#B87333",
  accentInk: "#D39A63",
  onAccent: "#1C1C1A",
  sage: "#9AAA8D",
  sand: "#D0BEA3",
  inkSand: "#D8C7AE",
  danger: "#D9A4A8",
  info: "#9EB8BE",
  success: "#9AAA8D",
  warning: "#D0BEA3",
  border: "rgba(244,240,235,0.16)",
  borderSoft: "rgba(244,240,235,0.08)",
  card: "#242521",
  cardHover: "#2A2B26",
  callout: "#22231F",
  tableHead: "#282923",
  sheet: "#2C2D27",
  sheetHover: "#32332D",
  activeNav: "rgba(184,115,51,0.16)",
  overlay: "rgba(0,0,0,0.58)",
  shadow: "0 0 0 1px rgba(244,240,235,0.05), 0 2px 4px rgba(0,0,0,0.36), 0 12px 30px -16px rgba(0,0,0,0.60)",
  shadowLift: "0 0 0 1px rgba(244,240,235,0.07), 0 3px 8px rgba(0,0,0,0.40), 0 24px 50px -22px rgba(0,0,0,0.66)",
  shadowPop: "0 0 0 1px rgba(244,240,235,0.09), 0 4px 12px -5px rgba(0,0,0,0.48), 0 28px 60px -26px rgba(0,0,0,0.72)",
  shadowSheet: "0 0 0 1px rgba(244,240,235,0.11), 0 6px 18px -8px rgba(0,0,0,0.52), 0 36px 78px -30px rgba(0,0,0,0.76)",
  shadowDrag: "0 0 0 1px rgba(184,115,51,0.30), 0 8px 22px -10px rgba(0,0,0,0.58), 0 34px 68px -28px rgba(0,0,0,0.78)",
  hero: "#2E3D35",
  heroInk: "#F4F0EB",
  heroInkSoft: "rgba(244,240,235,0.78)",
  heroLine: "rgba(184,115,51,0.42)",
};

// ----------------------------------------------------------------------
// ŠEST VOLITELNÝCH RODIN · kotvy a doporučené tokeny ze specifikace
// ----------------------------------------------------------------------
// Zapisuje se jen to, co specifikace určuje. Zbytek (hrany bez sytosti,
// zakázané stavy, výběr, stín, hero) se odvozuje níž — jednou, pro všechny
// rodiny stejným pravidlem, aby nová rodina nebyla nová sada výjimek.
const SPECS = {
  "olive-gold": {
    labelCs: "Olivová a zlatá", labelEn: "Olive Gold",
    anchors: { "Olive Green": "#202B22", "Royal Yellow": "#FFD85F" },
    light: {
      background: "#F7E8A8", navigation: "#EED77F", surface: "#FBEFB9", card: "#FFF4C9",
      documentSurface: "#FFF6D1", text: "#202B22", textSecondary: "#465247", textMuted: "#5B6455",
      border: "#C5B464", borderStrong: "#A7954C",
      interactiveAccent: "#202B22", interactiveAccentHover: "#172019", interactiveOnAccent: "#FFD85F",
      focusRing: "#202B22",
    },
    dark: {
      background: "#202B22", navigation: "#18211A", surface: "#273429", card: "#2E3D31",
      documentSurface: "#263328", text: "#F7EDC4", textSecondary: "#D8CFAC", textMuted: "#AAA98E",
      border: "#455747", borderStrong: "#627264",
      interactiveAccent: "#FFD85F", interactiveAccentHover: "#FFE17F", interactiveOnAccent: "#202B22",
      focusRing: "#FFD85F",
    },
  },
  "clay-alabaster": {
    labelCs: "Hlína a alabastr", labelEn: "Clay Alabaster",
    anchors: { "Copper Clay": "#B86443", "Alabaster Sand": "#F0E2D3" },
    light: {
      background: "#F0E2D3", navigation: "#E6D3C1", surface: "#F7EBDD", card: "#FBF2E8",
      documentSurface: "#FFF7EF", text: "#33231E", textSecondary: "#60483D", textMuted: "#765D50",
      border: "#CFB4A0", borderStrong: "#B98F77",
      interactiveAccent: "#A65336", interactiveAccentHover: "#93482E", interactiveOnAccent: "#FFF7EF",
      focusRing: "#8F452D", decorative: "#B86443",
    },
    dark: {
      background: "#4B2B22", navigation: "#40251D", surface: "#553126", card: "#623A2C",
      documentSurface: "#533027", text: "#F0E2D3", textSecondary: "#D8C2B2", textMuted: "#B59684",
      border: "#805848", borderStrong: "#A77962",
      interactiveAccent: "#F0E2D3", interactiveAccentHover: "#FFF0E3", interactiveOnAccent: "#4B2B22",
      focusRing: "#F0E2D3", decorative: "#B86443",
    },
  },
  "atlantic-sky": {
    labelCs: "Atlantik a obloha", labelEn: "Atlantic Sky",
    anchors: { "Atlantic Blue": "#0F4B70", "Soft Sky Blue": "#C4F8FF" },
    light: {
      background: "#DDFBFE", navigation: "#C4F8FF", surface: "#E8FCFE", card: "#F0FEFF",
      documentSurface: "#F5FEFF", text: "#0F4B70", textSecondary: "#356A86", textMuted: "#4B7184",
      border: "#9FD8E2", borderStrong: "#72BACB",
      interactiveAccent: "#0F4B70", interactiveAccentHover: "#0A3C5B", interactiveOnAccent: "#C4F8FF",
      focusRing: "#0F4B70",
    },
    dark: {
      background: "#0F4B70", navigation: "#0B405F", surface: "#145A82", card: "#1A638E",
      documentSurface: "#13577E", text: "#E7FCFF", textSecondary: "#C5E7ED", textMuted: "#9FC7D1",
      border: "#397997", borderStrong: "#62A0B8",
      interactiveAccent: "#C4F8FF", interactiveAccentHover: "#D9FBFF", interactiveOnAccent: "#0F4B70",
      focusRing: "#C4F8FF",
    },
  },
  "mulberry-paper": {
    labelCs: "Moruše a papír", labelEn: "Mulberry Paper",
    anchors: { Mulberry: "#5A2132", Paper: "#EFE9E9" },
    light: {
      background: "#EFE9E9", navigation: "#E4DADB", surface: "#F5F0F0", card: "#FAF6F6",
      documentSurface: "#FBF8F8", text: "#5A2132", textSecondary: "#754253", textMuted: "#805663",
      border: "#CEBBC1", borderStrong: "#B3919C",
      interactiveAccent: "#5A2132", interactiveAccentHover: "#461827", interactiveOnAccent: "#EFE9E9",
      focusRing: "#5A2132",
    },
    dark: {
      background: "#5A2132", navigation: "#4D1B2A", surface: "#67283B", card: "#713046",
      documentSurface: "#632638", text: "#F8EFF1", textSecondary: "#E1CAD1", textMuted: "#C6A6B0",
      border: "#8B5364", borderStrong: "#AA7182",
      interactiveAccent: "#EFE9E9", interactiveAccentHover: "#F8F3F3", interactiveOnAccent: "#5A2132",
      focusRing: "#F3C8D4",
    },
  },
  "teal-parchment": {
    labelCs: "Teal a pergamen", labelEn: "Teal Parchment",
    anchors: { "Authentic Teal": "#035352", "Sidecar Yellow": "#F3E8BC" },
    light: {
      background: "#F3E8BC", navigation: "#E9DDA8", surface: "#F8EFCB", card: "#FCF5D8",
      documentSurface: "#FFF9E2", text: "#035352", textSecondary: "#2D6B68", textMuted: "#4B6F68",
      border: "#CABF8C", borderStrong: "#A99D68",
      interactiveAccent: "#035352", interactiveAccentHover: "#02413F", interactiveOnAccent: "#F3E8BC",
      focusRing: "#035352",
    },
    dark: {
      background: "#035352", navigation: "#024845", surface: "#0A605D", card: "#106C68",
      documentSurface: "#095C59", text: "#F3E8BC", textSecondary: "#D7D0AA", textMuted: "#C0C39D",
      border: "#3A817C", borderStrong: "#67A49E",
      interactiveAccent: "#F3E8BC", interactiveAccentHover: "#FFF2C8", interactiveOnAccent: "#035352",
      focusRing: "#F3E8BC",
    },
  },
  "river-mist": {
    labelCs: "Řeka a mlha", labelEn: "River Mist",
    anchors: { "River Slate": "#4F646B", Mist: "#E5ECEA", "Warm Sand": "#C5B49A" },
    light: {
      background: "#E5ECEA", navigation: "#D7E1DF", surface: "#EEF3F1", card: "#F6F8F5",
      documentSurface: "#F8FAF7", text: "#25383F", textSecondary: "#4F646B", textMuted: "#566A6F",
      border: "#B7C6C3", borderStrong: "#8FA3A2",
      interactiveAccent: "#4F646B", interactiveAccentHover: "#3E555E", interactiveOnAccent: "#F4F0EB",
      focusRing: "#375B67",
    },
    dark: {
      background: "#243238", navigation: "#1F2C31", surface: "#2C3D43", card: "#35484F",
      documentSurface: "#2A3A40", text: "#E8EFEC", textSecondary: "#C7D1CE", textMuted: "#9DADAA",
      border: "#4E636A", borderStrong: "#6E858A",
      interactiveAccent: "#C5B49A", interactiveAccentHover: "#D7C9B3", interactiveOnAccent: "#243238",
      focusRing: "#C5B49A",
    },
  },
};

// ----------------------------------------------------------------------
// ODVOZENÍ · jedno pravidlo pro všech sedm rodin
// ----------------------------------------------------------------------
// Rodina dodá kotvy a základní role. Zbytek — hover povrchů, hrany bez
// sytosti, zakázaný stav, výběr, stín, hero, funkční a datové role — vzniká
// tady, stejným postupem pro všechny. Signature na konci přepíše svoje
// PRODUKČNÍ hodnoty doslova, takže se nemůže pohnout ani o odstín, a přesto
// prochází stejnou cestou jako ostatní: žádná rodina není sada výjimek.
function meets(color, surfaces, min, alpha) {
  const c = alpha == null ? color : hexA(color, alpha);
  for (const bg of surfaces) if (contrast(c, bg, bg) < min) return false;
  return true;
}

/**
 * Posune barvu k inkoustu, dokud nesplní práh na VŠECH povrchech, na kterých
 * opravdu leží. Doporučená hodnota ze specifikace je výchozí bod, ne dogma:
 * §8 dovoluje odvozený token změnit právě tehdy, když selže kontrast — a
 * každý takový posun je vypsaný v THEME-CONTRAST-REPORT.md.
 * Krok je setina, takže výsledek je deterministický a stejný v testu i v běhu.
 */
function ensureOn(color, surfaces, min, toward, alpha) {
  if (meets(color, surfaces, min, alpha)) return color;
  for (let i = 1; i <= 100; i++) {
    const c = mixHex(color, toward, i / 100);
    if (meets(c, surfaces, min, alpha)) return c;
  }
  return toward;
}

function buildPalette(mode, s, legacy) {
  const light = mode === "light";
  const hex = (v) => typeof v === "string" && v.charAt(0) === "#";
  const shadowInk = light ? s.text : mixHex(s.background, BRAND.forest, 0.8);
  const hair = light ? s.text : s.text;
  const fn = FUNCTIONAL[mode];
  const series = CHART[mode].series;
  /* HOVER SE HÝBE OD POPISKU, NE PODLE REŽIMU. Ztmavit měď v Signature zní
     samozřejmě — a shodí to popisek NA mědi pod 4,5:1, protože ten je Forest
     Night. Směr proto určuje popisek: akcent se posouvá pryč od něj, takže
     tlačítko je při najetí čitelnější, ne hůř čitelné. Doporučené hodnoty ze
     specifikace tenhle směr už mají; dopočítává se jen tam, kde chybí. */
  const away = luminance(s.interactiveOnAccent) < luminance(s.interactiveAccent) ? BRAND.linen : BRAND.forest;
  const fitOnAccent = (c) => {
    if (contrast(s.interactiveOnAccent, c, c) >= 4.5) return c;
    for (let i = 1; i <= 100; i++) {
      const back = mixHex(c, away, i / 100);
      if (contrast(s.interactiveOnAccent, back, back) >= 4.5) return back;
    }
    return c;
  };
  const accentHover = fitOnAccent(s.interactiveAccentHover || mixHex(s.interactiveAccent, away, 0.14));

  // Povrchy, na kterých písmo a hrany opravdu leží.
  const fields = [s.background, s.navigation, s.surface, s.card, s.documentSurface];
  const textMuted = ensureOn(s.textMuted, fields, 4.5, s.text);
  const textSecondary = ensureOn(s.textSecondary, fields, 4.5, s.text);
  const link = ensureOn(s.accentInk || s.interactiveAccent, fields, 4.5, s.text);
  const borderStrong = ensureOn(s.borderStrong || mixHex(s.text, s.background, 0.45), fields, 3, s.text);
  const focusRing = ensureOn(s.focusRing || s.interactiveAccent, fields, 3, s.text);
  // Zakázaný stav zůstává čitelný (3:1), ale je zřetelně tišší než ztlumené písmo.
  const textDisabled = ensureOn(mixHex(textMuted, s.background, 0.3), fields, 3, s.text);
  /* NÁPOVĚDA V POLI je vlastní role, ne ztlumené písmo se sníženým krytím.
     Dokud byla, nešla uhlídat: aby prošla 4,5:1 na pergamenovém listu, muselo
     by ztlumené písmo zčernat skoro na barvu textu a hierarchie by zmizela.
     Teď má vlastní token — a Signature ho má nastavený PŘESNĚ na složeninu,
     kterou dnes vykresluje (0,80 v poli, 0,85 na psací ploše), takže se v ní
     nezmění ani jeden pixel. */
  const freeze = !!legacy;
  const phField = mixHex(textMuted, s.documentSurface, 0.2);
  const phWrite = mixHex(textMuted, s.documentSurface, 0.15);
  const placeholder = freeze ? phField : ensureOn(phField, fields, 4.5, s.text);
  const placeholderStrong = freeze ? phWrite : ensureOn(phWrite, fields, 4.5, s.text);
  /* VÝBĚR TEXTU · nádech akcentu pod textem. Sytější nádech vypadá líp a hůř
     se čte, takže se ubírá, dokud text na výběru nedrží 4,5:1. */
  const selectionSurface = (() => {
    for (let k = light ? 18 : 24; k >= 4; k--) {
      const c = mixHex(s.background, s.interactiveAccent, k / 100);
      if (contrast(s.text, c, c) >= 4.5) return c;
    }
    return mixHex(s.background, s.interactiveAccent, 0.04);
  })();

  const out = {
    mode,

    // ---- plochy -------------------------------------------------------
    background: s.background,
    navigation: s.navigation,
    surface: s.surface,
    surfaceRaised: light ? mixHex(s.card, s.documentSurface, 0.6) : mixHex(s.card, s.text, 0.08),
    surfaceMuted: s.navigation,
    card: s.card,
    documentSurface: s.documentSurface,
    overlay: light ? hexA(s.text, 0.4) : hexA(mixHex(s.background, BRAND.forest, 0.85), 0.62),

    // ---- písmo --------------------------------------------------------
    text: s.text,
    heading: s.heading || s.text,
    textSecondary,
    textMuted,
    textDisabled,
    placeholder,
    placeholderStrong,

    // ---- hrany --------------------------------------------------------
    border: s.border,
    borderStrong,
    borderSoft: hex(s.border) ? mixHex(s.border, s.background, 0.55) : s.border,

    // ---- interakce ----------------------------------------------------
    interactiveAccent: s.interactiveAccent,
    interactiveAccentHover: accentHover,
    interactiveAccentPressed: fitOnAccent(mixHex(accentHover, away, 0.14)),
    interactiveOnAccent: s.interactiveOnAccent,
    selectionSurface,
    selectionText: s.text,
    focusRing,
    link,
    linkHover: accentHover,

    // ---- značka -------------------------------------------------------
    // Copper je značka, ne ovládací prvek. V žádné rodině nesoutěží
    // s interactiveAccent a nikde se nepřebarvuje.
    brandCopper: BRAND.copper,
    brandLinen: BRAND.linen,
    brandForest: BRAND.forest,

    // ---- Movement Atlas -----------------------------------------------
    // Plát je záměrné lněné pole. Netónuje se, neinvertuje a nemíchá se
    // s podkladem — mění se jen rám kolem něj, aby na tmavém motivu nestál
    // bez hrany.
    atlasFrame: BRAND.linen,
    atlasBorder: borderStrong,

    // ---- funkční role -------------------------------------------------
    successFg: fn.successFg, successBg: fn.successBg,
    warningFg: fn.warningFg, warningBg: fn.warningBg,
    errorFg: fn.errorFg, errorBg: fn.errorBg,
    infoFg: fn.infoFg, infoBg: fn.infoBg,

    // ---- data ---------------------------------------------------------
    chart1: series[0], chart2: series[1], chart3: series[2],
    chart4: series[3], chart5: series[4], chart6: series[5],
    chartSurface: light ? s.card : mixHex(s.card, BRAND.forest, 0.45),
    grid: hex(s.border) ? mixHex(s.border, s.background, 0.35) : hexA(s.text, 0.12),
    axis: textMuted,

    // ---- starší názvy, na kterých stojí celý dům -----------------------
    // Nejsou to duplicity, je to VEŘEJNÉ API motivu. Tisíce míst v obou
    // aplikacích čtou `t.bg`, `t.card`, `t.textMuted`. Migrační vrstva je
    // tady, ne v komponentách.
    bg: s.background,
    bgSidebar: s.navigation,
    textSec: textSecondary,
    accent: s.interactiveAccent,
    accentInk: link,
    onAccent: s.interactiveOnAccent,
    sage: textSecondary,
    sand: textSecondary,
    inkSand: textSecondary,
    danger: fn.errorFg,
    info: fn.infoFg,
    success: fn.successFg,
    warning: fn.warningFg,
    cardHover: light ? mixHex(s.card, s.documentSurface, 0.45) : mixHex(s.card, s.text, 0.06),
    callout: s.surface,
    tableHead: s.navigation,
    sheet: s.documentSurface,
    sheetHover: light ? mixHex(s.documentSurface, s.card, 0.35) : mixHex(s.documentSurface, s.text, 0.05),
    activeNav: hexA(s.interactiveAccent, light ? 0.12 : 0.16),
    hero: light ? mixHex(s.background, s.text, 0.05) : s.surface,
    heroInk: s.text,
    heroInkSoft: hexA(s.text, 0.78),
    heroLine: hexA(s.interactiveAccent, light ? 0.3 : 0.42),

    // ---- hloubka · stejná geometrie, jiný inkoust ----------------------
    shadow: light
      ? `0 0 0 1px ${hexA(shadowInk, 0.04)}, 0 1px 2px ${hexA(shadowInk, 0.05)}, 0 8px 22px -12px ${hexA(shadowInk, 0.18)}`
      : `0 0 0 1px ${hexA(hair, 0.05)}, 0 2px 4px ${hexA(shadowInk, 0.36)}, 0 12px 30px -16px ${hexA(shadowInk, 0.6)}`,
    shadowLift: light
      ? `0 0 0 1px ${hexA(shadowInk, 0.05)}, 0 2px 5px ${hexA(shadowInk, 0.06)}, 0 18px 40px -20px ${hexA(shadowInk, 0.24)}`
      : `0 0 0 1px ${hexA(hair, 0.07)}, 0 3px 8px ${hexA(shadowInk, 0.4)}, 0 24px 50px -22px ${hexA(shadowInk, 0.66)}`,
    shadowPop: light
      ? `0 0 0 1px ${hexA(shadowInk, 0.06)}, 0 3px 9px -4px ${hexA(shadowInk, 0.1)}, 0 20px 46px -22px ${hexA(shadowInk, 0.26)}`
      : `0 0 0 1px ${hexA(hair, 0.09)}, 0 4px 12px -5px ${hexA(shadowInk, 0.48)}, 0 28px 60px -26px ${hexA(shadowInk, 0.72)}`,
    shadowSheet: light
      ? `0 0 0 1px ${hexA(shadowInk, 0.07)}, 0 5px 14px -7px ${hexA(shadowInk, 0.11)}, 0 28px 68px -30px ${hexA(shadowInk, 0.3)}`
      : `0 0 0 1px ${hexA(hair, 0.11)}, 0 6px 18px -8px ${hexA(shadowInk, 0.52)}, 0 36px 78px -30px ${hexA(shadowInk, 0.76)}`,
    shadowDrag: light
      ? `0 0 0 1px ${hexA(s.interactiveAccent, 0.22)}, 0 8px 22px -10px ${hexA(shadowInk, 0.16)}, 0 30px 58px -28px ${hexA(shadowInk, 0.28)}`
      : `0 0 0 1px ${hexA(s.interactiveAccent, 0.3)}, 0 8px 22px -10px ${hexA(shadowInk, 0.58)}, 0 34px 68px -28px ${hexA(shadowInk, 0.78)}`,
  };

  if (s.decorative) out.decorative = s.decorative;
  // Signature má poslední slovo: produkční hodnoty se vrací doslova.
  if (legacy) Object.assign(out, legacy);
  // Vlásečnice a dělítko jsou po přepisu totéž.
  out.divider = out.borderSoft;
  out.scrim = out.overlay;
  return Object.freeze(out);
}

/** Ze Signature legacy objektu udělá základní role, aby prošel stejnou cestou. */
function signatureBase(legacy) {
  return {
    background: legacy.bg, navigation: legacy.bgSidebar, surface: legacy.card,
    card: legacy.card, documentSurface: legacy.sheet,
    text: legacy.text, heading: legacy.heading, textSecondary: legacy.textSec, textMuted: legacy.textMuted,
    border: legacy.border, borderStrong: mixHex(legacy.text, legacy.bg, 0.45),
    interactiveAccent: legacy.accent, interactiveOnAccent: legacy.onAccent,
    accentInk: legacy.accentInk, focusRing: legacy.accent,
  };
}

function previewOf(p) {
  return { background: p.background, card: p.card, text: p.text, textMuted: p.textMuted, border: p.border, accent: p.interactiveAccent, onAccent: p.interactiveOnAccent };
}

function makeFamily(id, labelCs, labelEn, recommended, anchors, lightPal, darkPal) {
  return Object.freeze({
    id, labelCs, labelEn, recommended,
    anchors: Object.freeze(anchors),
    light: lightPal,
    dark: darkPal,
    preview: Object.freeze({ light: Object.freeze(previewOf(lightPal)), dark: Object.freeze(previewOf(darkPal)) }),
  });
}

const REGISTRY = (() => {
  const out = {};
  out.signature = makeFamily(
    "signature", "Signature", "Signature", true,
    { "Forest Night": BRAND.forest, Linen: BRAND.linen, Copper: BRAND.copper },
    buildPalette("light", signatureBase(SIGNATURE_LIGHT), SIGNATURE_LIGHT),
    buildPalette("dark", signatureBase(SIGNATURE_DARK), SIGNATURE_DARK),
  );
  for (const id of THEME_FAMILY_IDS) {
    if (id === "signature") continue;
    const def = SPECS[id];
    out[id] = makeFamily(id, def.labelCs, def.labelEn, false, def.anchors,
      buildPalette("light", def.light, null), buildPalette("dark", def.dark, null));
  }
  return Object.freeze(out);
})();

/** Všechny rodiny v pořadí, ve kterém se nabízejí. Signature první. */
export const THEME_FAMILIES = Object.freeze(THEME_FAMILY_IDS.map((id) => REGISTRY[id]));

/** Rodina podle id. Neznámé id nikdy nespadne — vrací Signature. */
export function themeFamily(id) { return REGISTRY[id] || REGISTRY[DEFAULT_FAMILY]; }

/** Bezpečné id rodiny. */
export function resolveFamilyId(id) { return Object.prototype.hasOwnProperty.call(REGISTRY, id) ? id : DEFAULT_FAMILY; }

/** "system" | "light" | "dark" + přání systému → "light" | "dark". */
export function resolveMode(mode, systemPrefersDark) {
  if (mode === "light" || mode === "dark") return mode;
  if (mode === "system") return systemPrefersDark ? "dark" : "light";
  return DEFAULT_MODE;
}

/** Bezpečný režim volby (ne vyřešený). */
export function resolveModeChoice(mode) { return THEME_MODES.indexOf(mode) === -1 ? DEFAULT_MODE : mode; }

/** Vyřešená paleta. `mode` už musí být light/dark. */
export function resolveTheme(familyId, mode) {
  return themeFamily(resolveFamilyId(familyId))[mode === "dark" ? "dark" : "light"];
}

/** Náhledové tokeny pro kartu v Nastavení — kus UI, ne dva čtverce. */
export function previewTokens(familyId, mode) {
  return themeFamily(resolveFamilyId(familyId)).preview[mode === "dark" ? "dark" : "light"];
}

/** Barva prohlížeče a lišty telefonu. Pole aplikace, nic jiného. */
export function pwaThemeColor(familyId, mode) { return resolveTheme(familyId, mode).background; }

/** Atributy na <html>. CSS i pre-paint skript čtou totéž. */
export function documentThemeAttrs(familyId, mode) {
  return { "data-theme-family": resolveFamilyId(familyId), "data-color-mode": mode === "dark" ? "dark" : "light" };
}

/** Stavová paleta pro vyřešený režim — jeden význam napříč motivy. */
export function statusPalette(mode) { return FUNCTIONAL[mode === "dark" ? "dark" : "light"]; }

/** Datová paleta pro vyřešený režim, i s nebarevným nosičem série. */
export function chartPalette(mode) {
  const m = mode === "dark" ? "dark" : "light";
  return { series: CHART[m].series, patterns: CHART_PATTERNS };
}

/** Kanonický dokumentový motiv pro tisk, PDF a export. Nikdy nesleduje volbu. */
export const DOCUMENT_THEME = REGISTRY.signature.light;

// ----------------------------------------------------------------------
// MIGRACE · nikdo se po nasazení nesmí probudit do jiné palety
// ----------------------------------------------------------------------
// Starý klíč nesl jen "light" | "dark". Nový nese rodinu a režim. Převod je
// čistá funkce, aby se dal otestovat bez prohlížeče: uložený řetězec dovnitř,
// platná volba ven. Cokoliv nesrozumitelného končí na Signature.
export const APPEARANCE_VERSION = 2;

export function normalizeAppearance(value) {
  const v = value && typeof value === "object" ? value : {};
  return {
    version: APPEARANCE_VERSION,
    family: resolveFamilyId(v.family),
    mode: resolveModeChoice(v.mode),
  };
}

/**
 * @param {string|null} raw   obsah nového klíče (JSON), nebo null
 * @param {string|null} legacy obsah starého klíče `tm-theme` ("light"|"dark"), nebo null
 */
export function migrateLegacyAppearance(raw, legacy) {
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") return normalizeAppearance(parsed);
    } catch (e) { /* rozbitý JSON není důvod k pádu, je důvod k Signature */ }
  }
  if (legacy === "light" || legacy === "dark" || legacy === "system") {
    return { version: APPEARANCE_VERSION, family: DEFAULT_FAMILY, mode: legacy };
  }
  return { version: APPEARANCE_VERSION, family: DEFAULT_FAMILY, mode: DEFAULT_MODE };
}

/** Návrat na doporučený motiv. */
export function signatureAppearance() {
  return { version: APPEARANCE_VERSION, family: DEFAULT_FAMILY, mode: DEFAULT_MODE };
}

// ----------------------------------------------------------------------
// STAV NIKDY NENÍ JEN BARVA
// ----------------------------------------------------------------------
// Zelená a červená leží v deuteranopii blízko sebe a po převodu do šedi mají
// skoro týž jas — to se barvou vyřešit nedá a ani se o to nepokoušíme. Každý
// stav proto povinně nese ještě ZNAK a SLOVO; barva je třetí vrstva, ne
// první. Tahle tabulka je smlouva: kdo kreslí stav, bere si z ní obojí.
export const STATUS_CARRIERS = Object.freeze({
  success: Object.freeze({ role: "success", glyph: "✓", shape: "check" }),
  warning: Object.freeze({ role: "warning", glyph: "!", shape: "triangle" }),
  error: Object.freeze({ role: "error", glyph: "×", shape: "octagon" }),
  info: Object.freeze({ role: "info", glyph: "i", shape: "circle" }),
  neutral: Object.freeze({ role: "neutral", glyph: "·", shape: "dot" }),
});

/** Tón z domény (booking `statusTone`, tréninkový typ série…) → funkční role. */
export const TONE_ROLES = Object.freeze({
  ok: "success",
  done: "success",
  wait: "info",
  warn: "warning",
  err: "error",
  off: "neutral",
});

/** Barvy a nosič pro jeden tón v daném režimu. */
export function toneStyle(tone, mode) {
  const role = TONE_ROLES[tone] || "neutral";
  const carrier = STATUS_CARRIERS[role];
  const pal = statusPalette(mode);
  if (role === "neutral") return { role, carrier, fg: null, bg: null };
  return { role, carrier, fg: pal[role + "Fg"], bg: pal[role + "Bg"] };
}
