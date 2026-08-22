// Booking · Google Calendar, from the server.
//
// The browser-side connection that Practice uses is a good fit for what it
// does: a person is sitting there, they press Sync, a token lives for an hour
// in memory and never touches storage. Booking cannot work that way. A client
// reserves a time from their own phone, at night, while the coach's computer
// is off — so the token has to outlive the browser, which means a refresh
// token, which means a client secret, which means the server.
//
// What this file is allowed to know about the coach's calendar is deliberately
// small:
//
//   calendar.app.created              make one secondary calendar and manage
//                                     the events this app put there
//   calendar.freebusy                 "View your availability in your
//                                     calendars" — windows, never titles
//   calendar.calendarlist.readonly    the names of the calendars, so the coach
//                                     can choose which ones mean "busy"
//
// There is no scope here that can read an event on the main calendar. Reading
// event titles back into the Practice day stays exactly where it was: a
// separate, explicit, browser-side opt-in, and nothing in booking depends on
// it.

import { SYNC_STATUS, OUTBOX_ACTION, OUTBOX_STATUS, CALENDAR_TITLE_MODE, BOOKING_STATUS, BOOKING_EVENT, ACTOR } from "../../src/booking/types.js";
import { rfc3339 } from "../../src/booking/time.js";
import * as R from "./repo.js";

export const AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
export const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
export const REVOKE_ENDPOINT = "https://oauth2.googleapis.com/revoke";
export const CAL_API = "https://www.googleapis.com/calendar/v3";

export const BOOKING_SCOPES = [
  "https://www.googleapis.com/auth/calendar.app.created",
  "https://www.googleapis.com/auth/calendar.freebusy",
  "https://www.googleapis.com/auth/calendar.calendarlist.readonly",
];

export const OWNER_ID = "primary";
const STATE_TTL_MS = 10 * 60 * 1000;

export class GoogleError extends Error {
  constructor(code, status, detail) {
    super(code);
    this.name = "GoogleError";
    this.code = code;
    this.status = status || 0;
    this.detail = detail || "";
  }
}

// ---- Secrets ---------------------------------------------------------------
/**
 * What must be configured before any of this can run, checked once and
 * reported as a list rather than as a stack trace at the worst moment.
 */
export function missingSecrets(env) {
  const need = ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REDIRECT_URI", "GOOGLE_TOKEN_ENCRYPTION_KEY"];
  return need.filter((k) => !String((env && env[k]) || "").trim());
}
export const googleConfigured = (env) => missingSecrets(env).length === 0;

// ---- Token storage ---------------------------------------------------------
// The refresh token is the one long-lived secret in the whole system. It is
// encrypted with AES-GCM before it reaches D1, the key is a Worker secret, and
// the plaintext exists only inside this module for the length of one request.
// It is never logged, never returned by an endpoint, never put in a backup and
// never written to source.

const b64 = {
  enc: (buf) => {
    const b = new Uint8Array(buf);
    let s = "";
    for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
    return btoa(s);
  },
  dec: (s) => {
    const bin = atob(String(s || ""));
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  },
};
const b64url = (buf) => b64.enc(buf).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

async function aesKey(env) {
  // A misconfigured secret must say so plainly. Left to itself, `atob` throws
  // a decoding exception that reads like a bug in the code rather than a
  // wrong value in the deployment.
  let raw;
  try { raw = b64.dec(env.GOOGLE_TOKEN_ENCRYPTION_KEY); }
  catch (e) { throw new GoogleError("BAD_ENCRYPTION_KEY", 500, "expected 32 bytes, base64 encoded"); }
  if (raw.length !== 32) throw new GoogleError("BAD_ENCRYPTION_KEY", 500, "expected 32 bytes, base64 encoded");
  return crypto.subtle.importKey("raw", raw, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}

export async function sealToken(env, plaintext) {
  const key = await aesKey(env);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(String(plaintext)));
  return { ciphertext: b64.enc(ct), iv: b64.enc(iv), version: 1 };
}

