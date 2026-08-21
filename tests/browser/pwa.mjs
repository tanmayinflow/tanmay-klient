// PWA A SERVISNÍ PRACOVNÍK · registrace, offline start, a hlavně to, co se
// smí a nesmí dostat do mezipaměti.
// Vyžaduje Chromium a playwright-core; kde nejsou, zkouška se přeskočí.
//   npm run build && node tests/browser/pwa.mjs
import { createServer } from "./server.mjs";
let chromium;
try { ({ chromium } = await import("playwright-core")); }
catch { console.log("SKIP · playwright-core není k dispozici (npm i -D playwright-core)"); process.exit(0); }
const EXE = process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const PORT = Number(process.env.PORT || 8871), BASE = "http://localhost:" + PORT;

const srv = createServer(); await new Promise((r) => srv.listen(PORT, r));
const R = []; let failed = 0;
const check = (n, ok, x = "") => { if (!ok) failed++; R.push((ok ? "PASS " : "FAIL ") + n + (x ? " — " + x : "")); };

let browser;
try { browser = await chromium.launch({ executablePath: EXE, args: ["--no-sandbox"] }); }
catch (e) { console.log("SKIP · Chromium se nepodařilo spustit: " + e.message); srv.close(); process.exit(0); }

try {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errs = []; page.on("pageerror", (e) => errs.push(String(e).split("\n")[0]));
  await page.addInitScript(() => { localStorage.setItem("tm-lang", "cs"); if (!localStorage.getItem("tanmay_coll_v1")) localStorage.setItem("tanmay_coll_v1", JSON.stringify({ modules: ["praxe","trenink","denik","kompas","zapisnik","prameny","hospodareni"] })); });
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2500);

  const reg = await page.evaluate(async () => { const r = await navigator.serviceWorker.getRegistration(); return { has: !!r, active: !!(r && r.active) }; });
  check("servisní pracovník se zaregistruje", reg.has && reg.active, JSON.stringify(reg));

  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);
  const klice = await page.evaluate(() => caches.keys());
  check("shell je v mezipaměti", klice.some((k) => k.startsWith("shell-")), klice.join(","));
  check("index.html je uložený pro offline", await page.evaluate(async () => { const k = (await caches.keys()).find((x) => x.startsWith("shell-")); return !!(await (await caches.open(k)).match("/index.html")); }));

  // Chybějící soubor se na tomhle hostingu vrací jako index.html se stavem 200.
  // Kdyby se takový dokument uložil pod adresou souboru, zůstal by tam i po
  // nasazení opravy a soubor by byl rozbitý natrvalo.
  const spatne = await page.evaluate(async () => {
    const url = "/assets/neexistujici-" + Math.floor(Date.now() / 1000) + ".js";
    await fetch(url).catch(() => {});
    await new Promise((r) => setTimeout(r, 400));
    for (const k of await caches.keys()) {
      const hit = await (await caches.open(k)).match(url);
      if (hit) return { cached: true, cache: k, type: hit.headers.get("content-type") };
    }
    return { cached: false };
  });
  check("chybějící soubor se neuloží jako HTML pod svou adresou", !spatne.cached, JSON.stringify(spatne));

  await ctx.setOffline(true);
  const doslo = await page.goto(BASE, { waitUntil: "domcontentloaded" }).then(() => true).catch(() => false);
  await page.waitForTimeout(1500);
  const vykresleno = await page.evaluate(() => !!document.querySelector("#root") && document.querySelector("#root").children.length > 0).catch(() => false);
  check("aplikace nastartuje offline", doslo && vykresleno);
  await ctx.setOffline(false);

  await page.goto(BASE, { waitUntil: "domcontentloaded" }); await page.waitForTimeout(1500);
  const apiVCache = await page.evaluate(async () => {
    for (const k of await caches.keys()) for (const req of await (await caches.open(k)).keys()) if (new URL(req.url).pathname === "/api/state") return k;
    return null;
  });
  check("odpověď /api/state není v mezipaměti", apiVCache === null, String(apiVCache));
  check("bez chyby stránky", errs.length === 0, errs.slice(0, 2).join(" | "));
  await ctx.close();
} catch (e) { check("harness", false, e.message); }
await browser.close(); srv.close();
console.log(R.join("\n"));
process.exit(failed ? 1 : 0);
