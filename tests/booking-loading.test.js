import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = fs.readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
const ast = ts.createSourceFile('App.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const client = source.includes('function useBkc(');
const hookName = client ? 'useBkc' : 'useBkLoad';
const selected = new Set([hookName, 'BkcRezervace', 'BkcKrok', 'PageTerminy']);
const code = ast.statements.filter(n => ts.isFunctionDeclaration(n) && selected.has(n.name?.text))
  .map(n => n.getText(ast)).join('\n');

// Execute the production hook/component with deterministic render/effect commits.
// A changed component type means React remounts its children, including slot reads.
function harness(fetcher = () => new Promise(() => {})) {
  let cursor = 0;
  const cells = [], effects = [];
  const equal = (a, b) => a && b && a.length === b.length && a.every((v, i) => Object.is(v, b[i]));
  const useState = initial => {
    const i = cursor++;
    if (!(i in cells)) cells[i] = typeof initial === 'function' ? initial() : initial;
    return [cells[i], value => { cells[i] = typeof value === 'function' ? value(cells[i]) : value; }];
  };
  const React = {
    useRef(initial) { const i = cursor++; return cells[i] ||= { current: initial }; },
    useCallback(fn, deps) {
      const i = cursor++;
      if (!equal(cells[i]?.deps, deps)) cells[i] = { fn, deps };
      return cells[i].fn;
    },
    useEffect(fn, deps) {
      const i = cursor++;
      if (!equal(cells[i]?.deps, deps)) effects.push(() => {
        cells[i]?.cleanup?.();
        cells[i] = { deps, cleanup: fn() };
      });
    },
    createElement(type, props, ...children) { return { type, props: props || {}, children }; },
  };
  const context = {
    React, useState, useT: () => ({ t: {} }), bkcFetch: fetcher, bkFetch: fetcher,
    L: cs => cs, LANG: 'cs', FONT_TAG: '', FONT_BODY: '', FONT_DISPLAY: '', hexA: () => '',
    FamilyIcon() {}, BkcSloty() {}, BkcHlaska() {}, bkcBtn: () => ({}), bkcName: x => x?.nameCs,
    bkcCredits: x => x, bkcWhen: () => 'termín', BK: { CONFIRMATION_COPY: { AUTO: { cs: '' } } },
    useGuideAction() {}, PageTitle() {}, TmIcTerminy() {}, Prazdno() {}, EmptyRoomArt() {},
    BkcTermin() {}, BkcKniha() {}, BkcDetail() {}, pProse: () => ({}),
  };
  vm.createContext(context);
  vm.runInContext(ts.transpileModule(code, { compilerOptions: { jsx: ts.JsxEmit.React, target: ts.ScriptTarget.ES2022 } }).outputText, context);
  return {
    context,
    render(name, ...args) { cursor = 0; const result = context[name](...args); while (effects.length) effects.shift()(); return result; },
    unmount() { for (const cell of cells) cell?.cleanup?.(); },
  };
}
const tick = () => new Promise(resolve => setImmediate(resolve));
function deferredReads() {
  const reads = [];
  return { reads, fetcher(path) { return new Promise((resolve, reject) => reads.push({ path, resolve, reject })); } };
}

function findNodes(node, type) {
  if (Array.isArray(node)) return node.flatMap(child => findNodes(child, type));
  if (!node || typeof node !== 'object') return [];
  return [...(node.type === type ? [node] : []), ...findNodes(node.children, type)];
}
function renderedText(node) {
  if (Array.isArray(node)) return node.map(renderedText).join(' ');
  if (node && typeof node === 'object') return renderedText(node.children);
  return typeof node === 'string' || typeof node === 'number' ? String(node) : '';
}

if (client) test('an unlinked member sees an honest booking state without account reads or an invented balance', async () => {
  const { reads, fetcher } = deferredReads();
  const h = harness(fetcher);
  h.render('PageTerminy');
  assert.deepEqual(reads.map(r => r.path), ['/booking/context']);
  reads[0].resolve({ ok: true, enabled: false, reason: 'NO_CLIENT' }); await tick();
  const view = h.render('PageTerminy');
  assert.equal(reads.length, 1, 'no bookings/credits request before a booking account exists');
  const [empty] = findNodes(view, h.context.Prazdno);
  assert.match(empty.props.fakt, /Rezervace pro tebe zatím nejsou otevřené/);
  assert.equal(empty.props.pozvani, 'Domluv se s Kryštofem.');
  assert.equal(empty.props.mark.type, h.context.EmptyRoomArt);
  assert.equal(empty.props.mark.props.room, 'terminy');
  assert.ok(findNodes(view, 'div').some(node => node.props['data-guide'] === 'terminy.calendar' && node.children.includes(empty)));
  assert.doesNotMatch(renderedText(view), /Zůstatek/);
  assert.equal(findNodes(view, h.context.BkcHlaska).length, 0);
  assert.equal(findNodes(view, h.context.BkcKniha).length, 0);
  h.unmount();
});

if (client) test('a linked account reads its bookings after context, even without available credit', async () => {
  const { reads, fetcher } = deferredReads();
  const h = harness(fetcher);
  h.render('PageTerminy');
  reads[0].resolve({ ok: true, enabled: false, reason: 'NO_CREDIT', credits: { available: 0, reserved: 1, consumed: 2 } }); await tick();
  const waiting = h.render('PageTerminy');
  assert.deepEqual(reads.map(r => r.path), ['/booking/context', '/bookings']);
  assert.match(renderedText(waiting), /Zůstatek/);
  reads[1].resolve({ ok: true, upcoming: [{ id: 'mine' }], past: [] }); await tick();
  const view = h.render('PageTerminy');
  assert.equal(findNodes(view, h.context.BkcTermin)[0].props.b.id, 'mine');
  assert.equal(findNodes(view, h.context.BkcKniha).length, 1);
  h.unmount();
});

if (client) test('context failure offers retry and does not trigger account reads before recovery', async () => {
  const { reads, fetcher } = deferredReads();
  const h = harness(fetcher);
  h.render('PageTerminy');
  reads[0].reject(new Error('offline')); await tick();
  const failed = h.render('PageTerminy');
  assert.equal(reads.length, 1);
  assert.doesNotMatch(renderedText(failed), /Zůstatek|Rezervace pro tebe zatím nejsou otevřené/);
  const [alert] = findNodes(failed, h.context.BkcHlaska);
  assert.ok(alert?.props.onRetry);
  alert.props.onRetry(); h.render('PageTerminy');
  assert.deepEqual(reads.map(r => r.path), ['/booking/context', '/booking/context']);
  reads[1].resolve({ ok: true, enabled: true, credits: { available: 4, reserved: 0 } }); await tick();
  const ready = h.render('PageTerminy');
  assert.equal(reads[2].path, '/bookings');
  assert.match(renderedText(ready), /Rezervovat/);
  h.unmount();
});

if (client) test('booking failure retries the context first and clears stale account content if its link disappears', async () => {
  const { reads, fetcher } = deferredReads();
  const h = harness(fetcher);
  h.render('PageTerminy');
  reads[0].resolve({ ok: true, enabled: true, credits: { available: 4, reserved: 0 } }); await tick();
  h.render('PageTerminy');
  reads[1].reject(new Error('unavailable')); await tick();
  const failed = h.render('PageTerminy');
  findNodes(failed, h.context.BkcHlaska)[0].props.onRetry();
  h.render('PageTerminy'); h.render('PageTerminy');
  assert.deepEqual(reads.map(r => r.path), ['/booking/context', '/bookings', '/booking/context']);
  reads[2].resolve({ ok: true, enabled: false, reason: 'NO_CLIENT' }); await tick();
  const unlinked = h.render('PageTerminy');
  assert.equal(reads.length, 3);
  assert.equal(findNodes(unlinked, h.context.BkcHlaska).length, 0);
  assert.equal(findNodes(unlinked, h.context.BkcKniha).length, 0);
  assert.doesNotMatch(renderedText(unlinked), /Zůstatek|Rezervovat/);
  h.unmount();
});

if (client) test('a fast context retry refreshes bookings even when React batches its loading render', async () => {
  const { reads, fetcher } = deferredReads();
  const h = harness(fetcher);
  const context = { ok: true, enabled: true, credits: { available: 4, reserved: 0 } };
  h.render('PageTerminy');
  reads[0].resolve(context); await tick();
  h.render('PageTerminy');
  reads[1].reject(new Error('unavailable')); await tick();
  const failed = h.render('PageTerminy');
  findNodes(failed, h.context.BkcHlaska)[0].props.onRetry();
  h.render('PageTerminy');
  reads[2].resolve({ ...context }); await tick();
  h.render('PageTerminy');
  assert.deepEqual(reads.map(r => r.path), ['/booking/context', '/bookings', '/booking/context', '/bookings']);
  reads[3].resolve({ ok: true, upcoming: [{ id: 'recovered' }], past: [] }); await tick();
  const recovered = h.render('PageTerminy');
  assert.equal(findNodes(recovered, h.context.BkcHlaska).length, 0);
  assert.equal(findNodes(recovered, h.context.BkcTermin)[0].props.b.id, 'recovered');
  h.unmount();
});

test('booking reads ignore older locations, including their late failures', async () => {
  const { reads, fetcher } = deferredReads();
  const h = harness(fetcher);
  h.render(hookName, '/slots?location=studio');
  const next = h.render(hookName, '/slots?location=outdoors');
  assert.equal(next.data, null);
  reads[1].resolve({ place: 'outdoors' }); await tick();
  reads[0].reject(new Error('old location offline')); await tick();
  const result = h.render(hookName, '/slots?location=outdoors');
  assert.equal(result.data.place, 'outdoors');
  assert.equal(result.err, null);
  assert.equal(reads.length, 2);
});

test('booking clears previous slots immediately and only the latest retry wins', async () => {
  const { reads, fetcher } = deferredReads();
  const h = harness(fetcher);
  h.render(hookName, '/slots?from=one');
  reads[0].resolve({ day: 'one' }); await tick();
  assert.equal(h.render(hookName, '/slots?from=one').data.day, 'one');
  const second = h.render(hookName, '/slots?from=two');
  assert.equal(second.data, null);
  assert.equal(second.loading, true);
  second.reload();
  reads[2].resolve({ day: 'latest' }); await tick();
  reads[1].resolve({ day: 'obsolete' }); await tick();
  assert.equal(h.render(hookName, '/slots?from=two').data.day, 'latest');
  h.unmount();
});

test('ordinary parent renders do not issue more booking reads', () => {
  const { reads, fetcher } = deferredReads();
  const h = harness(fetcher);
  for (let i = 0; i < 20; i++) h.render(hookName, '/slots', ['/slots']);
  assert.equal(reads.length, 1);
  h.unmount();
});

if (client) test('booking step identity survives account refreshes and selecting a slot', () => {
  const h = harness();
  const props = { ctx: { services: [{ id: 'training', nameCs: 'Trénink', locations: [{ id: 'studio' }], confirmationMode: 'AUTO' }] } };
  const findParent = (node, type) => {
    if (!node || typeof node !== 'object') return null;
    if (node.children?.some(child => child?.type === type)) return node;
    for (const child of node.children || []) { const found = findParent(child, type); if (found) return found; }
    return null;
  };
  const first = findParent(h.render('BkcRezervace', props), h.context.BkcSloty);
  assert.ok(first);
  for (let i = 0; i < 10; i++) {
    const current = findParent(h.render('BkcRezervace', props), h.context.BkcSloty);
    assert.equal(current.type, first.type, 'slot step must not remount on an account/theme render');
  }
  first.children[0].props.onPick({ startsAt: 1234, timezone: 'Europe/Prague' });
  const chosen = findParent(h.render('BkcRezervace', props), h.context.BkcSloty);
  assert.equal(chosen.type, first.type);
  assert.equal(chosen.children[0].props.vybrany.startsAt, 1234);
});
