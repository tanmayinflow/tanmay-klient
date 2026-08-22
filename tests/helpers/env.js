// Zkušební prostředí Workeru — skutečné SQL (node:sqlite) místo napodobeniny,
// aby test ověřoval dotazy tak, jak je uvidí D1, ne tak, jak je čte atrapa.
// Bez závislostí: všechno, co je tu potřeba, přináší Node sám.//
// Dávka (`batch`) je tu skutečná transakce, protože v D1 skutečná je:
// „Batched statements are SQL transactions. If a statement in the sequence
// fails, then an error is returned for that specific statement, and it aborts
// or rolls back the entire sequence." Bez toho by se ochrana proti dvojí
// rezervaci testovala proti něčemu, co se v provozu chová jinak.
import { DatabaseSync } from "node:sqlite";

export function makeD1() {
  const db = new DatabaseSync(":memory:");
  db.exec("PRAGMA foreign_keys = ON");

  const exec = (sql, args) => {
    const st = db.prepare(sql);
    if (/^\s*(select|pragma|with)/i.test(sql)) return { rows: st.all(...args) };
    const info = st.run(...args);
    return { rows: [], changes: Number(info && info.changes) || 0 };
  };

  let gate = Promise.resolve(); // jedna transakce naráz, přesně jako v D1

  const stmt = (sql, args) => ({
    _sql: sql,
    _args: args,
    bind: (...a) => stmt(sql, a),
    run: async () => { const r = exec(sql, args); return { success: true, meta: { changes: r.changes || 0 } }; },
    first: async (col) => {
      const r = exec(sql, args);
      if (!r.rows.length) return null;
      return col ? r.rows[0][col] : r.rows[0];
    },
    all: async () => ({ results: exec(sql, args).rows, success: true }),
  });

  return {
    prepare: (sql) => stmt(sql, []),
    // D1 dává každé dávce vlastní transakci a dvě se nikdy nezanoří. Řetěz
    // to drží i tady, takže dva souběžné požadavky se v testu potkají stejně
    // jako v provozu, místo aby se srazily na BEGIN.
    batch(list) {
      const run = () => {
        db.exec("BEGIN IMMEDIATE");
        try {
          const out = [];
          for (const s of list) out.push({ success: true, results: exec(s._sql, s._args).rows });
          db.exec("COMMIT");
          return out;
        } catch (e) {
          try { db.exec("ROLLBACK"); } catch (e2) {}
          throw e;
        }
      };
      const next = gate.then(run, run);
      gate = next.then(() => {}, () => {});
      return next;
    },
    async exec(sql) { db.exec(sql); return { count: 1 }; },
    _raw: db,
  };
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
