// Timer audio lifecycle. A new explicit start must not inherit a wedged iOS
// audio device, even when WebKit still reports its old context as "running".
export function createAudioContextManager(host = typeof window === "undefined" ? null : window, { onCreate, onReset } = {}) {
  let ctx = null, pending = null, resuming = null, expiry = null, disposed = false;
  let lastUnlock = -Infinity;
  const now = () => host?.performance?.now?.() ?? Date.now();
  const clearPending = () => { pending = null; clearTimeout(expiry); expiry = null; };
  const retire = () => {
    const old = ctx; ctx = null; resuming = null; clearPending();
    onReset?.();
    if (old) { old.onstatechange = null; try { Promise.resolve(old.close()).catch(() => {}); } catch {} }
  };
  const flush = c => {
    if (ctx !== c || c.state !== "running" || !pending) return;
    const cue = pending; clearPending();
    if (now() - cue.at <= 750) { try { cue.play(c); } catch { /* Audio must not stop the clock. */ } }
  };
  const resume = c => {
    if (!c || ctx !== c || c.state === "closed") return;
    if (c.state === "running") { flush(c); return; }
    if (resuming?.context === c) return;
    const attempt = { context: c }; resuming = attempt;
    try {
      Promise.resolve(c.resume()).then(() => {
        if (resuming === attempt) resuming = null;
        flush(c);
      }, () => { if (resuming === attempt) { resuming = null; clearPending(); } });
    } catch { if (resuming === attempt) resuming = null; clearPending(); }
  };
  const get = () => {
    if (disposed) return null;
    if (ctx?.state === "closed") retire();
    if (ctx) return ctx;
    try {
      const Ctx = host?.AudioContext || host?.webkitAudioContext;
      if (!Ctx) return null;
      const c = new Ctx(); ctx = c;
      onCreate?.(c);
      c.onstatechange = () => {
        if (ctx !== c) return;
        if (c.state === "running") flush(c);
        else if (c.state === "closed") retire();
      };
      return c;
    } catch { retire(); return null; }
  };
  const unlock = (fresh = true) => {
    if (disposed) return;
    const at = now();
    // A button and its mounted timer can both unlock in the same start.
    // Coalesce that handoff, but rebuild on each subsequent explicit run.
    if (fresh && ctx && at - lastUnlock > 250) retire();
    if (fresh) lastUnlock = at;
    const c = get(); if (!c) return;
    resume(c);
    try {
      const source = c.createBufferSource(); source.buffer = c.createBuffer(1, 1, c.sampleRate);
      source.connect(c.destination); source.onended = () => source.disconnect(); source.start(0);
    } catch {}
  };
  const run = play => {
    const c = get(); if (!c) return false;
    if (c.state === "running") { play(c); return true; }
    // Never accumulate countdowns while the OS blocks audio. Only the latest
    // still-relevant cue can survive an asynchronous resume.
    clearPending(); pending = { play, at: now() };
    expiry = setTimeout(clearPending, 750);
    resume(c);
    return true;
  };
  const wake = () => { if (host?.document?.visibilityState !== "hidden") resume(ctx); };
  const gesture = event => {
    if (event.isTrusted && ctx && ctx.state !== "running") unlock();
  };
  host?.document?.addEventListener("visibilitychange", wake);
  host?.document?.addEventListener("touchend", gesture, true);
  host?.document?.addEventListener("keydown", gesture, true);
  host?.addEventListener?.("pageshow", wake);
  host?.addEventListener?.("focus", wake);
  return {
    get, unlock, run,
    state: () => ctx?.state || "none",
    cancel: clearPending,
    dispose() {
      disposed = true; retire();
      host?.document?.removeEventListener("visibilitychange", wake);
      host?.document?.removeEventListener("touchend", gesture, true);
      host?.document?.removeEventListener("keydown", gesture, true);
      host?.removeEventListener?.("pageshow", wake);
      host?.removeEventListener?.("focus", wake);
    },
  };
}
