// Local preview only. Run the real booking Worker against an isolated SQLite
// database so an acknowledged mutation is also visible on the next read.
// This module is never imported by the application or deployed Worker.
import worker from "../../worker/index.js";
import { makeEnv, req } from "../helpers/env.js";
import { seedBooking, givePackage, at } from "../helpers/seed.js";
import * as E from "../../worker/booking/engine.js";
import { localDateISO, shiftDateISO } from "../../src/booking/time.js";

export async function createBookingFixture({ now = Date.now() } = {}) {
  const email = "a@example.test";
  const env = makeEnv();
  await seedBooking(env.DB, { now });
  await givePackage(env.DB, "cl_a", 7, { now: now - 30 * 86400000, name: "7 sezení" });
  await worker.fetch(req("/api/join", { email, method: "POST", body: { word: env.INVITE_WORD } }), env, {});
  const { owner } = await (await worker.fetch(req("/api/me", { email }), env, {})).json();
  await env.DB.prepare("UPDATE booking_services SET active = 0 WHERE id = 'svc_req'").run();
  await env.DB.prepare("UPDATE booking_services SET buffer_before_min = 0, buffer_after_min = 0 WHERE id = 'svc_pt'").run();
  await env.DB.prepare("DELETE FROM booking_service_locations WHERE location_id = 'loc_online'").run();
  // The synthetic preview offers days throughout the week, including weekends.
  for (const weekday of [0, 6]) {
    await env.DB.prepare("INSERT INTO booking_availability_rules (id, weekday, start_minute, end_minute, active, created_at, updated_at) VALUES (?, ?, 540, 1020, 1, ?, ?)")
      .bind("preview_" + weekday, weekday, now, now).run();
  }
  const today = localDateISO(now, "Europe/Prague");
  for (const offset of [-14, -7, 2]) {
    const startsAt = at(shiftDateISO(today, offset), "12:00");
    const booking = await E.createBooking(env.DB, {
      clientId: "cl_a", serviceId: "svc_pt", locationId: "loc_studio", startsAt,
      now: Math.min(now, startsAt - 3 * 86400000), actor: "CLIENT",
    });
    if (offset < 0) await E.transitionBooking(env.DB, booking.id, "complete", { now: startsAt + 3600000, actor: "COACH" });
  }
  let closed = false;
  return {
    env,
    owner,
    fetch(path, options = {}) { return worker.fetch(req(path, { ...options, email }), env, {}); },
    close() { if (!closed) { closed = true; env.DB._raw.close(); } },
  };
}
