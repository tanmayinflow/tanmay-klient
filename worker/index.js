// tanmay-klient — Worker (client edition).
//
// Client Operations V1 adds the client half of the booking domain. It reads
// and writes the same tables as the coach application, in this very database,
// and it never takes a client id from a request: the identity comes from the
// Access header and the Worker looks the booking client up itself.
// Same API surface as tanmay-web, with ONE structural change:
// the user id is derived from the Cloudflare Access identity header,
// not a constant. Every client authenticated by Access gets their own
// isolated slice of D1 and R2. Adding client #2 = adding an email to
// the Access policy. Nothing else changes.
//
// Storage layout (identical shape to tanmay-web, keyed per user):
//   D1  state.user_id = <derived id>
//   R2  files/<derived id>/<file id>

import { handleClient } from "./booking/api.js";
// Vědomé sdílení má tvar, ne důvěru. Souhrn se ověřuje i tady, na serveru —
// klient může poslat cokoliv a prohlížeč není hranice. Sdílené jádro drží
// tentýž kontrakt, jaký používá aplikace při skládání souhrnu.
import { validateShareSnapshot } from "../src/shared/product/visibility.js";
import { CLIENT_OPTIONAL } from "../src/shared/product/roles.js";

// Derive a stable, filesystem-safe user id from the Access email.
// "jan.novak@gmail.com" -> "jan-novak-gmail-com"
function accessEmail(request) {
  return (request.headers.get("cf-access-authenticated-user-email") || "").trim().toLowerCase();
}
function userIdFrom(request) {
  const email = accessEmail(request);
  if (!email) return null;
  const id = email.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return id || null;
}

// SRÁŽKA IDENTIT · očištění adresy není prosté zobrazení. "jan.novak@gmail.com",
// "jan+novak@gmail.com" i "jan_novak@gmail.com" spadnou na totéž id — a u
// plus-adres je druhá schránka opravdu dosažitelná někomu jinému. Kdo přijde
// jako druhý, nesmí dostat prostor prvního. Odvození neměníme (to by osiřela
// data, která už v D1 leží); místo toho hlídáme, že id patří téže adrese.
async function identityConflict(env, userId, email) {
  const row = await env.DB.prepare("SELECT email FROM members WHERE user_id = ?").bind(userId).first();
  return !!(row && row.email && row.email !== email);
}

// OTISK VLASTNÍKA · prohlížeč si potřebuje pamatovat, komu místní úložiště
// patří, aby ho po přihlášení jiného člověka neotevřel. Adresu mu k tomu
// nedáváme — jen neobrátitelný otisk, který stačí na porovnání.
const OWNER_SALT = "tanmay-klient/owner/v1";
async function ownerTag(userId) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(OWNER_SALT + ":" + userId));
  return Array.from(new Uint8Array(buf).slice(0, 8)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function unauthorized() {
  return Response.json(
    { ok: false, error: "no authenticated identity (Cloudflare Access header missing)" },
    { status: 401 }
  );
}

function identityConflictResponse() {
  return Response.json(
    { ok: false, error: "identity conflict: this space belongs to a different address" },
    { status: 409 }
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
       joined_at INTEGER NOT NULL,
       name      TEXT
     )`
  ).run();
  // Plán od Tanyho · píše do ní kokpit přes KLIENT_DB, klient ji jen čte.
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS plans (
       user_id    TEXT PRIMARY KEY,
       doc        TEXT NOT NULL,
       updated_at INTEGER NOT NULL
     )`
  ).run();
  // migrace starší tabulky bez sloupce name — bezpečně, jen jednou selže naprázdno
  try { await env.DB.prepare("ALTER TABLE members ADD COLUMN name TEXT").run(); } catch (e) {}
  try { await env.DB.prepare("ALTER TABLE members ADD COLUMN share TEXT").run(); } catch (e) {}
  // Zapnuté soukromé místnosti. Trenér potřebuje vědět, které moduly má klient
  // otevřené, aby uměl poradit — ale jeho dotaz kvůli tomu nesmí sahat do
  // `state.doc`, kde leží Deník a Zápisník. Klient je sem zapisuje sám.
  try { await env.DB.prepare("ALTER TABLE members ADD COLUMN modules TEXT").run(); } catch (e) {}
}

