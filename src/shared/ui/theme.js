// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/ui/theme.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// ----------------------------------------------------------------------
// VZHLED · devět kurátorovaných presetů
// ----------------------------------------------------------------------
// Dům měl jednu paletu ve dvou světlech. Theme System V1 z ní udělal sedm
// rodin krát dva režimy; V2 to zjednodušuje na DEVĚT HOTOVÝCH VZHLEDŮ, kde
// systémem hýbe jediná položka (`signature-auto`). SIGNATURE zůstává normou
// domu — Signature Day je znak po znaku ta paleta, kterou dům nosí, Signature
// Night je její měkčí uhlová noc. Ostatních šest jsou VOLITELNÉ PRODUKTOVÉ
// ATMOSFÉRY, ne nové veřejné identity značky: nemění web, Brand Book, logo,
// Movement Atlas, export ani význam stavových barev.
//
// Data i pravidla odvození žijí v ui/themeRegistry.js. Tenhle soubor je
// vstup, na který sahá aplikace, a drží zpětně kompatibilní tvar:
//
//     makeThemeFor(preset, systemDark)  → paleta zvoleného vzhledu
//     makeTheme(mode)                   → Signature Day / Night (starší volání)
//     THEME_TANMAY                      → { light, dark } Signature
//
// ODVOZENÉ HODNOTY. Kotevní barvy jsou autorita odstínu. Povrchy, hover,
// varianty písma a stavy jsou produktové tokeny — Brand Book je sám posílá
// do produktového design systému a Canonical se jimi nemění.

import {
  APPEARANCE_PRESETS, APPEARANCE_PRESET_IDS, FIXED_PRESETS, FIXED_PRESET_IDS,
  DEFAULT_PRESET, RECOMMENDED_PRESET, PRESET_FIELDS,
  BRAND, FUNCTIONAL, CHART, CHART_PATTERNS, DOCUMENT_THEME,
  appearancePreset, resolvePresetId, resolveAppearancePreset, resolveTheme,
  presetPolarity, isSystemAware, previewTokens, pwaThemeColor, documentThemeAttrs,
  statusPalette, chartPalette, presetFromFamily, STATUS_CARRIERS, TONE_ROLES, toneStyle,
  normalizeAppearance, migrateLegacyAppearance, signatureAppearance, APPEARANCE_VERSION,
} from "./themeRegistry.js";
import { contrast, composite } from "./contrast.js";
import { mixHex } from "./color.js";

export {
  APPEARANCE_PRESETS, APPEARANCE_PRESET_IDS, FIXED_PRESETS, FIXED_PRESET_IDS,
  DEFAULT_PRESET, RECOMMENDED_PRESET, PRESET_FIELDS,
  BRAND, FUNCTIONAL, CHART, CHART_PATTERNS, DOCUMENT_THEME,
  appearancePreset, resolvePresetId, resolveAppearancePreset, resolveTheme,
  presetPolarity, isSystemAware, previewTokens, pwaThemeColor, documentThemeAttrs,
  statusPalette, chartPalette, presetFromFamily, STATUS_CARRIERS, TONE_ROLES, toneStyle,
  normalizeAppearance, migrateLegacyAppearance, signatureAppearance, APPEARANCE_VERSION,
};

/* Signature ve dvou světlech. HISTORICKÝ TVAR, ne druhý přepínač: čte ho
   jediné místo v Main App, které si z motivu bere seznam značkových inkoustů
   pro rozpoznání barev v uložených poznámkách. Není to volba vzhledu. */
export const THEME_TANMAY = Object.freeze({
  light: resolveTheme("signature-day", false),
  dark: resolveTheme("signature-night", false),
});

/** Starší volání: samotný režim znamená Signature Day / Signature Night. */
export function makeTheme(mode) {
  return resolveTheme(mode === "dark" ? "signature-night" : "signature-day", false);
}

/**
 * Vyřešená paleta zvoleného vzhledu. `systemDark` má vliv JEN na
 * `signature-auto`; pevný vzhled ho ignoruje.
 */
