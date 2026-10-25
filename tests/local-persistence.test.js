import test from "node:test";
import assert from "node:assert/strict";
import { createLocalDocumentWriter, createRecoveryArchive, encodeRecoveryArchive, decodeRecoveryArchive, restoreLocalDocumentPair, storageFailureKind, storageSizeSummary, localSaveDiagnostic } from "../src/shared/product/localPersistence.js";

const COLL = "tanmay_coll_v1", EDITS = "tanmay_edits_v1", BACKUPS = "tanmay_zaloha_v1";
function memory(limit = Infinity) {
  const data = new Map();
  return {
    limit, get length() { return data.size; }, key: i => [...data.keys()][i] ?? null,
    getItem: key => data.get(key) ?? null,
    setItem(key, value) {
      const next = new Map(data); next.set(key, String(value));
      if ([...next.values()].reduce((sum, text) => sum + text.length, 0) > this.limit) throw new DOMException("Quota", "QuotaExceededError");
      data.set(key, String(value));
    },
    removeItem: key => data.delete(key),
  };
}
const snapshot = (id = 1) => ({ d: "2026-10-15", t: id, coll: JSON.stringify({ tEx: Array.from({ length: 100 }, (_, i) => ({ id: `ex_${i}`, cz: { n: "Dřep s oporou", pos: "Český popis 🏋️ ".repeat(30) }, custom: { unknown: id } })), journal: [{ id, text: "Private test text" }] }), edits: JSON.stringify({ "2026-10-14": { done: true } }) });

test("gzip archive round-trips all five snapshots, Unicode and unknown fields exactly", async () => {
  const original = Array.from({ length: 5 }, (_, i) => snapshot(i));
  const packed = await encodeRecoveryArchive(original);
  assert.ok(packed.length < JSON.stringify(original).length / 5);
  assert.deepEqual(await decodeRecoveryArchive(packed), original);
  assert.deepEqual(await decodeRecoveryArchive(JSON.stringify(original)), original);
});

test("reproduces backup/live growth contention then recovers without deleting any backup or unrelated storage", async () => {
  const storage = memory(), old = snapshot(), archive = [old];
  storage.setItem(COLL, old.coll); storage.setItem(EDITS, old.edits); storage.setItem(BACKUPS, JSON.stringify(archive)); storage.setItem("unrelated", "keep");
  storage.limit = storageSizeSummary(storage).totalCharacters + 10;
  const next = { ...JSON.parse(old.coll), added: "new exercise ".repeat(100) };
  assert.throws(() => storage.setItem(COLL, JSON.stringify(next)), { name: "QuotaExceededError" });
  const backups = createRecoveryArchive({ getStorage: () => storage });
  const writer = createLocalDocumentWriter({ getStorage: () => storage, recoverQuota: () => backups.compact() });
  assert.equal(writer.write(COLL, next, "coll"), false);
  assert.equal(writer.currentFailure().kind, "quota");
  await writer.settled();
  assert.deepEqual(JSON.parse(storage.getItem(COLL)), next);
  assert.deepEqual(await backups.read(), archive);
  assert.equal(storage.getItem("unrelated"), "keep");
  assert.equal(writer.currentFailure(), null);
  assert.equal(writer.lastFailure().name, "QuotaExceededError");
});

test("newest edit wins while asynchronous recovery is pending", async () => {
  const storage = memory(5);
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  const writer = createLocalDocumentWriter({ getStorage: () => storage, recoverQuota: async () => { await gate; storage.limit = 1000; return true; } });
  writer.write(COLL, { value: "old" }, "coll");
  writer.write(COLL, { value: "latest" }, "coll");
  release(); await writer.settled();
  assert.deepEqual(JSON.parse(storage.getItem(COLL)), { value: "latest" });
});

test("a daily snapshot queued first may free space before recovery compaction becomes a no-op", async () => {
  const storage = memory(), old = snapshot();
  storage.setItem(COLL, old.coll); storage.setItem(BACKUPS, JSON.stringify([old]));
  storage.limit = storageSizeSummary(storage).totalCharacters + 10;
  const backups = createRecoveryArchive({ getStorage: () => storage });
  const daily = backups.update(rows => rows);
  let changed;
  const writer = createLocalDocumentWriter({ getStorage: () => storage, recoverQuota: async () => { changed = await backups.compact(); return changed; } });
  const next = { ...JSON.parse(old.coll), note: 'new'.repeat(100) };
  assert.equal(writer.write(COLL, next, 'coll'), false);
  await daily; await writer.settled();
  assert.equal(changed, false, 'daily task already compressed the archive');
  assert.deepEqual(JSON.parse(storage.getItem(COLL)), next);
  assert.equal(writer.currentFailure(), null);
});

