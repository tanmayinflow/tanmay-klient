// PRAMENY V PROHLÍŽEČI · jedna knihovna, dva domy.
//
// Sdílená vrstva (src/shared/ui/sources.jsx) běží v osobní i klientské
// aplikaci. Tenhle soubor se ptá skutečné aplikace: vykreslí se místnost,
// najde se hledání, přepne se zobrazení, otevře se detail. V klientské
// aplikaci navíc ověřuje sdílený pramen — že nese štítek Od Tanmaye, že se
// jeho zadání nedá přepsat, že klientova poznámka je označená jako soukromá
// a že po odebrání ze sdílení nezmizí.
//
//   npm run build && node tests/browser/sources.mjs
import { createServer } from "./server.mjs";

let chromium;
try { ({ chromium } = await import("playwright-core")); }
catch { console.log("SKIP · playwright-core není k dispozici"); process.exit(0); }

const EXE = process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const PORT = Number(process.env.PORT || 8939);
const BASE = "http://localhost:" + PORT;
const KLIENT = process.env.TM_ROLE === "client";

const R = []; let failed = 0;
const check = (n, ok, x = "") => { if (!ok) failed++; R.push((ok ? "PASS " : "FAIL ") + n + (x ? " — " + x : "")); };

const srv = createServer(); await new Promise((r) => srv.listen(PORT, r));
let browser;
try { browser = await chromium.launch({ executablePath: EXE, args: ["--no-sandbox"] }); }
catch (e) { console.log("SKIP · Chromium se nepodařilo spustit: " + e.message); srv.close(); process.exit(0); }

