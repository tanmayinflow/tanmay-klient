import test from 'node:test';
import assert from 'node:assert/strict';
import { selectedTextScope, selectScopeText } from '../src/shared/ui/textSelection.js';

test('select-all belongs to one selected note, not other records or the document reader', () => {
  const end = {}, scope = { contains: node => node === end };
  const element = { closest: selector => selector === '.tm-document-sheet' ? null : scope };
  const selection = { isCollapsed: false, rangeCount: 1, anchorNode: { parentElement: element }, focusNode: end };
  assert.equal(selectedTextScope(selection), scope);
  assert.equal(selectedTextScope({ ...selection, focusNode: {} }), null);
  assert.equal(selectedTextScope({ ...selection, isCollapsed: true }), null);
  element.closest = () => scope;
  assert.equal(selectedTextScope(selection), null);
});

test('select-all selects only the connected content container', () => {
  let chosen, clear = 0, added;
  const range = { selectNodeContents: value => chosen = value };
  const selection = { removeAllRanges: () => clear++, addRange: value => added = value };
  const scope = { isConnected: true, ownerDocument: { getSelection: () => selection, createRange: () => range } };
  assert.equal(selectScopeText(scope), true);
  assert.equal(chosen, scope); assert.equal(added, range); assert.equal(clear, 1);
  assert.equal(selectScopeText({ ...scope, isConnected: false }), false);
  assert.equal(clear, 1);
});