test("a successful independent edits write does not dismiss a collection failure", () => {
  const storage = memory(25), events = [];
  const writer = createLocalDocumentWriter({ getStorage: () => storage, onChange: event => events.push(event) });
  writer.write(COLL, { value: "too large ".repeat(10) }, "coll");
  assert.equal(writer.write(EDITS, {}, "edits"), true);
  assert.equal(events.at(-1).where, "coll");
  storage.limit = 1000;
  assert.equal(writer.retry(), true);
  assert.equal(events.at(-1), null);
});

test("security and serialization errors are distinct and never trigger quota recovery", async () => {
  let recovered = 0;
  const writer = createLocalDocumentWriter({ getStorage: () => { throw new DOMException("denied", "SecurityError"); }, recoverQuota: () => { recovered++; } });
  assert.equal(writer.write(COLL, {}, "coll"), false);
  assert.equal(writer.currentFailure().kind, "denied");
  const cyclic = {}; cyclic.self = cyclic;
  assert.equal(writer.write(COLL, cyclic, "coll"), false);
  assert.equal(writer.currentFailure().kind, "serialization");
  await writer.settled(); assert.equal(recovered, 0);
  assert.equal(storageFailureKind(new Error("other")), "unknown");
});

test("corrupted or unknown archives remain byte-for-byte untouched", async () => {
  for (const invalid of ["invalid json", '{"format":"tanmay-backups-gzip-v1","data":"bad!"}', '{"format":"future-v9","data":"opaque"}']) {
    const storage = memory(); storage.setItem(BACKUPS, invalid);
    const backups = createRecoveryArchive({ getStorage: () => storage });
    await assert.rejects(backups.compact());
    await assert.rejects(backups.update(() => [snapshot()]));
    assert.equal(storage.getItem(BACKUPS), invalid);
  }
});

test("no compression API preserves legacy snapshots and cannot falsely claim recovery", async () => {
  const storage = memory(), original = [snapshot()];
  storage.setItem(BACKUPS, JSON.stringify(original));
  const backups = createRecoveryArchive({ getStorage: () => storage, codec: { Compress: null, Decompress: null } });
  assert.equal(await backups.compact(), false);
  assert.deepEqual(await backups.read(), original);
  storage.limit = storage.getItem(BACKUPS).length;
  await assert.rejects(backups.update(rows => [...rows, snapshot(2)]), { name: "QuotaExceededError" });
  assert.deepEqual(await backups.read(), original);
});

test("another tab's archive change during compression is preserved when appending", async () => {
  const storage = memory(); storage.setItem(BACKUPS, JSON.stringify([snapshot(1)]));
  const backups = createRecoveryArchive({ getStorage: () => storage });
  const adding = backups.update(rows => [...rows, snapshot(3)]);
  // The queued operation begins, then waits for compression. Another tab wins.
  await Promise.resolve(); await Promise.resolve();
  storage.setItem(BACKUPS, JSON.stringify([snapshot(1), snapshot(2)]));
  await adding;
  assert.deepEqual((await backups.read()).map(row => row.t), [1, 2, 3]);
});

test("concurrent archive mutations are serialized with no lost snapshots", async () => {
  const storage = memory(), backups = createRecoveryArchive({ getStorage: () => storage });
  await Promise.all([backups.update(rows => [...rows, snapshot(1)]), backups.compact(), backups.update(rows => [...rows, snapshot(2)])]);
  assert.deepEqual((await backups.read()).map(row => row.t), [1, 2]);
});

test("diagnostic summaries contain sizes and exception types, never private key names or record text", () => {
  const storage = memory(); storage.setItem(COLL, '{"secret":"private text"}'); storage.setItem("personal-account-name", "private value");
  const details = { name: "QuotaExceededError", where: "coll", sizes: storageSizeSummary(storage) };
  const diagnostic = localSaveDiagnostic(details, (_, en) => en);
  assert.ok(diagnostic.includes("QuotaExceededError"));
  assert.doesNotMatch(JSON.stringify(details) + diagnostic, /private|personal-account-name/);
});

