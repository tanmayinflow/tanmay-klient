// A local write during the first read must never silently replace a real
// document from another device. Offline edits may resume only from their
// last acknowledged server generation.
export function bootstrapSyncDecision({ hasRemote, changedDuringRead, unsynced, serverAdvanced }) {
  if (!hasRemote) return 'local';
  if (changedDuringRead || (unsynced && serverAdvanced)) return 'conflict';
  return unsynced ? 'local' : 'remote';
}

// A lost response does not mean the commit failed. Compare the complete
// content, not a revision or the compact local dirty marker. Never treat a
// partial server document as proof that absent edits were also saved.
export function acknowledgedServerSnapshot(remote, candidates) {
  if (!remote?.coll || typeof remote.coll !== 'object' || Array.isArray(remote.coll)
    || !remote.edits || typeof remote.edits !== 'object' || Array.isArray(remote.edits)) return null;
  const snapshot = JSON.stringify({ coll: remote.coll, edits: remote.edits });
  return candidates.some(candidate => typeof candidate === 'string' && candidate === snapshot) ? snapshot : null;
}
