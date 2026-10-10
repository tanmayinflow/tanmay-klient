// Personal records only. No account data, examples or brand seed library.
export const CONTENT_STAGES = Object.freeze([
  ["napad", "Nápady", "Ideas"], ["plan", "Naplánováno", "Planned"],
  ["natocit", "Vytvořit", "To create"], ["strih", "Zpracování", "In post"],
  ["publikovat", "K publikaci", "To publish"], ["vysledky", "Vyhodnocení", "Reviewed"],
]);
export const CONTENT_CHANNELS = Object.freeze(["Instagram", "YouTube", "TikTok", "E-mail"]);
// Existing notebook folders remain accessible until the optional destination is available.
export function personalNotebookRoom(entry, contentAvailable = false) {
  const folder = String(entry?.folder || "");
  return contentAvailable && (folder === "Sociální sítě" || folder.startsWith("Sociální sítě/")) ? "socsite" : "zapisnik";
}
export function creationResourcePatch(entry, title, text, fallbackTitle) {
  return {title:title.trim() || fallbackTitle, text, ...(!entry ? {folder:"Sociální sítě", tag:"Tvorba obsahu"} : {})};
}
export function validPersonalDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ""))) return false;
  const parsed = new Date(value + "T12:00:00Z");
  return Number.isFinite(+parsed) && parsed.toISOString().slice(0, 10) === value;
}
export function personalAmount(value) {
  const text = String(value ?? "").trim().replace(/\s/g, "").replace(",", ".");
  if (!/^\d+(?:\.\d{1,2})?$/.test(text)) return null;
  const cents = Math.round(Number(text) * 100);
  return Number.isSafeInteger(cents) && cents > 0 ? cents / 100 : null;
}
export function monthlyLedger(coll, month) {
  const rows = kind => (Array.isArray(coll?.[kind]) ? coll[kind] : []).filter(row => validPersonalDate(row.date) && row.date.startsWith(month + "-"));
  const total = entries => entries.reduce((sum, row) => sum + (Number.isFinite(Number(row.amount)) ? Math.round(Number(row.amount) * 100) : 0), 0) / 100;
  const income = rows("income"), expenses = rows("expenses");
  return {income, expenses, received: total(income), spent: total(expenses), balance: Math.round((total(income) - total(expenses)) * 100) / 100};
}
export function shiftPersonalMonth(month, offset) {
  const [year, value] = month.split("-").map(Number);
  const date = new Date(year, value - 1 + offset, 1);
  return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0");
}