// ---- Plán od Tanyho · jen ke čtení ----------------------------------------
// Klient plán neupravuje. Co s ním udělal, se vrací kanálem share, ne sem.
async function handlePlan(request, env, userId) {
  if (request.method !== "GET") {
    return Response.json({ ok: false, error: "method not allowed" }, { status: 405 });
  }
  await ensureSchema(env);
  const row = await env.DB.prepare("SELECT doc, updated_at FROM plans WHERE user_id = ?").bind(userId).first();
  if (!row) return Response.json({ doc: null, updated_at: null });
  let doc = null;
  try { doc = JSON.parse(row.doc); } catch (e) {}
  return Response.json({ doc, updated_at: row.updated_at });
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
  await ensureSchema(env);
  const row = await env.DB.prepare("SELECT name FROM members WHERE user_id = ?").bind(userId).first();
  return Response.json({ member: !!row, name: (row && row.name) || "", owner: await ownerTag(userId) });
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
  const email = accessEmail(request);
  // Vstupní slovo nesmí být cesta do cizího prostoru: když id už drží jiná
  // adresa, členství nevzniká.
  if (await identityConflict(env, userId, email)) return identityConflictResponse();
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
    // Vědomé sdílení: klientská aplikace přibaluje snímek (nebo null = vypnuto).
    // Tvar se ověřuje tady. Když souhrn neprojde, sdílení se zneplatní —
    // radši ať trenér nevidí nic, než aby uviděl něco, co vidět nemá.
    if (body && "share" in body) {
      let s = null;
      if (body.share != null) {
        const check = validateShareSnapshot(body.share);
        if (!check.ok) {
          return Response.json({ ok: false, error: "share summary refused", detail: check.errors.slice(0, 8) }, { status: 400 });
        }
        const raw = JSON.stringify(body.share);
        if (raw.length <= 100000) s = raw; // pojistka velikosti
      }
      await env.DB.prepare("UPDATE members SET share = ? WHERE user_id = ?").bind(s, userId).run();
    }
    // Zapnuté soukromé místnosti do vlastního sloupce. Jen jména z povoleného
    // seznamu — nic jiného se odsud k trenérovi nedostane.
    {
      let mods = null;
      try {
        const doc = body && body.doc;
        const list = doc && doc.coll && doc.coll.modules;
        if (Array.isArray(list)) {
          mods = JSON.stringify(list.filter((k) => CLIENT_OPTIONAL.indexOf(k) !== -1));
        }
        const memento = doc && doc.coll && doc.coll.memento && doc.coll.memento.zapnuto;
        if (memento) {
          const cur = mods ? JSON.parse(mods) : [];
          if (cur.indexOf("memento") === -1) cur.push("memento");
          mods = JSON.stringify(cur);
        }
      } catch (e) { mods = null; }
      await env.DB.prepare("UPDATE members SET modules = ? WHERE user_id = ?").bind(mods, userId).run();
    }
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

// ---- Hlavičky ------------------------------------------------------------
// Doména neposílala žádnou bezpečnostní hlavičku. Tohle je nejpřísnější
// podoba, která tuhle aplikaci nerozbíjí: skripty jen naše, rámování žádné,
// odkazy ven bez adresy stránky. Styly zůstávají povolené vloženě — celá
// aplikace je psaná inline styly a hodnotami motivu, takže „unsafe-inline"
// v style-src tu není nedbalost, ale popis skutečnosti.
// Vložený skript v index.html (dorovnání barvy pole ještě před vykreslením)
// je povolený otiskem, ne plošným 'unsafe-inline' — a test hlídá, že otisk
// pořád sedí. Styly vložené zůstávají: aplikace je psaná inline styly a
// hodnotami motivu, tvrdit u nich přísnost by bylo nepřesné.
const INDEX_INLINE_SCRIPT_HASH = "sha256-RZnGqinxcD011ckQ3HDe0daemj4Ha7TmEDdvPhWYB3M=";
const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' '" + INDEX_INLINE_SCRIPT_HASH + "'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob:",
  "media-src 'self' data: blob:",
  "connect-src 'self'",
  "worker-src 'self'",
  "manifest-src 'self'",
].join("; ");

