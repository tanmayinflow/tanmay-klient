// Booking · the endpoints.
//
// Two surfaces over one domain. The coach surface lives in the Main App
// Worker behind Tanmay's own Access boundary; the client surface lives in the
// Client App Worker, where the identity comes from the Access header and
// never from the request body.
//
// Every handler here holds the same four lines:
//   · the identity is derived on the server
//   · the row is loaded and its owner is checked before anything is done to it
//   · the body is validated field by field, with a size limit
//   · a refusal is a code and a sentence, never a stack trace and never SQL
//
// A hidden button is not authorisation. These routes are written as if every
// one of them will be called directly with somebody else's id, because sooner
// or later one of them will be.

import {
  ERR, ERR_HTTP, ACTOR, BOOKING_STATUS, CONFIRMATION_MODE, LOCATION_TYPE,
  ONLINE_MODE, CALENDAR_TITLE_MODE, PAYMENT_STATUS, PAYMENT_METHOD, LEDGER_KIND,
  SLOT_GRID_MIN, MS_PER_MIN, PACKAGE_STATUS,
} from "../../src/booking/types.js";
import { localDateISO, shiftDateISO, startOfLocalDay, endOfLocalDay, isDateISO } from "../../src/booking/time.js";
import { balanceOf } from "../../src/booking/credits.js";
import { ensureBookingSchema } from "./schema.js";
import * as R from "./repo.js";
import * as E from "./engine.js";
import * as G from "./google.js";
import { migrateLegacy, migrationState, seedDefaults } from "./migrate.js";

const MAX_BODY = 128 * 1024;

// ---- Answers ---------------------------------------------------------------
export const ok = (data, init) => Response.json({ ok: true, ...data }, init);
export function bad(code, detail, status) {
  return Response.json({ ok: false, error: code, detail: detail || undefined },
    { status: status || ERR_HTTP[code] || 400 });
}
const methodNotAllowed = () => Response.json({ ok: false, error: "method not allowed" }, { status: 405 });

function fromError(e) {
  if (e && e.name === "BookingError") return bad(e.code, e.detail);
  if (e && e.name === "GoogleError") {
    if (e.code === "NOT_CONNECTED" || e.code === "NOT_CONFIGURED") return bad(ERR.GOOGLE_UNAVAILABLE, e.code, 503);
    return bad(ERR.GOOGLE_UNAVAILABLE, e.code, 503);
  }
  if (e && e.name === "TimeZoneError") return bad(ERR.VALIDATION_ERROR, "timezone");
  // Nothing from the inside travels outwards. The coach can see what went
  // wrong in the sync fields; a caller sees that it went wrong.
  return bad(ERR.VALIDATION_ERROR, undefined, 500);
}

async function readBody(request) {
  const len = Number(request.headers.get("content-length") || 0);
  if (len > MAX_BODY) return { tooBig: true };
  const text = await request.text();
  if (text.length > MAX_BODY) return { tooBig: true };
  if (!text) return { body: {} };
  try { return { body: JSON.parse(text) }; } catch (e) { return { invalid: true }; }
}

// ---- Validation ------------------------------------------------------------
const str = (v, max) => String(v == null ? "" : v).slice(0, max || 200);
const int = (v) => (Number.isFinite(Number(v)) ? Math.round(Number(v)) : null);
const bool = (v) => (v === true || v === 1 || v === "1" || v === "true" ? 1 : 0);
const gridOk = (v) => Number.isInteger(v) && v >= 0 && v % SLOT_GRID_MIN === 0;

/**
 * Durations, buffers and intervals must sit on the five-minute grid, because
 * the lock rows do. Anything else would let a legal back-to-back booking be
 * rejected by four minutes nobody asked for.
 */
function validateService(b) {
  const errs = [];
  const v = {
    name_cs: str(b.name_cs, 80), name_en: str(b.name_en, 80),
    description_cs: str(b.description_cs, 600), description_en: str(b.description_en, 600),
    duration_min: int(b.duration_min), credit_cost_units: int(b.credit_cost_units),
    price_minor: int(b.price_minor), currency: str(b.currency, 8) || "CZK",
    min_notice_min: int(b.min_notice_min), booking_horizon_days: int(b.booking_horizon_days),
    cancel_before_min: int(b.cancel_before_min),
    buffer_before_min: int(b.buffer_before_min), buffer_after_min: int(b.buffer_after_min),
    slot_interval_min: int(b.slot_interval_min),
    confirmation_mode: b.confirmation_mode === CONFIRMATION_MODE.AUTO ? CONFIRMATION_MODE.AUTO : CONFIRMATION_MODE.REQUEST,
    daily_limit: int(b.daily_limit) || 0, weekly_limit: int(b.weekly_limit) || 0,
    late_cancel_refunds: bool(b.late_cancel_refunds), no_show_refunds: bool(b.no_show_refunds),
    client_visible: b.client_visible === undefined ? 1 : bool(b.client_visible),
    active: b.active === undefined ? 1 : bool(b.active),
    sort_order: int(b.sort_order) || 0,
  };
  if (!v.name_cs && !v.name_en) errs.push("name");
  for (const k of ["duration_min", "buffer_before_min", "buffer_after_min", "slot_interval_min"]) {
    if (!gridOk(v[k])) errs.push(k + " must be a whole multiple of " + SLOT_GRID_MIN);
  }
  if (!v.duration_min || v.duration_min > 8 * 60) errs.push("duration_min");
  if (v.credit_cost_units == null || v.credit_cost_units < 0 || v.credit_cost_units > 20) errs.push("credit_cost_units");
  if (v.price_minor == null || v.price_minor < 0) errs.push("price_minor");
  for (const k of ["min_notice_min", "booking_horizon_days", "cancel_before_min"]) {
    if (v[k] == null || v[k] < 0) errs.push(k);
  }
  if (v.booking_horizon_days > 365) errs.push("booking_horizon_days");
  return { value: v, errors: errs };
}

