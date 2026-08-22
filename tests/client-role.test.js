// ROLE KLIENTA · co klient smí, co nesmí, a co o něm smí vidět trenér.
//
// Skrytí v rozhraní není důkaz. Tenhle soubor se ptá capability vrstvy a
// skutečného Workeru, ne obrazovky.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import worker from "../worker/index.js";
import { makeEnv, req } from "./helpers/env.js";
import {
  ROLES, deriveCapabilities, roomVisible, migrateClientModules,
  CLIENT_ALWAYS, CLIENT_OPTIONAL, CLIENT_NEVER,
} from "../src/shared/product/roles.js";
import { navGroupsFor, dockTabsFor, ROOM_COPY, COPY } from "../src/shared/product/rooms.js";
import { validateShareSnapshot, coachClientRow, habitSummary, goalSummary } from "../src/shared/product/visibility.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const app = readFileSync(join(root, "src/App.tsx"), "utf8");
const A = "klient-a@example.test";
const B = "klient-b@example.test";

async function joined(env, email) {
  await worker.fetch(req("/api/me", { email }), env);
  const r = await worker.fetch(req("/api/join", { email, method: "POST", body: { word: "otevri se" } }), env);
  assert.equal(r.status, 200);
  return env;
}

// ======================================================================
// 1 · CAPABILITY
// ======================================================================

test("klient bez členství nemá vůbec nic", () => {
  const caps = deriveCapabilities({ role: ROLES.CLIENT, member: false, modules: null, share: {} });
  for (const v of Object.values(caps)) assert.equal(v, false);
});

test("Praxe, Trénink, Termíny, Kompas a Prameny jsou vždycky doma", () => {
  const caps = deriveCapabilities({ role: ROLES.CLIENT, member: true, modules: [], share: {} });
  for (const k of CLIENT_ALWAYS) {
    assert.equal(roomVisible(caps, k), true, k + " se nesmí dát vypnout");
  }
});

test("soukromé místnosti jsou ve výchozím stavu zavřené", () => {
  const caps = deriveCapabilities({ role: ROLES.CLIENT, member: true, modules: [], share: {} });
  for (const k of CLIENT_OPTIONAL) {
    assert.equal(roomVisible(caps, k), false, k + " se nesmí otevřít bez volby člověka");
  }
});

test("místnosti trenéra pro klienta neexistují ani jako capability", () => {
  const caps = deriveCapabilities({ role: ROLES.CLIENT, member: true, modules: CLIENT_OPTIONAL.slice(), share: {} });
  for (const k of CLIENT_NEVER) {
    assert.equal(roomVisible(caps, k), false, k + " nesmí být klientovi vidět");
  }
  assert.equal(caps.manageClients, false);
  assert.equal(caps.manageFinances, false);
  assert.equal(caps.manageContent, false);
  assert.equal(caps.manageAvailability, false);
  assert.equal(caps.managePackages, false);
});

test("klient nesmí měnit předpis, ale vidí své výsledky", () => {
  const caps = deriveCapabilities({ role: ROLES.CLIENT, member: true, modules: [], share: {} });
  assert.equal(caps.editTrainingPrescription, false);
  assert.equal(caps.viewTrainingResults, true);
});

test("capability se nedá odemknout uloženým stavem", () => {
  // Podvržený „modules" se zapnutými trenérskými klíči nesmí nic otevřít.
  const caps = deriveCapabilities({
    role: ROLES.CLIENT, member: true,
    modules: ["klienti", "hospodareni", "socsite", "mandala", "denik"],
    share: { habits: true },
  });
  assert.equal(caps.manageClients, false);
  assert.equal(caps.manageFinances, false);
  assert.equal(caps.journal, true, "vlastní Deník se zapnout smí");
});

test("trenérská role má opak: správu ano, klientovo sdílení ne", () => {
  const caps = deriveCapabilities({ role: ROLES.COACH, member: true });
  assert.equal(caps.manageClients, true);
  assert.equal(caps.editTrainingPrescription, true);
  assert.equal(caps.consciousShareHabits, false, "sdílení je klientovo rozhodnutí, ne trenérovo");
});

// ======================================================================
// 2 · MAPA DOMU A DOK
// ======================================================================

