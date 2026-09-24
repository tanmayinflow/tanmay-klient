import { ROOM_COPY } from "./rooms.js";
export const MAIN_ROOMS = ["praxe","trenink","denik","kompas","zapisnik","prameny","spolu","klienti","hospodareni","socsite","memento","mandala","oblasti","cile","atomic","kos"];
export const CLIENT_ROOMS = ["praxe","trenink","terminy","kompas","prameny","spolu","denik","zapisnik","memento","oblasti","cile","atomic","kos"];
export const DEFAULT_MAIN_DOCK = ["trenink","denik","kompas","praxe","zapisnik","prameny"];
export function roomPlacement(config,key,defaults) {
  const row=config?.rooms?.[key];
  return {hidden:row?.hidden===true,sidebar:row?.sidebar===undefined?defaults.sidebar.includes(key):!!row.sidebar,dock:row?.dock===undefined?defaults.dock.includes(key):!!row.dock};
}
export function navigationRooms(config,keys,defaults,place) {
  const requested=Array.isArray(config?.order)?config.order:[];
  const order=[...new Set([...requested.filter(k=>keys.includes(k)),...keys])];
  return order.filter(key=>{const v=roomPlacement(config,key,defaults);return !v.hidden&&v[place];});
}
export function updatePlacement(config,key,patch,keys,defaults) {
  if(!keys.includes(key))return config||{};
  const current=roomPlacement(config,key,defaults);
  return {...config,rooms:{...config?.rooms,[key]:{...current,...patch}}};
}
export function navigationLabel(key,lang) {return ROOM_COPY[key]?.[lang==="en"?"en":"cz"]||key;}
