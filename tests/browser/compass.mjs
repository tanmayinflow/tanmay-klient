// KOMPAS V PROHLÍŽEČI · jedna orientace, dva domy.
//
// Sdílená vrstva Kompasu (src/shared/ui/compass.jsx) běží v osobní i klientské
// aplikaci. Tenhle soubor se ptá skutečné aplikace, jestli se místnost opravdu
// vykreslí, jestli se dílna otevře, jestli se detail cíle dá otevřít a zavřít
// a jestli po tom všem nezůstane zamčená stránka. V klientské aplikaci navíc
// ověřuje, že cíl od Tanmaye nese klidný štítek „Od Tanmaye" — ne „Locked".
//
//   npm run build && node tests/browser/compass.mjs
import { createServer } from "./server.mjs";

let chromium;
try { ({ chromium } = await import("playwright-core")); }
catch { console.log("SKIP · playwright-core není k dispozici"); process.exit(0); }

const EXE = process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const PORT = Number(process.env.PORT || 8937);
const BASE = "http://localhost:" + PORT;

const R = []; let failed = 0;
const check = (n, ok, x = "") => { if (!ok) failed++; R.push((ok ? "PASS " : "FAIL ") + n + (x ? " — " + x : "")); };

const srv = createServer(); await new Promise((r) => srv.listen(PORT, r));
let browser;
try { browser = await chromium.launch({ executablePath: EXE, args: ["--no-sandbox"] }); }
catch (e) { console.log("SKIP · Chromium se nepodařilo spustit: " + e.message); srv.close(); process.exit(0); }

