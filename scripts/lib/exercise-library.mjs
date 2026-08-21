// Reads the exercise library out of the single-file app source and returns it as
// data. This is the ONE authority every check in this repo uses: the arrays it
// evaluates are the same literals the app ships, so a check can never pass against
// a copy that has drifted from what the app actually renders.
//
// It does not grep. It extracts the declaration and evaluates it, so a malformed
// literal fails here loudly instead of silently matching a regex.
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
// Rozšíření V2 je skutečný modul, takže se importuje, ne vyřezává ze zdroje.
import { TRAINING_V2_META, extensionFor } from "../../src/training/catalogV2.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA_CTX = vm.createContext(Object.create(null));
export const APP_PATH = resolve(HERE, "../../src/App.tsx");

export const SEED_NAMES = [
  "TEX_SEED", "TEX_SEED_2", "TEX_SEED_3", "TEX_SEED_4", "TEX_SEED_4B",
  "TEX_SEED_5", "TEX_SEED_5B", "TEX_SEED_6", "TEX_SEED_7", "TEX_SEED_8",
  "TEX_SEED_8B", "TEX_SEED_8C", "TEX_SEED_9", "TEX_SEED_SM", "TEX_SEED_CM",
  "TEX_SEED_VI",
];

// Osmnáct — respektive tady šestnáct — původních polí je původní seznam a jeho
// pořadí. Rozšíření je vždy poslední a nikdy se mezi ně nevkládá.
export const EXTENSION_NAME = "TEX_SEED_V2";
export const ORIGINAL_COUNT = 271;

function readSource() {
  return readFileSync(APP_PATH, "utf8");
}

// Pull `const NAME = <literal>;` out of the source by matching brackets, then evaluate
// it. Only array and object literals are ever asked for, so the sandbox is empty.
// A scanner that understands what it is walking past: strings, template literals,
// line comments and block comments. Without the comment cases an apostrophe inside
// a prose comment opens a string that never closes, and the slice runs to the end
// of the file — which is exactly how this was first written, and it was wrong.
function scan(src, from, onChar) {
  let i = from, inStr = null, esc = false, line = false, block = false;
  for (; i < src.length; i++) {
    const c = src[i], d = src[i + 1];
    if (line) { if (c === "\n") line = false; continue; }
    if (block) { if (c === "*" && d === "/") { block = false; i += 1; } continue; }
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === inStr) inStr = null;
      continue;
    }
    if (c === "/" && d === "/") { line = true; i += 1; continue; }
    if (c === "/" && d === "*") { block = true; i += 1; continue; }
    if (c === '"' || c === "'" || c === "`") { inStr = c; continue; }
    const stop = onChar(c, i);
    if (stop) return i;
  }
  return -1;
}

function extract(src, name, optional) {
  const re = new RegExp("^const " + name + "\\s*(?::[^=\\n]+)?=\\s*", "m");
  const m = re.exec(src);
  if (!m) {
    if (optional) return null;
    throw new Error(`exercise-library: ${name} not found in ${APP_PATH}`);
  }
  const start = m.index + m[0].length;
  const open = src[start];
  const close = open === "[" ? "]" : open === "{" ? "}" : null;
  if (!close) throw new Error(`exercise-library: ${name} is not an array or object literal`);
  let depth = 0;
  const end = scan(src, start, (c) => {
    if (c === open) { depth += 1; return false; }
    if (c === close) { depth -= 1; return depth === 0; }
    return false;
  });
  if (end < 0) throw new Error(`exercise-library: unbalanced literal for ${name}`);
  // ONE context for every literal in the file. Two contexts mean two Object
  // prototypes, and then two objects with identical contents are not deepStrictEqual
  // — which is a property of the reader, not of the library.
  return vm.runInContext("(" + src.slice(start, end + 1) + ")", DATA_CTX, { timeout: 5000 });
}

let cache = null;

