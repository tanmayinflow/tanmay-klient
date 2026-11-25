import test from 'node:test';
import assert from 'node:assert/strict';
import { DEVICE_ACCESS_KEY, readDeviceAccess, grantDeviceAccess, lockDeviceAccess, finishOfflineLogout } from '../src/shared/product/devicePrivacy.js';

test('verified offline access is revoked durably and a stale verification cannot unlock it', async () => {
  const entries = new Map(), grants = new Map();
  globalThis.localStorage = { getItem: k => entries.get(k) ?? null, setItem: (k, v) => entries.set(k, v) };
  globalThis.caches = { open: async () => ({ put: (k, v) => grants.set(k, v) }), delete: async () => grants.clear() };
  const initial = readDeviceAccess();
  assert.equal(await grantDeviceAccess('owner-A', initial.revision), true);
  assert.equal(await grants.get('/__tm_offline_grant').text(), 'owner-A');
  const bound = readDeviceAccess();
  await lockDeviceAccess(true);
  assert.equal(readDeviceAccess().locked, true);
  assert.equal(grants.size, 0);
  assert.equal(await grantDeviceAccess('owner-A', bound.revision), false);
  assert.equal(await grantDeviceAccess('owner-A', readDeviceAccess().revision), false);
  const oldFetch = globalThis.fetch;
  try {
    globalThis.fetch = async () => { throw new TypeError('offline'); };
    await assert.rejects(finishOfflineLogout());
    assert.equal(readDeviceAccess().logoutPending, true);
    let redirected = false;
    globalThis.location = { replace: () => { redirected = true; } };
    globalThis.fetch = async () => new Response(null, { status: 204 });
    assert.equal(await finishOfflineLogout(), true);
    assert.equal(redirected, true);
    assert.equal(readDeviceAccess().locked, true);
    assert.equal(await grantDeviceAccess('owner-B', readDeviceAccess().revision), true);
    assert.equal(await grants.get('/__tm_offline_grant').text(), 'owner-B');
    await lockDeviceAccess();
    globalThis.caches.open = async () => { throw Error('QuotaExceededError'); };
    assert.equal(await grantDeviceAccess('owner-B', readDeviceAccess().revision), true);
    assert.equal(grants.size, 0);
    entries.set(DEVICE_ACCESS_KEY, '{');
    assert.equal(readDeviceAccess().locked, true);
  } finally {
    globalThis.fetch = oldFetch;
    delete globalThis.location;
    delete globalThis.caches;
    delete globalThis.localStorage;
  }
});
