// Zkušební prostředí Workeru — skutečné SQL (node:sqlite) místo napodobeniny,
// aby test ověřoval dotazy tak, jak je uvidí D1, ne tak, jak je čte atrapa.
// Bez závislostí: všechno, co je tu potřeba, přináší Node sám.
import { DatabaseSync } from "node:sqlite";

export function makeD1() {
  const db = new DatabaseSync(":memory:");
  const wrap = (sql) => {
    const run = (args) => {
      const st = db.prepare(sql);
      if (/^\s*(select|pragma)/i.test(sql)) return { rows: st.all(...args) };
      st.run(...args);
      return { rows: [] };
    };
    const api = (args) => ({
      bind: (...a) => api(a),
      run: async () => { run(args); return { success: true }; },
      first: async () => { const r = run(args); return r.rows.length ? r.rows[0] : null; },
      all: async () => ({ results: run(args).rows }),
    });
    return api([]);
  };
  return { prepare: wrap, _raw: db };
}

export function makeR2() {
  const store = new Map();
  return {
    async put(key, body, opts) {
      const bytes = typeof body === "string" ? Buffer.from(body) : Buffer.from(await new Response(body).arrayBuffer());
      store.set(key, { bytes, opts: opts || {}, uploaded: new Date() });
      return { key };
    },
    async get(key) {
      const o = store.get(key);
      if (!o) return null;
      const ct = (o.opts.httpMetadata || {}).contentType || "application/octet-stream";
      return {
        body: o.bytes,
        httpEtag: '"' + key + '"',
        customMetadata: o.opts.customMetadata,
        writeHttpMetadata(headers) { headers.set("Content-Type", ct); },
      };
    },
    async head(key) { return store.has(key) ? { key } : null; },
    async delete(key) { store.delete(key); },
    async list({ prefix = "", limit = 1000 } = {}) {
      const objects = [...store.entries()].filter(([k]) => k.startsWith(prefix)).slice(0, limit)
        .map(([k, v]) => ({ key: k, uploaded: v.uploaded }));
      return { objects, truncated: false, cursor: undefined };
    },
    _store: store,
  };
}

export function makeEnv(extra = {}) {
  return {
    DB: makeD1(),
    FILES: makeR2(),
    ASSETS: { fetch: async () => new Response("<!doctype html><title>app</title>", { headers: { "Content-Type": "text/html" } }) },
    INVITE_WORD: "otevri se",
    ...extra,
  };
}

// Požadavek s identitou od Cloudflare Access (nebo bez ní).
export function req(path, { email, method = "GET", body, headers = {} } = {}) {
  const h = new Headers(headers);
  if (email) h.set("cf-access-authenticated-user-email", email);
  const init = { method, headers: h };
  if (body !== undefined) {
    init.body = typeof body === "string" ? body : JSON.stringify(body);
    if (!h.has("Content-Type")) h.set("Content-Type", "application/json");
  }
  return new Request("https://klient.example.test" + path, init);
}
