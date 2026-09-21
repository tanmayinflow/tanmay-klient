import { roomArtCss } from "./roomArt.js";
import { ownerRefinementsCss } from "./ownerRefinements.js";
import { landscapeCss } from "./landscapeCss.js";
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

import { STACK_DISPLAY_EN, STACK_DISPLAY_CS, STACK_LOGO, STACK_BODY, STACK_TAG } from "./type.js";

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
  const house = lang === "en" ? STACK_DISPLAY_EN : STACK_DISPLAY_CS;
  /* ŘEZ JE ROLE, NE KONSTANTA. Dům mlčí a dostane svůj Garamond a DM Sans;
     paleta, která si nese vlastní typografii (`type` v rejstříku), ji tady
     přebije a propíše se do každého inline stylu, protože komponenty píšou
     `var(--tm-font-body)`, ne řez. Jazyk rozhoduje jen tam, kde paleta mlčí
     — vlastní displejový řez si diakritiku řeší sám. */
  const display = t.fontDisplay || house;
  const logo = t.fontLogo || STACK_LOGO;
  const body = t.fontBody || STACK_BODY;
  const tag = t.fontTag || STACK_TAG;
  return `
:root {
  /* písmo */
  --tm-font-display: ${display};
  --tm-font-logo: ${logo};
  --tm-font-body: ${body};
  --tm-font-tag: ${tag};

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

  /* sémantické role motivu · rodina se pozná jen tady, nikde v komponentě */
  --tm-navigation: ${t.navigation};
  --tm-surface: ${t.surface};
  --tm-surface-raised: ${t.surfaceRaised};
  --tm-elevated: ${t.elevatedSurface};
  --tm-surface-muted: ${t.surfaceMuted};
  --tm-document: ${t.documentSurface};
  --tm-scrim: ${t.scrim};
  --tm-text-secondary: ${t.textSecondary};
  --tm-text-disabled: ${t.textDisabled};
  --tm-placeholder: ${t.placeholder};
  --tm-placeholder-text: ${t.placeholderText};
  --tm-placeholder-strong: ${t.placeholderStrong};
  --tm-border-strong: ${t.borderStrong};
  --tm-divider: ${t.divider};
  --tm-accent-hover: ${t.interactiveAccentHover};
  --tm-accent-pressed: ${t.interactiveAccentPressed};
  --tm-selection: ${t.selectionSurface};
  --tm-selection-text: ${t.selectionText};
  --tm-focus: ${t.focusRing};
  --tm-link: ${t.link};
  --tm-link-hover: ${t.linkHover};
  /* navigace · vlastní inkousty, protože panel může být tmavý nad světlým polem */
  --tm-nav-text: ${t.navText};
  --tm-nav-text-sec: ${t.navTextSec};
  --tm-nav-kicker: ${t.navKicker};
  --tm-nav-icon: ${t.navIcon};
  --tm-nav-muted: ${t.navMuted};
  --tm-nav-accent: ${t.navAccent};
  --tm-nav-active: ${t.navActiveBg};
  --tm-nav-hairline: ${t.navHairline};
  --tm-nav-border: ${t.navBorder};
  --tm-dock-bg: ${t.dockBg};

  /* řeč rámů · čte ji jen volitelná paleta přes data-frame-grammar */
  --tm-frame-outer: ${t.frameOuter};
  --tm-frame-inner: ${t.frameInner};
  --tm-frame-rail: ${t.frameRail};
  --tm-frame-highlight: ${t.frameHighlight};
  /* rastr pole a záře rámečku · čte je jen skinCss() té palety, která je má */
  --tm-scanline: ${t.scanline || "transparent"};
  --tm-frame-glow: ${t.frameGlow || "transparent"};

  --tm-brand-copper: ${t.brandCopper};
  --tm-brand-linen: ${t.brandLinen};
  --tm-brand-forest: ${t.brandForest};
  --tm-atlas-frame: ${t.atlasFrame};
  --tm-atlas-border: ${t.atlasBorder};

  /* funkční role · význam, ne dekorace */
  --tm-success-fg: ${t.successFg};   --tm-success-bg: ${t.successBg};
  --tm-warning-fg: ${t.warningFg};   --tm-warning-bg: ${t.warningBg};
  --tm-error-fg: ${t.errorFg};       --tm-error-bg: ${t.errorBg};
  --tm-info-fg: ${t.infoFg};         --tm-info-bg: ${t.infoBg};

  /* data */
  --tm-chart-1: ${t.chart1}; --tm-chart-2: ${t.chart2}; --tm-chart-3: ${t.chart3};
  --tm-chart-4: ${t.chart4}; --tm-chart-5: ${t.chart5}; --tm-chart-6: ${t.chart6};
  --tm-chart-surface: ${t.chartSurface};
  --tm-grid: ${t.grid};
  --tm-axis: ${t.axis};
}
/* VÝBĚR TEXTU · patří motivu, ne prohlížeči. Dlouhé psaní se nesmí v jiné
   rodině vybírat do nečitelné plochy. */
::selection { background: ${t.selectionSurface}; color: ${t.selectionText}; }
/* PŘEPNUTÍ MOTIVU · krátký přechod jen na barvě, ne na rozvržení. Kdo má
   vypnutý pohyb, nemá ani tenhle — pravidlo níž ho vynuluje spolu se vším
   ostatním. */
@media (prefers-reduced-motion: no-preference) {
  html[data-appearance] body,
  html[data-appearance] .tm-theme-fade {
    transition: background-color 140ms var(--tm-ease), color 140ms var(--tm-ease);
  }
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
${frameGrammarCss()}
${skinCss()}
${landscapeCss()}
${roomArtCss()}
${ownerRefinementsCss()}
`;
}

