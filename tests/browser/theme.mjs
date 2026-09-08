// VZHLED V PROHLÍŽEČI · Signature + osm palet s rámy, žádné bliknutí,
// žádný posun rozvržení.
//
// Ze zdroje se tohle ověřit nedá: bliknutí je otázka pořadí, rám je otázka
// skutečně spočítaného stylu a invariance rozvržení je otázka změřených
// obdélníků. Všechno tři měří tenhle soubor.
//
//   npm run build && node tests/browser/theme.mjs
import { createServer } from "./server.mjs";

let chromium;
try { ({ chromium } = await import("playwright-core")); }
catch { console.log("SKIP · playwright-core není k dispozici"); process.exit(0); }

const EXE = process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const PORT = Number(process.env.PORT || 8951);
const BASE = "http://localhost:" + PORT;

const R = []; let failed = 0;
const check = (n, ok, x = "") => { if (!ok) failed++; R.push((ok ? "PASS " : "FAIL ") + n + (x ? " — " + x : "")); };
const note = (s) => R.push("     " + s);

const srv = createServer(); await new Promise((r) => srv.listen(PORT, r));
let browser;
try { browser = await chromium.launch({ executablePath: EXE, args: ["--no-sandbox"] }); }
catch (e) { console.log("SKIP · Chromium se nepodařilo spustit: " + e.message); srv.close(); process.exit(0); }

/* Pole, lišta a řeč rámů čtrnácti pevných vzhledů — musí sedět na rejstřík. */
const FIELDS = {
  "signature-day": "#F4F0EB",
  "signature-night": "#262725",
  "slate-clay-pantone": "#DBD6D1",
  "monument-clay": "#EBEBDD",
  "sand-burnt-earth": "#D3C7AD",
  "garnet-slate": "#F7DEC1",
  "shikon-fossil": "#282227",
  "volcanic-grey": "#292A2A",
  "americano-chai": "#1E1D1D",
  "quiet-ledger-night": "#191919",
  "nagtang-black": "#141311",
  "martang-red": "#2A1210",
  "sertang-gold": "#EADBAE",
  "mineral-pigments": "#F1EADB",
  "black-sand": "#D7C9AE",
  "deep-water": "#1E1E1E",
};
const THEMECOLOR = { "monument-clay": "#26303B", "deep-water": "#143D4A" };
const GRAMMAR = {
  "signature-day": "none", "signature-night": "none",
  "slate-clay-pantone": "architectural-double",
  "monument-clay": "monument-inset",
  "sand-burnt-earth": "strata-rails",
  "garnet-slate": "corner-brackets",
  "shikon-fossil": "nested-fossil",
  "volcanic-grey": "basalt-steps",
  "americano-chai": "woven-rails",
  "quiet-ledger-night": "quiet-ledger",
  "nagtang-black": "gold-keyline",
  "martang-red": "thangka-mount",
  "sertang-gold": "brocade-band",
  "mineral-pigments": "pigment-rails",
  "black-sand": "dune-ledge",
  "deep-water": "tide-line",
};
const DARK = ["signature-night", "shikon-fossil", "volcanic-grey", "americano-chai", "quiet-ledger-night", "nagtang-black", "martang-red", "deep-water"];
const OPTIONAL = ["slate-clay-pantone", "monument-clay", "sand-burnt-earth", "garnet-slate", "shikon-fossil", "volcanic-grey", "americano-chai", "quiet-ledger-night", "nagtang-black", "martang-red", "sertang-gold", "mineral-pigments", "black-sand", "deep-water"];
/* Palety, které si nesou vlastní řez písma. Jiný řez = jiná šířka znaku. */
const TYPED = [];
const rgb = (hex) => {
  const h = hex.replace("#", "");
  return `rgb(${parseInt(h.slice(0, 2), 16)}, ${parseInt(h.slice(2, 4), 16)}, ${parseInt(h.slice(4, 6), 16)})`;
};
const v4 = (preset, signature) => JSON.stringify({ version: 4, preset, signature: signature || "signature-auto" });

async function openApp(ctx, pref, opts = {}) {
  const page = await ctx.newPage();
  const errs = []; page.on("pageerror", (e) => errs.push(String(e).split("\n")[0]));
  await page.addInitScript(([p, l]) => {
    try {
      if (p === null) localStorage.clear();
      else if (typeof p === "string") localStorage.setItem("tm-appearance-v3", p);
      else if (p.v2) localStorage.setItem("tm-appearance-v2", p.v2);
      else if (p.legacy) localStorage.setItem("tm-theme", p.legacy);
      localStorage.setItem("tm-lang", l || "cs");
      localStorage.setItem("tmGuideVersion", "999");
    } catch (e) { /* nic */ }
  }, [pref === undefined ? null : pref, opts.lang || "cs"]);
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  return { page, errs };
}

