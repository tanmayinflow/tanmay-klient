import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';

test('App JSX components retain declared or imported bindings after source cleanup',()=>{
  const src=readFileSync(new URL('../src/App.tsx',import.meta.url),'utf8');
  const ast=ts.createSourceFile('App.tsx',src,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
  const declared=new Set(),used=new Set();
  function binding(name){
    if(!name)return;
    if(ts.isIdentifier(name))declared.add(name.text);
    else if(ts.isObjectBindingPattern(name)||ts.isArrayBindingPattern(name))for(const part of name.elements)if(ts.isBindingElement(part))binding(part.name);
  }
  function visit(node){
    if(ts.isVariableDeclaration(node)||ts.isFunctionDeclaration(node)||ts.isClassDeclaration(node)||ts.isParameter(node)||ts.isImportSpecifier(node)||ts.isNamespaceImport(node)||ts.isImportClause(node)||ts.isBindingElement(node))binding(node.name);
    if(ts.isJsxOpeningElement(node)||ts.isJsxSelfClosingElement(node)){
      const root=node.tagName.getText(ast).split('.')[0];
      if(/^[A-Z]/.test(root))used.add(root);
    }
    ts.forEachChild(node,visit);
  }
  visit(ast);
  assert.deepEqual([...used].filter(name=>!declared.has(name)),[], 'Every component referenced from App needs a runtime binding');
});
