import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';

const inApp = fs.existsSync(new URL('../src/training/exerciseLibrary.js', import.meta.url));
const training = inApp ? '../src/training/' : '../training/';
const modules = {};
for (const name of ['exerciseLibrary','exerciseTaxonomy','exerciseEquipment','exerciseBodySelection']) modules[name+'.js'] = await import(training + name + '.js');
const {resolveMuscleMap} = await import(training + 'muscleMap.js');
const require = createRequire(inApp ? import.meta.url : new URL('../../../Source/tanmay-web/package.json',import.meta.url));
const React = require('react'), ts = require('typescript');
const {renderToStaticMarkup} = require('react-dom/server');
const uiFile = fileURLToPath(new URL(inApp ? '../src/shared/ui/exerciseLibrary.jsx' : '../ui/exerciseLibrary.jsx',import.meta.url));
const theme = {text:'#222',heading:'#111',textMuted:'#666',textSec:'#444',border:'#bbb',borderSoft:'#ddd',accent:'#843',activeNav:'#eed'};

function loadUi(react = React) {
  const cache = new Map();
  function load(file) {
    const full = path.resolve(file);
    if (cache.has(full)) return cache.get(full);
    const code = ts.transpileModule(fs.readFileSync(full,'utf8'),{compilerOptions:{jsx:ts.JsxEmit.React,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
    const module = {exports:{}}; cache.set(full,module.exports);
    new vm.Script(`(function(require,module,exports){${code}\n})`,{filename:full}).runInThisContext()(
      id => id === 'react' ? react : id.startsWith('../../training/') && modules[path.basename(id)] ? modules[path.basename(id)] : id.startsWith('.') ? load(path.resolve(path.dirname(full),id)) : require(id),module,module.exports);
    return module.exports;
  }
  load(path.resolve(path.dirname(uiFile),'../lang/lang.js')).setLang('cs');
  return load(uiFile);
}
function elements(tree) {
  if (Array.isArray(tree)) return tree.flatMap(elements);
  return React.isValidElement(tree) ? [tree,...elements(tree.props.children)] : [];
}
function find(tree,predicate) { const node=elements(tree).find(predicate); assert.ok(node,'Expected rendered control'); return node; }
const named = (tree,name) => find(tree,node=>node.props['aria-label']===name);

test('movement examples compose through named choices, stay decorative, and follow chip removal',()=>{
  const slots=[];let cursor=0;
  const react={...React,useState(value){const i=cursor++;if(!(i in slots))slots[i]=value;return[slots[i],next=>{slots[i]=typeof next==='function'?next(slots[i]):next;}];},useRef(value){return slots[cursor++]||={current:value};},useEffect(){},useId(){return 'example-'+cursor++;}};
  const ui=loadUi(react);
  const props={t:theme,count:3,filters:modules['exerciseLibrary.js'].createExerciseFilters(),onChange(next){props.filters=next;},renderMovementIllustration:movement=>React.createElement('img',{src:`/${movement}.webp`,alt:''})};
  const render=()=>{cursor=0;return ui.ExerciseLibraryFilters(props);};
  find(render(),node=>node.type==='button'&&node.props.children[0]==='Pohyb').props.onClick();
  const choose=label=>{const facet=find(render(),node=>node.props.field?.key==='movements');named(facet.type(facet.props),label).props.onClick();};
  choose('Pohyb: Dřepy a vstávání');choose('Pohyb: Předklon v kyčlích');
  let tree=render();
  let gallery=find(tree,node=>node.props['data-movement-illustrations']==='');
  assert.equal(gallery.props['aria-hidden'],'true');
  assert.deepEqual(elements(gallery).filter(node=>node.type==='figure').map(node=>node.props['data-movement-example']),['squat','hinge']);
  assert.equal(elements(gallery).some(node=>node.type==='button'||node.props.onClick||node.props.tabIndex!==undefined),false);
  const active=named(tree,'Odebrat filtr: Dřepy a vstávání');
  assert.equal(active.type,'button');active.props.onClick();
  gallery=find(render(),node=>node.props['data-movement-illustrations']==='');
  assert.deepEqual(elements(gallery).filter(node=>node.type==='figure').map(node=>node.props['data-movement-example']),['hinge']);
  assert.deepEqual(props.filters.movements,['hinge']);
  choose('Pohyb: Předklon v kyčlích');
  assert.equal(elements(render()).some(node=>node.props['data-movement-illustrations']===''),false);
});

test('exercise browsing has no deletion action; editing retains explicit trash without list frame',()=>{
  const appFile=fileURLToPath(new URL(inApp?'../src/App.tsx':'../../../Source/tanmay-web/src/App.tsx',import.meta.url));
  const source=fs.readFileSync(appFile,'utf8');
  const ast=ts.createSourceFile(appFile,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
  const declaration=ast.statements.find(node=>ts.isFunctionDeclaration(node)&&node.name?.text==='TExCard');
  assert.ok(declaration);
  const code=ts.transpileModule(declaration.getText(ast),{compilerOptions:{jsx:ts.JsxEmit.React,target:ts.ScriptTarget.ES2022}}).outputText;
  const ui=loadUi();const store={editMode:false};const Empty=()=>null;
  const scope={React,useState:React.useState,useT:()=>({t:theme}),useStore:()=>store,useHoldReorder(){},tExName:row=>row.cz,tMetaOf:()=>({}),resolveMuscleMap,T_MUS:{bic:{cz:'Biceps',en:'Biceps'}},L:cs=>cs,LANG:'cs',ExerciseLibraryRowContent:ui.ExerciseLibraryRowContent,ExerciseTaxonomySummary:ui.ExerciseTaxonomySummary,exerciseTaxonomy:modules['exerciseTaxonomy.js'].exerciseTaxonomy,TExArt:()=>React.createElement('img',{src:'/current.webp',alt:''}),TExLibraryContext:Empty,TDemandDots:Empty,TExShelf:Empty,tLvlOf:()=>1,tIsCatalog:()=>false,tIsArchived:()=>false,tStatusOf:()=>'active',FONT_DISPLAY:'serif',FONT_BODY:'sans-serif',Check:Empty,tDelBtn:()=>({}),FamilyIcon:Empty};
  const component=new vm.Script(`(function(${Object.keys(scope).join(',')}){${code}\nreturn TExCard;})`).runInThisContext()(...Object.values(scope));
  const ex={id:'same-id',cz:'Bicepsový zdvih',mp:['bic']};
  const render=view=>renderToStaticMarkup(React.createElement(component,{ex,view,onOpen(){},onDelete(){}}));
  for(const view of ['grid','list']){
    store.editMode=false;const html=render(view);assert.doesNotMatch(html,/Do koše|Přesunout do koše/);assert.equal((html.match(/<button\b/g)||[]).length,1);
    store.editMode=true;const edit=render(view);assert.match(edit,/aria-label="Přesunout do koše: Bicepsový zdvih"/);assert.equal((edit.match(/<button\b/g)||[]).length,2);
  }
  store.editMode=false;const list=render('list');
  const button=list.match(/<button\b[^>]+>/)[0];
  assert.match(button,/border:none/);assert.match(button,/border-radius:0/);assert.match(button,/padding-right:0/);
  assert.match(list,/data-exercise-round-image=""/);assert.match(list,/border-bottom:1px solid #ddd/);
});

test('leaving edit mode clears hidden exercise selection without resetting ordinary selection on rerenders',context=>{
  const appFile=fileURLToPath(new URL(inApp?'../src/App.tsx':'../../../Source/tanmay-web/src/App.tsx',import.meta.url));
  const ast=ts.createSourceFile(appFile,fs.readFileSync(appFile,'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
  const page=ast.statements.find(node=>ts.isFunctionDeclaration(node)&&node.name?.text==='PageTrenink');
  assert.ok(page);
  const statements=page.body.statements;
  const declarations=statements.filter(node=>ts.isVariableStatement(node)&&node.declarationList.declarations.some(decl=>['[selecting, setSelecting]','[sel, setSel]','toggleSel','exitSel'].includes(decl.name.getText(ast))));
  if(declarations.length===0){context.skip('Client library has no bulk exercise deletion selection');return;}
  assert.equal(declarations.length,4);
  const effect=statements.find(node=>ts.isExpressionStatement(node)&&ts.isCallExpression(node.expression)&&node.expression.expression.getText(ast)==='React.useEffect'&&node.expression.arguments[1]?.getText(ast)==='[st.editMode]'&&node.getText(ast).includes('setSelecting'));
  assert.ok(effect,'Leaving edit mode must reset hidden selection');
  const selectedNodes=[...declarations,effect].sort((a,b)=>a.pos-b.pos);
  const code=selectedNodes.map(node=>node.getText(ast)).join('\n');
  const slots=[];let cursor=0,priorDeps,pending;
  const useState=initial=>{const i=cursor++;if(!(i in slots))slots[i]=initial;return[slots[i],next=>{slots[i]=typeof next==='function'?next(slots[i]):next;}];};
  const hooks={useEffect(callback,deps){if(!priorDeps||deps.some((value,i)=>value!==priorDeps[i])){pending=callback;priorDeps=[...deps];}}};
  const renderFn=new vm.Script(`(function(React,useState,st){${code}\nreturn {selecting,sel,setSelecting,toggleSel};})`).runInThisContext();
  const store={editMode:false};
  function render(){cursor=0;let result=renderFn(hooks,useState,store);if(pending){const callback=pending;pending=null;callback();cursor=0;result=renderFn(hooks,useState,store);}return result;}
  render();store.editMode=true;
  let state=render();state.setSelecting(true);state.toggleSel('exercise-a');state.toggleSel('exercise-b');
  state=render();assert.equal(state.selecting,true);assert.deepEqual([...state.sel],['exercise-a','exercise-b']);
  state=render();assert.deepEqual([...state.sel],['exercise-a','exercise-b'],'ordinary rerenders preserve selection');
  store.editMode=false;state=render();assert.equal(state.selecting,false);assert.deepEqual([...state.sel],[]);
  store.editMode=true;state=render();assert.equal(state.selecting,false);assert.deepEqual([...state.sel],[],'old hidden selection never returns');
  store.editMode=false;state=render();state.setSelecting(true);state.toggleSel('workout-a');
  state=render();assert.equal(state.selecting,true);assert.deepEqual([...state.sel],['workout-a'],'selection in an unrelated normal library view remains usable');
});
