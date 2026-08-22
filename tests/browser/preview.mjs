// NÁHLED PŘED NASAZENÍM · tři šířky, dva jazyky, dvě světla, všechny místnosti.
//
// Tohle není zkouška jedné obrazovky. Projde dům tak, jak ho projde člověk:
// na telefonu, na tabletu i na stole, česky i anglicky, ve světle i ve tmě —
// a v každé místnosti se ptá na tři věci:
//
//   · nepřetéká stránka do strany
//   · nespadla konzole
//   · má se kam šlápnout · 26 px je technické minimum drobného sekundárního
//     ovládacího prvku, 44 px je to, co se preferuje tam, kde je místo
//
// Malé cíle se nevypisují jen jako počet: report jmenuje ty nejmenší, ať se
// dá rozhodnout, jestli je to opravdu drobný sekundární prvek, nebo přehlédnutí.
//
//   npm run build && node tests/browser/preview.mjs
import { createServer } from "./server.mjs";

let chromium;
try { ({ chromium } = await import("playwright-core")); }
catch { console.log("SKIP · playwright-core není k dispozici"); process.exit(0); }

const EXE = process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const PORT = Number(process.env.PORT || 8943);
const BASE = "http://localhost:" + PORT;

const R = []; let failed = 0;
const check = (n, ok, x = "") => { if (!ok) failed++; R.push((ok ? "PASS " : "FAIL ") + n + (x ? " — " + x : "")); };
const note = (s) => R.push("     " + s);

const srv = createServer(); await new Promise((r) => srv.listen(PORT, r));
let browser;
try { browser = await chromium.launch({ executablePath: EXE, args: ["--no-sandbox"] }); }
catch (e) { console.log("SKIP · Chromium se nepodařilo spustit: " + e.message); srv.close(); process.exit(0); }

const SIRKY = [[390, 844, "390"], [834, 1112, "834"], [1440, 900, "1440"]];
const JAZYKY = ["cs", "en"];
const SVETLA = ["light", "dark"];

// Sekundární drobnosti, u kterých je 26 px vědomý strop, ne přehlédnutí.
const DROBNE = ["‹", "›", "×", "↓", "→", "✓", "＋", "−", "↑", "«", "»", "☰", "▾", "⤢", "✕"];

const mereni = () => ({
  presah: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
  cile: (() => {
    const out = [];
    for (const el of document.querySelectorAll("button, a[href], input, select, textarea, [role='button']")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.top > window.innerHeight || r.bottom < 0) continue;
      const st = getComputedStyle(el);
      if (st.visibility === "hidden" || st.display === "none" || st.pointerEvents === "none") continue;
      const jmeno = (el.innerText || el.title || el.getAttribute("aria-label") || el.getAttribute("placeholder") || el.tagName).trim().slice(0, 26);
      // Skutečná plocha k trefě · `tm-tap` rozšiřuje cíl neviditelným ::after,
      // takže samotný rámeček prvku o velikosti dotyku nic neříká.
      const po = getComputedStyle(el, "::after");
      let w = r.width, h = r.height;
      if (po && po.content && po.content !== "none" && po.position === "absolute") {
        const pw = parseFloat(po.width) || 0, ph = parseFloat(po.height) || 0;
        if (pw > w) w = pw;
        if (ph > h) h = ph;
      }
      out.push({ jmeno, w: Math.round(w), h: Math.round(h) });
    }
    return out;
  })(),
  bezJmena: [...document.querySelectorAll("button, [role='button']")].filter((el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    return !((el.innerText || "").trim() || el.getAttribute("aria-label") || el.title);
  }).length,
});

const mistnosti = () => {
  const nav = document.querySelector(".tm-tabbar");
  const zdroj = nav && getComputedStyle(nav).display !== "none" ? nav : document.querySelector("aside");
  if (!zdroj) return [];
  return [...new Set([...zdroj.querySelectorAll("button")].map((b) => (b.innerText || "").trim()).filter((x) => x && x.length < 20))];
};

