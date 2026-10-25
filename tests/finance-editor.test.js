import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import React from "react";
import * as finance from "../src/shared/product/financeFlow.js";
import * as personal from "../src/shared/product/personalRooms.js";

const source=fs.readFileSync("src/shared/ui/financeRoom.jsx","utf8");
const compiled=ts.transpileModule(source,{compilerOptions:{jsx:ts.JsxEmit.React,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
const nodes=node=>!node||typeof node!=="object"?[]:[node,...React.Children.toArray(node.props?.children).flatMap(nodes)];

// Exercise real form event handlers with isolated hook state and synthetic data.
function editor(kind="expenses",entry=null,categories=[]){
  let active;
  const hooksReact={...React,useId:()=>"finance-test",useEffect:()=>{},useState:initial=>{
    const owner=active,index=owner.position++;
    if(!(index in owner.hooks))owner.hooks[index]=typeof initial==="function"?initial():initial;
    return [owner.hooks[index],value=>{owner.hooks[index]=typeof value==="function"?value(owner.hooks[index]):value;}];
  }};
  const module={exports:{}};
  vm.runInNewContext(compiled,{module,exports:module.exports,Intl,Date,require:id=>{
    if(id==="react")return hooksReact;
    if(id.includes("financeFlow"))return finance;
    if(id.includes("personalRooms"))return personal;
    return {TmIcon:()=>null,FONT_BODY:"body",FONT_TAG:"tag",hexA:value=>value,useGuideAction:()=>{}};
  }});
  const changes=[];let closed=0,savedMonth;
  const store={coll:{income:[],expenses:[]},addEntry:(type,value)=>changes.push({type,value}),updateEntry:(type,id,patch)=>changes.push({type,id,patch})};
  const deps={useT:()=>({t:{}}),useStore:()=>store,L:(cs)=>cs,PageTitle:()=>null,CenterSheet:()=>null,Select:()=>null,uid:()=>"new-id",todayISO:()=>"2026-10-25"};
  const {FinanceRoom}=module.exports.createFinanceRoom(deps);
  const room={hooks:[],position:0};active=room;
  let tree=FinanceRoom({categories});
  nodes(tree).find(node=>node.type==="button"&&node.props.children?.[1]===(kind==="income"?"Přidat příjem":"Přidat výdaj"))?.props.onClick();
  if(!room.hooks.some(value=>value?.kind===kind)){
    const add=nodes(tree).find(node=>node.type==="button"&&String(node.props.children).includes(kind==="income"?"Přidat příjem":"Přidat výdaj"));
    assert.ok(add,"Room exposes the add action");add.props.onClick();
  }
  active=room;room.position=0;tree=FinanceRoom({categories});
  const element=nodes(tree).find(node=>typeof node.type==="function"&&node.type.name==="LedgerEditor");
  assert.ok(element,"The real editor is rendered");
  const state={hooks:[],position:0};
  const render=()=>{active=state;state.position=0;tree=element.type({kind,entry,categories,month:"2026-10",onClose:()=>closed++,onSaved:value=>savedMonth=value});};
  render();
  return {changes,get closed(){return closed;},get savedMonth(){return savedMonth;},get tree(){return tree;},get all(){return nodes(tree);},
    edit(key,value){const node=nodes(tree).find(n=>n.type==="input"&&(n.props.name===key||n.props.type===key));assert.ok(node,key);node.props.onChange({target:{value}});render();},
    category(value){const node=nodes(tree).find(n=>Array.isArray(n.props?.options));assert.ok(node,"Category selector");node.props.onChange(value);render();},
    save(){nodes(tree).find(node=>node.type==="form").props.onSubmit({preventDefault(){}});render();},
    toggle(open){nodes(tree).find(node=>node.type==="details").props.onToggle({currentTarget:{open}});render();},
  };
}

test("opening finance entry leaves focus to the page-locking overlay and starts with a compact form",()=>{
  const e=editor();
  assert.equal(e.tree.props.className,"tm-finance-editor");
  assert.equal(e.all.some(node=>node.props?.autoFocus),false);
  assert.equal(e.all.find(node=>node.type==="details").props.open,false);
  const inputs=e.all.filter(node=>node.type==="input");
  assert.equal(inputs[0].props.name,"amount");assert.equal(inputs[0].props.inputMode,"decimal");
  assert.ok(inputs.every(node=>node.props.style.fontSize>=16));
});

test("quick expense entry keeps Czech cents, refunds, date and exact field identities",()=>{
  const e=editor();e.edit("amount","-1 200,50");e.edit("name","  Vrácená platba  ");e.save();
  assert.equal(e.changes.length,1);assert.equal(e.closed,1);assert.equal(e.savedMonth,"2026-10");
  assert.equal(JSON.stringify(e.changes[0]),JSON.stringify({type:"expenses",value:{id:"new-id",item:"Vrácená platba",amount:-1200.5,date:"2026-10-25",note:"",category:""}}));
});

test("income uses its own source field and an invalid amount cannot write or close",()=>{
  const e=editor("income");e.edit("name","Konzultace");e.edit("amount","1.123");e.save();
  assert.equal(e.changes.length,0);assert.equal(e.closed,0);assert.ok(e.all.find(node=>node.props?.role==="alert"));
  e.edit("amount","250,75");e.save();
  assert.equal(e.changes[0].value.source,"Konzultace");assert.equal(e.changes[0].value.item,undefined);assert.equal(e.changes[0].value.jar,undefined);
});

test("editing and collapsing details preserves the existing note and category without replacing unknown fields",()=>{
  const original={id:"existing",item:"Jídlo",amount:100,date:"2026-10-20",jar:"NEC",note:"Žluťoučký zápis",custom:{kept:true}};
  const e=editor("expenses",original,[{value:"NEC",label:"Běžné výdaje"}]);
  assert.equal(e.all.find(node=>node.type==="details").props.open,true);
  e.toggle(false);e.edit("amount","125,20");e.save();
  assert.equal(e.changes[0].id,"existing");assert.equal(e.changes[0].patch.note,original.note);assert.equal(e.changes[0].patch.jar,undefined);assert.equal({...original,...e.changes[0].patch}.jar,"NEC");
  assert.equal(e.changes[0].patch.custom,undefined);assert.equal(original.custom.kept,true);assert.equal(original.amount,100);
});

test("saving another field preserves an untouched legacy category exactly",()=>{
  const original={id:"legacy",item:"Jídlo",amount:100,date:"2026-10-20",category:"Vlastní stará kategorie",custom:{kept:true}};
  const e=editor("expenses",original,[{value:"NEC",label:"Běžné výdaje"}]);
  e.edit("amount","125,20");e.save();
  assert.equal(Object.hasOwn(e.changes[0].patch,"jar"),false);assert.equal(Object.hasOwn(e.changes[0].patch,"category"),false);
  const result={...original,...e.changes[0].patch};assert.equal(result.category,original.category);assert.equal(result.custom,original.custom);
});

test("explicit Uncategorized clears both historical aliases instead of reviving an old category",()=>{
  for(const fields of [{category:"Old"},{jar:"NEC",category:"Old"}]){
    const original={id:"legacy",item:"Jídlo",amount:100,date:"2026-10-20",...fields};
    const e=editor("expenses",original,[{value:"NEC",label:"Běžné výdaje"}]);
    e.category("");e.save();const result={...original,...e.changes[0].patch};
    assert.equal(result.jar||result.category||"","");
  }
});

test("explicit free-text category supersedes a legacy jar while retaining other fields",()=>{
  const original={id:"legacy",item:"Jídlo",amount:100,date:"2026-10-20",jar:"OLD",category:"Older",reference:"keep"};
  const e=editor("expenses",original,[]);e.edit("category","Doprava");e.save();
  const result={...original,...e.changes[0].patch};assert.equal(result.jar||result.category,"Doprava");assert.equal(result.reference,"keep");
});
