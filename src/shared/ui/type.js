// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/ui/type.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// Display serif is language-aware (Brand §6): Czech display = EB Garamond Regular 400
// (same Garamond family, calmer diacritics), English display = Cormorant Garamond.
// Only weight 400 of EB Garamond is loaded, so lighter/heavier requests settle on
// Regular — exactly what the brand asks for. App re-syncs this on every render, like LANG.
export const FONT_DISPLAY_EN = "'Cormorant Garamond', Georgia, serif";
export const FONT_DISPLAY_CS = "'EB Garamond', 'Cormorant Garamond', Georgia, serif";
// The wordmark is Cormorant regardless of language (no diacritics in 'tanmay').
export const FONT_LOGO = FONT_DISPLAY_EN;
export const FONT_BODY = "'DM Sans', system-ui, sans-serif";
export const FONT_TAG = "'Barlow Condensed', sans-serif";
