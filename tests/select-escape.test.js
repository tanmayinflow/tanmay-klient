import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import React from "react";

function fixture(value="legacy",options=[{v:"NEC",label:"Běžné výdaje"}]){
  const handlers={document:new Map(),window:new Map()};
  const surface=kind=>({addEventListener(name,fn){const set=handlers[kind].get(name)||new Set();set.add(fn);handlers[kind].set(name,set);},removeEventListener(name,fn){handlers[kind].get(name)?.delete(fn);}});
  const document={...surface("document"),body:{}},window={...surface("window"),innerWidth:402,innerHeight:874};
  let state=[],position=0,pending=[],cleanups=[],parentClosed=0;
  const changed=[];
  const refNode={getBoundingClientRect:()=>({left:10,right:300,top:200,bottom:244,width:290}),focus(){},contains(){return false;},querySelector(){return null;}};
  const effects=[];
  const effect=(fn,deps)=>{const i=position++;if(!effects[i]||deps.some((v,j)=>v!==effects[i].deps[j]))pending.push(()=>{effects[i]?.cleanup?.();effects[i]={deps,cleanup:fn()};});};
  const hooksReact={...React,useId:()=>"choice-test",useState(initial){const index=position++;if(!(index in state))state[index]=initial;return[state[index],value=>{state[index]=typeof value==="function"?value(state[index]):value;}];},useRef:()=>({current:refNode}),useEffect:effect,useLayoutEffect:effect};
  function load(file){
    const source=fs.readFileSync("src/shared/ui/"+file,"utf8"),module={exports:{}};
    const compiled=ts.transpileModule(source,{compilerOptions:{jsx:ts.JsxEmit.React,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
    vm.runInNewContext(compiled,{document,window,module,exports:module.exports,setTimeout,clearTimeout,require:id=>id==="react"?hooksReact:id==="react-dom"?{createPortal:node=>node}:{TmIcon:()=>null}});
    return module.exports;
  }
  const {ChoiceField:Select}=load("ChoiceField.jsx");
  const releaseParent=load("overlay.js").tmEscVrstva(()=>parentClosed++);
  let tree;
  function render(){for(let i=0;i<3;i++){position=0;pending=[];tree=Select({theme:{},L:cs=>cs,value,options,onChange:next=>changed.push(next)});pending.forEach(fn=>fn());}}
  render();
  const children=()=>React.Children.toArray(tree.props.children);
  return {changed,get parentClosed(){return parentClosed;},get expanded(){return children()[0].props["aria-expanded"];},get display(){return React.Children.toArray(children()[0].props.children)[0].props.children;},
    open(){children()[0].props.onClick();render();},
    key(key){const event={key,stopped:false,prevented:false,preventDefault(){this.prevented=true;},stopPropagation(){this.stopped=true;}};for(const fn of handlers.document.get("keydown")||[])fn(event);if(!event.stopped)for(const fn of handlers.window.get("keydown")||[])fn(event);render();return event;},
    choose(){const menu=children()[1];const list=React.Children.toArray(menu.props.children).find(x=>x.props.role==="listbox");React.Children.toArray(list.props.children)[0].props.onClick();render();},
    close(){effects.forEach(e=>e?.cleanup?.());releaseParent();},
  };
}

test("Escape closes the real open Select but preserves its enclosing overlay and draft",()=>{
  const f=fixture();f.open();assert.equal(f.expanded,true);
  const event=f.key("Escape");assert.equal(event.stopped,true);assert.equal(event.prevented,true);assert.equal(f.expanded,false);assert.equal(f.parentClosed,0);
  f.key("Escape");assert.equal(f.parentClosed,1,"Once the menu is closed Escape belongs to its parent again");f.close();
});

test("an open Select leaves unrelated keys untouched",()=>{
  const f=fixture();f.open();const event=f.key("Enter");assert.equal(event.stopped,false);assert.equal(event.prevented,false);assert.equal(f.expanded,true);assert.equal(f.parentClosed,0);f.close();
});

test("unknown existing values stay visible and unchanged until an option is explicitly chosen",()=>{
  const f=fixture("Původní kategorie");assert.equal(f.display,"Původní kategorie");f.open();f.key("Escape");assert.deepEqual(f.changed,[]);
  f.open();f.choose();assert.deepEqual(f.changed,["NEC"]);assert.equal(f.expanded,false);f.close();
});
