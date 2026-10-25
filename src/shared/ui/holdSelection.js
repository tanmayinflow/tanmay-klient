// A held row selects first. Only moving an already selected row lifts a copy.
// End/cancel listeners live on the window: React may replace the touched row.
export function attachHoldSelection({ root, attr, tabAttr, stateRef, actionsRef, mouseAny = false, makeGhost, isHaptics = () => false, onDragging = () => {}, onGesture = () => {} }) {
  const doc = root.ownerDocument, win = doc.defaultView;
  let session = null, ghost = null, suppressed = null, edgeTimer = null, edgeDir = 0, claimed = false;
  const selector = '[' + attr + ']';
  const rowAt = (x, y, sel = selector) => doc.elementFromPoint(x, y)?.closest?.(sel);
  const clearTargets = () => doc.querySelectorAll('.tm-drop').forEach(el => el.classList.remove('tm-drop'));
  const stopEdge = () => { if (edgeTimer != null) win.clearInterval(edgeTimer); edgeTimer = null; edgeDir = 0; };
  const claim = () => { if (!claimed) { claimed = true; doc.body.classList.add('tm-nosel'); onGesture(true); } };
  const point = (event, ending = false) => session?.mouse ? event : Array.from((ending ? event.changedTouches : event.touches) || []).find(touch => touch.identifier === session?.touchId);
  const edgeScroll = (x, y) => {
    const strip = doc.querySelector('.tm-typerow');
    if (!strip) return stopEdge();
    const r = strip.getBoundingClientRect();
    const dir = y >= r.top - 30 && y <= r.bottom + 30 ? (x > r.right - 52 ? 1 : x < r.left + 52 ? -1 : 0) : 0;
    if (dir === edgeDir) return;
    stopEdge(); edgeDir = dir;
    if (dir) edgeTimer = win.setInterval(() => { strip.scrollLeft += dir * 9; }, 16);
  };
  const unbind = () => {
    win.removeEventListener('touchmove', move, true);
    win.removeEventListener('touchend', end, true);
    win.removeEventListener('touchcancel', cancel, true);
    win.removeEventListener('mousemove', move, true);
    win.removeEventListener('mouseup', end, true);
    win.removeEventListener('pointercancel', cancel, true);
    win.removeEventListener('blur', cancel);
    win.removeEventListener('pagehide', cancel);
    win.removeEventListener('keydown', keydown, true);
    doc.removeEventListener('visibilitychange', visibility);
  };
  const finish = (commit = false) => {
    const done = session;
    session = null;
    if (done?.timer != null) win.clearTimeout(done.timer);
    unbind(); stopEdge(); clearTargets();
    if (ghost) { ghost.remove(); ghost = null; }
    if (done?.armed) suppressed = { id: done.id, mouse: done.mouse, until: Date.now() + 700 };
    if (claimed) { claimed = false; doc.body.classList.remove('tm-nosel'); onGesture(false); }
    onDragging(null);
    // Cancellation never files a note into the last hovered category.
    if (commit && done?.moving && done.mode === 'drag' && done.overTab != null) actionsRef.current.dropTab(done.ids, done.overTab);
  };
  function cancel() { finish(false); }
  function visibility() { if (doc.hidden) cancel(); }
  function keydown(event) { if (event.key === 'Escape' && session) { event.preventDefault(); cancel(); } }
  const arm = (mouseMove = false) => {
    const s = session;
    if (!s || s.armed) return;
    s.armed = true; claim();
    const current = stateRef.current || {}, selected = current.sel || [];
    s.ids = current.selecting && selected.includes(s.id) ? [...selected] : [s.id];
    s.mode = mouseMove || (current.selecting && selected.includes(s.id)) ? 'drag' : 'paint';
    if (s.mode === 'paint') {
      s.add = true; s.last = s.id;
      if (current.selecting) actionsRef.current.paint(s.id, true);
      else actionsRef.current.enter(s.id);
    }
    try { if (!s.mouse && isHaptics()) win.navigator?.vibrate?.(14); } catch {}
  };
  const bind = () => {
    win.addEventListener('touchmove', move, { capture: true, passive: false });
    win.addEventListener('touchend', end, true);
    win.addEventListener('touchcancel', cancel, true);
    win.addEventListener('mousemove', move, true);
    win.addEventListener('mouseup', end, true);
    win.addEventListener('pointercancel', cancel, true);
    win.addEventListener('blur', cancel);
    win.addEventListener('pagehide', cancel);
    win.addEventListener('keydown', keydown, true);
    doc.addEventListener('visibilitychange', visibility);
  };
  function start(event) {
    const mouse = !event.touches;
    if (event.touches?.length > 1) { cancel(); return; }
    if (mouse && (event.button !== 0 || event.ctrlKey || event.metaKey)) return;
    // A new physical touch (or a new mouse press after a mouse hold) is a new
    // intent. Compatibility mouse events after touch keep its one-click guard.
    if (!mouse || suppressed?.mouse) suppressed = null;
    if (session) cancel();
    const row = event.target?.closest?.(selector);
    if (!row || !root.contains(row)) return;
    if (event.target.closest?.('input, textarea, select, [contenteditable="true"]')) return;
    const ctl = event.target.closest?.('button, a');
    if (ctl && ctl !== row && ctl.getAttribute('data-pickmain') == null && row.contains(ctl)) return;
    const p = mouse ? event : event.touches[0];
    if (!p) return;
    const id = row.getAttribute(attr), current = stateRef.current || {};
    session = { id, mouse, touchId: p.identifier, x: p.clientX, y: p.clientY, armed: false, moving: false, timer: null, overTab: null };
    bind();
    if (current.selecting && event.target.closest?.('.tm-selmark')) {
      session.armed = true; session.mode = 'paint'; session.add = !(current.sel || []).includes(id); session.last = id;
      claim(); actionsRef.current.paint(id, session.add);
    } else session.timer = win.setTimeout(() => arm(), 400);
  }
  function move(event) {
    const s = session;
    if (!s) return;
    if ((!s.mouse && event.touches?.length > 1) || (s.mouse && event.buttons === 0)) { cancel(); return; }
    const p = point(event); if (!p) return;
    const dx = Math.abs(p.clientX - s.x), dy = Math.abs(p.clientY - s.y);
    if (!s.armed) {
      if (dx <= 12 && dy <= 12) return;
      const current = stateRef.current || {};
      const mayDrag = mouseAny || (current.selecting ? (current.sel || []).includes(s.id) : current.sortManual);
      if (!s.mouse || !mayDrag) { cancel(); return; }
      win.clearTimeout(s.timer); arm(true);
    }
    if (event.cancelable) event.preventDefault();
    if (s.mode === 'paint') {
      const row = rowAt(p.clientX, p.clientY), id = row && root.contains(row) && row.getAttribute(attr);
      if (id && id !== s.last) { s.last = id; actionsRef.current.paint(id, s.add); }
      return;
    }
    if (!s.moving && dx <= 8 && dy <= 8) return;
    if (!s.moving) { s.moving = true; ghost = makeGhost?.(actionsRef.current.label(s.id), s.ids.length, p.clientX, p.clientY); onDragging(s.id); }
    if (ghost) { ghost.style.left = p.clientX + 'px'; ghost.style.top = p.clientY + 'px'; }
    clearTargets();
    if (tabAttr) edgeScroll(p.clientX, p.clientY);
    const tab = tabAttr && rowAt(p.clientX, p.clientY, '[' + tabAttr + ']');
    const target = tab?.getAttribute(tabAttr);
    s.overTab = target != null && target !== 'Vše' ? target : null;
    if (s.overTab != null) { tab.classList.add('tm-drop'); return; }
    if (!(stateRef.current || {}).sortManual || s.ids.length > 1) return;
    const row = rowAt(p.clientX, p.clientY), over = row && root.contains(row) && row.getAttribute(attr);
    if (over && over !== s.id) actionsRef.current.reorder(s.id, over);
  }
  function end(event) { if (session && point(event, true)) finish(true); }
  function click(event) {
    if (!suppressed) return;
    const row = event.target?.closest?.(selector), same = row?.getAttribute(attr) === suppressed.id;
    if (Date.now() >= suppressed.until) { suppressed = null; return; }
    // Suppress only the synthetic click for this hold. The next note stays tappable.
    if (same) { suppressed = null; event.preventDefault(); event.stopPropagation(); }
  }
  function contextmenu(event) { if (session) event.preventDefault(); }
  function dragstart(event) { if (session) event.preventDefault(); }
  root.addEventListener('touchstart', start, { passive: true });
  root.addEventListener('mousedown', start);
  root.addEventListener('click', click, true);
  root.addEventListener('contextmenu', contextmenu);
  root.addEventListener('dragstart', dragstart);
  return () => {
    cancel();
    root.removeEventListener('touchstart', start);
    root.removeEventListener('mousedown', start);
    root.removeEventListener('click', click, true);
    root.removeEventListener('contextmenu', contextmenu);
    root.removeEventListener('dragstart', dragstart);
  };
}
