// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/ui/themeRegistry.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// ----------------------------------------------------------------------
// REJSTŘÍK VZHLEDŮ · Signature + sedm přesných palet s vlastní řečí rámů
// ----------------------------------------------------------------------
// V2 zavedla kurátorované presety a jeden resolver. V3 na tom staví a mění
// dvě věci:
//
// 1 · SIGNATURE JE NORMA A NEHÝBE SE. Automaticky / Den / Noc zůstávají
//     přesně tak, jak je dům nosí — stejné hodnoty, stejné chování, žádné
//     rámy. Otisky to hlídají znak po znaku.
//
// 2 · SEDM VOLITELNÝCH PALET S PŘESNÝMI KOTVAMI. Každá pochází z jedné
//     dodané barevné reference a nese JEN její hexy: žádné odvozené rampy,
//     žádná HSL rotace, žádný color-mix uložený jako token. Jediné povolené
//     doplňky jsou průhlednost přesné kotvy (dekorace, hierarchie písma),
//     servisní Ink a Linen ze Signature tam, kde dodaná paleta nemá
//     přístupnou dvojici pro běžný text (výslovně: Americano a chai),
//     a sdílené stavové barvy.
//
// KAŽDÁ VOLITELNÁ PALETA MÁ VLASTNÍ ŘEČ RÁMŮ. Nejde o monolitické
// přebarvení: paleta se pozná podle toho, jak rámuje list, zásuvku a vybraný
// prvek — dvojitá linka, vsazený monument, vrstvy strat, rohové konzoly,
// vnořená fosilie, čedičové stupně, tkané kolejnice. Rámy jsou čisté CSS
// (pseudo-prvky, vnitřní stíny, obrysy), nemění rozměry komponent a Signature
// se jich nikdy nedotkne.
//
// DVOJÍ POLARITA NAVIGACE. Čtyři z dodaných palet mají tmavou navigaci nad
// světlým polem. Kontrakt proto nese NAV-TOKENY (`navText`, `navIcon`,
// `navKicker`, …): postranní panel a dok čtou je, ne globální inkousty.
// V Signature se rovnají přesně dosavadním hodnotám, takže se nezměnil
// jediný pixel.
//
// Komponenty se nikdy neptají, JAKÁ paleta je zapnutá. Ptají se na roli
// (`t.card`, `t.navText`, `t.frameRail`) a na `data-frame-grammar` na kořeni.
//
// Barevná autorita: tanmay_theme_system_v3_exact_palettes_frame_spec.md
// a sedm dodaných referencí. Odchylky jsou v THEME-CONTRAST-REPORT.md.

import { hexA, mixHex } from "./color.js";
import { contrast, luminance, grayscale, ratio, cvdDistance, chroma } from "./contrast.js";

/** Značkové body. Copper je značka, ne interakční barva. */
export const BRAND = Object.freeze({ copper: "#B87333", linen: "#F4F0EB", forest: "#1C1C1A" });

/**
 * Servisní inkousty. Dodaná paleta je grafická, ne kompletní přístupný
 * systém — kde nemá vlastní dvojici pro běžný text, smí si půjčit lněné
 * písmo a inkoust ze Signature. Jen pro písmo, popisky tlačítek a ohnisko;
 * nikdy jako novou kotvu plochy.
 */
export const UTILITY = Object.freeze({ ink: BRAND.forest, linen: BRAND.linen });

/* Pořadí je pořadí v Nastavení: Signature (automatika, den, noc) a pak sedm
   volitelných palet v pořadí ze specifikace. */
export const APPEARANCE_PRESET_IDS = Object.freeze([
  "signature-auto",
  "signature-day",
  "signature-night",
  "slate-clay-pantone",
  "monument-clay",
  "sand-burnt-earth",
  "garnet-slate",
  "shikon-fossil",
  "volcanic-grey",
  "americano-chai",
  "quiet-ledger-night",
  "nagtang-black",
  "martang-red",
  "sertang-gold",
  "mineral-pigments",
  "black-sand",
  "deep-water",
]);

/** Signature trojice — jediná část výběru, kde existuje režim. */
export const SIGNATURE_PRESET_IDS = Object.freeze(["signature-auto", "signature-day", "signature-night"]);

/** Dvanáct volitelných palet · osm z dodaných referencí a čtyři thangky. Pevné: systém s nimi nehýbe. */
export const OPTIONAL_PRESET_IDS = Object.freeze([
  "slate-clay-pantone", "monument-clay", "sand-burnt-earth", "garnet-slate",
  "shikon-fossil", "volcanic-grey", "americano-chai", "quiet-ledger-night",
  "nagtang-black", "martang-red", "sertang-gold", "mineral-pigments",
  "black-sand",
  "deep-water",
]);

/** Všechno kromě automatiky — vyřešené palety. */
export const FIXED_PRESET_IDS = Object.freeze(APPEARANCE_PRESET_IDS.filter((id) => id !== "signature-auto"));

/* Výchozí je automatika: kdo si nikdy nic nezvolil, má Signature podle
   systému (rozhodnutí V2, V3 ho nemění). */
export const DEFAULT_PRESET = "signature-auto";

/** Doporučený vzhled. Signature zůstává normou domu. */
export const RECOMMENDED_PRESET = "signature-auto";

// ----------------------------------------------------------------------
// FUNKČNÍ BARVY · význam, ne dekorace
// ----------------------------------------------------------------------
// Error, warning, success a info se neodvozují z kotevních barev vzhledu.
// Moruše není chyba a Tyrkys není automaticky úspěch. Tyhle čtyři role mají
// v celém domě jeden význam; preset je smí LADIT (specifikace V2 to u nových
// palet dělá), ne PŘEBARVIT na svůj akcent. Kdo nic neladí, dostane tuhle
// výchozí sadu — a to je právě případ všech čtyř zachovaných palet, takže se
// jim po V2 nehnula ani stavová barva.
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
// DATOVÁ PALETA · žebřík jasu, ne duha
// ----------------------------------------------------------------------
// Výchozí dvě řady (pro čtyři zachované palety) zůstávají beze změny. Nové
// palety si nesou VLASTNÍ kurátorovanou řadu ze specifikace — a ta projde
// `fitSeries()` níž, protože kurátorský výběr rozhoduje o ODSTÍNU, kdežto
// o čitelnosti rozhoduje měření.
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
// SIGNATURE DAY · doslovný přepis současné produkční palety
// ----------------------------------------------------------------------
// Tenhle objekt se nesmí „vylepšit". Jsou to hodnoty, které dům nosí, a
// jediný důvod, proč tu jsou, je že rejstřík je jejich domov. §7 zadání V2:
// Signature Day nesmí vizuálně změnit ani o odstín.
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

// ----------------------------------------------------------------------
// VSTUPY OSMI PEVNÝCH VZHLEDŮ
// ----------------------------------------------------------------------
// Zapisuje se jen to, co je rozhodnutí. Zbytek — hrany bez sytosti, zakázaný
// stav, výběr, stín, hero, hover — se odvozuje níž, jedním pravidlem pro
// všechny, aby nový vzhled nebyl nová sada výjimek.
//
// TŘI ZACHOVANÉ VSTUPY (river-night, teal-night, mulberry-paper) jsou DOSLOVA
// ty, které tu stály ve V1.1 jako `river-mist.dark`, `teal-parchment.dark`
// a `mulberry-paper.light`. Nepřepisovaly se, jen se přejmenovaly na
// samostatné vzhledy — proto z nich vypadne přesně táž paleta jako dřív.
const SPECS = {
  "signature-night": {
    polarity: "dark",
    labelCs: "Signature · Noc", labelEn: "Signature · Night",
    anchors: { "Soft Charcoal": "#262725", Linen: "#F4F0EB", Copper: "#B87333" },
    background: "#262725", navigation: "#1E1F1D", surface: "#30312E", card: "#383A35",
    documentSurface: "#2B2C29", elevatedSurface: "#414445",
    text: "#F4F0EB", textSecondary: "#D0C9BE", textMuted: "#AAA399", placeholder: "#B7AFA4",
    border: "#464740", borderStrong: "#5A5B53",
    interactiveAccent: "#B87333", interactiveAccentHover: "#CC8043", interactiveOnAccent: "#171815",
    focusRing: "#C5B49A", selectionSurface: "#4A382B",
    // Nadpis zůstává prostý len — měď v nadpisu by v noci křičela.
    heading: "#F4F0EB",
    // Copper a Sand jsou v noci dvě značkové stopy, ne dekorace.
    sand: "#C5B49A", inkSand: "#D8C7AE",
    status: { success: "#82AA8B", warning: "#D4A45E", error: "#DF7C83", info: "#83A9BA" },
    chart: ["#B87333", "#C5B49A", "#8F9295", "#5C6263", "#7C8C6E", "#E4D9C6"],
    themeColor: "#262725",
  },
};

// ----------------------------------------------------------------------
// ODVOZENÍ · jedno pravidlo pro všech osm vzhledů
// ----------------------------------------------------------------------
// Vzhled dodá kotvy a základní role. Zbytek — hover povrchů, hrany bez
// sytosti, zakázaný stav, výběr, stín, hero, funkční a datové role — vzniká
// tady, stejným postupem pro všechny. Signature Day na konci přepíše svoje
// PRODUKČNÍ hodnoty doslova, takže se nemůže pohnout ani o odstín, a přesto
// prochází stejnou cestou jako ostatní: žádný vzhled není sada výjimek.
function meets(color, surfaces, min, alpha) {
  const c = alpha == null ? color : hexA(color, alpha);
  for (const bg of surfaces) if (contrast(c, bg, bg) < min) return false;
  return true;
}

/**
 * Posune barvu k inkoustu, dokud nesplní práh na VŠECH povrchech, na kterých
 * opravdu leží. Doporučená hodnota ze specifikace je výchozí bod, ne dogma:
 * odvozený token se smí změnit právě tehdy, když selže kontrast — a každý
 * takový posun je vypsaný v THEME-CONTRAST-REPORT.md.
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

/** Dvě série se liší, když je od sebe pozná šedý tisk NEBO barvoslepé oko. */
function seriesApart(a, b) {
  if (ratio(grayscale(a), grayscale(b)) >= 1.18) return true;
  for (const kind of ["protanopia", "deuteranopia", "tritanopia"]) {
    if (cvdDistance(a, b, kind) < 40) return false;
  }
  return true;
}

/**
 * ŽEBŘÍK MÍSTO ROTACE. Kurátorská řada ze specifikace rozhoduje o ODSTÍNU;
 * o čitelnosti rozhoduje měření. Každý člen se nejdřív dorovná na 3:1 na
 * vlastní plotně, a pokud pak splývá s některým už přijatým členem (v šedi
 * i ve všech třech simulacích barvosleposti), posouvá se PO SVÉM ODSTÍNU
 * k inkoustu vzhledu, dokud se neodliší. Směr „k inkoustu" je na tmavé
 * plotně nahoru a na světlé dolů — kontrast na plotně tedy vždycky roste,
 * nikdy neklesá. Žádná automatická rotace odstínu se tu neděje.
 */
function fitSeries(list, plate, ink) {
  const out = [];
  for (const raw of list) {
    let c = ensureOn(raw, [plate], 3, ink);
    if (out.every((k) => seriesApart(c, k))) { out.push(c); continue; }
    let fixed = c;
    for (let i = 1; i <= 100; i++) {
      const step = mixHex(c, ink, i / 100);
      if (contrast(step, plate, plate) >= 3 && out.every((k) => seriesApart(step, k))) { fixed = step; break; }
    }
    out.push(fixed);
  }
  return out;
}

/**
 * Stavová dvojice pro vzhled, který si stavy ladí. Popředí se dorovná na
 * 4,5:1 na všech plochách, pozadí je NEJSYTĚJŠÍ nádech té barvy v poli, pod
 * kterým popředí pořád drží 4,5:1. Kdo stavy neladí, tudy vůbec neprojde
 * a dostane sdílenou tabulku FUNCTIONAL — proto se zachovaným paletám
 * nehnula ani stavová barva.
 */
