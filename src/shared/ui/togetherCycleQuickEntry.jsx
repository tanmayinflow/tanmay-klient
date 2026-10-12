import React from "react";
import {addDays} from "../product/together.js";
import {cyclePeriodEntryDraft} from "../product/togetherCycleCalendar.js";

// Date selection is read-only. The explicit action confirms a start, never an end.
export function TogetherCycleQuickEntry({doc, date, today, model, lang, busy, onSave, onEdit, onSettings, draftLength, onLengthChange, draftShowEstimates, onEstimatesChange}) {
  const L=(cs,en)=>lang==="en"?en:cs;
  const draft=cyclePeriodEntryDraft(doc,date,today);
  const length=draftLength??draft?.expectedLength??5;
  const showEstimates=draftShowEstimates??draft?.showEstimates??false;
  const existing=model.recordedPeriod||(model.continuation?doc.periods.filter(p=>p.start<=date).at(-1):null);
  const format=value=>new Date(`${value}T12:00:00`).toLocaleDateString(lang==="en"?"en-GB":"cs-CZ",{day:"numeric",month:"long"});
  if(date>today)return <p className="hint">{L("Budoucí dny jsou jen orientační. Skutečný začátek zapíšeš, až menstruace přijde.","Future days are estimates only. Record the actual start when your period arrives.")}</p>;
  if(existing)return <div className="tg-cycle-quick-entry"><p>{L("Začátek menstruace","Period started")}: {format(existing.start)}{existing.end?` · ${L("konec","ended")} ${format(existing.end)}`:""}</p><button type="button" disabled={busy} onClick={()=>onEdit(existing)}>{L("Upravit menstruaci","Edit period")}</button>{doc.mode!=="estimate"&&<p className="hint">{L("Odhady v kalendáři máš vypnuté.","Calendar estimates are turned off.")} <button type="button" className="tg-text-button" disabled={busy} onClick={onSettings}>{L("Nastavení cyklu","Cycle settings")}</button></p>}</div>;
  return <div className="tg-cycle-quick-entry">
    <div className="tg-cycle-duration"><label>{L("Odhad délky menstruace","Estimated period duration")}<span><input type="number" aria-label={L("Odhad délky menstruace","Estimated period duration")} min="1" max="14" step="1" inputMode="numeric" value={length} onChange={e=>onLengthChange(e.target.value===""?"":Number(e.target.value))} disabled={busy}/>{L("dní","days")}</span></label></div>
    <p className="hint">{draft?.basis==="history"?L("Předvyplněno podle tvých dokončených záznamů.","Filled from your completed records."):draft?.basis==="saved"?L("Předvyplněno podle poslední uložené délky.","Filled from your last saved duration."):L("Pro začátek nabízíme 5 dní. Uprav je podle sebe.","We suggest 5 days to begin with. Adjust this for yourself.")} {Number.isInteger(length)&&length>=1&&length<=14?`${L("Přibližně do","Approximately until")} ${format(addDays(date,length-1))}. `:""}{L("Skutečný konec doplníš později.","Add the actual end later.")}</p>
    <label className="consent"><input type="checkbox" checked={showEstimates} disabled={busy} onChange={e=>onEstimatesChange(e.target.checked)}/>{L("Zobrazovat odhady","Show estimates")}</label>
    <p className="hint">{showEstimates?L("Po uložení kalendář ukáže dostupné odhady pokračování a dalších cyklů.","After saving, the calendar will show available estimates for continuation and future cycles."):L(doc.mode==="paused"?"Odhady zůstanou pozastavené. Tady je můžeš znovu zapnout.":"Uloží se jen skutečný zápis. Odhady zůstanou vypnuté.",doc.mode==="paused"?"Estimates will remain paused. You can turn them back on here.":"Only the actual record will be saved. Estimates will remain off.")}</p>
    <button type="button" className="primary" disabled={busy||!draft||!Number.isInteger(length)||length<1||length>14} onClick={()=>onSave({start:date,end:null,expectedLength:length,showEstimates})}>{L("Začala menstruace","Period started")}</button>
  </div>;
}
