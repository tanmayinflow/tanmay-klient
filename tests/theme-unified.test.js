import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { APPEARANCE_PRESET_IDS, APPEARANCE_PRESETS, DEFAULT_PRESET, normalizeAppearance,
  resolveTheme, documentThemeAttrs, FUNCTIONAL, STATUS_CARRIERS, statusPalette, returnToSignature } from '../src/shared/ui/themeRegistry.js';
import { readAppearance, writeAppearance, localPreviewAppearance } from '../src/shared/ui/appearance.js';
import { MATERIAL_RECIPES, themeMaterialVars } from '../src/shared/ui/themeMaterials.js';
import { contrast } from '../src/shared/ui/contrast.js';
import { landscapeCss } from '../src/shared/ui/landscapeCss.js';

const allowed = ['landscape-day','landscape-night','monument-clay','sand-burnt-earth','garnet-slate','nagtang-black','mineral-pigments','signature-day'];
const removed = ['signature-auto','signature-night','slate-clay-pantone','shikon-fossil','volcanic-grey','americano-chai','quiet-ledger-night','martang-red','sertang-gold','black-sand','deep-water'];
const store = (values = {}) => ({ getItem:k=>values[k] ?? null, setItem:(k,v)=>{values[k]=v;} });
const boot = readFileSync(new URL('../index.html', import.meta.url),'utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
function paint(values, hostname='example.com', search='') {
  const attrs = {}, style = {};
  runInNewContext(boot, { localStorage:store(values), URLSearchParams, window:{location:{hostname,search}}, document:{
    documentElement:{setAttribute:(k,v)=>{attrs[k]=v;},style:{setProperty:(k,v)=>{style[k]=v;}}},
    body:{style:{}},querySelector:()=>({setAttribute:()=>{}}),
  }});
  return attrs;
}

test('exactly eight complete themes, Landscape Day default and shared construction',()=>{
  assert.deepEqual(APPEARANCE_PRESET_IDS,allowed);
  assert.equal(DEFAULT_PRESET,'landscape-day');
  assert.equal(returnToSignature({preset:'nagtang-black'}).preset,DEFAULT_PRESET);
  assert.deepEqual(Object.keys(MATERIAL_RECIPES),allowed);
  for (const p of APPEARANCE_PRESETS) {
    assert.equal(p.chrome.frameGrammar,'landscape');
    assert.ok(p.labelCs && p.labelEn);
    assert.equal(resolveTheme(p.id,false),resolveTheme(p.id,true));
    assert.ok(contrast(p.palette.navigation,p.palette.background,p.palette.background)>=7,p.id+' dock/canvas');
    assert.ok(contrast(p.palette.heading,p.palette.background,p.palette.background)>=4.5,p.id+' heading');
    const m=themeMaterialVars(p.id,p.palette), r=MATERIAL_RECIPES[p.id];
    assert.ok(contrast(r.headerInk,r.header,r.header)>=4.5,p.id+' header');
    assert.ok(contrast(r.art,p.palette.background,p.palette.background)>=4.5,p.id+' art');
    assert.ok(m['--land-field'].includes('.webp'));
    assert.ok(!/wood|felt/.test(JSON.stringify(m)));
  }
});

test('saved retained choices survive, removed and corrupt choices fall back safely',()=>{
  for(const id of allowed) {
    const s=store({'tm-appearance-v3':JSON.stringify({version:4,preset:id})});
    assert.equal(readAppearance(s).preset,id);
    assert.equal(writeAppearance(readAppearance(s),s).preset,id);
    assert.equal(readAppearance(s).preset,id);
  }
  for(const id of removed.concat(['unknown','__proto__','constructor'])) {
    assert.equal(normalizeAppearance({preset:id}).preset,DEFAULT_PRESET,id);
  }
  assert.equal(readAppearance(store()).preset,DEFAULT_PRESET);
  assert.equal(readAppearance(store({'tm-appearance-v3':'bad json'})).preset,DEFAULT_PRESET);
  assert.equal(normalizeAppearance({preset:'sand-earth'}).preset,'sand-burnt-earth');
  assert.equal(normalizeAppearance({preset:'mulberry-paper'}).preset,'garnet-slate');
});

test('first paint matches React for all generations and does not overwrite saved choices',()=>{
  const cases = [{}, {'tm-theme':'dark'},{'tm-theme':'light'}, {'tm-appearance-v3':'invalid'}];
  for(const preset of allowed.concat(removed,['sand-earth','slate-clay','mulberry-paper','__proto__']))
    cases.push({'tm-appearance-v3':JSON.stringify({version:4,preset})});
  for(const family of ['signature','river-mist','teal-parchment','mulberry-paper','atlantic-sky','clay-alabaster','olive-gold','missing'])
    for(const mode of ['light','dark','system']) cases.push({'tm-appearance-v2':JSON.stringify({family,mode})});
  for(const values of cases) {
    const before=JSON.stringify(values), pref=readAppearance(store(values));
    assert.deepEqual(paint(values),documentThemeAttrs(pref.preset),before);
    assert.equal(JSON.stringify(values),before,'bootstrap must be read-only');
  }
});

test('preview override is restricted to loopback and valid themes',()=>{
  for(const hostname of ['example.com','127.0.0.1.evil.test']) {
    const search='?previewAppearance=nagtang-black';
    assert.equal(localPreviewAppearance({location:{hostname,search}}),null);
    assert.equal(paint({},hostname,search)['data-appearance'],DEFAULT_PRESET);
  }
  for(const id of allowed) {
    const search='?previewAppearance='+id;
    assert.equal(localPreviewAppearance({location:{hostname:'127.0.0.1',search}}),id);
    assert.equal(paint({},'127.0.0.1',search)['data-appearance'],id);
  }
  assert.equal(localPreviewAppearance({location:{hostname:'localhost',search:'?previewAppearance=wood'}}),null);
});

test('all themes share original organic assets; artwork never covers real photos',()=>{
  const css=landscapeCss();
  assert.match(css,/data-frame-grammar="landscape"/);
  assert.match(css,/edge-wide\.png/);
  assert.match(css,/\[data-source-cover="category"\]::after/);
  assert.ok(!css.includes('[data-source-cover="real"]'));
  assert.ok(!/wood|felt|polygon\(/.test(css));
  for(const id of allowed) assert.ok(css.includes(`data-appearance="${id}"`));
});

test('status meaning stays independent of decorative palette',()=>{
  for(const p of APPEARANCE_PRESETS) {
    const status=statusPalette(p.id);
    for(const role of ['success','warning','error','info']) {
      assert.equal(status[role+'Fg'],FUNCTIONAL[p.polarity][role+'Fg']);
      assert.ok(STATUS_CARRIERS[role].glyph && STATUS_CARRIERS[role].shape);
    }
  }
});