function deriveStatus(s, mode, fields) {
  const out = {};
  for (const role of ["success", "warning", "error", "info"]) {
    const fg = ensureOn(s.status[role], fields, 4.5, s.text);
    let bg = mixHex(s.background, fg, 0.04);
    for (let k = mode === "light" ? 28 : 36; k >= 4; k--) {
      const c = mixHex(s.background, fg, k / 100);
      if (contrast(fg, c, c) >= 4.5) { bg = c; break; }
    }
    out[role + "Fg"] = fg;
    out[role + "Bg"] = bg;
  }
  return out;
}

function buildPalette(mode, s, legacy) {
  const light = mode === "light";
  const hex = (v) => typeof v === "string" && v.charAt(0) === "#";
  const shadowInk = light ? s.text : mixHex(s.background, BRAND.forest, 0.8);
  const hair = light ? s.text : s.text;
  /* HOVER SE HÝBE OD POPISKU, NE PODLE REŽIMU. Ztmavit měď v Signature zní
     samozřejmě — a shodí to popisek NA mědi pod 4,5:1, protože ten je tmavý
     inkoust. Směr proto určuje popisek: akcent se posouvá pryč od něj, takže
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

  /* Povrchy, na kterých písmo a hrany opravdu leží.
     VYVÝŠENÁ PLOCHA SE PŘIDÁVÁ JEN TAM, KDE JI VZHLED VÝSLOVNĚ URČUJE. Do
     V1.1 se `surfaceRaised` DOPOČÍTÁVALA z karty, takže nikdy nebyla o moc
     světlejší a písmo na ní procházelo samo. Specifikace V2 dává novým
     vzhledům vlastní `elevatedSurface` o patro výš (modal, popover, list nad
     listem) — a tam už ztlumené písmo bez dorovnání neprojde. Kdyby se ale
     tenhle povrch přidal i čtyřem ZACHOVANÝM paletám, posunula by se jim
     dorovnaná písma a produkce by se hnula; ty žádnou vlastní vyvýšenou
     plochu neurčují, takže jejich seznam zůstává přesně ten z V1.1. */
  const hoverCard = light ? mixHex(s.card, s.documentSurface, 0.45) : mixHex(s.card, s.text, 0.06);
  const hoverSheet = light ? mixHex(s.documentSurface, s.card, 0.35) : mixHex(s.documentSurface, s.text, 0.05);
  const heroField = light ? mixHex(s.background, s.text, 0.05) : s.surface;
  const fields = s.elevatedSurface
    ? [s.background, s.navigation, s.surface, s.card, s.documentSurface, s.elevatedSurface,
       hoverCard, hoverSheet, heroField]
    : [s.background, s.navigation, s.surface, s.card, s.documentSurface];
  const fn = s.status ? deriveStatus(s, mode, fields) : FUNCTIONAL[mode];
  const chartSurface = light ? s.card : mixHex(s.card, BRAND.forest, 0.45);
  const series = s.chart ? fitSeries(s.chart, chartSurface, s.text) : CHART[mode].series;
  /* BĚŽNÝ TEXT ZŮSTÁVÁ NEUTRÁLNÍ (V1.1 §3, V2 §14). Sekundární a ztlumené
     písmo se proto neodvozuje z rodinného odstínu, ale z vlastního inkoustu
     vzhledu posunutého k jeho poli — nese tedy jen tolik barvy, kolik má pole
     samo. Dlouhý odstavec se nikde nesází celý modře, tyrkysově ani vínově. */
  const textMuted = ensureOn(s.textMuted || mixHex(s.text, s.background, 0.44), fields, 4.5, s.text);
  const textSecondary = ensureOn(s.textSecondary || mixHex(s.text, s.background, 0.26), fields, 4.5, s.text);
  const link = ensureOn(s.accentInk || s.interactiveAccent, fields, 4.5, s.text);
  const borderStrong = ensureOn(s.borderStrong || mixHex(s.text, s.background, 0.45), fields, 3, s.text);
  const focusRing = ensureOn(s.focusRing || s.interactiveAccent, fields, 3, s.text);
  // Zakázaný stav zůstává čitelný (3:1), ale je zřetelně tišší než ztlumené písmo.
  const textDisabled = ensureOn(mixHex(textMuted, s.background, 0.3), fields, 3, s.text);
  /* NADPIS je jediné běžné písmo, které smí nést rodinný odstín. Ve dne je to
     přímo akcent, který je v každém světlém vzhledu tmavý inkoust; v noci je
     akcent světlý a plný akcent v nadpisu by byl křik — bere se proto jako
     nádech do lněného textu. Signature Day si nese svůj zmrazený Deep Moss,
     Signature Night prostý len, Písek a země modř místo pálené země. */
  const heading = s.heading
    || (light ? ensureOn(s.interactiveAccent, fields, 4.5, s.text) : mixHex(s.text, s.interactiveAccent, 0.35));
  /* NÁPOVĚDA V POLI je vlastní role, ne ztlumené písmo se sníženým krytím.
     Dokud byla, nešla uhlídat: aby prošla 4,5:1 na listu, muselo by ztlumené
     písmo zčernat skoro na barvu textu a hierarchie by zmizela. Vlastní token
     to řeší bez toho, aby se ztlumené písmo hnulo. Krytí se na nápovědu nikde
     nepoužívá — snížilo by kontrast zpátky pod práh. */
  const phField = s.placeholder || mixHex(textMuted, s.documentSurface, 0.2);
  const phWrite = s.placeholderStrong || s.placeholder || mixHex(textMuted, s.documentSurface, 0.15);
  const placeholder = ensureOn(phField, fields, 4.5, s.text);
  const placeholderStrong = ensureOn(phWrite, fields, 4.5, s.text);
  /* VÝBĚR TEXTU · nádech akcentu pod textem. Sytější nádech vypadá líp a hůř
     se čte, takže se ubírá, dokud text na výběru nedrží 4,5:1. Vzhled, který
     si výběr určí sám, se dorovná stejným pravidlem — ne ignoruje. */
  const selectionSurface = s.selectionSurface
    ? (() => {
        for (let i = 0; i <= 100; i++) {
          const c = mixHex(s.selectionSurface, s.background, i / 100);
          if (contrast(s.text, c, c) >= 4.5) return c;
        }
        return s.background;
      })()
    : (() => {
        for (let k = light ? 18 : 24; k >= 4; k--) {
          const c = mixHex(s.background, s.interactiveAccent, k / 100);
          if (contrast(s.text, c, c) >= 4.5) return c;
        }
        return mixHex(s.background, s.interactiveAccent, 0.04);
      })();

  /* VYVÝŠENÁ PLOCHA JE NAVRŽENÁ, NE DOPOČÍTANÁ. Kdo si ji neurčí, žádnou
     nemá — modal a popover mu leží na kartě, přesně jak to dělal dosud.
     Dopočítaná „raised" plocha z V1 zůstává pod svým starým jménem jako
     starší alias (dnes ji nečte žádná komponenta), aby se zachovaným paletám
     nezměnila ani ta. Kdyby se vyvýšená plocha dopočítávala i tam, kde ji
     nikdo nenavrhl, ležel by na ní text, který na ni nebyl dorovnaný. */
  const surfaceRaised = s.elevatedSurface
    || (light ? mixHex(s.card, s.documentSurface, 0.6) : mixHex(s.card, s.text, 0.08));
  const elevatedSurface = s.elevatedSurface || s.card;

  const out = {
    mode,
    polarity: mode,

    // ---- plochy -------------------------------------------------------
    background: s.background,
    navigation: s.navigation,
    surface: s.surface,
    surfaceRaised,
    elevatedSurface,
    surfaceMuted: s.navigation,
    card: s.card,
    documentSurface: s.documentSurface,
    overlay: light ? hexA(s.text, 0.4) : hexA(mixHex(s.background, BRAND.forest, 0.85), 0.62),

    // ---- písmo --------------------------------------------------------
    text: s.text,
    heading,
    textSecondary,
    textMuted,
    textDisabled,
    placeholder,
    placeholderText: placeholder,
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
    // Copper je značka, ne ovládací prvek. V žádném vzhledu nesoutěží
    // s interactiveAccent a nikde se nepřebarvuje.
    brandCopper: BRAND.copper,
    brandLinen: BRAND.linen,
    brandForest: BRAND.forest,

    // ---- Movement Atlas -----------------------------------------------
    // Plát je záměrné lněné pole. Netónuje se, neinvertuje a nemíchá se
    // s podkladem — mění se jen rám kolem něj, aby na tmavém vzhledu nestál
    // bez hrany.
    atlasFrame: BRAND.linen,
    /* RÁM PLÁTU JE INKOUST NA LNU, NE HRANA MOTIVU. Do V1.1 to byl prostě
       `borderStrong` — a ten se dorovnává proti PLOCHÁM VZHLEDU. U tmavého
       vzhledu je to světlá čára, která je na lněném plátu skoro neviditelná
       (Signature Night 2,80:1, Kouř a koření 2,63:1). Jednu barvu, která by
       držela 3:1 zároveň proti nejsvětlejší ploše tmavého vzhledu i proti lnu,
       sestrojit nelze — jsou to dva různé úkoly. Rám proto patří plátu: bere
       silnou hranu vzhledu jako výchozí bod a ztmavuje ji, dokud na lnu
       nedrží. Plát sám se od tmavé stránky odliší i bez něj. */
    atlasBorder: ensureOn(borderStrong, [BRAND.linen], 3, BRAND.forest),

    // ---- funkční role -------------------------------------------------
    successFg: fn.successFg, successBg: fn.successBg,
    warningFg: fn.warningFg, warningBg: fn.warningBg,
    errorFg: fn.errorFg, errorBg: fn.errorBg,
    infoFg: fn.infoFg, infoBg: fn.infoBg,

    // ---- data ---------------------------------------------------------
    chart1: series[0], chart2: series[1], chart3: series[2],
    chart4: series[3], chart5: series[4], chart6: series[5],
    chartSurface,
    grid: hex(s.border) ? mixHex(s.border, s.background, 0.35) : hexA(s.text, 0.12),
    axis: textMuted,

    // ---- starší názvy, na kterých stojí celý dům -----------------------
    // Nejsou to duplicity, je to VEŘEJNÉ API vzhledu. Tisíce míst v obou
    // aplikacích čtou `t.bg`, `t.card`, `t.textMuted`. Migrační vrstva je
    // tady, ne v komponentách. Odstranit ji smí až samostatná vlna, která
    // přepíše volající místa — ne barevná změna.
    bg: s.background,
    bgSidebar: s.navigation,
    textSec: textSecondary,
    accent: s.interactiveAccent,
    accentInk: link,
    onAccent: s.interactiveOnAccent,
    // Sage, Sand a inkSand jsou v Signature značkové stopy; jinde jsou to jen
    // tišší inkousty, protože rodinná barva do běžného písma nepatří.
    sage: s.sage || textSecondary,
    sand: s.sand || textSecondary,
    inkSand: s.inkSand || textSecondary,
    danger: fn.errorFg,
    info: fn.infoFg,
    success: fn.successFg,
    warning: fn.warningFg,
    cardHover: hoverCard,
    callout: s.surface,
    tableHead: s.navigation,
    sheet: s.documentSurface,
    sheetHover: hoverSheet,
    activeNav: hexA(s.interactiveAccent, light ? 0.12 : 0.16),
    hero: heroField,
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
  // Signature Day má poslední slovo: produkční hodnoty se vrací doslova.
  if (legacy) Object.assign(out, legacy);
  // Vlásečnice a dělítko jsou po přepisu totéž.
  out.divider = out.borderSoft;
  out.scrim = out.overlay;
  /* NAV-TOKENY (V3). Postranní panel a dok čtou vlastní role, protože čtyři
     volitelné palety mají tmavou navigaci nad světlým polem. V Signature se
     rovnají PŘESNĚ hodnotám, které panel četl dosud — jiná cesta ke stejným
     číslům, žádná vizuální změna. Otisk dne to hlídá. */
  out.navText = out.text;
  out.navHeading = out.heading;
  out.navTextSec = out.textSec;
  out.navKicker = out.sage;
  out.navIcon = out.sand;
  out.navMuted = out.textMuted;
  out.navAccent = out.accent;
  out.navAccentInk = out.accentInk;
  out.navActiveBg = out.activeNav;
  out.navHairline = out.borderSoft;
  out.navBorder = out.border;
  out.dockBg = out.bg;
  /* Rámové tokeny. Signature žádnou řeč rámů nemá (grammar „none"), takže
     tohle nikdy nic nečte — hodnoty tu jsou jen proto, aby kontrakt byl úplný. */
  out.frameOuter = out.borderStrong;
  out.frameInner = out.border;
  out.frameRail = out.accent;
  out.frameHighlight = out.accent;
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
    /* Naváděcí text ve dne. Odvozený tón by zdědil zelenošedý nádech
       `textMuted` (#5C5F58); tenhle je teplý a patří do světa Linen, mědi
       a inkoustu. Měří 4,64:1 na navigaci až 5,67:1 na listu. */
    placeholder: "#6B655E",
  };
}

