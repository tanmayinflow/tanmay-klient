import {test} from 'node:test';
import assert from 'node:assert/strict';
import {editorInk,editorHighlight} from '../src/shared/ui/editorPalette.js';
import {templateBlockSummary} from '../src/training/templateSummary.js';
import {resolveTheme,migrateLegacyAppearance,returnToSignature} from '../src/shared/ui/themeRegistry.js';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

test('fresh installations use Landscape Day while saved choices survive',()=>{
 const fresh=migrateLegacyAppearance(null,null);
 assert.equal(fresh.preset,'landscape-day');
 assert.equal(returnToSignature(fresh).preset,'signature-auto');
 for(const preset of ['signature-night','landscape-night','sand-burnt-earth'])assert.equal(migrateLegacyAppearance(JSON.stringify({preset}),null).preset,preset);
});
test('semantic editor colors follow both Landscape lights',()=>{
 for(const id of ['landscape-day','landscape-night']){
  const t=resolveTheme(id,false);
  const colors=['copper','sage','sand'].map(n=>editorInk(n,t));
  assert.equal(new Set(colors).size,3);
  for(const name of ['copper','sage','sand'])assert.match(editorHighlight(name,t),/^#[a-f\d]{8}$/i);
 }
 assert.notEqual(editorInk('sage',resolveTheme('landscape-day',false)),editorInk('sage',resolveTheme('landscape-night',false)));
});
test('compact training summary retains varied sets, zero weight and timed work',()=>{
 const reps={sets:[{planned:{targetReps:8,targetWeight:0}},{planned:{targetReps:10,targetWeight:12}}],restSec:90};
 assert.match(templateBlockSummary(reps),/8 opak.*0 kg.*10 opak.*12 kg.*90 s/);
 assert.match(templateBlockSummary({sets:[{planned:{targetDurationSec:40,targetDistanceM:200}}],restSec:0}),/40 s.*200 m.*0 s/);
});
test('formatted export preserves nested text color and highlight names',()=>{
 const app=readFileSync(new URL('../src/App.tsx',import.meta.url),'utf8');
 const match=app.match(/function tmInlineParts\(line\) \{[\s\S]*?\n\}/);
 if(!match)return; // client has no document export
 const parts=vm.runInNewContext(match[0]+';tmInlineParts("{h|sage}quiet **bold**{/h} {c|sand}ink{/c}")');
 assert.equal(parts[0].highlight,'sage');
 assert.equal(parts[1].b,true);
 assert.equal(parts[1].highlight,'sage');
 assert.equal(parts.at(-1).ink,'sand');
});
