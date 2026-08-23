// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/ui/themeRegistry.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// ----------------------------------------------------------------------
// REJSTŘÍK VZHLEDŮ · devět kurátorovaných presetů, jeden kontrakt
// ----------------------------------------------------------------------
// Do V1.1 byl motiv DVOJICE: rodina × režim. Sedm rodin krát dvě světla dalo
// čtrnáct palet — a z nich byla dobrá zhruba polovina. Druhá polovina vznikla
// jen ze symetrie: ke každé denní paletě se dopočítala noční a naopak, i tam,
// kde ta druhá půlka nikdy neměla vlastní důvod existovat. Výsledek byl
// katalog, ne výběr.
//
// V2 to obrací. Vzhled je JEDNA hodnota:
//
//     "slate-clay"
//
// Devět položek, z toho osm PEVNÝCH dokončených vzhledů a jediná automatická:
// `signature-auto`, která podle `prefers-color-scheme` sáhne po Signature Day
// nebo Signature Night. Nic jiného se systémem nehýbe — kdo si zvolí Kouř
// a koření, má Kouř a koření i v poledne.
//
// CO SE NEZMĚNILO. Odvozovací stroj z V1.1 zůstal celý: role, dopočet hran,
// nápovědy, hoveru a stínů, deterministické dorovnání kontrastu (`ensureOn`)
// i vrstva starších názvů, na které stojí tisíce míst v obou aplikacích.
// Čtyři palety, které dům opravdu nosí — Signature Day, Řeka v noci, Tyrkys
// v noci a Moruše a papír — procházejí tímtéž strojem z týchž vstupů, takže
// vycházejí ZNAK PO ZNAKU stejné jako před V2. `theme-preserved.test.js` to
// měří proti zapsanému otisku produkce.
//
// CO SE ZMĚNILO. Signature Night dostal ze specifikace V2 měkčí uhlový žebřík
// (dřív skoro černý), přibyly tři hotové palety (Břidlice a hlína, Písek
// a země, Kouř a koření) a zmizely protějšky, které nikdo nevybíral: River
// light, Teal light, Mulberry dark, celá Hlína a alabastr, Atlantik a obloha
// i Oliva a zlato. Uložené volby se na ně nezapomínají — migrace je převádí
// (viz §MIGRACE níž).
//
// Komponenty se nikdy neptají, JAKÝ vzhled je zapnutý. Ptají se na roli:
// `t.card`, `t.textMuted`, `t.focusRing`. Proto v aplikaci není a nesmí
// vzniknout `if (preset === "smoke-spice")`.
//
// Barevná autorita: tanmay_theme_system_v2_curated_palette_spec.md.
// Odchylky od doporučených hodnot jsou vypsané i s důvodem v
// Work/web-application/THEME-CONTRAST-REPORT.md.

import { hexA, mixHex } from "./color.js";
import { contrast, luminance, grayscale, ratio, cvdDistance } from "./contrast.js";

/** Značkové body. Copper je značka, ne interakční barva. */
export const BRAND = Object.freeze({ copper: "#B87333", linen: "#F4F0EB", forest: "#1C1C1A" });

/* Pořadí je pořadí v Nastavení: nejdřív automatika, pak Signature ve dvou
   světlech, pak šest hotových alternativ od nejtišší po nejvýraznější. */
export const APPEARANCE_PRESET_IDS = Object.freeze([
  "signature-auto",
  "signature-day",
  "signature-night",
  "river-night",
  "teal-night",
  "mulberry-paper",
  "slate-clay",
  "sand-earth",
  "smoke-spice",
]);

/** Pevné vzhledy — všechno kromě automatiky. Systém s nimi nehýbe. */
export const FIXED_PRESET_IDS = Object.freeze(APPEARANCE_PRESET_IDS.filter((id) => id !== "signature-auto"));

