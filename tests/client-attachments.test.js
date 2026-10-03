import test from 'node:test';
import assert from 'node:assert/strict';
import { readClientAttachmentBlob } from '../src/clientAttachments.js';

const attachment = { id: 'voice', r2: true };
function fixture(overrides = {}) {
  const state = { owner: 'own-account', status: 'ready' };
  let pinnedReads = 0;
  const blob = new Blob(['voice'], { type: 'audio/webm' });
  const response = () => new Response(blob);
  const io = {
    session: { getSnapshot: () => state, isCurrent: owner => owner === state.owner && state.status !== 'changed' },
    url: a => a.r2 ? `/api/files/${a.id}` : a.data,
    request: async () => response(),
    fetch: async () => { throw new Error('protected attachment bypassed identity guard'); },
    local: async () => blob,
    pinned: async () => { pinnedReads++; return response(); },
    ...overrides,
  };
  return { io, state, blob, pinnedReads: () => pinnedReads };
}

test('cloud export uses account request; legacy data still uses its own reader', async () => {
  const f = fixture();
  assert.equal(await (await readClientAttachmentBlob(attachment, f.io)).text(), 'voice');
  f.io.fetch = async url => { assert.equal(url, 'data:text/plain,old'); return new Response('old'); };
  assert.equal(await (await readClientAttachmentBlob({ data: 'data:text/plain,old' }, f.io)).text(), 'old');
  assert.equal(f.pinnedReads(), 0);
});

test('offline cloud media can be exported from the same account pinned cache', async () => {
  const f = fixture({ request: async () => { throw Object.assign(new Error('offline'), { code: 'offline' }); } });
  f.state.status = 'offline';
  assert.equal(await (await readClientAttachmentBlob(attachment, f.io)).text(), 'voice');
  assert.equal(f.pinnedReads(), 1);
});

test('account changes, sign-in and denied access never fall back to old pinned files', async () => {
  for (const code of ['changed', 'sign-in', 'membership']) {
    const f = fixture({ request: async () => { throw Object.assign(new Error(code), { code }); } });
    await assert.rejects(readClientAttachmentBlob(attachment, f.io), { code });
    assert.equal(f.pinnedReads(), 0);
  }
  const denied = fixture({ request: async () => new Response('', { status: 403 }) });
  await assert.rejects(readClientAttachmentBlob(attachment, denied.io), { status: 403 });
  assert.equal(denied.pinnedReads(), 0);
});

test('an account changed while reading a blob cannot complete an export', async () => {
  const f = fixture();
  f.io.request = async () => ({ ok: true, blob: async () => { f.state.owner = 'another-account'; return f.blob; } });
  await assert.rejects(readClientAttachmentBlob(attachment, f.io), { code: 'changed' });
  f.state.owner = 'own-account';
  f.io.local = async () => { f.state.status = 'changed'; return f.blob; };
  await assert.rejects(readClientAttachmentBlob({ idb: true, id: 'voice' }, f.io), { code: 'changed' });
});
