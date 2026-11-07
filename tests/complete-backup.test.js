import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCompleteBackup, collectMediaFiles, zipBackupFiles } from '../src/shared/product/completeBackup.js';

async function unzip(blob) {
  const bytes = new Uint8Array(await blob.arrayBuffer()), view = new DataView(bytes.buffer), files = new Map(); let offset = 0;
  while (view.getUint32(offset, true) === 0x04034b50) {
    assert.equal(view.getUint16(offset + 8, true), 0);
    const size = view.getUint32(offset + 18, true), length = view.getUint16(offset + 26, true), extra = view.getUint16(offset + 28, true);
    const name = new TextDecoder().decode(bytes.slice(offset + 30, offset + 30 + length)), start = offset + 30 + length + extra;
    files.set(name, bytes.slice(start, start + size)); offset = start + size;
  }
  assert.equal(view.getUint32(offset, true), 0x02014b50); return files;
}
function fixture(overrides = {}) {
  const calls = [], coll = { notebook: [{ id: 'note', title: 'Příloha', text: '!img(image|200)', att: [{ id: 'audio', r2: true, name: 'Hlas 🌿.webm', size: 5 }] }], tv2: { sessions: [{ id: 'training', load: 52 }] } };
  return { calls, coll, options: { coll, edits: { '2026-11-06': { note: 'neodesláno' } }, role: 'client',
    textFiles: [{ path: 'Zapisnik/Cesta/Příloha.md', text: '![obrázek](/api/files/image)' }],
    getLocalFile: async id => id === 'audio' ? new Blob(['VOICE'], { type: 'audio/webm' }) : null,
    listLocalFiles: async () => [{ id: 'audio', name: 'Hlas 🌿.webm', size: 5 }],
    drafts: { list: async () => [{ id: 'draft' }], read: async () => ({ id: 'draft', type: 'audio/webm', bytes: 4, blob: new Blob(['PART']) }) },
    fetcher: async (url, init) => {
      calls.push({ url, init });
      if (url.startsWith('/api/state?')) {
        const query = new URL(url, 'https://example.test').searchParams;
        const data = JSON.stringify({ coll: { notebook: [{ text: 'starší server' }] } });
        if (query.get('action') === 'manifest') {
          const bytes = new TextEncoder().encode(data);
          const sha256 = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(v => v.toString(16).padStart(2, '0')).join('');
          return Response.json({ ok: true, meta: true, transport: 'chunks', version: 7, updated_at: 1, rev: 0,
            bytes: bytes.length, sha256, chunks: [{ part: 0, offset: 1, length: [...data].length }], limit: 10000000, safe: 10000000, empty: false });
        }
        if (query.get('action') === 'read') return Response.json({ ok: true, version: 7, part: 0, offset: 1, data });
        throw new Error('Unexpected state request');
      }
      if (url === '/api/state') throw new Error('Backup must not request the complete state in one Worker invocation');
      if (url === '/api/backup') return Response.json({ ok: true, account: { format: 'tanmay-account-records-v1', role: 'client', sections: { personal_profiles: [{ doc: '{"name":"Já"}' }] } } });
      if (url === '/api/files') return Response.json({ files: [{ id: 'image', name: '../obrázek.png', size: 3 }] });
      return new Response(new Uint8Array([0, 128, 255]), { headers: { 'X-Tanmay-File': 'image', 'Content-Length': '3', 'Content-Type': 'image/png' } });
    }, ...overrides } };
}
test('complete ZIP restores exact texts, training, local audio, remote image, account records and interrupted recording', async () => {
  const f = fixture(), result = await buildCompleteBackup(f.options), files = await unzip(result.blob);
  const json = name => JSON.parse(new TextDecoder().decode(files.get(name)));
  assert.deepEqual(json('_data/coll.json'), f.coll); assert.equal(json('_data/edits.json')['2026-11-06'].note, 'neodesláno');
  assert.equal(new TextDecoder().decode(files.get('Prilohy/audio/Hlas 🌿.webm')), 'VOICE');
  assert.deepEqual([...files.get('Prilohy/image/..-obrázek.png')], [0, 128, 255]);
  assert.equal(new TextDecoder().decode(files.get('Rozpracovane-nahravky/draft.webm')), 'PART');
  assert.match(new TextDecoder().decode(files.get('Zapisnik/Cesta/Příloha.md')), /\.\.\/\.\.\/Prilohy\/image\//);
  const manifest = json('manifest.json'); assert.equal(manifest.complete, true);
  for (const item of manifest.files) {
    const bytes = files.get(item.path); assert.equal(bytes.byteLength, item.bytes);
    const digest = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(v => v.toString(16).padStart(2, '0')).join('');
    assert.equal(digest, item.sha256);
  }
  assert.equal(result.mediaCount, 2); assert.equal(result.recordingCount, 1);
  assert.ok(f.calls.every(call => !call.init.method || call.init.method === 'GET'));
});
test('snapshot captures unsaved RAM before waiting for the server', async () => {
  const f = fixture(); const old = f.options.fetcher;
  f.options.fetcher = async (...args) => { f.coll.notebook[0].text = 'later edit'; return old(...args); };
  const result = await buildCompleteBackup(f.options), files = await unzip(result.blob);
  assert.equal(JSON.parse(new TextDecoder().decode(files.get('_data/coll.json'))).notebook[0].text, '!img(image|200)');
});

test('backup rejects a corrupted state part before collecting account or media data', async () => {
  const f = fixture(), original = f.options.fetcher;
  f.options.fetcher = async (url, init) => {
    const response = await original(url, init);
    if (url.includes('action=read')) {
      const part = await response.json();
      return Response.json({ ...part, data: part.data.replace('server', 'broken') });
    }
    return response;
  };
  await assert.rejects(buildCompleteBackup(f.options));
  assert.ok(f.calls.every(call => call.url.startsWith('/api/state?')));
});

test('backup stops a multipart state read as soon as the mounted account changes', async () => {
  const f = fixture(), original = f.options.fetcher;
  let current = true;
  f.options.current = () => current;
  f.options.fetcher = async (url, init) => {
    const response = await original(url, init);
    if (url.includes('action=read')) current = false;
    return response;
  };
  await assert.rejects(buildCompleteBackup(f.options), { code: 'account-changed' });
  assert.ok(f.calls.every(call => call.url.startsWith('/api/state?')));
});
for (const label of ['missing file', 'HTML fallback', 'wrong size', 'account switch', 'cancel']) test(`backup cannot report complete after ${label}`, async () => {
  const f = fixture(), original = f.options.fetcher; let current = true; const controller = new AbortController();
  f.options.current = () => current; f.options.signal = controller.signal;
  f.options.fetcher = async (url, init) => {
    if (url.startsWith('/api/files/')) {
      if (label === 'missing file') return new Response('', { status: 404 });
      if (label === 'HTML fallback') return new Response('<html>Access</html>');
      if (label === 'wrong size') return new Response('x', { headers: { 'X-Tanmay-File': 'image' } });
      if (label === 'account switch') current = false;
      if (label === 'cancel') controller.abort();
    }
    return original(url, init);
  };
  await assert.rejects(buildCompleteBackup(f.options));
});
test('references cover inline images, pending attachments, trash and serialized recovery snapshots', () => {
  const refs = collectMediaFiles({ text: '!img(inline|200)', att: [{ id: 'pending', idb: true }], trash: [{ data: { r2id: 'cover' } }], history: JSON.stringify({ att: [{ id: 'old', r2: true }] }) });
  assert.deepEqual([...refs.keys()].sort(), ['cover', 'inline', 'old', 'pending']);
});
test('ZIP rejects duplicate names, unsafe paths and capacity overflow instead of emitting a corrupt archive', async () => {
  await assert.rejects(zipBackupFiles([{ path: '../escape', text: 'x' }]));
  await assert.rejects(zipBackupFiles([{ path: 'same', text: 'x' }, { path: 'same', text: 'y' }]));
  await assert.rejects(zipBackupFiles([{ path: 'big', blob: { size: 0xffffffff } }]));
});
