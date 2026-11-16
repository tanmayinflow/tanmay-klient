// Chyby, které tu jednou byly. Každá věta popisuje situaci, ve které se to
// pokazilo, ne funkci, která to způsobila — protože kdyby se to opravovalo
// podle funkcí, vrátilo by se to jinou cestou.
import { test } from "node:test";
import assert from "node:assert/strict";
import { makeD1 } from "./helpers/env.js";
import { seedBooking, givePackage, at, TZ } from "./helpers/seed.js";
import { ensureBookingSchema } from "../worker/booking/schema.js";
import { migrateLegacy } from "../worker/booking/migrate.js";
import * as E from "../worker/booking/engine.js";
import * as R from "../worker/booking/repo.js";
import * as G from "../worker/booking/google.js";
import { ERR } from "../src/booking/types.js";
import { zonedToUtc, hhmm } from "../src/booking/time.js";

const NOW = at("2026-08-24", "07:00");
async function fresh(units = 10) {
  const db = makeD1();
  await seedBooking(db);
  await givePackage(db, "cl_a", units);
  await givePackage(db, "cl_b", units, { id: "cp_b" });
  return db;
}
const book = (db, clientId, iso, hhmmStr, extra = {}) => E.createBooking(db, {
  clientId, serviceId: "svc_pt", locationId: "loc_studio", startsAt: at(iso, hhmmStr),
  now: NOW, actor: "CLIENT", ...extra,
});

test("přeplánování doopravdy přesune termín", async () => {
  // Celá cesta padala na proměnnou, která v té funkci neexistovala, takže
  // každý přesun skončil pětistovkou a termín tiše zůstal, kde byl. Testy to
  // neodhalily, protože obě tehdejší zkoušky spadly dřív.
  const db = await fresh();
  const b = await book(db, "cl_a", "2026-08-26", "10:00");
  const cil = at("2026-08-26", "14:00");
  const po = await E.rescheduleBooking(db, b.id, { startsAt: cil, now: NOW, actor: "CLIENT" });
  assert.equal(Number(po.starts_at_utc), cil);
  assert.equal(Number(po.version), 2);
  const cells = (await db.prepare("SELECT slot_cell FROM booking_slot_locks WHERE booking_id = ?").bind(b.id).all()).results;
  await assert.rejects(() => book(db,"cl_b","2026-08-26","14:00"), e=>e.code===ERR.SLOT_TAKEN, "nový čas je chráněný přesným intervalem");
  const volny = await book(db, "cl_b", "2026-08-26", "10:00");
  assert.ok(volny.id, "a ty původní se uvolnily");
  assert.equal((await E.creditSummary(db, "cl_a")).balance.reserved, 1, "kredit se přesunem nezdvojil");
});

test("poražený přechod nesmí poslat do kalendáře zrušení vítězovy události", async () => {
  // Trenér potvrzuje ve chvíli, kdy klient ruší. Zápis do kalendáře i záznam
  // do historie patří tomu, kdo vyhrál — jinak potvrzené sezení z kalendáře
  // zmizí hned po tom, co se v něm objevilo.
  const db = makeD1();
  await seedBooking(db);
  await givePackage(db, "cl_a", 5);
  const b = await E.createBooking(db, { clientId: "cl_a", serviceId: "svc_req", locationId: "loc_studio",
    startsAt: at("2026-08-26", "10:00"), now: NOW, actor: "CLIENT" });
  assert.equal(b.status, "REQUESTED");
  const [potvrzeni, zruseni] = await Promise.allSettled([
    E.transitionBooking(db, b.id, "confirm", { actor: "COACH", now: NOW }),
    E.transitionBooking(db, b.id, "cancel", { actor: "CLIENT", now: NOW }),
  ]);
  const vyhral = potvrzeni.status === "fulfilled" ? "confirm" : "cancel";
  const po = await R.getBooking(db, b.id);
  const jobs = (await db.prepare("SELECT action, booking_version, status FROM calendar_outbox WHERE booking_id = ?").bind(b.id).all()).results;
  const zive = jobs.filter((j) => j.status === "PENDING" && Number(j.booking_version) > 1);
  assert.equal(zive.length, 1, "do kalendáře smí jít právě jeden úkol · našlo se " + JSON.stringify(jobs));
  assert.equal(zive[0].action, vyhral === "confirm" ? "UPDATE" : "CANCEL");
  const udalosti = (await R.eventsOfBooking(db, b.id)).map((e) => e.type);
  if (vyhral === "confirm") {
    assert.equal(po.status, "CONFIRMED");
    assert.ok(!udalosti.includes("CANCELLED"), "a v historii nesmí být zrušení, ke kterému nedošlo");
  } else {
    assert.equal(po.status, "CANCELLED_CLIENT");
    assert.ok(!udalosti.includes("CONFIRMED"), "ani potvrzení, ke kterému nedošlo");
  }
});

