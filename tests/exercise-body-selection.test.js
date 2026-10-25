import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';

// The same test runs from canonical repo-tests and from either synced app.
const inApp = fs.existsSync(new URL('../src/training/exerciseLibrary.js', import.meta.url));
const training = inApp ? '../src/training/' : '../training/';
const library = await import(training + 'exerciseLibrary.js');
const taxonomy = await import(training + 'exerciseTaxonomy.js');
const equipment = await import(training + 'exerciseEquipment.js');
const bodySelection = await import(training + 'exerciseBodySelection.js');
const {resolveMuscleMap} = await import(training + 'muscleMap.js');
const {buildExerciseIndex, createExerciseFilters, selectExerciseLibrary} = library;
const {highlightedBodyMuscles, selectBodyRegions, selectBodyMuscles, toggleBodyMuscle} = bodySelection;
const require = createRequire(inApp ? import.meta.url : new URL('../../../Source/tanmay-web/package.json', import.meta.url));
const React = require('react');
const {renderToStaticMarkup} = require('react-dom/server');
const ts = require('typescript');
const uiFile = fileURLToPath(new URL(inApp ? '../src/shared/ui/exerciseLibrary.jsx' : '../ui/exerciseLibrary.jsx', import.meta.url));
const actualTraining = new Map(Object.entries({exerciseLibrary:library, exerciseTaxonomy:taxonomy, exerciseEquipment:equipment, exerciseBodySelection:bodySelection}).map(([name,module]) => [name + '.js',module]));

