import React from 'react';
import { beginNavigationSwipe, navigationSwipeBlocked, navigationSwipeDirection, hasTextSelection } from './navigationGesture.js';

// Shares the notes reader's deliberate gesture policy. Text selection, holds,
// pinch zoom and the app's gesture-off preference retain native behaviour.
export function useDocumentBookGestures(ref, enabled, turn) {
  const turnRef = React.useRef(turn); turnRef.current = turn;
  React.useEffect(() => {
    const el = ref.current; if (!el || !enabled) return;
    let swipe = null, horizontal = false, lastWheel = 0;
    const start = event => { swipe = (window.visualViewport?.scale || 1) > 1.05 ? null : beginNavigationSwipe(event, { reader: true }); horizontal = false; };
    const move = event => {
      if (navigationSwipeBlocked(swipe, event)) { horizontal = false; return; }
      const p = event.touches[0], dx = Math.abs(p.clientX - swipe.x), dy = Math.abs(p.clientY - swipe.y);
      if (dy > 16 && dy * 2.2 >= dx) swipe.blocked = true;
      if (dx > 24 && dx > dy * 2.2) horizontal = true;
      if (horizontal && !swipe.blocked && event.cancelable) event.preventDefault();
    };
    const end = event => { const direction = navigationSwipeDirection(swipe, event, { width: el.clientWidth }); swipe = null; horizontal = false; if (direction) turnRef.current(direction); };
    const cancel = () => { swipe = null; horizontal = false; };
    const wheel = event => {
      if (event.ctrlKey || hasTextSelection() || (window.visualViewport?.scale || 1) > 1.05) return;
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) * 1.5 ? event.deltaX : event.shiftKey ? event.deltaY : 0;
      if (Math.abs(delta) < 12) return;
      if (event.cancelable) event.preventDefault();
      if (Date.now() - lastWheel < 380) return;
      lastWheel = Date.now(); turnRef.current(delta > 0 ? 1 : -1);
    };
    const key = event => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key) || event.shiftKey || event.ctrlKey || event.metaKey || hasTextSelection()) return;
      if (document.activeElement?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '')) return;
      event.preventDefault(); turnRef.current(event.key === 'ArrowRight' ? 1 : -1);
    };
    el.addEventListener('touchstart', start, { passive: true }); el.addEventListener('touchmove', move, { passive: false });
    el.addEventListener('touchend', end, { passive: true }); el.addEventListener('touchcancel', cancel, { passive: true });
    el.addEventListener('wheel', wheel, { passive: false }); window.addEventListener('keydown', key);
    return () => { el.removeEventListener('touchstart', start); el.removeEventListener('touchmove', move); el.removeEventListener('touchend', end); el.removeEventListener('touchcancel', cancel); el.removeEventListener('wheel', wheel); window.removeEventListener('keydown', key); };
  }, [ref, enabled]);
}

export const DocumentBookText = React.forwardRef(function DocumentBookText({ sections, initialLocation, textSize, onProgress, navigationEnabled = true, L }, ref) {
  const viewport = React.useRef(null), columns = React.useRef(null), state = React.useRef({ index: 0, count: 1 }), location = React.useRef(initialLocation || { section: 0, fraction: 0 });
  const progressRef = React.useRef(onProgress); progressRef.current = onProgress;
  const rangeFor = React.useCallback(section => {
    const root = viewport.current, element = columns.current?.querySelector(`[data-document-part="${section}"]`);
    if (!root || !element) return { start: 0, end: root?.clientWidth || 1 };
    const rects = [...element.getClientRects()], left = root.getBoundingClientRect().left;
    return { start: Math.min(...rects.map(r => r.left - left + root.scrollLeft)), end: Math.max(...rects.map(r => r.right - left + root.scrollLeft)) };
  }, []);
  const currentLocation = React.useCallback(() => {
    const width = viewport.current?.clientWidth || 1, at = state.current.index * width + 24;
    for (let section = 0; section < sections.length; section++) { const range = rangeFor(section); if (at < range.end || section === sections.length - 1) return { section, fraction: Math.max(0, Math.min(.999, (at - range.start) / Math.max(1, range.end - range.start))) }; }
    return { section: 0, fraction: 0 };
  }, [sections.length, rangeFor]);
  const go = React.useCallback((target, smooth = true) => {
    const root = viewport.current; if (!root) return;
    const index = Math.max(0, Math.min(state.current.count - 1, Math.trunc(target)));
    state.current = { ...state.current, index };
    root.scrollTo({ left: index * root.clientWidth, behavior: smooth && !window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'auto' });
    location.current = currentLocation(); progressRef.current(state.current);
  }, [currentLocation]);
  useDocumentBookGestures(viewport, navigationEnabled, direction => go(state.current.index + direction));
  const goLocation = React.useCallback(target => {
    const root = viewport.current; if (!root) return;
    const node = target.anchor && columns.current?.querySelector(`[data-document-anchor="${target.anchor}"]`);
    const range = rangeFor(target.section), left = node ? node.getBoundingClientRect().left - root.getBoundingClientRect().left + root.scrollLeft : range.start + (range.end - range.start) * (target.fraction || 0);
    go(Math.floor(Math.max(0, left) / root.clientWidth), false);
  }, [go, rangeFor]);
  React.useImperativeHandle(ref, () => ({ go, goLocation, location: () => location.current, viewport: () => viewport.current }), [go, goLocation]);
  React.useLayoutEffect(() => {
    const root = viewport.current; if (!root) return;
    let gone = false;
    const reflow = () => {
      if (gone) return;
      const saved = location.current, width = root.clientWidth || 1;
      root.style.setProperty('--tm-book-column', `${Math.max(100, width - 40)}px`);
      const count = Math.max(1, Math.round(root.scrollWidth / width));
      const range = rangeFor(saved.section), index = Math.min(count - 1, Math.max(0, Math.floor((range.start + (range.end - range.start) * saved.fraction) / width)));
      state.current = { index, count }; root.scrollLeft = index * width; progressRef.current(state.current);
    };
    reflow(); const observer = new ResizeObserver(reflow); observer.observe(root);
    const loaded = () => reflow(); root.addEventListener('load', loaded, true);
    document.fonts?.ready.then(loaded);
    return () => { gone = true; observer.disconnect(); root.removeEventListener('load', loaded, true); };
  }, [sections, textSize, rangeFor]);
  return <div ref={viewport} className="tm-document-book-text" tabIndex={0} aria-label={L('Kniha po stránkách', 'Book pages')} onScroll={() => {
    const root = viewport.current, index = Math.max(0, Math.min(state.current.count - 1, Math.round(root.scrollLeft / (root.clientWidth || 1))));
    if (index !== state.current.index) { state.current = { ...state.current, index }; location.current = currentLocation(); progressRef.current(state.current); }
  }}><div ref={columns} className="tm-document-book-columns">
    {sections.map((section, i) => section.html != null ? <article key={i} data-document-part={i} className="tm-document-prose" dangerouslySetInnerHTML={{ __html: section.html }}/> : <article key={i} data-document-part={i} className="tm-document-prose tm-document-text">{section.text}</article>)}
  </div></div>;
});
