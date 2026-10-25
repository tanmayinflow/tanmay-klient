// Main-only durable document pair. The legacy keys remain ordinary JSON.
export const MAIN_DOCUMENT_KEYS = { coll: "tanmay_coll_v1", edits: "tanmay_edits_v1" };
export const MAIN_DOCUMENT_NOTICE_KEY = "tm_document_notice_v1";
const FORMAT = "tanmay-documents-v1";
const fail = (name, detail = {}) => Object.assign(new Error(name), { name, ...detail });
const samePair = (a, b) => a.coll === b.coll && a.edits === b.edits;
function validatePair(pair) {
  if (!pair || typeof pair !== "object") throw fail("InvalidLocalDocument");
  for (const key of ["coll", "edits"]) {
    const raw = pair[key];
    if (raw === null) continue;
    if (typeof raw !== "string") throw fail("InvalidLocalDocument");
    const value = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) throw fail("InvalidLocalDocument");
  }
  return { coll: pair.coll, edits: pair.edits };
}
function decode(raw) {
  if (raw === null) return null;
  if (typeof raw !== "string") throw fail("InvalidDocumentStorage");
  const row = JSON.parse(raw);
  if (row?.format !== FORMAT || row?.owner !== "main" || !Number.isSafeInteger(row.revision) || row.revision < 1) throw fail("InvalidDocumentStorage");
  validatePair(row.pair); validatePair(row.baseline);
  return row;
}

// One transaction commits the entire pair and, when resolving a branch, both
// pre-choice snapshots. Request success is not treated as a committed write.
function indexedBackend(database) {
  let opening;
  const open = () => {
    if (!opening) opening = new Promise((resolve, reject) => {
      const request = database.open("tanmay_documents_v1", 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore("documents");
        request.result.createObjectStore("archives", { autoIncrement: true });
      };
      request.onerror = () => reject(request.error || fail("DocumentStorageUnavailable"));
      request.onblocked = () => reject(fail("DocumentStorageBlocked"));
      request.onsuccess = () => {
        const db = request.result;
        db.onversionchange = () => { db.close(); opening = null; };
        resolve(db);
      };
    }).catch(error => { opening = null; throw error; });
    return opening;
  };
  async function transaction(expected, next, archive, writing) {
    const db = await open();
    return new Promise((resolve, reject) => {
      let tx;
      const stores = writing && archive ? ["documents", "archives"] : ["documents"];
      try { tx = db.transaction(stores, writing ? "readwrite" : "readonly", { durability: "strict" }); }
      catch (error) { if (error?.name !== "TypeError") { reject(error); return; } tx = db.transaction(stores, writing ? "readwrite" : "readonly"); }
      let result = writing ? false : null;
      const store = tx.objectStore("documents"), request = store.get("main");
      request.onsuccess = () => {
        const current = request.result ?? null;
        if (!writing) result = current;
        else if (current === expected) {
          if (archive) tx.objectStore("archives").add(archive);
          store.put(next, "main"); result = true;
        }
      };
      tx.oncomplete = () => resolve(result);
      tx.onabort = () => reject(tx.error || fail("DocumentStorageAborted"));
      tx.onerror = () => {};
    });
  }
  return { read: () => transaction(null, null, null, false), commit: (expected, next, archive = null) => transaction(expected, next, archive, true) };
}

