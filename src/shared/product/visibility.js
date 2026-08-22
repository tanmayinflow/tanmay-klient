// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/product/visibility.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// ----------------------------------------------------------------------
// TŘÍDY VIDITELNOSTI · kdo co smí vidět, řečeno jednou
// ----------------------------------------------------------------------
// Každý endpoint a každý dotaz do D1 musí vědět, s jakou třídou pracuje.
// Zakázaný seznam nestačí: co není výslovně dovolené, neodchází.

export const CLASS = Object.freeze({
  OPERATIONAL_COACH_VISIBLE: "OPERATIONAL_COACH_VISIBLE",
  CLIENT_PRIVATE: "CLIENT_PRIVATE",
  CLIENT_SHAREABLE_SUMMARY: "CLIENT_SHAREABLE_SUMMARY",
  COACH_PRIVATE: "COACH_PRIVATE",
});

/** Provozní data. Trenér je vidí, protože bez nich nemůže dělat svou práci. */
export const OPERATIONAL_FIELDS = Object.freeze([
  "user_id", "email", "name", "joined_at", "last_active", "syncs",
  "modules", "share", "plan", "training_results", "bookings", "credits", "packages",
  "session_feedback_for_coach",
]);

/** Klientovo. Nikdy neodchází k trenérovi — ani jako „schováme to na frontendu". */
export const CLIENT_PRIVATE_FIELDS = Object.freeze([
  "journal", "notebook", "reflection", "evening", "plan_answers", "deeper",
  "wb", "mood", "body", "memento", "source_notes", "attachments", "audio",
  "private_goals", "habit_notes", "note", "tasks",
]);

/** Trenérovo. Nikdy neodchází ke klientovi. */
export const COACH_PRIVATE_FIELDS = Object.freeze([
  "coach_note", "coach_assessment", "internal_note", "package_adjustment_reason",
  "other_clients", "availability_rules", "google_busy_title",
]);

/**
 * Allowlist. Vezme jen jmenovaná pole a nic jiného — ani `undefined` klíč,
 * ani vnořený objekt, který se do výstupu připletl přes spread.
 */
export function pick(source, allowed) {
  const out = {};
  if (!source || typeof source !== "object") return out;
  for (const k of allowed) {
    if (Object.prototype.hasOwnProperty.call(source, k)) out[k] = source[k];
  }
  return out;
}

/** Řádek klienta pro trenérský seznam. Jediná povolená podoba. */
export const COACH_CLIENT_ROW_FIELDS = Object.freeze([
  "user_id", "email", "name", "joined_at", "last_active", "syncs", "modules", "share",
]);

export function coachClientRow(row) {
  return pick(row, COACH_CLIENT_ROW_FIELDS);
}

// ----------------------------------------------------------------------
// VĚDOMÉ SDÍLENÍ · přesně tři souhrny, nic mezi řádky
// ----------------------------------------------------------------------
// Klient vidí před potvrzením, co přesně odejde, za jaké období a co se
// neposílá nikdy. Vypnutí zastaví přístup a zneplatní snímek.

export const SHARE_KEYS = Object.freeze(["habits", "goals", "training"]);

export const SHARE_WINDOW_DAYS = 30;

/** Obálka provozního tréninkového kanálu. Nic jiného v ní nemá co dělat. */
export const TRAINING_ENVELOPE_KEYS = Object.freeze(["v", "at", "sessions", "sched"]);

/** Co se nesdílí nikdy. Seznam je součástí kontraktu, ne jen komentář. */
export const NEVER_SHARED = Object.freeze([
  "journal", "notebook", "reflection", "evening", "deeper", "memento",
  "source_notes", "attachments", "audio", "body_detail", "mood_detail", "motif",
]);

const isStr = (v) => typeof v === "string";
const isNum = (v) => typeof v === "number" && Number.isFinite(v);
const isBool = (v) => typeof v === "boolean";

/**
 * Runtime validace souhrnu. Malý explicitní validátor — žádná nová
 * závislost. Vrací { ok, errors } a při chybě se nic neuloží.
 */
