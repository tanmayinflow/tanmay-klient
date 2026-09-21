import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { SOURCE_COVER_ART, SOURCE_COVER_HASHES, sourceCoverArt } from "../src/shared/product/sourceCovers.js";

test("every current source category has a shipped, verified illustration", () => {
  const app = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
  const categories = app.match(/const C_CATS_BY_TYPE = \{([\s\S]*?)\n\};/);
  assert.ok(categories, "source category registry exists");
  const names = [...categories[1].matchAll(/"([^"]+)"/g)].map(m => m[1]);
  assert.deepEqual([...new Set(names)].sort(), Object.keys(SOURCE_COVER_ART).sort());
  for (const url of Object.values(SOURCE_COVER_ART)) {
    assert.ok(url.startsWith("/media/source-covers/"));
    const bytes = readFileSync(new URL("../public" + url, import.meta.url));
    assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
    assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
    assert.equal(createHash("sha256").update(bytes).digest("hex"), SOURCE_COVER_HASHES[url.split("/").pop()]);
  }
});

test("unknown and malformed categories never invent a subject or asset path", () => {
  for (const value of [null, undefined, "", "Unknown", "constructor", "__proto__", "../../private", {}, ["Science"]]) {
    assert.equal(sourceCoverArt(value), null);
  }
});

test("category selection depends only on the saved category and does not mutate it", () => {
  const source = Object.freeze({category:"Science", type:"Book", title:"A deliberately unrelated title", icon:"/real-cover.png"});
  assert.equal(sourceCoverArt(source.category), SOURCE_COVER_ART.Science);
  assert.equal(source.icon, "/real-cover.png");
  assert.equal(sourceCoverArt("Philosophy"), SOURCE_COVER_ART.Philosophy);
});
