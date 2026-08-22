// MOTIV V PROHLÍŽEČI · sedm rodin, tři režimy, žádné bliknutí.
//
// Ze zdroje se tohle ověřit nedá. Bliknutí špatného motivu je otázka POŘADÍ
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

// Pořadí i hodnoty jsou z V1.1. Noční pole jsou přirozený uhel, ne kotevní
// odstín rodiny — na tom stojí polovina téhle opravy.
const FIELDS = {
  signature: ["#F4F0EB", "#0F100E"],
  "clay-alabaster": ["#F0E2D3", "#15110F"],
  "river-mist": ["#E5ECEA", "#101315"],
  "atlantic-sky": ["#E6F1F4", "#0E1216"],
  "olive-gold": ["#F3EAC4", "#10120F"],
  "mulberry-paper": ["#F1E8EA", "#130F11"],
  "teal-parchment": ["#F3E8BC", "#0E1312"],
};
const ORDER = Object.keys(FIELDS);
const rgb = (hex) => {
  const h = hex.replace("#", "");
  return `rgb(${parseInt(h.slice(0, 2), 16)}, ${parseInt(h.slice(2, 4), 16)}, ${parseInt(h.slice(4, 6), 16)})`;
};

const seed = (pref, lang) => [pref, lang];
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
      else if (typeof p === "string") localStorage.setItem("tm-appearance-v2", p);
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
    family: document.documentElement.getAttribute("data-theme-family"),
    mode: document.documentElement.getAttribute("data-color-mode"),
    body: getComputedStyle(document.body).backgroundColor,
    meta: (document.querySelector('meta[name="theme-color"]') || {}).content || null,
    scheme: document.documentElement.style.getPropertyValue("color-scheme"),
    stored: (() => { try { return localStorage.getItem("tm-appearance-v2"); } catch (e) { return null; } })(),
  }));
}

