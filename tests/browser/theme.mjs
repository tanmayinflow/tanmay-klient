// VZHLED V PROHLÍŽEČI · devět hotových vzhledů, žádné bliknutí.
//
// Ze zdroje se tohle ověřit nedá. Bliknutí špatného vzhledu je otázka POŘADÍ
// (vložený skript proti prvnímu vykreslení Reactu), volba klávesnicí je
// otázka fokusu a systémový režim je otázka média — všechno tři věci, které
// existují jen v běžícím prohlížeči.
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

/* Pole osmi pevných vzhledů. Automatika žádné vlastní nemá — vrací se
   k Signature Day nebo Signature Night podle systému. */
const FIELDS = {
  "signature-day": "#F4F0EB",
  "signature-night": "#262725",
  "river-night": "#101315",
  "teal-night": "#0E1312",
  "mulberry-paper": "#F1E8EA",
  "slate-clay": "#DBD6D1",
  "sand-earth": "#D3C7AD",
  "smoke-spice": "#282227",
};
const ORDER = ["signature-auto", ...Object.keys(FIELDS)];
const DARK = ["signature-night", "river-night", "teal-night", "smoke-spice"];
const rgb = (hex) => {
  const h = hex.replace("#", "");
  return `rgb(${parseInt(h.slice(0, 2), 16)}, ${parseInt(h.slice(2, 4), 16)}, ${parseInt(h.slice(4, 6), 16)})`;
};
const v3 = (preset) => JSON.stringify({ version: 3, preset });
const v2 = (family, mode) => ({ v2: JSON.stringify({ version: 2, family, mode }) });

async function openApp(ctx, pref, opts = {}) {
  const page = await ctx.newPage();
  const errs = []; page.on("pageerror", (e) => errs.push(String(e).split("\n")[0]));
  await page.addInitScript(([p, l, broken]) => {
    if (broken) {
      try {
        Object.defineProperty(window, "localStorage", { get() { throw new Error("storage disabled"); } });
      } catch (e) { /* prohlížeč to nemusí dovolit */ }
      return;
    }
    try {
      if (p === null) localStorage.clear();
      else if (typeof p === "string") localStorage.setItem("tm-appearance-v3", p);
      else if (p.v2) localStorage.setItem("tm-appearance-v2", p.v2);
      else if (p.legacy) localStorage.setItem("tm-theme", p.legacy);
      localStorage.setItem("tm-lang", l || "cs");
      localStorage.setItem("tmGuideVersion", "999");
    } catch (e) { /* nic */ }
  }, [pref === undefined ? null : pref, opts.lang || "cs", !!opts.brokenStorage]);
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
    body: getComputedStyle(document.body).backgroundColor,
    meta: (document.querySelector('meta[name="theme-color"]') || {}).content || null,
    scheme: document.documentElement.style.getPropertyValue("color-scheme"),
    stored: (() => { try { return localStorage.getItem("tm-appearance-v3"); } catch (e) { return null; } })(),
    legacy: (() => { try { return localStorage.getItem("tm-theme"); } catch (e) { return null; } })(),
  }));
}

const radios = (page) => page.evaluate(() => {
  const g = [...document.querySelectorAll("[role='radiogroup']")]
    .find((x) => /vzhled|appearance/i.test(x.getAttribute("aria-label") || ""));
  if (!g) return null;
  const b = [...g.querySelectorAll("[role='radio']")];
  return {
    pocet: b.length,
    prvni: (b[0].innerText || "").trim(),
    jmena: b.map((x) => (x.innerText || "").trim().split("\n")[0]),
    stitky: b.map((x) => x.getAttribute("aria-label") || ""),
    vse: g.innerText || "",
    doporuceno: b.map((x) => /Doporuč|Recommend/i.test(x.innerText || "")).filter(Boolean).length,
    bezJmena: b.filter((x) => !(x.innerText || "").trim()).length,
    vybrano: b.filter((x) => x.getAttribute("aria-checked") === "true").length,
    skupin: document.querySelectorAll("[role='radiogroup']").length,
    // náhled musí být kus rozhraní, ne dva obdélníky
    plochy: b.map((x) => new Set([...x.querySelectorAll("span,div")]
      .map((n) => getComputedStyle(n).backgroundColor)
      .filter((c) => c && c !== "rgba(0, 0, 0, 0)")).size),
  };
});

