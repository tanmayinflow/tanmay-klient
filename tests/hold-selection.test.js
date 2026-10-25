import test from 'node:test';
import assert from 'node:assert/strict';
import { attachHoldSelection } from '../src/shared/ui/holdSelection.js';

class Events {
  listeners = new Map();
  addEventListener(name, fn) { const set = this.listeners.get(name) || new Set(); set.add(fn); this.listeners.set(name, set); }
  removeEventListener(name, fn) { this.listeners.get(name)?.delete(fn); }
  emit(name, value = {}) { const event = { cancelable: true, defaultPrevented: false, stopped: false, preventDefault() { this.defaultPrevented = true; }, stopPropagation() { this.stopped = true; }, ...value }; for (const fn of [...(this.listeners.get(name) || [])]) fn(event); return event; }
  count() { return [...this.listeners.values()].reduce((sum, set) => sum + set.size, 0); }
}
class Element extends Events {
  constructor(tag = 'div', attrs = {}, parent = null) { super(); this.tag = tag; this.attrs = attrs; this.parent = parent; this.style = {}; const names = new Set(); this.classList = { add: value => names.add(value), remove: value => names.delete(value), contains: value => names.has(value) }; }
  getAttribute(name) { return this.attrs[name] ?? null; }
  contains(node) { return node === this || !!node?.parent && this.contains(node.parent); }
  closest(query) { const match = query.split(',').some(part => { part = part.trim(); if (part.startsWith('.')) return this.classList.contains(part.slice(1)); if (part.startsWith('[')) { const [key, value] = part.slice(1, -1).split('='); return value ? this.attrs[key] === value.replaceAll('"', '') : key in this.attrs; } return part === this.tag; }); return match ? this : this.parent?.closest(query); }
}
function fixture(selected = false) {
  const win = new Events(), doc = new Events(), body = new Element(), root = new Element('div', {}, body);
  const a = new Element('button', { 'data-pick': 'a' }, root), b = new Element('button', { 'data-pick': 'b' }, root), tab = new Element('button', { 'data-tab': 'B' }, body);
  const mark = new Element('span', {}, a); mark.classList.add('tm-selmark');
  let seq = 0, removed = 0, ghostCount = 0;
  const timers = new Map(), intervals = new Map(), calls = { entered: [], paint: [], dropped: [], reordered: [], gesture: [], dragging: [] };
  Object.assign(win, { setTimeout(fn) { const id = ++seq; timers.set(id, fn); return id; }, clearTimeout(id) { timers.delete(id); }, setInterval(fn) { const id = ++seq; intervals.set(id, fn); return id; }, clearInterval(id) { intervals.delete(id); }, navigator: {} });
  Object.assign(doc, { defaultView: win, body, hidden: false, elementFromPoint: (x, y) => x > 200 ? tab : y > 50 ? b : a, querySelector: () => null, querySelectorAll: () => [a, b, tab].filter(el => el.classList.contains('tm-drop')) });
  root.ownerDocument = doc;
  const stateRef = { current: { selecting: selected, sel: selected ? ['a'] : [], sortManual: true } };
  const actionsRef = { current: {
    label: id => id, enter(id) { calls.entered.push(id); stateRef.current.selecting = true; stateRef.current.sel = [id]; },
    paint(id, add) { calls.paint.push([id, add]); const prev = stateRef.current.sel; stateRef.current.sel = add ? [...new Set([...prev, id])] : prev.filter(x => x !== id); },
    dropTab: (ids, dest) => calls.dropped.push([ids, dest]), reorder: (...args) => calls.reordered.push(args),
  } };
  const dispose = attachHoldSelection({ root, attr: 'data-pick', tabAttr: 'data-tab', stateRef, actionsRef,
    makeGhost: () => { ghostCount++; return { style: {}, remove() { removed++; } }; },
    onGesture: value => calls.gesture.push(value), onDragging: value => calls.dragging.push(value),
  });
  const touch = (x = 10, y = 10, identifier = 1) => ({ clientX: x, clientY: y, identifier });
  return { win, doc, body, root, a, b, tab, mark, calls, stateRef, dispose, timers, intervals, touch, counts: () => ({ ghostCount, removed }),
    hold(target = a) { root.emit('touchstart', { target, touches: [touch()] }); for (const [id, fn] of [...timers]) { timers.delete(id); fn(); } },
    move(x, y) { return win.emit('touchmove', { touches: [touch(x, y)] }); },
    end() { return win.emit('touchend', { changedTouches: [touch()] }); },
  };
}

test('a stationary long press enters selection without a floating copy; sweep adds notes', () => {
  const f = fixture(); f.hold();
  assert.deepEqual(f.calls.entered, ['a']); assert.equal(f.counts().ghostCount, 0);
  assert.equal(f.move(10, 80).defaultPrevented, true); assert.deepEqual(f.stateRef.current.sel, ['a', 'b']);
  f.end(); assert.equal(f.body.classList.contains('tm-nosel'), false); assert.deepEqual(f.calls.gesture, [true, false]);
  assert.equal(f.root.emit('click', { target: f.b }).defaultPrevented, false, 'another note can be selected immediately');
  assert.equal(f.root.emit('click', { target: f.a }).defaultPrevented, true, 'synthetic click must not undo the hold');
  f.dispose();
});

