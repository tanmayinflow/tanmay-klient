import test from 'node:test';
import assert from 'node:assert/strict';
import { createTimerVoice, rankEnglishVoices, timerConfig, tmNum, tmVL } from '../src/training/timerVoice.js';
import { createTimerAudio, TM_SOUND_SETS } from '../src/training/timerAudio.js';

const voice = (name, lang, extra = {}) => ({ name, lang, voiceURI: name, localService: true, ...extra });
function platform(initial = []) {
  let voices = initial;
  const events = {}, utterances = [];
  const host = {
    navigator: { onLine: true },
    SpeechSynthesisUtterance: class { constructor(text) { this.text = text; } },
    addEventListener() {}, removeEventListener() {},
    speechSynthesis: { getVoices: () => voices, addEventListener: (name, fn) => { events[name] = fn; }, removeEventListener() {}, speak: utterance => utterances.push(utterance), cancel() {}, resume() {} },
  };
  return { host, utterances, load: next => { voices = next; events.voiceschanged?.(); } };
}

test('timer defaults and legacy migration use English and bowl without mutating saved preferences', () => {
  assert.equal(timerConfig().soundSet, 'misa');
  assert.equal(timerConfig().voiceLang, 'en');
  assert.equal(timerConfig().voice, false);
  for (const saved of [{ voiceLang: 'cs', soundSet: 'ton' }, { voiceLang: 'app' }, null]) {
    const before = JSON.stringify(saved), config = timerConfig(saved);
    assert.equal(config.voiceLang, 'en'); assert.equal(config.soundSet, 'misa');
    assert.equal(JSON.stringify(saved), before);
  }
  assert.equal(timerConfig({ soundSet: 'ton', soundV: 2 }).soundSet, 'ton');
  assert.equal(timerConfig({ soundSet: 'gong' }).soundSet, 'gong');
  assert.equal(timerConfig({ soundSet: 'unknown' }).soundSet, 'misa');
  assert.equal(tmNum(3), 'three'); assert.equal(tmNum(25), '25');
  assert.equal(tmVL('česky', 'English'), 'English');
});

test('ranking is English-only, deduplicated, stable and prefers existing enhanced recommendations', () => {
  const voices = [voice('Jakub', 'cs-CZ', { default: true }), voice('legacy desktop', 'en_US'), voice('Zoe (Premium)', 'en-US'), voice('Zoe (Premium)', 'en-US'), voice('British', 'en-GB'), voice('False prefix', 'eng')];
  const before = voices.slice();
  assert.deepEqual(rankEnglishVoices(voices).map(item => item.name), ['Zoe (Premium)', 'British', 'legacy desktop']);
  assert.deepEqual(voices, before);
});

test('a saved Czech URI cannot select or audition a Czech voice and empty English inventory stays silent', () => {
  const cs = voice('Jakub', 'cs-CZ'), p = platform([cs]);
  const engine = createTimerVoice(p.host);
  engine.set(true, { cs: 'Jakub', en: 'Jakub', lang: 'cs' });
  engine.prime(); engine.say('Three'); engine.audition(cs, 'Three');
  assert.deepEqual(p.utterances, []); assert.equal(engine.lang(), 'en'); assert.deepEqual(engine.listFor('cs'), []);
  engine.dispose();
});

test('asynchronously arriving English voices are available without reload and saved English choice wins', () => {
  const p = platform(), engine = createTimerVoice(p.host), heard = [];
  const unsub = engine.onChange(list => heard.push(list.length));
  engine.set(true, { en: 'Daniel', rate: 1.15 });
  p.load([voice('Zoe (Premium)', 'en-US'), voice('Daniel', 'en-GB')]);
  engine.say('Last round');
  assert.equal(engine.current().name, 'Daniel'); assert.equal(p.utterances[0].lang, 'en-GB');
  assert.equal(p.utterances[0].rate, 1.15); assert.deepEqual(heard, [0, 2]);
  unsub(); p.load([]); assert.deepEqual(heard, [0, 2]); engine.dispose();
});

test('an unavailable saved voice falls back to an English voice, and offline playback avoids remote voices', () => {
  const p = platform([voice('Google US English', 'en-US', { localService: false }), voice('Daniel', 'en-GB')]);
  const engine = createTimerVoice(p.host);
  assert.equal(engine.current('Daniel').name, 'Daniel');
  assert.equal(engine.current().name, 'Google US English');
  engine.set(true, { en: 'missing' }); assert.equal(engine.current().name, 'Google US English');
  p.host.navigator.onLine = false; engine.say('Go'); assert.equal(p.utterances[0].voice.name, 'Daniel');
  p.load([voice('Google US English', 'en-US', { localService: false })]);
  engine.say('Three'); assert.equal(p.utterances.length, 1); engine.dispose();
});

test('stopping speech cancels a countdown queued after browser cancellation', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const p = platform([voice('Daniel', 'en-GB')]); p.host.speechSynthesis.speaking = true;
  const engine = createTimerVoice(p.host); engine.set(true); engine.say('Three', true); engine.stop();
  t.mock.timers.tick(100); assert.equal(p.utterances.length, 0);
  engine.say('Two', true); t.mock.timers.tick(31); assert.equal(p.utterances[0].text, 'Two');
  engine.set(false); engine.say('One'); assert.equal(p.utterances.length, 1); engine.dispose();
});

