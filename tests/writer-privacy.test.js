import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("Client writing starts empty and contains no personal practice seed", () => {
  const app = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
  for (const name of ["JOURNAL_FULL", "NOTEBOOK_FULL", "BOOKS_FULL"]) assert.match(app, new RegExp(`const ${name}\\s*=\\s*\\[\\s*\\]`));
  for (const ownerSeed of ["PRACTICES_SEED", "Personal manifest", "Refuge for work on the internet"]) assert.ok(!app.includes(ownerSeed), `Owner-only seed ${ownerSeed} is absent`);
  assert.ok(!/socOborSeed|roztridZapisnik|TM_FEATURES\.aiAssistant/.test(app));
});