try {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const errs = []; page.on("pageerror", (e) => errs.push(String(e).split("\n")[0]));
  await page.addInitScript(() => {
    localStorage.setItem("tm-lang", "cs");
    localStorage.setItem("tm-theme", "light");
    localStorage.setItem("tmGuideVersion", "999");
  });
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1800);

  const doPramenu = async () => {
    const ok = await page.evaluate(() => {
      const b = [...document.querySelectorAll("button")].find((x) => (x.innerText || "").trim() === "Prameny");
      if (!b) return false;
      b.click(); return true;
    });
    await page.waitForTimeout(800);
    return ok;
  };
  check("Prameny jsou dosažitelné z navigace", await doPramenu());

  const stav = () => page.evaluate(() => {
    const txt = (document.body.innerText || "").toLowerCase();
    return {
      nadpis: txt.indexOf("prameny") !== -1,
      novy: txt.indexOf("nový titul") !== -1,
      zakazana: ["locked", "admin", "system-owned"].filter((w) => txt.indexOf(w) !== -1),
      zobrazeni: !!document.querySelector('[aria-label^="Zobrazení"]'),
      hledani: !!document.querySelector('[aria-label="Hledat v pramenech"]'),
    };
  });
  const s0 = await stav();
  check("místnost se vykreslila", s0.nadpis, JSON.stringify(s0));
  check("nový titul se dá založit", s0.novy);
  check("přepínač zobrazení je k dispozici", s0.zobrazeni);
  check("hledání je v hlavičce", s0.hledani);
  check("nikde nestojí Locked", s0.zakazana.length === 0, s0.zakazana.join(", "));

  // Přepínač zobrazení projde všechny čtyři hustoty a nespadne.
  const cyklus = await page.evaluate(async () => {
    const b = document.querySelector('[aria-label^="Zobrazení"]');
    if (!b) return 0;
    let n = 0;
    for (let i = 0; i < 4; i++) { b.click(); await new Promise((r) => setTimeout(r, 260)); n++; }
    return n;
  });
  check("zobrazení se dá procyklovat", cyklus === 4, String(cyklus));

  // Hledání se otevře a zavře Escapem.
  await page.evaluate(() => { const b = document.querySelector('[aria-label="Hledat v pramenech"]'); if (b) b.click(); });
  await page.waitForTimeout(400);
  const hled = await page.evaluate(() => !!document.querySelector('input[placeholder^="Hledat v pramenech"]'));
  check("hledání se otevřelo", hled);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);

  // Nový vlastní pramen · v obou domech stejná cesta.
  const zalozen = await page.evaluate(async () => {
    const b = [...document.querySelectorAll("button")].find((x) => (x.innerText || "").toLowerCase().includes("nový titul"));
    if (!b) return false;
    b.click();
    await new Promise((r) => setTimeout(r, 400));
    const inp = document.querySelector('input[placeholder^="Název titulu"]');
    if (!inp) return false;
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    setter.call(inp, "Můj vlastní pramen");
    inp.dispatchEvent(new Event("input", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 200));
    const add = [...document.querySelectorAll("button")].find((x) => (x.innerText || "").trim() === "Přidat");
    if (!add) return false;
    add.click();
    await new Promise((r) => setTimeout(r, 700));
    return (document.body.innerText || "").indexOf("Můj vlastní pramen") !== -1;
  });
  check("vlastní pramen se dá založit", zalozen);

  if (KLIENT) {
    // Sdílený pramen od Tanmaye.
    const dorucen = await page.evaluate(async () => {
      const doc = { v: 1, at: Date.now(), sources: [{
        id: "cs-1", title: "Dech a klid mysli", author: "Tanmay", type: "Article",
        why: "Protože ti v prvním týdnu půjde hlavně o zpomalení.",
        instruction: "Přečti si první tři odstavce a zkus to jednou večer.",
        excerpt: "Nádech se počítá do čtyř, výdech do šesti.",
        sharedAt: Date.now(),
      }] };
      const r = await fetch("/__sources", { method: "POST", body: JSON.stringify(doc) });
      return r.ok;
    });
    check("sdílený pramen se dá nasadit", dorucen);
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2200);
    await doPramenu();

    const vidi = await page.evaluate(() => {
      const txt = document.body.innerText || "";
      return {
        pramen: txt.indexOf("Dech a klid mysli") !== -1,
        odT: /OD TANMAYE|Od Tanmaye/.test(txt),
        muj: /MŮJ\b|Můj\b/.test(txt),
        zakazana: ["Locked", "Admin", "System-owned"].filter((w) => txt.indexOf(w) !== -1),
      };
    });
    check("sdílený pramen je vidět", vidi.pramen, JSON.stringify(vidi));
    check("nese štítek Od Tanmaye", vidi.odT);
    check("vlastní pramen se v tu chvíli jmenuje Můj", vidi.muj);
    check("ani tady nikde nestojí Locked", vidi.zakazana.length === 0, vidi.zakazana.join(", "));

    const detail = await page.evaluate(async () => {
      const el = [...document.querySelectorAll("div, button")].find((x) => (x.innerText || "").indexOf("Dech a klid mysli") !== -1 && x.getAttribute("data-pick"));
      if (!el) return { otevreno: false };
      el.click();
      await new Promise((r) => setTimeout(r, 800));
      const txt = document.body.innerText || "";
      const cs = document.querySelector(".tm-cs");
      const csTxt = cs ? (cs.innerText || "") : "";
      return {
        otevreno: !!cs,
        proc: csTxt.indexOf("Protože ti v prvním týdnu") !== -1,
        pokyn: csTxt.indexOf("Přečti si první tři odstavce") !== -1,
        vynatek: csTxt.indexOf("Nádech se počítá do čtyř") !== -1,
        soukrome: csTxt.indexOf("Tanmay to nečte") !== -1,
        kopie: csTxt.indexOf("Udělat vlastní kopii") !== -1,
        koš: csTxt.indexOf("Do koše") !== -1,
        // zadání se nesmí dát přepsat: žádné pole pro autora ani datum
        vstupu: cs ? cs.querySelectorAll('input[type="date"]').length : -1,
        znak: txt.length > 0,
      };
    });
    check("detail sdíleného pramene se otevřel", detail.otevreno, JSON.stringify(detail));
    check("proč na něm záleží je vidět", detail.proc);
    check("pokyn od Tanmaye je vidět", detail.pokyn);
    check("výňatek je vidět", detail.vynatek);
    check("klientova poznámka je označená jako soukromá", detail.soukrome);
    check("dá se z něj udělat vlastní kopie", detail.kopie);
    check("cizí pramen se nedá vyhodit do koše", !detail.koš);
    check("termín se u cizího pramene needituje", detail.vstupu === 0, String(detail.vstupu));

    // Klientova poznámka · napíšeme ji a odebereme sdílení.
    const napsano = await page.evaluate(async () => {
      const cs = document.querySelector(".tm-cs");
      if (!cs) return false;
      // Postřehy jsou bohatý text · píše se do contenteditable, ne do textarea.
      const ed = cs.querySelector('[contenteditable="true"]');
      if (!ed) return false;
      ed.focus();
      ed.innerHTML = "MOJE SOUKROMÁ POZNÁMKA K PRAMENI";
      ed.dispatchEvent(new Event("input", { bubbles: true }));
      ed.dispatchEvent(new Event("blur", { bubbles: true }));
      await new Promise((r) => setTimeout(r, 1200));
      return true;
    });
    check("klient si k prameni může psát", napsano);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(600);

    // Odebrání ze sdílení nesmí poznámku smazat.
    await page.evaluate(async () => {
      await fetch("/__sources", { method: "POST", body: JSON.stringify({ v: 1, at: Date.now(), sources: [] }) });
    });
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2400);
    await doPramenu();
    const po = await page.evaluate(() => {
      const txt = document.body.innerText || "";
      return {
        pramenPryc: txt.indexOf("Dech a klid mysli") === -1,
        poznamkaZustala: txt.indexOf("MOJE SOUKROMÁ POZNÁMKA") !== -1,
        vysvetleno: txt.toLowerCase().indexOf("tvoje poznámky k odebraným pramenům") !== -1,
      };
    });
    check("odebraný pramen ze seznamu zmizel", po.pramenPryc, JSON.stringify(po));
    check("klientova poznámka zůstala", po.poznamkaZustala);
    check("a je vysvětleno, proč tam je", po.vysvetleno);
  }

  check("bez chyby stránky", errs.length === 0, errs.join(" | "));
  await ctx.close();

  // ---- desktop --------------------------------------------------------
  const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p2 = await ctx2.newPage();
  const errs2 = []; p2.on("pageerror", (e) => errs2.push(String(e).split("\n")[0]));
  await p2.addInitScript(() => { localStorage.setItem("tm-lang", "en"); localStorage.setItem("tmGuideVersion", "999"); });
  await p2.goto(BASE, { waitUntil: "domcontentloaded" });
  await p2.waitForTimeout(1800);
  const en = await p2.evaluate(async () => {
    const b = [...document.querySelectorAll("button")].find((x) => (x.innerText || "").trim() === "Sources");
    if (!b) return { naslo: false };
    b.click();
    await new Promise((r) => setTimeout(r, 800));
    const txt = document.body.innerText || "";
    return { naslo: true, novy: txt.indexOf("New title") !== -1, cesky: /Nový titul/.test(txt) };
  });
  check("desktop · Prameny se otevřely anglicky", en.naslo && en.novy, JSON.stringify(en));
  check("desktop · anglicky nezůstala čeština", !en.cesky);
  check("desktop · bez chyby stránky", errs2.length === 0, errs2.join(" | "));
  await ctx2.close();
} finally {
  await browser.close();
  srv.close();
}

console.log(R.join("\n"));
console.log(failed ? `\n${failed} kontrol selhalo` : `\nvše prošlo · ${R.length} kontrol`);
process.exit(failed ? 1 : 0);
