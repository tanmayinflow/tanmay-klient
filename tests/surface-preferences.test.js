// Canonical source: Shared/product-core/repo-tests/surface-preferences.test.js
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';

// Run against the canonical source before integration, or its generated mirror.
const mirror = new URL('../src/shared/ui/appearance.js', import.meta.url);
const source = existsSync(mirror) ? mirror : new URL('../ui/appearance.js', import.meta.url);
const appearance = await import(source);
const { SURFACE_STYLE_KEY, SURFACE_STYLE_IDS, DEFAULT_SURFACE_STYLE, APPEARANCE_KEYS,
  normalizeSurfaceStyle, readSurfaceStyle, writeSurfaceStyle, applyDocumentSurfaceStyle,
  watchSurfaceStyle, applyDocumentTheme, readAppearance } = appearance;

function memory(values = {}) {
  const data = new Map(Object.entries(values)), writes = [];
  return { data, writes, getItem: key => data.get(key) ?? null,
    setItem(key, value) { writes.push(key); data.set(key, String(value)); },
    removeItem: key => data.delete(key) };
}
function fakeDocument() {
  const attrs = {};
  return { attrs, documentElement: { setAttribute: (key, value) => { attrs[key] = value; }, style: { setProperty() {} } },
    body: { style: {} }, querySelector: () => null };
}
function withGlobals(values, run) {
  const previous = new Map(Object.keys(values).map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries(values)) Object.defineProperty(globalThis, key, { configurable: true, value });
  return Promise.resolve().then(run).finally(() => {
    for (const [key, descriptor] of previous) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  });
}

test('new and existing users without a surface preference receive veil without a migration write', () => {
  assert.equal(DEFAULT_SURFACE_STYLE, 'veil');
  for (const saved of [{}, { 'tm-appearance-v3': JSON.stringify({ version: 4, preset: 'nagtang-black' }), coll: 'private content' }]) {
    const s = memory(saved), before = [...s.data];
    assert.equal(readSurfaceStyle(s), 'veil');
    assert.deepEqual([...s.data], before);
    assert.deepEqual(s.writes, []);
  }
});

test('only four literal surface IDs are accepted', () => {
  assert.deepEqual(SURFACE_STYLE_IDS, ['original', 'veil', 'shadow', 'clear']);
  for (const id of SURFACE_STYLE_IDS) assert.equal(normalizeSurfaceStyle(id), id);
  for (const invalid of [null, undefined, '', 'VEIL', '__proto__', 'constructor', ' veil ', '"clear"', {}, ['clear'], 0, true]) {
    assert.equal(normalizeSurfaceStyle(invalid), 'veil');
    assert.equal(readSurfaceStyle(memory({ [SURFACE_STYLE_KEY]: invalid })), 'veil');
  }
});

test('each choice, including Original, survives a fresh module load and changes only its own key', async () => {
  for (const id of SURFACE_STYLE_IDS) {
    const s = memory({ coll: 'private content', 'tm-appearance-v3': JSON.stringify({ version: 4, preset: 'nagtang-black' }), 'tm-lang': 'en' });
    const before = [...s.data], theme = readAppearance(s);
    assert.equal(writeSurfaceStyle(id, s), id);
    assert.equal(s.getItem(SURFACE_STYLE_KEY), id);
    const fresh = await import(`${source.href}?reload=${id}`);
    assert.equal(fresh.readSurfaceStyle(s), id);
    assert.deepEqual(readAppearance(s), theme);
    for (const [key, value] of before) assert.equal(s.getItem(key), value, key);
    assert.deepEqual(s.writes, [SURFACE_STYLE_KEY]);
  }
});

test('corrupt writes normalize safely and independent storage areas do not share choices', () => {
  const first = memory(), second = memory();
  writeSurfaceStyle('shadow', first);
  assert.equal(readSurfaceStyle(second), 'veil');
  writeSurfaceStyle('unknown', second);
  assert.equal(readSurfaceStyle(second), 'veil');
  assert.equal(readSurfaceStyle(first), 'shadow');
});

