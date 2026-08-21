// NASAZENÍ NENÍ DORUČENÍ
// Instalovaná aplikace drží svůj balík, dokud ji něco nenačte znovu. Tahle
// zkouška „nasadí" novou verzi pod běžící aplikací a ověří dvě věci: že se
// nabídne načtení, a že se aplikace nenačte sama a rozepsané nezmizí.
// Vyžaduje Chromium a playwright-core; kde nejsou, zkouška se přeskočí.
//   npm run build && node tests/browser/update.mjs
import { cpSync, readdirSync, renameSync, rmSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { spawn } from "node:child_process";

let chromium;
try { ({ chromium } = await import("playwright-core")); }
catch { console.log("SKIP · playwright-core není k dispozici (npm i -D playwright-core)"); process.exit(0); }
const EXE = process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const PORT = Number(process.env.PORT || 8884), BASE = "http://localhost:" + PORT;

// pracovní kopie dist, aby šlo „nasadit" bez sahání na build
const ROOT = mkdtempSync(join(tmpdir(), "tm-dist-"));
cpSync("dist", ROOT, { recursive: true });
const srv = spawn(process.execPath, [join(import.meta.dirname, "server.mjs"), ROOT, String(PORT)], { stdio: ["ignore", "ignore", "inherit"] });
await new Promise((r) => setTimeout(r, 900));

const R = []; let failed = 0;
const check = (n, ok, x = "") => { if (!ok) failed++; R.push((ok ? "PASS " : "FAIL ") + n + (x ? " — " + x : "")); };

let browser;
try { browser = await chromium.launch({ executablePath: EXE, args: ["--no-sandbox"] }); }
catch (e) { console.log("SKIP · Chromium se nepodařilo spustit: " + e.message); srv.kill(); rmSync(ROOT, { recursive: true, force: true }); process.exit(0); }

try {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.addInitScript(() => { localStorage.setItem("tm-lang", "cs"); if (!localStorage.getItem("tanmay_coll_v1")) localStorage.setItem("tanmay_coll_v1", JSON.stringify({ modules: ["praxe","trenink","denik","kompas","zapisnik","prameny","hospodareni"] })); });
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2500);
  await page.evaluate(() => { const i = document.querySelector("input"); if (i) { i.focus(); i.value = "ROZEPSANO"; i.dispatchEvent(new Event("input", { bubbles: true })); } });
  check("před nasazením se nic nenabízí", (await page.getByText(/Nová verze|New version/).count()) === 0);

  const stary = readdirSync(join(ROOT, "assets")).find((f) => f.endsWith(".js"));
  const novy = stary.replace(/-([A-Za-z0-9_-]+)\.js$/, "-ZZnovaverze.js");
  renameSync(join(ROOT, "assets", stary), join(ROOT, "assets", novy));
  writeFileSync(join(ROOT, "index.html"), readFileSync(join(ROOT, "index.html"), "utf8").replace(stary, novy));

  await page.waitForTimeout(6000);
  await page.evaluate(() => document.dispatchEvent(new Event("visibilitychange")));
  await page.waitForTimeout(1500);
  check("po nasazení se nabídne načtení", (await page.getByText(/Nová verze|New version/).count()) > 0);
  const porad = await page.evaluate(() => { const i = document.querySelector("input"); return i ? i.value : null; });
  check("aplikace se nenačte sama a rozepsané zůstane", porad === "ROZEPSANO", String(porad));
  await ctx.close();
} catch (e) { check("harness", false, e.message); }
await browser.close(); srv.kill(); rmSync(ROOT, { recursive: true, force: true });
console.log(R.join("\n"));
process.exit(failed ? 1 : 0);
