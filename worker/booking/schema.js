// Booking · the database, and how it is allowed to change.
//
// D1 has no migration tool that runs by itself here, and the rest of this
// Worker has been creating tables with `CREATE TABLE IF NOT EXISTS` on every
// request. That works until the day a column has to change, and then there is
// no record of what any deployment actually has. So the booking domain brings
// its own: a numbered list of steps, a table that remembers which ones ran,
// and a runner that is safe to call on every request and does nothing after
// the first.
//
// Rules that hold for every step:
//   · a migration is idempotent — running it twice changes nothing
//   · a migration never drops a column or a table that holds real data
//   · STRICT tables, so a typo cannot quietly become a string in an integer
//   · every foreign key that the architecture genuinely enforces is declared

import { BOOKING_SCHEMA_VERSION } from "../../src/booking/types.js";

export const SCHEMA_VERSION = BOOKING_SCHEMA_VERSION;

// ---- Step 1 · the whole booking domain ------------------------------------
const M1 = [
  // Clients. One row per person the booking domain knows about. It is the
  // bridge between the coach's card (`klProfiles.id`, kept as it was) and the
  // account in the client application (the id derived from the Access
  // address). Either side may be missing: a card can exist before an account,
  // and an account can exist before a card.
  `CREATE TABLE IF NOT EXISTS booking_clients (
     id               TEXT PRIMARY KEY,
     account_user_id  TEXT,
     coach_profile_id TEXT,
     name             TEXT NOT NULL DEFAULT '',
     email            TEXT NOT NULL DEFAULT '',
     timezone         TEXT NOT NULL DEFAULT 'Europe/Prague',
     active           INTEGER NOT NULL DEFAULT 1,
     created_at       INTEGER NOT NULL,
     updated_at       INTEGER NOT NULL
   ) STRICT`,
  `CREATE UNIQUE INDEX IF NOT EXISTS ix_bc_account ON booking_clients(account_user_id) WHERE account_user_id IS NOT NULL`,
  `CREATE UNIQUE INDEX IF NOT EXISTS ix_bc_profile ON booking_clients(coach_profile_id) WHERE coach_profile_id IS NOT NULL`,
  `CREATE INDEX IF NOT EXISTS ix_bc_email ON booking_clients(email)`,

  // Services. What may be booked, and every rule that governs it. Nothing
  // here is hard-coded in the application: the offer is Tanmay's to write.
  `CREATE TABLE IF NOT EXISTS booking_services (
     id                   TEXT PRIMARY KEY,
     name_cs              TEXT NOT NULL DEFAULT '',
     name_en              TEXT NOT NULL DEFAULT '',
     description_cs       TEXT NOT NULL DEFAULT '',
     description_en       TEXT NOT NULL DEFAULT '',
     duration_min         INTEGER NOT NULL DEFAULT 60,
     credit_cost_units    INTEGER NOT NULL DEFAULT 1,
     price_minor          INTEGER NOT NULL DEFAULT 0,
     currency             TEXT NOT NULL DEFAULT 'CZK',
     min_notice_min       INTEGER NOT NULL DEFAULT 720,
     booking_horizon_days INTEGER NOT NULL DEFAULT 60,
     cancel_before_min    INTEGER NOT NULL DEFAULT 1440,
     buffer_before_min    INTEGER NOT NULL DEFAULT 0,
     buffer_after_min     INTEGER NOT NULL DEFAULT 0,
     slot_interval_min    INTEGER NOT NULL DEFAULT 30,
     confirmation_mode    TEXT NOT NULL DEFAULT 'REQUEST',
     daily_limit          INTEGER NOT NULL DEFAULT 0,
     weekly_limit         INTEGER NOT NULL DEFAULT 0,
     late_cancel_refunds  INTEGER NOT NULL DEFAULT 0,
     no_show_refunds      INTEGER NOT NULL DEFAULT 0,
     client_visible       INTEGER NOT NULL DEFAULT 1,
     active               INTEGER NOT NULL DEFAULT 1,
     sort_order           INTEGER NOT NULL DEFAULT 0,
     created_at           INTEGER NOT NULL,
     updated_at           INTEGER NOT NULL
   ) STRICT`,
  `CREATE INDEX IF NOT EXISTS ix_svc_active ON booking_services(active, sort_order)`,

  // Locations. A type may have several real places; a place carries its own
  // address, meeting point, instruction and travel time. Seeds stay empty
  // where there is no verified address — an invented one is worse than none.
  `CREATE TABLE IF NOT EXISTS booking_locations (
     id                TEXT PRIMARY KEY,
     type              TEXT NOT NULL,
     name_cs           TEXT NOT NULL DEFAULT '',
     name_en           TEXT NOT NULL DEFAULT '',
     address           TEXT NOT NULL DEFAULT '',
     map_url           TEXT NOT NULL DEFAULT '',
     instructions_cs   TEXT NOT NULL DEFAULT '',
     instructions_en   TEXT NOT NULL DEFAULT '',
     timezone          TEXT NOT NULL DEFAULT 'Europe/Prague',
     travel_group      TEXT NOT NULL DEFAULT '',
     buffer_before_min INTEGER NOT NULL DEFAULT 0,
     buffer_after_min  INTEGER NOT NULL DEFAULT 0,
     online_mode       TEXT NOT NULL DEFAULT '',
     online_url        TEXT NOT NULL DEFAULT '',
     active            INTEGER NOT NULL DEFAULT 1,
     sort_order        INTEGER NOT NULL DEFAULT 0,
     created_at        INTEGER NOT NULL,
     updated_at        INTEGER NOT NULL
   ) STRICT`,
  `CREATE INDEX IF NOT EXISTS ix_loc_active ON booking_locations(active, sort_order)`,

  // Which service may happen where. A relation, not a JSON column: the
  // integrity is real and the query is a join, not a scan and a parse.
  `CREATE TABLE IF NOT EXISTS booking_service_locations (
     service_id  TEXT NOT NULL REFERENCES booking_services(id) ON DELETE CASCADE,
     location_id TEXT NOT NULL REFERENCES booking_locations(id) ON DELETE CASCADE,
     PRIMARY KEY (service_id, location_id)
   ) STRICT`,

  // The ordinary week.
  `CREATE TABLE IF NOT EXISTS booking_availability_rules (
     id           TEXT PRIMARY KEY,
     weekday      INTEGER NOT NULL,
     start_minute INTEGER NOT NULL,
     end_minute   INTEGER NOT NULL,
     service_id   TEXT REFERENCES booking_services(id) ON DELETE CASCADE,
     location_id  TEXT REFERENCES booking_locations(id) ON DELETE CASCADE,
     valid_from   TEXT,
     valid_until  TEXT,
     active       INTEGER NOT NULL DEFAULT 1,
     created_at   INTEGER NOT NULL,
     updated_at   INTEGER NOT NULL
   ) STRICT`,
  `CREATE INDEX IF NOT EXISTS ix_avail_day ON booking_availability_rules(weekday, active)`,

  // The exceptions: a day off, an extra window, a holiday.
  `CREATE TABLE IF NOT EXISTS booking_availability_overrides (
     id           TEXT PRIMARY KEY,
     date_local   TEXT NOT NULL,
     start_minute INTEGER,
     end_minute   INTEGER,
     kind         TEXT NOT NULL,
     service_id   TEXT REFERENCES booking_services(id) ON DELETE CASCADE,
     location_id  TEXT REFERENCES booking_locations(id) ON DELETE CASCADE,
     note         TEXT NOT NULL DEFAULT '',
     active       INTEGER NOT NULL DEFAULT 1,
     created_at   INTEGER NOT NULL
   ) STRICT`,
  `CREATE INDEX IF NOT EXISTS ix_ovr_date ON booking_availability_overrides(date_local, active)`,

  // Time that is taken but is not a booking: a manual block, a recurring one,
  // and the busy windows mirrored from Google. Only windows are stored from
  // Google — never a title, never a guest, never a description.
  `CREATE TABLE IF NOT EXISTS booking_blocks (
     id                 TEXT PRIMARY KEY,
     starts_at_utc      INTEGER NOT NULL,
     ends_at_utc        INTEGER NOT NULL,
     source             TEXT NOT NULL DEFAULT 'MANUAL',
     google_calendar_id TEXT,
     note               TEXT NOT NULL DEFAULT '',
     fetched_at         INTEGER,
     created_at         INTEGER NOT NULL,
     updated_at         INTEGER NOT NULL
   ) STRICT`,
  `CREATE INDEX IF NOT EXISTS ix_blk_time ON booking_blocks(starts_at_utc, ends_at_utc)`,
  `CREATE INDEX IF NOT EXISTS ix_blk_src ON booking_blocks(source, starts_at_utc)`,

  // The bookings themselves.
  `CREATE TABLE IF NOT EXISTS bookings (
     id                 TEXT PRIMARY KEY,
     client_id          TEXT NOT NULL REFERENCES booking_clients(id),
     service_id         TEXT NOT NULL REFERENCES booking_services(id),
     location_id        TEXT REFERENCES booking_locations(id),
     starts_at_utc      INTEGER NOT NULL,
     ends_at_utc        INTEGER NOT NULL,
     timezone           TEXT NOT NULL DEFAULT 'Europe/Prague',
     local_date         TEXT NOT NULL,
     status             TEXT NOT NULL,
     confirmation_mode  TEXT NOT NULL DEFAULT 'REQUEST',
     credit_cost_units  INTEGER NOT NULL DEFAULT 0,
     client_package_id  TEXT REFERENCES client_packages(id),
     price_minor        INTEGER NOT NULL DEFAULT 0,
     currency           TEXT NOT NULL DEFAULT 'CZK',
     payment_status     TEXT NOT NULL DEFAULT 'OPEN',
     payment_method     TEXT NOT NULL DEFAULT '',
     paid_at            INTEGER,
     income_ref         TEXT,
     client_note        TEXT NOT NULL DEFAULT '',
     coach_note_private TEXT NOT NULL DEFAULT '',
     meeting_url        TEXT NOT NULL DEFAULT '',
     plan_id            TEXT,
     workout_template_id TEXT,
     session_instance_id TEXT,
     google_calendar_id TEXT,
     google_event_id    TEXT,
     sync_status        TEXT NOT NULL DEFAULT 'NONE',
     version            INTEGER NOT NULL DEFAULT 1,
     created_by         TEXT NOT NULL DEFAULT 'COACH',
     created_at         INTEGER NOT NULL,
     updated_at         INTEGER NOT NULL,
     cancelled_at       INTEGER,
     cancel_reason      TEXT,
     legacy_session_id  TEXT
   ) STRICT`,
  `CREATE INDEX IF NOT EXISTS ix_bk_client ON bookings(client_id, starts_at_utc)`,
  `CREATE INDEX IF NOT EXISTS ix_bk_time ON bookings(starts_at_utc)`,
  `CREATE INDEX IF NOT EXISTS ix_bk_status ON bookings(status, starts_at_utc)`,
  `CREATE INDEX IF NOT EXISTS ix_bk_date ON bookings(local_date)`,
  `CREATE INDEX IF NOT EXISTS ix_bk_sync ON bookings(sync_status)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS ix_bk_legacy ON bookings(legacy_session_id) WHERE legacy_session_id IS NOT NULL`,

  // The lock. This is the whole double-booking defence: one row per five
  // minutes of protected time, and a unique index over the pair. Two requests
  // that want the same minute both try to write the same row; SQLite lets one
  // of them through and D1 rolls the other batch back whole.
  `CREATE TABLE IF NOT EXISTS booking_slot_locks (
     booking_id   TEXT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
     resource_key TEXT NOT NULL,
     slot_cell    INTEGER NOT NULL,
     PRIMARY KEY (resource_key, slot_cell)
   ) STRICT`,
  `CREATE INDEX IF NOT EXISTS ix_lock_booking ON booking_slot_locks(booking_id)`,

  // What happened to a booking, in order, forever.
  `CREATE TABLE IF NOT EXISTS booking_events (
     id           TEXT PRIMARY KEY,
     booking_id   TEXT NOT NULL,
     type         TEXT NOT NULL,
     actor_type   TEXT NOT NULL,
     actor_id     TEXT NOT NULL DEFAULT '',
     payload_json TEXT NOT NULL DEFAULT '{}',
     created_at   INTEGER NOT NULL
   ) STRICT`,
  `CREATE INDEX IF NOT EXISTS ix_ev_booking ON booking_events(booking_id, created_at)`,

  // A repeatable offer.
  `CREATE TABLE IF NOT EXISTS package_definitions (
     id             TEXT PRIMARY KEY,
     name_cs        TEXT NOT NULL DEFAULT '',
     name_en        TEXT NOT NULL DEFAULT '',
     description_cs TEXT NOT NULL DEFAULT '',
     description_en TEXT NOT NULL DEFAULT '',
     credit_units   INTEGER NOT NULL DEFAULT 0,
     valid_days     INTEGER,
     price_minor    INTEGER NOT NULL DEFAULT 0,
     currency       TEXT NOT NULL DEFAULT 'CZK',
     active         INTEGER NOT NULL DEFAULT 1,
     sort_order     INTEGER NOT NULL DEFAULT 0,
     created_at     INTEGER NOT NULL,
     updated_at     INTEGER NOT NULL
   ) STRICT`,
  `CREATE TABLE IF NOT EXISTS package_definition_services (
     package_definition_id TEXT NOT NULL REFERENCES package_definitions(id) ON DELETE CASCADE,
     service_id            TEXT NOT NULL REFERENCES booking_services(id) ON DELETE CASCADE,
     PRIMARY KEY (package_definition_id, service_id)
   ) STRICT`,

  // One package actually held by one person. `name_snapshot` and the price
  // are copied at purchase: changing the offer later must not rewrite what
  // somebody already bought.
  `CREATE TABLE IF NOT EXISTS client_packages (
     id                    TEXT PRIMARY KEY,
     client_id             TEXT NOT NULL REFERENCES booking_clients(id),
     package_definition_id TEXT REFERENCES package_definitions(id),
     name_snapshot         TEXT NOT NULL DEFAULT '',
     purchased_units       INTEGER NOT NULL DEFAULT 0,
     price_minor           INTEGER NOT NULL DEFAULT 0,
     currency              TEXT NOT NULL DEFAULT 'CZK',
     payment_status        TEXT NOT NULL DEFAULT 'OPEN',
     payment_method        TEXT NOT NULL DEFAULT '',
     payment_provider      TEXT NOT NULL DEFAULT '',
     external_payment_id   TEXT NOT NULL DEFAULT '',
     income_ref            TEXT,
     purchased_at          INTEGER NOT NULL,
     valid_from            INTEGER,
     expires_at            INTEGER,
     status                TEXT NOT NULL DEFAULT 'ACTIVE',
     note                  TEXT NOT NULL DEFAULT '',
     created_at            INTEGER NOT NULL,
     updated_at            INTEGER NOT NULL,
     legacy_pack_id        TEXT
   ) STRICT`,
  `CREATE INDEX IF NOT EXISTS ix_cp_client ON client_packages(client_id, status)`,
  `CREATE INDEX IF NOT EXISTS ix_cp_expiry ON client_packages(expires_at)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS ix_cp_legacy ON client_packages(legacy_pack_id) WHERE legacy_pack_id IS NOT NULL`,
  `CREATE TABLE IF NOT EXISTS client_package_services (
     client_package_id TEXT NOT NULL REFERENCES client_packages(id) ON DELETE CASCADE,
     service_id        TEXT NOT NULL REFERENCES booking_services(id) ON DELETE CASCADE,
     PRIMARY KEY (client_package_id, service_id)
   ) STRICT`,

  // The ledger. Immutable rows, and a unique idempotency key so the same
  // intent written twice is written once.
  `CREATE TABLE IF NOT EXISTS credit_ledger (
     id                TEXT PRIMARY KEY,
     client_id         TEXT NOT NULL REFERENCES booking_clients(id),
     client_package_id TEXT REFERENCES client_packages(id),
     booking_id        TEXT,
     kind              TEXT NOT NULL,
     units             INTEGER NOT NULL,
     reason            TEXT NOT NULL DEFAULT '',
     created_by        TEXT NOT NULL DEFAULT 'SYSTEM',
     created_at        INTEGER NOT NULL,
     idempotency_key   TEXT NOT NULL
   ) STRICT`,
  `CREATE UNIQUE INDEX IF NOT EXISTS ix_cl_idem ON credit_ledger(idempotency_key)`,
  `CREATE INDEX IF NOT EXISTS ix_cl_client ON credit_ledger(client_id, created_at)`,
  `CREATE INDEX IF NOT EXISTS ix_cl_booking ON credit_ledger(booking_id)`,
  `CREATE INDEX IF NOT EXISTS ix_cl_pack ON credit_ledger(client_package_id)`,

  // The Google connection. The refresh token is stored encrypted and never
  // leaves this table; nothing in any API response is derived from it.
  `CREATE TABLE IF NOT EXISTS google_connections (
     id                      TEXT PRIMARY KEY,
     owner_id                TEXT NOT NULL,
     google_account          TEXT NOT NULL DEFAULT '',
     token_ciphertext        TEXT NOT NULL DEFAULT '',
     token_iv                TEXT NOT NULL DEFAULT '',
     token_version           INTEGER NOT NULL DEFAULT 1,
     granted_scopes          TEXT NOT NULL DEFAULT '',
     write_calendar_id       TEXT NOT NULL DEFAULT '',
     write_calendar_name     TEXT NOT NULL DEFAULT '',
     busy_calendar_ids_json  TEXT NOT NULL DEFAULT '[]',
     title_mode              TEXT NOT NULL DEFAULT 'FULL',
     invite_client           INTEGER NOT NULL DEFAULT 0,
     status                  TEXT NOT NULL DEFAULT 'DISCONNECTED',
     last_error              TEXT NOT NULL DEFAULT '',
     last_sync_at            INTEGER,
     legacy_migrated         INTEGER NOT NULL DEFAULT 0,
     created_at              INTEGER NOT NULL,
     updated_at              INTEGER NOT NULL
   ) STRICT`,
  `CREATE UNIQUE INDEX IF NOT EXISTS ix_gc_owner ON google_connections(owner_id)`,

  // A short-lived record of an authorisation in flight: the state value and
  // the PKCE verifier, which must never travel through the browser.
  `CREATE TABLE IF NOT EXISTS google_oauth_states (
     state         TEXT PRIMARY KEY,
     code_verifier TEXT NOT NULL,
     owner_id      TEXT NOT NULL,
     redirect_to   TEXT NOT NULL DEFAULT '',
     created_at    INTEGER NOT NULL,
     expires_at    INTEGER NOT NULL
   ) STRICT`,

  // What still has to reach Google. A booking is never lost because Google
  // was slow: the internal transaction writes here, and the mirror follows.
  `CREATE TABLE IF NOT EXISTS calendar_outbox (
     id              TEXT PRIMARY KEY,
     booking_id      TEXT NOT NULL,
     action          TEXT NOT NULL,
     booking_version INTEGER NOT NULL DEFAULT 1,
     payload_hash    TEXT NOT NULL DEFAULT '',
     attempts        INTEGER NOT NULL DEFAULT 0,
     next_attempt_at INTEGER NOT NULL,
     status          TEXT NOT NULL DEFAULT 'PENDING',
     last_error      TEXT NOT NULL DEFAULT '',
     created_at      INTEGER NOT NULL,
     updated_at      INTEGER NOT NULL
   ) STRICT`,
  `CREATE UNIQUE INDEX IF NOT EXISTS ix_ob_job ON calendar_outbox(booking_id, action, booking_version)`,
  `CREATE INDEX IF NOT EXISTS ix_ob_due ON calendar_outbox(status, next_attempt_at)`,

  // Ordinary requests that must not happen twice because a phone retried.
  `CREATE TABLE IF NOT EXISTS booking_idempotency (
     key         TEXT PRIMARY KEY,
     scope       TEXT NOT NULL,
     result_json TEXT NOT NULL DEFAULT '{}',
     created_at  INTEGER NOT NULL
   ) STRICT`,
  `CREATE INDEX IF NOT EXISTS ix_idem_age ON booking_idempotency(created_at)`,

  // Rate limiting, in the database rather than in an isolate that may be
  // replaced between two requests.
  `CREATE TABLE IF NOT EXISTS booking_rate (
     bucket     TEXT PRIMARY KEY,
     count      INTEGER NOT NULL DEFAULT 0,
     window_at  INTEGER NOT NULL
   ) STRICT`,

  // What the data migration has already done. Keeps a second run honest.
  `CREATE TABLE IF NOT EXISTS booking_data_migrations (
     name       TEXT PRIMARY KEY,
     applied_at INTEGER NOT NULL,
     summary    TEXT NOT NULL DEFAULT '{}'
   ) STRICT`,
];

