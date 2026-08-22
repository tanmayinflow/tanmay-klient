// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/product/sources.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// ----------------------------------------------------------------------
// PRAMENY · dva původy, jedna místnost
// ----------------------------------------------------------------------
// MŮJ PRAMEN        klient si ho založil. Celý jeho. Trenér ho nevidí.
// OD TANMAYE        trenér ho sdílel. Drží jeho popis, výňatek, pokyn a to,
//                   proč na něm záleží. Klient k němu píše svoje: poznámku,
//                   zvýraznění, stav a „co si nést dál". To trenér nečte.
//
// Odebrání ze sdílení nemaže klientovi nic. Pramen zmizí ze seznamu sdílených
// a jeho vlastní poznámka zůstane — dá se z ní udělat vlastní pramen.
//
// Kanonický obsah od trenéra klient nepřepíše. Když ho chce po svém, udělá si
// kopii; ta je od té chvíle jeho a s trenérovým originálem už nesouvisí.

export const SOURCE_ORIGIN = Object.freeze({ CLIENT: "client", COACH: "coach" });

/** Co u sdíleného pramene píše trenér. */
export const COACH_AUTHORED_SOURCE = Object.freeze([
  "id", "title", "author", "type", "excerpt", "instruction", "why", "attachment", "sharedAt", "unsharedAt",
]);

/** Co si k němu píše klient. Nic z toho neodchází. */
export const CLIENT_PRIVATE_SOURCE_FIELDS = Object.freeze([
  "note", "highlights", "progress", "carry", "at",
]);

export const SOURCE_PROGRESS = Object.freeze(["Nezačato", "Čtu", "Hotovo", "Odloženo"]);

const isStr = (v) => typeof v === "string";
const isNum = (v) => typeof v === "number" && Number.isFinite(v);

/** Ověří dokument sdílených pramenů tak, jak přijde ze serveru. */
export function validateCoachSources(doc) {
  const errors = [];
  if (doc == null) return { ok: true, errors, doc: null };
  if (typeof doc !== "object" || Array.isArray(doc)) return { ok: false, errors: ["doc must be an object"], doc: null };
  const raw = Array.isArray(doc.sources) ? doc.sources : [];
  const out = [];
  const videna = new Set();
  for (const s of raw) {
    if (!s || typeof s !== "object") { errors.push("source must be an object"); continue; }
    if (!isStr(s.id) || !s.id.trim()) { errors.push("source.id is required"); continue; }
    if (videna.has(s.id)) { errors.push("duplicate source id: " + s.id); continue; }
    videna.add(s.id);
    if (!isStr(s.title) || !s.title.trim()) { errors.push("source.title is required: " + s.id); continue; }
    const o = { id: s.id, title: s.title };
    for (const k of ["author", "type", "excerpt", "instruction", "why"]) if (isStr(s[k])) o[k] = s[k];
    if (s.attachment && typeof s.attachment === "object" && isStr(s.attachment.id)) {
      o.attachment = { id: s.attachment.id, name: isStr(s.attachment.name) ? s.attachment.name : "", mime: isStr(s.attachment.mime) ? s.attachment.mime : "" };
    }
    if (isNum(s.sharedAt)) o.sharedAt = s.sharedAt;
    if (isNum(s.unsharedAt)) o.unsharedAt = s.unsharedAt;
    // Klientova poznámka se do dokumentu od trenéra nesmí dostat ani omylem.
    for (const zakazano of CLIENT_PRIVATE_SOURCE_FIELDS) {
      if (Object.prototype.hasOwnProperty.call(s, zakazano)) errors.push("coach source must not carry client field: " + zakazano);
    }
    out.push(o);
  }
  return { ok: errors.length === 0, errors, doc: { v: doc.v == null ? 1 : doc.v, at: isNum(doc.at) ? doc.at : 0, sources: out } };
}

