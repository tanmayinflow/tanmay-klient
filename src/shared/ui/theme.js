// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/ui/theme.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// ----------------------------------------------------------------------
// THEME
// ----------------------------------------------------------------------
// ---- PALETA DOMU · jedna, ne tři ------------------------------------------
/* Dům měl tři šaty a nosil ty nejmladší. „Tidelight" byla vlastní identita —
   chladný minerální papír, přílivový inkoust, korál jako akční barva a
   hlubinná voda v noci. Uměla to, ale nebyla to tanmay: Brand Book V2 stojí
   na Forest Night a Linen jako dominantních plochách, na mědi jako jediném
   přesném ohnisku a na zákazu gradientů, záře a obecné zemité duhy.
   „Atelier" a „brand" ležely vedle jako mrtvé větve a rozcházely se s
   produktem — vyřazený Taupe a Stone v textu, gradientní hero, hnědě
   posunutá noc, chybějící stínové tokeny.

   Zůstává jedna paleta ve dvou světlech. Den je Linen field, noc Forest
   Night field. Nejsou to dvě témata; je to jedna místnost ráno a večer.

   ODVOZENÉ HODNOTY. Osm kanonických barev je autorita odstínu. Povrchy,
   hover, text variants a stavy jsou produktové tokeny — Brand Book je sám
   posílá do produktového design systému a Canonical se jimi nemění. */
export const THEME_TANMAY = {
  light: {
    mode: "light",
    // LINEN FIELD · plocha je papír, ne bílá. Karty se od něj liší světlostí
    // a hranou, teprve potom stínem.
    bg: "#F4F0EB",          // Linen
    bgSidebar: "#EBE6E0",   // Linen o stupeň hlouběji · hierarchie bez posunu odstínu

    text: "#1C1C1A",        // Forest Night
    heading: "#2E3D35",     // Deep Moss · zeleň jako inkoust, ne jako plocha
    textSec: "#454842",
    textMuted: "#5C5F58",

    accent: "#B87333",      // Copper · značka, výplň, okraj, bindu
    accentInk: "#8F5320",   // měď, která unese malé písmo na Linen
    onAccent: "#1C1C1A",    // popisek NA mědi · Linen na mědi dělá jen 3,3:1

    sage: "#4F5F43",        // Sage jako inkoust · kanonická šalvěj text nenese
    sand: "#6E5B42",        // Warm Sand jako inkoust
    inkSand: "#6B5840",

    danger: "#6A3E44",      // Burgundy
    info: "#4F646B",        // River Slate
    success: "#4F5F43",
    warning: "#6E5B42",

    border: "rgba(28,28,26,0.16)",
    borderSoft: "rgba(28,28,26,0.08)",

    card: "#FAF7F2",
    cardHover: "#FDFBF7",
    callout: "#EFE8DE",
    tableHead: "#EBE4DB",

    sheet: "#FFFDF9",       // list, na který se píše · nejsvětlejší povrch
    sheetHover: "#FFFDFB",

    activeNav: "rgba(184,115,51,0.12)",
    overlay: "rgba(28,28,26,0.40)",

    // hloubka · neutrální, tichá, bez záře a bez špinavé černé na plátně
    shadow: "0 0 0 1px rgba(28,28,26,0.04), 0 1px 2px rgba(28,28,26,0.05), 0 8px 22px -12px rgba(28,28,26,0.18)",
    shadowLift: "0 0 0 1px rgba(28,28,26,0.05), 0 2px 5px rgba(28,28,26,0.06), 0 18px 40px -20px rgba(28,28,26,0.24)",
    shadowPop: "0 0 0 1px rgba(28,28,26,0.06), 0 3px 9px -4px rgba(28,28,26,0.10), 0 20px 46px -22px rgba(28,28,26,0.26)",
    shadowSheet: "0 0 0 1px rgba(28,28,26,0.07), 0 5px 14px -7px rgba(28,28,26,0.11), 0 28px 68px -30px rgba(28,28,26,0.30)",
    shadowDrag: "0 0 0 1px rgba(184,115,51,0.22), 0 8px 22px -10px rgba(28,28,26,0.16), 0 30px 58px -28px rgba(28,28,26,0.28)",

    // hero není banner · je to tichý práh místnosti, plná plocha, žádný přechod
    hero: "#EDE5DB",
    heroInk: "#2E3D35",
    heroInkSoft: "rgba(46,61,53,0.78)",
    heroLine: "rgba(184,115,51,0.30)",
  },
  dark: {
    mode: "dark",
    // FOREST NIGHT FIELD · týž prostor po setmění. Ne hnědý, ne luxusní.
    bg: "#1C1C1A",          // Forest Night
    bgSidebar: "#161714",

    text: "#F4F0EB",        // Linen
    heading: "#F4F0EB",
    textSec: "#CAC6BE",
    textMuted: "#A7A39B",

    accent: "#B87333",      // Copper · v noci zůstává značkou a výplní
    accentInk: "#D39A63",   // světlejší měď pro malé písmo na kartě
    onAccent: "#1C1C1A",    // popisek NA mědi · Forest Night v obou režimech

    sage: "#9AAA8D",
    sand: "#D0BEA3",
    inkSand: "#D8C7AE",

    danger: "#D9A4A8",      // Burgundy zesvětlená do čitelnosti
    info: "#9EB8BE",        // River Slate zesvětlená
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

    // v noci zvedá povrch odstup a hrana · žádný světelný proužek shora,
    // ten dělá z aplikace výkladní skříň
    shadow: "0 0 0 1px rgba(244,240,235,0.05), 0 2px 4px rgba(0,0,0,0.36), 0 12px 30px -16px rgba(0,0,0,0.60)",
    shadowLift: "0 0 0 1px rgba(244,240,235,0.07), 0 3px 8px rgba(0,0,0,0.40), 0 24px 50px -22px rgba(0,0,0,0.66)",
    shadowPop: "0 0 0 1px rgba(244,240,235,0.09), 0 4px 12px -5px rgba(0,0,0,0.48), 0 28px 60px -26px rgba(0,0,0,0.72)",
    shadowSheet: "0 0 0 1px rgba(244,240,235,0.11), 0 6px 18px -8px rgba(0,0,0,0.52), 0 36px 78px -30px rgba(0,0,0,0.76)",
    shadowDrag: "0 0 0 1px rgba(184,115,51,0.30), 0 8px 22px -10px rgba(0,0,0,0.58), 0 34px 68px -28px rgba(0,0,0,0.78)",

    hero: "#2E3D35",        // Deep Moss jako druhá tmavá plocha
    heroInk: "#F4F0EB",
    heroInkSoft: "rgba(244,240,235,0.78)",
    heroLine: "rgba(184,115,51,0.42)",
  },
};

