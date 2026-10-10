import React from "react";
import { navigationLabel, roomPlacement, updatePlacement, navigationRooms, moveDockRoom } from "../product/navigation.js";
import { FONT_BODY } from "./type.js";

export function NavigationSettings({t,lang,config,keys,dockKeys=keys,defaults,onChange,onOpen,enabled=()=>true,onEnable,icons={}}) {
  const L=(cs,en)=>lang==="en"?en:cs;
  const availableDockKeys=dockKeys.filter(enabled),dock=navigationRooms(config,availableDockKeys,defaults,'dock');
  return <div className="tm-navigation-settings" style={{fontFamily:FONT_BODY,color:t.text,minWidth:0}}>
    <style>{`.tm-navigation-room{display:grid;grid-template-columns:minmax(0,1fr) minmax(150px,48%);align-items:center;gap:8px;padding:11px 0}.tm-navigation-room select{box-sizing:border-box}@media(max-width:420px){.tm-navigation-room{grid-template-columns:minmax(0,1fr);gap:2px;padding:12px 0}.tm-navigation-room select{font-size:16px!important}}`}</style>
    <p style={{color:t.textSec,fontSize:13,lineHeight:1.6}}>{L("Vyber, kde chceš mít jednotlivé stránky. Skrytím se jejich obsah ani sdílení nesmaže. Nastavení zůstává vždy dostupné přes Vše.","Choose where each page appears. Hiding does not delete its content or stop sharing. Settings remain available under All.")}</p>
    <details style={{padding:'8px 0 20px'}}><summary style={{cursor:'pointer',minHeight:44,padding:'10px 0',color:t.accentInk||t.accent,fontSize:15}}>{L('Pořadí v dolním doku','Bottom dock order')}</summary>
      <p style={{color:t.textSec,fontSize:13}}>{L('Šipkami posuň stránku. První v seznamu je první v pořadí doku. Vše zůstává na konci.','Use the arrows to reorder pages. The first item leads the dock. All stays at the end.')}</p>
      {!dock.length&&<p style={{color:t.textSec,fontSize:13}}>{L('Nejdřív přidej některou stránku do dolního doku.','Add a page to the bottom dock first.')}</p>}
      <ol style={{padding:0,listStyle:'none',margin:0}}>{dock.map((key,i)=><li key={key} style={{display:'flex',alignItems:'center',gap:8,borderBottom:`1px solid ${t.borderSoft}`}}><span style={{flex:1,fontSize:15}}>{navigationLabel(key,lang)}</span>{[-1,1].map(dir=><button key={dir} type="button" aria-label={`${navigationLabel(key,lang)} · ${dir<0?L('posunout dříve','move earlier'):L('posunout později','move later')}`} disabled={dir<0?i===0:i===dock.length-1} onClick={()=>onChange(moveDockRoom(config,key,dir,availableDockKeys,defaults))} style={{width:44,height:44,border:0,background:'transparent',color:t.accentInk||t.accent,opacity:(dir<0?i===0:i===dock.length-1)?.3:1,cursor:'pointer'}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><path d={dir<0?'M6 14l6-6 6 6':'M6 10l6 6 6-6'}/></svg></button>)}</li>)}</ol>
    </details>
    {keys.map(key=>{const p=roomPlacement(config,key,defaults),available=enabled(key),value=!available||p.hidden?"hidden":p.sidebar&&p.dock?"both":p.dock?"dock":p.sidebar?"sidebar":"hidden";
      return <div key={key} className="tm-navigation-room" style={{borderBottom:`1px solid ${t.borderSoft}`}}>
        <button type="button" onClick={()=>onOpen(key)} disabled={!available} style={{display:"flex",alignItems:"center",gap:10,minWidth:0,minHeight:44,background:"none",border:0,padding:"8px 0",textAlign:"left",font:"inherit",color:t.text,cursor:available?"pointer":"default"}}>{icons[key]&&<span aria-hidden="true" style={{display:"inline-flex",flexShrink:0,color:t.sand||t.textSec}}>{React.createElement(icons[key],{size:20})}</span>}<span style={{minWidth:0,overflowWrap:"anywhere"}}>{navigationLabel(key,lang)}</span></button>
        <select aria-label={`${navigationLabel(key,lang)} · ${L("umístění","placement")}`} value={value} onChange={e=>{const v=e.target.value;if(v!=="hidden"&&!available)onEnable?.(key);onChange(updatePlacement(config,key,{hidden:v==="hidden",sidebar:v==="both"||v==="sidebar",dock:v==="both"||v==="dock"},keys,defaults));}} style={{minWidth:0,width:"100%",minHeight:44,border:`1px solid ${t.border}`,borderRadius:8,background:t.sheet,color:t.text,font:"inherit",fontSize:13,padding:8}}>
          <option value="hidden">{L("Skrýt","Hide")}</option><option value="sidebar">{L("Boční nabídka","Side menu")}</option><option value="dock">{L("Dolní dok","Bottom dock")}</option><option value="both">{L("Nabídka i dok","Menu and dock")}</option>
        </select>
      </div>;
    })}
    <button type="button" onClick={()=>onChange({})} style={{marginTop:18,minHeight:44,padding:"8px 12px",background:"transparent",border:`1px solid ${t.border}`,borderRadius:8,color:t.text,font:"inherit"}}>{L("Obnovit rozmístění","Reset placement")}</button>
  </div>;
}
