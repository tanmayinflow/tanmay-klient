// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/ui/appearance.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// Eight fixed themes share Landscape Day construction (owner decision 2026-09-24).
// Appearance stays local to this device; it never alters sharing or content.
import {
  APPEARANCE_VERSION, DEFAULT_PRESET,
  migrateLegacyAppearance, normalizeAppearance, resolvePresetId,
  resolveAppearancePreset, appearancePreset, isSystemAware, isSignaturePreset,
  selectAppearance, returnToSignature,
  documentThemeAttrs, pwaThemeColor, resolveTheme, presetPolarity,
} from "./themeRegistry.js";

/** Nový klíč. Verze je i uvnitř hodnoty, ne jen v názvu. */
export const APPEARANCE_KEY = "tm-appearance-v3";
/** Klíč V1 / V1.1. Čte se, nemaže se. */
export const LEGACY_APPEARANCE_KEY = "tm-appearance-v2";
/** Nejstarší klíč. Čte se, nemaže se. */
export const LEGACY_THEME_KEY = "tm-theme";

// Depth is a device preference, independent of the eight color themes.
export const SURFACE_STYLE_KEY = "tm-surface-style-v1";
export const DEFAULT_SURFACE_STYLE = "shadow";
export const SURFACE_STYLE_IDS = Object.freeze(["original", "veil", "shadow", "clear"]);
const SURFACE_STYLE_EVENT = "tm:surface-style-change";
const surfaceFallbacks = new WeakMap();
const unavailableStorage = {};

function storage(store) {
  if (store) return store;
  try { return typeof localStorage === "undefined" ? null : localStorage; } catch (e) { return null; }
}

export function normalizeSurfaceStyle(value) {
  return SURFACE_STYLE_IDS.includes(value) ? value : DEFAULT_SURFACE_STYLE;
}

function storedSurfaceStyle(s) {
  try { return { readable: true, raw: s.getItem(SURFACE_STYLE_KEY) }; }
  catch { return { readable: false, raw: undefined }; }
}

/** Missing, corrupt or inaccessible preferences use the owner's default. */
export function readSurfaceStyle(store) {
  const s = storage(store), key = s || unavailableStorage;
  const saved = s ? storedSurfaceStyle(s) : { readable: false, raw: undefined };
  const pending = surfaceFallbacks.get(key);
  // A failed write still applies for this session, including later theme changes.
  // An actual storage change (including account clearing) invalidates the fallback.
  if (pending && (!saved.readable || saved.raw === pending.before)) return pending.value;
  if (pending) surfaceFallbacks.delete(key);
  return normalizeSurfaceStyle(saved.raw);
}

export function applyDocumentSurfaceStyle(value, doc) {
  const clean = normalizeSurfaceStyle(value);
  const d = doc || (typeof document === "undefined" ? null : document);
  try { d?.documentElement?.setAttribute("data-surface-style", clean); } catch { /* optional appearance */ }
  return clean;
}

/** Writes only the local appearance key; no document or sync payload changes. */
export function writeSurfaceStyle(value, store) {
  const clean = normalizeSurfaceStyle(value), s = storage(store), key = s || unavailableStorage;
  const before = s ? storedSurfaceStyle(s).raw : undefined;
  try {
    if (!s) throw new Error("StorageUnavailable");
    s.setItem(SURFACE_STYLE_KEY, clean);
    surfaceFallbacks.delete(key);
  } catch { surfaceFallbacks.set(key, { value: clean, before }); }
  if (!store) {
    applyDocumentSurfaceStyle(clean);
    try { window.dispatchEvent(new CustomEvent(SURFACE_STYLE_EVENT)); } catch { /* no browser */ }
  }
  return clean;
}

/** Keep open settings and the DOM in agreement across same-origin tabs. */
export function watchSurfaceStyle(cb, win) {
  const w = win || (typeof window === "undefined" ? null : window);
  if (!w?.addEventListener) return () => {};
  function update(event) {
    let s = null;
    try { s = w.localStorage; } catch { /* private mode */ }
    if (event.type === "storage") {
      if (event.key !== null && event.key !== SURFACE_STYLE_KEY) return;
      if (event.storageArea && event.storageArea !== s) return;
      surfaceFallbacks.delete(s || unavailableStorage);
    }
    const clean = readSurfaceStyle(s);
    applyDocumentSurfaceStyle(clean, w.document);
    cb(clean);
  }
  w.addEventListener(SURFACE_STYLE_EVENT, update);
  w.addEventListener("storage", update);
  return () => {
    w.removeEventListener(SURFACE_STYLE_EVENT, update);
    w.removeEventListener("storage", update);
  };
}

// Explicit local review control; never accepted on a deployed origin.
export function localPreviewAppearance(win = typeof window === "undefined" ? null : window) {
  try {
    if (!win || !["127.0.0.1", "localhost", "[::1]"].includes(win.location.hostname)) return null;
    const id = new URLSearchParams(win.location.search).get("previewAppearance");
    return id && resolvePresetId(id) === id ? id : null;
  } catch (e) { return null; }
}

