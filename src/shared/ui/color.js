// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/ui/color.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// Jedna barva, jedna průhlednost. Používá se všude, kde token nese plnou
// barvu a plocha z ní potřebuje jen nádech.
export function hexA(hex, a) { const h = hex.replace("#", ""); const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16); return `rgba(${r},${g},${b},${a})`; }

// Dvě barvy a poměr mezi nimi. Používá to rejstřík motivů, když z kotevních
// barev rodiny odvozuje povrchy, hrany a stavy — jednou při načtení modulu,
// ne při každém vykreslení.
export function mixHex(a, b, ratio) {
  const p = (hex) => { const h = hex.replace("#", ""); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; };
  const x = p(a), y = p(b), k = Math.max(0, Math.min(1, ratio));
  const c = (i) => Math.round(x[i] * (1 - k) + y[i] * k).toString(16).padStart(2, "0").toUpperCase();
  return "#" + c(0) + c(1) + c(2);
}
