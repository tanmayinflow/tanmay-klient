import { BRAND } from "./themeRegistry.js";
import { hexA, mixHex } from "./color.js";
import { composite, contrast } from "./contrast.js";

export function pomodoroPalette(theme, photo = false) {
  const ink = photo ? BRAND.linen : theme.heading;
  return {
    background: photo ? BRAND.forest : theme.bg,
    ink,
    secondary: photo ? BRAND.linen : theme.textSec,
    line: photo ? hexA(BRAND.linen, .6) : theme.textSec,
    wash: hexA(ink, .08),
    progress: photo ? BRAND.linen : theme.accent,
  };
}

// The intent picker belongs to the current room. Its translucent paper must
// remain readable even when the fullscreen timer has a user photograph.
export function pomodoroPickerPalette(theme, photo = false) {
  const background = hexA(theme.card, photo ? .96 : .9);
  const input = hexA(theme.bg, .45);
  const bases = photo ? ["#000000", "#FFFFFF"] : [theme.bg];
  const panels = bases.map(base => composite(background, base));
  const fields = panels.map(panel => composite(input, panel));
  const ink = composite(theme.text, theme.card);
  const fit = (color, surfaces, minimum) => {
    const start = composite(color, theme.card);
    for (let step = 0; step <= 100; step++) {
      const next = mixHex(start, ink, step / 100);
      if (surfaces.every(surface => contrast(next, surface) >= minimum)) return next;
    }
    return ink;
  };
  return {
    background, input, ink,
    secondary: fit(theme.textSec, panels, 4.5),
    placeholder: fit(mixHex(ink, theme.card, .2), fields, 4.5),
    focus: fit(theme.accentInk || theme.accent, fields, 3),
    border: hexA(ink, .24),
  };
}
