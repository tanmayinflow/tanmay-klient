// SYNCHRONIZACE · druh selhání se nesmí zase slít do jedné věty.
//
// 2026-08-30. Odeslání na server selhalo čtyřmi různými způsoby a aplikace
// z nich udělala jednu hlášku a jedno tlačítko. Dva z těch čtyř způsobů
// „Zkusit znovu" opravit nemůže: vypršelou relaci Cloudflare Accessu spraví
// jedině nové načtení stránky (fetch se k přihlášení nepřesměruje, a aplikace
// nainstalovaná na ploše to sama nikdy neudělá), přerostlý dokument neopraví
// nic. Tenhle test je negativní kontrola: na build před opravou padá, protože
// tehdy žádné rozlišení neexistovalo.

import test from "node:test";
import assert from "node:assert/strict";
import {
  SYNC_OK, SYNC_SIT, SYNC_PRIHLASENI, SYNC_VELIKOST, SYNC_CLENSTVI, SYNC_SERVER,
  syncDruh, syncLzeZkusitZnovu, syncHlaska,
} from "../src/shared/product/sync.js";

const L = (cs) => cs;
const res = (o) => ({
  status: 200, ok: true, type: "basic", redirected: false,
  headers: { get: (k) => (k.toLowerCase() === "content-type" ? "application/json" : null) },
  ...o,
});
const html = (o) => ({
  status: 200, ok: true, type: "basic", redirected: false,
  headers: { get: () => "text/html; charset=utf-8" },
  ...o,
});

test("uložení potvrzuje tělo odpovědi, ne samotná dvoustovka", () => {
  assert.equal(syncDruh(res({}), { ok: true }, null), SYNC_OK);
  assert.equal(syncDruh(res({}), { ok: false, code: "db" }, null), SYNC_SERVER);
  // Přihlašovací stránka Accessu i SPA fallback vrací 200 s HTML. Dřív to
  // prošlo jako „uloženo" a práce zmizela beze stopy.
  assert.equal(syncDruh(html({}), null, null), SYNC_PRIHLASENI);
});

test("vypršelá relace se pozná, místo aby vypadala jako výpadek sítě", () => {
  assert.equal(syncDruh({ type: "opaqueredirect", status: 0, ok: false, headers: { get: () => null } }, null, null), SYNC_PRIHLASENI);
  assert.equal(syncDruh(res({ status: 401, ok: false }), null, null), SYNC_PRIHLASENI);
  assert.equal(syncDruh(res({ status: 302, ok: false, redirected: true }), null, null), SYNC_PRIHLASENI);
});

test("členství a velikost mají vlastní jméno", () => {
  assert.equal(syncDruh(res({ status: 403, ok: false }), { ok: false, error: "not a member" }, null), SYNC_CLENSTVI);
  assert.equal(syncDruh(res({ status: 403, ok: false }), null, null), SYNC_PRIHLASENI);
  assert.equal(syncDruh(res({ status: 413, ok: false }), { ok: false, code: "too-large", bytes: 2100000 }, null), SYNC_VELIKOST);
});

test("výpadek sítě zůstává výpadkem sítě", () => {
  assert.equal(syncDruh(null, null, new Error("Failed to fetch")), SYNC_SIT);
});

test("opakovat se nabízí jen tam, kde to může zabrat", () => {
  assert.equal(syncLzeZkusitZnovu(SYNC_SIT), true);
  assert.equal(syncLzeZkusitZnovu(SYNC_SERVER), true);
  assert.equal(syncLzeZkusitZnovu(SYNC_PRIHLASENI), false, "fetch relaci neobnoví");
  assert.equal(syncLzeZkusitZnovu(SYNC_VELIKOST), false, "opakování nezmenší dokument");
});

test("hláška řekne příčinu, ne jen následek", () => {
  assert.match(syncHlaska(SYNC_PRIHLASENI, L, {}), /Přihlášení vypršelo/);
  assert.match(syncHlaska(SYNC_VELIKOST, L, { bytes: 2100000 }), /strop úložiště/);
  assert.match(syncHlaska(SYNC_VELIKOST, L, { bytes: 2100000 }), /2\.1 MB/);
  assert.match(syncHlaska(SYNC_SERVER, L, { stav: 500 }), /\(500\)/);
  assert.match(syncHlaska(SYNC_SIT, L, {}), /jen v tomhle zařízení/);
});
