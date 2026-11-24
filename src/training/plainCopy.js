// Lidová vrstva textů knihovny cviků, 2026-11-24.
// Krátké a praktické znění pěti textových polí a zobrazovaného názvu cviku.
// Zdroj textů: Work/web-application/Reviews/copy-plain-2026-11-24/batches/.
// Data generuje tools/build.mjs. Ruční úprava dat se při dalším sestavení ztratí.
//
// Pravidla:
// - Pole se změní jen tehdy, když drží známé knihovní znění (otisk v datech).
//   Vlastní úprava uživatele má jiný otisk a zůstane.
// - Jeden upravený jazyk chrání celé dvojjazyčné pole.
// - Název se nemění v `cz` a `en`. Ty patří Atlasu pohybu. Vrstva nastaví jen
//   zobrazovaný název `displayCz` a `displayEn`.
// - Modul je čistý: nic neukládá, nepřidává cviky a nesahá na záznamy, plány
//   ani historii.
import { PLAIN_COPY } from './plainCopyData.js';

export { PLAIN_COPY };
export const PLAIN_COPY_FIELDS = Object.freeze(['foc', 'pos', 'exe', 'wat', 'pro']);

function pairText(value) {
  if (Array.isArray(value)) return value.map(part => (part == null ? '' : String(part))).join('\u0001');
  return value == null ? '' : String(value);
}

/** Otisk jednoho znění. cyrb53, základ 36. Slouží jen k rozpoznání knihovního textu. */
export function plainCopyHash(value) {
  const text = pairText(value);
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

export function applyPlainCopy(ex) {
  if (!ex || typeof ex !== 'object' || Array.isArray(ex) || ex.custom) return ex;
  const entry = Object.hasOwn(PLAIN_COPY, ex.id) ? PLAIN_COPY[ex.id] : null;
  if (!entry) return ex;
  let out = ex;
  for (const field of PLAIN_COPY_FIELDS) {
    const rule = entry[field];
    if (!rule || !rule[0].includes(plainCopyHash(ex[field]))) continue;
    if (out === ex) out = { ...ex };
    out[field] = [rule[1], rule[2]];
  }
  const name = entry.n;
  if (name) {
    const shown = ex.displayCz || ex.displayEn;
    const fresh = !shown && name[0].includes(plainCopyHash([ex.cz || '', ex.en || '']));
    const older = shown && Array.isArray(name[3]) && name[3].includes(plainCopyHash([ex.displayCz || '', ex.displayEn || '']));
    if (fresh || older) {
      if (out === ex) out = { ...ex };
      out.displayCz = name[1];
      out.displayEn = name[2];
    }
  }
  return out;
}

export function applyPlainCopyCollection(coll) {
  if (!coll || typeof coll !== 'object' || Array.isArray(coll) || !Array.isArray(coll.tEx)) return coll;
  let changed = false;
  const exercises = coll.tEx.map(ex => {
    const plain = applyPlainCopy(ex);
    if (plain !== ex) changed = true;
    return plain;
  });
  return changed ? { ...coll, tEx: exercises } : coll;
}

/** Kolik karet už drží lidové znění. Jen pro kontrolu, nic nemění. */
export function plainCopyCoverage(coll) {
  const rows = (coll && Array.isArray(coll.tEx)) ? coll.tEx : [];
  let covered = 0;
  let plain = 0;
  let waiting = 0;
  for (const ex of rows) {
    const entry = ex && Object.hasOwn(PLAIN_COPY, ex.id) ? PLAIN_COPY[ex.id] : null;
    if (!entry) continue;
    covered += 1;
    const fields = PLAIN_COPY_FIELDS.filter(field => entry[field]);
    if (fields.every(field => pairText(ex[field]) === pairText([entry[field][1], entry[field][2]]))) plain += 1;
    else if (applyPlainCopy(ex) !== ex) waiting += 1;
  }
  return { cards: rows.length, covered, plain, waiting, kept: covered - plain - waiting };
}
