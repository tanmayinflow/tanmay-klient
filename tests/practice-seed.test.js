// OSIVO PRAXE · co je produkt a co je člověk.
// Sdílené osivo krajin a návyků běží v obou domech. Jméno a znak krajiny jsou
// produkt; hodnocení krajiny je hodnocení jednoho člověka a do osiva nepatří.
// Audit 2026-08-25: čtyři osobní známky (import) tu ležely od začátku a
// klientský Kompas je vypisoval každému novému klientovi jako jeho vlastní.
import { test } from "node:test";
import assert from "node:assert/strict";
import { AREAS, HABIT_DEFS, HABIT_DEFAULTS } from "../src/shared/product/practice.js";

test("krajiny v osivu nenesou žádné hodnocení", () => {
  assert.ok(AREAS.length >= 5);
  for (const a of AREAS) {
    assert.equal(a.rating, undefined, a.name + " nese rating");
    assert.equal(a.ratingMonth, undefined, a.name + " nese ratingMonth");
    assert.deepEqual(Object.keys(a).sort(), ["icon", "name"], a.name + " nese víc než jméno a znak");
  }
});

test("návyky v osivu jsou jen trojice znak · cz · en", () => {
  for (const h of HABIT_DEFS) assert.equal(h.length, 3);
  for (const h of HABIT_DEFAULTS) assert.deepEqual(Object.keys(h).sort(), ["cz", "en", "icon", "slot"]);
});
