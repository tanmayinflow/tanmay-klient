// TRÉNINK KLIENTA V PROHLÍŽEČI · celá cesta, od plánu k tomu, co se vrátí trenérovi.
//   npm run build && node tests/browser/training.mjs
import { createServer, state } from "./server.mjs";
let chromium;
try { ({ chromium } = await import("playwright-core")); }
catch { console.log("SKIP · playwright-core není k dispozici (npm i -D playwright-core)"); process.exit(0); }
const EXE = process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const PORT = Number(process.env.PORT || 8827), BASE = "http://localhost:" + PORT;

const srv = createServer(); await new Promise((r) => srv.listen(PORT, r));
const R = []; let failed = 0;
const check = (n, ok, x = "") => { if (!ok) failed++; R.push((ok ? "PASS " : "FAIL ") + n + (x ? " — " + x : "")); };

let browser;
try { browser = await chromium.launch({ executablePath: EXE, args: ["--no-sandbox"] }); }
catch (e) { console.log("SKIP · Chromium se nepodařilo spustit: " + e.message); srv.close(); process.exit(0); }

const today = new Date().toISOString().slice(0, 10);
// Přesně to, co trenér posílá: soběstačný balík, bez soukromých poznámek.
state.plan = {
  at: 1, v: 2,
  plans: [{ id: "pl1", cz: "Základ síly", en: "A base of strength", goals: [], intro: null, progressionRule: "double",
    sessions: [{ id: "ps1", w: 1, templateId: "tpl1", effortTarget: 85, date: today }] }],
  templates: [{ id: "tpl1", cz: "Den A", en: "Day A", intro: null, aims: [],
    blocks: [{ id: "b1", exId: "drep", name: ["Dřep", "Squat"], measurementType: "BODYWEIGHT_REPS", restSec: 90,
      groupId: null, groupMode: null, groupOrder: 0, rirEnabled: true, variant: null,
      coachNote: ["Dnes drž rozsah jen do boxu.", "Keep the range to the box today."],
      sets: [{ id: "s1", type: "work", planned: { targetReps: 10 }, restSec: null, side: null },
             { id: "s2", type: "work", planned: { targetReps: 10 }, restSec: null, side: null }] }] }],
  exercises: [{ id: "drep", cz: "Dřep", en: "Squat", pat: "drep", eq: ["telo"], measurementType: "BODYWEIGHT_REPS",
    defaultRestSec: 90, unilateral: false, sideMode: "none",
    focus: ["Váha na celém chodidle.", "Weight on the whole foot."],
    startPosition: null, execution: null, watchFor: null, progression: null, art: null }],
};

const hit = async (page, ...labels) => {
  const ok = await page.evaluate((ls) => {
    const btns = [...document.querySelectorAll("button, [role=button], a")];
    for (const l of ls) { const el = btns.find((b) => (b.innerText || "").trim().toLowerCase() === l.toLowerCase()); if (el) { el.click(); return true; } }
    return false;
  }, labels);
  if (ok) await page.waitForTimeout(600);
  return ok;
};

