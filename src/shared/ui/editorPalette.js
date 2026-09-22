// Semantic names survive theme changes and round trips through stored text.
export const EDITOR_INKS = Object.freeze({
  light: Object.freeze({ copper: '#743627', burgundy: '#6A3E44', slate: '#3F5960', plum: '#625065', sage: '#394338', sand: '#68502D' }),
  dark: Object.freeze({ copper: '#BC9281', burgundy: '#C89FA6', slate: '#A0B8BF', plum: '#B9A7BC', sage: '#A9B49C', sand: '#C5B49A' }),
});
export const EDITOR_CHOICES = Object.freeze(['copper', 'burgundy', 'slate', 'plum']);
export const EDITOR_NAMES = Object.freeze(['copper', 'burgundy', 'slate', 'plum', 'sage', 'sand']);
export const EDITOR_LABELS = Object.freeze({copper:['Cihlová','Earth'],burgundy:['Vínová','Burgundy'],slate:['Říční','River slate'],plum:['Břidlicová fialová','Muted plum'],sage:['Šalvěj','Sage'],sand:['Písek','Sand']});
export function editorInk(name, theme) {
  if (['burgundy','slate','plum'].includes(name)) return EDITOR_INKS[theme?.mode === 'dark' ? 'dark' : 'light'][name];
  if (String(theme?.id || theme?.preset || '').startsWith('landscape-') || theme?.material === 'landscape') return EDITOR_INKS[theme.mode === 'dark' ? 'dark' : 'light'][name] || null;
  return name === 'copper' ? theme.accentInk || theme.accent : name === 'sage' ? theme.sage : name === 'sand' ? theme.inkSand || theme.sand : null;
}
export function editorHighlight(name, theme) {
  const ink = editorInk(name, theme) || theme.sand;
  return ink + (theme.mode === 'dark' ? '40' : '2E');
}