export function validateShareSnapshot(snap) {
  const errors = [];
  if (snap == null) return { ok: true, errors };            // null = sdílení vypnuté
  if (typeof snap !== "object" || Array.isArray(snap)) {
    return { ok: false, errors: ["snapshot must be an object or null"] };
  }
  for (const k of Object.keys(snap)) {
    if (SHARE_KEYS.indexOf(k) === -1) errors.push("unknown share key: " + k);
  }
  const h = snap.habits;
  if (h != null) {
    if (typeof h !== "object") errors.push("habits must be an object");
    else {
      if (!isNum(h.days)) errors.push("habits.days must be a number");
      if (!isNum(h.window) ) errors.push("habits.window must be a number");
      if (!Array.isArray(h.rows)) errors.push("habits.rows must be an array");
      else for (const r of h.rows) {
        if (!isStr(r && r.name)) errors.push("habits.rows[].name must be a string");
        if (!isNum(r && r.done)) errors.push("habits.rows[].done must be a number");
      }
    }
  }
  const g = snap.goals;
  if (g != null) {
    if (!Array.isArray(g)) errors.push("goals must be an array");
    else for (const x of g) {
      if (!isStr(x && x.name)) errors.push("goals[].name must be a string");
      if (!isStr(x && x.status)) errors.push("goals[].status must be a string");
      if (x && "note" in x) errors.push("goals[].note is never shared");
    }
  }
  // Trénink je provozní kanál, ne souhrn: trenér potřebuje vidět, co klient
  // z jeho plánu opravdu odcvičil — série, opakování, RIR, zpětnou vazbu psanou
  // jemu. Hlídáme proto tvar obálky, ne obsah série.
  const tr = snap.training;
  if (tr != null) {
    if (typeof tr !== "object" || Array.isArray(tr)) errors.push("training must be an object");
    else {
      for (const k of Object.keys(tr)) {
        if (TRAINING_ENVELOPE_KEYS.indexOf(k) === -1) errors.push("unknown training key: " + k);
      }
      if (tr.sessions != null && !Array.isArray(tr.sessions) && !isNum(tr.sessions)) {
        errors.push("training.sessions must be a list of sessions or a count");
      }
    }
  }
  // Poslední brzda: v souhrnu nesmí být nic, co patří do NEVER_SHARED.
  const flat = JSON.stringify(snap);
  for (const banned of NEVER_SHARED) {
    if (flat.indexOf('"' + banned + '"') !== -1) errors.push("summary carries a never-shared field: " + banned);
  }
  if (flat.length > 100000) errors.push("summary too large");
  return { ok: errors.length === 0, errors };
}

/** Vyrobí souhrn návyků za okno dnů. Počty, jména, nic z textu. */
export function habitSummary(days, defs, windowDays) {
  const w = isNum(windowDays) ? windowDays : SHARE_WINDOW_DAYS;
  const rows = [];
  const names = [];
  for (const d of defs || []) {
    if (d && !d.archived) { rows.push({ name: String(d.name || d.cz || d.en || d.slot || ""), done: 0 }); names.push(d.slot); }
  }
  let withEntry = 0;
  for (const day of days || []) {
    let any = false;
    for (let i = 0; i < names.length; i++) {
      if (day && day.h && day.h[names[i]]) { rows[i].done += 1; any = true; }
    }
    if (any) withEntry += 1;
  }
  return { days: withEntry, window: w, rows };
}

/** Souhrn cílů: jméno a stav. Bez poznámek, bez příštích kroků. */
export function goalSummary(goals) {
  const out = [];
  for (const g of goals || []) {
    if (!g) continue;
    out.push({ name: String(g.name || g.title || ""), status: String(g.status || "") });
  }
  return out;
}

/** Souhrn tréninku: kolik sezení a kdy naposled. Nic víc. */
export function trainingSummary(sessions) {
  const list = Array.isArray(sessions) ? sessions : [];
  let last = null;
  for (const s of list) {
    const d = s && (s.date || s.d);
    if (isStr(d) && (last === null || d > last)) last = d;
  }
  return { sessions: list.length, last, byPlan: true };
}

/** Složí snímek přesně z toho, co je zapnuté. Vypnuté = klíč vůbec nevznikne. */
export function buildShareSnapshot(caps, data) {
  const snap = {};
  if (caps && caps.consciousShareHabits) snap.habits = habitSummary(data && data.days, data && data.habitDefs, SHARE_WINDOW_DAYS);
  if (caps && caps.consciousShareGoals) snap.goals = goalSummary(data && data.goals);
  if (caps && caps.consciousShareTraining) snap.training = trainingSummary(data && data.sessions);
  return Object.keys(snap).length ? snap : null;
}
