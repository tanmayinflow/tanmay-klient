// tanmay-web — minimal Worker (step 1).
// Purpose: prove the R2 (FILES) and D1 (DB) bindings are wired correctly,
// and pass every other request through to the static app (SPA) unchanged.
// No app behaviour changes yet; the data layer comes in step 2.

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Health check — confirms both storage bindings are reachable end-to-end.
    // Test it from the deployed app's DevTools console (see instructions),
    // NOT by typing the URL in the address bar.
    if (url.pathname === "/api/health") {
      const result = { db: "unknown", files: "unknown" };

      try {
        const row = await env.DB.prepare("SELECT 1 AS ok").first();
        result.db = row && row.ok === 1 ? "ok" : "unexpected";
      } catch (e) {
        result.db = "error: " + e.message;
      }

      try {
        // .head() on a missing key returns null without throwing — proves connectivity.
        await env.FILES.head("__healthcheck__");
        result.files = "ok";
      } catch (e) {
        result.files = "error: " + e.message;
      }

      return Response.json(result);
    }

    // Everything else: serve the static single-page app, unchanged.
    return env.ASSETS.fetch(request);
  },
};
