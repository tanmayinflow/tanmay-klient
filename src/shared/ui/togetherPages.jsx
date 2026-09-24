import React,{useState,useEffect,useRef} from "react";
import {PARTNER_ROOMS,cleanPartnerPages} from "../product/togetherPages.js";

export function PartnerPages({data,canTrack,lang,save,getPages,busy}) {
  const L=(cs,en)=>lang==="en"?en:cs,shared=data.sharedPages||{rooms:[],pages:{},revision:0,updated:0};
  const [rooms,setRooms]=useState(shared.rooms),[revision,setRevision]=useState(shared.revision),[dirty,setDirty]=useState(false);
  useEffect(()=>{if(!dirty){setRooms(shared.rooms);setRevision(shared.revision);}},[shared.revision,dirty]);
  const view=canTrack?shared.pages:getPages?.(rooms)||{};
  return <section className="tm-together-section"><h2>{canTrack?L("Partnerovy stránky","Your partner's pages"):L("Moje stránky pro partnerku","My pages for my partner")}</h2>
    {!canTrack&&<><p>{L("Povol jednotlivě, co může propojená partnerka číst. Úpravy tvých stránek provádět nemůže. Před uložením si rozbal přesný sdílený obsah níže.","Choose which pages your connected partner may read. She cannot edit your pages. Expand the exact shared content below before saving.")}</p>{PARTNER_ROOMS.map(r=><label className="consent" key={r.id}><input type="checkbox" checked={rooms.includes(r.id)} onChange={e=>{setDirty(true);setRooms(v=>e.target.checked?[...v,r.id]:v.filter(x=>x!==r.id));}}/><span>{L(...r.name)}<small style={{display:"block",fontSize:12,color:"var(--tg-muted)"}}>{L(...r.detail)}</small></span></label>)}<button className="primary" disabled={busy||!dirty} onClick={async()=>{if(await save("pages-sharing",{rooms,pages:cleanPartnerPages(getPages(rooms),rooms),revision,linkId:data.link.id,linkRevision:data.link.revision}))setDirty(false);}}>{L("Uložit přístup ke stránkám","Save page access")}</button>{dirty&&<p className="hint">{L("Změny přístupu ještě nejsou uložené.","Access changes have not been saved yet.")}</p>}</>}
    <p className="hint">{L("Jde o přehled pouze ke čtení. Obsah se obnovuje, když má vlastník otevřenou svou aplikaci. Neobsahuje deník, zápisník, klienty ani soukromé poznámky.","This is a read-only overview. Content refreshes while the owner has their app open. It excludes journals, notebooks, clients and private notes.")}</p>
    {shared.updated>0&&<p className="hint">{L("Poslední aktualizace:","Last updated:")} {new Date(shared.updated).toLocaleString(lang==="en"?"en-GB":"cs-CZ")}</p>}
    {(canTrack?shared.rooms:rooms).length===0&&<p>{L("Žádná stránka zatím není zpřístupněná.","No pages are shared yet.")}</p>}
    {(canTrack?shared.rooms:rooms).map(id=><details key={id}><summary>{L(...PARTNER_ROOMS.find(r=>r.id===id).name)} <span className="hint">· {L("pouze čtení","read only")}</span></summary>{(view[id]||[]).length?(view[id]||[]).map((row,i)=><article className="item" key={i}><strong>{row.title}</strong>{row.detail&&<p>{row.detail}</p>}{row.lines?.length>0&&<ul>{row.lines.map((line,j)=><li key={j}>{line}</li>)}</ul>}</article>):<p>{L("Tato stránka zatím nemá obsah k zobrazení.","This page has no content to display yet.")}</p>}</details>)}
  </section>;
}

// Mounted only in Main. Never fetches or stores the full Main state in the client app.
// Explicit server grants precede projection and transmission. Link and page CAS stop old publishers after revocation.
export function TogetherPublisher({getPages,version}) {
  const get=useRef(getPages);get.current=getPages;
  const running=useRef(false);
  useEffect(()=>{
    let live=true;
    const sync=async()=>{
      if(running.current||document.visibilityState!=="visible"||!navigator.onLine)return;
      running.current=true;
      try{
        const r=await fetch("/api/together/pages",{cache:"no-store"});if(!r.ok)return;const granted=await r.json();
        if(!live||!granted.ok||!granted.rooms.length)return;
        const pages=cleanPartnerPages(get.current(granted.rooms),granted.rooms);
        if(JSON.stringify(pages)===JSON.stringify(granted.pages))return;
        await fetch("/api/together/pages",{method:"PUT",headers:{"Content-Type":"application/json"},cache:"no-store",body:JSON.stringify({pages,revision:granted.revision,linkId:granted.linkId,linkRevision:granted.linkRevision})});
      }catch{/* A failed refresh retains the visible last-updated time. No offline queue. */}finally{running.current=false;}
    };
    const timer=setTimeout(sync,1500),interval=setInterval(sync,30000);
    window.addEventListener("focus",sync);window.addEventListener("online",sync);document.addEventListener("visibilitychange",sync);
    return()=>{live=false;clearTimeout(timer);clearInterval(interval);window.removeEventListener("focus",sync);window.removeEventListener("online",sync);document.removeEventListener("visibilitychange",sync);};
  },[version]);
  return null;
}
