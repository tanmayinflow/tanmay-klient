// PROČ TO NEODEŠLO · oba domy
//
// Chyba, kvůli které tahle sada vznikla (30. 8. 2026): proužek „změny jsou
// zatím jen v tomhle zařízení" hlásil čtyři různé příčiny jednou větou
// a nabízel u všech totéž tlačítko. U dvou z nich zabrat nemohlo:
//
//   · vypršelá relace Cloudflare Accessu — fetch se k přihlášení nepřesměruje
//     a aplikace nainstalovaná na ploše člověku přihlašovací obrazovku nikdy
//     neukáže, takže „Zkusit znovu“ dopadalo pořád stejně;
//   · dokument nad stropem úložiště — opakování ho nezmenší.
//
// A když selhalo úvodní čtení, aplikace zůstala do konce relace jen místní
// úplně beze slova.
//
// Nejde ověřit ze zdroje: rozhoduje, co se opravdu stane v prohlížeči.
// Vyžaduje Chromium a playwright-core; kde nejsou, zkouška se přeskočí.
//   npm run build && node tests/browser/sync-failure.mjs
//   (klientská aplikace: TM_ROLE=client)
import { createServer, state } from "./server.mjs";

let chromium;
try { ({ chromium } = await import("playwright-core")); }
catch { console.log("SKIP · playwright-core není k dispozici (npm run browser:setup)"); process.exit(0); }
const EXE = process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

const KLIENT = process.env.TM_ROLE === "client";
const PORT = Number(process.env.PORT || 8795), BASE = "http://localhost:" + PORT;
const srv = createServer(); await new Promise((r) => srv.listen(PORT, r));
const R = []; let failed = 0;
const check = (n, ok, x = "") => { if (!ok) failed++; R.push((ok ? "PASS " : "FAIL ") + n + (x ? " — " + x : "")); };
const peek = () => fetch(BASE + "/__peek").then((r) => r.json());
const force = (v, m) => fetch(BASE + "/__force?v=" + encodeURIComponent(v || "") + "&m=" + encodeURIComponent(m || "")).then((r) => r.json());
const titles = (doc) => (((doc || {}).coll || {}).journal || []).map((j) => j.title);

let browser;
try { browser = await chromium.launch({ executablePath: EXE, args: ["--no-sandbox"] }); }
catch (e) { console.log("SKIP · Chromium se nepodařilo spustit: " + e.message); srv.close(); process.exit(0); }

