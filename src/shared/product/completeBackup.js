import { assertMediaResponse } from './mediaSafety.js';
const fail = (code, detail = {}) => Object.assign(new Error(code), { code, ...detail });
const ID = /^[a-zA-Z0-9_-]{1,160}$/;
const safeName = value => String(value || '').normalize('NFC').replace(/[\\/:*?"<>|\x00-\x1f]/g, '-').replace(/^\.+$/, '-').trim().slice(0, 120) || 'soubor';
const jsonFile = (path, value) => ({ path, blob: new Blob([JSON.stringify(value, null, 2) + '\n'], { type: 'application/json' }) });
export function collectMediaFiles(value, out = new Map()) {
  const add = (id, data = {}) => {
    if (!ID.test(id)) throw fail('backup-file-id');
    const previous = out.get(id) || { id };
    out.set(id, { ...previous, ...data, id, local: !!(previous.local || data.local) });
  };
  if (typeof value === 'string') {
    if (/^\s*[\[{]/.test(value)) { let nested; try { nested = JSON.parse(value); } catch {} if (nested && typeof nested === 'object') collectMediaFiles(nested, out); }
    for (const match of value.matchAll(/!img\(([^|)]+)\|\d+\)/g)) add(match[1]);
    for (const match of value.matchAll(/(?:^|[\s("'])\/api\/files\/([a-zA-Z0-9_%.-]+)/g)) add(decodeURIComponent(match[1]));
  } else if (Array.isArray(value)) for (const item of value) collectMediaFiles(item, out);
  else if (value && typeof value === 'object') {
    if ((value.r2 || value.idb) && value.id) add(value.id, { name: value.name, type: value.type, size: value.size, local: value.idb === true });
    if (value.r2id) add(value.r2id);
    for (const item of Object.values(value)) collectMediaFiles(item, out);
  }
  return out;
}
const CRC_TABLE = Uint32Array.from({ length: 256 }, (_, index) => {
  let value = index; for (let bit = 0; bit < 8; bit++) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  return value >>> 0;
});
async function crc32(blob, guard) {
  const reader = blob.stream().getReader(); let crc = 0xffffffff;
  try {
    for (;;) {
      guard(); const { value, done } = await reader.read(); if (done) break;
      for (const byte of value) crc = CRC_TABLE[(crc ^ byte) & 255] ^ (crc >>> 8);
    }
  } finally { reader.releaseLock(); }
  return (crc ^ 0xffffffff) >>> 0;
}
// Store-only ZIP: preserve original media bytes and keep Blob parts out of a
// second giant JS array. Reject ZIP32 overflow rather than silently truncate it.
export async function zipBackupFiles(files, guard = () => {}) {
  if (files.length >= 65535) throw fail('backup-zip-limit');
  const encoder = new TextEncoder(), parts = [], central = [], entries = [], paths = new Set();
  let offset = 0;
  const now = new Date(), time = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
  const date = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
  for (const file of files) {
    guard();
    if (!file.path || file.path.startsWith('/') || file.path.includes('\\') || file.path.split('/').some(part => !part || part === '..' || part === '.')) throw fail('backup-path');
    if (paths.has(file.path)) throw fail('backup-duplicate-path'); paths.add(file.path);
    const name = encoder.encode(file.path), blob = file.blob || new Blob([file.text || '']);
    if (name.length > 65535 || blob.size >= 0xffffffff || offset + blob.size + name.length + 30 >= 0xffffffff) throw fail('backup-zip-limit');
    const crc = await crc32(blob, guard);
    const local = new DataView(new ArrayBuffer(30)), directory = new DataView(new ArrayBuffer(46));
    local.setUint32(0, 0x04034b50, true); local.setUint16(4, 20, true); local.setUint16(6, 0x0800, true);
    local.setUint16(10, time, true); local.setUint16(12, date, true); local.setUint32(14, crc, true);
    local.setUint32(18, blob.size, true); local.setUint32(22, blob.size, true); local.setUint16(26, name.length, true);
    directory.setUint32(0, 0x02014b50, true); directory.setUint16(4, 20, true); directory.setUint16(6, 20, true); directory.setUint16(8, 0x0800, true);
    directory.setUint16(12, time, true); directory.setUint16(14, date, true); directory.setUint32(16, crc, true);
    directory.setUint32(20, blob.size, true); directory.setUint32(24, blob.size, true); directory.setUint16(28, name.length, true); directory.setUint32(42, offset, true);
    parts.push(local.buffer, name, blob); central.push(directory.buffer, name);
    entries.push({ path: file.path, bytes: blob.size, crc32: crc.toString(16).padStart(8, '0') });
    offset += 30 + name.length + blob.size;
  }
  const centralSize = central.reduce((sum, part) => sum + part.byteLength, 0);
  if (offset + centralSize + 22 >= 0xffffffff) throw fail('backup-zip-limit');
  const end = new DataView(new ArrayBuffer(22)); end.setUint32(0, 0x06054b50, true);
  end.setUint16(8, files.length, true); end.setUint16(10, files.length, true); end.setUint32(12, centralSize, true); end.setUint32(16, offset, true);
  guard(); return { blob: new Blob([...parts, ...central, end.buffer], { type: 'application/zip' }), entries };
}

export async function buildCompleteBackup({ coll, edits, textFiles = [], role, fetcher = fetch, getLocalFile, listLocalFiles,
  drafts, extraLocal = {}, current = () => true, onProgress = () => {}, signal }) {
  const guard = () => { if (signal?.aborted) throw fail('backup-cancelled'); if (!current()) throw fail('account-changed'); };
  guard();
  // Capture RAM immediately, including changes that could not be saved locally.
  const document = JSON.parse(JSON.stringify({ coll, edits }));
  if (!document.coll || !document.edits) throw fail('backup-document');
  const readJSON = async (url, validate) => {
    guard(); const result = await fetcher(url, { cache: 'no-store', redirect: 'manual', signal }); guard();
    if (!result.ok || result.redirected || result.type === 'opaqueredirect' || !/application\/json/i.test(result.headers.get('content-type') || '')) throw fail('backup-server', { status: result.status });
    const body = await result.json(); guard(); if (!validate(body)) throw fail('backup-response'); return body;
  };
  onProgress({ phase: 'data' });
  const state = await readJSON('/api/state', body => body?.ok === true && 'doc' in body);
  const account = await readJSON('/api/backup', body => body?.ok === true && body.account?.format === 'tanmay-account-records-v1' && body.account.role === role);
  const inventory = await readJSON('/api/files', body => Array.isArray(body?.files));
  const refs = collectMediaFiles(document);
  collectMediaFiles(state.doc, refs); collectMediaFiles(account.account.sections, refs); collectMediaFiles(extraLocal, refs);
  for (const item of inventory.files) {
    if (!ID.test(item.id)) throw fail('backup-file-id');
    refs.set(item.id, { ...item, ...(refs.get(item.id) || {}), id: item.id });
  }
  if (listLocalFiles) for (const item of await listLocalFiles()) {
    guard(); if (!ID.test(item.id)) throw fail('backup-file-id');
    refs.set(item.id, { ...item, ...(refs.get(item.id) || {}), id: item.id });
  }
  const files = [jsonFile('_data/coll.json', document.coll), jsonFile('_data/edits.json', document.edits),
    jsonFile('_data/server-state.json', state), jsonFile('_data/account.json', account.account), jsonFile('_data/local-recovery.json', extraLocal)];
  const media = [], byId = new Map(); let completed = 0;
  for (const ref of refs.values()) {
    guard(); onProgress({ phase: 'files', completed, total: refs.size, name: ref.name || ref.id });
    let blob = await getLocalFile?.(ref.id); guard();
    if (!blob) {
      const response = assertMediaResponse(await fetcher('/api/files/' + encodeURIComponent(ref.id), { cache: 'no-store', redirect: 'manual', signal }), ref.id);
      guard(); blob = await response.blob();
      const expected = response.headers.get('Content-Length');
      if (expected !== null && blob.size !== Number(expected)) throw fail('backup-file-size', { id: ref.id });
    }
    guard();
    if (!(blob instanceof Blob) || (Number.isFinite(ref.size) && blob.size !== ref.size)) throw fail('backup-file-size', { id: ref.id });
    const path = 'Prilohy/' + ref.id + '/' + safeName(ref.name || ref.id);
    files.push({ path, blob }); byId.set(ref.id, path);
    media.push({ id: ref.id, path, name: ref.name || '', type: ref.type || blob.type, bytes: blob.size }); completed++;
  }
  const recordings = [];
  if (drafts) for (const draft of await drafts.list()) {
    guard(); const saved = await drafts.read(draft.id); guard();
    if (!saved) throw fail('backup-recording');
    if (!saved.bytes) continue;
    const extension = /mp4|mpeg|m4a/.test(saved.type) ? 'm4a' : /ogg/.test(saved.type) ? 'ogg' : 'webm';
    const path = 'Rozpracovane-nahravky/' + safeName(saved.id) + '.' + extension;
    files.push({ path, blob: saved.blob }); const { blob: _blob, ...metadata } = saved; recordings.push({ ...metadata, path });
  }
  files.push(jsonFile('_data/media.json', { files: media, recordings }));
  for (const file of textFiles.filter(file => file.path.endsWith('.md') && file.path !== 'README.md')) {
    const prefix = '../'.repeat(file.path.split('/').length - 1);
    const link = id => byId.has(id) ? prefix + byId.get(id).split('/').map(encodeURIComponent).join('/') : '/api/files/' + id;
    const text = String(file.text).replace(/!img\(([^|)]+)\|\d+\)/g, (_, id) => `![obrázek](${link(id)})`)
      .replace(/\/api\/files\/([a-zA-Z0-9_-]+)/g, (_, id) => link(id));
    files.push({ path: file.path, text });
  }
  files.push({ path: 'README.md', text: '# tanmay · úplná záloha dat aplikace\n\nTexty a osobní dokument jsou ve složkách Zapisnik, Denik, Prameny a _data. Prilohy obsahují skutečné soubory; jejich vazby a původní názvy jsou v _data/media.json. Rozpracované nahrávky jsou zahrnuté, pokud už prohlížeč předal a uložil jejich zvuk.\n\n_data/account.json obsahuje samostatné údaje účtu a jejich rozsah. Přihlašovací údaje a tokeny se neexportují, propojení služeb vyžaduje nové přihlášení. Cizí soukromá data se nezahrnují. Externí odkazy nejsou kopie cizích webů.\n\nPro obnovu uchovej celý archiv. Původní dokumenty jsou beze změny, soubory lze otevřít samostatně. Automatický přepis účtu se neprovádí. manifest.json obsahuje kontrolní součty všech datových souborů.\n' });
  onProgress({ phase: 'verify', completed, total: refs.size });
  const checks = [];
  for (const file of files) {
    guard(); const blob = file.blob || new Blob([file.text || '']);
    const hash = await crypto.subtle.digest('SHA-256', await blob.arrayBuffer());
    checks.push({ path: file.path, bytes: blob.size, sha256: [...new Uint8Array(hash)].map(byte => byte.toString(16).padStart(2, '0')).join('') });
  }
  files.push(jsonFile('manifest.json', { format: 'tanmay-complete-backup-v1', complete: true, role, createdAt: new Date().toISOString(), files: checks }));
  const archive = await zipBackupFiles(files, guard);
  guard(); onProgress({ phase: 'ready', completed, total: refs.size, bytes: archive.blob.size });
  return { ...archive, manifest: checks, mediaCount: media.length, recordingCount: recordings.length };
}
