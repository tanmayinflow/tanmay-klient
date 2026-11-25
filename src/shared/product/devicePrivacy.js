// Each application has its own origin. The UI and the service worker must both
// see an explicit sign-out, including when a device subsequently starts offline.
export const DEVICE_ACCESS_KEY = 'tm_device_access_v1';
const CACHE = 'tm-device-access-v1';
const CACHE_KEY = '/__tm_offline_grant';
let pending = Promise.resolve();
let completingLogout;

export function readDeviceAccess() {
  try {
    const raw = localStorage.getItem(DEVICE_ACCESS_KEY);
    if (!raw) return { owner: '', locked: false, revision: '' };
    const value = JSON.parse(raw);
    if (typeof value.owner === 'string' && typeof value.locked === 'boolean' && typeof value.revision === 'string') return value;
  } catch { /* damaged or inaccessible storage must not grant offline access */ }
  return { owner: '', locked: true, revision: 'unavailable' };
}

function storeAccess(owner, locked, logoutPending = false) {
  const state = { owner, locked, logoutPending, revision: crypto.randomUUID() };
  localStorage.setItem(DEVICE_ACCESS_KEY, JSON.stringify(state));
  const mirror = async () => {
    if (!globalThis.caches) return;
    // Read the latest decision inside the queue, including changes from other tabs.
    const current = readDeviceAccess();
    if (current.locked || !current.owner) await caches.delete(CACHE);
    else await (await caches.open(CACHE)).put(CACHE_KEY, new Response(current.owner));
  };
  const exclusive = () => globalThis.navigator?.locks?.request
    ? navigator.locks.request(CACHE, mirror) : mirror();
  pending = pending.catch(() => {}).then(exclusive);
  // Available offline media is optional. A full cache cannot prevent an
  // authenticated user from opening their workspace online.
  return locked ? pending : pending.catch(() => {});
}

export async function grantDeviceAccess(owner, expectedRevision) {
  const current = readDeviceAccess();
  if (!owner || current.logoutPending) return false;
  if (current.revision !== expectedRevision) return !current.locked && current.owner === owner;
  if (current.owner !== owner || current.locked) await storeAccess(owner, false);
  const latest = readDeviceAccess();
  return !latest.locked && latest.owner === owner;
}

export async function lockDeviceAccess(logoutPending = false) {
  const current = readDeviceAccess();
  if (current.locked && (!logoutPending || current.logoutPending)) return;
  await storeAccess(current.owner, true, logoutPending || current.logoutPending);
}

// Logging out offline cannot expire an Access cookie. Finish that operation
// before the old cookie can authorize a local unlock on reconnection.
export function finishOfflineLogout() {
  if (!readDeviceAccess().logoutPending) return Promise.resolve(false);
  if (!completingLogout) completingLogout = (async () => {
    const state = readDeviceAccess();
    const response = await fetch('/cdn-cgi/access/logout', { cache: 'no-store', credentials: 'same-origin', redirect: 'manual' });
    if (!response.ok && response.type !== 'opaqueredirect' && !(response.status >= 300 && response.status < 400)) throw Error('sign-out-unavailable');
    if (readDeviceAccess().revision === state.revision) await storeAccess(state.owner, true);
    location.replace('/');
    return true;
  })().finally(() => { completingLogout = null; });
  return completingLogout;
}
