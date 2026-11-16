// Deliberate navigation only. Text selection and native controls keep their gestures.
const selectionEpoch = new WeakMap();
const CONTROL = 'input,textarea,select,button,a,[contenteditable="true"],[contenteditable=""],figure,[data-tm-no-swipe]';
const SHELL_CONTENT = '.tm-rich,.tm-nahled,[role="dialog"],[role="alertdialog"],[data-tm-reading]';

export function hasTextSelection(doc = globalThis.document) {
  try { const s = doc?.getSelection?.(); return !!s && !s.isCollapsed && s.rangeCount > 0; } catch { return false; }
}

export function watchNavigationSelection(doc = globalThis.document) {
  const change = () => { if (hasTextSelection(doc)) selectionEpoch.set(doc, (selectionEpoch.get(doc) || 0) + 1); };
  doc?.addEventListener('selectionchange', change);
  return () => doc?.removeEventListener('selectionchange', change);
}

export function navigationSwipeEnabled(doc = globalThis.document) {
  return doc?.documentElement?.getAttribute?.('data-tm-swipe-navigation') !== 'off';
}

export function beginNavigationSwipe(event, { reader = false, doc = globalThis.document, now = Date.now() } = {}) {
  if (!navigationSwipeEnabled(doc) || event.touches?.length !== 1 || hasTextSelection(doc)) return null;
  const target = event.target?.nodeType === 3 ? event.target.parentElement : event.target;
  if (target?.closest?.(CONTROL) || (!reader && target?.closest?.(SHELL_CONTENT))) return null;
  if (doc?.activeElement?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(doc?.activeElement?.tagName || '')) return null;
  const p = event.touches[0];
  return { x: p.clientX, y: p.clientY, at: now, selection: selectionEpoch.get(doc) || 0, blocked: false };
}

export function navigationSwipeBlocked(start, event, { doc = globalThis.document, now = Date.now() } = {}) {
  if (!start) return true;
  // A hold belongs to text/image selection, never navigation. Latch so a selection
  // subsequently collapsed by the browser cannot accidentally complete the swipe.
  start.blocked ||= !navigationSwipeEnabled(doc) || hasTextSelection(doc)
    || (selectionEpoch.get(doc) || 0) !== start.selection || now - start.at > 450
    || (event.touches && event.touches.length > 1);
  return start.blocked;
}

export function navigationSwipeDirection(start, event, { width = 390, doc = globalThis.document, now = Date.now() } = {}) {
  if (navigationSwipeBlocked(start, event, { doc, now })) return 0;
  const p = event.changedTouches?.[0] || event.touches?.[0];
  if (!p) return 0;
  const dx = p.clientX - start.x, dy = Math.abs(p.clientY - start.y);
  if (Math.abs(dx) < Math.max(100, Math.min(150, width * 0.24)) || Math.abs(dx) < dy * 2.2) return 0;
  return dx < 0 ? 1 : -1;
}
