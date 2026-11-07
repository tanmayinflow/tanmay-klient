import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { makeD1 } from './helpers/env.js';
import { STATE_LIMIT, encodeState, readStateDocument, writeStateDocument } from '../src/shared/product/stateStorage.js';
import { ensureStateTransport, handleStateTransport, STATE_TRANSPORT_PART_BYTES, STATE_TRANSPORT_READ_CHARS } from '../src/shared/product/stateTransportServer.js';

const hash = text => createHash('sha256').update(text).digest('hex');
const size = text => Buffer.byteLength(text);
async function setup() {
  const db = makeD1();
  await db.prepare('CREATE TABLE state (user_id TEXT PRIMARY KEY,doc TEXT NOT NULL,version INTEGER NOT NULL,updated_at INTEGER NOT NULL)').run();
  await ensureStateTransport(db);
  return db;
}
async function call(db, action, body, userId = 'a', options = {}) {
  const request = new Request(`https://test.invalid/api/state?transport=chunks&action=${action}`, body === undefined ? {} : { method: 'PUT', body: JSON.stringify(body) });
  const response = await handleStateTransport(request, { db, userId, ...options });
  return { status: response.status, ...await response.json() };
}
function split(text) {
  const bytes = Buffer.from(text), parts = [];
  for (let start = 0; start < bytes.length;) {
    let end = Math.min(start + STATE_TRANSPORT_PART_BYTES, bytes.length);
    while (end < bytes.length && (bytes[end] & 0xc0) === 0x80) end--;
    parts.push(bytes.subarray(start, end).toString('utf8')); start = end;
  }
  return parts;
}
async function begin(db, doc, { userId = 'a', baseVersion, extra = {}, options = {} } = {}) {
  const text = JSON.stringify(doc), parts = split(text);
  const started = await call(db, 'start', { baseVersion, rev: doc.rev || 0, bytes: size(text), sha256: hash(text), parts: parts.length, ...extra }, userId, options);
  assert.equal(started.status, 200, JSON.stringify(started));
  return { uploadId: started.uploadId, parts, text, userId, options };
}
async function fill(db, upload) {
  for (const [part, data] of upload.parts.entries()) {
    const saved = await call(db, 'part', { uploadId: upload.uploadId, part, data, sha256: hash(data) }, upload.userId, upload.options);
    assert.equal(saved.status, 200, JSON.stringify(saved));
    assert.equal(saved.bytes, size(data)); assert.equal(saved.part, part);
  }
}
async function receive(db, userId = 'a') {
  const manifest = await call(db, 'manifest', undefined, userId);
  assert.equal(manifest.status, 200);
  if (manifest.empty) return null;
  const output = [];
  for (const descriptor of manifest.chunks) {
    const part = await call(db, `read&version=${manifest.version}&part=${descriptor.part}&offset=${descriptor.offset}`, undefined, userId);
    assert.equal(part.status, 200, JSON.stringify(part));
    assert.equal([...part.data].length, descriptor.length);
    assert.ok(descriptor.length <= STATE_TRANSPORT_READ_CHARS);
    assert.ok(size(part.data) <= STATE_TRANSPORT_READ_CHARS * 4);
    output.push(part.data);
  }
  const text = output.join('');
  assert.equal(size(text), manifest.bytes);
  if (manifest.sha256) assert.equal(hash(text), manifest.sha256);
  return JSON.parse(text);
}