try {
  // ---- 1 · žádné bliknutí -------------------------------------------------
  // Stav se čte HNED po domcontentloaded, tedy po vloženém skriptu a PŘED
  // tím, než React vůbec připojí strom. Kdyby motiv nastavoval až React,
  // tenhle blok by hlásil Signature light.
  for (const fam of Object.keys(FIELDS)) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const { page } = await openApp(ctx, JSON.stringify({ version: 2, family: fam, mode: "dark" }));
    const s = await themeState(page);
    check(`pre-paint · ${fam} noc · rodina na <html>`, s.family === fam, String(s.family));
    check(`pre-paint · ${fam} noc · pole je noční`, s.body === rgb(FIELDS[fam][1]), `${s.body} ≠ ${rgb(FIELDS[fam][1])}`);
    check(`pre-paint · ${fam} noc · barva prohlížeče`, (s.meta || "").toUpperCase() === FIELDS[fam][1], String(s.meta));
    await ctx.close();
  }

  // ---- 2 · po připojení Reactu se nic nepřepne ----------------------------
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const { page, errs } = await openApp(ctx, JSON.stringify({ version: 2, family: "mulberry-paper", mode: "dark" }));
    const before = await themeState(page);
    await page.waitForTimeout(1800);
    const after = await themeState(page);
    check("motiv se po připojení Reactu nezmění", before.family === after.family && before.body === after.body,
      `${before.family}/${before.body} → ${after.family}/${after.body}`);
    check("bez chyby stránky", errs.length === 0, errs.slice(0, 2).join(" | "));
    await ctx.close();
  }

  // ---- 3 · migrace starého klíče -----------------------------------------
  for (const old of ["light", "dark"]) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const { page } = await openApp(ctx, { legacy: old });
    await page.waitForTimeout(1500);
    const s = await themeState(page);
    check(`migrace · tm-theme=${old} → Signature ${old}`, s.family === "signature" && s.mode === old, `${s.family}/${s.mode}`);
    check(`migrace · ${old} · uložilo se v nové podobě`, !!s.stored && JSON.parse(s.stored).family === "signature", String(s.stored));
    await ctx.close();
  }
  {
    // Nikdy nic nevolil · musí vidět Signature a den, i když má systém noc.
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: "dark" });
    const { page } = await openApp(ctx, null);
    await page.waitForTimeout(1500);
    const s = await themeState(page);
    check("nová instalace · Signature a den i při noční předvolbě systému",
      s.family === "signature" && s.mode === "light", `${s.family}/${s.mode}`);
    await ctx.close();
  }

  // ---- 4 · rozbitá a neznámá volba ---------------------------------------
  for (const [jmeno, raw] of [
    ["rozbitý JSON", "{tohle není json"],
    ["neznámá rodina", JSON.stringify({ version: 2, family: "budouci-rodina", mode: "dark" })],
    ["neznámý režim", JSON.stringify({ version: 2, family: "river-mist", mode: "zítra" })],
  ]) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const { page, errs } = await openApp(ctx, raw);
    await page.waitForTimeout(1500);
    const s = await themeState(page);
    const ok = s.family === "signature" || s.family === "river-mist";
    check(`bezpečný pád · ${jmeno} · aplikace se otevře`, ok && errs.length === 0, `${s.family}/${s.mode} ${errs[0] || ""}`);
    await ctx.close();
  }
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const { page, errs } = await openApp(ctx, null, { brokenStorage: true });
    await page.waitForTimeout(1500);
    const s = await themeState(page);
    check("nedostupné úložiště · aplikace se přesto otevře", !!s.family && errs.length === 0, errs.slice(0, 1).join(""));
    await ctx.close();
  }

  // ---- 5 · systémový režim ------------------------------------------------
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: "light" });
    const { page } = await openApp(ctx, JSON.stringify({ version: 2, family: "atlantic-sky", mode: "system" }));
    await page.waitForTimeout(1500);
    const den = await themeState(page);
    check("automaticky · systém ve dne → den", den.mode === "light", den.mode);
    await page.emulateMedia({ colorScheme: "dark" });
    await page.waitForTimeout(700);
    const noc = await themeState(page);
    check("automaticky · systém přepne na noc → aplikace taky", noc.mode === "dark" && noc.family === "atlantic-sky", `${noc.family}/${noc.mode}`);
    check("automaticky · rodina se přepnutím systému nezmění", noc.family === den.family, `${den.family} → ${noc.family}`);
    await ctx.close();
  }

  // ---- 6 · Nastavení · výběr, klávesnice, reset ---------------------------
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const { page, errs } = await openApp(ctx, null);
    await page.waitForTimeout(1600);
    const otevreno = await openSettings(page);
    check("Nastavení se otevřou", otevreno);
    if (otevreno) {
      const karty = await page.evaluate(() => {
        const g = [...document.querySelectorAll("[role='radiogroup']")].find((x) => /motiv|theme/i.test(x.getAttribute("aria-label") || ""));
        if (!g) return null;
        const b = [...g.querySelectorAll("[role='radio']")];
        return {
          pocet: b.length,
          prvni: (b[0].innerText || "").trim(),
          jmena: b.map((x) => (x.innerText || "").trim().split("\n")[0]),
          vse: g.innerText || "",
          doporuceno: b.map((x) => /Doporuč|Recommend/i.test(x.innerText || "")).filter(Boolean).length,
          bezJmena: b.filter((x) => !(x.innerText || "").trim()).length,
          vybrano: b.filter((x) => x.getAttribute("aria-checked") === "true").length,
        };
      });
      check("v Nastavení je sedm karet motivu", karty && karty.pocet === 7, karty ? String(karty.pocet) : "sekce nenalezena");
      check("Signature je první", !!karty && /Signature/i.test(karty.prvni), karty ? karty.prvni : "");
      check("Nastavení nikde neříká Forest Night", !!karty && !/forest/i.test(karty.vse), karty ? String(karty.vse).slice(0, 80) : "");
      check("doporučená je právě jedna", !!karty && karty.doporuceno === 1, karty ? String(karty.doporuceno) : "");
      check("karta motivu není bezejmenný barevný box", !!karty && karty.bezJmena === 0, karty ? String(karty.bezJmena) : "");
      check("právě jedna karta je zvolená", !!karty && karty.vybrano === 1, karty ? String(karty.vybrano) : "");
      if (karty) note("rodiny v Nastavení · " + karty.jmena.join(" | "));

      // výběr myší
      await page.evaluate(() => {
        const g = [...document.querySelectorAll("[role='radiogroup']")].find((x) => /motiv|theme/i.test(x.getAttribute("aria-label") || ""));
        g.querySelectorAll("[role='radio']")[4].click();
      });
      await page.waitForTimeout(600);
      const po = await themeState(page);
      check("výběr motivu se projeví hned", po.family === ORDER[4], String(po.family));
      check("výběr motivu se uloží", !!po.stored && JSON.parse(po.stored).family === ORDER[4], String(po.stored));

      // klávesnice · šipka posune volbu
      await page.evaluate(() => {
        const g = [...document.querySelectorAll("[role='radiogroup']")].find((x) => /motiv|theme/i.test(x.getAttribute("aria-label") || ""));
        const sel = [...g.querySelectorAll("[role='radio']")].find((x) => x.getAttribute("aria-checked") === "true");
        sel.focus();
      });
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(500);
      const klav = await themeState(page);
      check("šipka vybere další rodinu", klav.family === ORDER[5], String(klav.family));
      const fokus = await page.evaluate(() => {
        const a = document.activeElement;
        return a ? { role: a.getAttribute("role"), checked: a.getAttribute("aria-checked") } : null;
      });
      check("fokus zůstal na volbě", !!fokus && fokus.role === "radio" && fokus.checked === "true", JSON.stringify(fokus));

      // režim
      await page.evaluate(() => {
        const g = [...document.querySelectorAll("[role='radiogroup']")].find((x) => /režim|mode/i.test(x.getAttribute("aria-label") || ""));
        const b = [...g.querySelectorAll("[role='radio']")];
        b[b.length - 1].click();
      });
      await page.waitForTimeout(600);
      const noc = await themeState(page);
      check("přepínač režimu přepne na noc", noc.mode === "dark", noc.mode);
      check("přepínač režimu nechá rodinu být", noc.family === ORDER[5], String(noc.family));

      // reset
      await page.evaluate(() => {
        const b = [...document.querySelectorAll("button")].find((x) => /Signature/.test(x.innerText || "") && /Vrátit|Reset/i.test(x.innerText || ""));
        if (b) b.click();
      });
      await page.waitForTimeout(600);
      const res = await themeState(page);
      check("reset vrátí Signature a den", res.family === "signature" && res.mode === "light", `${res.family}/${res.mode}`);
    }
    check("Nastavení · bez chyby stránky", errs.length === 0, errs.slice(0, 2).join(" | "));
    await ctx.close();
  }

  // ---- 7 · rychlý přepínač v liště nechá rodinu být ------------------------
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const { page } = await openApp(ctx, JSON.stringify({ version: 2, family: "olive-gold", mode: "light" }));
    await page.waitForTimeout(1700);
    const kliklo = await page.evaluate(() => {
      const b = [...document.querySelectorAll("button")].find((x) => /^(Linen|Forest)$/i.test((x.innerText || "").trim()));
      if (!b) return false;
      b.click(); return true;
    });
    if (kliklo) {
      await page.waitForTimeout(600);
      const s = await themeState(page);
      check("rychlý přepínač mění jen režim", s.family === "olive-gold" && s.mode === "dark", `${s.family}/${s.mode}`);
    } else {
      note("rychlý přepínač v liště · v téhle aplikaci na desktopu není, přeskočeno");
    }
    await ctx.close();
  }

  // ---- 8 · přežije reload -------------------------------------------------
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const { page } = await openApp(ctx, JSON.stringify({ version: 2, family: "clay-alabaster", mode: "dark" }));
    await page.waitForTimeout(1500);
    await page.reload({ waitUntil: "domcontentloaded" });
    const s = await themeState(page);
    check("volba přežije reload a je tam hned", s.family === "clay-alabaster" && s.mode === "dark", `${s.family}/${s.mode}`);
    await ctx.close();
  }

  // ---- 9 · čtrnáct palet na skutečné stránce ------------------------------
  // Nejde o snímek. Ptáme se, jestli text na poli, které rodina opravdu
  // vykreslila, drží kontrast — a jestli stránka nepřeteče do strany.
  {
    for (const fam of Object.keys(FIELDS)) {
      for (const mode of ["light", "dark"]) {
        const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
        const { page, errs } = await openApp(ctx, JSON.stringify({ version: 2, family: fam, mode }));
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
          /* VIZUÁLNÍ PŘIJETÍ, měřené na skutečně vykreslené stránce (V1.1 §10).
             `nadmira` je podíl viditelných prvků, které nesou akcent jako
             výplň nebo barvu písma — když je akcent všude, přestává být
             akcentem. `sytost` je sytost pole, které prohlížeč opravdu
             namaloval: v noci to musí být uhel, ne barevný blok. */
          const kanaly = (c) => c.match(/\d+(\.\d+)?/g).map(Number);
          const syt = (c) => { const p = kanaly(c); return (Math.max(p[0], p[1], p[2]) - Math.min(p[0], p[1], p[2])) / 255; };
          const acc = getComputedStyle(document.documentElement).getPropertyValue("--tm-accent").trim();
          const accRgb = (() => { const h = acc.replace("#", ""); return h.length === 6 ? [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) : null; })();
          const blizko = (c) => { if (!accRgb || !c) return false; const p = kanaly(c); return Math.abs(p[0] - accRgb[0]) + Math.abs(p[1] - accRgb[1]) + Math.abs(p[2] - accRgb[2]) < 12 && (p[3] === undefined || p[3] > 0.5); };
          /* Počítá se VÝPLŇ a HRANA, ne barva písma: odkaz, nadpis nebo aktivní
             položka v akcentu je v pořádku a je to jeho práce. Nadměrné je,
             když se akcentem maluje plocha. */
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
        check(`${fam}/${mode} · nepřetéká do strany`, m.presah === 0, "přesah " + m.presah + "px");
        check(`${fam}/${mode} · bez chyby stránky`, errs.length === 0, errs.slice(0, 1).join(""));
        // 3:1 je podlaha měřená proti POLI stránky · text na kartě se měří
        // proti kartě v node testu, tady jde o hrubý nález typu „bílá na bílé".
        check(`${fam}/${mode} · žádný text nesplynul s polem`, m.worst >= 3, `nejhorší ${m.worst} · ${m.kde}`);
        if (mode === "dark") {
          check(`${fam}/dark · pole je uhel, ne barevný blok`, m.sytostPole <= 0.06, `sytost ${m.sytostPole}`);
        }
        check(`${fam}/${mode} · akcent není všude`, m.nadmira <= 0.18, `${Math.round(m.nadmira * 100)} % z ${m.vidno} prvků`);
        await ctx.close();
      }
    }
  }
} finally {
  await browser.close();
  srv.close();
}

console.log(R.join("\n"));
console.log(failed ? `\n${failed} kontrol selhalo` : `\nvše prošlo · ${R.filter((x) => x.startsWith("PASS")).length} kontrol`);
process.exit(failed ? 1 : 0);