/* Náhled musí ukázat to, co ve vzhledu opravdu rozhoduje: pole stránky,
   NAVIGACI, kartu, DOKUMENTOVOU plochu (na které se dlouho píše), nadpis,
   neutrální běžný text, interakční akcent a dva stavy. Dva velké barevné
   obdélníky jsou plakát, ne pracovní prostor (V2 §18). */
function previewOf(p) {
  return Object.freeze({
    background: p.background, navigation: p.navigation, surface: p.surface, card: p.card,
    documentSurface: p.documentSurface,
    text: p.text, textMuted: p.textMuted, heading: p.heading,
    border: p.border, accent: p.interactiveAccent, onAccent: p.interactiveOnAccent,
    /* Tečka stavu v náhledu nese IDENTITU stavu — u výplňových palet je to
       výplň, u ostatních popředí. Rozhoduje sytost, ne jméno palety. */
    success: chroma(p.successBg) > chroma(p.successFg) ? p.successBg : p.successFg,
    error: chroma(p.errorBg) > chroma(p.errorFg) ? p.errorBg : p.errorFg,
    frameOuter: p.frameOuter, frameInner: p.frameInner,
    frameRail: p.frameRail, frameHighlight: p.frameHighlight,
  });
}

function makeFixed(id, def, palette, kind) {
  return Object.freeze({
    id,
    kind: kind || "fixed",
    labelCs: def.labelCs,
    labelEn: def.labelEn,
    polarity: def.polarity,
    recommended: false,
    anchors: Object.freeze(def.anchors),
    palette,
    preview: previewOf(palette),
    themeColor: def.themeColor || palette.background,
    chrome: Object.freeze(def.chrome || { frameGrammar: "none", radius: 0, density: "none", frameTargets: Object.freeze([]) }),
  });
}

// ----------------------------------------------------------------------
// SEDM VOLITELNÝCH PALET · přesné kotvy, žádné odvozování
// ----------------------------------------------------------------------
// Tady se NEPOČÍTÁ. Každá role je doslovná kotva z dodané reference, nebo
// průhlednost přesné kotvy (hierarchie písma, tiché plochy, stíny), nebo
// výslovně povolený servisní inkoust. `exactPalette()` jen skládá kontrakt —
// jediná operace s barvou je `hexA` (kanál alfa), žádný mixHex, žádný ramp.
//
// Alfa u písma není dojem: každá složenina se měří v testu proti ploše, na
// které opravdu leží, a hodnoty tady jsou ty, které prošly.
const A = hexA;

/** Poskládá úplný kontrakt z doslovných rolí. Nic nedopočítává. */
function exactPalette(d) {
  const dark = d.polarity === "dark";
  /* Stavová čtveřice je sdílená — s jedinou výslovnou výjimkou: Tichý zápis
     má ve specifikaci vlastní mapování VÝPLNÍ s párovým popředím. */
  const fn = d.statusOverride || FUNCTIONAL[d.statusMode];
  /* Holé stavové inkousty (t.danger…) kreslí písmo přímo na plochách;
     paleta s výplňovými stavy si pro ně určí čitelné zástupce. */
  const bare = d.statusInk || fn;
  const series = d.chart;
  const shadowInk = d.shadowInk;
  const out = {
    mode: d.polarity,
    polarity: d.polarity,

    background: d.background,
    navigation: d.navigation,
    surface: d.surface,
    surfaceRaised: d.elevatedSurface,
    elevatedSurface: d.elevatedSurface,
    surfaceMuted: d.tableHead,
    card: d.card,
    documentSurface: d.documentSurface,
    overlay: d.overlay,

    text: d.text,
    heading: d.heading || d.text,
    textSecondary: d.textSecondary || d.text,
    textMuted: d.textMuted,
    textDisabled: d.textDisabled,
    placeholder: d.placeholder,
    placeholderText: d.placeholder,
    placeholderStrong: d.placeholder,

    border: d.border,
    borderStrong: d.borderStrong,
    borderSoft: d.borderSoft,

    interactiveAccent: d.interactive,
    /* Najetí a stisk NEMĚNÍ odstín: pravidlo přesných kotev nedovoluje
       ztmavenou odvozeninu a poloprůhledné tlačítko by prosvítalo. Zpětnou
       vazbu nese existující nebarevná vrstva (kurzor, podtržení, stín). */
    interactiveAccentHover: d.interactive,
    interactiveAccentPressed: d.interactive,
    interactiveOnAccent: d.interactiveText,
    selectionSurface: d.selectionSurface,
    selectionText: d.selectionText || d.text,
    focusRing: d.focus,
    link: d.link,
    linkHover: d.link,

    brandCopper: BRAND.copper,
    brandLinen: BRAND.linen,
    brandForest: BRAND.forest,

    atlasFrame: BRAND.linen,
    atlasBorder: d.atlasBorder,

    successFg: fn.successFg, successBg: fn.successBg,
    warningFg: fn.warningFg, warningBg: fn.warningBg,
    errorFg: fn.errorFg, errorBg: fn.errorBg,
    infoFg: fn.infoFg, infoBg: fn.infoBg,

    chart1: series[0], chart2: series[1], chart3: series[2],
    chart4: series[3], chart5: series[4], chart6: series[5],
    chartSurface: d.chartSurface,
    grid: d.grid,
    axis: d.axis,

    bg: d.background,
    bgSidebar: d.navigation,
    textSec: d.textSecondary || d.text,
    accent: d.interactive,
    accentInk: d.link,
    onAccent: d.interactiveText,
    sage: d.quietInk,
    sand: d.quietInk,
    inkSand: d.quietInk,
    danger: bare.errorFg,
    info: bare.infoFg,
    success: bare.successFg,
    warning: bare.warningFg,
    cardHover: d.cardHover,
    callout: d.callout,
    tableHead: d.tableHead,
    sheet: d.documentSurface,
    sheetHover: d.sheetHover,
    activeNav: d.activeNav,
    hero: d.hero,
    heroInk: d.heroInk || d.text,
    heroInkSoft: A(d.heroInk || d.text, 0.78),
    heroLine: A(d.frame.rail, dark ? 0.42 : 0.4),

    /* PLOCHÁ VÝŠKA. Paleta, která staví na linkách, nesmí pod kartu podložit
       rozostřený stín — předloha vyvýšení kreslí vlásečnicí a ničím jiným.
       `flat` proto nahradí celou stupnici stínů jedním prstencem, který jen
       houstne. Ostatní palety se toho nedotknou. */
    shadow: d.flat
      ? `0 0 0 1px ${A(d.text, 0.1)}`
      : dark
      ? `0 0 0 1px ${A(d.text, 0.05)}, 0 2px 4px ${A(shadowInk, 0.36)}, 0 12px 30px -16px ${A(shadowInk, 0.6)}`
      : `0 0 0 1px ${A(shadowInk, 0.04)}, 0 1px 2px ${A(shadowInk, 0.05)}, 0 8px 22px -12px ${A(shadowInk, 0.18)}`,
    shadowLift: d.flat
      ? `0 0 0 1px ${A(d.text, 0.14)}`
      : dark
      ? `0 0 0 1px ${A(d.text, 0.07)}, 0 3px 8px ${A(shadowInk, 0.4)}, 0 24px 50px -22px ${A(shadowInk, 0.66)}`
      : `0 0 0 1px ${A(shadowInk, 0.05)}, 0 2px 5px ${A(shadowInk, 0.06)}, 0 18px 40px -20px ${A(shadowInk, 0.24)}`,
    shadowPop: d.flat
      ? `0 0 0 1px ${A(d.text, 0.18)}`
      : dark
      ? `0 0 0 1px ${A(d.text, 0.09)}, 0 4px 12px -5px ${A(shadowInk, 0.48)}, 0 28px 60px -26px ${A(shadowInk, 0.72)}`
      : `0 0 0 1px ${A(shadowInk, 0.06)}, 0 3px 9px -4px ${A(shadowInk, 0.1)}, 0 20px 46px -22px ${A(shadowInk, 0.26)}`,
    shadowSheet: d.flat
      ? `0 0 0 1px ${A(d.text, 0.22)}`
      : dark
      ? `0 0 0 1px ${A(d.text, 0.11)}, 0 6px 18px -8px ${A(shadowInk, 0.52)}, 0 36px 78px -30px ${A(shadowInk, 0.76)}`
      : `0 0 0 1px ${A(shadowInk, 0.07)}, 0 5px 14px -7px ${A(shadowInk, 0.11)}, 0 28px 68px -30px ${A(shadowInk, 0.3)}`,
    shadowDrag: d.flat
      ? `0 0 0 1px ${d.interactive}`
      : dark
      ? `0 0 0 1px ${A(d.interactive, 0.3)}, 0 8px 22px -10px ${A(shadowInk, 0.58)}, 0 34px 68px -28px ${A(shadowInk, 0.78)}`
      : `0 0 0 1px ${A(d.interactive, 0.22)}, 0 8px 22px -10px ${A(shadowInk, 0.16)}, 0 30px 58px -28px ${A(shadowInk, 0.28)}`,

    navText: d.nav.text,
    navHeading: d.nav.accent,
    navTextSec: d.nav.textSec,
    navKicker: d.nav.kicker,
    navIcon: d.nav.icon,
    navMuted: d.nav.muted,
    navAccent: d.nav.accent,
    navAccentInk: d.nav.accent,
    navActiveBg: d.nav.activeBg,
    navHairline: d.nav.hairline,
    navBorder: d.nav.border,
    dockBg: d.dockBg,

    frameOuter: d.frame.outer,
    frameInner: d.frame.inner,
    frameRail: d.frame.rail,
    frameHighlight: d.frame.highlight,

    /* ŘEZ PATŘÍ VZHLEDU. Skoro každá paleta mlčí a dostane dům (`tokensCss`
       doplní STACK_*); paleta, která si nese vlastní typografii, ji řekne
       tady a propíše se do každého řádku přes `--tm-font-*`. */
    /* Rastr pole · vodorovná linka po sedmi pixelech. Kdo mlčí, nemá rastr
       — a pravidlo v `skinCss()` pak nekreslí nic. */
    scanline: d.scanline || "transparent",
    frameGlow: d.frameGlow || "transparent",

    fontDisplay: (d.type && d.type.display) || "",
    fontLogo: (d.type && d.type.logo) || "",
    fontBody: (d.type && d.type.body) || "",
    fontTag: (d.type && d.type.tag) || "",
  };
  out.divider = out.borderSoft;
  out.scrim = out.overlay;
  return Object.freeze(out);
}

/* ---- Břidlice a hlína · Pantone 7546 C / 7527 U / 420 U / 470 U ---------
   Chladné redakční pole, tmavá břidlicová navigace, střední šeď na kartách,
   hlína jen jako kolejnice, vybraný stav a graf. Dvojitá architektonická
   linka na listu a vybraném panelu. Hlína nikdy nenese běžný text. */
