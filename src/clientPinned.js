// Only called after the stored account and freshly verified account agree.
// Copy legacy pins to owner-scoped keys; keep the old originals recoverable.
export async function scopeLegacyClientPins(storage, owner, stillCurrent) {
  if (!/^[a-f0-9]{16}$/.test(owner || '') || !stillCurrent()) return;
  if (!(await storage.keys()).includes('pinned')) return;
  const cache = await storage.open('pinned');
  for (const request of await cache.keys()) {
    if (!stillCurrent()) return;
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/files/') || url.searchParams.has('owner')) continue;
    const response = await cache.match(request);
    if (!response?.ok || response.redirected || !stillCurrent()) continue;
    url.searchParams.set('owner', owner);
    if (!await cache.match(url.href) && stillCurrent()) await cache.put(url.href, response);
  }
}
