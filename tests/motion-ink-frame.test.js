import test from 'node:test';
import assert from 'node:assert/strict';
import { tintMotionPixels } from '../src/shared/ui/motionInkFrame.js';

test('white matte and pale body fill become transparent while dark ink keeps the theme color', () => {
  for (const ink of [[28,28,26],[235,219,197],[88,106,80]]) {
    const data = new Uint8ClampedArray([255,255,255,255, 240,240,240,255, 20,20,20,255, 120,120,120,255]);
    tintMotionPixels(data,ink);
    assert.deepEqual([...data.slice(0,4)],[...ink,0]);
    assert.deepEqual([...data.slice(4,8)],[...ink,0]);
    assert.deepEqual([...data.slice(8,12)],[...ink,255]);
    assert.ok(data[15]>100 && data[15]<160);
    assert.deepEqual([...data.slice(12,15)],ink);
  }
});

test('transparent source pixels remain transparent and antialiasing remains proportional', () => {
  const data = new Uint8ClampedArray([0,0,0,0, 20,20,20,128, 235,235,235,255]);
  tintMotionPixels(data,[180,160,120]);
  assert.equal(data[3],0); assert.equal(data[7],128); assert.equal(data[11],0);
});
