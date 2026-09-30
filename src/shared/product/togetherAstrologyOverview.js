import {MoonPhase,SearchMoonPhase,ASTRO_BODIES,CLASSICAL_BODIES,MAJOR_ASPECTS,SIGN_RULERS,angleDistance,astrologyDay,chitraAyanamsa,lahiriAyanamsa,normalizeAngle,signedAngle,tropicalLongitude} from "./togetherAstrology.js";
import {calendarDateValid,civilMidnight,nextCivilBoundary,shiftCivilDay} from "./togetherAstrologyTime.js";

const HOUR=3600000,STEP=6*HOUR;
const periodCache=new Map();
export function astrologyPeriodBounds(day,range="day",options={}){
  if(!calendarDateValid(day)||Number(day.slice(0,4))<1900||Number(day.slice(0,4))>2100)throw new RangeError("A supported calendar day is required");
  const period=["day","week","month","year"].includes(range)?range:"day",zone=options.timeZone||Intl.DateTimeFormat().resolvedOptions().timeZone;
  let firstDay=day,lastDay=shiftCivilDay(day,1);
  if(period==="week"){const weekday=new Date(`${day}T12:00:00Z`).getUTCDay();firstDay=shiftCivilDay(day,-((weekday+6)%7));lastDay=shiftCivilDay(firstDay,7);}
  if(period==="month"){firstDay=`${day.slice(0,7)}-01`;const d=new Date(`${firstDay}T12:00:00Z`);d.setUTCMonth(d.getUTCMonth()+1);lastDay=d.toISOString().slice(0,10);}
  if(period==="year"){firstDay=`${day.slice(0,4)}-01-01`;lastDay=`${Number(day.slice(0,4))+1}-01-01`;}
  const clipped=lastDay>"2101-01-01"||firstDay<"1900-01-01";if(lastDay>"2101-01-01")lastDay="2101-01-01";if(firstDay<"1900-01-01")firstDay="1900-01-01";
  if(!civilMidnight(day,zone))throw new RangeError("Civil day unavailable in this time zone");
  const start=nextCivilBoundary(firstDay,zone),end=nextCivilBoundary(lastDay,zone);if(!start||!end)throw new RangeError("Civil day unavailable in this time zone");
  return {start:start.getTime(),end:end.getTime(),day,firstDay,lastDay,range:period,clipped,timeZone:zone};
}
// Six-hour brackets, then bisection to one second. A signed angular residual
// rejects the antipodal discontinuity rather than reporting a spurious event.
function zeroWithin(fn,left,right){
  let a=left,b=right,fa=fn(a),fb=fn(b);
  if(!Number.isFinite(fa)||!Number.isFinite(fb)||fa*fb>0)return null;
  if(Math.abs(fa)<1e-10)return a;
  if(Math.abs(fb)<1e-10)return b;
  for(let i=0;i<24&&b-a>1000;i++){
    const mid=(a+b)/2,fm=fn(mid);
    if(Math.abs(fm)<1e-10)return mid;
    if(fa*fm<=0){b=mid;fb=fm;}else{a=mid;fa=fm;}
  }
  return (a+b)/2;
}
function transitionWithin(classify,left,right){
  let a=left,b=right;const initial=classify(a);
  for(let i=0;i<24&&b-a>1000;i++){
    const mid=(a+b)/2;if(classify(mid)===initial)a=mid;else b=mid;
  }
  // A category event opens its new state. Returning the midpoint can land
  // just before the boundary and contradict the event's advertised `to`.
  return b;
}
function importance(event){
  if(event.type==="station")return 110;
  if(event.type==="ingress")return event.body==="Moon"?38:["Mercury","Venus","Mars"].includes(event.body)?90:100;
  if(event.type==="phase")return event.phase===0||event.phase===4?105:74;
  if(event.type==="nakshatra")return 44;
  if(event.type==="tithi")return event.to===1||event.to===16?85:35;
  if(event.type==="aspect")return [event.a,event.b].includes("Moon")?46:[event.a,event.b].every(p=>["Jupiter","Saturn","Uranus","Neptune","Pluto"].includes(p))?96:82;
  return 0;
}

