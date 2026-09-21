// Calendar days, not elapsed 24-hour periods: DST must not skip a statement.
export function dailyIndex(date, count) {
  if (!Number.isInteger(count) || count < 1) return 0;
  return wrapIndex(Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000), count);
}
export function wrapIndex(index, count) {
  return count > 0 ? ((index % count) + count) % count : 0;
}
export function nextMidnightDelay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).getTime() - date.getTime() + 50;
}
