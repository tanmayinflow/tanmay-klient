import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {initAstrologyEngine,astrologyAt,dateForAstrology,shiftAstrologyDay,angleDistance,majorAspects,planetDignity,chitraAyanamsa} from "../src/shared/product/togetherAstrology.js";
await initAstrologyEngine({wasmPath:`data:application/wasm;base64,${(await readFile(new URL(import.meta.resolve("@swisseph/browser/dist/swisseph.wasm")))).toString("base64")}`});

test("astrology uses a chosen local day and rejects invalid or unsupported calendar inputs",()=>{
  assert.equal(dateForAstrology("2024-02-29",18.5)?.getHours(),18);
  assert.equal(dateForAstrology("2024-02-29",18.5)?.getMinutes(),30);
  for(const day of ["2026-02-29","2026-13-01","2026-09-31","2026-9-28","1899-12-31","2101-01-01",""])assert.equal(dateForAstrology(day),null);
  assert.equal(dateForAstrology("2026-09-28",24),null);
  assert.equal(shiftAstrologyDay("2024-03-01",-1),"2024-02-29");
  assert.equal(shiftAstrologyDay("2026-12-31",1),"2027-01-01");
  assert.equal(shiftAstrologyDay("2100-12-31",1),"2100-12-31");
});

test("apparent Sun longitude matches the USNO March 2024 equinox",()=>{
  // USNO: 20 March 2024, 03:06 UT. Independent boundary catches an
  // accidental heliocentric or J2000 (rather than of-date) calculation.
  const sky=astrologyAt(new Date("2024-03-20T03:06:00Z"));
  assert.ok(angleDistance(sky.planets[0].longitude,0)<.01);
});

test("nonexistent Czech daylight-saving clock times are rejected instead of silently relabelled",()=>{
  const previous=process.env.TZ;
  try{
    process.env.TZ="Europe/Prague";
    assert.equal(dateForAstrology("2026-03-29",2.5),null);
    assert.equal(dateForAstrology("2026-03-29",3.5)?.getHours(),3);
  }finally{if(previous===undefined)delete process.env.TZ;else process.env.TZ=previous;}
});

test("Mercury matches the independently tabulated Swiss Ephemeris retrograde position",()=>{
  // Astrodienst 2024 ephemeris: 28 Nov 00:00 UT, 22°22′ Sagittarius.
  const sky=astrologyAt(new Date("2024-11-28T00:00:00Z"));
  const mercury=sky.planets.find(p=>p.id==="Mercury");
  assert.ok(angleDistance(mercury.longitude,240+22+22/60)<.05);
  assert.equal(mercury.retrograde,true);
  assert.ok(mercury.speed<0);
});

test("lunar illumination and tithi wrap at the 8 April 2024 new Moon",()=>{
  const before=astrologyAt(new Date("2024-04-08T18:20:00Z"),"jyotish");
  const after=astrologyAt(new Date("2024-04-08T18:23:00Z"),"jyotish");
  assert.equal(before.moon.light,0);
  assert.equal(before.moon.index,0);
  assert.equal(before.jyotish.tithi,30);
  assert.equal(after.jyotish.tithi,1);
  assert.equal(before.jyotish.tithiName,"Amávásjá");
  assert.equal(after.jyotish.tithiName,"Pratipadá");
});

test("sidereal frame changes sign positions without changing the physical phase or angular separation",()=>{
  const date=new Date("2026-09-28T10:00:00Z"),west=astrologyAt(date),vedic=astrologyAt(date,"jyotish");
  assert.ok(vedic.ayanamsa>24&&vedic.ayanamsa<25);
  assert.ok(chitraAyanamsa(new Date("2000-01-01T12:00:00Z"))>23.8);
  assert.ok(chitraAyanamsa(new Date("2000-01-01T12:00:00Z"))<23.9);
  assert.equal(west.moon.phase,vedic.moon.phase);
  for(let i=0;i<10;i++){
    assert.ok(angleDistance(west.planets[i].longitude-vedic.ayanamsa,vedic.planets[i].longitude)<1e-8);
    assert.ok(vedic.planets[i].longitude>=0&&vedic.planets[i].longitude<360);
  }
  assert.equal(west.planets[0].sign,6);
  assert.equal(vedic.planets[0].sign,5);
  assert.ok(vedic.jyotish.nakshatra>=0&&vedic.jyotish.nakshatra<27);
  assert.ok(vedic.jyotish.pada>=1&&vedic.jyotish.pada<=4);
});

test("selected time changes real lunar position and next phase stays in the future",()=>{
  const am=astrologyAt(new Date("2026-09-28T00:00:00Z")),pm=astrologyAt(new Date("2026-09-28T23:30:00Z"));
  assert.ok(angleDistance(am.planets[1].longitude,pm.planets[1].longitude)>10);
  assert.ok(new Date(pm.moon.next)>new Date(pm.date));
  assert.ok(new Date(pm.moon.next)-new Date(pm.date)<10*86400000);
});

test("aspect application does not misclassify an exact crossing within the next hour",()=>{
  const applying=majorAspects([{id:"A",longitude:0,speed:0},{id:"B",longitude:59.99,speed:1}]);
  assert.equal(applying[0].id,"sextile");
  assert.equal(applying[0].applying,true);
  const separating=majorAspects([{id:"A",longitude:0,speed:0},{id:"B",longitude:60.01,speed:1}]);
  assert.equal(separating[0].applying,false);
  assert.equal(majorAspects([{id:"A",longitude:359,speed:1},{id:"B",longitude:1,speed:0}])[0].applying,true);
  assert.equal(majorAspects([{id:"A",longitude:359,speed:-1},{id:"B",longitude:1,speed:0}])[0].applying,false);
});

test("traditional lenses keep their dignity categories distinct",()=>{
  assert.equal(planetDignity("Mercury",8,"hellenistic"),"detriment");
  assert.equal(planetDignity("Mercury",8,"jyotish"),"guest");
  assert.equal(planetDignity("Jupiter",3,"jyotish"),"exaltation");
  assert.equal(planetDignity("Venus",5,"jyotish"),"fall");
  assert.equal(planetDignity("Saturn",10,"jyotish"),"domicile");
  const sky=astrologyAt(new Date("2026-09-28T12:00:00Z"),"hellenistic");
  assert.ok(sky.signAspects.length>sky.aspects.length);
  assert.ok(sky.signAspects.every(a=>!["Uranus","Neptune","Pluto"].includes(a.a)&&!["Uranus","Neptune","Pluto"].includes(a.b)));
});
