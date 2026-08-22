#!/usr/bin/env node
// ---------------------------------------------------------------------------
// HRANICE BALÍKU · co se nesmí objevit v klientském sestavení
// ---------------------------------------------------------------------------
// Schovat není totéž co nemít. Tenhle skript čte hotový `dist/` — tedy přesně
// to, co se posílá do prohlížeče — a hledá stopy osobní aplikace: soukromé
// psaní, hospodaření, správu klientů, tvorbu obsahu, osobní Mandalu,
// asistenta a vazbu na osobní databázi.
//
// Nález nikdy nevypisuje nalezený text. Jen značku, její otisk a místo.
//
//   npm run privacy:bundle        (běží i v `npm run check`)
//
// Návratový kód 1 = v balíku je něco, co tam nepatří.

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");

// Značka = jméno, vzor, a proč tu nesmí být. Vzory jsou záměrně konkrétní:
// obecné slovo („journal") by hlásilo klientův vlastní Deník, který tam patří.
const MARKERS = [
  { name: "main-journal-seed",    re: /\bJOURNAL_FULL\b/,        why: "osobní Deník Tanmaye" },
  { name: "main-notebook-seed",   re: /\bNOTEBOOK_FULL\b/,       why: "osobní Zápisník Tanmaye" },
  { name: "main-books-seed",      re: /\bBOOKS_FULL\b/,          why: "osobní Prameny Tanmaye" },
  { name: "content-planner-docs", re: /\bSOC_DOCS\b/,            why: "tvorba obsahu" },
  { name: "content-planner-room", re: /\bPageSocsite\b/,         why: "tvorba obsahu" },
  { name: "finance-room",         re: /\bPageFinances\b/,        why: "hospodaření" },
  { name: "finance-jars",         re: /\bJAR_NAZEV\b|\bWISH_CATS\b/, why: "hospodaření" },
  { name: "client-admin-room",    re: /\bPageKlienti\b/,         why: "správa klientů" },
  { name: "client-admin-roster",  re: /\bKlRosterCard\b/,        why: "seznam jiných klientů" },
  { name: "coach-api",            re: /\/api\/klienti/,          why: "trenérská cesta" },
  { name: "coach-plan-write",     re: /\/api\/klient-plan/,      why: "zápis plánu je trenérova věc" },
  { name: "personal-mandala",     re: /\bMANDALA_STUDY\b|\bTmMandalaWheel\b/, why: "osobní Mandala" },
  { name: "ai-assistant",         re: /\bAsistentPanel\b|\basDoOpenAI\b/,     why: "asistent" },
  { name: "main-database",        re: /["'`]tanmay-data["'`]/,   why: "vazba na osobní databázi" },
  { name: "main-files-bucket",    re: /["'`]tanmay-files["'`]/,  why: "vazba na osobní úložiště" },
  { name: "pomodoro",             re: /\bPomodoroTimer\b/,       why: "pomodoro se do klientského domu nepřenáší" },
  { name: "stale-palette",        re: /\bTHEME_ATELIER\b|\bTHEME_BRAND\b|\bTM_PALETTE\b/, why: "vyřazená paleta" },
  // Vlna 2 · trenérova strana Kompasu a Pramenů. Klient smí číst svoje cíle
  // a prameny, ale nesmí mít v balíku obrazovku, kterou je někdo zadává,
  // ani trenérovu poznámku k cíli.
  { name: "coach-direction-room", re: /\bKlTabSmer\b/,          why: "trenérská obrazovka Směru" },
  { name: "coach-goal-note",      re: /\bcoachPrivateNote\b|\bCOACH_PRIVATE_GOAL_FIELDS\b/, why: "trenérova poznámka u cíle" },
  { name: "coach-goal-validate",  re: /\bvalidateCoachGoals\b|\bvalidateCoachSources\b/, why: "server-side validace zadání trenéra" },
  { name: "coach-client-row",     re: /\bcoachClientRow\b/,     why: "trenérská projekce klientského řádku" },
];

function files(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) out.push(...files(p));
    else if ([".js", ".mjs", ".css", ".html", ".webmanifest", ".json"].indexOf(extname(n)) !== -1) out.push(p);
  }
  return out;
}

if (!existsSync(DIST)) {
  console.error("privacy:bundle FAIL · dist/ neexistuje — spusť nejdřív `npm run build`");
  process.exit(1);
}

const list = files(DIST);
if (!list.length) {
  console.error("privacy:bundle FAIL · dist/ je prázdný");
  process.exit(1);
}

const hits = [];
for (const f of list) {
  const text = readFileSync(f, "utf8");
  const rel = f.slice(ROOT.length + 1);
  for (const m of MARKERS) {
    const found = text.match(m.re);
    if (found) {
      hits.push({
        marker: m.name,
        why: m.why,
        at: rel,
        // Otisk nálezu, ne nález. Do reportu se soukromý text nepíše.
        hash: createHash("sha256").update(found[0]).digest("hex").slice(0, 16),
        offset: text.indexOf(found[0]),
      });
    }
  }
}

console.log(`privacy:bundle · prohledáno ${list.length} souborů v dist/`);
if (hits.length) {
  console.error("PRIVATE MAIN DATA FOUND: YES");
  for (const h of hits) console.error(`  · ${h.marker} (${h.why}) — ${h.at} @${h.offset} #${h.hash}`);
  process.exit(1);
}
console.log("PRIVATE MAIN DATA FOUND: NO");
