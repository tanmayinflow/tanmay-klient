import {defaultPersonalProfile} from './personalProfile.js';

// A focus check keeps the last verified identity mounted, but never writable.
// Explicit logout/account change clears it immediately. Request generations stop
// a late response from reviving an identity that has since been invalidated.
export function createPersonalProfileClient(fetcher=(...args)=>fetch(...args)){
  let state={profile:defaultPersonalProfile(),accountKey:null,revision:0,status:'loading',error:''},pending=null,generation=0;
  const subscribers=new Set();
  const publish=next=>{state={...state,...next};for(const callback of subscribers)callback();};
  const verified=accountKey=>Boolean(accountKey&&state.accountKey===accountKey&&state.status==='ready');
  async function request(method='GET',body){
    const response=await fetcher('/api/personal-profile',{method,credentials:'same-origin',headers:body?{'Content-Type':'application/json'}:{},...(body?{body:JSON.stringify(body)}:{})});
    let data;try{data=await response.json();}catch{throw new Error('unavailable');}
    if(!response.ok||!data.ok)throw new Error(data.error||'unavailable');
    return data;
  }
  function refresh(){
    if(pending)return pending;
    const version=generation;
    publish({status:state.accountKey?'checking':'loading',error:''});
    pending=request().then(data=>{if(version===generation)publish({...data,status:'ready',error:''});})
      .catch(error=>{if(version===generation)publish({...(error.message==='unauthorized'||error.message==='account-changed'?{profile:defaultPersonalProfile(),accountKey:null,revision:0}:{}),status:'error',error:error.message});})
      .finally(()=>{if(version===generation)pending=null;});
    return pending;
  }
  function verify(){
    if(pending)return pending;
    generation++;
    return refresh();
  }
  function invalidate(){generation++;pending=null;publish({profile:defaultPersonalProfile(),accountKey:null,revision:0,status:'loading',error:''});}
  async function update(patch,options={}){
    if(!verified(options.accountKey||state.accountKey))throw new Error('unauthorized');
    const version=generation,accountKey=state.accountKey;
    const data=await request('PUT',{profile:{...state.profile,...patch},revision:Number.isInteger(options.revision)?options.revision:state.revision,accountKey});
    if(version!==generation||!verified(accountKey)||data.accountKey!==accountKey)throw new Error('account-changed');
    publish({...data,status:'ready',error:''});return data.profile;
  }
  return {getSnapshot:()=>state,subscribe:callback=>{subscribers.add(callback);return()=>subscribers.delete(callback);},refresh,verify,invalidate,update,verified};
}