export function astrologyPeriod(day,lens="western",range="day",options={}){
  const frame=["western","hellenistic","jyotish"].includes(lens)?lens:"western";
  const bounds=astrologyPeriodBounds(day,range,options),key=`${bounds.firstDay}:${frame}:${bounds.range}:${bounds.timeZone}:${options.ayanamsa||"lahiri"}`;
  if(periodCache.has(key))return periodCache.get(key);
  const {start,end}=bounds,bodies=frame==="western"?ASTRO_BODIES:CLASSICAL_BODIES;
  const longitudeCache=new Map(),offsetCache=new Map(),events=[];
  const tropical=(body,ms)=>{
    const key=`${body}:${ms}`;
    if(!longitudeCache.has(key))longitudeCache.set(key,tropicalLongitude(body,new Date(ms)));
    return longitudeCache.get(key);
  };
  const longitude=(body,ms)=>{
    if(frame!=="jyotish")return tropical(body,ms);
    if(!offsetCache.has(ms))offsetCache.set(ms,(options.ayanamsa==="true-chitra"?chitraAyanamsa:lahiriAyanamsa)(new Date(ms)));
    return normalizeAngle(tropical(body,ms)-offsetCache.get(ms));
  };
  const speed=(body,ms)=>signedAngle(tropical(body,ms+HOUR/2)-tropical(body,ms-HOUR/2))*24;
  const add=event=>{
    if(event.time<start||event.time>=end)return;
    const duplicate=events.some(item=>item.type===event.type&&item.body===event.body&&item.a===event.a&&item.b===event.b&&item.angle===event.angle&&Math.abs(item.time-event.time)<60000);
    if(!duplicate)events.push({...event,score:importance(event),id:`${event.type}:${event.body||event.a||"Moon"}:${event.b||""}:${Math.round(event.time/1000)}`});
  };
  for(let left=start;left<end;left+=STEP){
    const right=Math.min(left+STEP,end);
    for(const body of bodies){
      const classify=ms=>Math.floor(longitude(body,ms)/30),from=classify(left),to=classify(right);
      if(from!==to)add({type:"ingress",body,from,to,time:transitionWithin(classify,left,right)});
      if(body!=="Sun"&&body!=="Moon"){
        const a=speed(body,left),b=speed(body,right);
        if(a*b<0){const time=zeroWithin(ms=>speed(body,ms),left,right);if(time!==null)add({type:"station",body,direction:b<0?"retrograde":"direct",time});}
      }
    }
    if(frame==="western"){
      for(let i=0;i<bodies.length;i++)for(let j=i+1;j<bodies.length;j++){
        const a=bodies[i],b=bodies[j],difference=ms=>normalizeAngle(tropical(a,ms)-tropical(b,ms));
        for(const aspect of MAJOR_ASPECTS){
          if(a==="Sun"&&b==="Moon"&&[0,90,180].includes(aspect.angle))continue;
          const targets=aspect.angle===0||aspect.angle===180?[aspect.angle]:[aspect.angle,360-aspect.angle];
          for(const target of targets){
            const residual=ms=>signedAngle(difference(ms)-target),v0=residual(left),v1=residual(right);
            if(v0*v1<=0&&Math.abs(v0-v1)<180){
              const time=zeroWithin(residual,left,right);
              if(time!==null)add({type:"aspect",a,b,angle:aspect.angle,aspect:aspect.id,time});
            }
          }
        }
      }
    }
    {
      const station=ms=>Math.floor(longitude("Moon",ms)/(360/27)),tithi=ms=>Math.floor(MoonPhase(new Date(ms))/12)+1;
      // Practice dates always use the Moon–Sun angle, regardless of the wheel's
      // zodiac frame. Nakshatra transitions remain specific to the sidereal view.
      for(const [type,classify] of [...(frame==="jyotish"?[["nakshatra",station]]:[]),["tithi",tithi]]){
        const from=classify(left),to=classify(right);
        if(from!==to)add({type,body:"Moon",from,to,time:transitionWithin(classify,left,right)});
      }
    }
  }
  for(const angle of [0,90,180,270]){
    let cursor=start;
    while(cursor<end){const phase=SearchMoonPhase(angle,new Date(cursor),Math.min(32,(end-cursor)/86400000+.001));if(!phase)break;add({type:"phase",body:"Moon",phase:angle/45,time:phase.date.getTime()});cursor=phase.date.getTime()+60000;}
  }
  events.sort((a,b)=>a.time-b.time);
  const snapshot=ms=>Object.fromEntries(bodies.map(body=>[body,longitude(body,ms)]));
  const ranked=[...events].sort((a,b)=>b.score-a.score||a.time-b.time);
  const result={...bounds,lens:frame,events,significant:ranked.slice(0,bounds.range==="day"?3:bounds.range==="week"?5:12),first:snapshot(start),last:snapshot(end-1)};
  periodCache.set(key,result);if(periodCache.size>12)periodCache.delete(periodCache.keys().next().value);
  return result;
}

