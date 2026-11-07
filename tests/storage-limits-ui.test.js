import test from 'node:test';
import assert from 'node:assert/strict';
import { limitFromMegabytes, storageLimitsRequest, validateStorageLimits } from '../src/shared/product/storageLimits.js';

const fixture = () => ({
  ok: true, role: 'client', ready: true,
  limits: { globalBytes: 9500000000, freeBytes: 10000000000, dailyA: 28000, dailyB: 280000, defaultClientBytes: 500000000 },
  pool: { usedBytes: 500, reservedBytes: 50 },
  own: { userId: 'client:alice', usedBytes: 300, reservedBytes: 50, limitBytes: 500000000, personalLimitBytes: null, effectiveLimitBytes: 500000000 },
  operations: { day: '2026-11-07', a: 10, b: 30 },
});
test('unknown or malformed capacities never become zero or unlimited UI data', () => {
  assert.equal(validateStorageLimits(fixture()).own.effectiveLimitBytes, 500000000);
  for (const edit of [d => delete d.pool.usedBytes, d => d.own.effectiveLimitBytes = 999999999, d => d.own.personalLimitBytes = -1, d => d.operations.a = NaN, d => d.limits.globalBytes = 11000000000]) {
    const data = fixture(); edit(data); assert.throws(() => validateStorageLimits(data), /storage-invalid/);
  }
  const limited = fixture(); limited.own.personalLimitBytes = 0; limited.own.effectiveLimitBytes = 0;
  assert.equal(validateStorageLimits(limited).own.effectiveLimitBytes, 0);
});
test('limit input accepts decimal MB and a zero pause without coercing empty or excessive values', () => {
  assert.equal(limitFromMegabytes('500', 9500000000), 500000000);
  assert.equal(limitFromMegabytes('0,5', 9500000000), 500000);
  assert.equal(limitFromMegabytes('0', 9500000000), 0);
  for (const value of ['', ' ', '-1', 'Infinity', '1e3', '9501', 'x', '1.2345678']) assert.throws(() => limitFromMegabytes(value, 9500000000), /storage-limit-invalid/);
});
test('server lower limit is saved as bytes, null restores allowance, HTTP failure is not success', async () => {
  const sent = [];
  const context = { fetcher: async (path, init) => { sent.push({path, ...init}); return Response.json(fixture()); } };
  await storageLimitsRequest(context, { personalLimitBytes: 0 });
  await storageLimitsRequest(context, { personalLimitBytes: null });
  assert.equal(sent[0].path, '/api/storage'); assert.equal(sent[0].method, 'PUT');
  assert.deepEqual(JSON.parse(sent[0].body), { personalLimitBytes: 0 });
  assert.deepEqual(JSON.parse(sent[1].body), { personalLimitBytes: null });
  await assert.rejects(storageLimitsRequest({ fetcher: async () => Response.json({ error: 'storage-limit-invalid' }, { status: 400 }) }, {limitBytes: 10}), /storage-limit-invalid/);
  await assert.rejects(storageLimitsRequest({ fetcher: async () => new Response('<html>login</html>', { headers: {'content-type': 'text/html'} }) }), /storage-unavailable/);
});
test('account changes suppress old reads and writes before sending or after response', async () => {
  let calls = 0;
  await assert.rejects(storageLimitsRequest({ current: () => false, fetcher: async () => { calls++; return Response.json(fixture()); } }, {personalLimitBytes: 10}), /account-changed/);
  assert.equal(calls, 0);
  let current = true;
  await assert.rejects(storageLimitsRequest({ current: () => current, fetcher: async () => { current = false; return Response.json(fixture()); } }), /account-changed/);
  const controller = new AbortController();
  await assert.rejects(storageLimitsRequest({ signal: controller.signal, fetcher: async () => { controller.abort(); return Response.json(fixture()); } }), /account-changed/);
});