try {
  // ---- 1 · žádné bliknutí -------------------------------------------------
  // Stav se čte HNED po domcontentloaded, tedy po vloženém skriptu a PŘED
  // tím, než React vůbec připojí strom.
  for (const id of Object.keys(FIELDS)) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const { page } = await openApp(ctx, v3(id));
    const s = await themeState(page);
    check(`pre-paint · ${id} · vzhled na <html>`, s.preset === id, String(s.preset));
    check(`pre-paint · ${id} · pole`, s.body === rgb(FIELDS[id]), `${s.body} ≠ ${rgb(FIELDS[id])}`);
    check(`pre-paint · ${id} · barva prohlížeče`, (s.meta || "").toUpperCase() === FIELDS[id], String(s.meta));
    check(`pre-paint · ${id} · color-scheme`, s.scheme === (DARK.includes(id) ? "dark" : "light"), String(s.scheme));
    await ctx.close();
  }

  // ---- 2 · po připojení Reactu se nic nepřepne ----------------------------
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const { page, errs } = await openApp(ctx, v3("smoke-spice"));
    const before = await themeState(page);
    await page.waitForTimeout(1800);
    const after = await themeState(page);
    check("vzhled se po připojení Reactu nezmění", before.preset === after.preset && before.body === after.body,
      `${before.preset}/${before.body} → ${after.preset}/${after.body}`);
    check("bez chyby stránky", errs.length === 0, errs.slice(0, 2).join(" | "));
    await ctx.close();
  }

  // ---- 3 · migrace všech tří generací ------------------------------------
  for (const [old, cil] of [["light", "signature-day"], ["dark", "signature-night"]]) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const { page } = await openApp(ctx, { legacy: old });
    await page.waitForTimeout(1500);
    const s = await themeState(page);
    check(`migrace · tm-theme=${old} → ${cil}`, s.preset === cil, `${s.preset}`);
    check(`migrace · ${old} · uložilo se v nové podobě`, !!s.stored && JSON.parse(s.stored).preset === cil, String(s.stored));
    await ctx.close();
  }
  for (const [family, mode, cil] of [
    ["olive-gold", "light", "sand-earth"],
    ["atlantic-sky", "dark", "slate-clay"],
    ["river-mist", "light", "river-night"],
    ["signature", "system", "signature-day"],
  ]) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: "light" });
    const { page, errs } = await openApp(ctx, v2(family, mode));
    await page.waitForTimeout(1500);
    const s = await themeState(page);
    check(`migrace · ${family}/${mode} → ${cil}`, s.preset === cil, String(s.preset));
    check(`migrace · ${family} · bez chyby stránky`, errs.length === 0, errs.slice(0, 1).join(""));
    await ctx.close();
  }
  {
    // Nikdy nic nevolil · automatika podle systému.
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: "dark" });
    const { page } = await openApp(ctx, null);
    await page.waitForTimeout(1500);
    const s = await themeState(page);
    check("nová instalace · automatika sáhne po Signature Night při noční předvolbě",
      s.preset === "signature-night" && s.mode === "dark", `${s.preset}/${s.mode}`);
    check("nová instalace · uložená volba je automatika, ne noc",
      !!s.stored && JSON.parse(s.stored).preset === "signature-auto", String(s.stored));
    await ctx.close();
  }

  // ---- 4 · rozbitá a neznámá volba ---------------------------------------
  for (const [jmeno, raw] of [
    ["rozbitý JSON", "{tohle není json"],
    ["neznámý vzhled", v3("budouci-vzhled")],
    ["zrušená rodina", JSON.stringify({ version: 2, family: "budouci-rodina", mode: "dark" })],
  ]) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const { page, errs } = await openApp(ctx, raw);
    await page.waitForTimeout(1500);
    const s = await themeState(page);
    const ok = s.preset === "signature-day" || s.preset === "signature-night";
    check(`bezpečný pád · ${jmeno} · skončí na Signature`, ok && errs.length === 0, `${s.preset} ${errs[0] || ""}`);
    await ctx.close();
  }
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const { page, errs } = await openApp(ctx, null, { brokenStorage: true });
    await page.waitForTimeout(1500);
    const s = await themeState(page);
    check("nedostupné úložiště · aplikace se přesto otevře", !!s.preset && errs.length === 0, errs.slice(0, 1).join(""));
    await ctx.close();
  }

  // ---- 5 · systém hýbe JEDINOU volbou ------------------------------------
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: "light" });
    const { page } = await openApp(ctx, v3("signature-auto"));
    await page.waitForTimeout(1500);
    const den = await themeState(page);
    check("automaticky · systém ve dne → Signature Day", den.preset === "signature-day", String(den.preset));
    await page.emulateMedia({ colorScheme: "dark" });
    await page.waitForTimeout(700);
    const noc = await themeState(page);
    check("automaticky · systém přepne na noc → Signature Night bez reloadu",
      noc.preset === "signature-night" && noc.mode === "dark", `${noc.preset}/${noc.mode}`);
    check("automaticky · uložená volba zůstává automatika",
      !!noc.stored && JSON.parse(noc.stored).preset === "signature-auto", String(noc.stored));
    await ctx.close();
  }
  for (const id of ["smoke-spice", "mulberry-paper"]) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: "light" });
    const { page } = await openApp(ctx, v3(id));
    await page.waitForTimeout(1500);
    const pred = await themeState(page);
    await page.emulateMedia({ colorScheme: "dark" });
    await page.waitForTimeout(700);
    const po = await themeState(page);
    check(`pevný vzhled · ${id} se systémem nehne`, po.preset === id && po.body === pred.body, `${pred.preset} → ${po.preset}`);
    await ctx.close();
  }

  // ---- 6 · Nastavení · jeden seznam, klávesnice, reset --------------------
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const { page, errs } = await openApp(ctx, null);
    await page.waitForTimeout(1600);
    const otevreno = await openSettings(page);
    check("Nastavení se otevřou", otevreno);
    if (otevreno) {
      const karty = await radios(page);
      check("v Nastavení je devět vzhledů", karty && karty.pocet === 9, karty ? String(karty.pocet) : "sekce nenalezena");
      check("Automaticky · Signature je první", !!karty && /Automat/i.test(karty.prvni), karty ? karty.prvni : "");
      check("volič režimu je pryč · jediná skupina voleb", !!karty && karty.skupin === 1, karty ? String(karty.skupin) : "");
      check("Nastavení nikde neříká Forest Night", !!karty && !/forest/i.test(karty.vse), karty ? String(karty.vse).slice(0, 80) : "");
      for (const zruseny of ["Řeka a mlha", "Tyrkys a pergamen", "Hlína a alabastr", "Atlantik", "Oliva a zlato"]) {
        check(`Nastavení neukazuje zrušenou paletu · ${zruseny}`, !!karty && !karty.vse.includes(zruseny));
      }
      check("doporučená je právě jedna", !!karty && karty.doporuceno === 1, karty ? String(karty.doporuceno) : "");
      check("karta vzhledu není bezejmenný barevný box", !!karty && karty.bezJmena === 0, karty ? String(karty.bezJmena) : "");
      check("právě jedna karta je zvolená", !!karty && karty.vybrano === 1, karty ? String(karty.vybrano) : "");
      check("náhled je kus rozhraní, ne dva obdélníky",
        !!karty && karty.plochy.every((n) => n >= 4), karty ? karty.plochy.join(",") : "");
      check("čtečka slyší i polaritu vzhledu",
        !!karty && karty.stitky.every((s) => /denní|noční|podle systému|day|night|system/i.test(s)),
        karty ? karty.stitky.slice(0, 2).join(" | ") : "");
      if (karty) note("vzhledy v Nastavení · " + karty.jmena.join(" | "));

      // výběr myší · šestá položka je Břidlice a hlína
      await page.evaluate(() => {
        const g = [...document.querySelectorAll("[role='radiogroup']")].find((x) => /vzhled|appearance/i.test(x.getAttribute("aria-label") || ""));
        g.querySelectorAll("[role='radio']")[6].click();
      });
      await page.waitForTimeout(600);
      const po = await themeState(page);
      check("výběr vzhledu se projeví hned", po.preset === ORDER[6], String(po.preset));
      check("výběr vzhledu se uloží", !!po.stored && JSON.parse(po.stored).preset === ORDER[6], String(po.stored));

      // klávesnice · šipka posune volbu
      await page.evaluate(() => {
        const g = [...document.querySelectorAll("[role='radiogroup']")].find((x) => /vzhled|appearance/i.test(x.getAttribute("aria-label") || ""));
        const sel = [...g.querySelectorAll("[role='radio']")].find((x) => x.getAttribute("aria-checked") === "true");
        sel.focus();
      });
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(500);
      const klav = await themeState(page);
      check("šipka vybere další vzhled", klav.preset === ORDER[7], String(klav.preset));
      const fokus = await page.evaluate(() => {
        const a = document.activeElement;
        return a ? { role: a.getAttribute("role"), checked: a.getAttribute("aria-checked") } : null;
      });
      check("fokus zůstal na volbě", !!fokus && fokus.role === "radio" && fokus.checked === "true", JSON.stringify(fokus));

      // reset
      await page.evaluate(() => {
        const b = [...document.querySelectorAll("button")].find((x) => /Signature/.test(x.innerText || "") && /Vrátit|Reset/i.test(x.innerText || ""));
        if (b) b.click();
      });
      await page.waitForTimeout(600);
      const res = await themeState(page);
      check("reset vrátí Signature", res.preset === "signature-day" || res.preset === "signature-night", String(res.preset));
      check("reset uloží automatiku", !!res.stored && JSON.parse(res.stored).preset === "signature-auto", String(res.stored));
    }
    check("Nastavení · bez chyby stránky", errs.length === 0, errs.slice(0, 2).join(" | "));
    await ctx.close();
  }

  // ---- 7 · rychlé ovládání otevře Vzhled, nepřepíná ------------------------
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const { page } = await openApp(ctx, v3("sand-earth"));
    await page.waitForTimeout(1700);
    const info = await page.evaluate(() => {
      const b = [...document.querySelectorAll("button")].find((x) => /^(Vzhled|Appearance)$/i.test((x.innerText || "").trim()));
      if (!b) return null;
      const label = b.getAttribute("aria-label") || "";
      b.click();
      return { label };
    });
    if (info) {
      check("rychlé ovládání říká, co je zvolené", /Písek|Sand/i.test(info.label), info.label);
      await page.waitForTimeout(900);
      const s = await themeState(page);
      check("rychlé ovládání vzhled nepřepne", s.preset === "sand-earth", String(s.preset));
      const otevreno = await page.evaluate(() => {
        const g = [...document.querySelectorAll("[role='radiogroup']")]
          .find((x) => /vzhled|appearance/i.test(x.getAttribute("aria-label") || ""));
        return !!g;
      });
      check("rychlé ovládání otevře Vzhled", otevreno);
    } else {
      note("rychlé ovládání v liště · v téhle aplikaci na desktopu není, přeskočeno");
    }
    await ctx.close();
  }

  // ---- 8 · přežije reload -------------------------------------------------
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: "dark" });
    const { page } = await openApp(ctx, v3("mulberry-paper"));
    await page.waitForTimeout(1500);
    await page.reload({ waitUntil: "domcontentloaded" });
    const s = await themeState(page);
    check("volba přežije reload a je tam hned", s.preset === "mulberry-paper" && s.mode === "light", `${s.preset}/${s.mode}`);
    await ctx.close();
  }

  // ---- 9 · osm vzhledů na skutečné stránce --------------------------------
  // Nejde o snímek. Ptáme se, jestli text na poli, které vzhled opravdu
  // vykreslil, drží kontrast — a jestli stránka nepřeteče do strany.
  for (const id of Object.keys(FIELDS)) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const { page, errs } = await openApp(ctx, v3(id));
    await page.waitForTimeout(1500);
    const m = await page.evaluate(() => {
      const lum = (c) => {
        const p = c.match(/\d+(\.\d+)?/g).map(Number);
        const ch = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
        return 0.2126 * ch(p[0]) + 0.7152 * ch(p[1]) + 0.0722 * ch(p[2]);
      };
      const bg = getComputedStyle(document.body).backgroundColor;
      let worst = 99, kde = "";
      const texty = [...document.querySelectorAll("h1,h2,h3,p,span,div,button,a,label")]
        .filter((el) => el.children.length === 0 && (el.innerText || "").trim().length > 2)
        .slice(0, 220);
      for (const el of texty) {
        const st = getComputedStyle(el);
        if (st.visibility === "hidden" || st.display === "none") continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0 || r.top > window.innerHeight) continue;
        const l1 = lum(st.color), l2 = lum(bg);
        const cr = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        if (cr < worst) { worst = cr; kde = (el.innerText || "").trim().slice(0, 24) + " " + st.color; }
      }
      /* VIZUÁLNÍ PŘIJETÍ, měřené na skutečně vykreslené stránce (V2 §31).
         `nadmira` je podíl viditelných prvků, které nesou akcent jako výplň
         nebo hranu — když je akcent všude, přestává být akcentem. `sytost` je
         sytost pole, které prohlížeč opravdu namaloval. */
      const kanaly = (c) => c.match(/\d+(\.\d+)?/g).map(Number);
      const syt = (c) => { const p = kanaly(c); return (Math.max(p[0], p[1], p[2]) - Math.min(p[0], p[1], p[2])) / 255; };
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
        worst: Math.round(worst * 100) / 100, kde, texty: texty.length,
        sytostPole: Math.round(syt(bg) * 1000) / 1000,
        nadmira: vidno ? Math.round((sAkcentem / vidno) * 1000) / 1000 : 0,
        vidno,
      };
    });
    check(`${id} · nepřetéká do strany`, m.presah === 0, "přesah " + m.presah + "px");
    check(`${id} · bez chyby stránky`, errs.length === 0, errs.slice(0, 1).join(""));
    check(`${id} · žádný text nesplynul s polem`, m.worst >= 3, `nejhorší ${m.worst} · ${m.kde}`);
    if (DARK.includes(id)) {
      check(`${id} · pole je uhel, ne barevný blok`, m.sytostPole <= 0.06, `sytost ${m.sytostPole}`);
    }
    check(`${id} · akcent není všude`, m.nadmira <= 0.18, `${Math.round(m.nadmira * 100)} % z ${m.vidno} prvků`);
    await ctx.close();
  }
} finally {
  await browser.close();
  srv.close();
}

console.log(R.join("\n"));
console.log(failed ? `\n${failed} kontrol selhalo` : `\nvše prošlo · ${R.filter((x) => x.startsWith("PASS")).length} kontrol`);
process.exit(failed ? 1 : 0);
