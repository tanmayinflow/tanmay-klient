// A local write during the first read must never silently replace a real
// document from another device. Offline edits may resume only from their
// last acknowledged server generation.
export function bootstrapSyncDecision({ hasRemote, changedDuringRead, unsynced, serverAdvanced }) {
  if (!hasRemote) return 'local';
  if (changedDuringRead || (unsynced && serverAdvanced)) return 'conflict';
  return unsynced ? 'local' : 'remote';
}
