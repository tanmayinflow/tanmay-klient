import { CLIENT_OPTIONAL } from './roles.js';

// Large documents are prepared and checked in the browser. Each Worker request
// sees only a bounded piece; no draft is acknowledged before the atomic commit.
export const STATE_TRANSFER_LIMIT = 10_000_000;
export const STATE_TRANSFER_PART_BYTES = 192 * 1024;
const MAX_READ_PART_BYTES = 128 * 1024;
const encoder = new TextEncoder();
const decoder = new TextDecoder('utf-8', { fatal: true });
const integer = value => Number.isSafeInteger(value) && value >= 0;
const digest = async bytes => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), value => value.toString(16).padStart(2, '0')).join('');
const hash = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
const json = (body, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
const invalid = (code = 'state-transport-invalid', status = 502) => json({ ok: false, code, limit: STATE_TRANSFER_LIMIT, safe: STATE_TRANSFER_LIMIT }, status);
const aborted = signal => { if (signal?.aborted) throw signal.reason || new DOMException('The operation was aborted', 'AbortError'); };

function route(input, init) {
  if (typeof input !== 'string' && !(input instanceof URL)) return null;
  const url = new URL(String(input), globalThis.location?.href || 'http://localhost');
  const method = String(init?.method || 'GET').toUpperCase();
  if (url.pathname !== '/api/state' || url.searchParams.has('meta') || url.searchParams.has('transport') || !['GET', 'PUT'].includes(method)) return null;
  const absolute = /^[a-z][a-z\d+.-]*:/i.test(String(input));
  const path = (action, values = {}) => {
    const next = new URL(url);
    next.searchParams.set('transport', 'chunks'); next.searchParams.set('action', action);
    for (const [name, value] of Object.entries(values)) next.searchParams.set(name, String(value));
    return absolute ? next.href : next.pathname + next.search;
  };
  return { method, path, meta: absolute ? new URL('/api/state?meta=1', url).href : '/api/state?meta=1' };
}

// Failed HTTP responses (including opaque Access redirects) remain untouched so
// existing callers retain their authentication, membership and retry handling.
async function exchange(fetcher, path, options) {
  aborted(options.signal);
  const response = await fetcher(path, options);
  aborted(options.signal);
  if (!response.ok || response.redirected || response.type === 'opaqueredirect' || !/application\/json/i.test(response.headers.get('content-type') || '')) return { response };
  try {
    const body = await response.json(); aborted(options.signal);
    return body?.ok === true ? { body } : { response: json(body || { ok: false, code: 'state-transport-invalid' }, response.status) };
  } catch { aborted(options.signal); return { response: invalid() }; }
}

function validManifest(manifest) {
  if (manifest.transport !== 'chunks' || !integer(manifest.version) || !integer(manifest.bytes) || manifest.bytes > STATE_TRANSFER_LIMIT || !Array.isArray(manifest.chunks) || manifest.chunks.length > 512) return false;
  if (manifest.empty === true) return manifest.version === 0 && manifest.bytes === 0 && manifest.chunks.length === 0;
  if (manifest.bytes === 0 || manifest.chunks.length === 0 || (manifest.sha256 !== null && !hash(manifest.sha256))) return false;
  let previous;
  for (const part of manifest.chunks) {
    if (!integer(part.part) || !Number.isSafeInteger(part.offset) || part.offset < 1 || !Number.isSafeInteger(part.length) || part.length < 1 || part.length > 32768) return false;
    if (!previous ? part.part !== 0 || part.offset !== 1 : part.part === previous.part ? part.offset !== previous.offset + previous.length : part.part !== previous.part + 1 || part.offset !== 1) return false;
    previous = part;
  }
  return true;
}

async function readDocument(target, options, fetcher) {
  const opened = await exchange(fetcher, target.path('manifest'), { ...options, method: 'GET', body: undefined });
  if (opened.response) return opened.response;
  const manifest = opened.body;
  if (!validManifest(manifest)) return invalid();
  if (manifest.empty) return json({ ok: true, doc: null, version: 0, updated_at: manifest.updated_at ?? null, bytes: 0, limit: STATE_TRANSFER_LIMIT, safe: STATE_TRANSFER_LIMIT });
  const chunks = new Array(manifest.chunks.length);
  let next = 0, total = 0, failure = null, thrown = null;
  const read = async () => {
    while (!failure && !thrown && next < manifest.chunks.length) {
      aborted(options.signal);
      const index = next++, part = manifest.chunks[index];
      const result = await exchange(fetcher, target.path('read', { version: manifest.version, part: part.part, offset: part.offset }), { ...options, method: 'GET', body: undefined });
      if (result.response) { failure ||= result.response; return; }
      const value = result.body;
      if (value.version !== manifest.version || value.part !== part.part || value.offset !== part.offset || typeof value.data !== 'string') { failure ||= invalid(); return; }
      const length = encoder.encode(value.data).length;
      total += length;
      if (!length || length > MAX_READ_PART_BYTES || total > manifest.bytes || total > STATE_TRANSFER_LIMIT) { failure ||= invalid(); return; }
      chunks[index] = value.data;
    }
  };
  // Four bounded reads avoid hundreds of serial mobile round trips, while each
  // request remains tied to the manifest's committed version.
  await Promise.all(Array.from({ length: Math.min(4, chunks.length) }, () => read().catch(error => { thrown ||= error; })));
  if (thrown) throw thrown;
  if (failure) return failure;
  aborted(options.signal);
  const text = chunks.join(''), bytes = encoder.encode(text);
  if (total !== manifest.bytes || bytes.length !== manifest.bytes || (manifest.sha256 && await digest(bytes) !== manifest.sha256)) return invalid('state-transport-corrupt');
  aborted(options.signal);
  let doc; try { doc = JSON.parse(text); } catch { return invalid('state-transport-corrupt'); }
  return json({ ok: true, doc, version: manifest.version, updated_at: manifest.updated_at, bytes: manifest.bytes, limit: STATE_TRANSFER_LIMIT, safe: STATE_TRANSFER_LIMIT });
}

async function writeDocument(target, options, fetcher) {
  let body;
  try { body = typeof options.body === 'string' ? JSON.parse(options.body) : null; } catch { return invalid('bad-json', 400); }
  if (!body || typeof body !== 'object' || !Object.hasOwn(body, 'doc')) return invalid('bad-json', 400);
  const text = JSON.stringify(body.doc);
  if (typeof text !== 'string') return invalid('bad-json', 400);
  const bytes = encoder.encode(text);
  if (bytes.length > STATE_TRANSFER_LIMIT) return json({ ok: false, code: 'too-large', bytes: bytes.length, limit: STATE_TRANSFER_LIMIT, safe: STATE_TRANSFER_LIMIT }, 413);
  const parts = [];
  for (let start = 0; start < bytes.length;) {
    let end = Math.min(start + STATE_TRANSFER_PART_BYTES, bytes.length);
    while (end < bytes.length && (bytes[end] & 0xc0) === 0x80) end--;
    parts.push(decoder.decode(bytes.subarray(start, end))); start = end;
  }
  const sha256 = await digest(bytes); aborted(options.signal);
  let baseVersion = body.baseVersion;
  if (!integer(baseVersion)) {
    const meta = await exchange(fetcher, target.meta, { ...options, method: 'GET', body: undefined });
    if (meta.response) return meta.response;
    if (!integer(meta.body.version)) return invalid();
    baseVersion = meta.body.version;
  }
  const headers = new Headers(options.headers || {}); headers.set('Content-Type', 'application/json'); headers.delete('Content-Length');
  const send = (action, value) => exchange(fetcher, target.path(action), { ...options, method: 'PUT', headers, body: JSON.stringify(value) });
  const modules = Array.isArray(body.doc?.coll?.modules) ? body.doc.coll.modules.filter(value => CLIENT_OPTIONAL.includes(value)) : [];
  if (body.doc?.coll?.memento?.zapnuto && !modules.includes('memento')) modules.push('memento');
  const started = await send('start', { baseVersion, rev: Number(body.doc?.rev) || 0, bytes: bytes.length, sha256, parts: parts.length, modules, ...(Object.hasOwn(body, 'share') ? { share: body.share } : {}) });
  if (started.response) return started.response;
  const uploadId = started.body.uploadId;
  if (typeof uploadId !== 'string' || !uploadId || uploadId.length > 128) return invalid();
  for (let part = 0; part < parts.length; part++) {
    aborted(options.signal);
    const data = parts[part], partHash = await digest(encoder.encode(data)); aborted(options.signal);
    const saved = await send('part', { uploadId, part, data, sha256: partHash });
    if (saved.response) return saved.response;
    if (saved.body.part !== part) return invalid();
  }
  const committed = await send('commit', { uploadId });
  if (committed.response) return committed.response;
  if (!integer(committed.body.version) || committed.body.version !== baseVersion + 1 || committed.body.bytes !== bytes.length) return invalid();
  aborted(options.signal);
  return json(committed.body);
}

export async function stateTransportFetch(input, init = {}, fetcher = (...args) => fetch(...args)) {
  const target = route(input, init);
  if (!target) return fetcher(input, init);
  const options = { cache: 'no-store', credentials: 'same-origin', redirect: 'manual', ...init };
  aborted(options.signal);
  return target.method === 'GET' ? readDocument(target, options, fetcher) : writeDocument(target, options, fetcher);
}
