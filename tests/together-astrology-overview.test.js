import test from "node:test";
import assert from "node:assert/strict";
import {astrologyAt,dateForAstrology,tropicalLongitude,angleDistance,CLASSICAL_BODIES} from "../src/shared/product/togetherAstrology.js";
import {astrologyPeriod,astrologyPeriodBounds,astrologyDominants,dispositorRoute} from "../src/shared/product/togetherAstrologyOverview.js";
import {astrologyOverviewReading,astrologyEventTitle,astrologyEventReading,tithiQuality} from "../src/shared/product/togetherAstrologyOverviewEditorial.js";

function inZone(zone,run){const original=process.env.TZ;try{process.env.TZ=zone;return run();}finally{if(original===undefined)delete process.env.TZ;else process.env.TZ=original;}}

test("period follows civil days through DST, clips the supported endpoint and isolates cached time zones",()=>{
  inZone("Europe/Prague",()=>{
    const day=astrologyPeriodBounds("2026-10-25"),week=astrologyPeriodBounds("2026-10-25","week");
    assert.equal(day.end-day.start,25*3600000);
    assert.equal(week.end-week.start,169*3600000);
    assert.equal(new Date(week.end).getDate(),1);
    const last=astrologyPeriodBounds("2100-12-31","week");
    assert.equal(new Date(last.end).getFullYear(),2101);
    assert.equal(new Date(last.end).getDate(),1);
    assert.equal(last.clipped,true);
    assert.equal(astrologyPeriodBounds("2100-01-29","week").clipped,false);
    const prague=astrologyPeriod("2026-09-28");
    inZone("UTC",()=>assert.equal(astrologyPeriod("2026-09-28").start-prague.start,2*3600000));
  });
  assert.throws(()=>astrologyPeriodBounds("2026-02-30"),RangeError);
});

test("a skipped midnight does not carry its normalized hour to the period end",()=>inZone("America/Santiago",()=>{
  const day=astrologyPeriodBounds("2026-09-06"),week=astrologyPeriodBounds("2026-09-06","week");
  assert.equal(new Date(day.start).getHours(),1);
  assert.equal(new Date(day.end).getHours(),0);assert.equal(new Date(day.end).getDate(),7);
  assert.equal(new Date(week.end).getHours(),0);assert.equal(new Date(week.end).getDate(),13);
  assert.equal(day.end-day.start,23*3600000);assert.equal(week.end-week.start,167*3600000);
  assert.equal(week.clipped,false);
}));

test("computed Sun ingress agrees with independent USNO equinox timing",()=>inZone("UTC",()=>{
  // USNO March equinox 2024: 20 March, 03:06 UT.
  const events=astrologyPeriod("2024-03-20").events;
  const ingress=events.find(e=>e.type==="ingress"&&e.body==="Sun");
  assert.equal(ingress.from,11);assert.equal(ingress.to,0);
  assert.ok(Math.abs(ingress.time-Date.parse("2024-03-20T03:06:00Z"))<180000);
}));

test("a calculated week has ordered unique real crossings inside its half-open interval",()=>inZone("UTC",()=>{
  const period=astrologyPeriod("2026-09-28","western","week");
  assert.ok(period.events.length>15);
  assert.equal(new Set(period.events.map(e=>e.id)).size,period.events.length);
  for(let i=0;i<period.events.length;i++){
    const e=period.events[i];assert.ok(e.time>=period.start&&e.time<period.end);
    if(i)assert.ok(e.time>=period.events[i-1].time);
    if(e.type==="aspect")assert.ok(Math.abs(angleDistance(tropicalLongitude(e.a,new Date(e.time)),tropicalLongitude(e.b,new Date(e.time)))-e.angle)<.006);
    if(e.type==="ingress"){
      assert.equal(Math.floor(tropicalLongitude(e.body,new Date(e.time-60000))/30),e.from);
      assert.equal(Math.floor(tropicalLongitude(e.body,new Date(e.time+60000))/30),e.to);
    }
    if(e.type==="station"){
      const before=astrologyAt(new Date(e.time-3600000)).planets.find(p=>p.id===e.body);
      const after=astrologyAt(new Date(e.time+3600000)).planets.find(p=>p.id===e.body);
      assert.ok(before.speed*after.speed<0);
      assert.equal(after.retrograde,e.direction==="retrograde");
    }
  }
  assert.ok(period.events.some(e=>e.type==="station"&&e.body==="Venus"&&new Date(e.time).getUTCDate()===3));
  assert.equal(period.significant[0].type,"station");
}));

