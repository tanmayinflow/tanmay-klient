import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = fs.readFileSync(new URL('../src/shared/ui/ExerciseMotion.jsx', import.meta.url), 'utf8');
const code = ts.transpileModule(source + '\nglobalThis.Player = MotionPlayer;', {
  compilerOptions: { jsx: ts.JsxEmit.React, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

function harness({ reduced = false, mode = 'full', refusal, autoPlay = true } = {}) {
  const slots = [], effects = [], listeners = {}, mediaListeners = {};
  let cursor = 0, mounted = false, tree, observer, claimed = 0, released = 0, plays = 0, loads = 0;
  const media = { matches: reduced, addEventListener: (k, cb) => { mediaListeners[k] = cb; }, removeEventListener: k => { delete mediaListeners[k]; } };
  const doc = { hidden: false, documentElement: { getAttribute: () => mode }, addEventListener: (k, cb) => { listeners[k] = cb; }, removeEventListener: k => { delete listeners[k]; } };
  const video = { paused: true, attributes: {}, playbackRate: 1,
    getAttribute(k) { return this.attributes[k]; }, removeAttribute(k) { delete this.attributes[k]; },
    set src(v) { this.attributes.src = v; }, load() { loads++; },
    play() { plays++; if (refusal) return Promise.reject(Object.assign(new Error('Browser policy'), { name: refusal })); this.paused = false; this.props.onPlay(); return Promise.resolve(); },
    pause() { this.paused = true; this.props?.onPause(); },
  };
  const React = {
    useRef(value) { const i = cursor++; if (!mounted) slots[i] = { current: value }; return slots[i]; },
    useState(value) { const i = cursor++; if (!mounted) slots[i] = typeof value === 'function' ? value() : value; return [slots[i], next => { slots[i] = typeof next === 'function' ? next(slots[i]) : next; }]; },
    useEffect(effect) { if (!mounted) effects.push(effect); },
    createElement(type, props, ...children) { const n = { type, props: props || {}, children: children.flat(Infinity) }; if (props?.ref) props.ref.current = type === 'video' ? video : {}; if (type === 'video') video.props = n.props; return n; },
  };
  const context = { exports: {}, document: doc, window: { matchMedia: () => media, addEventListener: (k, cb) => { listeners[k] = cb; }, removeEventListener: k => { delete listeners[k]; } },
    IntersectionObserver: class { constructor(callback) { observer = callback; } observe() {} disconnect() {} },
    require(name) { if (name === 'react') return React; if (name.includes('exerciseMotion.js')) return { exerciseMotionFor: () => null, claimMotionPlayer: () => { claimed++; }, releaseMotionPlayer: () => { released++; } }; return {}; },
  };
  vm.runInNewContext(code, context);
  const render = () => { cursor = 0; tree = context.Player({ motion: { src: '/exact-reviewed.mp4', poster: '/exact-reviewed.png' }, theme: {}, L: (cz) => cz, autoPlay }); return tree; };
  render(); mounted = true;
  const cleanups = effects.map(effect => effect());
  const walk = n => n && typeof n === 'object' ? [n, ...(n.children || []).flatMap(walk)] : [];
  return { render, video, visible: value => observer([{ isIntersecting: value }]),
    hidden() { doc.hidden = true; listeners.visibilitychange(); }, reduced() { media.matches = true; mediaListeners.change(); },
    close() { walk(render()).find(n => n.props['aria-label'] === 'Zavřít pohybovou ukázku').props.onClick(); },
    toggle() { walk(render()).find(n => n.type === 'button' && ['Přehrát', 'Pozastavit', '▷ '].includes(n.children[0])).props.onClick(); },
    unmount() { cleanups.forEach(fn => fn?.()); },
    stats: () => ({ claimed, released, plays, loads }),
    statuses: () => walk(render()).filter(n => n.props.role === 'status'),
    open: () => !walk(render()).find(n => n.type === 'div' && Object.hasOwn(n.props, 'hidden')).props.hidden,
  };
}

test('eligible detail opens the exact clip once when visible; scrolling back does not restart a paused demonstration', async () => {
  const h = harness(); assert.equal(h.open(), true); assert.equal(h.stats().plays, 0);
  h.visible(true); await new Promise(resolve => setImmediate(resolve)); assert.equal(h.video.getAttribute('src'), '/exact-reviewed.mp4'); assert.equal(h.video.paused, false);
  h.visible(false); assert.equal(h.video.paused, true); h.visible(true); assert.equal(h.stats().plays, 1); h.unmount();
});
test('reduced motion, app motion off, and explicit manual mode never assign or autoplay media', () => {
  for (const options of [{ reduced: true }, { mode: 'off' }, { autoPlay: false }]) {
    const h = harness(options); h.visible(true); assert.equal(h.open(), false); assert.equal(h.stats().plays, 0); assert.equal(h.video.getAttribute('src'), undefined); h.unmount();
  }
});
test('browser autoplay refusal leaves a playable open control without reporting a network error', async () => {
  const h = harness({ refusal: 'NotAllowedError' }); h.visible(true); await new Promise(resolve => setImmediate(resolve));
  assert.equal(h.open(), true); assert.equal(h.video.paused, true); assert.equal(h.statuses().length, 0); h.toggle(); await new Promise(resolve => setImmediate(resolve)); assert.equal(h.stats().plays, 2); h.unmount();
});
test('closing releases and unloads the clip, even if a previous play promise resolves later', async () => {
  const h = harness(); h.visible(true); h.close(); await new Promise(resolve => setImmediate(resolve));
  assert.equal(h.video.paused, true); assert.equal(h.video.getAttribute('src'), undefined); assert.equal(h.open(), false); assert.equal(h.stats().released, 1); h.visible(true); assert.equal(h.stats().plays, 1); h.unmount();
});
test('tab hiding, newly reduced motion and unmount stop active playback', async () => {
  for (const action of ['hidden', 'reduced', 'unmount']) {
    const h = harness(); h.visible(true); await new Promise(resolve => setImmediate(resolve)); h[action](); assert.equal(h.video.paused, true);
    if (action === 'unmount') assert.equal(h.video.getAttribute('src'), undefined); else h.unmount();
  }
});
test('load failure is reported and the user can retry explicitly', async () => {
  const h = harness({ refusal: 'NetworkError' }); h.visible(true); await new Promise(resolve => setImmediate(resolve)); assert.equal(h.statuses().length, 1); h.toggle(); await new Promise(resolve => setImmediate(resolve)); assert.equal(h.stats().plays, 2); h.unmount();
});
