import { scopeLegacyClientPins } from './clientPinned.js';

// Keep owner assignment and any snapshot quarantine ahead of rendering and
// synchronization. Concurrent tabs should not both move the active workspace.
export async function bindClientWorkspaceOwner({ tag, storage, cacheStorage, quarantine, resetDocument, locks }) {
  const bind = async () => {
    const previous = storage.getItem('tm_owner_v1') || '';
    if (previous !== tag) {
      const hasLocalState = Boolean(previous) ||
        ['tanmay_coll_v1', 'tanmay_edits_v1', 'tm_synced_v1', 'tm_pinned', 'tm_files_namespace'].some(key => storage.getItem(key) !== null);
      const hasPins = cacheStorage && (await cacheStorage.keys()).includes('pinned');
      if (hasLocalState || hasPins) await quarantine(previous);
      // Even a device holding only legacy IndexedDB media gets a distinct
      // namespace. No newly verified account adopts the unlabelled originals.
      storage.setItem('tm_files_namespace', 'tanmay_files_' + tag);
      resetDocument(previous ? 'switched' : hasLocalState || hasPins ? 'unclaimed' : false);
    } else if (cacheStorage) {
      await scopeLegacyClientPins(cacheStorage, tag, () => storage.getItem('tm_owner_v1') === tag).catch(() => {});
    }
    if ((storage.getItem('tm_owner_v1') || '') !== previous) throw Error('account changed during local recovery');
    storage.setItem('tm_owner_v1', tag);
    if (storage.getItem('tm_owner_v1') !== tag) throw Error('owner storage unavailable');
  };
  return locks?.request ? locks.request('tm-client-workspace-owner', bind) : bind();
}

// Only a locally granted, matching account may render the private React tree.
export function clientWorkspaceScreen({ status, member, owner, localOwner, device }) {
  if (['changed', 'signed-out', 'sign-in', 'storage'].includes(status)) return 'locked';
  if (status === 'membership' || (status === 'checking' && member === false)) return 'invite';
  if (device.locked) return 'locked';
  if (owner && localOwner === owner && device.owner === owner) {
    if (status === 'ready' && member === true) return 'open';
    if (['checking', 'offline'].includes(status) && member !== false) return 'open';
  }
  return status === 'offline' ? 'locked' : 'checking';
}

export function clientDraftDestination(key, owner, localOwner, tab) {
  return owner && owner !== localOwner ? key + '__owner_' + owner + '_draft_' + tab : key;
}
