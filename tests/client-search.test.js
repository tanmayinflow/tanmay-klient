import { test } from "node:test";
import assert from "node:assert/strict";
import { searchClientRecords } from "../src/clientSearch.js";

test("search respects room opt-ins, does not inspect trash, coach-private fields or arbitrary account data", () => {
  const records = { notebook: [{ id: "private", title: "Dech" }], journal: [{ id: "journal", title: "Dech" }], trash: [{ data: { id: "trashed", title: "Dech" } }], oldAccount: { notebook: [{ id: "old", title: "Dech" }] } };
  const sources = [{ id: "source", title: "Dech", privateNotes: "secret", instruction: "Try daily" }, { id: "revoked", title: "Dech", unsharedAt: 1 }];
  const enabled = room => room === "prameny";
  const hits = searchClientRecords({ query: "dech", records, sources, enabled });
  assert.deepEqual(hits.map(hit => hit.id), ["source"]);
  assert.deepEqual(searchClientRecords({ query: "secret", records, sources, enabled }), []);
});

test("search finds Czech words without accents and returns stable deep-link targets", () => {
  const hits = searchClientRecords({ query: "ranni dech", records: { notebook: [{ id: "own", title: "Ranní dech", text: "Klid" }] }, goals: [{ id: "assigned", name: "Každý den", intent: "Ranní dech" }], enabled: () => true });
  assert.deepEqual(hits.map(({ kind, id, room }) => ({ kind, id, room })), [{ kind: "notebook", id: "own", room: "zapisnik" }, { kind: "goal", id: "Každý den", room: "kompas" }]);
  assert.equal(searchClientRecords({ query: " ", enabled: () => true }).length, 0);
});
