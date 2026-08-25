// DVĚ ZAŘÍZENÍ, JEDEN ČLOVĚK · a dvě karty na jednom · oba domy
//
// Chyba, kvůli které tahle sada vznikla (audit 2026-08-25): klientská
// aplikace odesílala celý dokument bez jakéhokoli porovnání verzí. Telefon
// s otevřenou aplikací přepsal to, co klient mezitím napsal na notebooku,
// a notebook si při dalším načtení vzal serverovou verzi — zápis zmizel
// odevšad. Osobní aplikace tuhle ochranu měla, klientská ne. Teď ji mají obě
// a tahle sada se ptá obou stejně: zápis odjinud přežije, člověk rozhodne,
// čisté zařízení se dorovná samo, offline zápis odejde po návratu sítě.
// Nejde ověřit ze zdroje: rozhoduje pořadí čtení a zápisů v prohlížeči.
// Vyžaduje Chromium a playwright-core; kde nejsou, zkouška se přeskočí.
//   npm run build && node tests/browser/sync-conflict.mjs
//   (klientská aplikace: TM_ROLE=client)
import { createServer, state } from "./server.mjs";

let chromium;
try { ({ chromium } = await import("playwright-core")); }
catch { console.log("SKIP · playwright-core není k dispozici (npm run browser:setup)"); process.exit(0); }
const EXE = process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

const KLIENT = process.env.TM_ROLE === "client";
const PORT = Number(process.env.PORT || 8793), BASE = "http://localhost:" + PORT;
const srv = createServer(); await new Promise((r) => srv.listen(PORT, r));
const R = []; let failed = 0;
const check = (n, ok, x = "") => { if (!ok) failed++; R.push((ok ? "PASS " : "FAIL ") + n + (x ? " — " + x : "")); };
const peek = () => fetch(BASE + "/__peek").then((r) => r.json());
const titles = (doc) => (((doc || {}).coll || {}).journal || []).map((j) => j.title);

let browser;
try { browser = await chromium.launch({ executablePath: EXE, args: ["--no-sandbox"] }); }
catch (e) { console.log("SKIP · Chromium se nepodařilo spustit: " + e.message); srv.close(); process.exit(0); }

const errs = [];
async function device(ctxOpts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, ...ctxOpts });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errs.push(String(e).split("\n")[0]));
  if (KLIENT) await page.addInitScript(() => { window.__tmKlient = true; });
  await page.addInitScript(() => {
    localStorage.setItem("tm-lang", "cs");
    localStorage.setItem("tmGuideVersion", "999");
    localStorage.setItem("tmGuideSeen", "1");
    if (window.__tmKlient && !localStorage.getItem("tanmay_coll_v1")) localStorage.setItem("tanmay_coll_v1", JSON.stringify({ modules: ["praxe", "trenink", "terminy"] }));
  });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  return { ctx, page };
}
const localTitles = (page) => page.evaluate(() => (JSON.parse(localStorage.getItem("tanmay_coll_v1") || "{}").journal || []).map((j) => j.title));
// Zápis mimo obrazovku: přímo do úložiště, tak jak to dělá aplikace sama.
// Projeví se při dalším načtení (cesta „práce, která se nahoru nedostala").
const writeJournal = (page, title) => page.evaluate((t) => {
  const c = JSON.parse(localStorage.getItem("tanmay_coll_v1") || "{}");
  c.journal = [{ id: "j_" + t, date: "2026-08-25", title: t, text: "x".repeat(1200) }, ...(c.journal || [])];
  localStorage.setItem("tanmay_coll_v1", JSON.stringify(c));
}, title);
// Zápis na obrazovce: nový cíl dne v Praxi je skutečný zápis do dne.
async function typeToday(page, text) {
  const inp = page.getByPlaceholder(/Nový cíl dne|New goal for today/).first();
  await inp.click({ timeout: 4000 });
  await inp.fill(text);
  await inp.press("Enter");
}
const hasTask = (doc, text) => Object.values(((doc || {}).edits) || {}).some((d) => d && Array.isArray(d.tasks) && d.tasks.some((x) => x && x.text === text));
const banner = (page) => page.getByText(/Mezitím psalo jiné zařízení|Another device wrote|Mezitím psala druhá otevřená karta|Another open tab wrote/).count();

