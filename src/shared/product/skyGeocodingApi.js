// The TimeAPI endpoint does not enable browser CORS. This narrow read-only route
// forwards only validated coordinates, without cookies, birthdays or account data.
export const SKY_TIMEZONE_API_URL="https://timeapi.io/api/v1/timezone/coordinate";
export function createSkyTimeZoneHandler({fetchImpl=globalThis.fetch,now=Date.now,timeout=6500,maxEntries=100,ttl=86400000,rateLimit=30,rateWindow=60000}={}){
  const cache=new Map(),rates=new Map();
  const reply=(data,status=200)=>Response.json(data,{status,headers:{"Cache-Control":status===200?"public, max-age=3600":"no-store"}});
  return async(request,{rateKey="shared"}={})=>{
    if(request.method!=="GET")return reply({error:"method-not-allowed"},405);
    const url=new URL(request.url),lat=url.searchParams.get("latitude"),lon=url.searchParams.get("longitude");
    if([...url.searchParams.keys()].some(key=>!["latitude","longitude"].includes(key))||url.searchParams.getAll("latitude").length!==1||url.searchParams.getAll("longitude").length!==1||!lat?.trim()||!lon?.trim()||!Number.isFinite(Number(lat))||Math.abs(Number(lat))>90||!Number.isFinite(Number(lon))||Math.abs(Number(lon))>180)return reply({error:"invalid-coordinates"},400);
    const key=`${Number(lat)},${Number(lon)}`,cached=cache.get(key);
    if(cached&&now()-cached.time<ttl){cache.delete(key);cache.set(key,cached);return reply({timeZone:cached.zone});}
    // Per authenticated caller and worker isolate. Identity stays here; only
    // uncached upstream requests count, and the caller map is memory bounded.
    const caller=String(rateKey).slice(0,200),previous=rates.get(caller),time=now();
    const rate=previous&&time-previous.start<rateWindow?previous:{start:time,count:0};
    if(rate.count>=rateLimit)return Response.json({error:"timezone-rate-limit"},{status:429,headers:{"Cache-Control":"no-store","Retry-After":String(Math.max(1,Math.ceil((rateWindow-(time-rate.start))/1000)))}});
    rate.count++;rates.delete(caller);rates.set(caller,rate);while(rates.size>200)rates.delete(rates.keys().next().value);
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeout);
    try{
      const params=new URLSearchParams({latitude:String(Number(lat)),longitude:String(Number(lon))});
      const result=await fetchImpl(`${SKY_TIMEZONE_API_URL}?${params}`,{signal:controller.signal,headers:{Accept:"application/json"},credentials:"omit",referrerPolicy:"no-referrer"});
      if(!result.ok)return reply({error:"timezone-unavailable"},503);
      const data=await result.json(),zone=data?.timezone;
      if(typeof zone!=="string"||!zone||zone.length>99)return reply({error:"timezone-unavailable"},503);
      new Intl.DateTimeFormat("en",{timeZone:zone});
      if(controller.signal.aborted)return reply({error:"timezone-unavailable"},503);
      cache.set(key,{time:now(),zone});while(cache.size>Math.max(1,Math.min(500,maxEntries)))cache.delete(cache.keys().next().value);
      return reply({timeZone:zone});
    }catch{return reply({error:"timezone-unavailable"},503);}finally{clearTimeout(timer);}
  };
}
