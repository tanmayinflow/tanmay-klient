// Bounded transport for Workers Free. The browser assembles/parses whole
// documents; no transport request loads or serializes the complete document.
// The active state tables and legacy rows remain compatible and untouched
// until the final guarded D1 transaction commits every staged part together.
import { STATE_LIMIT, ensureStateStorage, readStateMeta, stateFailure } from './stateStorage.js';

export const STATE_TRANSPORT_PART_BYTES = 196_608;
export const STATE_TRANSPORT_READ_CHARS = 32_768;
export const STATE_TRANSPORT_MAX_PARTS = 128;
const UPLOAD_LIFETIME = 24 * 60 * 60 * 1000;
const schemas = new WeakMap();
const encoder = new TextEncoder();
const hex = /^[a-f0-9]{64}$/;
const fail = (code, status = 400) => Object.assign(new Error(code), { code, status });
const digest = async bytes => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), b => b.toString(16).padStart(2, '0')).join('');
const reply = body => Response.json({ ok: true, ...body, limit: STATE_LIMIT, safe: STATE_LIMIT }, { headers: { 'Cache-Control': 'no-store, private' } });

export async function ensureStateTransport(db) {
  let work = schemas.get(db);
  if (!work) {
    work = ensureStateStorage(db).then(() => db.batch([
      db.prepare(`CREATE TABLE IF NOT EXISTS state_uploads (
        user_id TEXT PRIMARY KEY, token TEXT NOT NULL, base_version INTEGER NOT NULL,
        rev INTEGER NOT NULL, bytes INTEGER NOT NULL, parts INTEGER NOT NULL,
        sha256 TEXT NOT NULL, metadata TEXT NOT NULL, created_at INTEGER NOT NULL)`),
      db.prepare(`CREATE TABLE IF NOT EXISTS state_upload_parts (
        user_id TEXT NOT NULL, token TEXT NOT NULL, part INTEGER NOT NULL,
        data TEXT NOT NULL, bytes INTEGER NOT NULL, sha256 TEXT NOT NULL,
        PRIMARY KEY(user_id, token, part))`),
      db.prepare(`CREATE TABLE IF NOT EXISTS state_transport_receipts (
        user_id TEXT PRIMARY KEY, upload_id TEXT NOT NULL, version INTEGER NOT NULL,
        updated_at INTEGER NOT NULL, bytes INTEGER NOT NULL)`),
    ])).catch(error => { schemas.delete(db); throw error; });
    schemas.set(db, work);
  }
  await work;
}

// The legacy version participates in the same compare-and-swap as the current
// document, so a first chunked save cannot race an older device's save.
const currentVersion = `COALESCE((SELECT version FROM state_documents WHERE user_id=?),(SELECT version FROM state WHERE user_id=?),0)`;

