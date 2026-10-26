import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const local = resolve(here, '..');
// Also usable before canonical synchronization; deployed mirrors test their own app.
const roots = existsSync(resolve(local, 'index.html')) ? [local] :
  ['tanmay-web','tanmay-klient'].map(name => resolve(here, '../../../Source', name));
const publicOrigin = 'https://tanmaypractice.com';
const expected = [
  ['icon-192.png',192,'any'],
  ['icon-512.png',512,'any'],
  ['icon-maskable-512.png',512,'maskable'],
];

for (const root of roots) {
  test(`${root.split(/[\\/]/).at(-1)}: install icons resolve publicly and describe real local PNG dimensions`, () => {
    const manifest = JSON.parse(readFileSync(resolve(root, 'public/manifest.webmanifest'), 'utf8'));
    assert.equal(manifest.start_url, '/');
    assert.equal(manifest.scope, '/');
    assert.equal(manifest.display, 'standalone');
    assert.equal(manifest.icons.length, expected.length);
    for (const [file,size,purpose] of expected) {
      const entry = manifest.icons.find(icon => icon.purpose === purpose && icon.sizes === `${size}x${size}`);
      assert.ok(entry, `${file}: declared purpose and size`);
      assert.equal(entry.src, `${publicOrigin}/${file}`, 'installer must not need an authenticated application cookie');
      assert.equal(entry.type, 'image/png');
      const png = readFileSync(resolve(root, 'public', file));
      assert.equal(png.subarray(0,8).toString('hex'), '89504e470d0a1a0a');
      assert.equal(png.readUInt32BE(16), size);
      assert.equal(png.readUInt32BE(20), size);
    }
  });
  test(`${root.split(/[\\/]/).at(-1)}: iOS touch icon uses the same accessible brand asset`, () => {
    const html = readFileSync(resolve(root, 'index.html'), 'utf8');
    const icons = [...html.matchAll(/<link\b[^>]*rel="apple-touch-icon"[^>]*>/g)];
    assert.equal(icons.length, 1);
    assert.match(icons[0][0], /sizes="180x180"/);
    assert.ok(icons[0][0].includes(`href="${publicOrigin}/apple-touch-icon.png"`));
    const png = readFileSync(resolve(root, 'public/apple-touch-icon.png'));
    assert.equal(png.readUInt32BE(16), 180);
    assert.equal(png.readUInt32BE(20), 180);
    assert.match(html, /rel="manifest"[^>]*crossorigin="use-credentials"/);
  });
  test(`${root.split(/[\\/]/).at(-1)}: image policy admits install assets without widening script or connection policy`, () => {
    const worker = readFileSync(resolve(root, 'worker/index.js'), 'utf8');
    const imagePolicy = worker.match(/"img-src ([^"]+)"/)?.[1];
    assert.ok(imagePolicy);
    for (const file of ['apple-touch-icon.png', ...expected.map(item => item[0])]) {
      assert.ok(imagePolicy.split(/\s+/).includes('https:') || imagePolicy.split(/\s+/).includes(`${publicOrigin}/${file}`));
    }
    assert.match(worker, /"manifest-src 'self'"/);
    const scriptPolicy = worker.match(/"script-src ([^\n]+)/)?.[1] || '';
    assert.ok(!scriptPolicy.includes("'unsafe-inline'"));
    assert.ok(!scriptPolicy.includes(publicOrigin));
    const connectPolicy = worker.match(/"connect-src ([^"]+)"/)?.[1] || '';
    assert.ok(!connectPolicy.includes(publicOrigin));
  });
}
