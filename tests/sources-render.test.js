import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as sourcePolicy from '../src/shared/product/sources.js';

const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
const rowSource = readFileSync(new URL('../src/shared/ui/sources.jsx', import.meta.url), 'utf8');
const compile = source => ts.transpileModule(source, {compilerOptions: {
  jsx: ts.JsxEmit.React, module: ts.ModuleKind.CommonJS,
  target: ts.ScriptTarget.ES2022, esModuleInterop: true,
}}).outputText;
const theme = {accent: '#654', heading: '#222'};
const noop = () => null;
const useT = () => ({t: theme});
const L = (cs) => cs;
const verified = [];
// Use the real application adapter, rather than a permissive PinDot mock.
const pinSource = app.slice(app.indexOf('function PinDot('), app.indexOf('function PinToggle('));
assert.ok(pinSource.includes('function PinDot('));
const PinDot = vm.runInNewContext(compile(pinSource) + '\nPinDot;', {
  React, useT, L,
  entryFileIds: entry => (entry.att || []).map(file => file.id),
  useVerifiedPin: (id, ids) => { verified.push({id, ids}); return [false]; },
});
const module = {exports: {}};
vm.runInNewContext(compile(rowSource), {module, exports: module.exports, require: id => {
  if (id === 'react') return React;
  if (id.endsWith('/sources.js')) return sourcePolicy;
  return {SourceLinks: noop, TmIcon: noop, SourceCover: noop};
}});
const {ContentRow} = module.exports.createSourcesUI({
  useT, useStore: () => ({reorderEntry: noop}), L, LV: value => value, hexA: value => value,
  useHoldReorder: () => false, PinDot, Tag: noop, imgSrc: value => value, typeGlyph: () => noop,
  C_TYPE_LABEL: value => value, C_PROG_LABEL: value => value,
  C_TYPE_COLOR: {}, C_PROG_COLOR: {}, C_CAT_LABEL: value => value,
});

for (const origin of [sourcePolicy.SOURCE_ORIGIN.CLIENT, sourcePolicy.SOURCE_ORIGIN.COACH]) {
  test(`Sources row renders with the actual app offline indicator (${origin})`, () => {
    for (const att of [[], [{id: 'source-audio', r2: true}]]) {
      const entry = {id: 'source-regression', title: 'Test source', type: 'Book', origin, att};
      const before = JSON.stringify(entry);
      const html = renderToStaticMarkup(React.createElement(ContentRow, {e: entry, onOpen: noop, noDrag: true}));
      assert.match(html, /Test source/);
      assert.equal(verified.at(-1).id, entry.id);
      assert.deepEqual(verified.at(-1).ids, att.map(file => file.id));
      assert.equal(JSON.stringify(entry), before);
    }
  });
}