async function openSettings(page) {
  const ok = await page.evaluate(() => {
    const jmena = ["Nastavení", "Settings"];
    const b = [...document.querySelectorAll("button, [role='button']")].find((x) => {
      const s = (x.title || x.getAttribute("aria-label") || "").trim();
      return jmena.includes(s);
    });
    if (!b) return false;
    b.click(); return true;
  });
  if (ok) await page.waitForTimeout(500);
  return ok;
}

async function themeState(page) {
  return page.evaluate(() => ({
    preset: document.documentElement.getAttribute("data-appearance"),
    mode: document.documentElement.getAttribute("data-color-mode"),
    grammar: document.documentElement.getAttribute("data-frame-grammar"),
    body: getComputedStyle(document.body).backgroundColor,
    meta: (document.querySelector('meta[name="theme-color"]') || {}).content || null,
    stored: (() => { try { return localStorage.getItem("tm-appearance-v3"); } catch (e) { return null; } })(),
  }));
}

try {
  // ---- 1 · žádné bliknutí: pole, lišta a gramatika před Reactem -----------
  for (const id of Object.keys(FIELDS)) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const { page } = await openApp(ctx, v4(id));
    const s = await themeState(page);
    check(`pre-paint · ${id} · vzhled`, s.preset === id, String(s.preset));
    check(`pre-paint · ${id} · pole`, s.body === rgb(FIELDS[id]), `${s.body} ≠ ${rgb(FIELDS[id])}`);
    check(`pre-paint · ${id} · lišta`, (s.meta || "").toUpperCase() === (THEMECOLOR[id] || FIELDS[id]).toUpperCase(), String(s.meta));
    check(`pre-paint · ${id} · gramatika`, s.grammar === GRAMMAR[id], String(s.grammar));
    await ctx.close();
  }

  // ---- 2 · migrace zrušených palet V2 a rodin V1 --------------------------
  for (const [old, cil] of [
    [JSON.stringify({ version: 3, preset: "smoke-spice" }), "shikon-fossil"],
    [JSON.stringify({ version: 3, preset: "river-night" }), "volcanic-grey"],
    [JSON.stringify({ version: 3, preset: "mulberry-paper" }), "garnet-slate"],
    [JSON.stringify({ version: 3, preset: "teal-night" }), "signature-night"],
  ]) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const { page, errs } = await openApp(ctx, old);
    await page.waitForTimeout(1500);
    const s = await themeState(page);
    check(`migrace V2 · ${JSON.parse(old).preset} → ${cil}`, s.preset === cil && errs.length === 0, `${s.preset} ${errs[0] || ""}`);
    await ctx.close();
  }
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: "light" });
    const { page } = await openApp(ctx, { v2: JSON.stringify({ version: 2, family: "olive-gold", mode: "light" }) });
    await page.waitForTimeout(1500);
    const s = await themeState(page);
    check("migrace V1 · olive-gold → sand-burnt-earth", s.preset === "sand-burnt-earth", String(s.preset));
    await ctx.close();
  }
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: "dark" });
    const { page } = await openApp(ctx, { legacy: "dark" });
    await page.waitForTimeout(1500);
    const s = await themeState(page);
    check("migrace v0 · tm-theme=dark → signature-night", s.preset === "signature-night", String(s.preset));
    await ctx.close();
  }
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: "dark" });
    const { page, errs } = await openApp(ctx, "{rozbité");
    await page.waitForTimeout(1500);
    const s = await themeState(page);
    check("rozbitá volba · automatika podle systému", s.preset === "signature-night" && errs.length === 0, `${s.preset}`);
    await ctx.close();
  }

  // ---- 3 · palety jsou pevné, Signature poslouchá -------------------------
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: "light" });
    const { page } = await openApp(ctx, v4("americano-chai", "signature-day"));
    await page.waitForTimeout(1500);
    const pred = await themeState(page);
    await page.emulateMedia({ colorScheme: "dark" });
    await page.waitForTimeout(700);
    const po = await themeState(page);
    check("pevná paleta se systémem nehne", po.preset === "americano-chai" && po.body === pred.body, `${po.preset}`);
    await ctx.close();
  }
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: "light" });
    const { page } = await openApp(ctx, v4("signature-auto"));
    await page.waitForTimeout(1500);
    await page.emulateMedia({ colorScheme: "dark" });
    await page.waitForTimeout(700);
    const s = await themeState(page);
    check("automatika přepne bez reloadu", s.preset === "signature-night" && s.mode === "dark", `${s.preset}`);
    await ctx.close();
  }

  // ---- 4 · rám je skutečně spočítaný — a Signature ho nemá ----------------
  for (const [id, expectFrame] of [["signature-day", false], ["slate-clay-pantone", true], ["americano-chai", true]]) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const { page } = await openApp(ctx, v4(id));
    await page.waitForTimeout(1600);
    const otevreno = await openSettings(page);
    if (!otevreno) { check(`rám · ${id} · Nastavení se otevřou`, false); await ctx.close(); continue; }
    const m = await page.evaluate(() => {
      const cs = document.querySelector(".tm-cs");
      if (!cs) return null;
      const st = getComputedStyle(cs);
      const r = cs.getBoundingClientRect();
      return { shadow: st.boxShadow, w: Math.round(r.width), h: Math.round(r.height) };
    });
    if (!m) { check(`rám · ${id} · list existuje`, false); await ctx.close(); continue; }
    const hasInset = /inset/.test(m.shadow);
    check(`rám · ${id} · ${expectFrame ? "list nese rám gramatiky" : "Signature list rám nemá"}`,
      expectFrame ? hasInset : !hasInset, m.shadow.slice(0, 80));
    await ctx.close();
  }

  // ---- 5 · invariance rozvržení: rám nesmí pohnout geometrií --------------
  // A JEDNA VÝSLOVNÁ VÝJIMKA. Test vznikl proti RÁMŮM: rám je stín nebo
  // pseudo-prvek a nesmí posunout ani pixel. Od jádra 1.10.0 ale existuje
  // paleta, která si nese VLASTNÍ ŘEZ PÍSMA (Signál v temnu · strojopis a
  // Cinzel), a jiný řez má prostě jinou šířku znaku — tlačítko široké podle
  // svého textu se o pár pixelů liší z definice, ne z chyby.
  //
  // Co proto platí dál i pro paletu s vlastním řezem: STAVBA se nehne
  // (postranní panel, stránka, horní lišta na pixel) a stránka NEPŘETÉKÁ.
  // Co se povoluje: prvek, který se sám měří podle textu, smí dýchat do
  // osmi pixelů. Kdyby řez rozhodil rozvržení, chytí to obojí.
  {
    const boxes = {};
    for (const id of ["signature-day", ...OPTIONAL]) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const { page } = await openApp(ctx, v4(id));
      await page.waitForTimeout(1700);
      boxes[id] = await page.evaluate(() => {
        const box = (sel) => {
          const el = document.querySelector(sel);
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)];
        };
        return {
          sidebar: box(".tm-sidebar"),
          page: box(".tm-page"),
          topbar: box(".tm-topbar"),
          firstButton: box(".tm-page button"),
          scrollW: document.documentElement.scrollWidth,
          clientW: document.documentElement.clientWidth,
        };
      });
      await ctx.close();
    }
    const ref = boxes["signature-day"];
    for (const id of OPTIONAL) {
      const b = boxes[id];
      const vlastniRez = TYPED.indexOf(id) !== -1;
      /* Stavba stránky se nesmí hnout nikdy. Prvek měřený podle textu smí
         u palety s vlastním řezem dýchat — a jen ten. */
      const strukt = ["sidebar", "page", "topbar"];
      const obsah = ["firstButton"];
      const nejhorsi = (keys) => {
        let worst = 0, where = "";
        for (const k of keys) {
          if (!ref[k] || !b[k]) continue;
          for (let i = 0; i < 4; i++) {
            const d = Math.abs(ref[k][i] - b[k][i]);
            if (d > worst) { worst = d; where = `${k}[${i}]`; }
          }
        }
        return { worst, where };
      };
      const S = nejhorsi(strukt), O = nejhorsi(obsah);
      const worst = Math.max(S.worst, O.worst);
      const where = S.worst >= O.worst ? S.where : O.where;
      check(`invariance · ${id} · stavba do 1 px od Signature`, S.worst <= 1, `${S.where} Δ${S.worst}px`);
      check(`invariance · ${id} · obdélníky do ${vlastniRez ? 8 : 1} px od Signature`,
        vlastniRez ? O.worst <= 8 : worst <= 1, `${where} Δ${worst}px`);
      check(`invariance · ${id} · žádný vodorovný přesah`, b.scrollW <= b.clientW, `${b.scrollW}>${b.clientW}`);
    }
  }

  // ---- 6 · Nastavení · Signature sekce + Volitelné palety -----------------
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: "light" });
    const { page, errs } = await openApp(ctx, null);
    await page.waitForTimeout(1600);
    const otevreno = await openSettings(page);
    check("Nastavení se otevřou", otevreno);
    if (otevreno) {
      const info = await page.evaluate(() => {
        const groups = [...document.querySelectorAll("[role='radiogroup']")];
        const sig = groups.find((x) => /^signature$/i.test(x.getAttribute("aria-label") || ""));
        const opt = groups.find((x) => /volitelné|optional/i.test(x.getAttribute("aria-label") || ""));
        const radios = (g) => g ? [...g.querySelectorAll("[role='radio']")] : [];
        return {
          skupin: groups.length,
          sig: radios(sig).length,
          opt: radios(opt).length,
          sigChecked: radios(sig).filter((x) => x.getAttribute("aria-checked") === "true").length,
          optChecked: radios(opt).filter((x) => x.getAttribute("aria-checked") === "true").length,
          jmena: radios(opt).map((x) => (x.innerText || "").trim().split("\n")[0]),
          vse: (sig ? sig.innerText : "") + (opt ? opt.innerText : ""),
        };
      });
      check("dvě skupiny: Signature a Volitelné palety", !!info && info.skupin === 2, info ? String(info.skupin) : "");
      check("Signature má tři volby", !!info && info.sig === 3, info ? String(info.sig) : "");
      check("palet je čtrnáct", !!info && info.opt === 14, info ? String(info.opt) : "");
      check("vybraná je automatika, žádná paleta", !!info && info.sigChecked === 1 && info.optChecked === 0,
        info ? `${info.sigChecked}/${info.optChecked}` : "");
      check("žádný zrušený název", !!info && !/Řeka v noci|Tyrkys|Moruše|Kouř a koření/.test(info.vse));
      if (info) note("palety · " + info.jmena.join(" | "));

      // zvol Granát a břidlici
      await page.evaluate(() => {
        const g = [...document.querySelectorAll("[role='radiogroup']")].find((x) => /volitelné|optional/i.test(x.getAttribute("aria-label") || ""));
        [...g.querySelectorAll("[role='radio']")][3].click();
      });
      await page.waitForTimeout(700);
      const po = await themeState(page);
      check("výběr palety se projeví hned", po.preset === "garnet-slate", String(po.preset));
      check("výběr palety si pamatuje Signature", !!po.stored && JSON.parse(po.stored).signature === "signature-auto", String(po.stored));
      check("gramatika naskočila", po.grammar === "corner-brackets", String(po.grammar));

      // Použít Signature → návrat k automatice
      await page.evaluate(() => {
        const b = [...document.querySelectorAll("button")].find((x) => /Použít Signature|Use Signature/i.test(x.innerText || ""));
        if (b) b.click();
      });
      await page.waitForTimeout(700);
      const zpet = await themeState(page);
      check("Použít Signature obnoví předchozí volbu", zpet.preset === "signature-day" || zpet.preset === "signature-night",
        String(zpet.preset));
      check("obnovená volba je automatika", !!zpet.stored && JSON.parse(zpet.stored).preset === "signature-auto", String(zpet.stored));
      check("gramatika je pryč", zpet.grammar === "none", String(zpet.grammar));
    }
    check("Nastavení · bez chyby stránky", errs.length === 0, errs.slice(0, 2).join(" | "));
    await ctx.close();
  }

  // ---- 7 · návrat obnoví i výslovný den/noc -------------------------------
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: "light" });
    const { page } = await openApp(ctx, v4("volcanic-grey", "signature-night"));
    await page.waitForTimeout(1600);
    const otevreno = await openSettings(page);
    if (otevreno) {
      await page.evaluate(() => {
        const b = [...document.querySelectorAll("button")].find((x) => /Použít Signature|Use Signature/i.test(x.innerText || ""));
        if (b) b.click();
      });
      await page.waitForTimeout(700);
      const s = await themeState(page);
      check("návrat obnoví noc, ne den", s.preset === "signature-night", String(s.preset));
    } else check("návrat · Nastavení se otevřou", false);
    await ctx.close();
  }

  // ---- 8 · přežije reload -------------------------------------------------
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: "dark" });
    const { page } = await openApp(ctx, v4("sand-burnt-earth", "signature-day"));
    await page.waitForTimeout(1500);
    await page.reload({ waitUntil: "domcontentloaded" });
    const s = await themeState(page);
    check("volba přežije reload a je tam hned", s.preset === "sand-burnt-earth" && s.mode === "light", `${s.preset}/${s.mode}`);
    await ctx.close();
  }

  // ---- 9 · všech sedmnáct vzhledů na skutečné stránce ------------------------------
  for (const id of Object.keys(FIELDS)) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const { page, errs } = await openApp(ctx, v4(id));
    await page.waitForTimeout(1500);
    const m = await page.evaluate(() => {
      const lum = (c) => {
        const p = c.match(/\d+(\.\d+)?/g).map(Number);
        const ch = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
        return 0.2126 * ch(p[0]) + 0.7152 * ch(p[1]) + 0.0722 * ch(p[2]);
      };
      const bgOf = (el) => {
        let n = el;
        while (n && n !== document.documentElement) {
          const c = getComputedStyle(n).backgroundColor;
          if (c && c !== "rgba(0, 0, 0, 0)" && !/rgba\([^)]+, 0\)/.test(c)) return c;
          n = n.parentElement;
        }
        return getComputedStyle(document.body).backgroundColor;
      };
      let worst = 99, kde = "";
      const texty = [...document.querySelectorAll("h1,h2,h3,p,span,div,button,a,label")]
        .filter((el) => el.children.length === 0 && (el.innerText || "").trim().length > 2)
        .slice(0, 220);
      for (const el of texty) {
        const st = getComputedStyle(el);
        if (st.visibility === "hidden" || st.display === "none") continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0 || r.top > window.innerHeight) continue;
        const b = bgOf(el);
        if (/rgba/.test(b) && !/, 1\)$/.test(b)) continue; // průsvitný podklad měří node test
        const l1 = lum(st.color), l2 = lum(b);
        const cr = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        if (cr < worst) { worst = cr; kde = (el.innerText || "").trim().slice(0, 22) + " " + st.color + " na " + b; }
      }
      const kanaly = (c) => c.match(/\d+(\.\d+)?/g).map(Number);
      const acc = getComputedStyle(document.documentElement).getPropertyValue("--tm-accent").trim();
      const accRgb = (() => { const h = acc.replace("#", ""); return h.length === 6 ? [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) : null; })();
      const blizko = (c) => { if (!accRgb || !c) return false; const p = kanaly(c); return Math.abs(p[0] - accRgb[0]) + Math.abs(p[1] - accRgb[1]) + Math.abs(p[2] - accRgb[2]) < 12 && (p[3] === undefined || p[3] > 0.5); };
      let vidno = 0, sAkcentem = 0;
      for (const el of document.querySelectorAll("body *")) {
        const r = el.getBoundingClientRect();
        if (r.width < 4 || r.height < 4 || r.top > window.innerHeight || r.bottom < 0) continue;
        const st = getComputedStyle(el);
        if (st.visibility === "hidden" || st.display === "none") continue;
        vidno++;
        if (blizko(st.backgroundColor) || blizko(st.borderTopColor)) sAkcentem++;
      }
      return {
        presah: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
        worst: Math.round(worst * 100) / 100, kde,
        nadmira: vidno ? Math.round((sAkcentem / vidno) * 1000) / 1000 : 0, vidno,
      };
    });
    check(`${id} · nepřetéká do strany`, m.presah === 0, m.presah + "px");
    check(`${id} · bez chyby stránky`, errs.length === 0, errs.slice(0, 1).join(""));
    check(`${id} · žádný text nesplynul s podkladem`, m.worst >= 3, `nejhorší ${m.worst} · ${m.kde}`);
    /* Míra pokrytí akcentem má smysl jen tam, kde je akcent vlastní odstín.
       Několik V3 palet z principu píše akční prvky týmž inkoustem jako text
       (přesné kotvy) — tam metrika měří písmo, ne akcent. Krotkost palet
       hlídá rozpočet rámů a vizuální prohlídka. */
    if (id === "signature-day" || id === "signature-night") {
      check(`${id} · akcent není všude`, m.nadmira <= 0.18, `${Math.round(m.nadmira * 100)} % z ${m.vidno}`);
    }
    await ctx.close();
  }
} finally {
  await browser.close();
  srv.close();
}

console.log(R.join("\n"));
console.log(failed ? `\n${failed} kontrol selhalo` : `\nvše prošlo · ${R.filter((x) => x.startsWith("PASS")).length} kontrol`);
process.exit(failed ? 1 : 0);
