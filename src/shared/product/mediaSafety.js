// A media acknowledgement is a protocol receipt, not merely an HTTP status.
export const MEDIA_MAX_BYTES = 95 * 1024 * 1024;
const failure = (code, extra = {}) => Object.assign(new Error(code), { code, ...extra });
export const STORAGE_BLOCK_CODES = Object.freeze(['storage-initializing', 'storage-pending', 'storage-user-limit', 'storage-capacity', 'storage-operations', 'storage-unavailable']);
export async function uploadMedia({ fetcher = fetch, id, blob, name = '', signal }) {
  if (!blob || blob.size > MEDIA_MAX_BYTES) throw failure('media-too-large');
  const response = await fetcher('/api/files/' + encodeURIComponent(id), {
    method: 'PUT', redirect: 'manual', signal,
    headers: { 'Content-Type': blob.type || 'application/octet-stream', 'X-File-Name': encodeURIComponent(name) }, body: blob,
  });
  if (!response.ok || response.redirected || response.type === 'opaqueredirect') {
    let code = 'upload-rejected';
    if (!response.redirected && /application\/json/i.test(response.headers.get('content-type') || '')) {
      const detail = await response.json().catch(() => null);
      if (STORAGE_BLOCK_CODES.includes(detail?.code)) code = detail.code;
    }
    throw failure(code, { status: response.status });
  }
  if (!/application\/json/i.test(response.headers.get('content-type') || '')) throw failure('upload-receipt');
  const receipt = await response.json().catch(() => null);
  if (receipt?.ok !== true || receipt.id !== id) throw failure('upload-receipt');
  return true;
}

// Capture the account/namespace in the caller before either asynchronous write.
// Retain a local copy even after upload; it must not be removed on a guessed
// React timing boundary or after only one of two documents has been persisted.
export async function storeAttachment({ file, id, putLocal, upload, current = () => true }) {
  if (!current()) throw failure('account-changed');
  let local = false, localError;
  try { await putLocal(id, file); local = true; } catch (error) { localError = error; }
  if (!current()) throw failure('account-changed');
  const metadata = { id, name: file.name || '', type: file.type || 'application/octet-stream', size: file.size };
  try {
    await upload(id, file, file.name);
    if (!current()) throw failure('account-changed');
    return { ...metadata, r2: true };
  } catch (error) {
    if (!current()) throw failure('account-changed');
    if (local) return { ...metadata, idb: true, ...(STORAGE_BLOCK_CODES.includes(error.code) ? { cloudBlock: error.code } : {}) };
    throw failure('media-not-saved', { cause: error, localError });
  }
}

export function assertMediaResponse(response, id) {
  if (!response?.ok || response.redirected || response.type === 'opaqueredirect') throw failure('media-download', { id, status: response?.status });
  // Set by the authenticated file handler. Reject Access HTML and SPA fallback,
  // while still permitting a genuine user-uploaded HTML attachment.
  if (response.headers.get('X-Tanmay-File') !== id) throw failure('media-response', { id });
  return response;
}

export async function pinMedia({ entryId, ids, cache, fetcher, urlFor, readRegistry, saveRegistry, getLocalFile, current = () => true }) {
  if (!current()) throw failure('account-changed');
  const unique = [...new Set(ids)];
  // A previous, possibly stale checkmark must not survive a failed re-check.
  const before = { ...readRegistry() }; delete before[entryId]; saveRegistry(before);
  for (const id of unique) {
    if (!current()) throw failure('account-changed');
    const url = urlFor(id);
    const local = await getLocalFile?.(id);
    const response = local ? new Response(local, { headers: { 'X-Tanmay-File': id, 'Content-Type': local.type || 'application/octet-stream', 'Content-Length': String(local.size) } })
      : assertMediaResponse(await fetcher(url, { cache: 'no-store', redirect: 'manual' }), id);
    if (!current()) throw failure('account-changed');
    await cache.put(url, response.clone());
    const saved = await cache.match(url);
    assertMediaResponse(saved, id);
    // Await body consumption, not just the existence of a cache key.
    const bytes = await saved.blob();
    const size = response.headers.get('Content-Length');
    if (size !== null && bytes.size !== Number(size)) throw failure('media-truncated', { id });
  }
  if (!current()) throw failure('account-changed');
  saveRegistry({ ...readRegistry(), [entryId]: unique });
  return unique.length;
}

export async function verifyPinnedMedia({ ids, cache, urlFor, current = () => true }) {
  if (!ids?.length || !current()) return false;
  try {
    for (const id of ids) {
      const response = assertMediaResponse(await cache.match(urlFor(id)), id);
      const blob = await response.blob(), size = response.headers.get('Content-Length');
      if (!current() || (size !== null && blob.size !== Number(size))) return false;
    }
    return true;
  } catch { return false; }
}

// Keep listening after a successful run, since another file may be added later.
// Coalesce callers, avoid work while hidden/offline, and bound transient retries.
export function createMediaRecovery({ retry, win = window, doc = document,
  online = () => navigator.onLine !== false, schedule = setTimeout, cancel = clearTimeout }) {
  const delays = [5000, 15000, 60000];
  let stopped = false, busy = false, timer = null, attempt = 0, again = false;
  const visible = () => doc.visibilityState !== 'hidden' && online();
  const arm = delay => { if (stopped || timer !== null) return; timer = schedule(() => { timer = null; void run(); }, delay); };
  const run = async () => {
    if (stopped || !visible()) return;
    if (busy) { again = true; return; }
    busy = true;
    let done = false;
    try { const result = await retry(); done = result && !result.aborted && result.cekalo === result.nahrano; } catch { /* Local files remain intact. */ }
    finally { busy = false; }
    if (stopped) return;
    if (again) { again = false; attempt = 0; arm(delays[0]); }
    else if (!done && attempt < delays.length) arm(delays[attempt++]);
    else if (done) attempt = 0;
  };
  const wake = () => {
    if (stopped || !visible()) return;
    attempt = 0;
    if (timer !== null) cancel(timer);
    timer = null;
    void run();
  };
  // The attachment event can precede React's document commit. Give that commit
  // time to finish, rather than inspecting an empty queue and stopping forever.
  const pending = () => {
    if (stopped || !visible()) return;
    attempt = 0;
    if (timer !== null) cancel(timer);
    timer = null;
    if (busy) again = true;
    else arm(1500);
  };
  const events = ['online', 'focus', 'pageshow'];
  for (const event of events) win.addEventListener(event, wake);
  win.addEventListener('tm-media-pending', pending);
  doc.addEventListener('visibilitychange', wake);
  arm(4000);
  return () => {
    stopped = true; if (timer !== null) cancel(timer);
    for (const event of events) win.removeEventListener(event, wake);
    win.removeEventListener('tm-media-pending', pending);
    doc.removeEventListener('visibilitychange', wake);
  };
}
