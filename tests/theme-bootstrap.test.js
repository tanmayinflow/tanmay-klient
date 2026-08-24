// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/repo-tests/theme-bootstrap.test.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// PŘED PRVNÍM VYKRESLENÍM.
//
// Vložený skript v `index.html` nastaví pole, barvu lišty, polaritu a ŘEČ
// RÁMŮ dřív, než React vůbec začne. Nese vlastní kopie map z rejstříku —
// a právě proto se tu každá z nich kontroluje proti živému rejstříku:
// pole, lišta (Monument má tmavý plášť), noční seznam, gramatiky, migrační
// tabulka zrušených palet V2 i rodin V1. A CSP otisk, bez kterého by se
// aplikace vůbec neotevřela.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  FIXED_PRESET_IDS, PRESET_FIELDS, PRESET_THEME_COLORS, PRESET_GRAMMARS, appearancePreset,
} from "../src/shared/ui/themeRegistry.js";
import { APPEARANCE_KEY, LEGACY_APPEARANCE_KEY, LEGACY_THEME_KEY } from "../src/shared/ui/appearance.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(join(root, "index.html"), "utf8");
const worker = readFileSync(join(root, "worker/index.js"), "utf8");

const inline = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)];

test("index.html má právě jeden vložený skript a CSP na něj sedí", () => {
  assert.equal(inline.length, 1);
  const hash = "sha256-" + createHash("sha256").update(inline[0][1], "utf8").digest("base64");
  const inCsp = worker.match(/INDEX_INLINE_SCRIPT_HASH = "([^"]+)"/);
  assert.ok(inCsp, "Worker musí otisk nést");
  assert.equal(inCsp[1], hash, "otisk v CSP nesedí na skript · aplikace by se neotevřela");
});

test("mapa polí sedí na rejstřík, vzhled po vzhledu", () => {
  const src = inline[0][1];
  for (const id of FIXED_PRESET_IDS) {
    const m = src.match(new RegExp(`"${id}"\\s*:\\s*"(#[0-9A-Fa-f]{6})"`));
    assert.ok(m, `pre-paint nezná vzhled ${id}`);
    assert.equal(m[1].toUpperCase(), PRESET_FIELDS[id].toUpperCase(), `${id}: pole se rozešlo`);
  }
});

test("lišta prohlížeče: kde se liší od pole, pre-paint to ví", () => {
  const src = inline[0][1];
  const tc = src.match(/var TC = \{([^}]*)\}/);
  assert.ok(tc, "pre-paint nemá mapu lišty");
  for (const id of FIXED_PRESET_IDS) {
    if (PRESET_THEME_COLORS[id] !== PRESET_FIELDS[id]) {
      assert.match(tc[1], new RegExp(`"${id}"\\s*:\\s*"${PRESET_THEME_COLORS[id]}"`, "i"), id);
    } else {
      assert.ok(!tc[1].includes(`"${id}"`), `${id} v mapě lišty nemá co dělat`);
    }
  }
});

test("noční seznam a gramatiky sedí na rejstřík", () => {
  const src = inline[0][1];
  const dark = FIXED_PRESET_IDS.filter((id) => appearancePreset(id).polarity === "dark");
  const list = src.match(/var N = \[([^\]]*)\]/);
  assert.ok(list);
  const claimed = list[1].split(",").map((x) => x.trim().replace(/"/g, "")).filter(Boolean);
  assert.deepEqual(claimed.sort(), [...dark].sort());
  const g = src.match(/var G = \{([^}]*)\}/);
  assert.ok(g, "pre-paint nezná řeči rámů");
  for (const id of FIXED_PRESET_IDS) {
    if (PRESET_GRAMMARS[id] !== "none") {
      assert.match(g[1], new RegExp(`"${id}"\\s*:\\s*"${PRESET_GRAMMARS[id]}"`), id);
    }
  }
  assert.match(src, /data-frame-grammar/, "gramatika se musí nastavit před prvním paintem");
});

test("migrační tabulky v pre-paintu sedí na rejstřík", () => {
  const src = inline[0][1];
  for (const [old, cil] of [
    ["slate-clay", "slate-clay-pantone"], ["sand-earth", "sand-burnt-earth"],
    ["smoke-spice", "shikon-fossil"], ["river-night", "volcanic-grey"],
    ["mulberry-paper", "garnet-slate"], ["teal-night", "signature-night"],
  ]) {
    assert.match(src, new RegExp(`"${old}"\\s*:\\s*"${cil}"`), `pre-paint nepřevede ${old}`);
  }
  for (const [family, cil] of [
    ["river-mist", "volcanic-grey"], ["teal-parchment", "signature-night"],
    ["atlantic-sky", "slate-clay-pantone"], ["clay-alabaster", "sand-burnt-earth"],
    ["olive-gold", "sand-burnt-earth"],
  ]) {
    assert.match(src, new RegExp(`"${family}"\\s*:\\s*"${cil}"`), `pre-paint nepřevede rodinu ${family}`);
  }
  for (const key of [APPEARANCE_KEY, LEGACY_APPEARANCE_KEY, LEGACY_THEME_KEY]) {
    assert.match(src, new RegExp(key.replace(/[-]/g, "\\-")), `pre-paint nečte klíč ${key}`);
  }
  assert.match(src, /prefers-color-scheme: dark/);
  assert.ok((src.match(/catch \(e\)/g) || []).length >= 2);
});

test("skript nesahá na nic, co v tu chvíli ještě neexistuje", () => {
  const src = inline[0][1];
  assert.ok(!/\bimport\b/.test(src));
  assert.ok(!/=>/.test(src), "pre-paint zůstává v ES5");
});
