import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createAudioContextManager } from '../src/shared/product/audioContext.js';

function platform() {
  let time = 0;
  const contexts = [], resumes = [];
  const target = () => {
    const handlers = new Map();
    return { handlers, addEventListener(name, fn) { handlers.set(name, fn); }, removeEventListener(name) { handlers.delete(name); }, emit(name, event = {}) { handlers.get(name)?.(event); } };
  };
  class Context {
    constructor() { this.state = 'running'; this.currentTime = 0; this.sampleRate = 8000; this.destination = {}; this.closed = 0; contexts.push(this); }
    resume() { return new Promise((resolve, reject) => resumes.push({ context: this, resolve: () => { this.state = 'running'; resolve(); }, reject })); }
    close() { this.closed++; this.state = 'closed'; return Promise.resolve(); }
    createBuffer() { return {}; }
    createBufferSource() { return { connect() {}, start() {}, disconnect() {} }; }
  }
  return { contexts, resumes, advance(ms) { time += ms; },
    host: { ...target(), AudioContext: Context, performance: { now: () => time }, document: { ...target(), visibilityState: 'visible' } } };
}
const settle = async () => { await Promise.resolve(); await Promise.resolve(); };

test('an explicit second start rebuilds even a context falsely reported as running; mount unlock is coalesced', () => {
  const p = platform(), lifecycle = [];
  const audio = createAudioContextManager(p.host, { onCreate: c => lifecycle.push(['create', c]), onReset: () => lifecycle.push(['reset']) });
  audio.unlock(); const first = audio.get();
  p.advance(120); audio.unlock(); assert.strictEqual(audio.get(), first);
  p.advance(1000); audio.unlock(false); assert.strictEqual(audio.get(), first, 'a slow mounted timer must keep its gesture-unlocked context');
  p.advance(5000); audio.unlock(); const second = audio.get();
  assert.notStrictEqual(first, second); assert.equal(first.closed, 1);
  let heard; audio.run(c => { heard = c; }); assert.strictEqual(heard, second);
  assert.equal(lifecycle.filter(([action]) => action === 'create').length, 2);
  audio.dispose();
});

test('asynchronous interruption recovery resumes once and plays only the newest still-current cue', async () => {
  const p = platform(), audio = createAudioContextManager(p.host), played = [];
  audio.unlock(); audio.get().state = 'interrupted';
  audio.run(() => played.push('three')); p.advance(100); audio.run(() => played.push('two'));
  assert.equal(p.resumes.length, 1); assert.deepEqual(played, []);
  p.resumes[0].resolve(); await settle();
  assert.deepEqual(played, ['two']);
  audio.get().onstatechange(); assert.deepEqual(played, ['two'], 'statechange cannot duplicate a resolved cue');
  audio.dispose();
});

test('expired countdowns are discarded when an OS resume resolves late', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const p = platform(), audio = createAudioContextManager(p.host), played = [];
  audio.unlock(); audio.get().state = 'suspended';
  audio.run(() => played.push('late'));
  p.advance(1000); t.mock.timers.tick(1000);
  p.resumes[0].resolve(); await settle();
  assert.deepEqual(played, []); audio.dispose();
});

test('rejected resume clears only its own cue and a later boundary can recover', async () => {
  const p = platform(), audio = createAudioContextManager(p.host), played = [];
  audio.unlock(); audio.get().state = 'interrupted';
  audio.run(() => played.push('rejected'));
  p.resumes[0].reject(new Error('OS denied resume')); await settle();
  audio.run(() => played.push('next')); assert.equal(p.resumes.length, 2);
  p.resumes[1].resolve(); await settle(); assert.deepEqual(played, ['next']); audio.dispose();
});

test('old resume rejection cannot erase a new generation cue', async () => {
  const p = platform(), audio = createAudioContextManager(p.host), played = [];
  audio.unlock(); audio.get().state = 'interrupted'; audio.run(() => played.push('old'));
  p.advance(1000); audio.unlock(); audio.get().state = 'interrupted'; audio.run(() => played.push('new'));
  assert.equal(p.resumes.length, 2);
  p.resumes[0].reject(new Error('retired context')); await settle();
  p.resumes[1].resolve(); await settle(); assert.deepEqual(played, ['new']); audio.dispose();
});

test('old successful resume cannot replay an old cue or flush a suspended new generation', async () => {
  const p = platform(), audio = createAudioContextManager(p.host), played = [];
  audio.unlock(); audio.get().state = 'interrupted'; audio.run(() => played.push('old'));
  p.advance(1000); audio.unlock(); audio.get().state = 'interrupted'; audio.run(() => played.push('new'));
  p.resumes[0].resolve(); await settle(); assert.deepEqual(played, []);
  p.resumes[1].resolve(); await settle(); assert.deepEqual(played, ['new']); audio.dispose();
});

test('foreground recovery is passive and disposal detaches events and pending audio', async () => {
  const p = platform(), audio = createAudioContextManager(p.host), played = [];
  audio.unlock(); const context = audio.get(); context.state = 'interrupted';
  audio.run(() => played.push('old'));
  p.host.document.emit('visibilitychange'); p.host.emit('focus');
  assert.equal(p.contexts.length, 1); assert.equal(p.resumes.length, 1);
  audio.dispose();
  assert.equal(p.host.handlers.size, 0); assert.equal(p.host.document.handlers.size, 0);
  assert.equal(context.onstatechange, null); assert.equal(context.closed, 1);
  p.resumes[0].resolve(); await settle(); assert.deepEqual(played, []);
  audio.unlock(); assert.equal(audio.get(), null); assert.equal(p.contexts.length, 1);
});

test('training and focus start handlers unlock audio within the original user gesture', () => {
  const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
  const pomo = readFileSync(new URL('../src/shared/ui/pomodoro.jsx', import.meta.url), 'utf8');
  assert.match(app, /const run = \(m, s\) => \{\s*tmAudio\.unlock\(\);\s*st\.setTmSpec/, 'timer home primes audio before mounting its delayed stage');
  assert.match(pomo, /const beginRun = \(extra\) => \{\s*if \(cfg\.sound !== false\) tmUnlockSound\(\);\s*pomoWake/, 'focus start, resume and category selection share a synchronous audio unlock');
  const stage = app.slice(app.indexOf('function TmStage('), app.indexOf('function TmStage(') + 2200);
  assert.match(stage, /useTmEngine\(compiled, \{[^}]*sound: !muted && cfg\.sound[^}]*voice: cfg\.voice && !muted/, 'local mute is carried into every later engine cue');
  const play = app.slice(app.indexOf('  const play = (cues, el)'), app.indexOf('  const play = (cues, el)') + 500);
  assert.match(play, /tmAudio\.set\(c\.sound, c\.volume, c\.soundSet\)/, 'guided timers apply their own settings instead of inheriting another timer mute');
});
