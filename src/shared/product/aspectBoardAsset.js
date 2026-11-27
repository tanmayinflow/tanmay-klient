const boardPath = /^\/api\/aspect-boards\/(?:north|east|south|west)\/(?:index\.json|(?:thumb|full)\/[0-9]{3}\.webp)$/;
const privateHeaders = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };

// Both the owner route and the private service binding use this allowlist.
// Never forward a supplied host, cookie, or path to any other asset.
export async function aspectBoardAsset(path, method, assets) {
  if (!boardPath.test(path)) return new Response(null, { status: 404, headers: privateHeaders });
  if (method !== "GET" && method !== "HEAD") {
    return new Response(null, { status: 405, headers: { ...privateHeaders, Allow: "GET, HEAD" } });
  }
  const type = path.endsWith(".json") ? "application/json" : "image/webp";
  const source = await assets.fetch(new Request("https://assets.local" + path, { method }));
  // A missing file may otherwise resolve to the static SPA entry page.
  if (!source.ok || source.headers.get("Content-Type")?.split(";")[0].trim() !== type) {
    return new Response(null, { status: 404, headers: privateHeaders });
  }
  return new Response(method === "HEAD" ? null : source.body, {
    headers: { ...privateHeaders, "Content-Type": type },
  });
}