/* VÝCHOZÍ JE AUTOMATIKA. Ve V1.1 byl výchozí režim „světlo", protože tehdy
   existoval globální přepínač den/noc a automatika byla jen jedna z jeho tří
   poloh. Ve V2 je Automaticky · Signature první položkou výběru a specifikace
   ji určuje i jako cíl pro neznámou a chybějící hodnotu. Kdo si nikdy nic
   nezvolil, dostane tedy Signature podle svého systému. */
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
  /* SIGNATURE · NOC · V2.
     V1.1 opravila barvu (pryč od mechu, k uhlu a mědi), ale nechala příliš
     tvrdý near-black žebřík: pole #0F100E, navigace #0B0C0A. Na displeji to
     byl OLED, ne večerní pokoj — a jednotlivé vrstvy se od sebe daly poznat
     jen podle hrany. V2 celý žebřík zvedá a rozestupuje podle specifikace:
     šest rozlišitelných vrstev nad sebou, měkký uhel místo černé, len jako
     písmo, měď a písek jako akcenty. Žádná zeleň, modř ani fialový nádech. */
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

  /* ŘEKA V NOCI · zachováno beze změny z V1.1 (`river-mist.dark`). */
  "river-night": {
    polarity: "dark",
    labelCs: "Řeka v noci", labelEn: "River Night",
    anchors: { "River Slate": "#4F646B", Mist: "#E5ECEA", "Warm Sand": "#C5B49A" },
    background: "#101315", navigation: "#0C0F11", surface: "#192125", card: "#222B2F",
    documentSurface: "#151B1E", text: "#E8EFEC", textSecondary: "#C7D1CE", textMuted: "#98A7A5",
    border: "#3A484D", borderStrong: "#56686E",
    interactiveAccent: "#C5B49A", interactiveAccentHover: "#D7C9B3", interactiveOnAccent: "#101315",
    focusRing: "#AFC2C4",
  },

  /* TYRKYS V NOCI · zachováno beze změny z V1.1 (`teal-parchment.dark`). */
  "teal-night": {
    polarity: "dark",
    labelCs: "Tyrkys v noci", labelEn: "Teal Night",
    anchors: { "Authentic Teal": "#035352", "Sidecar Yellow": "#F3E8BC" },
    background: "#0E1312", navigation: "#0A0F0E", surface: "#162321", card: "#1D2E2B",
    documentSurface: "#121B19", text: "#F4EBC8", textSecondary: "#D9D0AC", textMuted: "#A5AA8E",
    border: "#35504C", borderStrong: "#4F706A",
    interactiveAccent: "#E5D59B", interactiveAccentHover: "#F2E4AD", interactiveOnAccent: "#0E1312",
    focusRing: "#8CC9C0",
  },

  /* MORUŠE A PAPÍR · zachováno beze změny z V1.1 (`mulberry-paper.light`). */
  "mulberry-paper": {
    polarity: "light",
    labelCs: "Moruše a papír", labelEn: "Mulberry Paper",
    anchors: { Mulberry: "#5A2132", Paper: "#EFE9E9" },
    background: "#F1E8EA", navigation: "#E8DADD", surface: "#F7F0F1", card: "#FCF8F8",
    documentSurface: "#FDFBFA", text: "#241A1E",
    border: "#CEBBC1", borderStrong: "#B3919C",
    interactiveAccent: "#5A2132", interactiveAccentHover: "#461827", interactiveOnAccent: "#F1E8EA",
    focusRing: "#5A2132",
  },

  /* BŘIDLICE A HLÍNA · nový vzhled V2.
     Chladné redakční pole s teplým hliněným přerušením. Tělo textu je
     břidlicová modř, hlína je AKCENT — kotva `#A57051` je na malé interakční
     písmo příliš světlá, akcentem je proto tmavší odvozenina ze specifikace.
     Světlá alternativa s nejjasnější stavbou; nesmí působit jako korporátní
     navy dashboard. */
  "slate-clay": {
    polarity: "light",
    labelCs: "Břidlice a hlína", labelEn: "Slate Clay",
    anchors: { "Blue Slate": "#243746", "Warm Grey": "#DBD6D1", Clay: "#A57051" },
    background: "#DBD6D1", navigation: "#C8C5C1", surface: "#E8E4DF", card: "#F2EFEB",
    documentSurface: "#FAF8F5", elevatedSurface: "#FFFFFF",
    text: "#243746", textSecondary: "#3F4F59", textMuted: "#48545C", placeholder: "#48545C",
    border: "#B8B5B1", borderStrong: "#929BA1",
    interactiveAccent: "#75452F", interactiveAccentHover: "#623924", interactiveOnAccent: "#FAF8F5",
    focusRing: "#36566A", selectionSurface: "#E4D2C8",
    // Kotevní hlína zůstává jako referenční / datový bod, ne jako plocha.
    decorative: "#A57051",
    status: { success: "#3F6A50", warning: "#81551D", error: "#8B3138", info: "#365F73" },
    chart: ["#75452F", "#243746", "#7D8A92", "#A57051", "#B87333", "#3F5D3A"],
    themeColor: "#DBD6D1",
  },

  /* PÍSEK A ZEMĚ · nový vzhled V2.
     Teplé přírodní redakční pole s tmavě modrou stavbou. Modř nese tělo textu
     i nadpis, pálená zem je akcent (ne chyba), tlumená oliva podpírá graf
     a ohnisko (ne velké zelené plochy). Nesmí sklouznout do rustikálního,
     boho ani spa výrazu. */
  "sand-earth": {
    polarity: "light",
    labelCs: "Písek a země", labelEn: "Sand Earth",
    anchors: { Sand: "#D3C7AD", "Dark Blue": "#28374A", "Burnt Earth": "#754437", "Muted Olive": "#6B6751" },
    background: "#D3C7AD", navigation: "#C4B99F", surface: "#E0D6C0", card: "#EAE3D2",
    documentSurface: "#F2EBDD", elevatedSurface: "#FAF5E9",
    text: "#28374A", textSecondary: "#3F4650", textMuted: "#464A43", placeholder: "#464A43",
    border: "#B6A98D", borderStrong: "#8E826A",
    interactiveAccent: "#6E3D32", interactiveAccentHover: "#5C3028", interactiveOnAccent: "#F2EBDD",
    focusRing: "#6B6751", selectionSurface: "#D8C9AA",
    /* NADPIS NESE MODŘ, NE PÁLENOU ZEM. Odvozený nadpis by v každém světlém
       vzhledu vzal akcent; tady to specifikace výslovně obrací — modř drží
       stavbu (tělo, nadpis, navigační text), zem drží akci. */
    heading: "#28374A",
    status: { success: "#45654A", warning: "#79531C", error: "#8A3035", info: "#365D70" },
    chart: ["#6E3D32", "#28374A", "#6B6751", "#A57051", "#B87333", "#5A4E77"],
    themeColor: "#D3C7AD",
  },

  /* KOUŘ A KOŘENÍ · nový vzhled V2.
     Teplý tmavý materiál: uhel, švestkově hnědá, taupe a fosilní tan. Tan nese
     akcent a vybraný nadpis, tělo textu zůstává bledě neutrální. Nesmí
     působit luxusně, kosmeticky ani jako čokoládový obal — žádný lesk,
     přechod ani kovová měď. */
  "smoke-spice": {
    polarity: "dark",
    labelCs: "Kouř a koření", labelEn: "Smoke Spice",
    anchors: { Shikon: "#282227", "Dark Taupe": "#493C3C", "Fossil Tan": "#D0B08F" },
    background: "#282227", navigation: "#1E1D1D", surface: "#403638", card: "#493C3C",
    documentSurface: "#312A2C", elevatedSurface: "#554643",
    /* BĚŽNÝ TEXT NENÍ AKCENT. Tabulka ve specifikaci dává sekundárnímu písmu
       i nápovědě přesně hodnotu akcentu (`#D0B08F`) — jenže tatáž
       specifikace tři odstavce nad tím říká „body copy stays pale neutral"
       a zadání §14 zakazuje, aby běžný odstavec nesl `interactiveAccent`.
       Když si dva vlastní odstavce protiřečí, platí pravidlo, ne buňka
       tabulky: písmo si nechává JAS, který specifikace zvolila, a odevzdá
       polovinu sytosti. Fosilní tan tak zůstává akcentem a odkaz se v textu
       pozná. Zapsáno v THEME-CONTRAST-REPORT.md. */
    text: "#F0E2D3", textSecondary: "#D5C6B8", textMuted: "#B8A89C", placeholder: "#CCBDAF",
    border: "#6D5B57", borderStrong: "#8B7167",
    interactiveAccent: "#D0B08F", interactiveAccentHover: "#E0C39F", interactiveOnAccent: "#282227",
    focusRing: "#9B7E6D", selectionSurface: "#5A4744",
    /* ŽÁDNÉ `sand` ANI `inkSand`. Starší tokeny nesou v Signature značkovou
       stopu (Warm Sand vedle mědi); jinde jsou to prostě tišší inkousty
       a dopočítají se ze sekundárního písma. Kdyby si je Kouř a koření nastavil
       na fosilní tan, byl by to přesně akcent — a `t.sand` kreslí ikony
       v navigaci, takže by akcent najednou nesla třetina viditelných prvků.
       Naměřeno v prohlížeči: 34 % proti stropu 18 % (§ Accent coverage). */
    status: { success: "#86AA8D", warning: "#D5A45D", error: "#E07C82", info: "#87AABA" },
    chart: ["#D0B08F", "#9B7E6D", "#6D5B57", "#B87333", "#8F9295", "#EFE3D2"],
    themeColor: "#282227",
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
    success: p.successFg, error: p.errorFg,
  });
}

