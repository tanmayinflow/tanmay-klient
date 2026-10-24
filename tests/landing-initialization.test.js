import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';

test('actual landing UI factory captures only initialized App dependencies',()=>{
 const text=readFileSync(new URL('../src/App.tsx',import.meta.url),'utf8');
 const ast=ts.createSourceFile('App.tsx',text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 const bindings=new Map(),calls=[];
 const bindPattern=(name,value)=>{if(ts.isIdentifier(name))bindings.set(name.text,value);else for(const part of name.elements||[])if(ts.isBindingElement(part))bindPattern(part.name,value);};
 for(const node of ast.statements){
  if(ts.isImportDeclaration(node)&&node.importClause){const clause=node.importClause;if(clause.name)bindings.set(clause.name.text,{kind:'import'});const named=clause.namedBindings;if(named){if(ts.isNamespaceImport(named))bindings.set(named.name.text,{kind:'import'});else for(const e of named.elements)bindings.set(e.name.text,{kind:'import'});}}
  if(ts.isFunctionDeclaration(node)&&node.name)bindings.set(node.name.text,{kind:'hoisted function'});
  if(ts.isVariableStatement(node))for(const decl of node.declarationList.declarations){bindPattern(decl.name,{kind:'variable',decl});if(decl.initializer&&ts.isCallExpression(decl.initializer)&&decl.initializer.expression.getText(ast)==='createLandingRecordingUI')calls.push(decl.initializer);}
 }
 assert.equal(calls.length,1,'One real top-level landing UI factory call');
 const call=calls[0],arg=call.arguments[0];assert.ok(ts.isObjectLiteralExpression(arg),'Actual dependency object must be statically explicit');
 const line=n=>ast.getLineAndCharacterOfPosition(n.getStart(ast)).line+1;
 const checkBinding=(name,label)=>{
  const binding=bindings.get(name);assert.ok(binding,'Known top-level binding for '+label+': '+name);
  if(binding.kind==='variable'){
   assert.ok(binding.decl.initializer,'Eager dependency '+label+' must have an initializer');
   assert.ok(binding.decl.end<call.getStart(ast),'Eager dependency '+label+' ('+name+') at line '+line(binding.decl)+' is captured before initialization by landing UI factory at line '+line(call));
  }
 };
 checkBinding('createLandingRecordingUI','factory');
 for(const prop of arg.properties){
  assert.ok(ts.isPropertyAssignment(prop)||ts.isShorthandPropertyAssignment(prop),'No opaque dependency spread');
  const value=ts.isShorthandPropertyAssignment(prop)?prop.name:prop.initializer,label=prop.name.getText(ast);
  if(ts.isIdentifier(value))checkBinding(value.text,label);
  else assert.ok(ts.isArrowFunction(value)||ts.isFunctionExpression(value)||value.kind===ts.SyntaxKind.TrueKeyword||value.kind===ts.SyntaxKind.FalseKeyword||value.kind===ts.SyntaxKind.NullKeyword||ts.isStringLiteral(value)||ts.isNumericLiteral(value),'Dependency '+label+' must be a known binding, literal, or explicit deferred function');
 }
});
