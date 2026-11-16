// Plot only observed, dated values. Equal dates share an x position; gaps in
// training remain gaps on the time axis rather than equally spaced sessions.
export function historyChartPoints(series, width = 320, height = 112) {
  const rows = (series || []).map(p => ({ ...p, time: /^\d{4}-\d{2}-\d{2}$/.test(p.date || '') ? Date.parse(p.date + 'T12:00:00Z') : Number(p.at) }))
    .filter(p => Number.isFinite(p.time) && p.time > 0 && Number.isFinite(p.raw) && Number.isFinite(p.value))
    .sort((a, b) => a.time - b.time);
  if (!rows.length) return [];
  const first = rows[0].time, last = rows.at(-1).time;
  const low = Math.min(0, ...rows.map(p => p.value)), high = Math.max(0, ...rows.map(p => p.value));
  return rows.map(p => ({ ...p, x: first === last ? width / 2 : 12 + (p.time - first) / (last - first) * (width - 24), y: high === low ? height / 2 : height - 12 - (p.value - low) / (high - low) * (height - 24) }));
}
