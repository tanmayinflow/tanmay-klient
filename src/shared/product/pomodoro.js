// Timer preferences and completed blocks belong to the current account.
export const POMO_DEFAULTS = Object.freeze({ focus: 25, short: 5, long: 15, every: 4, sound: true, bg: null, voice: "bowl", vol: 1 });

export function pomoDurationMinutes(mode, cfg = {}) {
  const fallback = mode === "custom" ? 45 : POMO_DEFAULTS[mode] || POMO_DEFAULTS.focus;
  const value = Number(cfg[mode]);
  return Number.isFinite(value) && value >= 1 ? Math.min(180, value) : fallback;
}

// The saved deadline is the clock. Background throttling must not add time or
// stop a completed break. Work is bounded per tick so a very old saved run can
// catch up in batches without freezing the interface or dropping its log.
export function advancePomoRun(run, now = Date.now(), limit = 256) {
  let next = run;
  const blocks = [];
  let boundary = null, count = 0;
  const cfg = run?.cfg || {};
  const every = Number.isFinite(Number(cfg.every)) && Number(cfg.every) >= 1 ? Math.floor(Number(cfg.every)) : POMO_DEFAULTS.every;
  while (next?.running && Number.isFinite(next.endAt) && next.endAt > 0 && now >= next.endAt && count < limit) {
    const mode = next.mode || "focus";
    const at = next.endAt;
    const id = mode + "@" + at;
    const focus = mode === "focus" || mode === "custom";
    const cycle = Math.max(0, Number(next.cycle) || 0) + (focus ? 1 : 0);
    const focusMode = focus ? mode : next.focusMode === "custom" ? "custom" : "focus";
    const nextMode = focus ? cycle % every === 0 ? "long" : "short" : focusMode;
    if (focus) {
      const d = new Date(at);
      const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      blocks.push({ id: "pomo:" + id, d: date, ts: at, min: pomoDurationMinutes(mode, cfg), cat: next.cat || "ostatni", note: next.note || "" });
    }
    const duration = pomoDurationMinutes(nextMode, cfg) * 60;
    next = { ...next, cycle, focusMode, mode: nextMode, startAt: at, endAt: at + duration * 1000, remaining: duration, running: true };
    boundary = { bid: id, konec: mode, zacatek: nextMode, kdy: at };
    count += 1;
  }
  return { run: next, blocks, boundary, count, catchingUp: !!(next?.running && Number.isFinite(next.endAt) && now >= next.endAt) };
}

// Only an identity verified in this mounted session can own a timer. A brief
// recheck or lost connection must not interrupt that owner's local controls.
export function pomoAccountScope(session, localOwner) {
  return session?.owner && session.owner === localOwner && session.member === true
    && ["ready", "checking", "offline"].includes(session.status) ? session.owner : null;
}

export function appendPomoBlocks(collection, list, today) {
  const seen = new Set((collection.pomoLog || []).map(block => block.id));
  const blocks = (list || []).filter(block => {
    if (!block?.id || seen.has(block.id)) return false;
    seen.add(block.id);
    return true;
  });
  if (!blocks.length) return collection;
  const stats = collection.pomoStats || { total: 0, days: {} };
  const days = { ...(stats.days || {}) };
  for (const block of blocks) {
    const date = block.d || today;
    days[date] = (days[date] || 0) + 1;
  }
  return { ...collection, pomoLog: [...blocks, ...(collection.pomoLog || [])], pomoStats: { total: (stats.total || 0) + blocks.length, days } };
}

// A null scope means identity is not verified. Never read another person's
// runtime or consume their completed-block queue while accounts are changing.
export function createPomoStorage(storage, getScope = () => "") {
  const key = name => { const scope = getScope(); return scope == null ? null : scope ? `${name}__owner_${scope}` : name; };
  return {
    read(name, fallback = null) {
      try { const k = key(name); return k ? JSON.parse(storage.getItem(k) || "null") ?? fallback : fallback; } catch { return fallback; }
    },
    write(name, value) {
      const k = key(name);
      if (!k) return false;
      if (value == null) storage.removeItem(k); else storage.setItem(k, JSON.stringify(value));
      return true;
    },
  };
}
