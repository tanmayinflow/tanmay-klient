import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {initAstrologyEngine,astrologyAt,dateForAstrology,angleDistance,lahiriAyanamsa,chitraAyanamsa} from "../src/shared/product/togetherAstrology.js";
import {astrologyDayDetails,panchangaAt,panchangaDay,solarDay,planetaryHoursAt,eclipsesBetween,solarSeasonsBetween,natalAt,annualProfection,vimshottariDasha,internalDayAt,expectedSwara} from "../src/shared/product/togetherAstrologyCalendar.js";
import {zonedDateCandidates,dateInZone} from "../src/shared/product/togetherAstrologyTime.js";
import {astrologyPeriod,astrologyPeriodBounds} from "../src/shared/product/togetherAstrologyOverview.js";

await initAstrologyEngine({wasmPath:`data:application/wasm;base64,${(await readFile(new URL(import.meta.resolve("@swisseph/browser/dist/swisseph.wasm")))).toString("base64")}`});
const prague={latitude:50.0755,longitude:14.4378,timeZone:"Europe/Prague"};
test("Swiss UT J2000 apparent Sun and actual Lahiri differ from True Citra",()=>{
  const d=new Date("2000-01-01T12:00:00Z"),sky=astrologyAt(d,"jyotish");
  assert.equal(sky.engine.name,"Swiss Ephemeris");assert.equal(sky.engine.theory,"Moshier");
  // Fixed regression for apparent geocentric coordinates. Independent USNO
  // and NASA timings are checked below; this constant is not a new source.
  assert.ok(angleDistance(sky.planets[0].tropical,280.36892)<.00001);
  assert.ok(lahiriAyanamsa(d)>23.85&&lahiriAyanamsa(d)<23.86);
  assert.ok(Math.abs(lahiriAyanamsa(d)-chitraAyanamsa(d))>.001);
  for(const mode of ["mean","true"]){const nodes=astrologyAt(d,"jyotish",{nodeMode:mode}).nodes;assert.ok(Math.abs(angleDistance(nodes[0].longitude,nodes[1].longitude)-180)<1e-8);assert.equal(nodes[0].mode,mode);}
});
test("chosen zones reject spring gaps and identify ambiguous autumn birth clocks",()=>{
  assert.equal(dateForAstrology("2026-03-29",2.5,"Europe/Prague"),null);
  assert.equal(dateForAstrology("2026-03-29",3.5,"Europe/Prague").toISOString(),"2026-03-29T01:30:00.000Z");
  assert.equal(zonedDateCandidates("2026-10-25",2.5,"Europe/Prague").length,2);
  assert.equal(dateInZone("2026-10-25",2.5,"Europe/Prague",{disambiguation:"reject"}),null);
  assert.equal(dateForAstrology("2026-09-30",12,"Asia/Kolkata").toISOString(),"2026-09-30T06:30:00.000Z");
  assert.equal(astrologyDayDetails(new Date("2026-09-29T22:30:00Z"),{location:{latitude:"",longitude:"",timeZone:"Europe/Prague"}}).day,"2026-09-30");
  const apia={latitude:-13.8333,longitude:-171.75,timeZone:"Pacific/Apia"};
  assert.equal(astrologyDayDetails(new Date("2011-12-29T22:00:00Z"),{location:apia}).day,"2011-12-29");
  const boundary=astrologyPeriodBounds("2011-12-29","day",{timeZone:apia.timeZone});assert.equal(boundary.end-boundary.start,86400000);
  assert.throws(()=>astrologyPeriodBounds("2011-12-30","day",{timeZone:apia.timeZone}),RangeError);
  const previous=process.env.TZ;try{process.env.TZ="Pacific/Apia";assert.equal(astrologyPeriodBounds("2011-12-30","day",{timeZone:"Europe/Prague"}).end-astrologyPeriodBounds("2011-12-30","day",{timeZone:"Europe/Prague"}).start,86400000);}finally{if(previous===undefined)delete process.env.TZ;else process.env.TZ=previous;}
});
test("solar crossings are geographic and polar days never invent sunrise",()=>{
  // USNO API retrieved 2026-09-30, Prague 50.0755N 14.4378E, tz=0:
  // https://aa.usno.navy.mil/api/rstt/oneday?date=2024-03-20&coords=50.0755,14.4378&tz=0
  // Apparent sunrise 05:04 UTC, sunset 17:16 UTC (minute-rounded).
  const solar=solarDay("2024-03-20",prague);
  assert.equal(solar.status,"ok");assert.ok(Math.abs(Date.parse(solar.sunrise)-Date.parse("2024-03-20T05:04:00Z"))<60000);assert.ok(Math.abs(Date.parse(solar.sunset)-Date.parse("2024-03-20T17:16:00Z"))<60000);
  const center=solarDay("2024-03-20",prague,"hindu-center");assert.ok(Date.parse(center.sunrise)>Date.parse(solar.sunrise));
  const tromso={latitude:69.6492,longitude:18.9553,timeZone:"Europe/Oslo"};
  assert.equal(solarDay("2026-06-21",tromso).status,"polar-day");assert.equal(solarDay("2026-12-21",tromso).status,"polar-night");
  assert.equal(planetaryHoursAt(new Date("2026-06-21T12:00:00Z"),tromso).hours.length,0);
});
test("planetary hours use unequal day/night twelfths and the preceding planetary day before sunrise",()=>{
  const hours=planetaryHoursAt(new Date("2026-09-30T10:00:00Z"),prague);
  assert.equal(hours.hours.length,24);assert.equal(hours.hours[0].planet,"Mercury");assert.equal(hours.dayPlanet,"Mercury");
  assert.equal(hours.hours[1].planet,"Moon");assert.equal(hours.hours.at(-1).end,hours.nextSunrise);
  for(let i=1;i<24;i++)assert.equal(hours.hours[i].start,hours.hours[i-1].end);
  const early=planetaryHoursAt(new Date("2026-09-30T00:30:00Z"),prague);assert.equal(early.dayPlanet,"Mars");assert.equal(early.current.daytime,false);
  const internal=internalDayAt(new Date("2026-09-30T10:00:00Z"),prague);assert.equal(internal.segments.length,12);assert.equal(internal.current.sign,null);assert.equal(internal.current.nostril,null);
  const midnightSun=planetaryHoursAt(new Date("2026-05-17T12:00:00Z"),{latitude:69.6492,longitude:18.9553,timeZone:"Europe/Oslo"});assert.equal(midnightSun.status,"ok");assert.equal(midnightSun.hours.length,24);assert.ok(Date.parse(midnightSun.sunset)>Date.parse(midnightSun.sunrise));assert.ok(Date.parse(midnightSun.nextSunrise)>Date.parse(midnightSun.sunset));
});
test("panchanga changes around the independently timed April 2024 new Moon",()=>{
  const before=panchangaAt(new Date("2024-04-08T18:20:00Z")),after=panchangaAt(new Date("2024-04-08T18:23:00Z"));
  assert.equal(before.tithi,30);assert.equal(before.karana,59);assert.equal(before.karanaName,"Nága");assert.equal(after.tithi,1);assert.equal(after.karana,0);assert.equal(after.karanaName,"Kimstughna");
  const day=panchangaDay(new Date("2024-04-08T12:00:00Z"),prague);
  assert.ok(Math.abs(Date.parse(day.tithiEnd)-Date.parse("2024-04-08T18:21:00Z"))<3*60000);
  for(const t of day.transitions){assert.equal(panchangaAt(new Date(Date.parse(t.time)-2000))[t.type],t.from);assert.equal(panchangaAt(new Date(Date.parse(t.time)+2000))[t.type],t.to);}
  assert.equal(day.calendar,"tithi-proxy");assert.equal(day.dayPlanet,"Moon");assert.ok(day.yoga>=0&&day.yoga<27);
});
test("NASA April 2024 total eclipse is global, locally visible in Dallas but not Prague",()=>{
  // Eclipse Predictions by Fred Espenak (NASA's GSFC): catalog greatest TD
  // 18:18:29 minus Delta T 74 seconds = 18:17:15 UT.
  // https://eclipse.gsfc.nasa.gov/SEcat5/SE2001-2100.html (entry 09561).
  const start=new Date("2024-04-08T00:00:00Z"),end=new Date("2024-04-09T00:00:00Z");
  const e=eclipsesBetween(start,end,prague).find(e=>e.kind==="solar");assert.equal(e.type,"total");assert.equal(e.visible,false);
  assert.ok(Math.abs(Date.parse(e.time)-Date.parse("2024-04-08T18:17:15Z"))<2*60000);
  assert.equal(eclipsesBetween(new Date(Date.parse(e.time)+500),end).length,0);
  assert.equal(eclipsesBetween(new Date(Date.parse(e.time)-500),end).length,1);
  assert.equal(eclipsesBetween(start,end,{latitude:32.7767,longitude:-96.797,timeZone:"America/Chicago"})[0].visible,true);
  const penumbral=eclipsesBetween(new Date("2024-03-25T00:00:00Z"),new Date("2024-03-26T00:00:00Z"),prague).find(e=>e.kind==="lunar");assert.equal(penumbral.type,"penumbral");
  // NASA GSFC lunar catalog 09704: 07:13:59 TD minus Delta T 74 s.
  assert.ok(Math.abs(Date.parse(penumbral.time)-Date.parse("2024-03-25T07:12:45Z"))<2*60000);
  assert.equal(eclipsesBetween(new Date("2023-04-20T00:00:00Z"),new Date("2023-04-21T00:00:00Z"))[0].type,"hybrid");
});
test("natal techniques stay unavailable for unknown, ambiguous or incomplete birth details",()=>{
  const now=new Date("2026-09-30T10:00:00Z"),base={date:"1990-01-01",time:"12:00",...prague,precision:"exact"};
  assert.equal(natalAt(now,null).status,"missing-birth");assert.equal(natalAt(now,{...base,precision:"unknown"}).ascendant,null);
  assert.equal(natalAt(now,{...base,latitude:90}).status,"undefined-polar-ascendant");
  assert.equal(natalAt(new Date("2027-01-01"),{...base,date:"2026-10-25",time:"02:30"}).status,"ambiguous-birth-time");
  const noon=natalAt(now,base);assert.equal(noon.sect,"day");assert.equal(noon.profection.age,36);assert.equal(noon.profection.house,1);assert.ok(noon.dasha.current);assert.equal(noon.gochara.length,12);
  const night=natalAt(now,{...base,time:"00:00"});assert.equal(night.sect,"night");
  assert.equal(natalAt(now,{...base,date:"1900-01-01",time:"00:00"}).status,"ok");
  assert.ok(astrologyAt(dateForAstrology("2100-12-31",23.5,"America/New_York")).planets.length===10);
  const sun=noon.tropicalPlanets[0].longitude,moon=noon.tropicalPlanets[1].longitude;assert.ok(angleDistance(noon.lots.fortune.longitude,noon.ascendant+moon-sun)<1e-8);
});
test("profection changes on the civil birthday; Vimshottari preserves its 120-year sequence",()=>{
  const birth={date:"2000-05-20",timeZone:"Europe/Prague"};assert.equal(annualProfection(birth,0,new Date("2026-05-19T12:00:00Z")).house,2);assert.equal(annualProfection(birth,0,new Date("2026-05-20T12:00:00Z")).house,3);
  const d=vimshottariDasha(0,new Date("2000-01-01T00:00:00Z"),new Date("2001-01-01T00:00:00Z"));assert.equal(d.lord,"Ketu");assert.equal(d.periods[1].lord,"Venus");assert.equal(d.periods.slice(0,9).reduce((s,p)=>s+p.years,0),120);
  assert.equal(expectedSwara(1).nostril,"left");assert.equal(expectedSwara(16).nostril,"right");assert.equal(expectedSwara(4).nostril,"right");
});
test("month periods include every lunar quarter, year bounds and Monday weeks preserve chosen zones",()=>{
  const bounds=astrologyPeriodBounds("2026-09-30","week",{timeZone:"Europe/Prague"});assert.equal(bounds.firstDay,"2026-09-28");assert.equal(bounds.lastDay,"2026-10-05");
  const year=astrologyPeriodBounds("2024-06-15","year",{timeZone:"UTC"});assert.equal(year.end-year.start,366*86400000);
  const period=astrologyPeriod("2026-09-30","jyotish","month",{timeZone:"Europe/Prague"});assert.equal(period.firstDay,"2026-09-01");assert.ok(period.events.filter(e=>e.type==="phase").length>=4);assert.ok(period.events.every(e=>e.time>=period.start&&e.time<period.end));
  assert.deepEqual(astrologyPeriod("2026-09-30","western","month",{timeZone:"Europe/Prague"}).events.filter(e=>e.type==="tithi").map(e=>[e.time,e.to]),period.events.filter(e=>e.type==="tithi").map(e=>[e.time,e.to]));
  const seasons=solarSeasonsBetween(new Date("2024-01-01T00:00:00Z"),new Date("2025-01-01T00:00:00Z"));assert.equal(seasons.length,4);assert.equal(seasons[0].id,"march-equinox");assert.ok(Math.abs(Date.parse(seasons[0].time)-Date.parse("2024-03-20T03:06:00Z"))<3*60000);
  // https://aa.usno.navy.mil/api/seasons?year=2024 (retrieved 2026-09-30).
  assert.ok(Math.abs(Date.parse(seasons[1].time)-Date.parse("2024-06-20T20:51:00Z"))<60000);assert.ok(Math.abs(Date.parse(seasons[2].time)-Date.parse("2024-09-22T12:44:00Z"))<60000);assert.ok(Math.abs(Date.parse(seasons[3].time)-Date.parse("2024-12-21T09:20:00Z"))<60000);
});
