// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/ui/appearance.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// ----------------------------------------------------------------------
// VZHLED · co si člověk zvolil a kde to leží
// ----------------------------------------------------------------------
// Od V2 je volba JEDNA hodnota: id hotového vzhledu. Ukládá se verzovaně,
// aby se dala v budoucnu rozšířit bez hádání, a čte se odolně: rozbitý JSON,
// zrušená rodina ani zmizelé úložiště nesmí shodit start aplikace — skončí
// na `signature-auto`, protože do rozbitého vzhledu se nikdo nesmí zavřít.
//
// GENERACE KLÍČŮ ŽIJÍ VEDLE SEBE:
//
//   `tm-theme`          "light" | "dark"                 před V1
//   `tm-appearance-v2`  { version: 2, family, mode }      V1 a V1.1
//   `tm-appearance-v3`  { version: 3, preset }            V2
//   `tm-appearance-v3`  { version: 4, preset, signature } V3 · týž klíč
//
// V3 nese v témže klíči i POSLEDNÍ SIGNATURE VOLBU: kdo si zapne volitelnou
// paletu a vrátí se, dostane zpátky přesně tu automatiku, den, nebo noc,
// kterou měl. Starší build V2 si z hodnoty přečte neznámý preset a bezpečně
// spadne na automatiku.
//
// Čtení sáhne po nejnovějším, který najde, a starší jen PŘEVEDE. Nic se
// nemaže: starší nasazený build na témže zařízení své klíče pořád chce, a
// odinstalovaná verze se pak chová jako dřív. Kdy se smí kompatibilní čtení
// odstranit, je zapsané v THEME-SYSTEM-V2.md.
//
// PREFERENCE JE MÍSTNÍ, NA ZAŘÍZENÍ. Nedělá se pro ni serverový koncový bod
// a necestuje s dokumentem: trenér ji neřídí, nevidí a nepotřebuje vidět,
// a v žádném sdílení ani exportu se neobjevuje.
//
// Při střídání účtu na jednom zařízení jde volba do karantény spolu se
// zbytkem cizího úložiště (klientská aplikace, `ownerQuarantine`), takže
// klient B nezdědí vzhled klienta A.

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

function storage(store) {
  if (store) return store;
  try { return typeof localStorage === "undefined" ? null : localStorage; } catch (e) { return null; }
}

/** Přečte volbu. Nikdy nevyhodí výjimku a nikdy nevrátí nesmysl. */
export function readAppearance(store) {
  const s = storage(store);
  if (!s) return { version: APPEARANCE_VERSION, preset: DEFAULT_PRESET, signature: DEFAULT_PRESET };
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
  const attrs = documentThemeAttrs(preset, !!prefersDark);
  const field = pwaThemeColor(preset, !!prefersDark);
  try {
    if (d.documentElement) {
      d.documentElement.setAttribute("data-appearance", attrs["data-appearance"]);
      d.documentElement.setAttribute("data-color-mode", attrs["data-color-mode"]);
      d.documentElement.setAttribute("data-frame-grammar", attrs["data-frame-grammar"]);
      d.documentElement.style.setProperty("color-scheme", attrs["data-color-mode"]);
    }
    if (d.body) d.body.style.background = field;
    const m = d.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute("content", field);
  } catch (e) { /* vzhled nikdy neshodí render */ }
}

/** Pole aplikace pro danou volbu — používá i pre-paint. */
export function appearanceField(preset, prefersDark) { return resolveTheme(preset, !!prefersDark).background; }

/** Klíče, které při střídání účtu patří předchozímu člověku. */
export const APPEARANCE_KEYS = Object.freeze([APPEARANCE_KEY, LEGACY_APPEARANCE_KEY, LEGACY_THEME_KEY]);

export {
  APPEARANCE_VERSION, DEFAULT_PRESET, resolvePresetId, isSystemAware,
  isSignaturePreset, selectAppearance, returnToSignature,
};