const SLATE = "#243746", WARMGREY = "#DBD6D1", MIDGREY = "#BDBDBD", CLAY = "#A57051";
const DEF_SLATE_CLAY = {
  id: "slate-clay-pantone",
  labelCs: "Břidlice a hlína", labelEn: "Slate and Clay",
  polarity: "light", statusMode: "light",
  anchors: { "Pantone 7546 C": SLATE, "Pantone 7527 U": WARMGREY, "Pantone 420 U": MIDGREY, "Pantone 470 U": CLAY },
  background: WARMGREY, navigation: SLATE, surface: WARMGREY, card: MIDGREY,
  documentSurface: WARMGREY, elevatedSurface: MIDGREY,
  text: SLATE, textSecondary: SLATE,
  textMuted: A(SLATE, 0.87), textDisabled: A(SLATE, 0.68), placeholder: A(SLATE, 0.87),
  border: A(SLATE, 0.3), borderStrong: SLATE, borderSoft: A(SLATE, 0.14),
  interactive: SLATE, interactiveText: WARMGREY, focus: SLATE, link: SLATE,
  selectionSurface: A(CLAY, 0.28),
  quietInk: A(SLATE, 0.82),
  cardHover: A(SLATE, 0.05), sheetHover: A(SLATE, 0.03),
  callout: MIDGREY, tableHead: MIDGREY,
  activeNav: A(CLAY, 0.22),
  hero: MIDGREY, heroInk: SLATE,
  overlay: A(SLATE, 0.45),
  chart: [SLATE, CLAY, MIDGREY, WARMGREY, SLATE, CLAY],
  chartSurface: WARMGREY, grid: A(SLATE, 0.15), axis: A(SLATE, 0.85),
  atlasBorder: SLATE, shadowInk: SLATE, dockBg: SLATE,
  nav: {
    text: WARMGREY, textSec: A(WARMGREY, 0.85), kicker: A(WARMGREY, 0.7),
    icon: A(WARMGREY, 0.78), muted: A(WARMGREY, 0.72), accent: WARMGREY,
    activeBg: A(CLAY, 0.32), hairline: A(WARMGREY, 0.18), border: A(WARMGREY, 0.26),
  },
  frame: { outer: SLATE, inner: MIDGREY, rail: CLAY, highlight: CLAY },
  themeColor: WARMGREY,
  chrome: { frameGrammar: "architectural-double", radius: 10, density: "restrained", frameTargets: ["document", "sheet", "selected"] },
};

/* ---- Monument · #26303B / #9A694E / #EBEBDD -----------------------------
   Tmavá struktura, slonovinové pracovní plochy, hliněná kolejnice. Jedna
   vědomá odchylka od tabulky specifikace: POLE JE SVĚTLÉ. Aplikace sází
   běžný text přímo na pole a kontrakt má jeden inkoust — tmavé pole s tmavým
   textem by rozbilo každou stránku. Tmavý plášť nesou navigace, dok a hero
   pruh; monument-inset rám drží tmavou stavbu kolem světlé plochy.
   Zapsáno v THEME-CONTRAST-REPORT.md. */
const MON_D = "#26303B", MON_C = "#9A694E", MON_I = "#EBEBDD";
const DEF_MONUMENT = {
  id: "monument-clay",
  labelCs: "Monument", labelEn: "Monument",
  polarity: "light", statusMode: "light",
  anchors: { "Monument Blue": MON_D, "Monument Clay": MON_C, Ivory: MON_I },
  background: MON_I, navigation: MON_D, surface: MON_I, card: MON_I,
  documentSurface: MON_I, elevatedSurface: MON_I,
  text: MON_D, textSecondary: MON_D,
  textMuted: A(MON_D, 0.84), textDisabled: A(MON_D, 0.56), placeholder: A(MON_D, 0.84),
  border: A(MON_D, 0.3), borderStrong: MON_D, borderSoft: A(MON_D, 0.13),
  interactive: MON_D, interactiveText: MON_I, focus: MON_C, link: MON_D,
  selectionSurface: A(MON_C, 0.28),
  quietInk: A(MON_D, 0.8),
  cardHover: A(MON_D, 0.05), sheetHover: A(MON_D, 0.03),
  callout: A(MON_D, 0.06), tableHead: A(MON_D, 0.08),
  activeNav: A(MON_C, 0.2),
  hero: MON_D, heroInk: MON_I,
  overlay: A(MON_D, 0.5),
  chart: [MON_D, MON_C, MON_I, MON_D, MON_C, MON_I],
  chartSurface: MON_I, grid: A(MON_D, 0.14), axis: A(MON_D, 0.84),
  atlasBorder: MON_D, shadowInk: MON_D, dockBg: MON_D,
  nav: {
    text: MON_I, textSec: A(MON_I, 0.85), kicker: A(MON_I, 0.68),
    icon: A(MON_I, 0.78), muted: A(MON_I, 0.72), accent: MON_I,
    activeBg: A(MON_C, 0.32), hairline: A(MON_I, 0.18), border: A(MON_I, 0.26),
  },
  frame: { outer: MON_D, inner: MON_I, rail: MON_C, highlight: MON_C },
  themeColor: MON_D,
  chrome: { frameGrammar: "monument-inset", radius: 16, density: "restrained", frameTargets: ["document", "sheet", "selected"] },
};

/* ---- Písek a země · Areia / Azul / Terra Queimada / Verde Opaco ---------
   Pískové pole, modrá stavba, pálená zem jako akce, oliva jako podpora.
   Strata-rails: horní modrá linka, levá zemitá kolejnice, spodní olivová —
   vrstvy jako geologické strata, žádné boho. */
const SAND = "#D3C7AD", AZUL = "#28374A", TERRA = "#754437", VERDE = "#6B6751";
const DEF_SAND_EARTH = {
  id: "sand-burnt-earth",
  labelCs: "Písek a země", labelEn: "Sand and Earth",
  polarity: "light", statusMode: "light",
  anchors: { Areia: SAND, Azul: AZUL, "Terra Queimada": TERRA, "Verde Opaco": VERDE },
  background: SAND, navigation: AZUL, surface: SAND, card: SAND,
  documentSurface: SAND, elevatedSurface: SAND,
  text: AZUL, textSecondary: AZUL,
  textMuted: A(AZUL, 0.85), textDisabled: A(AZUL, 0.68), placeholder: A(AZUL, 0.85),
  border: A(AZUL, 0.32), borderStrong: VERDE, borderSoft: A(AZUL, 0.14),
  interactive: TERRA, interactiveText: SAND, focus: VERDE, link: TERRA,
  selectionSurface: A(TERRA, 0.2),
  quietInk: A(AZUL, 0.8),
  /* Tiché nádechy jsou o stupeň nižší než jinde: pálená zem drží na čistém
     písku 4,75:1 a každé procento modrého nádechu jí ukusuje — odkaz musí
     projít i na najeté kartě a v hlavičce tabulky. */
  cardHover: A(AZUL, 0.02), sheetHover: A(AZUL, 0.02),
  callout: A(AZUL, 0.02), tableHead: A(AZUL, 0.03),
  activeNav: A(TERRA, 0.16),
  hero: A(AZUL, 0.06), heroInk: AZUL,
  overlay: A(AZUL, 0.45),
  chart: [AZUL, TERRA, VERDE, SAND, AZUL, TERRA],
  chartSurface: SAND, grid: A(AZUL, 0.15), axis: A(AZUL, 0.85),
  atlasBorder: AZUL, shadowInk: AZUL, dockBg: AZUL,
  nav: {
    text: SAND, textSec: A(SAND, 0.85), kicker: A(SAND, 0.7),
    icon: A(SAND, 0.78), muted: A(SAND, 0.72), accent: SAND,
    activeBg: A(TERRA, 0.4), hairline: A(SAND, 0.18), border: A(SAND, 0.26),
  },
  frame: { outer: AZUL, inner: VERDE, rail: TERRA, highlight: VERDE },
  themeColor: SAND,
  chrome: { frameGrammar: "strata-rails", radius: 4, density: "restrained", frameTargets: ["document", "sheet", "selected"] },
};

/* ---- Granát a břidlice · #6E2C29 / #F7DEC1 / #364857 --------------------
   Krémové pole, břidlicová stavba, granát jako akce a vybraná výplň.
   Rohové konzoly: vlevo nahoře a vpravo dole, nic víc. Granát a břidlice se
   nikdy nedotýkají textem — vždycky je mezi nimi krém. */
const GARNET = "#6E2C29", CREAM = "#F7DEC1", GSLATE = "#364857";
const DEF_GARNET = {
  id: "garnet-slate",
  labelCs: "Granát a břidlice", labelEn: "Garnet and Slate",
  polarity: "light", statusMode: "light",
  anchors: { Garnet: GARNET, Cream: CREAM, Slate: GSLATE },
  background: CREAM, navigation: GSLATE, surface: CREAM, card: CREAM,
  documentSurface: CREAM, elevatedSurface: CREAM,
  text: GSLATE, textSecondary: GSLATE,
  textMuted: A(GSLATE, 0.85), textDisabled: A(GSLATE, 0.68), placeholder: A(GSLATE, 0.85),
  border: A(GSLATE, 0.32), borderStrong: GARNET, borderSoft: A(GSLATE, 0.14),
  interactive: GARNET, interactiveText: CREAM, focus: GSLATE, link: GARNET,
  selectionSurface: A(GARNET, 0.16),
  quietInk: A(GSLATE, 0.8),
  cardHover: A(GSLATE, 0.05), sheetHover: A(GSLATE, 0.03),
  callout: A(GSLATE, 0.05), tableHead: A(GSLATE, 0.07),
  activeNav: A(GARNET, 0.14),
  hero: A(GSLATE, 0.06), heroInk: GSLATE,
  overlay: A(GSLATE, 0.45),
  chart: [GARNET, GSLATE, CREAM, GARNET, GSLATE, CREAM],
  chartSurface: CREAM, grid: A(GSLATE, 0.15), axis: A(GSLATE, 0.85),
  atlasBorder: GSLATE, shadowInk: GSLATE, dockBg: GSLATE,
  nav: {
    text: CREAM, textSec: A(CREAM, 0.85), kicker: A(CREAM, 0.7),
    icon: A(CREAM, 0.78), muted: A(CREAM, 0.72), accent: CREAM,
    activeBg: A(GARNET, 0.45), hairline: A(CREAM, 0.18), border: A(CREAM, 0.26),
  },
  frame: { outer: GSLATE, inner: GARNET, rail: GARNET, highlight: GSLATE },
  themeColor: CREAM,
  chrome: { frameGrammar: "corner-brackets", radius: 4, density: "restrained", frameTargets: ["document", "sheet", "selected"] },
};

/* ---- Šikon a fosilní písek · pět kotev z reference ----------------------
   Teplá tma: šikonové pole, taupe plochy, fosilní písmo, allspice kolejnice.
   Vnořená fosilie: vnější vlásečnice, vsazený taupe pás, u vybraného tenká
   fosilní linka. Žádné zlato, žádný luxus. */
