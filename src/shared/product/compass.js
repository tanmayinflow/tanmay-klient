// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/product/compass.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// ----------------------------------------------------------------------
// KOMPAS · dvě třídy cíle, jedna tabulka pravomocí
// ----------------------------------------------------------------------
// Cíl je buď klientův, nebo od trenéra. Rozdíl není v tom, jak vypadá, ale
// v tom, kdo mu smí měnit definici.
//
//   MOJE          klient si ho založil, definici i všechno ostatní drží on;
//                 trenér ho nevidí, dokud ho klient sám nesdílí
//   OD TANMAYE    trenér drží název, záměr, případný cíl a svou poznámku;
//                 klient k němu píše svůj postup, krok a vlastní poznámku
//                 a může požádat o uzavření
//
// V rozhraní se to nesmí jmenovat „locked", „admin goal" ani „system-owned".
// Jsou to jen dvě jména: Moje a Od Tanmaye.

export const GOAL_OWNER = Object.freeze({ CLIENT: "client", COACH: "coach" });

export const GOAL_STATUSES = Object.freeze(["Not started", "In progress", "On Hold", "Completed"]);

/** Pole, která píše trenér. Klient je nepřepíše ani přes API. */
export const COACH_AUTHORED = Object.freeze(["id", "title", "intent", "target", "area", "coachNote", "assignedAt", "archivedAt"]);

/** Pole, která k cíli od trenéra píše klient. Nic jiného se od něj nepřijme. */
export const CLIENT_PROGRESS_FIELDS = Object.freeze(["status", "step", "note", "requestDone", "at"]);

/** Trenérova poznámka je jeho. Ke klientovi neodchází. */
export const COACH_PRIVATE_GOAL_FIELDS = Object.freeze(["coachNote"]);

const isStr = (v) => typeof v === "string";
const isNum = (v) => typeof v === "number" && Number.isFinite(v);

/**
 * Ověří dokument s cíli od trenéra tak, jak přijde ze serveru.
 * Vrací { ok, errors, doc } · doc je očištěný, nikdy ne vstup.
 */
export function validateCoachGoals(doc) {
  const errors = [];
  if (doc == null) return { ok: true, errors, doc: null };
  if (typeof doc !== "object" || Array.isArray(doc)) return { ok: false, errors: ["doc must be an object"], doc: null };
  const v = doc.v == null ? 1 : doc.v;
  if (!isNum(v)) errors.push("v must be a number");
  const raw = Array.isArray(doc.goals) ? doc.goals : [];
  const goals = [];
  const videna = new Set();
  for (const g of raw) {
    if (!g || typeof g !== "object") { errors.push("goal must be an object"); continue; }
    if (!isStr(g.id) || !g.id.trim()) { errors.push("goal.id is required"); continue; }
    if (videna.has(g.id)) { errors.push("duplicate goal id: " + g.id); continue; }
    videna.add(g.id);
    if (!isStr(g.title) || !g.title.trim()) { errors.push("goal.title is required: " + g.id); continue; }
    const out = { id: g.id, title: g.title };
    if (isStr(g.intent)) out.intent = g.intent;
    if (isStr(g.target)) out.target = g.target;
    if (isStr(g.area)) out.area = g.area;
    if (isStr(g.coachNote)) out.coachNote = g.coachNote;
    if (isNum(g.assignedAt)) out.assignedAt = g.assignedAt;
    if (isNum(g.archivedAt)) out.archivedAt = g.archivedAt;
    if (g.released === true) out.released = true;   // trenér ho pustil klientovi
    goals.push(out);
  }
  return { ok: errors.length === 0, errors, doc: { v, at: isNum(doc.at) ? doc.at : 0, goals } };
}

/**
 * Co z cíle od trenéra smí vidět KLIENT.
 * Trenérova poznámka mezi to nepatří — je to jeho pracovní záznam.
 */
export function coachGoalForClient(g) {
  if (!g) return null;
  const out = { id: g.id, title: g.title };
  if (g.intent != null) out.intent = g.intent;
  if (g.target != null) out.target = g.target;
  if (g.area != null) out.area = g.area;
  if (g.assignedAt != null) out.assignedAt = g.assignedAt;
  if (g.archivedAt != null) out.archivedAt = g.archivedAt;
  if (g.released) out.released = true;
  return out;
}

/** Celý dokument očištěný pro klienta. */
export function coachGoalsForClient(doc) {
  if (!doc || !Array.isArray(doc.goals)) return { v: 1, at: 0, goals: [] };
  return { v: doc.v == null ? 1 : doc.v, at: doc.at || 0, goals: doc.goals.map(coachGoalForClient) };
}

