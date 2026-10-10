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

// Both apps start with the same owner-approved product habits. An explicit
// personal selection (including an empty list) remains authoritative.
export function clientHabitDefinitions(collection, _days, defaultDefinitions) {
  return Array.isArray(collection?.habitDefs) ? collection.habitDefs : defaultDefinitions;
}