test("dok drží Termíny i Trénink, ne obecné přetečení", () => {
  const caps = deriveCapabilities({ role: ROLES.CLIENT, member: true, modules: [], share: {} });
  const tabs = dockTabsFor((k) => roomVisible(caps, k));
  assert.deepEqual(tabs, ["praxe", "trenink", "terminy", "kompas", "prameny"]);
  assert.equal(app.indexOf('"Více"'), -1, "žádné obecné přetečení");
});

test("zapnuté soukromé místnosti přibudou za kritické, ne před ně", () => {
  const caps = deriveCapabilities({ role: ROLES.CLIENT, member: true, modules: ["denik", "zapisnik", "memento"], share: {} });
  const tabs = dockTabsFor((k) => roomVisible(caps, k));
  assert.deepEqual(tabs.slice(0, 5), ["praxe", "trenink", "terminy", "kompas", "prameny"]);
  assert.deepEqual(tabs.slice(5), ["denik", "zapisnik", "memento"]);
});

test("mapa domu je Den, Směr, Paměť a Volitelně, bez Světa", () => {
  const caps = deriveCapabilities({ role: ROLES.CLIENT, member: true, modules: ["denik", "zapisnik", "memento"], share: {} });
  const groups = navGroupsFor((k) => roomVisible(caps, k)).map((g) => g.key);
  assert.deepEqual(groups, ["den", "smer", "pamet", "volitelne"]);
});

test("prázdná skupina se nekreslí", () => {
  const caps = deriveCapabilities({ role: ROLES.CLIENT, member: true, modules: [], share: {} });
  const groups = navGroupsFor((k) => roomVisible(caps, k));
  assert.deepEqual(groups.map((g) => g.key), ["den", "smer", "pamet"]);
  assert.deepEqual(groups.find((g) => g.key === "pamet").rooms, ["prameny"]);
});

// ======================================================================
// 3 · JAZYK
// ======================================================================

test("Prameny se jmenují Prameny a nesou Co si nést dál", () => {
  assert.equal(ROOM_COPY.prameny.cz, "Prameny");
  assert.equal(ROOM_COPY.prameny.en, "Sources");
  assert.equal(COPY.carryForward.cz, "Co si nést dál");
  assert.equal(COPY.carryForward.en, "What to carry forward");
  assert.doesNotMatch(app, /"Materiály"/, "Prameny se nepřejmenovávají");
});

test("místnosti mluví stejně jako v osobní aplikaci", () => {
  assert.equal(ROOM_COPY.praxe.cz, "Praxe");
  assert.equal(ROOM_COPY.trenink.cz, "Trénink");
  assert.equal(ROOM_COPY.terminy.cz, "Termíny");
  assert.equal(ROOM_COPY.kompas.cz, "Kompas");
  assert.equal(ROOM_COPY.denik.cz, "Deník");
  assert.equal(ROOM_COPY.zapisnik.cz, "Zápisník");
  assert.equal(ROOM_COPY.memento.cz, "Memento mori");
});

// ======================================================================
// 4 · MIGRACE STARŠÍ VOLBY MODULŮ
// ======================================================================

test("migrace nezapne nic, co si člověk nezapnul", () => {
  assert.deepEqual(migrateClientModules(["praxe", "kompas"]), []);
  assert.deepEqual(migrateClientModules(["praxe", "denik"]), ["denik"]);
});

test("migrace nevypne soukromou místnost, kterou člověk měl", () => {
  assert.deepEqual(migrateClientModules(["praxe", "denik", "zapisnik"]), ["denik", "zapisnik"]);
});

test("Hospodaření z uložené volby zmizí", () => {
  assert.deepEqual(migrateClientModules(["hospodareni", "praxe"]), []);
});

test("první spuštění zůstane prvním spuštěním", () => {
  assert.equal(migrateClientModules(null), null);
  assert.equal(migrateClientModules(undefined), null);
});

test("migrace je idempotentní", () => {
  const once = migrateClientModules(["praxe", "denik", "hospodareni"]);
  assert.deepEqual(migrateClientModules(once), once);
});

// ======================================================================
// 5 · VĚDOMÉ SDÍLENÍ
// ======================================================================