test('quota failure keeps the live choice through theme changes and does not delete content', async () => {
  const s = memory({ [SURFACE_STYLE_KEY]: 'original', coll: 'private content' }), doc = fakeDocument();
  s.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); };
  await withGlobals({ localStorage: s, document: doc }, () => {
    assert.equal(writeSurfaceStyle('clear'), 'clear');
    assert.equal(doc.attrs['data-surface-style'], 'clear');
    assert.equal(readSurfaceStyle(), 'clear');
    applyDocumentTheme('nagtang-black', false, doc);
    assert.equal(doc.attrs['data-surface-style'], 'clear');
    assert.equal(doc.attrs['data-appearance'], 'nagtang-black');
    assert.equal(s.getItem(SURFACE_STYLE_KEY), 'original');
    assert.equal(s.getItem('coll'), 'private content');
    s.removeItem(SURFACE_STYLE_KEY);
    assert.equal(readSurfaceStyle(), 'veil', 'account clearing invalidates the previous session choice');
  });
});

test('blocked reads and writes remain usable during the session without throwing', () => {
  const unavailable = { getItem() { throw new Error('Blocked'); }, setItem() { throw new Error('Blocked'); } };
  assert.equal(readSurfaceStyle(unavailable), 'veil');
  assert.equal(writeSurfaceStyle('shadow', unavailable), 'shadow');
  assert.equal(readSurfaceStyle(unavailable), 'shadow');
  assert.equal(readSurfaceStyle(memory()), 'veil');
});

test('unavailable localStorage keeps the live selection until this page is closed', async () => {
  await withGlobals({ document: fakeDocument(), localStorage: undefined }, () => {
    assert.equal(writeSurfaceStyle('original'), 'original');
    applyDocumentTheme('landscape-day', false);
    assert.equal(document.attrs['data-surface-style'], 'original');
    writeSurfaceStyle('veil');
  });
});

test('surface rendering changes only its own root attribute, including normalization', () => {
  const doc = fakeDocument();
  doc.attrs['data-appearance'] = 'landscape-night';
  for (const id of [...SURFACE_STYLE_IDS, 'invalid']) {
    const expected = normalizeSurfaceStyle(id);
    assert.equal(applyDocumentSurfaceStyle(id, doc), expected);
    assert.deepEqual(doc.attrs, { 'data-appearance': 'landscape-night', 'data-surface-style': expected });
  }
  assert.doesNotThrow(() => applyDocumentSurfaceStyle('veil', {}));
});

test('storage observer ignores unrelated and foreign-area writes, handles clear, and cleans up', () => {
  const s = memory(), doc = fakeDocument(), handlers = new Map(), changes = [];
  const win = { localStorage: s, document: doc,
    addEventListener: (name, callback) => handlers.set(name, callback),
    removeEventListener: (name, callback) => { assert.equal(handlers.get(name), callback); handlers.delete(name); } };
  const unwatch = watchSurfaceStyle(value => changes.push(value), win);
  const send = event => handlers.get('storage')({ type: 'storage', storageArea: s, ...event });
  send({ key: 'coll' });
  send({ key: SURFACE_STYLE_KEY, storageArea: memory() });
  assert.deepEqual(changes, []);
  s.setItem(SURFACE_STYLE_KEY, 'shadow');
  send({ key: SURFACE_STYLE_KEY });
  assert.equal(doc.attrs['data-surface-style'], 'shadow');
  s.removeItem(SURFACE_STYLE_KEY);
  send({ key: null });
  assert.equal(doc.attrs['data-surface-style'], 'veil');
  assert.deepEqual(changes, ['shadow', 'veil']);
  unwatch();
  assert.equal(handlers.size, 0);
});

test('surface preference participates in the existing account-clear boundary', () => {
  assert.ok(APPEARANCE_KEYS.includes(SURFACE_STYLE_KEY));
  const s = memory({ coll: 'private content' });
  writeSurfaceStyle('clear', s);
  for (const key of APPEARANCE_KEYS) s.removeItem(key);
  assert.equal(readSurfaceStyle(s), 'veil');
  assert.equal(s.getItem('coll'), 'private content');
});