function withSecurityHeaders(res) {
  const h = new Headers(res.headers);
  h.set("Content-Security-Policy", CSP);
  h.set("X-Content-Type-Options", "nosniff");
  h.set("Referrer-Policy", "no-referrer");
  h.set("X-Frame-Options", "DENY");
  h.set("Permissions-Policy", "geolocation=(), camera=(), payment=(), usb=(), interest-cohort=()");
  h.set("Cross-Origin-Opener-Policy", "same-origin");
  h.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
}

// ---- R2 files ---------------------------------------------------------------
const ID_RE = /^[A-Za-z0-9_-]{1,128}$/;

// Typ obsahu si u nahrávání určuje ten, kdo nahrává. Kdyby se takový soubor
// podal zpět jako text/html, běžel by cizí kód na naší doméně a viděl by na
// všechno, co tu člověk má. Vlastní médium podáváme, jak přišlo; cokoli
// jiného odchází jako stažení a nikdy se nevykresluje.
const INLINE_OK = /^(image\/|audio\/|video\/|application\/pdf$|text\/plain)/i;
// SVG a text jsou obrázek i dokument zároveň — pískoviště je odřízne od
// naší domény, aniž by přestaly být obrázkem v <img>.
const NEEDS_SANDBOX = /^(image\/svg|text\/)/i;

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
    const ct = headers.get("Content-Type") || "application/octet-stream";
    if (!INLINE_OK.test(ct)) {
      headers.set("Content-Type", "application/octet-stream");
      headers.set("Content-Disposition", "attachment");
    }
    if (!INLINE_OK.test(ct) || NEEDS_SANDBOX.test(ct)) {
      headers.set("Content-Security-Policy", "default-src 'none'; sandbox");
    }
    headers.set("X-Content-Type-Options", "nosniff");
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
  async fetch(request, env, ctx) {
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

      // Než cokoli jiného: sedí id na tuhle adresu?
      await ensureSchema(env);
      if (await identityConflict(env, userId, accessEmail(request))) return identityConflictResponse();

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

      // Jméno člena — zobrazí se jemu i Tanymu v přehledu klientů.
      if (url.pathname === "/api/profile") {
        if (request.method !== "POST") {
          return Response.json({ ok: false, error: "method not allowed" }, { status: 405 });
        }
        let body;
        try { body = await request.json(); } catch { body = {}; }
        const name = String(body.name || "").trim().slice(0, 80);
        await env.DB.prepare("UPDATE members SET name = ? WHERE user_id = ?").bind(name, userId).run();
        return Response.json({ ok: true, name });
      }

      // Termíny · rezervace, sloty a kredity. Vlastnictví se odvozuje ze
      // session, ne z těla požadavku — cizí id se sem nedá poslat.
      if (url.pathname.startsWith("/api/client/booking") || url.pathname.startsWith("/api/client/bookings")
          || url.pathname === "/api/client/credits") {
        const odpoved = await handleClient(request, env, url, userId, ctx);
        if (odpoved) return odpoved;
        return Response.json({ ok: false, error: "not found" }, { status: 404 });
      }

      if (url.pathname === "/api/state") {
        return handleState(request, env, userId);
      }
      if (url.pathname === "/api/plan") {
        return handlePlan(request, env, userId);
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

    return withSecurityHeaders(await env.ASSETS.fetch(request));
  },
};
