import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

// Execute the handlers actually shipped by this App, not a parallel model.
const source = fs.readFileSync('src/App.tsx', 'utf8');
const ast = ts.createSourceFile('App.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const findFunction = name => ast.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === name);
function initializer(owner, name) {
  let found;
  function walk(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(ast) === name) found = node.initializer.getText(ast);
    ts.forEachChild(node, walk);
  }
  walk(findFunction(owner));
  assert.ok(found, `${owner}.${name} exists`);
  return found;
}
const handler = (name, context) => vm.runInNewContext('(' + initializer('RichArea', name) + ')', context);
function event(target) { return { target, prevented: false, preventDefault() { this.prevented = true; }, stopPropagation() {} }; }

test('locked checklist and image controls leave DOM and persisted content unchanged', () => {
  let checked = '0', writes = 0, removed = 0, moved = 0;
  const richLockedRef = { current: true };
  const action = handler('figAction', { richLockedRef, sync() { writes++; } });
  const line = { getAttribute: () => checked, setAttribute: (_key, value) => { checked = value; } };
  const check = { parentElement: line, classList: { toggle() {} } };
  action(event({ nodeType: 1, closest: selector => selector === '.tm-chk' ? check : null }));
  assert.equal(checked, '0');
  for (const kind of ['del', 'up', 'down', 'plus', 'minus']) {
    const figure = { remove() { removed++; }, parentNode: { insertBefore() { moved++; } }, getAttribute: () => '320', style: {} };
    const control = { getAttribute: () => kind, closest: () => figure };
    action(event({ nodeType: 1, closest: selector => selector === '[data-act]' ? control : null }));
  }
  assert.deepEqual({ writes, removed, moved }, { writes: 0, removed: 0, moved: 0 });
});

test('unlocked checklist and image deletion keep existing edit behavior', () => {
  let checked = '0', writes = 0, removed = 0;
  const action = handler('figAction', { richLockedRef: { current: false }, sync() { writes++; } });
  const line = { getAttribute: () => checked, setAttribute: (_key, value) => { checked = value; } };
  const check = { parentElement: line, classList: { toggle() {} } };
  action(event({ nodeType: 1, closest: selector => selector === '.tm-chk' ? check : null }));
  const figure = { remove() { removed++; } };
  const control = { getAttribute: () => 'del', closest: () => figure };
  action(event({ nodeType: 1, closest: selector => selector === '[data-act]' ? control : null }));
  assert.deepEqual({ checked, writes, removed }, { checked: '1', writes: 2, removed: 1 });
});

test('locked content still opens safe external previews and leaves ordinary links alone', () => {
  const opened = [];
  const action = handler('figAction', { richLockedRef: { current: true }, window: { open: (...args) => opened.push(args) }, sync() { assert.fail('read-only link attempted to save'); } });
  for (const url of ['https://example.org/document', 'javascript:alert(1)', '']) {
    const control = { getAttribute: () => 'open', closest: () => ({ getAttribute: () => url }) };
    action(event({ nodeType: 1, closest: selector => selector === '[data-act]' ? control : null }));
  }
  assert.deepEqual(opened, [['https://example.org/document', '_blank', 'noopener,noreferrer']]);
  const ordinary = event({ nodeType: 1, closest: () => null });
  action(ordinary);
  assert.equal(ordinary.prevented, false, 'native anchors and selecting text remain usable');
});

test('stale editor commands observe a newly applied lock before touching DOM or writing', () => {
  const richLockedRef = { current: false };
  const names = ['sync', 'setBlock', 'insertHr', 'sazec', 'sazecVratit', 'zarovnej', 'pickSlash', 'pickLink', 'vlozHlas', 'diktuj', 'openImage', 'onInput', 'onPaste'];
  const commands = names.map(name => [name, handler(name, { richLockedRef })]);
  const exec = handler('exec', { richLockedRef })(() => assert.fail('locked toolbar command executed'));
  richLockedRef.current = true;
  for (const [name, run] of commands) assert.doesNotThrow(() => run(event()), name);
  assert.doesNotThrow(() => exec(event()));
});

test('locking during image processing or upload cannot insert or save the late image', { timeout: 2000 }, async () => {
  for (const pauseAt of ['resize', 'upload']) {
    let release, entered, uploads = 0, inserts = 0, writes = 0;
    const pending = new Promise(resolve => { release = resolve; });
    const ready = new Promise(resolve => { entered = resolve; });
    const richLockedRef = { current: false };
    const insert = handler('insertImage', {
      richLockedRef, uid: () => 'synthetic',
      resizeImageToBlob: () => { if (pauseAt === 'resize') { entered(); return pending; } return Promise.resolve({}); },
      r2Put: () => { uploads++; if (pauseAt === 'upload') { entered(); return pending; } return Promise.resolve(); },
      ref: { current: { focus() {}, contains: () => false } }, imgRange: { current: null }, imgRef: { current: null },
      document: { execCommand() { inserts++; } }, figHtml: () => '', t: {}, sync() { writes++; },
    });
    const work = insert({ name: 'synthetic.png' });
    await ready;
    richLockedRef.current = true;
    release({});
    await work;
    assert.equal(inserts, 0, pauseAt);
    assert.equal(writes, 0, pauseAt);
    assert.equal(uploads, pauseAt === 'resize' ? 0 : 1);
  }
});

test('locked key handling retains native copy/navigation without invoking editing commands', () => {
  let found;
  function walk(node) {
    if (ts.isJsxAttribute(node) && node.name.getText(ast) === 'onKeyDown' && node.initializer?.expression) found = node.initializer.expression.getText(ast);
    ts.forEachChild(node, walk);
  }
  walk(findFunction('RichArea'));
  assert.ok(found);
  const run = vm.runInNewContext('(' + found + ')', { richLockedRef: { current: true } });
  const copy = { ...event(), key: 'c', ctrlKey: true };
  run(copy);
  assert.equal(copy.prevented, false);
});

test('selecting a note clears folder selection and keeps the selected note group consistent', () => {
  let activeFolder = 'Synthetic folder', selected = ['first'];
  const run = vm.runInNewContext('(' + initializer('FolderSheet', 'toggle') + ')', {
    setActiveFolder(value) { activeFolder = value; }, setSel(update) { selected = update(selected); },
  });
  run('second');
  assert.equal(activeFolder, null);
  assert.deepEqual(Array.from(selected), ['first', 'second']);
  run('second');
  assert.deepEqual(Array.from(selected), ['first']);
});