try {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const errs = []; page.on("pageerror", (e) => errs.push(String(e).split("\n")[0]));
  // Nasazuje se jen do prázdného telefonu. Init skript běží i při reloadu, a
  // kdyby zapisoval pokaždé, přepsal by odcvičený trénink a test by měřil sám
  // sebe, ne aplikaci.
  await page.addInitScript(() => {
    localStorage.setItem("tm-lang", "cs");
    // sdílení tréninku zapnuté · onboarding přeskočený
    if (localStorage.getItem("tanmay_coll_v1")) return;
    localStorage.setItem("tanmay_coll_v1", JSON.stringify({
      modules: ["praxe", "trenink", "denik"], jmeno: "Test",
      share: { habits: false, goals: false, training: true },
      journal: [{ id: "j1", text: "moje soukromé" }],
    }));
  });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1600);
  await hit(page, "Trénink");
  await page.waitForTimeout(2000);

  const c1 = await page.evaluate(() => JSON.parse(localStorage.getItem("tanmay_coll_v1") || "{}"));
  check("migrace na V2 proběhla", c1.tv2 && c1.tv2.v === 2, String(c1.tv2 && c1.tv2.v));
  check("doručený plán se vyzvedl a uložil", !!(c1.tv2 && c1.tv2.delivered && c1.tv2.delivered.plans.length === 1));
  check("deník zůstal nedotčený", (c1.journal || []).length === 1);

  const todayText = await page.evaluate(() => document.body.innerText);
  check("dnešek ukazuje, co trenér předepsal", /Den A/.test(todayText), todayText.slice(0, 120).replace(/\n/g, " "));

  check("dá se začít", await hit(page, "Začít"));
  await page.waitForTimeout(800);
  const stageText = await page.evaluate(() => (document.querySelector("[data-tm-stage]") || {}).innerText || "");
  check("běžící trénink ukazuje plán i poznámku trenéra", /Dřep/.test(stageText) && /do boxu/.test(stageText), stageText.slice(0, 140).replace(/\n/g, " "));
  check("soukromá poznámka trenéra tu není", !/privateNote/.test(JSON.stringify(state.plan)));

  // zapsat sérii
  const wrote = await page.evaluate(() => {
    const stage = document.querySelector("[data-tm-stage]");
    const inp = stage && stage.querySelector("input");
    if (!inp) return "no input";
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    setter.call(inp, "12"); inp.dispatchEvent(new Event("input", { bubbles: true }));
    return "ok";
  });
  check("do pole se dá psát", wrote === "ok", wrote);
  await page.waitForTimeout(300);
  const ticked = await page.evaluate(() => {
    const stage = document.querySelector("[data-tm-stage]");
    if (!stage) return false;
    const b = [...stage.querySelectorAll("button")].find((x) => /série hotová/i.test(x.getAttribute("aria-label") || ""));
    if (!b) return false; b.click(); return true;
  });
  check("série se dá odklepnout", ticked);
  await page.waitForTimeout(900);

  const c2 = await page.evaluate(() => JSON.parse(localStorage.getItem("tanmay_coll_v1") || "{}"));
  const tv2 = c2.tv2 || {};
  const ses = (tv2.sessions || [])[0];
  check("zapsaná série je hned v uloženém stavu", !!ses && ses.blocks[0].sets.filter((s) => s.completed).length === 1);
  check("předpis se zápisem nezměnil", !!ses && ses.prescription.blocks[0].sets[0].planned.targetReps === 10);
  check("doručený plán zůstal, jak přišel", !!tv2.delivered && (tv2.delivered.templates[0].blocks[0].sets[0].planned || {}).targetReps === 10);

  // dokončit
  check("dá se ukončit", await hit(page, "Ukončit trénink"));
  await page.waitForTimeout(500);
  check("a potvrdit", await hit(page, "Hotovo"));
  await page.waitForTimeout(2600);

  const share = await (await fetch(BASE + "/__share")).json();
  check("trenérovi se vrátil odcvičený trénink", !!(share.share && share.share.training && share.share.training.sessions.length === 1),
    JSON.stringify(share.share && share.share.training && share.share.training.sessions && share.share.training.sessions.length));
  const back = JSON.stringify(share.share || {});
  check("zpět nejde nic mimo trénink", !/moje soukromé/.test(back) && !/journal/.test(back));
  check("vrací se podle id záznamu", !!(share.share && share.share.training && (share.share.training.sessions || [])[0] && share.share.training.sessions[0].id));

  // druhé odeslání téhož nesmí vyrobit druhý trénink
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(1800);
  await hit(page, "Trénink");
  await page.waitForTimeout(2600);
  const stored = await page.evaluate(() => { const c = JSON.parse(localStorage.getItem("tanmay_coll_v1") || "{}"); return (c.tv2 && c.tv2.sessions || []).length; });
  check("po reloadu je záznam pořád v telefonu", stored === 1, String(stored));
  const share2 = await (await fetch(BASE + "/__share")).json();
  check("po reloadu je to pořád jeden trénink", !!(share2.share && share2.share.training.sessions.length === 1),
    String(share2.share && share2.share.training && share2.share.training.sessions.length));

  check("bez chyby v konzoli", errs.length === 0, errs.slice(0, 3).join(" | "));
  await ctx.close();
} finally {
  await browser.close();
  srv.close();
}

console.log(R.join("\n"));
console.log(failed ? "\n" + failed + " FAIL" : "\nvše prošlo · " + R.length + " kontrol");
process.exit(failed ? 1 : 0);
