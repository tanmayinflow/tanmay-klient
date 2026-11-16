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

// Only location/scale are stored: never document text, titles, or remote URLs.
// Entries are bounded and separated by the attachment's opaque owner/id pair.
export const DOCUMENT_POSITIONS_KEY = 'tm-document-positions-v1';
export function documentPositionKey(attachment) {
  return attachment?.id ? JSON.stringify([String(attachment.owner || attachment.ownerId || ''), String(attachment.id), Number(attachment.size) || 0]) : null;
}
export function normalizeDocumentPosition(value) {
  if (!value || typeof value !== 'object') return null;
  return { section: bounded(value.section, 0, 100000, 0), fraction: typeof value.fraction === 'number' && Number.isFinite(value.fraction) ? Math.max(0, Math.min(.999999, value.fraction)) : 0, zoom: typeof value.zoom === 'number' && Number.isFinite(value.zoom) ? Math.max(1, Math.min(2.5, value.zoom)) : 1 };
}
function savedPositions(store) {
  try { const value = JSON.parse(store?.getItem(DOCUMENT_POSITIONS_KEY) || '[]'); return Array.isArray(value) ? value.filter(entry => Array.isArray(entry) && typeof entry[0] === 'string' && normalizeDocumentPosition(entry[1])).slice(-200) : []; }
  catch { return []; }
}
export function readDocumentPosition(attachment, store) {
  const key = documentPositionKey(attachment);
  return key ? normalizeDocumentPosition(savedPositions(localStore(store)).find(entry => entry[0] === key)?.[1]) : null;
}
export function writeDocumentPosition(attachment, value, store) {
  const key = documentPositionKey(attachment), clean = normalizeDocumentPosition(value), storage = localStore(store);
  if (!key || !clean || !storage) return;
  try { storage.setItem(DOCUMENT_POSITIONS_KEY, JSON.stringify([...savedPositions(storage).filter(entry => entry[0] !== key), [key, clean]].slice(-200))); } catch { /* Reading continues when device storage is unavailable. */ }
}
