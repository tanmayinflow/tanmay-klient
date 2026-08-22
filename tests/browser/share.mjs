// VĚDOMÉ SDÍLENÍ V PROHLÍŽEČI · co člověk potvrzuje, to musí předtím vidět.
//
// Popis vedle přepínače nestačí. Před potvrzením se musí dát ukázat přesně to,
// co odejde — ze skutečných dat, ne z příkladu. A po vypnutí nesmí na serveru
// zůstat nic.
//
//   npm run build && node tests/browser/share.mjs
import { createServer, state } from "./server.mjs";

let chromium;
try { ({ chromium } = await import("playwright-core")); }
catch { console.log("SKIP · playwright-core není k dispozici"); process.exit(0); }

const EXE = process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const PORT = Number(process.env.PORT || 8941);
const BASE = "http://localhost:" + PORT;

const R = []; let failed = 0;
const check = (n, ok, x = "") => { if (!ok) failed++; R.push((ok ? "PASS " : "FAIL ") + n + (x ? " — " + x : "")); };

const srv = createServer(); await new Promise((r) => srv.listen(PORT, r));
let browser;
try { browser = await chromium.launch({ executablePath: EXE, args: ["--no-sandbox"] }); }
catch (e) { console.log("SKIP · Chromium se nepodařilo spustit: " + e.message); srv.close(); process.exit(0); }

const otevriSdileni = async (page) => {
  const ok = await page.evaluate(() => {
    const b = [...document.querySelectorAll("button")].find((x) => (x.innerText || "").trim() === "Sdílení");
    if (!b) return false;
    b.click(); return true;
  });
  await page.waitForTimeout(700);
  return ok;
};