test("restoring a decoded gzip snapshot replaces both documents; a failed second write restores both originals", async () => {
  const storage = memory(), old = snapshot(1), current = snapshot(2);
  storage.setItem(COLL, current.coll); storage.setItem(EDITS, current.edits);
  const [decoded] = await decodeRecoveryArchive(await encodeRecoveryArchive([old]));
  restoreLocalDocumentPair(storage, decoded);
  assert.equal(storage.getItem(COLL), old.coll); assert.equal(storage.getItem(EDITS), old.edits);
  const write = storage.setItem.bind(storage);
  storage.setItem = (key, value) => { if (key === EDITS && value === '{"fail":true}') throw new DOMException("Quota", "QuotaExceededError"); write(key, value); };
  assert.throws(() => restoreLocalDocumentPair(storage, { coll: current.coll, edits: '{"fail":true}' }), { name: "QuotaExceededError" });
  assert.equal(storage.getItem(COLL), old.coll); assert.equal(storage.getItem(EDITS), old.edits);
});

test("malformed snapshot document is rejected before either active key changes", () => {
  const storage = memory(), old = snapshot(); storage.setItem(COLL, old.coll); storage.setItem(EDITS, old.edits);
  for (const bad of ['{', 'null', '[]', '"text"']) {
    assert.throws(() => restoreLocalDocumentPair(storage, { coll: '{"new":true}', edits: bad }));
    assert.equal(storage.getItem(COLL), old.coll); assert.equal(storage.getItem(EDITS), old.edits);
  }
});

function separateStore(initial = null) {
  let value = initial;
  return { read: async () => value, compareAndSwap: async (expected, next) => { if (value !== expected) return false; value = next; return true; } };
}

test("already compressed five-day archive moves intact and frees quota for the newest plain document", async () => {
  const storage = memory(), original = Array.from({ length: 5 }, (_, i) => snapshot(i)), durable = separateStore();
  const packed = await encodeRecoveryArchive(original);
  storage.setItem(COLL, original[0].coll); storage.setItem(BACKUPS, packed); storage.setItem("unrelated", "keep");
  storage.limit = storageSizeSummary(storage).totalCharacters;
  const archive = createRecoveryArchive({ getStorage: () => storage, durable });
  const writer = createLocalDocumentWriter({ getStorage: () => storage, recoverQuota: () => archive.compact() });
  const newest = { ...JSON.parse(original[0].coll), note: "saved after migration" };
  assert.equal(writer.write(COLL, newest, "coll"), false);
  await writer.settled();
  assert.equal(writer.currentFailure(), null);
  assert.deepEqual(JSON.parse(storage.getItem(COLL)), newest);
  assert.equal(storage.getItem(BACKUPS), null);
  assert.equal(storage.getItem("unrelated"), "keep");
  const reopened = createRecoveryArchive({ getStorage: () => storage, durable });
  assert.deepEqual(await reopened.read(), original);
  assert.equal((await reopened.inspect()).count, 5);
  assert.ok((await reopened.inspect()).separateCharacters > 0);
  restoreLocalDocumentPair(storage, (await reopened.read())[0]);
  assert.equal(storage.getItem(COLL), original[0].coll);
});

test("failed durable writes never release the original archive or falsely resolve pending documents", async () => {
  const storage = memory(), raw = await encodeRecoveryArchive([snapshot()]); storage.setItem(BACKUPS, raw);
  storage.limit = raw.length;
  const archive = createRecoveryArchive({ getStorage: () => storage, durable: { read: async () => null, compareAndSwap: async () => { throw new DOMException("Quota", "QuotaExceededError"); } } });
  const writer = createLocalDocumentWriter({ getStorage: () => storage, recoverQuota: () => archive.compact() });
  writer.write(COLL, { newest: "keep in memory" }); await writer.settled();
  assert.equal(writer.currentFailure().kind, "quota");
  assert.equal(storage.getItem(BACKUPS), raw);
  storage.limit = Infinity; assert.equal(writer.retry(), true);
  assert.deepEqual(JSON.parse(storage.getItem(COLL)), { newest: "keep in memory" });
});

