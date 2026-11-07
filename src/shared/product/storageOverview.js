import { AUDIO_UPLOAD_BYTES } from './mediaLimits.js';
import { compressPhoto } from './imageCompression.js';

export const STORAGE_DEFAULTS = Object.freeze({ audioKbps: 64, photoSide: 0, budgetGiB: 0 });
export function normalizeStoragePreferences(value = {}) {
  return {
    audioKbps: [32, 64, 128].includes(value?.audioKbps) ? value.audioKbps : 64,
    photoSide: [0, 1600, 2560].includes(value?.photoSide) ? value.photoSide : 0,
    budgetGiB: [0, 1, 5, 10, 25].includes(value?.budgetGiB) ? value.budgetGiB : 0,
  };
}
export const storagePreferenceKey = namespace => 'tm_storage_options_v1:' + namespace;
export function readStoragePreferences(namespace, storage) {
  try { return normalizeStoragePreferences(JSON.parse((storage || globalThis.localStorage).getItem(storagePreferenceKey(namespace)) || '{}')); }
  catch { return { ...STORAGE_DEFAULTS }; }
}
export function writeStoragePreferences(namespace, value, storage = globalThis.localStorage) {
  if (!namespace) throw new Error('storage-account');
  const next = normalizeStoragePreferences(value);
  storage.setItem(storagePreferenceKey(namespace), JSON.stringify(next));
  return next;
}
export function summarizeFiles(files = []) {
  const result = { count: 0, bytes: 0, audio: 0, images: 0, other: 0 };
  const ids = new Set();
  for (const file of files) {
    if (!file || !Number.isFinite(file.size) || file.size < 0 || ids.has(file.id)) continue;
    ids.add(file.id); result.count++; result.bytes += file.size;
    result[/^audio\//.test(file.type) ? 'audio' : /^image\//.test(file.type) ? 'images' : 'other'] += file.size;
  }
  return result;
}
export function pendingAttachments(document) {
  const files = new Map();
  const visit = node => {
    if (!node || typeof node !== 'object') return;
    if (node.id && node.idb && !node.r2) files.set(node.id, { id: node.id, size: Number(node.size) || 0, type: node.type });
    for (const value of Object.values(node)) visit(value);
  };
  visit(document); return summarizeFiles([...files.values()]);
}
export async function storageJSON(fetcher, path, signal) {
  const response = await fetcher(path, { cache: 'no-store', redirect: 'manual', signal });
  if (!response.ok || response.redirected || response.type === 'opaqueredirect' || !/application\/json/i.test(response.headers.get('content-type') || '')) throw new Error('storage-unavailable');
  return response.json();
}
// Partial failures remain unknown, never zero. The account guard covers every
// asynchronous source, including the device-wide browser estimate.
export async function inspectStorage({ fetcher = fetch, getDocument, listLocalFiles, drafts, current = () => true, browserStorage = globalThis.navigator?.storage, signal }) {
  const guard = () => { if (!current() || signal?.aborted) throw new Error('account-changed'); };
  guard();
  const document = getDocument();
  const work = Promise.allSettled([
    storageJSON(fetcher, '/api/files', signal).then(data => { if (!Array.isArray(data.files) || data.files.some(file => !file || typeof file.id !== 'string' || !file.id || !Number.isSafeInteger(file.size) || file.size < 0)) throw new Error('storage-inventory'); return summarizeFiles(data.files); }),
    storageJSON(fetcher, '/api/state?meta=1', signal).then(data => { if (data.ok !== true || !Number.isSafeInteger(data.bytes) || data.bytes < 0 || !Number.isSafeInteger(data.limit) || data.limit <= 0) throw new Error('storage-state'); return { bytes: data.bytes, limit: data.limit }; }),
    Promise.resolve().then(() => listLocalFiles()).then(summarizeFiles),
    Promise.resolve().then(() => drafts.list()).then(rows => ({ count: rows.filter(row => row.bytes > 0).length, bytes: rows.reduce((n, row) => n + (row.bytes || 0), 0) })),
    Promise.resolve().then(() => browserStorage?.estimate?.()).then(value => value && Number.isFinite(value.usage) && Number.isFinite(value.quota) ? value : null),
    Promise.resolve().then(() => browserStorage?.persisted?.()),
  ]);
  let onAbort;
  const cancelled = new Promise((_, reject) => {
    onAbort = () => reject(new Error('storage-cancelled'));
    if (signal?.aborted) onAbort(); else signal?.addEventListener('abort', onAbort, { once: true });
  });
  let settled;
  try { settled = await (signal ? Promise.race([work, cancelled]) : work); }
  finally { signal?.removeEventListener('abort', onAbort); }
  guard();
  const values = settled.map(row => row.status === 'fulfilled' ? row.value : null);
  return { cloud: values[0], state: values[1], local: values[2], drafts: values[3], device: values[4], persistent: values[5], pending: pendingAttachments(document), documentBytes: new TextEncoder().encode(JSON.stringify(document)).length };
}
export function recordingEstimate(kbps) {
  const rate = normalizeStoragePreferences({ audioKbps: kbps }).audioKbps;
  return { hourBytes: rate * 1000 / 8 * 3600, maxMinutes: Math.floor(AUDIO_UPLOAD_BYTES * 8 / (rate * 1000 * 60)) };
}
// New photographs share the same automatic size cap in both app shells.
export async function preparePhotoAttachment(file, preferences, codec = {}) {
  return compressPhoto(file, { maxSide: normalizeStoragePreferences(preferences).photoSide, ...(typeof codec === 'object' ? codec : {}) });
}
