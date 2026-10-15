// Canonical source: Work/web-application/Shared/product-core/ui/overlayViewport.js
// A fixed body has no height in normal flow. In an installed WebKit app that
// can shorten the native viewport by its safe areas (WebKit 210009/237961).
// Preserve the healthy document extent BEFORE fixing the body. The paper's
// visible rectangle is separate: it follows keyboard and viewport movement.

const properties = ["height", "min-height", "overflow", "--tm-overlay-top", "--tm-overlay-left", "--tm-overlay-width", "--tm-overlay-height", "--tm-canvas-height"];
const positive = (n) => Number.isFinite(n) && n > 0 ? n : 0;

export function tmStartLockedViewport(win, doc) {
  const root = doc?.documentElement, style = root?.style;
  if (!style?.setProperty || !win?.requestAnimationFrame) return () => {};
  const previous = properties.map((name) => [name, style.getPropertyValue(name), style.getPropertyPriority(name)]);
  const vv = win.visualViewport;
  const standalone = !!(win.navigator?.standalone || win.matchMedia?.("(display-mode: standalone)").matches || win.matchMedia?.("(display-mode: fullscreen)").matches);
  let fullHeight = Math.max(positive(win.innerHeight), positive(root.clientHeight), positive(vv?.height) + (vv?.offsetTop || 0));
  let layoutWidth = positive(win.innerWidth);
  let keyboardCovered = fullHeight - (positive(vv?.height) || fullHeight) > 120;
  let frame = 0, recoveryFrame = 0, stopped = false;
  const px = (n) => `${Math.round(n * 1000) / 1000}px`;

  const measure = () => {
    frame = 0;
    if (stopped) return;
    const top = Math.max(0, vv?.offsetTop || 0), left = Math.max(0, vv?.offsetLeft || 0);
    const width = positive(vv?.width) || positive(win.innerWidth) || positive(root.clientWidth);
    const visibleHeight = positive(vv?.height) || positive(win.innerHeight) || fullHeight;
    // A width change is a new layout (rotation/window resize), not a keyboard.
    // Do not retain a portrait document height after rotating to landscape.
    const nextWidth = positive(win.innerWidth);
    if (Math.abs(nextWidth - layoutWidth) > 1) {
      fullHeight = Math.max(positive(win.innerHeight), visibleHeight);
      layoutWidth = nextWidth;
      keyboardCovered = fullHeight - visibleHeight > 120;
    } else {
      fullHeight = Math.max(fullHeight, positive(win.innerHeight), visibleHeight);
    }
    // A home-screen app has no retractable browser toolbar. Losing just its
    // safe-area height after locking must not shorten the paper with it.
    // Keep the measured healthy floor until a keyboard genuinely covers it.
    const height = standalone && !keyboardCovered ? Math.max(visibleHeight, fullHeight - top) : visibleHeight;
    const canvasHeight = Math.max(fullHeight, height + top);
    style.setProperty("height", px(canvasHeight));
    style.setProperty("min-height", px(canvasHeight));
    style.setProperty("overflow", "hidden");
    style.setProperty("--tm-overlay-top", px(top));
    style.setProperty("--tm-overlay-left", px(left));
    style.setProperty("--tm-overlay-width", px(width));
    style.setProperty("--tm-overlay-height", px(height));
    style.setProperty("--tm-canvas-height", px(canvasHeight));
  };
  const schedule = () => {
    if (!stopped && !frame) frame = win.requestAnimationFrame(measure);
  };
  // The original page position lives in TM_ZAMEK/body.top. Native scrolling of
  // the now-locked document is unwanted. Reset on open/resume/keyboard return,
  // never continuously during typing or an inner sheet's own scrolling.
  const recover = () => {
    if (stopped || recoveryFrame) return;
    recoveryFrame = win.requestAnimationFrame(() => {
      recoveryFrame = 0;
      if (stopped) return;
      root.scrollTop = 0;
      try { win.scrollTo(0, 0); } catch (_) { /* detached document */ }
      schedule();
    });
  };
  const resize = () => {
    const covered = fullHeight - positive(vv?.height);
    if (vv && covered > 120) keyboardCovered = true;
    // iOS animates keyboard dismissal in many small resize events. Detect
    // returning to the unobscured extent, not a single large height delta.
    else if (vv && keyboardCovered && covered <= 120) { keyboardCovered = false; recover(); }
    schedule();
  };
  const resume = () => { recover(); schedule(); };
  const visibility = () => { if (doc.visibilityState === "visible") resume(); };
  measure();
  recover();
  vv?.addEventListener("resize", resize);
  vv?.addEventListener("scroll", schedule);
  win.addEventListener("resize", resize);
  win.addEventListener("pageshow", resume);
  doc.addEventListener("visibilitychange", visibility);
  return () => {
    stopped = true;
    if (frame) win.cancelAnimationFrame(frame);
    if (recoveryFrame) win.cancelAnimationFrame(recoveryFrame);
    vv?.removeEventListener("resize", resize);
    vv?.removeEventListener("scroll", schedule);
    win.removeEventListener("resize", resize);
    win.removeEventListener("pageshow", resume);
    doc.removeEventListener("visibilitychange", visibility);
    for (const [name, value, priority] of previous) {
      if (value) style.setProperty(name, value, priority);
      else style.removeProperty(name);
    }
  };
}
