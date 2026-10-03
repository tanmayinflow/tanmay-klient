// tanmay — service worker. Manual, no build plugin.
// index.html: network-first (always fresh online, cached fallback offline).
// hashed assets + fonts: cache-first (immutable). /api/*: never cached.
// Only caches real app responses (200, same-origin, not an Access redirect).
const VERSION = "tanmay-v4";
const SHELL = "shell-" + VERSION;
const ASSETS = "assets-" + VERSION;

self.addEventListener("install", () => { self.skipWaiting(); });

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    // "pinned" drží připnutá média přihlášeného člověka. Nesmaže ho výměna
    // verze (offline přílohy by zmizely), ale při střídání účtu na jednom
    // zařízení ho ruší aplikace sama — viz ownerQuarantine v App.tsx.
    await Promise.all(keys.filter((k) => !k.endsWith(VERSION) && k !== "pinned" && !k.startsWith("pinned__owner_")).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

function cacheable(res) { return res && res.ok && res.status === 200 && !res.redirected; }
function isHtml(res) { return (res.headers.get("content-type") || "").includes("text/html"); }

// Chybějící soubor se na tomhle hostingu nevrací jako 404 — SPA fallback
// pošle index.html se stavem 200. Kdyby se takový dokument uložil pod URL
// obrázku, zůstal by tam i po nasazení opravy a obrázek by byl rozbitý
// natrvalo. Do mezipaměti souborů proto nikdy nepatří HTML.
function ulozitelne(res) { return cacheable(res) && !isHtml(res); }

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Private media is network-first. Only a transport failure may use an
  // exact owner-scoped pin; denied access is never replaced by cached data.
  if (url.origin === location.origin && url.pathname.startsWith("/api/")) {
    if (url.pathname.startsWith("/api/files/") && url.pathname !== "/api/files") {
      event.respondWith(privateFile(req));
    }
    return;
  }

  // Google Fonts (stylesheet + font files): cache-first so the brand type works offline.
  if (url.origin === "https://fonts.googleapis.com" || url.origin === "https://fonts.gstatic.com") {
    event.respondWith(cacheFirst(req, ASSETS));
    return;
  }

  // Never intercept the web manifest — it is fetched with credentials and
  // must reach Cloudflare Access directly, not through the cache.
  if (url.origin === location.origin && url.pathname === "/manifest.webmanifest") return;

  if (url.origin !== location.origin) return;

  // App navigations: network-first, fall back to cached shell offline.
  if (req.mode === "navigate") {
    event.respondWith(networkFirstDoc(req));
    return;
  }

  // Same-origin hashed assets (JS/CSS/img/fonts): cache-first.
  event.respondWith(cacheFirst(req, ASSETS));
});

async function privateFile(req) {
  const owner = new URL(req.url).searchParams.get("owner");
  // Old URLs stay readable online, but cannot identify an offline account.
  if (!/^[a-f0-9]{16}$/.test(owner || "")) return fetch(req);
  const headers = new Headers(req.headers);
  if (headers.has("X-Tanmay-Owner") && headers.get("X-Tanmay-Owner") !== owner) {
    return new Response("", { status: 409 });
  }
  headers.set("X-Tanmay-Owner", owner);
  try {
    return await fetch(new Request(req, { headers, mode: "same-origin", redirect: "manual" }));
  } catch (error) {
    const cache = await caches.open("pinned");
    const hit = await cache.match(req);
    if (hit && ulozitelne(hit)) return hit;
    throw error;
  }
}

async function networkFirstDoc(req) {
  const address = new URL(req.url);
  const key = address.pathname === "/" || address.pathname === "/index.html" ? "/index.html" : address.pathname + address.search;
  try {
    const res = await fetch(req);
    if (cacheable(res) && isHtml(res)) {
      const c = await caches.open(SHELL);
      await c.put(key, res.clone());
    }
    return res;
  } catch (e) {
    const c = await caches.open(SHELL);
    const cached = await c.match(key);
    if (cached) return cached;
    throw e;
  }
}

async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  if (hit) {
    fetch(req).then((res) => { if (ulozitelne(res)) cache.put(req, res.clone()); }).catch(() => {});
    return hit;
  }
  try {
    const res = await fetch(req);
    if (ulozitelne(res)) cache.put(req, res.clone());
    return res;
  } catch (e) {
    return hit || Response.error();
  }
}
