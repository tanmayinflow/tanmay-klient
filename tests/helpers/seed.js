// Synthetic data for the booking tests. No real client, no real address, no
// real price: everything here is invented on purpose so a test can never be
// mistaken for evidence about a person.
import { ensureBookingSchema } from "../../worker/booking/schema.js";
import { zonedToUtc } from "../../src/booking/time.js";

const now = () => 1_755_000_000_000; // fixed clock: 2025-08-12T12:40Z, tests never drift

export const TZ = "Europe/Prague";

export async function seedBooking(db, opts = {}) {
  await ensureBookingSchema(db);
  const at = opts.now || now();
  const run = (sql, ...a) => db.prepare(sql).bind(...a).run();

  await run(`INSERT INTO booking_locations (id, type, name_cs, name_en, timezone, buffer_before_min, buffer_after_min, online_mode, online_url, active, sort_order, created_at, updated_at)
             VALUES ('loc_studio','STUDIO','Studio','Studio',?,0,0,'','',1,0,?,?)`, TZ, at, at);
  await run(`INSERT INTO booking_locations (id, type, name_cs, name_en, timezone, buffer_before_min, buffer_after_min, online_mode, online_url, active, sort_order, created_at, updated_at)
             VALUES ('loc_online','ONLINE','Online','Online',?,0,0,'MANUAL_LINK','https://example.test/meet',1,1,?,?)`, TZ, at, at);

  await run(`INSERT INTO booking_services (id, name_cs, name_en, duration_min, credit_cost_units, price_minor, currency,
              min_notice_min, booking_horizon_days, cancel_before_min, buffer_before_min, buffer_after_min, slot_interval_min,
              confirmation_mode, daily_limit, weekly_limit, late_cancel_refunds, no_show_refunds, client_visible, active, sort_order, created_at, updated_at)
             VALUES ('svc_pt','Osobní trénink','Personal training',60,1,0,'CZK',0,60,1440,15,15,30,'AUTO',0,0,0,0,1,1,0,?,?)`, at, at);
  await run(`INSERT INTO booking_services (id, name_cs, name_en, duration_min, credit_cost_units, price_minor, currency,
              min_notice_min, booking_horizon_days, cancel_before_min, buffer_before_min, buffer_after_min, slot_interval_min,
              confirmation_mode, daily_limit, weekly_limit, late_cancel_refunds, no_show_refunds, client_visible, active, sort_order, created_at, updated_at)
             VALUES ('svc_req','Vstupní setkání','Initial session',90,1,0,'CZK',0,60,1440,0,0,30,'REQUEST',0,0,0,0,1,1,1,?,?)`, at, at);

  for (const s of ["svc_pt", "svc_req"]) for (const l of ["loc_studio", "loc_online"]) {
    await run("INSERT INTO booking_service_locations (service_id, location_id) VALUES (?, ?)", s, l);
  }

  // Monday to Friday, 9:00 to 17:00.
  for (let wd = 1; wd <= 5; wd++) {
    await run(`INSERT INTO booking_availability_rules (id, weekday, start_minute, end_minute, active, created_at, updated_at)
               VALUES (?,?,540,1020,1,?,?)`, "ar_" + wd, wd, at, at);
  }

  for (const [id, name, email, account] of [
    ["cl_a", "Klient A", "a@example.test", "a-example-test"],
    ["cl_b", "Klient B", "b@example.test", "b-example-test"],
  ]) {
    await run(`INSERT INTO booking_clients (id, account_user_id, coach_profile_id, name, email, timezone, active, created_at, updated_at)
               VALUES (?,?,?,?,?,?,1,?,?)`, id, account, "prof_" + id, name, email, TZ, at, at);
  }
  return { at };
}

export async function givePackage(db, clientId, units, opts = {}) {
  const at = opts.now || now();
  const id = opts.id || "cp_" + clientId + "_" + units;
  await db.prepare(`INSERT INTO client_packages (id, client_id, name_snapshot, purchased_units, price_minor, currency,
      payment_status, payment_method, purchased_at, valid_from, expires_at, status, created_at, updated_at)
      VALUES (?,?,?,?,0,'CZK','PAID','CASH',?,?,?,'ACTIVE',?,?)`)
    .bind(id, clientId, opts.name || "Balíček", units, at, at, opts.expiresAt || null, at, at).run();
  await db.prepare(`INSERT INTO credit_ledger (id, client_id, client_package_id, booking_id, kind, units, reason, created_by, created_at, idempotency_key)
      VALUES (?,?,?,NULL,'PURCHASE',?, '', 'COACH', ?, ?)`)
    .bind("cl_seed_" + id, clientId, id, units, at, "seed:" + id).run();
  return id;
}

/** A local wall clock in Prague, as an instant. */
export const at = (dateISO, hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return zonedToUtc(dateISO, h * 60 + m, TZ);
};
export const FIXED_NOW = now();