/** Očistí, co klient posílá ke svému postupu. Nic mimo povolený seznam. */
export function sanitizeClientProgress(p) {
  const out = {};
  if (!p || typeof p !== "object") return out;
  if (isStr(p.status) && GOAL_STATUSES.indexOf(p.status) !== -1) out.status = p.status;
  if (isStr(p.step)) out.step = p.step.slice(0, 400);
  if (isStr(p.note)) out.note = p.note.slice(0, 4000);
  if (p.requestDone === true) out.requestDone = true;
  if (isNum(p.at)) out.at = p.at;
  return out;
}

/**
 * Jeden seznam cílů pro Kompas.
 * @param {object[]} vlastni  cíle, které si klient (nebo Tanmay v osobní aplikaci) založil
 * @param {object}   odTrenera dokument od trenéra, už očištěný pro klienta
 * @param {object}   postup   `{ [goalId]: { status, step, note, requestDone } }`
 */
export function mergeGoals(vlastni, odTrenera, postup) {
  const out = (vlastni || []).map((g) => ({ ...g, owner: GOAL_OWNER.CLIENT, locked: false }));
  const doc = odTrenera && Array.isArray(odTrenera.goals) ? odTrenera.goals : [];
  const pr = postup || {};
  for (const g of doc) {
    if (!g || g.archivedAt) continue;
    const p = pr[g.id] || {};
    // Trenér cíl pustil klientovi · od té chvíle je to jeho vlastní cíl.
    const uvolneny = !!g.released;
    out.push({
      id: g.id,
      name: g.title,
      title: g.title,
      intent: g.intent || "",
      target: g.target || "",
      area: g.area || "",
      status: p.status || "Not started",
      step: p.step || "",
      note: p.note || "",
      requestDone: !!p.requestDone,
      assignedAt: g.assignedAt || 0,
      owner: uvolneny ? GOAL_OWNER.CLIENT : GOAL_OWNER.COACH,
      locked: !uvolneny,
    });
  }
  return out;
}

/**
 * Smí tahle role změnit tohle pole tohohle cíle?
 * Jediná tabulka pravomocí. Server se ptá jí, rozhraní taky.
 */
export function mayEditGoalField(role, goal, field) {
  if (!goal) return false;
  const coach = role === "coach";
  if (goal.owner === GOAL_OWNER.CLIENT || !goal.locked) {
    // Klientův cíl. Trenér do něj nesahá — ani když je sdílený.
    return !coach;
  }
  // Cíl od trenéra.
  if (coach) return true;
  return CLIENT_PROGRESS_FIELDS.indexOf(field) !== -1;
}

/** Jak se ta dvě jména vyslovují. Ne „locked", ne „admin". */
export function goalOwnerLabel(goal, lang) {
  const coach = goal && goal.owner === GOAL_OWNER.COACH;
  if (lang === "en") return coach ? "From Tanmay" : "Mine";
  return coach ? "Od Tanmaye" : "Moje";
}

// ----------------------------------------------------------------------
// ÚTĚKOVÝ TVAR CÍLE
// ----------------------------------------------------------------------
// „Přestat kouřit" je popis toho, od čeho člověk utíká. Cíl formulovaný jako
// přiblížení drží déle a nese míň studu. Nabídne se obrat, nevnutí se —
// pole zůstává, jak si ho člověk napsal, dokud sám neklepne.

export const TM_UTEK = /^\s*(přesta[tň]|nepít|nekouřit|nejíst|nedělat|nebýt|nezdržovat|už\s+ne|míň|méně|omezit|vyhnout\s+se|vyhýbat\s+se|zbavit\s+se|stop|quit|avoid|cut\s+down|no\s+more|less)(?=[\s,.:;!?]|$)/i;

export const TM_OTOC = Object.freeze([
  { re: /kouř|cigaret|smok/i, cz: "Dýchat volně", en: "Breathe clean" },
  { re: /pít|alkohol|pivo|víno|drink|booze/i, cz: "Žít střízlivě", en: "Live sober" },
  { re: /prokrastin|odklád|procrastinat/i, cz: "Začínat hned ráno", en: "Start first thing" },
  { re: /cukr|slad|sugar|sweet/i, cz: "Jíst poctivě", en: "Eat honestly" },
  { re: /telefon|mobil|obrazovk|sociáln|scroll|phone|screen|social/i, cz: "Mít večery bez obrazovky", en: "Keep evenings screen-free" },
]);

/** Vrátí `{cz,en}` obratu, nebo null. Překlad si udělá vrstva, která kreslí. */
export function tmOtocFor(s) {
  const x = TM_OTOC.find((o) => o.re.test(s || ""));
  return x ? { cz: x.cz, en: x.en } : null;
}

/** Pohledy dílny. Jeden seznam pro obě aplikace. */
export const G_VIEWS = Object.freeze(["Status", "Area", "Priority", "Completed", "Archiv"]);