const SHIKON = "#282227", TAUPE = "#493C3C", MLINK = "#6D5B57", ALLSPICE = "#9B7E6D", FOSSIL = "#D0B08F";
const DEF_SHIKON = {
  id: "shikon-fossil",
  labelCs: "Šikon a fosilní písek", labelEn: "Shikon and Fossil",
  polarity: "dark", statusMode: "dark",
  anchors: { Shikon: SHIKON, "Dark Taupe": TAUPE, "Missing Link": MLINK, "Tempered Allspice": ALLSPICE, "Fossil Tan": FOSSIL },
  background: SHIKON, navigation: TAUPE, surface: TAUPE, card: TAUPE,
  documentSurface: SHIKON, elevatedSurface: TAUPE,
  /* Fosilní písmo drží na taupe ploše 5,16:1 — hierarchie proto smí ubrat
     jen málo krytí, jinak ztlumené písmo spadne pod 4,5 na kartě. */
  text: FOSSIL, textSecondary: A(FOSSIL, 0.96),
  textMuted: A(FOSSIL, 0.94), textDisabled: A(FOSSIL, 0.68), placeholder: A(FOSSIL, 0.94),
  border: MLINK, borderStrong: ALLSPICE, borderSoft: A(FOSSIL, 0.14),
  interactive: FOSSIL, interactiveText: SHIKON, focus: FOSSIL, link: FOSSIL,
  selectionSurface: A(ALLSPICE, 0.35),
  quietInk: A(FOSSIL, 0.8),
  cardHover: A(FOSSIL, 0.02), sheetHover: A(FOSSIL, 0.02),
  callout: TAUPE, tableHead: TAUPE,
  activeNav: A(FOSSIL, 0.16),
  hero: TAUPE, heroInk: FOSSIL,
  overlay: A(SHIKON, 0.65),
  chart: [FOSSIL, ALLSPICE, MLINK, TAUPE, SHIKON, FOSSIL],
  chartSurface: TAUPE, grid: A(FOSSIL, 0.14), axis: A(FOSSIL, 0.85),
  atlasBorder: MLINK, shadowInk: SHIKON, dockBg: SHIKON,
  nav: {
    text: FOSSIL, textSec: A(FOSSIL, 0.92), kicker: A(FOSSIL, 0.7),
    icon: A(FOSSIL, 0.78), muted: A(FOSSIL, 0.72), accent: FOSSIL,
    /* Vybraná položka na taupe navigaci TMAVNE (šikonový nádech) — světlý
       nádech by fosilnímu písmu ubíral kontrast přesně tam, kde je vybrané. */
    activeBg: A(SHIKON, 0.4), hairline: A(FOSSIL, 0.16), border: A(FOSSIL, 0.24),
  },
  frame: { outer: MLINK, inner: TAUPE, rail: ALLSPICE, highlight: FOSSIL },
  themeColor: SHIKON,
  chrome: { frameGrammar: "nested-fossil", radius: 12, density: "restrained", frameTargets: ["document", "sheet", "selected"] },
};

/* ---- Sopečná šeď · pět šedí z reference ---------------------------------
   Technický kámen: vrstvené šedi, hranatá geometrie, stupňovitý rám
   s posunutým krokem. Žádné rozmazané stíny, žádný zelený nádech. */
const VEND = "#292A2A", VULC = "#414445", BLACKGREEN = "#5C6263", FLINT = "#8F9295", NEOTOKYO = "#BEC0C2";
const DEF_VOLCANIC = {
  id: "volcanic-grey",
  labelCs: "Sopečná šeď", labelEn: "Volcanic Grey",
  polarity: "dark", statusMode: "dark",
  anchors: { "The End": VEND, Vulcanised: VULC, "Blackish Green": BLACKGREEN, "Flint Shard": FLINT, "Neo Tokyo Grey": NEOTOKYO },
  background: VEND, navigation: VULC, surface: VULC, card: VULC,
  documentSurface: VEND, elevatedSurface: VULC,
  text: NEOTOKYO, textSecondary: A(NEOTOKYO, 0.95),
  textMuted: A(NEOTOKYO, 0.93), textDisabled: A(NEOTOKYO, 0.68), placeholder: A(NEOTOKYO, 0.93),
  border: BLACKGREEN, borderStrong: FLINT, borderSoft: A(NEOTOKYO, 0.14),
  interactive: NEOTOKYO, interactiveText: VEND, focus: FLINT, link: NEOTOKYO,
  selectionSurface: A(FLINT, 0.3),
  quietInk: A(NEOTOKYO, 0.8),
  cardHover: A(NEOTOKYO, 0.04), sheetHover: A(NEOTOKYO, 0.03),
  callout: VULC, tableHead: VULC,
  activeNav: A(NEOTOKYO, 0.14),
  hero: VULC, heroInk: NEOTOKYO,
  overlay: A(VEND, 0.65),
  chart: [NEOTOKYO, FLINT, BLACKGREEN, VULC, VEND, NEOTOKYO],
  chartSurface: VULC, grid: A(NEOTOKYO, 0.14), axis: A(NEOTOKYO, 0.85),
  atlasBorder: BLACKGREEN, shadowInk: VEND, dockBg: VEND,
  nav: {
    text: NEOTOKYO, textSec: A(NEOTOKYO, 0.92), kicker: A(NEOTOKYO, 0.7),
    icon: A(NEOTOKYO, 0.78), muted: A(NEOTOKYO, 0.72), accent: NEOTOKYO,
    activeBg: A(VEND, 0.45), hairline: A(NEOTOKYO, 0.16), border: A(NEOTOKYO, 0.24),
  },
  frame: { outer: BLACKGREEN, inner: FLINT, rail: VULC, highlight: NEOTOKYO },
  themeColor: VEND,
  chrome: { frameGrammar: "basalt-steps", radius: 4, density: "restrained", frameTargets: ["document", "sheet", "selected"] },
};

/* ---- Americano a chai · pět kotev + servisní len ------------------------
   Teplá noc, dřevo, pražený materiál. Dodaná paleta nemá jedinou světlou
   barvu, která by na svých nejtmavších polích dosáhla 4,5:1 — běžné písmo si
   proto půjčuje lněný servisní inkoust ze Signature (výslovná výjimka ze
   specifikace). Všechna pole, kolejnice a rámy zůstávají přesné kotvy.
   Neodvozuje se žádná nová béžová. */
const AMERICANO = "#1E1D1D", MOCHA = "#5A4D41", CHAI = "#7E6957", ROAST = "#867C70", BREW = "#303031";
const DEF_AMERICANO = {
  id: "americano-chai",
  labelCs: "Americano a chai", labelEn: "Americano and Chai",
  polarity: "dark", statusMode: "dark",
  anchors: { Americano: AMERICANO, Mocha: MOCHA, Chai: CHAI, Roast: ROAST, Brew: BREW },
  background: AMERICANO, navigation: BREW, surface: MOCHA, card: BREW,
  documentSurface: BREW, elevatedSurface: MOCHA,
  text: UTILITY.linen, textSecondary: A(UTILITY.linen, 0.9),
  textMuted: A(UTILITY.linen, 0.8), textDisabled: A(UTILITY.linen, 0.5), placeholder: A(UTILITY.linen, 0.8),
  border: CHAI, borderStrong: ROAST, borderSoft: A(UTILITY.linen, 0.13),
  interactive: UTILITY.linen, interactiveText: UTILITY.ink, focus: UTILITY.linen, link: UTILITY.linen,
  selectionSurface: A(ROAST, 0.35),
  quietInk: A(UTILITY.linen, 0.78),
  cardHover: A(UTILITY.linen, 0.06), sheetHover: A(UTILITY.linen, 0.04),
  callout: MOCHA, tableHead: MOCHA,
  activeNav: A(UTILITY.linen, 0.12),
  hero: MOCHA, heroInk: UTILITY.linen,
  overlay: A(AMERICANO, 0.68),
  chart: [ROAST, CHAI, MOCHA, BREW, AMERICANO, ROAST],
  chartSurface: BREW, grid: A(UTILITY.linen, 0.13), axis: A(UTILITY.linen, 0.82),
  atlasBorder: CHAI, shadowInk: AMERICANO, dockBg: AMERICANO,
  nav: {
    text: UTILITY.linen, textSec: A(UTILITY.linen, 0.88), kicker: A(UTILITY.linen, 0.68),
    icon: A(UTILITY.linen, 0.78), muted: A(UTILITY.linen, 0.72), accent: UTILITY.linen,
    activeBg: A(UTILITY.linen, 0.12), hairline: A(UTILITY.linen, 0.15), border: A(UTILITY.linen, 0.24),
  },
  frame: { outer: MOCHA, inner: CHAI, rail: ROAST, highlight: ROAST },
  themeColor: AMERICANO,
  chrome: { frameGrammar: "woven-rails", radius: 10, density: "restrained", frameTargets: ["document", "sheet", "selected"] },
};

/* ---- Tichý zápis · neutrální kniha záznamů se čtyřmi signály -----------
   Skoro plochá noc: sedm přesných neutrál (#191919 … #F0EFED) a PŘESNĚ
   čtyři signální barvy z reference — Areia, Azul, Terra Queimada, Verde
   Opaco. Azul, Terra ani Verde nedají na tmavých polích 4,5:1, a tak jsou
   to VÝPLNĚ s povinným párovým popředím, ne slabé barevné popisky. Žádné
   další signální barvy neexistují a starší digitální signály (Notion modrá,
   žlutá, korálová…) jsou v této paletě testem zakázané. */
const QL_BG = "#191919", QL_PANEL = "#202020", QL_POP = "#252525",
  QL_SEL = "#2F2F2F", QL_LINE = "#373737", QL_INK = "#F0EFED", QL_INK2 = "#ADA9A3";
const DEF_QUIET_LEDGER = {
  id: "quiet-ledger-night",
  labelCs: "Tichý zápis", labelEn: "Quiet Ledger",
  polarity: "dark", statusMode: "dark",
  anchors: {
    Ink: QL_BG, Panel: QL_PANEL, Popover: QL_POP, Selected: QL_SEL,
    Divider: QL_LINE, Paper: QL_INK, Graphite: QL_INK2,
    Areia: SAND, Azul: AZUL, "Terra Queimada": TERRA, "Verde Opaco": VERDE,
  },
  background: QL_BG, navigation: QL_PANEL, surface: QL_PANEL, card: QL_PANEL,
  documentSurface: QL_BG, elevatedSurface: QL_POP,
  text: QL_INK, textSecondary: QL_INK2,
  textMuted: A(QL_INK2, 0.85), textDisabled: A(QL_INK2, 0.6), placeholder: A(QL_INK2, 0.9),
  border: QL_LINE, borderStrong: QL_INK2, borderSoft: A(QL_LINE, 0.6),
  /* Akcent je Areia: jediná signální barva, která unese písmo na tmavém poli.
     Azul je výplň (aktivní navigace, výběr, informace) — spec ho pro běžné
     písmo výslovně zakazuje; popisek na areiovém tlačítku je Azul (7,2:1). */
  interactive: SAND, interactiveText: AZUL, focus: SAND, link: SAND,
  selectionSurface: QL_SEL, selectionText: QL_INK,
  quietInk: QL_INK2,
  cardHover: A(QL_INK, 0.04), sheetHover: A(QL_INK, 0.03),
  callout: QL_PANEL, tableHead: QL_PANEL,
  activeNav: AZUL,
  hero: QL_PANEL, heroInk: QL_INK,
  overlay: A(QL_BG, 0.68),
  chart: [AZUL, VERDE, SAND, TERRA, AZUL, VERDE],
  chartSurface: QL_PANEL, grid: A(QL_INK, 0.1), axis: QL_INK2,
  /* Rám plátu leží na lnu — světlá grafitová by na něm zmizela. */
  atlasBorder: QL_LINE, shadowInk: QL_BG, dockBg: QL_PANEL,
  /* Přesné sémantické mapování ze specifikace: výplň + párové popředí. */
  statusOverride: {
    successFg: QL_INK, successBg: VERDE,
    warningFg: AZUL, warningBg: SAND,
    errorFg: SAND, errorBg: TERRA,
    infoFg: SAND, infoBg: AZUL,
  },
  /* Holé stavové inkousty: čitelný zástupce identity stavu na tmavém poli.
     Terra ani Azul na neutrálu nečtou — písmo nese jejich párové popředí;
     znak a slovo nesou význam (STATUS_CARRIERS). */
  statusInk: { errorFg: SAND, warningFg: SAND, successFg: QL_INK, infoFg: SAND },
  nav: {
    text: QL_INK, textSec: QL_INK2, kicker: QL_INK2,
    icon: QL_INK2, muted: QL_INK2, accent: SAND,
    activeBg: AZUL, hairline: QL_LINE, border: QL_LINE,
  },
  frame: { outer: QL_LINE, inner: QL_LINE, rail: AZUL, highlight: SAND },
  themeColor: QL_BG,
  chrome: { frameGrammar: "quiet-ledger", radius: 8, density: "restrained", frameTargets: ["sheet", "selected"] },
};