// ----------------------------------------------------------------------
// ŘEČ RÁMŮ · sedm gramatik, čisté CSS, žádná změna rozměrů
// ----------------------------------------------------------------------
// Rám je vnitřní stín, obrys nebo pseudo-prvek — nikdy padding, border-width
// ani wrapper, takže přepnutí palety nepohne geometrií ani o pixel. Všechno
// je střeženo atributem `data-frame-grammar` na kořeni: Signature má „none"
// a žádné z těchhle pravidel se jí nedotkne.
//
// ROZPOČET RÁMŮ (V3 §9): rámuje se list a zásuvka (nejvýš jedna na
// obrazovce), psací plocha v režimu psaní a vybraná položka navigace.
// Karty, řádky seznamů a pole formulářů zůstávají otevřené — paleta se
// pozná podle mála, ne podle krabice kolem všeho.
export function frameGrammarCss() {
  const g = (name) => `html[data-frame-grammar="${name}"]`;
  const sheets = (name) => `${g(name)} .tm-cs, ${g(name)} .tm-drawer`;
  const writing = (name) => `${g(name)} body.tm-psani .tm-page`;
  const sel = (name) => `${g(name)} .tm-sidebar .tm-nav-active`;
  return `
${sheets("landscape-paper")}, ${sheets("landscape-ash")} { box-shadow: var(--tm-shadow-sheet) !important; }
/* ---- Břidlice a hlína · dvojitá architektonická linka ------------------ */
${sheets("architectural-double")} {
  box-shadow: inset 0 0 0 1px var(--tm-frame-outer), inset 0 0 0 4px var(--tm-bg),
    inset 0 0 0 5px var(--tm-frame-inner), var(--tm-shadow-sheet) !important;
}
${writing("architectural-double")} {
  box-shadow: inset 0 0 0 1px var(--tm-frame-outer), inset 0 0 0 4px var(--tm-bg),
    inset 0 0 0 5px var(--tm-frame-inner);
}
${sel("architectural-double")} { box-shadow: inset 4px 0 0 0 var(--tm-frame-rail) !important; }

/* ---- Monument · vsazený rám s hliněnou kolejnicí ----------------------- */
${sheets("monument-inset")} {
  box-shadow: inset 0 0 0 3px var(--tm-frame-outer), inset 11px 0 0 0 var(--tm-frame-rail),
    var(--tm-shadow-sheet) !important;
}
${writing("monument-inset")} {
  box-shadow: inset 0 0 0 3px var(--tm-frame-outer), inset 11px 0 0 0 var(--tm-frame-rail);
}
${sel("monument-inset")} { box-shadow: inset 6px 0 0 0 var(--tm-frame-rail) !important; }

/* ---- Písek a země · vrstvy strat --------------------------------------- */
${sheets("strata-rails")} {
  box-shadow: inset 0 2px 0 0 var(--tm-frame-outer), inset 4px 0 0 0 var(--tm-frame-rail),
    inset 0 -2px 0 0 var(--tm-frame-inner), var(--tm-shadow-sheet) !important;
}
${writing("strata-rails")} {
  box-shadow: inset 4px 0 0 0 var(--tm-frame-rail);
}
${sel("strata-rails")} { box-shadow: inset 4px 0 0 0 var(--tm-frame-rail) !important; }

/* ---- Granát a břidlice · rohové konzoly -------------------------------- */
html[data-frame-grammar="corner-brackets"] .tm-cs,
html[data-frame-grammar="corner-brackets"] .tm-drawer,
html[data-frame-grammar="corner-brackets"] body.tm-psani .tm-page { position: relative; }
html[data-frame-grammar="corner-brackets"] .tm-cs::before,
html[data-frame-grammar="corner-brackets"] .tm-drawer::before,
html[data-frame-grammar="corner-brackets"] body.tm-psani .tm-page::before {
  content: ""; position: absolute; top: 0; left: 0; width: 24px; height: 24px;
  border-top: 2px solid var(--tm-frame-outer); border-left: 2px solid var(--tm-frame-outer);
  pointer-events: none; z-index: 3;
}
html[data-frame-grammar="corner-brackets"] .tm-cs::after,
html[data-frame-grammar="corner-brackets"] .tm-drawer::after,
html[data-frame-grammar="corner-brackets"] body.tm-psani .tm-page::after {
  content: ""; position: absolute; bottom: 0; right: 0; width: 24px; height: 24px;
  border-bottom: 2px solid var(--tm-frame-outer); border-right: 2px solid var(--tm-frame-outer);
  pointer-events: none; z-index: 3;
}
${sel("corner-brackets")} { box-shadow: inset 3px 0 0 0 var(--tm-frame-rail) !important; }

/* ---- Šikon a fosilní písek · vnořená fosilie --------------------------- */
${sheets("nested-fossil")} {
  box-shadow: inset 0 0 0 1px var(--tm-frame-outer), inset 0 0 0 9px var(--tm-frame-inner),
    var(--tm-shadow-sheet) !important;
}
${writing("nested-fossil")} {
  box-shadow: inset 0 0 0 1px var(--tm-frame-outer), inset 0 0 0 9px var(--tm-frame-inner);
}
${sel("nested-fossil")} { box-shadow: inset 3px 0 0 0 var(--tm-frame-rail) !important; }

/* ---- Sopečná šeď · čedičové stupně · žádný rozmazaný stín -------------- */
${sheets("basalt-steps")} {
  box-shadow: inset 0 0 0 2px var(--tm-frame-outer), inset 0 0 0 3px var(--tm-frame-inner),
    6px 6px 0 0 var(--tm-frame-rail) !important;
}
${writing("basalt-steps")} {
  box-shadow: inset 0 0 0 2px var(--tm-frame-outer);
}
${sel("basalt-steps")} { box-shadow: inset 0 0 0 1px var(--tm-frame-inner) !important; }

/* ---- Tichý zápis · skoro plochá kniha záznamů --------------------------
   Žádný rám místnosti, žádné vnoření: list a popover nesou jedinou
   vlásečnici #373737, psací pole zůstává otevřené a vybraná položka
   navigace dostává k azulové výplni areiovou obrysovou linku. */
${sheets("quiet-ledger")} {
  box-shadow: inset 0 0 0 1px var(--tm-frame-outer), var(--tm-shadow-sheet) !important;
}
${sel("quiet-ledger")} { box-shadow: inset 0 0 0 1px var(--tm-frame-highlight) !important; }

/* ---- Thangky · čtyři rámy z pigmentové tradice ---------------------------
   Thangka visí v brokátovém rámu se zlatou paspulkou; každá ze čtyř palet
   si z něj bere jinou část. Nagtang: dvojitá zlatá vlásečnice (kresba
   zlatem na sazích). Martang: paspulka, pás hedvábí, paspulka. Sertang:
   široký brokátový pás s rumělkovou kolejnicí. Minerály: tři pigmenty jako
   tři linky — lapis nahoře, malachit vlevo, rumělka vpravo. */
${sheets("gold-keyline")} {
  box-shadow: inset 0 0 0 1px var(--tm-frame-highlight), inset 0 0 0 2px var(--tm-frame-outer),
    inset 0 0 0 3px var(--tm-frame-highlight), var(--tm-shadow-sheet) !important;
}
${writing("gold-keyline")} {
  box-shadow: inset 0 0 0 1px var(--tm-frame-highlight), inset 0 0 0 2px var(--tm-frame-outer),
    inset 0 0 0 3px var(--tm-frame-highlight);
}
${sel("gold-keyline")} { box-shadow: inset 0 0 0 1px var(--tm-frame-highlight) !important; }

${sheets("thangka-mount")} {
  box-shadow: inset 0 0 0 1px var(--tm-frame-highlight), inset 0 0 0 4px var(--tm-frame-outer),
    inset 0 0 0 5px var(--tm-frame-highlight), var(--tm-shadow-sheet) !important;
}
${writing("thangka-mount")} {
  box-shadow: inset 0 0 0 1px var(--tm-frame-highlight), inset 0 0 0 4px var(--tm-frame-outer),
    inset 0 0 0 5px var(--tm-frame-highlight);
}
${sel("thangka-mount")} { box-shadow: inset 4px 0 0 0 var(--tm-frame-rail) !important; }

${sheets("brocade-band")} {
  box-shadow: inset 0 0 0 6px var(--tm-frame-outer), inset 9px 0 0 0 var(--tm-frame-rail),
    var(--tm-shadow-sheet) !important;
}
${writing("brocade-band")} {
  box-shadow: inset 0 0 0 6px var(--tm-frame-outer), inset 9px 0 0 0 var(--tm-frame-rail);
}
${sel("brocade-band")} { box-shadow: inset 5px 0 0 0 var(--tm-frame-rail) !important; }

${sheets("pigment-rails")} {
  box-shadow: inset 0 3px 0 0 var(--tm-frame-outer), inset 4px 0 0 0 var(--tm-frame-rail),
    inset -4px 0 0 0 var(--tm-frame-highlight), var(--tm-shadow-sheet) !important;
}
${writing("pigment-rails")} {
  box-shadow: inset 4px 0 0 0 var(--tm-frame-rail), inset -4px 0 0 0 var(--tm-frame-highlight);
}
${sel("pigment-rails")} { box-shadow: inset 4px 0 0 0 var(--tm-frame-rail) !important; }

/* ---- Americano a chai · tkané kolejnice -------------------------------- */
${sheets("woven-rails")} {
  box-shadow: inset 0 0 0 6px var(--tm-frame-outer), inset 0 0 0 8px var(--tm-frame-inner),
    var(--tm-shadow-sheet) !important;
}
${writing("woven-rails")} {
  box-shadow: inset 0 0 0 6px var(--tm-frame-outer), inset 0 0 0 8px var(--tm-frame-inner);
}
${sel("woven-rails")} { box-shadow: inset 0 3px 0 0 var(--tm-frame-highlight), inset 3px 0 0 0 var(--tm-frame-highlight) !important; }

/* ---- Černý písek · písečná římsa ---------------------------------------
   Jedna písková linka po obvodu a dole třípixelová ječmenová římsa, na
   které list stojí. Vybraný panel má ječmenovou kolejnici vlevo. */
${sheets("dune-ledge")} {
  box-shadow: inset 0 0 0 1px var(--tm-frame-outer), inset 0 -3px 0 0 var(--tm-frame-rail),
    var(--tm-shadow-sheet) !important;
}
${writing("dune-ledge")} {
  box-shadow: inset 0 -3px 0 0 var(--tm-frame-rail);
}
${sel("dune-ledge")} { box-shadow: inset 3px 0 0 0 var(--tm-frame-rail) !important; }

/* ---- Hluboká voda · přílivová linka ------------------------------------
   Třípixelová břidlicová linka nahoře a mlžná vlásečnice po obvodu — jako
   čára, kam dosáhl příliv. Vybraný panel má mlžnou linku dole. */
${sheets("tide-line")} {
  box-shadow: inset 0 3px 0 0 var(--tm-frame-rail), inset 0 0 0 1px var(--tm-frame-outer),
    var(--tm-shadow-sheet) !important;
}
${writing("tide-line")} {
  box-shadow: inset 0 3px 0 0 var(--tm-frame-rail);
}
${sel("tide-line")} { box-shadow: inset 0 -2px 0 0 var(--tm-frame-highlight) !important; }
`;
}

