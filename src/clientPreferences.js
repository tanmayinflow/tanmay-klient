// Resolve the launch destination once, after the verified document is loaded.
// Later preference edits, delivery refreshes and account changes must not move
// a person away from the page where they are already working.
export function createClientStartupNavigation() {
  let consumed = false;
  return ({ ready, owner, changed = false, interacted = false, preferred, requested, available = [] }) => {
    if (consumed || !ready || !owner) return null;
    consumed = true;
    if (changed || interacted) return { room: null };
    return { room: [requested, preferred].find(room => room && available.includes(room)) || null };
  };
}

// New clients choose their own habits. Older clients without explicit
// definitions still need the original slot meanings for recorded history.
export function clientHabitDefinitions(collection, days, legacyDefinitions) {
  if (Array.isArray(collection?.habitDefs)) return collection.habitDefs;
  const recorded = Object.values(days || {}).some(day => Array.isArray(day?.h) && day.h.some(value => value === 1 || value === 2));
  return recorded ? legacyDefinitions : [];
}
