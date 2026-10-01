import React,{useEffect,useId,useRef,useState} from "react";
import {createLatestSkyPlaceSearch,createSkyGeocoder,resolveSkyPlaceTimeZone,validSkyPlace} from "../product/skyGeocoding.js";

const searchPlaces=createSkyGeocoder();
const coordinates=place=>`${Number(place.latitude).toFixed(4)}, ${Number(place.longitude).toFixed(4)}`;
export function SkyPlacePicker({value,onChange,onPending,label,lang="cs"}){
  const L=(cs,en)=>lang==="en"?en:cs,id=useId();
  const [query,setQuery]=useState(value.name||""),[editing,setEditing]=useState(false),[results,setResults]=useState([]),[status,setStatus]=useState("idle"),[manual,setManual]=useState(value),[manualOpen,setManualOpen]=useState(false),[retry,setRetry]=useState(0);
  const [latest]=useState(()=>createLatestSkyPlaceSearch(searchPlaces)),selection=useRef(0),resolving=useRef(null),callbacks=useRef({onChange,onPending});callbacks.current={onChange,onPending};
  useEffect(()=>{latest.cancel();selection.current++;resolving.current?.abort();setQuery(value.name||"");setManual(value);setEditing(false);setResults([]);setStatus("idle");callbacks.current.onPending(false);},[value.name,value.latitude,value.longitude,value.timeZone,latest]);
  useEffect(()=>()=>{latest.cancel();selection.current++;resolving.current?.abort();callbacks.current.onPending(false);},[latest]);
  useEffect(()=>{
    if(!editing)return;
    latest.cancel();setResults([]);
    if(query.trim().length<3){setStatus("short");return;}
    setStatus("waiting");
    const timer=setTimeout(async()=>{
      setStatus("loading");
      try{const rows=await latest.search(query,{language:lang});if(rows===null)return;setResults(rows);setStatus(rows.length?"results":"empty");}
      catch(error){setStatus(error?.message==="geocoding-rate-limit"?"limited":"error");}
    },650);
    return ()=>{clearTimeout(timer);latest.cancel();};
  },[query,editing,lang,latest,retry]);
  const editQuery=text=>{
    const nameChanged=text!==value.name,manualChanged=["latitude","longitude","timeZone"].some(key=>String(manual[key]??"")!==String(value[key]??""));
    latest.cancel();selection.current++;resolving.current?.abort();setQuery(text);setEditing(nameChanged);callbacks.current.onPending(nameChanged||manualChanged);setStatus(!nameChanged&&manualChanged?"manual":"idle");setResults([]);
  };
  const choose=async place=>{
    latest.cancel();setEditing(false);setResults([]);setQuery(place.name);setManual({...place,timeZone:""});setStatus("timezone");callbacks.current.onPending(true);
    resolving.current?.abort();resolving.current=new AbortController();const version=++selection.current;
    try{const located=await resolveSkyPlaceTimeZone(place,{signal:resolving.current.signal});if(version!==selection.current)return;setManual(located);callbacks.current.onChange(located);callbacks.current.onPending(false);setStatus("selected");}
    catch{if(version!==selection.current)return;setManual({...place,timeZone:""});setManualOpen(true);setStatus("zone-error");}
  };
  const editManual=(key,text)=>{selection.current++;resolving.current?.abort();latest.cancel();setEditing(false);setResults([]);setStatus("manual");setManual(p=>({...p,[key]:text}));callbacks.current.onPending(true);};
  const useManual=()=>{
    const next={name:query.trim(),latitude:manual.latitude,longitude:manual.longitude,timeZone:String(manual.timeZone||"").trim()};
    if(!validSkyPlace(next))return;
    selection.current++;resolving.current?.abort();
    callbacks.current.onChange({...next,latitude:Number(next.latitude),longitude:Number(next.longitude)});callbacks.current.onPending(false);setStatus("selected");setEditing(false);latest.cancel();setResults([]);
  };
  const messages={short:L("Napiš alespoň tři znaky názvu města.","Enter at least three characters of a town or city name."),waiting:L("Hledám místa…","Looking up places…"),loading:L("Hledám místa…","Looking up places…"),results:L(`Vyber konkrétní místo. Nalezeno: ${results.length}.`,`Choose a specific place. ${results.length} found.`),empty:L("Místo se nepodařilo najít. Zkus přidat zemi nebo zadej souřadnice ručně.","No place found. Try adding the country or enter coordinates manually."),error:L("Vyhledávání teď není dostupné. Zkus to znovu nebo zadej souřadnice ručně.","Search is unavailable. Try again or enter coordinates manually."),limited:L("Vyhledávání potřebuje chvíli pauzu. Zkus to později nebo zadej souřadnice ručně.","Search needs a short pause. Try later or enter coordinates manually."),timezone:L("Doplňuji časové pásmo…","Finding the time zone…"),"zone-error":L("Souřadnice jsou nalezené. Časové pásmo se nepodařilo ověřit; doplň ho níže a potvrď místo.","Coordinates found. The time zone could not be verified; enter it below and confirm the place."),manual:L("Zkontroluj souřadnice a pásmo, potom potvrď místo.","Check the coordinates and time zone, then confirm the place."),selected:L("Místo je připravené. Změnu potvrď uložením nastavení.","Place ready. Save settings to keep the change.")};
  return <div className="sky-place-picker">
    <style>{`.sky-place-picker{min-width:0}.sky-place-picker label{display:flex;flex-direction:column;gap:6px}.sky-place-picker input{min-width:0}.sky-place-picker ul{list-style:none;padding:0;margin:8px 0}.sky-place-picker li{margin:0}.sky-place-picker .sky-place-result{display:flex;flex-direction:column;align-items:flex-start;gap:3px;text-align:left;min-height:44px;width:100%;padding:10px 0;border:0;background:transparent;color:inherit}.sky-place-picker .sky-place-result strong{font-weight:500;overflow-wrap:anywhere}.sky-place-picker .sky-place-result small{font-size:12px;opacity:.8}.sky-place-picker .sky-place-result:hover strong,.sky-place-picker .sky-place-result:focus-visible strong{text-decoration:underline;text-underline-offset:4px}.sky-place-picker .sky-place-summary{overflow-wrap:anywhere;font-variant-numeric:tabular-nums}.sky-place-picker details{margin-top:12px}.sky-place-picker summary{min-height:44px;cursor:pointer;align-content:center}.sky-place-picker .sky-place-credit{font-size:12px;line-height:1.6;margin:12px 0 0}.sky-place-picker .sky-place-credit a{color:inherit}.sky-place-picker .sky-settings-grid{margin-top:14px}`}</style>
    <label htmlFor={id}>{label}<input id={id} autoComplete="off" type="search" value={query} maxLength={120} placeholder={L("Město, země","Town or city, country")} aria-describedby={`${id}-status ${id}-privacy`} onChange={e=>editQuery(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();if(query!==value.name){setEditing(true);setRetry(n=>n+1);}}}}/></label>
    {status==="idle"&&validSkyPlace(value)&&<p className="sky-small sky-place-summary">{coordinates(value)} · {value.timeZone}</p>}
    <p className="sky-small" id={`${id}-status`} role="status">{messages[status]||""}</p>
    {results.length>0&&<ul aria-label={L("Nalezená místa","Matching places")}>{results.map((place,index)=><li key={`${place.name}-${index}`}><button className="sky-place-result" type="button" onClick={()=>choose(place)}><strong>{place.name}</strong><small>{coordinates(place)}</small></button></li>)}</ul>}
    {["error","limited","empty"].includes(status)&&<button type="button" onClick={()=>{setEditing(true);setRetry(n=>n+1);}}>{L("Zkusit znovu","Try again")}</button>}
    <details open={manualOpen} onToggle={e=>setManualOpen(e.currentTarget.open)}><summary>{L("Souřadnice a pásmo ručně","Enter coordinates and time zone manually")}</summary>
      <div className="sky-settings-grid"><label>{L("Zeměpisná šířka","Latitude")}<input type="number" inputMode="decimal" min="-90" max="90" step="any" value={manual.latitude} onChange={e=>editManual("latitude",e.target.value)}/></label>
      <label>{L("Zeměpisná délka","Longitude")}<input type="number" inputMode="decimal" min="-180" max="180" step="any" value={manual.longitude} onChange={e=>editManual("longitude",e.target.value)}/></label>
      <label className="wide">{L("Časové pásmo","Time zone")}<input list="sky-time-zones" value={manual.timeZone} placeholder="Europe/Prague" onChange={e=>editManual("timeZone",e.target.value)}/></label></div>
      <button type="button" disabled={!validSkyPlace({...manual,name:query.trim()})} onClick={useManual}>{L("Použít zadané souřadnice","Use these coordinates")}</button>
    </details>
    <p className="sky-place-credit" id={`${id}-privacy`}>{L("Hledání odesílá název místa a po výběru jeho souřadnice. Datum narození zůstává zde.","Search sends the place name and, after selection, its coordinates. Your birth date stays here.")} {L("Místa:","Places:")} <a href="https://photon.komoot.io/" target="_blank" rel="noopener noreferrer">Photon</a>, <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap</a>. {L("Pásmo:","Time zone:")} <a href="https://timeapi.io/" target="_blank" rel="noopener noreferrer">TimeAPI</a>.</p>
  </div>;
}
