// Souběžnost. Každý test tady popisuje situaci, ve které se dva požadavky
// potkají nad jednou minutou — a trvá na tom, že z ní vyjde jedna rezervace,
// jeden kredit a jedna událost, ne dvě.
import { test } from "node:test";
import assert from "node:assert/strict";
import { makeD1 } from "./helpers/env.js";
import { seedBooking, givePackage, at, TZ } from "./helpers/seed.js";
import * as E from "../worker/booking/engine.js";
import * as R from "../worker/booking/repo.js";
import { ERR } from "../src/booking/types.js";

const NOW = at("2026-08-24", "07:00");           // pondělí ráno
const START = at("2026-08-24", "10:00");

async function fresh() {
  const db = makeD1();
  await seedBooking(db);
  await givePackage(db, "cl_a", 10);
  await givePackage(db, "cl_b", 10);
  return db;
}
const book = (db, clientId, startsAt, extra = {}) => E.createBooking(db, {
  clientId, serviceId: "svc_pt", locationId: "loc_studio", startsAt, now: NOW, actor: "CLIENT", ...extra,
});

test("dva klienti chtějí tutéž minutu · projde právě jeden", async () => {
  const db = await fresh();
  const results = await Promise.allSettled([book(db, "cl_a", START), book(db, "cl_b", START)]);
  const won = results.filter((r) => r.status === "fulfilled");
  const lost = results.filter((r) => r.status === "rejected");
  assert.equal(won.length, 1, "vyhrát smí právě jeden");
  assert.equal(lost.length, 1);
  assert.equal(lost[0].reason.code, ERR.SLOT_TAKEN, "poražený dostane 409 SLOT_TAKEN");

  const rows = (await db.prepare("SELECT * FROM bookings").all()).results;
  assert.equal(rows.length, 1, "v databázi je jedna rezervace, ne dvě");
  // a poražený nesmí zůstat s drženým kreditem
  const a = await E.creditSummary(db, "cl_a"), b = await E.creditSummary(db, "cl_b");
  assert.equal(a.balance.reserved + b.balance.reserved, 1, "držený kredit je právě jeden");
  assert.equal(a.balance.available + b.balance.available, 19);
});

test("tentýž klient odešle týž požadavek dvakrát · vznikne jedna rezervace", async () => {
  const db = await fresh();
  const one = await book(db, "cl_a", START);
  await assert.rejects(() => book(db, "cl_a", START), (e) => e.code === ERR.SLOT_TAKEN);
  const rows = (await db.prepare("SELECT * FROM bookings").all()).results;
  assert.equal(rows.length, 1);
  assert.equal(rows[0].id, one.id);
  assert.equal((await E.creditSummary(db, "cl_a")).balance.reserved, 1, "žádný dvojí hold");
});

test("idempotentní klíč vrátí tutéž rezervaci, ne druhou", async () => {
  const db = await fresh();
  const first = await book(db, "cl_a", START);
  await R.rememberIdempotent(db, "k1", "client:create:a", { booking: { id: first.id } });
  const again = await R.recallIdempotent(db, "k1", "client:create:a");
  assert.equal(again.booking.id, first.id);
  assert.equal(await R.recallIdempotent(db, "k1", "client:create:b"), null, "klíč platí jen ve svém oboru");
});

test("přeplánování a nová rezervace soutěží o tentýž slot", async () => {
  const db = await fresh();
  const mine = await book(db, "cl_a", at("2026-08-26", "09:00"));
  const target = at("2026-08-26", "13:00");
  const results = await Promise.allSettled([
    E.rescheduleBooking(db, mine.id, { startsAt: target, now: NOW, actor: "CLIENT" }),
    book(db, "cl_b", target),
  ]);
  assert.equal(results.filter((r) => r.status === "fulfilled").length, 1, "cíl dostane jen jeden z nich");
  const active = (await db.prepare("SELECT * FROM bookings WHERE status IN ('CONFIRMED','REQUESTED')").all()).results;
  const overlapping = active.filter((b) => Number(b.starts_at_utc) === target);
  assert.equal(overlapping.length, 1, "v cílové minutě stojí jedna rezervace");
});

