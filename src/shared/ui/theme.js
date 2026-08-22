// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/ui/theme.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// ----------------------------------------------------------------------
// MOTIV · rodina a režim
// ----------------------------------------------------------------------
// Dům měl jednu paletu ve dvou světlech. Od Theme System V1 jich má sedm —
// ale pořád jednu normu. SIGNATURE (Linen ve dne, Forest Night v noci, měď
// jako jediné přesné ohnisko) zůstává výchozí, první a doporučená, a její
// hodnoty se nezměnily ani o odstín. Šest dalších rodin jsou VOLITELNÉ
// PRODUKTOVÉ ATMOSFÉRY, ne nové veřejné identity značky: nemění web, Brand
// Book, logo, Movement Atlas, export ani význam stavových barev.
//
// Data i pravidla odvození žijí v ui/themeRegistry.js. Tenhle soubor je
// vstup, na který sahá aplikace, a drží zpětně kompatibilní tvar:
//
//     makeTheme(mode)              → Signature v daném světle (starší volání)
//     makeThemeFor(family, mode)   → kterákoli rodina
//     THEME_TANMAY                 → { light, dark } Signature
//
// ODVOZENÉ HODNOTY. Kotevní barvy jsou autorita odstínu. Povrchy, hover,
// varianty písma a stavy jsou produktové tokeny — Brand Book je sám posílá
// do produktového design systému a Canonical se jimi nemění.

import {
  THEME_FAMILIES, THEME_FAMILY_IDS, THEME_MODES, DEFAULT_FAMILY, DEFAULT_MODE,
  BRAND, FUNCTIONAL, CHART, CHART_PATTERNS, DOCUMENT_THEME,
  themeFamily, resolveFamilyId, resolveMode, resolveModeChoice, resolveTheme,
  previewTokens, pwaThemeColor, documentThemeAttrs, statusPalette, chartPalette,
  normalizeAppearance, migrateLegacyAppearance, signatureAppearance, APPEARANCE_VERSION,
} from "./themeRegistry.js";
import { contrast, composite } from "./contrast.js";
import { mixHex } from "./color.js";

export {
  THEME_FAMILIES, THEME_FAMILY_IDS, THEME_MODES, DEFAULT_FAMILY, DEFAULT_MODE,
  BRAND, FUNCTIONAL, CHART, CHART_PATTERNS, DOCUMENT_THEME,
  themeFamily, resolveFamilyId, resolveMode, resolveModeChoice, resolveTheme,
  previewTokens, pwaThemeColor, documentThemeAttrs, statusPalette, chartPalette,
  normalizeAppearance, migrateLegacyAppearance, signatureAppearance, APPEARANCE_VERSION,
};

/** Signature ve dvou světlech. Historický tvar, na který sahá starší kód. */
export const THEME_TANMAY = Object.freeze({
  light: resolveTheme(DEFAULT_FAMILY, "light"),
  dark: resolveTheme(DEFAULT_FAMILY, "dark"),
});

/** Starší volání: režim bez rodiny znamená Signature. */
export function makeTheme(mode) {
  return resolveTheme(DEFAULT_FAMILY, mode === "light" ? "light" : "dark");
}

/** Vyřešená paleta rodiny. `mode` je už light/dark, ne "system". */
export function makeThemeFor(family, mode) {
  return resolveTheme(family, mode === "dark" ? "dark" : "light");
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
// musí v každé rodině znamenat totéž — jinak by se přepnutím motivu měnil
// obsah, ne šaty. Deset tónů proto zůstává deset tónů.
//
// Co se změnit musí, je jejich čitelnost. Tóny jsou navržené na Linen a na
// Forest Night; na kartě Atlantic Sky v noci (#1A638E) je tentýž inkoust
// o dvě třetiny slabší. Pro každou rodinu se proto tón posune k inkoustu
// režimu právě tolik, aby na JEJÍ kartě držel 4,5:1 — a ani o krok víc.
// Signature se nepočítá vůbec: vrací se doslova ta tabulka, kterou dům nosí.
const TAGS_BY_FAMILY = (() => {
  const out = {};
  const keys = Object.keys(TAG_TONES.light);
  for (const fam of THEME_FAMILIES) {
    out[fam.id] = {};
    for (const m of ["light", "dark"]) {
      if (fam.id === DEFAULT_FAMILY) { out[fam.id][m] = TAGS_TANMAY[m]; continue; }
      const card = fam[m].card;
      const pole = m === "light" ? BRAND.forest : BRAND.linen;
      const chipWith = (tint) => (hex) => {
        const h = hex.replace("#", "");
        const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
        return { bg: `rgba(${r},${g},${b},${tint})`, fg: hex };
      };
      /* Na světlé noční kartě (Teal #106C68, Atlantic #1A638E) zvedne i sám
         nádech pozadí tak, že by neprošel ani čistý len. Nádech proto ubíráme,
         dokud na TÉ kartě neprojde nejzazší možný inkoust — teprve pak se
         hledají tóny. Štítek zůstává průsvitný, jen tišší. */
      let tint = m === "light" ? 0.1 : 0.12;
      while (tint > 0.03) {
        const eff = composite(chipWith(tint)(pole).bg, card);
        if (contrast(pole, eff, eff) >= 4.5) break;
        tint = Math.round((tint - 0.01) * 100) / 100;
      }
      const chip = chipWith(tint);
      const fit = (hex) => {
        for (let i = 0; i <= 100; i++) {
          const c = mixHex(hex, pole, i / 100);
          const eff = composite(chip(c).bg, card);
          if (contrast(c, eff, eff) >= 4.5) return c;
        }
        return pole;
      };
      const tones = {};
      for (const k of keys) tones[k] = fit(TAG_TONES[m][k]);
      const set = {};
      for (const k of keys) set[k] = chip(tones[k]);
      for (const k of Object.keys(TAG_ALIAS)) set[k] = chip(tones[TAG_ALIAS[k]]);
      out[fam.id][m] = set;
    }
  }
  return out;
})();

/** Tóny štítků pro rodinu a vyřešený režim. */
export function makeTagsFor(family, mode) {
  const m = mode === "dark" ? "dark" : "light";
  return (TAGS_BY_FAMILY[resolveFamilyId(family)] || TAGS_BY_FAMILY[DEFAULT_FAMILY])[m];
}
