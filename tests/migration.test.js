// MIGRACE SCHÉMATU · druhý běh nesmí nic udělat a nic nesmí zmizet.
//
// Produkční databáze se nemigruje ručním SQL. `ensureSchema` běží při každém
// požadavku na /api/*, takže se schéma dorovná samo — a právě proto musí být
// jistota, že se dorovná i podruhé, potřetí a při každém dalším nasazení,
// aniž by se ztratil jediný řádek.
//
// Co se nesmí ztratit nikdy: rezervace, kredity, balíčky, trénink, účet
// klienta, jeho soukromé psaní, cíle a prameny od trenéra.
import { test } from "node:test";
import assert from "node:assert/strict";
import worker from "../worker/index.js";
import { makeEnv, req } from "./helpers/env.js";

const A = "klient-a@example.test";

const NUTNE = ["state", "members", "plans", "goals", "sources"];
const CHRANENE = ["state", "members", "plans", "goals", "sources", "bookings", "credits", "packages"];

async function tabulky(env) {
  const r = await env.DB.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all();
  return new Set(((r && r.results) || []).map((x) => x.name));
}
async function sloupce(env, t) {
  const r = await env.DB.prepare("PRAGMA table_info(" + t + ")").all();
  return ((r && r.results) || []).map((x) => x.name);
}
async function snimek(env) {
  const out = {};
  for (const t of [...(await tabulky(env))].sort()) {
    if (t.startsWith("sqlite_")) continue;
    const r = await env.DB.prepare("SELECT * FROM " + t).all();
    out[t] = JSON.stringify((r && r.results) || []);
  }
  return out;
}

test("schéma se dorovná samo, i když databáze byla stará", async () => {
  const env = makeEnv();
  // Stará podoba: members bez name / share / modules, žádné plans, goals, sources.
  await env.DB.prepare("CREATE TABLE members (user_id TEXT PRIMARY KEY, email TEXT NOT NULL, joined_at INTEGER NOT NULL)").run();
  await env.DB.prepare("CREATE TABLE state (user_id TEXT PRIMARY KEY, doc TEXT NOT NULL, updated_at INTEGER NOT NULL, version INTEGER NOT NULL DEFAULT 1)").run();
  await env.DB.prepare("INSERT INTO members (user_id, email, joined_at) VALUES (?, ?, ?)").bind("klient-a-example-test", A, 1).run();
  await env.DB.prepare("INSERT INTO state (user_id, doc, updated_at, version) VALUES (?, ?, ?, ?)").bind("klient-a-example-test", JSON.stringify({ coll: { journal: [{ id: "j1", text: "SOUKROMY" }] } }), 2, 3).run();

  const r = await worker.fetch(req("/api/me", { email: A }), env);
  assert.equal(r.status, 200, await r.text());

  const t = await tabulky(env);
  for (const n of NUTNE) assert.ok(t.has(n), "chybí tabulka " + n);
  const c = await sloupce(env, "members");
  for (const n of ["name", "share", "modules"]) assert.ok(c.indexOf(n) !== -1, "chybí sloupec members." + n);

  // Nic se nesmělo ztratit.
  const row = await env.DB.prepare("SELECT doc, version FROM state WHERE user_id = ?").bind("klient-a-example-test").first();
  assert.ok(row && row.doc.indexOf("SOUKROMY") !== -1, "klientův dokument migrace nesmí přepsat");
  assert.equal(row.version, 3, "verze dokumentu zůstává");
  const m = await env.DB.prepare("SELECT email FROM members WHERE user_id = ?").bind("klient-a-example-test").first();
  assert.equal(m.email, A);
});

test("druhý běh migrace je no-op · nic nepřibude, nic nezmizí", async () => {
  const env = makeEnv();
  await worker.fetch(req("/api/me", { email: A }), env);
  await worker.fetch(req("/api/join", { email: A, method: "POST", body: { word: "otevri se" } }), env);
  await worker.fetch(req("/api/state", { email: A, method: "PUT", body: { doc: { coll: { tajne: "A" }, edits: {} } } }), env);
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS bookings (id TEXT PRIMARY KEY, user_id TEXT)").run();
  await env.DB.prepare("INSERT INTO bookings (id, user_id) VALUES ('b1', 'klient-a-example-test')").run();
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS credits (id TEXT PRIMARY KEY, user_id TEXT, n INTEGER)").run();
  await env.DB.prepare("INSERT INTO credits (id, user_id, n) VALUES ('c1', 'klient-a-example-test', 5)").run();

  const pred = await snimek(env);
  // Druhý, třetí a čtvrtý běh · přesně to, co se stane při každém dalším nasazení.
  for (let i = 0; i < 3; i++) await worker.fetch(req("/api/me", { email: A }), env);
  const po = await snimek(env);

  assert.deepEqual(Object.keys(po).sort(), Object.keys(pred).sort(), "migrace nesmí přidat ani ubrat tabulku");
  for (const t of Object.keys(pred)) {
    assert.equal(po[t], pred[t], "migrace změnila obsah tabulky " + t);
  }
});

