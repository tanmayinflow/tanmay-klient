// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/repo-tests/theme-bootstrap.test.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// PŘED PRVNÍM VYKRESLENÍM · žádné bliknutí cizího motivu.
//
// Skript v index.html nese vlastní kopii POLE každé rodiny — jinak by musel
// stáhnout modul, a to je po prvním pixelu. Kopie je tím pádem druhý zdroj
// pravdy a přesně proto tady stojí test: rejstřík je autorita a jakýkoli
// rozchod shodí build, ne až telefon.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { THEME_FAMILIES, THEME_FAMILY_IDS } from "../src/shared/ui/themeRegistry.js";
import { APPEARANCE_KEY, LEGACY_THEME_KEY } from "../src/shared/ui/appearance.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(join(root, "index.html"), "utf8");
const worker = readFileSync(join(root, "worker/index.js"), "utf8");

const inline = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)];

test("index.html má právě jeden vložený skript a CSP na něj sedí", () => {
  assert.equal(inline.length, 1, "otisk v CSP pokrývá jeden skript, ne dva");
  const hash = "sha256-" + createHash("sha256").update(inline[0][1], "utf8").digest("base64");
  const inCsp = worker.match(/INDEX_INLINE_SCRIPT_HASH = "([^"]+)"/);
  assert.ok(inCsp, "Worker musí otisk nést");
  assert.equal(inCsp[1], hash, "otisk v CSP nesedí na skript v index.html · aplikace by se neotevřela");
});

test("mapa polí v pre-paintu sedí na rejstřík, rodinu po rodině", () => {
  const src = inline[0][1];
  for (const f of THEME_FAMILIES) {
    const m = src.match(new RegExp(`"${f.id}"\\s*:\\s*\\[\\s*"(#[0-9A-Fa-f]{6})"\\s*,\\s*"(#[0-9A-Fa-f]{6})"\\s*\\]`));
    assert.ok(m, `pre-paint nezná rodinu ${f.id}`);
    assert.equal(m[1].toUpperCase(), f.light.background.toUpperCase(), `${f.id}: denní pole se rozešlo`);
    assert.equal(m[2].toUpperCase(), f.dark.background.toUpperCase(), `${f.id}: noční pole se rozešlo`);
  }
  const known = (src.match(/"[a-z-]+"\s*:\s*\[/g) || []).length;
  assert.equal(known, THEME_FAMILY_IDS.length, "pre-paint zná jiný počet rodin než rejstřík");
});

test("pre-paint čte obě verze volby a umí systémový režim", () => {
  const src = inline[0][1];
  assert.match(src, new RegExp(APPEARANCE_KEY.replace(/[-]/g, "\\-")), "nová volba se musí číst");
  assert.match(src, new RegExp(LEGACY_THEME_KEY.replace(/[-]/g, "\\-")), "starý klíč se musí číst taky");
  assert.match(src, /prefers-color-scheme: dark/, "režim „automaticky\" musí umět odpovědět před vykreslením");
  assert.match(src, /data-theme-family/);
  assert.match(src, /data-color-mode/);
  assert.match(src, /theme-color/);
  // Rozbité úložiště nesmí zastavit start.
  assert.ok((src.match(/catch \(e\)/g) || []).length >= 2, "čtení úložiště musí být obalené");
});

test("skript nesahá na nic, co v tu chvíli ještě neexistuje", () => {
  const src = inline[0][1];
  assert.equal(/document\.getElementById\("root"\)/.test(src), false);
  assert.equal(/import\s|require\(/.test(src), false, "pre-paint nesmí nic načítat ze sítě");
});
