// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/ui/appearance.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// ----------------------------------------------------------------------
// VZHLED · co si člověk zvolil a kde to leží
// ----------------------------------------------------------------------
// Volba je JEDNA hodnota: rodina + režim. Ukládá se verzovaně, aby se dala
// v budoucnu rozšířit bez hádání, a čte se odolně: rozbitý JSON, neznámá
// rodina ani zmizelé úložiště nesmí shodit start aplikace — skončí na
// Signature, protože do rozbitého motivu se nikdo nesmí zavřít.
//
// PREFERENCE JE MÍSTNÍ, NA ZAŘÍZENÍ. Nedělá se pro ni serverový koncový bod
// a necestuje s dokumentem: trenér ji neřídí, nevidí a nepotřebuje vidět,
// a v žádném sdílení ani exportu se neobjevuje. Přesně tak se chová dnešní
// `tm-theme` a Theme System V1 to nemění.
//
// Při střídání účtu na jednom zařízení jde volba do karantény spolu se
// zbytkem cizího úložiště (klientská aplikace, `ownerQuarantine`), takže
// klient B nezdědí motiv klienta A.

import {
  APPEARANCE_VERSION, DEFAULT_FAMILY, DEFAULT_MODE,
  migrateLegacyAppearance, normalizeAppearance, resolveFamilyId, resolveMode, resolveModeChoice,
  documentThemeAttrs, pwaThemeColor, resolveTheme,
} from "./themeRegistry.js";

/** Nový klíč. Verze je i uvnitř hodnoty, ne jen v názvu. */
export const APPEARANCE_KEY = "tm-appearance-v2";
/** Starý klíč. Čte se, nemaže se — starý build na témže zařízení ho pořád chce. */
export const LEGACY_THEME_KEY = "tm-theme";

function storage(store) {
  if (store) return store;
  try { return typeof localStorage === "undefined" ? null : localStorage; } catch (e) { return null; }
}

/** Přečte volbu. Nikdy nevyhodí výjimku a nikdy nevrátí nesmysl. */
export function readAppearance(store) {
  const s = storage(store);
  if (!s) return { version: APPEARANCE_VERSION, family: DEFAULT_FAMILY, mode: DEFAULT_MODE };
  let raw = null, legacy = null;
  try { raw = s.getItem(APPEARANCE_KEY); } catch (e) { /* soukromý režim */ }
  try { legacy = s.getItem(LEGACY_THEME_KEY); } catch (e) { /* soukromý režim */ }
  return migrateLegacyAppearance(raw, legacy);
}

/**
 * Zapíše volbu. Píše i starý klíč `tm-theme` vyřešeným režimem, aby na témže
 * zařízení nespadl starší nasazený build do jiného světla — a aby se
 * odinstalovaná verze chovala jako dřív.
 */
export function writeAppearance(pref, resolvedMode, store) {
  const s = storage(store);
  const clean = normalizeAppearance(pref);
  if (!s) return clean;
  try { s.setItem(APPEARANCE_KEY, JSON.stringify(clean)); } catch (e) { /* plná kvóta motiv neshodí */ }
  try { s.setItem(LEGACY_THEME_KEY, resolvedMode === "dark" ? "dark" : "light"); } catch (e) { /* totéž */ }
  return clean;
}

/** Přání systému. Bez `matchMedia` je odpověď „den". */
export function systemPrefersDark(win) {
  const w = win || (typeof window === "undefined" ? null : window);
  try { return !!(w && w.matchMedia && w.matchMedia("(prefers-color-scheme: dark)").matches); } catch (e) { return false; }
}

/** Ohlásí změnu systémového přání. Vrací funkci, která poslouchání ukončí. */
export function watchSystemMode(cb, win) {
  const w = win || (typeof window === "undefined" ? null : window);
  if (!w || !w.matchMedia) return () => {};
  let mq;
  try { mq = w.matchMedia("(prefers-color-scheme: dark)"); } catch (e) { return () => {}; }
  const handler = (e) => cb(!!e.matches);
  if (mq.addEventListener) { mq.addEventListener("change", handler); return () => mq.removeEventListener("change", handler); }
  if (mq.addListener) { mq.addListener(handler); return () => mq.removeListener(handler); }
  return () => {};
}

/** Vyřešený režim z volby a přání systému. */
export function appearanceMode(pref, prefersDark) {
  return resolveMode(resolveModeChoice(pref && pref.mode), prefersDark);
}

/**
 * Zapíše motiv do dokumentu: atributy na <html>, pole pod stránkou a barvu
 * prohlížeče. Tohle je jediné místo, kde se motiv dostává mimo React —
 * pre-paint skript v index.html dělá totéž a nesmí se s ním rozejít.
 */
export function applyDocumentTheme(family, mode, doc) {
  const d = doc || (typeof document === "undefined" ? null : document);
  if (!d) return;
  const attrs = documentThemeAttrs(family, mode);
  const field = pwaThemeColor(family, mode);
  try {
    if (d.documentElement) {
      d.documentElement.setAttribute("data-theme-family", attrs["data-theme-family"]);
      d.documentElement.setAttribute("data-color-mode", attrs["data-color-mode"]);
      d.documentElement.style.setProperty("color-scheme", mode === "dark" ? "dark" : "light");
    }
    if (d.body) d.body.style.background = field;
    const m = d.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute("content", field);
  } catch (e) { /* motiv nikdy neshodí render */ }
}

/** Pole aplikace pro danou volbu — používá i pre-paint. */
export function appearanceField(family, mode) { return resolveTheme(family, mode).background; }

/** Klíče, které při střídání účtu patří předchozímu člověku. */
export const APPEARANCE_KEYS = Object.freeze([APPEARANCE_KEY, LEGACY_THEME_KEY]);

export { APPEARANCE_VERSION, DEFAULT_FAMILY, DEFAULT_MODE, resolveFamilyId, resolveModeChoice };
