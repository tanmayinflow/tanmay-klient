import test from 'node:test';
import assert from 'node:assert/strict';
import { mergeSources, sanitizeClientSourceNote, forkSource, SOURCE_PROGRESS } from '../src/shared/product/sources.js';

test('a newly assigned source is counted in the waiting filter', () => {
  const doc = { sources: [{ id: 'assigned', title: 'Shared book' }] };
  const list = mergeSources([], doc, {});
  assert.equal(list.filter(s => s.progress === 'Ready to start').length, 1);
  assert.equal(list[0].origin, 'coach');
  assert.equal(list[0].locked, true);
});

test('every source status offered by the current UI survives a private note save', () => {
  for (const progress of SOURCE_PROGRESS) {
    const note = sanitizeClientSourceNote({ progress, note: 'Private', title: 'Cannot overwrite coach title' });
    assert.deepEqual(note, { progress, note: 'Private' });
    const [source] = mergeSources([], { sources: [{ id: 's', title: 'Coach title' }] }, { s: note });
    assert.equal(source.progress, progress);
    assert.equal(source.title, 'Coach title');
  }
  assert.deepEqual(sanitizeClientSourceNote({ progress: 'invalid' }), {});
});

test('legacy progress remains visible in filters and when copying an assigned source', () => {
  const legacy = { Nezačato: 'Ready to start', Čtu: 'In progress', Hotovo: 'Finished', Odloženo: 'Ready to start' };
  for (const [progress, current] of Object.entries(legacy)) {
    const own = { id: 'own', title: 'Own title', progress };
    const assigned = { id: 'shared', title: 'Shared title' };
    const notes = { shared: { note: 'My note', progress } };
    const list = mergeSources([own], { sources: [assigned] }, notes);
    assert.equal(list.filter(s => s.progress === current).length, 2);
    assert.equal(sanitizeClientSourceNote({ progress }).progress, current);
    assert.equal(forkSource(assigned, notes.shared, 'copy').progress, current);
    assert.equal(notes.shared.progress, progress, 'normalization must not mutate stored notes');
    assert.equal(own.progress, progress);
  }
});
