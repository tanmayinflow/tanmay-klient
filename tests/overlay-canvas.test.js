import {test} from 'node:test';
import assert from 'node:assert/strict';
import {APPEARANCE_PRESET_IDS,pwaThemeColor,resolveTheme} from '../src/shared/ui/themeRegistry.js';
import {applyDocumentTheme} from '../src/shared/ui/appearance.js';
import {overlayCanvasColor} from '../src/shared/ui/color.js';

test('safe-area fallback composites the translucent scrim into an opaque canvas',()=>{
  assert.equal(overlayCanvasColor('#FFFFFF','rgba(0,0,0,0.4)'),'#999999');
  assert.equal(overlayCanvasColor('#E5D8C4','rgba(28,28,26,0.40)'),'#958D80');
  assert.equal(overlayCanvasColor('#123456','rgba(0,0,0,0)'),'#123456');
  assert.equal(overlayCanvasColor('#123456','rgb(28, 28, 26)'),'#1C1C1A');
  for(const id of APPEARANCE_PRESET_IDS){
    const theme=resolveTheme(id,false),canvas=overlayCanvasColor(theme.background,theme.overlay);
    assert.match(canvas,/^#[0-9A-F]{6}$/);
  }
});

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
