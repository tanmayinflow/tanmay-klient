// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/product/roles.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// ----------------------------------------------------------------------
// ROLE A CAPABILITY · jedna vrstva, ne stovky podmínek
// ----------------------------------------------------------------------
// Dům je jeden. Role rozhoduje, které dveře v něm existují — ne CSS, ne
// schovaná cesta, ne vypnuté tlačítko. Kdo se ptá „smím?", ptá se tady,
// jednou, a dostane hotový objekt.
//
// Capability se odvozuje ze serverem ověřené role a z modulů, které si
// člověk sám zapnul. Klient si ji nepřepíše localStorage ani adresou:
// v klientském sestavení je `role` zamrazená na "client" už při buildu a
// Main-only kód v tom balíku není.

export const ROLES = Object.freeze({ COACH: "coach", CLIENT: "client" });

/** Místnosti, které klientská aplikace má vždycky. */
export const CLIENT_ALWAYS = Object.freeze(["praxe", "trenink", "terminy", "kompas", "prameny"]);

/** Místnosti, které si klient zapíná sám a které jsou ve výchozím stavu vypnuté. */
export const CLIENT_OPTIONAL = Object.freeze(["denik", "zapisnik", "memento"]);

/** Místnosti, které v klientské aplikaci nikdy nejsou. Ne skryté — nejsou. */
export const CLIENT_NEVER = Object.freeze([
  "klienti", "hospodareni", "socsite", "mandala", "asistent",
]);

/** Infrastruktura. Není to praxe, žije pod mapou domu. */
export const CLIENT_INFRA = Object.freeze(["nastaveni", "pruvodce", "kos"]);

const CAP_KEYS = Object.freeze([
  // místnosti
  "practice", "training", "booking", "compass", "sources",
  "journal", "notebook", "memento",
  // činnosti
  "editTrainingPrescription", "viewTrainingResults",
  "manageClients", "manageAvailability", "managePackages",
  "manageContent", "manageFinances",
  "consciousShareHabits", "consciousShareGoals", "consciousShareTraining",
]);

export function emptyCapabilities() {
  const out = {};
  for (const k of CAP_KEYS) out[k] = false;
  return out;
}

export function capabilityKeys() {
  return CAP_KEYS.slice();
}

/**
 * Jediné místo, kde capability vzniká.
 *
 * @param {object} input
 * @param {"coach"|"client"} input.role   ověřená role (u klienta zamrazená buildem)
 * @param {boolean} input.member          má členství? bez něj nemá nic
 * @param {string[]|null} input.modules   moduly, které si klient zapnul (null = ještě nevybral)
 * @param {object} input.share            přepínače vědomého sdílení
 * @returns {object} zmrazený objekt capability
 */
export function deriveCapabilities(input) {
  const role = input && input.role === ROLES.COACH ? ROLES.COACH : ROLES.CLIENT;
  const caps = emptyCapabilities();

  if (role === ROLES.COACH) {
    for (const k of CAP_KEYS) caps[k] = true;
    // Trenér nemá cestu k soukromému psaní klienta. Vlastní Deník a Zápisník
    // v Main App žijí, ale to je jeho vlastní místnost, ne klientova.
    caps.consciousShareHabits = false;
    caps.consciousShareGoals = false;
    caps.consciousShareTraining = false;
    return Object.freeze(caps);
  }

  const member = !!(input && input.member);
  if (!member) return Object.freeze(caps);

  const mods = Array.isArray(input && input.modules) ? input.modules : null;
  const on = (key) => {
    if (CLIENT_ALWAYS.indexOf(key) !== -1) return true;
    if (CLIENT_OPTIONAL.indexOf(key) === -1) return false;
    return !!(mods && mods.indexOf(key) !== -1);
  };

  caps.practice = on("praxe");
  caps.training = on("trenink");
  caps.booking = on("terminy");
  caps.compass = on("kompas");
  caps.sources = on("prameny");
  caps.journal = on("denik");
  caps.notebook = on("zapisnik");
  caps.memento = on("memento");

  caps.viewTrainingResults = true;   // vlastní výsledky, ne cizí
  caps.editTrainingPrescription = false;
  caps.manageClients = false;
  caps.manageAvailability = false;
  caps.managePackages = false;
  caps.manageContent = false;
  caps.manageFinances = false;

  const share = (input && input.share) || {};
  caps.consciousShareHabits = !!share.habits && caps.practice;
  caps.consciousShareGoals = !!share.goals && caps.compass;
  caps.consciousShareTraining = !!share.training && caps.training;

  return Object.freeze(caps);
}

/** Mapa místnost → capability. Router i mapa domu se ptají téhle jediné tabulky. */
export const ROOM_CAPABILITY = Object.freeze({
  praxe: "practice",
  atomic: "practice",
  trenink: "training",
  terminy: "booking",
  kompas: "compass",
  oblasti: "compass",
  cile: "compass",
  prameny: "sources",
  denik: "journal",
  zapisnik: "notebook",
  memento: "memento",
  klienti: "manageClients",
  hospodareni: "manageFinances",
  socsite: "manageContent",
});

/** Vidí tahle role tuhle místnost? Infrastruktura je vidět vždy. */
export function roomVisible(caps, key) {
  if (CLIENT_INFRA.indexOf(key) !== -1) return true;
  const cap = ROOM_CAPABILITY[key];
  if (!cap) return false;
  return !!caps[cap];
}

/** Moduly, které klientská aplikace vůbec smí nabídnout k zapnutí. */
export function clientSelectableModules() {
  return CLIENT_OPTIONAL.slice();
}

/**
 * Migrace starší volby modulů na model V2.
 * Nezapíná nic, co si člověk nezapnul, a nevypíná nic, co měl. Místnosti,
 * které jsou nově vždy k dispozici, ze seznamu prostě zmizí — drží je
 * CLIENT_ALWAYS, ne uložená volba. Hospodaření se z klientské volby
 * odstraňuje, protože ta místnost v klientském domě není.
 */
export function migrateClientModules(stored) {
  if (!Array.isArray(stored)) return null;      // ještě nevybral · uvítání rozhodne
  const keep = [];
  for (const k of stored) {
    if (CLIENT_OPTIONAL.indexOf(k) !== -1 && keep.indexOf(k) === -1) keep.push(k);
  }
  return keep;
}
