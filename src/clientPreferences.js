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
// The intermediate 5b7ea52 set has different slot meanings. It is handled
// separately below, only as an exact untouched set without habit history.
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

// Exact HABIT_DEFS from 5b7ea52, whose defaults were {slot, icon, name}.
// Never reinterpret these slots once used: movement is not brand work.
const UNUSED_GENERIC_HABITS = [
  ['🌅', 'Ranní praxe'],
  ['💪', 'Pohyb'],
  ['🔥', 'Meditace'],
  ['🌿', 'Čas venku'],
  ['📵', 'Limit obrazovek'],
  ['📖', 'Čtení'],
  ['🥗', 'Jídlo s pozorností'],
  ['✍️', 'Večerní reflexe'],
  ['😴', 'Spánek před půlnocí'],
];
const DAY_FIELDS_WITHOUT_HABIT_HISTORY = new Set(['h', 's', 'sched', 'note', 'plan', 'tasks', 'wb', 'd']);
const isRecord = value => value !== null && typeof value === 'object' &&
  (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);

function isUntouchedGenericSet(definitions) {
  return definitions.length === UNUSED_GENERIC_HABITS.length && UNUSED_GENERIC_HABITS.every(([icon, name], slot) => {
    const row = definitions[slot];
    return isRecord(row) && Object.keys(row).length === 3 &&
      Object.hasOwn(row, 'slot') && Object.hasOwn(row, 'icon') && Object.hasOwn(row, 'name') &&
      row.slot === slot && row.icon === icon && row.name === name;
  });
}

function hasOnlyUnrecordedHabitDays(days) {
  // Absence, arrays, aggregate records and unfamiliar persisted shapes are not
  // evidence of unused slots. Ordinary notes/body entries can coexist safely.
  if (!isRecord(days)) return false;
  return Object.entries(days).every(([date, day]) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !isRecord(day) ||
      Object.keys(day).some(key => !DAY_FIELDS_WITHOUT_HABIT_HISTORY.has(key))) return false;
    if (!Object.hasOwn(day, 'h')) return true;
    // Spreading also exposes sparse holes as undefined. Only numeric zero is
    // proven empty; 1, 2, strings, null and unknown states preserve the set.
    return Array.isArray(day.h) && [...day.h].every(value => value === 0);
  });
}

// The owner-checked, hydrated App adopts this collection before interaction.
// Persisting the definitions is essential: a render-only replacement would
// revert to the old meanings immediately after the first newly checked habit.
// No day data is changed; unfamiliar or already used sets are returned intact.
export function prepareClientUnusedHabitAdoption(collection, days, defaultDefinitions) {
  if (!isRecord(collection) || !Array.isArray(collection.habitDefs) ||
    !Array.isArray(defaultDefinitions) || !isUntouchedGenericSet(collection.habitDefs) ||
    !hasOnlyUnrecordedHabitDays(days)) return collection;
  return { ...collection, habitDefs: defaultDefinitions.map(entry => ({ ...entry })) };
}

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
