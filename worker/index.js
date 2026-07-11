// tanmay-web — Worker (step 2.2a).
// Adds R2-backed file endpoints (upload / read / delete), plus the existing
// state document API and health check. The app itself is still unchanged;
// these endpoints let us test that files round-trip through R2 before wiring
// them into App.tsx (batch 2).

// Single user for now (you), authenticated by Cloudflare Access.
// Keys are prefixed with the user id so the future multi-user (client) version
// is an additive change, not a rewrite — same reasoning as the D1 user_id.
const USER_ID = "primary";

// ---- D1 state document (step 2.1) ---------------------------------------
async function ensureSchema(env) {
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS state (
       user_id    TEXT PRIMARY KEY,
       doc        TEXT NOT NULL,
       updated_at INTEGER NOT NULL,
       version    INTEGER NOT NULL DEFAULT 1
     )`
  ).run();
}

async function handleState(request, env) {
  await ensureSchema(env);

  if (request.method === "GET") {
    const row = await env.DB
      .prepare("SELECT doc, updated_at, version FROM state WHERE user_id = ?")
      .bind(USER_ID)
      .first();
    if (!row) return Response.json({ doc: null, updated_at: null, version: 0 });
    return Response.json({
      doc: JSON.parse(row.doc),
      updated_at: row.updated_at,
      version: row.version,
    });
  }

  if (request.method === "PUT") {
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json({ ok: false, error: "invalid JSON body" }, { status: 400 });
    }
    const docStr = JSON.stringify(body && "doc" in body ? body.doc : null);
    const now = Date.now();
    await env.DB
      .prepare(
        `INSERT INTO state (user_id, doc, updated_at, version)
         VALUES (?, ?, ?, 1)
         ON CONFLICT(user_id) DO UPDATE SET
           doc = excluded.doc,
           updated_at = excluded.updated_at,
           version = state.version + 1`
      )
      .bind(USER_ID, docStr, now)
      .run();
    const row = await env.DB
      .prepare("SELECT version, updated_at FROM state WHERE user_id = ?")
      .bind(USER_ID)
      .first();
    return Response.json({ ok: true, version: row.version, updated_at: row.updated_at });
  }

  return Response.json({ ok: false, error: "method not allowed" }, { status: 405 });
}

// ---- R2 files (step 2.2a) ------------------------------------------------
// Only allow simple, collision-free ids. Keeps the R2 keyspace clean and
// rejects anything odd coming in on the path.
const ID_RE = /^[A-Za-z0-9_-]{1,128}$/;

function fileKey(id) {
  return `files/${USER_ID}/${id}`;
}

async function handleFiles(request, env, id) {
  if (!ID_RE.test(id)) {
    return Response.json({ ok: false, error: "invalid file id" }, { status: 400 });
  }
  const key = fileKey(id);

  if (request.method === "PUT") {
    if (!request.body) {
      return Response.json({ ok: false, error: "empty body" }, { status: 400 });
    }
    const contentType = request.headers.get("Content-Type") || "application/octet-stream";
    const name = request.headers.get("X-File-Name") || "";
    await env.FILES.put(key, request.body, {
      httpMetadata: { contentType },
      customMetadata: name ? { name } : undefined,
    });
    return Response.json({ ok: true, id });
  }

  if (request.method === "GET") {
    const object = await env.FILES.get(key);
    if (!object) return new Response("Not found", { status: 404 });
    const headers = new Headers();
    object.writeHttpMetadata(headers); // Content-Type etc. from stored metadata
    headers.set("ETag", object.httpEtag);
    // Bytes for a given id never change, so they are safe to cache hard.
    // Private, because everything here sits behind Cloudflare Access.
    headers.set("Cache-Control", "private, max-age=604800, immutable");
    return new Response(object.body, { headers });
  }

  if (request.method === "DELETE") {
    await env.FILES.delete(key); // delete is free and idempotent
    return Response.json({ ok: true });
  }

  return Response.json({ ok: false, error: "method not allowed" }, { status: 405 });
}

// List all file ids stored under this user (for garbage collection).
async function handleFilesList(request, env) {
  if (request.method !== "GET") {
    return Response.json({ ok: false, error: "method not allowed" }, { status: 405 });
  }
  const prefix = `files/${USER_ID}/`;
  const files = [];
  let cursor = undefined;
  do {
    const res = await env.FILES.list({ prefix, cursor, limit: 1000 });
    for (const o of res.objects) files.push({ id: o.key.slice(prefix.length), uploaded: o.uploaded ? new Date(o.uploaded).getTime() : 0 });
    cursor = res.truncated ? res.cursor : undefined;
  } while (cursor);
  return Response.json({ files });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Health check — confirms both storage bindings are reachable end-to-end.
    if (url.pathname === "/api/health") {
      const result = { db: "unknown", files: "unknown" };
      try {
        const row = await env.DB.prepare("SELECT 1 AS ok").first();
        result.db = row && row.ok === 1 ? "ok" : "unexpected";
      } catch (e) {
        result.db = "error: " + e.message;
      }
      try {
        await env.FILES.head("__healthcheck__");
        result.files = "ok";
      } catch (e) {
        result.files = "error: " + e.message;
      }
      return Response.json(result);
    }

    // Cross-device workspace document (step 2.1).
    if (url.pathname === "/api/state") {
      return handleState(request, env);
    }

    // R2 file listing (for garbage collection): exact /api/files
    if (url.pathname === "/api/files") {
      return handleFilesList(request, env);
    }

    // R2 files: /api/files/<id>
    if (url.pathname.startsWith("/api/files/")) {
      const id = decodeURIComponent(url.pathname.slice("/api/files/".length));
      return handleFiles(request, env, id);
    }

    // Everything else: serve the static single-page app, unchanged.
    return env.ASSETS.fetch(request);
  },
};