const errs = [];
async function device() {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
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
const writeJournal = (page, title) => page.evaluate((t) => {
  const c = JSON.parse(localStorage.getItem("tanmay_coll_v1") || "{}");
  c.journal = [{ id: "j_" + t, date: "2026-08-25", title: t, text: "x".repeat(1200) }, ...(c.journal || [])];
  localStorage.setItem("tanmay_coll_v1", JSON.stringify(c));
}, title);
const vidi = (page, re) => page.getByText(re).count();
const tlacitko = (page, re) => page.getByRole("button", { name: re }).count();

const PRIHLASENI = /Přihlášení vypršelo|sign-in has expired/;
const STROP = /strop úložiště|storage ceiling/;
const ODMITL = /Server zápis odmítl|server refused the write/;
const JEN_ZDE = /jen v tomhle zařízení|on this device only/;
const ZNOVU = /Zkusit znovu|Try again/;
const NACIST = /Načíst znovu a přihlásit|Reload and sign in/;

try {
  // ---- 1 · vypršelá relace · přesměrování na přihlášení -------------------
  {
    state.doc = null; state.version = 0; await force("", "");
    const d = await device();
    await force("302", "PUT");            // čtení projde, zápis narazí na Access
    await writeJournal(d.page, "R1");
    await d.page.evaluate(() => { const c = JSON.parse(localStorage.getItem("tanmay_coll_v1")); localStorage.setItem("tanmay_coll_v1", JSON.stringify(c)); window.dispatchEvent(new Event("storage")); });
    await d.page.reload({ waitUntil: "networkidle" }); await d.page.waitForTimeout(2400);
    check("1a · proužek řekne, že vypršelo přihlášení", (await vidi(d.page, PRIHLASENI)) > 0);
    check("1b · nabídne načtení stránky, ne fetch", (await tlacitko(d.page, NACIST)) > 0);
    check("1c · marné „Zkusit znovu“ tam není", (await tlacitko(d.page, ZNOVU)) === 0);
    check("1d · a nevydává se za obyčejný výpadek sítě", (await vidi(d.page, JEN_ZDE)) === 0);
    await d.ctx.close();
  }

  // ---- 2 · dokument nad stropem úložiště ---------------------------------
  {
    state.doc = null; state.version = 0; await force("", "");
    const d = await device();
    await force("413", "PUT");
    await writeJournal(d.page, "R2");
    await d.page.reload({ waitUntil: "networkidle" }); await d.page.waitForTimeout(2400);
    check("2a · proužek mluví o stropu úložiště", (await vidi(d.page, STROP)) > 0);
    check("2b · opakování se nenabízí", (await tlacitko(d.page, ZNOVU)) === 0);
    await d.ctx.close();
  }

  // ---- 3 · server odmítl a řekl proč --------------------------------------
  {
    state.doc = null; state.version = 0; await force("", "");
    const d = await device();
    await force("500", "PUT");
    await writeJournal(d.page, "R3");
    await d.page.reload({ waitUntil: "networkidle" }); await d.page.waitForTimeout(2400);
    check("3a · proužek nese stavový kód", (await vidi(d.page, ODMITL)) > 0);
    check("3b · tady opakovat smysl má", (await tlacitko(d.page, ZNOVU)) > 0);
    await d.ctx.close();
  }

  // ---- 4 · 200 s HTML se nesmí počítat jako uloženo -----------------------
  {
    state.doc = null; state.version = 0; await force("", "");
    const d = await device();
    // Osivo, které si aplikace odešle sama při prvním načtení, není předmětem
    // téhle zkoušky — řádek se vynuluje až po něm.
    state.doc = null; state.version = 0;
    await force("html", "PUT");           // přihlašovací stránka Accessu / SPA fallback
    await writeJournal(d.page, "R4");
    await d.page.reload({ waitUntil: "networkidle" }); await d.page.waitForTimeout(2400);
    check("4a · odpověď bez JSON se nepovažuje za zápis", (await peek()).doc === null,
      JSON.stringify(titles((await peek()).doc)));
    check("4b · a člověk se to doví", (await vidi(d.page, PRIHLASENI)) > 0);
    await d.ctx.close();
  }

  // ---- 5 · selhané úvodní čtení · „Zkusit znovu“ musí opravdu zkusit ------
  // Výpadek jen na /api/state: klientská aplikace potřebuje `/api/me`, aby
  // vůbec věděla, čí je to prostor, a bez toho by se nesynchronizovala právem.
  {
    state.doc = null; state.version = 0; await force("", "");
    const d = await device();
    state.doc = null; state.version = 0;
    await writeJournal(d.page, "R5");
    await force("net", "");                                // celé podání ruky selže
    await d.page.reload({ waitUntil: "networkidle" }); await d.page.waitForTimeout(2600);
    check("5a · selhané úvodní čtení už není tiché", (await vidi(d.page, JEN_ZDE)) > 0);
    check("5b · bez spojení se nic neodeslalo", (await peek()).doc === null);
    await force("", "");
    await d.page.getByRole("button", { name: ZNOVU }).first().click();
    await d.page.waitForTimeout(3000);
    check("5c · „Zkusit znovu“ zopakuje celé podání ruky", titles((await peek()).doc).includes("R5"),
      JSON.stringify(titles((await peek()).doc)));
    check("5d · proužek zmizel", (await vidi(d.page, JEN_ZDE)) === 0);
    await d.ctx.close();
  }

  check("bez chyby stránky", errs.length === 0, errs.slice(0, 3).join(" | "));
} catch (e) {
  check("harness", false, String(e).split("\n")[0]);
} finally {
  await browser.close(); srv.close();
}

console.log(R.join("\n"));
console.log(failed ? "\n" + failed + " selhalo" : "\nvše prošlo · " + R.length + " kontrol");
process.exit(failed ? 1 : 0);
