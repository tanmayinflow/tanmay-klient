import React, {createContext, useContext, useEffect, useRef} from "react";

const GuideRequest = createContext(null);
export function GuideNavigationProvider({request,children}) {
  return <GuideRequest.Provider value={request}>{children}</GuideRequest.Provider>;
}

// A guide may reveal a view, never write a record or change a permission.
// The request survives navigation so a newly mounted page receives it too.
export function useGuideAction(room,handler) {
  const request=useContext(GuideRequest), callback=useRef(handler),last=useRef(null);
  callback.current=handler;
  useEffect(()=>{
    if(!request||request.room!==room||last.current===request)return;
    last.current=request;
    callback.current(request.action);
  },[request,room]);
}