export function makeTheme(mode) {
  return THEME_TANMAY[mode === "light" ? "light" : "dark"];
}

/* ŠTÍTKY · omezené produktové spektrum, ne duha.
   Deset tónů odvozených z pěti kanonických barev (Deep Moss, Sage, Warm Sand,
   Burgundy, River Slate) plus forest-neutrální šeď. Měď mezi nimi není —
   ta zůstává akcentem rozhraní, ne barvou štítku.

   STARÉ KLÍČE JSOU DATA. `green`, `yellow`, `orange`, `brown`, `gray`, `red`,
   `pink`, `purple`, `blue` leží v uložených poznámkách a zápiscích. Nemigrují
   se a nemažou; jsou to aliasy, které ukazují na tón v novém systému. */
export const TAG_TONES = {
  light: {
    moss: "#2E3D35",
    sage: "#4C5A3E",
    sand: "#63523B",
    ochre: "#6E5228",
    taupe: "#605047",
    stone: "#4F5450",
    burgundy: "#6A3E44",
    rose: "#7B4650",
    plum: "#5A4150",
    slate: "#3F565E",
  },
  dark: {
    moss: "#ABC0B1",
    sage: "#B0BFA4",
    sand: "#D0BEA3",
    ochre: "#D2B189",
    taupe: "#C8B6AA",
    stone: "#B8BCB6",
    burgundy: "#E0B0B4",
    rose: "#DEB2BB",
    plum: "#C9B4C8",
    slate: "#A6BFC5",
  },
};
// starý klíč → tón. Nic se nepřepisuje, jen se čte.
export const TAG_ALIAS = {
  green: "moss", yellow: "sand", orange: "ochre", brown: "taupe",
  gray: "stone", red: "burgundy", pink: "rose", purple: "plum", blue: "slate",
  default: "stone",
};
export const TAGS_TANMAY = (() => {
  const out = { light: {}, dark: {} };
  ["light", "dark"].forEach((m) => {
    const tint = m === "light" ? 0.1 : 0.12;
    const chip = (hex) => {
      const h = hex.replace("#", "");
      const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
      // pozadí je průsvitný nádech vlastní barvy, ne plná výplň — chip sedí
      // stejně tiše na kartě, na listu i na plátně
      return { bg: `rgba(${r},${g},${b},${tint})`, fg: hex };
    };
    Object.keys(TAG_TONES[m]).forEach((k) => { out[m][k] = chip(TAG_TONES[m][k]); });
    Object.keys(TAG_ALIAS).forEach((k) => { out[m][k] = chip(TAG_TONES[m][TAG_ALIAS[k]]); });
  });
  return out;
})();

export function makeTags(mode) {
  return TAGS_TANMAY[mode === "light" ? "light" : "dark"];
}