test("tři rezervace najednou s jedním kreditem nedají tři rezervace", async () => {
  // Zůstatek se četl před dávkou, takže tři požadavky v jednom okamžiku
  // četly tutéž jedničku a všechny tři se na ni odkázaly. Klient s jedním
  // kreditem odešel se třemi termíny a zůstatkem minus dva.
  const db = await fresh(1);
  const r = await Promise.allSettled([
    book(db, "cl_a", "2026-08-26", "09:00"),
    book(db, "cl_a", "2026-08-26", "11:00"),
    book(db, "cl_a", "2026-08-26", "13:00"),
  ]);
  assert.equal(r.filter((x) => x.status === "fulfilled").length, 1);
  for (const x of r.filter((y) => y.status === "rejected")) assert.equal(x.reason.code, ERR.INSUFFICIENT_CREDIT);
  const s = await E.creditSummary(db, "cl_a");
  assert.ok(s.balance.available >= 0, "zůstatek se nesmí dostat pod nulu · byl " + s.balance.available);
  assert.equal(s.balance.available, 0);
  assert.equal((await db.prepare("SELECT COUNT(*) n FROM bookings").first()).n, 1);
  const winner = r.find(x=>x.status==="fulfilled").value;
  await assert.rejects(()=>E.createBooking(db,{clientId:"cl_b",serviceId:"svc_pt",locationId:"loc_studio",startsAt:winner.starts_at_utc,now:NOW,actor:"COACH"}),e=>e.code===ERR.SLOT_TAKEN);
});

test("neúspěšná rezervace po sobě neuklidí nic k uklizení", async () => {
  const db = await fresh(0);
  await assert.rejects(() => book(db, "cl_a", "2026-08-26", "10:00"), (e) => e.code === ERR.INSUFFICIENT_CREDIT);
  assert.equal((await db.prepare("SELECT COUNT(*) n FROM bookings").first()).n, 0);
  assert.equal((await db.prepare("SELECT COUNT(*) n FROM booking_slot_locks").first()).n, 0);
  assert.equal((await db.prepare("SELECT COUNT(*) n FROM calendar_outbox").first()).n, 0);
  assert.equal((await db.prepare("SELECT COUNT(*) n FROM booking_events").first()).n, 0);
});

test("dostupnost trenéra se nečte v časové zóně klienta", async () => {
  // Pravidla dostupnosti žádnou zónu nenesou, takže jsou trenérova. Když se
  // četla v zóně klienta, znamenalo „devět až pět" devět až pět v jeho městě
  // a prošla rezervace na desátou večer pražského času.
  const db = await fresh();
  await db.prepare("UPDATE booking_clients SET timezone = 'America/New_York' WHERE id = 'cl_a'").run();
  await assert.rejects(() => book(db, "cl_a", "2026-08-26", "22:00"),
    (e) => e.code === ERR.OUTSIDE_AVAILABILITY, "22:00 pražského času je mimo okno 9–17");
  const ok = await book(db, "cl_a", "2026-08-26", "10:00");
  assert.equal(ok.timezone, TZ, "rezervace si drží zónu místa, ne zónu klienta");
  assert.equal(ok.local_date, "2026-08-26");
});

