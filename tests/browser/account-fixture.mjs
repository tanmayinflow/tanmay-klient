import worker from '../../worker/index.js';
import { makeEnv, req } from '../helpers/env.js';

// Keep the E2E check on the same identity, membership, chunk and receipt
// contracts as a deployed client. All accounts and SQL records are disposable.
export function createAccountFixture() {
  const env = makeEnv();
  const accounts = new Set();
  let tag = 'aaaaaaaaaaaaaaaa';
  const perform = (path, options = {}) => worker.fetch(req(path, { ...options, email: tag + '@example.test' }), env, {});
  return {
    async handle(url, request) {
      if (url.pathname === '/__owner') {
        const next = url.searchParams.get('tag');
        if (!/^[a-f0-9]{16}$/.test(next || '')) return Response.json({}, { status: 400 });
        tag = next;
        if (!accounts.has(tag)) {
          await perform('/api/me');
          const joined = await perform('/api/join', { method: 'POST', body: { word: env.INVITE_WORD } });
          if (!joined.ok) return joined;
          accounts.add(tag);
        }
        return perform('/api/me');
      }
      if (url.pathname === '/__peek') return perform('/api/state');
      if (url.pathname !== '/api/me' && url.pathname !== '/api/state') return null;
      const method = request.method;
      const chunks = [];
      if (method !== 'GET' && method !== 'HEAD') for await (const chunk of request) chunks.push(chunk);
      const expectedOwner = request.headers['x-tanmay-owner'];
      return perform(url.pathname + url.search, { method, body: chunks.length ? Buffer.concat(chunks).toString('utf8') : undefined,
        headers: expectedOwner ? { 'X-Tanmay-Owner': expectedOwner } : {} });
    },
    close() { env.DB._raw.close(); },
  };
}
