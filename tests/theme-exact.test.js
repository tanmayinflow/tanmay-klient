// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/repo-tests/theme-exact.test.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// BRÁNA PŘESNÝCH KOTEV (V3 §6).
//
// Volitelná paleta smí nést JEN barvy z dodané reference. Tenhle test projde
// každý token každé volitelné palety, vytáhne z něj základní barvu (hex
// přímo, u rgba trojici kanálů, u stínu všechny barevné výskyty) a tvrdí, že
// patří do povolené množiny:
//
//   · přesné kotvy té palety,
//   · průhlednost přesné kotvy,
//   · servisní Ink / Linen — jen tam, kde to specifikace výslovně dovoluje
//     (Americano a chai; ostatní palety jen pro značkové konstanty),
//   · sdílené stavové barvy,
//   · transparent.
//
// Nová odvozená plocha, HSL rampa, color-mix uložený jako token nebo
// „skoro stejná" náhrada tady spadne jménem tokenu, který ji přinesl.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  OPTIONAL_PRESET_IDS, appearancePreset, resolveTheme, statusPalette,
  FUNCTIONAL, BRAND, UTILITY,
} from "../src/shared/ui/themeRegistry.js";
import { ratio } from "../src/shared/ui/contrast.js";

/* Značkové konstanty a stavové role jsou sdílený systém, ne barvy palety.
   Copper je značka (plát Atlasu, značkové stopy), stavová čtveřice nese
   význam napříč domem. */
const EXEMPT_NAMES = new Set([
  "mode", "polarity",
  "brandCopper", "brandLinen", "brandForest", "atlasFrame",
  "successFg", "successBg", "warningFg", "warningBg",
  "errorFg", "errorBg", "infoFg", "infoBg",
  "danger", "info", "success", "warning",
]);

const STATUS_HEXES = new Set(
  [...Object.values(FUNCTIONAL.light), ...Object.values(FUNCTIONAL.dark)].map((h) => h.toUpperCase()),
);

const rgbaToHex = (m) => {
  const [r, g, b] = [m[1], m[2], m[3]].map(Number);
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("").toUpperCase();
};

