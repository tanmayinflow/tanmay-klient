import test from "node:test";
import assert from "node:assert/strict";
import {createLatestSkyPlaceSearch,createSkyGeocoder,normalizeSkyPlaces,resolveSkyPlaceTimeZone,validSkyPlace} from "../src/shared/product/skyGeocoding.js";
import {createSkyTimeZoneHandler,SKY_TIMEZONE_API_URL} from "../src/shared/product/skyGeocodingApi.js";
import {skyBirthHasPlace,skyBirthUsesObservation,skyChangeObservation,skyPreparePlaceSettings} from "../src/shared/product/skyPlaceSettings.js";
import {emptySkyJournal,parseSkyJournal} from "../src/shared/product/skyJournal.js";

const feature=(name="Praha",latitude=50.087,longitude=14.421,country="Česko")=>({type:"Feature",properties:{name,country,state:name},geometry:{type:"Point",coordinates:[longitude,latitude]}});
const payload=(...features)=>({type:"FeatureCollection",features});
const response=data=>({ok:true,json:async()=>data});
const request=(query="latitude=50.087&longitude=14.421",options)=>new Request(`https://app.test/api/sky/timezone?${query}`,options);
const place={name:"Prague, Czechia",latitude:50.087,longitude:14.421,timeZone:"Europe/Prague"};
const berlin={name:"Berlin, Germany",latitude:52.52,longitude:13.4,timeZone:"Europe/Berlin"};

test("Photon coordinates preserve longitude/latitude order and ambiguous city choices",()=>{
  const rows=normalizeSkyPlaces(payload(feature(),feature("Praha",48.36,19.5,"Slovensko"),feature(),feature("Bad",91,14),{...feature("Area"),geometry:{type:"Polygon",coordinates:[]}}));
  assert.equal(rows.length,2);assert.equal(rows[0].latitude,50.087);assert.equal(rows[0].longitude,14.421);
  assert.notEqual(rows[0].name,rows[1].name);assert.equal(rows[0].timeZone,"");assert.equal(validSkyPlace(rows[0]),false);
  assert.throws(()=>normalizeSkyPlaces({results:[]}),/geocoding-response/);
});

test("search sends only a bounded place query, no credentials or account fields",async()=>{
  const calls=[],search=createSkyGeocoder({fetchImpl:async(url,options)=>{calls.push({url,options});return response(payload(feature()));}});
  assert.deepEqual(await search("Pr"),[]);assert.equal(calls.length,0);
  await search(" Praha ",{language:"cs",account:"private",date:"1990-01-01"});
  const u=new URL(calls[0].url);assert.deepEqual([...u.searchParams.keys()].sort(),["limit","q"]);
  assert.equal(u.searchParams.get("q"),"Praha");assert.equal(calls[0].options.credentials,"omit");assert.equal(calls[0].options.referrerPolicy,"no-referrer");
  await search("Berlin",{language:"en"});assert.equal(new URL(calls[1].url).searchParams.get("lang"),"en");
});

test("search cache is bounded, expires, and does not expose mutable shared results",async()=>{
  let now=0,calls=0;const search=createSkyGeocoder({maxEntries:2,ttl:10,now:()=>now,fetchImpl:async()=>{calls++;return response(payload(feature()));}});
  const first=await search("Praha");first[0].name="changed";
  assert.notEqual((await search("praha"))[0].name,"changed");assert.equal(calls,1);
  await search("Berlin");await search("Vienna");await search("Praha");assert.equal(calls,4);
  now=20;await search("Praha");assert.equal(calls,5);
});

test("provider failures are visible and never cached as an empty success",async()=>{
  let calls=0;const search=createSkyGeocoder({fetchImpl:async()=>++calls===1?{ok:false,status:429}:response(payload())});
  await assert.rejects(search("Praha"),/geocoding-rate-limit/);assert.deepEqual(await search("Praha"),[]);assert.equal(calls,2);
});

test("slow searches abort at the configured timeout",async()=>{
  const search=createSkyGeocoder({timeout:5,fetchImpl:async(_url,{signal})=>new Promise((_,reject)=>signal.addEventListener("abort",()=>reject(new DOMException("Aborted","AbortError")),{once:true}))});
  await assert.rejects(search("Praha"),/geocoding-timeout/);
});

