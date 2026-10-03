// Exports use the same verified account as uploads. Offline fallback is only
// for that account's pinned media, never a substitute for denied access.
export async function readClientAttachmentBlob(attachment, io) {
  if (!attachment) return null;
  const owner = io.session.getSnapshot().owner;
  const current = () => {
    if (!owner || !io.session.isCurrent(owner)) throw Object.assign(new Error('changed'), { code: 'changed' });
  };
  current();
  let blob;
  if (attachment.idb) {
    blob = await io.local(attachment.id);
    if (!blob) throw new Error('missing-local-attachment');
  } else {
    const url = io.url(attachment);
    const protectedFile = attachment.r2 || /^\/api\/files\//.test(url || '');
    let response;
    try {
      response = await (protectedFile ? io.request(url, { cache: 'no-store' }) : io.fetch(url));
    } catch (error) {
      current();
      const state = io.session.getSnapshot();
      const offline = error?.code === 'offline' || (error instanceof TypeError && !error.code);
      if (!protectedFile || !offline || !['ready', 'checking', 'offline'].includes(state.status)) throw error;
      response = await io.pinned(url);
      current();
      if (!response) throw error;
    }
    if (!response.ok || response.redirected || response.type === 'opaqueredirect') {
      throw Object.assign(new Error('unavailable-attachment'), { status: response.status });
    }
    blob = await response.blob();
  }
  current();
  return blob;
}
