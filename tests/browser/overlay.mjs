// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/repo-tests-browser/overlay.mjs
// Change it there, then run `npm run shared:sync` in the outer workspace.
//
// VRSTVY V PROHLÍŽEČI · to, co se nedá ověřit ve zdroji.
//
// Zásobník Escape, zámek stránky a ohradu pro focus ověřuje `tests/overlay.test.js`
// nad čistým modulem. Tenhle soubor se ptá skutečné aplikace: otevře opravdový
// list, zamkne opravdovou stránku, stiskne opravdový Escape a podívá se, kde
// skončil focus. Běží v obou aplikacích proti témuž kódu.
//
//   npm run build && node tests/browser/overlay.mjs
import { createServer } from "./server.mjs";

let chromium;
try { ({ chromium } = await import("playwright-core")); }
catch { console.log("SKIP · playwright-core není k dispozici"); process.exit(0); }

const EXE = process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const PORT = Number(process.env.PORT || 8931);
const BASE = "http://localhost:" + PORT;

const R = []; let failed = 0;
const check = (n, ok, x = "") => { if (!ok) failed++; R.push((ok ? "PASS " : "FAIL ") + n + (x ? " — " + x : "")); };

const srv = createServer(); await new Promise((r) => srv.listen(PORT, r));
let browser;
try { browser = await chromium.launch({ executablePath: EXE, args: ["--no-sandbox"] }); }
catch (e) { console.log("SKIP · Chromium se nepodařilo spustit: " + e.message); srv.close(); process.exit(0); }

const stav = (page) => page.evaluate(() => ({
  sheet: !!document.querySelector(".tm-cs"),
  sheets: document.querySelectorAll(".tm-cs").length,
  bodyPosition: getComputedStyle(document.body).position,
  bodyOverflow: getComputedStyle(document.body).overflow,
  scrollY: window.scrollY,
  aktivni: (() => {
    const a = document.activeElement;
    if (!a || a === document.body) return "body";
    return (a.className && String(a.className).split(" ")[0]) || a.tagName;
  })(),
  vSheetu: (() => {
    const cs = document.querySelector(".tm-cs");
    return !!(cs && cs.contains(document.activeElement));
  })(),
  dialog: (() => {
    const cs = document.querySelector(".tm-cs");
    return cs ? { role: cs.getAttribute("role"), modal: cs.getAttribute("aria-modal") } : null;
  })(),
}));

