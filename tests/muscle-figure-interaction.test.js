import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import React from 'react';
import * as muscleMap from '../src/training/muscleMap.js';
import * as muscleRegions from '../src/shared/ui/muscleRegions.js';
import * as femaleRegions from '../src/shared/ui/femaleMuscleRegions.js';

const source = fs.readFileSync('src/shared/ui/muscles.jsx', 'utf8');
const compiled = ts.transpileModule(source, {compilerOptions:{jsx:ts.JsxEmit.React,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
const nodes = node => !node || typeof node !== 'object' ? [] : [node, ...React.Children.toArray(node.props?.children).flatMap(nodes)];
function figure(initial = {}) {
  const state = [], calls = []; let index, tree, profile = {accountKey:'synthetic',profile:{wording:'male'}}, props = initial;
  const hooks = {...React,useId:()=>'test-figure',useState:initial=>{const slot=index++;if(!(slot in state))state[slot]=typeof initial==='function'?initial():initial;return[state[slot],value=>{state[slot]=typeof value==='function'?value(state[slot]):value;}];}};
  const module={exports:{}};
  vm.runInNewContext(compiled,{module,exports:module.exports,require:id=>id==='react'?hooks:id.endsWith('muscleMap.js')?muscleMap:id.endsWith('femaleMuscleRegions.js')?femaleRegions:id.endsWith('muscleRegions.js')?muscleRegions:{usePersonalProfile:()=>profile}});
  const {TmSvalyFigura}=module.exports.createMuscleFig({useT:()=>({t:{mode:'light',bg:'#eee',textMuted:'#444'}}),L:cs=>cs});
  const render=()=>{index=0;tree=TmSvalyFigura({onToggleMuscle:key=>calls.push(['muscle',key]),onToggleRegion:key=>calls.push(['region',key]),...props});};render();
  return {calls,get all(){return nodes(tree);},get tree(){return tree;},set(next){props={...props,...next};render();},profile(wording){profile={...profile,profile:{wording}};render();},
    image(layer,event='onLoad'){const image=nodes(tree).find(node=>node.type==='image'&&node.props.href.includes(`-${layer}-`));assert.ok(image,layer);image.props[event]();render();},
    region(key){return nodes(tree).find(node=>node.props?.['data-body-area']===key);},muscle(key){return nodes(tree).find(node=>node.props?.['data-muscle']===key);},rerender:render,
  };
}

test('loading does not expose invisible muscle or body-area controls',()=>{
  const f=figure({highlightedMuscles:['che'],selectedRegions:['knees']});
  assert.equal(f.all.filter(node=>node.props?.role==='checkbox').length,0);
  assert.ok(f.all.find(node=>node.props?.role==='status'));
  f.image('original');assert.ok(f.muscle('che'));assert.ok(f.region('knees'));
});

test('a broad area highlights muscles without claiming that each muscle checkbox is checked',()=>{
  const f=figure({highlightedMuscles:['che'],selectedMuscles:[]});f.image('original');
  assert.equal(f.muscle('che').props['aria-checked'],false);assert.equal(f.muscle('che').props['data-role'],'primary');
  let prevented=false;f.muscle('che').props.onKeyDown({key:' ',preventDefault(){prevented=true;}});
  assert.equal(prevented,true);assert.deepEqual(f.calls,[['muscle','che']]);
  f.set({selectedMuscles:['che']});assert.equal(f.muscle('che').props['aria-checked'],true);
});

test('knees and feet are distinct accessible region controls, never fake muscle identities',()=>{
  const f=figure({selectedRegions:['knees']});f.image('original');
  assert.equal(f.region('knees').props['aria-checked'],true);assert.equal(f.region('feet').props['aria-checked'],false);
  assert.equal(f.region('knees').props['aria-label'],'Kolena');assert.equal(f.region('feet').props['aria-label'],'Chodidla');
  assert.equal(f.muscle('knees'),undefined);assert.equal(f.muscle('feet'),undefined);
  for(const key of ['knees','feet']){assert.equal(nodes(f.region(key)).filter(node=>node.type==='ellipse').length,4);f.region(key).props.onKeyDown({key:'Enter',preventDefault(){}});}
  assert.deepEqual(f.calls,[['region','knees'],['region','feet']]);
  f.region('feet').props.onFocus();f.rerender();assert.ok(nodes(f.region('feet')).filter(node=>node.type==='ellipse').every(node=>node.props.stroke!=='transparent'&&node.props.strokeWidth===3));
});

test('whole-body marks knee and foot areas without falsely checking individual choices',()=>{
  const f=figure({selectedRegions:['whole_body']});f.image('original');
  for(const key of ['knees','feet']){assert.equal(f.region(key).props['aria-checked'],false);assert.ok(nodes(f.region(key)).filter(node=>node.type==='ellipse').every(node=>node.props.stroke!=='transparent'));}
});

test('female markers use registered female landmarks and wait for the new figure',()=>{
  const f=figure({selectedRegions:['knees']});f.image('original');const male=nodes(f.region('knees')).find(node=>node.type==='ellipse').props.cy;
  f.profile('female');assert.equal(f.region('knees'),undefined);f.image('original');
  const female=nodes(f.region('knees')).find(node=>node.type==='ellipse').props.cy;assert.equal(male,978);assert.equal(female,1007);
});

test('a failed original keeps loading mask layers and a successful composite remains interactive',()=>{
  const f=figure();f.image('original','onError');assert.ok(f.all.find(node=>node.type==='svg'));assert.equal(f.region('knees'),undefined);
  f.image('ink');f.image('fill');assert.ok(f.region('knees'));assert.equal(f.all.filter(node=>node.props?.role==='status').length,0);
});

test('a failed mask uses the original while failure of both usable routes exposes only the textual fallback',()=>{
  const f=figure();f.image('ink','onError');f.image('original');assert.ok(f.region('knees'));
  const broken=figure();broken.image('original','onError');broken.image('fill','onError');
  assert.equal(broken.all.filter(node=>node.props?.role==='checkbox').length,0);assert.ok(broken.all.find(node=>node.props?.role==='status'));assert.equal(broken.all.filter(node=>node.type==='svg').length,0);
});

test('exercise detail remains a non-selectable anatomical display with no added area controls',()=>{
  const f=figure({mp:['qua'],onToggleMuscle:undefined,onToggleRegion:undefined});f.image('original');
  assert.equal(f.all.filter(node=>node.props?.role==='checkbox').length,0);assert.equal(f.region('knees'),undefined);
});
