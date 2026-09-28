import React,{useLayoutEffect,useRef} from 'react';
import {TmIcon} from './icons.jsx';

// Pure presentation: follows Practice without subscribing to its personal store.
export function TogetherText({value,rows=1,...props}) {
  const ref=useRef(null);
  useLayoutEffect(()=>{
    const element=ref.current;
    const resize=()=>{if(!element?.getClientRects().length||!element.clientWidth)return;element.style.height='auto';element.style.height=`${element.scrollHeight+2}px`;};
    resize();
    let width=0;
    const observer=new ResizeObserver(()=>{const next=element.clientWidth;if(next!==width){width=next;resize();}});
    observer.observe(element);
    document.addEventListener('toggle',resize,true);
    window.addEventListener('resize',resize);
    return()=>{observer.disconnect();document.removeEventListener('toggle',resize,true);window.removeEventListener('resize',resize);};
  },[value]);
  return <textarea {...props} ref={ref} value={value} rows={rows}/>;
}

export function TogetherFold({title,children,className='',summaryRef,...props}) {
  return <details {...props} className={`tg-section-fold ${className}`}><summary ref={summaryRef}><span>{title}</span><TmIcon id="forward" size={14} className="tg-fold-arrow"/></summary><div className="tg-fold-body">{children}</div></details>;
}
