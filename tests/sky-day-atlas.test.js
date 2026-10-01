import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

const require=createRequire(import.meta.url),cache=new Map();
function jsxModule(file){
  const full=path.resolve(file);if(cache.has(full))return cache.get(full);
  const code=ts.transpileModule(fs.readFileSync(full,'utf8'),{compilerOptions:{jsx:ts.JsxEmit.React,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
  const module={exports:{}};
  new vm.Script(`(function(require,module,exports){${code}\n})`,{filename:full}).runInThisContext()(id=>id.startsWith('.')?jsxModule(path.resolve(path.dirname(full),id)):require(id),module,module.exports);
  cache.set(full,module.exports);return module.exports;
}
const {SkyDayAtlas}=jsxModule('src/shared/ui/skyDayAtlas.jsx');
const ids=['planets','changes','times','reading'];
const content=Object.fromEntries(ids.map(id=>[id,React.createElement('button',{type:'button'},`content-${id}`)]));
const render=props=>renderToStaticMarkup(React.createElement(SkyDayAtlas,{...content,...props}));

test('all four day readings have one selected tab and one visible linked panel',()=>{
  for(const lang of ['cs','en'])for(const initial of ids){
    const html=render({lang,initial});
    const tabs=[...html.matchAll(/<button\b[^>]*role="tab"[^>]*>/g)].map(match=>match[0]);
    const panels=[...html.matchAll(/<section\b[^>]*role="tabpanel"[^>]*>/g)].map(match=>match[0]);
    assert.equal(tabs.length,4);assert.equal(panels.length,4);
    assert.equal(tabs.filter(tag=>tag.includes('aria-selected="true"')).length,1);
    assert.equal(tabs.filter(tag=>tag.includes('tabindex="0"')).length,1);
    assert.equal(panels.filter(tag=>!tag.includes('hidden=""')).length,1);
    for(const tab of tabs){
      const tabId=tab.match(/\bid="([^"]+)"/)[1],panelId=tab.match(/aria-controls="([^"]+)"/)[1];
      const panel=panels.find(tag=>tag.includes(`id="${panelId}"`));
      assert.ok(panel);assert.ok(panel.includes(`aria-labelledby="${tabId}"`));
      assert.equal(!panel.includes('hidden=""'),tab.includes('aria-selected="true"'));
    }
    assert.ok(tabs.find(tag=>tag.includes('aria-selected="true"')).includes(`-tab-${initial}`));
    assert.doesNotMatch(html,/undefined|NaN/);
  }
});

test('switchable readings retain every existing content subtree and decorative plates stay silent',()=>{
  const html=render({initial:'changes'});
  for(const id of ids)assert.equal(html.split(`content-${id}`).length-1,1,id);
  const plates=[...html.matchAll(/<svg\b[^>]*class="sky-day-atlas-plate"[^>]*>/g)].map(match=>match[0]);
  assert.equal(plates.length,4);
  for(const plate of plates){assert.ok(plate.includes('aria-hidden="true"'));assert.ok(plate.includes('focusable="false"'));}
  assert.match(html,/prefers-reduced-motion:reduce/);
});

test('unknown initial selection falls back and two atlases keep distinct accessibility IDs',()=>{
  assert.match(render({initial:'removed'}),/id="[^"]+-tab-planets"[^>]*aria-selected="true"/);
  const html=renderToStaticMarkup(React.createElement(React.Fragment,null,React.createElement(SkyDayAtlas,content),React.createElement(SkyDayAtlas,content)));
  const elementIds=[...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
  assert.equal(elementIds.length,16);assert.equal(new Set(elementIds).size,16);
});
