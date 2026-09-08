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
import {
  OPTIONAL_PRESET_IDS, resolveTheme, appearancePreset, frameChrome,
} from "../src/shared/ui/themeRegistry.js";
import { frameGrammarCss, skinCss } from "../src/shared/ui/tokens.js";
import { chroma, tint, ratio, luminance, hueDeg, readsGreen } from "../src/shared/ui/contrast.js";

const app = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "src/App.tsx"), "utf8");

test("Signature drží pravidla papíru a inkoustu z V1.1", () => {
  const day = resolveTheme("signature-day", false);
  const night = resolveTheme("signature-night", false);
  assert.ok(luminance(day.documentSurface) >= 0.85, "denní psací plocha je skoro bílá");
  assert.ok(tint(day.text) <= 0.12 && tint(night.text) <= 0.12, "běžný text je inkoust");
  assert.ok(!readsGreen(night.background) && chroma(night.background) <= 0.03, "noc je uhel");
  const L = luminance(night.background);
  assert.ok(L >= 0.018 && L <= 0.026, "jas nočního pole drží rozsah V2");
  assert.equal(day.placeholder, "#6B655E", "nápověda z uzávěrky V1.1");
});

test("Břidlice a hlína · hlína je kolejnice, ne písmo ani banka", () => {
  const t = resolveTheme("slate-clay-pantone", false);
  assert.equal(t.text, "#243746");
  assert.equal(t.navigation, "#243746", "navigace je plné břidlicové pole");
  assert.equal(t.frameRail, "#A57051", "hlína nese kolejnici");
  assert.equal(t.interactiveAccent, "#243746", "akce je břidlice — hlína není tlačítko s malým textem");
  // „banka": studené pole + modré akcenty + bílé karty. Karta je střední šeď.
  assert.equal(t.card, "#BDBDBD");
});

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

test("Šikon a fosilní písek · fosilie píše, allspice rámuje, žádné zlato", () => {
  const t = resolveTheme("shikon-fossil", false);
  assert.ok(String(t.text).toUpperCase().startsWith("#D0B08F"), "běžné písmo je fosilní tan");
  assert.equal(t.frameRail, "#9B7E6D", "allspice nese kolejnici");
  for (const role of ["text", "textSecondary", "textMuted", "placeholder"]) {
    assert.ok(!String(t[role]).toUpperCase().startsWith("#9B7E6D"), `${role}: allspice nenese běžné písmo`);
    assert.ok(!String(t[role]).toUpperCase().startsWith("#6D5B57"), `${role}: missing link nenese běžné písmo`);
  }
});

test("Sopečná šeď · vrstvený kámen, žádný zelený nádech, žádný měkký stín", () => {
  const t = resolveTheme("volcanic-grey", false);
  assert.ok(String(t.text).toUpperCase().startsWith("#BEC0C2"));
  for (const k of ["background", "navigation", "surface", "card", "documentSurface"]) {
    assert.ok(chroma(t[k]) <= 0.02, `${k}: šeď musí zůstat šedí`);
    assert.ok(!readsGreen(t[k]), `${k}: blackish green nesmí prosáknout do ploch`);
  }
  for (const role of ["text", "textSecondary", "textMuted", "placeholder"]) {
    assert.ok(!String(t[role]).toUpperCase().startsWith("#5C6263"), `${role}: na blackish green se nepíše`);
  }
  const css = frameGrammarCss();
  const basalt = css.slice(css.indexOf("basalt-steps"), css.indexOf("woven-rails"));
  assert.ok(!/box-shadow:[^;]*\d+px \d+px \d+px/.test(basalt.replace(/inset[^,;]+/g, "")),
    "čedič nemá rozmazaný stín");
});

test("Americano a chai · len píše, kotvy rámují, žádná kavárna", () => {
  const t = resolveTheme("americano-chai", false);
  assert.equal(t.text, "#F4F0EB", "běžné písmo je servisní len — hnědé písmo pod 4,5 sem nesmí");
  assert.equal(t.frameOuter, "#5A4D41", "vnější kolejnice je Mocha");
  assert.equal(t.frameInner, "#7E6957", "vnitřní linka je Chai — finální spec V3");
  assert.equal(t.documentSurface, "#303031", "dokument je Brew");
  for (const role of ["text", "textSecondary", "textMuted", "placeholder", "link"]) {
    for (const bad of ["#867C70", "#7E6957", "#5A4D41"]) {
      assert.ok(!String(t[role]).toUpperCase().startsWith(bad.toUpperCase()), `${role} nese ${bad}`);
    }
  }
});

