// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/ui/contrast.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// ----------------------------------------------------------------------
// KONTRAST · skutečný výpočet, ne tabulka s `pass: true`
// ----------------------------------------------------------------------
// Relativní jas podle WCAG 2.1. Poměr se počítá z hexu nebo rgba, průsvitná
// barva se nejdřív složí na povrch, na kterém opravdu leží — jinak by se
// hlídalo něco, co uživatel nikdy nevidí.
//
// Tenhle soubor nemá žádnou závislost a běží v `node --test` i v prohlížeči.
// Používá ho kontrastní audit motivů a barvoslepá kontrola.

/** "#RRGGBB" | "rgba(r,g,b,a)" | "rgb(r,g,b)" → { r, g, b, a } */
export function parseColor(value) {
  const s = String(value || "").trim();
  if (s.charAt(0) === "#") {
    let h = s.slice(1);
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    if (h.length !== 6) throw new Error("neplatný hex: " + value);
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: 1 };
  }
  const m = s.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i);
  if (!m) throw new Error("neznámý tvar barvy: " + value);
  return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] };
}

const to255 = (v) => Math.max(0, Math.min(255, Math.round(v)));
const two = (v) => to255(v).toString(16).padStart(2, "0").toUpperCase();

/** { r, g, b } → "#RRGGBB" */
export function toHex(c) { return "#" + two(c.r) + two(c.g) + two(c.b); }

/** Průsvitnou barvu složí na neprůhledný povrch. Vrací neprůhledný hex. */
export function composite(fg, bg) {
  const f = parseColor(fg);
  const b = parseColor(bg);
  if (f.a >= 1) return toHex(f);
  const a = f.a;
  return toHex({ r: f.r * a + b.r * (1 - a), g: f.g * a + b.g * (1 - a), b: f.b * a + b.b * (1 - a) });
}

const channel = (v) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };

/** Relativní jas 0–1 podle WCAG 2.1. Průsvitná barva se skládá na `on`. */
export function luminance(color, on) {
  const c = parseColor(on ? composite(color, on) : color);
  return 0.2126 * channel(c.r) + 0.7152 * channel(c.g) + 0.0722 * channel(c.b);
}

/** Poměr kontrastu dvou barev. `on` je povrch, na kterém se skládá průsvitnost. */
export function contrast(a, b, on) {
  const base = on || (parseColor(b).a >= 1 ? toHex(parseColor(b)) : null);
  const la = luminance(a, base);
  const lb = luminance(b, base || null);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Poměr zaokrouhlený na dvě desetiny, jak se zapisuje do zprávy. */
export function ratio(a, b, on) { return Math.round(contrast(a, b, on) * 100) / 100; }

/** Odstín ve stupních šedi — kontrola, jestli se dvě barvy liší i bez barvy. */
export function grayscale(color, on) {
  const l = luminance(color, on);
  const inv = (c) => (c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);
  const v = to255(inv(l) * 255);
  return toHex({ r: v, g: v, b: v });
}

// Barvoslepost · Brettel / Viénot–Brettel–Mollon lineární projekce v LMS.
// Není to lékařská simulace a nemá jí být: stačí ukázat, jestli dvě barvy
// splynou člověku, který jeden kanál nemá.
const RGB_TO_LMS = [
  [0.31399022, 0.63951294, 0.04649755],
  [0.15537241, 0.75789446, 0.08670142],
  [0.01775239, 0.10944209, 0.87256922],
];
const LMS_TO_RGB = [
  [5.47221206, -4.6419601, 0.16963708],
  [-1.1252419, 2.29317094, -0.1678952],
  [0.02980165, -0.19318073, 1.16364789],
];
const CVD = {
  protanopia: [[0, 1.05118294, -0.05116099], [0, 1, 0], [0, 0, 1]],
  deuteranopia: [[1, 0, 0], [0.9513092, 0, 0.04866992], [0, 0, 1]],
  tritanopia: [[1, 0, 0], [0, 1, 0], [-0.86744736, 1.86727089, 0]],
};
const mul = (m, v) => m.map((row) => row[0] * v[0] + row[1] * v[1] + row[2] * v[2]);
const gam = (c) => (c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(Math.max(c, 0), 1 / 2.4) - 0.055);

/** Simulovaná podoba barvy pro protanopii / deuteranopii / tritanopii. */
export function simulateCvd(color, kind) {
  const m = CVD[kind];
  if (!m) throw new Error("neznámý druh barvosleposti: " + kind);
  const c = parseColor(color);
  const lin = [channel(c.r), channel(c.g), channel(c.b)];
  const lms = mul(RGB_TO_LMS, lin);
  const out = mul(LMS_TO_RGB, mul(m, lms));
  return toHex({ r: gam(out[0]) * 255, g: gam(out[1]) * 255, b: gam(out[2]) * 255 });
}

/** Vzdálenost dvou barev po simulaci — 0 znamená, že splynuly. */
export function cvdDistance(a, b, kind) {
  const x = parseColor(simulateCvd(a, kind));
  const y = parseColor(simulateCvd(b, kind));
  return Math.sqrt((x.r - y.r) ** 2 + (x.g - y.g) ** 2 + (x.b - y.b) ** 2);
}

/**
 * Sytost 0–1 (max − min kanálu). Je to hrubé měřítko a přesně to stačí na
 * otázku, kterou tu řešíme: JE TA PLOCHA JEŠTĚ NEUTRÁLNÍ, nebo už je to
 * barevný blok? Neutrální uhel má sytost pod 0,06; sytá modř nad 0,3.
 */
export function chroma(color, on) {
  const c = parseColor(on ? composite(color, on) : color);
  return (Math.max(c.r, c.g, c.b) - Math.min(c.r, c.g, c.b)) / 255;
}

/**
 * Barevný nádech 0–1: největší odchylka kanálu od průměru. Na rozdíl od
 * `chroma` nepenalizuje světlé barvy — krémový len (#F4EBC8) vyjde 0,10,
 * kdežto sytý tyrkys (#035352) 0,21. Přesně tuhle otázku potřebujeme
 * u BĚŽNÉHO TEXTU: je to ještě inkoust, nebo už barva?
 */
export function tint(color, on) {
  const c = parseColor(on ? composite(color, on) : color);
  const mean = (c.r + c.g + c.b) / 3;
  return Math.max(Math.abs(c.r - mean), Math.abs(c.g - mean), Math.abs(c.b - mean)) / 255;
}

/** Odstín ve stupních (0 = červená, 120 = zelená, 240 = modrá). */
export function hueDeg(color, on) {
  const c = parseColor(on ? composite(color, on) : color);
  const r = c.r / 255, g = c.g / 255, b = c.b / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  if (d === 0) return 0;
  let h;
  if (mx === r) h = ((g - b) / d) % 6;
  else if (mx === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h *= 60;
  return h < 0 ? h + 360 : h;
}

/** Je barva zelená / mechová? Odstín 75–170° a sytost nad prahem. */
export function readsGreen(color, minChroma) {
  const h = hueDeg(color), c = chroma(color);
  return h >= 75 && h <= 170 && c >= (minChroma == null ? 0.05 : minChroma);
}

/** Prahy WCAG 2.1 AA, pojmenované, ať se v testech nehádají čísla. */
export const AA = Object.freeze({ text: 4.5, largeText: 3, ui: 3 });
