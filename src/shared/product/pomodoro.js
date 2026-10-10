// Timer preferences and completed blocks belong to the current account.
export const POMO_DEFAULTS = Object.freeze({ focus: 25, short: 5, long: 15, every: 4, sound: true, bg: null, voice: "bowl", vol: 1 });

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