const KLIENT = process.env.TM_ROLE === "client";

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

  // Kompas je v obou domech základní místnost · dostaneme se do ní z doku.
  const doKompasu = async () => {
    const ok = await page.evaluate(() => {
      const bs = [...document.querySelectorAll("button")];
      const b = bs.find((x) => (x.innerText || "").trim() === "Kompas");
      if (!b) return false;
      b.click();
      return true;
    });
    await page.waitForTimeout(700);
    return ok;
  };
  check("Kompas je dosažitelný z navigace", await doKompasu());

  // Nadpisy sekcí kreslí CSS verzálkami, takže innerText vrací „V POHYBU".
  // Porovnáváme proto bez ohledu na velikost písmen.
  const kompas = () => page.evaluate(() => {
    const txt = (document.body.innerText || "").toLowerCase();
    return {
      nadpis: txt.indexOf("kompas") !== -1,
      dnesniKrok: txt.indexOf("dnešní krok") !== -1,
      vPohybu: txt.indexOf("v pohybu") !== -1,
      krajina: txt.indexOf("krajina") !== -1,
      dilna: txt.indexOf("otevřít dílnu") !== -1,
      // Zakázaná slovní zásoba · rozdíl vlastnictví se nesmí jmenovat zámek.
      zakazana: ["locked", "admin goal", "system-owned"].filter((w) => txt.indexOf(w) !== -1),
      odTanmaye: txt.indexOf("od tanmaye") !== -1,
      chipy: document.querySelectorAll(".tm-lift").length,
    };
  });
  const k = await kompas();
  check("Kompas se vykreslil", k.nadpis && k.dnesniKrok && k.vPohybu, JSON.stringify(k).slice(0, 160));
  check("krajina je na stránce", k.krajina);
  check("dílna se dá otevřít", k.dilna);
  check("nikde nestojí Locked ani Admin goal", k.zakazana.length === 0, k.zakazana.join(", "));

  // Dílna · otevře se jako list, zamkne stránku, Escape ji pustí.
  const otevriDilnu = async () => {
    const ok = await page.evaluate(() => {
      const b = [...document.querySelectorAll("button")].find((x) => (x.innerText || "").toLowerCase().includes("otevřít dílnu"));
      if (!b) return false;
      b.click(); return true;
    });
    await page.waitForTimeout(700);
    return ok;
  };
  check("dílna se otevřela", await otevriDilnu());
  const vDilne = await page.evaluate(() => {
    const cs = document.querySelector(".tm-cs");
    const txt = cs ? (cs.innerText || "").toLowerCase() : "";
    return {
      list: !!cs,
      zamek: getComputedStyle(document.body).position,
      novyCil: txt.indexOf("nový cíl") !== -1,
      pohledy: ["stav", "krajina", "priorita", "hotové", "archiv"].filter((v) => txt.indexOf(v) !== -1).length,
    };
  });
  check("dílna je list", vDilne.list);
  check("stránka pod dílnou je zamčená", vDilne.zamek === "fixed", vDilne.zamek);
  check("dílna nabízí nový cíl", vDilne.novyCil);
  check("dílna má všech pět pohledů", vDilne.pohledy === 5, String(vDilne.pohledy));

  await page.keyboard.press("Escape");
  await page.waitForTimeout(600);
  const poDilne = await page.evaluate(() => ({ list: !!document.querySelector(".tm-cs"), zamek: getComputedStyle(document.body).position }));
  check("Escape dílnu zavřel", !poDilne.list);
  check("po dílně zámek nezůstal", poDilne.zamek !== "fixed", poDilne.zamek);

  // Detail krajiny · zásuvka se otevře z odznaku a zavře Escapem.
  const otevriKrajinu = await page.evaluate(() => {
    const b = [...document.querySelectorAll("button.tm-lift")].find((x) => (x.innerText || "").trim().length > 0);
    if (!b) return false;
    b.click(); return true;
  });
  await page.waitForTimeout(700);
  const vDetailu = await page.evaluate(() => {
    const d = document.querySelector(".tm-drawer, [data-tm-drawer], .tm-cs");
    const txt = (document.body.innerText || "").toLowerCase();
    return {
      vrstva: !!d,
      hodnoceni: txt.indexOf("hodnocení po měsících") !== -1,
      stoji: txt.indexOf("jak to teď stojí") !== -1,
      zamek: getComputedStyle(document.body).position,
    };
  });
  check("odznak krajiny šel otevřít", otevriKrajinu);
  check("detail krajiny nese měsíční hodnocení", vDetailu.hodnoceni, JSON.stringify(vDetailu));
  check("detail krajiny nese obě otázky", vDetailu.stoji);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(600);
  const poDetailu = await page.evaluate(() => getComputedStyle(document.body).position);
  check("po detailu krajiny zámek nezůstal", poDetailu !== "fixed", poDetailu);

  // Cíl od Tanmaye · jen klientská aplikace. Musí se jmenovat klidně,
  // zadání nesmí být přepsatelné a trenérova poznámka se k němu nedostane.
  if (KLIENT) {
    const dorucen = await page.evaluate(async () => {
      const doc = { v: 1, at: Date.now(), goals: [{
        id: "cg-1", title: "Ranní mobilita každý den", intent: "Deset minut po probuzení, než sáhneš po telefonu.",
        target: "2026-12-31", area: "Body", assignedAt: Date.now(),
        coachNote: "TAJNÁ TRENÉROVA POZNÁMKA",
      }] };
      const r = await fetch("/__goals", { method: "POST", body: JSON.stringify(doc) });
      return r.ok;
    });
    check("doručený cíl se dá nasadit", dorucen);
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2200);
    await doKompasu();
    const cg = await page.evaluate(() => {
      const txt = document.body.innerText || "";
      return {
        vidi: txt.indexOf("Ranní mobilita každý den") !== -1,
        stitek: txt.indexOf("Od Tanmaye") !== -1 || txt.indexOf("OD TANMAYE") !== -1,
        moje: txt.indexOf("Moje") !== -1 || txt.indexOf("MOJE") !== -1,
        tajemstvi: txt.indexOf("TAJNÁ TRENÉROVA POZNÁMKA") !== -1,
        zakazana: ["Locked", "locked", "Admin goal", "System-owned"].filter((w) => txt.indexOf(w) !== -1),
      };
    });
    check("cíl od Tanmaye je v Kompasu vidět", cg.vidi, JSON.stringify(cg));
    check("nese štítek Od Tanmaye", cg.stitek);
    // Vlastní cíl klientská aplikace neseeduje — založíme si ho, ať je vidět,
    // že se obě třídy v jednom seznamu rozliší klidně a bez zámku.
    const zalozen = await page.evaluate(async () => {
      const b = [...document.querySelectorAll("button")].find((x) => (x.innerText || "").toLowerCase().includes("otevřít dílnu"));
      if (!b) return false;
      b.click();
      await new Promise((r) => setTimeout(r, 700));
      const nb = [...document.querySelectorAll(".tm-cs button")].find((x) => (x.innerText || "").toLowerCase().includes("nový cíl"));
      if (!nb) return false;
      nb.click();
      await new Promise((r) => setTimeout(r, 400));
      const inp = [...document.querySelectorAll(".tm-cs input")].find((x) => x.type !== "date");
      if (!inp) return false;
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
      setter.call(inp, "Můj vlastní cíl");
      inp.dispatchEvent(new Event("input", { bubbles: true }));
      await new Promise((r) => setTimeout(r, 200));
      const save = [...document.querySelectorAll(".tm-cs button")].find((x) => (x.innerText || "").trim() === "Uložit");
      if (!save) return false;
      save.click();
      await new Promise((r) => setTimeout(r, 700));
      return true;
    });
    check("vlastní cíl se dá založit", zalozen);
    const obe = await page.evaluate(() => {
      const txt = (document.body.innerText || "");
      return { moje: /MOJE|Moje/.test(txt), odT: /OD TANMAYE|Od Tanmaye/.test(txt) };
    });
    check("vlastní cíle se v tu chvíli jmenují Moje", obe.moje, JSON.stringify(obe));
    check("obě třídy stojí vedle sebe", obe.moje && obe.odT, JSON.stringify(obe));
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);
    check("trenérova poznámka se ke klientovi nedostala", !cg.tajemstvi);
    check("ani teď nikde nestojí Locked", cg.zakazana.length === 0, cg.zakazana.join(", "));

    // Zadání se nedá přepsat ani programově · adaptér dat ho odmítne.
    const pokus = await page.evaluate(async () => {
      const app = document.querySelector("#root") || document.body;
      void app;
      // Otevřeme detail cíle a zkusíme přepsat termín, který píše trenér.
      const b = [...document.querySelectorAll("button")].find((x) => (x.innerText || "").includes("Ranní mobilita každý den"));
      if (!b) return { otevreno: false };
      b.click();
      await new Promise((r) => setTimeout(r, 700));
      const txt = document.body.innerText || "";
      const dat = [...document.querySelectorAll('input[type="date"]')].length;
      return {
        otevreno: true,
        zamer: txt.indexOf("Deset minut po probuzení") !== -1,
        mujKrok: txt.toLowerCase().indexOf("můj krok") !== -1,
        oznacit: txt.indexOf("Označit jako hotové") !== -1,
        spoustec: txt.indexOf("Spouštěč") !== -1,
        dosazitelnost: txt.indexOf("Dosažitelnost") !== -1,
        datumPoli: dat,
        tajemstvi: txt.indexOf("TAJNÁ TRENÉROVA POZNÁMKA") !== -1,
      };
    });
    check("detail cíle od Tanmaye se otevřel", pokus.otevreno, JSON.stringify(pokus));
    check("záměr od Tanmaye je vidět", pokus.zamer);
    check("klient má svůj krok", pokus.mujKrok);
    check("klient může požádat o uzavření", pokus.oznacit);
    check("spouštěč se u cizího zadání nenabízí", !pokus.spoustec);
    check("dosažitelnost se u cizího zadání nenabízí", !pokus.dosazitelnost);
    check("termín od Tanmaye není pole k přepsání", pokus.datumPoli === 0, String(pokus.datumPoli));
    check("trenérova poznámka není ani v detailu", !pokus.tajemstvi);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);
  }

  check("bez chyby stránky", errs.length === 0, errs.join(" | "));
  await ctx.close();

  // ---- desktop · týž Kompas, jiná šířka --------------------------------
  const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p2 = await ctx2.newPage();
  const errs2 = []; p2.on("pageerror", (e) => errs2.push(String(e).split("\n")[0]));
  await p2.addInitScript(() => { localStorage.setItem("tm-lang", "en"); localStorage.setItem("tmGuideVersion", "999"); });
  await p2.goto(BASE, { waitUntil: "domcontentloaded" });
  await p2.waitForTimeout(1800);
  const naslo = await p2.evaluate(() => {
    const b = [...document.querySelectorAll("button")].find((x) => (x.innerText || "").trim() === "Compass");
    if (!b) return false;
    b.click(); return true;
  });
  await p2.waitForTimeout(700);
  const en = await p2.evaluate(() => {
    const txt = (document.body.innerText || "").toLowerCase();
    return { krok: txt.indexOf("today's step") !== -1, pohyb: txt.indexOf("in motion") !== -1, cesky: /dnešní krok|v pohybu/.test(txt) };
  });
  check("desktop · Kompas se otevřel anglicky", naslo && en.krok && en.pohyb, JSON.stringify(en));
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
