// STŘÍDÁNÍ ÚČTU NA JEDNOM ZAŘÍZENÍ
// Nejde ověřit ze zdroje ani z Workeru: chyba žila v prohlížeči — v úložišti,
// v mezipaměti připnutých médií a v pořadí, ve kterém se věci načtou.
// Vyžaduje Chromium a playwright-core; kde nejsou, zkouška se přeskočí.
//   npm run build && node tests/browser/account-switch.mjs
import { createAccountFixture } from "./account-fixture.mjs";
import { createServer } from "./server.mjs";

let chromium;
try { ({ chromium } = await import("playwright-core")); }
catch { console.log("SKIP · playwright-core není k dispozici (npm i -D playwright-core)"); process.exit(0); }
const EXE = process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

const PORT = Number(process.env.PORT || 8791), BASE = "http://127.0.0.1:" + PORT;
const srv = createServer({ accountFixture: createAccountFixture() }); await new Promise((r) => srv.listen(PORT, '127.0.0.1', r));
const R = []; let failed = 0;
const check = (n, ok, x = "") => { if (!ok) failed++; R.push((ok ? "PASS " : "FAIL ") + n + (x ? " — " + x : "")); };
const api = (p) => fetch(BASE + p).then((r) => r.json());

let browser;
try { browser = await chromium.launch({ executablePath: EXE, args: ["--no-sandbox"] }); }
catch (e) { console.log("SKIP · Chromium se nepodařilo spustit: " + e.message); srv.close(); process.exit(0); }

try {
  const accountA = await api("/__owner?tag=aaaaaaaaaaaaaaaa");
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const errs = []; const page = await ctx.newPage();
  page.on("pageerror", (e) => errs.push(String(e).split("\n")[0]));

  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForFunction(owner => localStorage.getItem("tm_owner_v1") === owner, accountA.owner);
  check("studený start bez chyby stránky", errs.length === 0, errs.slice(0, 2).join(" | "));
  check("otisk vlastníka se zapsal", (await page.evaluate(() => localStorage.getItem("tm_owner_v1"))) === accountA.owner);

  await page.getByRole("button", { name: /Enter without sharing|Vstoupit bez sdílení/i }).click();
  await page.getByRole("button", { name: /Close guide|Zavřít průvodce/i }).click();
  await page.getByRole("tab", { name: /^(morning|ráno)$/i }).click();
  const note = page.getByRole("textbox", { name: /Today I am|Dnes jsem/i });
  await note.fill("SYNTHETIC-ACCOUNT-A");
  await note.press("Tab");
  await page.waitForFunction(async () => JSON.stringify((await (await fetch("/__peek")).json()).doc).includes("SYNTHETIC-ACCOUNT-A"));
  check("the real Worker persisted the account A entry", true);
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("tab", { name: /^(morning|ráno)$/i }).click();
  check("the entry survived a reload", await note.inputValue() === "SYNTHETIC-ACCOUNT-A");
  await page.evaluate(async () => {
    localStorage.setItem("tm_pinned", JSON.stringify({ j1: ["souborA"] }));
    const cache = await caches.open("pinned");
    await cache.put("/api/files/souborA", new Response("SOUKROME-BAJTY-A"));
    await new Promise((res) => { const r = indexedDB.open("tanmay_files", 1); r.onupgradeneeded = () => r.result.createObjectStore("files"); r.onsuccess = () => { const tx = r.result.transaction("files", "readwrite"); tx.objectStore("files").put(new Blob(["A"]), "souborA"); tx.oncomplete = res; }; r.onerror = res; });
  });
  const accountB = await api("/__owner?tag=bbbbbbbbbbbbbbbb");
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await page.locator('[data-client-access-gate="locked"]').waitFor();
  check("the private route and all private navigation are unmounted on an account change",
    await page.locator(".tm-sidebar, .tm-topbar, [contenteditable=true]").count() === 0 &&
    !await page.getByRole("heading", { name: /^(Practice|Praxe)$/ }).count());
  await page.locator('[data-client-access-gate="locked"] button').click();
  await page.waitForFunction(owner => localStorage.getItem("tm_owner_v1") === owner, accountB.owner);
  const po = await page.evaluate(async () => ({
    owner: localStorage.getItem("tm_owner_v1"),
    journal: (JSON.parse(localStorage.getItem("tanmay_coll_v1") || "{}").journal || []).length,
    edits: Object.keys(JSON.parse(localStorage.getItem("tanmay_edits_v1") || "{}")).length,
    pinnedReg: localStorage.getItem("tm_pinned"),
    odlozeno: Object.keys(localStorage).filter((k) => k.includes("__owner_")),
    pinnedCache: (await caches.keys()).includes("pinned"),
  }));
  check("B dostane vlastní otisk", po.owner === accountB.owner, String(po.owner));
  check("B nevidí deník A", po.journal === 0, "journal=" + po.journal);
  check("B nevidí denní záznamy A", po.edits === 0, "edits=" + po.edits);
  check("registr připnutých A je mimo dosah B", po.pinnedReg === null);
  check("mezipaměť připnutých médií A je smazaná", po.pinnedCache === false);
  check("obsah A je odložený, ne smazaný", po.odlozeno.length >= 2 && await page.evaluate(() => Object.keys(localStorage).some(k => k.includes("__owner_") && localStorage.getItem(k).includes("SYNTHETIC-ACCOUNT-A"))), po.odlozeno.join(","));
  const peekB = await api("/__peek");
  check("dokument A se NEODEŠLE do řádku B", !JSON.stringify(peekB.doc).includes("SYNTHETIC-ACCOUNT-A"));
  check("střídání účtu proběhne bez chyby stránky", errs.length === 0, errs.slice(0, 2).join(" | "));
  check("člověk se o výměně doví", (await page.getByText(/Someone else used this device|Tohle zařízení naposledy použil/).count()) > 0);
  const accountC = await api("/__owner?tag=cccccccccccccccc");
  const legacy = await browser.newContext();
  const legacyPage = await legacy.newPage();
  await legacyPage.addInitScript(() => {
    if (!localStorage.getItem("tm_owner_v1")) localStorage.setItem("tanmay_coll_v1", JSON.stringify({ journal: [{ id: "unclaimed-local", text: "LOCAL-FIXTURE" }] }));
  });
  await legacyPage.goto(BASE, { waitUntil: "networkidle" });
  await legacyPage.waitForFunction(owner => localStorage.getItem("tm_owner_v1") === owner, accountC.owner);
  const legacyResult = await legacyPage.evaluate(() => ({
    archive: Object.keys(localStorage).some(key => key.startsWith("tanmay_coll_v1__owner_neznamy_") && localStorage.getItem(key).includes("unclaimed-local")),
    active: (localStorage.getItem("tanmay_coll_v1") || "").includes("unclaimed-local"),
  }));
  const remote = await api("/__peek");
  check("unclaimed data is preserved separately and never adopted or uploaded", legacyResult.archive && !legacyResult.active && !JSON.stringify(remote.doc).includes("unclaimed-local"));
  await legacy.close();
} catch (e) { check("harness", false, e.message); }
await browser.close(); srv.close();
console.log(R.join("\n"));
process.exit(failed ? 1 : 0);
