// Hranice klientské aplikace, ověřené proti skutečnému Workeru.
// Každý případ tady odpovídá chybě, která v aplikaci opravdu byla.
import { test } from "node:test";
import assert from "node:assert/strict";
import worker from "../worker/index.js";
import { makeEnv, req } from "./helpers/env.js";

const A = "klient-a@example.test";
const B = "klient-b@example.test";

async function joined(env, email) {
  await worker.fetch(req("/api/me", { email }), env); // jako aplikace: nejdřív se představ
  const r = await worker.fetch(req("/api/join", { email, method: "POST", body: { word: "otevri se" } }), env);
  assert.equal(r.status, 200, "vstupní slovo mělo projít");
  return env;
}

test("bez identity od Accessu se na /api/* nedostane nikdo", async () => {
  const env = makeEnv();
  for (const p of ["/api/me", "/api/state", "/api/plan", "/api/files"]) {
    const r = await worker.fetch(req(p), env);
    assert.equal(r.status, 401, p + " mělo odmítnout anonymní požadavek");
  }
});

test("bez vstupního slova není členství a nic se nezapíše", async () => {
  const env = makeEnv();
  const me = await worker.fetch(req("/api/me", { email: A }), env);
  assert.equal((await me.json()).member, false);
  const st = await worker.fetch(req("/api/state", { email: A }), env);
  assert.equal(st.status, 403);
  const bad = await worker.fetch(req("/api/join", { email: A, method: "POST", body: { word: "cokoliv" } }), env);
  assert.equal(bad.status, 403);
});

test("klient A nevidí a nepřepíše dokument klienta B", async () => {
  const env = makeEnv();
  await joined(env, A); await joined(env, B);
  await worker.fetch(req("/api/state", { email: A, method: "PUT", body: { doc: { coll: { tajne: "A" }, edits: {} } } }), env);
  const bView = await (await worker.fetch(req("/api/state", { email: B }), env)).json();
  assert.equal(bView.doc, null, "B nesmí dostat dokument A");
  await worker.fetch(req("/api/state", { email: B, method: "PUT", body: { doc: { coll: { tajne: "B" }, edits: {} } } }), env);
  const aView = await (await worker.fetch(req("/api/state", { email: A }), env)).json();
  assert.equal(aView.doc.coll.tajne, "A", "zápis B nesmí přepsat řádek A");
});

test("klient A se nedostane k příloze klienta B ani přes její identifikátor", async () => {
  const env = makeEnv();
  await joined(env, A); await joined(env, B);
  const up = await worker.fetch(req("/api/files/sdileny-id", { email: B, method: "PUT", body: "tajny obsah", headers: { "Content-Type": "text/plain" } }), env);
  assert.equal(up.status, 200);
  const steal = await worker.fetch(req("/api/files/sdileny-id", { email: A }), env);
  assert.equal(steal.status, 404, "stejné id pod cizí identitou nesmí nic vrátit");
  const mine = await worker.fetch(req("/api/files/sdileny-id", { email: B }), env);
  assert.equal(mine.status, 200);
  const list = await (await worker.fetch(req("/api/files", { email: A }), env)).json();
  assert.deepEqual(list.files, [], "výpis souborů nesmí ukázat cizí objekty");
});

test("plán od trenéra je pro klienta jen ke čtení", async () => {
  const env = makeEnv();
  await joined(env, A);
  for (const method of ["PUT", "POST", "DELETE"]) {
    const r = await worker.fetch(req("/api/plan", { email: A, method, body: { doc: { podvrzeno: true } } }), env);
    assert.equal(r.status, 405, "klient nesmí zapisovat do plánu (" + method + ")");
  }
});

test("trenérské cesty v klientském Workeru neexistují", async () => {
  const env = makeEnv();
  await joined(env, A);
  for (const p of ["/api/klienti", "/api/klienti/klient-b-example-test", "/api/klienti/klient-b-example-test/plan"]) {
    const r = await worker.fetch(req(p, { email: A }), env);
    assert.equal(r.status, 404, p + " nesmí být obsluhované");
  }
});

