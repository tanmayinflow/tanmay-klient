import test from 'node:test';
import assert from 'node:assert/strict';
import { bindClientWorkspaceOwner, clientDraftDestination, clientWorkspaceScreen } from '../src/clientWorkspaceOwner.js';

const tag = '0123456789abcdef';
test('only a matching granted owner can mount the private workspace', () => {
  const state = { status: 'ready', member: true, owner: tag, localOwner: tag, device: { owner: tag, locked: false } };
  for (const status of ['ready', 'checking', 'offline']) assert.equal(clientWorkspaceScreen({ ...state, status }), 'open');
  for (const status of ['signed-out', 'changed', 'storage', 'sign-in']) assert.equal(clientWorkspaceScreen({ ...state, status }), 'locked');
  assert.equal(clientWorkspaceScreen({ ...state, status: 'membership', member: false }), 'invite');
  assert.equal(clientWorkspaceScreen({ ...state, status: 'checking', member: false }), 'invite');
  assert.equal(clientWorkspaceScreen({ ...state, status: 'offline', device: { owner: tag, locked: true } }), 'locked');
  assert.equal(clientWorkspaceScreen({ ...state, status: 'offline', device: { owner: '', locked: false } }), 'locked');
  assert.equal(clientWorkspaceScreen({ ...state, status: 'offline', localOwner: 'aaaaaaaaaaaaaaaa' }), 'locked');
});

test('an old editor saves its blur draft outside the new account’s active slots', () => {
  const key = 'tanmay_edits_v1';
  assert.equal(clientDraftDestination(key, tag, tag, 'tab1'), key);
  assert.equal(clientDraftDestination(key, tag, 'aaaaaaaaaaaaaaaa', 'tab1'), key + '__owner_' + tag + '_draft_tab1');
});

function fixture(previous, records) {
  const values = new Map(Object.entries(records));
  if (previous) values.set('tm_owner_v1', previous);
  const events = [];
  const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  const options = { tag, storage, cacheStorage: { keys: async () => [] },
    quarantine: async owner => {
      assert.equal(storage.getItem('tm_owner_v1') || '', owner);
      for (const key of ['tanmay_coll_v1', 'tanmay_edits_v1']) {
        if (values.has(key)) values.set('preserved-' + key, values.get(key));
        values.delete(key);
      }
      events.push(['quarantine', owner]);
    }, resetDocument: notice => events.push(['reset', notice]) };
  return { values, events, options };
}
test('unclaimed client records are preserved outside the next verified account', async () => {
  const f = fixture(null, { tanmay_coll_v1: 'unclaimed-writing', tanmay_edits_v1: 'unclaimed-edits' });
  await bindClientWorkspaceOwner(f.options);
  assert.deepEqual(f.events, [['quarantine', ''], ['reset', 'unclaimed']]);
  assert.equal(f.values.get('preserved-tanmay_coll_v1'), 'unclaimed-writing');
  assert.equal(f.values.has('tanmay_edits_v1'), false);
  assert.equal(f.values.get('tm_files_namespace'), 'tanmay_files_' + tag);
  assert.equal(f.values.get('tm_owner_v1'), tag);
});
test('a failed quarantine cannot publish another owner or reset their drafts', async () => {
  const f = fixture('fedcba9876543210', { tanmay_coll_v1: 'writing' });
  f.options.quarantine = async () => { throw Error('quota'); };
  await assert.rejects(bindClientWorkspaceOwner(f.options));
  assert.equal(f.values.get('tm_owner_v1'), 'fedcba9876543210');
  assert.equal(f.values.get('tanmay_coll_v1'), 'writing');
  assert.equal(f.events.length, 0);
});
test('a verified returning owner keeps the same saved workspace', async () => {
  const f = fixture(tag, { tanmay_coll_v1: 'my-writing', tm_files_namespace: 'my-files' });
  await bindClientWorkspaceOwner(f.options);
  assert.deepEqual(f.events, []);
  assert.equal(f.values.get('tm_files_namespace'), 'my-files');
  assert.equal(f.values.get('tanmay_coll_v1'), 'my-writing');
});