test("migrace nikdy nemaže · v kódu není DROP ani DELETE nad chráněnou tabulkou", async () => {
  const { readFileSync } = await import("node:fs");
  const src = readFileSync(new URL("../worker/index.js", import.meta.url), "utf8");
  const schema = src.slice(src.indexOf("async function ensureSchema"), src.indexOf("// ---- Plán od Tanyho"));
  assert.equal(/\bDROP\s+TABLE\b/i.test(schema), false, "migrace nesmí nikdy DROPovat");
  assert.equal(/\bDELETE\s+FROM\b/i.test(schema), false, "migrace nesmí nikdy mazat řádky");
  assert.equal(/\bTRUNCATE\b/i.test(schema), false);
  // A totéž v celém Workeru pro chráněné tabulky.
  for (const t of CHRANENE) {
    assert.equal(new RegExp("DROP\\s+TABLE\\s+(IF\\s+EXISTS\\s+)?" + t + "\\b", "i").test(src), false, "nikde se nesmí DROPovat " + t);
  }
});

test("stav schématu se dá přečíst z aplikace, ne ručním SQL", async () => {
  const env = makeEnv();
  const r = await worker.fetch(req("/api/health"), env);
  assert.equal(r.status, 200);
  const b = await r.json();
  assert.ok(b.schema, "health musí hlásit stav schématu");
  assert.deepEqual([...b.schema.tables].sort(), [...NUTNE].sort(), "health musí hlásit právě ty tabulky, které migrace zakládá");
  assert.deepEqual(b.schema.missing, [], "po dorovnání nesmí chybět žádná nutná tabulka");
  for (const c of ["name", "share", "modules"]) assert.ok(b.schema.memberColumns.indexOf(c) !== -1, "chybí sloupec " + c);
  // Tohle je ta věta, kvůli které celý report existuje: po nasazení se dá
  // z aplikace přečíst, že je schéma připravené. Když `ready` nemůže být
  // nikdy true, report nic nehlásí — jen straší.
  assert.equal(b.schema.ready, true, "po dorovnání musí být schéma připravené");
});

test("nutné tabulky v /api/health jsou opravdu ty, které Worker zakládá", async () => {
  // Seznam v `/api/health` se dá napsat z hlavy a nikdo si toho nevšimne:
  // vymyšlené jméno chybí navždy a `ready` je navždy false. Proto se seznam
  // porovnává se zdrojem Workeru, ne s pamětí toho, kdo ho psal.
  const { readFileSync } = await import("node:fs");
  const src = readFileSync(new URL("../worker/index.js", import.meta.url), "utf8");

  const m = src.match(/const nutne = \[([^\]]*)\]/);
  assert.ok(m, "v /api/health musí stát seznam nutných tabulek");
  const hlasene = m[1].split(",").map((x) => x.trim().replace(/^["']|["']$/g, "")).filter(Boolean);

  const zakladane = new Set();
  for (const x of src.matchAll(/CREATE TABLE IF NOT EXISTS\s+([a-z_]+)/gi)) zakladane.add(x[1]);
  // `goals` a `sources` vznikají v cyklu, jméno se do SQL vkládá spojením.
  for (const x of src.matchAll(/for \(const jmeno of \[([^\]]+)\]/g)) {
    for (const j of x[1].split(",")) zakladane.add(j.trim().replace(/^["']|["']$/g, ""));
  }

  const vymyslene = hlasene.filter((t) => !zakladane.has(t));
  assert.deepEqual(vymyslene, [], "health hlásí tabulky, které nikdo nezakládá: " + vymyslene.join(", "));
  assert.deepEqual([...hlasene].sort(), [...NUTNE].sort(), "seznam v health se rozešel s tím, co testy považují za nutné");
});