test("otisk vlastníka je stabilní, liší se po lidech a neobsahuje adresu", async () => {
  const env = makeEnv();
  await joined(env, A); await joined(env, B);
  const a1 = (await (await worker.fetch(req("/api/me", { email: A }), env)).json()).owner;
  const a2 = (await (await worker.fetch(req("/api/me", { email: A }), env)).json()).owner;
  const b1 = (await (await worker.fetch(req("/api/me", { email: B }), env)).json()).owner;
  assert.match(a1, /^[0-9a-f]{16}$/);
  assert.equal(a1, a2, "otisk se mezi voláními nesmí měnit");
  assert.notEqual(a1, b1, "dva lidé nesmí mít stejný otisk");
  assert.ok(!a1.includes("klient") && !a1.includes("example"), "otisk nesmí nést adresu");
});

test("srážka očištěných adres nepustí druhého člověka do cizího prostoru", async () => {
  // "a.b@x.test" i "a+b@x.test" se očistí na totéž id. Druhá schránka je
  // dosažitelná někomu jinému, takže druhý příchozí nesmí dostat první řádek.
  const env = makeEnv();
  const first = "a.b@x.test";
  const second = "a+b@x.test";
  await joined(env, first);
  await worker.fetch(req("/api/state", { email: first, method: "PUT", body: { doc: { coll: { tajne: "prvni" }, edits: {} } } }), env);
  const me = await worker.fetch(req("/api/me", { email: second }), env);
  assert.equal(me.status, 409, "srážka identit musí skončit odmítnutím");
  const join = await worker.fetch(req("/api/join", { email: second, method: "POST", body: { word: "otevri se" } }), env);
  assert.equal(join.status, 409, "vstupní slovo nesmí být cesta do cizího prostoru");
  const st = await worker.fetch(req("/api/state", { email: second }), env);
  assert.equal(st.status, 409);
});

test("neplatný identifikátor souboru se odmítne, ne projde do klíče", async () => {
  const env = makeEnv();
  await joined(env, A);
  for (const id of ["..%2Fjiny", "a/b", "x".repeat(200), ""]) {
    const r = await worker.fetch(req("/api/files/" + id, { email: A }), env);
    assert.ok(r.status === 400 || r.status === 404, "id '" + id.slice(0, 12) + "' nesmí projít (" + r.status + ")");
  }
});