function makeFixed(id, def, palette) {
  return Object.freeze({
    id,
    kind: "fixed",
    labelCs: def.labelCs,
    labelEn: def.labelEn,
    polarity: def.polarity,
    recommended: false,
    anchors: Object.freeze(def.anchors),
    palette,
    preview: previewOf(palette),
    themeColor: def.themeColor || palette.background,
  });
}

const FIXED = (() => {
  const out = {};
  /* Signature Day je jediný vzhled, který jde do stroje se zmrazenou
     produkční tabulkou navrch — ta má poslední slovo, takže se den nemůže
     pohnout ani o odstín, a přesto prochází stejnou cestou jako ostatní. */
  out["signature-day"] = Object.freeze({
    id: "signature-day",
    kind: "fixed",
    labelCs: "Signature · Den",
    labelEn: "Signature · Day",
    polarity: "light",
    recommended: true,
    anchors: Object.freeze({ Linen: BRAND.linen, Ink: BRAND.forest, Copper: BRAND.copper }),
    palette: buildPalette("light", signatureBase(SIGNATURE_LIGHT), SIGNATURE_LIGHT),
    preview: null,
    themeColor: SIGNATURE_LIGHT.bg,
  });
  // preview se doplní až po zmrazení palety (previewOf čte hotové role)
  const day = out["signature-day"];
  out["signature-day"] = Object.freeze({ ...day, preview: previewOf(day.palette) });

  for (const id of FIXED_PRESET_IDS) {
    if (id === "signature-day") continue;
    const def = SPECS[id];
    out[id] = makeFixed(id, def, buildPalette(def.polarity, def, null));
  }
  // Signature Night je doporučená noční polovina normy domu.
  out["signature-night"] = Object.freeze({ ...out["signature-night"], recommended: true });
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
});

