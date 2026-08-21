// ======================================================================
// TRAINING SYSTEM V2 · the vocabulary
// ----------------------------------------------------------------------
// Plain ES modules, no JSX and no TypeScript syntax, for one reason: the
// test runner is `node --test` with no transform step, so every rule in
// here can be imported and executed by a test exactly as the app runs it.
// Nothing in this folder may import React, touch the DOM, or read a
// global. A calculation that cannot be run outside the render is a
// calculation nobody can check.
// ======================================================================

// The version stamped INTO the data, not into a localStorage boolean. A
// flag can be lost; a version travels with the document it describes, so
// a reset can never run twice and can never fail to run once.
export const TRAINING_SCHEMA_VERSION = 2;

// The one key the whole V2 domain lives under. Everything the reset may
// touch is inside it; everything outside it is somebody else's data.
export const TRAINING_KEY = "tv2";

// Where the pre-V2 training subtree is parked before it is cleared. It is
// never read at render time, never restored automatically, and holds
// nothing from outside the training domain.
export const LEGACY_BACKUP_KEY = "tanmay_training_legacy_backup_v1";

// The legacy collection keys the reset is allowed to clear. This list is
// the whole permission: anything not named here is out of scope, and the
// non-training guard test asserts it.
export const LEGACY_TRAINING_KEYS = ["tWo", "tPl", "tLog", "tSer", "tPlActive", "tProg"];

// tDays is not cleared — a day may carry a note that is not training.
// Only its `items` array is training, and only that is emptied.
export const LEGACY_DAY_SUBKEY = "items";

// ---- sets ------------------------------------------------------------
// `work` is the default and the only one the row editor offers without
// asking. The rest come out of a small menu, because a session that shows
// six set types on every row is a spreadsheet, not a practice.
export const SET_TYPES = ["warmup", "work", "drop", "failure", "backoff", "technique"];
export const SET_TYPE_LABEL = {
  warmup: ["Rozehřátí", "Warm-up"],
  work: ["Pracovní", "Work"],
  drop: ["Dropset", "Drop set"],
  failure: ["Do selhání", "To failure"],
  backoff: ["Odlehčená", "Back-off"],
  technique: ["Technická", "Technique"],
};
// One letter on a phone row. A word would eat the width the numbers need.
export const SET_TYPE_MARK = { warmup: "R", work: "", drop: "D", failure: "F", backoff: "B", technique: "T" };
// Only these count as the training dose. A warm-up is preparation, a
// technique set is a rehearsal; counting either as volume flatters the
// number and teaches the wrong thing.
export const WORKING_SET_TYPES = ["work", "drop", "failure", "backoff"];

// ---- groups · supersets, giant sets, circuits -------------------------
// A group is a RELATIONSHIP between exercise blocks. It is not the timed
// interval flow: that one owns the clock, this one owns the order.
export const GROUP_MODES = ["superset", "giant_set", "circuit", "alternating"];
export const GROUP_MODE_LABEL = {
  superset: ["Superserie", "Superset"],
  giant_set: ["Giant set", "Giant set"],
  circuit: ["Okruh", "Circuit"],
  alternating: ["Střídavě", "Alternating"],
};

// ---- session lifecycle -----------------------------------------------
export const SESSION_STATES = ["planned", "running", "done", "abandoned"];

// ---- effort ----------------------------------------------------------
// Úsilí dne survives V2 unchanged. RIR is a per-set coaching number;
// this is the whole session, reflected on once. They are not the same
// question and one does not replace the other.
export const EFFORT_STEPS = [50, 70, 85, 100];

// ---- RIR -------------------------------------------------------------
// 0 to 5, and "5+" for everything further away than that. A number past
// five is a guess dressed as a measurement.
export const RIR_MIN = 0;
export const RIR_MAX = 5;

// ---- product role · what an exercise IS FOR, never where it came from --
// Provenance answers "who brought this in". Role answers "what may the
// product do with it". Conflating them is the defect this rebuild fixes:
// a dumbbell bench press does not become programme-only by arriving with
// somebody's programme.
export const PRODUCT_ROLES = ["CORE", "EXTENDED", "SPECIALIST", "PROGRAM_ONLY", "YOGA", "CATALOG", "BREATH", "ARCHIVE", "ALIAS", "ACTIVITY"];

// The tier vocabulary the audited library already uses, mapped to the
// product role above. One resolver reads both, so there is still one
// source of truth and not two competing ones.
export const TIER_TO_ROLE = {
  core: "CORE",
  extended: "EXTENDED",
  specialist: "SPECIALIST",
  program_only: "PROGRAM_ONLY",
  yoga: "YOGA",
  catalog: "CATALOG",
  breath: "BREATH",
  archived: "ARCHIVE",
  activity: "ACTIVITY",
};

// Roles a generic generated plan may draw from without being told to.
export const GENERIC_ROLES = ["CORE", "EXTENDED"];

// ---- atlas boundary ---------------------------------------------------
// A new exercise is not part of the original master list and must never
// be numbered into it. It says so on its own record, and the resolver
// reads that instead of guessing from a name.
export const ATLAS_STATUS = { ORIGINAL: "original_master", PENDING: "extension_pending" };
