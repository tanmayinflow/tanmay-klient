// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/ui/tokens.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// ----------------------------------------------------------------------
// PRODUKTOVÉ TOKENY · jedno místo, kde se mění tvar domu
// ----------------------------------------------------------------------
// Barvy jsou v ui/theme.js, řezy písma v ui/type.js. Tady je zbytek: rádius,
// odstup, dotykový cíl, doba animace, výška pole. Vydávají se jako CSS
// proměnné, takže je vidí i pravidla ve <style>, ne jen inline styly.
//
// Změna rádiusu tlačítka, výšky pole, odstupu doku nebo doby animace se dělá
// TADY a projeví se v obou domech.

import { FONT_DISPLAY_EN, FONT_DISPLAY_CS, FONT_LOGO, FONT_BODY, FONT_TAG } from "./type.js";

/** Rádiusy. Dům má tři velikosti a jednu pilulku, ne dvanáct náhodných čísel. */
export const RADII = Object.freeze({
  tag: 5,     // značka · jediný rádius, který se v obou domech rozešel (5 proti 4)
  xs: 6,      // drobný ovládací prvek · ikonové tlačítko
  sm: 8,      // pole, tlačítko, malá karta
  md: 12,     // karta
  lg: 20,     // list
  pill: 999,  // pilulka
});

/** Odstupy. Krok je čtyři pixely; dům dýchá po násobcích. */
export const SPACE = Object.freeze({ 1: 4, 2: 8, 3: 12, 4: 16, 5: 24, 6: 32, 7: 48 });

/** Dotykové cíle. 44 tam, kde je místo; 26 je technické minimum drobného
 *  sekundárního ovládacího prvku, ne standard. */
export const TAP = Object.freeze({ comfortable: 44, compact: 38, min: 26 });

/** Výšky ovládacích prvků. */
export const CONTROL = Object.freeze({ input: 44, inputCompact: 38, button: 44, buttonCompact: 38 });

/** Doby a křivka. Jedna křivka pro celý dům. */
export const MOTION = Object.freeze({
  fast: 160,
  base: 250,
  slow: 380,
  ease: "cubic-bezier(.23,.62,.22,.99)",
});

/**
 * CSS proměnné pro celý dům.
 * @param {object} t motiv z makeTheme()
 * @param {"cs"|"en"} lang jazyk · rozhoduje o displejovém řezu
 */
export function tokensCss(t, lang) {
  const display = lang === "en" ? FONT_DISPLAY_EN : FONT_DISPLAY_CS;
  return `
:root {
  /* písmo */
  --tm-font-display: ${display};
  --tm-font-logo: ${FONT_LOGO};
  --tm-font-body: ${FONT_BODY};
  --tm-font-tag: ${FONT_TAG};

  /* rádius */
  --tm-r-tag: ${RADII.tag}px;
  --tm-r-xs: ${RADII.xs}px;
  --tm-r-sm: ${RADII.sm}px;
  --tm-r-md: ${RADII.md}px;
  --tm-r-lg: ${RADII.lg}px;
  --tm-r-sheet: ${RADII.lg}px;
  --tm-r-pill: ${RADII.pill}px;

  /* odstup */
  --tm-s1: ${SPACE[1]}px; --tm-s2: ${SPACE[2]}px; --tm-s3: ${SPACE[3]}px;
  --tm-s4: ${SPACE[4]}px; --tm-s5: ${SPACE[5]}px; --tm-s6: ${SPACE[6]}px; --tm-s7: ${SPACE[7]}px;

  /* dotyk a ovládací prvky */
  --tm-tap: ${TAP.comfortable}px;
  --tm-tap-compact: ${TAP.compact}px;
  --tm-tap-min: ${TAP.min}px;
  --tm-input-h: ${CONTROL.input}px;
  --tm-input-h-compact: ${CONTROL.inputCompact}px;

  /* pohyb */
  --tm-dur-fast: ${MOTION.fast}ms;
  --tm-dur: ${MOTION.base}ms;
  --tm-dur-slow: ${MOTION.slow}ms;
  --tm-ease: ${MOTION.ease};

  /* barvy · aby na ně dosáhla i pravidla ve <style>, ne jen inline styl */
  --tm-bg: ${t.bg};
  --tm-bg-sidebar: ${t.bgSidebar};
  --tm-text: ${t.text};
  --tm-heading: ${t.heading};
  --tm-text-sec: ${t.textSec};
  --tm-text-muted: ${t.textMuted};
  --tm-accent: ${t.accent};
  --tm-accent-ink: ${t.accentInk};
  --tm-on-accent: ${t.onAccent};
  --tm-sage: ${t.sage};
  --tm-sand: ${t.sand};
  --tm-danger: ${t.danger};
  --tm-info: ${t.info};
  --tm-border: ${t.border};
  --tm-border-soft: ${t.borderSoft};
  --tm-card: ${t.card};
  --tm-callout: ${t.callout};
  --tm-sheet: ${t.sheet};
  --tm-overlay: ${t.overlay};
  --tm-shadow: ${t.shadow};
  --tm-shadow-lift: ${t.shadowLift};
  --tm-shadow-sheet: ${t.shadowSheet};
}
/* Kdo si vypnul pohyb, ten si ho vypnul. Doby jdou na nulu jedním místem,
   takže se na to nedá zapomenout u nové komponenty. */
@media (prefers-reduced-motion: reduce) {
  :root { --tm-dur-fast: 1ms; --tm-dur: 1ms; --tm-dur-slow: 1ms; }
  *, *::before, *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
    scroll-behavior: auto !important;
  }
}
`;
}
