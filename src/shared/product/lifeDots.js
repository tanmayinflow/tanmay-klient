export function lifeGrid(width, total) {
  const w = Math.max(240, Math.min(680, width || 320));
  const cols = Math.floor(w / 4);
  return { width: w, cols, rows: Math.ceil(total / cols), height: Math.ceil(total / cols) * 4 + 2 };
}

// Art changes tone only. Every dot remains one day, and even the darkest
// future dot remains lighter than the lightest lived dot.
export function lifeDotTone(index, lived, ink = 0) {
  const strength = Math.max(0, Math.min(1, ink));
  if (index === lived - 1) return { alpha: 1, radius: 1.9, today: true };
  return { alpha: index < lived ? .38 + .54 * strength : .05 + .29 * strength, radius: 1.05, today: false };
}
