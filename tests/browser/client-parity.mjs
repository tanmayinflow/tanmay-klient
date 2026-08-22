// STEJNÝ DŮM · klientská aplikace proti osobní, v prohlížeči.
//
// Tokeny se dají porovnat ve zdroji, ale to nic neříká o tom, co se opravdu
// vykreslí. Tahle zkouška spustí obě sestavení vedle sebe a ptá se prohlížeče:
// jaké je pole, jaké je písmo, jak vysoké je tlačítko, přetéká stránka.
//
//   npm run build && node tests/browser/client-parity.mjs
//
// Osobní aplikaci hledá vedle: ../tanmay-web/dist. Když tam není, ta část
// zkoušky se přeskočí a řekne to — nelže o tom, co neproběhlo.
import { createServer } from "./server.mjs";
import { existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname } from "node:path";

let chromium;
try { ({ chromium } = await import("playwright-core")); }
catch { console.log("SKIP · playwright-core není k dispozici"); process.exit(0); }

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../..");
const MAIN_DIST = resolve(ROOT, "../tanmay-web/dist");
const EXE = process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const PORT = Number(process.env.PORT || 8895);
const MAIN_PORT = PORT + 1;
const BASE = "http://localhost:" + PORT;
const MAIN_BASE = "http://localhost:" + MAIN_PORT;

const R = []; let failed = 0, skipped = 0;
const check = (n, ok, x = "") => { if (!ok) failed++; R.push((ok ? "PASS " : "FAIL ") + n + (x ? " — " + x : "")); };
const skip = (n, why) => { skipped++; R.push("SKIP " + n + " — " + why); };

const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".webmanifest": "application/manifest+json", ".png": "image/png", ".svg": "image/svg+xml", ".ico": "image/x-icon",
  ".webp": "image/webp", ".jpg": "image/jpeg" };

/** Holý statický server pro osobní sestavení · žádné API, jen soubory. */
function staticServer(root) {
  return http.createServer(async (req, res) => {
    const u = new URL(req.url, "http://x");
    if (u.pathname.startsWith("/api/")) { res.writeHead(200, { "Content-Type": "application/json" }); return res.end("{}"); }
    let p = join(root, u.pathname === "/" ? "index.html" : u.pathname.slice(1));
    try {
      const buf = await readFile(p);
      res.writeHead(200, { "Content-Type": MIME[extname(p)] || "application/octet-stream" });
      res.end(buf);
    } catch {
      try {
        const buf = await readFile(join(root, "index.html"));
        res.writeHead(200, { "Content-Type": "text/html" }); res.end(buf);
      } catch { res.writeHead(404); res.end(); }
    }
  });
}

const srv = createServer(); await new Promise((r) => srv.listen(PORT, r));
const hasMain = existsSync(MAIN_DIST);
let msrv = null;
if (hasMain) { msrv = staticServer(MAIN_DIST); await new Promise((r) => msrv.listen(MAIN_PORT, r)); }

let browser;
try { browser = await chromium.launch({ executablePath: EXE, args: ["--no-sandbox"] }); }
catch (e) { console.log("SKIP · Chromium se nepodařilo spustit: " + e.message); srv.close(); if (msrv) msrv.close(); process.exit(0); }

/** Co prohlížeč doopravdy vykreslil. Ne co je napsané ve zdroji. */
const tokensOf = (page) => page.evaluate(() => {
  const root = document.querySelector(".tm-page") || document.body;
  const cs = getComputedStyle(document.body);
  // Tělo samo font nenese — ptáme se prvku, ve kterém opravdu stojí text.
  const prose = [...root.querySelectorAll("div,span,p")]
    .find((e) => e.childElementCount === 0 && (e.innerText || "").trim().length > 12);
  const heading = [...root.querySelectorAll("div,span,h1,h2")]
    .map((e) => getComputedStyle(e).fontFamily)
    .find((f) => /Garamond/.test(f));
  return {
    bg: cs.backgroundColor,
    color: getComputedStyle(root).color,
    bodyFont: prose ? getComputedStyle(prose).fontFamily : "",
    accent: (() => {
      const b = [...document.querySelectorAll("button")].map((x) => getComputedStyle(x).borderColor).filter(Boolean);
      return b.length ? b[0] : "";
    })(),
    displayFont: heading || "",
  };
});

async function openApp(base, { w = 1280, h = 900, lang = "cs", theme = "light", seed = null } = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  const errs = []; page.on("pageerror", (e) => errs.push(String(e).split("\n")[0]));
  await page.addInitScript(([lg, th, sd]) => {
    localStorage.setItem("tm-lang", lg);
    localStorage.setItem("tm-theme", th);
    if (sd) localStorage.setItem("tanmay_coll_v1", sd);
  }, [lang, theme, seed]);
  await page.goto(base, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1400);
  return { ctx, page, errs };
}

