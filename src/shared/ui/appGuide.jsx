import React, { useEffect, useLayoutEffect, useRef, useState, useId } from 'react';
import { createPortal } from 'react-dom';
import { getGuideTours, guideArrow, placeGuidePanel, visibleGuideRect } from '../product/appGuide.js';

function viewportNow() {
  const v = window.visualViewport;
  return { left: v?.offsetLeft || 0, top: v?.offsetTop || 0,
    width: v?.width || window.innerWidth, height: v?.height || window.innerHeight };
}

function findAnchor(id) {
  // Catalog ids are fixed, not user input. Several responsive copies can exist.
  for (const el of document.querySelectorAll(`[data-guide="${id}"]`)) {
    const r = el.getBoundingClientRect(), style = window.getComputedStyle(el);
    if (r.width > 3 && r.height > 3 && style.display !== 'none' && style.visibility !== 'hidden') return el;
  }
  return null;
}

function anchorUncovered(el, rect) {
  if (typeof document.elementsFromPoint !== 'function') return true;
  const xs = [rect.left + rect.width / 2, rect.left + Math.min(14, rect.width / 4), rect.right - Math.min(14, rect.width / 4)];
  const ys = [rect.top + rect.height / 2, rect.top + Math.min(14, rect.height / 4), rect.bottom - Math.min(14, rect.height / 4)];
  return xs.some((x, index) => {
    const top = document.elementsFromPoint(x, ys[index]).find(node => !node.closest('[data-guide-layer]'));
    return !!top && (el === top || el.contains(top));
  });
}

function sameGeometry(a, b) {
  return a?.phase === b.phase && ['left', 'top', 'width', 'height'].every(key =>
    Math.abs((a?.viewport?.[key] || 0) - (b.viewport?.[key] || 0)) < .5 &&
    Math.abs((a?.rect?.[key] || 0) - (b.rect?.[key] || 0)) < .5);
}

function GuideIcon({ kind, size = 18 }) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    {kind === 'close' ? <path d="m6 6 12 12M18 6 6 18"/> : kind === 'back' ? <path d="m14 5-7 7 7 7"/> : kind === 'next' ? <path d="m10 5 7 7-7 7"/> : kind === 'pause' ? <path d="M9 5v14M15 5v14"/> : <><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/><circle cx="12" cy="12" r="3"/></>}
  </svg>;
}

/**
 * A nonmodal, context-anchored guide. The app adapter owns all navigation.
 * onNavigate(room, step) may reveal a tab/drawer, but must not create data.
 * currentRoom must use "nastaveni" while guided Settings is open.
 * contextBlocked is true only for an unrelated overlay, never the intended
 * drawer containing the guide target. Insets reserve fixed navigation chrome.
 */
