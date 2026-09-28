// Server-only document storage. Legacy rows remain intact as a recovery copy.
// D1's 2 MB row limit is respected by UTF-8 chunks, committed in one batch.
export const STATE_LIMIT = 10_000_000;
export const STATE_CHUNK_BYTES = 750_000;
const encoder = new TextEncoder();
const decoder = new TextDecoder("utf-8", { fatal: true });
const failure = (code, status, extra = {}) => Object.assign(new Error(code), { code, status, ...extra });
const digest = async bytes => Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)), b => b.toString(16).padStart(2, "0")).join("");

export async function ensureStateStorage(db) {
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS state_documents (
      user_id TEXT PRIMARY KEY, version INTEGER NOT NULL, updated_at INTEGER NOT NULL,
      rev INTEGER NOT NULL, bytes INTEGER NOT NULL, chunks INTEGER NOT NULL,
      sha256 TEXT NOT NULL, write_token TEXT NOT NULL)`),
    db.prepare(`CREATE TABLE IF NOT EXISTS state_chunks (
      user_id TEXT NOT NULL, part INTEGER NOT NULL, data TEXT NOT NULL,
      PRIMARY KEY (user_id, part))`),
  ]);
}

export function encodeState(doc) {
  const text = JSON.stringify(doc);
  if (typeof text !== "string") throw failure("bad-json", 400);
  const bytes = encoder.encode(text);
  if (bytes.length > STATE_LIMIT) throw failure("too-large", 413, { bytes: bytes.length });
  const parts = [];
  for (let start = 0; start < bytes.length;) {
    let end = Math.min(start + STATE_CHUNK_BYTES, bytes.length);
    // Do not split a multibyte character between independently stored strings.
    while (end < bytes.length && (bytes[end] & 0xc0) === 0x80) end--;
    parts.push(decoder.decode(bytes.subarray(start, end)));
    start = end;
  }
  return { parts, bytes, rev: Number(doc?.rev) || 0 };
}

export async function readStateMeta(db, userId) {
  const current = await db.prepare("SELECT version, updated_at, rev, bytes FROM state_documents WHERE user_id = ?").bind(userId).first();
  if (current) return current;
  const legacy = await db.prepare("SELECT version, updated_at, length(CAST(doc AS BLOB)) AS bytes, json_extract(doc, '$.rev') AS rev FROM state WHERE user_id = ?").bind(userId).first();
  return legacy ? { ...legacy, rev: Number(legacy.rev) || 0 } : { version: 0, updated_at: null, rev: 0, bytes: 0 };
}

export async function readStateDocument(db, userId) {
  // A single SELECT sees one complete committed generation, even during a save.
  const result = await db.prepare(`SELECT d.version, d.updated_at, d.rev, d.bytes, d.chunks, d.sha256,
      c.part, c.data FROM state_documents d LEFT JOIN state_chunks c ON c.user_id = d.user_id
      WHERE d.user_id = ? ORDER BY c.part`).bind(userId).all();
  const rows = result.results || [];
  if (!rows.length) {
    const legacy = await db.prepare("SELECT doc, version, updated_at FROM state WHERE user_id = ?").bind(userId).first();
    if (!legacy) return { doc: null, version: 0, updated_at: null, bytes: 0 };
    try { return { ...legacy, doc: JSON.parse(legacy.doc), bytes: encoder.encode(legacy.doc).length }; }
    catch { throw failure("corrupt", 500); }
  }
  const head = rows[0];
  if (rows.length !== head.chunks || rows.some((r, i) => r.part !== i || typeof r.data !== "string")) throw failure("corrupt", 500);
  const text = rows.map(r => r.data).join("");
  const bytes = encoder.encode(text);
  if (bytes.length !== head.bytes || await digest(bytes) !== head.sha256) throw failure("corrupt", 500);
  let doc;
  try { doc = JSON.parse(text); } catch { throw failure("corrupt", 500); }
  return { doc, version: head.version, updated_at: head.updated_at, bytes: head.bytes };
}

export async function writeStateDocument(db, userId, encoded, { expectedVersion, checkRev = false, extraStatements = () => [] } = {}) {
  const current = await readStateMeta(db, userId);
  if (expectedVersion != null && expectedVersion !== current.version) throw failure("conflict", 409);
  if (checkRev && encoded.rev <= current.rev && current.version > 0) throw failure("conflict", 409);
  const token = crypto.randomUUID();
  const hash = await digest(encoded.bytes);
  const now = Date.now();
  const guard = "EXISTS (SELECT 1 FROM state_documents WHERE user_id = ? AND write_token = ?)";
  const statements = [
    db.prepare(`INSERT INTO state_documents (user_id, version, updated_at, rev, bytes, chunks, sha256, write_token)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET version = state_documents.version + 1,
      updated_at = excluded.updated_at, rev = excluded.rev, bytes = excluded.bytes,
      chunks = excluded.chunks, sha256 = excluded.sha256, write_token = excluded.write_token
      WHERE state_documents.version = ?`).bind(userId, current.version + 1, now, encoded.rev, encoded.bytes.length, encoded.parts.length, hash, token, current.version),
    db.prepare(`DELETE FROM state_chunks WHERE user_id = ? AND ${guard}`).bind(userId, userId, token),
    ...encoded.parts.map((part, i) => db.prepare(`INSERT INTO state_chunks (user_id, part, data) SELECT ?, ?, ? WHERE ${guard}`).bind(userId, i, part, userId, token)),
    ...extraStatements(guard, userId, token),
    db.prepare("SELECT version, updated_at, bytes FROM state_documents WHERE user_id = ? AND write_token = ?").bind(userId, token),
  ];
  // Any chunk failure rolls the entire batch back, including the head and sharing metadata.
  const results = await db.batch(statements);
  const receipt = results.at(-1)?.results?.[0];
  if (!receipt) throw failure("conflict", 409);
  return receipt;
}

export function stateFailure(error) {
  return Response.json({ ok: false, code: error.code || "db", error: error.code || "storage unavailable", bytes: error.bytes || 0, limit: STATE_LIMIT, safe: STATE_LIMIT }, { status: error.status || 500 });
}
