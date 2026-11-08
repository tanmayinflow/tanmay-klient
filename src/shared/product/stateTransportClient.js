import { CLIENT_OPTIONAL } from './roles.js';

// Large documents are prepared and checked in the browser. Each Worker request
// sees only a bounded piece; no draft is acknowledged before the atomic commit.
export const STATE_TRANSFER_LIMIT = 10_000_000;
export const STATE_TRANSFER_PART_BYTES = 192 * 1024;
export const STATE_TRANSFER_REQUEST_TIMEOUT = 30_000;
export const STATE_TRANSFER_RETRY_DELAYS = Object.freeze([300, 900]);
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
  if (url.pathname !== '/api/state' || url.searchParams.has('transport') || !['GET', 'PUT'].includes(method)) return null;
  if (url.searchParams.has('meta')) return method === 'GET' ? { method: 'META', url: String(input) } : null;
  const absolute = /^[a-z][a-z\d+.-]*:/i.test(String(input));
  const path = (action, values = {}) => {
    const next = new URL(url);
    next.searchParams.set('transport', 'chunks'); next.searchParams.set('action', action);
    for (const [name, value] of Object.entries(values)) next.searchParams.set(name, String(value));
    return absolute ? next.href : next.pathname + next.search;
  };
  return { method, path, meta: absolute ? new URL('/api/state?meta=1', url).href : '/api/state?meta=1' };
}

// A lost response does not prove that a write failed. Retry the same bounded
// request, especially commit with its original uploadId and server receipt.
// A deadline includes body consumption so a stalled mobile stream cannot hold
// the document queue forever. Explicit caller cancellation always wins.
async function exchangeAttempt(fetcher, path, options) {
  aborted(options.signal);
  const controller = new AbortController();
  let errorResponse = null;
  const canRetry = response => response.status === 408 || response.status === 429 || response.status >= 500;
  const bufferedError = (response, body) => {
    const headers = new Headers(response.headers);
    headers.delete('Content-Length'); headers.delete('Content-Encoding');
    headers.set('Content-Type', 'application/json');
    return { response: Response.json(body, { status: response.status, headers }), retryable: canRetry(response) };
  };
  let rejectDeadline;
  const deadline = new Promise((_, reject) => { rejectDeadline = reject; });
  const interrupt = reason => { controller.abort(reason); rejectDeadline(reason); };
  const onAbort = () => interrupt(options.signal.reason || new DOMException('The operation was aborted', 'AbortError'));
  options.signal?.addEventListener('abort', onAbort, { once: true });
  const timer = setTimeout(() => interrupt(new DOMException('The state request timed out', 'TimeoutError')), STATE_TRANSFER_REQUEST_TIMEOUT);
  try {
    return await Promise.race([(async () => {
      const response = await fetcher(path, { ...options, signal: controller.signal });
      aborted(controller.signal);
      const isJson = /application\/json/i.test(response.headers.get('content-type') || '');
      if (!response.ok && response.status > 0 && !response.redirected && response.type !== 'opaqueredirect' && isJson) {
        errorResponse = response;
        const body = await response.json();
        aborted(controller.signal);
        return bufferedError(response, body);
      }
      if (!response.ok || response.redirected || response.type === 'opaqueredirect' || !isJson) {
        return { response, retryable: !response.redirected && response.type !== 'opaqueredirect' && canRetry(response) };
      }
      let body;
      try { body = await response.json(); }
      catch (error) {
        aborted(controller.signal);
        if (error instanceof SyntaxError || error?.name === 'SyntaxError') return { response: invalid() };
        throw error;
      }
      aborted(controller.signal);
      return body?.ok === true ? { body } : { response: json(body || { ok: false, code: 'state-transport-invalid' }, response.status) };
    })(), deadline]);
  } catch (error) {
    aborted(options.signal);
    // Even the final failed HTTP response must have a bounded, readable body.
    // Its known status remains authoritative if its JSON stream never finishes.
    if (errorResponse) return bufferedError(errorResponse, { ok: false, code: 'state-response-unavailable' });
    throw error;
  } finally {
    clearTimeout(timer);
    options.signal?.removeEventListener('abort', onAbort);
  }
}

function retryDelay(response, fallback) {
  const header = response?.headers?.get('retry-after');
  if (!header) return fallback;
  const seconds = Number(header);
  const delay = /^\d+(\.\d+)?$/.test(header.trim()) ? seconds * 1000 : Date.parse(header) - Date.now();
  // A longer provider pause belongs to the existing foreground/manual recovery,
  // not a tight retry loop that could consume the free request allowance.
  if (Number.isFinite(delay) && delay > 5000) return null;
  return Number.isFinite(delay) ? Math.max(fallback, delay, 0) : fallback;
}

function waitForRetry(delay, signal) {
  aborted(signal);
  return new Promise((resolve, reject) => {
    const onAbort = () => { clearTimeout(timer); signal?.removeEventListener('abort', onAbort); reject(signal.reason || new DOMException('The operation was aborted', 'AbortError')); };
    const timer = setTimeout(() => { signal?.removeEventListener('abort', onAbort); resolve(); }, delay);
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

async function exchange(fetcher, path, options) {
  for (let attempt = 0; ; attempt++) {
    let result;
    try { result = await exchangeAttempt(fetcher, path, options); }
    catch (error) {
      aborted(options.signal);
      // Account guards may reject before fetch returns an HTTP response.
      // Retrying cannot repair a changed identity or a refused request.
      if (error?.code === 'changed' || [400, 401, 403, 409, 413].includes(error?.status)) throw error;
      if (attempt >= STATE_TRANSFER_RETRY_DELAYS.length) throw error;
    }
    aborted(options.signal);
    if (result && (!result.retryable || attempt >= STATE_TRANSFER_RETRY_DELAYS.length)) return result;
    const delay = retryDelay(result?.response, STATE_TRANSFER_RETRY_DELAYS[attempt]);
    if (delay === null) return result;
    // Release an unsuccessful response before the next request. Do not await a
    // potentially stalled response stream just to dispose of it.
    try { result?.response?.body?.cancel().catch(() => {}); } catch {}
    await waitForRetry(delay, options.signal);
  }
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
  if (target.method === 'META') {
    const result = await exchange(fetcher, target.url, options);
    return result.response || json(result.body);
  }
  return target.method === 'GET' ? readDocument(target, options, fetcher) : writeDocument(target, options, fetcher);
}
