import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { SOURCE_COVER_ART, SOURCE_COVER_HASHES, sourceCoverArt } from "../src/shared/product/sourceCovers.js";
import vm from "node:vm";
import ts from "typescript";
import React from "react";

test("every current source category has a shipped, verified illustration", () => {
  const app = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
  const categories = app.match(/const C_CATS_BY_TYPE = \{([\s\S]*?)\n\};/);
  assert.ok(categories, "source category registry exists");
  const names = [...categories[1].matchAll(/"([^"]+)"/g)].map(m => m[1]);
  assert.deepEqual([...new Set(names)].sort(), Object.keys(SOURCE_COVER_ART).sort());
  const urls = [...new Set(Object.values(SOURCE_COVER_ART))];
  assert.equal(urls.length, 19, "the restored family retains all nineteen original genre illustrations");
  for (const url of urls) {
    assert.match(url, /^\/media\/source-covers\/[a-z-]+-v2\.webp$/);
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

test("restored illustrations depend on the saved genre for every medium", () => {
  for (const type of ["Book", "Movie", "Podcast", "Article", "Feed", null, {}, ["Book"], "constructor", "__proto__"]) {
    for (const category of ["Movement", "Philosophy", "Self-help", "Novel", "Psychology"]) {
      assert.equal(sourceCoverArt(category, type), SOURCE_COVER_ART[category]);
    }
    for (const category of ["", "Unknown", undefined, "constructor", "__proto__"]) {
      assert.equal(sourceCoverArt(category, type), null, "unknown genres retain the medium glyph instead of a new minimalist cover");
    }
  }
});

function coverFixture(props) {
  let states = [], cursor = 0;
  const hooks = { ...React, useState(initial) {
    const index = cursor++;
    if (!(index in states)) states[index] = initial;
    return [states[index], value => { states[index] = value; }];
  } };
  const source = readFileSync(new URL("../src/shared/ui/sourceCover.jsx", import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { jsx: ts.JsxEmit.React, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(compiled, { module, exports: module.exports, require: id => id === "react" ? hooks : { sourceCoverArt } });
  let tree;
  function render() {
    cursor = 0;
    const child = module.exports.SourceCover(props);
    tree = child.type(child.props);
  }
  render();
  return {
    get root() { return tree; },
    get image() { return tree.props.children?.props?.children?.[0]; },
    get ink() { return tree.props.children?.props?.children?.[1]; },
    fail() { this.image.props.onError(); render(); },
    theme(next) { props = { ...props, theme: next }; render(); },
  };
}

test("real covers remain whole and unmodified; failures change only display", () => {
  const record = Object.freeze({ src: "/my-saved-cover.png", category: "Movement", type: "Book" });
  const before = JSON.stringify(record);
  const cover = coverFixture({ ...record, theme: { callout: "#222", textSec: "#ddd", mode: "dark" }, glyph: () => null });
  assert.equal(cover.root.props["data-source-cover"], "real");
  assert.equal(cover.image.props.src, record.src);
  assert.equal(cover.image.props.style.objectFit, "contain");
  assert.equal(cover.image.props.style.opacity, 1);
  assert.equal(cover.image.props.style.filter, undefined);
  assert.equal(cover.ink, false);
  cover.fail();
  assert.equal(cover.root.props["data-source-cover"], "category");
  assert.equal(cover.image.props.src, SOURCE_COVER_ART.Movement);
  cover.fail();
  assert.equal(cover.root.props["data-source-cover"], "medium");
  assert.equal(JSON.stringify(record), before);
});

test("fallback cover ink and background follow the current theme without fixed image colors", () => {
  const cover = coverFixture({ category: "Novel", type: "Book", theme: { callout: "#eee", textSec: "#333" } });
  assert.equal(cover.root.props["data-source-art"], "theme-ink");
  assert.equal(cover.image.props.style.opacity, 0, "original raster colors never paint the fallback");
  assert.equal(cover.root.props.style.background, "#eee");
  assert.equal(cover.ink.props.style.background, "var(--land-art-ink, #333)");
  assert.ok(cover.ink.props.style.mask.includes(SOURCE_COVER_ART.Novel));
  assert.ok(cover.ink.props.style.mask.includes("contain"));
  cover.theme({ callout: "#222", textSec: "#ddd" });
  assert.equal(cover.root.props.style.background, "#222");
  assert.equal(cover.ink.props.style.background, "var(--land-art-ink, #ddd)");
});
