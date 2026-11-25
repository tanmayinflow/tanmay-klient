// The Access session can change while a PWA is suspended. Bind every request
// to the verified account that owns the mounted document, including uploads.
// A temporary network error locks network work without clearing local drafts.
export function createClientSession(fetcher = (...args) => fetch(...args), privacy = {}) {
  let state = { status: 'loading', owner: null, member: null, name: '', email: '' };
  let pending = null, initialize = null, generation = 0;
  const listeners = new Set();
  const publish = patch => { state = { ...state, ...patch }; for (const listener of listeners) listener(state); };
  const denied = (code, status = 401) => Object.assign(new Error(code), { code, status });
  const documentOwner = () => state.owner || state.offlineOwner || null;
  const changed = () => {
    generation++;
    if (documentOwner() && privacy.permits?.(documentOwner())) privacy.lock?.().catch(() => {});
    publish({ status: 'changed' });
  };
  async function verify() {
    if (['changed', 'signed-out'].includes(state.status)) return false;
    if (pending) return pending;
    if (!initialize) return false;
    const version = generation, revision = privacy.revision?.();
    publish({ status: documentOwner() ? 'checking' : 'loading' });
    pending = (async () => {
      try {
        if (privacy.finishLogout && await privacy.finishLogout()) return false;
        const response = await fetcher('/api/me', { cache: 'no-store', credentials: 'same-origin', redirect: 'manual' });
        if (response.status >= 500 || response.status === 408 || response.status === 429) throw denied('offline', 0);
        if (!response.ok || response.redirected || response.type === 'opaqueredirect') throw denied('sign-in');
        const data = await response.json().catch(() => { throw denied('sign-in'); });
        if (!data || !/^[a-f0-9]{16}$/.test(data.owner || '') || typeof data.member !== 'boolean') throw denied('sign-in');
        if (version !== generation) return false;
        if (documentOwner() && documentOwner() !== data.owner) { changed(); return false; }
        if (privacy.revision && privacy.revision() !== revision && !privacy.permits?.(data.owner)) return false;
        if (!state.owner) { try { await initialize(data); } catch { throw denied('storage', 0); } }
        if (version !== generation) return false;
        if (data.member && privacy.grant && !await privacy.grant(data.owner, revision)) return false;
        if (!data.member && privacy.lock) await privacy.lock();
        if (version !== generation) return false;
        publish({ status: data.member ? 'ready' : 'membership', owner: data.owner, member: data.member, name: data.name || '', email: typeof data.email === 'string' ? data.email : '' });
        return data.member;
      } catch (error) {
        if (version === generation) {
          if (error.code === 'sign-in') await privacy.lock?.().catch(() => {});
          if (version === generation) {
            const status = ['sign-in', 'storage'].includes(error.code) ? error.code : 'offline';
            publish({ status, offlineOwner: state.offlineOwner || (status === 'offline' ? privacy.offlineOwner?.() : null) });
          }
        }
        return false;
      } finally { if (version === generation) pending = null; }
    })();
    return pending;
  }
  async function request(url, init = {}) {
    // Callers may already have captured a blob or draft from local storage.
    // Never let such a request perform the first account switch and then
    // continue with the old payload. Startup owns the first verification.
    if (!state.owner) throw denied(state.status, state.status === 'sign-in' ? 401 : 0);
    if (!await verify()) throw denied(state.status, state.status === 'offline' ? 0 : 401);
    const owner = state.owner, version = generation;
    const headers = new Headers(init.headers || {});
    headers.set('X-Tanmay-Owner', owner);
    const response = await fetcher(url, { credentials: 'same-origin', redirect: 'manual', ...init, headers });
    if (version !== generation || owner !== state.owner || state.status === 'changed') throw denied('changed', 409);
    if (response.status === 409) {
      const detail = await response.clone().json().catch(() => null);
      if (detail?.code === 'account-changed') { changed(); throw denied('changed', 409); }
    }
    if (response.status === 403) {
      const detail = await response.clone().json().catch(() => null);
      if (detail?.error === 'not a member' || detail?.code === 'access-revoked') {
        if (version !== generation) throw denied('changed', 409);
        publish({ status: 'membership', member: false });
        await privacy.lock?.().catch(() => {});
      }
    }
    if (response.status === 401 || response.redirected || response.type === 'opaqueredirect') {
      publish({ status: 'sign-in' });
      await privacy.lock?.().catch(() => {});
    }
    return response;
  }
  return {
    getSnapshot: () => state, documentOwner,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    initializeWith(callback) { initialize = callback; },
    verify, request,
    beginSignOut() { generation++; pending = null; publish({ status: 'signed-out', email: '', name: '' }); },
    localOwnerChanged(owner) { if (documentOwner() && documentOwner() !== owner) changed(); },
    isCurrent(owner) { return !!owner && owner === state.owner && !['changed', 'signed-out', 'sign-in', 'membership'].includes(state.status); },
  };
}