test("traditional periods exclude outer planets and Western exact aspects",()=>inZone("UTC",()=>{
  for(const lens of ["hellenistic","jyotish"]){
    const period=astrologyPeriod("2026-09-28",lens,"week"),sky=astrologyAt(new Date("2026-09-28T10:00:00Z"),lens),dominants=astrologyDominants(sky,period);
    assert.ok(period.events.every(e=>e.type!=="aspect"));
    assert.ok(period.events.every(e=>CLASSICAL_BODIES.includes(e.body)));
    assert.equal(dominants.personal,null);assert.equal(dominants.lunar,null);
    assert.ok(dominants.slow.every(p=>CLASSICAL_BODIES.includes(p.id)));
    if(lens==="jyotish")assert.deepEqual(dominants.background,[]);
    else assert.ok(dominants.background.every(a=>a.wholeSign&&a.orb===undefined));
  }
}));

test("Jyotisha boundaries change the actual selected-instant classification including the 30 to 1 wrap",()=>inZone("UTC",()=>{
  const period=astrologyPeriod("2024-04-08","jyotish");
  const boundary=period.events.find(e=>e.type==="tithi"&&e.from===30&&e.to===1);
  assert.ok(boundary);assert.ok(period.events.some(e=>e.type==="phase"&&e.phase===0));
  for(const e of period.events.filter(e=>["nakshatra","tithi"].includes(e.type))){
    const before=astrologyAt(new Date(e.time-60000),"jyotish"),after=astrologyAt(new Date(e.time+60000),"jyotish");
    assert.equal(before.jyotish[e.type],e.from);assert.equal(after.jyotish[e.type],e.to);
  }
}));

test("host chains distinguish own-sign endings from a loop without inventing a final ruler",()=>{
  const own=dispositorRoute([{id:"Moon",sign:0},{id:"Mars",sign:0}],"Moon");
  assert.deepEqual(own.route,["Moon","Mars"]);assert.deepEqual(own.cycle,["Mars"]);
  const loop=dispositorRoute([{id:"Moon",sign:0},{id:"Mars",sign:3}],"Moon");
  assert.deepEqual(loop.cycle,["Moon","Mars"]);
  assert.deepEqual(dispositorRoute([],"Moon").route,[]);
});

test("the five traditional tithi groups repeat within both halves of the lunation",()=>{
  const names=["Nandá","Bhadrá","Vidžajá","Riktá","Púrná"];
  for(let n=1;n<=30;n++)assert.equal(tithiQuality(n).name,names[(n-1)%5]);
});

test("overall readings use the chosen time, period and tradition and all returned events have editorial",()=>inZone("UTC",()=>{
  const texts=[];
  for(const lens of ["western","hellenistic","jyotish"]){
    const period=astrologyPeriod("2026-09-28",lens,"week"),sky=astrologyAt(dateForAstrology("2026-09-28",12),lens);
    for(const lang of ["cs","en"]){
      const reading=astrologyOverviewReading(sky,period,lang);texts.push(reading.summary);
      assert.ok(reading.summary.length>100);assert.ok(reading.context.length>100);assert.ok(reading.layers.length>=3);
      if(lens==="jyotish"){assert.match(reading.context,/Guru/);assert.match(reading.context,lang==="en"?/Shani/:/Šani/);}
      for(const e of period.events){assert.ok(astrologyEventTitle(e,lang).length>3);assert.ok(astrologyEventReading(e,lens,lang).length>30);}
    }
    if(lens==="western")assert.notEqual(astrologyOverviewReading(sky,astrologyPeriod("2026-09-28",lens,"day")).title,astrologyOverviewReading(sky,period).title);
  }
  assert.equal(new Set(texts).size,6);
  const period=astrologyPeriod("2026-09-28","jyotish");
  assert.notEqual(astrologyOverviewReading(astrologyAt(dateForAstrology("2026-09-28",6),"jyotish"),period).title,astrologyOverviewReading(astrologyAt(dateForAstrology("2026-09-28",22),"jyotish"),period).title);
}));

test("quiet periods do not fabricate a headline event",()=>{
  const sky=astrologyAt(new Date("2026-09-28T10:00:00Z"),"hellenistic");
  const period={lens:"hellenistic",range:"day",events:[],significant:[],first:{},last:{}};
  assert.equal(astrologyDominants(sky,period).priorityEvent,null);
  const reading=astrologyOverviewReading(sky,period);
  assert.ok(reading.layers.every(layer=>!layer.event));
  assert.ok(!reading.summary.includes("undefined"));
});
