// Resume a failed document sync after foreground/network recovery. No reload,
// credential changes or unbounded polling. The caller retains its account,
// local-storage and revision guards and acknowledges only an actual receipt.
export function createSyncRecovery({
  retry, win = window, doc = document, online = () => navigator.onLine !== false,
  schedule = setTimeout, cancel = clearTimeout, now = Date.now,
}) {
  const delays = [5000, 15000, 60000];
  let stopped = false, busy = false, timer = null, attempts = 0, last = -Infinity;
  const visible = () => doc.visibilityState !== 'hidden' && online();
  const arm = () => {
    if (stopped || timer !== null || attempts >= delays.length) return;
    timer = schedule(() => { timer = null; void run(); }, delays[attempts]);
  };
  const run = async () => {
    if (stopped || busy || !visible()) return;
    busy = true; last = now(); attempts++;
    try { if (await retry()) { stop(); return; } } catch { /* Keep the local draft; a later attempt can recover. */ }
    finally { busy = false; }
    arm();
  };
  const wake = () => {
    if (stopped || busy || !visible() || now() - last < 5000) return;
    if (timer !== null) { cancel(timer); timer = null; }
    attempts = 0; void run();
  };
  function stop() {
    stopped = true;
    if (timer !== null) cancel(timer);
    timer = null;
    for (const event of ['online', 'focus', 'pageshow']) win.removeEventListener(event, wake);
    doc.removeEventListener('visibilitychange', wake);
  }
  for (const event of ['online', 'focus', 'pageshow']) win.addEventListener(event, wake);
  doc.addEventListener('visibilitychange', wake);
  arm();
  return stop;
}