function basesOf(value) {
  const out = [];
  for (const m of String(value).matchAll(/#([0-9a-fA-F]{6})\b/g)) out.push("#" + m[1].toUpperCase());
  for (const m of String(value).matchAll(/rgba?\((\d+),\s*(\d+),\s*(\d+)/g)) out.push(rgbaToHex(m));
  return out;
}

test("volitelná paleta nese jen přesné kotvy své reference", () => {
  const fails = [];
  for (const id of OPTIONAL_PRESET_IDS) {
    const preset = appearancePreset(id);
    const t = resolveTheme(id, false);
    const allowed = new Set(Object.values(preset.anchors).map((h) => h.toUpperCase()));
    /* Servisní inkousty: Americano je výslovná výjimka specifikace; ostatním
       paletám se lněný servis nepouští do tokenů vůbec. */
    if (id === "americano-chai") {
      allowed.add(UTILITY.ink.toUpperCase());
      allowed.add(UTILITY.linen.toUpperCase());
    }
    for (const [name, value] of Object.entries(t)) {
      if (EXEMPT_NAMES.has(name)) continue;
      if (typeof value !== "string") { fails.push(`${id}.${name}: není řetězec`); continue; }
      if (value === "transparent") continue;
      for (const base of basesOf(value)) {
        if (allowed.has(base)) continue;
        if (STATUS_HEXES.has(base)) continue;
        fails.push(`${id}.${name}: ${base} není kotva reference`);
      }
    }
  }
  assert.deepEqual(fails, [], fails.join("\n"));
});

test("kotvy jsou doslova ty z referencí", () => {
  const expect = {
    "slate-clay-pantone": ["#243746", "#DBD6D1", "#BDBDBD", "#A57051"],
    "monument-clay": ["#26303B", "#9A694E", "#EBEBDD"],
    "sand-burnt-earth": ["#D3C7AD", "#28374A", "#754437", "#6B6751"],
    "garnet-slate": ["#6E2C29", "#F7DEC1", "#364857"],
    "shikon-fossil": ["#282227", "#493C3C", "#6D5B57", "#9B7E6D", "#D0B08F"],
    "volcanic-grey": ["#292A2A", "#414445", "#5C6263", "#8F9295", "#BEC0C2"],
    "americano-chai": ["#1E1D1D", "#5A4D41", "#7E6957", "#867C70", "#303031"],
    "quiet-ledger-night": ["#191919", "#202020", "#252525", "#2F2F2F", "#373737",
      "#F0EFED", "#ADA9A3", "#D3C7AD", "#28374A", "#754437", "#6B6751"],
    /* thangky · pigmenty, ne dodaná reference; kotvy jsou přesto pevné */
    "nagtang-black": ["#141311", "#1C1A17", "#25221D", "#2E2A24", "#EDE3CC", "#C9BBA0", "#D4A54A", "#B6402A", "#4F7FC4", "#3E8B6A"],
    "martang-red": ["#2A1210", "#3A1813", "#48201A", "#5A2A22", "#F2E6CF", "#D9C4A3", "#E0B356", "#C8432B", "#5D8BD3", "#4C9C79"],
    "sertang-gold": ["#EADBAE", "#D9C58A", "#F1E6C4", "#F6EED6", "#F8F2E0", "#2B1E12", "#4A3A28", "#A63A22", "#244A86", "#2E7A5B", "#7A5A14"],
    "mineral-pigments": ["#F1EADB", "#EAE1CD", "#F8F3E8", "#FBF7EE", "#FFFDF7", "#1F1A16", "#4B4238", "#1E3F73", "#2F7A5C", "#B8402B", "#9A7420"],
  };
  for (const [id, anchors] of Object.entries(expect)) {
    const got = Object.values(appearancePreset(id).anchors).map((h) => h.toUpperCase()).sort();
    assert.deepEqual(got, anchors.map((h) => h.toUpperCase()).sort(), id);
  }
});

test("žádný gradient, žádný color-mix, žádná HSL rampa v tokenech", () => {
  for (const id of OPTIONAL_PRESET_IDS) {
    const t = resolveTheme(id, false);
    for (const [name, value] of Object.entries(t)) {
      if (typeof value !== "string") continue;
      assert.ok(!/gradient|color-mix|hsl\(/i.test(value), `${id}.${name}: ${value.slice(0, 60)}`);
    }
  }
});

test("servisní len nese v Americanu písmo, ne plochy", () => {
  const t = resolveTheme("americano-chai", false);
  assert.equal(t.text, UTILITY.linen, "běžné písmo je servisní len");
  assert.equal(t.interactiveOnAccent, UTILITY.ink, "popisek na lněném tlačítku je servisní inkoust");
  // Plochy zůstávají přesné kotvy — len se nesmí stát novým polem.
  for (const k of ["background", "navigation", "surface", "card", "documentSurface"]) {
    assert.notEqual(t[k].toUpperCase(), UTILITY.linen.toUpperCase(), k);
  }
});

test("hlína, allspice, blackish green a roast nenesou běžné písmo", () => {
  const zakazane = {
    "slate-clay-pantone": ["#A57051"],
    "monument-clay": ["#9A694E"],
    "sand-burnt-earth": ["#6B6751"],
    "shikon-fossil": ["#9B7E6D", "#6D5B57"],
    "volcanic-grey": ["#5C6263"],
    "americano-chai": ["#867C70", "#7E6957", "#5A4D41"],
    "quiet-ledger-night": ["#754437", "#6B6751", "#28374A"],
    /* rumělka, malachit ani auripigment nenesou běžné písmo — zlato smí jen v noci na sazích a laku */
    "nagtang-black": ["#B6402A", "#3E8B6A", "#4F7FC4"],
    "martang-red": ["#C8432B", "#4C9C79", "#5D8BD3"],
    "sertang-gold": ["#2E7A5B", "#7A5A14", "#D9C58A"],
    "mineral-pigments": ["#2F7A5C", "#B8402B", "#9A7420"],
  };
  for (const [id, hexes] of Object.entries(zakazane)) {
    const t = resolveTheme(id, false);
    for (const role of ["text", "textSecondary", "textMuted", "placeholder", "heading", "link"]) {
      for (const bad of hexes) {
        assert.ok(!String(t[role]).toUpperCase().startsWith(bad.toUpperCase()),
          `${id}.${role} nese ${bad} — ta barva na běžné písmo nestačí`);
      }
    }
  }
});

test("Tichý zápis: žádný starý signál, jen čtyřbarevný jazyk reference", () => {
  const FORBIDDEN = ["#2383E2", "#529CCA", "#4DAB9A", "#FFDC49", "#FF7369",
    "#6A9FBA", "#72A37F", "#D6A347", "#D98470"];
  const t = resolveTheme("quiet-ledger-night", false);
  const s = statusPalette("quiet-ledger-night");
  for (const [name, value] of [...Object.entries(t), ...Object.entries(s)]) {
    if (typeof value !== "string") continue;
    for (const base of basesOf(value)) {
      assert.ok(FORBIDDEN.indexOf(base) === -1,
        `quiet-ledger-night.${name}: ${base} je zakázaný starý signál`);
    }
  }
  // A signální jazyk jsou přesně čtyři barvy — nic pátého.
  const signals = new Set([s.infoBg, s.successBg, s.warningBg, s.errorBg].map((h) => h.toUpperCase()));
  assert.deepEqual([...signals].sort(), ["#28374A", "#6B6751", "#754437", "#D3C7AD"]);
});

test("Tichý zápis: povinné přístupné páry drží AA", () => {
  const pairs = [
    ["#D3C7AD", "#28374A"], // Areia na Azulu — info, vybraný stav
    ["#28374A", "#D3C7AD"], // Azul na Areii — varování
    ["#D3C7AD", "#754437"], // Areia na Terra — chyba
    ["#F0EFED", "#6B6751"], // světlé písmo na Verde — úspěch
  ];
  for (const [fg, bg] of pairs) {
    assert.ok(ratio(fg, bg) >= 4.5, `${fg} na ${bg}: ${ratio(fg, bg)} < 4.5`);
  }
});
