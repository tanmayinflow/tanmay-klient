// Bounded local ZIP reading for DOCX and EPUB. No paths are written to disk.
export const ARCHIVE_LIMITS = Object.freeze({ entries: 4000, entryBytes: 24 * 1024 * 1024, totalBytes: 80 * 1024 * 1024 });

export function archivePath(base, relative) {
  let value;
  try { value = decodeURIComponent(String(relative || '').split(/[?#]/)[0]); } catch { return null; }
  if (!value || /^[a-z][a-z\d+.-]*:/i.test(value) || value.startsWith('/') || value.includes('\\') || /[\x00-\x1f]/.test(value)) return null;
  const parts = String(base || '').split('/').slice(0, -1);
  for (const segment of value.split('/')) {
    if (!segment || segment === '.') continue;
    if (segment === '..') { if (!parts.length) return null; parts.pop(); }
    else parts.push(segment);
  }
  return parts.join('/');
}

async function inflate(bytes, method, declared, signal) {
  signal?.throwIfAborted();
  if (method === 0) return bytes;
  if (method !== 8 || typeof DecompressionStream === 'undefined') throw new Error('archive-unsupported');
  const reader = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw')).getReader();
  const chunks = []; let size = 0;
  try {
    for (;;) {
      signal?.throwIfAborted();
      const { done, value } = await reader.read(); if (done) break;
      size += value.length;
      if (size > declared || size > ARCHIVE_LIMITS.entryBytes) throw new Error('archive-limit');
      chunks.push(value);
    }
  } finally { await reader.cancel().catch(() => {}); }
  if (size !== declared) throw new Error('archive-invalid');
  const out = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { out.set(chunk, offset); offset += chunk.length; }
  return out;
}

export async function readDocumentArchive(buffer, wants = () => true, signal) {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  if (bytes.length < 22 || bytes.length > ARCHIVE_LIMITS.totalBytes) throw new Error('archive-limit');
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let end = -1;
  for (let p = bytes.length - 22; p >= Math.max(0, bytes.length - 65557); p--) {
    if (view.getUint32(p, true) === 0x06054b50 && p + 22 + view.getUint16(p + 20, true) === bytes.length) { end = p; break; }
  }
  if (end < 0 || view.getUint16(end + 4, true) || view.getUint16(end + 6, true)) throw new Error('archive-invalid');
  const count = view.getUint16(end + 10, true);
  if (!count || count > ARCHIVE_LIMITS.entries || count !== view.getUint16(end + 8, true)) throw new Error('archive-limit');
  let cursor = view.getUint32(end + 16, true), total = 0;
  const directoryEnd = cursor + view.getUint32(end + 12, true);
  if (directoryEnd > end) throw new Error('archive-invalid');
  const out = Object.create(null), decoder = new TextDecoder('utf-8');
  for (let i = 0; i < count; i++) {
    signal?.throwIfAborted();
    if (cursor + 46 > directoryEnd || view.getUint32(cursor, true) !== 0x02014b50) throw new Error('archive-invalid');
    const flags = view.getUint16(cursor + 8, true), method = view.getUint16(cursor + 10, true);
    const packed = view.getUint32(cursor + 20, true), unpacked = view.getUint32(cursor + 24, true);
    const nameSize = view.getUint16(cursor + 28, true), extraSize = view.getUint16(cursor + 30, true), commentSize = view.getUint16(cursor + 32, true);
    const local = view.getUint32(cursor + 42, true), next = cursor + 46 + nameSize + extraSize + commentSize;
    if (next > directoryEnd) throw new Error('archive-invalid');
    const name = decoder.decode(bytes.subarray(cursor + 46, cursor + 46 + nameSize)); cursor = next;
    if (!wants(name)) continue;
    if (flags & 1) throw new Error('archive-encrypted');
    total += unpacked;
    if (unpacked > ARCHIVE_LIMITS.entryBytes || total > ARCHIVE_LIMITS.totalBytes || packed > bytes.length) throw new Error('archive-limit');
    if (Object.hasOwn(out, name) || local + 30 > end || view.getUint32(local, true) !== 0x04034b50) throw new Error('archive-invalid');
    const start = local + 30 + view.getUint16(local + 26, true) + view.getUint16(local + 28, true);
    if (start + packed > end || (method === 0 && packed !== unpacked)) throw new Error('archive-invalid');
    out[name] = await inflate(bytes.subarray(start, start + packed), method, unpacked, signal);
  }
  return out;
}
