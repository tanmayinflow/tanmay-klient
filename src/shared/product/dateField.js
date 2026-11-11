export function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '') || value < '0001-01-01') return false;
  const date = new Date(value + 'T12:00:00Z');
  return Number.isFinite(+date) && date.toISOString().slice(0, 10) === value;
}
export function parseDateText(value) {
  const text = String(value || '').trim();
  if (!text) return '';
  if (validDate(text)) return text;
  const match = text.match(/^(\d{1,2})\s*[./]\s*(\d{1,2})\s*[./]\s*(\d{4})$/);
  const iso = match ? `${match[3]}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}` : '';
  return validDate(iso) ? iso : null;
}
export const displayDate = value => validDate(value) ? `${value.slice(8)}.${value.slice(5, 7)}.${value.slice(0, 4)}` : '';
export function dateAllowed(value, min, max) {
  return validDate(value) && (!validDate(min) || value >= min) && (!validDate(max) || value <= max);
}
export function shiftDate(value, days = 0, months = 0) {
  if (!validDate(value)) return '';
  const date = new Date(value + 'T12:00:00Z');
  if (months) {
    const day = date.getUTCDate();
    date.setUTCDate(1); date.setUTCMonth(date.getUTCMonth() + months);
    const last = new Date(+date); last.setUTCMonth(last.getUTCMonth() + 1); last.setUTCDate(0);
    date.setUTCDate(Math.min(day, last.getUTCDate()));
  }
  date.setUTCDate(date.getUTCDate() + days);
  const result = date.toISOString().slice(0, 10);
  return validDate(result) ? result : value;
}
export function monthDays(month) {
  if (!validDate(month + '-01')) return [];
  const start = month + '-01';
  const offset = (new Date(start + 'T12:00:00Z').getUTCDay() + 6) % 7;
  return Array.from({ length: 42 }, (_, i) => shiftDate(start, i - offset));
}
