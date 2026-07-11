// tanmay-klient — Worker (client edition).
// Same API surface as tanmay-web, with ONE structural change:
// the user id is derived from the Cloudflare Access identity header,
// not a constant. Every client authenticated by Access gets their own
// isolated slice of D1 and R2. Adding client #2 = adding an email to
// the Access policy. Nothing else changes.
//
// Storage layout (identical shape to tanmay-web, keyed per user):
//   D1  state.user_id = <derived id>
//   R2  files/<derived id>/<file id>

// Derive a stable, filesystem-safe user id from the Access email.
// "jan.novak@gmail.com" -> "jan-novak-gmail-com"
function userIdFrom(request) {
  const email = (request.headers.get("cf-access-authenticated-user-email") || "").trim().toLowerCase();
  if (!email) return null;
  const id = email.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return id || null;
}

function unauthorized() {
  return Response.json(
    { ok: false, error: "no authenticated identity (Cloudflare Access header missing)" },
    { status: 401 }
  );
}

// ---- D1 state document -----------------------------------------------------
async function ensureSchema(env) {
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS state (
       user_id    TEXT PRIMARY KEY,
       doc        TEXT NOT NULL,
       updated_at INTEGER NOT NULL,
       version    INTEGER NOT NULL DEFAULT 1
     )`
  ).run();
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS members (
       user_id   TEXT PRIMARY KEY,
       email     TEXT NOT NULL,
       joined_at INTEGER NOT NULL
     )`
  ).run();
}

// ---- Membership: Access pouští dovnitř kohokoli (policy Everyone),
// ---- ale prostor se otevře až vstupním slovem od Tanyho. Jednou provždy.
const normWord = (s) => String(s || "").trim().toLowerCase().replace(/\s+/g, " ");

async function isMember(env, userId) {
  await ensureSchema(env);
  const row = await env.DB.prepare("SELECT 1 AS ok FROM members WHERE user_id = ?").bind(userId).first();
  return !!row;
}

async function handleMe(env, userId) {
  return Response.json({ member: await isMember(env, userId) });
}

async function handleJoin(request, env, userId) {
  if (request.method !== "POST") {
    return Response.json({ ok: false, error: "method not allowed" }, { status: 405 });
  }
  let body;
  try { body = await request.json(); } catch { body = {}; }
  const expected = normWord(env.INVITE_WORD);
  if (!expected) {
    return Response.json({ ok: false, error: "INVITE_WORD is not configured" }, { status: 500 });
  }
  if (normWord(body.word) !== expected) {
    return Response.json({ ok: false, error: "wrong word" }, { status: 403 });
  }
  const email = (request.headers.get("cf-access-authenticated-user-email") || "").trim().toLowerCase();
  await env.DB.prepare(
    "INSERT INTO members (user_id, email, joined_at) VALUES (?, ?, ?) ON CONFLICT(user_id) DO NOTHING"
  ).bind(userId, email, Date.now()).run();
  return Response.json({ ok: true });
}

async function handleState(request, env, userId) {
  await ensureSchema(env);

  if (request.method === "GET") {
    const row = await env.DB
      .prepare("SELECT doc, updated_at, version FROM state WHERE user_id = ?")
      .bind(userId)
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
      .bind(userId, docStr, now)
      .run();
    const row = await env.DB
      .prepare("SELECT version, updated_at FROM state WHERE user_id = ?")
      .bind(userId)
      .first();
    return Response.json({ ok: true, version: row.version, updated_at: row.updated_at });
  }

  return Response.json({ ok: false, error: "method not allowed" }, { status: 405 });
}

// ---- R2 files ---------------------------------------------------------------
const ID_RE = /^[A-Za-z0-9_-]{1,128}$/;

function fileKey(userId, id) {
  return `files/${userId}/${id}`;
}

async function handleFiles(request, env, userId, id) {
  if (!ID_RE.test(id)) {
    return Response.json({ ok: false, error: "invalid file id" }, { status: 400 });
  }
  const key = fileKey(userId, id);

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
    object.writeHttpMetadata(headers);
    headers.set("ETag", object.httpEtag);
    headers.set("Cache-Control", "private, max-age=604800, immutable");
    return new Response(object.body, { headers });
  }

  if (request.method === "DELETE") {
    await env.FILES.delete(key);
    return Response.json({ ok: true });
  }

  return Response.json({ ok: false, error: "method not allowed" }, { status: 405 });
}

async function handleFilesList(request, env, userId) {
  if (request.method !== "GET") {
    return Response.json({ ok: false, error: "method not allowed" }, { status: 405 });
  }
  const prefix = `files/${userId}/`;
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

    if (url.pathname === "/api/health") {
      const result = { db: "unknown", files: "unknown", identity: "unknown" };
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
      result.identity = userIdFrom(request) || "missing";
      return Response.json(result);
    }

    // Everything under /api/* is per-user; without an Access identity there is no user.
    if (url.pathname.startsWith("/api/")) {
      const userId = userIdFrom(request);
      if (!userId) return unauthorized();

      if (url.pathname === "/api/me") {
        return handleMe(env, userId);
      }
      if (url.pathname === "/api/join") {
        return handleJoin(request, env, userId);
      }

      // Všechno ostatní je jen pro členy — cizí příchozí nemůže zapisovat
      // do D1 ani plnit R2, dokud nezadá vstupní slovo.
      if (!(await isMember(env, userId))) {
        return Response.json({ ok: false, error: "not a member" }, { status: 403 });
      }

      if (url.pathname === "/api/state") {
        return handleState(request, env, userId);
      }
      if (url.pathname === "/api/files") {
        return handleFilesList(request, env, userId);
      }
      if (url.pathname.startsWith("/api/files/")) {
        const id = decodeURIComponent(url.pathname.slice("/api/files/".length));
        return handleFiles(request, env, userId, id);
      }
      return Response.json({ ok: false, error: "not found" }, { status: 404 });
    }

    return env.ASSETS.fetch(request);
  },
};
