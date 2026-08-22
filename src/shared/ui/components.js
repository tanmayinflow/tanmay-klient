// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/ui/components.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// ----------------------------------------------------------------------
// SPOLEČNÉ POVRCHY · tvar tlačítka, pole, štítku, karty
// ----------------------------------------------------------------------
// Obě aplikace jsou psané inline styly. Nezakládáme kvůli tomu druhý CSS
// framework — tady jsou dvě věci:
//
//   1. `componentsCss(t)`: pravidla pro třídy, které OBĚ aplikace opravdu
//      nosí v markupu (.tm-nav-item, .tm-cta, .tm-pill, .tm-dash, .tm-chip,
//      .tm-scroll, .tm-thead …). Ta pravidla platí okamžitě v obou domech.
//   2. Pomocné funkce pro inline styl (`tmButton`, `tmInput`, `tmChip`,
//      `tmCard`), aby nová komponenta nemusela znovu vymýšlet rádius,
//      výšku ani odstup.
//
// Všechno stojí na tokenech z ui/tokens.js. Rádius tlačítka, výška pole a
// doba animace se mění tam, a projeví se v obou domech.

import { RADII, SPACE, TAP, CONTROL } from "./tokens.js";
import { hexA } from "./color.js";

/** Tlačítko. `variant`: "primary" | "quiet" | "ghost" | "danger". */
export function tmButton(t, variant, opts) {
  const o = opts || {};
  const h = o.compact ? CONTROL.buttonCompact : CONTROL.button;
  const zaklad = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: SPACE[2],
    minHeight: h, padding: o.compact ? `0 ${SPACE[3]}px` : `0 ${SPACE[4]}px`,
    borderRadius: o.pill ? RADII.pill : RADII.sm,
    fontFamily: "var(--tm-font-body)", fontSize: o.compact ? 13 : 14, lineHeight: 1.2,
    cursor: o.disabled ? "default" : "pointer",
    opacity: o.disabled ? 0.45 : 1,
    transition: "background var(--tm-dur-fast) var(--tm-ease), border-color var(--tm-dur-fast) var(--tm-ease)",
  };
  if (variant === "primary") return { ...zaklad, background: t.accent, color: t.onAccent, border: "none" };
  if (variant === "danger") return { ...zaklad, background: "transparent", color: t.danger, border: `1px solid ${hexA(t.danger, 0.5)}` };
  if (variant === "ghost") return { ...zaklad, background: "transparent", color: t.textSec, border: "none" };
  return { ...zaklad, background: "transparent", color: t.text, border: `1px solid ${t.border}` };
}

/** Pole. Jedna výška pro celý dům. */
export function tmInput(t, opts) {
  const o = opts || {};
  return {
    width: o.width || "100%", boxSizing: "border-box",
    minHeight: o.compact ? CONTROL.inputCompact : CONTROL.input,
    padding: `0 ${SPACE[3]}px`,
    background: t.sheet, color: t.text,
    border: `1px solid ${o.invalid ? t.danger : t.border}`,
    borderRadius: RADII.sm,
    fontFamily: "var(--tm-font-body)", fontSize: 15, outline: "none",
  };
}

/** Štítek. Tón přichází z makeTags(). */
export function tmChip(tone, opts) {
  const o = opts || {};
  return {
    display: "inline-flex", alignItems: "center", gap: SPACE[1],
    background: tone.bg, color: tone.fg,
    borderRadius: RADII.pill, padding: `3px ${SPACE[3]}px`,
    minHeight: o.tappable ? TAP.min : undefined,
    fontFamily: "var(--tm-font-tag)", textTransform: "uppercase",
    letterSpacing: "0.1em", fontSize: 11, whiteSpace: "nowrap",
  };
}

/** Karta. */
export function tmCard(t, opts) {
  const o = opts || {};
  return {
    background: o.sheet ? t.sheet : t.card,
    border: `1px solid ${o.soft ? t.borderSoft : t.border}`,
    borderRadius: RADII.md,
    padding: o.pad == null ? SPACE[4] : o.pad,
    boxShadow: o.lift ? t.shadowLift : (o.flat ? "none" : t.shadow),
  };
}