test("čas mimo pětiminutovou mřížku se nepřijme", async () => {
  // Takový čas nikdo nikdy nenabídl, a jeho chráněný interval by přesahoval
  // do buněk dvou slotů, které nabídnuté byly.
  const db = await fresh();
  const krivy = zonedToUtc("2026-08-26", 9 * 60 + 7, TZ) + 33000;
  await assert.rejects(() => E.createBooking(db, { clientId: "cl_a", serviceId: "svc_pt",
    locationId: "loc_studio", startsAt: krivy, now: NOW, actor: "CLIENT" }),
    (e) => e.code === ERR.VALIDATION_ERROR);
  assert.equal((await db.prepare("SELECT COUNT(*) n FROM bookings").first()).n, 0);
});

test("denní limit platí i na přeplánování", async () => {
  const db = await fresh();
  await db.prepare("UPDATE booking_services SET daily_limit = 1 WHERE id = 'svc_pt'").run();
  await book(db, "cl_a", "2026-08-26", "10:00");
  const jiny = await book(db, "cl_b", "2026-08-27", "10:00");
  await assert.rejects(
    () => E.rescheduleBooking(db, jiny.id, { startsAt: at("2026-08-26", "14:00"), now: NOW, actor: "CLIENT" }),
    (e) => e.code === ERR.DAILY_LIMIT, "plný den se nesmí obejít přesunem z jiného dne");
  // přesun v rámci téhož dne limit neporušuje — sám sebe nepočítá
  const doma = await E.rescheduleBooking(db, jiny.id, { startsAt: at("2026-08-27", "14:00"), now: NOW, actor: "CLIENT" });
  assert.equal(Number(doma.starts_at_utc), at("2026-08-27", "14:00"));
});

test("dvakrát poslané stejné zrušení zruší jednou a oběma řekne pravdu", async () => {
  // Dřív z toho byla buď pětistovka, nebo — když se cokoli s „constraint"
  // v hlášce vydávalo za SLOT_TAKEN — výzva hledat volný čas nad rezervací,
  // která už byla zrušená. Dva stejné požadavky ale nejsou závod. Je to jeden
  // úmysl poslaný dvakrát a odpověď na něj je jedna a tatáž.
  const db = await fresh();
  const b = await book(db, "cl_a", "2026-08-26", "10:00");
  const r = await Promise.allSettled([
    E.transitionBooking(db, b.id, "cancel", { actor: "COACH", now: NOW }),
    E.transitionBooking(db, b.id, "cancel", { actor: "COACH", now: NOW }),
  ]);
  for (const x of r) assert.equal(x.status, "fulfilled", x.status === "rejected" ? String(x.reason.code) : "");
  for (const x of r) assert.equal(x.value.status, "CANCELLED_COACH");
  assert.equal(Number((await R.getBooking(db, b.id)).version), 2, "verze se posunula jednou");
  const led = await R.ledgerForBooking(db, b.id);
  assert.equal(led.filter((e) => e.kind === "RELEASE").length, 1, "kredit se vrátil jednou");
  assert.equal((await E.creditSummary(db, "cl_a")).balance.available, 10);
  const ev = (await R.eventsOfBooking(db, b.id)).filter((e) => e.type === "CANCELLED");
  assert.equal(ev.length, 1, "a v historii je jeden záznam, ne dva");
  const jobs = (await db.prepare("SELECT COUNT(*) n FROM calendar_outbox WHERE booking_id = ? AND action = 'CANCEL'").bind(b.id).first()).n;
  assert.equal(jobs, 1, "a do kalendáře jde jeden úkol");
});

