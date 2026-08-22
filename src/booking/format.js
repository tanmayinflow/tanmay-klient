// Booking · what the interface says.
//
// Short, plain, and the same words in both applications. The Czech follows
// the brand glossary: Rezervovat, Volný čas, Zůstatek, Obsazeno. No
// checkout, no wallet, no funnel, no promise about what a session will do.

import { BOOKING_STATUS, PAYMENT_STATUS, LOCATION_TYPE, LEDGER_KIND, ERR, CONFIRMATION_MODE } from "./types.js";

export const STATUS_COPY = Object.freeze({
  [BOOKING_STATUS.REQUESTED]: { cs: "Čeká na potvrzení", en: "Pending confirmation", tone: "wait" },
  [BOOKING_STATUS.CONFIRMED]: { cs: "Potvrzeno", en: "Confirmed", tone: "ok" },
  [BOOKING_STATUS.COMPLETED]: { cs: "Proběhlo", en: "Done", tone: "done" },
  [BOOKING_STATUS.CANCELLED_CLIENT]: { cs: "Zrušeno klientem", en: "Cancelled by client", tone: "off" },
  [BOOKING_STATUS.CANCELLED_COACH]: { cs: "Zrušeno", en: "Cancelled", tone: "off" },
  [BOOKING_STATUS.LATE_CANCEL]: { cs: "Pozdní zrušení", en: "Late cancellation", tone: "warn" },
  [BOOKING_STATUS.NO_SHOW]: { cs: "Nepřišel", en: "No-show", tone: "warn" },
});

export const PAYMENT_COPY = Object.freeze({
  [PAYMENT_STATUS.OPEN]: { cs: "Otevřené", en: "Open" },
  [PAYMENT_STATUS.PAID]: { cs: "Zaplaceno", en: "Paid" },
  [PAYMENT_STATUS.FROM_PACKAGE]: { cs: "Z balíčku", en: "From package" },
  [PAYMENT_STATUS.WAIVED]: { cs: "Bez platby", en: "No charge" },
  [PAYMENT_STATUS.UNKNOWN]: { cs: "Neověřeno", en: "Unverified" },
});

export const LOCATION_COPY = Object.freeze({
  [LOCATION_TYPE.STUDIO]: { cs: "Studio", en: "Studio" },
  [LOCATION_TYPE.OUTDOORS]: { cs: "Venku", en: "Outdoors" },
  [LOCATION_TYPE.ONLINE]: { cs: "Online", en: "Online" },
});

export const LEDGER_COPY = Object.freeze({
  [LEDGER_KIND.PURCHASE]: { cs: "Balíček", en: "Package" },
  [LEDGER_KIND.MANUAL_ADD]: { cs: "Přidáno", en: "Added" },
  [LEDGER_KIND.HOLD]: { cs: "Rezervováno", en: "Reserved" },
  [LEDGER_KIND.RELEASE]: { cs: "Uvolněno", en: "Released" },
  [LEDGER_KIND.CONSUME]: { cs: "Čerpáno", en: "Used" },
  [LEDGER_KIND.REFUND]: { cs: "Vráceno", en: "Refunded" },
  [LEDGER_KIND.ADJUSTMENT]: { cs: "Oprava", en: "Correction" },
  [LEDGER_KIND.EXPIRY]: { cs: "Propadlo", en: "Expired" },
});

export const CONFIRMATION_COPY = Object.freeze({
  [CONFIRMATION_MODE.AUTO]: { cs: "Rezervace se potvrdí hned.", en: "The booking confirms straight away." },
  [CONFIRMATION_MODE.REQUEST]: { cs: "Termín se drží, dokud ho Tanmay nepotvrdí.", en: "The time is held until Tanmay confirms it." },
});

// One sentence per refusal. It says what happened and what to do, and it
// never says anything about the inside of the system.
export const ERROR_COPY = Object.freeze({
  [ERR.SLOT_TAKEN]: { cs: "Tenhle čas už není volný. Vyber jiný.", en: "This time is no longer free. Choose another." },
  [ERR.GOOGLE_UNAVAILABLE]: { cs: "Dostupnost se teď nepodařila ověřit. Zkus to za chvíli znovu.", en: "Availability could not be checked right now. Try again in a moment." },
  [ERR.INSUFFICIENT_CREDIT]: { cs: "Na rezervaci nemáš dost volných kreditů.", en: "You do not have enough free credits for this booking." },
  [ERR.PACKAGE_EXPIRED]: { cs: "Balíček už není platný.", en: "The package is no longer valid." },
  [ERR.BOOKING_TOO_SOON]: { cs: "Tenhle termín je už moc blízko. Vyber pozdější.", en: "This time is too close. Choose a later one." },
  [ERR.BOOKING_TOO_FAR]: { cs: "Tak daleko se zatím rezervovat nedá.", en: "You cannot book that far ahead yet." },
  [ERR.CANCELLATION_CLOSED]: { cs: "Termín už nejde přesunout online. Napiš Tanmayovi.", en: "This booking can no longer be changed online. Message Tanmay." },
  [ERR.INVALID_TRANSITION]: { cs: "Tenhle krok už u téhle rezervace nejde.", en: "That step is no longer possible for this booking." },
  [ERR.NOT_AUTHORIZED]: { cs: "Tohle není tvoje rezervace.", en: "This booking is not yours." },
  [ERR.SYNC_PENDING]: { cs: "Čeká na synchronizaci s kalendářem.", en: "Waiting to sync with the calendar." },
  [ERR.VALIDATION_ERROR]: { cs: "Něco v zadání nesedí. Zkus to prosím znovu.", en: "Something in the form does not fit. Please try again." },
  [ERR.NOT_FOUND]: { cs: "Nenašlo se.", en: "Not found." },
  [ERR.DAILY_LIMIT]: { cs: "Na tenhle den už další termín nezbývá.", en: "There is no room for another session that day." },
  [ERR.WEEKLY_LIMIT]: { cs: "Na tenhle týden už další termín nezbývá.", en: "There is no room for another session that week." },
  [ERR.OUTSIDE_AVAILABILITY]: { cs: "V tuhle dobu se rezervovat nedá.", en: "That time is not open for booking." },
  [ERR.RATE_LIMITED]: { cs: "Moc rychle po sobě. Zkus to za chvíli.", en: "Too fast. Try again in a moment." },
});

export const errorCopy = (code, lang) => {
  const c = ERROR_COPY[code] || ERROR_COPY[ERR.VALIDATION_ERROR];
  return lang === "en" ? c.en : c.cs;
};
export const statusCopy = (status, lang) => {
  const c = STATUS_COPY[status];
  if (!c) return status || "";
  return lang === "en" ? c.en : c.cs;
};
export const statusTone = (status) => (STATUS_COPY[status] || {}).tone || "off";

/** Money for a person, not for a machine. */
export function money(minor, currency, lang) {
  const v = (Number(minor) || 0) / 100;
  const cur = currency || "CZK";
  if (cur === "CZK") return v.toLocaleString(lang === "en" ? "en-GB" : "cs-CZ", { maximumFractionDigits: 0 }) + " Kč";
  return v.toLocaleString(lang === "en" ? "en-GB" : "cs-CZ", { style: "currency", currency: cur });
}

/** "1 kredit / 2 kredity / 5 kreditů" — Czech counts, done properly. */
export function credits(nUnits, lang) {
  const k = Math.abs(Number(nUnits) || 0);
  if (lang === "en") return k + (k === 1 ? " credit" : " credits");
  if (k === 1) return "1 kredit";
  if (k >= 2 && k <= 4) return k + " kredity";
  return k + " kreditů";
}
