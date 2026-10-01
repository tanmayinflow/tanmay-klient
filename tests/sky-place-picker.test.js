import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import React from "react";
import * as geocoding from "../src/shared/product/skyGeocoding.js";

const source=fs.readFileSync("src/shared/ui/skyPlacePicker.jsx","utf8");
const compiled=ts.transpileModule(source,{compilerOptions:{jsx:ts.JsxEmit.React,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
const saved={name:"Praha",latitude:50.0755,longitude:14.4378,timeZone:"Europe/Prague"};
const nodes=node=>!node||typeof node!=="object"?[]:[node,...React.Children.toArray(node.props?.children).flatMap(nodes)];

// Exercise the component's real event handlers and hook state. Network effects
// are intentionally excluded: this regression concerns an unconfirmed draft.
function picker(){
  const hooks=[],changes=[];let position=0,pending=false,tree;
  const hooksReact={...React,useId:()=>":place-test:",useEffect:()=>{},
    useRef:initial=>{const index=position++;return hooks[index]??={current:initial};},
    useState:initial=>{const index=position++;if(!(index in hooks))hooks[index]=typeof initial==="function"?initial():initial;return [hooks[index],value=>{hooks[index]=typeof value==="function"?value(hooks[index]):value;}];},
  };
  const module={exports:{}};
  vm.runInNewContext(compiled,{module,exports:module.exports,require:id=>id==="react"?hooksReact:geocoding,AbortController});
  const render=()=>{position=0;tree=module.exports.SkyPlacePicker({value:saved,label:"Place",lang:"en",onChange:value=>changes.push(value),onPending:value=>{pending=value;}});};
  const input=key=>nodes(tree).filter(node=>node.type==="input").find(node=>key==="query"?node.props.type==="search":key==="timeZone"?node.props.list==="sky-time-zones":node.props.min===(key==="latitude"?"-90":"-180"));
  render();
  return {
    edit(key,value){input(key).props.onChange({target:{value}});render();},
    confirm(){nodes(tree).find(node=>node.type==="button"&&node.props.children==="Use these coordinates").props.onClick();render();},
    get value(){return {latitude:input("latitude").props.value,longitude:input("longitude").props.value,timeZone:input("timeZone").props.value};},
    get message(){return nodes(tree).find(node=>node.props?.role==="status").props.children;},
    get pending(){return pending;},changes,
  };
}

test("restoring the saved place name keeps every unconfirmed manual change pending",()=>{
  for(const [field,value] of [["latitude","49"],["longitude","15"],["timeZone","Europe/London"]]){
    const form=picker();form.edit(field,value);form.edit("query","Prahax");form.edit("query","Praha");
    assert.equal(form.pending,true,field);assert.equal(form.value[field],value,field);
    assert.equal(form.message,"Check the coordinates and time zone, then confirm the place.");
    assert.equal(form.changes.length,0);
    form.confirm();assert.equal(form.pending,false);assert.equal(form.changes.length,1);
    assert.equal(form.changes[0][field],field==="timeZone"?value:Number(value));
  }
});

test("restoring only the place name can cancel a search without requiring manual confirmation",()=>{
  const form=picker();form.edit("query","Prahax");assert.equal(form.pending,true);
  form.edit("query","Praha");assert.equal(form.pending,false);assert.equal(form.message,"");
  assert.deepEqual(form.value,{latitude:saved.latitude,longitude:saved.longitude,timeZone:saved.timeZone});assert.equal(form.changes.length,0);
});
