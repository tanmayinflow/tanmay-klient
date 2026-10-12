import {test} from 'node:test';
import assert from 'node:assert/strict';
import {APPEARANCE_PRESET_IDS,pwaThemeColor,resolveTheme} from '../src/shared/ui/themeRegistry.js';
import {applyDocumentTheme} from '../src/shared/ui/appearance.js';

function fakeDocument() {
  const attrs={},meta={};
  return {attrs,meta,documentElement:{setAttribute:(k,v)=>{attrs[k]=v;},style:{setProperty(k,v){this[k]=v;}}},
    body:{style:{}},querySelector:()=>({setAttribute:(k,v)=>{meta[k]=v;}})};
}

test('root canvas and body follow the actual field through all eight theme transitions',()=>{
  const doc=fakeDocument();
  for(const id of [...APPEARANCE_PRESET_IDS,...APPEARANCE_PRESET_IDS].reverse()) {
    applyDocumentTheme(id,false,doc);
    assert.equal(doc.documentElement.style.backgroundColor,resolveTheme(id,false).background,id+' opaque root');
    assert.equal(doc.body.style.background,resolveTheme(id,false).background,id+' body');
    assert.equal(doc.meta.content,pwaThemeColor(id,false),id+' browser chrome keeps its own color');
    assert.equal(doc.attrs['data-appearance'],id);
  }
});

test('changing theme while a sheet locks the body preserves the lock and its scroll offset',()=>{
  const doc=fakeDocument();
  doc.attrs['data-tm-scroll-locked']='true';
  Object.assign(doc.body.style,{position:'fixed',top:'-517px',overflow:'hidden'});
  applyDocumentTheme('landscape-day',false,doc);
  applyDocumentTheme('landscape-night',false,doc);
  assert.equal(doc.attrs['data-tm-scroll-locked'],'true');
  assert.equal(doc.body.style.position,'fixed');assert.equal(doc.body.style.top,'-517px');assert.equal(doc.body.style.overflow,'hidden');
  assert.equal(doc.documentElement.style.backgroundColor,'#1C1C1A');
});
