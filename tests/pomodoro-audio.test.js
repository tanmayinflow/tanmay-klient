import test from 'node:test';
import assert from 'node:assert/strict';
import { createPomodoroAudio, TM_SOUNDS } from '../src/shared/ui/pomodoroSound.js';

function platform() {
  const contexts = [], audible = [];
  const param = () => ({ value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {} });
  class Context {
    constructor() { this.state = 'running'; this.currentTime = 0; this.sampleRate = 8000; this.destination = {}; contexts.push(this); }
    resume() { this.state = 'running'; return Promise.resolve(); }
    close() { this.state = 'closed'; return Promise.resolve(); }
    node(kind) {
      const context = this;
      return { gain: param(), frequency: param(), Q: param(), connect(to) { return to; }, disconnect() {},
        start() { if (context.state === 'running' && (kind === 'oscillator' || this.buffer?.length > 1)) audible.push(context); }, stop() {} };
    }
    createGain() { return this.node('gain'); }
    createOscillator() { return this.node('oscillator'); }
    createBiquadFilter() { return this.node('filter'); }
    createBufferSource() { return this.node('buffer'); }
    createBuffer(_channels, length) { return { length, getChannelData: () => new Float32Array(length) }; }
  }
  const events = new Map();
  return { contexts, audible, host: { AudioContext: Context, addEventListener(name, cb) { events.set(name, cb); }, removeEventListener(name) { events.delete(name); } } };
}

test('every pomodoro voice can play repeated focus and rest boundaries', () => {
  const p = platform(), audio = createPomodoroAudio(p.host);
  try {
    audio.unlock();
    for (let cycle = 0; cycle < 4; cycle++) for (const voice of TM_SOUNDS) {
      const before = p.audible.length;
      audio.play(voice.k, null, .7);
      assert.ok(p.audible.length > before, `${voice.k}, cycle ${cycle + 1}`);
    }
  } finally { audio.dispose(); }
});

test('pomodoro recovers an interrupted context before synthesizing its next bell', async () => {
  const p = platform(), audio = createPomodoroAudio(p.host);
  try {
    audio.unlock(); audio.play('bell');
    const context = p.contexts.at(-1), before = p.audible.length;
    context.state = 'interrupted';
    audio.play('bell');
    await Promise.resolve(); await Promise.resolve();
    assert.ok(p.audible.length > before);
    assert.equal(context.state, 'running');
    context.state = 'closed';
    audio.unlock(); audio.play('gong');
    assert.notEqual(p.contexts.at(-1), context);
    assert.equal(audio.state(), 'running');
  } finally { audio.dispose(); }
});

test('pomodoro does not claim success without audio support or revive a closed external renderer', () => {
  const audio = createPomodoroAudio({});
  assert.equal(audio.play('bowl'), false);
  assert.equal(audio.play('bowl', { state: 'closed' }), false);
  audio.dispose();
});
