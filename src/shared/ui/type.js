// Display serif is language-aware (Brand §6): Czech display = EB Garamond Regular 400
// (same Garamond family, calmer diacritics), English display = Cormorant Garamond.
// Only weight 400 of EB Garamond is loaded, so lighter/heavier requests settle on
// Regular — exactly what the brand asks for. App re-syncs this on every render, like LANG.
//
// DVĚ VRSTVY, A JE TO ZÁMĚR.
//
//   STACK_*  syrový řez. Tohle je HODNOTA, která se vydá do CSS proměnné
//            v `tokensCss()`. Nikdy se nepíše do inline stylu komponenty —
//            uvnitř proměnné by odkaz sám na sebe byl cyklus.
//   FONT_*   ODKAZ NA TOKEN. Tohle si komponenta dává do `fontFamily`.
//            Záložní hodnota v `var(…, …)` je dům: kdyby proměnná chyběla,
//            vypadá to přesně jako dřív.
//
// Proč: řez patří vzhledu stejně jako barva. Dokud byl řez konstanta v JS,
// mohla ho vyměnit jen ta hrstka míst, která si psala `var(--tm-font-body)`
// ručně; zbytek domu zůstal na DM Sans, ať si člověk zvolil cokoli. Takhle
// se vzhled, který si nese vlastní typografii (`type` v rejstříku), propíše
// do každého jednoho řádku, aniž by se sáhlo na jediné volací místo.
export const STACK_DISPLAY_EN = "'Cormorant Garamond', Georgia, serif";
export const STACK_DISPLAY_CS = "'EB Garamond', 'Cormorant Garamond', Georgia, serif";
// The wordmark is Cormorant regardless of language (no diacritics in 'tanmay').
export const STACK_LOGO = STACK_DISPLAY_EN;
export const STACK_BODY = "'DM Sans', system-ui, sans-serif";
export const STACK_TAG = "'Barlow Condensed', sans-serif";

/* Jazyk nese sama proměnná — `tokensCss(t, lang)` do ní vloží český nebo
   anglický řez. Obě konstanty proto ukazují na týž token a liší se jen
   záložní hodnotou pro případ, že by tokeny ještě nebyly na stránce. */
export const FONT_DISPLAY_EN = `var(--tm-font-display, ${STACK_DISPLAY_EN})`;
export const FONT_DISPLAY_CS = `var(--tm-font-display, ${STACK_DISPLAY_CS})`;
export const FONT_LOGO = `var(--tm-font-logo, ${STACK_LOGO})`;
export const FONT_BODY = `var(--tm-font-body, ${STACK_BODY})`;
export const FONT_TAG = `var(--tm-font-tag, ${STACK_TAG})`;
