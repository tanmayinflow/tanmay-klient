// Photon permits reasonable public project use; its OSM data require attribution.
// Only the place query leaves the device. Selected public coordinates are sent to
// our timezone route, never birth dates, account IDs, or device geolocation.
export const SKY_GEOCODING_PUBLIC_URL="https://photon.komoot.io/api/";
export const SKY_TIMEZONE_ROUTE="/api/sky/timezone";
const text=(value,max=120)=>typeof value==="string"?value.trim().slice(0,max):"";
const zoneValid=value=>{try{return typeof value==="string"&&value.length<100&&Boolean(new Intl.DateTimeFormat("en",{timeZone:value}));}catch{return false;}};
export const validSkyCoordinates=place=>Boolean(place&&place.latitude!==""&&place.longitude!==""&&place.latitude!=null&&place.longitude!=null&&Number.isFinite(Number(place.latitude))&&Math.abs(Number(place.latitude))<=90&&Number.isFinite(Number(place.longitude))&&Math.abs(Number(place.longitude))<=180);
export const validSkyPlace=place=>Boolean(validSkyCoordinates(place)&&text(place.name)&&zoneValid(place.timeZone));
export function normalizeSkyPlaces(payload){
  if(!payload||payload.type!=="FeatureCollection"||!Array.isArray(payload.features))throw new Error("geocoding-response");
  const seen=new Set();
  return payload.features.slice(0,100).filter(row=>row?.geometry?.type==="Point").map(row=>{
    const p=row.properties||{},name=text(p.name||p.city),region=text(p.state||p.county||p.city),country=text(p.country);
    const label=[...new Set([name,region,country].filter(Boolean))].join(", ");
    return {name:label.slice(0,120),city:name,region,country,latitude:row.geometry.coordinates?.[1],longitude:row.geometry.coordinates?.[0],timeZone:""};
  }).filter(place=>{
    if(!place.city||!validSkyCoordinates(place))return false;
    const key=`${place.name}:${place.latitude}:${place.longitude}:${place.timeZone}`;
    if(seen.has(key))return false;seen.add(key);return true;
  }).slice(0,8).map(place=>({...place,latitude:Number(place.latitude),longitude:Number(place.longitude)}));
}
export function createSkyGeocoder({endpoint=SKY_GEOCODING_PUBLIC_URL,fetchImpl=globalThis.fetch,now=Date.now,ttl=30*60000,maxEntries=40,timeout=8000}={}){
  const cache=new Map(),limit=Math.max(1,Math.min(100,maxEntries));
  return async function search(query,{language="cs",signal}={}){
    const name=text(query).replace(/\s+/g," "),lang=language==="en"?"en":"cs";
    if(name.length<3)return [];
    if(signal?.aborted)throw new DOMException("Aborted","AbortError");
    const key=`${lang}:${name.toLocaleLowerCase()}`,cached=cache.get(key);
    if(cached&&now()-cached.time<ttl){cache.delete(key);cache.set(key,cached);return cached.rows.map(row=>({...row}));}
    if(cached)cache.delete(key);
    const controller=new AbortController(),abort=()=>controller.abort();
    signal?.addEventListener("abort",abort,{once:true});
    let timedOut=false;
    const timer=setTimeout(()=>{timedOut=true;controller.abort();},timeout);
    try{
      // The public instance supports English and local names, not a Czech lang code.
      const params=new URLSearchParams({q:name,limit:"8"});if(lang==="en")params.set("lang","en");
      const response=await fetchImpl(`${endpoint}?${params}`,{signal:controller.signal,credentials:"omit",referrerPolicy:"no-referrer",headers:{Accept:"application/json"}});
      if(!response.ok)throw new Error(response.status===429?"geocoding-rate-limit":response.status===503?"geocoding-unavailable":"geocoding-network");
      const rows=normalizeSkyPlaces(await response.json());
      if(controller.signal.aborted)throw new DOMException("Aborted","AbortError");
      cache.set(key,{time:now(),rows});
      while(cache.size>limit)cache.delete(cache.keys().next().value);
      return rows.map(row=>({...row}));
    }catch(error){if(timedOut)throw new Error("geocoding-timeout");throw error;}
    finally{clearTimeout(timer);signal?.removeEventListener("abort",abort);}
  };
}
export async function resolveSkyPlaceTimeZone(place,{fetchImpl=globalThis.fetch,signal,timeout=8000}={}){
  if(!validSkyCoordinates(place))throw new Error("geocoding-coordinates");
  if(signal?.aborted)throw new DOMException("Aborted","AbortError");
  const controller=new AbortController(),abort=()=>controller.abort();signal?.addEventListener("abort",abort,{once:true});
  const timer=setTimeout(abort,timeout);
  try{
    const params=new URLSearchParams({latitude:String(Number(place.latitude)),longitude:String(Number(place.longitude))});
    const response=await fetchImpl(`${SKY_TIMEZONE_ROUTE}?${params}`,{signal:controller.signal,credentials:"same-origin",referrerPolicy:"no-referrer",headers:{Accept:"application/json"}});
    if(!response.ok)throw new Error("geocoding-timezone");
    const result=await response.json();if(!zoneValid(result.timeZone))throw new Error("geocoding-timezone");
    if(controller.signal.aborted)throw new DOMException("Aborted","AbortError");
    return {...place,timeZone:result.timeZone};
  }finally{clearTimeout(timer);signal?.removeEventListener("abort",abort);}
}
// A cancelled or superseded request cannot publish results, even if the transport
// ignores AbortSignal. Each picker owns its sequence and controller.
export function createLatestSkyPlaceSearch(search){
  let sequence=0,controller;
  return {cancel(){sequence++;controller?.abort();},async search(query,options={}){
    const current=++sequence;controller?.abort();controller=new AbortController();
    try{const results=await search(query,{...options,signal:controller.signal});return current===sequence?results:null;}
    catch(error){if(current!==sequence||error?.name==="AbortError")return null;throw error;}
  }};
}
