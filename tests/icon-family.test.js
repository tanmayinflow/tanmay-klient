import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {ICON_ASSET_HASHES} from '../src/shared/ui/iconAssets.js';
import {ROOM_ART} from '../src/shared/ui/roomArt.js';
const require=createRequire(import.meta.url),cache=new Map();
function jsxModule(file){
 const full=path.resolve(file);if(cache.has(full))return cache.get(full);
 const source=fs.readFileSync(full,'utf8');
 const code=ts.transpileModule(source,{compilerOptions:{jsx:ts.JsxEmit.React,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const module={exports:{}};
 new vm.Script(`(function(require,module,exports){${code}\n})`,{filename:full}).runInThisContext()(
  id=>id.startsWith('.')?jsxModule(path.resolve(path.dirname(full),id)):require(id),module,module.exports);
 cache.set(full,module.exports);return module.exports;
}
const {TmIcon,TM_ICONS,tmIconId,tmResolveIcon}=jsxModule('src/shared/ui/icons.jsx');
const render=props=>renderToStaticMarkup(React.createElement(TmIcon,props));

test('every shipped icon renders at small and regular sizes without exposing decorative names',()=>{
 assert.equal(Object.keys(TM_ICONS).length,157);
 for(const id of Object.keys(TM_ICONS))for(const size of [9,16,20,24,40]){
  const html=render({id,size});assert.ok(html.includes(`data-tm-icon="${id}"`));
  assert.ok(html.includes('aria-hidden="true"'));assert.ok(!/undefined|NaN/.test(html));
 }
});
test('optical variants change at 20px and retain inherited color and accessible labels',()=>{
 assert.match(render({id:'search',size:20}),/stroke-width="2.05"/);
 assert.match(render({id:'search',size:24}),/stroke-width="1.7"/);
 assert.match(render({id:'training',size:17}),/training-icon-small-v2.png/);
 assert.match(render({id:'training',size:38}),/training-icon-v2.png/);
 for(const id of ['search','practice']){
  const html=render({id,label:'Find',style:{color:'#754437'}});
  assert.match(html,/role="img"/);assert.match(html,/aria-label="Find"/);assert.doesNotMatch(html,/aria-hidden/);
  assert.match(html,/color:#754437/);assert.match(html,/currentColor/);
 }
});
test('unknown and hostile-looking ids fall back safely while saved custom symbols remain',()=>{
 for(const id of ['missing','__proto__','constructor','<script>'])assert.match(render({id}),/data-tm-icon="bindu"/);
 assert.equal(tmIconId('missing'),null);
 assert.equal(tmIconId('constructor'),null);
 assert.equal(tmResolveIcon({icon:'🦊'},'habit').char,'🦊');
});
test('all room artwork and raster variants are exact, first-party files',()=>{
 assert.equal(Object.keys(ROOM_ART).length,10);
 for(const [file,hash] of Object.entries(ICON_ASSET_HASHES)){
  const bytes=fs.readFileSync(path.join('public/media/icons',file));
  assert.equal(createHash('sha256').update(bytes).digest('hex'),hash,file);
 }
 for(const file of Object.values(ROOM_ART))assert.ok(ICON_ASSET_HASHES[file]);
});
test('legacy standalone icon components no longer carry inline SVG drawings',()=>{
 const source=fs.readFileSync('src/App.tsx','utf8');
 const sf=ts.createSourceFile('App.tsx',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 const permitted=new Set(['TmMandalaWheel','PageAtomic','PomoOverview','KlSpark','TPatArt','view','TExArtStara','TvSetClock','TvRestStage','TvExerciseHistory','TmRing','KBGraph','TExArt']);
 const violations=[];
 function walk(n,owner=''){
  if(ts.isFunctionDeclaration(n))owner=n.name?.text||owner;
  if(ts.isVariableDeclaration(n))owner=n.name.getText(sf);
  if(ts.isJsxElement(n)&&n.openingElement.tagName.getText(sf)==='svg'&&!permitted.has(owner))violations.push(owner);
  ts.forEachChild(n,c=>walk(c,owner));
 }
 walk(sf);assert.deepEqual(violations,[]);
});