test("skutečně rozdílné přechody v jednom okamžiku dají jeden výsledek", async () => {
  const db = await fresh();
  const b = await book(db, "cl_a", "2026-08-26", "10:00");
  const r = await Promise.allSettled([
    E.transitionBooking(db, b.id, "complete", { actor: "COACH", now: at("2026-08-26", "11:05") }),
    E.transitionBooking(db, b.id, "cancel", { actor: "COACH", now: at("2026-08-26", "11:05") }),
  ]);
  assert.equal(r.filter((x) => x.status === "fulfilled").length, 1);
  assert.equal(r.find((x) => x.status === "rejected").reason.code, ERR.INVALID_TRANSITION);
});

test("kredit vrácený na propadlý balíček se netváří jako použitelný", async () => {
  const db = makeD1();
  await seedBooking(db);
  const konec = at("2026-08-27", "00:00");
  await givePackage(db, "cl_a", 2, { expiresAt: konec });
  const b = await book(db, "cl_a", "2026-08-26", "10:00");
  assert.equal((await E.creditSummary(db, "cl_a")).balance.available, 1);
  // balíček mezitím propadne a trenér termín zruší
  await db.prepare("UPDATE client_packages SET status = 'EXPIRED' WHERE client_id = 'cl_a'").run();
  await E.transitionBooking(db, b.id, "cancel", { actor: "COACH", now: konec + 3600000 });
  const s = await E.creditSummary(db, "cl_a");
  assert.equal(s.balance.available, 1, "vrácený kredit nesmí zvednout zůstatek na propadlém balíčku");
  assert.ok(s.entries === undefined || true);
  const kinds = (await R.ledgerAll(db, "cl_a")).map((e) => e.kind);
  assert.ok(kinds.includes("RELEASE"), "vrácení se do historie zapíše");
  assert.ok(kinds.includes("EXPIRY"), "a hned za ním i to, že propadlo");
});

test("druhý běh migrace nerozpojí sezení od balíčku", async () => {
  // Klíč, podle kterého sezení najde svůj balíček, se dřív zapisoval jen ve
  // větvi, která balíček zakládá. Při druhém běhu tak nové sezení dostalo
  // nulový kredit, otevřenou platbu a objevilo se v nezaplacených.
  const db = makeD1();
  await ensureBookingSchema(db);
  const coll = () => ({
    klCfg: {}, klPacks: [{ id: "pk1", cid: "p1", name: "5", total: 5, price: 4000, paidAt: "2026-06-01" }],
    klProfiles: [{ id: "p1", name: "Jedna", email: "", createdAt: 1 }],
    klSessions: [{ id: "s1", cid: "p1", date: "2026-06-05", time: "10:00", dur: 60, type: "gym", status: "done", price: 0, pay: "balicek", packId: "pk1" }],
  });
  await migrateLegacy(db, coll(), { now: 1_760_000_000_000 });
  const dalsi = coll();
  dalsi.klSessions.push({ id: "s2", cid: "p1", date: "2026-06-12", time: "10:00", dur: 60, type: "gym", status: "done", price: 0, pay: "balicek", packId: "pk1" });
  await migrateLegacy(db, dalsi, { now: 1_760_000_100_000 });
  const row = await db.prepare("SELECT client_package_id, credit_cost_units, payment_status FROM bookings WHERE legacy_session_id = 's2'").first();
  assert.ok(row.client_package_id, "sezení z druhého běhu musí najít svůj balíček");
  assert.equal(row.credit_cost_units, 1);
  assert.equal(row.payment_status, "FROM_PACKAGE");
  const client = await R.clientByProfile(db, "p1");
  assert.equal((await E.creditSummary(db, client.id)).balance.consumed, 2, "obě odehraná sezení kredit spotřebovala");
});

