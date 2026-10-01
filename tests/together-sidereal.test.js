import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {AstroTime,Body,DefineStar,GeoVector,e_tilt} from "astronomy-engine";
import {ayanamsaAt,lunarNodeAt} from "../src/shared/product/togetherAstrologySidereal.js";

const separation=(a,b)=>Math.abs(((a-b+540)%360+360)%360-180);
const normalize=angle=>(angle%360+360)%360;

test("Lahiri preserves its published true-equinox defining epoch in TT",()=>{
  const epoch=AstroTime.FromTerrestrialTime(2435553.5-2451545);
  assert.ok(separation(ayanamsaAt(epoch),23+15/60+0.658/3600)<1e-9);
});

test("mean lunar node agrees with the independent ERFA published numeric check",()=>{
  // ERFA's public eraFaom03 test at 0.80 TT centuries past J2000:
  // https://raw.githubusercontent.com/liberfa/erfa/master/src/t_erfa_c.c
  // The reference is mean-equinox; remove our true-equinox nutation first.
  const time=AstroTime.FromTerrestrialTime(0.8*36525);
  const actual=normalize(lunarNodeAt(time)-e_tilt(time).dpsi/3600);
  const expected=normalize(-5.973618440951302*180/Math.PI);
  assert.ok(separation(actual,expected)<1e-9);
});

test("sidereal and node regression samples remain close to the former Moshier engine",()=>{
  // Recorded Swiss Ephemeris 2.10.03 Moshier outputs, flags=4|256,
  // UT inputs, ayanamsa modes 1/27 and bodies 10/11. These are comparison
  // regressions, NOT independent astronomical validation or runtime imports.
  const rows=[
    ["1900-01-01T00:00:00Z",22.465373223511918,22.449597244600955,259.161307149702,260.2672726092947],
    ["1956-03-21T00:00:00Z",23.250221217815394,23.24023984661666,251.85974740572433,250.96038393958565],
    ["2000-01-01T12:00:00Z",23.853222486029065,23.836145181993455,125.04064605661608,123.95289541307294],
    ["2026-09-28T10:00:00Z",24.23294872764654,24.21149900520066,327.85193952317485,329.38060663277645],
    ["2035-12-15T12:00:00Z",24.356789066786455,24.337678517168648,149.6533474615208,148.42422769341914],
    ["2064-10-15T12:00:00Z",24.765477535295293,24.743293848900937,311.95068333115574,312.95908806576267],
    ["2100-12-31T00:00:00Z",25.27057719785471,25.252068275884643,331.66398451906554,330.08547210607054],
  ];
  for(const [iso,lahiri,chitra,mean,osculating] of rows){
    const date=new Date(iso);
    assert.ok(separation(ayanamsaAt(date),lahiri)<0.001,`Lahiri ${iso}`);
    assert.ok(separation(ayanamsaAt(date,"true-chitra"),chitra)<0.001,`Chitra ${iso}`);
    assert.ok(separation(lunarNodeAt(date),mean)<0.001,`mean node ${iso}`);
    assert.ok(separation(lunarNodeAt(date,"true"),osculating)<0.02,`osculating node ${iso}`);
    assert.ok(separation(ayanamsaAt(date),ayanamsaAt(date,"true-chitra"))>0.001);
  }
});

test("True Chitra does not change Astronomy Engine user-defined star slots",()=>{
  const date=new Date("2026-09-28T10:00:00Z");
  DefineStar(Body.Star8,5,20,100);
  const before=GeoVector(Body.Star8,date,true);
  const expected=ayanamsaAt(date,"true-chitra");
  for(const year of [1900,2000,2100])ayanamsaAt(new Date(`${year}-06-01T00:00:00Z`),"true-chitra");
  assert.equal(ayanamsaAt(date,"true-chitra"),expected);
  assert.deepEqual(GeoVector(Body.Star8,date,true),before);
});

test("sidereal calculations import no WASM or Swiss runtime",async()=>{
  const source=await readFile(new URL("../src/shared/product/togetherAstrologySidereal.js",import.meta.url),"utf8");
  assert.doesNotMatch(source,/from\s+["'][^"']*(?:swisseph|wasm)|import\s*\([^)]*(?:swisseph|wasm)/i);
});
