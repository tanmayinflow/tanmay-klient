// TRÉNINK · klientská strana téhož schématu.
//
// Klientská aplikace nese stejné moduly jako trenérská. Tenhle soubor hlídá to,
// co je na klientské straně jiné: předpis je jen ke čtení, výsledek se vrací
// podle id (takže dvojí odeslání nevyrobí druhý trénink), a nic z toho, co
// patří trenérovi, se sem nesmí dostat.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as TV from "../src/training/index.js";
import { loadLibrary, seedOrder } from "../scripts/lib/exercise-library.mjs";

const lib = loadLibrary();
const resolve = TV.makeResolver(lib.meta, new Set(seedOrder()));
const recOf = (id) => resolve(lib.byId[id]);
const app = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");

test("schéma je stejné jako u trenéra · verze, klíč i tvar série", () => {
  assert.equal(TV.TRAINING_SCHEMA_VERSION, 2);
  assert.equal(TV.TRAINING_KEY, "tv2");
  const s = TV.makeSet("WEIGHT_REPS", { planned: { targetWeight: 80, targetReps: 5 } });
  for (const k of ["id", "type", "planned", "actual", "completed", "completedAt", "restSec", "rir", "rpe", "note", "side"]) {
    assert.ok(k in s, `sérii chybí ${k}`);
  }
});

test("moduly tréninku jsou tytéž soubory, ne kopie s vlastním životem", () => {
  for (const f of ["measurements.js", "sessionModel.js", "sessionEngine.js", "progress.js", "storage.js", "adapters.js", "types.js"]) {
    const here = readFileSync(new URL("../src/training/" + f, import.meta.url), "utf8");
    const there = readFileSync(new URL("../../tanmay-web/src/training/" + f, import.meta.url), "utf8");
    assert.equal(here, there, `${f} se rozešel s trenérskou stranou`);
  }
});

test("provenience a jistota důkazu na klientskou stranu nepatří", () => {
  for (const id of Object.keys(lib.meta)) {
    assert.equal(lib.meta[id].src, undefined, `${id}: původ patří trenérovi`);
    assert.equal(lib.meta[id].ev, undefined, `${id}: jistota důkazu patří trenérovi`);
  }
  assert.equal(/TEX_SOURCES/.test(app), false, "tabulka původu záznamů patří trenérovi");
});

test("předpis se dá číst, ale ne přepsat", () => {
  const rec = recOf("bbsquat");
  const tpl = TV.makeTemplate({ id: "tpl1", blocks: [TV.makeBlock({
    exId: "bbsquat", measurementType: rec.measurementType, restSec: 180,
    sets: [TV.makeSet(rec.measurementType, { planned: { targetWeight: 80, targetReps: 5 } })],
  })] });
  const plan = TV.makePlan({ id: "pl1", sessions: [TV.makePlanSession({ templateId: "tpl1" })] });
  let s = TV.startSession(tpl, { date: "2026-08-21", plan, planSession: plan.sessions[0] });
  const b = s.blocks[0].id, id = s.blocks[0].sets[0].id;
  const before = JSON.stringify(s.prescription);
  s = TV.setActual(s, b, id, { weight: 60, reps: 8 });
  s = TV.completeSet(s, b, id, 1);
  assert.equal(JSON.stringify(s.prescription), before, "zápis skutečnosti se nesmí dotknout předpisu");
  assert.deepEqual(TV.findSet(s, b, id).planned, { targetWeight: 80, targetReps: 5 }, "plán zůstává tím, co trenér napsal");
  assert.deepEqual(TV.findSet(s, b, id).actual, { weight: 60, reps: 8 });
});

test("klientská appka nemá čím upravit šablonu ani plán", () => {
  // Ne slovní kontrola: v klientské aplikaci prostě žádná taková cesta není.
  for (const call of ["tvPutTemplate", "tvPutPlan", "tvEditTemplate", "tvEditPlan", "tvDropTemplate", "tvDropPlan"]) {
    assert.equal(app.includes(call), false, `${call} je trenérská cesta a v klientovi být nesmí`);
  }
  assert.ok(app.includes("tvPutSession"), "vlastní záznam si klient psát smí");
});

test("plnění je idempotentní podle id záznamu", () => {
  const rec = recOf("bbsquat");
  const ses = TV.makeSession({ id: "ses1", date: "2026-08-21", state: "done", endedAt: 5,
    blocks: [TV.makeBlock({ exId: "bbsquat", measurementType: rec.measurementType,
      sets: [TV.makeSet(rec.measurementType, { actual: { weight: 80, reps: 5 }, completed: true })] })] });
  const f = TV.fulfilmentFrom([ses], { now: 1 });
  assert.equal(f.v, 2);
  assert.equal(f.sessions.length, 1);
  let coach = TV.mergeFulfilment([], f, "klientA");
  coach = TV.mergeFulfilment(coach, f, "klientA");
  coach = TV.mergeFulfilment(coach, f, "klientA");
  assert.equal(coach.length, 1, "třikrát odeslané téže je pořád jeden trénink");
});

test("rozdělaný trénink se neodesílá · jde jen to, co je dokončené", () => {
  const rec = recOf("bbsquat");
  const running = TV.makeSession({ id: "run1", date: "2026-08-21", state: "running",
    blocks: [TV.makeBlock({ exId: "bbsquat", measurementType: rec.measurementType, sets: [TV.makeSet(rec.measurementType, {})] })] });
  assert.equal(TV.fulfilmentFrom([running], {}).sessions.length, 0);
});

test("zpětný kanál nese jen trénink", () => {
  const ses = TV.makeSession({ id: "s", date: "2026-08-21", state: "done", endedAt: 1, note: "šlo to" });
  const json = JSON.stringify(TV.fulfilmentFrom([ses], {}));
  for (const banned of ["journal", "notebook", "finance", "expenses", "klProfiles"]) {
    assert.equal(json.includes(banned), false, `do zpětného kanálu se nesmí dostat ${banned}`);
  }
});

test("reset tréninku nesáhne na deník ani na zápisník", () => {
  const before = {
    journal: [{ id: "j", text: "osobní" }], notebook: [{ id: "n" }],
    tEx: [{ id: "drep" }], tWo: [{ id: "w" }], tPl: [{ id: "p" }], tLog: [{ id: "l" }],
    tDays: { "2026-01-01": { note: "den", items: [{ id: "i" }] } },
  };
  const snap = JSON.stringify(TV.nonTrainingSnapshot(before));
  const out = TV.resetTrainingDomain(before, { now: 1 });
  assert.equal(JSON.stringify(TV.nonTrainingSnapshot(out.coll)), snap);
  assert.equal(out.coll.journal[0].text, "osobní");
  assert.equal(out.coll.tWo, undefined);
});

test("doručený plán je vstup, ne vlastní data", () => {
  // Uloží se pod svým klíčem a nikdy se nemíchá s vlastními záznamy klienta.
  const coll = TV.patchTraining({}, { delivered: { at: 1, plans: [{ id: "p" }], templates: [], exercises: [] } });
  assert.equal(TV.trainingOf(coll).delivered.plans.length, 1);
  assert.equal(TV.sessionsOf(coll).length, 0, "doručený plán není odcvičený trénink");
});

test("rozšíření V2 nemá v klientské knihovně mrtvý progresní odkaz", () => {
  for (const x of lib.all) {
    if (x.ez) assert.ok(lib.byId[x.ez], `${x.id}.ez ukazuje na ${x.ez}, který tu není`);
    if (x.hd) assert.ok(lib.byId[x.hd], `${x.id}.hd ukazuje na ${x.hd}, který tu není`);
  }
});