try {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errs = []; page.on("pageerror", (e) => errs.push(String(e).split("\n")[0]));
  await page.addInitScript(() => {
    localStorage.setItem("tm-lang", "cs");
    localStorage.setItem("tm-theme", "light");
    localStorage.setItem("tmGuideVersion", "999");
  });
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  // Vlastní cíl, ať má náhled co ukázat.
  await page.evaluate(async () => {
    const b = [...document.querySelectorAll("button")].find((x) => (x.innerText || "").trim() === "Kompas");
    if (b) { b.click(); await new Promise((r) => setTimeout(r, 700)); }
    const d = [...document.querySelectorAll("button")].find((x) => (x.innerText || "").toLowerCase().includes("otevřít dílnu"));
    if (!d) return;
    d.click();
    await new Promise((r) => setTimeout(r, 700));
    const nb = [...document.querySelectorAll(".tm-cs button")].find((x) => (x.innerText || "").toLowerCase().includes("nový cíl"));
    if (!nb) return;
    nb.click();
    await new Promise((r) => setTimeout(r, 400));
    const inp = [...document.querySelectorAll(".tm-cs input")].find((x) => x.type !== "date");
    if (!inp) return;
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    setter.call(inp, "CIL PRO NAHLED");
    inp.dispatchEvent(new Event("input", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 200));
    const save = [...document.querySelectorAll(".tm-cs button")].find((x) => (x.innerText || "").trim() === "Uložit");
    if (save) save.click();
    await new Promise((r) => setTimeout(r, 700));
  });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);

  check("Sdílení se dá otevřít z levého sloupce", await otevriSdileni(page));

  const panel = await page.evaluate(() => {
    const txt = document.body.innerText || "";
    return {
      nadpis: txt.toLowerCase().indexOf("vědomé sdílení") !== -1,
      tlacitko: txt.indexOf("Ukázat, co přesně odejde") !== -1,
      nikdy: txt.indexOf("nesdílejí nikdy") !== -1 || txt.indexOf("Deník, Zápisník") !== -1,
    };
  });
  check("panel sdílení se otevřel", panel.nadpis, JSON.stringify(panel));
  check("náhled se dá vyžádat před potvrzením", panel.tlacitko);
  check("je řečeno, co se nesdílí nikdy", panel.nikdy);

  // Vypnuto · náhled musí říct, že neodejde nic.
  await page.evaluate(() => {
    const b = [...document.querySelectorAll("button")].find((x) => (x.innerText || "").indexOf("Ukázat, co přesně odejde") !== -1);
    if (b) b.click();
  });
  await page.waitForTimeout(500);
  const prazdno = await page.evaluate(() => (document.body.innerText || "").indexOf("Zatím neodejde nic") !== -1);
  check("s vypnutými přepínači náhled říká, že neodejde nic", prazdno);

  // Zapneme cíle · náhled musí ukázat skutečný cíl, ne příklad.
  const zapnuto = await page.evaluate(async () => {
    const b = [...document.querySelectorAll('button[aria-pressed]')].find((x) => (x.innerText || "").indexOf("Cíle") === 0);
    if (!b) return false;
    b.click();
    await new Promise((r) => setTimeout(r, 600));
    return true;
  });
  check("přepínač Cíle se dá zapnout", zapnuto);
  const sCilem = await page.evaluate(() => {
    const txt = document.body.innerText || "";
    return {
      cil: txt.indexOf("CIL PRO NAHLED") !== -1,
      tohle: txt.toLowerCase().indexOf("tohle odejde") !== -1,
      syrove: txt.indexOf("Ukázat to i syrově") !== -1,
    };
  });
  check("náhled ukazuje skutečný cíl, ne příklad", sCilem.cil, JSON.stringify(sCilem));
  check("náhled je označený jako to, co odejde", sCilem.tohle);
  check("dá se podívat i na syrový tvar", sCilem.syrove);

  // Deník ani Zápisník se v náhledu neobjeví ani jako klíč.
  const cist = await page.evaluate(() => {
    const pre = [...document.querySelectorAll("pre")].map((x) => x.innerText).join("\n");
    return {
      delka: pre.length,
      denik: /"journal"|"notebook"|"reflection"|"evening"/.test(pre),
    };
  });
  check("v syrovém náhledu není deník ani zápisník", !cist.denik, String(cist.delka));

  // Potvrzení · na server odejde přesně to, co náhled ukázal.
  // Tlačítko hledáme uvnitř dialogu — „Uložit" má i dílna Kompasu.
  const potvrzeno = await page.evaluate(async () => {
    const dlg = [...document.querySelectorAll('[role="dialog"]')].find((d) => (d.innerText || "").toLowerCase().indexOf("vědomé sdílení") !== -1);
    if (!dlg) return "bez dialogu sdílení";
    // Popisek kreslí CSS verzálkami · innerText vrací „ULOŽIT".
    const b = [...dlg.querySelectorAll("button")].find((x) => ["uložit", "vstoupit", "save", "enter"].indexOf((x.innerText || "").trim().toLowerCase()) !== -1);
    if (!b) return "bez tlačítka: " + [...dlg.querySelectorAll("button")].map((x) => (x.innerText || "").trim()).join("|").slice(0, 200);
    b.click();
    await new Promise((r) => setTimeout(r, 2600));
    return "ok";
  });
  check("sdílení se dá potvrdit", potvrzeno === "ok", potvrzeno);
  // Odeslání je odložené o 1,5 s a čeká, až je synchronizace připravená.
  let naServeru = null;
  for (let i = 0; i < 24; i++) {
    await page.waitForTimeout(600);
    naServeru = await page.evaluate(async () => (await fetch("/__share").then((r) => r.json())).share);
    if (naServeru && naServeru.goals) break;
  }
  check("na server dorazil souhrn s cílem", !!(naServeru && naServeru.goals && naServeru.goals.some((g) => g.name === "CIL PRO NAHLED")), JSON.stringify(naServeru));
  check("na server nedorazil deník ani zápisník", !/journal|notebook|reflection|evening/.test(JSON.stringify(naServeru || {})));

  // Vypnutí · snímek se zneplatní.
  await otevriSdileni(page);
  await page.evaluate(async () => {
    const dlg = [...document.querySelectorAll('[role="dialog"]')].find((d) => (d.innerText || "").toLowerCase().indexOf("vědomé sdílení") !== -1);
    if (!dlg) return;
    const b = [...dlg.querySelectorAll('button[aria-pressed="true"]')].find((x) => (x.innerText || "").indexOf("Cíle") === 0);
    if (b) b.click();
    await new Promise((r) => setTimeout(r, 400));
    const save = [...dlg.querySelectorAll("button")].find((x) => ["uložit", "vstoupit", "save", "enter"].indexOf((x.innerText || "").trim().toLowerCase()) !== -1);
    if (save) save.click();
    await new Promise((r) => setTimeout(r, 2600));
  });
  let poVypnuti = naServeru;
  for (let i = 0; i < 24; i++) {
    await page.waitForTimeout(600);
    poVypnuti = await page.evaluate(async () => (await fetch("/__share").then((r) => r.json())).share);
    if (!poVypnuti || !poVypnuti.goals) break;
  }
  check("po vypnutí na serveru nezůstal žádný souhrn", poVypnuti === null || poVypnuti === undefined || !poVypnuti.goals, JSON.stringify(poVypnuti));

  check("bez chyby stránky", errs.length === 0, errs.join(" | "));
  await ctx.close();
} finally {
  await browser.close();
  srv.close();
}

console.log(R.join("\n"));
console.log(failed ? `\n${failed} kontrol selhalo` : `\nvše prošlo · ${R.length} kontrol`);
process.exit(failed ? 1 : 0);