test("souhrn návyků nese počty a jména, ne text", () => {
  const s = habitSummary(
    [{ h: { rano: 1, vecer: 1 } }, { h: { rano: 1 } }],
    [{ slot: "rano", name: "Ráno" }, { slot: "vecer", name: "Večer" }],
    30
  );
  assert.deepEqual(s, { days: 2, window: 30, rows: [{ name: "Ráno", done: 2 }, { name: "Večer", done: 1 }] });
  assert.equal(JSON.stringify(s).indexOf("note"), -1);
});

test("souhrn cílů zahodí poznámku i příští krok", () => {
  const g = goalSummary([{ name: "Stoj na rukou", status: "In progress", note: "tajné", next: "krok" }]);
  assert.deepEqual(g, [{ name: "Stoj na rukou", status: "In progress" }]);
});

test("souhrn se zamítne, když v něm je cokoliv soukromého", () => {
  assert.equal(validateShareSnapshot({ journal: "x" }).ok, false);
  assert.equal(validateShareSnapshot({ goals: [{ name: "a", status: "b", note: "c" }] }).ok, false);
  assert.equal(validateShareSnapshot({ training: { v: 2, memento: "x" } }).ok, false);
});

test("vypnuté sdílení je null, ne prázdný objekt", () => {
  assert.equal(validateShareSnapshot(null).ok, true);
  assert.match(app, /if \(!Object\.keys\(snap\)\.length\) return null;/);
});

test("aplikace souhrn ověří dřív, než ho pošle", () => {
  assert.match(app, /const v = validateShareSnapshot\(snap\);/);
  assert.match(app, /if \(!v\.ok\).*return null;/s);
});

// ======================================================================
// 6 · HRANICE PROTI SERVERU
// ======================================================================

test("server odmítne souhrn, který nese soukromý text", async () => {
  const env = makeEnv();
  await joined(env, A);
  const bad = await worker.fetch(req("/api/state", {
    email: A, method: "PUT",
    body: { doc: { coll: {} }, share: { journal: [{ text: "co jsem dnes psal" }] } },
  }), env);
  assert.equal(bad.status, 400, "prohlížeč není hranice — hranice je tady");
  const row = await env.DB.prepare("SELECT share FROM members WHERE user_id = ?").bind("klient-a-example-test").first();
  assert.ok(!row || !row.share, "nic se nesmí uložit");
});

test("zapnuté místnosti jdou trenérovi vlastním sloupcem, ne dokumentem", async () => {
  const env = makeEnv();
  await joined(env, A);
  await worker.fetch(req("/api/state", {
    email: A, method: "PUT",
    body: { doc: { coll: { modules: ["denik"], memento: { zapnuto: true }, journal: [{ text: "soukromé" }] } } },
  }), env);
  const row = await env.DB.prepare("SELECT modules FROM members WHERE user_id = ?").bind("klient-a-example-test").first();
  assert.deepEqual(JSON.parse(row.modules).sort(), ["denik", "memento"]);
  assert.equal(row.modules.indexOf("soukromé"), -1);
});

test("do sloupce modulů se nedostane nic mimo povolený seznam", async () => {
  const env = makeEnv();
  await joined(env, A);
  await worker.fetch(req("/api/state", {
    email: A, method: "PUT",
    body: { doc: { coll: { modules: ["denik", "hospodareni", "klienti", "../../etc"] } } },
  }), env);
  const row = await env.DB.prepare("SELECT modules FROM members WHERE user_id = ?").bind("klient-a-example-test").first();
  assert.deepEqual(JSON.parse(row.modules), ["denik"]);
});

test("řádek pro trenéra je povolený seznam polí, ne dokument", () => {
  const out = coachClientRow({
    user_id: "a", email: "a@b.c", name: "A", joined_at: 1, last_active: 2, syncs: 3,
    modules: ["denik"], share: { habits: {} },
    doc: "SOUKROMÝ DOKUMENT", journal: "x", coach_note: "y",
  });
  assert.deepEqual(Object.keys(out).sort(), ["email", "joined_at", "last_active", "modules", "name", "share", "syncs", "user_id"]);
});

