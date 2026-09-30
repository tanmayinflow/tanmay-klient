import {skyTradition,skyZodiac} from "./skyTraditions.js";
// Private, account-scoped observation data. Never included in partner projections.
export const SKY_STORAGE_VERSION=1;
export const SKY_PRACTICE_DAYS=[8,10,15,23,25,29,30];
export const SKY_QUOTES=[
  "The inner peace is now. Because there will be always some later.",
  "Every moment is fresh. Every moment is a new life. Every moment is fresh.",
  "Remember, the practice is every moment of your life.",
  "Don't waste your time. Don't waste your time doing useless things.",
  "So you understand that the only thing that is permanent is impermanence.",
  "Your harsh discipline is to enjoy your day.",
  "Don't do what you must. Do what you enjoy.",
  "Money leave me. People leave me. Anything leave me. Breath never leave me.",
];
export function emptySkyJournal(){return {version:SKY_STORAGE_VERSION,revision:0,settings:{
  location:{name:"Praha",latitude:50.0755,longitude:14.4378,timeZone:"Europe/Prague"},
  birth:{date:"",time:"",timeKnown:false,place:"",latitude:"",longitude:"",timeZone:"Europe/Prague"},
  tradition:"western",tibetanEnabled:false,zodiac:"tropical",nodes:"mean",traditions:{jyotish:true,hellenistic:true,western:true},
  practiceDays:[...SKY_PRACTICE_DAYS],modules:{swara:false,cycle:false,dream:true,dice:true},
  practices:{guru:true,dzambhala:true,protector:true,vajrayogini:false,mercury:true,eclipses:true,weeklyDay:0},
  notifications:false,
},nostrils:[],dreams:[],decisions:[],practice:{},intentions:{}};}
export function validTimeZone(value){try{new Intl.DateTimeFormat("en",{timeZone:value}).format();return typeof value==="string"&&value.length<100;}catch{return false;}}
const cleanText=(value,max=4000)=>typeof value==="string"?value.slice(0,max):"";
const isInstant=value=>Number.isFinite(value)&&value>0;
export function skyDateKey(instant=Date.now(),timeZone="Europe/Prague"){
  const parts=Object.fromEntries(new Intl.DateTimeFormat("en-CA",{timeZone,year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date(instant)).map(p=>[p.type,p.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}
export function addSkyDays(day,count){const d=new Date(`${day}T12:00:00Z`);if(!Number.isFinite(d.getTime()))return null;d.setUTCDate(d.getUTCDate()+count);return d.toISOString().slice(0,10);}
export function skyStorageKey(accountKey){if(typeof accountKey!=="string"||!accountKey.trim())throw new Error("account-required");return `tm-sky:v1:${encodeURIComponent(accountKey)}`;}
export function parseSkyJournal(value){
  if(value==null||value==="")return emptySkyJournal();
  let raw;try{raw=typeof value==="string"?JSON.parse(value):value;}catch{throw new Error("unreadable-journal");}
  if(!raw||raw.version!==SKY_STORAGE_VERSION||!Number.isSafeInteger(raw.revision)||raw.revision<0)throw new Error("unsupported-journal");
  const base=emptySkyJournal(),s=raw.settings||{},loc=s.location||{},birth=s.birth||{};
  const latitude=Number(loc.latitude),longitude=Number(loc.longitude);
  const location=Number.isFinite(latitude)&&Math.abs(latitude)<=90&&Number.isFinite(longitude)&&Math.abs(longitude)<=180&&validTimeZone(loc.timeZone)?{name:cleanText(loc.name,120),latitude,longitude,timeZone:loc.timeZone}:base.settings.location;
  return {...base,revision:raw.revision,settings:{...base.settings,...s,location,
    tradition:skyTradition(s.tradition),tibetanEnabled:s.tibetanEnabled===true,
    zodiac:["tropical","sidereal"].includes(s.zodiac)?s.zodiac:skyZodiac(skyTradition(s.tradition)),nodes:s.nodes==="true"?"true":"mean",
    birth:{...base.settings.birth,...birth,timeKnown:birth.timeKnown===true},
    traditions:{...base.settings.traditions,...s.traditions},modules:{...base.settings.modules,...s.modules},practices:{...base.settings.practices,...s.practices},
    practiceDays:Array.isArray(s.practiceDays)?s.practiceDays.filter(n=>SKY_PRACTICE_DAYS.includes(n)):base.settings.practiceDays,
  },nostrils:Array.isArray(raw.nostrils)?raw.nostrils.filter(n=>isInstant(n.time)&&["left","right","both","unknown"].includes(n.side)):[],
  dreams:Array.isArray(raw.dreams)?raw.dreams.filter(n=>isInstant(n.time)&&typeof n.text==="string"):[],
  decisions:Array.isArray(raw.decisions)?raw.decisions.filter(n=>isInstant(n.time)&&typeof n.question==="string"):[],
  practice:raw.practice&&typeof raw.practice==="object"&&!Array.isArray(raw.practice)?raw.practice:{},
  intentions:raw.intentions&&typeof raw.intentions==="object"&&!Array.isArray(raw.intentions)?raw.intentions:{}};
}
export function saveSkyJournal(storage,accountKey,current,transform){
  const key=skyStorageKey(accountKey),latest=parseSkyJournal(storage.getItem(key));
  if(latest.revision!==current.revision)throw new Error("journal-conflict");
  const next=parseSkyJournal({...transform(current),version:SKY_STORAGE_VERSION,revision:current.revision+1});
  storage.setItem(key,JSON.stringify(next));return next;
}
export function canCastSkyDecision(observation,now=Date.now()){
  return Boolean(observation&&observation.side==="both"&&observation.comfort===true&&now>=observation.time&&now-observation.time<=5*60000);
}
export function fairSkyChoice(count,random=globalThis.crypto){
  if(!Number.isInteger(count)||count<2||count>6||!random?.getRandomValues)throw new Error("invalid-choice");
  const max=2**32,limit=max-max%count,buffer=new Uint32Array(1);let value;
  do{random.getRandomValues(buffer);value=buffer[0];}while(value>=limit);
  return value%count;
}
export function makeSkyDecision({question,options,observation,timeZone,now=Date.now(),random=globalThis.crypto,id}){
  const choices=options.map(v=>cleanText(v,200).trim()).filter(Boolean),q=cleanText(question,1000).trim();
  if(!q||choices.length<2||choices.length>6||new Set(choices).size!==choices.length)throw new Error("invalid-choice");
  if(!canCastSkyDecision(observation,now))throw new Error("observation-required");
  if(!validTimeZone(timeZone))throw new Error("invalid-time-zone");
  return {id:id||random.randomUUID(),question:q,options:choices,result:fairSkyChoice(choices.length,random),time:now,timeZone,
    observation:{side:observation.side,comfort:true,time:observation.time},reviewDate:addSkyDays(skyDateKey(now,timeZone),21),review:"",decision:""};
}
export function dueSkyDecisions(journal,now=Date.now()){
  return journal.decisions.filter(d=>d.result!=null&&!d.review&&d.reviewDate&&d.reviewDate<=skyDateKey(now,d.timeZone));
}
export function expectedSkyNostril(tithi){
  if(!Number.isInteger(tithi)||tithi<1||tithi>30)return null;
  const d=(tithi-1)%15+1,left=[1,2,3,7,8,9,13,14,15].includes(d);
  return (tithi<=15?left:!left)?"left":"right";
}
export function skyQuote(day){const index=Math.floor(Date.parse(`${day}T12:00:00Z`)/86400000);return SKY_QUOTES[((index%SKY_QUOTES.length)+SKY_QUOTES.length)%SKY_QUOTES.length];}
