import { createIndexedRecoveryStore } from "./recoveryArchiveStore.js";

// Local documents stay plain JSON for account isolation and cross-tab sync.
// Only the recovery archive uses a self-contained, lossless gzip envelope.
const BACKUP_FORMAT = "tanmay-backups-gzip-v1";

export function storageFailureKind(error) {
  if (error?.name === "QuotaExceededError" || error?.name === "NS_ERROR_DOM_QUOTA_REACHED" || error?.code === 22 || error?.code === 1014) return "quota";
  if (error?.name === "SecurityError" || error?.name === "NotAllowedError") return "denied";
  return "unknown";
}

export function storageSizeSummary(storage) {
  const result = { totalCharacters: 0, documentCharacters: 0, backupCharacters: 0, otherCharacters: 0, available: true };
  try {
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i), size = (storage.getItem(key) || "").length;
      result.totalCharacters += size;
      if (key === "tanmay_coll_v1" || key === "tanmay_edits_v1") result.documentCharacters += size;
      else if (key === "tanmay_zaloha_v1") result.backupCharacters += size;
      else result.otherCharacters += size;
    }
  } catch { result.available = false; }
  return result;
}

export function localSaveMessage(failure, L) {
  if (failure?.kind === "quota") return L("Místní úložiště nemá dost volného místa pro tento zápis. Poslední změny zatím nejsou uložené v tomto zařízení.", "Local storage has insufficient space for this write. Your latest changes are not saved on this device yet.");
  if (failure?.kind === "denied") return L("Prohlížeč odmítl přístup k místnímu úložišti. Poslední změny zatím nejsou uložené v tomto zařízení.", "The browser denied access to local storage. Your latest changes are not saved on this device yet.");
  return L("Zápis do tohoto zařízení se nepodařil. Stáhni si zálohu a zkus uložení znovu.", "Saving to this device failed. Download a backup and try saving again.");
}

export function localSaveDiagnostic(failure, L) {
  if (!failure) return "";
  const size = failure.sizes;
  const amount = n => `${(n / 1e6).toFixed(2)} M`;
  return `${failure.name || "Error"} · ${failure.where || "document"}` + (size?.available ? L(
    ` · znaky: dokument ${amount(size.documentCharacters)}, zálohy ${amount(size.backupCharacters)}, ostatní ${amount(size.otherCharacters)}`,
    ` · characters: document ${amount(size.documentCharacters)}, backups ${amount(size.backupCharacters)}, other ${amount(size.otherCharacters)}`) : "");
}

/** A success clears only that key's failure. Recovery always retries the newest
 * pending value; an older asynchronous compression can never overwrite an edit. */
export function createLocalDocumentWriter({ getStorage, onChange = () => {}, recoverQuota }) {
  const pending = new Map(), failures = new Map();
  let recovery = null, lastFailure = null;
  const notify = () => onChange(failures.values().next().value || null);
  function fail(key, error, where, characters, serialization = false) {
    let sizes;
    try { sizes = storageSizeSummary(getStorage()); } catch { sizes = { available: false }; }
    lastFailure = { where, name: error?.name || "Error", kind: serialization ? "serialization" : storageFailureKind(error), attemptedCharacters: characters, sizes };
    failures.set(key, lastFailure);
    notify();
  }
  function attempt(key, item, recover = true) {
    try {
      getStorage().setItem(key, item.text);
      pending.delete(key); failures.delete(key); notify(); return true;
    } catch (error) {
      fail(key, error, item.where, item.text.length);
      if (recover && storageFailureKind(error) === "quota" && recoverQuota && !recovery) {
        recovery = Promise.resolve().then(recoverQuota).then(() => {
          // A queued daily archive may already have freed space before the
          // explicit compaction runs. Retry once even if compaction was a no-op.
          for (const [pendingKey, latest] of pending) attempt(pendingKey, latest, false);
        }).catch(() => { /* Preserve the original failure and every pending write. */ }).finally(() => { recovery = null; });
      }
      return false;
    }
  }
  return {
    write(key, value, where = key) {
      let text;
      try { text = JSON.stringify(value); if (typeof text !== "string") throw new TypeError("Document is not serializable"); }
      catch (error) { pending.delete(key); fail(key, error, where, 0, true); return false; }
      const item = { text, where }; pending.set(key, item); return attempt(key, item);
    },
    retry() { for (const [key, item] of pending) attempt(key, item); return failures.size === 0; },
    currentFailure: () => failures.values().next().value || null,
    lastFailure: () => lastFailure,
    settled: async () => { if (recovery) await recovery; },
    clearPending() { pending.clear(); failures.clear(); notify(); },
  };
}

async function transform(textOrBytes, Stream) {
  if (typeof Stream !== "function") throw new Error("CompressionUnavailable");
  return new Uint8Array(await new Response(new Blob([textOrBytes]).stream().pipeThrough(new Stream("gzip"))).arrayBuffer());
}
const toBase64 = bytes => {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 16384) binary += String.fromCharCode(...bytes.subarray(i, i + 16384));
  return btoa(binary);
};
const fromBase64 = text => Uint8Array.from(atob(text), c => c.charCodeAt(0));

export async function decodeRecoveryArchive(raw, { Decompress = globalThis.DecompressionStream } = {}) {
  if (!raw) return [];
  const value = JSON.parse(raw);
  if (Array.isArray(value)) return value;
  if (value?.format !== BACKUP_FORMAT || typeof value.data !== "string") throw new Error("UnknownBackupFormat");
  const plain = new TextDecoder("utf-8", { fatal: true }).decode(await transform(fromBase64(value.data), Decompress));
  const archive = JSON.parse(plain);
  if (!Array.isArray(archive)) throw new Error("InvalidBackupArchive");
  return archive;
}