test("superseded and cancelled searches cannot publish even when transport ignores abort",async()=>{
  const pending=[];const latest=createLatestSkyPlaceSearch(()=>new Promise((resolve,reject)=>pending.push({resolve,reject})));
  const old=latest.search("Prague"),current=latest.search("Paris");pending[1].resolve(["Paris"]);assert.deepEqual(await current,["Paris"]);
  pending[0].resolve(["Prague"]);assert.equal(await old,null);
  const cancelled=latest.search("Berlin");latest.cancel();pending[2].reject(new Error("network"));assert.equal(await cancelled,null);
});

test("timezone lookup sends only chosen public coordinates and rejects unknown zones",async()=>{
  let sent;const resolved=await resolveSkyPlaceTimeZone({...place,date:"1990-01-01",account:"private"},{fetchImpl:async(url)=>{sent=url;return response({timeZone:"Europe/Prague"});}});
  assert.equal(resolved.timeZone,"Europe/Prague");assert.equal(sent,"/api/sky/timezone?latitude=50.087&longitude=14.421");
  await assert.rejects(resolveSkyPlaceTimeZone(place,{fetchImpl:async()=>response({timeZone:"Mars/Olympus"})}),/geocoding-timezone/);
  await assert.rejects(resolveSkyPlaceTimeZone({...place,latitude:""}),/geocoding-coordinates/);
});

test("timezone proxy validates ranges, duplicate params and extra data without upstream calls",async()=>{
  let calls=0;const handle=createSkyTimeZoneHandler({fetchImpl:async()=>{calls++;return response({timezone:"Europe/Prague"});}});
  for(const query of ["latitude=&longitude=14","latitude=91&longitude=14","latitude=50&longitude=-181","latitude=NaN&longitude=14","latitude=50&longitude=14&birth=1990-01-01","latitude=50&latitude=51&longitude=14"]){assert.equal((await handle(request(query))).status,400);}
  assert.equal((await handle(request(undefined,{method:"POST"}))).status,405);assert.equal(calls,0);
});

test("timezone proxy fixes upstream destination and forwards no incoming cookies or headers",async()=>{
  let sent;const handle=createSkyTimeZoneHandler({fetchImpl:async(url,options)=>{sent={url,options};return response({timezone:"Europe/Prague",local_time:"ignored",account:"ignored"});}});
  const result=await handle(request(undefined,{headers:{Cookie:"session=private",Authorization:"Bearer private"}}));
  assert.deepEqual(await result.json(),{timeZone:"Europe/Prague"});assert.equal(sent.url,`${SKY_TIMEZONE_API_URL}?latitude=50.087&longitude=14.421`);
  assert.deepEqual(sent.options.headers,{Accept:"application/json"});assert.equal(sent.options.credentials,"omit");
});

test("timezone proxy handles invalid data and network failures without leaking upstream response",async()=>{
  for(const fetchImpl of [async()=>response({timezone:"Not/AZone"}),async()=>response({}),async()=>({ok:false,status:500}),async()=>{throw new Error("secret upstream detail");}]){
    const result=await createSkyTimeZoneHandler({fetchImpl})(request());assert.equal(result.status,503);assert.deepEqual(await result.json(),{error:"timezone-unavailable"});
  }
});

test("slow timezone provider returns a bounded failure for the manual fallback",async()=>{
  const handle=createSkyTimeZoneHandler({timeout:5,fetchImpl:async(_url,{signal})=>new Promise((_,reject)=>signal.addEventListener("abort",()=>reject(new DOMException("Aborted","AbortError")),{once:true}))});
  assert.equal((await handle(request())).status,503);
});

test("timezone cache is bounded and expires rather than growing per selected coordinate",async()=>{
  let now=0,calls=0;const handle=createSkyTimeZoneHandler({maxEntries:1,ttl:10,now:()=>now,fetchImpl:async()=>{calls++;return response({timezone:"Europe/Prague"});}});
  await handle(request());await handle(request());assert.equal(calls,1);
  await handle(request("latitude=51&longitude=14"));await handle(request());assert.equal(calls,3);
  now=20;await handle(request());assert.equal(calls,4);
});

