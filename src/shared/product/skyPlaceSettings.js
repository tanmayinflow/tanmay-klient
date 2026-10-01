import {emptySkyJournal} from "./skyJournal.js";
const DEFAULT_BIRTH_ZONE=emptySkyJournal().settings.birth.timeZone;
// Birth coordinates describe a fixed event. They never follow travel implicitly.
export function skyBirthHasPlace(birth={}){
  return Boolean(birth.place?.trim()||birth.latitude!==""&&birth.latitude!=null||birth.longitude!==""&&birth.longitude!=null);
}
export function skySamePlace(location={},birth={}){
  return birth.latitude!==""&&birth.longitude!==""&&Number(location.latitude)===Number(birth.latitude)&&Number(location.longitude)===Number(birth.longitude)&&location.timeZone===birth.timeZone;
}
export function skyBirthUsesObservation(settings){
  const {birth={},location={}}=settings;
  if(birth.locationMode==="independent")return false;
  if(!skyBirthHasPlace(birth))return !(birth.timeZone&&birth.timeZone!==location.timeZone&&(birth.date||birth.timeZone!==DEFAULT_BIRTH_ZONE));
  return skySamePlace(location,birth);
}
export function skyBirthAtLocation(birth,location){
  return {...birth,place:location.name,latitude:location.latitude,longitude:location.longitude,timeZone:location.timeZone,locationMode:"same"};
}
export function skyChangeObservation(settings,location,{preserveBirth=false}={}){
  const same=skyBirthUsesObservation(settings);
  const birth=same?(preserveBirth&&skyBirthHasPlace(settings.birth)&&!skySamePlace(location,settings.birth)?{...settings.birth,locationMode:"independent"}:skyBirthAtLocation(settings.birth,location)):settings.birth;
  return {...settings,location:{name:location.name,latitude:location.latitude,longitude:location.longitude,timeZone:location.timeZone},birth};
}
export function skyPreparePlaceSettings(settings){
  return skyBirthUsesObservation(settings)?{...settings,birth:skyBirthAtLocation(settings.birth,settings.location)}:settings;
}
