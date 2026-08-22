// Booking · the vocabulary of the client operations domain.
//
// One file, no imports, no side effects: every other module in `src/booking/`
// and every route in `worker/booking/` agrees on the strings here, and the
// tests read them from this file rather than repeating literals. The same
// module ships in both repositories — `tanmay-web` (coach) and
// `tanmay-klient` (client) — exactly like `src/training/`.

// Schema version of the booking subtree in D1. Bumped only when a migration
// changes the shape, never when a row is added.
export const BOOKING_SCHEMA_VERSION = 1;

// The whole domain is computed on a fixed grid. Durations, buffers, slot
// intervals and availability windows are validated to be multiples of it, so
// a lock segment can never straddle a boundary and reject a legal
// back-to-back booking. Five minutes is small enough to express every real
// session shape and large enough that a two-hour protected interval is
// twenty-four rows, not a hundred and twenty.
export const SLOT_GRID_MIN = 5;
export const MS_PER_MIN = 60000;

// ---- Booking status -------------------------------------------------------
// A booking is never "just a row with a status field". Every move between
// these is a named transition the server validates; see `status.js`.
export const BOOKING_STATUS = Object.freeze({
  REQUESTED: "REQUESTED",               // waiting for the coach to decide
  CONFIRMED: "CONFIRMED",               // a real future appointment
  COMPLETED: "COMPLETED",               // it happened
  CANCELLED_CLIENT: "CANCELLED_CLIENT", // client cancelled in time
  CANCELLED_COACH: "CANCELLED_COACH",   // coach cancelled, credit always returns
  LATE_CANCEL: "LATE_CANCEL",           // cancelled past the window
  NO_SHOW: "NO_SHOW",                   // did not arrive
});

export const BOOKING_STATUS_LIST = Object.freeze(Object.keys(BOOKING_STATUS));

// The states that still hold a slot and a credit.
export const ACTIVE_STATUSES = Object.freeze([BOOKING_STATUS.REQUESTED, BOOKING_STATUS.CONFIRMED]);
// The states that are over, whatever the outcome.
export const CLOSED_STATUSES = Object.freeze([
  BOOKING_STATUS.COMPLETED, BOOKING_STATUS.CANCELLED_CLIENT, BOOKING_STATUS.CANCELLED_COACH,
  BOOKING_STATUS.LATE_CANCEL, BOOKING_STATUS.NO_SHOW,
]);

export const isActiveStatus = (s) => ACTIVE_STATUSES.indexOf(s) >= 0;
export const isClosedStatus = (s) => CLOSED_STATUSES.indexOf(s) >= 0;

// ---- Confirmation ---------------------------------------------------------
export const CONFIRMATION_MODE = Object.freeze({
  AUTO: "AUTO",       // a valid booking confirms itself
  REQUEST: "REQUEST", // the slot and the credit are held, the coach decides
});

// ---- Payment --------------------------------------------------------------
// Payment status and payment method are two different facts, and neither is
// the booking status. A session that happened is not automatically paid.
export const PAYMENT_STATUS = Object.freeze({
  OPEN: "OPEN",             // nothing agreed yet
  PAID: "PAID",             // money actually arrived
  FROM_PACKAGE: "FROM_PACKAGE", // covered by a credit, no separate payment
  WAIVED: "WAIVED",         // deliberately not charged
  UNKNOWN: "UNKNOWN",       // migrated data that does not say
});
export const PAYMENT_METHOD = Object.freeze({
  NONE: "",
  CASH: "CASH",
  TRANSFER: "TRANSFER",
  PACKAGE: "PACKAGE",
});

// ---- Locations ------------------------------------------------------------
export const LOCATION_TYPE = Object.freeze({
  STUDIO: "STUDIO",
  OUTDOORS: "OUTDOORS",
  ONLINE: "ONLINE",
});
export const ONLINE_MODE = Object.freeze({
  NONE: "",
  MANUAL_LINK: "MANUAL_LINK",
  GOOGLE_MEET: "GOOGLE_MEET",
});

// ---- Availability ---------------------------------------------------------
export const OVERRIDE_KIND = Object.freeze({
  CLOSED: "CLOSED",   // remove time on this date
  OPEN: "OPEN",       // add time on this date
  VACATION: "VACATION", // a whole day (or run of days) off
});
export const BLOCK_SOURCE = Object.freeze({
  MANUAL: "MANUAL",
  GOOGLE: "GOOGLE",
  RECURRING: "RECURRING",
});

// ---- Credit ledger --------------------------------------------------------
// A balance is never a stored number that something overwrites. It is the sum
// of immutable entries. Signs are the whole convention: adding is positive,
// spending is negative, and there is no third rule.
export const LEDGER_KIND = Object.freeze({
  PURCHASE: "PURCHASE",       // + a package was bought
  MANUAL_ADD: "MANUAL_ADD",   // + the coach granted credit
  HOLD: "HOLD",               // − a booking reserved a credit
  RELEASE: "RELEASE",         // + a hold was given back
  CONSUME: "CONSUME",         // − a session actually used a credit
  REFUND: "REFUND",           // + money and credit went back
  ADJUSTMENT: "ADJUSTMENT",   // ± a correction, always with a reason
  EXPIRY: "EXPIRY",           // − a package ran out of validity
});
export const LEDGER_KIND_LIST = Object.freeze(Object.keys(LEDGER_KIND));