export function loadLibrary() {
  if (cache) return cache;
  const src = readSource();
  const seeds = {};
  for (const name of SEED_NAMES) seeds[name] = extract(src, name);

  const all = [];
  for (const name of SEED_NAMES) for (const ex of seeds[name]) all.push({ ...ex, seed: name });
  const ext = extensionFor(all.map((x) => x.id));
  seeds[EXTENSION_NAME] = ext;
  for (const ex of ext) all.push({ ...ex, seed: EXTENSION_NAME });

  const taxonomy = {
    patterns: extract(src, "T_PATTERNS"),
    equipment: extract(src, "T_EQUIP"),
    muscles: extract(src, "T_MUSCLES"),
    joints: extract(src, "T_JOINTS"),
    limiters: extract(src, "T_LIMITERS"),
  };
  // Present from the audited schema onwards; optional so this loader can also read
  // a pre-audit checkout and report the baseline.
  // Auditní literál si drží své jméno; rozšíření se slučuje nahoře, přesně jako
  // v aplikaci — a bez provenience, která na klientskou stranu nepatří.
  const metaBase = extract(src, "TEX_META_BASE", true) || extract(src, "TEX_META", true);
  const metaV2 = Object.fromEntries(Object.entries(TRAINING_V2_META).map(([id, m]) => {
    const out = {};
    for (const k of Object.keys(m)) { if (k !== "src" && k !== "ev") out[k] = m[k]; }
    return [id, out];
  }));
  const meta = metaBase ? { ...metaBase, ...metaV2 } : null;
  const tiers = extract(src, "TEX_TIERS", true);
  const statuses = extract(src, "TEX_STATUSES", true);
  const goalRoles = extract(src, "TEX_GOAL_ROLES", true);
  const sessionBlocks = extract(src, "TEX_SESSION_BLOCKS", true);
  const genRules = extract(src, "TEX_GEN_RULES", true);
  const precautions = extract(src, "TEX_PRECAUTIONS", true);

  cache = { src, seeds, all, byId: Object.fromEntries(all.map((x) => [x.id, x])), taxonomy,
    meta, tiers, statuses, goalRoles, sessionBlocks, genRules, precautions };
  return cache;
}

// ---- the engine, in a sandbox ------------------------------------------------
// The generator is a pure function of the library plus a request, and the only way
// to test what it will actually hand somebody is to run it. So: pull the exact
// top-level declarations it depends on out of App.tsx, in source order, and
// evaluate them together. No React, no DOM, no mock of the thing under test.
const ENGINE_DECLS = [
  "uid",
  "T_PATTERNS", "T_PAT", "T_LEVELS", "T_DEMANDS", "T_DEMAND", "TP_CEIL", "T_POPS", "T_POP",
  "T_EQUIP", "T_EQ", "tCatOf", "tRecOf",
  "T_JOINTS", "T_J0", "T_STRAIGHTARM", "tJOf", "tJMax", "tJointsOf",
  "tSOf", "tCOf", "tLvlOf",
  "T_LIMITERS", "T_LIMITER", "T_LIMITER_OVERRIDE", "tLimiterOf", "tRateLimitWeeks",
  "T_MUSCLES", "T_MUS",
  "TEX_TIERS", "TEX_STATUSES", "TEX_GOAL_ROLES", "TEX_SESSION_BLOCKS", "TEX_GEN_RULES",
  "TEX_GEN_GENERIC", "TEX_PRECAUTIONS", "TEX_TIER_LABEL",
  "TEX_TIERS_DEFAULT", "TEX_TIERS_ADVANCED", "tExOnDefaultShelf", "tExOnShelf",
  "TEX_ARCHIVED_NOTE", "TEX_ARCHIVED_ALT", "TEX_ALIAS_GROUP_LABEL",
  "TEX_META_BASE",
  "tMetaOf", "tExCustomReady", "tPick", "tTierOf", "tStatusOf", "tGenRuleOf",
  "tRoleOf", "tBlockOf", "tPrepJointsOf", "tSkillClassOf", "tIsSkill", "tIsCoordSkill",
  "tArmModeOf", "tTendonOf", "tIsStraightArm", "tTissueRecOf", "tSkillFreqOf",
  "tAliasOf", "tCanonIdOf", "tAliasGroupOf", "tFamilyOf", "tCtxOf",
  "tRequiresCoach", "tPrecautionsOf", "tHasPrecaution",
  "tIsCatalog", "tIsArchived", "tIsProgramOnly", "tGenericEligible", "tTargetEligible",
  "tExNameCz", "tExNameEn", "tExSearchText",
  "TP_GOALS", "tpMergeGoals", "TP_GOAL",
  "TP_INJURIES", "TP_INJURY", "tpVerdict", "tpEase", "TP_VOL", "TP_SPLITS", "TP_KIND_PATS",
  "tpRank", "tpPick", "tpChainRung", "tpWhyLost", "tpMinutes", "tpGenerate",
];

