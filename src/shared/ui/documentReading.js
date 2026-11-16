// Visual choices belong to this browser/device, never to a document or a sync payload.
export const DOCUMENT_READING_KEY = 'tm-document-reading-v1';
export const DOCUMENT_READING_DEFAULTS = Object.freeze({ mode: 'flow', background: 'original', warmth: 0, brightness: 100, textSize: 100 });
const bounded = (value, min, max, fallback) => typeof value === 'number' && Number.isFinite(value) ? Math.min(max, Math.max(min, Math.round(value))) : fallback;
export function normalizeDocumentReading(value) {
  const v = value && typeof value === 'object' ? value : {};
  return {
    mode: v.mode === 'book' ? 'book' : 'flow',
    background: ['original', 'paper', 'night'].includes(v.background) ? v.background : 'original',
    warmth: bounded(v.warmth, 0, 100, 0), brightness: bounded(v.brightness, 55, 100, 100), textSize: bounded(v.textSize, 85, 150, 100),
  };
}
const pendingPreferences = new WeakMap(), unavailableStore = {};
function localStore(store) { if (store) return store; try { return globalThis.localStorage; } catch { return null; } }
export function readDocumentReading(store) {
  const storage = localStore(store), key = storage || unavailableStore, pending = pendingPreferences.get(key);
  let raw = null;
  try { raw = storage?.getItem(DOCUMENT_READING_KEY) ?? null; } catch { return normalizeDocumentReading(pending?.value); }
  if (pending && raw === pending.before) return pending.value;
  if (pending) pendingPreferences.delete(key);
  try { return normalizeDocumentReading(raw ? JSON.parse(raw) : null); } catch { return normalizeDocumentReading(null); }
}
export function writeDocumentReading(value, store) {
  const clean = normalizeDocumentReading(value), storage = localStore(store), key = storage || unavailableStore;
  let before = null; try { before = storage?.getItem(DOCUMENT_READING_KEY) ?? null; } catch { /* unavailable */ }
  try { if (!storage) throw new Error('unavailable'); storage.setItem(DOCUMENT_READING_KEY, JSON.stringify(clean)); pendingPreferences.delete(key); }
  catch { pendingPreferences.set(key, { value: clean, before }); }
  return clean;
}
export function documentReadingPalette(pref, theme) {
  const p = normalizeDocumentReading(pref);
  if (p.background === 'night') return { background: '#252522', ink: '#eee6d7', accent: '#e2aa91', border: '#625e54', pdf: 'invert(.9) hue-rotate(180deg)' };
  if (p.background === 'paper') return { background: '#f2e8d7', ink: '#29251f', accent: '#743627', border: '#c9bba5', pdf: 'sepia(.14)' };
  return { background: theme.bg, ink: theme.text, accent: theme.accentInk || theme.accent, border: theme.borderSoft, pdf: 'none' };
}
