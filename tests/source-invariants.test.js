// Pravidla, která se nedají ověřit spuštěním, ale dají se ověřit ve zdroji.
// Každé z nich je popis chyby, která se sem už jednou dostala.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const app = readFileSync(join(root, "src/App.tsx"), "utf8");
const sw = readFileSync(join(root, "public/sw.js"), "utf8");

test("persistColl se nevolá s hotovým objektem", () => {
  // `persistColl({ ...coll, … })` posílá dovnitř snímek z renderu. Dva takové
  // zápisy v jednom kole Reactu se přepíšou a druhý vrátí zbytek dokumentu
  // do stavu před prvním.
  const hits = [...app.matchAll(/persistColl\(\s*\{/g)].length;
  assert.equal(hits, 0, "nalezeno " + hits + " volání v objektovém tvaru");
});

test("z klientského sestavení neodchází požadavek na trenérské cesty", () => {
  assert.equal([...app.matchAll(/[^k]fetch\(\s*["'`]\/api\/klienti/g)].length, 0);
  assert.match(app, /function klFetch\(\)/, "plot okolo trenérských cest musí existovat");
});

test("místnost trenéra není v klientské aplikaci směrovaná", () => {
  assert.doesNotMatch(app, /case\s+"klienti":\s*return\s+<PageKlienti/);
});

test("střídání účtu odklidí i média předchozího člověka", () => {
  const fn = app.slice(app.indexOf("function ownerQuarantine"), app.indexOf("function ownerQuarantine") + 900);
  assert.ok(fn.includes("tm_pinned"), "registr připnutých");
  assert.ok(fn.includes('caches.delete("pinned")'), "mezipaměť připnutých médií");
  assert.ok(fn.includes('deleteDatabase("tanmay_files")'), "místní přílohy");
  assert.ok(fn.includes("__owner_"), "obsah se odkládá, nemaže");
});

test("synchronizace nezačne dřív, než padne identita", () => {
  assert.match(app, /if \(ownerId === null\) return;/);
});

test("selhání zápisu do úložiště se ohlásí", () => {
  assert.match(app, /function saveColl\(c\)[^\n]*tmSaveFailed\("coll"\)/);
  assert.match(app, /function saveEdits\(e\)[^\n]*tmSaveFailed\("edits"\)/);
});

test("přepínač sdílení tréninku ukládá pod klíčem, pod kterým se čte", () => {
  const key = app.match(/shareRow\("([a-z]+)", "Trénink"/);
  assert.ok(key, "řádek sdílení tréninku musí existovat");
  const read = app.match(/training: !!share\.([a-z]+)/);
  assert.ok(read, "čtení hodnoty musí existovat");
  assert.equal(key[1], read[1], "zapisuje se pod jiným klíčem, než se čte");
});

test("servisní pracovník neuloží SPA fallback pod adresu souboru", () => {
  assert.match(sw, /function ulozitelne\(res\)/);
  assert.equal([...sw.matchAll(/if \(cacheable\(res\)\) cache\.put/g)].length, 0,
    "cacheFirst musí ukládat přes ulozitelne(), ne cacheable()");
});

test("odkaz otevřený do nového okna nedá cizí stránce ovládání toho našeho", () => {
  // Bez "noopener" dostane otevřená stránka odkaz na okno, ze kterého vzešla,
  // a může ho přesměrovat jinam. Kontrolujeme okolí každého volání, protože
  // argumenty samy obsahují závorky.
  const bad = [];
  let i = -1;
  while ((i = app.indexOf("window.open(", i + 1)) !== -1) {
    const okolí = app.slice(i, i + 260);
    if (!okolí.includes("noopener")) bad.push(app.slice(i, i + 70));
  }
  assert.deepEqual(bad, [], "window.open bez noopener");
});

test("každá místnost ve směrovači je opravdu definovaná", () => {
  // `<PagePraxe />` v klientské aplikaci nikdy neexistovala: vypnutí Mementa
  // ve chvíli, kdy je ta místnost otevřená, shodilo celou aplikaci na prázdno.
  const i = app.indexOf("switch (page) {");
  assert.ok(i > 0, "směrovač místností musí existovat");
  const sw2 = app.slice(i, i + 3000);
  const used = new Set([...sw2.matchAll(/<(Page[A-Za-z0-9_]+)/g)].map((m) => m[1]));
  const missing = [...used].filter((n) => !new RegExp("function " + n + "\\s*\\(").test(app));
  assert.deepEqual(missing, [], "směrovač ukazuje na nedefinované komponenty");
});

test("příloha má kam spadnout, když spojení selže", () => {
  assert.match(app, /async function attDoUloziste\(file, id\)/);
  assert.match(app, /await idbPut\(id, file\)/);
  assert.doesNotMatch(app, /await readFileAsAtt\(f\)\); \} catch \(e\) \{\}/, "selhání se nesmí spolknout");
  assert.match(app, /se nepodařilo uložit/, "člověk se to musí dozvědět");
});

test("sběrač souborů má obě brzdy, které má osobní aplikace", () => {
  const i = app.indexOf("window.tmGcFiles");
  const blok = app.slice(i, i + 2600);
  assert.match(blok, /if \(!stateOk\)/, "nečitelný stav ze serveru musí běh zastavit");
  assert.match(blok, /orphans\.length > Math\.max\(5, Math\.floor\(files\.length \* 0\.3\)\)/, "chybí strop na počet osiřelých");
});

test("offline příloha se pošle nahoru, až bude signál", () => {
  assert.match(app, /window\.tmPrilohyNahoru = async/);
  assert.match(app, /function tmPovysPrilohy/);
  const i = app.indexOf("window.tmPrilohyNahoru = async");
  assert.match(app.slice(i, i + 1400), /setTimeout\(\(\) => \{ if \(ulozeno > 0\) hotove\.forEach/);
});

test("selhání odeslání na server se neztratí", () => {
  assert.match(app, /\.catch\(\(\) => setSyncErr\(true\)\)/);
  assert.match(app, /\{syncErr && \(/);
});

test("zmenšení obrázku vždycky doběhne", () => {
  const i = app.indexOf("function resizeImageToBlob");
  const blok = app.slice(i, i + 1400);
  assert.match(blok, /\} finally \{\s*URL\.revokeObjectURL\(url\);/);
});

test("html dokumentu sleduje zvolený jazyk", () => {
  assert.match(app, /document\.documentElement\.lang = lang === "cs"/);
});

test("nasazená verze se člověku nabídne", () => {
  // Instalovaná aplikace jinak drží svůj balík, dokud ji něco nenačte znovu.
  assert.match(app, /function TmNovaVerze\(\)/);
  assert.match(app, /<TmNovaVerze \/>/);
  assert.doesNotMatch(app, /setNova\(true\);[\s\S]{0,80}location\.reload\(\)/, "nesmí načítat samo");
});

// ---- TRAINING SYSTEM V2 · klientská hranice ---------------------------------
test("starý tréninkový model není aktivní cesta produktu", () => {
  for (const key of ["tWo", "tPl", "tLog"]) {
    const re = new RegExp("coll\\." + key + "\\b|addEntry\\(\"" + key + "\"|updateEntry\\(\"" + key + "\"", "g");
    assert.equal((app.match(re) || []).length, 0, `${key} má být mimo produktovou cestu`);
  }
  assert.ok(app.includes("TV.resetTrainingDomain"));
});

test("doručený plán se opravdu čte · půlka roury je horší než žádná", () => {
  assert.match(app, /fetch\("\/api\/plan"/, "plán, který se nikdy nevyzvedne, není plán");
  assert.match(app, /tvSetDelivered|delivered: doc/, "a někam se musí uložit");
});

test("zpětný kanál se opravdu odesílá", () => {
  assert.match(app, /_shareOf/, "snímek pro trenéra musí vzniknout");
  assert.equal((app.match(/share: _shareOf\(/g) || []).length, 2, "obě cesty odeslání ho nesou");
  assert.match(app, /TV\.fulfilmentFrom/);
});

test("klient nemá čím sáhnout na předpis", () => {
  for (const call of ["tvPutTemplate", "tvPutPlan", "tvEditTemplate", "tvEditPlan"]) {
    assert.equal(app.includes(call), false, call);
  }
});

test("čekající odeslání je vidět", () => {
  assert.match(app, /syncPending/, "zapsaná série se nesmí tvářit jako odeslaná");
});

// Rezervační vrstva je v souboru ohraničená; test se musí ptát právě jí,
// jinak by odpovídal za polovinu aplikace a jeho výsledek by nic neznamenal.
const bookingSlice = () => app.slice(app.indexOf("const BKC_API"), app.indexOf("const MODULES = ["));

test("klientská aplikace nemluví s trenérskými cestami", () => {
  const bk = bookingSlice();
  assert.ok(bk.length > 1000, "rezervační vrstva musí ve zdroji být");
  assert.match(bk, /const BKC_API = "\/api\/client"/);
  assert.equal(/["'`]\/api\/booking\//.test(bk), false, "trenérské cesty v klientském sestavení nemají co dělat");
});

test("klient neposílá vlastní identifikátor jako autoritu", () => {
  const bk = bookingSlice();
  assert.equal(/clientId\s*:/.test(bk), false, "identitu odvozuje Worker ze session, ne tělo požadavku");
});

test("rezervace klienta nikdy nekončí jen v prohlížeči", () => {
  const bk = bookingSlice();
  assert.equal(/localStorage/.test(bk), false);
  // offline se dá číst, ne rezervovat — a musí to být napsané, ne doufané
  assert.match(bk, /OFFLINE/);
});

test("klientský Worker nezná trenérskou část rezervačního API", () => {
  const w = readFileSync(join(root, "worker/index.js"), "utf8");
  assert.match(w, /handleClient/);
  assert.equal(/handleCoach/.test(w), false, "trenérské cesty v klientském Workeru neexistují");
});

test("rezervační doména je v obou aplikacích tentýž soubor", () => {
  for (const f of ["types.js", "time.js", "slots.js", "credits.js", "status.js", "format.js", "index.js"]) {
    const here = readFileSync(join(root, "src/booking/" + f), "utf8");
    const there = readFileSync(join(root, "../tanmay-web/src/booking/" + f), "utf8");
    assert.equal(here, there, f + " se rozešel s trenérskou stranou");
  }
});