export async function openToken(env, sealed) {
  if (!sealed || !sealed.ciphertext) return "";
  const key = await aesKey(env);
  const pt = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: b64.dec(sealed.iv) }, key, b64.dec(sealed.ciphertext));
  return new TextDecoder().decode(pt);
}

// ---- The connection row ----------------------------------------------------
export async function getConnection(db) {
  return db.prepare("SELECT * FROM google_connections WHERE owner_id = ?").bind(OWNER_ID).first();
}

/** What the interface may see. Never the token, never the secret. */
export function publicConnection(row, env) {
  const missing = missingSecrets(env);
  if (!row || row.status !== "CONNECTED") {
    return { connected: false, configured: missing.length === 0, missingSecrets: missing,
      status: (row && row.status) || "DISCONNECTED", lastError: (row && row.last_error) || "" };
  }
  let busy = [];
  try { busy = JSON.parse(row.busy_calendar_ids_json || "[]"); } catch (e) { busy = []; }
  return {
    connected: true, configured: true, missingSecrets: [],
    account: row.google_account || "",
    scopes: String(row.granted_scopes || "").split(/\s+/).filter(Boolean),
    writeCalendarId: row.write_calendar_id || "",
    writeCalendarName: row.write_calendar_name || "",
    busyCalendarIds: busy,
    titleMode: row.title_mode || CALENDAR_TITLE_MODE.FULL,
    inviteClient: !!row.invite_client,
    lastSyncAt: row.last_sync_at || null,
    lastError: row.last_error || "",
    status: row.status,
  };
}

// ---- The authorisation flow ------------------------------------------------
async function sha256(s) {
  return crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
}
const randomToken = () => b64url(crypto.getRandomValues(new Uint8Array(32)));

/**
 * Start the flow. The PKCE verifier stays in the database and never travels
 * through the browser; only its hash goes to Google, and only the opaque
 * state value comes back.
 */
export async function beginAuth(db, env, opts = {}) {
  const missing = missingSecrets(env);
  if (missing.length) throw new GoogleError("NOT_CONFIGURED", 500, missing.join(", "));
  const state = randomToken();
  const verifier = randomToken();
  const challenge = b64url(await sha256(verifier));
  const now = Date.now();

  await db.prepare("DELETE FROM google_oauth_states WHERE expires_at < ?").bind(now).run();
  await db.prepare(`INSERT INTO google_oauth_states (state, code_verifier, owner_id, redirect_to, created_at, expires_at)
                    VALUES (?,?,?,?,?,?)`)
    .bind(state, verifier, OWNER_ID, String(opts.redirectTo || "").slice(0, 300), now, now + STATE_TTL_MS).run();

  const q = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: env.GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: BOOKING_SCOPES.join(" "),
    access_type: "offline",
    include_granted_scopes: "true",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
    // Without this a second authorisation returns no refresh token at all,
    // and the connection silently becomes an hour long.
    prompt: "consent",
  });
  return { url: AUTH_ENDPOINT + "?" + q.toString(), state };
}

async function tokenRequest(env, body) {
  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body).toString(),
  });
  const text = await res.text();
  let json = {};
  try { json = text ? JSON.parse(text) : {}; } catch (e) { json = {}; }
  if (!res.ok) throw new GoogleError(json.error || "TOKEN_FAILED", res.status, json.error_description || "");
  return json;
}

