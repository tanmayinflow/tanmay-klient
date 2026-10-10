import { TM_VOICE_PICKS } from './timerVoicePicks.js';

export const TIMER_DEFAULTS = Object.freeze({ sound: true, volume: .7, voice: false, haptics: true, wake: true, countIn: 5, lastMode: 'interval', voiceEn: '', voiceRate: 1, voiceLang: 'en', soundSet: 'misa', soundV: 2 });

// Migrate the former single-tone default once. Explicit later choices are retained.
// Old Czech voice settings may remain in storage, but can never control playback.
export function timerConfig(saved = {}) {
  saved = saved || {};
  const config = { ...TIMER_DEFAULTS, specs: {}, ...saved, voiceLang: 'en' };
  if ((saved.soundV || 1) < 2 && (!saved.soundSet || saved.soundSet === 'ton')) config.soundSet = 'misa';
  if (!['ton', 'gong', 'misa', 'zvon', 'drevo', 'puls'].includes(config.soundSet)) config.soundSet = 'misa';
  return config;
}

const NUMBERS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
export const tmNum = n => NUMBERS[n] || String(n);
export const tmVL = (_cs, en) => en;
export const isEnglishVoice = voice => /^en(?:-|$)/i.test(String(voice?.lang || '').replaceAll('_', '-'));

export function rankEnglishVoices(voices) {
  const score = voice => {
    const name = voice.name || '';
    let value = /google|natural|neural|premium|enhanced|siri|online/i.test(name) ? 40 : 0;
    if (/espeak|compact|eloquence|pico|festival|desktop/i.test(name)) value -= 60;
    const index = TM_VOICE_PICKS.findIndex(pick => pick.test.test(name));
    if (index >= 0) value += 100 - index * 3;
    if (/premium|enhanced/i.test(name)) value += 8;
    if (voice.localService === false) value += 25;
    if (/^en[-_](us|gb)/i.test(voice.lang)) value += 10;
    if (voice.default) value += 4;
    return value;
  };
  return [...new Map((voices || []).filter(isEnglishVoice).map(voice => [voice.voiceURI || `${voice.name}:${voice.lang}`, voice])).values()]
    .sort((a, b) => score(b) - score(a) || String(a.name).localeCompare(String(b.name)));
}

export function createTimerVoice(host = typeof window === 'undefined' ? null : window) {
  let enabled = false, rate = 1, selected = '', voices = [], generation = 0;
  const listeners = new Set();
  const synthesis = () => host?.speechSynthesis;
  const refresh = () => {
    try { voices = rankEnglishVoices(synthesis()?.getVoices() || []); } catch { voices = []; }
    for (const callback of listeners) callback(voices);
  };
  const pick = (uri = selected) => {
    const available = host?.navigator?.onLine === false ? voices.filter(voice => voice.localService !== false) : voices;
    return available.find(voice => voice.voiceURI === uri) || available[0] || null;
  };
  const stop = () => {
    generation += 1;
    try { synthesis()?.cancel(); } catch { /* Unsupported or interrupted OS engine. */ }
  };
  const speak = (voice, text, interrupt, silent = false) => {
    const engine = synthesis();
    if (!engine || !isEnglishVoice(voice) || !host?.SpeechSynthesisUtterance) return;
    try {
      const utterance = new host.SpeechSynthesisUtterance(String(text));
      utterance.voice = voice; utterance.lang = voice.lang; utterance.rate = rate;
      utterance.pitch = 1; utterance.volume = silent ? 0 : 1;
      if (interrupt && (engine.speaking || engine.pending)) {
        stop();
        const ticket = generation;
        setTimeout(() => { if (ticket === generation) { try { engine.speak(utterance); } catch { /* OS unavailable. */ } } }, 30);
      } else engine.speak(utterance);
      if (engine.paused) engine.resume();
    } catch { /* Timer visual and sound cues continue when speech is unavailable. */ }
  };
  refresh();
  try { synthesis()?.addEventListener('voiceschanged', refresh); } catch { /* Optional browser event. */ }
  host?.addEventListener?.('focus', refresh);
  host?.addEventListener?.('pageshow', refresh);
  return {
    voices: () => voices,
    listFor: () => voices,
    current: pick,
    lang: () => 'en',
    onChange(callback) { listeners.add(callback); refresh(); return () => listeners.delete(callback); },
    set(on, options = {}) {
      enabled = !!on;
      if (Number.isFinite(options.rate)) rate = Math.max(.6, Math.min(1.6, options.rate));
      if (options.en !== undefined) selected = options.en || '';
      if (!enabled) stop();
    },
    prime() { if (enabled) speak(pick(), ' ', false, true); },
    say(text, interrupt = false) { if (enabled && text) speak(pick(), text, interrupt); },
    audition(voice, text) { speak(voice, text, true); },
    stop,
    dispose() {
      stop(); listeners.clear();
      synthesis()?.removeEventListener?.('voiceschanged', refresh);
      host?.removeEventListener?.('focus', refresh);
      host?.removeEventListener?.('pageshow', refresh);
    },
  };
}

export const tmVoice = createTimerVoice();