test("znovu vytvořený kalendář si vyžádá i sezení, která v něm byla", async (t) => {
  // Smazaný kalendář dřív nechal všechny rezervace ve stavu „čeká" bez jediné
  // úlohy, která by je tam znovu dostala. A „čeká" není „chyba", takže se
  // neobjevily ani v seznamu věcí, co potřebují pozornost.
  // The fixed booking must remain future relative to the calendar repair too.
  t.mock.timers.enable({ apis: ["Date"], now: NOW });
  const db = await fresh();
  const KEY = Buffer.from(new Uint8Array(32).fill(3)).toString("base64");
  const ENV = { GOOGLE_CLIENT_ID: "c", GOOGLE_CLIENT_SECRET: "s", GOOGLE_REDIRECT_URI: "https://a/b", GOOGLE_TOKEN_ENCRYPTION_KEY: KEY };
  const sealed = await G.sealToken(ENV, "r");
  const t0 = Date.now();
  await db.prepare(`INSERT INTO google_connections (id, owner_id, google_account, token_ciphertext, token_iv, token_version,
      granted_scopes, write_calendar_id, write_calendar_name, busy_calendar_ids_json, title_mode, invite_client, status, last_error, created_at, updated_at)
      VALUES ('gc1','primary','x',?,?,1,'','pryc','n','[]','FULL',0,'CONNECTED','',?,?)`)
    .bind(sealed.ciphertext, sealed.iv, t0, t0).run();
  G.forgetAccessToken();
  const b = await book(db, "cl_a", "2026-10-12", "10:00");
  await db.prepare("UPDATE bookings SET google_calendar_id = 'pryc', google_event_id = 'x' WHERE id = ?").bind(b.id).run();
  await db.prepare("UPDATE calendar_outbox SET status = 'DONE'").run();

  const orig = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    const u = String(url);
    if (u.includes("oauth2.googleapis.com/token")) return new Response(JSON.stringify({ access_token: "at", expires_in: 3600 }), { status: 200 });
    if (u.includes("/calendars/pryc")) return new Response(JSON.stringify({ error: { errors: [{ reason: "notFound" }] } }), { status: 404 });
    if (u.includes("/users/me/calendarList")) return new Response("{}", { status: 200 });
    if (u.endsWith("/calendars")) return new Response(JSON.stringify({ id: "novy" }), { status: 200 });
    return new Response("{}", { status: 200 });
  };
  try {
    const id = await G.ensureBookingCalendar(db, ENV);
    assert.equal(id, "novy");
    const jobs = (await db.prepare("SELECT * FROM calendar_outbox WHERE booking_id = ? AND status = 'PENDING'").bind(b.id).all()).results;
    assert.equal(jobs.length, 1, "budoucí sezení dostane úlohu, ne jen příznak");
    assert.equal(jobs[0].action, "CREATE");
  } finally { globalThis.fetch = orig; }
});

test("den, který v kalendáři není, se nepustí do výjimek ani do kalendáře", async () => {
  // Audit 2026-08-25: „2026-13-40" prošlo tvarovou kontrolou a zapsalo výjimku,
  // na kterou žádný skutečný den nikdy nesedne.
  const { isDateISO } = await import("../src/booking/time.js");
  for (const d of ["2026-13-40", "2026-02-30", "2026-04-31", "2026-00-10", "2026-06-00", "26-06-01", "2026-6-1", ""]) {
    assert.equal(isDateISO(d), false, d + " nesmí projít");
  }
  for (const d of ["2026-02-28", "2028-02-29", "2026-12-31", "2026-01-01"]) assert.equal(isDateISO(d), true, d + " musí projít");
  const { handleCoach } = await import("../worker/booking/api.js");
  const db=makeD1(); await seedBooking(db);
  const url=new URL("https://example.test/api/booking/overrides");
  const request=new Request(url,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({kind:"CLOSED",date:"2026-13-40"})});
  const r=await handleCoach(request,{KLIENT_DB:db},url,{});
  assert.equal(r.status, 400);
  const n = (await db.prepare("SELECT COUNT(*) n FROM booking_availability_overrides").first()).n;
  assert.equal(n, 0, "nic se nezapsalo");
});