/** Finish the flow: exchange the code, keep the refresh token sealed. */
export async function completeAuth(db, env, params) {
  const state = String(params.state || "");
  const code = String(params.code || "");
  if (!state || !code) throw new GoogleError("BAD_CALLBACK", 400);
  const row = await db.prepare("SELECT * FROM google_oauth_states WHERE state = ?").bind(state).first();
  // Single use, whatever happens next.
  await db.prepare("DELETE FROM google_oauth_states WHERE state = ?").bind(state).run();
  if (!row) throw new GoogleError("BAD_STATE", 400);
  if (Number(row.expires_at) < Date.now()) throw new GoogleError("STATE_EXPIRED", 400);

  const tok = await tokenRequest(env, {
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    redirect_uri: env.GOOGLE_REDIRECT_URI,
    grant_type: "authorization_code",
    code,
    code_verifier: row.code_verifier,
  });
  if (!tok.refresh_token) throw new GoogleError("NO_REFRESH_TOKEN", 400);

  const sealed = await sealToken(env, tok.refresh_token);
  const now = Date.now();
  const existing = await getConnection(db);
  if (existing) {
    await db.prepare(`UPDATE google_connections SET token_ciphertext = ?, token_iv = ?, token_version = ?,
                        granted_scopes = ?, status = 'CONNECTED', last_error = '', updated_at = ?
                      WHERE owner_id = ?`)
      .bind(sealed.ciphertext, sealed.iv, sealed.version, String(tok.scope || ""), now, OWNER_ID).run();
  } else {
    await db.prepare(`INSERT INTO google_connections
        (id, owner_id, google_account, token_ciphertext, token_iv, token_version, granted_scopes,
         write_calendar_id, write_calendar_name, busy_calendar_ids_json, title_mode, invite_client,
         status, last_error, created_at, updated_at)
        VALUES (?,?,'',?,?,?,?, '', '', '[]', 'FULL', 0, 'CONNECTED', '', ?, ?)`)
      .bind(R.newId("gc"), OWNER_ID, sealed.ciphertext, sealed.iv, sealed.version, String(tok.scope || ""), now, now).run();
  }
  return { ok: true, scopes: String(tok.scope || "").split(/\s+/).filter(Boolean) };
}

// One access token per isolate per hour. Not a cache of anything secret at
// rest — it lives in memory and dies with the isolate, exactly like the
// browser token it replaces.
const accessCache = new Map();

export async function accessToken(db, env, opts = {}) {
  const hit = accessCache.get(OWNER_ID);
  if (!opts.force && hit && hit.exp > Date.now() + 60000) return hit.token;
  const row = await getConnection(db);
  if (!row || row.status !== "CONNECTED") throw new GoogleError("NOT_CONNECTED", 401);
  const refresh = await openToken(env, { ciphertext: row.token_ciphertext, iv: row.token_iv });
  if (!refresh) throw new GoogleError("NOT_CONNECTED", 401);
  let tok;
  try {
    tok = await tokenRequest(env, {
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: refresh,
    });
  } catch (e) {
    // A revoked grant is not a transient failure. Say so once, clearly, and
    // keep every booking exactly where it is.
    if (e.status === 400 || e.status === 401) {
      await db.prepare("UPDATE google_connections SET status = 'REVOKED', last_error = 'grant revoked', updated_at = ? WHERE owner_id = ?")
        .bind(Date.now(), OWNER_ID).run();
    }
    throw e;
  }
  const token = tok.access_token;
  accessCache.set(OWNER_ID, { token, exp: Date.now() + (Number(tok.expires_in) || 3600) * 1000 });
  return token;
}

/** For tests, and for a disconnect that must not leave a token in memory. */
export const forgetAccessToken = () => accessCache.delete(OWNER_ID);

