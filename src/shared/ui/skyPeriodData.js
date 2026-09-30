import {useEffect,useState} from "react";
const cache=new Map();
// Long event searches run off the UI thread. A changed range cancels the old
// worker rather than allowing outdated scans to queue behind it.
export function useSkyPeriod(day,lens,range,options={},enabled=true){
  const locationKey=JSON.stringify(options.location||null),key=JSON.stringify([day,lens,range,options.timeZone,options.nodeMode,locationKey]);
  const [state,setState]=useState({key:null,period:null,error:null});
  useEffect(()=>{
    if(!enabled||!day)return;
    if(cache.has(key)){setState({key,period:cache.get(key),error:null});return;}
    let active=true;const worker=new Worker(new URL("../product/skyPeriodWorker.js",import.meta.url),{type:"module"});
    worker.onmessage=event=>{if(!active)return;const {period,error}=event.data;if(period){cache.set(key,period);if(cache.size>12)cache.delete(cache.keys().next().value);}setState({key,period:period||null,error:error||null});worker.terminate();};
    worker.onerror=()=>{if(active)setState({key,period:null,error:"worker-failed"});worker.terminate();};
    worker.postMessage({day,lens,range,options:{timeZone:options.timeZone,nodeMode:options.nodeMode,location:JSON.parse(locationKey)}});
    return()=>{active=false;worker.terminate();};
  },[key,enabled,day,lens,range,options.timeZone,options.nodeMode,locationKey]);
  return state.key===key?state:{key,period:null,error:null};
}
