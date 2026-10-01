// Horizon height varies smoothly across a daily culmination. A fixed grid can
// miss both crossings of a short polar day (or night). Refine every bracketed
// extremum, including brackets that extend beyond the requested time window.
// Golden-section refinement uses only our caller's altitude convention.
export function horizonSamples(fn,start,end,step){
  const values=new Map(),value=t=>{if(!values.has(t))values.set(t,fn(t));return values.get(t);};
  const grid=[];
  for(let t=start-step;t<=end+step;t+=step)grid.push(t);
  if(grid.at(-1)<end+step)grid.push(end+step);
  const points=new Set([start,end,...grid.filter(t=>t>start&&t<end)]);
  const ratio=(Math.sqrt(5)-1)/2;
  for(let i=1;i<grid.length-1;i++){
    const left=grid[i-1],middle=grid[i],right=grid[i+1],a=value(left),b=value(middle),c=value(right);
    const sign=b>a&&b>=c?1:b<a&&b<=c?-1:0;
    if(!sign)continue;
    let lo=left,hi=right,x=hi-ratio*(hi-lo),y=lo+ratio*(hi-lo),fx=sign*value(x),fy=sign*value(y);
    while(hi-lo>100){
      if(fx<fy){lo=x;x=y;fx=fy;y=lo+ratio*(hi-lo);fy=sign*value(y);}
      else{hi=y;y=x;fy=fx;x=hi-ratio*(hi-lo);fx=sign*value(x);}
    }
    const time=(lo+hi)/2;if(time>start&&time<end)points.add(time);
  }
  return [...points].sort((a,b)=>a-b).map(time=>({time,value:value(time)}));
}
