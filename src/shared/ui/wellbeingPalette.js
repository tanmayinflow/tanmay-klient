import { TAG_TONES } from "./theme.js";
import { mixHex } from "./color.js";
import { composite, contrast } from "./contrast.js";

// Three equal kinds of observation, never a good/bad colour scale. Reuse the
// house's rose, ochre and slate inks, fitted to the current paper or dark field.
export function wellbeingPalette(theme, tags = {}) {
  const tones = TAG_TONES[theme.mode === "dark" ? "dark" : "light"];
  const fit = (key) => {
    const original = tags[key]?.fg || tones[key];
    const ink = composite(theme.text, theme.bg);
    for (let step = 0; step <= 100; step++) {
      const color = mixHex(original, ink, step / 100);
      if ([theme.bg, theme.card].every(surface => contrast(color, surface) >= 3)) return color;
    }
    return ink;
  };
  return { mood: fit("rose"), energy: fit("ochre"), well: fit("slate") };
}