test('selected note lifts only after movement; window release cleans up even when touched row was replaced', () => {
  const f = fixture(true); f.hold(); assert.equal(f.counts().ghostCount, 0);
  f.move(240, 10); assert.equal(f.counts().ghostCount, 1); f.a.parent = null;
  f.end(); assert.deepEqual(f.calls.dropped, [[['a'], 'B']]); assert.equal(f.counts().removed, 1); assert.equal(f.win.count(), 0);
  f.end(); assert.equal(f.calls.dropped.length, 1); f.dispose();
});

for (const signal of ['touchcancel', 'pointercancel', 'blur', 'pagehide', 'visibilitychange', 'Escape']) {
  test(signal + ' clears the ghost and never commits the hovered destination', () => {
    const f = fixture(true); f.hold(); f.move(240, 10);
    if (signal === 'visibilitychange') { f.doc.hidden = true; f.doc.emit(signal); }
    else if (signal === 'Escape') f.win.emit('keydown', { key: 'Escape' });
    else f.win.emit(signal);
    assert.equal(f.counts().removed, 1); assert.deepEqual(f.calls.dropped, []); assert.equal(f.win.count(), 0); assert.equal(f.body.classList.contains('tm-nosel'), false);
    f.dispose();
  });
}

test('unmount cancels a pending hold and cannot arm a detached note later', () => {
  const f = fixture(); f.root.emit('touchstart', { target: f.a, touches: [f.touch()] });
  assert.equal(f.timers.size, 1); f.dispose(); assert.equal(f.timers.size, 0); assert.equal(f.win.count(), 0); assert.equal(f.root.count(), 0); assert.deepEqual(f.calls.entered, []);
});

test('unmount removes an active ghost and returns the host gesture state', () => {
  const f = fixture(true); f.hold(); f.move(30, 20); f.dispose();
  assert.equal(f.counts().removed, 1); assert.deepEqual(f.calls.gesture, [true, false]); assert.equal(f.root.count(), 0);
});

test('scroll before hold does not select or prevent native scrolling', () => {
  const f = fixture(); f.root.emit('touchstart', { target: f.a, touches: [f.touch()] });
  assert.equal(f.move(10, 40).defaultPrevented, false); assert.equal(f.timers.size, 0); assert.deepEqual(f.calls.entered, []); f.dispose();
});

test('selection marks paint once and suppress only the resulting click', () => {
  const f = fixture(true); f.root.emit('touchstart', { target: f.mark, touches: [f.touch()] }); f.move(10, 80); f.end();
  assert.deepEqual(f.calls.paint, [['a', false], ['b', false]]);
  assert.equal(f.root.emit('click', { target: f.a }).defaultPrevented, true); assert.equal(f.root.emit('click', { target: f.a }).defaultPrevented, false); f.dispose();
});

test('unrelated touch end does not finish the selected finger; a second finger cancels safely', () => {
  const f = fixture(true); f.hold(); f.move(240, 10);
  f.win.emit('touchend', { changedTouches: [f.touch(10, 10, 2)] }); assert.equal(f.counts().removed, 0);
  f.win.emit('touchmove', { touches: [f.touch(), f.touch(20, 20, 2)] }); assert.equal(f.counts().removed, 1); assert.deepEqual(f.calls.dropped, []); f.dispose();
});

test('mouse release outside the window is recovered when the next move has no pressed button', () => {
  const f = fixture(); f.root.emit('mousedown', { target: f.a, button: 0, buttons: 1, clientX: 10, clientY: 10 });
  f.win.emit('mousemove', { buttons: 1, clientX: 240, clientY: 10 }); assert.equal(f.counts().ghostCount, 1);
  f.win.emit('mousemove', { buttons: 0, clientX: 240, clientY: 10 }); assert.equal(f.counts().removed, 1); assert.deepEqual(f.calls.dropped, []); f.dispose();
});

test('editing controls never arm a row gesture', () => {
  const f = fixture(), editor = new Element('div', { contenteditable: 'true' }, f.a);
  f.root.emit('touchstart', { target: editor, touches: [f.touch()] }); assert.equal(f.timers.size, 0); assert.equal(f.win.count(), 0); f.dispose();
});

test('a new physical tap of the same note is not swallowed when the browser emitted no synthetic click', () => {
  const f = fixture(); f.hold(); f.end();
  f.root.emit('touchstart', { target: f.a, touches: [f.touch()] }); f.end();
  assert.equal(f.root.emit('click', { target: f.a }).defaultPrevented, false); f.dispose();
});