// ---- Calling Google --------------------------------------------------------
export async function calendarRequest(db, env, path, opts = {}, attempt = 0) {
  const token = await accessToken(db, env, { force: attempt > 0 && opts._retriedAuth });
  const res = await fetch(CAL_API + path, {
    method: opts.method || "GET",
    headers: Object.assign({ Authorization: "Bearer " + token }, opts.body ? { "Content-Type": "application/json" } : {}),
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (res.status === 204) return {};
  const text = await res.text();
  let json = {};
  try { json = text ? JSON.parse(text) : {}; } catch (e) { json = {}; }
  if (res.ok) return json;

  const reason = (((json.error || {}).errors || [])[0] || {}).reason || json.error || "";
  const err = new GoogleError(String(reason || "http-" + res.status), res.status, json.error_description || "");
  // 401 once: the access token may simply have aged out mid-flight.
  if (res.status === 401 && attempt === 0) {
    forgetAccessToken();
    return calendarRequest(db, env, path, { ...opts, _retriedAuth: true }, 1);
  }
  const retryable = res.status === 429 || res.status >= 500 || (res.status === 403 && /rateLimit|userRateLimit/i.test(String(reason)));
  if (retryable && attempt < 3) {
    const wait = Math.min(Math.pow(2, attempt) * 500 + Math.floor(Math.random() * 400), 8000);
    await new Promise((r) => setTimeout(r, wait));
    return calendarRequest(db, env, path, opts, attempt + 1);
  }
  throw err;
}

/** The calendars the coach could mark as busy. Names only, no events. */
export async function listCalendars(db, env) {
  const out = await calendarRequest(db, env, "/users/me/calendarList?minAccessRole=freeBusyReader&maxResults=250");
  return (out.items || []).map((c) => ({
    id: c.id, summary: c.summary || c.id, primary: !!c.primary, accessRole: c.accessRole || "",
  }));
}

/**
 * Busy windows only. The response carries start and end and nothing else, so
 * there is no title to leak into the client application even by accident.
 */
export async function freeBusy(db, env, fromMs, toMs, calendarIds) {
  const ids = (calendarIds || []).filter(Boolean).slice(0, 50);
  if (!ids.length) return [];
  const out = await calendarRequest(db, env, "/freeBusy", {
    method: "POST",
    body: {
      timeMin: rfc3339(fromMs), timeMax: rfc3339(toMs),
      calendarExpansionMax: 50,
      items: ids.map((id) => ({ id })),
    },
  });
  const windows = [];
  for (const id of Object.keys(out.calendars || {})) {
    for (const b of (out.calendars[id].busy || [])) {
      windows.push({ s: Date.parse(b.start), e: Date.parse(b.end) });
    }
  }
  return windows.filter((w) => Number.isFinite(w.s) && Number.isFinite(w.e) && w.e > w.s);
}

/**
 * Busy windows for a range, with a short cache in `booking_blocks` for
 * listing and a live call for committing.
 *
 * `mustBeFresh` is the whole difference between showing a slot and taking
 * one: listing may use a window that is a minute old, committing may not. If
 * Google cannot answer at commit time, the caller is told so and nothing is
 * booked blind.
 */
export async function busyForRange(db, env, fromMs, toMs, opts = {}) {
  const row = await getConnection(db);
  if (!row || row.status !== "CONNECTED") return { windows: [], live: false, connected: false };
  let ids = [];
  try { ids = JSON.parse(row.busy_calendar_ids_json || "[]"); } catch (e) { ids = []; }
  if (!ids.length) return { windows: [], live: true, connected: true };

  const maxAge = Math.max(0, Number(opts.maxAgeMs) || 60000);
  if (!opts.mustBeFresh) {
    const cached = await db.prepare(
      `SELECT starts_at_utc, ends_at_utc, fetched_at FROM booking_blocks
        WHERE source = 'GOOGLE' AND ends_at_utc > ? AND starts_at_utc < ?`)
      .bind(fromMs, toMs).all();
    const list = cached.results || [];
    const freshEnough = list.length && list.every((b) => Date.now() - Number(b.fetched_at || 0) < maxAge);
    if (freshEnough) {
      return { windows: list.map((b) => ({ s: Number(b.starts_at_utc), e: Number(b.ends_at_utc) })), live: false, connected: true };
    }
  }

  const windows = await freeBusy(db, env, fromMs, toMs, ids);
  // Mirror them so a later listing is cheap. Only the mirrored range is
  // replaced; a window outside it belongs to another query and stays.
  const now = Date.now();
  const stmts = [db.prepare("DELETE FROM booking_blocks WHERE source = 'GOOGLE' AND ends_at_utc > ? AND starts_at_utc < ?").bind(fromMs, toMs)];
  for (const w of windows) {
    stmts.push(db.prepare(`INSERT INTO booking_blocks (id, starts_at_utc, ends_at_utc, source, google_calendar_id, note, fetched_at, created_at, updated_at)
                           VALUES (?,?,?,'GOOGLE','', '', ?, ?, ?)`)
      .bind(R.newId("blk"), w.s, w.e, now, now, now));
  }
  try { await db.batch(stmts); } catch (e) { /* the mirror is a convenience, never a truth */ }
  return { windows, live: true, connected: true };
}

// ---- The mirror ------------------------------------------------------------
/** One app-created calendar for confirmed sessions. Created once, then reused. */
export async function ensureBookingCalendar(db, env, name) {
  const row = await getConnection(db);
  if (!row) throw new GoogleError("NOT_CONNECTED", 401);
  if (row.write_calendar_id) {
    try {
      await calendarRequest(db, env, "/calendars/" + encodeURIComponent(row.write_calendar_id));
      return row.write_calendar_id;
    } catch (e) {
      if (e.status !== 404 && e.status !== 410) throw e;
      // The coach deleted it in Google. Make a new one, forget every mirror id
      // we held — they point at a calendar that no longer exists — and queue
      // the sessions that still lie ahead. Marking them PENDING without a job
      // left them waiting for ever, and PENDING is not ERROR, so they never
      // appeared in the list of things that needed attention either.
      const kdy = Date.now();
      const znovu = (await db.prepare(
        `SELECT id, version FROM bookings
          WHERE status IN ('REQUESTED','CONFIRMED') AND ends_at_utc > ?`).bind(kdy).all()).results || [];
      await db.batch([
        db.prepare("UPDATE google_connections SET write_calendar_id = '', updated_at = ? WHERE owner_id = ?").bind(kdy, OWNER_ID),
        db.prepare("UPDATE bookings SET google_event_id = NULL, google_calendar_id = NULL, sync_status = 'PENDING' WHERE google_calendar_id IS NOT NULL"),
        ...znovu.map((b) => R.stOutboxAgain(db, {
          id: R.newId("ob"), booking_id: b.id, action: OUTBOX_ACTION.CREATE,
          booking_version: Number(b.version), next_attempt_at: kdy, created_at: kdy,
        })),
      ]);
    }
  }
  const summary = String(name || row.write_calendar_name || "tanmay · sezení").slice(0, 80);
  const cal = await calendarRequest(db, env, "/calendars", {
    method: "POST",
    body: { summary, timeZone: "Europe/Prague",
      description: "Potvrzené rezervace z aplikace tanmay. Pravda je v aplikaci, tohle je její zrcadlo." },
  });
  await db.prepare("UPDATE google_connections SET write_calendar_id = ?, write_calendar_name = ?, updated_at = ? WHERE owner_id = ?")
    .bind(cal.id, summary, Date.now(), OWNER_ID).run();
  try {
    await calendarRequest(db, env, "/users/me/calendarList/" + encodeURIComponent(cal.id) + "?colorRgbFormat=true",
      { method: "PATCH", body: { backgroundColor: "#B87333", foregroundColor: "#F4F0EB", selected: true } });
  } catch (e) { /* colour is a courtesy */ }
  return cal.id;
}

/**
 * The event body.
 *
 * What goes in: when, where, and just enough of who to be useful. What never
 * goes in: the private coach note, the credit history, anything about health,
 * the client's profile. A calendar entry is not a client record.
 */
export function eventBodyFor(booking, ctx) {
  const generic = ctx.titleMode === CALENDAR_TITLE_MODE.GENERIC;
  const who = String(ctx.clientName || "").trim();
  const service = String(ctx.serviceName || "").trim();
  const summary = generic ? "Sezení" : ([who, service].filter(Boolean).join(" · ") || "Sezení");
  const body = {
    summary,
    description: generic ? "tanmay" : ([ctx.locationName, booking.client_note ? "Poznámka klienta: " + booking.client_note : ""]
      .filter(Boolean).join("\n") + "\n\ntanmay").trim(),
    location: generic ? "" : String(ctx.locationAddress || ctx.locationName || ""),
    status: booking.status === BOOKING_STATUS.CONFIRMED || booking.status === BOOKING_STATUS.REQUESTED
      ? "confirmed" : "cancelled",
    transparency: "opaque",
    reminders: { useDefault: true },
    start: { dateTime: rfc3339(Number(booking.starts_at_utc)), timeZone: booking.timezone || "Europe/Prague" },
    end: { dateTime: rfc3339(Number(booking.ends_at_utc)), timeZone: booking.timezone || "Europe/Prague" },
    extendedProperties: {
      private: {
        tmApp: "1",
        tmBookingId: String(booking.id),
        tmBookingVersion: String(booking.version),
        tmKind: "booking",
      },
    },
  };
  if (booking.meeting_url) body.description = (body.description + "\n" + booking.meeting_url).trim();
  if (ctx.inviteClient && ctx.clientEmail) body.attendees = [{ email: ctx.clientEmail }];
  return body;
}

const hashOf = (o) => {
  const s = JSON.stringify(o);
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  return h.toString(36);
};

/**
 * Do one outbox job.
 *
 * Idempotent by construction: the event id is derived from the booking id, so
 * a create that timed out after Google had in fact succeeded finds the event
 * already there and updates it instead of making a second one. There is no
 * path in this function that can produce a duplicate.
 */
export async function runOutboxJob(db, env, job) {
  const booking = await R.getBooking(db, job.booking_id);
  if (!booking) {
    await db.prepare("UPDATE calendar_outbox SET status = 'DONE', updated_at = ? WHERE id = ?").bind(Date.now(), job.id).run();
    return { skipped: "no booking" };
  }
  const conn = await getConnection(db);
  if (!conn || conn.status !== "CONNECTED") {
    await db.prepare("UPDATE calendar_outbox SET status = 'DONE', last_error = 'not connected', updated_at = ? WHERE id = ?")
      .bind(Date.now(), job.id).run();
    await db.prepare("UPDATE bookings SET sync_status = 'NONE' WHERE id = ?").bind(booking.id).run();
    return { skipped: "not connected" };
  }
  // A job for a version that has already been superseded is not worth an API
  // call — the newer job carries the newer truth.
  if (Number(job.booking_version) < Number(booking.version) && job.action !== OUTBOX_ACTION.CANCEL) {
    await db.prepare("UPDATE calendar_outbox SET status = 'DONE', last_error = 'superseded', updated_at = ? WHERE id = ?")
      .bind(Date.now(), job.id).run();
    return { skipped: "superseded" };
  }

  // Google wants ids in base32hex, 5 to 1024 characters. Deriving one from
  // the booking id rather than hashing keeps it collision-free and readable
  // in the calendar's own tooling if it ever has to be traced by hand.
  const gid = base32hex("bk" + booking.id);
  const now = Date.now();
  let body = null;

  try {
    // Making sure the calendar exists is itself a call to Google, so it
    // belongs inside the retry path. Left outside it, one bad afternoon at
    // Google threw straight past the outbox and the job was never even
    // marked as attempted.
    const calId = await ensureBookingCalendar(db, env);
    const base = "/calendars/" + encodeURIComponent(calId) + "/events/";
    const [client, service, location] = await Promise.all([
      R.getClient(db, booking.client_id),
      R.getService(db, booking.service_id),
      booking.location_id ? R.getLocation(db, booking.location_id) : Promise.resolve(null),
    ]);
    body = eventBodyFor(booking, {
      titleMode: conn.title_mode,
      clientName: client && client.name,
      clientEmail: client && client.email,
      inviteClient: !!conn.invite_client,
      serviceName: service && (service.name_cs || service.name_en),
      locationName: location && (location.name_cs || location.name_en),
      locationAddress: location && location.address,
    });

    if (job.action === OUTBOX_ACTION.CANCEL) {
      try {
        await calendarRequest(db, env, base + gid, { method: "PATCH", body: { status: "cancelled" } });
      } catch (e) {
        if (e.status !== 404 && e.status !== 410) throw e; // already gone is success
      }
    } else {
      // PUT on our own id: creates if absent, replaces if present, never twice.
      await calendarRequest(db, env, base + gid, { method: "PUT", body });
    }
    await db.batch([
      db.prepare("UPDATE calendar_outbox SET status = 'DONE', last_error = '', updated_at = ? WHERE id = ?").bind(now, job.id),
      db.prepare("UPDATE bookings SET sync_status = ?, google_calendar_id = ?, google_event_id = ? WHERE id = ?")
        .bind(SYNC_STATUS.SYNCED, calId, gid, booking.id),
      db.prepare("UPDATE google_connections SET last_sync_at = ?, last_error = '', updated_at = ? WHERE owner_id = ?")
        .bind(now, now, OWNER_ID),
      R.stInsertEvent(db, { id: R.newId("ev"), booking_id: booking.id, type: BOOKING_EVENT.SYNC_OK,
        actor_type: ACTOR.SYSTEM, created_at: now, payload: { action: job.action, hash: hashOf(body) } }),
    ]);
    return { ok: true };
  } catch (e) {
    const attempts = Number(job.attempts) + 1;
    const giveUp = attempts >= 6;
    const backoff = Math.min(Math.pow(2, attempts) * 30000, 3600000); // 1 min → 1 hour
    await db.batch([
      db.prepare(`UPDATE calendar_outbox SET attempts = ?, next_attempt_at = ?, status = ?, last_error = ?, updated_at = ? WHERE id = ?`)
        .bind(attempts, now + backoff, giveUp ? OUTBOX_STATUS.FAILED : OUTBOX_STATUS.PENDING,
              String(e.code || e.message || "error").slice(0, 200), now, job.id),
      db.prepare("UPDATE bookings SET sync_status = ? WHERE id = ?")
        .bind(giveUp ? SYNC_STATUS.ERROR : SYNC_STATUS.PENDING, booking.id),
      db.prepare("UPDATE google_connections SET last_error = ?, updated_at = ? WHERE owner_id = ?")
        .bind(String(e.code || "error").slice(0, 200), now, OWNER_ID),
    ]);
    if (giveUp) {
      await db.prepare(`INSERT INTO booking_events (id, booking_id, type, actor_type, actor_id, payload_json, created_at)
                        VALUES (?,?,?,?,'',?,?)`)
        .bind(R.newId("ev"), booking.id, BOOKING_EVENT.SYNC_ERROR, ACTOR.SYSTEM,
              JSON.stringify({ action: job.action, error: String(e.code || "error") }), now).run();
    }
    return { ok: false, error: String(e.code || "error") };
  }
}

/**
 * Empty the outbox as far as it will go.
 *
 * Called from the scheduled handler and, opportunistically, after a booking
 * changes — so a session made at three in the morning reaches the calendar
 * without waiting for a cron tick, and a cron tick catches whatever the
 * request could not finish.
 */
export async function drainOutbox(db, env, opts = {}) {
  if (!googleConfigured(env)) return { drained: 0, skipped: "not configured" };
  const conn = await getConnection(db);
  if (!conn || conn.status !== "CONNECTED") return { drained: 0, skipped: "not connected" };
  const limit = Math.max(1, Math.min(Number(opts.limit) || 10, 50));
  const jobs = await R.dueOutbox(db, Date.now(), limit);
  let done = 0, failed = 0;
  for (const job of jobs) {
    // One job that cannot be written down must not stop the next one from
    // trying. Whatever escapes here is counted and left in the queue.
    let r;
    try { r = await runOutboxJob(db, env, job); } catch (e) { r = { ok: false, error: String(e.code || "error") }; }
    if (r.ok) done++; else if (r.error) failed++;
  }
  return { drained: done, failed, considered: jobs.length };
}

/** Ask Google again about everything we think we mirrored. */
export async function reconcile(db, env) {
  const conn = await getConnection(db);
  if (!conn || conn.status !== "CONNECTED" || !conn.write_calendar_id) return { checked: 0 };
  const now = Date.now();
  const rows = (await db.prepare(
    `SELECT * FROM bookings WHERE starts_at_utc > ? AND status IN ('REQUESTED','CONFIRMED')`)
    .bind(now - 86400000).all()).results || [];
  let requeued = 0;
  for (const b of rows) {
    const gid = base32hex("bk" + b.id);
    let missing = false;
    try {
      const ev = await calendarRequest(db, env, "/calendars/" + encodeURIComponent(conn.write_calendar_id) + "/events/" + gid);
      if (!ev || ev.status === "cancelled") missing = true;
    } catch (e) {
      if (e.status === 404 || e.status === 410) missing = true; else throw e;
    }
    if (missing) {
      // The internal booking stays the authority. A mirror that somebody
      // removed in Google is recreated by this explicit reconcile and by
      // nothing else — an automatic resurrection would make the calendar
      // impossible to live with.
      await R.stOutboxAgain(db, { id: R.newId("ob"), booking_id: b.id, action: OUTBOX_ACTION.CREATE,
        booking_version: Number(b.version), next_attempt_at: now, created_at: now }).run();
      requeued++;
    }
  }
  return { checked: rows.length, requeued };
}

/** Disconnect. Booking data is untouched; only the link to Google ends. */
export async function disconnect(db, env, opts = {}) {
  const row = await getConnection(db);
  if (!row) return { ok: true };
  let revoked = false;
  if (opts.revoke !== false) {
    try {
      const refresh = await openToken(env, { ciphertext: row.token_ciphertext, iv: row.token_iv });
      if (refresh) {
        const res = await fetch(REVOKE_ENDPOINT, {
          method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ token: refresh }).toString(),
        });
        revoked = res.ok;
      }
    } catch (e) { revoked = false; }
  }
  forgetAccessToken();
  const now = Date.now();
  await db.batch([
    db.prepare(`UPDATE google_connections SET token_ciphertext = '', token_iv = '', status = 'DISCONNECTED',
                  last_error = '', updated_at = ? WHERE owner_id = ?`).bind(now, OWNER_ID),
    db.prepare("UPDATE bookings SET sync_status = 'NONE' WHERE sync_status IN ('PENDING','ERROR')"),
    db.prepare("UPDATE calendar_outbox SET status = 'DONE', last_error = 'disconnected', updated_at = ? WHERE status = 'PENDING'").bind(now),
    db.prepare("DELETE FROM booking_blocks WHERE source = 'GOOGLE'"),
  ]);
  return { ok: true, revoked };
}

// Google's own alphabet for event ids: 0–9 and a–v, at least five characters.
export function base32hex(s) {
  const bytes = new TextEncoder().encode(String(s));
  const A = "0123456789abcdefghijklmnopqrstuv";
  let bits = 0, val = 0, out = "";
  for (let i = 0; i < bytes.length; i++) {
    val = (val << 8) | bytes[i]; bits += 8;
    while (bits >= 5) { out += A[(val >>> (bits - 5)) & 31]; bits -= 5; }
  }
  if (bits > 0) out += A[(val << (5 - bits)) & 31];
  return out.length >= 5 ? out.slice(0, 1024) : (out + "00000").slice(0, 5);
}