test("another tab's legacy append after committed migration is merged without collapsing equal timestamps", async () => {
  const storage = memory(), first = snapshot(1), other = { ...snapshot(1), coll: '{"different":"same time"}' };
  storage.setItem(BACKUPS, JSON.stringify([first]));
  const durable = separateStore(), read = durable.read; let reads = 0;
  durable.read = async () => { if (++reads === 2) storage.setItem(BACKUPS, JSON.stringify([first, other])); return read(); };
  const archive = createRecoveryArchive({ getStorage: () => storage, durable });
  await archive.compact();
  assert.deepEqual(await archive.read(), [first, other]);
  assert.equal(storage.getItem(BACKUPS), null);
});

test("simultaneous archive instances use compare-and-swap to preserve both new snapshots", async () => {
  const storage = memory(), durable = separateStore();
  const one = createRecoveryArchive({ getStorage: () => storage, durable });
  const two = createRecoveryArchive({ getStorage: () => storage, durable });
  await Promise.all([one.update(rows => [...rows, snapshot(1)]), two.update(rows => [...rows, snapshot(2)])]);
  assert.deepEqual((await one.read()).map(row => row.t), [1, 2]);
});

test("retry after a late legacy write cannot duplicate the same restore undo snapshot", async () => {
  const storage = memory(), durable = separateStore(), read = durable.read;
  storage.setItem(BACKUPS, JSON.stringify([snapshot(1)])); let reads = 0;
  durable.read = async () => { if (++reads === 2) storage.setItem(BACKUPS, JSON.stringify([snapshot(1), snapshot(2)])); return read(); };
  const archive = createRecoveryArchive({ getStorage: () => storage, durable });
  await archive.update(rows => [...rows, snapshot(3)]);
  assert.deepEqual((await archive.read()).map(row => row.t), [1, 2, 3]);
});

test("unverified or corrupt separate archives cannot replace the legacy recovery copy", async () => {
  const storage = memory(), raw = JSON.stringify([snapshot()]); storage.setItem(BACKUPS, raw);
  const corrupt = createRecoveryArchive({ getStorage: () => storage, durable: separateStore("invalid") });
  await assert.rejects(corrupt.compact()); assert.equal(storage.getItem(BACKUPS), raw);
  const unverified = createRecoveryArchive({ getStorage: () => storage, durable: { read: async () => null, compareAndSwap: async () => true } });
  await assert.rejects(unverified.compact(), /BackupChangedInAnotherTab/);
  assert.equal(storage.getItem(BACKUPS), raw);
});

test("a too-large live document stays visibly pending even after all archives move successfully", async () => {
  const storage = memory(1000), durable = separateStore(); storage.setItem(BACKUPS, '[]');
  const archive = createRecoveryArchive({ getStorage: () => storage, durable });
  const writer = createLocalDocumentWriter({ getStorage: () => storage, recoverQuota: () => archive.compact() });
  writer.write(COLL, { value: "x".repeat(2000) }); await writer.settled();
  assert.equal(writer.currentFailure().kind, "quota"); assert.equal(storage.getItem(COLL), null);
});

test("a throwing IndexedDB getter cannot prevent startup or legacy archive recovery", async () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, "indexedDB");
  Object.defineProperty(globalThis, "indexedDB", { configurable: true, get() { throw new DOMException("denied", "SecurityError"); } });
  try {
    const storage = memory(); storage.setItem(BACKUPS, JSON.stringify([snapshot()]));
    const archive = createRecoveryArchive({ getStorage: () => storage });
    await archive.compact(); assert.deepEqual(await decodeRecoveryArchive(storage.getItem(BACKUPS)), [snapshot()]);
    await assert.rejects(archive.read(), { name: "SecurityError" });
    await assert.rejects(archive.inspect(), { name: "SecurityError" });
  } finally { if (descriptor) Object.defineProperty(globalThis, "indexedDB", descriptor); else delete globalThis.indexedDB; }
});

test("unavailable IndexedDB permits local-only compaction but never silently returns an empty durable archive", async () => {
  const storage = memory(), original = [snapshot()]; storage.setItem(BACKUPS, JSON.stringify(original));
  const archive = createRecoveryArchive({ getStorage: () => storage, durable: { read: async () => { throw new DOMException("denied", "SecurityError"); } } });
  await archive.compact();
  assert.deepEqual(await decodeRecoveryArchive(storage.getItem(BACKUPS)), original);
  assert.ok(storage.getItem(BACKUPS).length < JSON.stringify(original).length);
  await assert.rejects(archive.read(), { name: "SecurityError" });
  await assert.rejects(archive.update(rows => [...rows, snapshot(2)]), { name: "SecurityError" });
});
