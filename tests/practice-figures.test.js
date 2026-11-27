import { test } from "node:test";
import assert from "node:assert/strict";
import { figureHasCounter, savePracticeFigure } from "../src/shared/product/practiceFigures.js";

test("opening an old counter preserves its name, identity, total and the rest of the account", () => {
  const legacy = { id: "custom-id", name: "My figure", count: 12, imported: "legacy" };
  const other = { id: "another-id", name: "One more", count: 3 };
  const coll = { mala: [legacy, other], mandala: { north: { note: "Private note" } } };
  assert.equal(figureHasCounter(legacy), true);
  const next = savePracticeFigure(coll, [], legacy.id, { name: "  Renamed  ", symbolism: "An open hand", count: 0 });
  assert.deepEqual(next.mala[0], { ...legacy, name: "Renamed", symbolism: "An open hand" });
  assert.strictEqual(next.mala[1], other);
  assert.strictEqual(next.mandala, coll.mandala);
  assert.equal(legacy.name, "My figure");
});

test("new profiles have no counter until chosen and role defaults never leak to empty client lists", () => {
  const defaults = [{ id: "main", name: "Owner’s original counter", count: 7 }];
  const create = (coll, roleDefaults) => savePracticeFigure(coll, roleDefaults, "new", { name: "  Raven  ", feltQuality: "Curiosity" }, true);
  const client = create({}, []);
  const own = create({}, defaults);
  assert.deepEqual(client.mala, [{ id: "new", name: "Raven", feltQuality: "Curiosity", counterEnabled: false, count: 0 }]);
  assert.equal(own.mala.length, 2);
  assert.strictEqual(own.mala[0], defaults[0]);
  assert.deepEqual(create({ mala: [] }, defaults), client);
  const counted = savePracticeFigure(client, [], "new", { counterEnabled: true });
  assert.equal(figureHasCounter(counted.mala[0]), true);
  const snapshot = { mala: [{ ...counted.mala[0], count: 11, principles: "Follow through" }] };
  const hidden = savePracticeFigure(snapshot, [], "new", { counterEnabled: false, gift: "Courage" });
  assert.equal(hidden.mala[0].count, 11);
  assert.equal(hidden.mala[0].principles, "Follow through");
  assert.equal(figureHasCounter(hidden.mala[0]), false);
  assert.deepEqual(savePracticeFigure(hidden, [], "new", { counterEnabled: true }).mala[0], { ...snapshot.mala[0], gift: "Courage" });
});

test("renaming or editing a removed profile cannot resurrect it, and retries cannot duplicate it", () => {
  const coll = { mala: [{ id: "r", name: "Raven", count: 5 }] };
  assert.strictEqual(savePracticeFigure(coll, [], "deleted", { name: "Stale draft" }), coll);
  assert.strictEqual(savePracticeFigure(coll, [], "r", { name: "Duplicate" }, true), coll);
  assert.strictEqual(savePracticeFigure(coll, [], "r", { name: "  " }), coll);
  assert.strictEqual(savePracticeFigure(coll, [], "new", { name: "  " }, true), coll);
});
