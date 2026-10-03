import { tmPlain } from "./shared/lang/text.js";

const norm = value => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
const textOf = record => tmPlain([record.text, record.note, record.intent, record.step, record.excerpt, record.instruction, record.why, record.carry].filter(Boolean).join("\n"));

// Only current-account records and the already sanitized visible coach feeds enter here.
// No persistence, network request, trash, private coach metadata or historical account cache.
export function searchClientRecords({ query, records = {}, goals = [], sources = [], enabled = () => false, limit = 40 }) {
  const terms = norm(query).trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const groups = [
    ["notebook", "zapisnik", records.notebook || []],
    ["journal", "denik", records.journal || []],
    ["content", "prameny", sources],
    ["goal", "kompas", goals],
  ];
  const results = [];
  for (const [kind, room, entries] of groups) {
    if (!enabled(room)) continue;
    for (const entry of entries) {
      if (!entry || entry.trashed || entry.unsharedAt || entry.archivedAt) continue;
      const title = String(entry.title || entry.name || entry.date || "");
      const body = textOf(entry);
      const heading = norm(title), haystack = norm([title, entry.author, entry.date, body].filter(Boolean).join(" "));
      if (!terms.every(term => haystack.includes(term))) continue;
      const id = kind === "goal" ? entry.name || entry.title : entry.id;
      if (!id) continue;
      const found = norm(body).indexOf(terms[0]);
      const start = Math.max(0, found - 45);
      results.push({ kind, room, id, title, date: entry.date || "", snippet: (start ? "…" : "") + body.slice(start, start + 150) + (body.length > start + 150 ? "…" : ""), score: terms.every(term => heading.includes(term)) ? 2 : 1 });
    }
  }
  return results.sort((a, b) => b.score - a.score || b.date.localeCompare(a.date) || a.title.localeCompare(b.title, "cs")).slice(0, limit);
}