try {
  let nejmensi = [];
  let podMin = [];
  let pod44 = 0, celkem = 0;

  for (const [w, h, sirka] of SIRKY) {
    for (const lang of JAZYKY) {
      for (const theme of SVETLA) {
        const ctx = await browser.newContext({ viewport: { width: w, height: h } });
        const page = await ctx.newPage();
        const errs = []; page.on("pageerror", (e) => errs.push(String(e).split("\n")[0]));
        await page.addInitScript(([l, th]) => {
          localStorage.setItem("tm-lang", l);
          localStorage.setItem("tm-theme", th);
          localStorage.setItem("tmGuideVersion", "999");
        }, [lang, theme]);
        await page.goto(BASE, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(1700);

        const seznam = await page.evaluate(mistnosti);
        const stitek = `${sirka} · ${lang} · ${theme}`;
        let prohlednuto = 0;

        for (const jm of seznam.slice(0, 9)) {
          const preslo = await page.evaluate((n) => {
            const nav = document.querySelector(".tm-tabbar");
            const zdroj = nav && getComputedStyle(nav).display !== "none" ? nav : document.querySelector("aside");
            const b = zdroj && [...zdroj.querySelectorAll("button")].find((x) => (x.innerText || "").trim() === n);
            if (!b) return false;
            b.click(); return true;
          }, jm);
          if (!preslo) continue;
          await page.waitForTimeout(650);
          prohlednuto++;

          const m = await page.evaluate(mereni);
          check(`${stitek} · ${jm} · nepřetéká do strany`, m.presah === 0, "přesah " + m.presah + "px");
          check(`${stitek} · ${jm} · každé tlačítko má jméno`, m.bezJmena === 0, String(m.bezJmena) + " bez popisku");
          for (const c of m.cile) {
            celkem++;
            const min = Math.min(c.w, c.h);
            if (min < 44) pod44++;
            if (min < 26) podMin.push(`${stitek} · ${jm} · ${c.jmeno} ${c.w}×${c.h}`);
            nejmensi.push({ ...c, min, kde: `${stitek} · ${jm}` });
          }
        }
        check(`${stitek} · dům se dá projít`, prohlednuto >= 3, "prošlo " + prohlednuto + " místností z " + seznam.length);
        check(`${stitek} · bez chyby stránky`, errs.length === 0, errs.slice(0, 2).join(" | "));
        await ctx.close();
      }
    }
  }

  // Tvrdá podlaha · pod 26 px se nesmí dostat nic než jmenovaná drobnost.
  const opravdove = podMin.filter((s) => !DROBNE.some((d) => s.indexOf("· " + d) !== -1));
  check("nic není pod technickým minimem 26 px", opravdove.length === 0, opravdove.slice(0, 6).join(" | "));

  // Zpráva o 44 px · není to podmínka, je to míra. Report ji musí nést.
  nejmensi.sort((a, b) => a.min - b.min);
  const prehled = {};
  for (const c of nejmensi) {
    if (c.min >= 44) continue;
    const k = c.jmeno || "?";
    if (!prehled[k]) prehled[k] = { min: c.min, w: c.w, h: c.h, kde: c.kde, n: 0 };
    prehled[k].n++;
    if (c.min < prehled[k].min) { prehled[k].min = c.min; prehled[k].w = c.w; prehled[k].h = c.h; prehled[k].kde = c.kde; }
  }
  const radky = Object.entries(prehled).sort((a, b) => a[1].min - b[1].min).slice(0, 14);
  note(`dotykové cíle · ${celkem} měřených, ${pod44} pod 44 px, ${podMin.length} pod 26 px`);
  for (const [jm, d] of radky) note(`  ${d.w}×${d.h}  ${jm}  (${d.n}×, nejmenší v ${d.kde})`);
} finally {
  await browser.close();
  srv.close();
}

console.log(R.join("\n"));
console.log(failed ? `\n${failed} kontrol selhalo` : `\nvše prošlo · ${R.filter((x) => x.startsWith("PASS")).length} kontrol`);
process.exit(failed ? 1 : 0);
