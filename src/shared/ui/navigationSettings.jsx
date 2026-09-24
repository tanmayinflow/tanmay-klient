import React from "react";
import { navigationLabel, roomPlacement, updatePlacement } from "../product/navigation.js";

export function NavigationSettings({t,lang,config,keys,defaults,onChange,onOpen,enabled=()=>true,onEnable}) {
  const L=(cs,en)=>lang==="en"?en:cs;
  return <div className="tm-navigation-settings">
    <p style={{color:t.textSec,fontSize:13,lineHeight:1.6}}>{L("Vyber, kde chceš mít jednotlivé stránky. Skrytím se jejich obsah ani sdílení nesmaže. Nastavení zůstává vždy dostupné přes Vše.","Choose where each page appears. Hiding does not delete its content or stop sharing. Settings remain available under All.")}</p>
    {keys.map(key=>{const p=roomPlacement(config,key,defaults),available=enabled(key),value=!available||p.hidden?"hidden":p.sidebar&&p.dock?"both":p.dock?"dock":p.sidebar?"sidebar":"hidden";
      return <div key={key} style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) minmax(130px,48%)",alignItems:"center",gap:8,padding:"11px 0",borderBottom:`1px solid ${t.borderSoft}`}}>
        <button type="button" onClick={()=>onOpen(key)} disabled={!available} style={{background:"none",border:0,padding:"8px 0",textAlign:"left",font:"inherit",color:t.text,cursor:"pointer"}}>{navigationLabel(key,lang)}</button>
        <select aria-label={`${navigationLabel(key,lang)} · ${L("umístění","placement")}`} value={value} onChange={e=>{const v=e.target.value;if(v!=="hidden"&&!available)onEnable?.(key);onChange(updatePlacement(config,key,{hidden:v==="hidden",sidebar:v==="both"||v==="sidebar",dock:v==="both"||v==="dock"},keys,defaults));}} style={{minWidth:0,width:"100%",minHeight:44,border:`1px solid ${t.border}`,borderRadius:8,background:t.sheet,color:t.text,font:"inherit",fontSize:13,padding:8}}>
          <option value="hidden">{L("Skrýt","Hide")}</option><option value="sidebar">{L("Boční nabídka","Side menu")}</option><option value="dock">{L("Dolní dok","Bottom dock")}</option><option value="both">{L("Nabídka i dok","Menu and dock")}</option>
        </select>
      </div>;
    })}
    <button type="button" onClick={()=>onChange({})} style={{marginTop:18,minHeight:44,padding:"8px 12px",background:"transparent",border:`1px solid ${t.border}`,borderRadius:8,color:t.text,font:"inherit"}}>{L("Obnovit rozmístění","Reset placement")}</button>
  </div>;
}