function validateLocation(b) {
  const errs = [];
  const type = [LOCATION_TYPE.STUDIO, LOCATION_TYPE.OUTDOORS, LOCATION_TYPE.ONLINE].indexOf(b.type) >= 0 ? b.type : null;
  if (!type) errs.push("type");
  const onlineMode = [ONLINE_MODE.MANUAL_LINK, ONLINE_MODE.GOOGLE_MEET].indexOf(b.online_mode) >= 0 ? b.online_mode : "";
  const url = str(b.online_url, 500);
  if (url && !/^https:\/\//i.test(url)) errs.push("online_url");
  const v = {
    type, name_cs: str(b.name_cs, 80), name_en: str(b.name_en, 80),
    address: str(b.address, 300), map_url: /^https:\/\//i.test(str(b.map_url, 500)) ? str(b.map_url, 500) : "",
    instructions_cs: str(b.instructions_cs, 800), instructions_en: str(b.instructions_en, 800),
    timezone: str(b.timezone, 60) || "Europe/Prague",
    travel_group: str(b.travel_group, 40),
    buffer_before_min: int(b.buffer_before_min) || 0, buffer_after_min: int(b.buffer_after_min) || 0,
    online_mode: type === LOCATION_TYPE.ONLINE ? onlineMode : "",
    online_url: type === LOCATION_TYPE.ONLINE ? url : "",
    active: b.active === undefined ? 1 : bool(b.active),
    sort_order: int(b.sort_order) || 0,
  };
  if (!gridOk(v.buffer_before_min) || !gridOk(v.buffer_after_min)) errs.push("buffer must be a multiple of " + SLOT_GRID_MIN);
  if (!v.name_cs && !v.name_en) errs.push("name");
  return { value: v, errors: errs };
}

// ---- Shared reads ----------------------------------------------------------
async function bookingView(db, b, opts = {}) {
  const [service, location, client] = await Promise.all([
    R.getService(db, b.service_id),
    b.location_id ? R.getLocation(db, b.location_id) : Promise.resolve(null),
    opts.withClient ? R.getClient(db, b.client_id) : Promise.resolve(null),
  ]);
  const view = {
    id: b.id, startsAt: Number(b.starts_at_utc), endsAt: Number(b.ends_at_utc),
    timezone: b.timezone, localDate: b.local_date, status: b.status,
    confirmationMode: b.confirmation_mode,
    creditUnits: Number(b.credit_cost_units) || 0,
    clientNote: b.client_note || "",
    meetingUrl: b.meeting_url || "",
    planId: b.plan_id || null,
    workoutTemplateId: b.workout_template_id || null,
    sessionInstanceId: b.session_instance_id || null,
    version: Number(b.version),
    service: service ? { id: service.id, nameCs: service.name_cs, nameEn: service.name_en,
      durationMin: service.duration_min, cancelBeforeMin: service.cancel_before_min,
      creditUnits: service.credit_cost_units, priceMinor: service.price_minor, currency: service.currency } : null,
    location: location ? { id: location.id, type: location.type, nameCs: location.name_cs, nameEn: location.name_en,
      // The exact place is shown once the booking exists, not while browsing.
      address: location.address, mapUrl: location.map_url,
      instructionsCs: location.instructions_cs, instructionsEn: location.instructions_en } : null,
  };
  if (opts.coach) {
    view.clientId = b.client_id;
    view.clientName = client ? client.name : "";
    view.clientEmail = client ? client.email : "";
    view.coachNote = b.coach_note_private || "";
    view.paymentStatus = b.payment_status;
    view.paymentMethod = b.payment_method;
    view.priceMinor = Number(b.price_minor) || 0;
    view.currency = b.currency;
    view.clientPackageId = b.client_package_id || null;
    view.syncStatus = b.sync_status;
    view.googleEventId = b.google_event_id || null;
    view.cancelReason = b.cancel_reason || "";
    view.createdBy = b.created_by;
  }
  return view;
}

// ---- Google busy, for listing and for committing ---------------------------
async function googleBusy(db, env, fromMs, toMs, mustBeFresh) {
  if (!G.googleConfigured(env)) return { windows: [], connected: false, live: false };
  try {
    return await G.busyForRange(db, env, fromMs, toMs, { mustBeFresh });
  } catch (e) {
    if (mustBeFresh) throw e;             // never book blind
    return { windows: [], connected: true, live: false, stale: true }; // listing may degrade
  }
}

// A booking that changed should reach Google now, not at the next cron tick —
// but never at the cost of the request the person is waiting for.
function drainSoon(ctx, db, env) {
  const p = G.drainOutbox(db, env, { limit: 5 }).catch(() => {});
  if (ctx && typeof ctx.waitUntil === "function") ctx.waitUntil(p);
}

// ===========================================================================
// COACH
// ===========================================================================
export async function handleCoach(request, env, url, ctx) {
  const db = env.KLIENT_DB || env.DB;
  if (!db) return bad(ERR.VALIDATION_ERROR, "no database binding", 500);
  await ensureBookingSchema(db);

  const path = url.pathname;
  const method = request.method;
  const now = Date.now();
  const actorId = (request.headers.get("cf-access-authenticated-user-email") || "").toLowerCase();

  try {
    // ---- agenda -----------------------------------------------------------
    if (path === "/api/booking/agenda" && method === "GET") {
      const tz = url.searchParams.get("tz") || "Europe/Prague";
      const today = localDateISO(now, tz);
      const from = startOfLocalDay(today, tz);
      const to = endOfLocalDay(shiftDateISO(today, 7), tz);
      const [upcoming, pending, syncErr, unpaid] = await Promise.all([
        R.bookingsBetween(db, from, to),
        R.pendingBookings(db),
        R.syncErrorBookings(db),
        R.unpaidBookings(db, now),
      ]);
      const view = (list) => Promise.all(list.map((b) => bookingView(db, b, { coach: true, withClient: true })));
      return ok({
        today, timezone: tz,
        upcoming: await view(upcoming.filter((b) => b.status === BOOKING_STATUS.CONFIRMED || b.status === BOOKING_STATUS.REQUESTED)),
        pending: await view(pending),
        syncErrors: await view(syncErr),
        unpaid: await view(unpaid),
      });
    }

    // ---- calendar range ---------------------------------------------------
    if (path === "/api/booking/calendar" && method === "GET") {
      const tz = url.searchParams.get("tz") || "Europe/Prague";
      const fromDate = isDateISO(url.searchParams.get("from")) ? url.searchParams.get("from") : localDateISO(now, tz);
      const days = Math.min(Math.max(1, Number(url.searchParams.get("days")) || 7), 45);
      const toDate = shiftDateISO(fromDate, days - 1);
      const fromMs = startOfLocalDay(fromDate, tz), toMs = endOfLocalDay(toDate, tz);
      const [list, blocks, rules, overrides, busy] = await Promise.all([
        R.bookingsBetween(db, fromMs, toMs),
        R.listBlocks(db, fromMs, toMs),
        R.listRules(db),
        R.listOverrides(db, fromDate, toDate),
        googleBusy(db, env, fromMs, toMs, false),
      ]);
      return ok({
        from: fromDate, to: toDate, timezone: tz,
        bookings: await Promise.all(list.map((b) => bookingView(db, b, { coach: true, withClient: true }))),
        // Google's windows travel as "busy" and nothing else. There is no
        // title here to show because this app never asked for one.
        blocks: blocks.filter((k) => k.source !== "GOOGLE").map((k) => ({
          id: k.id, startsAt: Number(k.starts_at_utc), endsAt: Number(k.ends_at_utc), source: k.source, note: k.note })),
        googleBusy: busy.windows.map((w) => ({ startsAt: w.s, endsAt: w.e })),
        googleConnected: !!busy.connected,
        rules, overrides,
      });
    }

    // ---- free time, for the coach's own picker ----------------------------
    // The same engine the client sees, with one difference: the coach may ask
    // it to ignore a booking that is about to move.
    if (path === "/api/booking/slots" && method === "GET") {
      const serviceId = str(url.searchParams.get("serviceId"), 64);
      if (!serviceId) return bad(ERR.VALIDATION_ERROR, "serviceId");
      const locationId = url.searchParams.get("locationId") ? str(url.searchParams.get("locationId"), 64) : null;
      const tz = url.searchParams.get("tz") || "Europe/Prague";
      const fromDate = isDateISO(url.searchParams.get("from")) ? url.searchParams.get("from") : localDateISO(now, tz);
      const days = Math.min(Math.max(1, Number(url.searchParams.get("days")) || 21), 45);
      const busy = await googleBusy(db, env,
        startOfLocalDay(fromDate, tz), endOfLocalDay(shiftDateISO(fromDate, days), tz), false);
      const av = await E.availability(db, {
        serviceId, locationId, now, fromDate, days, timezone: tz,
        excludeBookingId: url.searchParams.get("exclude") ? str(url.searchParams.get("exclude"), 64) : null,
        googleBusy: busy.windows,
      });
      return ok({
        timezone: av.timezone, from: av.from, to: av.to,
        days: av.days.map((d) => ({ date: d.date, slots: d.slots.map((s2) => ({ startsAt: s2.start, endsAt: s2.end })) })),
        googleChecked: !!busy.connected,
      });
    }

    // ---- one booking ------------------------------------------------------
    const mBooking = path.match(/^\/api\/booking\/bookings\/([A-Za-z0-9_-]{1,64})(\/[a-z-]+)?$/);
    if (mBooking) {
      const id = mBooking[1];
      const action = (mBooking[2] || "").replace("/", "");
      const b = await R.getBooking(db, id);
      if (!b) return bad(ERR.NOT_FOUND);

      if (!action && method === "GET") {
        const [view, events, ledger] = await Promise.all([
          bookingView(db, b, { coach: true, withClient: true }),
          R.eventsOfBooking(db, id),
          R.ledgerForBooking(db, id),
        ]);
        return ok({ booking: view, events, ledger });
      }

      if (!action && method === "PATCH") {
        const { body, invalid, tooBig } = await readBody(request);
        if (tooBig) return bad(ERR.VALIDATION_ERROR, "body too large", 413);
        if (invalid) return bad(ERR.VALIDATION_ERROR, "json");
        const sets = [], args = [];
        if (body.coachNote !== undefined) { sets.push("coach_note_private = ?"); args.push(str(body.coachNote, 4000)); }
        if (body.clientNote !== undefined) { sets.push("client_note = ?"); args.push(str(body.clientNote, 1000)); }
        if (body.meetingUrl !== undefined) {
          const u = str(body.meetingUrl, 500);
          if (u && !/^https:\/\//i.test(u)) return bad(ERR.VALIDATION_ERROR, "meetingUrl");
          sets.push("meeting_url = ?"); args.push(u);
        }
        if (body.paymentStatus !== undefined) {
          if (!Object.values(PAYMENT_STATUS).includes(body.paymentStatus)) return bad(ERR.VALIDATION_ERROR, "paymentStatus");
          sets.push("payment_status = ?"); args.push(body.paymentStatus);
          sets.push("paid_at = ?"); args.push(body.paymentStatus === PAYMENT_STATUS.PAID ? now : null);
        }
        if (body.paymentMethod !== undefined) {
          if (!Object.values(PAYMENT_METHOD).includes(body.paymentMethod)) return bad(ERR.VALIDATION_ERROR, "paymentMethod");
          sets.push("payment_method = ?"); args.push(body.paymentMethod);
        }
        if (body.planId !== undefined) { sets.push("plan_id = ?"); args.push(body.planId ? str(body.planId, 64) : null); }
        if (body.workoutTemplateId !== undefined) { sets.push("workout_template_id = ?"); args.push(body.workoutTemplateId ? str(body.workoutTemplateId, 64) : null); }
        if (body.sessionInstanceId !== undefined) { sets.push("session_instance_id = ?"); args.push(body.sessionInstanceId ? str(body.sessionInstanceId, 64) : null); }
        if (!sets.length) return bad(ERR.VALIDATION_ERROR, "nothing to change");
        sets.push("updated_at = ?"); args.push(now);
        await db.batch([
          db.prepare("UPDATE bookings SET " + sets.join(", ") + " WHERE id = ?").bind(...args, id),
          R.stInsertEvent(db, { id: R.newId("ev"), booking_id: id,
            type: body.paymentStatus !== undefined ? "PAYMENT_CHANGED" : "NOTE_CHANGED",
            actor_type: ACTOR.COACH, actor_id: actorId, created_at: now,
            payload: { fields: Object.keys(body) } }),
        ]);
        return ok({ booking: await bookingView(db, await R.getBooking(db, id), { coach: true, withClient: true }) });
      }

      if (action === "reschedule" && method === "POST") {
        const { body, invalid } = await readBody(request);
        if (invalid) return bad(ERR.VALIDATION_ERROR, "json");
        const startsAt = Number(body.startsAt);
        if (!Number.isFinite(startsAt)) return bad(ERR.VALIDATION_ERROR, "startsAt");
        const fresh = await googleBusy(db, env, startsAt - 6 * 3600000, startsAt + 6 * 3600000, !body.adminOverride);
        const after = await E.rescheduleBooking(db, id, {
          startsAt, locationId: body.locationId, now, actor: ACTOR.COACH, actorId,
          adminOverride: !!body.adminOverride, googleBusy: fresh.windows,
        });
        drainSoon(ctx, db, env);
        return ok({ booking: await bookingView(db, after, { coach: true, withClient: true }) });
      }

      const moves = { confirm: "confirm", reject: "reject", cancel: "cancel", complete: "complete", "no-show": "noShow" };
      if (moves[action] && method === "POST") {
        const { body, invalid } = await readBody(request);
        if (invalid) return bad(ERR.VALIDATION_ERROR, "json");
        const after = await E.transitionBooking(db, id, moves[action], {
          now, actor: ACTOR.COACH, actorId, reason: str(body.reason, 300),
        });
        drainSoon(ctx, db, env);
        return ok({ booking: await bookingView(db, after, { coach: true, withClient: true }) });
      }

      if (action === "cancel-preview" && method === "GET") {
        return ok({ preview: await E.cancelPreview(db, id, { now, byCoach: true }) });
      }
      if (action === "no-show-preview" && method === "GET") {
        return ok({ preview: await E.noShowPreviewFor(db, id) });
      }
      return methodNotAllowed();
    }

    // ---- create a booking by hand ----------------------------------------
    if (path === "/api/booking/bookings" && method === "POST") {
      const { body, invalid, tooBig } = await readBody(request);
      if (tooBig) return bad(ERR.VALIDATION_ERROR, "body too large", 413);
      if (invalid) return bad(ERR.VALIDATION_ERROR, "json");
      const key = str(request.headers.get("idempotency-key") || body.idempotencyKey, 120);
      const seen = await R.recallIdempotent(db, key, "coach:create");
      if (seen) return ok(seen);
      const startsAt = Number(body.startsAt);
      if (!Number.isFinite(startsAt)) return bad(ERR.VALIDATION_ERROR, "startsAt");
      const fresh = await googleBusy(db, env, startsAt - 6 * 3600000, startsAt + 6 * 3600000, !body.adminOverride);
      const b = await E.createBooking(db, {
        clientId: str(body.clientId, 64), serviceId: str(body.serviceId, 64),
        locationId: body.locationId ? str(body.locationId, 64) : null,
        startsAt, now, actor: ACTOR.COACH, actorId,
        clientNote: body.clientNote, coachNote: body.coachNote,
        clientPackageId: body.clientPackageId ? str(body.clientPackageId, 64) : null,
        planId: body.planId, workoutTemplateId: body.workoutTemplateId,
        adminOverride: !!body.adminOverride, overrideReason: str(body.overrideReason, 300),
        googleBusy: fresh.windows,
      });
      const result = { booking: await bookingView(db, b, { coach: true, withClient: true }) };
      await R.rememberIdempotent(db, key, "coach:create", result);
      drainSoon(ctx, db, env);
      return ok(result);
    }

    // ---- services ---------------------------------------------------------
    if (path === "/api/booking/services") {
      if (method === "GET") {
        const list = await R.listServices(db);
        const links = (await db.prepare("SELECT * FROM booking_service_locations").all()).results || [];
        return ok({ services: list.map((s2) => ({ ...s2, locationIds: links.filter((l) => l.service_id === s2.id).map((l) => l.location_id) })) });
      }
      if (method === "POST") {
        const { body, invalid } = await readBody(request);
        if (invalid) return bad(ERR.VALIDATION_ERROR, "json");
        const { value, errors } = validateService(body);
        if (errors.length) return bad(ERR.VALIDATION_ERROR, errors.join("; "));
        const id = R.newId("svc");
        const cols = Object.keys(value);
        await db.prepare(`INSERT INTO booking_services (id, ${cols.join(", ")}, created_at, updated_at)
                          VALUES (?, ${cols.map(() => "?").join(", ")}, ?, ?)`)
          .bind(id, ...cols.map((k) => value[k]), now, now).run();
        await setServiceLocations(db, id, body.locationIds);
        return ok({ service: await R.getService(db, id) });
      }
      return methodNotAllowed();
    }
    const mService = path.match(/^\/api\/booking\/services\/([A-Za-z0-9_-]{1,64})$/);
    if (mService) {
      const id = mService[1];
      if (method === "PATCH") {
        const { body, invalid } = await readBody(request);
        if (invalid) return bad(ERR.VALIDATION_ERROR, "json");
        const current = await R.getService(db, id);
        if (!current) return bad(ERR.NOT_FOUND);
        const { value, errors } = validateService({ ...current, ...body });
        if (errors.length) return bad(ERR.VALIDATION_ERROR, errors.join("; "));
        const cols = Object.keys(value);
        await db.prepare(`UPDATE booking_services SET ${cols.map((k) => k + " = ?").join(", ")}, updated_at = ? WHERE id = ?`)
          .bind(...cols.map((k) => value[k]), now, id).run();
        if (body.locationIds) await setServiceLocations(db, id, body.locationIds);
        return ok({ service: await R.getService(db, id) });
      }
      if (method === "DELETE") {
        // Never a delete. A service with history stops being offered; the
        // bookings that used it keep pointing at something real.
        await db.prepare("UPDATE booking_services SET active = 0, client_visible = 0, updated_at = ? WHERE id = ?").bind(now, id).run();
        return ok({ retired: true });
      }
      return methodNotAllowed();
    }

    // ---- locations --------------------------------------------------------
    if (path === "/api/booking/locations") {
      if (method === "GET") return ok({ locations: await R.listLocations(db) });
      if (method === "POST") {
        const { body, invalid } = await readBody(request);
        if (invalid) return bad(ERR.VALIDATION_ERROR, "json");
        const { value, errors } = validateLocation(body);
        if (errors.length) return bad(ERR.VALIDATION_ERROR, errors.join("; "));
        const id = R.newId("loc");
        const cols = Object.keys(value);
        await db.prepare(`INSERT INTO booking_locations (id, ${cols.join(", ")}, created_at, updated_at)
                          VALUES (?, ${cols.map(() => "?").join(", ")}, ?, ?)`)
          .bind(id, ...cols.map((k) => value[k]), now, now).run();
        return ok({ location: await R.getLocation(db, id) });
      }
      return methodNotAllowed();
    }
    const mLocation = path.match(/^\/api\/booking\/locations\/([A-Za-z0-9_-]{1,64})$/);
    if (mLocation) {
      const id = mLocation[1];
      if (method === "PATCH") {
        const { body, invalid } = await readBody(request);
        if (invalid) return bad(ERR.VALIDATION_ERROR, "json");
        const current = await R.getLocation(db, id);
        if (!current) return bad(ERR.NOT_FOUND);
        const { value, errors } = validateLocation({ ...current, ...body });
        if (errors.length) return bad(ERR.VALIDATION_ERROR, errors.join("; "));
        const cols = Object.keys(value);
        await db.prepare(`UPDATE booking_locations SET ${cols.map((k) => k + " = ?").join(", ")}, updated_at = ? WHERE id = ?`)
          .bind(...cols.map((k) => value[k]), now, id).run();
        return ok({ location: await R.getLocation(db, id) });
      }
      if (method === "DELETE") {
        await db.prepare("UPDATE booking_locations SET active = 0, updated_at = ? WHERE id = ?").bind(now, id).run();
        return ok({ retired: true });
      }
      return methodNotAllowed();
    }

    // ---- availability -----------------------------------------------------
    if (path === "/api/booking/availability") {
      if (method === "GET") {
        return ok({ rules: await R.listRules(db) });
      }
      if (method === "PUT") {
        const { body, invalid } = await readBody(request);
        if (invalid) return bad(ERR.VALIDATION_ERROR, "json");
        const list = Array.isArray(body.rules) ? body.rules : null;
        if (!list) return bad(ERR.VALIDATION_ERROR, "rules");
        if (list.length > 200) return bad(ERR.VALIDATION_ERROR, "too many rules");
        const stmts = [db.prepare("DELETE FROM booking_availability_rules")];
        for (const r of list) {
          const weekday = int(r.weekday), s0 = int(r.start_minute), e0 = int(r.end_minute);
          if (weekday == null || weekday < 0 || weekday > 6) return bad(ERR.VALIDATION_ERROR, "weekday");
          if (!gridOk(s0) || !gridOk(e0) || e0 <= s0 || e0 > 1440) return bad(ERR.VALIDATION_ERROR, "window");
          stmts.push(db.prepare(`INSERT INTO booking_availability_rules
              (id, weekday, start_minute, end_minute, service_id, location_id, valid_from, valid_until, active, created_at, updated_at)
              VALUES (?,?,?,?,?,?,?,?,?,?,?)`)
            .bind(R.newId("ar"), weekday, s0, e0,
                  r.service_id ? str(r.service_id, 64) : null, r.location_id ? str(r.location_id, 64) : null,
                  isDateISO(r.valid_from) ? r.valid_from : null, isDateISO(r.valid_until) ? r.valid_until : null,
                  r.active === undefined ? 1 : bool(r.active), now, now));
        }
        await db.batch(stmts);
        return ok({ rules: await R.listRules(db) });
      }
      return methodNotAllowed();
    }

    if (path === "/api/booking/overrides") {
      if (method === "GET") {
        const from = isDateISO(url.searchParams.get("from")) ? url.searchParams.get("from") : localDateISO(now, "Europe/Prague");
        const to = isDateISO(url.searchParams.get("to")) ? url.searchParams.get("to") : shiftDateISO(from, 120);
        return ok({ overrides: await R.listOverrides(db, from, to) });
      }
      if (method === "POST") {
        const { body, invalid } = await readBody(request);
        if (invalid) return bad(ERR.VALIDATION_ERROR, "json");
        const kind = ["CLOSED", "OPEN", "VACATION"].indexOf(body.kind) >= 0 ? body.kind : null;
        if (!kind) return bad(ERR.VALIDATION_ERROR, "kind");
        const fromDate = isDateISO(body.date) ? body.date : null;
        const toDate = isDateISO(body.toDate) ? body.toDate : fromDate;
        if (!fromDate) return bad(ERR.VALIDATION_ERROR, "date");
        const startMin = body.start_minute == null ? null : int(body.start_minute);
        const endMin = body.end_minute == null ? null : int(body.end_minute);
        if (startMin != null && (!gridOk(startMin) || !gridOk(endMin) || endMin <= startMin)) return bad(ERR.VALIDATION_ERROR, "window");
        const stmts = [];
        let d = fromDate, guard = 0;
        while (d <= toDate && guard++ < 400) {
          stmts.push(db.prepare(`INSERT INTO booking_availability_overrides
              (id, date_local, start_minute, end_minute, kind, service_id, location_id, note, active, created_at)
              VALUES (?,?,?,?,?,?,?,?,1,?)`)
            .bind(R.newId("ov"), d, startMin, endMin, kind,
                  body.service_id ? str(body.service_id, 64) : null,
                  body.location_id ? str(body.location_id, 64) : null,
                  str(body.note, 200), now));
          d = shiftDateISO(d, 1);
        }
        await db.batch(stmts);
        return ok({ added: stmts.length });
      }
      return methodNotAllowed();
    }
    const mOverride = path.match(/^\/api\/booking\/overrides\/([A-Za-z0-9_-]{1,64})$/);
    if (mOverride && method === "DELETE") {
      await db.prepare("DELETE FROM booking_availability_overrides WHERE id = ?").bind(mOverride[1]).run();
      return ok({ removed: true });
    }

    // ---- manual blocks ----------------------------------------------------
    if (path === "/api/booking/blocks") {
      if (method === "GET") {
        const from = Number(url.searchParams.get("from")) || now;
        const to = Number(url.searchParams.get("to")) || now + 60 * 86400000;
        const list = await R.listBlocks(db, from, to);
        return ok({ blocks: list.filter((b) => b.source !== "GOOGLE") });
      }
      if (method === "POST") {
        const { body, invalid } = await readBody(request);
        if (invalid) return bad(ERR.VALIDATION_ERROR, "json");
        const s0 = Number(body.startsAt), e0 = Number(body.endsAt);
        if (!Number.isFinite(s0) || !Number.isFinite(e0) || e0 <= s0) return bad(ERR.VALIDATION_ERROR, "range");
        if (e0 - s0 > 366 * 86400000) return bad(ERR.VALIDATION_ERROR, "range too long");
        const id = R.newId("blk");
        await db.prepare(`INSERT INTO booking_blocks (id, starts_at_utc, ends_at_utc, source, google_calendar_id, note, fetched_at, created_at, updated_at)
                          VALUES (?,?,?,?,NULL,?,NULL,?,?)`)
          .bind(id, s0, e0, body.source === "RECURRING" ? "RECURRING" : "MANUAL", str(body.note, 200), now, now).run();
        return ok({ id });
      }
      return methodNotAllowed();
    }
    const mBlock = path.match(/^\/api\/booking\/blocks\/([A-Za-z0-9_-]{1,64})$/);
    if (mBlock && method === "DELETE") {
      await db.prepare("DELETE FROM booking_blocks WHERE id = ? AND source != 'GOOGLE'").bind(mBlock[1]).run();
      return ok({ removed: true });
    }

    // ---- clients, packages, credits --------------------------------------
    if (path === "/api/booking/clients" && method === "GET") {
      const list = await R.listClients(db);
      const out = [];
      for (const c of list) {
        const ledger = await R.ledgerAll(db, c.id);
        out.push({ ...c, balance: balanceOf(ledger) });
      }
      return ok({ clients: out });
    }
    if (path === "/api/booking/clients" && method === "POST") {
      const { body, invalid } = await readBody(request);
      if (invalid) return bad(ERR.VALIDATION_ERROR, "json");
      const id = R.newId("cli");
      await db.prepare(`INSERT INTO booking_clients (id, account_user_id, coach_profile_id, name, email, timezone, active, created_at, updated_at)
                        VALUES (?,?,?,?,?,?,1,?,?)`)
        .bind(id, body.accountUserId ? str(body.accountUserId, 120) : null,
              body.coachProfileId ? str(body.coachProfileId, 64) : null,
              str(body.name, 120), str(body.email, 160), str(body.timezone, 60) || "Europe/Prague", now, now).run();
      return ok({ client: await R.getClient(db, id) });
    }

    const mClient = path.match(/^\/api\/booking\/clients\/([A-Za-z0-9_-]{1,64})\/([a-z-]+)$/);
    if (mClient) {
      const clientId = mClient[1], what = mClient[2];
      const client = await R.getClient(db, clientId);
      if (!client) return bad(ERR.NOT_FOUND);

      if (what === "credits" && method === "GET") {
        return ok({ ...(await E.creditSummary(db, clientId, { withEntries: true })) });
      }
      if (what === "credits" && method === "POST") {
        const { body, invalid } = await readBody(request);
        if (invalid) return bad(ERR.VALIDATION_ERROR, "json");
        const units = int(body.units);
        if (!units) return bad(ERR.VALIDATION_ERROR, "units");
        if (!str(body.reason, 300).trim()) return bad(ERR.VALIDATION_ERROR, "reason");
        const entry = await E.writeManualLedger(db, {
          clientId, clientPackageId: body.clientPackageId, units,
          kind: body.kind === LEDGER_KIND.MANUAL_ADD ? LEDGER_KIND.MANUAL_ADD : LEDGER_KIND.ADJUSTMENT,
          reason: body.reason, now,
          idempotencyKey: str(request.headers.get("idempotency-key") || body.idempotencyKey, 120) || undefined,
        });
        return ok({ entry, balance: (await E.creditSummary(db, clientId)).balance });
      }
      if (what === "packages" && method === "GET") {
        return ok({ packages: (await E.creditSummary(db, clientId)).packages });
      }
      if (what === "packages" && method === "POST") {
        const { body, invalid } = await readBody(request);
        if (invalid) return bad(ERR.VALIDATION_ERROR, "json");
        const units = int(body.units);
        if (!units || units < 1 || units > 500) return bad(ERR.VALIDATION_ERROR, "units");
        const paid = body.paymentStatus === PAYMENT_STATUS.PAID;
        const id = R.newId("cp");
        const validDays = int(body.validDays);
        const expiresAt = validDays ? now + validDays * 86400000 : null;
        const stmts = [
          db.prepare(`INSERT INTO client_packages
              (id, client_id, package_definition_id, name_snapshot, purchased_units, price_minor, currency,
               payment_status, payment_method, payment_provider, external_payment_id, purchased_at,
               valid_from, expires_at, status, note, created_at, updated_at)
              VALUES (?,?,?,?,?,?,?,?,?,'','',?,?,?,?,?,?,?)`)
            .bind(id, clientId, body.packageDefinitionId ? str(body.packageDefinitionId, 64) : null,
                  str(body.name, 80) || "Balíček", units, int(body.priceMinor) || 0, str(body.currency, 8) || "CZK",
                  paid ? PAYMENT_STATUS.PAID : PAYMENT_STATUS.OPEN,
                  Object.values(PAYMENT_METHOD).includes(body.paymentMethod) ? body.paymentMethod : PAYMENT_METHOD.NONE,
                  now, now, expiresAt, PACKAGE_STATUS.ACTIVE, str(body.note, 300), now, now),
          R.stInsertLedger(db, {
            id: R.newId("cl"), client_id: clientId, client_package_id: id, booking_id: null,
            kind: paid ? LEDGER_KIND.PURCHASE : LEDGER_KIND.MANUAL_ADD, units,
            reason: paid ? "" : "Zatím nezaplaceno", created_by: ACTOR.COACH, created_at: now,
            idempotency_key: id + ":purchase",
          }),
        ];
        for (const sid of (Array.isArray(body.serviceIds) ? body.serviceIds.slice(0, 50) : [])) {
          stmts.push(db.prepare("INSERT INTO client_package_services (client_package_id, service_id) VALUES (?, ?) ON CONFLICT DO NOTHING")
            .bind(id, str(sid, 64)));
        }
        await db.batch(stmts);
        return ok({ packages: (await E.creditSummary(db, clientId)).packages });
      }
      if (what === "bookings" && method === "GET") {
        const list = await R.bookingsForClient(db, clientId, { desc: true, limit: 200 });
        return ok({ bookings: await Promise.all(list.map((b) => bookingView(db, b, { coach: true }))) });
      }
      return methodNotAllowed();
    }

    const mPackage = path.match(/^\/api\/booking\/packages\/([A-Za-z0-9_-]{1,64})$/);
    if (mPackage && method === "PATCH") {
      const { body, invalid } = await readBody(request);
      if (invalid) return bad(ERR.VALIDATION_ERROR, "json");
      const sets = [], args = [];
      if (body.paymentStatus !== undefined) {
        if (!Object.values(PAYMENT_STATUS).includes(body.paymentStatus)) return bad(ERR.VALIDATION_ERROR, "paymentStatus");
        sets.push("payment_status = ?"); args.push(body.paymentStatus);
      }
      if (body.paymentMethod !== undefined) { sets.push("payment_method = ?"); args.push(str(body.paymentMethod, 20)); }
      if (body.expiresAt !== undefined) { sets.push("expires_at = ?"); args.push(body.expiresAt ? Number(body.expiresAt) : null); }
      if (body.status !== undefined) {
        if (!Object.values(PACKAGE_STATUS).includes(body.status)) return bad(ERR.VALIDATION_ERROR, "status");
        sets.push("status = ?"); args.push(body.status);
      }
      if (body.note !== undefined) { sets.push("note = ?"); args.push(str(body.note, 300)); }
      if (!sets.length) return bad(ERR.VALIDATION_ERROR, "nothing to change");
      sets.push("updated_at = ?"); args.push(now);
      await db.prepare("UPDATE client_packages SET " + sets.join(", ") + " WHERE id = ?").bind(...args, mPackage[1]).run();
      return ok({ updated: true });
    }

    // ---- migration --------------------------------------------------------
    if (path === "/api/booking/migrate") {
      if (method === "GET") return ok({ state: await migrationState(db) });
      if (method === "POST") {
        const { body, invalid, tooBig } = await readBody(request);
        if (tooBig) return bad(ERR.VALIDATION_ERROR, "body too large", 413);
        if (invalid) return bad(ERR.VALIDATION_ERROR, "json");
        if (!body.coll || typeof body.coll !== "object") return bad(ERR.VALIDATION_ERROR, "coll");
        const summary = await migrateLegacy(db, body.coll, {
          now, accounts: Array.isArray(body.accounts) ? body.accounts : [], dryRun: !!body.dryRun,
        });
        return ok({ summary, dryRun: !!body.dryRun });
      }
      return methodNotAllowed();
    }
    if (path === "/api/booking/seed" && method === "POST") {
      return ok({ seeded: await seedDefaults(db, { now }) });
    }

    // ---- Google -----------------------------------------------------------
    if (path === "/api/booking/google/status" && method === "GET") {
      return ok({ google: G.publicConnection(await G.getConnection(db), env) });
    }
    if (path === "/api/booking/google/connect" && method === "POST") {
      const missing = G.missingSecrets(env);
      if (missing.length) return bad(ERR.GOOGLE_UNAVAILABLE, "missing secrets: " + missing.join(", "), 503);
      const { body } = await readBody(request);
      const { url: authUrl } = await G.beginAuth(db, env, { redirectTo: (body && body.redirectTo) || "" });
      return ok({ url: authUrl });
    }
    if (path === "/api/booking/google/callback" && method === "GET") {
      const err = url.searchParams.get("error");
      if (err) return htmlClose("Připojení ke kalendáři se nedokončilo.", "The calendar connection was not completed.");
      try {
        await G.completeAuth(db, env, {
          state: url.searchParams.get("state"), code: url.searchParams.get("code"),
        });
        await G.ensureBookingCalendar(db, env, "tanmay · sezení").catch(() => {});
        return htmlClose("Kalendář je připojený. Tohle okno můžeš zavřít.", "The calendar is connected. You can close this window.");
      } catch (e) {
        return htmlClose("Připojení ke kalendáři se nedokončilo.", "The calendar connection was not completed.");
      }
    }
    if (path === "/api/booking/google/calendars" && method === "GET") {
      return ok({ calendars: await G.listCalendars(db, env) });
    }
    if (path === "/api/booking/google/settings" && method === "PATCH") {
      const { body, invalid } = await readBody(request);
      if (invalid) return bad(ERR.VALIDATION_ERROR, "json");
      const sets = [], args = [];
      if (body.busyCalendarIds !== undefined) {
        const ids = (Array.isArray(body.busyCalendarIds) ? body.busyCalendarIds : []).slice(0, 50).map((x) => str(x, 200));
        sets.push("busy_calendar_ids_json = ?"); args.push(JSON.stringify(ids));
      }
      if (body.titleMode !== undefined) {
        if (!Object.values(CALENDAR_TITLE_MODE).includes(body.titleMode)) return bad(ERR.VALIDATION_ERROR, "titleMode");
        sets.push("title_mode = ?"); args.push(body.titleMode);
      }
      if (body.inviteClient !== undefined) { sets.push("invite_client = ?"); args.push(bool(body.inviteClient)); }
      if (body.writeCalendarName !== undefined) { sets.push("write_calendar_name = ?"); args.push(str(body.writeCalendarName, 80)); }
      if (!sets.length) return bad(ERR.VALIDATION_ERROR, "nothing to change");
      sets.push("updated_at = ?"); args.push(now);
      await db.prepare("UPDATE google_connections SET " + sets.join(", ") + " WHERE owner_id = ?").bind(...args, G.OWNER_ID).run();
      // A change of which calendars mean "busy" invalidates the mirror.
      await db.prepare("DELETE FROM booking_blocks WHERE source = 'GOOGLE'").run();
      return ok({ google: G.publicConnection(await G.getConnection(db), env) });
    }
    if (path === "/api/booking/google/disconnect" && method === "POST") {
      return ok(await G.disconnect(db, env));
    }
    if (path === "/api/booking/google/reconcile" && method === "POST") {
      return ok(await G.reconcile(db, env));
    }
    if (path === "/api/booking/google/drain" && method === "POST") {
      return ok(await G.drainOutbox(db, env, { limit: 25 }));
    }

    return null; // not a booking route
  } catch (e) {
    return fromError(e);
  }
}

async function setServiceLocations(db, serviceId, ids) {
  const list = (Array.isArray(ids) ? ids : []).slice(0, 50).map((x) => String(x).slice(0, 64));
  const stmts = [db.prepare("DELETE FROM booking_service_locations WHERE service_id = ?").bind(serviceId)];
  for (const l of list) stmts.push(db.prepare("INSERT INTO booking_service_locations (service_id, location_id) VALUES (?, ?)").bind(serviceId, l));
  await db.batch(stmts);
}

function htmlClose(cs, en) {
  const body = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>tanmay</title><style>body{font-family:system-ui,sans-serif;background:#1C1C1A;color:#F4F0EB;display:flex;
min-height:100vh;align-items:center;justify-content:center;margin:0;padding:24px;text-align:center;line-height:1.6}
p{max-width:28rem}</style><p>${cs}<br><span style="opacity:.6">${en}</span></p>
<script>try{window.setTimeout(function(){window.close()},2500)}catch(e){}</script>`;
  return new Response(body, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}

// ===========================================================================
// CLIENT
// ===========================================================================
/**
 * The client surface. `accountUserId` is derived by the Worker from the
 * Access identity and passed in; nothing in this function reads a client id
 * out of a request body or a query string, so there is no id to forge.
 */
export async function handleClient(request, env, url, accountUserId, ctx) {
  const db = env.DB;
  if (!db) return bad(ERR.VALIDATION_ERROR, "no database binding", 500);
  if (!accountUserId) return bad(ERR.NOT_AUTHORIZED);
  await ensureBookingSchema(db);

  const path = url.pathname;
  const method = request.method;
  const now = Date.now();

  try {
    const client = await R.clientByAccount(db, accountUserId);

    // ---- what this person can do at all -----------------------------------
    if (path === "/api/client/booking/context" && method === "GET") {
      if (!client) {
        return ok({ enabled: false, reason: "NO_CLIENT",
          message: { cs: "Rezervace pro tebe zatím nejsou otevřené. Domluv se s Tanmayem.",
                     en: "Booking is not open for you yet. Talk to Tanmay." } });
      }
      const [services, locations, summary] = await Promise.all([
        R.listServices(db, { activeOnly: true }),
        R.listLocations(db, { activeOnly: true }),
        E.creditSummary(db, client.id),
      ]);
      const visible = services.filter((s2) => s2.client_visible);
      const withLocations = [];
      for (const s2 of visible) {
        const locs = await R.locationsForService(db, s2.id);
        withLocations.push({
          id: s2.id, nameCs: s2.name_cs, nameEn: s2.name_en,
          descriptionCs: s2.description_cs, descriptionEn: s2.description_en,
          durationMin: s2.duration_min, creditUnits: s2.credit_cost_units,
          priceMinor: s2.price_minor, currency: s2.currency,
          confirmationMode: s2.confirmation_mode,
          cancelBeforeMin: s2.cancel_before_min, minNoticeMin: s2.min_notice_min,
          bookingHorizonDays: s2.booking_horizon_days,
          lateCancelRefunds: !!s2.late_cancel_refunds,
          locations: locs.map((l) => ({ id: l.id, type: l.type, nameCs: l.name_cs, nameEn: l.name_en,
            timezone: l.timezone, onlineMode: l.online_mode })),
        });
      }
      // A service the client has no credit for and cannot pay for outside a
      // package is not offered — an empty calendar explains nothing.
      const bookable = withLocations.filter((s2) => summary.balance.available >= (s2.creditUnits || 0) || s2.priceMinor > 0);
      return ok({
        enabled: bookable.length > 0,
        reason: bookable.length ? null : (summary.balance.available > 0 ? "NO_SERVICE" : "NO_CREDIT"),
        timezone: client.timezone || "Europe/Prague",
        services: bookable,
        credits: {
          available: summary.balance.available, reserved: summary.balance.reserved,
          consumed: summary.balance.consumed,
          packages: summary.packages
            .filter((p) => p.balance.available > 0 || p.balance.reserved > 0)
            .map((p) => ({ id: p.id, name: p.name_snapshot, available: p.balance.available,
              reserved: p.balance.reserved, expiresAt: p.expires_at })),
        },
        locationsCount: locations.length,
      });
    }

    if (!client) return bad(ERR.NOT_AUTHORIZED, "no booking client");

    // ---- slots ------------------------------------------------------------
    if (path === "/api/client/booking/slots" && method === "GET") {
      const gate = await R.rateLimit(db, "slots:" + accountUserId, 120, 60000);
      if (!gate.ok) return bad(ERR.RATE_LIMITED);
      const serviceId = str(url.searchParams.get("serviceId"), 64);
      const locationId = url.searchParams.get("locationId") ? str(url.searchParams.get("locationId"), 64) : null;
      if (!serviceId) return bad(ERR.VALIDATION_ERROR, "serviceId");
      const service = await R.getService(db, serviceId);
      if (!service || !service.active || !service.client_visible) return bad(ERR.NOT_FOUND);
      const fromDate = isDateISO(url.searchParams.get("from")) ? url.searchParams.get("from") : null;
      const days = Math.min(Math.max(1, Number(url.searchParams.get("days")) || 14), 31);
      // Which days are on offer is a question about the coach's calendar, so
      // it is answered in the coach's zone. The client's own zone belongs to
      // how the times are DISPLAYED, which the browser does from the instant.
      const tz = "Europe/Prague";
      const base = fromDate || localDateISO(now, tz);
      const busy = await googleBusy(db, env,
        startOfLocalDay(base, tz), endOfLocalDay(shiftDateISO(base, days), tz), false);
      // A booking may be excluded from the busy set only if it belongs to the
      // person asking. Trusting the id alone would let anyone who guessed one
      // see somebody else's time offered as free — unlikely with random ids,
      // but "unlikely" is not the standard the rest of this file holds to.
      let vynech = null;
      const chce = url.searchParams.get("reschedule") ? str(url.searchParams.get("reschedule"), 64) : null;
      if (chce) {
        const moje = await R.getBooking(db, chce);
        if (moje && moje.client_id === client.id) vynech = chce;
      }
      const av = await E.availability(db, {
        serviceId, locationId, now, fromDate: base, days,
        excludeBookingId: vynech, googleBusy: busy.windows,
      });
      return ok({
        timezone: av.timezone, from: av.from, to: av.to,
        days: av.days.map((d) => ({ date: d.date, slots: d.slots.map((s2) => ({ startsAt: s2.start, endsAt: s2.end })) })),
        googleChecked: !!busy.connected,
      });
    }

    // ---- my bookings ------------------------------------------------------
    if (path === "/api/client/bookings" && method === "GET") {
      const list = await R.bookingsForClient(db, client.id, { desc: true, limit: 100 });
      const upcoming = [], past = [];
      for (const b of list) {
        const v = await bookingView(db, b, {});
        (Number(b.starts_at_utc) >= now && (b.status === BOOKING_STATUS.CONFIRMED || b.status === BOOKING_STATUS.REQUESTED)
          ? upcoming : past).push(v);
      }
      upcoming.sort((a, b) => a.startsAt - b.startsAt);
      return ok({ upcoming, past: past.slice(0, 50) });
    }

    if (path === "/api/client/bookings" && method === "POST") {
      const gate = await R.rateLimit(db, "book:" + accountUserId, 20, 60000);
      if (!gate.ok) return bad(ERR.RATE_LIMITED);
      const { body, invalid, tooBig } = await readBody(request);
      if (tooBig) return bad(ERR.VALIDATION_ERROR, "body too large", 413);
      if (invalid) return bad(ERR.VALIDATION_ERROR, "json");
      const key = str(request.headers.get("idempotency-key") || body.idempotencyKey, 120);
      const seen = await R.recallIdempotent(db, key, "client:create:" + accountUserId);
      if (seen) return ok(seen);
      const startsAt = Number(body.startsAt);
      if (!Number.isFinite(startsAt)) return bad(ERR.VALIDATION_ERROR, "startsAt");
      // The last check before committing is live, and if Google cannot answer
      // nothing is booked.
      const fresh = await googleBusy(db, env, startsAt - 6 * 3600000, startsAt + 6 * 3600000, true);
      const b = await E.createBooking(db, {
        clientId: client.id, serviceId: str(body.serviceId, 64),
        locationId: body.locationId ? str(body.locationId, 64) : null,
        startsAt, now, actor: ACTOR.CLIENT, actorId: accountUserId,
        clientNote: str(body.note, 1000), googleBusy: fresh.windows,
      });
      const result = { booking: await bookingView(db, b, {}) };
      await R.rememberIdempotent(db, key, "client:create:" + accountUserId, result);
      drainSoon(ctx, db, env);
      return ok(result);
    }

    const mMine = path.match(/^\/api\/client\/bookings\/([A-Za-z0-9_-]{1,64})(\/[a-z-]+)?$/);
    if (mMine) {
      const id = mMine[1];
      const action = (mMine[2] || "").replace("/", "");
      const b = await R.getBooking(db, id);
      // Ownership is checked before anything at all is said about the row —
      // including whether it exists.
      if (!b || b.client_id !== client.id) return bad(ERR.NOT_AUTHORIZED);

      if (!action && method === "GET") return ok({ booking: await bookingView(db, b, {}) });

      if (action === "reschedule" && method === "POST") {
        const gate = await R.rateLimit(db, "move:" + accountUserId, 20, 60000);
        if (!gate.ok) return bad(ERR.RATE_LIMITED);
        const { body, invalid } = await readBody(request);
        if (invalid) return bad(ERR.VALIDATION_ERROR, "json");
        const startsAt = Number(body.startsAt);
        if (!Number.isFinite(startsAt)) return bad(ERR.VALIDATION_ERROR, "startsAt");
        const fresh = await googleBusy(db, env, startsAt - 6 * 3600000, startsAt + 6 * 3600000, true);
        const after = await E.rescheduleBooking(db, id, {
          startsAt, locationId: body.locationId ? str(body.locationId, 64) : undefined,
          now, actor: ACTOR.CLIENT, actorId: accountUserId, googleBusy: fresh.windows,
        });
        drainSoon(ctx, db, env);
        return ok({ booking: await bookingView(db, after, {}) });
      }

      if (action === "cancel-preview" && method === "GET") {
        return ok({ preview: await E.cancelPreview(db, id, { now, byCoach: false }) });
      }

      if (action === "cancel" && method === "POST") {
        const gate = await R.rateLimit(db, "cancel:" + accountUserId, 20, 60000);
        if (!gate.ok) return bad(ERR.RATE_LIMITED);
        const { body, invalid } = await readBody(request);
        if (invalid) return bad(ERR.VALIDATION_ERROR, "json");
        const after = await E.transitionBooking(db, id, "cancel", {
          now, actor: ACTOR.CLIENT, actorId: accountUserId, reason: str(body.reason, 300),
        });
        drainSoon(ctx, db, env);
        return ok({ booking: await bookingView(db, after, {}),
          credits: (await E.creditSummary(db, client.id)).balance });
      }
      return methodNotAllowed();
    }

    if (path === "/api/client/credits" && method === "GET") {
      const summary = await E.creditSummary(db, client.id, { withEntries: true, limit: 60 });
      return ok({
        balance: { available: summary.balance.available, reserved: summary.balance.reserved,
          consumed: summary.balance.consumed, purchased: summary.balance.purchased },
        packages: summary.packages.map((p) => ({
          id: p.id, name: p.name_snapshot, purchased: p.purchased_units,
          available: p.balance.available, reserved: p.balance.reserved, consumed: p.balance.consumed,
          expiresAt: p.expires_at, status: p.status })),
        // The client sees their own movements, with the reason the coach wrote
        // for them — never an internal note and never another person's row.
        entries: (summary.entries || []).map((e) => ({
          at: e.created_at, kind: e.kind, units: e.units, reason: e.reason || "", bookingId: e.booking_id || null })),
      });
    }

    return null;
  } catch (e) {
    return fromError(e);
  }
}

// ===========================================================================
// The scheduled tick: drain what Google owes, and expire what has run out.
// ===========================================================================
export async function bookingCron(env) {
  const db = env.KLIENT_DB || env.DB;
  if (!db) return { skipped: "no db" };
  await ensureBookingSchema(db);
  const now = Date.now();
  const out = {};

  try { out.google = await G.drainOutbox(db, env, { limit: 25 }); } catch (e) { out.google = { error: String(e.code || "error") }; }

  // Credit that has run out of validity becomes an EXPIRY entry, once.
  try {
    const packs = (await db.prepare("SELECT * FROM client_packages WHERE expires_at IS NOT NULL AND expires_at <= ? AND status = 'ACTIVE'")
      .bind(now).all()).results || [];
    let expired = 0;
    for (const p of packs) {
      const entries = (await db.prepare("SELECT * FROM credit_ledger WHERE client_package_id = ?").bind(p.id).all()).results || [];
      const bal = balanceOf(entries);
      const stmts = [db.prepare("UPDATE client_packages SET status = 'EXPIRED', updated_at = ? WHERE id = ?").bind(now, p.id)];
      if (bal.available > 0) {
        stmts.push(R.stInsertLedger(db, {
          id: R.newId("cl"), client_id: p.client_id, client_package_id: p.id, booking_id: null,
          kind: LEDGER_KIND.EXPIRY, units: -bal.available, reason: "Platnost balíčku skončila",
          created_by: ACTOR.SYSTEM, created_at: now, idempotency_key: p.id + ":expiry",
        }));
      }
      try { await db.batch(stmts); expired++; } catch (e) { /* already expired */ }
    }
    out.expired = expired;
  } catch (e) { out.expired = { error: "expiry" }; }

  // Idempotency keys stop being useful after a day.
  try { await db.prepare("DELETE FROM booking_idempotency WHERE created_at < ?").bind(now - 86400000).run(); } catch (e) {}
  return out;
}
