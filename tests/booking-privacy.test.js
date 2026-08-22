// Soukromí. Klient A a klient B existují jen proto, aby se dalo doopravdy
// vyzkoušet, co se stane, když si jeden pošle cizí identifikátor — protože
// skrytý button není oprávnění a dřív nebo později to někdo zkusí.
import { test } from "node:test";
import assert from "node:assert/strict";
import { makeEnv, req } from "./helpers/env.js";
import { seedBooking, givePackage, at } from "./helpers/seed.js";
import worker from "../worker/index.js";
import * as E from "../worker/booking/engine.js";

const A = "a@example.test", B = "b@example.test";
const NOW_BOOK = at("2026-09-07", "10:00"); // pondělí, daleko za storno hranicí

async function stage() {
  const env = makeEnv({ INVITE_WORD: "prah" });
  await seedBooking(env.DB);
  await givePackage(env.DB, "cl_a", 10);
  await givePackage(env.DB, "cl_b", 10);
  // obě adresy musí být členy, jinak je klientská aplikace nepustí dál
  for (const email of [A, B]) {
    await worker.fetch(req("/api/join", { email, method: "POST", body: { word: "prah" } }), env, {});
  }
  const b = await E.createBooking(env.DB, {
    clientId: "cl_a", serviceId: "svc_pt", locationId: "loc_studio",
    startsAt: NOW_BOOK, now: at("2026-08-24", "07:00"), actor: "CLIENT",
  });
  return { env, bookingOfA: b };
}
const call = (env, path, opts) => worker.fetch(req(path, opts), env, {});

test("A nevidí rezervaci B", async () => {
  const { env, bookingOfA } = await stage();
  const r = await call(env, "/api/client/bookings/" + bookingOfA.id, { email: B });
  assert.equal(r.status, 403);
  const body = await r.json();
  assert.equal(body.error, "NOT_AUTHORIZED");
  assert.ok(!JSON.stringify(body).includes("cl_a"), "odpověď neprozradí ani to, čí to je");
});

test("A nemůže zrušit ani přesunout rezervaci B", async () => {
  const { env, bookingOfA } = await stage();
  for (const path of ["/cancel", "/reschedule"]) {
    const r = await call(env, "/api/client/bookings/" + bookingOfA.id + path,
      { email: B, method: "POST", body: { startsAt: NOW_BOOK + 3600000 } });
    assert.equal(r.status, 403, path + " musí být zavřené");
  }
  const still = await E.creditSummary(env.DB, "cl_a");
  assert.equal(still.balance.reserved, 1, "cizí pokus se kreditu A ani nedotkl");
});

test("výpis rezervací vrací jen ty vlastní", async () => {
  const { env } = await stage();
  const mine = await (await call(env, "/api/client/bookings", { email: B })).json();
  assert.deepEqual(mine.upcoming, []);
  assert.deepEqual(mine.past, []);
});

test("kredit je vždycky ten vlastní", async () => {
  const { env } = await stage();
  const a = await (await call(env, "/api/client/credits", { email: A })).json();
  const b = await (await call(env, "/api/client/credits", { email: B })).json();
  assert.equal(a.balance.available, 9, "A má devět, jeden drží rezervace");
  assert.equal(b.balance.available, 10);
  assert.ok(!JSON.stringify(b).includes("cl_a"));
});

test("klient nevidí soukromou poznámku trenéra", async () => {
  const { env, bookingOfA } = await stage();
  await env.DB.prepare("UPDATE bookings SET coach_note_private = ? WHERE id = ?")
    .bind("bolí ho rameno, neříkat", bookingOfA.id).run();
  const r = await (await call(env, "/api/client/bookings/" + bookingOfA.id, { email: A })).json();
  assert.equal(r.ok, true);
  assert.ok(!JSON.stringify(r).includes("rameno"), "poznámka se z klientské cesty nikdy nevrátí");
  assert.equal(r.booking.coachNote, undefined);
  assert.equal(r.booking.paymentStatus, undefined, "ani stav platby není klientova věc");
});

test("klient nevidí názvy obsazeného času z Googlu", async () => {
  const { env } = await stage();
  const start = at("2026-09-07", "13:00");
  await env.DB.prepare(`INSERT INTO booking_blocks (id, starts_at_utc, ends_at_utc, source, google_calendar_id, note, fetched_at, created_at, updated_at)
                        VALUES ('blkg',?,?,'GOOGLE','cal','zubař',?,?,?)`)
    .bind(start, start + 3600000, Date.now(), Date.now(), Date.now()).run();
  const r = await (await call(env, "/api/client/booking/slots?serviceId=svc_pt&locationId=loc_studio&from=2026-09-07&days=1", { email: B })).json();
  assert.equal(r.ok, true);
  assert.ok(!JSON.stringify(r).includes("zubař"), "z obsazeného času se nikdy nevrací nic než okno");
  const times = r.days[0].slots.map((s) => s.startsAt);
  assert.ok(!times.includes(start), "obsazený čas prostě není v nabídce");
});

