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

// These names come from this repository's historical HABIT_DEFS, by slot:
// f53b811: original English defaults; 6828e46: first bilingual defaults.
// The intermediate 5b7ea52 set is deliberately not a seed here: its slots
// have different meanings (for example slot 1 was movement, not brand work).
const LEGACY_HABIT_NAMES = [
  ['Reflect and prepare', 'Ztišení a příprava'],
  ['Business movement', 'Rozvoj značky', 'Growing the brand'],
  ['Artist journey', 'Tvorba', 'Making art'],
  ['Physical training', 'Trénink těla', 'Training the body'],
  ['Strictly limit screen time', 'Limit obrazovek', 'Screen time limit'],
  ['Study meaningfully', 'Hluboké studium', 'Deep study'],
  ['Yoga / Stretching', 'Jóga a protažení', 'Yoga and stretch'],
  ['Meditate curiously', 'Meditace', 'Meditation'],
  ['Healthy nutrition', 'Poctivá strava', 'Honest food'],
];
const LEGACY_HABIT_PAIRS = [
  ['Ztišení a příprava', 'Reflect and prepare'],
  ['Rozvoj značky', 'Growing the brand'],
  ['Tvorba', 'Making art'],
  ['Trénink těla', 'Training the body'],
  ['Limit obrazovek', 'Screen time limit'],
  ['Hluboké studium', 'Deep study'],
  ['Jóga a protažení', 'Yoga and stretch'],
  ['Meditace', 'Meditation'],
  ['Poctivá strava', 'Honest food'],
];

// Editing or reordering one habit used to save resolved .name on every row,
// freezing even untouched defaults in that language and release. Resolve only
// exact known default names for the same slot; real renames stay authoritative.
// This is a read projection, not a migration of the server document. Order,
// icons, archived rows, missing/deleted slots and explicit emptiness survive.
export function clientHabitDefinitions(collection, _days, defaultDefinitions) {
  if (!Array.isArray(collection?.habitDefs)) return defaultDefinitions;
  const definitions = collection.habitDefs;
  let changed = false;
  const resolved = definitions.map(entry => {
    if (!entry || !Number.isInteger(entry.slot)) return entry;
    const current = defaultDefinitions.find(item => item.slot === entry.slot);
    if (!current?.cz || !current?.en) return entry;
    const legacy = LEGACY_HABIT_NAMES[entry.slot] || [];
    const legacyPair = LEGACY_HABIT_PAIRS[entry.slot];
    const defaultName = entry.name === current.cz || entry.name === current.en || legacy.includes(entry.name);
    const defaultPair = !entry.name && (
      (entry.cz === current.cz && entry.en === current.en) ||
      (legacyPair && entry.cz === legacyPair[0] && entry.en === legacyPair[1])
    );
    if (!defaultName && !defaultPair) return entry;
    if (entry.cz === current.cz && entry.en === current.en && !Object.hasOwn(entry, 'name')) return entry;
    const next = { ...entry, cz: current.cz, en: current.en };
    delete next.name;
    changed = true;
    return next;
  });
  return changed ? resolved : definitions;
}
