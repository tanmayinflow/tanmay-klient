import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {TYPOGRAPHY_PRESETS,normalizeTypography,typographyPreset} from '../src/shared/ui/typography.js';
import {tokensCss} from '../src/shared/ui/tokens.js';
import {APPEARANCE_PRESETS,resolveTheme} from '../src/shared/ui/themeRegistry.js';
import {STACK_DISPLAY_CS,STACK_DISPLAY_EN,STACK_BODY,STACK_TAG,STACK_LOGO} from '../src/shared/ui/type.js';

test('three complete curated choices safely fall back for unknown account preferences',()=>{
  assert.deepEqual(TYPOGRAPHY_PRESETS.map(p=>p.id),['original','book','clear']);
  for(const input of [null,undefined,{},'removed','</style>'])assert.equal(normalizeTypography(input),'original');
  for(const language of ['cs','en']){
    const base=typographyPreset('original',language);
    assert.equal(base.display,language==='cs'?STACK_DISPLAY_CS:STACK_DISPLAY_EN);
    assert.equal(base.body,STACK_BODY);assert.equal(base.tag,STACK_TAG);
    assert.equal(new Set(TYPOGRAPHY_PRESETS.map(p=>typographyPreset(p.id,language).display)).size,3);
  }
});

for(const appearance of APPEARANCE_PRESETS){
  test(appearance.id+': typography is independent of color and preserves the wordmark',()=>{
    const theme=resolveTheme(appearance.id),baseline=tokensCss(theme,'cs');
    const colorVariables=css=>css.split('\n').filter(line=>line.startsWith('  --tm-')&&!line.includes('--tm-font-'));
    for(const id of ['book','clear']){
      const css=tokensCss(theme,'cs',id),type=typographyPreset(id,'cs');
      assert.deepEqual(colorVariables(css),colorVariables(baseline));
      assert.ok(css.includes('--tm-font-logo: '+STACK_LOGO+';'));
      assert.ok(css.includes('--tm-font-reading: '+type.reading+';'));
      assert.ok(css.includes('--tm-font-display: '+type.display+';'));
    }
    assert.equal(tokensCss(theme,'cs','not-valid'),baseline);
  });
}

test('pinned first-party subsets retain verified Czech glyphs and licensed derivatives',()=>{
  const files=JSON.parse(readFileSync(new URL('./typography-fonts.json',import.meta.url),'utf8'));
  const css=readFileSync(new URL('../public/fonts/editorial-fonts-v1.css',import.meta.url),'utf8');
  assert.equal(files.length,8);
  assert.ok(!css.includes('https:'));
  for(const file of files){
    const bytes=readFileSync(new URL('../public/fonts/'+file.file,import.meta.url));
    assert.equal(bytes.subarray(0,4).toString(),'wOF2');
    assert.equal(createHash('sha256').update(bytes).digest('hex'),file.sha256);
    assert.ok(file.czechGlyphs);
    assert.ok(file.family.startsWith('Tanmay '));
    assert.ok(css.includes("font-family:'"+file.family+"'"));
    assert.ok(bytes.length<80000);
  }
  for(const family of ['book-serif','book-sans','clear-sans','clear-serif']){
    const license=readFileSync(new URL('../public/fonts/'+family+'-OFL.txt',import.meta.url),'utf8');
    assert.ok(license.includes('SIL OPEN FONT LICENSE'));
  }
});