try {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const errs = []; page.on("pageerror", (e) => errs.push(String(e).split("\n")[0]));
  await page.addInitScript(() => {
    localStorage.setItem("tm-lang", "cs");
    localStorage.setItem("tm-theme", "light");
    if (!localStorage.getItem("tanmay_coll_v1")) localStorage.setItem("tanmay_coll_v1", JSON.stringify({ modules: [] }));
  });
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1600);

  // Průvodce se při prvním spuštění otevře sám · zavřeme ho, ať neplete vrstvy.
  await page.evaluate(() => { localStorage.setItem("tmGuideVersion", "999"); });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1600);

  // Stránku napřed odrolujeme, aby bylo co ztratit.
  await page.evaluate(() => window.scrollTo(0, 240));
  await page.waitForTimeout(120);
  const pred = await stav(page);
  check("před otevřením žádný list nestojí", !pred.sheet);
  // Kolik se opravdu odrolovalo · krátká místnost se odrolovat nedá a
  // porovnávat proti přání místo proti skutečnosti by byla lež.
  const kdeJsmeByli = pred.scrollY;

  const otevri = async () => {
    const ok = await page.evaluate(() => {
      const g = document.querySelector(".tm-gear");
      if (!g) return false;
      g.focus();
      g.click();
      return true;
    });
    await page.waitForTimeout(600);
    return ok;
  };

  check("ozubené kolo na telefonu existuje", await otevri());
  const otevreno = await stav(page);
  check("list se otevřel", otevreno.sheet, JSON.stringify(otevreno).slice(0, 120));
  check("list se hlásí jako dialog", otevreno.dialog && otevreno.dialog.role === "dialog" && otevreno.dialog.modal === "true", JSON.stringify(otevreno.dialog));
  check("stránka pod listem je zamčená", otevreno.bodyPosition === "fixed", otevreno.bodyPosition);
  check("focus je uvnitř listu", otevreno.vSheetu, otevreno.aktivni);

  // Escape · jedna vrstva
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
  const poEsc = await stav(page);
  check("Escape list zavřel", !poEsc.sheet);
  check("zámek stránky se pustil", poEsc.bodyPosition !== "fixed", poEsc.bodyPosition);
  check("stránka se vrátila na svou polohu", Math.abs(poEsc.scrollY - kdeJsmeByli) <= 2, `${poEsc.scrollY} vs ${kdeJsmeByli}`);
  check("focus se vrátil na ozubené kolo", poEsc.aktivni === "tm-gear", poEsc.aktivni);

  // Tlačítko zpět
  await otevri();
  const predBack = await stav(page);
  check("list znovu otevřený", predBack.sheet);
  await page.goBack();
  await page.waitForTimeout(600);
  const poBack = await stav(page);
  check("tlačítko zpět zavře list, ne aplikaci", !poBack.sheet && page.url().indexOf(BASE) === 0, page.url());
  check("po gestu zpět zámek nezůstal", poBack.bodyPosition !== "fixed", poBack.bodyPosition);

  // Zavření křížkem · historie se nesmí zanést
  await otevri();
  await page.evaluate(() => {
    const cs = document.querySelector(".tm-cs");
    const btns = [...cs.querySelectorAll("button")];
    const x = btns.find((b) => (b.innerText || "").trim() === "×");
    if (x) x.click();
  });
  await page.waitForTimeout(600);
  const poKrizku = await stav(page);
  check("křížek list zavřel", !poKrizku.sheet);
  check("po křížku zámek nezůstal", poKrizku.bodyPosition !== "fixed", poKrizku.bodyPosition);
  // Zavření křížkem si musí svůj záznam v historii vzít zpátky. Kdyby ho tam
  // nechalo, další stisk zpět by prázdně cvakl a teprve ten druhý by odešel.
  // Navigovat pryč tu nejde — za první položkou už je about:blank a init
  // skript zkoušky by na něm spadl na localStorage.
  const histStav = await page.evaluate(() => (window.history.state && window.history.state.tmOverlay) || null);
  check("křížek si svůj záznam v historii vzal zpátky", histStav === null, String(histStav));

  check("bez chyby stránky", errs.length === 0, errs.join(" | "));
  await ctx.close();

  // ---- desktop · týž list, jiná šířka ----------------------------------
  const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p2 = await ctx2.newPage();
  const errs2 = []; p2.on("pageerror", (e) => errs2.push(String(e).split("\n")[0]));
  await p2.addInitScript(() => {
    localStorage.setItem("tm-lang", "en");
    localStorage.setItem("tm-theme", "dark");
    localStorage.setItem("tmGuideVersion", "999");
    if (!localStorage.getItem("tanmay_coll_v1")) localStorage.setItem("tanmay_coll_v1", JSON.stringify({ modules: [] }));
  });
  await p2.goto(BASE, { waitUntil: "domcontentloaded" });
  await p2.waitForTimeout(1600);
  const otevriD = await p2.evaluate(() => {
    const kandidati = [...document.querySelectorAll("button")];
    const b = kandidati.find((x) => /nastaven|settings/i.test((x.title || "") + " " + (x.getAttribute("aria-label") || "")));
    if (!b) return false;
    b.focus(); b.click(); return true;
  });
  await p2.waitForTimeout(600);
  const d = await stav(p2);
  check("desktop · list se otevřel", otevriD && d.sheet);
  check("desktop · focus je uvnitř", d.vSheetu, d.aktivni);
  await p2.keyboard.press("Escape");
  await p2.waitForTimeout(500);
  const d2 = await stav(p2);
  check("desktop · Escape zavřel", !d2.sheet);
  check("desktop · zámek se pustil", d2.bodyPosition !== "fixed", d2.bodyPosition);
  check("desktop · bez chyby stránky", errs2.length === 0, errs2.join(" | "));
  await ctx2.close();
} finally {
  await browser.close();
  srv.close();
}

for (const line of R) console.log(line);
console.log(failed ? `\n${failed} kontrol selhalo` : `\nvše prošlo · ${R.length} kontrol`);
process.exit(failed ? 1 : 0);
