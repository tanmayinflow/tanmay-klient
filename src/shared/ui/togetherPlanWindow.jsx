import React from "react";
import {TogetherText} from "./togetherElements.jsx";
import {togetherTheme} from "./togetherStyles.js";

// Use the app's sheet for its body portal, visible viewport, scroll lock and
// theme material. The draft remains owned by TogetherWorkspace on save errors.
export function TogetherPlanWindow({Sheet,t,lang="cs",plan,onChange,onClose,onSave,onRefresh,busy,error,available=true}) {
  const L=(cs,en)=>lang==="en"?en:cs;
  const field=(name,value)=>onChange(previous=>({...previous,[name]:value}));
  return <Sheet title={plan.id?L("Upravit návrh","Edit proposal"):L("Naše příští chvíle","Our next moment")} onClose={onClose} className="tg-plan-sheet">
    <div className="tm-together tg-plan-window" style={togetherTheme(t)}>
      {error&&<div role="alert"><p>{error}</p>{onRefresh&&<button type="button" disabled={busy} onClick={onRefresh}>{L("Obnovit přehled","Refresh")}</button>}</div>}
      {!available&&!error&&<p role="status">{L("Ověřuji propojení…","Checking your connection…")}</p>}
      <form onSubmit={event=>{event.preventDefault();if(!busy&&available)onSave();}}>
        <fieldset disabled={busy||!available} className="tg-entry-fields">
          <label>{L("Co podnikneme","What shall we do")}<input required className="tm-navod" placeholder={L("Na co se spolu těšíme…","What we look forward to together…")} value={plan.title} maxLength={120} onChange={e=>field("title",e.target.value)}/></label>
          <div className="fields">
            <label>{L("Datum","Date")}<input required type="date" value={plan.date} onChange={e=>field("date",e.target.value)}/></label>
            <label>{L("Čas","Time")}<input required type="time" value={plan.time} onChange={e=>field("time",e.target.value)}/></label>
          </div>
          <label>{L("Délka v minutách","Duration in minutes")}<input required type="number" inputMode="numeric" min="10" max="1440" step="1" value={plan.minutes} onChange={e=>field("minutes",e.target.value===""?"":Number(e.target.value))}/></label>
          <label>{L("Poznámka pro oba","Note for both")}<TogetherText placeholder={L("Místo, přání nebo malá domluva…","A place, a wish or a small agreement…")} value={plan.note} maxLength={600} onChange={e=>field("note",e.target.value)}/></label>
          <div className="row tg-plan-actions">
            <button type="submit" className="primary">{busy?L("Ukládám…","Saving…"):L("Poslat návrh","Send proposal")}</button>
            <button type="button" onClick={onClose}>{L("Zrušit úpravu","Cancel editing")}</button>
          </div>
        </fieldset>
      </form>
    </div>
  </Sheet>;
}