try {
  // ---- 1 · dvě zařízení · cesta přes načtení ------------------------------
  {
    state.doc = null; state.version = 0;
    const d1 = await device();
    await writeJournal(d1.page, "J1");
    await d1.page.reload({ waitUntil: "networkidle" }); await d1.page.waitForTimeout(2200);
    check("1a · první zařízení odešle svůj zápis", titles((await peek()).doc).includes("J1"));
    const d2 = await device();
    check("1b · druhé zařízení si ho vezme", (await localTitles(d2.page)).includes("J1"));
    await writeJournal(d2.page, "J2");
    await d2.page.reload({ waitUntil: "networkidle" }); await d2.page.waitForTimeout(2200);
    const s1c = titles((await peek()).doc);
    check("1c · server má obojí", ["J1", "J2"].every((t) => s1c.includes(t)));
    await writeJournal(d1.page, "J3");
    await d1.page.reload({ waitUntil: "networkidle" }); await d1.page.waitForTimeout(2200);
    const s = await peek();
    check("1d · zápis druhého zařízení přežije další zápis prvního", titles(s.doc).includes("J2"), JSON.stringify(titles(s.doc)));
    check("1e · první zařízení se zeptá místo přepsání", (await banner(d1.page)) > 0);
    await d2.page.reload({ waitUntil: "networkidle" }); await d2.page.waitForTimeout(2200);
    check("1f · druhé zařízení o nic nepřišlo", (await localTitles(d2.page)).includes("J2"));
    // rozhodnutí: vzít verzi odtamtud
    await d1.page.getByRole("button", { name: /Vzít verzi odtamtud|Take that version/ }).click();
    await d1.page.waitForTimeout(600);
    check("1g · „vzít verzi odtamtud“ převezme cizí zápis a zavře otázku",
      (await localTitles(d1.page)).includes("J2") && (await banner(d1.page)) === 0);
    await d1.ctx.close(); await d2.ctx.close();
  }

  // ---- 2 · dvě zařízení · zápis na obrazovce, bez načtení ---------------
  {
    state.doc = null; state.version = 0;
    const d1 = await device();
    await writeJournal(d1.page, "Z1");
    await d1.page.reload({ waitUntil: "networkidle" }); await d1.page.waitForTimeout(2200);
    const d2 = await device();
    await writeJournal(d2.page, "Z2");
    await d2.page.reload({ waitUntil: "networkidle" }); await d2.page.waitForTimeout(2200);
    const before = await peek();
    check("2a · server má zápis druhého zařízení", titles(before.doc).includes("Z2"));
    // první zařízení, stále otevřené se starým stavem, píše na obrazovce
    await typeToday(d1.page, "dnes klidný");
    await d1.page.waitForTimeout(3200);
    const after = await peek();
    check("2b · odeslání se zastaví o vyšší verzi na serveru", after.version === before.version && titles(after.doc).includes("Z2"),
      "v" + before.version + " → v" + after.version);
    check("2c · na obrazovce je otázka, ne tiché přepsání", (await banner(d1.page)) > 0);
    // nechat moji · teď se odešle vědomě
    await d1.page.getByRole("button", { name: /Nechat moji|Keep mine/ }).click();
    await d1.page.waitForTimeout(2500);
    const kept = await peek();
    check("2d · „nechat moji“ odešle mou verzi hned", kept.version > after.version && hasTask(kept.doc, "dnes klidný"),
      "v" + kept.version);
    check("2e · otázka zmizela", (await banner(d1.page)) === 0);
    // a další zápis už jde bez otázky
    await typeToday(d1.page, "dnes klidný a bdělý");
    await d1.page.waitForTimeout(3200);
    check("2f · další zápis projde bez otázky", (await peek()).version > kept.version && (await banner(d1.page)) === 0);
    await d1.ctx.close(); await d2.ctx.close();
  }

  // ---- 3 · návrat k záložce · čisté zařízení se tiše dorovná -------------
  {
    state.doc = null; state.version = 0;
    const d1 = await device();
    await writeJournal(d1.page, "V1");
    await d1.page.reload({ waitUntil: "networkidle" }); await d1.page.waitForTimeout(2200);
    const d2 = await device();
    await writeJournal(d2.page, "V2");
    await d2.page.reload({ waitUntil: "networkidle" }); await d2.page.waitForTimeout(2200);
    await d1.page.evaluate(() => {
      Object.defineProperty(document, "visibilityState", { value: "visible", configurable: true });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await d1.page.waitForTimeout(1500);
    check("3a · zařízení bez rozepsané změny převezme novější verzi samo", (await localTitles(d1.page)).includes("V2"));
    check("3b · bez otázky", (await banner(d1.page)) === 0);
    await d1.ctx.close(); await d2.ctx.close();
  }

  // ---- 4 · dvě karty v jednom prohlížeči ----------------------------------
  {
    state.doc = null; state.version = 0;
    const d = await device();
    await writeJournal(d.page, "K1");
    await d.page.reload({ waitUntil: "networkidle" }); await d.page.waitForTimeout(2200);
    const b = await d.ctx.newPage(); b.on("pageerror", (e) => errs.push(String(e).split("\n")[0]));
    await b.goto(BASE, { waitUntil: "networkidle" }); await b.waitForTimeout(1500);
    await b.evaluate(() => {
      const c = JSON.parse(localStorage.getItem("tanmay_coll_v1") || "{}");
      c.journal = [{ id: "jK2", date: "2026-08-25", title: "K2", text: "k".repeat(1200) }, ...(c.journal || [])];
      const v = JSON.stringify(c);
      localStorage.setItem("tanmay_coll_v1", v);
      window.dispatchEvent(new StorageEvent("storage", { key: "tanmay_coll_v1", newValue: v, storageArea: localStorage }));
    });
    // první karta má poslouchat úložiště — prohlížeč jí událost pošle sám,
    // v jednom kontextu ji pro jistotu vyvoláme i výslovně
    await d.page.evaluate(() => {
      const v = localStorage.getItem("tanmay_coll_v1");
      window.dispatchEvent(new StorageEvent("storage", { key: "tanmay_coll_v1", newValue: v, storageArea: localStorage }));
    });
    await d.page.waitForTimeout(800);
    const inMemory = await d.page.evaluate(() => {
      const el = document.querySelector("[data-tm-coll-journal]");
      return el ? el.textContent : null;
    });
    // paměť první karty se pozná po jejím dalším zápisu: nesmí K2 vrátit zpět
    await typeToday(d.page, "obě karty");
    await d.page.waitForTimeout(3200);
    check("4a · první karta cizí zápis přijala a nepřepsala ho", (await localTitles(d.page)).includes("K2") && titles((await peek()).doc).includes("K2"), String(inMemory));
    await d.ctx.close();
  }

  // ---- 5 · offline zápis odejde po návratu sítě bez dalšího úhozu ---------
  {
    state.doc = null; state.version = 0;
    const d = await device();
    await writeJournal(d.page, "O1");
    await d.page.reload({ waitUntil: "networkidle" }); await d.page.waitForTimeout(2200);
    const v0 = (await peek()).version;
    await d.ctx.setOffline(true);
    await typeToday(d.page, "psáno offline");
    await d.page.waitForTimeout(3000);
    check("5a · offline se nic neodešle", (await peek()).version === v0);
    await d.ctx.setOffline(false);
    await d.page.evaluate(() => window.dispatchEvent(new Event("online")));
    await d.page.waitForTimeout(2500);
    const s = await peek();
    check("5b · po návratu sítě odejde samo", s.version > v0 && hasTask(s.doc, "psáno offline"), "v" + v0 + " → v" + s.version);
    await d.ctx.close();
  }

  check("bez chyby stránky", errs.length === 0, errs.slice(0, 3).join(" | "));
} catch (e) { check("harness", false, e.message); }

console.log(R.join("\n"));
await browser.close(); srv.close();
if (failed) { console.log(`\n${failed} selhalo`); process.exit(1); }
console.log(`\nvše prošlo · ${R.length} kontrol`);
