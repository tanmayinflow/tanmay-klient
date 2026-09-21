// Semantic names survive theme changes and round trips through stored text.
export const EDITOR_INKS = Object.freeze({
  light: Object.freeze({ copper: '#743627', sage: '#394338', sand: '#68502D' }),
  dark: Object.freeze({ copper: '#BC9281', sage: '#A9B49C', sand: '#C5B49A' }),
});
export function editorInk(name, theme) {
  if (String(theme?.id || theme?.preset || '').startsWith('landscape-') || theme?.material === 'landscape') return EDITOR_INKS[theme.mode === 'dark' ? 'dark' : 'light'][name] || null;
  return name === 'copper' ? theme.accentInk || theme.accent : name === 'sage' ? theme.sage : name === 'sand' ? theme.inkSand || theme.sand : null;
}
export function editorHighlight(name, theme) {
  const ink = editorInk(name, theme) || theme.sand;
  return ink + (theme.mode === 'dark' ? '40' : '2E');
}
