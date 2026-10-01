import test from "node:test";
import assert from "node:assert/strict";
import {SiderealTime} from "astronomy-engine";
import {initAstrologyEngine,astrologyEngineInfo,swissEngine,julianDay,swissPosition,nextAstrologyEclipse,astrologyEclipseVisibility} from "../src/shared/product/togetherAstrologySwiss.js";
import {HYBRID_ECLIPSE_DATES} from "../src/shared/product/togetherAstrologyEclipseTypes.js";
import {solarDay} from "../src/shared/product/togetherAstrologyCalendar.js";

await initAstrologyEngine();
const separation=(a,b)=>Math.abs(((a-b+540)%360+360)%360-180);

test("the released calculation engine truthfully identifies its implementation and licence",()=>{
  const info=astrologyEngineInfo();assert.equal(info.name,"Astronomy Engine");assert.equal(info.version,"2.1.19");assert.equal(info.license,"MIT");assert.equal(info.ready,true);
});

test("ecliptic horizon geometry keeps the east intersection and omits atmospheric refraction",()=>{
  const date=new Date("2026-09-30T12:00:00Z"),jd=julianDay(date),meridian=-SiderealTime(date)*15;
  // Analytic geometry at latitude 0: when RA=0 is on the meridian, the
  // ecliptic intersects the eastern horizon at longitude 90 degrees.
  const houses=swissEngine().calculateHouses(jd,0,meridian,"W");assert.ok(separation(houses.ascendant,90)<1e-8);
  const at=longitude=>swissEngine().horizontalCoordinates(jd,{latitude:0,longitude,altitude:0},[0,0,1]).altitude;
  assert.ok(Math.abs(at(meridian)-90)<1e-6);assert.ok(Math.abs(at(meridian+90))<1e-8);assert.ok(Math.abs(at(meridian+180)+90)<1e-6);
  assert.equal(swissEngine().calculateHouses(jd,90,0,"W").ascendant,null);
  assert.throws(()=>swissEngine().calculateHouses(jd,50,14,"P"),RangeError);
});

test("ascendant regressions preserve hemisphere and high-latitude branches",()=>{
  // Previous Swiss 2.10.03 outputs, not independent astronomy evidence.
  // These guard the sign/orientation ambiguity in a horizon intersection.
  for(const [latitude,hour,expected] of [[50.0755,12,50.38460052674228],[-50,12,18.163368929039493],[80,6,25.875495010572877],[-80,0,163.56737989669898]]){
    const actual=swissEngine().calculateHouses(julianDay(new Date(Date.UTC(1990,0,1,hour))),latitude,14.4378,"W").ascendant;
    assert.ok(separation(actual,expected)<.0001,`${latitude} ${hour}`);
  }
});

test("longitude derivatives retain direction through Aries zero and Mercury retrograde",()=>{
  const sun=swissPosition(0,new Date("2024-03-20T03:06:00Z")),mercury=swissPosition(2,new Date("2024-11-28T00:00:00Z"));
  assert.ok(sun.longitudeSpeed>.9&&sun.longitudeSpeed<1.1);assert.ok(mercury.longitudeSpeed<0);
  for(let id=0;id<12;id++){const p=swissPosition(id,new Date("2026-09-30T12:00:00Z"));assert.ok(Number.isFinite(p.longitudeSpeed));assert.ok(p.longitude>=0&&p.longitude<360);}
});

test("all thirteen NASA hybrid dates retain their global classification",()=>{
  assert.equal(HYBRID_ECLIPSE_DATES.length,13);
  for(const day of HYBRID_ECLIPSE_DATES){const eclipse=nextAstrologyEclipse("solar",new Date(`${day}T00:00:00Z`));assert.equal(eclipse.time.toISOString().slice(0,10),day);assert.equal(eclipse.type,"hybrid");}
  assert.equal(nextAstrologyEclipse("solar",new Date("2024-04-08T00:00:00Z")).type,"total");
});

test("partial visibility at moonset or moonrise keeps a visible local maximum",()=>{
  // NASA 25 March 2024 visibility map: Europe loses the Moon before the
  // global maximum; Japan sees its final portion after moonrise; India does not.
  // https://eclipse.gsfc.nasa.gov/LEplot/LEplot2001/LE2024Mar25N.pdf
  const eclipse=nextAstrologyEclipse("lunar",new Date("2024-03-25T00:00:00Z"));
  const prague=astrologyEclipseVisibility(eclipse,{latitude:50.0755,longitude:14.4378}),tokyo=astrologyEclipseVisibility(eclipse,{latitude:35.6762,longitude:139.6503}),mumbai=astrologyEclipseVisibility(eclipse,{latitude:19.076,longitude:72.8777});
  assert.equal(prague.visible,true);assert.ok(Date.parse(prague.localMaximum)<eclipse.time.getTime());
  assert.equal(tokyo.visible,true);assert.ok(Date.parse(tokyo.localMaximum)>eclipse.time.getTime());
  assert.equal(mumbai.visible,false);assert.equal(mumbai.localMaximum,null);
});

test("a short polar day brackets both crossings around the true altitude maximum",()=>{
  // Adversarial numerical fixture: the Sun's upper limb rises between two
  // half-hour grid points. This verifies root bracketing, not physical accuracy
  // for a grazing horizon, where actual refraction and terrain dominate.
  const day=solarDay("2026-12-21",{latitude:67.39694956749872,longitude:-4,timeZone:"UTC"});
  const peak=Date.parse("2026-12-21T12:14:04.154Z"),rise=Date.parse(day.sunrise),set=Date.parse(day.sunset);
  assert.equal(day.status,"ok");assert.ok(rise<peak&&set>peak);assert.ok(set-rise<30*60000);
});

test("a grazing lunar eclipse is not lost between ten-minute altitude samples",()=>{
  // A deliberately sub-arcsecond numerical horizon case; no such physical
  // observational precision is claimed for this atmosphere model.
  const eclipse=nextAstrologyEclipse("lunar",new Date("2024-03-25T00:00:00Z"));
  const local=astrologyEclipseVisibility(eclipse,{latitude:88.25724404730158,longitude:-150});
  assert.equal(local.visible,true);assert.ok(Math.abs(Date.parse(local.localMaximum)-Date.parse("2024-03-25T08:00:01.556Z"))<60000);
});
