import { BRAND } from "./themeRegistry.js";
import { hexA } from "./color.js";

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
