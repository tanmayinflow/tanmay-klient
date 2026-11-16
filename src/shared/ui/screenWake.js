// Wake locks are advisory: the OS may refuse/release them for battery or privacy.
// Never retry immediately after system release; resume only on a visible page or
// a new explicit active session, so a manual lock always wins.
export function createScreenWakeController({ doc = globalThis.document, nav = globalThis.navigator } = {}) {
  let active = false, disposed = false, pending = null, sentinel = null, epoch = 0;
  const release = (lock) => { try { Promise.resolve(lock?.release()).catch(() => {}); } catch {} };
  const visible = () => doc?.visibilityState === 'visible';
  const acquire = () => {
    if (!active || disposed || !visible() || sentinel || pending || !nav?.wakeLock?.request) return;
    const token = epoch;
    const request = Promise.resolve().then(() => nav.wakeLock.request('screen'));
    pending = request;
    request.then(lock => {
      if (disposed || token !== epoch || !active || !visible()) { release(lock); return; }
      sentinel = lock;
      lock.addEventListener?.('release', () => { if (sentinel === lock) sentinel = null; }, { once: true });
    }).catch(() => {}).finally(() => {
      if (pending === request) pending = null;
      // An earlier request can resolve after a hide/resume or off/on change.
      // Its obsolete sentinel was released; the new visible session may acquire.
      if (token !== epoch && active && !disposed && visible()) acquire();
    });
  };
  const drop = () => { epoch++; const old = sentinel; sentinel = null; if (old) release(old); };
  const visibility = () => { if (!visible()) drop(); else acquire(); };
  doc?.addEventListener?.('visibilitychange', visibility);
  return {
    setActive(value) { const next = !!value; if (active === next || disposed) return; active = next; if (active) acquire(); else drop(); },
    dispose() { disposed = true; active = false; drop(); doc?.removeEventListener?.('visibilitychange', visibility); },
  };
}

export function observeReadingScreen({ doc = globalThis.document, nav = globalThis.navigator, Observer = globalThis.MutationObserver } = {}) {
  const wake = createScreenWakeController({ doc, nav });
  const sync = () => {
    const opened = Array.from(doc?.querySelectorAll?.('[data-tm-reading],.tm-rich,.tm-nahled') || [])
      .some(el => !el.closest('[hidden],[aria-hidden="true"]') && el.getClientRects().length > 0);
    wake.setActive(opened);
  };
  const observer = Observer ? new Observer(sync) : null;
  observer?.observe(doc.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'aria-hidden'] });
  doc?.addEventListener?.('toggle', sync, true);
  sync();
  return () => { observer?.disconnect(); doc?.removeEventListener?.('toggle', sync, true); wake.dispose(); };
}