test("trenérský dotaz už nesahá do state.doc", () => {
  const coach = readFileSync(join(root, "../tanmay-web/worker/index.js"), "utf8");
  const q = coach.slice(coach.indexOf("async function handleKlientiList"), coach.indexOf("async function handleKlientEdit"));
  assert.equal(/s\.doc/.test(q), false, "dokument klienta se do trenérského dotazu nesmí vrátit");
  assert.match(q, /m\.modules/, "moduly mají vlastní sloupec");
  assert.match(q, /coachClientRow\(/, "odpověď projde povoleným seznamem");
});

// ======================================================================
// 7 · SESTAVENÍ
// ======================================================================

test("v klientském zdroji není vyřazená paleta ani zrno", () => {
  for (const n of ["THEME_ATELIER", "THEME_BRAND", "TM_PALETTE", "GRAIN_URI", "Tidelight"]) {
    assert.doesNotMatch(app, new RegExp("\\b" + n + "\\b"), n + " je vyřazený");
  }
  assert.doesNotMatch(app, /linear-gradient\(140deg/, "hero bez přechodu");
});

test("motiv a typografie se berou ze sdíleného jádra", () => {
  assert.match(app, /from "\.\/shared\/ui\/theme\.js"/);
  assert.match(app, /from "\.\/shared\/ui\/type\.js"/);
  assert.match(app, /from "\.\/shared\/lang\/lang\.js"/);
  assert.equal(/^const THEME_/m.test(app), false, "vlastní paleta v aplikaci nemá co dělat");
  assert.equal(/^function makeTheme\(/m.test(app), false, "makeTheme patří do jádra");
});

test("volba světla přežije zavření aplikace", () => {
  assert.match(app, /localStorage\.getItem\("tm-theme"\)/);
  assert.match(app, /localStorage\.setItem\("tm-theme", mode\)/);
  assert.match(app, /return "light";/, "dům se otevírá do světla");
});

test("balík má správnou identitu", () => {
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  assert.equal(pkg.name, "tanmay-klient");
  const man = JSON.parse(readFileSync(join(root, "public/manifest.webmanifest"), "utf8"));
  assert.equal(/^#[0-9A-Fa-f]{6}$/.test(man.background_color), true, "barva pozadí musí být platná barva");
  assert.equal(/^#[0-9A-Fa-f]{6}$/.test(man.theme_color), true, "barva motivu musí být platná barva");
  assert.equal(man.background_color, "#F4F0EB");
  assert.doesNotMatch(JSON.stringify(man), /tanmay-web|Notion/);
});

test("otisk vloženého skriptu v CSP odpovídá index.html", async () => {
  const { createHash } = await import("node:crypto");
  const html = readFileSync(join(root, "index.html"), "utf8");
  const w = readFileSync(join(root, "worker/index.js"), "utf8");
  const m = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)];
  assert.equal(m.length, 1, "index.html má mít právě jeden vložený skript");
  const hash = "sha256-" + createHash("sha256").update(m[0][1], "utf8").digest("base64");
  const inCsp = w.match(/INDEX_INLINE_SCRIPT_HASH = "([^"]+)"/);
  assert.ok(inCsp, "Worker musí otisk nést");
  assert.equal(inCsp[1], hash, "otisk v CSP nesedí na skript v index.html");
});

test("klientský Worker nemá vazbu na osobní databázi", () => {
  const wr = readFileSync(join(root, "wrangler.jsonc"), "utf8");
  assert.doesNotMatch(wr, /"tanmay-data"/, "klientský Worker nesmí sáhnout na osobní D1");
  assert.doesNotMatch(wr, /"tanmay-files"/, "ani na osobní R2");
  assert.match(wr, /"tanmay-data-klient"/);
  assert.match(wr, /"tanmay-files-klient"/);
});

test("sdílené jádro má v obou aplikacích tutéž verzi", () => {
  const mine = JSON.parse(readFileSync(join(root, "src/shared/manifest.json"), "utf8"));
  const theirs = JSON.parse(readFileSync(join(root, "../tanmay-web/src/shared/manifest.json"), "utf8"));
  assert.equal(mine.sharedCoreVersion, theirs.sharedCoreVersion);
  assert.deepEqual(mine.files, theirs.files, "zrcadla se rozešla");
});
