// The same four synthesized voices in both apps. No audio files or continuous playback.
export const TM_SOUNDS = [
  { k: "bowl", cz: "Tibetská mísa", en: "Singing bowl", cz2: "úder a dlouhý dozvuk", en2: "a strike and a long tail" },
  { k: "gong", cz: "Gong", en: "Gong", cz2: "hluboký, pomalu se rozvíjí", en2: "deep, unfolds slowly" },
  { k: "bell", cz: "Zvonky", en: "Tingsha bells", cz2: "dva čisté kovové tóny", en2: "two clean metal tones" },
  { k: "rain", cz: "Déšť", en: "Rain", cz2: "závoj šumu a tři kapky", en2: "a veil of noise, three drops" },
];
function tmAudioCtx(extCtx) {
  if (extCtx) return extCtx;
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    if (!TM_AC) TM_AC = new Ctx();
    if (TM_AC.state === "suspended") TM_AC.resume().catch(() => {});
    return TM_AC;
  } catch (e) { return null; }
}
let TM_AC = null;
// měkký úder paličky · krátký šum, aby tón nezačínal z ničeho
function tmMallet(ctx, t0, freq, amp, dur) {
  const n = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
  const ch = n.getChannelData(0);
  for (let i = 0; i < ch.length; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / ch.length);
  const src = ctx.createBufferSource(); src.buffer = n;
  const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = freq; bp.Q.value = 1.1;
  const g = ctx.createGain();
  g.gain.setValueAtTime(amp, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(bp); bp.connect(g); g.connect(ctx.destination);
  src.start(t0); src.stop(t0 + dur);
}
// jedna složka kovu · sinus s vlastním náběhem a vlastním dozníváním
function tmPartial(ctx, t0, f, amp, atk, dec, bend) {
  const o = ctx.createOscillator(); const g = ctx.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(f * (bend ? 1 + bend : 1), t0);
  if (bend) o.frequency.exponentialRampToValueAtTime(f, t0 + 0.35);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, amp), t0 + atk);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dec);
  o.connect(g); g.connect(ctx.destination);
  o.start(t0); o.stop(t0 + dec + 0.05);
}
function tmVoiceBowl(ctx, t0, v) {
  const f0 = 214;
  // poměry změřené na himálajské míse · právě ty dělají „mísu" mísou
  const P = [[1, 0.085, 0.02, 9.5], [2.74, 0.05, 0.012, 6.4], [5.4, 0.026, 0.008, 4.2], [8.93, 0.013, 0.006, 2.8], [13.3, 0.007, 0.005, 1.9]];
  tmMallet(ctx, t0, f0 * 5, 0.03 * v, 0.09);
  P.forEach(([r, a, atk, dec]) => tmPartial(ctx, t0, f0 * r, a * v, atk, dec));
  // pomalé chvění · dvě téměř stejné složky se navzájem míjejí
  tmPartial(ctx, t0, f0 * 1.0035, 0.055 * v, 0.03, 9.0);
  tmPartial(ctx, t0, f0 * 2.7365, 0.03 * v, 0.02, 6.0);
}
function tmVoiceGong(ctx, t0, v) {
  const f0 = 96;
  const P = [[1, 0.09, 0.03, 11], [1.52, 0.055, 0.05, 9], [2.13, 0.04, 0.08, 7.5], [2.96, 0.03, 0.14, 6], [4.21, 0.02, 0.22, 4.6], [5.93, 0.012, 0.3, 3.4], [7.4, 0.008, 0.42, 2.6]];
  tmMallet(ctx, t0, 260, 0.05 * v, 0.16);
  P.forEach(([r, a, atk, dec], i) => tmPartial(ctx, t0, f0 * r, a * v, atk, dec, i > 1 ? 0.012 : 0));
  tmPartial(ctx, t0, f0 * 1.007, 0.05 * v, 0.04, 10.5);
}
function tmVoiceBell(ctx, t0, v) {
  const hit = (ts, f0, amp) => {
    tmMallet(ctx, ts, f0 * 2, 0.02 * v, 0.05);
    [[1, 0.07, 4.2], [2.42, 0.035, 3.0], [3.87, 0.018, 2.1], [5.6, 0.008, 1.4]].forEach(([r, a, dec]) => tmPartial(ctx, ts, f0 * r, a * amp * v, 0.006, dec));
  };
  hit(t0, 1046, 1);
  hit(t0 + 0.115, 1053, 0.8);   // druhá činelka je vždy o chlup jinde
}
function tmVoiceRain(ctx, t0, v) {
  const dur = 2.8;
  const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
  const ch = buf.getChannelData(0);
  for (let i2 = 0; i2 < ch.length; i2++) ch[i2] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource(); src.buffer = buf;
  const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 850; lp.Q.value = 0.4;
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(0.0001, t0);
  ng.gain.exponentialRampToValueAtTime(0.045 * v, t0 + 0.6);
  ng.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(lp); lp.connect(ng); ng.connect(ctx.destination);
  src.start(t0); src.stop(t0 + dur);
  [[392.0, 0.2], [523.25, 0.85], [659.25, 1.5]].forEach(([f, dt]) => tmPartial(ctx, t0 + dt, f, 0.05 * v, 0.1, 1.8));
}
// jeden vstup pro celý dům · časovač i připomínky zvoní stejným hlasem
export function tmPlaySound(name, extCtx, vol) {
  try {
    const ctx = tmAudioCtx(extCtx);
    if (!ctx) return false;
    const t0 = ctx.currentTime + 0.02;
    const v = vol == null ? 1 : Math.max(0, Math.min(1.4, vol));
    if (name === "gong") tmVoiceGong(ctx, t0, v);
    else if (name === "bell") tmVoiceBell(ctx, t0, v);
    else if (name === "rain") tmVoiceRain(ctx, t0, v);
    else tmVoiceBowl(ctx, t0, v);
    return true;
  } catch (e) { return false; }
}
