import React from "react";
import {togetherTheme} from "./togetherStyles.js";

// Keep the page's existing draft and revision alive when this window closes.
// CenterSheet provides the portal, focus trap, history, scroll lock and exit.
export function TogetherDayWindow({Sheet,t,lang,day,panel,onPanel,onClose,canTrack,available,error,notice,onRefresh,entry,period,orientation}) {
  const L=(cs,en)=>lang==="en"?en:cs;
  const tabs=canTrack?[["entry","Zápis","Entry"],["period","Menstruace","Period"],["orientation","Orientace v cyklu","Cycle orientation"]]:[["entry","Zápis","Entry"]];
  return <Sheet title={L("Zápis dne","Day entry")} onClose={onClose}>
    <div className="tm-together tg-day-window" style={togetherTheme(t)}>
      <style>{`
        .tm-cs-veil:has(.tg-day-window){align-items:center!important;padding:max(24px,calc(5 * var(--tm-dvh))) 8px!important;backdrop-filter:blur(2px)}
        .tm-cs:has(.tg-day-window){width:min(620px,100%)!important;height:auto!important;max-height:calc(90 * var(--tm-dvh))!important;border-radius:22px!important;overflow:auto!important;box-shadow:0 20px 65px rgba(15,12,9,.32)!important}
        .tg-day-window .tg-day-date{font-family:var(--tm-font-display);font-size:27px;line-height:1.2;text-transform:none;letter-spacing:normal;font-weight:400;color:var(--tg-heading);margin:10px 0 20px}
        .tg-day-window .fields{align-items:end}
        .tg-day-window .tg-day-tabs{display:flex;gap:8px;border-bottom:1px solid var(--tg-soft);margin-bottom:20px}
        .tg-day-window .tg-day-tabs button{flex:1;border:0;border-radius:0;padding:10px 2px;border-bottom:2px solid transparent;font-family:var(--tm-font-tag);font-size:13px;letter-spacing:.06em}
        .tg-day-window .tg-day-tabs button[aria-pressed=true]{border-color:var(--tg-accent);color:var(--tg-accent)}
        .tg-day-window .tg-day-panel:not([hidden]){animation:tgDayReveal .32s cubic-bezier(.2,.7,.2,1) both}
        .tg-day-window .tg-day-panel[hidden]{display:none}
        @keyframes tgDayReveal{from{opacity:.3;transform:translateY(9px)}to{opacity:1;transform:none}}
        @media(prefers-reduced-motion:reduce){.tm-cs-veil:has(.tg-day-window),.tm-cs:has(.tg-day-window),.tg-day-window .tg-day-panel:not([hidden]){animation:none!important;transition:none!important}}
      `}</style>
      <h2 className="tg-day-date">{new Date(day+"T12:00:00").toLocaleDateString(lang==="en"?"en-GB":"cs-CZ",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</h2>
      {error&&<div role="alert"><p>{error}</p><button type="button" onClick={onRefresh}>{L("Obnovit přehled","Refresh")}</button></div>}
      {notice&&<p role="status">{notice}</p>}
      {available?<>
        {canTrack&&<nav className="tg-day-tabs" aria-label={L("Zápis a cyklus","Entry and cycle")}>{tabs.map(([id,cs,en])=><button key={id} type="button" aria-pressed={panel===id} aria-controls={`tg-day-${id}`} onClick={()=>onPanel(id)}>{L(cs,en)}</button>)}</nav>}
        <div className="tg-day-panel" id="tg-day-entry" hidden={panel!=="entry"}>{entry}</div>
        {canTrack&&<><div className="tg-day-panel" id="tg-day-period" hidden={panel!=="period"}>{period}</div><div className="tg-day-panel" id="tg-day-orientation" hidden={panel!=="orientation"}>{orientation}</div></>}
      </>:!error&&<p role="status">{L("Načítám zápis…","Loading your entry…")}</p>}
    </div>
  </Sheet>;
}
