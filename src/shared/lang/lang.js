// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/lang/lang.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// ----------------------------------------------------------------------
// LANGUAGE · CZ / EN
// ----------------------------------------------------------------------
// Module-level language flag. App sets it on every render (the whole tree
// re-renders on lang change since nothing is memoized), so L() stays a
// zero-plumbing inline helper: L("česky", "english").
let LANG = "cs";

/** App.tsx drží vlastní render-flag `LANG`; tenhle setter drží sdílený
 *  jazyk v souběhu, aby L() v obou aplikacích odpovídalo témuž stavu. */
export function setLang(v) { LANG = v === "en" ? "en" : "cs"; return LANG; }
export function getLang() { return LANG; }
export const detectLang = () => {
  try {
    const saved = window.localStorage.getItem("tm-lang");
    if (saved === "cs" || saved === "en") return saved;
    const nav = (navigator.language || navigator.languages?.[0] || "cs").toLowerCase();
    return nav.startsWith("cs") || nav.startsWith("sk") ? "cs" : "en";
  } catch (e) { return "cs"; }
};
export const L = (cs, en) => (LANG === "cs" ? cs : en);
// Display-only translation of internal filter tokens (values stay Czech in state/logic)
export const LV = (x) => ({ "Vše": L("Vše", "All"), Status: L("Stav", "Status"), Area: L("Krajina", "Landscape"), Priority: L("Priorita", "Priority"), Completed: L("Hotové", "Completed"), Archiv: L("Archiv", "Archive") }[x] || x);
// goal vocabulary · display layer only — stored keys stay English, nothing migrates
export const GS = (x) => ({ "Not started": L("Čeká", "Waiting"), "In progress": L("V pohybu", "In progress"), "On Hold": L("Odloženo", "On hold"), "Completed": L("Hotovo", "Completed") }[x] || x);
export const PL = (x) => ({ High: L("Vysoká", "High"), Normal: L("Střední", "Medium"), Moderate: L("Nízká", "Low") }[x] || x);
