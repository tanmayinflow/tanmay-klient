// tanmay — service worker. Manual, no build plugin.
// index.html: network-first (always fresh online, cached fallback offline).
// hashed assets + fonts: cache-first (immutable). /api/*: never cached.
// Only caches real app responses (200, same-origin, not an Access redirect).
const VERSION = "tanmay-v2";
const SHELL = "shell-" + VERSION;
const ASSETS = "assets-" + VERSION;

self.addEventListener("install", () => { self.skipWaiting(); });

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => !k.endsWith(VERSION) && k !== "pinned").map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

function cacheable(res) { return res && res.ok && res.status === 200 && !res.redirected; }
function isHtml(res) { return (res.headers.get("content-type") || "").includes("text/html"); }

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // API. Pinned media (/api/files/<id>) is served from the "pinned" cache when
  // present so pinned entries open offline; everything else on /api is network-only.
  if (url.origin === location.origin && url.pathname.startsWith("/api/")) {
    if (url.pathname.startsWith("/api/files/") && url.pathname !== "/api/files") {
      event.respondWith((async () => {
        try { const cache = await caches.open("pinned"); const hit = await cache.match(req); if (hit) return hit; } catch (e) {}
        return fetch(req);
      })());
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

async function networkFirstDoc(req) {
  try {
    const res = await fetch(req);
    if (cacheable(res) && isHtml(res)) {
      const c = await caches.open(SHELL);
      c.put("/index.html", res.clone());
    }
    return res;
  } catch (e) {
    const c = await caches.open(SHELL);
    const cached = await c.match("/index.html");
    if (cached) return cached;
    throw e;
  }
}

async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  if (hit) {
    fetch(req).then((res) => { if (cacheable(res)) cache.put(req, res.clone()); }).catch(() => {});
    return hit;
  }
  try {
    const res = await fetch(req);
    if (cacheable(res)) cache.put(req, res.clone());
    return res;
  } catch (e) {
    return hit || Response.error();
  }
}