export const MIGRATIONS = [
  { version: 1, name: "client operations v1", statements: M1 },
];

const applied = new WeakMap(); // per-isolate memo: the runner is cheap, not free

/**
 * Bring the database up to `SCHEMA_VERSION`. Safe on every request: after the
 * first call in an isolate it does nothing at all, and even without the memo
 * every statement is `IF NOT EXISTS`.
 */
export async function ensureBookingSchema(db) {
  if (!db) throw new Error("booking schema: no database binding");
  if (applied.get(db) === SCHEMA_VERSION) return SCHEMA_VERSION;

  await db.prepare(
    `CREATE TABLE IF NOT EXISTS booking_schema_migrations (
       version    INTEGER PRIMARY KEY,
       name       TEXT NOT NULL,
       applied_at INTEGER NOT NULL
     )`
  ).run();

  const row = await db.prepare("SELECT MAX(version) AS v FROM booking_schema_migrations").first();
  const at = (row && Number(row.v)) || 0;

  for (const m of MIGRATIONS) {
    if (m.version <= at) continue;
    for (const sql of m.statements) await db.prepare(sql).run();
    await db.prepare(
      "INSERT INTO booking_schema_migrations (version, name, applied_at) VALUES (?, ?, ?) ON CONFLICT(version) DO NOTHING"
    ).bind(m.version, m.name, Date.now()).run();
  }
  applied.set(db, SCHEMA_VERSION);
  return SCHEMA_VERSION;
}

/** For tests: forget that this database was already prepared. */
export function forgetSchema(db) { applied.delete(db); }