/* ======================================================================
   THANGKA · čtyři vzhledy z minerálních pigmentů vadžrajánového malířství
   ----------------------------------------------------------------------
   Barvy jsou barvy thangky: saze lampy (nagtang, černá thangka se zlatou
   linkou), rumělka (martang, červená thangka), plátkové zlato (sertang,
   zlatá thangka) a plátno s lapisem, malachitem, rumělkou a auripigmentem
   (pět pigmentů, pět buddhovských rodin). Žádný odvozený odstín: každá role
   je doslovná kotva, nebo její průhlednost. Rám je „thangka-mount" —
   hedvábná paspartа se zlatou paspulkou: vlásečnice zvýraznění, pás
   brokátu, druhá vlásečnice. Kotvy nejsou z jedné dodané reference, ale
   z pigmentové tradice; volené tak, aby prošly stejnou přísností jako
   ostatních osm. Každá má vlastní rám: gold-keyline, thangka-mount,
   brocade-band, pigment-rails. */

/* ---- Nagtang · černá thangka ------------------------------------------
   Sazové pole, zlatá linka jako jediná akce, rumělka jen jako kolejnice. */
const NG_SOOT = "#141311", NG_PANEL = "#1C1A17", NG_RAISED = "#25221D", NG_LINE = "#2E2A24",
  NG_SILK = "#EDE3CC", NG_AGED = "#C9BBA0", NG_GOLD = "#D4A54A", NG_CINN = "#B6402A",
  NG_LAPIS = "#4F7FC4", NG_MALA = "#3E8B6A";
const DEF_NAGTANG = {
  id: "nagtang-black",
  labelCs: "Nagtang · černá thangka", labelEn: "Nagtang · Black Thangka",
  polarity: "dark", statusMode: "dark",
  anchors: { Soot: NG_SOOT, Panel: NG_PANEL, Raised: NG_RAISED, Line: NG_LINE, Silk: NG_SILK, "Aged silk": NG_AGED,
    "Gold leaf": NG_GOLD, Cinnabar: NG_CINN, Lapis: NG_LAPIS, Malachite: NG_MALA },
  background: NG_SOOT, navigation: NG_PANEL, surface: NG_PANEL, card: NG_PANEL,
  documentSurface: NG_SOOT, elevatedSurface: NG_RAISED,
  text: NG_SILK, textSecondary: NG_AGED, heading: NG_GOLD,
  textMuted: A(NG_AGED, 0.85), textDisabled: A(NG_AGED, 0.6), placeholder: A(NG_AGED, 0.9),
  border: NG_LINE, borderStrong: NG_AGED, borderSoft: A(NG_LINE, 0.6),
  interactive: NG_GOLD, interactiveText: NG_SOOT, focus: NG_GOLD, link: NG_GOLD,
  selectionSurface: A(NG_GOLD, 0.24), selectionText: NG_SILK,
  quietInk: NG_AGED,
  cardHover: A(NG_SILK, 0.04), sheetHover: A(NG_SILK, 0.03),
  callout: NG_PANEL, tableHead: NG_PANEL,
  activeNav: A(NG_GOLD, 0.18),
  hero: NG_PANEL, heroInk: NG_SILK,
  overlay: A(NG_SOOT, 0.7),
  chart: [NG_GOLD, NG_LAPIS, NG_CINN, NG_MALA, NG_SILK, NG_AGED],
  chartSurface: NG_PANEL, grid: A(NG_SILK, 0.1), axis: NG_AGED,
  atlasBorder: NG_LINE, shadowInk: NG_SOOT, dockBg: NG_PANEL,
  nav: {
    text: NG_SILK, textSec: NG_AGED, kicker: NG_AGED,
    icon: NG_AGED, muted: NG_AGED, accent: NG_GOLD,
    activeBg: A(NG_GOLD, 0.18), hairline: NG_LINE, border: NG_LINE,
  },
  frame: { outer: NG_RAISED, inner: NG_LINE, rail: NG_CINN, highlight: NG_GOLD },
  themeColor: NG_SOOT,
  chrome: { frameGrammar: "gold-keyline", radius: 8, density: "restrained", frameTargets: ["document", "sheet", "selected"] },
};

/* ---- Martang · červená thangka ----------------------------------------
   Lakově rumělkové pole, zlato píše i tlačí, vermilion je kolejnice. */
const MT_LACQ = "#2A1210", MT_GROUND = "#3A1813", MT_RAISED = "#48201A", MT_LINE = "#5A2A22",
  MT_SILK = "#F2E6CF", MT_SAND = "#D9C4A3", MT_GOLD = "#E0B356", MT_VERM = "#C8432B",
  MT_LAPIS = "#5D8BD3", MT_MALA = "#4C9C79";
const DEF_MARTANG = {
  id: "martang-red",
  labelCs: "Martang · červená thangka", labelEn: "Martang · Red Thangka",
  polarity: "dark", statusMode: "dark",
  anchors: { Lacquer: MT_LACQ, "Cinnabar ground": MT_GROUND, Raised: MT_RAISED, Line: MT_LINE, Silk: MT_SILK,
    "Sand silk": MT_SAND, Gold: MT_GOLD, Vermilion: MT_VERM, Lapis: MT_LAPIS, Malachite: MT_MALA },
  background: MT_LACQ, navigation: MT_GROUND, surface: MT_GROUND, card: MT_GROUND,
  documentSurface: MT_LACQ, elevatedSurface: MT_RAISED,
  text: MT_SILK, textSecondary: MT_SAND, heading: MT_GOLD,
  textMuted: A(MT_SAND, 0.85), textDisabled: A(MT_SAND, 0.6), placeholder: A(MT_SAND, 0.9),
  border: MT_LINE, borderStrong: MT_SAND, borderSoft: A(MT_LINE, 0.6),
  interactive: MT_GOLD, interactiveText: MT_LACQ, focus: MT_GOLD, link: MT_GOLD,
  selectionSurface: A(MT_GOLD, 0.24), selectionText: MT_SILK,
  quietInk: MT_SAND,
  cardHover: A(MT_SILK, 0.04), sheetHover: A(MT_SILK, 0.03),
  callout: MT_GROUND, tableHead: MT_GROUND,
  activeNav: A(MT_GOLD, 0.18),
  hero: MT_GROUND, heroInk: MT_SILK,
  overlay: A(MT_LACQ, 0.7),
  chart: [MT_GOLD, MT_LAPIS, MT_VERM, MT_MALA, MT_SILK, MT_SAND],
  chartSurface: MT_GROUND, grid: A(MT_SILK, 0.1), axis: MT_SAND,
  atlasBorder: MT_LINE, shadowInk: MT_LACQ, dockBg: MT_GROUND,
  nav: {
    text: MT_SILK, textSec: MT_SAND, kicker: MT_SAND,
    icon: MT_SAND, muted: MT_SAND, accent: MT_GOLD,
    activeBg: A(MT_GOLD, 0.18), hairline: MT_LINE, border: MT_LINE,
  },
  frame: { outer: MT_RAISED, inner: MT_LINE, rail: MT_VERM, highlight: MT_GOLD },
  themeColor: MT_LACQ,
  chrome: { frameGrammar: "thangka-mount", radius: 8, density: "restrained", frameTargets: ["document", "sheet", "selected"] },
};

/* ---- Sertang · zlatá thangka ------------------------------------------
   Zlaté pole, rumělka kreslí linky i tlačítka, lapis nese nadpis. */
const ST_GROUND = "#EADBAE", ST_DEEP = "#D9C58A", ST_CARD = "#F1E6C4", ST_PAPER = "#F6EED6", ST_RAISED = "#F8F2E0",
  ST_INK = "#2B1E12", ST_UMBER = "#4A3A28", ST_CINN = "#A63A22", ST_LAPIS = "#244A86", ST_MALA = "#2E7A5B", ST_OCHRE = "#7A5A14";
const DEF_SERTANG = {
  id: "sertang-gold",
  labelCs: "Sertang · zlatá thangka", labelEn: "Sertang · Gold Thangka",
  polarity: "light", statusMode: "light",
  anchors: { "Gold ground": ST_GROUND, "Deep gold": ST_DEEP, Card: ST_CARD, Paper: ST_PAPER, Raised: ST_RAISED,
    Ink: ST_INK, Umber: ST_UMBER, Cinnabar: ST_CINN, Lapis: ST_LAPIS, Malachite: ST_MALA, Ochre: ST_OCHRE },
  background: ST_GROUND, navigation: ST_DEEP, surface: ST_CARD, card: ST_CARD,
  documentSurface: ST_PAPER, elevatedSurface: ST_RAISED,
  text: ST_INK, textSecondary: ST_UMBER, heading: ST_LAPIS,
  textMuted: A(ST_UMBER, 0.88), textDisabled: A(ST_UMBER, 0.6), placeholder: A(ST_UMBER, 0.9),
  border: A(ST_INK, 0.28), borderStrong: ST_UMBER, borderSoft: A(ST_INK, 0.12),
  interactive: ST_CINN, interactiveText: ST_PAPER, focus: ST_LAPIS, link: ST_CINN,
  selectionSurface: A(ST_CINN, 0.2),
  quietInk: ST_UMBER,
  cardHover: A(ST_INK, 0.04), sheetHover: A(ST_INK, 0.03),
  callout: ST_CARD, tableHead: ST_CARD,
  activeNav: A(ST_CINN, 0.16),
  hero: ST_DEEP, heroInk: ST_INK,
  overlay: A(ST_INK, 0.45),
  chart: [ST_LAPIS, ST_CINN, ST_MALA, ST_OCHRE, ST_INK, ST_UMBER],
  chartSurface: ST_CARD, grid: A(ST_INK, 0.14), axis: ST_UMBER,
  atlasBorder: ST_INK, shadowInk: ST_INK, dockBg: ST_DEEP,
  nav: {
    text: ST_INK, textSec: ST_UMBER, kicker: ST_UMBER,
    icon: ST_UMBER, muted: ST_UMBER, accent: ST_INK,
    activeBg: A(ST_CINN, 0.18), hairline: A(ST_INK, 0.16), border: A(ST_INK, 0.24),
  },
  frame: { outer: ST_DEEP, inner: ST_CARD, rail: ST_CINN, highlight: ST_CINN },
  themeColor: ST_GROUND,
  chrome: { frameGrammar: "brocade-band", radius: 8, density: "restrained", frameTargets: ["document", "sheet", "selected"] },
};

/* ---- Minerály · plátno, lapis, malachit, rumělka, auripigment -----------
   Nebělené plátno, lapisová navigace nad světlým polem (jako Monument),
   malachit kolejnice, rumělka zvýraznění, auripigment jen v grafu. */
const MN_CANVAS = "#F1EADB", MN_SURF = "#EAE1CD", MN_CARD = "#F8F3E8", MN_PAPER = "#FBF7EE", MN_RAISED = "#FFFDF7",
  MN_INK = "#1F1A16", MN_UMBER = "#4B4238", MN_LAPIS = "#1E3F73", MN_MALA = "#2F7A5C", MN_CINN = "#B8402B", MN_OCHRE = "#9A7420";
const DEF_MINERALY = {
  id: "mineral-pigments",
  labelCs: "Minerály · lapis a malachit", labelEn: "Minerals · Lapis and Malachite",
  polarity: "light", statusMode: "light",
  anchors: { Canvas: MN_CANVAS, Surface: MN_SURF, Card: MN_CARD, Paper: MN_PAPER, Raised: MN_RAISED,
    Ink: MN_INK, Umber: MN_UMBER, Lapis: MN_LAPIS, Malachite: MN_MALA, Cinnabar: MN_CINN, Orpiment: MN_OCHRE },
  background: MN_CANVAS, navigation: MN_LAPIS, surface: MN_SURF, card: MN_CARD,
  documentSurface: MN_PAPER, elevatedSurface: MN_RAISED,
  text: MN_INK, textSecondary: MN_UMBER, heading: MN_LAPIS,
  textMuted: A(MN_UMBER, 0.88), textDisabled: A(MN_UMBER, 0.68), placeholder: A(MN_UMBER, 0.9),
  border: A(MN_INK, 0.26), borderStrong: MN_UMBER, borderSoft: A(MN_INK, 0.11),
  interactive: MN_LAPIS, interactiveText: MN_CANVAS, focus: MN_CINN, link: MN_LAPIS,
  selectionSurface: A(MN_LAPIS, 0.18),
  quietInk: MN_UMBER,
  cardHover: A(MN_INK, 0.04), sheetHover: A(MN_INK, 0.03),
  callout: MN_SURF, tableHead: MN_SURF,
  activeNav: A(MN_MALA, 0.18),
  hero: MN_LAPIS, heroInk: MN_CANVAS,
  overlay: A(MN_INK, 0.45),
  chart: [MN_LAPIS, MN_MALA, MN_CINN, MN_OCHRE, MN_INK, MN_UMBER],
  chartSurface: MN_CARD, grid: A(MN_INK, 0.14), axis: MN_UMBER,
  atlasBorder: MN_INK, shadowInk: MN_INK, dockBg: MN_LAPIS,
  nav: {
    text: MN_CANVAS, textSec: A(MN_CANVAS, 0.86), kicker: A(MN_CANVAS, 0.72),
    icon: A(MN_CANVAS, 0.8), muted: A(MN_CANVAS, 0.74), accent: MN_CANVAS,
    activeBg: A(MN_MALA, 0.4), hairline: A(MN_CANVAS, 0.18), border: A(MN_CANVAS, 0.26),
  },
  frame: { outer: MN_LAPIS, inner: MN_CARD, rail: MN_MALA, highlight: MN_CINN },
  themeColor: MN_CANVAS,
  chrome: { frameGrammar: "pigment-rails", radius: 8, density: "restrained", frameTargets: ["document", "sheet", "selected"] },
};

