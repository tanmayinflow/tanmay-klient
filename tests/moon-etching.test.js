import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import vm from 'node:vm';

const here = dirname(fileURLToPath(import.meta.url));
const app = existsSync(resolve(here, '../package.json')) ? resolve(here, '..') : resolve(here, '../../../Source/tanmay-web');
const source = existsSync(resolve(here, '../src/shared/ui/moonEtching.jsx')) ? resolve(here, '../src/shared/ui/moonEtching.jsx') : resolve(here, '../ui/moonEtching.jsx');
const require = createRequire(resolve(app, 'package.json'));
const ts = require('typescript'), React = require('react'), {renderToStaticMarkup} = require('react-dom/server');
const code = ts.transpileModule(readFileSync(source,'utf8'), {compilerOptions:{jsx:ts.JsxEmit.React,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
const module = {exports:{}};
new vm.Script(`(function(require,module,exports){${code}\n})`, {filename:source}).runInThisContext()(require,module,module.exports);
const {moonLitOutline, MoonArt} = module.exports;
const points = phase => moonLitOutline(phase).split(' ').map(pair=>pair.split(',').map(Number));
const area = phase => Math.abs(points(phase).reduce((sum,[x,y],i,rows) => {
  const [nextX,nextY] = rows[(i+1)%rows.length]; return sum + x*nextY-nextX*y;
},0)/2);

test('engraved moon has zero/full illumination at new/full and the correct quarter orientation',()=>{
  const full = area(.5);
  assert.ok(area(0)<1e-6);
  assert.ok(Math.abs(full-Math.PI*46*46)/(Math.PI*46*46)<.01);
  assert.ok(Math.abs(area(.25)/full-.5)<1e-6);
  assert.ok(Math.abs(area(.75)/full-.5)<1e-6);
  assert.ok(points(.25).every(([x])=>x>=-1e-10),'waxing first quarter is lit on the right');
  assert.ok(points(.75).every(([x])=>x<=1e-10),'waning last quarter is lit on the left');
});
test('lunar illumination changes continuously with phase and safely wraps the cycle',()=>{
  assert.ok(area(.125)>0 && area(.125)<area(.25));
  assert.ok(area(.375)>area(.25) && area(.375)<area(.5));
  assert.ok(Math.abs(area(.875)-area(.125))<1e-8);
  assert.equal(moonLitOutline(-.25),moonLitOutline(.75));
  assert.equal(moonLitOutline(1.25),moonLitOutline(.25));
  for(const invalid of [undefined,NaN,Infinity,-Infinity]) assert.equal(moonLitOutline(invalid),moonLitOutline(.5));
  for(const phase of [0,.001,.125,.25,.499,.5,.75,.999,1]) assert.ok(points(phase).every(pair=>pair.every(Number.isFinite)));
});
test('multiple moon drawings retain independent clipping and accessible parent semantics',()=>{
  const html = renderToStaticMarkup(React.createElement(React.Fragment,null,
    React.createElement(MoonArt,{phase:.25}),React.createElement(MoonArt,{phase:.75})));
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(item=>item[1]);
  assert.equal(new Set(ids).size,ids.length,'SVG fragment ids must not collide');
  const references = [...html.matchAll(/(?:href="#|url\(#)([^")]+)/g)].map(item=>item[1]);
  assert.ok(references.length>0);
  for(const id of references) assert.ok(ids.includes(id),`missing SVG definition: ${id}`);
  assert.equal((html.match(/aria-hidden="true"/g)||[]).length,2,'the labelled MoonCompanion button owns the accessible text');
  assert.ok(html.includes('href="/media/icons/moon-handdrawn-v2.png"'));
  assert.ok(!/filter=|https?:/.test(html),'engraving has no remote image or expensive blur dependency');
});
