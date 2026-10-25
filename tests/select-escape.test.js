import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import React from "react";

function fixture(value="legacy",options=[{v:"NEC",label:"Běžné výdaje"}]){
  const handlers={document:new Map(),window:new Map()};
  const surface=kind=>({addEventListener(name,fn){const set=handlers[kind].get(name)||new Set();set.add(fn);handlers[kind].set(name,set);},removeEventListener(name,fn){handlers[kind].get(name)?.delete(fn);}});
  const document=surface("document"),window=surface("window");
  let state=[],position=0,pending=[],cleanups=[],parentClosed=0;
  const changed=[];
  const hooksReact={...React,useState(initial){const index=position++;if(!(index in state))state[index]=initial;return[state[index],value=>{state[index]=typeof value==="function"?value(state[index]):value;}];},useRef:()=>({current:null}),useEffect:fn=>pending.push(fn)};
  function load(file){
    const source=fs.readFileSync("src/shared/ui/"+file,"utf8"),module={exports:{}};
    const compiled=ts.transpileModule(source,{compilerOptions:{jsx:ts.JsxEmit.React,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
    vm.runInNewContext(compiled,{document,window,module,exports:module.exports,setTimeout,clearTimeout,require:id=>id==="react"?hooksReact:{TmIcon:()=>null}});
    return module.exports;
  }
  const {Select}=load("atoms.jsx").createAtoms({useT:()=>({t:{}}),L:cs=>cs});
  const releaseParent=load("overlay.js").tmEscVrstva(()=>parentClosed++);
  let tree;
  function render(){position=0;pending=[];tree=Select({value,options,onChange:next=>changed.push(next)});cleanups.forEach(fn=>fn?.());cleanups=pending.map(fn=>fn());}
  render();
  const children=()=>React.Children.toArray(tree.props.children);
  return {changed,get parentClosed(){return parentClosed;},get expanded(){return children()[0].props["aria-expanded"];},get display(){return React.Children.toArray(children()[0].props.children)[0].props.children;},
    open(){children()[0].props.onClick();render();},
    key(key){const event={key,stopped:false,prevented:false,preventDefault(){this.prevented=true;},stopPropagation(){this.stopped=true;}};for(const fn of handlers.document.get("keydown")||[])fn(event);if(!event.stopped)for(const fn of handlers.window.get("keydown")||[])fn(event);render();return event;},
    choose(){const menu=children()[1];React.Children.toArray(menu.props.children)[0].props.onClick();render();},
    close(){cleanups.forEach(fn=>fn?.());releaseParent();},
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
