// Selection stays inside one note, never the surrounding app or another record.
export function selectedTextScope(selection) {
  if (!selection || selection.isCollapsed || !selection.rangeCount) return null;
  const element = selection.anchorNode?.nodeType === 1 ? selection.anchorNode : selection.anchorNode?.parentElement;
  if (element?.closest?.('.tm-document-sheet')) return null;
  const scope = element?.closest?.('[data-tm-select-text],.tm-rich,.tm-nahled-telo');
  return scope && scope.contains(selection.focusNode) ? scope : null;
}

export function selectScopeText(scope) {
  if (!scope?.isConnected) return false;
  const doc = scope.ownerDocument, selection = doc.getSelection();
  if (!selection) return false;
  const range = doc.createRange();
  range.selectNodeContents(scope);
  selection.removeAllRanges(); selection.addRange(range);
  return true;
}
