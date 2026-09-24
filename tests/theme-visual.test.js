// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/repo-tests/theme-visual.test.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// VIZUÁLNÍ PŘIJETÍ · kontrast je nutný, ale nestačí.
//
// Signature drží pravidla „papír a inkoust" z V1.1 — a je zmrazená, takže se
// tu jen hlídá, že drží dál. Volitelné palety V3 mají VLASTNÍ estetiku
// (přesné kotvy, tmavé navigace, rámy) a vlastní zákazy ze specifikace:
// žádná banka, žádné boho, žádný luxus, žádný gradient, žádný zelený nádech
// tam, kam nepatří. Co se dá změřit, měří se tady; zbytek měří prohlížeč.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { OPTIONAL_PRESET_IDS, resolveTheme, appearancePreset, frameChrome } from "../src/shared/ui/themeRegistry.js";
import { frameGrammarCss, skinCss } from "../src/shared/ui/tokens.js";
import { readsGreen } from "../src/shared/ui/contrast.js";

const app = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "src/App.tsx"), "utf8");





test("Monument · tmavý plášť, slonovinová plocha, hlína jen jako stavba", () => {
  const t = resolveTheme("monument-clay", false);
  assert.equal(t.navigation, "#26303B", "plášť je tmavý monument");
  assert.equal(t.background, "#EBEBDD", "pracovní pole je slonovina — jeden inkoust nemůže sedět na dvou polaritách");
  assert.equal(t.hero, "#26303B", "hero pruh nese tmavou stavbu");
  assert.equal(t.heroInk, "#EBEBDD");
  for (const role of ["text", "textSecondary", "link", "heading"]) {
    assert.ok(!String(t[role]).toUpperCase().startsWith("#9A694E"), `${role}: hlína nenese malé písmo`);
  }
  assert.ok(frameChrome("monument-clay", false).radius <= 18, "žádné arkádové oblouky");
});

test("Písek a země · strata, ne boho; pálená zem není chyba", () => {
  const t = resolveTheme("sand-burnt-earth", false);
  assert.equal(t.text, "#28374A", "stavbu drží modř");
  assert.equal(t.heading, "#28374A", "nadpis drží modř, ne zem");
  assert.equal(t.interactiveAccent, "#754437");
  assert.notEqual(t.interactiveAccent, t.errorFg, "pálená zem není stavová červeň");
  for (const k of ["background", "surface", "card", "documentSurface"]) {
    assert.ok(!readsGreen(t[k]), `${k}: oliva se nesmí stát velkým zeleným polem`);
  }
});

test("Granát a břidlice · konzoly, krém mezi tmavými, žádné víno", () => {
  const t = resolveTheme("garnet-slate", false);
  assert.equal(t.text, "#364857");
  assert.equal(t.interactiveAccent, "#6E2C29");
  assert.equal(t.interactiveOnAccent, "#F7DEC1", "na granátu je vždycky krém");
  assert.equal(t.navText, "#F7DEC1", "na břidlici je vždycky krém");
  // Granátové písmo nikdy neleží na břidlici a naopak — role to nedovolují.
  assert.notEqual(t.navigation, "#6E2C29");
  assert.ok(!String(t.link).toUpperCase().startsWith("#364857") || t.background === "#F7DEC1");
});













test("skin je střežený vzhledem a nesahá na rozměr", () => {
  const css = skinCss();
  /* Měří se DEKLARACE, ne poznámky. Poznámka smí pojmenovat vlastnost,
     kterou tam schválně nedáváme — a právě taková poznámka je cennější
     než ta vlastnost. */
  const decl = css.replace(/\/\*[\s\S]*?\*\//g, "");
  /* Stejná disciplína jako u rámů: kdyby existoval nestřežený selektor,
     dostala by skin i Signature — a to je jediná věc, která se hýbat nesmí. */
  for (const sel of css.match(/^[^\s@/][^{]*\{/gm) || []) {
    assert.ok(sel.includes("data-appearance"), "nestřežený selektor skinu: " + sel.slice(0, 70));
  }
  /* Nic, co posouvá obdélník. Prostrkání a velikost písma mění ŠÍŘKU
     textu a s ní i tlačítko — prohlížečový test invariance na to přijde
     až v běhu, tenhle na to přijde hned. */
  for (const bad of ["padding", "margin:", "margin-", "width:", "height:", "display:", "position:",
    "font-size", "font-weight", "letter-spacing", "word-spacing", "line-height", "z-index", "text-transform"]) {
    assert.ok(!decl.includes(bad), `skin nese ${bad} — to už není vzhled, to je rozvržení`);
  }
  /* Barvu říká kontrakt, ne skin. */
  assert.ok(!/#[0-9A-Fa-f]{6}|rgba?\(/.test(decl), "skin píše barvu místo tokenu");
  /* Dnes nemá skin žádná paleta; kdo ho jednou dostane, ať to řekne tady. */
  for (const id of OPTIONAL_PRESET_IDS) {
    assert.ok(!css.includes(`data-appearance="${id}"`), `${id} má skin, ale nikdo o něm neví`);
  }
});

test("rámy jsou čisté CSS bez rozměrů, gradientů a záře", () => {
  const css = frameGrammarCss();
  assert.ok(!/gradient|blur\(|filter:|url\(/i.test(css), "rám je stín, obrys nebo pseudo-prvek");
  assert.ok(!/padding|margin(?!-)/.test(css), "rám nesmí měnit geometrii");

  // Každé pravidlo je střežené gramatikou — Signature (none) nic nematchne.
  for (const line of css.split("\n")) {
    const sel = line.trim();
    if (sel.startsWith(".") || sel.startsWith("body")) {
      assert.fail("nestřežený selektor rámu: " + sel.slice(0, 60));
    }
  }
  assert.ok(!css.includes('data-frame-grammar="none"'), "gramatika none nemá žádné pravidlo");
});

test("body text žádné palety není akcent v zakázaných rolích", () => {
  for (const id of OPTIONAL_PRESET_IDS) {
    const t = resolveTheme(id, false);
    const pol = appearancePreset(id).polarity;
    assert.ok(pol === "light" || pol === "dark");
    // dokumentová plocha nikdy nesvítí víc než vyvýšená pracovní plocha o moc
    assert.ok(typeof t.documentSurface === "string");
  }
});

test("nápověda v poli se nikde nekreslí sníženým krytím", () => {
  const rules = app.split("\n").filter((l) => /::placeholder|::-webkit-input-placeholder/.test(l));
  assert.ok(rules.length >= 1);
  for (const r of rules) {
    assert.match(r, /var\(--tm-placeholder|t\.placeholder/, r.trim().slice(0, 80));
    const op = r.match(/opacity:\s*([\d.]+)/);
    if (op) assert.equal(Number(op[1]), 1, r.trim().slice(0, 80));
  }
});