// `const NAME = …;` or `function NAME(…) {…}`, matched by brackets so a nested
// literal or a template string cannot end the slice early.
function sliceDecl(src, name) {
  const balanced = (from, open, close) => {
    let depth = 0;
    const end = scan(src, from, (c) => {
      if (c === open) { depth += 1; return false; }
      if (c === close) { depth -= 1; return depth === 0; }
      return false;
    });
    if (end < 0) throw new Error("exercise-library: unbalanced " + open + " in " + name);
    return end;
  };
  let m = new RegExp("^(const|let) " + name + "\\s*(?::[^=\\n]+)?=\\s*", "m").exec(src);
  if (m) {
    let depth = 0;
    const end = scan(src, m.index + m[0].length, (c) => {
      if (c === "(" || c === "[" || c === "{") { depth += 1; return false; }
      if (c === ")" || c === "]" || c === "}") { depth -= 1; return false; }
      return c === ";" && depth === 0;
    });
    if (end < 0) throw new Error("exercise-library: no end of declaration " + name);
    return src.slice(m.index, end + 1);
  }
  m = new RegExp("^function " + name + "\\s*\\(", "m").exec(src);
  if (!m) throw new Error("exercise-library: engine declaration not found: " + name);
  const parEnd = balanced(m.index + m[0].length - 1, "(", ")");
  const bodyStart = src.indexOf("{", parEnd);
  return src.slice(m.index, balanced(bodyStart, "{", "}") + 1);
}

let engine = null;

export function loadEngine() {
  if (engine) return engine;
  const { src } = loadLibrary();
  const parts = ENGINE_DECLS.map((n) => sliceDecl(src, n));
  const sandbox = { console, TextEncoder, JSON, Math, Date, Object, Array, Number, String, Set, Map,
    TV: { TRAINING_V2_META, extensionFor } };
  vm.createContext(sandbox);
  // `const` at the top level of a script is lexically scoped, not a property of the
  // context — so the script hands the names out itself on the last line.
  // TEX_META je v aplikaci sloučení, takže je sloučením i tady — deklarované
  // za vyřezanými literály a před vším, co ho čte.
  const merged = "const TEX_META = { ...TEX_META_BASE, ...Object.fromEntries(Object.entries(TV.TRAINING_V2_META).map(function (e) { var m = e[1], out = {}; Object.keys(m).forEach(function (k) { if (k !== 'src' && k !== 'ev') out[k] = m[k]; }); return [e[0], out]; })) };";
  const expose = "globalThis.__engine = { " + ENGINE_DECLS.join(", ") + ", TEX_META };";
  const idx = ENGINE_DECLS.indexOf("TEX_META_BASE");
  const body = parts.slice(0, idx + 1).join("\n") + "\n" + merged + "\n" + parts.slice(idx + 1).join("\n");
  vm.runInContext(body + "\n" + expose + "\n", sandbox, { timeout: 20000 });
  engine = sandbox.__engine;
  return engine;
}

export function seedOrder() {
  const { seeds } = loadLibrary();
  const ids = [];
  for (const name of SEED_NAMES) for (const ex of seeds[name]) ids.push(ex.id);
  return ids;
}

export function fullOrder() {
  const { all } = loadLibrary();
  return all.map((x) => x.id);
}
