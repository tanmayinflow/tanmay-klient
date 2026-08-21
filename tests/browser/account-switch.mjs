// STŘÍDÁNÍ ÚČTU NA JEDNOM ZAŘÍZENÍ
// Nejde ověřit ze zdroje ani z Workeru: chyba žila v prohlížeči — v úložišti,
// v mezipaměti připnutých médií a v pořadí, ve kterém se věci načtou.
// Vyžaduje Chromium a playwright-core; kde nejsou, zkouška se přeskočí.
//   npm run build && node tests/browser/account-switch.mjs
import { spawn } from "node:child_process";
import { createServer } from "./server.mjs";

let chromium;
try { ({ chromium } = await import("playwright-core")); }
catch { console.log("SKIP · playwright-core není k dispozici (npm i -D playwright-core)"); process.exit(0); }
const EXE = process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

const PORT = Number(process.env.PORT || 8791), BASE = "http://localhost:" + PORT;
const srv = createServer(); await new Promise((r) => srv.listen(PORT, r));
const R = []; let failed = 0;
const check = (n, ok, x = "") => { if (!ok) failed++; R.push((ok ? "PASS " : "FAIL ") + n + (x ? " — " + x : "")); };
const api = (p) => fetch(BASE + p).then((r) => r.json());

let browser;
try { browser = await chromium.launch({ executablePath: EXE, args: ["--no-sandbox"] }); }
catch (e) { console.log("SKIP · Chromium se nepodařilo spustit: " + e.message); srv.close(); process.exit(0); }

try {
  await api("/__owner?tag=aaaaaaaaaaaaaaaa");
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const errs = []; const page = await ctx.newPage();
  page.on("pageerror", (e) => errs.push(String(e).split("\n")[0]));

  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  check("studený start bez chyby stránky", errs.length === 0, errs.slice(0, 2).join(" | "));
  check("otisk vlastníka se zapsal", (await page.evaluate(() => localStorage.getItem("tm_owner_v1"))) === "aaaaaaaaaaaaaaaa");

  await page.evaluate(async () => {
    const c = JSON.parse(localStorage.getItem("tanmay_coll_v1") || "{}");
    c.journal = [{ id: "j1", date: "2026-08-20", title: "SYNTETICKY-A", text: "aaa".repeat(600) }];
    localStorage.setItem("tanmay_coll_v1", JSON.stringify(c));
    localStorage.setItem("tanmay_edits_v1", JSON.stringify({ "2026-08-20": { note: "den-A" } }));
    localStorage.setItem("tm_pinned", JSON.stringify({ j1: ["souborA"] }));
    const cache = await caches.open("pinned");
    await cache.put("/api/files/souborA", new Response("SOUKROME-BAJTY-A"));
    await new Promise((res) => { const r = indexedDB.open("tanmay_files", 1); r.onupgradeneeded = () => r.result.createObjectStore("files"); r.onsuccess = () => { const tx = r.result.transaction("files", "readwrite"); tx.objectStore("files").put(new Blob(["A"]), "souborA"); tx.oncomplete = res; }; r.onerror = res; });
  });
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(1300);
  check("dokument A přežije načtení", (await page.evaluate(() => (JSON.parse(localStorage.getItem("tanmay_coll_v1") || "{}").journal || []).length)) === 1);
  const peekA = await api("/__peek");
  check("dokument A dojde na server", !!(peekA.doc && peekA.doc.coll && (peekA.doc.coll.journal || []).length === 1));

  await api("/__owner?tag=bbbbbbbbbbbbbbbb");
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(1600);
  const po = await page.evaluate(async () => ({
    owner: localStorage.getItem("tm_owner_v1"),
    journal: (JSON.parse(localStorage.getItem("tanmay_coll_v1") || "{}").journal || []).length,
    edits: Object.keys(JSON.parse(localStorage.getItem("tanmay_edits_v1") || "{}")).length,
    pinnedReg: localStorage.getItem("tm_pinned"),
    odlozeno: Object.keys(localStorage).filter((k) => k.includes("__owner_")),
    pinnedCache: (await caches.keys()).includes("pinned"),
  }));
  check("B dostane vlastní otisk", po.owner === "bbbbbbbbbbbbbbbb", String(po.owner));
  check("B nevidí deník A", po.journal === 0, "journal=" + po.journal);
  check("B nevidí denní záznamy A", po.edits === 0, "edits=" + po.edits);
  check("registr připnutých A je mimo dosah B", po.pinnedReg === null);
  check("mezipaměť připnutých médií A je smazaná", po.pinnedCache === false);
  check("obsah A je odložený, ne smazaný", po.odlozeno.length >= 2, po.odlozeno.join(","));
  const peekB = await api("/__peek");
  check("dokument A se NEODEŠLE do řádku B", !(peekB.doc && peekB.doc.coll && (peekB.doc.coll.journal || []).length));
  check("střídání účtu proběhne bez chyby stránky", errs.length === 0, errs.slice(0, 2).join(" | "));
  check("člověk se o výměně doví", (await page.getByText(/Someone else used this device|Tohle zařízení naposledy použil/).count()) > 0);
} catch (e) { check("harness", false, e.message); }
await browser.close(); srv.close();
console.log(R.join("\n"));
process.exit(failed ? 1 : 0);
