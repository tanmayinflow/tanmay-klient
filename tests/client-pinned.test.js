import test from 'node:test';
import assert from 'node:assert/strict';
import { scopeLegacyClientPins } from '../src/clientPinned.js';
const owner = '0123456789abcdef', base = 'https://client.example.test/api/files/';
function fixture() {
  const entries = new Map([[base + 'old', new Response('original')], [base + 'other?owner=fedcba9876543210', new Response('another')]]);
  const cache = {
    keys: async () => [...entries.keys()].map(url => new Request(url)),
    match: async key => entries.get(typeof key === 'string' ? key : key.url)?.clone(),
    put: async (key, response) => entries.set(key, response),
  };
  return { entries, cache, storage: { keys: async () => ['pinned'], open: async () => cache } };
}
test('verified account pin upgrade preserves original files and never relabels another owner', async () => {
  const f = fixture();
  await scopeLegacyClientPins(f.storage, owner, () => true);
  assert.equal(await f.entries.get(base + 'old?owner=' + owner).text(), 'original');
  assert.ok(f.entries.has(base + 'old'));
  assert.ok(f.entries.has(base + 'other?owner=fedcba9876543210'));
  assert.ok(!f.entries.has(base + 'other?owner=' + owner));
});
test('an account switch during an asynchronous cache read cannot claim the previous pin', async () => {
  const f = fixture(); let current = true;
  f.cache.match = async () => { current = false; return new Response('old'); };
  await scopeLegacyClientPins(f.storage, owner, () => current);
  assert.equal(f.entries.size, 2);
});