export function makeThemeFor(preset, systemDark) {
  return resolveTheme(preset, !!systemDark);
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

// ----------------------------------------------------------------------
// ŠTÍTKY V CIZÍM SVĚTLE
// ----------------------------------------------------------------------
// Tóny štítků jsou DATA. Uložená poznámka nese klíč, ne barvu, a ten klíč
// musí v každém vzhledu znamenat totéž — jinak by se přepnutím motivu měnil
// obsah, ne šaty. Deset tónů proto zůstává deset tónů.
//
// Co se změnit musí, je jejich čitelnost. Tóny jsou navržené na Linen a na
// tmavý uhel; na kartě Kouře a koření je tentýž inkoust o kus slabší. Pro
// každý vzhled se proto tón posune k inkoustu jeho polarity právě tolik, aby
// na JEHO kartě držel 4,5:1 — a ani o krok víc. Signature Day a Signature
// Night se nepočítají vůbec: vrací se doslova ta tabulka, kterou dům nosí.
const TAGS_BY_PRESET = (() => {
  const out = {};
  const keys = Object.keys(TAG_TONES.light);
  for (const preset of FIXED_PRESETS) {
    const m = preset.polarity;
    /* SIGNATURE DAY JE ZMRAZENÁ, NOC UŽ NE. Tabulka `TAG_TONES.dark` byla
       navržená na near-black noc z V1.1; V2 noc je o dvě patra světlejší,
       takže na její kartě tytéž inkousty 4,5:1 nedrží. Den zůstává doslova
       tím, co dům nosí; noc projde stejným dorovnáním jako ostatní vzhledy
       a posune se právě tam, kde je to potřeba. */
    if (preset.id === "signature-day") { out[preset.id] = TAGS_TANMAY[m]; continue; }
    /* VŠECHNY PLOCHY, NA KTERÝCH ŠTÍTEK OPRAVDU LEŽÍ. Do V1.1 se tón dorovnával
       jen na kartě, protože v tehdejších rodinách byla karta nejtěžší plocha.
       Písek a země to porušil: jeho pole (`#D3C7AD`) je o dva stupně tmavší než
       karta, takže chip, který na kartě prošel, byl na stránce pod 4:1. Fit
       proto bere NEJHORŠÍ z ploch — a protože začíná na nule, palety, které
       procházely už dřív, se nehnou ani o odstín. */
    const pal = preset.palette;
    const surfaces = [pal.background, pal.navigation, pal.surface, pal.card,
      pal.documentSurface, pal.cardHover, pal.sheetHover, pal.hero, pal.elevatedSurface];
    const card = preset.palette.card;
    const pole = m === "light" ? BRAND.forest : BRAND.linen;
    const chipWith = (tint) => (hex) => {
      const h = hex.replace("#", "");
      const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
      return { bg: `rgba(${r},${g},${b},${tint})`, fg: hex };
    };
    /* Na světlé tmavé kartě zvedne i sám nádech pozadí tak, že by neprošel ani
       čistý len. Nádech proto ubíráme, dokud na TÉ kartě neprojde nejzazší
       možný inkoust — teprve pak se hledají tóny. Štítek zůstává průsvitný,
       jen tišší. */
    let tint = m === "light" ? 0.1 : 0.12;
    while (tint > 0.03) {
      const eff = composite(chipWith(tint)(pole).bg, card);
      if (contrast(pole, eff, eff) >= 4.5) break;
      tint = Math.round((tint - 0.01) * 100) / 100;
    }
    const chip = chipWith(tint);
    const holds = (c) => surfaces.every((bg) => {
      const eff = composite(chip(c).bg, bg);
      return contrast(c, eff, eff) >= 4.5;
    });
    const fit = (hex) => {
      for (let i = 0; i <= 100; i++) {
        const c = mixHex(hex, pole, i / 100);
        if (holds(c)) return c;
      }
      return pole;
    };
    const tones = {};
    for (const k of keys) tones[k] = fit(TAG_TONES[m][k]);
    const set = {};
    for (const k of keys) set[k] = chip(tones[k]);
    for (const k of Object.keys(TAG_ALIAS)) set[k] = chip(tones[TAG_ALIAS[k]]);
    out[preset.id] = set;
  }
  return out;
})();

/** Tóny štítků pro vyřešený vzhled. */
export function makeTagsFor(preset, systemDark) {
  const id = resolveAppearancePreset(preset, !!systemDark).id;
  return TAGS_BY_PRESET[id] || TAGS_BY_PRESET["signature-day"];
}