test("odpověď na chybu nevynáší vnitřnosti", async () => {
  const env = makeEnv();
  const r = await worker.fetch(req("/api/state", { email: A }), env);
  const body = await r.text();
  assert.ok(!/at\s+\w+\s+\(/.test(body), "žádný stack trace");
  assert.ok(!body.includes("/home/") && !body.includes("C:\\"), "žádná cesta v souborovém systému");
});

test("nahraný soubor se nikdy nevrátí jako spustitelný dokument", async () => {
  const env = makeEnv();
  await joined(env, A);
  const zlomyslne = [
    ["text/html", "html"],
    ["application/xhtml+xml", "xhtml"],
    ["image/svg+xml", "svg"],
    ["text/javascript", "js"],
  ];
  for (const [typ, id] of zlomyslne) {
    await worker.fetch(req("/api/files/" + id, { email: A, method: "PUT", body: "<svg onload=1>", headers: { "Content-Type": typ } }), env);
    const r = await worker.fetch(req("/api/files/" + id, { email: A }), env);
    const ct = r.headers.get("content-type") || "";
    assert.equal(r.headers.get("x-content-type-options"), "nosniff", typ + ": chybí nosniff");
    assert.match(r.headers.get("content-security-policy") || "", /sandbox/, typ + ": chybí pískoviště");
    if (/^(text\/html|application\/xhtml|text\/javascript)/.test(typ)) {
      assert.match(ct, /application\/octet-stream/, typ + " se nesmí podat jako dokument");
      assert.equal(r.headers.get("content-disposition"), "attachment", typ + ": musí odejít jako stažení");
    }
  }
  // běžné médium zůstává médiem
  await worker.fetch(req("/api/files/pic", { email: A, method: "PUT", body: "x", headers: { "Content-Type": "image/png" } }), env);
  const ok = await worker.fetch(req("/api/files/pic", { email: A }), env);
  assert.match(ok.headers.get("content-type") || "", /image\/png/);
  assert.equal(ok.headers.get("content-disposition"), null);
});

test("stránka odchází s bezpečnostními hlavičkami", async () => {
  const env = makeEnv();
  const r = await worker.fetch(req("/", { email: A }), env);
  const csp = r.headers.get("content-security-policy") || "";
  assert.match(csp, /script-src 'self'/, "skripty jen z naší domény");
  assert.ok(!/script-src[^;]*unsafe-inline/.test(csp), "žádný vložený skript");
  assert.ok(!/script-src[^;]*unsafe-eval/.test(csp), "žádné eval");
  assert.match(csp, /frame-ancestors 'none'/);
  assert.match(csp, /object-src 'none'/);
  assert.equal(r.headers.get("x-content-type-options"), "nosniff");
  assert.equal(r.headers.get("referrer-policy"), "no-referrer");
  assert.equal(r.headers.get("x-frame-options"), "DENY");
  assert.match(r.headers.get("strict-transport-security") || "", /max-age=\d{7,}/);
});

test("členství vznikne i na úplně prázdné databázi", async () => {
  // handleJoin dřív spoléhal na to, že tabulky založilo předchozí /api/me.
  const env = makeEnv();
  const r = await worker.fetch(req("/api/join", { email: A, method: "POST", body: { word: "otevri se" } }), env);
  assert.equal(r.status, 200, await r.text());
});

// ---- zpětný kanál · co klient odcvičil, a jen to -----------------------------
test("share se uloží k tomu, kdo ho poslal, a nikomu jinému", async () => {
  const env = makeEnv();
  await joined(env, A); await joined(env, B);
  const share = { training: { v: 2, at: 1, sessions: [{ id: "ses1", date: "2026-08-21", blocks: [] }], sched: {} } };
  const put = await worker.fetch(req("/api/state", { email: A, method: "PUT", body: { doc: { coll: { tv2: { v: 2 } } }, share } }), env);
  assert.equal(put.status, 200, await put.text());
  const rowA = await env.DB.prepare("SELECT share FROM members WHERE user_id = ?").bind("klient-a-example-test").first();
  const rowB = await env.DB.prepare("SELECT share FROM members WHERE user_id = ?").bind("klient-b-example-test").first();
  assert.ok(rowA && rowA.share && JSON.parse(rowA.share).training.sessions.length === 1);
  assert.ok(!rowB || !rowB.share, "sdílení jednoho klienta se nikdy nepřipíše druhému");
});

test("stejný záznam poslaný dvakrát se přepíše, ne zdvojí", async () => {
  const env = makeEnv();
  await joined(env, A);
  const one = { training: { v: 2, at: 1, sessions: [{ id: "ses1", effort: 85 }], sched: {} } };
  const again = { training: { v: 2, at: 2, sessions: [{ id: "ses1", effort: 100 }], sched: {} } };
  await worker.fetch(req("/api/state", { email: A, method: "PUT", body: { doc: { coll: {} }, share: one } }), env);
  await worker.fetch(req("/api/state", { email: A, method: "PUT", body: { doc: { coll: {} }, share: again } }), env);
  const row = await env.DB.prepare("SELECT share FROM members WHERE user_id = ?").bind("klient-a-example-test").first();
  const parsed = JSON.parse(row.share);
  assert.equal(parsed.training.sessions.length, 1);
  assert.equal(parsed.training.sessions[0].effort, 100, "poslední pravda vyhrává, ale je pořád jedna");
});

test("share se dá vypnout · pošle se null a v databázi nezůstane", async () => {
  const env = makeEnv();
  await joined(env, A);
  await worker.fetch(req("/api/state", { email: A, method: "PUT", body: { doc: { coll: {} }, share: { training: { v: 2, sessions: [{ id: "x" }] } } } }), env);
  await worker.fetch(req("/api/state", { email: A, method: "PUT", body: { doc: { coll: {} }, share: null } }), env);
  const row = await env.DB.prepare("SELECT share FROM members WHERE user_id = ?").bind("klient-a-example-test").first();
  assert.equal(row.share, null);
});
