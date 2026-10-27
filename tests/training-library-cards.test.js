import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';

const inApp = fs.existsSync(new URL('../src/shared/ui/trainingLibraryCards.jsx', import.meta.url));
const require = createRequire(inApp ? import.meta.url : new URL('../../../Source/tanmay-web/package.json', import.meta.url));
const React = require('react'), ts = require('typescript');
const {renderToStaticMarkup} = require('react-dom/server');
const file = new URL(inApp ? '../src/shared/ui/trainingLibraryCards.jsx' : '../ui/trainingLibraryCards.jsx', import.meta.url);
function load(react = React) {
  const module = {exports:{}};
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {compilerOptions:{jsx:ts.JsxEmit.React, module:ts.ModuleKind.CommonJS, target:ts.ScriptTarget.ES2022, esModuleInterop:true}}).outputText;
  vm.runInThisContext(`(function(require,module,exports){${code}\n})`)(id => {
    if (id === 'react') return react;
    if (id === '../lang/lang.js') return {L:(cs,en) => en};
    if (id === './type.js') return {FONT_BODY:'sans-serif'};
    throw Error('Unexpected import '+id);
  }, module, module.exports);
  return module.exports;
}
const t = {border:'#999',text:'#222',textMuted:'#666'};
const items = Array.from({length:402}, (_,i) => ({id:'workout-'+i}));
const renderCard = item => React.createElement('button', {key:item.id,'data-workout':item.id}, item.id);
function children(node) {
  if (!node || typeof node !== 'object') return [];
  return [node, ...React.Children.toArray(node.props?.children).flatMap(children)];
}

test('opening a saved full-library list mounts only the first page of cards', () => {
  const {TrainingLibraryCards} = load();
  let rendered = 0;
  const html = renderToStaticMarkup(React.createElement(TrainingLibraryCards, {items,t,renderCard:item => {rendered++; return renderCard(item);}}));
  assert.equal(rendered,24);
  assert.match(html,/24 of 402/);
  assert.match(html,/Load more 24/);
  assert.ok(!html.includes('data-workout="workout-24"'));
});

test('load more retains order; search outside the first page and changed sort reset immediately', () => {
  let state;
  const react = {...React,useState:initial => [state ??= initial,next => {state=next;}]};
  const {TrainingLibraryCards} = load(react);
  const render = rows => TrainingLibraryCards({items:rows,t,renderCard});
  const visible = tree => children(tree).filter(node => node.props?.['data-workout']).map(node => node.props['data-workout']);
  let tree = render(items);
  children(tree).find(node => node.type === 'button' && node.props.onClick).props.onClick();
  tree = render([...items]);
  assert.deepEqual(visible(tree),items.slice(0,48).map(item=>item.id));
  assert.deepEqual(visible(render([items[401]])),['workout-401']);
  assert.equal(children(render([items[401]])).filter(node => node.type === 'button' && node.props.onClick).length,0);
  assert.deepEqual(visible(render(items)),items.slice(0,24).map(item=>item.id));
  assert.deepEqual(visible(render([...items].reverse())),items.slice(-24).reverse().map(item=>item.id));
});

test('last page exposes every result once, with no unbounded load-all action', () => {
  let state;
  const {TrainingLibraryCards} = load({...React,useState:initial => [state ??= initial,next => {state=next;}]});
  const rows = items.slice(0,49);
  let tree;
  for (let i=0;i<3;i++) {
    tree=TrainingLibraryCards({items:rows,t,renderCard});
    const next=children(tree).find(node=>node.type==='button'&&node.props.onClick);
    if(i<2) {assert.ok(next);next.props.onClick();} else assert.equal(next,undefined);
  }
  const shown=children(tree).filter(node=>node.props?.['data-workout']).map(node=>node.props['data-workout']);
  assert.deepEqual(shown,rows.map(item=>item.id));
});
