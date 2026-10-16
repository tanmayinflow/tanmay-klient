import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { exerciseMotionAsset } from '../src/shared/product/exerciseMotionAsset.js';
import { EXERCISE_MOTION } from '../src/shared/product/exerciseMotion.js';
import worker from '../worker/index.js';

const clip = EXERCISE_MOTION.drep;
const bytes = fs.readFileSync(new URL(`../public${clip.src}`, import.meta.url));
const assets = { fetch: async request => {
  assert.equal(request.headers.get('Range'), null);
  assert.equal(new URL(request.url).pathname, clip.src);
  return new Response(bytes, { headers: { 'Content-Type': 'video/mp4' } });
} };
const req = (headers = {}, method = 'GET') => new Request('https://app.test' + clip.src, { method, headers });
test('motion serves exact initial, middle, open-ended and suffix byte ranges', async () => {
  for (const [range, start, end] of [['bytes=0-1', 0, 1], ['bytes=100-199', 100, 199], ['bytes=100-', 100, bytes.length - 1], ['bytes=-50', bytes.length - 50, bytes.length - 1], ['bytes=100-999999', 100, bytes.length - 1]]) {
    const response = await exerciseMotionAsset(req({ Range: range }), assets);
    assert.equal(response.status, 206);
    assert.equal(response.headers.get('Content-Range'), `bytes ${start}-${end}/${bytes.length}`);
    assert.equal(Number(response.headers.get('Content-Length')), end - start + 1);
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), bytes.subarray(start, end + 1));
  }
});
test('motion handles full/HEAD, invalid ranges and validators without fetching unrelated paths', async () => {
  for (const headers of [{}, { Range: 'bytes=0-1,4-9' }, { Range: 'bytes=0-1', 'If-Range': '"old"' }]) {
    const response = await exerciseMotionAsset(req(headers), assets);
    assert.equal(response.status, 200);
    assert.equal((await response.arrayBuffer()).byteLength, bytes.length);
  }
  const head = await exerciseMotionAsset(req({}, 'HEAD'), assets);
  assert.equal(head.headers.get('Accept-Ranges'), 'bytes');
  assert.equal(Number(head.headers.get('Content-Length')), bytes.length);
  assert.equal((await head.arrayBuffer()).byteLength, 0);
  for (const Range of ['bytes=999999-', 'bytes=8-2', 'bytes=-0']) assert.equal((await exerciseMotionAsset(req({ Range }), assets)).status, 416);
  assert.equal((await exerciseMotionAsset(req({}, 'POST'), assets)).status, 405);
  assert.equal(await exerciseMotionAsset(new Request('https://app.test/api/state'), assets), null);
});
test('motion rejects truncated, oversized and HTML asset responses', async () => {
  for (const [body, type] of [[bytes.subarray(0, 20), 'video/mp4'], [Buffer.alloc(bytes.length + 1), 'video/mp4'], ['<html>', 'text/html']]) {
    assert.equal((await exerciseMotionAsset(req(), { fetch: async () => new Response(body, { headers: { 'Content-Type': type } }) })).status, 502);
  }
});
test('actual Worker routes motion through byte-range handling', async () => {
  const response = await worker.fetch(req({ Range: 'bytes=0-1', 'cf-access-authenticated-user-email': 'coach@example.test' }), { OWNER_EMAIL: 'coach@example.test', ASSETS: assets }, {});
  assert.equal(response.status, 206);
  assert.equal((await response.arrayBuffer()).byteLength, 2);
  const config = JSON.parse(fs.readFileSync(new URL('../wrangler.jsonc', import.meta.url), 'utf8'));
  assert.ok(config.assets.run_worker_first.includes('/exercise-motion/*'));
});