async function boundedBody(request, limit) {
  const declared = Number(request.headers.get('Content-Length'));
  if (Number.isFinite(declared) && declared > limit) throw fail('transport-request-too-large', 413);
  const reader = request.body?.getReader();
  if (!reader) throw fail('bad-json');
  const chunks = []; let size = 0;
  try {
    while (true) {
      const part = await reader.read(); if (part.done) break;
      size += part.value.byteLength;
      if (size > limit) { await reader.cancel(); throw fail('transport-request-too-large', 413); }
      chunks.push(part.value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const part of chunks) { bytes.set(part, offset); offset += part.byteLength; }
  let value;
  try { value = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); }
  catch { throw fail('bad-json'); }
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw fail('bad-json');
  return value;
}

async function manifest(db, userId) {
  const head = await db.prepare('SELECT version,updated_at,rev,bytes,chunks,sha256 FROM state_documents WHERE user_id=?').bind(userId).first();
  if (!head) {
    const row = await db.prepare("SELECT version,updated_at,length(CAST(doc AS BLOB)) AS bytes,length(doc) AS chars,json_extract(doc,'$.rev') AS rev FROM state WHERE user_id=?").bind(userId).first();
    if (!row) return reply({ transport: 'chunks', meta: true, empty: true, version: 0, updated_at: null, rev: 0, bytes: 0, sha256: null, chunks: [] });
    if (!Number.isSafeInteger(row.bytes) || row.bytes < 1 || row.bytes > STATE_LIMIT) throw fail('too-large', 413);
    const chunks = [];
    for (let offset = 1; offset <= row.chars; offset += STATE_TRANSPORT_READ_CHARS) chunks.push({ part: 0, offset, length: Math.min(STATE_TRANSPORT_READ_CHARS, row.chars - offset + 1) });
    return reply({ transport: 'chunks', meta: true, empty: false, version: row.version, updated_at: row.updated_at, rev: Number(row.rev) || 0, bytes: row.bytes, sha256: null, chunks });
  }
  if (!Number.isSafeInteger(head.bytes) || head.bytes < 1 || head.bytes > STATE_LIMIT || !Number.isInteger(head.chunks) || head.chunks < 1 || head.chunks > STATE_TRANSPORT_MAX_PARTS) throw fail('corrupt', 500);
  const rows = (await db.prepare(`SELECT c.part,length(c.data) AS chars,length(CAST(c.data AS BLOB)) AS bytes
    FROM state_chunks c JOIN state_documents d ON d.user_id=c.user_id
    WHERE c.user_id=? AND d.version=? ORDER BY c.part`).bind(userId, head.version).all()).results || [];
  if (rows.length !== head.chunks) {
    if ((await readStateMeta(db, userId)).version !== head.version) throw fail('conflict', 409);
    throw fail('corrupt', 500);
  }
  if (!hex.test(head.sha256) || rows.some((r, i) => r.part !== i || !Number.isSafeInteger(r.chars) || r.chars < 1) || rows.reduce((n, r) => n + r.bytes, 0) !== head.bytes) throw fail('corrupt', 500);
  const chunks = [];
  for (const row of rows) for (let offset = 1; offset <= row.chars; offset += STATE_TRANSPORT_READ_CHARS) chunks.push({ part: row.part, offset, length: Math.min(STATE_TRANSPORT_READ_CHARS, row.chars - offset + 1) });
  return reply({ transport: 'chunks', meta: true, empty: false, version: head.version, updated_at: head.updated_at, rev: head.rev, bytes: head.bytes, sha256: head.sha256, chunks });
}

async function readPart(db, userId, url) {
  const version = Number(url.searchParams.get('version')), part = Number(url.searchParams.get('part')), offset = Number(url.searchParams.get('offset'));
  if (!['version', 'part', 'offset'].every(key => url.searchParams.has(key)) || !Number.isSafeInteger(version) || version < 1 || !Number.isInteger(part) || part < 0 || part >= STATE_TRANSPORT_MAX_PARTS || !Number.isInteger(offset) || offset < 1 || offset > STATE_LIMIT || (offset - 1) % STATE_TRANSPORT_READ_CHARS) throw fail('transport-read');
  const head = await db.prepare('SELECT version FROM state_documents WHERE user_id=?').bind(userId).first();
  let row;
  if (head) {
    if (head.version !== version) throw fail('conflict', 409);
    row = await db.prepare(`SELECT substr(c.data,?,?) AS data FROM state_chunks c JOIN state_documents d ON d.user_id=c.user_id
      WHERE c.user_id=? AND c.part=? AND d.version=?`).bind(offset, STATE_TRANSPORT_READ_CHARS, userId, part, version).first();
  } else {
    if (part !== 0) throw fail('transport-read');
    row = await db.prepare(`SELECT substr(doc,?,?) AS data FROM state WHERE user_id=? AND version=? AND NOT EXISTS(SELECT 1 FROM state_documents WHERE user_id=?)`).bind(offset, STATE_TRANSPORT_READ_CHARS, userId, version, userId).first();
  }
  if (!row) {
    if ((await readStateMeta(db, userId)).version !== version) throw fail('conflict', 409);
    throw fail('corrupt', 500);
  }
  if (typeof row.data !== 'string' || !row.data.length) throw fail('transport-read');
  return reply({ version, part, offset, data: row.data });
}

async function startUpload(db, userId, body, options) {
  if (!Number.isSafeInteger(body.bytes) || body.bytes < 1 || body.bytes > STATE_LIMIT) throw fail('too-large', 413);
  if (!Number.isInteger(body.parts) || body.parts < 1 || body.parts > STATE_TRANSPORT_MAX_PARTS || body.bytes > body.parts * STATE_TRANSPORT_PART_BYTES || body.bytes < body.parts || !Number.isSafeInteger(body.rev) || body.rev < 0 || !hex.test(body.sha256 || '')) throw fail('transport-start');
  const current = await readStateMeta(db, userId);
  const baseVersion = body.baseVersion === undefined ? current.version : body.baseVersion;
  if (!Number.isSafeInteger(baseVersion) || baseVersion < 0) throw fail('transport-version');
  if (baseVersion !== current.version || (options.checkRev && current.version > 0 && body.rev <= current.rev)) throw fail('conflict', 409);
  const metadata = JSON.stringify(options.prepareMetadata ? options.prepareMetadata(body) : {});
  if (encoder.encode(metadata).byteLength > 200_000) throw fail('transport-metadata', 413);
  const token = crypto.randomUUID(), now = Date.now();
  const results = await db.batch([
    db.prepare(`INSERT INTO state_uploads(user_id,token,base_version,rev,bytes,parts,sha256,metadata,created_at)
      SELECT ?,?,?,?,?,?,?,?,? WHERE ${currentVersion}=?
      ON CONFLICT(user_id) DO UPDATE SET token=excluded.token,base_version=excluded.base_version,rev=excluded.rev,
      bytes=excluded.bytes,parts=excluded.parts,sha256=excluded.sha256,metadata=excluded.metadata,created_at=excluded.created_at`)
      .bind(userId, token, baseVersion, body.rev, body.bytes, body.parts, body.sha256, metadata, now, userId, userId, baseVersion),
    db.prepare('DELETE FROM state_upload_parts WHERE user_id=? AND token<>? AND EXISTS(SELECT 1 FROM state_uploads WHERE user_id=? AND token=?)').bind(userId, token, userId, token),
    db.prepare('SELECT token FROM state_uploads WHERE user_id=? AND token=?').bind(userId, token),
  ]);
  if (!results.at(-1)?.results?.length) throw fail('conflict', 409);
  return reply({ uploadId: token });
}

async function uploadPart(db, userId, body) {
  if (typeof body.uploadId !== 'string' || !Number.isInteger(body.part) || body.part < 0 || body.part >= STATE_TRANSPORT_MAX_PARTS || typeof body.data !== 'string' || !hex.test(body.sha256 || '')) throw fail('transport-part');
  if (body.data.length > STATE_TRANSPORT_PART_BYTES || (body.data.isWellFormed && !body.data.isWellFormed())) throw fail('transport-part', 413);
  const bytes = encoder.encode(body.data);
  if (!bytes.length || bytes.length > STATE_TRANSPORT_PART_BYTES) throw fail('transport-part', 413);
  if (await digest(bytes) !== body.sha256) throw fail('transport-checksum');
  const age = Date.now() - UPLOAD_LIFETIME;
  const results = await db.batch([
    db.prepare(`INSERT INTO state_upload_parts(user_id,token,part,data,bytes,sha256)
      SELECT ?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM state_uploads WHERE user_id=? AND token=? AND parts>? AND created_at>=?)
      AND COALESCE((SELECT sum(bytes) FROM state_upload_parts WHERE user_id=? AND token=? AND part<>?),0)+?<=(SELECT bytes FROM state_uploads WHERE user_id=? AND token=?)
      ON CONFLICT(user_id,token,part) DO UPDATE SET data=excluded.data,bytes=excluded.bytes,sha256=excluded.sha256`)
      .bind(userId, body.uploadId, body.part, body.data, bytes.length, body.sha256, userId, body.uploadId, body.part, age, userId, body.uploadId, body.part, bytes.length, userId, body.uploadId),
    db.prepare(`SELECT bytes,sha256 FROM state_upload_parts WHERE user_id=? AND token=? AND part=?
      AND EXISTS(SELECT 1 FROM state_uploads WHERE user_id=? AND token=? AND created_at>=?)`).bind(userId, body.uploadId, body.part, userId, body.uploadId, age),
  ]);
  const receipt = results.at(-1)?.results?.[0];
  if (!receipt || receipt.bytes !== bytes.length || receipt.sha256 !== body.sha256) throw fail('transport-upload-expired', 409);
  return reply({ uploadId: body.uploadId, part: body.part, bytes: bytes.length });
}

async function commitUpload(db, userId, body, options) {
  if (typeof body.uploadId !== 'string') throw fail('transport-commit');
  // Metadata is bounded at start. Part contents stay inside D1 for this entire
  // transaction; the Worker never concatenates or serializes them again.
  const upload = await db.prepare('SELECT token,base_version,metadata,created_at FROM state_uploads WHERE user_id=? AND token=?').bind(userId, body.uploadId).first();
  if (!upload) {
    const committed = await db.prepare('SELECT version,updated_at,bytes FROM state_transport_receipts WHERE user_id=? AND upload_id=?').bind(userId, body.uploadId).first();
    if (committed) return reply(committed); // Lost HTTP acknowledgement, safe retry.
    throw fail('transport-upload-expired', 409);
  }
  if (upload.created_at < Date.now() - UPLOAD_LIFETIME) throw fail('transport-upload-expired', 409);
  let metadata; try { metadata = JSON.parse(upload.metadata); } catch { throw fail('corrupt', 500); }
  const guard = 'EXISTS(SELECT 1 FROM state_documents WHERE user_id=? AND write_token=?)';
  const now = Date.now(), age = now - UPLOAD_LIFETIME, commitToken = crypto.randomUUID();
  const statements = [
    db.prepare(`INSERT INTO state_documents(user_id,version,updated_at,rev,bytes,chunks,sha256,write_token)
      SELECT u.user_id,u.base_version+1,?,u.rev,u.bytes,u.parts,u.sha256,? FROM state_uploads u
      WHERE u.user_id=? AND u.token=? AND u.created_at>=? AND ${currentVersion}=u.base_version
      AND (SELECT count(*) FROM state_upload_parts p WHERE p.user_id=u.user_id AND p.token=u.token)=u.parts
      AND (SELECT sum(bytes) FROM state_upload_parts p WHERE p.user_id=u.user_id AND p.token=u.token)=u.bytes
      AND (SELECT min(part) FROM state_upload_parts p WHERE p.user_id=u.user_id AND p.token=u.token)=0
      AND (SELECT max(part) FROM state_upload_parts p WHERE p.user_id=u.user_id AND p.token=u.token)=u.parts-1
      ON CONFLICT(user_id) DO UPDATE SET version=excluded.version,updated_at=excluded.updated_at,rev=excluded.rev,
      bytes=excluded.bytes,chunks=excluded.chunks,sha256=excluded.sha256,write_token=excluded.write_token
      WHERE state_documents.version=excluded.version-1`)
      .bind(now, commitToken, userId, body.uploadId, age, userId, userId),
    db.prepare(`DELETE FROM state_chunks WHERE user_id=? AND ${guard}`).bind(userId, userId, commitToken),
    db.prepare(`INSERT INTO state_chunks(user_id,part,data) SELECT user_id,part,data FROM state_upload_parts WHERE user_id=? AND token=? AND ${guard}`).bind(userId, body.uploadId, userId, commitToken),
    ...(options.extraStatements?.(metadata, guard, userId, commitToken) || []),
    db.prepare(`INSERT INTO state_transport_receipts(user_id,upload_id,version,updated_at,bytes)
      SELECT user_id,?,version,updated_at,bytes FROM state_documents WHERE user_id=? AND write_token=?
      ON CONFLICT(user_id) DO UPDATE SET upload_id=excluded.upload_id,version=excluded.version,updated_at=excluded.updated_at,bytes=excluded.bytes`).bind(body.uploadId, userId, commitToken),
    db.prepare(`DELETE FROM state_upload_parts WHERE user_id=? AND token=? AND ${guard}`).bind(userId, body.uploadId, userId, commitToken),
    db.prepare(`DELETE FROM state_uploads WHERE user_id=? AND token=? AND ${guard}`).bind(userId, body.uploadId, userId, commitToken),
    db.prepare('SELECT version,updated_at,bytes FROM state_transport_receipts WHERE user_id=? AND upload_id=?').bind(userId, body.uploadId),
  ];
  const results = await db.batch(statements), receipt = results.at(-1)?.results?.[0];
  if (!receipt) {
    if ((await readStateMeta(db, userId)).version !== upload.base_version) throw fail('conflict', 409);
    throw fail('transport-incomplete', 409);
  }
  return reply(receipt);
}

export async function handleStateTransport(request, { db, userId, ...options }) {
  try {
    await ensureStateTransport(db);
    const url = new URL(request.url), action = url.searchParams.get('action');
    if (request.method === 'GET' && action === 'manifest') return await manifest(db, userId);
    if (request.method === 'GET' && action === 'read') return await readPart(db, userId, url);
    if (request.method !== 'PUT') throw fail('method', 405);
    // Escaped control characters can occupy six JSON bytes per data byte.
    const body = await boundedBody(request, action === 'part' ? STATE_TRANSPORT_PART_BYTES * 6 + 2048 : 220_000);
    if (action === 'start') return await startUpload(db, userId, body, options);
    if (action === 'part') return await uploadPart(db, userId, body);
    if (action === 'commit') return await commitUpload(db, userId, body, options);
    throw fail('transport-action');
  } catch (error) { return stateFailure(error); }
}
