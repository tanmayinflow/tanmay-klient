const formatters=new Map(),zones=new Map();
export function validTimeZone(zone){if(typeof zone!=="string"||!zone||zone.length>100)return false;if(zones.has(zone))return zones.get(zone);try{new Intl.DateTimeFormat("en",{timeZone:zone}).format();zones.set(zone,true);return true;}catch{zones.set(zone,false);return false;}}
function formatter(zone){
  if(!validTimeZone(zone))throw new RangeError("Platné časové pásmo je povinné.");
  if(!formatters.has(zone))formatters.set(zone,new Intl.DateTimeFormat("en-CA",{timeZone:zone,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"}));
  return formatters.get(zone);
}
export function zonedParts(date,zone){const result={};for(const p of formatter(zone).formatToParts(date))if(p.type!=="literal")result[p.type]=Number(p.value);return result;}
export function calendarDateValid(day){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(day||""))return false;
  const [y,m,d]=day.split("-").map(Number),v=new Date(Date.UTC(y,m-1,d));
  return y>=1899&&y<=2101&&v.getUTCFullYear()===y&&v.getUTCMonth()===m-1&&v.getUTCDate()===d;
}
export function zonedDay(date,zone){const p=zonedParts(date,zone);return `${p.year}-${String(p.month).padStart(2,"0")}-${String(p.day).padStart(2,"0")}`;}
export function shiftCivilDay(day,delta){const v=new Date(`${day}T12:00:00Z`);v.setUTCDate(v.getUTCDate()+delta);return v.toISOString().slice(0,10);}
export function zonedDateCandidates(day,hour,zone){
  if(!calendarDateValid(day)||!Number.isFinite(hour)||hour<0||hour>=24||!validTimeZone(zone))return [];
  const [y,m,d]=day.split("-").map(Number),minutes=Math.round(hour*60),h=Math.floor(minutes/60),min=minutes%60;
  if(h>23)return [];
  const wall=Date.UTC(y,m-1,d,h,min),offsets=new Set();
  // Sample both sides of a civil-time transition, then round-trip each candidate.
  // This catches gaps and both copies of an autumn overlap without inventing UTC.
  for(const shift of [-36,-12,0,12,36]){
    const instant=wall+shift*3600000,p=zonedParts(new Date(instant),zone);
    offsets.add(Date.UTC(p.year,p.month-1,p.day,p.hour,p.minute,p.second)-instant);
  }
  return [...offsets].map(offset=>new Date(wall-offset)).filter(v=>{
    const p=zonedParts(v,zone);return p.year===y&&p.month===m&&p.day===d&&p.hour===h&&p.minute===min;
  }).sort((a,b)=>a-b);
}
export function dateInZone(day,hour,zone,{disambiguation="earlier"}={}){
  const candidates=zonedDateCandidates(day,hour,zone);
  if(disambiguation==="reject"&&candidates.length!==1)return null;
  return (disambiguation==="later"?candidates.at(-1):candidates[0])||null;
}
export function civilMidnight(day,zone){
  // Some zones skip midnight. Use the first real minute of that civil date.
  // Entire skipped dates have no midnight and are rejected.
  const midnight=dateInZone(day,0,zone);if(midnight)return midnight;
  for(let hour=1;hour<24;hour++){
    if(!dateInZone(day,hour,zone))continue;
    let a=(hour-1)*60,b=hour*60;while(b-a>1){const m=Math.floor((a+b)/2);if(dateInZone(day,m/60,zone))b=m;else a=m;}
    return dateInZone(day,b/60,zone);
  }
  return null;
}
export function nextCivilBoundary(day,zone){
  // For an interval's end, a dateline reform can skip a whole civil date.
  // This never makes that nonexistent date selectable as an observation day.
  for(let i=0;i<3;i++){const value=civilMidnight(shiftCivilDay(day,i),zone);if(value)return value;}
  return null;
}
