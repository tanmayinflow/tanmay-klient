import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { aspectBoardAsset } from "../src/shared/product/aspectBoardAsset.js";
import worker from "../worker/index.js";

test("board asset binding only reads known gallery files and rejects the static SPA fallback", async () => {
  const path = "/api/aspect-boards/north/thumb/001.webp";
  const calls = [];
  const assets = { fetch: async request => {
    calls.push([request.method, request.url]);
    return new Response("sample", { headers: { "Content-Type": "image/webp" } });
  } };
  for (const invalid of ["/assets/private.js", "/api/aspect-boards/north/full/other.webp", "/api/aspect-boards/north/thumb/001.webp/../index.html"]) {
    assert.equal((await aspectBoardAsset(invalid, "GET", assets)).status, 404);
  }
  assert.equal((await aspectBoardAsset(path, "DELETE", assets)).status, 405);
  assert.equal(calls.length, 0);
  const response = await aspectBoardAsset(path, "GET", assets);
  assert.equal(await response.text(), "sample");
  assert.equal(response.headers.get("Cache-Control"), "private, no-store");
  assert.equal((await aspectBoardAsset(path, "HEAD", assets)).body, null);
  assert.deepEqual(calls, [["GET", "https://assets.local" + path], ["HEAD", "https://assets.local" + path]]);
  const spa = { fetch: () => new Response("<html></html>", { headers: { "Content-Type": "text/html" } }) };
  assert.equal((await aspectBoardAsset("/api/aspect-boards/east/index.json", "GET", spa)).status, 404);
});

test("anonymous gallery requests never reach curated assets", async () => {
  const config = JSON.parse(fs.readFileSync(new URL("../wrangler.jsonc", import.meta.url)));
  assert.ok(config.assets.run_worker_first.includes("/api/*"));
  const denied = () => assert.fail("unauthenticated board access");
  const response = await worker.fetch(new Request("https://" + config.routes[0].pattern + "/api/aspect-boards/east/thumb/001.webp"), {
    ...config.vars, OWNER_EMAIL: "owner@example.test", ASSETS: { fetch: denied }, ASPECT_BOARDS: { read: denied },
  });
  assert.equal(response.status, 401);
});
