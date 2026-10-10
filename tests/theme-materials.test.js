import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {APPEARANCE_PRESETS} from '../src/shared/ui/themeRegistry.js';
import {MATERIAL_RECIPES,themeMaterialVars} from '../src/shared/ui/themeMaterials.js';
import {composite,contrast,parseColor} from '../src/shared/ui/contrast.js';

// Every distinct decoded RGB pixel from the unchanged production photographs.
// A hash pins the samples so replacing an image cannot silently bypass contrast.
const textures=JSON.parse(readFileSync(new URL('./material-pixels.json',import.meta.url),'utf8'));
test('material pixel samples correspond to the actual production assets',()=>{
  for(const [name,texture]of Object.entries(textures)){
    const bytes=readFileSync(new URL('../public/media/landscape/'+name+'.webp',import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'),texture.sha256,name);
    assert.ok(texture.pixels.split(' ').length>100,name+' keeps photographic variation');
  }
});

for(const preset of APPEARANCE_PRESETS){
  test(preset.id+': natural materials stay visible and actual pixels retain readable text',()=>{
    const p=preset.palette,r=MATERIAL_RECIPES[preset.id],vars=themeMaterialVars(preset.id,p);
    const roles=[
      ['field','--land-field',[p.text,p.textSecondary,p.textMuted,p.placeholder,p.link]],
      ['card','--land-card-material',[p.text,p.textSecondary,p.textMuted,p.placeholder]],
      ['panel','--land-panel-material',[p.text,p.textSecondary,p.textMuted,p.placeholder]],
      ['navigation','--land-nav-material',[p.navText,p.navTextSec,p.navMuted]],
      ['header','--land-header-material',[r.headerInk]],
    ];
    for(const [role,key,inks]of roles){
      const css=vars[key],name=css.match(/landscape\/([a-z]+)\.webp/)[1];
      assert.ok(['linen','ashes','earth'].includes(name));
      const tint=css.match(/rgba\([^)]+\)/)?.[0],veil=tint?parseColor(tint).a:0;
      assert.ok(veil<=(role==='header'?.85:.65),role+' must not disappear behind an opaque wash');
      for(const pixel of textures[name].pixels.split(' ')){
        const painted=tint?composite(tint,pixel):pixel;
        for(const ink of inks)assert.ok(contrast(ink,painted,painted)>=4.5,`${role}: ${ink} on ${painted}`);
      }
    }
    assert.ok(!/wood|felt|filter\(/.test(JSON.stringify(vars)));
  });
}
