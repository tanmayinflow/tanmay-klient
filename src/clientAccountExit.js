// Account navigation must not strand changes in an owner quarantine. Only a
// durable local snapshot with an acknowledged online copy may leave this app.
export async function prepareClientAccountExit({ current, online, canLeave, saveLocal, writer, pending, sync }) {
  if (!current()) return 'changed';
  if (!canLeave()) return 'recording';
  saveLocal();
  await writer.settled();
  if (!current()) return 'changed';
  if (writer.currentFailure()) return 'local-error';
  if (!online()) return 'offline';
  if (pending()) {
    try { await sync(); } catch { /* The final acknowledgement is authoritative. */ }
    if (!current()) return 'changed';
    saveLocal();
    await writer.settled();
  }
  if (!current()) return 'changed';
  if (writer.currentFailure()) return 'local-error';
  if (!canLeave()) return 'recording';
  return pending() ? 'pending' : 'ready';
}

export function clientLogoutUrl(origin, switchAccount = false) {
  const url = new URL('/cdn-cgi/access/logout', origin);
  // Access accepts same-account destinations. Never accept a caller's redirect.
  if (switchAccount) url.searchParams.set('returnTo', new URL('/', origin).href);
  return url.href;
}

export function navigateClientAccountExit({ win, session, switchAccount = false }) {
  // A native leave prompt can be cancelled (for example while recording).
  // Freeze late responses only when the browser actually leaves, also covering
  // a restored back/forward-cache page after the Access session has ended.
  const leave = () => {
    session.beginSignOut();
    win.dispatchEvent(new Event('tm-sign-out'));
  };
  win.addEventListener('pagehide', leave, { once: true });
  try { win.location.assign(clientLogoutUrl(win.location.origin, switchAccount)); }
  catch (error) { win.removeEventListener('pagehide', leave); throw error; }
}
