import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const require = createRequire(import.meta.url), cache = new Map();
function jsxModule(file) {
  const full = path.resolve(file);
  if (cache.has(full)) return cache.get(full);
  const code = ts.transpileModule(fs.readFileSync(full, 'utf8'), { compilerOptions: {
    jsx: ts.JsxEmit.React, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true,
  } }).outputText;
  const module = { exports: {} };
  new vm.Script(`(function(require,module,exports){${code}\n})`, { filename: full }).runInThisContext()(
    id => id.startsWith('.') ? jsxModule(path.resolve(path.dirname(full), id)) : require(id), module, module.exports);
  cache.set(full, module.exports);
  return module.exports;
}
const { TmIcon } = jsxModule('src/shared/ui/icons.jsx');
const { createSourcesUI } = jsxModule('src/shared/ui/sources.jsx');
const { createPracticeUI } = jsxModule('src/shared/ui/practice.jsx');
const { createAtoms } = jsxModule('src/shared/ui/atoms.jsx');
const { makeWbZnameni } = jsxModule('src/shared/product/practice.js');
const t = { text: '#222', heading: '#222', textSec: '#444', textMuted: '#666', sand: '#754437', border: '#999', mode: 'light' };
const useT = () => ({ t });
const icon = id => ({ size }) => React.createElement(TmIcon, { id, size });
const sealIcons = { TmWbMiska: icon('gratitude'), TmWbDiamant: icon('bodhicitta'), TmWbKruh: icon('world-practice') };
const WB_ZNAMENI = makeWbZnameni(sealIcons);
const nothing = () => null;

test('Seals expose their current meaning and write only the same stable boolean key', () => {
  for (const lang of ['cs', 'en']) {
    const L = (cs, en) => lang === 'cs' ? cs : en;
    const { ZnameniDne } = createPracticeUI({ useT, L, WB_ZNAMENI, metaLabel: () => ({}), ...sealIcons });
    const cur = Object.freeze({ grat: true, bodhi: false, wild: true, well: 4 });
    const writes = [], hints = [];
    const tree = ZnameniDne({ cur, set: value => writes.push(value), rekni: value => hints.push(value) });
    const html = renderToStaticMarkup(tree);
    assert.ok(html.includes(L('Pečetě', 'Seals')));
    const buttons = tree.props.children[1].props.children;
    assert.equal(buttons.length, 3);
    for (const [index, button] of buttons.entries()) {
      const seal = WB_ZNAMENI[index];
      assert.equal(button.props['aria-pressed'], cur[seal.k]);
      assert.equal(button.props.title, L(seal.cz, seal.en) + ' · ' + L(seal.pCz, seal.pEn));
      button.props.onClick();
      assert.deepEqual(writes.at(-1), { [seal.k]: !cur[seal.k] });
      assert.equal(hints.at(-1), button.props.title);
    }
    assert.equal(cur.well, 4);
  }
});

test('source detail properties render small canonical icons with labels for every medium in both languages', () => {
  const mediums = { Book: 'book', Movie: 'film', Podcast: 'listen', Feed: 'stream', Article: 'article' };
  for (const lang of ['cs', 'en']) for (const [type, typeIcon] of Object.entries(mediums)) for (const origin of ['client', 'coach']) {
    const L = (cs, en) => lang === 'cs' ? cs : en;
    const entry = Object.freeze({ id: 'synthetic', title: 'Synthetic source', author: 'Synthetic author', type, category: '', score: '8', progress: 'Finished', origin });
    const before = JSON.stringify(entry);
    const rows = [];
    const { PropRow: BasePropRow } = createAtoms({ useT, L });
    const PropRow = props => { rows.push(props); return React.createElement(BasePropRow, props); };
    const deps = {
      useT, useStore: () => ({ allSources: () => [entry], editMode: false }), L, getLang: () => lang,
      hexA: value => value, PropRow, Tag: ({ label }) => React.createElement('span', null, label),
      Select: nothing, RichArea: nothing, AttachmentStrip: nothing, imgSrc: () => null,
      typeGlyph: medium => icon(mediums[medium] || 'book'), TmIcKniha: icon('book'), ClipIcon: icon('link'),
      iconBtn: () => ({}), C_PROGRESS: ['Finished'], C_PROG_LABEL: value => value, C_PROG_COLOR: {},
      C_TYPES: Object.keys(mediums), C_TYPE_LABEL: value => value, C_TYPE_COLOR: {},
      C_CATS_BY_TYPE: {}, C_CATS: [], C_CAT_LABEL: value => value,
    };
    const { ContentDetail } = createSourcesUI(deps);
    const html = renderToStaticMarkup(React.createElement(ContentDetail, { id: entry.id }));
    const expected = origin === 'coach' ? ['progress', 'people', 'quote'] : ['progress', 'people', 'star', 'calendar', 'quote', typeIcon, 'folder', 'archive'];
    assert.equal(rows.length, expected.length, `${lang}/${type}/${origin}`);
    for (const [index, row] of rows.entries()) {
      const art = renderToStaticMarkup(row.icon);
      assert.ok(art.includes(`data-tm-icon="${expected[index]}"`), row.label);
      assert.ok(art.includes('data-icon-variant="small"'));
      assert.ok(art.includes('aria-hidden="true"'));
      assert.equal(row.icon.props.size, 16);
      assert.ok(html.includes(row.label));
    }
    assert.equal(JSON.stringify(entry), before, 'rendering icons must not rewrite scores or source data');
  }
});
