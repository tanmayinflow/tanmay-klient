import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { makeEnv, req } from "./helpers/env.js";
import { seedBooking, givePackage, at } from "./helpers/seed.js";
import worker from "../worker/index.js";

const email = "a@example.test";
beforeEach(t => t.mock.timers.enable({ apis: ["Date"], now: new Date("2026-09-01T08:00:00Z") }));
async function stage() {
  const env = makeEnv();
  await seedBooking(env.DB);
  await givePackage(env.DB, "cl_a", 4);
  const call = async (path, options = {}) => {
    const response = await worker.fetch(req(path, { email, ...options }), env, {});
    return { status: response.status, body: await response.json() };
  };
  await call("/api/join", { method: "POST", body: { word: env.INVITE_WORD } });
  return { env, call };
}
const create = call => call("/api/client/bookings", { method: "POST", body: {
  serviceId: "svc_pt", locationId: "loc_studio", startsAt: at("2026-09-07", "10:00"),
}, headers: { "idempotency-key": "mutation-regression" } });

test("client reschedule is durable in booking lists, detail and SQL without another credit hold", async () => {
  const { env, call } = await stage();
  const made = await create(call);
  assert.equal(made.status, 200);
  const id = made.body.booking.id;
  const before = (await call("/api/client/credits")).body;
  const startsAt = at("2026-09-07", "11:30");
  const moved = await call(`/api/client/bookings/${id}/reschedule`, { method: "POST", body: { startsAt } });
  assert.equal(moved.status, 200);
  assert.equal(moved.body.booking.startsAt, startsAt);
  const list = (await call("/api/client/bookings")).body;
  assert.equal(list.upcoming.length, 1);
  assert.equal(list.upcoming[0].id, id);
  assert.equal(list.upcoming[0].startsAt, startsAt);
  assert.equal((await call(`/api/client/bookings/${id}`)).body.booking.startsAt, startsAt);
  assert.equal((await env.DB.prepare("SELECT starts_at_utc FROM bookings WHERE id = ?").bind(id).first()).starts_at_utc, startsAt);
  assert.deepEqual((await call("/api/client/credits")).body.balance, before.balance);
  assert.equal((await call("/api/client/credits")).body.entries.length, before.entries.length);
  env.DB._raw.close();
});

test("client cancellation leaves upcoming, appears in history and refunds exactly once", async () => {
  const { env, call } = await stage();
  const made = await create(call);
  const id = made.body.booking.id;
  const preview = (await call(`/api/client/bookings/${id}/cancel-preview`)).body.preview;
  assert.equal(preview.unitsReturned, 1);
  // The production UI sends this exact empty POST body.
  const cancelled = await call(`/api/client/bookings/${id}/cancel`, { method: "POST" });
  assert.equal(cancelled.status, 200);
  assert.equal(cancelled.body.booking.status, "CANCELLED_CLIENT");
  assert.equal(cancelled.body.credits.available, 4);
  const list = (await call("/api/client/bookings")).body;
  assert.equal(list.upcoming.length, 0);
  assert.equal(list.past.find(row => row.id === id).status, "CANCELLED_CLIENT");
  const context = (await call("/api/client/booking/context")).body;
  assert.equal(context.credits.available, 4);
  assert.equal(context.credits.reserved, 0);
  const repeated = await call(`/api/client/bookings/${id}/cancel`, { method: "POST" });
  assert.notEqual(repeated.status, 200);
  const credits = (await call("/api/client/credits")).body;
  assert.equal(credits.balance.available, 4);
  assert.equal(credits.entries.filter(row => row.bookingId === id && row.kind === "RELEASE").length, 1);
  env.DB._raw.close();
});

test("failed reschedule preserves the original time, slot and credit balance", async () => {
  const { env, call } = await stage();
  const made = await create(call);
  const original = made.body.booking;
  const before = (await call("/api/client/credits")).body.balance;
  const rejected = await call(`/api/client/bookings/${original.id}/reschedule`, {
    method: "POST", body: { startsAt: at("2026-09-07", "03:00") },
  });
  assert.notEqual(rejected.status, 200);
  assert.equal((await call("/api/client/bookings")).body.upcoming[0].startsAt, original.startsAt);
  assert.deepEqual((await call("/api/client/credits")).body.balance, before);
  assert.ok((await env.DB.prepare("SELECT COUNT(*) n FROM booking_slot_locks WHERE booking_id = ?").bind(original.id).first()).n > 0);
  env.DB._raw.close();
});
