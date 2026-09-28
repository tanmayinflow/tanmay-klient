import React,{useState} from 'react';
import {TogetherFold} from './togetherElements.jsx';
import {cleanTogether} from '../product/together.js';

// Acts only on the signed-in person's document through its existing revision guard.
export function TogetherMaintenance({doc,canTrack,lang,busy,onApply}) {
  const L=(cs,en)=>lang==='en'?en:cs;
  const [cycle,setCycle]=useState(false),[days,setDays]=useState(false),[confirm,setConfirm]=useState(false),[backup,setBackup]=useState(null);
  const fingerprint=value=>JSON.stringify(cleanTogether(value));
  const apply=async()=>{
    const before=structuredClone(doc);
    const next={...doc,...(cycle?{periods:[],mode:'observe'}:{}),...(days?{days:{}}:{})};
    if(await onApply(next)){setBackup({before,after:fingerprint(next)});setConfirm(false);setCycle(false);setDays(false);}
  };
  return <TogetherFold title={L('Moje údaje a nový začátek','My records and a fresh start')}>
    <p>{L('Vyber, co chceš vymazat ze svého účtu. Společné plány, rozhovory a týdenní ohlédnutí zůstanou.','Choose what to clear from your account. Shared plans, conversations and weekly reflections stay.')}</p>
    {canTrack&&<label className="consent"><input type="checkbox" checked={cycle} disabled={busy} onChange={e=>{setCycle(e.target.checked);setConfirm(false);}}/>{L('Restartovat cyklus: odstranit menstruace a vypnout odhady','Restart cycle: clear period records and turn off estimates')}</label>}
    <label className="consent"><input type="checkbox" checked={days} disabled={busy} onChange={e=>{setDays(e.target.checked);setConfirm(false);}}/>{L('Odstranit všechny moje denní zápisy ve Spolu','Remove all my daily entries in Together')}</label>
    {!confirm?<button type="button" disabled={busy||(!cycle&&!days)} onClick={()=>setConfirm(true)}>{L('Pokračovat k vymazání','Review removal')}</button>:<div className="tg-reset-confirm" role="group" aria-label={L('Potvrzení vymazání','Confirm removal')}>
      <p>{L('Opravdu vymazat vybrané údaje? Zmizí i z partnerova sdíleného přehledu. Rozepsané změny v denním zápisu se zahodí.','Clear the selected records? They will also disappear from your partner’s shared view. Unsaved daily-entry changes will be discarded.')}</p>
      <div className="row"><button type="button" disabled={busy} onClick={apply}>{L('Ano, vymazat moje vybrané údaje','Yes, clear my selected records')}</button><button type="button" disabled={busy} onClick={()=>setConfirm(false)}>{L('Zrušit','Cancel')}</button></div>
    </div>}
    {backup&&<div role="status"><p>{fingerprint(doc)===backup.after?L('Vymazáno. Dokud zůstaneš na této stránce a nepřidáš další zápis, můžeš vymazání vrátit.','Cleared. You can undo it while you remain on this page, before adding another entry.'):L('Údaje se od vymazání změnily. Obnova by přepsala novější zápis, proto už ji nenabízíme.','Records have changed since removal. Restoring would overwrite a newer entry, so undo is no longer available.')}</p><button type="button" disabled={busy||fingerprint(doc)!==backup.after} onClick={async()=>{if(fingerprint(doc)===backup.after&&await onApply(backup.before))setBackup(null);}}>{L('Vrátit poslední vymazání','Undo last removal')}</button></div>}
  </TogetherFold>;
}