const REGISTRY = Object.freeze({ "signature-auto": AUTO, ...FIXED });

/** Všechny vzhledy v pořadí, ve kterém se nabízejí. Automatika první. */
export const APPEARANCE_PRESETS = Object.freeze(APPEARANCE_PRESET_IDS.map((id) => REGISTRY[id]));

/** Jen pevné vzhledy, v pořadí. */
export const FIXED_PRESETS = Object.freeze(FIXED_PRESET_IDS.map((id) => REGISTRY[id]));

/** Bezpečné id. Neznámé id nikdy nespadne — vrací výchozí. */
export function resolvePresetId(id) {
  return Object.prototype.hasOwnProperty.call(REGISTRY, id) ? id : DEFAULT_PRESET;
}

/** Záznam vzhledu podle id (i automatiky). */
export function appearancePreset(id) { return REGISTRY[resolvePresetId(id)]; }

/**
 * JEDINÝ KANONICKÝ RESOLVER.
 * Vrací PEVNÝ vzhled: pro `signature-auto` podle přání systému, pro cokoli
 * jiného sebe sama. Fixní vzhled systém nikdy nepřepíše — to je celý rozdíl
 * mezi V1.1 a V2.
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

/** Náhledové tokeny. Automatika vrací { light, dark }, pevný vzhled jeden set. */
export function previewTokens(id) { return REGISTRY[resolvePresetId(id)].preview; }

