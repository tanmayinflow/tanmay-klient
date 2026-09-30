import {swissPosition,swissAyanamsa,astrologyEngineInfo} from "./togetherAstrologySwiss.js";
import {dateInZone,zonedDay} from "./togetherAstrologyTime.js";
export {initAstrologyEngine,astrologyEngineInfo} from "./togetherAstrologySwiss.js";

export const ASTRO_BODIES=["Sun","Moon","Mercury","Venus","Mars","Jupiter","Saturn","Uranus","Neptune","Pluto"];
export const CLASSICAL_BODIES=ASTRO_BODIES.slice(0,7);
export const SIGN_RULERS=["Mars","Venus","Mercury","Moon","Sun","Mercury","Venus","Mars","Jupiter","Saturn","Saturn","Jupiter"];
export const EXALTATIONS={Sun:0,Moon:1,Mercury:5,Venus:11,Mars:9,Jupiter:3,Saturn:6};
export const NAKSHATRAS=["Ašviní","Bharaní","Krittiká","Róhiní","Mrigašírša","Árdrá","Punarvasu","Pušja","Ášléšá","Maghá","Púrva Phalguní","Uttara Phalguní","Hasta","Čitrá","Svátí","Višákhá","Anurádhá","Džjéšthá","Múla","Púrva Ašádhá","Uttara Ašádhá","Šravana","Dhaništhá","Šatabhišá","Púrva Bhádrapadá","Uttara Bhádrapadá","Révatí"];
export const TITHIS=["Pratipadá","Dvitíjá","Tritíjá","Čaturthí","Paňčamí","Šašthí","Saptamí","Aštamí","Navamí","Dašamí","Ékádaší","Dvádaší","Trajódaší","Čaturdaší"];
export const MAJOR_ASPECTS=[{id:"conjunction",angle:0},{id:"sextile",angle:60},{id:"square",angle:90},{id:"trine",angle:120},{id:"opposition",angle:180}];
export const normalizeAngle=x=>((x%360)+360)%360;
export const signedAngle=x=>normalizeAngle(x+180)-180;
export const angleDistance=(a,b)=>Math.abs(signedAngle(a-b));
export function dateForAstrology(day,hour=12,timeZone){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(day||""))return null;
  const [y,m,d]=day.split("-").map(Number),n=Number(hour);
  if(y<1900||y>2100||!Number.isFinite(n)||n<0||n>=24)return null;
  if(timeZone)return dateInZone(day,n,timeZone);
  const date=new Date(y,m-1,d,Math.floor(n),Math.round(n%1*60));
  return date.getFullYear()===y&&date.getMonth()===m-1&&date.getDate()===d&&date.getHours()===Math.floor(n)&&date.getMinutes()===Math.round(n%1*60)?date:null;
}
export function astrologyDay(date=new Date(),timeZone){
  if(timeZone)return zonedDay(date,timeZone);
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}
export function shiftAstrologyDay(day,delta){
  const date=dateForAstrology(day);if(!date)return day;
  date.setDate(date.getDate()+delta);
  const shifted=astrologyDay(date);return dateForAstrology(shifted)?shifted:day;
}
export function tropicalLongitude(id,date){
  const index=ASTRO_BODIES.indexOf(id);if(index<0)throw new RangeError("Neznámé nebeské těleso.");
  return swissPosition(index,date).longitude;
}
export const chitraAyanamsa=date=>swissAyanamsa(date,"true-chitra");
export const lahiriAyanamsa=date=>swissAyanamsa(date,"lahiri");
export const MoonPhase=date=>normalizeAngle(tropicalLongitude("Moon",date)-tropicalLongitude("Sun",date));
export function SearchMoonPhase(angle,date,limitDays=40){
  const target=normalizeAngle(angle),start=date.getTime(),end=start+limitDays*86400000;
  const residual=ms=>signedAngle(MoonPhase(new Date(ms))-target);
  for(let a=start;a<end;a+=21600000){
    let b=Math.min(end,a+21600000),left=a,fa=residual(left),fb=residual(b);
    if(Math.abs(fa)<1e-9)return {date:new Date(left)};
    if(fa*fb>0||Math.abs(fa-fb)>180)continue;
    while(b-left>1000){const m=(left+b)/2,f=residual(m);if(fa*f<=0)b=m;else{left=m;fa=f;}}
    return {date:new Date((left+b)/2)};
  }
  return null;
}
export function majorAspects(planets,orb=4){
  const result=[];
  for(let i=0;i<planets.length;i++)for(let j=i+1;j<planets.length;j++){
    const a=planets[i],b=planets[j],distance=angleDistance(a.longitude,b.longitude);
    const match=MAJOR_ASPECTS.find(aspect=>Math.abs(distance-aspect.angle)<=orb);
    if(!match)continue;
    const exactness=Math.abs(distance-match.angle);
    const distanceSpeed=(signedAngle(a.longitude-b.longitude)>=0?1:-1)*(a.speed-b.speed);
    result.push({...match,a:a.id,b:b.id,orb:exactness,applying:(distance-match.angle)*distanceSpeed<0});
  }
  return result.sort((a,b)=>a.orb-b.orb);
}
export function planetDignity(id,sign,lens="western"){
  if(SIGN_RULERS[sign]===id)return "domicile";
  if(EXALTATIONS[id]===sign)return "exaltation";
  if(lens!=="jyotish"&&SIGN_RULERS[(sign+6)%12]===id)return "detriment";
  if(EXALTATIONS[id]===(sign+6)%12)return "fall";
  return "guest";
}
export function astrologyAt(date,lens="western",options={}){
  if(!(date instanceof Date)||!Number.isFinite(date.getTime()))throw new RangeError("A valid date is required");
  // Supported *civil* dates are 1900–2100. Their UTC instants can cross the
  // year boundary in a chosen zone; one-day wings also serve event bracketing.
  if(date.getTime()<Date.UTC(1900,0,1)-86400000||date.getTime()>=Date.UTC(2101,0,1)+86400000)throw new RangeError("Supported civil years: 1900–2100");
  const sidereal=lens==="jyotish",offset=swissAyanamsa(date,options.ayanamsa),ayanamsa=sidereal?offset:0;
  const planets=ASTRO_BODIES.map((id,index)=>{
    const position=swissPosition(index,date),tropical=position.longitude,longitude=normalizeAngle(tropical-ayanamsa),speed=position.longitudeSpeed;
    const sign=Math.floor(longitude/30);
    return {id,longitude,tropical,latitude:position.latitude,distance:position.distance,speed,retrograde:speed<0,sign,degree:longitude%30,ruler:SIGN_RULERS[sign],dignity:planetDignity(id,sign,lens)};
  });
  const moon=planets[1],sun=planets[0],elongation=normalizeAngle(moon.tropical-sun.tropical),siderealMoon=normalizeAngle(moon.tropical-offset),nakshatra=Math.floor(siderealMoon/(360/27));
  const tithi=Math.floor(elongation/12)+1,fortnightDay=(tithi-1)%15+1;
  const nextAngle=(Math.floor(elongation/90)+1)*90%360;
  const traditional=planets.filter(p=>CLASSICAL_BODIES.includes(p.id));
  const signAspects=[];
  for(let i=0;i<traditional.length;i++)for(let j=i+1;j<traditional.length;j++){
    const a=traditional[i],b=traditional[j],separation=Math.min((a.sign-b.sign+12)%12,(b.sign-a.sign+12)%12);
    const aspect=MAJOR_ASPECTS.find(item=>item.angle===separation*30);
    if(aspect)signAspects.push({...aspect,a:a.id,b:b.id});
  }
  const nodePosition=swissPosition(options.nodeMode==="true"?11:10,date);
  const nodes=["Rahu","Ketu"].map((id,index)=>{const tropical=normalizeAngle(nodePosition.longitude+index*180),longitude=normalizeAngle(tropical-ayanamsa);return {id,tropical,longitude,sign:Math.floor(longitude/30),degree:longitude%30,speed:nodePosition.longitudeSpeed,retrograde:nodePosition.longitudeSpeed<0,mode:options.nodeMode==="true"?"true":"mean"};});
  const radians=Math.PI/180,cosE=Math.cos(elongation*radians)*Math.cos(moon.latitude*radians)*Math.cos(sun.latitude*radians)+Math.sin(moon.latitude*radians)*Math.sin(sun.latitude*radians);
  const phaseCos=(moon.distance-sun.distance*cosE)/Math.sqrt(moon.distance**2+sun.distance**2-2*moon.distance*sun.distance*cosE);
  return {date:date.toISOString(),lens,ayanamsa,siderealAyanamsa:offset,ayanamsaName:options.ayanamsa==="true-chitra"?"True Chitra":"Lahiri",engine:astrologyEngineInfo(),planets,nodes,aspects:majorAspects(planets),signAspects,
    moon:{phase:elongation/360,index:Math.round(elongation/45)%8,light:Math.round((1+phaseCos)*50),elongation,
      next:options.skipNextPhase?null:SearchMoonPhase(nextAngle,date,10)?.date.toISOString()||null,nextIndex:nextAngle/45},
    jyotish:{nakshatra,name:NAKSHATRAS[nakshatra],pada:Math.floor((siderealMoon%(360/27))/(360/108))+1,tithi,fortnightDay,
      waxing:tithi<=15,tithiName:fortnightDay===15?(tithi===15?"Púrnimá":"Amávásjá"):TITHIS[fortnightDay-1]}};
}