export function dispositorRoute(planets,start){
  const map=Object.fromEntries(planets.map(p=>[p.id,p])),route=[],seen=new Set();let current=start;
  while(map[current]&&!seen.has(current)&&route.length<8){seen.add(current);route.push(current);current=SIGN_RULERS[map[current].sign];}
  return {route,cycle:seen.has(current)?route.slice(route.indexOf(current)):[],terminal:current};
}
export function astrologyDominants(sky,period){
  const lens=period.lens,visible=sky.planets.filter(p=>lens==="western"||CLASSICAL_BODIES.includes(p.id));
  const stations=period.significant.filter(e=>e.type==="station"),nonLunarChange=period.significant.find(e=>e.type==="ingress"&&e.body!=="Moon");
  const priorityEvent=stations[0]||nonLunarChange||period.significant.find(e=>e.type==="phase")||period.significant[0]||null;
  const slowIds=lens==="western"?["Jupiter","Saturn","Uranus","Neptune","Pluto"]:["Jupiter","Saturn"];
  const slow=visible.filter(p=>slowIds.includes(p.id));
  const background=lens==="jyotish"?[]:lens==="hellenistic"?sky.signAspects.filter(a=>slowIds.includes(a.a)&&slowIds.includes(a.b)).map(a=>({...a,wholeSign:true})):sky.aspects.filter(a=>slowIds.includes(a.a)&&slowIds.includes(a.b)).map(a=>({...a,
    startOrb:Math.abs(angleDistance(period.first[a.a],period.first[a.b])-a.angle),
    endOrb:Math.abs(angleDistance(period.last[a.a],period.last[a.b])-a.angle)})).sort((a,b)=>a.orb-b.orb).slice(0,2);
  const personal=lens==="western"?sky.aspects.filter(a=>![a.a,a.b].includes("Moon")&&![a.a,a.b].every(p=>slowIds.includes(p))).sort((a,b)=>a.orb-b.orb):[];
  const lunar=lens==="western"?sky.aspects.filter(a=>a.a==="Moon"||a.b==="Moon").sort((a,b)=>a.orb-b.orb):[];
  const hosts=CLASSICAL_BODIES.map(id=>({id,guests:visible.filter(p=>p.ruler===id)})).sort((a,b)=>b.guests.length-a.guests.length);
  const strongestHost=hosts[0]?.guests.length>1?hosts[0]:null;
  const lights=sky.signAspects.find(a=>(a.a==="Sun"&&a.b==="Moon")||(a.a==="Moon"&&a.b==="Sun"))||null;
  return {lens,priorityEvent,personal:personal[0]||null,lunar:lunar[0]||null,background,slow,hosts,strongestHost,
    hostRoute:strongestHost?dispositorRoute(visible,strongestHost.id):null,lights,
    moonRoute:dispositorRoute(visible,"Moon"),
    signChanges:period.events.filter(e=>e.type==="ingress"),
    lunarChanges:period.events.filter(e=>e.type==="nakshatra"||e.type==="tithi"),
    dignified:visible.filter(p=>p.dignity==="domicile"||p.dignity==="exaltation"),
    date:astrologyDay(new Date(sky.date),period.timeZone)};
}