function loadUi(react = React) {
  const cache = new Map();
  function load(file) {
    const full = path.resolve(file);
    if (cache.has(full)) return cache.get(full);
    const source = fs.readFileSync(full,'utf8');
    const code = ts.transpileModule(source,{compilerOptions:{jsx:ts.JsxEmit.React,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
    const module = {exports:{}};
    cache.set(full,module.exports);
    new vm.Script(`(function(require,module,exports){${code}\n})`,{filename:full}).runInThisContext()(
      id => {
        if (id === 'react') return react;
        if (id.startsWith('../../training/') && actualTraining.has(path.basename(id))) return actualTraining.get(path.basename(id));
        return id.startsWith('.') ? load(path.resolve(path.dirname(full),id)) : require(id);
      },module,module.exports);
    return module.exports;
  }
  return {ui:load(uiFile),setLang:load(path.resolve(path.dirname(uiFile),'../lang/lang.js')).setLang};
}

const ids = filters => selectExerciseLibrary(index,filters).rows.map(row => row.id).sort();
const example = (id,mp,ms = [],extra = {}) => ({id,cz:id,mp,ms,eq:['telo'],S:1,C:1,taxonomy:{movements:['joint'],focus:['strength'],positions:['standing'],supports:['unsupported']},...extra});
const rows = [
  example('arm-biceps',['bic']), example('arm-triceps',['tri']),
  example('back-lat',['lat'],['bic']), example('back-upper',['upb'],['lat']),
  example('hip',['glu'],['ham']), example('thigh-front',['qua'],['glu']),
  example('thigh-back',['ham']), example('thigh-inner',['add']),
  example('secondary-arms',['che'],['tri']),
  example('archived-biceps',['bic'],[],{status:'archived'}),
];
const index = buildExerciseIndex(rows,{musclesOf:resolveMuscleMap});
const completeFilters = extra => ({...createExerciseFilters(),...extra});
function freeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) { Object.values(value).forEach(freeze); Object.freeze(value); }
  return value;
}

test('area selection clears precise muscles and returns the whole requested area', () => {
  const before = freeze(completeFilters({muscles:['bic'],movements:['joint'],equipment:['telo'],focus:['strength'],positions:['standing'],supports:['unsupported'],levels:[1],q:'arm',includeArchived:true}));
  const next = selectBodyRegions(before,['arms']);
  assert.deepEqual(next,{...before,regions:['arms'],muscles:[]});
  assert.deepEqual(ids(next),['arm-biceps','arm-triceps']);
  assert.deepEqual(before.muscles,['bic']);
  assert.deepEqual(before.regions,[]);
});

test('a figure muscle tap replaces an incompatible broad area and can be toggled off', () => {
  const before = freeze(completeFilters({regions:['thighs'],q:'back',movements:['joint'],equipment:['telo']}));
  const selected = toggleBodyMuscle(before,'lat');
  assert.deepEqual(selected,{...before,regions:[],muscles:['lat']});
  assert.deepEqual(ids(selected),['back-lat']);
  const cleared = toggleBodyMuscle(selected,'lat');
  assert.deepEqual(cleared,{...before,regions:[],muscles:[]});
  assert.deepEqual(ids(cleared),['back-lat','back-upper','thigh-back']);
  assert.strictEqual(toggleBodyMuscle(before,'not-a-muscle'),before);
  assert.strictEqual(toggleBodyMuscle(before,'__proto__'),before);
});

test('specific muscle choices stay exact, combine with OR, and do not expand to their whole area', () => {
  let filters = selectBodyMuscles(completeFilters({regions:['arms']}),['lat']);
  assert.deepEqual(ids(filters),['back-lat']);
  filters = toggleBodyMuscle(filters,'qua');
  assert.deepEqual(ids(filters),['back-lat','thigh-front']);
  filters = toggleBodyMuscle(filters,'lat');
  assert.deepEqual(ids(filters),['thigh-front']);
  assert.deepEqual(ids(selectBodyRegions(filters,['thighs'])),['thigh-back','thigh-front','thigh-inner']);
});

test('primary and secondary involvement remain distinct through area and muscle transitions', () => {
  const primary = selectBodyMuscles(createExerciseFilters(),['bic']);
  assert.deepEqual(ids(primary),['arm-biceps']);
  const secondary = {...primary,includeSecondary:true};
  assert.deepEqual(ids(secondary),['arm-biceps','back-lat']);
  const area = selectBodyRegions(secondary,['arms']);
  assert.equal(area.includeSecondary,true);
  assert.deepEqual(ids(area),['arm-biceps','arm-triceps','back-lat','secondary-arms']);
  assert.deepEqual(ids({...area,includeSecondary:false}),['arm-biceps','arm-triceps']);
  assert.deepEqual(ids(toggleBodyMuscle(area,'lat')),['back-lat','back-upper']);
  assert.equal(selectExerciseLibrary(index,primary).hiddenCount,1);
  assert.deepEqual(ids({...primary,includeArchived:true}),['archived-biceps','arm-biceps']);
});

test('body changes preserve complete equipment requirements and every independent filter', () => {
  const data = buildExerciseIndex([
    example('pair',['bic'],[],{taxonomy:{movements:['joint'],equipmentRequirements:[['dumbbell_pair'],['lavice']]}}),
    example('single',['bic'],[],{taxonomy:{movements:['joint'],equipmentRequirements:[['dumbbell']]}}),
    example('wrong-muscle',['tri'],[],{taxonomy:{movements:['joint'],equipmentRequirements:[['dumbbell']]}}),
  ],{musclesOf:resolveMuscleMap});
  const before = freeze(completeFilters({regions:['thighs'],equipmentMode:'available',equipment:['dumbbell'],movements:['joint'],includeSecondary:true,includeArchived:true}));
  const next = selectBodyMuscles(before,['bic']);
  assert.deepEqual(next,{...before,regions:[],muscles:['bic']});
  assert.deepEqual(selectExerciseLibrary(data,next).rows.map(row => row.id),['single']);
  assert.deepEqual(selectExerciseLibrary(data,{...next,equipment:['dumbbell_pair','lavice']}).rows.map(row => row.id).sort(),['pair','single']);
});

test('figure highlights represent precise selection or broad regions without changing the filters', () => {
  const precise = freeze(completeFilters({muscles:['bic']}));
  assert.deepEqual(highlightedBodyMuscles(precise),['bic']);
  assert.deepEqual(highlightedBodyMuscles(completeFilters({regions:['thighs','chest']})).sort(),['add','che','ham','qua']);
  assert.deepEqual(highlightedBodyMuscles(completeFilters({regions:['whole_body']})).sort(),Object.keys(taxonomy.EXERCISE_REGION_BY_MUSCLE).sort());
  assert.deepEqual(highlightedBodyMuscles(completeFilters({regions:['knees','feet','unknown']})),[]);
  assert.deepEqual(precise.muscles,['bic']);
});

const theme = {text:'#222',heading:'#111',textMuted:'#666',textSec:'#444',border:'#bbb',borderSoft:'#ddd',accent:'#843',activeNav:'#eed',mode:'light'};
const {ui:staticUi,setLang} = loadUi();
test('toolbar has named touch controls, accurate current mode and optional search in both languages', () => {
  for (const language of ['cs','en']) {
    setLang(language);
    for (const view of ['grid','list']) {
      const html = renderToStaticMarkup(React.createElement(staticUi.ExerciseLibraryFilters,{t:theme,filters:createExerciseFilters(),onChange(){},onSort(){},onViewChange(){},count:10,view}));
      assert.doesNotMatch(html,/<input[^>]+type="search"/);
      const labels = language === 'cs' ? ['Hledat cvik','Řazení cviků','Karty cviků','Cviky v řádcích'] : ['Search exercises','Exercise order','Exercise cards','Exercise list'];
      for (const label of labels) assert.ok(html.includes(`aria-label="${label}"`),label);
      const buttons = [...html.matchAll(/<button\b[^>]*>/g)].map(match => match[0]);
      const cards = buttons.find(button => button.includes(`aria-label="${labels[2]}"`));
      const list = buttons.find(button => button.includes(`aria-label="${labels[3]}"`));
      assert.ok(cards.includes(`aria-pressed="${view === 'grid'}"`));
      assert.ok(list.includes(`aria-pressed="${view === 'list'}"`));
      for (const button of [cards,list]) { assert.ok(button.includes('width:44px')); assert.ok(button.includes('min-height:44px')); }
      assert.ok(html.includes('role="status" aria-live="polite"'));
    }
    const html = renderToStaticMarkup(React.createElement(staticUi.ExerciseLibraryFilters,{t:theme,filters:completeFilters({q:'šikmý'}),onChange(){},count:2}));
    assert.match(html,/<input[^>]+type="search"[^>]+value="šikmý"/);
  }
  setLang('cs');
});

test('row content keeps the illustration decorative, both text lines readable and long titles intact', () => {
  const title = 'Výstup s jednoručkami na pevnou bednu – kontrolovaný sestup';
  const focus = 'Hýždě · Přední strana stehen';
  const html = renderToStaticMarkup(React.createElement(staticUi.ExerciseLibraryRowContent,{t:theme,title,focus,illustration:React.createElement('svg',{'data-test-art':'step'})}));
  assert.ok(html.includes(`title="${title}"`));
  assert.ok(html.includes(`title="${focus}"`));
  assert.match(html,/data-exercise-round-image="" aria-hidden="true"/);
  assert.ok(html.includes('border-radius:50%'));
  assert.ok(html.includes('data-test-art="step"'));
  assert.equal((html.match(/white-space:nowrap/g) || []).length,2);
  assert.equal((html.match(/text-overflow:ellipsis/g) || []).length,2);
  assert.doesNotMatch(html,/<button|<a\b/);
  const fallback = renderToStaticMarkup(React.createElement(staticUi.ExerciseLibraryRowContent,{t:theme,title,illustration:null}));
  assert.ok(fallback.includes('Zaměření zatím neurčeno'));
});

test('the integrated app renders the same exercise as a card or a row without losing its identity', () => {
  const appFile = fileURLToPath(new URL(inApp ? '../src/App.tsx' : '../../../Source/tanmay-web/src/App.tsx',import.meta.url));
  const source = fs.readFileSync(appFile,'utf8');
  const ast = ts.createSourceFile(appFile,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
  const declarations = ast.statements.filter(node => ts.isFunctionDeclaration(node) && node.name?.text === 'TExCard');
  assert.equal(declarations.length,1);
  // Only this component is evaluated; never execute the App or its private seed.
  const code = ts.transpileModule(declarations[0].getText(ast),{compilerOptions:{jsx:ts.JsxEmit.React,target:ts.ScriptTarget.ES2022}}).outputText;
  const Empty = () => null;
  const scope = {
    React,useState:React.useState,useT:() => ({t:theme}),useStore:() => ({}),useHoldReorder(){},
    tExName:row => row.cz,tMetaOf:() => ({}),resolveMuscleMap,T_MUS:{bic:{cz:'Biceps',en:'Biceps'}},L:cs => cs,LANG:'cs',
    ExerciseLibraryRowContent:staticUi.ExerciseLibraryRowContent,ExerciseTaxonomySummary:staticUi.ExerciseTaxonomySummary,
    exerciseTaxonomy:taxonomy.exerciseTaxonomy,TExArt:({ex}) => React.createElement('svg',{'data-test-exercise-art':ex.id}),
    TExLibraryContext:Empty,TDemandDots:Empty,TExShelf:Empty,tLvlOf:() => 1,
    tIsCatalog:() => false,tIsArchived:() => false,tStatusOf:() => 'active',FONT_DISPLAY:'serif',FONT_BODY:'sans-serif',
    Check:({done}) => React.createElement('span',{'data-test-selected':String(done)}),
    tDelBtn:() => ({}),FamilyIcon:Empty,
  };
  const component = new vm.Script(`(function(${Object.keys(scope).join(',')}){${code}\nreturn TExCard;})`).runInThisContext()(...Object.values(scope));
  const exercise = example('one-stable-id',['bic'],[],{cz:'Bicepsový zdvih'});
  const render = view => renderToStaticMarkup(React.createElement(component,{ex:exercise,view,selecting:true,selected:true,onOpen(){},onToggleSel(){}}));
  const card = render('grid'), row = render('list');
  for (const html of [card,row]) {
    assert.ok(html.includes('data-tex="one-stable-id"'));
    assert.ok(html.includes('data-test-exercise-art="one-stable-id"'));
    assert.ok(html.includes('Bicepsový zdvih'));
    assert.ok(html.includes('data-test-selected="true"'));
    assert.equal((html.match(/<button\b/g) || []).length,1);
  }
  assert.ok(card.includes('class="tm-exercise-card"'));
  assert.ok(card.includes('tm-exercise-card-copy'));
  assert.ok(row.includes('class="tm-exercise-row"'));
  assert.ok(row.includes('data-exercise-round-image'));
  assert.doesNotMatch(row,/tm-exercise-card-copy/);
});

// Exercise the actual component callbacks. A small hook host avoids a DOM
// dependency; the browser suite remains responsible for geometry and focus.
function filterHost(initial) {
  const slots = []; let cursor = 0;
  const react = {...React,
    useState(value) { const i = cursor++; if (!(i in slots)) slots[i] = typeof value === 'function' ? value() : value; return [slots[i],next => { slots[i] = typeof next === 'function' ? next(slots[i]) : next; }]; },
    useRef(value) { const i = cursor++; return slots[i] ||= {current:value}; },
    useEffect() {},
    useId() { const i = cursor++; return slots[i] ||= 'exercise-test-' + i; },
  };
  const {ui,setLang:language} = loadUi(react); language('cs');
  const props = {t:theme,count:10,onChange(next) { props.filters = next; },...initial};
  return {props,render() { cursor = 0; return ui.ExerciseLibraryFilters(props); }};
}
function elements(tree) {
  if (Array.isArray(tree)) return tree.flatMap(elements);
  if (!React.isValidElement(tree)) return [];
  return [tree,...elements(tree.props.children)];
}
function find(tree,predicate) {
  const element = elements(tree).find(predicate);
  assert.ok(element,'Expected element was rendered');
  return element;
}
const named = (tree,label) => find(tree,node => node.props['aria-label'] === label);
const textButton = (tree,text) => find(tree,node => node.type === 'button' && (Array.isArray(node.props.children) ? node.props.children[0] : node.props.children) === text);

test('actual body-map and named-area callbacks replace each other, keeping search and equipment', () => {
  let map;
  const host = filterHost({filters:completeFilters({regions:['thighs'],q:'arm',equipment:['telo']}),renderBodyMap(props) { map = props; return null; }});
  textButton(host.render(),'Oblast těla').props.onClick();
  let tree = host.render();
  assert.deepEqual(map.selectedMuscles,[]);
  assert.deepEqual(map.selectedRegions,['thighs']);
  map.onToggleMuscle('bic');
  assert.deepEqual(host.props.filters,completeFilters({muscles:['bic'],q:'arm',equipment:['telo']}));
  assert.deepEqual(ids(host.props.filters),['arm-biceps']);
  tree = host.render();
  const area = find(tree,node => node.props.field?.key === 'regions');
  named(area.type(area.props),'Oblast těla: Paže').props.onClick();
  assert.deepEqual(host.props.filters,completeFilters({regions:['arms'],q:'arm',equipment:['telo']}));
  assert.deepEqual(ids(host.props.filters),['arm-biceps','arm-triceps']);
  tree = host.render();
  const muscle = find(tree,node => node.props.field?.key === 'muscles');
  muscle.props.onChange(['tri']);
  assert.deepEqual(host.props.filters,completeFilters({muscles:['tri'],q:'arm',equipment:['telo']}));
  host.render();
  map.onToggleRegion('knees');
  assert.deepEqual(host.props.filters,completeFilters({regions:['knees'],q:'arm',equipment:['telo']}));
});

test('actual search and view callbacks preserve filters, and clearing body chips affects only that axis', () => {
  const viewChanges = [];
  const host = filterHost({filters:completeFilters({muscles:['bic'],equipment:['telo']}),muscleOptions:[{v:'bic',label:'Biceps'}],onViewChange:view => viewChanges.push(view)});
  let tree = host.render();
  named(tree,'Cviky v řádcích').props.onClick();
  assert.deepEqual(viewChanges,['list']);
  assert.deepEqual(host.props.filters.muscles,['bic']);
  named(tree,'Hledat cvik').props.onClick();
  tree = host.render();
  named(tree,'Hledat cvik nebo jiný název').props.onChange({target:{value:'arm'}});
  tree = host.render();
  named(tree,'Hledat cvik nebo jiný název').props.onKeyDown({key:'Escape',stopPropagation(){}});
  tree = host.render();
  assert.equal(elements(tree).some(node => node.type === 'input' && node.props.type === 'search'),false);
  assert.equal(host.props.filters.q,'arm');
  named(tree,'Odebrat filtr: Biceps').props.onClick();
  assert.deepEqual(host.props.filters,completeFilters({q:'arm',equipment:['telo']}));
  named(host.render(),'Hledat cvik').props.onClick();
  named(host.render(),'Zavřít a vyčistit hledání').props.onClick();
  assert.deepEqual(host.props.filters,completeFilters({equipment:['telo']}));
});
