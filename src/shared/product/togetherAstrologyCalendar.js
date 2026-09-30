import {astrologyAt,normalizeAngle,majorAspects,SIGN_RULERS,NAKSHATRAS,TITHIS} from "./togetherAstrology.js";
import {swissEngine,swissPosition,swissAyanamsa,julianDay,dateFromJulian,DAY_MS} from "./togetherAstrologySwiss.js";
import {validTimeZone,zonedDay,zonedDateCandidates,civilMidnight,nextCivilBoundary,shiftCivilDay,calendarDateValid} from "./togetherAstrologyTime.js";

const HOUR=3600000,DEG=Math.PI/180;
const DAYS=["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"];
const CHALDEAN=["Saturn","Jupiter","Mars","Sun","Venus","Mercury","Moon"];
export const YOGAS=["Viškambha","Príti","Ájušmán","Saubhágja","Šóbhana","Atiganda","Sukarman","Dhriti","Šúla","Ganda","Vriddhi","Dhruva","Vjágháta","Haršana","Vadžra","Siddhi","Vjatípáta","Varíjas","Parigha","Šiva","Siddha","Sádhja","Šubha","Šukla","Brahma","Indra","Vaidhriti"];
const KARANAS=["Bava","Bálava","Kaulava","Taitila","Gara","Vanidža","Višti"];
export const DASHA_LORDS=["Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury"];
export const DASHA_YEARS=[7,20,6,10,7,18,16,19,17];
const solarCache=new Map(),eclipseCache=new Map(),natalCache=new Map();
function remember(cache,key,value,max=100){cache.set(key,value);while(cache.size>max)cache.delete(cache.keys().next().value);return value;}
const iso=ms=>new Date(ms).toISOString();
export function validAstrologyLocation(place){return !!place&&place.latitude!=null&&place.longitude!=null&&Number.isFinite(Number(place.latitude))&&Math.abs(Number(place.latitude))<=90&&Number.isFinite(Number(place.longitude))&&Math.abs(Number(place.longitude))<=180&&place.latitude!==""&&place.longitude!==""&&validTimeZone(place.timeZone);}
function placeOf(place){return {latitude:Number(place.latitude),longitude:Number(place.longitude),altitude:Number(place.altitude)||0};}
function bisect(fn,left,right){let a=left,b=right,fa=fn(a);while(b-a>1000){const m=(a+b)/2,fm=fn(m);if(fa*fm<=0)b=m;else{a=m;fa=fm;}}return (a+b)/2;}
function sunAltitude(ms,place){const p=swissPosition(0,new Date(ms));return {altitude:swissEngine().horizontalCoordinates(julianDay(new Date(ms)),place,[p.longitude,p.latitude,p.distance]).altitude,distance:p.distance};}
export function solarDay(day,location,convention="apparent"){
  if(!validAstrologyLocation(location))return {status:"missing-location",sunrise:null,sunset:null,day};
  const place=placeOf(location),key=JSON.stringify([day,location.timeZone,place,convention]);if(solarCache.has(key))return solarCache.get(key);
  const start=civilMidnight(day,location.timeZone),end=nextCivilBoundary(shiftCivilDay(day,1),location.timeZone);
  if(!start||!end)return {status:"invalid-civil-day",sunrise:null,sunset:null,day};
  const residual=ms=>{const s=sunAltitude(ms,place);return convention==="hindu-center"?s.altitude:s.altitude+34/60+Math.asin(.00465047/s.distance)/DEG-.0024428*Math.cos(s.altitude*DEG)/s.distance;};
  let sunrise=null,sunset=null,min=Infinity,max=-Infinity;
  for(let a=start.getTime();a<end.getTime();a+=HOUR/2){
    const b=Math.min(a+HOUR/2,end.getTime()),fa=residual(a),fb=residual(b);min=Math.min(min,fa,fb);max=Math.max(max,fa,fb);
    if(fa<0&&fb>=0&&sunrise===null)sunrise=iso(bisect(residual,a,b));
    if(fa>=0&&fb<0&&sunset===null)sunset=iso(bisect(residual,a,b));
  }
  const status=sunrise&&sunset?"ok":min>0?"polar-day":max<0?"polar-night":"incomplete";
  return remember(solarCache,key,{status,day,sunrise,sunset,start:start.toISOString(),end:end.toISOString(),convention});
}
export function planetaryHoursAt(date,location){
  if(!validAstrologyLocation(location))return {status:"missing-location",hours:[],current:null,dayPlanet:null};
  const civilDay=zonedDay(date,location.timeZone),days=[-2,-1,0,1,2].map(d=>solarDay(shiftCivilDay(civilDay,d),location)),today=days[2];
  // At high latitudes sunset can fall after civil midnight. Pair physical
  // crossings, never a same-date sunrise and an earlier same-date sunset.
  const rises=days.map(d=>Date.parse(d.sunrise)).filter(Number.isFinite).sort((a,b)=>a-b),rise=rises.filter(t=>t<=date.getTime()).at(-1),nextRise=rises.find(t=>t>rise),set=days.map(d=>Date.parse(d.sunset)).filter(t=>Number.isFinite(t)&&t>rise&&t<nextRise).sort((a,b)=>a-b)[0];
  if(!Number.isFinite(rise)||!Number.isFinite(set)||!Number.isFinite(nextRise)||date.getTime()>=nextRise)return {status:["polar-day","polar-night"].includes(today.status)?today.status:"no-bounded-solar-day",hours:[],current:null,dayPlanet:null};
  const day=zonedDay(new Date(rise),location.timeZone);
  const planet=DAYS[new Date(`${day}T12:00:00Z`).getUTCDay()],first=CHALDEAN.indexOf(planet),hours=[];
  for(let i=0;i<24;i++){const base=i<12?rise:set,duration=(i<12?set-rise:nextRise-set)/12,k=i%12;hours.push({index:i+1,planet:CHALDEAN[(first+i)%7],start:iso(base+k*duration),end:iso(base+(k+1)*duration),daytime:i<12});}
  const current=hours.find(h=>date.getTime()>=Date.parse(h.start)&&date.getTime()<Date.parse(h.end))||null;
  return {status:"ok",day,dayPlanet:planet,hours,current,sunrise:iso(rise),sunset:iso(set),nextSunrise:iso(nextRise)};
}
function karanaName(half){return half===0?"Kimstughna":half===57?"Šakuni":half===58?"Čatušpada":half===59?"Nága":KARANAS[(half-1)%7];}
export function panchangaAt(date,{ayanamsa="lahiri"}={}){
  const sun=swissPosition(0,date).longitude,moon=swissPosition(1,date).longitude,offset=swissAyanamsa(date,ayanamsa),moonSid=normalizeAngle(moon-offset),sunSid=normalizeAngle(sun-offset),elongation=normalizeAngle(moon-sun);
  const tithi=Math.floor(elongation/12)+1,fortnightDay=(tithi-1)%15+1,nakshatra=Math.floor(moonSid/(360/27)),yoga=Math.floor(normalizeAngle(moonSid+sunSid)/(360/27)),karana=Math.floor(elongation/6);
  return {tithi,fortnightDay,tithiName:fortnightDay===15?(tithi===15?"Púrnimá":"Amávásjá"):TITHIS[fortnightDay-1],waxing:tithi<=15,paksha:tithi<=15?"shukla":"krishna",nakshatra,nakshatraName:NAKSHATRAS[nakshatra],name:NAKSHATRAS[nakshatra],pada:Math.floor(moonSid/(360/108))%4+1,yoga,yogaName:YOGAS[yoga],karana,karanaName:karanaName(karana),ayanamsa,calendar:"tithi-proxy"};
}
function nextClassificationChange(date,key,options){
  const initial=panchangaAt(date,options)[key],start=date.getTime();let left=start;
  for(let right=start+HOUR;right<=start+3*DAY_MS;right+=HOUR){
    if(panchangaAt(new Date(right),options)[key]===initial){left=right;continue;}
    let a=left,b=right;while(b-a>1000){const m=(a+b)/2;if(panchangaAt(new Date(m),options)[key]===initial)a=m;else b=m;}
    const time=(a+b)/2;return {type:key,time:iso(time),from:initial,to:panchangaAt(new Date(time+1000),options)[key]};
  }
  return null;
}
export function panchangaDay(date,location,options={}){
  const result=panchangaAt(date,options),transitions=["tithi","nakshatra","yoga","karana"].map(key=>nextClassificationChange(date,key,options)).filter(Boolean);
  let atSunrise=null,dayPlanet=null,varaDay=null,sunrise=null;
  if(validAstrologyLocation(location)){
    varaDay=zonedDay(date,location.timeZone);let solar=solarDay(varaDay,location,"hindu-center");
    if(solar.sunrise&&date<Date.parse(solar.sunrise)){varaDay=shiftCivilDay(varaDay,-1);solar=solarDay(varaDay,location,"hindu-center");}
    if(solar.sunrise){sunrise=solar.sunrise;atSunrise=panchangaAt(new Date(sunrise),options);dayPlanet=DAYS[new Date(`${varaDay}T12:00:00Z`).getUTCDay()];}
  }
  return {...result,transitions,tithiEnd:transitions.find(t=>t.type==="tithi")?.time||null,nakshatraEnd:transitions.find(t=>t.type==="nakshatra")?.time||null,dayPlanet,vara:dayPlanet,varaDay,sunrise,atSunrise,sunriseConvention:"hindu-center"};
}
export function internalDayAt(date,location){
  const hours=planetaryHoursAt(date,location);if(hours.status!=="ok")return {status:hours.status,segments:[],current:null,model:true};
  const start=Date.parse(hours.sunrise),end=Date.parse(hours.nextSunrise),segments=Array.from({length:12},(_,index)=>({index:index+1,start:iso(start+(end-start)*index/12),end:iso(start+(end-start)*(index+1)/12),breaths:1800,sign:null,nostril:null}));
  return {status:"model",segments,current:segments.find(s=>date>=Date.parse(s.start)&&date<Date.parse(s.end))||null,model:true,totalBreaths:21600,signAssignment:"unverified"};
}
export function expectedSwara(tithi){
  if(!Number.isInteger(tithi)||tithi<1||tithi>30)return null;
  const n=(tithi-1)%15+1,left=[1,2,3,7,8,9,13,14,15].includes(n);
  return {nostril:(tithi<=15?left:!left)?"left":"right",model:true,source:"user-supplied-svarodaya",at:"sunrise"};
}
function eclipseType(result){return result.isHybrid?.()?"hybrid":result.isTotal()?"total":result.isAnnular?.()?"annular":result.isPenumbralOnly?.()?"penumbral":"partial";}
export function eclipsesBetween(start,end,location){
  const key=JSON.stringify([start.toISOString(),end.toISOString(),validAstrologyLocation(location)?placeOf(location):null]);if(eclipseCache.has(key))return eclipseCache.get(key);
  const swe=swissEngine(),rows=[],endJd=julianDay(end);
  for(const kind of ["solar","lunar"]){
    // The library may skip a maximum when the search starts only seconds
    // before it. Bracket a full day earlier, then enforce [start, end) below.
    let cursor=julianDay(start)-1;
    for(let i=0;i<16;i++){
      const e=kind==="solar"?swe.findNextSolarEclipse(cursor):swe.findNextLunarEclipse(cursor);if(e.maximum>=endJd)break;
      if(e.maximum<julianDay(start)){cursor=e.maximum+1;continue;}
      let visible=null,localMaximum=null;
      if(validAstrologyLocation(location)){
        const local=kind==="solar"?swe.findNextSolarEclipseAt(cursor,placeOf(location)):swe.findNextLunarEclipseAt(cursor,placeOf(location));
        visible=Math.abs(local.maximum-e.maximum)<1;if(visible)localMaximum=dateFromJulian(local.maximum).toISOString();
      }
      rows.push({kind,type:eclipseType(e),time:dateFromJulian(e.maximum).toISOString(),visible,localMaximum,global:true});cursor=e.maximum+1;
    }
  }
  rows.sort((a,b)=>Date.parse(a.time)-Date.parse(b.time));return remember(eclipseCache,key,rows,40);
}
export function solarSeasonsBetween(start,end){
  const seasons=["march-equinox","june-solstice","september-equinox","december-solstice"],events=[];
  for(let i=0;i<4;i++){
    const longitude=i*90,residual=ms=>{const delta=swissPosition(0,new Date(ms)).longitude-longitude;return normalizeAngle(delta+180)-180;};
    for(let a=start.getTime();a<end.getTime();a+=3*DAY_MS){
      const b=Math.min(a+3*DAY_MS,end.getTime()),fa=residual(a),fb=residual(b);
      if(fa*fb<=0&&Math.abs(fa-fb)<180){const time=bisect(residual,a,b);if(time>=start.getTime()&&time<end.getTime())events.push({id:seasons[i],time:iso(time),longitude});}
    }
  }
  return events.sort((a,b)=>Date.parse(a.time)-Date.parse(b.time));
}
function point(longitude){const l=normalizeAngle(longitude);return {longitude:l,sign:Math.floor(l/30),degree:l%30};}
export function annualProfection(birth,ascendant,date){
  const currentDay=zonedDay(date,birth.timeZone),[cy]=currentDay.split("-").map(Number),[by,bm,bd]=birth.date.split("-").map(Number);
  // Civil birthdays; Feb 29 advances on March 1 in non-leap years.
  const anniversary=new Date(Date.UTC(cy,bm-1,bd)).toISOString().slice(0,10),age=cy-by-(currentDay<anniversary?1:0);
  if(age<0)return null;const sign=(Math.floor(ascendant/30)+age)%12;
  return {age,house:age%12+1,sign,ruler:SIGN_RULERS[sign],birthdayRule:"civil-birthday-march-1-for-feb-29"};
}
export function vimshottariDasha(moonLongitude,birthDate,date){
  const width=360/27,nak=Math.floor(normalizeAngle(moonLongitude)/width),index=nak%9,fraction=(normalizeAngle(moonLongitude)%width)/width,year=365.2425*DAY_MS;
  let cursor=birthDate.getTime()-fraction*DASHA_YEARS[index]*year;const periods=[];
  // The angular remainder convention is explicit. Never confuse it with the
  // elapsed clock-time fraction of a nakshatra or a 360-day dasha year.
  for(let i=0;i<27;i++){const lord=(index+i)%9,end=cursor+DASHA_YEARS[lord]*year;periods.push({lord:DASHA_LORDS[lord],start:iso(cursor),end:iso(end),years:DASHA_YEARS[lord]});cursor=end;}
  const current=periods.find(p=>date>=Date.parse(p.start)&&date<Date.parse(p.end))||null;
  let subperiod=null;
  if(current){const first=DASHA_LORDS.indexOf(current.lord),duration=Date.parse(current.end)-Date.parse(current.start);let begin=Date.parse(current.start);for(let i=0;i<9;i++){const n=(first+i)%9,end=begin+duration*DASHA_YEARS[n]/120;if(date>=begin&&date<end)subperiod={lord:DASHA_LORDS[n],start:iso(begin),end:iso(end)};begin=end;}}
  return {...current,current,subperiod,periods,convention:"angular-nakshatra-remainder; Gregorian mean year 365.2425 days",birthNakshatra:nak};
}
export function natalAt(date,birth,options={}){
  const unavailable=status=>({status,planets:[],nodes:[],ascendant:null,sect:null,lots:null,profection:null,dasha:null,transits:[]});
  if(!birth||!calendarDateValid(birth.date)||Number(birth.date.slice(0,4))<1900||Number(birth.date.slice(0,4))>2100)return unavailable("missing-birth");
  if(birth.precision!=="exact"||!/^\d{2}:\d{2}$/.test(birth.time||""))return unavailable("unknown-birth-time");
  if(!validAstrologyLocation(birth))return unavailable("missing-birth-location");
  // At an exact geographical pole the ecliptic has no unique eastern point.
  // The wrapper's zero-filled fallback must never become a fictitious ASC.
  if(Math.abs(Number(birth.latitude))>=89.999999)return unavailable("undefined-polar-ascendant");
  const [hour,minute]=birth.time.split(":").map(Number);if(hour>23||minute>59)return unavailable("invalid-birth-time");
  const candidates=zonedDateCandidates(birth.date,hour+minute/60,birth.timeZone);
  if(candidates.length!==1)return unavailable(candidates.length?"ambiguous-birth-time":"invalid-birth-time");
  const instant=candidates[0];if(date<instant)return unavailable("before-birth");
  const key=JSON.stringify([birth,options.ayanamsa,options.nodeMode]);let base=natalCache.get(key);
  if(!base){
    const sky=astrologyAt(instant,"jyotish",{...options,skipNextPhase:true}),tropical=astrologyAt(instant,"hellenistic",{...options,skipNextPhase:true}),ascendant=swissEngine().calculateHouses(julianDay(instant),Number(birth.latitude),Number(birth.longitude),"W").ascendant;
    const sun=swissPosition(0,instant),altitude=swissEngine().horizontalCoordinates(julianDay(instant),placeOf(birth),[sun.longitude,sun.latitude,sun.distance]).altitude,sect=Math.abs(altitude)<.1?"horizon-uncertain":altitude>0?"day":"night",moon=tropical.planets[1].longitude;
    const lots=sect==="horizon-uncertain"?null:{fortune:point(ascendant+(sect==="day"?moon-sun.longitude:sun.longitude-moon)),spirit:point(ascendant+(sect==="day"?sun.longitude-moon:moon-sun.longitude)),convention:"day/night reversal"};
    base=remember(natalCache,key,{status:"ok",date:instant.toISOString(),planets:sky.planets,nodes:sky.nodes,tropicalPlanets:tropical.planets,ascendant,siderealAscendant:normalizeAngle(ascendant-sky.ayanamsa),sect,sunAltitude:altitude,lots,ayanamsa:sky.ayanamsa},30);
  }
  const now=astrologyAt(date,"jyotish",{...options,skipNextPhase:true}),targets=[...base.planets,...base.nodes].filter(p=>["Sun","Moon","Saturn","Rahu","Ketu"].includes(p.id)),transits=[];
  for(const moving of [...now.planets,...now.nodes])for(const target of targets){const aspects=majorAspects([{...moving,id:`transit:${moving.id}`},{...target,id:`natal:${target.id}`,speed:0}],3);for(const a of aspects)transits.push({...a,planet:moving.id,natalPlanet:target.id});}
  transits.sort((a,b)=>a.orb-b.orb);
  const natalMoon=base.planets.find(p=>p.id==="Moon"),gochara=[...now.planets,...now.nodes].map(p=>({...p,houseFromMoon:(p.sign-natalMoon.sign+12)%12+1}));
  return {...base,profection:annualProfection(birth,base.ascendant,date),dasha:vimshottariDasha(natalMoon.longitude,instant,date),transits,gochara};
}
export function astrologyDayDetails(date,{location,birth,nodeMode="mean",ayanamsa="lahiri"}={}){
  const options={nodeMode,ayanamsa},timeZone=validTimeZone(location?.timeZone)?location.timeZone:"UTC",day=zonedDay(date,timeZone),solar=solarDay(day,location),previous=solarDay(shiftCivilDay(day,-1),location),next=solarDay(shiftCivilDay(day,1),location),start=civilMidnight(day,timeZone),end=nextCivilBoundary(shiftCivilDay(day,1),timeZone);
  return {date:date.toISOString(),day,timeZone,solar:{...solar,previousSunrise:previous.sunrise,nextSunrise:next.sunrise},panchanga:panchangaDay(date,location,options),planetaryHours:planetaryHoursAt(date,location),eclipses:eclipsesBetween(start,end,location),natal:natalAt(date,birth,options),internalDay:internalDayAt(date,location)};
}
