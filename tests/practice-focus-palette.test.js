import { test } from "node:test";
import assert from "node:assert/strict";
import { makeThemeFor, makeTagsFor, FIXED_PRESET_IDS } from "../src/shared/ui/theme.js";
import { contrast, composite, parseColor } from "../src/shared/ui/contrast.js";
import { wellbeingPalette } from "../src/shared/ui/wellbeingPalette.js";
import { pomodoroPickerPalette } from "../src/shared/ui/pomodoroPalette.js";

for (const preset of FIXED_PRESET_IDS) {
  test(`${preset}: wellbeing uses three distinct, visible coordinated inks`, () => {
    const theme = makeThemeFor(preset);
    const colors = Object.values(wellbeingPalette(theme, makeTagsFor(preset)));
    assert.equal(new Set(colors).size, 3);
    for (const color of colors) {
      for (const surface of [theme.bg, theme.card]) assert.ok(contrast(color, surface) >= 3);
    }
    // Difference must be visible, not just three unequal hex strings.
    for (let i = 0; i < colors.length; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        const a = parseColor(colors[i]), b = parseColor(colors[j]);
        assert.ok(Math.hypot(a.r - b.r, a.g - b.g, a.b - b.b) >= 35);
      }
    }
    assert.equal(new Set(Object.values(wellbeingPalette(theme))).size, 3, "fallback also preserves categories");
  });

  for (const photo of [false, true]) {
    test(`${preset}: focus picker has readable text and placeholder${photo ? " over a photo" : " on paper"}`, () => {
      const theme = makeThemeFor(preset);
      const palette = pomodoroPickerPalette(theme, photo);
      const opacity = parseColor(palette.background).a;
      assert.ok(opacity > 0 && opacity < 1);
      for (const base of photo ? ["#000000", "#FFFFFF"] : [theme.bg]) {
        const panel = composite(palette.background, base);
        const field = composite(palette.input, panel);
        assert.ok(contrast(palette.ink, panel) >= 4.5, "heading and category text");
        assert.ok(contrast(palette.secondary, panel) >= 4.5, "back action");
        assert.ok(contrast(palette.ink, field) >= 4.5, "typed text");
        assert.ok(contrast(palette.placeholder, field) >= 4.5, "placeholder");
        assert.ok(contrast(palette.focus, field) >= 3, "keyboard focus");
      }
    });
  }
}
