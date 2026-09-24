// Browser regression for the eight themes sharing Landscape construction.
// Run against isolated fixture data, never a live account.
import assert from 'node:assert/strict';
import { createServer } from './server.mjs';
import { APPEARANCE_PRESETS, DEFAULT_PRESET } from '../../src/shared/ui/themeRegistry.js';
let chromium;
try { ({chromium} = await import('playwright-core')); }
catch { console.log('SKIP: playwright-core unavailable'); process.exit(0); }
const srv=createServer(), port=Number(process.env.PORT||8951);
await new Promise(r=>srv.listen(port,r));
let browser;
try {
  browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--no-sandbox']});
  for(const width of [390,440,1440]) for(const preset of APPEARANCE_PRESETS) {
    const context=await browser.newContext({viewport:{width,height:956}});
    try {
      const page=await context.newPage(), errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      await page.addInitScript(id=>{
        localStorage.setItem('tm-appearance-v3',JSON.stringify({version:5,preset:id,signature:'signature-day'}));
        localStorage.setItem('tmGuideVersion','999');localStorage.setItem('tm-lang','cs');
      },preset.id);
      await page.goto('http://localhost:'+port);
      await page.locator('.tm-page-title').waitFor();
      const before=await page.evaluate(()=>({id:document.documentElement.dataset.appearance,grammar:document.documentElement.dataset.frameGrammar,
        width:innerWidth,scroll:document.documentElement.scrollWidth,art:getComputedStyle(document.querySelector('.tm-page-title'),'::before').maskImage}));
      assert.equal(before.id,preset.id);assert.equal(before.grammar,'landscape');assert.ok(before.scroll<=before.width);
      assert.notEqual(before.art,'none');
      if(width<=820) await page.getByRole('button',{name:/Nabídka Vše/}).click();
      await page.getByRole('button',{name:'Nastavení',exact:true}).click();
      await page.getByRole('button',{name:'Vzhled',exact:true}).click();
      assert.equal(await page.getByRole('radio').count(),8);
      const sheet=await page.locator('.tm-cs').boundingBox();assert.ok(sheet.x>=-1 && sheet.x+sheet.width<=width+1);
      const edge=await page.locator('.tm-cs-head').evaluate(el=>getComputedStyle(el,'::after').maskImage);
      assert.ok(edge.includes('edge-wide.png'));
      if(preset.id!==DEFAULT_PRESET) {
        await page.getByRole('button',{name:'Použít výchozí vzhled'}).click();
        await page.locator('html[data-appearance="landscape-day"]').waitFor();
      }
      assert.deepEqual(errors,[]);console.log('PASS',width,preset.id);
    } finally { await context.close(); }
  }
} finally { if(browser)await browser.close(); await new Promise(r=>srv.close(r)); }