function audioPlatform() {
  const sounds = [], contexts = []; let now = 0;
  const param = () => ({ value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {} });
  class AudioContext {
    constructor() { this.state = 'running'; this.currentTime = 0; this.sampleRate = 8000; this.destination = {}; this.gains = []; contexts.push(this); }
    resume() { this.state = 'running'; return Promise.resolve(); }
    close() { this.state = 'closed'; return Promise.resolve(); }
    node(kind) { return { gain: param(), frequency: param(), Q: param(), connect(to) { return to; }, disconnect() {}, start() { if (kind !== 'buffer' || this.buffer?.length > 1) sounds.push('sound'); }, stop() {} }; }
    createGain() { const node = this.node(); this.gains.push(node); return node; } createOscillator() { return this.node(); }
    createBiquadFilter() { return this.node(); } createBufferSource() { return this.node('buffer'); }
    createBuffer(_channels, length) { return { length, getChannelData: () => new Float32Array(length) }; }
    createDynamicsCompressor() { return { ...this.node(), threshold: param(), knee: param(), ratio: param(), attack: param(), release: param() }; }
  }
  return { host: { AudioContext, performance: { now: () => now } }, sounds, contexts, advance(ms) { now += ms; } };
}

test('each sound set produces every timer cue and mute suppresses later cues', () => {
  const p = audioPlatform();
  for (const set of TM_SOUND_SETS) {
    const audio = createTimerAudio(p.host); audio.set(true, .4, set.k);
    for (const cue of ['count', 'ten', 'half', 'go', 'rest', 'tick', 'finish']) {
      const before = p.sounds.length; audio[cue](3); assert.ok(p.sounds.length > before, `${set.k}/${cue}`);
    }
    audio.set(false); const before = p.sounds.length; audio.finish(); assert.equal(p.sounds.length, before);
  }
});

test('sound preview replaces previous pending cues and never changes the current mute setting', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const p = audioPlatform();
  const audio = createTimerAudio(p.host); audio.set(false, .5, 'ton');
  audio.preview('gong'); audio.stopPreview(); t.mock.timers.tick(2000); assert.equal(p.sounds.length, 0);
  audio.preview('ton'); audio.preview('ton'); t.mock.timers.tick(1300);
  assert.equal(p.sounds.length, 5); const before = p.sounds.length;
  audio.count(3); assert.equal(p.sounds.length, before);
  audio.set(true); p.contexts[0].state = 'interrupted'; audio.go(); await Promise.resolve(); await Promise.resolve(); assert.equal(p.contexts[0].state, 'running');
  p.contexts[0].state = 'closed'; audio.go(); assert.equal(p.contexts.length, 2); audio.dispose();
});

test('repeated training starts preserve volume and sound choice across fresh contexts', () => {
  const p = audioPlatform(), audio = createTimerAudio(p.host);
  try {
    audio.set(true, .3, 'ton');
    for (let cycle = 0; cycle < 4; cycle++) {
      p.advance(5000); audio.unlock();
      const context = p.contexts.at(-1), before = p.sounds.length;
      assert.equal(context.gains[0].gain.value, Math.pow(.3, 1.4) * 2.7);
      for (const cue of ['count', 'ten', 'half', 'go', 'rest', 'tick', 'finish']) audio[cue](3);
      assert.equal(p.sounds.length - before, 12, 'the selected Tone set stays selected after each fresh context');
    }
    assert.equal(p.contexts.length, 4);
    assert.ok(p.contexts.slice(0, -1).every(context => context.state === 'closed'));
  } finally { audio.dispose(); }
});

test('muting while a training cue awaits resume prevents it from replaying later', async () => {
  const p = audioPlatform(), audio = createTimerAudio(p.host);
  try {
    audio.set(true, .4, 'ton'); audio.unlock(); const context = p.contexts.at(-1);
    let finishResume;
    context.state = 'interrupted';
    context.resume = () => new Promise(resolve => { finishResume = () => { context.state = 'running'; resolve(); }; });
    const before = p.sounds.length;
    audio.count(2); audio.set(false); finishResume();
    await Promise.resolve(); await Promise.resolve();
    assert.equal(p.sounds.length, before);
    audio.set(true); audio.count(1); assert.equal(p.sounds.length, before + 1);
  } finally { audio.dispose(); }
});

test('closing a sound preview also suppresses a cue already waiting for OS recovery', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const p = audioPlatform(), audio = createTimerAudio(p.host);
  try {
    audio.preview('ton'); const context = p.contexts.at(-1);
    let finishResume;
    context.state = 'interrupted';
    context.resume = () => new Promise(resolve => { finishResume = () => { context.state = 'running'; resolve(); }; });
    t.mock.timers.tick(1); audio.stopPreview(); finishResume();
    await Promise.resolve(); await Promise.resolve();
    assert.equal(p.sounds.length, 0);
    t.mock.timers.tick(2000); assert.equal(p.sounds.length, 0);
  } finally { audio.dispose(); }
});
