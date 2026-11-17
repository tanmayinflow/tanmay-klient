import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';

const client = JSON.parse(readFileSync(new URL('../package.json', import.meta.url))).name !== 'tanmay-web';

test('custom exercise edit control remains usable while global structure editing is unlocked', {skip:!client}, () => {
  const source = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
  const file = ts.createSourceFile('App.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const declaration = file.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === 'TEditToggle');
  assert.ok(declaration, 'the real Client edit control must exist');
  const compiled = ts.transpileModule(declaration.getText(file), {compilerOptions:{jsx:ts.JsxEmit.React}}).outputText;
  let editMode = false, clicks = 0;
  const React = {createElement:(tag, props, ...children)=>({tag, props, children})};
  const Toggle = new Function('React','useT','useStore','L','FONT_TAG', compiled+';return TEditToggle;')(
    React, ()=>({t:{}}), ()=>({editMode}), cs=>cs, 'sans-serif');
  const props = {on:false, onToggle:()=>{clicks++;}, title:'Upravit cvik', always:true};
  for (editMode of [false, true]) {
    const button = Toggle(props);
    assert.equal(button.tag, 'button');
    assert.equal(button.props.title, 'Upravit cvik');
    button.props.onClick();
  }
  assert.equal(clicks, 2);
  assert.equal(Toggle({...props, always:false}), null, 'ordinary inline editors remain covered by global editing');
});
