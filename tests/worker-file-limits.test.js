import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker/index.js';
import { MEDIA_MAX_BYTES } from '../src/shared/product/mediaSafety.js';
import { makeEnv, req } from './helpers/env.js';

const EMAIL = 'storage-audit@example.test';
async function setup(extra = {}) {
  const env = makeEnv({ OWNER_EMAIL: EMAIL, ...extra });
  assert.equal((await worker.fetch(req('/api/join', { email: EMAIL, method: 'POST', body: { word: 'otevri se' } }), env)).status, 200);
  return env;
}
function streamedRequest(length, source, email = EMAIL) {
  const headers = { 'cf-access-authenticated-user-email': email, 'Content-Type': 'audio/webm', 'X-File-Name': 'Nahravka.webm' };
  if (length !== null) headers['Content-Length'] = String(length);
  return new Request('https://app.example.test/api/files/recording', {
    method: 'PUT', headers, body: new ReadableStream(source, { highWaterMark: 0 }), duplex: 'half',
  });
}

test('file upload above 95 MiB is rejected before reading bytes or replacing an existing file', async () => {
  let puts = 0, pulls = 0;
  const env = await setup({ FILES: { put: async () => { puts++; throw new Error('must not replace original'); } } });
  const request = streamedRequest(MEDIA_MAX_BYTES + 1, { pull(controller) { pulls++; controller.enqueue(new Uint8Array(1)); } });
  const response = await worker.fetch(request, env);
  assert.equal(response.status, 413);
  assert.deepEqual(await response.json(), { ok: false, code: 'media-too-large', error: 'file too large', limit: MEDIA_MAX_BYTES });
  assert.equal(puts, 0);
  assert.equal(pulls, 0);
  assert.equal(request.bodyUsed, false);
  await request.body.cancel();
});

test('unknown and invalid stream lengths fail explicitly before R2 receives a body', async () => {
  let puts = 0, pulls = 0;
  const env = await setup({ FILES: { put: async () => { puts++; } } });
  for (const length of [null, '', '-1', '0', '1.5', 'NaN', 'Infinity', '9007199254740992']) {
    const request = streamedRequest(length, { pull(controller) { pulls++; controller.close(); } });
    const response = await worker.fetch(request, env);
    assert.equal(response.status, length === null ? 411 : 400, String(length));
    assert.equal((await response.json()).limit, MEDIA_MAX_BYTES);
    await request.body.cancel();
  }
  assert.equal(puts, 0);
  assert.equal(pulls, 0);
});

test('exactly 95 MiB streams directly into R2 with metadata and a confirmed receipt', async () => {
  let pulls = 0, puts = 0, bytes = 0;
  const chunk = new Uint8Array(1024 * 1024);
  const request = streamedRequest(MEDIA_MAX_BYTES, {
    pull(controller) { if (++pulls <= 95) controller.enqueue(chunk); else controller.close(); },
  });
  const env = await setup({ FILES: { async put(key, body, options) {
    puts++;
    assert.match(key, /^files\/[a-z-]+\/recording$/);
    assert.equal(body, request.body, 'preserve native known-length request stream');
    assert.equal(request.bodyUsed, false, 'worker did not buffer the file');
    assert.deepEqual(options, { httpMetadata: { contentType: 'audio/webm' }, customMetadata: { name: 'Nahravka.webm' }, storageClass: 'Standard' });
    const reader = body.getReader();
    for (;;) { const next = await reader.read(); if (next.done) break; bytes += next.value.byteLength; }
    reader.releaseLock();
    return { key, size: bytes };
  } } });
  const response = await worker.fetch(request, env);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, id: 'recording' });
  assert.equal(bytes, MEDIA_MAX_BYTES);
  assert.equal(puts, 1);
  assert.equal(pulls, 96);
});

test('a small UTF-8 upload preserves original bytes and reports the file identity on download', async () => {
  const env = await setup();
  const body = 'Příloha: tělo a vědomí';
  const upload = req('/api/files/text', { email: EMAIL, method: 'PUT', body, headers: { 'Content-Type': 'text/plain' } });
  assert.equal(Number(upload.headers.get('Content-Length')), new TextEncoder().encode(body).byteLength);
  assert.equal((await worker.fetch(upload, env)).status, 200);
  const response = await worker.fetch(req('/api/files/text', { email: EMAIL }), env);
  assert.equal(response.headers.get('X-Tanmay-File'), 'text');
  assert.equal(await response.text(), body);
});

test('upload size validation never bypasses authentication', async () => {
  let puts = 0;
  const env = await setup({ FILES: { async put() { puts++; } } });
  const request = streamedRequest(MEDIA_MAX_BYTES + 1, { pull(controller) { controller.close(); } }, '');
  assert.equal((await worker.fetch(request, env)).status, 401);
  assert.equal(puts, 0);
  await request.body.cancel();
});


test('inventory returns sizes and metadata across all pages without including another account', async () => {
  const env = await setup();
  const upload = await worker.fetch(req('/api/files/first', { email: EMAIL, method: 'PUT', body: 'hello', headers: { 'Content-Type': 'audio/webm', 'X-File-Name': encodeURIComponent('Řeč.webm') } }), env);
  assert.equal(upload.status, 200);
  const firstKey = [...env.FILES._store.keys()][0], prefix = firstKey.slice(0, firstKey.lastIndexOf('/') + 1);
  for (let i=0;i<1004;i++) await env.FILES.put(prefix+'item_'+i, 'x', {httpMetadata:{contentType:'image/jpeg'}});
  await env.FILES.put('files/another-account/private','private');
  const response=await worker.fetch(req('/api/files',{email:EMAIL}),env);
  assert.equal(response.status,200);
  const {files}=await response.json();assert.equal(files.length,1005);
  const first=files.find(file=>file.id==='first');
  assert.equal(first.size,5);assert.equal(first.name,'Řeč.webm');assert.equal(first.type,'audio/webm');
  assert.ok(files.every(file=>Number.isSafeInteger(file.size)));assert.ok(!files.some(file=>file.id==='private'));
});