// Which sign each kind is allowed to carry. A HOLD that arrives positive is a
// bug, not a variation, and the writer refuses it.
export const LEDGER_SIGN = Object.freeze({
  PURCHASE: 1, MANUAL_ADD: 1, RELEASE: 1, REFUND: 1,
  HOLD: -1, CONSUME: -1, EXPIRY: -1,
  ADJUSTMENT: 0, // signed either way, reason required
});

// ---- Package status -------------------------------------------------------
export const PACKAGE_STATUS = Object.freeze({
  ACTIVE: "ACTIVE",
  EXPIRED: "EXPIRED",
  CANCELLED: "CANCELLED",
});

// ---- Google sync ----------------------------------------------------------
export const SYNC_STATUS = Object.freeze({
  NONE: "NONE",         // nothing to mirror (Google not connected)
  PENDING: "PENDING",   // queued in the outbox
  SYNCED: "SYNCED",     // the mirror event matches this version
  ERROR: "ERROR",       // retried and still failing, visible to the coach
});
export const OUTBOX_ACTION = Object.freeze({
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  CANCEL: "CANCEL",
});
export const OUTBOX_STATUS = Object.freeze({
  PENDING: "PENDING",
  DONE: "DONE",
  FAILED: "FAILED",
});
export const CALENDAR_TITLE_MODE = Object.freeze({
  FULL: "FULL",       // name · service
  GENERIC: "GENERIC", // "Sezení"
});

// ---- Audit ----------------------------------------------------------------
export const BOOKING_EVENT = Object.freeze({
  CREATED: "CREATED",
  CONFIRMED: "CONFIRMED",
  REJECTED: "REJECTED",
  RESCHEDULED: "RESCHEDULED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
  NO_SHOW: "NO_SHOW",
  PAYMENT_CHANGED: "PAYMENT_CHANGED",
  NOTE_CHANGED: "NOTE_CHANGED",
  SYNC_OK: "SYNC_OK",
  SYNC_ERROR: "SYNC_ERROR",
  ADMIN_OVERRIDE: "ADMIN_OVERRIDE",
});
export const ACTOR = Object.freeze({
  COACH: "COACH",
  CLIENT: "CLIENT",
  SYSTEM: "SYSTEM",
});

// ---- Errors ---------------------------------------------------------------
// One code per refusal, so the interface can speak plainly in either language
// and the tests can assert on the reason instead of on a sentence.
export const ERR = Object.freeze({
  SLOT_TAKEN: "SLOT_TAKEN",
  GOOGLE_UNAVAILABLE: "GOOGLE_UNAVAILABLE",
  INSUFFICIENT_CREDIT: "INSUFFICIENT_CREDIT",
  PACKAGE_EXPIRED: "PACKAGE_EXPIRED",
  BOOKING_TOO_SOON: "BOOKING_TOO_SOON",
  BOOKING_TOO_FAR: "BOOKING_TOO_FAR",
  CANCELLATION_CLOSED: "CANCELLATION_CLOSED",
  INVALID_TRANSITION: "INVALID_TRANSITION",
  NOT_AUTHORIZED: "NOT_AUTHORIZED",
  SYNC_PENDING: "SYNC_PENDING",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  NOT_FOUND: "NOT_FOUND",
  DAILY_LIMIT: "DAILY_LIMIT",
  WEEKLY_LIMIT: "WEEKLY_LIMIT",
  OUTSIDE_AVAILABILITY: "OUTSIDE_AVAILABILITY",
  RATE_LIMITED: "RATE_LIMITED",
});

// The HTTP status each refusal deserves. A slot lost to somebody else is a
// conflict, not a server fault, and the client app retries on exactly that.
export const ERR_HTTP = Object.freeze({
  SLOT_TAKEN: 409,
  GOOGLE_UNAVAILABLE: 503,
  INSUFFICIENT_CREDIT: 409,
  PACKAGE_EXPIRED: 409,
  BOOKING_TOO_SOON: 422,
  BOOKING_TOO_FAR: 422,
  CANCELLATION_CLOSED: 422,
  INVALID_TRANSITION: 409,
  NOT_AUTHORIZED: 403,
  SYNC_PENDING: 202,
  VALIDATION_ERROR: 400,
  NOT_FOUND: 404,
  DAILY_LIMIT: 409,
  WEEKLY_LIMIT: 409,
  OUTSIDE_AVAILABILITY: 409,
  RATE_LIMITED: 429,
});

// Defaults for a service the coach has not configured yet. Neutral on
// purpose: the real offer is Tanmay's to write, not the code's to assume.
export const SERVICE_DEFAULTS = Object.freeze({
  duration_min: 60,
  credit_cost_units: 1,
  price_minor: 0,
  currency: "CZK",
  min_notice_min: 720,        // half a day
  booking_horizon_days: 60,
  cancel_before_min: 1440,    // a day
  buffer_before_min: 0,
  buffer_after_min: 0,
  slot_interval_min: 30,
  confirmation_mode: CONFIRMATION_MODE.REQUEST,
  daily_limit: 0,             // 0 = no limit
  weekly_limit: 0,
  client_visible: 1,
  active: 1,
});

export const DEFAULT_TIMEZONE = "Europe/Prague";
