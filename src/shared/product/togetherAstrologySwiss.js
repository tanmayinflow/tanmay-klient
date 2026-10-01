import * as Astronomy from "astronomy-engine";
import {ayanamsaAt,lunarNodeAt} from "./togetherAstrologySidereal.js";
import {HYBRID_ECLIPSE_DATES} from "./togetherAstrologyEclipseTypes.js";
import {horizonSamples} from "./togetherAstrologyHorizon.js";

// The filename and swiss* exports are retained for existing internal imports.
// All runtime calculations now use MIT-licensed Astronomy Engine 2.1.19 and
// independently implemented geometry. No Swiss code, WASM or data is loaded.
// https://github.com/cosinekitty/astronomy/tree/master/source/js
let ready=false;
export const DAY_MS=86400000;
export const julianDay=date=>date.getTime()/DAY_MS+2440587.5;
export const dateFromJulian=jd=>new Date((jd-2440587.5)*DAY_MS);
const DEG=Math.PI/180,AU_KM=149597870.7;
const bodies=["Sun","Moon","Mercury","Venus","Mars","Jupiter","Saturn","Uranus","Neptune","Pluto"];
const norm=value=>((value%360)+360)%360;
const difference=(a,b)=>norm(a-b+180)-180;
const hybridDates=new Set(HYBRID_ECLIPSE_DATES);
const observer=place=>new Astronomy.Observer(place.latitude,place.longitude,place.altitude||0);
export async function initAstrologyEngine(){ready=true;return astrologyEngineInfo();}
export function astrologyEngineInfo(){return {name:"Astronomy Engine",version:"2.1.19",theory:"VSOP87 and Improved Lunar Ephemeris",ayanamsa:"Lahiri",range:[1900,2100],ready,license:"MIT"};}

function coordinates(id,date){
  if(id===10||id===11)return {longitude:lunarNodeAt(date,id===11?"true":"mean"),latitude:0,distance:0};
  const body=bodies[id];if(!body)throw new RangeError("Unsupported ephemeris body");
  if(body==="Moon"){const moon=Astronomy.EclipticGeoMoon(date);return {longitude:moon.lon,latitude:moon.lat,distance:moon.dist};}
  const vector=Astronomy.GeoVector(body,date,true),ecliptic=Astronomy.Ecliptic(vector);
  return {longitude:ecliptic.elon,latitude:ecliptic.elat,distance:vector.Length()};
}
export function swissPosition(id,date){
  if(!ready)throw new Error("Astronomy Engine is not initialized");
  // A symmetric five-minute difference gives angular speeds in degrees/day.
  // It uses wrapped angles so a crossing of 0° is never a false station.
  const step=5*60000,position=coordinates(id,date),before=coordinates(id,new Date(date.getTime()-step)),after=coordinates(id,new Date(date.getTime()+step)),scale=DAY_MS/(2*step);
  return {...position,longitudeSpeed:difference(after.longitude,before.longitude)*scale,latitudeSpeed:(after.latitude-before.latitude)*scale,distanceSpeed:(after.distance-before.distance)*scale};
}
export const swissAyanamsa=(date,mode="lahiri")=>ayanamsaAt(date,mode);

