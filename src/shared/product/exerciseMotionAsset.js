import { EXERCISE_MOTION } from './exerciseMotion.js';

const clips = new Map(Object.values(EXERCISE_MOTION).map(clip => [clip.src, clip]));
// Workers Static Assets can return the whole file for Range requests. Safari
// needs actual byte ranges. Only these small, reviewed public clips are buffered.
export async function exerciseMotionAsset(request, assets) {
  const url = new URL(request.url);
  const clip = clips.get(url.pathname);
  if (!clip) return null;
  if (!['GET', 'HEAD'].includes(request.method)) return new Response(null, { status: 405, headers: { Allow: 'GET, HEAD' } });
  const headers = new Headers({
    'Content-Type': 'video/mp4', 'Accept-Ranges': 'bytes',
    'Cache-Control': 'private, max-age=86400, immutable',
    'ETag': `"${clip.sha256}"`, 'X-Content-Type-Options': 'nosniff',
    'X-Tanmay-Motion': 'byte-ranges-v1',
  });
  if (clip.bytes > 1024 * 1024) return new Response(null, { status: 503 });
  if (request.method === 'HEAD') {
    headers.set('Content-Length', String(clip.bytes));
    return new Response(null, { headers });
  }
  let start = 0, end = clip.bytes - 1, partial = false;
  const range = request.headers.get('Range');
  const ifRange = request.headers.get('If-Range');
  const match = /^bytes=(\d*)-(\d*)$/.exec(range || '');
  if (match && (match[1] || match[2]) && (!ifRange || ifRange === headers.get('ETag'))) {
    if (!match[1]) start = Math.max(0, clip.bytes - Number(match[2]));
    else { start = Number(match[1]); if (match[2]) end = Math.min(Number(match[2]), end); }
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= clip.bytes) {
      headers.set('Content-Range', `bytes */${clip.bytes}`);
      return new Response(null, { status: 416, headers });
    }
    partial = true;
  }
  // Do not forward Range, conditional headers or cookies to the asset binding.
  const source = await assets.fetch(new Request(url.origin + clip.src));
  if (!source.ok || !source.headers.get('Content-Type')?.startsWith('video/mp4')) return new Response(null, { status: 502 });
  const reader = source.body.getReader(), chunks = [];
  let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > clip.bytes) { await reader.cancel(); return new Response(null, { status: 502 }); }
    chunks.push(value);
  }
  if (size !== clip.bytes) return new Response(null, { status: 502 });
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  headers.set('Content-Length', String(end - start + 1));
  if (partial) headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
  return new Response(bytes.subarray(start, end + 1), { status: partial ? 206 : 200, headers });
}