test("přeplánování drží starý čas, dokud nemá nový", async () => {
  const db = await fresh();
  // dál než storno hranice (24 h), aby klient vůbec směl přesouvat
  const mine = await book(db, "cl_a", at("2026-08-26", "09:00"));
  await book(db, "cl_b", at("2026-08-26", "14:00"));
  await assert.rejects(
    () => E.rescheduleBooking(db, mine.id, { startsAt: at("2026-08-26", "14:00"), now: NOW, actor: "CLIENT" }),
    (e) => e.code === ERR.SLOT_TAKEN);
  const after = await R.getBooking(db, mine.id);
  assert.equal(Number(after.starts_at_utc), at("2026-08-26", "09:00"), "neúspěšný přesun nechal termín, kde byl");
  await assert.rejects(()=>book(db,"cl_b",mine.starts_at_utc),e=>e.code===ERR.SLOT_TAKEN,"původní interval zůstává chráněný");
});

test("zrušení a dokončení ve stejný okamžik · projde jeden přechod", async () => {
  const db = await fresh();
  const mine = await book(db, "cl_a", START);
  const results = await Promise.allSettled([
    E.transitionBooking(db, mine.id, "complete", { actor: "COACH", now: at("2026-08-24", "11:05") }),
    E.transitionBooking(db, mine.id, "cancel", { actor: "COACH", now: at("2026-08-24", "11:05") }),
  ]);
  assert.equal(results.filter((r) => r.status === "fulfilled").length, 1);
  assert.equal(results.filter((r) => r.status === "rejected")[0].reason.code, ERR.INVALID_TRANSITION);
  const after = await R.getBooking(db, mine.id);
  assert.equal(Number(after.version), 2, "verze se posunula právě jednou");
  const s = await E.creditSummary(db, "cl_a");
  assert.equal(s.balance.consumed + s.balance.available, s.balance.purchased, "kredit nezmizel ani nepřibyl");
});

test("dokončení dvakrát nespotřebuje kredit dvakrát", async () => {
  const db = await fresh();
  const mine = await book(db, "cl_a", START);
  await E.transitionBooking(db, mine.id, "complete", { actor: "COACH", now: at("2026-08-24", "11:05") });
  await assert.rejects(() => E.transitionBooking(db, mine.id, "complete", { actor: "COACH", now: at("2026-08-24", "11:06") }),
    (e) => e.code === ERR.INVALID_TRANSITION);
  const s = await E.creditSummary(db, "cl_a");
  assert.equal(s.balance.consumed, 1);
  assert.equal(s.balance.available, 9);
});

test("úprava kreditu a rezervace ve stejný okamžik · zůstatek sedí", async () => {
  const db = await fresh();
  const [b, l] = await Promise.allSettled([
    book(db, "cl_a", START),
    E.writeManualLedger(db, { clientId: "cl_a", units: 3, kind: "MANUAL_ADD", reason: "test", now: NOW }),
  ]);
  assert.equal(b.status, "fulfilled");
  assert.equal(l.status, "fulfilled");
  const s = await E.creditSummary(db, "cl_a");
  assert.equal(s.balance.available, 12, "10 + 3 − 1 držený");
  assert.equal(s.balance.reserved, 1);
});

test("trenér zakládá termín ve chvíli, kdy ho bere klient", async () => {
  const db = await fresh();
  const results = await Promise.allSettled([
    book(db, "cl_a", START),
    E.createBooking(db, { clientId: "cl_b", serviceId: "svc_pt", locationId: "loc_studio", startsAt: START, now: NOW, actor: "COACH" }),
  ]);
  assert.equal(results.filter((r) => r.status === "fulfilled").length, 1);
  assert.equal((await db.prepare("SELECT COUNT(*) n FROM bookings").first()).n, 1);
});

test("zrušená rezervace uvolní své minuty i svůj kredit", async () => {
  const db = await fresh();
  const mine = await book(db, "cl_a", START);
  await E.transitionBooking(db, mine.id, "cancel", { actor: "COACH", now: NOW });
  assert.equal((await db.prepare("SELECT COUNT(*) n FROM booking_slot_locks WHERE booking_id = ?").bind(mine.id).first()).n, 0);
  assert.equal((await E.creditSummary(db, "cl_a")).balance.available, 10, "kredit se vrátil celý");
  const second = await book(db, "cl_b", START);
  assert.ok(second.id, "uvolněnou minutu si vzal někdo další");
});