function horizontalCoordinates(jd,place,[longitude,latitude,distance]){
  const time=Astronomy.MakeTime(dateFromJulian(jd)),vector=Astronomy.VectorFromSphere(new Astronomy.Spherical(latitude,longitude,distance),time);
  const equator=Astronomy.EquatorFromVector(Astronomy.RotateVector(Astronomy.Rotation_ECT_EQD(time),vector));
  // Geocentric center, no refraction: callers retain their explicit apparent
  // upper-limb/parallax or Hindu-center sunrise convention.
  return Astronomy.Horizon(time,observer(place),equator.ra,equator.dec);
}
function calculateHouses(jd,latitude,longitude,system="W"){
  if(system!=="W")throw new RangeError("Only whole-sign houses are supported");
  const time=Astronomy.MakeTime(dateFromJulian(jd)),theta=(Astronomy.SiderealTime(time)*15+longitude)*DEG,phi=latitude*DEG,rotation=Astronomy.Rotation_EQD_ECT(time);
  // The ascendant is the eastern intersection of the ecliptic and horizon.
  // Whole-sign cusps then begin with the sign containing that point.
  const zenith=Astronomy.RotateVector(rotation,new Astronomy.Vector(Math.cos(phi)*Math.cos(theta),Math.cos(phi)*Math.sin(theta),Math.sin(phi),time));
  const east=Astronomy.RotateVector(rotation,new Astronomy.Vector(-Math.sin(theta),Math.cos(theta),0,time));
  if(Math.abs(latitude)>=89.999999||Math.hypot(zenith.x,zenith.y)<1e-12)return {ascendant:null,cusps:[]};
  let x=-zenith.y,y=zenith.x;if(x*east.x+y*east.y<0){x=-x;y=-y;}
  const ascendant=norm(Math.atan2(y,x)/DEG),first=Math.floor(ascendant/30)*30;
  return {ascendant,cusps:Array.from({length:12},(_,index)=>norm(first+index*30))};
}
const geometry={horizontalCoordinates,calculateHouses};
export function swissEngine(){if(!ready)throw new Error("Astronomy Engine is not initialized");return geometry;}

export function nextAstrologyEclipse(kind,start){
  const event=kind==="solar"?Astronomy.SearchGlobalSolarEclipse(start):Astronomy.SearchLunarEclipse(start),time=event.peak.date;
  return {kind,type:kind==="solar"&&hybridDates.has(time.toISOString().slice(0,10))?"hybrid":event.kind,time,maximum:julianDay(time),event};
}
function upperLimbAltitude(body,time,place){
  const eq=Astronomy.Equator(body,new Date(time),observer(place),true,true),altitude=Astronomy.Horizon(new Date(time),observer(place),eq.ra,eq.dec).altitude;
  const radius=body==="Moon"?1737.4:695700;
  return altitude+34/60+Math.asin(radius/(eq.dist*AU_KM))/DEG;
}
function horizonCrossing(body,place,left,right){
  let a=left,b=right,fa=upperLimbAltitude(body,a,place);
  while(b-a>1000){const m=(a+b)/2,fm=upperLimbAltitude(body,m,place);if(fa*fm<=0)b=m;else{a=m;fa=fm;}}
  return (a+b)/2;
}
function visibleMaximum(body,place,start,end,peak){
  // Check the entire eclipse. At moonrise/sunset its geometric maximum can
  // be hidden while a smaller part is visible; testing the peak alone loses it.
  const samples=horizonSamples(time=>upperLimbAltitude(body,time,place),start,end,10*60000);
  const intervals=[];let open=samples[0].value>=0?start:null;
  for(let i=1;i<samples.length;i++){
    const {time:a,value:fa}=samples[i-1],{time:b,value:fb}=samples[i];
    if(fa<0&&fb>=0)open=horizonCrossing(body,place,a,b);
    if(fa>=0&&fb<0&&open!==null){intervals.push([open,horizonCrossing(body,place,a,b)]);open=null;}
  }
  if(open!==null)intervals.push([open,end]);
  if(!intervals.length)return null;
  return intervals.map(([a,b])=>Math.max(a,Math.min(b,peak))).sort((a,b)=>Math.abs(a-peak)-Math.abs(b-peak))[0];
}
export function astrologyEclipseVisibility(eclipse,place){
  const peak=eclipse.time.getTime();let start,end,localPeak=peak;
  if(eclipse.kind==="solar"){
    const local=Astronomy.SearchLocalSolarEclipse(new Date(peak-DAY_MS),observer(place));
    localPeak=local.peak.time.date.getTime();
    if(Math.abs(localPeak-peak)>DAY_MS)return {visible:false,localMaximum:null};
    start=local.partial_begin.time.date.getTime();end=local.partial_end.time.date.getTime();
  }else{start=peak-eclipse.event.sd_penum*60000;end=peak+eclipse.event.sd_penum*60000;}
  const maximum=visibleMaximum(eclipse.kind==="solar"?"Sun":"Moon",place,start,end,localPeak);
  return {visible:maximum!==null,localMaximum:maximum===null?null:new Date(maximum).toISOString()};
}
