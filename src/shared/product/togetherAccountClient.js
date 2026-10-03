import {readTogetherResponse} from './togetherResponse.js';

// Capture the owner of this workspace, never adopt a freshly signed-in owner
// for a request that already contains the previous person's draft.
export function createTogetherAccountRequest({accountKey,verified,refresh,fetcher=(...args)=>fetch(...args)}) {
  const assertOwner=()=>{if(!accountKey||!verified(accountKey))throw new Error('account-changed');};
  return async(url,init={})=>{
    if(!accountKey)throw new Error('sign-in-required');
    if(!verified(accountKey))await refresh();
    assertOwner();
    const headers=new Headers(init.headers||{});
    headers.set('X-Tanmay-Account-Key',accountKey);
    try{
      const response=await fetcher(url,{...init,headers,credentials:'same-origin',redirect:'manual',cache:'no-store'});
      assertOwner();
      const data=await readTogetherResponse(response);
      assertOwner();
      return data;
    }catch(error){
      if(['account-changed','sign-in-required','unauthorized'].includes(error.message))void refresh();
      throw error;
    }
  };
}
