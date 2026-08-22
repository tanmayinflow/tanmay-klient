// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/product/rooms.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// ----------------------------------------------------------------------
// MÍSTNOSTI · jedno jméno pro obě aplikace
// ----------------------------------------------------------------------
// Klíč je úložiště a nikdy se nepřekládá. Česká a anglická verze jsou dvě
// redakce téhož jména, ne strojový překlad. Prameny zůstávají Prameny —
// „Materiály" je slovo z jiného domu.
export const ROOM_COPY = {
  praxe:        { cz: "Praxe",        en: "Practice" },
  trenink:      { cz: "Trénink",      en: "Training" },
  terminy:      { cz: "Termíny",      en: "Sessions" },
  kompas:       { cz: "Kompas",       en: "Compass" },
  prameny:      { cz: "Prameny",      en: "Sources" },
  denik:        { cz: "Deník",        en: "Journal" },
  zapisnik:     { cz: "Zápisník",     en: "Notebook" },
  memento:      { cz: "Memento mori", en: "Memento mori" },
  oblasti:      { cz: "Krajiny",      en: "Landscapes" },
  cile:         { cz: "Cíle",         en: "Goals" },
  atomic:       { cz: "Návyky",       en: "Habits" },
  kos:          { cz: "Koš",          en: "Trash" },
  nastaveni:    { cz: "Nastavení",    en: "Settings" },
  pruvodce:     { cz: "Průvodce",     en: "Guide" },
  // Main-only. Uvedené proto, aby se jméno nikde nerozešlo, ne proto,
  // aby je klientská aplikace směla vykreslit — o tom rozhoduje roles.js.
  klienti:      { cz: "Klienti",      en: "Clients" },
  hospodareni:  { cz: "Hospodaření",  en: "Stewardship" },
  socsite:      { cz: "Tvorba",       en: "Content" },
  mandala:      { cz: "Mandala",      en: "Mandala" },
};

// Věty, které musí znít stejně v obou domech.
export const COPY = {
  carryForward: { cz: "Co si nést dál",   en: "What to carry forward" },
  dayHeld:      { cz: "Den držen.",       en: "Day held." },
  goDeeper:     { cz: "Jít hlouběji",     en: "Go deeper" },
  eveningLook:  { cz: "Ohlédnutí",        en: "Looking back" },
  mentalHealth: { cz: "Duševní zdraví",   en: "Mental health" },
  inMotion:     { cz: "V pohybu",         en: "In motion" },
  todayStep:    { cz: "Dnešní krok",      en: "Today's step" },
};

export function roomName(key, lang) {
  const r = ROOM_COPY[key];
  if (!r) return key;
  return lang === "en" ? r.en : r.cz;
}

// ----------------------------------------------------------------------
// MAPA DOMU · skupiny bočního panelu
// ----------------------------------------------------------------------
// Skupiny jsou rytmus, ne kategorie: den, směr, paměť, volitelné, a pod tím
// vším infrastruktura. Obě aplikace kreslí tutéž mapu; liší se jen tím,
// které místnosti do ní role pustí.
export const NAV_MODEL = [
  { key: "den",       cz: "Den",           en: "Day",            rooms: ["praxe", "trenink", "terminy"] },
  { key: "smer",      cz: "Směr",          en: "Direction",      rooms: ["kompas"] },
  { key: "pamet",     cz: "Paměť",         en: "Memory",         rooms: ["denik", "zapisnik", "prameny"] },
  { key: "volitelne", cz: "Volitelně",     en: "Optional",       rooms: ["memento"] },
  { key: "svet",      cz: "Svět",          en: "World",          rooms: ["klienti", "hospodareni", "socsite"] },
];

// Pořadí doku na mobilu. Rezervace ani trénink nesmí spadnout do přetečení —
// proto stojí hned za Praxí a před vším volitelným.
export const DOCK_PRIORITY = ["praxe", "trenink", "terminy", "kompas", "prameny", "denik", "zapisnik", "memento"];

/** Mapa domu pro danou roli a zapnuté místnosti.
 *  `visible(key)` rozhoduje jediná capability vrstva (product/roles.js),
 *  tahle funkce jen skládá skupiny a zahazuje prázdné. */
export function navGroupsFor(visible) {
  const out = [];
  for (const g of NAV_MODEL) {
    const rooms = g.rooms.filter((k) => visible(k));
    if (rooms.length) out.push({ key: g.key, cz: g.cz, en: g.en, rooms });
  }
  return out;
}

/** Dok drží pořadí z DOCK_PRIORITY a nikdy nezavede obecné „Více". */
export function dockTabsFor(visible) {
  return DOCK_PRIORITY.filter((k) => visible(k));
}