export function createMainDocumentStore({ getStorage, getDatabase = () => globalThis.indexedDB, onChange = () => {}, backend: injected } = {}) {
  let backend, discovered = false, initialized = false, record = null, rawRecord = null, cache = null, queue = Promise.resolve(), channel = null, removeNotice = null;
  let lastBranch = null, generation = 0, readEpoch = 0;
  const emit = event => { try { onChange(event); } catch {} };
  const enqueue = work => { const task = queue.then(work); queue = task.catch(() => {}); return task; };
  const storage = () => getStorage();
  const legacy = () => validatePair({ coll: storage().getItem(MAIN_DOCUMENT_KEYS.coll), edits: storage().getItem(MAIN_DOCUMENT_KEYS.edits) });
  function discover() {
    if (!discovered) {
      // A denied getter/open must not be confused with a genuinely absent API.
      const database = injected === undefined ? getDatabase() : null;
      backend = injected === undefined ? (database ? indexedBackend(database) : null) : injected;
      discovered = true;
    }
    return backend;
  }
  function notices() {
    if (removeNotice || typeof window === "undefined") return;
    const receive = event => { if (event.key === MAIN_DOCUMENT_NOTICE_KEY) emit({ type: "external" }); };
    window.addEventListener("storage", receive); removeNotice = () => window.removeEventListener("storage", receive);
    try { if (typeof BroadcastChannel === "function") { channel = new BroadcastChannel("tanmay-main-document-v1"); channel.onmessage = () => emit({ type: "external" }); } } catch {}
  }
  function branch(local, row, raw, notify = true) {
    const error = fail("DocumentBranchConflict", { durable: { ...row.pair }, legacy: { ...local }, revision: row.revision });
    lastBranch = { legacy: { ...local }, raw };
    if (notify) emit({ type: "conflict", error });
    return error;
  }
  async function readCurrent() {
    const target = discover(), raw = target ? await target.read() : null, row = decode(raw);
    // Read again after asynchronous I/O; an old bundle may have written meanwhile.
    const latestLegacy = legacy();
    // Read callers already receive this rejection. Broadcasting it here would
    // recursively trigger App's refresh handler and create an endless loop.
    if (row && !samePair(latestLegacy, row.baseline)) throw branch(latestLegacy, row, raw, false);
    if (raw !== rawRecord) readEpoch++;
    rawRecord = raw; record = row; cache = row ? { ...row.pair } : latestLegacy; initialized = true;
    lastBranch = null; notices();
    return { ...cache };
  }
  function entriesPair(entries, base) {
    const next = { ...base };
    for (const [key, value] of Array.isArray(entries) ? entries : Object.entries(entries)) {
      const field = key === MAIN_DOCUMENT_KEYS.coll || key === "coll" ? "coll" : key === MAIN_DOCUMENT_KEYS.edits || key === "edits" ? "edits" : null;
      if (!field) throw fail("UnknownDocumentKey");
      next[field] = value;
    }
    return validatePair(next);
  }
  async function commitPair(pair, expectedRaw, baseline, archive = null, notifyConflicts = true) {
    const target = discover();
    if (!target) throw fail("DocumentStorageUnavailable");
    const previous = decode(expectedRaw), next = { format: FORMAT, owner: "main", revision: (previous?.revision || 0) + 1, pair, baseline, updatedAt: Date.now() }, text = JSON.stringify(next);
    if (previous && !samePair(legacy(), baseline)) throw branch(legacy(), previous, expectedRaw, notifyConflicts);
    if (!await target.commit(expectedRaw, text, archive)) {
      const remoteRaw = await target.read(), remote = decode(remoteRaw);
      const error = fail("DocumentRevisionConflict", { durable: remote?.pair || null, legacy: legacy(), local: pair });
      if (notifyConflicts) emit({ type: "conflict", error }); throw error;
    }
    const readback = await target.read();
    if (readback !== text) {
      const remote = decode(readback), error = fail("DocumentRevisionConflict", { durable: remote?.pair || null, legacy: legacy(), local: pair });
      if (notifyConflicts) emit({ type: "conflict", error }); throw error;
    }
    decode(readback); // Validate before acknowledging or updating the persisted cache.
    const latestLegacy = legacy();
    if (!samePair(latestLegacy, baseline)) throw branch(latestLegacy, next, text, notifyConflicts);
    rawRecord = text; record = next; cache = { ...pair }; initialized = true; lastBranch = null; notices();
    const notice = { revision: next.revision, at: Date.now() };
    try { storage().setItem(MAIN_DOCUMENT_NOTICE_KEY, JSON.stringify(notice)); } catch {}
    try { channel?.postMessage(notice); } catch {}
    emit({ type: "saved", revision: next.revision });
    return { ...cache };
  }
  const save = entries => {
    const request = ++generation, requestEpoch = readEpoch, initializedAtRequest = initialized, requestedBase = record ? { ...cache } : null;
    // Capture caller input before awaiting a previous operation.
    const captured = Array.isArray(entries) ? entries.map(([key, value]) => [key, value]) : { ...entries };
    return enqueue(async () => {
      if (!initialized) await readCurrent();
      // A queued refresh can discover another tab before this queued write
      // begins. Never borrow its newly observed revision to commit an old edit.
      // App also pauses new write submissions until it accepts/resolves that view.
      if (initializedAtRequest && requestEpoch !== readEpoch) {
        const error = fail("DocumentRevisionConflict", { durable: record?.pair || null, legacy: legacy(), local: requestedBase ? entriesPair(captured, requestedBase) : null });
        emit({ type: "conflict", error }); throw error;
      }
      const local = legacy();
      if (record && !samePair(local, record.baseline)) throw branch(local, record, rawRecord);
      const pair = entriesPair(captured, record ? cache : local);
      const result = await commitPair(pair, rawRecord, record ? record.baseline : local);
      return { ...result, generation: request };
    });
  };
  return {
    initialize: () => enqueue(readCurrent),
    refresh: () => enqueue(readCurrent),
    getItem(key) {
      if (!initialized) throw fail("DocumentStorageNotReady");
      const field = key === MAIN_DOCUMENT_KEYS.coll ? "coll" : key === MAIN_DOCUMENT_KEYS.edits ? "edits" : null;
      if (!field) return storage().getItem(key);
      return record ? cache[field] : storage().getItem(key);
    },
    isActive: () => !!record,
    save,
    restorePair: snapshot => {
      // Historical snapshots can lack one document. Match the legacy restore:
      // absent/empty fields preserve today's other document, especially edits.
      const entries = [["coll", snapshot.coll], ["edits", snapshot.edits]].filter(([, value]) => value);
      if (entries.length) return save(entries);
      return enqueue(async () => { if (!initialized) await readCurrent(); return record ? { ...cache } : legacy(); });
    },
    resolveBranch: choice => enqueue(async () => {
      if (choice !== "durable" && choice !== "legacy") throw fail("InvalidDocumentChoice");
      const target = discover(); if (!target) throw fail("DocumentStorageUnavailable");
      const raw = await target.read(), row = decode(raw), local = legacy();
      if (!row) throw fail("DocumentBranchMissing");
      if (lastBranch && (lastBranch.raw !== raw || !samePair(lastBranch.legacy, local))) throw branch(local, row, raw, false);
      const pair = choice === "durable" ? row.pair : local;
      const archive = { format: "tanmay-document-branch-v1", owner: "main", at: Date.now(), choice, durable: row.pair, legacy: local, previousRecord: raw };
      return commitPair(pair, raw, local, archive, false);
    }),
    settled: () => queue,
    close() { try { channel?.close(); } catch {} channel = null; removeNotice?.(); removeNotice = null; },
  };
}

export const mainDocuments = createMainDocumentStore({
  getStorage: () => window.localStorage,
  // Own completed saves can be older than React's newest pending edit. Only
  // external changes/conflicts should ask App to refresh and compare documents.
  onChange: event => { if (event.type !== "saved" && typeof window !== "undefined") window.dispatchEvent(new CustomEvent("tm-document-storage-change", { detail: event })); },
});
export const initializeMainDocuments = () => mainDocuments.initialize();