// ----------------------------------------------------------------------
// DROBNÉ POMOCNÍKY, KTERÉ SE ROZEŠLY
// ----------------------------------------------------------------------
// Pět malých funkcí pro inline styl existovalo v obou domech zvlášť a
// rozešlo se: rádius 6 proti 8, písmo 13 proti 14, kalendářní tlačítko
// 40 px proti 26, prostrkání 0,14 em proti 0,12, metadata 12 px proti 10.
// Žádný z těch rozdílů nikdo nezvolil. Kanonická je novější podoba z osobní
// aplikace; klientská se k ní srovnává.

/** Ikonové tlačítko · drobný sekundární ovládací prvek. Na dotyku dostane
 *  pohodlnější cíl přes třídu `tm-iconbtn` (viz componentsCss). */
export function iconBtn(t) {
  return {
    background: "transparent", border: `1px solid ${t.border}`, borderRadius: RADII.xs,
    color: t.textMuted, cursor: "pointer", width: TAP.min, height: TAP.min,
    fontSize: 12, lineHeight: 1, display: "inline-flex", alignItems: "center", justifyContent: "center",
  };
}

/** Pole ve formuláři. */
export function fieldStyle(t) {
  return {
    width: "100%", background: t.card, border: `1px solid ${t.border}`, borderRadius: RADII.sm,
    color: t.text, fontFamily: "var(--tm-font-body)", fontSize: 13, padding: "9px 11px", outline: "none",
  };
}

/** Tlačítko v kalendářní hlavičce. Šipka je pořád dotykový cíl. */
export function calBtn(t, dis) {
  return {
    background: "transparent", border: `1px solid ${t.border}`, borderRadius: RADII.sm,
    color: dis ? t.textMuted : t.text, cursor: dis ? "default" : "pointer",
    padding: "3px 10px", fontSize: 15, opacity: dis ? 0.4 : 1,
    minWidth: TAP.compact + 2, minHeight: TAP.compact + 2,
    display: "inline-flex", alignItems: "center", justifyContent: "center",
  };
}

/** Nadpis oddílu. */
export function subLabel(t) {
  return {
    fontFamily: "var(--tm-font-tag)", textTransform: "uppercase", letterSpacing: "0.14em",
    fontSize: 12, fontWeight: 600, lineHeight: 1.5, color: t.sage, marginBottom: SPACE[2],
  };
}

/** Popisek metadat. */
export function metaLabel(t) {
  return {
    fontFamily: "var(--tm-font-tag)", textTransform: "uppercase", letterSpacing: "0.1em",
    fontSize: 12, color: t.textMuted,
  };
}

/**
 * Pravidla pro třídy, které oba domy opravdu nosí.
 * Nic tu nezavádí nový vzhled — jen sjednocuje ten, který už mají, a váže
 * ho na tokeny, aby se dal změnit z jednoho místa.
 */