/** Přečte volbu. Nikdy nevyhodí výjimku a nikdy nevrátí nesmysl. */
export function readAppearance(store) {
  const preview = !store && localPreviewAppearance();
  if (preview) return normalizeAppearance(preview);
  const s = storage(store);
  if (!s) return { version: APPEARANCE_VERSION, preset: DEFAULT_PRESET, signature: "signature-day" };
  let raw = null, v2 = null, legacy = null;
  try { raw = s.getItem(APPEARANCE_KEY); } catch (e) { /* soukromý režim */ }
  try { v2 = s.getItem(LEGACY_APPEARANCE_KEY); } catch (e) { /* soukromý režim */ }
  try { legacy = s.getItem(LEGACY_THEME_KEY); } catch (e) { /* soukromý režim */ }
  return migrateLegacyAppearance(raw || v2, legacy);
}

/**
 * Zapíše volbu. Píše i oba starší klíče, aby na témže zařízení nespadl starší
 * nasazený build do jiného světla — a aby se odinstalovaná verze chovala jako
 * dřív. Starší klíče jsou ODVOZENÉ, ne druhá pravda: autorita je `preset`.
 */
export function writeAppearance(pref, store) {
  const s = storage(store);
  const clean = normalizeAppearance(pref);
  if (!s) return clean;
  const p = appearancePreset(clean.preset);
  try { s.setItem(APPEARANCE_KEY, JSON.stringify(clean)); } catch (e) { /* plná kvóta motiv neshodí */ }
  /* Zpětný zápis: starším buildům se každá volba jeví jako Signature ve své
     polaritě — automatika jako „automaticky", volitelná paleta jako den nebo
     noc. Starší build neuměl nic jiného, takže nic jiného neuvidí. */
  const mode = p.kind === "auto" ? "system" : p.polarity;
  try {
    s.setItem(LEGACY_APPEARANCE_KEY, JSON.stringify({ version: 2, family: "signature", mode }));
  } catch (e) { /* totéž */ }
  try { s.setItem(LEGACY_THEME_KEY, mode === "dark" ? "dark" : "light"); } catch (e) { /* totéž */ }
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

/**
 * Vyřešená polarita. Systémové přání se uplatní JEN u `signature-auto` — kdo
 * si zvolil pevný vzhled, tomu ho východ slunce nepřepne.
 */
export function appearanceMode(pref, prefersDark) {
  return presetPolarity(pref && pref.preset, !!prefersDark);
}

/** Vyřešený pevný vzhled pro danou volbu a přání systému. */
export function appearanceResolved(pref, prefersDark) {
  return resolveAppearancePreset(pref && pref.preset, !!prefersDark);
}

/**
 * Zapíše vzhled do dokumentu: atributy na <html>, pole pod stránkou a barvu
 * prohlížeče. Tohle je jediné místo, kde se vzhled dostává mimo React —
 * pre-paint skript v index.html dělá totéž a nesmí se s ním rozejít.
 */
export function applyDocumentTheme(preset, prefersDark, doc) {
  const d = doc || (typeof document === "undefined" ? null : document);
  if (!d) return;
  applyDocumentSurfaceStyle(readSurfaceStyle(), d);
  const attrs = documentThemeAttrs(preset, !!prefersDark);
  const field = appearanceField(preset, !!prefersDark);
  try {
    if (d.documentElement) {
      d.documentElement.setAttribute("data-appearance", attrs["data-appearance"]);
      d.documentElement.setAttribute("data-color-mode", attrs["data-color-mode"]);
      d.documentElement.setAttribute("data-frame-grammar", attrs["data-frame-grammar"]);
      d.documentElement.style.setProperty("color-scheme", attrs["data-color-mode"]);
      // The root canvas can be exposed while a mobile viewport changes size
      // and the body is fixed by a sheet. It must not fall back to white.
      d.documentElement.style.backgroundColor = field;
    }
    if (d.body) d.body.style.background = field;
    const m = d.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute("content", pwaThemeColor(preset, !!prefersDark));
  } catch (e) { /* vzhled nikdy neshodí render */ }
}

/** Pole aplikace pro danou volbu — používá i pre-paint. */
export function appearanceField(preset, prefersDark) { return resolveTheme(preset, !!prefersDark).background; }

/** Klíče, které při střídání účtu patří předchozímu člověku. */
export const APPEARANCE_KEYS = Object.freeze([APPEARANCE_KEY, LEGACY_APPEARANCE_KEY, LEGACY_THEME_KEY, SURFACE_STYLE_KEY]);

export {
  APPEARANCE_VERSION, DEFAULT_PRESET, resolvePresetId, isSystemAware,
  isSignaturePreset, selectAppearance, returnToSignature,
};