try {
  // --------------------------------------------------------------
  // 1 · POLE A PÍSMO · týž dům ráno i večer
  // --------------------------------------------------------------
  for (const theme of ["light", "dark"]) {
    const c = await openApp(BASE, { theme, seed: JSON.stringify({ modules: [] }) });
    const kt = await tokensOf(c.page);
    const want = theme === "light" ? "rgb(244, 240, 235)" : "rgb(28, 28, 26)";
    check(`${theme} · pole klienta je ${theme === "light" ? "Linen" : "Forest Night"}`, kt.bg === want, kt.bg);
    check(`${theme} · tělo píše DM Sans`, /DM Sans/.test(kt.bodyFont), kt.bodyFont);
    check(`${theme} · nadpisy píše Garamond`, /Garamond/.test(kt.displayFont), kt.displayFont);
    check(`${theme} · bez chyby stránky`, c.errs.length === 0, c.errs.join(" | "));

    if (hasMain) {
      const m = await openApp(MAIN_BASE, { theme });
      const mt = await tokensOf(m.page);
      check(`${theme} · pole je v obou domech totéž`, kt.bg === mt.bg, `klient ${kt.bg} · osobní ${mt.bg}`);
      check(`${theme} · inkoust je v obou domech týž`, kt.color === mt.color, `klient ${kt.color} · osobní ${mt.color}`);
      check(`${theme} · tělo píše v obou domech týmž řezem`, kt.bodyFont === mt.bodyFont, `klient ${kt.bodyFont} · osobní ${mt.bodyFont}`);
      await m.ctx.close();
    } else {
      skip(`${theme} · srovnání s osobní aplikací`, "../tanmay-web/dist neexistuje");
    }
    await c.ctx.close();
  }

  // --------------------------------------------------------------
  // 2 · JAZYK · čeština nese EB Garamond, angličtina Cormorant
  // --------------------------------------------------------------
  for (const [lang, face] of [["cs", "EB Garamond"], ["en", "Cormorant Garamond"]]) {
    const c = await openApp(BASE, { lang, seed: JSON.stringify({ modules: [] }) });
    const html = await c.page.evaluate(() => document.documentElement.lang);
    check(`${lang} · dokument má jazyk pro odečítač obrazovky`, html === lang, html);
    // Wordmark je Cormorant v obou jazycích (v „tanmay" není diakritika),
    // takže se ptáme na nadpisy uvnitř stránky, ne na logo v panelu.
    const fonts = await c.page.evaluate(() => {
      const root = document.querySelector(".tm-page") || document.body;
      return [...root.querySelectorAll("div,span,h1,h2,h3")]
        .map((e) => getComputedStyle(e).fontFamily).filter((f) => /Garamond/.test(f));
    });
    check(`${lang} · displejové písmo je ${face}`, fonts.some((f) => f.indexOf("\"" + face + "\"") === 0 || f.indexOf("'" + face + "'") === 0), fonts.slice(0, 2).join(" | "));
    await c.ctx.close();
  }

  // --------------------------------------------------------------
  // 3 · MAPA DOMU · co je vidět a co ne
  // --------------------------------------------------------------
  {
    const c = await openApp(BASE, { seed: JSON.stringify({ modules: [] }) });
    const txt = await c.page.evaluate(() => (document.querySelector(".tm-sidebar") || document.body).innerText);
    for (const room of ["Praxe", "Trénink", "Termíny", "Kompas", "Prameny"]) {
      check(`boční panel drží ${room}`, txt.indexOf(room) !== -1);
    }
    for (const gone of ["Hospodaření", "Klienti", "Tvorba", "Mandala"]) {
      check(`boční panel neukazuje ${gone}`, txt.indexOf(gone) === -1);
    }
    check("soukromé místnosti jsou ve výchozím stavu zavřené", txt.indexOf("Deník") === -1 && txt.indexOf("Zápisník") === -1, txt.replace(/\n/g, " ").slice(0, 160));
    check("Memento je ve výchozím stavu vypnuté", txt.indexOf("Memento") === -1);
    await c.ctx.close();
  }

  // --------------------------------------------------------------
  // 4 · MOBIL · dok, přetečení, velikost cílů
  // --------------------------------------------------------------
  for (const [w, h, name] of [[390, 844, "390px"], [834, 1112, "834px"], [1440, 900, "1440px"]]) {
    for (const theme of ["light", "dark"]) {
      const c = await openApp(BASE, { w, h, theme, seed: JSON.stringify({ modules: [] }) });
      const over = await c.page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
      check(`${name} · ${theme} · stránka nepřetéká do strany`, over === 0, "přesah " + over + "px");
      // Stejná míra, jakou používá osobní aplikace ve své vlastní zkoušce:
      // 26 × 26, jen to, co je opravdu na obrazovce, bez kalendářních šipek.
      const small = await c.page.evaluate(() => {
        const bad = [];
        for (const el of document.querySelectorAll("button")) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          if (r.top > window.innerHeight || r.bottom < 0) continue;
          if (/^[‹›×]/.test((el.innerText || "").trim())) continue;
          if (el.classList.contains("tm-wb-dot") || el.classList.contains("tm-wb-mark")) continue;
          if (r.height < 26 || r.width < 26) bad.push((el.innerText || el.title || el.getAttribute("aria-label") || "?").slice(0, 20) + " " + Math.round(r.width) + "×" + Math.round(r.height));
        }
        return bad.slice(0, 6);
      });
      check(`${name} · ${theme} · tlačítka mají kam šlápnout`, small.length === 0, small.join(" | "));
      check(`${name} · ${theme} · bez chyby stránky`, c.errs.length === 0, c.errs.join(" | "));
      if (w === 390) {
        const dock = await c.page.evaluate(() => {
          const nav = document.querySelector(".tm-tabbar");
          if (!nav) return null;
          const labels = [...nav.querySelectorAll("button")].map((b) => b.innerText.trim()).filter(Boolean);
          const r = nav.getBoundingClientRect();
          return { labels, bottom: Math.round(r.bottom), vh: window.innerHeight, visible: getComputedStyle(nav).display !== "none" };
        });
        check("390px · dok je vidět", !!dock && dock.visible, JSON.stringify(dock && dock.labels));
        if (dock && dock.visible) {
          const uniq = [...new Set(dock.labels)];
          const want = ["PRAXE", "TRÉNINK", "TERMÍNY", "KOMPAS", "PRAMENY"];
          const got = uniq.map((x) => x.toUpperCase()).filter((x) => want.indexOf(x) !== -1);
          check("390px · dok drží Termíny i Trénink", got.indexOf("TERMÍNY") !== -1 && got.indexOf("TRÉNINK") !== -1, uniq.join(","));
          check("390px · dok nezavádí obecné Více", uniq.every((x) => !/^V[íi]ce$/i.test(x)), uniq.join(","));
          check("390px · dok sedí u dolní hrany", Math.abs(dock.bottom - dock.vh) <= 2, `${dock.bottom} vs ${dock.vh}`);
        }
      }
      await c.ctx.close();
    }
  }

  // --------------------------------------------------------------
  // 5 · VOLBA SVĚTLA PŘEŽIJE ZAVŘENÍ
  // --------------------------------------------------------------
  {
    // Bez init skriptu · volba se má vzít z úložiště, ne z toho, co jí zkouška
    // podstrčí při každém načtení.
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1200);
    const before = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    check("dům se otevírá do světla", before === "rgb(244, 240, 235)", before);
    await page.evaluate(() => localStorage.setItem("tm-theme", "dark"));
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1200);
    const after = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    check("volba noci přežije načtení", after === "rgb(28, 28, 26)", after);
    const meta = await page.evaluate(() => (document.querySelector('meta[name="theme-color"]') || {}).content);
    check("barva lišty prohlížeče jde s motivem", meta === "#1C1C1A", String(meta));
    await ctx.close();
  }

  // --------------------------------------------------------------
  // 6 · KLÁVESNICE A ODEČÍTAČ
  // --------------------------------------------------------------
  {
    const c = await openApp(BASE, { seed: JSON.stringify({ modules: [] }) });
    const focusable = await c.page.evaluate(() => [...document.querySelectorAll("button,a[href],input,select,textarea,[tabindex]:not([tabindex='-1'])")].length);
    check("klávesnice se má čeho chytit", focusable > 5, String(focusable));
    const named = await c.page.evaluate(() => [...document.querySelectorAll("button")]
      .filter((b) => !b.innerText.trim() && !b.getAttribute("aria-label") && !b.getAttribute("title")).length);
    check("žádné tlačítko není beze jména", named === 0, named + " bez popisku");
    await c.ctx.close();
  }
} finally {
  await browser.close();
  srv.close();
  if (msrv) msrv.close();
}

for (const line of R) console.log(line);
console.log(failed ? `\n${failed} kontrol selhalo` : `\nvše prošlo · ${R.length - skipped} kontrol${skipped ? ` · ${skipped} přeskočeno` : ""}`);
process.exit(failed ? 1 : 0);
