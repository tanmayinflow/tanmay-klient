import { test } from "node:test";
import assert from "node:assert/strict";
import { makeD1 } from "./helpers/env.js";
import { STATE_LIMIT, STATE_CHUNK_BYTES, ensureStateStorage, encodeState, readStateMeta, readStateDocument, writeStateDocument } from "../src/shared/product/stateStorage.js";

async function setup() {
  const db = makeD1();
  await db.prepare("CREATE TABLE state (user_id TEXT PRIMARY KEY, doc TEXT NOT NULL, version INTEGER NOT NULL, updated_at INTEGER NOT NULL)").run();
  await ensureStateStorage(db);
  return db;
}

test("large Unicode state round-trips across bounded rows; original legacy row survives", async () => {
  const db = await setup();
  const legacy = { coll: { note: "původní kopie" }, edits: {}, rev: 8 };
  await db.prepare("INSERT INTO state VALUES (?, ?, ?, ?)").bind("a", JSON.stringify(legacy), 12, 1).run();
  assert.deepEqual((await readStateDocument(db, "a")).doc, legacy);
  const doc = { coll: { note: "Příliš žluťoučký 🧘🏽🌲".repeat(110000) }, edits: { today: "nový zápis" }, rev: 9 };
  const encoded = encodeState(doc);
  assert.ok(encoded.bytes.length > 2000000);
  const receipt = await writeStateDocument(db, "a", encoded, { checkRev: true });
  assert.equal(receipt.version, 13);
  assert.deepEqual((await readStateDocument(db, "a")).doc, doc);
  assert.equal((await readStateMeta(db, "a")).bytes, new TextEncoder().encode(JSON.stringify(doc)).length);
  const sizes = await db.prepare("SELECT length(CAST(data AS BLOB)) AS size FROM state_chunks").all();
  assert.ok(sizes.results.length > 2);
  assert.ok(sizes.results.every(row => row.size <= STATE_CHUNK_BYTES));
  assert.equal((await db.prepare("SELECT doc FROM state WHERE user_id = ?").bind("a").first()).doc, JSON.stringify(legacy));
  const smaller = { coll: { note: "small again" }, rev: 10 };
  await writeStateDocument(db, "a", encodeState(smaller), { expectedVersion: 13 });
  assert.deepEqual((await readStateDocument(db, "a")).doc, smaller);
  assert.equal((await db.prepare("SELECT count(*) AS n FROM state_chunks WHERE user_id = ?").bind("a").first()).n, 1);
});

test("failed middle chunk rolls back head, chunks and related metadata", async () => {
  const db = await setup();
  const doc = { coll: { note: "saved" }, rev: 1 };
  await writeStateDocument(db, "a", encodeState(doc));
  await db.prepare("CREATE TABLE marker (value TEXT)").run();
  await db.prepare("INSERT INTO marker VALUES ('before')").run();
  await db.prepare("CREATE TRIGGER fail_chunk BEFORE INSERT ON state_chunks WHEN NEW.part = 1 BEGIN SELECT RAISE(ABORT, 'simulated write failure'); END").run();
  await assert.rejects(writeStateDocument(db, "a", encodeState({ coll: { note: "x".repeat(2100000) }, rev: 2 }), {
    extraStatements: () => [db.prepare("UPDATE marker SET value = 'after'")],
  }));
  assert.deepEqual((await readStateDocument(db, "a")).doc, doc);
  assert.equal((await readStateMeta(db, "a")).version, 1);
  assert.equal((await db.prepare("SELECT value FROM marker").first()).value, "before");
});

test("concurrent writes accept exactly one version and stale revisions cannot overwrite", async () => {
  const db = await setup();
  await writeStateDocument(db, "a", encodeState({ coll: {}, rev: 1 }));
  const docs = ["first", "second"].map(note => ({ coll: { note }, rev: 2 }));
  const results = await Promise.allSettled(docs.map(doc => writeStateDocument(db, "a", encodeState(doc), { expectedVersion: 1, checkRev: true })));
  assert.equal(results.filter(r => r.status === "fulfilled").length, 1);
  assert.equal(results.find(r => r.status === "rejected").reason.code, "conflict");
  const winner = docs[results.findIndex(r => r.status === "fulfilled")];
  assert.deepEqual((await readStateDocument(db, "a")).doc, winner);
  await assert.rejects(writeStateDocument(db, "a", encodeState({ coll: {}, rev: 1 }), { checkRev: true }), { code: "conflict" });
});

test("chunk storage isolates accounts and rejects missing or changed chunks", async () => {
  const db = await setup();
  await writeStateDocument(db, "a", encodeState({ private: "A" }));
  await writeStateDocument(db, "b", encodeState({ private: "B" }));
  assert.deepEqual((await readStateDocument(db, "b")).doc, { private: "B" });
  assert.equal((await readStateDocument(db, "unknown")).doc, null);
  await db.prepare("UPDATE state_chunks SET data = ? WHERE user_id = ?").bind('{"private":"X"}', "a").run();
  await assert.rejects(readStateDocument(db, "a"), { code: "corrupt" });
  assert.deepEqual((await readStateDocument(db, "b")).doc, { private: "B" });
  await db.prepare("DELETE FROM state_chunks WHERE user_id = ?").bind("b").run();
  await assert.rejects(readStateDocument(db, "b"), { code: "corrupt" });
});

test("size guard counts UTF-8 bytes, not JavaScript characters", () => {
  assert.throws(() => encodeState({ text: "ž".repeat(STATE_LIMIT / 2) }), { code: "too-large", status: 413 });
});
