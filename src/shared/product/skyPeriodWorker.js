import {initAstrologyEngine} from "./togetherAstrology.js";
import {astrologyPeriod} from "./togetherAstrologyOverview.js";
import {eclipsesBetween,solarSeasonsBetween} from "./togetherAstrologyCalendar.js";
self.onmessage=async event=>{
  const {day,lens,range,options}=event.data;
  try{await initAstrologyEngine();const base=astrologyPeriod(day,lens,range,options),start=new Date(base.start),end=new Date(base.end);const period={...base,eclipses:eclipsesBetween(start,end,options?.location),seasons:solarSeasonsBetween(start,end)};self.postMessage({period});}
  catch(error){self.postMessage({error:error instanceof Error?error.message:"calculation-failed"});}
};