/** Barva prohlížeče a lišty telefonu. Pole aplikace, nic jiného. */
export function pwaThemeColor(id, systemDark) { return resolveAppearancePreset(id, systemDark).themeColor; }

/** Atributy na <html>. CSS i pre-paint skript čtou totéž. */
export function documentThemeAttrs(id, systemDark) {
  const p = resolveAppearancePreset(id, systemDark);
  return { "data-appearance": p.id, "data-color-mode": p.polarity };
}

/** Pole každého pevného vzhledu — mapa pro pre-paint skript v index.html. */
export const PRESET_FIELDS = Object.freeze(FIXED_PRESET_IDS.reduce((acc, id) => {
  acc[id] = REGISTRY[id].themeColor;
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
// Tři generace uložené volby:
//
//   v0   `tm-theme` = "light" | "dark"                     (před V1)
//   v2   { version: 2, family, mode }                      (V1 a V1.1)
//   v3   { version: 3, preset }                            (V2)
//
// Převod je čistá funkce, aby se dal otestovat bez prohlížeče: uložený řetězec
// dovnitř, platná volba ven. Druhý běh je no-op. Cokoli nesrozumitelného končí
// na `signature-auto` — do rozbitého vzhledu se nikdo nesmí zavřít.
//
// ZRUŠENÉ RODINY SE NEZTRÁCEJÍ. Kdo měl Atlantik, dostane Břidlici a hlínu;
// kdo měl Hlínu nebo Olivu, dostane Písek a zemi. Je to nejbližší dochovaný
// vzhled, ne náhoda — a je to jednosměrné, protože zrušené palety už v běhu
// neexistují.
export const APPEARANCE_VERSION = 3;

/** Rodina × režim (v2) → preset (v3). Tabulka je ze specifikace. */
const FAMILY_MIGRATION = Object.freeze({
  signature: Object.freeze({ system: "signature-auto", light: "signature-day", dark: "signature-night" }),
  "river-mist": "river-night",
  "teal-parchment": "teal-night",
  "mulberry-paper": "mulberry-paper",
  "atlantic-sky": "slate-clay",
  "clay-alabaster": "sand-earth",
  "olive-gold": "sand-earth",
});

/** Starý klíč `tm-theme` (v0) → preset. */
const LEGACY_MODE_MIGRATION = Object.freeze({
  light: "signature-day",
  dark: "signature-night",
  system: "signature-auto",
});

/** Ať přijde cokoli, ven jde platná volba V3. */
export function normalizeAppearance(value) {
  if (typeof value === "string") return { version: APPEARANCE_VERSION, preset: resolvePresetId(value) };
  const v = value && typeof value === "object" ? value : {};
  if (typeof v.preset === "string") return { version: APPEARANCE_VERSION, preset: resolvePresetId(v.preset) };
  if (typeof v.family === "string") return { version: APPEARANCE_VERSION, preset: presetFromFamily(v.family, v.mode) };
  return { version: APPEARANCE_VERSION, preset: DEFAULT_PRESET };
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
    return { version: APPEARANCE_VERSION, preset: LEGACY_MODE_MIGRATION[legacy] };
  }
  return { version: APPEARANCE_VERSION, preset: DEFAULT_PRESET };
}

/** Návrat na doporučený vzhled. */
export function signatureAppearance() {
  return { version: APPEARANCE_VERSION, preset: DEFAULT_PRESET };
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