export async function encodeRecoveryArchive(archive, { Compress = globalThis.CompressionStream, Decompress = globalThis.DecompressionStream } = {}) {
  if (!Array.isArray(archive)) throw new TypeError("InvalidBackupArchive");
  const plain = JSON.stringify(archive);
  // Older browsers can still save/read ordinary archives without deleting them.
  if (typeof Compress !== "function" || typeof Decompress !== "function") return plain;
  const packed = JSON.stringify({ format: BACKUP_FORMAT, data: toBase64(await transform(plain, Compress)) });
  if (JSON.stringify(await decodeRecoveryArchive(packed, { Decompress })) !== plain) throw new Error("BackupVerificationFailed");
  return packed.length < plain.length ? packed : plain;
}

/** All mutations are serialized, including compaction and daily snapshots.
 * Before replacement, recheck the exact old value to preserve other-tab writes.
 * setItem is atomic: failed compression/storage never removes the old archive. */
function defaultRecoveryStore(key) {
  try { const database = globalThis.indexedDB; return database ? createIndexedRecoveryStore({ indexedDB: database, key }) : null; }
  catch (error) {
    // Startup must survive a restricted getter, but an inaccessible migrated
    // archive must never be displayed as an empty one.
    return { read: async () => { throw error; }, compareAndSwap: async () => { throw error; } };
  }
}

export function createRecoveryArchive({ getStorage, key = "tanmay_zaloha_v1", codec = {}, durable = defaultRecoveryStore(key) }) {
  let queue = Promise.resolve();
  const enqueue = work => { const task = queue.then(work); queue = task.catch(() => {}); return task; };
  const combined = async (local, saved) => {
    const older = await decodeRecoveryArchive(saved, codec), legacy = await decodeRecoveryArchive(local, codec);
    // An older open tab can still append a local archive after migration.
    // Preserve distinct snapshots, even with the same date or timestamp.
    const seen = new Set();
    return [...older, ...legacy].filter(row => { const id = JSON.stringify(row); if (seen.has(id)) return false; seen.add(id); return true; })
      .sort((a, b) => (a.t || 0) - (b.t || 0));
  };
  const update = (change, allowLocalCompaction = false) => enqueue(async () => {
    for (let tries = 0; tries < 4; tries++) {
      const storage = getStorage(), before = storage.getItem(key);
      let saved = null;
      try { if (durable) saved = await durable.read(); }
      catch (error) {
        // No durable mutation was attempted. The legacy copy can still be
        // losslessly compacted in place, without pretending IDB is empty.
        if (allowLocalCompaction) return createRecoveryArchive({ getStorage, key, codec, durable: null }).compact();
        throw error;
      }
      const old = durable ? await combined(before, saved) : await decodeRecoveryArchive(before, codec);
      let next = change(old);
      if (next == null) return false;
      // A committed attempt may have to retry when a legacy tab writes late.
      // Reapplying an append must not duplicate the same undo snapshot.
      if (Array.isArray(next)) next = [...new Map(next.map(row => [JSON.stringify(row), row])).values()];
      const after = await encodeRecoveryArchive(next, codec);
      if (storage.getItem(key) !== before) continue;
      if (durable) {
        if (!await durable.compareAndSwap(saved, after)) continue;
        // Reopen/read after transaction completion, and verify the exact full
        // archive before releasing its old allocation. Failure keeps the copy.
        const verified = await durable.read();
        if (verified !== after) continue;
        if (JSON.stringify(await decodeRecoveryArchive(verified, codec)) !== JSON.stringify(next)) throw new Error("BackupVerificationFailed");
        if (storage.getItem(key) !== before) continue;
        if (before != null) storage.removeItem(key);
        return before != null || saved !== after;
      }
      if (after === before) return false;
      storage.setItem(key, after);
      return true;
    }
    throw new Error("BackupChangedInAnotherTab");
  });
  return {
    read: async () => durable ? combined(getStorage().getItem(key), await durable.read()) : decodeRecoveryArchive(getStorage().getItem(key), codec),
    inspect: async () => {
      const local = getStorage().getItem(key), saved = durable ? await durable.read() : null;
      const rows = durable ? await combined(local, saved) : await decodeRecoveryArchive(local, codec);
      return { count: rows.length, separateCharacters: saved?.length || 0, compressed: [local, saved].some(raw => raw && !raw.trimStart().startsWith("[")) };
    },
    update,
    compact: () => update(old => old.length ? old : null, true),
    settled: () => queue,
  };
}

/** Caller must durably archive the current pair before this synchronous step. */
export function restoreLocalDocumentPair(storage, snapshot) {
  const entries = [["tanmay_coll_v1", snapshot.coll], ["tanmay_edits_v1", snapshot.edits]].filter(([, value]) => value);
  for (const [, value] of entries) {
    if (typeof value !== "string") throw new TypeError("InvalidSnapshotDocument");
    const document = JSON.parse(value);
    if (!document || typeof document !== "object" || Array.isArray(document)) throw new TypeError("InvalidSnapshotDocument");
  }
  const original = entries.map(([key]) => [key, storage.getItem(key)]);
  try { for (const [key, value] of entries) storage.setItem(key, value); }
  catch (error) {
    // setItem is atomic for one key. Restore the complete old pair if the
    // second write failed. The caller's archive is the additional safety net.
    for (const [key, value] of original) {
      if (value == null) storage.removeItem(key); else storage.setItem(key, value);
    }
    throw error;
  }
}
