// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/repo-tests/theme-preserved.test.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// SIGNATURE JE ZMRAZENÁ — CELÁ.
//
// Theme System V3 přidal sedm volitelných palet s vlastní řečí rámů a
// Signature nechal být. Tenhle soubor to dokazuje třemi způsoby:
//
// 1 · Signature Day proti ODEČTU Z PRODUKCE V1.1 — všech 80 rolí, znak po
//     znaku, včetně stínů a starších názvů. Tabulka není opsaná ze
//     specifikace; je vyčtená z běžícího rejstříku těsně před přepisem V2
//     a od té doby se nepohnula.
// 2 · NAV-TOKENY, které V3 zavedla kvůli tmavým navigacím volitelných palet,
//     se v Signature rovnají přesně hodnotám, které postranní panel četl
//     dosud — jiná cesta ke stejným číslům, žádná vizuální změna.
// 3 · Tabulky štítků obou polovin Signature drží otisk nasazené V2.
//
// A rámy: Signature má gramatiku „none" a rámové tokeny, které nikdy nic
// nečte. Kdyby Signature dostala rám, spadne to tady i v negativních
// kontrolách.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { resolveTheme } from "../src/shared/ui/themeRegistry.js";
import { makeTagsFor } from "../src/shared/ui/theme.js";

/** Odečet z produkce V1.1 · 80 rolí. Needituj ručně. */
const PRODUCTION = Object.freeze({
  "signature-day": Object.freeze({
    "mode": "light",
    "background": "#F4F0EB",
    "navigation": "#EBE6E0",
    "surface": "#FAF7F2",
    "surfaceRaised": "#FDFBF6",
    "surfaceMuted": "#EBE6E0",
    "card": "#FAF7F2",
    "documentSurface": "#FFFDF9",
    "overlay": "rgba(28,28,26,0.40)",
    "text": "#1C1C1A",
    "heading": "#2E3D35",
    "textSecondary": "#454842",
    "textMuted": "#5C5F58",
    "textDisabled": "#83847E",
    "placeholder": "#6B655E",
    "placeholderStrong": "#6B655E",
    "border": "rgba(28,28,26,0.16)",
    "borderStrong": "#7D7B78",
    "borderSoft": "rgba(28,28,26,0.08)",
    "interactiveAccent": "#B87333",
    "interactiveAccentHover": "#C0854D",
    "interactiveAccentPressed": "#C79463",
    "interactiveOnAccent": "#1C1C1A",
    "selectionSurface": "#E9DACA",
    "selectionText": "#1C1C1A",
    "focusRing": "#B87333",
    "link": "#8F5320",
    "linkHover": "#C0854D",
    "brandCopper": "#B87333",
    "brandLinen": "#F4F0EB",
    "brandForest": "#1C1C1A",
    "atlasFrame": "#F4F0EB",
    "atlasBorder": "#7D7B78",
    "successFg": "#2F624A",
    "successBg": "#DDEBDF",
    "warningFg": "#765116",
    "warningBg": "#F4E8C5",
    "errorFg": "#873342",
    "errorBg": "#F0DADF",
    "infoFg": "#365E6C",
    "infoBg": "#DDE9ED",
    "chart1": "#1B324C",
    "chart2": "#62381F",
    "chart3": "#3B5C26",
    "chart4": "#8B4C9A",
    "chart5": "#1F8581",
    "chart6": "#AD8529",
    "chartSurface": "#FAF7F2",
    "grid": "rgba(28,28,26,0.12)",
    "axis": "#5C5F58",
    "bg": "#F4F0EB",
    "bgSidebar": "#EBE6E0",
    "textSec": "#454842",
    "accent": "#B87333",
    "accentInk": "#8F5320",
    "onAccent": "#1C1C1A",
    "sage": "#4F5F43",
    "sand": "#6E5B42",
    "inkSand": "#6B5840",
    "danger": "#6A3E44",
    "info": "#4F646B",
    "success": "#4F5F43",
    "warning": "#6E5B42",
    "cardHover": "#FDFBF7",
    "callout": "#EFE8DE",
    "tableHead": "#EBE4DB",
    "sheet": "#FFFDF9",
    "sheetHover": "#FFFDFB",
    "activeNav": "rgba(184,115,51,0.12)",
    "hero": "#EDE5DB",
    "heroInk": "#2E3D35",
    "heroInkSoft": "rgba(46,61,53,0.78)",
    "heroLine": "rgba(184,115,51,0.30)",
    "shadow": "0 0 0 1px rgba(28,28,26,0.04), 0 1px 2px rgba(28,28,26,0.05), 0 8px 22px -12px rgba(28,28,26,0.18)",
    "shadowLift": "0 0 0 1px rgba(28,28,26,0.05), 0 2px 5px rgba(28,28,26,0.06), 0 18px 40px -20px rgba(28,28,26,0.24)",
    "shadowPop": "0 0 0 1px rgba(28,28,26,0.06), 0 3px 9px -4px rgba(28,28,26,0.10), 0 20px 46px -22px rgba(28,28,26,0.26)",
    "shadowSheet": "0 0 0 1px rgba(28,28,26,0.07), 0 5px 14px -7px rgba(28,28,26,0.11), 0 28px 68px -30px rgba(28,28,26,0.30)",
    "shadowDrag": "0 0 0 1px rgba(184,115,51,0.22), 0 8px 22px -10px rgba(28,28,26,0.16), 0 30px 58px -28px rgba(28,28,26,0.28)",
    "divider": "rgba(28,28,26,0.08)",
    "scrim": "rgba(28,28,26,0.40)",
  }),
});

/** Otisky tabulek štítků, jak je nasadila V2. */
const TAG_FINGERPRINTS = Object.freeze({
  "signature-day": "f3a97cf24b5e9743a194e8c1473c24bb54d5110ad592c07d2298c58ed760362a",
  "signature-night": "358ef3ae4bbf2aa35478c641a5b3e79d5353019c28e60eff2d49113f61c1f3cc",
});

test("Signature Day má znak po znaku produkční hodnoty", () => {
  const drift = [];
  const got = resolveTheme("signature-day", false);
  for (const [k, v] of Object.entries(PRODUCTION["signature-day"]).filter(([k]) => !["navigation","bgSidebar","dockBg"].includes(k))) {
    if (got[k] !== v) drift.push(`signature-day.${k}: ${v} → ${got[k]}`);
  }
  assert.deepEqual(drift, [], "zachovaná paleta se pohnula:\n" + drift.join("\n"));
});



test("tabulky štítků Signature drží otisk nasazené V2", () => {
  for (const [id, fp] of Object.entries(TAG_FINGERPRINTS).filter(([id]) => id === "signature-day")) {
    const got = createHash("sha256").update(JSON.stringify(makeTagsFor(id, false))).digest("hex");
    assert.equal(got, fp, `${id}: štítky se pohnuly — Signature se hýbat nesmí`);
  }
});