test("klient nevidí seznam klientů ani trenérské cesty", async () => {
  const { env } = await stage();
  for (const p of ["/api/booking/agenda", "/api/booking/clients", "/api/klienti", "/api/booking/calendar"]) {
    const r = await call(env, p, { email: A });
    assert.ok(r.status === 404 || r.status === 403, p + " nesmí být z klientské aplikace dostupné (" + r.status + ")");
  }
});

test("cizí identifikátor balíčku nic nezpřístupní", async () => {
  const { env } = await stage();
  const r = await (await call(env, "/api/client/credits", { email: B })).json();
  const ids = r.packages.map((p) => p.id);
  assert.ok(!ids.some((id) => id.includes("cl_a")), "v odpovědi jsou jen vlastní balíčky");
});

test("bez identity se z rezervací nedozví nic", async () => {
  const { env, bookingOfA } = await stage();
  for (const p of ["/api/client/booking/context", "/api/client/bookings", "/api/client/credits",
                   "/api/client/bookings/" + bookingOfA.id]) {
    const r = await call(env, p, {});
    assert.equal(r.status, 401, p);
  }
});

test("kdo není člen, k rezervacím nesmí", async () => {
  const env = makeEnv({ INVITE_WORD: "prah" });
  await seedBooking(env.DB);
  const r = await call(env, "/api/client/booking/context", { email: "cizi@example.test" });
  assert.equal(r.status, 403);
});

test("chyba nevynáší SQL, cestu ani adresu", async () => {
  const { env, bookingOfA } = await stage();
  const r = await call(env, "/api/client/bookings/" + bookingOfA.id, { email: B });
  const text = await r.text();
  assert.ok(!/SELECT|INSERT|sqlite|SQLITE/i.test(text));
  assert.ok(!text.includes("/home/") && !text.includes("C:\\"));
  assert.ok(!/at\s+\w+\s+\(/.test(text));
  assert.ok(!text.includes(A), "ani adresu toho druhého");
});

test("klient nemůže měnit službu, místo ani dostupnost", async () => {
  const { env } = await stage();
  for (const [p, m] of [["/api/booking/services", "POST"], ["/api/booking/locations", "POST"],
                        ["/api/booking/availability", "PUT"], ["/api/booking/blocks", "POST"]]) {
    const r = await call(env, p, { email: A, method: m, body: { name_cs: "hack" } });
    assert.ok(r.status === 404 || r.status === 403, p);
  }
});

test("klient nemůže sám sobě přidat kredit", async () => {
  const { env } = await stage();
  const r = await call(env, "/api/booking/clients/cl_b/credits",
    { email: B, method: "POST", body: { units: 100, reason: "prosím" } });
  assert.ok(r.status === 404 || r.status === 403);
  assert.equal((await E.creditSummary(env.DB, "cl_b")).balance.available, 10);
});

test("cizí rezervací se nedá odemknout cizí čas", async () => {
  // Slot search umí vynechat rezervaci, která se právě přesouvá. Kdyby se
  // věřilo jen identifikátoru, uviděl by ten, kdo ho uhodne, cizí termín jako
  // volný. Identifikátory jsou náhodné, ale „nepravděpodobné" není měřítko,
  // které drží zbytek tohohle souboru.
  const { env, bookingOfA } = await stage();
  const cizi = await (await call(env, "/api/client/booking/slots?serviceId=svc_pt&locationId=loc_studio&from=2026-09-07&days=1&reschedule=" + bookingOfA.id, { email: B })).json();
  const vlastni = await (await call(env, "/api/client/booking/slots?serviceId=svc_pt&locationId=loc_studio&from=2026-09-07&days=1", { email: B })).json();
  const casy = (r) => ((r.days[0] || {}).slots || []).map((s) => s.startsAt).join(",");
  assert.equal(casy(cizi), casy(vlastni), "cizí identifikátor nesmí přidat ani jeden čas navíc");
  assert.ok(!casy(cizi).includes(String(NOW_BOOK)), "a obsazený čas zůstane obsazený");
});