/** Očistí, co klient píše ke sdílenému prameni. */
export function sanitizeClientSourceNote(n) {
  const out = {};
  if (!n || typeof n !== "object") return out;
  if (isStr(n.note)) out.note = n.note.slice(0, 20000);
  if (isStr(n.carry)) out.carry = n.carry.slice(0, 4000);
  if (isStr(n.progress) && SOURCE_PROGRESS.indexOf(n.progress) !== -1) out.progress = n.progress;
  if (Array.isArray(n.highlights)) {
    out.highlights = n.highlights.filter(isStr).slice(0, 200).map((h) => h.slice(0, 2000));
  }
  if (isNum(n.at)) out.at = n.at;
  return out;
}

/**
 * Jeden seznam pramenů pro místnost.
 * @param {object[]} vlastni    prameny, které si člověk založil sám
 * @param {object}   odTrenera  dokument sdílených pramenů
 * @param {object}   poznamky   `{ [sourceId]: { note, carry, progress, highlights } }`
 */
export function mergeSources(vlastni, odTrenera, poznamky) {
  const out = (vlastni || []).map((s) => ({ ...s, origin: SOURCE_ORIGIN.CLIENT, locked: false }));
  const doc = odTrenera && Array.isArray(odTrenera.sources) ? odTrenera.sources : [];
  const pz = poznamky || {};
  for (const s of doc) {
    if (!s || s.unsharedAt) continue;
    const p = pz[s.id] || {};
    out.push({
      id: s.id,
      name: s.title,
      title: s.title,
      author: s.author || "",
      type: s.type || "",
      excerpt: s.excerpt || "",
      instruction: s.instruction || "",
      why: s.why || "",
      attachment: s.attachment || null,
      sharedAt: s.sharedAt || 0,
      // klientovo
      note: p.note || "",
      carry: p.carry || "",
      progress: p.progress || SOURCE_PROGRESS[0],
      highlights: Array.isArray(p.highlights) ? p.highlights : [],
      origin: SOURCE_ORIGIN.COACH,
      locked: true,
    });
  }
  return out;
}

/**
 * Prameny, které trenér odebral ze sdílení, ale klient si k nim něco napsal.
 * Nemají zmizet potichu — člověk má vědět, že jeho poznámka nezanikla.
 */
export function orphanedNotes(odTrenera, poznamky) {
  const doc = odTrenera && Array.isArray(odTrenera.sources) ? odTrenera.sources : [];
  const zive = new Set(doc.filter((s) => s && !s.unsharedAt).map((s) => s.id));
  const out = [];
  for (const id of Object.keys(poznamky || {})) {
    const p = poznamky[id] || {};
    const mameCo = (p.note && p.note.trim()) || (p.carry && p.carry.trim()) || (p.highlights || []).length;
    if (!zive.has(id) && mameCo) out.push({ id, ...p });
  }
  return out;
}

/** Kopie sdíleného pramene, kterou si klient přebírá do vlastnictví. */
export function forkSource(shared, poznamka, novyId) {
  if (!shared) return null;
  const p = poznamka || {};
  return {
    id: novyId,
    name: shared.title,
    author: shared.author || "",
    type: shared.type || "",
    excerpt: shared.excerpt || "",
    note: p.note || "",
    carry: p.carry || "",
    progress: p.progress || SOURCE_PROGRESS[0],
    highlights: Array.isArray(p.highlights) ? p.highlights : [],
    origin: SOURCE_ORIGIN.CLIENT,
    locked: false,
    forkedFrom: shared.id,
  };
}

/** Smí tahle role změnit tohle pole tohohle pramene? */
export function mayEditSourceField(role, source, field) {
  if (!source) return false;
  const coach = role === "coach";
  if (source.origin === SOURCE_ORIGIN.CLIENT) return !coach;
  if (coach) return COACH_AUTHORED_SOURCE.indexOf(field) !== -1;
  return CLIENT_PRIVATE_SOURCE_FIELDS.indexOf(field) !== -1;
}

export function sourceOriginLabel(source, lang) {
  const coach = source && source.origin === SOURCE_ORIGIN.COACH;
  if (lang === "en") return coach ? "From Tanmay" : "Mine";
  return coach ? "Od Tanmaye" : "Můj";
}