export function AppGuide({ t, lang = 'cs', role = 'client', currentRoom,
  availableRooms = [], availableSteps = null, onNavigate, onClose,
  contextBlocked = false, insets = {}, registerEscape }) {
  const L = (cs, en) => lang === 'en' ? en : cs;
  const tours = getGuideTours({ role, availableRooms, availableSteps, lang });
  const [selected, setSelected] = useState(() => tours.some(tour => tour.room === currentRoom) ? currentRoom : tours[0]?.room || '');
  const [mode, setMode] = useState('choose');
  const [index, setIndex] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [paused, setPaused] = useState(false);
  const [geometry, setGeometry] = useState(() => ({ phase: 'choose', rect: null, viewport: typeof window === 'undefined' ? { left: 0, top: 0, width: 402, height: 874 } : viewportNow() }));
  const [panelSize, setPanelSize] = useState({ width: 352, height: 210 });
  const panelRef = useRef(null), titleRef = useRef(null), originRef = useRef(null);
  const navigation = useRef(onNavigate), closeRef = useRef(onClose), context = useRef(null);
  navigation.current = onNavigate; closeRef.current = onClose;
  const tour = tours.find(item => item.room === selected);
  const step = mode === 'tour' ? tour?.steps[Math.min(index, tour.steps.length - 1)] : null;
  const uid = useId().replace(/:/g, ''), titleId = `tm-guide-title-${uid}`, textId = `tm-guide-text-${uid}`;
  const resolvedInsets = { top: 8, bottom: geometry.viewport.width <= 820 ? 86 : 12, ...insets };
  context.current = { currentRoom, contextBlocked, paused, insets: resolvedInsets };

  const close = () => {
    const original = originRef.current;
    closeRef.current?.();
    if (original?.isConnected) original.focus?.({ preventScroll: true });
  };

  useEffect(() => {
    originRef.current = document.activeElement;
    titleRef.current?.focus({ preventScroll: true });
  }, []);

  // If a room becomes hidden or an optional module is switched off, the guide
  // loses the step immediately. It never re-enables the module to continue.
  const allowedSignature = tours.map(item => `${item.room}:${item.steps.map(s => s.id).join(',')}`).join('|');
  useEffect(() => {
    if (!tours.some(item => item.room === selected)) {
      setMode('choose'); setIndex(0); setPaused(false);
      setSelected(tours.find(item => item.room === currentRoom)?.room || tours[0]?.room || '');
    } else if (index >= (tour?.steps.length || 0)) setIndex(0);
  }, [allowedSignature, selected, index, currentRoom]);

  useEffect(() => {
    const update = () => setGeometry(previous => {
      const next = { ...previous, viewport: viewportNow() };
      return sameGeometry(previous, next) ? previous : next;
    });
    window.addEventListener('resize', update);
    window.visualViewport?.addEventListener('resize', update);
    window.visualViewport?.addEventListener('scroll', update);
    return () => {
      window.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('scroll', update);
    };
  }, []);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const measure = () => {
      const r = panel.getBoundingClientRect();
      setPanelSize(previous => Math.abs(previous.height - r.height) < 1 && Math.abs(previous.width - r.width) < 1 ? previous : { width: r.width, height: r.height });
    };
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(panel);
    return () => observer?.disconnect();
  }, [mode, step?.id, paused, lang, geometry.phase, contextBlocked]);

  useEffect(() => {
    if (mode !== 'tour' || !step) {
      setGeometry(previous => ({ ...previous, phase: 'choose', rect: null }));
      return;
    }
    let disposed = false, frame = 0, found = false, observed = null;
    let describedElement = null, originalDescription = null, graceTimer = 0;
    const started = Date.now();
    const resize = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule);
    const restoreDescription = () => {
      if (!describedElement) return;
      if (originalDescription == null) describedElement.removeAttribute('aria-describedby');
      else describedElement.setAttribute('aria-describedby', originalDescription);
      describedElement = null;
    };
    function setResult(phase, rect = null) {
      if (disposed) return;
      const next = { phase, rect, viewport: viewportNow() };
      setGeometry(previous => sameGeometry(previous, next) ? previous : next);
      if (phase !== 'ready') restoreDescription();
    }
    function measure() {
      frame = 0;
      if (disposed) return;
      const c = context.current;
      if (c.paused || c.contextBlocked) { setResult('paused'); return; }
      if (c.currentRoom !== step.room) {
        setResult(Date.now() - started < 1800 && !found ? 'loading' : 'away');
        return;
      }
      const el = findAnchor(step.anchor);
      if (!el) { setResult(Date.now() - started < 1800 && !found ? 'loading' : 'missing'); return; }
      if (el !== observed) {
        if (observed) resize?.unobserve(observed);
        observed = el; resize?.observe(el);
      }
      if (!found) {
        found = true;
        // One intentional reveal per step. Subsequent user scrolling is free.
        el.scrollIntoView?.({ block: 'center', inline: 'nearest', behavior: 'instant' });
      }
      const viewport = viewportNow(), rect = visibleGuideRect(el.getBoundingClientRect(), viewport, c.insets);
      if (!rect) { setResult('offscreen'); return; }
      if (!anchorUncovered(el, rect)) { setResult('covered'); return; }
      if (describedElement !== el) {
        restoreDescription();
        describedElement = el; originalDescription = el.getAttribute('aria-describedby');
        el.setAttribute('aria-describedby', [originalDescription, textId].filter(Boolean).join(' '));
      }
      setResult('ready', rect);
    }
    function schedule() { if (!disposed && !frame) frame = requestAnimationFrame(measure); }
    setResult('loading');
    Promise.resolve().then(() => {
      if (disposed) return;
      return navigation.current?.(step.room, step);
    }).then(() => { if (!disposed) schedule(); }).catch(() => { if (!disposed) setResult('missing'); });
    const mutations = new MutationObserver(records => {
      if (records.some(record => !panelRef.current?.contains(record.target))) schedule();
    });
    mutations.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'class', 'style', 'open', 'aria-hidden'] });
    document.addEventListener('scroll', schedule, true);
    window.addEventListener('resize', schedule);
    window.visualViewport?.addEventListener('resize', schedule);
    window.visualViewport?.addEventListener('scroll', schedule);
    graceTimer = window.setTimeout(schedule, 1850);
    // Route context can change without a DOM mutation; a short event from the
    // following effect also invalidates the target synchronously.
    window.addEventListener(`tm-guide-context-${uid}`, schedule);
    return () => {
      disposed = true; restoreDescription();
      if (frame) cancelAnimationFrame(frame);
      clearTimeout(graceTimer); mutations.disconnect(); resize?.disconnect();
      document.removeEventListener('scroll', schedule, true);
      window.removeEventListener('resize', schedule);
      window.visualViewport?.removeEventListener('resize', schedule);
      window.visualViewport?.removeEventListener('scroll', schedule);
      window.removeEventListener(`tm-guide-context-${uid}`, schedule);
    };
  }, [mode, step?.id, attempt, textId]);

  useEffect(() => {
    // Clear the previous ring before repainting a newly selected app room.
    if (step && (currentRoom !== step.room || contextBlocked || paused)) {
      setGeometry(previous => ({ ...previous, rect: null, phase: paused || contextBlocked ? 'paused' : 'away' }));
    }
    window.dispatchEvent(new Event(`tm-guide-context-${uid}`));
  }, [currentRoom, contextBlocked, paused, uid, step?.id]);

  useEffect(() => {
    if (contextBlocked) return;
    const onEscape = () => { if (!context.current.contextBlocked) close(); };
    if (registerEscape) return registerEscape(onEscape);
    const key = event => {
      if (event.key !== 'Escape' || event.defaultPrevented || context.current.contextBlocked) return;
      event.preventDefault(); event.stopPropagation(); onEscape();
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [registerEscape, contextBlocked]);

  // A foreign modal takes the entire interaction context. Keep the tour in
  // memory, but remove its card and keyboard layer until that modal is closed.
  if (typeof document === 'undefined' || contextBlocked) return null;
  const liveContext = !!step && step.room === currentRoom && !contextBlocked && !paused;
  const rect = liveContext && geometry.phase === 'ready' ? geometry.rect : null;
  const usableHeight = Math.max(80, geometry.viewport.height - (resolvedInsets.top || 0) - (resolvedInsets.bottom || 0) - 24);
  const maxHeight = Math.min(mode === 'choose' ? 330 : 272, usableHeight);
  // Reserve the full tour card height even while its temporary loading/pause
  // text is shorter. Otherwise a tight viewport could alternate between
  // the short fallback (fits) and the full explanation (does not fit).
  const panelHeight = mode === 'tour' ? maxHeight : Math.min(panelSize.height, maxHeight);
  const placement = placeGuidePanel({ target: rect, viewport: geometry.viewport, panelWidth: 352, panelHeight, insets: resolvedInsets });
  const arrow = guideArrow(rect, placement, Math.min(panelSize.height, maxHeight));
  const ready = !!rect && placement.connected;
  const phase = !step ? 'choose' : paused || contextBlocked ? 'paused' : currentRoom !== step.room && geometry.phase !== 'loading' ? 'away' : geometry.phase;
  const body = phase === 'loading' ? L('Otevírám příslušné místo…', 'Opening the relevant place…')
    : phase === 'paused' ? L('Průvodce čeká. Můžeš si stránku volně prohlédnout.', 'The guide is paused. Explore the page freely.')
    : phase === 'away' ? L('Teď jsi na jiné stránce. Vrať se ke kroku, nebo vyber průvodce pro toto místo.', 'You are on another page. Return to this step, or choose a guide for this page.')
    : phase === 'missing' ? L('Toto místo teď není otevřené. Zkus ho otevřít znovu, nebo přejdi k dalšímu kroku.', 'This place is not open right now. Try opening it again, or move to the next step.')
    : phase === 'covered' ? L('Toto místo překrývá jiné okno. Zavři ho, nebo se vrať ke kroku.', 'Another window covers this place. Close it, or return to the step.')
    : !ready ? L('Místo je mimo záběr. Zobraz ho znovu, až budeš chtít pokračovat.', 'The place is outside the view. Show it again when you want to continue.')
    : step?.body;
  const button = { background: 'transparent', color: t.text, border: `1px solid ${t.borderSoft || t.border}`, minHeight: 44, borderRadius: 6, padding: '7px 12px', font: 'inherit', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 };
  const quiet = { ...button, borderColor: 'transparent', padding: '7px 8px' };
  const primary = { ...button, background: t.accent, borderColor: t.accent, color: t.onAccent || t.bg };
  const move = delta => {
    setPaused(false);
    setIndex(value => Math.max(0, Math.min(value + delta, tour.steps.length - 1)));
    titleRef.current?.focus({ preventScroll: true });
  };
  const retry = () => { setPaused(false); setAttempt(value => value + 1); };
  const choose = () => { setMode('choose'); setPaused(false); };
  const start = () => { if (!tour) return; setIndex(0); setPaused(false); setMode('tour'); titleRef.current?.focus({ preventScroll: true }); };
  return createPortal(<div className="tm-app-guide" data-guide-layer="true" style={{ position: 'fixed', inset: 0, zIndex: 3100, pointerEvents: 'none', '--guide-accent': t.accent, '--guide-border': t.border, '--guide-text': t.text, '--guide-surface': t.card || t.bg }}>
    <style>{`.tm-app-guide{font-family:var(--ff-body,"DM Sans",sans-serif);font-size:13px;line-height:1.55}.tm-app-guide button:focus-visible,.tm-app-guide select:focus-visible{outline:2px solid var(--guide-accent);outline-offset:3px}.tm-app-guide button:hover:not(:disabled){text-decoration:underline;text-underline-offset:4px}.tm-app-guide button:disabled{opacity:.4;cursor:default}.tm-app-guide ::selection{background:var(--guide-accent);color:var(--guide-surface)}.tm-app-guide h2:focus{outline:none}.tm-app-guide-panel{transition:box-shadow .18s ease-out}.tm-app-guide select{color-scheme:inherit}.tm-app-guide option{background:var(--guide-surface);color:var(--guide-text)}@media(prefers-reduced-motion:reduce){.tm-app-guide-panel{transition:none}}`}</style>
    {ready && <>
      <div aria-hidden="true" data-guide-highlight="true" style={{ position: 'fixed', left: rect.left - 3, top: rect.top - 3, width: rect.width + 6, height: rect.height + 6, border: `1.5px solid ${t.accent}`, borderRadius: 7, boxSizing: 'border-box', pointerEvents: 'none' }}/>
      {arrow && <svg aria-hidden="true" style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}>
        <defs><marker id={`tm-guide-arrow-${uid}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M1 1 5 3 1 5" fill="none" stroke={t.accent} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></marker></defs>
        <path d={`M${arrow.x1},${arrow.y1} L${arrow.x2},${arrow.y2}`} fill="none" stroke={t.accent} strokeWidth="1.3" markerEnd={`url(#tm-guide-arrow-${uid})`}/>
      </svg>}
    </>}
    <section ref={panelRef} role="region" aria-label={L('Průvodce aplikací', 'App guide')} className="tm-app-guide-panel" style={{ position: 'fixed', left: placement.left, top: placement.top, width: placement.width, maxHeight, boxSizing: 'border-box', overflowY: 'auto', overscrollBehavior: 'contain', pointerEvents: 'auto', background: t.card || t.bg, color: t.text, border: `1px solid ${t.border}`, borderRadius: 12, boxShadow: t.shadowLift || '0 6px 24px rgba(0,0,0,.15)', padding: '12px 14px', scrollbarWidth: 'thin', scrollbarColor: `${t.border} transparent` }}
      onKeyDown={event => {
        if (mode !== 'tour' || event.target?.tagName === 'SELECT' || event.target?.tagName === 'INPUT' || event.target?.isContentEditable) return;
        if (event.key === 'ArrowRight' && index < tour.steps.length - 1) { event.preventDefault(); move(1); }
        if (event.key === 'ArrowLeft' && index > 0) { event.preventDefault(); move(-1); }
      }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <h2 id={titleId} ref={titleRef} tabIndex={-1} style={{ flex: 1, margin: '4px 0 8px', fontFamily: 'var(--ff-display,"EB Garamond",Georgia,serif)', fontWeight: 400, fontSize: 23, lineHeight: 1.16, color: t.heading || t.text }}>{mode === 'choose' ? L('Průvodce aplikací', 'App guide') : step?.title || L('Průvodce aplikací', 'App guide')}</h2>
        {mode === 'tour' && <button type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? L('Pokračovat v průvodci', 'Resume guide') : L('Pozastavit průvodce', 'Pause guide')} style={{ ...quiet, width: 44, flexShrink: 0, marginTop: -6 }}><GuideIcon kind={paused ? 'next' : 'pause'}/></button>}
        <button type="button" onClick={close} aria-label={L('Zavřít průvodce', 'Close guide')} title="Esc" style={{ ...quiet, width: 44, flexShrink: 0, marginTop: -6, marginRight: -8 }}><GuideIcon kind="close"/></button>
      </div>
      {mode === 'choose' ? <>
        <p style={{ margin: '0 0 12px', color: t.textSec || t.text }}>{L('Krátké kroky přímo na stránce. Během průvodce můžeš aplikaci dál používat.', 'Short steps on the page itself. You can keep using the app during the guide.')}</p>
        {tours.length ? <>
          <label htmlFor={`tm-guide-tour-${uid}`} style={{ display: 'block', marginBottom: 5 }}>{L('Co chceš prozkoumat?', 'What would you like to explore?')}</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <select id={`tm-guide-tour-${uid}`} value={selected} onChange={event => setSelected(event.target.value)} style={{ minWidth: 0, flex: 1, minHeight: 44, border: `1px solid ${t.border}`, borderRadius: 6, background: 'transparent', color: t.text, padding: '7px 10px', font: 'inherit' }}>{tours.map(item => <option key={item.room} value={item.room}>{item.label} · {item.steps.length} {lang === 'en' ? (item.steps.length === 1 ? 'step' : 'steps') : item.steps.length === 1 ? 'krok' : item.steps.length < 5 ? 'kroky' : 'kroků'}</option>)}</select>
            <button type="button" onClick={start} disabled={!tour} style={primary}>{L('Ukázat', 'Show me')}<GuideIcon kind="next" size={15}/></button>
          </div>
        </> : <p role="status" style={{ margin: '0 0 6px' }}>{L('Průvodce tu zatím nemá dostupnou stránku.', 'There is no available page to guide you through yet.')}</p>}
      </> : <>
        <div style={{ fontFamily: 'var(--ff-tag,"Barlow Condensed",sans-serif)', color: t.textMuted || t.text, marginBottom: 7, fontSize: 12, letterSpacing: '.06em', fontVariantNumeric: 'tabular-nums' }} aria-live="polite">{tour?.label} · {Math.min(index + 1, tour?.steps.length || 0)} / {tour?.steps.length || 0}</div>
        <p id={textId} role={!ready ? 'status' : undefined} style={{ margin: '0 0 9px', color: t.textSec || t.text }}>{body}</p>
        {!ready && phase !== 'loading' && !contextBlocked && <button type="button" onClick={retry} style={{ ...quiet, color: t.accent, paddingLeft: 0 }}><GuideIcon kind="locate" size={17}/>{L('Zobrazit místo', 'Show this place')}</button>}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingTop: 3 }}>
          <button type="button" onClick={() => move(-1)} disabled={!tour || index === 0} aria-label={L('Předchozí krok', 'Previous step')} style={quiet}><GuideIcon kind="back" size={14}/>{L('Zpět', 'Back')}</button>
          <button type="button" onClick={choose} style={{ ...quiet, marginLeft: 'auto', color: t.textMuted || t.text }}>{L('Jiné místo', 'Another place')}</button>
          {index >= (tour?.steps.length || 0) - 1
            ? <button type="button" onClick={close} style={primary}>{L('Hotovo', 'Done')}</button>
            : <button type="button" onClick={() => move(1)} style={primary}>{L('Dál', 'Next')}<GuideIcon kind="next" size={14}/></button>}
        </div>
      </>}
    </section>
  </div>, document.body);
}
