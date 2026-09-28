import {MoonPhase,Illumination,Body,EclipticGeoMoon,SearchMoonPhase} from "astronomy-engine";
export const MOON_NAMES=[["Nov","New moon"],["Dorůstající srpek","Waxing crescent"],["První čtvrť","First quarter"],["Dorůstající Měsíc","Waxing gibbous"],["Úplněk","Full moon"],["Ubývající Měsíc","Waning gibbous"],["Poslední čtvrť","Last quarter"],["Ubývající srpek","Waning crescent"]];
export const ZODIAC=[["Beran","Aries"],["Býk","Taurus"],["Blíženci","Gemini"],["Rak","Cancer"],["Lev","Leo"],["Panna","Virgo"],["Váhy","Libra"],["Štír","Scorpio"],["Střelec","Sagittarius"],["Kozoroh","Capricorn"],["Vodnář","Aquarius"],["Ryby","Pisces"]];
export function moonToday(date=new Date()) {
  const angle=MoonPhase(date),phase=angle/360,index=Math.round(phase*8)%8;
  const nextAngle=(Math.floor(angle/90)+1)*90%360;
  return {phase,index,light:Math.round(Illumination(Body.Moon,date).phase_fraction*100),sign:Math.floor(EclipticGeoMoon(date).lon/30)%12,quarter:Math.floor(angle/90),nextIndex:nextAngle/45,next:SearchMoonPhase(nextAngle,date,10)?.date.toISOString()||null};
}
export {LUNAR_REFLECTIONS,ZODIAC_REFLECTIONS,LUNAR_SOURCES} from "./togetherMoonEditorial.js";