test("timezone proxy bounds uncached requests per authenticated caller without forwarding identity",async()=>{
  let now=0,calls=0;const handle=createSkyTimeZoneHandler({rateLimit:1,rateWindow:1000,now:()=>now,fetchImpl:async()=>{calls++;return response({timezone:"Europe/Prague"});}});
  assert.equal((await handle(request(),{rateKey:"a"})).status,200);
  assert.equal((await handle(request(),{rateKey:"a"})).status,200,"a cache hit does not use provider quota");
  const limited=await handle(request("latitude=51&longitude=14"),{rateKey:"a"});assert.equal(limited.status,429);assert.equal(limited.headers.get("Retry-After"),"1");
  assert.equal((await handle(request("latitude=51&longitude=14"),{rateKey:"b"})).status,200);assert.equal(calls,2);
  now=1001;assert.equal((await handle(request("latitude=52&longitude=14"),{rateKey:"a"})).status,200);
});

test("new birth uses observing place while its unknown time and private data stay intact",()=>{
  const journal=emptySkyJournal();journal.settings.birth.date="1990-01-01";journal.settings.birth.time="";
  const original=structuredClone(journal.settings),saved=skyPreparePlaceSettings(journal.settings);
  assert.equal(skyBirthUsesObservation(original),true);assert.equal(saved.birth.place,original.location.name);assert.equal(saved.birth.time,"");assert.equal(saved.birth.timeKnown,false);
  assert.deepEqual(journal.settings,original);assert.equal(skyBirthHasPlace(original.birth),false);
});

test("a fresh form outside Prague can enter birth date without inventing a separate birthplace",()=>{
  const settings=emptySkyJournal().settings;settings.location=berlin;
  const draft=skyPreparePlaceSettings(settings);draft.birth.date="1990-01-01";
  assert.equal(skyBirthUsesObservation(draft),true);assert.equal(draft.birth.timeZone,"Europe/Berlin");assert.equal(draft.birth.place,berlin.name);
});

test("existing distinct or incomplete birth places are never silently replaced",()=>{
  const settings=emptySkyJournal().settings;settings.birth={...settings.birth,date:"1990-01-01",place:"Tokyo",latitude:35.68,longitude:139.76,timeZone:"Asia/Tokyo"};
  assert.equal(skyBirthUsesObservation(settings),false);assert.deepEqual(skyPreparePlaceSettings(settings).birth,settings.birth);assert.deepEqual(skyChangeObservation(settings,berlin,{preserveBirth:true}).birth,settings.birth);
  settings.birth={...settings.birth,place:"",latitude:"",longitude:""};assert.equal(skyBirthUsesObservation(settings),false);assert.deepEqual(skyPreparePlaceSettings(settings).birth,settings.birth);
});

test("a legacy timezone-only birth draft is preserved even before a date is entered",()=>{
  const settings=emptySkyJournal().settings;settings.birth.timeZone="Asia/Tokyo";
  assert.equal(skyBirthUsesObservation(settings),false);assert.deepEqual(skyPreparePlaceSettings(settings).birth,settings.birth);
  assert.deepEqual(skyChangeObservation(settings,berlin).birth,settings.birth);
});

test("travelling after a saved birth preserves natal location while a fresh form can reuse one place",()=>{
  const saved=skyPreparePlaceSettings(emptySkyJournal().settings);saved.birth.date="1990-01-01";
  const travelled=skyChangeObservation(saved,berlin,{preserveBirth:true});assert.equal(travelled.location.name,berlin.name);assert.equal(travelled.birth.place,saved.birth.place);assert.equal(travelled.birth.locationMode,"independent");assert.equal(skyBirthUsesObservation(travelled),false);
  assert.equal(skyBirthUsesObservation(skyChangeObservation(saved,{...saved.location,name:"Prague"},{preserveBirth:true})),true);
  const fresh=skyChangeObservation(emptySkyJournal().settings,berlin);assert.equal(fresh.birth.place,berlin.name);assert.equal(skyBirthUsesObservation(fresh),true);
});

test("journal parsing retains independent birth choice without changing private records",()=>{
  const journal=emptySkyJournal();journal.settings.birth={...journal.settings.birth,locationMode:"independent",place:"Berlin",latitude:52.52,longitude:13.4,timeZone:"Europe/Berlin"};
  journal.intentions={"2026-10":"private intention"};journal.dreams=[{time:1770000000000,text:"private dream"}];
  const parsed=parseSkyJournal(journal);assert.equal(skyBirthUsesObservation(parsed.settings),false);assert.deepEqual(parsed.intentions,journal.intentions);assert.deepEqual(parsed.dreams,journal.dreams);
});
