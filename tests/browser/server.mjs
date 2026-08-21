// Statický server + napodobenina klientského API. Bez závislostí.
// Slouží prohlížečovým zkouškám v tests/browser/ a dá se spustit i ručně:
//   node tests/browser/server.mjs dist 8791
import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";

const ROOT = process.argv[2] || "dist";
const PORT = Number(process.argv[3] || 8791);
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".webmanifest": "application/manifest+json", ".png": "image/png", ".svg": "image/svg+xml",
  ".webp": "image/webp", ".ico": "image/x-icon", ".jpg": "image/jpeg" };

export const state = { me: { member: true, name: "Test", owner: "aaaaaaaaaaaaaaaa" }, doc: null, version: 0, files: new Map(), plan: null, share: null };

export function createServer() {
  return http.createServer(async (req, res) => {
    const u = new URL(req.url, "http://x");
    const send = (code, body, type) => { res.writeHead(code, { "Content-Type": type || "application/json" }); res.end(body); };
    // řídicí cesty jen pro zkoušku — v nasazení neexistují
    if (u.pathname === "/__owner") { state.me = { ...state.me, owner: u.searchParams.get("tag") || "" }; state.doc = null; state.version = 0; return send(200, JSON.stringify(state.me)); }
    if (u.pathname === "/__peek") return send(200, JSON.stringify({ doc: state.doc, version: state.version }));
    if (u.pathname === "/api/me") return send(200, JSON.stringify(state.me));
    if (u.pathname === "/api/state") {
      if (req.method === "GET") return send(200, JSON.stringify({ doc: state.doc, version: state.version, updated_at: Date.now() }));
      let b = ""; for await (const c of req) b += c;
      // Zpětný kanál · zkouška se na něj dívá stejně jako trenérská strana.
      try { const body = JSON.parse(b); state.doc = body.doc; if ("share" in body) state.share = body.share; } catch (e) {}
      state.version++;
      return send(200, JSON.stringify({ ok: true, version: state.version }));
    }
    if (u.pathname === "/__share") return send(200, JSON.stringify({ share: state.share || null }));
    if (u.pathname === "/__plan") { let b = ""; for await (const c of req) b += c; try { state.plan = JSON.parse(b); } catch (e) {} return send(200, JSON.stringify({ ok: true })); }
    if (u.pathname === "/api/plan") return send(200, JSON.stringify({ doc: state.plan || null, updated_at: state.plan ? Date.now() : null }));
    if (u.pathname === "/api/files") return send(200, JSON.stringify({ files: [] }));
    if (u.pathname.startsWith("/api/files/")) {
      const id = decodeURIComponent(u.pathname.slice("/api/files/".length));
      if (req.method === "PUT") { const ch = []; for await (const c of req) ch.push(c); state.files.set(id, { b: Buffer.concat(ch), t: req.headers["content-type"] }); return send(200, JSON.stringify({ ok: true, id })); }
      if (req.method === "DELETE") { state.files.delete(id); return send(200, JSON.stringify({ ok: true })); }
      const f = state.files.get(id);
      if (!f) return send(404, "Not found", "text/plain");
      res.writeHead(200, { "Content-Type": f.t || "application/octet-stream", "X-Content-Type-Options": "nosniff" });
      return res.end(f.b);
    }
    if (u.pathname.startsWith("/api/")) return send(404, JSON.stringify({ ok: false, error: "not found" }));
    let p = join(ROOT, u.pathname === "/" ? "index.html" : u.pathname.slice(1));
    try { const s = await stat(p); if (s.isDirectory()) p = join(p, "index.html"); } catch { p = join(ROOT, "index.html"); }
    try {
      const buf = await readFile(p);
      const h = { "Content-Type": MIME[extname(p)] || "application/octet-stream" };
      if (process.env.SMOKE_CSP) { h["Content-Security-Policy"] = process.env.SMOKE_CSP; h["X-Content-Type-Options"] = "nosniff"; }
      res.writeHead(200, h); res.end(buf);
    } catch { send(404, "no", "text/plain"); }
  });
}

if (process.argv[1] && process.argv[1].endsWith("server.mjs")) createServer().listen(PORT, () => console.log("listening " + PORT));
