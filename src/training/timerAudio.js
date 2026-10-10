// Shared synthesised timer sound sets. No recording or audio upload.
export const TM_SOUND_SETS = [
  { k: "ton", cz: "Tón", en: "Tone", dcz: "Čisté pípnutí. Střídmé, jak bylo.", den: "A clean beep. Plain, as it was." },
  { k: "gong", cz: "Gong", en: "Gong", dcz: "Hluboký kovový úder, který dozní.", den: "A deep metal strike that rings out." },
  { k: "misa", cz: "Tibetská mísa", en: "Singing bowl", dcz: "Měkký úder paličkou, dlouhé chvění.", den: "A soft mallet strike, a long shimmer." },
  { k: "zvon", cz: "Zvonek", en: "Bell", dcz: "Jasný zvonek, krátký a čitelný.", den: "A bright bell, short and legible." },
  { k: "drevo", cz: "Dřevo", en: "Wood", dcz: "Suché klepnutí, jako claves. Rychlé.", den: "A dry knock, like claves. Fast." },
  { k: "puls", cz: "Puls", en: "Pulse", dcz: "Elektronický, ostrý, do tempa.", den: "Electronic, sharp, on the beat." },
];
export function createTimerAudio(host = typeof window === "undefined" ? null : window) {
  let ctx = null, master = null, comp = null, vol = 0.7, on = true, set = "misa", previews = [];
  const stopPreview = () => { previews.forEach(clearTimeout); previews = []; };
  // PROČ DRUHÉ SPUŠTĚNÍ MLČELO. iOS zvukový kontext po skončení první session
  // (ticho, zamknutý displej, hovor, hlasová syntéza) přepne do „interrupted"
  // nebo „suspended". Starý `unlock()` křísil jen „suspended" a jen když ho
  // někdo zavolal — a druhý start šel přes setTimeout, ne přes klepnutí, takže
  // ho neoživil nikdo. Teď se kontext (1) křísí před KAŽDÝM zvukem, (2) křísí
  // i z „interrupted", (3) znovu postaví, když ho systém zavřel, (4) probudí
  // se, jakmile se stránka vrátí do popředí.
  const wake = () => {
    const c = ctx;
    if (!c) return;
    if (c.state === "suspended" || c.state === "interrupted") { try { c.resume().catch(() => {}); } catch (e) {} }
  };
  if (host?.document) {
    try {
      host.document.addEventListener("visibilitychange", () => { if (host.document.visibilityState === "visible") wake(); });
      host.addEventListener("pageshow", wake);
      host.addEventListener("focus", wake);
    } catch (e) {}
  }
  const ensure = () => {
    if (ctx && ctx.state === "closed") { ctx = null; master = null; comp = null; }
    if (ctx) { wake(); return ctx; }
    try {
      const Ctx = host?.AudioContext || host?.webkitAudioContext;
      if (!Ctx) return null;
      ctx = new Ctx();
      master = ctx.createGain();
      comp = ctx.createDynamicsCompressor();
      // Kompresor drží špičky; díky němu smí být hlavní hlasitost přes 1.
      try { comp.threshold.value = -14; comp.knee.value = 18; comp.ratio.value = 6; comp.attack.value = 0.003; comp.release.value = 0.18; } catch (e) {}
      // a za ním limiter: tvrdý strop těsně pod plným výkonem, aby se na
      // maximu nic nelámalo
      const lim = ctx.createDynamicsCompressor();
      try { lim.threshold.value = -3; lim.knee.value = 0; lim.ratio.value = 20; lim.attack.value = 0.001; lim.release.value = 0.08; } catch (e) {}
      master.gain.value = gainOf(vol);
      master.connect(comp); comp.connect(lim); lim.connect(ctx.destination);
    } catch (e) { ctx = null; }
    return ctx;
  };
  // 0–1 z posuvníku → zesílení. Křivka jde nahoru rychleji na konci, aby
  // spodní polovina zůstala jemná a horní opravdu zněla.
  const gainOf = (v) => Math.pow(Math.max(0, Math.min(1, v)), 1.4) * 2.7;
  // ---- stavební kameny ----
  const tone = (freq, dur, peak, when, type) => {
    const c = ensure();
    if (!c || !on) return;
    const t = c.currentTime + (when || 0);
    const o = c.createOscillator(), g = c.createGain();
    o.type = type || "sine";
    o.frequency.setValueAtTime(freq, t);
    o.connect(g).connect(master);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.start(t); o.stop(t + dur + 0.05);
  };
  // kovová složka · sinus s vlastním náběhem a dozníváním, případně s ohybem výšky
  const partial = (f, amp, atk, dec, when, bend) => {
    const c = ensure();
    if (!c || !on) return;
    const t = c.currentTime + (when || 0);
    const o = c.createOscillator(), g = c.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(f * (bend ? 1 + bend : 1), t);
    if (bend) o.frequency.exponentialRampToValueAtTime(f, t + 0.35);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, amp), t + atk);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dec);
    o.connect(g).connect(master);
    o.start(t); o.stop(t + dec + 0.05);
  };
  // šum přes pásmovou propust · úder paličky, klepnutí dřeva
  const noise = (freq, q, amp, dur, when) => {
    const c = ensure();
    if (!c || !on) return;
    const t = c.currentTime + (when || 0);
    const n = c.createBuffer(1, Math.max(1, Math.floor(c.sampleRate * dur)), c.sampleRate);
    const ch = n.getChannelData(0);
    for (let i = 0; i < ch.length; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / ch.length);
    const src = c.createBufferSource(); src.buffer = n;
    const bp = c.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = freq; bp.Q.value = q;
    const g = c.createGain();
    g.gain.setValueAtTime(amp, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(bp); bp.connect(g); g.connect(master);
    src.start(t); src.stop(t + dur);
  };
  // ---- hlasy ----
  const bowl = (f0, v, when, len) => {
    const L2 = len || 1;
    const P = [[1, 0.34, 0.02, 9.5], [2.74, 0.2, 0.012, 6.4], [5.4, 0.1, 0.008, 4.2], [8.93, 0.05, 0.006, 2.8], [13.3, 0.028, 0.005, 1.9]];
    noise(f0 * 5, 1.1, 0.12 * v, 0.09, when);
    P.forEach(([r, a, atk, dec]) => partial(f0 * r, a * v, atk, dec * L2, when));
    partial(f0 * 1.0035, 0.22 * v, 0.03, 9.0 * L2, when);
    partial(f0 * 2.7365, 0.12 * v, 0.02, 6.0 * L2, when);
  };
  const gong = (f0, v, when, len) => {
    const L2 = len || 1;
    const P = [[1, 0.36, 0.03, 11], [1.52, 0.22, 0.05, 9], [2.13, 0.16, 0.08, 7.5], [2.96, 0.12, 0.14, 6], [4.21, 0.08, 0.22, 4.6], [5.93, 0.05, 0.3, 3.4], [7.4, 0.032, 0.42, 2.6]];
    noise(f0 * 2.7, 1.1, 0.2 * v, 0.16, when);
    P.forEach(([r, a, atk, dec], i) => partial(f0 * r, a * v, atk, dec * L2, when, i > 1 ? 0.012 : 0));
    partial(f0 * 1.007, 0.2 * v, 0.04, 10.5 * L2, when);
  };
  const bell = (f0, v, when) => {
    noise(f0 * 2, 1.1, 0.08 * v, 0.05, when);
    [[1, 0.28, 4.2], [2.42, 0.14, 3.0], [3.87, 0.07, 2.1], [5.6, 0.032, 1.4]].forEach(([r, a, dec]) => partial(f0 * r, a * v, 0.006, dec, when));
  };
  const wood = (f0, v, when) => {
    noise(f0, 6, 0.9 * v, 0.045, when);
    partial(f0, 0.5 * v, 0.002, 0.09, when);
    partial(f0 * 2.3, 0.12 * v, 0.002, 0.05, when);
  };
  const pulse = (f0, v, when, dur, up) => {
    const c = ensure();
    if (!c || !on) return;
    const t = c.currentTime + (when || 0);
    const o = c.createOscillator(), g = c.createGain(), lp = c.createBiquadFilter();
    o.type = "square"; lp.type = "lowpass"; lp.Q.value = 6;
    o.frequency.setValueAtTime(f0, t);
    if (up) o.frequency.exponentialRampToValueAtTime(f0 * up, t + dur * 0.6);
    lp.frequency.setValueAtTime(f0 * 6, t);
    lp.frequency.exponentialRampToValueAtTime(f0 * 1.5, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.32 * v, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(lp); lp.connect(g); g.connect(master);
    o.start(t); o.stop(t + dur + 0.05);
  };
  // ---- sady · každá umí stejných sedm vět ----
  const SETS = {
    ton: {
      count: (n) => tone(n <= 3 ? 660 : 520, 0.14, 0.6, 0, "sine"),
      ten: () => tone(440, 0.18, 0.3),
      half: () => tone(392, 0.22, 0.22),
      go: () => { tone(784, 0.16, 0.5); tone(1175, 0.5, 0.32, 0.10); },
      rest: () => { tone(392, 0.4, 0.34); tone(294, 0.6, 0.2, 0.05); },
      tick: () => tone(880, 0.05, 0.16),
      finish: () => [0, 0.55].forEach((dt) => { tone(587, 1.4, 0.44, dt); tone(1174, 0.9, 0.12, dt); }),
    },
    gong: {
      count: (n) => { noise(420, 2, 0.7, 0.06); partial(n <= 3 ? 192 : 144, 0.8, 0.004, 0.55); },
      ten: () => gong(120, 0.55, 0, 0.35),
      half: () => gong(96, 0.45, 0, 0.3),
      go: () => gong(96, 0.85, 0, 0.55),
      rest: () => gong(72, 0.75, 0, 0.5),
      tick: () => { noise(600, 2, 0.35, 0.05); partial(240, 0.3, 0.003, 0.3); },
      finish: () => { gong(96, 0.85, 0, 1); gong(72, 0.8, 0.9, 1.2); },
    },
    misa: {
      count: (n) => { noise(1070, 1.5, 0.6, 0.06); partial(n <= 3 ? 428 : 321, 0.75, 0.004, 0.7); },
      ten: () => bowl(285, 0.6, 0, 0.35),
      half: () => bowl(214, 0.5, 0, 0.35),
      go: () => bowl(214, 0.85, 0, 0.55),
      rest: () => bowl(160, 0.8, 0, 0.5),
      tick: () => { noise(1400, 1.5, 0.3, 0.04); partial(642, 0.3, 0.003, 0.35); },
      finish: () => { bowl(214, 0.85, 0, 1); bowl(214, 0.7, 1.1, 1); bowl(160, 0.8, 2.3, 1.3); },
    },
    zvon: {
      count: (n) => bell(n <= 3 ? 1318 : 1046, 0.7, 0),
      ten: () => bell(880, 0.5, 0),
      half: () => bell(784, 0.45, 0),
      go: () => { bell(1046, 1, 0); bell(1053, 0.8, 0.115); },
      rest: () => { bell(659, 0.8, 0); bell(523, 0.6, 0.18); },
      tick: () => bell(1568, 0.35, 0),
      finish: () => { bell(1046, 1, 0); bell(1318, 0.9, 0.3); bell(1568, 0.9, 0.6); bell(2093, 0.7, 0.9); },
    },
    drevo: {
      count: (n) => wood(n <= 3 ? 1900 : 1400, 1, 0),
      ten: () => { wood(1100, 0.9, 0); wood(1100, 0.7, 0.12); },
      half: () => wood(900, 0.9, 0),
      go: () => { wood(1900, 1, 0); wood(2400, 1, 0.11); },
      rest: () => { wood(760, 1, 0); wood(560, 0.9, 0.16); },
      tick: () => wood(2400, 0.7, 0),
      finish: () => [0, 0.1, 0.2, 0.3, 0.55, 0.85].forEach((dt, i) => wood(i < 4 ? 1600 : 2200, 0.9, dt)),
    },
    puls: {
      count: (n) => pulse(n <= 3 ? 660 : 440, 1.3, 0, 0.12),
      ten: () => pulse(330, 0.9, 0, 0.2),
      half: () => pulse(294, 0.8, 0, 0.22),
      go: () => { pulse(392, 1, 0, 0.14, 2); pulse(784, 1, 0.13, 0.32); },
      rest: () => { pulse(392, 0.9, 0, 0.2, 0.5); pulse(196, 0.8, 0.18, 0.4); },
      tick: () => pulse(1046, 0.6, 0, 0.05),
      finish: () => [392, 494, 587, 784].forEach((f, i) => pulse(f, 1, i * 0.14, i === 3 ? 0.9 : 0.16)),
    },
  };
  const cur = () => SETS[set] || SETS.ton;
  return {
    sets: TM_SOUND_SETS,
    // Odemknutí patří do klepnutí. Kromě resume() se přehraje jeden tichý
    // vzorek — to je gesto, kterým iOS Safari opravdu pustí zvuk ven z ticha.
    unlock() {
      const c = ensure();
      if (!c) return;
      if (c.state !== "running") { try { c.resume().catch(() => {}); } catch (e) {} }
      try {
        const b = c.createBuffer(1, 1, c.sampleRate);
        const src = c.createBufferSource(); src.buffer = b; src.connect(c.destination); src.start(0);
      } catch (e) {}
    },
    state() { return ctx ? ctx.state : "none"; },
    set(enabled, volume, soundSet) {
      on = !!enabled;
      vol = Math.max(0, Math.min(1, volume == null ? vol : volume));
      if (soundSet && SETS[soundSet]) set = soundSet;
      if (master) master.gain.value = gainOf(vol);
    },
    use(soundSet) { if (soundSet && SETS[soundSet]) set = soundSet; },
    count(n) { cur().count(n); },
    ten() { cur().ten(); },
    half() { cur().half(); },
    go() { cur().go(); },
    rest() { cur().rest(); },
    tick() { cur().tick(); },
    finish() { cur().finish(); },
    // ukázka sady · odpočet 3-2-1 a „teď". Sada se nepřepíná, jen se zahraje.
    preview(soundSet) {
      stopPreview();
      const S = SETS[soundSet] || cur();
      const c = ensure(); if (!c) return 0;
      if (c.state === "suspended") c.resume().catch(() => {});
      const sample = cue => { const was = on; on = true; try { cue(); } finally { on = was; } };
      previews = [3, 2, 1].map((n, i) => setTimeout(() => sample(() => S.count(n)), i * 420));
      previews.push(setTimeout(() => sample(() => S.go()), 1260));
      return 2400;
    },
    stopPreview,
  };
}

export const tmAudio = createTimerAudio();
