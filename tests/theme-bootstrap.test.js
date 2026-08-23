// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/repo-tests/theme-bootstrap.test.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// PŘED PRVNÍM VYKRESLENÍM.
//
// Vložený skript v `index.html` nastaví pole, atributy a barvu prohlížeče
// dřív, než React vůbec začne. Nese vlastní kopii mapy polí, protože v tu
// chvíli žádný modul ještě neexistuje — a právě proto se ta kopie musí hlídat.
//
// Skript rozumí VŠEM TŘEM generacím uložené volby. Kdyby uměl jen tu nejnovější,
// bliklo by v den nasazení napříč celou instalovanou základnou.
//
// A protože Worker pouští vložený skript otiskem, hlídá se i ten: rozejde-li
// se otisk se skriptem, CSP ho zablokuje a aplikace se neotevře.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FIXED_PRESET_IDS, PRESET_FIELDS, appearancePreset, resolveTheme } from "../src/shared/ui/themeRegistry.js";
import { APPEARANCE_KEY, LEGACY_APPEARANCE_KEY, LEGACY_THEME_KEY } from "../src/shared/ui/appearance.js";

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

test("mapa polí v pre-paintu sedí na rejstřík, vzhled po vzhledu", () => {
  const src = inline[0][1];
  for (const id of FIXED_PRESET_IDS) {
    const m = src.match(new RegExp(`"${id}"\\s*:\\s*"(#[0-9A-Fa-f]{6})"`));
    assert.ok(m, `pre-paint nezná vzhled ${id}`);
    assert.equal(m[1].toUpperCase(), PRESET_FIELDS[id].toUpperCase(), `${id}: pole se rozešlo`);
    assert.equal(m[1].toUpperCase(), resolveTheme(id, false).background.toUpperCase());
  }
  const known = (src.match(/"[a-z-]+"\s*:\s*"#[0-9A-Fa-f]{6}"/g) || []).length;
  assert.equal(known, FIXED_PRESET_IDS.length, "pre-paint zná jiný počet vzhledů než rejstřík");
});

test("pre-paint čte všechny tři generace volby a umí systém", () => {
  const src = inline[0][1];
  for (const key of [APPEARANCE_KEY, LEGACY_APPEARANCE_KEY, LEGACY_THEME_KEY]) {
    assert.match(src, new RegExp(key.replace(/[-]/g, "\\-")), `pre-paint nečte klíč ${key}`);
  }
  assert.match(src, /prefers-color-scheme: dark/, "automatika musí umět odpovědět před vykreslením");
  assert.match(src, /data-appearance/);
  assert.match(src, /data-color-mode/);
  assert.match(src, /color-scheme/);
  assert.match(src, /theme-color/);
  // Rozbité úložiště nesmí zastavit start.
  assert.ok((src.match(/catch \(e\)/g) || []).length >= 2, "čtení úložiště musí být obalené");
});

test("migrační tabulka v pre-paintu sedí na tu v rejstříku", () => {
  const src = inline[0][1];
  const pairs = [
    ["river-mist", "river-night"], ["teal-parchment", "teal-night"],
    ["mulberry-paper", "mulberry-paper"], ["atlantic-sky", "slate-clay"],
    ["clay-alabaster", "sand-earth"], ["olive-gold", "sand-earth"],
  ];
  for (const [family, preset] of pairs) {
    assert.match(src, new RegExp(`"${family}"\\s*:\\s*"${preset}"`), `pre-paint nepřevede rodinu ${family}`);
  }
  assert.match(src, /"signature"\s*:\s*\{[^}]*"light"\s*:\s*"signature-day"[^}]*\}/);
  assert.match(src, /"dark"\s*:\s*"signature-night"/);
});

test("polarita v pre-paintu sedí na rejstřík", () => {
  const src = inline[0][1];
  const dark = FIXED_PRESET_IDS.filter((id) => appearancePreset(id).polarity === "dark");
  const list = src.match(/var N = \[([^\]]*)\]/);
  assert.ok(list, "pre-paint nemá seznam nočních vzhledů");
  const claimed = list[1].split(",").map((x) => x.trim().replace(/"/g, "")).filter(Boolean);
  assert.deepEqual(claimed.sort(), [...dark].sort(), "pre-paint zná jiné noční vzhledy než rejstřík");
});

test("skript nesahá na nic, co v tu chvíli ještě neexistuje", () => {
  const src = inline[0][1];
  assert.ok(!/document\.getElementById\("root"\)\.(?!style)/.test(src), "kořen ještě není vykreslený");
  assert.ok(!/\bimport\b/.test(src), "pre-paint nesmí nic importovat");
  assert.ok(!/=>/.test(src), "pre-paint zůstává v ES5, protože běží dřív než cokoli jiného");
});