export function componentsCss(t) {
  return `
/* ---- ovládací prvky · dotykový cíl a rádius z tokenů ------------------- */
.tm-cta { border-radius: var(--tm-r-pill); min-height: var(--tm-tap-compact); }
.tm-pill { border-radius: var(--tm-r-pill); }
.tm-dash { border-radius: var(--tm-r-sm); min-height: var(--tm-tap-compact); }
.tm-chip { border-radius: var(--tm-r-pill); }
.tm-nav-item { border-radius: var(--tm-r-sm); min-height: var(--tm-tap-compact); }
/* Na dotykovém zařízení dostane každý řádek navigace pohodlný cíl. Myš ho
   nepotřebuje a hustší panel se na počítači čte líp. */
@media (pointer: coarse) {
  .tm-nav-item { min-height: var(--tm-tap); }
  .tm-cta, .tm-dash { min-height: var(--tm-tap); }
}

/* ---- soustředění · klávesnice musí být vidět --------------------------- */
:where(button, a[href], input, select, textarea, [tabindex]):focus-visible {
  outline: 2px solid ${t.accent};
  outline-offset: 2px;
  border-radius: var(--tm-r-xs);
}

/* ---- povrchy ---------------------------------------------------------- */
.tm-cs { border-radius: var(--tm-r-sheet); }
.tm-scroll { scrollbar-width: thin; scrollbar-color: ${hexA(t.textMuted, 0.35)} transparent; }
.tm-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
.tm-scroll::-webkit-scrollbar-thumb { background: ${hexA(t.textMuted, 0.3)}; border-radius: var(--tm-r-pill); }
.tm-scroll::-webkit-scrollbar-track { background: transparent; }

/* ---- stavy · prázdno, čekání, chyba ----------------------------------- */
/* Prázdný stav nikoho neobviňuje a říká, co dělat dál. Načítání je klid,
   ne točící se kolečko bez konce. Chyba říká, co se nestalo, jestli data
   zůstala, a co s tím. Tvar je společný; věty patří místnosti. */
.tm-empty { font-family: var(--tm-font-body); font-style: italic; font-size: 13.5px;
  color: ${t.textMuted}; line-height: 1.65; padding: var(--tm-s5) var(--tm-s4); max-width: 34em; }
.tm-loading { font-family: var(--tm-font-tag); text-transform: uppercase; letter-spacing: 0.18em;
  font-size: 11px; color: ${t.textMuted}; padding: var(--tm-s4); }
.tm-skeleton { background: ${hexA(t.textMuted, 0.12)}; border-radius: var(--tm-r-sm);
  animation: tmPulz 1.6s ease-in-out infinite; }
.tm-error { font-family: var(--tm-font-body); font-size: 13.5px; color: ${t.danger};
  background: ${hexA(t.danger, 0.08)}; border: 1px solid ${hexA(t.danger, 0.35)};
  border-radius: var(--tm-r-sm); padding: var(--tm-s3) var(--tm-s4); line-height: 1.6; }
@keyframes tmPulz { 0%, 100% { opacity: 0.55; } 50% { opacity: 0.9; } }

/* ---- tabulka ---------------------------------------------------------- */
.tm-thead { border-bottom: 1.5px solid ${t.border}; }

/* ---- neviditelné rozšíření dotykového cíle -----------------------------
   Kolečko smí zůstat kolečkem a šipka šipkou. Prst ale potřebuje víc místa,
   než kolik má mít ten tvar — tak se cíl rozšíří neviditelnou plochou kolem.
   Vzhled zůstává, trefa se zvětší. Používá se tam, kde by zvětšení prvku
   rozbilo rytmus řádku: tečky na stupnici, přepínače v kartě dne, textové
   odkazy uvnitř věty.
   Proměnná --tm-tap je 44 px tam, kde je místo; --tm-tap-compact je 38.
   26 zůstává absolutním minimem drobného sekundárního prvku, ne standardem. */
.tm-tap { position: relative; }
.tm-tap::after {
  content: ""; position: absolute; left: 50%; top: 50%;
  width: var(--tm-tap); height: var(--tm-tap);
  min-width: 100%; min-height: 100%;
  transform: translate(-50%, -50%);
}
.tm-tap-c { position: relative; }
.tm-tap-c::after {
  content: ""; position: absolute; left: 50%; top: 50%;
  width: var(--tm-tap-compact); height: var(--tm-tap-compact);
  min-width: 100%; min-height: 100%;
  transform: translate(-50%, -50%);
}

/* ---- ikonové tlačítko · na prstu větší než pod myší ------------------- */
.tm-iconbtn { border-radius: var(--tm-r-xs); }
@media (pointer: coarse) {
  .tm-iconbtn { width: var(--tm-tap-compact) !important; height: var(--tm-tap-compact) !important; }
}
`;
}
