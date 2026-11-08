import React, { useEffect, useLayoutEffect, useRef, useState, useId } from 'react';
import { createPortal } from 'react-dom';
import { GUIDE_EARTH_SURFACE } from './guideSurface.js';
import { getGuideTours, createGuideStarter, combineGuideTours, guideArrow, placeGuidePanel, visibleGuideRect } from '../product/appGuide.js';

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
  const starter = createGuideStarter(tours, lang);
  const combined = combineGuideTours(tours, lang);
  const choices = starter ? [starter, ...tours, combined] : [];
  const [selected, setSelected] = useState(() => starter?.room || '');
  const [mode, setMode] = useState('choose');
  const [index, setIndex] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [paused, setPaused] = useState(false);
  const [geometry, setGeometry] = useState(() => ({ phase: 'choose', rect: null, viewport: typeof window === 'undefined' ? { left: 0, top: 0, width: 402, height: 874 } : viewportNow() }));
  const [panelSize, setPanelSize] = useState({ width: 352, height: 210 });
  const panelRef = useRef(null), titleRef = useRef(null), originRef = useRef(null);
  const navigation = useRef(onNavigate), closeRef = useRef(onClose), context = useRef(null);
  navigation.current = onNavigate; closeRef.current = onClose;
  const tour = choices.find(item => item.room === selected);
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
    if (!choices.some(item => item.room === selected)) {
      setMode('choose'); setIndex(0); setPaused(false);
      setSelected(starter?.room || '');
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
  const maxHeight = Math.min(mode === 'choose' ? 480 : 240, usableHeight);
  // Reserve the full tour card height even while its temporary loading/pause
  // text is shorter. Otherwise a tight viewport could alternate between
  // the short fallback (fits) and the full explanation (does not fit).
  const panelHeight = mode === 'tour' ? maxHeight : Math.min(panelSize.height, maxHeight);
  const placement = placeGuidePanel({ target: rect, viewport: geometry.viewport, panelWidth: 352, panelHeight, insets: resolvedInsets });
  const arrow = guideArrow(rect, placement, Math.min(panelSize.height, maxHeight));
  // A visible target stays useful even when the panel has to sit separately.
  // Only the connecting arrow depends on there being room beside the target.
  const ready = !!rect;
  const phase = !step ? 'choose' : paused || contextBlocked ? 'paused' : currentRoom !== step.room && geometry.phase !== 'loading' ? 'away' : geometry.phase;
  const body = phase === 'loading' ? L('Otevírám…', 'Opening…')
    : phase === 'paused' ? L('Vyzkoušej si to. Pak můžeš pokračovat.', 'Try it out. Continue when you are ready.')
    : phase === 'away' ? L('Jsi na jiné stránce. Vrať se ke kroku, nebo vyber jinou část.', 'You are on another page. Return to this step or choose another section.')
    : phase === 'missing' ? L('Toto místo se neotevřelo. Zkus to znovu, nebo pokračuj dál.', 'This place did not open. Try again or continue to the next step.')
    : phase === 'covered' ? L('Zavři okno nad stránkou a pokračuj.', 'Close the window over the page to continue.')
    : !ready ? L('Posuň stránku zpět, nebo klepni na Zobrazit místo.', 'Scroll back or choose Show this place.')
    : step?.body;
  // Website Burnt Earth (#754437), with a little of the page showing through.
  const guideInk = '#F4F0EB', guideEarth = '#754437';
  const button = { background: 'transparent', color: guideInk, border: 0, minHeight: 44, borderRadius: 0, padding: '7px 10px', font: 'inherit', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 };
  const quiet = { ...button, padding: '7px 8px' };
  const primary = { ...button, color: guideInk, fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 5, textDecorationThickness: 1 };
  const move = delta => {
    setPaused(false);
    setIndex(value => Math.max(0, Math.min(value + delta, tour.steps.length - 1)));
    titleRef.current?.focus({ preventScroll: true });
  };
  const retry = () => { setPaused(false); setAttempt(value => value + 1); };
  const choose = () => { setMode('choose'); setPaused(false); titleRef.current?.focus({ preventScroll: true }); };
  const start = picked => { if (!picked) return; setSelected(picked.room); setIndex(0); setPaused(false); setMode('tour'); titleRef.current?.focus({ preventScroll: true }); };
  return createPortal(<div className="tm-app-guide" data-guide-layer="true" style={{ position: 'fixed', inset: 0, zIndex: 3100, pointerEvents: 'none', '--guide-accent': guideInk, '--guide-text': guideInk, '--guide-surface': guideEarth }}>
    <style>{`.tm-app-guide{font-family:var(--ff-body,"DM Sans",sans-serif);font-size:14px;line-height:1.55}.tm-app-guide button:focus-visible,.tm-app-guide summary:focus-visible{outline:2px solid var(--guide-accent);outline-offset:3px}.tm-app-guide button:hover:not(:disabled){text-decoration:underline;text-underline-offset:4px}.tm-app-guide button:disabled{opacity:.4;cursor:default}.tm-app-guide ::selection{background:var(--guide-accent);color:var(--guide-surface)}.tm-app-guide h2:focus{outline:none}.tm-guide-picker summary{cursor:pointer;min-height:44px;box-sizing:border-box;padding:12px 0}.tm-guide-picker summary::marker{color:var(--guide-accent)}`}</style>
    {ready && arrow && <svg aria-hidden="true" data-guide-arrow="true" style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}>
        <defs><marker id={`tm-guide-arrow-${uid}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M1 1 5 3 1 5" fill="none" stroke={t.accent} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></marker></defs>
        <path d={`M${arrow.x1},${arrow.y1} L${arrow.x2},${arrow.y2}`} fill="none" stroke={t.accent} strokeWidth="1.3" markerEnd={`url(#tm-guide-arrow-${uid})`}/>
      </svg>}
    <div aria-hidden="true" className="tm-app-guide-material" style={{ position: 'fixed', left: placement.left, top: placement.top, width: placement.width, height: Math.min(panelSize.height, maxHeight), pointerEvents: 'none', borderImage: `url(${GUIDE_EARTH_SURFACE}) 120 140 120 80 fill / 24px 32px 24px 18px / 0 stretch`, opacity: .98, filter: 'drop-shadow(0 5px 6px rgba(28,28,26,.20)) drop-shadow(0 14px 22px rgba(28,28,26,.24))' }}/>
    <section ref={panelRef} role="region" aria-label={L('Průvodce aplikací', 'App guide')} className="tm-app-guide-panel" style={{ position: 'fixed', left: placement.left, top: placement.top, width: placement.width, maxHeight, boxSizing: 'border-box', overflowY: 'auto', overscrollBehavior: 'contain', pointerEvents: 'auto', backgroundColor: 'transparent', color: guideInk, border: 0, borderRadius: 0, boxShadow: 'none', padding: '24px 28px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(244,240,235,.48) transparent' }}
      onKeyDown={event => {
        if (mode !== 'tour' || event.target?.tagName === 'SELECT' || event.target?.tagName === 'INPUT' || event.target?.isContentEditable) return;
        if (event.key === 'ArrowRight' && index < tour.steps.length - 1) { event.preventDefault(); move(1); }
        if (event.key === 'ArrowLeft' && index > 0) { event.preventDefault(); move(-1); }
      }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <h2 id={titleId} ref={titleRef} tabIndex={-1} style={{ flex: 1, margin: '4px 0 12px', fontFamily: 'var(--ff-display,"EB Garamond",Georgia,serif)', fontWeight: 400, fontSize: 25, lineHeight: 1.16, color: guideInk }}>{mode === 'choose' ? L('Měj jasno, co dál', 'Know your next step') : step?.title || L('Průvodce aplikací', 'App guide')}</h2>
        {mode === 'tour' && <button type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? L('Pokračovat v průvodci', 'Resume guide') : L('Pozastavit průvodce', 'Pause guide')} style={{ ...quiet, width: 44, flexShrink: 0, marginTop: -6 }}><GuideIcon kind={paused ? 'next' : 'pause'}/></button>}
        <button type="button" onClick={close} aria-label={L('Zavřít průvodce', 'Close guide')} title="Esc" style={{ ...quiet, width: 44, flexShrink: 0, marginTop: -6, marginRight: -8 }}><GuideIcon kind="close"/></button>
      </div>
      {mode === 'choose' ? <>
        {tours.length ? <>
          <p style={{ margin: '0 0 12px', color: guideInk }}>{L('Najdi svůj plán a vrať se k tomu, co se ti daří.', 'Find your plan and see what is working for you.')}</p>
          <button type="button" onClick={()=>start(starter)} style={{ ...primary, paddingLeft: 0 }}>{L('Ukázat první kroky', 'Show me the first steps')}<GuideIcon kind="next" size={15}/></button>
          <details className="tm-guide-picker" style={{ marginTop: 8 }}>
            <summary>{L('Chci najít něco konkrétního', 'I am looking for something specific')}</summary>
            <div role="group" aria-label={L('Části průvodce', 'Guide sections')}>
              {[...tours].sort((a,b)=>Number(b.room===currentRoom)-Number(a.room===currentRoom)).map(item => <button key={item.room} type="button" onClick={()=>start(item)} style={{ display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', width: '100%', minHeight: 60, padding: '10px 0', border: 0, background: 'transparent', color: guideInk, font: 'inherit', cursor: 'pointer' }}>
                <span style={{ flex: 1 }}><span style={{ display: 'block' }}>{item.steps[0]?.title}</span><span style={{ display: 'block', color: guideInk, fontSize: 12 }}>{item.label}</span></span>
                <GuideIcon kind="next" size={15}/>
              </button>)}
              <button type="button" onClick={()=>start(combined)} style={{...quiet,paddingLeft:0,color:guideInk}}>{L('Projít všechny části', 'Explore every section')}<GuideIcon kind="next" size={15}/></button>
            </div>
          </details>
        </> : <p role="status" style={{ margin: '0 0 6px' }}>{L('Průvodce tu zatím nemá dostupnou stránku.', 'There is no available page to guide you through yet.')}</p>}
      </> : <>
        <div style={{ color: guideInk, marginBottom: 7, fontSize: 12, fontVariantNumeric: 'tabular-nums' }} aria-live="polite">{Math.min(index + 1, tour?.steps.length || 0)} / {tour?.steps.length || 0}</div>
        <p id={textId} role={!ready ? 'status' : undefined} style={{ margin: '0 0 9px', color: guideInk }}>{body}</p>
        {!ready && phase !== 'loading' && !contextBlocked && <button type="button" onClick={retry} style={{ ...quiet, color: guideInk, paddingLeft: 0 }}><GuideIcon kind="locate" size={17}/>{L('Zobrazit místo', 'Show this place')}</button>}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingTop: 3 }}>
          <button type="button" onClick={() => move(-1)} disabled={!tour || index === 0} aria-label={L('Předchozí krok', 'Previous step')} style={{...quiet,width:44,flexShrink:0}}><GuideIcon kind="back" size={14}/></button>
          <button type="button" onClick={choose} style={{ ...quiet, marginRight: 'auto', color: guideInk }}>{L('Jiná část', 'Other sections')}</button>
          {index >= (tour?.steps.length || 0) - 1
            ? <button type="button" onClick={close} style={primary}>{L('Vyzkoušet', 'Try it now')}<GuideIcon kind="next" size={14}/></button>
            : <button type="button" onClick={() => move(1)} style={primary}>{L('Dál', 'Next')}<GuideIcon kind="next" size={14}/></button>}
        </div>
      </>}
    </section>
  </div>, document.body);
}
