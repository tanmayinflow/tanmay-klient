// Only the standalone market chart can embed its established chart provider.
// Personal app pages retain their ordinary framing and script restrictions.
export function marketFrameResponse(response) {
  const headers = new Headers(response.headers);
  headers.set('X-Frame-Options', 'SAMEORIGIN');
  headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' https://s3.tradingview.com; style-src 'self' 'unsafe-inline'; frame-src https://s.tradingview.com https://www.tradingview-widget.com; img-src 'self' https: data:; connect-src 'self'; frame-ancestors 'self'; object-src 'none'; base-uri 'none'");
  return new Response(response.body, {status:response.status,headers});
}
