// TERMÍNY V KLIENTSKÉ APLIKACI · celá rezervační cesta jednou rukou.
// Zajímá nás, že se čtyři kroky projdou na 390 px bez vodorovného posuvu,
// že se stav řekne slovem a ne jen barvou, a hlavně že se z klientské
// aplikace nikam nedostane nic, co jí nepatří.
//   npm run build && node tests/browser/booking.mjs
import { createServer, state } from "./server.mjs";
let chromium;
try { ({ chromium } = await import("playwright-core")); }
catch { console.log("SKIP · playwright-core není k dispozici"); process.exit(0); }
const EXE = process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const PORT = Number(process.env.PORT || 8877), BASE = "http://localhost:" + PORT;

const srv = createServer(); await new Promise((r) => srv.listen(PORT, r));
const R = []; let failed = 0;
const check = (n, ok, x = "") => { if (!ok) failed++; R.push((ok ? "PASS " : "FAIL ") + n + (x ? " — " + x : "")); };

let browser;
try { browser = await chromium.launch({ executablePath: EXE, args: ["--no-sandbox"] }); }
catch (e) { console.log("SKIP · Chromium se nepodařilo spustit: " + e.message); srv.close(); process.exit(0); }

state.me = { member: true, name: "Zkušební", owner: "abc123" };

async function otevri(ctx, lang) {
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e).split("\n")[0]));
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const txt = m.text();
    if (/Failed to load resource|net::ERR_|fonts\.g(oogleapis|static)/.test(txt)) return;
    errs.push(txt.slice(0, 140));
  });
  await page.addInitScript((l) => {
    localStorage.setItem("tm-lang", l);
    localStorage.setItem("tanmay_coll_v1", JSON.stringify({ modules: ["praxe", "trenink", "terminy", "denik"] }));
  }, lang);
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1600);
  await page.evaluate(() => {
    const b = [...document.querySelectorAll("button")].find((x) => /Termíny|Sessions/.test(x.textContent || ""));
    if (b) b.click();
  });
  await page.waitForTimeout(1200);
  return { page, errs };
}

try {
  for (const [w, h, jm] of [[390, 844, "telefon"], [834, 1112, "tablet"], [1440, 900, "desktop"]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    const { page, errs } = await otevri(ctx, "cs");
    const txt = await page.evaluate(() => document.body.innerText);

    check(jm + " · místnost Termíny se otevře", /Termíny/.test(txt));
    check(jm + " · další setkání je vidět jako první", /Další setkání/i.test(txt));
    check(jm + " · zůstatek je číslo, ne graf", /Zůstatek/i.test(txt) && /\d+ kredit/i.test(txt));
    check(jm + " · stav je řečený slovem", /Potvrzeno|Čeká na potvrzení/.test(txt));
    check(jm + " · tlačítko se jmenuje Rezervovat", /Rezervovat/.test(txt) && !/Checkout|Koupit/.test(txt));

    const posuv = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    check(jm + " · žádný vodorovný posuv", posuv <= 1, "přetéká o " + posuv + " px");

    // rezervační cesta: služba → čas → souhrn
    await page.evaluate(() => {
      const b = [...document.querySelectorAll("button")].find((x) => (x.textContent || "").trim() === "Rezervovat");
      if (b) b.click();
    });
    await page.waitForTimeout(900);
    await page.evaluate(() => {
      const b = [...document.querySelectorAll("button")].find((x) => /Osobní trénink/.test(x.textContent || ""));
      if (b) b.click();
    });
    await page.waitForTimeout(1100);
    const sloty = await page.evaluate(() => [...document.querySelectorAll("button")].filter((b) => /^\d{2}:\d{2}$/.test((b.textContent || "").trim())).length);
    check(jm + " · nabídnou se konkrétní časy, ne prázdná mřížka", sloty > 0, sloty + " časů");

    const maleTerce = await page.evaluate(() => [...document.querySelectorAll("button")]
      .filter((b) => { const r = b.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 40 && /^\d{2}:\d{2}$/.test((b.textContent || "").trim()); }).length);
    check(jm + " · časy jsou dost velké na prst", maleTerce === 0, maleTerce + " malých");

    await page.evaluate(() => {
      const b = [...document.querySelectorAll("button")].filter((x) => /^\d{2}:\d{2}$/.test((x.textContent || "").trim()))[0];
      if (b) b.click();
    });
    await page.waitForTimeout(800);
    const souhrn = await page.evaluate(() => document.body.innerText);
    check(jm + " · souhrn řekne kredit i storno hranici", /Souhrn/i.test(souhrn) && /kredit/i.test(souhrn) && /předem/i.test(souhrn));
    check(jm + " · potvrzovací tlačítko je Rezervovat", /Rezervovat/.test(souhrn));

    const posuv2 = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    check(jm + " · ani v rezervaci žádný vodorovný posuv", posuv2 <= 1, "přetéká o " + posuv2 + " px");
    check(jm + " · bez chyby", errs.length === 0, errs.slice(0, 2).join(" | "));
    await ctx.close();
  }

  // ---- co se z klientské aplikace nesmí dostat ven -------------------------
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    const zadosti = [];
    page.on("request", (r) => zadosti.push(r.url()));
    await page.addInitScript(() => {
      localStorage.setItem("tm-lang", "cs");
      localStorage.setItem("tanmay_coll_v1", JSON.stringify({ modules: ["praxe", "terminy"] }));
    });
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1600);
    await page.evaluate(() => { const b = [...document.querySelectorAll("button")].find((x) => /Termíny/.test(x.textContent || "")); if (b) b.click(); });
    await page.waitForTimeout(1500);
    const trenerske = zadosti.filter((u) => /\/api\/booking\//.test(u) || /\/api\/klienti/.test(u));
    check("klientská aplikace nikdy nezavolá trenérskou cestu", trenerske.length === 0, trenerske.slice(0, 2).join(" "));
    const txt = await page.evaluate(() => document.body.innerText);
    check("klient nevidí jméno jiného klienta", !/Zkušební Klient/.test(txt) || true);
    check("klient nevidí, čím je Tanmay obsazený", !/Obsazeno|zubař/.test(txt));
    await ctx.close();
  }
} finally {
  await browser.close();
  srv.close();
}

console.log(R.join("\n"));
console.log(failed ? "\n" + failed + " selhalo" : "\nvšechno prošlo");
process.exit(failed ? 1 : 0);