test('bounded transport reads legacy and 750 kB rows then atomically round-trips a 4.3 MB Unicode document', async () => {
  const db = await setup(), legacy = { rev: 1, note: 'Původní zápis 🧘🏽'.repeat(5000) };
  await db.prepare('INSERT INTO state VALUES (?,?,?,?)').bind('a', JSON.stringify(legacy), 5, 1).run();
  assert.deepEqual(await receive(db), legacy);
  const old = { rev: 2, note: '🌲ž'.repeat(250000) };
  await writeStateDocument(db, 'a', encodeState(old), { expectedVersion: 5 });
  assert.deepEqual(await receive(db), old);
  const doc = { rev: 3, note: 'Příliš žluťoučký 🧘🏽🌲'.repeat(120000) };
  const upload = await begin(db, doc, { baseVersion: 6, options: { checkRev: true } });
  assert.ok(size(upload.text) > 4300000);
  await fill(db, upload);
  assert.deepEqual(await receive(db), old);
  const receipt = await call(db, 'commit', { uploadId: upload.uploadId });
  assert.equal(receipt.status, 200); assert.equal(receipt.version, 7);
  assert.deepEqual(await receive(db), doc);
  assert.deepEqual((await readStateDocument(db, 'a')).doc, doc);
  assert.equal(db._raw.prepare('SELECT doc FROM state').get().doc, JSON.stringify(legacy));
  assert.equal(db._raw.prepare('SELECT count(*) AS n FROM state_upload_parts').get().n, 0);
});

test('interrupted upload, expired token and replacement start preserve the previous document', async () => {
  const db = await setup(), old = { rev: 1, note: 'saved' };
  await writeStateDocument(db, 'a', encodeState(old));
  const pending = await begin(db, { rev: 2, note: 'x'.repeat(400000) }, { baseVersion: 1 });
  const data = pending.parts[0];
  await call(db, 'part', { uploadId: pending.uploadId, part: 0, data, sha256: hash(data) });
  assert.equal((await call(db, 'commit', { uploadId: pending.uploadId })).code, 'transport-incomplete');
  assert.deepEqual(await receive(db), old);
  db._raw.prepare('UPDATE state_uploads SET created_at=0').run();
  assert.equal((await call(db, 'part', { uploadId: pending.uploadId, part: 0, data, sha256: hash(data) })).status, 409);
  const next = await begin(db, { rev: 3, note: 'next' }, { baseVersion: 1 });
  assert.equal(db._raw.prepare('SELECT count(*) AS n FROM state_upload_parts').get().n, 0);
  assert.equal((await call(db, 'commit', { uploadId: pending.uploadId })).status, 409);
  await fill(db, next);
  assert.equal((await call(db, 'commit', { uploadId: next.uploadId })).status, 200);
  assert.deepEqual(await receive(db), { rev: 3, note: 'next' });
});

test('concurrent duplicate commits are idempotent and cannot remove the winning chunks', async () => {
  const db = await setup(), doc = { rev: 1, note: '🌲'.repeat(150000) };
  const upload = await begin(db, doc); await fill(db, upload);
  const prepare = db.prepare.bind(db);
  let release; const gate = new Promise(resolve => { release = resolve; }); let seen = 0;
  db.prepare = sql => {
    const stmt = prepare(sql);
    if (!sql.startsWith('SELECT token,base_version,metadata,created_at FROM state_uploads')) return stmt;
    return { ...stmt, bind(...args) {
      const bound = stmt.bind(...args);
      return { ...bound, async first() { const row = await bound.first(); if (++seen === 2) release(); await gate; return row; } };
    } };
  };
  const receipts = await Promise.all([call(db, 'commit', { uploadId: upload.uploadId }), call(db, 'commit', { uploadId: upload.uploadId })]);
  db.prepare = prepare;
  assert.equal(seen, 2);
  assert.ok(receipts.every(receipt => receipt.status === 200 && receipt.version === 1));
  assert.deepEqual(await receive(db), doc);
  assert.equal((await call(db, 'commit', { uploadId: upload.uploadId })).version, 1);
  assert.deepEqual((await readStateDocument(db, 'a')).doc, doc);
});

test('stale compare-and-swap, revisions and mixed-version reads fail without overwriting', async () => {
  const db = await setup(); await writeStateDocument(db, 'a', encodeState({ rev: 10, note: 'old' }));
  const text = JSON.stringify({ rev: 9 });
  assert.equal((await call(db, 'start', { rev: 9, parts: 1, bytes: size(text), sha256: hash(text) }, 'a', { checkRev: true })).status, 409);
  const pending = await begin(db, { rev: 11, note: 'pending' }, { options: { checkRev: true } }); await fill(db, pending);
  const newer = { rev: 12, note: 'newer' }; await writeStateDocument(db, 'a', encodeState(newer), { expectedVersion: 1 });
  assert.equal((await call(db, 'commit', { uploadId: pending.uploadId })).code, 'conflict');
  assert.equal((await call(db, 'read&version=1&part=0&offset=1')).status, 409);
  assert.deepEqual(await receive(db), newer);
});

