#!/usr/bin/env node
// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/repo-scripts/shared-check.mjs
// Change it there, then run `npm run shared:sync` in the outer workspace.
//
// ---------------------------------------------------------------------------
// KONTROLA ZRCADLA · běží UVNITŘ aplikačního repozitáře
// ---------------------------------------------------------------------------
// Cloudflare staví jen tenhle repozitář. Kanonický zdroj v pracovním prostoru
// při buildu neexistuje, takže se nedá porovnat proti němu — porovnáváme proti
// manifestu, který sync vygeneroval a který je commitnutý vedle zrcadla.
//
// Selže, když:
//   · zrcadlený soubor chybí
//   · někdo ho v repozitáři ručně změnil (hash nesedí)
//   · manifest zná soubor, který tu není, nebo naopak
//   · verze jádra v manifestu nesedí s verzí v src/shared/version.js
//   · do zrcadla se dostala soukromá značka osobní aplikace

import { readFileSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST = join(ROOT, "src/shared/manifest.json");

const PRIVATE_MARKERS = [
  "JOURNAL_FULL", "NOTEBOOK_FULL", "BOOKS_FULL", "SOC_DOCS",
  "MANDALA_STUDY", "PageFinances", "PageKlienti", "PageSocsite",
  "tanmay-data\"", "AsistentPanel", "coachPrivateNote",
];

const sha = (s) => createHash("sha256").update(s).digest("hex");
const readN = (p) => readFileSync(p, "utf8").replace(/\r\n/g, "\n");

if (!existsSync(MANIFEST)) {
  console.error("shared:check FAIL · src/shared/manifest.json chybí — spusť `sync-product-core.mjs sync` v pracovním prostoru");
  process.exit(1);
}

const m = JSON.parse(readN(MANIFEST));
const problems = [];

const vfile = join(ROOT, "src/shared/version.js");
if (!existsSync(vfile)) problems.push("src/shared/version.js chybí");
else {
  const decl = readN(vfile).match(/SHARED_CORE_VERSION\s*=\s*"([^"]+)"/);
  if (!decl) problems.push("src/shared/version.js nedeklaruje SHARED_CORE_VERSION");
  else if (decl[1] !== m.sharedCoreVersion) {
    problems.push(`verze jádra ${decl[1]} ≠ manifest ${m.sharedCoreVersion}`);
  }
}

for (const rel of Object.keys(m.files || {})) {
  const p = join(ROOT, rel);
  if (!existsSync(p)) { problems.push(`${rel}: zrcadlo chybí`); continue; }
  const text = readN(p);
  const got = sha(text);
  // Tenhle skript ten seznam značek nese sám — nescanuje se.
  const exempt = rel === "scripts/shared-check.mjs";
  if (got !== m.files[rel]) {
    problems.push(`${rel}: ručně změněné zrcadlo (${got.slice(0, 12)} ≠ ${String(m.files[rel]).slice(0, 12)})`);
  }
  if (!exempt) for (const marker of PRIVATE_MARKERS) {
    if (text.indexOf(marker) !== -1) problems.push(`${rel}: soukromá značka ${marker}#${sha(marker).slice(0, 12)}`);
  }
}

if (problems.length) {
  console.error("shared:check FAIL");
  for (const p of problems) console.error("  · " + p);
  process.exit(1);
}
console.log(`shared:check OK · jádro ${m.sharedCoreVersion} · ${Object.keys(m.files).length} zrcadlených souborů`);