// ----------------------------------------------------------------------
// SKIN · to, co paleta říct neumí
// ----------------------------------------------------------------------
// Barvu nese kontrakt, rám nese gramatika. Zůstává ale třetí vrstva, bez
// které se některý vzhled nedá dodržet: TYPOGRAFIE A GEOMETRIE. Zaoblení
// je v aplikaci napsané v inline stylech (`borderRadius: 8`), prostrkání
// majuskulí taky — token je nepřebije, protože inline styl vyhrává. Jedno
// pravidlo s `!important`, střežené `data-appearance`, ano.
//
// PRAVIDLA TÉHLE VRSTVY (jinak by z toho byl druhý design systém):
//   1 · Každý selektor je střežený `html[data-appearance="…"]`. Signature
//       ani kterákoli jiná paleta o téhle vrstvě nesmí vědět.
//   2 · Jen typografie, geometrie a plošná textura. Žádná barva, kterou
//       kontrakt umí říct sám — ta patří do palety a měří se v testech.
//   3 · Nic, co mění rozměr komponenty. Rádius, prostrkání a pozadí ano;
//       padding, šířka a výška ne.
//   4 · Vždycky přes token (`var(--tm-…)`), ne přes napsanou barvu.
//
// Vzhled bez skinu je pořád úplný vzhled — tahle funkce je prázdná pro
// všechny palety kromě těch, které bez ní nedávají smysl.
export function skinCss() {
  /* Vrstva je připravená, ale prázdná: vzhled Signál v temnu, který ji jako
     jediný používal, byl 8. 9. 2026 na přání odstraněn. Pravidla pro ni
     platí dál (viz výše) a hlídá je theme-visual. */
  return "";
}