/* ---- Černý písek · #2D2D2D / #D7C9AE / #A68763 / #EAE0D2 ---------------
   Dodaná paleta (8. 9. 2026): Mine Shaft a Akaroa jako primární, Barley
   Corn a White Rock jako sekundární. Čtyři kotvy, žádná pátá.

   PROČ TMAVÁ POLARITA. Paleta má dvě primární barvy: skoro černou a písek.
   Kdyby pole byl světlý White Rock, ječmen (Barley Corn) by na něm měřil
   2,57:1 — málo i na ohnisko a hranu — a jedna ze čtyř barev by zůstala
   jen na ozdobu. Na Mine Shaft měří ječmen 4,11:1: dost na kolejnici,
   ohnisko, silnou hranu a vybraný panel, málo na běžné písmo. Písmo proto
   nese Akaroa (8,43:1), nadpis a odkaz White Rock (10,55:1), akce je
   Akaroa s popiskem Mine Shaft (8,43:1). Každá kotva má svou práci:
   Mine Shaft = pole a plášť, Akaroa = písmo a akce, Barley Corn = stavba
   (kolejnice, hrana, výběr, tichá výplň), White Rock = důraz.

   RÁM: písečná římsa. List obtahuje jedna písková linka a dole ho podpírá
   třípixelová ječmenová římsa; vybraný panel má ječmenovou kolejnici. */
const BS_MINE = "#2D2D2D", BS_AKAROA = "#D7C9AE", BS_BARLEY = "#A68763", BS_ROCK = "#EAE0D2";
const DEF_BLACK_SAND = {
  id: "black-sand",
  labelCs: "Černý písek", labelEn: "Black Sand",
  polarity: "dark", statusMode: "dark",
  anchors: { "Mine Shaft": BS_MINE, Akaroa: BS_AKAROA, "Barley Corn": BS_BARLEY, "White Rock": BS_ROCK },
  /* Jedno pole i pro kartu — hierarchii dělá písková linka a ječmenová
     římsa, ne další odstín; alfa-plocha pod alfa-plochou by se nedala měřit. */
  background: BS_MINE, navigation: BS_MINE, surface: BS_MINE, card: BS_MINE,
  documentSurface: BS_MINE, elevatedSurface: BS_MINE,
  text: BS_AKAROA, heading: BS_ROCK, textSecondary: BS_AKAROA,
  textMuted: A(BS_AKAROA, 0.78), textDisabled: A(BS_AKAROA, 0.5), placeholder: A(BS_AKAROA, 0.78),
  border: A(BS_AKAROA, 0.16), borderStrong: BS_BARLEY, borderSoft: A(BS_AKAROA, 0.09),
  interactive: BS_AKAROA, interactiveText: BS_MINE, focus: BS_BARLEY, link: BS_ROCK,
  selectionSurface: A(BS_BARLEY, 0.35), selectionText: BS_ROCK,
  quietInk: A(BS_AKAROA, 0.78),
  cardHover: A(BS_AKAROA, 0.06), sheetHover: A(BS_AKAROA, 0.04),
  callout: A(BS_BARLEY, 0.14), tableHead: A(BS_BARLEY, 0.12),
  activeNav: A(BS_BARLEY, 0.3),
  hero: A(BS_BARLEY, 0.18), heroInk: BS_ROCK,
  overlay: A(BS_MINE, 0.75),
  chart: [BS_AKAROA, BS_BARLEY, BS_ROCK, BS_BARLEY, BS_AKAROA, BS_BARLEY],
  chartSurface: BS_MINE, grid: A(BS_AKAROA, 0.12), axis: A(BS_AKAROA, 0.78),
  /* Plát Movement Atlasu je lněný ve všech vzhledech — rám musí být tmavý. */
  atlasBorder: BS_MINE, shadowInk: BS_MINE, dockBg: BS_MINE,
  nav: {
    text: BS_AKAROA, textSec: A(BS_AKAROA, 0.85), kicker: A(BS_AKAROA, 0.65),
    icon: A(BS_AKAROA, 0.78), muted: A(BS_AKAROA, 0.7), accent: BS_ROCK,
    activeBg: A(BS_BARLEY, 0.3), hairline: A(BS_AKAROA, 0.14), border: A(BS_AKAROA, 0.22),
  },
  frame: { outer: A(BS_AKAROA, 0.3), inner: A(BS_AKAROA, 0.14), rail: BS_BARLEY, highlight: BS_ROCK },
  themeColor: BS_MINE,
  chrome: { frameGrammar: "dune-ledge", radius: 12, density: "restrained", frameTargets: ["document", "sheet", "selected"] },
};

/* ---- Hluboká voda · #143D4A / #7B8187 / #F2F1EC / #1E1E1E ---------------
   Dodaná reference (8. 9. 2026): Deep Teal, Slate Grey, Mist White, Basalt
   Black. Bouřkové nebe, tmavé moře, čedič, mlha.

   KAŽDÁ KOTVA MÁ SVOU PRÁCI. Čedič je pole. Petrolej je PLÁŠŤ a AKCE —
   navigace, dok, hrdina, tlačítko (mlha na petroleji 10,34:1) a tichá
   výplň pod vybraným. Mlha píše (14,74:1 na čediči). Břidlice je stavba:
   silná hrana, ohnisko, přílivová linka na listu (4,23:1 na čediči — dost
   na nepísmo, málo na odstavec, proto nikdy nenese text).

   PETROLEJ NA ČEDIČI MĚŘÍ 1,43:1. Proto nikdy nekreslí čáru ani řadu grafu
   na poli — je to plocha, na které něco leží, ne linka. Řady grafu proto
   střídají mlhu a břidlici; petrolej nese vzor a legenda.

   RÁM: přílivová linka. Třípixelová břidlicová linka nahoře, mlžná
   vlásečnice po obvodu; vybraný panel má mlžnou linku dole. */
const DW_TEAL = "#143D4A", DW_SLATE = "#7B8187", DW_MIST = "#F2F1EC", DW_BASALT = "#1E1E1E";
const DEF_DEEP_WATER = {
  id: "deep-water",
  labelCs: "Hluboká voda", labelEn: "Deep Water",
  polarity: "dark", statusMode: "dark",
  anchors: { "Deep Teal": DW_TEAL, "Slate Grey": DW_SLATE, "Mist White": DW_MIST, "Basalt Black": DW_BASALT },
  background: DW_BASALT, navigation: DW_TEAL, surface: DW_BASALT, card: DW_BASALT,
  documentSurface: DW_BASALT, elevatedSurface: DW_BASALT,
  text: DW_MIST, heading: DW_MIST, textSecondary: A(DW_MIST, 0.85),
  textMuted: A(DW_MIST, 0.78), textDisabled: A(DW_MIST, 0.5), placeholder: A(DW_MIST, 0.78),
  border: A(DW_MIST, 0.16), borderStrong: DW_SLATE, borderSoft: A(DW_MIST, 0.09),
  interactive: DW_TEAL, interactiveText: DW_MIST, focus: DW_SLATE, link: DW_MIST,
  selectionSurface: A(DW_TEAL, 0.6), selectionText: DW_MIST,
  quietInk: A(DW_MIST, 0.78),
  cardHover: A(DW_MIST, 0.05), sheetHover: A(DW_MIST, 0.04),
  callout: A(DW_TEAL, 0.45), tableHead: A(DW_TEAL, 0.35),
  activeNav: A(DW_TEAL, 0.6),
  hero: DW_TEAL, heroInk: DW_MIST,
  overlay: A(DW_BASALT, 0.75),
  chart: [DW_MIST, DW_SLATE, DW_MIST, DW_SLATE, DW_MIST, DW_SLATE],
  chartSurface: DW_BASALT, grid: A(DW_MIST, 0.12), axis: A(DW_MIST, 0.78),
  atlasBorder: DW_BASALT, shadowInk: DW_BASALT, dockBg: DW_TEAL,
  nav: {
    text: DW_MIST, textSec: A(DW_MIST, 0.85), kicker: A(DW_MIST, 0.6),
    icon: A(DW_MIST, 0.78), muted: A(DW_MIST, 0.7), accent: DW_MIST,
    activeBg: A(DW_MIST, 0.14), hairline: A(DW_MIST, 0.14), border: A(DW_MIST, 0.22),
  },
  frame: { outer: A(DW_MIST, 0.22), inner: DW_SLATE, rail: DW_SLATE, highlight: DW_MIST },
  themeColor: DW_TEAL,
  chrome: { frameGrammar: "tide-line", radius: 10, density: "restrained", frameTargets: ["document", "sheet", "selected"] },
};

const OPTIONAL_DEFS = Object.freeze({
  "slate-clay-pantone": DEF_SLATE_CLAY,
  "monument-clay": DEF_MONUMENT,
  "sand-burnt-earth": DEF_SAND_EARTH,
  "garnet-slate": DEF_GARNET,
  "shikon-fossil": DEF_SHIKON,
  "volcanic-grey": DEF_VOLCANIC,
  "americano-chai": DEF_AMERICANO,
  "quiet-ledger-night": DEF_QUIET_LEDGER,
  "nagtang-black": DEF_NAGTANG,
  "martang-red": DEF_MARTANG,
  "sertang-gold": DEF_SERTANG,
  "mineral-pigments": DEF_MINERALY,
  "black-sand": DEF_BLACK_SAND,
  "deep-water": DEF_DEEP_WATER,
});

const FIXED = (() => {
  const out = {};
  /* Signature Day je jediný vzhled, který jde do stroje se zmrazenou
     produkční tabulkou navrch — den se nemůže pohnout ani o odstín. */
  const dayPal = buildPalette("light", signatureBase(SIGNATURE_LIGHT), SIGNATURE_LIGHT);
  out["signature-day"] = Object.freeze({
    id: "signature-day",
    kind: "signature",
    labelCs: "Signature · Den",
    labelEn: "Signature · Day",
    polarity: "light",
    recommended: true,
    anchors: Object.freeze({ Linen: BRAND.linen, Ink: BRAND.forest, Copper: BRAND.copper }),
    palette: dayPal,
    preview: previewOf(dayPal),
    themeColor: SIGNATURE_LIGHT.bg,
    chrome: Object.freeze({ frameGrammar: "none", radius: 0, density: "none", frameTargets: Object.freeze([]) }),
  });
  const nightDef = SPECS["signature-night"];
  out["signature-night"] = Object.freeze({
    ...makeFixed("signature-night", nightDef, buildPalette(nightDef.polarity, nightDef, null), "signature"),
    recommended: true,
  });
  for (const id of OPTIONAL_PRESET_IDS) {
    const def = OPTIONAL_DEFS[id];
    out[id] = makeFixed(id, def, exactPalette(def), "optional");
  }
  return Object.freeze(out);
})();

