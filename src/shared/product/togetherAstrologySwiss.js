import {SwissEphemeris} from "@swisseph/browser";

// Swiss Ephemeris 2.10.03, compiled to WebAssembly by @swisseph/browser 1.4.0.
// AGPL-3.0. Production distribution needs the project's explicit licence choice.
// We deliberately request its built-in Moshier theory: no CDN, no silent fallback.
let engine=null,initializing=null;
export const SWISS_FLAGS=4|256;
export const DAY_MS=86400000;
export const julianDay=date=>date.getTime()/DAY_MS+2440587.5;
export const dateFromJulian=jd=>new Date((jd-2440587.5)*DAY_MS);
export async function initAstrologyEngine({wasmPath}={}){
  if(engine)return astrologyEngineInfo();
  if(!initializing)initializing=(async()=>{
    const instance=new SwissEphemeris();
    const path=wasmPath||(await import("@swisseph/browser/dist/swisseph.wasm?url")).default;
    await instance.init(path);
    instance.setSiderealMode(1);
    engine=instance;
    return astrologyEngineInfo();
  })().catch(error=>{initializing=null;throw error;});
  return initializing;
}
export function swissEngine(){
  if(!engine)throw new Error("Swiss Ephemeris není načtená. Nejdřív zavolejte initAstrologyEngine().");
  return engine;
}
export function astrologyEngineInfo(){return {name:"Swiss Ephemeris",version:engine?.version()||null,theory:"Moshier",ayanamsa:"Lahiri",range:[1900,2100],ready:!!engine,license:"AGPL-3.0"};}
export function swissPosition(id,date,flags=SWISS_FLAGS){
  const result=swissEngine().calculatePosition(julianDay(date),id,flags);
  if((result.flags&7)!==4)throw new Error("Výpočet neočekávaně změnil efemeridu.");
  return result;
}
export function swissAyanamsa(date,mode="lahiri"){
  const swe=swissEngine();swe.setSiderealMode(mode==="true-chitra"?27:1);
  // Apparent longitude uses nutation; the explicit UT function applies the
  // matching convention, unlike subtracting the mean ayanamsa unconditionally.
  return swe.getAyanamsaExUt(julianDay(date),SWISS_FLAGS);
}