test('checksums, UTF-8 limits, declared totals and account boundaries are enforced before commit', async () => {
  const db = await setup(), upload = await begin(db, { rev: 1, note: 'private A' });
  const data = upload.parts[0], body = { uploadId: upload.uploadId, part: 0, data, sha256: hash(data) };
  assert.equal((await call(db, 'part', { ...body, sha256: '0'.repeat(64) })).code, 'transport-checksum');
  assert.equal((await call(db, 'part', body, 'b')).status, 409);
  assert.equal((await call(db, 'commit', { uploadId: upload.uploadId }, 'b')).status, 409);
  const huge = 'ž'.repeat(STATE_TRANSPORT_PART_BYTES);
  assert.equal((await call(db, 'part', { ...body, data: huge, sha256: hash(huge) })).status, 413);
  const excess = data + 'x';
  assert.equal((await call(db, 'part', { ...body, data: excess, sha256: hash(excess) })).status, 409);
  assert.equal((await call(db, 'start', { rev: 1, parts: 60, bytes: STATE_LIMIT + 1, sha256: hash(data) })).status, 413);
  assert.equal((await call(db, 'manifest', undefined, 'b')).empty, true);
  await fill(db, upload); assert.equal((await call(db, 'commit', { uploadId: upload.uploadId })).status, 200);
  assert.equal((await call(db, 'read&version=1&part=0&offset=1', undefined, 'b')).status, 409);
});

test('failed commit rolls back chunks, head, sharing metadata and receipt, retaining upload for retry', async () => {
  const db = await setup(), old = { rev: 1, note: 'old' };
  await writeStateDocument(db, 'a', encodeState(old));
  db._raw.exec("CREATE TABLE marker(value TEXT); INSERT INTO marker VALUES('before')");
  const options = { prepareMetadata: body => ({ share: body.share }), extraStatements: (metadata, guard, id, token) => [db.prepare(`UPDATE marker SET value=? WHERE ${guard}`).bind(metadata.share, id, token)] };
  const doc = { rev: 2, note: 'x'.repeat(400000) }, upload = await begin(db, doc, { baseVersion: 1, extra: { share: 'after' }, options });
  await fill(db, upload);
  db._raw.exec("CREATE TRIGGER fail_commit BEFORE INSERT ON state_chunks WHEN NEW.part=1 BEGIN SELECT RAISE(ABORT,'fixture failure'); END");
  assert.equal((await call(db, 'commit', { uploadId: upload.uploadId }, 'a', options)).status, 500);
  assert.deepEqual(await receive(db), old);
  assert.equal(db._raw.prepare('SELECT value FROM marker').get().value, 'before');
  assert.equal(db._raw.prepare('SELECT count(*) AS n FROM state_transport_receipts').get().n, 0);
  assert.equal(db._raw.prepare('SELECT count(*) AS n FROM state_uploads').get().n, 1);
  db._raw.exec('DROP TRIGGER fail_commit');
  assert.equal((await call(db, 'commit', { uploadId: upload.uploadId }, 'a', options)).status, 200);
  assert.equal(db._raw.prepare('SELECT value FROM marker').get().value, 'after');
  assert.deepEqual(await receive(db), doc);
});

test('schema memoization coalesces requests and retries initialization after failure', async () => {
  const db = makeD1(), batch = db.batch.bind(db); let calls = 0;
  db.batch = async statements => { calls++; if (calls === 1) throw new Error('transient'); return batch(statements); };
  await assert.rejects(ensureStateTransport(db), /transient/);
  await Promise.all([ensureStateTransport(db), ensureStateTransport(db), ensureStateTransport(db)]);
  assert.equal(calls, 3); // failed state schema, successful state schema, transport schema.
  await ensureStateTransport(db); assert.equal(calls, 3);
});