/** Automatika. Není to paleta — je to odkaz na dvě poloviny Signature. */
const AUTO = Object.freeze({
  id: "signature-auto",
  kind: "auto",
  labelCs: "Automaticky · Signature",
  labelEn: "Automatic · Signature",
  polarity: "auto",
  recommended: true,
  anchors: Object.freeze({ Linen: BRAND.linen, Ink: BRAND.forest, Copper: BRAND.copper }),
  resolves: Object.freeze({ light: "signature-day", dark: "signature-night" }),
  palette: null,
  preview: Object.freeze({
    light: FIXED["signature-day"].preview,
    dark: FIXED["signature-night"].preview,
  }),
  themeColor: FIXED["signature-day"].themeColor,
  chrome: Object.freeze({ frameGrammar: "none", radius: 0, density: "none", frameTargets: Object.freeze([]) }),
});

const REGISTRY = Object.freeze({ "signature-auto": AUTO, ...FIXED });

/** Všechny vzhledy v pořadí, ve kterém se nabízejí. Automatika první. */
export const APPEARANCE_PRESETS = Object.freeze(APPEARANCE_PRESET_IDS.map((id) => REGISTRY[id]));

/** Jen pevné vzhledy, v pořadí. */
export const FIXED_PRESETS = Object.freeze(FIXED_PRESET_IDS.map((id) => REGISTRY[id]));

/** Jen sedm volitelných palet, v pořadí. */
export const OPTIONAL_PRESETS = Object.freeze(OPTIONAL_PRESET_IDS.map((id) => REGISTRY[id]));

/** Bezpečné id. Neznámé id nikdy nespadne — vrací výchozí. */
export function resolvePresetId(id) {
  return Object.prototype.hasOwnProperty.call(REGISTRY, id) ? id : DEFAULT_PRESET;
}

/** Záznam vzhledu podle id (i automatiky). */
export function appearancePreset(id) { return REGISTRY[resolvePresetId(id)]; }

/** Patří id do Signature trojice? */
export function isSignaturePreset(id) {
  return SIGNATURE_PRESET_IDS.indexOf(resolvePresetId(id)) !== -1;
}

/**
 * JEDINÝ KANONICKÝ RESOLVER.
 * Vrací PEVNÝ vzhled: pro `signature-auto` podle přání systému, pro cokoli
 * jiného sebe sama. Volitelná paleta systém nikdy neposlouchá.
 */
export function resolveAppearancePreset(id, systemDark) {
  const p = REGISTRY[resolvePresetId(id)];
  if (p.kind !== "auto") return p;
  return REGISTRY[systemDark ? p.resolves.dark : p.resolves.light];
}

/** Vyřešená paleta. */
export function resolveTheme(id, systemDark) { return resolveAppearancePreset(id, systemDark).palette; }

/** "light" | "dark" pro vyřešený vzhled. */
export function presetPolarity(id, systemDark) { return resolveAppearancePreset(id, systemDark).polarity; }

/** Jen automatika poslouchá systém. */
export function isSystemAware(id) { return REGISTRY[resolvePresetId(id)].kind === "auto"; }

/** Řeč rámů vyřešeného vzhledu. Signature: „none". */
export function frameChrome(id, systemDark) { return resolveAppearancePreset(id, systemDark).chrome; }

/** Náhledové tokeny. Automatika vrací { light, dark }, pevný vzhled jeden set. */
export function previewTokens(id) { return REGISTRY[resolvePresetId(id)].preview; }

/** Barva prohlížeče a lišty telefonu. Pole, u Monumentu navigace. */
export function pwaThemeColor(id, systemDark) { return resolveAppearancePreset(id, systemDark).themeColor; }

/** Atributy na <html>. CSS i pre-paint skript čtou totéž. */
export function documentThemeAttrs(id, systemDark) {
  const p = resolveAppearancePreset(id, systemDark);
  return { "data-appearance": p.id, "data-color-mode": p.polarity, "data-frame-grammar": p.chrome.frameGrammar };
}

/** Pole každého pevného vzhledu — mapa pro pre-paint skript v index.html. */
export const PRESET_FIELDS = Object.freeze(FIXED_PRESET_IDS.reduce((acc, id) => {
  acc[id] = REGISTRY[id].palette.background;
  return acc;
}, {}));

/** Barva lišty prohlížeče — jen tam, kde se liší od pole (Monument). */
export const PRESET_THEME_COLORS = Object.freeze(FIXED_PRESET_IDS.reduce((acc, id) => {
  acc[id] = REGISTRY[id].themeColor;
  return acc;
}, {}));

/** Řeč rámů podle id — mapa pro pre-paint skript. */
export const PRESET_GRAMMARS = Object.freeze(FIXED_PRESET_IDS.reduce((acc, id) => {
  acc[id] = REGISTRY[id].chrome.frameGrammar;
  return acc;
}, {}));

/** Stavová paleta. Bere id vzhledu; holé "light"/"dark" zůstává pro starší volání. */
export function statusPalette(idOrMode, systemDark) {
  if (idOrMode === "light" || idOrMode === "dark") return FUNCTIONAL[idOrMode];
  const p = resolveAppearancePreset(idOrMode, systemDark).palette;
  return {
    successFg: p.successFg, successBg: p.successBg,
    warningFg: p.warningFg, warningBg: p.warningBg,
    errorFg: p.errorFg, errorBg: p.errorBg,
    infoFg: p.infoFg, infoBg: p.infoBg,
  };
}

/** Datová paleta i s nebarevným nosičem série. */
export function chartPalette(idOrMode, systemDark) {
  if (idOrMode === "light" || idOrMode === "dark") {
    return { series: CHART[idOrMode].series, patterns: CHART_PATTERNS };
  }
  const p = resolveAppearancePreset(idOrMode, systemDark).palette;
  return {
    series: Object.freeze([p.chart1, p.chart2, p.chart3, p.chart4, p.chart5, p.chart6]),
    patterns: CHART_PATTERNS,
  };
}

/** Kanonický dokumentový motiv pro tisk, PDF a export. Nikdy nesleduje volbu. */
export const DOCUMENT_THEME = FIXED["signature-day"].palette;

// ----------------------------------------------------------------------
// MIGRACE · nikdo se po nasazení nesmí probudit do jiné palety
// ----------------------------------------------------------------------
// Generace uložené volby:
//
//   v0   `tm-theme` = "light" | "dark"                        (před V1)
//   v2   { version: 2, family, mode }                         (V1 a V1.1)
//   v3   { version: 3, preset }                               (V2)
//   v4   { version: 4, preset, signature }                    (V3)
//
// Čtvrtá generace nese DVĚ věci: zvolený vzhled a POSLEDNÍ SIGNATURE VOLBU.
// Kdo si zapne volitelnou paletu a pak se vrátí, dostane zpátky přesně ten
// Signature režim, který měl předtím — automatiku, den, nebo noc. Klíč
// zůstává `tm-appearance-v3`: starší build V2 si z něj přečte neznámý preset
// a bezpečně spadne na automatiku.
//
// ZRUŠENÉ PALETY V2 SE NEZTRÁCEJÍ. Mapují se na nejbližší dochovanou
// identitu podle specifikace V3; Tyrkys v noci žádnou blízkou nemá, a tak
// podle pravidla „když si nejsi jistý, Signature" končí na Signature · Noc —
// tmavý zůstává tmavým a nikoho nepřekvapí neznámá paleta.
export const APPEARANCE_VERSION = 4;

/** Zrušený preset V2 → nejbližší dochovaná identita V3. */
const LEGACY_PRESET_MIGRATION = Object.freeze({
  "slate-clay": "slate-clay-pantone",
  "sand-earth": "sand-burnt-earth",
  "smoke-spice": "shikon-fossil",
  "river-night": "volcanic-grey",
  "mulberry-paper": "garnet-slate",
  "teal-night": "signature-night",
});

/** Rodina × režim (V1/V1.1) → vzhled V3. */
const FAMILY_MIGRATION = Object.freeze({
  signature: Object.freeze({ system: "signature-auto", light: "signature-day", dark: "signature-night" }),
  "river-mist": "volcanic-grey",
  "teal-parchment": "signature-night",
  "mulberry-paper": "garnet-slate",
  "atlantic-sky": "slate-clay-pantone",
  "clay-alabaster": "sand-burnt-earth",
  "olive-gold": "sand-burnt-earth",
});

/** Starý klíč `tm-theme` (v0) → preset. */
const LEGACY_MODE_MIGRATION = Object.freeze({
  light: "signature-day",
  dark: "signature-night",
  system: "signature-auto",
});

function migratePresetId(id) {
  if (Object.prototype.hasOwnProperty.call(LEGACY_PRESET_MIGRATION, id)) return LEGACY_PRESET_MIGRATION[id];
  return resolvePresetId(id);
}

/** Ať přijde cokoli, ven jde platná volba V4: { version, preset, signature }. */
export function normalizeAppearance(value) {
  if (typeof value === "string") {
    const preset = migratePresetId(value);
    return { version: APPEARANCE_VERSION, preset, signature: isSignaturePreset(preset) ? preset : DEFAULT_PRESET };
  }
  const v = value && typeof value === "object" ? value : {};
  let preset = DEFAULT_PRESET;
  if (typeof v.preset === "string") preset = migratePresetId(v.preset);
  else if (typeof v.family === "string") preset = presetFromFamily(v.family, v.mode);
  let signature = typeof v.signature === "string" && isSignaturePreset(v.signature) && v.signature !== undefined
    ? resolvePresetId(v.signature)
    : null;
  if (!signature || !isSignaturePreset(signature)) signature = isSignaturePreset(preset) ? preset : DEFAULT_PRESET;
  return { version: APPEARANCE_VERSION, preset, signature };
}

/** Rodina + režim → preset. Neznámá rodina končí na automatice. */
export function presetFromFamily(family, mode) {
  const m = FAMILY_MIGRATION[family];
  if (!m) return DEFAULT_PRESET;
  if (typeof m === "string") return m;
  return m[mode === "light" || mode === "dark" ? mode : "system"];
}

/**
 * @param {string|null} raw    obsah nového klíče (JSON), nebo null
 * @param {string|null} legacy obsah starého klíče `tm-theme` ("light"|"dark"), nebo null
 */
export function migrateLegacyAppearance(raw, legacy) {
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && (typeof parsed === "object" || typeof parsed === "string")) return normalizeAppearance(parsed);
    } catch (e) { /* rozbitý JSON není důvod k pádu, je důvod k automatice */ }
  }
  if (Object.prototype.hasOwnProperty.call(LEGACY_MODE_MIGRATION, legacy)) {
    const preset = LEGACY_MODE_MIGRATION[legacy];
    return { version: APPEARANCE_VERSION, preset, signature: preset };
  }
  return { version: APPEARANCE_VERSION, preset: DEFAULT_PRESET, signature: DEFAULT_PRESET };
}

/** Návrat na doporučený vzhled. */
export function signatureAppearance() {
  return { version: APPEARANCE_VERSION, preset: DEFAULT_PRESET, signature: DEFAULT_PRESET };
}

/** Zvol vzhled. Signature volba se pamatuje, volitelná paleta ji nepřepíše. */
export function selectAppearance(pref, id) {
  const clean = normalizeAppearance(pref);
  const preset = resolvePresetId(id);
  return {
    version: APPEARANCE_VERSION,
    preset,
    signature: isSignaturePreset(preset) ? preset : clean.signature,
  };
}

/** „Použít Signature" — vrátí přesně tu Signature volbu, která tu byla. */
export function returnToSignature(pref) {
  const clean = normalizeAppearance(pref);
  return { version: APPEARANCE_VERSION, preset: clean.signature, signature: clean.signature };
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

/** Barvy a nosič pro jeden tón v daném vzhledu. */
export function toneStyle(tone, idOrMode, systemDark) {
  const role = TONE_ROLES[tone] || "neutral";
  const carrier = STATUS_CARRIERS[role];
  const pal = statusPalette(idOrMode, systemDark);
  if (role === "neutral") return { role, carrier, fg: null, bg: null };
  return { role, carrier, fg: pal[role + "Fg"], bg: pal[role + "Bg"] };
}