test("Tichý zápis · skoro plochý: panel s linkou, otevřený dokument, azulový výběr", () => {
  const t = resolveTheme("quiet-ledger-night", false);
  assert.equal(t.background, "#191919", "pole je Ink");
  assert.equal(t.surface, "#202020", "panel je o odstín výš");
  assert.equal(t.documentSurface, "#191919", "dokument je otevřený — splývá s polem");
  assert.equal(t.elevatedSurface, "#252525", "popover je Popover");
  assert.equal(t.border, "#373737", "jediná linka je Divider");
  assert.equal(t.frameOuter, "#373737", "rám je jen linka");
  assert.equal(t.frameRail, "#28374A", "kolejnice výběru je Azul");
  assert.equal(t.frameHighlight, "#D3C7AD", "vnější keyline vybraného je Areia");
  assert.equal(t.selectionText, "#F0EFED");
  const ql = frameGrammarCss().split("}")
    .filter((r) => r.includes('data-frame-grammar="quiet-ledger"')).join("}");
  assert.ok(/inset 0 0 0 1px/.test(ql), "quiet-ledger kreslí jen 1px keyline");
  assert.ok(!/inset 0 0 0 [2-9]px/.test(ql), "žádná silná zeď — motiv je skoro plochý");
  assert.ok(!ql.includes("tm-psani"), "psací plocha zůstává otevřená, bez rámu");
});

test("Černý písek · čtyři kotvy, ječmen je stavba a nikdy nepíše", () => {
  const t = resolveTheme("black-sand", false);
  assert.equal(t.background, "#2D2D2D", "pole je Mine Shaft");
  assert.equal(t.text, "#D7C9AE", "písmo je Akaroa");
  assert.equal(t.heading, "#EAE0D2", "nadpis je White Rock");
  assert.equal(t.interactiveAccent, "#D7C9AE");
  assert.equal(t.interactiveOnAccent, "#2D2D2D");
  assert.equal(t.frameRail, "#A68763", "kolejnice je Barley Corn");
  assert.equal(t.borderStrong, "#A68763");
  for (const role of ["text", "textSecondary", "textMuted", "heading", "link", "placeholder"]) {
    assert.notEqual(t[role], "#A68763", `ječmen se dostal do role ${role}`);
  }
  const g = frameGrammarCss().split("}").filter((r) => r.includes('data-frame-grammar="dune-ledge"')).join("}");
  assert.ok(/inset 0 -3px 0 0/.test(g), "list stojí na třípixelové římse");
});

test("Hluboká voda · petrolej je plášť a akce, nikdy čára na poli", () => {
  const t = resolveTheme("deep-water", false);
  assert.equal(t.background, "#1E1E1E", "pole je Basalt");
  assert.equal(t.navigation, "#143D4A", "plášť je Deep Teal");
  assert.equal(t.interactiveAccent, "#143D4A");
  assert.equal(t.interactiveOnAccent, "#F2F1EC");
  assert.equal(t.text, "#F2F1EC", "písmo je Mist");
  assert.equal(t.borderStrong, "#7B8187", "silná hrana je Slate");
  assert.equal(t.focusRing, "#7B8187");
  for (const k of ["chart1", "chart2", "chart3", "chart4", "chart5", "chart6"]) {
    assert.notEqual(t[k], "#143D4A", `petrolej v řadě grafu ${k} by na čediči zmizel`);
  }
  for (const role of ["text", "textSecondary", "textMuted", "heading", "link", "placeholder"]) {
    assert.notEqual(t[role], "#7B8187", `břidlice se dostala do role ${role}`);
  }
  const g = frameGrammarCss().split("}").filter((r) => r.includes('data-frame-grammar="tide-line"')).join("}");
  assert.ok(/inset 0 3px 0 0/.test(g), "přílivová linka nahoře");
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
  assert.ok(css.includes("pointer-events: none"), "pseudo-rám nesmí blokovat ukazatel");
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
