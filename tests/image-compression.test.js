import test from 'node:test';
import assert from 'node:assert/strict';
import { PHOTO_MAX_BYTES, compressPhoto, isAnimatedImage } from '../src/shared/product/imageCompression.js';
const blob = (size, type) => new Blob([new Uint8Array(size)], { type });
const jpeg = size => new File([blob(size, 'image/jpeg')], 'progress.jpeg', { type: 'image/jpeg', lastModified: 0 });
const codec = (encode, close = () => {}) => ({ decode: async () => ({ width: 4000, height: 3000, close }), encode });
const png = (animated, size = 100) => {
  const bytes = new Uint8Array(size); bytes.set([137,80,78,71,13,10,26,10]);
  bytes.set(animated ? [97,99,84,76] : [73,68,65,84], 12);
  return new File([bytes], 'transparent.png', { type: 'image/png' });
};
test('small originals and non-images do not incur decode or quality loss', async () => {
  const original = jpeg(PHOTO_MAX_BYTES), pdf = new File(['pdf'], 'paper.pdf', {type:'application/pdf'});
  const unused = { decode: () => assert.fail('must not decode') };
  assert.equal(await compressPhoto(original, unused), original);
  assert.equal(await compressPhoto(pdf, unused), pdf);
  const untyped = new File(['small'], 'progress.JPG');
  assert.equal((await compressPhoto(untyped)).type, 'image/jpeg');
});
test('large JPEG is automatically reduced below 2 decimal MB and keeps valid metadata', async () => {
  let closed = 0, calls = 0;
  const result = await compressPhoto(jpeg(3000000), codec(async (_image, options) => {
    calls++; assert.equal(options.width, 2560); assert.equal(options.height, 1920);
    return blob(options.quality > .8 ? 2200000 : 1800000, 'image/jpeg');
  }, () => closed++));
  assert.equal(calls, 2); assert.equal(closed, 1); assert.equal(result.size, 1800000);
  assert.equal(result.type, 'image/jpeg'); assert.equal(result.name, 'progress.jpeg'); assert.equal(result.lastModified, 0);
});
test('transparent PNG chooses an alpha-capable encoding and updates extension', async () => {
  const result = await compressPhoto(png(false, 2500000), codec(async (_image, options) => {
    assert.equal(options.type, 'image/webp'); return blob(1000000, 'image/webp');
  }));
  assert.equal(result.type, 'image/webp'); assert.equal(result.name, 'transparent.webp');
  await assert.rejects(compressPhoto(png(false, 2500000), codec(async () => blob(1000000, 'image/jpeg'))), /image-alpha/);
});
test('PNG fallback reduces dimensions rather than pretending quality affects lossless output', async () => {
  const widths = [];
  const result = await compressPhoto(png(false, 3000000), codec(async (_image, options) => {
    widths.push(options.width); return blob(options.width > 1920 ? 2200000 : 1700000, 'image/png');
  }));
  assert.deepEqual(widths, [2560, 1920]); assert.equal(result.name, 'transparent.png'); assert.equal(result.size, 1700000);
});
test('GIF, APNG and animated WebP never silently lose animation', async () => {
  const gif = new File(['GIF89a'], 'motion.gif', {type:'image/gif'});
  assert.equal(await compressPhoto(gif, {maxSide:1600}), gif);
  assert.equal(await isAnimatedImage(png(true)), true);
  const bytes = new Uint8Array(32);bytes.set([86,80,56,88],12);bytes[20]=2;
  assert.equal(await isAnimatedImage(new File([bytes], 'motion.webp', {type:'image/webp'})), true);
  await assert.rejects(compressPhoto(new File([blob(2100000, 'image/gif')], 'motion.gif', {type:'image/gif'})), /image-animation-too-large/);
  await assert.rejects(compressPhoto(png(true,2100000)), /image-animation-too-large/);
});
test('explicit smaller preference applies while dimensions never upscale', async () => {
  const result = await compressPhoto(jpeg(1000000), {maxSide:1600,...codec(async (_image, options) => {assert.equal(options.width,1600);return blob(500000,'image/jpeg');})});
  assert.equal(result.size,500000);
  const original = jpeg(10);
  assert.equal(await compressPhoto(original, {maxSide:5000,...codec(()=>assert.fail('no upscaling'))}),original);
});
test('decode/encode failure and unachievable cap reject without claiming compressed success', async () => {
  let closed=0;
  await assert.rejects(compressPhoto(jpeg(3000000), {decode:async()=>{throw new Error('cannot decode');}}), /image-decode/);
  await assert.rejects(compressPhoto(jpeg(3000000), codec(async()=>blob(2100000,'image/jpeg'),()=>closed++)), /image-compression-limit/);
  assert.equal(closed,1);
  await assert.rejects(compressPhoto(new File([blob(2100000,'image/svg+xml')],'drawing.svg',{type:'image/svg+xml'})), /image-format-too-large/);
});

for (const failureMode of ['decode', 'encode', 'timeout']) {
  test(`browser image fallback revokes its URL after ${failureMode} failure and preserves the source`, async t => {
    const original = jpeg(2100000), revoked = [], timers = new Map();
    const saved = Object.fromEntries(['Image', 'createImageBitmap'].map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
    t.after(() => {
      for (const key of Object.keys(saved)) {
        if (saved[key]) Object.defineProperty(globalThis, key, saved[key]);
        else delete globalThis[key];
      }
    });
    Object.defineProperty(globalThis, 'createImageBitmap', { configurable: true, value: async () => { throw new Error('bitmap unavailable'); } });
    Object.defineProperty(globalThis, 'Image', { configurable: true, value: class {
      width = 4000;
      height = 3000;
      set src(value) {
        if (!value || failureMode === 'timeout') return;
        queueMicrotask(() => failureMode === 'decode' ? this.onerror() : this.onload());
      }
    } });
    t.mock.method(URL, 'createObjectURL', file => { assert.equal(file, original); return 'blob:photo-under-test'; });
    t.mock.method(URL, 'revokeObjectURL', url => revoked.push(url));
    t.mock.method(globalThis, 'setTimeout', (run, delay) => { assert.equal(delay, 30000); timers.set(1, run); return 1; });
    t.mock.method(globalThis, 'clearTimeout', id => timers.delete(id));
    const result = assert.rejects(compressPhoto(original, { encode: async () => { throw new Error('encoder failed'); } }), { code: 'image-decode' });
    if (failureMode === 'timeout') {
      await new Promise(resolve => setImmediate(resolve));
      assert.equal(timers.size, 1);
      timers.get(1)();
    }
    await result;
    assert.deepEqual(revoked, ['blob:photo-under-test']);
    assert.equal(timers.size, 0);
    assert.equal(original.name, 'progress.jpeg');
    assert.equal(original.type, 'image/jpeg');
    assert.equal(original.size, 2100000);
    assert.equal((await original.slice(0, 1).arrayBuffer()).byteLength, 1);
  });
}
