import {Body,Ecliptic,GeoVector,EclipticGeoMoon,Vector,MakeTime,MoonPhase,Illumination,SearchMoonPhase} from "astronomy-engine";

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
export function dateForAstrology(day,hour=12){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(day||""))return null;
  const [y,m,d]=day.split("-").map(Number),n=Number(hour);
  if(y<1900||y>2100||!Number.isFinite(n)||n<0||n>=24)return null;
  const date=new Date(y,m-1,d,Math.floor(n),Math.round(n%1*60));
  return date.getFullYear()===y&&date.getMonth()===m-1&&date.getDate()===d&&date.getHours()===Math.floor(n)&&date.getMinutes()===Math.round(n%1*60)?date:null;
}
export function astrologyDay(date=new Date()){
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}
export function shiftAstrologyDay(day,delta){
  const date=dateForAstrology(day);if(!date)return day;
  date.setDate(date.getDate()+delta);
  const shifted=astrologyDay(date);return dateForAstrology(shifted)?shifted:day;
}
export function tropicalLongitude(id,date){
  return id==="Moon"?EclipticGeoMoon(date).lon:Ecliptic(GeoVector(Body[id],date,true)).elon;
}
// True Chitra frame: Spica's ecliptic longitude defines 180°. J2000 ICRS
// position and linear proper motion: SIMBAD/Hipparcos van Leeuwen 2007.
// No mutable Astronomy Engine custom-star slot or network request is used.
export function chitraAyanamsa(date){
  const years=(date.getTime()-Date.UTC(2000,0,1,12))/(365.25*86400000);
  const dec0=-(11+9/60+40.7501/3600),ra0=(13+25/60+11.57937/3600)*15;
  const ra=(ra0+years*(-42.35)/(3600000*Math.cos(dec0*Math.PI/180)))*Math.PI/180;
  const dec=(dec0+years*(-30.67)/3600000)*Math.PI/180;
  const spica=new Vector(Math.cos(dec)*Math.cos(ra),Math.cos(dec)*Math.sin(ra),Math.sin(dec),MakeTime(date));
  return normalizeAngle(Ecliptic(spica).elon-180);
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
export function astrologyAt(date,lens="western"){
  if(!(date instanceof Date)||!Number.isFinite(date.getTime()))throw new RangeError("A valid date is required");
  const sidereal=lens==="jyotish",ayanamsa=sidereal?chitraAyanamsa(date):0;
  const before=new Date(date.getTime()-1800000),after=new Date(date.getTime()+1800000);
  const planets=ASTRO_BODIES.map(id=>{
    const tropical=tropicalLongitude(id,date),longitude=normalizeAngle(tropical-ayanamsa);
    const speed=signedAngle(tropicalLongitude(id,after)-tropicalLongitude(id,before))*24;
    const sign=Math.floor(longitude/30);
    return {id,longitude,tropical,speed,retrograde:speed<0,sign,degree:longitude%30,ruler:SIGN_RULERS[sign],dignity:planetDignity(id,sign,lens)};
  });
  const moon=planets[1],elongation=MoonPhase(date),nakshatra=Math.floor(moon.longitude/(360/27));
  const tithi=Math.floor(elongation/12)+1,fortnightDay=(tithi-1)%15+1;
  const nextAngle=(Math.floor(elongation/90)+1)*90%360;
  const traditional=planets.filter(p=>CLASSICAL_BODIES.includes(p.id));
  const signAspects=[];
  for(let i=0;i<traditional.length;i++)for(let j=i+1;j<traditional.length;j++){
    const a=traditional[i],b=traditional[j],separation=Math.min((a.sign-b.sign+12)%12,(b.sign-a.sign+12)%12);
    const aspect=MAJOR_ASPECTS.find(item=>item.angle===separation*30);
    if(aspect)signAspects.push({...aspect,a:a.id,b:b.id});
  }
  return {date:date.toISOString(),lens,ayanamsa,planets,aspects:majorAspects(planets),signAspects,
    moon:{phase:elongation/360,index:Math.round(elongation/45)%8,light:Math.round(Illumination(Body.Moon,date).phase_fraction*100),elongation,
      next:SearchMoonPhase(nextAngle,date,10)?.date.toISOString()||null,nextIndex:nextAngle/45},
    jyotish:{nakshatra,name:NAKSHATRAS[nakshatra],pada:Math.floor((moon.longitude%(360/27))/(360/108))+1,tithi,fortnightDay,
      waxing:tithi<=15,tithiName:fortnightDay===15?(tithi===15?"Púrnimá":"Amávásjá"):TITHIS[fortnightDay-1]}};
}
